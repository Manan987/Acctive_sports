"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { Icon } from "@/components/ui/Icon";

const PRODUCT_IMAGES = [
  "https://res.cloudinary.com/rdhqircc/image/upload/v1786214189/C8CC4672-1768-439B-AB57-3DFE2AA30F68_m32rlh.png",
  "https://res.cloudinary.com/rdhqircc/image/upload/v1786214178/61DCE3D1-E9B2-4C85-8A24-B63ED502DF7C_tt7jcl.png",
  "https://res.cloudinary.com/rdhqircc/image/upload/v1786214190/CD0579E7-A8FA-4C02-B42B-1C2E8D687D5C_aaswyz.png",
];

/**
 * Edit these to match real, permissioned customer feedback. Two things were
 * deliberately changed and should stay changed:
 *
 *  1. The left-hand photo no longer carries a "Real customer order ✓" badge.
 *    The image is catalogue photography, not a photo of that customer's order,
 *    so the badge asserted something the picture could not support.
 *  2. No Review/AggregateRating JSON-LD is emitted. Publishing review schema
 *    makes the quotes eligible for star ratings in search results, which Google
 *    treats as a policy violation — and consumer law as misleading — unless
 *    every review is genuine and verifiable.
 */
const REVIEWS = [
  {
    quote:
      "Ordered 60 cricket jerseys for our district academy — the sublimation quality is genuinely professional. Colours matched the mockup exactly, stitching was sharp, and delivery reached Lucknow within 10 days. We'll order every season.",
    name: "Rahul Verma",
    role: "Head Coach, District Cricket Academy — Lucknow",
    initials: "RV",
    imgIndex: 0,
  },
  {
    quote:
      "We tried four suppliers before finding ACCTIVE. They're the only manufacturer who nailed our gradient kit with the exact colour match and crest placement on the first sample. Factory pricing made a full-squad order genuinely affordable.",
    name: "Anjali Mehta",
    role: "Club Manager, FC United Delhi",
    initials: "AM",
    imgIndex: 1,
  },
  {
    quote:
      "Placed a bulk tracksuit order for 120 students for our annual sports meet. Good fabric weight, neat stitching, and their design team handled three revisions without complaint. Delivery was on schedule and the packaging held up.",
    name: "S. Krishnan",
    role: "Sports Director, DPS Meerut",
    initials: "SK",
    imgIndex: 2,
  },
  {
    quote:
      "As a growing activewear D2C brand, consistency is everything. ACCTIVE has delivered identical quality across four batches now. Being able to start small and scale up suits our launch cycle, and turnaround is always within 12–15 days.",
    name: "Farhan Sheikh",
    role: "Founder, APEX Activewear",
    initials: "FS",
    imgIndex: 0,
  },
];

const ROTATE_MS = 7000;

export function Testimonials() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);

  const go = useCallback((n: number) => {
    setI(((n % REVIEWS.length) + REVIEWS.length) % REVIEWS.length);
  }, []);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setI((v) => (v + 1) % REVIEWS.length), ROTATE_MS);
    return () => clearInterval(t);
  }, [paused]);

  const review = REVIEWS[i];

  return (
    <div
      className="mx-auto max-w-5xl"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="overflow-hidden rounded-3xl border border-ink-100 bg-white shadow-sm dark:border-ink-800 dark:bg-ink-900">
        <div className="grid md:grid-cols-[0.8fr_1.2fr]">
          {/* Left — product photography */}
          <div className="relative hidden min-h-[300px] overflow-hidden md:block">
            <Image
              src={PRODUCT_IMAGES[review.imgIndex]}
              alt=""
              fill
              className="object-cover object-center"
              sizes="(max-width: 768px) 0px, 320px"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-ink-950/25 to-transparent" />
          </div>

          {/* Right — the quote */}
          <div className="flex flex-col justify-center p-8 lg:p-10">
            <div className="flex items-center justify-between gap-4">
              <span className="text-flame-500/30">
                <Icon name="quote" size={30} />
              </span>
              <div className="flex gap-0.5 text-flame-500" role="img" aria-label="5 out of 5">
                {Array.from({ length: 5 }, (_, n) => (
                  <Icon key={n} name="star" size={15} />
                ))}
              </div>
            </div>

            <blockquote className="mt-5">
              {/* key forces a remount so the fade replays on each rotation */}
              <p
                key={i}
                className="animate-fade-up text-lg leading-relaxed text-ink-800 dark:text-ink-100"
              >
                {review.quote}
              </p>
              <footer className="mt-7 flex items-center gap-4">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-flame-500/10 text-sm font-bold text-flame-600 dark:text-flame-400">
                  {review.initials}
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-ink-900 dark:text-white">{review.name}</p>
                  <p className="text-sm text-ink-500 dark:text-ink-400">{review.role}</p>
                </div>
              </footer>
            </blockquote>
          </div>
        </div>
      </div>

      {/* Controls — the carousel previously rotated with no way to go back or
          stop it, so a slow reader lost the quote mid-sentence. */}
      <div className="mt-6 flex items-center justify-center gap-4">
        <button
          onClick={() => go(i - 1)}
          aria-label="Previous review"
          className="grid h-9 w-9 place-items-center rounded-full border border-ink-200 text-ink-500 transition hover:border-flame-500 hover:text-flame-500 dark:border-ink-700"
        >
          <Icon name="chevronLeft" size={16} />
        </button>

        <div className="flex items-center gap-2">
          {REVIEWS.map((r, n) => (
            <button
              key={n}
              onClick={() => go(n)}
              aria-label={`Show review from ${r.name}`}
              aria-current={n === i}
              className={`h-2 rounded-full transition-all ${
                n === i ? "w-8 bg-flame-500" : "w-2 bg-ink-300 hover:bg-ink-400 dark:bg-ink-700"
              }`}
            />
          ))}
        </div>

        <button
          onClick={() => go(i + 1)}
          aria-label="Next review"
          className="grid h-9 w-9 place-items-center rounded-full border border-ink-200 text-ink-500 transition hover:border-flame-500 hover:text-flame-500 dark:border-ink-700"
        >
          <Icon name="chevronRight" size={16} />
        </button>
      </div>
    </div>
  );
}
