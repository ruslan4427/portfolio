# Spec — Sprint 17 · UI-rework dimension (ui-ux-pro measurement rig)

**Class.** L (new data schema in post frontmatter + backfill across shipped posts + new scorecard display + updates to `/tools` EffectivenessBlock + methodology copy)
**Date.** 2026-10-17
**Owner.** Ruslan (decisions, backfill judgement), Claude Opus (spec/plan), Claude Sonnet (implementation).

---

## 1. Why this exists

Sprint 16 shipped `/tools` with two tool cards. `claude-shiploop` has three measured impact rows pulled from `scorecard.json`. `ui-ux-pro` has `impact: null` and an `impactNote`: *"No retroactive measurement — the skill shipped alongside this portfolio redesign but there's no clean pre/post session to compare. Will backfill when a measurement rig lands."*

That rig did not exist in Sprint 16. It exists now, informally, in a memory file I added two turns ago: a per-post UI-rework ledger covering hero regenerations, figure revisions, tone fixes, QA catches, and serializer round-trips. The rig has one problem — it lives in `~/.claude/projects/-Users-ruslan-portfolio/memory/`, not in the portfolio repo. The scorecard parser can't see it, the `/tools` page can't surface it, and nothing checks that I actually record it before shipping a post.

Sprint 17 moves the rig into the repo, backfills it across shipped posts where reconstruction is honest, and wires the aggregate into the `ui-ux-pro` EffectivenessBlock so the dash becomes a number.

## 2. What must stay the same

- Monochrome editorial. No new chromatic accents in any new UI.
- `null-is-honest`. Posts whose UI-rework can't be reconstructed stay null; the aggregate excludes them, and the methodology block says so plainly.
- Scorecard data pipeline convention: canonical parser in `~/shiploop-publish/lib/`, mirror in `scripts/scorecard-src/`, regenerate `scorecard.json`, additive-only schema changes.
- `verify:numbers` prebuild hook — any UI-rework number that appears in copy gets verified at build time.
- `EffectivenessBlock` component architecture from Sprint 16 — this sprint only adds impact rows + reorganises `impactNote` wording. No new component.
- Blog post frontmatter stays validatable in `content/blog.ts`. New field is optional; existing posts without it don't throw.
- `MEMORY.md` `reference_blog_post_flow.md` entry stays as the authoring-flow doc; it points at the repo location of the rig after this sprint, not at itself.

## 3. Scope

### In

1. **Frontmatter schema.** Add optional `uiRework` object to `BlogFrontmatter` in `content/blog.ts`, with validator. Shape: `{ heroRegenerations, figureRevisions, toneFixes, qaCatches, serializerRoundTrips }`.
2. **Backfill.** Author `uiRework` into every shipped blog post where reconstruction is honest (git history + working memory + distribution ledger). Posts where reconstruction isn't honest get the field omitted entirely (not zeroed).
3. **Scorecard parser extension.** Canonical parser in `~/shiploop-publish/lib/` reads `content/blog/*.mdx` for the `hrekov-dev` project only, aggregates UI-rework counts across posts with non-null `uiRework`, emits new `uiRework` block in `scorecard.json`.
4. **EffectivenessBlock impact rows for `ui-ux-pro`.** Replace `impact: null` with three rows pulled from the aggregate: average hero regenerations, average QA catches per post, serializer round-trips total. `impactNote` becomes a methodology pointer, not an excuse.
5. **Methodology addition.** Add a new entry to the `/tools` methodology surface (reusing Sprint 16 patterns if any) explaining what UI-rework measures, where it's recorded, and the null rule for pre-Sprint-17 posts.
6. **Memory update.** `reference_blog_post_flow.md` gets a one-line pointer: "Rig is in post frontmatter under `uiRework` — see `content/blog.ts`." The ad-hoc fields list stays as the authoring checklist.

### Out

- Per-post scorecard display on individual blog posts. The number lives in frontmatter; the aggregate shows on `/tools`. No new in-post component.
- Project-level dimension on `TokenScorecardHero`. UI-rework is scoped to `ui-ux-pro` effectiveness, not every case-study hero. If this generalises later, that's a separate sprint.
- Automatic measurement. The rig is author-recorded. Automating hero-regeneration counts via git log of `public/blog/<slug>/hero.jpg` is possible but excluded — it would miss toneFixes and QA catches, which are the honest signals.
- Backfilling posts that pre-date the rig memory with made-up numbers. If I can't reconstruct from git + ledger + memory, the post stays null.
- Changing `claude-shiploop` effectiveness rows. Those stay as-is.

## 4. Audience impact

- **Claude-devs** (secondary) — `ui-ux-pro` goes from "trust me, it works" to a measurable claim. The dash was honest but weak; three numbers plus a methodology pointer is a meaningfully better install pitch.
- **Recruiters** (primary) — the pair of tools on `/tools` now reads symmetrically: both have receipts, both have null-honest handling for things that weren't measurable, both link out to the parser that generated the numbers.
- **Self** — the rig becomes enforceable. If `uiRework` isn't in a new post's frontmatter, the pre-commit check or at least the publish workflow surfaces it. Memory + flow doc remain the authoring guide, but the gate is now in the codebase.

## 5. Design decisions (resolved during spec)

