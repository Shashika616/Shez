"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { Product } from "@/lib/products";
import { categories } from "@/lib/products";
import { reviews } from "@/lib/reviews";
import { price } from "@/lib/format";
import { store } from "@/lib/config";
import { useCart } from "./CartProvider";
import ProductCard from "./ProductCard";
import { Reveal, SplitWords } from "./ui/Reveal";
import { ArrowIcon, MinusIcon, PlusIcon, SparkIcon, Stars } from "./ui/Icons";

const SIZE_GUIDE = [
  ["XS", "6", "80", "62", "86"],
  ["S", "8", "84", "66", "90"],
  ["M", "10", "88", "70", "94"],
  ["L", "12", "94", "76", "100"],
  ["XL", "14", "100", "82", "106"],
];

function Accordion({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-ink/15">
      <button onClick={() => setOpen(!open)} aria-expanded={open} className="flex w-full items-center justify-between py-5 text-left">
        <span className="eyebrow text-[10px]">{title}</span>
        <span className={`transition-transform duration-500 ${open ? "rotate-45" : ""}`}>
          <PlusIcon size={14} />
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="pb-6 text-[14px] leading-7 text-ink/75">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ProductView({ product, related }: { product: Product; related: Product[] }) {
  const single = product.sizes.length === 1;
  const [size, setSize] = useState<string | null>(single ? product.sizes[0] : null);
  const [qty, setQty] = useState(1);
  const [nudge, setNudge] = useState(false);
  const [added, setAdded] = useState(false);
  const [slide, setSlide] = useState(0);
  const [guide, setGuide] = useState(false);
  const [showBar, setShowBar] = useState(false);
  const { add, setOpen } = useCart();
  const router = useRouter();
  const gallery = useRef<HTMLDivElement>(null);
  const buyBox = useRef<HTMLDivElement>(null);
  const sizeRef = useRef<HTMLDivElement>(null);

  const images = [...product.images];
  const category = categories.find((c) => c.id === product.category)?.label;
  const productReviews = reviews.filter((r) => r.product === product.name);
  const shownReviews = productReviews.length ? productReviews : reviews.slice(0, 2);

  // Show the sticky mobile buy bar once the main buttons scroll out of view.
  useEffect(() => {
    const el = buyBox.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setShowBar(!e.isIntersecting && e.boundingClientRect.top < 0));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const ensureSize = () => {
    if (size) return true;
    setNudge(true);
    sizeRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    setTimeout(() => setNudge(false), 700);
    return false;
  };

  const addToBag = () => {
    if (!ensureSize()) return;
    add(product.slug, size!, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2200);
  };

  const orderNow = () => {
    if (!ensureSize()) return;
    add(product.slug, size!, qty, { silent: true });
    setOpen(false);
    router.push("/checkout");
  };

  return (
    <div className="bg-cream pb-32 md:pb-24">
      <div className="md:grid md:grid-cols-12 md:gap-10 md:px-[var(--gutter)] md:pt-[calc(var(--header-h)+1.5rem)]">
        {/* Gallery */}
        <div className="relative md:col-span-7">
          <div
            ref={gallery}
            onScroll={(e) => {
              const el = e.currentTarget;
              setSlide(Math.round(el.scrollLeft / el.clientWidth));
            }}
            className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto md:grid md:grid-cols-2 md:gap-3 md:overflow-visible"
          >
            {images.map((src, i) => (
              <motion.div
                key={src + i}
                initial={{ clipPath: "inset(100% 0 0 0)" }}
                animate={{ clipPath: "inset(0% 0 0 0)" }}
                transition={{ duration: 1.2, delay: 0.1 + i * 0.12, ease: [0.65, 0, 0.35, 1] }}
                className={`relative aspect-[3/4] w-full shrink-0 snap-center overflow-hidden bg-sand ${i === 0 ? "md:col-span-2 md:aspect-[4/5]" : ""}`}
              >
                <Image src={src} alt={i === 0 ? `${product.name} in ${product.colour}` : `${product.name}, alternate view`} fill priority={i === 0} sizes="(min-width:768px) 58vw, 100vw" className="object-cover" />
              </motion.div>
            ))}
          </div>
          <div className="pointer-events-none absolute inset-x-0 bottom-4 flex justify-center gap-1.5 md:hidden">
            {images.map((_, i) => (
              <span key={i} className={`h-1 rounded-full bg-ivory transition-all duration-500 ${slide === i ? "w-6" : "w-1.5 opacity-60"}`} />
            ))}
          </div>
          <Link href="/shop" className="eyebrow absolute left-4 top-[calc(var(--header-h)+0.5rem)] rounded-full bg-ivory/80 px-3 py-2 text-[9px] backdrop-blur md:hidden">
            ← Shop
          </Link>
        </div>

        {/* Details */}
        <div className="container-x pt-8 md:col-span-5 md:px-0 md:pt-0">
          <div className="md:sticky md:top-[calc(var(--header-h)+1.5rem)]">
            <Reveal>
              <nav className="eyebrow fade-up flex gap-2 text-[9px] text-ink/50" aria-label="Breadcrumb">
                <Link href="/shop" className="link-line">Shop</Link> /
                <Link href={`/shop?c=${product.category}`} className="link-line">{category}</Link>
              </nav>
              {product.badge && <p className="eyebrow fade-up mt-5 text-[10px] text-brown">✦ {product.badge}</p>}
              <h1 className="display mt-3 text-[13vw] md:text-[4.4vw]">
                <SplitWords text={product.name} />
              </h1>
              <a href="#reviews" className="fade-up mt-4 inline-flex items-center gap-2 text-sm text-ink/60">
                <Stars rating={product.rating} /> {product.rating} · {product.reviews} reviews
              </a>
              <div className="fade-up mt-5 flex items-baseline gap-3">
                <p className="display text-4xl">{price(product.price)}</p>
                {product.compareAt && <p className="text-sm text-ink/45 line-through">{price(product.compareAt)}</p>}
              </div>
              <p className="fade-up mt-5 max-w-md text-[15px] leading-7 text-ink/75">{product.short}</p>
            </Reveal>

            <div className="mt-7 flex items-center gap-3 text-sm">
              <span className="h-6 w-6 rounded-full border border-ink/20 ring-2 ring-ivory ring-offset-1 ring-offset-ink/20" style={{ background: product.swatch }} />
              <span>
                Colour — <span className="italic">{product.colour}</span>
              </span>
            </div>

            {!single && (
              <div ref={sizeRef} className="mt-7 scroll-mt-32">
                <div className="flex items-center justify-between">
                  <p className={`eyebrow text-[10px] transition-colors ${nudge ? "text-[#a23b2a]" : "text-ink/60"}`}>{size ? `Size — ${size}` : "Select your size"}</p>
                  {product.category !== "shoes" && product.category !== "jewellery" && (
                    <button onClick={() => setGuide(true)} className="text-xs text-ink/60 underline underline-offset-4">
                      Size guide
                    </button>
                  )}
                </div>
                <div className={`mt-3 flex flex-wrap gap-2 ${nudge ? "animate-[shake_.5s]" : ""}`} role="radiogroup" aria-label="Size">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      role="radio"
                      aria-checked={size === s}
                      onClick={() => setSize(s)}
                      className={`h-12 min-w-12 rounded-full border px-4 text-sm transition-all duration-300 ${size === s ? "border-ink bg-ink text-ivory" : "border-ink/20 hover:border-ink"}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div ref={buyBox} className="mt-7 flex gap-3">
              <div className="flex shrink-0 items-center rounded-full border border-ink/20">
                <button className="grid h-14 w-11 place-items-center" aria-label="Decrease quantity" onClick={() => setQty((q) => Math.max(1, q - 1))}>
                  <MinusIcon size={13} />
                </button>
                <span className="w-5 text-center tabular-nums">{qty}</span>
                <button className="grid h-14 w-11 place-items-center" aria-label="Increase quantity" onClick={() => setQty((q) => Math.min(9, q + 1))}>
                  <PlusIcon size={13} />
                </button>
              </div>
              <button onClick={addToBag} className="eyebrow relative flex-1 overflow-hidden rounded-full bg-ink text-ivory transition-colors hover:bg-brown">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={added ? "added" : "add"}
                    initial={{ y: 24, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -24, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="block"
                  >
                    {added ? "Added to your bag ✓" : `Add to bag · ${price(product.price * qty)}`}
                  </motion.span>
                </AnimatePresence>
              </button>
            </div>
            <button onClick={orderNow} className="eyebrow mt-3 w-full rounded-full border border-ink py-[18px] transition-colors hover:bg-ink hover:text-ivory">
              Order now — pay on delivery
            </button>

            <ul className="mt-6 grid grid-cols-2 gap-2 text-[12px] text-ink/70">
              {["Cash on delivery", "Bank transfer", `Ships in ${store.dispatchDays.split(" ")[0]} days`, "7-day exchange"].map((t) => (
                <li key={t} className="flex items-center gap-2 rounded-xl bg-ivory px-3 py-3">
                  <SparkIcon size={9} className="shrink-0 text-gold" /> {t}
                </li>
              ))}
            </ul>

            <div className="mt-8 border-t border-ink/15">
              <Accordion title="The story" defaultOpen>
                {product.description}
              </Accordion>
              <Accordion title="Details">
                <ul className="list-inside list-disc space-y-1">
                  {product.details.map((d) => (
                    <li key={d}>{d}</li>
                  ))}
                </ul>
              </Accordion>
              <Accordion title="Fabric & care">{product.fabric}</Accordion>
              <Accordion title="Delivery & payment">
                Delivered island-wide in {store.dispatchDays}. {price(store.deliveryFee)} delivery, complimentary over {price(store.freeDeliveryOver)}. Pay by
                cash on delivery, or by bank transfer to {store.bank.accountName}. We confirm every order personally on WhatsApp.
              </Accordion>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <section id="reviews" className="container-x mt-24 scroll-mt-24 md:mt-36">
        <Reveal className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <h2 className="display text-[11vw] md:text-[4.5vw]">
            <SplitWords text="What she said." italic={["said."]} />
          </h2>
          <p className="fade-up flex items-center gap-2 text-sm text-ink/60">
            <Stars rating={product.rating} /> {product.rating} from {product.reviews} reviews
          </p>
        </Reveal>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {shownReviews.map((r) => (
            <Reveal key={r.name} className="fade-up rounded-[20px] bg-ivory p-6 md:p-8">
              <Stars rating={r.rating} />
              <p className="display mt-4 text-3xl">“{r.title}”</p>
              <p className="mt-3 text-[14px] leading-6 text-ink/70">{r.body}</p>
              <p className="mt-5 text-sm font-medium">
                {r.name} <span className="font-normal text-ink/55">· {r.city}</span>
              </p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Related */}
      <section className="container-x mt-24 md:mt-36">
        <Reveal className="flex items-end justify-between">
          <h2 className="display text-[11vw] md:text-[4.5vw]">
            <SplitWords text="Complete the story." italic={["story."]} />
          </h2>
          <Link href="/shop" className="eyebrow group hidden items-center gap-2 pb-3 md:flex">
            Shop all <ArrowIcon size={14} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </Reveal>
        <div className="no-scrollbar -mx-[var(--gutter)] mt-10 flex snap-x gap-3 overflow-x-auto px-[var(--gutter)] md:mx-0 md:grid md:grid-cols-4 md:gap-5 md:overflow-visible md:px-0">
          {related.map((p) => (
            <ProductCard key={p.slug} product={p} className="w-[62vw] shrink-0 snap-start md:w-auto" />
          ))}
        </div>
      </section>

      {/* Mobile sticky buy bar */}
      <AnimatePresence>
        {showBar && (
          <motion.div
            initial={{ y: "120%" }}
            animate={{ y: 0 }}
            exit={{ y: "120%" }}
            transition={{ type: "spring", stiffness: 300, damping: 32 }}
            className="fixed inset-x-3 bottom-[max(12px,env(safe-area-inset-bottom))] z-50 flex items-center gap-3 rounded-full bg-ivory/90 p-1.5 pl-2 shadow-[0_10px_40px_-10px_rgba(31,21,14,.4)] backdrop-blur-xl md:hidden"
          >
            <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full">
              <Image src={product.images[0]} alt="" fill sizes="44px" className="object-cover" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-display text-lg leading-tight">{product.name}</p>
              <p className="text-xs text-ink/60">
                {price(product.price)}
                {size ? ` · ${size}` : ""}
              </p>
            </div>
            <button onClick={addToBag} className="eyebrow shrink-0 rounded-full bg-ink px-5 py-3.5 text-[10px] text-ivory">
              {added ? "Added ✓" : size ? "Add to bag" : "Choose size"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Size guide */}
      <AnimatePresence>
        {guide && (
          <motion.div className="fixed inset-0 z-[70] grid place-items-end bg-espresso/40 md:place-items-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setGuide(false)}>
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Size guide"
              onClick={(e) => e.stopPropagation()}
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 60, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="w-full max-w-lg rounded-t-[28px] bg-ivory p-6 md:rounded-[28px] md:p-8"
            >
              <div className="flex items-center justify-between">
                <h3 className="display text-4xl">Size guide</h3>
                <button onClick={() => setGuide(false)} className="eyebrow text-[10px] underline underline-offset-4">
                  Close
                </button>
              </div>
              <table className="mt-6 w-full text-left text-sm">
                <thead className="eyebrow text-[9px] text-ink/55">
                  <tr>
                    {["Size", "UK", "Bust cm", "Waist cm", "Hip cm"].map((h) => (
                      <th key={h} className="pb-3 font-normal">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {SIZE_GUIDE.map((row) => (
                    <tr key={row[0]} className="border-t border-ink/10">
                      {row.map((c, i) => (
                        <td key={i} className={`py-3 ${i === 0 ? "font-medium" : "text-ink/70"}`}>
                          {c}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="mt-5 text-xs text-ink/60">Between sizes? Message us on WhatsApp {store.contact.whatsapp} and a stylist will help.</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
