"use client";

import { motion } from "framer-motion";
import { UserPlus, Pencil, Globe, BookOpen, ArrowRight } from "lucide-react";

const STEPS = [
  {
    num: "01",
    icon: UserPlus,
    color: "#a78bfa",
    title: "Create your account",
    desc: "Sign up free with email or Google. No credit card required. Ready in seconds.",
  },
  {
    num: "02",
    icon: Pencil,
    color: "#60a5fa",
    title: "Write a life lesson",
    desc: "Pick a category and emotional tone. Tell your story. Set it public or private.",
  },
  {
    num: "03",
    icon: Globe,
    color: "#34d399",
    title: "Share with the world",
    desc: "Your lesson goes live on the public feed. Others can save, like and comment.",
  },
  {
    num: "04",
    icon: BookOpen,
    color: "#fbbf24",
    title: "Learn from others",
    desc: "Browse by category or tone. Save favorites. Build your personal wisdom library.",
  },
];

export default function HowItWorks() {
  return (
    <section className=" px-4">
      <div className="max-w-5xl mx-auto flex flex-col gap-14">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center flex flex-col gap-3"
        >
          <span className="text-[10px] font-bold tracking-[3px] uppercase text-violet-400/70">
            How it works
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-white">
            Three steps to get started
          </h2>
          <p className="text-base text-white/40 max-w-lg mx-auto leading-relaxed">
            Start preserving and sharing life lessons in under 2 minutes.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative">
          {/* Connector line — desktop only */}
          <div
            className="absolute top-10 left-[12.5%] right-[12.5%] h-px hidden lg:block"
            style={{
              background:
                "linear-gradient(90deg, rgba(139,92,246,0) 0%, rgba(139,92,246,0.25) 30%, rgba(139,92,246,0.25) 70%, rgba(139,92,246,0) 100%)",
            }}
          />

          {STEPS.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex flex-col gap-4 p-6 rounded-2xl relative"
              style={{
                backgroundColor: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              {/* Number badge */}
              <div className="flex items-center justify-between">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center"
                  style={{
                    backgroundColor: `${step.color}12`,
                    border: `1px solid ${step.color}20`,
                  }}
                >
                  <step.icon
                    className="w-5 h-5"
                    style={{ color: step.color }}
                  />
                </div>
                <span
                  className="text-3xl font-black"
                  style={{ color: "rgba(255,255,255,0.06)" }}
                >
                  {step.num}
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-white leading-snug">
                  {step.title}
                </h3>
                <p className="text-sm text-white/40 mt-2 leading-relaxed">
                  {step.desc}
                </p>
              </div>

              {/* Arrow connector — mobile */}
              {i < STEPS.length - 1 && (
                <div className="flex lg:hidden justify-center mt-1">
                  <ArrowRight
                    className="w-4 h-4 rotate-90"
                    style={{ color: "rgba(255,255,255,0.15)" }}
                  />
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex justify-center"
        >
          <div className="flex items-center gap-6 flex-wrap justify-center text-sm text-white/30">
            {[
              "No credit card required",
              "Free forever plan",
              "Cancel anytime",
            ].map((t, i) => (
              <span key={i} className="flex items-center gap-2">
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: "#34d399" }}
                />
                {t}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
