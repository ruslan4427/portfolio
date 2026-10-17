# Tasks — Sprint 15 · claude-shiploop OSS release + scorecard

Sequential within a phase. Cross-phase order (per plan.md): A ∥ E can
start immediately; B needs A; C unblocks D; F reads B+D; G needs E
pushed; H needs F+G. Expert consult recommended after B2–B6 land
(parser correctness) and before H1 (pre-ship).

---

## Phase A — Session attribution (DIAGNOSTIC ONLY — bail-out triggered)

Result of 2026-10-14 scan: SINGLE rate 0/123 (0%), well below 50%
threshold. Reorg abandoned. Tier 0 tokens = null in scorecard with
"not reconstructable from mixed home-dir sessions" note. See spec
§10.1 for findings.

- [x] **A1.** Pre-flight backup — `cp -r ~/.claude/projects/-Users-ruslan
  ~/.claude/projects/-Users-ruslan.bak-2026-10-14`; sizes verified
  (269M each). Backup can be removed after cooling period; no
  destructive op was taken.
- [x] **A2.** Keyword fixture at
  `scripts/__fixtures__/attribution-keywords.mjs` with 6 project
  maps (3 REORG targets + 3 CONTEXT targets for visibility).
- [x] **A3.** Attribution scanner at `scripts/attribute-sessions.mjs`
  (streaming JSONL parse). Emits `tmp/attribution-report.csv` with
  session_id, project_slug, classification, hit_counts_json,
  timestamps, message_count, corpus_length.
- [x] **A4.** Report reviewed. Findings: 0 SINGLE, 2 MIXED mega-sessions
  (97MB + 163MB, multiple projects interleaved), 3 CONTEXT_ONLY tiny
  fieldmark pings, 118 UNCLASSIFIED (median 1-2 messages). Angel
  Trucking: zero hits across all 123 sessions.
- [ ] ~~**A5.** Execute move script~~ — skipped, bail-out triggered.
- [ ] ~~**A6.** Dry-run~~ — skipped.
- [ ] ~~**A7.** Live run~~ — skipped.
- [x] **A8.** Bail-out acknowledged in spec §10.1. Phase B
  `scorecard.config.ts` will set Tier 0 tokens = null with
  explanatory note.
- [x] **A9.** DEVLOG entry — appended 2026-10-14 covering scan findings, bail-out rationale, and the invented-name correction.

## Phase B — Scorecard parser (canonical in OSS, vendored in portfolio)

Parser is authored canonically for the OSS repo structure (`scripts/`
at OSS root) but developed inside portfolio at
`scripts/scorecard-src/` first; copied into OSS staging dir
(`~/shiploop-publish/scripts/`) in Phase E. Portfolio keeps a copy at
`scripts/scorecard.ts` after Phase E lands.

Phase pivot (2026-10-14): tsx isn't installed and repo convention is
`.mjs`. All Phase B scripts authored as `.mjs` (ESM); config exports
`REQUIRED_CONFIG_VERSION` + `SCORECARD_CONFIG`. `modelMix` + `duration`
in config are FALLBACKS — overridden by measured values when `logPath`
is readable.

- [x] **B1.** Config at `scripts/scorecard-src/scorecard.config.mjs`
  — exports `REQUIRED_CONFIG_VERSION = 1`, `SCORECARD_CONFIG` with 7
  projects (`slug, name, tier, repoPath, logPath, startDate, shipDate,
  complexity, modelMix, duration, notes`).
- [x] **B2.** `scripts/scorecard-src/lib/claude-logs.mjs` —
  `readSessionTokens(logDir)` streams every `.jsonl` via
  `node:readline`, sums `input + output + cache_read + cache_creation`
  per assistant message, attributes to opus/sonnet/haiku via exact
  model-ID map + substring fallback. Returns
  `{total, byModel, sessionCount, firstTs, lastTs} | null`. Verified:
  Portfolio 1.48B · Fieldmark 82.7M · Noble SaaS 26.4M.
