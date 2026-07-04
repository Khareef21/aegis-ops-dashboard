import { supabase } from "@/lib/supabase"

export type TriageStatus = "CRITICAL" | "WARNING" | "OK"

export type TriageEvent = {
  id: string
  vendor_name: string
  sku: string
  delay_days: number
  revenue_at_risk: number
  status: TriageStatus
  draft_reply: string
}

/**
 * SWR fetcher: reads triage events live from the Supabase `triage_events`
 * table, ordered by revenue at risk (highest first).
 */
export async function fetchTriageEvents(): Promise<TriageEvent[]> {
  const { data, error } = await supabase
    .from("triage_events")
    .select("*")
    .order("revenue_at_risk", { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  return (data ?? []) as TriageEvent[]
}
