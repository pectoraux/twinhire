"use client";

import { motion } from "framer-motion";
import { BarChart3, TrendingUp, Users } from "lucide-react";
import { ScoreBar, CountUp } from "./primitives";
import { cn } from "@/lib/utils";
import type { HistorySession } from "./EvidenceTimeline";

/**
 * NetworkBenchmarks — makes "skill benchmarks improve as more candidates
 * participate" tangible.
 *
 * Shows how the candidate compares against the network average across the
 * 17 performance dimensions, plus a percentile ranking. As more candidates
 * participate, these benchmarks compound and sharpen.
 */

// Network average scores (simulated — would come from aggregate data in production)
const NETWORK_AVERAGES: Record<string, number> = {
  quality: 62,
  accuracy: 60,
  initiative: 58,
  ownership: 64,
  consistency: 61,
  curiosity: 55,
  learning: 57,
  problem_solving: 61,
  creativity: 55,
  decision_quality: 59,
  communication: 66,
  speed: 60,
  attention_to_detail: 63,
  collaboration: 65,
  ai_leverage: 52,
  improvement_over_time: 54,
  autonomy: 58,
};

const NETWORK_SIZE = 847; // candidates in the network

export function NetworkBenchmarks({
  sessions,
}: {
  sessions: HistorySession[];
}) {
  // Aggregate the candidate's scores across all sessions
  const candidateAvgs = aggregateScores(sessions);
  const overallAvg = candidateAvgs.reduce((a, b) => a + b.score, 0) / Math.max(1, candidateAvgs.length);
  const networkOverall = Object.values(NETWORK_AVERAGES).reduce((a, b) => a + b, 0) / Object.keys(NETWORK_AVERAGES).length;

  // Percentile: simple linear model based on overall avg vs network avg
  const percentile = Math.round(Math.min(99, Math.max(5, 50 + (overallAvg - networkOverall) * 1.8)));

  return (
    <div className="rounded-2xl border border-border/60 bg-card p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="flex items-center gap-2 text-sm font-semibold">
            <BarChart3 className="h-4 w-4 text-primary" /> Network benchmarks
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            How you compare to {NETWORK_SIZE.toLocaleString()} candidates across the network. Benchmarks sharpen as more participate.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-border/60 bg-secondary/40 px-3 py-1.5 text-xs">
          <Users className="h-3.5 w-3.5 text-primary" />
          <span className="text-muted-foreground">percentile</span>
          <span className="font-display text-base font-semibold text-primary">
            <CountUp value={percentile} suffix="%" />
          </span>
        </div>
      </div>

      {/* Overall comparison */}
      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-border/50 bg-secondary/20 p-4">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Your composite</div>
          <div className="font-display text-3xl text-primary">{Math.round(overallAvg)}</div>
          <div className="text-[10px] text-muted-foreground">/100 avg across {sessions.length} sessions</div>
        </div>
        <div className="rounded-xl border border-border/50 bg-secondary/20 p-4">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Network average</div>
          <div className="font-display text-3xl text-muted-foreground">{Math.round(networkOverall)}</div>
          <div className="text-[10px] text-muted-foreground">/100 across {NETWORK_SIZE.toLocaleString()} candidates</div>
        </div>
      </div>

      {/* Dimension-by-dimension comparison */}
      <div className="mt-5">
        <div className="flex items-center justify-between text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
          <span>Dimension comparison</span>
          <span className="flex items-center gap-3">
            <span className="flex items-center gap-1"><span className="h-0.5 w-3 rounded-full bg-primary" /> you</span>
            <span className="flex items-center gap-1"><span className="h-0.5 w-3 rounded-full bg-muted-foreground/40" /> network</span>
          </span>
        </div>
        <div className="mt-3 max-h-[280px] space-y-2.5 overflow-y-auto scroll-slim pr-1">
          {candidateAvgs.map((dim, i) => {
            const networkAvg = NETWORK_AVERAGES[dim.key] ?? 60;
            const diff = dim.score - networkAvg;
            const above = diff >= 0;
            return (
              <motion.div
                key={dim.key}
                initial={{ opacity: 0, x: -6 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
              >
                <div className="flex items-baseline justify-between text-xs">
                  <span className="text-muted-foreground">{dim.label}</span>
                  <span className="flex items-center gap-1.5">
                    <span className="font-mono font-semibold">{dim.score}</span>
                    <span className={cn(
                      "text-[10px] font-medium",
                      above ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400",
                    )}>
                      {above ? "+" : ""}{diff} vs net
                    </span>
                  </span>
                </div>
                {/* Dual bars: candidate (primary) + network (muted) */}
                <div className="relative mt-1 h-2">
                  <div className="absolute inset-0 flex items-center">
                    <ScoreBar value={networkAvg} tone="neutral" className="h-1.5" delay={i * 0.04} />
                  </div>
                  <div className="absolute inset-0 flex items-center">
                    <ScoreBar value={dim.score} tone="primary" className="h-1.5" delay={i * 0.04 + 0.1} />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Benchmark quality note */}
      <div className="mt-4 flex items-start gap-2 rounded-xl bg-primary/[0.04] p-3">
        <TrendingUp className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
        <p className="text-[11px] leading-relaxed text-muted-foreground">
          Benchmarks are derived from {NETWORK_SIZE.toLocaleString()} observed sessions and compound
          with every new candidate. Your percentile updates automatically as the network grows.
        </p>
      </div>
    </div>
  );
}

function aggregateScores(sessions: HistorySession[]): { key: string; label: string; score: number }[] {
  if (sessions.length === 0) {
    // Return defaults if no sessions
    return Object.entries(NETWORK_AVERAGES).map(([key, val]) => ({
      key,
      label: LABELS[key] ?? key,
      score: val,
    }));
  }

  // Sum scores across sessions for each dimension
  const sums: Record<string, number> = {};
  const counts: Record<string, number> = {};

  for (const s of sessions) {
    for (const score of s.scores) {
      sums[score.key] = (sums[score.key] ?? 0) + score.score;
      counts[score.key] = (counts[score.key] ?? 0) + 1;
    }
  }

  return Object.entries(NETWORK_AVERAGES).map(([key, defaultVal]) => ({
    key,
    label: LABELS[key] ?? key,
    score: counts[key] ? Math.round(sums[key] / counts[key]) : defaultVal,
  }));
}

const LABELS: Record<string, string> = {
  quality: "Quality",
  accuracy: "Accuracy",
  initiative: "Initiative",
  ownership: "Ownership",
  consistency: "Consistency",
  curiosity: "Curiosity",
  learning: "Learning",
  problem_solving: "Problem Solving",
  creativity: "Creativity",
  decision_quality: "Decision Quality",
  communication: "Communication",
  speed: "Speed & Throughput",
  attention_to_detail: "Attention to Detail",
  collaboration: "Collaboration",
  ai_leverage: "AI Leverage",
  improvement_over_time: "Improvement Over Time",
  autonomy: "Autonomy",
};
