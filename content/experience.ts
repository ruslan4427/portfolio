export type ExperienceEntry = {
  years: string;
  role: string;
  description: string;
};

// TODO(ruslan): tighten dates + descriptions to match your real timeline.
export const experience: ExperienceEntry[] = [
  {
    years: "2026 — now",
    role: "Solo studio · AI-collaborative software",
    description:
      "Shipping five production case studies with Claude as pair. Every build ships spec + plan + DEVLOG. ShipLoop discipline as the operating system.",
  },
  {
    years: "2025 — 2026",
    role: "First Claude-collaborative production builds",
    description:
      "Noble booking SaaS, Angel Trucking pipeline, Fieldmark PDF-to-checklist. Learned the frozen-logic discipline the hard way — refactored what I would have shipped.",
  },
  {
    years: "2024 — 2025",
    role: "Prompt patterns · internal automation",
    description:
      "Built early Opus/Sonnet/Haiku routing rigs and volume automation for small teams. First contact with the “spec before code” instinct.",
  },
  {
    years: "2022 — 2024",
    role: "Full-stack engineering · remote (Kyiv → Ohio)",
    description:
      "Next.js + Supabase + Stripe stacks for boutique clients. Learned to measure everything and to trust commit hashes over screenshots.",
  },
];
