import { NextResponse } from "next/server"
import { completeJson } from "@/lib/twinhire/llm"

// POST /api/twinhire/work-futures
// Body: { horizon } — years to forecast (default 7, i.e. 2032)
// The LLM models AI progress, regulation, demographics, education, robotics,
// labor shortages, and economic sectors to forecast capability markets.
// "What will work look like in 2032?"
export const maxDuration = 60
export const dynamic = "force-dynamic"

export async function POST(req: Request) {
  try {
    const { horizon } = (await req.json()) as { horizon?: number }
    const years = horizon ?? 7
    const targetYear = new Date().getFullYear() + years

    const system = [
      "You are the Work Futures engine of TwinHire.",
      "You model AI progress, regulation, demographics, education, robotics, labor shortages,",
      "and economic sectors to forecast what work will look like in the future.",
      "This is one of the platform's most valuable products.",
      "Respond with STRICT JSON only. No prose, no markdown fences.",
    ].join(" ")

    const user = `Forecast what work will look like in ${targetYear} (${years} years from now).

Consider these forces:
- AI progress (what can AI do that it couldn't before?)
- Regulation (what new compliance requirements emerged?)
- Demographics (workforce aging, Gen Z entering, remote normalization)
- Education (skills gap, alternative credentials, AI-assisted learning)
- Robotics (physical automation, humanoid robots, warehouse automation)
- Labor shortages (which roles are hardest to fill?)
- Economic sectors (which industries are growing/shrinking?)

Return JSON with EXACTLY this shape:
{
  "headline": "string — 1-sentence summary of work in ${targetYear}",
  "emergingCapabilities": [
    {
      "name": "string",
      "why": "string — why this capability is emerging",
      "projectedDemand": <number — % growth>,
      "medianSalary": "string",
      "automationRisk": <0-100>
    }
  ],
  "decliningCapabilities": [
    {
      "name": "string",
      "why": "string — why this capability is declining",
      "projectedDecline": <number — % decline>,
      "replacement": "string — what replaces it"
    }
  ],
  "transformedCapabilities": [
    {
      "name": "string — a capability that still exists but has fundamentally changed",
      "before": "string — what it looked like before",
      "after": "string — what it looks like in ${targetYear}",
      "aiAugmentation": <0-100 — how much AI augments this>
    }
  ],
  "industryShifts": [
    { "industry": "string", "shift": "string", "impact": "string" }
  ],
  "workforceComposition": "string — how the human/AI/automation mix will change",
  "biggestRisk": "string — the biggest risk to this forecast",
  "confidence": <0-100>
}

Requirements:
- 4-6 emerging capabilities with specific, realistic projections.
- 3-4 declining capabilities with clear replacements.
- 3-4 transformed capabilities showing the before/after.
- 3-4 industry shifts.
- Be specific and bold — this is a forecast, not a safe bet.`

    const result = await completeJson<{
      headline: string
      emergingCapabilities: { name: string; why: string; projectedDemand: number; medianSalary: string; automationRisk: number }[]
      decliningCapabilities: { name: string; why: string; projectedDecline: number; replacement: string }[]
      transformedCapabilities: { name: string; before: string; after: string; aiAugmentation: number }[]
      industryShifts: { industry: string; shift: string; impact: string }[]
      workforceComposition: string
      biggestRisk: string
      confidence: number
    }>(system, user)

    return NextResponse.json(result)
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "work-futures failed" },
      { status: 500 },
    )
  }
}
