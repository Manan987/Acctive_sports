import { DISCOUNTS } from "./site";

/**
 * Single source of truth for what a customer actually pays.
 *
 * The catalogue stores MRP in `Product.price`. Every surface that shows money —
 * product card, product page, cart drawer, cart page, checkout summary and the
 * server-side order total — must derive the payable figure from here, or the
 * site advertises one price and charges another.
 *
 * Tiering is ORDER-level, not line-level: the announcement bar and the FAQ both
 * promise "50% off on orders of 5+ pieces", so a customer who buys 3 of one
 * design and 2 of another has bought a 5-piece order and gets the bulk rate.
 */

export type PriceTier = "single" | "bulk";

export type TierInfo = {
  tier: PriceTier;
  pct: number;
  label: string;
  /** Pieces still needed to reach the bulk tier (0 once it is unlocked). */
  piecesToBulk: number;
};

export function tierFor(totalPieces: number): TierInfo {
  const min = DISCOUNTS.bulk.minQty;
  if (totalPieces >= min) {
    return { tier: "bulk", pct: DISCOUNTS.bulk.pct, label: DISCOUNTS.bulk.label, piecesToBulk: 0 };
  }
  return {
    tier: "single",
    pct: DISCOUNTS.single.pct,
    label: DISCOUNTS.single.label,
    piecesToBulk: Math.max(0, min - totalPieces),
  };
}

/**
 * Payable price for ONE piece, given the size of the whole order.
 * Rounded to whole rupees so the per-piece figure a customer reads and the line
 * total they are charged always reconcile.
 */
export function unitPrice(price: number | null | undefined, totalPieces: number): number | null {
  if (price == null) return null;
  return Math.round(price * (1 - tierFor(totalPieces).pct / 100));
}

export function lineTotal(
  price: number | null | undefined,
  qty: number,
  totalPieces: number
): number | null {
  const unit = unitPrice(price, totalPieces);
  return unit == null ? null : unit * qty;
}

export type PricedLine = { price: number | null; qty: number };

export type CartTotals = TierInfo & {
  /** At least one line carries a catalogue price. */
  hasPrice: boolean;
  totalPieces: number;
  /** Sum of MRP x qty — the struck-through figure. */
  mrpSubtotal: number;
  /** Sum of discounted unit price x qty — what the customer owes. */
  subtotal: number;
  savings: number;
  /** Discounted subtotal the order would reach at the bulk tier. */
  bulkSubtotal: number;
};

export function cartTotals(items: PricedLine[]): CartTotals {
  const totalPieces = items.reduce((n, i) => n + i.qty, 0);
  const info = tierFor(totalPieces);

  let mrpSubtotal = 0;
  let subtotal = 0;
  let bulkSubtotal = 0;
  let hasPrice = false;

  for (const i of items) {
    if (i.price == null) continue;
    hasPrice = true;
    mrpSubtotal += i.price * i.qty;
    subtotal += (unitPrice(i.price, totalPieces) ?? 0) * i.qty;
    bulkSubtotal += (unitPrice(i.price, DISCOUNTS.bulk.minQty) ?? 0) * i.qty;
  }

  return {
    ...info,
    hasPrice,
    totalPieces,
    mrpSubtotal,
    subtotal,
    savings: mrpSubtotal - subtotal,
    bulkSubtotal,
  };
}
