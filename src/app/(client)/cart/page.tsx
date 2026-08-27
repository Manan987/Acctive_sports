"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { formatINR } from "@/lib/utils";
import { cartTotals, unitPrice } from "@/lib/pricing";
import { DISCOUNTS } from "@/lib/site";
import { Icon } from "@/components/ui/Icon";

export default function CartPage() {
  const { items, totalItems, totalPieces, update, remove, clear } = useCart();

  // Every money figure on this page comes from the shared pricing engine, so
  // the cart charges exactly what the product page advertised.
  const totals = cartTotals(items);

  if (items.length === 0) {
    return (
      <div className="container-x py-24 text-center">
        <div className="mx-auto max-w-md">
          <div className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-ink-100 text-ink-400 dark:bg-ink-800">
            <Icon name="cart" size={38} />
          </div>
          <h1 className="mt-8 text-3xl font-extrabold">Your cart is empty</h1>
          <p className="mt-3 text-ink-500 dark:text-ink-400">
            Browse the catalogue and add the designs you want quoted or manufactured.
          </p>
          <Link href="/catalogue" className="btn-primary mt-8 inline-flex">
            Browse catalogue
            <Icon name="arrowRight" size={16} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-x py-10 md:py-14">
      {/* Page header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold sm:text-4xl">Your cart</h1>
          <p className="nums mt-1 text-sm text-ink-500 dark:text-ink-400">
            {totalItems} item{totalItems !== 1 ? "s" : ""} · {totalPieces} piece{totalPieces !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={clear}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-400 transition hover:text-red-500"
        >
          <Icon name="trash" size={15} />
          Clear all
        </button>
      </div>

      {/* Bulk tier nudge — states plainly how close the order is to the next rate */}
      {totals.hasPrice && totals.tier === "single" && (
        <div className="mt-6 flex items-start gap-3 rounded-2xl border border-green-500/25 bg-green-50 px-4 py-3 dark:border-green-800/40 dark:bg-green-950/25">
          <span className="mt-0.5 shrink-0 text-green-600 dark:text-green-400">
            <Icon name="percent" size={18} />
          </span>
          <p className="text-sm text-green-800 dark:text-green-300">
            <span className="font-semibold">
              Add {totals.piecesToBulk} more piece{totals.piecesToBulk !== 1 ? "s" : ""}
            </span>{" "}
            to reach {DISCOUNTS.bulk.minQty} and unlock {DISCOUNTS.bulk.pct}% off the whole order —
            your total would drop to{" "}
            <span className="font-semibold nums">{formatINR(totals.bulkSubtotal)}</span>.
          </p>
        </div>
      )}

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        {/* Cart items */}
        <div className="space-y-4 lg:col-span-2">
          {items.map((item) => {
            const unit = unitPrice(item.price, totalPieces);
            return (
              <div key={item.cartKey} className="card flex gap-5 p-5">
                {/* Product image */}
                <Link
                  href={`/products/${item.slug}`}
                  className="relative h-28 w-28 shrink-0 overflow-hidden rounded-2xl bg-ink-100 dark:bg-ink-800"
                >
                  <Image src={item.image} alt={item.name} fill sizes="112px" className="object-cover" />
                </Link>

                {/* Info */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <Link
                      href={`/products/${item.slug}`}
                      className="line-clamp-2 text-base font-bold leading-snug transition hover:text-flame-500"
                    >
                      {item.name}
                    </Link>
                    <button
                      type="button"
                      onClick={() => remove(item.cartKey)}
                      className="shrink-0 rounded-lg p-1 text-ink-400 transition hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20"
                      aria-label={`Remove ${item.name}`}
                    >
                      <Icon name="close" size={16} strokeWidth={2.2} />
                    </button>
                  </div>

                  {/* Variant chips */}
                  <div className="mt-2 flex flex-wrap gap-2">
                    {item.size && (
                      <span className="rounded-lg bg-ink-100 px-2.5 py-1 text-xs font-semibold text-ink-700 dark:bg-ink-800 dark:text-ink-200">
                        Size {item.size}
                      </span>
                    )}
                    {item.fabric && (
                      <span className="rounded-lg bg-ink-100 px-2.5 py-1 text-xs font-semibold text-ink-700 dark:bg-ink-800 dark:text-ink-200">
                        {item.fabric}
                      </span>
                    )}
                  </div>

                  {/* Qty + price */}
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center overflow-hidden rounded-xl border border-ink-200 dark:border-ink-700">
                      <button
                        type="button"
                        onClick={() => { if (item.qty > 1) update(item.cartKey, { qty: item.qty - 1 }); }}
                        disabled={item.qty <= 1}
                        className="grid h-9 w-9 place-items-center text-ink-600 transition hover:bg-ink-100 hover:text-flame-500 disabled:cursor-not-allowed disabled:opacity-30 dark:text-ink-300 dark:hover:bg-ink-800"
                        aria-label="Decrease quantity"
                      >
                        <Icon name="minus" size={15} strokeWidth={2.2} />
                      </button>
                      <span className="nums w-12 border-x border-ink-200 text-center text-sm font-bold dark:border-ink-700">
                        {item.qty}
                      </span>
                      <button
                        type="button"
                        onClick={() => update(item.cartKey, { qty: item.qty + 1 })}
                        className="grid h-9 w-9 place-items-center text-ink-600 transition hover:bg-ink-100 hover:text-flame-500 dark:text-ink-300 dark:hover:bg-ink-800"
                        aria-label="Increase quantity"
                      >
                        <Icon name="plus" size={15} strokeWidth={2.2} />
                      </button>
                    </div>

                    {item.price != null && unit != null ? (
                      <div className="text-right">
                        <span className="nums text-xl font-extrabold text-ink-900 dark:text-white">
                          {formatINR(unit * item.qty)}
                        </span>
                        <p className="nums mt-0.5 text-xs text-ink-400">
                          <span className="line-through">{formatINR(item.price)}</span>{" "}
                          <span className="font-semibold text-green-600 dark:text-green-400">
                            {formatINR(unit)}
                          </span>{" "}
                          each
                        </p>
                      </div>
                    ) : (
                      <span className="text-sm font-semibold text-flame-500">Price on request</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          <Link
            href="/catalogue"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-500 transition hover:text-flame-500"
          >
            <Icon name="chevronLeft" size={16} />
            Continue shopping
          </Link>
        </div>

        {/* Order summary */}
        <div>
          <div className="card sticky top-24 overflow-hidden">
            <div className="border-b border-ink-100 bg-ink-50 px-6 py-5 dark:border-ink-800 dark:bg-ink-800/40">
              <h2 className="text-xl font-bold">Order summary</h2>
            </div>
            <div className="space-y-3 px-6 py-5 text-sm">
              <div className="flex justify-between text-ink-600 dark:text-ink-400">
                <span>Items</span>
                <span className="nums font-semibold text-ink-900 dark:text-white">{totalItems}</span>
              </div>
              <div className="flex justify-between text-ink-600 dark:text-ink-400">
                <span>Total pieces</span>
                <span className="nums font-semibold text-ink-900 dark:text-white">{totalPieces}</span>
              </div>

              {totals.hasPrice ? (
                <>
                  <div className="my-3 rule-fade" />
                  <div className="flex justify-between text-ink-600 dark:text-ink-400">
                    <span>Subtotal (MRP)</span>
                    <span className="nums line-through">{formatINR(totals.mrpSubtotal)}</span>
                  </div>
                  <div className="flex justify-between text-green-600 dark:text-green-400">
                    <span className="inline-flex items-center gap-1.5">
                      <Icon name="tag" size={14} />
                      {totals.label} &minus;{totals.pct}%
                    </span>
                    <span className="nums font-semibold">&minus;{formatINR(totals.savings)}</span>
                  </div>
                  <div className="my-3 rule-fade" />
                  <div className="flex items-baseline justify-between">
                    <span className="font-bold text-ink-900 dark:text-white">Total</span>
                    <span className="nums text-2xl font-extrabold text-ink-900 dark:text-white">
                      {formatINR(totals.subtotal)}
                    </span>
                  </div>
                  <p className="text-[11px] text-ink-400">
                    Discount already applied. Shipping and any customization charges are
                    confirmed when we approve your order.
                  </p>
                </>
              ) : (
                <p className="rounded-xl bg-flame-500/10 px-3 py-2 text-xs font-medium text-flame-600 dark:text-flame-400">
                  Custom pricing will be confirmed once we review your order.
                </p>
              )}
            </div>

            <div className="border-t border-ink-100 px-6 py-5 dark:border-ink-800">
              <Link
                href="/checkout"
                className="btn-primary w-full justify-center py-3.5 text-base font-bold"
              >
                Proceed to checkout
                <Icon name="arrowRight" size={17} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
