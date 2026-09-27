import type { MetadataRoute } from "next";
import { getAllCaseStudies } from "@/content/case-studies";
import { getBlogPosts } from "@/content/blog";

const BASE = "https://hrekov.dev";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const [studies, posts] = await Promise.all([
    getAllCaseStudies(),
    getBlogPosts(),
  ]);
  const mostRecentStudy = studies
    .map((s) => new Date(s.frontmatter.publishedAt))
    .sort((a, b) => b.getTime() - a.getTime())[0] ?? now;
  const mostRecentPost = posts
    .map((p) => new Date(p.frontmatter.updatedAt ?? p.frontmatter.publishedAt))
    .sort((a, b) => b.getTime() - a.getTime())[0] ?? now;

  return [
    {
      url: `${BASE}/`,
      lastModified: mostRecentStudy > mostRecentPost ? mostRecentStudy : mostRecentPost,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${BASE}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${BASE}/work`,
      lastModified: mostRecentStudy,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${BASE}/blog`,
      lastModified: mostRecentPost,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE}/services`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${BASE}/contact`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.7,
    },
    ...studies.map((s) => ({
      url: `${BASE}/work/${s.frontmatter.slug}`,
      lastModified: new Date(s.frontmatter.publishedAt),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...posts.map((p) => ({
      url: `${BASE}/blog/${p.frontmatter.slug}`,
      lastModified: new Date(p.frontmatter.updatedAt ?? p.frontmatter.publishedAt),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
