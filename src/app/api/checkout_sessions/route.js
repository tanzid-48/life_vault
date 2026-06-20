import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { getSession } from "@/lib/auth-session";

export async function POST() {
  try {
    const session = await getSession();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Already premium?
    if (session.user?.isPremium) {
      return NextResponse.json({ error: "Already premium" }, { status: 400 });
    }

    const headersList = await headers();
    const origin = headersList.get("origin");

    const checkout = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: "price_1TkT2gPJSqrCC1syWXKBHNL8",
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${origin}/pricing/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/pricing/cancel`, // ← cancel page
      metadata: {
        userId,
      },
    });

    return NextResponse.redirect(checkout.url, 303);
  } catch (err) {
    return NextResponse.json(
      { error: err.message },
      { status: err.statusCode || 500 },
    );
  }
}
