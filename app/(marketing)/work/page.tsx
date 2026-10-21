import type { Metadata } from "next";
import { CaseReader, LensControls } from "@/components/case-study/CaseReader";
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
    .join(", ")}. Read each one as a founder, a hiring manager or an engineer.`,
};

export default function WorkPage() {
  return (
    <main id="main" className="relative min-h-screen">
      <CaseReader slug="work-index" className="px-[var(--gutter)]">
        <div className="mx-auto flex max-w-[var(--content-max)] flex-col">
          <header className="flex flex-wrap items-end justify-between gap-x-14 gap-y-8 pt-36 pb-12">
            <div className="flex min-w-0 flex-[999_1_560px] flex-col gap-5">
              <p className="font-sans text-[length:var(--type-caption)] text-[color:var(--ink-muted)]">
                Cases · {projects.length} builds · {shipped} shipped · 2026
              </p>
              <h1 className="font-serif text-[length:var(--type-display-l)] leading-[0.98] text-[color:var(--ink-primary)]">
                <MaskReveal mode="mount" delay={0.1}>
                  Selected projects.
                </MaskReveal>
              </h1>
              <Reveal delay={0.2}>
                <p className="max-w-[56ch] text-[length:var(--type-body-l)] leading-[1.55] text-[color:var(--ink-body)]">
                  {count} case studies of AI-collaboration in production. Each ships with commit
                  hashes, artifacts, and the specific decisions that made or broke the build.
                </p>
              </Reveal>
            </div>
            <div className="flex min-w-0 flex-[1_1_420px] flex-col gap-2 lg:items-end">
              <LensControls showDepth={false} />
              <p className="font-sans text-[length:var(--type-caption)] text-[color:var(--ink-muted)] lg:text-right">
                Picks where to start and what each card leads with.
              </p>
            </div>
          </header>

          <div className="pb-[var(--section-py)]">
            <WorkIndex />
          </div>
        </div>
      </CaseReader>
    </main>
  );
}
