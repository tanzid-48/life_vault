"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { Star, ArrowRight, PenLine, TrendingUp } from "lucide-react";

// ── Floating avatar bubbles 
const COLORS = [
  "from-violet-500 to-purple-600",
  "from-blue-500 to-cyan-500",
  "from-pink-500 to-rose-500",
];

const SLIDES = [
  {
    badgeIcon: Star,
    badge: "Curated Wisdom",
    heading: ["Discover", "Perspectives", "That Resonate"],
    body: "Browse a public library of life lessons shared by others. Mark your favorites, organize by theme, and accelerate your personal growth through shared experience.",
    cta: { label: "Explore Library", href: "/lessons" },
    image:
      "https://images.unsplash.com/photo-1523292217652-bf4fb04a6fb7?auto=format&fit=crop&w=900&q=80",
    overlayLabel: "Featured Lesson",
    overlayText: "The best lessons come from the hardest experiences.",
    metric: { value: "4.9", label: "Rating" },
  },
  {
    badgeIcon: PenLine,
    badge: "Share Your Story",
    heading: ["Write The", "Lesson You", "Wish You'd Read"],
    body: "Put your own hard-won wisdom into words. Tag it by category, choose who sees it, and let your experience save someone else a few hard years.",
    cta: { label: "Write a Lesson", href: "/dashboard/user/my-lessons" },
    image:
      "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=900&q=80",
    overlayLabel: "From the Community",
    overlayText: "I wish someone had told me this at twenty-two.",
    metric: { value: "1.2K", label: "Lessons" },
  },
  {
    badgeIcon: TrendingUp,
    badge: "Track Your Growth",
    heading: ["Turn What You", "Read Into", "What You Live"],
    body: "Save lessons that matter, mark which ones you're actually practicing, and watch a quiet record of your own growth build up over time.",
    cta: { label: "View My Progress", href: "/dashboard/user/progress" },
    image:
      "https://images.unsplash.com/photo-1707572387604-9beccf2c1977?auto=format&fit=crop&w=900&q=80",
    overlayLabel: "Your Journal",
    overlayText: "Twelve lessons saved. Three you're still working on.",
    metric: { value: "92%", label: "Stay Active" },
  },
];

