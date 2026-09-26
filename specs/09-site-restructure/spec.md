# Spec — Sprint 9 · Site restructure (multi-page IA)

**Class.** L (new routes, new backend integration, > 3 files, changes IA)
**Date.** 2026-09-24
**Owner.** Ruslan (product decisions), Claude Opus (implementation)

---

## 1. Why this exists

Sprint 7 shipped a single-page scroll portfolio in the minimalist editorial
style. Content has since grown — 5 case studies, Services (6 formats),
HowItWorks (5 steps), Experience timeline, Testimonials — and everything
lives on `/`. Two problems:

1. **Weak scent for direct visitors.** A fractional client landing on `/`
   scans past the hero and sees a project grid, not "here is how I engage."
   A full-time hiring manager wants a resume-shaped page, not a scrollytell.
   The current IA optimises for a first-time visitor from Twitter, not for
   the two audiences the site actually needs to convert.
2. **No shareable deep links.** Ruslan can't send "here's my services page"
   or "here's my about page" — only anchor URLs (`/#stack`) that scroll
   arbitrarily. Search indexing collapses everything into one page.

Fix: split the content across dedicated routes with a real nav, keep the
home page as an editorial condensed pitch that funnels to the deep pages.
Add a dedicated `/contact` page with a form (backed by Resend) so inquiries
arrive as structured, categorised email rather than free-form `mailto:`.

## 2. What the site must feel like

Same visual system as Sprint 7 (minimalist editorial, monochrome + green
availability dot, Playfair Display display + Inter body, DotGrid canvas).
**No visual redesign.** This sprint is IA + one new backend integration.

The register must feel consistent across pages — every page shares the same
Nav, Footer, DotGrid, section-badge pattern, and card shell. A visitor
should not be able to tell a page was added later.

## 3. Site tree (locked)

```
/                       Home — condensed pitch for both audiences
/about                  Bio + experience timeline + AI-stack + values
/work                   Case study index (filterable by role/stack/year)
/work/[slug]            Individual case (existing, untouched by this sprint)
/services               Fractional engagement formats + full-time section
/contact                Form (name + email + intent + message) → Resend
```

Removed anchors from Nav: `#work`, `#stack`, `#contact` all become real
routes. `#top` link stays as a Back-to-top affordance in Footer.

## 4. Navigation

**Desktop Nav (Sprint 9):**

```
                                          [Work] [About] [Services] [Contact]
```

Same right-aligned pill layout as Sprint 7 Nav. Active state uses the same
rounded-full chip pattern. Active detection switches from
`IntersectionObserver` (section-based) to `usePathname` (route-based).

**Mobile Nav:** same overlay pattern, but each link routes to a page
instead of scrolling to a section. Same focus trap, Escape close, and
`body` overflow lock preserved.

**Footer Nav:** same 4 links reflected in the footer for symmetry, plus
socials + copyright row.

## 5. Home composition (reshuffle)

Order top → bottom, each section a teaser that links to its full page:

```
1. Hero                (unchanged from Sprint 8)
2. Selected Work       (3 featured cards + "View all →" link to /work)
3. What I Do           (3-card teaser of Services + "How I engage →" link)
4. How It Works        (5-step process, kept full — short enough)
5. Benefits            (3 pill cards, kept full — short enough)
6. Experience mini     (3 latest roles + "Full timeline →" link to /about)
7. Testimonials        (kept full — social proof belongs on home)
8. Dual CTA            (two rounded-full CTAs: "Book fractional call" →
                       /contact?intent=fractional · "Discuss full-time" →
                       /contact?intent=full-time)
9. Footer              (unchanged shell, socials + colophon)
```

**Removed from home:** the current Services section shows 6 cards + inline
CTA — that migrates to `/services`. Home replaces it with a 3-card teaser.
Experience currently shows the full timeline — that migrates to `/about`.
Home shows only the 3 latest roles.

**Kept full on home:** Hero, HowItWorks, Benefits, Testimonials. These are
short enough that splitting them out would add navigation cost with no
information gain.

**Orphan cleanup:** `components/sections/AboutStack.tsx` is not referenced
by `app/page.tsx` (verified). Delete it if `/about` doesn't reuse the shell.

