"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function LessonsPagination({ currentPage, totalPages }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  function goToPage(page) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    router.push(`${pathname}?${params.toString()}`);
  }

  const pages = [];
  const start = Math.max(1, currentPage - 2);
  const end = Math.min(totalPages, start + 4);
  for (let p = start; p <= end; p++) pages.push(p);

  return (
    <div className="flex items-center justify-center gap-1.5 mt-10">
      <button
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
        className="h-9 w-9 flex items-center justify-center rounded-lg text-white/60 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
        style={{ border: "1px solid rgba(255,255,255,0.1)" }}
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {start > 1 && (
        <>
          <button
            onClick={() => goToPage(1)}
            className="h-9 w-9 rounded-lg text-sm font-medium text-white/60 hover:text-white transition-colors"
            style={{ border: "1px solid rgba(255,255,255,0.1)" }}
          >
            1
          </button>
          {start > 2 && <span className="text-white/30 px-1">…</span>}
        </>
      )}

      {pages.map((p) => (
        <button
          key={p}
          onClick={() => goToPage(p)}
          className="h-9 w-9 rounded-lg text-sm font-semibold transition-colors"
          style={{
            backgroundColor:
              p === currentPage ? "rgba(139,92,246,0.9)" : "transparent",
            color: p === currentPage ? "#fff" : "rgba(255,255,255,0.6)",
            border: `1px solid ${p === currentPage ? "rgba(139,92,246,0.9)" : "rgba(255,255,255,0.1)"}`,
          }}
        >
          {p}
        </button>
      ))}

      {end < totalPages && (
        <>
          {end < totalPages - 1 && (
            <span className="text-white/30 px-1">…</span>
          )}
          <button
            onClick={() => goToPage(totalPages)}
            className="h-9 w-9 rounded-lg text-sm font-medium text-white/60 hover:text-white transition-colors"
            style={{ border: "1px solid rgba(255,255,255,0.1)" }}
          >
            {totalPages}
          </button>
        </>
      )}

      <button
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="h-9 w-9 flex items-center justify-center rounded-lg text-white/60 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
        style={{ border: "1px solid rgba(255,255,255,0.1)" }}
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
