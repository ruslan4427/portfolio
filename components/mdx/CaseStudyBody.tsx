import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { blogComponents } from "./BlogComponents";
import {
  CompareGrid,
  Diagram,
  FlowSchema,
  PhoneRow,
  StackRow,
  TechNotes,
} from "./CaseStudySchemas";
import {
  Figure,
  ImpactStats,
  NumberedCards,
  Pullquote,
  ValueStatement,
} from "./CaseStudyVisuals";
import { mdxComponents } from "./MdxComponents";

export function CaseStudyBody({ source }: { source: string }) {
  return (
    <MDXRemote
      source={source}
      components={{
        ...mdxComponents,
        ...blogComponents,
        ValueStatement,
        NumberedCards,
        Pullquote,
        ImpactStats,
        Figure,
        CompareGrid,
        Diagram,
        FlowSchema,
        PhoneRow,
        StackRow,
        TechNotes,
      }}
      options={{
        mdxOptions: {
          remarkPlugins: [remarkGfm],
        },
        blockJS: false,
      }}
    />
  );
}
