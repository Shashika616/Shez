"use client";

import SmartImage from "../ui/SmartImage";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { store } from "@/lib/config";
import { Reveal, SplitWords } from "../ui/Reveal";
import { PlusIcon, SparkIcon } from "../ui/Icons";
import SectionLabel from "../ui/SectionLabel";

const STEPS = [
  {
    title: "Choose your piece",
    body: "Browse the collection, pick your size (our size guide and WhatsApp stylists are here if you're between two) and add it to your bag.",
    tags: ["Size guide", "Stylist chat", "Gift wrap"],
    img: "/images/s2.jpg",
  },
  {
    title: "Pay the way you like",
    body: "No cards, no gateways. Choose Cash on Delivery and pay the courier when your parcel arrives, or Bank Transfer and send us your slip with your order number.",
    tags: ["Cash on delivery", "Bank transfer"],
    img: "/images/f3.jpg",
  },
  {
    title: "We confirm personally",
    body: "Within a few hours, a real person from our studio calls or messages you on WhatsApp to confirm your order, size and delivery address.",
    tags: ["WhatsApp", "Call back"],
    img: "/images/e4.jpg",
  },
  {
    title: "Wrapped & on its way",
    body: `Tissue-wrapped, sealed with a note and delivered ${store.deliveryArea} in ${store.dispatchDays}. Exchanges within 7 days if it's not quite right.`,
    tags: ["Tracked delivery", "7-day exchange"],
    img: "/images/j6.jpg",
  },
];

const DEFAULT_IMAGE = "/images/e11.jpg";

export default function HowToOrder() {
  // All steps start folded; clicking an open step closes it again.
  const [active, setActive] = useState<number | null>(null);
  const image = active === null ? DEFAULT_IMAGE : STEPS[active].img;

  return (
    <section id="order" className="scroll-mt-10 bg-ivory py-24 md:py-36">
      <div className="container-x grid gap-12 md:grid-cols-12">
        <div className="md:col-span-5">
          <Reveal className="md:sticky md:top-28">
            <SectionLabel kicker="How to order" sub="No cards, no gateways, just a conversation" />
            <h2 className="display mt-4 text-[13vw] md:text-[5vw]">
              <SplitWords text="Simple, personal, no card needed." italic={["personal,"]} />
            </h2>
            <div className="relative mt-10 hidden aspect-[4/5] w-[78%] overflow-hidden rounded-[2px] md:block">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.div
                  key={image}
                  className="absolute inset-0"
                  initial={{ clipPath: "inset(100% 0 0 0)" }}
                  animate={{ clipPath: "inset(0% 0 0 0)" }}
                  exit={{ opacity: 0.999 }}
                  transition={{ duration: 0.9, ease: [0.65, 0, 0.35, 1] }}
                >
                  <SmartImage src={image} alt="" sizes="30vw" className="object-cover" />
                </motion.div>
              </AnimatePresence>
            </div>
          </Reveal>
        </div>

        <div className="md:col-span-6 md:col-start-7">
          <ul className="border-t border-ink/15">
            {STEPS.map((s, i) => {
              const open = active === i;
              return (
                <li key={s.title} className="border-b border-ink/15">
                  <button
                    onClick={() => setActive(open ? null : i)}
                    aria-expanded={open}
                    className="flex w-full items-center gap-5 py-7 text-left md:gap-8 md:py-9"
                  >
                    <SparkIcon size={12} className={`shrink-0 transition-all duration-500 ${open ? "rotate-45 text-gold" : "text-ink/25"}`} />
                    <span className={`display flex-1 text-4xl transition-all duration-500 md:text-5xl ${open ? "italic" : "text-ink/60"}`}>{s.title}</span>
                    <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-full border border-ink/20 transition-transform duration-500 ${open ? "rotate-45 bg-ink text-ivory" : ""}`}>
                      <PlusIcon size={14} />
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {open && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="pb-8 pl-[32px] md:pl-[44px]">
                          <p className="max-w-md text-[15px] leading-7 text-ink/75">{s.body}</p>
                          <div className="mt-5 flex flex-wrap gap-2">
                            {s.tags.map((t) => (
                              <span key={t} className="eyebrow rounded-full border border-ink/15 px-3.5 py-2 text-[9px] text-ink/70">
                                {t}
                              </span>
                            ))}
                          </div>
                          {i === 1 && (
                            <div className="mt-6 grid gap-3 sm:grid-cols-2">
                              <div className="rounded-2xl bg-cream p-5">
                                <p className="display text-2xl">Cash on delivery</p>
                                <p className="mt-1 text-sm text-ink/65">Pay the courier in cash when your parcel arrives.</p>
                              </div>
                              <div className="rounded-2xl bg-cream p-5">
                                <p className="display text-2xl">Bank transfer</p>
                                <p className="mt-1 text-sm text-ink/65">Transfer, then send the slip. We dispatch on receipt.</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
