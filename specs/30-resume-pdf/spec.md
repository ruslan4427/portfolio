# 30 — Résumé page + PDF

**Date.** 2026-10-22
**Class.** S · owner request: "я також думаю нам потрібен пдф з резюме"

## Goal

A one-stop résumé that never drifts from the site.

- `/resume` — an A4 sheet in the site's type (Playfair + Inter, paper and
  ink), built only from `content/*`: name and contact, summary (bio),
  full experience, the six cases with their headline number and link,
  certifications, stack. Nothing written for the PDF alone.
- `public/resume.pdf` — rendered from `/resume` by
  `scripts/build-resume-pdf.mjs` (Playwright `page.pdf`, A4, print CSS),
  so text stays selectable and ATS-readable, links stay clickable.
- Site chrome (nav, footer, floating CTA, back-to-top, consent banner)
  carries `print:hidden`, so printing any page is clean.
- Links to the PDF from /about and /contact.

## Rule

The PDF is generated, never edited. After changing experience, bio,
projects or credentials, run `npm run resume:pdf` against a running
`next start` and commit the new file.
