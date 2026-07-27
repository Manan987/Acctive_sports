"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type CartItem = {
  cartKey: string; // `${productId}-${size}` — unique per product+size combo
  productId: string;
  name: string;
  slug: string;
  image: string;
  qty: number;
  size: string;
  fabric: string;
  price: number | null;
  note?: string;
};

type CartContextValue = {
  items: CartItem[];
  totalItems: number;   // unique line items
  totalPieces: number;  // sum of all qty
  drawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  add: (item: Omit<CartItem, "cartKey">) => void;
  update: (cartKey: string, patch: Partial<CartItem>) => void;
  remove: (cartKey: string) => void;
  clear: () => void;
  isInCart: (productId: string, size: string) => boolean;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "acctive_cart_v2";
const MAX_QTY = 100_000;
const FALLBACK_IMAGE = "/placeholder-product.svg";

// localStorage is user-writable and survives across deploys, so its contents
// are untrusted input. The previous version fed JSON.parse straight into state:
// a hand-edited value, a half-written entry, or a cart saved by an older build
// with a different shape would crash every page that reads the cart (and an
// empty `image` throws inside next/image). Validate each line and drop the
// ones that don't survive.
function sanitizeItems(raw: unknown): CartItem[] {
  if (!Array.isArray(raw)) return [];
  const out: CartItem[] = [];
  const seen = new Set<string>();
  for (const entry of raw.slice(0, 200)) {
    if (!entry || typeof entry !== "object") continue;
    const e = entry as Record<string, unknown>;
    const productId = typeof e.productId === "string" ? e.productId : "";
    const name = typeof e.name === "string" ? e.name : "";
    const slug = typeof e.slug === "string" ? e.slug : "";
    if (!productId || !name || !slug) continue;

    const size = typeof e.size === "string" ? e.size : "";
    const cartKey = `${productId}-${size || "one-size"}`;
    if (seen.has(cartKey)) continue;
    seen.add(cartKey);

    const qty = Number(e.qty);
    const price = Number(e.price);
    out.push({
      cartKey,
      productId,
      name,
      slug,
      image: typeof e.image === "string" && e.image ? e.image : FALLBACK_IMAGE,
      qty: Number.isFinite(qty) ? Math.min(Math.max(Math.trunc(qty), 1), MAX_QTY) : 1,
      size,
      fabric: typeof e.fabric === "string" ? e.fabric : "",
      price: Number.isFinite(price) && price >= 0 ? price : null,
      note: typeof e.note === "string" ? e.note : undefined,
    });
  }
  return out;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Hydrate from localStorage once on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(sanitizeItems(JSON.parse(raw)));
    } catch { /* ignore */ }
    setReady(true);
  }, []);

  // Persist on change
  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch { /* ignore */ }
  }, [items, ready]);

  const openDrawer = useCallback(() => setDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  const add = useCallback((item: Omit<CartItem, "cartKey">) => {
    const cartKey = `${item.productId}-${item.size || "one-size"}`;
    setItems((prev) => {
      const existing = prev.find((p) => p.cartKey === cartKey);
      if (existing) {
        return prev.map((p) =>
          p.cartKey === cartKey ? { ...p, qty: Math.min(p.qty + item.qty, MAX_QTY) } : p
        );
      }
      return [
        ...prev,
        { ...item, cartKey, image: item.image || FALLBACK_IMAGE, qty: Math.min(item.qty, MAX_QTY) },
      ];
    });
  }, []);

  const update = useCallback((cartKey: string, patch: Partial<CartItem>) => {
    setItems((prev) =>
      prev.map((p) => {
        if (p.cartKey !== cartKey) return p;
        const next = { ...p, ...patch };
        // Clamp here rather than at each call site — the "+" buttons in the
        // drawer and cart page both increment without an upper bound.
        next.qty = Math.min(Math.max(Math.trunc(next.qty) || 1, 1), MAX_QTY);
        return next;
      })
    );
  }, []);

  const remove = useCallback((cartKey: string) => {
    setItems((prev) => prev.filter((p) => p.cartKey !== cartKey));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const isInCart = useCallback(
    (productId: string, size: string) => {
      const cartKey = `${productId}-${size || "one-size"}`;
      return items.some((p) => p.cartKey === cartKey);
    },
    [items]
  );

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      totalItems: items.length,
      totalPieces: items.reduce((n, i) => n + i.qty, 0),
      drawerOpen,
      openDrawer,
      closeDrawer,
      add,
      update,
      remove,
      clear,
      isInCart,
    }),
    [items, drawerOpen, openDrawer, closeDrawer, add, update, remove, clear, isInCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
