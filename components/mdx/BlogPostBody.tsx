import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { mdxComponents } from "./MdxComponents";
import { blogComponents } from "./BlogComponents";
import type { BlogFormat } from "@/content/blog";

const containerClass: Record<BlogFormat, string> = {
  "case-study": "max-w-[65ch]",
  "build-log": "max-w-[62ch]",
  skeptic: "max-w-[70ch]",
  pattern: "max-w-[65ch]",
};

export function BlogPostBody({
  source,
  format,
}: {
  source: string;
  format: BlogFormat;
}) {
  return (
    <div className={`mx-auto ${containerClass[format]}`}>
      <MDXRemote
        source={source}
        components={{ ...mdxComponents, ...blogComponents }}
        options={{
          mdxOptions: {
            remarkPlugins: [remarkGfm],
          },
        }}
      />
    </div>
  );
}
