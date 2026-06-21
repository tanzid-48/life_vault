import { getSession } from "@/lib/auth-session";
import {
  Check,
  X,
  Star,
  Zap,
  Shield,
  Sparkles,
  BadgeCheck,
} from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Pricing | LifeVault",
  description: "Choose the plan that fits your wisdom journey.",
};

const FREE_FEATURES = [
  { label: "Create up to 5 lessons/month", included: true },
  { label: "Browse public lessons", included: true },
  { label: "Save to favorites", included: true },
  { label: "Basic profile page", included: true },
  { label: "Premium lesson access", included: false },
  { label: "Ad-free experience", included: false },
  { label: "Priority listing", included: false },
  { label: "Unlimited lesson creation", included: false },
  { label: "Verified community badge", included: false },
];

const PREMIUM_FEATURES = [
  { label: "Unlimited lesson creation", included: true },
  { label: "Browse public lessons", included: true },
  { label: "Save to favorites", included: true },
  { label: "Premium profile page", included: true },
  { label: "Premium lesson access", included: true },
  { label: "Ad-free experience", included: true },
  { label: "Priority listing", included: true },
  { label: "Verified community badge ⭐", included: true },
  { label: "Early access to new features", included: true },
];

const COMPARISON = [
  { feature: "Lesson Creation", free: "5/month", premium: "Unlimited" },
  { feature: "Browse Public Lessons", free: true, premium: true },
  { feature: "Save to Favorites", free: true, premium: true },
  { feature: "Premium Lesson Access", free: false, premium: true },
  { feature: "Ad-free Experience", free: false, premium: true },
  { feature: "Priority Listing", free: false, premium: true },
  { feature: "Verified Badge", free: false, premium: "⭐ Included" },
  { feature: "Unlimited Creation", free: false, premium: true },
  { feature: "Early Feature Access", free: false, premium: true },
];

