import type { Metadata } from "next";
import { WorkIndex } from "@/components/sections/WorkIndex";
import { MaskReveal } from "@/components/ui/MaskReveal";
import { Reveal } from "@/components/ui/Reveal";
import { SectionBadge } from "@/components/ui/SectionBadge";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Five case studies of AI-collaboration in production — Noble, Angel, Fieldmark, Lexora, smm-factory. Filter by role, stack, or year.",
};

export default function WorkPage() {
  return (
    <main id="main" className="relative min-h-screen">

      <section className="px-[var(--gutter)] pt-40 pb-12">
        <div className="mx-auto flex max-w-[var(--content-max)] flex-col items-center text-center">
          <Reveal>
            <SectionBadge label="Work" />
          </Reveal>
          <h1 className="mt-8 max-w-[16ch] font-serif text-[clamp(48px,7vw,88px)] leading-[0.98] text-[color:var(--ink-primary)]">
            <MaskReveal mode="mount" delay={0.15}>
              Selected projects.
            </MaskReveal>
          </h1>
          <Reveal delay={0.25}>
            <p className="mt-8 max-w-2xl text-[17px] leading-relaxed text-[color:var(--ink-body)]">
              Five case studies of AI-collaboration in production. Each ships
              with commit hashes, receipts, and the specific decisions that
              made or broke the build.
            </p>
          </Reveal>
        </div>
      </section>

      <WorkIndex />
    </main>
  );
}
