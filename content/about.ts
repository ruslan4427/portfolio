export type Value = {
  title: string;
  body: string;
};

// TODO(ruslan): swap in your real long-form bio (3-4 paragraphs).
export const bio: string[] = [
  "I'm Ruslan Hrekov — a solo builder shipping production software with Claude at the keyboard and taste at the helm. I run a studio of one out of Kyiv → Ohio, and I've spent the last two years turning the AI-collaboration workflow from a novelty into a reliable operating system.",
  "The register I care about is honesty. Every case study on this site links to commit hashes; every claim about scale points to a number I can defend; every one of the five shipped projects passed through the same spec-plan-DEVLOG loop before a single line landed in production.",
  "My taste settles late in the process, not early. I'll rewrite a design token before I refactor a feature, and I'll kill a nice-looking abstraction the moment it starts hiding decisions. Claude does the typing. I do the pivots, the frozen-logic calls, and the parts that only matter when a user is watching.",
];

// TODO(ruslan): refine these principles — currently drafted from the DEVLOG pattern.
export const values: Value[] = [
  {
    title: "Ship spec-first",
    body: "Nothing gets built without a spec, a plan, and a tasks file. The 20 minutes of writing saves a day of re-work every single time.",
  },
  {
    title: "One decision at a time",
    body: "Batching architectural choices is how you end up rewriting three of them at once. I pick, ship, review, then pick again.",
  },
  {
    title: "Numbers over screenshots",
    body: "A commit hash and a benchmark beat a slick demo. If the number isn't there, the claim isn't either.",
  },
  {
    title: "Reduce-motion first, always",
    body: "Every animation ships with a static fallback. Every canvas gates on hover-capability. The site works for the reader who needs it to be still.",
  },
];
