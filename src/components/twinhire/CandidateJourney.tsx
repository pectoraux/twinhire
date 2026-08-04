"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  Award,
  Compass,
  Eye,
  GitBranch,
  Sparkles,
  TrendingUp,
  User,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { HistorySession } from "./EvidenceTimeline";

/**
 * CandidateJourney — visualizes the candidate's path through the TwinHire system.
 *
 * The vision: candidates don't "apply" — they discover twins, work inside them,
 * generate evidence, and grow their reputation. This component makes that journey
 * tangible as a horizontal progression with milestones.
 */

interface JourneyStage {
  key: string;
  label: string;
  icon: React.ElementType;
  desc: string;
  status: "completed" | "active" | "locked";
}

export function CandidateJourney({
  sessions,
  reputation,
}: {
  sessions: HistorySession[];
  reputation: number;
}) {
  const sessionCount = sessions.length;
  const twinsWorked = new Set(sessions.map((s) => s.twinCode)).size;
  const hasEvidence = sessionCount > 0;

  const stages: JourneyStage[] = [
    {
      key: "discover",
      label: "Discover twins",
      icon: Compass,
      desc: "Browse anonymized business twins",
      status: "completed",
    },
    {
      key: "work",
      label: "Work inside twins",
      icon: GitBranch,
      desc: `${sessionCount} session${sessionCount === 1 ? "" : "s"} across ${twinsWorked} twin${twinsWorked === 1 ? "" : "s"}`,
      status: sessionCount > 0 ? "completed" : "active",
    },
    {
      key: "evidence",
      label: "Generate evidence",
      icon: Eye,
      desc: `${sessionCount * 10}+ evidence observations recorded`,
      status: hasEvidence ? "completed" : "locked",
    },
    {
      key: "reputation",
      label: "Grow reputation",
      icon: TrendingUp,
      desc: `Reputation at ${reputation}/100`,
      status: hasEvidence && reputation > 55 ? "completed" : "locked",
    },
    {
      key: "hire",
      label: "Get hired on evidence",
      icon: Award,
      desc: "Mutual opt-in → interview",
      status: reputation >= 70 ? "active" : "locked",
    },
  ];

  const completedCount = stages.filter((s) => s.status === "completed").length;
  const progress = (completedCount / stages.length) * 100;

  return (
    <div className="rounded-2xl border border-border/60 bg-card p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="flex items-center gap-2 text-sm font-semibold">
            <User className="h-4 w-4 text-primary" /> Candidate journey
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Not an application — a progression. Every step is earned through demonstrated work.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-primary/30 bg-primary/[0.06] px-3 py-1.5 text-xs">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          <span className="font-medium text-primary">{completedCount}/{stages.length} milestones</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-5">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-primary to-[oklch(0.74_0.135_70)]"
            initial={{ width: 0 }}
            whileInView={{ width: `${progress}%` }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
      </div>

      {/* Journey stages */}
      <div className="mt-6 grid gap-3 sm:grid-cols-5">
        {stages.map((stage, i) => (
          <motion.div
            key={stage.key}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className="relative"
          >
            {/* Connector arrow */}
            {i < stages.length - 1 && (
              <div className="absolute -right-2 top-5 z-10 hidden sm:block">
                <ArrowRight
                  className={cn(
                    "h-3 w-3",
                    stage.status === "completed" ? "text-primary" : "text-border",
                  )}
                />
              </div>
            )}

            <div
              className={cn(
                "flex h-full flex-col items-center rounded-xl border p-3 text-center transition-colors",
                stage.status === "completed" && "border-primary/30 bg-primary/[0.04]",
                stage.status === "active" && "border-amber-200/60 bg-amber-50/40 dark:border-amber-500/20 dark:bg-amber-500/[0.06]",
                stage.status === "locked" && "border-border/40 bg-secondary/20 opacity-60",
              )}
            >
              <div
                className={cn(
                  "grid h-9 w-9 place-items-center rounded-full",
                  stage.status === "completed" && "bg-primary text-primary-foreground",
                  stage.status === "active" && "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
                  stage.status === "locked" && "bg-secondary text-muted-foreground",
                )}
              >
                {stage.status === "completed" ? (
                  <stage.icon className="h-4 w-4" />
                ) : stage.status === "active" ? (
                  <Zap className="h-4 w-4" />
                ) : (
                  <stage.icon className="h-4 w-4" />
                )}
              </div>
              <div className="mt-2 text-xs font-semibold leading-tight">{stage.label}</div>
              <div className="mt-1 text-[10px] leading-tight text-muted-foreground">{stage.desc}</div>
              {stage.status === "active" && (
                <div className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-amber-100 px-1.5 py-0.5 text-[9px] font-medium text-amber-700 dark:bg-amber-500/15 dark:text-amber-300">
                  <span className="h-1 w-1 rounded-full bg-amber-500 animate-pulse-soft" />
                  active
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Journey stats */}
      <div className="mt-5 grid grid-cols-3 gap-px overflow-hidden rounded-xl border border-border/60 bg-border/60">
        <JourneyStat label="Twins explored" value={Math.max(4, twinsWorked)} icon={Compass} />
        <JourneyStat label="Sessions completed" value={sessionCount} icon={GitBranch} />
        <JourneyStat label="Evidence items" value={sessionCount * 10} icon={Eye} />
      </div>
    </div>
  );
}

function JourneyStat({ label, value, icon: Icon }: { label: string; value: number; icon: React.ElementType }) {
  return (
    <div className="bg-card p-3 text-center">
      <Icon className="mx-auto h-3.5 w-3.5 text-primary" />
      <div className="mt-1.5 font-display text-2xl">{value}</div>
      <div className="text-[10px] text-muted-foreground">{label}</div>
    </div>
  );
}
