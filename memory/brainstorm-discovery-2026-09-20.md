---
name: Brainstorm — discovery — 2026-09-20
type: project
stage: discovery
---

## Framing

**Goal:** Validate that the Sprint 0 scaffold (Lusion-immersive dark theme,
neon-green accent, single-page scroll composition) is the right shape for
what this portfolio is actually *for* — before Sprint 1 spends GPU time on
particles and shaders. Also: identify anything we're missing before spec.

**Time box:** ~30 min (retro-discovery, not from-scratch).

**Context loaded:**
- `/Users/ruslan/portfolio/CLAUDE.md`
- `/Users/ruslan/portfolio/DEVLOG.md`
- `/Users/ruslan/portfolio/STABLE_LOGIC.md`
- `/Users/ruslan/portfolio/content/projects.ts`
- 5 case study drafts in `/Users/ruslan/.claude/projects/-Users-ruslan-portfolio/case_studies/`
- 5 podcast scripts in `/Users/ruslan/.claude/projects/-Users-ruslan-portfolio/podcast_scripts/`
- Memory: `portfolio_active.md`, `portfolio_design_system.md`,
  `portfolio_voice_cloning.md`, `portfolio_podcast_format.md`

---

## 🎯 Problem space

**What exact problem are we solving?**
Ruslan needs a portfolio that (a) sells his AI-collaboration engineering
practice to a specific buyer, and (b) is itself a proof-point of that
practice. Nothing on the current internet portfolio-shelf does both. Dev
portfolios read as SaaS. Design portfolios read as agency. This one has
to look *cinematic* enough to signal taste but *technical* enough to be
believable to engineers.

**Who has this problem?**
- **Primary buyer:** founders and CTOs looking for a solo builder for a
  ~$15–40k contract engagement (2–3 month build). Angel Trucking is a
  reference example. They read this site on desktop, at night, likely
  with a cold coffee.
- **Secondary buyer:** design/creative studio principals who might sub-
  contract complex AI/product work. They care about aesthetic taste as
  much as ship history.
- **Tertiary reader:** other AI-collaboration solo devs — the ones who
  will steal the STABLE_LOGIC pattern, the ShipLoop discipline, the
  DEVLOG.md ritual. Not paying, but they amplify.

**What does "solved" look like?**
- One-visit understanding of what Ruslan does and how (< 60 seconds).
- Case studies read as engineering artifacts, not marketing copy.
- Site itself is a demo — the immersive canvas, scroll motion, and
  podcast player *are* the portfolio piece.
- Contact conversion at ≥ 5% of engaged sessions.

**Reality check on what we've built so far.**
Sprint 0 scaffold matches the target *aesthetic* well (dark, cinematic,
serif+mono, single accent). But it currently has zero *evidence* wired
in — no case study MDX, no podcast audio, no video previews. The scaffold
is right; the payload isn't.

---

## 💡 Ideas & options

**Option A — Ship the scaffold as planned (Sprints 1–6 unchanged).**
- +: momentum, timeline holds, aesthetic proven right by ui-ux-pro flow.
- −: WebGL background before case study bodies is inverted priority. If
  visitors bounce, it won't be because the shader isn't good enough.

**Option B — Pivot: Sprint 1 = case study bodies, Sprint 2 = WebGL, then
Sprints 3–6 as-is.**
- +: content-first, the *actual* proof-point ships earlier. Scaffold
  still ships something visible on day 1.
- −: less "wow" on first pass. Case study writing is done though (5 MDX
  bodies exist), so this is a paste-and-format job, not creative work.

