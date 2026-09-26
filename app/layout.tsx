import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import { DotGrid } from "@/components/canvas/DotGrid";
import { FloatingEmailCTA } from "@/components/layout/FloatingEmailCTA";
import { Footer } from "@/components/layout/Footer";
import { Nav } from "@/components/layout/Nav";
import { SkipToMain } from "@/components/layout/SkipToMain";
import { SmoothScroll } from "@/components/layout/SmoothScroll";

const playfair = Playfair_Display({
  variable: "--font-display",
  weight: ["400", "500", "600", "700", "800", "900"],
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
  metadataBase: new URL("https://hrekov.dev"),
  title: {
    default: "Ruslan Hrekov — software, shipped honestly",
    template: "%s · Ruslan Hrekov",
  },
  description:
    "Solo builder shipping AI-collaborative software. Five case studies with commit hashes and honest numbers.",
  openGraph: {
    type: "website",
    title: "Ruslan Hrekov — software, shipped honestly",
    description:
      "Five AI-collaboration case studies. Commit hashes attached.",
  },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Ruslan Hrekov",
  url: "https://hrekov.dev",
  jobTitle: "Software Engineer",
  description:
    "Solo builder shipping AI-collaborative software. Five case studies with commit hashes and honest numbers.",
  sameAs: [
    "https://github.com/ruslan4427",
    "https://x.com/ruslan4427",
  ],
  email: "mailto:rusgrekovua@gmail.com",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body>
        <SkipToMain />
        <SmoothScroll>
          <DotGrid />
          <Nav />
          <div className="relative z-10">
            {children}
            <Footer />
          </div>
          <FloatingEmailCTA />
        </SmoothScroll>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
