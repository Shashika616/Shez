"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/motion";
import { getProduct } from "@/lib/products";
import { price } from "@/lib/format";
import { useCart } from "../CartProvider";
import { Reveal, SplitWords } from "../ui/Reveal";
import { ArrowIcon, Stars } from "../ui/Icons";

/** The season's hero piece, buyable without leaving the home page. */
export default function Spotlight() {
  const product = getProduct("azure-tiered-mini")!;
  const root = useRef<HTMLElement>(null);
  const [size, setSize] = useState<string | null>(null);
  const [nudge, setNudge] = useState(false);
  const { add, setOpen } = useCart();
  const router = useRouter();

  useGSAP(
    () => {
      gsap.fromTo(".sp-a", { yPercent: 10 }, { yPercent: -10, ease: "none", scrollTrigger: { trigger: root.current, scrub: true } });
      gsap.fromTo(".sp-b", { yPercent: 30 }, { yPercent: -30, ease: "none", scrollTrigger: { trigger: root.current, scrub: true } });
    },
    { scope: root },
  );

  const require = () => {
    if (size) return true;
    setNudge(true);
    setTimeout(() => setNudge(false), 600);
    return false;
  };

  return (
    <section ref={root} className="relative overflow-hidden bg-sand/60 py-24 md:py-36">
      <div className="container-x grid items-center gap-12 md:grid-cols-12">
        <div className="relative md:col-span-6">
          <div className="sp-a relative mx-auto aspect-[4/5] w-[86%] overflow-hidden rounded-t-full md:w-[78%]">
            <Image src={product.images[0]} alt={`${product.name} worn in a garden`} fill sizes="(min-width:768px) 40vw, 86vw" className="object-cover" />
          </div>
          <div className="sp-b absolute -bottom-6 right-0 aspect-[3/4] w-[38%] overflow-hidden rounded-[2px] border-[6px] border-ivory shadow-xl md:right-2 md:w-[34%]">
            <Image src={product.images[1]} alt="" fill sizes="(min-width:768px) 16vw, 38vw" className="object-cover" />
          </div>
          <p className="eyebrow absolute left-0 top-6 origin-left -rotate-90 translate-y-24 text-[9px] text-ink/50 max-md:hidden">Piece of the season</p>
        </div>

        <Reveal className="md:col-span-5 md:col-start-8">
          <p className="eyebrow text-brown">{"{05}"} — Piece of the season</p>
          <h2 className="display mt-4 text-[14vw] md:text-[5.6vw]">
            <SplitWords text={product.name} italic={["Tiered"]} />
          </h2>
          <div className="fade-up mt-5 flex items-center gap-3 text-sm" style={{ "--d": "200ms" } as React.CSSProperties}>
            <Stars rating={product.rating} /> <span className="text-ink/60">{product.reviews} reviews</span>
          </div>
          <p className="fade-up mt-5 max-w-md text-[15px] leading-7 text-ink/75" style={{ "--d": "260ms" } as React.CSSProperties}>
            {product.description}
          </p>

          <div className="fade-up mt-8" style={{ "--d": "320ms" } as React.CSSProperties}>
            <div className="flex items-baseline gap-3">
              <p className="display text-4xl">{price(product.price)}</p>
              {product.compareAt && <p className="text-sm text-ink/45 line-through">{price(product.compareAt)}</p>}
            </div>
            <p className={`eyebrow mt-6 text-[10px] transition-colors ${nudge ? "text-[#a23b2a]" : "text-ink/60"}`}>
              {size ? `Size — ${size}` : "Select your size"}
            </p>
            <div className={`mt-3 flex flex-wrap gap-2 ${nudge ? "animate-[shake_.5s]" : ""}`} role="radiogroup" aria-label="Size">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  role="radio"
                  aria-checked={size === s}
                  onClick={() => setSize(s)}
                  className={`h-12 min-w-12 rounded-full border px-4 text-sm transition-all duration-300 ${
                    size === s ? "border-ink bg-ink text-ivory" : "border-ink/20 hover:border-ink"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => require() && add(product.slug, size!)}
                className="eyebrow flex-1 rounded-full bg-ink px-7 py-[18px] text-ivory transition-colors hover:bg-brown"
              >
                Add to bag
              </button>
              <button
                onClick={() => {
                  if (!require()) return;
                  add(product.slug, size!, 1, { silent: true });
                  setOpen(false);
                  router.push("/checkout");
                }}
                className="eyebrow flex-1 rounded-full border border-ink px-7 py-[18px] transition-colors hover:bg-ink hover:text-ivory"
              >
                Order now · Cash on delivery
              </button>
            </div>
            <Link href={`/product/${product.slug}`} className="eyebrow group mt-6 inline-flex items-center gap-2 text-[10px] text-ink/70">
              Full details <ArrowIcon size={13} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
