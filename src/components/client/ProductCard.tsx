import Image from "next/image";
import Link from "next/link";
import type { ProductView } from "@/lib/data";
import { formatINR } from "@/lib/utils";
import { unitPrice } from "@/lib/pricing";
import { DISCOUNTS } from "@/lib/site";
import { Icon } from "@/components/ui/Icon";
import { QuickAddToCart } from "./QuickAddToCart";

const NEW_FOR_MS = 7 * 24 * 60 * 60 * 1000;

export function ProductCard({ product }: { product: ProductView }) {
  const img = product.images[0] || "/placeholder-product.svg";
  const imgBack = product.images[1] || img;

  // The card is browsed before there is a cart, so it quotes the entry rate
  // (single-piece) and states the bulk rate as the next tier. Both come from
  // the same engine the cart charges from.
  const single = unitPrice(product.price, 1);
  const bulk = unitPrice(product.price, DISCOUNTS.bulk.minQty);

  const isNew =
    product.createdAt != null &&
    Date.now() - new Date(product.createdAt).getTime() < NEW_FOR_MS;

  return (
    <div className="group card card-hover relative flex h-full flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1">
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
            className="scale-105 object-cover opacity-0 transition-all duration-500 group-hover:scale-100 group-hover:opacity-100"
          />

          {/* Badges — at most two, so the artwork stays the subject */}
          <div className="absolute left-3 top-3 flex flex-col items-start gap-1.5">
            {product.featured && (
              <span className="inline-flex items-center gap-1 rounded-full bg-flame-500 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm">
                <Icon name="star" size={10} />
                Bestseller
              </span>
            )}
            {isNew && !product.featured && (
              <span className="rounded-full bg-electric-500 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm">
                New
              </span>
            )}
          </div>

          <span className="absolute right-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-semibold text-ink-700 backdrop-blur dark:bg-ink-900/90 dark:text-ink-200">
            Customizable
          </span>

          {/* Quick view on hover */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-2 bg-gradient-to-t from-ink-950/70 to-transparent px-3 pb-3 pt-8 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <span className="inline-flex items-center gap-1 text-xs font-bold text-white">
              View design
              <Icon name="arrowRight" size={13} />
            </span>
          </div>
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <Link href={`/products/${product.slug}`} className="block">
          <p className="text-[11px] font-bold uppercase tracking-widest text-flame-500">
            {product.categoryName}
          </p>
          <h3 className="mt-1 line-clamp-2 min-h-[2.5rem] text-sm font-semibold text-ink-900 transition-colors group-hover:text-flame-500 dark:text-white">
            {product.name}
          </h3>
        </Link>

        {/* Price. One dominant figure, one supporting line — the previous card
            stacked two bordered boxes of equal weight, so neither read as the
            price. */}
        {product.price != null && single != null ? (
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="nums text-lg font-extrabold text-ink-900 dark:text-white">
                {formatINR(single)}
              </span>
              <span className="nums text-xs text-ink-400 line-through">
                {formatINR(product.price)}
              </span>
              <span className="rounded bg-flame-500/10 px-1.5 py-0.5 text-[10px] font-bold text-flame-600 dark:text-flame-400">
                &minus;{DISCOUNTS.single.pct}%
              </span>
            </div>
            {bulk != null && (
              <p className="nums mt-1 text-[11px] font-medium text-green-700 dark:text-green-400">
                {formatINR(bulk)} each at {DISCOUNTS.bulk.minQty}+ pieces
              </p>
            )}
          </div>
        ) : (
          <div className="mt-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-flame-500/10 px-2.5 py-1 text-xs font-bold text-flame-600 dark:text-flame-400">
              <Icon name="message" size={12} />
              Price on request
            </span>
          </div>
        )}

        {/* Sizes preview */}
        {product.sizes.length > 0 && (
          <div className="mt-2.5 flex flex-wrap gap-1">
            {product.sizes.slice(0, 5).map((s) => (
              <span
                key={s}
                className="rounded border border-ink-200 px-1.5 py-0.5 text-[10px] font-medium text-ink-500 dark:border-ink-700 dark:text-ink-400"
              >
                {s}
              </span>
            ))}
            {product.sizes.length > 5 && (
              <span className="text-[10px] text-ink-400">+{product.sizes.length - 5}</span>
            )}
          </div>
        )}

        {/* Quick add — pinned to the bottom so cards in a row align */}
        <div className="mt-auto pt-3">
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
