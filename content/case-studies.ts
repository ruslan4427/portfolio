import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import type { Artifact } from "@/content/blog";

export type DevlogRef = {
  date: string;
  entry: string;
  summary: string;
  href?: string;
};

export type CaseStudyFrontmatter = {
  slug: string;
  title: string;
  tagline: string;
  role: string;
  stack: string[];
  year: string;
  status: string;
  featured?: boolean;
  publishedAt: string;
  readingTime: number;
  recruiterSummary?: string;
  supportingArtifacts?: Artifact[];
  devlogRefs?: DevlogRef[];
};

export type CaseStudy = {
  frontmatter: CaseStudyFrontmatter;
  source: string;
};

const CASE_STUDIES_DIR = path.join(process.cwd(), "content", "case-studies");

export async function getCaseStudy(slug: string): Promise<CaseStudy | null> {
  try {
    const filePath = path.join(CASE_STUDIES_DIR, `${slug}.mdx`);
    const raw = await readFile(filePath, "utf8");
    const { data, content } = matter(raw);
    return {
      frontmatter: data as CaseStudyFrontmatter,
      source: content,
    };
  } catch {
    return null;
  }
}

export async function getAllCaseStudies(): Promise<CaseStudy[]> {
  const files = await readdir(CASE_STUDIES_DIR);
  const studies = await Promise.all(
    files
      .filter((f) => f.endsWith(".mdx"))
      .map(async (f) => {
        const slug = f.replace(/\.mdx$/, "");
        return getCaseStudy(slug);
      }),
  );
  return studies.filter((s): s is CaseStudy => s !== null);
}
