import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { completeJson } from "@/lib/twinhire/llm"

// POST /api/twinhire/workforce-design
// Body: { twinId, objective }
// The LLM generates the optimal workforce composition — humans + AI agents
// + automation + software + training — for a business objective.
export const maxDuration = 60
export const dynamic = "force-dynamic"

export async function POST(req: Request) {
  try {
    const { twinId, objective } = (await req.json()) as {
      twinId?: string
      objective?: string
    }

    const twin = twinId
      ? await db.businessTwin.findUnique({ where: { id: twinId } })
      : await db.businessTwin.findFirst({ orderBy: { code: "asc" } })
    if (!twin) return NextResponse.json({ error: "twin not found" }, { status: 404 })

    const problems = JSON.parse(twin.problems)
    const objectives = JSON.parse(twin.objectives)

    const system = [
      "You are the Workforce Design engine of TwinHire.",
      "Businesses don't recruit — they design workforces. You recommend the optimal",
      "composition of humans, AI agents, automation, software, contractors, and training",
      "to achieve a specific business objective.",
      "Respond with STRICT JSON only. No prose, no markdown fences.",
    ].join(" ")

    const user = `Design the optimal workforce composition for this objective.

TWIN: ${twin.code} — ${twin.industry} (${twin.stage}, ${twin.sizeBand})
PROBLEMS: ${problems.join("; ")}
OBJECTIVES: ${objectives.join("; ")}
BUSINESS OBJECTIVE: ${objective || "Reduce operational costs while improving quality"}

Return JSON with EXACTLY this shape:
{
  "composition": {
    "objective": "string — the objective",
    "components": [
      {
        "type": "human" | "ai_agent" | "automation" | "software" | "contractor" | "training",
        "role": "string — the role/function",
        "cost": "string — annual cost",
        "capabilities": ["string — capabilities this provides"],
        "rationale": "string — why this component"
      }
    ],
    "expectedResults": [
      { "metric": "string", "value": "string", "positive": boolean }
    ],
    "totalInvestment": "string",
    "paybackPeriod": "string",
    "roi": "string"
  },
  "rationale": "string — 2-3 sentence explanation of why this composition is optimal"
}

Requirements:
- 4-6 components, mixing humans, AI agents, automation, and software.
- At least 1 human and 1 AI agent.
- Expected results should include cost, speed, and quality metrics.
- ROI should be realistic (200-500% for well-designed compositions).
- The rationale should explain WHY this mix is better than just hiring more people.`

    const result = await completeJson<{
      composition: {
        objective: string
        components: { type: string; role: string; cost: string; capabilities: string[]; rationale: string }[]
        expectedResults: { metric: string; value: string; positive: boolean }[]
        totalInvestment: string
        paybackPeriod: string
        roi: string
      }
      rationale: string
    }>(system, user)

    return NextResponse.json(result)
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "workforce-design failed" },
      { status: 500 },
    )
  }
}
