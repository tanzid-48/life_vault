"use client";

import { motion } from "framer-motion";

import Link from "next/link";
import { Star } from "lucide-react";
import LessonCard from "../LessonCard";

export default function FeaturedLessons({ lessons, currentUser }) {
  if (!lessons?.length) return null;

  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto flex flex-col gap-10">
        {/* Header */}
        <div className="flex items-end justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div
                className="w-6 h-6 rounded-lg flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg, #fbbf24, #f59e0b)",
                }}
              >
                <Star className="w-3.5 h-3.5 text-black fill-black" />
              </div>
              <span className="text-[10px] font-bold tracking-[3px] uppercase text-amber-400/70">
                Curated by Admin
              </span>
            </div>
            <h2 className="text-3xl font-black text-white">
              Featured Life Lessons
            </h2>
            <p className="text-sm text-white/40 mt-1">
              Handpicked wisdom from our community
            </p>
          </div>
          <Link
            href="/lessons"
            className="text-sm font-semibold text-violet-400 hover:text-violet-300 transition-colors"
          >
            View all →
          </Link>
        </div>

        {/* Grid with stagger */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {lessons.map((lesson, i) => (
            <motion.div
              key={lesson._id?.$oid || lesson._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.5,
                delay: i * 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <LessonCard lesson={lesson} currentUser={currentUser} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