- [x] **B3.** `scripts/scorecard-src/lib/git-log.mjs` —
  `countCommits(repoPath)` runs `git log --format=%s`, counts fix /
  feat prefixes (incl. `chore(fix)`, `chore(add)` variants).
  `reworkRatio(counts)` returns `fix/feat`, `null` for zero
  conventional, `Infinity` for feat=0 && fix>0. Portfolio rework
  0.38 (lowest meaningful); SMM Factory 4.5 (highest).
- [x] **B4.** `scripts/scorecard-src/lib/devlog.mjs` —
  `scanDevlog(repoPath)` returns `{consulted, planChangedYes,
  planChangedNo} | null`. `expertHitRate(stats)` =
  `yes / (yes + no)` or null. Convention not yet enforced — all
  projects currently return null (honest "no data yet").
- [x] **B5.** `scripts/scorecard-src/lib/metrics.mjs` —
  `disciplineScore(repoPath)` returns `{score (N/4), criteria} |
  null`; `medianTimeToShip(repoPath)` returns `{medianDays, count,
  perSpec} | null`. Date regex matches `**Date.**` (period-in-bold,
  portfolio convention), `**Date**:`, and `date:` frontmatter.
  Portfolio TTS=1 across n=5.
- [x] **B6.** `scripts/scorecard-src/scorecard.mjs` — main entry.
  Validates `configVersion`, composes per-project
  `{slug, name, tier, metrics, context, details, notes}`, writes JSON
  with top-level `generatedAt` + `configVersion` + `projects` array.
  Measured `modelMix` + `duration` override config fallbacks when
  session logs exist. Main runs only when invoked directly (guarded
  for shape-check import).
- [x] **B7.** `scripts/__fixtures__/scorecard.expected.json` — current
  snapshot committed (regenerated via `npm run scorecard`).
  `scripts/scorecard-src/snapshot-check.mjs` shape-diffs STRUCTURE
  (project set + metric keys + context keys + value types) rather than
  strict values — values drift every commit, shape doesn't. Negative-
  path tested: removing a metric key triggers FAIL exit 1 with the
  drifted key listed.
- [ ] ~~**B8.** Create `.github/workflows/scorecard-snapshot.yml`~~ —
  deferred to Phase E. OSS canonical parser doesn't exist yet, so
  cross-copy drift detection is premature. CI diff lives beside the
  OSS repo prep tasks.
- [ ] ~~**B9.** Config-version regression test~~ — deferred to
  Phase E. The lockstep guard IS implemented in `scorecard.mjs`
  (`if (SCORECARD_CONFIG.configVersion !== REQUIRED_CONFIG_VERSION)
  exit(2)`) and `snapshot-check.mjs` (same guard before shape diff).
  A fixture-based regression test is only valuable alongside the OSS
  copy's parallel version — ship both together in Phase E.
- [x] **B10.** `package.json` scripts: `scorecard` runs the parser to
  `scripts/__fixtures__/scorecard.expected.json`; `scorecard:check`
  runs the shape-diff.
- [x] **B11.** DEVLOG entry appended 2026-10-15 — all four metric
  surfaces, surprise findings (Lexora 4/4 discipline from speckit era,
  Portfolio TTS=1 day median), deferred-to-E note on B8/B9, structural
  vs value-level snapshot lesson.

## Phase C — Portfolio data model (`tokenScorecard` frontmatter + aside)

- [x] **C1.** `content/case-studies.ts` gained `TokenScorecard` +
  sub-types (`TokenScorecardComplexity|Tier|ModelMix`), optional
  field on `CaseStudyFrontmatter`, and `validateTokenScorecard()`
  wired into `getCaseStudy()`. Validator throws at LOAD time (not
  only build) so bad blocks fail obviously in dev.
- [x] **C2.** `components/case-study/TokenScorecardAside.tsx` —
  Playfair numeric + humanized unit (k/M/B), three stat rows
  (Complexity · Duration · Tier), horizontal `MixBar` with
  proportional ink/body/muted segments on a hairline track + inline
  legend. `role="img"` + `aria-label` on the bar. Returns `null`
  when scorecard undefined.
- [x] **C3.** Mounted in `app/(marketing)/work/[slug]/page.tsx`
  before `ArtifactList`, same `max-w-[65ch]` stacked-aside column.
  **Deviation from plan:** no side-by-side grid — Artifacts is
  stacked, not sidebar; matched the existing layout. Documented in
  Phase C DEVLOG entry.
