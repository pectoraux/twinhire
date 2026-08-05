import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { completeJson } from "@/lib/twinhire/llm"

// POST /api/twinhire/capability-recipes
// Body: { twinId, objective }
// The LLM discovers combinations of capabilities that outperform isolated
// investments — "recipes" with multiplier effects and compounding value.
export const maxDuration = 60
export const dynamic = "force-dynamic"

export async function POST(req: Request) {
  try {
    const { twinId, objective } = (await req.json()) as { twinId?: string; objective?: string }

    const twin = twinId
      ? await db.businessTwin.findUnique({ where: { id: twinId } })
      : await db.businessTwin.findFirst({ orderBy: { code: "asc" } })
    if (!twin) return NextResponse.json({ error: "twin not found" }, { status: 404 })

    const problems = JSON.parse(twin.problems)

    const system = [
      "You are the Capability Recipe Engine of TwinHire.",
      "One capability rarely works alone. You discover combinations that consistently outperform isolated investments.",
      "You also model capability compounding — how one capability changes the value of another.",
      "Respond with STRICT JSON only. No prose, no markdown fences.",
    ].join(" ")

    const user = `Discover capability recipes for this business.

TWIN: ${twin.code} — ${twin.industry} (${twin.stage})
PROBLEMS: ${problems.join("; ")}
OBJECTIVE: ${objective || "Maximize ROI from capability investments"}

Return JSON with EXACTLY this shape:
{
  "recipes": [
    {
      "name": "string — recipe name (e.g. 'Automation Triad')",
      "capabilities": ["string — 2-4 capabilities that work together"],
      "combinedRoi": "string — ROI when combined (e.g. '+23.4% margin')",
      "isolatedRoi": "string — ROI if done separately (e.g. '+8.1% margin')",
      "multiplier": <number — e.g. 2.9 means combined is 2.9x better than isolated>,
      "whyItWorks": "string — why these capabilities amplify each other",
      "sequence": ["string — the recommended order to build them"],
      "timeToValue": "string — combined time to value",
      "confidence": <0-100>
    }
  ],
  "compoundingEffects": [
    {
      "baseCapability": "string",
      "baseValue": <number — standalone value 0-100>,
      "withEnhancer": "string — another capability that amplifies it",
      "enhancedValue": <number — value when combined>,
      "multiplier": <number — e.g. 1.45 means 45% boost>,
      "reasoning": "string — why the enhancer amplifies the base"
    }
  ],
  "recommendation": "string — which recipe to pursue first and why"
}

Requirements:
- 3-4 recipes, each combining 2-4 capabilities.
- Multipliers should be realistic (1.3x to 3.5x).
- Include at least 1 recipe with a multiplier > 2.0 (synergy is real).
- Compounding effects should show how capabilities change each other's value.
- Sequences should be ordered by dependency.`

    const result = await completeJson<{
      recipes: { name: string; capabilities: string[]; combinedRoi: string; isolatedRoi: string; multiplier: number; whyItWorks: string; sequence: string[]; timeToValue: string; confidence: number }[]
      compoundingEffects: { baseCapability: string; baseValue: number; withEnhancer: string; enhancedValue: number; multiplier: number; reasoning: string }[]
      recommendation: string
    }>(system, user)

    return NextResponse.json(result)
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "capability-recipes failed" },
      { status: 500 },
    )
  }
}
