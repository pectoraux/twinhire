import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { completeJson } from "@/lib/twinhire/llm"

// POST /api/twinhire/org-memory
// Body: { twinId? }
// The LLM generates cross-industry insights from the platform's accumulated
// knowledge of solved problems — the "organizational memory" that compounds.
export const maxDuration = 60
export const dynamic = "force-dynamic"

export async function POST(req: Request) {
  try {
    const { twinId } = (await req.json()) as { twinId?: string }

    // Gather context: all evaluated sessions across the network
    const sessions = await db.workSession.findMany({
      where: { status: "evaluated" },
      include: { twin: true },
      orderBy: { createdAt: "desc" },
      take: 20,
    })

    const solvedProblems = sessions.map((s) => {
      const eval_ = s.evaluation ? JSON.parse(s.evaluation) : null
      return {
        twin: s.twin.code,
        industry: s.twin.industry,
        task: s.taskTitle,
        capability: s.capabilityKey,
        summary: eval_?.summary ?? "",
        highlights: eval_?.highlights ?? [],
      }
    })

    const twin = twinId
      ? await db.businessTwin.findUnique({ where: { id: twinId } })
      : await db.businessTwin.findFirst()

    const system = [
      "You are the Organizational Memory engine of TwinHire.",
      "You analyze solved problems across the network and generate cross-industry intelligence insights.",
      "These insights are the platform's competitive moat — patterns that emerge only after enough companies participate.",
      "Respond with STRICT JSON only. No prose, no markdown fences.",
    ].join(" ")

    const user = `Generate cross-industry intelligence insights based on the platform's accumulated knowledge.

CURRENT TWIN CONTEXT: ${twin ? `${twin.code} — ${twin.industry}` : "general"}

RECENTLY SOLVED PROBLEMS (${solvedProblems.length} total):
${solvedProblems.slice(0, 10).map((s, i) => `${i + 1}. [${s.twin}/${s.industry}] ${s.task}: ${s.summary}`).join("\n")}

Return JSON with EXACTLY this shape:
{
  "insights": [
    {
      "text": "string — a specific, data-backed cross-industry insight (e.g. '147 logistics companies solved carrier reconciliation with OCR + exception workflows')",
      "category": "string — one of: Operations, Hiring Pattern, Talent Pattern, Outcome Pattern, AI Leverage, Market Trend",
      "confidence": <0-100>
    }
  ],
  "solvedCount": <number — simulated total problems solved across the network>,
  "successRate": <number — simulated success rate %>,
  "moatStatement": "string — 1-2 sentences on why this knowledge graph is the competitive moat"
}

Requirements:
- Generate 4-6 insights that feel like they emerged from real pattern recognition.
- Include at least 1 "Hiring Pattern" insight (e.g. 'Companies hire too early for X and too late for Y').
- Include at least 1 "AI Leverage" insight (e.g. 'AI-assisted solutions have X% higher success rate when...').
- Make the numbers feel real and specific (not round numbers).
- The moat statement should explain why this compounds over time.`

    const result = await completeJson<{
      insights: { text: string; category: string; confidence: number }[]
      solvedCount: number
      successRate: number
      moatStatement: string
    }>(system, user)

    return NextResponse.json(result)
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "org-memory failed" },
      { status: 500 },
    )
  }
}
