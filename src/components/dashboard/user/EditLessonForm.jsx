"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Clock, Globe, Lock } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { updateLesson } from "@/lib/action/lessons";

const CATEGORIES = [
  "Personal Growth",
  "Career",
  "Relationships",
  "Mindset",
  "Mistakes Learned",
];
const TONES = ["Motivational", "Sad", "Realization", "Gratitude"];

function wordCount(str = "") {
  return str.trim().split(/\s+/).filter(Boolean).length;
}

export default function EditLessonForm({ initialData, isPremium }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: initialData.title || "",
    description: initialData.description || "",
    category: initialData.category || "",
    emotionalTone: initialData.emotionalTone || "",
    accessLevel: initialData.accessLevel || "free",
    visibility: initialData.isPublic === false ? "private" : "public",
    imageUrl: initialData.imageUrl || "",
  });
  const [errors, setErrors] = useState({});

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  function validate() {
    const e = {};
    if (!form.title.trim()) e.title = "Title is required";
    if (!form.description.trim()) e.description = "Description is required";
    if (!form.category) e.category = "Select a category";
    if (!form.emotionalTone) e.emotionalTone = "Select emotional tone";
    setErrors(e);
    return !Object.keys(e).length;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please fix the errors");
      return;
    }

    setLoading(true);
    try {
      const result = await updateLesson(initialData._id, {
        title: form.title.trim(),
        description: form.description.trim(),
        category: form.category,
        emotionalTone: form.emotionalTone,
        accessLevel: form.accessLevel,
        isPublic: form.visibility === "public",
        imageUrl: form.imageUrl || null,
      });

      if (!result?.success) {
        toast.error(result?.message || "Failed to update");
        return;
      }

      toast.success("Lesson updated! ✅");

      window.location.href = "/dashboard/user/my-lessons";
    } catch (err) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }
  const wc = wordCount(form.description);
  const mins = Math.max(1, Math.ceil(wc / 200));

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {/* Meta info */}
      <div
        className="grid grid-cols-2 gap-3 p-4 rounded-2xl"
        style={{
          backgroundColor: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-white/25">
            Author
          </p>
          <p className="text-sm font-semibold text-white/60 mt-0.5">
            {initialData.userName || "—"}
          </p>
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-white/25">
            Views
          </p>
          <p className="text-sm font-semibold text-white/60 mt-0.5">
            {initialData.views || 0}
          </p>
        </div>
      </div>

      {/* Title */}
      <div className="space-y-1.5">
        <Label className="text-xs font-bold uppercase tracking-widest text-white/40">
          Lesson Title <span className="text-red-400">*</span>
        </Label>
        <input
          value={form.title}
          onChange={(e) => set("title", e.target.value)}
          placeholder='e.g. "What losing my job taught me"'
          className={cn(
            "w-full h-11 rounded-xl border px-3 text-sm outline-none transition-all",
            "bg-white/[0.04] text-white placeholder:text-white/20",
            "focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400/50",
            errors.title ? "border-red-400/50" : "border-white/10",
          )}
        />
        {errors.title && <p className="text-xs text-red-400">{errors.title}</p>}
      </div>

      {/* Description */}
      <div className="space-y-1.5">
        <Label className="text-xs font-bold uppercase tracking-widest text-white/40">
          Full Story / Insight <span className="text-red-400">*</span>
        </Label>
        <textarea
          rows={8}
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
          placeholder="Share your story or insight..."
          className={cn(
            "w-full rounded-xl border px-3 py-2.5 text-sm outline-none transition-all resize-none",
            "bg-white/[0.04] text-white placeholder:text-white/20",
            "focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400/50",
            errors.description ? "border-red-400/50" : "border-white/10",
          )}
        />
        <div className="flex items-center justify-between">
          {errors.description && (
            <p className="text-xs text-red-400">{errors.description}</p>
          )}
          <span className="text-xs text-white/25 ml-auto flex items-center gap-1">
            <Clock className="w-3 h-3" /> ~{mins} min read · {wc} words
          </span>
        </div>
      </div>

      {/* Category + Tone */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Category */}
        <div className="space-y-1.5">
          <Label className="text-xs font-bold uppercase tracking-widest text-white/40">
            Category <span className="text-red-400">*</span>
          </Label>
          <select
            value={form.category}
            onChange={(e) => set("category", e.target.value)}
            className={cn(
              "w-full h-11 rounded-xl border px-3 text-sm outline-none transition-all",
              "bg-[#0c0c18] text-white",
              "focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400/50",
              errors.category ? "border-red-400/50" : "border-white/10",
            )}
          >
            <option value="" disabled>
              Select category
            </option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="text-xs text-red-400">{errors.category}</p>
          )}
        </div>

        {/* Emotional Tone */}
        <div className="space-y-1.5">
          <Label className="text-xs font-bold uppercase tracking-widest text-white/40">
            Emotional Tone <span className="text-red-400">*</span>
          </Label>
          <select
            value={form.emotionalTone}
            onChange={(e) => set("emotionalTone", e.target.value)}
            className={cn(
              "w-full h-11 rounded-xl border px-3 text-sm outline-none transition-all",
              "bg-[#0c0c18] text-white",
              "focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400/50",
              errors.emotionalTone ? "border-red-400/50" : "border-white/10",
            )}
          >
            <option value="" disabled>
              Select tone
            </option>
            {TONES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          {errors.emotionalTone && (
            <p className="text-xs text-red-400">{errors.emotionalTone}</p>
          )}
        </div>
      </div>

      {/* Image URL */}
      <div className="space-y-1.5">
        <Label className="text-xs font-bold uppercase tracking-widest text-white/40">
          Cover Image URL{" "}
          <span className="text-white/20 font-normal normal-case">
            (optional)
          </span>
        </Label>
        <input
          type="url"
          value={form.imageUrl}
          onChange={(e) => set("imageUrl", e.target.value)}
          placeholder="https://example.com/image.jpg"
          className="w-full h-11 rounded-xl border border-white/10 px-3 text-sm outline-none transition-all bg-white/[0.04] text-white placeholder:text-white/20 focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400/50"
        />
      </div>

      {/* Visibility */}
      <div className="space-y-2">
        <Label className="text-xs font-bold uppercase tracking-widest text-white/40">
          Visibility
        </Label>
        <div className="grid grid-cols-2 gap-3">
          {[
            {
              value: "public",
              icon: Globe,
              label: "🌍 Public",
              desc: "Everyone can see",
            },
            {
              value: "private",
              icon: Lock,
              label: "🔒 Private",
              desc: "Only you can see",
            },
          ].map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => set("visibility", opt.value)}
              className={cn(
                "w-full rounded-xl border-2 py-3.5 px-4 text-left transition-all",
                form.visibility === opt.value
                  ? "border-violet-500 bg-violet-950/30"
                  : "border-white/10 bg-white/[0.03] hover:border-white/20",
              )}
            >
              <p
                className={cn(
                  "text-sm font-bold",
                  form.visibility === opt.value
                    ? "text-violet-300"
                    : "text-white/60",
                )}
              >
                {opt.label}
              </p>
              <p className="text-xs mt-0.5 text-white/30">{opt.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Access Level */}
      <div className="space-y-2">
        <Label className="text-xs font-bold uppercase tracking-widest text-white/40">
          Access Level
        </Label>
        <div className="grid grid-cols-2 gap-3">
          {[
            { value: "free", label: "🆓 Free", desc: "Visible to all" },
            {
              value: "premium",
              label: "⭐ Premium",
              desc: "Premium users only",
            },
          ].map((opt) => {
            const disabled = opt.value === "premium" && !isPremium;
            return (
              <button
                key={opt.value}
                type="button"
                disabled={disabled}
                onClick={() => !disabled && set("accessLevel", opt.value)}
                title={disabled ? "Upgrade to Premium to unlock" : ""}
                className={cn(
                  "w-full rounded-xl border-2 py-3.5 px-4 text-left transition-all",
                  form.accessLevel === opt.value
                    ? "border-violet-500 bg-violet-950/30"
                    : "border-white/10 bg-white/[0.03] hover:border-white/20",
                  disabled && "opacity-40 cursor-not-allowed",
                )}
              >
                <p
                  className={cn(
                    "text-sm font-bold",
                    form.accessLevel === opt.value
                      ? "text-violet-300"
                      : "text-white/60",
                  )}
                >
                  {opt.label}
                </p>
                <p className="text-xs mt-0.5 text-white/30">{opt.desc}</p>
                {disabled && (
                  <p className="text-[10px] mt-1 text-amber-400/70">
                    Upgrade required
                  </p>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Divider */}
      <div
        style={{ height: "1px", backgroundColor: "rgba(255,255,255,0.07)" }}
      />

      {/* Actions */}
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/dashboard/my-lessons")}
          className="flex-1 h-11 border-white/10 bg-white/[0.04] text-white/50 hover:text-white hover:bg-white/[0.07]"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={loading}
          className="flex-1 h-11 bg-violet-600 hover:bg-violet-700 font-bold"
          style={{ boxShadow: "0 4px 16px rgba(139,92,246,0.3)" }}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" /> Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </div>
    </form>
  );
}