- [x] **C4.** `npx tsc --noEmit` clean. Visual smoke on
  `/work/fieldmark` with a temporary `tokenScorecard` block →
  renders at 375 / 768 / 1200 widths with correct humanization
  (82.7M tokens), accurate 89/11 mix bar, no overflow. Contrast
  pass (18.88 / 14.38 / 5.36 on bg-elevated). Temp edit reverted.
- [x] **C5.** DEVLOG entry appended 2026-10-15 covering validator
  rationale, layout deviation, and the "validate at load time"
  lesson.

## Phase D — Scorecard data generation + backfill

- [ ] **D1.** Run `pnpm scorecard --out scorecard.json`. Commit the
  file to portfolio repo root.
- [ ] **D2.** Review `scorecard.json` output — any suspicious cell?
  Add `notes` sentence in config for each cell that reads strangely
  (e.g. Fieldmark `reworkRatio > 1`, if that happens). Re-run parser.
- [ ] **D3.** For each of 5 case studies — Lexora, Noble SaaS, SMM
  Factory, Angel Trucking, Fieldmark — add `tokenScorecard` block to
  frontmatter in `content/case-studies/<slug>.mdx`. Pull values from
  `scorecard.json`; audit complexity + tier labels for each.
- [ ] **D4.** Verify `next build` passes with validator active.
  Spot-check each `/work/<slug>` page in dev — aside visible with
  non-null tokens where applicable.
- [ ] **D5.** DEVLOG entry — token totals per project; any null cells
  explained.

## Phase E — OSS repo prep (local staging)

Everything in this phase lives at `~/shiploop-publish/` on local disk,
NOT inside the portfolio tree. First `git init && git push` happens
in Phase H.

- [ ] **E1.** `mkdir -p ~/shiploop-publish && cd ~/shiploop-publish`.
- [ ] **E2.** Copy portfolio `.claude/skills/` → `skills/` **excluding**
  `blog-drafter`. 7 skills land: shiploop-start, -router,
  -brainstorm, -tester, -observer, -expert, -skill-builder.
- [ ] **E3.** Copy portfolio `.claude/agents/expert.md` → `agents/expert.md`.
- [ ] **E4.** Sanitization sweep — grep for personal references and
  replace per spec §3.2:
  - `shiploop-skill-builder/SKILL.md:29` `~/lexora/.claude/skills/` →
    `<project>/.claude/skills/`
  - `shiploop-brainstorm/SKILL.md:92` `"Ruslan | Claude | TBD"` →
    `"<Owner> | <Collaborator> | <TBD>"`
  - `grep -rE '(ruslan|hrekov|lexora|noble|angel|fieldmark|smm-factory|rusgrekovua)' ~/shiploop-publish/`
    — iterate until the only remaining hits are INTENDED (LICENSE
    author, README author line, scorecard examples pointing at
    hrekov.dev/tools). Document each intended hit in a
    `tmp/sanitization-whitelist.txt`.
- [ ] **E5.** Create `~/shiploop-publish/LICENSE` — MIT text,
  copyright "2026 Ruslan Hrekov".
- [ ] **E6.** Create `~/shiploop-publish/README.md` — pitch (what
  ShipLoop is in 3 sentences), install one-liner, lifecycle diagram
  (ASCII or small SVG), skill index with one-line each, link to
  `hrekov.dev/tools` for scorecard, link to case study, link to
  `CONTRIBUTING.md`.
- [ ] **E7.** Create `~/shiploop-publish/INSTALL.md` — long-form:
  curl pipe, manual clone, `--dry-run` flag, `--target <path>` flag,
  uninstall note (`rm -rf <project>/.claude/`), speckit-not-included
  caveat.
- [ ] **E8.** Create `~/shiploop-publish/CONTRIBUTING.md` — how to
  propose a new skill, frontmatter required fields,
  shiploop-skill-builder reference, PR template location, review
  cadence ("I review PRs weekly").
- [ ] **E9.** Copy `~/shiploop/init-project.sh` →
  `~/shiploop-publish/scripts/init-project.sh`. Sanitize per E4.
