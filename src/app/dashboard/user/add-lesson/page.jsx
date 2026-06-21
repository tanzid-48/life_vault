"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  BookOpen,
  ImageIcon,
  Loader2,
  Lock,
  ArrowLeft,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import { createLesson } from "@/lib/action/lessons";

const CATEGORIES = [
  "Personal Growth",
  "Career",
  "Relationships",
  "Mindset",
  "Mistakes Learned",
];
const TONES = ["Motivational", "Sad", "Realization", "Gratitude"];

function wordCount(str) {
  return str.trim().split(/\s+/).filter(Boolean).length;
}

export default function AddLessonPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user;
  const isPremium = user?.isPremium || false;

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    emotionalTone: "",
    accessLevel: "free",
    visibility: "public",
    imageUrl: "",
  });

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  function validate() {
    const e = {};
    if (!form.title.trim()) e.title = "Lesson title is required";
    if (!form.category) e.category = "Select a category";
    if (!form.emotionalTone) e.emotionalTone = "Select emotional tone";
    setErrors(e);
    return !Object.keys(e).length;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please fix the errors below");
      return;
    }
    setLoading(true);
    try {
      const result = await createLesson({
        ...form,
        isPublic: form.visibility === "public",
      });
      if (!result.success) {
        toast.error(result.message || "Failed");
        return;
      }
      toast.success("Lesson published! 🎉");
      router.push("/dashboard/my-lessons");
    } catch (err) {
      toast.error(err.message || "Failed to publish");
    } finally {
      setLoading(false);
    }
  }

  const wc = wordCount(form.description);
  const mins = Math.max(1, Math.ceil(wc / 200));

  return (
    <div className="mx-auto max-w-2xl bg-[#080810] px-4 py-10 min-h-screen text-slate-200">
      <Link
        href="/dashboard/user"
        className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Dashboard
      </Link>

      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-white">
          Add a Life Lesson
        </h1>
        <p className="text-slate-400 mt-1 text-sm">
          Share something you have learned — it might change someones life.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div className="space-y-1.5">
          <Label className="text-sm font-semibold text-white">
            Lesson Title <span className="text-red-500">*</span>
          </Label>
          <Input
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
            className="h-11 bg-white/5 border-white/10 focus:ring-violet-500 text-white"
            placeholder='e.g. "What losing my first job taught me"'
          />
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <Label className="text-sm font-semibold text-white">
            Full Story / Insight <span className="text-red-500">*</span>
          </Label>
          <textarea
            rows={8}
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white focus:ring-2 focus:ring-violet-500 outline-none transition-shadow"
            placeholder="Share your story..."
          />
          <div className="text-xs text-slate-400 flex items-center justify-between">
            <span />
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" /> ~{mins} min read · {wc} words
            </span>
          </div>
        </div>

        {/* Category & Tone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {["category", "emotionalTone"].map((field) => (
            <div key={field} className="space-y-1.5">
              <Label className="text-sm font-semibold text-white capitalize">
                {field.replace("emotionalTone", "Tone")}
              </Label>
              <select
                value={form[field]}
                onChange={(e) => set(field, e.target.value)}
                className="w-full h-11 rounded-md border border-white/10 bg-[#0c0c18] px-3 text-sm text-white focus:ring-2 focus:ring-violet-500 outline-none"
              >
                <option value="" disabled>
                  Select {field}
                </option>
                {(field === "category" ? CATEGORIES : TONES).map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
        {/* Visibility */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-white">Visibility</Label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { value: "public", label: "🌍 Public", desc: "Everyone can see" },
              {
                value: "private",
                label: "🔒 Private",
                desc: "Only you can see",
              },
            ].map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => set("visibility", opt.value)}
                className={cn(
                  "w-full rounded-xl border-2 py-3 px-4 text-sm font-bold transition-all text-left",
                  form.visibility === opt.value
                    ? "border-violet-500 bg-violet-950/30 text-violet-300"
                    : "border-white/10 bg-white/5 text-slate-400 hover:border-white/20",
                )}
              >
                <div>{opt.label}</div>
                <div className="text-xs font-normal mt-0.5 opacity-60">
                  {opt.desc}
                </div>
              </button>
            ))}
          </div>
        </div>
        {/* Access Level */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-white">
            Access Level
          </Label>
          <div className="grid grid-cols-2 gap-3">
            {["free", "premium"].map((level) => {
              const isDisabled = level === "premium" && !isPremium;
              return (
                <button
                  key={level}
                  type="button"
                  disabled={isDisabled}
                  onClick={() => !isDisabled && set("accessLevel", level)}
                  className={cn(
                    "w-full rounded-xl border-2 py-4 text-sm font-bold transition-all",
                    form.accessLevel === level
                      ? "border-violet-500 bg-violet-950/30 text-violet-300"
                      : "border-white/10 bg-white/5 text-slate-400 hover:border-white/20",
                  )}
                >
                  {level === "premium" ? "⭐ Premium" : "🆓 Free"}
                </button>
              );
            })}
          </div>
        </div>

        {/* Submit */}
        <div className="flex gap-3 pt-4 border-t border-white/10">
          <Button
            type="submit"
            className="flex-1 h-11 bg-violet-600 hover:bg-violet-700 font-bold"
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Publish Lesson"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
