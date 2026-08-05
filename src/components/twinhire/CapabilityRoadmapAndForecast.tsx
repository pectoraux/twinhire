"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  Calendar,
  Compass,
  DollarSign,
  GraduationCap,
  LineChart,
  MapPin,
  Rocket,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * CapabilityRoadmapAndForecast — two interconnected features:
 *
 * 1. Professional Capability Roadmap — "What should I learn next?"
 *    A career operating system: current → recommended capabilities with
 *    projected earnings, demand, learning cost, time, probability.
 *
 * 2. Business Capability Forecasting — "What gaps will we have tomorrow?"
 *    Today's gaps + 6/12/18-month forecasted gaps.
 *    A strategic planning product.
 */

// Professional roadmap
const ROADMAP_STEPS = [
  {
    current: "Mechanical Engineer",
    salary: "$72K",
    next: "Predictive Maintenance",
    projectedSalary: "$94K",
    delta: "+$22K",
    probability: 84,
    timeRequired: "10 weeks",
    demand: "High",
    learningCost: "$1.2K",
  },
  {
    current: "Predictive Maintenance",
    salary: "$94K",
    next: "Industrial AI",
    projectedSalary: "$118K",
    delta: "+$24K",
    probability: 76,
    timeRequired: "14 weeks",
    demand: "Very High",
    learningCost: "$2.8K",
  },
  {
    current: "Industrial AI",
    salary: "$118K",
    next: "Machine Vision",
    projectedSalary: "$142K",
    delta: "+$24K",
    probability: 71,
    timeRequired: "16 weeks",
    demand: "Very High",
    learningCost: "$3.4K",
  },
  {
    current: "Machine Vision",
    salary: "$142K",
    next: "Digital Twin Engineering",
    projectedSalary: "$176K",
    delta: "+$34K",
    probability: 68,
    timeRequired: "20 weeks",
    demand: "Emerging",
    learningCost: "$4.2K",
  },
]

// Business forecasting
const FORECAST = [
  { timeframe: "Today", capabilities: [
    { name: "Customer Success", level: "High", critical: false },
    { name: "Demand Forecasting", level: "Critical", critical: true },
    { name: "Lifecycle Email", level: "High", critical: false },
  ]},
  { timeframe: "6 months", capabilities: [
    { name: "Revenue Operations", level: "Critical", critical: true },
    { name: "AI Governance", level: "Critical", critical: true },
    { name: "Customer Success", level: "Medium", critical: false },
  ]},
  { timeframe: "12 months", capabilities: [
    { name: "AI Governance", level: "Critical", critical: true },
    { name: "Customer Intelligence", level: "Essential", critical: false },
    { name: "Pricing Strategy", level: "High", critical: false },
  ]},
  { timeframe: "18 months", capabilities: [
    { name: "Customer Intelligence", level: "Essential", critical: false },
    { name: "Digital Twin Engineering", level: "Emerging", critical: false },
    { name: "AI Governance", level: "Critical", critical: true },
  ]},
]

const LEVEL_COLORS: Record<string, string> = {
  Critical: "text-rose-700 bg-rose-50 dark:text-rose-300 dark:bg-rose-500/10",
  Essential: "text-violet-700 bg-violet-50 dark:text-violet-300 dark:bg-violet-500/10",
  High: "text-amber-700 bg-amber-50 dark:text-amber-300 dark:bg-amber-500/10",
  Medium: "text-blue-700 bg-blue-50 dark:text-blue-300 dark:bg-blue-500/10",
  Low: "text-muted-foreground bg-secondary",
  Emerging: "text-teal-700 bg-teal-50 dark:text-teal-300 dark:bg-teal-500/10",
  "Very High": "text-rose-700 bg-rose-50 dark:text-rose-300 dark:bg-rose-500/10",
}

