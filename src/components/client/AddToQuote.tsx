"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuote } from "@/context/QuoteContext";
import type { ProductView } from "@/lib/data";
import { whatsappLink } from "@/lib/site";

export function AddToQuote({ product }: { product: ProductView }) {
  const { add, has } = useQuote();
  const [size, setSize] = useState(product.sizes[0] ?? "L");
  const [fabric, setFabric] = useState(product.fabrics[0] ?? "");
  const [qty, setQty] = useState(product.moq);
  const [note, setNote] = useState("");
  const [added, setAdded] = useState(false);

  const inList = has(product.id);

  function onAdd() {
    add({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      image: product.images[0] || "/placeholder-product.svg",
      qty,
      size,
      fabric,
      note: note.trim() || undefined,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  }

  const waMsg = `Hi ACCTIVE, I'm interested in "${product.name}". Qty: ${qty}, Size: ${size}${fabric ? `, Fabric: ${fabric}` : ""}.`;

  return (
    <div className="mt-6 space-y-4">
      {/* Size */}
      {product.sizes.length > 0 && (
        <div>
          <span className="label">Size</span>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((s) => (
              <button
                key={s}
                onClick={() => setSize(s)}
                className={`min-w-11 rounded-lg border px-3 py-2 text-sm font-medium transition ${
                  size === s
                    ? "border-flame-500 bg-flame-500 text-white"
                    : "border-ink-200 dark:border-ink-700"
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
          <label className="label" htmlFor="fabric">Fabric</label>
          <select id="fabric" value={fabric} onChange={(e) => setFabric(e.target.value)} className="input">
            {product.fabrics.map((f) => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
        </div>
      )}

      {/* Quantity */}
      <div>
        <label className="label" htmlFor="qty">
          Quantity <span className="text-ink-400">(MOQ {product.moq})</span>
        </label>
        <div className="flex w-40 items-center rounded-xl border border-ink-200 dark:border-ink-700">
          <button
            onClick={() => setQty((q) => Math.max(1, q - 5))}
            className="grid h-11 w-11 place-items-center text-lg"
            aria-label="Decrease quantity"
          >−</button>
          <input
            id="qty"
            type="number"
            min={1}
            value={qty}
            onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))}
            className="h-11 w-full border-x border-ink-200 bg-transparent text-center text-sm dark:border-ink-700"
          />
          <button
            onClick={() => setQty((q) => q + 5)}
            className="grid h-11 w-11 place-items-center text-lg"
            aria-label="Increase quantity"
          >+</button>
        </div>
      </div>

      {/* Note */}
      <div>
        <label className="label" htmlFor="note">Customization note (optional)</label>
        <textarea
          id="note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={2}
          placeholder="Team name, colours, logo details…"
          className="input resize-none"
        />
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3 pt-1">
        <button onClick={onAdd} className="btn-primary flex-1 sm:flex-none">
          {added ? "✓ Added to quote" : inList ? "Add more to quote" : "Add to quote"}
        </button>
        <Link href="/quote" className="btn-secondary">
          View quote list
        </Link>
        <a href={whatsappLink(waMsg)} target="_blank" rel="noopener" className="btn-secondary text-[#25D366]">
          WhatsApp
        </a>
      </div>
      {added && (
        <p className="text-sm font-medium text-green-600">
          Added! Continue browsing or head to your quote list to submit.
        </p>
      )}
    </div>
  );
}
