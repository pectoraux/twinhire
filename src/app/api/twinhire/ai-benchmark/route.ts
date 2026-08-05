import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { completeJson } from "@/lib/twinhire/llm"

// POST /api/twinhire/ai-benchmark
// Body: { sessionId }
// The LLM generates how AI models would perform on the same task the
// candidate attempted — with specific strengths, weaknesses, and scores.
// This creates the "Is this person better than AI?" comparison.
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

    const contextBundle = JSON.parse(session.contextBundle)

    const system = [
      "You are the AI Benchmark engine of TwinHire.",
      "You simulate how different AI models would perform on the same task a candidate just completed.",
      "Each model has a known profile — strengths and weaknesses that are realistic and specific.",
      "Respond with STRICT JSON only. No prose, no markdown fences.",
    ].join(" ")

    const user = `Generate AI model benchmarks for this task.

TASK: ${session.taskTitle}
TWIN: ${session.twin.code} — ${session.twin.industry}
BRIEF: ${session.taskBrief.slice(0, 500)}
CANDIDATE SCORE: ${candidateAvg}/100

Return JSON with EXACTLY this shape:
{
  "benchmarks": [
    {
      "model": "GPT-4o",
      "score": <0-100>,
      "strength": "string — what GPT-4o would do well on this specific task",
      "weakness": "string — what GPT-4o would miss on this specific task",
      "timeSeconds": <number>
    },
    {
      "model": "Claude 3.5 Sonnet",
      "score": <0-100>,
      "strength": "string",
      "weakness": "string",
      "timeSeconds": <number>
    },
    {
      "model": "Gemini 2.0 Flash",
      "score": <0-100>,
      "strength": "string",
      "weakness": "string",
      "timeSeconds": <number>
    },
    {
      "model": "DeepSeek-V3",
      "score": <0-100>,
      "strength": "string",
      "weakness": "string",
      "timeSeconds": <number>
    }
  ]
}

Requirements:
- Scores should be realistic — AI models are strong but lack domain depth, stakeholder awareness, and ownership.
- Strengths and weaknesses must be specific to THIS task, not generic.
- GPT-4o: strong on structure/communication, weaker on domain depth.
- Claude: strong on reasoning/tradeoffs, weaker on decisiveness.
- Gemini: fast but surface-level.
- DeepSeek: strong on technical methodology, weaker on business framing.
- At least 2 models should score lower than the candidate (${candidateAvg}).`

    const result = await completeJson<{
      benchmarks: { model: string; score: number; strength: string; weakness: string; timeSeconds: number }[]
    }>(system, user)

    return NextResponse.json(result)
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "ai-benchmark failed" },
      { status: 500 },
    )
  }
}
