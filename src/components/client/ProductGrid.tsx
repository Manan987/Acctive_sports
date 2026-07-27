import type { ProductView } from "@/lib/data";
import { ProductCard } from "./ProductCard";

// Pure server component — the page it sits on is already paginated server-side,
// so there is no client state here and no reason to ship this to the browser.
export function ProductGrid({ products }: { products: ProductView[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card overflow-hidden">
          <div className="aspect-square animate-pulse bg-ink-100 dark:bg-ink-800" />
          <div className="space-y-2 p-4">
            <div className="h-3 w-1/3 animate-pulse rounded bg-ink-100 dark:bg-ink-800" />
            <div className="h-4 w-4/5 animate-pulse rounded bg-ink-100 dark:bg-ink-800" />
            <div className="h-8 w-full animate-pulse rounded bg-ink-100 dark:bg-ink-800" />
          </div>
        </div>
      ))}
    </div>
  );
}
