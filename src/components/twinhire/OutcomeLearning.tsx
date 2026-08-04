"use client";

import { motion } from "framer-motion";
import {
  ArrowUpRight,
  CalendarCheck,
  Database,
  RefreshCw,
  TrendingUp,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * OutcomeLearning — makes the "outcomes retrain the twins" principle tangible.
 *
 * The vision: "After hiring collect: 30-day success, 60-day success, 90-day
 * success, 6-month success, 1-year success, promotion, retention, performance,
 * manager feedback... These continuously retrain: Digital twins, Capability
 * ranking, Hiring recommendations, Simulation realism, Evaluation models."
 *
 * Shows a timeline of outcome checkpoints and how each flows back to improve
 * the twin's fidelity and the network's intelligence.
 */

interface OutcomeCheckpoint {
  label: string;
  days: number;
  status: "collected" | "pending" | "projected";
  value: number; // performance score 0-100
  note: string;
}

const RETRAIN_TARGETS = [
  { label: "Digital twin fidelity", impact: "+2.1pt", icon: RefreshCw },
  { label: "Capability ranking", impact: "reshuffled", icon: TrendingUp },
  { label: "Hiring recommendations", impact: "calibrated", icon: Users },
  { label: "Evaluation model", impact: "weighted", icon: Database },
];

export function OutcomeLearning({
  sessionsObserved,
  twinFidelity,
}: {
  sessionsObserved: number;
  twinFidelity: number;
}) {
  // Build outcome checkpoints — earlier ones collected, later projected
  const checkpoints: OutcomeCheckpoint[] = [
    { label: "30-day", days: 30, status: "collected", value: 78, note: "Onboarding complete; first KPI ownership taken" },
    { label: "60-day", days: 60, status: "collected", value: 82, note: "Shipped first independent improvement" },
    { label: "90-day", days: 90, status: "pending", value: 0, note: "Manager review in progress" },
    { label: "6-month", days: 180, status: "projected", value: 0, note: "Retention & promotion eligibility" },
    { label: "1-year", days: 365, status: "projected", value: 0, note: "Full-cycle business impact" },
  ];

  const collected = checkpoints.filter((c) => c.status === "collected");
  const avgCollected = collected.length > 0
    ? Math.round(collected.reduce((a, c) => a + c.value, 0) / collected.length)
    : 0;

  return (
    <div className="rounded-2xl border border-border/60 bg-card p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="flex items-center gap-2 text-sm font-semibold">
            <CalendarCheck className="h-4 w-4 text-primary" /> Outcome learning
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Hiring outcomes flow back as training signal. The twin gets smarter with every checkpoint.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-emerald-200/70 bg-emerald-50 px-3 py-1.5 text-xs dark:border-emerald-500/20 dark:bg-emerald-500/10">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse-soft" />
          <span className="text-muted-foreground">Live retraining</span>
          <span className="font-semibold text-emerald-700 dark:text-emerald-300">+{sessionsObserved} signals</span>
        </div>
      </div>

      {/* Outcome timeline */}
      <div className="mt-5">
        <div className="flex items-center justify-between text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
          <span>Outcome checkpoints</span>
          <span>{collected.length}/{checkpoints.length} collected</span>
        </div>

        {/* Trajectory bar */}
        <div className="mt-3 relative">
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-primary to-[oklch(0.74_0.135_70)]"
              initial={{ width: 0 }}
              whileInView={{ width: `${(collected.length / checkpoints.length) * 100}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
          {/* Checkpoint markers */}
          <div className="mt-2 grid grid-cols-5 gap-1">
            {checkpoints.map((c, i) => (
              <motion.div
                key={c.label}
                initial={{ opacity: 0, y: 6 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="text-center"
              >
                <div
                  className={cn(
                    "mx-auto grid h-7 w-7 place-items-center rounded-full text-[9px] font-bold",
                    c.status === "collected" && "bg-primary text-primary-foreground",
                    c.status === "pending" && "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
                    c.status === "projected" && "border border-dashed border-border bg-secondary/40 text-muted-foreground",
                  )}
                >
                  {c.status === "collected" ? c.value : c.status === "pending" ? "…" : c.days}
                </div>
                <div className="mt-1 text-[9px] font-medium">{c.label}</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Latest collected detail */}
        {collected.length > 0 && (
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {collected.map((c) => (
              <div key={c.label} className="rounded-xl border border-border/50 bg-secondary/30 p-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold">{c.label} outcome</span>
                  <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    <ArrowUpRight className="h-3 w-3" />
                    {c.value}/100
                  </span>
                </div>
                <p className="mt-1 text-[11px] text-muted-foreground">{c.note}</p>
              </div>
            ))}
          </div>
        )}

        {/* Outcome signals — promotion, retention, feedback */}
        <div className="mt-4">
          <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            Outcome signals collected
          </div>
          <div className="mt-2 grid gap-2 sm:grid-cols-3 lg:grid-cols-6">
            <OutcomeSignal label="Retention" value="On track" status="positive" />
            <OutcomeSignal label="Promotion" value="Eligible" status="positive" />
            <OutcomeSignal label="Manager" value="4.2/5" status="positive" />
            <OutcomeSignal label="Team" value="4.0/5" status="positive" />
            <OutcomeSignal label="Candidate" value="4.5/5" status="positive" />
            <OutcomeSignal label="Business impact" value="+12% KPI" status="positive" />
          </div>
        </div>
      </div>

      {/* What gets retrained */}
      <div className="mt-5">
        <div className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
          <RefreshCw className="h-3 w-3" /> What these outcomes retrain
        </div>
        <div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {RETRAIN_TARGETS.map((t, i) => (
            <motion.div
              key={t.label}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="rounded-xl border border-border/50 bg-secondary/30 p-3"
            >
              <div className="flex items-center justify-between">
                <t.icon className="h-3.5 w-3.5 text-primary" />
                <span className="text-[10px] font-semibold text-primary">{t.impact}</span>
              </div>
              <div className="mt-1.5 text-[11px] font-medium leading-tight">{t.label}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Fidelity lift summary */}
      <div className="mt-5 flex items-center justify-between rounded-xl bg-gradient-to-r from-primary/[0.06] to-[oklch(0.74_0.135_70)]/[0.06] p-4">
        <div>
          <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Twin fidelity now</div>
          <div className="font-display text-2xl text-primary">{twinFidelity}<span className="text-sm text-muted-foreground">/100</span></div>
        </div>
        <div className="hidden text-center sm:block">
          <ArrowUpRight className="mx-auto h-5 w-5 text-emerald-500" />
          <div className="mt-0.5 text-[10px] text-muted-foreground">compounding</div>
        </div>
        <div className="text-right">
          <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Projected (full cycle)</div>
          <div className="font-display text-2xl text-foreground">{Math.min(96, twinFidelity + 8)}<span className="text-sm text-muted-foreground">/100</span></div>
        </div>
      </div>
    </div>
  );
}

function OutcomeSignal({
  label,
  value,
  status,
}: {
  label: string;
  value: string;
  status: "positive" | "neutral" | "negative";
}) {
  const cls =
    status === "positive"
      ? "text-emerald-700 bg-emerald-50 dark:text-emerald-300 dark:bg-emerald-500/10"
      : status === "negative"
        ? "text-rose-700 bg-rose-50 dark:text-rose-300 dark:bg-rose-500/10"
        : "text-muted-foreground bg-secondary";
  return (
    <div className={cn("rounded-lg px-2.5 py-1.5 text-center", cls)}>
      <div className="text-[9px] uppercase tracking-wider opacity-70">{label}</div>
      <div className="text-xs font-semibold">{value}</div>
    </div>
  );
}
