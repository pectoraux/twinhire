"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowDownRight,
  ArrowUpRight,
  Calendar,
  Clock,
  Globe,
  Loader2,
  Rocket,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

/**
 * WorkFutures — "What will work look like in 2032?"
 *
 * The platform models AI progress, regulation, demographics, education,
 * robotics, labor shortages, and economic sectors to forecast capability
 * markets. This is one of the most valuable products.
 *
 * Also includes Capability Market Dynamics — treating capabilities like
 * financial assets with flows (supply, demand, salary, AI replacement, ROI).
 */

const HORIZONS = [
  { years: 3, label: "3 years" },
  { years: 5, label: "5 years" },
  { years: 7, label: "7 years (2032)" },
  { years: 10, label: "10 years" },
]

// Market dynamics (static — would be live in production)
const MARKET_FLOWS = [
  { capability: "AI Governance", supply: 18, demand: 142, salary: 22, aiReplace: -15, roi: 8, trend: "up" },
  { capability: "Revenue Operations", supply: 34, demand: 87, salary: 14, aiReplace: -8, roi: 6, trend: "up" },
  { capability: "Industrial Automation", supply: 22, demand: 65, salary: 11, aiReplace: -5, roi: 5, trend: "up" },
  { capability: "Manual Data Entry", supply: -12, demand: -45, salary: -8, aiReplace: 38, roi: -3, trend: "down" },
  { capability: "Customer Onboarding", supply: 8, demand: 12, salary: 4, aiReplace: 12, roi: 2, trend: "flat" },
]

