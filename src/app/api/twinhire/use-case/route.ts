import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { completeJson } from "@/lib/twinhire/llm"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

// GET /api/twinhire/use-case?twId=X — list anonymized use cases for a twin (admin/authenticated)
export async function GET(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 })

  const url = new URL(req.url)
  const twinId = url.searchParams.get("twId")
  const where = twinId ? { twinId } : {}
  const useCases = await db.useCaseSubmission.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: { twin: { select: { code: true, industry: true } } },
  })
  return NextResponse.json({ useCases })
}

// POST /api/twinhire/use-case
// Body: { twinId, rawUseCase, category, identifyOptIn }
// The AI anonymizes the use case (unless identifyOptIn is true), then stores it.
export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 })

  try {
    const { twinId, rawUseCase, category, identifyOptIn } = (await req.json()) as {
      twinId?: string
      rawUseCase?: string
      category?: string
      identifyOptIn?: boolean
    }
    if (!twinId || !rawUseCase?.trim()) {
      return NextResponse.json({ error: "twinId and rawUseCase are required" }, { status: 400 })
    }

    const twin = await db.businessTwin.findUnique({ where: { id: twinId } })
    if (!twin) return NextResponse.json({ error: "twin not found" }, { status: 404 })

    const optIn = identifyOptIn ?? false
    const useCaseCategory = category || "Operations"

    // Create a pending submission first
    const submission = await db.useCaseSubmission.create({
      data: {
        twinId,
        rawUseCase,
        category: useCaseCategory,
        identifyOptIn: optIn,
        status: "pending",
      },
    })

    // Anonymize via LLM
    const system = [
      "You are the anonymization engine of TwinHire.",
      "You receive a real business use case and produce an anonymized version that can be shown to candidates.",
      "The anonymized version must preserve the operational essence, difficulty, and decision points — but strip anything that could identify the business.",
      "Respond with STRICT JSON only. No prose, no markdown fences.",
    ].join(" ")

    const user = `Anonymize the following real use case for use inside a business digital twin.

TWIN CONTEXT:
- Code: ${twin.code} (already anonymized)
- Industry: ${twin.industry}
- Size: ${twin.sizeBand}
- Stage: ${twin.stage}

IDENTIFICATION OPT-IN: ${optIn ? "YES — the business consents to being identified. Lighter anonymization: keep industry context and realistic details, but still remove specific customer names, exact revenue figures, and personal identifiers." : "NO — full anonymization. Remove any company names, customer names, exact financials, specific product names, locations, or anything that could identify the business."}

RAW USE CASE (from the business):
"""
${rawUseCase.slice(0, 4000)}
"""

Return JSON with EXACTLY this shape:
{
  "anonymizedUseCase": "string — the anonymized version, 200-500 words, ready to be shown to candidates. Written in second person ('You...') as an operational scenario. Preserve the real complexity and constraints.",
  "anonymizationNotes": "string — a short summary of what was anonymized (e.g. 'company name, 3 customer names, exact revenue figure, product name')",
  "category": "string — one of: Revenue, Operations, Product, Customer, Data, Engineering, Growth, Knowledge"
}

Requirements:
- Keep the operational decisions, tradeoffs, and constraints intact.
- If identifyOptIn is false, replace ALL identifying details with generic equivalents (e.g. "a Series B logistics company" not "FastFreight Inc").
- The anonymized scenario should feel like real work, not a sanitized case study.
- Preserve any numbers/metrics that are operationally important (e.g. "14 hours/week", "8% stockout rate") but round or generalize revenue figures unless optIn is true.`

    try {
      const result = await completeJson<{
        anonymizedUseCase: string
        anonymizationNotes: string
        category: string
      }>(system, user)

      const updated = await db.useCaseSubmission.update({
        where: { id: submission.id },
        data: {
          anonymizedUseCase: result.anonymizedUseCase,
          anonymizationNotes: result.anonymizationNotes,
          category: result.category || useCaseCategory,
          status: "anonymized",
        },
      })

      return NextResponse.json({
        success: true,
        submission: updated,
      })
    } catch (llmErr) {
      // Mark as failed but keep the raw submission
      await db.useCaseSubmission.update({
        where: { id: submission.id },
        data: { status: "pending" },
      })
      return NextResponse.json(
        {
          error: llmErr instanceof Error ? llmErr.message : "anonymization failed",
          submissionId: submission.id,
        },
        { status: 500 },
      )
    }
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "use case submission failed" },
      { status: 500 },
    )
  }
}