- [ ] **E10.** Create `~/shiploop-publish/install.sh`:
  - Shebang: `#!/usr/bin/env bash`
  - Flags: `--dry-run`, `--target <path>` (default `./`), `--help`
  - Clone to `/tmp/claude-shiploop-$(date +%s)/` (or re-use if cached
    within 1h)
  - Copy `skills/`, `agents/`, `templates/`, `expertise/` into
    `$TARGET/.claude/` (preserving structure)
  - Dry-run logs intended `cp` operations without executing
  - On success print one-screen "what next" message pointing at
    `/shiploop-start`
- [ ] **E11.** Create `~/shiploop-publish/expertise/README.md` — how
  to generate your own capsule via `/shiploop-expert phase=blind-bug`;
  capsule format spec (short); warning about committing capsules to
  public repos ("capsules may contain project context").
- [ ] **E12.** Create `~/shiploop-publish/templates/CLAUDE.md.template`,
  `DEVLOG.md.template`, `spec.md.template`. Generic skeletons — no
  portfolio-specific content.
- [ ] **E13.** Copy canonical scorecard parser from
  `scripts/scorecard-src/` →
  `~/shiploop-publish/scripts/scorecard.mjs` (+ `lib/*`, `*.config.mjs`).
- [ ] **E13a.** (deferred from B8) Add
  `.github/workflows/scorecard-snapshot.yml` to BOTH repos — on PR +
  push to main, run `npm run scorecard:check`. OSS copy + portfolio
  copy each guard their own vendored tree; `REQUIRED_CONFIG_VERSION`
  bumps must land in lockstep across both or the next merge fails.
- [ ] **E13b.** (deferred from B9) Config-version regression fixture
  at `scripts/__fixtures__/scorecard.config.v999.mjs` with
  `configVersion: 999`; smoke-script in both repos asserts non-zero
  exit + "configVersion mismatch" in stderr when loaded against the
  current parser.
- [ ] **E14.** Create `~/shiploop-publish/.github/ISSUE_TEMPLATE/`
  with `skill-proposal.md` and `bug-report.md`. Create
  `PULL_REQUEST_TEMPLATE.md` at `.github/` root.
- [ ] **E15.** Create `~/shiploop-publish/.github/workflows/skill-lint.yml`
  — validates frontmatter + path conventions on new skill PRs.
- [ ] **E16.** Create `~/shiploop-publish/.gitignore` — standard Node
  + macOS + `.env*`.
- [ ] **E17.** Install smoke test —
  `mktemp -d /tmp/claude-shiploop-smoke.XXXXXX`,
  `bash ~/shiploop-publish/install.sh --target <tmp-dir>`, verify
  `.claude/skills/*` exist, run final sanitization grep against the
  installed tree.
- [ ] **E18.** Repeat smoke under zsh (`zsh -c 'bash install.sh --target
  <tmp-dir>'`) to confirm shebang + explicit `bash` invocation works.
- [ ] **E19.** `git init && git add -A && git status` in
  `~/shiploop-publish/`. Review file tree one final time. Don't
  push yet — Phase H commits and pushes.
- [ ] **E20.** DEVLOG entry — files touched, sanitization iterations,
  smoke test result.

## Phase F — `/tools` page on hrekov.dev

- [ ] **F1.** Create `content/tools.ts` — static metadata for skills:
  `[{ name, slug, category, description, invocation, whenToUse }]`.
  Hand-authored (not derived from skill files) so marketing copy
  can differ from internal frontmatter.
- [ ] **F2.** Create `components/tools/InstallBlock.tsx` — monospace
  pre with the install one-liner; copy button triggers
  `navigator.clipboard.writeText(cmd)`; "Copied" feedback for 2s.
- [ ] **F3.** Create `components/tools/SkillGrid.tsx` — grid at 2
  columns ≥768px, 1 at < 768px. Card per skill: name (Playfair h3),
  description, invocation example (monospace inline), when-to-use.
- [ ] **F4.** Create `components/tools/ScorecardTable.tsx` — reads
  `scorecard.json` at build time. 7×5 grid at desktop (project rows,
  metric columns) with context-tag captions below each number. Null
  cells render "—" with tooltip containing the `notes` string.
  Mobile fallback: per-project vertical cards, metrics stacked.
