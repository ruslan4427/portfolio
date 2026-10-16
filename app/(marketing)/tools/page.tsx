import type { Metadata } from "next";
import { InstallBlock } from "@/components/tools/InstallBlock";
import { ScorecardMethodology } from "@/components/tools/ScorecardMethodology";
import { ScorecardTable } from "@/components/tools/ScorecardTable";
import { SkillGrid } from "@/components/tools/SkillGrid";
import { MaskReveal } from "@/components/ui/MaskReveal";
import { Reveal } from "@/components/ui/Reveal";
import { SectionBadge } from "@/components/ui/SectionBadge";
import { INSTALL_COMMAND } from "@/content/tools";

export const metadata: Metadata = {
  title: "Tools",
  description:
    "ShipLoop ecosystem — seven open-source Claude Code skills plus a measurement scorecard. Install in one command, inspect every number.",
  openGraph: {
    title: "Tools — Ruslan Hrekov",
    description:
      "ShipLoop ecosystem — seven open-source Claude Code skills plus a measurement scorecard.",
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
          <h1 className="mt-8 max-w-[18ch] font-serif text-[clamp(48px,7vw,88px)] leading-[0.98] text-[color:var(--ink-primary)]">
            <MaskReveal mode="mount" delay={0.15}>
              ShipLoop, open-sourced.
            </MaskReveal>
          </h1>
          <Reveal delay={0.25}>
            <p className="mt-8 max-w-2xl text-[17px] leading-relaxed text-[color:var(--ink-body)]">
              Seven Claude Code skills, one domain-expert agent, a scorecard
              that measures the discipline cost of shipping without them.
              Install into any project in one command — the whole protocol
              lives in your <code className="font-mono text-[15px] text-[color:var(--ink-primary)]">.claude/</code> directory.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="px-[var(--gutter)] pb-16">
        <Reveal className="mx-auto max-w-[var(--content-max)]">
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
            </a>
            {" "}if you want to audit the installer before running it.
          </p>
        </Reveal>
      </section>

      <section className="px-[var(--gutter)] py-[var(--section-py)]">
        <div className="mx-auto max-w-[var(--content-max)]">
          <Reveal>
            <h2 className="max-w-[18ch] font-serif text-[clamp(32px,4vw,56px)] leading-[1.02] text-[color:var(--ink-primary)]">
              <MaskReveal delay={0.1}>Skills.</MaskReveal>
            </h2>
            <p className="mt-4 max-w-2xl text-[17px] leading-relaxed text-[color:var(--ink-body)]">
              Each skill is a single-purpose SKILL.md that Claude Code loads
              on invocation. Not frameworks, not plugins — just the system
              prompt and the arguments.
            </p>
          </Reveal>
          <div className="mt-12">
            <SkillGrid />
          </div>
        </div>
      </section>

      <section className="px-[var(--gutter)] py-[var(--section-py)]">
        <div className="mx-auto max-w-[var(--content-max)]">
          <Reveal>
            <ScorecardTable />
          </Reveal>
        </div>
      </section>

      <section className="px-[var(--gutter)] pb-[var(--section-py)]">
        <div className="mx-auto max-w-[var(--content-max)]">
          <Reveal>
            <ScorecardMethodology />
          </Reveal>
        </div>
      </section>
    </main>
  );
}
