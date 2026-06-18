"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signUp, signIn } from "@/lib/auth-client";
import { toast } from "sonner";
import { BookOpen, Eye, EyeOff, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const validatePassword = (password) => {
  if (!/[A-Z]/.test(password)) {
    return "Password must contain at least one uppercase letter";
  }
  if (!/[a-z]/.test(password)) {
    return "Password must contain at least one lowercase letter";
  }
  if (password.length < 8) {
    return "Password must be at least 8 characters long";
  }
  return null;
};

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export default function SignupPage() {
  const router = useRouter();
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

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!isValidEmail(form.email)) e.email = "Enter a valid email";

    const passwordError = validatePassword(form.password);
    if (passwordError) e.password = passwordError;

    setErrors(e);

    const firstError = Object.values(e)[0];
    if (firstError) toast.error(firstError);

    return Object.keys(e).length === 0;
  };

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    try {
      const { data, error } = await signUp.email({
        name: form.name,
        email: form.email,
        password: form.password,
        image: form.photoURL || undefined,
      });

      console.log("signUp.email response:", { data, error });

      if (error) throw new Error(error.message);

      toast.success("Account created! Welcome to LifeVault 🎉");
      router.push("/dashboard/user");
    } catch (err) {
      console.error(" Signup failed:", err);
      toast.error(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setGoogleLoading(true);
    console.log(" Starting Google sign-in...");
    try {
      await signIn.social({
        provider: "google",
        callbackURL: "/dashboard/user",
      });
    } catch (err) {
      console.error(" Google sign-in failed:", err);
      toast.error("Google sign-in failed");
      setGoogleLoading(false);
    }
  }

  const field = (id, label, type, placeholder, key, optional = false) => (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-sm font-medium text-slate-700">
        {label}
        {optional && <span className="text-slate-400"> (optional)</span>}
      </Label>
      <div className="relative">
        <Input
          id={id}
          type={key === "password" ? (showPass ? "text" : "password") : type}
          placeholder={placeholder}
          value={form[key]}
          onChange={(e) => setForm({ ...form, [key]: e.target.value })}
          className={cn(
            "h-11 border-slate-200 focus-visible:ring-violet-500 focus-visible:border-violet-400",
            key === "password" && "pr-10",
            errors[key] && "border-red-400 focus-visible:ring-red-400",
          )}
        />
        {key === "password" && (
          <button
            type="button"
            onClick={() => setShowPass(!showPass)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            tabIndex={-1}
          >
            {showPass ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        )}
      </div>
      {errors[key] && <p className="text-xs text-red-500">{errors[key]}</p>}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50/30 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden">
          {/* Top accent */}
          <div className="h-1.5 w-full bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500" />

          <div className="p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <Link
                href="/"
                className="inline-flex items-center gap-2 mb-6 group"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600 shadow-sm group-hover:bg-violet-700 transition-colors">
                  <BookOpen className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold text-slate-900 tracking-tight">
                  Life<span className="text-violet-600">Vault</span>
                </span>
              </Link>
              <h1 className="text-2xl font-bold text-slate-900">
                Create your account
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Start preserving life&apos;s most important lessons
              </p>
            </div>

            {/* Google */}
            <Button
              variant="outline"
              type="button"
              className="w-full h-11 border-slate-200 hover:bg-slate-50 font-medium gap-2 mb-6"
              onClick={handleGoogle}
              disabled={googleLoading}
            >
              {googleLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
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
              )}
              Continue with Google
            </Button>

            <div className="relative mb-6">
              <Separator />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-3 text-xs text-slate-400 font-medium">
                or sign up with email
              </span>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {field("name", "Full Name", "text", "Enter Your Name", "name")}
              {field(
                "email",
                "Email address",
                "email",
                "Enter Your Email",
                "email",
              )}
              {field(
                "photoURL",
                "Photo URL",
                "url",
                "https://example.com/your-photo.jpg",
                "photoURL",
                true,
              )}
              {field(
                "password",
                "Password",
                "password",
                "Min. 8 chars, 1 uppercase, 1 lowercase",
                "password",
              )}

              <Button
                type="submit"
                className="w-full h-11 bg-violet-600 hover:bg-violet-700 font-semibold mt-2 gap-2"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4" />
                )}
                {loading ? "Creating account..." : "Create Account"}
              </Button>
            </form>

            <p className="text-center text-sm text-slate-500 mt-6">
              Already have an account?{" "}
              <Link
                href="/signin"
                className="text-violet-600 hover:text-violet-700 font-semibold"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-slate-400 mt-4">
          By creating an account, you agree to our{" "}
          <Link href="/terms" className="underline hover:text-slate-600">
            Terms
          </Link>
          {" & "}
          <Link href="/privacy" className="underline hover:text-slate-600">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
}