export default function HeroSection() {
  const [api, setApi] = useState(null);
  const [current, setCurrent] = useState(0);
  const [autoplay] = useState(() =>
    Autoplay({ delay: 6000, stopOnInteraction: false }),
  );

  useEffect(() => {
    if (!api) return;

    const carouselApi = api;
    const onSelect = () => setCurrent(carouselApi.selectedScrollSnap());

    onSelect();
    carouselApi.on("select", onSelect);
    return () => carouselApi.off("select", onSelect);
  }, [api]);

  return (
    <section className="relative min-h-[88vh] bg-[#080810] flex items-center overflow-hidden">
      {/* Background glow orbs */}
      <div className="pointer-events-none">
        <div className="absolute top-1/4  left-1/3  w-[500px] h-[500px] rounded-full bg-violet-600/15 blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] rounded-full bg-purple-700/10 blur-[80px]" />
        <div className="absolute top-0   right-0    w-[200px] h-[200px] rounded-full bg-indigo-600/10 blur-[60px]" />
      </div>

      <div className="relative mx-auto max-w-5xl px-6 lg:px-8 py-20 w-full">
        <Carousel
          setApi={setApi}
          opts={{ loop: true }}
          plugins={[autoplay]}
          className="w-full"
        >
          <CarouselContent>
            {SLIDES.map((slide, index) => {
              const BadgeIcon = slide.badgeIcon;
              return (
                <CarouselItem key={slide.badge}>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    {/* ── Left: Text */}
                    <div>
                      {/* Badge */}
                      <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 mb-8 backdrop-blur-sm">
                        <BadgeIcon className="h-3.5 w-3.5 text-violet-400 fill-violet-400" />
                        <span className="text-sm font-medium text-white/60">
                          {slide.badge}
                        </span>
                      </div>

                      {/* Headline */}
                      <h1 className="text-5xl sm:text-[3.00 rem] font-black text-white leading-[1.08] tracking-tight mb-6">
                        {slide.heading[0]}
                        <br />
                        {slide.heading[1]}
                        <br />
                        <span className="text-white/25">
                          {slide.heading[2]}
                        </span>
                      </h1>

                      {/* Subtext */}
                      <p className="text-base text-white/45 leading-relaxed mb-10 max-w-md">
                        {slide.body}
                      </p>

                      {/* CTA Buttons */}
                      <div className="flex flex-wrap items-center gap-4">
                        <Button
                          className="rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white font-semibold gap-2 px-7 py-5 text-sm backdrop-blur-sm transition-all"
                          asChild
                        >
                          <Link href={slide.cta.href}>
                            {slide.cta.label} <ArrowRight className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Link
                          href="/#how-it-works"
                          className="text-sm font-medium text-white/40 hover:text-white/70 transition-colors"
                        >
                          How it works
                        </Link>
                      </div>
                    </div>

                    {/* ── Right: Image card  */}
                    <div className="relative flex items-center justify-center mt-6 lg:mt-0">
                      {/* Main card */}
                      <div className="relative w-full max-w-[440px] h-[220px] sm:h-[260px] lg:h-[300px] rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-black/60">
                        <Image
                          src={slide.image}
                          alt={slide.overlayLabel}
                          fill
                          priority={index === 0}
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                        <div className="absolute bottom-5 left-5 right-5">
                          <p className="text-xs font-semibold text-white/50 uppercase tracking-widest mb-1">
                            {slide.overlayLabel}
                          </p>
                          <p className="text-sm font-bold text-white leading-snug line-clamp-2">
                            {slide.overlayText}
                          </p>
                        </div>
                      </div>

                      {/* Floating: metric badge */}
                      <div className="hidden sm:flex absolute -top-5 -left-6 items-center gap-2.5 rounded-2xl bg-white/8 backdrop-blur-lg border border-white/12 px-4 py-3 shadow-xl">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-500/30">
                          <Star className="h-4 w-4 text-violet-300 fill-violet-300" />
                        </div>
                        <div>
                          <p className="text-sm font-extrabold text-white leading-none">
                            {slide.metric.value}
                          </p>
                          <p className="text-[10px] text-white/40 mt-0.5">
                            {slide.metric.label}
                          </p>
                        </div>
                      </div>

                      {/* Floating: Community badge */}
                      <div className="hidden sm:flex absolute -bottom-5 -right-4 items-center gap-3 rounded-2xl bg-white/8 backdrop-blur-lg border border-white/12 px-4 py-3 shadow-xl">
                        <div className="flex -space-x-2">
                          {COLORS.map((g, i) => (
                            <div
                              key={i}
                              className={`h-7 w-7 rounded-full bg-gradient-to-br ${g} border-2 border-[#080810] flex items-center justify-center text-[9px] font-bold text-white`}
                            >
                              {["A", "B", "C"][i]}
                            </div>
                          ))}
                          <div className="h-7 w-7 rounded-full bg-white/10 border-2 border-[#080810] flex items-center justify-center text-[9px] text-white/60 font-bold">
                            +99
                          </div>
                        </div>
                        <p className="text-xs text-white/60">
                          Join{" "}
                          <span className="text-white font-bold">10K+</span>{" "}
                          learners
                          <br />
                          <span className="text-[10px] text-white/35">
                            sharing wisdom
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>

          <CarouselPrevious className="left-2 lg:-left-4 bg-white/5 border-white/10 text-white hover:bg-white/15 hover:text-white" />
          <CarouselNext className="right-2 lg:-right-4 bg-white/5 border-white/10 text-white hover:bg-white/15 hover:text-white" />
        </Carousel>

        {/* Dot indicators */}
        <div className="flex justify-center gap-2 mt-10">
          {SLIDES.map((slide, index) => (
            <button
              key={slide.badge}
              type="button"
              onClick={() => api?.scrollTo(index)}
              aria-label={`Go to slide ${index + 1}`}
              className={`h-1.5 rounded-full transition-all ${
                current === index
                  ? "w-8 bg-white/70"
                  : "w-1.5 bg-white/20 hover:bg-white/40"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
