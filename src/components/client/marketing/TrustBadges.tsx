const BADGES = [
  {
    title: "Factory-Direct Pricing",
    desc: "No middlemen — manufactured in-house",
    emoji: "🏭",
    gradient: "from-flame-500/20 to-flame-600/10",
    border: "border-flame-500/20",
  },
  {
    title: "Pan-India Delivery",
    desc: "Shipped anywhere in India, on time",
    emoji: "🚚",
    gradient: "from-electric-500/20 to-electric-600/10",
    border: "border-electric-500/20",
  },
  {
    title: "Free Custom Mockup",
    desc: "Digital proof before you pay a rupee",
    emoji: "🎨",
    gradient: "from-flame-400/20 to-electric-400/10",
    border: "border-flame-400/20",
  },
  {
    title: "Quality Assured",
    desc: "Every batch QC-checked before dispatch",
    emoji: "✅",
    gradient: "from-green-500/20 to-green-600/10",
    border: "border-green-500/20",
  },
];

export function TrustBadges() {
  return (
    <section className="relative border-y border-ink-100 bg-white dark:border-ink-800 dark:bg-ink-900">
      {/* Subtle top gradient line */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-flame-500/50 to-transparent" />
      <div className="container-x grid grid-cols-2 gap-4 py-6 lg:grid-cols-4">
        {BADGES.map((b) => (
          <div
            key={b.title}
            className={`flex items-center gap-3 rounded-2xl border ${b.border} bg-gradient-to-br ${b.gradient} p-3 transition hover:-translate-y-0.5 hover:shadow-md`}
          >
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-white/80 text-2xl shadow-sm dark:bg-ink-800/80">
              {b.emoji}
            </span>
            <div className="min-w-0">
              <p className="text-sm font-bold text-ink-900 dark:text-white">{b.title}</p>
              <p className="mt-0.5 text-xs leading-snug text-ink-500 dark:text-ink-400">{b.desc}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-electric-500/30 to-transparent" />
    </section>
  );
}
