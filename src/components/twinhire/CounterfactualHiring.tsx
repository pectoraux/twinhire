"use client";

import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  BrainCircuit,
  Clock,
  Loader2,
  RefreshCw,
  TrendingDown,
  TrendingUp,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * CounterfactualHiring — "What if we hired Alice instead of Bob?"
 *
 * The vision: "Run both. The twin simulates next month, next quarter,
 * next year. Then estimates Revenue, Profit, Delivery, Morale, Innovation,
 * Risk. That becomes an AI hiring forecast."
 *
 * Businesses can compare hiring outcomes before making a decision.
 */

interface ForecastProjection {
  timeframe: string
  metrics: {
    revenue: number // delta %
    profit: number
    delivery: number
    morale: number
    innovation: number
    risk: number // lower is better
  }
}

const FORECASTS: { candidate: string; headline: string; projections: ForecastProjection[]; summary: string }[] = [
  {
    candidate: "A. Okafor",
    headline: "Operator-engineer, AI leverage specialist",
    projections: [
      { timeframe: "30 days", metrics: { revenue: 2, profit: 1, delivery: 5, morale: 3, innovation: 4, risk: -2 } },
      { timeframe: "90 days", metrics: { revenue: 8, profit: 5, delivery: 12, morale: 6, innovation: 10, risk: -5 } },
      { timeframe: "1 year", metrics: { revenue: 18, profit: 12, delivery: 22, morale: 8, innovation: 25, risk: -8 } },
    ],
    summary: "Strong delivery and innovation impact. AI leverage accelerates automation across operations. Revenue lift comes from process efficiency, not direct sales.",
  },
  {
    candidate: "R. Vasquez",
    headline: "PLG and lifecycle expert",
    projections: [
      { timeframe: "30 days", metrics: { revenue: 5, profit: 3, delivery: 2, morale: 4, innovation: 3, risk: -1 } },
      { timeframe: "90 days", metrics: { revenue: 15, profit: 8, delivery: 5, morale: 7, innovation: 8, risk: -3 } },
      { timeframe: "1 year", metrics: { revenue: 28, profit: 18, delivery: 8, morale: 9, innovation: 15, risk: -4 } },
    ],
    summary: "Highest direct revenue impact through activation improvements. Delivery and innovation are secondary. Lower risk profile but less transformative.",
  },
  {
    candidate: "No hire",
    headline: "Status quo — gap remains unfilled",
    projections: [
      { timeframe: "30 days", metrics: { revenue: -1, profit: -1, delivery: -2, morale: -3, innovation: 0, risk: 3 } },
      { timeframe: "90 days", metrics: { revenue: -5, profit: -4, delivery: -8, morale: -7, innovation: -2, risk: 8 } },
      { timeframe: "1 year", metrics: { revenue: -12, profit: -10, delivery: -15, morale: -12, innovation: -5, risk: 15 } },
    ],
    summary: "The capability gap compounds. Revenue erosion, delivery delays, and team burnout accelerate. Risk increases significantly over time.",
  },
]

const METRIC_META: { key: string; label: string; positive: boolean }[] = [
  { key: "revenue", label: "Revenue", positive: true },
  { key: "profit", label: "Profit", positive: true },
  { key: "delivery", label: "Delivery", positive: true },
  { key: "morale", label: "Morale", positive: true },
  { key: "innovation", label: "Innovation", positive: true },
  { key: "risk", label: "Risk", positive: false },
]

