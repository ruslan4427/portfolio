# Spec — Sprint 18 · Archetype tag + Universal Hygiene via GitHub API

**Class.** L (new scorecard dimension across 7 projects + new parser module calling external API + lockstep configVersion bump + `/tools` render update + `verify:numbers` extension)
**Date.** 2026-10-17
**Owner.** Ruslan (archetype assignments, go/no-go on each API probe), Claude Opus (spec/plan), Claude Sonnet (implementation).

---

## 1. Why this exists

Sprint 17 shipped the `uiRework` dimension and closed one measurement gap. In the design discussion that followed, two deeper gaps surfaced:

**Gap 1 — "ruler for one, no ruler for the other."** The scorecard's five Level-1 metrics (`disciplineScore`, `reworkRatio`, `timeToShipDays`, `tokens`, `expertHitRate`) are measurable across every project because they derive from artifacts every repo has. But three are process-shaped (discipline, rework, expert-hit) and two are telemetry-shaped (TTS, tokens). None of them cover **engineering health**: does the code build, do tests pass, are there leaked secrets. A `/tools` reader looking at `smm-factory` next to `hrekov-dev` has no way to tell whether either project is in a working state right now. The scorecard measures *how* the code got written; it says nothing about *whether the code works*.

**Gap 2 — "measuring a screwdriver with a hammer's benchmark."** The seven projects aren't the same kind of artifact. `noble-saas` is a SaaS web app whose success condition is "user books an appointment." `smm-factory` is an automation pipeline whose success condition is "scheduled job completes without manual intervention." `claude-shiploop` is an LLM lifecycle skill whose success condition is "spec-plan-tasks triple exists for every feature." The five Level-1 metrics are usable across all three, but they're insufficient for any of them *as the only numbers on the dashboard*. The current `/tools` reader can see that `hrekov-dev` has 0.46 rework and `noble-saas` has 1.44 — they can't see that `noble-saas` is the one whose booking flow actually ships customer value.

Sprint 18 closes Gap 1 (universal engineering health, same checks across all 7 projects, measured via GitHub API). Gap 2 gets a **tag**, not a measurement — archetype-specific metrics (E2E, Lighthouse, uptime) are deferred to a later sprint when there's a real need to compare two same-archetype projects head-to-head.

## 2. What must stay the same

- **Monochrome editorial.** No new chromatic accents in `/tools` rendering of hygiene booleans. Status indicators use the existing green availability dot (`#22C55E`) only when the value is "pass"; "fail" and "null" use ink/muted ink.
- **Null-is-honest.** Every new hygiene field is nullable. A project with no GitHub repo, no CI configured, or a Flutter test runner we can't probe through `gh` → `null`, never `false` or estimated. Null renders as `—` on `/tools`, as before.
- **No composite score.** Hygiene booleans and existing metrics stay as separate columns. A `FinalScore = 0.4·H + 0.6·A`-style scalar is explicitly rejected (see §5.3).
- **Scorecard data pipeline convention.** Canonical parser in `~/shiploop-publish/lib/`, mirror in `scripts/scorecard-src/`, regenerate `scorecard.json` with `npm run scorecard`, additive-only schema changes, `configVersion` bumps in lockstep.
- **`verify:numbers` prebuild hook.** Any hygiene-related number in prose/MDX gets verified at build time (CLAUDE.md §5.5).
- **No Vercel-side `gh` calls.** The scorecard regenerates on the dev machine (where `gh auth` is already configured) and `scorecard.json` is committed. Vercel reads the committed JSON. No new secrets, no new runtime deps.

## 3. Scope

### In

