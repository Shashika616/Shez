"use client";

import Link from "next/link";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/motion";
import { featured } from "@/lib/products";
import ProductCard from "../ProductCard";
import { Reveal, SplitWords } from "../ui/Reveal";
import SectionLabel from "../ui/SectionLabel";
import { ArrowIcon } from "../ui/Icons";

export default function FeaturedEdit() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const el = track.current!;
        const distance = () => el.scrollWidth - window.innerWidth;
        gsap.set(root.current, { height: () => window.innerHeight + distance() });
        gsap.to(el, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: () => `+=${distance()}`,
            scrub: 0.6,
            invalidateOnRefresh: true,
            onRefreshInit: () => gsap.set(root.current, { height: window.innerHeight + distance() }),
            onUpdate: (self) => gsap.set(".fe-progress", { scaleX: self.progress }),
          },
        });
        return () => gsap.set(root.current, { clearProps: "height" });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="relative bg-ivory" aria-labelledby="edit-title">
      <div className="lg:sticky lg:top-0 lg:flex lg:h-svh lg:flex-col lg:justify-center lg:overflow-hidden">
        <div className="container-x flex items-end justify-between gap-6 pt-20 lg:pt-[calc(var(--header-h)+1rem)]">
          <Reveal>
            <SectionLabel kicker="The edit" sub="The pieces we reach for, season after season" />
            <h2 id="edit-title" className="display mt-4 text-[13vw] lg:text-[6vw]">
              <SplitWords text="Pieces she lives in." italic={["lives"]} />
            </h2>
          </Reveal>
          <Link href="/shop" className="eyebrow group hidden shrink-0 items-center gap-3 pb-3 md:flex">
            Shop all <ArrowIcon size={15} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div
          ref={track}
          className="no-scrollbar mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto px-[var(--gutter)] pb-6 max-lg:scroll-px-[var(--gutter)] lg:mt-10 lg:gap-6 lg:overflow-visible lg:pb-0"
        >
          {featured.map((p) => (
            <ProductCard
              key={p.slug}
              product={p}
              sizes="(min-width:1024px) 22vw, 68vw"
              className="w-[68vw] shrink-0 snap-start sm:w-[42vw] lg:w-[22vw]"
            />
          ))}
          <Link
            href="/shop"
            data-cursor="Shop"
            className="flex w-[68vw] shrink-0 snap-start flex-col justify-between rounded-[2px] bg-espresso p-6 text-cream sm:w-[42vw] lg:aspect-[3/4] lg:w-[22vw]"
          >
            <p className="eyebrow text-taupe">{featured.length}+ more pieces</p>
            <p className="display text-5xl italic">
              See the whole
              <br />
              collection
            </p>
            <ArrowIcon size={28} />
          </Link>
        </div>

        <div className="container-x hidden lg:mt-10 lg:block">
          <div className="h-px bg-ink/15">
            <div className="fe-progress h-px origin-left scale-x-0 bg-ink" />
          </div>
        </div>
        <p className="eyebrow container-x pb-16 text-[9px] text-ink/50 lg:hidden">Swipe to explore →</p>
      </div>
    </section>
  );
}
