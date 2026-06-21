"use client";

import { useState, useMemo } from "react";
import { toast } from "sonner";
import Link from "next/link";
import Image from "next/image";
import {
  Heart,
  Eye,
  Clock,
  Star,
  Trash2,
  Filter,
  BookOpen,
  Calendar,
} from "lucide-react";
import { toggleFavorite } from "@/lib/action/lessonDetail";

const CATEGORIES = [
  "All",
  "Personal Growth",
  "Career",
  "Relationships",
  "Mindset",
  "Mistakes Learned",
];
const TONES = ["All", "Motivational", "Sad", "Realization", "Gratitude"];

const TONE_COLORS = {
  Motivational: {
    color: "#34d399",
    bg: "rgba(52,211,153,0.08)",
    border: "rgba(52,211,153,0.2)",
  },
  Sad: {
    color: "#60a5fa",
    bg: "rgba(59,130,246,0.08)",
    border: "rgba(59,130,246,0.2)",
  },
  Realization: {
    color: "#fbbf24",
    bg: "rgba(245,158,11,0.08)",
    border: "rgba(245,158,11,0.2)",
  },
  Gratitude: {
    color: "#f472b6",
    bg: "rgba(236,72,153,0.08)",
    border: "rgba(236,72,153,0.2)",
  },
};

const CAT_COLORS = {
  "Personal Growth": {
    color: "#a78bfa",
    bg: "rgba(139,92,246,0.08)",
    border: "rgba(139,92,246,0.2)",
  },
  Career: {
    color: "#38bdf8",
    bg: "rgba(14,165,233,0.08)",
    border: "rgba(14,165,233,0.2)",
  },
  Relationships: {
    color: "#f472b6",
    bg: "rgba(236,72,153,0.08)",
    border: "rgba(236,72,153,0.2)",
  },
  Mindset: {
    color: "#34d399",
    bg: "rgba(52,211,153,0.08)",
    border: "rgba(52,211,153,0.2)",
  },
  "Mistakes Learned": {
    color: "#fb923c",
    bg: "rgba(234,88,12,0.08)",
    border: "rgba(234,88,12,0.2)",
  },
};

function timeAgo(dateStr) {
  if (!dateStr) return "—";
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days < 1) return "Today";
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

function wordCount(str = "") {
  return str.trim().split(/\s+/).filter(Boolean).length;
}