- [ ] **F5.** Create `components/tools/ScorecardMethodology.tsx` —
  aside explaining each metric's formula (per spec §5.1), tier
  assignment criteria, and the "null is honest" rule.
- [ ] **F6.** Create `app/(marketing)/tools/page.tsx` — assembles
  hero (`SectionBadge` + Playfair h1 + 1-paragraph pitch) →
  `InstallBlock` → `SkillGrid` → `ScorecardTable` →
  `ScorecardMethodology`. Metadata: title "Tools",
  description from spec one-liner.
- [ ] **F7.** Create `app/(marketing)/tools/opengraph-image.tsx` —
  mirror structure of `app/(marketing)/work/opengraph-image.tsx`;
  "Tools" eyebrow, "ShipLoop ecosystem" headline.
- [ ] **F8.** Update `components/layout/Nav.tsx` — add Tools entry.
  Position: between Journal and About.
- [ ] **F9.** Update `app/sitemap.ts` — add `/tools` with current
  date as `lastmod`.
- [ ] **F10.** Contrast + accessibility check — run
  `python3 /Users/ruslan/.claude/skills/ui-ux-pro/scripts/check_contrast.py`
  on each new fg/bg pair. Focus states on install-copy button + any
  interactive scorecard cell visible.
- [ ] **F11.** Visual verify at 320px / 768px / 1200px in dev;
  screenshot both desktop + mobile scorecard. If mobile illegible,
  revise F4 fallback.
- [ ] **F12.** DEVLOG entry.

## Phase G — `/work/claude-shiploop` meta case study

- [x] **G1.** FlowSchema brief at `tmp/flowschema-brief.md`. Rejected rings
  (layer cake, not story), timeline (sprint log, not arc), ActivityChart
  (duplicates `/tools`), WireflowMap (right for parser deep-dive, wrong for
  methodology pitch). Pick: two-row FlowSchema — naked `Dev→Prompt→Code→
  Did it work?` with self-loop + `rework ×4.5` badge; ShipLoop `Router→Spec
  →Plan→Tasks→Build→QA→Ship→Retro` linear + `rework 0.38` badge.
- [x] **G2.** `claude-shiploop` added to `content/projects.ts` as slug 07,
  featured, roleTags `[full-stack, consulting]`, stackTags `[node, ai]`.
- [x] **G3.** `public/case-studies/claude-shiploop/` created; hero landed
  in G5.
- [x] **G4.** `content/case-studies/claude-shiploop.mdx` drafted. 12-section
  long-form variant (hrekov-dev / noble-saas precedent): Cold open ·
  Lifecycle contract · Context · Problem · Division of Labor · Prompt
  Architecture · Iteration Moment · Trade-Offs · Attribution procedure
  sidebar · Measurement algorithm · Results (honest) · Reflection.
  `recruiterSummary`, `supportingArtifacts`, `devlogRefs` all populated.
- [x] **G5.** Hero captured via `scripts/screenshot-shiploop-hero.mjs` —
  Playwright 1600×5000 / 2× DPR → sharp scale/crop → webp 1100×700, 23 KB.
  Monochrome gradient Tier 0 → Fieldmark Tier 1 → Portfolio Tier 2 →
  claude-shiploop Tier 2.
- [x] **G6.** Dynamic `[slug]/opengraph-image.tsx` renders for
  `claude-shiploop` at the hashed URL — spot-checked, Playfair embedded.
- [x] **G7.** Simultaneous launch (NOT C-fallback). Results section ships
  with 5 ship-side metrics + explicit "adoption is Phase H+" disclaimer;
  splitting would undercut "null is honest" and stall the OSS repo for a
  week on soft signal.
- [x] **G8.** `next build` passes; `/work/claude-shiploop` in SSG list;
  Playfair OG renders. Closed two drifts: (1) TechNotes schema — missing
  `kind` crashed prerender via `techNoteKindMeta[undefined].glyph`; rewrote
  6 items with full `{kind,label,title,description,href}` schema and renamed
  `caption`→`title`. (2) `verify:numbers` 18 drifts in hrekov-dev prose
  (Sprint 14 → Sprint 15 state); 16 edits in MDX + 2 in projects.ts.
  TechnicalDetail native `<details>` disclosures render inline; no ViewToggle
  needed for long-form variant.
