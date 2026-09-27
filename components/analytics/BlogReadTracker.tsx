"use client";

import { useEffect, useRef } from "react";
import { useConsent } from "./ConsentContext";
import { track } from "@/lib/analytics";

export function BlogReadTracker({ slug }: { slug: string }) {
  const { analyticsAllowed } = useConsent();
  const sentinel = useRef<HTMLDivElement | null>(null);
  const fired = useRef(false);

  useEffect(() => {
    fired.current = false;
  }, [slug]);

  useEffect(() => {
    if (!analyticsAllowed) return;
    const node = sentinel.current;
    if (!node || typeof IntersectionObserver === "undefined") return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !fired.current) {
            fired.current = true;
            track("blog_post_read", { slug });
            io.disconnect();
            break;
          }
        }
      },
      { rootMargin: "0px 0px -20% 0px", threshold: 0 },
    );
    io.observe(node);
    return () => io.disconnect();
  }, [analyticsAllowed, slug]);

  return <div ref={sentinel} aria-hidden data-blog-read-sentinel="" />;
}
