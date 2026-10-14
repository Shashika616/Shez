"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { categories, products } from "@/lib/products";
import { store } from "@/lib/config";
import ProductCard from "./ProductCard";
import Select from "./ui/Select";
import { Reveal, SplitWords } from "./ui/Reveal";
import { ScrollTrigger, getLenis } from "@/lib/motion";

const SORTS = {
  featured: "Featured",
  "price-asc": "Price, low to high",
  "price-desc": "Price, high to low",
  rating: "Most loved",
} as const;
type Sort = keyof typeof SORTS;
const SORT_OPTIONS = (Object.keys(SORTS) as Sort[]).map((value) => ({ value, label: SORTS[value] }));

export default function ShopView({ initial }: { initial: string }) {
  const [cat, setCat] = useState(categories.some((c) => c.id === initial) ? initial : "all");
  const [sort, setSort] = useState<Sort>("featured");
  const bar = useRef<HTMLDivElement>(null);
  const results = useRef<HTMLDivElement>(null);
  const firstRender = useRef(true);

  // A new filter or sort can shorten the list under you. If you're already past the top of the results,
  // glide back to it so the new results are what you see (not the footer).
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const anchor = results.current;
    if (!anchor) return;
    const header = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--header-h")) || 64;
    const offset = header + (bar.current?.offsetHeight ?? 0) + 8;
    const top = anchor.getBoundingClientRect().top + window.scrollY - offset;
    if (window.scrollY <= top + 1) return;
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(top, { duration: 0.9 });
    else window.scrollTo({ top, behavior: "smooth" });
  }, [cat, sort]);

  // Header links change ?c= while this page stays mounted; follow them.
  useEffect(() => {
    setCat(categories.some((c) => c.id === initial) ? initial : "all");
  }, [initial]);

  useEffect(() => {
    const url = new URL(window.location.href);
    if (cat === "all") url.searchParams.delete("c");
    else url.searchParams.set("c", cat);
    window.history.replaceState(null, "", url);
  }, [cat]);

  const list = useMemo(() => {
    const filtered = cat === "all" ? products : products.filter((p) => p.category === cat);
    const sorted = [...filtered];
    if (sort === "price-asc") sorted.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") sorted.sort((a, b) => b.price - a.price);
    if (sort === "rating") sorted.sort((a, b) => b.rating * 1000 + b.reviews - (a.rating * 1000 + a.reviews));
    if (sort === "featured") sorted.sort((a, b) => Number(!!b.featured) - Number(!!a.featured));
    return sorted;
  }, [cat, sort]);

  useEffect(() => {
    const t = setTimeout(() => ScrollTrigger.refresh(), 700);
    return () => clearTimeout(t);
  }, [list]);

  const counts = useMemo(() => {
    const out: Record<string, number> = { all: products.length };
    for (const p of products) out[p.category] = (out[p.category] ?? 0) + 1;
    return out;
  }, []);

  const label = categories.find((c) => c.id === cat)?.label ?? "All";

  return (
    <div className="bg-cream pb-28 pt-[calc(var(--header-h)+3rem)] md:pt-[calc(var(--header-h)+5rem)]">
      <div className="container-x">
        <Reveal className="grid gap-6 md:grid-cols-12 md:items-end">
          <div className="md:col-span-8">
            <p className="eyebrow text-brown">The Ivory Hour collection</p>
            <h1 className="display mt-4 text-[17vw] md:text-[9vw]">
              <SplitWords text="The Collection" italic={["Collection"]} />
            </h1>
          </div>
          <p className="fade-up text-[15px] leading-7 text-ink/70 md:col-span-4">
            Romantic tops, dresses and finishing pieces. Cash on delivery or bank transfer, dispatched in {store.dispatchDays}.
          </p>
        </Reveal>

        <div ref={bar} className="sticky top-[var(--header-h)] z-30 -mx-[var(--gutter)] mt-10 bg-cream px-[var(--gutter)] py-3 md:bg-cream/85 md:backdrop-blur-md">
          <div className="flex items-center justify-between gap-4">
            <LayoutGroup>
              <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 py-1" role="tablist" aria-label="Categories">
                {categories.map((c) => {
                  const active = cat === c.id;
                  return (
                    <button
                      key={c.id}
                      role="tab"
                      aria-selected={active}
                      onClick={() => setCat(c.id)}
                      className={`eyebrow relative flex shrink-0 items-center gap-2 rounded-full border px-4 py-2.5 text-[10px] font-medium transition-[color,border-color,background-color,box-shadow] duration-300 ${
                        active
                          ? "border-ink text-ivory shadow-[0_6px_18px_-8px_rgba(31,21,14,.6)]"
                          : "border-ink/20 bg-ivory/70 text-ink/85 hover:border-ink/60 hover:bg-ivory hover:text-ink"
                      }`}
                    >
                      {active && <motion.span layoutId="chip" className="absolute inset-0 rounded-full bg-ink" transition={{ type: "spring", stiffness: 400, damping: 34 }} />}
                      <span className="relative">{c.label}</span>
                      <span
                        className={`relative grid h-[18px] min-w-[18px] place-items-center rounded-full px-1 text-[9px] tracking-normal transition-colors ${
                          active ? "bg-ivory/20 text-ivory" : "bg-sand text-ink/70"
                        }`}
                      >
                        {counts[c.id]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </LayoutGroup>
            <Select label="Sort" value={sort} options={SORT_OPTIONS} onChange={setSort} className="hidden shrink-0 md:block" />
          </div>
        </div>

        <div ref={results} className="mt-6 flex items-center justify-between md:mt-8">
          <p className="text-sm text-ink/60">
            <span className="display text-2xl italic text-ink">{label}</span> <span className="whitespace-nowrap">· {list.length} pieces</span>
          </p>
          <Select label="Sort" value={sort} options={SORT_OPTIONS} onChange={setSort} className="md:hidden" />
        </div>

        <motion.ul layout className="mt-8 grid grid-cols-2 gap-x-3 gap-y-10 md:grid-cols-3 md:gap-x-5 md:gap-y-16 lg:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {list.map((p, i) => (
              <motion.li
                key={p.slug}
                layout
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0, transition: { delay: Math.min(i, 8) * 0.05, duration: 0.7, ease: [0.22, 1, 0.36, 1] } }}
                exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.25 } }}
              >
                <ProductCard product={p} priority={i < 4} />
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      </div>
    </div>
  );
}
