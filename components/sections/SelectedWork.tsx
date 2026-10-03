import { projects } from "@/content/projects";
import { ProjectAccordionRow } from "./ProjectAccordionRow";
import { SectionBadge } from "@/components/ui/SectionBadge";
import { CTALink } from "@/components/ui/CTAButton";
import { Reveal } from "@/components/ui/Reveal";
import { MaskReveal } from "@/components/ui/MaskReveal";

const featured = projects.filter((p) => p.featured);

export function SelectedWork() {
  return (
    <section
      id="work"
      className="relative px-[var(--gutter)] py-[var(--section-py)]"
    >
      <div className="mx-auto max-w-[var(--content-max)]">
        <header className="mb-14 flex flex-col items-center gap-6 text-center">
          <Reveal>
            <SectionBadge label="Selected work" />
          </Reveal>
          <h2 className="font-serif text-[clamp(36px,4.5vw,64px)] leading-[1.02] text-[color:var(--ink-primary)]">
            <MaskReveal delay={0.15}>Four case studies,</MaskReveal>
            <br />
            <MaskReveal delay={0.32}>commit hashes attached.</MaskReveal>
          </h2>
        </header>

        <ul className="border-t border-[color:var(--hairline)]">
          {featured.map((project, i) => (
            <ProjectAccordionRow
              key={project.slug}
              project={project}
              order={i}
            />
          ))}
        </ul>

        <Reveal delay={0.1} className="mt-14 flex justify-center">
          <CTALink href="/work" variant="outline">
            View all work
            <span aria-hidden>→</span>
          </CTALink>
        </Reveal>
      </div>
    </section>
  );
}
