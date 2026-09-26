# Plan — Sprint 9 · Site restructure implementation

Reads with `spec.md`. WHAT is here; WHY is in spec.

---

## 1. Order of operations

Confirmed order (per Discovery on 2026-09-24):

```
1. /contact                (new route + Resend Server Action)
2. /about                  (new route + content extraction)
3. /services               (new route + package cards)
4. /work (index)           (new route + filter chips)
5. Home reshuffle + Nav    (last — depends on 1-4 existing)
```

Rationale for this order:

- `/contact` first because it's the most self-contained (new page + new
  backend + no dependency on other page splits). Ships value alone.
- Home reshuffle last because the "View all →" links from home need real
  destinations already in place; otherwise we'd ship dead links.
- Nav update comes with home reshuffle in a single commit so users never
  see a state where Nav points to a route that doesn't exist yet.

## 2. Foundation touched by all pages

Before any new page, one prep commit:

### 2.1 `lib/route.ts` — NEW (optional, only if needed)

Small helper to build `/contact?intent=<x>` URLs consistently. Only add
if we have three or more call-sites; otherwise inline string.

### 2.2 `content/services.ts` — NEW

TypeScript source of truth for consulting packages. Shape:

```ts
export type Service = {
  id: string;
  name: string;
  format: string;        // "2-week sprint", "Monthly retainer"
  outcome: string;       // one-line deliverable
  scope: string[];       // 3-5 bullets, what's included
  investment: string;    // "From $X" or "TBD" until Ruslan confirms
  intent: "fractional" | "advisory";
};
export const services: Service[] = [ ... ];
```

Ships with placeholder `investment: "TBD"` — Ruslan approves numbers
before commit.

### 2.3 `content/about.ts` — NEW

TypeScript source for `/about` prose blocks:

```ts
export const bio = [
  "Paragraph 1...",
  "Paragraph 2...",
];
export const values = [
  { title: "...", body: "..." },
  ...
];
```

Experience data already exists in `components/sections/Experience.tsx` —
extract to `content/experience.ts` in Phase B (see §3.2).

### 2.4 `content/projects.ts` — EXTEND

Add optional fields for `/work` filter chips:

```ts
export type Project = {
  ...existing fields,
  role?: "frontend" | "full-stack" | "cto" | "consulting";
  stack?: Array<"react" | "next" | "flutter" | "node" | "ai">;
  year?: number;
};
```

Backfill the 5 existing projects. Missing values fall through to "All"
chip — no card gets hidden by absence of a field.

## 3. Phase-by-phase plan

### Phase A — `/contact` (Task #39)

**A1. `app/(marketing)/contact/page.tsx` — NEW**

Server Component (Metadata + shell). Renders `<ContactForm />` inside
the same chrome as case study pages. Metadata:

```ts
export const metadata = {
  title: "Contact — Ruslan Grekov",
  description: "Get in touch about a fractional engagement, a full-time role, or just to say hi.",
};
```

**A2. `components/sections/ContactForm.tsx` — NEW**

Client Component (`"use client"`). Uses `useActionState` (Next 15+) to
wire the Server Action:

```tsx
const [state, formAction, pending] = useActionState(sendContact, initialState);
```

Reads `?intent=` from `useSearchParams()` on mount to pre-select the
Intent dropdown. Form fields per spec §6. Honeypot input is a
`<input name="_gotcha" tabIndex={-1}>` inside a
`<div className="sr-only" aria-hidden>`.

State machine:
- `idle` — form visible, submit enabled
- `pending` — submit disabled, button label "Sending…"
- `success` — form replaced by confirmation card
- `error` — form visible with error above submit, values preserved via
  `defaultValue` from `state.values`

**A3. `app/(marketing)/contact/actions.ts` — NEW**

```ts
"use server";

import { Resend } from "resend";

const rateLimit = new Map<string, number[]>();

export async function sendContact(prev, formData) {
  // 1. Honeypot check — silently return success if filled
  // 2. Validate name (1-100), email (regex), intent (enum), message (20-5000)
  // 3. Rate limit: 5 per IP per hour, drop 6th
  // 4. If RESEND_API_KEY missing: log to console, return success (dev/preview)
  // 5. Else: resend.emails.send({...})
  // 6. Return { status: "success" | "error", values, message? }
}
```

Get client IP via `headers().get("x-forwarded-for")?.split(",")[0]` — this
works on Vercel. In local dev IP is empty; rate limit falls through.

**A4. Install `resend`**

```bash
npm i resend
```

