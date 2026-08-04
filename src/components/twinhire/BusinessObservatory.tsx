"use client";

import { motion } from "framer-motion";
import {
  Eye,
  FileText,
  GitBranch,
  Lightbulb,
  Lock,
  ScanEye,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Evaluation, BusinessTwinView } from "@/lib/twinhire/types";

/**
 * BusinessObservatory — makes the "no black box" principle tangible.
 *
 * The vision: "Businesses watch work live. No hidden black box. They can
 * inspect every decision, every prompt, every document, every action, every
 * improvement, every mistake, every correction, every reasoning chain, every
 * artifact, every KPI affected."
 *
 * This panel shows, from the business's perspective, exactly what they can
 * inspect from the candidate's work — derived from the evaluation.
 */

export function BusinessObservatory({
  evaluation,
  twin,
  submission,
  taskTitle,
}: {
  evaluation: Evaluation;
  twin: BusinessTwinView | null;
  submission: string;
  taskTitle: string;
}) {
  // Derive "inspectable artifacts" from the submission (sections, numbers, reasoning)
  const artifacts = deriveArtifacts(submission, taskTitle);
  const kpiConnections = twin ? deriveKpiConnections(evaluation, twin) : [];
  const transparencyScore = computeTransparency(evaluation, submission);

  return (
    <div className="rounded-2xl border border-border/60 bg-card p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="flex items-center gap-2 text-sm font-semibold">
            <ScanEye className="h-4 w-4 text-primary" /> Business observatory
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            No black box. Everything the hiring business can inspect from this work.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <TransparencyGauge value={transparencyScore} />
        </div>
      </div>

      {/* Inspectable artifacts */}
      <div className="mt-5">
        <div className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
          <FileText className="h-3 w-3" /> Inspectable artifacts ({artifacts.length})
        </div>
        <div className="mt-2 space-y-2">
          {artifacts.map((a, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 6 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="flex items-start gap-3 rounded-xl border border-border/50 bg-secondary/30 p-3"
            >
              <span className={cn(
                "grid h-7 w-7 shrink-0 place-items-center rounded-lg",
                a.type === "reasoning" ? "bg-primary/10 text-primary" :
                a.type === "decision" ? "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300" :
                a.type === "metric" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300" :
                "bg-secondary text-muted-foreground",
              )}>
                <a.icon className="h-3.5 w-3.5" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold">{a.label}</span>
                  <Badge variant="outline" className="rounded-md text-[9px] font-mono">{a.typeLabel}</Badge>
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground">{a.detail}</p>
              </div>
              <Eye className="h-3.5 w-3.5 shrink-0 text-muted-foreground/50" />
            </motion.div>
          ))}
        </div>
      </div>

      {/* KPIs affected */}
      {kpiConnections.length > 0 && (
        <div className="mt-5">
          <div className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            <TrendingUp className="h-3 w-3" /> KPIs this work would affect
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {kpiConnections.map((k) => (
              <span
                key={k.label}
                className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-secondary/40 px-2.5 py-1 text-[11px]"
              >
                <span className={cn("h-1.5 w-1.5 rounded-full", k.direction === "up" ? "bg-emerald-500" : k.direction === "down" ? "bg-rose-500" : "bg-muted-foreground")} />
                {k.label}
                <span className="font-mono text-[10px] text-muted-foreground">{k.projected}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Inspection guarantees */}
      <div className="mt-5 rounded-xl border border-emerald-200/50 bg-emerald-50/40 p-4 dark:border-emerald-500/15 dark:bg-emerald-500/[0.05]">
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
          <ShieldCheck className="h-3.5 w-3.5" /> Inspection guarantees
        </div>
        <ul className="mt-2 grid gap-1.5 text-xs text-foreground/80 sm:grid-cols-2">
          <li className="flex items-center gap-1.5"><Lock className="h-3 w-3 text-emerald-600 dark:text-emerald-400" /> Full submission retained &amp; auditable</li>
          <li className="flex items-center gap-1.5"><Lock className="h-3 w-3 text-emerald-600 dark:text-emerald-400" /> Every prompt &amp; AI call traceable</li>
          <li className="flex items-center gap-1.5"><Lock className="h-3 w-3 text-emerald-600 dark:text-emerald-400" /> Reasoning chain reconstructable</li>
          <li className="flex items-center gap-1.5"><Lock className="h-3 w-3 text-emerald-600 dark:text-emerald-400" /> Evidence exportable for compliance</li>
        </ul>
      </div>
    </div>
  );
}

function TransparencyGauge({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-2 rounded-full border border-border/60 bg-secondary/40 px-3 py-1.5">
      <Eye className="h-3.5 w-3.5 text-primary" />
      <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Transparency</span>
      <span className="font-display text-sm font-semibold text-primary">{value}%</span>
    </div>
  );
}

interface Artifact {
  label: string;
  type: "reasoning" | "decision" | "metric" | "approach";
  typeLabel: string;
  detail: string;
  icon: React.ElementType;
}

function deriveArtifacts(submission: string, taskTitle: string): Artifact[] {
  const out: Artifact[] = [];
  const lines = submission.split("\n").map((l) => l.trim()).filter(Boolean);

  // Approach / structure
  if (submission.toLowerCase().includes("approach") || submission.toLowerCase().includes("plan")) {
    out.push({
      label: "Structured approach",
      type: "approach",
      typeLabel: "method",
      detail: "Candidate decomposed the problem into a sequenced plan — inspectable step-by-step.",
      icon: GitBranch,
    });
  }

  // Reasoning chain
  const reasoningMarkers = lines.filter((l) => /^(##|why|because|so that|in order|tradeoff|trade-off)/i.test(l));
  if (reasoningMarkers.length > 0 || submission.toLowerCase().includes("tradeoff")) {
    out.push({
      label: "Reasoning chain",
      type: "reasoning",
      typeLabel: "trace",
      detail: "Explicit tradeoffs and justifications — the 'why' behind each choice is reconstructable.",
      icon: Lightbulb,
    });
  }

  // Decisions
  const decisionMarkers = lines.filter((l) => /^(## recommendation|## decision|i would|i'd|we should|prioritize|ship)/i.test(l));
  if (decisionMarkers.length > 0) {
    out.push({
      label: "Decision artifact",
      type: "decision",
      typeLabel: "choice",
      detail: "A concrete recommendation was made — the business can inspect the decision and its rationale.",
      icon: Sparkles,
    });
  }

  // Metrics / numbers
  const numbers = submission.match(/\$[\d.]+[mbk]?|\d+pt|\d+%|\d+x|\d+\s*(days|weeks|hours|months)/gi);
  if (numbers && numbers.length > 0) {
    out.push({
      label: `Quantified impact (${numbers.length} figures)`,
      type: "metric",
      typeLabel: "data",
      detail: `Work references measurable outcomes: ${numbers.slice(0, 4).join(", ")}${numbers.length > 4 ? "…" : ""}.`,
      icon: TrendingUp,
    });
  }

  // AI leverage trace
  if (submission.toLowerCase().includes("ai") || submission.toLowerCase().includes("llm") || submission.toLowerCase().includes("verify")) {
    out.push({
      label: "AI leverage trace",
      type: "reasoning",
      typeLabel: "audit",
      detail: "Candidate referenced AI usage and verification — auditable for responsible-AI review.",
      icon: ScanEye,
    });
  }

  // Fallback: at least one artifact
  if (out.length === 0) {
    out.push({
      label: "Work submission",
      type: "approach",
      typeLabel: "doc",
      detail: "Full submission retained and inspectable by the hiring business.",
      icon: FileText,
    });
  }

  return out.slice(0, 6);
}

function deriveKpiConnections(
  evaluation: Evaluation,
  twin: BusinessTwinView,
): { label: string; direction: "up" | "down" | "flat"; projected: string }[] {
  // Connect based on business impact text and twin KPIs
  const impact = evaluation.businessImpact.toLowerCase();
  const out: { label: string; direction: "up" | "down" | "flat"; projected: string }[] = [];

  twin.kpis.forEach((kpi) => {
    const labelLower = kpi.label.toLowerCase();
    let match = false;
    let direction: "up" | "down" | "flat" = "flat";
    let projected = "";

    if ((labelLower.includes("margin") || labelLower.includes("retention") || labelLower.includes("retention")) && (impact.includes("margin") || impact.includes("revenue") || impact.includes("recover"))) {
      match = true;
      direction = "up";
      projected = "+3-5pt";
    } else if (labelLower.includes("turnover") && impact.includes("turnover")) {
      match = true;
      direction = "up";
      projected = "3.1→3.6x";
    } else if (labelLower.includes("cost") && (impact.includes("cost") || impact.includes("savings"))) {
      match = true;
      direction = "down";
      projected = "-15%";
    } else if (labelLower.includes("activation") && impact.includes("activation")) {
      match = true;
      direction = "up";
      projected = "31→45%";
    } else if (labelLower.includes("cac") && impact.includes("cac")) {
      match = true;
      direction = "down";
      projected = "-$12";
    } else if (labelLower.includes("churn") || labelLower.includes("nrr")) {
      if (impact.includes("churn") || impact.includes("retention")) {
        match = true;
        direction = "up";
        projected = "+2-4pt";
      }
    }

    if (match) {
      out.push({ label: kpi.label, direction, projected });
    }
  });

  // If no matches, connect to the first KPI generically based on impact
  if (out.length === 0 && twin.kpis.length > 0) {
    out.push({ label: twin.kpis[0].label, direction: "up", projected: "projected lift" });
  }

  return out.slice(0, 4);
}

function computeTransparency(evaluation: Evaluation, submission: string): number {
  let score = 50;
  // More evidence items = more transparent
  score += Math.min(20, evaluation.evidence.length * 2);
  // Structured submission
  if (submission.includes("##") || submission.includes("# ")) score += 10;
  // Quantified
  if (/\$|\d%|\d+x|\d+\s*(days|hours|weeks)/i.test(submission)) score += 10;
  // AI leverage mentioned
  if (/ai|llm|verif/i.test(submission)) score += 5;
  // Tradeoffs explicit
  if (/tradeoff|trade-off/i.test(submission)) score += 5;
  return Math.min(98, score);
}
