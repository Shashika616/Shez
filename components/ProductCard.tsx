"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { Product } from "@/lib/products";
import { price } from "@/lib/format";
import { useCart } from "./CartProvider";
import { PlusIcon, Stars } from "./ui/Icons";

type Props = { product: Product; index?: number; sizes?: string; className?: string; priority?: boolean };

export default function ProductCard({ product, index, sizes = "(min-width: 1024px) 25vw, 50vw", className, priority }: Props) {
  const { add } = useCart();
  const [picking, setPicking] = useState(false);
  const single = product.sizes.length === 1;

  const quickAdd = () => {
    if (single) add(product.slug, product.sizes[0]);
    else setPicking((p) => !p);
  };

  return (
    <article className={`group relative ${className ?? ""}`}>
      <div className="relative aspect-[3/4] overflow-hidden rounded-[2px] bg-sand">
        <Link href={`/product/${product.slug}`} data-cursor="View" aria-label={product.name} className="absolute inset-0">
          <Image
            src={product.images[0]}
            alt={`${product.name} in ${product.colour}`}
            fill
            sizes={sizes}
            priority={priority}
            className="object-cover transition-[transform,opacity] duration-[1.4s] ease-[var(--ease-silk)] group-hover:scale-[1.04]"
          />
          {product.images[1] && (
            <Image
              src={product.images[1]}
              alt=""
              fill
              sizes={sizes}
              className="object-cover opacity-0 transition-opacity duration-700 ease-[var(--ease-silk)] [@media(hover:hover)]:group-hover:opacity-100"
            />
          )}
        </Link>

        {product.badge && (
          <span className="eyebrow pointer-events-none absolute left-3 top-3 rounded-full bg-ivory/85 px-2.5 py-1.5 text-[9px] text-ink backdrop-blur">
            {product.badge}
          </span>
        )}
        {typeof index === "number" && (
          <span className="eyebrow pointer-events-none absolute right-3 top-3 text-[9px] text-ivory mix-blend-difference">
            {String(index + 1).padStart(2, "0")}
          </span>
        )}

        <AnimatePresence>
          {picking && (
            <motion.div
              className="absolute inset-x-2 bottom-2 rounded-xl bg-ivory/92 p-2 backdrop-blur-md"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 16, opacity: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 32 }}
            >
              <p className="eyebrow px-1 pb-2 text-[9px] text-ink/60">Select size</p>
              <div className="flex flex-wrap gap-1">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      add(product.slug, s);
                      setPicking(false);
                    }}
                    className="min-w-[38px] flex-1 rounded-lg border border-ink/15 py-2 text-xs transition-colors hover:bg-ink hover:text-ivory"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!picking && (
          <button
            onClick={quickAdd}
            aria-label={`Quick add ${product.name}`}
            className="absolute bottom-2.5 right-2.5 grid h-10 w-10 place-items-center rounded-full bg-ivory/90 text-ink shadow-sm backdrop-blur transition-all duration-500 hover:bg-ink hover:text-ivory md:translate-y-2 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 md:focus-visible:opacity-100"
          >
            <PlusIcon />
          </button>
        )}
      </div>

      <div className="mt-3 flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
        <div className="min-w-0">
          <h3 className="display truncate text-[1.35rem] leading-tight md:text-2xl">
            <Link href={`/product/${product.slug}`}>{product.name}</Link>
          </h3>
          <p className="mt-1 flex items-center gap-2 text-[11px] text-ink/60">
            <span className="inline-block h-2.5 w-2.5 rounded-full border border-ink/15" style={{ background: product.swatch }} />
            {product.colour}
          </p>
        </div>
        <div className="flex shrink-0 items-baseline gap-2 text-sm sm:block sm:text-right">
          <p>{price(product.price)}</p>
          {product.compareAt && <p className="text-xs text-ink/45 line-through">{price(product.compareAt)}</p>}
        </div>
      </div>
      <div className="mt-1.5 hidden items-center gap-1.5 text-[11px] text-ink/55 sm:flex">
        <Stars rating={product.rating} size={11} /> {product.reviews}
      </div>
    </article>
  );
}
