import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { completeJson } from "@/lib/twinhire/llm"

// POST /api/twinhire/debrief
// Body: { sessionId }
// Generates a model answer + comparison for the completed simulation,
// turning it into a learning opportunity.
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
    if (!session.evaluation) return NextResponse.json({ error: "session not yet evaluated" }, { status: 400 })

    const gap = (JSON.parse(session.twin.capabilities) as { key: string; title: string; problem: string; businessImpact: string }[]).find((c) => c.key === session.capabilityKey)
    const contextBundle = JSON.parse(session.contextBundle) as {
      role: string
      situation: string
      artifacts: { name: string; type: string; summary: string }[]
      constraints: string[]
      successCriteria: string[]
    }

    const system = [
      "You are the debrief engine of TwinHire.",
      "After a candidate completes a work simulation, you generate a model answer and a comparison",
      "to turn the experience into a learning opportunity.",
      "Respond with STRICT JSON only. No prose, no markdown fences.",
    ].join(" ")

    const user = `Generate a debrief for a completed work simulation.

TASK:
- Title: ${session.taskTitle}
- Brief: ${session.taskBrief}
- Role: ${contextBundle.role}
- Situation: ${contextBundle.situation}
- Constraints: ${contextBundle.constraints.join(" | ")}
- Success criteria: ${contextBundle.successCriteria.join(" | ")}

CAPABILITY GAP:
- ${gap?.title ?? session.capabilityKey}
- Problem: ${gap?.problem ?? ""}

TWIN: ${session.twin.code} — ${session.twin.industry}

CANDIDATE SUBMISSION (abbreviated):
"""
${session.submission?.slice(0, 3000) ?? ""}
"""

Return JSON with EXACTLY this shape:
{
  "modelAnswer": "string — 200-400 words. How a strong operator would have approached this. Written as a reference, not a critique. Use the same second-person voice.",
  "whatThisTested": "string — 1-2 sentences on what this scenario was really testing (beyond the surface task).",
  "comparison": {
    "candidateDidWell": ["string — 2-3 specific things the candidate did well, referencing their submission"],
    "candidateMissed": ["string — 2-3 specific things a stronger answer would have addressed, that the candidate didn't"],
    "keyDifference": "string — the single most important difference between the candidate's approach and the model answer"
  },
  "learningEdge": "string — 1-2 sentences on what the candidate should practice or study next, based on this session"
}

Requirements:
- Be specific and reference the candidate's actual submission.
- The model answer should feel like real senior-level work, not a textbook answer.
- "candidateMissed" should be constructive, not harsh — frame as "a stronger answer would have...".
- Don't repeat the evaluation scores; this is about approach, not scoring.`

    const debrief = await completeJson<{
      modelAnswer: string
      whatThisTested: string
      comparison: {
        candidateDidWell: string[]
        candidateMissed: string[]
        keyDifference: string
      }
      learningEdge: string
    }>(system, user)

    return NextResponse.json({ sessionId, debrief })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "debrief failed" },
      { status: 500 },
    )
  }
}
