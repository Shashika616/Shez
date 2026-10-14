type P = { className?: string; size?: number };

export const BagIcon = ({ className, size = 20 }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" className={className} aria-hidden>
    <path d="M5 8h14l-1 12H6L5 8Z" />
    <path d="M9 8V6.5a3 3 0 0 1 6 0V8" />
  </svg>
);

export const CloseIcon = ({ className, size = 20 }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" className={className} aria-hidden>
    <path d="M5 5l14 14M19 5L5 19" />
  </svg>
);

export const PlusIcon = ({ className, size = 16 }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" className={className} aria-hidden>
    <path d="M12 4v16M4 12h16" />
  </svg>
);

export const MinusIcon = ({ className, size = 16 }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" className={className} aria-hidden>
    <path d="M4 12h16" />
  </svg>
);

export const ArrowIcon = ({ className, size = 18 }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" className={className} aria-hidden>
    <path d="M4 12h15M13 6l6 6-6 6" />
  </svg>
);

export const SparkIcon = ({ className, size = 14, style }: P & { style?: React.CSSProperties }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} style={style} aria-hidden>
    <path d="M12 0c.6 6.4 5.6 11.4 12 12-6.4.6-11.4 5.6-12 12-.6-6.4-5.6-11.4-12-12C6.4 11.4 11.4 6.4 12 0Z" />
  </svg>
);

export const StarIcon = ({ className, size = 14, fill = 1 }: P & { fill?: number }) => {
  const id = `s${Math.round(fill * 100)}`;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden>
      <defs>
        <linearGradient id={id}>
          <stop offset={`${fill * 100}%`} stopColor="currentColor" />
          <stop offset={`${fill * 100}%`} stopColor="currentColor" stopOpacity="0.2" />
        </linearGradient>
      </defs>
      <path fill={`url(#${id})`} d="m12 2.5 2.9 6.1 6.6.8-4.9 4.5 1.3 6.6L12 17.2l-5.9 3.3 1.3-6.6-4.9-4.5 6.6-.8L12 2.5Z" />
    </svg>
  );
};

export function Stars({ rating, size = 13, className }: { rating: number; size?: number; className?: string }) {
  return (
    <span className={`inline-flex gap-0.5 text-gold ${className ?? ""}`} aria-label={`${rating} out of 5 stars`} role="img">
      {[0, 1, 2, 3, 4].map((i) => (
        <StarIcon key={i} size={size} fill={Math.max(0, Math.min(1, rating - i))} />
      ))}
    </span>
  );
}

/** Two blades that open and close around a pivot; `open` is degrees, overridable live via the --open custom property. */
export function Scissors({ open = 14, className }: { open?: number; className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      <g style={{ transformOrigin: "32px 30px", transform: `rotate(calc(var(--open, ${open}) * -1deg))` }}>
        <path d="M32 30 L35 2 Q33.5 1 32.5 1.5 L30 30Z" fill="currentColor" />
        <circle cx="25" cy="47" r="8" fill="none" stroke="currentColor" strokeWidth="3" />
        <path d="M30 30 L27 39.5" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" />
      </g>
      <g style={{ transformOrigin: "32px 30px", transform: `rotate(calc(var(--open, ${open}) * 1deg))` }}>
        <path d="M32 30 L29 2 Q30.5 1 31.5 1.5 L34 30Z" fill="currentColor" />
        <circle cx="39" cy="47" r="8" fill="none" stroke="currentColor" strokeWidth="3" />
        <path d="M34 30 L37 39.5" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" />
      </g>
      <circle cx="32" cy="30" r="1.8" fill="var(--color-cream)" />
    </svg>
  );
}
