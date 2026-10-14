"use client";

import { useEffect, useRef, useState } from "react";

// A 96px silhouette of the logo, inlined so the logo-shaped skeleton paints instantly (about 4 KB).
const SILHOUETTE = "data:image/png;base64,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";

/**
 * The large footer logo. Pre-optimised WebP at three widths (about 44 to 104 KB, versus 418 KB for the PNG),
 * with a shimmering silhouette of the logo in its exact shape until the real image arrives.
 */
export default function FooterLogo() {
  const img = useRef<HTMLImageElement>(null);
  const [loaded, setLoaded] = useState(false);

  // Covers the case where the image finished loading before hydration.
  useEffect(() => {
    if (img.current?.complete && img.current.naturalWidth) setLoaded(true);
  }, []);

  return (
    <div className="relative mx-auto aspect-[2154/1457] w-full max-w-[1100px]">
      <div
        className={`logo-skeleton absolute inset-0 transition-opacity duration-700 ${loaded ? "opacity-0" : "opacity-100"}`}
        style={{ maskImage: `url(${SILHOUETTE})`, WebkitMaskImage: `url(${SILHOUETTE})` }}
        aria-hidden
      />
      {/* eslint-disable-next-line @next/next/no-img-element -- already optimised; skips the on-demand image optimiser */}
      <img
        ref={img}
        src="/shez-logo-light-1200.webp"
        srcSet="/shez-logo-light-800.webp 800w, /shez-logo-light-1200.webp 1200w, /shez-logo-light-1600.webp 1600w"
        sizes="(min-width: 1180px) 1100px, 92vw"
        width={2154}
        height={1457}
        alt="Shez, wear your story"
        loading="lazy"
        decoding="async"
        onLoad={() => setLoaded(true)}
        className={`absolute inset-0 h-full w-full object-contain transition-opacity duration-1000 ${loaded ? "opacity-90" : "opacity-0"}`}
      />
    </div>
  );
}
