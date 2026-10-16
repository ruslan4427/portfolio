# Plan — Sprint 15 · claude-shiploop OSS release + scorecard

Phase sequencing. Each phase is independently verifiable and doesn't
require the next to be started. Phases A → B → C → D form the
measurement spine; E → F → G form the publication surface; H is launch
day. A/B/C can proceed in parallel with E once the data model lands in C.

---

## Phase A — Session attribution (unblocks Tier 0 data)

**Goal:** `~/.claude/projects/-Users-ruslan/` sessions reorganized into
per-project folders where confidence is high. Residual stays in home-dir.

**Files added:**
- `scripts/attribute-sessions.ts` — reads every session under
  `~/.claude/projects/-Users-ruslan/`, grep-counts project keywords per
  session, classifies as `SINGLE` (one project ≥3 hits), `MIXED`
  (≥2 projects ≥3 hits), or `UNCLASSIFIED`. Emits
  `tmp/attribution-report.csv` with `session_id, project_slug,
  classification, hit_counts, first_message_ts, last_message_ts`.
- `scripts/attribute-execute.ts` — reads the (Ruslan-reviewed) CSV,
  performs `mv` into `~/.claude/projects/-Users-ruslan-<slug>/`.
  Backup is a prerequisite the script enforces (checks for
  `-Users-ruslan.bak-<YYYY-MM-DD>` sibling folder, exits if missing).
  Dry-run mode by default; `--execute` to actually move.
- `scripts/__fixtures__/attribution-keywords.ts` — keyword map from
  spec §10.1 (Lexora / SMM Factory / Angel Trucking).

**Pre-flight (Ruslan, manual):**
- `cp -r ~/.claude/projects/-Users-ruslan ~/.claude/projects/-Users-ruslan.bak-2026-10-14`
- Confirm backup disk size matches (`du -sh` on both)

**Verify:**
1. Report-only run (`node scripts/attribute-sessions.ts`) produces CSV;
   Ruslan reviews, overrides any wrong SINGLE classifications in a
   `tmp/attribution-review.csv` with the same schema.
2. Dry-run `attribute-execute.ts` logs intended moves without touching
   filesystem.
3. `--execute` run only after dry-run output matches review CSV.
4. Post-execute: new per-project folders exist and session counts sum
   to the pre-execute total minus residual.

**Bail-out trigger:** If < 50% of sessions classify SINGLE across all
three projects, the attribution signal is too weak. Fall back to:
Tier 0 projects → tokens = null everywhere, scorecard shows "not
reconstructable" note. Spec §10.1 permits this path.

**Effort:** ~2–3h (script ~1h; review loop + any override iterations
~1h; execute run + verify ~30min).

---

## Phase B — Scorecard parser (canonical in OSS, vendored in portfolio)

**Goal:** `scripts/scorecard.ts` emits deterministic
`scorecard.json` for 7 projects × 5 metrics with context tags.

**Files added (OSS repo, authored first):**
- `scripts/scorecard.ts` — main entry; reads project config, computes
  all 5 metrics per project, writes JSON.
- `scripts/scorecard.config.ts` — hardcoded project list + path config
  + tier assignments. Declares `configVersion: 1`.
- `scripts/lib/metrics.ts` — per-metric computations (discipline,
  rework, time-to-ship, tokens, expert hit rate).
- `scripts/lib/claude-logs.ts` — `.jsonl` reader; sums `usage.*`
  fields with cache-read + cache-creation included at face value
  (per spec §6.1).
- `scripts/lib/git-log.ts` — thin wrapper over `git log --grep` with
  conventional-commit regex; returns `{ fixCommits, featureCommits }`.
- `scripts/lib/devlog.ts` — parses `DEVLOG.md` for `expert consulted`
  entries + `plan changed: yes|no` sibling lines.
- `scripts/__fixtures__/scorecard.expected.json` — snapshot of
  canonical output pinned at a reference git state (Ruslan's current
  machine, 2026-10-14).

**Files modified (portfolio only, after OSS copy):**
- `scripts/scorecard.ts` (vendored) — header comment with
  `// Vendored from claude-shiploop@<commit-sha>, 2026-10-14. Update
  via npm run scorecard:update.`
- `scripts/scorecard.config.ts` (portfolio-specific paths).
- `package.json` scripts: `scorecard` (run parser),
  `scorecard:update` (git subtree pull from OSS).
