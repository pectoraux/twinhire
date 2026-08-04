"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Compass,
  GraduationCap,
  Lightbulb,
  Loader2,
  Sparkles,
  Target,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils"

interface Debrief {
  modelAnswer: string
  whatThisTested: string
  comparison: {
    candidateDidWell: string[]
    candidateMissed: string[]
    keyDifference: string
  }
  learningEdge: string
}

export function SimulationDebrief({
  debrief,
  loading,
  onRequest,
}: {
  debrief: Debrief | null
  loading: boolean
  onRequest: () => void
}) {
  if (!debrief && !loading) {
    return (
      <div className="rounded-2xl border border-dashed border-border/70 bg-secondary/20 p-6 text-center">
        <GraduationCap className="mx-auto h-8 w-8 text-primary" />
        <h3 className="mt-3 font-display text-xl">Simulation debrief</h3>
        <p className="mt-1 max-w-md mx-auto text-sm text-muted-foreground">
          See how a strong operator would have approached this, and what you can learn from the
          comparison.
        </p>
        <Button onClick={onRequest} className="mt-4 h-10 gap-1.5 rounded-full">
          <Sparkles className="h-4 w-4" /> Generate debrief
        </Button>
      </div>
    )
  }

  if (loading || !debrief) {
    return (
      <div className="rounded-2xl border border-border/60 bg-card p-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
          Generating your debrief — model answer, comparison, and learning edge…
        </div>
        <div className="mt-4 space-y-3">
          <div className="shimmer h-4 w-3/4 rounded" />
          <div className="shimmer h-4 w-full rounded" />
          <div className="shimmer h-4 w-5/6 rounded" />
          <div className="shimmer h-4 w-2/3 rounded" />
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-border/60 bg-card p-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary">
          <GraduationCap className="h-4 w-4" />
        </span>
        <div>
          <h3 className="text-sm font-semibold">Simulation debrief</h3>
          <p className="text-[11px] text-muted-foreground">
            What this tested, how a strong operator would approach it, and what to learn
          </p>
        </div>
      </div>

      {/* What this tested */}
      <div className="mt-5 rounded-xl border border-primary/20 bg-primary/[0.03] p-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-primary">
          <Target className="h-3.5 w-3.5" /> What this tested
        </div>
        <p className="mt-1.5 text-sm leading-relaxed text-foreground/90">{debrief.whatThisTested}</p>
      </div>

      {/* Model answer */}
      <div className="mt-4">
        <div className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
          <BookOpen className="h-3 w-3" /> Model answer — how a strong operator would approach this
        </div>
        <div className="mt-2 rounded-xl border border-border/50 bg-secondary/20 p-4">
          <p className="text-sm leading-relaxed text-foreground/90">{debrief.modelAnswer}</p>
        </div>
      </div>

      {/* Comparison */}
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {/* Did well */}
        <div className="rounded-xl border border-emerald-200/60 bg-emerald-50/40 p-4 dark:border-emerald-500/20 dark:bg-emerald-500/[0.06]">
          <h4 className="flex items-center gap-2 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
            <CheckCircle2 className="h-3.5 w-3.5" /> What you did well
          </h4>
          <ul className="mt-2 space-y-1.5">
            {debrief.comparison.candidateDidWell.map((item, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -4 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex gap-2 text-xs text-foreground/85"
              >
                <CheckCircle2 className="mt-0.5 h-3 w-3 shrink-0 text-emerald-600 dark:text-emerald-400" />
                <span>{item}</span>
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Missed */}
        <div className="rounded-xl border border-amber-200/60 bg-amber-50/40 p-4 dark:border-amber-500/20 dark:bg-amber-500/[0.06]">
          <h4 className="flex items-center gap-2 text-xs font-semibold text-amber-700 dark:text-amber-300">
            <Lightbulb className="h-3.5 w-3.5" /> A stronger answer would have
          </h4>
          <ul className="mt-2 space-y-1.5">
            {debrief.comparison.candidateMissed.map((item, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -4 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex gap-2 text-xs text-foreground/85"
              >
                <ArrowRight className="mt-0.5 h-3 w-3 shrink-0 text-amber-600 dark:text-amber-400" />
                <span>{item}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>

      {/* Key difference */}
      <div className="mt-3 rounded-xl border border-border/50 bg-secondary/30 p-4">
        <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
          The key difference
        </div>
        <p className="mt-1 text-sm leading-relaxed text-foreground/90">
          {debrief.comparison.keyDifference}
        </p>
      </div>

      {/* Learning edge */}
      <div className="mt-3 flex items-start gap-3 rounded-xl bg-gradient-to-r from-primary/[0.06] to-[oklch(0.74_0.135_70)]/[0.06] p-4">
        <Compass className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
        <div>
          <div className="text-xs font-semibold text-primary">Your learning edge</div>
          <p className="mt-1 text-sm leading-relaxed text-foreground/90">{debrief.learningEdge}</p>
        </div>
      </div>
    </div>
  )
}
