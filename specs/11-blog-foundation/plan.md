# Plan — Sprint 11 · Blog foundation + case study L2/L3 + GA4

Reads with `spec.md`. WHAT/HOW is here; WHY is in spec.

---

## 1. Order of operations

```
A. Blog foundation           (routes + MDX pipeline + RSS + sitemap)
B. Case study L2/L3 + toggle (schema extension + view mode + backfill)
C. Analytics                 (GA4 + geo-gated consent + GSC verification)
D. First seed post + verify  (Sprint 10-11 meta post, ship + smoke test)
```

Rationale for this order:

- **A first** — blog routes are the foundation. Everything else assumes they
  exist (analytics events reference blog paths, seed post needs the route).
- **B second, independent of A** — case study upgrade could ship
  independently, but bundling avoids two separate reviews. Also, the seed
  post in Phase D will reference the upgraded noble-saas case study — so
  B must land before D.
- **C third** — GA4 events reference blog + case study interactions from
  A/B. Middleware + consent banner can be smoke-tested in isolation but
  the full event story needs A/B in place.
- **D last** — a seed post that ships before the pipeline is complete is
  a broken shop window.

## 2. Foundation touched by all phases

### 2.1 `content/blog/_types.ts` — NEW

Locked frontmatter shape from spec §5:

```ts
export type BlogFormat = "case-study" | "build-log" | "skeptic" | "pattern";

export type ArtifactType =
  | "commit" | "pr" | "screenshot" | "prompt"
  | "cost" | "timeline" | "link";

export type Artifact = {
  type: ArtifactType;
  label: string;
  href?: string;
  detail?: string;
};

export type DistributionChannel = {
  scheduledFor?: string;      // ISO 8601
  status: "pending" | "posted" | "manual";
};

export type BlogFrontmatter = {
  title: string;
  slug: string;
  tagline: string;
  publishedAt: string;        // YYYY-MM-DD
  updatedAt?: string;
  format: BlogFormat;
  tags: string[];
  readingTime: number;        // minutes
  featured: boolean;
  canonical?: string;
  distribution?: {
    linkedin?: DistributionChannel;
    devto?: DistributionChannel;
    twitter?: { status: "manual" };
  };
  artifacts?: Artifact[];
  related?: string[];         // slugs
};
```

### 2.2 `content/blog/index.ts` — NEW

Loader following the pattern of `content/case-studies/index.ts`:

- `getBlogPosts()` — reads all `content/blog/*.mdx`, parses frontmatter,
  filters `publishedAt <= today`, sorts by `publishedAt` desc.
- `getBlogPost(slug)` — returns `{ frontmatter, source }` or `null`.
- `getFeaturedBlogPosts()` — filter `.featured === true`.
- **Validation at load time** — throws on missing required fields, invalid
  `format`, duplicate slug. Throws are caught in `generateStaticParams`
  gracefully (log + skip) but surface loudly in `getBlogPost` (build fail).

### 2.3 `content/blog/` seed directory

Directory exists with a single `.gitkeep` at Phase A ship. First real
post lands in Phase D.

### 2.4 `next.config.ts` — VERIFY, no change expected

Existing MDX plugin config (`@next/mdx` or similar) should already handle
`content/blog/*.mdx` via the same loader as case studies. If not, extend
the include glob.

## 3. Phase A — Blog foundation

### 3.1 Loader + types (2.1, 2.2, 2.3) — first

Prep before any route.

### 3.2 `app/(marketing)/blog/page.tsx` — NEW

Server Component. Composition (per spec §6):

- Metadata: `title: "Journal"`, `description: <curated line>`
- SectionBadge "Journal"
- MaskReveal H1 "Notes from the workbench." (or Ruslan-approved variant
  — I propose 3 options in the plan phase before committing)
- Sub-headline (~1-2 sentences)
- `<FeaturedGrid posts={getFeaturedBlogPosts()} />`
- `<ChronologicalList posts={getBlogPosts()} />`
- Empty state (until first post): muted "Coming soon" line, no fake card

### 3.3 `components/blog/PostCard.tsx` — NEW

Feature-post card. Same rounded shell + hairline border as ProjectCard,
but with format-label badge (Case Study / Build Log / etc.) instead of
role tag. Links to `/blog/[slug]`.

### 3.4 `components/blog/PostRow.tsx` — NEW

Compact row for chronological list. Layout:
`YYYY-MM-DD · [format badge] · [title] · [tagline muted]`. Single
horizontal line on wide, stacks on narrow.

### 3.5 `app/(marketing)/blog/[slug]/page.tsx` — NEW

Mirrors `app/(marketing)/work/[slug]/page.tsx` structure:

