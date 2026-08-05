import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { completeJson } from "@/lib/twinhire/llm"

// POST /api/twinhire/twin-tick
// Body: { twinId }
// The LLM generates the next hour of business events for the twin —
// sales, support tickets, KPI shifts, competitor moves, etc.
// This makes the continuous simulation genuinely alive.
export const maxDuration = 60
export const dynamic = "force-dynamic"

export async function POST(req: Request) {
  try {
    const { twinId } = (await req.json()) as { twinId?: string }
    if (!twinId) return NextResponse.json({ error: "twinId required" }, { status: 400 })

    const twin = await db.businessTwin.findUnique({ where: { id: twinId } })
    if (!twin) return NextResponse.json({ error: "twin not found" }, { status: 404 })

    const kpis = JSON.parse(twin.kpis)
    const problems = JSON.parse(twin.problems)
    const objectives = JSON.parse(twin.objectives)

    const system = [
      "You are the continuous simulation engine of TwinHire.",
      "You generate realistic business events that would happen in the next hour inside a business digital twin.",
      "Events should feel like a living organization — not scripted.",
      "Respond with STRICT JSON only. No prose, no markdown fences.",
    ].join(" ")

    const user = `Generate 4-6 business events that would happen in the next hour inside this twin.

TWIN: ${twin.code} — ${twin.industry} (${twin.stage}, ${twin.sizeBand})
CURRENT KPIs: ${kpis.map((k: { label: string; value: string }) => `${k.label}=${k.value}`).join(", ")}
KNOWN PROBLEMS: ${problems.join("; ")}
OBJECTIVES: ${objectives.join("; ")}

Return JSON with EXACTLY this shape:
{
  "events": [
    {
      "type": "sale" | "support_ticket" | "meeting" | "customer_complaint" | "invoice" | "supplier_issue" | "competitor_move" | "employee_change" | "kpi_shift" | "campaign_launch",
      "description": "string — what happened, 1 sentence, specific and realistic",
      "impact": "string — the business impact, 1 short phrase",
      "severity": "info" | "warning" | "critical"
    }
  ],
  "kpiUpdates": [
    { "label": "string — must match an existing KPI label", "newValue": "string", "trend": "up" | "down" | "flat", "delta": "string" }
  ]
}

Requirements:
- Events should be specific to this industry and twin context.
- Include at least 1 "critical" or "warning" event to create urgency.
- KPI updates should be realistic micro-movements (e.g. "3.1x" → "3.0x", not dramatic shifts).
- Make it feel like a real Tuesday afternoon in this business.`

    const result = await completeJson<{
      events: { type: string; description: string; impact: string; severity: string }[]
      kpiUpdates: { label: string; newValue: string; trend: string; delta: string }[]
    }>(system, user)

    // Add timestamps
    const now = new Date()
    const events = (result.events ?? []).map((e, i) => ({
      ...e,
      id: `evt-${Date.now()}-${i}`,
      timestamp: new Date(now.getTime() - i * 60000).toISOString(),
      time: `${i + 1}m ago`,
    }))

    return NextResponse.json({ events, kpiUpdates: result.kpiUpdates ?? [] })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "twin-tick failed" },
      { status: 500 },
    )
  }
}
