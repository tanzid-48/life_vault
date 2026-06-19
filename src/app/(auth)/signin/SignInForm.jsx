"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { signIn } from "@/lib/auth-client";
import { toast } from "sonner";
import {
  BookOpen,
  Eye,
  EyeOff,
  Loader2,
  LogIn,
  Mail,
  Lock,
} from "lucide-react";

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const isValidEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

// ── Input Field — outside component ──
function InputField({
  id,
  label,
  type,
  placeholder,
  fieldKey,
  icon: Icon,
  value,
  onChange,
  error,
  showPass,
  onTogglePass,
}) {
  return (
    <div className="space-y-1.5">
      <Label
        htmlFor={id}
        className="text-xs font-semibold uppercase tracking-wider text-slate-500"
      >
        {label}
      </Label>
      <div className="relative group">
        {/* Left icon */}
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-violet-500 transition-colors">
          <Icon className="h-4 w-4" />
        </div>
        <input
          id={id}
          type={
            fieldKey === "password" ? (showPass ? "text" : "password") : type
          }
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          autoComplete={fieldKey === "password" ? "current-password" : "email"}
          className={cn(
            "w-full h-12 rounded-xl border pl-10 pr-4 text-sm outline-none transition-all duration-200",
            "bg-slate-50 text-slate-900 placeholder:text-slate-400",
            "hover:border-slate-300 hover:bg-white",
            "focus:bg-white focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400",
            fieldKey === "password" && "pr-11",
            error
              ? "border-red-300 bg-red-50/50 focus:ring-red-500/20 focus:border-red-400"
              : "border-slate-200",
          )}
        />
        {/* Password toggle */}
        {fieldKey === "password" && (
          <button
            type="button"
            tabIndex={-1}
            onClick={onTogglePass}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
          >
            {showPass ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        )}
      </div>
      {error && (
        <p className="text-xs text-red-500 flex items-center gap-1">
          <span className="inline-block w-1 h-1 rounded-full bg-red-500" />
          {error}
        </p>
      )}
    </div>
  );
}

// ── Google SVG ──
const GoogleIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

export default function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/dashboard";

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});

  const set = (key) => (e) => setForm((p) => ({ ...p, [key]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!isValidEmail(form.email)) e.email = "Enter a valid email address";
    if (!form.password) e.password = "Password is required";
    setErrors(e);
    const first = Object.values(e)[0];
    if (first) toast.error(first);
    return !Object.keys(e).length;
  };

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const { error } = await signIn.email({
        email: form.email,
        password: form.password,
      });
      if (error) throw new Error(error.message);
      toast.success("Welcome back! 🎉");
      router.push(redirectTo);
      router.refresh();
    } catch (err) {
      toast.error(err.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setGoogleLoading(true);
    try {
      await signIn.social({ provider: "google", callbackURL: redirectTo });
    } catch {
      toast.error("Google sign-in failed");
      setGoogleLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#080810] from-slate-50 via-violet-50/40 to-indigo-50/30 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-violet-100/60 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-indigo-100/60 blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl shadow-slate-200/80 border border-slate-100/80 overflow-hidden">
          {/* Top gradient bar */}
          <div className="h-1 w-full bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500" />

          <div className="p-8">
            {/* ── Logo + Header ── */}
            <div className="text-center mb-8">
              <Link
                href="/"
                className="inline-flex items-center gap-2.5 mb-6 group"
              >
                <div className="h-11 w-11 flex items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-purple-600 shadow-lg shadow-violet-200 group-hover:shadow-violet-300 transition-all">
                  <BookOpen className="h-5 w-5 text-white" />
                </div>
                <span className="text-2xl font-black text-slate-900 tracking-tight">
                  Life<span className="text-violet-600">Vault</span>
                </span>
              </Link>
              <h1 className="text-2xl font-bold text-slate-900">
                Welcome back
              </h1>
              <p className="text-sm text-slate-500 mt-1.5">
                Sign in to continue your wisdom journey
              </p>
            </div>

            {/* ── Google Button ── */}
            <button
              type="button"
              onClick={handleGoogle}
              disabled={googleLoading}
              className={cn(
                "w-full h-12 rounded-xl border border-slate-200 bg-white",
                "flex items-center justify-center gap-3",
                "text-sm font-medium text-slate-700",
                "hover:bg-slate-50 hover:border-slate-300 hover:shadow-sm",
                "active:scale-[0.98] transition-all duration-150",
                "disabled:opacity-60 disabled:cursor-not-allowed",
              )}
            >
              {googleLoading ? (
                <Loader2 className="h-4 w-4 animate-spin text-slate-500" />
              ) : (
                <GoogleIcon />
              )}
              Continue with Google
            </button>

            {/* ── Divider ── */}
            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-slate-200" />
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                or
              </span>
              <div className="flex-1 h-px bg-slate-200" />
            </div>

            {/* ── Form ── */}
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <InputField
                id="email"
                label="Email Address"
                type="email"
                placeholder="you@example.com"
                fieldKey="email"
                icon={Mail}
                value={form.email}
                onChange={set("email")}
                error={errors.email}
              />
              <InputField
                id="password"
                label="Password"
                type="password"
                placeholder="Your password"
                fieldKey="password"
                icon={Lock}
                value={form.password}
                onChange={set("password")}
                error={errors.password}
                showPass={showPass}
                onTogglePass={() => setShowPass((p) => !p)}
              />

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className={cn(
                  "w-full h-12 rounded-xl mt-2",
                  "bg-gradient-to-r from-violet-600 to-purple-600",
                  "hover:from-violet-500 hover:to-purple-500",
                  "text-white text-sm font-semibold",
                  "flex items-center justify-center gap-2",
                  "shadow-lg shadow-violet-200 hover:shadow-violet-300",
                  "active:scale-[0.98] transition-all duration-150",
                  "disabled:opacity-70 disabled:cursor-not-allowed disabled:scale-100",
                )}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Signing in...
                  </>
                ) : (
                  <>
                    <LogIn className="h-4 w-4" /> Sign In
                  </>
                )}
              </button>
            </form>

            {/* ── Footer ── */}
            <p className="text-center text-sm text-slate-500 mt-6">
              Don&apos;t have an account?{" "}
              <Link
                href={`/signup?redirect=${redirectTo}`}
                className="text-violet-600 hover:text-violet-700 font-semibold hover:underline transition-colors"
              >
                Create one
              </Link>
            </p>
          </div>
        </div>

        {/* Bottom text */}
        <p className="text-center text-xs text-slate-400 mt-4">
          Protected by{" "}
          <span className="font-semibold text-slate-500">LifeVault</span>
          {" · "}
          <Link href="/privacy" className="hover:text-slate-600 underline">
            Privacy
          </Link>
        </p>
      </div>
    </div>
  );
}
