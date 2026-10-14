"use client";

import Link from "next/link";
import { Suspense } from "react";
import { motion } from "motion/react";
import { useActiveNav, type NavItem } from "./useActiveNav";

type Props = { items: NavItem[]; className?: string };

function NavList({ items, active, className }: Props & { active: string | null }) {
  return (
    <>
      {items.map((n) => {
        const current = n.href === active;
        return (
          <Link
            key={n.href}
            href={n.href}
            aria-current={current ? "page" : undefined}
            className={`eyebrow group relative py-1.5 text-[11px] font-medium transition-colors duration-300 ${
              current ? "text-ink" : "text-ink/75 hover:text-ink"
            } ${className ?? ""}`}
          >
            {n.label}
            {/* Hover hint for links that aren't current */}
            {!current && (
              <span className="absolute inset-x-0 -bottom-px h-px origin-left scale-x-0 bg-ink/40 transition-transform duration-500 ease-[var(--ease-silk)] group-hover:scale-x-100" />
            )}
            {/* One shared underline that glides to whichever link is current */}
            {current && (
              <motion.span
                layoutId="nav-underline"
                className="absolute inset-x-0 -bottom-px h-[1.5px] rounded-full bg-brown"
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
              />
            )}
          </Link>
        );
      })}
    </>
  );
}

function Resolve({ children }: { children: (active: string | null) => React.ReactNode }) {
  return <>{children(useActiveNav())}</>;
}

/**
 * Render prop that hands its children the active nav href.
 * The Suspense fallback renders with no active item, so links still appear in prerendered HTML.
 */
export function ActiveNav({ children }: { children: (active: string | null) => React.ReactNode }) {
  return (
    <Suspense fallback={children(null)}>
      <Resolve>{children}</Resolve>
    </Suspense>
  );
}

/** Desktop nav links with an animated active underline. */
export default function NavLinks(props: Props) {
  return <ActiveNav>{(active) => <NavList {...props} active={active} />}</ActiveNav>;
}
