// Scorecard parser configuration — Portfolio copy.
//
// WHEN UPDATING: bump `configVersion` and update
// scripts/scorecard-src/scorecard.mjs::REQUIRED_CONFIG_VERSION in lockstep.
// The parser validates version mismatch at startup.
//
// Tier assignments are locked (spec §5.2). Tier is a human judgment call,
// not derived at runtime.
//
// Projects where `logPath: null` have `tokens: null` in the final scorecard
// (Tier 0 bail-out per spec §10.1). Other metrics (discipline, rework,
// time-to-ship, expert hit rate) still compute from the repo.
//
// `modelMix` and `duration` fields on each project are FALLBACKS. The
// parser overrides them with measured values when the log directory is
// readable. The fallback is used only when logPath is null (no telemetry
// to override from).

import { homedir } from "node:os";
import { join } from "node:path";

const HOME = homedir();
const CLAUDE_PROJECTS = join(HOME, ".claude/projects");

export const SCORECARD_CONFIG = {
  configVersion: 2,
  generatedAtPlaceholder: "<overridden by parser at write time>",
  projects: [
    {
      slug: "lexora",
      name: "Lexora",
      tier: 0,
      archetype: "design-tool",
      repoPath: join(HOME, "lexora"),
      githubRepo: null,
      logPath: null,
      startDate: "2026-09-12",
      shipDate: "2026-09-29",
      complexity: "M",
      modelMix: { sonnet: 85, opus: 15 },
      duration: "17 days",
      notes:
        "Pre-ShipLoop. 4/4 discipline score reflects speckit-era artifacts, not institutional ShipLoop (tier reflects the latter). Rework 0 and TTS 13d both from n=1 sample. Tokens not reconstructable from mixed home-dir sessions (bail-out triggered 2026-10-14 — see spec §10.1). githubRepo null — private repository, hygiene not independently verifiable from the public /tools reader.",
    },
    {
      slug: "noble-saas",
      name: "Noble SaaS",
      tier: 0,
      archetype: "saas-app",
      repoPath: join(HOME, "noble-saas"),
      githubRepo: { owner: "ruslan4427", repo: "noble-saas" },
      logPath: join(CLAUDE_PROJECTS, "-Users-ruslan-noble-saas"),
      startDate: "2026-04-08",
      shipDate: null,
      complexity: "L",
      modelMix: { sonnet: 70, opus: 20, haiku: 10 },
      duration: "~6 months active",
      notes:
        "Pre-ShipLoop. 1.44 rework over 171 conventional commits is the loudest pre-ShipLoop marker in the dataset. Dedicated session log exists; tokens measured from -Users-ruslan-noble-saas/.",
    },
    {
      slug: "smm-factory",
      name: "SMM Factory",
      tier: 0,
      archetype: "automation",
      repoPath: join(HOME, "smm-factory"),
      githubRepo: null,
      logPath: null,
      startDate: "2026-06-08",
      shipDate: "2026-07-04",
      complexity: "M",
      modelMix: { sonnet: 90, haiku: 10 },
      duration: "27 days",
      notes:
        "Pre-ShipLoop. Rework 4.5 from a small n=11 conventional sample (9 fix / 2 feat) — directional, not statistically robust. Tokens not reconstructable from mixed home-dir sessions (bail-out triggered 2026-10-14 — see spec §10.1). githubRepo null — private repository.",
    },
    {
      slug: "angel",
      name: "Angel Trucking",
      tier: 0,
      archetype: "saas-app",
      repoPath: join(HOME, "angel"),
      githubRepo: null,
      logPath: null,
      startDate: "2026-05-12",
      shipDate: null,
      complexity: "S",
      modelMix: { sonnet: 100 },
      duration: "scaffold only",
      notes:
        "Pre-ShipLoop. Prototype did not progress past Next.js scaffold (1 commit). Zero session hits across home-dir scan — likely never engaged Claude Code beyond initial setup. githubRepo null — not published to GitHub.",
    },
    {
      slug: "fieldmark",
      name: "Fieldmark",
      tier: 1,
      archetype: "saas-app",
      repoPath: join(HOME, "fieldmark"),
      githubRepo: null,
      logPath: join(CLAUDE_PROJECTS, "-Users-ruslan-fieldmark"),
      startDate: "2026-09-12",
      shipDate: "2026-09-19",
      complexity: "M",
      modelMix: { sonnet: 75, opus: 25 },
      duration: "8 days to App Store submission",
      notes:
        "Self-authored test_plan.md (517 lines) acted as pre-spec; no ShipLoop discipline yet. githubRepo null — private repository. Archetype saas-app covers mobile+backend products in this taxonomy; splitting into mobile-app deferred to Sprint 19+ per spec §5.1.",
    },
    {
      slug: "hrekov-dev",
      name: "Portfolio (hrekov.dev)",
      tier: 2,
      archetype: "saas-app",
      repoPath: join(HOME, "portfolio"),
      githubRepo: { owner: "ruslan4427", repo: "portfolio" },
      logPath: join(CLAUDE_PROJECTS, "-Users-ruslan-portfolio"),
      startDate: "2026-09-20",
      shipDate: null,
      complexity: "L",
      modelMix: { sonnet: 70, opus: 25, haiku: 5 },
      duration: "ongoing since 2026-09-20",
      notes: "ShipLoop active from Sprint 0 bootstrap (2026-09-20). 1-day median TTS reflects solo-operator cadence (plan → ship typically same day); n=5 specs. Reflects measurement across the owning org, not team scale.",
    },
    {
      slug: "claude-shiploop",
      name: "claude-shiploop (OSS)",
      tier: 2,
      archetype: "llm-skill",
      repoPath: join(HOME, "shiploop-publish"),
      githubRepo: { owner: "ruslan4427", repo: "claude-shiploop" },
      logPath: null,
      startDate: "2026-10-14",
      shipDate: "2026-10-16",
      complexity: "L",
      modelMix: { opus: 60, sonnet: 40 },
      duration: "3 days",
      notes:
        "Shipped 2026-10-16. Repo at github.com/ruslan4427/claude-shiploop. Tokens null because the OSS work ran inside the portfolio Claude Code session, not a dedicated session; commit-level signal via repoPath.",
    },
  ],
};
