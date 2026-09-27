# Tasks — Sprint 11 · Blog foundation + case study L2/L3 + GA4

Sequential within a phase; phases can overlap where marked. Each task
small enough to verify in isolation. TaskList IDs assigned when each
sub-task is created.

---

## Phase A — Blog foundation (task #72 primary)

- [ ] **A1.** Create `content/blog/_types.ts` — export `BlogFrontmatter`,
  `BlogFormat`, `Artifact*`, `DistributionChannel` types per plan §2.1.
- [ ] **A2.** Create `content/blog/index.ts` — `getBlogPosts`,
  `getBlogPost(slug)`, `getFeaturedBlogPosts`. Validation throws on invalid
  frontmatter. Mirrors `content/case-studies/index.ts` pattern.
- [ ] **A3.** Create `content/blog/.gitkeep` (empty directory placeholder).
  MDX files land in Phase D.
- [ ] **A4.** Create `app/(marketing)/blog/page.tsx` — Server Component,
  metadata, SectionBadge "Journal", MaskReveal H1 (copy Ruslan-approved),
  sub-headline, `<FeaturedGrid>`, `<ChronologicalList>`, empty state.
- [ ] **A5.** Create `components/blog/PostCard.tsx` — featured card, format
  badge instead of role tag, matches ProjectCard shell.
- [ ] **A6.** Create `components/blog/PostRow.tsx` — compact chronological
  row: `YYYY-MM-DD · [format] · [title] · [tagline]`.
- [ ] **A7.** Create `app/(marketing)/blog/[slug]/page.tsx` — mirrors
  `work/[slug]/page.tsx`. `generateStaticParams`, `generateMetadata`,
  `BlogPosting` JSON-LD, BackToJournal, header, `<BlogPostBody>`,
  `<Artifacts>`, related links.
- [ ] **A8.** Create `app/(marketing)/blog/[slug]/loading.tsx` and
  `not-found.tsx` — mirror `work/[slug]/`.
- [ ] **A9.** Create `components/layout/BackToJournal.tsx` — clone
  BackToWork, href `/blog`, label "Journal".
- [ ] **A10.** Create `components/mdx/BlogPostBody.tsx` — format-driven
  container width, registers custom MDX components.
- [ ] **A11.** Create `components/mdx/BlogComponents.tsx` — `<Artifact>`,
  `<Cost>`, `<PromptLog>`, `<Diff>`, `<TechnicalDetail>`.
- [ ] **A12.** Create `app/(marketing)/blog/opengraph-image.tsx` — reuse
  `lib/og-template.tsx` + `lib/og-fonts.ts`.
- [ ] **A13.** Create `app/rss.xml/route.ts` — Route Handler, static
  regen hourly, RSS 2.0 with CDATA descriptions.
- [ ] **A14.** Extend `app/layout.tsx` — RSS autodiscovery `<link>`.
- [ ] **A15.** Extend `app/sitemap.ts` — include blog posts with per-post
  `lastmod` (`updatedAt || publishedAt`).
- [ ] **A16.** Extend `components/layout/Nav.tsx` — add "Journal" link
  between Work and About, prefix-match `/blog` for active state.

**Checkpoint A:**
- `npx tsc --noEmit` clean.
- `curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/blog` → 200.
- `curl -sI http://localhost:3000/rss.xml` → 200 + `application/rss+xml`.
- `/blog` empty state renders (no posts yet).
- Nav shows "Journal" link, active on `/blog`.
- Sitemap includes no blog entries yet (correct — no posts).

## Phase B — Case study L2/L3 + toggle (task #72 continues)

- [ ] **B1.** Extend `content/case-studies/_types.ts` — add
  `recruiterSummary`, `supportingArtifacts`, `devlogRefs` fields, all
  optional.
- [ ] **B2.** Extend `content/case-studies/index.ts` loader — parse and
  validate new fields.
- [ ] **B3.** Create `components/case-study/ArtifactList.tsx` — type-
  specific rendering (commit, pr, screenshot, cost, timeline, prompt, link).
- [ ] **B4.** Create `components/case-study/DevlogRefs.tsx` — expanded
  list in Technical view, single-link summary in Executive.
- [ ] **B5.** Create `components/case-study/ViewToggle.tsx` — Client
  Component, `useState` + `localStorage` sync, sticky pill top-right.
- [ ] **B6.** Refactor `app/(marketing)/work/[slug]/page.tsx` — wrap
  `<article data-view="executive">`, mount `<ViewToggle>`, surface
  `recruiterSummary`, extract stats strip, render `<ArtifactList>` +
  `<DevlogRefs>`.
- [ ] **B7.** Extend `app/globals.css` — view-mode CSS rules
  (`[data-view="executive"] [data-mode="technical"] { display: none }`
  etc.).
- [ ] **B8.** Backfill `content/case-studies/noble-saas.mdx` — populate
  `recruiterSummary` (Ruslan draft), 5-10 `supportingArtifacts`, 3-5
  `devlogRefs`, mark 2-3 `<TechnicalDetail>` sections in body.

**Checkpoint B:**
- `/work/noble-saas` renders in Executive mode by default.
- Toggle to Technical: `<TechnicalDetail>` blocks expand, `<ArtifactList>`
  shows detail, `<DevlogRefs>` expands.
- Toggle persists across page reloads and other case studies via localStorage.
- Other 4 case studies render normally (Executive/Technical toggle visible
  but has no effect since they have no L2/L3 data yet — acceptable for v1).
