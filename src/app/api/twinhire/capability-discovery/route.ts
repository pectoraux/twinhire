import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { completeJson } from "@/lib/twinhire/llm"

// POST /api/twinhire/capability-discovery
// Body: { twinId, answers }
// Businesses answer questions about their pain points. The AI analyzes
// the answers + twin context and produces ranked missing capabilities
// with projected business impact, ROI, and hiring sequence.
export const maxDuration = 60
export const dynamic = "force-dynamic"

export async function POST(req: Request) {
  try {
    const { twinId, answers } = (await req.json()) as {
      twinId?: string
      answers?: string
    }
    if (!twinId) return NextResponse.json({ error: "twinId required" }, { status: 400 })

    const twin = await db.businessTwin.findUnique({ where: { id: twinId } })
    if (!twin) return NextResponse.json({ error: "twin not found" }, { status: 404 })

    const kpis = JSON.parse(twin.kpis)
    const problems = JSON.parse(twin.problems)
    const objectives = JSON.parse(twin.objectives)

    const system = [
      "You are the Capability Discovery engine of TwinHire.",
      "Businesses don't create job descriptions. They answer questions about pain points.",
      "You analyze their answers + operational context and produce ranked missing capabilities.",
      "Each capability has projected business impact, ROI, AI replacement/augmentation likelihood, and hiring sequence.",
      "Respond with STRICT JSON only. No prose, no markdown fences.",
    ].join(" ")

    const user = `Analyze this business and identify their top missing capabilities.

TWIN: ${twin.code} — ${twin.industry} (${twin.stage}, ${twin.sizeBand})
CURRENT KPIs: ${kpis.map((k: { label: string; value: string }) => `${k.label}=${k.value}`).join(", ")}
KNOWN PROBLEMS: ${problems.join("; ")}
OBJECTIVES: ${objectives.join("; ")}

BUSINESS ANSWERS (from the questionnaire):
${answers || "No specific answers provided — analyze from the twin's known problems and KPIs."}

Return JSON with EXACTLY this shape:
{
  "capabilities": [
    {
      "name": "string — the capability name (e.g. 'Lifecycle Marketing Automation')",
      "category": "string — Revenue | Operations | Product | Customer | Data | Engineering | Growth | Knowledge",
      "projectedRevenueImpact": "string — e.g. '+$620,000/year'",
      "projectedEbitdaImpact": "string — e.g. '+6.8%' or empty string",
      "costReduction": "string — e.g. '12%' or empty string",
      "confidence": <0-100>,
      "urgency": "Critical" | "High" | "Medium" | "Low",
      "timeToValue": "string — e.g. '4 months'",
      "hiringDifficulty": <1-5>,
      "aiReplaceLikelihood": <0-100>,
      "aiAugmentLikelihood": <0-100>,
      "recommendedOrder": <number — 1 = first to hire>
    }
  ],
  "summary": "string — 2-3 sentence summary of the capability analysis",
  "totalProjectedImpact": "string — aggregate projected impact (e.g. '+$2.4M ARR, +8.2pt margin')"
}

Requirements:
- Generate 5-8 capabilities, ranked by projected ROI.
- Be specific with numbers — not round figures.
- Include at least 1 capability with high AI replacement likelihood (>60%) and 1 with high AI augmentation (>70%).
- The recommendedOrder should form a logical hiring sequence (what to build first).`

    const result = await completeJson<{
      capabilities: Array<Record<string, unknown>>
      summary: string
      totalProjectedImpact: string
    }>(system, user)

    return NextResponse.json(result)
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "capability-discovery failed" },
      { status: 500 },
    )
  }
}
