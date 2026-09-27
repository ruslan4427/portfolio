"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useConsent } from "./ConsentContext";

export function PageViews() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { analyticsAllowed } = useConsent();

  useEffect(() => {
    if (!analyticsAllowed) return;
    if (typeof window === "undefined" || !window.gtag) return;
    const measurementId = process.env.NEXT_PUBLIC_GA_ID;
    if (!measurementId) return;
    const search = searchParams?.toString();
    const page_path = search ? `${pathname}?${search}` : pathname;
    window.gtag("config", measurementId, {
      page_path,
      anonymize_ip: true,
    });
  }, [pathname, searchParams, analyticsAllowed]);

  return null;
}
