export type Service = {
  id: string;
  name: string;
  format: string;
  outcome: string;
  scope: string[];
  investment: string;
  intent: "fractional" | "advisory";
};

// TODO(ruslan): confirm investment ranges before shipping — all currently "TBD".
export const services: Service[] = [
  {
    id: "discovery-sprint",
    name: "Discovery Sprint",
    format: "2 weeks · fixed",
    outcome:
      "Technical + product assessment, a prioritized roadmap, and one working spike on the highest-risk unknown.",
    scope: [
      "Codebase + product review, async and live",
      "30/60/90-day roadmap with sequenced bets",
      "Working spike so the roadmap ships against reality",
      "Written handover the team can act on next Monday",
    ],
    investment: "TBD",
    intent: "fractional",
  },
  {
    id: "fractional-cto",
    name: "Fractional CTO / Tech Lead",
    format: "2 days/week · monthly retainer",
    outcome:
      "Shipped features, unblocked engineers, and a technical direction your team owns after I’m out.",
    scope: [
      "Roadmap + prioritization with founders",
      "Hands-on architecture, code review, PRs",
      "Hiring loop design + technical interviewing",
      "1:1s and pairing with senior engineers as needed",
    ],
    investment: "TBD",
    intent: "fractional",
  },
  {
    id: "build-partner",
    name: "Build Partner (AI-first)",
    format: "1–3 months · milestone",
    outcome:
      "A concrete deliverable shipped together — MVP, migration, or rewrite — with AI collaboration baked in.",
    scope: [
      "Spec + plan + tasks before any code",
      "Full-stack build alongside your team",
      "AI-collaboration patterns (frozen logic, model tiering)",
      "Playbook so your team keeps shipping after I leave",
    ],
    investment: "TBD",
    intent: "fractional",
  },
  {
    id: "rescue-audit",
    name: "Rescue Audit",
    format: "1 week · fixed",
    outcome:
      "Root-cause report and a patch plan for a project that’s stuck, drifting, or missing milestones.",
    scope: [
      "System + team observation (async + live)",
      "Root-cause diagnosis, not symptom triage",
      "Sequenced patch plan with owners and dates",
      "Optional: I ship the first patch myself",
    ],
    investment: "TBD",
    intent: "fractional",
  },
  {
    id: "advisory",
    name: "Advisory",
    format: "Hourly · capped monthly",
    outcome:
      "A sounding board for teams that need senior judgment, not hands on keys.",
    scope: [
      "Weekly 60-min sessions (or on-call windows)",
      "Async review of specs, PRs, and roadmaps",
      "Warm-context introductions when I can make them",
      "Retained context — I stay warm on your project",
    ],
    investment: "TBD",
    intent: "advisory",
  },
];
