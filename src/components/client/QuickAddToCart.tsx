"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";

type Props = {
  productId: string;
  name: string;
  slug: string;
  image: string;
  sizes: string[];
  fabric: string;
  price: number | null;
};

export function QuickAddToCart(props: Props) {
  const { add, openDrawer } = useCart();
  const [picking, setPicking] = useState(false);
  const [added, setAdded] = useState(false);

  function onAddWithSize(size: string) {
    add({
      productId: props.productId,
      name: props.name,
      slug: props.slug,
      image: props.image,
      qty: 1,
      size,
      fabric: props.fabric,
      price: props.price,
    });
    setAdded(true);
    setPicking(false);
    openDrawer();
    setTimeout(() => setAdded(false), 2000);
  }

  function onButtonClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (added) return;
    if (props.sizes.length <= 1) {
      onAddWithSize(props.sizes[0] ?? "");
    } else {
      setPicking((p) => !p);
    }
  }

  return (
    <div className="relative" onClick={(e) => e.preventDefault()}>
      {/* Size picker popup */}
      {picking && (
        <div
          className="absolute bottom-full left-0 right-0 z-20 mb-2 overflow-hidden rounded-2xl border border-ink-200 bg-white p-3 shadow-2xl dark:border-ink-700 dark:bg-ink-900"
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
        >
          <p className="mb-2 text-center text-[10px] font-bold uppercase tracking-widest text-ink-400">
            Select Size
          </p>
          <div className="flex flex-wrap justify-center gap-1.5">
            {props.sizes.map((s) => (
              <button
                key={s}
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); onAddWithSize(s); }}
                className="min-w-9 rounded-lg border-2 border-ink-200 px-2.5 py-1.5 text-xs font-bold transition hover:border-flame-500 hover:bg-flame-500 hover:text-white dark:border-ink-700 dark:text-ink-200"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main CTA button */}
      <button
        onClick={onButtonClick}
        aria-label={`Add ${props.name} to cart`}
        className={`w-full rounded-xl py-2.5 text-xs font-bold transition-all duration-200 ${
          added
            ? "bg-green-500 text-white shadow-lg shadow-green-500/30"
            : picking
            ? "bg-ink-700 text-white dark:bg-ink-600"
            : "bg-ink-900 text-white hover:bg-flame-500 hover:shadow-lg hover:shadow-flame-500/25 dark:bg-white dark:text-ink-900 dark:hover:bg-flame-500 dark:hover:text-white"
        }`}
      >
        {added ? "Added to cart" : picking ? "Cancel" : "Add to cart"}
      </button>
    </div>
  );
}
