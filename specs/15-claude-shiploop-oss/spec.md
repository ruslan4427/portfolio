# Spec — Sprint 15 · claude-shiploop OSS release + effectiveness measurement framework

**Class.** L (new external repo, measurement parser, 2 new pages, > 3 files, multi-day)
**Date.** 2026-10-14
**Owner.** Ruslan (strategic decisions, repo creation, review), Claude Opus (implementation, measurement parser, docs)

---

## 1. Why this exists

The ShipLoop ecosystem — the `.claude/` skills, agents, capsules, and the
discipline wrapped around them — already produces measurable value inside
this portfolio (3/3 blind-bug validation on `shiploop-expert`, 100% spec
coverage on post-2026-09-20 commits, zero rework commits on Sprint 11+).
Zero of that value is accessible to anyone outside this repo.

A local snapshot of the framework exists at `~/shiploop/` (6 skills,
init-project.sh, templates, README) but it's not git-initialized, not on
GitHub, and drifts behind the portfolio's working copy. Portfolio's
`.claude/` has `shiploop-expert` and `blog-drafter` that never made it back
to `~/shiploop/`.

The content strategy locked in Sprint 10 identified Claude-devs / potential
colleagues as a secondary audience. For that audience the recruiter-first
case studies on `/work/*` undersell the real differentiator — the
systematic way this work gets shipped. Case studies describe the output;
the ecosystem is the input. Publishing the ecosystem turns that from an
inferable "something is going on under the hood" into a cloneable repo.

Without numbers, the publication is marketing. Claude-devs will — correctly —
discount any "ShipLoop saves X" claim unless it's backed by a scorecard
they can inspect. The spec therefore scopes both the OSS release AND the
measurement framework that fronts it.

## 2. What must stay the same

- Portfolio `.claude/` remains the **source of truth** for development
  work. OSS repo is synced FROM portfolio, not the other way around.
- Monochrome editorial design on hrekov.dev. No new chromatic accent for
  the `/tools` page. One green dot stays functional (availability only).
- ShipLoop protocol applied to this release — this spec, a plan, tasks,
  DEVLOG entries per work block. Eating own dog food is itself a
  demonstration.
- No speckit integration. CLAUDE.md is explicit: speckit is NOT installed
  and specs are authored manually. The OSS release must match that
  reality — remove or re-caption `~/shiploop/`'s `/speckit-*` references.
- Visual system, motion contract, DotGrid rules — untouched. All new UI
  (/tools, /work/claude-shiploop) uses existing design tokens.
- Capsules stay out of OSS. The expert mechanism ships; the pre-made
  capsules in `.claude/expertise/*` do not.

## 3. Scope

### In

1. **GitHub repo `claude-shiploop`** created under `github.com/ruslan4427`.
   MIT license. Published state after cleanup: synced skills, scripts,
   templates, LICENSE, README, INSTALL, CONTRIBUTING.

2. **Skill sync + sanitization.** Portfolio's `.claude/skills/` → OSS
   `skills/` with:
   - `shiploop-expert` added (currently portfolio-only)
   - `shiploop-skill-builder` reviewed; keep if non-obsolete, drop
     if superseded
   - `blog-drafter` excluded (project-specific)
   - All personal references stripped: `~/lexora/` path in
     `shiploop-skill-builder/SKILL.md:29`, `"Ruslan | Claude | TBD"`
     in `shiploop-brainstorm/SKILL.md:92`, any other hardcoded names

3. **Install script** — one-liner `curl` pipe that:
   - Clones repo to a user-chosen temp dir (or uses local cache)
   - Copies `skills/`, `agents/` (if any), and template files into
     `<target-project>/.claude/`
   - Prints a one-screen "what next" message pointing at
     `/shiploop-start`
   - No speckit assumption; no npm/pip/git-submodule dependency

4. **Expert workflow docs.** `.claude/expertise/README.md` in the OSS
   release explains: run `/shiploop-expert phase=blind-bug` with a
   symptom → agent researches YOUR domain → drafts a capsule → you
   approve/edit → saves locally. Example output format included;
   no example capsules.

5. **Measurement parser** (`scripts/scorecard.ts` in portfolio repo —
   NOT in OSS release; metrics stay with portfolio since baseline
   data is portfolio-owned):
   - Reads git log from each project repo (via path config)
   - Reads DEVLOG.md entries
   - Reads Claude Code `.jsonl` session logs from `~/.claude/projects/`
   - Emits JSON `scorecard.json` with per-project 5-metric breakdown +
     context tags
   - CLI: `pnpm scorecard --out scorecard.json`

