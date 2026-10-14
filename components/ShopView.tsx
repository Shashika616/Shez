"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { categories, products } from "@/lib/products";
import { store } from "@/lib/config";
import ProductCard from "./ProductCard";
import { Reveal, SplitWords } from "./ui/Reveal";
import { ScrollTrigger } from "@/lib/motion";

const SORTS = {
  featured: "Featured",
  "price-asc": "Price, low to high",
  "price-desc": "Price, high to low",
  rating: "Most loved",
} as const;
type Sort = keyof typeof SORTS;

export default function ShopView({ initial }: { initial: string }) {
  const [cat, setCat] = useState(categories.some((c) => c.id === initial) ? initial : "all");
  const [sort, setSort] = useState<Sort>("featured");

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

  const label = categories.find((c) => c.id === cat)?.label ?? "All";

  return (
    <div className="bg-cream pb-28 pt-[calc(var(--header-h)+3rem)] md:pt-[calc(var(--header-h)+5rem)]">
      <div className="container-x">
        <Reveal className="grid gap-6 md:grid-cols-12 md:items-end">
          <div className="md:col-span-8">
            <p className="eyebrow text-brown">Collection 01 — The Ivory Hour</p>
            <h1 className="display mt-4 text-[17vw] md:text-[9vw]">
              <SplitWords text="The Collection" italic={["Collection"]} />
            </h1>
          </div>
          <p className="fade-up text-[15px] leading-7 text-ink/70 md:col-span-4">
            Romantic tops, dresses and finishing pieces. Cash on delivery or bank transfer, dispatched in {store.dispatchDays}.
          </p>
        </Reveal>

        <div className="sticky top-0 z-30 -mx-[var(--gutter)] mt-10 bg-cream/85 px-[var(--gutter)] py-3 backdrop-blur-md ">
          <div className="flex items-center justify-between gap-4">
            <LayoutGroup>
              <div className="no-scrollbar -mx-1 flex gap-1 overflow-x-auto px-1" role="tablist" aria-label="Categories">
                {categories.map((c) => (
                  <button
                    key={c.id}
                    role="tab"
                    aria-selected={cat === c.id}
                    onClick={() => setCat(c.id)}
                    className={`eyebrow relative shrink-0 rounded-full px-4 py-2.5 text-[10px] transition-colors ${cat === c.id ? "text-ivory" : "text-ink/70 hover:text-ink"}`}
                  >
                    {cat === c.id && <motion.span layoutId="chip" className="absolute inset-0 rounded-full bg-ink" transition={{ type: "spring", stiffness: 400, damping: 34 }} />}
                    <span className="relative">{c.label}</span>
                  </button>
                ))}
              </div>
            </LayoutGroup>
            <label className="hidden shrink-0 items-center gap-2 md:flex">
              <span className="eyebrow text-[10px] text-ink/50">Sort</span>
              <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} className="eyebrow cursor-pointer bg-transparent text-[10px] focus:outline-none">
                {Object.entries(SORTS).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between md:mt-8">
          <p className="text-sm text-ink/60">
            <span className="display text-2xl italic text-ink">{label}</span> · {list.length} pieces
          </p>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            aria-label="Sort products"
            className="eyebrow rounded-full border border-ink/15 bg-transparent px-3 py-2 text-[10px] md:hidden"
          >
            {Object.entries(SORTS).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
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
