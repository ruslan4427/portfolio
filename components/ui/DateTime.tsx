"use client";

import { useEffect, useState } from "react";

export function DateTime() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const dateStr = now
    ? now.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : " ";
  const timeStr = now
    ? now.toLocaleTimeString("en-US", { hour12: true })
    : " ";

  return (
    <div className="font-sans text-sm leading-tight text-[color:var(--ink-muted)] tabular-nums">
      <div>{dateStr}</div>
      <div>{timeStr}</div>
    </div>
  );
}
