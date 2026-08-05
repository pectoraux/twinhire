import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { completeJson } from "@/lib/twinhire/llm"

// POST /api/twinhire/capability-roi
// Body: { twinId, capability }
// The LLM generates ROI insights: what happens when a business adds this
// capability, based on cross-industry patterns and the twin's context.
// This is the "intelligence product no recruiter can provide."
export const maxDuration = 60
export const dynamic = "force-dynamic"

export async function POST(req: Request) {
  try {
    const { twinId, capability } = (await req.json()) as {
      twinId?: string
      capability?: string
    }

    // Find twin
    const twin = twinId
      ? await db.businessTwin.findUnique({ where: { id: twinId } })
      : await db.businessTwin.findFirst({ orderBy: { code: "asc" } })
    if (!twin) return NextResponse.json({ error: "twin not found" }, { status: 404 })

    const kpis = JSON.parse(twin.kpis)
    const problems = JSON.parse(twin.problems)

    const system = [
      "You are the Capability ROI Engine of TwinHire.",
      "You analyze the business impact of adding a specific capability to a company.",
      "You draw on cross-industry patterns, historical outcomes, and the company's specific context.",
      "This is an intelligence product no recruiter can provide.",
      "Respond with STRICT JSON only. No prose, no markdown fences.",
    ].join(" ")

    const user = `Analyze the ROI of adding this capability to this business.

CAPABILITY: ${capability || "Process Automation Engineering"}

TWIN: ${twin.code} — ${twin.industry} (${twin.stage}, ${twin.sizeBand})
CURRENT KPIs: ${kpis.map((k: { label: string; value: string }) => `${k.label}=${k.value}`).join(", ")}
PROBLEMS: ${problems.join("; ")}

Return JSON with EXACTLY this shape:
{
  "headline": "string — a punchy 1-sentence ROI statement (e.g. 'Companies with 50-200 employees in logistics that added Process Automation Engineering increased operating margins by 11.4% within 18 months')",
  "projections": [
    {
      "metric": "string — e.g. 'Operating Margin', 'Revenue', 'Churn', 'Time-to-Value'",
      "baseline": "string — current value",
      "projected": "string — projected value after adding the capability",
      "delta": "string — the change (e.g. '+11.4%', '-3.2pt')",
      "timeframe": "string — e.g. 'within 18 months'",
      "confidence": <0-100>
    }
  ],
  "crossIndustryPattern": "string — what the platform has learned across companies (e.g. '147 companies in similar industries saw an average 8.7% margin improvement')",
  "comparableCapabilities": [
    { "name": "string", "avgRoi": "string", "fasterToValue": boolean }
  ],
  "risks": ["string — 2-3 risks of NOT adding this capability"],
  "recommendation": "string — 1-2 sentence hiring recommendation"
}

Requirements:
- Numbers should feel real and specific (not round).
- Include 4-6 metric projections covering revenue, margin, efficiency, and customer metrics.
- The cross-industry pattern should reference simulated aggregate data.
- Comparable capabilities should be related but different options the business could pursue.`

    const result = await completeJson<{
      headline: string
      projections: Array<Record<string, unknown>>
      crossIndustryPattern: string
      comparableCapabilities: Array<{ name: string; avgRoi: string; fasterToValue: boolean }>
      risks: string[]
      recommendation: string
    }>(system, user)

    return NextResponse.json(result)
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "capability-roi failed" },
      { status: 500 },
    )
  }
}
