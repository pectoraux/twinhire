import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { completeJson } from "@/lib/twinhire/llm"
import type { WorkTask } from "@/lib/twinhire/types"

// LLM calls can take 30-60s; extend the serverless function timeout.
export const maxDuration = 60
export const dynamic = "force-dynamic"

// POST /api/twinhire/simulate
// Body: { twinId, capabilityKey }
// Generates a realistic work task inside the twin for the chosen capability gap.
// Persists a WorkSession (status "assigned") and returns { sessionId, task }.
export async function POST(req: Request) {
  try {
    const { twinId, capabilityKey } = (await req.json()) as {
      twinId?: string
      capabilityKey?: string
    }
    if (!twinId || !capabilityKey) {
      return NextResponse.json({ error: "twinId and capabilityKey are required" }, { status: 400 })
    }

    const twin = await db.businessTwin.findUnique({ where: { id: twinId } })
    if (!twin) return NextResponse.json({ error: "twin not found" }, { status: 404 })

    const candidate = await db.candidate.findFirst({ where: { handle: "observer-77" } })
    if (!candidate) return NextResponse.json({ error: "candidate not found" }, { status: 404 })

    const capabilities = JSON.parse(twin.capabilities) as { key: string; title: string; problem: string; evidence: string; businessImpact: string; category: string }[]
    const gap = capabilities.find((c) => c.key === capabilityKey)
    if (!gap) return NextResponse.json({ error: "capability gap not found" }, { status: 404 })

    const problems = JSON.parse(twin.problems) as string[]
    const objectives = JSON.parse(twin.objectives) as string[]
    const org = JSON.parse(twin.orgSnapshot) as { departments: string[]; techStack: string[]; decisionStyle: string; cultureNotes: string[] }

    const system = [
      "You are the operational simulation engine of TwinHire.",
      "You generate realistic, high-signal work tasks that a candidate will perform INSIDE a business digital twin.",
      "The task must be a faithful slice of real operational work — not a hypothetical interview question.",
      "Respond with STRICT JSON only matching the requested schema. No prose, no markdown fences.",
    ].join(" ")

    const user = `Generate a work task for the following capability gap inside an anonymized business twin.

TWIN CONTEXT:
- Code: ${twin.code}
- Industry: ${twin.industry}
- Size: ${twin.sizeBand}
- Stage: ${twin.stage}
- Region: ${twin.region}
- Departments: ${org.departments.join(", ")}
- Tech stack: ${org.techStack.join(", ")}
- Decision style: ${org.decisionStyle}
- Culture notes: ${org.cultureNotes.join(" | ")}
- Known problems: ${problems.map((p) => "- " + p).join("\n")}
- Strategic objectives: ${objectives.map((o) => "- " + o).join("\n")}

CAPABILITY GAP TO EXERCISE:
- Title: ${gap.title}
- Category: ${gap.category}
- Problem: ${gap.problem}
- Evidence: ${gap.evidence}
- Business impact: ${gap.businessImpact}

Return JSON with EXACTLY this shape:
{
  "taskTitle": "string — a concrete 4-8 word task title",
  "taskBrief": "string — 120-180 words. Set the scene as if the candidate just joined the team for the day. Mention the real artifact they have access to, who is asking, and the deadline pressure. Second person ('You...').",
  "contextBundle": {
    "role": "string — the temporary role the candidate steps into, e.g. 'Lifecycle Growth Lead (interim)'",
    "situation": "string — 2-3 sentences of operational situation",
    "artifacts": [
      { "name": "string", "type": "string (e.g. 'Segment export', 'Notion doc', 'dbt model', 'Slack thread')", "summary": "string — 1 sentence of what it contains" }
    ],
    "constraints": ["string", "string", "string"],
    "successCriteria": ["string", "string", "string", "string"]
  }
}

Requirements:
- 3 artifacts minimum, each plausible for the tech stack.
- Constraints must reflect real tradeoffs (budget, compliance, bandwidth, politics).
- Success criteria must be observable and measurable, not subjective.
- Make the brief feel like real work, not a case-study prompt.`

    const task = await completeJson<WorkTask>(system, user)

    const session = await db.workSession.create({
      data: {
        twinId: twin.id,
        candidateId: candidate.id,
        capabilityKey: gap.key,
        taskTitle: task.taskTitle,
        taskBrief: task.taskBrief,
        contextBundle: JSON.stringify(task.contextBundle),
        status: "assigned",
      },
    })

    return NextResponse.json({ sessionId: session.id, task })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "simulation failed" },
      { status: 500 },
    )
  }
}
