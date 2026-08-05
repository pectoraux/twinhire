import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { completeJson } from "@/lib/twinhire/llm"

// POST /api/twinhire/counterfactual
// Body: { sessionId }
// The LLM generates counterfactual hiring forecasts — "what if we hired
// this person vs another vs no one?" — with 6-metric projections.
export const maxDuration = 60
export const dynamic = "force-dynamic"

export async function POST(req: Request) {
  try {
    const { sessionId } = (await req.json()) as { sessionId?: string }
    if (!sessionId) return NextResponse.json({ error: "sessionId required" }, { status: 400 })

    const session = await db.workSession.findUnique({
      where: { id: sessionId },
      include: { twin: true },
    })
    if (!session) return NextResponse.json({ error: "session not found" }, { status: 404 })

    const evaluation = session.evaluation ? JSON.parse(session.evaluation) : null
    const candidateAvg = evaluation
      ? Math.round(evaluation.scores.reduce((a: number, b: { score: number }) => a + b.score, 0) / evaluation.scores.length)
      : 60

    const problems = JSON.parse(session.twin.problems)

    const system = [
      "You are the Counterfactual Hiring engine of TwinHire.",
      "You simulate what would happen if a business hired this candidate vs an alternative vs no one.",
      "Projections cover 6 metrics across 3 timeframes (30 days, 90 days, 1 year).",
      "Respond with STRICT JSON only. No prose, no markdown fences.",
    ].join(" ")

    const user = `Generate counterfactual hiring forecasts.

TWIN: ${session.twin.code} — ${session.twin.industry} (${session.twin.stage})
PROBLEMS: ${problems.join("; ")}
CANDIDATE: ${session.candidateId} — scored ${candidateAvg}/100 on "${session.taskTitle}"
CANDIDATE STRENGTHS: ${evaluation?.highlights?.join("; ") ?? "structured approach"}
CANDIDATE WEAKNESSES: ${evaluation?.redFlags?.join("; ") ?? "none flagged"}

Return JSON with EXACTLY this shape:
{
  "scenarios": [
    {
      "candidate": "string — candidate name",
      "headline": "string — 1-line description",
      "projections": [
        {
          "timeframe": "30 days" | "90 days" | "1 year",
          "revenue": <number — % delta>,
          "profit": <number>,
          "delivery": <number>,
          "morale": <number>,
          "innovation": <number>,
          "risk": <number — negative is good>
        }
      ],
      "summary": "string — 1-2 sentence explanation"
    }
  ]
}

Generate 3 scenarios:
1. The actual candidate (based on their real scores and strengths)
2. An alternative candidate with a different profile (e.g. stronger on revenue, weaker on delivery)
3. No hire (status quo — the gap compounds, all metrics decline)

Requirements:
- Numbers should be realistic micro-movements (single digits for 30 days, larger for 1 year).
- The "no hire" scenario should show accelerating decline.
- Risk is inverted (negative = lower risk = good).`

    const result = await completeJson<{
      scenarios: {
        candidate: string
        headline: string
        projections: { timeframe: string; revenue: number; profit: number; delivery: number; morale: number; innovation: number; risk: number }[]
        summary: string
      }[]
    }>(system, user)

    return NextResponse.json(result)
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "counterfactual failed" },
      { status: 500 },
    )
  }
}
