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

  // A link to the page you're already on changes nothing, so the router does nothing.
  // Treat it as "take me to the top of this page" instead of leaving you where you were.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element).closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a || a.target === "_blank" || a.hasAttribute("download")) return;
      const url = new URL(a.href, window.location.href);
      const here = window.location;
      if (url.origin !== here.origin || url.pathname !== here.pathname || url.search !== here.search || url.hash) return;
      const lenis = getLenis();
      if (lenis) lenis.scrollTo(0, { duration: 1 });
      else window.scrollTo({ top: 0, behavior: "smooth" });
    };
    // Capture phase: Next's <Link> marks the click handled before it would bubble up to us.
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return null;
}