6. **`/tools` page on hrekov.dev** (new route `app/(marketing)/tools/`):
   - Hero: what the ecosystem is, one install line, repo link
   - Skill grid: card per skill with description, invocation example,
     when to use
   - **Scorecard table**: 7 projects × 5 metrics, each cell shows
     number + context tags (complexity, model mix, duration, tier)
   - Measurement methodology aside: how each metric is calculated,
     with link to parser source
   - No live polling; data generated at build time from `scorecard.json`
     committed to repo

7. **`/work/claude-shiploop` case study** (new MDX at
   `content/case-studies/claude-shiploop.mdx`):
   - Meta #6 case study — "shipping my own tools"
   - Follows existing case-study authoring guide
   - Covers: why OSS, scope decisions, measurement framework design,
     outcomes (first-week adoption if any, otherwise shipping metrics)
   - Links to `/tools` for live scorecard, GitHub for repo

8. **Per-case-study token aside** — new MDX component +
   frontmatter field:
   - `tokenScorecard` block in frontmatter: `{ tokens, complexity,
     modelMix, duration, tier }`
   - Rendered as a sidebar aside (next to Artifacts) on each
     `/work/<slug>` page
   - Backfill: 5 existing case studies get their blocks populated
     from parser output

### Out

- **Capsules in OSS release.** `.claude/expertise/*` stays local.
  README + expert mechanism docs explain how to generate your own.
- **Hosted dashboard.** No service, no analytics-as-a-service, no
  "ShipLoop metrics for YOUR repo" tool. Local-only.
- **npm / pip packaging.** Install is curl-pipe-bash + file copy;
  no package manager publication for v1. If demand lands, that's
  v2.
- **`blog-drafter` skill.** Project-specific to this portfolio;
  stays local.
- **speckit integration.** Not installed per CLAUDE.md; references
  stripped from OSS release docs and templates. Users who want
  speckit install it separately.
- **Real-time dashboard** / live-updating scorecard. Build-time
  generation only.
- **Non-Claude support.** The repo is for Claude Code users. No
  Cursor / Cline / Aider wrappers.
- **Composite effectiveness number.** Scorecard shows 5 metrics
  separately. No synthesized score.
- **Pre-made capsules.** Not in v1. Possibly a sanitized
  example-only capsule in v2 if adopters ask.
- **Twitter / X announcement thread.** LinkedIn + dev.to blog post
  via existing cross-poster is enough; no new channel for this
  release.

## 4. Data model additions

### 4.1 New frontmatter on `content/case-studies/*.mdx`

```typescript
// content/case-studies.ts
export type TokenScorecard = {
  tokens: number;              // total tokens for the project
  complexity: 'S' | 'M' | 'L'; // ShipLoop sizing class
  modelMix: {                  // percentages, sum = 100
    opus?: number;
    sonnet?: number;
    haiku?: number;
  };
  duration: string;            // e.g. "11 days"
  tier: 0 | 1 | 2;             // naked / self-spec / shiploop
};

export type CaseStudyFrontmatter = {
  // ... existing fields
  tokenScorecard?: TokenScorecard;  // additive, no breakage
};
```

Validator: fails build if `tokenScorecard` is present but any required
sub-field missing, or if `modelMix` sums to anything other than 100.

### 4.2 Scorecard output format (`scorecard.json`)

```json
{
  "generatedAt": "2026-10-14T20:00:00Z",
  "projects": [
    {
      "slug": "lexora",
      "name": "Lexora",
      "tier": 0,
      "metrics": {
        "disciplineScore": 0.0,
        "reworkRatio": null,
        "timeToShipDays": null,
        "tokens": 850000,
        "expertHitRate": null
      },
      "context": {
        "complexity": "M",
        "modelMix": { "sonnet": 85, "opus": 15 },
        "duration": "9 days",
        "tokenSource": "home-dir-attribution"
      },
      "notes": "No formal spec; token spend reconstructed from grep of ~/.claude/projects/-Users-ruslan/*.jsonl for project-name keywords. Rework ratio N/A — commits predate DEVLOG convention."
    }
    // ... 6 more projects
  ]
}
```

Metrics that genuinely don't apply to a tier show `null` + a `notes`
sentence. Not zero. Null is honest.

### 4.3 Repo structure (OSS)

