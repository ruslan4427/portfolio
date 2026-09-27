import { ImageResponse } from "next/og";
import { getBlogPost, getBlogPosts, type BlogFormat } from "@/content/blog";
import { playfairFonts } from "@/lib/og-fonts";
import { OG_SIZE, OgLayout } from "@/lib/og-template";

export const alt = "Post — Ruslan Hrekov";
export const size = OG_SIZE;
export const contentType = "image/png";

const formatLabel: Record<BlogFormat, string> = {
  "case-study": "Case Study",
  "build-log": "Build Log",
  skeptic: "Field Note",
  pattern: "Pattern",
};

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.map((p) => ({ slug: p.frontmatter.slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  const title = post?.frontmatter.title ?? "Journal entry";
  const subtitle = post?.frontmatter.tagline ?? "";
  const eyebrow = post
    ? `Journal · ${formatLabel[post.frontmatter.format]}`
    : "Journal";
  const fonts = await playfairFonts();

  return new ImageResponse(
    (
      <OgLayout
        eyebrow={`Ruslan Hrekov · ${eyebrow}`}
        title={title}
        subtitle={subtitle}
        footerRight={`hrekov.dev/blog/${slug}`}
      />
    ),
    { ...OG_SIZE, fonts },
  );
}
