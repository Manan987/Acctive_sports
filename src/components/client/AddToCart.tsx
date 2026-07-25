"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import type { ProductView } from "@/lib/data";
import { whatsappLink } from "@/lib/site";

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
          {product.moq > 1 && (
            <span className="text-xs text-ink-500 dark:text-ink-400">
              💡 Buy {product.moq}+ for bulk pricing
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center rounded-xl border-2 border-ink-200 bg-white dark:border-ink-700 dark:bg-ink-900">
            <button
              type="button"
              onClick={dec}
              disabled={qty <= 1}
              className="grid h-11 w-11 place-items-center text-xl font-bold text-ink-600 transition hover:text-flame-500 disabled:cursor-not-allowed disabled:opacity-30 dark:text-ink-300"
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span className="w-12 select-none border-x border-ink-200 text-center text-base font-bold text-ink-900 dark:border-ink-700 dark:text-white">
              {qty}
            </span>
            <button
              type="button"
              onClick={inc}
              className="grid h-11 w-11 place-items-center text-xl font-bold text-ink-600 transition hover:text-flame-500 dark:text-ink-300"
              aria-label="Increase quantity"
            >
              +
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
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                <path d="M20 6 9 17l-5-5" />
              </svg>
              Added to Cart!
            </>
          ) : (
            <>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <path d="M3 6h18M16 10a4 4 0 0 1-8 0" />
              </svg>
              {alreadyIn ? "Add More to Cart" : "Add to Cart"}
            </>
          )}
        </button>

        <a
          href={whatsappLink(waMsg)}
          target="_blank"
          rel="noopener"
          className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-ink-200 py-3 text-sm font-semibold text-[#25D366] transition hover:border-[#25D366] hover:bg-[#25D366]/5 dark:border-ink-700"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
            <path d="M11.993 0C5.373 0 0 5.374 0 11.994c0 2.117.557 4.105 1.527 5.83L.054 23.487a.5.5 0 0 0 .609.61l5.739-1.502A11.94 11.94 0 0 0 11.994 24C18.613 24 24 18.62 24 12 24 5.374 18.613 0 11.993 0zm.001 21.85a9.808 9.808 0 0 1-5.015-1.376l-.359-.213-3.727.976.997-3.641-.234-.374A9.818 9.818 0 0 1 2.15 12c0-5.428 4.414-9.844 9.844-9.844 5.43 0 9.843 4.416 9.843 9.844 0 5.428-4.413 9.85-9.843 9.85z" />
          </svg>
          Order via WhatsApp
        </a>
      </div>
    </div>
  );
}
