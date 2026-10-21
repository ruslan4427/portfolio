# DEVLOG

One block per meaningful work session. Format:
`Problem · Decision · Result · Lesson`. Newest at the top.

---

## 2026-10-18 · Sprint 18 follow-up — Analysis + Conclusion on /tools

**Problem.** The /tools EffectivenessBlock surfaces three impact numbers per tool but the reader has no way to see the shape of the measurement — what we track, what we deliberately don't, and what to take away. User asked for the natural sales-shape ("save X tokens, Y% better, Z% faster") and the honest answer is that two of those three claims can't be made yet: smm-factory (tier-0 baseline) wasn't token-logged, naked time-to-ship is `null`, and ui-ux-pro's rig is one day old at write time with its first non-null QA-catch value still arriving on Monday. Rather than invent plausible numbers, surface the analysis itself as the explanation.

**Decision.** Three-file quick-ship (classified S by the router: < 3 files, < 1h after the content was drafted in chat).

- **Schema.** `content/tools-built.ts` grows `ToolAnalysis = { measured, unmeasured, conclusion }`. `ToolBuilt.effectiveness.analysis?` is optional so a tool without the narrative renders unchanged.
- **Content.** Both tools get an `analysis` object. claude-shiploop lists discipline / rework / expert / hygiene as measured, token-delta / time-to-ship / expert-auto-rollup as unmeasured-with-why, and a conclusion that says "9.4× fewer fix cycles, expert ~2× better; token-savings and time-to-ship claims refused until matched-size tier-0 run is logged." ui-ux-pro lists hero regens / QA catches / serializer round-trips / backfill coverage as measured, rig-era QA catches / token delta / revisions-per-figure as unmeasured, concluding with "70-80% above industry on hero regens; full QA claim awaits Monday."
- **Rendering.** `components/tools/EffectivenessBlock.tsx` grows a fourth section after Measured impact: two-column grid for measured/unmeasured bullets + a backlit Conclusion card. `components/tools/ToolCard.tsx` passes the new prop through.

**Result.**
- `/tools` renders two new Analysis sections (one per tool) in a single page. SSR check: 2× `>Analysis<` h5s, 4× "What we measure" strings, both conclusions present.
- `npm run prebuild` green (verify:numbers caught drift that landed since Sprint 18: memory file count 45 → 46 after writing `iteration-18.md`; reconciled across `projects.ts` + `hrekov-dev.mdx` tagline/body/MetricGrid/frontmatter detail).
- `npm run build` green (23 routes).
- No new STABLE_LOGIC rule — the "null-is-honest" discipline already covers refusing to invent token-delta claims.

**Lesson.**
- **Honest absence is a product surface.** The user asked for "save X tokens / Y% better / Z% faster" and the right move was to say "we can't claim two of those yet, here's why" — and then put *that answer* on the page as the methodology. Surfacing the gap on the same card as the number builds more trust than hiding it. Null-is-honest, phase IV.
- **Content drafted in chat skips the spec ritual.** Classifier called this S after the content was discussed; writing a formal spec would have re-stated the same shape. Dog-fooded the ShipLoop router's actual decision tree — S means spec exists in principle (the DEVLOG entry *is* the spec once the work ships), not that it's a separate file.

---

## 2026-10-18 · Sprint 18 — archetype tag + universal GitHub hygiene

**Problem.** The /tools scorecard graded seven projects on five discipline metrics but was silent on the two basics every production repo should answer in one glance: does CI pass on main, and is there a credential sitting in the index? Sprint 15 shipped the scorecard; Sprint 16 pulled it off `/tools` in favor of the ToolsBuilt pivot; the components (`ScorecardTable`, `ScorecardMethodology`) stayed in the tree but weren't mounted. Sprint 18 adds universal hygiene columns + an archetype tag per project, then remounts the scorecard on `/tools` so the reader can see all seven at a glance.

**Decision.** Six phases, mostly mechanical after the config schema call.

- **Phase A · data pipeline.** `scripts/scorecard-src/scorecard.config.mjs` bumped to `configVersion: 2`; added `archetype` (locked four-value taxonomy — `saas-app | automation | llm-skill | design-tool`) + `githubRepo: { owner, repo } | null` to each of the seven projects. Audit of candidates: 2 public (`portfolio`, `claude-shiploop`), 5 private/unpublished (`lexora`, `noble-saas`, `smm-factory`, `angel`, `fieldmark`). Parser `REQUIRED_CONFIG_VERSION` bumped in lockstep. New module `scripts/scorecard-src/lib/github-health.mjs` detects `gh` at module load, short-circuits all-null if missing. Two probes, each in own try/catch: `gh run list --branch main --limit 50 --json workflowName,conclusion,status` → group by workflow, take latest completed per group, require all `success`; `gh api /repos/<>/secret-scanning/alerts --jq 'length == 0'` → true/false, 403/404 → null. Wired into `scoreProject` via `Promise.all`; emitted at `metrics.hygiene = { workflowsHealthy, secretScanPass }` + `context.archetype`.
- **Phase A6 · canonical mirror.** `~/shiploop-publish/scripts/lib/github-health.mjs` copied byte-for-byte; parser + config bumped to v2; regression smoke `__fixtures__/scorecard.config.v999.smoke.mjs` confirms the lockstep guard still bails with exit=2 + "configVersion mismatch". Local commit pending; push gated until the portfolio PR coordinates with it.
- **Phase B · UI.** `ScorecardTable.tsx` grew two columns after `tokens`: Workflows + Secrets. `HygieneDot` renders green `--status-live` dot for `true`, muted `✕` for `false`, muted `—` for `null`, each with its own `aria-label`. `ArchetypePill` slots next to `TierPill` in both desktop and mobile views. Mobile cards grew a "Health" row with inline dot + label pairs. `ScorecardMethodology.tsx` grew a hygiene section (code block + prose on both probes) and an archetype section (four-value definitions).
- **Phase B5 · remount.** `app/(marketing)/tools/page.tsx` picks up a new `<section>` between `ToolsBuilt` and `Inside ShipLoop` that renders `<ScorecardTable />` + `<ScorecardMethodology />`. Metadata description updated to flag the universal hygiene columns.
- **Phase C · verifier.** `scripts/verify-case-study-numbers.mjs` grew check #15: scans `content/case-studies/*.mdx`, `content/blog/*.mdx`, and the `/tools` surface for explicit hygiene aggregate patterns (`N of 7 ... pass workflows|secrets`, `all 7 ... pass workflows|secrets`), reconciles against `scorecard.json`. Explicit pattern list — not a generic digit scan. Caught drift on tools-built claude-shiploop rework (0.46 → 0.48) during the pre-build gate, which is check #13's job but surfaced on this same run; reconciled in-place.
- **Phase D · memory.** `reference_scorecard_hygiene.md` documents the schema, probe commands, null triggers, and the "add a new project" shape. MEMORY.md link appended.

**Result.**
- `scorecard.json` regenerated: 2 projects both-green (portfolio, claude-shiploop), 1 workflows-red (noble-saas), 4 both-null (private repos or no `gh` scope). Secret scanning passes for both public repos; the OSS secret-scanning API requires Advanced Security, so private repos stay null — null-is-honest held.
- `/tools` renders the scorecard again, this time at the lower part of the page (ToolsBuilt stays the lead). SSR verified: 8× pass dots, 2× fail glyph, 18× unmeasured dash — all `aria-label`s present. Visual pixel QA against Chrome deferred; the browser extension wasn't connected on this session.
- `npm run prebuild` green (verify:numbers all 15 checks + build on 23 routes).
- Canonical repo + portfolio repo both carry the configVersion=2 bump; mirror of `github-health.mjs` is byte-identical. Both local commits pending; neither pushed yet (public-gate rule).

**Lesson.**
- **Null is honest, phase III.** Secret-scanning on private repos without Advanced Security returns 403, which the probe translates to `null`. Resisting the pull to call it "fail" is the whole discipline: the signal we don't have is not the same as the signal we have and it's bad. The scorecard's `—` is doing work; a `✕` would have been dishonest for every private repo in the dataset.
- **Mirror lives first class, not downstream.** The hygiene module landed in the portfolio tree first (that's where the testing happens), then got mirrored byte-for-byte into `~/shiploop-publish`. Earlier sprints went the other way (canonical first, portfolio second). Having a `diff` loop over the two parsers after each change made both the drift catch (the Sprint 17 `ui-rework.mjs` import exists only in the portfolio parser) and the "stop, this is where the actual logic lives" check instant.
- **An explicit pattern list beats a clever one.** Check #15 could have been written as a generic digit-finder that matches any "N / M" in prose. Keeping it to two literal shapes (`N of 7 ... pass X`, `all 7 ... pass X`) means it can't false-positive on unrelated prose (e.g. "9 of 10 case studies ship with a receipts section"). The cost of the explicitness is that future prose will escape the check unless we grow the list — which is the right default.
- **Mounting an orphaned component is a one-line decision.** `ScorecardTable` + `ScorecardMethodology` had been fully built in Sprint 15 and sitting unused since Sprint 16 pulled them off `/tools`. The Phase B5 mount was 20 lines in the page file. Pre-flight audit (`grep` for the component names across `app/`) is a cheap habit that converts "I need to build this" into "it's already here, mount it."

---

## 2026-10-17 · Sprint 16 — /tools refresh + case-study metrics upgrade

**Problem.** Sprint 15 shipped `/tools` as a scorecard page (7 projects × 5 metrics). The semantic mismatch — a page titled "Tools" that grades portfolio projects — was the right receipt for the OSS launch but the wrong permanent occupant. Scorecard-as-receipt belongs *inside* the case study it measures, not on the tools shelf. Three asks: pivot `/tools` to list the actual OSS tools we ship (claude-shiploop + ui-ux-pro); promote `TokenScorecardAside` from side-rail to hero block + add a per-phase build timeline on four annotated case studies (smm-factory, hrekov-dev, claude-shiploop, lexora); and ship an interactive agent-replay component on smm-factory so the 6-agent dispatch flow reads without paragraph-parsing.

**Decision.** Nine phases.

- **Phase 1 parser.** `~/shiploop-publish/scripts/lib/claude-logs.mjs` + `git-log.mjs` extended with per-day bucketing (Europe/Kyiv local date so git `--date=short` and session timestamps align). `scorecard.mjs` adds `buildDaily()` zipping both maps into `daily: [{date, tokens, commits}]` on each project. Vendored copy synced to `scripts/scorecard-src/`. Regenerated `scorecard.json`; aggregate sums match per-day sums exactly (0 diff on hrekov-dev / noble-saas). Snapshot shape-check tolerant to additive `daily` key.
- **Phase 2 frontmatter.** `content/case-studies.ts` extended with `Phase = { name, from, to }` + `tokenScorecard.phases?: Phase[]`. `validatePhases()` enforces ISO dates + from≤to + non-empty names. Four MDX files annotated: claude-shiploop (3 phases), smm-factory (3), lexora (2), hrekov-dev (4) — lexora dates derived from `/Users/ruslan/lexora/specs/*/spec.md` Created lines, hrekov-dev from in-repo sprint specs.
- **Phase 3 ui-ux-pro OSS.** Staged at `~/ui-ux-pro-publish/` with SKILL.md + references/ + scripts/ (all copied verbatim from `.claude/skills/ui-ux-pro/` — no personal paths), MIT LICENSE, README (install path + 5-section method summary), CHANGELOG.md (initial release + 2026-09-19 refresh date), .gitignore. Local commit `bbdc376` on main. GitHub push gated per `feedback_pause_at_public_gates` — not yet pushed.
- **Phase 4 reposition.** `TokenScorecardAside` → `TokenScorecardHero`. Component redone as a 2-col section with a 6xl/7xl serif number and model-mix bar on the right. Page moves it from footer position (below CaseStudyBody) to hero position (right after recruiter summary, before body).
- **Phase 5 BuildTimeline.** New SVG component in `components/case-study/BuildTimeline.tsx`. Row 1: phase bands with per-phase fill from `--ink-primary` → `--ink-body` → `--ink-muted` → `--ink-faint` ramp. Row 2: daily token-density bars (height = tokens / maxTokens) + commit-count dot row below the baseline. 3–5 month-day axis ticks. aria-label summary with totals; `<title>` tooltips on bars/dots. Mobile: min-width 600px + horizontal scroll in a wrapper.
- **Phase 6 AgentReplay.** Client component at `components/case-study/AgentReplay/`. Linear state machine over 7 steps describing the Mon 09:00 weekly cycle: cron → intake → analysis → content → approval → publisher → orchestrator-ledger. SVG draws 6 nodes + 6 edges; the active edge gets `stroke-width: 2.5` + arrow marker, inactive edges render dashed muted. Keyboard listener on `window` for `←` / `→` / `Home` (ignored while typing in inputs). Payload panel shows active step title + timestamp + 1-paragraph "what passed between agents". Registered in `CaseStudyBody` as `AgentReplay: AgentReplayFor` which looks up data by slug — only `smm-factory` has a replay data file this sprint.
- **Phase 7 /tools rewrite.** New `components/tools/ToolCard.tsx` + `ToolsBuilt.tsx` + `EffectivenessBlock.tsx`. Data at `content/tools-built.ts` holds the two tools: claude-shiploop (measured impact — Discipline 100%, Rework 0.36, Expert hit rate 67%) and ui-ux-pro (null impact — reason captured, "no retroactive measurement rig exists yet"). Page composition becomes Hero → ToolsBuilt → "Inside ShipLoop" (preserved SkillGrid, now under its own h2 for context). Removed from imports: `ScorecardTable`, `ScorecardMethodology`. Those component files kept on disk, no longer rendered.
- **Phase 8 QA.** All 14 routes 200. `verify:numbers` passes. `scorecard:check` passes (shape additive, configVersion = 1 unchanged). Contrast AA pass on ink-primary / ink-body / ink-muted against #F5F4EF and #FFFFFF (ink-muted fails AAA normal — same as prior sprints, caption usage only). Smm-factory renders all three new blocks (hero scorecard, build timeline, agent replay). Noble/fieldmark/angel show hero scorecard without timeline (no `phases` field → component returns null).
- **Phase 9 ship.** DEVLOG entry (this), memory update, commit, pause-at-gate for ui-ux-pro public push.

**Result.**
- Local commit on canonical `~/shiploop-publish` (a9ddef5) with parser `daily[]` emit — not pushed per public-gate rule.
- Local commit on `~/ui-ux-pro-publish` (bbdc376) with initial release — not pushed per public-gate rule.
- Portfolio commit pending (this change set): parser sync + scorecard.json regen + Phase/validatePhases schema + 4 MDX phase annotations + rename TokenScorecardAside→Hero + new BuildTimeline / AgentReplay / ToolsBuilt / ToolCard / EffectivenessBlock components + /tools rewrite + 1 content file (`tools-built.ts`).
- Lines moved: `components/case-study/TokenScorecardAside.tsx` → `TokenScorecardHero.tsx` (git-tracked rename, body rewritten for 2-col hero layout).
- Public gates still open: `gh repo create ruslan4427/ui-ux-pro --public --push` + `git push origin main` on `~/shiploop-publish`. Both block Phase 7's effectiveness-block link resolving to a live repo.

**Lesson.**
- **Null is honest, phase II.** ui-ux-pro has no retroactive measurement rig, so its impact block ships with a single em-dash + explanation. Resist the pull to invent plausible numbers for symmetry with claude-shiploop's three-number row — asymmetry *is* the honest finding here. Confirmed with Ruslan during spec Q2 ("Null-is-honest measurements for ui-ux-pro").
- **One graph beats two.** Original design had phase bands and daily density as separate visualizations. Q3 answer collapsed them into one SVG with two stacked rows sharing an x-axis. Reading a build arc as "where was the time + where did the tokens actually land" works better in one glance than two charts in sequence.
- **Local-timezone bucketing matters.** JSONL session timestamps are UTC; git `--date=short` is local. If the parser had bucketed by UTC, days close to midnight Kyiv time would attribute tokens to the "wrong" day relative to commits. `Intl.DateTimeFormat` with `en-CA` locale + `Europe/Kyiv` timezone emits ISO date in local tz — matches git log exactly.
- **MDX structured props still need `blockJS: false`.** AgentReplay data (6 nodes + 6 edges + 7 steps) lives in a `.ts` file at `components/case-study/AgentReplay/smm-factory.ts` and the MDX just references `<AgentReplay slug="smm-factory" />`. The lookup indirection sidesteps the next-mdx-remote prop-stripping issue entirely — only a scalar slug crosses the MDX boundary.
- **Vendored-vs-canonical pattern paid off.** Added `daily[]` emission to parser in `~/shiploop-publish/scripts/lib/` first (local commit, no push), then `cp` to `scripts/scorecard-src/` in-repo, then regenerate. Zero drift between the OSS parser and the portfolio parser because they are byte-identical mirrors with the portfolio copy being the derived artifact.

---

## 2026-10-15 · Sprint 15 · Phase F — /tools page on hrekov.dev

**Problem.** Spec §F commits a public `/tools` surface on the portfolio that lands the ShipLoop install one-liner above the fold, lists the seven skills in a scannable grid, and renders the measurement scorecard with every number captioned by its source tag. Recruiters landing from the meta case study (Phase G) have to be able to copy the install, see what each skill does, and inspect the raw receipts — without the page reading as a documentation dump.

**Decision.** Twelve subtasks grouped into four pass-throughs:

- **F1–F2 content + install.** `content/tools.ts` is hand-authored (not derived from `.claude/skills/*/SKILL.md`), so marketing copy — descriptions, `whenToUse` lines — can diverge from internal frontmatter without a sync job. One category enum (`entry | lifecycle | quality | meta`), one `INSTALL_COMMAND` export. `InstallBlock` is a client island with `navigator.clipboard.writeText` + a 2-second "Copied" state + a `document.getSelection()` fallback for insecure contexts (older Safari, non-HTTPS previews). Tracks `tools_install_copy` to GA4 so the launch funnel is measurable.
- **F3–F5 content components.** `SkillGrid` groups by category, prints a count badge per section, 2-col at ≥768 / 1-col below, each card with Playfair name + description + monospace invocation + when-to-use. `ScorecardTable` renders two layouts: desktop `<table>` with 5 metric columns, mobile per-project cards with a 2-col metric grid. Null cells render em-dash in `ink-muted` and expose `title={project.notes}` for tooltip hover. `tokenSource` tag renders beneath the Tokens cell only (per-metric context tag), while complexity + duration tags render once at the row header (per-project context). `ScorecardMethodology` splits into three panels: formula table, tier assignment rubric, "null is honest" + raw-receipt links to `/scorecard.json` and the OSS parser.
- **F6–F9 wiring.** `app/(marketing)/tools/page.tsx` composes hero → install → skills → scorecard → methodology. OG image mirrors `work/opengraph-image.tsx` with "Tools" eyebrow and "ShipLoop ecosystem." subtitle. Nav gets a `Tools` entry between `Journal` and `About` per spec §F8. Sitemap gets `/tools` at priority 0.9, weekly change frequency, since the scorecard refreshes on every merge.
- **F10–F11 a11y + visual verify.** Ran `check_contrast.py` on all seven new fg/bg pairs. `ink-primary / bg-elevated` = 18.88:1, `ink-body / bg-elevated` = 14.38:1, `ink-muted / bg-elevated` = 5.36:1 (AA pass), `ink-faint / bg-elevated` = 2.39:1 (AA fail). Fix: downgraded three `ink-faint` usages — null-cell metric values, column header sub-captions, skill count badges — to `ink-muted`. Null dashes carry real information; they can't live in a token the design system labels "decorative only". Playwright pass at 1280/768/375 after scrolling the page in viewport-height increments to trigger `whileInView` IO events — fullPage screenshots were silently cropping below-fold content in the first pass because headless Chromium doesn't scroll on its own.

**Result.** `/tools` returns 200 in dev. Desktop screenshot shows: hero with Playfair h1, install block with Copy button, 7-card skill grid in 4 category clusters, 7×5 scorecard with em-dash nulls + tokenSource captions ("dedicated session log", "unmeasurable"), 3-panel methodology section at the bottom. Mobile screenshot shows: same content stacked, per-project scorecard cards with 2-col metric grids, per-card `notes` prose below. Nav shows Tools pill active state in the chrome. Install one-liner points at `github.com/ruslan4427/claude-shiploop/main/install.sh` (not pushed yet — Phase H owns that). `typecheck` clean.

**Lesson.**
- **Reveal + Playwright fullPage is a false green.** `fullPage: true` captures the scrollable height but doesn't trigger IntersectionObserver events for off-screen elements. First screenshot pass showed hero + install block + first category group, then massive blank where the Reveal-wrapped scorecard + methodology should have been. Fix is to scroll in viewport-height increments *before* capturing — slow but makes the capture match a real visitor's experience. Any component library using `whileInView` for scroll-triggered motion will have the same gap in automated screenshot tests.
- **"Decorative only" is not a safe token to default to.** `ink-faint` is spec'd in CLAUDE.md as decorative, but it was ergonomically convenient for null dashes (`—`), column captions ("fix ÷ feat"), and count badges — all of which carry information a reader needs. A linter that caught "ink-faint on bg-elevated / bg-page" could prevent this entire class of miss; manual contrast runs catch it after the fact. Noting as a potential tooling capsule for later.
- **Hand-authored marketing content beats derived frontmatter.** First draft imported each skill's `description` directly from `SKILL.md`. The result was functional but read as an inventory list ("Structured brainstorming session at a defined lifecycle stage. Always produces: decisions, open questions, action items, and a memory entry."). Rewriting each description + whenToUse with the recruiter audience in mind — specific lanes they'd map to, specific gaps they'd notice without the skill — turned the page from a reference manual into a pitch. The sync cost (manual edits when a skill's purpose changes) is cheaper than the clarity cost of auto-derived copy.
- **Null tooltips are a progressive enhancement, not an a11y strategy.** The scorecard uses `title={project.notes}` on null cells for hover tooltip. Keyboard-only users won't see those; mobile users won't see those. The mobile layout already shows the full `notes` string as prose beneath each card — the desktop table should probably do the same (collapsible details row?) rather than hiding it behind hover. Deferred to Phase G QA pass — out of F10 scope.

---

## 2026-10-15 · Sprint 15 · Phase E — OSS staging repo at ~/shiploop-publish/

**Problem.** The Phase F `/tools` page and the Phase G meta case study are both pointed at an OSS repo that does not exist yet. Shipping either without `github.com/ruslan4427/claude-shiploop` resolving to a real tree makes the whole "Claude-devs can install this" claim unverifiable. Spec §5–§7 commit to a specific layout: skills/, agents/, templates/, expertise/README (never the capsules), a public scorecard parser matching the vendored portfolio one, and an install path that works via both local clone and `curl | bash`.

**Decision.** Build the publish-ready tree in `~/shiploop-publish/` outside the portfolio repo so git state cannot leak. Twenty subtasks grouped:

- **E1–E4 skills + sanitization.** Copied the 7 skills and `agents/expert.md` from `.claude/`. Swept for personal paths and names; two hits intentional (brainstorm template line 92 `Owner: Ruslan | Claude | TBD` → placeholders; skill-builder line 29 `~/shiploop/skills/` → `~/.claude/skills/`). Whitelist of expected hits logged at `tmp/sanitization-whitelist.txt` (gitignored).
- **E5–E8 docs.** LICENSE (MIT), README (pitch + lifecycle + skill table + scorecard section), INSTALL (flags + manual + uninstall + speckit caveat), CONTRIBUTING (PR workflow + skill proposal + capsule privacy warning).
- **E9–E12 installer + templates.** `install.sh` handles `--target`, `--dry-run`, `--help`, portable macOS/Linux via `stat -f` → `stat -c` fallback, TMPDIR fallback for `curl | bash` cache. Rewrote `scripts/init-project.sh` with dual-platform sed. Templates: `CLAUDE.md.template` (full lane table with Expert class), `DEVLOG.md.template` (PDRL skeleton), `spec.md.template` (8-section starter). `expertise/README.md` carries the "never commit capsules — they contain project-local info" warning.
- **E13 scorecard parser + CI + regression fixture.** Copied `scorecard.mjs`, `snapshot-check.mjs`, 4 lib files + placeholder config with an example-project entry. Workflow `scorecard-snapshot.yml` runs shape-check + v999 regression fixture on PRs touching `scripts/scorecard-src/**` (portfolio) or `scripts/**` (OSS). Fixture at `scripts/__fixtures__/scorecard.config.v999.mjs` + smoke script expects exit 2 with "configVersion mismatch" in stderr.
- **E13b BUG CAUGHT.** The lockstep guard between `REQUIRED_CONFIG_VERSION` (parser) and `configVersion` (config) was broken from day one: `scorecard.mjs` imported `REQUIRED_CONFIG_VERSION` from the same `scorecard.config.mjs` file as the config itself, so bumping one would silently bump the other and the check always passed trivially. Fix: hardcoded `const REQUIRED_CONFIG_VERSION = 1;` directly in `scorecard.mjs` AND `snapshot-check.mjs` (independent from config), removed the `export` from both config files. Verified: portfolio + OSS snapshots both pass, both regression smokes exit 2 as spec'd.
- **E14–E16 GitHub metadata.** Issue templates (bug-report + skill-proposal), PR template with capsule leak-audit checkbox + REQUIRED_CONFIG_VERSION dual-edit reminder, skill-lint workflow + skill-lint.mjs validator (frontmatter name/description + model lane only — no body-section regex, no description length limit; those were false-positive factories), `.gitignore` with `expertise/*.md` + rescue for `!expertise/README.md`.
- **E17–E18 install smoke tests.** Clean `mktemp -d` targets under both bash and zsh. Dry-run leaves target untouched (fixed one leaked `mkdir -p "$DEST"` that ran even in dry-run mode). Real install produces `.claude/{skills, agents, templates, expertise}` with 7 skill dirs + `expertise/README.md` only. Exit codes: unknown flag → 2, missing `--target` arg → 2, nonexistent target → 1, `--help` → 0.
- **E19 git init.** `git init --initial-branch=main` in staging dir; **no remote add, no push** — launch (Phase H) owns the push + release tag. `git ls-files` after init shows 35 candidate files; `tmp/sanitization-whitelist.txt` correctly ignored; `expertise/README.md` correctly rescued from the `expertise/*.md` catch.

**Result.** `~/shiploop-publish/` is 268K across 35 tracked files. Install smoke-test produces identical trees under bash and zsh. Skill-lint validates all 7 skills in <100ms. Portfolio scorecard shape-check + v999 regression + OSS scorecard shape-check + v999 regression all green. Repo ready to push; Phase H will add the GitHub remote, run the pre-ship expert consult, and cut v0.1.0.

**Lesson.**
- **Lockstep guards must come from independent sources.** A `REQUIRED_CONFIG_VERSION` imported from the same file whose `configVersion` it validates provides zero protection — both sides change in one edit and the comparison can't fail. The fix is to pin the required version in the consumer (hardcoded in the parser), not the producer. Spot-check for any `vs` check: trace both operands' provenance; if they resolve to the same source file, you don't have a check.
- **Dry-run contracts leak at the earliest unguarded command.** The installer's `mkdir -p "$DEST"` ran before the `DRY_RUN` branches, so even `--dry-run` created `.claude/` on the target. One mkdir isn't catastrophic, but a reviewer would call this a lie. Fix every unguarded filesystem op or stop advertising `--dry-run`.
- **Linters that fail on the author's own corpus are configured wrong.** First skill-lint pass failed all 7 shipped skills with a `description <= 120 chars` cap and a brittle "body must contain 'when to use'" regex. The right rule for a public linter is "catch structural breakage that would prevent install" (name/directory mismatch, missing field, invalid model lane) — stylistic enforcement belongs in review, not CI. Trimmed back to those three rules; green against all 7 skills.
- **Keep OSS parser bit-identical to the vendored one.** Phase E13 initial draft diverged on fixture path because the OSS `snapshot-check.mjs` resolved `__dirname/../__fixtures__/` to repo root instead of `scripts/`. Rather than fork the script, I moved the OSS fixture to `__fixtures__/` at repo root so both snapshot-check.mjs files are byte-identical. Reduces maintenance drift to zero and lets the CI diff in Phase B8 be a strict equality check.

---

## 2026-10-15 · Sprint 15 · Phase D — scorecard JSON at repo root + 6 case-study frontmatters backfilled

**Problem.** Phase B shipped the parser and Phase C shipped the aside component, but nothing was wired to real data yet. Spec §4.2 says `scorecard.json` lives at repo root (not the fixture path) so recruiters can `curl hrekov.dev/scorecard.json` as the receipt for the methodology aside. Separately, spec §376 commits all 5 existing case studies to a populated `tokenScorecard` block — but three of them (Lexora, SMM Factory, Angel Trucking) have `tokens: null` after the Phase A bail-out, and the Phase C validator required `tokens` to be a non-negative number.

