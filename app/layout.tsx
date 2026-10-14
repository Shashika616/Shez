import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/CartProvider";
import SmoothScroll from "@/components/SmoothScroll";
import Header from "@/components/Header";
import CartDrawer from "@/components/CartDrawer";
import MobileDock from "@/components/MobileDock";
import Cursor from "@/components/Cursor";
import Footer from "@/components/Footer";
import BrandLoader from "@/components/BrandLoader";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const jost = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-jost",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "Shez | Wear your story", template: "%s · Shez" },
  description:
    "Shez is a womenswear house of romantic bardots, tiered dresses and finishing pieces. Cash on delivery and bank transfer, delivered within Colombo.",
};

export const viewport: Viewport = {
  themeColor: "#f1e5d9",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${jost.variable}`}>
      <head>
        <link rel="preload" href="/shez-wordmark-sm-v2.png" as="image" fetchPriority="high" />
      </head>
      <body>
        <noscript>
          <style>{`.brand-loader{display:none!important}`}</style>
        </noscript>
        <BrandLoader />
        <CartProvider>
          <SmoothScroll />
          <Header />
          <main>{children}</main>
          <Footer />
          <CartDrawer />
          <MobileDock />
          <Cursor />
        </CartProvider>
      </body>
    </html>
  );
}
