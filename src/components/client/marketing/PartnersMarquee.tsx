// Trust strip — the kind of buyers a factory serves. Text-based so it needs no
// third-party logos; replace with client logos when you have permission to use them.
const PARTNERS = [
  "Cricket Academies",
  "Football Clubs",
  "School Teams",
  "Corporate Leagues",
  "Retail Brands",
  "Gym Chains",
  "University Sports",
  "State Associations",
];

export function PartnersMarquee() {
  const row = [...PARTNERS, ...PARTNERS];
  return (
    <div className="relative overflow-hidden py-2">
      <div className="marquee-track gap-10">
        {row.map((p, i) => (
          <span
            key={i}
            className="whitespace-nowrap font-display text-lg font-bold text-ink-300 dark:text-ink-600"
          >
            {p}
            <span className="mx-6 text-flame-500">✦</span>
          </span>
        ))}
      </div>
      {/* edge fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-white to-transparent dark:from-ink-950" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-white to-transparent dark:from-ink-950" />
    </div>
  );
}
