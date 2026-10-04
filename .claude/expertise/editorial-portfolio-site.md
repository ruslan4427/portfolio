---
domain: editorial-portfolio-site
version: 2026-10-03
expires_at: 2027-01-03
confidence: validated
sources:
  - web.dev/vitals
  - nngroup.com (10 usability heuristics)
  - WCAG 2.2 (W3C)
  - developers.google.com (Lighthouse)
  - Next.js official docs
reference_examples:
  - rauno.me
  - paco.me
  - brittanychiang.com
  - julian.com
  - jhey.dev
validation:
  - method: blind-bug test (3 past hrekov-dev DEVLOG bugs, symptoms-only)
  - date: 2026-10-03
  - pass_bar: 2/3
  - result: 3/3 PASS (CSS layer; mask-image cascade; HTML entity in JS string)
  - caveat: capsule itself was mostly inert — project-layer (STABLE_LOGIC +
    CLAUDE.md) carried Bug 1, general CSS/React knowledge carried Bugs 2 & 3.
    Keep the capsule tight; don't inflate it with generic patterns the
    project context already covers.
---

# Domain definition

Content-first marketing site built by an individual craftsperson (designer,
developer, product manager) to demonstrate their work and attract hiring or
contracting opportunities. Distinct from a SaaS marketing site (no product
funnel), a documentation site (no narrative), or a social-feed site (not
chronological).

Primary conversion: hiring inquiry (email, form, LinkedIn). Secondary: trust
transfer (reader believes the author is competent and would be good to work
with).

Variants with specific layered patterns:
- **AI-collaboration variant** — portfolio that uses the site itself as proof
  of the author's AI-collaboration practice. Must disclose how it was made
  with verifiable receipts (commits, logs, memory files, prompts).
- **Agency-of-one variant** — portfolio for someone taking small-business
  contracts. Case studies emphasize outcomes and tenure, not technical depth.
- **Design-engineer variant** — portfolio for someone operating at the design
  × code intersection. Case studies emphasize craft and iteration velocity.

# Primary audience: recruiters + hiring managers

They browse 20-50 portfolios per week. First impression decides whether they
spend 30 seconds or 5 minutes. Mobile is common (phone during commute).
Trust signals matter more than feature breadth.

# Priority weights (dimensions, in order)

1. **First-30-seconds narrative clarity** — 0.20
2. **Case study depth + authenticity** — 0.18
3. **Mobile UX** (recruiters on phones) — 0.14
4. **Core Web Vitals** (LCP < 2.5s, INP < 200ms, CLS < 0.1) — 0.12
5. **Accessibility** (WCAG 2.2 AA) — 0.10
6. **SEO + findability** — 0.08
7. **Content strategy** (CTA, social proof placement) — 0.08
8. **Narrative integrity** (claims match reality, incl. receipts for AI-collab variant) — 0.05
9. **Code maintainability** — 0.03
10. **Security basics** — 0.02

Weights sum to 1.0. During review, severity escalates with weight — a Core
Web Vitals miss is `blocker`, a code maintainability nit is `low`.

# Must-have patterns

### Narrative
- **Hero establishes value prop in ≤5 words + ≤1 line of supporting copy.**
  Reader should know "what you do" and "who you do it for" before scrolling.
  Reference: rauno.me, julian.com.
- **Case studies open with outcome, not process.** First paragraph should
  include a verifiable metric or shipped result. Process goes below the fold.
- **At least one quantitative receipt per case study.** Commits shipped,
  users served, bugs fixed, time to market. Qualitative-only cases read as
  storytelling, not evidence.
- **CTA to hire visible in the first viewport on desktop and within 2 scrolls
  on mobile.** No "Contact" buried in a nav submenu.

### Performance
- **LCP element identified and optimized.** Usually the hero image or
  headline. Pre-connect, priority hint, next/image with explicit size.
- **No layout shift from async content.** Font loading uses `font-display:
  swap` + explicit size-adjust. Hero media has width/height.
- **Hover videos / autoplay media gated on `(hover: hover)` and
  `prefers-reduced-motion`.** Mobile shouldn't pay bandwidth cost for
  cursor-reactive effects.
- **Third-party scripts (analytics, chat, embeds) deferred or lazy-loaded.**
  Nothing synchronous above the fold.

### Accessibility
- **All interactive elements focusable with keyboard, visible focus ring.**
  No `outline: none` without a replacement.
- **Color contrast meets WCAG 2.2 AA** (4.5:1 for body, 3:1 for large text
  and UI). Test every fg/bg pair before shipping.
- **Semantic HTML.** `<article>` for case studies, `<nav>` for navigation,
  heading levels sequential.
- **Alt text present on images that carry information**, empty `alt=""` on
  decorative. Not "image of X" — describe what the image conveys.
- **Reduced-motion fallback on every animated component.** Not stretch goal.

