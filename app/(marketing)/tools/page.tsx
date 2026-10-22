import type { Metadata } from "next";
import Link from "next/link";
import { ScorecardMethodology } from "@/components/tools/ScorecardMethodology";
import { ScorecardTable } from "@/components/tools/ScorecardTable";
import { SkillGrid } from "@/components/tools/SkillGrid";
import { Disclosure, ToolSection } from "@/components/tools/ToolSection";
import { MaskReveal } from "@/components/ui/MaskReveal";
import { Reveal } from "@/components/ui/Reveal";
import { TOOLS_BUILT } from "@/content/tools-built";
import scorecardJson from "@/scorecard.json";

const COUNT_WORDS = ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten"];
const count = COUNT_WORDS[TOOLS_BUILT.length] ?? String(TOOLS_BUILT.length);
const scored = scorecardJson.projects.length;
const pad = (n: number) => String(n).padStart(2, "0");

export const metadata: Metadata = {
  title: "Tools",
  description:
    "Open-source Claude Code skills shipped from this portfolio: the ShipLoop discipline and the ui-ux-pro design skill. Seven projects scored on hygiene, discipline, and rework — null when unmeasured.",
  openGraph: {
    title: "Tools — Ruslan Hrekov",
    description:
      "Open-source Claude Code skills shipped from this portfolio, plus a seven-project scorecard with universal CI + secret-scanning hygiene.",
    url: "https://hrekov.dev/tools",
  },
};

export default function ToolsPage() {
  return (
    <main id="main" className="relative min-h-screen px-[var(--gutter)]">
      <div className="mx-auto flex max-w-[var(--content-max)] flex-col">
        <header className="flex flex-col gap-5 pt-36 pb-12">
          <p className="font-sans text-[length:var(--type-caption)] text-[color:var(--ink-muted)]">
            Tools · Claude Code skills · MIT · no telemetry
          </p>
          <h1 className="font-serif text-[length:var(--type-display-l)] leading-[0.98] text-[color:var(--ink-primary)]">
            <MaskReveal mode="mount" delay={0.1}>
              {count} open-source tools.
            </MaskReveal>
          </h1>
          <Reveal delay={0.2}>
            <p className="max-w-[58ch] text-[length:var(--type-body-l)] leading-[1.55] text-[color:var(--ink-body)]">
              The two skills every case on this site was built with. Drop either into any{" "}
              <code className="rounded-[var(--radius-inline)] border border-[color:var(--hairline)] bg-[color:var(--bg-elevated)] px-1.5 py-0.5 font-sans text-[0.9em] text-[color:var(--ink-primary)]">
                .claude/
              </code>{" "}
              directory — and see below what they changed, measured on {scored} real projects.
            </p>
          </Reveal>
        </header>

        <nav aria-label="Tools on this page" className="pb-[clamp(56px,8vh,96px)]">
          <ul className="grid gap-4 md:grid-cols-2">
            {TOOLS_BUILT.map((tool, i) => {
              const lead = tool.effectiveness.impact?.find((r) => r.value !== null);
              return (
                <li key={tool.slug}>
                  <Link
                    href={`#${tool.slug}`}
                    className="group flex h-full flex-col gap-4 rounded-[var(--radius-card)] border border-[color:var(--hairline)] bg-[color:var(--bg-elevated)] p-6 transition-transform duration-[var(--dur-fast)] hover:-translate-y-0.5 focus-visible:-translate-y-0.5 focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)] motion-reduce:transform-none md:p-7"
                  >
                    <p className="font-sans text-[length:var(--type-caption)] text-[color:var(--ink-muted)] tabular-nums">
                      <span className="text-[color:var(--accent)]">{pad(i + 1)}</span> / {pad(TOOLS_BUILT.length)}
                    </p>
                    <div className="flex flex-col gap-2">
                      <p className="font-serif text-[length:var(--type-display-s)] leading-[1.05] text-[color:var(--ink-primary)]">
                        {tool.name}
                      </p>
                      <p className="text-[length:var(--type-small)] leading-[1.55] text-[color:var(--ink-body)]">{tool.tagline}</p>
                    </div>
                    <div className="mt-auto flex items-end justify-between gap-4 border-t border-[color:var(--hairline)] pt-4">
                      {lead && (
                        <p className="flex flex-col">
                          <span className="font-serif text-[32px] leading-none text-[color:var(--ink-primary)] tabular-nums">{lead.value}</span>
                          <span className="mt-1 font-sans text-[length:var(--type-caption)] text-[color:var(--ink-muted)]">{lead.label}</span>
                        </p>
                      )}
                      <span className="font-sans text-sm text-[color:var(--ink-primary)] underline decoration-[color:var(--outline)] underline-offset-4 group-hover:decoration-[color:var(--accent)]">
                        How it works <span aria-hidden>↓</span>
                      </span>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {TOOLS_BUILT.map((tool, i) => (
          <ToolSection key={tool.slug} tool={tool} index={i + 1} total={TOOLS_BUILT.length}>
            {tool.slug === "claude-shiploop" && <SkillGrid />}
          </ToolSection>
        ))}

        <section
          id="scorecard"
          aria-labelledby="scorecard-heading"
          className="scroll-mt-28 border-t border-[color:var(--hairline)] pt-[clamp(56px,8vh,96px)] pb-[var(--section-py)]"
        >
          <div className="flex flex-col gap-4 pb-8">
            <p className="font-sans text-[length:var(--type-caption)] text-[color:var(--ink-muted)]">Scorecard</p>
            <h2
              id="scorecard-heading"
              className="max-w-[20ch] font-serif text-[length:var(--type-display-m)] leading-[1.02] text-[color:var(--ink-primary)]"
            >
              Does the discipline pay off?
            </h2>
            <p className="max-w-[60ch] text-[length:var(--type-body-l)] leading-[1.55] text-[color:var(--ink-body)]">
              {scored} projects across three discipline tiers, measured from git logs, DEVLOGs and Claude Code
              session files — never self-reported. A dash means the signal could not be reconstructed, not
              that the project failed.
            </p>
          </div>
          <ScorecardTable />
          <div className="mt-6">
            <Disclosure summary="How each number is measured">
              <ScorecardMethodology />
            </Disclosure>
          </div>
        </section>
      </div>
    </main>
  );
}
