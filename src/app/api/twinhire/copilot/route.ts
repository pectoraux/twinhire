import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { complete } from "@/lib/twinhire/llm"

// POST /api/twinhire/copilot
// Body: { sessionId, question }
// An AI co-pilot that candidates can query during a simulation.
// It answers contextually about the task, artifacts, and constraints —
// while the platform records the interaction for AI-leverage assessment.
export const maxDuration = 60
export const dynamic = "force-dynamic"

export async function POST(req: Request) {
  try {
    const { sessionId, question } = (await req.json()) as {
      sessionId?: string
      question?: string
    }
    if (!sessionId || !question?.trim()) {
      return NextResponse.json({ error: "sessionId and question are required" }, { status: 400 })
    }

    const session = await db.workSession.findUnique({
      where: { id: sessionId },
      include: { twin: true },
    })
    if (!session) return NextResponse.json({ error: "session not found" }, { status: 404 })

    const contextBundle = JSON.parse(session.contextBundle) as {
      role: string
      situation: string
      artifacts: { name: string; type: string; summary: string }[]
      constraints: string[]
      successCriteria: string[]
    }

    const system = [
      "You are the AI Co-pilot inside a TwinHire work simulation.",
      "The candidate is performing real work inside a business digital twin and can ask you questions.",
      "Your role is to help them think — NOT to do the work for them.",
      "Give guidance, point to relevant artifacts, suggest frameworks, ask clarifying questions.",
      "Be concise (2-4 sentences). Don't write any part of their submission for them.",
      "If they ask you to write their answer, refuse and redirect them to think about the approach.",
    ].join(" ")

    const user = `Candidate question: "${question}"

TASK CONTEXT:
- Title: ${session.taskTitle}
- Role: ${contextBundle.role}
- Situation: ${contextBundle.situation}
- Artifacts: ${contextBundle.artifacts.map((a) => `${a.name} (${a.type})`).join(", ")}
- Constraints: ${contextBundle.constraints.join(" | ")}
- Success criteria: ${contextBundle.successCriteria.join(" | ")}
- Twin: ${session.twin.code} — ${session.twin.industry}

Respond with helpful guidance in 2-4 sentences. Be specific to this context.`

    const response = await complete(system, user)

    return NextResponse.json({ response })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "copilot failed" },
      { status: 500 },
    )
  }
}
