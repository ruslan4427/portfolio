import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { AgentReplayFor } from "@/components/case-study/AgentReplay";
import { rehypeCaseSections } from "@/lib/rehype-case-sections";
import { blogComponents } from "./BlogComponents";
import {
  ActivityChart,
  CompareGrid,
  Diagram,
  FlowSchema,
  PaybackBar,
  PhoneRow,
  RaceTimeline,
  StackRow,
  TechNotes,
  WireflowMap,
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
        AgentReplay: AgentReplayFor,
        ValueStatement,
        NumberedCards,
        Pullquote,
        ImpactStats,
        Figure,
        ActivityChart,
        CompareGrid,
        Diagram,
        FlowSchema,
        PaybackBar,
        PhoneRow,
        RaceTimeline,
        StackRow,
        TechNotes,
        WireflowMap,
      }}
      options={{
        mdxOptions: {
          remarkPlugins: [remarkGfm],
          rehypePlugins: [rehypeCaseSections],
        },
        blockJS: false,
      }}
    />
  );
}
