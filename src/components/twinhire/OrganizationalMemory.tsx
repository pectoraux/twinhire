"use client";

import { motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import {
  BrainCircuit,
  CheckCircle2,
  Database,
  Lightbulb,
  Loader2,
  Network,
  TrendingUp,
} from "lucide-react";
import { CountUp } from "./primitives";
import { cn } from "@/lib/utils";

/**
 * OrganizationalMemory — the platform's compound knowledge.
 *
 * The vision: "Every completed task should become a reusable organizational
 * improvement. After enough companies... TwinHire develops the world's largest
 * knowledge graph of organizational capabilities."
 *
 * This is the moat. The platform can say:
 * "147 logistics companies solved this exact operational bottleneck."
 * "Companies like yours typically hire too early for Sales Operations."
 */

interface SolvedProblem {
  problem: string
  solution: string
  impact: string
  industry: string
  capability: string
  solver: string
  aiAssisted: boolean
  worked: boolean
  date: string
}

const SOLVED_PROBLEMS: SolvedProblem[] = [
  {
    problem: "Inventory turnover stuck at 3.1x with 8% stockout rate",
    solution: "Moving-average forecast + lead-time safety stock for A-class SKUs, phased to B-class with seasonality",
    impact: "Turnover → 3.6x, stockouts → <4%, $1.3M recovered",
    industry: "D2C Consumer Goods",
    capability: "Demand Forecasting",
    solver: "@data-poet",
    aiAssisted: true,
    worked: true,
    date: "2026-07-28",
  },
  {
    problem: "Carrier paperwork reconciliation taking 14 hrs/week per dispatcher",
    solution: "OCR pipeline + automated matching against load records with exception-only review",
    impact: "560 hrs/month reclaimed, +1.8pt margin/load",
    industry: "Freight & Logistics",
    capability: "Operations Automation",
    solver: "@ops-ninja",
    aiAssisted: true,
    worked: true,
    date: "2026-07-15",
  },
  {
    problem: "Customer churn at 9.4% quarterly, concentrated in mid-market",
    solution: "Health scoring model + proactive outreach playbook for at-risk accounts",
    impact: "Churn → 6.1%, NRR → 96%",
    industry: "Healthcare SaaS",
    capability: "Churn Prediction",
    solver: "@builder-x",
    aiAssisted: false,
    worked: true,
    date: "2026-07-02",
  },
  {
    problem: "Onboarding taking 34 days vs 14-day target",
    solution: "Process redesign with parallelized IT provisioning + knowledge base consolidation",
    impact: "Onboarding → 18 days, CSAT +0.4",
    industry: "Healthcare SaaS",
    capability: "Process Redesign",
    solver: "@sage-writer",
    aiAssisted: true,
    worked: true,
    date: "2026-06-20",
  },
  {
    problem: "Pricing model hadn't been revisited since launch; top 10% subsidized",
    solution: "Usage-based pricing v2 with tiered commitments and power-user surcharge",
    impact: "+35% ARPA, aligned cost-to-serve",
    industry: "Embedded Payments",
    capability: "Pricing Strategy",
    solver: "@product-mind",
    aiAssisted: false,
    worked: true,
    date: "2026-06-08",
  },
]

const CROSS_INDUSTRY_INSIGHTS = [
  {
    text: "147 logistics companies solved carrier reconciliation with OCR + exception workflows",
    category: "Operations",
  },
  {
    text: "Companies typically hire too early for Sales Operations and too late for RevOps",
    category: "Hiring Pattern",
  },
  {
    text: "The highest-performing finance hires almost always improve forecasting before touching reporting",
    category: "Talent Pattern",
  },
  {
    text: "D2C companies that implement demand forecasting within 90 days see 15% carrying cost reduction",
    category: "Outcome Pattern",
  },
  {
    text: "AI-assisted solutions have 23% higher implementation success rate when the candidate verifies AI output against real data",
    category: "AI Leverage",
  },
]

export function OrganizationalMemory({ className }: { className?: string }) {
  const [liveInsights, setLiveInsights] = useState<typeof CROSS_INDUSTRY_INSIGHTS | null>(null)
  const [liveStats, setLiveStats] = useState<{ solvedCount: number; successRate: number; moatStatement: string } | null>(null)
  const [loading, setLoading] = useState(false)
  const [isLive, setIsLive] = useState(false)

  const fetchInsights = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/twinhire/org-memory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      })
      if (!res.ok) throw new Error("failed")
      const data = await res.json()
      if (data.insights?.length > 0) {
        setLiveInsights(data.insights.map((i: { text: string; category: string; confidence: number }) => ({
          text: i.text,
          category: i.category,
        })))
        setLiveStats({
          solvedCount: data.solvedCount ?? 1247,
          successRate: data.successRate ?? 87,
          moatStatement: data.moatStatement ?? "",
        })
        setIsLive(true)
      }
    } catch {
      // silent — keep static fallback
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void fetchInsights()
  }, [fetchInsights])

  const insights = isLive && liveInsights ? liveInsights : CROSS_INDUSTRY_INSIGHTS
  const totalProblems = liveStats?.solvedCount ?? 1247
  const successRate = liveStats?.successRate ?? 87

  return (
    <div className={cn("rounded-2xl border border-border/60 bg-card p-6", className)}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="flex items-center gap-2 text-sm font-semibold">
            <Database className="h-4 w-4 text-primary" /> Organizational memory
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Every solved problem becomes reusable knowledge. The platform compounds — this is the moat.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-center">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Problems solved</div>
            <div className="font-display text-lg text-primary">
              <CountUp value={totalProblems} />
            </div>
          </div>
          <div className="h-8 w-px bg-border" />
          <div className="text-center">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Success rate</div>
            <div className="font-display text-lg">{successRate}%</div>
          </div>
        </div>
      </div>

      {/* Cross-industry insights */}
      <div className="mt-5">
        <div className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-wider text-primary">
          <Network className="h-3 w-3" /> Cross-industry intelligence
          {loading && <Loader2 className="ml-1 h-2.5 w-2.5 animate-spin" />}
          {isLive && !loading && (
            <span className="ml-1 rounded-full bg-emerald-100 px-1.5 py-0.5 text-[8px] font-medium text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
              AI-generated
            </span>
          )}
        </div>
        <div className="mt-2 space-y-2">
          {insights.map((insight, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -6 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="flex items-start gap-2.5 rounded-xl border border-primary/20 bg-primary/[0.03] p-3"
            >
              <Lightbulb className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
              <div className="flex-1">
                <p className="text-sm leading-relaxed text-foreground/90">{insight.text}</p>
                <span className="mt-0.5 inline-block rounded-full bg-secondary px-1.5 py-0.5 text-[9px] text-muted-foreground">
                  {insight.category}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recently solved problems */}
      <div className="mt-5">
        <div className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
          <CheckCircle2 className="h-3 w-3" /> Recently solved
        </div>
        <div className="mt-2 max-h-[300px] space-y-2 overflow-y-auto scroll-slim">
          {SOLVED_PROBLEMS.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 4 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="rounded-xl border border-border/50 bg-secondary/20 p-3"
            >
              <div className="flex items-center gap-2">
                <span className="grid h-5 w-5 place-items-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400">
                  <CheckCircle2 className="h-3 w-3" />
                </span>
                <span className="text-xs font-medium truncate">{s.problem}</span>
                {s.aiAssisted && (
                  <span className="ml-auto shrink-0 rounded-full bg-primary/10 px-1.5 py-0.5 text-[8px] font-medium text-primary">
                    AI-assisted
                  </span>
                )}
              </div>
              <p className="mt-1.5 text-[11px] leading-relaxed text-muted-foreground">
                <span className="font-medium text-foreground/80">Solution:</span> {s.solution}
              </p>
              <div className="mt-1.5 flex items-center gap-3 text-[10px] text-muted-foreground">
                <span className="text-emerald-600 dark:text-emerald-400 font-medium">{s.impact}</span>
                <span>·</span>
                <span>{s.industry}</span>
                <span>·</span>
                <span>{s.solver}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* The moat */}
      <div className="mt-4 flex items-start gap-2 rounded-xl bg-gradient-to-r from-primary/[0.06] to-[oklch(0.74_0.135_70)]/[0.06] p-4">
        <BrainCircuit className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
        <div>
          <p className="text-xs font-semibold text-primary">The competitive moat</p>
          <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
            After enough companies, TwinHire develops the world&apos;s largest knowledge graph of organizational
            problem-solving. No competitor can replicate this without the same volume of observed work.
          </p>
        </div>
      </div>
    </div>
  )
}
