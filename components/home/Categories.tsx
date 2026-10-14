"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/motion";
import { products } from "@/lib/products";
import { Reveal, SplitWords } from "../ui/Reveal";
import { ArrowIcon } from "../ui/Icons";

const TILES = [
  { href: "/shop?c=tops", title: "Tops & Bardots", note: "Ruffles, stripes & lace", img: "/images/t1.jpg", cat: "tops" },
  { href: "/shop?c=dresses", title: "Dresses", note: "Tiered, satin & linen", img: "/images/d8.jpg", cat: "dresses" },
  { href: "/shop?c=jewellery", title: "Finishing pieces", note: "Gold, bags & heels", img: "/images/j6.jpg", cat: "jewellery" },
];

export default function Categories() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.utils.toArray<HTMLElement>(".tile-img").forEach((el) => {
        gsap.fromTo(el, { yPercent: -8 }, { yPercent: 8, ease: "none", scrollTrigger: { trigger: el.parentElement, scrub: true } });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="bg-cream py-24 md:py-36">
      <div className="container-x">
        <Reveal className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="eyebrow text-brown">{"{04}"} — Shop by mood</p>
            <h2 className="display mt-4 text-[13vw] md:text-[6vw]">
              <SplitWords text="Choose your chapter." italic={["chapter."]} />
            </h2>
          </div>
          <p className="fade-up max-w-xs text-[15px] leading-7 text-ink/70">Three wardrobes, one feeling. Start with the piece and build the story around it.</p>
        </Reveal>

        <div className="mt-12 grid gap-4 md:mt-16 md:grid-cols-3 md:gap-5">
          {TILES.map((t, i) => {
            const count = products.filter((p) => (t.cat === "jewellery" ? ["jewellery", "bags", "shoes"].includes(p.category) : p.category === t.cat)).length;
            return (
              <Reveal key={t.href} style={{ "--d": `${i * 120}ms` } as React.CSSProperties}>
                <Link href={t.href} data-cursor="Explore" className="group relative block aspect-[4/5] overflow-hidden rounded-[2px] md:aspect-[3/4.4]">
                  <div className="curtain absolute inset-0" style={{ "--d": `${i * 120}ms` } as React.CSSProperties}>
                    <div className="tile-img absolute -inset-y-[10%] inset-x-0">
                      <Image
                        src={t.img}
                        alt=""
                        fill
                        sizes="(min-width:768px) 33vw, 100vw"
                        className="object-cover transition-transform duration-[1.6s] ease-[var(--ease-silk)] group-hover:scale-105"
                      />
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-espresso/75 via-espresso/5 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-5 text-cream md:p-7">
                    <div>
                      <p className="eyebrow text-[9px] text-sand/80">
                        0{i + 1} · {count} pieces
                      </p>
                      <h3 className="display mt-2 text-4xl md:text-5xl">{t.title}</h3>
                      <p className="mt-1 text-sm italic text-sand/90">{t.note}</p>
                    </div>
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-cream/40 transition-colors duration-500 group-hover:bg-cream group-hover:text-ink">
                      <ArrowIcon size={16} />
                    </span>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
