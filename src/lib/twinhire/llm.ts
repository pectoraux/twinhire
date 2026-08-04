// TwinHire LLM orchestration layer.
// Provider-independent wrapper over z-ai-web-dev-sdk.
// Every intelligence component routes through here so models / fallbacks can be swapped.

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
 * Load the z-ai-web-dev-sdk config.
 * Priority:
 *  1. Config file (local dev: /etc/.z-ai-config)
 *  2. Environment variables (Vercel/serverless: ZAI_* env vars)
 *  3. Write env-var config to os.homedir() for the SDK to find
 */
function loadZaiConfig(): ZaiConfig | null {
  // 1. Check if a config file already exists (local dev)
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

  // 2. Build config from env vars (Vercel)
  const { ZAI_BASE_URL, ZAI_API_KEY, ZAI_CHAT_ID, ZAI_TOKEN, ZAI_USER_ID } = process.env
  if (!ZAI_CHAT_ID && !ZAI_TOKEN) return null

  const config: ZaiConfig = {
    baseUrl: ZAI_BASE_URL || "https://internal-api.z.ai/v1",
    apiKey: ZAI_API_KEY || "Z.ai",
  }
  if (ZAI_CHAT_ID) config.chatId = ZAI_CHAT_ID
  if (ZAI_TOKEN) config.token = ZAI_TOKEN
  if (ZAI_USER_ID) config.userId = ZAI_USER_ID

  // 3. Try to write to os.homedir() so the SDK's loadConfig finds it
  try {
    fs.writeFileSync(path.join(os.homedir(), ".z-ai-config"), JSON.stringify(config))
  } catch {
    // If write fails, we'll construct ZAI directly
  }

  return config
}

let _zai: ZAI | null = null

async function getClient() {
  if (!_zai) {
    const config = loadZaiConfig()
    if (config) {
      // Construct ZAI directly with our config (bypasses file-based loadConfig)
      _zai = new ZAI(config)
    } else {
      // Fall back to the standard create() which reads from config files
      _zai = await ZAI.create()
    }
  }
  return _zai
}

/**
 * Low-level chat completion. Returns raw text.
 */
export async function complete(systemPrompt: string, userPrompt: string): Promise<string> {
  const zai = await getClient()
  try {
    const completion = await zai.chat.completions.create({
      messages: [
        { role: "assistant", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      thinking: { type: "disabled" },
    })
    const content = completion.choices[0]?.message?.content ?? ""
    return content
  } catch (err) {
    // Surface the underlying cause for debugging on Vercel
    const cause = err instanceof Error ? err.cause : undefined
    throw new Error(
      `LLM request failed: ${err instanceof Error ? err.message : String(err)}` +
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
