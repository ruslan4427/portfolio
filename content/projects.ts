export type Project = {
  slug: string;
  index: string;
  name: string;
  tagline: string;
  role: string;
  stack: string[];
  year: string;
  status: "shipped" | "in-review" | "in-progress" | "sprint-4";
  metric: string;
  span: "wide" | "tall" | "square";
  featured?: boolean;
};

export const projects: Project[] = [
  {
    slug: "noble-saas",
    index: "01",
    name: "Noble",
    tagline: "Booking SaaS for solo barbershops — 227 commits, one frozen file.",
    role: "Full build · solo",
    stack: ["Next.js 16", "Supabase", "Stripe", "Twilio", "GitHub Actions"],
    year: "2026",
    status: "shipped",
    metric: "151 commits in first 10 days · 16 named bugs, 0 regressed",
    span: "wide",
    featured: true,
  },
  {
    slug: "angel",
    index: "02",
    name: "Angel Trucking",
    tagline: "Five-stage AI pipeline before a single production line of code.",
    role: "Client · lead",
    stack: ["Next.js", "Supabase", "Cookie-auth", "FCM"],
    year: "2026",
    status: "sprint-4",
    metric: "3 sprints shipped, zero rewrites",
    span: "square",
  },
  {
    slug: "fieldmark",
    index: "03",
    name: "Fieldmark",
    tagline: "PDF floor plan → live installation checklist. Rejected & resubmitted in 18h.",
    role: "Personal · solo",
    stack: ["Flutter", "Riverpod", "Supabase", "FCM"],
    year: "2026",
    status: "in-review",
    metric: "7 days empty repo to App Review",
    span: "tall",
  },
  {
    slug: "lexora",
    index: "04",
    name: "Lexora",
    tagline: "Vocabulary that plays like a podcast — eyes anywhere but the phone.",
    role: "Personal · solo",
    stack: ["Flutter", "Supabase", "Google TTS", "Gemini 3.6"],
    year: "2026",
    status: "in-review",
    metric: "12 languages · 61 unit tests · 5 silent MP3s",
    span: "square",
  },
  {
    slug: "smm-factory",
    index: "05",
    name: "smm-factory",
    tagline: "An Instagram team of zero humans. Eight agents, three-tap Slack approval.",
    role: "Personal · solo",
    stack: ["Claude Opus/Sonnet/Haiku", "Playwright", "FFmpeg", "GH Actions"],
    year: "2026",
    status: "in-progress",
    metric: "40 posts · 0 violations · $0.40/wk to run",
    span: "wide",
  },
];