- `generateStaticParams` from `getBlogPosts()`
- `generateMetadata` from frontmatter
- Article JSON-LD (`BlogPosting`)
- BackToJournal pill (see 3.7)
- Header block (SectionBadge with format label, MaskReveal title, tagline,
  meta line, tag pills)
- `<BlogPostBody source={source} format={frontmatter.format} />` — thin
  wrapper picking the format-appropriate shell (see 3.8)
- `<Artifacts artifacts={frontmatter.artifacts} format={format} />` — only
  if artifacts non-empty
- Related links (manual `related: [slug]`)
- No CTA footer — layout Footer card is sole closer.

### 3.6 `app/(marketing)/blog/[slug]/loading.tsx` and `not-found.tsx` — NEW

Mirror `app/(marketing)/work/[slug]/loading.tsx` and `not-found.tsx`.
loading = MDX-bundle skeleton (badge/title/tagline/body pulse). not-found
= SectionBadge + Playfair H1 + "Back to Journal" CTA.

### 3.7 `components/layout/BackToJournal.tsx` — NEW

Clone of `BackToWork.tsx` with `/blog` href and label "Journal".

### 3.8 `components/mdx/BlogPostBody.tsx` — NEW

Thin wrapper over the existing `CaseStudyBody`. Selects container class
by format:

- `case-study` — `max-w-[65ch]` prose column
- `build-log` — `max-w-[65ch]` denser prose (looser leading, smaller top
  margin on H2)
- `skeptic` — `max-w-[70ch]` wider essay column
- `pattern` — `max-w-[65ch]` + right-side sticky TOC on `>=lg` (Sprint 11
  ships with placeholder; TOC extraction from headings is a nice-to-have,
  can be a follow-up if time constrained)

Registers custom MDX components: `<Artifact>`, `<Cost>`, `<PromptLog>`,
`<Diff>`, `<TechnicalDetail>` (see 3.9).

### 3.9 `components/mdx/BlogComponents.tsx` — NEW

Custom MDX components:

- `<Artifact type="commit|pr|..." label href>` — inline pill with icon
- `<Cost label value>` — small metric card, e.g. `"Tokens: 4.2M · $52"`
- `<PromptLog title>...</PromptLog>` — `<details>` block, monospace body,
  copy-to-clipboard button on the summary
- `<Diff before after>` — side-by-side or unified diff view (unified
  simpler for v1)
- `<TechnicalDetail>` — wrapper that stays open in Technical view,
  collapses in Executive view. Uses `data-mode="technical"` attribute
  so the CSS-driven case-study toggle also works here if we ever nest
  a case-study inside a blog post (unlikely but future-proofs).

### 3.10 `app/(marketing)/blog/opengraph-image.tsx` — NEW

Per-slug OG. Reuse `lib/og-template.tsx` and `lib/og-fonts.ts` (already
solved by Sprint 9). Layout: format label + title + tagline + hrekov.dev
footer.

### 3.11 `app/(marketing)/blog/twitter-image.tsx` — OPTIONAL

If OG image is inherited by Twitter cards, this is redundant. Verify
with `curl -s -H "User-Agent: Twitterbot" https://.../` after ship.

### 3.12 `app/rss.xml/route.ts` — NEW

Route Handler:

```ts
export const dynamic = "force-static";
export const revalidate = 3600;  // regen hourly

export async function GET() {
  const posts = await getBlogPosts();
  const xml = renderRss(posts);
  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
```

`renderRss` — plain-string builder, no library needed (RSS 2.0 is small).
Escapes `&`, `<`, `>` in text; wraps `description` in CDATA.

### 3.13 `app/layout.tsx` — EXTEND

- Add RSS autodiscovery `<link rel="alternate" type="application/rss+xml">`
- (Phase C also touches this — GA4 script + ConsentGate + GSC meta tag)

### 3.14 `app/sitemap.ts` — EXTEND

Include all blog posts. Reuse existing pattern (async, per-post lastmod).

### 3.15 `components/layout/Nav.tsx` — EXTEND

Add "Journal" link between Work and About. Active state via `usePathname`
prefix match (`/blog` and `/blog/[slug]` both light up).

## 4. Phase B — Case study L2/L3 + toggle

### 4.1 `content/case-studies/_types.ts` — EXTEND

Add fields per spec §8.1: `recruiterSummary`, `supportingArtifacts`,
`devlogRefs`. All optional to preserve backwards compat with existing 5
case studies until they're each backfilled.

### 4.2 `content/case-studies/index.ts` — EXTEND

Parse new fields; validate `supportingArtifacts.type` against the allowed
literal union.

