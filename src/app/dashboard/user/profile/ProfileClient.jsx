"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { User, ImageIcon, Loader2, Save } from "lucide-react";
import { Label } from "@/components/ui/label";
import Image from "next/image";

export default function ProfileClient({ user }) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: user?.name || "",
    image: user?.image || "",
  });
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState(user?.image || "");
  const [imgError, setImgError] = useState(false);

  const set = (k) => (e) => {
    setForm((p) => ({ ...p, [k]: e.target.value }));
    if (k === "image") {
      setImgError(false);
      setPreview(e.target.value);
    }
  };

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error("Name is required");
      return;
    }

    setSaving(true);
    try {
      // better-auth updateUser
      const { authClient } = await import("@/lib/auth-client");
      const { error } = await authClient.updateUser({
        name: form.name.trim(),
        image: form.image || undefined,
      });

      if (error) throw new Error(error.message);
      toast.success("Profile updated!");
      router.refresh();
    } catch (err) {
      toast.error(err.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  }

  const initials =
    user?.name
      ?.split(" ")
      .map((w) => w[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "U";

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl p-6 flex flex-col gap-5"
      style={{
        backgroundColor: "rgba(255,255,255,0.018)",
        border: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      <p className="text-xs font-bold uppercase tracking-widest text-white/30">
        Edit Profile
      </p>

      <div className="flex items-center gap-4">
        {/* Avatar preview */}
        <div
          className="w-16 h-16 rounded-2xl overflow-hidden flex items-center justify-center text-xl font-black text-violet-400 shrink-0"
          style={{
            backgroundColor: "rgba(139,92,246,0.1)",
            border: "1px solid rgba(139,92,246,0.2)",
          }}
        >
          {preview && !imgError ? (
            <Image
              src={preview}
              alt="avatar"
              width={64}
              height={64}
              className="w-full h-full object-cover"
              onError={() => setImgError(true)}
            />
          ) : (
            initials
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold text-white/50 uppercase tracking-widest mb-1.5">
            Photo URL
          </p>
          <div className="relative">
            <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              type="url"
              value={form.image}
              onChange={set("image")}
              placeholder="https://example.com/photo.jpg"
              className="w-full h-10 rounded-xl border pl-9 pr-3 text-sm outline-none transition-all bg-slate-50/5 text-white placeholder:text-white/20 focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400/50 border-white/10"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Name */}
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs font-semibold uppercase tracking-widest text-white/40">
            Display Name
          </Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              type="text"
              value={form.name}
              onChange={set("name")}
              placeholder="Your display name"
              className="w-full h-11 rounded-xl border pl-9 pr-3 text-sm outline-none transition-all bg-slate-50/5 text-white placeholder:text-white/20 focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400/50 border-white/10"
            />
          </div>
        </div>

        {/* Email — read only */}
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs font-semibold uppercase tracking-widest text-white/40">
            Email (cannot change)
          </Label>
          <input
            type="email"
            value={user?.email || ""}
            disabled
            className="w-full h-11 rounded-xl border px-3 text-sm bg-white/[0.02] text-white/25 border-white/[0.06] cursor-not-allowed"
          />
        </div>
      </div>

      <div className="flex justify-end pt-1">
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 px-6 h-10 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 disabled:opacity-50 active:scale-95"
          style={{ background: "linear-gradient(135deg, #7c3aed, #6d28d9)" }}
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" /> Save Changes
            </>
          )}
        </button>
      </div>
    </form>
  );
}
