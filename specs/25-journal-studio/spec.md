# 25 — Journal redesign + studio photography

**Date.** 2026-10-21
**Class.** L · owner request: "треба зробити редизайн сторінки Journal і всіх постів, в постах замінити ілюстрації на картинки в такому стилі" (four reference photos: white AirPods / case / keyboard on white, window-light shadows).

## Reference, read

High-key monochrome still life. White matte objects on a white or warm
off-white seamless surface. One soft daylight source from the side,
long crisp diagonal shadows, gentle gradient falloff into grey. Tight
crops, one subject, big negative space. No people, no text, no colour.
It already sits inside the site palette (paper + ink), so no rule
change is needed.

## Problem

- /blog shows no images at all; every post is `featured: true`, so all
  five land under "Start here" and "All entries" is empty.
- Centered badge hero, 11px uppercase labels, cards with heavy chrome —
  the pre-v2 look /work and /tools already left.
- Post illustrations are ink line drawings (`ink` preset) — the owner
  wants the studio-photo look instead.

## Goal

1. **/blog** — count first (same rule as /work and /tools): h1 with
   the entry count, format chips with counts, "Showing N of M". The
   newest entry leads as a wide image card; the rest sit in an equal
   two-column grid, image on top. Date, format and reading time on
   every card. `featured` no longer drives the index.
2. **Post page** — left-aligned header on the reading column (format ·
   date · minutes, h1, tagline, tags), hero photo at 3:2 on the wide
   column with no frame, figures frameless at a fixed 3:2 crop so a
   regenerated image never breaks layout.
3. **Images** — new `studio` style in `scripts/gen-blog-hero.mjs`;
   `scripts/gen-journal-studio.mjs` holds one physical-object metaphor
   per image (5 heroes + 6 figures) and regenerates them in one run.
   Alt text is rewritten from the manifest once each photo exists —
   never before (alt must describe the image on screen).

## Blocker

Generation needs `GEMINI_API_KEY`; it is not in this environment. The
layout ships first and works with the current ink images (object-cover).

## Rules

Tokens only, 13px floor, two families, accent only for small emphasis,
reduced motion respected, axe clean at 1440 and 390.