- [x] **G9.** DEVLOG entry — appended 2026-10-15 covering FlowSchema brief,
  hero scorecard composition, TechNotes schema fix, hrekov-dev drift
  reconcile, §9 long-form deviation, simultaneous-launch rationale.

## Phase H — Launch day

- [x] **H1.** Expert pre-ship consult — ran `/shiploop-expert
  phase=pre-ship` read-only sweep across install.sh, sanitization,
  README, scorecard aside. No critical findings; proceeded.
- [x] **H2.** `gh repo view ruslan4427/claude-shiploop` returned
  "not found" — name available, no fallback needed.
- [x] **H3.** Initial commit on `~/shiploop-publish` created
  under the ShipLoop-v2.0 release message.
- [x] **H4.** `gh repo create` published to
  `github.com/ruslan4427/claude-shiploop` (public, MIT via
  LICENSE in source tree — had to drop `--license mit` flag because
  gh refuses `--license` + `--source` together).
- [x] **H5.** Live install dry-run from fresh `mktemp -d` scratch
  dir printed the expected clone-path output. First run short-circuited
  to local source because shell was still in `~/shiploop-publish` which
  has a `skills/` subdir — fixed by relocating. Logged as a drift note.
- [x] **H6.** Portfolio PR #1 opened; CI shape-check green; merged
  as `ef52940`.
- [x] **H7.** Production smoke after redeploy: `/tools`,
  `/work/claude-shiploop`, `/work`, both OG images → 200. First
  prod build on the merge commit errored on a transient Vercel
  Turbopack font-resolver failure (`next/font/google queries
  have exactly one entry`); `vercel redeploy` on the failed
  deploy succeeded with no code change.
- [x] **H8.** `content/blog/shipping-claude-shiploop.mdx` drafted as
  `format: case-study`. Install one-liner written as inline backticks
  so the LinkedIn stripper preserves it as plain text (code fences
  would be replaced by `[code omitted — see full post]`). Verified by
  running `renderPlainTextForLinkedIn` on the MDX — 2899/2900 chars,
  install line survives. Because the auto-render truncates at a soft
  spot inside "Null is honest", LinkedIn status is `manual` and a
  tighter ~1480-char hand-written body sits at
  `tmp/linkedin-shipping-claude-shiploop.txt` for Monday copy-paste.
  Dev.to scheduled 2026-10-19T13:00:00Z (US-East 09:00) in
  `content/blog/schedule.yml`.
- [ ] **H9.** _Not applicable — G7 default (simultaneous launch) was
  chosen; H8 shipped same window._
- [x] **H10.** DEVLOG entry appended 2026-10-16 covering: launch-day
  pacing feedback (gates at every public step, memory file written),
  `gh repo create --license + --source` incompatibility, Vercel
  production build transient font-resolver failure resolved via
  `vercel redeploy` with no code change.

---

## Sprint close checklist

- [ ] All 6 case study + N blog post routes still build clean.
- [ ] `pnpm scorecard` deterministic (two consecutive runs produce
  identical JSON apart from `generatedAt`).
- [ ] `scorecard-snapshot.yml` CI step green on main.
- [ ] `npx tsc --noEmit` clean.
- [ ] `github.com/ruslan4427/claude-shiploop` public, MIT, README
  renders readably on GitHub web.
- [ ] `curl -sSL <install-url> | bash --dry-run` succeeds from a
  fresh scratch dir.
- [ ] `/tools` live on hrekov.dev with scorecard + skill grid +
  install one-liner. Mobile legible.
- [ ] `/work/claude-shiploop` live; both views (executive +
  technical) legible.
- [ ] Announcement blog post published to dev.to + LinkedIn via
  cross-poster (or manual LinkedIn if hand-written).
- [ ] `memory/iteration-15.md` written with: phases shipped, Phase A
  attribution rate, bail-out triggered yes/no, launch timing (default
  or C-fallback), first-week adoption signals (if any).
- [ ] `STABLE_LOGIC.md` gains an entry for the vendored-parser
  update protocol (bump versions in config header + fixture + CI
  diff + commit SHA pin).
