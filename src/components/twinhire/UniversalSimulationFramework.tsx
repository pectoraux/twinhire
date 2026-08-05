"use client";

import { motion } from "framer-motion";
import {
  Beaker,
  Bot,
  Building2,
  Code2,
  Factory,
  FlaskConical,
  GraduationCap,
  HeartPulse,
  Layers,
  Plane,
  Stethoscope,
  Wrench,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * UniversalSimulationFramework — one engine, every profession.
 *
 * The vision: "Don't build one simulator. Build a Simulation Framework.
 * Capability Genome → Simulation Blueprint → Scenario Generator →
 * Evidence Generator → Evaluator → Business Impact Model.
 * Then every capability plugs into the framework. The engine stays the
 * same. Only the blueprint changes."
 */

interface ProfessionBlueprint {
  profession: string
  icon: React.ElementType
  color: string
  simulations: string[]
  evidenceModel: { metric: string; weight: number }[]
  businessImpact: string
}

const BLUEPRINTS: ProfessionBlueprint[] = [
  {
    profession: "Software Engineer",
    icon: Code2,
    color: "text-blue-600 bg-blue-50 dark:text-blue-300 dark:bg-blue-500/10",
    simulations: ["Debug distributed system", "Build API", "Review code", "Handle production outage"],
    evidenceModel: [
      { metric: "Architecture", weight: 25 },
      { metric: "Performance", weight: 20 },
      { metric: "Testing", weight: 20 },
      { metric: "Maintainability", weight: 15 },
      { metric: "Decision making", weight: 20 },
    ],
    businessImpact: "System reliability, development velocity, technical debt reduction",
  },
  {
    profession: "Electrician",
    icon: Zap,
    color: "text-amber-600 bg-amber-50 dark:text-amber-300 dark:bg-amber-500/10",
    simulations: ["Diagnose intermittent outage", "Choose equipment", "Perform repair", "Comply with regulations"],
    evidenceModel: [
      { metric: "Safety", weight: 30 },
      { metric: "Diagnosis", weight: 25 },
      { metric: "Speed", weight: 20 },
      { metric: "Compliance", weight: 15 },
      { metric: "Documentation", weight: 10 },
    ],
    businessImpact: "Safety compliance, uptime, maintenance cost reduction",
  },
  {
    profession: "Scientist",
    icon: FlaskConical,
    color: "text-violet-600 bg-violet-50 dark:text-violet-300 dark:bg-violet-500/10",
    simulations: ["Analyze unexpected result", "Design next experiment", "Review literature", "Choose statistical method"],
    evidenceModel: [
      { metric: "Scientific reasoning", weight: 25 },
      { metric: "Experimental design", weight: 25 },
      { metric: "Statistical thinking", weight: 20 },
      { metric: "Communication", weight: 15 },
      { metric: "Reproducibility", weight: 15 },
    ],
    businessImpact: "R&D output quality, time-to-discovery, publication impact",
  },
  {
    profession: "Nurse",
    icon: HeartPulse,
    color: "text-rose-600 bg-rose-50 dark:text-rose-300 dark:bg-rose-500/10",
    simulations: ["Triage patient", "Administer medication", "Handle emergency", "Document care"],
    evidenceModel: [
      { metric: "Clinical accuracy", weight: 30 },
      { metric: "Patient safety", weight: 25 },
      { metric: "Speed", weight: 15 },
      { metric: "Communication", weight: 15 },
      { metric: "Documentation", weight: 15 },
    ],
    businessImpact: "Patient outcomes, safety incidents, care quality scores",
  },
  {
    profession: "CNC Operator",
    icon: Factory,
    color: "text-emerald-600 bg-emerald-50 dark:text-emerald-300 dark:bg-emerald-500/10",
    simulations: ["Set up machine", "Read blueprint", "Adjust tolerances", "Quality inspect"],
    evidenceModel: [
      { metric: "Precision", weight: 30 },
      { metric: "Speed", weight: 25 },
      { metric: "Safety", weight: 20 },
      { metric: "Quality", weight: 15 },
      { metric: "Maintenance", weight: 10 },
    ],
    businessImpact: "Production quality, throughput, scrap rate reduction",
  },
  {
    profession: "Procurement Manager",
    icon: Building2,
    color: "text-teal-600 bg-teal-50 dark:text-teal-300 dark:bg-teal-500/10",
    simulations: ["Negotiate contract", "Evaluate supplier", "Manage shortage", "Optimize spend"],
    evidenceModel: [
      { metric: "Negotiation", weight: 25 },
      { metric: "Analysis", weight: 25 },
      { metric: "Risk management", weight: 20 },
      { metric: "Relationship", weight: 15 },
      { metric: "Cost optimization", weight: 15 },
    ],
    businessImpact: "Cost savings, supply chain resilience, supplier quality",
  },
]

const PIPELINE = [
  { step: "Capability Genome", desc: "16-field structured definition", icon: Layers },
  { step: "Simulation Blueprint", desc: "Profession-specific scenario config", icon: Beaker },
  { step: "Scenario Generator", desc: "LLM creates realistic tasks", icon: Wrench },
  { step: "Evidence Generator", desc: "Candidate performs real work", icon: Code2 },
  { step: "Evaluator", desc: "AI scores against DNA weightings", icon: GraduationCap },
  { step: "Business Impact Model", desc: "Project ROI from demonstrated capability", icon: TrendingUp },
]

import { TrendingUp } from "lucide-react"

export function UniversalSimulationFramework({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-2xl border border-border/60 bg-card p-6", className)}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="flex items-center gap-2 text-sm font-semibold">
            <Layers className="h-4 w-4 text-primary" /> Universal simulation framework
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            One engine, every profession. The engine stays the same — only the blueprint changes. New capabilities become data, not software projects.
          </p>
        </div>
      </div>

      {/* Pipeline */}
      <div className="mt-5">
        <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
          Simulation pipeline
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          {PIPELINE.map((p, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <div className="flex items-center gap-1.5 rounded-lg border border-border/50 bg-secondary/20 px-2.5 py-1.5">
                <p.icon className="h-3 w-3 text-primary" />
                <div>
                  <div className="text-[10px] font-semibold">{p.step}</div>
                  <div className="text-[8px] text-muted-foreground">{p.desc}</div>
                </div>
              </div>
              {i < PIPELINE.length - 1 && (
                <span className="text-muted-foreground/40">→</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Profession blueprints */}
      <div className="mt-5">
        <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
          Profession blueprints ({BLUEPRINTS.length} of unlimited)
        </div>
        <div className="mt-2 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {BLUEPRINTS.map((bp, i) => (
            <motion.div
              key={bp.profession}
              initial={{ opacity: 0, y: 6 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="rounded-xl border border-border/50 bg-secondary/20 p-3"
            >
              {/* Header */}
              <div className="flex items-center gap-2">
                <span className={cn("grid h-8 w-8 place-items-center rounded-lg", bp.color)}>
                  <bp.icon className="h-4 w-4" />
                </span>
                <span className="text-sm font-semibold">{bp.profession}</span>
              </div>

              {/* Simulations */}
              <div className="mt-2">
                <div className="text-[9px] font-medium uppercase tracking-wider text-muted-foreground">Simulations</div>
                <div className="mt-1 flex flex-wrap gap-1">
                  {bp.simulations.map((sim) => (
                    <span key={sim} className="rounded-md bg-card px-1.5 py-0.5 text-[9px] border border-border/40">{sim}</span>
                  ))}
                </div>
              </div>

              {/* Evidence model */}
              <div className="mt-2">
                <div className="text-[9px] font-medium uppercase tracking-wider text-muted-foreground">Evidence model (DNA)</div>
                <div className="mt-1 flex h-4 overflow-hidden rounded">
                  {bp.evidenceModel.map((m, mi) => {
                    const colors = ["bg-primary", "bg-violet-500", "bg-emerald-500", "bg-amber-500", "bg-blue-500"]
                    return (
                      <motion.div
                        key={m.metric}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${m.weight}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: i * 0.06 + mi * 0.02 }}
                        className={cn("flex items-center justify-center text-[7px] font-bold text-white", colors[mi % colors.length])}
                        title={`${m.metric}: ${m.weight}%`}
                      >
                        {m.weight >= 15 && m.weight}
                      </motion.div>
                    )
                  })}
                </div>
                <div className="mt-0.5 flex flex-wrap gap-x-2 gap-y-0.5 text-[7px] text-muted-foreground">
                  {bp.evidenceModel.map((m, mi) => {
                    const colors = ["bg-primary", "bg-violet-500", "bg-emerald-500", "bg-amber-500", "bg-blue-500"]
                    return (
                      <span key={m.metric} className="flex items-center gap-0.5">
                        <span className={cn("h-1 w-1 rounded-full", colors[mi % colors.length])} />
                        {m.metric}
                      </span>
                    )
                  })}
                </div>
              </div>

              {/* Business impact */}
              <div className="mt-2 rounded-md bg-emerald-50/50 px-2 py-1 dark:bg-emerald-500/[0.06]">
                <span className="text-[8px] text-emerald-700 dark:text-emerald-300">{bp.businessImpact}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* The key insight */}
      <div className="mt-4 flex items-start gap-2 rounded-xl bg-gradient-to-r from-primary/[0.06] to-[oklch(0.74_0.135_70)]/[0.06] p-4">
        <Bot className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
        <div>
          <p className="text-xs font-semibold text-primary">New capabilities become data, not software projects.</p>
          <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
            Every profession — from software engineers and scientists to electricians, nurses, CNC operators,
            and procurement managers — plugs into the same framework. The blueprint defines simulations,
            evidence weightings, and business impact. The engine handles the rest.
          </p>
        </div>
      </div>
    </div>
  )
}
