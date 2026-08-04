import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { mapTwin, mapCandidate } from "@/lib/twinhire/mappers"

// GET /api/twinhire/twins/[id] — full twin detail + the demo candidate
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const twin = await db.businessTwin.findUnique({ where: { id } })
    if (!twin) return NextResponse.json({ error: "twin not found" }, { status: 404 })
    const candidate = await db.candidate.findFirst({ where: { handle: "observer-77" } })
    return NextResponse.json({
      twin: mapTwin(twin),
      candidate: candidate ? mapCandidate(candidate) : null,
    })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "failed to load twin" },
      { status: 500 },
    )
  }
}
