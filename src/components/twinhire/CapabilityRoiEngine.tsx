"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Brain,
  CheckCircle2,
  Database,
  DollarSign,
  Loader2,
  Sparkles,
  TrendingUp,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

/**
 * CapabilityRoiEngine — "the most valuable feature."
 *
 * The vision: "The platform learns: Capability → Business Outcome → Revenue →
 * Profit → Retention → Growth → Time Saved → Hiring Success. Then it can say:
 * 'Companies with 50-200 employees in logistics that added Process Automation
 * Engineering increased operating margins by 11.4% within 18 months.'"
 *
 * This is an intelligence product no recruiter can provide.
 */

const QUICK_CAPABILITIES = [
  "Process Automation Engineering",
  "Customer Onboarding Optimization",
  "Demand Forecasting",
  "AI Agent Design",
  "Revenue Operations",
  "Churn Prediction",
]

interface RoiResult {
  headline: string
  projections: {
    metric: string
    baseline: string
    projected: string
    delta: string
    timeframe: string
    confidence: number
  }[]
  crossIndustryPattern: string
  comparableCapabilities: { name: string; avgRoi: string; fasterToValue: boolean }[]
  risks: string[]
  recommendation: string
}

export function CapabilityRoiEngine({ className }: { className?: string }) {
  const [capability, setCapability] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<RoiResult | null>(null)
  const [error, setError] = useState("")

  const analyze = async (cap?: string) => {
    const target = cap ?? capability
    if (!target.trim()) return
    setCapability(target)
    setLoading(true)
    setError("")
    setResult(null)
    try {
      const res = await fetch("/api/twinhire/capability-roi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ capability: target }),
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

  return (
    <div className={cn("rounded-2xl border border-border/60 bg-card p-6", className)}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="flex items-center gap-2 text-sm font-semibold">
            <BarChart3 className="h-4 w-4 text-primary" /> Capability ROI engine
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            What happens when a business adds this capability? Cross-industry intelligence no recruiter can provide.
          </p>
        </div>
        {result && (
          <Badge className="rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
            <Sparkles className="mr-1 h-2.5 w-2.5" /> AI-analyzed
          </Badge>
        )}
      </div>

      {/* Input */}
      <div className="mt-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={capability}
            onChange={(e) => setCapability(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && analyze()}
            placeholder="Enter a capability (e.g. 'Process Automation Engineering')..."
            className="h-10 flex-1 rounded-xl border border-border/60 bg-background px-3 text-sm outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/15"
          />
          <Button onClick={() => analyze()} disabled={loading || !capability.trim()} className="h-10 gap-1.5 rounded-xl px-4">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            {loading ? "Analyzing…" : "Analyze ROI"}
          </Button>
        </div>
        {/* Quick capabilities */}
        <div className="mt-2 flex flex-wrap gap-1.5">
          {QUICK_CAPABILITIES.map((cap) => (
            <button
              key={cap}
              onClick={() => analyze(cap)}
              disabled={loading}
              className="rounded-full border border-border/60 bg-secondary/30 px-2.5 py-1 text-[10px] font-medium text-muted-foreground transition-colors hover:border-primary/30 hover:bg-primary/[0.04] hover:text-foreground"
            >
              {cap}
            </button>
          ))}
        </div>
      </div>

      {error && <p className="mt-2 text-xs text-rose-600">{error}</p>}

      {/* Result */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-5 space-y-4"
          >
            {/* Headline */}
            <div className="rounded-xl border border-primary/20 bg-primary/[0.04] p-4">
              <div className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-wider text-primary">
                <TrendingUp className="h-3 w-3" /> ROI headline
              </div>
              <p className="mt-1.5 text-sm leading-relaxed font-medium text-foreground/90">
                {result.headline}
              </p>
            </div>

            {/* Projections */}
            <div>
              <div className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                <DollarSign className="h-3 w-3" /> Business projections
              </div>
              <div className="mt-2 space-y-2">
                {result.projections.map((proj, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-3 rounded-xl border border-border/50 bg-secondary/20 p-3"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-semibold">{proj.metric}</div>
                      <div className="text-[10px] text-muted-foreground">
                        {proj.baseline} → <span className="font-medium text-foreground">{proj.projected}</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className={cn(
                        "font-mono text-sm font-bold",
                        proj.delta.startsWith("+") || proj.delta.startsWith("-") && !proj.delta.includes("pt") && proj.delta.includes("-") === false
                          ? "text-emerald-600 dark:text-emerald-400"
                          : proj.delta.startsWith("-")
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-emerald-600 dark:text-emerald-400",
                      )}>
                        {proj.delta}
                      </div>
                      <div className="text-[9px] text-muted-foreground">{proj.timeframe}</div>
                    </div>
                    <div className="shrink-0 text-right">
                      <div className="font-mono text-xs font-semibold text-primary">{proj.confidence}%</div>
                      <div className="text-[8px] text-muted-foreground">conf.</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Cross-industry pattern */}
            <div className="rounded-xl border border-violet-200/50 bg-violet-50/30 p-3 dark:border-violet-500/20 dark:bg-violet-500/[0.06]">
              <div className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-wider text-violet-700 dark:text-violet-300">
                <Database className="h-3 w-3" /> Cross-industry pattern
              </div>
              <p className="mt-1 text-xs leading-relaxed text-foreground/80">{result.crossIndustryPattern}</p>
            </div>

            {/* Comparable capabilities */}
            <div>
              <div className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                <Brain className="h-3 w-3" /> Comparable capabilities
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {result.comparableCapabilities.map((comp, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border/50 bg-secondary/30 px-2.5 py-1 text-[11px]"
                  >
                    {comp.name}
                    <span className="font-mono text-[10px] text-primary">{comp.avgRoi}</span>
                    {comp.fasterToValue && (
                      <span className="rounded-full bg-emerald-100 px-1 py-0.5 text-[8px] font-medium text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
                        faster
                      </span>
                    )}
                  </span>
                ))}
              </div>
            </div>

            {/* Risks */}
            {result.risks.length > 0 && (
              <div className="rounded-xl border border-rose-200/50 bg-rose-50/30 p-3 dark:border-rose-500/20 dark:bg-rose-500/[0.06]">
                <div className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-wider text-rose-700 dark:text-rose-300">
                  <AlertTriangle className="h-3 w-3" /> Risks of NOT adding this capability
                </div>
                <ul className="mt-1.5 space-y-1">
                  {result.risks.map((risk, i) => (
                    <li key={i} className="flex gap-1.5 text-xs text-foreground/80">
                      <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-rose-500" />
                      {risk}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Recommendation */}
            <div className="rounded-xl bg-gradient-to-r from-primary/[0.06] to-[oklch(0.74_0.135_70)]/[0.06] p-4">
              <div className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-wider text-primary">
                <CheckCircle2 className="h-3 w-3" /> Recommendation
              </div>
              <p className="mt-1 text-sm leading-relaxed text-foreground/90">{result.recommendation}</p>
            </div>

            {/* Reset */}
            <Button variant="ghost" size="sm" onClick={() => { setResult(null); setCapability(""); }} className="h-8 gap-1 rounded-full text-xs">
              <X className="h-3 w-3" /> Analyze another
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
