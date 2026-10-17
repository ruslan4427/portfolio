export type ToolImpactRow = {
  label: string;
  value: string | null;
  caption?: string;
};

export type ToolBuilt = {
  slug: string;
  name: string;
  tagline: string;
  repoUrl: string;
  description: string;
  install: {
    command: string;
    caption?: string;
  };
  effectiveness: {
    why: string;
    systematizes: string;
    impact: ToolImpactRow[] | null;
    impactNote?: string;
  };
};

export const TOOLS_BUILT: ToolBuilt[] = [
  {
    slug: "claude-shiploop",
    name: "claude-shiploop",
    tagline:
      "The eight-skill discipline — a lifecycle for shipping AI-collaborated software without churn.",
    repoUrl: "https://github.com/ruslan4427/claude-shiploop",
    description:
      "Seven slash commands plus a domain-expert subagent that turn Claude Code from a code generator into a shipping protocol. Classifies every request, gates every build behind a spec, and leaves receipts (DEVLOG, memory, retro) in your repo — not in a chat window.",
    install: {
      command:
        "curl -sSL https://raw.githubusercontent.com/ruslan4427/claude-shiploop/main/install.sh | bash",
      caption:
        "Writes to ~/.claude/{skills,agents,templates}. Prefer clone-and-inspect if auditing first.",
    },
    effectiveness: {
      why: "Claude without discipline codes immediately on every request. Discipline — classify, spec, plan, task, build, retro — is what separates vibes from engineering.",
      systematizes:
        "Every incoming request runs through the 10-lane classifier before touching code. Every L-class feature produces spec+plan+tasks on disk. Every build iteration appends to DEVLOG. The protocol is the artifact, not another chat log.",
      impact: [
        {
          label: "Discipline",
          value: "100%",
          caption: "On tier-2 (ShipLoop) runs: spec + plan + tasks + DEVLOG present.",
        },
        {
          label: "Rework ratio",
          value: "0.36",
          caption: "This portfolio (hrekov-dev) under ShipLoop vs 4.5 on a tier-0 baseline.",
        },
        {
          label: "Expert hit rate",
          value: "67%",
          caption:
            "First validated capsule caught 2 of 3 blind-bugs with plan-changing findings.",
        },
      ],
    },
  },
  {
    slug: "ui-ux-pro",
    name: "ui-ux-pro",
    tagline:
      "A UI/UX skill that extracts your project's tokens first — then brings in current design thinking without breaking your system.",
    repoUrl: "https://github.com/ruslan4427/ui-ux-pro",
    description:
      "Two jobs. Keep a project's own design system consistent (extract tokens from CLAUDE.md / @theme / :root / tailwind.config, work inside them, never invent a new palette for a project that already has one). And bring in current design thinking — curated palettes, typography pairings, trend references — behind an opt-in style selector (minimalist / brutalist / Lusion).",
    install: {
      command: "git clone https://github.com/ruslan4427/ui-ux-pro.git ~/.claude/skills/ui-ux-pro",
      caption: "No network at runtime. Two Python helpers for contrast and token extraction.",
    },
    effectiveness: {
      why: "AI design output drifts toward generic SaaS unless something forces it to read the project's existing system before suggesting a palette or font.",
      systematizes:
        "Four-section method: tokens first, contrast gate, visual verification in the browser, then current design thinking. Style overrides are opt-in — defaults aim for a broadly safe editorial result.",
      impact: null,
      impactNote:
        "No retroactive measurement — the skill shipped alongside this portfolio redesign but there's no clean pre/post session to compare. Will backfill when a measurement rig lands.",
    },
  },
];
