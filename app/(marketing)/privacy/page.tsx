import type { Metadata } from "next";
import { MaskReveal } from "@/components/ui/MaskReveal";
import { Reveal } from "@/components/ui/Reveal";
import { SectionBadge } from "@/components/ui/SectionBadge";

export const metadata: Metadata = {
  title: "Privacy",
  description: "How hrekov.dev collects, uses, and protects visitor data.",
};

const sections = [
  {
    heading: "What I collect",
    paragraphs: [
      "This site uses Google Analytics 4 (GA4) to record aggregate visitor patterns — pages viewed, referring source, approximate country and city, device type, time on page. Personal data (name, IP) is anonymized by GA4 defaults. No account creation, no user profiles, no cross-site tracking.",
      "The contact form at /contact submits your name, email, and message to Resend for email delivery. Those fields land in my personal inbox and are retained until deleted manually.",
      "Blog posts are cross-posted to LinkedIn and dev.to; those platforms have their own privacy notices governing any interaction there.",
    ],
  },
  {
    heading: "Cookies",
    paragraphs: [
      "GA4 sets first-party cookies (_ga, _ga_*). EU/UK/EEA/Swiss visitors see a consent banner before any GA4 script loads — declining means zero cookies and zero analytics for that session. A reset link lives in the footer.",
    ],
  },
  {
    heading: "Data retention",
    paragraphs: [
      "GA4 retains event-level data for 14 months, then anonymizes. Contact form submissions are kept indefinitely unless you email to request deletion.",
    ],
  },
  {
    heading: "Third parties",
    paragraphs: [
      "Google (analytics), Resend (transactional email), Vercel (hosting + edge analytics), Cloudflare (DNS), LinkedIn and dev.to (cross-posting destinations). Each processes only the data required for its function.",
    ],
  },
  {
    heading: "Contact",
    paragraphs: [
      "Data-related questions or deletion requests → rusgrekovua@gmail.com. Reply within one business week.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <main id="main" className="relative min-h-screen">
      <section className="px-[var(--gutter)] pt-40 pb-12">
        <div className="mx-auto max-w-[var(--content-max)]">
          <Reveal>
            <SectionBadge label="Privacy" />
          </Reveal>
          <h1 className="mt-8 max-w-[16ch] font-serif text-[clamp(48px,7vw,88px)] leading-[0.98] text-[color:var(--ink-primary)]">
            <MaskReveal mode="mount" delay={0.15}>Privacy notice.</MaskReveal>
          </h1>
          <Reveal delay={0.25}>
            <p className="mt-6 max-w-2xl text-[15px] text-[color:var(--ink-muted)]">
              Last updated 2026-09-29.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="px-[var(--gutter)] pb-[var(--section-py)]">
        <div className="mx-auto max-w-[70ch]">
          {sections.map((s) => (
            <Reveal key={s.heading}>
              <h2 className="mt-12 font-serif text-[clamp(28px,3.5vw,40px)] leading-[1.1] text-[color:var(--ink-primary)]">
                {s.heading}
              </h2>
              {s.paragraphs.map((p, i) => (
                <p
                  key={i}
                  className="mt-4 text-[17px] leading-relaxed text-[color:var(--ink-body)]"
                >
                  {p}
                </p>
              ))}
            </Reveal>
          ))}
        </div>
      </section>
    </main>
  );
}
