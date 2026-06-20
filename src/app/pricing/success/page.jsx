import Link from "next/link";
import { CheckCircle2, Sparkles, BookOpen, ArrowRight } from "lucide-react";

export const metadata = { title: "Payment Successful | LifeVault" };

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-[#080810] flex items-center justify-center px-4">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(52,211,153,0.06) 0%, transparent 70%)",
          }}
        />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center gap-8 max-w-md w-full">
        {/* Icon */}
        <div className="relative">
          <div
            className="w-24 h-24 rounded-3xl flex items-center justify-center"
            style={{
              background:
                "linear-gradient(135deg, rgba(52,211,153,0.2), rgba(16,185,129,0.08))",
              border: "1px solid rgba(52,211,153,0.3)",
            }}
          >
            <CheckCircle2 className="w-12 h-12 text-emerald-400" />
          </div>
          {/* Sparkle decorations */}
        </div>

        {/* Text */}
        <div className="flex flex-col gap-3">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mx-auto"
            style={{
              backgroundColor: "rgba(52,211,153,0.08)",
              border: "1px solid rgba(52,211,153,0.2)",
            }}
          >
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
              Payment Successful
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-white">
            Welcome to Premium! ⭐
          </h1>
          <p className="text-base text-white/45 leading-relaxed">
            You now have lifetime access to all premium lessons, features, and
            your verified community badge.
          </p>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
          <Link
            href="/dashboard"
            className="flex-1 flex items-center justify-center gap-2 h-12 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 active:scale-95"
            style={{
              background: "linear-gradient(135deg, #7c3aed, #6d28d9)",
              boxShadow: "0 4px 24px rgba(139,92,246,0.35)",
            }}
          >
            <BookOpen className="w-4 h-4" /> Go to Dashboard
          </Link>
          <Link
            href="/lessons"
            className="flex-1 flex items-center justify-center gap-2 h-12 rounded-xl text-sm font-semibold transition-all hover:bg-white/10"
            style={{
              backgroundColor: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "rgba(255,255,255,0.5)",
            }}
          >
            Browse Lessons <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <p className="text-xs text-white/20">
          A receipt has been sent to your email via Stripe.
        </p>
      </div>
    </div>
  );
}
