import { z } from "zod";
import { getProduct, type Product } from "./products";
import { deliveryFor } from "./format";

/**
 * Pure cart domain logic, shared by the browser (CartProvider) and the server (order API).
 * Nothing here touches React, storage or the network, so it is trivially testable.
 */

export const MAX_QTY = 9;
export const MAX_LINES = 30;

export type CartLine = { slug: string; size: string; qty: number };
export type PricedLine = CartLine & { product: Product; total: number };
export type PricedCart = { lines: PricedLine[]; count: number; subtotal: number; delivery: number; total: number };

/** Lines are keyed by slug + size, so the same piece in two sizes is two lines. */
export const lineKey = (slug: string, size: string) => `${slug}::${size}`;

/** A line is only valid if the product exists and offers that size. */
export function isValidLine(line: CartLine): boolean {
  const product = getProduct(line.slug);
  return !!product && product.sizes.includes(line.size) && Number.isInteger(line.qty) && line.qty >= 1 && line.qty <= MAX_QTY;
}

const clampQty = (qty: number) => Math.max(0, Math.min(MAX_QTY, Math.floor(qty)));

export type CartAction =
  | { type: "hydrate"; lines: CartLine[] }
  | { type: "add"; slug: string; size: string; qty: number }
  | { type: "setQty"; slug: string; size: string; qty: number }
  | { type: "remove"; slug: string; size: string }
  | { type: "clear" };

export function cartReducer(state: CartLine[], action: CartAction): CartLine[] {
  switch (action.type) {
    case "hydrate":
      return action.lines;
    case "add": {
      const candidate = { slug: action.slug, size: action.size, qty: clampQty(action.qty) };
      if (!isValidLine(candidate)) return state;
      const key = lineKey(action.slug, action.size);
      const index = state.findIndex((l) => lineKey(l.slug, l.size) === key);
      if (index === -1) return state.length >= MAX_LINES ? state : [...state, candidate];
      return state.map((l, i) => (i === index ? { ...l, qty: clampQty(l.qty + candidate.qty) } : l));
    }
    case "setQty": {
      const key = lineKey(action.slug, action.size);
      const qty = clampQty(action.qty);
      return qty === 0
        ? state.filter((l) => lineKey(l.slug, l.size) !== key)
        : state.map((l) => (lineKey(l.slug, l.size) === key ? { ...l, qty } : l));
    }
    case "remove": {
      const key = lineKey(action.slug, action.size);
      return state.filter((l) => lineKey(l.slug, l.size) !== key);
    }
    case "clear":
      return [];
  }
}

/** Prices a cart from the catalogue. The only place totals are computed, on client and server alike. */
export function priceCart(lines: readonly CartLine[]): PricedCart {
  const priced: PricedLine[] = [];
  for (const line of lines) {
    const product = getProduct(line.slug);
    if (!product || !isValidLine(line)) continue;
    priced.push({ ...line, product, total: product.price * line.qty });
  }
  const subtotal = priced.reduce((sum, l) => sum + l.total, 0);
  const delivery = deliveryFor(subtotal);
  return { lines: priced, count: priced.reduce((s, l) => s + l.qty, 0), subtotal, delivery, total: subtotal + delivery };
}

export const cartLineSchema = z.object({
  slug: z.string().min(1).max(80).regex(/^[a-z0-9-]+$/),
  size: z.string().min(1).max(20),
  qty: z.number().int().min(1).max(MAX_QTY),
});

/** Saved bags come from localStorage, which anyone can edit: parse defensively and drop anything unknown. */
export function parseStoredCart(raw: string | null): CartLine[] {
  if (!raw || raw.length > 20_000) return [];
  try {
    const parsed = z.array(cartLineSchema).max(MAX_LINES).safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data.filter(isValidLine) : [];
  } catch {
    return [];
  }
}
