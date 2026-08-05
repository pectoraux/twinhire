"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Brain,
  ChevronDown,
  GitBranch,
  Layers,
  Loader2,
  Network,
  Sparkles,
  TrendingUp,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { BusinessTwinView } from "@/lib/twinhire/types";

/**
 * CausalIntelligenceEngine — moves beyond correlations to causality.
 *
 * "Revenue Operations only produced those gains BECAUSE the company first
 * standardized CRM data, reduced sales cycle variability, and introduced
 * pipeline governance."
 *
 * Shows causal chains with confidence, reasoning, and "what breaks without this."
 */

interface CausalStep {
  step: number
  action: string
  enables: string
  confidence: number
  reasoning: string
  withoutThis: string
}

interface CausalResult {
  primaryDriver: string
  causalChain: CausalStep[]
  outcome: string
  alternativePaths: { path: string; likelihood: number; tradeoff: string }[]
  summary: string
}

const QUESTIONS = [
  "Why are companies like ours growing faster?",
  "What actually caused our churn to decrease?",
  "Why did our margins improve last quarter?",
  "What's the root cause of our delivery delays?",
]

export function CausalIntelligenceEngine({ twin }: { twin: BusinessTwinView }) {
  const [question, setQuestion] = useState("")
  const [result, setResult] = useState<CausalResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [expanded, setExpanded] = useState<number | null>(0)

  const analyze = async (q?: string) => {
    const target = q ?? question
    if (!target.trim()) return
    setQuestion(target)
    setLoading(true)
    setError("")
    setResult(null)
    try {
      const res = await fetch("/api/twinhire/causal-engine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ twinId: twin.id, question: target }),
      })
      if (!res.ok) throw new Error("failed")
      const data = await res.json()
      setResult(data)
    } catch {
      setError("Causal analysis failed — try again")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-2xl border border-border/60 bg-card p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="flex items-center gap-2 text-sm font-semibold">
            <Brain className="h-4 w-4 text-primary" /> Causal intelligence engine
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Not correlation — causality. Why did X produce gains? Because the company first did A, B, and C.
          </p>
        </div>
        {result && (
          <Badge className="rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
            <Sparkles className="mr-1 h-2.5 w-2.5" /> AI-generated
          </Badge>
        )}
      </div>

      {/* Input */}
      <div className="mt-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && analyze()}
            placeholder="Ask a causal question..."
            className="h-10 flex-1 rounded-xl border border-border/60 bg-background px-3 text-sm outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/15"
          />
          <Button onClick={() => analyze()} disabled={loading || !question.trim()} className="h-10 gap-1.5 rounded-xl px-4">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Brain className="h-4 w-4" />}
            {loading ? "Reasoning…" : "Analyze"}
          </Button>
        </div>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {QUESTIONS.map((q) => (
            <button
              key={q}
              onClick={() => analyze(q)}
              disabled={loading}
              className="rounded-full border border-border/60 bg-secondary/30 px-2.5 py-1 text-[10px] font-medium text-muted-foreground transition-colors hover:border-primary/30 hover:bg-primary/[0.04] hover:text-foreground"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {error && <p className="mt-2 text-xs text-rose-600">{error}</p>}

      {/* Result */}
      <AnimatePresence>
        {result && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-5 space-y-4">
            {/* Primary driver + outcome */}
            <div className="rounded-xl border border-primary/20 bg-primary/[0.04] p-4">
              <div className="text-[10px] font-medium uppercase tracking-wider text-primary">Primary driver</div>
              <div className="mt-1 text-sm font-semibold">{result.primaryDriver}</div>
              <div className="mt-2 flex items-center gap-2 text-xs">
                <ArrowRight className="h-3 w-3 text-primary" />
                <span className="text-muted-foreground">Outcome:</span>
                <span className="font-medium">{result.outcome}</span>
              </div>
            </div>

            {/* Causal chain */}
            <div>
              <div className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                <GitBranch className="h-3 w-3" /> Causal chain — each step ENABLES the next
              </div>
              <div className="mt-2 space-y-2">
                {result.causalChain.map((step, i) => (
                  <div key={i}>
                    <button
                      onClick={() => setExpanded(expanded === i ? null : i)}
                      className="flex w-full items-center gap-3 rounded-xl border border-border/50 bg-secondary/20 p-3 text-left transition-colors hover:bg-secondary/30"
                    >
                      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground text-[10px] font-bold">
                        {step.step}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-semibold">{step.action}</div>
                        <div className="text-[10px] text-muted-foreground">→ enables: {step.enables}</div>
                      </div>
                      <div className="shrink-0 text-right">
                        <div className="font-mono text-xs font-semibold text-primary">{step.confidence}%</div>
                        <div className="text-[8px] text-muted-foreground">conf.</div>
                      </div>
                      <ChevronDown className={cn("h-3.5 w-3.5 text-muted-foreground transition-transform", expanded === i && "rotate-180")} />
                    </button>
                    <AnimatePresence>
                      {expanded === i && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="px-3 pb-3 pt-1 space-y-2">
                            <div className="rounded-lg bg-card p-2.5">
                              <div className="text-[9px] font-medium uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Why this was necessary</div>
                              <p className="mt-0.5 text-[11px] leading-relaxed text-foreground/80">{step.reasoning}</p>
                            </div>
                            <div className="rounded-lg bg-rose-50/50 p-2.5 dark:bg-rose-500/[0.06]">
                              <div className="text-[9px] font-medium uppercase tracking-wider text-rose-600 dark:text-rose-400">Without this step</div>
                              <p className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground">{step.withoutThis}</p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>

            {/* Alternative paths */}
            <div>
              <div className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                <Network className="h-3 w-3" /> Alternative causal paths
              </div>
              <div className="mt-2 space-y-1.5">
                {result.alternativePaths.map((alt, i) => (
                  <div key={i} className="flex items-center gap-2 rounded-lg border border-border/40 bg-secondary/20 p-2.5">
                    <span className="flex-1 text-[11px] text-foreground/80">{alt.path}</span>
                    <span className="font-mono text-[10px] font-semibold text-primary">{alt.likelihood}%</span>
                    <span className="text-[9px] text-muted-foreground italic max-w-[150px] truncate">{alt.tradeoff}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div className="rounded-xl bg-gradient-to-r from-primary/[0.06] to-[oklch(0.74_0.135_70)]/[0.06] p-4">
              <p className="text-sm leading-relaxed text-foreground/90">{result.summary}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
