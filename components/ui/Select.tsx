"use client";

import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { SparkIcon } from "./Icons";

type Option<T extends string> = { value: T; label: string };

type Props<T extends string> = {
  label: string;
  value: T;
  options: readonly Option<T>[];
  onChange: (value: T) => void;
  align?: "left" | "right";
  className?: string;
};

/** On-brand replacement for <select>: a button plus a listbox, following the WAI-ARIA listbox pattern. */
export default function Select<T extends string>({ label, value, options, onChange, align = "right", className }: Props<T>) {
  const [open, setOpen] = useState(false);
  const [focus, setFocus] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const id = useId();
  const selectedIndex = Math.max(0, options.findIndex((o) => o.value === value));
  const current = options[selectedIndex];

  useEffect(() => {
    if (!open) return;
    setFocus(selectedIndex);
    requestAnimationFrame(() => list.current?.focus());
    const onDown = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open, selectedIndex]);

  const choose = (i: number) => {
    onChange(options[i].value);
    setOpen(false);
    button.current?.focus();
  };

  const onListKey = (e: React.KeyboardEvent) => {
    const last = options.length - 1;
    const moves: Record<string, () => void> = {
      ArrowDown: () => setFocus((f) => Math.min(last, f + 1)),
      ArrowUp: () => setFocus((f) => Math.max(0, f - 1)),
      Home: () => setFocus(0),
      End: () => setFocus(last),
      Enter: () => choose(focus),
      " ": () => choose(focus),
      Escape: () => {
        setOpen(false);
        button.current?.focus();
      },
      Tab: () => setOpen(false),
    };
    const move = moves[e.key];
    if (!move) return;
    if (e.key !== "Tab") e.preventDefault();
    move();
  };

  return (
    <div ref={root} className={`relative ${className ?? ""}`}>
      <button
        ref={button}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${id}-list`}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown" || e.key === "ArrowUp") {
            e.preventDefault();
            setOpen(true);
          }
        }}
        className={`group flex items-center gap-3 rounded-full border bg-ivory py-1.5 pl-4 pr-1.5 shadow-[0_6px_18px_-12px_rgba(31,21,14,.5)] transition-[border-color,box-shadow] duration-300 ${
          open ? "border-ink ring-4 ring-sand/70" : "border-ink/30 hover:border-ink"
        }`}
      >
        <span className="eyebrow text-[9px] font-medium text-ink/60">{label}</span>
        <span className="relative font-display text-[18px] italic leading-none text-ink">
          {current.label}
          {selectedIndex > 0 && <span className="absolute -right-2.5 -top-0.5 h-1.5 w-1.5 rounded-full bg-gold" aria-hidden />}
        </span>
        <span
          className={`ml-1 grid h-8 w-8 place-items-center rounded-full transition-colors duration-300 ${open ? "bg-ink text-ivory" : "bg-sand/70 text-ink group-hover:bg-ink group-hover:text-ivory"}`}
        >
          <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden className={`transition-transform duration-500 ease-[var(--ease-silk)] ${open ? "rotate-180" : ""}`}>
            <path d="M1 3.5 5 7l4-3.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
          </svg>
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            ref={list}
            id={`${id}-list`}
            role="listbox"
            tabIndex={-1}
            aria-label={label}
            aria-activedescendant={`${id}-opt-${focus}`}
            onKeyDown={onListKey}
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98, transition: { duration: 0.15 } }}
            transition={{ type: "spring", stiffness: 420, damping: 32 }}
            className={`absolute top-[calc(100%+8px)] z-40 min-w-[230px] overflow-hidden rounded-2xl border border-ink/10 bg-ivory/95 p-1.5 shadow-[0_18px_50px_-18px_rgba(31,21,14,.45)] backdrop-blur-xl outline-none ${
              align === "right" ? "right-0 origin-top-right" : "left-0 origin-top-left"
            }`}
          >
            {options.map((o, i) => {
              const selected = o.value === value;
              return (
                <li
                  key={o.value}
                  id={`${id}-opt-${i}`}
                  role="option"
                  aria-selected={selected}
                  onPointerEnter={() => setFocus(i)}
                  onClick={() => choose(i)}
                  className={`relative flex cursor-pointer items-center justify-between gap-6 rounded-xl px-4 py-3 transition-colors ${
                    selected ? "bg-sand" : focus === i ? "bg-sand/45" : ""
                  }`}
                >
                  {selected && <span className="absolute inset-y-2.5 left-1.5 w-[2px] rounded-full bg-gold" aria-hidden />}
                  <span className={`font-display text-lg leading-none ${selected ? "italic text-ink" : "text-ink/80"}`}>{o.label}</span>
                  {selected && <SparkIcon size={10} className="text-gold" />}
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
