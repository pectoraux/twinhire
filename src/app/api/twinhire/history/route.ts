import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { mapTwin, mapCandidate } from "@/lib/twinhire/mappers"
import type { Evaluation, Recommendation } from "@/lib/twinhire/types"

// GET /api/twinhire/history
// Returns the candidate's full longitudinal evidence: every evaluated work session
// across all twins, with scores, summaries, recommendations, and the twin context.
// This is the "longitudinal evidence, not one-shot" principle made queryable.
export async function GET() {
  try {
    const candidate = await db.candidate.findFirst({ where: { handle: "observer-77" } })
    if (!candidate) return NextResponse.json({ sessions: [], candidate: null })

    const sessions = await db.workSession.findMany({
      where: { candidateId: candidate.id, status: "evaluated" },
      orderBy: { createdAt: "asc" },
      include: { twin: true },
    })

    const mapped = sessions.map((s) => {
      const evaluation = s.evaluation ? (JSON.parse(s.evaluation) as Evaluation) : null
      const recommendation = s.recommendation ? (JSON.parse(s.recommendation) as Recommendation) : null
      const avg = evaluation
        ? Math.round(evaluation.scores.reduce((a, b) => a + b.score, 0) / evaluation.scores.length)
        : 0
      return {
        sessionId: s.id,
        createdAt: s.createdAt.toISOString(),
        twinCode: s.twin.code,
        twinIndustry: s.twin.industry,
        capabilityKey: s.capabilityKey,
        taskTitle: s.taskTitle,
        summary: evaluation?.summary ?? "",
        avgScore: avg,
        decision: recommendation?.decision ?? null,
        headline: recommendation?.headline ?? "",
        confidence: recommendation?.confidence ?? 0,
        topStrength: evaluation?.highlights?.[0] ?? null,
        topConcern: evaluation?.redFlags?.[0] ?? null,
        scores: evaluation?.scores ?? [],
      }
    })

    return NextResponse.json({
      candidate: mapCandidate(candidate),
      sessions: mapped,
    })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "failed to load history" },
      { status: 500 },
    )
  }
}