```
claude-shiploop/
├── LICENSE                 # MIT
├── README.md               # pitch, install, lifecycle, skill index
├── INSTALL.md              # detailed install flows
├── CONTRIBUTING.md         # how to submit skills, PR process
├── install.sh              # one-liner install (curl | bash target)
├── skills/
│   ├── shiploop-start/
│   ├── shiploop-router/
│   ├── shiploop-brainstorm/
│   ├── shiploop-tester/
│   ├── shiploop-observer/
│   ├── shiploop-expert/
│   └── shiploop-skill-builder/   # if kept
├── agents/
│   └── expert.md           # domain-expert subagent definition
├── expertise/
│   └── README.md           # how to generate capsules; no examples
├── templates/
│   ├── CLAUDE.md.template
│   ├── DEVLOG.md.template
│   └── spec.md.template
├── scripts/
│   └── init-project.sh     # existing from ~/shiploop/, sanitized
└── .github/
    ├── ISSUE_TEMPLATE/
    ├── PULL_REQUEST_TEMPLATE.md
    └── workflows/
        └── skill-lint.yml  # validates frontmatter on new skills
```

## 5. Measurement algorithm

### 5.1 Per-project collection

For each of 7 projects (5 existing case studies + portfolio + claude-shiploop):

**Discipline score** = `(has_spec + has_plan + has_tasks + has_devlog) / 4`
- `has_spec`: `specs/*/spec.md` exists for ≥1 feature
- `has_plan`: `specs/*/plan.md` exists for ≥1 feature
- `has_tasks`: `specs/*/tasks.md` exists for ≥1 feature
- `has_devlog`: `DEVLOG.md` exists at repo root with ≥1 structured
  entry (Problem/Decision/Result/Lesson)

Score is binary per criterion. Projects pre-dating any of these
conventions score null on the missing criteria, not zero — "didn't
have the convention yet" ≠ "failed the convention".

