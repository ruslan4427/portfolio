# Plan — Sprint 17 · UI-rework dimension

**Spec.** `specs/17-ui-rework-dimension/spec.md`
**Date.** 2026-10-17
**Target branch.** `sprint-17-ui-rework-dimension` (new).

---

## Architecture at a glance

```
content/blog/<slug>.mdx            frontmatter.uiRework = { ... }
       │
       ▼
content/blog.ts                     parse + validate uiRework (optional)
       │
       ▼
~/shiploop-publish/lib/parse-blog-ui-rework.ts   (new, canonical)
       │                            reads content/blog/*.mdx of a project,
       │                            aggregates: avgHeroRegens, avgQaCatches,
       │                            totalSerializerRoundTrips, backfilledFrom,
       │                            totalEligible
       ▼
scorecard.json                      hrekov-dev.uiRework = { ... }  (additive)
       │
       ▼
content/tools-built.ts              ui-ux-pro.effectiveness.impact
                                    reads from scorecard.json at author time
                                    (no runtime JSON import — numbers inline
                                    via a build-time generator or a direct
                                    import; decision §A4 below)
       │
       ▼
components/tools/ToolCard.tsx       renders impact rows (Sprint 16 code,
                                    no changes needed)
```

## A. Decisions

### A1. Shape in frontmatter

```yaml
uiRework:
  heroRegenerations: 2
  figureRevisions:
    - figure: ledger
      revisions: 1
  toneFixes: 1
  qaCatches: null      # null = post pre-dates the rig; the pass didn't exist
                       # integer ≥ 0 for posts that went through the rig
  serializerRoundTrips: 0
```

- When `uiRework` is present: four fields are required integers ≥ 0 (heroRegenerations, toneFixes, serializerRoundTrips, each `figureRevisions[].revisions`).
- `qaCatches` is required but accepts `null`. Rationale: zero QA catches on a pre-rig post is dishonest (no measurement happened). `null` is the honest answer and composes cleanly with the aggregate (null-is-honest).
- `figureRevisions` is an array; empty array = no figures beyond hero.

### A2. Where "QA catches" counts

Per spec §5.4, qaCatches is the WIN metric: issues that the `ui-ux-pro` step surfaced *before* commit (contrast fail → fixed, token drift → fixed, mobile crop → fixed, tone fix driven by trends/palette file). Does NOT include issues caught by the user after I claimed the post was ready — those count as `toneFixes` or figure revisions.

### A3. Backfill counts: honest reconstruction only

For each eligible post (spec §5.5), reconstruct from:
1. git log of `content/blog/<slug>.mdx` + `public/blog/<slug>/*`
2. `.distribution-ledger.jsonl` for republish entries (serializerRoundTrips signal)
3. Dated session notes in memory (`iteration-N.md` where available)
4. My recall confirmed by git

Any post where ≥ 2 of 5 fields can't be defended from the above sources → omit `uiRework` entirely. Document in iteration-17.md which posts and which fields were unreconstructable.

### A4. Numbers in `tools-built.ts`: inline strings, parser is the audit

Impact rows in `content/tools-built.ts` are human-authored strings (same pattern as `claude-shiploop` entries today). Numbers come from reading `scorecard.json` manually when editing. `verify:numbers` prebuild hook asserts the strings match `scorecard.json`.

Rejected: `import scorecardJson from "@/scorecard.json"` into `tools-built.ts` and compute inline. Would couple content to a build artifact and break if scorecard.json ever gets regenerated with slightly different wording. Current pattern (human-authored, build-verified) is the Sprint 16 convention.

### A5. Scorecard parser mirror vs canonical

Per Sprint 16 vendored-vs-canonical pattern: new `parse-blog-ui-rework.ts` lands in `~/shiploop-publish/lib/` first, syncs to `scripts/scorecard-src/` second, then `npm run scorecard` regenerates. This sprint touches both locations.

### A6. Schema additive guarantee

`scorecard.json` gets a new `uiRework` key under `hrekov-dev.projects[*]`. Snapshot CI check (`scorecard-snapshot.yml`) needs the new key in its allow-list. All other projects get `uiRework: null`.

### A7. Methodology surface

Sprint 16 shipped `/tools` as `ToolsBuilt` cards, no separate methodology section like the old ScorecardMethodology. UI-rework methodology lives inside the `ui-ux-pro` card as a short block under the three impact rows (or in `impactNote`, now rewritten as a pointer not an excuse).

If `ToolCard` doesn't currently render a per-tool methodology block below impact: add one. Minimum viable: a single paragraph plus a link to the parser source (same pattern as `parserSource` field for `claude-shiploop`).

## B. Risk register

