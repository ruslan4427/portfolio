import { Hero } from "@/components/sections/Hero";
import { SelectedWork } from "@/components/sections/SelectedWork";
import { Services } from "@/components/sections/Services";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Benefits } from "@/components/sections/Benefits";
import { ExperienceMini } from "@/components/sections/ExperienceMini";
import { Testimonials } from "@/components/sections/Testimonials";

export default function Home() {
  return (
    <main id="main">
      <Hero />
      <SelectedWork />
      <Services />
      <HowItWorks />
      <Benefits />
      <ExperienceMini />
      <Testimonials />
    </main>
  );
}
