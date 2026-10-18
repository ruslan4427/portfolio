export type ToolImpactRow = {
  label: string;
  value: string | null;
  caption?: string;
  method?: string;
  baseline?: string;
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
    parserSource?: { label: string; href: string };
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
          method: "4-point binary: spec/plan/tasks exist in specs/<N>/ and DEVLOG.md is present.",
          baseline: "Tier-0 projects (pre-ShipLoop) score 0% — none of the four artifacts exist.",
        },
        {
          label: "Rework ratio",
          value: "0.46",
          caption: "This portfolio (hrekov-dev) under ShipLoop vs 4.5 on a tier-0 baseline.",
          method: "fix(…) commits ÷ feat(…) commits (conventional commits only, lifetime).",
          baseline: "SMM Factory tier-0 = 4.5 — ten times more rework per shipped feature.",
        },
        {
          label: "Expert hit rate",
          value: "67%",
          caption:
            "First validated capsule caught 2 of 3 blind-bugs with plan-changing findings.",
          method:
            "(expert consulted · plan changed = yes) ÷ (total consultations). Hand-counted today; DEVLOG convention not yet wired for auto-rollup.",
          baseline: "Random guess on a 3-bug test ≈ 33% — the capsule doubled that.",
        },
      ],
      parserSource: {
        label: "Inspect the parser",
        href: "https://github.com/ruslan4427/claude-shiploop/blob/main/scripts/scorecard.mjs",
      },
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
      impact: [
        {
          label: "Hero regens · avg",
          value: "1.00",
          caption:
            "Nano Banana 2 + the ink preset lands a publishable hero on the first pass. Backfilled across 4 of 4 shipped posts.",
          method:
            "Sum of heroRegenerations frontmatter ÷ posts carrying the rig (4 posts, 4 heroes).",
          baseline:
            "Generic AI illustration pipelines typically take 3–5 regens before an on-brand hero lands.",
        },
        {
          label: "QA catches · avg",
          value: null,
          caption:
            "All 4 shipped posts pre-date the rig — they carry null, not zero. The first rig-era post ships 2026-10-19.",
          method:
            "qaCatches is nullable: null = pre-rig (discipline wasn't operational), int = rig-era measurement.",
          baseline:
            "First non-null value lands Monday with shipping-claude-shiploop — the first blog post to run the formal UX pass.",
        },
        {
          label: "Serializer round-trips",
          value: "5",
          caption:
            "LinkedIn + dev.to republishes forced by UI-layer serializer bugs. Total across all shipped posts.",
          method:
            "Sum of serializerRoundTrips frontmatter — only counts republishes caused by a serializer issue, not cosmetic edits.",
          baseline:
            "3 of 4 posts shipped with 0 round-trips. The outlier (classify-before-you-code) drove the whole number.",
        },
      ],
    },
  },
];
