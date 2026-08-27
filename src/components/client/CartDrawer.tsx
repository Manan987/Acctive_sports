"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { formatINR } from "@/lib/utils";
import { cartTotals, unitPrice } from "@/lib/pricing";
import { DISCOUNTS } from "@/lib/site";
import { Icon } from "@/components/ui/Icon";

export function CartDrawer() {
  const { items, totalItems, totalPieces, drawerOpen, closeDrawer, update, remove } = useCart();

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  // Close on Escape — only while open, so the listener isn't swallowing Escape
  // for other dialogs (e.g. the size guide) when the cart isn't showing.
  useEffect(() => {
    if (!drawerOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") closeDrawer(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [drawerOpen, closeDrawer]);

  // The panel stays mounted and merely slides off-screen, so while it is closed
  // every link and button inside it is still in the tab order and still read by
  // screen readers — keyboard users would tab into an invisible cart.
  const panelRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = panelRef.current;
    if (!el) return;
    if (drawerOpen) {
      el.removeAttribute("inert");
      // Move focus into the dialog so the next Tab stays inside it.
      el.querySelector<HTMLElement>("button, a[href]")?.focus();
    } else {
      el.setAttribute("inert", "");
    }
  }, [drawerOpen]);

  const totals = cartTotals(items);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[60] bg-ink-950/60 backdrop-blur-sm transition-opacity duration-300 ${drawerOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={closeDrawer}
        aria-hidden
      />

      {/* Drawer panel */}
      <div
        ref={panelRef}
        className={`fixed inset-y-0 right-0 z-[70] flex w-full max-w-md flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out dark:bg-ink-900 ${drawerOpen ? "translate-x-0" : "translate-x-full"}`}
        role="dialog"
        aria-modal={drawerOpen}
        aria-hidden={!drawerOpen}
        aria-label="Shopping cart"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-ink-100 px-5 py-4 dark:border-ink-800">
          <div>
            <h2 className="font-display text-xl font-bold">Shopping Cart</h2>
            <p className="mt-0.5 text-xs text-ink-500 dark:text-ink-400">
              {totalItems === 0
                ? "No items yet"
                : `${totalItems} item${totalItems !== 1 ? "s" : ""} · ${totalPieces} piece${totalPieces !== 1 ? "s" : ""}`}
            </p>
          </div>
          <button
            onClick={closeDrawer}
            className="grid h-9 w-9 place-items-center rounded-full text-ink-500 hover:bg-ink-100 dark:hover:bg-ink-800 transition"
            aria-label="Close cart"
          >
            <Icon name="close" size={18} strokeWidth={2.2} />
          </button>
        </div>

        {/* Empty state */}
        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
            <div className="grid h-20 w-20 place-items-center rounded-full bg-ink-100 text-ink-400 dark:bg-ink-800">
              <Icon name="cart" size={32} />
            </div>
            <div>
              <p className="text-lg font-bold text-ink-800 dark:text-ink-100">Your cart is empty</p>
              <p className="mt-1 text-sm text-ink-500">Add products to get started.</p>
            </div>
            <button
              onClick={closeDrawer}
              className="btn-primary mt-2"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <>
            {/* Items list */}
            <div className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
              {items.map((item) => {
                const unit = unitPrice(item.price, totalPieces);
                return (
                <div key={item.cartKey} className="flex gap-4 rounded-2xl border border-ink-100 bg-ink-50/50 p-3 dark:border-ink-800 dark:bg-ink-800/30">
                  <Link
                    href={`/products/${item.slug}`}
                    onClick={closeDrawer}
                    className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-ink-100 dark:bg-ink-800"
                  >
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  </Link>
                  <div className="flex min-w-0 flex-1 flex-col gap-2">
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        href={`/products/${item.slug}`}
                        onClick={closeDrawer}
                        className="line-clamp-2 text-sm font-semibold leading-snug hover:text-flame-500 transition"
                      >
                        {item.name}
                      </Link>
                      <button
                        onClick={() => remove(item.cartKey)}
                        className="shrink-0 text-ink-400 transition hover:text-red-500"
                        aria-label={`Remove ${item.name}`}
                      >
                        <Icon name="close" size={14} strokeWidth={2.2} />
                      </button>
                    </div>

                    {/* Size / Fabric chips */}
                    <div className="flex flex-wrap gap-1.5">
                      {item.size && (
                        <span className="rounded-md bg-ink-200/60 px-2 py-0.5 text-[10px] font-semibold text-ink-700 dark:bg-ink-700 dark:text-ink-200">
                          {item.size}
                        </span>
                      )}
                      {item.fabric && (
                        <span className="rounded-md bg-ink-200/60 px-2 py-0.5 text-[10px] font-semibold text-ink-700 dark:bg-ink-700 dark:text-ink-200">
                          {item.fabric}
                        </span>
                      )}
                    </div>

                    {/* Qty + price */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center overflow-hidden rounded-lg border border-ink-200 dark:border-ink-700">
                        <button
                          type="button"
                          onClick={() => { if (item.qty > 1) update(item.cartKey, { qty: item.qty - 1 }); }}
                          disabled={item.qty <= 1}
                          className="grid h-7 w-7 place-items-center text-ink-600 transition hover:bg-ink-100 disabled:cursor-not-allowed disabled:opacity-30 dark:text-ink-300 dark:hover:bg-ink-700"
                          aria-label="Decrease"
                        >
                          <Icon name="minus" size={13} strokeWidth={2.2} />
                        </button>
                        <span className="nums w-8 border-x border-ink-200 text-center text-sm font-bold dark:border-ink-700">{item.qty}</span>
                        <button
                          type="button"
                          onClick={() => update(item.cartKey, { qty: item.qty + 1 })}
                          className="grid h-7 w-7 place-items-center text-ink-600 transition hover:bg-ink-100 dark:text-ink-300 dark:hover:bg-ink-700"
                          aria-label="Increase"
                        >
                          <Icon name="plus" size={13} strokeWidth={2.2} />
                        </button>
                      </div>
                      {item.price != null && unit != null ? (
                        <div className="text-right">
                          <span className="nums text-sm font-bold text-ink-900 dark:text-white">
                            {formatINR(unit * item.qty)}
                          </span>
                          <p className="nums text-[10px] text-ink-400 line-through">
                            {formatINR(item.price * item.qty)}
                          </p>
                        </div>
                      ) : (
                        <span className="text-xs font-semibold text-flame-500">Price on request</span>
                      )}
                    </div>
                  </div>
                </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="space-y-3 border-t border-ink-100 px-5 py-5 dark:border-ink-800">
              {totals.hasPrice && (
                <>
                  {totals.tier === "single" && (
                    <p className="rounded-lg bg-green-50 px-3 py-2 text-[11px] leading-snug text-green-800 dark:bg-green-950/30 dark:text-green-300">
                      Add <span className="font-semibold">{totals.piecesToBulk} more</span> to reach{" "}
                      {DISCOUNTS.bulk.minQty} pieces and save {DISCOUNTS.bulk.pct}%.
                    </p>
                  )}
                  <div className="flex items-center justify-between text-xs text-green-600 dark:text-green-400">
                    <span>{totals.label} &minus;{totals.pct}%</span>
                    <span className="nums font-semibold">&minus;{formatINR(totals.savings)}</span>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="nums text-sm text-ink-500 dark:text-ink-400">
                      Total ({totalPieces} pcs)
                    </span>
                    <span className="nums text-lg font-extrabold text-ink-900 dark:text-white">
                      {formatINR(totals.subtotal)}
                    </span>
                  </div>
                </>
              )}
              <p className="text-[11px] text-ink-400">
                Shipping and customization charges are confirmed at checkout.
              </p>
              <Link
                href="/checkout"
                onClick={closeDrawer}
                className="btn-primary w-full justify-center py-3 text-base font-bold"
              >
                Checkout
                <Icon name="arrowRight" size={16} />
              </Link>
              <Link
                href="/cart"
                onClick={closeDrawer}
                className="btn-secondary w-full justify-center text-sm"
              >
                View full cart
              </Link>
            </div>
          </>
        )}
      </div>
    </>
  );
}
