"use client";

import { useEffect, useState } from "react";

const REVIEWS = [
  {
    quote:
      "Ordered 40 cricket jerseys for our academy — the sublimation quality is genuinely professional and the colours are exactly like the mockup. Delivery was on time across state.",
    name: "Rahul Verma",
    role: "Cricket Academy, Lucknow",
    initials: "RV",
    color: "from-flame-500 to-flame-600",
  },
  {
    quote:
      "We've tried three suppliers; ACCTIVE is the only one that nailed our club crest and gradient kit in one go. Factory pricing made a full-squad order affordable.",
    name: "Anjali Mehta",
    role: "Football Club Manager, Delhi",
    initials: "AM",
    color: "from-electric-500 to-electric-600",
  },
  {
    quote:
      "Bulk tracksuits for our school annual meet — great fabric, neat stitching, and their design team was patient with our revisions. Will reorder every season.",
    name: "S. Krishnan",
    role: "Sports Coordinator, Meerut",
    initials: "SK",
    color: "from-flame-400 to-electric-500",
  },
  {
    quote:
      "As a growing activewear label we needed a reliable manufacturer. Consistent quality batch after batch, and the MOQ worked for us. Highly recommended.",
    name: "Farhan Sheikh",
    role: "D2C Activewear Brand",
    initials: "FS",
    color: "from-flame-600 to-flame-500",
  },
];

export function Testimonials() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % REVIEWS.length), 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="mx-auto max-w-4xl">
      {/* Stars */}
      <div className="mb-6 flex justify-center gap-1 text-flame-500">
        {"★★★★★".split("").map((s, n) => (
          <span key={n} className="text-2xl drop-shadow-sm">{s}</span>
        ))}
      </div>

      {/* Cards */}
      <div className="relative min-h-[220px]">
        {REVIEWS.map((r, n) => (
          <div
            key={n}
            className={`transition-all duration-500 ${
              n === i ? "opacity-100 translate-y-0" : "pointer-events-none absolute inset-0 opacity-0 translate-y-4"
            }`}
            aria-hidden={n !== i}
          >
            <div className="gradient-border rounded-3xl bg-white p-8 shadow-xl dark:bg-ink-900">
              {/* Quote mark */}
              <div className="mb-4 text-5xl font-serif leading-none text-flame-500/30">&ldquo;</div>
              <blockquote>
                <p className="text-lg font-medium leading-relaxed text-ink-800 dark:text-ink-100 sm:text-xl">
                  {r.quote}
                </p>
                <footer className="mt-6 flex items-center gap-4">
                  <div className={`grid h-12 w-12 shrink-0 place-items-center rounded-full bg-gradient-to-br ${r.color} font-bold text-white shadow-lg`}>
                    {r.initials}
                  </div>
                  <div>
                    <p className="font-bold text-ink-900 dark:text-white">{r.name}</p>
                    <p className="text-sm text-ink-500 dark:text-ink-400">{r.role}</p>
                  </div>
                </footer>
              </blockquote>
            </div>
          </div>
        ))}
      </div>

      {/* Dots */}
      <div className="mt-8 flex justify-center gap-2">
        {REVIEWS.map((_, n) => (
          <button
            key={n}
            onClick={() => setI(n)}
            aria-label={`Show review ${n + 1}`}
            className={`h-2 rounded-full transition-all ${
              n === i ? "w-8 bg-flame-500" : "w-2 bg-ink-300 hover:bg-ink-400 dark:bg-ink-700"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
