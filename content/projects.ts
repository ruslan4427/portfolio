export type ProjectRoleTag =
  | "frontend"
  | "full-stack"
  | "cto"
  | "consulting";
export type ProjectStackTag = "react" | "next" | "flutter" | "node" | "ai";

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
  roleTags?: ProjectRoleTag[];
  stackTags?: ProjectStackTag[];
};

export const projects: Project[] = [
  {
    slug: "hrekov-dev",
    index: "01",
    name: "hrekov-dev",
    tagline: "The portfolio that documents itself — thirty memory files, one recursive proof.",
    role: "Meta · solo build",
    stack: [
      "Next.js 16",
      "React 19",
      "TypeScript",
      "Tailwind v4",
      "Claude Opus",
      "Framer Motion",
    ],
    year: "2026",
    status: "shipped",
    metric: "30 memory files · 10 promoted rules",
    span: "wide",
    featured: true,
    roleTags: ["full-stack"],
    stackTags: ["next", "ai"],
  },
  {
    slug: "noble-saas",
    index: "02",
    name: "Noble",
    tagline: "Booking SaaS for solo barbershops — 234 commits, one frozen file.",
    role: "Full build · solo",
    stack: ["Next.js 16", "Supabase", "Stripe", "Twilio", "GitHub Actions"],
    year: "2026",
    status: "shipped",
    metric: "74 commits in 10 days to live bookings · 16 named bugs, 0 regressed",
    span: "wide",
    featured: true,
    roleTags: ["full-stack"],
    stackTags: ["next", "react", "node"],
  },
  {
    slug: "angel",
    index: "03",
    name: "Angel Trucking",
    tagline: "Five-stage AI pipeline before a single production line of code.",
    role: "Client · lead",
    stack: ["Next.js", "Supabase", "Cookie-auth", "FCM"],
    year: "2026",
    status: "sprint-4",
    metric: "3 sprints shipped, zero rewrites",
    span: "square",
    featured: true,
    roleTags: ["cto", "consulting", "full-stack"],
    stackTags: ["next", "react", "ai"],
  },
  {
    slug: "fieldmark",
    index: "04",
    name: "Fieldmark",
    tagline: "PDF floor plan → live installation checklist. Rejected & resubmitted in 18h.",
    role: "Personal · solo",
    stack: ["Flutter", "Riverpod", "Supabase", "FCM"],
    year: "2026",
    status: "shipped",
    metric: "7 days empty repo to App Store · live with 3 foreman crews",
    span: "tall",
    roleTags: ["full-stack"],
    stackTags: ["flutter"],
  },
  {
    slug: "lexora",
    index: "05",
    name: "Lexora",
    tagline: "Vocabulary that plays like a podcast — eyes anywhere but the phone.",
    role: "Personal · solo",
    stack: ["Flutter", "Supabase", "Google TTS", "Gemini 3.6"],
    year: "2026",
    status: "in-review",
    metric: "12 languages · 76 unit tests · 5 silent MP3s",
    span: "square",
    roleTags: ["full-stack"],
    stackTags: ["flutter", "ai"],
  },
  {
    slug: "smm-factory",
    index: "06",
    name: "smm-factory",
    tagline: "An Instagram team of zero humans. Eight agents, three-tap Slack approval.",
    role: "Personal · solo",
    stack: ["Claude Opus/Sonnet/Haiku", "Playwright", "FFmpeg", "GH Actions"],
    year: "2026",
    status: "shipped",
    metric: "40 posts over 2-month pilot · 0 violations · $0.40/wk to run",
    span: "wide",
    featured: true,
    roleTags: ["full-stack"],
    stackTags: ["ai", "node"],
  },
];