**Option C — Kill the case study modal-as-route (Sprint 4), inline all 5
case studies as sections in the single scroll.**
- +: simpler, no route intercepts, better perceived depth ("this page
  never ends").
- −: harder to link to a specific case study, kills OG images per study,
  and the podcast player wants a stable per-episode URL.

**Option D — Ship a Vercel preview now with the scaffold + MDX bodies, get
a live URL for testing before more sprints.**
- +: catches deploy issues early. Real domain contrasts against localhost
  which always looks better.
- −: adds ~20 min, but no real downside.

**Option E — Reduce scope to 3 case studies (Noble, Angel, smm-factory),
drop Lexora and Fieldmark from the grid.**
- +: tighter narrative, easier to remember, all three are the strongest
  proof-points.
- −: loses breadth signal. Fieldmark and Lexora demonstrate mobile
  competence which the other three don't.

---

## ⚡ Quick wins vs deep work

**< 1 day:**
- Paste 5 case study MDX bodies into `content/case-studies/` (drafts exist).
- Vercel preview deploy.
- Podcast player component *without* real audio (chapter markers + stub
  MP3 to prove the interaction).
- Contrast-check + reduce-motion audit on the current scaffold.

**> 1 week (deep work):**
- WebGL scene with GPU particles + shader distortion at 60fps M1.
- Voice recording session (~30 min mic time) + ElevenLabs PVC training.
- Render 5 podcast episodes.
- Custom OG image generation route.

**What we should NOT do:**
- Rapier physics — dropped from stack. Not needed for portfolio.
- Additional colors beyond `#00FF88`. STABLE_LOGIC rule.
- Rounded corners anywhere. STABLE_LOGIC rule.
- Adding a blog / long-form MDX system. Case studies aren't a blog; they
  are structured artifacts.

---

## ❓ Open questions

1. **Case study route pattern:** modal-as-route (Sprint 4 as planned) vs
   inline sections (Option C)? This affects link-sharing UX significantly.
2. **Podcast player placement:** header of each case study, or a floating
   player that persists during scroll? Persistent = better listen-through
   rate but adds UI weight.
3. **Analytics floor:** we're shipping to Vercel with `@vercel/analytics`
   installed. Do we need a heatmap tool (Hotjar / Microsoft Clarity) to
   see which sections lose readers? Adds one script, minimal cost.
4. **Contact form vs mailto:** current footer is `mailto:`. Real form
   with spam protection is Sprint 5+ work. Is mailto enough for MVP?
5. **Bilingual (EN / UA)?** All case studies + podcast scripts are in
   English. UA landing page might help discovery but doubles content
   surface. **Recommendation: EN-only for MVP.**
6. **What's the actual URL?** `ruslan.dev`, `grekov.dev`, `something.io`?
   Metadata assumes `ruslan.dev`. Needs decision before deploy.

---

## 🔗 Dependencies & risks

**Dependencies:**
- ElevenLabs PVC subscription ($22/mo) + 30 min recording session → gates
  real podcast audio.
- Vercel account + domain → gates deploy.
- 5 case study MDX bodies (drafts exist, just need paste + light edit).
- 5 project preview videos (currently missing; need short screen-capture
  loops of each product).

**Risks:**
- **WebGL performance on low-end mobile.** Lusion sites *look* like they
  ignore mobile; ours can't afford to. Fallback path (static gradient)
  is already stubbed but needs viewport-based branching, not just
  reduce-motion.
- **Podcast player is a new UI pattern** — chapter-linked audio in a
  case study is unusual. Might confuse first-time visitors. Need clear
  play-state affordance and keyboard support.
- **Voice cloning ethical disclosure.** Every audio player must show a
  visible tag "AI voice clone — full disclosure at [link]". Non-optional.
- **Zero real customer numbers on Noble.** Case study is honest about
  this but a hostile reader will use it as ammunition. Mitigation: lead
  with engineering artifacts (commit hashes, `STABLE_LOGIC.md`) not
  business metrics.

---

## Converged decisions

**DECISION-1: Content before Canvas.**
- Choice: **Adopt Option B.** Sprint 1 pivots to case study MDX + basic
  ProjectCard hover (video-less first pass). WebGL scene moves to Sprint 2.
- Rationale: content is the actual proof-point; WebGL is polish. Also,
  MDX pastes are near-zero-risk (drafts exist), while WebGL is a Sprint's
  worth of GPU work.
- Rejected: Option A (unchanged sprints) — inverts priority; Option C
  (inline all) — kills per-study URLs; Option E (reduce to 3) — loses
  mobile-competence signal.
- Owner: Claude (implementation), Ruslan (content review).
- Next action: write `specs/01-case-study-mdx/` triple.

**DECISION-2: Case study route = modal-as-route (parallel/intercept).**
- Choice: keep Sprint 4 as planned. Click from grid opens modal; direct
  URL opens full page. Both share the same MDX body.
- Rationale: preserves shareable URLs (necessary for social discovery and
  the podcast episode links), keeps the single-page-scroll feel for
  browsers, and Next.js App Router does this pattern natively.
- Rejected: inline sections (kills shareable per-study URLs and OG
  images).
- Owner: Claude.
- Next action: schema `content/case-studies/*.mdx` frontmatter in the
  Sprint 4 spec.

**DECISION-3: Podcast player = per-case-study header, not persistent.**
- Choice: audio player lives at the top of each case study route.
  Chapter markers are visible timestamps linked to case study sections.
- Rationale: persistent player fights the immersive scroll aesthetic and
  adds always-visible UI weight; per-page player matches how visitors
  actually consume (open one case, listen or read).
- Rejected: floating persistent player.
- Owner: Claude.
- Next action: audio player component sketch in Sprint 4 spec.

**DECISION-4: Domain = `ruslan.dev`.**
- Choice: register/use `ruslan.dev` if available; fallback to `grekov.dev`.
- Rationale: `.dev` signals developer intent; short first-name-only reads
  as personal folio (right positioning for solo work); it's already in
  `metadataBase`.
- Rejected: `.io` (SaaS overtones), `.me` (personal-blog overtones).
- Owner: Ruslan (registration).
- Next action: Ruslan checks availability, then Claude sets DNS in
  Sprint 6.

**DECISION-5: Analytics = `@vercel/analytics` only for MVP.**
- Choice: no third-party heatmap tool for MVP. Add Microsoft Clarity or
  PostHog in a Phase-2 pass if bounce data warrants it.
- Rationale: one script, GDPR-clean, matches the "shipped fast" ethos.
  Heatmap is a Sprint 6+ nice-to-have.
- Rejected: Hotjar (heavy), PostHog (feature-rich but premature).
- Owner: Ruslan.
- Next action: none until MVP ships.

**DECISION-6: EN-only for MVP; UA path deferred.**
- Choice: all content EN. Revisit after MVP has real traffic data.
- Rationale: all source material is EN; UA target audience is smaller
  and less relevant to the $15–40k contract buyer we're pursuing.
- Rejected: bilingual from day 1.
- Owner: Ruslan.

---

## Action items (priority order)

**ACTION-1 [P0]: Author `specs/01-case-study-mdx/` triple.**
- Skill: manual (speckit not installed) — write `spec.md`, `plan.md`,
  `tasks.md` following the `~/shiploop/skills/shiploop-start/SKILL.md`
  format.
- Blocks: Sprint 1 implementation, MDX toolchain choice
  (`next-mdx-remote` vs `@next/mdx`).

**ACTION-2 [P0]: Contrast + reduce-motion audit of current scaffold.**
- Skill: /shiploop-tester when scaffold has real content.
- Blocks: nothing yet — passive prerequisite.

**ACTION-3 [P1]: Confirm `ruslan.dev` availability.**
- Owner: Ruslan (human action).
- Blocks: deploy DNS in Sprint 6.

**ACTION-4 [P1]: Record 5 project preview videos (10–15s screen loops).**
- Owner: Ruslan (human action).
- Blocks: Sprint 3 hover-preview.

**ACTION-5 [P2]: Vercel preview deploy of Sprint 0 scaffold.**
- Skill: `vercel --prod=false` or `git push` to a Vercel-connected repo.
- Blocks: nothing critical; catches deploy issues before Sprint 1.

**ACTION-6 [P2]: ElevenLabs PVC recording session (blocked on Ruslan).**
- Blocks: real podcast audio in Sprint 4+.

**ACTION-7 [P3]: OG image dynamic route.**
- Deferred to Sprint 6 polish.

---

## What NOT to do (scope guards)

1. **No new colors, no rounded corners, no third font family.** These are
   STABLE_LOGIC rules; violations require a discussion, not a diff.
2. **No blog system, no CMS, no headless anything.** Case studies are MDX
   files in-repo; that's the CMS.
3. **No physics engine (Rapier), no post-processing (bloom, DOF).** WebGL
   scene stays purely instanced particles + one shader plane.
4. **No customer testimonials that aren't real.** The case studies are
   explicit about zero customers on some projects. Keep it honest.
5. **No hero video autoplay.** Lusion aesthetic forbids it; also mobile
   data cost concerns.
6. **No mailing list capture, no popup modals, no cookie banner unless a
   legal requirement kicks in.** Contact = `mailto:` for MVP.

---

## Ready to proceed?

Next command: **author `specs/01-case-study-mdx/spec.md`** (Action-1).
After that, sprint order becomes:

```
Sprint 1 → Case study MDX + basic project cards (video-less first pass)
Sprint 2 → WebGL Canvas (particles + shader)
Sprint 3 → Hover video previews on cards
Sprint 4 → Case study modal-as-route + AudioPlayer
Sprint 5 → About + Footer polish
Sprint 6 → a11y audit + Vercel deploy + OG images
```