export default function MyFavoritesClient({ initialLessons, currentUser }) {
  const [lessons, setLessons] = useState(initialLessons);
  const [removing, setRemoving] = useState(null);
  const [catFilter, setCatFilter] = useState("All");
  const [toneFilter, setToneFilter] = useState("All");

  const filtered = useMemo(() => {
    return lessons.filter((l) => {
      if (catFilter !== "All" && l.category !== catFilter) return false;
      if (toneFilter !== "All" && l.emotionalTone !== toneFilter) return false;
      return true;
    });
  }, [lessons, catFilter, toneFilter]);

  async function handleRemove(lesson) {
    const id = lesson._id?.$oid || lesson._id;
    setRemoving(id);
    try {
      const result = await toggleFavorite(id);
      if (result.success && !result.saved) {
        setLessons((prev) => prev.filter((l) => (l._id?.$oid || l._id) !== id));
        toast.success("Removed from favorites");
      } else {
        toast.error(result.message || "Failed to remove");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setRemoving(null);
    }
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Category filter */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <div className="flex items-center gap-1.5 text-xs text-white/35 mr-1">
            <Filter className="w-3.5 h-3.5" /> Category:
          </div>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCatFilter(cat)}
              className="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
              style={
                catFilter === cat
                  ? {
                      background: "linear-gradient(135deg, #7c3aed, #6d28d9)",
                      color: "#fff",
                    }
                  : {
                      backgroundColor: "rgba(255,255,255,0.04)",
                      color: "rgba(255,255,255,0.4)",
                      border: "1px solid rgba(255,255,255,0.08)",
                    }
              }
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Tone filter */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <div className="flex items-center gap-1.5 text-xs text-white/35 mr-1">
          <Filter className="w-3.5 h-3.5" /> Tone:
        </div>
        {TONES.map((tone) => (
          <button
            key={tone}
            onClick={() => setToneFilter(tone)}
            className="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
            style={
              toneFilter === tone
                ? {
                    backgroundColor: "rgba(139,92,246,0.2)",
                    color: "#a78bfa",
                    border: "1px solid rgba(139,92,246,0.3)",
                  }
                : {
                    backgroundColor: "rgba(255,255,255,0.03)",
                    color: "rgba(255,255,255,0.35)",
                    border: "1px solid rgba(255,255,255,0.07)",
                  }
            }
          >
            {tone}
          </button>
        ))}
      </div>

      {/* Result count */}
      <p className="text-xs text-white/30">
        Showing {filtered.length} of {lessons.length} favorites
      </p>

      {/* Empty filter state */}
      {filtered.length === 0 && (
        <div
          className="flex flex-col items-center justify-center py-16 rounded-2xl text-center gap-3"
          style={{
            backgroundColor: "rgba(255,255,255,0.018)",
            border: "1px dashed rgba(255,255,255,0.08)",
          }}
        >
          <BookOpen className="w-10 h-10 text-white/10" />
          <p className="text-sm text-white/40">No lessons match this filter</p>
          <button
            onClick={() => {
              setCatFilter("All");
              setToneFilter("All");
            }}
            className="text-xs text-violet-400 hover:underline"
          >
            Clear filters
          </button>
        </div>
      )}

      {/* Desktop table */}
      {filtered.length > 0 && (
        <>
          <div
            className="hidden md:block rounded-2xl overflow-hidden"
            style={{
              backgroundColor: "rgba(255,255,255,0.018)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            {/* Table header */}
            <div
              className="grid px-5 py-3"
              style={{
                gridTemplateColumns: "2fr 1fr 1fr 0.7fr 0.7fr 0.8fr 0.8fr",
                borderBottom: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              {[
                "Lesson",
                "Category",
                "Tone",
                "Views",
                "Likes",
                "Saved",
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
            {filtered.map((lesson, i) => {
              const id = lesson._id?.$oid || lesson._id;
              const isLast = i === filtered.length - 1;
              const cat = CAT_COLORS[lesson.category] || {
                color: "#a78bfa",
                bg: "rgba(139,92,246,0.08)",
                border: "rgba(139,92,246,0.2)",
              };
              const tone = TONE_COLORS[lesson.emotionalTone] || {
                color: "#9ca3af",
                bg: "rgba(107,114,128,0.08)",
                border: "rgba(107,114,128,0.2)",
              };
              const wc = wordCount(lesson.description);
              const mins = Math.max(1, Math.ceil(wc / 200));

              return (
                <div
                  key={id}
                  className="grid items-center px-5 py-4 hover:bg-white/[0.02] transition-colors"
                  style={{
                    gridTemplateColumns: "2fr 1fr 1fr 0.7fr 0.7fr 0.8fr 0.8fr",
                    borderBottom: isLast
                      ? "none"
                      : "1px solid rgba(255,255,255,0.05)",
                  }}
                >
                  {/* Lesson info */}
                  <div className="flex items-center gap-3 min-w-0">
                    {lesson.imageUrl ? (
                      <Image
                        src={lesson.imageUrl}
                        alt={lesson.title}
                        width={40}
                        height={40}
                        className="w-10 h-10 rounded-xl object-cover shrink-0"
                      />
                    ) : (
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-sm font-bold text-violet-400"
                        style={{
                          backgroundColor: "rgba(139,92,246,0.08)",
                          border: "1px solid rgba(139,92,246,0.15)",
                        }}
                      >
                        {lesson.title?.[0] || "L"}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white truncate">
                        {lesson.title}
                      </p>
                      <p className="text-[10px] text-white/30 flex items-center gap-1 mt-0.5">
                        <Clock className="w-2.5 h-2.5" /> {mins} min read
                      </p>
                    </div>
                  </div>

                  {/* Category */}
                  <span
                    className="text-[11px] font-semibold px-2 py-1 rounded-full w-fit"
                    style={{
                      backgroundColor: cat.bg,
                      color: cat.color,
                      border: `1px solid ${cat.border}`,
                    }}
                  >
                    {lesson.category}
                  </span>

                  {/* Tone */}
                  <span
                    className="text-[11px] font-semibold px-2 py-1 rounded-full w-fit"
                    style={{
                      backgroundColor: tone.bg,
                      color: tone.color,
                      border: `1px solid ${tone.border}`,
                    }}
                  >
                    {lesson.emotionalTone}
                  </span>

                  {/* Views */}
                  <div className="flex items-center gap-1 text-xs text-white/40">
                    <Eye className="w-3.5 h-3.5" /> {lesson.views || 0}
                  </div>

                  {/* Likes */}
                  <div className="flex items-center gap-1 text-xs text-white/40">
                    <Heart className="w-3.5 h-3.5" /> {lesson.likesCount || 0}
                  </div>

                  {/* Saved date */}
                  <div className="flex items-center gap-1 text-[11px] text-white/30">
                    <Calendar className="w-3 h-3" /> {timeAgo(lesson.createdAt)}
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
                    <button
                      onClick={() => handleRemove(lesson)}
                      disabled={removing === id}
                      className="w-7 h-7 rounded-lg flex items-center justify-center transition-all hover:bg-red-500/10 disabled:opacity-40"
                      style={{ color: "rgba(248,113,113,0.7)" }}
                      title="Remove from favorites"
                    >
                      {removing === id ? (
                        <div className="w-3.5 h-3.5 rounded-full border border-red-400 border-t-transparent animate-spin" />
                      ) : (
                        <Heart className="w-3.5 h-3.5 fill-current" />
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Mobile cards */}
          <div className="flex flex-col gap-3 md:hidden">
            {filtered.map((lesson) => {
              const id = lesson._id?.$oid || lesson._id;
              const cat = CAT_COLORS[lesson.category] || {
                color: "#a78bfa",
                bg: "rgba(139,92,246,0.08)",
                border: "rgba(139,92,246,0.2)",
              };
              const tone = TONE_COLORS[lesson.emotionalTone] || {
                color: "#9ca3af",
                bg: "rgba(107,114,128,0.08)",
                border: "rgba(107,114,128,0.2)",
              };
              const mins = Math.max(
                1,
                Math.ceil(wordCount(lesson.description) / 200),
              );

              return (
                <div
                  key={id}
                  className="flex flex-col gap-3 p-4 rounded-2xl"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.018)",
                    border: "1px solid rgba(255,255,255,0.07)",
                  }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-sm font-bold text-violet-400"
                        style={{
                          backgroundColor: "rgba(139,92,246,0.08)",
                          border: "1px solid rgba(139,92,246,0.15)",
                        }}
                      >
                        {lesson.imageUrl ? (
                          <Image
                            src={lesson.imageUrl}
                            alt={lesson.title}
                            width={40}
                            height={40}
                            className="w-full h-full object-cover rounded-xl"
                          />
                        ) : (
                          lesson.title?.[0] || "L"
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-white truncate">
                          {lesson.title}
                        </p>
                        <p className="text-[10px] text-white/30">
                          {mins} min read
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemove(lesson)}
                      disabled={removing === id}
                      className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all hover:bg-red-500/10 disabled:opacity-40"
                      style={{ color: "rgba(248,113,113,0.8)" }}
                    >
                      <Heart className="w-4 h-4 fill-current" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor: cat.bg,
                        color: cat.color,
                        border: `1px solid ${cat.border}`,
                      }}
                    >
                      {lesson.category}
                    </span>
                    <span
                      className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor: tone.bg,
                        color: tone.color,
                        border: `1px solid ${tone.border}`,
                      }}
                    >
                      {lesson.emotionalTone}
                    </span>
                    <span className="text-[11px] text-white/30 flex items-center gap-1">
                      <Eye className="w-3 h-3" /> {lesson.views || 0}
                    </span>
                    <span className="text-[11px] text-white/30 flex items-center gap-1">
                      <Heart className="w-3 h-3" /> {lesson.likesCount || 0}
                    </span>
                  </div>

                  <Link
                    href={`/lessons/${id}`}
                    className="w-full h-8 rounded-xl text-xs font-semibold flex items-center justify-center transition-all"
                    style={{
                      backgroundColor: "rgba(139,92,246,0.08)",
                      border: "1px solid rgba(139,92,246,0.2)",
                      color: "#a78bfa",
                    }}
                  >
                    See Details →
                  </Link>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