function FeatureRow({ label, included }) {
  return (
    <div className="flex items-center gap-3 py-2">
      <div
        className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
          included
            ? "bg-emerald-500/10 border border-emerald-500/25"
            : "bg-white/[0.04] border border-white/10"
        }`}
      >
        {included ? (
          <Check className="w-3 h-3 text-emerald-400" />
        ) : (
          <X className="w-3 h-3 text-white/25" />
        )}
      </div>
      <span
        className={`text-sm ${included ? "text-white/80" : "text-white/30 line-through"}`}
      >
        {label}
      </span>
    </div>
  );
}

function CompareCell({ value }) {
  if (value === true)
    return <Check className="w-5 h-5 text-emerald-400 mx-auto" />;
  if (value === false) return <X className="w-4 h-4 text-white/20 mx-auto" />;
  return <span className="text-xs font-semibold text-violet-300">{value}</span>;
}

export default async function PricingPage() {
  const session = await getSession();
  const user = session?.user ?? null;
  const isPremium = user?.isPremium === true;

  return (
    <div className="min-h-screen bg-[#080810] py-16 px-4">
      <div className="max-w-5xl mx-auto flex flex-col gap-16">
        {/* ── Header ── */}
        <div className="text-center flex flex-col gap-4">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mx-auto"
            style={{
              backgroundColor: "rgba(139,92,246,0.08)",
              border: "1px solid rgba(139,92,246,0.2)",
            }}
          >
            <Sparkles className="w-3.5 h-3.5 text-violet-400" />
            <span className="text-xs font-semibold text-violet-300 uppercase tracking-widest">
              Pricing
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
            {isPremium ? "You're on Premium" : "Simple, honest pricing"}
          </h1>
          <p className="text-base text-white/40 max-w-md mx-auto leading-relaxed">
            {isPremium
              ? "Thanks for supporting LifeVault — every premium feature is unlocked on your account."
              : "Start free forever. Upgrade when you're ready to unlock the full LifeVault experience."}
          </p>
        </div>

        {/* ── Plan Cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto w-full">
          {/* Free Plan */}
          <div
            className="flex flex-col rounded-3xl p-7 gap-6"
            style={{
              backgroundColor: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            {/* Plan header */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  <Zap className="w-4 h-4 text-white/50" />
                </div>
                <span className="text-sm font-bold text-white/60 uppercase tracking-widest">
                  Free
                </span>
              </div>
              <div className="flex items-end gap-2">
                <span className="text-5xl font-black text-white">$0</span>
                <span className="text-white/30 text-sm mb-2">/ forever</span>
              </div>
              <p className="text-sm text-white/35 mt-2">
                Perfect for getting started with your wisdom journey.
              </p>
            </div>

            {/* Features */}
            <div className="flex flex-col gap-0.5 flex-1">
              {FREE_FEATURES.map((f, i) => (
                <FeatureRow key={i} label={f.label} included={f.included} />
              ))}
            </div>

            {/* CTA — তিনটা state: guest / free user / premium user */}
            {!user ? (
              <Link
                href="/signup"
                className="w-full h-12 rounded-xl flex items-center justify-center text-sm font-bold transition-all hover:bg-white/10 active:scale-95"
                style={{
                  backgroundColor: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "rgba(255,255,255,0.6)",
                }}
              >
                Get Started Free
              </Link>
            ) : isPremium ? (
              <div
                className="w-full h-12 rounded-xl flex items-center justify-center text-sm font-semibold"
                style={{
                  backgroundColor: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  color: "rgba(255,255,255,0.3)",
                }}
              >
                Included in Premium
              </div>
            ) : (
              <div
                className="w-full h-12 rounded-xl flex items-center justify-center text-sm font-bold"
                style={{
                  backgroundColor: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "rgba(255,255,255,0.6)",
                }}
              >
                ✓ Your Current Plan
              </div>
            )}
          </div>

          {/* Premium Plan */}
          <div
            className="flex flex-col rounded-3xl p-7 gap-6 relative overflow-hidden"
            style={{
              background:
                "linear-gradient(135deg, rgba(139,92,246,0.12), rgba(99,102,241,0.06))",
              border: "1px solid rgba(139,92,246,0.3)",
            }}
          >
            {/* Popular / Active badge */}
            <div className="absolute top-5 right-5">
              {isPremium ? (
                <span
                  className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider"
                  style={{
                    background: "linear-gradient(135deg, #34d399, #059669)",
                    color: "#000",
                  }}
                >
                  <BadgeCheck className="w-3 h-3" /> Active
                </span>
              ) : (
                <span
                  className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider"
                  style={{
                    background: "linear-gradient(135deg, #fbbf24, #f59e0b)",
                    color: "#000",
                  }}
                >
                  <Star className="w-3 h-3" /> Popular
                </span>
              )}
            </div>

            {/* Glow */}
            <div
              className="absolute -top-20 -right-20 w-40 h-40 rounded-full pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)",
              }}
            />

            {/* Plan header */}
            <div className="relative">
              <div className="flex items-center gap-2 mb-4">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(139,92,246,0.3), rgba(99,102,241,0.2))",
                    border: "1px solid rgba(139,92,246,0.4)",
                  }}
                >
                  <Shield className="w-4 h-4 text-violet-400" />
                </div>
                <span className="text-sm font-bold text-violet-300 uppercase tracking-widest">
                  Premium
                </span>
              </div>
              <div className="flex items-end gap-2">
                <span className="text-5xl font-black text-white">৳1500</span>
                <span className="text-white/40 text-sm mb-2">/ lifetime</span>
              </div>
              <p className="text-sm text-white/50 mt-2">
                {isPremium
                  ? "You already have lifetime access — thank you!"
                  : "Unlock the full power of LifeVault for serious learners."}
              </p>
            </div>

            {/* Features */}
            <div className="flex flex-col gap-0.5 flex-1 relative">
              {PREMIUM_FEATURES.map((f, i) => (
                <FeatureRow key={i} label={f.label} included={f.included} />
              ))}
            </div>

            {/* CTA — তিনটা state: guest / free user / premium user */}
            {isPremium ? (
              <div
                className="flex items-center justify-center gap-2 px-8 h-12 rounded-xl text-sm font-bold"
                style={{
                  backgroundColor: "rgba(52,211,153,0.1)",
                  color: "#34d399",
                  border: "1px solid rgba(52,211,153,0.25)",
                }}
              >
                <BadgeCheck className="w-4 h-4" /> You&apos;re Premium ⭐
              </div>
            ) : user ? (
              <form action="/api/checkout_sessions" method="POST">
                <button
                  type="submit"
                  role="link"
                  className="w-full flex items-center justify-center gap-2 px-8 h-12 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 active:scale-95"
                  style={{
                    background: "linear-gradient(135deg, #7c3aed, #6d28d9)",
                    boxShadow: "0 4px 24px rgba(139,92,246,0.4)",
                  }}
                >
                  ⭐ Upgrade to Premium — ৳1500
                </button>
              </form>
            ) : (
              <Link
                href="/signin?redirect=/pricing"
                className="w-full flex items-center justify-center gap-2 px-8 h-12 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 active:scale-95"
                style={{
                  background: "linear-gradient(135deg, #7c3aed, #6d28d9)",
                  boxShadow: "0 4px 24px rgba(139,92,246,0.4)",
                }}
              >
                Sign in to Upgrade
              </Link>
            )}
          </div>
        </div>

        {/* ── Comparison Table ── */}
        <div className="flex flex-col gap-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white">Full comparison</h2>
            <p className="text-sm text-white/35 mt-1">
              See exactly what you get with each plan
            </p>
          </div>

          <div
            className="rounded-2xl overflow-hidden"
            style={{ border: "1px solid rgba(255,255,255,0.08)" }}
          >
            {/* Table header */}
            <div
              className="grid grid-cols-3 px-6 py-4"
              style={{
                backgroundColor: "rgba(255,255,255,0.03)",
                borderBottom: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <p className="text-xs font-bold uppercase tracking-widest text-white/30">
                Feature
              </p>
              <p className="text-xs font-bold uppercase tracking-widest text-white/30 text-center">
                Free
              </p>
              <p className="text-xs font-bold uppercase tracking-widest text-violet-400 text-center">
                Premium
              </p>
            </div>

            {/* Rows */}
            {COMPARISON.map((row, i) => (
              <div
                key={i}
                className="grid grid-cols-3 items-center px-6 py-4 transition-colors hover:bg-white/[0.02]"
                style={{
                  borderBottom:
                    i < COMPARISON.length - 1
                      ? "1px solid rgba(255,255,255,0.05)"
                      : "none",
                }}
              >
                <p className="text-sm text-white/70">{row.feature}</p>
                <div className="flex justify-center">
                  <CompareCell value={row.free} />
                </div>
                <div className="flex justify-center">
                  <CompareCell value={row.premium} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Bottom CTA — premium হলে আলাদা message, কোনো checkout button নেই ── */}
        <div
          className="flex flex-col items-center gap-5 text-center py-8 rounded-3xl"
          style={{
            background:
              "linear-gradient(135deg, rgba(139,92,246,0.08), rgba(99,102,241,0.04))",
            border: "1px solid rgba(139,92,246,0.15)",
          }}
        >
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center"
            style={{
              background: isPremium
                ? "linear-gradient(135deg, rgba(52,211,153,0.2), rgba(5,150,105,0.1))"
                : "linear-gradient(135deg, rgba(139,92,246,0.2), rgba(99,102,241,0.1))",
              border: `1px solid ${isPremium ? "rgba(52,211,153,0.3)" : "rgba(139,92,246,0.3)"}`,
            }}
          >
            {isPremium ? (
              <BadgeCheck className="w-6 h-6 text-emerald-400" />
            ) : (
              <Sparkles className="w-6 h-6 text-violet-400" />
            )}
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">
              {isPremium
                ? "You're all set!"
                : "Ready to unlock your full potential?"}
            </h3>
            <p className="text-sm text-white/40 mt-1.5 max-w-md">
              {isPremium
                ? "Go write your next lesson, or explore premium content from other members."
                : "Join thousands of learners preserving and sharing life's most important lessons."}
            </p>
          </div>
          <div className="flex items-center gap-3 flex-wrap justify-center">
            {!isPremium && (
              <form action="/api/checkout_sessions" method="POST">
                <button
                  type="submit"
                  role="link"
                  className="flex items-center gap-2 px-8 h-12 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 active:scale-95"
                  style={{
                    background: "linear-gradient(135deg, #7c3aed, #6d28d9)",
                    boxShadow: "0 4px 24px rgba(139,92,246,0.4)",
                  }}
                >
                  ⭐ Upgrade to Premium — ৳1500
                </button>
              </form>
            )}
            <Link
              href="/lessons"
              className="flex items-center gap-2 px-8 h-12 rounded-xl text-sm font-semibold transition-all hover:bg-white/10"
              style={{
                backgroundColor: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "rgba(255,255,255,0.5)",
              }}
            >
              {isPremium ? "Browse Lessons" : "Explore Free First"}
            </Link>
          </div>
          {!isPremium && (
            <p className="text-xs text-white/25">
              One-time payment · Lifetime access
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
