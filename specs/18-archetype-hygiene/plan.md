# Plan — Sprint 18 · Archetype tag + Universal Hygiene

**Spec.** `specs/18-archetype-hygiene/spec.md`
**Target branch.** `sprint-18-archetype-hygiene` (new, off `main`)

---

## Pre-flight audit (findings that shape the plan)

- `components/tools/ScorecardTable.tsx` and `components/tools/ScorecardMethodology.tsx` exist and are complete, but are **not mounted anywhere** in the live app. The current `/tools/page.tsx` renders `ToolsBuilt` (tool cards), `InstallBlock`, `SkillGrid` — no project-level scorecard table. The `hrekov-dev` case study uses `TokenScorecardHero` which reads frontmatter `tokenScorecard`, not `scorecard.json`.
- This means Sprint 18 either (a) extends the orphaned `ScorecardTable` with hygiene columns and mounts it on `/tools`, or (b) scopes the UI change to zero and just emits the data into `scorecard.json`, deferring the render to Sprint 19. **Picking (a)** — mounting completes the Sprint 15/16 vision and makes the hygiene columns visible to recruiters in the same pass. Alternative (b) is logged as a fallback if mounting runs into cascading render issues.
- `scorecard.json` is **committed** to the repo. Scorecard regen runs with `npm run scorecard` locally; Vercel builds read the committed JSON. No Vercel-side `gh` auth needed.
- Canonical parser lives in `~/shiploop-publish/lib/`, mirror in `scripts/scorecard-src/lib/`. Both must bump together.

---

## File-by-file plan

### Step 1 — Config schema + archetype assignments

**File.** `scripts/scorecard-src/scorecard.config.mjs`

- Bump `configVersion: 1 → 2`.
- Add two fields per project:
  - `archetype: 'saas-app' | 'automation' | 'llm-skill' | 'design-tool'` (required)
  - `githubRepo: { owner: string, repo: string } | null` (required when known)
- Archetype assignments per spec §5.1 (locked table).
- `githubRepo` for each project:
  - `lexora` → `{ owner: 'ruslan4427', repo: 'lexora' }` (verify at build time; null if not accessible)
  - `noble-saas` → verify repo exists; set to null if private without read access
  - `smm-factory` → same
  - `angel` → likely null (prototype)
  - `fieldmark` → verify
  - `hrekov-dev` → `{ owner: 'ruslan4427', repo: 'portfolio' }`
  - `claude-shiploop` → `{ owner: 'ruslan4427', repo: 'claude-shiploop' }`

Verification during Step 1: run `gh repo view ruslan4427/<repo>` for each candidate; if the command fails or the repo is private without access, set `githubRepo: null` and add a short reason to the `notes` field.

### Step 2 — Lockstep parser constant

**File.** `scripts/scorecard-src/scorecard.mjs`

- Change `const REQUIRED_CONFIG_VERSION = 1 → 2`.

Smoke test: run `npm run scorecard` — must succeed. If parser detects `configVersion: 1` from a stale config, exits non-zero with the mismatch message. Confirms lockstep guard works.

### Step 3 — Hygiene probe module

**File.** `scripts/scorecard-src/lib/github-health.mjs` (new).

Exports one function (post-pivot — see spec §5.2):
```js
export async function probeGitHubHealth({ owner, repo }) → {
  workflowsHealthy: true | false | null,
  secretScanPass: true | false | null,
}
```

Internals:
- Detect `gh --version` once at module load; if missing, every call returns all-null.
- `null` input (no `githubRepo` configured) → short-circuit, all-null.
- Workflows health fetch: `gh run list --repo <owner>/<repo> --branch main --limit 50 --json workflowName,conclusion,status`, then in JS: group by `workflowName`, take the first (most recent) completed run per group, require all groups' conclusions == `success`. `null` when the result is empty or `gh` returns non-zero.
- Secret scanning fetch: `gh api /repos/<owner>/<repo>/secret-scanning/alerts --jq 'length == 0'` wrapped in try/catch; 404 or 403 → `null`.
- Each sub-probe wrapped in its own try/catch — one failed probe doesn't null the others.
- No caching between calls; the whole scorecard regen is one-shot.

