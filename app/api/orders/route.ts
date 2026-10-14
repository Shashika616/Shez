import { NextResponse, type NextRequest } from "next/server";
import { orderRequestSchema, fieldErrors, type OrderResponse } from "@/lib/validation";
import { createOrder } from "@/lib/server/orders";
import { rateLimit } from "@/lib/server/rateLimit";

const MAX_BODY_BYTES = 16_384;

function reply(body: OrderResponse, status: number, headers: Record<string, string> = {}) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store", ...headers } });
}

function clientIp(req: NextRequest) {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
}

function isSameOrigin(req: NextRequest) {
  const origin = req.headers.get("origin");
  if (!origin) return false;
  try {
    return new URL(origin).host === req.headers.get("host");
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  // CSRF: only accept requests that originate from this site.
  if (!isSameOrigin(req)) {
    return reply({ ok: false, error: "Request not allowed." }, 403);
  }

  if (!req.headers.get("content-type")?.startsWith("application/json")) {
    return reply({ ok: false, error: "Unsupported request." }, 415);
  }

  const limit = rateLimit(`orders:${clientIp(req)}`, 10, 10 * 60_000);
  if (!limit.ok) {
    return reply({ ok: false, error: "Too many orders in a short time. Please try again shortly." }, 429, { "Retry-After": String(limit.retryAfter) });
  }

  const raw = await req.text();
  if (raw.length > MAX_BODY_BYTES) return reply({ ok: false, error: "Request too large." }, 413);

  let json: unknown;
  try {
    json = JSON.parse(raw);
  } catch {
    return reply({ ok: false, error: "Malformed request." }, 400);
  }

  const parsed = orderRequestSchema.safeParse(json);
  if (!parsed.success) {
    const fields = fieldErrors(parsed.error, ["customer"]);
    return reply({ ok: false, error: "Please check your details.", fields }, 422);
  }

  const { customer, method, items, website } = parsed.data;
  // Honeypot filled: answer like a success so bots learn nothing, but create no order.
  if (website) return reply({ ok: true, id: "SHZ-RECEIVED", total: 0, method }, 200);

  const order = createOrder(customer, method, items);
  if (!order) return reply({ ok: false, error: "Some items in your bag are no longer available. Please review your bag." }, 409);

  return reply({ ok: true, id: order.id, total: order.total, method: order.method }, 201);
}
