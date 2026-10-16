export type ToolCategory = "entry" | "lifecycle" | "quality" | "meta";

export type Tool = {
  slug: string;
  name: string;
  category: ToolCategory;
  description: string;
  invocation: string;
  whenToUse: string;
};

export const CATEGORY_LABEL: Record<ToolCategory, string> = {
  entry: "Entry point",
  lifecycle: "Lifecycle",
  quality: "Quality + review",
  meta: "Meta",
};

export const INSTALL_COMMAND =
  "curl -sSL https://raw.githubusercontent.com/ruslan4427/claude-shiploop/main/install.sh | bash";

export const tools: Tool[] = [
  {
    slug: "shiploop-start",
    name: "/shiploop-start",
    category: "entry",
    description:
      "Single entry point. Classifies the current state (new project, new feature, continuing work, or status check) and routes to the right phase so you never guess which skill fires first.",
    invocation: "/shiploop-start new-feature description=\"<text>\"",
    whenToUse:
      "First command of any session. If you don't know whether the ask is a spec, a build, or a bug — run this.",
  },
  {
    slug: "shiploop-router",
    name: "/shiploop-router",
    category: "entry",
    description:
      "Classifies any incoming request against the 10-lane table (Quick / Bug / Small / Large / Refactor / Testing / Discovery / Memory / Observer / Expert) and prints the matching protocol.",
    invocation: "/shiploop-router <user request text>",
    whenToUse:
      "You caught yourself about to code before classifying. Pipe the message in and let the classifier call the lane out loud.",
  },
  {
    slug: "shiploop-brainstorm",
    name: "/shiploop-brainstorm",
    category: "lifecycle",
    description:
      "Structured brainstorm at a defined lifecycle stage. Always produces: decisions, open questions, action items, and a memory entry — never a loose doc you have to re-read to find the call.",
    invocation: "/shiploop-brainstorm stage=discovery",
    whenToUse:
      "Discovery before spec. Post-spec stress-test. Post-QA retro. End-of-release retrospective. The stage argument gates which prompts fire.",
  },
  {
    slug: "shiploop-tester",
    name: "/shiploop-tester",
    category: "quality",
    description:
      "Full QA pipeline: automated tests, Nielsen-10 UX heuristics, analytics sanity, prioritized fix tasks, and a QA report. Can scope to tests-only, ux-only, analytics-only, or a specific user story.",
    invocation: "/shiploop-tester tests-only",
    whenToUse:
      "After a build iteration, before merge, or when a feature feels off and you want structured eyes instead of a vibe check.",
  },
  {
    slug: "shiploop-observer",
    name: "/shiploop-observer",
    category: "quality",
    description:
      "Audits the ShipLoop chain itself. Identifies dead agents, overlapping skills, missing lanes. Proposes consolidation or new skills — not another feature, but a workflow upgrade.",
    invocation: "/shiploop-observer full",
    whenToUse:
      "The workflow feels slow or over-engineered. Run after every major phase to keep the ecosystem tight.",
  },
  {
    slug: "shiploop-expert",
    name: "/shiploop-expert",
    category: "quality",
    description:
      "Consults a domain-expert subagent at a defined review phase. Loads a cached capsule from .claude/expertise/<domain>.md or researches a fresh one (hybrid-approved) and returns issue → why → fix findings — never generic advice.",
    invocation: "/shiploop-expert phase=pre-ship",
    whenToUse:
      "Pre-ship second opinion before merge. In-progress sanity check after plan lands. Blind-bug when symptom is clear but root cause is not. 3/3 blind-bug catch rate on first validated capsule.",
  },
  {
    slug: "shiploop-skill-builder",
    name: "/shiploop-skill-builder",
    category: "meta",
    description:
      "Meta-skill for authoring and auditing other skills. Produces a valid SKILL.md for a new agent, or audits existing skills for structural compliance (frontmatter, section order, invocation hints).",
    invocation: "/shiploop-skill-builder create name=<skill> purpose=\"<one-liner>\"",
    whenToUse:
      "You spot a recurring workflow across sessions and want to codify it. Or audit before publishing a skill to a shared repo.",
  },
];
