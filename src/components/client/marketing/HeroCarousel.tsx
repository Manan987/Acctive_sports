"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { STATS as SITE_STATS, ORDER } from "@/lib/site";
import { Icon, type IconName } from "@/components/ui/Icon";

type Slide = {
  eyebrow: string;
  eyebrowIcon: IconName;
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
    eyebrow: "Custom sportswear, manufactured in Meerut",
    eyebrowIcon: "factory",
    title: (
      <>
        Wear what champions <span className="text-flame-500">train in</span>
      </>
    ),
    subtitle:
      "Factory-direct sublimated jerseys, tracksuits and kits — built to your exact colours, logo and numbers. Order from a single piece.",
    ctaHref: "/catalogue",
    ctaLabel: "Browse all designs",
    altHref: "/contact",
    altLabel: "Get a free quote",
    gradient: "from-ink-950/85 via-ink-950/65 to-flame-950/50",
    accentFrom: "from-flame-600",
    accentTo: "to-orange-400",
    video:
      "https://res.cloudinary.com/rdhqircc/video/upload/v1786214198/gemini_generated_video_D067D85B_tbm8lg.mp4",
  },
  {
    eyebrow: "Sublimation that survives the season",
    eyebrowIcon: "palette",
    title: (
      <>
        Colours that <span className="text-flame-500">don&apos;t fade out</span>
      </>
    ),
    subtitle:
      "Edge-to-edge, bleed-proof prints on Lycra, Superpoly and SAP Mattie. Match-day sharp wash after wash — the ink is in the fabric, not on it.",
    ctaHref: "/catalogue?category=round-neck-t-shirts",
    ctaLabel: "Shop jerseys",
    altHref: "/about",
    altLabel: "See how we make them",
    gradient: "from-ink-950/85 via-ink-950/65 to-electric-950/50",
    accentFrom: "from-electric-500",
    accentTo: "to-cyan-400",
    video:
      "https://res.cloudinary.com/rdhqircc/video/upload/v1786214195/gemini_generated_video_1A145FD7_k8kfmh.mp4",
  },
  {
    eyebrow: "Bulk orders, delivered pan-India",
    eyebrowIcon: "truck",
    title: (
      <>
        One factory. <span className="text-flame-500">Every kit your team needs.</span>
      </>
    ),
    subtitle:
      "Schools, academies, clubs and brands — everything is manufactured in-house and shipped anywhere in India. No middlemen, no markups.",
    ctaHref: "/catalogue",
    ctaLabel: "Order in bulk",
    altHref: "/contact",
    altLabel: "Talk to our team",
    gradient: "from-ink-950/85 via-flame-950/55 to-ink-950/60",
    accentFrom: "from-flame-500",
    accentTo: "to-yellow-400",
    video:
      "https://res.cloudinary.com/rdhqircc/video/upload/v1786214194/gemini_generated_video_0452D33C_bxte0z.mp4",
  },
];

const HERO_STATS = [
  { value: SITE_STATS.designs, label: "Designs" },
  { value: SITE_STATS.sportsCovered, label: "Sports covered" },
  { value: SITE_STATS.kitsDelivered, label: "Kits delivered" },
  { value: `${ORDER.minQty} pc`, label: "Minimum order" },
];

