import Image from "next/image";
import Link from "next/link";
import type { ProductView } from "@/lib/data";
import { applyDiscount } from "@/lib/utils";
import { DISCOUNTS } from "@/lib/site";
import { QuickAddToCart } from "./QuickAddToCart";

export function ProductCard({ product }: { product: ProductView }) {
  const img = product.images[0] || "/placeholder-product.svg";
  const imgBack = product.images[1] || img;

  const single = applyDiscount(product.price, DISCOUNTS.single.pct);
  const bulk   = applyDiscount(product.price, DISCOUNTS.bulk.pct);

  return (
    <div className="group card card-hover relative overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-flame-500/15">
      {/* Gradient glow on hover */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-flame-500/0 to-electric-500/0 opacity-0 transition-opacity duration-300 group-hover:from-flame-500/5 group-hover:to-electric-500/5 group-hover:opacity-100" />

      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-ink-100 dark:bg-ink-800">
          {/* Front image */}
          <Image
            src={img}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-all duration-500 group-hover:scale-105 group-hover:opacity-0"
          />
          {/* Back image (hover reveal) */}
          <Image
            src={imgBack}
            alt=""
            fill
            aria-hidden
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="scale-110 object-cover opacity-0 transition-all duration-500 group-hover:scale-100 group-hover:opacity-100"
          />

          {/* Overlay gradient on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-ink-950/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          {/* Badges */}
          <div className="absolute left-3 top-3 flex flex-col gap-1.5">
            {product.featured && (
              <span className="rounded-full bg-flame-500 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow-lg shadow-flame-500/40">
                ⭐ Featured
              </span>
            )}
            {product.createdAt && (Date.now() - new Date(product.createdAt).getTime()) < 7 * 24 * 60 * 60 * 1000 && (
              <span className="rounded-full bg-electric-500 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow-lg shadow-electric-500/40">
                ✨ New
              </span>
            )}
            {/* Bulk discount badge */}
            {product.price && (
              <span className="rounded-full bg-green-600 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow-lg">
                Bulk {DISCOUNTS.bulk.pct}% OFF
              </span>
            )}
          </div>

          <span className="absolute right-3 top-3 rounded-full bg-white/90 px-2 py-1 text-[10px] font-semibold text-ink-700 backdrop-blur dark:bg-ink-900/90 dark:text-ink-200">
            Customizable
          </span>

          {/* Quick view on hover */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <span className="whitespace-nowrap rounded-full bg-white/95 px-4 py-1.5 text-xs font-bold text-ink-900 shadow-lg backdrop-blur">
              Quick View →
            </span>
          </div>
        </div>
      </Link>

      <div className="p-4">
        <Link href={`/products/${product.slug}`} className="block">
          <p className="text-[11px] font-bold uppercase tracking-widest text-flame-500">
            {product.categoryName}
          </p>
          <h3 className="mt-1 line-clamp-2 min-h-[2.5rem] text-sm font-semibold text-ink-900 transition-colors group-hover:text-flame-500 dark:text-white">
            {product.name}
          </h3>
        </Link>

        {/* Price block */}
        {product.price ? (
          <div className="mt-3 space-y-1.5">
            {/* Single piece row */}
            <div className="flex items-center justify-between rounded-lg border border-ink-100 bg-ink-50 px-3 py-1.5 dark:border-ink-700 dark:bg-ink-800/50">
              <span className="text-[11px] text-ink-500 dark:text-ink-400">1 piece</span>
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-ink-400 line-through">{single.original}</span>
                <span className="text-sm font-extrabold text-ink-900 dark:text-white">{single.sale}</span>
                <span className="rounded bg-amber-500/15 px-1 py-0.5 text-[9px] font-bold text-amber-600 dark:text-amber-400">
                  -{DISCOUNTS.single.pct}%
                </span>
              </div>
            </div>

            {/* Bulk row */}
            <div className="flex items-center justify-between rounded-lg border border-green-200 bg-green-50 px-3 py-1.5 dark:border-green-900/40 dark:bg-green-950/30">
              <span className="text-[11px] font-medium text-green-700 dark:text-green-400">
                5+ pcs 🔥
              </span>
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-ink-400 line-through">{bulk.original}</span>
                <span className="text-sm font-extrabold text-green-700 dark:text-green-400">{bulk.sale}</span>
                <span className="rounded bg-green-600/15 px-1 py-0.5 text-[9px] font-bold text-green-700 dark:text-green-400">
                  -{DISCOUNTS.bulk.pct}%
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-flame-500/10 px-2.5 py-1 text-xs font-bold text-flame-600 dark:text-flame-400">
              💬 Price on request
            </span>
          </div>
        )}

        {/* Sizes preview */}
        {product.sizes.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {product.sizes.slice(0, 5).map((s) => (
              <span key={s} className="rounded border border-ink-200 px-1.5 py-0.5 text-[10px] font-medium text-ink-500 dark:border-ink-700 dark:text-ink-400">
                {s}
              </span>
            ))}
            {product.sizes.length > 5 && (
              <span className="text-[10px] text-ink-400">+{product.sizes.length - 5}</span>
            )}
          </div>
        )}

        {/* Quick Add to Cart */}
        <div className="mt-3">
          <QuickAddToCart
            productId={product.id}
            name={product.name}
            slug={product.slug}
            image={img}
            sizes={product.sizes}
            fabric={product.fabrics[0] ?? ""}
            price={product.price}
          />
        </div>
      </div>
    </div>
  );
}
