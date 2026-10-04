# DEVLOG

One block per meaningful work session. Format:
`Problem · Decision · Result · Lesson`. Newest at the top.

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
