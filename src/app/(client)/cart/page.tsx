"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { formatINR } from "@/lib/utils";

export default function CartPage() {
  const { items, totalItems, totalPieces, update, remove, clear } = useCart();

  const hasPrice = items.some((i) => i.price != null);
  const subtotal = items.reduce((s, i) => s + (i.price ?? 0) * i.qty, 0);

  if (items.length === 0) {
    return (
      <div className="container-x py-24 text-center">
        <div className="mx-auto max-w-md">
          <div className="mx-auto grid h-28 w-28 place-items-center rounded-full bg-ink-100 dark:bg-ink-800 text-6xl">
            🛒
          </div>
          <h1 className="mt-8 font-display text-3xl font-extrabold">Your cart is empty</h1>
          <p className="mt-3 text-ink-500 dark:text-ink-400">
            Browse our catalogue and find products to add to your cart.
          </p>
          <Link href="/catalogue" className="btn-primary mt-8 inline-flex">
            Browse Catalogue
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-x py-10 md:py-14">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-extrabold sm:text-4xl">Your Cart</h1>
          <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">
            {totalItems} item{totalItems !== 1 ? "s" : ""} · {totalPieces} piece{totalPieces !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={clear}
          className="text-sm font-medium text-ink-400 hover:text-red-500 transition"
        >
          Clear all
        </button>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        {/* Cart items */}
        <div className="space-y-4 lg:col-span-2">
          {items.map((item) => (
            <div key={item.cartKey} className="card flex gap-5 p-5">
              {/* Product image */}
              <Link
                href={`/products/${item.slug}`}
                className="relative h-28 w-28 shrink-0 overflow-hidden rounded-2xl bg-ink-100 dark:bg-ink-800"
              >
                <Image src={item.image} alt={item.name} fill className="object-cover" />
              </Link>

              {/* Info */}
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <Link
                    href={`/products/${item.slug}`}
                    className="font-display text-base font-bold leading-snug hover:text-flame-500 transition line-clamp-2"
                  >
                    {item.name}
                  </Link>
                  <button
                    type="button"
                    onClick={() => remove(item.cartKey)}
                    className="shrink-0 rounded-lg p-1 text-ink-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20 transition"
                    aria-label={`Remove ${item.name}`}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <path d="M18 6 6 18M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Variant chips */}
                <div className="mt-2 flex flex-wrap gap-2">
                  {item.size && (
                    <span className="rounded-lg bg-ink-100 px-2.5 py-1 text-xs font-semibold text-ink-700 dark:bg-ink-800 dark:text-ink-200">
                      Size: {item.size}
                    </span>
                  )}
                  {item.fabric && (
                    <span className="rounded-lg bg-ink-100 px-2.5 py-1 text-xs font-semibold text-ink-700 dark:bg-ink-800 dark:text-ink-200">
                      {item.fabric}
                    </span>
                  )}
                </div>

                {/* Qty + price */}
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center overflow-hidden rounded-xl border-2 border-ink-200 dark:border-ink-700">
                    <button
                      type="button"
                      onClick={() => { if (item.qty > 1) update(item.cartKey, { qty: item.qty - 1 }); }}
                      disabled={item.qty <= 1}
                      className="grid h-9 w-9 place-items-center text-lg font-bold text-ink-600 hover:bg-ink-100 hover:text-flame-500 dark:text-ink-300 dark:hover:bg-ink-800 transition disabled:opacity-30 disabled:cursor-not-allowed"
                      aria-label="Decrease quantity"
                    >−</button>
                    <span className="w-12 border-x border-ink-200 text-center text-sm font-bold dark:border-ink-700">
                      {item.qty}
                    </span>
                    <button
                      type="button"
                      onClick={() => update(item.cartKey, { qty: item.qty + 1 })}
                      className="grid h-9 w-9 place-items-center text-lg font-bold text-ink-600 hover:bg-ink-100 hover:text-flame-500 dark:text-ink-300 dark:hover:bg-ink-800 transition"
                      aria-label="Increase quantity"
                    >+</button>
                  </div>

                  {item.price != null ? (
                    <div className="text-right">
                      <span className="font-display text-xl font-extrabold text-ink-900 dark:text-white">
                        {formatINR(item.price * item.qty)}
                      </span>
                      {item.qty > 1 && (
                        <p className="text-xs text-ink-400">{formatINR(item.price)} each</p>
                      )}
                    </div>
                  ) : (
                    <span className="text-sm font-semibold text-flame-500">Price on request</span>
                  )}
                </div>
              </div>
            </div>
          ))}

          <Link href="/catalogue" className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-500 hover:text-flame-500 transition">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="m15 18-6-6 6-6" />
            </svg>
            Continue Shopping
          </Link>
        </div>

        {/* Order summary */}
        <div>
          <div className="card sticky top-20 overflow-hidden">
            <div className="border-b border-ink-100 bg-ink-50 px-6 py-5 dark:border-ink-800 dark:bg-ink-800/40">
              <h2 className="font-display text-xl font-bold">Order Summary</h2>
            </div>
            <div className="space-y-3 px-6 py-5 text-sm">
              <div className="flex justify-between text-ink-600 dark:text-ink-400">
                <span>Items</span>
                <span className="font-semibold text-ink-900 dark:text-white">{totalItems}</span>
              </div>
              <div className="flex justify-between text-ink-600 dark:text-ink-400">
                <span>Total pieces</span>
                <span className="font-semibold text-ink-900 dark:text-white">{totalPieces}</span>
              </div>

              {hasPrice && (
                <>
                  <div className="my-2 border-t border-dashed border-ink-200 dark:border-ink-700" />
                  <div className="flex justify-between">
                    <span className="font-bold text-ink-900 dark:text-white">Subtotal</span>
                    <span className="font-display text-lg font-extrabold text-ink-900 dark:text-white">
                      {formatINR(subtotal)}
                    </span>
                  </div>
                  <p className="text-[11px] text-ink-400">
                    Shipping &amp; bulk discounts confirmed at checkout.
                  </p>
                </>
              )}

              {!hasPrice && (
                <p className="rounded-xl bg-flame-500/10 px-3 py-2 text-xs font-medium text-flame-600 dark:text-flame-400">
                  Custom pricing will be confirmed once we review your order.
                </p>
              )}
            </div>

            <div className="space-y-3 border-t border-ink-100 px-6 py-5 dark:border-ink-800">
              <Link href="/checkout" className="btn-primary w-full justify-center py-3.5 text-base font-bold">
                Proceed to Checkout →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
