"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { GitBranch, Network } from "lucide-react";
import { cn } from "@/lib/utils";
import type { BusinessTwinView, CapabilityGap } from "@/lib/twinhire/types";

/**
 * TwinKnowledgeGraph — surfaces the "graphs" architecture from the vision.
 *
 * Shows how a selected capability gap connects to:
 *  - KPIs it would move
 *  - Departments it touches
 *  - Problems it addresses
 *
 * A small force-free radial layout. Clicking a different capability re-centers
 * the graph on it.
 */

const NODE_TYPES = {
  gap: { color: "oklch(0.52 0.11 165)", label: "Capability gap" },
  kpi: { color: "oklch(0.74 0.135 70)", label: "KPI" },
  dept: { color: "oklch(0.6 0.09 200)", label: "Department" },
  problem: { color: "oklch(0.62 0.16 350)", label: "Problem" },
} as const;

type NodeType = keyof typeof NODE_TYPES;

interface GraphNode {
  id: string;
  type: NodeType;
  label: string;
}

interface GraphEdge {
  from: string;
  to: string;
}

export function TwinKnowledgeGraph({ twin }: { twin: BusinessTwinView }) {
  const [selectedKey, setSelectedKey] = useState(twin.capabilities[0]?.key ?? "");

  const selected = twin.capabilities.find((c) => c.key === selectedKey) ?? twin.capabilities[0];

  if (!selected) return null;

  const { nodes, edges, centerPos, nodePos } = buildGraph(twin, selected);

  return (
    <div className="rounded-2xl border border-border/60 bg-card p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="flex items-center gap-2 text-sm font-semibold">
            <Network className="h-4 w-4 text-primary" /> Twin knowledge graph
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            How this capability gap connects to KPIs, departments and problems.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {Object.entries(NODE_TYPES).map(([k, v]) => (
            <span key={k} className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <span className="h-2 w-2 rounded-full" style={{ background: v.color }} />
              {v.label}
            </span>
          ))}
        </div>
      </div>

      {/* Capability selector */}
      <div className="mt-4 flex flex-wrap gap-1.5">
        {twin.capabilities.map((c) => (
          <button
            key={c.key}
            onClick={() => setSelectedKey(c.key)}
            className={cn(
              "rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors",
              c.key === selectedKey
                ? "border-primary/40 bg-primary/[0.06] text-foreground"
                : "border-border/60 bg-secondary/30 text-muted-foreground hover:text-foreground",
            )}
          >
            {c.title.length > 32 ? c.title.slice(0, 30) + "…" : c.title}
          </button>
        ))}
      </div>

      {/* Graph canvas */}
      <div className="relative mt-4 aspect-[16/10] w-full overflow-hidden rounded-xl bg-secondary/20 bg-grain">
        <svg viewBox="0 0 400 250" className="h-full w-full" preserveAspectRatio="xMidYMid meet">
          {/* edges */}
          {edges.map((e, i) => {
            const from = nodePos.get(e.from);
            const to = nodePos.get(e.to);
            if (!from || !to) return null;
            return (
              <motion.line
                key={i}
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke="oklch(0.5 0.01 95 / 0.3)"
                strokeWidth={0.8}
                strokeDasharray="2 3"
                className="dark:stroke-white/15"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: i * 0.04 }}
              />
            );
          })}

          {/* nodes */}
          {nodes.map((n, i) => {
            const pos = nodePos.get(n.id);
            if (!pos) return null;
            const isCenter = n.id === selected.key;
            const color = NODE_TYPES[n.type].color;
            return (
              <motion.g
                key={n.id}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                style={{ transformOrigin: `${pos.x}px ${pos.y}px` }}
              >
                {isCenter && (
                  <motion.circle
                    cx={pos.x}
                    cy={pos.y}
                    r={28}
                    fill="none"
                    stroke={color}
                    strokeWidth={1}
                    animate={{ r: [28, 38, 28], opacity: [0.4, 0, 0.4] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeOut" }}
                  />
                )}
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={isCenter ? 22 : 14}
                  fill={isCenter ? color : "oklch(1 0 0)"}
                  stroke={color}
                  strokeWidth={isCenter ? 0 : 1.5}
                  className="dark:fill-[oklch(0.205_0.008_95)]"
                />
                <text
                  x={pos.x}
                  y={pos.y + (isCenter ? 36 : 26)}
                  textAnchor="middle"
                  className="fill-foreground"
                  style={{ fontSize: isCenter ? 7 : 6, fontWeight: isCenter ? 600 : 400 }}
                >
                  {truncateLabel(n.label, isCenter ? 34 : 22)}
                </text>
              </motion.g>
            );
          })}
        </svg>

        {/* Center label overlay */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
          <div className="inline-flex items-center gap-1 rounded-full bg-card/80 px-2 py-0.5 text-[9px] font-medium text-primary backdrop-blur">
            <GitBranch className="h-2.5 w-2.5" /> {selected.category}
          </div>
        </div>
      </div>

      {/* Selected gap detail */}
      <div className="mt-4 rounded-xl border border-border/50 bg-secondary/30 p-4">
        <div className="flex items-center gap-2 text-xs font-semibold">
          <span className="h-2 w-2 rounded-full" style={{ background: NODE_TYPES.gap.color }} />
          {selected.title}
        </div>
        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{selected.problem}</p>
        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          <Stat label="Connected KPIs" value={String(nodes.filter((n) => n.type === "kpi").length)} />
          <Stat label="Departments" value={String(nodes.filter((n) => n.type === "dept").length)} />
          <Stat label="Problems addressed" value={String(nodes.filter((n) => n.type === "problem").length)} />
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-card p-2.5">
      <div className="font-display text-lg text-primary">{value}</div>
      <div className="text-[10px] text-muted-foreground">{label}</div>
    </div>
  );
}

function truncateLabel(s: string, n: number): string {
  return s.length > n ? s.slice(0, n - 1) + "…" : s;
}

function buildGraph(twin: BusinessTwinView, gap: CapabilityGap) {
  const nodes: GraphNode[] = [{ id: gap.key, type: "gap", label: gap.title }];
  const edges: GraphEdge[] = [];

  // Connect to KPIs (link all KPIs to the gap — in a real system this would be
  // derived from the impact model; here we connect based on category affinity)
  twin.kpis.forEach((kpi) => {
    const id = `kpi-${kpi.label}`;
    nodes.push({ id, type: "kpi", label: kpi.label });
    edges.push({ from: gap.key, to: id });
  });

  // Connect to relevant departments (pick 3 based on category)
  const deptAffinity: Record<string, string[]> = {
    Revenue: ["Sales", "Finance"],
    Operations: ["Ops", "Carrier Ops", "Merchandising", "Clinical Success"],
    Product: ["Product", "Engineering"],
    Customer: ["Support", "CX", "Clinical Success"],
    Data: ["Data", "Finance"],
    Engineering: ["Engineering"],
    Growth: ["Performance Marketing", "Brand", "DevRel"],
    Knowledge: ["Support", "Clinical Success"],
  };
  const depts = deptAffinity[gap.category]?.filter((d) => twin.orgSnapshot.departments.includes(d)) ?? [];
  depts.slice(0, 3).forEach((d) => {
    const id = `dept-${d}`;
    nodes.push({ id, type: "dept", label: d });
    edges.push({ from: gap.key, to: id });
  });

  // Connect to 2 most relevant problems
  twin.problems.slice(0, 2).forEach((p, i) => {
    const id = `prob-${i}`;
    nodes.push({ id, type: "problem", label: p });
    edges.push({ from: gap.key, to: id });
  });

  // Layout: center node in middle, others arranged in a circle around it
  const centerPos = { x: 200, y: 125 };
  const nodePos = new Map<string, { x: number; y: number }>();
  nodePos.set(gap.key, centerPos);

  const others = nodes.filter((n) => n.id !== gap.key);
  // Group by type for visual clustering
  const byType: Record<string, GraphNode[]> = {};
  others.forEach((n) => {
    (byType[n.type] ??= []).push(n);
  });

  const typeOrder: NodeType[] = ["kpi", "dept", "problem"];
  const sectorSize = (Math.PI * 2) / typeOrder.length;
  const radius = 90;

  typeOrder.forEach((type, ti) => {
    const group = byType[type] ?? [];
    const baseAngle = sectorSize * ti - Math.PI / 2;
    const spread = sectorSize * 0.8;
    group.forEach((n, gi) => {
      const t = group.length === 1 ? 0.5 : gi / (group.length - 1);
      const angle = baseAngle + (t - 0.5) * spread;
      const r = radius * (type === "kpi" ? 1 : type === "dept" ? 0.85 : 1.05);
      nodePos.set(n.id, {
        x: centerPos.x + Math.cos(angle) * r,
        y: centerPos.y + Math.sin(angle) * r,
      });
    });
  });

  return { nodes, edges, centerPos, nodePos };
}
