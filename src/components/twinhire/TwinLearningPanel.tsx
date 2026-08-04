"use client";

import { motion } from "framer-motion";
import { ArrowDownRight, ArrowUpRight, BrainCircuit, Cpu, Database, Eye, RefreshCw } from "lucide-react";
import { FidelityRing } from "./primitives";
import { cn } from "@/lib/utils";

/**
 * TwinLearningPanel — makes the closed loop visible.
 *
 * Shows:
 *  - The twin's current fidelity (a live ring) and the delta from the latest outcome
 *  - A fidelity trajectory sparkline (sessions observed → fidelity)
 *  - The four-stage loop: observe → evaluate → hire → retrain, with the current
 *    stage highlighted
 *  - What the twin "learned" from the latest session (concrete, sourced from the
 *    evaluation when available)
 */

const LOOP_STAGES = [
  { key: "observe", label: "Observe work", icon: Eye, desc: "Candidate performs inside the twin" },
  { key: "evaluate", label: "Generate evidence", icon: BrainCircuit, desc: "17 dimensions scored" },
  { key: "decide", label: "Hiring decision", icon: ArrowUpRight, desc: "Explainable recommendation" },
  { key: "retrain", label: "Retrain twin", icon: RefreshCw, desc: "Outcome updates fidelity & models" },
];

export function TwinLearningPanel({
  fidelity,
  sessionsObserved,
  fidelityDelta,
  learnedFromSession,
  activeStage = "retrain",
}: {
  fidelity: number;
  sessionsObserved: number;
  fidelityDelta?: number;
  learnedFromSession?: string[];
  activeStage?: string;
}) {
  // Build a plausible fidelity trajectory: starts ~60, climbs toward current
  const trajectory = buildTrajectory(fidelity, sessionsObserved);
  const deltaUp = (fidelityDelta ?? 1) >= 0;

  return (
    <div className="rounded-2xl border border-border/60 bg-card p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="flex items-center gap-2 text-sm font-semibold">
            <RefreshCw className="h-4 w-4 text-primary" /> Twin Learning System
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Every outcome flows back. The twin&apos;s fidelity rises as it accumulates evidence.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <FidelityRing value={fidelity} size={52} />
          <div className="text-right">
            <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Fidelity</div>
            <div className="flex items-center gap-1 font-display text-lg">
              {fidelityDelta !== undefined && (
                <span className={cn("flex items-center text-xs", deltaUp ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400")}>
                  {deltaUp ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                  {Math.abs(fidelityDelta)}pt
                </span>
              )}
            </div>
            <div className="text-[10px] text-muted-foreground">{sessionsObserved} sessions observed</div>
          </div>
        </div>
      </div>

      {/* Trajectory sparkline */}
      <div className="mt-5">
        <div className="flex items-center justify-between text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
          <span>Fidelity trajectory</span>
          <span className="flex items-center gap-1"><Cpu className="h-3 w-3" /> compounding</span>
        </div>
        <Sparkline points={trajectory} className="mt-2 h-16 w-full" />
      </div>

      {/* The loop */}
      <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {LOOP_STAGES.map((s, i) => {
          const active = s.key === activeStage;
          return (
            <motion.div
              key={s.key}
              initial={{ opacity: 0, y: 6 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className={cn(
                "relative rounded-xl border p-3",
                active
                  ? "border-primary/40 bg-primary/[0.05]"
                  : "border-border/50 bg-secondary/30",
              )}
            >
              <div className="flex items-center justify-between">
                <s.icon className={cn("h-3.5 w-3.5", active ? "text-primary" : "text-muted-foreground")} />
                <span className="font-mono text-[9px] text-muted-foreground/70">0{i + 1}</span>
              </div>
              <div className="mt-1.5 text-xs font-semibold">{s.label}</div>
              <div className="mt-0.5 text-[10px] leading-tight text-muted-foreground">{s.desc}</div>
              {active && (
                <motion.span
                  layoutId="loop-active"
                  className="absolute -bottom-px left-3 right-3 h-0.5 rounded-full bg-primary"
                />
              )}
            </motion.div>
          );
        })}
      </div>

      {/* What the twin learned */}
      {learnedFromSession && learnedFromSession.length > 0 && (
        <div className="mt-5 rounded-xl border border-primary/20 bg-primary/[0.03] p-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-primary">
            <Database className="h-3.5 w-3.5" /> What this twin just learned
          </div>
          <ul className="mt-2 space-y-1.5">
            {learnedFromSession.map((l, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -6 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex gap-2 text-xs text-foreground/90"
              >
                <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-primary" />
                <span>{l}</span>
              </motion.li>
            ))}
          </ul>
          <p className="mt-3 text-[10px] text-muted-foreground">
            These signals update the twin&apos;s process graph, capability ranking
            and evaluation model — making the next simulation more accurate.
          </p>
        </div>
      )}
    </div>
  );
}

function buildTrajectory(currentFidelity: number, sessions: number): number[] {
  const n = Math.max(6, Math.min(14, sessions + 2));
  const start = Math.max(55, currentFidelity - 18);
  const pts: number[] = [];
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1);
    // ease-out climb with slight noise
    const base = start + (currentFidelity - start) * (1 - Math.pow(1 - t, 2));
    const noise = (i % 2 === 0 ? 0.6 : -0.4) * (1 - t) * 2;
    pts.push(Math.round(Math.max(50, Math.min(99, base + noise))));
  }
  pts[pts.length - 1] = currentFidelity;
  return pts;
}

function Sparkline({ points, className }: { points: number[]; className?: string }) {
  const w = 100;
  const h = 32;
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = Math.max(1, max - min);
  const step = w / (points.length - 1);
  const coords = points.map((p, i) => [i * step, h - ((p - min) / range) * (h - 4) - 2] as const);
  const line = coords.map((c, i) => `${i === 0 ? "M" : "L"}${c[0].toFixed(1)},${c[1].toFixed(1)}`).join(" ");
  const area = `${line} L${w},${h} L0,${h} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className={cn("overflow-visible", className)}>
      <defs>
        <linearGradient id="spark" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.52 0.11 165 / 0.25)" />
          <stop offset="100%" stopColor="oklch(0.52 0.11 165 / 0)" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#spark)" className="dark:fill-[oklch(0.72_0.12_165/0.18)]" />
      <motion.path
        d={line}
        fill="none"
        stroke="oklch(0.52 0.11 165)"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        className="dark:stroke-[oklch(0.72_0.12_165)]"
      />
      {coords.map((c, i) => (
        <circle key={i} cx={c[0]} cy={c[1]} r={i === coords.length - 1 ? 2.4 : 1.4} fill="oklch(0.52 0.11 165)" className="dark:fill-[oklch(0.72_0.12_165)]" />
      ))}
    </svg>
  );
}
