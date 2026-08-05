"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  Building2,
  Calendar,
  Cpu,
  GitBranch,
  Target,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { BusinessTwinView } from "@/lib/twinhire/types";

/**
 * TwinEvolution — shows how the twin has changed over time.
 *
 * The vision: "Instead of static twins. Businesses evolve. Every week:
 * new goals, new customers, new products, new competitors, new regulations,
 * new priorities. The twin changes automatically. Candidates therefore
 * always work in the latest company."
 */

interface EvolutionEvent {
  date: string
  type: "goal" | "customer" | "product" | "competitor" | "regulation" | "priority" | "team" | "tech"
  title: string
  description: string
  impact: string
}

function generateEvolution(twin: BusinessTwinView): EvolutionEvent[] {
  const events: EvolutionEvent[] = []

  // Industry-specific evolution
  if (twin.industry.includes("D2C") || twin.industry.includes("Consumer")) {
    events.push(
      { date: "This week", type: "priority", title: "Shifted Q4 priority to inventory optimization", description: "COO redirected engineering bandwidth from catalog expansion to demand forecasting after stockout rate hit 8%", impact: "Roadmap reprioritized" },
      { date: "This week", type: "competitor", title: "Competitor launched same-day shipping", description: "Direct competitor announced same-day shipping in 3 metro areas, putting pressure on delivery SLAs", impact: "Customer expectation shifted" },
      { date: "2 weeks ago", type: "customer", title: "Lost 2 enterprise accounts to churn", description: "Both cited slow onboarding and stockout issues — the capability gap is now revenue-critical", impact: "-$340K ARR" },
      { date: "3 weeks ago", type: "product", title: "Launched subscription bundle v1", description: "New subscription tier launched but adoption is below forecast (12% vs 25% target)", impact: "Pricing strategy gap" },
      { date: "1 month ago", type: "regulation", title: "New FTC compliance requirement for subscription cancellations", description: "Must implement 1-click cancellation by Q1 — adds engineering scope", impact: "Compliance risk" },
      { date: "6 weeks ago", type: "team", title: "Head of Merchandising departed", description: "Merchandising capacity dropped — catalog decisions now bottlenecked", impact: "Capability gap widened" },
    )
  } else if (twin.industry.includes("Freight") || twin.industry.includes("Logistics")) {
    events.push(
      { date: "This week", type: "priority", title: "EU lane expansion accelerated to Q3", description: "Board moved EU expansion forward by one quarter — operations not ready", impact: "Capability gap: compliance + carrier onboarding" },
      { date: "This week", type: "competitor", title: "Competitor lowered spot-quote rates by 8%", description: "Direct competitor cut rates on top 3 lanes — margin pressure immediate", impact: "Quote-to-book declining" },
      { date: "2 weeks ago", type: "tech", title: "Migrated to new TMS (Transportation Management System)", description: "New TMS live but dispatchers are struggling — productivity dropped 15%", impact: "Adoption risk" },
      { date: "3 weeks ago", type: "customer", title: "Won 2 new enterprise contracts", description: "New contracts require dedicated capacity — ops model needs redesign", impact: "+$1.2M ARR but capacity strain" },
      { date: "1 month ago", type: "regulation", title: "New EU emissions reporting requirement", description: "Must track and report carbon emissions per shipment starting Q4", impact: "Data pipeline gap" },
    )
  } else if (twin.industry.includes("Healthcare")) {
    events.push(
      { date: "This week", type: "priority", title: "EU market entry compliance audit failed", description: "GDPR data residency gaps found — 9 items need remediation before EU launch", impact: "Launch delayed 2 months" },
      { date: "This week", type: "customer", title: "Enterprise account threatened to churn", description: "Top-5 account cited slow onboarding (34 days) and knowledge fragmentation", impact: "$340K ARR at risk" },
      { date: "2 weeks ago", type: "product", title: "Self-serve analytics module blocked", description: "No dedicated PM — roadmap stalled for 2 quarters, 38% of CS feedback requests it", impact: "Expansion revenue blocked" },
      { date: "3 weeks ago", type: "team", title: "VP of Clinical Success departed", description: "Clinical Success leadership gap — onboarding quality at risk", impact: "Operational risk" },
      { date: "1 month ago", type: "competitor", title: "Competitor raised Series B ($25M)", description: "Well-funded competitor now hiring aggressively in clinical operations", impact: "Talent war risk" },
    )
  } else {
    events.push(
      { date: "This week", type: "priority", title: "Pricing v2 decision needed by Friday", description: "Founders blocked on pricing model — current model subsidizes top 10% of users", impact: "Roadmap blocked" },
      { date: "This week", type: "customer", title: "3 design-partner deals in pipeline", description: "Fintech vertical showing strong interest — need first non-founder commercial hire", impact: "Growth opportunity" },
      { date: "2 weeks ago", type: "competitor", title: "Competitor raised Series A ($8M)", description: "Well-funded competitor entering the same vertical", impact: "Talent and market risk" },
      { date: "3 weeks ago", type: "tech", title: "API traffic spiked 18% from viral integration", description: "Capacity scaling needed — infrastructure wasn't designed for this load", impact: "Reliability risk" },
      { date: "1 month ago", type: "product", title: "Integration backlog hit 47 requests", description: "No structured prioritization — 3 of last 8 shipped integrations had <5 adopting accounts", impact: "Engineering waste" },
    )
  }

  return events
}

