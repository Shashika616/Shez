"use client";

import Image from "next/image";
import { reviews, ratingSummary, type Review } from "@/lib/reviews";
import { Reveal, SplitWords } from "../ui/Reveal";
import { Stars } from "../ui/Icons";
import SectionLabel from "../ui/SectionLabel";

function Card({ r }: { r: Review }) {
  return (
    <figure className="mx-2 flex w-[82vw] shrink-0 flex-col rounded-[20px] border border-ink/10 bg-ivory p-6 sm:w-[380px] md:mx-3 md:p-7">
      <div className="flex items-center justify-between">
        <Stars rating={r.rating} />
        <span className="eyebrow text-[9px] text-ink/45">{r.city}</span>
      </div>
      <blockquote className="mt-5 flex-1">
        <p className="display text-[1.7rem] leading-tight">“{r.title}”</p>
        <p className="mt-3 text-[14px] leading-6 text-ink/70">{r.body}</p>
      </blockquote>
      <figcaption className="mt-6 flex items-center gap-3 border-t border-ink/10 pt-5">
        {r.image ? (
          <span className="relative h-11 w-11 overflow-hidden rounded-full">
            <Image src={r.image} alt="" fill sizes="44px" className="object-cover" />
          </span>
        ) : (
          <span className="display grid h-11 w-11 place-items-center rounded-full bg-sand text-xl italic">{r.name[0]}</span>
        )}
        <span>
          <span className="block text-sm font-medium">
            {r.name}
          </span>
          <span className="block text-xs text-ink/55">Bought the {r.product}</span>
        </span>
      </figcaption>
    </figure>
  );
}

export default function Reviews() {
  const rowA = reviews.slice(0, 4);
  const rowB = reviews.slice(4);

  return (
    <section id="reviews" className="scroll-mt-10 overflow-hidden bg-cream py-24 md:py-36">
      <div className="container-x grid gap-10 md:grid-cols-12 md:items-end">
        <Reveal className="md:col-span-7">
          <SectionLabel kicker="In their words" sub="Notes from the women who wear Shez" />
          <h2 className="display mt-4 text-[13vw] md:text-[6vw]">
            <SplitWords text="Loved, worn, written about." italic={["worn,"]} />
          </h2>
        </Reveal>
        <Reveal className="flex items-end gap-6 md:col-span-4 md:col-start-9 md:justify-end">
          <p className="display fade-up text-[22vw] leading-none md:text-[8vw]">{ratingSummary.average}</p>
          <div className="fade-up pb-3" style={{ "--d": "150ms" } as React.CSSProperties}>
            <Stars rating={ratingSummary.average} size={16} />
            <p className="mt-2 text-sm text-ink/60">from {ratingSummary.count.toLocaleString()} reviews</p>
          </div>
        </Reveal>
      </div>

      <div className="marquee-wrap mt-14 space-y-4 md:mt-20 md:space-y-6">
        <div className="marquee" style={{ "--speed": "70s" } as React.CSSProperties}>
          {[...rowA, ...rowA].map((r, i) => (
            <Card key={i} r={r} />
          ))}
        </div>
        <div className="marquee" data-reverse="true" style={{ "--speed": "80s" } as React.CSSProperties}>
          {[...rowB, ...rowB].map((r, i) => (
            <Card key={i} r={r} />
          ))}
        </div>
      </div>
    </section>
  );
}