### Mobile
- **Tap targets ≥ 44×44 CSS px** (WCAG 2.2 §2.5.5 AAA, recommended for
  recruiter audience).
- **No horizontal scroll at 320px width.** Common recruiter device: iPhone SE.
- **Touch-friendly interactions.** No hover-only reveals (content behind a
  cursor-only overlay is invisible on mobile).
- **Text legible at base size** without zoom. Minimum 16px body.

### SEO + findability
- **Semantic page titles + meta descriptions, unique per route.**
- **OpenGraph + Twitter cards** on home, each case study, each blog post.
  OG image generated server-side (not placeholder).
- **JSON-LD structured data:** `Person` on home, `Article` on case studies +
  blog posts, `BreadcrumbList` on nested routes.
- **sitemap.xml + robots.txt + canonical URLs.** All route-aware.
- **Internal linking:** case studies link to each other where topics
  overlap. Blog posts link to case studies they reference.

### Content strategy
- **Social proof placement:** at least one of client logo, testimonial,
  recommendation, or shipped-product evidence visible before scroll.
- **Scope control:** show best 3-5 case studies, not all 20. More = less
  signal per item.
- **Hire path copy:** "Hire me for X" is clearer than "Get in touch." Name
  the engagement type.
- **About page separates bio from values from timeline.** Three different
  reader modes; don't blend.

### AI-collaboration variant specific
- **Every claim about AI usage has a verifiable artifact.** Commit hash,
  prompt log, DEVLOG entry, memory file link. "I use AI to code" with no
  evidence reads as marketing.
- **Positional content** (text that says "this is the 5th case study" or
  "the first X we built") must be audited after any reordering. These lies
  are invisible at build time.
- **Numbers in prose must match disk reality.** "17 memory files, 36%
  promotion rate" — a reconciliation script in CI if the claim is load-bearing.

# Red flags (common mistakes to catch)

- Hero that's pure visual flex without stated value prop
- "Welcome to my portfolio" / "I'm passionate about..." copy
- Case studies that are process-only, no shipped outcomes
- Over-animated hero that hurts LCP (particles, 3D canvases, autoplay video)
- Dark-mode-only or light-mode-only when system preference exists
- Blog posts labeled "Coming soon" (looks dead)
- Social links without aria-labels, or only using icons without text alternative
- 404 page that's just text — missed opportunity for navigation back to work
- No favicon or default Next.js favicon
- Case study numbers that don't match reality after a reorder (AI-collab variant)
- Testimonials pasted as flat text instead of structured markup
- Contact form without server-side validation or spam protection

# Reference examples (approved patterns)

### rauno.me
- Hero: name + one-line value prop + status indicator ("Available for work")
- Nav: minimal, 3 items
- Case studies: outcome-first, screenshot-driven
- Mobile: identical to desktop composition, scales down cleanly
- Pattern to steal: status indicator next to name as functional, not decorative

### paco.me
- Case studies open with large pull quote (one sentence framing the outcome)
- Everything else is below that quote
- Pattern to steal: pull-quote lede

### brittanychiang.com
- Scroll-driven case study nav (sticky sidebar)
- One accent color used sparingly for highlight
- Pattern to steal: constrained chromatic palette as discipline, not limitation

### julian.com
- About page framed as narrative, not CV
- Clear tier of CTAs: email > call > follow
- Pattern to steal: hire-path copy that names the engagement type

### jhey.dev
- Technical depth demonstrated through interactive demos embedded in posts
- Each case study has a "code" tab beside the "story" tab
- Pattern to steal: executive/technical view toggle (already present in
  hrekov-dev AI-collab variant)

# Evaluation dimensions (what to check during review)

1. **Narrative** — does hero + first case open establish value prop + outcome?
2. **Performance** — Core Web Vitals targets met? Hero LCP optimized? Fonts and media sized?
3. **A11y** — focus visible, contrast ratio, semantic HTML, reduced motion, alt text
4. **Mobile** — 320px no-horizontal-scroll, tap targets, hover-independence
5. **SEO** — titles, meta, OG, JSON-LD, sitemap, internal linking
6. **Content** — social proof present, scope controlled, CTAs clear
7. **Code** — dead files absent, token usage consistent, no local-config drift from project rules
8. **Narrative integrity** (AI-collab variant) — claims match reality, positional content audited
9. **Security** — form validation, no secrets in client bundle, no XSS in MDX
10. **Maintainability** — dependencies current, no outdated framework patterns

# Known failure modes

- **Capsule-driven generic advice.** If a finding boils down to "WCAG says
  do X" with no local anchor, flag as low confidence — the project may have
  a reason the generic pattern doesn't apply.
- **Reference-example drift.** Reference portfolios redesign; patterns
  listed here may be out of date. On refresh (3-month TTL), re-check live
  sites.
- **AI-collab variant has thin reference set.** Only hrekov-dev and a
  handful of indie dev portfolios openly disclose AI collaboration. Patterns
  for this variant are extrapolated, not benchmarked.
