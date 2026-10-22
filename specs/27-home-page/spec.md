# 27 — Home page redesign

**Date.** 2026-10-22
**Class.** L · owner request: "тепер зроби редизайн головної сторінки"

## Problem

- "Four case studies" with rows numbered 01, 04, 05, 06 and no word that
  six exist — the same confusion the owner flagged on /work (Sprint 23).
- "Three formats" shows three of five engagement formats, also unsaid.
- Six sections open with the same centered sparkle badge + centered
  two-line serif heading; the page reads as one undifferentiated column
  while /work, /tools, /blog and /contact are left-aligned.
- How it works: five cards in a 2-col grid with the last one stretched.
- 10–12px uppercase tracked labels (format, dates), ad-hoc sizes.
- The only hero action is "Discover ↓".

## Goal

Same rules as the other pages: counts up front, equal treatment,
left-aligned headers, tokens only.

1. `components/ui/SectionHeader` — eyebrow (with count where one
   exists), h2 at `--type-display-m`, optional lede, optional link on
   the right. Every home section uses it.
2. **Hero** — content kept. A counts row computed from data
   (cases · open-source tools · journal entries), each a link; two
   actions: "See the work" → /work, "Start a project" → /contact.
3. **Selected work** — the /work `ProjectCard`, 2×2; eyebrow
   "Cases · 4 of 6", link "All 6 cases".
4. **Services** — eyebrow "Engagements · 3 of 5", link "All 5 formats".
5. **How it works** — five numbered steps in one row (stacked on
   mobile), one hairline track, no icons.
6. **Benefits** — three equal columns.
7. **Experience** — timeline rows on the page, no card.
8. **Testimonials** — v2 cards, dates in sentence case.

Copy stays the owner's; only counts and labels change.

## Done when

1440 and 390 without overflow; axe clean; build passes; every number
on the page derives from `content/*`.