- `.github/workflows/scorecard-snapshot.yml` — CI step that runs
  `pnpm scorecard` + diffs against `__fixtures__/scorecard.expected.json`;
  fails on mismatch.

**Verify:**
1. `pnpm scorecard` on a stable git state produces identical JSON on
   two consecutive runs (deterministic — no timestamps baked into
   values; `generatedAt` is the only timestamp field).
2. Snapshot fixture test passes locally (`diff` is empty).
3. Config-schema version check: temporarily set `configVersion: 999`
   in a copy of config → parser exits with migration-pointer error.
4. Metric sanity: portfolio `disciplineScore` ≈ 1.0 (all four conventions
   present); Tier 0 projects return nulls for discipline + rework.

**Effort:** ~4h (jsonl parser + git-log wrapper + metrics logic ~3h;
snapshot fixture + CI step ~1h).

---

## Phase C — Portfolio data model (`tokenScorecard` frontmatter + aside)

**Goal:** Each `content/case-studies/*.mdx` can declare a
`tokenScorecard` block; it renders as a sidebar next to Artifacts.

**Files modified:**
- `content/case-studies.ts` — extend `CaseStudyFrontmatter` with
  optional `tokenScorecard?: TokenScorecard` (spec §4.1 type).
  Validator throws if present-but-partial, or if
  `modelMix` percentages don't sum to 100 (±0.1 tolerance).

**Files added:**
- `components/case-study/TokenScorecardAside.tsx` — renders a card
  mirroring `ArtifactList.tsx` structure. Shows: tokens (humanized
  with `k`/`M`), complexity badge, model-mix horizontal bar, duration,
  tier badge. Context tags appear beneath the number in muted caption
  (per spec §5.3).

**Files modified (page integration):**
- `app/(marketing)/work/[slug]/page.tsx` — mount `TokenScorecardAside`
  next to the existing Artifacts aside; stacks on narrow viewports.

**Verify:**
1. `npx tsc --noEmit` clean.
2. One case study (claude-shiploop itself, Phase G) renders both
   asides without layout breakage at 320px / 768px / 1200px.
3. Omitted `tokenScorecard` field → aside doesn't render (component
   returns `null`).

**Effort:** ~1.5h (type + validator ~30min; component ~45min;
page wiring ~15min).

---

## Phase D — Scorecard data: generate + backfill 5 case studies

**Goal:** `scorecard.json` committed in portfolio with real data; 5
existing case studies have `tokenScorecard` frontmatter block populated.

**Pre-flight:** Phase A executed; Phase B parser green.

**Steps (manual-ish, scripted-ish):**
1. Run `pnpm scorecard --out scorecard.json`.
2. Review output — any surprises? (e.g. Fieldmark rework ratio > 1
   would mean fix commits dominate feature commits → caveat in notes).
3. For each case study, lift the per-project block from JSON into the
   MDX frontmatter. Complexity + tier are human-assigned, parser
   produces them from config but Ruslan should audit the labels for
   the 5 case studies.
4. Commit `scorecard.json` + 5 modified `*.mdx` files together.

**Files modified:**
- `content/case-studies/lexora.mdx`, `noble-saas.mdx`,
  `smm-factory.mdx`, `angel-trucking.mdx`, `fieldmark.mdx` —
  add `tokenScorecard` block to each.
- `scorecard.json` (new file, committed).

**Verify:**
1. `next build` passes with frontmatter validator active.
2. Each `/work/<slug>` page renders the TokenScorecardAside with
   non-null tokens (unless Tier 0 fell to null per Phase A bail-out).

**Effort:** ~1h.

---

## Phase E — OSS repo prep (sync, sanitize, docs, install script)

**Goal:** Local `~/shiploop-publish/` folder is a clean git-initialized
tree ready for `git push`. Install script tested on a scratch target
project.

**Pre-flight:** None — can start immediately after spec approval.

**Files added (in a new local staging folder `~/shiploop-publish/`,
NOT inside portfolio):**
- `LICENSE` — MIT, author Ruslan Hrekov.
- `README.md` — pitch (what ShipLoop is, three-sentence hook), install
  one-liner, lifecycle diagram, skill index with one-line each,
  scorecard link (hrekov.dev/tools), case study link.
- `INSTALL.md` — long-form install (curl pipe, manual clone, dry-run
  flag, uninstall notes, speckit-not-included caveat).
