"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const PRODUCT_IMAGES = [
  "https://res.cloudinary.com/rdhqircc/image/upload/v1786214189/C8CC4672-1768-439B-AB57-3DFE2AA30F68_m32rlh.png",
  "https://res.cloudinary.com/rdhqircc/image/upload/v1786214178/61DCE3D1-E9B2-4C85-8A24-B63ED502DF7C_tt7jcl.png",
  "https://res.cloudinary.com/rdhqircc/image/upload/v1786214190/CD0579E7-A8FA-4C02-B42B-1C2E8D687D5C_aaswyz.png",
];

const REVIEWS = [
  {
    quote:
      "Ordered 60 cricket jerseys for our district academy — the sublimation quality is genuinely professional. Colours matched the mockup exactly, stitching was sharp, and delivery reached Lucknow within 10 days. Will order every season.",
    name: "Rahul Verma",
    role: "Head Coach, District Cricket Academy — Lucknow",
    initials: "RV",
    color: "from-flame-500 to-flame-600",
    imgIndex: 0,
  },
  {
    quote:
      "We've tried four suppliers before finding ACCTIVE. They're the only manufacturer who nailed our gradient kit with the exact pantone match and club crest placement in the first sample. Factory pricing made a full-squad order genuinely affordable.",
    name: "Anjali Mehta",
    role: "Club Manager, FC United Delhi",
    initials: "AM",
    color: "from-electric-500 to-electric-600",
    imgIndex: 1,
  },
  {
    quote:
      "Placed a bulk tracksuit order for 120 students for our annual sports meet. Great fabric weight, neat stitching, and their design team handled three revisions without complaint. The delivery was on schedule and packaging was solid.",
    name: "S. Krishnan",
    role: "Sports Director, DPS Meerut",
    initials: "SK",
    color: "from-flame-400 to-electric-500",
    imgIndex: 2,
  },
  {
    quote:
      "As a growing activewear D2C brand, consistency is everything. ACCTIVE has delivered identical quality across four batches now. The MOQ of 50 works perfectly for our product launches and the turnaround is always within 12–15 days.",
    name: "Farhan Sheikh",
    role: "Founder, APEX Activewear (D2C Brand)",
    initials: "FS",
    color: "from-flame-600 to-flame-500",
    imgIndex: 0,
  },
];

export function Testimonials() {
  const [i, setI] = useState(0);
  const [transitioning, setTransitioning] = useState(false);

  useEffect(() => {
    const t = setInterval(() => {
      setTransitioning(true);
      setTimeout(() => {
        setI((v) => (v + 1) % REVIEWS.length);
        setTransitioning(false);
      }, 300);
    }, 5500);
    return () => clearInterval(t);
  }, []);

  const review = REVIEWS[i];

  return (
    <div className="mx-auto max-w-5xl">
      {/* Stars */}
      <div className="mb-8 flex justify-center gap-1 text-flame-500">
        {"★★★★★".split("").map((s, n) => (
          <span key={n} className="text-2xl drop-shadow-sm">
            {s}
          </span>
        ))}
      </div>

      {/* Main card */}
      <div
        className={`transition-all duration-300 ${
          transitioning ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"
        }`}
      >
        <div className="relative overflow-hidden rounded-3xl border border-ink-100 bg-white shadow-2xl shadow-ink-200/50 dark:border-ink-800 dark:bg-ink-900 dark:shadow-none">
          {/* Gradient accent top */}
          <div className={`h-1 w-full bg-gradient-to-r ${review.color}`} />

          <div className="grid md:grid-cols-[1fr_2fr]">
            {/* Left — product image */}
            <div className="relative hidden min-h-[280px] overflow-hidden md:block">
              <Image
                src={PRODUCT_IMAGES[review.imgIndex]}
                alt="ACCTIVE sportswear"
                fill
                className="object-cover object-center"
                sizes="300px"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/10 dark:to-ink-900/20" />
              {/* Overlay badge */}
              <div className="absolute bottom-4 left-4 rounded-xl border border-white/20 bg-white/15 px-3 py-2 backdrop-blur-sm">
                <p className="text-xs font-bold text-white">Real customer order ✓</p>
              </div>
            </div>

            {/* Right — review content */}
            <div className="flex flex-col justify-center p-8 lg:p-10">
              {/* Quote mark */}
              <div className="mb-3 text-6xl font-serif leading-none text-flame-500/25 select-none">
                &ldquo;
              </div>
              <blockquote>
                <p className="text-lg font-medium leading-relaxed text-ink-800 dark:text-ink-100 sm:text-xl">
                  {review.quote}
                </p>
                <footer className="mt-6 flex items-center gap-4">
                  <div
                    className={`grid h-12 w-12 shrink-0 place-items-center rounded-full bg-gradient-to-br ${review.color} font-bold text-white shadow-lg`}
                  >
                    {review.initials}
                  </div>
                  <div>
                    <p className="font-bold text-ink-900 dark:text-white">
                      {review.name}
                    </p>
                    <p className="text-sm text-ink-500 dark:text-ink-400">
                      {review.role}
                    </p>
                  </div>
                </footer>
              </blockquote>
            </div>
          </div>
        </div>
      </div>

      {/* Dot + thumbnail navigator */}
      <div className="mt-8 flex items-center justify-center gap-3">
        {REVIEWS.map((r, n) => (
          <button
            key={n}
            onClick={() => setI(n)}
            aria-label={`Show review from ${r.name}`}
            className={`h-2 rounded-full transition-all ${
              n === i
                ? "w-8 bg-flame-500"
                : "w-2 bg-ink-300 hover:bg-ink-400 dark:bg-ink-700"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
