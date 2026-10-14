import "server-only";
import { randomBytes } from "node:crypto";
import { priceCart, type CartLine } from "../cart";
import type { PaymentMethod } from "../validation";
import type { z } from "zod";
import type { customerSchema } from "../validation";

type Customer = z.output<typeof customerSchema>;

export type PlacedOrder = {
  id: string;
  method: PaymentMethod;
  customer: Customer;
  items: { slug: string; name: string; size: string; qty: number; unitPrice: number }[];
  subtotal: number;
  delivery: number;
  total: number;
  placedAt: string;
};

// No look-alike characters (0/O, 1/I), so references are easy to read out over the phone.
const ALPHABET = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";

function orderId() {
  const bytes = randomBytes(7);
  let out = "";
  for (const b of bytes) out += ALPHABET[b % ALPHABET.length];
  return `SHZ-${out}`;
}

/**
 * Builds an order from the catalogue, never from prices sent by the browser.
 * Returns null if any line no longer exists or the size isn't offered.
 */
export function createOrder(customer: Customer, method: PaymentMethod, items: CartLine[]): PlacedOrder | null {
  const priced = priceCart(items);
  if (priced.lines.length !== items.length || priced.lines.length === 0) return null;

  const order: PlacedOrder = {
    id: orderId(),
    method,
    customer,
    items: priced.lines.map((l) => ({ slug: l.slug, name: l.product.name, size: l.size, qty: l.qty, unitPrice: l.product.price })),
    subtotal: priced.subtotal,
    delivery: priced.delivery,
    total: priced.total,
    placedAt: new Date().toISOString(),
  };

  // Prototype: persist and notify here (database, email, WhatsApp Business API).
  // Log only the reference and total, never the customer's personal details.
  console.info(`[order] ${order.id} ${order.method} ${order.total}`);
  return order;
}
