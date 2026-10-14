"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useCart } from "./CartProvider";
import { ArrowIcon, CloseIcon, MinusIcon, PlusIcon } from "./ui/Icons";
import { price } from "@/lib/format";
import { store } from "@/lib/config";
import { lockScroll } from "@/lib/motion";

function useIsDesktop() {
  const [desktop, setDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const set = () => setDesktop(mq.matches);
    set();
    mq.addEventListener("change", set);
    return () => mq.removeEventListener("change", set);
  }, []);
  return desktop;
}

export default function CartDrawer() {
  const { open, setOpen, lines, subtotal, delivery, total, setQty, remove, count } = useCart();
  const desktop = useIsDesktop();
  const wasOpen = useRef(false);

  useEffect(() => {
    if (open || wasOpen.current) lockScroll(open);
    wasOpen.current = open;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  const remaining = Math.max(0, store.freeDeliveryOver - subtotal);
  const progress = Math.min(1, subtotal / store.freeDeliveryOver);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-[60] bg-espresso/40 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Shopping bag"
            data-lenis-prevent
            className="fixed z-[61] flex flex-col bg-ivory text-ink shadow-2xl max-md:inset-x-0 max-md:bottom-0 max-md:max-h-[88svh] max-md:rounded-t-[28px] md:inset-y-0 md:right-0 md:w-[440px]"
            initial={desktop ? { x: "100%" } : { y: "100%" }}
            animate={desktop ? { x: 0 } : { y: 0 }}
            exit={desktop ? { x: "100%" } : { y: "100%" }}
            transition={{ type: "spring", stiffness: 260, damping: 32 }}
            drag={desktop ? false : "y"}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.6 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 120 || info.velocity.y > 600) setOpen(false);
            }}
          >
            <div className="mx-auto mt-3 h-1 w-10 rounded-full bg-ink/20 md:hidden" />
            <div className="flex items-center justify-between px-6 pb-4 pt-4 md:pt-7">
              <h2 className="display text-4xl">
                Your bag <span className="text-taupe">({count})</span>
              </h2>
              <button onClick={() => setOpen(false)} aria-label="Close bag" className="grid h-10 w-10 place-items-center rounded-full border border-ink/15 transition-colors hover:bg-ink hover:text-ivory">
                <CloseIcon size={16} />
              </button>
            </div>

            {lines.length > 0 && (
              <div className="px-6 pb-4">
                <p className="text-[13px] text-ink/70">
                  {remaining > 0 ? (
                    <>
                      You&apos;re <strong className="font-medium text-ink">{price(remaining)}</strong> away from free delivery
                    </>
                  ) : (
                    <>Complimentary delivery unlocked ✦</>
                  )}
                </p>
                <div className="mt-2 h-[3px] overflow-hidden rounded-full bg-sand">
                  <motion.div className="h-full origin-left bg-brown" animate={{ scaleX: progress }} transition={{ type: "spring", stiffness: 120, damping: 20 }} />
                </div>
              </div>
            )}

            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain border-t border-ink/10 px-6">
              {lines.length === 0 ? (
                <div className="flex flex-col items-center py-16 text-center">
                  <p className="display text-3xl italic text-ink/80">Your story starts here.</p>
                  <p className="mt-3 max-w-[260px] text-sm text-ink/60">Nothing in your bag yet. Find the piece that feels like you.</p>
                  <Link href="/shop" onClick={() => setOpen(false)} className="eyebrow mt-8 rounded-full bg-ink px-7 py-4 text-ivory">
                    Explore the collection
                  </Link>
                </div>
              ) : (
                <ul>
                  <AnimatePresence initial={false}>
                    {lines.map((l) => (
                      <motion.li
                        key={l.slug + l.size}
                        layout
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0, transition: { duration: 0.3 } }}
                        className="overflow-hidden border-b border-ink/10"
                      >
                        <div className="flex gap-4 py-5">
                          <Link href={`/product/${l.slug}`} onClick={() => setOpen(false)} className="relative h-[116px] w-[88px] shrink-0 overflow-hidden rounded-sm bg-sand">
                            <Image src={l.product.images[0]} alt={l.product.name} fill sizes="88px" className="object-cover" />
                          </Link>
                          <div className="flex min-w-0 flex-1 flex-col">
                            <div className="flex justify-between gap-3">
                              <p className="display text-xl leading-tight">{l.product.name}</p>
                              <p className="shrink-0 text-sm">{price(l.total)}</p>
                            </div>
                            <p className="mt-1 text-xs text-ink/60">
                              {l.product.colour} · {l.size}
                            </p>
                            <div className="mt-auto flex items-center justify-between">
                              <div className="flex items-center rounded-full border border-ink/15">
                                <button className="grid h-9 w-9 place-items-center" aria-label="Decrease quantity" onClick={() => setQty(l.slug, l.size, l.qty - 1)}>
                                  <MinusIcon size={13} />
                                </button>
                                <span className="w-5 text-center text-sm tabular-nums">{l.qty}</span>
                                <button className="grid h-9 w-9 place-items-center" aria-label="Increase quantity" onClick={() => setQty(l.slug, l.size, l.qty + 1)}>
                                  <PlusIcon size={13} />
                                </button>
                              </div>
                              <button onClick={() => remove(l.slug, l.size)} className="text-xs text-ink/60 underline underline-offset-4 hover:text-ink">
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              )}
            </div>

            {lines.length > 0 && (
              <div className="border-t border-ink/10 bg-cream/60 px-6 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-5">
                <dl className="space-y-1.5 text-sm">
                  <div className="flex justify-between text-ink/70">
                    <dt>Subtotal</dt>
                    <dd>{price(subtotal)}</dd>
                  </div>
                  <div className="flex justify-between text-ink/70">
                    <dt>Delivery</dt>
                    <dd>{delivery === 0 ? "Complimentary" : price(delivery)}</dd>
                  </div>
                  <div className="flex justify-between pt-1 text-base font-medium">
                    <dt>Total</dt>
                    <dd>{price(total)}</dd>
                  </div>
                </dl>
                <Link
                  href="/checkout"
                  onClick={() => setOpen(false)}
                  className="group mt-4 flex w-full items-center justify-between rounded-full bg-ink px-7 py-[18px] text-ivory transition-colors hover:bg-brown"
                >
                  <span className="eyebrow">Place your order</span>
                  <ArrowIcon className="transition-transform duration-500 group-hover:translate-x-1" />
                </Link>
                <p className="mt-3 text-center text-[11px] tracking-wide text-ink/55">Pay by cash on delivery or bank transfer. No card needed.</p>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
