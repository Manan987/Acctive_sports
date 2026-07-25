import Link from "next/link";
import { SPORTS } from "@/lib/site";

const SPORT_DATA: Record<string, { emoji: string; color: string }> = {
  Cricket:    { emoji: "🏏", color: "from-green-500/20 to-green-600/10 border-green-500/30 hover:border-green-500/60" },
  Football:   { emoji: "⚽", color: "from-blue-500/20 to-blue-600/10 border-blue-500/30 hover:border-blue-500/60" },
  Basketball: { emoji: "🏀", color: "from-orange-500/20 to-orange-600/10 border-orange-500/30 hover:border-orange-500/60" },
  Badminton:  { emoji: "🏸", color: "from-yellow-500/20 to-yellow-600/10 border-yellow-500/30 hover:border-yellow-500/60" },
  Hockey:     { emoji: "🏑", color: "from-flame-500/20 to-flame-600/10 border-flame-500/30 hover:border-flame-500/60" },
  Tennis:     { emoji: "🎾", color: "from-lime-500/20 to-lime-600/10 border-lime-500/30 hover:border-lime-500/60" },
  Boxing:     { emoji: "🥊", color: "from-red-500/20 to-red-600/10 border-red-500/30 hover:border-red-500/60" },
  Athletics:  { emoji: "🏃", color: "from-electric-500/20 to-electric-600/10 border-electric-500/30 hover:border-electric-500/60" },
};

export function ShopBySport() {
  return (
    <div className="grid grid-cols-4 gap-3 lg:grid-cols-8">
      {SPORTS.map((sport) => {
        const data = SPORT_DATA[sport] ?? { emoji: "🏅", color: "from-ink-500/20 to-ink-600/10 border-ink-500/30 hover:border-ink-500/60" };
        return (
          <Link
            key={sport}
            href={`/catalogue?sport=${encodeURIComponent(sport)}`}
            className={`group flex flex-col items-center gap-2.5 rounded-2xl border bg-gradient-to-br ${data.color} p-4 text-center transition-all duration-200 hover:-translate-y-1.5 hover:shadow-lg dark:bg-ink-900`}
          >
            <span className="grid h-14 w-14 place-items-center rounded-2xl bg-white/80 text-2xl shadow-sm transition-transform duration-200 group-hover:scale-110 dark:bg-ink-800/80">
              {data.emoji}
            </span>
            <span className="text-xs font-bold text-ink-700 dark:text-ink-200">{sport}</span>
          </Link>
        );
      })}
    </div>
  );
}
