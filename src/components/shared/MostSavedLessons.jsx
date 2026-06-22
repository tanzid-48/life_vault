"use client";

import { motion } from "framer-motion";
import LessonCard from "@/components/LessonCard";
import Link from "next/link";
import { Bookmark } from "lucide-react";

export default function MostSavedLessons({ lessons, currentUser }) {
  if (!lessons?.length) return null;

  return (
    <section
      className="py-12 px-4 pb-28"
      style={{ backgroundColor: "rgba(255,255,255,0.01)" }}
    >
      <div className="max-w-6xl mx-auto flex flex-col gap-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex items-end justify-between flex-wrap gap-4"
        >
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Bookmark className="w-5 h-5 text-pink-400" />
              <span className="text-[10px] font-bold tracking-[3px] uppercase text-pink-400/70">
                Community Favorites
              </span>
            </div>
            <h2 className="text-3xl font-black text-white">
              Most Saved Lessons
            </h2>
            <p className="text-sm text-white/40 mt-1">
              Lessons people can&apos;t stop bookmarking
            </p>
          </div>
          <Link
            href="/lessons?sort=popular"
            className="text-sm font-semibold text-violet-400 hover:text-violet-300 transition-colors"
          >
            View all →
          </Link>
        </motion.div>

        {/* Horizontal scroll on mobile, grid on desktop */}
        <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {lessons.map((lesson, i) => (
            <motion.div
              key={lesson._id?.$oid || lesson._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <div className="relative">
                {/* Save count badge */}
                {lesson.saveCount > 0 && (
                  <div
                    className="absolute top-3 right-3 z-10 flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(236,72,153,0.9), rgba(219,39,119,0.9))",
                      color: "#fff",
                    }}
                  >
                    <Bookmark className="w-3 h-3 fill-current" />{" "}
                    {lesson.saveCount}
                  </div>
                )}
                <LessonCard lesson={lesson} currentUser={currentUser} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mobile horizontal scroll */}
        <div
          className="sm:hidden flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory"
          style={{ scrollbarWidth: "none" }}
        >
          {lessons.map((lesson, i) => (
            <motion.div
              key={lesson._id?.$oid || lesson._id}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="shrink-0 w-[280px] snap-start relative"
            >
              {lesson.saveCount > 0 && (
                <div
                  className="absolute top-3 left-3 z-10 flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(236,72,153,0.9), rgba(219,39,119,0.9))",
                    color: "#fff",
                  }}
                >
                  <Bookmark className="w-3 h-3 fill-current" />{" "}
                  {lesson.saveCount}
                </div>
              )}
              <LessonCard lesson={lesson} currentUser={currentUser} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
