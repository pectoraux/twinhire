"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain,
  CheckCircle2,
  ChevronDown,
  Cpu,
  Database,
  DollarSign,
  Dna,
  Factory,
  GraduationCap,
  Loader2,
  Network,
  Search,
  Sparkles,
  TrendingUp,
  Users,
  Wrench,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

/**
 * CapabilityGenomeViewer — the core intellectual property of the platform.
 *
 * Every capability has a structured 16-field genome. This viewer lets
 * anyone explore the full definition: knowledge, skills, behaviors,
 * decision patterns, tools, AI leverage, evidence requirements,
 * business outcomes, salary impact, automation risk, learning paths.
 *
 * Everything in the platform revolves around this genome.
 */

const QUICK_CAPABILITIES = [
  "AI Agent Design",
  "Demand Forecasting",
  "Process Automation Engineering",
  "Revenue Operations",
  "Customer Onboarding Optimization",
  "Churn Prediction",
]

interface Genome {
  id: string
  name: string
  category: string
  contributesTo: string[]
  improvesKpis: string[]
  industries: string[]
  prerequisites: string[]
  complementary: string[]
  salaryPremium: string
  demandTrend: number
  automationRisk: number
  aiAugmentation: string
  projectedRoi: string
  knowledge: string[]
  skills: string[]
  behaviors: string[]
  tools: string[]
  evidenceRequirements: string[]
  learningPaths: string[]
}

