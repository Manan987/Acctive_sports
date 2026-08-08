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
  accentFrom: string;
  accentTo: string;
  video: string;
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
    gradient: "from-ink-950/80 via-ink-900/60 to-flame-900/40",
    accentFrom: "from-flame-600",
    accentTo: "to-orange-400",
    video:
      "https://res.cloudinary.com/rdhqircc/video/upload/v1786214198/gemini_generated_video_D067D85B_tbm8lg.mp4",
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
    gradient: "from-ink-950/80 via-ink-900/60 to-electric-900/40",
    accentFrom: "from-electric-500",
    accentTo: "to-cyan-400",
    video:
      "https://res.cloudinary.com/rdhqircc/video/upload/v1786214195/gemini_generated_video_1A145FD7_k8kfmh.mp4",
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
    gradient: "from-ink-950/80 via-flame-950/60 to-ink-900/40",
    accentFrom: "from-flame-500",
    accentTo: "to-yellow-400",
    video:
      "https://res.cloudinary.com/rdhqircc/video/upload/v1786214194/gemini_generated_video_0452D33C_bxte0z.mp4",
  },
];

const STATS = [
  { value: "300+", label: "Designs" },
  { value: "8", label: "Sports" },
  { value: "10K+", label: "Kits Delivered" },
  { value: "100%", label: "Customizable" },
];

export function HeroCarousel() {
  const [index, setIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const go = useCallback(
    (i: number) => {
      if (isTransitioning) return;
      setIsTransitioning(true);
      setTimeout(() => {
        setIndex((i + SLIDES.length) % SLIDES.length);
        setIsTransitioning(false);
      }, 300);
    },
    [isTransitioning]
  );

  const start = useCallback(() => {
    if (timer.current) clearInterval(timer.current);
    timer.current = setInterval(
      () => setIndex((v) => (v + 1) % SLIDES.length),
      8000
    );
  }, []);

  const stop = useCallback(() => {
    if (timer.current) clearInterval(timer.current);
  }, []);

  useEffect(() => {
    start();
    return stop;
  }, [start, stop]);

  // Play the active video, pause others
  useEffect(() => {
    videoRefs.current.forEach((vid, i) => {
      if (!vid) return;
      if (i === index) {
        vid.currentTime = 0;
        vid.play().catch(() => {});
      } else {
        vid.pause();
      }
    });
  }, [index]);

  const slide = SLIDES[index];

  return (
    <section
      className="relative overflow-hidden bg-ink-950 text-white"
      onMouseEnter={stop}
      onMouseLeave={start}
      aria-roledescription="carousel"
      aria-label="Hero slideshow"
    >
      {/* ── Video backgrounds ─────────────────────────────── */}
      <div className="absolute inset-0">
        {SLIDES.map((s, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              i === index ? "opacity-100" : "opacity-0"
            }`}
            aria-hidden={i !== index}
          >
            <video
              ref={(el) => { videoRefs.current[i] = el; }}
              src={s.video}
              autoPlay={i === 0}
              muted
              loop
              playsInline
              preload={i === 0 ? "auto" : "metadata"}
              className="h-full w-full object-cover object-center"
            />
          </div>
        ))}

        {/* Gradient overlay — dims video for readability */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${slide.gradient} transition-all duration-700`}
        />
        {/* Extra bottom-up dark fade so footer text pops */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950/70 via-transparent to-transparent" />
        {/* Grid texture */}
        <div className="absolute inset-0 bg-grid opacity-20" />

        {/* Animated colour orbs */}
        <div
          className={`absolute -left-32 top-0 h-[500px] w-[500px] rounded-full bg-gradient-to-br ${slide.accentFrom} ${slide.accentTo} opacity-20 blur-[140px] transition-all duration-1000`}
        />
        <div className="absolute -right-20 bottom-0 h-96 w-96 rounded-full bg-electric-500/15 blur-[120px]" />
        <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/5 blur-[80px]" />
      </div>

      {/* ── Slide content ─────────────────────────────────── */}
      <div className="relative min-h-[620px] md:min-h-[700px]">
        {SLIDES.map((s, i) => (
          <div
            key={i}
            className={`transition-all duration-500 ${
              i === index
                ? "opacity-100 translate-y-0"
                : "pointer-events-none absolute inset-0 opacity-0 translate-y-4"
            }`}
            aria-hidden={i !== index}
          >
            <div className="container-x relative flex min-h-[620px] flex-col justify-center py-20 md:min-h-[700px] md:py-28">
              <div className="max-w-2xl">
                {/* Eyebrow pill */}
                <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-semibold backdrop-blur-md">
                  {s.eyebrow}
                </span>

                {/* Headline */}
                <h1 className="mt-6 font-display text-4xl font-extrabold leading-[1.08] tracking-tight drop-shadow-2xl sm:text-5xl lg:text-[3.75rem]">
                  {s.title}
                </h1>

                {/* Subtext */}
                <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-200/90 drop-shadow">
                  {s.subtitle}
                </p>

                {/* CTAs */}
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    href={s.ctaHref}
                    className="btn-primary btn-lg pulse-glow group relative overflow-hidden shadow-xl shadow-flame-500/30"
                  >
                    <span className="relative z-10">{s.ctaLabel}</span>
                    <span className="absolute inset-0 -translate-x-full bg-white/20 transition-transform duration-300 group-hover:translate-x-0" />
                  </Link>
                  <Link
                    href={s.altHref}
                    className="btn-lg btn border border-white/30 bg-white/10 text-white shadow-lg backdrop-blur-sm hover:bg-white/20"
                  >
                    {s.altLabel}
                  </Link>
                </div>

                {/* Mini stats strip */}
                <div className="mt-12 flex flex-wrap gap-6">
                  {STATS.map((st) => (
                    <div key={st.label} className="text-left">
                      <div
                        className={`bg-gradient-to-r ${s.accentFrom} ${s.accentTo} bg-clip-text font-display text-2xl font-extrabold text-transparent drop-shadow`}
                      >
                        {st.value}
                      </div>
                      <div className="mt-0.5 text-[11px] uppercase tracking-widest text-ink-300">
                        {st.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Bottom bar: dots + arrows + slide counter ─────── */}
      <div className="container-x relative flex items-center justify-between pb-8">
        {/* Dot indicators */}
        <div className="flex items-center gap-2">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`rounded-full transition-all duration-300 ${
                i === index
                  ? "h-2 w-10 bg-flame-500 shadow-md shadow-flame-500/50"
                  : "h-1.5 w-4 bg-white/30 hover:bg-white/60"
              }`}
            />
          ))}
        </div>

        {/* Slide counter + arrows */}
        <div className="flex items-center gap-3">
          <span className="font-display text-sm tabular-nums text-ink-300">
            {String(index + 1).padStart(2, "0")}{" "}
            <span className="text-ink-500">/</span>{" "}
            {String(SLIDES.length).padStart(2, "0")}
          </span>
          <div className="flex gap-1.5">
            <button
              onClick={() => go(index - 1)}
              aria-label="Previous slide"
              className="grid h-9 w-9 place-items-center rounded-full border border-white/20 text-white transition hover:border-flame-500 hover:bg-flame-500/20"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button
              onClick={() => go(index + 1)}
              aria-label="Next slide"
              className="grid h-9 w-9 place-items-center rounded-full border border-white/20 text-white transition hover:border-flame-500 hover:bg-flame-500/20"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Scroll-hint chevron */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce opacity-40">
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </div>
    </section>
  );
}
