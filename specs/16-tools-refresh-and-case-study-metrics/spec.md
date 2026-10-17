# Spec — Sprint 16 · `/tools` refresh + case-study metrics upgrade

**Class.** L (new external repo publication, new frontmatter schema, 3 new components incl. interactive replay, 4+ case studies touched, multi-day)
**Date.** 2026-10-16
**Owner.** Ruslan (strategic decisions, OSS rename call, phase annotation), Claude Opus/Sonnet (implementation, parser extension, components).

---

## 1. Why this exists

Sprint 15 shipped `/tools` as a **scorecard page** — seven projects × five metrics, methodology below. The intent was "show your work." The feedback: `/tools` should actually list the **tools we built**, not grade portfolio projects. Scorecard grading was the right receipt for the OSS launch post; it is the wrong permanent inhabitant of a page named `/tools`.

Downstream of that: the scorecard **does** belong somewhere, just inside the individual case study it describes. Right now `TokenScorecardAside` sits as a side-rail element on `/work/<slug>`. The user wants it promoted to a hero block at the top of each study, with a **timeline+phase breakdown** visualization under it so the reader can see where hours and tokens went across the build.

And one layer deeper: three of the case studies (smm-factory confirmed, angel confirmed-but-deferred-to-later-sprint, hrekov-dev as meta) describe multi-agent architectures that the current MDX prose can only sketch. The user wants an interactive component that lets a reader **click through the agents step-by-step** — orchestrator dispatches, agent A returns, UI reflects the state transition — so the architecture is readable without the reader having to parse paragraphs.

## 2. What must stay the same

- Monochrome editorial design. No new chromatic accents. Green dot = availability only.
- Scorecard data pipeline. The `scorecard.json` artifact at the root stays; its generator in `scripts/scorecard-src/` + `~/shiploop-publish/lib/` stays canonical. Extensions to the output shape are additive, not breaking.
- `null-is-honest`. New per-day / per-phase fields are nullable; if data isn't reconstructable, the dash is the finding.
- Vendored-vs-canonical pattern locked in Sprint 15. All parser changes land in `~/shiploop-publish/lib/` first, then sync to `scripts/scorecard-src/` + regenerate.
- `verify:numbers` prebuild hook. Any new source-of-truth count that appears in copy must be verifiable at build time.
- `TokenScorecardAside` stays as the atomic data block. We *reposition and resize* it — we don't replace its data model.
- Angel case study is **not touched** this sprint (user explicit: "Angel не чіпаємо").

## 3. Scope

### In

1. **`/tools` page rewrite.** Replace `ScorecardTable` + `ScorecardMethodology` with a **ToolsBuilt list**: each tool a card with GitHub link, one-paragraph description, and an "effectiveness" block (why it exists, what it systematizes, measured impact where available). Two tools at launch: `claude-shiploop` (public, has scorecard measurements) and `ui-ux-pro` (public once renamed+republished, null measurements per null-is-honest).

2. **`ui-ux-pro` OSS publication.** Rename the currently private `ui-ux-skill` GitHub repo per decision §5.4, strip portfolio-specific references, add MIT license + README + INSTALL, publish, link from `/tools`. Measurement block ships as null-honest (no retroactive measurement — reason captured in README).

3. **Case-study hero scorecard.** Move `TokenScorecardAside` from side-rail to full-width hero block at the top of each `/work/<slug>` page. Resize typographic scale upward. Applies to all five case studies that render it. No new data — reposition only.

4. **Combined timeline + phase graph.** One new component — `BuildTimeline` — rendering phases as horizontal colored bands with per-day commit/token density overlay. Shown only on case studies where phase data is annotated AND token data is non-null: **smm-factory, hrekov-dev, claude-shiploop, lexora** (four). Data source: new `phases[]` array in case-study frontmatter + new `daily[]` field in `scorecard.json`.

5. **Interactive agent replay component.** One new component — `AgentReplay` — rendering named agents as SVG nodes, dispatches as edges, step-advance by click. Scoped to **smm-factory only** this sprint. Angel deferred — architecture validated here first.

### Out

- Angel case study agent diagram (deferred to Sprint 17 after smm-factory pilot validates the component architecture).
- Noble-saas, fieldmark: no phase breakdown (pre-ShipLoop sessions, null tokens, phase reconstruction unreliable). Hero scorecard with complexity+duration+tier only.
- Retroactive measurement for ui-ux-pro. We ship it with honest null measurements and a reason.
- No change to `scorecard.json`'s existing fields. Daily/phase data is additive.
- No new design tokens. Phase colors reuse existing `--ink-*` ramp.
- No change to `/work` index page.

