"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { useCart } from "./CartProvider";
import { BagIcon } from "./ui/Icons";
import { price } from "@/lib/format";

/** Thumb-reach navigation for phones, plus the "added to bag" toast. */
export default function MobileDock() {
  const { count, subtotal, setOpen, toast, dismissToast } = useCart();
  const pathname = usePathname();
  const hideDock = pathname.startsWith("/product/") || pathname.startsWith("/checkout");

  return (
    <>
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.id}
            role="status"
            className="fixed inset-x-3 bottom-[88px] z-[55] mx-auto flex max-w-sm items-center gap-3 rounded-2xl bg-espresso p-2.5 pr-3 text-cream shadow-2xl md:bottom-8 md:left-auto md:right-8 md:mx-0"
            initial={{ y: 40, opacity: 0, scale: 0.96 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
          >
            <div className="relative h-14 w-11 shrink-0 overflow-hidden rounded-lg">
              <Image src={toast.product.images[0]} alt="" fill sizes="44px" className="object-cover" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="eyebrow text-[9px] text-taupe">Added to your bag</p>
              <p className="truncate font-display text-lg leading-tight">{toast.product.name}</p>
            </div>
            <button
              onClick={() => {
                dismissToast();
                setOpen(true);
              }}
              className="eyebrow shrink-0 rounded-full bg-cream px-4 py-2.5 text-[10px] text-ink"
            >
              View bag
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {!hideDock && (
        <nav
          aria-label="Quick"
          className="fixed inset-x-0 bottom-[max(14px,env(safe-area-inset-bottom))] z-50 mx-auto flex w-[min(92vw,380px)] items-center gap-1 rounded-full border border-ink/10 bg-ivory/95 p-1.5 shadow-[0_10px_40px_-10px_rgba(31,21,14,.35)] md:hidden"
        >
          <Link href="/" className={`eyebrow flex-1 rounded-full py-3 text-center text-[10px] ${pathname === "/" ? "bg-sand/70" : ""}`}>
            Home
          </Link>
          <Link href="/shop" className={`eyebrow flex-1 rounded-full py-3 text-center text-[10px] ${pathname.startsWith("/shop") ? "bg-sand/70" : ""}`}>
            Shop
          </Link>
          <button onClick={() => setOpen(true)} className="eyebrow flex flex-[1.6] items-center justify-center gap-2 rounded-full bg-ink py-3 text-[10px] text-ivory">
            <BagIcon size={15} />
            {count > 0 ? (
              <span className="whitespace-nowrap">
                {count}
                <span className="max-[359px]:hidden"> · {price(subtotal)}</span>
              </span>
            ) : (
              "Bag"
            )}
          </button>
        </nav>
      )}
    </>
  );
}
