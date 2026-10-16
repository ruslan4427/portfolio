/**
 * Keyword maps for project attribution.
 * Used by scripts/attribute-sessions.mjs to classify sessions in
 * ~/.claude/projects/-Users-ruslan/ as SINGLE / MIXED / UNCLASSIFIED.
 *
 * Hit threshold: a session scores a project if the project's keywords
 * appear at least 3 times (sum across all keywords) in the session's
 * concatenated message text (lowercased).
 *
 * Reorg targets (Tier 0 — no dedicated folder yet): lexora, smm-factory,
 * angel-trucking. These sessions will be MOVED by attribute-execute.ts.
 *
 * Context targets (have dedicated folders already — tracked here only
 * so cross-reference sessions in home dir are visible in the report):
 * noble-saas, fieldmark, portfolio. These sessions will NOT be moved.
 */

export const REORG_TARGETS = ["lexora", "smm-factory", "angel-trucking"];
export const CONTEXT_TARGETS = ["noble-saas", "fieldmark", "portfolio"];

export const ATTRIBUTION_KEYWORDS = {
  lexora: [
    "lexora",
    "vocab app",
    "vocabulary app",
    "audio-first",
    "ears-only",
    "google tts",
    "gemini tts",
    "silent mp3",
    "silent-mp3",
    "ipa pronunciation",
    "monoschema",
  ],
  "smm-factory": [
    "smm-factory",
    "smm factory",
    "instagram agent",
    "social agents",
    "slack approvals",
    "approval queue",
    "content calendar agent",
  ],
  "angel-trucking": [
    "angel trucking",
    "angel-trucking",
    "dispatch agent",
    "five-stage plan",
    "trucking dispatch",
    "load board",
    "driver app",
  ],
  "noble-saas": [
    "noble-saas",
    "noble saas",
    "noble.booking",
    "barbershop",
    "booking saas",
  ],
  fieldmark: [
    "fieldmark",
    "test_plan.md",
    "crew app",
    "jobsite",
    "field marking",
  ],
  portfolio: [
    "hrekov.dev",
    "portfolio",
    "shiploop",
    "case study",
    "devlog",
  ],
};
