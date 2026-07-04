"use client"

import useSWR from "swr"
import { ShieldAlert, Loader2, TriangleAlert } from "lucide-react"
import { fetchTriageEvents } from "@/lib/triage-data"
import { TriageCard } from "@/components/triage-card"

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
})

export function TriageDashboard() {
  const { data: events, error, isLoading, mutate } = useSWR("triage_events", fetchTriageEvents)

  const critical = events?.filter((e) => e.status === "CRITICAL").length ?? 0
  const totalAtRisk = events?.reduce((sum, e) => sum + e.revenue_at_risk, 0) ?? 0

  return (
    <main className="min-h-screen bg-[#0f0f0f] text-neutral-100">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-4 border-b border-white/5 pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/10 ring-1 ring-inset ring-red-500/30">
              <ShieldAlert className="h-5 w-5 text-red-400" aria-hidden="true" />
            </span>
            <div>
              <h1 className="text-xl font-semibold tracking-tight text-balance">Aegis Ops</h1>
              <p className="text-sm text-neutral-500">Supply chain triage</p>
            </div>
          </div>

          <dl className="flex items-center gap-6">
            <div>
              <dt className="text-[11px] uppercase tracking-wide text-neutral-500">Open events</dt>
              <dd className="mt-0.5 text-lg font-semibold">{events?.length ?? 0}</dd>
            </div>
            <div>
              <dt className="text-[11px] uppercase tracking-wide text-neutral-500">Critical</dt>
              <dd className="mt-0.5 text-lg font-semibold text-red-400">{critical}</dd>
            </div>
            <div>
              <dt className="text-[11px] uppercase tracking-wide text-neutral-500">Revenue at risk</dt>
              <dd className="mt-0.5 text-lg font-semibold">{currency.format(totalAtRisk)}</dd>
            </div>
          </dl>
        </header>

        {isLoading ? (
          <div className="mt-16 flex flex-col items-center justify-center gap-3 text-neutral-500">
            <Loader2 className="h-6 w-6 animate-spin" aria-hidden="true" />
            <p className="text-sm">Loading triage events…</p>
          </div>
        ) : error ? (
          <div className="mt-10 flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/5 p-5 text-sm text-red-300">
            <TriangleAlert className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
            <div>
              <p className="font-semibold text-red-200">Unable to load triage events</p>
              <p className="mt-1 text-red-300/80">{error.message}</p>
              <p className="mt-1 text-red-300/60">
                Confirm NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set and the
                triage_events table exists.
              </p>
            </div>
          </div>
        ) : events && events.length > 0 ? (
          <section
            aria-label="Triage events"
            className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
          >
            {events.map((event) => (
              <TriageCard key={event.id} event={event} onResolved={() => mutate()} />
            ))}
          </section>
        ) : (
          <div className="mt-16 text-center text-sm text-neutral-500">No open triage events.</div>
        )}
      </div>
    </main>
  )
}
