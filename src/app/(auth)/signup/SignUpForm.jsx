"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { signUp, signIn } from "@/lib/auth-client";
import { toast } from "sonner";
import {
  BookOpen,
  Eye,
  EyeOff,
  Loader2,
  Sparkles,
  Mail,
  Lock,
  User,
  ImageIcon,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const isValidEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

// Password strength rules
const RULES = [
  { label: "At least 8 characters", test: (p) => p.length >= 8 },
  { label: "One uppercase letter", test: (p) => /[A-Z]/.test(p) },
  { label: "One lowercase letter", test: (p) => /[a-z]/.test(p) },
];

// ── Input Field ──
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
  optional,
}) {
  return (
    <div className="space-y-1.5">
      <Label
        htmlFor={id}
        className="text-xs font-semibold uppercase tracking-wider text-slate-500"
      >
        {label}
        {optional && (
          <span className="ml-1.5 text-[10px] font-medium text-slate-400 normal-case tracking-normal">
            (optional)
          </span>
        )}
      </Label>
      <div className="relative group">
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
          autoComplete={
            fieldKey === "password"
              ? "new-password"
              : fieldKey === "email"
                ? "email"
                : fieldKey === "name"
                  ? "name"
                  : "off"
          }
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

// ── Password Strength ──
function PasswordStrength({ password }) {
  if (!password) return null;
  const passed = RULES.filter((r) => r.test(password)).length;
  const colors = ["bg-red-400", "bg-amber-400", "bg-emerald-400"];

  return (
    <div className="space-y-2 pt-1">
      {/* Bar */}
      <div className="flex gap-1">
        {RULES.map((_, i) => (
          <div
            key={i}
            className={cn(
              "h-1 flex-1 rounded-full transition-all duration-300",
              i < passed ? colors[passed - 1] : "bg-slate-200",
            )}
          />
        ))}
      </div>
      {/* Rules */}
      <div className="space-y-1">
        {RULES.map((rule, i) => {
          const ok = rule.test(password);
          return (
            <div key={i} className="flex items-center gap-1.5">
              {ok ? (
                <CheckCircle2 className="h-3 w-3 text-emerald-500 shrink-0" />
              ) : (
                <XCircle className="h-3 w-3 text-slate-300 shrink-0" />
              )}
              <span
                className={cn(
                  "text-[11px]",
                  ok ? "text-emerald-600" : "text-slate-400",
                )}
              >
                {rule.label}
              </span>
            </div>
          );
        })}
      </div>
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

export default function SignUpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    photoURL: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  const set = (key) => (e) => setForm((p) => ({ ...p, [key]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Full name is required";
    if (!isValidEmail(form.email)) e.email = "Enter a valid email address";
    const failedRule = RULES.find((r) => !r.test(form.password));
    if (failedRule) e.password = failedRule.label;
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
      const { error } = await signUp.email({
        name: form.name.trim(),
        email: form.email,
        password: form.password,
        image: form.photoURL || undefined,
        role: "user", // ← default role
      });
      if (error) throw new Error(error.message);
      toast.success("Account created! Welcome to LifeVault 🎉");
      router.push(`/signin?redirect=${redirectTo}`);
      router.refresh();
    } catch (err) {
      toast.error(err.message || "Signup failed. Please try again.");
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

  const passStrength = RULES.filter((r) => r.test(form.password)).length;

  return (
    <div className="min-h-screen bg-[#080810] flex items-center justify-center p-4 py-10 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-violet-600/20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-fuchsia-600/15 blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl shadow-black/40 border border-white/10 overflow-hidden">
          <div className="h-1 w-full bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500" />

          <div className="p-8">
            {/* ── Header ── */}
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
                Create your account
              </h1>
              <p className="text-sm text-slate-500 mt-1.5">
                Start preserving life&apos;s most important lessons
              </p>
            </div>

            {/* ── Google ── */}
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
                id="name"
                label="Full Name"
                type="text"
                placeholder="Your full name"
                fieldKey="name"
                icon={User}
                value={form.name}
                onChange={set("name")}
                error={errors.name}
              />

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
                id="photoURL"
                label="Photo URL"
                type="url"
                placeholder="https://example.com/photo.jpg"
                fieldKey="photoURL"
                icon={ImageIcon}
                value={form.photoURL}
                onChange={set("photoURL")}
                error={errors.photoURL}
                optional
              />

              <div className="space-y-2">
                <InputField
                  id="password"
                  label="Password"
                  type="password"
                  placeholder="Min 8 chars, uppercase & lowercase"
                  fieldKey="password"
                  icon={Lock}
                  value={form.password}
                  onChange={set("password")}
                  error={errors.password}
                  showPass={showPass}
                  onTogglePass={() => setShowPass((p) => !p)}
                />
                <PasswordStrength password={form.password} />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading || passStrength < 3}
                className={cn(
                  "w-full h-12 rounded-xl mt-2",
                  "bg-gradient-to-r from-violet-600 to-purple-600",
                  "hover:from-violet-500 hover:to-purple-500",
                  "text-white text-sm font-semibold",
                  "flex items-center justify-center gap-2",
                  "shadow-lg shadow-violet-200 hover:shadow-violet-300",
                  "active:scale-[0.98] transition-all duration-150",
                  "disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100",
                )}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Creating
                    account...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" /> Create Account
                  </>
                )}
              </button>
            </form>

            <p className="text-center text-sm text-slate-500 mt-6">
              Already have an account?{" "}
              <Link
                href={`/signin?redirect=${redirectTo}`}
                className="text-violet-600 hover:text-violet-700 font-semibold hover:underline transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Bottom */}
        <p className="text-center text-xs text-slate-400 mt-4">
          By creating an account, you agree to our{" "}
          <Link href="/terms" className="underline hover:text-slate-300">
            Terms
          </Link>
          {" & "}
          <Link href="/privacy" className="underline hover:text-slate-300">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
}