## 6. `/contact` page (new)

**Layout:** same DotGrid + Nav + Footer chrome. Content column
`max-w-content` centered.

**Composition:**

- SectionBadge "Contact" (centered)
- Playfair Display display H1: "Let's talk." (centered, `clamp(48px, 8vw, 96px)`)
- Sub-headline paragraph (~1 sentence, `--ink-muted`, centered): sets
  expectation ("I reply within two business days" or similar).
- Form card (rounded-16, hairline border, `--bg-elevated`, `--shadow-card`,
  `max-w-lg` centered):
  - `Name` — text input, required
  - `Email` — email input, required, HTML5 pattern
  - `Intent` — select: "Fractional / consulting", "Full-time role",
    "Other / just saying hi". Defaults to `fractional`. Pre-selectable
    via `?intent=fractional|full-time|other` query param.
  - `Message` — textarea, min 20 chars, required, `rows=6`
  - Honeypot: hidden `_gotcha` text input, wrapped in
    `position: absolute; left: -9999px` — bots fill it, humans don't.
  - Submit button: black rounded-full pill matching existing CTA style,
    label "Send message". Disabled + shows "Sending…" during submission.
- Success state: card content replaced by a short confirmation
  (Playfair Display H2 "Thanks — I got it." + one Inter paragraph +
  "Back to home" link). No redirect — same URL, replaces card content.
- Error state: inline red-ink message under the submit button
  (`--ink-primary`, no colour palette expansion). Form values preserved.
- Alt contact: below the form card, small centred row —
  `rusgrekovua@gmail.com · GitHub · LinkedIn · X` — same styling as
  Footer socials, for users who prefer direct email.

**Behaviour:**

- Submission uses a Next.js 16 Server Action (`"use server"`) — no
  client-side `fetch` to a route handler, keeps bundle smaller.
- Server Action validates with a small hand-rolled schema (no Zod add — one
  file, four fields, not worth the dep). Rejects if honeypot is filled,
  if email pattern fails, or if message < 20 chars.
- On success: Resend `emails.send()` with:
  - `from`: `Ruslan Portfolio <contact@<sender-domain>>` (see §9 risk)
  - `to`: `CONTACT_TO_EMAIL` env var (defaults to `rusgrekovua@gmail.com`)
  - `reply_to`: submitted email — so hitting Reply goes to the sender
  - `subject`: `[Portfolio · ${intent}] ${name}`
  - Text body: labelled fields (Name, Email, Intent, Message).
- Rate limit: 5 submissions per IP per hour, in-memory `Map<ip, timestamps[]>`
  gated behind the Server Action. Cold starts reset it — acceptable for
  a portfolio (not defending against a determined attacker, just casual
  spam). If Ruslan later wants durable limits, swap in Upstash Ratelimit;
  not this sprint.
- No CAPTCHA. Honeypot + rate limit is the whole spam defence. Portfolio
  volume doesn't justify user friction.
- Reduce-motion respected: no entrance animation on the form card, no
  transition on success-state swap (opacity-only fade).

## 7. `/about` page (new)

**Layout:** same chrome. Content column mixed (`max-w-content` for
timeline, `max-w-2xl` for prose paragraphs).

**Composition:**

- SectionBadge "About" (centered)
- Playfair Display H1: "A studio of one, running with the model, not
  around it." (Same or evolved from AboutStack copy; final wording lives
  in this file only — copy softening happens in the plan, not spec.)
- Long-form bio (~3-4 paragraphs, Inter body, `max-w-2xl`). Content
  source: Ruslan supplies during implementation; placeholder from
  existing AboutStack + Hero bio expanded.
- **Experience timeline** — full version of what's currently on home's
  Experience section. Same visual pattern (year pill + role card).
- **AI stack** — Opus / Sonnet / Haiku matrix as three cards, same shell
  as ProjectCard. Content source: existing AboutStack `stack` array.
- **Values / How I work** — 3-4 short principles, each as a rounded card
  (matches Benefits shell). Content source: distilled from current
  Benefits + copy softened.

## 8. `/services` page (new)

**Layout:** same chrome. `max-w-content` grid.

**Composition:**

