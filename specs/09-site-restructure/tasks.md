# Tasks — Sprint 9 · Site restructure

Sequential. Each task is small enough to verify in isolation.

---

## Phase A — `/contact` (task #39)

- [ ] **A1.** `npm i resend` — verify no peer-dep warnings on Next 16 / React 19.
- [ ] **A2.** Create `.env.example` with `RESEND_API_KEY`, `CONTACT_TO_EMAIL`,
  `CONTACT_FROM_EMAIL`. Verify `.env.local` is git-ignored.
- [ ] **A3.** Create `app/(marketing)/contact/actions.ts` with `sendContact`
  Server Action: honeypot check, hand-rolled validation (name/email/intent/
  message), in-memory rate limit (5/hr/IP), feature-flagged Resend send
  (log + success if `RESEND_API_KEY` missing), typed return
  `{ status, values, message? }`.
- [ ] **A4.** Create `components/sections/ContactForm.tsx` — Client
  Component using `useActionState`. Fields: name, email, intent
  (select w/ 3 options), message (textarea). Honeypot `sr-only` input.
  Intent pre-select from `useSearchParams().get("intent")`. States:
  idle / pending / success / error. Error values preserved via
  `defaultValue`. aria-live regions for pending + error announcements.
- [ ] **A5.** Create `app/(marketing)/contact/page.tsx` — Server Component
  with metadata (title + description), SectionBadge "Contact", Playfair
  Display H1 "Let's talk.", muted sub-headline, `<ContactForm />` centered
  in `max-w-lg` card, alt-contact row below (email + socials).
- [ ] **A6.** Update `components/layout/Footer.tsx` — change
  `href="mailto:rusgrekovua@gmail.com"` on the "Let's talk" CTA to
  `href="/contact"`. Keep the small email-address text as a mailto link.
- [ ] **A7.** Extend `app/sitemap.ts` — add `/contact` entry.
- [ ] **A8.** Append README section "Contact form" — env vars + how to
  test without a live Resend key.

**Checkpoint A:**
- `npx tsc --noEmit` clean.
- `curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/contact` → 200.
- Submitting the form without `RESEND_API_KEY` set → terminal logs the
  submission, browser shows success card.
- Filling the honeypot in DevTools → success returned, terminal does not
  log the submission (or logs "honeypot dropped").
- Reducing message under 20 chars → error state, values preserved.
- Task #39 marked complete.

## Phase B — `/about` (task #40)

- [ ] **B1.** Extract `roles` array from
  `components/sections/Experience.tsx` into `content/experience.ts` with
  a typed export. Refactor `Experience.tsx` to consume the array.
  Verify home Experience renders identically.
- [ ] **B2.** Create `content/about.ts` with `bio: string[]`,
  `values: { title, body }[]`. Placeholder copy marked
  `// TODO(ruslan):`.
- [ ] **B3.** Split `components/sections/AboutStack.tsx`:
  - New `components/sections/AiStack.tsx` for Opus/Sonnet/Haiku matrix.
  - New `components/sections/Values.tsx` for principles cards (from
    `content/about.ts`).
- [ ] **B4.** Create `app/(marketing)/about/page.tsx` — Server Component,
  metadata, SectionBadge "About", Playfair Display H1, bio paragraphs,
  `<Experience full />` (or full component variant), `<AiStack />`,
  `<Values />`.
- [ ] **B5.** Verify no remaining import of `AboutStack.tsx` in
  `app/` or `components/`, then delete the file.
- [ ] **B6.** Extend `app/sitemap.ts` — add `/about` entry.

**Checkpoint B:**
- `npx tsc --noEmit` clean.
- `/about` returns 200.
- Home Experience section renders identically to pre-Phase-B (no
  regression on 3 latest roles).
- `AboutStack.tsx` deleted, `grep -r "AboutStack"` in
  `app/ components/ content/` returns nothing.
- Task #40 marked complete.

## Phase C — `/services` (task #41)

- [ ] **C1.** Create `content/services.ts` — 4-5 package entries per
  spec §8. `investment: "TBD"` on all until Ruslan approves ranges.
- [ ] **C2.** Create `components/sections/ServicesFull.tsx` — grid of
  all packages from `content/services.ts` with rate signal.
- [ ] **C3.** Create `app/(marketing)/services/page.tsx` — Server
  Component, metadata, SectionBadge "Services", Playfair Display H1,
  `<ServicesFull />`, Full-time block, dual CTA row.
- [ ] **C4.** Refactor `components/sections/Services.tsx` on home to
  a 3-card teaser reading first 3 entries from `content/services.ts` +
  "How I engage →" link to `/services`.
- [ ] **C5.** Extend `app/sitemap.ts` — add `/services` entry.

**Checkpoint C:**
- `npx tsc --noEmit` clean.
- `/services` returns 200.
- Home Services block renders 3 cards + link (not 6).
- Both pages read from the same source.
- Task #41 marked complete.

## Phase D — `/work` index (task #42)

