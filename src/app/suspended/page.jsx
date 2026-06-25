import Link from "next/link";
import { ShieldX, Mail, ArrowLeft } from "lucide-react";
import { signOut } from "@/lib/auth-client";
import SuspendedSignOut from "@/components/dashboard/SuspendedSignOut";

export const metadata = { title: "Account Suspended | LifeVault" };

export default function SuspendedPage() {
  return (
    <div className="min-h-screen bg-[#080810] flex items-center justify-center px-4">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[400px] rounded-full"
          style={{
            background:
              "radial-gradient(ellipse, rgba(239,68,68,0.06) 0%, transparent 70%)",
          }}
        />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center gap-8 max-w-md w-full">
        {/* Icon */}
        <div
          className="w-24 h-24 rounded-3xl flex items-center justify-center"
          style={{
            background:
              "linear-gradient(135deg, rgba(239,68,68,0.15), rgba(239,68,68,0.05))",
            border: "1px solid rgba(239,68,68,0.25)",
            boxShadow: "0 0 60px rgba(239,68,68,0.1)",
          }}
        >
          <ShieldX className="w-12 h-12 text-red-400" />
        </div>

        {/* Text */}
        <div className="flex flex-col gap-3">
          <span className="text-xs font-bold tracking-[4px] uppercase text-red-400/70">
            Account Suspended
          </span>
          <h1 className="text-3xl font-black text-white">
            Your account has been suspended
          </h1>
          <p className="text-sm text-white/45 leading-relaxed max-w-sm mx-auto">
            An admin has temporarily suspended your account. You can still
            browse public lessons, but you cannot create or interact with
            content.
          </p>
        </div>

        {/* What you can / cannot do */}
        <div className="w-full grid grid-cols-2 gap-3">
          <div
            className="flex flex-col gap-3 p-4 rounded-2xl text-left"
            style={{
              backgroundColor: "rgba(52,211,153,0.05)",
              border: "1px solid rgba(52,211,153,0.12)",
            }}
          >
            <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
              ✅ You can
            </p>
            {[
              "Browse public lessons",
              "Read free lessons",
              "View profiles",
            ].map((t) => (
              <p key={t} className="text-xs text-white/50">
                {t}
              </p>
            ))}
          </div>
          <div
            className="flex flex-col gap-3 p-4 rounded-2xl text-left"
            style={{
              backgroundColor: "rgba(239,68,68,0.05)",
              border: "1px solid rgba(239,68,68,0.12)",
            }}
          >
            <p className="text-xs font-bold text-red-400 uppercase tracking-widest">
              ❌ You cannot
            </p>
            {["Create lessons", "Like / Comment", "Access dashboard"].map(
              (t) => (
                <p key={t} className="text-xs text-white/50">
                  {t}
                </p>
              ),
            )}
          </div>
        </div>

        {/* Contact info */}
        <div
          className="w-full flex items-start gap-3 p-4 rounded-2xl text-left"
          style={{
            backgroundColor: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <Mail className="w-5 h-5 text-violet-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-white">Need help?</p>
            <p className="text-xs text-white/40 mt-0.5 leading-relaxed">
              If you think this is a mistake, contact the administrator. Provide
              your email and they can review and restore your account.
            </p>
          </div>
        </div>

        {/* CTAs */}
        <div className="flex items-center gap-3 w-full">
          <Link
            href="/lessons"
            className="flex-1 flex items-center justify-center gap-2 h-11 rounded-xl text-sm font-semibold transition-all hover:bg-white/10"
            style={{
              backgroundColor: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "rgba(255,255,255,0.6)",
            }}
          >
            <ArrowLeft className="w-4 h-4" /> Browse Lessons
          </Link>
          <SuspendedSignOut />
        </div>

        <p className="text-xs text-white/20">
          LifeVault · Account temporarily restricted
        </p>
      </div>
    </div>
  );
}
