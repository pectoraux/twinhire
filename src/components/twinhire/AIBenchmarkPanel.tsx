"use client";

import { motion } from "framer-motion";
import { Bot, Clock, Cpu, Trophy, User, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AIBenchmark } from "@/lib/twinhire/types";

/**
 * AIBenchmarkPanel — "Is this person better than AI?"
 *
 * Shows how AI models performed on the same task alongside the candidate.
 * This creates an entirely new hiring paradigm: the question isn't just
 * "can this person do the job?" but "is this person better than AI at
 * doing the job?"
 */

export function AIBenchmarkPanel({
  candidateScore,
  benchmarks,
}: {
  candidateScore: number;
  benchmarks: AIBenchmark[];
}) {
  if (!benchmarks || benchmarks.length === 0) return null;

  // Sort: candidate first, then AI models by score
  const all = [
    { name: "Candidate", score: candidateScore, isHuman: true, strength: "", weakness: "", timeSeconds: 0 },
    ...benchmarks.map((b) => ({ ...b, isHuman: false })),
  ].sort((a, b) => b.score - a.score);

  const candidateRank = all.findIndex((a) => a.isHuman) + 1;
  const candidateBeatAI = benchmarks.every((b) => candidateScore >= b.score);
  const maxScore = Math.max(...all.map((a) => a.score));

  return (
    <div className="rounded-2xl border border-border/60 bg-card p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="flex items-center gap-2 text-sm font-semibold">
            <Cpu className="h-4 w-4 text-primary" /> AI vs Human benchmark
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Is this person better than AI? Every task is attempted by multiple AI models for direct comparison.
          </p>
        </div>
        {candidateBeatAI && (
          <div className="flex items-center gap-1.5 rounded-full border border-emerald-200/70 bg-emerald-50 px-3 py-1.5 text-xs dark:border-emerald-500/20 dark:bg-emerald-500/10">
            <Trophy className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            <span className="font-medium text-emerald-700 dark:text-emerald-300">
              Beat all AI models
            </span>
          </div>
        )}
      </div>

      {/* Ranking */}
      <div className="mt-5 space-y-2">
        {all.map((entry, i) => {
          const isWinner = i === 0
          const barWidth = (entry.score / maxScore) * 100
          return (
            <motion.div
              key={entry.name}
              initial={{ opacity: 0, x: -6 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className={cn(
                "flex items-center gap-3 rounded-xl border p-3",
                entry.isHuman
                  ? "border-primary/40 bg-primary/[0.04]"
                  : isWinner
                    ? "border-emerald-200/60 bg-emerald-50/40 dark:border-emerald-500/20 dark:bg-emerald-500/[0.06]"
                    : "border-border/50 bg-secondary/20",
              )}
            >
              {/* Rank */}
              <div className={cn(
                "grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-bold",
                isWinner ? "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300" : "bg-secondary text-muted-foreground",
              )}>
                {isWinner ? "★" : i + 1}
              </div>

              {/* Identity */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  {entry.isHuman ? (
                    <User className="h-3.5 w-3.5 text-primary" />
                  ) : (
                    <Bot className="h-3.5 w-3.5 text-muted-foreground" />
                  )}
                  <span className={cn("text-sm font-medium", entry.isHuman && "text-primary")}>
                    {entry.name}
                  </span>
                  {entry.isHuman && (
                    <span className="rounded-full bg-primary/10 px-1.5 py-0.5 text-[9px] font-medium text-primary">
                      HUMAN
                    </span>
                  )}
                </div>
                {/* Score bar */}
                <div className="mt-1.5 flex items-center gap-2">
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                    <motion.div
                      className={cn(
                        "h-full rounded-full",
                        entry.isHuman ? "bg-primary" : isWinner ? "bg-emerald-500" : "bg-muted-foreground/40",
                      )}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${barWidth}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                    />
                  </div>
                  <span className={cn(
                    "font-mono text-sm font-bold",
                    entry.isHuman ? "text-primary" : isWinner ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground",
                  )}>
                    {entry.score}
                  </span>
                </div>
                {/* Strength/weakness for AI models */}
                {!entry.isHuman && entry.strength && (
                  <div className="mt-1.5 flex items-start gap-2 text-[10px] text-muted-foreground">
                    <Zap className="mt-0.5 h-2.5 w-2.5 shrink-0 text-emerald-500" />
                    <span>{entry.strength}</span>
                  </div>
                )}
                {!entry.isHuman && entry.weakness && (
                  <div className="mt-0.5 flex items-start gap-2 text-[10px] text-muted-foreground">
                    <span className="mt-0.5 h-1 w-1 shrink-0 rounded-full bg-rose-400" />
                    <span>{entry.weakness}</span>
                  </div>
                )}
              </div>

              {/* Time */}
              {!entry.isHuman && entry.timeSeconds > 0 && (
                <div className="hidden shrink-0 text-right sm:block">
                  <div className="flex items-center gap-0.5 text-[10px] text-muted-foreground">
                    <Clock className="h-2.5 w-2.5" />
                    {entry.timeSeconds}s
                  </div>
                  <div className="text-[9px] text-muted-foreground/70">completion</div>
                </div>
              )}
            </motion.div>
          )
        })}
      </div>

      {/* Verdict */}
      <div className={cn(
        "mt-4 rounded-xl p-4 text-center",
        candidateBeatAI
          ? "bg-gradient-to-r from-emerald-500/10 to-primary/10"
          : "bg-secondary/30",
      )}>
        <p className="text-sm font-medium">
          {candidateBeatAI
            ? `This candidate outperformed all ${benchmarks.length} AI models on this task.`
            : `${benchmarks.filter((b) => b.score > candidateScore).length} AI model${benchmarks.filter((b) => b.score > candidateScore).length === 1 ? "" : "s"} scored higher — but AI lacks the judgment, ownership, and adaptability that the candidate demonstrated.`}
        </p>
        <p className="mt-1 text-[11px] text-muted-foreground">
          Rank: #{candidateRank} of {all.length} · The question isn't "can AI do it?" — it's "who brings the judgment AI can't?"
        </p>
      </div>
    </div>
  )
}
