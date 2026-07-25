"use client";

import Link from "next/link";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

type Slide = {
  eyebrow: string;
  title: React.ReactNode;
  subtitle: string;
  ctaHref: string;
  ctaLabel: string;
  altHref: string;
  altLabel: string;
  gradient: string; // tailwind gradient classes
};

const SLIDES: Slide[] = [
  {
    eyebrow: "Team Kits · Made to Order",
    title: (
      <>
        Custom sportswear that{" "}
        <span className="gradient-text">performs &amp; pops</span>
      </>
    ),
    subtitle:
      "Vibrant sublimated jerseys, shorts, lowers & tracksuits — designed to your brief and manufactured in-house.",
    ctaHref: "/catalogue",
    ctaLabel: "Browse Catalogue",
    altHref: "/contact",
    altLabel: "Talk to Us",
    gradient: "from-ink-950 via-ink-900 to-flame-900/50",
  },
  {
    eyebrow: "Full Sublimation",
    title: (
      <>
        Colours that never{" "}
        <span className="gradient-text">fade or crack</span>
      </>
    ),
    subtitle:
      "Edge-to-edge, professional-grade printing on premium fabrics — Lycra, Superpoly, SAP Mattie & more.",
    ctaHref: "/catalogue?category=round-neck-t-shirts",
    ctaLabel: "See Jerseys",
    altHref: "/about",
    altLabel: "Our Process",
    gradient: "from-ink-950 via-ink-900 to-electric-600/40",
  },
  {
    eyebrow: "Bulk Orders · Factory Direct",
    title: (
      <>
        Kit out your whole{" "}
        <span className="gradient-text">team or brand</span>
      </>
    ),
    subtitle:
      "From academies and clubs to schools and retail labels — factory pricing with pan-India delivery.",
    ctaHref: "/catalogue",
    ctaLabel: "Shop Bulk Kits",
    altHref: "/contact",
    altLabel: "Talk to Us",
    gradient: "from-ink-950 via-flame-950 to-ink-900",
  },
];

export function HeroCarousel() {
  const [index, setIndex] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const go = useCallback((i: number) => setIndex((i + SLIDES.length) % SLIDES.length), []);

  const start = useCallback(() => {
    stop();
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
      <div className="relative">
        {SLIDES.map((slide, i) => (
          <div
            key={i}
            className={`transition-opacity duration-700 ${
              i === index ? "opacity-100" : "pointer-events-none absolute inset-0 opacity-0"
            }`}
            aria-hidden={i !== index}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${slide.gradient}`} />
            <div className="absolute inset-0 bg-grid opacity-60" />
            <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-flame-500/30 blur-[120px]" />
            <div className="absolute -right-16 bottom-0 h-80 w-80 rounded-full bg-electric-500/20 blur-[120px]" />

            <div className="container-x relative grid gap-8 py-16 md:grid-cols-2 md:items-center md:py-24 lg:py-28">
              <div className="max-w-xl">
                <span className="badge bg-white/10 text-white ring-1 ring-white/15">
                  {slide.eyebrow}
                </span>
                <h1 className="mt-5 font-display text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
                  {slide.title}
                </h1>
                <p className="mt-5 text-lg text-ink-200">{slide.subtitle}</p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link href={slide.ctaHref} className="btn-primary btn-lg">
                    {slide.ctaLabel}
                  </Link>
                  <Link
                    href={slide.altHref}
                    className="btn-lg btn border border-white/25 bg-white/10 text-white hover:bg-white/20"
                  >
                    {slide.altLabel}
                  </Link>
                </div>
              </div>

              <div className="relative hidden md:block">
                <div className="relative mx-auto aspect-[4/5] w-full max-w-sm rotate-2 overflow-hidden rounded-3xl border border-white/10 shadow-2xl shadow-black/40 transition hover:rotate-0">
                  <Image
                    src="/placeholder-product.svg"
                    alt="ACCTIVE custom sportswear"
                    fill
                    priority={i === 0}
                    className="object-cover"
                  />
                </div>
                <div className="absolute -bottom-4 -left-2 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur-md">
                  <p className="text-2xl font-extrabold text-flame-400">145+</p>
                  <p className="text-xs text-ink-200">designs ready to customize</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="container-x relative flex items-center justify-between pb-6">
        <div className="flex gap-2">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? "w-8 bg-flame-500" : "w-4 bg-white/30 hover:bg-white/50"
              }`}
            />
          ))}
        </div>
        <div className="hidden gap-2 sm:flex">
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
