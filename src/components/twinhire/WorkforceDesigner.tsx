"use client";

import { motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowRight,
  Bot,
  BrainCircuit,
  Cpu,
  DollarSign,
  GraduationCap,
  LineChart,
  Rocket,
  Sparkles,
  TrendingUp,
  User,
  Users,
  Wrench,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

/**
 * WorkforceDesigner — businesses don't recruit. They design workforces.
 *
 * The vision: "The platform isn't saying 'hire this person.' It's saying
 * 'this is the optimal capability composition for achieving your business objective.'"
 *
 * Recommends combinations of humans, AI agents, automation, software,
 * contractors, and training investments.
 */

interface WorkforceComposition {
  objective: string
  components: {
    type: "human" | "ai_agent" | "automation" | "software" | "contractor" | "training"
    role: string
    cost: string
    capabilities: string[]
    rationale: string
  }[]
  expectedResults: { metric: string; value: string; positive: boolean }[]
  totalInvestment: string
  paybackPeriod: string
  roi: string
}

const COMPOSITIONS: WorkforceComposition[] = [
  {
    objective: "Reduce support costs while improving resolution time",
    components: [
      { type: "human", role: "Support Lead (1 FTE)", cost: "$95K/yr", capabilities: ["Complex escalation", "Quality coaching", "Process design"], rationale: "Human judgment for escalations and team coaching" },
      { type: "ai_agent", role: "AI Support Agent (Tier 1)", cost: "$12K/yr", capabilities: ["Ticket triage", "Knowledge retrieval", "Auto-response"], rationale: "Handles 70% of Tier 1 tickets instantly, 24/7" },
      { type: "ai_agent", role: "AI Support Agent (Tier 2)", cost: "$18K/yr", capabilities: ["Diagnostic reasoning", "Solution synthesis", "Escalation routing"], rationale: "Resolves complex issues before human escalation" },
      { type: "automation", role: "Workflow Automation", cost: "$8K/yr", capabilities: ["Ticket routing", "SLA enforcement", "Status updates"], rationale: "Eliminates manual coordination overhead" },
      { type: "software", role: "Knowledge Graph + Search", cost: "$15K/yr", capabilities: ["Knowledge architecture", "Semantic search", "Content analytics"], rationale: "Single source of truth for all agents" },
    ],
    expectedResults: [
      { metric: "Support costs", value: "-42%", positive: true },
      { metric: "Resolution time", value: "-31%", positive: true },
      { metric: "CSAT", value: "+8pt", positive: true },
      { metric: "Tickets/agent", value: "+3.2x", positive: true },
    ],
    totalInvestment: "$148K/yr",
    paybackPeriod: "8 months",
    roi: "312%",
  },
  {
    objective: "Scale sales operations without linear headcount growth",
    components: [
      { type: "human", role: "RevOps Lead (1 FTE)", cost: "$130K/yr", capabilities: ["Strategy", "Cross-functional alignment", "Decision making"], rationale: "Strategic ownership and stakeholder management" },
      { type: "ai_agent", role: "AI Sales Analyst", cost: "$20K/yr", capabilities: ["Pipeline analysis", "Forecasting", "Competitive intelligence"], rationale: "Real-time analysis that would take a human 40 hrs/week" },
      { type: "automation", role: "CRM Automation", cost: "$10K/yr", capabilities: ["Data enrichment", "Task creation", "Follow-up sequences"], rationale: "Eliminates manual CRM upkeep" },
      { type: "training", role: "Sales Enablement Program", cost: "$25K/yr", capabilities: ["Objection handling", "Product knowledge", "Closing"], rationale: "Upskills existing team rather than hiring more reps" },
    ],
    expectedResults: [
      { metric: "Revenue per rep", value: "+47%", positive: true },
      { metric: "Headcount need", value: "-3 FTEs", positive: true },
      { metric: "Forecast accuracy", value: "+22pt", positive: true },
      { metric: "Ramp time", value: "-40%", positive: true },
    ],
    totalInvestment: "$185K/yr",
    paybackPeriod: "5 months",
    roi: "428%",
  },
]

const TYPE_META: Record<string, { icon: React.ElementType; color: string; label: string }> = {
  human: { icon: User, color: "text-primary bg-primary/10", label: "Human" },
  ai_agent: { icon: Bot, color: "text-violet-600 bg-violet-50 dark:text-violet-300 dark:bg-violet-500/10", label: "AI Agent" },
  automation: { icon: Cpu, color: "text-emerald-600 bg-emerald-50 dark:text-emerald-300 dark:bg-emerald-500/10", label: "Automation" },
  software: { icon: Wrench, color: "text-blue-600 bg-blue-50 dark:text-blue-300 dark:bg-blue-500/10", label: "Software" },
  contractor: { icon: Users, color: "text-amber-600 bg-amber-50 dark:text-amber-300 dark:bg-amber-500/10", label: "Contractor" },
  training: { icon: GraduationCap, color: "text-teal-600 bg-teal-50 dark:text-teal-300 dark:bg-teal-500/10", label: "Training" },
}

export function WorkforceDesigner({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-2xl border border-border/60 bg-card p-6", className)}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="flex items-center gap-2 text-sm font-semibold">
            <Users className="h-4 w-4 text-primary" /> Workforce designer
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Businesses don&apos;t recruit. They design workforces. The optimal composition of humans, AI agents, automation, software, and training.
          </p>
        </div>
      </div>

      {/* Compositions */}
      <div className="mt-5 space-y-4">
        {COMPOSITIONS.map((comp, ci) => (
          <motion.div
            key={ci}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: ci * 0.1 }}
            className="rounded-2xl border border-border/50 bg-secondary/20 p-4"
          >
            {/* Objective */}
            <div className="flex items-center gap-2">
              <Target className="h-3.5 w-3.5 text-primary" />
              <span className="text-sm font-semibold">{comp.objective}</span>
            </div>

            {/* Components */}
            <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {comp.components.map((c, i) => {
                const meta = TYPE_META[c.type] ?? TYPE_META.human
                return (
                  <div key={i} className="rounded-xl border border-border/40 bg-card p-3">
                    <div className="flex items-center gap-2">
                      <span className={cn("grid h-7 w-7 place-items-center rounded-lg", meta.color)}>
                        <meta.icon className="h-3.5 w-3.5" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-semibold truncate">{c.role}</div>
                        <div className="text-[9px] text-muted-foreground">{meta.label} · {c.cost}</div>
                      </div>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {c.capabilities.map((cap) => (
                        <span key={cap} className="rounded-md bg-secondary px-1.5 py-0.5 text-[8px]">{cap}</span>
                      ))}
                    </div>
                    <p className="mt-1.5 text-[9px] leading-relaxed text-muted-foreground italic">{c.rationale}</p>
                  </div>
                )
              })}
            </div>

            {/* Expected results */}
            <div className="mt-3 grid grid-cols-4 gap-2">
              {comp.expectedResults.map((r, i) => (
                <div key={i} className="rounded-lg bg-card p-2 text-center">
                  <div className={cn(
                    "font-mono text-sm font-bold",
                    r.positive ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400",
                  )}>{r.value}</div>
                  <div className="text-[8px] text-muted-foreground">{r.metric}</div>
                </div>
              ))}
            </div>

            {/* Investment summary */}
            <div className="mt-3 flex items-center justify-between rounded-xl bg-gradient-to-r from-primary/[0.06] to-[oklch(0.74_0.135_70)]/[0.06] p-3">
              <div className="flex items-center gap-4 text-xs">
                <div>
                  <span className="text-muted-foreground">Investment: </span>
                  <span className="font-semibold">{comp.totalInvestment}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Payback: </span>
                  <span className="font-semibold">{comp.paybackPeriod}</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-muted-foreground">ROI</span>
                <span className="font-display text-lg font-bold text-primary">{comp.roi}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* The shift */}
      <div className="mt-4 flex items-start gap-2 rounded-xl bg-gradient-to-r from-primary/[0.06] to-[oklch(0.74_0.135_70)]/[0.06] p-4">
        <Rocket className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
        <div>
          <p className="text-xs font-semibold text-primary">The platform isn&apos;t saying &quot;hire this person.&quot;</p>
          <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
            It&apos;s saying <span className="font-medium text-foreground">&quot;this is the optimal capability composition for achieving your business objective.&quot;</span>
            Humans, AI agents, automation, software, contractors, and training are all valid providers of work.
          </p>
        </div>
      </div>
    </div>
  )
}

function Target({ className }: { className?: string }) {
  return <Sparkles className={className} />
}
