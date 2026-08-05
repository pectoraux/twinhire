"use client";

import { motion } from "framer-motion";
import {
  Activity,
  ArrowUpRight,
  BarChart3,
  Building2,
  DollarSign,
  Globe,
  LineChart,
  TrendingDown,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { CountUp } from "./primitives";
import { cn } from "@/lib/utils";

/**
 * GlobalCapabilityExchange — capabilities become liquid.
 *
 * Like stock markets made capital liquid, this exchange makes capabilities liquid.
 * Organizations discover demand, professionals invest in high-value capabilities,
 * educators align curricula, policymakers understand workforce trends.
 *
 * The primary entity is Work. Capabilities are how work gets done.
 * People, AI agents, robots, software, consultants, and automation
 * are simply different providers of work.
 */

interface ExchangeCapability {
  name: string
  category: string
  demandChange: number // % YoY
  supply: "Low" | "Medium" | "High" | "Oversupplied"
  medianComp: string
  automationRisk: number // 0-100
  projectedGrowth: number // % next 5 years
  companiesRecruiting: number
  professionalsProven: number
  avgRoi: string
  lifecycle: "Emerging" | "Growing" | "Mainstream" | "Commodity" | "Automated"
}

const EXCHANGE: ExchangeCapability[] = [
  {
    name: "AI Agent Design",
    category: "AI",
    demandChange: 182,
    supply: "Low",
    medianComp: "$198K",
    automationRisk: 18,
    projectedGrowth: 43,
    companiesRecruiting: 1247,
    professionalsProven: 9872,
    avgRoi: "13.8%",
    lifecycle: "Emerging",
  },
  {
    name: "Revenue Operations",
    category: "Revenue",
    demandChange: 144,
    supply: "Low",
    medianComp: "$162K",
    automationRisk: 22,
    projectedGrowth: 31,
    companiesRecruiting: 2103,
    professionalsProven: 18421,
    avgRoi: "11.2%",
    lifecycle: "Growing",
  },
  {
    name: "Industrial Automation",
    category: "Manufacturing",
    demandChange: 121,
    supply: "Medium",
    medianComp: "$148K",
    automationRisk: 35,
    projectedGrowth: 28,
    companiesRecruiting: 892,
    professionalsProven: 7234,
    avgRoi: "10.4%",
    lifecycle: "Growing",
  },
  {
    name: "Predictive Maintenance",
    category: "Engineering",
    demandChange: 87,
    supply: "Medium",
    medianComp: "$134K",
    automationRisk: 28,
    projectedGrowth: 22,
    companiesRecruiting: 634,
    professionalsProven: 5128,
    avgRoi: "9.1%",
    lifecycle: "Growing",
  },
  {
    name: "Customer Onboarding",
    category: "Operations",
    demandChange: 56,
    supply: "High",
    medianComp: "$112K",
    automationRisk: 45,
    projectedGrowth: 14,
    companiesRecruiting: 1847,
    professionalsProven: 24103,
    avgRoi: "7.8%",
    lifecycle: "Mainstream",
  },
  {
    name: "Manual Data Entry",
    category: "Operations",
    demandChange: -34,
    supply: "Oversupplied",
    medianComp: "$52K",
    automationRisk: 92,
    projectedGrowth: -18,
    companiesRecruiting: 312,
    professionalsProven: 84201,
    avgRoi: "N/A",
    lifecycle: "Automated",
  },
]

const LIFECYCLE_COLORS: Record<string, string> = {
  Emerging: "text-violet-700 bg-violet-50 dark:text-violet-300 dark:bg-violet-500/10",
  Growing: "text-emerald-700 bg-emerald-50 dark:text-emerald-300 dark:bg-emerald-500/10",
  Mainstream: "text-blue-700 bg-blue-50 dark:text-blue-300 dark:bg-blue-500/10",
  Commodity: "text-amber-700 bg-amber-50 dark:text-amber-300 dark:bg-amber-500/10",
  Automated: "text-rose-700 bg-rose-50 dark:text-rose-300 dark:bg-rose-500/10",
}

const SUPPLY_COLORS: Record<string, string> = {
  Low: "text-rose-600 dark:text-rose-400",
  Medium: "text-amber-600 dark:text-amber-400",
  High: "text-emerald-600 dark:text-emerald-400",
  Oversupplied: "text-muted-foreground",
}

export function GlobalCapabilityExchange({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center"
      >
        <span className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-3 py-1 text-xs font-medium text-background">
          <Globe className="h-3 w-3" /> Global Capability Exchange
        </span>
        <h2 className="mt-3 font-display text-3xl text-balance sm:text-4xl">
          Capabilities are <span className="ink-emerald italic">liquid</span>
        </h2>
        <p className="mx-auto mt-2 max-w-2xl text-pretty text-sm text-muted-foreground">
          Like stock markets made capital liquid, this exchange makes capabilities liquid.
          The primary entity is <span className="font-medium text-foreground">Work</span>.
          People, AI agents, robots, software, and automation are simply different providers of work.
        </p>
      </motion.div>

      {/* Market ticker */}
      <div className="rounded-2xl border border-border/60 bg-card p-6">
        <div className="flex items-center justify-between gap-3">
          <h3 className="flex items-center gap-2 text-sm font-semibold">
            <BarChart3 className="h-4 w-4 text-primary" /> Capability market
          </h3>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1 text-muted-foreground">
              <Activity className="h-3 w-3 text-emerald-500 animate-pulse" />
              Live
            </span>
          </div>
        </div>

        {/* Market stats */}
        <div className="mt-4 grid grid-cols-4 gap-2">
          <MarketStat label="Capabilities tracked" value={12847} icon={Zap} />
          <MarketStat label="Companies recruiting" value={8421} icon={Building2} />
          <MarketStat label="Professionals proven" value={147892} icon={Users} />
          <MarketStat label="Avg ROI" value="11.2%" icon={TrendingUp} />
        </div>

        {/* Exchange table */}
        <div className="mt-4 overflow-x-auto scroll-slim">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border/60 text-[9px] uppercase tracking-wider text-muted-foreground">
                <th className="pb-2 pr-3 font-medium">Capability</th>
                <th className="pb-2 pr-3 font-medium text-right">Demand</th>
                <th className="pb-2 pr-3 font-medium">Supply</th>
                <th className="pb-2 pr-3 font-medium text-right">Median</th>
                <th className="pb-2 pr-3 font-medium text-right">Auto Risk</th>
                <th className="pb-2 pr-3 font-medium text-right">Growth</th>
                <th className="pb-2 pr-3 font-medium text-right">Recruiting</th>
                <th className="pb-2 pr-3 font-medium text-right">Proven</th>
                <th className="pb-2 pr-3 font-medium text-right">ROI</th>
                <th className="pb-2 font-medium">Lifecycle</th>
              </tr>
            </thead>
            <tbody>
              {EXCHANGE.map((cap, i) => (
                <motion.tr
                  key={cap.name}
                  initial={{ opacity: 0, y: 4 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04 }}
                  className="border-b border-border/30 hover:bg-secondary/20"
                >
                  <td className="py-2.5 pr-3">
                    <div className="font-medium">{cap.name}</div>
                    <div className="text-[9px] text-muted-foreground">{cap.category}</div>
                  </td>
                  <td className="py-2.5 pr-3 text-right">
                    <span className={cn(
                      "font-mono font-semibold",
                      cap.demandChange > 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400",
                    )}>
                      {cap.demandChange > 0 ? "+" : ""}{cap.demandChange}%
                    </span>
                  </td>
                  <td className="py-2.5 pr-3">
                    <span className={cn("font-medium", SUPPLY_COLORS[cap.supply])}>{cap.supply}</span>
                  </td>
                  <td className="py-2.5 pr-3 text-right font-mono">{cap.medianComp}</td>
                  <td className="py-2.5 pr-3 text-right">
                    <span className={cn(
                      "font-mono",
                      cap.automationRisk > 70 ? "text-rose-600 dark:text-rose-400" :
                      cap.automationRisk > 40 ? "text-amber-600 dark:text-amber-400" :
                      "text-emerald-600 dark:text-emerald-400",
                    )}>
                      {cap.automationRisk}%
                    </span>
                  </td>
                  <td className="py-2.5 pr-3 text-right">
                    <span className={cn(
                      "font-mono",
                      cap.projectedGrowth > 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400",
                    )}>
                      {cap.projectedGrowth > 0 ? "+" : ""}{cap.projectedGrowth}%
                    </span>
                  </td>
                  <td className="py-2.5 pr-3 text-right font-mono text-muted-foreground">{cap.companiesRecruiting.toLocaleString()}</td>
                  <td className="py-2.5 pr-3 text-right font-mono text-muted-foreground">{cap.professionalsProven.toLocaleString()}</td>
                  <td className="py-2.5 pr-3 text-right font-mono font-semibold text-primary">{cap.avgRoi}</td>
                  <td className="py-2.5">
                    <span className={cn("rounded-full px-1.5 py-0.5 text-[8px] font-medium", LIFECYCLE_COLORS[cap.lifecycle])}>
                      {cap.lifecycle}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Market insight */}
        <div className="mt-4 flex items-start gap-2 rounded-xl bg-gradient-to-r from-primary/[0.06] to-[oklch(0.74_0.135_70)]/[0.06] p-3">
          <LineChart className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
          <p className="text-[11px] leading-relaxed text-muted-foreground">
            <span className="font-medium text-foreground">This is not recruitment. This is a market.</span>{" "}
            Organizations discover capability demand, professionals invest in high-value capabilities,
            educators align curricula with market needs, and policymakers understand workforce trends.
          </p>
        </div>
      </div>
    </div>
  )
}

function MarketStat({ label, value, icon: Icon }: { label: string; value: number | string; icon: React.ElementType }) {
  return (
    <div className="rounded-lg bg-secondary/20 p-2.5 text-center">
      <Icon className="mx-auto h-3 w-3 text-primary" />
      <div className="mt-1 font-display text-base font-bold">
        {typeof value === "number" ? <CountUp value={value} /> : value}
      </div>
      <div className="text-[8px] uppercase tracking-wider text-muted-foreground">{label}</div>
    </div>
  )
}