- `CONTRIBUTING.md` — how to propose a new skill (frontmatter required
  fields, shiploop-skill-builder reference), PR template, review
  cadence ("I'll look at PRs weekly").
- `install.sh` — curl pipe target. Clones repo to
  `/tmp/claude-shiploop-<timestamp>/`, copies `skills/`, `agents/`,
  `templates/` into `$TARGET/.claude/` (defaults to `./`), prints
  next-step block. Supports `--dry-run`, `--target <path>`.
- `skills/` — copied from portfolio `.claude/skills/` **excluding**
  `blog-drafter`. All 7 remaining skills (shiploop-start, -router,
  -brainstorm, -tester, -observer, -expert, -skill-builder) sanitized:
  - `shiploop-skill-builder/SKILL.md:29` `~/lexora/.claude/skills/`
    → `<project>/.claude/skills/`
  - `shiploop-brainstorm/SKILL.md:92` `"Ruslan | Claude | TBD"`
    → `"<Owner> | <Collaborator> | <TBD>"`
  - grep for any remaining `/Users/ruslan/`, `hrekov.dev`,
    `rusgrekovua`, replace with generic placeholders.
- `agents/expert.md` — copied from portfolio `.claude/agents/expert.md`;
  no capsule references remain, mechanism docs point to `expertise/README.md`.
- `expertise/README.md` — how to generate your own capsule via
  `/shiploop-expert phase=blind-bug`; capsule format spec; warning
  about committing capsules to public repos.
- `templates/CLAUDE.md.template`, `DEVLOG.md.template`,
  `spec.md.template` — generic skeletons (no portfolio-specific
  content).
- `scripts/init-project.sh` — sanitized from `~/shiploop/`.
- `scripts/scorecard.ts` + `scorecard.config.ts` + `lib/*` — same files
  as Phase B, canonical home.
- `.github/ISSUE_TEMPLATE/skill-proposal.md`, `bug-report.md`.
- `.github/PULL_REQUEST_TEMPLATE.md`.
- `.github/workflows/skill-lint.yml` — validates frontmatter + path
  conventions on new skill PRs.
- `.gitignore` — standard Node + macOS + `.env*`.

**Sanitization gate (automated check before push):**
- `grep -rE '(ruslan|hrekov|lexora|noble|angel|fieldmark|smm-factory)'
  ~/shiploop-publish/` → should return only INTENDED references
  (e.g. LICENSE author line, README author line). Any hit outside
  those is a sanitization miss → fix before push.

**Install script smoke test (local, pre-push):**
1. Fresh `mktemp -d` scratch project with just `.git`.
2. `cp ~/shiploop-publish/install.sh /tmp/scratch/install.sh && bash
   install.sh --target /tmp/scratch/` → verify `.claude/skills/*`
   exist, no personal paths in any file.
3. Open scratch project in a new Claude Code session; verify
   `/shiploop-start` responds.

**Verify (OSS-side):**
1. Sanitization grep clean.
2. Install smoke test passes.
3. README renders readably on GitHub web preview (local gh CLI render
   or dry-run via `gh markdown`).

**Effort:** ~5h (sync + sanitize ~2h; docs ~2h; install script + smoke
test ~1h).

---

## Phase F — `/tools` page on hrekov.dev

**Goal:** Public static page at `hrekov.dev/tools` renders scorecard
table + skill grid + install one-liner, no live polling.

**Files added:**
- `app/(marketing)/tools/page.tsx` — `generateStaticParams` not needed
  (single route); reads `scorecard.json` + skill metadata at build time.
- `app/(marketing)/tools/opengraph-image.tsx` — Playfair-embedded OG.
- `components/tools/ScorecardTable.tsx` — 7×5 grid with context-tag
  captions; null cells show "—" with tooltip explaining why.
- `components/tools/SkillGrid.tsx` — card per skill with description,
  invocation example, when-to-use.
- `components/tools/InstallBlock.tsx` — copy-to-clipboard one-liner.
- `content/tools.ts` — static skill metadata (name, description,
  category, invocation, example use).

**Files modified:**
- `components/layout/Nav.tsx` — add Tools link (position TBD; likely
  between Journal and About).
- `app/sitemap.ts` — add `/tools` entry.

**Design constraints (per CLAUDE.md):**
- Monochrome only. No new chromatic accent for the scorecard.
- Tier badges = type labels (hairline border + ink), not colored.
- Context tags render in muted caption below each number (never
  isolated number).
