import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { db } from "@/lib/db"
import { seedDatabase } from "@/lib/twinhire/seed"

// POST /api/admin/seed-demo — seeds admin + demo users + business twins.
// Can be called without auth (for initial setup) but is idempotent.
export async function POST() {
  try {
    const results: string[] = []

    // 1. Seed business twins + demo candidate
    await seedDatabase()
    results.push("twins + candidate seeded")

    // 2. Seed the real admin (ekontetevi@gmail / Payswap123456)
    const adminEmail = "ekontetevi@gmail"
    const existingAdmin = await db.user.findUnique({ where: { email: adminEmail } })
    if (!existingAdmin) {
      await db.user.create({
        data: {
          email: adminEmail,
          name: "Admin",
          passwordHash: await bcrypt.hash("Payswap123456", 12),
          role: "admin",
        },
      })
      results.push("admin (ekontetevi@gmail) created")
    } else {
      results.push("admin already exists")
    }

    // 3. Seed demo admin (demo-admin@twinhire.app / demo)
    const demoAdminEmail = "demo-admin@twinhire.app"
    const existingDemoAdmin = await db.user.findUnique({ where: { email: demoAdminEmail } })
    if (!existingDemoAdmin) {
      await db.user.create({
        data: {
          email: demoAdminEmail,
          name: "Demo Admin",
          passwordHash: await bcrypt.hash("demo1234", 12),
          role: "admin",
        },
      })
      results.push("demo admin created")
    } else {
      results.push("demo admin already exists")
    }

    // 4. Seed demo candidate (demo-candidate@twinhire.app / demo)
    //    Linked to the existing Candidate record (observer-77)
    const demoCandEmail = "demo-candidate@twinhire.app"
    const existingDemoCand = await db.user.findUnique({ where: { email: demoCandEmail } })
    const candidate = await db.candidate.findFirst({ where: { handle: "observer-77" } })
    if (!existingDemoCand && candidate) {
      await db.user.create({
        data: {
          email: demoCandEmail,
          name: candidate.displayName,
          passwordHash: await bcrypt.hash("demo1234", 12),
          role: "candidate",
          candidateId: candidate.id,
        },
      })
      results.push("demo candidate created (linked to observer-77)")
    } else if (existingDemoCand) {
      results.push("demo candidate already exists")
    } else {
      results.push("demo candidate skipped (no observer-77 found)")
    }

    return NextResponse.json({ success: true, results })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "seed failed" },
      { status: 500 },
    )
  }
}
