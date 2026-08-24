import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

// SQLite stores arrays as JSON strings; parse safely.
export function parseArray(value: string | null | undefined): string[] {
  if (!value) return [];
  try {
    const v = JSON.parse(value);
    return Array.isArray(v) ? v.map(String) : [];
  } catch {
    return [];
  }
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export function formatINR(amount?: number | null) {
  if (amount == null) return null;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Apply a percentage discount to a price.
 * Returns both the discounted amount and pre-formatted strings.
 */
export function applyDiscount(
  price: number | null | undefined,
  pct: number
): { original: string | null; sale: string | null; amount: number | null } {
  if (price == null) return { original: null, sale: null, amount: null };
  const sale = Math.round(price * (1 - pct / 100));
  return {
    original: formatINR(price),
    sale: formatINR(sale),
    amount: sale,
  };
}