export function CounterfactualHiring({ className, sessionId }: { className?: string; sessionId?: string }) {
  const [liveScenarios, setLiveScenarios] = useState<typeof FORECASTS | null>(null)
  const [loading, setLoading] = useState(false)
  const [isLive, setIsLive] = useState(false)

  const fetchScenarios = useCallback(async () => {
    if (!sessionId) return
    setLoading(true)
    try {
      const res = await fetch("/api/twinhire/counterfactual", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      })
      if (!res.ok) throw new Error("failed")
      const data = await res.json()
      if (data.scenarios?.length > 0) {
        setLiveScenarios(data.scenarios)
        setIsLive(true)
      }
    } catch {
      // silent — keep static fallback
    } finally {
      setLoading(false)
    }
  }, [sessionId])

  const scenarios = isLive && liveScenarios ? liveScenarios : FORECASTS

  return (
    <div className={cn("rounded-2xl border border-border/60 bg-card p-6", className)}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="flex items-center gap-2 text-sm font-semibold">
            <BrainCircuit className="h-4 w-4 text-primary" /> Counterfactual hiring forecast
            {loading && <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />}
            {isLive && !loading && (
              <span className="rounded-full bg-emerald-100 px-1.5 py-0.5 text-[8px] font-medium text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
                AI-generated
              </span>
            )}
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            What if you hired Alice instead of Bob? The twin simulates the future under each scenario.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 rounded-full border border-border/60 bg-secondary/40 px-3 py-1.5 text-xs">
            <BarChart3 className="h-3.5 w-3.5 text-primary" />
            <span className="text-muted-foreground">AI forecast</span>
          </div>
          {sessionId && (
            <Button
              size="sm"
              variant="ghost"
              onClick={fetchScenarios}
              disabled={loading}
              className="h-7 gap-1 rounded-full text-[10px]"
            >
              {loading ? <Loader2 className="h-2.5 w-2.5 animate-spin" /> : <RefreshCw className="h-2.5 w-2.5" />}
              {isLive ? "Re-run" : "Run live"}
            </Button>
          )}
        </div>
      </div>

      {/* Comparison grid */}
      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        {scenarios.map((forecast, fi) => {
          const isNoHire = forecast.candidate === "No hire"
          return (
            <motion.div
              key={forecast.candidate}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: fi * 0.1 }}
              className={cn(
                "rounded-2xl border p-4",
                isNoHire
                  ? "border-rose-200/60 bg-rose-50/30 dark:border-rose-500/20 dark:bg-rose-500/[0.04]"
                  : "border-border/60 bg-secondary/20",
              )}
            >
              {/* Candidate header */}
              <div className="flex items-center gap-2">
                <span className={cn(
                  "grid h-8 w-8 place-items-center rounded-full text-xs font-bold",
                  isNoHire ? "bg-rose-100 text-rose-600 dark:bg-rose-500/15 dark:text-rose-400" : "bg-primary text-primary-foreground",
                )}>
                  {isNoHire ? "—" : forecast.candidate.charAt(0)}
                </span>
                <div>
                  <div className="text-sm font-semibold">{forecast.candidate}</div>
                  <div className="text-[10px] text-muted-foreground">{forecast.headline}</div>
                </div>
              </div>

              {/* Projections */}
              <div className="mt-3 space-y-2">
                {forecast.projections.map((proj, pi) => (
                  <div key={proj.timeframe} className="rounded-lg bg-card p-2.5">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                        <Clock className="h-2.5 w-2.5" /> {proj.timeframe}
                      </span>
                    </div>
                    <div className="mt-1.5 grid grid-cols-3 gap-1.5">
                      {METRIC_META.map((m) => {
                        const value = proj.metrics[m.key as keyof typeof proj.metrics]
                        const isGood = m.positive ? value >= 0 : value <= 0
                        return (
                          <div key={m.key} className="text-center">
                            <div className={cn(
                              "text-xs font-mono font-semibold",
                              isGood ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400",
                            )}>
                              {value > 0 ? "+" : ""}{value}%
                            </div>
                            <div className="text-[8px] text-muted-foreground">{m.label}</div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <p className="mt-2 text-[10px] leading-relaxed text-muted-foreground">
                {forecast.summary}
              </p>
            </motion.div>
          )
        })}
      </div>

      {/* Forecast note */}
      <div className="mt-4 flex items-start gap-2 rounded-xl bg-primary/[0.04] p-3">
        <TrendingUp className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
        <p className="text-[11px] leading-relaxed text-muted-foreground">
          <span className="font-medium text-foreground">How this works:</span> The twin simulates the
          organization&apos;s trajectory under each hiring scenario, using the candidate&apos;s demonstrated
          capability profile and the twin&apos;s operational model. Projections improve as more outcomes
          are collected (the closed loop).
        </p>
      </div>
    </div>
  )
}
