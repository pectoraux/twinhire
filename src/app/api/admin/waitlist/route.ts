import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import bcrypt from "bcryptjs"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

// GET /api/admin/waitlist — list all waitlist entries (admin only)
export async function GET() {
  const session = await getServerSession(authOptions)
  if (session?.user?.role !== "admin") {
    return NextResponse.json({ error: "unauthorized" }, { status: 403 })
  }
  const entries = await db.waitlistEntry.findMany({ orderBy: { createdAt: "desc" } })
  return NextResponse.json({ entries })
}

// POST /api/admin/waitlist — approve a waitlist entry → create a user account
export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (session?.user?.role !== "admin") {
    return NextResponse.json({ error: "unauthorized" }, { status: 403 })
  }

  try {
    const { entryId, role, tempPassword } = (await req.json()) as {
      entryId?: string
      role?: string
      tempPassword?: string
    }
    if (!entryId) return NextResponse.json({ error: "entryId required" }, { status: 400 })

    const entry = await db.waitlistEntry.findUnique({ where: { id: entryId } })
    if (!entry) return NextResponse.json({ error: "entry not found" }, { status: 404 })
    if (entry.status === "approved") {
      return NextResponse.json({ error: "already approved" }, { status: 400 })
    }

    const userRole = role || "candidate"
    const password = tempPassword || generateTempPassword()
    const passwordHash = await bcrypt.hash(password, 12)

    // Create the user account
    const user = await db.user.create({
      data: {
        email: entry.email,
        name: entry.name,
        passwordHash,
        role: userRole,
      },
    })

    // Mark waitlist entry as approved
    await db.waitlistEntry.update({
      where: { id: entryId },
      data: { status: "approved" },
    })

    return NextResponse.json({
      userId: user.id,
      email: user.email,
      tempPassword: password,
      role: userRole,
    })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "approval failed" },
      { status: 500 },
    )
  }
}

function generateTempPassword(): string {
  const chars = "abcdefghjkmnpqrstuvwxyz23456789"
  let p = ""
  for (let i = 0; i < 10; i++) p += chars[Math.floor(Math.random() * chars.length)]
  return "TH" + p
}
