"use client";

import { motion } from "framer-motion";
import { Building2, Dna, Gauge, User } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * CompanyDNA + CandidateDNA — structured representations of
 * organizational operating characteristics and individual working styles.
 *
 * Every recommendation should be conditioned on Company DNA.
 * The platform can explain WHY someone succeeds in one environment and not another.
 */

// Company DNA dimensions
const COMPANY_DIMENSIONS = [
  { name: "Innovation Speed", value: 68, benchmark: 55, desc: "How quickly new ideas move to production" },
  { name: "Operational Maturity", value: 72, benchmark: 60, desc: "Process discipline and systemization" },
  { name: "Regulatory Complexity", value: 45, benchmark: 40, desc: "Compliance burden and oversight" },
  { name: "Process Discipline", value: 61, benchmark: 58, desc: "Adherence to defined workflows" },
  { name: "Customer Intimacy", value: 78, benchmark: 50, desc: "Depth of customer understanding" },
  { name: "Technical Sophistication", value: 64, benchmark: 52, desc: "Tooling, automation, data maturity" },
  { name: "Automation Readiness", value: 42, benchmark: 48, desc: "How prepared for AI/automation adoption" },
  { name: "Experimentation Culture", value: 55, benchmark: 45, desc: "Willingness to test and iterate" },
  { name: "Execution Quality", value: 70, benchmark: 58, desc: "Track record of delivering on plans" },
  { name: "Decision Latency", value: 38, benchmark: 50, desc: "Speed of decision-making (lower = faster)" },
]

// Candidate DNA dimensions (operating characteristics, not personality)
const CANDIDATE_DIMENSIONS = [
  { name: "Ambiguity Tolerance", value: 88, desc: "Thrives in undefined situations" },
  { name: "Systems Thinking", value: 82, desc: "Sees how parts connect to wholes" },
  { name: "Craftsmanship", value: 75, desc: "Pursues quality and detail" },
  { name: "Experimentation", value: 85, desc: "Tests hypotheses before committing" },
  { name: "Collaboration", value: 79, desc: "Works effectively across teams" },
  { name: "Learning Velocity", value: 91, desc: "Speed of acquiring new capabilities" },
  { name: "Ownership", value: 86, desc: "Takes responsibility for outcomes" },
  { name: "Resilience", value: 73, desc: "Recovers from setbacks" },
  { name: "Curiosity", value: 89, desc: "Explores beyond the assigned scope" },
  { name: "Communication", value: 81, desc: "Transmits complex ideas clearly" },
]

export function CompanyAndCandidateDNA({ className }: { className?: string }) {
  return (
    <div className={cn("grid gap-6 lg:grid-cols-2", className)}>
      {/* Company DNA */}
      <div className="rounded-2xl border border-border/60 bg-card p-6">
        <div className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary">
            <Building2 className="h-4 w-4" />
          </span>
          <div>
            <h3 className="text-sm font-semibold">Company DNA</h3>
            <p className="text-[11px] text-muted-foreground">Organizational operating characteristics</p>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          {COMPANY_DIMENSIONS.map((dim, i) => {
            const aboveBenchmark = dim.name === "Decision Latency" ? dim.value < dim.benchmark : dim.value > dim.benchmark
            return (
              <motion.div
                key={dim.name}
                initial={{ opacity: 0, x: -6 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
              >
                <div className="flex items-baseline justify-between">
                  <span className="text-xs font-medium">{dim.name}</span>
                  <span className={cn(
                    "font-mono text-xs font-semibold",
                    aboveBenchmark ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400",
                  )}>{dim.value}</span>
                </div>
                {/* Dual bar: company value + benchmark */}
                <div className="relative mt-0.5 h-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="h-1 w-full rounded-full bg-muted" style={{ width: "100%" }} />
                    <div className="absolute h-0.5 w-full rounded-full bg-muted-foreground/30" />
                  </div>
                  <motion.div
                    className={cn("absolute h-1.5 rounded-full", aboveBenchmark ? "bg-primary" : "bg-rose-500")}
                    initial={{ width: 0 }}
                    whileInView={{ width: `${dim.value}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: i * 0.04 }}
                  />
                  {/* Benchmark marker */}
                  <div
                    className="absolute top-1/2 h-3 w-0.5 -translate-y-1/2 rounded-full bg-foreground/40"
                    style={{ left: `${dim.benchmark}%` }}
                  />
                </div>
                <div className="mt-0.5 flex justify-between text-[8px] text-muted-foreground">
                  <span>{dim.desc}</span>
                  <span>benchmark: {dim.benchmark}</span>
                </div>
              </motion.div>
            )
          })}
        </div>

        <div className="mt-3 flex items-start gap-2 rounded-lg bg-primary/[0.04] p-3">
          <Dna className="mt-0.5 h-3 w-3 shrink-0 text-primary" />
          <p className="text-[11px] leading-relaxed text-muted-foreground">
            <span className="font-medium text-foreground">Every recommendation is conditioned on Company DNA.</span>{" "}
            A company with low Automation Readiness needs a different capability recipe than one with high readiness.
          </p>
        </div>
      </div>

      {/* Candidate DNA */}
      <div className="rounded-2xl border border-border/60 bg-card p-6">
        <div className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary">
            <User className="h-4 w-4" />
          </span>
          <div>
            <h3 className="text-sm font-semibold">Candidate DNA</h3>
            <p className="text-[11px] text-muted-foreground">Operating characteristics — not personality</p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          {CANDIDATE_DIMENSIONS.map((dim, i) => (
            <motion.div
              key={dim.name}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              className="rounded-xl border border-border/40 bg-secondary/20 p-2.5"
            >
              <div className="flex items-baseline justify-between">
                <span className="text-[10px] font-medium">{dim.name}</span>
                <span className={cn(
                  "font-mono text-xs font-bold",
                  dim.value >= 85 ? "text-emerald-600 dark:text-emerald-400" :
                  dim.value >= 75 ? "text-primary" : "text-amber-600 dark:text-amber-400",
                )}>{dim.value}</span>
              </div>
              <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-muted">
                <motion.div
                  className={cn("h-full rounded-full", dim.value >= 85 ? "bg-emerald-500" : dim.value >= 75 ? "bg-primary" : "bg-amber-500")}
                  initial={{ width: 0 }}
                  whileInView={{ width: `${dim.value}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.04 }}
                />
              </div>
              <div className="mt-0.5 text-[8px] text-muted-foreground">{dim.desc}</div>
            </motion.div>
          ))}
        </div>

        <div className="mt-3 flex items-start gap-2 rounded-lg bg-primary/[0.04] p-3">
          <Gauge className="mt-0.5 h-3 w-3 shrink-0 text-primary" />
          <p className="text-[11px] leading-relaxed text-muted-foreground">
            <span className="font-medium text-foreground">Why someone succeeds in one environment and not another.</span>{" "}
            High ambiguity tolerance + high learning velocity fits a startup. High process discipline + high execution quality fits an enterprise.
          </p>
        </div>
      </div>
    </div>
  )
}
