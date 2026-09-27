# Old portfolio archive (2024)

Reference-only. Not linked from the shipped site. Live URL is intentionally
left up during the `hrekov.dev` transition — audit + takedown/301 is a
separate decision, tracked outside this repo.

## Live URL

- https://portfolio-rh.framer.ai/ — Framer-hosted, © 2024
- Positioning: "flexible and versatile designer, 5-year proficiency"
- Antagonistic to current AI-first positioning; do not link.

## Case study pages (design-artefact framed, no live product URLs)

- `/mortgage-application` — mortgage app, ~2022
- `/accounting-software-a-cloud-based-portal` — Business Bay Accounting
- `/platform-for-selling-cars` — Auto Portal Cyprus (has one salvageable
  detail: AutoTrader scraper — no public API at the time)

## Case-study teasers (mostly Framer template placeholders)

- Support & Analytic (affiliate marketing web app)
- King-Kong Coffee shop website
- Online outfit store — literal template placeholder copy shipped
- Tires e-shop
- IT company website

## Employment history (pulled for `content/experience.ts`)

- 2021 — 2023 · PIMU Services, Cyprus · UX/UI + Product Designer
- 2018 — 2021 · Berlin Labs LLC, Kyiv · UX/UI + Product Designer
- 2015 — 2016 · Flynaut, Charlotte NC · UX/UI Designer

## Testimonials (real, from LinkedIn recommendations)

- **Yurii Honcharuk** — Product Practice Lead, ex-PIMU. Verified real
  person via LinkedIn. Full original: "deeply involved in the entire
  design process from gathering and analysing requirements to delivering
  high-quality visual design artefacts… creative but also highly
  responsible and communicative."
- **Svetlana Kostenko** — Project Owner, ex-PIMU. Verified real person
  via LinkedIn. Full original: "creative, responsible, dependable, great
  team player… stayed till late in the office… clients were always happy
  with fresh, unique and high-quality designs."

Both surfaced on `hrekov.dev/#voices` in compressed form. Exact dates need
to be looked up on LinkedIn and patched into `Testimonials.tsx`.

## External handles

- LinkedIn: `linkedin.com/in/ruslan-hrekov-b21996315` — verify this
  matches `components/layout/Footer.tsx`.
- Behance: `behance.net/rusgrekovuead7` — design-only channel, do not
  surface on new site.
- Google Doc CV: `docs.google.com/document/d/1kGXNTdCUr6vZZTXrUCCndtopdaEHTbvmDRmaPY5hFcY`
  — labelled "Sammery" (typo) on old site. Pull dates before it rots;
  don't link from new site.
- US phone: `+1 303 210 18 50` — verify still active before deciding
  whether to surface on `/contact`.

## Red flags on the old site (scrub if publishing anywhere)

- Skill bars: "HTML CSS 20 %", "AI 65 %"
- All soft skills self-scored at 100 %
- Case-study numbers (e.g. "40 % satisfaction", "50 % onboarding
  reduction", "zero data breaches") — unverifiable, no employer named,
  no live product URL. Do not recycle.
- "Sammery" typo (should be "Summary")
- Framer template placeholder shipped as portfolio copy on the outfit
  store tile

## Raw scrape

`/tmp/old-portfolio-scrape.json` (204 KB, 7 pages) — full text, headings,
image URLs, outbound links per page. Regenerate via
`node audit-old-site.mjs` if lost (script deleted after use).