### Step 4 — Parser integration

**File.** `scripts/scorecard-src/scorecard.mjs`

- Import `probeGitHubHealth` from `./lib/github-health.mjs`.
- In `scoreProject`, add `probeGitHubHealth(project.githubRepo ?? {})` to the `Promise.all` block alongside existing probes.
- Return value lands under `metrics.hygiene = { workflowsHealthy, secretScanPass }`.
- Also surface `context.archetype = project.archetype` in the output.

### Step 5 — Canonical mirror

**File.** `~/shiploop-publish/lib/github-health.mjs` (new) + `~/shiploop-publish/lib/scorecard.mjs` + `~/shiploop-publish/scripts/scorecard.config.mjs`

- Copy Step 3's module byte-for-byte to the canonical repo.
- Bump `REQUIRED_CONFIG_VERSION` and `configVersion` to 2 in the canonical copies.
- Run the canonical repo's regression smoke (`npm test` or whatever Sprint 17 established) to confirm the lockstep guard still works.
- **This is a separate commit in a separate repo.** Push together with the portfolio PR to keep lockstep visible.

### Step 6 — Regen scorecard.json

**Command.** `npm run scorecard` (from portfolio root).

- Review the generated JSON: every project should have `metrics.hygiene` (two nullable booleans) and `context.archetype` (one of four strings).
- Spot-check expected values (from A1 audit): `portfolio` and `claude-shiploop` → both `true`/`true`; `noble-saas` → `false` (Engagement failing) / `null` (secret-scanning disabled); `lexora` / `smm-factory` / `fieldmark` / `angel` → both `null`.
- Commit the regenerated `scorecard.json`.

### Step 7 — ScorecardTable: hygiene columns + archetype badge

**File.** `components/tools/ScorecardTable.tsx`

- Add two columns after `tokens`: Workflows · Secrets.
- Cell render: green availability dot (`bg-[color:var(--status-available)]`) for `true`, muted ink `✕` glyph for `false`, muted `—` for `null`.
- Column headers use the existing `METRIC_LABEL` pattern — add two new entries with `caption: "GitHub Actions snapshot"` / `"secret-scanning alerts"`.
- Project row gets an `Archetype` badge adjacent to the existing Tier pill. Pattern: muted uppercase pill, same chip style as Tier but using `--outline` border. Four values: `saas-app`, `automation`, `llm-skill`, `design-tool`.
- Mobile card view (`md:hidden` block in the same file) grows a "Health" row: inline two dots with labels.

### Step 8 — ScorecardMethodology: hygiene methodology paragraph

**File.** `components/tools/ScorecardMethodology.tsx`

- Add a new section after the existing null-is-honest explanation:
  > "Health columns (Build · Tests · Secrets) snapshot GitHub Actions and secret-scanning at scorecard regen time, not continuously. `generatedAt` above shows the snapshot moment. A null cell means the project doesn't have a measurable signal — no CI configured, no secret-scanning enabled, or a private repo without access. We never estimate; we show `—` and move on."
- Add archetype paragraph:
  > "Archetype tags project kind so the reader can compare like-with-like. A SaaS app and an automation pipeline have different success conditions; the five metrics above are universal, but comparing them across archetypes requires reading the archetype column alongside."

### Step 9 — Mount ScorecardTable + ScorecardMethodology on /tools

**File.** `app/(marketing)/tools/page.tsx`

- Add a new `<section>` between `ToolsBuilt` and the `Inside ShipLoop` section:
  ```tsx
  <section className="px-[var(--gutter)] py-[var(--section-py)]">
    <div className="mx-auto max-w-[var(--content-max)]">
      <ScorecardTable />
      <ScorecardMethodology />
    </div>
  </section>
  ```
- Imports: `ScorecardTable`, `ScorecardMethodology` from `@/components/tools/*`.
- Update page metadata description to mention the hygiene columns.

### Step 10 — verify:numbers extension (check #15)

**File.** `scripts/verify-case-study-numbers.mjs` (or wherever check infra lives — audit at task time)

