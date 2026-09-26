import type { MetadataRoute } from "next";
import { getAllCaseStudies } from "@/content/case-studies";

const BASE = "https://hrekov.dev";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const studies = await getAllCaseStudies();
  const mostRecentStudy = studies
    .map((s) => new Date(s.frontmatter.publishedAt))
    .sort((a, b) => b.getTime() - a.getTime())[0] ?? now;

  return [
    {
      url: `${BASE}/`,
      lastModified: mostRecentStudy,
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
  ];
}
