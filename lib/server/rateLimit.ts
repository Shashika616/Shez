import "server-only";

/**
 * Sliding-window rate limiter kept in memory. Fine for a single instance;
 * swap for Redis or your platform's limiter when running more than one.
 */
type Window = { hits: number[] };

const buckets = new Map<string, Window>();
const MAX_KEYS = 10_000;

export function rateLimit(key: string, limit: number, windowMs: number): { ok: boolean; retryAfter: number } {
  const now = Date.now();
  const bucket = buckets.get(key) ?? { hits: [] };
  // Hits are appended in time order, so expired ones are always at the front.
  while (bucket.hits.length && bucket.hits[0] <= now - windowMs) bucket.hits.shift();

  if (bucket.hits.length >= limit) {
    return { ok: false, retryAfter: Math.ceil((bucket.hits[0] + windowMs - now) / 1000) };
  }
  bucket.hits.push(now);
  buckets.delete(key);
  buckets.set(key, bucket); // re-insert so Map order stays least-recently-used first

  if (buckets.size > MAX_KEYS) {
    const oldest = buckets.keys().next().value;
    if (oldest !== undefined) buckets.delete(oldest);
  }
  return { ok: true, retryAfter: 0 };
}
