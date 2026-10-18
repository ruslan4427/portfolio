# Tasks — Sprint 18 · Archetype tag + Universal Hygiene

**Spec.** `specs/18-archetype-hygiene/spec.md`
**Plan.** `specs/18-archetype-hygiene/plan.md`

Each task names the plan step it executes and the primary file touched.

---

## Phase A — Scorecard data pipeline

- [ ] **A1 · Audit `githubRepo` candidates per project** (plan Step 1)
  - For each of the 7 projects: `gh repo view ruslan4427/<slug>` (or best-guess owner/repo). Record which succeed and which 404/deny.
  - Output: a short map `slug → { owner, repo } | null` to feed into A2.

- [ ] **A2 · Config bump + archetype + githubRepo assignments** (plan Step 1)
  - Edit `scripts/scorecard-src/scorecard.config.mjs`:
    - `configVersion: 1 → 2`
    - Add `archetype` per spec §5.1 (locked table).
    - Add `githubRepo` from A1.
  - Confirm no stray fields; schema stays additive.

- [ ] **A3 · Parser lockstep bump** (plan Step 2)
  - Edit `scripts/scorecard-src/scorecard.mjs`: `REQUIRED_CONFIG_VERSION = 2`.
  - Smoke: `npm run scorecard` succeeds.
  - Smoke: temporarily revert `configVersion` in config → run → expect non-zero exit with mismatch message → re-apply bump.

- [ ] **A4 · Build `lib/github-health.mjs`** (plan Step 3)
  - New file in `scripts/scorecard-src/lib/github-health.mjs`.
  - Export `probeGitHubHealth({ owner, repo })` with the semantics in plan Step 3 and spec §5.2.
  - `gh --version` detection at module load; absent → all-null, log one line to stderr.
  - Each sub-probe (build/tests/secret-scan) in its own try/catch.

- [ ] **A5 · Wire parser to call `probeGitHubHealth`** (plan Step 4)
  - Edit `scripts/scorecard-src/scorecard.mjs::scoreProject`:
    - Import `probeGitHubHealth`.
    - Add to `Promise.all` with existing probes.
    - Emit `metrics.hygiene = { buildPasses, testsPass, secretScanPass }`.
    - Emit `context.archetype`.

- [ ] **A6 · Mirror canonical parser + config** (plan Step 5)
  - Copy `lib/github-health.mjs` byte-for-byte to `~/shiploop-publish/lib/`.
  - Bump `REQUIRED_CONFIG_VERSION = 2` in canonical parser.
  - Bump `configVersion = 2` + archetype/githubRepo in canonical config (same data as A2).
  - Run canonical repo's regression smoke; confirm green.
  - **Separate commit in `~/shiploop-publish`** — don't push yet, synchronize push with portfolio PR.

- [ ] **A7 · Regenerate scorecard.json** (plan Step 6)
  - `npm run scorecard` from portfolio root.
  - Review: every project has `metrics.hygiene` + `context.archetype`.
  - Spot-check expected values (claude-shiploop + hrekov-dev: likely green; lexora + angel: likely null).
  - Commit `scorecard.json`.

---

## Phase B — UI render

- [ ] **B1 · Extend `ScorecardTable` desktop view** (plan Step 7, post-pivot spec §5.2)
  - Edit `components/tools/ScorecardTable.tsx`:
    - Add two columns after `tokens`: Workflows · Secrets.
    - Cell render per plan Step 7 (green dot pass, muted ✕ fail, muted — null).
    - Column headers via `METRIC_LABEL` extension.
  - Visual QA: all seven rows render correctly.

- [ ] **B2 · Extend `ScorecardTable` archetype badge** (plan Step 7)
  - Same file. Add `ArchetypePill` component next to existing `TierPill`.
  - Muted uppercase pill, four values; chip style matches Tier's outline variant.

- [ ] **B3 · Extend `ScorecardTable` mobile card view** (plan Step 7)
  - Same file. Add "Health" row with two inline dots + labels.
  - Confirm no horizontal scroll on 390px.

- [ ] **B4 · Extend `ScorecardMethodology`** (plan Step 8)
  - Edit `components/tools/ScorecardMethodology.tsx`:
    - Add hygiene methodology paragraph per plan Step 8.
    - Add archetype methodology paragraph per plan Step 8.
  - Monochrome; no new accents.

