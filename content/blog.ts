import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";

export type BlogFormat = "case-study" | "build-log" | "skeptic" | "pattern";

export type ArtifactType =
  | "commit"
  | "pr"
  | "screenshot"
  | "prompt"
  | "cost"
  | "timeline"
  | "link";

export type Artifact = {
  type: ArtifactType;
  label: string;
  href?: string;
  detail?: string;
};

export type DistributionStatus = "pending" | "posted" | "manual" | "failed";

export type DistributionChannel = {
  scheduledFor?: string;
  status: DistributionStatus;
  publishedUrl?: string;
  error?: string;
};

export type BlogDistribution = {
  linkedin?: DistributionChannel;
  devto?: DistributionChannel;
  twitter?: { status: "manual" };
};

export type BlogFrontmatter = {
  title: string;
  slug: string;
  tagline: string;
  publishedAt: string;
  updatedAt?: string;
  format: BlogFormat;
  tags: string[];
  readingTime: number;
  featured: boolean;
  canonical?: string;
  distribution?: BlogDistribution;
  artifacts?: Artifact[];
  related?: string[];
};

export type BlogPost = {
  frontmatter: BlogFrontmatter;
  source: string;
};

const BLOG_DIR = path.join(process.cwd(), "content", "blog");
const VALID_FORMATS: readonly BlogFormat[] = [
  "case-study",
  "build-log",
  "skeptic",
  "pattern",
];
const VALID_ARTIFACT_TYPES: readonly ArtifactType[] = [
  "commit",
  "pr",
  "screenshot",
  "prompt",
  "cost",
  "timeline",
  "link",
];
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

function fail(slug: string, msg: string): never {
  throw new Error(`[content/blog] ${slug}: ${msg}`);
}

function validateArtifact(slug: string, a: unknown, idx: number): Artifact {
  if (!a || typeof a !== "object") {
    fail(slug, `artifacts[${idx}] must be an object`);
  }
  const art = a as Record<string, unknown>;
  if (typeof art.type !== "string" || !VALID_ARTIFACT_TYPES.includes(art.type as ArtifactType)) {
    fail(slug, `artifacts[${idx}].type must be one of ${VALID_ARTIFACT_TYPES.join(" | ")}`);
  }
  if (typeof art.label !== "string" || art.label.length === 0) {
    fail(slug, `artifacts[${idx}].label required`);
  }
  return {
    type: art.type as ArtifactType,
    label: art.label as string,
    href: typeof art.href === "string" ? art.href : undefined,
    detail: typeof art.detail === "string" ? art.detail : undefined,
  };
}

function validateFrontmatter(slug: string, data: Record<string, unknown>): BlogFrontmatter {
  if (typeof data.title !== "string" || !data.title) fail(slug, "title required");
  if (typeof data.slug !== "string" || data.slug !== slug) {
    fail(slug, `frontmatter.slug ("${String(data.slug)}") must match filename ("${slug}")`);
  }
  if (typeof data.tagline !== "string" || !data.tagline) fail(slug, "tagline required");
  if (typeof data.publishedAt !== "string" || !ISO_DATE.test(data.publishedAt)) {
    fail(slug, "publishedAt must be YYYY-MM-DD");
  }
  if (data.updatedAt !== undefined && (typeof data.updatedAt !== "string" || !ISO_DATE.test(data.updatedAt))) {
    fail(slug, "updatedAt must be YYYY-MM-DD if set");
  }
  if (typeof data.format !== "string" || !VALID_FORMATS.includes(data.format as BlogFormat)) {
    fail(slug, `format must be one of ${VALID_FORMATS.join(" | ")}`);
  }
  if (!Array.isArray(data.tags) || !data.tags.every((t) => typeof t === "string")) {
    fail(slug, "tags must be string[]");
  }
  if (typeof data.readingTime !== "number" || data.readingTime <= 0) {
    fail(slug, "readingTime must be a positive number");
  }
  if (typeof data.featured !== "boolean") fail(slug, "featured must be boolean");
  if (data.featured && (typeof data.tagline !== "string" || data.tagline.length < 10)) {
    fail(slug, "featured posts must have a substantive tagline");
  }

  const artifacts = Array.isArray(data.artifacts)
    ? data.artifacts.map((a, i) => validateArtifact(slug, a, i))
    : undefined;

  return {
    title: data.title,
    slug,
    tagline: data.tagline,
    publishedAt: data.publishedAt,
    updatedAt: data.updatedAt as string | undefined,
    format: data.format as BlogFormat,
    tags: data.tags as string[],
    readingTime: data.readingTime,
    featured: data.featured,
    canonical: typeof data.canonical === "string" ? data.canonical : undefined,
    distribution: data.distribution as BlogDistribution | undefined,
    artifacts,
    related: Array.isArray(data.related) && data.related.every((s) => typeof s === "string")
      ? (data.related as string[])
      : undefined,
  };
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    const filePath = path.join(BLOG_DIR, `${slug}.mdx`);
    const raw = await readFile(filePath, "utf8");
    const { data, content } = matter(raw);
    const frontmatter = validateFrontmatter(slug, data as Record<string, unknown>);
    if (isFuture(frontmatter.publishedAt)) return null;
    return { frontmatter, source: content };
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw err;
  }
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  let files: string[];
  try {
    files = await readdir(BLOG_DIR);
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw err;
  }
  const seen = new Set<string>();
  const posts = await Promise.all(
    files
      .filter((f) => f.endsWith(".mdx"))
      .map(async (f) => {
        const slug = f.replace(/\.mdx$/, "");
        if (seen.has(slug)) fail(slug, "duplicate slug");
        seen.add(slug);
        return getBlogPost(slug);
      }),
  );
  return posts
    .filter((p): p is BlogPost => p !== null)
    .sort((a, b) => (a.frontmatter.publishedAt < b.frontmatter.publishedAt ? 1 : -1));
}

export async function getFeaturedBlogPosts(): Promise<BlogPost[]> {
  const posts = await getBlogPosts();
  return posts.filter((p) => p.frontmatter.featured);
}

function isFuture(iso: string): boolean {
  const today = new Date().toISOString().slice(0, 10);
  return iso > today;
}
