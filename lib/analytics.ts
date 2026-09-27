type GtagFn = (
  command: "config" | "event" | "js" | "set" | "consent",
  targetOrEvent: string | Date,
  params?: Record<string, unknown>,
) => void;

declare global {
  interface Window {
    gtag?: GtagFn;
    dataLayer?: unknown[];
  }
}

export function track(event: string, params?: Record<string, unknown>): void {
  if (typeof window === "undefined") return;
  window.gtag?.("event", event, params);
}
