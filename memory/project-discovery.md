---
name: Project discovery — portfolio — 2026-09-20
type: project
phase: 0-discovery
---

# Phase 0 checkpoint

## What this project is

Ruslan Grekov's personal portfolio, single-page immersive scroll experience.
Sells his AI-collaboration solo practice while itself being a proof-point of
that practice. Five case studies (Noble, Angel, Fieldmark, Lexora,
smm-factory) with commit hashes, honest numbers, and companion podcast
episodes.

## Buyers & readers (validated in brainstorm)

- **Primary:** founders / CTOs looking for a $15–40k solo build (2–3 mo).
- **Secondary:** creative studio principals subcontracting AI product work.
- **Tertiary:** other AI-collab solo devs (amplifiers, not buyers).

## Design direction (locked)

- **Style:** Lusion-immersive dark. See `~/.claude/skills/ui-ux-pro/references/styles/lusion.md`.
- **Canvas:** `#0B0D12` (not pure black — WebGL depth).
- **Accent:** `#00FF88` — exactly one; second-hue attempt = STABLE_LOGIC violation.
- **Fonts:** Instrument Serif (display italic) + Geist Sans (body) + JetBrains Mono (chrome).
- **Radii:** `0` project-wide.

Contrast verified (`scripts/check_contrast.py`):
- `#F5F5F5` on `#0B0D12` = 17.83:1 (AAA)
- `#00FF88` on `#0B0D12` = 14.49:1 (AAA)
- `#8A8F98` on `#0B0D12` = 5.98:1 (AA)

## Stack (locked)

Next.js 16 (Turbopack, App Router, TypeScript) · React 19 · Tailwind v4
(`@theme inline`, no config file) · R3F + drei + three · GSAP + ScrollTrigger
+ SplitText · Lenis · Framer Motion · @vercel/analytics + speed-insights.

No Rapier. No post-processing. No blog CMS.

## Sprint plan (revised post-brainstorm, DECISION-1)

```
Sprint 0 ✅ Bootstrap (Next.js scaffold + tokens + stubs)
Sprint 1    Case study MDX + basic project cards         ← content-first pivot
Sprint 2    WebGL Canvas + Hero SplitText reveal
Sprint 3    Hover video previews on cards
Sprint 4    Case study modal-as-route + AudioPlayer
Sprint 5    About + Footer polish
Sprint 6    a11y audit + Vercel deploy + OG images
```

## Decisions (from brainstorm-discovery-2026-09-20.md)

1. **Content before canvas.** Sprint 1 pivots to MDX; WebGL moves to Sprint 2.
2. **Route pattern:** modal-as-route via parallel/intercept (Sprint 4).
3. **Podcast player:** per-case-study header, not persistent.
4. **Domain:** `ruslan.dev` (fallback `grekov.dev`).
5. **Analytics:** `@vercel/analytics` only for MVP.
6. **Language:** EN-only for MVP.

## Blocking human actions

1. Ruslan: check `ruslan.dev` availability.
2. Ruslan: record 5 project preview videos (10–15s screen loops each).
3. Ruslan: ElevenLabs PVC training set recording (~30 min mic time) → gates
   real podcast audio.

## What NOT to do (scope guards)

- No new colors, no rounded corners, no third font family.
- No blog / CMS / headless-anything.
- No physics engine, no post-processing.
- No fake testimonials.
- No hero autoplay video.
- No email capture, no cookie banner (unless legal), no popup modals.

## Next phase

Phase 1 — Spec. First feature spec is `specs/01-case-study-mdx/`.
