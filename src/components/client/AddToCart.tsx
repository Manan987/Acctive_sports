"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import type { ProductView } from "@/lib/data";
import { whatsappLink, DISCOUNTS } from "@/lib/site";
import { Icon } from "@/components/ui/Icon";

export function AddToCart({ product }: { product: ProductView }) {
  const { add, openDrawer, isInCart } = useCart();
  const [size, setSize] = useState(product.sizes[0] ?? "");
  const [fabric, setFabric] = useState(product.fabrics[0] ?? "");
  const [qty, setQty] = useState(1);
  const [note, setNote] = useState("");
  const [added, setAdded] = useState(false);

  const alreadyIn = isInCart(product.id, size);

  function dec() { setQty((q) => Math.max(1, q - 1)); }
  function inc() { setQty((q) => q + 1); }

  function onAdd() {
    add({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      image: product.images[0] || "/placeholder-product.svg",
      qty,
      size,
      fabric,
      price: product.price,
      note: note.trim() || undefined,
    });
    setAdded(true);
    openDrawer();
    setTimeout(() => setAdded(false), 2500);
  }

  const waMsg = `Hi ACCTIVE, I'm interested in "${product.name}". Qty: ${qty}${size ? `, Size: ${size}` : ""}${fabric ? `, Fabric: ${fabric}` : ""}.`;

  return (
    <div className="mt-6 space-y-5">
      {/* Size grid selector */}
      {product.sizes.length > 0 && (
        <div>
          <div className="mb-2.5 flex items-center justify-between">
            <span className="text-sm font-semibold text-ink-700 dark:text-ink-300">Size</span>
            {size && (
              <span className="text-xs font-bold uppercase tracking-wide text-flame-500">
                {size} Selected
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSize(s)}
                className={`min-w-12 rounded-xl border-2 px-3 py-2.5 text-sm font-bold transition-all duration-150 ${
                  size === s
                    ? "border-flame-500 bg-flame-500 text-white shadow-lg shadow-flame-500/30 scale-105"
                    : "border-ink-200 text-ink-700 hover:border-ink-400 dark:border-ink-700 dark:text-ink-200 dark:hover:border-ink-500"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Fabric */}
      {product.fabrics.length > 0 && (
        <div>
          <label className="label" htmlFor="atc-fabric">
            Fabric / Material
          </label>
          <select
            id="atc-fabric"
            value={fabric}
            onChange={(e) => setFabric(e.target.value)}
            className="input"
          >
            {product.fabrics.map((f) => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
        </div>
      )}

      {/* Quantity stepper — clean display, no browser number input arrows */}
      <div>
        <div className="mb-2.5 flex items-center justify-between">
          <span className="text-sm font-semibold text-ink-700 dark:text-ink-300">Quantity</span>
          <span className="text-xs text-ink-500 dark:text-ink-400">
            {DISCOUNTS.bulk.minQty}+ pieces in your order unlocks {DISCOUNTS.bulk.pct}% off
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center rounded-xl border-2 border-ink-200 bg-white dark:border-ink-700 dark:bg-ink-900">
            <button
              type="button"
              onClick={dec}
              disabled={qty <= 1}
              className="grid h-11 w-11 place-items-center text-ink-600 transition hover:text-flame-500 disabled:cursor-not-allowed disabled:opacity-30 dark:text-ink-300"
              aria-label="Decrease quantity"
            >
              <Icon name="minus" size={17} strokeWidth={2.2} />
            </button>
            <span className="nums w-12 select-none border-x border-ink-200 text-center text-base font-bold text-ink-900 dark:border-ink-700 dark:text-white">
              {qty}
            </span>
            <button
              type="button"
              onClick={inc}
              className="grid h-11 w-11 place-items-center text-ink-600 transition hover:text-flame-500 dark:text-ink-300"
              aria-label="Increase quantity"
            >
              <Icon name="plus" size={17} strokeWidth={2.2} />
            </button>
          </div>
          <span className="text-sm text-ink-500 dark:text-ink-400">
            {qty} {qty === 1 ? "piece" : "pieces"}
          </span>
        </div>
      </div>

      {/* Customization note */}
      <div>
        <label className="label" htmlFor="atc-note">
          Customization Note{" "}
          <span className="font-normal text-ink-400">(optional)</span>
        </label>
        <textarea
          id="atc-note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={2}
          placeholder="Team name, colours, logo placement, deadline…"
          className="input resize-none"
        />
      </div>

      {/* Add to Cart CTA */}
      <div className="flex flex-col gap-3 pt-1">
        <button
          type="button"
          onClick={onAdd}
          className={`flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-base font-bold transition-all duration-200 ${
            added
              ? "bg-green-500 text-white shadow-xl shadow-green-500/30"
              : "bg-ink-900 text-white hover:bg-flame-500 hover:shadow-xl hover:shadow-flame-500/30 dark:bg-white dark:text-ink-900 dark:hover:bg-flame-500 dark:hover:text-white"
          }`}
        >
          {added ? (
            <>
              <Icon name="check" size={18} strokeWidth={2.6} />
              Added to cart
            </>
          ) : (
            <>
              <Icon name="cart" size={18} />
              {alreadyIn ? "Add more to cart" : "Add to cart"}
            </>
          )}
        </button>

        <a
          href={whatsappLink(waMsg)}
          target="_blank"
          rel="noopener"
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-ink-200 py-3 text-sm font-semibold text-[#25D366] transition hover:border-[#25D366] hover:bg-[#25D366]/5 dark:border-ink-700"
        >
          <Icon name="whatsapp" size={16} />
          Order via WhatsApp
        </a>
      </div>
    </div>
  );
}
