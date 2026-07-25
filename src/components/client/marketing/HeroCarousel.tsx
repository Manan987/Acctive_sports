"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

type Slide = {
  eyebrow: string;
  title: React.ReactNode;
  subtitle: string;
  ctaHref: string;
  ctaLabel: string;
  altHref: string;
  altLabel: string;
  gradient: string;
  accent: string;
};

const SLIDES: Slide[] = [
  {
    eyebrow: "🏆 Team Kits · Made to Order",
    title: (
      <>
        Custom sportswear that{" "}
        <span className="gradient-text-animated">performs &amp; pops</span>
      </>
    ),
    subtitle:
      "Vibrant sublimated jerseys, shorts, lowers & tracksuits — designed to your brief and manufactured in-house.",
    ctaHref: "/catalogue",
    ctaLabel: "Browse Catalogue",
    altHref: "/contact",
    altLabel: "Get Free Quote",
    gradient: "from-ink-950 via-ink-900 to-flame-900/50",
    accent: "bg-flame-500/30",
  },
  {
    eyebrow: "🎨 Full Sublimation Printing",
    title: (
      <>
        Colours that never{" "}
        <span className="gradient-text-animated">fade or crack</span>
      </>
    ),
    subtitle:
      "Edge-to-edge, professional-grade printing on premium fabrics — Lycra, Superpoly, SAP Mattie & more.",
    ctaHref: "/catalogue?category=round-neck-t-shirts",
    ctaLabel: "See Jerseys",
    altHref: "/about",
    altLabel: "Our Process",
    gradient: "from-ink-950 via-ink-900 to-electric-600/40",
    accent: "bg-electric-500/25",
  },
  {
    eyebrow: "🚚 Bulk Orders · Factory Direct",
    title: (
      <>
        Kit out your whole{" "}
        <span className="gradient-text-animated">team or brand</span>
      </>
    ),
    subtitle:
      "From academies and clubs to schools and retail labels — factory pricing with pan-India delivery.",
    ctaHref: "/catalogue",
    ctaLabel: "Shop Bulk Kits",
    altHref: "/contact",
    altLabel: "Talk to Us",
    gradient: "from-ink-950 via-flame-950 to-ink-900",
    accent: "bg-flame-500/20",
  },
];

const STATS = [
  { value: "145+", label: "Designs" },
  { value: "8", label: "Sports" },
  { value: "10K+", label: "Kits Delivered" },
  { value: "100%", label: "Customizable" },
];

export function HeroCarousel() {
  const [index, setIndex] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const go = useCallback((i: number) => setIndex((i + SLIDES.length) % SLIDES.length), []);

  const start = useCallback(() => {
    if (timer.current) clearInterval(timer.current);
    timer.current = setInterval(() => setIndex((v) => (v + 1) % SLIDES.length), 6000);
  }, []);
  const stop = () => {
    if (timer.current) clearInterval(timer.current);
  };

  useEffect(() => {
    start();
    return stop;
  }, [start]);

  return (
    <section
      className="relative overflow-hidden bg-ink-950 text-white"
      onMouseEnter={stop}
      onMouseLeave={start}
      aria-roledescription="carousel"
    >
      {/* Slides */}
      <div className="relative min-h-[580px] md:min-h-[640px]">
        {SLIDES.map((slide, i) => (
          <div
            key={i}
            className={`transition-opacity duration-700 ${
              i === index ? "opacity-100" : "pointer-events-none absolute inset-0 opacity-0"
            }`}
            aria-hidden={i !== index}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${slide.gradient}`} />
            <div className="absolute inset-0 bg-grid opacity-40" />
            {/* Glow orbs */}
            <div className={`absolute -left-24 top-10 h-96 w-96 rounded-full ${slide.accent} blur-[130px]`} />
            <div className="absolute -right-16 bottom-0 h-80 w-80 rounded-full bg-electric-500/15 blur-[120px]" />
            <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-flame-500/10 blur-[100px]" />

            <div className="container-x relative grid gap-10 py-16 md:grid-cols-2 md:items-center md:py-24 lg:py-28">
              {/* Text */}
              <div className="max-w-xl">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-sm font-semibold backdrop-blur-sm">
                  {slide.eyebrow}
                </span>
                <h1 className="mt-6 font-display text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
                  {slide.title}
                </h1>
                <p className="mt-5 text-lg leading-relaxed text-ink-200">{slide.subtitle}</p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    href={slide.ctaHref}
                    className="btn-primary btn-lg pulse-glow group relative overflow-hidden"
                  >
                    <span className="relative z-10">{slide.ctaLabel}</span>
                    <span className="absolute inset-0 -translate-x-full bg-white/20 transition-transform duration-300 group-hover:translate-x-0" />
                  </Link>
                  <Link
                    href={slide.altHref}
                    className="btn-lg btn border border-white/25 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20"
                  >
                    {slide.altLabel}
                  </Link>
                </div>

                {/* Mini stats */}
                <div className="mt-10 grid grid-cols-4 gap-3">
                  {STATS.map((s) => (
                    <div key={s.label} className="text-center">
                      <div className="font-display text-xl font-extrabold text-flame-400 sm:text-2xl">{s.value}</div>
                      <div className="mt-0.5 text-[10px] uppercase tracking-wide text-ink-400">{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Visual panel */}
              <div className="relative hidden md:flex md:items-center md:justify-center">
                {/* Main card */}
                <div className="animate-float relative mx-auto w-72 overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/50 backdrop-blur-sm lg:w-80">
                  <div className="grid grid-cols-2 gap-3">
                    {["🏏 Cricket", "⚽ Football", "🏀 Basketball", "🏸 Badminton"].map((s) => (
                      <div key={s} className="flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2.5 text-sm font-medium">
                        {s}
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 rounded-2xl bg-gradient-to-br from-flame-500/20 to-electric-500/20 p-4 text-center">
                    <p className="text-3xl font-extrabold text-flame-400">145+</p>
                    <p className="text-xs text-ink-300">designs ready to customize</p>
                  </div>
                  <Link href="/catalogue" className="btn-primary mt-4 w-full text-sm">
                    Shop Now →
                  </Link>
                </div>

                {/* Floating badges */}
                <div className="absolute -left-4 top-8 rounded-2xl border border-white/10 bg-white/10 px-3 py-2 backdrop-blur-md">
                  <p className="text-xs font-bold text-flame-400">✓ Free Mockup</p>
                </div>
                <div className="absolute -right-2 bottom-12 rounded-2xl border border-white/10 bg-white/10 px-3 py-2 backdrop-blur-md">
                  <p className="text-xs font-bold text-electric-400">🚚 Pan-India</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="container-x relative flex items-center justify-between pb-8">
        <div className="flex gap-2">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? "w-10 bg-flame-500" : "w-4 bg-white/25 hover:bg-white/50"
              }`}
            />
          ))}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => go(index - 1)}
            aria-label="Previous slide"
            className="grid h-9 w-9 place-items-center rounded-full border border-white/20 text-white transition hover:bg-white/10"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M15 18l-6-6 6-6" /></svg>
          </button>
          <button
            onClick={() => go(index + 1)}
            aria-label="Next slide"
            className="grid h-9 w-9 place-items-center rounded-full border border-white/20 text-white transition hover:bg-white/10"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 18l6-6-6-6" /></svg>
          </button>
        </div>
      </div>
    </section>
  );
}
