type Status = "available" | "booking" | "unavailable";

const dotColor: Record<Status, string> = {
  available: "var(--status-live)",
  booking: "var(--ink-muted)",
  unavailable: "var(--ink-faint)",
};

export function StatusPill({
  status,
  label,
}: {
  status: Status;
  label: string;
}) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--hairline)] bg-[color:var(--bg-elevated)] px-3.5 py-1.5 text-sm text-[color:var(--ink-primary)] shadow-[var(--shadow-card)]">
      <span
        aria-hidden
        className="relative flex h-2 w-2"
      >
        {status === "available" && (
          <span
            className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60"
            style={{ background: dotColor[status] }}
          />
        )}
        <span
          className="relative inline-flex h-2 w-2 rounded-full"
          style={{ background: dotColor[status] }}
        />
      </span>
      <span className="font-sans">{label}</span>
    </div>
  );
}
