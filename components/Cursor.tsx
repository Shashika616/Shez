"use client";

import { useEffect, useRef, useState } from "react";

/** A soft ring that trails the pointer and grows into a label over [data-cursor] elements. Fine pointers only. */
export default function Cursor() {
  const ref = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState<string | null>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setEnabled(fine);
    if (!fine) return;
    let x = innerWidth / 2,
      y = innerHeight / 2,
      cx = x,
      cy = y,
      raf = 0;
    // The loop only runs while the ring is catching up, so an idle pointer costs nothing.
    const loop = () => {
      cx += (x - cx) * 0.18;
      cy += (y - cy) * 0.18;
      if (ref.current) ref.current.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
      raf = Math.abs(x - cx) + Math.abs(y - cy) > 0.2 ? requestAnimationFrame(loop) : 0;
    };
    const move = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      const t = (e.target as HTMLElement).closest<HTMLElement>("[data-cursor]");
      const next = t ? t.dataset.cursor || "" : null;
      setLabel((prev) => (prev === next ? prev : next));
      if (!raf) raf = requestAnimationFrame(loop);
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => {
      window.removeEventListener("pointermove", move);
      cancelAnimationFrame(raf);
    };
  }, []);

  if (!enabled) return null;
  return (
    <div ref={ref} className="pointer-events-none fixed left-0 top-0 z-[100]" aria-hidden>
      <div
        className={`eyebrow grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full text-[9px] text-ivory transition-[width,height,background-color,border-color] duration-500 ease-[var(--ease-silk)] ${
          label !== null ? "h-[84px] w-[84px] bg-brown/90" : "h-3 w-3 border border-brown bg-transparent"
        }`}
      >
        {label}
      </div>
    </div>
  );
}
