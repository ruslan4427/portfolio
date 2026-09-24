import { DotGrid } from "@/components/canvas/DotGrid";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { ProjectsGrid } from "@/components/sections/ProjectsGrid";
import { AboutStack } from "@/components/sections/AboutStack";

export default function Home() {
  return (
    <>
      <DotGrid />
      <div className="relative z-10">
        <Nav />
        <main id="main">
          <Hero />
          <ProjectsGrid />
          <AboutStack />
        </main>
        <Footer />
      </div>
    </>
  );
}
