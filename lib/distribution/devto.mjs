import { renderMarkdownForDevto } from "./render.mjs";

const DEVTO_API = "https://dev.to/api/articles";
const DEVTO_MAX_TAGS = 4;

function requireEnv(name) {
  const v = process.env[name];
  if (!v) throw new Error(`missing env: ${name}`);
  return v;
}

function slugifyTag(t) {
  return t.toLowerCase().replace(/[^a-z0-9]+/g, "").slice(0, 30);
}

function clampTags(tags) {
  if (!Array.isArray(tags) || tags.length === 0) return [];
  const clean = tags.map(slugifyTag).filter(Boolean);
  return Array.from(new Set(clean)).slice(0, DEVTO_MAX_TAGS);
}

/**
 * Publish a blog post to dev.to as a live article with a canonical URL
 * pointing back to hrekov.dev.
 *
 * @type {import("./types.mjs").Publisher}
 */
export async function publishToDevto(post, opts) {
  const log = opts.log ?? ((m) => console.log(m));
  const body = renderMarkdownForDevto(post.mdxSource, post.frontmatter);
  const tags = clampTags(post.frontmatter.tags);

  const payload = {
    article: {
      title: post.frontmatter.title,
      body_markdown: body,
      published: true,
      canonical_url: post.canonicalUrl,
      description: post.frontmatter.tagline,
      tags,
    },
  };

  if (opts.dryRun) {
    log(`[devto:dry-run] would POST ${DEVTO_API}`);
    log(JSON.stringify(payload, null, 2));
    return {
      publishedUrl: `https://dev.to/dryrun/${post.slug}`,
      remoteId: `dryrun-${post.slug}`,
    };
  }

  const key = requireEnv("DEVTO_API_KEY");
  const res = await fetch(DEVTO_API, {
    method: "POST",
    headers: {
      "api-key": key,
      "content-type": "application/json",
      accept: "application/vnd.forem.api-v1+json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`dev.to POST failed: ${res.status} ${res.statusText} — ${text}`);
  }

  const json = await res.json();
  return {
    publishedUrl: json.url ?? json.canonical_url ?? post.canonicalUrl,
    remoteId: String(json.id ?? ""),
  };
}