### 5.1 Source of truth is post frontmatter, not iteration-N.md

Rig lives in `content/blog/<slug>.mdx` frontmatter under `uiRework`. iteration-N.md is informal/working, not scanned by any parser.

Rationale: iteration-N.md is in `~/.claude/projects/` — outside the portfolio repo, invisible to scorecard parser, impossible to backfill from git. Frontmatter is the only location that is (a) in the repo, (b) per-post, (c) already parsed by the loader. If the author stops recording UI-rework in frontmatter, the aggregate degrades visibly instead of silently.

Rejected: separate `data/ui-rework.jsonl` file (duplicates frontmatter responsibility, two places to update), git-log heuristics (misses toneFixes and QA catches entirely).

### 5.2 Field shape

```ts
uiRework?: {
  heroRegenerations: number;
  figureRevisions: { figure: string; revisions: number }[];
  toneFixes: number;
  qaCatches: number;
  serializerRoundTrips: number;
};
```

`figureRevisions` is an array because per-figure granularity is the honest unit — one post might have 1-rev hero + 4-rev FlowSchema; collapsing to an average would hide the signal.

Rejected: single aggregate number per post ("rework score 7"). Can't tell signal from noise, and would require weighting choices that aren't justified by data.

### 5.3 Null posts are omitted from aggregate, not zeroed

Posts without `uiRework` in frontmatter are excluded from the aggregate denominator. Methodology block states: "Backfilled across N of M posts; the M−N others pre-date the rig and are honestly unknown."

Rejected: treating missing-rig posts as "zero rework" (dishonest, inflates the metric), as "assume average" (invents data), as "exclude post entirely" (loses the post count context).

### 5.4 Three impact rows on EffectivenessBlock, not five

The frontmatter has five fields but EffectivenessBlock gets:

1. **Avg hero regenerations** — tightest signal on brief-clarity. Low number = brief → image → done in one pass.
2. **Avg QA catches / post** — the WIN metric. Issues the ui-ux-pro step caught before commit. High number = rig is earning its slot.
3. **Serializer round-trips** — total count across all tracked posts. 0 = ideal. Any count above shows missing renderer primitives.

`figureRevisions` and `toneFixes` are tracked in frontmatter + visible to anyone reading the raw file but don't surface as a public impact row. Rationale: they're useful internally but noisy as a single number — a 4-rev figure doesn't mean the skill failed, it might mean the author chose a hard illustration.

### 5.5 Measurement window: Sprint 11 onward

Blog foundation shipped Sprint 11 (2026-09-26). Posts before that don't exist. Posts from Sprint 11 onward are candidates for backfill. Shipped posts eligible for backfill (per `content/blog/schedule.yml` + ledger):

- `launching-the-journal` (2026-09-30) — likely backfillable: hero + 0-few figures
- `shipping-the-cross-poster` (2026-10-01) — likely backfillable
- `no-company-no-api` (2026-10-07) — likely backfillable
- `classify-before-you-code` (2026-10-17) — backfillable, fresh in memory
- `shipping-claude-shiploop` (scheduled 2026-10-19) — fill before Monday ship, not retroactive

Decision per post made during backfill (phase 2 of implementation plan): if git history + distribution ledger + working memory don't produce a defensible count, leave the field off. Expected N: 4 or 5 of 5, not fewer.

## 6. Non-decisions (deferred)

- Pre-commit hook that fails commit if a new post lacks `uiRework`. Rig needs to prove itself in regular use before gating.
- Automated hero-regeneration counting via git log of `public/blog/<slug>/hero.jpg`. Possible but misses the other four fields; revisit when there's evidence author-recorded numbers drift from reality.
- Visualisation of UI-rework trend over time (sparkline on `/tools`). Not with 4-5 data points.
- Extending the rig to case-study MDX. UI-rework is defined relative to blog posts' visual-heavy structure; case studies have different artifact types.
- Promoting UI-rework to `TokenScorecardHero` as a general project dimension. Only matters for projects that produce visual content as a primary output — currently only hrekov-dev.

## 7. Success criteria

1. `content/blog.ts` has `uiRework` optional field + validator, and loader doesn't throw on posts with or without it.
2. At least 4 of 5 shipped-eligible posts have `uiRework` in frontmatter, each number traceable to git log, distribution ledger, or a dated memory entry.
3. `scorecard.json` has a new `uiRework` block for `hrekov-dev` with three aggregates: avg hero regenerations, avg QA catches, total serializer round-trips. Backfill count is explicit (e.g. `backfilledFrom: 4, totalEligible: 5`).
4. `content/tools-built.ts` `ui-ux-pro.effectiveness.impact` is non-null and has exactly three rows matching §5.4.
5. `impactNote` no longer reads as an excuse — it points at the methodology surface or the parser.
6. Methodology block (or inline on `ui-ux-pro` card) explains the three numbers, where they come from, and the null-is-honest rule for pre-rig posts.
7. `/tools` renders with monochrome + green dot only (no new accents).
8. Contrast verified on every new fg/bg pair in the new rows.
9. `verify:numbers` passes; any UI-rework number in copy is sourced from `scorecard.json`.
10. Scorecard snapshot CI stays green; schema change is additive.
11. `reference_blog_post_flow.md` memory updated to point at frontmatter rig as source of truth, not at itself.