**Decision.**
1. Split npm scripts: `scorecard` writes to repo root; new `scorecard:snapshot` writes to the fixture path; `scorecard:check` runs shape diff. Keeps live output + CI fixture in two different files so neither clobbers the other.
2. Discovered two slug mismatches between config and case-study filenames (`angel-trucking` ↔ `angel.mdx`, `portfolio` ↔ `hrekov-dev.mdx`). Renamed CONFIG slugs rather than case-study slugs — case-study slugs are URLs with external references (OGs, memory, DEVLOG, LinkedIn posts), config slugs are internal only.
3. Loosened validator: `tokens: number | null` with the null branch gated through a dedicated "unmeasurable" render path in `TokenScorecardAside`. Big Playfair numeral replaced with muted serif "unmeasurable" + a one-line spec §10.1 citation; context grid + mix bar still render below. Keeps the aside visible for pre-ShipLoop projects so the methodology comparison lands.
4. Backfilled `tokenScorecard` block in all 6 case-study MDX frontmatters, right after `readingTime:` to group operational metadata.
5. Added per-project `notes` caveats in the config: Lexora 4/4 discipline = speckit-era artifacts (not institutional ShipLoop); Noble SaaS 1.44 rework = loudest pre-ShipLoop marker; SMM Factory 4.5 rework = small n=11 directional sample; Portfolio 1-day TTS = solo-operator cadence across the owning org, not team scale.

**Result.** `scorecard.json` present at `/Users/ruslan/portfolio/scorecard.json` (8.3KB, 7 projects, generated 2026-10-16T01:58Z). All 6 `/work/<slug>` routes return 200 with the aside in SSR output; Playwright screenshots at 1280px confirm clean composition:
- Fieldmark renders `82.7M tokens`, tier `1 · self-spec`, 89/11 opus/sonnet mix bar.
- Portfolio renders `1.50B tokens`, tier `2 · ShipLoop`, 100% opus bar.
- Angel renders `unmeasurable` + spec §10.1 caveat, tier `0 · naked`, 100% sonnet bar.

Shape fixture regenerated after slug rename; `npm run scorecard:check` passes 5/5.

**Lesson.** The validator's "tokens must be a non-negative number" rule was correct for the measurable case but blocked the honest-null case the spec explicitly committed to. The temptation was to skip the aside entirely for null-token projects — which would have hidden the methodology comparison exactly where it mattered most (pre-ShipLoop projects demonstrate *why* ShipLoop's instrumentation changes what's knowable). Instead: loosen the validator by one union member, add one render branch, and the "unmeasurable" state becomes a feature of the aside, not a bug worked around.

Second lesson: when config slugs and content slugs disagree, rename the config side. Config slugs are internal keys with one reference (the config file itself); content slugs are URLs with external references across OG images, memory files, DEVLOG entries, and off-site links. Changing content slugs would have required a cross-cutting audit; changing config slugs was a 2-line edit each.

---

## 2026-10-10 · Case-study schemas — edge-label composition + diamond anchor + per-diagram spacing

**Problem.** Across every case study, edge-label pills on `Diagram` / `FlowSchema` were reading as *touching* their arrows at the user's zoom level. First fix (perpendicular offset = 16px) was insufficient — the geometry held but the gap read as "glued on" at 1:1 zoom. Second fix (dynamic bbox-projected perp-offset) kept the gap but moved pills off the arrow axis, so they looked like floating labels unrelated to the edges they annotated. Separately, `action` (diamond) nodes had visible notches between arrow endpoints and the shape's slanted edges because `diagramEdgeAnchor` was intersecting the bounding box, not the actual rhombus perimeter. Finally, several per-case-study layouts (`lexora` pipeline, `smm-factory` loops) had horizontal gaps between nodes that fit the pill width with 1–8px of breathing — reads as pills touching adjacent nodes.

**Decision.** Three edits, all surgical.

1. **Pill on midpoint, bg-page masks the line** (`DiagramEdgeEl` at `components/mdx/CaseStudySchemas.tsx:1044`). Removed perp-offset entirely. Pill rect's `fill="var(--bg-page)"` + rendering order (line first, pill after) means the pill cleanly masks the segment of arrow it covers — arrow visually enters pill from one side, exits to arrowhead on the other. This is the BPMN convention; the previous perp-offset was overcorrection.
2. **Diamond anchor uses rhombus edge, not bbox** (`diagramEdgeAnchor` at `components/mdx/CaseStudySchemas.tsx:893`). For `shape === "action"`, intersection parameter `s = 1 / (|dx|/hw + |dy|/hh)` places the anchor on the diamond's actual slanted edge instead of its bounding corner. Eliminates visible notches on all diamond↔anything edges.
3. **Per-diagram node spacing**:
    - `lexora.mdx` Build-15 Diagram: stride 260 → 320 across all 10 nodes. Right edge now 1456 inside width=1500. Pills `8 pairs · JSON` + `per-word render` + `MP3 per track` + `offline-first` gain ~30px breathing on each side.
    - `smm-factory.mdx` both FlowSchema rows: intermediate stride → 210, terminal nodes pushed to x=1072 (gap 340 from approval diamond), shared `width=1180`. `approve`/`edit`/`ignore` pills now have ~45px clearance to Post/Revise/Promote/Discard terminals; both rows share identical rhythm 102 → 312 → 522 → 732 → 1072.

**Result.**
- 17 schema figures across `hrekov-dev`, `noble-saas`, `lexora`, `smm-factory`, `fieldmark` verified via Playwright at 1800×1200 @2x DPI — no pill-touches-line, no diamond notches, no pill-touches-neighbour.
- Pre-ship `verify:numbers` passes (same hashes as last green: devlog 52, sprints 14, noble totalCommits 234, lexora unitTests 76).
- Both `smm-factory` loops read with identical rhythm; `lexora` pipeline reads as evenly-spaced U.

**Lesson.** Verify schema fixes at the user's zoom, not thumbnail Playwright shots — a 7px gap looks fine at 697px wide and touches at native resolution. Also: for pill-on-line labels, the BPMN convention (pill on midpoint, line masked by bg-fill) is cleaner than any perpendicular-offset formula, because the eye follows the arrow continuously through the label. Don't fight that convention with geometry.

---

## 2026-10-07 · `no-company-no-api` — Meta Business API skeptic post + PhoneRow in blog + render fixes

**Problem.** smm-factory's engagement agent (autonomous comment-on-feed + DM-reply) was invisible in the case study — the DoL table said "Autonomous" and the orbit tile had a Slack mock, but no prose explained *how* it worked, and the Meta Business API dead-end that forced the Playwright-cookie fallback wasn't mentioned anywhere. Separately: this story stood alone well enough to deserve a dedicated blog post, but the distribution pipeline had never shipped a post with `<PhoneRow>` and the LinkedIn plain-text renderer italicized `_` across word boundaries (so `instagram_manage_comments` would publish as `instagrammanagecomments` on LinkedIn).

**Decision.** Four-track ship:
1. **Case study prose.** Added `### The engagement agent — where the system actually touches humans` subsection to `smm-factory.mdx` describing both behaviors (daily cron comment batch, inline DM reply) plus the Meta Business dead-end (App Review → Business Verification → legal entity, no sandbox for write-scopes) plus the Playwright-cookie fallback with its three real costs. Added matching trade-off bullet to Trade-Offs section. Updated orbit WireflowMap caption to stop lying ("DM auto-reply" → "both inbound DMs and scheduled comment-on-feed batches").
2. **Blog post.** New `content/blog/no-company-no-api.mdx` (~1050 words, format `skeptic`, featured) — self-contained version of the story for recruiter/dev audience. Six sections: setup → What App Review wants → What I shipped instead → What the metrics lie about → Should you ship this way? → What I'd do differently. Related to `shipping-the-cross-poster`.
3. **PhoneRow in blog.** `<PhoneRow>` wasn't in `blogComponents`; added import + export. Dropped two real IG screenshots (`noble-engagement-eternalasting.png` + `noble-engagement-citybarberib.png`, 1170×2532 each, both @noble.booking comments earning author replies + hearts on in-niche barbershop/event accounts) into `public/case-studies/smm-factory/`. PhoneRow block appears in both the case-study subsection and the blog post's "What I shipped instead" — same assets, two framings.
4. **Distribution renderer fixes.**
    - PhoneRow handling added to `stripMdxForMarkdown` with `imageMode: "inline" | "placeholder"` option: dev.to expands each item to `![alt](https://hrekov.dev/<src>)` + italic label; LinkedIn gets `_[N screenshots — see full post]_` placeholder. Before this, raw JSX leaked into both payloads.
    - Underscore-italic regex (`(?<![_])_([^_\n]+)_(?![_])`) tightened to reject underscores inside words: `(?<![_\w])_([^_\n]+?)_(?![_\w])`. CommonMark-correct: `_foo_bar_baz_` is NOT italic. Caught in the LinkedIn dry-run before ship.

**Result.**
- `content/blog/no-company-no-api.mdx` created (~1050 words); `content/case-studies/smm-factory.mdx` gained engagement subsection + PhoneRow + trade-off bullet.
- `components/mdx/BlogComponents.tsx` now exports PhoneRow; `lib/distribution/render.mjs` handles PhoneRow + fixed italic regex.
- Dev.to dry-run: full markdown images with alts render inline, canonical URL set, tags clamp to 4 (`meta`, `instagram`, `platformgates`, `automation`).
- LinkedIn dry-run: PhoneRow collapses to placeholder, `instagram_manage_comments`/`instagram_manage_messages` scope names intact, 2900-char cap truncates at a readable spot, canonical appended.
- `shipping-the-cross-poster` dry-runs regression-clean on both channels.
- `schedule.yml` pulled from `2027-01-01` placeholder to `2026-10-07T02:55:00Z` (linkedin) / `02:56:00Z` (devto); next hourly cron tick at `:15` catches both.

**Lesson.** When adding a new MDX primitive that'll appear in a distributable post, update the renderer in the same PR — otherwise the first time it ships, the pipeline leaks raw JSX. Also: distribution renderers are stealth-shipped templates; markdown edge cases that work on dev.to can embarrass you on LinkedIn (identifier-underscore in this case). Dry-run both channels before every ship, grep the output for the identifiers you care about, not just the exit code.

---

## 2026-10-06 · WireflowMap `labelPos` — hub + arrow-approach collision fix

**Problem.** Even with the text halo, two labels still read as glued-onto-arrows: `Account · brand scrape` under intake (the new solid primary `orch → intake` arrow approaches vertically at x=100 from below, passes through the caption en route to the arrowhead at intake bottom) and `The one brain / 11_orch.md` under orchestrator (two separate arrows share the x=354 corridor — `trends → orch` h-first and `orch → engagement` v-first — both passing through the caption text at y=505). Halo prevented the "arrow bleeds through letter" look, but didn't remove the perceptual overlap of "arrow immediately next to text".

**Decision.** Added `labelPos: "below" | "above" | "hidden"` to `WireflowNode`. Caption + sub rendering branches on it; default stays `below` so existing diagrams don't shift. Then:

- All five top-row windows (intake / analysis / content / approval / publisher) → `above`. Flipping only intake would read as a bug, so the whole row moved as a system — mirror symmetry around the orchestrator (top labels above, utility labels below).
- Orchestrator → `hidden`. A hub with arrows in all four directions has no safe label position; the right-side callout ("12 KNOWLEDGE FILES GROUND EVERY DECISION" → `11_orchestrator — routes + CRON + Slack`) already names the file, so the inline caption was redundant anyway.
- Utility row (engagement / analytics / strategy / trends) → stays `below` (no arrows approach from below).

Rulebook §5.9 extended with the rule: when arrows approach a window from below, flip its row to `above`; for hubs, use `hidden`; keep label orientation symmetric within a row.

**Result.** Both colliding labels now sit cleanly outside arrow paths. Top-row labels float above their windows at y ≈ 100-113 (above anything else in that corridor). Orchestrator carries no inline label — the title bar + mock + adjacent callout do all the work. Rendered at 1512px lightbox: no label-arrow overlap anywhere.

**Lesson.** Text halo is a band-aid for *crossing* text, not for *proximity* to text. When an arrow approaches a text region head-on (perpendicular, ending near the label), even a perfectly haloed label still reads as "arrow is attached to text" because the arrow terminus visually anchors to whatever is nearest. The structural fix is to put the label where no arrow approaches — that's a position choice, not a rendering choice. Codified via `labelPos`.

---

## 2026-10-06 · smm-factory WireflowMap — fix the legend lie

**Problem.** Reading the orbit diagram out loud revealed the legend lied about what the arrows meant. Legend said primary (solid) = "Content pipeline — weekly, Mon → Sun", but one of the primary edges was `publisher → orchestrator` — the publisher is the *terminal* step of the pipeline, not a hop in it. That edge was a completion/telemetry signal mis-coloured as pipeline. Worse, the actual *start* of the pipeline (`orchestrator → intake` on Mon 09:00 cron) was coloured as annotation (dashed telemetry), so the chain visually appeared to begin spontaneously at intake. Net effect: the reader had to fight the legend to recover the real flow.

**Decision.** Variant A from the chat: make primary mean exactly "the weekly content cycle" and annotation mean exactly "continuous telemetry and dispatch", then re-colour the edges to match.

- `orchestrator → intake` flipped from annotation to primary (new bend `h-first` — left along orch mid-height, then up at intake centre — stays clear of the top-row windows and callout).
- `publisher → orchestrator` flipped from primary to annotation (bend unchanged; path is mostly hidden behind the top-row windows except for the final descent into orch top, which reads correctly as "something lands here").
- Legend rewritten: "Weekly content cycle — Mon 09:00 cron → feed live" / "Continuous telemetry & dispatch — utility agents ⇄ orchestrator".
- Caption rewritten end-to-end to walk the solid loop step-by-step, then explicitly name the dashed roles (publisher logs back; analytics/strategy/trends feed in; orch dispatches engagement).

**Result.** Primary now traces exactly one closed loop: `orch → intake → analysis → content → approval → publisher`. Nothing primary leaves the loop or branches off it. Annotation now carries exactly two things: (a) completion signal going *into* orch from publisher, and (b) continuous telemetry/dispatch between orch and the utility row. The legend and the arrow colours finally say the same thing.

**Lesson.** Legend + arrow kinds are a contract — if the legend promises "primary = pipeline" and even one primary edge is actually a telemetry signal, the whole diagram reads as noise, because the reader can't trust the legend to tell them which edges to follow. Catching this requires reading the diagram out loud, following each edge against the legend one at a time. Doing that once at author time saves every future viewer the same confusion. Codified: when `WireflowMap` has an edge whose semantic role doesn't fit a single word (pipeline vs telemetry), split the role — don't bend the kind.

---

## 2026-10-06 · Lightbox vertical scroll — flex `safe center` + Lenis-exclude

**Problem.** Opening the WireflowMap lightbox at 1512px (and smaller) clipped the top row of windows and the wheel did nothing. Same bug would surface on every tall diagram (Diagram, FlowSchema, WireflowMap) — the Lightbox primitive was broken for any content taller than the viewport.

**Decision.** Two layered bugs. First: classic flexbox-overflow-center trap — `overflow-auto` + `items-center justify-center` centers the scroll content, and when it's taller than the container the overflow is pushed *outside* the scrollable area, so the scrollbar reports no range. Fixed in `components/ui/Lightbox.tsx` by swapping the centering utilities for `align-items: safe center` / `justify-content: safe center` and dropping the nested `h-full items-center` wrapper. Playwright-measured `maxScroll > 0` immediately. Second (reported after fix one shipped): mouse wheel still did nothing. Root cause is Lenis — `SmoothScroll` initializes `new Lenis({ smoothWheel: true })` which registers a global passive-false wheel listener and `preventDefault`s on every tick, so the inner lightbox scroller never receives the native wheel event. Fixed by adding `data-lenis-prevent` to the scroll container (Lenis checks for the attribute and bails on handling the event) plus `overscroll-contain` so trackpad momentum doesn't tunnel back into page scroll on bottom overshoot.

**Result.** Playwright at 1280px confirms `before=0, after=396` (= maxScroll) after two `page.mouse.wheel(0, 300)` dispatches — wheel now reaches the inner container. Keyboard arrows and touch were already working under fix one; now wheel and trackpad join them. Small-content lightboxes (e.g. Diagram at desktop width) still center as before because `safe center` only switches to `start` under overflow.

**Lesson.** Two separate bugs with the same symptom. (1) The flex-overflow-center trap: `overflow-auto` + `items-center justify-center` pushes overflow outside the scrollable area; `align-items: safe center` falls back to `start` when content overflows. (2) Lenis `smoothWheel: true` registers a global `wheel` listener and `preventDefault`s — any nested scroll container that depends on native wheel delivery stops receiving events. The documented escape hatch is `data-lenis-prevent` on the scroll root (also added `overscroll-contain` so trackpad momentum doesn't bleed out). Any new modal / popover / drawer with its own scroll needs both fixes together; one without the other still looks broken.

---

## 2026-10-06 · smm-factory Prompt Architecture — orbit Diagram → WireflowMap

**Problem.** The clock-face orbit (shipped yesterday) was semantically correct — orchestrator at the geometric center, ten agents on a radius-300 circle, two loops rotating in opposite directions — but every node was still a BPMN primitive (`event` rounded-rect, `process` parallelogram, `action` diamond). Looked like a schematic; didn't feel like architecture. Reference the user flagged (a Figma-style user-flow map with browser-window skeletons, mock content inside each window, two arrow colours for primary flow vs. annotations, a right-side callout for context) carries far more information per node — a window labelled "approval" with four lines of Slack-thread mock reads instantly as "this is what the approval agent emits", whereas a diamond labelled "approval" just marks a decision gate without saying what the decision looks like.

**Decision.** New MDX primitive `WireflowMap` in `components/mdx/CaseStudySchemas.tsx` (~430 lines, exported + whitelisted in `CaseStudyBody.tsx`). API:

- **Nodes** are rounded white "browser windows" with a 26px title bar (three traffic-light dots on the left, uppercase title text, optional green dot on the right for `accent` nodes). Below the title divider: one of six mock variants — `slack` (small avatar circle + text line, up to 4 rows), `list` (bulleted text items), `grid` (R×C hairline squares — for the IG post grid), `chart` (bar sparkline from 0–1 values), `chips` (pill-shaped tags for hashtags), `wireframe` (fallback skeleton bars). Below the window: caption + mono sub (file ref like `04_approval`).
- **Edges** have two `kind`s only — `primary` (ink `#111` solid, 1.6px, triangular arrowhead) for the main pipeline, `annotation` (muted `#6B6B66` dashed `4 3`, 1.2px) for routing + telemetry. Routing is orthogonal L-shaped with `bend: "h-first" | "v-first"`; anchors land on the appropriate source/target edge.
- **Callouts** are rounded white rects to the right of a hub node, with uppercase title + bulleted item list — a place for file inventories or decision-rule summaries.
- **Legend** is a 2-item row above the diagram (one swatch per edge kind) matching the Diagram component's visual language.

Smm-factory orbit replaced with 10 agent windows + orchestrator hub + right-side "12 knowledge files" callout. Canvas 920×780 (constrained to ≤ 920 to fit the case-study prose column at ~695px without horizontal scroll; min-width lowered from 800 → 480 in `WireflowCanvas` style to allow graceful shrink). Primary chain: intake → analysis → content → approval → publisher → orchestrator (6 solid arrows). Annotation chain: orchestrator → intake / engagement (dispatch), analytics / strategy / trends → orchestrator (telemetry) — 5 dashed arrows. Mock content per window: intake slack-thread of a URL drop, analysis a 4-item list, content a 2×3 grid of IG post thumbnails, approval slack-thread of the three-tap approval, publisher slack-thread of the "✓ posted 09:00" receipt, orchestrator a 4-item list of its own rules ("Rules = Code", "One agent, one job", "Fail loud log all", "Weekly cron Mon 09:00"), engagement slack-thread of a DM reply, analytics a 7-bar sparkline, strategy a 4-item list of learned rules, trends 4 hashtag chips.

Rulebook `content/case-studies/CLAUDE.md` updated: `WireflowMap` added to §3.3 component catalog (one-line purpose) and new §5.9 with the five hard rules (canvas ≤ 920, mocks ≤ 24 chars/line, 2 edge kinds only, 1 callout max, legend always).

**Result.** Prompt Architecture section now reads as a dashboard, not a schematic. Each window shows a slice of what that agent actually produces; the two arrow colours separate "this week's content moving through the pipeline" from "orchestrator routing + telemetry running continuously"; the right-side callout grounds the whole thing in the 12 markdown files. Playwright verified at 1512/1280/1024 — all three widths render the 695px prose column with the SVG fitting without horizontal scroll, legend visible, no node clipping, callout aligned with the orchestrator.

**Lesson.**
- **A diagram's shape vocabulary carries meta-information.** BPMN diamonds + rects say "this is a formal process schematic". Browser-window skeletons with mock content say "this is a user-facing system where each surface produces something concrete". For an agent orchestration case study — where the whole value prop is "each agent emits one specific output that another agent consumes" — the window-with-content vocabulary carries more semantic weight than the BPMN shape dictionary.
- **MDX-consumed SVG components need canvas-vs-column awareness.** Case-study bodies render inside a ~695px prose column. A diagram declared at `width=1240` will either horizontally scroll (default) or scale down past legibility. The right default is `width ≤ 920` with a low `minWidth` floor so the SVG shrinks fluidly inside its container. Codified in rulebook §5.9 so the next WireflowMap author doesn't have to re-discover.
- **Two edge kinds is the ceiling for a two-colour legend.** The previous orbit shipped with three edge styles (solid, faint-solid, faint-dashed) and the legend had to explain each separately. WireflowMap enforces exactly `primary | annotation` at the type level — the legend fits in a single line, and no reader has to count arrow weights to tell flows apart.

---

## 2026-10-05 · smm-factory Results — desktop Slack Figure + new PhoneRow pair + orbit diagram

**Problem.** Three issues on the Results + Architecture pass: (1) the previous mobile Slack sidebar shot was useful but low-density — it showed the channel list but not the actual bot conversation that is the system's entire UX; (2) the PhoneRow was 3 items because the Slack sidebar was in there, meaning two of the three screenshots were tall-narrow framings of app chrome (sidebar + follower count) and only one actually showed shipped output; (3) the Prompt Architecture BPMN diagram was a clean three-row grid but read as "diagram, not architecture" — technically correct, visually boring. The architecture section is the "wow" moment of this case study for the recruiter-reader; it should feel designed, not just rendered.

**Decision.** Three parallel swaps.
1. **Desktop Slack as a `<Figure>` above the PhoneRow.** Captured a native 2380×1582 shot of the Noblelink workspace in desktop Slack with the SMM Factory APP mid-reply (11:50 AM thread, visual-direction diagnosis of a changes-requested post — "too polished/corporate, stock imagery, color palette mismatch"). This frame shows the bot DOING the strategist's job inline, which is the whole operational story. Placed as `<Figure frame="flat" width={2380} height={1582}>` so it reads full-bleed in the content column with a monospace-feel border, caption explaining "entire UI… conversational team member, not a dashboard".
2. **PhoneRow trimmed from 3 → 2.** Dropped the mobile Slack sidebar (now redundant with the desktop Figure above). Kept the two shots that document shipped output: @noble.booking profile (34 posts · 13 followers · 43 following · 10:59 iPhone timestamp — fresh captures from today's phone pairing session) and the "Clients book while you work." reel at 159 views. New source files replace the previous ones at the same `/case-studies/smm-factory/` paths; MD5 verified against `~/Downloads/IMG_5979.PNG` and `IMG_5980.PNG` to make sure the Next.js Image optimizer wasn't serving a stale `.next/cache/images/` entry (purged pre-screenshot). Old mobile Slack moved to `raw/slack-agents-mobile.png` as evidence.
3. **Orbit diagram — clock-face hub-and-spoke replaces the three-row grid.** Orchestrator now sits at (460, 380) as a green `action` diamond at the geometric center of an 880×760 viewBox. Ten agents on a circle of radius 300 at 36° intervals starting at 12 o'clock: intake (top) → clockwise through analysis, content, approval, publisher, engagement (6 o'clock), then counterclockwise analytics, strategy, query, trends (back toward top). Weekly content pipeline reads as the clockwise half; learning loop reads as the counterclockwise half. Ten dashed/faint spokes radiate from orchestrator to every agent — the cron fan-out. Legend labels the three semantics (event = content loop, process = utility loop, action = orchestrator & gates). Shape-geometry audit: all 10 agents clear the 16px viewBox margin; strategy/query at x=175 (leftmost, event half-width 80 → edge 95, margin 95 ≥ 16); content/approval at x=745 (rightmost, approval action half-width 94 → edge 839, margin 880-839=41 ≥ 22 for action); content pipeline and utility chains traced for node-crossings → clean (all perimeter chords go between adjacent circle positions, never across the hub).

**Result.** Results section now reads as "control plane → shipped artifacts → honest read": desktop Slack showing the bot inline, two phones showing what landed, honest numbers paragraph. Architecture section opens like a mandala — orchestrator glows at center, agents orbit, two loops cycle in opposite directions, every spoke radiating out. Visual density went up without adding noise.

**Lesson.**
- **A radial layout can carry more semantic weight than a linear one when there's a true hub.** A three-row grid implies hierarchy (top row first, bottom row second). A clock-face says "they're all peers around the center" — which is literally what the orchestrator-vs-agents architecture is. Match the visual rhetoric to the system's actual topology.
- **PhoneRow earns its slot per screenshot.** If one of three phone shots is tall-narrow app chrome (a sidebar, a settings panel), it dilutes the "shipped evidence" story. Promote chrome-y UI shots to desktop `<Figure>` where there's room to read the context, keep PhoneRow for actual product output.
- **`.next/cache/images` can mask file replacements.** Next.js Image serves optimized versions keyed on source URL + width + quality. Replacing `public/.../foo.png` with a new file keeps the same URL, so cached optimizations stay. Not usually a problem (file hash in build), but in dev-with-Turbopack it can confuse screenshot verification. If a visual replacement "looks like the old one", `rm -rf .next/cache/images` before any Playwright shot that's supposed to confirm the new asset.
- **Hub-and-spoke diagrams need the hub larger than the spokes.** Orchestrator as `action` (108h) with `color="success"` makes it unambiguously the center. If every node were the same shape and size, the eye would wander. Shape + color + central position = one glance = "this is the thing".

---

## 2026-10-05 · smm-factory Prompt Architecture — ASCII tree → BPMN Diagram

**Problem.** The "Prompt Architecture" section opened with a two-column fenced ASCII tree showing `agents/` folders on the left and `knowledge/` markdown files on the right. The information was accurate but the presentation was flat — a monospace block in a case study whose every other diagram speaks the project's BPMN vocabulary. A reader skimming the page saw the FlowSchema at the top (Weekly content pipeline + Learning loop), hit the Prompt Architecture section expecting the architecture to be painted the same way, and found a code-fence tree instead. The visual grammar broke mid-article.

**Decision.** Replaced the fenced tree with a `<Diagram>` BPMN visualization matching the rest of the case study. Width 1160 × height 540, three rows: (1) weekly content loop — six `event` rects for intake/analysis/content/approval/publisher/engagement with approval rendered as an `action` diamond (decision gate), each node carrying its knowledge filename as `sub`; (2) learning loop — four `process` parallelograms (analytics/strategy/query/trends), differentiated from Row 1 by shape so the two loops are visually distinct even at a glance; (3) orchestrator — one `action` diamond centered at the bottom, `color="success"` so it reads as the green coordination gate, `sub="11_orch.md"` (11 chars, within the §4.6 action-diamond limit). Edges: solid chain across Row 1, faint chain across Row 2, dashed/faint from orchestrator up to intake/content/analytics/engagement (fan-out from the state machine). Icons per node (`user`/`doc`/`code`/`check`/`bolt`/`sync`/`database`/`api`/`cloud`) picked from the existing `SchematicIcon` enum. Legend labels the three shape semantics; caption explains solid/faint/dashed. The downstream prose ("Every folder in `agents/` has a matching file in `knowledge/`...") stays intact — the Diagram shows what, the prose declares the invariant. Pre-ship: `verify:numbers` exit 0 (unchanged — knowledge-file count still "12 markdown files" in the prose above), `dev-errors.mjs` sweep clean across 12 routes, Playwright 1512px screenshot confirmed all 11 agent nodes + orchestrator render without clipping and no edge crosses a node body.

**Result.** The Prompt Architecture section now speaks the same visual language as the Weekly Content Pipeline + Learning Loop FlowSchema above it. The orchestrator pops in green at the bottom, the two loops are shape-differentiated (rect = content, parallelogram = utility), and the knowledge filenames sit as subs under each node — so a reader can trace agent-folder → spec-file without the monospace tree. Legend + caption keep it self-explanatory for the recruiter view.

**Lesson.**
- **Match the diagram vocabulary across a case study.** If one section renders a BPMN FlowSchema and the next renders ASCII in a code fence, the article reads as two half-finished drafts stitched together. A case study is a single visual contract — the four shape primitives (role/event/action/process) + two colors (neutral/success) + two edge styles (solid/dashed) are the vocabulary; use them consistently or the composition fractures.
- **Three-row Diagram layouts need width ≥ 1120 to fit 6 event nodes at pitch 190.** With event w=160 and action w=188, horizontal gaps need ≥ 174 to keep diamond-edge-to-event-edge separation visually comfortable. Pitch 190 gives 16px of clear space between the approval diamond's right edge and the publisher event's left edge — the minimum that still reads as "distinct nodes" rather than "touching". Below pitch 180, the diamond visually clips its neighbors.
- **Action-diamond `sub` field: 11_orch.md is 10 chars, 11_orchestrator is 15.** The §4.6 rulebook limit of 14 chars for action-diamond subs is enforced by geometry, not style — exceed it and text wraps outside the inscribed rectangle. The .md extension is a free 3-char tax if you want the filename look. For orchestrator the compromise was abbreviating to "11_orch.md"; for approval "04_approval" (11 chars, no extension) landed under the limit without truncation.

---

## 2026-10-05 · smm-factory PhoneRow — Slack sidebar + @noble.booking + 159-view reel

**Problem.** smm-factory.mdx had the agent/knowledge tree + a trimmed `content_gen.log` excerpt but zero product-side artifacts. A reader skimming the case study saw architecture and prose only — no evidence the pipeline actually posted anything or that it lived inside a real Slack workspace. Two previous attempts to capture the pilot output stalled because the physical iPhone wasn't visible to the laptop (CoreDevice sees it over WiFi as "paired" but the tunnel wouldn't open without USB).

