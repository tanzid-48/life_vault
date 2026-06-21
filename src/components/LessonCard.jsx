"use client";
import Link from "next/link";
import Image from "next/image";
import { Lock, Clock, Eye, Star } from "lucide-react";

const TONE_CONFIG = {
  Motivational: {
    color: "#34d399",
    bg: "rgba(52,211,153,0.1)",
    border: "rgba(52,211,153,0.2)",
  },
  Sad: {
    color: "#60a5fa",
    bg: "rgba(59,130,246,0.1)",
    border: "rgba(59,130,246,0.2)",
  },
  Realization: {
    color: "#fbbf24",
    bg: "rgba(245,158,11,0.1)",
    border: "rgba(245,158,11,0.2)",
  },
  Gratitude: {
    color: "#f472b6",
    bg: "rgba(236,72,153,0.1)",
    border: "rgba(236,72,153,0.2)",
  },
};

const CATEGORY_CONFIG = {
  "Personal Growth": {
    color: "#a78bfa",
    bg: "rgba(139,92,246,0.1)",
    border: "rgba(139,92,246,0.2)",
  },
  Career: {
    color: "#38bdf8",
    bg: "rgba(14,165,233,0.1)",
    border: "rgba(14,165,233,0.2)",
  },
  Relationships: {
    color: "#f472b6",
    bg: "rgba(236,72,153,0.1)",
    border: "rgba(236,72,153,0.2)",
  },
  Mindset: {
    color: "#34d399",
    bg: "rgba(52,211,153,0.1)",
    border: "rgba(52,211,153,0.2)",
  },
  "Mistakes Learned": {
    color: "#fb923c",
    bg: "rgba(234,88,12,0.1)",
    border: "rgba(234,88,12,0.2)",
  },
};

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

function wordCount(str = "") {
  return str.trim().split(/\s+/).filter(Boolean).length;
}