export function CapabilityRoadmapAndForecast({ className }: { className?: string }) {
  return (
    <div className={cn("grid gap-6 lg:grid-cols-2", className)}>
      {/* Professional Roadmap */}
      <div className="rounded-2xl border border-border/60 bg-card p-6">
        <div className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary">
            <Compass className="h-4 w-4" />
          </span>
          <div>
            <h3 className="text-sm font-semibold">Professional capability roadmap</h3>
            <p className="text-[11px] text-muted-foreground">A career operating system — not &quot;what jobs to apply for&quot;</p>
          </div>
        </div>

        {/* Roadmap path */}
        <div className="mt-5 space-y-3">
          {ROADMAP_STEPS.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -6 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              {/* Current → Next */}
              <div className="flex items-center gap-3">
                {/* Current */}
                <div className="flex-1 rounded-xl border border-border/50 bg-secondary/20 p-3">
                  <div className="text-[9px] uppercase tracking-wider text-muted-foreground">Current</div>
                  <div className="text-xs font-semibold">{step.current}</div>
                  <div className="font-mono text-[10px] text-muted-foreground">{step.salary}</div>
                </div>

                {/* Arrow */}
                <ArrowRight className="h-4 w-4 shrink-0 text-primary" />

                {/* Next */}
                <div className="flex-1 rounded-xl border border-primary/30 bg-primary/[0.04] p-3">
                  <div className="text-[9px] uppercase tracking-wider text-primary">Add capability</div>
                  <div className="text-xs font-semibold">{step.next}</div>
                  <div className="font-mono text-[10px] text-emerald-600 dark:text-emerald-400">{step.projectedSalary} ({step.delta})</div>
                </div>
              </div>

              {/* Details */}
              <div className="mt-1.5 ml-1 flex flex-wrap gap-x-4 gap-y-1 text-[9px] text-muted-foreground">
                <span>Probability: <span className="font-medium text-foreground">{step.probability}%</span></span>
                <span>Time: <span className="font-medium text-foreground">{step.timeRequired}</span></span>
                <span>Cost: <span className="font-medium text-foreground">{step.learningCost}</span></span>
                <span>Demand: <span className={cn("font-medium", step.demand === "Very High" ? "text-rose-600 dark:text-rose-400" : "text-amber-600 dark:text-amber-400")}>{step.demand}</span></span>
              </div>

              {/* Connector */}
              {i < ROADMAP_STEPS.length - 1 && (
                <div className="ml-4 mt-2 h-4 w-px bg-border" />
              )}
            </motion.div>
          ))}
        </div>

        <div className="mt-4 flex items-start gap-2 rounded-lg bg-primary/[0.04] p-3">
          <GraduationCap className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
          <p className="text-[11px] leading-relaxed text-muted-foreground">
            <span className="font-medium text-foreground">People invest in capabilities, not job titles.</span>{" "}
            Each step shows projected earnings, demand, learning cost, time required, and probability.
          </p>
        </div>
      </div>

      {/* Business Capability Forecasting */}
      <div className="rounded-2xl border border-border/60 bg-card p-6">
        <div className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary">
            <LineChart className="h-4 w-4" />
          </span>
          <div>
            <h3 className="text-sm font-semibold">Business capability forecasting</h3>
            <p className="text-[11px] text-muted-foreground">Today&apos;s gaps + tomorrow&apos;s forecasted gaps</p>
          </div>
        </div>

        {/* Forecast timeline */}
        <div className="mt-5 space-y-3">
          {FORECAST.map((period, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 4 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="rounded-xl border border-border/50 bg-secondary/20 p-3"
            >
              <div className="flex items-center gap-2">
                <Calendar className="h-3 w-3 text-primary" />
                <span className="text-xs font-semibold">{period.timeframe}</span>
              </div>
              <div className="mt-2 space-y-1.5">
                {period.capabilities.map((cap, ci) => (
                  <div key={ci} className="flex items-center justify-between">
                    <span className="text-[11px] text-foreground/80">{cap.name}</span>
                    <span className={cn("rounded-full px-1.5 py-0.5 text-[8px] font-medium", LEVEL_COLORS[cap.level] ?? LEVEL_COLORS.Low)}>
                      {cap.level}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-4 flex items-start gap-2 rounded-lg bg-primary/[0.04] p-3">
          <TrendingUp className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
          <p className="text-[11px] leading-relaxed text-muted-foreground">
            <span className="font-medium text-foreground">A strategic planning product.</span>{" "}
            Businesses see not just today&apos;s gaps, but what they&apos;ll need in 6, 12, and 18 months —
            so they can hire, automate, or train before it becomes critical.
          </p>
        </div>
      </div>
    </div>
  )
}
