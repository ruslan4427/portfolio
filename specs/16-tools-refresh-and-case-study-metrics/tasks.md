# Tasks — Sprint 16

## Phase 1 — Scorecard parser emits per-day data

- [ ] 1.1 Open `~/shiploop-publish/lib/parse-tokens.ts`; add `DailyRow = { date: string; tokens: number; commits: number }` and new return field `daily: DailyRow[] | null`.
- [ ] 1.2 Bucket JSONL assistant messages by local date (America/Kyiv) with a top-of-file comment explaining the choice.
- [ ] 1.3 Add `daily` emit path in the aggregate: for projects with session JSONLs, group by date; for projects without, return null.
- [ ] 1.4 Add git log pass to count commits per date, zip with token rows.
- [ ] 1.5 Add unit test (shiploop-publish/test/) comparing a fixture session against expected daily rows.
- [ ] 1.6 Commit + push shiploop-publish.
- [ ] 1.7 Sync `scripts/scorecard-src/parse-tokens.ts` ← canonical.
- [ ] 1.8 Regenerate `scorecard.json`; verify every project with non-null tokens now has non-null daily.
- [ ] 1.9 Update `.github/workflows/scorecard-snapshot.yml` schema allow-list to accept `daily` key.

## Phase 2 — Frontmatter phases field

