"use client";

import { useEffect, useRef, useState } from "react";
import { lockScroll, prefersReducedMotion } from "@/lib/motion";
import { markAppReady } from "@/lib/ready";
import { SparkIcon } from "./ui/Icons";

const MIN_MS = 900; // long enough to read as a brand moment, short enough not to annoy
const MAX_MS = 7000; // never hold a slow connection hostage

/** Share of images on the page that have finished loading (0 to 1). */
function imageProgress() {
  const imgs = Array.from(document.images).filter((img) => img.loading !== "lazy");
  if (!imgs.length) return 1;
  return imgs.filter((img) => img.complete).length / imgs.length;
}

/**
 * Full-screen brand loader for the first paint of any page.
 * It is server-rendered so it covers the page before hydration, tracks real font and image
 * loading, then lifts away like a curtain and signals the rest of the app.
 */
export default function BrandLoader() {
  const [phase, setPhase] = useState<"loading" | "leaving" | "done">("loading");
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) {
      setPhase("done");
      markAppReady();
      return;
    }
    lockScroll(true);
    const start = performance.now();
    let shown = 0;
    let fontsReady = false;
    let pageLoaded = document.readyState === "complete";
    let raf = 0;
    let finished = false;

    document.fonts?.ready.then(() => (fontsReady = true));
    const onLoad = () => (pageLoaded = true);
    window.addEventListener("load", onLoad);

    const finish = () => {
      if (finished) return;
      finished = true;
      setPhase("leaving");
      setTimeout(() => {
        setPhase("done");
        lockScroll(false);
        markAppReady();
      }, 1100);
    };

    const tick = () => {
      const elapsed = performance.now() - start;
      const target = Math.min(1, 0.15 + imageProgress() * 0.6 + (fontsReady ? 0.15 : 0) + (pageLoaded ? 0.1 : 0));
      // Ease the visible bar towards the real progress so it never jumps.
      shown += (target - shown) * 0.08;
      if (bar.current) bar.current.style.transform = `scaleX(${shown.toFixed(4)})`;

      const complete = pageLoaded && fontsReady && shown > 0.97;
      if ((complete && elapsed > MIN_MS) || elapsed > MAX_MS) {
        if (bar.current) bar.current.style.transform = "scaleX(1)";
        finish();
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("load", onLoad);
    };
  }, []);

  if (phase === "done") return null;

  return (
    <div
      className={`brand-loader fixed inset-0 z-[200] grid place-items-center bg-cream ${phase === "leaving" ? "brand-loader--leaving" : ""}`}
      role="status"
      aria-live="polite"
      aria-label="Loading Shez"
    >
      <div className="brand-loader__inner flex flex-col items-center">
        <div className="relative h-[66px] w-[140px] md:h-[85px] md:w-[180px]">
          {/* eslint-disable-next-line @next/next/no-img-element -- plain img so it paints before hydration */}
          <img src="/shez-wordmark-sm.png" alt="" fetchPriority="high" className="h-full w-full object-contain" />
          <div className="brand-loader__shine absolute inset-0" aria-hidden />
          <SparkIcon size={14} className="brand-loader__spark absolute -right-5 top-0 text-gold" />
        </div>
        <div className="mt-8 h-px w-[160px] overflow-hidden bg-ink/10">
          <div ref={bar} className="h-full origin-left bg-gold" style={{ transform: "scaleX(0)" }} />
        </div>
        <p className="eyebrow mt-5 text-[9px] text-ink/50">Wear your story</p>
      </div>
    </div>
  );
}
