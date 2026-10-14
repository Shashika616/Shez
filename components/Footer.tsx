"use client";

import Link from "next/link";
import { useState } from "react";
import { store } from "@/lib/config";
import { ArrowIcon, SparkIcon } from "./ui/Icons";
import { Reveal, SplitWords } from "./ui/Reveal";
import FooterLogo from "./FooterLogo";

export default function Footer() {
  const [joined, setJoined] = useState(false);

  return (
    <footer className="relative overflow-hidden bg-espresso pb-28 pt-20 text-cream md:pb-10 md:pt-28">
      <div className="container-x grid gap-14 md:grid-cols-12">
        <Reveal className="md:col-span-6">
          <p className="eyebrow text-taupe">The Shez letter</p>
          <h2 className="display mt-5 text-[13vw] md:text-[5.5vw]">
            <SplitWords text="First to know, first to wear." italic={["wear"]} />
          </h2>
          <form
            className="mt-8 flex max-w-md items-center border-b border-cream/30 focus-within:border-cream"
            onSubmit={(e) => {
              e.preventDefault();
              setJoined(true);
            }}
          >
            <label htmlFor="news" className="sr-only">
              Email address
            </label>
            <input
              id="news"
              type="email"
              required
              placeholder={joined ? "You're on the list ✦" : "Your email address"}
              disabled={joined}
              className="min-w-0 flex-1 bg-transparent py-4 text-base text-cream placeholder:text-cream/50 focus:outline-none"
            />
            <button aria-label="Subscribe" disabled={joined} className="grid h-11 w-11 place-items-center rounded-full bg-cream text-ink transition-transform hover:scale-105">
              <ArrowIcon size={16} />
            </button>
          </form>
          <p className="mt-3 text-xs text-cream/50">New drops, restocks and private previews. Never spam.</p>
        </Reveal>

        <div className="grid grid-cols-2 gap-10 text-sm md:col-span-5 md:col-start-8 md:grid-cols-3">
          <div>
            <p className="eyebrow mb-5 text-taupe">Shop</p>
            <ul className="space-y-3 text-cream/80">
              <li><Link className="link-line" href="/shop?c=tops">Tops &amp; Bardots</Link></li>
              <li><Link className="link-line" href="/shop?c=dresses">Dresses</Link></li>
              <li><Link className="link-line" href="/shop?c=bags">Bags</Link></li>
              <li><Link className="link-line" href="/shop?c=jewellery">Jewellery</Link></li>
              <li><Link className="link-line" href="/shop?c=shoes">Shoes</Link></li>
            </ul>
          </div>
          <div>
            <p className="eyebrow mb-5 text-taupe">House</p>
            <ul className="space-y-3 text-cream/80">
              <li><Link className="link-line" href="/#story">Our story</Link></li>
              <li><Link className="link-line" href="/#order">How to order</Link></li>
              <li><Link className="link-line" href="/#reviews">Reviews</Link></li>
              <li><Link className="link-line" href="/checkout">Checkout</Link></li>
            </ul>
          </div>
          <div className="col-span-2 md:col-span-1">
            <p className="eyebrow mb-5 text-taupe">Say hello</p>
            <ul className="space-y-3 text-cream/80">
              <li>WhatsApp {store.contact.whatsapp}</li>
              <li>{store.contact.email}</li>
              <li>{store.contact.instagram}</li>
              <li className="text-cream/50">{store.contact.studio}</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="container-x mt-20 flex flex-wrap gap-2">
        {["Cash on delivery", "Bank transfer", `Dispatch in ${store.dispatchDays}`, "7-day exchanges"].map((t) => (
          <span key={t} className="eyebrow flex items-center gap-2 rounded-full border border-cream/15 px-4 py-2.5 text-[9px] text-cream/70">
            <SparkIcon size={8} className="text-gold" /> {t}
          </span>
        ))}
      </div>

      <Reveal className="container-x relative mt-14">
        <div className="curtain">
          <FooterLogo />
        </div>
      </Reveal>

      <div className="container-x mt-10 flex flex-col justify-between gap-3 border-t border-cream/10 pt-6 text-[11px] tracking-wide text-cream/45 md:flex-row">
        <p>© {new Date().getFullYear()} Shez. All rights reserved.</p>
        <p>Photography via Unsplash · Film via Mixkit (prototype imagery)</p>
      </div>
    </footer>
  );
}
