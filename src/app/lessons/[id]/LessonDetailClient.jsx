"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Heart,
  Bookmark,
  Flag,
  Clock,
  Eye,
  Calendar,
  Globe,
  ArrowLeft,
  Star,
  MessageCircle,
  Send,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import LessonCard from "@/components/LessonCard";
import {
  addComment,
  reportLesson,
  toggleFavorite,
  toggleLike,
} from "@/lib/action/lessonDetail";
// ── helpers
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
const REPORT_REASONS = [
  "Inappropriate content",
  "Spam or misleading",
  "Offensive language",
  "False information",
  "Other",
];

function fmtDate(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
function readMins(str = "") {
  const wc = str.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(wc / 200));
}
function fmtCount(n) {
  if (!n) return "0";
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  return String(n);
}
function initials(name = "") {
  return (
    name
      .split(" ")
      .map((w) => w[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "U"
  );
}

// ── main component
export default function LessonDetailClient({
  lesson,
  currentUser,
  relatedByCategory,
  relatedByTone,
  authorLessonCount,
  initialFavorited,
}) {
  const router = useRouter();
  const id = lesson._id?.$oid || lesson._id;

  // ── Like state
  const [liked, setLiked] = useState(
    Array.isArray(lesson.likes) && currentUser
      ? lesson.likes.includes(currentUser.id)
      : false,
  );
  const [likesCount, setLikesCount] = useState(lesson.likesCount ?? 0);
  const [likeLoading, setLikeLoading] = useState(false);

  // ── Favorite state
  const [favorited, setFavorited] = useState(initialFavorited);
  const [favLoading, setFavLoading] = useState(false);

  // ── Comments
  const [comments, setComments] = useState(lesson.comments ?? []);
  const [commentText, setCommentText] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);

  // ── Report modal
  const [reportOpen, setReportOpen] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportLoading, setReportLoading] = useState(false);

  // ── handlers
  async function handleLike() {
    if (!currentUser) {
      toast.error("Please log in to like");
      router.push("/signin");
      return;
    }
    if (liked) {
      return;
    }
    setLikeLoading(true);
    const res = await toggleLike(id);
    if (!res.success) {
      toast.error(res.message || "Failed");
    } else {
      setLiked(true);
      setLikesCount(res.likesCount);
      toast.success("Liked!");
    }
    setLikeLoading(false);
  }

  async function handleFavorite() {
    if (!currentUser) {
      toast.error("Please log in to save");
      router.push("/signin");
      return;
    }
    setFavLoading(true);
    const res = await toggleFavorite(id);
    if (!res.success) {
      toast.error(res.message || "Failed");
    } else {
      setFavorited(res.saved);
      toast.success(
        res.saved ? "Saved to favorites!" : "Removed from favorites",
      );
    }
    setFavLoading(false);
  }

  async function handleComment(e) {
    e.preventDefault();
    if (!currentUser) {
      toast.error("Please log in to comment");
      return;
    }
    if (!commentText.trim()) return;
    setCommentLoading(true);
    const res = await addComment(id, commentText.trim());
    if (!res.success) {
      toast.error(res.message || "Failed to post comment");
    } else {
      setComments((prev) => [
        ...prev,
        res.comment ?? {
          _id: Date.now(),
          content: commentText.trim(),
          userName: currentUser.name,
          userAvatar: currentUser.image,
          createdAt: new Date().toISOString(),
        },
      ]);
      setCommentText("");
      toast.success("Comment posted!");
    }
    setCommentLoading(false);
  }

  async function handleReport() {
    if (!reportReason) {
      toast.error("Please select a reason");
      return;
    }
    setReportLoading(true);
    const res = await reportLesson(id, reportReason);
    if (!res.success) {
      toast.error(res.message || "Failed");
    } else {
      toast.success("Report submitted. Thank you!");
      setReportOpen(false);
      setReportReason("");
    }
    setReportLoading(false);
  }

  // ── derived ─────────────────────────────────────────────
  const cat = CATEGORY_CONFIG[lesson.category] ?? {
    color: "#a78bfa",
    bg: "rgba(139,92,246,0.1)",
    border: "rgba(139,92,246,0.2)",
  };
  const tone = TONE_CONFIG[lesson.emotionalTone] ?? {
    color: "#9ca3af",
    bg: "rgba(107,114,128,0.1)",
    border: "rgba(107,114,128,0.2)",
  };
  const mins = readMins(lesson.description);
  const [views] = useState(
    () => lesson.views || Math.floor(Math.random() * 8000 + 500),
  );

  return (
    <div className="min-h-screen bg-[#080810] text-white">
      <div className="mx-auto max-w-4xl px-4 py-10">
        {/* Back */}
        <Link
          href="/lessons"
          className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Lessons
        </Link>

        {/* ── 1. Hero / Cover image ── */}
        {lesson.imageUrl && (
          <div className="w-full h-64 sm:h-80 rounded-2xl overflow-hidden mb-8 border border-white/10">
            <Image
              src={lesson.imageUrl}
              alt={lesson.title}
              width={900}
              height={400}
              className="w-full h-full object-cover"
              priority
            />
          </div>
        )}

        {/* ── 2. Badges ── */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span
            className="text-xs font-semibold px-3 py-1 rounded-full"
            style={{
              backgroundColor: cat.bg,
              color: cat.color,
              border: `1px solid ${cat.border}`,
            }}
          >
            {lesson.category}
          </span>
          <span
            className="text-xs font-semibold px-3 py-1 rounded-full"
            style={{
              backgroundColor: tone.bg,
              color: tone.color,
              border: `1px solid ${tone.border}`,
            }}
          >
            {lesson.emotionalTone}
          </span>
          {lesson.accessLevel === "premium" && (
            <span
              className="text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1"
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

        {/* ── 3. Title + Description ── */}
        <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight mb-6">
          {lesson.title}
        </h1>
        <p className="text-base text-white/70 leading-relaxed whitespace-pre-wrap mb-10">
          {lesson.description}
        </p>

        {/* ── 4. Metadata block ── */}
        <div
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10 p-5 rounded-2xl"
          style={{
            backgroundColor: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          {[
            {
              icon: Calendar,
              label: "Created",
              value: fmtDate(lesson.createdAt),
            },
            {
              icon: Calendar,
              label: "Updated",
              value: fmtDate(lesson.updatedAt ?? lesson.createdAt),
            },
            {
              icon: Globe,
              label: "Visibility",
              value: lesson.isPublic ? "Public" : "Private",
            },
            { icon: Clock, label: "Read time", value: `~${mins} min` },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label}>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-white/30 mb-1 flex items-center gap-1">
                <Icon className="w-3 h-3" /> {label}
              </p>
              <p className="text-sm font-semibold text-white/80">{value}</p>
            </div>
          ))}
        </div>

        {/* ── 5. Author card ── */}
        <div
          className="flex items-start gap-4 p-5 rounded-2xl mb-10"
          style={{
            backgroundColor: "rgba(139,92,246,0.06)",
            border: "1px solid rgba(139,92,246,0.15)",
          }}
        >
          <div
            className="w-12 h-12 rounded-full overflow-hidden shrink-0 flex items-center justify-center text-sm font-bold text-violet-400"
            style={{
              backgroundColor: "rgba(139,92,246,0.15)",
              border: "1px solid rgba(139,92,246,0.3)",
            }}
          >
            {lesson.userAvatar ? (
              <Image
                src={lesson.userAvatar}
                alt={lesson.userName}
                width={48}
                height={48}
                className="w-full h-full object-cover"
              />
            ) : (
              initials(lesson.userName)
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-white">
              {lesson.userName || "Anonymous"}
            </p>
            <p className="text-xs text-white/40 mt-0.5">
              {authorLessonCount} lesson{authorLessonCount !== 1 ? "s" : ""}{" "}
              written
            </p>
            <Link
              href={`/author/${lesson.userId}`}
              className="inline-block mt-2 text-xs font-semibold text-violet-400 hover:text-violet-300 transition-colors"
            >
              View all lessons →
            </Link>
          </div>
        </div>

        {/* ── 6. Stats & Interaction row ── */}
        <div className="flex flex-wrap items-center gap-3 mb-10">
          {/* Like */}
          <button
            onClick={handleLike}
            disabled={likeLoading || liked}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all disabled:cursor-default"
            style={{
              backgroundColor: liked
                ? "rgba(239,68,68,0.15)"
                : "rgba(255,255,255,0.05)",
              border: `1px solid ${liked ? "rgba(239,68,68,0.4)" : "rgba(255,255,255,0.1)"}`,
              color: liked ? "#f87171" : "rgba(255,255,255,0.6)",
            }}
          >
            <Heart
              className={`w-4 h-4 ${liked ? "fill-red-400 text-red-400" : ""}`}
            />
            {fmtCount(likesCount)} Likes
          </button>

          {/* Favorite */}
          <button
            onClick={handleFavorite}
            disabled={favLoading}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
            style={{
              backgroundColor: favorited
                ? "rgba(139,92,246,0.15)"
                : "rgba(255,255,255,0.05)",
              border: `1px solid ${favorited ? "rgba(139,92,246,0.4)" : "rgba(255,255,255,0.1)"}`,
              color: favorited ? "#a78bfa" : "rgba(255,255,255,0.6)",
            }}
          >
            <Bookmark
              className={`w-4 h-4 ${favorited ? "fill-violet-400 text-violet-400" : ""}`}
            />
            {favorited ? "Saved" : "Save"}
          </button>

          {/* Views */}
          <div
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold"
            style={{
              backgroundColor: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "rgba(255,255,255,0.4)",
            }}
          >
            <Eye className="w-4 h-4" /> {fmtCount(views)} Views
          </div>

          {/* Comments count */}
          <div
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold"
            style={{
              backgroundColor: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "rgba(255,255,255,0.4)",
            }}
          >
            <MessageCircle className="w-4 h-4" /> {comments.length} Comments
          </div>

          {/* Report */}
          <button
            onClick={() => {
              if (!currentUser) {
                toast.error("Please log in to report");
                return;
              }
              setReportOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ml-auto"
            style={{
              backgroundColor: "rgba(239,68,68,0.08)",
              border: "1px solid rgba(239,68,68,0.2)",
              color: "rgba(239,68,68,0.7)",
            }}
          >
            <Flag className="w-4 h-4" /> Report
          </button>
        </div>

        {/* ── 7. Comments ── */}
        <section className="mb-14">
          <h2 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-violet-400" /> Comments
          </h2>

          {currentUser ? (
            <form onSubmit={handleComment} className="flex gap-3 mb-6">
              <div
                className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-[10px] font-bold text-violet-400"
                style={{
                  backgroundColor: "rgba(139,92,246,0.15)",
                  border: "1px solid rgba(139,92,246,0.3)",
                }}
              >
                {currentUser.image ? (
                  <Image
                    src={currentUser.image}
                    alt={currentUser.name}
                    width={32}
                    height={32}
                    className="rounded-full object-cover"
                  />
                ) : (
                  initials(currentUser.name)
                )}
              </div>
              <div className="flex-1 flex gap-2">
                <Textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Share your thoughts..."
                  rows={2}
                  className="bg-white/5 border-white/10 text-white text-sm resize-none focus:ring-violet-500"
                />
                <Button
                  type="submit"
                  disabled={commentLoading || !commentText.trim()}
                  className="shrink-0 bg-violet-600 hover:bg-violet-700 h-auto px-4"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </form>
          ) : (
            <p className="text-sm text-white/40 mb-6">
              <Link href="/signin" className="text-violet-400 hover:underline">
                Sign in
              </Link>{" "}
              to leave a comment.
            </p>
          )}

          <div className="space-y-4">
            {comments.length === 0 && (
              <p className="text-sm text-white/30 py-6 text-center">
                No comments yet. Be the first!
              </p>
            )}
            {comments.map((c, i) => (
              <div
                key={c._id ?? i}
                className="flex gap-3 p-4 rounded-xl"
                style={{
                  backgroundColor: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
              >
                <div
                  className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-[10px] font-bold text-violet-400 mt-0.5"
                  style={{
                    backgroundColor: "rgba(139,92,246,0.12)",
                    border: "1px solid rgba(139,92,246,0.2)",
                  }}
                >
                  {c.userAvatar ? (
                    <Image
                      src={c.userAvatar}
                      alt={c.userName}
                      width={32}
                      height={32}
                      className="rounded-full object-cover"
                    />
                  ) : (
                    initials(c.userName)
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-white/80">
                      {c.userName || "Anonymous"}
                    </span>
                    <span className="text-[10px] text-white/25">
                      {fmtDate(c.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm text-white/60 leading-relaxed">
                    {c.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 8. Similar lessons ── */}
        {relatedByCategory.length > 0 && (
          <section className="mb-14">
            <h2 className="text-lg font-bold text-white mb-5">
              More in <span className="text-violet-400">{lesson.category}</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {relatedByCategory.slice(0, 6).map((l) => (
                <LessonCard key={l._id} lesson={l} currentUser={null} />
              ))}
            </div>
          </section>
        )}

        {relatedByTone.length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-white mb-5">
              More{" "}
              <span className="text-violet-400">{lesson.emotionalTone}</span>{" "}
              lessons
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {relatedByTone.slice(0, 6).map((l) => (
                <LessonCard key={l._id} lesson={l} currentUser={null} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* ── Report modal ── */}
      {reportOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{
            backgroundColor: "rgba(0,0,0,0.7)",
            backdropFilter: "blur(6px)",
          }}
        >
          <div
            className="w-full max-w-sm rounded-2xl p-6 space-y-4"
            style={{
              backgroundColor: "#0f0f1a",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Flag className="w-4 h-4 text-red-400" /> Report Lesson
              </h3>
              <button
                onClick={() => setReportOpen(false)}
                className="text-white/40 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-white/50">
              Select the reason for reporting this lesson:
            </p>
            <div className="space-y-2">
              {REPORT_REASONS.map((r) => (
                <label
                  key={r}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <input
                    type="radio"
                    name="report"
                    value={r}
                    checked={reportReason === r}
                    onChange={() => setReportReason(r)}
                    className="accent-violet-500"
                  />
                  <span className="text-sm text-white/60 group-hover:text-white transition-colors">
                    {r}
                  </span>
                </label>
              ))}
            </div>
            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                className="flex-1 border-white/10 text-white/60 hover:text-white"
                onClick={() => setReportOpen(false)}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-red-500 hover:bg-red-600 font-bold"
                onClick={handleReport}
                disabled={reportLoading}
              >
                {reportLoading ? "Submitting…" : "Submit Report"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
