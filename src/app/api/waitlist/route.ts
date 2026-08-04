import { NextResponse } from "next/server"
import { db } from "@/lib/db"

// POST /api/waitlist — add an email to the waitlist (public, no auth)
export async function POST(req: Request) {
  try {
    const { email, name } = (await req.json()) as { email?: string; name?: string }
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json({ error: "A valid email is required" }, { status: 400 })
    }
    const normalized = email.toLowerCase().trim()

    // If the email is already a registered user, don't re-waitlist
    const existingUser = await db.user.findUnique({ where: { email: normalized } })
    if (existingUser) {
      return NextResponse.json({ status: "already_registered" })
    }

    // Upsert waitlist entry (idempotent)
    const entry = await db.waitlistEntry.upsert({
      where: { email: normalized },
      update: { name: name ?? undefined },
      create: { email: normalized, name: name ?? undefined },
    })

    return NextResponse.json({ status: entry.status, id: entry.id })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "waitlist failed" },
      { status: 500 },
    )
  }
}
