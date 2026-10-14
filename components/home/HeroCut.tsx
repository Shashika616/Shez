"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, lockScroll, prefersReducedMotion } from "@/lib/motion";
import { ArrowIcon, Scissors } from "../ui/Icons";

const CARDS = [
  { src: "/images/d3.jpg", label: "The Azure Tier", focus: "50% 40%" },
  { src: "/images/t4.jpg", label: "Céleste Ruffle", focus: "50% 45%" },
  { src: "/images/d9.jpg", label: "Mocha Satin", focus: "50% 30%" },
  { src: "/images/e5.jpg", label: "Golden Hour", focus: "50% 30%" },
  { src: "/images/e2.jpg", label: "The Ivory Hour", focus: "50% 8%" },
];

// A hand-cut edge: tiny deterministic wobbles so the split never looks machine-straight.
const EDGE = Array.from({ length: 31 }, (_, i) => ({
  y: (i / 30) * 100,
  x: Math.sin(i * 1.7) * 1.6 + Math.sin(i * 0.55) * 1.1,
}));
const edge = EDGE.map((p) => `calc(50% + ${p.x.toFixed(2)}px) ${p.y.toFixed(2)}%`).join(", ");
const LEFT_CLIP = `polygon(0% 0%, ${edge}, 0% 100%)`;
const RIGHT_CLIP = `polygon(100% 0%, ${edge}, 100% 100%)`;

const HEADLINE = "Wear your story.";

function LogoStage() {
  return (
    <div className="absolute inset-0 bg-cream">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_45%,#f8f1e9_0%,transparent_65%)]" />
      <div className="hero-logo absolute left-1/2 top-[47%] aspect-[2154/1457] w-[94vw] max-w-[1080px] -translate-x-1/2 -translate-y-1/2 md:w-[70vw] lg:w-[62vw]">
        <Image src="/shez-logo.png" alt="" fill priority sizes="(min-width: 768px) 70vw, 94vw" className="object-contain" />
      </div>
      <div className="hero-meta container-x absolute inset-x-0 top-[calc(var(--header-h)+1.5rem)] flex justify-between text-ink/70">
        <p className="eyebrow max-w-[9rem] text-[9px] leading-5 md:max-w-none md:text-[10px]">Atelier of romantic womenswear</p>
        <p className="eyebrow text-right text-[9px] leading-5 md:text-[10px]">
          Collection 01
          <br className="md:hidden" /> <span className="max-md:hidden">·</span> 2026
        </p>
      </div>
      <div className="hero-meta container-x absolute inset-x-0 bottom-[calc(96px+env(safe-area-inset-bottom))] flex items-end justify-between text-ink/70 md:bottom-10">
        <p className="eyebrow text-[9px] md:text-[10px]">✂ — Cut along the line</p>
        <p className="eyebrow flex items-center gap-3 text-[9px] md:text-[10px]">
          Scroll
          <span className="relative block h-8 w-px overflow-hidden bg-ink/20">
            <span className="absolute inset-x-0 top-0 h-1/2 animate-[scrollcue_1.8s_ease-in-out_infinite] bg-ink" />
          </span>
        </p>
      </div>
    </div>
  );
}

