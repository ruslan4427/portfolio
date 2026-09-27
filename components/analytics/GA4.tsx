"use client";

import Script from "next/script";
import { useConsent } from "./ConsentContext";

export function GA4() {
  const { analyticsAllowed } = useConsent();
  const measurementId = process.env.NEXT_PUBLIC_GA_ID;

  if (!measurementId || !analyticsAllowed) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('config', '${measurementId}', {
            anonymize_ip: true,
            send_page_view: false
          });
        `}
      </Script>
    </>
  );
}
