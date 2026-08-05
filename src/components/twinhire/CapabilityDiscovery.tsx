"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  DollarSign,
  Lightbulb,
  Loader2,
  Sparkles,
  TrendingUp,
  X,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { BusinessTwinView } from "@/lib/twinhire/types";

/**
 * CapabilityDiscovery — businesses don't create job descriptions.
 * They answer questions about pain points. The AI produces ranked
 * missing capabilities with projected business impact.
 */

const QUESTIONS = [
  { id: "frustration", label: "What frustrates your team?", placeholder: "e.g. Manual data entry, slow approvals, knowledge scattered across Slack…" },
  { id: "stalls", label: "Where do projects stall?", placeholder: "e.g. Cross-functional handoffs, waiting on data, unclear ownership…" },
  { id: "slow", label: "What takes too long?", placeholder: "e.g. Onboarding, reporting, customer support resolution…" },
  { id: "people", label: "What requires too many people?", placeholder: "e.g. Invoice reconciliation, QA, content review…" },
  { id: "kpis", label: "Which KPIs are declining?", placeholder: "e.g. NRR down 3pt, CAC up $12, churn at 9.4%…" },
  { id: "opportunities", label: "What opportunities are you missing?", placeholder: "e.g. Upsell, EU expansion, product-led growth…" },
];

interface DiscoveredCapability {
  name: string
  category: string
  projectedRevenueImpact: string
  projectedEbitdaImpact?: string
  costReduction?: string
  confidence: number
  urgency: string
  timeToValue: string
  hiringDifficulty: number
  aiReplaceLikelihood: number
  aiAugmentLikelihood: number
  recommendedOrder: number
}

export function CapabilityDiscovery({ twin }: { twin: BusinessTwinView }) {
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{
    capabilities: DiscoveredCapability[]
    summary: string
    totalProjectedImpact: string
  } | null>(null)
  const [error, setError] = useState("")

  const handleAnalyze = async () => {
    setLoading(true)
    setError("")
    setResult(null)
    try {
      const answersText = Object.entries(answers)
        .filter(([, v]) => v.trim())
        .map(([k, v]) => {
          const q = QUESTIONS.find((q) => q.id === k)
          return `${q?.label}: ${v}`
        })
        .join("\n")

      const res = await fetch("/api/twinhire/capability-discovery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ twinId: twin.id, answers: answersText }),
      })
      if (!res.ok) throw new Error("failed")
      const data = await res.json()
      setResult(data)
    } catch {
      setError("Analysis failed — try again")
    } finally {
      setLoading(false)
    }
  }

  const answeredCount = Object.values(answers).filter((v) => v.trim()).length

  return (
    <div className="rounded-2xl border border-border/60 bg-card p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="flex items-center gap-2 text-sm font-semibold">
            <Sparkles className="h-4 w-4 text-primary" /> Capability discovery
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Don&apos;t write a job description. Answer questions about your pain points — the AI identifies missing capabilities.
          </p>
        </div>
        {result && (
          <Badge className="rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
            {result.capabilities.length} capabilities found
          </Badge>
        )}
      </div>

      {/* Questionnaire */}
      {!result && (
        <div className="mt-5 space-y-3">
          {QUESTIONS.map((q, i) => (
            <motion.div
              key={q.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <label className="text-xs font-medium text-muted-foreground">{q.label}</label>
              <textarea
                value={answers[q.id] ?? ""}
                onChange={(e) => setAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))}
                placeholder={q.placeholder}
                className="mt-1 h-16 w-full resize-none rounded-xl border border-border/60 bg-background p-3 text-sm outline-none transition-colors placeholder:text-muted-foreground/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/15 scroll-slim"
              />
            </motion.div>
          ))}

          <div className="flex items-center justify-between gap-3 pt-2">
            <span className="text-xs text-muted-foreground">
              {answeredCount} of {QUESTIONS.length} answered {answeredCount === 0 && "— or let the AI analyze from your twin's known problems"}
            </span>
            <Button
              onClick={handleAnalyze}
              disabled={loading}
              className="h-10 gap-1.5 rounded-full px-5"
            >
              {loading ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Analyzing…</>
              ) : (
                <><Sparkles className="h-4 w-4" /> Discover capabilities</>
              )}
            </Button>
          </div>
          {error && <p className="text-xs text-rose-600">{error}</p>}
        </div>
      )}

      {/* Results */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-5"
          >
            {/* Summary */}
            <div className="rounded-xl bg-primary/[0.04] p-4">
              <p className="text-sm leading-relaxed text-foreground/90">{result.summary}</p>
              <div className="mt-2 flex items-center gap-2">
                <TrendingUp className="h-3.5 w-3.5 text-primary" />
                <span className="text-sm font-semibold text-primary">{result.totalProjectedImpact}</span>
              </div>
            </div>

            {/* Capability ranking */}
            <div className="mt-4 space-y-2">
              {result.capabilities
                .sort((a, b) => a.recommendedOrder - b.recommendedOrder)
                .map((cap, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="rounded-xl border border-border/50 bg-secondary/20 p-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="grid h-6 w-6 place-items-center rounded-full bg-primary text-primary-foreground text-[10px] font-bold">
                            {cap.recommendedOrder}
                          </span>
                          <span className="text-sm font-semibold">{cap.name}</span>
                          <Badge variant="outline" className="rounded-md text-[9px]">{cap.category}</Badge>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-muted-foreground">
                          {cap.projectedRevenueImpact && (
                            <span className="flex items-center gap-1">
                              <DollarSign className="h-2.5 w-2.5 text-emerald-600" />
                              <span className="font-medium text-emerald-700 dark:text-emerald-400">{cap.projectedRevenueImpact}</span>
                            </span>
                          )}
                          {cap.projectedEbitda && (
                            <span>EBITDA: <span className="font-medium text-emerald-700 dark:text-emerald-400">{cap.projectedEbitda}</span></span>
                          )}
                          {cap.costReduction && (
                            <span>Cost: <span className="font-medium text-amber-700 dark:text-amber-400">{cap.costReduction}</span></span>
                          )}
                          <span>Time-to-value: <span className="font-medium text-foreground">{cap.timeToValue}</span></span>
                          <span>Confidence: <span className="font-medium text-foreground">{cap.confidence}%</span></span>
                        </div>
                        {/* AI metrics */}
                        <div className="mt-1.5 flex flex-wrap gap-2">
                          <span className={cn(
                            "inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[9px] font-medium",
                            cap.urgency === "Critical" ? "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300" :
                            cap.urgency === "High" ? "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300" :
                            "bg-secondary text-muted-foreground",
                          )}>
                            <AlertCircle className="h-2 w-2" /> {cap.urgency}
                          </span>
                          <span className="inline-flex items-center gap-1 rounded-full bg-violet-50 px-1.5 py-0.5 text-[9px] font-medium text-violet-700 dark:bg-violet-500/10 dark:text-violet-300">
                            <Zap className="h-2 w-2" /> AI augment: {cap.aiAugmentLikelihood}%
                          </span>
                          <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-1.5 py-0.5 text-[9px] font-medium text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">
                            AI replace: {cap.aiReplaceLikelihood}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
            </div>

            {/* Reset */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setResult(null)
                setAnswers({})
              }}
              className="mt-4 h-8 gap-1.5 rounded-full text-xs"
            >
              <X className="h-3 w-3" /> Start over
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
