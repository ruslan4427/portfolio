# Tasks — Sprint 12 · Portfolio meta case study (`hrekov-dev`)

Sequential within a phase; phases must complete in order (A → F). Each
task is small enough to verify in isolation. TaskList IDs assigned when
each sub-task is created.

Parent task in TaskList: **#74**.

---

## Phase A — Rails (route + skeleton, no prose)

- [ ] **A1.** Add 6th entry to `content/projects.ts` with slug `hrekov-dev`,
  `featured: false`, tags per plan §3.1. Use working `summary` — refine in C.
- [ ] **A2.** Cross-check `devlogRefs` heading text against actual DEVLOG.md
  headings (`grep -n '^## ' DEVLOG.md`). If any of the 4 planned entries
  don't match, adjust plan §3.2 or DEVLOG heading before A3.
- [ ] **A3.** Create `content/case-studies/hrekov-dev.mdx` with locked
  frontmatter block from plan §3.2 (title, tagline, publishedAt,
  recruiterSummary, supportingArtifacts, devlogRefs).
- [ ] **A4.** Add 10 empty `## Section` headings from spec §5 with 1-line
  placeholder per section (e.g. "TODO: cold open — meta angle, disarm
  self-obsession").
- [ ] **A5.** Verify route resolves: `curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/work/hrekov-dev` → 200.
- [ ] **A6.** Verify 6th project card renders on `/work` index; verify
  it does NOT render on home `<SelectedWork />` (featured: false).
- [ ] **A7.** Verify ExecutiveView renders `recruiterSummary` block at top;
  Technical view renders all supportingArtifacts + devlogRefs expanded.

**Checkpoint A:**
- Route 200, `/work` shows 6 cards, home shows 5.
- Both toggle states render without errors.
- Frontmatter parses cleanly (no build warnings).

## Phase B — Numbers guardrail

- [ ] **B1.** Create `scripts/verify-case-study-numbers.mjs` per plan §4.1:
  parse MDX frontmatter, extract `supportingArtifacts[].detail` numbers,
  compare against disk truth (DEVLOG heading count, STABLE_LOGIC heading
  count, memory file count, sprint count from git, days-span from git).
- [ ] **B2.** Handle memory-folder absence gracefully (Vercel deploy has
  no `~/.claude/`): script logs warning + skips memory checks, does not fail.
- [ ] **B3.** Add `"verify:numbers"` and `"prebuild"` scripts to
  `package.json` per plan §4.2.
- [ ] **B4.** Run `npm run verify:numbers` locally. Fix any mismatches by
  editing MDX numbers to match disk (source-of-truth is disk, not MDX).
- [ ] **B5.** Regression check: `npm run build` still succeeds
  (prebuild passes → build proceeds).
- [ ] **B6.** Sabotage test: intentionally break a number in MDX
  ("37.5%" → "50%"), rerun `npm run verify:numbers`, confirm exit code 1
  and clear error message. Revert.

**Checkpoint B:**
- Guardrail catches drift, produces readable error.
- Build clean when numbers match disk.

## Phase C — Prose draft (Claude drafts, Ruslan reviews)

Iterate section-by-section. After each draft, `open` the MDX so Ruslan
reads. Do NOT batch drafts.

- [ ] **C1.** Draft §1 Cold open (~150 words). Voice-setter — get right first.
- [ ] **C2.** Draft §3 Persistence layer (~250 words). Hero section.
- [ ] **C3.** Draft §7 What the machine produced (~200 words). Ties to guardrail.
- [ ] **C4.** Draft §5 Discipline (~150 words). Bridges to /about#stack — do
  NOT re-explain model routing.
- [ ] **C5.** Draft §6 Promotion rate (~250 words). Contrast with §7.
- [ ] **C6.** Draft §2 Stateless-model problem (~150 words).
- [ ] **C7.** Draft §4 MEMORY.md index (~150 words).
- [ ] **C8.** Draft §8 Context re-hydration saved (~150 words). Enumerate
  the 4-5 questions memory answers pre-emptively.
- [ ] **C9.** Draft §9 How to steal it (~200 words).
- [ ] **C10.** Draft §10 Recursive close (~100 words).
- [ ] **C11.** Read-through pass — total 1200-1800 words, kill any
  over-claiming, verify anti-flex framing intact.

**Checkpoint C:**
- MDX renders cleanly with real prose in all 10 sections.
- Total body ~1400 words (±300).
- Ruslan approves voice + register.

## Phase D — Artifacts embed

- [ ] **D1.** Embed §6.1 memory dir listing (`ls -1 memory/*.md | sort`)
  as ```text code block in the MDX at end of §2 or start of §3.
- [ ] **D2.** Embed §6.2 `feedback_css_cascade_first.md` verbatim as
  ```markdown code block in §3.
- [ ] **D3.** Embed §6.3 `MEMORY.md` first 10 lines verbatim in §4.
- [ ] **D4.** Draft §6.4 DEVLOG → STABLE_LOGIC diff. Ruslan picks the pair
  (or I propose one from `feedback_css_cascade_first`). Two side-by-side
  blockquotes in §6.
- [ ] **D5.** Insert §6.5 sprint cadence stat strip in §7. Inline JSX,
  3 stat blocks, hairline borders, mono type, no color.
- [ ] **D6.** Insert §6.6 auto-memory excerpt inside `<TechnicalDetail>`
  in §9. Attribution line above.
- [ ] **D7.** Verbatim-check: diff each embedded snippet against disk
  source. Update if drifted.

**Checkpoint D:**
- All 6 artifacts render in Technical view.
- `<TechnicalDetail>` collapses artifact 6 in Executive.
- Verbatim snippets match disk.

## Phase E — Cross-links

- [ ] **E1.** Edit `components/sections/AiStack.tsx` — add forward-link
  block per plan §7.1 after the stack grid.
- [ ] **E2.** In `hrekov-dev.mdx` §5 body, add `[/about#stack]` link.
- [ ] **E3.** In `hrekov-dev.mdx` §7 opening, add `[/work/noble-saas]` link.
- [ ] **E4.** Verify both directions resolve: click forward-link on
  `/about`, click backlinks in the MDX.

**Checkpoint E:**
- 3 cross-links resolve.
- No new nav items; existing Nav unchanged.

## Phase F — Ship verification (spec §11 walkthrough)

- [ ] **F1.** Batch 1 (automated): route 200, JSON-LD parses, OG image 200,
  verify:numbers passes, tsc clean, build clean, sitemap contains slug.
- [ ] **F2.** Batch 2 manual (browser): toggle switches, recruiterSummary
  in both views, 6 artifacts render, ≥4 devlogRefs render, 6 cards on
  /work but 5 on home, cross-links resolve, verbatim snippets match,
  a11y unchanged (no new components), reduce-motion unchanged, no
  visual regression on other 5 case studies + top-level routes.
- [ ] **F3.** Update `publishedAt` in frontmatter to actual ship date
  (2026-09-28 or whenever this lands).
- [ ] **F4.** Update numbers in `supportingArtifacts.detail` to current
  disk state (in case sprint count / memory count moved during draft).
  Re-run verify:numbers.
- [ ] **F5.** Commit: staged files = MDX + projects.ts + AiStack.tsx +
  scripts/ + package.json + specs/12-*/ (all 3 spec files).
  Commit message: "sprint 12: portfolio meta case study (hrekov-dev)".
- [ ] **F6.** Push to origin/main. Watch Vercel autobuild.
- [ ] **F7.** Batch 3 post-ship: `curl https://hrekov.dev/work/hrekov-dev`
  → 200, OG image resolvable, GA4 real-time sees pageview on manual visit.
- [ ] **F8.** Update TaskList: #74 → completed. Unblock #75.
- [ ] **F9.** Append DEVLOG entry (Problem/Decision/Result/Lesson) covering
  the meta case study ship. Meta-meta.

**Checkpoint F (ship gate):**
- All 17 spec §11 criteria pass.
- Prod URL live.
- DEVLOG updated.
- #74 closed; #75 unblocked.