export function WorkFutures({ className }: { className?: string }) {
  const [horizon, setHorizon] = useState(7)
  const [result, setResult] = useState<Record<string, unknown> | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const forecast = async (years?: number) => {
    const h = years ?? horizon
    setHorizon(h)
    setLoading(true)
    setError("")
    setResult(null)
    try {
      const res = await fetch("/api/twinhire/work-futures", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ horizon: h }),
      })
      if (!res.ok) throw new Error("failed")
      const data = await res.json()
      setResult(data)
    } catch {
      setError("Forecast failed — try again")
    } finally {
      setLoading(false)
    }
  }

  const targetYear = new Date().getFullYear() + horizon

  return (
    <div className={cn("space-y-6", className)}>
      {/* Work Futures */}
      <div className="rounded-2xl border border-border/60 bg-card p-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="flex items-center gap-2 text-sm font-semibold">
              <Rocket className="h-4 w-4 text-primary" /> Work futures
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">
              What will work look like in {targetYear}? Models AI progress, regulation, demographics, robotics, and labor.
            </p>
          </div>
          {result && (
            <Badge className="rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
              <Sparkles className="mr-1 h-2.5 w-2.5" /> AI-forecast
            </Badge>
          )}
        </div>

        {/* Horizon selector */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {HORIZONS.map((h) => (
            <button
              key={h.years}
              onClick={() => forecast(h.years)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                horizon === h.years
                  ? "border-primary/40 bg-primary/[0.06] text-foreground"
                  : "border-border/60 bg-secondary/30 text-muted-foreground hover:text-foreground",
              )}
            >
              {h.label}
            </button>
          ))}
        </div>

        {loading && (
          <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
            Forecasting work in {targetYear}...
          </div>
        )}

        {error && <p className="mt-2 text-xs text-rose-600">{error}</p>}

        <AnimatePresence>
          {result && !loading && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-5 space-y-4">
              {/* Headline */}
              <div className="rounded-xl border border-primary/20 bg-primary/[0.04] p-4">
                <div className="text-[10px] font-medium uppercase tracking-wider text-primary">Forecast headline</div>
                <p className="mt-1 text-sm leading-relaxed font-medium text-foreground/90">{result.headline as string}</p>
                <div className="mt-2 flex items-center gap-2 text-xs">
                  <Clock className="h-3 w-3 text-primary" />
                  <span className="text-muted-foreground">Confidence: <span className="font-semibold text-foreground">{result.confidence as number}%</span></span>
                </div>
              </div>

              {/* Emerging capabilities */}
              <ForecastSection title="Emerging capabilities" icon={TrendingUp} tone="emerald">
                {(result.emergingCapabilities as Array<Record<string, unknown>>)?.map((cap, i) => (
                  <div key={i} className="flex items-center gap-2 rounded-lg border border-border/40 bg-secondary/20 p-2.5">
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-semibold">{cap.name as string}</div>
                      <div className="text-[10px] text-muted-foreground">{cap.why as string}</div>
                    </div>
                    <div className="shrink-0 text-right">
                      <div className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">+{cap.projectedDemand as number}%</div>
                      <div className="text-[8px] text-muted-foreground">{cap.medianSalary as string}</div>
                    </div>
                  </div>
                ))}
              </ForecastSection>

              {/* Declining capabilities */}
              <ForecastSection title="Declining capabilities" icon={TrendingDown} tone="rose">
                {(result.decliningCapabilities as Array<Record<string, unknown>>)?.map((cap, i) => (
                  <div key={i} className="flex items-center gap-2 rounded-lg border border-border/40 bg-secondary/20 p-2.5">
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-semibold">{cap.name as string}</div>
                      <div className="text-[10px] text-muted-foreground">{cap.why as string}</div>
                      <div className="text-[9px] text-amber-600 dark:text-amber-400">→ replaced by: {cap.replacement as string}</div>
                    </div>
                    <div className="shrink-0 text-right">
                      <div className="font-mono text-xs font-bold text-rose-600 dark:text-rose-400">{cap.projectedDecline as number}%</div>
                    </div>
                  </div>
                ))}
              </ForecastSection>

              {/* Transformed capabilities */}
              <ForecastSection title="Transformed capabilities" icon={Zap} tone="violet">
                {(result.transformedCapabilities as Array<Record<string, unknown>>)?.map((cap, i) => (
                  <div key={i} className="rounded-lg border border-border/40 bg-secondary/20 p-2.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold">{cap.name as string}</span>
                      <span className="rounded-full bg-violet-100 px-1.5 py-0.5 text-[8px] font-medium text-violet-700 dark:bg-violet-500/15 dark:text-violet-300">
                        AI: {cap.aiAugmentation as number}%
                      </span>
                    </div>
                    <div className="mt-1 flex items-start gap-2 text-[10px]">
                      <div className="flex-1">
                        <span className="text-muted-foreground">Before: </span>
                        <span className="text-foreground/80">{cap.before as string}</span>
                      </div>
                      <ArrowUpRight className="h-3 w-3 shrink-0 text-violet-500" />
                      <div className="flex-1">
                        <span className="text-muted-foreground">After: </span>
                        <span className="text-foreground/80">{cap.after as string}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </ForecastSection>

              {/* Industry shifts */}
              <ForecastSection title="Industry shifts" icon={Globe} tone="blue">
                <div className="space-y-1.5">
                  {(result.industryShifts as Array<Record<string, unknown>>)?.map((shift, i) => (
                    <div key={i} className="flex items-start gap-2 text-[10px]">
                      <span className="font-semibold text-blue-600 dark:text-blue-400">{shift.industry as string}:</span>
                      <span className="text-muted-foreground">{shift.shift as string}</span>
                      <span className="text-foreground/70 italic">— {shift.impact as string}</span>
                    </div>
                  ))}
                </div>
              </ForecastSection>

              {/* Workforce composition + risk */}
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl bg-primary/[0.04] p-3">
                  <div className="text-[10px] font-medium uppercase tracking-wider text-primary">Workforce composition</div>
                  <p className="mt-1 text-xs leading-relaxed text-foreground/80">{result.workforceComposition as string}</p>
                </div>
                <div className="rounded-xl bg-rose-50/30 p-3 dark:bg-rose-500/[0.06]">
                  <div className="text-[10px] font-medium uppercase tracking-wider text-rose-600 dark:text-rose-400">Biggest risk</div>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{result.biggestRisk as string}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Capability Market Dynamics */}
      <div className="rounded-2xl border border-border/60 bg-card p-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="flex items-center gap-2 text-sm font-semibold">
              <Calendar className="h-4 w-4 text-primary" /> Capability market dynamics
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Treat capabilities like financial assets. Show flows, not just demand.
            </p>
          </div>
        </div>

        <div className="mt-4 overflow-x-auto scroll-slim">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border/60 text-[9px] uppercase tracking-wider text-muted-foreground">
                <th className="pb-2 pr-3 font-medium">Capability</th>
                <th className="pb-2 pr-3 font-medium text-right">Supply</th>
                <th className="pb-2 pr-3 font-medium text-right">Demand</th>
                <th className="pb-2 pr-3 font-medium text-right">Salary</th>
                <th className="pb-2 pr-3 font-medium text-right">AI Replace</th>
                <th className="pb-2 pr-3 font-medium text-right">ROI</th>
                <th className="pb-2 font-medium">Trend</th>
              </tr>
            </thead>
            <tbody>
              {MARKET_FLOWS.map((flow, i) => (
                <motion.tr
                  key={flow.capability}
                  initial={{ opacity: 0, y: 4 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04 }}
                  className="border-b border-border/30 hover:bg-secondary/20"
                >
                  <td className="py-2.5 pr-3 font-medium">{flow.capability}</td>
                  <td className="py-2.5 pr-3 text-right">
                    <FlowValue value={flow.supply} suffix="%" />
                  </td>
                  <td className="py-2.5 pr-3 text-right">
                    <FlowValue value={flow.demand} suffix="%" />
                  </td>
                  <td className="py-2.5 pr-3 text-right">
                    <FlowValue value={flow.salary} suffix="%" />
                  </td>
                  <td className="py-2.5 pr-3 text-right">
                    <FlowValue value={flow.aiReplace} suffix="%" invert />
                  </td>
                  <td className="py-2.5 pr-3 text-right">
                    <FlowValue value={flow.roi} suffix="%" />
                  </td>
                  <td className="py-2.5">
                    {flow.trend === "up" && <ArrowUpRight className="h-3 w-3 text-emerald-500" />}
                    {flow.trend === "down" && <ArrowDownRight className="h-3 w-3 text-rose-500" />}
                    {flow.trend === "flat" && <span className="text-muted-foreground">→</span>}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-3 flex items-start gap-2 rounded-lg bg-primary/[0.04] p-3">
          <Globe className="mt-0.5 h-3 w-3 shrink-0 text-primary" />
          <p className="text-[11px] leading-relaxed text-muted-foreground">
            <span className="font-medium text-foreground">Capabilities are financial assets.</span>{" "}
            Supply, demand, salary, AI replacement risk, and ROI all flow and change. The platform tracks these flows in real time.
          </p>
        </div>
      </div>
    </div>
  )
}

function ForecastSection({
  title,
  icon: Icon,
  tone,
  children,
}: {
  title: string
  icon: React.ElementType
  tone: "emerald" | "rose" | "violet" | "blue"
  children: React.ReactNode
}) {
  const toneCls = {
    emerald: "text-emerald-600 dark:text-emerald-400",
    rose: "text-rose-600 dark:text-rose-400",
    violet: "text-violet-600 dark:text-violet-400",
    blue: "text-blue-600 dark:text-blue-400",
  }[tone]
  return (
    <div>
      <div className={cn("flex items-center gap-2 text-[10px] font-medium uppercase tracking-wider", toneCls)}>
        <Icon className="h-3 w-3" /> {title}
      </div>
      <div className="mt-2 space-y-1.5">{children}</div>
    </div>
  )
}

function FlowValue({ value, suffix, invert }: { value: number; suffix: string; invert?: boolean }) {
  const isPositive = invert ? value < 0 : value > 0
  const isNeutral = value === 0
  return (
    <span className={cn(
      "font-mono text-xs font-semibold",
      isNeutral ? "text-muted-foreground" : isPositive ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400",
    )}>
      {value > 0 ? "+" : ""}{value}{suffix}
    </span>
  )
}
