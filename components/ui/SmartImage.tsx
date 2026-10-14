"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

/**
 * next/image (fill) with a shimmering skeleton in its exact frame until the photo arrives, then a soft fade-in.
 * The fade lives on a wrapper, so the image keeps its own transitions (hover zooms and so on).
 * Place inside a sized, positioned parent, as with any `fill` image.
 */
export default function SmartImage({ onLoad, dark, ...props }: Omit<ImageProps, "fill"> & { dark?: boolean }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <>
      {!loaded && <span className={`skeleton absolute inset-0 ${dark ? "skeleton-dark" : ""}`} aria-hidden />}
      <span className={`absolute inset-0 block transition-opacity duration-700 ${loaded ? "opacity-100" : "opacity-0"}`}>
        <Image
          {...props}
          fill
          onLoad={(e) => {
            setLoaded(true);
            onLoad?.(e);
          }}
        />
      </span>
    </>
  );
}
