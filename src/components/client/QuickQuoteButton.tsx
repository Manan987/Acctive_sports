"use client";

import { useState } from "react";
import { useQuote } from "@/context/QuoteContext";

type Props = {
  productId: string;
  name: string;
  slug: string;
  image: string;
  size: string;
  fabric: string;
  moq: number;
};

export function QuickQuoteButton(props: Props) {
  const { add } = useQuote();
  const [added, setAdded] = useState(false);

  function onClick(e: React.MouseEvent) {
    // Card is a Link — don't navigate when tapping the quick-add button
    e.preventDefault();
    e.stopPropagation();
    add({
      productId: props.productId,
      name: props.name,
      slug: props.slug,
      image: props.image,
      qty: props.moq,
      size: props.size,
      fabric: props.fabric,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  return (
    <button
      onClick={onClick}
      aria-label={`Add ${props.name} to quote`}
      className={`w-full rounded-lg py-2 text-xs font-bold transition ${
        added
          ? "bg-green-500 text-white"
          : "bg-ink-900 text-white hover:bg-flame-500 dark:bg-white dark:text-ink-900 dark:hover:bg-flame-500 dark:hover:text-white"
      }`}
    >
      {added ? "✓ Added to quote" : "+ Add to quote"}
    </button>
  );
}
