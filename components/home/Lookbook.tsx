"use client";

import Image from "next/image";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/motion";
import { store } from "@/lib/config";
import { Reveal, SplitWords } from "../ui/Reveal";
import { SparkIcon } from "../ui/Icons";

const COLS = [
  ["/images/e2.jpg", "/images/d16.jpg", "/images/t2.jpg"],
  ["/images/e10.jpg", "/images/e3.jpg", "/images/d14.jpg"],
  ["/images/e9.jpg", "/images/t7.jpg", "/images/e4.jpg"],
];
const BAND = ["Wear your story", "Cash on delivery", "Bank transfer", "Island-wide delivery", "Hand-finished"];

export default function Lookbook() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const speeds = [-12, 10, -18];
      gsap.utils.toArray<HTMLElement>(".lb-col").forEach((col, i) => {
        gsap.fromTo(col, { yPercent: -speeds[i] / 2 }, { yPercent: speeds[i], ease: "none", scrollTrigger: { trigger: root.current, scrub: true } });
      });
      gsap.to(".lb-band", { xPercent: -30, ease: "none", scrollTrigger: { trigger: root.current, scrub: true } });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="relative overflow-hidden bg-espresso pb-24 pt-20 text-cream md:pb-40 md:pt-32">
      <div className="lb-band flex w-max gap-10 whitespace-nowrap">
        {[...BAND, ...BAND].map((t, i) => (
          <span key={i} className="display flex items-center gap-10 text-[14vw] italic text-cream/90 md:text-[8vw]">
            {t} <SparkIcon size={36} className="text-gold" />
          </span>
        ))}
      </div>

      <div className="container-x mt-16 grid gap-10 md:mt-24 md:grid-cols-12">
        <Reveal className="md:col-span-4">
          <p className="eyebrow text-taupe">{"{08}"} — #WearYourStory</p>
          <h2 className="display mt-4 text-[12vw] md:text-[4.2vw]">
            <SplitWords text="Seen on you." italic={["you."]} />
          </h2>
          <p className="fade-up mt-6 max-w-xs text-[15px] leading-7 text-cream/70">
            Tag {store.contact.instagram} to be featured, and to receive a handwritten thank-you with your next order.
          </p>
        </Reveal>

        <div className="grid grid-cols-2 gap-3 md:col-span-8 md:grid-cols-3 md:gap-5">
          {COLS.map((col, i) => (
            <div key={i} className={`lb-col flex flex-col gap-3 md:gap-5 ${i === 2 ? "max-md:hidden" : ""} ${i === 1 ? "mt-16" : ""}`}>
              {col.map((src) => (
                <Reveal key={src} threshold={0.1}>
                  <div className="curtain relative aspect-[3/4] overflow-hidden rounded-[2px]">
                    <Image src={src} alt="" fill sizes="(min-width:768px) 22vw, 46vw" className="object-cover" />
                  </div>
                </Reveal>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
