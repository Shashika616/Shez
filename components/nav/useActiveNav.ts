"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { getProduct } from "@/lib/products";

export type NavItem = { href: string; label: string; note: string };

export const NAV: NavItem[] = [
  { href: "/shop", label: "Shop all", note: "Every piece, every story" },
  { href: "/shop?c=dresses", label: "Dresses", note: "Tiered, satin and linen" },
  { href: "/shop?c=tops", label: "Tops", note: "Bardots, ruffles and lace" },
  { href: "/#story", label: "Our story", note: "The house behind the name" },
  { href: "/#reviews", label: "Reviews", note: "In their own words" },
];

const HOME_SECTIONS = ["story", "reviews"] as const;
type HomeSection = (typeof HOME_SECTIONS)[number];

/** Which home-page section is crossing the middle of the viewport, if any. */
function useHomeSection(enabled: boolean): HomeSection | null {
  const [section, setSection] = useState<HomeSection | null>(null);

  useEffect(() => {
    if (!enabled) return setSection(null);
    const visible = new Set<HomeSection>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const id = e.target.id as HomeSection;
          if (e.isIntersecting) visible.add(id);
          else visible.delete(id);
        }
        setSection(HOME_SECTIONS.find((id) => visible.has(id)) ?? null);
      },
      // A thin band across the middle of the screen: a section counts once it reaches it.
      { rootMargin: "-45% 0px -50% 0px" },
    );
    for (const id of HOME_SECTIONS) {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    }
    return () => io.disconnect();
  }, [enabled]);

  return section;
}

/** Returns the href of the nav item that matches where the visitor is, or null. */
export function useActiveNav(): string | null {
  const pathname = usePathname();
  const params = useSearchParams();
  const section = useHomeSection(pathname === "/");

  if (pathname === "/") return section ? `/#${section}` : null;

  let category: string | null | undefined = null;
  if (pathname.startsWith("/shop")) category = params.get("c");
  else if (pathname.startsWith("/product/")) category = getProduct(pathname.split("/")[2] ?? "")?.category;
  else return null;

  const match = NAV.find((n) => n.href === `/shop?c=${category}`);
  return match ? match.href : "/shop";
}