- [ ] 2.1 Edit `content/case-studies.ts`: add `Phase` type + `phases?: Phase[]` on `TokenScorecard`.
- [ ] 2.2 Add validator: phase dates must fall within case-study git-log date range (or warn in dev-only, don't throw).
- [ ] 2.3 Add validator: phase `from` ≤ `to` for every entry; no gaps allowed (if we want contiguous phases — decide: contiguous required or gaps OK? Default: gaps OK, phases are declarative not exhaustive).
- [ ] 2.4 Author `phases` in 4 case-study MDX files: `smm-factory`, `hrekov-dev`, `claude-shiploop`, `lexora`. Verify each phase against DEVLOG + git log.

## Phase 3 — ui-ux-pro OSS publication

- [ ] 3.1 Audit `~/.claude/skills/ui-ux-pro/` for portfolio-specific references (hard-coded paths, personal names in examples). Strip or genericize.
- [ ] 3.2 Write `README.md`: what the skill does, install path (`~/.claude/skills/ui-ux-pro`), when Claude invokes it, how to extend.
- [ ] 3.3 Write `INSTALL.md` or install block in README (clone to skills dir, no further setup).
- [ ] 3.4 Add `LICENSE` (MIT, Ruslan Hrekov, 2026).
- [ ] 3.5 Add `.gitignore` (standard editor + OS files; no secrets to worry about — this is a skill).
- [ ] 3.6 Create empty public GitHub repo `ruslan4427/ui-ux-pro`.
- [ ] 3.7 `git init` locally, add origin, commit, push.
- [ ] 3.8 Verify repo loads at `github.com/ruslan4427/ui-ux-pro` and README renders.
- [ ] 3.9 Note the GH URL for `/tools` link in phase 7.

## Phase 4 — TokenScorecardHero (reposition)

- [ ] 4.1 Rename `components/case-study/TokenScorecardAside.tsx` → `TokenScorecardHero.tsx` (or keep both temporarily and introduce new).
- [ ] 4.2 Adjust styling: full width, larger typographic scale (serif tokens number from `text-5xl` → `text-6xl` or `clamp`).
- [ ] 4.3 Update `app/(marketing)/work/[slug]/page.tsx`: render `<TokenScorecardHero>` AFTER `<ArticleHeader>` and BEFORE `<CaseStudyBody>`.
- [ ] 4.4 Remove TokenScorecardAside from wherever it currently renders inside the article (if any — audit).
- [ ] 4.5 Verify on 5 case studies: smm-factory, hrekov-dev, claude-shiploop, lexora, noble-saas, fieldmark, angel. (Any that currently have a scorecard should get the hero; the others get no block.)
- [ ] 4.6 Contrast check for new typographic scale (ink-primary on bg-elevated — likely already compliant, verify).

## Phase 5 — BuildTimeline component

- [ ] 5.1 Create `components/case-study/BuildTimeline.tsx`. Props: `{ phases: Phase[], daily: DailyRow[] | null }`.
- [ ] 5.2 Compute date range: `min(phases[].from)` to `max(phases[].to)`. If `daily` extends outside, extend range to cover.
- [ ] 5.3 Render SVG: phase bands row (height ~24px each, labels above), daily density row (bars sized by token count).
- [ ] 5.4 Accessibility: `role="img"`, `aria-label` summarizes "4 phases over 7 days, 2.5M tokens peak on 2026-09-16".
- [ ] 5.5 Hover tooltip on daily bars (desktop only). Mobile: skip tooltip; the bar heights alone communicate shape.
- [ ] 5.6 `prefers-reduced-motion`: no fade-in; static render.
- [ ] 5.7 Wire into `work/[slug]/page.tsx` after `<TokenScorecardHero>`: render only if `scorecard.phases && scorecard.daily`.
- [ ] 5.8 Verify render on 4 case studies.
- [ ] 5.9 Contrast check phase band fills vs their labels.

## Phase 6 — AgentReplay component (smm-factory)

- [ ] 6.1 Create `components/case-study/AgentReplay/types.ts`: `AgentNode { id, name, position: {x,y} }`, `AgentEdge { id, from, to }`, `ReplayStep { edgeId, label, payload }`.
- [ ] 6.2 Create `components/case-study/AgentReplay/smm-factory.ts`: declare 4 nodes (orchestrator, planner, generator, publisher), 3-4 edges, 4 steps with payloads documented from case study + agent files.
- [ ] 6.3 Create `components/case-study/AgentReplay/AgentReplay.tsx`: SVG canvas, node render, edge render, state (`stepIndex`), controls, keyboard listener, side payload panel.
- [ ] 6.4 Active edge highlight: thicker stroke + ink-primary; inactive: thin + ink-muted. Framer Motion for stroke transition respecting reduced-motion.
- [ ] 6.5 Active node pulse (subtle scale 1 → 1.05, 400ms, reduced-motion disables).
- [ ] 6.6 Buttons: Reset / Prev / Next as `<CTAButton size="sm" variant="outline">`. Keyboard: ← → Home.
- [ ] 6.7 Add to `components/mdx/MdxComponents.tsx` or BlogComponents mapping so MDX can call `<AgentReplay data={smmFactoryReplay} />`.
- [ ] 6.8 Insert into `content/case-studies/smm-factory.mdx` at the appropriate section.
- [ ] 6.9 A11y: focus states on buttons, aria-live region announcing step changes.
- [ ] 6.10 Contrast check on active vs inactive node/edge colors.

## Phase 7 — /tools rewrite

- [ ] 7.1 Create `components/tools/ToolsBuilt.tsx`: list wrapper, section header "Tools we built."
- [ ] 7.2 Create `components/tools/ToolCard.tsx`: title, GH link (CTAButton outline), one-paragraph description, EffectivenessBlock embed.
- [ ] 7.3 Create `components/tools/EffectivenessBlock.tsx`: 3 rows (why / what it systematizes / measured impact), with null-honest handling for "impact".
- [ ] 7.4 Data file: inline in `app/(marketing)/tools/page.tsx` or new `content/tools.ts`. Two entries: claude-shiploop (github.com/ruslan4427/claude-shiploop, scorecard metrics from `scorecard.json`), ui-ux-pro (github.com/ruslan4427/ui-ux-pro, measurement = null + reason).
- [ ] 7.5 Replace `/tools` page content: remove `ScorecardTable` + `ScorecardMethodology` imports. Keep the files on disk under components/tools/ (short-term — they describe the current scorecard, might reappear).
- [ ] 7.6 Update any navigation references if /tools was linked under a different label elsewhere.
- [ ] 7.7 Verify page renders, both GH links work (external links tracked via ExternalLinkTracker already).
- [ ] 7.8 Contrast check EffectivenessBlock text styles.

## Phase 8 — QA pass

- [ ] 8.1 `pnpm build` + `pnpm verify:numbers` passes.
- [ ] 8.2 Scorecard snapshot CI passes locally (`.github/workflows/scorecard-snapshot.yml` dry run).
- [ ] 8.3 All 5 case studies render; hero scorecard renders where TokenScorecard data exists.
- [ ] 8.4 BuildTimeline renders on 4 cases; absent on noble-saas + fieldmark + angel.
- [ ] 8.5 AgentReplay renders on smm-factory only; step-advance works via click + keyboard; reset works.
- [ ] 8.6 /tools shows two tool cards; no scorecard; both GH links open the right repos.
- [ ] 8.7 `prefers-reduced-motion` behavior: BuildTimeline static, AgentReplay transitions off but highlight still works.
- [ ] 8.8 Lighthouse a11y check on /tools, /work/smm-factory, /work/hrekov-dev — no regressions vs Sprint 15 baseline.
- [ ] 8.9 Vercel Toolbar axe check on new pages — zero new violations.

## Phase 9 — Ship

- [ ] 9.1 Append DEVLOG entry (Problem/Decision/Result/Lesson) for Sprint 16.
- [ ] 9.2 Promote any crystallized patterns to STABLE_LOGIC.md (likely: "replayable component data lives in a sibling .ts file imported by the component" if that pattern holds).
- [ ] 9.3 Write `memory/iteration-16.md`.
- [ ] 9.4 Update `MEMORY.md` index.
- [ ] 9.5 Final commit, push to main (gate on explicit approval per `feedback_pause_at_public_gates`).
- [ ] 9.6 Verify Vercel production deploy green.
- [ ] 9.7 Verify scorecard-snapshot workflow passes on main.

## Sprint-close checklist

- [ ] All 9 phases complete.
- [ ] `verify:numbers` green.
- [ ] CI green (scorecard-snapshot + any blog publish checks).
- [ ] A11y: no new axe violations on touched pages.
- [ ] DEVLOG + MEMORY + STABLE_LOGIC updated.
- [ ] Angel case study untouched (per spec §3 Out).
- [ ] ui-ux-pro repo public with README.
