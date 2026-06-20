import { NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { activatePremium } from "@/lib/action/premium";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  const body = await req.text();
  const headersList = await headers();
  const sig = headersList.get("stripe-signature");

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const userId = session.metadata?.userId;

    if (userId) {
      const result = await activatePremium(userId);
      if (!result.success) {
        console.error("⚠️ Premium activation failed for:", userId);
      } else {
        console.log("✅ Premium activated for:", userId);
      }
    }
  }

  return NextResponse.json({ received: true });
}

export const config = { api: { bodyParser: false } };
