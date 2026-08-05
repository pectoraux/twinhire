import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { completeJson } from "@/lib/twinhire/llm"

// POST /api/twinhire/twin-evolution
// Body: { twinId }
// The LLM generates how the twin has changed recently — new goals, customers,
// competitors, regulations, priorities. Makes the twin genuinely evolve.
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
      "You are the Twin Evolution engine of TwinHire.",
      "You generate realistic business changes that would happen to this company over the last 6 weeks.",
      "The twin evolves — new goals, customers, products, competitors, regulations, priorities, team changes, tech migrations.",
      "Respond with STRICT JSON only. No prose, no markdown fences.",
    ].join(" ")

    const user = `Generate 5-6 evolution events for this twin over the last 6 weeks.

TWIN: ${twin.code} — ${twin.industry} (${twin.stage}, ${twin.sizeBand})
CURRENT KPIs: ${kpis.map((k: { label: string; value: string }) => `${k.label}=${k.value}`).join(", ")}
CURRENT PROBLEMS: ${problems.join("; ")}
OBJECTIVES: ${objectives.join("; ")}

Return JSON with EXACTLY this shape:
{
  "events": [
    {
      "type": "goal" | "customer" | "product" | "competitor" | "regulation" | "priority" | "team" | "tech",
      "date": "string — relative time (e.g. 'This week', '2 weeks ago', '1 month ago')",
      "title": "string — what changed, 5-10 words",
      "description": "string — 1-2 sentence detail",
      "impact": "string — the business impact, 1 short phrase"
    }
  ]
}

Requirements:
- Events should be specific to this industry and company stage.
- Include at least 1 competitor move and 1 regulation/compliance change.
- Include at least 1 team change (hire, departure, restructure).
- Make it feel like a real company evolving over 6 weeks.
- Dates should be distributed across the 6-week period.`

    const result = await completeJson<{
      events: { type: string; date: string; title: string; description: string; impact: string }[]
    }>(system, user)

    return NextResponse.json({ events: result.events ?? [] })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "twin-evolution failed" },
      { status: 500 },
    )
  }
}