- [ ] **D1.** Extend `content/projects.ts` — add optional `role`,
  `stack`, `year` fields to the type + backfill 5 existing entries.
- [ ] **D2.** Create `components/sections/WorkIndex.tsx` — Client
  Component with three chip rows (role/stack/year), filter state,
  `<ProjectCard>` grid, empty-state block + "Clear filters" button.
  Chip buttons keyboard-operable with `aria-pressed`.
- [ ] **D3.** Create `app/(marketing)/work/page.tsx` — Server Component,
  metadata, SectionBadge "Work", Playfair Display H1, `<WorkIndex />`.
- [ ] **D4.** Extend `app/sitemap.ts` — add `/work` entry.

**Checkpoint D:**
- `npx tsc --noEmit` clean.
- `/work` returns 200 and lists all 5 case study cards.
- Selecting a chip filters the grid; selecting "All" clears.
- Empty state renders when filters exclude everything.
- Task #42 marked complete.

## Phase E — Home reshuffle + Nav (task #43)

- [ ] **E1.** Rewrite `components/layout/Nav.tsx` — 4 route links
  (Work/About/Services/Contact) via `<Link>`. Active state via
  `usePathname()`. Section-anchor IntersectionObserver removed. Mobile
  overlay routes via `<Link>`. Focus trap + Escape + restore focus
  preserved unchanged.
- [ ] **E2.** Create `components/sections/SelectedWork.tsx` — 3 featured
  cards (first 3 or `featured` flag) + "View all →" link to `/work`.
- [ ] **E3.** Create `components/sections/ExperienceMini.tsx` — 3 latest
  roles from `content/experience.ts` + "Full timeline →" link to `/about`.
- [ ] **E4.** Create `components/sections/DualCTA.tsx` — two rounded-full
  CTAs, primary "Book a fractional call" → `/contact?intent=fractional`,
  secondary "Discuss full-time" → `/contact?intent=full-time`.
- [ ] **E5.** Rewrite `app/page.tsx` composition per spec §5:
  Hero → SelectedWork → Services (teaser) → HowItWorks → Benefits →
  ExperienceMini → Testimonials → DualCTA → Footer.
- [ ] **E6.** Retire `components/layout/FloatingEmailCTA.tsx` — remove
  import from `app/page.tsx`, verify no other consumer via
  `grep -r "FloatingEmailCTA"`, delete file.

**Checkpoint E:**
- `npx tsc --noEmit` clean.
- Home renders new composition, all 4 Nav links resolve to 200.
- No visual regression on Hero, HowItWorks, Benefits, Testimonials.
- Mobile menu still traps focus and closes on Escape.
- Task #43 marked complete.

## Phase F — Verification + docs

- [x] **F1.** Full route smoke — all 12 URLs (5 top-level + 5 case
  studies + sitemap + robots) → 200.
- [x] **F2.** `npm run build` clean — 21 static pages generated (9
  top-level + 5 case studies × 2 with per-slug OG images). No
  bundle regressions.
- [x] **F3.** Contrast on form pairs — all AA pass (see /tmp
  contrast log). AAA fails on ink-muted×paper are acceptable
  (placeholder/helper text only, consistent with design system).
- [x] **F4.** Playwright smoke — all 6 top-level routes + mobile
  home shot. Nav-pill active on all four sub-pages, `/` has no
  active (correct), `/work/noble-saas` keeps `Work` active
  (prefix match). Zero console errors.
- [x] **F5.** Sprint 9 entry appended to `DEVLOG.md`
  (Problem/Decision/Result/Lesson).
- [x] **F6.** `memory/iteration-9.md` checkpoint written + linked
  from `MEMORY.md`.
- [x] **F7.** `CLAUDE.md` "File layout" section updated to reflect
  multi-page IA + global chrome in root layout + new content files.
- [x] **F8.** `TODO(ruslan):` list (for handoff):
  - `content/services.ts:11` — investment ranges (all `"TBD"`)
  - `content/about.ts:6` — real 3-4 paragraph bio
  - `content/about.ts:13` — refine principles
  - `content/experience.ts:7` — tighten dates + descriptions
  - `components/sections/Testimonials.tsx:11` — real quotes when
    stakeholders confirm

**Checkpoint F:**
- All checkpoints A-E green.
- All F items done.
- Sprint 9 ready to ship (deploy blocked only on Ruslan setting env vars
  in Vercel + supplying final copy for TODOs).

## Not in this sprint

- Vercel deploy — Ruslan's action (needs `RESEND_API_KEY` +
  `CONTACT_TO_EMAIL` + `CONTACT_FROM_EMAIL` set in project settings).
- Sender domain DNS setup — Ruslan's action.
- Hover video previews on cards (Sprint 3 — blocks on recordings).
- Case-study parallel/intercept modal (Sprint 4 — blocks on ElevenLabs PVC).
- AudioPlayer (Sprint 4).
- Podcast / video interview embed on case study pages.
- CMS migration.
- i18n.
- Route-based deep-linked `/work` filter state.
- Durable rate limit (Upstash) for contact form.