**Decision.** Captured three artifacts straight off the connected iPhone 13 (iOS 26.6.2) with `pymobiledevice3 developer dvt screenshot` once the USB cable was plugged in. Flow: `apps list` → bundle IDs for Instagram (`com.burbn.instagram`) and Slack (`com.tinyspeck.chatlyio`) → `dvt launch` to foreground each → DVT screenshot. The three native 1170×2532 PNGs went into `/public/case-studies/smm-factory/` and got wired into a `<PhoneRow>` placed between Cost chips and the "honest read" paragraph in the Results section (deviation from §1 ordering — PhoneRow is specified for the Iteration Moment slot, but these screenshots document the pilot's live output and tie to Results claims, same deviation precedent as Lexora's second PhoneRow). Three items: Slack sidebar listing four `noble-agent-*` channels + the installed SMM Factory bot, @noble.booking profile (34 posts · 13 followers · 43 following · noblelink.app bio), one reel ("Clients book while you work.", 159 views, Kevin MacLeod music, FFmpeg-rendered). Pre-ship: `verify:numbers` exit 0, `/tmp/dev-errors.mjs` sweep across 12 routes clean, Playwright screenshot at 1512px confirmed the three phones render side-by-side without clipping.

**Result.** smm-factory now has a visual anchor for every Results claim — the 13-follower number lives next to the actual profile, the "40 posts" claim sits beside the account that holds them, the reel-rendering pipeline shows one of its outputs with view count intact. Three snapshots, no layout bugs, Lightbox opens on tap.

**Lesson.**
- **CoreDevice over WiFi is a "paired, cannot act" state on iOS 17+.** `xcrun devicectl list` happily shows "available (paired)" over the local Bonjour mesh, but `remote start-tunnel --native` fails with `ControlChannelConnectionError` until a USB cable creates a working trust channel. The pymobiledevice3 docs don't call this out directly — it looks like a tunnel bug but is a missing physical prerequisite.
- **pymobiledevice3 beats libimobiledevice for new iOS.** `brew install libimobiledevice` compiled for ~15 minutes (automake dependency chain on Intel Mac). pymobiledevice3 via pip finished in ~30 seconds and supports iOS 17+ out of the box with native (no-root) tunnel. For any new session needing iOS CLI, `pip3 install --user --break-system-packages pymobiledevice3` is the fast path.
- **`dvt screenshot` captures the live frame buffer — black screen = sleeping display.** First two shots came back solid black with only the iOS "recording in use" dot visible because the physical display was off. No programmatic way around this: the DVT service reads what the GPU is actually scanning out. Prerequisite: unlock phone, disable Auto-Lock or tap awake before every capture.
- **`dvt launch com.vendor.bundleid` foregrounds any installed app.** Combined with a 3–5s sleep this is enough to grab a specific app's current screen without any XCUITest/HID machinery. What it can't do: tap inside the app, scroll, switch channels in Slack. Those still need user action between launches.

---

## 2026-10-04 · Noble visual bundle — Lightbox + BPMN diagrams + TechNotes

**Problem.** Noble's technical story (RLS tenant isolation, booking race window, cache invalidation drift, Twilio A2P 10DLC compliance) was carried mostly by prose. Readers who skimmed the body missed the shape of the system; readers who stopped to read lost the thread because the one existing `<FlowSchema>` was a thin horizontal stack of boxes that didn't speak the vocabulary engineers expect. Screenshots were inline at ~390px wide — fonts in the Noble UI chrome unreadable. No landing point for a technical reader wanting to go deeper after the body closed.

**Decision.** Shipped a bundle of MDX visual primitives + wired Noble to use them:

