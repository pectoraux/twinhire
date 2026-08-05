"use client";

import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Brain,
  DollarSign,
  Factory,
  Globe,
  GraduationCap,
  Rocket,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { CountUp } from "./primitives";
import { cn } from "@/lib/utils";

/**
 * CapabilityEconomy — the Bloomberg Terminal for organizational capabilities.
 *
 * Combines:
 * - Capability Market Intelligence (growing, paying, automation risk)
 * - Capability Investment Planner ("if I learn X, what happens?")
 * - Capability Wallet (portable evidence-backed scores)
 *
 * This is the platform's evolution from recruitment to Capability Economy.
 */

const TOP_GROWING = [
  { name: "AI Governance", growth: 187, category: "AI" },
  { name: "Revenue Operations", growth: 144, category: "Revenue" },
  { name: "Industrial Automation", growth: 121, category: "Manufacturing" },
  { name: "Energy Systems Engineering", growth: 118, category: "Engineering" },
  { name: "Climate Tech Analysis", growth: 103, category: "Data" },
]

const HIGHEST_PAYING = [
  { name: "Semiconductor Verification", salary: "$242K", category: "Engineering" },
  { name: "Robotics Systems", salary: "$216K", category: "Engineering" },
  { name: "Distributed Systems", salary: "$203K", category: "Engineering" },
  { name: "AI Agent Design", salary: "$198K", category: "AI" },
  { name: "Quantitative Finance", salary: "$191K", category: "Finance" },
]

const FASTEST_INDUSTRIES = [
  { name: "Battery Manufacturing", growth: "+34%" },
  { name: "Medical Devices", growth: "+28%" },
  { name: "Defense AI", growth: "+25%" },
  { name: "Climate Tech", growth: "+22%" },
  { name: "AgTech", growth: "+18%" },
]

const INVESTMENT_EXAMPLES = [
  {
    capability: "AI Workflow Design",
    currentSalary: "$65K",
    projectedSalary: "$82K",
    delta: "+$17K",
    probability: 87,
    timeRequired: "6 weeks",
    demand: "Very High" as const,
    newOpportunities: 63,
  },
  {
    capability: "PLC Programming",
    currentSalary: "$58K",
    projectedSalary: "$77K",
    delta: "+$19K",
    probability: 79,
    timeRequired: "8 weeks",
    demand: "High" as const,
    newOpportunities: 41,
  },
  {
    capability: "Demand Forecasting",
    currentSalary: "$72K",
    projectedSalary: "$94K",
    delta: "+$22K",
    probability: 84,
    timeRequired: "10 weeks",
    demand: "Very High" as const,
    newOpportunities: 55,
  },
]

const WALLET = [
  { capability: "Operational Excellence", score: 95, evidence: 12, cert: true },
  { capability: "Automation Design", score: 92, evidence: 8, cert: true },
  { capability: "Business Process Analysis", score: 88, evidence: 7, cert: true },
  { capability: "Technical Writing", score: 81, evidence: 5, cert: false },
  { capability: "Financial Modeling", score: 76, evidence: 3, cert: false },
  { capability: "Leadership", score: 91, evidence: 6, cert: true },
]

