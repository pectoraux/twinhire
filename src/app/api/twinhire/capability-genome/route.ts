import { NextResponse } from "next/server"
import { completeJson } from "@/lib/twinhire/llm"

// POST /api/twinhire/capability-genome
// Body: { capability }
// The LLM generates the full 16-field Capability Genome — the structured
// definition that is the platform's core intellectual property.
// Everything in the platform revolves around this genome.
export const maxDuration = 60
export const dynamic = "force-dynamic"

export async function POST(req: Request) {
  try {
    const { capability } = (await req.json()) as { capability?: string }
    if (!capability?.trim()) {
      return NextResponse.json({ error: "capability required" }, { status: 400 })
    }

    const system = [
      "You are the Capability Genome engine of TwinHire.",
      "Every capability has a structured 16-field definition — the genome.",
      "This genome is the core intellectual property of the platform.",
      "Everything in the platform revolves around this genome: simulations, evidence, scoring, market intelligence, ROI.",
      "Respond with STRICT JSON only. No prose, no markdown fences.",
    ].join(" ")

    const user = `Generate the complete Capability Genome for: "${capability}"

Return JSON with EXACTLY this shape:
{
  "id": "string — slugified capability name",
  "name": "string — the capability name",
  "category": "string — one of: Revenue, Operations, Product, Customer, Data, Engineering, Growth, Knowledge, Manufacturing, Healthcare, Finance",
  "contributesTo": ["string — what this capability contributes to (e.g. 'Revenue Growth', 'Operational Excellence')"],
  "improvesKpis": ["string — which KPIs this capability improves (e.g. 'NRR', 'Gross Margin', 'Time-to-Value')"],
  "industries": ["string — industries where this capability matters"],
  "prerequisites": ["string — prerequisite capabilities (must have before learning this)"],
  "complementary": ["string — complementary capabilities (work well together)"],
  "salaryPremium": "string — average salary premium (e.g. '+$18K above baseline')",
  "demandTrend": <number — % growth year over year>,
  "automationRisk": <0-100 — higher = more likely to be automated>,
  "aiAugmentation": "string — how AI can amplify this capability (1-2 sentences)",
  "projectedRoi": "string — projected ROI for a business adding this (e.g. '+11.4% margin within 18 months')",
  "knowledge": ["string — knowledge areas required"],
  "skills": ["string — specific skills required"],
  "behaviors": ["string — expected behaviors"],
  "tools": ["string — tools commonly used"],
  "evidenceRequirements": ["string — how to prove this capability (e.g. 'Built a working automation pipeline', 'Reduced manual processing time by 40%')"],
  "learningPaths": ["string — learning paths to acquire this capability"]
}

Requirements:
- All arrays should have 3-6 items.
- Knowledge, skills, and behaviors should be specific to this capability.
- Evidence requirements should be observable and measurable.
- The automation risk and AI augmentation should be realistic and nuanced.
- Learning paths should be actionable (not just "take a course").`

    const result = await completeJson<Record<string, unknown>>(system, user)

    return NextResponse.json({ genome: result })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "capability-genome failed" },
      { status: 500 },
    )
  }
}
