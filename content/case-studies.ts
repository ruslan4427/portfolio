import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import type { Artifact, HeroImage } from "@/content/blog";

export type DevlogRef = {
  date: string;
  entry: string;
  summary: string;
  href?: string;
};

export type StackItemFm = {
  name: string;
  slug?: string;
  version?: string;
};

export type TokenScorecardComplexity = "S" | "M" | "L";
export type TokenScorecardTier = 0 | 1 | 2;
export type TokenScorecardModelMix = {
  opus?: number;
  sonnet?: number;
  haiku?: number;
};

export type TokenScorecard = {
  tokens: number | null;
  complexity: TokenScorecardComplexity;
  modelMix: TokenScorecardModelMix;
  duration: string;
  tier: TokenScorecardTier;
};

export type CaseStudyFrontmatter = {
  slug: string;
  title: string;
  tagline: string;
  role: string;
  stack: string[];
  stackItems?: StackItemFm[];
  live?: { label?: string; href: string };
  dateRange?: string;
  year: string;
  status: string;
  featured?: boolean;
  publishedAt: string;
  readingTime: number;
  recruiterSummary?: string;
  supportingArtifacts?: Artifact[];
  devlogRefs?: DevlogRef[];
  heroImage?: HeroImage;
  tokenScorecard?: TokenScorecard;
};

const VALID_COMPLEXITY: readonly TokenScorecardComplexity[] = ["S", "M", "L"];
const VALID_TIERS: readonly TokenScorecardTier[] = [0, 1, 2];
const MIX_KEYS = ["opus", "sonnet", "haiku"] as const;

function fail(slug: string, msg: string): never {
  throw new Error(`[content/case-studies] ${slug}: ${msg}`);
}

function validateTokenScorecard(slug: string, raw: unknown): TokenScorecard {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    fail(slug, "tokenScorecard must be an object");
  }
  const ts = raw as Record<string, unknown>;

  if (
    ts.tokens !== null &&
    (typeof ts.tokens !== "number" || !Number.isFinite(ts.tokens) || ts.tokens < 0)
  ) {
    fail(slug, "tokenScorecard.tokens must be null or a non-negative number");
  }
  if (
    typeof ts.complexity !== "string" ||
    !VALID_COMPLEXITY.includes(ts.complexity as TokenScorecardComplexity)
  ) {
    fail(slug, `tokenScorecard.complexity must be one of ${VALID_COMPLEXITY.join("|")}`);
  }
  if (typeof ts.duration !== "string" || ts.duration.length === 0) {
    fail(slug, "tokenScorecard.duration required");
  }
  if (
    typeof ts.tier !== "number" ||
    !VALID_TIERS.includes(ts.tier as TokenScorecardTier)
  ) {
    fail(slug, `tokenScorecard.tier must be one of ${VALID_TIERS.join("|")}`);
  }

  const mixRaw = ts.modelMix;
  if (!mixRaw || typeof mixRaw !== "object" || Array.isArray(mixRaw)) {
    fail(slug, "tokenScorecard.modelMix must be an object");
  }
  const mix = mixRaw as Record<string, unknown>;
  const cleanMix: TokenScorecardModelMix = {};
  let sum = 0;
  for (const k of MIX_KEYS) {
    const v = mix[k];
    if (v === undefined) continue;
    if (typeof v !== "number" || v < 0 || v > 100) {
      fail(slug, `tokenScorecard.modelMix.${k} must be a number in [0, 100]`);
    }
    cleanMix[k] = v;
    sum += v;
  }
  for (const k of Object.keys(mix)) {
    if (!MIX_KEYS.includes(k as (typeof MIX_KEYS)[number])) {
      fail(slug, `tokenScorecard.modelMix.${k} is not a recognized model family`);
    }
  }
  if (Math.abs(sum - 100) > 0.1) {
    fail(slug, `tokenScorecard.modelMix must sum to 100 (got ${sum})`);
  }

  return {
    tokens: ts.tokens as number | null,
    complexity: ts.complexity as TokenScorecardComplexity,
    modelMix: cleanMix,
    duration: ts.duration as string,
    tier: ts.tier as TokenScorecardTier,
  };
}

export type CaseStudy = {
  frontmatter: CaseStudyFrontmatter;
  source: string;
};

const CASE_STUDIES_DIR = path.join(process.cwd(), "content", "case-studies");

export async function getCaseStudy(slug: string): Promise<CaseStudy | null> {
  let raw: string;
  try {
    const filePath = path.join(CASE_STUDIES_DIR, `${slug}.mdx`);
    raw = await readFile(filePath, "utf8");
  } catch {
    return null;
  }
  const { data, content } = matter(raw);
  const fm = data as Record<string, unknown>;
  const frontmatter: CaseStudyFrontmatter = {
    ...(fm as unknown as CaseStudyFrontmatter),
    tokenScorecard:
      fm.tokenScorecard === undefined
        ? undefined
        : validateTokenScorecard(slug, fm.tokenScorecard),
  };
  return { frontmatter, source: content };
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
