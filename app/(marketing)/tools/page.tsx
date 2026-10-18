import type { Metadata } from "next";
import { InstallBlock } from "@/components/tools/InstallBlock";
import { ScorecardMethodology } from "@/components/tools/ScorecardMethodology";
import { ScorecardTable } from "@/components/tools/ScorecardTable";
import { SkillGrid } from "@/components/tools/SkillGrid";
import { ToolsBuilt } from "@/components/tools/ToolsBuilt";
import { MaskReveal } from "@/components/ui/MaskReveal";
import { Reveal } from "@/components/ui/Reveal";
import { SectionBadge } from "@/components/ui/SectionBadge";
import { INSTALL_COMMAND } from "@/content/tools";

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
    <main id="main" className="relative min-h-screen">
      <section className="px-[var(--gutter)] pt-40 pb-12">
        <div className="mx-auto flex max-w-[var(--content-max)] flex-col items-center text-center">
          <Reveal>
            <SectionBadge label="Tools" />
          </Reveal>
          <h1 className="mt-8 max-w-[22ch] font-serif text-[clamp(48px,7vw,88px)] leading-[0.98] text-[color:var(--ink-primary)]">
            <MaskReveal mode="mount" delay={0.15}>
              Tools we&rsquo;ve built.
            </MaskReveal>
          </h1>
          <Reveal delay={0.25}>
            <p className="mt-8 max-w-2xl text-[17px] leading-relaxed text-[color:var(--ink-body)]">
              Open-source Claude Code skills shipped from this portfolio. The
              shiploop discipline that turns Claude into a shipping protocol,
              and the design skill that keeps generated UI inside your own
              system. MIT, no telemetry, drop into any{" "}
              <code className="font-mono text-[15px] text-[color:var(--ink-primary)]">
                .claude/
              </code>{" "}
              directory.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="px-[var(--gutter)] pb-[var(--section-py)]">
        <div className="mx-auto max-w-[var(--content-max)]">
          <ToolsBuilt />
        </div>
      </section>

      <section className="px-[var(--gutter)] py-[var(--section-py)]">
        <div className="mx-auto max-w-[var(--content-max)]">
          <Reveal>
            <ScorecardTable />
          </Reveal>
          <Reveal className="mt-16">
            <ScorecardMethodology />
          </Reveal>
        </div>
      </section>

      <section className="px-[var(--gutter)] py-[var(--section-py)]">
        <div className="mx-auto max-w-[var(--content-max)]">
          <Reveal>
            <h2 className="max-w-[18ch] font-serif text-[clamp(32px,4vw,56px)] leading-[1.02] text-[color:var(--ink-primary)]">
              <MaskReveal delay={0.1}>Inside ShipLoop.</MaskReveal>
            </h2>
            <p className="mt-4 max-w-2xl text-[17px] leading-relaxed text-[color:var(--ink-body)]">
              Seven skills plus a domain-expert subagent. Each is a
              single-purpose SKILL.md that Claude Code loads on invocation.
              Not frameworks, not plugins — just the system prompt and the
              arguments.
            </p>
          </Reveal>
          <Reveal className="mt-6">
            <InstallBlock command={INSTALL_COMMAND} />
            <p className="mt-3 text-[13px] leading-relaxed text-[color:var(--ink-muted)]">
              Pipes through bash — prefer{" "}
              <a
                href="https://github.com/ruslan4427/claude-shiploop#install"
                target="_blank"
                rel="noopener"
                className="underline decoration-[color:var(--outline)] underline-offset-2 hover:text-[color:var(--ink-primary)]"
              >
                clone + inspect first
              </a>{" "}
              if you want to audit the installer before running it.
            </p>
          </Reveal>
          <div className="mt-12">
            <SkillGrid />
          </div>
        </div>
      </section>
    </main>
  );
}
