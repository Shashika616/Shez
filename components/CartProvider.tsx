"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useState } from "react";
import { getProduct, type Product } from "@/lib/products";
import { cartReducer, parseStoredCart, priceCart, type CartLine, type PricedCart, type PricedLine } from "@/lib/cart";

export type ResolvedLine = PricedLine;
type Toast = { id: number; product: Product; size: string } | null;

type CartContextValue = PricedCart & {
  items: CartLine[];
  open: boolean;
  setOpen: (open: boolean) => void;
  add: (slug: string, size: string, qty?: number, opts?: { silent?: boolean }) => void;
  setQty: (slug: string, size: string, qty: number) => void;
  remove: (slug: string, size: string) => void;
  clear: () => void;
  toast: Toast;
  dismissToast: () => void;
  hydrated: boolean;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "shez.cart.v1";

/** React wrapper around the pure cart domain in lib/cart.ts: state, persistence and UI flags. */
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, dispatch] = useReducer(cartReducer, []);
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState<Toast>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      dispatch({ type: "hydrate", lines: parseStoredCart(localStorage.getItem(STORAGE_KEY)) });
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {}
  }, [items, hydrated]);

  // Keep bags in sync across tabs.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) dispatch({ type: "hydrate", lines: parseStoredCart(e.newValue) });
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3800);
    return () => clearTimeout(t);
  }, [toast]);

  const add = useCallback<CartContextValue["add"]>((slug, size, qty = 1, opts) => {
    dispatch({ type: "add", slug, size, qty });
    const product = getProduct(slug);
    if (product && !opts?.silent) setToast({ id: Date.now(), product, size });
  }, []);
  const setQty = useCallback((slug: string, size: string, qty: number) => dispatch({ type: "setQty", slug, size, qty }), []);
  const remove = useCallback((slug: string, size: string) => dispatch({ type: "remove", slug, size }), []);
  const clear = useCallback(() => dispatch({ type: "clear" }), []);
  const dismissToast = useCallback(() => setToast(null), []);

  const priced = useMemo(() => priceCart(items), [items]);

  const value = useMemo<CartContextValue>(
    () => ({ ...priced, items, open, setOpen, add, setQty, remove, clear, toast, dismissToast, hydrated }),
    [priced, items, open, add, setQty, remove, clear, toast, dismissToast, hydrated],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
