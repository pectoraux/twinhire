"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  Award,
  CheckCircle2,
  ShoppingCart,
  Sparkles,
  Star,
  TrendingUp,
  Users,
} from "lucide-react";
import { CountUp } from "./primitives";
import { cn } from "@/lib/utils";

/**
 * CapabilityMarketplace — hire for capabilities, not job titles.
 *
 * The vision: "Instead of hiring for jobs. Hire for capabilities.
 * Candidates earn capability reputation. Businesses purchase capability.
 * Not titles."
 */

interface MarketCapability {
  name: string
  category: string
  description: string
  requiredEvidence: string[]
  candidatesAvailable: number
  avgReputation: number
  demandLevel: "high" | "medium" | "emerging"
  typicalImpact: string
  priceRange: string
}

const CAPABILITIES: MarketCapability[] = [
  {
    name: "Customer Onboarding Optimization",
    category: "Operations",
    description: "Redesign onboarding workflows to reduce time-to-value and improve activation",
    requiredEvidence: ["Improved onboarding", "Reduced churn", "Documentation quality", "Experimentation"],
    candidatesAvailable: 47,
    avgReputation: 78,
    demandLevel: "high",
    typicalImpact: "-40% time-to-value, +15% activation rate",
    priceRange: "$90K–$140K",
  },
  {
    name: "Lifecycle Email & Activation",
    category: "Growth",
    description: "Own lifecycle email optimization and in-app activation flows",
    requiredEvidence: ["A/B testing", "Activation improvement", "Email deliverability", "Segmentation"],
    candidatesAvailable: 63,
    avgReputation: 72,
    demandLevel: "high",
    typicalImpact: "+8pt activation, +$1.1M ARR",
    priceRange: "$80K–$130K",
  },
  {
    name: "Demand Forecasting & Inventory",
    category: "Operations",
    description: "Build statistical forecasting models and reorder systems",
    requiredEvidence: ["Forecasting model", "Inventory optimization", "Data reconciliation", "Bias tracking"],
    candidatesAvailable: 31,
    avgReputation: 81,
    demandLevel: "medium",
    typicalImpact: "+0.5x turnover, -50% stockouts",
    priceRange: "$100K–$160K",
  },
  {
    name: "AI Leverage & Automation",
    category: "Engineering",
    description: "Build multi-step AI agent workflows and internal automation tools",
    requiredEvidence: ["Agent design", "Process automation", "AI verification", "Tool selection"],
    candidatesAvailable: 24,
    avgReputation: 85,
    demandLevel: "high",
    typicalImpact: "560 hrs/month reclaimed, +2pt margin",
    priceRange: "$120K–$200K",
  },
  {
    name: "Churn Prediction & Health Scoring",
    category: "Data",
    description: "Build predictive health scores and proactive retention playbooks",
    requiredEvidence: ["Predictive model", "Retention playbook", "Feature engineering", "Intervention design"],
    candidatesAvailable: 38,
    avgReputation: 76,
    demandLevel: "medium",
    typicalImpact: "-30% churn, +4pt NRR",
    priceRange: "$95K–$150K",
  },
  {
    name: "Pricing Strategy & Packaging",
    category: "Revenue",
    description: "Redesign pricing models, packaging, and sales enablement",
    requiredEvidence: ["Pricing model", "Competitive analysis", "Packaging design", "Sales enablement"],
    candidatesAvailable: 19,
    avgReputation: 83,
    demandLevel: "emerging",
    typicalImpact: "+35% ARPA, aligned cost-to-serve",
    priceRange: "$110K–$180K",
  },
]

const DEMAND_META = {
  high: { cls: "text-rose-700 bg-rose-50 dark:text-rose-300 dark:bg-rose-500/10", label: "High demand" },
  medium: { cls: "text-amber-700 bg-amber-50 dark:text-amber-300 dark:bg-amber-500/10", label: "Medium demand" },
  emerging: { cls: "text-teal-700 bg-teal-50 dark:text-teal-300 dark:bg-teal-500/10", label: "Emerging" },
} as const

export function CapabilityMarketplace({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-2xl border border-border/60 bg-card p-6", className)}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="flex items-center gap-2 text-sm font-semibold">
            <ShoppingCart className="h-4 w-4 text-primary" /> Capability marketplace
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Hire for capabilities, not job titles. Candidates earn reputation; businesses purchase demonstrated capability.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-center">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Capabilities</div>
            <div className="font-display text-lg"><CountUp value={CAPABILITIES.length} /></div>
          </div>
        </div>
      </div>

      {/* Capability cards */}
      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {CAPABILITIES.map((cap, i) => {
          const demand = DEMAND_META[cap.demandLevel]
          return (
            <motion.div
              key={cap.name}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="group rounded-2xl border border-border/60 bg-secondary/20 p-4 transition-all hover:border-primary/30 hover:shadow-md"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-semibold leading-snug">{cap.name}</h4>
                  <span className="mt-0.5 inline-block text-[10px] text-muted-foreground">{cap.category}</span>
                </div>
                <span className={cn("shrink-0 rounded-full px-2 py-0.5 text-[9px] font-medium", demand.cls)}>
                  {demand.label}
                </span>
              </div>

              <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">{cap.description}</p>

              {/* Required evidence */}
              <div className="mt-3">
                <div className="text-[9px] font-medium uppercase tracking-wider text-muted-foreground">
                  Required evidence
                </div>
                <div className="mt-1 flex flex-wrap gap-1">
                  {cap.requiredEvidence.map((e) => (
                    <span key={e} className="inline-flex items-center gap-0.5 rounded-md bg-card px-1.5 py-0.5 text-[9px]">
                      <CheckCircle2 className="h-2 w-2 text-emerald-500" />
                      {e}
                    </span>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="mt-3 grid grid-cols-3 gap-2 border-t border-border/40 pt-3">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-0.5 text-xs font-semibold">
                    <Users className="h-2.5 w-2.5 text-primary" />
                    {cap.candidatesAvailable}
                  </div>
                  <div className="text-[8px] text-muted-foreground">candidates</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-0.5 text-xs font-semibold">
                    <Star className="h-2.5 w-2.5 text-amber-500" />
                    {cap.avgReputation}
                  </div>
                  <div className="text-[8px] text-muted-foreground">avg rep</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-0.5 text-xs font-semibold text-primary">
                    <TrendingUp className="h-2.5 w-2.5" />
                    {cap.priceRange}
                  </div>
                  <div className="text-[8px] text-muted-foreground">range</div>
                </div>
              </div>

              {/* Impact */}
              <div className="mt-2 rounded-lg bg-emerald-50/50 px-2 py-1 dark:bg-emerald-500/[0.06]">
                <div className="text-[9px] text-emerald-700 dark:text-emerald-300 font-medium">
                  {cap.typicalImpact}
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* CTA */}
      <div className="mt-5 flex items-center justify-center gap-2 text-xs text-muted-foreground">
        <Award className="h-3.5 w-3.5 text-primary" />
        Capabilities are earned through demonstrated work — not self-reported.
        <Sparkles className="h-3 w-3 text-primary" />
      </div>
    </div>
  )
}
