"use client"

import { useState } from "react"
import { Check, X, Clock, Loader2 } from "lucide-react"
import type { TriageEvent } from "@/lib/triage-data"
import { StatusBadge } from "@/components/status-badge"

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
})

type Resolution = "approved" | "rejected" | null

export function TriageCard({ event, onResolved }: { event: TriageEvent; onResolved?: () => void }) {
  const [reply, setReply] = useState(event.draft_reply)
  const [resolution, setResolution] = useState<Resolution>(null)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const delayCritical = event.delay_days >= 10

  async function handleApprove() {
    setPending(true)
    setError(null)
    try {
      const res = await fetch(`http://localhost:8001/triage/${event.id}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reply }),
      })
      if (!res.ok) {
        throw new Error(`Approve failed (${res.status})`)
      }
      setResolution("approved")
      // Refresh the dashboard data after a successful approval.
      onResolved?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Approve request failed")
    } finally {
      setPending(false)
    }
  }

  return (
    <article
      className={`flex flex-col rounded-xl border border-white/5 bg-[#1a1a1a] p-5 transition-opacity ${
        resolution ? "opacity-60" : "opacity-100"
      }`}
    >
      <header className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="truncate text-base font-semibold text-neutral-100">{event.vendor_name}</h2>
          <p className="mt-0.5 font-mono text-xs text-neutral-500">SKU {event.sku}</p>
        </div>
        <StatusBadge status={event.status} />
      </header>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-lg bg-black/30 px-3 py-2.5">
          <p className="text-[11px] uppercase tracking-wide text-neutral-500">Delay</p>
          <p
            className={`mt-1 flex items-center gap-1.5 text-lg font-semibold ${
              delayCritical ? "text-red-400" : "text-neutral-100"
            }`}
          >
            <Clock className="h-4 w-4" aria-hidden="true" />
            {event.delay_days} {event.delay_days === 1 ? "day" : "days"}
          </p>
        </div>
        <div className="rounded-lg bg-black/30 px-3 py-2.5">
          <p className="text-[11px] uppercase tracking-wide text-neutral-500">Revenue at Risk</p>
          <p className="mt-1 text-lg font-semibold text-neutral-100">{currency.format(event.revenue_at_risk)}</p>
        </div>
      </div>

      <div className="mt-4 flex flex-col">
        <label htmlFor={`reply-${event.id}`} className="mb-1.5 text-xs font-medium text-neutral-400">
          Draft reply
        </label>
        <textarea
          id={`reply-${event.id}`}
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          disabled={!!resolution}
          rows={4}
          className="w-full resize-none rounded-lg border border-white/10 bg-[#111] px-3 py-2 text-sm leading-relaxed text-neutral-200 placeholder:text-neutral-600 focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500 disabled:cursor-not-allowed"
          placeholder="Write a reply to the vendor..."
        />
      </div>

      <div className="mt-4 flex items-center gap-3">
        {resolution ? (
          <p
            className={`text-sm font-medium ${
              resolution === "approved" ? "text-emerald-400" : "text-red-400"
            }`}
          >
            {resolution === "approved" ? "Reply approved & sent" : "Reply rejected"}
          </p>
        ) : (
          <>
            <button
              type="button"
              onClick={handleApprove}
              disabled={pending}
              className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {pending ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              ) : (
                <Check className="h-4 w-4" aria-hidden="true" />
              )}
              {pending ? "Approving…" : "Approve"}
            </button>
            <button
              type="button"
              onClick={() => setResolution("rejected")}
              disabled={pending}
              className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-neutral-300 transition-colors hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-neutral-500/50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <X className="h-4 w-4" aria-hidden="true" />
              Reject
            </button>
          </>
        )}
      </div>
      {error ? <p className="mt-2 text-xs text-red-400">{error}</p> : null}
    </article>
  )
}
