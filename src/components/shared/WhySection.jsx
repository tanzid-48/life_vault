"use client";

import { motion } from "framer-motion";
import { Brain, BookHeart, Users, Lightbulb } from "lucide-react";

const CARDS = [
  {
    icon: Brain,
    color: "#a78bfa",
    title: "Don't Forget What Matters",
    desc: "Our brains forget up to 70% of new information within 24 hours. Writing lessons down locks them in permanently.",
  },
  {
    icon: BookHeart,
    color: "#f472b6",
    title: "Reflect to Grow",
    desc: "The act of writing a lesson forces you to think deeply about what truly happened and what it meant.",
  },
  {
    icon: Lightbulb,
    color: "#fbbf24",
    title: "Learn From Others",
    desc: "Why make every mistake yourself? Browse thousands of real lessons from real people who've been there.",
  },
  {
    icon: Users,
    color: "#34d399",
    title: "Build a Wisdom Community",
    desc: "Share your hard-won insights with people who need them. Your experience might change someone's life.",
  },
];

export default function WhySection() {
  return (
    <section
      className="py-20 px-4"
      style={{ backgroundColor: "rgba(255,255,255,0.01)" }}
    >
      <div className="max-w-6xl mx-auto flex flex-col gap-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center flex flex-col gap-3"
        >
          <span className="text-[10px] font-bold tracking-[3px] uppercase text-violet-400/70">
            Why It Matters
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-white">
            Why learning from life matters
          </h2>
          <p className="text-base text-white/40 max-w-xl mx-auto leading-relaxed">
            Every experience carries a lesson. Most people forget them.
            LifeVault helps you keep every one.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {CARDS.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{
                duration: 0.5,
                delay: i * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="flex flex-col gap-4 p-6 rounded-2xl cursor-default"
              style={{
                backgroundColor: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center"
                style={{
                  backgroundColor: `${card.color}12`,
                  border: `1px solid ${card.color}20`,
                }}
              >
                <card.icon className="w-6 h-6" style={{ color: card.color }} />
              </div>
              <div>
                <h3 className="text-base font-bold text-white leading-snug">
                  {card.title}
                </h3>
                <p className="text-sm text-white/40 mt-2 leading-relaxed">
                  {card.desc}
                </p>
              </div>
              {/* Bottom accent line */}
              <div
                className="h-0.5 w-12 rounded-full mt-auto"
                style={{ backgroundColor: card.color, opacity: 0.4 }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
