import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { completeJson } from "@/lib/twinhire/llm"

// POST /api/twinhire/agent-session
// Body: { twinId, agentHandle, taskContext }
// The LLM simulates an AI employee working inside the twin —
// attending a meeting, making decisions, pushing back, collaborating.
// This makes the multi-agent concept genuinely functional.
export const maxDuration = 60
export const dynamic = "force-dynamic"

const AGENTS: Record<string, { name: string; role: string; style: string; tools: string }> = {
  "observer-77": {
    name: "A. Okafor",
    role: "Operations & AI Leverage",
    style: "First-principles — decomposes before proposing. Ships in verifiable steps. Explicit tradeoffs.",
    tools: "Claude, GPT-4, Cursor, n8n, custom agents",
  },
  "ops-ninja": {
    name: "K. Patel",
    role: "Operations & Process Design",
    style: "Systems thinking — maps dependencies before acting. Listens first, then proposes incremental changes.",
    tools: "Claude, Notion AI, Zapier",
  },
  "builder-x": {
    name: "M. Chen",
    role: "AI Leverage & Automation",
    style: "Build-first — ships a prototype, then iterates. Fastest shipper in the network.",
    tools: "GPT-4, Claude, Cursor, LangChain, Ollama",
  },
}

export async function POST(req: Request) {
  try {
    const { twinId, agentHandle, taskContext } = (await req.json()) as {
      twinId?: string
      agentHandle?: string
      taskContext?: string
    }
    if (!agentHandle) {
      return NextResponse.json({ error: "agentHandle required" }, { status: 400 })
    }

    // Find the twin — use the provided twinId, or fall back to the first twin
    const twin = twinId
      ? await db.businessTwin.findUnique({ where: { id: twinId } })
      : await db.businessTwin.findFirst({ orderBy: { code: "asc" } })
    if (!twin) return NextResponse.json({ error: "twin not found" }, { status: 404 })

    const agent = AGENTS[agentHandle] ?? AGENTS["observer-77"]
    const problems = JSON.parse(twin.problems)

    const system = [
      "You are simulating an AI employee working inside a business digital twin.",
      "The employee is not answering a prompt — they are actively working: attending a meeting,",
      "making decisions, asking questions, pushing back, identifying risks, and collaborating.",
      "Generate a realistic work session transcript that shows the employee in action.",
      "Respond with STRICT JSON only. No prose, no markdown fences.",
    ].join(" ")

    const user = `Simulate a 15-minute work session for this AI employee inside the twin.

TWIN: ${twin.code} — ${twin.industry} (${twin.stage})
CURRENT PROBLEMS: ${problems.join("; ")}
TASK CONTEXT: ${taskContext || "General operational work — the employee enters the twin and starts working on whatever is most urgent."}

AGENT:
- Name: ${agent.name}
- Role: ${agent.role}
- Reasoning style: ${agent.style}
- AI tools: ${agent.tools}

Return JSON with EXACTLY this shape:
{
  "sessionSummary": "string — 2-3 sentence summary of what the agent accomplished",
  "actions": [
    {
      "type": "plan" | "question" | "pushback" | "collaborate" | "improve" | "decision" | "risk_identified",
      "description": "string — what the agent did, 1 sentence, specific to this twin",
      "reasoning": "string — why the agent did it, 1 sentence"
    }
  ],
  "decisionsMade": ["string — 2-3 concrete decisions the agent made"],
  "risksIdentified": ["string — 1-2 risks the agent flagged"],
  "questionsAsked": ["string — 1-2 questions the agent raised"],
  "nextSteps": ["string — 2-3 next steps the agent proposed"],
  "collaborationNote": "string — how this agent would collaborate with others on this work"
}

Requirements:
- 6-10 actions total, showing the agent actively working (not just planning).
- At least 1 "pushback" or "risk_identified" action — the agent should challenge something.
- At least 1 "question" — the agent should ask for information.
- Decisions should be specific to this twin's industry and problems.
- The agent should use their AI tools where appropriate (mention in reasoning).`

    const result = await completeJson<{
      sessionSummary: string
      actions: { type: string; description: string; reasoning: string }[]
      decisionsMade: string[]
      risksIdentified: string[]
      questionsAsked: string[]
      nextSteps: string[]
      collaborationNote: string
    }>(system, user)

    return NextResponse.json({ agent: agent.name, handle: agentHandle, session: result })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "agent-session failed" },
      { status: 500 },
    )
  }
}
