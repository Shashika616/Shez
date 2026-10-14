"use client";

import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/motion";
import SectionLabel from "../ui/SectionLabel";
import { SparkIcon } from "../ui/Icons";

const TOTAL = 120;

const CHAPTERS = [
  { n: "I", title: "The thread", line: "Every story begins with a single thread.", side: "left" },
  { n: "II", title: "The turn", line: "Cut to move with you, never against you.", side: "right" },
  { n: "III", title: "The keepsake", line: "Made to be remembered. Made to be yours.", side: "left" },
];

const DESKTOP = "(min-width: 768px)";
const isDesktop = () => window.matchMedia(DESKTOP).matches;

/**
 * Desktop: a film you play with your scroll, each scroll position mapped to one frame on a canvas.
 * Phones: a light looping video instead (no frame downloads, no scroll-driven canvas work).
 */
export default function FilmSequence() {
  return (
    <>
      <div className="hidden md:block">
        <FilmScrub />
      </div>
      <div className="md:hidden">
        <FilmLoop />
      </div>
    </>
  );
}

function FilmScrub() {
  const root = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const bg = useRef<HTMLCanvasElement>(null);
  const frames = useRef<HTMLImageElement[]>([]);
  const state = useRef({ frame: 0, step: 1, drawn: -1 });
  const [hasFrame, setHasFrame] = useState(false);

  const draw = (force = false) => {
    const c = canvas.current;
    const b = bg.current;
    if (!c || !b) return;
    const { step } = state.current;
    let i = Math.round(state.current.frame / step) * step;
    // Fall back to the nearest frame that has finished loading.
    let img = frames.current[i];
    for (let d = step; (!img || !img.complete || !img.naturalWidth) && d < TOTAL; d += step) {
      img = frames.current[i - d] ?? frames.current[i + d];
      if (img?.complete && img.naturalWidth) i = frames.current.indexOf(img);
    }
    if (!img || !img.naturalWidth) return;
    if (i === state.current.drawn && !force) return;
    state.current.drawn = i;

    const paint = (cv: HTMLCanvasElement) => {
      const ctx = cv.getContext("2d")!;
      const s = Math.max(cv.width / img.naturalWidth, cv.height / img.naturalHeight);
      const w = img.naturalWidth * s;
      const h = img.naturalHeight * s;
      ctx.drawImage(img, (cv.width - w) / 2, (cv.height - h) / 2, w, h);
    };
    paint(c);
    paint(b);
    setHasFrame(true);

  };

  useEffect(() => {
    if (!isDesktop()) return;
    const step = 1;
    state.current.step = step;

    // Only start downloading once the film is about to come into view.
    const loadFrames = () => {
      const list: HTMLImageElement[] = [];
      for (let i = 0; i < TOTAL; i += step) {
        const img = new Image();
        img.decoding = "async";
        img.src = `/film/${String(i).padStart(3, "0")}.jpg`;
        img.onload = () => {
          if (i === 0 || Math.abs(i - state.current.frame) <= step) draw(true);
        };
        list[i] = img;
      }
      frames.current = list;
    };
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        loadFrames();
      },
      { rootMargin: "150% 0px" },
    );
    if (root.current) io.observe(root.current);

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      for (const cv of [canvas.current, bg.current]) {
        if (!cv) continue;
        const r = cv.getBoundingClientRect();
        const scale = cv === bg.current ? 0.12 : dpr;
        cv.width = Math.max(1, Math.round(r.width * scale));
        cv.height = Math.max(1, Math.round(r.height * scale));
      }
      draw(true);
    };
    resize();
    window.addEventListener("resize", resize);
    return () => {
      io.disconnect();
      window.removeEventListener("resize", resize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useGSAP(
    () => {
      if (!isDesktop()) return;
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom bottom", scrub: 0.4 },
      });
      tl.to(state.current, { frame: TOTAL - 1, duration: 1, onUpdate: () => draw() }, 0);
      tl.to(".film-bar", { scaleX: 1, duration: 1 }, 0);
      tl.fromTo(".film-frame", { scale: 0.86, borderRadius: 18 }, { scale: 1, borderRadius: 4, duration: 0.18, ease: "power2.out" }, 0);

      const chapters = gsap.utils.toArray<HTMLElement>(".chapter");
      chapters.forEach((el, k) => {
        const at = 0.06 + k * 0.31;
        const chars = el.querySelectorAll(".ch-line");
        tl.fromTo(el, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.03 }, at);
        tl.fromTo(chars, { yPercent: 100 }, { yPercent: 0, duration: 0.08, stagger: 0.02, ease: "power3.out" }, at);
        if (k < chapters.length - 1) tl.to(el, { autoAlpha: 0, y: -30, duration: 0.06, ease: "power2.in" }, at + 0.23);
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="relative h-[480svh] bg-espresso text-cream" aria-label="The Shez film">
      <div className="sticky top-0 h-svh overflow-hidden">
        <canvas ref={bg} className="absolute inset-0 h-full w-full scale-110 opacity-60 blur-2xl" aria-hidden />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(31,21,14,0.2),rgba(31,21,14,0.85))]" />

        <div className="film-frame absolute inset-0 overflow-hidden md:inset-auto md:left-1/2 md:top-1/2 md:h-[84svh] md:w-auto md:-translate-x-1/2 md:-translate-y-1/2 md:aspect-[9/16]">
          <canvas ref={canvas} className="h-full w-full" role="img" aria-label="A woman in an embroidered white dress turns slowly in a candle-lit room" />
          {!hasFrame && (
            <div className="skeleton skeleton-dark absolute inset-0 grid place-items-center" aria-hidden>
              <SparkIcon size={18} className="brand-loader__spark text-gold" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-espresso/80 via-transparent to-espresso/30 md:from-espresso/30" />
        </div>

        <div className="container-x absolute inset-x-0 top-[calc(var(--header-h)+1rem)]">
          <SectionLabel kicker="Your story, in motion" tone="dark" reveal={false} />
        </div>

        {CHAPTERS.map((c) => (
          <div
            key={c.n}
            className={`chapter invisible container-x absolute inset-x-0 bottom-[calc(110px+env(safe-area-inset-bottom))] md:bottom-auto md:top-1/2 md:w-[36vw] md:-translate-y-1/2 ${
              c.side === "left" ? "md:left-0" : "md:left-auto md:right-0 md:text-right"
            }`}
          >
            <p className="eyebrow overflow-hidden text-gold">
              <span className="ch-line inline-block">
                {c.title}
              </span>
            </p>
            <p className="display mt-4 text-[11vw] leading-[0.95] md:text-[3.6vw]">
              {c.line.split(". ").map((s, i, a) => (
                <span key={i} className="block overflow-hidden pb-[0.05em]">
                  <span className={`ch-line inline-block ${i === a.length - 1 && a.length > 1 ? "italic" : ""}`}>
                    {s}
                    {i < a.length - 1 ? "." : ""}
                  </span>
                </span>
              ))}
            </p>
          </div>
        ))}

        <div className="container-x absolute inset-x-0 bottom-[calc(84px+env(safe-area-inset-bottom))] md:bottom-8">
          <div className="h-px bg-cream/20">
            <div className="film-bar h-px origin-left scale-x-0 bg-gold" />
          </div>
          <div className="mt-2 hidden justify-between md:flex">
            {CHAPTERS.map((c) => (
              <span key={c.n} className="eyebrow text-[9px] text-sand/60">
                {c.title}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// The source clip is slow-motion; a touch quicker reads better on a small screen.
const PHONE_PLAYBACK_RATE = 1.4;

/** Phones: the same film as a muted loop that only plays while on screen, with chapters following the playhead. */
function FilmLoop() {
  const root = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const [src, setSrc] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [chapter, setChapter] = useState(0);
  const onScreenNow = useRef(false);

  const play = () => {
    const v = video.current;
    if (!v || !v.getAttribute("src")) return;
    v.playbackRate = PHONE_PLAYBACK_RATE;
    v.play().catch(() => {});
  };

  // The source can arrive after the section is already on screen (fast scroll or jump): start then.
  useEffect(() => {
    if (src && onScreenNow.current) play();
  }, [src]);

  useEffect(() => {
    if (isDesktop()) return;
    const el = root.current;
    const v = video.current;
    if (!el || !v) return;
    // Attach the source shortly before the section arrives, then play only while it's visible.
    const near = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        setSrc("/film-mobile.mp4");
        near.disconnect();
      },
      { rootMargin: "100% 0px" },
    );
    // Loading a source resets playbackRate to the default, so set both.
    v.defaultPlaybackRate = PHONE_PLAYBACK_RATE;
    const onScreen = new IntersectionObserver(([e]) => {
      onScreenNow.current = e.isIntersecting;
      if (e.isIntersecting) play();
      else v.pause();
    }, { threshold: 0.25 });
    near.observe(el);
    onScreen.observe(el);
    return () => {
      near.disconnect();
      onScreen.disconnect();
    };
  }, []);

  const onTime = () => {
    const v = video.current;
    if (!v || !v.duration) return;
    const p = v.currentTime / v.duration;
    if (bar.current) bar.current.style.transform = `scaleX(${p.toFixed(3)})`;
    const next = Math.min(CHAPTERS.length - 1, Math.floor(p * CHAPTERS.length));
    setChapter((c) => (c === next ? c : next));
  };

  const c = CHAPTERS[chapter];

  return (
    <section ref={root} className="relative h-svh overflow-hidden bg-espresso text-cream" aria-label="The Shez film">
      <video
        ref={video}
        src={src ?? undefined}
        poster="/film/000.jpg"
        muted
        loop
        playsInline
        preload="none"
        onLoadedData={(e) => {
          setReady(true);
          e.currentTarget.playbackRate = PHONE_PLAYBACK_RATE;
        }}
        onPlay={(e) => (e.currentTarget.playbackRate = PHONE_PLAYBACK_RATE)}
        onTimeUpdate={onTime}
        className="absolute inset-0 h-full w-full object-cover"
        aria-label="A woman in an embroidered white dress turns slowly in a candle-lit room"
      />
      {!ready && (
        <div className="skeleton skeleton-dark absolute inset-0 grid place-items-center" aria-hidden>
          <SparkIcon size={18} className="brand-loader__spark text-gold" />
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-espresso/85 via-transparent to-espresso/35" />

      <div className="container-x absolute inset-x-0 top-[calc(var(--header-h)+1rem)]">
        <SectionLabel kicker="Your story, in motion" tone="dark" reveal={false} />
      </div>

      <div className="container-x absolute inset-x-0 bottom-[calc(110px+env(safe-area-inset-bottom))]" aria-live="polite">
        <div key={chapter} className="film-chapter-in">
          <p className="eyebrow text-gold">{c.title}</p>
          <p className="display mt-4 text-[11vw] leading-[0.95]">
            {c.line.split(". ").map((line, i, a) => (
              <span key={i} className={`block ${i === a.length - 1 && a.length > 1 ? "italic" : ""}`}>
                {line}
                {i < a.length - 1 ? "." : ""}
              </span>
            ))}
          </p>
        </div>
      </div>

      <div className="container-x absolute inset-x-0 bottom-[calc(84px+env(safe-area-inset-bottom))]">
        <div className="h-px bg-cream/20">
          <div ref={bar} className="h-px origin-left bg-gold transition-transform duration-300 ease-linear" style={{ transform: "scaleX(0)" }} />
        </div>
      </div>
    </section>
  );
}