- Mobile: scorecard table becomes vertical cards (per project).

**Verify:**
1. `next build` passes.
2. Rendered at 320px / 768px / 1200px; scorecard legibility checked
   at all three.
3. Contrast on all new fg/bg pairs via
   `python3 /Users/ruslan/.claude/skills/ui-ux-pro/scripts/check_contrast.py`.
4. Click install one-liner → clipboard contains verbatim command.

**Effort:** ~3h.

---

## Phase G — `/work/claude-shiploop` meta case study

**Goal:** Case study #6 published at `/work/claude-shiploop`
following existing authoring guide at `content/case-studies/CLAUDE.md`.

**Pre-flight:** OSS repo pushed (Phase H dependency reversed — see
risk register for timing options).

**Files added:**
- `content/case-studies/claude-shiploop.mdx` — follows case-study
  guide; hero, flow schema, Problem/Decision/Result sections,
  outcomes paragraph, Artifacts list.
- `public/case-studies/claude-shiploop/` — hero image + any
  diagrams. Flow schema metaphor TBD before coding (per
  `feedback_flowschema_metaphor_per_project.md` memory — brief the
  metaphor first, don't reflex to BPMN).

**Files modified:**
- `content/projects.ts` — add `claude-shiploop` entry.
- `app/sitemap.ts` — picks it up automatically from case-studies loader.

**Hero image direction:**
- One frame; monochrome.
- Candidate: terminal screenshot showing install one-liner →
  skill tree rendering. Or: scorecard snippet (hero crops to one
  row showing Tier badges + context tags).
- Final decision: open the real `/tools` page screenshot after
  Phase F ships; if it reads as the hero, use it.

**Writing scope:**
- Why OSS now (recruiter case studies describe output; this one is
  the input).
- Scope decisions (capsules out, expert mechanism in).
- Measurement design (why 5 separate metrics, not composite).
- Attribution procedure (Phase A as a scope sidebar).
- Outcomes section: C-fallback applies here — if simultaneous launch
  (default), outcomes = ship metrics (lines moved, time to publish,
  skill count); if delayed launch, outcomes include first-week
  signals.

**Verify:**
1. `next build` passes.
2. Executive view + technical view both legible (ViewToggle works —
   case study has `recruiterSummary` + `supportingArtifacts` fields).
3. Hero image at 1200×630 for OG, 1100×700 for in-page hero.
4. Playfair OG renders (per `app/(marketing)/work/[slug]/opengraph-image.tsx`).

**Effort:** ~4h (writing ~2.5h; hero image ~1h; wiring ~30min).

---

## Phase H — Launch day coordination

**Goal:** Repo pushed public, `/tools` deployed, case study deployed,
LinkedIn + dev.to posts scheduled through existing cross-poster.

**Default sequence (same day):**
1. OSS repo: `gh repo create ruslan4427/claude-shiploop --public
   --license mit --description "..."` → `git push origin main`.
2. Verify install one-liner works against the live raw URL:
   `curl -sSL https://raw.githubusercontent.com/ruslan4427/claude-shiploop/main/install.sh
   | bash --dry-run --target /tmp/live-test/`.
3. Merge portfolio PR with `/tools` + `/work/claude-shiploop` +
   `scorecard.json` + 5 backfilled case studies.
4. Verify Vercel deploy green; smoke-test `/tools` and
   `/work/claude-shiploop` on production.
5. Draft announcement blog post at
   `content/blog/shipping-claude-shiploop.mdx` — format `pattern` or
   `case-study`. Add entry to `content/blog/schedule.yml` with
   `scheduledFor` set to the launch window.
6. Cross-poster cron picks it up on its hourly tick (`:15`); LinkedIn
   + dev.to post land within 60 minutes.

**C-fallback trigger** (per spec §10.6): if during Phase G drafting a
section requires real adoption data that doesn't yet exist, pause and
reorder:
- Day 1: steps 1 + 2 (repo public) + minimal `/tools` (no case study yet).
- Days 1–7: watch GitHub stars / clones. If any adopter DMs or opens
  an issue, capture quotes.
- Day +7: steps 3 + 4 + 5 with case study + blog post citing early signals.

**Files added (if simultaneous):**
- `content/blog/shipping-claude-shiploop.mdx`.
- Schedule entry in `content/blog/schedule.yml`.

**Verify:**
1. `gh repo view ruslan4427/claude-shiploop --web` renders README
   correctly.
2. `curl -sSL <install-url> | bash --dry-run` output matches local
   smoke test from Phase E.
3. Production `/tools` loads scorecard; no console errors.
4. First cross-poster run publishes announcement; LinkedIn + dev.to
   URLs populate in frontmatter via existing cron.

**Effort:** ~1.5h active (plus passive wait for cross-poster tick).

---

## Total effort

~22h engineering. Natural sequencing: A (session attribution) can run
in parallel with E (OSS prep) since they touch different trees. B
needs A done for Tier 0 numbers. C unblocks D. F reads from the output
of B+D. G needs the repo at least partly real (install URL in body);
H needs F + G both ready.

Realistic calendar: 4–5 focused days spread over ~1 week, assuming no
blockers at Phase A (session attribution confidence).

---

## Risk register

| # | Risk | Mitigation |
|---|------|------------|
| 1 | Attribution confidence < 50% across all three Tier 0 projects — not enough signal to reconstruct token numbers | Phase A bail-out → Tier 0 tokens all null with explanatory note. Doesn't block anything downstream; scorecard just loses one row's worth of data. |
| 2 | `shiploop-skill-builder` or any other skill retains personal paths after sanitization | Sanitization gate grep in Phase E must return clean before push. If any hit, iterate until clean. Backup: `gh repo delete` + rebase if a leak reaches public main (destructive, requires explicit ok). |
| 3 | Parser snapshot fixture goes stale (new session logs change the number) | CI diff failing is the detection. Resolution path: rerun parser locally, commit new fixture, mention in PR. Fixture is intentionally brittle — surfaces drift. |
| 4 | `/tools` scorecard table is unreadable on mobile (7 projects × 5 metrics + context tags = cell density) | Mobile fallback: scorecard becomes per-project vertical cards with headings. Design pass in Phase F pins this before merge. |
| 5 | Vercel ignores `scorecard.json` git-add because of some gitignore inherited rule → stale data in prod | Explicit `!scorecard.json` line in `.gitignore` if any ancestor rule shadows it. Verify after Phase D commit lands. |
| 6 | Install script works on bash but fails on zsh / fish / dash | `#!/usr/bin/env bash` in shebang + explicit `bash install.sh` in README (not `./install.sh`). Smoke test on both bash + zsh in Phase E. |
| 7 | Case study #6 wants adopter quotes that don't exist on day-1 launch (default simultaneous timing) | C-fallback (spec §10.6): split launch, delay case study + blog by 7 days. Decision gate = Phase G draft review. |
| 8 | `gh repo create` fails because `ruslan4427/claude-shiploop` is already a reserved / taken name (unlikely but possible) | Pre-check: `gh repo view ruslan4427/claude-shiploop` in Phase E; if exists and not ours, name alternative = `claude-shiploop-oss` or `shiploop`. Update spec + install URL docs. |
| 9 | LinkedIn / dev.to cross-poster can't handle a post that embeds code fences + install URL (plaintext renderer strips the code block, LinkedIn ends up with "see full post" placeholder for the ONE command people need) | Renderer handling exists (Sprint 14 risk #3); for this specific post, hand-write a LinkedIn version with the one-liner as plain text (no fence) + canonical link. Override via `distribution.linkedin.body` field if cross-poster supports it; else manual LinkedIn post for this one. |
| 10 | Tier labeling drift — Fieldmark's `test_plan.md` is honored as Tier 1 but someone (adopter) argues "that's just a doc, not a spec" and the tier model gets questioned | Methodology aside on `/tools` is explicit: tier = human judgment on "did a formal planning artifact exist before build began". Fieldmark meets the bar. Document the rule, don't try to argue it is "objective". |

---

## Notes on ShipLoop discipline

- Phases A + D are S-class (small scripts + manual data lift).
- Phases B + C + F are M-class; Phase E + G are L-class (lots of
  content + multiple files).
- Phase H is coordination, not engineering.
- Every phase closes with a `Problem/Decision/Result/Lesson` DEVLOG
  entry.
- Memory checkpoint at Sprint 15 close: `memory/iteration-15.md`
  (shipping + first adoption signals if any).
- Expert consultation recommended (per CLAUDE.md L-class protocol):
  `phase=in-progress` after Phase B parser lands (parser correctness
  is the single highest-risk code in the sprint); `phase=pre-ship`
  before Phase H push.
