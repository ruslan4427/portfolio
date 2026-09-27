import { getBlogPosts, type BlogPost } from "@/content/blog";

export const dynamic = "force-static";
export const revalidate = 3600;

const BASE = "https://hrekov.dev";
const FEED_TITLE = "hrekov.dev · Journal";
const FEED_DESC =
  "Case studies, build logs, and field notes on shipping software with AI as a collaborator.";

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function toRfc822(iso: string): string {
  return new Date(`${iso}T12:00:00Z`).toUTCString();
}

function renderItem(post: BlogPost): string {
  const url = `${BASE}/blog/${post.frontmatter.slug}`;
  const category = post.frontmatter.tags[0] ?? "";
  return `    <item>
      <title>${escapeXml(post.frontmatter.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${toRfc822(post.frontmatter.publishedAt)}</pubDate>
      ${category ? `<category>${escapeXml(category)}</category>` : ""}
      <description><![CDATA[${post.frontmatter.tagline}]]></description>
    </item>`;
}

function renderRss(posts: BlogPost[]): string {
  const lastBuild = posts[0]
    ? toRfc822(posts[0].frontmatter.publishedAt)
    : new Date().toUTCString();
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(FEED_TITLE)}</title>
    <link>${BASE}/blog</link>
    <atom:link href="${BASE}/rss.xml" rel="self" type="application/rss+xml" />
    <description>${escapeXml(FEED_DESC)}</description>
    <language>en-us</language>
    <lastBuildDate>${lastBuild}</lastBuildDate>
${posts.map(renderItem).join("\n")}
  </channel>
</rss>`;
}

export async function GET() {
  const posts = await getBlogPosts();
  const xml = renderRss(posts);
  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
