"use client";

import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

/* ------------------------------------------------------------------ */
/*  Category color mapping (avoids indigo/blue)                        */
/* ------------------------------------------------------------------ */

const CATEGORY_COLORS: Record<string, string> = {
  Revenue: "text-emerald-700 bg-emerald-50 border-emerald-200/70 dark:text-emerald-300 dark:bg-emerald-500/10 dark:border-emerald-500/20",
  Operations: "text-amber-700 bg-amber-50 border-amber-200/70 dark:text-amber-300 dark:bg-amber-500/10 dark:border-amber-500/20",
  Product: "text-rose-700 bg-rose-50 border-rose-200/70 dark:text-rose-300 dark:bg-rose-500/10 dark:border-rose-500/20",
  Customer: "text-teal-700 bg-teal-50 border-teal-200/70 dark:text-teal-300 dark:bg-teal-500/10 dark:border-teal-500/20",
  Data: "text-violet-700 bg-violet-50 border-violet-200/70 dark:text-violet-300 dark:bg-violet-500/10 dark:border-violet-500/20",
  Engineering: "text-stone-700 bg-stone-100 border-stone-200 dark:text-stone-300 dark:bg-stone-500/10 dark:border-stone-500/20",
  Growth: "text-emerald-700 bg-emerald-50 border-emerald-200/70 dark:text-emerald-300 dark:bg-emerald-500/10 dark:border-emerald-500/20",
  Knowledge: "text-amber-700 bg-amber-50 border-amber-200/70 dark:text-amber-300 dark:bg-amber-500/10 dark:border-amber-500/20",
};

export function CategoryBadge({ category, className }: { category: string; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium tracking-wide",
        CATEGORY_COLORS[category] ?? CATEGORY_COLORS.Engineering,
        className,
      )}
    >
      {category}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Score bar — animated fill                                          */
/* ------------------------------------------------------------------ */

export function ScoreBar({
  value,
  max = 100,
  className,
  tone = "primary",
  delay = 0,
}: {
  value: number;
  max?: number;
  className?: string;
  tone?: "primary" | "accent" | "neutral";
  delay?: number;
}) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  const toneClass =
    tone === "primary"
      ? "bg-primary"
      : tone === "accent"
        ? "bg-[oklch(0.74_0.135_70)]"
        : "bg-muted-foreground/50";
  return (
    <div className={cn("h-1.5 w-full overflow-hidden rounded-full bg-muted", className)}>
      <motion.div
        className={cn("h-full rounded-full", toneClass)}
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Count-up number                                                    */
/* ------------------------------------------------------------------ */

export function CountUp({
  value,
  decimals = 0,
  duration = 1.1,
  prefix = "",
  suffix = "",
  className,
}: {
  value: number;
  decimals?: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const tick = (now: number) => {
            const t = Math.min(1, (now - start) / (duration * 1000));
            const eased = 1 - Math.pow(1 - t, 3);
            setDisplay(value * eased);
            if (t < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [value, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {display.toLocaleString("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Trend pill                                                         */
/* ------------------------------------------------------------------ */

export function TrendPill({ trend, delta }: { trend: "up" | "down" | "flat"; delta?: string }) {
  const map = {
    up: { cls: "text-emerald-700 bg-emerald-50 dark:text-emerald-300 dark:bg-emerald-500/10", sym: "↑" },
    down: { cls: "text-rose-700 bg-rose-50 dark:text-rose-300 dark:bg-rose-500/10", sym: "↓" },
    flat: { cls: "text-muted-foreground bg-muted", sym: "→" },
  } as const;
  // For metrics where "up" is bad (time, cost), we still show direction honestly;
  // caller decides semantic. Here we just render the direction + delta.
  const m = map[trend];
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] font-medium", m.cls)}>
      <span aria-hidden>{m.sym}</span>
      {delta && <span className="tabular-nums">{delta}</span>}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Signal chip for evidence                                           */
/* ------------------------------------------------------------------ */

export function SignalChip({ signal }: { signal: "strength" | "concern" | "neutral" }) {
  const map = {
    strength: { cls: "text-emerald-700 bg-emerald-50 border-emerald-200/70 dark:text-emerald-300 dark:bg-emerald-500/10 dark:border-emerald-500/20", label: "Strength" },
    concern: { cls: "text-rose-700 bg-rose-50 border-rose-200/70 dark:text-rose-300 dark:bg-rose-500/10 dark:border-rose-500/20", label: "Concern" },
    neutral: { cls: "text-muted-foreground bg-muted border-border", label: "Observation" },
  } as const;
  const m = map[signal];
  return (
    <span className={cn("inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider", m.cls)}>
      {m.label}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Live dot — pulsing                                                 */
/* ------------------------------------------------------------------ */

export function LiveDot({ className }: { className?: string }) {
  return (
    <span className={cn("relative inline-flex h-2 w-2", className)}>
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
      <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Fidelity ring — circular progress                                  */
/* ------------------------------------------------------------------ */

export function FidelityRing({ value, size = 44 }: { value: number; size?: number }) {
  const stroke = 3;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (Math.max(0, Math.min(100, value)) / 100) * c;
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="oklch(0.915 0.006 95)" strokeWidth={stroke} className="dark:stroke-white/10" />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="oklch(0.52 0.11 165)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="dark:stroke-[oklch(0.72_0.12_165)]"
        />
      </svg>
      <span className="absolute text-[11px] font-semibold tabular-nums">{Math.round(value)}</span>
    </div>
  );
}
