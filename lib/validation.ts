import { z } from "zod";
import { cartLineSchema, MAX_LINES } from "./cart";

/** One schema for checkout, used for inline form errors in the browser and enforced again by the order API. */

// Strip control characters and collapse whitespace so stored text is always plain, single-spaced and printable.
const clean = (max: number) =>
  z
    .string()
    .transform((s) => s.replace(/[\u0000-\u001F\u007F]/g, " ").replace(/\s+/g, " ").trim())
    .pipe(z.string().max(max));

export const paymentMethods = ["cod", "bank"] as const;
export type PaymentMethod = (typeof paymentMethods)[number];

export const customerSchema = z.object({
  name: clean(80).pipe(z.string().min(2, "Please enter your full name.")),
  phone: clean(20).pipe(z.string().regex(/^\+?[\d\s-]{9,15}$/, "Please enter a valid mobile number, e.g. 077 123 4567.")),
  email: clean(120).pipe(z.union([z.literal(""), z.email("That email doesn't look right.")])),
  address: clean(200).pipe(z.string().min(6, "Please enter your delivery address.")),
  city: clean(60).pipe(z.string().min(2, "Please enter your city.")),
  notes: clean(300),
});

export type Customer = z.input<typeof customerSchema>;
export type CustomerField = keyof Customer;

export const orderRequestSchema = z.object({
  customer: customerSchema,
  method: z.enum(paymentMethods),
  items: z.array(cartLineSchema).min(1).max(MAX_LINES),
  // Honeypot: hidden from people, filled in by naive bots.
  website: z.string().max(200).optional(),
});

export type OrderRequest = z.input<typeof orderRequestSchema>;

export type OrderResponse =
  | { ok: true; id: string; total: number; method: PaymentMethod }
  | { ok: false; error: string; fields?: Partial<Record<CustomerField, string>> };

/** Maps zod issues on `customer.*` to one message per form field. */
export function fieldErrors(error: z.ZodError, prefix: string[] = []): Partial<Record<CustomerField, string>> {
  const out: Partial<Record<CustomerField, string>> = {};
  for (const issue of error.issues) {
    const path = issue.path.slice(prefix.length);
    if (prefix.every((p, i) => issue.path[i] === p) && typeof path[0] === "string") {
      out[path[0] as CustomerField] ??= issue.message;
    }
  }
  return out;
}
