"use client";

import SmartImage from "../ui/SmartImage";
import { Fragment, useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/motion";
import { Reveal, SplitWords } from "../ui/Reveal";
import SectionLabel from "../ui/SectionLabel";

// [img:key] tokens become small inline photographs inside the sentence.
const TEXT =
  "Shez began with a single [img:t4] ruffle and a simple belief: that what a woman wears should feel like the next line of her own story. We cut romantic [img:d1] silhouettes in honest fabrics, finish them by hand, and send them to your door [img:f1] wrapped like a letter.";

const STATS = [
  { value: 2600, suffix: "+", label: "Stories dressed" },
  { value: 48, suffix: "h", label: "Average dispatch" },
  { value: 4.9, suffix: "", label: "Average review", decimals: 1 },
];

function Counter({ value, suffix, decimals = 0 }: { value: number; suffix: string; decimals?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [n, setN] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const start = performance.now();
      const dur = 1800;
      const step = (t: number) => {
        const p = Math.min(1, (t - start) / dur);
        setN(value * (1 - Math.pow(1 - p, 4)));
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
    io.observe(el);
    return () => io.disconnect();
  }, [value]);
  return (
    <span ref={ref} className="tabular-nums">
      {n.toLocaleString("en", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}
      {suffix}
    </span>
  );
}

export default function Manifesto() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const words = gsap.utils.toArray<HTMLElement>(".m-word", root.current);
      gsap.fromTo(
        words,
        { opacity: 0.14 },
        {
          opacity: 1,
          stagger: 0.08,
          ease: "none",
          scrollTrigger: { trigger: ".m-text", start: "top 78%", end: "bottom 45%", scrub: true },
        },
      );
      gsap.fromTo(
        ".m-pill",
        { width: 0 },
        {
          width: (_, el) => el.dataset.w,
          ease: "power2.out",
          stagger: 0.3,
          scrollTrigger: { trigger: ".m-text", start: "top 75%", end: "bottom 55%", scrub: true },
        },
      );
    },
    { scope: root },
  );

  const parts = TEXT.split(/(\[img:\w+\])/);

  return (
    <section ref={root} id="story" className="relative scroll-mt-10 bg-cream py-24 md:py-40">
      <div className="container-x">
        <Reveal className="flex items-end justify-between">
          <SectionLabel kicker="Our story" sub="A house built on quiet confidence" />
          <p className="eyebrow hidden self-end text-ink/50 md:block">Est. Colombo</p>
        </Reveal>
        <Reveal className="mt-4">
          <div className="rule text-ink" />
        </Reveal>

        <p className="m-text display mt-12 text-[9.6vw] leading-[1.02] md:mt-20 md:text-[5.4vw]">
          {parts.map((part, i) => {
            const m = part.match(/\[img:(\w+)\]/);
            if (m)
              return (
                <span
                  key={i}
                  className="m-pill relative mx-[0.12em] inline-block h-[0.78em] overflow-hidden rounded-full align-[-0.06em]"
                  data-w="1.9em"
                  style={{ width: "1.9em" }}
                >
                  <SmartImage src={`/images/${m[1]}.jpg`} alt="" sizes="160px" className="object-cover" />
                </span>
              );
            return (
              <Fragment key={i}>
                {part
                  .split(" ")
                  .filter(Boolean)
                  .map((w, k) => (
                    <span key={k} className={`m-word ${/romantic|letter\.|story\./.test(w) ? "italic text-brown" : ""}`}>
                      {w}{" "}
                    </span>
                  ))}
              </Fragment>
            );
          })}
        </p>

        <div className="mt-20 grid gap-12 md:mt-32 md:grid-cols-12">
          <Reveal className="md:col-span-5">
            <div className="curtain relative aspect-[4/5] overflow-hidden">
              <SmartImage src="/images/e1.jpg" alt="A woman in a soft beige suit, her hair caught mid-movement" sizes="(min-width:768px) 40vw, 100vw" className="object-cover" />
            </div>
          </Reveal>
          <div className="flex flex-col justify-end md:col-span-6 md:col-start-7">
            <Reveal>
              <h3 className="display text-5xl md:text-7xl">
                <SplitWords text="Made slowly, worn endlessly." italic={["endlessly"]} />
              </h3>
              <p className="fade-up mt-6 max-w-md text-[15px] leading-7 text-ink/75" style={{ "--d": "300ms" } as React.CSSProperties}>
                Every Shez piece is patterned in our studio, cut in small runs and checked by hand before it leaves us. Fewer pieces, made
                better. Breathable cottons and linens for the island sun, satins for the evenings that matter.
              </p>
            </Reveal>
            <Reveal className="mt-12 grid grid-cols-3 gap-4 border-t border-ink/15 pt-8">
              {STATS.map((s, i) => (
                <div key={s.label} className="fade-up" style={{ "--d": `${i * 120}ms` } as React.CSSProperties}>
                  <p className="display text-4xl md:text-6xl">
                    <Counter value={s.value} suffix={s.suffix} decimals={s.decimals} />
                  </p>
                  <p className="eyebrow mt-2 text-[9px] text-ink/60">{s.label}</p>
                </div>
              ))}
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
