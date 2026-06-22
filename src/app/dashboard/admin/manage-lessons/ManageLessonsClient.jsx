"use client";

import { useState, useMemo } from "react";
import { toast } from "sonner";
import Link from "next/link";
import {
  Trash2,
  Star,
  Search,
  Filter,
  Eye,
  AlertTriangle,
  Check,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { deleteLesson, featureLesson, markReviewed } from "@/lib/action/admin";
import { useRouter } from "next/navigation";

const CATEGORIES = [
  "All",
  "Personal Growth",
  "Career",
  "Relationships",
  "Mindset",
  "Mistakes Learned",
];

function ConfirmModal({ title, desc, onConfirm, onCancel, loading }) {
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
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto"
          style={{
            backgroundColor: "rgba(248,113,113,0.1)",
            border: "1px solid rgba(248,113,113,0.2)",
          }}
        >
          <AlertTriangle className="w-6 h-6 text-red-400" />
        </div>
        <div className="text-center">
          <h3 className="text-base font-bold text-white">{title}</h3>
          <p className="text-sm text-white/45 mt-1.5">{desc}</p>
        </div>
        <div className="flex gap-3">
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
            className="flex-1 h-10 rounded-xl text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-50"
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
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ManageLessonsClient({ initialLessons }) {
    const router = useRouter();
  const [lessons, setLessons] = useState(initialLessons);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("All");
  const [accFilter, setAccFilter] = useState("All");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);

  const filtered = useMemo(
    () =>
      lessons.filter((l) => {
        if (catFilter !== "All" && l.category !== catFilter) return false;
        if (accFilter !== "All" && l.accessLevel !== accFilter.toLowerCase())
          return false;
        if (
          search &&
          !l.title?.toLowerCase().includes(search.toLowerCase()) &&
          !l.userName?.toLowerCase().includes(search.toLowerCase())
        )
          return false;
        return true;
      }),
    [lessons, catFilter, accFilter, search],
  );

  async function handleDelete() {
    if (!deleteTarget) return;
    const id = deleteTarget._id?.$oid || deleteTarget._id;
    setLoading(true);
    const result = await deleteLesson(id);
    if (result.success) {
      setLessons((prev) => prev.filter((l) => (l._id?.$oid || l._id) !== id));
      toast.success("Lesson deleted");
      router.refresh();
      setDeleteTarget(null);
    } else {
      toast.error(result.message || "Failed");
    }
    setLoading(false);
  }

  async function handleFeature(lesson) {
    const id = lesson._id?.$oid || lesson._id;
    const featured = !lesson.featured;
    setActionLoading(id + "feature");
    const result = await featureLesson(id, featured);
    if (result.success) {
      setLessons((prev) =>
        prev.map((l) =>
          (l._id?.$oid || l._id) === id ? { ...l, featured } : l,
        ),
      );
      toast.success(featured ? "Lesson featured ⭐" : "Removed from featured");
      router.refresh();
    } else toast.error("Failed");
    setActionLoading(null);
  }

  async function handleReview(lesson) {
    const id = lesson._id?.$oid || lesson._id;
    setActionLoading(id + "review");
    const result = await markReviewed(id);
    if (result.success) {
      setLessons((prev) =>
        prev.map((l) =>
          (l._id?.$oid || l._id) === id ? { ...l, reviewed: true } : l,
        ),
      );
      toast.success("Marked as reviewed");
      router.refresh();
    } else toast.error("Failed");
    setActionLoading(null);
  }

  return (
    <>
      {deleteTarget && (
        <ConfirmModal
          title="Delete Lesson?"
          desc={`"${deleteTarget.title}" will be permanently removed.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          loading={loading}
        />
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div
          className="flex items-center gap-3 flex-1 px-4 h-11 rounded-xl"
          style={{
            backgroundColor: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <Search className="w-4 h-4 text-white/30 shrink-0" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search lessons or authors…"
            className="flex-1 bg-transparent text-sm text-white placeholder:text-white/25 outline-none"
          />
        </div>
        <select
          value={accFilter}
          onChange={(e) => setAccFilter(e.target.value)}
          className="h-11 px-3 rounded-xl text-sm text-white outline-none"
          style={{
            backgroundColor: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <option value="All">All Access</option>
          <option value="Free">Free</option>
          <option value="Premium">Premium</option>
        </select>
      </div>

      {/* Category pills */}
      <div className="flex items-center gap-2 flex-wrap">
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

      <p className="text-xs text-white/30">
        Showing {filtered.length} of {lessons.length} lessons
      </p>

      {/* Table — desktop */}
      <div
        className="hidden md:block rounded-2xl overflow-hidden"
        style={{
          backgroundColor: "rgba(255,255,255,0.018)",
          border: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        <div
          className="grid px-5 py-3"
          style={{
            gridTemplateColumns: "2fr 1.2fr 1fr 0.6fr 0.6fr 0.6fr 1.8fr",
            borderBottom: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          {[
            "Lesson",
            "Author",
            "Category",
            "Views",
            "Reports",
            "Access",
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

        {filtered.map((lesson, i) => {
          const id = lesson._id?.$oid || lesson._id;
          const isLast = i === filtered.length - 1;
          const isFeaturing = actionLoading === id + "feature";
          const isReviewing = actionLoading === id + "review";

          return (
            <div
              key={id}
              className="grid items-center px-5 py-4 hover:bg-white/[0.02] transition-colors"
              style={{
                gridTemplateColumns: "2fr 1.2fr 1fr 0.6fr 0.6fr 0.6fr 1.8fr",
                borderBottom: isLast
                  ? "none"
                  : "1px solid rgba(255,255,255,0.05)",
              }}
            >
              {/* Title */}
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold text-violet-400"
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
                  <div className="flex items-center gap-1.5 mt-0.5">
                    {lesson.featured && (
                      <span className="text-[10px] text-amber-400 font-bold">
                        ⭐ Featured
                      </span>
                    )}
                    {lesson.reviewed && (
                      <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-0.5">
                        <CheckCircle2 className="w-2.5 h-2.5" /> Reviewed
                      </span>
                    )}
                    {lesson.reportCount > 0 && (
                      <span className="text-[10px] text-red-400 font-bold flex items-center gap-0.5">
                        <AlertTriangle className="w-2.5 h-2.5" />{" "}
                        {lesson.reportCount} reports
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Author */}
              <p className="text-xs text-white/45 truncate">
                {lesson.userName || "—"}
              </p>

              {/* Category */}
              <p className="text-xs text-white/45 truncate">
                {lesson.category}
              </p>

              {/* Views */}
              <div className="flex items-center gap-1 text-xs text-white/40">
                <Eye className="w-3.5 h-3.5" /> {lesson.views || 0}
              </div>

              {/* Reports */}
              <div
                className="flex items-center gap-1 text-xs"
                style={{
                  color:
                    lesson.reportCount > 0
                      ? "#f87171"
                      : "rgba(255,255,255,0.3)",
                }}
              >
                {lesson.reportCount > 0 && (
                  <AlertTriangle className="w-3.5 h-3.5" />
                )}
                {lesson.reportCount || 0}
              </div>

              {/* Access */}
              <span
                className="text-[11px] font-semibold px-2 py-1 rounded-full w-fit"
                style={
                  lesson.accessLevel === "premium"
                    ? {
                        backgroundColor: "rgba(245,158,11,0.08)",
                        color: "#fbbf24",
                        border: "1px solid rgba(245,158,11,0.2)",
                      }
                    : {
                        backgroundColor: "rgba(59,130,246,0.08)",
                        color: "#60a5fa",
                        border: "1px solid rgba(59,130,246,0.2)",
                      }
                }
              >
                {lesson.accessLevel || "free"}
              </span>

              {/* Actions */}
              <div className="flex items-center gap-1">
                <Link
                  href={`/lessons/${id}`}
                  className="h-7 px-2 rounded-lg text-[11px] font-semibold flex items-center hover:bg-white/10 transition-all"
                  style={{ color: "rgba(255,255,255,0.45)" }}
                >
                  View
                </Link>
                <button
                  onClick={() => handleFeature(lesson)}
                  disabled={!!actionLoading}
                  className="h-7 px-2 rounded-lg text-[11px] font-semibold flex items-center gap-1 hover:bg-amber-500/10 transition-all disabled:opacity-50"
                  style={{
                    color: lesson.featured
                      ? "#fbbf24"
                      : "rgba(255,255,255,0.35)",
                  }}
                >
                  {isFeaturing ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <Star className="w-3 h-3" />
                  )}
                  {lesson.featured ? "Unfeature" : "Feature"}
                </button>
                {!lesson.reviewed && (
                  <button
                    onClick={() => handleReview(lesson)}
                    disabled={!!actionLoading}
                    className="h-7 px-2 rounded-lg text-[11px] font-semibold flex items-center gap-1 hover:bg-emerald-500/10 transition-all disabled:opacity-50"
                    style={{ color: "rgba(52,211,153,0.7)" }}
                  >
                    {isReviewing ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <Check className="w-3 h-3" />
                    )}
                    Review
                  </button>
                )}
                <button
                  onClick={() => setDeleteTarget(lesson)}
                  className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-red-500/10 transition-all"
                  style={{ color: "rgba(248,113,113,0.7)" }}
                >
                  <Trash2 className="w-3.5 h-3.5" />
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
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white truncate">
                    {lesson.title}
                  </p>
                  <p className="text-xs text-white/35 mt-0.5">
                    {lesson.userName} · {lesson.category}
                  </p>
                </div>
                <button
                  onClick={() => setDeleteTarget(lesson)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 hover:bg-red-500/10"
                  style={{ color: "rgba(248,113,113,0.7)" }}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {lesson.featured && (
                  <span className="text-[11px] text-amber-400 font-bold">
                    ⭐ Featured
                  </span>
                )}
                {lesson.reportCount > 0 && (
                  <span className="text-[11px] text-red-400 font-bold">
                    {lesson.reportCount} reports
                  </span>
                )}
                <span className="text-[11px] text-white/30 flex items-center gap-1">
                  <Eye className="w-3 h-3" /> {lesson.views || 0}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleFeature(lesson)}
                  className="flex-1 h-8 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                  style={{
                    backgroundColor: "rgba(245,158,11,0.08)",
                    border: "1px solid rgba(245,158,11,0.2)",
                    color: "#fbbf24",
                  }}
                >
                  <Star className="w-3.5 h-3.5" />{" "}
                  {lesson.featured ? "Unfeature" : "Feature"}
                </button>
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
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
