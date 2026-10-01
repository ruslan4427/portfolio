import { readFile } from "node:fs/promises";
import path from "node:path";
import { parseArgs } from "node:util";
import matter from "gray-matter";
import { publishToDevto } from "../lib/distribution/devto.mjs";
import { publishToLinkedIn } from "../lib/distribution/linkedin.mjs";

const { values } = parseArgs({
  options: {
    slug: { type: "string" },
    channel: { type: "string" },
    "dry-run": { type: "boolean", default: false },
    live: { type: "boolean", default: false },
  },
});

if (!values.slug || !values.channel) {
  console.error("usage: node scripts/publish-one.mjs --slug <s> --channel <devto|linkedin> [--dry-run|--live]");
  process.exit(2);
}

const dryRun = !values.live;
if (!dryRun) {
  console.log("[publish-one] --live requested; this will hit the real API.");
}

const mdxPath = path.join(process.cwd(), "content", "blog", `${values.slug}.mdx`);
const raw = await readFile(mdxPath, "utf8");
const { content, data } = matter(raw);

const post = {
  slug: values.slug,
  frontmatter: data,
  mdxSource: content,
  canonicalUrl: `https://hrekov.dev/blog/${values.slug}`,
};

const publisher =
  values.channel === "devto"
    ? publishToDevto
    : values.channel === "linkedin"
      ? publishToLinkedIn
      : null;

if (!publisher) {
  console.error(`unknown channel: ${values.channel}`);
  process.exit(2);
}

const result = await publisher(post, { dryRun });
console.log("\n[publish-one] result:", JSON.stringify(result, null, 2));
