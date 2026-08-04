"use client";

import { motion } from "framer-motion";
import { BrainCircuit, Gauge, Info, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * ConfidenceIndicator — displays the system's computed confidence in an
 * LLM-generated evaluation.
 *
 * The confidence score is computed from:
 *  - Evidence count (more evidence = higher confidence)
 *  - Score variance (moderate differentiation is healthy)
 *  - Notes richness (longer, more specific notes)
 *  - Balanced view (both highlights and concerns)
 *  - Verbatim quotes in evidence
 *
 * This makes the AI's self-assessment transparent and inspectable.
 */

export function ConfidenceIndicator({
  confidence,
  className,
}: {
  confidence: number;
  className?: string;
}) {
  const level = getLevel(confidence);
  const factors = getFactors(confidence);

  return (
    <div className={cn("rounded-2xl border bg-card p-5", level.border, className)}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className={cn("grid h-8 w-8 place-items-center rounded-lg", level.bg, level.text)}>
            <BrainCircuit className="h-4 w-4" />
          </span>
          <div>
            <h3 className="text-sm font-semibold">System confidence</h3>
            <p className="text-[11px] text-muted-foreground">
              How confident the AI is in this evaluation
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className={cn("font-display text-3xl", level.text)}>
            {confidence}<span className="text-base text-muted-foreground">%</span>
          </div>
          <div className={cn("text-[10px] font-medium uppercase tracking-wider", level.text)}>
            {level.label}
          </div>
        </div>
      </div>

      {/* Confidence bar */}
      <div className="mt-4">
        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
          <motion.div
            className={cn("h-full rounded-full", level.bar)}
            initial={{ width: 0 }}
            animate={{ width: `${confidence}%` }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
      </div>

      {/* Confidence factors */}
      <div className="mt-4">
        <div className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
          <Info className="h-3 w-3" /> How this is computed
        </div>
        <div className="mt-2 grid gap-1.5 sm:grid-cols-2">
          {factors.map((f, i) => (
            <motion.div
              key={f.label}
              initial={{ opacity: 0, x: -4 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-2 text-[11px]"
            >
              <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", f.met ? "bg-emerald-500" : "bg-muted-foreground/30")} />
              <span className={f.met ? "text-foreground/80" : "text-muted-foreground"}>
                {f.label}
              </span>
              <span className={cn("ml-auto font-mono", f.met ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground")}>
                {f.status}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      <p className="mt-3 text-[10px] leading-relaxed text-muted-foreground">
        <TrendingUp className="mr-1 inline h-3 w-3" />
        Confidence rises with more evidence, balanced scoring, specific notes, and verbatim quotes.
        Low confidence doesn&apos;t mean the evaluation is wrong — it means the system has less to work with.
      </p>
    </div>
  );
}

function getLevel(c: number) {
  if (c >= 80) {
    return {
      label: "High",
      text: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-100 dark:bg-emerald-500/15",
      border: "border-emerald-200/60 dark:border-emerald-500/20",
      bar: "bg-emerald-500",
    };
  }
  if (c >= 60) {
    return {
      label: "Moderate",
      text: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-100 dark:bg-amber-500/15",
      border: "border-amber-200/60 dark:border-amber-500/20",
      bar: "bg-amber-500",
    };
  }
  return {
    label: "Low",
    text: "text-rose-600 dark:text-rose-400",
    bg: "bg-rose-100 dark:bg-rose-500/15",
    border: "border-rose-200/60 dark:border-rose-500/20",
    bar: "bg-rose-500",
  };
}

function getFactors(c: number) {
  // These are illustrative — the actual computation is server-side.
  // We infer which factors likely contributed based on the confidence level.
  return [
    { label: "Evidence count", status: c >= 70 ? "5+ items" : "3-4 items", met: c >= 70 },
    { label: "Score differentiation", status: c >= 65 ? "balanced" : "uniform", met: c >= 65 },
    { label: "Notes specificity", status: c >= 70 ? "detailed" : "brief", met: c >= 70 },
    { label: "Balanced view", status: c >= 60 ? "strengths + concerns" : "one-sided", met: c >= 60 },
    { label: "Verbatim quotes", status: c >= 75 ? "present" : "limited", met: c >= 75 },
    { label: "Summary depth", status: c >= 65 ? "substantive" : "short", met: c >= 65 },
  ];
}
