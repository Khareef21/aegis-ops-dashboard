import type { TriageStatus } from "@/lib/triage-data"

const STATUS_STYLES: Record<TriageStatus, { dot: string; text: string; bg: string; ring: string }> = {
  CRITICAL: {
    dot: "bg-red-500",
    text: "text-red-400",
    bg: "bg-red-500/10",
    ring: "ring-red-500/30",
  },
  WARNING: {
    dot: "bg-amber-500",
    text: "text-amber-400",
    bg: "bg-amber-500/10",
    ring: "ring-amber-500/30",
  },
  OK: {
    dot: "bg-emerald-500",
    text: "text-emerald-400",
    bg: "bg-emerald-500/10",
    ring: "ring-emerald-500/30",
  },
}

export function StatusBadge({ status }: { status: TriageStatus }) {
  const s = STATUS_STYLES[status]
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold tracking-wide ring-1 ring-inset ${s.bg} ${s.text} ${s.ring}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} aria-hidden="true" />
      {status}
    </span>
  )
}
