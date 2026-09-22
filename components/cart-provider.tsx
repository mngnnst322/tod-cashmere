"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type CartLine = {
  id: string;
  title: string;
  price: number;
  image: string;
  qty: number;
};

type CartContextValue = {
  items: CartLine[];
  count: number;
  total: number;
  addItem: (item: Omit<CartLine, "qty">) => void;
  decrementItem: (id: string) => void;
  removeItem: (id: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "cartItems";

function loadCart(): CartLine[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartLine[]>([]);

  useEffect(() => {
    // One-time hydration read: localStorage isn't available during SSR.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setItems(loadCart());
  }, []);

  const persist = useCallback((next: CartLine[]) => {
    setItems(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
  }, []);

  const addItem = useCallback(
    (item: Omit<CartLine, "qty">) => {
      setItems((prev) => {
        const existing = prev.find((line) => line.id === item.id);
        const next = existing
          ? prev.map((line) =>
              line.id === item.id ? { ...line, qty: line.qty + 1 } : line,
            )
          : [...prev, { ...item, qty: 1 }];
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        } catch {
          // ignore
        }
        return next;
      });
    },
    [],
  );

  const decrementItem = useCallback(
    (id: string) => {
      setItems((prev) => {
        const next = prev
          .map((line) =>
            line.id === id ? { ...line, qty: line.qty - 1 } : line,
          )
          .filter((line) => line.qty > 0);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        } catch {
          // ignore
        }
        return next;
      });
    },
    [],
  );

  const removeItem = useCallback(
    (id: string) => {
      persist(items.filter((line) => line.id !== id));
    },
    [items, persist],
  );

  const clear = useCallback(() => persist([]), [persist]);

  const value = useMemo<CartContextValue>(() => {
    const count = items.reduce((sum, line) => sum + line.qty, 0);
    const total = items.reduce((sum, line) => sum + line.qty * line.price, 0);
    return { items, count, total, addItem, decrementItem, removeItem, clear };
  }, [items, addItem, decrementItem, removeItem, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
