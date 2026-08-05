"use client";

import { motion } from "framer-motion";
import {
  Bot,
  Clock,
  Dna,
  Factory,
  GraduationCap,
  Rocket,
  TrendingDown,
  Users,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * CapabilityDNA + Lifecycle — two core IP layers.
 *
 * DNA: Every capability has a measurement weighting — what % of the score
 * comes from knowledge, skill, decisions, behaviors, etc. Every simulation
 * knows exactly what it is measuring.
 *
 * Lifecycle: Every capability moves through emerging → growing → mainstream
 * → commodity → automated → obsolete. Businesses know whether to hire,
 * automate, outsource, or train.
 */

// Capability DNA — measurement weightings per profession type
const DNA_PROFILES = [
  {
    profession: "Engineers",
    dna: [
      { component: "Knowledge", weight: 20, color: "bg-blue-500" },
      { component: "Skill", weight: 35, color: "bg-primary" },
      { component: "Decision Quality", weight: 15, color: "bg-violet-500" },
      { component: "Behavior", weight: 15, color: "bg-amber-500" },
      { component: "Communication", weight: 5, color: "bg-teal-500" },
      { component: "Creativity", weight: 5, color: "bg-rose-500" },
      { component: "Adaptability", weight: 5, color: "bg-emerald-500" },
    ],
  },
  {
    profession: "Scientists",
    dna: [
      { component: "Knowledge", weight: 30, color: "bg-blue-500" },
      { component: "Skill", weight: 20, color: "bg-primary" },
      { component: "Decision Quality", weight: 20, color: "bg-violet-500" },
      { component: "Behavior", weight: 10, color: "bg-amber-500" },
      { component: "Communication", weight: 10, color: "bg-teal-500" },
      { component: "Creativity", weight: 5, color: "bg-rose-500" },
      { component: "Adaptability", weight: 5, color: "bg-emerald-500" },
    ],
  },
  {
    profession: "Technicians",
    dna: [
      { component: "Knowledge", weight: 15, color: "bg-blue-500" },
      { component: "Skill", weight: 45, color: "bg-primary" },
      { component: "Decision Quality", weight: 10, color: "bg-violet-500" },
      { component: "Behavior", weight: 20, color: "bg-amber-500" },
      { component: "Communication", weight: 3, color: "bg-teal-500" },
      { component: "Creativity", weight: 2, color: "bg-rose-500" },
      { component: "Adaptability", weight: 5, color: "bg-emerald-500" },
    ],
  },
  {
    profession: "Managers",
    dna: [
      { component: "Knowledge", weight: 15, color: "bg-blue-500" },
      { component: "Skill", weight: 20, color: "bg-primary" },
      { component: "Decision Quality", weight: 25, color: "bg-violet-500" },
      { component: "Behavior", weight: 20, color: "bg-amber-500" },
      { component: "Communication", weight: 10, color: "bg-teal-500" },
      { component: "Creativity", weight: 5, color: "bg-rose-500" },
      { component: "Adaptability", weight: 5, color: "bg-emerald-500" },
    ],
  },
]

// Capability lifecycle
const LIFECYCLE_STAGES = [
  { stage: "Emerging", desc: "New capability, few practitioners, high uncertainty", action: "Invest early", actionType: "invest", example: "AI Agent Design" },
  { stage: "Growing", desc: "Demand surging, supply tight, premiums rising", action: "Hire now", actionType: "hire", example: "Revenue Operations" },
  { stage: "Mainstream", desc: "Widely adopted, supply growing, premiums stabilizing", action: "Train internally", actionType: "train", example: "Customer Onboarding" },
  { stage: "Commodity", desc: "Plentiful supply, declining premiums, automation encroaching", action: "Outsource", actionType: "outsource", example: "Manual QA Testing" },
  { stage: "Automated", desc: "AI/automation handles most of this work", action: "Automate", actionType: "automate", example: "Manual Data Entry" },
  { stage: "Obsolete", desc: "No longer needed — replaced by technology or process change", action: "Deprioritize", actionType: "deprioritize", example: "Fax Machine Repair" },
]

const ACTION_META: Record<string, { icon: React.ElementType; color: string }> = {
  invest: { icon: Rocket, color: "text-violet-600 dark:text-violet-400" },
  hire: { icon: Users, color: "text-emerald-600 dark:text-emerald-400" },
  train: { icon: GraduationCap, color: "text-blue-600 dark:text-blue-400" },
  outsource: { icon: Factory, color: "text-amber-600 dark:text-amber-400" },
  automate: { icon: Bot, color: "text-rose-600 dark:text-rose-400" },
  deprioritize: { icon: TrendingDown, color: "text-muted-foreground" },
}

export function CapabilityDNAAndLifecycle({ className }: { className?: string }) {
  return (
    <div className={cn("grid gap-6 lg:grid-cols-2", className)}>
      {/* Capability DNA */}
      <div className="rounded-2xl border border-border/60 bg-card p-6">
        <div className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary">
            <Dna className="h-4 w-4" />
          </span>
          <div>
            <h3 className="text-sm font-semibold">Capability DNA</h3>
            <p className="text-[11px] text-muted-foreground">Every simulation knows exactly what it&apos;s measuring</p>
          </div>
        </div>

        <div className="mt-4 space-y-3">
          {DNA_PROFILES.map((profile, pi) => (
            <motion.div
              key={profile.profession}
              initial={{ opacity: 0, y: 4 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: pi * 0.08 }}
            >
              <div className="text-xs font-medium text-muted-foreground">{profile.profession}</div>
              {/* Stacked bar */}
              <div className="mt-1 flex h-6 overflow-hidden rounded-lg">
                {profile.dna.map((d, di) => (
                  <motion.div
                    key={d.component}
                    initial={{ width: 0 }}
                    whileInView={{ width: `${d.weight}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: pi * 0.08 + di * 0.02 }}
                    className={cn("flex items-center justify-center text-[8px] font-bold text-white", d.color)}
                    title={`${d.component}: ${d.weight}%`}
                  >
                    {d.weight >= 10 && d.weight}
                  </motion.div>
                ))}
              </div>
              {/* Legend */}
              <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-[8px] text-muted-foreground">
                {profile.dna.map((d) => (
                  <span key={d.component} className="flex items-center gap-0.5">
                    <span className={cn("h-1.5 w-1.5 rounded-full", d.color)} />
                    {d.component} {d.weight}%
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-3 flex items-start gap-2 rounded-lg bg-primary/[0.04] p-3">
          <Zap className="mt-0.5 h-3 w-3 shrink-0 text-primary" />
          <p className="text-[11px] leading-relaxed text-muted-foreground">
            <span className="font-medium text-foreground">Not everyone should have one score.</span>{" "}
            Each profession gets its own evidence model — engineers are measured differently than
            scientists, technicians, and managers.
          </p>
        </div>
      </div>

      {/* Capability Lifecycle */}
      <div className="rounded-2xl border border-border/60 bg-card p-6">
        <div className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary">
            <Clock className="h-4 w-4" />
          </span>
          <div>
            <h3 className="text-sm font-semibold">Capability lifecycle</h3>
            <p className="text-[11px] text-muted-foreground">Should I hire, automate, outsource, or train?</p>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          {LIFECYCLE_STAGES.map((stage, i) => {
            const action = ACTION_META[stage.actionType]
            return (
              <motion.div
                key={stage.stage}
                initial={{ opacity: 0, x: -6 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="flex items-center gap-3 rounded-xl border border-border/40 bg-secondary/20 p-2.5"
              >
                {/* Stage number */}
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-secondary text-[10px] font-bold text-muted-foreground">
                  {i + 1}
                </span>
                {/* Content */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold">{stage.stage}</span>
                    <span className="text-[9px] text-muted-foreground">· {stage.example}</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground">{stage.desc}</p>
                </div>
                {/* Action */}
                <div className={cn("shrink-0 text-right", action.color)}>
                  <action.icon className="ml-auto h-3 w-3" />
                  <span className="text-[9px] font-medium">{stage.action}</span>
                </div>
                {/* Connector */}
                {i < LIFECYCLE_STAGES.length - 1 && (
                  <div className="absolute" />
                )}
              </motion.div>
            )
          })}
        </div>

        <div className="mt-3 flex items-start gap-2 rounded-lg bg-primary/[0.04] p-3">
          <TrendingDown className="mt-0.5 h-3 w-3 shrink-0 text-primary" />
          <p className="text-[11px] leading-relaxed text-muted-foreground">
            <span className="font-medium text-foreground">Every capability moves through a lifecycle.</span>{" "}
            Businesses know whether to hire, automate, outsource, or train — based on where the
            capability sits in its evolution.
          </p>
        </div>
      </div>
    </div>
  )
}