- SectionBadge "Services" (centered)
- Playfair Display H1: e.g. "How I engage." (final copy in plan)
- Sub-headline (~1-2 sentences): sets frame that these are fractional
  formats, not agency retainers.
- **Consulting formats** — 4-5 cards (rounded-16 shell). Suggested set
  (final list agreed with Ruslan in plan):
  1. **Discovery Sprint** — 2 weeks, $X. Deliverable: technical + product
     assessment + prioritised roadmap.
  2. **Fractional CTO / Tech Lead** — 2 days/week, monthly retainer.
     Deliverable: shipped features + team enablement.
  3. **Build Partner (AI-first)** — 1-3 month engagement, we ship a
     concrete deliverable together (MVP, migration, rewrite).
  4. **Rescue Audit** — 1 week fixed. Deliverable: root-cause report +
     patch plan for stuck project.
  5. **Advisory** — hourly, capped monthly. For teams that need a
     sounding board, not hands on keys.
- **Rate signal** — a small "Investment" line per card: not a hard price,
  but a range or "from $X" so buyers self-qualify. Ruslan approves ranges
  in plan.
- **Full-time section** — separate block below consulting, SectionBadge
  "Full-time roles" + short paragraph explaining he's also open to
  full-time (Staff / Principal / Founding Engineer), with a CTA to
  `/contact?intent=full-time`.
- **CTA row** — same dual CTA as home ("Book fractional call" /
  "Discuss full-time"), reinforces the fork.

## 9. `/work` (index) page (new)

**Layout:** same chrome. `max-w-content` grid.

**Composition:**

- SectionBadge "Work" (centered)
- Playfair Display H1: "Selected projects." (final copy in plan)
- **Filter chips row** (rounded-full pill buttons, hairline border):
  - Role: All · Frontend · Full-stack · CTO · Consulting
  - Stack: All · React · Next.js · Flutter · Node · AI/LLM
  - Year: All · 2026 · 2025 · 2024 · earlier
  - Filters are client-side (state in `useState`, no route params for
    this sprint — deep-linked filters can be Sprint 10 if needed).
  - "All" is default and mutually exclusive with other chips within its
    row. Multi-select within a row (e.g. React + Next.js) allowed.
- **Grid** — reuses `ProjectCard` component. Empty state (no cards match
  filter): centered muted text + "Clear filters" ghost button.

**Filter data** — role/stack/year fields must exist on the project object
in `content/projects.ts`. If missing, plan adds them.

## 10. Acceptance criteria

A **shipped** Sprint 9 must satisfy all of:

1. **Routes** — `/`, `/about`, `/work`, `/work/<each-slug>`, `/services`,
   `/contact` all return 200. Sitemap generated with all six top-level
   routes + 5 case study routes = 11 entries.
2. **Nav** — 4 items (Work · About · Services · Contact), active state
   uses `usePathname`, mobile menu routes to pages not anchors. Same
   focus trap + escape behaviour as Sprint 7.
3. **Home reshuffle** — `/` shows: Hero, Selected Work (3 + link),
   What I Do teaser (3 + link), HowItWorks (full), Benefits (full),
   Experience mini (3 + link), Testimonials (full), Dual CTA, Footer.
   No Services (6-card block) on home; no Experience (full timeline)
   on home.
4. **`/contact` form** — POST via Server Action succeeds with valid
   input, delivers email via Resend to `CONTACT_TO_EMAIL`, honeypot
   silently drops bot submissions, rate limiter blocks 6th submission
   from same IP within an hour, success state renders without page
   reload, error state preserves entered values.
5. **`/contact` query param prefill** — `/contact?intent=full-time`
   pre-selects the Intent dropdown to "Full-time role". Same for
   `fractional` and `other`. Invalid value falls through to default.
6. **`/about`** — renders bio + full experience timeline + AI stack +
   values. Existing home Experience section shrinks to 3 latest with
   "Full timeline →" link.
7. **`/services`** — renders 4-5 consulting cards + rate signals +
   Full-time block + dual CTA. Existing home Services section shrinks to
   3-card teaser.
8. **`/work` index** — renders all 5 case study cards, filter chips are
   keyboard-operable, filtering hides/shows cards, empty state renders
   when nothing matches.
