# Tasks — Sprint 17 · UI-rework dimension

## Phase 1 — Schema + validator

- [ ] 1.1 Add `UiRework` type to `content/blog.ts`: `{ heroRegenerations: number; figureRevisions: { figure: string; revisions: number }[]; toneFixes: number; qaCatches: number; serializerRoundTrips: number }`.
- [ ] 1.2 Add `uiRework?: UiRework` to `BlogFrontmatter`.
- [ ] 1.3 Add validator: when `uiRework` present, every field must exist and be integer ≥ 0; `figureRevisions` array elements must have `figure: string`, `revisions: integer ≥ 0`.
- [ ] 1.4 Loader test: parse an existing post without the field — no throw. Parse a crafted post with it — field materialises correctly.
- [ ] 1.5 `npx tsc --noEmit` passes.

## Phase 2 — Backfill 5 posts

For each: open MDX, add `uiRework` block to frontmatter, log evidence sources in `memory/iteration-17.md`.

- [ ] 2.1 `launching-the-journal` — backfill or omit based on evidence
- [ ] 2.2 `shipping-the-cross-poster` — backfill or omit
- [ ] 2.3 `no-company-no-api` — backfill or omit
- [ ] 2.4 `classify-before-you-code` — backfill (freshest, likely complete)
- [ ] 2.5 `shipping-claude-shiploop` — fill before Monday 2026-10-19 ship, not retroactive
- [ ] 2.6 Write `memory/iteration-17.md` with per-post evidence table (git refs, ledger lines, memory refs). Document omitted fields with reason.
- [ ] 2.7 `npm run dev` → each post page still renders unchanged (field is metadata only).

## Phase 3 — Scorecard parser extension

- [ ] 3.1 `~/shiploop-publish/lib/parse-blog-ui-rework.ts`: reads a project's `content/blog/*.mdx`, aggregates per spec §A3 of plan.
- [ ] 3.2 Unit test in `~/shiploop-publish/test/` with a fixture of 3 posts (2 with uiRework, 1 without) — expected aggregates match.
- [ ] 3.3 Wire into main aggregator (`~/shiploop-publish/scripts/generate-scorecard.ts` or equivalent): produce `project.uiRework` for each project. Non-hrekov projects: `null`.
- [ ] 3.4 Commit + push `shiploop-publish`.
- [ ] 3.5 Sync canonical parser → `scripts/scorecard-src/parse-blog-ui-rework.ts`.
- [ ] 3.6 Regenerate `scorecard.json` via `npm run scorecard`. Verify hrekov-dev gets a `uiRework` block, others get `null`.
- [ ] 3.7 Update `.github/workflows/scorecard-snapshot.yml` allow-list to accept `uiRework` key.
- [ ] 3.8 Snapshot check passes locally.

## Phase 4 — EffectivenessBlock rows

- [ ] 4.1 Edit `content/tools-built.ts`: `ui-ux-pro.effectiveness.impact` → 3 rows (hero regens avg, qa catches avg, serializer round-trips total). Values as strings mirroring `scorecard.json` numbers.
- [ ] 4.2 Rewrite `impactNote` to a one-liner: methodology pointer + backfill ratio (e.g. `"Backfilled across 4 of 5 shipped posts; one pre-dates reliable session memory."`).
- [ ] 4.3 Add `parserSource` field pointing at `scripts/scorecard-src/parse-blog-ui-rework.ts` (or OSS repo link once published).
- [ ] 4.4 `npm run dev` → `/tools` renders three numbers under ui-ux-pro + methodology one-liner.
- [ ] 4.5 Chrome visual verify (ui-ux-pro step from `reference_blog_post_flow.md`): mobile 375px + desktop 1440px screenshots. Compare against monochrome + green-dot rule.
- [ ] 4.6 Contrast check for any new fg/bg pair in the new rows (should reuse Sprint 16 tokens — likely no net-new pair, verify anyway).

## Phase 5 — verify:numbers extension

- [ ] 5.1 Open `scripts/verify-case-study-numbers.mjs`.
- [ ] 5.2 Add a `verifyToolsBuilt()` block: load `content/tools-built.ts` + `scorecard.json`, assert that each impact row's value string matches the corresponding number in `scorecard.json.projects[?slug==hrekov-dev].uiRework`.
- [ ] 5.3 `npm run verify:numbers` passes.
- [ ] 5.4 Inject a drift (temporarily edit a tools-built number) — verify fails. Revert.

## Phase 6 — Memory + DEVLOG

- [ ] 6.1 Update `~/.claude/projects/-Users-ruslan-portfolio/memory/reference_blog_post_flow.md`: in the UI/UX QA section, replace reference to "track regeneration count per post (feeds the scorecard, see below)" with pointer to `content/blog.ts` `uiRework` field as source of truth.
- [ ] 6.2 In the Scorecard dimension section of the same file: replace "Fill into `memory/iteration-N.md` for every published post" with "Record in post frontmatter under `uiRework`; iteration-N.md captures only surprises or evidence traces, not the primary numbers."
- [ ] 6.3 Append to `DEVLOG.md`: Problem / Decision / Result / Lesson entry for Sprint 17.
- [ ] 6.4 Finalise `memory/iteration-17.md`.
- [ ] 6.5 Decide if the "UI/UX QA pass is mandatory before MDX commit" rule earned promotion to `STABLE_LOGIC.md`. If 4+ QA catches aggregate across backfill → promote.

## Phase 7 — PR + public gate

- [ ] 7.1 Commit sprint branch, push.
- [ ] 7.2 Open PR `sprint-17-ui-rework-dimension → main`.
- [ ] 7.3 Attach to PR body: screenshot of `/tools` local-dev + `npm run verify:numbers` output + `scorecard.json` diff summary.
- [ ] 7.4 **STOP.** Wait for explicit user approval before merge (`feedback_pause_at_public_gates`).
- [ ] 7.5 On approval: merge, verify Vercel deploy, visit `hrekov.dev/tools`, confirm three numbers rendered.
- [ ] 7.6 Run `/shiploop-brainstorm stage=retrospective` after prod verify.

## Phase 8 — Post-ship

- [ ] 8.1 If retrospective flagged any crystallised rule → promote to `STABLE_LOGIC.md` or `content/blog/CLAUDE.md`.
- [ ] 8.2 Update `MEMORY.md` with iteration-17 entry.