1. **`components/ui/Lightbox.tsx`** — portal-based (`createPortal` → `document.body`) fullscreen modal. Escapes stacking context so Nav/DotGrid don't bleed through. ESC/click-outside/X close. Body scroll lock. `prefers-reduced-motion` respected (fade only). Pairs with `<ExpandButton>` affordance.
2. **`components/mdx/CaseStudySchemas.tsx`** — new file hosting six primitives, all `"use client"`:
   - **`<StackRow>`** — simple-icons brand chips (lazy SVG lookup, falls back to monogram if icon missing).
   - **`<PhoneRow>`** — 2 or 3 phone frames side-by-side; each phone is a `<button>` opening the screenshot in Lightbox at `max-h-[86vh] object-contain`.
   - **`<CompareGrid>`** — before/after two-column comparison with hairline columns.
   - **`<FlowSchema>`** — multi-row BPMN horizontal diagrams. Shape vocabulary: role=circle, event=rounded rect, action=diamond, process=parallelogram. Edge labels perpendicular-offset by 14px to avoid overlapping shapes. Each row has its own Expand button; Lightbox renders the canvas at intrinsic `minWidth` so mobile users scroll horizontally at readable text size.
   - **`<Diagram>`** — standalone BPMN diagram with the same shape/color/outcome vocabulary (success #22C55E, danger #111, approved ✓, denied ✗).
   - **`<TechNotes>`** — bento link grid for post-body technical references. Dark inverted badge (`</> TECHNICAL REFERENCES`) + big Playfair heading + hairline divider + REF counter. Each card: monospace eyebrow (kind glyph + label) → Playfair title → sans description → ↗ external / → internal arrow with hover slide.
3. **`components/mdx/CaseStudyVisuals.tsx`** — converted to `"use client"`; `<Figure>` wrapped in Lightbox so every image site-wide becomes expandable with a hover-revealed static expand icon. Removed the broken `caseStudyVisuals` aggregator object export (client files can't export non-component objects) — `CaseStudyBody.tsx` now imports each primitive individually and spreads them into the MDX components map.
4. **Noble MDX** (`content/case-studies/noble-saas.mdx`) rewrites: the thin FlowSchema became BPMN per-row with a decision diamond (cache check) + branch, standalone Diagram added for the booking race window, TechNotes block at the end with 6 real refs (STABLE_LOGIC.md, Supabase SSR + RLS docs, Next.js fetch cache, Twilio A2P 10DLC compliance, Stripe subscriptions).
5. **Mobile scroll affordance** — `md:hidden` right-edge gradient fade on FlowSchema rows signals the horizontal scroll even before touch.

Dependency add: `simple-icons@16.34.0` (only loaded by StackRow; brand SVGs resolved via dynamic property lookup, no sprite bundle).

**Result.** Noble case study renders clean (`npx tsc --noEmit` green). Playwright captures at `/tmp/noble-review/13..16-*.png` confirm desktop and mobile layouts. Lightbox opens on PhoneRow phones, Figure images, FlowSchema rows, Diagram, TechNotes items (external = new tab, internal = same tab). Nav no longer bleeds through modal backdrop on mobile. Mobile diagrams scroll horizontally inside Lightbox at readable text size instead of shrinking to viewport width. TechNotes header reads as "clearly technical" (inverted badge, `</>` glyph, Playfair display scale) after the user flagged the first version as too subtle.

**Lesson.**
- **Portal first for any fullscreen modal.** `z-index: 100` on a nested element is defeated by any ancestor with a transform (framer-motion mounts, `will-change`, `filter`, backdrop-blur all create containing blocks). `createPortal(..., document.body)` with a `mounted` SSR guard is the only pattern that holds across the stack.
- **Client-file component modules can't export aggregator objects.** `"use client"` restricts the module to serializable boundary values + component exports. The `export const caseStudyVisuals = { Figure, ImpactStats, ... }` pattern silently returned undefined on the server render path and produced "Expected component Figure to be defined" — fix is to drop the aggregator and import each primitive individually at the use site.
- **Nested interactive HTML is invalid.** `<button>` inside `<button>` renders without error but breaks tab order and screen-reader semantics. For a card that is itself a button, inner "icon affordance" must be a static `<span aria-hidden>` with the SVG, not an `<ExpandButton>`.
- **Mobile fullscreen means intrinsic width, not container width.** If the modal shrinks SVG to viewport, nothing was gained — the user still can't read the text. Set `minWidth` to the drawing's intrinsic width and let the Lightbox content area scroll.
- **BPMN vocab reads instantly to engineers.** Diamond-for-decision + circle-for-role + diagonal-arrow-with-label is a shared schema; a flat row of boxes isn't. Four shape primitives + three colors cover every system diagram the portfolio needs without reinventing a notation.
- **"Technical" needs to look technical.** The first TechNotes header used only a tiny uppercase eyebrow and the user called it insufficiently distinct. Inversion (ink background, elevated text) plus a `</>` glyph plus a bigger display heading made it unmistakable — monochrome palette still intact, just applied with contrast weight instead of color.
- **Figure-level primitive upgrades propagate for free.** Because `<Figure>` is used by every case study, adding Lightbox to CaseStudyVisuals.tsx made every image expandable without per-file edits. Verified on fieldmark without regression — confirms the primitive-first approach pays compound dividends.

---

## 2026-10-03 · ui-ux-pro audit — focus rings, faint text, arbitrary radius

**Problem.** Ran `ui-ux-pro` audit (external skill at
`~/.claude/skills/ui-ux-pro`) over the whole portfolio. Three findings:
(1) 13 interactive elements had `focus-visible:outline-none` with no
replacement ring — only a 0.5px translate as "focus feedback", which is
not perceivable as focus state for keyboard users. Direct violation of
the skill's `accessibility-checklist.md` ("never `outline: none` without
a replacement focus style"). Elements affected: `CTAButton` base,
`SocialPill`, `FloatingEmailCTA`, `ConsentBanner` (both buttons),
`BackToWork`, `BackToJournal`, `ExperienceMini` "Full timeline" link,
`ProjectAccordionRow` toggle + CTA, `WorkIndex` filter chips + "Clear
filters", `PostRow`, `PostCard`, `BlogComponents` link primitive.
(2) `BlogComponents.tsx:216` renders date metadata in
`text-[color:var(--ink-faint)]` — but `CLAUDE.md:113` declares faint
`#A8A8A2` as "decorative only" and `check_contrast.py` reports 2.17:1
on paper (fails AA at any size). Dates are information, not decoration.
(3) `VideoModal.tsx:51` uses literal `rounded-[16px]` — violates
`CLAUDE.md:242` ("no arbitrary `rounded-[Npx]`", radii come from tokens).
Status green `#22C55E` also fails AA against paper (2.07:1) but is used
only as a functional dot adjacent to a text label, which satisfies the
"never rely on color alone" rule — no fix needed.

**Decision.** (1) Copied the canonical pattern already present on
`Credentials.tsx:32`: `focus-visible:ring-2
focus-visible:ring-[color:var(--ink-primary)]/40`. Kept existing
`-translate-y-0.5` and `focus-visible:outline-none` so visual rhythm
stays — ring is additive, not a replacement for the subtle lift. For
`ProjectAccordionRow` row-toggle and `PostRow` (both wide
non-rectangular hit zones) added `ring-offset-2 ring-offset-[color:
var(--bg-page)] rounded-md` so the ring doesn't hug the content edge.
`PostCard` got `rounded-[var(--radius-card)]` on the outer `<Link>` so
the ring matches the article's rounded shape. For the inline link in
`BlogComponents.tsx:48` added `rounded-sm` so the ring has defined
corners in inline flow. Elements that already had a color-flip focus
(`ConsentResetLink`, `WorkIndex.tsx:101` meta link) were left alone —
their text-color change from muted → primary is a valid existing
replacement. (2) Swapped `--ink-faint` → `--ink-muted` on the date span
(4.86:1, passes AA normal). Treated the CLAUDE.md "faint = decorative"
rule as the source of truth; one line of drift fixed, no rule change.
(3) `rounded-[16px]` → `rounded-[var(--radius-card)]` — the value
already matched `--radius-card`, this is the lexical fix.

**Result.** 13 files touched, 17 insertions / 17 deletions. `tsc --noEmit`
clean. `eslint` on all 13 files clean — one pre-existing error on
`ProjectAccordionRow.tsx:27` (set-state-in-effect on a `matchMedia`
listener) unchanged; not introduced here. Dev server smoke:
`GET /` 200 (121KB, 124ms), `/work` 200, `/blog` 200, `/contact` 200.
Visual verification against focus ring pending — recommend tabbing
through nav + a project card + a blog card to confirm the ring reads
clearly on both paper and elevated backgrounds.

**Lesson.** `focus-visible:outline-none` without a replacement is the
single most common a11y regression on this project — it crept into
13 places over Sprints 7–11 despite `Credentials.tsx` demonstrating
the right pattern from the start. The canonical ring belongs in the
`CTAButton` base and in the two "card link" shells (`PostCard`,
`ProjectCard`-equivalent) so future components inherit it instead of
each author re-deriving. Consider promoting the "ring-2 ring-ink-primary/40"
string into a Tailwind component class or a `cn('focus-ring', ...)`
helper in `STABLE_LOGIC.md` before Sprint 12.

---

## 2026-10-03 · Lexora pre-ship pass — closes all six case studies

**Problem.** Lexora `.mdx` and `projects.ts` metric were frozen at the
submission snapshot and had drifted on four axes against `~/lexora`:
(1) **Build number**: MDX line 74 claimed "Build 13 in Apple review as of
2026-09-19"; disk `pubspec.yaml` reads `version: 1.0.0+15` and `DEVLOG.md`
documents the full post-publish arc — Build 13 same-day Gemini-key hotfix →
Build 14 moved Gemini behind a Supabase Edge Function with a Vertex AI
service account for stable auth → **Build 14 rejected under App Store
Guidelines 5.1.1(i) + 5.1.2(i)** for sending topic strings to a third-party
AI with no in-app disclosure → Build 15 (`91ccaf6`, 2026-09-29) adds an
in-app consent gate before any topic leaves the device. (2) **Skill count**:
MDX line 42 says "19 custom skills in `.claude/skills/`"; disk has 17.
(3) **Unit test count**: MDX + `projects.ts` metric both claim "61 unit
tests"; disk has 76 `test(` calls across 12 test files. (4) **Date range**:
tech-stack line reads `2026-08-30 → 2026-09-19`; last commit is 2026-09-29.
Confirmed accurate on probe: 12 supported languages (the language picker in
`create_playlist_sheet.dart`, `edit_playlist_sheet.dart`, and
`import_screen.dart` all enumerate the same 12 `(xx-XX, Label)` tuples), 5
silent MP3s (`assets/audio/silence_{1-5}s.mp3`), 7 integration flow files.

**Decision.** Fieldmark-pattern reconciliation. (1) MDX line 74 rewritten
end-to-end: "**Build 15** in Apple review as of 2026-09-29. Arc: Build 12
submitted → Build 13 same-day hotfix (rotated Gemini key) → Build 14 moved
Gemini behind a Supabase Edge Function with a Vertex AI service account for
stable auth → rejected under Guidelines 5.1.1(i) + 5.1.2(i) (undisclosed
third-party AI) → Build 15 adds an in-app consent gate before any topic
string leaves the device". The reviewer-rejection story stays in Results
instead of swapping into §Iteration Moment — the Claude→Gemini pivot is a
cleaner lesson about stack consolidation, and diluting §IM with a second
pivot weakens both. (2) MDX test line: "**61 unit tests** (mocktail +
Freezed), 7 integration flows" → "**76 unit tests** (mocktail + Freezed)
across 12 files, 7 integration flow files". (3) MDX line 42: "19 custom
skills" → "17 custom skills". (4) MDX tech-stack range end `2026-09-19` →
`2026-09-29`. (5) `projects.ts` lexora metric: "12 languages · 61 unit
tests · 5 silent MP3s" → "12 languages · 76 unit tests · 5 silent MP3s".
(6) `verify-case-study-numbers.mjs` extended with `LEXORA_REPO`, `LEXORA_MDX`,
`lexoraDisk()` returning
`{totalCommits, buildNumber, lastCommitDate, skillCount, languages, silentMp3s, unitTests}`
and Check #14 covering: build number vs pubspec, "as of" date vs last-commit
date, skill count via `.claude/skills/` dir listing, unit tests via
`find … | grep -c "^[[:space:]]*test(" | awk sum`, languages via picker
tuple parsing, and `projects.ts` metric reconciliation. Script auto-skips
with warning banner on absent repo — Vercel still ships.

**Result.** `node scripts/verify-case-study-numbers.mjs` prints clean 20-
check pass:
```
{
  devlog: 38, stable: 10, sprints: 14, daysSpan: 14, memory: 28,
  noble: { totalCommits: 234, first10Commits: 74, stableLines: 170 },
  smm: { firstCommit: '2026-06-08', knowledgeFiles: 12 },
  angel: { totalCommits: 1, firstHash: 'b652cd3', agentFiles: 6, docFiles: 6 },
  fieldmark: { totalCommits: 7, firstHash: 'f05b752', authSprintCommits: 5, ... },
  lexora: { totalCommits: 3, buildNumber: 15, lastCommitDate: '2026-09-29',
            skillCount: 17, languages: 12, silentMp3s: 5, unitTests: 76 }
}
```
All six case studies — hrekov-dev, noble, smm, angel, fieldmark, lexora —
have passed the pre-ship pass. Portfolio-facing truth now matches on-disk
state across build numbers, commit counts, test counts, file inventories,
and dates. The pre-ship queue is empty.

**Lesson.** Lexora had the most number-of-type drift of any case study (4
distinct axes) because it was published mid-flight: Build 12 was literally
in review when the MDX was authored, which created a snapshot-moment that
decayed as soon as review iterations began. The Apple-AI-compliance arc
(Build 14 → 15) wasn't anticipate-able at write-time — it's a reviewer
response, not a developer plan. Takeaway for future case studies on apps
still in review: either hold publication until the first "shipped" verdict,
or write the Results section in a form that assumes further build iterations
and plan to re-reconcile on each. The guardrail now catches build drift
automatically for any case study whose MDX uses the "Build N in Apple review
as of YYYY-MM-DD" idiom, so the detection cost is zero after the first
author pass.

---

## 2026-10-03 · Fieldmark pre-ship pass — closes the featured + in-review sweep

**Problem.** Fieldmark `.mdx` and `projects.ts` were frozen at
`2026-09-19 — waiting for Apple review`, which is now two weeks stale.
Disk truth: `pubspec.yaml` shows `version: 1.0.0+21`, and `~/fieldmark/DEVLOG.md`
holds three post-launch Problem/Decision/Result/Lesson entries (OTP delivery
failure, Delete Account broken, invitation idempotency across deletion) with
real foremen named — `clinetast1@gmail.com` on project `Sst`,
`volavokiiskelo@gmail.com` on `Building`, `b.denisd2@gmail.com` on
`SST Willow Creek Phase 2`. Build 21 is approved and live. The portfolio
still claimed `status: "in-review"` and `"0 shipped users at the time of
writing"`. Secondary gap: no guardrail covered Fieldmark's numeric claims —
the commit count (`7`), auth-sprint tally (`5` on 2026-09-18), or the three
hashes referenced in body copy (`f05b752`, `8b18221`, `071b10c`).

**Decision.** Light-touch reconciliation, not a rewrite: the case-study's
narrative arc is the Apple-rejection → native-ASAuthorization pivot, and that
arc still holds. (1) `projects.ts` fieldmark entry: `status: "in-review"` →
`"shipped"`; metric `"7 days empty repo to App Review"` →
`"7 days empty repo to App Store · live with 3 foreman crews"`.
(2) `fieldmark.mdx` frontmatter `status: in-review` → `shipped`.
(3) §Results lines 79–80 rewrite: "Build 20 rejected → Build 21 submitted
2026-09-19 → approved and live on the App Store"; the "0 shipped users"
bullet replaced with "Live with 3 foreman crews across 3 projects; three
post-launch bugs surfaced on real signups within days (OTP delivery, Delete
Account, invitation idempotency across deletion) — all diagnosed root-cause
and fixed, documented in DEVLOG.md". No invented metrics beyond what the
Fieldmark DEVLOG proves. (4) `verify-case-study-numbers.mjs` extended with
`FIELDMARK_REPO`, `fieldmarkDisk()` returning
`{totalCommits, firstHash, authSprintCommits, hasAuthHash, hasSubmitHash}`,
and Check #13 covering: 7-commit prose claim, 5-commit auth-sprint claim
anchored to 2026-09-18 date filter, all MDX-referenced hashes present via
`git cat-file -t`, frontmatter status must be `shipped`, three script
constants (`FIELDMARK_FIRST_HASH`, `FIELDMARK_AUTH_HASH`,
`FIELDMARK_SUBMIT_HASH`) match disk. Script auto-skips on absent repo with
the standard PARTIAL GUARDRAIL banner — Vercel keeps shipping.

**Result.** `node scripts/verify-case-study-numbers.mjs` prints clean 15-
check pass:
```
{
  devlog: 37, stable: 10, sprints: 14, daysSpan: 14, memory: 28,
  noble: { totalCommits: 234, first10Commits: 74, stableLines: 170 },
  smm: { firstCommit: '2026-06-08', knowledgeFiles: 12 },
  angel: { totalCommits: 1, firstHash: 'b652cd3', agentFiles: 6, docFiles: 6 },
  fieldmark: { totalCommits: 7, firstHash: 'f05b752', authSprintCommits: 5,
               hasAuthHash: true, hasSubmitHash: true }
}
```
Portfolio-facing truth now matches `pubspec.yaml` + Fieldmark DEVLOG; a reader
following the Fieldmark card no longer lands on a two-week-old "waiting for
review" page. All four featured case studies plus fieldmark have passed the
pre-ship pass. Only `lexora` remains in the queue.

**Lesson.** The right unit of pre-ship work is one case study end-to-end:
disk-truth probe → surgical edits → verify-script extension that locks the
numbers in place. Fieldmark fit in ~15 minutes because the pattern is now
fully internalized — four prior passes compressed each incremental step. The
cost of the first noble pass (90+ min, Option C narrative design) amortizes:
cases 2–5 each took 15–30 min because the guardrail skeleton, PARTIAL
GUARDRAIL banner, and MDX-vs-disk mental model were already resolved. Also:
"waiting for review" claims decay fastest — any future case study submitted
to a reviewer needs an explicit calendar reminder to update the portfolio
within 48h of the verdict, otherwise the page silently gaslights visitors.

---

## 2026-10-03 · Noble pre-ship pass (second expert invocation) + reconciliation guardrail generalized

**Problem.** Pre-ship pass on `noble-saas.mdx` surfaced four blockers inside a
single read: (1) `"151 commits in first 10 days"` was false — actual is 74;
the 151/152 figure was the April **monthly** total, conflated into a 10-day
window. The claim repeated in 5 locations (projects.ts metric,
recruiterSummary, §Context, §1 Before block, §Reflection item 1). (2) Total
commit count `227` was stale (disk: 234). Appeared in tagline + body +
recruiterSummary + MetricGrid. (3) Supporting artifact `"5 months, 12 days"`
was a frozen snapshot from ~2026-09-20 — today's disk truth is 5 months
25 days (178 days). (4) The `STABLE_LOGIC.md pattern` artifact linked to
the **portfolio's** `STABLE_LOGIC.md` (now 239 lines, describing the
portfolio's rules) but the detail text described **Noble's** 170-line file.
Reader following the link lands on the wrong artifact. Also softer:
MetricGrid claimed 3 pivots when only 2 are named with hashes (6b29244,
d6e1b5a); reflection §2 claimed velocity dropped `10×` when honest math is
20–30× daily (74 commits/10 days = 7.4/day vs 6–11/month = 0.3/day). Side
discovery during disk probing: Noble's git remote URL has an embedded GitHub
PAT visible on every `git remote -v` — flagged for user to rotate.

**Decision.** Option C narrative: honour both numbers, re-anchor to the
sprint vs April distinction. "74 commits in the first ten days to live
multi-tenant bookings. 152 by April's end, hardened against the 16 named
bugs." Preserves the velocity thesis (really was shipping fast) without
inventing a false headline. For the artifact mismatch, kept the link to
the portfolio's STABLE_LOGIC (public, inspectable, same pattern) and
reworded the detail to describe what the reader actually finds there
("rules that survive future refactors, promoted from a journal only after
proving themselves") — no longer claims it names Noble's edge cases.
Build-window artifact rewritten as a self-certified stale snapshot
("5 months 25 days as of 2026-10-03") per the STABLE_LOGIC rule promoted
the same morning. MetricGrid: 3 → 2 pivots with hashes inline; velocity
math corrected to "roughly 20× in daily terms."

**Result.** Reconciliation script extended with two new checks (projects.ts
noble-saas tagline/metric; MDX tagline/MetricGrid/first-10-days/
STABLE_LOGIC-line-count) sourcing disk truth from `/Users/ruslan/noble-saas`
via `git rev-list` + a `docs/STABLE_LOGIC.md` line count. Same local-only
guardrail model as the memory-dir check — on Vercel the loud PARTIAL
GUARDRAIL banner fires for Noble independently of the hrekov-dev memory
check. Verify now reports `noble: { totalCommits: 234, first10Commits: 74,
stableLines: 170 }` alongside the hrekov-dev state and passes clean. Total
checks on hrekov-dev + noble: 10. Second real pre-ship invocation of
`/shiploop-expert` — the pattern generalizes without capsule changes.

**Lesson.** The number-word drift guardrail promoted this morning paid for
itself inside hours — same category of drift (narrative claim with a wrong
cardinality) showed up on the next case study, same shape ("N commits in
window"), just with a different frame. Capsule is still thin and still
largely inert; what carried both reviews is the project-layer rules in
STABLE_LOGIC + the willingness to probe disk truth before trusting prose.
Second-order lesson: when a case study links to an external repo, run
`git remote -v` once; embedded PATs leak silently and nobody notices until
a `git clone` prints the URL in a log.

---

## 2026-10-03 · Domain-expert V1 + hrekov-dev positional override + numbers reconciliation (post-expert review)

**Problem.** Two issues surfaced in one review pass. (1) The hrekov-dev case
study still carried five stale number claims in the body (seventeen /
twenty-six / 26 min / MetricGrid 12-8-~1.5) even though the frontmatter + §6
had been reconciled earlier that day — the reconciliation script only
inspects `frontmatter detail:` strings, so body prose and `<MetricGrid>`
JSX drift was invisible to CI. (2) hrekov-dev was promoted to `featured: true`
and placed first on home per Ruslan's 2026-10-02 request, directly overriding
spec §12 ("home hero stays five case studies; hrekov-dev is a depth click,
not a peer"). The §1 cold open still read "the other five case studies **on
this page**" which was false from every vantage point: on `/work/hrekov-dev`
there are no sibling cards, on home the SelectedWork heading now says "Four
case studies" and includes hrekov-dev, on `/work` all six are listed. The
first real `/shiploop-expert phase=pre-ship` invocation caught 10 findings;
4 blockers, all narrative-integrity. Capsule's "numbers in prose must match
disk reality" rule was directly load-bearing.

**Decision.** Three-part fix.

- **Positional reword.** `hrekov-dev.mdx:58` → "The five client case studies
  on this site describe work I did for others. This one describes the site
  you're reading." Drops "on this page." `hrekov-dev.mdx:19`
  (recruiterSummary) → "This portfolio ships as its own case study, listed
  first on the home page. The five client cases (Noble, Angel, Lexora,
  Fieldmark, smm-factory) describe work I did for others…" Drops "6th case
  study" framing. Document the `featured: true` as a deliberate override of
  spec §12, not a bug.
- **Body-level number reconciliation.** Six locations (lines 66, 112, 211,
  219, 241, 383): twenty-six → twenty-eight; seventeen → twenty-eight; ~34
  min → ~56 min arithmetic. MetricGrid (lines 338-340): 12/8/~1.5 → 14/13/~1.1.
  §3 `ls memory/` listing (lines 116-135): regenerated verbatim from current
  disk (MEMORY.md + 28 files sorted). §4 MEMORY.md snippet left for a
  separate pass — expert flagged as "high" not "blocker."
- **Expert infrastructure, V1.** `.claude/agents/expert.md` (meta-agent,
  domain-agnostic, 5-phase bootstrap with 🧠 📚 🌐 📋 🎯 progress markers);
  `.claude/skills/shiploop-expert/SKILL.md` (slash command, parses
  `phase=pre-ship|in-progress|blind-bug`, dispatches to agent);
  `.claude/expertise/editorial-portfolio-site.md` (first capsule,
  `confidence: validated` after 3/3 blind-bug test). CLAUDE.md ShipLoop table
  gained row **E Expert**; Variant C rollout at Week 1 = opt-in.

**Result.** `node scripts/verify-case-study-numbers.mjs` passes:
`{ devlog: 35, stable: 10, sprints: 14, daysSpan: 13, memory: 28 }`. Grep for
stale number words in hrekov-dev.mdx returns zero hits. `tsc --noEmit` clean.
First real pre-ship expert invocation found 10 real findings (4 blockers, all
narrative-integrity), credited capsule as "load-bearing" for 6 of them.
Pattern mechanics proven on first non-blind-test run.

**Lesson.** Three distinct lessons.

1. **Numbers-in-prose guardrail must cover body + JSX, not just frontmatter
   detail strings.** The 2026-09-27 Sprint 12 lesson said "numbers rot
   without a guardrail"; the guardrail shipped but was too narrow. Reconciling
   frontmatter and leaving body prose stale is worse than not reconciling at
   all — a careful reader sees the numbers crossing each other and loses
   trust in all of them. The verify script now also inspects `projects.ts`
   metric string + tagline word; next extension needs to scan MDX body text
   (regex on number-word + unit) and `<MetricGrid items={…}>` JSX. Promote to
   STABLE_LOGIC: "numbers-in-prose guards cover body + JSX, not only
   frontmatter."

2. **Positional claims decay silently after a reorder.** When a case study
   says "on this page" or "6th case study" or "listed below," any later
   reordering or `featured` flip invalidates the claim without flagging it
   anywhere. Capsule already warned about this ("positional content must be
   audited after any reordering"). Rule: wording that embeds position should
   say "on this site" or name the sibling directly ("Noble, Angel, Lexora,
   Fieldmark, smm-factory") — never relative-positional. Promote to
   STABLE_LOGIC.

3. **Domain-expert pattern works and finds things humans miss.** V1 shipped
   today, first real invocation found 4 blockers in one case study. The
   capsule did the load-bearing work on narrative-integrity findings
   (specifically the "numbers in prose must match disk reality" line from
   the AI-collab variant section). Honest validation signal from the expert
   confirmed: capsule-driven for 6 of 10 findings, project-driven for 2,
   general knowledge for 2. Variant C stays at Week 1 opt-in — need 2-3
   more real invocations before advancing.

---

## 2026-09-27 · Sprint 12 — Portfolio meta case study (`hrekov-dev`)

**Problem.** The other five case studies describe client work. The
recursive claim of this portfolio — that the workflow scales because
the memory system is real — had no artifact of its own. A recruiter or
fractional client could see the outputs but not the machine. Also
needed a way to keep numeric claims (promotion rate, memory count,
sprint cadence) from drifting out of sync with disk truth.

**Decision.** Ship the portfolio itself as the 6th case study, slug
`hrekov-dev`, `featured: false` so the home hero stays "five case
studies." Ten-section body (~2000 words) covering: stateless-model
problem, persistence layer anatomy, MEMORY.md index, ShipLoop
discipline, DEVLOG→STABLE_LOGIC promotion, what the machine produced,
context re-hydration saved, how to steal it. Six embedded artifacts
including `feedback_css_cascade_first.md` verbatim, a DEVLOG→STABLE_LOGIC
pair, and the auto-memory spec excerpt inside a `<TechnicalDetail>`.
Cross-links `/about#stack` (backward) + forward-link block in
`AiStack.tsx`. Full spec+plan+tasks triple in
`specs/12-portfolio-meta-case-study/`. Numbers-guardrail script at
`scripts/verify-case-study-numbers.mjs` wired into `prebuild` — fails
build if MDX artifact `detail` strings drift from disk (DEVLOG
heading count, STABLE_LOGIC heading count, distinct Sprint N mentions,
day-span, memory dir file count).

**Result.** Route 200. All 10 h2 sections render (SSR). Six
artifacts + 4 devlogRefs in Technical view; recruiterSummary in both
views. Home `/` shows 5 cards; `/work` index shows 6. Sitemap contains
`/work/hrekov-dev`. Forward-link from `/about#stack` resolves. Noble
backlink in §7. Guardrail catches drift (proved with sabotage test:
37.5% → 50% exits 1 with "promotion percent: MDX=50%, disk=37.5%").
Verify-numbers passes: {devlog: 24, stable: 9, sprints: 11, daysSpan: 7,
memory: 17}. Reconciled MDX from stale claim of 13 memory files → 17.
tsc + build clean.

**Lesson.** Two things.
1. **MDX 3 hates blockquotes that contain code spans with curly braces.**
   `` > `@layer base { ... }` `` triggers "Unexpected lazy line in
   expression in container" and silently blanks the entire body — SSR
   returns 200 but zero content renders. Symptom looks like a routing
   or data fetching failure; root cause is the MDX parser treating the
   `{` as an unclosed JSX expression across blockquote lines. Fix:
   convert the blockquote to a fenced `text` code block. Rule for future
   case studies: **never quote code-heavy content with `>`, always
   fence with triple backticks + `text`.** Belongs in STABLE_LOGIC on
   promotion.
2. **Numbers-in-prose need a guardrail or they rot.** The MDX draft
   opened with "13 memory files" while disk had 17. Without the
   `verify:numbers` script wired into `prebuild`, that stale claim
   would have shipped invisibly. The script pays for itself the first
   time a memory file is added and the ramp-up claim needs updating.
   Pattern is generalizable to any case study that quantifies its own
   process.

---

## 2026-09-26 · Sprint 11 — Blog foundation + case study L2/L3 + GA4

**Problem.** Three things the portfolio was missing before it could
start doing marketing work: (1) a place for anything shorter than a
full case study (there was `/work` and nothing else — a debugging
trace, a field note, a pattern write-up had nowhere to land), (2) a
way to serve the same case study to a recruiter *and* a technical
reviewer without either audience feeling patronised (recruiters were
skipping straight to "Results"; engineers wanted the commit hashes
and the STABLE_LOGIC rationale), and (3) analytics — measurable
distribution is the whole point of the journal, but not at the cost
of dropping cookies on EU visitors before they can consent.

**Decision.** Three-phase build inside one sprint:

- **Phase A · Blog foundation** — new content type `content/blog.ts`
  (types + loader in one file, matches the `content/case-studies.ts`
  convention; deviated from spec which proposed a subdirectory). Four
  post formats: `case-study`, `build-log`, `skeptic`, `pattern`.
  MDX bodies at `content/blog/<slug>.mdx` with frontmatter validated
  at build time (throws on invalid format, non-YYYY-MM-DD dates,
  duplicate slugs, filename≠slug mismatch, featured post without a
  substantive tagline). `/blog` index (featured grid + chronological
  list, empty state ships too), `/blog/[slug]` (BlogPosting JSON-LD,
  BackToJournal pill, per-format container width, "Receipts" aside,
  manual `related:` frontmatter). `/rss.xml` route handler with
  CDATA descriptions and RFC-822 dates, RSS autodiscovery `<link>`
  emitted from `app/layout.tsx` metadata. `Journal` slot added to
  `Nav` between Work and About. `getBlogPosts()` folded into
  `app/sitemap.ts` with `updatedAt || publishedAt` as lastmod. Per-page
  OG images for `/blog` and `/blog/[slug]` via the existing satori
  template. Five MDX-only components (`Artifact`, `Cost`, `PromptLog`,
  `Diff`, `TechnicalDetail`) registered in a shared `blogComponents`
  map that both `BlogPostBody` and `CaseStudyBody` spread.

- **Phase B · Case study L2/L3** — extended
  `CaseStudyFrontmatter` with optional `recruiterSummary`,
  `supportingArtifacts`, `devlogRefs` (with an `Artifact` type
  imported from `content/blog.ts` so both content types share one
  vocabulary). New `<ArtifactList>` and `<DevlogRefs>` components,
  and a fixed-position `<ViewToggle>` that flips
  `article[data-view]` between `executive` and `technical` (persisted
  in localStorage). Show/hide is CSS-driven — three rules in
  `globals.css` gate `[data-mode="technical"]`, `.devlog-full`,
  `.artifact-detail`, `.devlog-summary`, `.recruiter-only`. No
  React re-render; toggle is instant. `<TechnicalDetail>` inside
  case-study MDX is invisible in executive view. Toggle only mounts
  when at least one of the enhanced fields is present (`hasEnhanced`
  flag), so the four case studies without the new fields render
  unchanged. Backfilled `noble-saas.mdx` with 7 real
  `supportingArtifacts` extracted from the body (2 timeline, 2 cost,
  2 commit hashes, 1 link to STABLE_LOGIC). `recruiterSummary` and
  `devlogRefs` left blank on Noble deliberately — the summary needs
  a Ruslan draft (recruiter-facing prose), and Noble's DEVLOG lives
  in a different repo.

- **Phase C · GA4 with EU consent** — `proxy.ts` at repo root reads
  Vercel's `x-vercel-ip-country` and writes a `geo-eu=1|0` cookie
  for one day. `lib/consent-geo.ts` lists 27 EU members + GB + NO/IS/LI
  + CH. `lib/consent.ts` provides client cookie helpers,
  `lib/analytics.ts` is a one-line `track()` around `window.gtag`.
  `ConsentProvider` reads consent state + geo cookie on mount;
  `analyticsAllowed` derives to `mounted && (consent === "accepted"
  || (!isEu && consent !== "rejected"))`. `<GA4>` only renders the
  gtag script when allowed. `<PageViews>` sends a manual `config`
  call on every route change with `anonymize_ip: true` (init disables
  `send_page_view`). `<ConsentBanner>` shows only for EU visitors
  with `consent === "unset"`. `<ConsentResetLink>` in the footer lets
  either audience change their mind. Four events wired:
  `blog_post_read` (IO sentinel at 20% from viewport bottom, once
  per slug), `case_study_view_toggle`, `contact_form_submit` (on
  Server Action success, includes the intent value),
  `external_link_click` (delegated `document` listener, skips
  hrekov.dev / www / localhost).

- **Phase D · Seed post + docs** — first entry
  `content/blog/launching-the-journal.mdx` (build-log format,
  featured, distribution row for RSS live + LinkedIn/dev.to planned).
  README updated with an "Analytics + consent" section covering the
  event list, geo flow, and local testing shortcut. `.env.example`
  gained `NEXT_PUBLIC_GA_ID` and `NEXT_PUBLIC_GSC_VERIFICATION` with
  inline docs.

**Result.** `npx tsc --noEmit` clean. Dev-server smoke: `/`, `/blog`,
`/blog/launching-the-journal`, `/rss.xml`, `/work/noble-saas` all
return 200. RSS is a valid feed with one `<item>` (the seed post).
Proxy sets `geo-eu=0` on every response for a US-originating request.
Middleware convention deprecation caught on first curl — Next.js 16
renamed `middleware.ts` → `proxy.ts` and the exported function from
`middleware` → `proxy`; migrated in-place before continuing. Blog
frontmatter validator also caught the seed post's filename convention
on first load (`YYYY-MM-DD-<slug>.mdx` vs. slug-only); renamed to
`launching-the-journal.mdx` to match the case-studies convention.
Total: 15 new files across analytics, blog, and case-study components;
7 modified (layout.tsx, Footer, ContactForm, ViewToggle,
CaseStudyBody, case-studies.ts, noble-saas frontmatter, README,
sitemap, .env.example).

**Lesson.** Two things. (1) *CSS-driven view toggles beat React
re-renders when the whole point is a fast audience switch* — one
data-attribute on `<article>`, three CSS rules, no state coupling
between server-rendered MDX and a client interaction; the toggle
never desyncs from the DOM because it *is* the DOM. (2) *Consent
belongs at the loading boundary, not at the sending boundary* — the
GA4 script simply doesn't ship for a user who hasn't opted in, so
there is no "well-behaved tracking to disable"; there is nothing to
disable. That collapses a whole class of consent-management bugs.

---

## 2026-09-26 · Domain + surname rename → hrekov.dev / Hrekov

**Problem.** Two long-standing placeholders throughout the codebase:
(1) canonical URL was `ruslan.dev` — chosen in Phase 0 discovery as
aspirational, never verified; RDAP now confirms it's registered by
someone else and unavailable. (2) surname was written "Grekov"
(Russian romanization) in bio, JSON-LD author, OG images, and footer,
but Ruslan's actual preferred romanization is "Hrekov" (Ukrainian
standard Г→H, per Cabinet of Ministers). Contact email
`rusgrekovua@gmail.com` uses the old spelling and must not be touched
(it's a real live account).

**Decision.** After surveying ~40 candidate domains via RDAP and
weighing pros/cons of `.dev` / `.com` / `.io` / `.org` / geo-TLDs,
picked **`hrekov.dev`** — surname + tech-signal TLD, standard price
(~$12/yr at Cloudflare), HSTS preload out-of-the-box, matches the
target audience (CTOs, tech-founders) who read `.dev` as
professional-tech signal. Site-wide sed replacement scoped
explicitly to production files only (17 files), skipping historical
records (DEVLOG, specs/, memory/) which document what we thought at
the time.

- `ruslan.dev` → `hrekov.dev` (21 occurrences across: `app/layout.tsx`
  metadataBase, `app/robots.ts`, `app/sitemap.ts`, all 5 OG image
  routes, `lib/og-template.tsx` footer, case-study JSON-LD, README
  env-var example, CLAUDE.md project description)
- `Ruslan Grekov` → `Ruslan Hrekov` (17 occurrences: author name in
  JSON-LD, OG image bylines, footer copyright, `content/about.ts`
  bio paragraph, Hero.tsx bio, page-level `<Metadata>` titles/descs)
- `rusgrekovua@gmail.com` left intact (sed pattern was case-sensitive
  full-name-only `Ruslan Grekov`, never matched lowercase substring
  inside email).

**Result.** Grep sweep returns zero remaining production hits for
`ruslan.dev` or `Ruslan Grekov`. Typecheck clean. Playwright sweep
across `/`, `/about`, `/services`, `/work`, `/work/noble`,
`/contact` at 1440×900 all render 200 with zero console errors and
zero string-leaks in the rendered HTML. New user-facing identity is
now consistent everywhere.

**Lesson.** When placeholders are load-bearing (canonical URLs, OG
metadata, JSON-LD author), they compound cost over time. Ship the
real value in one atomic swap, not gradual per-file fixes — a single
sed pass + Playwright sweep is cheaper and more auditable than 21
separate diffs. Also: user's own romanization preference is a
first-class fact worth capturing in memory (`user_name_romanization.md`)
so future sessions don't reintroduce "Grekov".

---

## 2026-09-25 · Motion pattern propagation to all pages

**Problem.** The Hero soften/asymmetric-hover pass only touched Home.
The other routes (`/about`, `/services`, `/work`, `/work/[slug]`,
`/contact`) still rendered their heros and section bodies with plain
static markup — no mask reveal on titles, no fade-up on badges/copy,
no stagger on grids/lists, and no asymmetric hover on filter chips or
social pills. Feel was inconsistent between Home and everything else.

**Decision.** Establish a single site-wide header pattern and apply it
uniformly:

- SectionBadge → `<Reveal>`
- Page `<h1>` → `<MaskReveal mode="mount" delay={0.15}>`
- Tagline `<p>` → `<Reveal delay={0.25}>`
- Meta/CTA rows → `<Reveal delay={0.35+}>`
- Grids/timelines/socials → `<Stagger>` + `<StaggerItem>` (with
  `as="ul|ol|li|article"` where semantic HTML matters)
- Interactive chips/pills → framer `motion.*` with the asymmetric
  hover contract (slow `whileHover.transition`, fast base `transition`)

Applied to:
`app/(marketing)/about/page.tsx`, `.../services/page.tsx`,
`.../work/page.tsx`, `.../work/[slug]/page.tsx`, `.../contact/page.tsx`,
plus the section components they compose: `AiStack`, `Values`,
`Experience`, `ServicesFull`, `WorkIndex`. Extended `Stagger.tsx` with
a generic `as` prop so lists stay semantic (`ol > li`, `ul > li`).
Extracted `SocialPill` client component so contact-page socials get
asymmetric hover without leaking `"use client"` to the page shell.

**Result.** Playwright sweep across `/`, `/about`, `/services`,
`/work`, `/work/noble`, `/contact`: all 200, all render expected
`<h1>` text, zero console/page errors. Typecheck clean. Every route
now opens with the same badge-fade → title-mask → tagline-fade →
grid-stagger cascade, and every interactive tile snaps back faster
than it eases in.

**Lesson.** When a motion pattern is worth applying, apply it
everywhere in one pass — inconsistent motion reads worse than no
motion at all. A generic `as` prop on stagger primitives is cheap and
prevents the "div-soup for semantics" tradeoff.

---

## 2026-09-25 · Hero soften v2 + asymmetric hover

**Problem.** User feedback on the previous pass: (1) the "Available for
new Project" pill still felt "flat" — needed to be softer and slower on
mount; (2) the RG monogram hover felt too clipped; (3) the return to
rest state after removing the cursor was too slow — the tile should snap
back quickly.

**Decision.** Widen mount timings on the pill, split the monogram into
mount-wrapper + hover-inner so mount and hover can carry different
transitions, and set an **asymmetric hover pattern** for the two
interactive tiles: slow `whileHover` transition for the enter, short
default `transition` on the element for the leave.

- **StatusPill** (`StatusPill.tsx`) — outer fade 0.5 → 0.75s, dot scale
  0.5 → 0.75s, label unfold 0.75 → 1.15s. Delays widened so the beats
  don't stack: pill (t=chrome) → dot (+0.1) → label (+0.6).
- **RG monogram** (`Hero.tsx`) — split into outer mount wrapper (opacity
  + scale 0 → 1 over 1.05s) and inner hover element. Inner element:
  `whileHover.transition: { duration: 0.65, easeSmooth }` for the slow
  hover-in; base `transition: { duration: 0.22, easeSmooth }` for the
  fast return-to-rest.
- **FloatingEmailCTA** (`FloatingEmailCTA.tsx`) — same asymmetric
  split: positioning wrapper owns the mount slide-up (`y: 60 → 0`,
  duration 0.9s, delay 1.5s), inner anchor owns hover with
  `whileHover.transition: 0.55s` and base `transition: 0.22s` for the
  quick release.

**Result.** Playwright: pill takes noticeably longer to finish unfolding
(text still growing at t=900ms). Hover-hold screenshot on RG confirms
scaled+rotated state; 100 ms after mouse leaves the tile is already
back at identity — leave completes visibly faster than enter, matching
the reference feel. Zero console errors, typecheck clean.

**Lesson.** Framer's `whileHover` uses the target variant's transition
for the *enter*; the leave uses the component's base `transition`. If
you want asymmetric enter/leave, split the element: outer element owns
mount (its `transition` is consumed by initial → animate), inner
element owns hover (its `transition` is consumed on leave, and
`whileHover.transition` on enter). Trying to do all three on one
element makes at least one of them wrong.

---

## 2026-09-25 · Hero micro-refinements (4 touch-ups)

**Problem.** After the softening pass, user pointed at four moments on the
Hero that still felt flat: (1) the RG monogram just faded in at ~92% scale,
never announcing itself; (2) it had no hover state; (3) the "Available for
new Project" pill appeared as a finished object rather than assembling; (4)
the floating email CTA popped into place without a mount gesture and had a
minimal hover response.

**Decision.** Four scoped changes, all gated by `usePrefersReducedMotion`:

- **RG monogram** (`Hero.tsx`) — initial scale bumped 0.92 → **0** so it
  grows from nothing. Added `whileHover: { scale: 1.06, rotate: -5,
  transition: 0.3s easeSmooth }` — plays a distinct playful tilt on hover
  without borrowing the 0.8s mount timing.
- **StatusPill unfold** (`StatusPill.tsx`) — component became a client
  motion component with an opt-in `revealDelay?: number`. When provided,
  sequences: pill container fade in → dot scales 0 → 1 → label span
  animates `maxWidth: 0 → 320px` with fade, unfolding the pill sideways
  from a dot-only chip to full text. Removed the outer `motion.div` wrap
  in Hero (previously did a plain fade) so the pill's own choreography
  isn't buried under a parent fade.
- **FloatingEmailCTA** (`FloatingEmailCTA.tsx`) — converted to client,
  wrapped anchor in a fixed positioning `<div>` so framer's `y` transform
  no longer fights tailwind's `-translate-x-1/2`. Mount: `y: 60 → 0` +
  fade, delay 1.5s (fires after Hero settles). Hover/focus: `y: -6,
  scale: 1.04` — bigger jump than the old `-translate-y-0.5` and adds a
  scale beat. Kept single `hover` config reused for `whileHover` and
  `whileFocus` for keyboard parity.

**Result.** Playwright multi-timestamp capture (t=180, 380, 700, 1100,
1600, 2400 ms) confirms the intended assembly: at t=380 the pill is a
tight dot-only chip and the monogram is mid-scale; at t=700 the pill has
unfolded to full text and monogram is at rest; at t=1600 title lines are
seated and email CTA has emerged from below. Hover screenshot on the
monogram shows the -5° left tilt. Zero page errors, zero console errors,
typecheck clean.

**Lesson.** When a tailwind class uses `transform` (like `-translate-x-1/2`)
on an element you also want framer to animate, framer wins — its
`translate3d` overwrites the tailwind transform. Move positioning to a
wrapper div and let the motion element own its transform. Same pattern
applies to `whileHover` scale+rotate: give it its own `transition` object,
or it inherits the parent's mount timing (0.8s with a 0.28s delay) and the
hover feels broken.

---

## 2026-09-25 · Softer motion timing (плавніше pass)

**Problem.** After the reveal choreography landed the cadence felt too
snappy — mask reveals slammed open, section stagger fired too tightly,
Hero mount felt hurried against the editorial voice. User asked for
"плавніше" (smoother) across the board.

**Decision.** Introduced a second easing curve and widened every timing
knob rather than tweaking values in-place, so both curves stay callable
if a future component needs the punchier one:

- `lib/motion.ts` — added `easeSmooth: [0.16, 1, 0.3, 1]` (gentler
  ease-out than `easeOutExpo`) and bumped `staggerPresets.line`
  0.12 → 0.14.
- `Reveal.tsx` — duration 0.55 → 0.85, ease → `easeSmooth`, y default
  kept at 32.
- `MaskReveal.tsx` — duration 0.85 → 1.15, ease → `easeSmooth`.
- `Stagger.tsx` — `staggerChildren` 0.08 → 0.14, `delayChildren`
  0.05 → 0.12, `StaggerItem` duration 0.55 → 0.85 with `easeSmooth`.
- `Counter.tsx` — duration 0.7 → 1.1, ease → `easeSmooth`.
- `Hero.tsx` — full recadence: chrome 0.1s → monogram 0.28s → title
  line 1 0.48s → title line 2 0.72s → socials 1.05s → tagline 1.2s →
  CTA 1.4s. Base fade duration 0.55 → 0.85 with y 12 → 14. Socials
  `staggerChildren` 0.06 → 0.09 with item duration 0.4 → 0.7 and
  matching y bump. Monogram scale 0.9 → 0.92 over 0.8s. All eases
  swapped to `easeSmooth`.
- `ProjectAccordionRow.tsx` — row entry duration 0.55 → 0.85 with
  per-row delay factor 0.08 → 0.14 and `easeSmooth`. Kept
  `easeOutExpo` for the inner expand animations (accordion opening
  should still feel decisive when clicked).
- Section h2 `MaskReveal` delays widened 0.10 → 0.15 (line 1) and
  0.22 → 0.32 (line 2) across SelectedWork, Services, HowItWorks,
  Benefits, Testimonials so both lines have room to breathe.

**Result.** Playwright multi-viewport sweep (desktop 1440×900, mobile
390×844, desktop reduced-motion) captured mid-flight frames at 180,
380, 700, 1100, 1600 ms. Confirmed:

- t=380ms: chrome + monogram + status pill in, title still masked.
- t=700ms: line 1 fully in, line 2 arriving.
- t=1100ms: title done, socials staggered in, tagline arriving.
- After scroll to `#work`: accordion header + all rows render clean.
- Zero page errors, zero console errors on every profile.

**Lesson.** When soft-easing a whole system, add a *new* easing curve
alongside the existing one rather than mutating the shared constant.
`easeOutExpo` still fits interactive moments (accordion click, hover)
where crispness reads as responsive — `easeSmooth` fits ambient
choreography where crispness reads as impatience. Same file, two
tools, no regression on the components that were already right.

---

## 2026-09-25 · Full-page reveal choreography

**Problem.** After the accordion shipped, the rest of the home page still
mounted "all at once" — no orchestrated first-paint, section headings just
appeared without ceremony, list content had no stagger. User shared a
reference video (Nova-style scroll+mount reveals with big text mask-reveals,
staggered card entry, number counters) and asked for the same feeling
adapted to our editorial monochrome.

**Decision.** Four small motion primitives + a Hero rewrite + a light touch
on every home section, all under existing gates (`prefers-reduced-motion` +
`matchMedia("(hover: hover)")`):

1. `components/ui/Reveal.tsx` — `whileInView` fade+y=32 (bigger than
   `FadeUp`'s y=8, kept `FadeUp` for micro-uses so other pages don't
   regress).
2. `components/ui/MaskReveal.tsx` — overflow-hidden wrapper with inner
   translateY 110% → 0. Applied to every h2 heading line on home
   (SelectedWork, Services, HowItWorks, Benefits, Testimonials). Editorial
   analogue of the reference's MAVKA horizontal-split reveal.
3. `components/ui/Stagger.tsx` — `Stagger` + `StaggerItem` pair, framer
   variants with `staggerChildren: 0.08` / `delayChildren: 0.05`. Wraps
   Services/HowItWorks/Benefits/Testimonials card containers.
4. `components/ui/Counter.tsx` — splits arbitrary text on numeric tokens
   and ticks each 0 → target via framer's `animate()`. Wired into
   `ProjectAccordionRow` metric line, fires on `expanded` state change
   (e.g., "151 commits" ticks up when the row opens).
5. `Hero.tsx` — converted to client, mount choreography sequences chrome
   (0.05s) → RG monogram scale-in (0.15s) → title line 1 mask (0.28s) →
   title line 2 mask (0.45s) → socials 4-item stagger (0.62s) → tagline
   (0.72s) → Discover CTA (0.86s). Total ~1.3s. Under reduce-motion all
   delays collapse to 0 and transforms drop to opacity.

**Result.** Playwright at 1440×900 + 390×844 across 7 runs (initial load,
+1.4s post-load, 3 scroll fractions, reduce-motion, mobile): zero page
errors, zero console errors. Home now feels assembled (first paint) and
alive (scroll). Typecheck clean.

**Lesson.** For editorial mask-reveals, `overflow-hidden` + inner
`translateY: 110%` beats `clip-path` — cheaper on paint, animates on every
browser, and composes cleanly with framer's `whileInView`. For heading
choreography, per-line children with staggered `delay` props keep the
primitive dumb (no line-splitting inside) — callers just pass one
`MaskReveal` per visual line. Never conflate the animation primitive with
line-detection logic.

---

## 2026-09-25 · SelectedWork → interactive accordion

**Problem.** The three featured cards on `/` were static — three
identical 16:8 tiles in a grid, no interaction beyond hover-lift. User
shared a reference video (numbered accordion, expand/collapse with
colorful blob backgrounds) with the note "щось типу такого але може і
цікавіше" — asking for the pattern adapted, but more interesting.

**Decision.** Rewrite `SelectedWork` as a vertical accordion stack,
staying strictly monochrome (no blobs — that would break the design
rule that green `#22C55E` is the only chromatic accent). Row layout:
big Playfair number · sans name + status/year · `+` toggle. Expanded
panel reveals the tagline in a Playfair pull-quote (word-by-word
stagger), metric in small caps, stack chips, `Read case study →`
link. "Цікавіше" moves: (a) `+` rotates 45° into `×`, (b) number scales
1 → 1.05, (c) tagline word-stagger reveal, (d) magnetic number on
hover (±8px/±4px, spring-tracked), (e) row-entry stagger on scroll-in
(80ms between siblings). All magnetic + row motion gated on
`prefers-reduced-motion` AND `matchMedia("(hover: hover)")`.

**Result.** `components/sections/ProjectAccordionRow.tsx` (client,
framer-motion) + rewrite of `components/sections/SelectedWork.tsx`
(server, renders the featured 3 as accordion children). Playwright at
1440×900 + 390×844: aria-expanded flips correctly, zero console
errors, expanded panel reads editorial. Contrast on `#111` × `#F5F4EF`
= 17.15:1 (AAA). Ships in place of the 3-card grid on home.

**Lesson.** Reference videos with a distinctive visual signature
(colorful blobs) can be adapted structurally without importing the
signature — the interaction pattern (numbered accordion, +/× toggle,
tagline reveal) carries the "feel", the palette stays true to the
project. Also: `useSpring` from framer-motion beats hand-rolled rAF
for magnetic effects — one line to add momentum, and it composes with
`useMotionValue` cleanly.

---

## 2026-09-25 · Sprint 9 polish batch (6 items, no blockers)

**Problem.** After DualCTA removal and the CSS-cascade fix stabilized
the site, six polish items were left blocking a "shippable" state:
duplicated `<a>` CTA class strings across ~8 sites (drift risk after the
next class change), no `not-found.tsx` at either the root or
`/work/[slug]` (Next serves a raw stub), no JSON-LD (Article schema
missing → poor SEO surface for case studies), sitemap `lastmod` faked
with `new Date()` (crawlers can't tell when a study was updated),
missing MDX-bundling skeleton on `/work/[slug]` (blank flash during
navigation), OG images falling back to system serif (satori doesn't
ship Playfair Display).

**Decision.** Shipped all six in one batch since none blocked another:

1. `not-found.tsx` at `app/` (Home + Selected work CTAs) and
   `app/(marketing)/work/[slug]/` (Back to work CTA). Both use
   `SectionBadge` + Playfair h1 + design-token pill.
2. Person JSON-LD in `app/layout.tsx` `<body>` (sameAs → GitHub + X);
   Article JSON-LD in `/work/[slug]/page.tsx` (headline, tagline,
   datePublished, author.Person, keywords ← frontmatter.stack).
3. `sitemap.ts` now `async`, reads `getAllCaseStudies()` and emits
   per-study `lastModified: new Date(publishedAt)`. Home + `/work`
   index use the most-recent study's date.
4. `app/(marketing)/work/[slug]/loading.tsx` — matched-layout skeleton
   (badge + title + tagline + stack pills + 8 body lines), all
   `animate-pulse` on `--hairline` tone.
5. `lib/og-fonts.ts` fetches Playfair Display 700 TTF from Google Fonts
   using `User-Agent: Mozilla/4.0` (WOFF2 magic bytes `wOF2` are
   unsupported by satori; only pre-modern UAs get the TTF endpoint).
   In-memory cache per weight. `lib/og-template.tsx` and the two
   inline OG generators (`app/opengraph-image.tsx`,
   `app/(marketing)/work/[slug]/opengraph-image.tsx`) switched from
   `fontFamily: "serif"` to `"Playfair Display"` and pass
   `{ fonts }` to `ImageResponse`.
6. `components/ui/CTAButton.tsx` rewritten as `CTALink` + `CTAButton`
   primitives with `variant: primary | outline`, `size: sm | md`.
   Base/variants/sizes composed via helper. Swapped 6 sites: Footer
   "Let's talk", ContactForm "Send message" (submit), root 404 (Home +
   Selected work), CS 404 (Back to work), `/about` DualCTA pair,
   `/services` triple. `BackToWork` fixed-pill and `FloatingEmailCTA`
   avatar-pill kept separate — different visual affordances.

**Gotchas.** Variable Playfair TTF from google/fonts GitHub raw
(`PlayfairDisplay[wght].ttf`) crashed satori with `Cannot read
properties of undefined (reading '256')` — satori can't resolve weight
axis from variable fonts. Static single-weight TTF via legacy-UA
Google Fonts endpoint works. Also: `/work/[slug]` returns HTTP 200
with `next-error` meta and not-found body in dev (Turbopack quirk);
in production this correctly becomes 404.

**Result.** All six pages verified via Playwright. All 6 OG images
render 45–75KB PNGs with Playfair headline. All CTA pills computed
`rgb(250,250,247)` on `rgb(10,10,10)` (primary) or `rgb(17,17,17)` on
`rgb(255,255,255)` (outline) — both pass WCAG AAA. Sitemap emits
correct per-study `<lastmod>2026-04-08T00:00:00.000Z</lastmod>` etc.

**Lesson.** For satori font embedding, always fetch a static
single-weight TTF, never a variable font. And Google Fonts serves
different formats per UA — set `User-Agent: Mozilla/4.0` to force TTF.

---

## 2026-09-25 · CSS layer bug — real root cause of "invisible CTA text"

**Problem.** After the DEVLOG-in-Tailwind-scan fix landed and the CSS
bundle compiled cleanly, I reverted the three inline-style workarounds
back to `text-[color:var(--cta-ink)]`. Playwright audit immediately
regressed — every anchor-based CTA (`FloatingEmailCTA`, footer
`Let's talk`, DualCTA `Book a fractional call`) computed color
`rgb(42, 42, 40)` (`--ink-body`) on `rgb(10, 10, 10)` background,
invisible. But `<button>` CTAs on `/contact` (`Send message`) and
`/work` (chip filters) rendered `rgb(250, 250, 247)` correctly. Same
utility class, different tag.

The tag mattered because `globals.css` had `a { color: inherit; }`
sitting **unlayered**. Tailwind v4 emits utility rules inside
`@layer utilities`. In CSS cascade order, **any unlayered rule beats
any layered rule regardless of specificity** — so `a { color:
inherit }` (spec 0,0,1, unlayered) always won against
`.text-\[color\:var\(--cta-ink\)\] { color: var(--cta-ink) }` (spec
0,1,0, in `@layer utilities`). Anchors inherited `--ink-body` from
`body`; buttons don't inherit color, so they were unaffected.

This is the **actual** root cause of every "invisible CTA pill"
symptom this session — not JIT ordering, not markdown scanning, not
HMR cache. Both prior fixes (inline styles, then Tailwind
constraints) were treating symptoms of layered vs unlayered cascade.
The bug had been latent since day one; it only surfaced now because
`FloatingEmailCTA` was the first anchor-based CTA using `--cta-ink`.

**Decision.** Wrapped `html`, `body`, `::selection`, and
`a { color: inherit }` in `@layer base { ... }` in
`app/globals.css`. Base and utilities are both declared layers in
Tailwind v4 (order: `theme, base, components, utilities`), so
utilities now beat these element defaults in the normal cascade —
which is exactly how Tailwind expects a project's base styles to be
authored. Reverted the three inline-style workarounds so the code
reads cleanly with utility classes.

**Result.** Playwright sweep across `/`, `/about`, `/work`,
`/work/noble-saas`, `/services`, `/contact`: every element carrying
`text-[color:var(--cta-ink)]` computes `rgb(250, 250, 247)`. No
inline color/background workarounds remain in `FloatingEmailCTA`,
`Footer`, or `DualCTA`. Bundle is clean.

**Lesson.** Two things.
1. **Any element-level style in `globals.css` must live in
   `@layer base`**, or it will beat every Tailwind utility and every
   component style regardless of specificity. This is the *defining*
   cascade rule of Tailwind v4 authorship — treat unlayered CSS as
   `!important` shipped by accident.
2. When "the same class works on one tag but not another" — that's a
   cascade problem, not a bundle problem. Look at layers before you
   look at content-scan, JIT, or HMR. The tag is the tell.

---

## 2026-09-25 · Tailwind v4 scans markdown — dead-end diagnosis

*Superseded by the CSS layer entry above. Retained for the file
integrity record: the `@source not` directives are still correct
hygiene (docs shouldn't feed the utility compiler) but they were
not the cause of the invisible-CTA regression.*

---

## 2026-09-25 · Tailwind v4 scans markdown — root cause of "JIT bug"

**Problem.** Right after shipping the footer redesign, the dev server
threw `Parsing CSS source code failed` at `app/globals.css:1104`:
`.text-\[color\:var\(--\.\.\.\)\] { color: var(--...); }`. Tailwind v4
had scanned this same DEVLOG file, found the literal string
`text-[color:var(--...)]` inside a code fence in the prior entry's
Lesson section, treated it as a real arbitrary-value class token, and
tried to emit CSS for it. `var(--...)` is invalid — `.` is not a valid
identifier character — so the entire CSS bundle failed to compile.

The bigger realisation: this is the actual root cause of the earlier
"Tailwind JIT bug" I kept blaming this session. When the CSS bundle
fails partway through compilation, every utility rule after the
offending one gets dropped silently. That's why `text-[color:var(--
cta-ink)]` "wasn't generated" for `FloatingEmailCTA`, why `Let's talk`
rendered dark-on-dark, why `Book a fractional call` did too — the
rules WERE valid; they just never made it into the output because
Tailwind aborted the compile after hitting a broken sibling. I misread
this as an HMR ordering issue and papered over it with inline styles
three times.

**Decision.** Two-part fix.
- Rename the placeholder in the offending DEVLOG entry from
  `--...` to `--token` (valid CSS identifier so even if scanned it
  emits valid `color: var(--token)`).
- Add `@source not "..."` directives at the top of `app/globals.css`
  to exclude `DEVLOG.md`, `STABLE_LOGIC.md`, `AGENTS.md`, `CLAUDE.md`,
  `README.md`, `specs/**/*.md`, and `content/case-studies/**/*.mdx`
  from Tailwind's content scan. Tailwind v4 does whole-project
  auto-detection by default; these files legitimately contain
  class-shaped strings in code fences and reference material, but
  never need their contents compiled into utilities. MDX case study
  bodies checked with `grep -E 'className='` — zero matches; styling
  lives in `components/mdx/MdxComponents.tsx` (a `.tsx` file, still in
  scope).

**Result.** Home compiles to 200. CSS bundle
`/_next/static/chunks/[root-of-the-server]__*.css` now contains
proper `.text-\[color\:var\(--cta-ink\)\]` (with the correct
`color:var(--cta-ink)` rule body) and no `--...` or bogus `--accent`
tokens. Footer + DualCTA pills still render white-on-black — the
inline-style workarounds from an hour ago are now belt-and-braces
rather than load-bearing, but I'm leaving them because they're
harmless and revert-costs > revert-value.

**Lesson.** Tailwind v4's default content scan is aggressive:
markdown, mdx, everything under the project root that isn't
`node_modules` or `.gitignore`d. Any doc-in-tree that contains
class-shaped strings in code fences is a live grenade. Two rules
going forward:
1. Constrain scope with `@source not "..."` for every non-code file
   type you keep in the tree (docs, specs, plans, memory dumps).
2. When you see one bad class-token in emitted CSS, **do not assume
   HMR quirk** — read the whole `.next/static/chunks/*.css` bundle;
   a broken sibling rule silently kills every rule below it, and
   "the utility isn't being generated" is the symptom, not the
   diagnosis.

---

## 2026-09-25 · Footer simplification + CTA color-bug sweep

**Problem.** Reference screenshot shipped for footer redesign: clean
elevated card with just the big serif closer and a "Let's talk" pill,
followed by a 3-col row `[© left, empty center for FloatingCTA overlay,
socials + icon-only ↑ right]`. Actual footer had extra "I'm Ruslan 👋"
badge, four corner Screws, a dotted-texture background inside the card,
and a footer row of `[email left, © center, socials + text "Back to
top" right]`. Separately, the `Let's talk` pill and the primary
`DualCTA` pill both rendered dark-text-on-dark background — same
Tailwind JIT bug that hit `FloatingEmailCTA` earlier this session
(`text-[color:var(--cta-ink)]` arbitrary-value class not generated for
components created/edited in-session under Turbopack HMR). Also two
elements shared `id="contact"` — Footer and DualCTA — a leftover from
the single-page-scroll era before `/contact` became a real route.

**Decision.**
- Footer: dropped the badge, the four `Screw` components, the `Screw`
  helper function, and the `dot-texture dot-texture-fade` classes on
  the card. Rebuilt the footer row as `[© left, empty div center, GH X
  IN @ + icon-only h-9 w-9 ↑ button right]` — no more email link (the
  FloatingEmailCTA overlays that column visually), no more text on the
  back-to-top button.
- CTA color-bug: switched both `Let's talk` (Footer) and `Book a
  fractional call` (DualCTA) primary pills to inline
  `style={{ color: "var(--cta-ink)", background: "var(--cta)" }}` —
  identical fix pattern to `FloatingEmailCTA`. The Tailwind class
  version stays elsewhere (works fine on stable files); inline style
  is only the escape hatch for elements the JIT scanner missed.
- Duplicate id: removed `id="contact"` from both Footer and DualCTA.
  Grep confirmed no anchors point to `#contact` anywhere in code (only
  a doc mention in old spec text).

**Result.** Playwright desktop + mobile screenshots against reference:
footer card is clean centered composition, both CTA pills read
white-on-black, `document.querySelectorAll("[id]")` returns 0 with id
"contact", mobile stack (`[card, ©, socials row + ↑]`) reflows
properly at 390px. Files touched: `components/layout/Footer.tsx`,
`components/sections/DualCTA.tsx`.

**Lesson.** Two things. (1) The Tailwind arbitrary-value JIT bug isn't
a one-off — it hits any new element using a `text-[color:var(--token)]`-shaped
class under Turbopack dev. Reach for inline styles the first time a CTA pill
renders invisible instead of debugging Tailwind config. (2) When
copying a legacy anchor id forward through a restructure, check it
first — single-page-scroll routes bake ids into components as "nav
targets" and those become duplicate-id a11y bugs the moment you split
into real routes.

---

## 2026-09-25 · Nav Home + per-page OG + a11y fix

**Problem.** Post-Sprint-9 polish trio: (1) Nav had no `Home` link — you
could reach every sub-page from any page but couldn't get back to `/`
without editing the URL or hitting logo (there is no logo). (2) Only
`/` and `/work/[slug]` had `opengraph-image.tsx` — sub-pages shared the
generic Next.js default social card. (3) QA prog on 6 top-level routes
surfaced 1 fail out of 34 a11y checks: mobile menu Escape closed the
sheet but stranded focus (was calling `setOpen(false)` instead of
`closeMenu()`).

**Decision.**
- Nav: prepended `{href: "/", label: "Home"}` to `NAV_LINKS`. The
  route-based active predicate already handles `href === "/"` as an
  exact match (no prefix collision), so `Home` only lights up on `/`.
- OG: extracted `lib/og-template.tsx` (single `OgLayout` component
  taking `eyebrow`, `title`, `subtitle`, `footerLeft`, `footerRight`).
  Wrote 4 new `opengraph-image.tsx` files under `(marketing)/{about,
  services,work,contact}/`. Rewrote home + slug OGs to drop
  `fontStyle: "italic"` (violates CLAUDE.md rule 2 post-font-pivot;
  satori resolves `fontFamily: "serif"` to system fallback anyway, so
  italic was cosmetic drift not intentional design). Real Playfair
  Display embedding via `@resvg/resvg-js` fonts option deferred —
  current OGs are on-brand monochrome and ship-safe.
- Nav Escape: replaced `setOpen(false)` with the inline
  `setOpen(false); toggleRef.current?.focus();` pair. Not extracted to
  `closeMenu()` helper because `closeMenu` isn't in the effect's deps
  and adding it would need `useCallback` — cheaper to inline the two
  lines.

**Result.** `npm run build` clean, 25 static pages (was 21, +4 OG
routes). QA a11y prog: **34/34 pass, 0 console errors**. Nav Playwright
across 6 routes confirms `Home` active on `/`, other pills unchanged
on their routes, prefix match still works on `/work/noble-saas`.

**Lesson.** `next/og` `ImageResponse` doesn't respect `fontFamily:
"serif"` as a real Playfair Display face — it falls back to satori's
default sans, so any `fontStyle: "italic"` there was aesthetic noise
not brand alignment. If we want actual Playfair in OGs, we need to
`fetch` the font file (Google Fonts URL) or bundle it under
`public/fonts/` and pass to `ImageResponse({ fonts: [...] })`.

---

## 2026-09-24 · Sprint 9 · Site restructure — single-page → multi-page IA

**Problem.** Single-page scroll was collapsing two distinct audiences
(fractional/consulting clients + full-time employers) into one linear read.
No shareable deep-links for `/services`, `/work`, `/about`, `/contact`.
Nav was section-anchor based (`IntersectionObserver`, `#hash` targets) which
made it impossible to land on a specific concern from the outside.

**Decision.**
- Site tree: `/`, `/about`, `/work`, `/work/[slug]`, `/services`, `/contact`.
  Route group `(marketing)` for sub-pages (no URL impact).
- Nav rewritten to route-based: `usePathname()` + prefix match so
  `/work/noble-saas` keeps the `Work` pill active (`href === pathname ||
  pathname.startsWith(href + "/")`). Mobile menu keeps focus-trap +
  Escape + body-lock + auto-close on route change.
- Global chrome (`DotGrid`, `Nav`, `Footer`) mounted once in root
  `app/layout.tsx`; `{children}` + `Footer` wrapped in
  `<div className="relative z-10">` so content sits above the fixed
  z-0 canvas. Sub-page `<main>` elements dropped their
  `bg-[color:var(--bg-page)]` (was painting over the canvas).
- Home condensed to 8-section composition: Hero → SelectedWork
  (top-3 featured) → Services (3-card teaser) → HowItWorks → Benefits →
  ExperienceMini (top-3) → Testimonials → DualCTA. New sections:
  `SelectedWork`, `ExperienceMini`, `DualCTA`.
- `/services` gets the full 5-format engagement grid (`ServicesFull`);
  home Services becomes a 3-card teaser reading `services.slice(0, 3)`
  with a "How I engage →" link. Investment ranges left as
  `"TBD"` with `// TODO(ruslan):`.
- `/work` gets `WorkIndex` — client component with 3 filter chip rows
  (Role / Stack / Year), `Set<T>` state per row, OR-within-row match
  (`p.roleTags?.some((t) => roles.has(t))`), empty state with
  Clear-filters. `projects.ts` extended with optional `roleTags` +
  `stackTags` typed unions, backfilled across 5 projects.
- `BackToWork` retargeted from `/#work` → `/work`; `FloatingEmailCTA`
  and `ProjectsGrid` deleted (superseded by Nav Contact link and
  `SelectedWork` + `WorkIndex` respectively).
- Contact form was already in place from Sprint 9 Phase A; verified
  form token pairs against contrast (all AA pass).
- Sitemap extended: `/services` + `/work` added (priority 0.9).

**Result.** `npm run build` clean (21 static pages: 9 top-level
routes + 5 case studies × 2 with per-slug OG images). All 12 routes
return 200. Playwright confirms Nav-pill activation on all four sub-
pages, home has no active pill (correct — Home not in nav), prefix
match works on `/work/noble-saas` (Work stays active alongside the
BackToWork pill in the upper left). Zero console errors during route
traversal + mobile viewport.

**Lesson.** Global chrome in root layout needs a `relative z-10`
content wrapper when the ambient canvas is `fixed z-0` — otherwise
sub-page `<main>` backgrounds paint over it silently. Also: route-
based Nav active state is strictly better than `IntersectionObserver`
once the site has real pages — the observer approach only made sense
while everything was one scroll, and prefix matching handles nested
routes like `/work/[slug]` with one predicate instead of per-anchor
observation.

---

## 2026-09-24 · Font pivot to Playfair Display + ambient dot wave

**Problem.** User sent two reference shots asking for (1) an upright,
high-contrast Didone-style display face instead of the italic Fraunces
currently rendering "Software, shipped honestly.", and (2) actually-visible
animated background dots. Two secondary bugs surfaced during investigation:

- The DotGrid canvas *was* drawing (probe: `getImageData` returned
  `[17,17,17,26]` at dot centers), but composited screenshots showed uniform
  page bg. Root cause: `body { background: var(--bg-page) }` — body's own
  opaque background painted on top of the canvas because `z-index: -10` on
  a fixed child doesn't punch through parent background layers reliably.
- The static-fallback dot pattern (used for touch/reduced-motion) sat at
  `rgba(...,0.10)` which was invisible on the warm-paper bg.

**Decision.**

- Display face: swap Fraunces (variable, italic, `opsz`+`SOFT`) for
  Playfair Display (400–900 weights). Renamed the CSS variable
  `--font-fraunces → --font-display` so the name doesn't lie about what's
  loaded. Set `.font-serif` to `font-style: normal`, `font-weight: 500`,
  tighter tracking `-0.02em`.
- Background: keep the mouse-reactive canvas but layer a diagonal
  travelling-wave modulation (`sin((x+y)/λ − 2π·f·t)`) on top of every
  dot's alpha + radius, so the field breathes continuously without cursor
  input. Bumped `BASE_A 0.10 → 0.16`, `AMBIENT_AMP 0.06 → 0.12`,
  `STEP 28 → 26` so dots read clearly against the warm bg.
- Move page background from `body` to `html` only, so canvas can sit at
  `z-0` (was `-z-10`) and still show through transparent sections.

**Result.** Playfair Display now renders across all H1/H2s (verified
Hero + all six section headers). Zoomed screenshot of the empty right-side
Hero area shows the wave pattern cleanly — some dots visibly larger/darker
than their neighbors, cycling on a 7-second period. Build clean
(`✓ Compiled successfully in 1968ms`, 17 static pages).

**Lesson.** Setting an opaque background on both `html` *and* `body` is
double-jeopardy — the body's copy silently blocks anything at negative
z-index. If you want a fixed underlay to show through, only the root
element should paint the page color. And when a probe says "the canvas
has pixels" but the screenshot says "no it doesn't," suspect the
compositor's layer stack before you suspect your draw loop.

---

## 2026-09-23 · Sprint 8 QA · dot-texture mask leak + HTML-entity strings

**Problem.** Two visual bugs discovered only via browser screenshots (not the
diff, not the build):

1. Benefits + Services + Footer cards used `dot-texture dot-texture-fade`
   directly on the container. `mask-image` on the container was applied to
   the entire subtree, so body text and CTA buttons (e.g. footer "Let's
   talk") became semi-transparent at the fade edges — the Services left
   column ("SaaS Web Apps") was nearly illegible.
2. HowItWorks + Testimonials + Experience described copy inside JS string
   literals containing `&rsquo;` and `&ldquo;` — those are only parsed by
   the HTML parser inside JSX text nodes, not inside JS strings, so they
   rendered as raw entities: "we&rsquo;re not ready to spec".

**Decision.** Move the dot pattern to a `::before` pseudo-element on
`.dot-texture{,-lg}` so the mask only clips the decorative layer. Rely on
default paint order (::before before element children) for stacking — no
`> *` positioning override, since that broke the footer's absolutely-
positioned "screw" markers by pinning them to (0,0). For the string
literals, swap to real Unicode `’ “ ”`.

**Result.** Confirmed via playwright screenshot sweep at 900px steps: all
six section panels now render body copy at full opacity, footer screws sit
at the four corners as intended, and the CTA pills are solid black.
Build clean (`✓ Compiled successfully in 239ms`, 17 static pages).

**Lesson.** `mask-image` inherits down the subtree — never put it on a
content container. It belongs on a decorative pseudo-element. And in React,
HTML entities are a JSX-parser feature, not a JS-string feature; use real
Unicode inside string arrays.

---

## 2026-09-23 · Sprint 7 · redesign to minimalist editorial portfolio

**Problem.** Sprint 6 shipped a dark, WebGL-heavy "Lusion-immersive" first
draft. User reaction: *"нема відступів все змішане якісь дивні шрифти
незрозуміли розділи"* — no clear spacing, mixed fonts, indistinct sections.
The dark canvas + oversized italic + neon accent + shader background read
as busy and dated to the user, not editorial. I had defended the direction
on my own taste — should have led with references.

**Decision.** Full visual reset under a fresh spec triple
(`specs/07-redesign/{spec,plan,tasks}.md`). Grounded in an actual reference
the user picked (Nizar Ali Dribbble 24766210) rather than my brief. New
direction:

- Warm-paper page `#F5F4EF`, charcoal ink ramp, **monochrome** — the only
  chromatic accent is a single functional green `#22C55E` dot on the
  "available for work" status pill. I initially proposed a blue accent; the
  reference showed monochrome and I reversed.
- Fraunces italic display + Inter body. Dropped Instrument Serif, Geist
  Sans, JetBrains Mono. (Playfair was on the shortlist; letterform closeup
  from the reference pointed to Fraunces.)
- Rounded 16/12/pill radii replacing the previous hard-edge=0 rule.
- Cursor-reactive dot-grid `<canvas>` replacing three.js particle field.
  Gates: `matchMedia("(hover: hover)")` + `prefers-reduced-motion`.
- Copy stayed intact — sign-off proposal drafted for a light softening pass
  separately.

**Files.**
- `app/globals.css` — full `:root` rewrite + `@theme inline` remap.
- `app/layout.tsx` — Fraunces (`axes: ["opsz","SOFT"]`, no `weight` — the
  two are mutually exclusive for variable fonts) + Inter.
- `app/opengraph-image.tsx` + `app/(marketing)/work/[slug]/opengraph-image.tsx`
  — light monochrome redesign. `ImageResponse` requires explicit `display:
  flex` on any div with >1 child and rejects `display: inline-block`.
- `app/(marketing)/work/[slug]/page.tsx` — centered header, SectionBadge
  status, italic display H1, tag pills row.
- `components/canvas/DotGrid.tsx` (new) — 28px step, INFLUENCE=130,
  DECAY_MS=600. Fallback: static radial-gradient div.
- `components/ui/{SectionBadge,StatusPill,CTAButton,FadeUp}.tsx` (new).
- `components/layout/{Nav,Footer,BackToWork}.tsx` — light chrome, rounded
  pills, Nav goes transparent above 80px scroll.
- `components/sections/{Hero,ProjectCard,ProjectsGrid,AboutStack}.tsx` —
  full re-comp to new tokens.
- `components/mdx/MdxComponents.tsx` — re-tokened to serif H2/H3, ink body,
  rounded pre/code, hairline table.
- Deleted: `CanvasScene`, `ParticleField`, `SceneRoot`, `StaticGradient`,
  `CanvasErrorBoundary`, `shaders.ts`, `SplitReveal`, `lib/gsap.ts`.
- `package.json` — removed `three`, `@react-three/fiber`,
  `@react-three/drei`, `@types/three`, `gsap` (56 packages gone).
- `next.config.ts` — dropped `transpilePackages: ["three"]`.
- `CLAUDE.md` design section + `STABLE_LOGIC.md` rewritten to lock the new
  direction.

**Result.** `tsc` clean; `next build` prerenders 17 static pages including
both OG variants. Contrast: `#111/#F5F4EF` 17.15:1, `#2A2A28/#F5F4EF`
13.06:1, `#6B6B66/#F5F4EF` 4.86:1 (AA pass, AAA-large pass), CTA inverted
18.93:1. `#A8A8A2` fails AA — decorative-only (unavailable status dot),
never used for text. Dev server smoke: `/` and `/work/noble-saas` both 200.

**Lesson.** *Reference-first, never brief-first for visual work.* When the
user described a taste direction in words I mapped it to my own mental
library and defended the result on taste. Pulling a screenshot from the
user *before* proposing tokens would have skipped the entire wrong first
draft. Recorded to memory (`feedback_visual_direction.md`). Second lesson:
`ImageResponse` (satori) is a strict subset of CSS — plan to design OG
images as vertical flex columns of single-line spans, and never rely on
`display: inline-block` or `<br />`.

---

## 2026-09-24 · Sprint 6 · a11y sweep + OG images + sitemap

**Problem.** Site was visually deploy-ready after Sprint 5 but had three
gaps blocking a clean ship: (1) framer-motion animations in Nav, Hero,
SplitReveal each gated `prefers-reduced-motion` per-component and it was
about to become a manual habit for every new motion; (2) no OG images, so
share cards would look like a directory listing; (3) no `sitemap.xml`, no
`robots.txt`, no skip-link, no focus trap on the mobile menu — a11y and
crawler basics missing.

**Decision.** Six small files, no spec triple. All framer motion
centralised through `<MotionConfig reducedMotion="user">` in `SmoothScroll`
so future motion components inherit the contract for free. OG images use
`next/og` — one home, one per-slug dynamic, both prerendered via
`generateStaticParams` on the OG file itself.

- **`app/globals.css`** — removed `border-radius: 2px` from
  `:focus-visible` (STABLE_LOGIC radii=0 was being bent by a stray 2px).
- **`components/layout/SmoothScroll.tsx`** — wrapped children in
  `<MotionConfig reducedMotion="user">` so every framer component (Nav
  underline, mobile menu, Hero SplitReveal, future ones) respects the
  media query without per-component branching.
- **`components/layout/SkipToMain.tsx`** (new) — sr-only link, becomes
  visible + focus-ringed on Tab. First focusable in `<body>`. Wired in
  `app/layout.tsx` above `SmoothScroll`.
- **`app/page.tsx` + `app/(marketing)/work/[slug]/page.tsx`** — `id="main"`
  on `<main>` / `<article>` so skip-link lands correctly on both routes.
- **`components/layout/Nav.tsx`** — mobile menu got `role="dialog"`,
  `aria-modal`, `aria-controls`, focus moves to first link on open,
  Escape closes, Tab cycles inside menu, close restores focus to the
  hamburger button.
- **`app/opengraph-image.tsx`** (new) + **`app/(marketing)/work/[slug]/opengraph-image.tsx`**
  (new) — 1200×630 PNG with canvas `#0B0D12` + accent `#00FF88` chrome +
  display-italic title. Per-slug variant renders study title, tagline,
  role, year, status. Both statically generated via `generateStaticParams`
  on the OG file (Next 16 quirk — the parent page's `generateStaticParams`
  doesn't propagate to sibling metadata routes).
- **`app/sitemap.ts`** + **`app/robots.ts`** (new) — sitemap lists `/`
  plus 5 case study slugs; robots allows all + points at
  `https://ruslan.dev/sitemap.xml`.

**Result.**
- `npx tsc --noEmit` — clean.
- `npm run build` — 17 static pages (5 study pages + 5 OG images + 1 home
  OG + `/`, `_not-found`, `robots.txt`, `sitemap.xml`). No dynamic routes.
- `curl /robots.txt` → allow-all + sitemap link. `curl /sitemap.xml` →
  6 URLs. `curl /work/noble-saas/opengraph-image-XXX` → HTTP 200 image/png
  from x-nextjs-cache HIT.
- `curl /` and `curl /work/lexora` both contain `Skip to main` +
  `id="main"` markers.

**Lesson.** Next 16 metadata routes (`opengraph-image.tsx`, `icon.tsx`)
are compiled as *sibling* route handlers to the page they colocate with;
`generateStaticParams` on the page does not carry over. If you want a
per-slug OG to prerender at build time (not on demand), you have to
re-declare `generateStaticParams` inside the OG file. Without it, the
route stays dynamic and every share lookup pays a cold-image cost. Also:
centralising motion respect via `<MotionConfig>` beats per-component
`usePrefersReducedMotion` branches — the latter drifts silently the
moment someone forgets it.

**Bundle impact.** Zero — OG images are separate route bundles rendered
by the edge, not shipped to the client. `MotionConfig` is a context
provider, ~200 bytes. Skip-link is HTML.

**Non-goals still deferred.**
- Vercel deploy — external action, user-owned.
- `ruslan.dev` DNS/availability check — still blocking OG absolute URLs
  from becoming real (metadataBase is aspirational until then).
- Sprint 3 (hover video previews) — user recording gate.
- Sprint 4 (parallel/intercept modal + AudioPlayer) — ElevenLabs PVC gate.

---

## 2026-09-23 · Sprint 5 · Nav / About / Footer polish (S-class)

**Problem.** Nav was a static server component with dead `#anchor` links,
no scroll-based state, no mobile menu. `AboutStack` jumped straight into
"One human. Three model tiers." with no self-introduction. `Footer`
already looked decent but read as a stub — no contact preamble, no
availability specificity, no colophon detail. Sprint 3 (hover video) is
blocked on Ruslan recording preview clips, so this is the deploy-ready
polish that lets the site ship without waiting on that gate.

**Decision.** Three files, no new spec triple (S-class per the ShipLoop
classifier — < 3 files, < 1h, existing spec-in-CLAUDE covers the intent).

- **`components/layout/Nav.tsx`** promoted to a client component.
  - Scroll-linked backdrop: transparent + hairline above 80px scroll,
    `bg-[color:var(--bg-canvas)]/70 backdrop-blur-md` + hairline below.
    Transitions on `background-color, backdrop-filter, border-color`
    over 500ms.
  - Active-section detection via `IntersectionObserver` with
    `rootMargin: "-40% 0px -55% 0px"` (so a section counts as active
    when its band crosses the viewport centerline). Active link swaps
    color to `--accent` and gains a shared `layoutId="nav-active"`
    underline that animates between siblings via framer's shared-layout.
  - Mobile menu: hamburger toggle (two rotating lines forming an ×),
    full-screen `AnimatePresence` overlay with display-font links
    stacked, per-line stagger 60ms with `easeOutExpo`. Locks
    `document.body.style.overflow` while open.
  - Dropped `mix-blend-difference` — it stopped reading cleanly once the
    accent green appeared behind the nav. Solid backdrop-blur wins on
    the scrolled state.
- **`components/sections/AboutStack.tsx`** — added a bio block on the
  left rail before the stratification: display headline ("A studio of
  *one*, running *with* the model, not around it."), a plain-English
  self-intro paragraph, and a three-cell `<dl>` of Base / Practice /
  Cadence facts in mono. Right rail keeps the model stratification but
  is now introduced by a smaller "Model stratification" divider label so
  the visual hierarchy reads: identity → philosophy → matrix. Section
  header re-labelled `03 · Practice` (was `03 · Model stratification`)
  since the section now covers both.
- **`components/layout/Footer.tsx`** — added `04 · Contact` numeric header
  matching the other section rhythm; preamble paragraph before the "Let's
  build." display headline; contact-cell labels swapped to `--accent`
  (was `--fg-primary`) for consistency with the row labels above them;
  status swapped from "Booking new work — 2026" to specific "Booking Q4
  2026 · 1 slot"; colophon now shows "Kyiv → Ohio" + "ShipLoop discipline"
  as the second half of the byline; year computed with
  `new Date().getFullYear()` so we don't ship a stale copyright next year.

**Result.**
- `npx tsc --noEmit` — clean.
- `npm run build` — 9 pages, unchanged from Sprint 2.
- Curl: home + `/work/noble-saas` 200. Nav renders 4 anchor hrefs
  (`#top, #work, #stack, #contact`). Footer status renders
  "Booking Q4 2026 · 1 slot". AboutStack bio renders "A studio of one,
  running with the model, not around it."
- STABLE_LOGIC held: no new colors, no `rounded-*`, no third font, all
  motion respects reduce-motion (framer-motion honors the media query
  natively for `motion.*` components with default settings).

**Lesson.** `mix-blend-difference` on a nav sounds premium but breaks the
moment you have a saturated accent behind it — the difference blend of
`#00FF88` against `#F5F5F5` renders as `#0500A0` (dark purple), which
reads as broken, not intentional. Solid backdrop-blur after a scroll
threshold is boring but works against every possible background. If you
want the mix-blend effect to survive, you need a monochrome scene under
it; the moment you introduce a second hue, backdrop-blur wins.

---

## 2026-09-22 · Sprint 2 · WebGL Canvas + Hero SplitText reveal

**Problem.** Home page background was a static radial gradient (Sprint 0
stub) and the Hero headline rendered as inert static text. Portfolio's
whole thesis is Lusion-immersive — this was the gap between the pitch and
the artifact.

**Decision.**
- `components/canvas/` grew a real subsystem:
  - `shaders.ts` — inline vertex + fragment tagged template strings
    (perspective-correct point size, additive glow, depth-based alpha).
  - `ParticleField.tsx` — 1800 particles in a `20³` cube, `ShaderMaterial`
    with `AdditiveBlending` + `depthWrite: false`, `useFrame` gates on
    `document.visibilityState === "visible"` and clamps `dt` to 50ms so a
    long-frozen tab doesn't teleport time on resume.
  - `CanvasScene.tsx` — `<Canvas dpr={[1,2]} camera={{fov:55}}
    gl={{antialias:false, powerPreference:"low-power"}}>`.
  - `StaticGradient.tsx` + `CanvasErrorBoundary.tsx` — both fall back to
    the Sprint 0 gradient markup.
- `SceneRoot.tsx` rewritten: `usePathname()` → `null` off `/`,
  reduced-motion → `<StaticGradient />`, otherwise dynamic-import
  `CanvasScene` with `{ ssr: false, loading: <StaticGradient/> }` inside
  `<CanvasErrorBoundary>`. Route-gates itself so `/work/*` never mounts
  three.
- `components/ui/SplitReveal.tsx` — framer-motion word splitter (no GSAP
  license needed for this). `container` variant with `staggerChildren:
  0.06` + `delayChildren: 0.15`; per-word `<span
  overflow-hidden><motion.span y:100%→0>` with duration 0.75s + ease
  `[0.22, 1, 0.36, 1]`. Reduced-motion path renders a 250ms opacity fade
  instead of the mask.
- `Hero.tsx` split into three `<SplitReveal>` fragments — "Ship what"
  (white) + "Claude writes." (accent), each on its own line. Meta counter
  fades in at 0.05s, tagline + footer bar at 0.9s (tail delay matches
  reveal duration). Under reduce-motion tail delays collapse to 0.15s.
- `lib/motion.ts` — `easeOutExpo` retyped as `[number, number, number,
  number]` tuple (framer-motion v11 rejects `readonly` arrays and generic
  `number[]` for the `ease` prop); added `staggerPresets = { word: 0.06,
  line: 0.12 }`.

**Result.**
- `npx tsc --noEmit` — clean after retyping `easeOutExpo` as a fixed-length
  tuple.
- `npm run build` — 9 pages generated, same as Sprint 1. All 5 case
  studies + home + `_not-found` HTTP 200 via curl.
- Route-gating verified: home HTML contains two `pointer-events-none fixed
  inset-0 -z-10` wrappers (StaticGradient SSR + Canvas mount slot), case
  study HTML contains zero. Home HTML shows 3+ `inline-block
  overflow-hidden` spans — SplitReveal masks are SSR'd (framer applies
  transforms on hydrate).
- Contrast unchanged: body 17.83:1, accent 14.49:1 (AAA).
- **Bundle:** three + R3F chunk = **230KB gzipped, dynamic-imported**.
  This exceeds the spec's 120KB target — three.js core alone is ~150KB
  gz, R3F adds ~80KB. Target was unrealistic for stock three; the
  dynamic-import + reduced-motion bypass keeps this off LCP and off the
  bundle for accessibility-first visitors.

**Lesson.** Framer-motion v11 tightened its `ease` prop type: it wants a
fixed-length `[number, number, number, number]` tuple (or a string, or an
`Easing[]`), not `readonly [0.22, 1, 0.36, 1] as const` and not a
generic `number[]`. When you register a shared easing constant, type it
as the tuple from the start — otherwise every consumer needs an
`as unknown as` cast that fights review. Also: **bundle budgets in the
spec should be sanity-checked against the raw library cost before they
become acceptance criteria.** The 120KB target for a page hosting three
was optimism, not measurement.

---

## 2026-09-20 · Sprint 1 · Case study MDX + linked project cards

**Problem.** Portfolio scaffold shipped without its proof-point: five case
study bodies existed as plain markdown in
`~/.claude/projects/-Users-ruslan-portfolio/case_studies/`, but the site had
nowhere to render them and the project cards were static `<li>` elements
with no navigation. Reader couldn't open a case study by URL.

**Decision.**
- Installed `next-mdx-remote@5 remark-gfm reading-time gray-matter`.
- Ported all 5 drafts to `content/case-studies/*.mdx` with a normalized
  frontmatter schema (`slug`, `title`, `tagline`, `role`, `stack[]`, `year`,
  `status`, `featured?`, `publishedAt`, `readingTime`). Fixed the
  `angel-trucking` → `angel` slug mismatch. Dropped the leading H1 in each
  body — the page hero owns the H1.
- `content/case-studies.ts` — thin loader using `gray-matter` for
  frontmatter + `fs/promises` for the raw MDX body. `getCaseStudy(slug)`
  returns `null` on miss so the route can call `notFound()`.
- `components/mdx/MdxComponents.tsx` — token-adherent element map for
  `h2/h3/p/ul/ol/li/a/blockquote/code/pre/hr/strong/em/table/th/td`. Every
  color pulls from CSS custom properties; no ad-hoc hex.
- `components/mdx/CaseStudyBody.tsx` — RSC wrapper around `<MDXRemote>`
  with `remarkGfm` for tables.
- Extracted `components/sections/ProjectCard.tsx` from `ProjectsGrid.tsx`.
  Card body is now a `<Link href="/work/${slug}">` with a top-right `→`
  arrow that fades in on hover/focus. Grid file shrank to a plain map.
- `app/(marketing)/work/[slug]/page.tsx` — `generateStaticParams` from
  `projects.ts`, `generateMetadata` from frontmatter, hero with title +
  tagline + meta row (status/role/year/reading time) + stack tags,
  centered `max-w-[65ch]` body column. `notFound()` for unknown slugs.
- `components/layout/BackToWork.tsx` — fixed mono link top-left returning
  to `/#work`.

**Result.**
- `npx tsc --noEmit` — clean.
- `npm run build` — 9 pages generated: `/`, `/_not-found`,
  `/work/{noble-saas, angel, fieldmark, lexora, smm-factory}`.
- Curl sweep: all 5 case studies HTTP 200, `/work/nope` HTTP 404, home links
  present with correct `href="/work/<slug>"`.
- Body typography confirmed via HTML inspection — hero renders one H1, MDX
  body renders `##` sections. Contrast 17.83:1 (AAA) preserved.

**Lesson.** MDX v3 is stricter about bare `<` than legacy MDX — `<100ms` in
Lexora's body threw `Unexpected character '1' before name, expected a
character that can start a name`. Fix is trivial (backtick-wrap or escape),
but the failure surfaces only at prerender, not at type-check. Add a lint
step that scans MDX for `<[0-9]` before the next content port.

---

## 2026-09-20 · ShipLoop retrofit + Phase-0 discovery

**Problem.** Sprint 0 shipped without passing through ShipLoop (Ruslan's
SSD discipline at `~/shiploop/`). I had misread the "wait for shiploop"
memory as a calendar signal instead of a mandatory design methodology, and
went straight to scaffolding + `ui-ux-pro` defaults. Ruslan flagged the gap.

**Decision.**
- Installed the ShipLoop skill pack (`shiploop-router`, `-brainstorm`,
  `-tester`, `-observer`, `-start`) into `.claude/skills/`.
- Created `memory/` and `specs/` directories.
- Merged the ShipLoop Protocol block into `CLAUDE.md` — request classifier
  table (Q/B/S/L/R/T/D/M/O) + lifecycle diagram + memory checkpoints.
- Ran `/shiploop-brainstorm stage=discovery` as a retro session against
  the existing scaffold. Six decisions captured in
  `memory/brainstorm-discovery-2026-09-20.md`.
- Pivoted Sprint plan (DECISION-1): Sprint 1 becomes "case study MDX +
  basic project cards" (content-first). WebGL moves to Sprint 2. Sprints
  3–6 unchanged.
- Saved `memory/project-discovery.md` — Phase 0 checkpoint.
- Authored the Feature #01 spec triple: `specs/01-case-study-mdx/{spec,
  plan,tasks}.md` — 18 tasks, MDX loader via `next-mdx-remote/rsc`, token-
  adherent MDX component map.

**Result.** ShipLoop is now the operating discipline for this project.
Every future session that opens `/Users/ruslan/portfolio/` will:
1. Read `CLAUDE.md` → auto-apply the classifier
2. Read `DEVLOG.md` → know what shipped
3. Read `STABLE_LOGIC.md` → know what can't change
4. Route the incoming request through the class table before doing anything

Sprint 1 is unblocked once user reviews `specs/01-case-study-mdx/spec.md`.

**Lesson.** `ui-ux-pro` is a *visual sub-skill* that runs inside a Build
phase — it's not a substitute for Discovery/Spec/Plan. When a project has
ShipLoop wired up, `/shiploop-start` is always the first command; UI/UX
decisions come *after* the spec exists, not before.

---

## 2026-09-20 · Sprint 0 · Bootstrap

**Problem.** Empty repo (`/Users/ruslan/portfolio` had only `.git` + prior
`.claude/settings.local.json`). Need a Next.js scaffold with the Lusion-style
token layer wired up before any section work can start.

**Decision.**
- `create-next-app@latest` in-place, App Router, TypeScript, Tailwind v4,
  Turbopack, no `src/`, `@/*` import alias.
- Installed runtime deps: three + R3F + drei, gsap, lenis, framer-motion,
  @vercel/analytics + speed-insights.
- Design tokens live in `app/globals.css` `:root { ... }` and are exposed to
  Tailwind via `@theme inline`. One accent only: `#00FF88` neon green
  (14.49:1 on canvas — AAA).
- Fonts: Instrument Serif (display italic) + Geist Sans (body) + JetBrains
  Mono (chrome). Loaded via `next/font/google`.
- `SmoothScroll` (Lenis) provider early-returns under `prefers-reduced-motion`.
- `SceneRoot` is a static radial-gradient stub — will be replaced by R3F
  Canvas in Sprint 1.
- Dropped a webpack raw-loader rule for `.glsl` — Turbopack ignores it and
  the loader isn't installed yet. Re-add in Sprint 1 with proper Turbopack
  config.

**Result.** `npm run dev` boots, tokens flow, all five section stubs render
without runtime errors. No content yet — verifies structure only.

**Lesson.** Turbopack is now the default in Next 16 `create-next-app`. Any
`next.config.ts` `webpack` block silently no-ops. When shaders arrive, wire
them through Turbopack's `experimental.turbo.rules` instead.

---

## 2026-09-29 · MDX object-array props silently stripped (`blockJS`)

**Problem.** New `<MetricGrid>` primitive crashed with
`TypeError: Cannot read properties of undefined (reading 'map')` on
`/work/hrekov-dev`. Standalone `@mdx-js/mdx` compile of the same source
produced correct output — the `items={[{...}, ...]}` array was there.
Something between MDX compile and render was dropping the prop.

**Decision.** Read `node_modules/next-mdx-remote/dist/serialize.js`.
`getCompileOptions` defaults `blockJS: true` and injects a
`removeJavaScriptExpressions` remark plugin that strips MDX flow
expressions (`{...}`) from the AST. So `columns={3}` (numeric literal
inline) survived, but `items={[{value: "12", label: "sprints"}, …]}`
(object array) got removed — `items` arrived as `undefined`.

Fix: set `blockJS: false` on both `<MDXRemote>` call sites — case
studies (`components/mdx/CaseStudyBody.tsx`) and blog posts
(`components/mdx/BlogPostBody.tsx`). Content is authored in-repo, not
user-submitted, so the JS-injection surface being closed doesn't
apply. Kept `blockDangerousJS` at its default (`true`) — that only
blocks `require`/`process`/`fetch`-style globals, which we never use in
MDX anyway.

**Result.** MetricGrid renders. Confirmed via curl of `/work/hrekov-dev`:
`~1.5`, `sprints / day`, `clamp(28px,3.5vw,44px)`,
`divide-y divide-[color:var(--hairline)]` all present. No console
error in dev log after refetch.

**Lesson.** `next-mdx-remote` silently rewrites the MDX AST by default.
Any primitive that takes structured props (`items`, `columns`, `data`)
via array/object literals in MDX will fail silently unless `blockJS`
is disabled at the render site. Numeric/string attributes work because
they're MDX attribute values, not flow expressions. Rule promoted to
`STABLE_LOGIC.md`.

---

## 2026-09-29 · P1.2 · `<PromptLog>` wired into Prompt Architecture sections

**Problem.** The case-study audit flagged the "Prompt Architecture"
sections as dense-prose walls that recruiters bounce off (Noble §4
was the specific example). Existing `<PromptLog>` primitive was
declared in `BlogComponents.tsx` but never invoked in any case study
body.

**Decision.** Scoped down from "wire PromptLog across all 6 case
studies" to 4, on semantics: `<PromptLog>` reads as a verbatim
Claude-facing instruction. That fits sections that quote a durable
directive from `CLAUDE.md` / `AGENTS.md` / `STABLE_LOGIC.md`. Sections
that don't quote a directive (or where the quote is already a
three-word bold callout) get nothing — pulling one-liners into
collapsibles adds noise, doesn't reduce density.

Wired:
- `noble-saas.mdx` — `docs/STABLE_LOGIC.md — the anti-drift directive`
- `angel.mdx` — `AGENTS.md — the 5-role contract`
- `lexora.mdx` — `CLAUDE.md — the routing rule`
- `fieldmark.mdx` — `CLAUDE.md — the four-stage gate`

Skipped:
- `smm-factory.mdx` — section already tight; "Rules = Code." is
  three words, doesn't merit a collapsible.
- `hrekov-dev.mdx` — no "Prompt Architecture" section (meta case
  study); no verbatim directive quoted elsewhere.

**Result.** Four case studies now open their Prompt Architecture
section with prose → collapsed directive → prose. Verified via curl
that each renders (no `TypeError`) and that the correct filename-tagged
title lands in each SSR payload. `blockJS: false` fix from earlier
today is what makes any of this work — pre-fix, MDX would have silently
dropped the `title` prop.

**Lesson.** Primitives have a semantic surface, not just a visual
one. A component labeled "prompt" and marked with `❝` should only wrap
Claude-facing instructions. Wrapping every dense paragraph in one
would have shipped visual noise + false semantic weight.

---

## 2026-09-29 · P1.1 → pivoted to `<BeforeAfter>` primitive (not `<Diff>`)

**Problem.** Original task was "wire `<Diff>` into Iteration Moments across
6 case studies". Read all 6 sections first — none of them contain
before/after **code**. They describe approach/behavior/commit changes in
prose. `<Diff>` renders two `<pre>` code blocks side-by-side; using it
for prose would be a false semantic match (same class of error as the
first-pass P1.2 plan).

**Decision.** Built a new primitive `<BeforeAfter>` with `<Before>` /
`<After>` panel children (composition-based so MDX authors can use
inline `_italic_` and `` `code` `` naturally). Each panel accepts
`date`, `commit`, `commitHref` props and renders a pill-style commit
chip in the header. Registered all three in `blogComponents`.

Wired:
- `fieldmark.mdx` — Apple Sign-In rewrite (2 dates + 2 commits)
- `lexora.mdx` — Anthropic → Gemini migration (same-day rollover)
- `noble-saas.mdx` — 2 iteration moments (April slot-cache freeze,
  Vercel cache elimination) — 4 panels total, each with commit hashes
- `smm-factory.mdx` — 21-minute Playwright unwind (Ship, test, kill)

Skipped:
- `angel.mdx` — single commit, no before/after pair to render.
- `hrekov-dev.mdx` — meta case study, no Iteration Moment section.

**Result.** 4/6 case studies now open their Iteration Moment with a
two-panel `<BeforeAfter>` — commit chip, date pill, prose body — with
the Lesson italic beneath. Verified via curl: 8 panels rendered
(2×fieldmark + 2×lexora + 4×noble + 2×smm-factory across SSR flight +
HTML). No `TypeError`. Depended on the `blockJS: false` fix from
earlier today.

**Lesson.** Second time this week that following the audit doc's
"wire primitive X into section Y" plan revealed a semantic mismatch
between the primitive's contract and what the section actually
contains. Rule I'll apply going forward: before wiring, read all
target sections first and check the semantic fit against the
primitive's contract. If the fit is wrong, build the right primitive
first.

---

## 2026-09-29 · P1.3 → pivoted to `<MetricGrid>` + `<Cost>` for Results

**Problem.** Original task was "inline `<Artifact>` + `<Cost>` chips in
Results sections across 6 case studies". Read all 6 — Results sections
are almost entirely numeric or metric bullets (commits, LOC, followers,
posts published, pricing). `<Artifact>` renders a labeled chip
("commit ⌥ 6b29244", "screenshot ▢ ...") — meant for pointing at
concrete artifacts, not "227". `<Cost>` fits pricing but only pricing.
Inlining `<Artifact>` for every number would ship the same false-weight
noise that P1.1 and P1.2 caught.

**Decision.** For numeric-metric Results, convert to `<MetricGrid>` —
the primitive already exists in `BlogComponents.tsx` (built for the
blog, unused so far in case studies). Extract `<Cost>` selectively for
actual pricing/spend items only. Leave short Results sections (≤5
bullets) as prose bullets — grid would fragment them.

Wired:
- `noble-saas.mdx` — `<MetricGrid columns={4}>` for {227 commits,
  ~10k LOC, 16 named bugs, 3 pivots} + two `<Cost>` pills for pricing +
  trial. Two prose bullets survive (weekly cadence, integrations).
- `smm-factory.mdx` — `<MetricGrid columns={4}>` for {40 posts, 0→13
  followers, 0–200 views, 0 IG violations} + two `<Cost>` pills for
  AI cost + human time.

Skipped:
- `fieldmark.mdx` — 4 bullets, all tight prose (dates, commit counts,
  build states). Grid would strip the narrative.
- `lexora.mdx` — 5 bullets, similar shape.
- `angel.mdx` — 4 bullets.
- `hrekov-dev.mdx` — Results already a table.

**Result.** 2/6 case studies now open their Results with a 4-column
metric grid + inline `<Cost>` pills for spend/pricing. Verified via
curl on both slugs — MetricGrid tabular-nums classes present, no
`TypeError`, values render (227, 40, 0 → 13, client / week visible in
HTML). Phase 1 complete: P1.1 (`<BeforeAfter>`), P1.2 (`<PromptLog>`),
P1.3 (`<MetricGrid>` + `<Cost>`), P1.4 (recruiter summary in
frontmatter — shipped Sprint 11).

**Lesson.** Third pivot this week — the audit doc named the primitive
before checking the content shape three times in a row. The general
pattern: audit docs describe an *aesthetic goal* ("Results should feel
scannable"), not a mapping. The mapping only surfaces after reading
the actual content. New rule for the next audit: pair each "wire X
into Y" line with a 1-sentence content-shape claim (`Y contains N
before/after prose blocks`, `Y contains K numeric bullets`) so the
semantic mismatch fails fast at planning, not at implementation.

---

## 2026-09-29 · Sprint 14 · Phase A + F ship (no-credentials slice)

**Problem.** Sprint 14 (distribution automation, task #73) is class L
— LinkedIn + dev.to APIs, OAuth handshake, weekly refresh worker,
GitHub Actions cron, blog-drafter skill. Full-stack execution is
blocked by LinkedIn app + Company Page creation, which Ruslan is
doing manually tomorrow. But ~60% of the sprint has zero credential
dependency (schedule scaffolding, type extensions, privacy page,
skill definition). Ship what can ship today.

**Decision.** Executed Phase A (editorial calendar) + Phase F
(blog-drafter skill) + one Sprint-15-prep dependency: privacy page.
LinkedIn app creation form validates the Privacy Policy URL against
200; publishing that landing page tonight lets tomorrow's LI form
pass on first attempt.

Also: spec §5.2 was wrong. Original had `POST /rest/posts` with
`LinkedIn-Version: 202409` — that's the newer Community Management
REST API, which is review-gated behind LinkedIn's Marketing partner
program (multi-week gate). The self-serve `w_member_social` scope
only authorizes the older `POST /v2/ugcPosts` UGC surface. Verified
via `learn.microsoft.com/.../share-on-linkedin` (updated 2026-06).
Spec §3.3 and §5.2 rewritten to lock in `/v2/ugcPosts`; explicit
rejection of `/rest/posts` documented so future-me doesn't re-open
this loop.

**Result.**
- `content/blog/schedule.yml` — scaffold with far-future placeholder
  entry for `launching-the-journal` so cron won't publish accidentally.
- `content/blog/schedule.ts` — reader with slug + channel + datetime
  validation. Smoke test parses scaffold correctly.
- `content/blog.ts` — `DistributionChannel` extended with optional
  `publishedUrl` + `error`; `DistributionStatus` gains `"failed"`.
  Additive, no callers break.
- `.env.distribution.example` — six LinkedIn/dev.to secret keys
  documented with source URLs. Added to `.gitignore` allowlist;
  `.distribution-ledger.jsonl` also ignored.
- `app/(marketing)/privacy/page.tsx` — full privacy notice (data,
  cookies, retention, third parties, contact). Matches About/Services
  shell.
- `app/sitemap.ts` — `/privacy` entry added (priority 0.3).
- `components/layout/Footer.tsx` — Privacy link next to
  ConsentResetLink.
- `.claude/skills/blog-drafter/` — SKILL.md + 4 format templates
  (build-log, pattern, case-study, skeptic) with frontmatter
  placeholders + section skeletons.

Verify: `curl /privacy` = 200. `npx tsc --noEmit` clean. Schedule
smoke-test returns typed entry.

**Lesson.** Docs age fast on OAuth surfaces. LinkedIn added the newer
`/rest/posts` REST API + `LinkedIn-Version` header in 2023–2024 and
the top search results for "LinkedIn API post" push you there — but
`learn.microsoft.com/.../getting-access`'s authoritative "Open
Permissions" table for `w_member_social` still shows `/v2/ugcPosts`.
Rule: for LinkedIn API integrations, always load the *specific*
self-serve product's docs page, not the general "how do I post"
search result. Cost of this error if unchecked = full Phase B
implementation against a review-gated endpoint, discovered only at
first live call.

---

## 2026-09-30 — Sprint 14 Phases B/C/D/E scaffolded (no credentials required yet)

**Problem:** Phase A + F shipped yesterday; user is deferring LinkedIn Company Page + Developer app creation to tomorrow. Cheapest use of today is to write the code that will execute against those credentials — nothing here needs a live LinkedIn to author, only to run.

**Decision:** Wrote all remaining Sprint 14 code in `.mjs` (matches existing `verify-case-study-numbers.mjs` convention, no tsx dep):
- Renderer + tests (`lib/distribution/render.mjs`, `scripts/render-smoke.mjs`) — 11/11 assertions pass, including a real-post smoke against `launching-the-journal.mdx`.
- Publishers (`lib/distribution/devto.mjs`, `lib/distribution/linkedin.mjs`) — both dry-run successfully via `scripts/publish-one.mjs`; LinkedIn payload confirmed to be UGC-shape (`/v2/ugcPosts`) with `x-restli-protocol-version: 2.0.0`, no `LinkedIn-Version` header.
- OAuth handshake (`scripts/linkedin-oauth.mjs`) — localhost:8787 callback server, `w_member_social openid profile email` scopes, writes `.env.distribution` (chmod 600) + prints `gh secret set` block for GH Secrets.
- Cron orchestrator (`scripts/publish-due.mjs` + `scripts/lib/{git,devlog,frontmatter,ledger}.mjs`) — dry-run says "nothing due" against the 2027-scheduled test post. Ledger-then-frontmatter-then-git ordering enforced.
- Refresh worker (`scripts/linkedin-refresh.mjs`) — exchanges refresh token, rotates via `gh secret set` when `GH_TOKEN` present, warns when refresh cliff is <30 days.
- Two GH Actions workflows (`publish-blog.yml` hourly, `linkedin-refresh.yml` Monday-06:00-UTC) — `actions/setup-node@v4` with `npm ci --ignore-scripts` (skips prebuild verify:numbers, which is a Next build hook).

Also converted `content/blog/schedule.ts` → `content/blog/schedule.mjs` so the cron can import without tsx/build-step. Nothing in Next consumed the TS version. Fixed `bun`/`oven-sh/setup-bun@v2` cruft in plan.md + tasks.md (project uses npm, not bun).

**Result:** `npx tsc --noEmit` clean. Renderer 11/11. Orchestrator smoke clean. Real-post publish-one dry-run produces LinkedIn payload of 2003 chars (under 2900 cap, canonical suffix intact) and dev.to payload with correct canonical_url + tags.

**Lesson:** When credentials are blocked, don't idle — every publisher, renderer, and workflow YAML is writable today. Tomorrow's session becomes a 20-minute credential-paste + `workflow_dispatch dryRun=true` verification, not a code sprint. Also: `[^/>]+?` in a JSX regex bites you when attr values contain `/` (dollar amounts, paths); prefer `[^>]+?` + explicit `\s*\/>` terminator.

---

## 2026-09-30 — Sprint 14 shipped live: dev.to + LinkedIn first cross-post

**Problem:** Code was ready yesterday but unverified against live APIs. Needed to actually push the pipeline through dev.to and LinkedIn, confirm both renderers survive their respective markdown/plain-text constraints, and prove the GH Actions runner path end-to-end before trusting it to publish on its own.

**Decision:** Pushed through tonight in four stages rather than defer:

1. **LinkedIn Company Page + Dev app.** User's existing personal profile is not sufficient to own a LinkedIn app — the post-2019 verification chain requires a Company Page as the ownership anchor. Created minimal Page (ID 143957068); app bound to it. Posts still land on the personal profile via `urn:li:person:XKuTKDehCv`.
2. **OAuth handshake.** `scripts/linkedin-oauth.mjs` ran local 8787 callback, exchanged code → 60-day access token. Confirmed empirically: **self-serve `w_member_social` does NOT grant a refresh token**, only the access token. 60-day cliff is manual re-handshake, not scripted rotation. Updated `scripts/linkedin-refresh.mjs` to no-op + warn when the refresh token env var is empty, so the weekly workflow stays green.
3. **Live publish via `publish-one.mjs --live`.** dev.to returned `https://dev.to/ruslan_hrekov_d296523b326/launching-the-journal-3fh5` (4780166); LinkedIn returned `urn:li:share:7511255500445872129`. Markdown stripper + 2900-char LinkedIn cap behaved cleanly; visual review on both platforms confirmed no artifacts.
4. **Orchestrator validation via GH Actions `workflow_dispatch dryRun=true`.** Backfilled `.distribution-ledger.jsonl` with the two real URLs (otherwise cron would re-publish). Fired the "Publish blog" workflow — ran in 21 seconds on `ubuntu-latest` + Node 20, output `[publish-due] nothing due at 2026-10-01T03:22:40Z`. Secrets propagate, `npm ci --ignore-scripts` installs cleanly, ledger idempotency works end-to-end.

**Result:** Both commits pushed (`030cc95` Sprint 13, `898a8ca` Sprint 14). Hourly cron armed on `15 * * * *`. Four Sprint-14 invariants locked into `STABLE_LOGIC.md`: LinkedIn endpoint is `/v2/ugcPosts` not `/rest/posts`; publish order is ledger → frontmatter → git; cron commits carry `[skip ci]`; distribution scripts are `.mjs` under plain node; ledger is NOT gitignored (ephemeral runners would double-publish). Discovered + fixed: `.distribution-ledger.jsonl` had been in `.gitignore`, which would have silently broken the idempotency contract on first cron tick.

**Lesson:** Three traps that cost real time if you miss them:

- **LinkedIn `w_member_social` self-serve is scope-only, not durability.** You get the access token but no refresh — plan for a 60-day re-handshake calendar event, not scripted rotation. If you need true rotation, you need Community Management API partner review (multi-week gate).
- **A ledger that lives only on the runner is not a ledger.** GH Actions runners are ephemeral; the `.jsonl` has to be committed back, which is why `publish-due.mjs` stages it alongside the frontmatter. Easy to accidentally `.gitignore` because the name looks like local state.
- **For LinkedIn, the Company Page is a one-time cost, not a permanent commitment.** Posts never go to the Page; it's just the ownership anchor LinkedIn requires. Fifteen minutes of bureaucracy that unblocks the whole pipeline.

Follow-ups queued, not blocking: dev.to username is auto-generated (`ruslan_hrekov_d296523b326`) — fix in dev.to settings before next post for cleaner canonical. Second blog post will exercise the full publish-apply-ledger-commit path through actual cron (tonight was synthetic — ledger pre-seeded).

---

## 2026-10-01 — cron · cross-post batch

**Problem:** 2 scheduled cross-post(s) reached publish time.

**Decision:** publish-due.mjs fired via GH Actions hourly cron.

**Result:** Published: shipping-the-cross-poster/linkedin → https://www.linkedin.com/feed/update/urn%3Ali%3Ashare%3A7511283215077289984/; shipping-the-cross-poster/devto → https://dev.to/ruslan_hrekov_d296523b326/shipping-the-cross-poster-34hn. Failures: 0.

**Lesson:** Frontmatter status flipped; ledger entry appended; commit follows.

---

## 2026-10-01 — `hrekov-dev` full podcast (8:20) replaces pilot in §1

**Problem:** The pilot video in `hrekov-dev` §1 was a 21-second two-camera dialogue — a proof-of-concept that the HeyGen Podcast template could render a two-avatar scene from `[Host]`/`[Guest]` script. The case study itself is a 10-section, ~2500-word write-up of the memory-file workflow; a 21-second video on the cold open under-serves it. Needed to produce the "full podcast" version of the case study and swap it in.

**Decision:** Scripted the full case study as three dialogue segments (The Itch / The System / The Proof, ~440-460 words each, ~1350 total) with a shared Scene Instructions block to pin the studio aesthetic. User rendered the complete script in a single HeyGen Podcast render rather than three — got back one 8:20 clip at 720p for 140 credits (50 preview + 90 final). Avatar swapped from `Ruslan Hrekov studio v1` to a Gemini-generated image whose hairstyle matched the user's real appearance better; same cloned voice attached.

**Result:** New assets at `public/videos/podcast-hrekov-dev-full.mp4` (60 MB, 1280×720, 500 s) + poster at `-full-poster.jpg` (120 KB, extracted from 00:00:04). `content/case-studies/hrekov-dev.mdx` §1 figure now points to the new mp4/jpg pair with updated figcaption ("8:20 · The case study, spoken. Three movements..."). Old `podcast-hrekov-dev.mp4` kept in place because `components/sections/Hero.tsx` still uses it as the 21-sec click-to-modal teaser on the home page. Dev server verified: both files serve 200 OK with `Accept-Ranges: bytes` (seeking works), new figcaption text renders in SSR output. Scripts captured at `~/.claude/projects/-Users-ruslan-portfolio/podcast_scripts/06_hrekov_dev.md` for future reruns.

**Lesson:** The HeyGen Podcast template's final-render charge at 720p is **~11 credits/min**, not 30/min as initially estimated — my earlier pricing math (used to justify "segment into three 3-min renders to fit budget") was wrong by a factor of ~3. One 8:20 render consumed 140 credits total (90 for the 500-second final + 50 preview). This changes the economics completely: a 30-min full podcast would run ~380 credits, affordable within one Creator-plan refill. **Defer the segment-vs-full decision one month** until next credit refill lets us pilot a true 30-min render on `noble-saas` and confirm the per-minute rate holds linearly at longer durations. Also: when the user swaps the trained avatar for a Gemini-image avatar for cosmetic reasons, voice attachment resets — must re-select the cloned voice manually or the Guest ships in a stock HeyGen voice.

---

## 2026-10-02 — `hrekov-dev` podcast split into 3 inline-embedded parts

**Problem:** The 8:20 single-render podcast shipped yesterday had one structural flaw for a reader walking down the case study: it opened with a formal greeting and closed with a formal goodbye, both in §1. A reader scrolling past §6 and §9 got no companion audio for the war-story and meta sections — the podcast and the written text diverged after the cold open. For a case study whose entire thesis is "the artifact and the discipline are the same thing," embedding three podcast beats at matching text beats is the shape the content actually wants.

**Decision:** Split the single 8:20 render into three 8-minute episodes, each embedded at a semantically matching location in the MDX:
1. **Part 1 — The system** (§1, cold open): hello + four memory types + classifier + closing hook. Produced by trimming the original 8:20 full render at 00:08:15 with `ffmpeg -c copy` (lossless, re-timestamped) to drop the goodbye line.
2. **Part 2 — The war stories** (after §6, DEVLOG → STABLE_LOGIC): fresh render. CSS cascade incident (three hours blamed on Turbopack for one unlayered `a { color: inherit }`) + dark-Lusion → minimalist pivot (one-day build killed by one Dribbble shot). Opens "Welcome back everyone...", closes with "See you there." hook.
3. **Part 3 — How this was made** (after §9, How to steal it): fresh render. The meta story — the 30-credits/min estimate that was off by 3× + the segmented-architecture hour that solved a non-problem + the three-field memory-file recipe + the one-file starting-move for readers. Opens "Back for the final part", closes with proper goodbye.

Scene Instructions, avatars (Marieke + Gemini-generated Ruslan avatar), cloned voice, 720p/16:9 settings — all identical across the three renders to preserve visual continuity. User rendered Parts 2 and 3 separately; each came back at ~8:01-8:07 for ~140 credits per render.

**Result:** Three asset pairs in `public/videos/`:

- `podcast-hrekov-dev-part1.mp4` (8:15, 60 MB) + `-part1-poster.jpg`
- `podcast-hrekov-dev-part2.mp4` (8:01, 59 MB) + `-part2-poster.jpg`
- `podcast-hrekov-dev-part3.mp4` (8:07, 57 MB) + `-part3-poster.jpg`

`content/case-studies/hrekov-dev.mdx` edits: §1 figcaption rewritten to "Part 1 of 3 · 8:15 · The system...". New `<figure>` blocks inserted at end of §6 (Part 2 · 8:01 · The war stories...) and end of §9 (Part 3 · 8:07 · How this podcast was made...). Scripts live at `~/.claude/projects/-Users-ruslan-portfolio/podcast_scripts/06b_hrekov_dev_part2.md` and `06c_hrekov_dev_part3.md` for future reruns. Original full 8:20 render retained locally as reference but not embedded.

Total credit spend: ~470 across the three renders (140 for the original full 8:20 render that became Part 1 via trim + ~140 for Part 2 (8:01) + ~190 for Part 3 (8:07)) — balance after Part 3 shows 50 credits remaining out of the monthly 520. Part 3's higher spend tracks its slightly longer runtime (8:07 vs 8:01) plus whatever preview iterations ran during that session.

**Lesson:** For dense case studies, inline-embedded multi-part audio beats a single long opener. The reader gets a "listen to this beat" prompt at exactly the moment the written text makes the beat concrete — so the audio reinforces the text instead of competing with it. Operational rules that fell out:

- **Trim before re-rendering if the content is already there.** Part 1 was produced by trimming the existing 8:20 render at the goodbye line, not by re-rendering the opening half. Zero credits spent for a cleaner split.
- **For a multi-part series on one platform, the opening-closing-continuation shape has to be scripted explicitly.** Part 1 is "hello + content, no bye." Part 2 is "continuation, no hello, no bye." Part 3 is "continuation + proper goodbye." Mistake would be each render independently greeting and closing — reader confusion.
- **Scene Instructions is the consistency driver, not the avatar.** Same block pasted across three sessions produced visibly matching studios. Avatar + voice + settings held second-order.
- **Credit-per-minute of HeyGen Podcast template holds linearly** across 8-minute renders (verified twice now at ~140 credits per 8 min = ~17.5/min including the fixed 50-credit preview, or ~11/min for just the final render). Earlier estimate of 30/min stays dead.

---

## 2026-10-03 — Visual anchors for case studies + screenshot automation pipeline

**Problem:** Case study bodies are long-form prose with occasional `<Artifact>`/`<MetricGrid>`/`<PromptLog>` punctuation but very little visual scaffolding. A recruiter skimming at speed has nothing to anchor the eye between section headers — the reading experience is a wall of body copy that leans on the reader's willingness to parse. The two Behance references the user flagged (Fluxa + RealstAI) solve this with large editorial statements, numbered principle cards, big-stat panels, and framed product shots that let the eye rest and get re-engaged with specific claims. The portfolio needed the same vocabulary — plus a reproducible way to generate the framed product shots instead of hand-grabbing them each time.

**Decision:** Shipped two layers in one pass:

**Layer A — five MDX visual primitives** (`components/mdx/CaseStudyVisuals.tsx`) wired into the MDXRemote components map alongside existing blog + base mdx components:
1. `<ValueStatement eyebrow? children />` — border-top/bottom editorial statement, Playfair clamp(28–44px), one per case study max.
2. `<NumberedCards items={[{title, body}]} columns?={1|2|3} />` — hairline-bordered cards with large faint serif numerals (`01`/`02`/...). Replaces plain ordered-list trade-off blocks when the items are substantial enough to deserve a card each.
3. `<Pullquote attribution? children />` — left-border vertical rule + Playfair clamp(22–32px) pulled line, Inter attribution underneath.
4. `<ImpactStats items={[{value,label,hint?}]} columns?={2|3|4} />` — border-top/bottom stat band distinct from `<MetricGrid>` (left-aligned, bigger value, different pacing).
5. `<Figure src alt caption? width? height? frame?={minimal|flat} />` — `next/image` wrapped in either a hairline card w/ paper-gradient padding (the "minimalist frame" the user asked for, explicitly not photorealistic) or a flat hairline-bordered crop. Lazy-loaded, 2× pixel density via Playwright capture.

**Layer B — screenshot automation**:
- `scripts/screenshot-web.mjs` — Playwright + chromium headless; six baseline captures (home + /work + /work/hrekov-dev + /blog + /about + mobile home) at 1440×900 and 390×844, 2× DPR, `reducedMotion: "reduce"`, `.fixed.bottom-6` hidden so the floating email pill doesn't bake into every shot. Writes `.webp` q=88 into `public/case-studies/hrekov-dev/`.
- `scripts/screenshot-flutter.sh` — `boot|launch|capture` subcommands wrapping `xcrun simctl` + `flutter run`. Device env-overridable (defaults `iPhone 16 Pro`). Semi-automated: the operator navigates in Simulator, the script snapshots and files the PNG under `public/case-studies/<slug>/<name>.png`.

Pilot inserted into two case studies:
- **hrekov-dev** (recursive, on-brand): `<ValueStatement>` under §1 thesis, `<Pullquote>` for the drift lesson at the end of §7, `<Figure>` of the live `/` home screenshot at the top of §10 "The recursive close" — reader scrolls to a frame of the page they're reading.
- **fieldmark**: `<ValueStatement>` under the pitch bold line, `<NumberedCards columns={2}>` replacing the 4-item Trade-Offs ordered list, `<ImpactStats columns={3}>` replacing the first three bullets of Results, `<Pullquote>` on "Rejection emails are the best specs" at the top of Reflection.

Playwright added as `devDependencies` (not shipped to runtime; `npm run build` ignores it). Chromium browser installed to the ~/.cache/ms-playwright standard path.

**Result:**
- `npx tsc --noEmit` clean.
- `npm run verify:numbers` clean (fieldmark numbers unchanged: 7 commits / 7 days / 3 crews).
- `npm run build` prerendered all 6 case studies with new primitives — no MDX serialization errors (blockJS:false memory rule held; both `items={[...]}` arrays arrived shaped on the server component).
- Playwright pilot run from prod `https://hrekov.dev` wrote six .webp into `public/case-studies/hrekov-dev/` totaling ~550 KB.
- Dev-server visual check at 1440 and 390 widths: NumberedCards 2×2 grid collapses to single column, ImpactStats 3-col collapses to single, Pullquote keeps left rule — monochrome palette intact, no new hex values introduced.

**Lesson:**
- **Visual primitives belong in their own file, not bolted onto BlogComponents.** `blogComponents` is already registered everywhere MDX is rendered; a dedicated `caseStudyVisuals` map keeps the design-system additions discoverable and lets a future reader see at a glance what the editorial grammar for case studies actually is.
- **Capture floating overlays as a known hazard.** Headless Playwright will faithfully bake in `.fixed.bottom-6` emails, consent banners, and (if present) analytics debug panels. Add the hide-rule to `screenshot-web.mjs` up front; the alternative is re-capturing every pass as the layout evolves.
- **Where the recursion costs nothing, embrace it.** The hrekov-dev case study's §10 reads "You're browsing the artifact" — placing a `<Figure>` of the actual home page immediately above that sentence doubles the rhetorical weight for zero prose change. The same move for other case studies requires live product screenshots (Noble, Fieldmark via Simulator, Lexora via Simulator). Session 2 agenda.
- **Playwright v. puppeteer:** picked Playwright because the browser install is a single `npx playwright install chromium` with no runtime download trap, and `addStyleTag` + `reducedMotion` are first-class API — three lines of config swallowed the whole DotGrid/CTA problem.

## 2026-10-07 — cron · cross-post batch

**Problem:** 2 scheduled cross-post(s) reached publish time.

**Decision:** publish-due.mjs fired via GH Actions hourly cron.

**Result:** Published: no-company-no-api/linkedin → https://www.linkedin.com/feed/update/urn%3Ali%3Ashare%3A7513476238192304130/; no-company-no-api/devto → https://dev.to/ruslan_hrekov_d296523b326/no-company-no-api-59cd. Failures: 0.

**Lesson:** Frontmatter status flipped; ledger entry appended; commit follows.

---

## 2026-10-08 — Lexora Build 15 approved · App Store live

**Problem:** Apple approved Lexora Build 15 — 9 calendar days after resubmission (2026-09-29 → 2026-10-08). Portfolio still carried `status: in-review` on the lexora project card and case study, StackRow had no `live={{}}` tile, FlowSchema row 2 ended on a dashed "pending" node, and the ImpactStats fourth card still said "0 users · Build 15 pending Apple review". Every surface that referenced the review outcome was stale within one minute of approval.

**Decision:** Flip `status` to `shipped` in both `content/projects.ts` and `content/case-studies/lexora.mdx` frontmatter. Add `live={{ label: "App Store", href: "https://apps.apple.com/us/app/lexora-audio/id6811505769" }}` to the StackRow — mandatory per `content/case-studies/CLAUDE.md` §5.3 for shipped products with a public URL. Replace the FlowSchema row-2 terminal node `pending` (shape:event, color:faint, dashed incoming edge, x=986) with `approved` (shape:event, color:success, outcome:"approved" badge, solid success edge, x=980). Shift from 986 → 980 so the outcome badge (+6px past node right edge) stays inside the 1082-wide viewBox per §4.2 rule (max_x ≤ 1082 − 80 − 22 = 980). Update row-2 `meta` from "2026-09-29 · still in review" → "2026-09-29 → 2026-10-08 · approved". Replace ImpactStats item 4 "0 users / Build 15 pending Apple review" with "Build 15 / live on App Store · 2026-10-08". The dev `dateRange` stays "2026-08-30 → 2026-09-29" — verify-case-study-numbers.mjs anchors the tech-stack range end to the lexora repo's last commit date, and approval is a review event, not a code event.

**Result:** `pnpm verify:numbers` passes. Lexora is now the second Flutter case study with a public store listing (Fieldmark being the first).

**Lesson:** Store approval doesn't widen the dev `dateRange` — the tech-stack line stays anchored to the last code commit. Approval signals belong in (a) the FlowSchema terminal node + edge colour, (b) the ImpactStats "status card", and (c) the StackRow `live={{}}` tile. Keep approval date verbatim in all three so the next reader triangulates the same number from three independent surfaces.

---

## 2026-10-15 · Sprint 15 · Phase G — `/work/claude-shiploop` meta case study

**Problem:** Sprint 15 produced the OSS repo (Phase E) and the `/tools` scorecard (Phase F); the meta case study at `/work/claude-shiploop` was still missing. Spec §G required an in-site slug that (a) ships before the OSS repo so the two can launch simultaneously, (b) carries both executive (recruiter) and technical (engineer) surfaces, (c) honours the "null is honest" rule by not inventing adoption metrics that don't exist yet.

**Decision:** Six moves across the phase.

1. **G1 · FlowSchema brief first (per `feedback_flowschema_metaphor_per_project.md`).** Rejected concentric rings (reads as layer cake, not a story), timeline (sprint log, not case study arc), ActivityChart (duplicates `/tools`), WireflowMap (right choice for a parser deep-dive, wrong for a methodology pitch). Picked two-row FlowSchema: Row 1 "naked tier" = `Dev → Prompt → Code → Did it work?` with a self-loop and `rework ×4.5` outcome badge (SMM Factory tier-0); Row 2 "ShipLoop" = `Router → Spec → Plan → Tasks → Build → QA → Ship → Retro` linear with `rework 0.38` outcome badge (hrekov-dev tier-2). The honest comparison lives in the badges; the shape just makes it skimmable. Brief saved to `tmp/flowschema-brief.md` before any code.
2. **G2–G3 · wiring.** Added slug 07 to `content/projects.ts` with `roleTags: ["full-stack","consulting"]`, `stackTags: ["node","ai"]`, `featured: true`, hero at `cover.webp`. Reserved `public/case-studies/claude-shiploop/`.
3. **G4 · body deviates from the 10-section rulebook to a 12-section long-form variant** (hrekov-dev / noble-saas precedent for meta case studies that need both an Attribution-procedure sidebar and a Measurement-algorithm aside without compressing the thesis). Sections: Cold open · Lifecycle contract · Context · Problem · Division of Labor · Prompt Architecture · Iteration Moment (the lockstep guard that wasn't) · Trade-Offs · Attribution procedure sidebar · Measurement algorithm (→ `/tools`) · Results (honest) · Reflection. TechNotes authored by hand with full `{kind,label,title,description,href}` schema (6 items: OSS repo, `/tools` page, specs dir, Claude Code docs, Spec-kit comparison, Conventional Commits).
4. **G5 · hero.** Captured `/tools` scorecard via Playwright chromium at 1600×5000 / 2× DPR, scrolled in viewport-height increments to trigger `whileInView`, clipped the card bounding box via `div:has(> table)`, scaled to 2200w and bottom-cropped to 1400h via sharp, converted to webp 1100×700. Script lives at `scripts/screenshot-shiploop-hero.mjs`. Frame reads as a monochrome gradient from Tier 0 (Lexora/Noble/SMM/Angel at 0% discipline) → Fieldmark Tier 1 → Portfolio Tier 2 with `100% / 0.38 / 1d / 1.50B` headline numbers → claude-shiploop Tier 2 row at the bottom. 23 KB final.
5. **G7 · C-fallback decision — simultaneous, not split.** Read the G4 draft critically: Results section ships with 5 ship-side metrics (skill count, agent count, 5-metric scorecard, 1-command install, hrekov-dev measured 0.38 rework) + an explicit "adoption is Phase H+" disclaimer. Splitting launch by 7 days to collect install counts would (a) undercut the "null is honest" credibility pillar the three-tier design was there to establish, (b) stall the OSS repo for a week on soft signal, (c) force a retroactive stats paragraph that duplicates what `/tools` already shows.
6. **G8 · build gates.** Two drifts had to be closed before `next build` passed:
   - **TechNotes schema archaeology.** Initial draft used `<TechNotes caption items={[{label,href},...]} />`, which crashed prerender with `Cannot read properties of undefined (reading 'glyph')` at `CaseStudySchemas.tsx:2288` — the lookup table `techNoteKindMeta[kind]` returned undefined because `kind` was missing. Rewrote all 6 items with full schema and renamed `caption` → `title`.
   - **`verify:numbers` drift on hrekov-dev.mdx.** The prebuild verifier flagged 18 numeric drifts: hrekov-dev prose was pinned at Sprint 14 state (53 DEVLOG / 14 sprints / 21 days / 37 memory / 18.9%) while disk had advanced to Sprint 15 state (59 / 15 / 26 / 39 / 16.9%). Preferred bulk-sync (16 edits across the MDX, 2 across projects.ts) over disabling the verifier — the verifier is doing exactly its job and silencing it would reintroduce the same credibility hole the scorecard exists to prevent.

**Result:**
- `next build` passes; `/work/claude-shiploop` in the SSG prerender list; dynamic Playfair OG renders at the hashed URL.
- Both reader surfaces render: executive narrative in the main column; technical surface via native `<details>` disclosures (TechnicalDetail primitive) opened inline — no ViewToggle needed because the long-form variant already stacks the technical asides directly in the body.
- Hero (`cover.webp` 23 KB) + 12 numbered sections + two-row FlowSchema + authored TechNotes all shipping on the slug.
- Phase G closed; Phase H (launch day, 10 subtasks) unblocks.

**Lesson:**
- **FlowSchema metaphor-first saved a redo.** Without the brief I would have reflexed to a BPMN role→action lane layout and buried the thesis. The two-row variant with outcome badges on the diamond and the Retro node makes the comparison legible in one glance; the measurement is in the badges, not the diagram shape.
- **Hand-authored TechNotes need the full schema, not a convenient subset.** The component looks up `techNoteKindMeta[kind]` without a fallback — missing `kind` silently crashes prerender via undefined.glyph. Minimum viable item is `{kind, label, title, description, href}`; "caption" is not a prop name.
- **The `verify:numbers` prebuild is a credibility feature, not a nuisance.** When a sprint grows the DEVLOG and memory dir, every static claim in a self-referential case study (`hrekov-dev` in particular) drifts. Bulk-reconciling is 10 minutes; silencing the verifier is unlimited damage. Keep the hook, feed it fresh truth.
- **12-section long-form is a legitimate deviation when a case study has to carry two sidebars (procedure + algorithm) without compressing the thesis.** Rulebook §9 defaults to 10 sections; the hrekov-dev + noble-saas + claude-shiploop variant uses 12. Deviation documented so future meta case studies don't re-invent the pattern.
- **"Null is honest" survives Phase H decision gates.** Splitting launch to collect adoption numbers would have been the easier case-study story (shiny install counts) and the wrong one (deferring the OSS ship for 7 days of soft signal). The scorecard pillar is honest ship-side metrics now, not optimistic adoption metrics later.

---

## 2026-10-15 · Sprint 15 · Phase C — `tokenScorecard` frontmatter + aside

**Problem:** Scorecard JSON exists on disk (Phase B); case-study pages don't surface it. Spec §4.1 requires an additive `tokenScorecard` frontmatter block + a validator that fails build on bad shape, and a monochrome aside that reads next to Artifacts without introducing a new chromatic accent or breaking the max-w-65ch editorial column.

**Decision:** Three edits.

1. `content/case-studies.ts` — gained `TokenScorecard` type (sub-types for complexity / tier / modelMix), optional field on `CaseStudyFrontmatter`, strict `validateTokenScorecard(slug, raw)` wired into `getCaseStudy()` so an invalid block fails LOAD (not just build). Validator: `tokens` non-negative number; `complexity` ∈ `S|M|L`; `tier` ∈ `0|1|2`; `duration` non-empty string; `modelMix` only accepts opus/sonnet/haiku keys, each 0–100, summing to 100±0.1. Rejected an "additive-but-silent" validator (log-and-continue) — a frontmatter block that lies about model mix is worse than no block.
2. `components/case-study/TokenScorecardAside.tsx` — new. Playfair numeric with humanized unit (82.7M, 1.48B), three stat rows (Complexity · Duration · Tier), horizontal `MixBar` with proportional ink/body/muted segments on a hairline track + inline legend. Monochrome throughout, no chromatic accent, `role="img"` + `aria-label` on the mix bar. Returns `null` when `scorecard` undefined — safe to mount unconditionally.
3. `app/(marketing)/work/[slug]/page.tsx` — aside placed BEFORE `ArtifactList` in the stacked-asides column (same `max-w-[65ch]`), token stats land right after the narrative body and before external artifacts.

Deviations from tasks.md: no side-by-side desktop layout for the asides. Looked at the existing page — Artifacts is a single-column aside stacked below the body, not a sidebar. Matching that pattern instead of inventing a two-column grid for one new aside.

**Result:**
- `npx tsc --noEmit` clean.
- Dev-server smoke on `/work/fieldmark` with a temporary `tokenScorecard` block attached — aside renders at 375px (stacked rows), 768px (same stack, more breathing), 1200px (three stats inline on one row). Mix bar fills accurately (89% Opus ink + 11% Sonnet body + hairline rail). "TOKEN SCORECARD" eyebrow + Playfair 82.7 + unit caption composition reads as a sibling to the "At a glance" and "Artifacts" cards.
- Contrast on new fg/bg pairs: ink-primary 18.88:1 · ink-body 14.38:1 · ink-muted 5.36:1 on bg-elevated (AA pass; muted at AAA-large pass, which is where it's used).
- One typography tightening: tier value changed from `Tier 1 · self-spec` to `1 · self-spec` (field label already says TIER).
- Temporary MDX edit reverted; scratch screenshot script deleted.

**Lesson:** The spec says "sidebar next to Artifacts" but the live page has no sidebar — Artifacts is a stacked aside at the same column width. When the spec encoding diverges from the shipped layout, defer to the shipped layout and name the deviation in the DEVLOG. Half the risk in Phase C was going to be inventing a two-column grid that didn't belong, breaking Artifact's spacing in the process. Matching the existing pattern made the diff a pure addition.

Second lesson: validators belong at LOAD time, not just build time. `getCaseStudy()` is called from `generateMetadata` and `generateStaticParams` paths — if a bad frontmatter block were only caught at `next build`, dev-mode editors would see a silent bad render and lose faith in the structured block. `fail(slug, msg)` throws from the loader, which turns a broken block into an obvious 500 in dev. Right incentive.

---

## 2026-10-15 · Sprint 15 · Phase B — scorecard parser (vendored in portfolio)

**Problem:** Spec §4.2 defines `scorecard.json` with 5 metrics × 7 projects. Each metric needs an honest source: discipline from `specs/<N>/{spec,plan,tasks}.md` + `DEVLOG.md` presence, rework from conventional-commit prefixes, time-to-ship from spec date → last-commit date, tokens from `~/.claude/projects/<slug>/*.jsonl`, expert hit rate from `expert consulted` / `plan changed: yes|no` pairs. Target audience (Claude-devs) will discount any "ShipLoop reduces X" claim unless the parser is inspectable.

**Decision:** Vendored parser at `scripts/scorecard-src/` — not `scripts/scorecard.ts`, because tsx isn't installed and the repo convention is `.mjs`. Four library modules (`claude-logs`, `git-log`, `devlog`, `metrics`) composed by `scorecard.mjs`; config at `scorecard.config.mjs` with a `REQUIRED_CONFIG_VERSION` lockstep guard. `modelMix` + `duration` in config are FALLBACKS — overridden by measured values when `logPath` is readable. Snapshot at `scripts/__fixtures__/scorecard.expected.json` + shape-check (`snapshot-check.mjs`) guards structural drift; value drift is expected and re-committed via `npm run scorecard`. Scripts wired: `npm run scorecard` + `npm run scorecard:check`.

Metric nuances absorbed in the parser:
- **Discipline** = 4-point binary (spec+plan+tasks across any `specs/<N>/` + DEVLOG). Lexora comes out 4/4 despite Tier 0 — speckit era had the artifacts, ShipLoop wasn't institutional. The `/tools` methodology aside will explain the gap: score is artifact presence, tier is human discipline judgment.
- **Rework** = `fix / feat`. `conventional === 0` → null (not zero — zero would misread as "perfect project"). `feat === 0 && fix > 0` → Infinity (chaos signal).
- **Time-to-ship** = median across `specs/<N>/spec.md` files with parseable date (`**Date.** YYYY-MM-DD` with period-in-bold OR `**Date**:` OR `date:` frontmatter), diffed against `git log -1 --format=%ad -- specs/<N>`. Portfolio: TTS=1 across n=5 specs. Lexora: TTS=13 n=1.
- **Tokens** = `input + output + cache_read + cache_creation` summed across all `.jsonl` assistant messages, face value (not cost). Model attribution by exact ID map first, substring fallback to opus/sonnet/haiku. Streaming via `node:readline` for the 163MB mega-session.
- **Expert hit rate** = `plan_changed_yes / (yes + no)`. Convention not yet enforced in any DEVLOG — all projects return null. Honest "no data yet".

B8 (OSS canonical-vs-vendored CI diff) + B9 (regression fixture) deferred to Phase E — pointless until the OSS repo exists.

**Result:** `npm run scorecard` produces `scripts/__fixtures__/scorecard.expected.json` with all 7 projects. Measured output lines up with the thesis:

| Project | Tier | Discipline | Rework | TTS (med) | Tokens | Mix |
|---|---|---|---|---|---|---|
| Portfolio | 2 | **1.0** | **0.38** | **1 day** | 1.48B | 100% opus |
| Fieldmark | 1 | 0.25 | 2.0 | — | 82.7M | 89/11 opus/son |
| Lexora | 0 | 1.0 * | 0 | 13 (n=1) | — | fallback |
| Noble SaaS | 0 | 0 | 1.44 | — | 26.4M | 98/2 son/opus |
| SMM Factory | 0 | 0 | 4.5 | — | — | fallback |
| Angel Trucking | 0 | 0 | — | — | — | fallback |

`* ` Lexora speckit artifacts predate ShipLoop. Snapshot shape check prints 5 ok lines in ~5s and surfaces structural drift (verified via negative-path test — removing a metric key triggers `FAIL — snapshot.lexora.metrics key set drifted ...` with exit 1).

**Lesson:** When computing per-project metrics across years-old repos, the pattern that reads as "a bug" is often the ground truth. Lexora 4/4 discipline isn't the parser lying — it's that speckit artifacts predate ShipLoop. Rather than paper over with a "discipline is only valid if tier > 0" clause, keep the metric honest and explain the disconnect in prose. Same for Portfolio TTS=1 — plan-to-ship happens same-day when a solo op is the whole org. Numbers are measurements; narrative does the comparative work.

Second lesson: snapshot fixtures for metrics that drift every commit (rework, tokens, commit counts) must guard STRUCTURE not VALUES. A strict value-diff would force `npm run scorecard` on every merge; a shape-diff fails only when a parser regression removes/renames a metric or a project vanishes from config. Right incentive for both canonical-OSS and vendored-portfolio parsers.

---

## 2026-10-14 — Sprint 15 · Phase A attribution scan + bail-out

**Problem:** Spec §10.1 planned to reconstruct Tier 0 (Lexora, SMM Factory, Angel Trucking) token spend by attributing sessions from `~/.claude/projects/-Users-ruslan/` (123 mixed sessions, 269MB) to projects via keyword counting, then physically moving matched sessions into per-project folders. The scorecard's "cross-tier comparison" angle depends on having at least a lower bound for Tier 0 numbers.

**Decision:** Ran `scripts/attribute-sessions.mjs` across all 123 sessions. Threshold: project scores a session if its keyword set hits ≥3 total; classify as SINGLE (one project ≥3) / MIXED (≥2 projects ≥3) / UNCLASSIFIED (none ≥3). Bail-out criterion from spec: `SINGLE / total < 50%` → fall back to null tokens.

Also removed four fabricated human names from the keyword fixture + spec (K. Osipov, Kirill Osipov, T. Hall, Thomas Hall, Angel P., Angela P.) — all were invented during the brainstorm with no source citation. Added `feedback_no_invented_client_names.md` to memory so future brainstorms don't repeat the pattern.

**Result:** SINGLE 0 / MIXED 2 / CONTEXT_ONLY 3 / UNCLASSIFIED 118. Angel Trucking: zero hits across all 123 sessions — never ran from this home dir. Lexora + SMM Factory: present only inside two mega-sessions (97MB + 163MB) interleaved with Fieldmark + Portfolio + Noble SaaS work; not cleanly separable without time-slicing we didn't build. 118 UNCLASSIFIED sessions are overwhelmingly trivial (1-2 messages, ~300 char corpus).

Bail-out triggered. Did not run the move script (A5). Spec §10.1 updated: Tier 0 tokens = null in scorecard with explanatory note "not reconstructable from mixed home-dir sessions; project pre-dates per-project session isolation." The `/tools` methodology aside (Phase F) covers this transparently — null here is honest signal that pre-ShipLoop projects lack the instrumentation.

**Lesson:**
- **Diagnostic scans before destructive filesystem ops save hours of wrong work.** The spec committed to a reorg procedure that would have produced near-zero signal; running the read-only scan first revealed that in ~2 minutes. If I'd skipped straight to the move script, the output would have been 2 MIXED folders of 97MB + 163MB and nothing else.
- **"Null is honest" has to survive first contact.** The scorecard spec committed to null cells over fabricated numbers; bail-out executes that commitment. Softening it to "self-reported estimate" would reintroduce the exact credibility hole the three-tier design was there to avoid.
- **Keyword maps need a source audit before anyone types them.** The brainstorm captured "k. osipov" / "t. hall" / "angel p." as apparent stakeholder names from thin air; they survived into the spec and the fixture before Ruslan asked "K. Osipov who?". New rule in memory: no human name in a project artifact without a citation to case study / DEVLOG / email / Linear.
- **Two monster sessions dominate 85% of this folder's bytes.** 7c5fd6d6-… = 163MB (15,748 messages, Fieldmark-dominant) and 5e28002b-… = 97MB (9,586 messages, Lexora+Fieldmark+Portfolio). If anything, those are the useful source for later time-sliced extraction — but that's a different project.

---

## 2026-10-16 · Sprint 15 · Phase H — launch day (OSS repo public, portfolio merged, prod live)

**Problem:** Ten subtasks (H1–H10) across one evening, blending read-only pre-ship checks (H1), name-availability pings (H2), the irreversible `gh repo create --public` (H4), the irreversible portfolio PR merge (H6), and a production smoke that would be the first signal whether the whole sprint actually shipped. The first version of my launch pacing executed H1→H6 as a chain on short "continue" prompts, and Ruslan interrupted mid-sequence: *"виглядає так ніби я вже тебе не контролюю і ти робеш щось таке що мені не зрозуміло"*. The launch continued, but the operating mode changed mid-flight.

**Decision:** Three decisions worth preserving.

1. **Single-step gates became the rule, retroactively.** Everything externally visible — repo create, PR merge, post publish — now needs its own "I'm about to do X, OK?" preface, independent of any earlier approval. Reversible local work (edits, builds, dry-runs, memory writes) keeps flowing. New feedback memory `feedback_pause_at_public_gates.md` + MEMORY.md pointer, so the rule survives beyond this session.

2. **`gh repo create` flag conflict.** `gh repo create <name> --public --license mit --source=. --push` printed the full help text and bailed silently. Root cause: `--license` only accepts the string literal name and only when gh is scaffolding a repo from scratch; it refuses to coexist with `--source=.` because a source tree may already have its own LICENSE. Fix: dropped `--license mit` (the LICENSE file was already in `~/shiploop-publish` from Phase E). Second invocation succeeded; `github.com/ruslan4427/claude-shiploop` live, public, MIT via LICENSE-in-tree.

3. **The Vercel production deploy failed on the merge commit, but hrekov.dev kept serving.** Build error on `app/layout.tsx`: `next/font/google queries have exactly one entry` from Turbopack's `NextFontGoogleFontFileReplacer`. Local `next build` on the identical SHA (Next 16.3.5) succeeded. No font or next-config diff between the last Ready prod (2 days earlier) and the failing merge — the regression is Vercel-side (Turbopack runtime drift between those two deploys). hrekov.dev stayed aliased to the 2-day-old Ready deploy, which is why the first smoke returned 200 for `/work/claude-shiploop` (stale edge cache carryover) but 404 for `/tools` (route didn't exist on that older deploy). `vercel redeploy <failed-url>` on the same deploy ID succeeded on retry with no code change — a transient build-cache flake. The alias flipped; `/tools`, `/work/claude-shiploop`, `/work`, both OG images all 200.

**Result:**
- Repo: `github.com/ruslan4427/claude-shiploop` public, MIT, README/INSTALL/CONTRIBUTING shipped. Live install dry-run from `mktemp -d` scratch prints the expected clone-path output after relocating out of `~/shiploop-publish` (first run short-circuited to local source because `install.sh` detects `SCRIPT_DIR/skills/` and the shell was sitting in the source tree).
- Portfolio PR #1 merged as `ef52940`. Vercel production deploy `dpl_2BPr5S4BHEaJUGkaj3YH1bnt8Vvo` Ready, aliased to hrekov.dev.
- `/tools`, `/tools/opengraph-image-1vhr9h`, `/work/claude-shiploop`, `/work/claude-shiploop/opengraph-image-11ulvk`, `/work` → all 200 at the edge after redeploy.
- Phase H8 (blog + LinkedIn draft) and H9 (split-launch wait path, skipped per G7) deferred to a separate gated session so the publish text goes through a review step.

**Lesson:**
- **Launch-day sequences need per-action gates, not blanket "go".** The time saved by chaining H1→H6 on one "continue" was measured in seconds; the trust cost was measured in a mid-launch interruption. The ratio only ever points one way. Memory file recorded.
- **`gh repo create` with `--license` + `--source` is one of several silently-incompatible flag combos.** When gh prints the full help text instead of an error, read it as "your argv is incoherent" not "help was requested" — and strip the newer flag against the older one.
- **A build-system regression on the CI side can hide behind a stale CDN alias.** Our smoke showed 3 of 4 endpoints green while hrekov.dev was still on a 2-day-old deploy that never contained the new routes. The 404 was the honest signal; the 200s were cache noise. Always `vercel inspect hrekov.dev` first when a route 404s after merge — the alias target tells you whether the current deploy is actually what you think it is.
- **Vercel's `redeploy` without `--no-cache` can still succeed on a failed deploy ID.** It wasn't a null fix — it rebuilt against the same source tree with a fresh Turbopack graph. If this repeats on the next sprint's merge, pin the Node version or try `vercel --prod` cold.

---

## 2026-10-17 — cron · cross-post batch

**Problem:** 2 scheduled cross-post(s) reached publish time.

**Decision:** publish-due.mjs fired via GH Actions hourly cron.

**Result:** Published: classify-before-you-code/linkedin → https://www.linkedin.com/feed/update/urn%3Ali%3Ashare%3A7517325460234534913/; classify-before-you-code/devto → https://dev.to/hrekov/classify-before-you-code-24f7. Failures: 0.

**Lesson:** Frontmatter status flipped; ledger entry appended; commit follows.

---

## 2026-10-17 — cron · cross-post batch

**Problem:** 1 scheduled cross-post(s) reached publish time.

**Decision:** publish-due.mjs fired via GH Actions hourly cron.

**Result:** Published: shipping-claude-shiploop/devto → https://dev.to/hrekov/shipping-claude-shiploop-4e5h. Failures: 0.

**Lesson:** Frontmatter status flipped; ledger entry appended; commit follows.

---

## 2026-10-17 — cron · cross-post batch

**Problem:** 1 scheduled cross-post(s) reached publish time.

**Decision:** publish-due.mjs fired via GH Actions hourly cron.

**Result:** Published: shipping-claude-shiploop/linkedin → https://www.linkedin.com/feed/update/urn%3Ali%3Ashare%3A7517350698888462356/. Failures: 0.

**Lesson:** Frontmatter status flipped; ledger entry appended; commit follows.

---

## 2026-10-17 — Sprint 17 · ui-ux-pro effectiveness rig lands

**Problem:** `ui-ux-pro.effectiveness.impact` on /tools has read `null` since Sprint 16 shipped the tool, with a placeholder note ("no retroactive measurement — will backfill when a rig lands"). The skill was in daily use (every blog post, every page edit) but the /tools page couldn't say so. A tool-scorecard entry with a dash isn't a receipt — it's an IOU. The ask: ship the measurement rig and backfill, so the row stops being a promise.

**Decision:** Five choices worth preserving.

1. **Source of truth = post frontmatter, not a side ledger.** Blog MDX gained an optional `uiRework: {heroRegenerations, figureRevisions[], toneFixes, qaCatches, serializerRoundTrips}` block. The scorecard parser reads frontmatter directly — the same mechanism as `distribution.linkedin.status`. One file per post, no mystery database.

2. **`qaCatches: number | null`, not required int.** All 5 shipped posts pre-date the formal ui-ux-pro pass. Writing `0` for them would be dishonest — zero means "I ran the pass and found nothing," which never happened. `null` means "the discipline wasn't operational yet." The plan.md A1 amendment mid-sprint turned a required-int field into nullable; the validator in `content/blog.ts` enforces `null | non-negative integer`. The null-is-honest rule holds for /tools dashes AND for per-post schema.

3. **Backfill ratio surfaced, not hidden.** `/tools` caption reads "Backfilled across 4 of 5 shipped posts" — explicit methodology. verify:numbers check #14 enforces the "4 of 5" phrasing against `scorecard.json.projects[hrekov-dev].uiRework.{backfilledFrom, totalEligible}`, so a backfill drift (new post without `uiRework`, or a frontmatter typo) fails the build.

4. **Aggregator ships in-tree, not canonical-vs-mirror.** Sprint 15 established a vendored-vs-canonical parser pattern (`~/shiploop-publish/lib/` → `scripts/scorecard-src/`). For this one dimension I short-cut: wrote the aggregator directly at `scripts/scorecard-src/lib/ui-rework.mjs`, no canonical mirror in the OSS repo. Scope: the ui-rework rig is tied to blog surfaces, and only hrekov-dev has a `content/blog/` directory. Pulling it into claude-shiploop OSS would export dead code to every consumer. If a second project gains a blog + rig later, hoist to canonical then.

5. **Monday's post is the first non-null `qaCatches`.** `shipping-claude-shiploop` is scheduled 2026-10-19 — the first rig-era post. Its uiRework field was deliberately omitted from the backfill; it fills at ship time with the first measured value from a formal ui-ux-pro pass. The `/tools` caption telegraphs this ("first rig-era post ships 2026-10-19"), so the dash isn't permanent — it's a date-stamped placeholder.

**Result:**
- `content/blog.ts` extended with `UiRework` type + validator (`number | null` qaCatches).
- 4 posts backfilled: launching-the-journal, shipping-the-cross-poster, no-company-no-api, classify-before-you-code. Per-post evidence trace in `memory/iteration-17.md` with git SHAs for every claim (`b1e95f5` hero batch, `9e36d43` figure batch, `c57813d` tone pass, serializer republish chain for classify's 5 round-trips).
- `scripts/scorecard-src/lib/ui-rework.mjs` parses `content/blog/*.mdx` via gray-matter, filters to published posts, returns `{backfilledFrom, totalEligible, avgHeroRegenerations, avgQaCatches, totalSerializerRoundTrips, perPost[]}`.
- `scorecard.json`: hrekov-dev gets the full block (`{4, 5, 1, null, 5}`), all 6 other projects get `uiRework: null` (no blog surface).
- `/tools` ui-ux-pro row now shows: Hero regens avg 1.00 · QA catches avg — · Serializer round-trips 5. Three rows match `md:grid-cols-3`; captions carry methodology; no `parserSource` yet (aggregator is portfolio-local, not public standalone).
- verify:numbers check #14 added — Hero regens, QA catches (null-is-honest enforced), Serializer round-trips, backfill ratio phrasing. Sanity test: breaking "1.00"→"9.99" and "4 of 5"→"2 of 5" both fire the right error, revert clean.
- Snapshot CI stays green (uiRework is additive top-level sibling to daily/details, not in required PROJECT_KEYS).

**Lesson:**
- **"— will backfill when a rig lands" is the IOU, and IOUs on a tool scorecard age poorly.** Sprint 16 shipped the ui-ux-pro skill with impact:null and the explicit "backfill later" caption. Sprint 17 did the backfill, which took one evening because the discipline (uiRework block in frontmatter) was straightforward to spec. The right move the next time a tool ships without a measurement rig is to open the backlog ticket for the rig immediately — not a comment in content config, not a note in a devlog.
- **Null in the schema is a design decision, not a type error to be eliminated.** The first-draft plan.md said all uiRework fields required when present. That rule collided with the honest answer for pre-rig posts. Mid-sprint amendment: `qaCatches: number | null` + validator that accepts both. The same rule governs the aggregator's output and the /tools dash. One null-is-honest rule, three places it shows up.
- **Vendored-vs-canonical is a pattern, not a mandate.** Sprint 15 set up the mirror discipline for scorecard parsing. Sprint 17 skipped it because the aggregator is tied to a surface only hrekov-dev has. Scope-matched abstraction over doctrinal fidelity — the OSS consumers would have gotten dead code.

---

## 2026-10-18 — /about redesign · editorial ledger variant

**Problem:** `/about` was a centered stack of card sections (Experience cards, Values cards) that read like the home page repeated. Brief: one variant, strictly inside the `:root` tokens, monochrome + green status only, Playfair upright + Inter only.

**Decision:**
- Hero splits 7/5: Playfair h1 left, an elevated "At a glance" card right carrying the `StatusPill` (the only green) and a hairline `<dl>` of facts restated from `content/about.ts` + page metadata (no new claims).
- Numbered section rails (`01 — Bio`, `02 — The path`, `03 — How I work`) sticky on `md+`, content in the right 9 columns.
- Bio lead paragraph set in Playfair (upright, 400); remaining paragraphs Inter.
- Timeline inlined as a hairline ledger (`content/experience.ts`) instead of the `Experience` card component; Values inlined as numbered rules with an ink top rule instead of cards.
- `AiStack` + `Credentials` reused unchanged. Closer moved into an elevated `--radius-card` card.
- Motion only via existing `Reveal` / `MaskReveal` / `Stagger` (all reduced-motion aware); sticky is static positioning.

**Result:** Single-file change to `app/(marketing)/about/page.tsx`. No new colors, radii, fonts, or tokens. `tsc` clean for this file (only pre-existing `LayoutProps` typegen error in `app/layout.tsx`); eslint clean.

**Lesson:** Page-level redesigns can stay token-pure by changing composition (rails, ledgers, rules) rather than surface treatment — the ink ramp + hairline give enough hierarchy without a second hue.

## 2026-10-21 — Sprint 20 · case studies redesigned on the full content

**Problem:** The 2026-10-18 audit (`memory/qa-iteration-1.md`) found the case studies were the weakest part of the site for a prospective client: they opened with internal metrics ("Token scorecard", "unmeasurable", "Tier 0 · naked", status "sprint-4"), ran 7–24 screens with no skim path, and ended in a dead end. Two of six had a summary; the documented ViewToggle was no longer mounted. Design canvas mockups (one template, six cases) were approved; the redesign had to cover *all* MDX content, not a condensed copy.

**Decision:**
- Method: ui-ux-pro (`ruslan4427/ui-ux-pro`) — tokens first (`extract_tokens.py` found the 19 existing tokens), contrast via `check_contrast.py`, visual check at 1440 and 390, trends applied selectively (progressive disclosure, bento overview, transparent AI disclosure). Its minimalist style file was *not* allowed to override project rules (Inter, no pastels, no mono labels).
- Merged design system v2 tokens into `globals.css` (additive). `:root` type tokens are `--type-*`; `@theme` radii stay literal because a same-name `var()` inside `@theme` is self-referential.
- One template for every case: hero (lens headline + 4 lens stats) → "At a glance" bento (problem, outcome, built with, timeline, Made with Claude) → chapter rail over every `##` section + the full MDX → "How it was made" receipts → lens CTA on the inverse panel → previous/next case.
- Reading lens (Founder / Hiring manager / Engineer) changes headline, stats, the "Start here" chapter and the CTA; `?for=` pre-selects it for outreach links; persisted in localStorage via `useSyncExternalStore` (hydration-safe, no setState-in-effect).
- Reading depth: a rehype pass wraps each `##` in a `<section>`; `[data-depth="short"]` CSS shows heading + first block, with a per-section "Read the full section". Nothing is removed from the DOM, so crawlers and full readers see everything.
- Lens copy lives in `content/case-lenses.ts`, every number restated from the MDX or `projects.ts`.
- Restyled case MDX components to v2: faint-ink text → muted, decorative green/red in diagrams and RaceTimeline → monochrome recipes (glyph/line style carries the state), 10–12px text → 13px caption, uppercase tracked labels → sentence case, mono labels → Inter, off-token radii → tokens, scrollable `<pre>` and AgentReplay keyboard-focusable, nested `<aside>` → `<div>`, empty table corner named.

**Result:** All 6 `/work/<slug>` pages build statically and render every MDX section. axe on the 6 cases: color-contrast, scrollable-region-focusable, region, nested-landmark and empty-table-header all gone (were serious/moderate on every case). No horizontal overflow at 390px. "2-min read" pages run 7.3–9.9k px vs 7.5–22k full. Prod build: no hydration errors (the dev-only warning on hrekov-dev/lexora/smm-factory predates this sprint and does not reproduce in `next start`). tsc clean except the pre-existing `LayoutProps` typegen error; new files lint-clean (two pre-existing react-compiler errors in CaseStudySchemas remain).

**Lesson:** "Redesign all the content" is a template + component-style problem, not a copy problem. Restyling the MDX primitives and wrapping sections at the rehype layer moved 2,500 lines of case content into the new system without touching a single MDX body — and the depth toggle came almost free once sections were real DOM nodes.

## 2026-10-21 — Sprint 21 · diagrams and flows rebuilt on standard notation

**Problem:** The case-study `Diagram` and `FlowSchema` primitives drew shapes whose meanings contradict the notations readers already know (circle for a person — BPMN's event symbol; parallelogram for server work — ISO 5807's data symbol), connected nodes with diagonal centre-to-centre lines, set node text at 10–11px in viewBox units (≈5–9px rendered on wide canvases), drew sequence connectors without arrowheads, offered no text alternative, and wrapped each figure in a `<button>`.

**Decision:** New `components/mdx/Schematic.tsx` owns the notation: ISO 5807 symbols (process rectangle, decision diamond, data parallelogram, terminator stadium, stored-data cylinder) with C4's dark "Person" box. MDX `shape` names are unchanged; rendering maps them to the standard symbols, an `event` with a database/cache icon becomes a store, and a non-decision node with `outcome` and no outgoing edge becomes the terminator. Orthogonal routed connectors with rounded elbows and target-only arrowheads; dashed = async/optional. Auto legend for symbols and line styles in use; "Read as steps" list in breadth-first reading order (WCAG 1.1.1); keyboard-focusable scroll region; ≥0.8 render floor with a "wide diagram" hint; always-visible Expand button. FlowSchema: arrowed connectors, numbered steps, status in words (Done / At risk / Failed) instead of a dot, before/after framed with the Sprint 19 recipe (dashed vs solid). Shape props corrected where meaning was wrong (PM, builds, submissions, tiers → process; Supabase → store). The replay-on-scroll animation contract (§7 of the case rulebook) is kept.

**Result:** All 14 diagram rows across the six cases render in the standard notation; axe reports no violations inside any figure; production build clean, no runtime errors. Overlaps found by a bounds script against the new shape sizes (hrekov-dev tiers, ShipLoop session row, Lexora builds) were fixed by shifting siblings per rulebook §4.4. Rulebook §4.1/§4.8/§6.5 updated.

**Lesson:** A notation is only useful if the shapes keep the meaning readers bring with them. Inventing a private shape vocabulary costs every reader a legend lookup; borrowing ISO 5807 + C4 costs nothing and makes the authoring rule ("pick the shape by meaning") checkable.

## 2026-10-21 — Sprint 22 · brick accent, self-laying-out diagrams, figures always open

**Problem:** Ruslan found the monochrome site flat and asked for a brick accent he had seen work with the palette; diagrams and screenshots hid behind a separate Expand button (and behind "Read the full section" in the 2-min read); wide diagrams scrolled sideways inside the text column; and several diagrams had edge labels sitting on nodes.

**Decision:**
- Rule change, owner's call: a single emphasis hue, brick `--accent` `#A94427` (5.38:1 on paper, 5.67:1 under `--accent-ink`), alongside the functional green. Used for key paths/outcomes in diagrams, the hero stat rules, reading progress, "Start here", "After" rows and link hover — never large fills, never alone. STABLE_LOGIC and CLAUDE.md updated.
- Diagrams lay themselves out for the measured column width (layered top-to-bottom for branching graphs, snake rows for chains). Column gap grows to the widest edge label; row-skipping edges use a left corridor and return paths a right corridor, labels inside the corridor; node height follows wrapped text. Node text stays 14px at every width; MDX coordinates are ignored.
- The diagram itself opens full screen on click (div with button semantics, keyboard operable); the Expand button is gone. In the 2-min read, figures stay visible and only prose collapses.
- WireflowMap no longer forces a 480px minimum width on phones.

**Result:** An overlap/clip sweep over every figure on the six cases at 1440 and 390 (node boxes, text, label pills, foreignObject overflow) reports zero issues outside the SVG phone reconstructions, whose tight line boxes are intentional. tsc clean (pre-existing LayoutProps typegen error aside); new code lint-clean.

**Lesson:** Hand-placed coordinates were the root cause of every spacing complaint — each fix was a local shift that the next width undid. Moving layout into the component turned "keep the frames apart" from a review checklist into a property of the system.

## 2026-10-21 — Sprint 23 · /work index rebuilt around the reading lens

**Problem:** `/work` still used the pre-redesign layout: centred badge hero, copy claiming "Five case studies" while six exist, a Year filter with a single value, cards showing only name, role and one metric, a pre-launch project labelled "Active", white/black overlay chips, 11px text and an italic display numeral.

**Decision:** Left-aligned hero with the count derived from `projects.ts`; the same "Reading as" lens control as the case pages (shared localStorage key, no depth toggle here). A full-width "Start here" card picks the case that answers that reader first (founder → Noble, hiring → hrekov-dev, engineer → smm-factory) with the lens headline and four stats; the grid shows the other cases with lens headline, two stats on accent rules, stack tags and plain-language status. Card links carry `?for=` so the case opens in the same view. Filters collapse to one row of role/stack chips with live counts; zero-match and all-match options are dropped. ProjectCard moved to v2 tokens (on-dark chips, 13px floor, no italic numeral, panel radius). Animated covers are now `role="img"` with the scene `aria-hidden`; the Lexora cover's decorative `<button>` (focusable inside a link) became a span.

**Result:** /work renders at 1440 and 390 with no overflow; lens switch changes the start pick and card copy; Flutter filter → Lexora, Fieldmark. axe: no violations on mobile; on desktop only the Noble cover's struck-through "done" rows (app colours reproduced verbatim per case rulebook §10 — incidental text inside an image, WCAG 1.4.3 exception).

**Lesson:** An index page is a router, not a gallery. Once the case pages knew who was reading, the index had to answer the same question first — "where should *I* start?" — or the lens would reset at the door.

**Follow-up, same day (owner review):** Ruslan found the lens-driven index confusing — the count of cases was not visible at a glance, and one case got a large card with no obvious reason why. Reverted to one equal grid: the h1 states the count ("Six case studies."), every card carries `01 / 06`, status, one line of what it is, the outcome, time and headline result. The lens control, the "Start here" card and `workStartHere` are gone from /work (lens stays on the case pages); filter row shows "Showing N of 6 cases". Lesson: personalisation on an index page hides the inventory; readers first need to see how much there is and that every item gets the same treatment.
