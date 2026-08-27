const SEGMENTS = [
  "Cricket academies",
  "Football clubs",
  "School teams",
  "Corporate leagues",
  "Retail brands",
  "Gym chains",
  "University sports",
  "State associations",
];

/**
 * These are the customer SEGMENTS served, not named partners — so the row is
 * set as plain type. It previously interleaved product thumbnails and ✦ glyphs
 * between the entries, which made a list of eight words look like a logo wall
 * of clients that do not exist.
 */
export function PartnersMarquee() {
  const row = [...SEGMENTS, ...SEGMENTS];
  return (
    <div className="relative overflow-hidden py-3" aria-hidden>
      <div className="marquee-track gap-10">
        {row.map((p, i) => (
          <span
            key={i}
            className="inline-flex shrink-0 items-center gap-10 whitespace-nowrap text-base font-semibold text-ink-300 dark:text-ink-700"
          >
            {p}
            <span className="h-1 w-1 rounded-full bg-flame-500/50" />
          </span>
        ))}
      </div>
      {/* Edge fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white to-transparent dark:from-ink-950" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white to-transparent dark:from-ink-950" />
    </div>
  );
}

/** Screen readers get the list as text rather than as a duplicated marquee. */
export function segmentList() {
  return SEGMENTS;
}
