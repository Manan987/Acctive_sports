const BADGES = [
  {
    title: "Factory-Direct Pricing",
    desc: "Manufactured in-house, no middlemen",
    icon: (
      <>
        <path d="M3 21h18M5 21V7l7-4 7 4v14" />
        <path d="M9 21v-6h6v6M9 10h.01M15 10h.01M12 10h.01" />
      </>
    ),
  },
  {
    title: "Pan-India Delivery",
    desc: "Shipped anywhere in India",
    icon: (
      <>
        <path d="M1 3h15v13H1zM16 8h4l3 3v5h-7" />
        <circle cx="5.5" cy="18.5" r="2.5" />
        <circle cx="18.5" cy="18.5" r="2.5" />
      </>
    ),
  },
  {
    title: "Custom Design Studio",
    desc: "Free mockups before you buy",
    icon: (
      <>
        <path d="M12 19l7-7 3 3-7 7-3-3z" />
        <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
        <path d="M2 2l7.586 7.586" />
        <circle cx="11" cy="11" r="2" />
      </>
    ),
  },
  {
    title: "Quality Assured",
    desc: "Every batch QC-checked",
    icon: (
      <>
        <path d="M9 12l2 2 4-4" />
        <path d="M12 3l7 3v6c0 5-3.5 8-7 9-3.5-1-7-4-7-9V6z" />
      </>
    ),
  },
];

export function TrustBadges() {
  return (
    <section className="border-y border-ink-100 bg-white dark:border-ink-800 dark:bg-ink-900">
      <div className="container-x grid grid-cols-2 gap-x-4 gap-y-6 py-6 lg:grid-cols-4">
        {BADGES.map((b) => (
          <div key={b.title} className="flex items-center gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-flame-500/10 text-flame-500">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                {b.icon}
              </svg>
            </span>
            <div className="min-w-0">
              <p className="text-sm font-bold text-ink-900 dark:text-white">{b.title}</p>
              <p className="truncate text-xs text-ink-500 dark:text-ink-400">{b.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
