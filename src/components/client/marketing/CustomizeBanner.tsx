"use client";

import Link from "next/link";
import { useRef, useEffect } from "react";

const STEPS = [
  { n: "1", t: "Choose a design", d: "Pick from 300+ styles or upload your own artwork. We'll match it perfectly.", emoji: "🎨" },
  { n: "2", t: "Free digital mockup", d: "See your exact jersey — name, number & logo placed — before you commit. Zero cost.", emoji: "✏️" },
  { n: "3", t: "We manufacture", d: "Your kit is made in-house at our Meerut factory with strict QC on every piece.", emoji: "🏥" },
  { n: "4", t: "Delivered to your door", d: "Packed & dispatched pan-India. Track every shipment, on-time or we call you.", emoji: "🚚" },
];

export function CustomizeBanner() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;
    vid.play().catch(() => {});
  }, []);

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-ink-950 text-white">

      {/* Dark gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-br from-ink-950/90 via-ink-950/70 to-flame-950/80" />
      <div className="absolute inset-0 bg-grid opacity-20" />

      {/* Glow orbs */}
      <div className="absolute -right-16 -top-16 h-72 w-72 rounded-full bg-flame-500/25 blur-[100px]" />
      <div className="absolute -bottom-20 -left-10 h-72 w-72 rounded-full bg-electric-500/20 blur-[100px]" />
      {/* Gradient top line */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-flame-500/60 to-transparent" />

      <div className="relative px-6 py-12 sm:px-10 md:py-16">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-flame-500/30 bg-flame-500/10 px-4 py-1.5 text-sm font-bold text-flame-400">
            🎯 Your Kit, Your Rules
          </span>
          <h2 className="mt-4 font-display text-3xl font-extrabold sm:text-4xl">
            Fully custom.{" "}
            <span className="gradient-text-animated">Ready in days, not weeks.</span>
          </h2>
          <p className="mt-3 text-ink-300">
            Tell us your colours, logo, names and numbers. We design, print and deliver — no back-and-forth, no surprises.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, idx) => (
            <div
              key={s.n}
              className="group relative rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:border-flame-500/40 hover:bg-white/10"
            >
              {idx < STEPS.length - 1 && (
                <div className="absolute -right-2 top-8 hidden h-px w-4 bg-gradient-to-r from-flame-500/50 to-transparent lg:block" />
              )}
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-flame-500 to-flame-600 font-display text-lg font-bold text-white shadow-lg shadow-flame-500/30">
                  {s.n}
                </span>
                <span className="text-2xl">{s.emoji}</span>
              </div>
              <p className="mt-3 font-bold text-white">{s.t}</p>
              <p className="mt-1 text-sm leading-relaxed text-ink-300">{s.d}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/catalogue" className="btn-primary btn-lg pulse-glow">
            🛒 Start Your Order
          </Link>
          <Link href="/contact" className="btn-lg btn border border-white/25 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20">
            💬 Get Free Mockup
          </Link>
        </div>
        <p className="mt-4 text-xs text-ink-500">🏷️ 25% off single piece &middot; 🔥 50% off bulk (5+ pcs) &middot; No payment for mockup</p>
      </div>
    </div>
  );
}