| Risk | Mitigation |
|---|---|
| Backfill numbers are "feels right" rather than defensible | Phase 2 produces iteration-17.md with per-post, per-field evidence trace — refuse to ship any number not traceable. |
| Only 2 of 5 posts reconstructable → average over tiny N | Methodology block states `backfilledFrom: 2 / totalEligible: 5` plainly. Keep going; aggregate meaningfulness improves as new posts ship with rig. |
| New frontmatter field breaks existing MDX loader on unknown field | Validator uses `.optional()` — existing posts load unchanged. Verify with unit test on an untouched post. |
| `scorecard.json` schema change breaks snapshot CI | Phase 3 updates `scorecard-snapshot.yml` allow-list before regenerating. |
| `tools-built.ts` numbers drift from `scorecard.json` | `verify:numbers` prebuild asserts match. Add new assertions in phase 5. |

## C. Phases

### Phase 1 — Schema + validator (small, local, no site change)

Add `uiRework` to `BlogFrontmatter` type + runtime validator in `content/blog.ts`. Unit-test the validator with both populated and omitted shapes. No MDX touched yet.

Visible outcome: TypeScript compiles. Loader test for one existing post passes.

### Phase 2 — Backfill + iteration-17.md evidence trace

For each eligible post (spec §5.5), author `uiRework` in frontmatter where reconstruction is honest. Write `memory/iteration-17.md` with a per-post table of evidence sources (git log entries, ledger lines, memory references). If any field is unreconstructable, omit it + note why.

Visible outcome: 4-5 posts in `content/blog/` have `uiRework` in frontmatter. Dev server renders them unchanged (field is metadata only, not displayed per-post).

### Phase 3 — Parser extension

In `~/shiploop-publish/lib/` write `parse-blog-ui-rework.ts`. Reads `content/blog/*.mdx` of a given project, extracts frontmatter via existing MDX parser or gray-matter, aggregates:

- `avgHeroRegenerations`: mean across posts with non-null uiRework (null if N=0)
- `avgQaCatchesPerPost`: mean
- `totalSerializerRoundTrips`: sum
- `backfilledFrom`: count of posts with uiRework
- `totalEligible`: count of posts shipped (ledger entries, status=published)

Wire into main scorecard aggregator so `hrekov-dev.projects[*]` gets a new `uiRework` object. Other projects: `uiRework: null`.

Mirror to `scripts/scorecard-src/`. Regenerate `scorecard.json`.

Visible outcome: `scorecard.json` has new `uiRework` block for hrekov-dev. Snapshot test updated.

### Phase 4 — EffectivenessBlock rows

Edit `content/tools-built.ts` `ui-ux-pro.effectiveness`:
- Replace `impact: null` with 3 rows (hero regens avg, qa catches avg, serializer round-trips total) — strings mirror `scorecard.json` values.
- Rewrite `impactNote` from "no retroactive measurement" to a one-liner pointing at the parser source + the backfill ratio.
- Add `parserSource` link to the parser file in the shiploop-publish repo (or a local mirror if the OSS repo doesn't exist yet).

Visible outcome: `/tools` on local dev shows three numbers under `ui-ux-pro` effectiveness instead of null.

### Phase 5 — `verify:numbers` extension

Extend `scripts/verify-case-study-numbers.mjs` (or equivalent) to assert that every number string in `tools-built.ts` `ui-ux-pro.effectiveness.impact` matches the corresponding value in `scorecard.json.projects.hrekov-dev.uiRework`.

Visible outcome: `npm run verify:numbers` passes. Introducing a drift fails the build.

### Phase 6 — Memory + DEVLOG + retrospective

- Update `memory/reference_blog_post_flow.md`: point source-of-truth to frontmatter, not memory.
- Append to `DEVLOG.md`: Problem / Decision / Result / Lesson for this sprint.
- Create `memory/iteration-17.md` finalised (started in phase 2, closed here).
- Run `/shiploop-brainstorm stage=retrospective` — capture what worked / what cracked.

### Phase 7 — PR + public gate

- Open PR against `main` from the sprint branch.
- STOP before merge. Show the user the diff, the local-dev screenshot of `/tools`, and the verify-numbers output.
- Only merge on explicit user approval (per `feedback_pause_at_public_gates`).

Visible outcome: `/tools` on production shows three numbers for ui-ux-pro after merge + Vercel deploy.

## D. Out of scope reminders (from spec §3)

- No per-post UI-rework display on blog posts themselves.
- No TokenScorecardHero changes.
- No automatic measurement — rig stays author-recorded.
- No pre-commit hook that enforces rig presence on new posts.
- No visualization/sparkline of UI-rework over time.

## E. Rollback plan

- Phase 1-2 reversible: delete the field + its validator, re-run tests.
- Phase 3 reversible: revert the parser diff + regenerate scorecard.json without the key. Snapshot CI accepts rollback since the key is additive.
- Phase 4 reversible: restore `impact: null` + original `impactNote` from git.
- Phase 7 reversible: revert the merge commit.

Each phase is a separate commit so partial rollback is clean.
