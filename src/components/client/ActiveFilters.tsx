"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

const LABELS: Record<string, string> = {
  category: "Category",
  sport: "Sport",
  fabric: "Fabric",
  q: "Search",
};

export function ActiveFilters({ categoryNames }: { categoryNames: Record<string, string> }) {
  const router = useRouter();
  const params = useSearchParams();
  const [, startTransition] = useTransition();

  const active: { key: string; value: string; label: string }[] = [];
  for (const key of ["category", "sport", "fabric", "q"]) {
    const value = params.get(key);
    if (value) {
      const display = key === "category" ? categoryNames[value] ?? value : value;
      active.push({ key, value, label: `${LABELS[key]}: ${display}` });
    }
  }

  if (active.length === 0) return null;

  const remove = (key: string) => {
    const next = new URLSearchParams(params.toString());
    next.delete(key);
    next.delete("page"); // removing a filter widens the result set — restart at page 1
    startTransition(() => router.push(`/catalogue?${next.toString()}`, { scroll: false }));
  };

  return (
    <div className="mt-4 flex flex-wrap items-center gap-2">
      <span className="text-sm text-ink-500 dark:text-ink-400">Active:</span>
      {active.map((f) => (
        <button
          key={f.key}
          onClick={() => remove(f.key)}
          className="inline-flex items-center gap-1.5 rounded-full bg-flame-500/10 px-3 py-1 text-xs font-medium text-flame-600 transition hover:bg-flame-500/20 dark:text-flame-400"
        >
          {f.label}
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
        </button>
      ))}
    </div>
  );
}
