"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { gsap, ScrollTrigger, setLenis, getLenis, prefersReducedMotion } from "@/lib/motion";

export default function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    if (prefersReducedMotion()) return;
    // Phones scroll natively with touch; skip the smoothing loop there entirely.
    if (window.matchMedia("(max-width: 767px) and (pointer: coarse)").matches) return;
    const lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 1, smoothWheel: true });
    setLenis(lenis);
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  // New page: start at the top (or at the #section the link asked for), then re-measure triggers.
  useEffect(() => {
    const scrollTo = (y: number) => {
      getLenis()?.scrollTo(y, { immediate: true, force: true });
      window.scrollTo(0, y);
    };
    // ScrollTrigger remembers scroll positions per page and restores them on refresh;
    // without clearing, it pulls the new page back down to where the previous one was.
    ScrollTrigger.clearScrollMemory("manual");

    const hash = window.location.hash.slice(1);
    const toTarget = () => {
      const el = hash ? document.getElementById(decodeURIComponent(hash)) : null;
      scrollTo(el ? el.getBoundingClientRect().top + window.scrollY : 0);
      ScrollTrigger.update();
    };
    toTarget();
    // Let the new page lay out (sections, images) before settling on a #target.
    const raf = hash ? requestAnimationFrame(() => requestAnimationFrame(toTarget)) : 0;

    const refresh = () => {
      ScrollTrigger.clearScrollMemory("manual");
      ScrollTrigger.refresh();
      if (hash) toTarget();
    };
    const t = setTimeout(refresh, 400);
    window.addEventListener("load", refresh);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t);
      window.removeEventListener("load", refresh);
    };
  }, [pathname]);

  // Links that stay on the current page glide instead of jumping:
  //  - "/#story" while on the home page scrolls smoothly to that section;
  //  - a link to this exact page (no #) glides back to the top (otherwise nothing would happen).
  useEffect(() => {
    // Unhurried and distance-aware: ~1.6s for a short hop, up to ~2.6s across the whole page.
    const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
    const durationFor = (distance: number) => Math.min(2.6, 1.6 + Math.abs(distance) / 6000);
    let raf = 0;
    const stop = () => cancelAnimationFrame(raf);

    const glideTo = (y: number) => {
      const lenis = getLenis();
      const duration = durationFor(y - window.scrollY);
      if (lenis) {
        lenis.scrollTo(y, { duration, easing: easeInOutCubic, force: true });
        return;
      }
      // Phones: the browser's own smooth scroll can't be slowed, so animate it ourselves.
      stop();
      const from = window.scrollY;
      const start = performance.now();
      const step = (now: number) => {
        const t = Math.min(1, (now - start) / (duration * 1000));
        window.scrollTo(0, from + (y - from) * easeInOutCubic(t));
        if (t < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    };
    // A finger or wheel mid-glide takes control back immediately.
    window.addEventListener("touchstart", stop, { passive: true });
    window.addEventListener("wheel", stop, { passive: true });

    const onClick = (e: MouseEvent) => {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element).closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a || a.target === "_blank" || a.hasAttribute("download")) return;
      const url = new URL(a.href, window.location.href);
      const here = window.location;
      if (url.origin !== here.origin || url.pathname !== here.pathname || url.search !== here.search) return;

      const id = decodeURIComponent(url.hash.slice(1));
      const target = id ? document.getElementById(id) : null;
      if (id && !target) return; // unknown section: let the browser handle it

      // Handled here: stop the instant jump (Next's <Link> skips navigation when defaultPrevented).
      e.preventDefault();
      if (id) window.history.replaceState(window.history.state, "", url.hash);

      // Let a closing menu release the scroll lock before gliding.
      setTimeout(() => {
        const y = target ? target.getBoundingClientRect().top + window.scrollY : 0;
        glideTo(Math.max(0, y));
      }, 60);
    };
    // Capture phase: runs before Next's <Link> handles the click.
    document.addEventListener("click", onClick, true);
    return () => {
      stop();
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("touchstart", stop);
      window.removeEventListener("wheel", stop);
    };
  }, []);

  return null;
}
