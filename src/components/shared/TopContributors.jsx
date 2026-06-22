"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { TrendingUp } from "lucide-react";

const RANK_COLORS = [
  "#fbbf24",
  "#9ca3af",
  "#fb923c",
  "#a78bfa",
  "#60a5fa",
  "#34d399",
];
const RANK_MEDALS = ["🥇", "🥈", "🥉"];

export default function TopContributors({ contributors }) {
  if (!contributors?.length) return null;

  return (
    <section className="py-16 px-4">
      <div className="max-w-3xl mx-auto flex flex-col items-center gap-10">
        {/* Header */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-violet-400" />
            <span className="text-[10px] font-bold tracking-[3px] uppercase text-violet-400/70">
              This Week
            </span>
          </div>
          <h2 className="text-3xl font-black text-white">Top Contributors</h2>
          <p className="text-sm text-white/40 mt-1">
            Most active wisdom sharers in the last 7 days
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {contributors.slice(0, 3).map((c, i) => {
            const initials =
              c.userName
                ?.split(" ")
                .map((w) => w[0])
                .slice(0, 2)
                .join("")
                .toUpperCase() || "U";

            return (
              <motion.div
                key={c._id || i}
                initial={{ opacity: 0, scale: 0.85 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="flex flex-col items-center gap-4 p-8 rounded-3xl text-center cursor-default w-full"
                style={{
                  backgroundColor: "rgba(255,255,255,0.02)",
                  border: `1px solid ${RANK_COLORS[i]}20`,
                }}
              >
                {/* Avatar */}
                <div className="relative">
                  <div
                    className="w-20 h-20 rounded-2xl overflow-hidden flex items-center justify-center text-2xl font-black"
                    style={{
                      backgroundColor: `${RANK_COLORS[i]}12`,
                      border: `2px solid ${RANK_COLORS[i]}30`,
                      color: RANK_COLORS[i],
                    }}
                  >
                    {c.userAvatar ? (
                      <Image
                        src={c.userAvatar}
                        alt={c.userName}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      initials
                    )}
                  </div>
                  {/* Rank badge */}
                  <div
                    className="absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-sm"
                    style={{
                      backgroundColor: "#0a0a12",
                      border: `1.5px solid ${RANK_COLORS[i]}50`,
                    }}
                  >
                    {RANK_MEDALS[i]}
                  </div>
                </div>

                {/* Info */}
                <div>
                  <p className="text-lg font-bold text-white truncate w-full">
                    {c.userName || "Anonymous"}
                  </p>
                  <p
                    className="text-sm mt-1 font-semibold"
                    style={{ color: RANK_COLORS[i] }}
                  >
                    {c.count} lesson{c.count !== 1 ? "s" : ""}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
