import { NextResponse } from "next/server"
import { seedDatabase } from "@/lib/twinhire/seed"

// POST /api/twinhire/seed  — idempotently seed the database (force=true to reset)
export async function POST(req: Request) {
  try {
    const url = new URL(req.url)
    const force = url.searchParams.get("force") === "true"
    const result = await seedDatabase(force)
    return NextResponse.json(result)
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "seed failed" },
      { status: 500 },
    )
  }
}
