import { Stagger, StaggerItem } from "@/components/ui/Stagger";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { caseLenses } from "@/content/case-lenses";
import { projects } from "@/content/projects";
import { ProjectCard } from "./ProjectCard";

const featured = projects.filter((p) => p.featured);
const WORDS = ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten"];

export function SelectedWork() {
  return (
    <section id="work" aria-labelledby="work-heading" className="relative px-[var(--gutter)] py-[var(--section-py)]">
      <div className="mx-auto max-w-[var(--content-max)]">
        <SectionHeader
          id="work-heading"
          eyebrow={`Cases · ${featured.length} of ${projects.length}`}
          title={`${WORDS[featured.length] ?? featured.length} builds, receipts attached.`}
          lede="Commit hashes, DEVLOGs and the decisions that made or broke each build."
          link={{ href: "/work", label: `All ${projects.length} cases` }}
        />
        <Stagger as="ul" className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {featured.map((project) => (
            <StaggerItem as="li" key={project.slug} className="h-full">
              <ProjectCard project={project} total={projects.length} lens={caseLenses[project.slug]} />
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
