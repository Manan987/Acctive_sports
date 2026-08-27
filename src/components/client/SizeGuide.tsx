"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/ui/Icon";

// Indicative apparel measurements (in inches). These are typical values —
// edit to match your factory's actual size chart.
const ROWS = [
  { size: "XS", chest: "34", length: "26" },
  { size: "S", chest: "36", length: "27" },
  { size: "M", chest: "38", length: "28" },
  { size: "L", chest: "40", length: "29" },
  { size: "XL", chest: "42", length: "30" },
  { size: "XXL", chest: "44", length: "31" },
  { size: "3XL", chest: "46", length: "32" },
];

export function SizeGuide() {
  const [open, setOpen] = useState(false);

  // A modal that can only be dismissed by clicking the backdrop is a keyboard
  // trap; and without a scroll lock the page behind it scrolls under the dialog.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-flame-500 hover:underline"
      >
        <Icon name="ruler" size={14} />
        Size guide
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[60] grid place-items-center bg-black/60 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white p-6 dark:bg-ink-900"
            role="dialog"
            aria-modal
            aria-label="Size guide"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-bold">Size Guide</h3>
              <button onClick={() => setOpen(false)} aria-label="Close" className="text-ink-400 hover:text-ink-700 dark:hover:text-white">
                <Icon name="close" size={20} strokeWidth={2} />
              </button>
            </div>
            <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">
              Indicative measurements in inches. Custom sizing available for bulk orders.
            </p>
            <div className="mt-4 overflow-hidden rounded-xl border border-ink-100 dark:border-ink-800">
              <table className="w-full text-sm">
                <thead className="bg-ink-50 text-left text-xs uppercase text-ink-500 dark:bg-ink-950">
                  <tr>
                    <th className="p-2.5">Size</th>
                    <th className="p-2.5">Chest</th>
                    <th className="p-2.5">Length</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-100 dark:divide-ink-800">
                  {ROWS.map((r) => (
                    <tr key={r.size}>
                      <td className="p-2.5 font-semibold">{r.size}</td>
                      <td className="p-2.5">{r.chest}"</td>
                      <td className="p-2.5">{r.length}"</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