### 4.3 `components/case-study/ArtifactList.tsx` — NEW

Renders `supportingArtifacts`. One line per artifact in Executive view
(compact, links only); expanded block per artifact in Technical view.
Type-specific rendering:

- `commit` — link with `#abc1234` monospace slug
- `pr` — link with `#123` badge
- `screenshot` — link + small thumbnail if `href` is an image URL
- `cost` — inline metric ("$52 · 4.2M tokens")
- `timeline` — inline metric ("4 days · est. 3 weeks")
- `prompt` — collapsible block with the prompt text
- `link` — plain link

### 4.4 `components/case-study/DevlogRefs.tsx` — NEW

Renders `devlogRefs`. Executive view: single line
"Full process log (12 entries) →" links to Technical view.
Technical view: expanded list, each entry `YYYY-MM-DD · [heading] · summary`.
Links to DEVLOG.md anchors on GitHub if `href` set.

### 4.5 `components/case-study/ViewToggle.tsx` — NEW (Client Component)

- Two-state pill ("Executive · Technical")
- State in `useState`, sync to `localStorage` key `caseStudyView` on change
- On mount: read `localStorage`, default to `executive`
- On click: toggle state, update `<article data-view>` attribute
- Sticky at top-right below Nav (`sticky top-16`, `z-20`)
- No animation on toggle (instant swap via CSS `display: none`)

### 4.6 `app/(marketing)/work/[slug]/page.tsx` — REFACTOR

- Wrap `<article>` with `data-view="executive"` attribute (initial value;
  ViewToggle overrides on client)
- Inject `<ViewToggle />` at top
- Render `recruiterSummary` block before `CaseStudyBody` (surface at top)
- Extract key stats from `supportingArtifacts` (`type: cost | timeline`)
  into a small stats strip below the header
- Render `<ArtifactList />` in a right sidebar on `>=lg`, inline below
  body on `<lg`
- Render `<DevlogRefs />` after the body

### 4.7 `app/globals.css` — EXTEND

Add view-mode CSS:

```css
[data-view="executive"] [data-mode="technical"] { display: none; }
[data-view="executive"] .artifact-detail { display: none; }
[data-view="executive"] .devlog-full { display: none; }
[data-view="technical"] .devlog-summary { display: none; }
```

### 4.8 `content/case-studies/noble-saas.mdx` — BACKFILL

Populate `recruiterSummary` (Ruslan drafts, Claude edits), 5-10
`supportingArtifacts`, 3-5 `devlogRefs`. Also mark 2-3 sections in the
body with `<TechnicalDetail>` wrappers where the current text goes too
deep for an Executive reader.

## 5. Phase C — Analytics

### 5.1 `middleware.ts` — NEW (root)

```ts
export function middleware(req: NextRequest) {
  const country = req.headers.get("x-vercel-ip-country") ?? "";
  const isEu = EU_COUNTRIES.has(country);
  const res = NextResponse.next();
  res.cookies.set("geo-eu", isEu ? "1" : "0", {
    maxAge: 24 * 60 * 60,
    sameSite: "lax",
    path: "/",
  });
  return res;
}

export const config = {
  matcher: [
    // Skip static assets and API/RSC internals
    "/((?!_next/static|_next/image|favicon.ico|.*\\.[a-z0-9]+$).*)",
  ],
};
```

### 5.2 `lib/consent-geo.ts` — NEW

Exports `EU_COUNTRIES` set (27 EU + UK + Norway + Iceland + Liechtenstein
+ Switzerland). Small file, ~35 country codes.

### 5.3 `lib/consent.ts` — NEW

Client-side helpers:

- `getConsentState()` — returns `"accepted" | "rejected" | "unset"` from
  cookie
- `setConsent(state)` — sets cookie (365d TTL)
- `resetConsent()` — clears cookie
- `isEuVisitor()` — reads `geo-eu` cookie set by middleware

### 5.4 `components/analytics/GA4.tsx` — NEW (Client)

