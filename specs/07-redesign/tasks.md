# Tasks — Sprint 7 · Redesign

Sequential. Each task is small enough to verify in isolation.

---

## Phase A — Foundation (tokens + fonts + primitives)

- [ ] **A1.** Rewrite `app/globals.css`: new `:root` tokens per spec §4,
  new `@theme inline` mapping, reset preserved, Lenis CSS preserved,
  `:focus-visible` outline updated to `--ink-primary`, `.font-serif`
  utility added.
- [ ] **A2.** Rewrite font imports in `app/layout.tsx`: swap
  Instrument/Geist/JetBrains → Fraunces + Inter. Verify `html.className`
  wires both variables. Update root metadata description to a softer
  one-liner.
- [ ] **A3.** Delete `components/canvas/*` (6 files: CanvasScene,
  ParticleField, SceneRoot, StaticGradient, CanvasErrorBoundary,
  shaders). Remove all references from `app/page.tsx`.
- [ ] **A4.** Delete `components/ui/SplitReveal.tsx`. Delete all
  references (Hero currently imports it).
- [ ] **A5.** Remove `@react-three/fiber`, `@react-three/drei`, `three`,
  `@types/three` from `package.json`. Run `npm install`. Verify
  `grep -r "three"` returns nothing in `components/` or `app/`.
- [ ] **A6.** Create `components/canvas/DotGrid.tsx` per plan §2.4.
  Include hover-capability gate (`matchMedia("(hover: none)")` disables
  cursor loop, renders static grid).
- [ ] **A7.** Create `components/ui/SectionBadge.tsx`. Inline sparkle
  SVG. Props: `label`.
- [ ] **A8.** Create `components/ui/StatusPill.tsx`. Props: `status`,
  `label`. Green dot only for `available`.
- [ ] **A9.** Create `components/ui/CTAButton.tsx`. Props: `href`,
  `label`, `avatarSrc?`. Rounded-full black pill with arrow icon.
- [ ] **A10.** Create `components/ui/FadeUp.tsx`. Framer `whileInView`
  fade-up 400ms with reduce-motion collapse to instant. Export both a
  wrapper and a hook variant if needed.

**Checkpoint A:** `npx tsc --noEmit` passes, `npm run build` succeeds,
page renders bare (Nav + sections still using old tokens will look
half-broken — that's expected).

## Phase B — Section rewrites

- [ ] **B1.** Rewrite `components/layout/Nav.tsx`: light chrome, no
  backdrop-blur (or subtle white/90 + hairline below scroll). Active
  state = text color change + small rounded-full chip, no framer shared
  layout. Mobile menu: white overlay with black text, sparkle badges.
  Focus trap + Escape + restore focus preserved.
- [ ] **B2.** Rewrite `components/sections/Hero.tsx` per plan §2.7:
  asymmetric two-column, avatar top-left, Fraunces italic H1, socials +
  bio + Discover link right column. Absolute StatusPill top-right, date
  label top-left.
- [ ] **B3.** Rewrite `components/sections/ProjectCard.tsx` per plan
  §2.8: rounded-16 shell, hairline border, subtle shadow, preview area
  (16:10 placeholder), name/tagline/year row, tag pills row. Hover
  translate-y-1.
- [ ] **B4.** Rewrite `components/sections/ProjectsGrid.tsx`: 2-col
  desktop grid, SectionBadge + centered Fraunces H2 above.
- [ ] **B5.** Rewrite `components/sections/AboutStack.tsx` per plan
  §2.9: SectionBadge + centered Fraunces H2 + bio para + 3 fact cards
  (Base/Practice/Cadence) + 3 stack cards (Opus/Sonnet/Haiku). Card
  shell shared with ProjectCard.
- [ ] **B6.** Rewrite `components/layout/Footer.tsx` per plan §2.10:
  SectionBadge "Contact" + big Fraunces "Let's talk." + CTAButton +
  small colophon row.
- [ ] **B7.** Mount `<DotGrid />` in `app/page.tsx` as first child
  (before Nav, sits at -z-10). Remove old `<SceneRoot />` import (already
  deleted in A3).

**Checkpoint B:** Home renders fully in new visual system. Dot grid
reacts to cursor. All sections have new type + color. Tab through works.

## Phase C — Case study pages + MDX

- [ ] **C1.** Re-token `app/(marketing)/work/[slug]/page.tsx` per plan
  §2.11: swap all `--bg-canvas`, `--fg-primary`, `--fg-muted` to new
  tokens. Add `<DotGrid />` behind article content. Meta row rebuilt as
  StatusPill + small mono chunks.
- [ ] **C2.** Rewrite `components/mdx/MdxComponents.tsx` per plan §2.12:
  Fraunces h2, Inter h3/p, Inter link (no blue), muted border on hr,
  neutral bg on inline/block code.
- [ ] **C3.** Re-token `components/layout/BackToWork.tsx`: light chrome,
  `--ink-primary` text.

**Checkpoint C:** `/work/noble-saas` renders MDX with new tokens.
Typography reads well at max-w-[65ch].

## Phase D — Metadata + OG

- [ ] **D1.** Rewrite `app/opengraph-image.tsx` per plan §2.13: light
  background, Fraunces title, avatar + StatusPill + timestamp elements.
- [ ] **D2.** Rewrite `app/(marketing)/work/[slug]/opengraph-image.tsx`
  same shell, per-slug title/tagline/role/year. Keep
  `generateStaticParams`.

**Checkpoint D:** `curl` on OG image URLs returns valid PNG in new
palette.

## Phase E — Copy softening

- [ ] **E1.** Hero: propose 2-3 alternative headlines to Ruslan. Ship
  the one he picks.
- [ ] **E2.** Hero bio paragraph: soften ~20%, preserve facts.
- [ ] **E3.** ProjectsGrid H2: soften.
- [ ] **E4.** AboutStack: soften bio + model stratification intro.
- [ ] **E5.** Footer: "Let's build." → "Let's talk." Preamble softened.
- [ ] **E6.** StatusPill: "Booking Q4 2026 · 1 slot" → "Available for
  Q4 2026" or similar.
- [ ] **E7.** Show Ruslan diffs before committing E1-E6 in a single
  commit. No prose changes shipped without his sign-off.

## Phase F — Docs + memory + release

- [ ] **F1.** Rewrite `CLAUDE.md` design system section per plan §2.14.
  Update "What this is" paragraph.
- [ ] **F2.** Review `STABLE_LOGIC.md`. Revoke rules tied to old
  direction (radii=0, mix-blend, SplitText, dark canvas). Add dated
  note explaining revocation and pointing to spec.
- [ ] **F3.** Append Sprint 7 entry to `DEVLOG.md`
  (Problem/Decision/Result/Lesson).
- [ ] **F4.** Create `memory/iteration-7.md` checkpoint.
- [ ] **F5.** Final verification pass:
  - `npx tsc --noEmit` — clean
  - `npm run build` — 17 pages, JS size ≥150KB smaller than pre-Sprint-7
  - `curl /`, `/work/<each-slug>`, `/robots.txt`, `/sitemap.xml`,
    `/opengraph-image` — all 200
  - Browser check on `/` at desktop + mobile widths
  - System reduce-motion toggle — dot grid becomes static

## Not in this sprint

- Hover video previews on cards (Sprint 3 — needs recordings)
- Case study parallel/intercept modal (Sprint 4 — needs voice PVC)
- AudioPlayer (Sprint 4)
- Vercel deploy (Ruslan action)
- `ruslan.dev` DNS (Ruslan action)
