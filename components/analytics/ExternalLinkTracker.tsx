"use client";

import { useEffect } from "react";
import { useConsent } from "./ConsentContext";
import { track } from "@/lib/analytics";

const INTERNAL_HOSTS = new Set(["hrekov.dev", "www.hrekov.dev", "localhost"]);

export function ExternalLinkTracker() {
  const { analyticsAllowed } = useConsent();

  useEffect(() => {
    if (!analyticsAllowed) return;

    function onClick(event: MouseEvent) {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest("a");
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href) return;
      if (!/^https?:\/\//i.test(href)) return;

      let host: string;
      try {
        host = new URL(href).host;
      } catch {
        return;
      }
      if (INTERNAL_HOSTS.has(host)) return;

      track("external_link_click", { host, url: href });
    }

    document.addEventListener("click", onClick, { capture: true });
    return () => {
      document.removeEventListener("click", onClick, { capture: true });
    };
  }, [analyticsAllowed]);

  return null;
}
