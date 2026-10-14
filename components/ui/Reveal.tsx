"use client";

import { createElement, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

type RevealProps = {
  as?: keyof React.JSX.IntrinsicElements;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
  threshold?: number;
  once?: boolean;
  id?: string;
};

/**
 * Sets data-inview="true" once the element scrolls into view; CSS in globals.css does the animating.
 * Don't put .curtain on the Reveal itself: a fully clip-pathed target never counts as intersecting.
 */
export function Reveal({ as = "div", className, style, children, threshold = 0.2, once = true, id }: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) io.disconnect();
        } else if (!once) setInView(false);
      },
      { threshold, rootMargin: "0px 0px -6% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold, once]);

  return createElement(as, { ref, className, style, id, "data-inview": inView ? "true" : "false" }, children);
}

/** Splits text into words that rise in, line by line, when the nearest Reveal enters view. */
export function SplitWords({ text, delay = 0, italic }: { text: string; delay?: number; italic?: string[] }) {
  return (
    <>
      {text.split(" ").map((word, i) => (
        <span key={i} className="split-word" style={{ "--i": i, "--d": `${delay}ms` } as CSSProperties}>
          <span className={italic?.includes(word.replace(/[.,]/g, "")) ? "italic" : undefined}>{word}</span>
          {" "}
        </span>
      ))}
    </>
  );
}
