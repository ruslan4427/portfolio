// Reading-lens content for case studies (Sprint 20). Keyed by case slug.
// Every number here is restated from the case's MDX or content/projects.ts —
// add nothing that the case body doesn't already claim.

export type Lens = "founder" | "hiring" | "engineer";

export const LENSES: readonly Lens[] = ["founder", "hiring", "engineer"];

export const lensLabel: Record<Lens, string> = {
  founder: "Founder",
  hiring: "Hiring manager",
  engineer: "Engineer",
};

export type LensStat = { label: string; value: string };

export type LensCta = { title: string; body: string; label: string; href: string };

export type LensView = {
  headline: string;
  stats: [LensStat, LensStat, LensStat, LensStat];
  cta?: Partial<LensCta>;
};

export type CaseLensData = {
  statusLabel: string;
  glance: { problem: string; outcome: string; time: string; timeNote: string };
  lenses: Record<Lens, LensView>;
};

export const lensIntro: Record<Lens, string> = {
  founder: "For a founder — cost, outcome, time",
  hiring: "For a hiring manager — scope, ownership, judgement",
  engineer: "For an engineer — architecture and the hard parts",
};

// Which ## section each lens should start from: first heading matching wins.
export const lensStartHere: Record<Lens, RegExp> = {
  founder: /problem|results|what the machine produced/i,
  hiring: /division of labor|iteration|what i|discipline/i,
  engineer: /prompt architecture|trade-?offs|persistence|how to steal/i,
};

export function defaultCta(lens: Lens, title: string): LensCta {
  switch (lens) {
    case "founder":
      return {
        title: `Have a ${title}-sized problem?`,
        body: "Send one paragraph about it. I reply within two business days with a scope and a fixed price.",
        label: "Book a similar build",
        href: "/contact?intent=fractional",
      };
    case "hiring":
      return {
        title: "Looking for someone who owns the whole build?",
        body: "Open to full-time roles where product judgement matters as much as code.",
        label: "Discuss full-time",
        href: "/contact?intent=full-time",
      };
    case "engineer":
      return {
        title: "Want the patterns, not just the story?",
        body: "Commit trail, specs and DEVLOG are public. Happy to talk shop.",
        label: "See how it was made",
        href: "#how-it-was-made",
      };
  }
}

const s = (label: string, value: string): LensStat => ({ label, value });