1. **`archetype` field in `scorecard.config.mjs`.** Required string, enum: `saas-app | automation | llm-skill | design-tool`. Assigned per project in Sprint 18 (see §5.1). Lockstep: `configVersion: 1 → 2`.
2. **Two hygiene booleans via GitHub API.** New module `lib/github-health.mjs` with one function `probeGitHubHealth({ owner, repo })` returning `{ workflowsHealthy, secretScanPass }`. Each field is `true | false | null`. Implementation uses `gh` CLI (not raw REST — matches dev's existing auth). Null when: repo is private without read access, no workflow runs on `main`, no secret-scanning alerts endpoint access. See §5.2 for why `workflowsHealthy` replaced the originally-proposed `buildPasses` + `testsPass` split.
3. **`githubRepo` field in `scorecard.config.mjs`.** Required-when-measurable: `{ owner: string, repo: string } | null`. `null` means "project isn't on GitHub as a public/accessible repo" → all three hygiene booleans short-circuit to `null`.
4. **Parser integration.** `scorecard.mjs::scoreProject` calls `probeGitHubHealth` in parallel with existing probes (git log, DEVLOG, logs). Results land under `metrics.hygiene = { workflowsHealthy, secretScanPass }`. Each probe wrapped in try/catch — one failing project doesn't break the whole run.
5. **`/tools` render update.** `TokensScorecardHero` (or equivalent current component — audit at plan time) grows two columns: *Workflows · Secrets*. Each cell: green dot for `true`, muted `✕` for `false`, `—` for `null`. New `Archetype` badge in each project card header pulled from `metrics` payload. No visual accent changes beyond those.
6. **Methodology surface update.** `/tools` methodology section gains a paragraph on hygiene source (`gh api` snapshot at regen time, not continuous) and null-rule for hygiene specifically.
7. **`verify:numbers` extension.** New check #15 reads `scorecard.json` hygiene totals and verifies any aggregated hygiene number used in prose (e.g., "all 7 projects pass secret scanning"). Prose that doesn't cite a number isn't checked.
8. **Memory update.** New `reference_scorecard_hygiene.md` documenting the `gh` API shape and the null-triggers.

### Out

- **Archetype-specific metrics** (E2E flows, Lighthouse, uptime). Deferred to Sprint 19+ when there's a real need to compare two same-archetype projects. Archetype is a tag only for now.
- **CI-integrated hygiene probes.** Scorecard regen stays a manual dev-machine step. Not adding GitHub Actions crons, not adding Vercel-time hygiene probes.
- **Historical hygiene timeseries.** Snapshot at regen time only. If `main` was green yesterday and red today, we see today; no backfill, no `tokensByDate`-style history.
- **Hygiene-weighted ordering of `/tools`.** Project order on `/tools` stays as-is (manually curated in `TOOLS_BUILT` for tool cards; project order in `/tools` project grid stays config-ordered).
- **New `FinalScore` scalar.** Explicitly out — see §5.3.
- **Private repo access via PAT.** If a repo is private and `gh` can't read it, hygiene is null. No workaround with new credentials.
- **Flutter test probe for `lexora`.** Lexora runs `flutter test`, not GitHub Actions in a way `gh` can introspect uniformly. Lexora's `testsPass` stays null until Sprint 19+ decides whether to add a Flutter-specific probe or classify-with-reason.

## 4. Audience impact

- **Recruiters** (primary) — `/tools` shows at a glance that every project with a GitHub repo passes build + tests + secret scan. That reads as "the engineer behind this is in control of what ships, not just how it was built." Null cells with a methodology link read as "measured where honest" rather than "we don't know."
- **Claude-devs** (secondary) — the archetype tag on tool cards tells the reader whether `claude-shiploop` and `ui-ux-pro` belong in the same mental bucket. They don't (lifecycle vs design-tool), and the dashboard now says so.
- **Self** — hygiene becomes a visible gate. If `smm-factory`'s build goes red, `/tools` goes red; the signal to triage is in the public page, not just a GitHub notification I ignored. Secret-scan column removes "did I ever leak anything?" as an open question.

## 5. Design decisions (resolved during spec)

### 5.1 Archetype assignments (locked, Sprint 18)

| Project | Archetype | Reason |
|---|---|---|
| `lexora` | `design-tool` | Vocab-content tool with heavy generative output (audio/translation). "Design-tool" category covers content-generating tools; "llm-skill" is for lifecycle protocols, not products. |
| `noble-saas` | `saas-app` | Multi-tenant booking web app with Stripe + Twilio. Canonical SaaS. |
| `smm-factory` | `automation` | Cron-driven agent pipeline producing Instagram posts. No human user flow; success = scheduled job completed. |
| `angel` | `saas-app` | Trucking web app with auth + FCM. Pre-production, but shape is SaaS. |
| `fieldmark` | `saas-app` | PDF-floor-plan iOS app with cloud backend; "SaaS" covers mobile+backend products in this taxonomy. |
| `hrekov-dev` | `saas-app` | Static-rendered Next.js portfolio with form + analytics backend. Edge case — nearly content-only, but has server actions. SaaS tag reflects the full-stack reality better than a new `portfolio` archetype would. |
| `claude-shiploop` | `llm-skill` | Lifecycle protocol for Claude Code — the canonical case for this tag. |

Rejected: adding a `portfolio` archetype for `hrekov-dev` specifically. Rationale: one project doesn't warrant a tag; conflating with `saas-app` is honest because the stack and failure modes are the same.

Open for user review: whether `fieldmark` should be `mobile-app` instead of `saas-app`. Keeping it under `saas-app` for Sprint 18 (fewer archetypes = cleaner comparison); split in Sprint 19+ if there's reason to.

### 5.2 Hygiene source = GitHub Actions health + secret scanning (pivoted mid-Phase-A)

The scorecard runs on the dev machine (`npm run scorecard`), where `gh auth` is configured. Hygiene source for each project:

- `workflowsHealthy` — for each distinct workflow with recent activity on `main`, is the most recent completed run green? `true` when all distinct workflows green, `false` when ≥ 1 distinct workflow red, `null` when no workflow runs on `main` or no access.
- `secretScanPass` — `gh api /repos/:owner/:repo/secret-scanning/alerts --jq 'length == 0'`. Returns `true` when zero open alerts, `false` when ≥ 1, `null` when the endpoint 404s (secret scanning disabled on the repo, or private repo without alerts-read permission).

**Pivot history (recorded for the retro).** The signed-off version of this spec specified three fields: `buildPasses` (regex `/build|ci|deploy/i`), `testsPass` (regex `/test|check|verify/i`), and `secretScanPass`. During Phase A1 audit, zero of three public repos had workflow names matching either regex — `portfolio` deploys via Vercel (not GH Actions build), `claude-shiploop` has `skill-lint` + `scorecard-snapshot`, `noble-saas` has only Instagram cron automation. The regex approach would have produced `null` across every Build and Tests column, hiding the real signal: whether the automation each repo *does* run is in a working state. The pivoted single `workflowsHealthy` field captures that honestly without regex-fragile matching or per-project overrides. Semantically weaker claim ("automation is healthy" vs "build + tests pass separately"), but a claim that is actually true-or-false for every public repo in the dataset.

Rationale (post-pivot): three of seven projects are public GitHub repos with workflow activity; the four private/non-GitHub (`lexora`, `smm-factory`, `fieldmark`, `angel`) will reflect that honestly as `null`. No new infrastructure, no new tool chains, no cross-repo checkout. Scorecard regen takes ~3–5s longer per public project (one `gh run list` call + one `gh api` call).

Rejected: local-exec approach (`cd ../noble-saas && npm test`) — requires sibling checkouts, heterogeneous test commands (npm vs pnpm vs flutter), env/DB setup for integration tests, long run times.
Rejected: self-reporting `.health.json` in each repo — shifts burden to repo maintainers (impossible for external projects, friction for own projects).
Rejected: regex-match workflow names (original design) — fragile, produces nulls where real signal exists, requires per-project override lists.

### 5.3 No composite score

The hygiene dimension does **not** combine into a weighted scalar with Level-1 metrics or archetype scores. Every value stays as its own column.

Rationale: a `FinalScore = 0.4·Hygiene + 0.6·Archetype`-style number re-introduces the exact pathology `null-is-honest` was invented to kill. When `testsPass = null` (lexora), the scalar must either (a) treat null as zero, hiding the honesty, or (b) propagate null to the scalar, making it useless. Keeping every column separate preserves the reader's ability to see what is and isn't measured. The "ratio of ratios ≈ 10×" claim in the `hrekov-dev` case study works precisely because the reader sees `0.46 vs 4.5` in isolation — a scalar `0.78 vs 0.42` would hide which columns moved.

### 5.4 Snapshot semantics (acknowledged, not fixed)

Hygiene is snapshotted at `scorecard.json` regen time. If `smm-factory` goes red at 03:00 and the scorecard was regenerated at 02:00, `/tools` still shows green until the next regen. This is **acceptable** for Sprint 18:

- Scorecard regen already happens on every meaningful content push (per Sprint 15 workflow).
- The whole scorecard methodology is snapshot-based, not live.
- The `generatedAt` field at the top of `scorecard.json` already surfaces staleness; the methodology blurb will mention it explicitly.

Deferred: a GitHub Actions cron that regenerates `scorecard.json` nightly and opens a PR when hygiene changes. Logged as a Sprint 19+ candidate.

### 5.5 Rate-limit handling

`gh` CLI uses the authenticated user's rate limit (5000 req/hr). Sprint 18 adds 3 calls × 7 projects = 21 calls per regen. Non-issue, but documented. If a user without `gh auth` runs the scorecard, `probeGitHubHealth` catches the 401 and returns all-null for every project. The regen succeeds with the hygiene columns full of `—` — same semantics as a project without a GitHub repo.

### 5.6 Secret-scanning as the second hygiene column (post-pivot: no longer a "triad")

Secret scanning on free/public repos requires it be enabled per-repo (GitHub's secret-scanning product — free on public repos but opt-in). Confirmed during A1 audit: `portfolio` and `claude-shiploop` have it enabled (returned `[]`); `noble-saas` has it disabled (returned 404 "Secret scanning is disabled on this repository"). After the §5.2 pivot, hygiene is two columns (Workflows + Secrets) rather than three; the columns measure orthogonal things (CI health vs leaked-credential surface) so keeping them separate is still correct. Null-sources overlap for the four private/non-GitHub projects, which is honest.

### 5.7 Archetype as config, not as derived field

The archetype tag lives in `scorecard.config.mjs` (hand-assigned), not computed from `package.json` dependencies or file-shape heuristics. Reasoning: Sprint 15's `tier` field set the precedent — classification that affects reader interpretation is a human call, documented in `notes`, not auto-detected. A `smm-factory` with a React dep for an admin UI is still `automation`-shaped at the business-model layer; a heuristic would get this wrong.

## 6. Risks

1. **`gh` CLI not installed on fresh dev machines.** Mitigation: `lib/github-health.mjs` detects `gh --version` failure, logs a one-line warning, returns all-null. Scorecard still generates.
2. **Private-repo access shift.** If a project's visibility changes mid-sprint, hygiene flips from measured to null. Mitigation: `generatedAt` timestamp + methodology blurb. No historical cache (per §5.4).
3. **~~False negatives on `testsPass`.~~** Obsolete after §5.2 pivot — `workflowsHealthy` doesn't regex-match names.
4. **GitHub API drift.** `gh api /repos/:owner/:repo/secret-scanning/alerts` could change shape. Mitigation: the fetcher uses `--jq 'length == 0'` with try/catch; shape drift returns null, which is the designed-for null case. We won't silently serve wrong data.
5. **`verify:numbers` false positives.** Prose like "the three hygiene checks" where "three" is a copy-constant not a count. Mitigation: check #15 scans for *specific* hygiene-aggregate patterns (e.g., `/N of 7 projects/`), not every digit.

## 7. Acceptance

- `scorecard.config.mjs` has `archetype` and `githubRepo` on every project; `configVersion = 2`.
- `lib/github-health.mjs` exists in both canonical (`~/shiploop-publish/lib/`) and mirror (`scripts/scorecard-src/lib/`) locations.
- `npm run scorecard` emits `scorecard.json` with `metrics.hygiene = { workflowsHealthy, secretScanPass }` + `context.archetype` on every project.
- `/tools` renders two hygiene cells per project (Workflows · Secrets) + archetype badge, monochrome + green availability dot for pass.
- `verify:numbers` check #15 blocks the build when hygiene prose drifts from `scorecard.json`.
- Config-version regression smoke in canonical `shiploop-publish` repo still passes (parser + config bump landed together).
- Methodology blurb on `/tools` explains hygiene source, snapshot semantics, null-rule.
- No visual accent beyond the existing green availability dot; monochrome rule holds.
- No composite score added anywhere.

## 8. Non-acceptance (if any of these ship, Sprint 18 is not done)

- A `FinalScore` field anywhere.
- Any hygiene value derived by estimation or defaulting to `false` when the real answer is "unknown."
- `gh` calls at Vercel build time.
- Flutter-specific hygiene probe for `lexora` (deferred).
- New chromatic accents in `/tools`.

## 9. Rollback

Each piece is independently revertable:

- Revert the config change → `configVersion` drops back to 1 → parser refuses to run until the parser's `REQUIRED_CONFIG_VERSION` is also reverted. Lockstep works for rollback too.
- Revert the parser's `probeGitHubHealth` call → `metrics.hygiene` field disappears from `scorecard.json` → `/tools` component falls back to the existing render (feature-flag via `metrics.hygiene == null` check, not a boolean switch).
- Revert the `/tools` component change → hygiene data stays in `scorecard.json` but isn't rendered.

No destructive schema migration; `scorecard.json` schema is additive only.

## 10. Next sprint candidates (seeded here, not committed)

- **Sprint 19 candidate.** Archetype-specific metrics for the one archetype where we can afford infrastructure (likely `saas-app` via Lighthouse CI — Playwright E2E is too much per-project build cost for Sprint 19 budget).
- **Sprint 19+ candidate.** Nightly cron that regenerates `scorecard.json` and opens a PR when hygiene flips, so staleness window closes to 24h.
- **Deferred.** Flutter-specific hygiene probe for `lexora`.
