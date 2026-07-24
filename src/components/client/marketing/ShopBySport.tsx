import Link from "next/link";
import { SPORTS } from "@/lib/site";

// Emoji keeps it dependency-free and colourful; swap for SVG/icons anytime.
const SPORT_ICON: Record<string, string> = {
  Cricket: "🏏",
  Football: "⚽",
  Basketball: "🏀",
  Badminton: "🏸",
  Hockey: "🏑",
  Tennis: "🎾",
  Boxing: "🥊",
  Athletics: "🏃",
};

export function ShopBySport() {
  return (
    <div className="grid grid-cols-4 gap-3 sm:grid-cols-4 lg:grid-cols-8">
      {SPORTS.map((sport) => (
        <Link
          key={sport}
          href={`/catalogue?sport=${encodeURIComponent(sport)}`}
          className="group flex flex-col items-center gap-2 rounded-2xl border border-ink-100 bg-white p-4 text-center transition hover:-translate-y-1 hover:border-flame-500/40 hover:shadow-lg dark:border-ink-800 dark:bg-ink-900"
        >
          <span className="grid h-14 w-14 place-items-center rounded-full bg-ink-50 text-2xl transition group-hover:scale-110 dark:bg-ink-800">
            {SPORT_ICON[sport] ?? "🏅"}
          </span>
          <span className="text-xs font-semibold text-ink-700 dark:text-ink-200">{sport}</span>
        </Link>
      ))}
    </div>
  );
}
