// TwinHire LLM orchestration layer.
// Provider-independent wrapper over z-ai-web-dev-sdk.
// Every intelligence component routes through here so models / fallbacks can be swapped.

import ZAI from "z-ai-web-dev-sdk"
import fs from "fs"
import os from "os"
import path from "path"

/**
 * Ensure the z-ai-web-dev-sdk config file exists.
 * Locally, /etc/.z-ai-config is present. On Vercel/serverless, we create it
 * from environment variables at runtime (writing to os.homedir() which is /tmp).
 */
function ensureZaiConfig() {
  const configPaths = [
    path.join(process.cwd(), ".z-ai-config"),
    path.join(os.homedir(), ".z-ai-config"),
    "/etc/.z-ai-config",
  ]
  // If any config file already exists, nothing to do
  if (configPaths.some((p) => { try { return fs.existsSync(p) } catch { return false } })) return

  // Create from env vars (set on Vercel)
  const { ZAI_BASE_URL, ZAI_API_KEY, ZAI_CHAT_ID, ZAI_TOKEN, ZAI_USER_ID } = process.env
  if (!ZAI_CHAT_ID || !ZAI_TOKEN || !ZAI_USER_ID) return

  const config = JSON.stringify({
    baseUrl: ZAI_BASE_URL || "https://internal-api.z.ai/v1",
    apiKey: ZAI_API_KEY || "Z.ai",
    chatId: ZAI_CHAT_ID,
    token: ZAI_TOKEN,
    userId: ZAI_USER_ID,
  })
  try {
    fs.writeFileSync(path.join(os.homedir(), ".z-ai-config"), config)
  } catch {
    // silent — will fail gracefully
  }
}

let _zai: Awaited<ReturnType<typeof ZAI.create>> | null = null

async function getClient() {
  if (!_zai) {
    ensureZaiConfig()
    _zai = await ZAI.create()
  }
  return _zai
}

/**
 * Low-level chat completion. Returns raw text.
 */
export async function complete(systemPrompt: string, userPrompt: string): Promise<string> {
  const zai = await getClient()
  const completion = await zai.chat.completions.create({
    messages: [
      { role: "assistant", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    thinking: { type: "disabled" },
  })
  const content = completion.choices[0]?.message?.content ?? ""
  return content
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
  // Remove markdown code fences
  let text = raw.trim()
  text = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "")
  // Try direct parse
  try {
    return JSON.parse(text) as T
  } catch {
    // fall through
  }
  // Extract first balanced { ... } or [ ... ]
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