export const caseLenses: Record<string, CaseLensData> = {
  "hrekov-dev": {
    statusLabel: "Shipped",
    glance: {
      problem:
        "A language model doesn’t remember. Every session starts blank, so multi-session work either burns the first half hour re-explaining, or needs a memory around the model.",
      outcome: "A site that is its own proof: every decision dated, every rule earned, all of it public.",
      time: "21 sprints",
      timeNote: "27 active days · live at hrekov.dev",
    },
    lenses: {
      founder: {
        headline: "How work on your project would actually happen — written down, dated and walkable.",
        stats: [s("Sprints", "21"), s("Memory files", "46"), s("Rules promoted", "11"), s("Ramp-up saved", "~1 h")],
        cta: { title: "Want this workflow on your project?", label: "Book a fractional call" },
      },
      hiring: {
        headline: "A solo build that keeps its own memory: every decision dated, every rule earned.",
        stats: [s("DEVLOG entries", "71"), s("Promoted", "15.5%"), s("Active days", "27"), s("Case studies", "6")],
      },
      engineer: {
        headline: "A persistence layer for a stateless model: typed memory, a one-line index, a promotion gate.",
        stats: [s("Tokens", "~61.9M"), s("Model", "Opus"), s("Request classes", "9"), s("Files / session", "2–3")],
        cta: {
          title: "Steal the pattern.",
          body: "Four primitives, each small enough to adopt in an afternoon.",
          label: "Read “How to steal it”",
          href: "#9-how-to-steal-it",
        },
      },
    },
  },
  lexora: {
    statusLabel: "Shipped · App Store",
    glance: {
      problem:
        "Learners already have vocabulary in Quizlet, Anki or a sheet — but every app needs eyes on the screen. Commutes, runs and chores don’t allow that.",
      outcome: "Word-pair playlists that play from the lock screen, offline, in 12 languages.",
      time: "17 days",
      timeNote: "2026-08-30 → 2026-09-29 · live on the App Store",
    },
    lenses: {
      founder: {
        headline: "A vocabulary app you use with your eyes closed — playlists that play from the lock screen, offline.",
        stats: [s("Languages", "12"), s("Built in", "17 days"), s("New playlist", "~1.5 s"), s("Status", "App Store")],
      },
      hiring: {
        headline: "Shipped solo to the App Store in 17 days, with a spec before every feature.",
        stats: [s("Unit tests", "76"), s("Days", "17"), s("Custom skills", "17"), s("Languages", "12")],
      },
      engineer: {
        headline: "Background audio, an offline MP3 cache with generated silences, and one enforced build path.",
        stats: [s("Voices", "Neural2"), s("Silent MP3s", "5"), s("Model", "Sonnet 85%"), s("Gen latency", "~1.5 s")],
      },
    },
  },
  fieldmark: {
    statusLabel: "Shipped · App Store",
    glance: {
      problem:
        "Installer crews work off paper plans and texts; the foreman chases status by phone all day, and signal dies in mechanical rooms.",
      outcome: "The PDF becomes the task list — pins are tasks, and it works offline.",
      time: "7 days",
      timeNote: "empty repo → App Store · live with 3 foreman crews",
    },
    lenses: {
      founder: {
        headline: "Your PDF floor plan becomes a live checklist — pins are tasks, and it works with no signal.",
        stats: [s("To App Store", "7 days"), s("Crews live", "3"), s("Fix after rejection", "18 h"), s("Offline", "yes")],
      },
      hiring: {
        headline: "Empty repo to App Store in 7 days, through a rejection, now used by real crews.",
        stats: [s("Days to ship", "7"), s("Crews", "3"), s("Bugs fixed", "3 / 3"), s("Rejections", "1 → fixed")],
      },
      engineer: {
        headline: "Offline-first Flutter, crew-scoped RLS, and a native Sign in with Apple rewrite in five files.",
        stats: [s("Tokens", "~82.7M"), s("Model", "Opus 89%"), s("Files changed", "5"), s("Active days", "4")],
      },
    },
  },
  "smm-factory": {
    statusLabel: "Pilot complete",
    glance: {
      problem:
        "Noble needed Instagram credibility to win barbershops. A specialist costs $2–3K a month, an agency $5K+, and founder-posting collapses by week two.",
      outcome: "40 posts in two months at about $0.40 a week — with every taste call still human.",
      time: "2-month pilot",
      timeNote: "built in 27 days · pilot 2026-07 → 2026-08",
    },
    lenses: {
      founder: {
        headline: "An Instagram team of zero humans for about $0.40 a week — you approve in three taps.",
        stats: [s("Cost", "$0.40/wk"), s("Posts", "40"), s("Violations", "0"), s("Approval", "3 taps")],
      },
      hiring: {
        headline: "Designed an eight-agent system, ran it for two months, then reported the result honestly.",
        stats: [s("Agents", "8"), s("Pilot", "2 months"), s("Followers", "0 → 13"), s("Built in", "27 days")],
      },
      engineer: {
        headline: "Model stratification cut cost 20×; reels render deterministically, frame by frame.",
        stats: [s("Cost cut", "~20×"), s("Render", "30 fps"), s("Spec files", "12"), s("Model", "Sonnet 90%")],
      },
    },
  },
  "noble-saas": {
    statusLabel: "Shipped",
    glance: {
      problem:
        "A solo barber loses 20–30% of bookings to no-shows. The tools that fix it cost more than the revenue they save.",
      outcome: "$15 a month against ~$2,600 a month in no-shows — about 170× payback.",
      time: "10 days",
      timeNote: "empty repo → live bookings · 234 commits since April",
    },
    lenses: {
      founder: {
        headline: "Booking and SMS reminders for solo barbershops at $15 a month — against ~$2,600 lost to no-shows.",
        stats: [s("Price", "$15/mo"), s("Payback", "~170×"), s("Setup", "5 min"), s("To live", "10 days")],
      },
      hiring: {
        headline: "A full product, built solo: empty repo to live multi-tenant SaaS in ten days, then hardened.",
        stats: [s("Commits", "234"), s("To live", "10 days"), s("Bugs fixed", "16 · 0 back"), s("Shipping", "5+ months")],
      },
      engineer: {
        headline: "Tenant isolation in Postgres RLS, a server-seeded slot map, and one file that forbids refactors.",
        stats: [s("Codebase", "~10k LOC"), s("TS files", "73"), s("Model", "Sonnet 98%"), s("Tokens", "~26.4M")],
      },
    },
  },
  angel: {
    statusLabel: "Pre-launch",
    glance: {
      problem:
        "A ~100-truck Ohio carrier runs hiring, its maintenance shop, a marketplace and fleet ops in four disconnected systems — none usable from a cab with no signal.",
      outcome: "One platform for all four jobs, designed so every feature follows the same five-role pipeline.",
      time: "4 sprints",
      timeNote: "built against one scaffold · go-live is deployment",
    },
    lenses: {
      founder: {
        headline: "One system for four trucking jobs — hiring, shop, marketplace, fleet — usable from a phone in a cab.",
        stats: [s("Modules", "4"), s("People", "~150"), s("Trucks", "~100"), s("Status", "pre-launch")],
      },
      hiring: {
        headline: "Client lead on a four-module platform, with the delivery pipeline designed before the first feature.",
        stats: [s("Sprints", "4"), s("Role contracts", "5"), s("Checklist", "27/27"), s("Rewrites", "0")],
      },
      engineer: {
        headline: "A five-role agent pipeline: spec plus one file, never the whole codebase.",
        stats: [s("Roles", "5"), s("Commits pushed", "1"), s("Target", "375px"), s("Model", "Sonnet")],
      },
    },
  },
};

export function parseLens(value: string | null | undefined): Lens | null {
  return value === "founder" || value === "hiring" || value === "engineer" ? value : null;
}
