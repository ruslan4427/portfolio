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
  {
    years: "2021 — 2023",
    role: "Product designer · PIMU Services, Cyprus",
    description:
      "Investment products, e-commerce, and mobile builds for a Cyprus product team. Ran design-to-dev handoffs and sat on FE/BE hiring panels — the muscle that later made spec-first shipping feel natural.",
  },
  {
    years: "2018 — 2021",
    role: "Product designer · Berlin Labs, Kyiv",
    description:
      "End-to-end research and design across web and mobile for investment products. Where the shipping instinct started forming.",
  },
  {
    years: "2015 — 2016",
    role: "UX/UI designer · Flynaut, Charlotte NC",
    description:
      "First US-market work. Learned early that a design only lives if the engineer holding it can defend it.",
  },
];