- No visual regressions on `/work/[slug]` for non-backfilled studies.

## Phase C — Analytics (task #72 continues)

- [ ] **C1.** Create `lib/consent-geo.ts` — `EU_COUNTRIES` set (27 EU +
  UK + Norway + Iceland + Liechtenstein + Switzerland).
- [ ] **C2.** Create `middleware.ts` at repo root — reads
  `x-vercel-ip-country`, sets `geo-eu` cookie, correct matcher.
- [ ] **C3.** Create `lib/consent.ts` — `getConsentState`, `setConsent`,
  `resetConsent`, `isEuVisitor` client-side helpers.
- [ ] **C4.** Create `components/analytics/ConsentContext.tsx` — React
  context provider for consent state.
- [ ] **C5.** Create `components/analytics/GA4.tsx` — conditional gtag
  loader, guarded by context.
- [ ] **C6.** Create `components/analytics/PageViews.tsx` — App Router
  page-view tracking on `usePathname` change.
- [ ] **C7.** Create `components/analytics/ConsentBanner.tsx` — bottom
  card, Accept/Reject, focus trap, no Escape dismiss.
- [ ] **C8.** Create `lib/analytics.ts` — `track(event, params)` helper.
- [ ] **C9.** Extend `app/layout.tsx` — mount `<ConsentProvider>`,
  `<GA4>`, `<PageViews>`, `<ConsentBanner>`; add GSC verification meta
  tag guarded by env var.
- [ ] **C10.** Extend `components/layout/Footer.tsx` — add "Reset
  analytics preference" muted link.
- [ ] **C11.** Instrument events:
  - `blog_post_read` via IntersectionObserver marker in `BlogPostBody`
  - `case_study_view_toggle` in `ViewToggle` (Phase B)
  - `contact_form_submit` in `ContactForm` on success return
  - `external_link_click` via delegated listener in root layout
- [ ] **C12.** Extend `.env.example` — add `NEXT_PUBLIC_GA_ID` and
  `NEXT_PUBLIC_GSC_VERIFICATION` (documented as public, not secret).
- [ ] **C13.** Document in `README.md`:
  - How to create a GA4 property + get Measurement ID
  - How to verify with GSC (create account → HTML tag method → paste token)
  - How to submit sitemap in GSC UI
  - How to test consent banner locally (set `geo-eu=1` cookie in DevTools)

**Checkpoint C:**
- With `NEXT_PUBLIC_GA_ID` unset: no gtag script in `<head>`, no banner.
- With `NEXT_PUBLIC_GA_ID` set + `geo-eu=0` cookie: gtag loads, no banner.
- With `NEXT_PUBLIC_GA_ID` set + `geo-eu=1` cookie: banner shows, gtag
  does NOT load until Accept clicked.
- Accept → gtag loads, banner dismisses, `consent=accepted` cookie set.
- Reject → gtag does NOT load, banner dismisses, `consent=rejected` cookie set.
- Reset link in Footer clears both cookies, next reload shows banner again.
- GA4 Real-Time report shows custom events after smoke test.

## Phase D — First seed post + verify

- [ ] **D1.** Ruslan drafts outline for
  `content/blog/2026-09-27-launching-the-journal.mdx` (meta post about
  building this system).
- [ ] **D2.** Claude edits draft to pass style-guide checklist (≥8/10).
  Populate real artifacts: Sprint 10 style guide link, Sprint 11 spec
  commit hash, research subagent cost.
- [ ] **D3.** Commit + push to Vercel preview branch.
- [ ] **D4.** Preview smoke test:
  - `/blog` shows the post in Featured (if `featured: true`) + Chronological
  - `/blog/2026-09-27-launching-the-journal` renders correctly
  - `/rss.xml` includes the post, validates on validator.w3.org/feed
  - Sitemap includes the post URL
  - JSON-LD passes Google Rich Results test
  - OG image renders on Twitter card validator
- [ ] **D5.** Merge to main → production deploy.
- [ ] **D6.** Post-ship smoke test on hrekov.dev:
  - GA4 Real-Time report captures visits, custom events fire on
    scroll/toggle/submit
  - GSC picks up sitemap within 48h (check `Coverage` report next session)
- [ ] **D7.** Append `Problem/Decision/Result/Lesson` to `DEVLOG.md`.
- [ ] **D8.** Promote stable rules to `STABLE_LOGIC.md`:
  - Consent banner must focus-trap on mount + not dismiss on Escape
  - Middleware writes geo-cookie; components read cookie (not header)
  - Blog frontmatter validates at build time — invalid post fails build
- [ ] **D9.** Update `CLAUDE.md` file layout section to include new
  routes + directories.
- [ ] **D10.** Save `memory/iteration-11.md` — what shipped, what was
  hard, what to reuse for Sprint 12.

**Checkpoint D:**
- Sprint 11 acceptance criteria (spec §11) all satisfied.
- Task #72 marked complete.
- Task #73 (Sprint 12) unblocked.

---

## Cross-cutting reminders

- **Every new fg/bg pair** — run `python3 /Users/ruslan/.claude/skills/ui-ux-pro/scripts/check_contrast.py` before commit.
- **Every new page** — verify with SkipToMain, focus rings, `<label>`
  associations.
- **Every animation** — respect `prefers-reduced-motion`.
- **Every commit** — no emoji unless explicitly requested; no adding new
  color tokens; no arbitrary `rounded-[Npx]` (use `--radius-*`).
- **After each phase** — DEVLOG entry (Problem/Decision/Result/Lesson).
