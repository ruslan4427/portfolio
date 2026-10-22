import type { Metadata } from "next";
import { WorkIndex } from "@/components/sections/WorkIndex";
import { MaskReveal } from "@/components/ui/MaskReveal";
import { Reveal } from "@/components/ui/Reveal";
import { projects } from "@/content/projects";

const COUNT_WORDS = ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten"];
const count = COUNT_WORDS[projects.length] ?? String(projects.length);
const shipped = projects.filter((p) => p.status === "shipped").length;

export const metadata: Metadata = {
  title: "Cases",
  description: `${count} case studies of AI-collaboration in production — ${projects
    .map((p) => p.name)
    .join(", ")}.`,
};

export default function WorkPage() {
  return (
    <main id="main" className="relative min-h-screen px-[var(--gutter)]">
      <div className="mx-auto flex max-w-[var(--content-max)] flex-col">
        <header className="flex flex-col gap-5 pt-36 pb-12">
          <p className="font-sans text-[length:var(--type-caption)] text-[color:var(--ink-muted)]">
            Cases · {shipped} of {projects.length} shipped · 2026
          </p>
          <h1 className="font-serif text-[length:var(--type-display-l)] leading-[0.98] text-[color:var(--ink-primary)]">
            <MaskReveal mode="mount" delay={0.1}>
              Case studies.
            </MaskReveal>
          </h1>
          <Reveal delay={0.2}>
            <p className="max-w-[56ch] text-[length:var(--type-body-l)] leading-[1.55] text-[color:var(--ink-body)]">
              Real products built with AI, start to finish. Each case shows the problem, the
              decisions, the numbers and the receipts — open any one, they read on their own.
            </p>
          </Reveal>
        </header>

        <div className="pb-[var(--section-py)]">
          <WorkIndex />
        </div>
      </div>
    </main>
  );
}
