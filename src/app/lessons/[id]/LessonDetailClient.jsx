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
  Lock,
  Loader2,
} from "lucide-react";
import {
  addComment,
  reportLesson,
  toggleFavorite,
  toggleLike,
} from "@/lib/action/lessonDetail";
import LessonCard from "@/components/LessonCard";
import dynamic from "next/dynamic";

const ExportPDFButton = dynamic(() => import("@/components/LessonPDF"), {
  ssr: false,
  loading: () => (
    <div className="h-10 w-32 rounded-xl bg-white/5 animate-pulse" />
  ),
});

// ── color configs
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

// ── helpers
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

// ── Avatar helper

function Avatar({ src, name, size = 32 }) {
  return (
    <div
      className="rounded-full overflow-hidden shrink-0 flex items-center justify-center text-[10px] font-bold text-violet-400"
      style={{
        width: size,
        height: size,
        minWidth: size,
        backgroundColor: "rgba(139,92,246,0.12)",
        border: "1px solid rgba(139,92,246,0.2)",
      }}
    >
      {src ? (
        <Image
          src={src}
          alt={name || ""}
          width={size}
          height={size}
          className="w-full h-full object-cover"
        />
      ) : (
        initials(name)
      )}
    </div>
  );
}

// ── Main component

export default function LessonDetailClient({
  lesson,
  currentUser,
  isLocked = false,
  relatedByCategory = [],
  relatedByTone = [],
  initialComments = [],
  authorLessonCount = 0,
  initialFavorited = false,
}) {
  const router = useRouter();
  const id = lesson._id?.$oid || lesson._id?.toString() || lesson._id;

  // ── Like
  const [liked, setLiked] = useState(
    Array.isArray(lesson.likes) && currentUser
      ? lesson.likes.includes(currentUser.id)
      : false,
  );
  const [likesCount, setLikesCount] = useState(lesson.likesCount ?? 0);
  const [likeLoading, setLikeLoading] = useState(false);

  // ── Favorite
  const [favorited, setFavorited] = useState(initialFavorited);
  const [favLoading, setFavLoading] = useState(false);

  // ── Comments
  const [comments, setComments] = useState(initialComments);
  const [commentText, setCommentText] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);

  // ── Report
  const [reportOpen, setReportOpen] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportLoading, setReportLoading] = useState(false);

  // ── handlers
  async function handleLike() {
    if (!currentUser) {
      toast.error("Please sign in to like");
      router.push("/signin");
      return;
    }
    if (liked) return;
    setLikeLoading(true);
    const res = await toggleLike(id);
    if (res.success) {
      setLiked(true);
      setLikesCount(res.likesCount);
      toast.success("Liked! ❤️");
    } else toast.error(res.message || "Failed to like");
    setLikeLoading(false);
  }

  async function handleFavorite() {
    if (!currentUser) {
      toast.error("Please sign in to save");
      router.push("/signin");
      return;
    }
    setFavLoading(true);
    const res = await toggleFavorite(id);
    if (res.success) {
      setFavorited(res.saved);
      toast.success(
        res.saved ? "Saved to favorites! 🔖" : "Removed from favorites",
      );
    } else toast.error(res.message || "Failed");
    setFavLoading(false);
  }

  async function handleComment(e) {
    e.preventDefault();
    if (!currentUser) {
      toast.error("Please sign in to comment");
      return;
    }
    if (!commentText.trim()) return;
    setCommentLoading(true);
    const res = await addComment(id, commentText.trim());
    if (res.success) {
      setComments((prev) => [
        ...prev,
        res.comment ?? {
          _id: Date.now().toString(),
          content: commentText.trim(),
          userName: currentUser.name,
          userAvatar: currentUser.image ?? null,
          createdAt: new Date().toISOString(),
        },
      ]);
      setCommentText("");
      toast.success("Comment posted!");
    } else toast.error(res.message || "Failed to post");
    setCommentLoading(false);
  }

  async function handleReport() {
    if (!reportReason) {
      toast.error("Please select a reason");
      return;
    }
    setReportLoading(true);
    const res = await reportLesson(id, reportReason);
    if (res.success) {
      toast.success("Report submitted. Thank you!");
      setReportOpen(false);
      setReportReason("");
    } else toast.error(res.message || "Failed to report");
    setReportLoading(false);
  }

  // ── derived
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
  const isOwner =
    currentUser?.id ===
    (lesson.userId?.$oid || lesson.userId?.toString?.() || lesson.userId);

  // ── render
  return (
    <div className="min-h-screen bg-[#080810] text-white">
      <div className="max-w-4xl mx-auto px-4 py-10 flex flex-col gap-10">
        {/* ── Back ── */}
        <Link
          href="/lessons"
          className="inline-flex items-center gap-1.5 text-sm text-white/40 hover:text-white transition-colors w-fit"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Lessons
        </Link>

        {/* ── Cover image ── */}
        {lesson.imageUrl && (
          <div
            className="w-full h-64 sm:h-80 rounded-2xl overflow-hidden"
            style={{ border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <Image
              src={lesson.imageUrl}
              alt={lesson.title}
              width={900}
              height={400}
              priority
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* ── Badges ── */}
        <div className="flex flex-wrap gap-2 -mb-4">
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

        {/* ── Title ── */}
        <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight">
          {lesson.title}
        </h1>

        {/* ── Author row ── */}
        <div className="flex items-center gap-3 -mt-4">
          <Avatar src={lesson.userAvatar} name={lesson.userName} size={36} />
          <div>
            <p className="text-sm font-semibold text-white/70">
              {lesson.userName || "Anonymous"}
            </p>
            <p className="text-[11px] text-white/30">
              {fmtDate(lesson.createdAt)}
            </p>
          </div>
          <div className="flex items-center gap-3 ml-auto text-xs text-white/30">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> ~{mins} min
            </span>
            <span className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" /> {fmtCount(lesson.views || 0)}
            </span>
          </div>
        </div>

        {/* ── Divider ── */}
        <div
          style={{ height: "1px", backgroundColor: "rgba(255,255,255,0.07)" }}
        />

        {/* ── Content or Lock ── */}
        {isLocked ? (
          <div className="flex flex-col gap-4">
            {/* Blurred preview */}
            <div className="relative overflow-hidden rounded-2xl">
              <p className="text-base text-white/70 leading-relaxed whitespace-pre-wrap blur-sm select-none pointer-events-none">
                {lesson.description?.slice(0, 300)}...
              </p>
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to bottom, transparent 0%, #080810 80%)",
                }}
              />
            </div>
            {/* Upgrade banner */}
            <div
              className="flex flex-col items-center justify-center gap-5 py-14 px-6 rounded-2xl text-center"
              style={{
                backgroundColor: "rgba(255,255,255,0.018)",
                border: "1px dashed rgba(139,92,246,0.25)",
              }}
            >
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(251,191,36,0.15), rgba(245,158,11,0.05))",
                  border: "1px solid rgba(251,191,36,0.25)",
                }}
              >
                <Lock className="w-8 h-8 text-amber-400" />
              </div>
              <div>
                <p className="text-xl font-bold text-white">Premium Lesson</p>
                <p className="text-sm text-white/40 mt-1.5 max-w-sm">
                  Upgrade to Premium to unlock this lesson and all premium
                  content on LifeVault.
                </p>
              </div>
              <Link
                href="/pricing"
                className="flex items-center gap-2 px-8 h-12 rounded-xl text-sm font-bold transition-all hover:opacity-90 active:scale-95"
                style={{
                  background: "linear-gradient(135deg, #fbbf24, #f59e0b)",
                  color: "#000",
                  boxShadow: "0 4px 20px rgba(245,158,11,0.35)",
                }}
              >
                <Star className="w-4 h-4 fill-black" /> Upgrade to Premium —
                ৳1500
              </Link>
            </div>
          </div>
        ) : (
          <p className="text-base text-white/75 leading-relaxed whitespace-pre-wrap">
            {lesson.description}
          </p>
        )}

        {/* ── Metadata block ── */}
        <div
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-2xl"
          style={{
            backgroundColor: "rgba(255,255,255,0.025)",
            border: "1px solid rgba(255,255,255,0.07)",
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
              value: lesson.isPublic !== false ? "Public" : "Private",
            },
            { icon: Clock, label: "Read time", value: `~${mins} min` },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label}>
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/25 mb-1 flex items-center gap-1">
                <Icon className="w-3 h-3" /> {label}
              </p>
              <p className="text-sm font-semibold text-white/70">{value}</p>
            </div>
          ))}
        </div>

        {/* ── Author card ── */}
        {!isLocked && (
          <div
            className="flex items-start gap-4 p-5 rounded-2xl"
            style={{
              backgroundColor: "rgba(139,92,246,0.06)",
              border: "1px solid rgba(139,92,246,0.15)",
            }}
          >
            <Avatar src={lesson.userAvatar} name={lesson.userName} size={48} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white">
                {lesson.userName || "Anonymous"}
              </p>
              <p className="text-xs text-white/40 mt-0.5">
                {authorLessonCount} lesson{authorLessonCount !== 1 ? "s" : ""}{" "}
                written
              </p>
              <Link
                href={`/lessons?userId=${lesson.userId}`}
                className="inline-block mt-2 text-xs font-semibold text-violet-400 hover:text-violet-300 transition-colors"
              >
                View all lessons by this author →
              </Link>
            </div>
          </div>
        )}

        {/* ── Stats & Interaction row ── */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Like */}
          <button
            onClick={handleLike}
            disabled={likeLoading || liked}
            className="flex items-center gap-2 px-4 h-10 rounded-xl text-sm font-semibold transition-all disabled:cursor-default"
            style={{
              backgroundColor: liked
                ? "rgba(239,68,68,0.12)"
                : "rgba(255,255,255,0.04)",
              border: `1px solid ${liked ? "rgba(239,68,68,0.35)" : "rgba(255,255,255,0.1)"}`,
              color: liked ? "#f87171" : "rgba(255,255,255,0.55)",
            }}
          >
            {likeLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Heart
                className={`w-4 h-4 transition-all ${liked ? "fill-red-400 text-red-400 scale-110" : ""}`}
              />
            )}
            {fmtCount(likesCount)} Likes
          </button>

          {/* Favorite */}
          <button
            onClick={handleFavorite}
            disabled={favLoading}
            className="flex items-center gap-2 px-4 h-10 rounded-xl text-sm font-semibold transition-all"
            style={{
              backgroundColor: favorited
                ? "rgba(139,92,246,0.12)"
                : "rgba(255,255,255,0.04)",
              border: `1px solid ${favorited ? "rgba(139,92,246,0.35)" : "rgba(255,255,255,0.1)"}`,
              color: favorited ? "#a78bfa" : "rgba(255,255,255,0.55)",
            }}
          >
            {favLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Bookmark
                className={`w-4 h-4 ${favorited ? "fill-violet-400 text-violet-400" : ""}`}
              />
            )}
            {favorited ? "Saved" : "Save"}
          </button>

          {/* Views */}
          <div
            className="flex items-center gap-2 px-4 h-10 rounded-xl text-sm font-semibold"
            style={{
              backgroundColor: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "rgba(255,255,255,0.35)",
            }}
          >
            <Eye className="w-4 h-4" /> {fmtCount(lesson.views || 0)}
          </div>

          {/* Comments count */}
          <div
            className="flex items-center gap-2 px-4 h-10 rounded-xl text-sm font-semibold"
            style={{
              backgroundColor: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "rgba(255,255,255,0.35)",
            }}
          >
            <MessageCircle className="w-4 h-4" /> {comments.length}
          </div>
          {(isOwner || currentUser?.isPremium) && !isLocked && (
            <ExportPDFButton lesson={lesson} />
          )}

          {/* Report — ml-auto */}
          <button
            onClick={() => {
              if (!currentUser) {
                toast.error("Sign in to report");
                return;
              }
              setReportOpen(true);
            }}
            className="flex items-center gap-2 px-4 h-10 rounded-xl text-sm font-semibold transition-all ml-auto"
            style={{
              backgroundColor: "rgba(239,68,68,0.06)",
              border: "1px solid rgba(239,68,68,0.18)",
              color: "rgba(239,68,68,0.65)",
            }}
          >
            <Flag className="w-4 h-4" /> Report
          </button>
        </div>

        {/* ── Divider ── */}
        <div
          style={{ height: "1px", backgroundColor: "rgba(255,255,255,0.07)" }}
        />

        {/* ── Comments section ── */}
        <section className="flex flex-col gap-6">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-violet-400" />
            Comments{" "}
            <span className="text-sm font-normal text-white/30">
              ({comments.length})
            </span>
          </h2>

          {/* Comment input */}
          {currentUser ? (
            <form onSubmit={handleComment} className="flex gap-3 items-start">
              <Avatar
                src={currentUser.image}
                name={currentUser.name}
                size={32}
              />
              <div className="flex-1 flex gap-2">
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Share your thoughts..."
                  rows={2}
                  className="flex-1 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm text-white placeholder:text-white/25 outline-none resize-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400/50 transition-all"
                />
                <button
                  type="submit"
                  disabled={commentLoading || !commentText.trim()}
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all disabled:opacity-40 self-end"
                  style={{
                    background: "linear-gradient(135deg, #7c3aed, #6d28d9)",
                  }}
                >
                  {commentLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                  ) : (
                    <Send className="w-4 h-4 text-white" />
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div
              className="flex items-center gap-3 p-4 rounded-xl"
              style={{
                backgroundColor: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <MessageCircle className="w-5 h-5 text-white/25 shrink-0" />
              <p className="text-sm text-white/40">
                <Link
                  href="/signin"
                  className="text-violet-400 hover:underline font-semibold"
                >
                  Sign in
                </Link>{" "}
                to leave a comment.
              </p>
            </div>
          )}

          {/* Comments list */}
          {comments.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center py-12 rounded-2xl text-center gap-2"
              style={{
                backgroundColor: "rgba(255,255,255,0.018)",
                border: "1px dashed rgba(255,255,255,0.07)",
              }}
            >
              <MessageCircle className="w-8 h-8 text-white/10" />
              <p className="text-sm text-white/30">
                No comments yet. Be the first!
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {comments.map((c, i) => (
                <div
                  key={c._id ?? i}
                  className="flex gap-3 p-4 rounded-2xl"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.025)",
                    border: "1px solid rgba(255,255,255,0.07)",
                  }}
                >
                  <Avatar src={c.userAvatar} name={c.userName} size={32} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
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
          )}
        </section>

        {/* ── Related — same category ── */}
        {relatedByCategory.length > 0 && (
          <section className="flex flex-col gap-5">
            <h2 className="text-lg font-bold text-white">
              More in <span className="text-violet-400">{lesson.category}</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {relatedByCategory.slice(0, 3).map((l) => (
                <LessonCard
                  key={l._id?.$oid || l._id}
                  lesson={l}
                  currentUser={currentUser}
                />
              ))}
            </div>
          </section>
        )}

        {/* ── Related — same tone ── */}
        {relatedByTone.length > 0 && (
          <section className="flex flex-col gap-5">
            <h2 className="text-lg font-bold text-white">
              More{" "}
              <span className="text-violet-400">{lesson.emotionalTone}</span>{" "}
              lessons
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {relatedByTone.slice(0, 3).map((l) => (
                <LessonCard
                  key={l._id?.$oid || l._id}
                  lesson={l}
                  currentUser={currentUser}
                />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* ── Report Modal ── */}
      {reportOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{
            backgroundColor: "rgba(0,0,0,0.75)",
            backdropFilter: "blur(8px)",
          }}
          onClick={() => setReportOpen(false)}
        >
          <div
            className="w-full max-w-sm rounded-2xl p-6 flex flex-col gap-5"
            style={{
              backgroundColor: "#13131f",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Flag className="w-4 h-4 text-red-400" /> Report Lesson
              </h3>
              <button
                onClick={() => setReportOpen(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-sm text-white/45">
              Select a reason for reporting:
            </p>

            {/* Reasons */}
            <div className="flex flex-col gap-2">
              {REPORT_REASONS.map((r) => (
                <label
                  key={r}
                  className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all"
                  style={{
                    backgroundColor:
                      reportReason === r
                        ? "rgba(139,92,246,0.1)"
                        : "rgba(255,255,255,0.02)",
                    border: `1px solid ${reportReason === r ? "rgba(139,92,246,0.3)" : "rgba(255,255,255,0.07)"}`,
                  }}
                >
                  <input
                    type="radio"
                    name="report"
                    value={r}
                    checked={reportReason === r}
                    onChange={() => setReportReason(r)}
                    className="accent-violet-500"
                  />
                  <span className="text-sm text-white/65">{r}</span>
                </label>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-1">
              <button
                onClick={() => setReportOpen(false)}
                className="flex-1 h-10 rounded-xl text-sm font-semibold transition-all hover:bg-white/10"
                style={{
                  backgroundColor: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "rgba(255,255,255,0.55)",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleReport}
                disabled={reportLoading || !reportReason}
                className="flex-1 h-10 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                style={{
                  backgroundColor: "rgba(239,68,68,0.15)",
                  border: "1px solid rgba(239,68,68,0.3)",
                  color: "#f87171",
                }}
              >
                {reportLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Flag className="w-4 h-4" />
                )}
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
