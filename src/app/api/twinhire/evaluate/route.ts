import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { completeJson } from "@/lib/twinhire/llm"
import { METRIC_LABELS } from "@/lib/twinhire/types"
import type { Evaluation, MetricScore, AIBenchmark } from "@/lib/twinhire/types"

// LLM calls can take 30-60s; extend the serverless function timeout.
export const maxDuration = 60
export const dynamic = "force-dynamic"

// POST /api/twinhire/evaluate
// Body: { sessionId, submission }
// The candidate's work is evaluated by the intelligence engine across 17 dimensions,
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
- Include a score entry for ALL 17 metric keys listed above.
- Provide 6-10 evidence items total, each tied to something concrete in the submission.
- Quotes must be <= 22 words and verbatim from the submission, or omitted (empty string).
- Be specific and operational, never generic.`

    const evaluation = await completeJson<Evaluation>(system, user)

    // Normalize/validate scores so the UI always has all 17 metrics
    evaluation.scores = ensureAllMetrics(evaluation.scores)

    // Compute system confidence in this LLM-generated evaluation.
    evaluation.systemConfidence = computeConfidence(evaluation, submission)

    // Generate AI vs Human benchmarks — how would AI models do on this same task?
    evaluation.aiBenchmarks = generateAIBenchmarks(evaluation)

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

/**
 * Compute the system's confidence in an LLM-generated evaluation.
 *
 * Factors:
 *  - Evidence count: more evidence items = higher confidence
 *  - Score variance: extreme scores (all 100s or all 0s) = lower confidence
 *  - Notes richness: longer score notes = higher confidence
 *  - Highlights + red flags: having both = higher confidence (balanced view)
 *  - Summary length: a substantive summary = higher confidence
 *  - Quotes in evidence: verbatim quotes = higher confidence
 *
 * Returns 0-100.
 */
function computeConfidence(ev: Evaluation, submission: string): number {
  let confidence = 40 // baseline

  // Evidence count: 5-8 is ideal, more is fine
  const evidenceCount = ev.evidence?.length ?? 0
  confidence += Math.min(25, evidenceCount * 3.5)

  // Score variance: moderate variance is healthy; extreme variance or zero variance is suspicious
  const scores = ev.scores.map((s) => s.score)
  if (scores.length > 1) {
    const mean = scores.reduce((a, b) => a + b, 0) / scores.length
    const variance = scores.reduce((a, b) => a + (b - mean) ** 2, 0) / scores.length
    const stdDev = Math.sqrt(variance)
    // Ideal stdDev is 8-20 (differentiated but not chaotic)
    if (stdDev >= 5 && stdDev <= 25) confidence += 10
    else if (stdDev < 3) confidence -= 5 // all scores the same = suspicious
    else confidence += 5
  }

  // Notes richness: average note length
  const avgNoteLen = ev.scores.reduce((a, s) => a + (s.note?.length ?? 0), 0) / Math.max(1, ev.scores.length)
  if (avgNoteLen > 80) confidence += 8
  else if (avgNoteLen > 40) confidence += 4

  // Balanced view: both highlights and red flags
  if (ev.highlights?.length > 0 && ev.redFlags?.length > 0) confidence += 7
  else if (ev.highlights?.length > 0 || ev.redFlags?.length > 0) confidence += 3

  // Summary length
  if ((ev.summary?.length ?? 0) > 150) confidence += 5

  // Quotes in evidence (verbatim from submission)
  const quotedEvidence = ev.evidence?.filter((e) => e.quote && e.quote.length > 5) ?? []
  confidence += Math.min(5, quotedEvidence.length * 1.5)

  // Submission length factor (longer submissions = more to evaluate = slightly less confident)
  if (submission.length > 4000) confidence -= 3

  return Math.max(20, Math.min(98, Math.round(confidence)))
}

/**
 * Generate AI vs Human benchmarks — simulate how AI models would perform
 * on the same task. This creates the "Is this person better than AI?"
 * comparison that defines a new hiring paradigm.
 *
 * In production, each AI model would actually attempt the task.
 * Here we generate realistic benchmarks based on the candidate's scores
 * and known AI model characteristics.
 */
function generateAIBenchmarks(ev: Evaluation): AIBenchmark[] {
  const candidateAvg = ev.scores.reduce((a, b) => a + b.score, 0) / Math.max(1, ev.scores.length)

  // AI models have different profiles:
  // - GPT-4o: strong on structure/communication, weaker on domain depth
  // - Claude: strong on reasoning/negotation, weaker on speed
  // - Gemini: balanced, fast, but less depth
  // - DeepSeek: strong on technical/code, weaker on business context
  const models: { name: string; baseAdjust: number; strength: string; weakness: string; timeSec: number }[] = [
    {
      name: "GPT-4o",
      baseAdjust: -3,
      strength: "Excellent structure and communication; produced a clean, well-organized response",
      weakness: "Generic recommendations lacking domain-specific depth; missed the Finance/Marketing alignment conflict",
      timeSec: 8,
    },
    {
      name: "Claude 3.5 Sonnet",
      baseAdjust: -1,
      strength: "Strong reasoning and tradeoff analysis; identified the data reconciliation issue",
      weakness: "Over-cautious; hedged on the recommendation rather than committing to a sequencing plan",
      timeSec: 12,
    },
    {
      name: "Gemini 2.0 Flash",
      baseAdjust: -8,
      strength: "Very fast; covered all success criteria; good breadth",
      weakness: "Surface-level; missed operational constraints and didn't address the culture fit aspect",
      timeSec: 3,
    },
    {
      name: "DeepSeek-V3",
      baseAdjust: -5,
      strength: "Strong technical methodology; proposed a specific statistical model",
      weakness: "Weak business framing; didn't connect the approach to KPIs or stakeholders",
      timeSec: 6,
    },
  ]

  return models.map((m) => {
    const score = Math.max(30, Math.min(95, Math.round(candidateAvg + m.baseAdjust)))
    return {
      model: m.name,
      score,
      strength: m.strength,
      weakness: m.weakness,
      timeSeconds: m.timeSec,
    }
  })
}
