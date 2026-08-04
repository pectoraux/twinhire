import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { completeJson } from "@/lib/twinhire/llm"
import { METRIC_LABELS } from "@/lib/twinhire/types"
import type { Evaluation, MetricScore } from "@/lib/twinhire/types"

// LLM calls can take 30-60s; extend the serverless function timeout.
export const maxDuration = 60
export const dynamic = "force-dynamic"

// POST /api/twinhire/evaluate
// Body: { sessionId, submission }
// The candidate's work is evaluated by the intelligence engine across 10 dimensions,
// producing observable evidence (not a vibes-based score). Persists the evaluation.
export async function POST(req: Request) {
  try {
    const { sessionId, submission } = (await req.json()) as {
      sessionId?: string
      submission?: string
    }
    if (!sessionId || !submission?.trim()) {
      return NextResponse.json({ error: "sessionId and submission are required" }, { status: 400 })
    }

    const session = await db.workSession.findUnique({
      where: { id: sessionId },
      include: { twin: true },
    })
    if (!session) return NextResponse.json({ error: "session not found" }, { status: 404 })

    const gap = (JSON.parse(session.twin.capabilities) as { key: string; title: string; problem: string; businessImpact: string }[]).find((c) => c.key === session.capabilityKey)

    const contextBundle = JSON.parse(session.contextBundle) as {
      role: string
      situation: string
      artifacts: { name: string; type: string; summary: string }[]
      constraints: string[]
      successCriteria: string[]
    }

    const metricList = Object.entries(METRIC_LABELS)
      .map(([k, v]) => `${k} (${v})`)
      .join(", ")

    const system = [
      "You are the Performance Intelligence Engine of TwinHire.",
      "You evaluate work a candidate performed INSIDE a business digital twin.",
      "Every score MUST be backed by a concrete, quotable observation from the submission.",
      "Never invent quotes. If you quote, quote the submission verbatim and briefly.",
      "Be rigorous and slightly skeptical — do not inflate scores. Average work scores ~55-65.",
      "Respond with STRICT JSON only. No prose, no markdown fences.",
    ].join(" ")

    const user = `Evaluate the candidate's submitted work.

TASK:
- Title: ${session.taskTitle}
- Brief: ${session.taskBrief}
- Role assumed: ${contextBundle.role}
- Situation: ${contextBundle.situation}
- Artifacts available: ${contextBundle.artifacts.map((a) => `${a.name} (${a.type}): ${a.summary}`).join(" | ")}
- Constraints: ${contextBundle.constraints.join(" | ")}
- Success criteria: ${contextBundle.successCriteria.join(" | ")}

CAPABILITY GAP EXERCISED:
- ${gap?.title ?? session.capabilityKey}
- Problem: ${gap?.problem ?? ""}
- Targeted business impact: ${gap?.businessImpact ?? ""}

TWIN: ${session.twin.code} — ${session.twin.industry} (${session.twin.stage}, ${session.twin.sizeBand})

CANDIDATE SUBMISSION (markdown):
"""
${submission.slice(0, 6000)}
"""

Score the candidate on these dimensions (0-100 each): ${metricList}.

Return JSON with EXACTLY this shape:
{
  "summary": "string — 2-3 sentence overall assessment, candid and specific",
  "scores": [
    { "key": "<one of the metric keys>", "label": "<human label>", "score": <0-100>, "note": "string — concrete justification referencing the submission" }
  ],
  "evidence": [
    { "metric": "<metric key or 'overall'>", "observation": "string — what was observed", "quote": "string — short verbatim quote OR empty string", "signal": "strength" | "concern" | "neutral" }
  ],
  "businessImpact": "string — what business impact this work would have if shipped inside the twin",
  "aiLeverageAssessment": "string — did the candidate use AI well, critically, and with judgment? 1-2 sentences",
  "redFlags": ["string — concrete concerns, or empty array"],
  "highlights": ["string — concrete strengths, 2-4 items"]
}

Requirements:
- Include a score entry for ALL 10 metric keys listed above.
- Provide 5-8 evidence items total, each tied to something concrete in the submission.
- Quotes must be <= 22 words and verbatim from the submission, or omitted (empty string).
- Be specific and operational, never generic.`

    const evaluation = await completeJson<Evaluation>(system, user)

    // Normalize/validate scores so the UI always has all 10 metrics
    evaluation.scores = ensureAllMetrics(evaluation.scores)

    await db.workSession.update({
      where: { id: sessionId },
      data: {
        submission,
        status: "evaluated",
        evaluation: JSON.stringify(evaluation),
        submittedAt: new Date(),
      },
    })

    return NextResponse.json({ sessionId, evaluation })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "evaluation failed" },
      { status: 500 },
    )
  }
}

function ensureAllMetrics(scores: MetricScore[]): MetricScore[] {
  const map = new Map<string, MetricScore>()
  for (const s of scores ?? []) {
    if (s && typeof s.key === "string") {
      map.set(s.key, { ...s, label: s.label || METRIC_LABELS[s.key] || s.key, score: clamp(s.score) })
    }
  }
  const out: MetricScore[] = []
  for (const [key, label] of Object.entries(METRIC_LABELS)) {
    const existing = map.get(key)
    out.push(existing ?? { key, label, score: 50, note: "Not explicitly evidenced." })
  }
  return out
}

function clamp(n: unknown): number {
  const v = typeof n === "number" ? n : Number(n)
  if (!isFinite(v)) return 50
  return Math.max(0, Math.min(100, Math.round(v)))
}
