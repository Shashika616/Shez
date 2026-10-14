# Shez — Wear your story

Prototype storefront for Shez, a womenswear label. Next.js 16 (App Router), React 19, Tailwind CSS 4, GSAP ScrollTrigger + Lenis for scroll-driven motion, Motion for UI transitions, zod for validation.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
```

## What's in it

| Route | |
|---|---|
| `/` | Logo intro → scissor cut and parting reveal → story → featured edit (pinned horizontal on desktop, swipe on mobile) → scroll-scrubbed film (120-frame canvas) → categories → piece of the season (buy from the home page) → how to order → reviews → lookbook |
| `/shop` | Filterable, sortable collection (`?c=dresses`) |
| `/product/[slug]` | Statically generated product pages: swipe gallery, size picker and guide, add to bag / order now, sticky mobile buy bar |
| `/checkout` | Delivery details, Cash on Delivery or Bank Transfer, server-confirmed order reference |
| `POST /api/orders` | Order endpoint |

## Structure

```
lib/            framework-free domain code, shared by client and server
  products.ts     catalogue + O(1) slug index
  cart.ts         pure cart reducer, pricing, safe storage parsing
  validation.ts   zod schemas for checkout + API contract types
  config.ts       store settings (currency, delivery, contact, bank)
  server/         server-only: order creation, rate limiting
components/     UI; home/ holds the home-page sections, ui/ shared primitives
app/            routes, layout, API route handler
```

Prices are only ever computed by `priceCart()` in `lib/cart.ts`. The bag uses it to display totals, and the order API uses it to charge, so the two can't disagree and the browser can't set its own price.

## Security (OWASP-aligned)

- **Input validation**: one zod schema validates on the client for UX and again on the server for trust. Strings are length-capped and stripped of control characters, and output is escaped by React.
- **Server-side pricing**: the API ignores any price or total sent by the client and re-prices from the catalogue; unknown products or sizes are rejected.
- **CSRF**: the order API only accepts same-origin `application/json` requests.
- **Abuse**: sliding-window rate limit per IP, 16 KB body cap and a honeypot field. The in-memory limiter is per instance, so use Redis or your platform's limiter when scaling out.
- **Headers**: CSP, HSTS, `frame-ancestors 'none'`/`X-Frame-Options`, `nosniff`, Referrer-Policy, Permissions-Policy, COOP/CORP; `X-Powered-By` removed.
- **Privacy**: no customer details are written to browser storage; server logs record only the order reference and total.
- **Storage tampering**: the saved bag is schema-validated on load, and unknown items are dropped.

CSP note: scripts allow `'unsafe-inline'` because Next.js emits inline bootstrap scripts on static pages. For a stricter policy, generate a per-request nonce in `proxy.ts`. That makes every page dynamically rendered.

## Performance

- Product pages and the home page are statically generated; images go through `next/image` (WebP, responsive `sizes`).
- Film frames load only as the section approaches, phones get half the frames at a lower canvas resolution, and frames are cached as immutable.
- Scroll-scrubbed motion uses transforms, opacity and clip-path only; the custom cursor loop sleeps when idle and is disabled on touch.
- `prefers-reduced-motion` is respected: smooth scrolling, the intro and the scroll choreography are switched off.

## Before going live

1. Replace placeholders in `lib/config.ts` (WhatsApp, email, bank details).
2. Connect `createOrder()` in `lib/server/orders.ts` to real storage and notifications (database, email or WhatsApp Business API).
3. Replace the sample reviews in `lib/reviews.ts` and the stats in `components/home/Manifesto.tsx` with real ones.
4. Replace the stock photography and film with Shez's own shoots.

## Credits

Photography: [Unsplash](https://unsplash.com) (Unsplash License). Film: "Old fashioned woman in white dress spins" by [Mixkit](https://mixkit.co) (Mixkit License). All are used as prototype placeholders.
