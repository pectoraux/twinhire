"use client";

import { motion } from "framer-motion";
import { BarChart3, Globe, TrendingUp, Users } from "lucide-react";
import { ScoreBar, CountUp } from "./primitives";
import { cn } from "@/lib/utils";

/**
 * SkillExplorer — browse the network's aggregate skill benchmarks.
 *
 * The vision: "As more candidates participate, skill benchmarks improve."
 * This panel shows the distribution of demonstrated capabilities across
 * the network, making the aggregate intelligence visible and explorable.
 */

interface SkillBenchmark {
  domain: string
  networkAvg: number
  topDecile: number
  bottomDecile: number
  candidateCount: number
  trend: "rising" | "stable" | "declining"
  hottestGap: string
}

const BENCHMARKS: SkillBenchmark[] = [
  { domain: "Lifecycle & Activation Growth", networkAvg: 61, topDecile: 88, bottomDecile: 38, candidateCount: 203, trend: "rising", hottestGap: "Email automation ownership" },
  { domain: "Operations & Process Design", networkAvg: 64, topDecile: 91, bottomDecile: 42, candidateCount: 312, trend: "rising", hottestGap: "Cross-functional handoff design" },
  { domain: "Data & Analytics Modeling", networkAvg: 57, topDecile: 85, bottomDecile: 31, candidateCount: 178, trend: "stable", hottestGap: "Forecasting & predictive models" },
  { domain: "Product Strategy", networkAvg: 55, topDecile: 82, bottomDecile: 34, candidateCount: 156, trend: "stable", hottestGap: "Pricing & packaging" },
  { domain: "Technical Writing / SOPs", networkAvg: 68, topDecile: 94, bottomDecile: 45, candidateCount: 241, trend: "rising", hottestGap: "Knowledge architecture" },
  { domain: "AI Leverage & Automation", networkAvg: 49, topDecile: 79, bottomDecile: 22, candidateCount: 134, trend: "rising", hottestGap: "Multi-agent workflow design" },
  { domain: "Engineering", networkAvg: 63, topDecile: 90, bottomDecile: 40, candidateCount: 267, trend: "stable", hottestGap: "DevRel & DX" },
  { domain: "Customer Success", networkAvg: 66, topDecile: 89, bottomDecile: 44, candidateCount: 198, trend: "declining", hottestGap: "Churn prediction" },
];

const TREND_META = {
  rising: { cls: "text-emerald-600 dark:text-emerald-400", label: "rising", icon: "↑" },
  stable: { cls: "text-muted-foreground", label: "stable", icon: "→" },
  declining: { cls: "text-rose-600 dark:text-rose-400", label: "declining", icon: "↓" },
} as const;

export function SkillExplorer({ className }: { className?: string }) {
  const totalCandidates = BENCHMARKS.reduce((a, b) => a + b.candidateCount, 0);
  const overallAvg = Math.round(BENCHMARKS.reduce((a, b) => a + b.networkAvg, 0) / BENCHMARKS.length);

  return (
    <div className={cn("rounded-2xl border border-border/60 bg-card p-6", className)}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="flex items-center gap-2 text-sm font-semibold">
            <Globe className="h-4 w-4 text-primary" /> Skill benchmark explorer
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Aggregate demonstrated capabilities across the network. Benchmarks sharpen as more candidates participate.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-center">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Candidates</div>
            <div className="font-display text-lg">
              <CountUp value={totalCandidates} />
            </div>
          </div>
          <div className="h-8 w-px bg-border" />
          <div className="text-center">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Network avg</div>
            <div className="font-display text-lg text-primary">{overallAvg}</div>
          </div>
        </div>
      </div>

      {/* Benchmark list */}
      <div className="mt-5 space-y-2.5">
        {BENCHMARKS.map((b, i) => {
          const trend = TREND_META[b.trend];
          return (
            <motion.div
              key={b.domain}
              initial={{ opacity: 0, y: 6 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="rounded-xl border border-border/50 bg-secondary/20 p-3"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium truncate">{b.domain}</span>
                    <span className={cn("flex items-center gap-0.5 text-[10px] font-medium", trend.cls)}>
                      {trend.icon} {trend.label}
                    </span>
                  </div>
                  <div className="mt-0.5 flex items-center gap-3 text-[10px] text-muted-foreground">
                    <span className="flex items-center gap-0.5"><Users className="h-2.5 w-2.5" /> {b.candidateCount}</span>
                    <span>·</span>
                    <span>Hottest gap: {b.hottestGap}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-display text-lg text-primary">{b.networkAvg}</div>
                  <div className="text-[9px] text-muted-foreground">avg /100</div>
                </div>
              </div>

              {/* Distribution bar: bottom decile → top decile */}
              <div className="mt-2 relative h-2">
                <div className="absolute inset-0 rounded-full bg-muted" />
                <div
                  className="absolute h-full rounded-full bg-gradient-to-r from-primary/40 to-primary"
                  style={{
                    left: `${b.bottomDecile}%`,
                    width: `${b.topDecile - b.bottomDecile}%`,
                  }}
                />
                {/* Network avg marker */}
                <div
                  className="absolute top-1/2 h-3.5 w-0.5 -translate-y-1/2 rounded-full bg-foreground"
                  style={{ left: `${b.networkAvg}%` }}
                />
              </div>
              <div className="mt-1 flex justify-between text-[9px] text-muted-foreground">
                <span>bottom {b.bottomDecile}</span>
                <span>top {b.topDecile}</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center gap-4 text-[10px] text-muted-foreground">
        <span className="flex items-center gap-1">
          <span className="h-0.5 w-3 rounded-full bg-gradient-to-r from-primary/40 to-primary" />
          decile range
        </span>
        <span className="flex items-center gap-1">
          <span className="h-3 w-0.5 rounded-full bg-foreground" />
          network average
        </span>
        <span className="ml-auto flex items-center gap-1">
          <BarChart3 className="h-3 w-3" />
          {BENCHMARKS.length} domains benchmarked
        </span>
      </div>

      {/* Insight */}
      <div className="mt-4 flex items-start gap-2 rounded-xl bg-primary/[0.04] p-3">
        <TrendingUp className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
        <p className="text-[11px] leading-relaxed text-muted-foreground">
          <span className="font-medium text-foreground">AI Leverage & Automation</span> has the lowest
          network average (49/100) but is rising fastest — the highest-ROI skill gap in the network
          right now. Candidates who demonstrate this capability stand out most.
        </p>
      </div>
    </div>
  );
}