const TYPE_META: Record<string, { icon: React.ElementType; color: string; label: string }> = {
  goal: { icon: Target, color: "text-primary bg-primary/10", label: "Goal" },
  customer: { icon: Users, color: "text-teal-600 bg-teal-50 dark:text-teal-300 dark:bg-teal-500/10", label: "Customer" },
  product: { icon: Cpu, color: "text-violet-600 bg-violet-50 dark:text-violet-300 dark:bg-violet-500/10", label: "Product" },
  competitor: { icon: TrendingUp, color: "text-rose-600 bg-rose-50 dark:text-rose-300 dark:bg-rose-500/10", label: "Competitor" },
  regulation: { icon: Building2, color: "text-amber-600 bg-amber-50 dark:text-amber-300 dark:bg-amber-500/10", label: "Regulation" },
  priority: { icon: Zap, color: "text-primary bg-primary/10", label: "Priority" },
  team: { icon: Users, color: "text-blue-600 bg-blue-50 dark:text-blue-300 dark:bg-blue-500/10", label: "Team" },
  tech: { icon: GitBranch, color: "text-emerald-600 bg-emerald-50 dark:text-emerald-300 dark:bg-emerald-500/10", label: "Tech" },
}

export function TwinEvolution({
  twin,
  className,
}: {
  twin: BusinessTwinView;
  className?: string;
}) {
  const events = generateEvolution(twin)

  return (
    <div className={cn("rounded-2xl border border-border/60 bg-card p-6", className)}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="flex items-center gap-2 text-sm font-semibold">
            <GitBranch className="h-4 w-4 text-primary" /> Twin evolution
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            The twin changes every week. New goals, customers, competitors, regulations, priorities.
            Candidates always work in the latest company.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-border/60 bg-secondary/40 px-3 py-1.5 text-xs">
          <Calendar className="h-3.5 w-3.5 text-primary" />
          <span className="text-muted-foreground">last 6 weeks</span>
        </div>
      </div>

      {/* Evolution timeline */}
      <div className="mt-5 space-y-3">
        {events.map((event, i) => {
          const meta = TYPE_META[event.type] ?? TYPE_META.priority
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -6 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="flex gap-3"
            >
              {/* Timeline rail */}
              <div className="flex flex-col items-center">
                <span className={cn("grid h-8 w-8 shrink-0 place-items-center rounded-full", meta.color)}>
                  <meta.icon className="h-3.5 w-3.5" />
                </span>
                {i < events.length - 1 && <div className="mt-1 w-px flex-1 bg-border" />}
              </div>

              {/* Content */}
              <div className="min-w-0 flex-1 pb-3">
                <div className="flex items-center gap-2">
                  <span className="rounded-md bg-secondary px-1.5 py-0.5 text-[9px] font-medium text-muted-foreground">
                    {meta.label}
                  </span>
                  <span className="text-[10px] text-muted-foreground">{event.date}</span>
                </div>
                <h4 className="mt-1 text-sm font-medium leading-snug">{event.title}</h4>
                <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{event.description}</p>
                <div className="mt-1 flex items-center gap-1">
                  <ArrowRight className="h-2.5 w-2.5 text-primary" />
                  <span className="text-[10px] font-medium text-primary">{event.impact}</span>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Summary */}
      <div className="mt-4 rounded-xl bg-primary/[0.04] p-3">
        <p className="text-[11px] leading-relaxed text-muted-foreground">
          <span className="font-medium text-foreground">The twin is never the same company twice.</span>{" "}
          Candidates who worked here last month would find different problems, different priorities,
          and different KPIs today. The twin evolves with the business.
        </p>
      </div>
    </div>
  )
}
