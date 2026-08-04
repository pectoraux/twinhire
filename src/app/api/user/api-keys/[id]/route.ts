import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

// DELETE /api/user/api-keys/[id] — remove an API key
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: "unauthorized" }, { status: 401 })

  const { id } = await params
  const key = await db.userApiKey.findUnique({ where: { id } })
  if (!key || key.userId !== session.user.id) {
    return NextResponse.json({ error: "not found" }, { status: 404 })
  }

  await db.userApiKey.delete({ where: { id } })
  return NextResponse.json({ success: true })
}

// PATCH /api/user/api-keys/[id] — toggle active or mark verified
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: "unauthorized" }, { status: 401 })

  const { id } = await params
  const { isActive, markVerified } = (await req.json()) as { isActive?: boolean; markVerified?: boolean }

  const key = await db.userApiKey.findUnique({ where: { id } })
  if (!key || key.userId !== session.user.id) {
    return NextResponse.json({ error: "not found" }, { status: 404 })
  }

  const data: Record<string, unknown> = {}
  if (isActive !== undefined) data.isActive = isActive
  if (markVerified) data.lastVerifiedAt = new Date()

  const updated = await db.userApiKey.update({ where: { id }, data })
  return NextResponse.json({ success: true, key: updated })
}
