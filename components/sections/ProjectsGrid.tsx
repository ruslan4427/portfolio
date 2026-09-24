import { projects } from "@/content/projects";
import { ProjectCard } from "./ProjectCard";
import { SectionBadge } from "@/components/ui/SectionBadge";

export function ProjectsGrid() {
  return (
    <section
      id="work"
      className="relative px-[var(--gutter)] py-[var(--section-py)]"
    >
      <div className="mx-auto max-w-[var(--content-max)]">
        <header className="mb-12 flex flex-col items-center gap-6 text-center">
          <SectionBadge label="Featured Projects" />
          <h2 className="font-serif text-[clamp(40px,5vw,64px)] text-[color:var(--ink-primary)]">
            Show your work.
          </h2>
        </header>
        <ul className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {projects.map((project) => (
            <li key={project.slug}>
              <ProjectCard project={project} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
