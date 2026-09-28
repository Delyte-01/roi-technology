import type { Metadata } from "next";
import { Sora, Inter } from "next/font/google";
import { SmoothScroll } from "@/components/providers/smooth-scroll";
import "lenis/dist/lenis.css";

import "./globals.css";


const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});


export const metadata: Metadata = {
  title: "ROI Technology | We See What Costs Your Store Money",
  description:
    "We find the hidden problems in your online store, then fix them with smart automation, so you sell more without doing more.",
  openGraph: {
    title: "ROI Technology | We See What Costs Your Store Money",
    description:
      "Find hidden profit leaks in your Shopify or WordPress store and fix them with automation.",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${sora.variable} ${inter.variable} antialiased`}>
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
