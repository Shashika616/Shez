"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, prefersReducedMotion } from "@/lib/motion";
import SmartImage from "../ui/SmartImage";
import { Reveal, SplitWords } from "../ui/Reveal";
import SectionLabel from "../ui/SectionLabel";
import { SparkIcon } from "../ui/Icons";

const INTRO =
  "Every beautiful creation has a story. Ours begins with two women, a mother and a daughter, and a dream woven together by love, creativity, and a shared passion for fashion.";

// Figures taken from the founders' own story.
const STATS = [
  { value: 30, suffix: "+", label: "Years of craftsmanship" },
  { value: 2, suffix: "", label: "Generations" },
  { value: 1, suffix: "", label: "Shared dream" },
];

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [n, setN] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const start = performance.now();
      const dur = 1600;
      const step = (t: number) => {
        const p = Math.min(1, (t - start) / dur);
        setN(Math.round(value * (1 - Math.pow(1 - p, 4))));
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
    io.observe(el);
    return () => io.disconnect();
  }, [value]);
  return (
    <span ref={ref} className="tabular-nums">
      {n}
      {suffix}
    </span>
  );
}

const delay = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

export default function Manifesto() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      // The opening lines ink in word by word as they scroll through.
      gsap.fromTo(
        gsap.utils.toArray<HTMLElement>(".m-word", root.current),
        { opacity: 0.14 },
        { opacity: 1, stagger: 0.08, ease: "none", scrollTrigger: { trigger: ".m-text", start: "top 80%", end: "bottom 50%", scrub: true } },
      );

      if (prefersReducedMotion()) return;

      // The founders' photo unveils from the top, then drifts gently while you read.
      gsap.fromTo(
        ".story-photo",
        { clipPath: "inset(0% 0% 100% 0%)" },
        { clipPath: "inset(0% 0% 0% 0%)", duration: 1.6, ease: "power3.inOut", scrollTrigger: { trigger: ".story-photo", start: "top 85%" } },
      );
      gsap.fromTo(
        ".story-photo-inner",
        { scale: 1.12, yPercent: -4 },
        { scale: 1, yPercent: 4, ease: "none", scrollTrigger: { trigger: ".story-photo", start: "top bottom", end: "bottom top", scrub: true } },
      );

      // A gold thread stitches down beside the story as it's read.
      gsap.fromTo(
        ".story-thread",
        { scaleY: 0 },
        { scaleY: 1, ease: "none", scrollTrigger: { trigger: ".story-text", start: "top 70%", end: "bottom 70%", scrub: true } },
      );
    },
    { scope: root },
  );

  return (
    <section ref={root} id="story" className="relative scroll-mt-10 bg-cream py-24 md:py-40">
      <div className="container-x">
        <Reveal className="flex items-end justify-between">
          <SectionLabel kicker="Our story" sub="A mother, a daughter, and a dream" />
          <p className="eyebrow hidden self-end text-ink/50 md:block">Est. Colombo</p>
        </Reveal>
        <Reveal className="mt-4">
          <div className="rule text-ink" />
        </Reveal>

        <Reveal as="div" className="mt-12 md:mt-20">
          <h2 className="display text-[12.5vw] leading-[0.95] md:text-[6.4vw]">
            <span className="block">
              <SplitWords text="30 Years of Craftsmanship." />
            </span>
            <span className="block italic text-brown">
              <SplitWords text="Two Generations." delay={180} />
            </span>
            <span className="block">
              <SplitWords text="One Dream." delay={320} />
            </span>
          </h2>
        </Reveal>

        <p className="m-text display mt-12 max-w-5xl text-[7.6vw] leading-[1.12] md:mt-20 md:text-[3.4vw]">
          {INTRO.split(" ").map((w, i) => (
            <span key={i} className="m-word">
              {w}{" "}
            </span>
          ))}
        </p>

        <Reveal className="mt-14 grid grid-cols-3 gap-4 border-y border-ink/15 py-8 md:mt-20 md:py-10">
          {STATS.map((s, i) => (
            <div key={s.label} className="fade-up" style={delay(i * 120)}>
              <p className="display text-5xl md:text-7xl">
                <Counter value={s.value} suffix={s.suffix} />
              </p>
              <p className="eyebrow mt-2 text-[9px] leading-4 text-ink/60 md:text-[10px]">{s.label}</p>
            </div>
          ))}
        </Reveal>

        <div className="mt-16 grid gap-12 md:mt-28 md:grid-cols-12 md:gap-10">
          {/* The founders, softly graded and dissolved into the page */}
          <div className="md:col-span-5">
            <Reveal className="md:sticky md:top-[calc(var(--header-h)+2rem)]">
              {/* A soft fade suits a photo whose edges already dissolve (a curtain would reveal blank cream first). */}
              <div className="story-photo relative mx-auto aspect-[630/1085] w-[86%] max-w-[440px] overflow-hidden md:w-full">
                <div className="story-photo-inner absolute inset-0">
                <SmartImage
                  src="/images/founders-v2.jpg"
                  alt="Shehara and Shamila, the daughter and mother behind Shez"
                  sizes="(min-width:768px) 36vw, 86vw"
                  className="object-cover"
                />
                </div>
              </div>
              <p className="fade-up mt-4 text-center font-display text-xl italic text-ink/70" style={delay(200)}>
                Shehara &amp; Shamila
              </p>
            </Reveal>
          </div>

          <div className="story-text relative space-y-7 pl-6 text-[16px] leading-8 text-ink/80 md:col-span-6 md:col-start-7 md:pl-10 md:text-[17px]">
            {/* the thread: a faint track with a gold line drawn by scroll */}
            <span className="absolute bottom-2 left-0 top-3 w-px bg-ink/10" aria-hidden>
              <span className="story-thread absolute inset-0 origin-top bg-gold" />
            </span>
            <Reveal threshold={0.01}>
              <p className="display fade-up text-[2.1rem] leading-tight text-ink md:text-5xl">
                Meet <em className="text-brown">Shamila and Shehara</em>, the mother-daughter duo behind SHEZ.
              </p>
            </Reveal>
            <Reveal threshold={0.01}>
              <p className="fade-up">
                For over three decades, Shamila has dedicated herself to fashion, bringing fabrics to life through her creativity, craftsmanship,
                and an exceptional eye for detail.
              </p>
            </Reveal>
            <Reveal threshold={0.01}>
              <p className="fade-up">
                Growing up surrounded by her mom&rsquo;s creations, Shehara developed a deep admiration for the talent, patience, and passion
                behind every stitch. What began as admiration eventually blossomed into a dream to take her mom&rsquo;s remarkable craftsmanship
                beyond the sewing room and create something they could proudly call their own.
              </p>
            </Reveal>
            <Reveal threshold={0.01}>
              <p className="display py-2 text-4xl italic text-ink md:text-5xl">
                <SplitWords text="And so, SHEZ was born." />
              </p>
            </Reveal>
            <Reveal threshold={0.01}>
              <p className="fade-up">
                A mother-daughter venture where 30 years of experience meet a new generation&rsquo;s vision of modern femininity.
              </p>
            </Reveal>
            <Reveal threshold={0.01}>
              <p className="fade-up">
                At SHEZ, we believe fashion is more than just clothing. It&rsquo;s an expression of who you are, how you feel, and the stories
                you choose to tell.
              </p>
            </Reveal>
            <Reveal threshold={0.01}>
              <p className="fade-up">
                Every collection is thoughtfully envisioned and lovingly brought to life, blending timeless elegance with contemporary
                silhouettes and effortless femininity.
              </p>
            </Reveal>
            <Reveal threshold={0.01}>
              <p className="fade-up">
                We may be a new name in fashion, but the hands behind our creations carry over three decades of passion, dedication, and
                experience.
              </p>
            </Reveal>

            <Reveal as="figure" threshold={0.01} className="py-6 md:py-10">
              <SparkIcon size={16} className="fade-up text-gold" />
              <blockquote className="display mt-5 text-[2.6rem] italic leading-[1.05] text-ink md:text-6xl">
                <SplitWords text="Her craftsmanship. My vision. Our story." />
              </blockquote>
            </Reveal>

            <Reveal threshold={0.01}>
              <p className="fade-up">What started as a daughter&rsquo;s belief in her mom&rsquo;s talent has become a dream they now share.</p>
            </Reveal>
            <Reveal threshold={0.01}>
              <p className="fade-up">And as our story unfolds, we&rsquo;d love for SHEZ to become a little part of yours.</p>
            </Reveal>

            <Reveal threshold={0.01} className="border-t border-ink/15 pt-8">
              <p className="fade-up text-ink/70">With love,</p>
              <p className="sig-write display mt-2 inline-block pr-3 text-4xl italic text-ink md:text-5xl" style={delay(200)}>
                Shamila &amp; Shehara <span className="text-brown">♡</span>
              </p>
              <p className="eyebrow fade-up mt-6 flex items-center gap-3 text-[10px] text-brown" style={delay(240)}>
                SHEZ <SparkIcon size={8} className="text-gold" /> Wear Your Story
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
