import { SparkIcon } from "./Icons";

type Props = {
  kicker: string;
  sub?: string;
  tone?: "light" | "dark";
  align?: "left" | "right";
  className?: string;
  /** Set false when not inside a <Reveal>, otherwise the label stays hidden. */
  reveal?: boolean;
};

/** Section opener: a small spaced label with an italic serif subtitle beneath it. */
export default function SectionLabel({ kicker, sub, tone = "light", align = "left", className, reveal = true }: Props) {
  const dark = tone === "dark";
  return (
    <div className={`${reveal ? "fade-up " : ""}flex flex-col gap-2 ${align === "right" ? "items-end text-right" : ""} ${className ?? ""}`}>
      <p className={`eyebrow flex items-center gap-3 text-[11px] font-medium md:text-xs ${dark ? "text-sand" : "text-brown"}`}>
        <SparkIcon size={11} className="text-gold" />
        {kicker}
      </p>
      {sub && <p className={`font-display text-[1.4rem] italic leading-snug md:text-[1.65rem] ${dark ? "text-cream/70" : "text-ink/65"}`}>{sub}</p>}
    </div>
  );
}
