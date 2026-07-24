"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type QuoteItem = {
  productId: string;
  name: string;
  slug: string;
  image: string;
  qty: number;
  size: string;
  fabric: string;
  note?: string;
};

type QuoteContextValue = {
  items: QuoteItem[];
  count: number;
  add: (item: QuoteItem) => void;
  update: (productId: string, patch: Partial<QuoteItem>) => void;
  remove: (productId: string) => void;
  clear: () => void;
  has: (productId: string) => boolean;
};

const QuoteContext = createContext<QuoteContextValue | null>(null);
const STORAGE_KEY = "acctive_quote_v1";

export function QuoteProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<QuoteItem[]>([]);
  const [ready, setReady] = useState(false);

  // Hydrate from localStorage once
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  // Persist
  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* ignore */
    }
  }, [items, ready]);

  const add = useCallback((item: QuoteItem) => {
    setItems((prev) => {
      const existing = prev.find((p) => p.productId === item.productId);
      if (existing) {
        return prev.map((p) =>
          p.productId === item.productId
            ? { ...p, qty: p.qty + item.qty }
            : p
        );
      }
      return [...prev, item];
    });
  }, []);

  const update = useCallback((productId: string, patch: Partial<QuoteItem>) => {
    setItems((prev) =>
      prev.map((p) => (p.productId === productId ? { ...p, ...patch } : p))
    );
  }, []);

  const remove = useCallback((productId: string) => {
    setItems((prev) => prev.filter((p) => p.productId !== productId));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const has = useCallback(
    (productId: string) => items.some((p) => p.productId === productId),
    [items]
  );

  const value = useMemo<QuoteContextValue>(
    () => ({
      items,
      count: items.reduce((n, i) => n + 1, 0),
      add,
      update,
      remove,
      clear,
      has,
    }),
    [items, add, update, remove, clear, has]
  );

  return <QuoteContext.Provider value={value}>{children}</QuoteContext.Provider>;
}

export function useQuote() {
  const ctx = useContext(QuoteContext);
  if (!ctx) throw new Error("useQuote must be used within QuoteProvider");
  return ctx;
}
