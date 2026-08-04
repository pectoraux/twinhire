import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

// GET /api/user/api-keys — list the current user's API keys (key values masked)
export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: "unauthorized" }, { status: 401 })

  const keys = await db.userApiKey.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  })

  // Mask key values for security
  const masked = keys.map((k) => ({
    ...k,
    keyValue: k.keyValue.slice(0, 6) + "••••••••" + k.keyValue.slice(-4),
  }))

  return NextResponse.json({ keys: masked })
}

// POST /api/user/api-keys — add or update an API key
export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: "unauthorized" }, { status: 401 })

  try {
    const { provider, keyValue, label } = (await req.json()) as {
      provider?: string
      keyValue?: string
      label?: string
    }
    if (!provider || !keyValue?.trim()) {
      return NextResponse.json({ error: "provider and keyValue are required" }, { status: 400 })
    }

    // Upsert (one key per provider per user)
    const key = await db.userApiKey.upsert({
      where: { userId_provider: { userId: session.user.id, provider } },
      update: { keyValue: keyValue.trim(), label: label ?? null, isActive: true },
      create: {
        userId: session.user.id,
        provider,
        keyValue: keyValue.trim(),
        label: label ?? null,
        isActive: true,
      },
    })

    return NextResponse.json({
      success: true,
      key: { ...key, keyValue: key.keyValue.slice(0, 6) + "••••••••" + key.keyValue.slice(-4) },
    })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "failed to save key" },
      { status: 500 },
    )
  }
}