- New check: scan prose/MDX for patterns like `(\d+) of 7 projects` or `all 7 projects pass`, resolve against `scorecard.json` hygiene aggregates. If prose claims "all 7 pass secret scanning" but `scorecard.json` has one `false`, build fails.
- Pattern list stays explicit — don't scan every digit as "possibly hygiene".
- Add fixtures for the new check in whatever test harness the existing verifier uses.

### Step 11 — Memory artifact

**File.** `/Users/ruslan/.claude/projects/-Users-ruslan-portfolio/memory/reference_scorecard_hygiene.md` (new)

- Content: short reference doc on hygiene schema, `gh` command shapes, null-triggers, how to add a new project (set `githubRepo`, let regen fill the rest).
- `MEMORY.md` gets a new entry linking it.

### Step 12 — Visual + manual QA

**Browser.** Use the already-invoked `claude-in-chrome` tooling.

- Load `localhost:3000/tools` after `npm run dev`.
- Confirm: ScorecardTable renders with hygiene columns, archetype badges, methodology blurb.
- Mobile width (resize to 390): card view shows Health row with three dots inline.
- Contrast check: null cells (`—`) vs background pass AA for muted ink (already in token system — spot check only, not a formal regen).
- `prefers-reduced-motion`: no new motion in Sprint 18; existing `Reveal` on new section is unchanged.
- Screenshot the before/after for the retro memory.

### Step 13 — Prebuild gate

**Command.** `npm run prebuild` (which chains `verify:numbers` + build).

- Must pass green locally before merge.
- Vercel prebuild runs the same gates on the push to `main`. Confirm green there.

### Step 14 — Retro + memory

**Files.**
- `DEVLOG.md` — new Sprint 18 entry (Problem/Decision/Result/Lesson).
- `/Users/ruslan/.claude/projects/-Users-ruslan-portfolio/memory/iteration-18.md` — Sprint 18 iteration memory.
- `MEMORY.md` — link to iteration-18.md.
- Promote any stable rule to `STABLE_LOGIC.md` if it crystallized (candidate: "hygiene columns show green dot for pass, `—` for null, `✕` for fail — never color-code the fail state beyond muted ink").

---

## Order of execution

Steps are mostly independent but logically sequential:

1. Step 1 → 2 → 3 → 4 → 5 → 6 (scorecard data pipeline, each depends on prior)
2. Step 7 → 8 → 9 (UI, needs scorecard.json from step 6)
3. Step 10 (verify:numbers, can run in parallel with 7–9)
4. Step 11 (memory, can run anytime after step 1)
5. Step 12 → 13 (QA + prebuild, after everything else)
6. Step 14 (retro, after merge)

**Opus for.** Steps 1, 3, 10 (schema design, probe module API shape, verify:numbers pattern judgement).
**Sonnet for.** Steps 2, 4, 5, 7, 8, 9, 11 (mechanical implementation following patterns in neighboring files).

---

## Risks and mitigations (plan-level, beyond spec §6)

- **Mounting ScorecardTable breaks `/tools` layout** — the current `/tools` is already dense. Mitigation: visually QA at Step 12 before merge; roll back the mount (step 9) if cramped — hygiene data stays in `scorecard.json` for a Sprint 19 render pass.
- **`gh` CLI version mismatch between dev and canonical repo CI** — the canonical lockstep test (Step 5) might run in a CI environment without `gh`. Mitigation: the module already returns all-null when `gh` is missing; the lockstep smoke doesn't need network, only the shape check (parser-config version compat).
- **`fieldmark` iOS/mobile confusion** — spec flags whether to split `saas-app` into `mobile-app` later. Sprint 18 leaves fieldmark as `saas-app`; add a `notes` line in config explaining the decision for Sprint 19 reviewer.

---

## Definition of done

- All 14 steps completed.
- `scorecard.json` committed with hygiene + archetype data.
- `/tools` live with new columns + methodology.
- Canonical `shiploop-publish` repo updated and pushed (lockstep).
- `verify:numbers` has new check #15.
- `DEVLOG.md` has a Sprint 18 entry.
- Memory iteration-18.md written.
- PR merged to `main`. Vercel prebuild + deploy green.
- Visual QA screenshot captured.
