import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { seedDatabase } from "@/lib/twinhire/seed"
import { mapTwin, mapCandidate } from "@/lib/twinhire/mappers"

// GET /api/twinhire/twins — list all anonymized business twins + the demo candidate (auto-seeds if empty)
export async function GET() {
  try {
    if ((await db.businessTwin.count()) === 0) {
      await seedDatabase()
    }
    const [twins, candidate] = await Promise.all([
      db.businessTwin.findMany({ orderBy: { code: "asc" } }),
      db.candidate.findFirst({ where: { handle: "observer-77" } }),
    ])
    return NextResponse.json({
      twins: twins.map(mapTwin),
      candidate: candidate ? mapCandidate(candidate) : null,
    })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "failed to load twins" },
      { status: 500 },
    )
  }
}
