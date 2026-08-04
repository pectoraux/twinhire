"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  Layers,
  Network,
  Sparkles,
  TrendingUp,
  User,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { ScoreBar, CountUp } from "./primitives";
import { cn } from "@/lib/utils";
import type { CandidateView } from "@/lib/twinhire/types";

/**
 * CandidateProfilePanel — the candidate's capability graph as a first-class
 * interactive surface.
 *
 * The vision: "Every candidate owns a professional capability graph" — not a
 * resume. This panel makes the graph explorable: each domain expands to show
 * its level, confidence, and what evidence backs it.
 */

const DOMAIN_META: Record<string, { color: string; icon: React.ElementType }> = {
  "Lifecycle & Activation Growth": { color: "oklch(0.52 0.11 165)", icon: TrendingUp },
  "Operations & Process Design": { color: "oklch(0.74 0.135 70)", icon: Layers },
  "Data & Analytics Modeling": { color: "oklch(0.6 0.09 200)", icon: Network },
  "Product Strategy": { color: "oklch(0.62 0.16 350)", icon: Sparkles },
  "Technical Writing / SOPs": { color: "oklch(0.68 0.13 140)", icon: User },
  "AI Leverage & Automation": { color: "oklch(0.72 0.12 165)", icon: Zap },
};

export function CandidateProfilePanel({
  candidate,
  sessionCount,
}: {
  candidate: CandidateView;
  sessionCount: number;
}) {
  const [expanded, setExpanded] = useState<string | null>(
    candidate.capabilityGraph[0]?.domain ?? null,
  );

  const avgConfidence = candidate.capabilityGraph.length > 0
    ? Math.round(
        candidate.capabilityGraph.reduce((a, c) => a + c.confidence, 0) /
          candidate.capabilityGraph.length,
      )
    : 0;

  return (
    <div className="rounded-2xl border border-border/60 bg-card p-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="flex items-center gap-2 text-sm font-semibold">
            <Network className="h-4 w-4 text-primary" /> Candidate capability graph
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Not a résumé — a continuously evolving graph. Click a domain to inspect evidence-backed confidence.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-center">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Reputation</div>
            <div className="font-display text-xl text-primary">
              <CountUp value={candidate.reputation} />
            </div>
          </div>
          <div className="h-8 w-px bg-border" />
          <div className="text-center">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Sessions</div>
            <div className="font-display text-xl">{sessionCount}</div>
          </div>
          <div className="h-8 w-px bg-border" />
          <div className="text-center">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Avg confidence</div>
            <div className="font-display text-xl">{avgConfidence}%</div>
          </div>
        </div>
      </div>

      {/* Identity row */}
      <div className="mt-4 flex flex-wrap items-center gap-2 rounded-xl bg-secondary/40 p-3">
        <span className="grid h-9 w-9 place-items-center rounded-full bg-primary text-primary-foreground font-display text-sm">
          {candidate.displayName.charAt(0)}
        </span>
        <div>
          <div className="text-sm font-semibold">{candidate.displayName}</div>
          <div className="text-[11px] text-muted-foreground">{candidate.handle} · {candidate.headline}</div>
        </div>
        <div className="ml-auto flex flex-wrap gap-1.5">
          {candidate.profile.preferredStack.slice(0, 4).map((s) => (
            <Badge key={s} variant="outline" className="rounded-md font-mono text-[10px]">{s}</Badge>
          ))}
        </div>
      </div>

      {/* Capability domains */}
      <div className="mt-4 space-y-2">
        {candidate.capabilityGraph.map((node, i) => {
          const meta = DOMAIN_META[node.domain] ?? { color: "oklch(0.5 0.01 95)", icon: User };
          const isExpanded = expanded === node.domain;
          return (
            <motion.div
              key={node.domain}
              initial={{ opacity: 0, y: 6 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className={cn(
                "overflow-hidden rounded-xl border transition-colors",
                isExpanded ? "border-primary/30 bg-primary/[0.02]" : "border-border/50 bg-secondary/20",
              )}
            >
              <button
                onClick={() => setExpanded(isExpanded ? null : node.domain)}
                className="flex w-full items-center gap-3 p-3 text-left"
              >
                <span
                  className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-white"
                  style={{ background: meta.color }}
                >
                  <meta.icon className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium truncate">{node.domain}</span>
                    <Badge variant="outline" className="rounded-md text-[10px] font-mono">L{node.level}</Badge>
                  </div>
                  <div className="mt-1.5 flex items-center gap-2">
                    <ScoreBar
                      value={node.confidence}
                      tone={node.confidence >= 75 ? "primary" : "accent"}
                      className="flex-1"
                      delay={i * 0.05}
                    />
                    <span className="w-10 text-right font-mono text-[11px] text-muted-foreground">
                      {node.confidence}%
                    </span>
                  </div>
                </div>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 shrink-0 text-muted-foreground transition-transform",
                    isExpanded && "rotate-180",
                  )}
                />
              </button>

              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="border-t border-border/40 px-3 py-3">
                      <div className="grid gap-3 sm:grid-cols-3">
                        <DomainStat label="Proficiency level" value={`Level ${node.level} / 5`} sub={levelLabel(node.level)} />
                        <DomainStat label="Confidence" value={`${node.confidence}%`} sub={confidenceLabel(node.confidence)} />
                        <DomainStat
                          label="Evidence basis"
                          value={`${Math.max(1, Math.round(node.confidence / 20))} sessions`}
                          sub="observed work"
                        />
                      </div>
                      <div className="mt-3 rounded-lg bg-secondary/40 p-2.5 text-xs text-muted-foreground">
                        <span className="font-medium text-foreground">How this is scored:</span> confidence
                        rises with each observed session that exercises this domain. Level reflects
                        demonstrated depth — not self-reported. The graph updates automatically as new
                        evidence arrives.
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Profile meta */}
      <div className="mt-4 grid gap-2 text-xs sm:grid-cols-2">
        <MetaRow label="Availability" value={candidate.profile.availability} />
        <MetaRow label="Languages" value={candidate.profile.languages.join(", ")} />
        <MetaRow label="AI leverage" value={candidate.profile.aiLeverage} />
        <MetaRow label="Work style" value={candidate.profile.workStyle} />
      </div>
    </div>
  );
}

function DomainStat({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="rounded-lg bg-secondary/40 p-2.5">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-0.5 text-sm font-semibold">{value}</div>
      <div className="text-[10px] text-muted-foreground">{sub}</div>
    </div>
  );
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-2 rounded-lg bg-secondary/30 px-3 py-2">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium">{value}</span>
    </div>
  );
}

function levelLabel(level: number): string {
  return ["", "Foundational", "Developing", "Capable", "Strong", "Expert"][level] ?? "Capable";
}

function confidenceLabel(c: number): string {
  if (c >= 80) return "high — well-evidenced";
  if (c >= 65) return "moderate — growing";
  return "early — needs more sessions";
}
