"use client";

import { useState } from "react";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function WeeklyChart({ weeklyData }) {
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const maxVal = Math.max(...weeklyData, 1);
  const today = new Date().getDay(); // 0=Sun, 1=Mon...
  // convert to Mon-based index (Mon=0 ... Sun=6)
  const todayIdx = today === 0 ? 6 : today - 1;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-end justify-between gap-2 h-32">
        {weeklyData.map((count, i) => {
          const heightPct = Math.max((count / maxVal) * 100, 3);
          const isToday = i === todayIdx;
          const isHovered = hoveredIdx === i;
          const hasData = count > 0;

          return (
            <div
              key={i}
              className="flex flex-col items-center gap-1.5 flex-1 group cursor-default"
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              {/* Tooltip */}
              <div
                className={`transition-all duration-150 ${isHovered ? "opacity-100 -translate-y-1" : "opacity-0 translate-y-0"}`}
              >
                <div
                  className="px-2 py-1 rounded-lg text-[10px] font-bold text-white whitespace-nowrap"
                  style={{ backgroundColor: "rgba(139,92,246,0.9)" }}
                >
                  {count} lesson{count !== 1 ? "s" : ""}
                </div>
              </div>

              {/* Bar */}
              <div
                className="w-full relative rounded-t-lg transition-all duration-500"
                style={{
                  height: `${heightPct}%`,
                  background: isToday
                    ? "linear-gradient(180deg, #a78bfa, #7c3aed)"
                    : hasData
                      ? isHovered
                        ? "rgba(139,92,246,0.45)"
                        : "rgba(139,92,246,0.25)"
                      : isHovered
                        ? "rgba(255,255,255,0.08)"
                        : "rgba(255,255,255,0.04)",
                  boxShadow: isToday ? "0 0 12px rgba(139,92,246,0.4)" : "none",
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Day labels */}
      <div className="flex items-center justify-between gap-2">
        {DAYS.map((day, i) => {
          const isToday =
            i === (new Date().getDay() === 0 ? 6 : new Date().getDay() - 1);
          return (
            <p
              key={day}
              className="flex-1 text-center text-[10px] font-medium"
              style={{ color: isToday ? "#a78bfa" : "rgba(255,255,255,0.25)" }}
            >
              {day}
            </p>
          );
        })}
      </div>
    </div>
  );
}