/** Fisher-Yates shuffle — returns a new shuffled array */
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function HeroCarousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  // shuffleQueue holds the pre-computed random order for upcoming slides
  const shuffleQueue = useRef<number[]>([]);

  /** Pick next index from the shuffled queue; re-shuffle when empty */
  const nextShuffled = useCallback((current: number) => {
    if (shuffleQueue.current.length === 0) {
      // Re-fill queue with a fresh shuffle, ensuring we don't start on the same slide
      let q = shuffle(Array.from({ length: SLIDES.length }, (_, i) => i));
      if (q[0] === current) q = [...q.slice(1), q[0]]; // rotate so we never repeat
      shuffleQueue.current = q;
    }
    return shuffleQueue.current.shift() as number;
  }, []);

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
    timer.current = setInterval(() => {
      setIndex((current) => nextShuffled(current));
    }, 7000);
  }, [nextShuffled]);

  const stop = useCallback(() => {
    if (timer.current) clearInterval(timer.current);
  }, []);

  // `paused` is the explicit user choice and outranks hover: leaving the hero
  // with the mouse must not silently restart a slideshow someone stopped.
  const pause = useCallback(() => {
    setPaused(true);
    stop();
  }, [stop]);
  const resume = useCallback(() => {
    setPaused(false);
    start();
  }, [start]);

  useEffect(() => {
    // Seed the initial shuffle queue on mount
    shuffleQueue.current = shuffle(Array.from({ length: SLIDES.length }, (_, i) => i + 1).map(i => i % SLIDES.length));
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
      onMouseLeave={() => { if (!paused) start(); }}
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
                <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
                  <span className="text-flame-500">
                    <Icon name={s.eyebrowIcon} size={14} />
                  </span>
                  {s.eyebrow}
                </span>

                {/* Headline */}
                <h1 className="mt-6 text-4xl font-extrabold leading-[1.08] drop-shadow-2xl sm:text-5xl lg:text-[3.5rem]">
                  {s.title}
                </h1>

                {/* Subtext */}
                <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-200/90 drop-shadow">
                  {s.subtitle}
                </p>

                {/* CTAs — one primary, one secondary. Both used to compete: the
                    primary pulsed continuously and both carried heavy shadows. */}
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link href={s.ctaHref} className="btn-primary btn-lg">
                    {s.ctaLabel}
                    <Icon name="arrowRight" size={17} />
                  </Link>
                  <Link href={s.altHref} className="btn-on-dark btn-lg">
                    {s.altLabel}
                  </Link>
                </div>

                {/* Mini stats strip */}
                <dl className="mt-12 flex flex-wrap gap-x-10 gap-y-5">
                  {HERO_STATS.map((st) => (
                    <div key={st.label}>
                      <dt className="sr-only">{st.label}</dt>
                      <dd className="nums text-2xl font-extrabold text-white drop-shadow">
                        {st.value}
                      </dd>
                      <p aria-hidden className="mt-0.5 text-[11px] uppercase tracking-widest text-ink-300">
                        {st.label}
                      </p>
                    </div>
                  ))}
                </dl>
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

        {/* Slide counter + controls */}
        <div className="flex items-center gap-3">
          <span className="nums text-sm text-ink-300">
            {String(index + 1).padStart(2, "0")}{" "}
            <span className="text-ink-500">/</span>{" "}
            {String(SLIDES.length).padStart(2, "0")}
          </span>
          <div className="flex gap-1.5">
            {/* An auto-advancing carousel needs a way to stop it. Hover-to-pause
                is not reachable by keyboard or touch, so this is the control
                that actually satisfies WCAG 2.2.2 (pause, stop, hide). */}
            <button
              onClick={() => (paused ? resume() : pause())}
              aria-label={paused ? "Resume slideshow" : "Pause slideshow"}
              className="grid h-9 w-9 place-items-center rounded-full border border-white/20 text-white transition hover:border-flame-500 hover:bg-flame-500/20"
            >
              {paused ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M6 4l14 8-14 8z" />
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M7 4h4v16H7zM13 4h4v16h-4z" />
                </svg>
              )}
            </button>
            <button
              onClick={() => go(index - 1)}
              aria-label="Previous slide"
              className="grid h-9 w-9 place-items-center rounded-full border border-white/20 text-white transition hover:border-flame-500 hover:bg-flame-500/20"
            >
              <Icon name="chevronLeft" size={16} strokeWidth={2.2} />
            </button>
            <button
              onClick={() => go(index + 1)}
              aria-label="Next slide"
              className="grid h-9 w-9 place-items-center rounded-full border border-white/20 text-white transition hover:border-flame-500 hover:bg-flame-500/20"
            >
              <Icon name="chevronRight" size={16} strokeWidth={2.2} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
