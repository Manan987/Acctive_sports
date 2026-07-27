import Link from "next/link";

// Server-rendered pagination. Deliberately built from <Link>s rather than a
// client "load more" button: the catalogue used to ship every published
// product to the browser and slice it there, so the page weight grew with the
// catalogue and pages 2+ were invisible to search engines.
export function Pagination({
  page,
  totalPages,
  searchParams,
}: {
  page: number;
  totalPages: number;
  searchParams: Record<string, string | undefined>;
}) {
  if (totalPages <= 1) return null;

  const href = (p: number) => {
    const next = new URLSearchParams();
    for (const [k, v] of Object.entries(searchParams)) {
      if (v && k !== "page") next.set(k, v);
    }
    if (p > 1) next.set("page", String(p));
    const qs = next.toString();
    return qs ? `/catalogue?${qs}` : "/catalogue";
  };

  // Window of page numbers around the current page, with the first and last
  // always reachable so long catalogues don't produce an endless number row.
  const nums: (number | "gap")[] = [];
  for (let p = 1; p <= totalPages; p++) {
    if (p === 1 || p === totalPages || Math.abs(p - page) <= 1) {
      nums.push(p);
    } else if (nums[nums.length - 1] !== "gap") {
      nums.push("gap");
    }
  }

  return (
    <nav
      className="mt-10 flex flex-wrap items-center justify-center gap-2"
      aria-label="Catalogue pages"
    >
      {page > 1 ? (
        <Link href={href(page - 1)} rel="prev" className="btn-secondary text-sm">
          ← Previous
        </Link>
      ) : (
        <span className="btn-secondary cursor-not-allowed text-sm opacity-40" aria-disabled>
          ← Previous
        </span>
      )}

      {nums.map((n, i) =>
        n === "gap" ? (
          <span key={`gap-${i}`} className="px-1 text-ink-400">
            …
          </span>
        ) : (
          <Link
            key={n}
            href={href(n)}
            aria-current={n === page ? "page" : undefined}
            className={`grid h-10 min-w-10 place-items-center rounded-full px-3 text-sm font-semibold transition ${
              n === page
                ? "bg-flame-500 text-white shadow-lg shadow-flame-500/25"
                : "border border-ink-200 text-ink-600 hover:border-flame-500 hover:text-flame-500 dark:border-ink-700 dark:text-ink-300"
            }`}
          >
            {n}
          </Link>
        )
      )}

      {page < totalPages ? (
        <Link href={href(page + 1)} rel="next" className="btn-secondary text-sm">
          Next →
        </Link>
      ) : (
        <span className="btn-secondary cursor-not-allowed text-sm opacity-40" aria-disabled>
          Next →
        </span>
      )}
    </nav>
  );
}
