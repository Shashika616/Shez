import type { CSSProperties } from "react";

/** A shimmering placeholder block. Size and shape come from className (and style for exact widths). */
export default function Skeleton({ className, dark, style }: { className?: string; dark?: boolean; style?: CSSProperties }) {
  return <div className={`skeleton rounded-[2px] ${dark ? "skeleton-dark" : ""} ${className ?? ""}`} style={style} aria-hidden />;
}