```tsx
"use client";
export function GA4({ id }: { id: string }) {
  const consent = useConsent();
  const isEu = useIsEu();
  const enabled = !isEu || consent === "accepted";
  if (!enabled) return null;
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${id}`}
              strategy="afterInteractive" />
      <Script id="ga4-init" strategy="afterInteractive">{`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${id}', { send_page_view: true });
      `}</Script>
    </>
  );
}
```

### 5.5 `components/analytics/PageViews.tsx` — NEW (Client)

Hooks `usePathname` + `useSearchParams`; on change, calls
`gtag('event', 'page_view', { page_path, page_title })`. Only mounted
when consent allows (guarded inside the component).

### 5.6 `components/analytics/ConsentBanner.tsx` — NEW (Client)

- Reads `useIsEu()` + `useConsent()`
- If not EU or consent already set: renders null
- Otherwise: card at `fixed bottom-4`, `max-w-2xl`, centered
- Two buttons: Accept (primary CTA style) + Reject (ghost hairline)
- `role="dialog"`, `aria-labelledby`, focus trap on mount
- On Accept: `setConsent("accepted")`, dismiss, reload the GA4 component
  (via a state bump in a shared context — or simpler, page reload; but
  reload is annoying, prefer the context bump)
- On Reject: `setConsent("rejected")`, dismiss

### 5.7 `components/analytics/ConsentContext.tsx` — NEW (Client)

Small React context wrapping consent state so `GA4` and `ConsentBanner`
share it and re-render on change without a page reload.

### 5.8 `app/layout.tsx` — EXTEND

- Mount `<ConsentProvider>` around the tree
- Mount `<GA4 id={NEXT_PUBLIC_GA_ID} />` and `<PageViews />` inside it
- Mount `<ConsentBanner />` inside it, above Footer
- Add `<meta name="google-site-verification" content={GSC_TOKEN} />` if
  `NEXT_PUBLIC_GSC_VERIFICATION` is set

### 5.9 `components/layout/Footer.tsx` — EXTEND

Add small muted "Reset analytics preference" link at bottom row.
Client-only handler that calls `resetConsent()` and refreshes.

### 5.10 Custom events

Small helper `lib/analytics.ts`:

```ts
export function track(event: string, params?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  window.gtag?.("event", event, params);
}
```

Call sites:

- `components/mdx/BlogPostBody.tsx` — `IntersectionObserver` on a marker
  75% down the body; fires `blog_post_read` once
- `components/case-study/ViewToggle.tsx` — fires
  `case_study_view_toggle` on click, param `to: "executive" | "technical"`
- `app/(marketing)/contact/actions.ts` — Server Action returns success →
  ContactForm fires `contact_form_submit` on client with intent param
- Root layout or a `<ExternalLinkTracker>` client component that listens
  for click events on `<a[href^="http"]>` where hostname !== hrekov.dev

### 5.11 Env vars

Add to `.env.example`:

```
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_GSC_VERIFICATION=
```

Neither is secret (both are exposed to client). Ruslan sets them in
Vercel → Environment Variables.

## 6. Phase D — First seed post + verify

### 6.1 `content/blog/2026-09-27-launching-the-journal.mdx` — NEW

Meta post about building this system. Ruslan drafts, Claude edits. Target:
Format `case-study` (this system IS the case study). Includes real
artifacts: link to Sprint 10 style guide, Sprint 11 spec, commit hashes
of the sprint's PRs, cost of the research subagent run.

Must pass style-guide checklist score >=8/10 before publish.

### 6.2 Smoke test

- Preview deploy on Vercel branch
- `curl -sI https://<preview>/blog` → 200
- `curl -sI https://<preview>/blog/2026-09-27-launching-the-journal` → 200
- `curl -s https://<preview>/rss.xml | head -50` — valid XML, contains
  the post
- Load `/work/noble-saas` → toggle Executive/Technical → both render
- Load a page from EU IP (VPN) → banner shows, GA4 does not fire until
  Accept clicked
- Load a page from non-EU IP → no banner, GA4 fires immediately
- GA4 Real-Time report shows: 1 page_view, 1 blog_post_read (after
  scrolling), 1 case_study_view_toggle (after clicking)

### 6.3 DEVLOG entry

Append `Problem/Decision/Result/Lesson` to `DEVLOG.md`. Promote any new
rule (e.g. consent-banner-focus-trap-required) to `STABLE_LOGIC.md`.

## 7. Copy that needs Ruslan approval before commit

- Blog index H1 (proposed: "Notes from the workbench.") — 3 alternatives
  in a follow-up before Phase A ships
- Blog index sub-headline (1-2 sentences)
- Consent banner copy (proposed one sentence, spec §10.2)
- Reset link label ("Reset analytics preference" or shorter alternative)
- noble-saas `recruiterSummary` (3 paragraphs) — Ruslan drafts, we edit
- First seed post outline — Ruslan approves before I draft body

## 8. Estimated size

- Phase A: ~12 new files, ~4 modified, ~600 LOC
- Phase B: ~5 new files, ~3 modified, ~350 LOC + backfill MDX
- Phase C: ~9 new files, ~2 modified, ~450 LOC + middleware
- Phase D: 1 MDX + verify

Total: ~30 files, ~1400 LOC. Roughly 4-6 focused sessions.