- [ ] **B5 · Mount on `/tools/page.tsx`** (plan Step 9)
  - Edit `app/(marketing)/tools/page.tsx`:
    - Import `ScorecardTable`, `ScorecardMethodology`.
    - Add new `<section>` between `ToolsBuilt` and `Inside ShipLoop`.
    - Update page metadata description.
  - Visual QA via Chrome: section lands correctly, no layout break.

---

## Phase C — Verifier + prebuild gate

- [ ] **C1 · Add verify:numbers check #15** (plan Step 10)
  - Edit `scripts/verify-case-study-numbers.mjs` (or wherever the check infra lives — audit first).
  - New check: hygiene aggregate patterns per plan Step 10.
  - Add fixtures if the harness supports them.

- [ ] **C2 · Local prebuild** (plan Step 13)
  - `npm run prebuild` — must pass green.
  - If check #15 fires on existing prose, either (a) edit prose to match reality or (b) narrow the pattern to avoid false positives — spec §6 risk 5.

---

## Phase D — Memory + visual QA

- [ ] **D1 · `reference_scorecard_hygiene.md`** (plan Step 11)
  - New file at `/Users/ruslan/.claude/projects/-Users-ruslan-portfolio/memory/reference_scorecard_hygiene.md`.
  - Document hygiene schema, gh command shapes, null triggers, how to add a project.
  - Open after write per `feedback_auto_open_new_files`.

- [ ] **D2 · `MEMORY.md` link** (plan Step 11)
  - Append entry: `- [Scorecard hygiene schema](reference_scorecard_hygiene.md) — …`
  - One line under 150 chars.

- [ ] **D3 · Visual QA screenshots** (plan Step 12)
  - Load `localhost:3000/tools` in Chrome (claude-in-chrome).
  - Capture desktop (1440) + mobile (390) screenshots of the new section.
  - Attach to Sprint 18 retro memory in D5.

---

## Phase E — Retro, PR, merge

- [ ] **E1 · DEVLOG entry** (plan Step 14)
  - Append Problem/Decision/Result/Lesson block to `DEVLOG.md`.

- [ ] **E2 · Iteration memory** (plan Step 14)
  - New file: `.../memory/iteration-18.md`.
  - MEMORY.md link.

- [ ] **E3 · STABLE_LOGIC promotion check** (plan Step 14)
  - Review `STABLE_LOGIC.md`; if a rule crystallized (candidate: "hygiene cell styles — green dot, —, ✕"), promote.

- [ ] **E4 · Open PR**
  - Branch `sprint-18-archetype-hygiene` pushed to origin.
  - PR title: `feat(sprint-18): archetype tag + universal hygiene via GitHub API`.
  - Body: summary + test plan (prebuild local green, visual QA via Chrome).
  - **Pause before merge** — per `feedback_pause_at_public_gates`, wait for explicit go before merging + pushing canonical repo.

- [ ] **E5 · Merge + canonical push gates**
  - Explicit user confirmation → merge PR to `main`.
  - Explicit user confirmation → push canonical `shiploop-publish` commit (A6).
  - Confirm Vercel prebuild green on `main`.
  - Confirm canonical repo regression smoke green on push.

---

## Gate checklist (ship criteria)

- [ ] All Phase A tasks completed; `scorecard.json` has `metrics.hygiene` + `context.archetype`.
- [ ] All Phase B tasks completed; `/tools` renders new columns + archetype badges + methodology.
- [ ] Phase C: `verify:numbers` green locally and on Vercel prebuild.
- [ ] Phase D: memory artifacts written; screenshots captured.
- [ ] Phase E: DEVLOG + iteration-18.md + MEMORY.md updated; PR open; merge + canonical push gated behind explicit user confirmation.

---

## Non-tasks (deferred, flagged for future)

- Archetype-specific metrics (E2E, Lighthouse, uptime) → Sprint 19+.
- Nightly cron for `scorecard.json` regen → Sprint 19+.
- Flutter-specific hygiene probe for `lexora` → Sprint 19+.
- Splitting `fieldmark` into `mobile-app` archetype → Sprint 19+.
