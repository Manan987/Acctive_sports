"use client";

import { useEffect, useState } from "react";
import type { ProductView } from "@/lib/data";
import { ProductCard } from "./ProductCard";

const PAGE = 12;

export function ProductGrid({ products }: { products: ProductView[] }) {
  const [visible, setVisible] = useState(PAGE);

  // Reset when the product set changes (e.g. filters applied)
  useEffect(() => {
    setVisible(PAGE);
  }, [products]);

  const shown = products.slice(0, visible);
  const hasMore = visible < products.length;

  return (
    <div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {shown.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>

      {hasMore && (
        <div className="mt-10 flex flex-col items-center gap-3">
          <p className="text-sm text-ink-500 dark:text-ink-400">
            Showing {shown.length} of {products.length}
          </p>
          <button onClick={() => setVisible((v) => v + PAGE)} className="btn-secondary btn-lg">
            Load more designs
          </button>
        </div>
      )}
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