No other new dep. Zod skipped — hand-rolled validation is 20 lines.

**A5. `.env.example` — NEW**

```
RESEND_API_KEY=re_xxx
CONTACT_TO_EMAIL=rusgrekovua@gmail.com
CONTACT_FROM_EMAIL="Ruslan Portfolio <contact@ruslan.dev>"
```

Add `.env.local` to `.gitignore` (verify — should already be there from
Next.js default).

**A6. `README.md` — APPEND**

Section "Contact form" documenting env vars + how to test (submit form
without `RESEND_API_KEY` → check terminal for logged submission).

**A7. Nav + Footer link update — SCOPED**

Add temporary `/contact` link to Footer only (not Nav yet). Footer's
existing "Let's talk" button changes `href="mailto:..."` →
`href="/contact"`. Full Nav update happens in Phase E.

**Checkpoint A:** `/contact` renders, form submits, terminal logs a
submission (no key), page hot-reloads clean. Bundle diff for `/contact`
under 15KB gzipped.

### Phase B — `/about` (Task #40)

**B1. `content/experience.ts` — NEW**

Extract role data from `components/sections/Experience.tsx` into a typed
array. `Experience.tsx` refactored to consume the array. No visual
change on home yet.

**B2. `content/about.ts` — NEW**

Bio paragraphs + values array per §2.3. Placeholder copy in first
commit, Ruslan supplies final wording in a follow-up.

**B3. `app/(marketing)/about/page.tsx` — NEW**

Server Component. Composes: SectionBadge, H1, bio paragraphs, full
Experience component, AI-stack cards (extract from `AboutStack.tsx`),
Values cards. Metadata:

```ts
export const metadata = {
  title: "About — Ruslan Grekov",
  description: "Bio, experience, and how I run a studio of one with Claude.",
};
```

**B4. `components/sections/AboutStack.tsx` — SPLIT**

Current file is one giant section. Extract:
- `components/sections/AiStack.tsx` — the Opus/Sonnet/Haiku matrix
- `components/sections/Values.tsx` — the principles block (or new file
  if AboutStack has no values block; then create Values fresh)

Delete `AboutStack.tsx` after imports are updated. `app/page.tsx` never
imported it (verified 2026-09-24) — safe to delete.

**Checkpoint B:** `/about` renders. Experience data source is shared
with home. No home visual regression.

### Phase C — `/services` (Task #41)

**C1. `content/services.ts` — NEW**

Per §2.2. Ruslan reviews the 4-5 package list + investment ranges before
final commit.

**C2. `components/sections/ServicesFull.tsx` — NEW**

Full version of what's currently `components/sections/Services.tsx` (6
cards → 4-5 cards from `content/services.ts`). Different shell so we
can keep the 3-card teaser variant on home.

**C3. `app/(marketing)/services/page.tsx` — NEW**

Server Component. Composes: SectionBadge, H1, ServicesFull grid,
Full-time block, dual CTA row. Metadata:

```ts
export const metadata = {
  title: "Services — Ruslan Grekov",
  description: "Fractional formats: Discovery Sprint, Fractional CTO, Build Partner, Rescue Audit, Advisory.",
};
```

**C4. `components/sections/Services.tsx` — REFACTOR**

Rebuild home's version as a 3-card teaser reading from
`content/services.ts` (first 3 entries) + "How I engage →" link to
`/services`.

**Checkpoint C:** `/services` renders. Home Services section is now a
teaser. Both consume the same source.

### Phase D — `/work` index (Task #42)

**D1. `content/projects.ts` — EXTEND**

Add `role`, `stack`, `year` per §2.4. Backfill 5 existing entries.

**D2. `components/sections/WorkIndex.tsx` — NEW**

Client Component (`"use client"`) — filter state is client-side. Renders:

- Three chip rows (role, stack, year). Each chip is a
  `<button aria-pressed>` styled as rounded-full pill (border, hairline,
  `--bg-elevated`). Active state = filled `--ink-primary` on
  `--bg-page` text. "All" chip resets its row.
- Filtered grid of `<ProjectCard>` components.
- Empty state: centered muted text + "Clear filters" ghost button.

Filter logic: a project matches if for each row, either "All" is active
OR the project's field is in the active set. Missing field on project =
matches only when "All" is active for that row.

**D3. `app/(marketing)/work/page.tsx` — NEW**

Server Component (metadata + shell). Renders `<WorkIndex />` inside
standard chrome. Metadata:

