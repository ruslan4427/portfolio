import { Hero } from "@/components/sections/Hero";
import { getBlogPosts } from "@/content/blog";
import { projects } from "@/content/projects";
import { TOOLS_BUILT } from "@/content/tools-built";
import { SelectedWork } from "@/components/sections/SelectedWork";
import { Services } from "@/components/sections/Services";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Benefits } from "@/components/sections/Benefits";
import { ExperienceMini } from "@/components/sections/ExperienceMini";
import { Testimonials } from "@/components/sections/Testimonials";

export default async function Home() {
  const posts = await getBlogPosts();
  const counts = [
    { value: projects.length, label: "case studies", href: "/work" },
    { value: TOOLS_BUILT.length, label: "open-source tools", href: "/tools" },
    { value: posts.length, label: "journal entries", href: "/blog" },
  ];

  return (
    <main id="main">
      <Hero counts={counts} />
      <SelectedWork />
      <Services />
      <HowItWorks />
      <Benefits />
      <ExperienceMini />
      <Testimonials />
    </main>
  );
}