export default function HeroCut() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const left = q(".half-left")[0];
      const right = q(".half-right")[0];
      const scissor = q(".scissor")[0] as HTMLElement;
      const blades = q(".blades")[0] as HTMLElement;
      const card = q(".card")[0];
      const imgs = q(".card-img");
      const counter = q(".counter-num")[0];
      const cardLabel = q(".card-label")[0];
      const chars = q(".h-char");

      // Intro: the logo draws itself in like ink across paper while the page holds still.
      let seen = false;
      try {
        seen = sessionStorage.getItem("shez.intro") === "1";
      } catch {}
      if (!prefersReducedMotion()) {
        lockScroll(true);
        const intro = gsap.timeline({
          defaults: { ease: "power3.inOut" },
          onComplete: () => {
            lockScroll(false);
            try {
              sessionStorage.setItem("shez.intro", "1");
            } catch {}
          },
        });
        intro
          .fromTo(q(".hero-logo"), { clipPath: "inset(0% 100% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: seen ? 0.9 : 2.1 })
          .from(q(".hero-meta"), { opacity: 0, y: 12, duration: 0.8, stagger: 0.1 }, "-=0.6")
          .from(q(".cut-guide"), { scaleY: 0, transformOrigin: "top", duration: 1, ease: "power2.inOut" }, "-=0.7")
          .from(scissor, { opacity: 0, y: -20, duration: 0.6 }, "-=0.4");
      }

      const mm = gsap.matchMedia();

      mm.add(
        { reduce: "(prefers-reduced-motion: reduce)", desktop: "(min-width: 768px)", mobile: "(max-width: 767px)" },
        (ctx) => {
          const { reduce, desktop } = ctx.conditions as { reduce: boolean; desktop: boolean };
          const cardRect = () => {
            const vw = window.innerWidth;
            const vh = window.innerHeight;
            const w = desktop ? Math.min(vw * 0.22, 340) : Math.min(vw * 0.56, 300);
            const h = w * 1.32;
            const sx = (vw - w) / 2;
            const sy = (vh - h) / 2;
            return { sx, sy, vh };
          };

          if (reduce) {
            gsap.set([left, right], { autoAlpha: 0 });
            gsap.set(q(".cut-guide"), { autoAlpha: 0 });
            gsap.set(card, { clipPath: "inset(0px 0px 0px 0px round 0px)" });
            gsap.set(imgs, { autoAlpha: 0 });
            gsap.set(imgs[imgs.length - 1], { autoAlpha: 1 });
            gsap.set(q(".final"), { autoAlpha: 1 });
            return;
          }

          gsap.set(card, {
            clipPath: () => {
              const { sx, vh } = cardRect();
              return `inset(${vh / 2}px ${sx}px ${vh / 2}px ${sx}px round 4px)`;
            },
          });

          let lastIndex = -1;
          const setIndex = (i: number) => {
            if (i === lastIndex) return;
            lastIndex = i;
            imgs.forEach((el, k) => gsap.to(el, { autoAlpha: k === i ? 1 : 0, duration: 0.5, overwrite: true }));
            counter.textContent = String(i + 1).padStart(2, "0");
            cardLabel.textContent = CARDS[i].label;
          };
          setIndex(0);

          const tl = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: root.current,
              start: "top top",
              end: "bottom bottom",
              scrub: 0.8,
              invalidateOnRefresh: true,
              onUpdate: (self) => {
                const t = self.progress * 10;
                // Blades snip open and closed while the scissors travel.
                const snip = t < 3 ? 4 + 13 * Math.abs(Math.sin(t * 7)) : 2;
                blades.style.setProperty("--open", `${snip}`);
                // The centre card flips through the collection, then settles.
                const i = Math.min(CARDS.length - 1, Math.max(0, Math.floor(((t - 4) / 3) * (CARDS.length - 1) + 0.5)));
                setIndex(t < 4 ? 0 : i);
              },
            },
          });

          tl.to(scissor, { top: "104%", duration: 3 }, 0)
            .fromTo(q(".slit"), { scaleY: 0 }, { scaleY: 1, duration: 3 }, 0)
            .to(q(".hero-logo"), { scale: 1.03, duration: 3 }, 0)
            .to(q(".hero-meta"), { opacity: 0, duration: 1 }, 0.4)
            .to(q(".cut-guide"), { opacity: 0, duration: 0.4 }, 3)
            // the snip
            .fromTo([left, right], { "--sh": 0 }, { "--sh": 0.4, duration: 0.4 }, 2.9)
            .to(left, { xPercent: -2.5, rotate: -0.6, duration: 0.3, ease: "power2.out" }, 3)
            .to(right, { xPercent: 2.5, rotate: 0.6, duration: 0.3, ease: "power2.out" }, 3)
            // the parting
            .to(left, { xPercent: desktop ? -40 : -44, rotate: -2.2, duration: 2.6, ease: "power2.inOut" }, 3.3)
            .to(right, { xPercent: desktop ? 40 : 44, rotate: 2.2, duration: 2.6, ease: "power2.inOut" }, 3.3)
            .to(
              card,
              {
                clipPath: () => {
                  const { sx, sy } = cardRect();
                  return `inset(${sy}px ${sx}px ${sy}px ${sx}px round 4px)`;
                },
                duration: 1.6,
                ease: "power3.out",
              },
              3.6,
            )
            .fromTo(q(".card-inner"), { scale: 1.35 }, { scale: 1.12, duration: 3.4 }, 3.6)
            .fromTo(q(".reveal-copy"), { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.15 }, 4.1)
            .fromTo(q(".bg-word"), { xPercent: 12 }, { xPercent: -12, duration: 4 }, 3.3)
            // the opening
            .to(q(".reveal-copy"), { autoAlpha: 0, duration: 0.5 }, 7.1)
            .to(left, { xPercent: -100, rotate: -5, duration: 2, ease: "power2.in" }, 7.1)
            .to(right, { xPercent: 100, rotate: 5, duration: 2, ease: "power2.in" }, 7.1)
            .to(card, { clipPath: "inset(0px 0px 0px 0px round 0px)", duration: 2, ease: "power3.inOut" }, 7.2)
            .to(q(".card-inner"), { scale: 1, duration: 2 }, 7.2)
            .fromTo(q(".final"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 }, 8.9)
            .fromTo(chars, { yPercent: 115, rotate: 6 }, { yPercent: 0, rotate: 0, duration: 0.9, stagger: 0.04, ease: "power3.out" }, 8.9)
            .fromTo(q(".final-sub"), { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.1 }, 9.3);
        },
      );

      // If we unmount mid-intro (route change, Strict Mode), never leave the page locked.
      return () => lockScroll(false);
    },
    { scope: root },
  );

  return (
    <section ref={root} className="relative h-[100svh] motion-safe:h-[460svh]" aria-label="Shez — Wear your story">
      <h1 className="sr-only">Shez — Wear your story. Romantic womenswear, delivered island-wide.</h1>
      <div className="sticky top-0 h-svh overflow-hidden">
        {/* Revealed behind the cut */}
        <div className="absolute inset-0 bg-espresso text-cream">
          <p className="bg-word display pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-[42vw] italic text-taupe/10 md:text-[24vw]">
            your story
          </p>
          <div className="card absolute inset-0 overflow-hidden">
            <div className="card-inner absolute inset-0">
              {CARDS.map((c, i) => (
                <Image
                  key={c.src}
                  src={c.src}
                  alt=""
                  fill
                  priority={i < 2}
                  sizes="100vw"
                  className="card-img object-cover"
                  style={{ opacity: i === 0 ? 1 : 0, objectPosition: c.focus }}
                />
              ))}
            </div>
            <div className="final pointer-events-none invisible absolute inset-0 bg-gradient-to-t from-espresso/85 via-espresso/10 to-transparent" />
          </div>

          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <p className="reveal-copy eyebrow invisible absolute top-[calc(50%-min(37vw,198px)-2.5rem)] text-[9px] text-sand md:top-[calc(50%-min(14.5vw,224px)-2.75rem)] md:text-[10px]">
              Collection 01 — The Ivory Hour
            </p>
            <div className="reveal-copy invisible absolute bottom-[calc(50%-min(37vw,198px)-4.5rem)] flex flex-col items-center gap-1.5 md:bottom-[calc(50%-min(14.5vw,224px)-4.5rem)]">
              <p className="font-display text-2xl italic">
                <span className="card-label">{CARDS[0].label}</span>
              </p>
              <p className="eyebrow text-[9px] text-sand/70">
                <span className="counter-num">01</span> / {String(CARDS.length).padStart(2, "0")}
              </p>
            </div>
          </div>

          <div className="final invisible container-x absolute inset-x-0 bottom-[calc(110px+env(safe-area-inset-bottom))] md:bottom-14">
            <p className="final-sub eyebrow text-sand">Collection 01 — The Ivory Hour</p>
            <h2 className="display mt-4 text-[17vw] leading-[0.86] md:text-[10vw]" aria-label={HEADLINE}>
              {HEADLINE.split(" ").map((word, w) => (
                <span key={w} className="inline-block overflow-hidden pb-[0.06em] align-top">
                  {word.split("").map((ch, i) => (
                    <span key={i} className={`h-char inline-block ${w === 1 ? "italic" : ""}`}>
                      {ch}
                    </span>
                  ))}
                  {w < 2 && <span className="inline-block">&nbsp;</span>}
                </span>
              ))}
            </h2>
            <div className="final-sub mt-7 flex flex-wrap items-center gap-3">
              <Link href="/shop" className="eyebrow group pointer-events-auto flex items-center gap-3 rounded-full bg-cream px-7 py-4 text-ink">
                Shop the collection <ArrowIcon size={15} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link href="#story" className="eyebrow link-line pointer-events-auto px-3 py-4 text-cream/85">
                Our story
              </Link>
            </div>
          </div>
        </div>

        {/* The two halves of the logo */}
        <div className="half-left absolute inset-0 z-10 will-change-transform [filter:drop-shadow(10px_0_28px_rgba(31,21,14,var(--sh,0)))]">
          <div className="absolute inset-0" style={{ clipPath: LEFT_CLIP }}>
            <LogoStage />
          </div>
        </div>
        <div className="half-right absolute inset-0 z-10 will-change-transform [filter:drop-shadow(-10px_0_28px_rgba(31,21,14,var(--sh,0)))]">
          <div className="absolute inset-0" style={{ clipPath: RIGHT_CLIP }}>
            <LogoStage />
          </div>
        </div>

        {/* Cut guide and scissors */}
        <div className="cut-guide pointer-events-none absolute inset-y-0 left-1/2 z-20 w-px -translate-x-1/2">
          <div className="absolute inset-0 bg-[repeating-linear-gradient(to_bottom,rgba(59,40,25,0.55)_0_7px,transparent_7px_14px)]" />
          <div className="slit absolute inset-0 origin-top bg-ink" style={{ transform: "scaleY(0)" }} />
          <div className="scissor absolute left-1/2 top-[-3%] h-12 w-12 -translate-x-1/2 -translate-y-1/2 text-ink md:h-14 md:w-14">
            <div className="blades h-full w-full rotate-180" style={{ ["--open" as string]: 10 }}>
              <Scissors className="h-full w-full drop-shadow-[0_4px_10px_rgba(31,21,14,0.25)]" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