```ts
export const metadata = {
  title: "Work — Ruslan Grekov",
  description: "Five case studies of AI-collaboration in production.",
};
```

**Checkpoint D:** `/work` renders 5 cards, filters hide/show cards,
empty state works, keyboard-operable.

### Phase E — Home reshuffle + Nav (Task #43)

**E1. `components/layout/Nav.tsx` — REWRITE**

Swap section-anchor links for route links:

```ts
const NAV_LINKS = [
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/contact", label: "Contact" },
];
```

Replace `IntersectionObserver`-based active detection with
`usePathname()` from `next/navigation`. Active if
`pathname === href` (exact match — no need for prefix matching yet, no
sub-routes).

Mobile menu: same structure, links route via `<Link>` from `next/link`.
Focus trap, Escape, restore focus preserved.

**E2. `components/sections/SelectedWork.tsx` — NEW**

Home's replacement for full ProjectsGrid: 3 featured cards + "View all →"
link. Reads first 3 (or a `featured: true` flag) from `content/projects.ts`.

**E3. `components/sections/ExperienceMini.tsx` — NEW**

3 latest roles from `content/experience.ts` + "Full timeline →" link to
`/about#experience`.

**E4. `components/sections/DualCTA.tsx` — NEW**

Two rounded-full CTAs side by side:
- Primary (black): "Book a fractional call" → `/contact?intent=fractional`
- Secondary (bordered): "Discuss full-time" → `/contact?intent=full-time`

Centered, `max-w-lg`, stacks on mobile.

**E5. `app/page.tsx` — REWRITE composition**

New order per spec §5:

```tsx
<Hero />
<SelectedWork />
<Services />              // teaser variant from C4
<HowItWorks />
<Benefits />
<ExperienceMini />
<Testimonials />
<DualCTA />
<Footer />
```

**E6. `components/layout/FloatingEmailCTA.tsx` — RETIRE**

Redundant now that Nav has "Contact". Remove import from `app/page.tsx`
and delete file. (Verify no other consumer.)

**Checkpoint E:** Home renders new composition, Nav routes to real
pages, all links resolve to 200.

### Phase F — Verification + docs

**F1. `app/sitemap.ts` — EXTEND**

Add `/about`, `/services`, `/work`, `/contact` to the static route list.
Case study routes stay dynamic. Verify total = 11.

**F2. `robots.ts` — VERIFY**

Should still allow all. No change unless we want to disallow `/contact`
(no — form is public).

**F3. Contrast recheck** — new elements (form inputs, focus rings on
select/textarea) via `python3 /Users/ruslan/.claude/skills/ui-ux-pro/scripts/check_contrast.py`.

**F4. Playwright smoke test** — script that visits all 6 top-level
routes, screenshots each, asserts 200 + no console errors. Ad-hoc
script in `/tmp/`, not committed.

**F5. `DEVLOG.md`** — append Sprint 9 entry (Problem/Decision/Result/Lesson).

**F6. `memory/iteration-9.md`** — checkpoint. Mentions Resend key still
needed for live email + Ruslan's copy still pending on placeholder
sections.

**F7. `CLAUDE.md`** — extend "File layout" section with new routes +
`content/services.ts`, `content/about.ts`, `content/experience.ts`.

## 4. Risk mitigations

- **Resend without domain:** Feature-flag on `RESEND_API_KEY` presence.
  Missing key → log + fake success. Form ships regardless.
- **Placeholder copy:** Every placeholder marked with a `// TODO(ruslan):`
  comment. Grep-able before commit.
- **Rate limit reset on cold start:** Accepted. Documented in DEVLOG as
  a known limitation with upgrade path to Upstash if abused.
- **Filter deep-link absence:** Documented as non-goal. If Ruslan wants
  it later, a small `useSearchParams` sync in `WorkIndex` covers it in
  half a day.

## 5. Verification steps

Run in order:
1. `npx tsc --noEmit` — zero errors
2. `npm run build` — 11 routes, no failures
3. `curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/{,about,work,services,contact}` — all 200
4. Submit contact form in browser without `RESEND_API_KEY` — terminal logs entry
5. Submit contact form with `RESEND_API_KEY` set locally — email arrives
6. Submit contact form 6 times fast from same IP — 6th returns rate-limit error
7. Fill honeypot in DevTools → submit → success returned, no email sent
8. Toggle system reduce-motion → form + nav behave (no motion regressions)
9. Keyboard tab through form → all inputs focusable, submit reachable, focus rings visible
10. Screen reader smoke — VoiceOver announces field labels and error state