9. **Env vars documented** — `RESEND_API_KEY`, `CONTACT_TO_EMAIL`,
   `CONTACT_FROM_EMAIL` documented in `README.md` (or `.env.example`
   if we add one). Deployment blocks on Ruslan setting them in Vercel.
10. **A11y preserved** — skip-to-main still lands on `#main` on every
    page, focus rings visible on all form inputs, form fields have
    associated `<label>` elements, submit button announces "Sending…"
    via `aria-live` region on state change, form errors announced via
    `aria-live="assertive"`.
11. **Reduce-motion preserved** — no new animations added anywhere that
    disrespect `prefers-reduced-motion`. Form state transitions are
    opacity-only.
12. **Build clean** — `npx tsc --noEmit` passes, `npm run build`
    produces 11 static + 1 dynamic (Server Action) pages, sitemap
    reflects new routes, both OG shells regenerated if content changes.
13. **No visual regressions** — case study pages (`/work/<slug>`) render
    identically to before this sprint. DotGrid still ambient monochrome.
    No new colour tokens introduced.

## 11. Explicit non-goals

- **No visual redesign.** Same tokens, same fonts, same DotGrid, same
  card shell. Only new pages assemble existing primitives.
- **No CMS.** Content stays in `content/*.ts` + MDX. `/about`, `/services`
  copy lives in TS files under `content/`.
- **No auth / dashboard.** Contact form is fire-and-forget email; no
  submissions log, no admin view.
- **No i18n.** English only, as today.
- **No blog / writing section.** Deferred until Ruslan wants it.
- **No route-based filter deep links** on `/work`. Client-state only.
- **No case-study parallel/intercept modal.** Sprint 4 still deferred
  (blocks on ElevenLabs PVC).
- **No hover video previews on cards.** Sprint 3 still deferred (blocks
  on Ruslan recording clips).
- **No podcast / video interview embed.** Confirmed in Discovery: lives
  on `/work/<slug>` case study pages when content exists; scaffolding
  not in this sprint.
- **No CAPTCHA on contact form.** Honeypot + rate limit only.
- **No Vercel deploy.** Ruslan's action (needs env vars set first).

## 12. Risks + open items

- **Sender domain for Resend.** Resend requires domain verification
  (DNS TXT + DKIM records) to send from `@yourdomain`. If Ruslan hasn't
  bought / pointed a domain yet, we have two fallbacks:
  1. Send from `onboarding@resend.dev` — works out of box, but reads
     amateur and lands in spam more often.
  2. Ship the form UI + Server Action stub that logs to console and
     returns success, wire live Resend later once domain is ready.
  Recommendation: **Option 2** — ship the shape, feature-flag the live
  send behind `RESEND_API_KEY` presence. If key is missing, log the
  submission server-side and still show success to the user. Prevents
  the sprint from blocking on DNS.
- **Full-time content.** Ruslan hasn't shared a full CV / role
  preferences. `/about` timeline and `/services` full-time block need
  his input during implementation. Placeholder copy in initial commit,
  final wording in a follow-up commit before ship.
- **Rate signals on `/services`.** Ranges must come from Ruslan — I
  won't invent numbers. Cards ship with placeholder "TBD" until he
  confirms.
- **Filter taxonomy on `/work`.** Suggested role/stack/year values in
  §9 are a first pass — Ruslan reviews the actual chip list against the
  5 case studies during plan phase.
- **Orphan cleanup risk.** Before deleting `AboutStack.tsx`, verify
  zero remaining imports across `app/` and `components/`. Same for any
  section slice moved to a dedicated page.

## 13. Reference material

- Current site: `/Users/ruslan/portfolio` (Sprint 7 shipped, Sprint 8 QA)
- `memory/portfolio_design_pivot.md` — visual system source of truth
- `memory/portfolio_font_pivot.md` — Playfair Display + DotGrid rules
- Resend docs: https://resend.com/docs/send-with-nextjs (verified pattern
  for Next.js 15+ Server Actions)
- Discovery notes: 2026-09-24 conversation confirming dual audience,
  podcast lives on case study pages, dedicated contact form.
