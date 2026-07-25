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

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Hydrate from localStorage once on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
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
          p.cartKey === cartKey ? { ...p, qty: p.qty + item.qty } : p
        );
      }
      return [...prev, { ...item, cartKey }];
    });
  }, []);

  const update = useCallback((cartKey: string, patch: Partial<CartItem>) => {
    setItems((prev) =>
      prev.map((p) => (p.cartKey === cartKey ? { ...p, ...patch } : p))
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
