import type { Metadata } from "next";
import ShopView from "@/components/ShopView";

export const metadata: Metadata = { title: "The Collection" };

export default async function ShopPage({ searchParams }: { searchParams: Promise<{ c?: string }> }) {
  const { c } = await searchParams;
  return <ShopView initial={c ?? "all"} />;
}
