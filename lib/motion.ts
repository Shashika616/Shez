"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type Lenis from "lenis";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
  // Phones resize the viewport as the address bar shows/hides; don't re-measure (and jump) for that.
  ScrollTrigger.config({ ignoreMobileResize: true });
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
}

// One Lenis instance shared by the whole app (set by <SmoothScroll>).
let lenis: Lenis | null = null;
let locked = false;

export const setLenis = (l: Lenis | null) => {
  lenis = l;
  // A lock requested before Lenis existed (e.g. by the brand loader) still applies.
  if (l && locked) l.stop();
};
export const getLenis = () => lenis;

export function lockScroll(lock: boolean) {
  locked = lock;
  if (lenis) {
    if (lock) lenis.stop();
    else lenis.start();
  }
  document.documentElement.style.overflow = lock ? "hidden" : "";
}

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export { gsap, ScrollTrigger };