## 4. Audience impact

- **Claude-devs** (secondary audience) — `/tools` becomes a cloneable tool shelf instead of a measurement artifact. Lowers friction from "cool portfolio" to "I'll install claude-shiploop." Scorecard-as-receipt moves closer to the case study it describes.
- **Recruiters** (primary audience) — hero scorecard + build timeline reads as "measured engineering" without requiring the reader to click into methodology. Phase breakdown surfaces the shape of a real build (research → build → QA → ship) in a form a non-technical reader can parse at a glance.
- **Self** — AgentReplay prototype on smm-factory becomes the template for angel next sprint, and (optionally) for new case studies going forward.

## 5. Design decisions (resolved during spec)

### 5.1 Phase annotation lives in frontmatter

Phases are **manually declared per case study** in a `phases` array under `tokenScorecard`. Each phase: `{ name, from, to }`. Rejected: auto-derivation from git commit prefix groups (garbage data), auto-derivation from DEVLOG headings (fragile — DEVLOGs are freeform).

Rationale: semantic phase names ("Discovery", "Build", "QA", "Ship") aren't in git history; author is the only reliable source. Four case studies × ~4 phases each = 16 entries total — trivial authoring cost. Schema stays null-safe: no `phases` → no breakdown rendered.

### 5.2 Per-day token data generated at scorecard-parse time

Scorecard parser (`~/shiploop-publish/lib/parse-tokens.ts` + mirror in `scripts/scorecard-src/`) extends to emit a `daily[]` array per project: `{ date, tokens, commits }`. Source: existing JSONL walk + git log walk (both already in the parser). Null if no session data (pre-ShipLoop projects).

Rejected: runtime JSONL read in the Next.js build (duplicate work, bloats build), commit-counts-only (poor signal for ShipLoop projects where discipline is in planning, not committing).

### 5.3 AgentReplay = simple state machine, SVG visual

Linear step array with React `useState` index. No XState. Visual: SVG nodes (agents) + edges (dispatches), active edge highlighted per step, side panel shows the "payload" (what passed between agents) for the current step. Buttons: ← Step | Reset | Step →. Keyboard: arrow keys.

Rationale: four steps per flow, strictly linear — a state machine library adds API surface without value. Framer Motion already in stack for edge/node transitions.

### 5.4 `ui-ux-pro` repo keeps its name on publication

Current private repo: `ui-ux-skill`. On publication, rename to `ui-ux-pro` so the repo name matches the skill id (`/ui-ux-pro`). Rejected: `claude-skill-ui-ux-pro` (verbose, no SEO win), `shiploop-ui` (misleading — not a shiploop component), `claude-ui-ux` (drops the `-pro` suffix that's already part of the skill brand).

Rationale: zero cognitive overhead for installers — `git clone github.com/ruslan4427/ui-ux-pro ~/.claude/skills/ui-ux-pro` reads obviously.

## 6. Non-decisions (deferred)

- Whether angel case study gets `AgentReplay` next sprint — depends on how smm-factory pilot lands.
- Whether `BuildTimeline` eventually replaces `TokenScorecardAside` entirely — not now; the aside is the quantitative receipt, timeline is the shape. Different jobs.
- Whether `/tools` eventually hosts third-party tool recommendations in addition to our own — out of scope.
- Future ui-ux-pro effectiveness measurement — would need retroactive session tagging which doesn't exist yet. If a measurement rig lands later, backfill then.

## 7. Success criteria

1. `/tools` lists two tools (claude-shiploop + ui-ux-pro), both with working GitHub links.
2. `ui-ux-pro` is a public GitHub repo under `github.com/ruslan4427/ui-ux-pro`, MIT, README documents install path.
3. Scorecard page is removed from `/tools` and not reachable at that path.
4. All five case studies show the hero scorecard at the top (where TokenScorecard data exists).
5. `BuildTimeline` renders on smm-factory, hrekov-dev, claude-shiploop, lexora with correct phase bands and per-day density.
6. `AgentReplay` renders on smm-factory with four clickable agents and step-advance working under keyboard and click.
7. `prefers-reduced-motion` respected on all new motion.
8. Contrast verified on every new fg/bg pair.
9. `verify:numbers` passes; new counts (if any copy references them) sourced from disk.
10. Scorecard snapshot CI remains green; schema change is additive.
