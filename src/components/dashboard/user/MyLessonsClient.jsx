"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  Eye,
  Star,
  Pencil,
  Trash2,
  Globe,
  Lock,
  Heart,
  Calendar,
  ChevronDown,
  X,
  AlertTriangle,
  Check,
  Loader2,
} from "lucide-react";
import { deleteLesson, updateLessonField } from "@/lib/action/my-lessons";

// ── Confirm Delete Modal ──
function DeleteModal({ lesson, onConfirm, onCancel, loading }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{
        backgroundColor: "rgba(0,0,0,0.75)",
        backdropFilter: "blur(6px)",
      }}
      onClick={onCancel}
    >
      <div
        className="w-full max-w-sm rounded-2xl p-6 flex flex-col gap-5"
        style={{
          backgroundColor: "#13131f",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Icon */}
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto"
          style={{
            backgroundColor: "rgba(248,113,113,0.1)",
            border: "1px solid rgba(248,113,113,0.2)",
          }}
        >
          <AlertTriangle className="w-6 h-6 text-red-400" />
        </div>

        {/* Text */}
        <div className="text-center">
          <h3 className="text-base font-bold text-white">Delete Lesson?</h3>
          <p className="text-sm text-white/45 mt-1.5 leading-relaxed">
            <span className="text-white font-medium">
              &ldquo;{lesson?.title}&rdquo;
            </span>{" "}
            will be permanently deleted. This action cannot be undone.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 h-10 rounded-xl text-sm font-semibold transition-all hover:bg-white/10 disabled:opacity-50"
            style={{
              backgroundColor: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "rgba(255,255,255,0.6)",
            }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 h-10 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            style={{
              backgroundColor: "rgba(248,113,113,0.15)",
              border: "1px solid rgba(248,113,113,0.3)",
              color: "#f87171",
            }}
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Quick Edit Dropdown ──

function QuickSelect({ lessonId, field, value, options, isPremium, onChange }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const ref = useRef(null);

  // ── outside click close ──
  useEffect(() => {
    if (!open) return;
    function handle(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [open]);

  const handleSelect = async (newVal) => {
    if (newVal === value) {
      setOpen(false);
      return;
    }

    if (field === "accessLevel" && newVal === "premium" && !isPremium) {
      toast.error("Upgrade to Premium to unlock this");
      setOpen(false);
      return;
    }

    setOpen(false);
    setLoading(true);
    try {
      const body =
        field === "visibility"
          ? { isPublic: newVal === "public" }
          : { accessLevel: newVal };

      const res = await updateLessonField(lessonId, body);

      if (res.success) {
        onChange(lessonId, field, newVal);
        toast.success(
          field === "visibility"
            ? "Visibility updated ✅"
            : "Access level updated ✅",
        );
      } else {
        toast.error(res.message || "Failed to update");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  const current = options.find((o) => o.value === value);

  return (
    <div ref={ref} className="relative">
      {/* ── Trigger badge ── */}
      <button
        type="button"
        onClick={() => !loading && setOpen((p) => !p)}
        disabled={loading}
        className="flex items-center gap-1.5 px-2.5 h-7 rounded-lg text-[11px] font-semibold transition-all disabled:opacity-50 select-none"
        style={{
          backgroundColor: current?.bg || "rgba(255,255,255,0.05)",
          color: current?.color || "rgba(255,255,255,0.5)",
          border: `1px solid ${current?.border || "rgba(255,255,255,0.1)"}`,
        }}
      >
        {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : current?.icon}
        <span>{current?.label}</span>
        {!loading && (
          <ChevronDown
            className="w-3 h-3 opacity-40 transition-transform duration-150"
            style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
          />
        )}
      </button>

      {/* ── Dropdown ── */}
      {open && (
        <div
          className="absolute top-full left-0 mt-1.5 z-50 rounded-xl overflow-hidden shadow-2xl"
          style={{
            minWidth: "130px",
            backgroundColor: "#13131f",
            border: "1px solid rgba(255,255,255,0.1)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
          }}
        >
          {options.map((opt) => {
            const isActive = opt.value === value;
            const isLocked =
              opt.value === "premium" && field === "accessLevel" && !isPremium;

            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => !isLocked && handleSelect(opt.value)}
                className="w-full flex items-center gap-2 px-3 py-2.5 text-xs font-semibold text-left transition-colors"
                style={{
                  color: isLocked ? "rgba(255,255,255,0.25)" : opt.color,
                  backgroundColor: isActive ? `${opt.color}10` : "transparent",
                  cursor: isLocked ? "not-allowed" : "pointer",
                }}
                onMouseEnter={(e) => {
                  if (!isActive && !isLocked)
                    e.currentTarget.style.backgroundColor =
                      "rgba(255,255,255,0.05)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = isActive
                    ? `${opt.color}10`
                    : "transparent";
                }}
              >
                {/* icon */}
                <span className="shrink-0">{opt.icon}</span>

                {/* label */}
                <span className="flex-1">{opt.label}</span>

                {/* right side */}
                {isLocked ? (
                  <span className="text-[9px] text-amber-400/50 font-bold shrink-0">
                    PRO
                  </span>
                ) : isActive ? (
                  <Check className="w-3 h-3 opacity-50 shrink-0" />
                ) : null}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Config ──
const VISIBILITY_OPTIONS = [
  {
    value: "public",
    label: "Public",
    icon: <Globe className="w-3 h-3" />,
    color: "#34d399",
    bg: "rgba(52,211,153,0.08)",
    border: "rgba(52,211,153,0.2)",
  },
  {
    value: "private",
    label: "Private",
    icon: <Lock className="w-3 h-3" />,
    color: "#9ca3af",
    bg: "rgba(156,163,175,0.08)",
    border: "rgba(156,163,175,0.2)",
  },
];

const ACCESS_OPTIONS = [
  {
    value: "free",
    label: "Free",
    icon: <Globe className="w-3 h-3" />,
    color: "#60a5fa",
    bg: "rgba(59,130,246,0.08)",
    border: "rgba(59,130,246,0.2)",
  },
  {
    value: "premium",
    label: "Premium",
    icon: <Star className="w-3 h-3" />,
    color: "#fbbf24",
    bg: "rgba(245,158,11,0.08)",
    border: "rgba(245,158,11,0.2)",
  },
];

function timeAgo(dateStr) {
  if (!dateStr) return "—";
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  if (weeks < 5) return `${weeks}w ago`;
  return `${months}mo ago`;
}

export default function MyLessonsClient({ initialLessons, isPremium }) {
  const router = useRouter();
  const [lessons, setLessons] = useState(initialLessons);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Optimistic update after quick-select
  const handleFieldChange = (lessonId, field, newVal) => {
    setLessons((prev) =>
      prev.map((l) => {
        const id = l._id?.$oid || l._id;
        if (id !== lessonId) return l;
        if (field === "visibility")
          return { ...l, isPublic: newVal === "public" };
        if (field === "accessLevel") return { ...l, accessLevel: newVal };
        return l;
      }),
    );
  };

  // Delete
  const handleDelete = async () => {
    if (!deleteTarget) return;

    const id = deleteTarget._id?.$oid || deleteTarget._id;
    setDeleteLoading(true);

    const result = await deleteLesson(id);

    if (result.success) {
      setLessons((prev) => prev.filter((l) => (l._id?.$oid || l._id) !== id));
      router.refresh();
      toast.success("Lesson deleted");
      setDeleteTarget(null);
    } else {
      toast.error(result.message);
    }

    setDeleteLoading(false);
  };

  return (
    <>
      {/* Delete modal */}
      {deleteTarget && (
        <DeleteModal
          lesson={deleteTarget}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          loading={deleteLoading}
        />
      )}

      {/* Table — desktop */}
      <div
        className="hidden md:block rounded-2xl overflow-hidden"
        style={{
          backgroundColor: "rgba(255,255,255,0.018)",
          border: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        {/* Header */}
        <div
          className="grid px-5 py-3"
          style={{
            gridTemplateColumns: "2fr 1fr 1fr 0.8fr 0.8fr 0.8fr 1fr",
            borderBottom: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          {[
            "Lesson",
            "Visibility",
            "Access",
            "Views",
            "Likes",
            "Created",
            "Actions",
          ].map((h) => (
            <p
              key={h}
              className="text-[10px] font-bold uppercase tracking-widest text-white/25"
            >
              {h}
            </p>
          ))}
        </div>

        {/* Rows */}
        {lessons.map((lesson, i) => {
          const id = lesson._id?.$oid || lesson._id;
          const isLast = i === lessons.length - 1;
          const vis = lesson.isPublic === false ? "private" : "public";

          return (
            <div
              key={id}
              className="grid items-center px-5 py-4 hover:bg-white/[0.02] transition-colors"
              style={{
                gridTemplateColumns: "2fr 1fr 1fr 0.8fr 0.8fr 0.8fr 1fr",
                borderBottom: isLast
                  ? "none"
                  : "1px solid rgba(255,255,255,0.05)",
              }}
            >
              {/* Lesson info */}
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-sm font-bold text-violet-400"
                  style={{
                    backgroundColor: "rgba(139,92,246,0.08)",
                    border: "1px solid rgba(139,92,246,0.15)",
                  }}
                >
                  {lesson.title?.[0] || "L"}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white truncate">
                    {lesson.title}
                  </p>
                  <p className="text-[10px] text-white/30 truncate">
                    {lesson.category} · {lesson.emotionalTone}
                  </p>
                </div>
              </div>

              {/* Visibility */}
              <QuickSelect
                lessonId={id}
                field="visibility"
                value={vis}
                options={VISIBILITY_OPTIONS}
                isPremium={isPremium}
                onChange={handleFieldChange}
              />

              {/* Access Level */}
              <QuickSelect
                lessonId={id}
                field="accessLevel"
                value={lesson.accessLevel || "free"}
                options={ACCESS_OPTIONS}
                isPremium={isPremium}
                onChange={handleFieldChange}
              />

              {/* Views */}
              <div className="flex items-center gap-1 text-xs text-white/40">
                <Eye className="w-3.5 h-3.5" />
                {lesson.views || 0}
              </div>

              {/* Likes */}
              <div className="flex items-center gap-1 text-xs text-white/40">
                <Heart className="w-3.5 h-3.5" />
                {lesson.likesCount || 0}
              </div>

              {/* Created */}
              <div className="flex items-center gap-1 text-[11px] text-white/30">
                <Calendar className="w-3 h-3" />
                {timeAgo(lesson.createdAt)}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1">
                <Link
                  href={`/lessons/${id}`}
                  className="h-7 px-2.5 rounded-lg text-[11px] font-semibold transition-all hover:bg-white/10 flex items-center"
                  style={{ color: "rgba(255,255,255,0.5)" }}
                >
                  View
                </Link>
                <Link
                  href={`/dashboard/user/my-lessons/${id}/edit`}
                  className="w-7 h-7 rounded-lg flex items-center justify-center transition-all hover:bg-violet-500/10"
                  style={{ color: "rgba(139,92,246,0.7)" }}
                >
                  <Pencil className="w-3.5 h-3.5" />
                </Link>
                <button
                  onClick={() => setDeleteTarget(lesson)}
                  className="w-7 h-7 rounded-lg flex items-center justify-center transition-all hover:bg-red-500/10"
                  style={{ color: "rgba(248,113,113,0.7)" }}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Cards — mobile */}
      <div className="flex flex-col gap-3 md:hidden">
        {lessons.map((lesson) => {
          const id = lesson._id?.$oid || lesson._id;
          const vis = lesson.isPublic === false ? "private" : "public";

          return (
            <div
              key={id}
              className="flex flex-col gap-4 p-4 rounded-2xl"
              style={{
                backgroundColor: "rgba(255,255,255,0.018)",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              {/* Title row */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-sm font-bold text-violet-400"
                    style={{
                      backgroundColor: "rgba(139,92,246,0.08)",
                      border: "1px solid rgba(139,92,246,0.15)",
                    }}
                  >
                    {lesson.title?.[0] || "L"}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white truncate">
                      {lesson.title}
                    </p>
                    <p className="text-[10px] text-white/30">
                      {lesson.category}
                    </p>
                  </div>
                </div>
                {/* Delete */}
                <button
                  onClick={() => setDeleteTarget(lesson)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all hover:bg-red-500/10"
                  style={{ color: "rgba(248,113,113,0.7)" }}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Quick selects + stats */}
              <div className="flex items-center gap-2 flex-wrap">
                <QuickSelect
                  lessonId={id}
                  field="visibility"
                  value={vis}
                  options={VISIBILITY_OPTIONS}
                  isPremium={isPremium}
                  onChange={handleFieldChange}
                />
                <QuickSelect
                  lessonId={id}
                  field="accessLevel"
                  value={lesson.accessLevel || "free"}
                  options={ACCESS_OPTIONS}
                  isPremium={isPremium}
                  onChange={handleFieldChange}
                />
                <span className="text-[11px] text-white/30 flex items-center gap-1">
                  <Eye className="w-3 h-3" /> {lesson.views || 0}
                </span>
                <span className="text-[11px] text-white/30 flex items-center gap-1">
                  <Heart className="w-3 h-3" /> {lesson.likesCount || 0}
                </span>
                <span className="text-[11px] text-white/25 flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> {timeAgo(lesson.createdAt)}
                </span>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2">
                <Link
                  href={`/lessons/${id}`}
                  className="flex-1 h-8 rounded-xl text-xs font-semibold flex items-center justify-center transition-all"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    color: "rgba(255,255,255,0.5)",
                  }}
                >
                  View
                </Link>
                <Link
                  href={`/dashboard/user/my-lessons/${id}/edit`}
                  className="flex-1 h-8 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                  style={{
                    backgroundColor: "rgba(139,92,246,0.08)",
                    border: "1px solid rgba(139,92,246,0.2)",
                    color: "#a78bfa",
                  }}
                >
                  <Pencil className="w-3.5 h-3.5" /> Edit
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