export default function LessonCard({ lesson, currentUser }) {
  const id = lesson._id?.$oid || lesson._id;

  const isPremiumLesson = lesson.accessLevel === "premium";
  const userIsPremium = currentUser?.isPremium === true;
  const isLocked = isPremiumLesson && !userIsPremium;

  const cat = CATEGORY_CONFIG[lesson.category] || {
    color: "#a78bfa",
    bg: "rgba(139,92,246,0.1)",
    border: "rgba(139,92,246,0.2)",
  };
  const tone = TONE_CONFIG[lesson.emotionalTone] || {
    color: "#9ca3af",
    bg: "rgba(107,114,128,0.1)",
    border: "rgba(107,114,128,0.2)",
  };

  const wc = wordCount(lesson.description);
  const mins = Math.max(1, Math.ceil(wc / 200));
  const preview =
    lesson.description?.slice(0, 120) +
    (lesson.description?.length > 120 ? "…" : "");
  const initials =
    lesson.userName
      ?.split(" ")
      .map((w) => w[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "U";

  return (
    <div
      className="relative flex flex-col rounded-2xl overflow-hidden transition-all duration-200 hover:-translate-y-0.5 group"
      style={{
        backgroundColor: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.borderColor = "rgba(139,92,246,0.35)")
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")
      }
    >
      {/* ── PREMIUM LOCK OVERLAY ── */}
      {isLocked && (
        <div
          className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 rounded-2xl text-center px-6"
          style={{
            backdropFilter: "blur(12px)",
            backgroundColor: "rgba(8,8,16,0.75)",
          }}
        >
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center"
            style={{
              background:
                "linear-gradient(135deg, rgba(251,191,36,0.2), rgba(245,158,11,0.08))",
              border: "1px solid rgba(251,191,36,0.3)",
            }}
          >
            <Lock className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <p className="text-sm font-bold text-white">Premium Lesson</p>
            <p
              className="text-xs mt-1"
              style={{ color: "rgba(255,255,255,0.45)" }}
            >
              Upgrade your plan to unlock this lesson.
            </p>
          </div>
          <Link
            href="/pricing"
            className="px-5 h-8 rounded-xl text-xs font-bold text-white flex items-center gap-1.5 hover:opacity-90 transition-all"
            style={{
              background: "linear-gradient(135deg, #fbbf24, #f59e0b)",
              boxShadow: "0 4px 16px rgba(245,158,11,0.3)",
            }}
          >
            <Star className="w-3.5 h-3.5" /> Upgrade to Premium
          </Link>
        </div>
      )}

      {/* ── CARD CONTENT (blurred if locked) ── */}
      <div
        className={isLocked ? "blur-sm pointer-events-none select-none" : ""}
      >
        {/* Cover image */}
        {lesson.imageUrl && (
          <div className="w-full h-40 overflow-hidden">
            <Image
              src={lesson.imageUrl}
              alt={lesson.title}
              width={600}
              height={160}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        )}

        <div className="flex flex-col gap-3 p-5">
          {/* Badges row */}
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className="text-[11px] font-semibold px-2.5 py-1 rounded-full"
              style={{
                backgroundColor: cat.bg,
                color: cat.color,
                border: `1px solid ${cat.border}`,
              }}
            >
              {lesson.category}
            </span>
            <span
              className="text-[11px] font-semibold px-2.5 py-1 rounded-full"
              style={{
                backgroundColor: tone.bg,
                color: tone.color,
                border: `1px solid ${tone.border}`,
              }}
            >
              {lesson.emotionalTone}
            </span>
            {isPremiumLesson && (
              <span
                className="text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1"
                style={{
                  backgroundColor: "rgba(251,191,36,0.1)",
                  color: "#fbbf24",
                  border: "1px solid rgba(251,191,36,0.25)",
                }}
              >
                <Star className="w-3 h-3" /> Premium
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="text-base font-bold text-white leading-snug line-clamp-2">
            {lesson.title}
          </h3>

          {/* Description preview */}
          <p
            className="text-xs leading-relaxed line-clamp-3"
            style={{ color: "rgba(255,255,255,0.45)" }}
          >
            {preview}
          </p>

          {/* Creator info */}
          <div className="flex items-center gap-2.5 pt-1">
            <div
              className="w-7 h-7 rounded-full overflow-hidden shrink-0 flex items-center justify-center text-[10px] font-bold text-violet-400"
              style={{
                backgroundColor: "rgba(139,92,246,0.12)",
                border: "1px solid rgba(139,92,246,0.2)",
              }}
            >
              {lesson.userAvatar ? (
                <Image
                  src={lesson.userAvatar}
                  alt={lesson.userName}
                  width={28}
                  height={28}
                  className="w-full h-full object-cover"
                />
              ) : (
                initials
              )}
            </div>
            <p
              className="text-xs font-medium"
              style={{ color: "rgba(255,255,255,0.55)" }}
            >
              {lesson.userName || "Anonymous"}
            </p>
          </div>

          {/* Divider */}
          <div
            style={{ height: "1px", backgroundColor: "rgba(255,255,255,0.06)" }}
          />

          {/* Footer — date, read time, views */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span
                className="text-[11px] flex items-center gap-1"
                style={{ color: "rgba(255,255,255,0.3)" }}
              >
                <Clock className="w-3 h-3" /> {mins} min read
              </span>
              <span
                className="text-[11px] flex items-center gap-1"
                style={{ color: "rgba(255,255,255,0.3)" }}
              >
                <Eye className="w-3 h-3" /> {lesson.views || 0}
              </span>
            </div>
            <span
              className="text-[11px]"
              style={{ color: "rgba(255,255,255,0.25)" }}
            >
              {timeAgo(lesson.createdAt)}
            </span>
          </div>

          {/* CTA */}
          <Link
            href={`/lessons/${id}`}
            className="w-full flex items-center justify-center h-9 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 mt-1"
            style={{
              background:
                "linear-gradient(135deg, rgba(139,92,246,0.7), rgba(124,58,237,0.9))",
              border: "1px solid rgba(139,92,246,0.3)",
            }}
          >
            See Details →
          </Link>
        </div>
      </div>
    </div>
  );
}
