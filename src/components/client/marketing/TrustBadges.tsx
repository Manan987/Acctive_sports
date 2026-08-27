import { Icon, type IconName } from "@/components/ui/Icon";

const BADGES: { title: string; desc: string; icon: IconName }[] = [
  {
    title: "Factory-direct pricing",
    desc: "No middlemen — manufactured in-house",
    icon: "factory",
  },
  {
    title: "Pan-India delivery",
    desc: "Shipped anywhere in India, on time",
    icon: "truck",
  },
  {
    title: "Free custom mockup",
    desc: "Digital proof before you pay a rupee",
    icon: "palette",
  },
  {
    title: "Quality assured",
    desc: "Every batch QC-checked before dispatch",
    icon: "shieldCheck",
  },
];

/**
 * The four badges previously each carried their own gradient tint and border
 * colour, which made a strip meant to reassure look like four unrelated
 * promotions. One neutral treatment, one accent colour, icons instead of emoji.
 */
export function TrustBadges() {
  return (
    <section className="border-y border-ink-100 bg-white dark:border-ink-800 dark:bg-ink-900">
      <div className="container-x grid grid-cols-2 gap-x-6 gap-y-5 py-7 lg:grid-cols-4">
        {BADGES.map((b) => (
          <div key={b.title} className="flex items-start gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-flame-500/10 text-flame-500">
              <Icon name={b.icon} size={19} />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-bold text-ink-900 dark:text-white">{b.title}</p>
              <p className="mt-0.5 text-xs leading-snug text-ink-500 dark:text-ink-400">{b.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
