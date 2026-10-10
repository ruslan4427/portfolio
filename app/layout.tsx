import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { Suspense } from "react";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import { ConsentBanner } from "@/components/analytics/ConsentBanner";
import { ConsentProvider } from "@/components/analytics/ConsentContext";
import { ExternalLinkTracker } from "@/components/analytics/ExternalLinkTracker";
import { GA4 } from "@/components/analytics/GA4";
import { PageViews } from "@/components/analytics/PageViews";
import { DotGrid } from "@/components/canvas/DotGrid";
import { BackToTop } from "@/components/layout/BackToTop";
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
  alternates: {
    types: {
      "application/rss+xml": [
        { url: "/rss.xml", title: "hrekov.dev · Journal" },
      ],
    },
  },
  verification: process.env.NEXT_PUBLIC_GSC_VERIFICATION
    ? { google: process.env.NEXT_PUBLIC_GSC_VERIFICATION }
    : undefined,
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
      <body suppressHydrationWarning>
        <ConsentProvider>
          <SkipToMain />
          <SmoothScroll>
            <DotGrid />
            <Nav />
            <div className="relative z-10">
              {children}
              <Footer />
            </div>
            <FloatingEmailCTA />
            <BackToTop />
          </SmoothScroll>
          <ConsentBanner />
          <ExternalLinkTracker />
          <GA4 />
          <Suspense fallback={null}>
            <PageViews />
          </Suspense>
        </ConsentProvider>
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
