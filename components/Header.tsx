"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useCart } from "./CartProvider";
import { BagIcon, CloseIcon } from "./ui/Icons";
import { lockScroll } from "@/lib/motion";

const NAV = [
  { href: "/shop", label: "Shop all" },
  { href: "/shop?c=dresses", label: "Dresses" },
  { href: "/shop?c=tops", label: "Tops" },
  { href: "/#story", label: "Our story" },
  { href: "/#reviews", label: "Reviews" },
];

export default function Header() {
  const { count, setOpen } = useCart();
  const pathname = usePathname();
  const [hidden, setHidden] = useState(false);
  const [solid, setSolid] = useState(false);
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setSolid(y > 40);
      setHidden(y > 200 && y > last + 2);
      if (y < last - 2) setHidden(false);
      last = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMenu(false), [pathname]);
  const wasOpen = useRef(false);
  useEffect(() => {
    if (menu || wasOpen.current) lockScroll(menu);
    wasOpen.current = menu;
  }, [menu]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[transform,background-color,backdrop-filter] duration-700 ease-[var(--ease-silk)] ${
          hidden && !menu ? "-translate-y-full" : ""
        } ${solid && !menu ? "bg-cream/75 backdrop-blur-md" : ""}`}
      >
        <div className="container-x flex h-[var(--header-h)] items-center justify-between">
          <nav className="hidden flex-1 gap-7 lg:flex" aria-label="Primary">
            {NAV.slice(0, 3).map((n) => (
              <Link key={n.href} href={n.href} className="eyebrow link-line py-1 text-ink/80 hover:text-ink">
                {n.label}
              </Link>
            ))}
          </nav>

          <button
            onClick={() => setMenu((m) => !m)}
            className="eyebrow flex flex-1 items-center gap-3 text-ink lg:hidden"
            aria-expanded={menu}
            aria-controls="menu"
          >
            <span className="relative block h-3 w-6">
              <span className={`absolute left-0 top-0 h-px w-full bg-current transition-transform duration-500 ${menu ? "translate-y-1.5 rotate-45" : ""}`} />
              <span className={`absolute bottom-0 left-0 h-px bg-current transition-all duration-500 ${menu ? "w-full -translate-y-1.5 -rotate-45" : "w-4"}`} />
            </span>
            {menu ? "Close" : "Menu"}
          </button>

          <Link href="/" aria-label="Shez home" className="relative block h-8 w-[68px] md:h-10 md:w-[85px]">
            <Image src="/shez-wordmark.png" alt="Shez" fill sizes="90px" priority className="object-contain" />
          </Link>

          <div className="flex flex-1 items-center justify-end gap-7">
            {NAV.slice(3).map((n) => (
              <Link key={n.href} href={n.href} className="eyebrow link-line hidden py-1 text-ink/80 hover:text-ink lg:inline">
                {n.label}
              </Link>
            ))}
            <button
              onClick={() => setOpen(true)}
              className="eyebrow group flex items-center gap-2 text-ink"
              aria-label={`Open bag, ${count} items`}
            >
              <span className="hidden sm:inline">Bag</span>
              <span className="relative">
                <BagIcon size={22} />
                <motion.span
                  key={count}
                  initial={{ scale: 0.4 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 18 }}
                  className="absolute -right-2 -top-1.5 grid h-[17px] min-w-[17px] place-items-center rounded-full bg-brown px-1 text-[10px] tracking-normal text-ivory"
                >
                  {count}
                </motion.span>
              </span>
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menu && (
          <motion.div
            id="menu"
            className="fixed inset-0 z-40 flex flex-col bg-espresso pt-[var(--header-h)] text-cream lg:hidden"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.8, ease: [0.65, 0, 0.35, 1] }}
          >
            <nav className="container-x flex flex-1 flex-col justify-center gap-1" aria-label="Mobile">
              {NAV.map((n, i) => (
                <motion.div
                  key={n.href}
                  initial={{ y: 60, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.25 + i * 0.07, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link href={n.href} onClick={() => setMenu(false)} className="display flex items-baseline gap-4 py-2 text-[13vw] italic">
                    <span className="eyebrow not-italic text-taupe">0{i + 1}</span>
                    {n.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
            <div className="container-x flex items-end justify-between pb-28 text-sand/70">
              <p className="eyebrow leading-6">
                Cash on delivery
                <br />
                Bank transfer
              </p>
              <button onClick={() => setMenu(false)} aria-label="Close menu" className="grid h-12 w-12 place-items-center rounded-full border border-sand/30">
                <CloseIcon />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
