"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Network, Sparkles, TrendingUp, Users, Zap } from "lucide-react";
import { CountUp } from "./primitives";
import { cn } from "@/lib/utils";

/**
 * NetworkEffectsPanel — makes the "network effects" principle tangible.
 *
 * The vision: "As more businesses use the platform: digital twins improve,
 * capability rankings improve, hiring improves, simulations become more
 * realistic. As more candidates participate: skill benchmarks improve,
 * evaluation improves, career recommendations improve."
 *
 * Shows the compounding curves and the flywheel between businesses and candidates.
 */

const BUSINESS_EFFECTS = [
  { label: "Twin fidelity", base: 68, now: 76, suffix: "/100" },
  { label: "Simulation realism", base: 61, now: 79, suffix: "/100" },
  { label: "Hiring accuracy", base: 54, now: 72, suffix: "/100" },
];

const CANDIDATE_EFFECTS = [
  { label: "Skill benchmarks", base: 58, now: 74, suffix: "/100" },
  { label: "Evaluation depth", base: 62, now: 81, suffix: "/100" },
  { label: "Career matching", base: 49, now: 68, suffix: "/100" },
];

export function NetworkEffectsPanel({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-2xl border border-border/60 bg-card p-6", className)}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="flex items-center gap-2 text-sm font-semibold">
            <Network className="h-4 w-4 text-primary" /> Network effects
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            The platform compounds. Every business and candidate that joins makes it smarter for the next.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-primary/30 bg-primary/[0.06] px-3 py-1.5 text-xs">
          <Zap className="h-3.5 w-3.5 text-primary" />
          <span className="font-medium text-primary">Flywheel active</span>
        </div>
      </div>

      {/* Flywheel diagram */}
      <div className="mt-5 grid items-center gap-4 sm:grid-cols-[1fr_auto_1fr]">
        {/* Businesses side */}
        <FlywheelSide
          title="More businesses"
          icon={TrendingUp}
          tone="primary"
          effects={BUSINESS_EFFECTS}
        />

        {/* Center connector */}
        <div className="flex flex-col items-center gap-1 py-2">
          <motion.div
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="grid h-10 w-10 place-items-center rounded-full bg-primary/10 text-primary"
          >
            <Sparkles className="h-5 w-5" />
          </motion.div>
          <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            compounds
          </div>
          {/* bidirectional arrows */}
          <div className="flex gap-1 text-muted-foreground">
            <ArrowUpRight className="h-3 w-3 rotate-[-45deg]" />
            <ArrowUpRight className="h-3 w-3 rotate-[135deg]" />
          </div>
        </div>

        {/* Candidates side */}
        <FlywheelSide
          title="More candidates"
          icon={Users}
          tone="accent"
          effects={CANDIDATE_EFFECTS}
        />
      </div>

      {/* Compounding curves */}
      <div className="mt-6">
        <div className="flex items-center justify-between text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
          <span>Intelligence over time</span>
          <span className="flex items-center gap-1"><TrendingUp className="h-3 w-3" /> compounding</span>
        </div>
        <CompoundingChart />
        <div className="mt-2 flex items-center justify-between text-[10px] text-muted-foreground">
          <span>launch</span>
          <span>now</span>
          <span className="text-primary">projected</span>
        </div>
      </div>

      {/* Scale stats */}
      <div className="mt-5 grid grid-cols-3 gap-px overflow-hidden rounded-xl border border-border/60 bg-border/60">
        {[
          { v: 4, label: "Business twins", suffix: "" },
          { v: 58, label: "Observed sessions", suffix: "" },
          { v: 21, label: "Capability benchmarks", suffix: "" },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 6 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="bg-card p-3 text-center"
          >
            <div className="font-display text-2xl text-primary">
              <CountUp value={s.v} suffix={s.suffix} />
            </div>
            <div className="text-[10px] text-muted-foreground">{s.label}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function FlywheelSide({
  title,
  icon: Icon,
  tone,
  effects,
}: {
  title: string;
  icon: React.ElementType;
  tone: "primary" | "accent";
  effects: { label: string; base: number; now: number; suffix: string }[];
}) {
  const toneCls = tone === "primary" ? "text-primary bg-primary/10" : "text-amber-600 bg-amber-100 dark:text-amber-300 dark:bg-amber-500/15";
  return (
    <div className="rounded-xl border border-border/50 bg-secondary/20 p-4">
      <div className="flex items-center gap-2">
        <span className={cn("grid h-7 w-7 place-items-center rounded-lg", toneCls)}>
          <Icon className="h-3.5 w-3.5" />
        </span>
        <span className="text-sm font-semibold">{title}</span>
      </div>
      <div className="mt-3 space-y-2">
        {effects.map((e, i) => {
          const lift = e.now - e.base;
          return (
            <div key={e.label}>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{e.label}</span>
                <span className="flex items-center gap-1">
                  <span className="font-mono text-muted-foreground line-through">{e.base}</span>
                  <ArrowUpRight className="h-3 w-3 text-emerald-500" />
                  <span className="font-semibold">{e.now}{e.suffix}</span>
                </span>
              </div>
              <div className="mt-1 flex items-center gap-1">
                <div className="h-1 flex-1 overflow-hidden rounded-full bg-muted">
                  <motion.div
                    className={cn("h-full rounded-full", tone === "primary" ? "bg-primary" : "bg-[oklch(0.74_0.135_70)]")}
                    initial={{ width: 0 }}
                    whileInView={{ width: `${e.now}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.9, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  />
                </div>
                <span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400">+{lift}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CompoundingChart() {
  const w = 100;
  const h = 40;
  const points = 12;
  // Exponential growth curve
  const coords: [number, number][] = [];
  for (let i = 0; i < points; i++) {
    const t = i / (points - 1);
    const x = t * w;
    // exponential: slow start, steep end
    const y = h - 4 - (Math.pow(t, 1.8) * (h - 12));
    coords.push([x, y]);
  }
  const line = coords.map((c, i) => `${i === 0 ? "M" : "L"}${c[0].toFixed(1)},${c[1].toFixed(1)}`).join(" ");
  const area = `${line} L${w},${h} L0,${h} Z`;
  // Projected portion (dashed, last 30%)
  const projStart = Math.floor(points * 0.7);
  const projCoords = coords.slice(projStart - 1);
  const projLine = projCoords.map((c, i) => `${i === 0 ? "M" : "L"}${c[0].toFixed(1)},${c[1].toFixed(1)}`).join(" ");

  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="mt-2 h-20 w-full">
      <defs>
        <linearGradient id="netfx" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.52 0.11 165 / 0.25)" />
          <stop offset="100%" stopColor="oklch(0.52 0.11 165 / 0)" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#netfx)" className="dark:fill-[oklch(0.72_0.12_165/0.18)]" />
      <motion.path
        d={line}
        fill="none"
        stroke="oklch(0.52 0.11 165)"
        strokeWidth={1.5}
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="dark:stroke-[oklch(0.72_0.12_165)]"
      />
      <motion.path
        d={projLine}
        fill="none"
        stroke="oklch(0.74 0.135 70)"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeDasharray="2 2"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 1 }}
        className="dark:stroke-[oklch(0.76_0.14_70)]"
      />
      {coords.map((c, i) => (
        <circle
          key={i}
          cx={c[0]}
          cy={c[1]}
          r={i === points - 1 ? 2.2 : 1}
          fill={i >= projStart ? "oklch(0.74 0.135 70)" : "oklch(0.52 0.11 165)"}
          className="dark:fill-[oklch(0.72_0.12_165)]"
        />
      ))}
    </svg>
  );
}
