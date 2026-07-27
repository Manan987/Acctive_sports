"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState, useTransition } from "react";

type Category = { name: string; slug: string; count: number };

export function CatalogueFilters({
  categories,
  sports,
  fabrics,
}: {
  categories: Category[];
  sports: readonly string[];
  fabrics: readonly string[];
}) {
  const router = useRouter();
  const params = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [q, setQ] = useState(params.get("q") ?? "");

  const current = {
    category: params.get("category") ?? "",
    sport: params.get("sport") ?? "",
    fabric: params.get("fabric") ?? "",
    sort: params.get("sort") ?? "newest",
  };

  const setParam = useCallback(
    (key: string, value: string) => {
      const next = new URLSearchParams(params.toString());
      if (value) next.set(key, value);
      else next.delete(key);
      // Changing a filter must return to page 1 — staying on page 5 of the old
      // result set drops the user into the middle of an unrelated list.
      next.delete("page");
      startTransition(() => {
        router.push(`/catalogue?${next.toString()}`, { scroll: false });
      });
    },
    [params, router]
  );

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setParam("q", q.trim());
  };

  const activeCount =
    (current.category ? 1 : 0) +
    (current.sport ? 1 : 0) +
    (current.fabric ? 1 : 0) +
    (params.get("q") ? 1 : 0);

  return (
    <div className={isPending ? "opacity-70 transition" : ""}>
      {/* Search + sort row */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <form onSubmit={onSearch} className="relative flex-1">
          <svg className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" />
          </svg>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search designs…"
            className="input pl-10"
            aria-label="Search products"
          />
        </form>
        <select
          value={current.sort}
          onChange={(e) => setParam("sort", e.target.value)}
          className="input sm:w-48"
          aria-label="Sort products"
        >
          <option value="newest">Newest</option>
          <option value="featured">Featured first</option>
          <option value="name">Name A–Z</option>
        </select>
      </div>

      {/* Category chips */}
      <div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto pb-1">
        <Chip active={!current.category} onClick={() => setParam("category", "")}>
          All
        </Chip>
        {categories.map((c) => (
          <Chip
            key={c.slug}
            active={current.category === c.slug}
            onClick={() => setParam("category", c.slug)}
          >
            {c.name} <span className="opacity-60">({c.count})</span>
          </Chip>
        ))}
      </div>

      {/* Sport + fabric selects */}
      <div className="mt-3 flex flex-wrap gap-3">
        <select
          value={current.sport}
          onChange={(e) => setParam("sport", e.target.value)}
          className="input w-auto"
          aria-label="Filter by sport"
        >
          <option value="">All sports</option>
          {sports.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <select
          value={current.fabric}
          onChange={(e) => setParam("fabric", e.target.value)}
          className="input w-auto"
          aria-label="Filter by fabric"
        >
          <option value="">All fabrics</option>
          {fabrics.map((f) => (
            <option key={f} value={f}>{f}</option>
          ))}
        </select>
        {activeCount > 0 && (
          <button
            onClick={() => startTransition(() => router.push("/catalogue", { scroll: false }))}
            className="btn-ghost text-flame-500"
          >
            Clear filters ({activeCount})
          </button>
        )}
      </div>
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition ${
        active
          ? "border-flame-500 bg-flame-500 text-white"
          : "border-ink-200 bg-white text-ink-600 hover:border-ink-300 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-300"
      }`}
    >
      {children}
    </button>
  );
}
