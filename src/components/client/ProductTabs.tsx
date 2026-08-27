"use client";

import { useState } from "react";
import type { ProductView } from "@/lib/data";
import { ORDER } from "@/lib/site";
import { Icon } from "@/components/ui/Icon";

const TABS = ["Description", "Specifications", "Customization & Delivery"] as const;

export function ProductTabs({ product }: { product: ProductView }) {
  const [tab, setTab] = useState<(typeof TABS)[number]>("Description");

  return (
    <div className="mt-14">
      <div className="flex flex-wrap gap-1 border-b border-ink-100 dark:border-ink-800">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`-mb-px border-b-2 px-4 py-3 text-sm font-semibold transition ${
              tab === t
                ? "border-flame-500 text-flame-500"
                : "border-transparent text-ink-500 hover:text-ink-900 dark:text-ink-400 dark:hover:text-white"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="prose-none py-6 text-ink-600 dark:text-ink-300">
        {tab === "Description" && (
          <div className="space-y-3">
            <p>{product.description || "Premium custom sportswear, made to order."}</p>
            <p>
              Every {product.categoryName.toLowerCase()} is manufactured in-house at our
              Meerut facility using professional sublimation printing, so your colours,
              logo and player names are printed edge-to-edge and never crack or fade.
            </p>
          </div>
        )}

        {tab === "Specifications" && (
          <dl className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
            <Spec label="Category" value={product.categoryName} />
            <Spec label="Available fabrics" value={product.fabrics.join(", ") || "On request"} />
            <Spec label="Sizes" value={product.sizes.join(", ") || "XS–3XL"} />
            <Spec label="Sports" value={product.sports.join(", ") || "All"} />
            <Spec label="Print" value="Full sublimation (edge-to-edge)" />
            {/* Only worth stating when this design actually demands more than
                the site minimum. Products still carrying the legacy moq of 50
                were contradicting the "order from 1 piece" promise on the same
                page, in the announcement bar and in the FAQ. */}
            <Spec
              label="Minimum order"
              value={
                product.moq > ORDER.minQty
                  ? `${product.moq} pieces for this design`
                  : `${ORDER.minQty} piece`
              }
            />
          </dl>
        )}

        {tab === "Customization & Delivery" && (
          <div className="grid gap-8 sm:grid-cols-2">
            <div>
              <h4 className="font-sans font-semibold tracking-normal text-ink-900 dark:text-white">
                Customization
              </h4>
              <PointList
                points={[
                  "Team name, player names and numbers",
                  "Club, school or brand logo",
                  "Any colour combination",
                  "Free digital mockup before production",
                ]}
              />
            </div>
            <div>
              <h4 className="font-sans font-semibold tracking-normal text-ink-900 dark:text-white">
                Delivery
              </h4>
              <PointList
                points={[
                  "Pan-India dispatch from Meerut",
                  "Bulk and repeat orders supported",
                  "Timelines shared with your quote",
                  "QC checked before every dispatch",
                ]}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function PointList({ points }: { points: string[] }) {
  return (
    <ul className="mt-3 space-y-2 text-sm">
      {points.map((p) => (
        <li key={p} className="flex items-start gap-2.5">
          <span className="mt-0.5 shrink-0 text-flame-500">
            <Icon name="check" size={15} strokeWidth={2.4} />
          </span>
          {p}
        </li>
      ))}
    </ul>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-ink-50 pb-2 dark:border-ink-800/60">
      <dt className="text-sm text-ink-500 dark:text-ink-400">{label}</dt>
      <dd className="text-right text-sm font-medium text-ink-900 dark:text-white">{value}</dd>
    </div>
  );
}
