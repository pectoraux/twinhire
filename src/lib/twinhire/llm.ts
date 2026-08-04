// TwinHire LLM orchestration layer.
// Provider-independent wrapper over z-ai-web-dev-sdk.
// Every intelligence component routes through here so models / fallbacks can be swapped.
//
// DUAL-MODE OPERATION:
//  - Sandbox (local dev): uses the z-ai-web-dev-sdk with internal-api.z.ai (config file)
//  - Vercel (production): uses the public Z.ai API at api.z.ai/api/paas/v4 with an API key
//    (ZAI_PUBLIC_API_KEY env var). This is needed because internal-api.z.ai resolves to
//    private IPs on Vercel's serverless network.

import ZAI from "z-ai-web-dev-sdk"
import fs from "fs"
import os from "os"
import path from "path"

interface ZaiConfig {
  baseUrl: string
  apiKey: string
  chatId?: string
  token?: string
  userId?: string
}

/**
 * Detect which mode we're in:
 *  - "public-api" if ZAI_PUBLIC_API_KEY is set (Vercel production)
 *  - "sdk" if a z-ai config file exists (sandbox/local dev)
 */
function getMode(): "public-api" | "sdk" {
  if (process.env.ZAI_PUBLIC_API_KEY) return "public-api"
  const configPaths = [
    path.join(process.cwd(), ".z-ai-config"),
    path.join(os.homedir(), ".z-ai-config"),
    "/etc/.z-ai-config",
  ]
  if (configPaths.some((p) => { try { return fs.existsSync(p) } catch { return false } })) {
    return "sdk"
  }
  // If no config file but ZAI_* env vars exist, try SDK mode (might fail)
  return "public-api"
}

// ── SDK mode (sandbox) ───────────────────────────────────────────────

function loadZaiConfig(): ZaiConfig | null {
  const configPaths = [
    path.join(process.cwd(), ".z-ai-config"),
    path.join(os.homedir(), ".z-ai-config"),
    "/etc/.z-ai-config",
  ]
  for (const p of configPaths) {
    try {
      if (fs.existsSync(p)) {
        const cfg = JSON.parse(fs.readFileSync(p, "utf-8"))
        if (cfg.baseUrl && cfg.apiKey) return cfg
      }
    } catch {
      // continue
    }
  }
  return null
}

let _zai: ZAI | null = null

async function getClient() {
  if (!_zai) {
    const config = loadZaiConfig()
    if (config) {
      _zai = new ZAI(config)
    } else {
      _zai = await ZAI.create()
    }
  }
  return _zai
}

async function completeViaSdk(systemPrompt: string, userPrompt: string): Promise<string> {
  const zai = await getClient()
  const completion = await zai.chat.completions.create({
    messages: [
      { role: "assistant", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    thinking: { type: "disabled" },
  })
  return completion.choices[0]?.message?.content ?? ""
}

// ── Public API mode (Vercel) ─────────────────────────────────────────

const PUBLIC_API_URL = "https://api.z.ai/api/paas/v4/chat/completions"
const PUBLIC_MODEL = "glm-4-plus"

async function completeViaPublicApi(systemPrompt: string, userPrompt: string): Promise<string> {
  const apiKey = process.env.ZAI_PUBLIC_API_KEY || process.env.ZAI_API_KEY
  if (!apiKey || apiKey === "Z.ai") {
    throw new Error(
      "ZAI_PUBLIC_API_KEY not set. Get a Z.ai API key from https://z.ai/manage-apikey/apikey-list " +
      "and add it as ZAI_PUBLIC_API_KEY in Vercel env vars."
    )
  }
  const res = await fetch(PUBLIC_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: PUBLIC_MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    }),
  })
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Public Z.ai API error ${res.status}: ${body.slice(0, 200)}`)
  }
  const data = await res.json()
  return data.choices?.[0]?.message?.content ?? ""
}

// ── Unified entry point ──────────────────────────────────────────────

/**
 * Low-level chat completion. Returns raw text.
 * Automatically uses the SDK in the sandbox, or the public Z.ai API on Vercel.
 */
export async function complete(systemPrompt: string, userPrompt: string): Promise<string> {
  const mode = getMode()
  try {
    if (mode === "public-api") {
      return await completeViaPublicApi(systemPrompt, userPrompt)
    }
    return await completeViaSdk(systemPrompt, userPrompt)
  } catch (err) {
    const cause = err instanceof Error ? err.cause : undefined
    throw new Error(
      `LLM request failed (${mode}): ${err instanceof Error ? err.message : String(err)}` +
      (cause ? ` (cause: ${cause instanceof Error ? cause.message : String(cause)})` : ""),
    )
  }
}

/**
 * Ask the model for a JSON object. Strips code fences and extracts the first
 * balanced JSON value. Throws on total failure.
 */
export async function completeJson<T = unknown>(
  systemPrompt: string,
  userPrompt: string,
  retries = 2,
): Promise<T> {
  let lastErr: unknown
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const raw = await complete(systemPrompt, userPrompt)
      const parsed = extractJson<T>(raw)
      if (parsed) return parsed
      throw new Error("No JSON found in model response")
    } catch (err) {
      lastErr = err
      if (attempt < retries) await sleep(400 * (attempt + 1))
    }
  }
  throw lastErr instanceof Error ? lastErr : new Error("LLM JSON completion failed")
}

function extractJson<T>(raw: string): T | null {
  if (!raw) return null
  let text = raw.trim()
  text = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "")
  try {
    return JSON.parse(text) as T
  } catch {
    // fall through
  }
  const start = text.search(/[\[{]/)
  if (start === -1) return null
  const open = text[start]
  const close = open === "{" ? "}" : "]"
  let depth = 0
  let inStr = false
  let escape = false
  for (let i = start; i < text.length; i++) {
    const ch = text[i]
    if (inStr) {
      if (escape) escape = false
      else if (ch === "\\") escape = true
      else if (ch === '"') inStr = false
      continue
    }
    if (ch === '"') inStr = true
    else if (ch === open) depth++
    else if (ch === close) {
      depth--
      if (depth === 0) {
        const slice = text.slice(start, i + 1)
        try {
          return JSON.parse(slice) as T
        } catch {
          return null
        }
      }
    }
  }
  return null
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms))
}
