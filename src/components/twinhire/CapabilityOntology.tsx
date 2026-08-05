"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  GitBranch,
  Layers,
  Network,
  TrendingDown,
  TrendingUp,
  Wrench,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * CapabilityOntology — the world's capability relationship graph.
 *
 * Every capability has relationships: requires, supports, improves, reduces.
 * Everything becomes connected. This is the shared language of the platform.
 */

interface OntologyNode {
  name: string
  type: "capability" | "outcome" | "industry"
}

interface OntologyEdge {
  from: string
  to: string
  relation: "requires" | "supports" | "improves" | "reduces"
}

const NODES: OntologyNode[] = [
  { name: "Industrial Automation", type: "capability" },
  { name: "PLC Programming", type: "capability" },
  { name: "Electrical Engineering", type: "capability" },
  { name: "Manufacturing", type: "industry" },
  { name: "OEE", type: "outcome" },
  { name: "Yield", type: "outcome" },
  { name: "Downtime", type: "outcome" },
  { name: "Machine Vision", type: "capability" },
  { name: "Predictive Maintenance", type: "capability" },
  { name: "Data Analysis", type: "capability" },
]

const EDGES: OntologyEdge[] = [
  { from: "Industrial Automation", to: "PLC Programming", relation: "requires" },
  { from: "PLC Programming", to: "Electrical Engineering", relation: "requires" },
  { from: "Industrial Automation", to: "Manufacturing", relation: "supports" },
  { from: "Industrial Automation", to: "OEE", relation: "improves" },
  { from: "Industrial Automation", to: "Yield", relation: "improves" },
  { from: "Industrial Automation", to: "Downtime", relation: "reduces" },
  { from: "Machine Vision", to: "Industrial Automation", relation: "supports" },
  { from: "Predictive Maintenance", to: "Industrial Automation", relation: "supports" },
  { from: "Predictive Maintenance", to: "Downtime", relation: "reduces" },
  { from: "Data Analysis", to: "Predictive Maintenance", relation: "requires" },
  { from: "Machine Vision", to: "Quality Inspection", relation: "supports" },
]

const RELATION_META: Record<string, { color: string; label: string; icon: React.ElementType }> = {
  requires: { color: "text-amber-600 dark:text-amber-400", label: "requires", icon: Wrench },
  supports: { color: "text-violet-600 dark:text-violet-400", label: "supports", icon: GitBranch },
  improves: { color: "text-emerald-600 dark:text-emerald-400", label: "improves", icon: TrendingUp },
  reduces: { color: "text-rose-600 dark:text-rose-400", label: "reduces", icon: TrendingDown },
}

const NODE_TYPE_META: Record<string, { color: string; label: string }> = {
  capability: { color: "bg-primary text-primary-foreground", label: "Capability" },
  outcome: { color: "bg-emerald-500 text-white", label: "Outcome" },
  industry: { color: "bg-violet-500 text-white", label: "Industry" },
}

// Add the missing node
NODES.push({ name: "Quality Inspection", type: "outcome" })

export function CapabilityOntology({ className }: { className?: string }) {
  // Group edges by source node for display
  const grouped = NODES.map((node) => {
    const outEdges = EDGES.filter((e) => e.from === node.name)
    return { node, edges: outEdges }
  }).filter((g) => g.edges.length > 0)

  return (
    <div className={cn("rounded-2xl border border-border/60 bg-card p-6", className)}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="flex items-center gap-2 text-sm font-semibold">
            <Network className="h-4 w-4 text-primary" /> Capability ontology
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Every capability has relationships. Everything becomes connected. This is the shared language of the platform.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          {Object.entries(RELATION_META).map(([key, meta]) => (
            <span key={key} className={cn("flex items-center gap-1 text-[9px]", meta.color)}>
              <meta.icon className="h-2.5 w-2.5" /> {meta.label}
            </span>
          ))}
        </div>
      </div>

      {/* Ontology graph */}
      <div className="mt-5 space-y-2">
        {grouped.map(({ node, edges }, i) => {
          const nodeMeta = NODE_TYPE_META[node.type] ?? NODE_TYPE_META.capability
          return (
            <motion.div
              key={node.name}
              initial={{ opacity: 0, x: -6 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              className="rounded-xl border border-border/50 bg-secondary/20 p-3"
            >
              <div className="flex items-center gap-2">
                <span className={cn("grid h-7 w-7 place-items-center rounded-lg text-[10px] font-bold", nodeMeta.color)}>
                  {node.name.charAt(0)}
                </span>
                <div className="flex-1">
                  <span className="text-sm font-semibold">{node.name}</span>
                  <span className="ml-2 text-[9px] text-muted-foreground">{nodeMeta.label}</span>
                </div>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {edges.map((edge, ei) => {
                  const meta = RELATION_META[edge.relation]
                  return (
                    <span key={ei} className="inline-flex items-center gap-1.5 rounded-lg border border-border/40 bg-card px-2 py-1 text-[10px]">
                      <meta.icon className={cn("h-2.5 w-2.5", meta.color)} />
                      <span className={meta.color}>{meta.label}</span>
                      <ArrowRight className="h-2.5 w-2.5 text-muted-foreground" />
                      <span className="font-medium">{edge.to}</span>
                    </span>
                  )
                })}
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* What this means */}
      <div className="mt-4 flex items-start gap-2 rounded-xl bg-primary/[0.04] p-3">
        <Layers className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
        <p className="text-[11px] leading-relaxed text-muted-foreground">
          <span className="font-medium text-foreground">The world&apos;s capability ontology.</span>{" "}
          Prerequisites, supports, improves, reduces — every capability is connected to outcomes,
          industries, and other capabilities. This becomes the canonical model that the entire
          platform reasons over.
        </p>
      </div>
    </div>
  )
}
