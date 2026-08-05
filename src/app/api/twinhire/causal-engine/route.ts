import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { completeJson } from "@/lib/twinhire/llm"

// POST /api/twinhire/causal-engine
// Body: { twinId, question }
// The LLM infers causal chains — not just "companies that added X improved Y"
// but "X only produced gains BECAUSE the company first did A, B, and C."
// This is causal reasoning, not correlation.
export const maxDuration = 60
export const dynamic = "force-dynamic"

export async function POST(req: Request) {
  try {
    const { twinId, question } = (await req.json()) as { twinId?: string; question?: string }

    const twin = twinId
      ? await db.businessTwin.findUnique({ where: { id: twinId } })
      : await db.businessTwin.findFirst({ orderBy: { code: "asc" } })
    if (!twin) return NextResponse.json({ error: "twin not found" }, { status: 404 })

    const kpis = JSON.parse(twin.kpis)
    const problems = JSON.parse(twin.problems)
    const objectives = JSON.parse(twin.objectives)

    const system = [
      "You are the Causal Intelligence Engine of TwinHire.",
      "You move beyond correlations to infer likely CAUSAL relationships.",
      "You don't say 'companies that added X improved Y' — you say 'X only produced gains BECAUSE the company first did A, B, and C.'",
      "Every causal link has a confidence estimate and an explainable reasoning chain.",
      "Respond with STRICT JSON only. No prose, no markdown fences.",
    ].join(" ")

    const user = `Generate a causal analysis for this business.

TWIN: ${twin.code} — ${twin.industry} (${twin.stage}, ${twin.sizeBand})
KPIs: ${kpis.map((k: { label: string; value: string }) => `${k.label}=${k.value}`).join(", ")}
PROBLEMS: ${problems.join("; ")}
OBJECTIVES: ${objectives.join("; ")}

QUESTION: ${question || "Why are companies like ours growing faster? What's the causal chain?"}

Return JSON with EXACTLY this shape:
{
  "primaryDriver": "string — the primary capability or action driving the outcome",
  "causalChain": [
    {
      "step": <number>,
      "action": "string — what was done",
      "enables": "string — what this enabled",
      "confidence": <0-100>,
      "reasoning": "string — WHY this step was necessary (not just correlated)",
      "withoutThis": "string — what would happen without this step"
    }
  ],
  "outcome": "string — the final business outcome",
  "alternativePaths": [
    {
      "path": "string — an alternative causal path",
      "likelihood": <0-100>,
      "tradeoff": "string — what's different about this path"
    }
  ],
  "summary": "string — 2-3 sentence causal explanation"
}

Requirements:
- 4-6 steps in the causal chain, each showing what ENABLED the next.
- Each step must explain WHY it was necessary, not just that it happened.
- The "withoutThis" field should show what breaks if you skip this step.
- Include 2-3 alternative causal paths with tradeoffs.
- This is causal reasoning, not reporting.`

    const result = await completeJson<{
      primaryDriver: string
      causalChain: { step: number; action: string; enables: string; confidence: number; reasoning: string; withoutThis: string }[]
      outcome: string
      alternativePaths: { path: string; likelihood: number; tradeoff: string }[]
      summary: string
    }>(system, user)

    return NextResponse.json(result)
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "causal-engine failed" },
      { status: 500 },
    )
  }
}
