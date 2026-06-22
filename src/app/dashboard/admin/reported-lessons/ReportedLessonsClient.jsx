"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Flag,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  X,
  Loader2,
  Eye,
} from "lucide-react";
import { resolveReports, deleteLessonReport } from "@/lib/action/admin";
import Link from "next/link";

function ReasonsModal({ group, onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{
        backgroundColor: "rgba(0,0,0,0.75)",
        backdropFilter: "blur(6px)",
      }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl overflow-hidden"
        style={{
          backgroundColor: "#13131f",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
        >
          <div>
            <h3 className="text-base font-bold text-white">Report Details</h3>
            <p className="text-xs text-white/40 mt-0.5 truncate">
              {group.lessonTitle}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/10 text-white/50"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="flex flex-col divide-y divide-white/[0.06] max-h-96 overflow-y-auto">
          {group.reports.map((r, i) => (
            <div key={i} className="px-5 py-4 flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-white/60">
                  {r.reporterEmail || "Anonymous"}
                </p>
                <span className="text-[10px] text-white/25">
                  {r.createdAt
                    ? new Date(r.createdAt).toLocaleDateString()
                    : "—"}
                </span>
              </div>
              <p className="text-sm text-white/80 leading-relaxed">
                {r.reason}
              </p>
              {r.resolved && (
                <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Resolved
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ReportedLessonsClient({ initialReports }) {
  const [reports, setReports] = useState(initialReports);
  const [viewingGroup, setViewingGroup] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  async function handleResolve(group) {
    setActionLoading(group.lessonId + "resolve");
    const result = await resolveReports(group.lessonId);
    if (result.success) {
      setReports((prev) =>
        prev.map((r) =>
          r.lessonId === group.lessonId ? { ...r, resolved: true } : r,
        ),
      );
      toast.success("Reports resolved — lesson kept live");
    } else toast.error("Failed");
    setActionLoading(null);
  }

  async function handleDelete(group) {
    setActionLoading(group.lessonId + "delete");
    const result = await deleteLessonReport(group.lessonId);
    if (result.success) {
      setReports((prev) => prev.filter((r) => r.lessonId !== group.lessonId));
      toast.success("Lesson deleted");
    } else toast.error("Failed");
    setActionLoading(null);
  }

  return (
    <>
      {viewingGroup && (
        <ReasonsModal
          group={viewingGroup}
          onClose={() => setViewingGroup(null)}
        />
      )}

      {reports.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center py-20 rounded-2xl text-center gap-3"
          style={{
            backgroundColor: "rgba(255,255,255,0.018)",
            border: "1px dashed rgba(255,255,255,0.08)",
          }}
        >
          <CheckCircle2 className="w-12 h-12 text-emerald-400/30" />
          <p className="text-sm text-white/40">
            No reported lessons — platform looks clean!
          </p>
        </div>
      ) : (
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            backgroundColor: "rgba(255,255,255,0.018)",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <div
            className="grid px-5 py-3"
            style={{
              gridTemplateColumns: "2fr 1.5fr 0.8fr 0.8fr 2fr",
              borderBottom: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            {["Lesson", "Author", "Reports", "Status", "Actions"].map((h) => (
              <p
                key={h}
                className="text-[10px] font-bold uppercase tracking-widest text-white/25"
              >
                {h}
              </p>
            ))}
          </div>

          {reports.map((group, i) => {
            const isLast = i === reports.length - 1;
            const isResolving = actionLoading === group.lessonId + "resolve";
            const isDeleting = actionLoading === group.lessonId + "delete";

            return (
              <div
                key={group.lessonId}
                className="grid items-center px-5 py-4 hover:bg-white/[0.02] transition-colors"
                style={{
                  gridTemplateColumns: "2fr 1.5fr 0.8fr 0.8fr 2fr",
                  borderBottom: isLast
                    ? "none"
                    : "1px solid rgba(255,255,255,0.05)",
                }}
              >
                {/* Title */}
                <p className="text-sm font-semibold text-white truncate">
                  {group.lessonTitle}
                </p>

                {/* Author */}
                <p className="text-xs text-white/40 truncate">
                  {group.lessonAuthor}
                </p>

                {/* Count */}
                <div className="flex items-center gap-1 text-sm font-bold text-red-400">
                  <Flag className="w-3.5 h-3.5" /> {group.reportCount}
                </div>

                {/* Status */}
                <span
                  className="text-[11px] font-semibold px-2 py-1 rounded-full w-fit"
                  style={
                    group.resolved
                      ? {
                          backgroundColor: "rgba(52,211,153,0.08)",
                          color: "#34d399",
                          border: "1px solid rgba(52,211,153,0.2)",
                        }
                      : {
                          backgroundColor: "rgba(248,113,113,0.08)",
                          color: "#f87171",
                          border: "1px solid rgba(248,113,113,0.2)",
                        }
                  }
                >
                  {group.resolved ? "Resolved" : "Pending"}
                </span>

                {/* Actions */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setViewingGroup(group)}
                    className="h-7 px-2.5 rounded-lg text-[11px] font-semibold flex items-center gap-1 hover:bg-white/10 transition-all"
                    style={{ color: "rgba(255,255,255,0.5)" }}
                  >
                    <Eye className="w-3 h-3" /> View Reports
                  </button>

                  {!group.resolved && (
                    <button
                      onClick={() => handleResolve(group)}
                      disabled={!!actionLoading}
                      className="h-7 px-2 rounded-lg text-[11px] font-semibold flex items-center gap-1 hover:bg-emerald-500/10 transition-all disabled:opacity-50"
                      style={{ color: "#34d399" }}
                    >
                      {isResolving ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <CheckCircle2 className="w-3 h-3" />
                      )}
                      Ignore
                    </button>
                  )}

                  <button
                    onClick={() => handleDelete(group)}
                    disabled={!!actionLoading}
                    className="h-7 px-2 rounded-lg text-[11px] font-semibold flex items-center gap-1 hover:bg-red-500/10 transition-all disabled:opacity-50"
                    style={{ color: "#f87171" }}
                  >
                    {isDeleting ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <Trash2 className="w-3 h-3" />
                    )}
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
