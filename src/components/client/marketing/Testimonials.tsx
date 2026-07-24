"use client";

import { useEffect, useState } from "react";

const REVIEWS = [
  {
    quote:
      "Ordered 40 cricket jerseys for our academy — the sublimation quality is genuinely professional and the colours are exactly like the mockup. Delivery was on time across state.",
    name: "Rahul Verma",
    role: "Cricket Academy, Lucknow",
  },
  {
    quote:
      "We've tried three suppliers; ACCTIVE is the only one that nailed our club crest and gradient kit in one go. Factory pricing made a full-squad order affordable.",
    name: "Anjali Mehta",
    role: "Football Club Manager, Delhi",
  },
  {
    quote:
      "Bulk tracksuits for our school annual meet — great fabric, neat stitching, and their design team was patient with our revisions. Will reorder every season.",
    name: "S. Krishnan",
    role: "Sports Coordinator, Meerut",
  },
  {
    quote:
      "As a growing activewear label we needed a reliable manufacturer. Consistent quality batch after batch, and the MOQ worked for us. Highly recommended.",
    name: "Farhan Sheikh",
    role: "D2C Activewear Brand",
  },
];

export function Testimonials() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % REVIEWS.length), 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="mx-auto max-w-3xl text-center">
      <div className="mb-4 flex justify-center gap-1 text-flame-500" aria-hidden>
        {"★★★★★".split("").map((s, n) => (
          <span key={n} className="text-xl">{s}</span>
        ))}
      </div>
      <div className="relative min-h-[160px]">
        {REVIEWS.map((r, n) => (
          <blockquote
            key={n}
            className={`transition-opacity duration-500 ${
              n === i ? "opacity-100" : "pointer-events-none absolute inset-0 opacity-0"
            }`}
            aria-hidden={n !== i}
          >
            <p className="font-display text-xl font-semibold leading-relaxed text-ink-900 dark:text-white sm:text-2xl">
              &ldquo;{r.quote}&rdquo;
            </p>
            <footer className="mt-5">
              <p className="font-semibold text-ink-900 dark:text-white">{r.name}</p>
              <p className="text-sm text-ink-500 dark:text-ink-400">{r.role}</p>
            </footer>
          </blockquote>
        ))}
      </div>
      <div className="mt-6 flex justify-center gap-2">
        {REVIEWS.map((_, n) => (
          <button
            key={n}
            onClick={() => setI(n)}
            aria-label={`Show review ${n + 1}`}
            className={`h-2 rounded-full transition-all ${
              n === i ? "w-6 bg-flame-500" : "w-2 bg-ink-300 dark:bg-ink-700"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
