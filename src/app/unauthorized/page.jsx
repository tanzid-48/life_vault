import Link from "next/link";
import { ShieldX, ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getSession } from "@/lib/auth-session";

export const metadata = {
  title: "Unauthorized | Digital Life Lessons",
};

export default async function UnauthorizedPage() {
  const session = await getSession();
  const role = session?.user?.role;

  // Role অনুযায়ী সঠিক dashboard link
  const dashboardHref = role === "admin" ? "/dashboard/admin" : "/dashboard";

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden"
      style={{ backgroundColor: "#080810" }}
    >
      {/* Background glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[400px] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(239,68,68,0.05) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 flex flex-col items-center text-center gap-7 max-w-md w-full">
        {/* Icon */}
        <div
          className="w-24 h-24 rounded-3xl flex items-center justify-center"
          style={{
            background:
              "linear-gradient(135deg, rgba(239,68,68,0.15), rgba(239,68,68,0.05))",
            border: "1px solid rgba(239,68,68,0.25)",
            boxShadow: "0 0 60px rgba(239,68,68,0.08)",
          }}
        >
          <ShieldX className="w-12 h-12 text-red-400" />
        </div>

        {/* Text */}
        <div className="flex flex-col gap-2">
          <p
            className="text-xs font-bold uppercase tracking-[4px]"
            style={{ color: "rgba(239,68,68,0.6)" }}
          >
            Error 401
          </p>
          <h1 className="text-4xl font-black text-white">Unauthorized</h1>
          <p
            className="text-sm leading-relaxed"
            style={{ color: "rgba(255,255,255,0.4)" }}
          >
            You do not have permission to access this page.
            <br />
            Please sign in with the correct account.
          </p>
        </div>

        {/* Info box */}
        <div
          className="w-full flex items-start gap-3 p-4 rounded-2xl text-left"
          style={{
            backgroundColor: "rgba(239,68,68,0.05)",
            border: "1px solid rgba(239,68,68,0.12)",
          }}
        >
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
            style={{
              backgroundColor: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.2)",
            }}
          >
            <ShieldX className="w-4 h-4 text-red-400" />
          </div>
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
            This resource requires different access privileges. If you think
            this is a mistake, contact the administrator.
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 w-full">
          <Button
            asChild
            variant="outline"
            className="flex-1 h-11 border-white/10 bg-white/[0.04] text-white/50 hover:text-white hover:bg-white/[0.07]"
          >
            <Link href="/" className="flex items-center gap-2">
              <Home className="w-4 h-4" /> Go Home
            </Link>
          </Button>
          {session ? (
            <Button
              asChild
              className="flex-1 h-11 bg-violet-600 hover:bg-violet-700 text-white font-bold"
            >
              <Link href={dashboardHref} className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" /> My Dashboard
              </Link>
            </Button>
          ) : (
            <Button
              asChild
              className="flex-1 h-11 bg-violet-600 hover:bg-violet-700 text-white font-bold"
            >
              <Link href="/signin" className="flex items-center gap-2">
                Sign In
              </Link>
            </Button>
          )}
        </div>

        <p className="text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>
          Digital Life Lessons · Access Control
        </p>
      </div>
    </div>
  );
}
