import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { blogComponents } from "./BlogComponents";
import { mdxComponents } from "./MdxComponents";

export function CaseStudyBody({ source }: { source: string }) {
  return (
    <MDXRemote
      source={source}
      components={{ ...mdxComponents, ...blogComponents }}
      options={{
        mdxOptions: {
          remarkPlugins: [remarkGfm],
        },
        blockJS: false,
      }}
    />
  );
}
