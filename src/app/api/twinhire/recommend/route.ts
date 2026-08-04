import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { completeJson } from "@/lib/twinhire/llm"
import type { Evaluation, Recommendation } from "@/lib/twinhire/types"

// LLM calls can take 30-60s; extend the serverless function timeout.
export const maxDuration = 60
export const dynamic = "force-dynamic"

// POST /api/twinhire/recommend
// Body: { sessionId }
// Derives an explainable hiring recommendation from accumulated evidence.
export async function POST(req: Request) {
  try {
    const { sessionId } = (await req.json()) as { sessionId?: string }
    if (!sessionId) return NextResponse.json({ error: "sessionId is required" }, { status: 400 })

    const session = await db.workSession.findUnique({
      where: { id: sessionId },
      include: { twin: true, candidate: true },
    })
    if (!session) return NextResponse.json({ error: "session not found" }, { status: 404 })
    if (!session.evaluation) return NextResponse.json({ error: "session not yet evaluated" }, { status: 400 })

    const evaluation = JSON.parse(session.evaluation) as Evaluation
    const avg = evaluation.scores.reduce((a, b) => a + b.score, 0) / Math.max(1, evaluation.scores.length)

    // Pull the candidate's full evidence history (other evaluated sessions) so the
    // recommendation reflects longitudinal evidence, not a single sample.
    const history = await db.workSession.findMany({
      where: { candidateId: session.candidateId, status: "evaluated" },
      orderBy: { createdAt: "asc" },
    })
    const historySummary = history.map((h, i) => {
      const ev = h.evaluation ? (JSON.parse(h.evaluation) as Evaluation) : null
      const havg = ev ? Math.round(ev.scores.reduce((a, b) => a + b.score, 0) / ev.scores.length) : 0
      return `Session ${i + 1}: "${h.taskTitle}" — avg ${havg}/100. ${ev?.summary ?? ""}`
    }).join("\n")

    const system = [
      "You are the Hiring Intelligence layer of TwinHire.",
      "You produce an EXPLAINABLE hiring recommendation grounded only in observed evidence.",
      "Never recommend on potential or vibes — only on demonstrated work.",
      "Respond with STRICT JSON only. No prose, no markdown fences.",
    ].join(" ")

    const user = `Produce a hiring recommendation for a candidate based on observed work.

CANDIDATE: ${session.candidate.displayName} — ${session.candidate.headline}
Reputation: ${session.candidate.reputation}/100
Sessions completed: ${session.candidate.sessionsCompleted}

CURRENT SESSION:
- Twin: ${session.twin.code} (${session.twin.industry})
- Task: ${session.taskTitle}
- Avg score this session: ${Math.round(avg)}/100
- Summary: ${evaluation.summary}

EVIDENCE HISTORY (longitudinal):
${historySummary || "(this is the first evaluated session)"}

KEY STRENGTHS:
${evaluation.highlights.map((h) => "- " + h).join("\n")}

KEY CONCERNS:
${evaluation.redFlags.map((h) => "- " + h).join("\n") || "- (none flagged)"}

Return JSON with EXACTLY this shape:
{
  "decision": "interview_now" | "observe_longer" | "another_challenge" | "not_a_fit" | "future_fit",
  "headline": "string — 6-12 word decision headline",
  "rationale": "string — 3-5 sentences grounded in specific evidence above",
  "confidence": <0-100>,
  "suggestedNextStep": "string — the single most useful next action",
  "evidenceRefs": ["string — short references to specific evidence", "..."]
}

Decision guidance (use as a starting point, adjust for evidence):
- interview_now: avg >= 72 AND few red flags
- observe_longer: promising but insufficient evidence (only 1 session, or mixed signals)
- another_challenge: decent but a specific weakness needs re-testing
- not_a_fit: avg < 50 with material red flags
- future_fit: not right now but a real capability match for a different gap`

    const rec = await completeJson<Recommendation>(system, user)

    await db.workSession.update({
      where: { id: sessionId },
      data: { recommendation: JSON.stringify(rec) },
    })

    return NextResponse.json({ sessionId, recommendation: rec, sessionAvg: Math.round(avg) })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "recommendation failed" },
      { status: 500 },
    )
  }
}