export function CapabilityEconomy({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-6", className)}>
      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center"
      >
        <span className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-3 py-1 text-xs font-medium text-background">
          <Globe className="h-3 w-3" /> The Capability Economy
        </span>
        <h2 className="mt-3 font-display text-3xl text-balance sm:text-4xl">
          Stop hiring people. Start hiring <span className="ink-emerald italic">capabilities</span>.
        </h2>
        <p className="mx-auto mt-2 max-w-2xl text-pretty text-sm text-muted-foreground">
          Humans, AI, automation, and software are simply different ways of delivering capabilities.
          The capability becomes the primary object — not the job title.
        </p>
      </motion.div>

      {/* Market Intelligence */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Top Growing */}
        <MarketCard
          title="Top growing capabilities"
          icon={TrendingUp}
          accent="text-emerald-600 dark:text-emerald-400"
        >
          {TOP_GROWING.map((c, i) => (
            <MarketRow key={c.name} rank={i + 1} name={c.name} value={`+${c.growth}%`} category={c.category} trend="up" />
          ))}
        </MarketCard>

        {/* Highest Paying */}
        <MarketCard
          title="Highest paying capabilities"
          icon={DollarSign}
          accent="text-amber-600 dark:text-amber-400"
        >
          {HIGHEST_PAYING.map((c, i) => (
            <MarketRow key={c.name} rank={i + 1} name={c.name} value={c.salary} category={c.category} />
          ))}
        </MarketCard>

        {/* Fastest Growing Industries */}
        <MarketCard
          title="Fastest growing industries"
          icon={Factory}
          accent="text-violet-600 dark:text-violet-400"
        >
          {FASTEST_INDUSTRIES.map((c, i) => (
            <MarketRow key={c.name} rank={i + 1} name={c.name} value={c.growth} />
          ))}
        </MarketCard>
      </div>

      {/* Investment Planner */}
      <div className="rounded-2xl border border-border/60 bg-card p-6">
        <div className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary">
            <GraduationCap className="h-4 w-4" />
          </span>
          <div>
            <h3 className="text-sm font-semibold">Capability investment planner</h3>
            <p className="text-[11px] text-muted-foreground">If I learn X, what happens?</p>
          </div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {INVESTMENT_EXAMPLES.map((inv, i) => (
            <motion.div
              key={inv.capability}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="rounded-xl border border-border/50 bg-secondary/20 p-4"
            >
              <div className="text-xs font-medium text-muted-foreground">Add capability</div>
              <div className="mt-1 text-sm font-semibold">{inv.capability}</div>

              <div className="mt-3 flex items-center justify-between">
                <div className="text-center">
                  <div className="text-[9px] uppercase tracking-wider text-muted-foreground">Current</div>
                  <div className="font-mono text-sm text-muted-foreground line-through">{inv.currentSalary}</div>
                </div>
                <ArrowUpRight className="h-4 w-4 text-emerald-500" />
                <div className="text-center">
                  <div className="text-[9px] uppercase tracking-wider text-muted-foreground">Projected</div>
                  <div className="font-mono text-sm font-bold text-emerald-600 dark:text-emerald-400">{inv.projectedSalary}</div>
                </div>
              </div>

              <div className="mt-3 space-y-1 text-[10px]">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Salary delta</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">{inv.delta}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Probability</span>
                  <span className="font-semibold">{inv.probability}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Time required</span>
                  <span className="font-semibold">{inv.timeRequired}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Demand</span>
                  <span className={cn(
                    "font-semibold",
                    inv.demand === "Very High" ? "text-rose-600 dark:text-rose-400" : "text-amber-600 dark:text-amber-400",
                  )}>{inv.demand}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">New opportunities</span>
                  <span className="font-semibold text-primary">+{inv.newOpportunities}%</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Capability Wallet */}
      <div className="rounded-2xl border border-border/60 bg-card p-6">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary">
              <Wallet className="h-4 w-4" />
            </span>
            <div>
              <h3 className="text-sm font-semibold">Capability wallet</h3>
              <p className="text-[11px] text-muted-foreground">Portable, evidence-backed — not tied to one employer</p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-emerald-200/70 bg-emerald-50 px-3 py-1 text-xs dark:border-emerald-500/20 dark:bg-emerald-500/10">
            <Brain className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
            <span className="font-medium text-emerald-700 dark:text-emerald-300">Evidence-backed</span>
          </div>
        </div>

        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {WALLET.map((entry, i) => (
            <motion.div
              key={entry.capability}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="rounded-xl border border-border/50 bg-secondary/20 p-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium truncate">{entry.capability}</span>
                {entry.cert && (
                  <span className="shrink-0 rounded-full bg-amber-100 px-1.5 py-0.5 text-[8px] font-bold text-amber-700 dark:bg-amber-500/15 dark:text-amber-300">
                    CERT
                  </span>
                )}
              </div>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="font-display text-2xl text-primary">{entry.score}</span>
                <span className="text-xs text-muted-foreground">/100</span>
              </div>
              <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <motion.div
                  className={cn("h-full rounded-full", entry.score >= 90 ? "bg-emerald-500" : entry.score >= 80 ? "bg-primary" : "bg-amber-500")}
                  initial={{ width: 0 }}
                  whileInView={{ width: `${entry.score}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: i * 0.05 }}
                />
              </div>
              <div className="mt-1 text-[9px] text-muted-foreground">
                {entry.evidence} evidence items · portable
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-3 flex items-center gap-2 rounded-lg bg-primary/[0.04] p-3">
          <Rocket className="h-3.5 w-3.5 shrink-0 text-primary" />
          <p className="text-[11px] leading-relaxed text-muted-foreground">
            <span className="font-medium text-foreground">Scores are backed by evidence, not exams.</span>{" "}
            Each simulation adds proof. Capabilities are portable — businesses see demonstrated ability, not credentials.
          </p>
        </div>
      </div>
    </div>
  )
}

function MarketCard({
  title,
  icon: Icon,
  accent,
  children,
}: {
  title: string
  icon: React.ElementType
  accent: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card p-5">
      <h3 className={cn("flex items-center gap-2 text-xs font-semibold uppercase tracking-wider", accent)}>
        <Icon className="h-3.5 w-3.5" /> {title}
      </h3>
      <div className="mt-3 space-y-1.5">{children}</div>
    </div>
  )
}

function MarketRow({
  rank,
  name,
  value,
  category,
  trend,
}: {
  rank: number
  name: string
  value: string
  category?: string
  trend?: "up"
}) {
  return (
    <div className="flex items-center gap-2 rounded-lg bg-secondary/20 px-2.5 py-1.5">
      <span className="font-mono text-[10px] text-muted-foreground w-4">{rank}</span>
      <div className="min-w-0 flex-1">
        <span className="text-xs font-medium truncate block">{name}</span>
        {category && <span className="text-[9px] text-muted-foreground">{category}</span>}
      </div>
      <span className={cn(
        "font-mono text-xs font-semibold shrink-0",
        trend === "up" ? "text-emerald-600 dark:text-emerald-400" : "text-foreground",
      )}>{value}</span>
    </div>
  )
}