**Rework ratio** = `fix_commits / feature_commits`
- `fix_commits`: `git log --grep='^fix' --grep='^chore(fix)' -E -i`
- `feature_commits`: `git log --grep='^feat' --grep='^chore(add)' -E -i`
- Only computable on projects with conventional commit messages.
- Tier 0 projects → likely null (git log doesn't have the signal)

**Time to ship** = median(`merge_date - spec_frontmatter_date`) in days
- Computed per feature; aggregated to median per project
- Null if no spec frontmatter dates (Tier 0 and some Tier 1)

**Tokens per project** = sum of session token counts
- Primary source: `~/.claude/projects/-Users-ruslan-<slug>/*.jsonl`
  - Each line is a message; parser sums `message.usage.input_tokens`
    + `message.usage.output_tokens` + `message.usage.cache_read_input_tokens`
- Fallback for projects without dedicated project dir (Lexora, SMM
  Factory, Angel Trucking): parse `~/.claude/projects/-Users-ruslan/*.jsonl`
  with project-name keyword attribution (grep conversation for project
  slug / product name mentions; if ≥3 mentions in a session, attribute
  the session to that project)
- Reconstructed numbers get `"tokenSource": "home-dir-attribution"`
  context tag so the viewer knows the lineage

**Expert hit rate** = `expert_consulted_and_changed_plan / expert_consulted_total`
- Only applies post-2026-10-03 (expert agent landed) → Tier 2 only
- Grep DEVLOG for `expert consulted` entries; parse `plan changed:
  yes|no` sibling line
- Null for all projects pre-expert

### 5.2 Tier assignment (locked)

| Slug | Tier | Rationale |
|---|---|---|
| lexora | 0 | Pre-any-spec |
| noble-saas | 0 | Pre-any-spec |
| smm-factory | 0 | Pre-any-spec |
| angel-trucking | 0 | Pre-any-spec |
| fieldmark | 1 | Self-written `test_plan.md` 517 lines, no ShipLoop |
| hrekov.dev (portfolio) | 2 | ShipLoop active from 2026-09-20 |
| claude-shiploop | 2 | ShipLoop active from day 0 |

Hardcoded in `scripts/scorecard.config.ts`. Not derived at runtime —
tier is a human judgment, not a metric.

### 5.3 Context tags on every number

Every published number carries these tags for interpretation:

- `complexity`: S / M / L (ShipLoop sizing — Ruslan assigns)
- `modelMix`: percentage breakdown of Opus / Sonnet / Haiku use
- `duration`: calendar days from first commit to last ship-worthy commit
- `tier`: 0 / 1 / 2
- `tokenSource` (optional): `direct` (dedicated project log) |
  `home-dir-attribution` (reconstructed from shared log)

Rendering rule on `/tools`: tags appear beneath the number in muted
caption. Never show raw numbers in isolation.

## 6. External contracts

### 6.1 Claude Code `.jsonl` log format

Each line of `~/.claude/projects/<project>/<session-id>.jsonl` is a
JSON object with `message.usage.{input_tokens, output_tokens,
cache_creation_input_tokens, cache_read_input_tokens}`. Parser uses:

```typescript
const total = usage.input_tokens
            + usage.output_tokens
            + (usage.cache_read_input_tokens ?? 0)
            + (usage.cache_creation_input_tokens ?? 0);
```

Cache-read tokens cost 10% of regular input tokens — but for raw
token-count metric we include them at face value since the SPEND
number (dollars) is a derived view that's out of scope for v1
scorecard.

### 6.2 GitHub repo API

Repo creation via `gh repo create ruslan4427/claude-shiploop --public
--license mit --description "ShipLoop: discipline + skills + measurement
for shipping with Claude Code."` from local — one-time, manual.

## 7. Security posture

- **No tokens in OSS repo.** All API keys, OAuth secrets, LinkedIn
  URNs stay in portfolio's `.env.distribution` or GH Secrets. OSS
  repo has zero credentials.
- **Scorecard data lives in portfolio.** `scorecard.json` is
  generated and committed in portfolio repo, not in OSS repo. Linked
  from `/tools` page; no cross-repo auth.
- **No telemetry.** OSS install does NOT phone home. No usage counters,
  no download metrics beyond what GitHub provides passively.
- **Capsules excluded by default.** `.claude/expertise/README.md`
  explicitly warns: capsules may contain project context, think
  before committing them to public repos.
- **Expert agent is read-only.** OSS release emphasizes the agent
  reads codebase and proposes; never writes without approval. Matches
  existing portfolio behavior.
- **init-project.sh dry-run flag.** Script supports `--dry-run` that
  lists intended file copies without executing. Standard for anything
  that touches `.claude/`.

## 8. Success criteria

- `github.com/ruslan4427/claude-shiploop` is public, MIT-licensed,
  with README that reads cleanly as a project pitch (not internal docs).
- `curl -sSL <install-url> | bash` on a clean temp dir produces a
  working `.claude/` folder with 6 skills; `/shiploop-start` responds
  as expected inside a fresh Claude Code session.
- `/tools` page on hrekov.dev renders scorecard for all 7 projects.
  Null cells are visibly null (not "0"), with notes aside.
- Measurement parser is deterministic: running it twice on the same
  state produces identical `scorecard.json` (dates stable, no
  timestamps baked into values).
- `/work/claude-shiploop` meta case study published, following case-
  study authoring guide — hero, flow schema, outcomes, Artifacts.
- All 5 existing case studies have a populated `tokenScorecard`
  block in frontmatter; aside renders on each `/work/<slug>` page.
- A LinkedIn + dev.to blog post announces the release via existing
  cross-poster — ShipLoop eats its own dog food visibly.

## 9. Non-goals (explicit)

- No composite effectiveness score — scorecard stays 5 separate numbers.
- No pre-filled capsules in OSS repo for v1. Mechanism docs only.
- No speckit integration. If speckit comes back on the roadmap, that's
  a separate spec.
- No real-time scorecard polling / live metric updates. Build-time only.
- No `blog-drafter` in OSS. Portfolio-specific.
- No company-page LinkedIn announcement. Personal profile only (same
  as every other distribution).
- No Twitter / X thread. Dev.to + LinkedIn (via cross-poster) carries it.
- No npm/pip package in v1.
- No fork of ShipLoop for non-Claude tools.

## 10. Resolved decisions (2026-10-14 brainstorm)

All six open questions resolved in brainstorm follow-up. Decisions
below supersede any earlier draft.

### 10.1 Tier 0 token source → bail-out triggered 2026-10-14

Lexora, SMM Factory, and Angel Trucking do NOT have dedicated
`-Users-ruslan-<slug>/` folders in `~/.claude/projects/`. They were
run from home dir, so sessions sit in `~/.claude/projects/-Users-ruslan/`
(123 sessions, 269MB).

**Original decision: physically reorganize sessions into per-project
folders; measure where attribution is confident, mark residual as
unmeasurable.**

**Updated 2026-10-14 (A3 attribution scan results, bail-out
triggered):** Attribution script ran against all 123 sessions. SINGLE
rate = 0/123 (0%), well below the 50% bail-out threshold. Reality:

- **Angel Trucking**: zero keyword hits across all 123 sessions.
  Project never ran from Claude Code here, or ran before this
  install directory existed.
- **Lexora** + **SMM Factory**: only present inside two mega-sessions
  (97MB + 163MB) where they're mixed with Fieldmark + Portfolio +
  Noble SaaS work. Not cleanly separable.
- **118 UNCLASSIFIED sessions**: median message count = 1–2, median
  corpus ~ 300 characters. Overwhelmingly trivial/abandoned pings,
  not substantive work.

**Resolution: do not reorganize. Tier 0 tokens = null in scorecard
with explanatory note "not reconstructable from mixed home-dir
sessions; project pre-dates per-project session isolation."**

Methodology aside on `/tools` (Phase F) covers this transparently —
null here is honest signal that pre-ShipLoop projects lack the
instrumentation to produce the number. That's part of the point of
publishing the scorecard: showing WHERE the discipline curve picks
up measurement.

Artifacts from the scan preserved:

- `scripts/attribute-sessions.mjs` + `scripts/__fixtures__/attribution-keywords.mjs` — kept in repo as documentation of the scan procedure
- `tmp/attribution-report.csv` — regeneratable; not committed (lives in gitignored `tmp/`)
- Backup `~/.claude/projects/-Users-ruslan.bak-2026-10-14/` can be removed after a cooling period (no destructive filesystem operation was taken, so the backup served only as a safety net)

**Historical: original reorg procedure.** Kept for context — not
executed. The attribution script (A3) ran as a diagnostic read-only
pass; nothing was moved. The move script (A5) was not written. If a
future reorg becomes useful (e.g. after extracting work out of the
two mega-sessions by time-slicing), the gated procedure was: scan →
Ruslan review CSV → backup → dry-run move → execute.

### 10.2 `shiploop-skill-builder` → KEEP

Keep in OSS v1 release. Core use case for adopters: "create your own
skill" without re-inventing the frontmatter conventions. 13-point
checklist is a quality gate for community contributions. Sanitization
required: `~/lexora/.claude/skills/` reference at
`shiploop-skill-builder/SKILL.md:29` → generic `<project>/.claude/skills/`.

### 10.3 Scorecard parser → BOTH, vendored

Parser is canonical in OSS repo (`scripts/scorecard.ts`). Portfolio
vendors a copy into `scripts/scorecard.ts` + maintains local
`scripts/scorecard.config.ts`.

Three stability safeguards:

- **Vendored copy** carries header with pinned OSS version +
  commit SHA. Updates are an explicit `npm run scorecard:update`
  step, not a live link.
- **Config schema versioning** — `scorecard.config.ts` declares
  `configVersion: 1`; parser validates at startup, errors with
  migration pointer if mismatch.
- **Snapshot fixture + CI diff** — `scripts/__fixtures__/
  scorecard.expected.json` committed in portfolio; CI step diffs
  actual output against snapshot; mismatch = explicit failure, not
  silent regression.

### 10.4 Install URL → phased

v1: GitHub-raw primary.

```bash
curl -sSL https://raw.githubusercontent.com/ruslan4427/claude-shiploop/main/install.sh | bash
```

v2 (if adoption > 10 stars or at next major release): add
`hrekov.dev/shiploop` Vercel rewrite as short-form alias. Both
URLs remain documented so neither breaks.

### 10.5 Repo visibility → PUBLIC from first push, no private period

Prepare locally (sync skills, sanitize, add LICENSE/README/CONTRIBUTING,
test install script in a scratch dir), then one clean
`git init && git add -A && git commit -m "Initial release · ShipLoop v2.0" && git push`.
No private-then-flip dance.

### 10.6 Case study #6 publish timing → simultaneous, C-fallback

Default: repo + `/tools` + `/work/claude-shiploop` + LinkedIn/dev.to
blog all land on same day.

Fallback trigger: if case study drafts reveal a section that depends
on real-world adoption data (e.g. "first adopter feedback"), split to
soft launch — repo + `/tools` day 1, case study + blog +7 days
later citing early signals.

Decision made at draft-review time, not now.

### 10.7 Portfolio token data verification → plan.md investigation

Portfolio has its own `-Users-ruslan-portfolio/` folder (9 sessions
visible as of 2026-10-14). First session date must be verified to
confirm Tier 1 → Tier 2 transition is captured. Investigation task,
owned by plan.md, not spec-level.
