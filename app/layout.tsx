import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { SkipToMain } from "@/components/layout/SkipToMain";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  style: ["normal", "italic"],
  axes: ["opsz", "SOFT"],
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://ruslan.dev"),
  title: {
    default: "Ruslan Grekov — software, shipped honestly",
    template: "%s · Ruslan Grekov",
  },
  description:
    "Solo builder shipping AI-collaborative software. Five case studies with commit hashes and honest numbers.",
  openGraph: {
    type: "website",
    title: "Ruslan Grekov — software, shipped honestly",
    description:
      "Five AI-collaboration case studies. Commit hashes attached.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`}>
      <body>
        <SkipToMain />
        <SmoothScroll>{children}</SmoothScroll>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