export function CapabilityGenomeViewer({ className }: { className?: string }) {
  const [capability, setCapability] = useState("")
  const [genome, setGenome] = useState<Genome | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [expanded, setExpanded] = useState<string | null>("knowledge")

  const analyze = async (cap?: string) => {
    const target = cap ?? capability
    if (!target.trim()) return
    setCapability(target)
    setLoading(true)
    setError("")
    setGenome(null)
    try {
      const res = await fetch("/api/twinhire/capability-genome", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ capability: target }),
      })
      if (!res.ok) throw new Error("failed")
      const data = await res.json()
      setGenome(data.genome)
    } catch {
      setError("Genome generation failed — try again")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={cn("rounded-2xl border border-border/60 bg-card p-6", className)}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="flex items-center gap-2 text-sm font-semibold">
            <Dna className="h-4 w-4 text-primary" /> Capability genome
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            The structured 16-field definition of every capability. The platform&apos;s core intellectual property.
          </p>
        </div>
        {genome && (
          <Badge className="rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
            <Sparkles className="mr-1 h-2.5 w-2.5" /> AI-generated
          </Badge>
        )}
      </div>

      {/* Input */}
      <div className="mt-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={capability}
            onChange={(e) => setCapability(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && analyze()}
            placeholder="Enter any capability to generate its genome..."
            className="h-10 flex-1 rounded-xl border border-border/60 bg-background px-3 text-sm outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/15"
          />
          <Button onClick={() => analyze()} disabled={loading || !capability.trim()} className="h-10 gap-1.5 rounded-xl px-4">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Dna className="h-4 w-4" />}
            {loading ? "Sequencing…" : "Generate genome"}
          </Button>
        </div>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {QUICK_CAPABILITIES.map((cap) => (
            <button
              key={cap}
              onClick={() => analyze(cap)}
              disabled={loading}
              className="rounded-full border border-border/60 bg-secondary/30 px-2.5 py-1 text-[10px] font-medium text-muted-foreground transition-colors hover:border-primary/30 hover:bg-primary/[0.04] hover:text-foreground"
            >
              {cap}
            </button>
          ))}
        </div>
      </div>

      {error && <p className="mt-2 text-xs text-rose-600">{error}</p>}

      {/* Genome result */}
      <AnimatePresence>
        {genome && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-5"
          >
            {/* Header */}
            <div className="rounded-xl border border-primary/20 bg-primary/[0.04] p-4">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="rounded-md text-[10px]">{genome.category}</Badge>
                <span className="font-mono text-[10px] text-muted-foreground">{genome.id}</span>
              </div>
              <h4 className="mt-1.5 font-display text-lg">{genome.name}</h4>
              <p className="mt-1 text-xs text-primary">{genome.projectedRoi}</p>
            </div>

            {/* Key metrics */}
            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
              <MetricCard icon={DollarSign} label="Salary premium" value={genome.salaryPremium} tone="amber" />
              <MetricCard icon={TrendingUp} label="Demand trend" value={`+${genome.demandTrend}%`} tone="emerald" />
              <MetricCard
                icon={Cpu}
                label="Automation risk"
                value={`${genome.automationRisk}%`}
                tone={genome.automationRisk > 50 ? "rose" : "neutral"}
              />
              <MetricCard icon={Zap} label="AI augmentation" value={genome.automationRisk < 50 ? "High" : "Medium"} tone="violet" />
            </div>

            {/* AI augmentation */}
            <div className="mt-3 rounded-xl border border-violet-200/50 bg-violet-50/30 p-3 dark:border-violet-500/20 dark:bg-violet-500/[0.06]">
              <div className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-wider text-violet-700 dark:text-violet-300">
                <Brain className="h-3 w-3" /> AI augmentation opportunity
              </div>
              <p className="mt-1 text-xs leading-relaxed text-foreground/80">{genome.aiAugmentation}</p>
            </div>

            {/* Expandable genome sections */}
            <div className="mt-4 space-y-1.5">
              <GenomeSection
                title="Knowledge areas"
                icon={Database}
                items={genome.knowledge}
                expanded={expanded === "knowledge"}
                onToggle={() => setExpanded(expanded === "knowledge" ? null : "knowledge")}
              />
              <GenomeSection
                title="Skills required"
                icon={Wrench}
                items={genome.skills}
                expanded={expanded === "skills"}
                onToggle={() => setExpanded(expanded === "skills" ? null : "skills")}
              />
              <GenomeSection
                title="Expected behaviors"
                icon={Users}
                items={genome.behaviors}
                expanded={expanded === "behaviors"}
                onToggle={() => setExpanded(expanded === "behaviors" ? null : "behaviors")}
              />
              <GenomeSection
                title="Tools commonly used"
                icon={Cpu}
                items={genome.tools}
                expanded={expanded === "tools"}
                onToggle={() => setExpanded(expanded === "tools" ? null : "tools")}
                badges
              />
              <GenomeSection
                title="Evidence requirements"
                icon={CheckCircle2}
                items={genome.evidenceRequirements}
                expanded={expanded === "evidence"}
                onToggle={() => setExpanded(expanded === "evidence" ? null : "evidence")}
                checkmarks
              />
              <GenomeSection
                title="Learning paths"
                icon={GraduationCap}
                items={genome.learningPaths}
                expanded={expanded === "learning"}
                onToggle={() => setExpanded(expanded === "learning" ? null : "learning")}
              />
              <GenomeSection
                title="Contributes to"
                icon={TrendingUp}
                items={genome.contributesTo}
                expanded={expanded === "contributes"}
                onToggle={() => setExpanded(expanded === "contributes" ? null : "contributes")}
                badges
              />
              <GenomeSection
                title="Improves KPIs"
                icon={TrendingUp}
                items={genome.improvesKpis}
                expanded={expanded === "kpis"}
                onToggle={() => setExpanded(expanded === "kpis" ? null : "kpis")}
                badges
              />
              <GenomeSection
                title="Industries where it matters"
                icon={Factory}
                items={genome.industries}
                expanded={expanded === "industries"}
                onToggle={() => setExpanded(expanded === "industries" ? null : "industries")}
                badges
              />
              <GenomeSection
                title="Prerequisite capabilities"
                icon={Network}
                items={genome.prerequisites}
                expanded={expanded === "prereqs"}
                onToggle={() => setExpanded(expanded === "prereqs" ? null : "prereqs")}
              />
              <GenomeSection
                title="Complementary capabilities"
                icon={Network}
                items={genome.complementary}
                expanded={expanded === "complementary"}
                onToggle={() => setExpanded(expanded === "complementary" ? null : "complementary")}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function MetricCard({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: React.ElementType
  label: string
  value: string
  tone: "emerald" | "amber" | "rose" | "violet" | "neutral"
}) {
  const toneCls = {
    emerald: "text-emerald-700 bg-emerald-50 dark:text-emerald-300 dark:bg-emerald-500/10",
    amber: "text-amber-700 bg-amber-50 dark:text-amber-300 dark:bg-amber-500/10",
    rose: "text-rose-700 bg-rose-50 dark:text-rose-300 dark:bg-rose-500/10",
    violet: "text-violet-700 bg-violet-50 dark:text-violet-300 dark:bg-violet-500/10",
    neutral: "text-muted-foreground bg-secondary",
  }[tone]
  return (
    <div className={cn("rounded-lg p-2.5 text-center", toneCls)}>
      <Icon className="mx-auto h-3 w-3" />
      <div className="mt-1 text-xs font-bold">{value}</div>
      <div className="text-[8px] uppercase tracking-wider opacity-80">{label}</div>
    </div>
  )
}

function GenomeSection({
  title,
  icon: Icon,
  items,
  expanded,
  onToggle,
  badges,
  checkmarks,
}: {
  title: string
  icon: React.ElementType
  items: string[]
  expanded: boolean
  onToggle: () => void
  badges?: boolean
  checkmarks?: boolean
}) {
  if (!items || items.length === 0) return null
  return (
    <div className="overflow-hidden rounded-xl border border-border/40">
      <button
        onClick={onToggle}
        className="flex w-full items-center gap-2 px-3 py-2 text-left transition-colors hover:bg-secondary/30"
      >
        <Icon className="h-3.5 w-3.5 shrink-0 text-primary" />
        <span className="flex-1 text-xs font-medium">{title}</span>
        <span className="text-[9px] text-muted-foreground">{items.length}</span>
        <ChevronDown className={cn("h-3.5 w-3.5 text-muted-foreground transition-transform", expanded && "rotate-180")} />
      </button>
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-3 pb-3">
              {badges ? (
                <div className="flex flex-wrap gap-1">
                  {items.map((item, i) => (
                    <Badge key={i} variant="outline" className="rounded-md text-[10px]">{item}</Badge>
                  ))}
                </div>
              ) : (
                <ul className="space-y-1">
                  {items.map((item, i) => (
                    <li key={i} className="flex items-start gap-1.5 text-[11px] text-muted-foreground">
                      {checkmarks && <CheckCircle2 className="mt-0.5 h-2.5 w-2.5 shrink-0 text-emerald-500" />}
                      {!checkmarks && <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary/40" />}
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
