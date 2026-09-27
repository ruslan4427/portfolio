# hrekov.dev — Blog Style Guide

**Audience priority:** technical recruiters and hiring founders (primary), engineering managers (secondary), peer practitioners (tertiary — but their approval creates recruiter-facing credibility).

**Scope:** applies to blog posts on hrekov.dev, cross-posts to dev.to, LinkedIn native adaptations, and X threads.

---

## 1. Executive summary

The single insight: **recruiters trust posts that read like a peer practitioner reviewing your work, not like a personal brand.** The way you get that is by anchoring every post to something verifiable — a diff, a prompt log, a token count, a PR number, a screenshot with the timestamp visible — and by leading with the problem or the artifact, not with yourself. Simon Willison, Armin Ronacher, and the Anthropic customer stories that recruiters actually cite ([Ramp](https://claude.com/customers/ramp), [Stripe](https://claude.com/customers/stripe), [Rakuten](https://claude.com/customers/rakuten)) share one trait: every claim is instrumented with a number, a link, or a reproducible artifact. The absence of that instrumentation is what makes a post read as "content marketing" instead of "engineering."

---

## 2. Candidate style directions

### A. The receipts-first practitioner

**Voice.** First-person, technical, understated. Every claim is followed by a concrete artifact: a diff, a token count, a prompt, a commit hash, a screenshot. Emotion appears only as flat observation ("this surprised me"). No superlatives.

**When to use it.** Case studies where you have real production data. Anything where you're describing what you shipped and how.

**Real examples that embody it.**
- Anthropic's Stripe case study: "migrated 10,000 lines of Scala to Java in four days, a project estimated at ten engineering weeks without AI assistance" ([claude.com/customers/stripe](https://claude.com/customers/stripe))
- Anthropic's Ramp case study: "1+ million lines of AI-suggested code implemented in just 30 days, 50% weekly active usage across engineering, and up to 80% reduction in incident investigation time" ([claude.com/customers/ramp](https://claude.com/customers/ramp))
- Armin Ronacher's "Agentic Coding Recommendations" ([lucumr.pocoo.org/2025/6/12/agentic-coding/](https://lucumr.pocoo.org/2025/6/12/agentic-coding/)) — every recommendation is grounded in a specific tool choice ("I use Sonnet, not Opus") with the reasoning.

**Pros.** Maximum credibility with recruiters and engineering managers. Post survives skimming — the numbers stand out even in a 6-second scan. Aligns with what recruiters explicitly say they look for: "every filler word becomes one concrete action verb plus one verifiable number" ([Velyq](https://velyq.com/en/blog/ia-cv-detection-3-traces)).

**Cons.** Slow to produce (requires instrumenting your work upfront). If overused across every post, starts to read as clinical/corporate. Weak for opinion pieces where you don't have a shipping receipt.

---

### B. The disciplined skeptic

**Voice.** Peer-level, opinionated but rigorously argued. You take an industry claim ("AI 10x's productivity") and dismantle or refine it using your own data. Willing to say "this is the part where I was wrong."

**When to use it.** Reflection pieces after a project. Contrarian takes on trends. Anything that would otherwise sound like "another AI hot take."

**Real examples that embody it.**
- Simon Willison, "Vibe coding and agentic engineering are getting closer than I'd like" ([simonwillison.net/2026/May/6/vibe-coding-and-agentic-engineering/](https://simonwillison.net/2026/May/6/vibe-coding-and-agentic-engineering/)) — publicly admits he stopped reviewing AI-generated production code, names it "normalization of deviance."
- Ronacher & Zechner's "vibe slop" WSJ piece (referenced in [fast.ai's "Breaking the Spell of Vibe Coding"](https://www.fast.ai/posts/2026-01-28-dark-flow/)) — practitioners who used the tools heavily calling out their own community.
- Praveen Rajamani's "AI Didn't Make Software Engineering Easier. It Made the Hard Parts Harder" on dev.to (92 reactions, 74 comments) — argues the execution layer is solved and the residual 20% is now the whole job.

**Pros.** Signals seniority. Recruiters and eng managers explicitly filter for candidates who can distinguish signal from hype. Contrarian posts get shared more than agreeable ones.

**Cons.** Requires deep enough exposure that your dissent reads as informed, not reactive. If your critique doesn't land with concrete evidence, it flips into "hot take" territory and hurts credibility.

---

### C. The build-log

**Voice.** Chronological, transparent, slightly conversational. You narrate what happened in the order it happened, including dead ends. Reads more like a lab notebook than an essay.

**When to use it.** Small, contained builds where the story is the process, not the outcome. Weekly notes. "I spent Saturday on X, here's what happened."

**Real examples that embody it.**
- Simon Willison's weblog format ([simonwillison.net](https://simonwillison.net)) — many entries are one-paragraph-plus-artifact "here's a thing I tried" notes rather than essays.
- Thorsten Ball's reflection on building on his phone with Claude Code (referenced in [Pragmatic Engineer](https://newsletter.pragmaticengineer.com/p/when-ai-writes-almost-all-code-what)) — narrates the physical setup, not just the outcome.
- Boris Tane, "How I Use Claude Code" ([boristane.com/blog/how-i-use-claude-code/](https://boristane.com/blog/how-i-use-claude-code/)) — walks through his actual setup with specific commands.

**Pros.** Low cost to produce. Compounds — 50 build-logs read as a body of work in a way that 5 essays don't. Signals that you actually work, not just theorize.

**Cons.** Individually low-impact for recruiters skimming a portfolio. Needs a curated top-level index ("Best of" or "Start here") so recruiters see the substantial pieces first.

---

### D. The case-study-as-teardown

**Voice.** Third-person about the project, first-person about the decisions. Structured like a post-mortem: problem, constraints, options considered, decision, outcome, what I'd change. Numbers are load-bearing.

**When to use it.** Portfolio-anchor pieces. One per major project. This is what recruiters click when they want to know "can this person actually ship."

**Real examples that embody it.**
- The Anthropic customer stories are the reference implementation: [Rakuten (79% cut in feature time-to-market)](https://claude.com/customers/rakuten), [HubSpot (40% productivity increase, specific rebrand context)](https://claude.com/customers/hubspot), [Classmethod (108 → 165 merged PRs)](https://claude.com/customers/classmethod).
- Vercel's "What we learned building agents at Vercel" ([vercel.com/blog/what-we-learned-building-agents-at-vercel](https://vercel.com/blog/what-we-learned-building-agents-at-vercel)) — company teardown of their own agent methodology.
- Vercel's "We removed 80% of our agent's tools" ([vercel.com/blog/we-removed-80-percent-of-our-agents-tools](https://vercel.com/blog/we-removed-80-percent-of-our-agents-tools)) — single-decision teardown, one strong number in the title.

**Pros.** Directly answers the recruiter question ("what have you shipped and how did you think about it"). Highest-leverage format per hour invested. Reusable — anchors your `/work/[slug]` pages.

**Cons.** Requires client permission to publish numbers. Fractional/consulting work often can't disclose enough to make this format land.

---

### E. The pattern-extractor

**Voice.** Slightly more didactic than the others. You've done a thing 5-10 times, you extract the pattern, you show two or three worked examples. Not a tutorial — an observation.

**When to use it.** After you've accumulated enough repetitions of a workflow to have a real pattern. Not for one-offs.

**Real examples that embody it.**
- Simon Willison's "Agentic Engineering Patterns" guide ([simonwillison.net/guides/agentic-engineering-patterns/](https://simonwillison.net/guides/agentic-engineering-patterns/)) — the whole guide is this format, each chapter a single pattern.
- Ronacher's "Agentic Coding Recommendations" ([lucumr.pocoo.org/2025/6/12/agentic-coding/](https://lucumr.pocoo.org/2025/6/12/agentic-coding/)) — extracted from months of practice, structured as tool-choice + reasoning + counter-example.
- Anthropic's "Best practices for Claude Code" ([anthropic.com/engineering/claude-code-best-practices](https://www.anthropic.com/engineering/claude-code-best-practices)) — corporate but shows the format at its cleanest.

**Pros.** High re-share potential in dev circles. Peer approval flows back to recruiter credibility.

**Cons.** Easy to slip into generic-advice territory ("be specific with your prompts") that reads exactly like the AI-hype content this guide is designed to avoid. Every pattern must be grounded in your own worked example.

---

## 3. Recommended starting direction

**Primary: D (case-study-as-teardown) for anchor posts, C (build-log) for cadence.** Backfill with occasional B (disciplined skeptic) once you have enough shipped receipts to earn opinions.

**Rationale.**
1. The recruiter's job is to answer "can this person ship, and does their reasoning hold up under scrutiny." Format D answers both questions in one post.
2. You already have 5 case studies in `content/case-studies/` — the infrastructure exists. The blog should extend that muscle, not compete with it.
3. Format C is the escape valve. Anchor posts (D) take days; build-logs (C) take an hour. Without a low-cost format, cadence collapses and the blog goes stale — which is itself a recruiter red flag ("long gaps may suggest inactivity" — [Kula](https://www.kula.ai/blog/github-beginners-guide-source-candidates)).
4. Format B (skeptic) is powerful but should be earned. Publishing three teardowns first gives you the standing to publish one skeptical piece without it reading as content marketing.
5. Explicitly avoid opening with Format A alone. Receipts-first without narrative context reads as a spec sheet. Use receipts *inside* Format D.

**Sequencing for the first 90 days.**
- Posts 1–3: Format D, one per existing case study you have permission to publish numbers on.
- Posts 4–8: Format C (build-log), roughly weekly, each anchored to a single working session with real prompts/diffs.
- Post 9: Format B, contrarian take drawn from a pattern you noticed across posts 1–8.
- Post 10: Format E, pattern extracted from the build-logs.

---

## 4. Platform adaptation

The same underlying material has to work three ways. The canonical version lives on hrekov.dev. Adaptations are not summaries — they're re-cuts for a different reader and a different scanning behavior.

### 4.1 Canonical (hrekov.dev)

- **Length:** 900–2,500 words for teardowns, 300–600 for build-logs.
- **Structure:** headline → one-sentence claim with a number → context (2–3 sentences, no origin story) → the work (with artifacts inline) → what I'd change → link to related work.
- **Artifacts inline:** prompt logs in `<pre>` blocks, diffs as code, screenshots with visible timestamps, PR numbers linked.
- **No CTA at the end** — the site's footer card is the sole closer. Don't undermine that.
- **`<time>` element with real publish date** — canonical timing matters for the cross-post canonical_url chain to hold ([DEV Community discussion](https://dev.to/morinaga/how-i-implemented-the-canonical-url-chain-across-devto-hashnode-and-bluesky-50d)).

### 4.2 LinkedIn native

**Non-negotiables based on the platform data:**
- Post as native text, not a link post. Native gets ~5x the distribution.
- **Hook: first ~140 characters visible before the mobile "…more" fold** ([FinalLayer](https://finallayer.com/blog/ideal-linkedin-post-length), [ConnectSafely](https://connectsafely.ai/articles/linkedin-post-best-practices-guide-2026)). Design for that budget.
- **Length: 1,300–1,800 characters (~200–300 words)** — the sweet spot for the "story-driven post" pattern that thought-leadership content sits in.
- Short paragraphs (1–2 sentences each), whitespace between them. No walls of text.
- Link to the canonical post as the *last* line, prefaced with "Full write-up with the diffs and prompts:" — LinkedIn deranks link-out posts, but readers who want the source will click.
- **Do not paste the whole post.** LinkedIn is the trailer, hrekov.dev is the film.

**Hook patterns that work for this audience:**
- The specific number: *"Stripe migrated 10,000 lines of Scala to Java in four days. Here's the part of that story nobody's writing about."* (borrowed structure — adapt to your own numbers)
- The concrete artifact: *"Yesterday I merged a PR where 40% of the diff was written by Claude and 100% of the tests failed on first run. Here's what I changed in my workflow."*
- The counter-intuitive claim: *"I stopped using subagents last week. My throughput went up."* (Willison-style)
- **Avoid:** "3 lessons from…", "The one thing…", "I just discovered…", any first-person-humble-brag structure. Recruiters have seen 10,000 of those this month.

**Forbidden on LinkedIn specifically:**
- Emoji bullet points (fire, rocket, checkmarks). They're the strongest AI-hype signal recruiters flag.
- Asking a question at the end to farm engagement. Peers see through it; recruiters register it as content-marketing behavior.
- The "curiosity gap" hook that withholds the number ("I did X. You won't believe what happened."). Give the number in the hook.

### 4.3 dev.to

- **Frontmatter is load-bearing.** Always include `canonical_url: https://hrekov.dev/blog/[slug]` — dev.to renders a "Originally published at…" line to readers and adds the SEO canonical tag ([DEV Community canonical guidance](https://dev.to/ben/comment/93p9)). **Publish on hrekov.dev first**, then cross-post 24–48h later — the canonical only protects rankings if the original was indexed first ([Cross-posting to dev.to without giving away your SEO](https://dev.to/mk023/cross-posting-to-devto-without-giving-away-your-seo-5gd)).
- **Tags:** 4 max. Pick from `#ai`, `#claude`, `#claudecode`, `#llm`, `#productivity`, `#webdev`, `#nextjs` — whichever three or four actually match. Do not tag `#tutorial` unless it is one.
- **Structure:** dev.to readers scroll fast. Put a TL;DR of 2–3 bullets under the title, before the first heading. Break the body with H2s every 200–300 words.
- **Code inclusion:** dev.to's code blocks render well and are the platform's core value prop. Include *more* code here than on the canonical if the piece has code — dev.to readers want the copy-pasteable version. Keep prompts in fenced blocks (```text) so they're copyable.
- **Title:** dev.to titles need to survive an algorithm and a scanning feed. Concrete + short beats clever + long. "How I cut a 4-hour codebase migration to 40 minutes with Claude Code" beats "On the nature of AI-assisted refactoring." But no clickbait — dev.to's audience punishes it (Praveen Rajamani's high-reaction post title was a claim, not a tease).
- **Cover image:** optional. If included, use a screenshot of an actual artifact from the post (a diff, a terminal output). Avoid stock images and abstract gradients — they signal low-effort cross-post.

### 4.4 X thread

- **Length:** 5–9 posts. Below 5 you're leaving payoff on the table; above 9 dropoff kills the last tweets.
- **Post 1 (hook) formula:** one specific claim + one specific number + implicit promise of the story. Example: *"I migrated a 40k-line Next.js app from Pages Router to App Router in a weekend with Claude Code. Here's the exact workflow — and the two places it made things worse. 🧵"* (The 🧵 is functional signage, not decoration — omit if you dislike it.)
- **Post 2:** the setup — what you had, what the constraint was.
- **Posts 3–7:** one claim per post, each with either a screenshot, a code snippet, or a link. Do not stack multiple claims in one post.
- **Second-to-last post:** the counter-point / what didn't work. This is what makes the thread survive the "hype merchant" filter.
- **Last post:** link to the canonical write-up, framed as "if you want the actual diffs and the prompt log, full write-up here:" — same rule as LinkedIn.
- **Bookmarks are the KPI**, not likes. The 2026 X algorithm weights depth-of-engagement heavily ([Metadata Reactor](https://metadatareactor.com/blog/how-to-go-viral-on-x-twitter-2026/)); a thread saved 40 times outperforms one liked 400 times.

---

## 5. Forbidden list

### 5.1 Words and phrases

| Term | Why it's problematic |
|------|---------------------|
| leverage (v.), leveraging | Empty. Replace with "used" or the specific action. |
| game-changer, game-changing | Signals hype without evidence. |
| revolutionize, revolutionary | Same. |
| unlock, unleash | Empty motion verbs. Recruiters register them as marketing copy. |
| supercharge | Same. |
| 10x developer / 10x productivity | Not a number. If you have a 10x claim, cite the numerator and denominator (Ramp's "1M lines in 30 days" is a real number, "10x productivity" is a slogan). |
| in the age of AI / in today's AI-driven world | Filler. Delete the entire sentence. |
| paradigm shift | Almost always overstates the case. |
| seamless, seamlessly | Vacuous. Never true anyway — describe the friction. |
| harness the power of | Marketing register. Nothing lives here. |
| just | Undercutting hedge ("I just used Claude to…"). Removes credit and reads insecure. |
| basically, essentially | Softeners that dilute the claim. |
| passionate about | Recruiter allergy trigger — see Velyq's explicit callout that "passionate about innovation" is a zero-signal phrase. |
| my journey / my story | First-person origin framing that reads as personal-brand content. |
| game-changer / needle-mover | See above. |
| next-gen, cutting-edge, state-of-the-art | Time-locked and hollow. |
| tapestry, delve, elevate, foster, endeavour | Widely-known LLM tells. Immediate "AI-written" flag ([Velyq](https://velyq.com/en/blog/ia-cv-detection-3-traces)). |
| It's not X, it's Y (as a rhetorical scaffold) | Same. Chatgpt fingerprint. |

### 5.2 Structural patterns

- **The listicle title with a round number** ("5 things", "10 tips", "3 lessons"). Signals content-marketing origin. If you must list, do it inside the post; put the actual claim in the title.
- **The engagement-farming question at the end.** ("What's your experience with Claude Code? Drop a comment below.") Immediate credibility loss with technical audiences.
- **The origin story lead** ("Back in 2019, when I first started coding…"). Get to the artifact by sentence 2.
- **The AI-signature emoji strip** (rocket, checkmark, sparkles as bullet points). Strongest AI-hype visual signal.
- **The "curiosity gap" hook that withholds the outcome.** Give the number in the hook; the "why" is the payoff.
- **Screenshots without visible chrome** (no URL bar, no timestamp, no line numbers). Undated screenshots read as staged. Real ones have the file path visible.
- **"I asked ChatGPT/Claude to write this post."** Even framed as a meta-joke, immediate disqualifier for the recruiter audience.
- **Prompt-engineering as a hero.** The days when "here's a killer prompt I use" carried weight are over ([Matt Pocock's critique of "specs are the new code"](https://x.com/mattpocockuk/status/2009964210667827249) captures the current skepticism). Prompts are supporting evidence, not headline material.

### 5.3 Claims to avoid unless you can prove them

- Any productivity multiplier without a numerator/denominator and a time window.
- Any "10x", "5x", "100x" without linked before/after artifacts.
- Any "AI wrote 100% of this code" claim unless you can point to the commit log. (Dan Shipper can make this claim about Every because he's shown the receipts across a dozen pieces.)
- Any "in production" claim about your own AI-generated code without a deploy URL and a plausible traffic story.

---

## 6. Recruiter-credibility checklist

Every post should score 8+/10. If it scores below, either fix it or don't publish.

1. **One specific, verifiable number in the first 100 words.** Not "significantly faster" — "4 hours instead of the estimated 3 days." If you can't produce one, the piece isn't ready.
2. **At least one linked artifact** (PR, commit, deploy URL, screenshot with visible metadata, prompt log). Recruiters click; peers scrutinize; both need something to click.
3. **A named tool with a version or model name.** "Claude Sonnet 4.5" or "Claude Code v1.x", not "AI" or "an LLM." Specificity of tool signals actual usage.
4. **At least one thing that didn't work.** The disciplined admission is the strongest anti-hype signal available. Willison's "I stopped reviewing production code and that was a mistake" is the reference case.
5. **No unearned first-person superlatives.** ("The best framework I've ever used" is a red flag; "the framework that survived my three failed attempts to replace it" is signal.)
6. **A dated publish timestamp visible in the DOM.** Recruiters check whether the site is alive. Old dates suggest abandonment; missing dates suggest defensiveness.
7. **A "who this is for / who this isn't for" line, or its equivalent.** Not literally required, but the post should make its audience clear in the first paragraph. Ambiguity reads as SEO content.
8. **Zero LLM-tells.** No em-dashes as decorative punctuation, no "It's not X, it's Y" scaffolds, no "delve/tapestry/elevate/foster." Read the piece aloud once; if any sentence sounds like the model's default register, rewrite it.
9. **No engagement-bait in the closing.** No "What do you think?", no CTA to subscribe. Trust the reader.
10. **The post links to at least one prior post of yours by name.** Signals a body of work, not a one-off. Recruiters weight portfolio depth over any single artifact ([Riem.ai's 9 GitHub signals](https://riem.ai/blog/github-recruiting-guide) — the analogous logic applies to writing).

---

## Sources referenced

Practitioners and case studies:
- [Simon Willison's weblog](https://simonwillison.net) and [Agentic Engineering Patterns guide](https://simonwillison.net/guides/agentic-engineering-patterns/)
- [Simon Willison, "Vibe coding and agentic engineering are getting closer than I'd like"](https://simonwillison.net/2026/May/6/vibe-coding-and-agentic-engineering/)
- [Simon Willison, "Agentic Coding" (Jun 2025)](https://simonwillison.net/2025/Jun/29/agentic-coding/)
- [Armin Ronacher, "Agentic Coding Recommendations"](https://lucumr.pocoo.org/2025/6/12/agentic-coding/)
- [Armin Ronacher, "A Year of Vibes"](https://lucumr.pocoo.org/2025/12/22/a-year-of-vibes/)
- [Anthropic, "How Anthropic teams use Claude Code"](https://claude.com/blog/how-anthropic-teams-use-claude-code)
- [Anthropic Best Practices for Claude Code](https://www.anthropic.com/engineering/claude-code-best-practices)
- [Anthropic customer: Stripe](https://claude.com/customers/stripe)
- [Anthropic customer: Ramp](https://claude.com/customers/ramp)
- [Anthropic customer: Rakuten](https://claude.com/customers/rakuten)
- [Anthropic customer: HubSpot](https://claude.com/customers/hubspot)
- [Anthropic customer: Classmethod](https://claude.com/customers/classmethod)
- [Vercel, "What we learned building agents at Vercel"](https://vercel.com/blog/what-we-learned-building-agents-at-vercel)
- [Vercel, "We removed 80% of our agent's tools"](https://vercel.com/blog/we-removed-80-percent-of-our-agents-tools)
- [Steve Yegge, "Revenge of the Junior Developer"](https://sourcegraph.com/blog/revenge-of-the-junior-developer)
- [Boris Tane, "How I Use Claude Code"](https://boristane.com/blog/how-i-use-claude-code/)
- [Boris Cherny on Lenny's Newsletter](https://www.lennysnewsletter.com/p/head-of-claude-code-what-happens)
- [Pragmatic Engineer, "Building Claude Code with Boris Cherny"](https://newsletter.pragmaticengineer.com/p/building-claude-code-with-boris-cherny)
- [fast.ai, "Breaking the Spell of Vibe Coding"](https://www.fast.ai/posts/2026-01-28-dark-flow/)

Platform mechanics:
- [DEV canonical_url best practices (ben)](https://dev.to/ben/comment/93p9)
- [DEV cross-posting SEO guidance](https://dev.to/mk023/cross-posting-to-devto-without-giving-away-your-seo-5gd)
- [DEV canonical chain implementation](https://dev.to/morinaga/how-i-implemented-the-canonical-url-chain-across-devto-hashnode-and-bluesky-50d)
- [LinkedIn post length data (FinalLayer)](https://finallayer.com/blog/ideal-linkedin-post-length)
- [LinkedIn 2026 best practices (ConnectSafely)](https://connectsafely.ai/articles/linkedin-post-best-practices-guide-2026)
- [X thread structure 2026 (Metadata Reactor)](https://metadatareactor.com/blog/how-to-go-viral-on-x-twitter-2026/)

Recruiter/hiring signal:
- [Velyq, "3 traces recruiters detect in 2026"](https://velyq.com/en/blog/ia-cv-detection-3-traces)
- [Kula, "Recruiting on GitHub 2026"](https://www.kula.ai/blog/github-beginners-guide-source-candidates)
- [Riem.ai, "9 GitHub signals that predict engineering quality"](https://riem.ai/blog/github-recruiting-guide)
- [Fonzi, "2026 Technical Hiring Playbook"](https://fonzi.ai/blog/2026-technical-hiring-playbook)

Peer critique / anti-hype:
- [Praveen Rajamani, "AI Didn't Make Software Engineering Easier"](https://dev.to/) — dev.to top-reactions post, May 2026
- [Matt Pocock on "specs are the new code"](https://x.com/mattpocockuk/status/2009964210667827249)

Gaps in the research: I could not directly load individual LinkedIn posts (WebFetch was blocked in this environment), so the LinkedIn-specific pattern analysis relies on aggregated platform data and third-party summaries of individual practitioners' posts rather than firsthand read-throughs. Kelly Vaughn's 2025–2026 posts on AI specifically did not surface in search — the material found was 2022–2024 engineering-leadership content. Julius Tarng did not surface at all in relevant searches; if that name is important, it needs a different lead. Anything above marked as "referenced in" comes from search summaries rather than a full read of the source, and should be verified before quoting.
