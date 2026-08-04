"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeftRight,
  CheckCircle2,
  GitCompare,
  Minus,
  TrendingUp,
  X,
} from "lucide-react";
import { CategoryBadge, FidelityRing, ScoreBar, TrendPill } from "./primitives";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { BusinessTwinView } from "@/lib/twinhire/types";

/**
 * TwinComparison — side-by-side comparison of two business twins.
 *
 * Lets a candidate (or business) compare capability gaps, KPIs, fidelity,
 * and operational snapshots across twins to decide where to work.
 */

export function TwinComparison({
  twins,
  onClose,
}: {
  twins: BusinessTwinView[];
  onClose: () => void;
}) {
  const [leftId, setLeftId] = useState(twins[0]?.id ?? "");
  const [rightId, setRightId] = useState(twins[1]?.id ?? twins[0]?.id ?? "");

  const left = twins.find((t) => t.id === leftId);
  const right = twins.find((t) => t.id === rightId);

  if (!left || !right) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        Need at least two twins to compare.
      </div>
    );
  }

  // Merge capability gaps from both twins for comparison
  const allGaps = [...left.capabilities, ...right.capabilities];
  const leftTopGap = left.capabilities[0];
  const rightTopGap = right.capabilities[0];

  return (
    <div className="bg-grain">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-3 py-1 text-xs font-medium text-background">
              <GitCompare className="h-3 w-3" /> Compare twins
            </span>
            <h1 className="mt-3 font-display text-2xl sm:text-3xl">Side-by-side twin comparison</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Compare capability gaps, KPIs, and fidelity across twins to decide where to work.
            </p>
          </div>
          <Button variant="outline" onClick={onClose} className="h-10 gap-1.5 rounded-full">
            <X className="h-4 w-4" /> Close
          </Button>
        </div>

        {/* Twin selectors */}
        <div className="mt-6 grid gap-4 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
          <TwinSelector twins={twins} selectedId={leftId} onSelect={setLeftId} label="Twin A" />
          <div className="mx-auto grid h-10 w-10 place-items-center rounded-full bg-secondary">
            <ArrowLeftRight className="h-4 w-4 text-muted-foreground" />
          </div>
          <TwinSelector twins={twins} selectedId={rightId} onSelect={setRightId} label="Twin B" />
        </div>

        {/* Comparison grid */}
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {/* Identity cards */}
          <TwinIdentityCard twin={left} />
          <TwinIdentityCard twin={right} />

          {/* Fidelity + sessions */}
          <div className="lg:col-span-2 rounded-2xl border border-border/60 bg-card p-5">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Twin maturity
            </h3>
            <div className="mt-3 grid grid-cols-2 gap-4">
              <MaturityCompare label="Fidelity" left={left.fidelity} right={right.fidelity} suffix="/100" />
              <MaturityCompare label="Sessions observed" left={left.sessionsObserved} right={right.sessionsObserved} />
            </div>
          </div>

          {/* Top capability gap comparison */}
          <div className="lg:col-span-2 rounded-2xl border border-border/60 bg-card p-5">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Top capability gap (highest ROI)
            </h3>
            <div className="mt-3 grid gap-4 sm:grid-cols-2">
              <GapCard gap={leftTopGap} twinCode={left.code} />
              <GapCard gap={rightTopGap} twinCode={right.code} />
            </div>
          </div>

          {/* KPI comparison */}
          <div className="lg:col-span-2 rounded-2xl border border-border/60 bg-card p-5">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              KPI comparison
            </h3>
            <div className="mt-3 space-y-2">
              {left.kpis.map((kpi, i) => {
                const rightKpi = right.kpis[i];
                return (
                  <div key={kpi.label} className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 rounded-lg bg-secondary/20 px-3 py-2">
                    {/* Left KPI */}
                    <div className="text-right">
                      <div className="font-mono text-sm font-semibold">{kpi.value}{kpi.unit && kpi.unit !== "" ? <span className="text-xs text-muted-foreground">{kpi.unit}</span> : null}</div>
                      <TrendPill trend={kpi.trend} delta={kpi.delta} />
                    </div>
                    {/* Label */}
                    <div className="text-center text-xs text-muted-foreground">{kpi.label}</div>
                    {/* Right KPI */}
                    <div className="text-left">
                      {rightKpi ? (
                        <>
                          <div className="font-mono text-sm font-semibold">{rightKpi.value}{rightKpi.unit && rightKpi.unit !== "" ? <span className="text-xs text-muted-foreground">{rightKpi.unit}</span> : null}</div>
                          <TrendPill trend={rightKpi.trend} delta={rightKpi.delta} />
                        </>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Capability count comparison */}
          <div className="lg:col-span-2 rounded-2xl border border-border/60 bg-card p-5">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Capability intelligence
            </h3>
            <div className="mt-3 grid grid-cols-2 gap-4">
              <MaturityCompare
                label="Capabilities identified"
                left={left.capabilitiesIdentified}
                right={right.capabilitiesIdentified}
              />
              <MaturityCompare
                label="Fully scoped gaps"
                left={left.capabilities.length}
                right={right.capabilities.length}
              />
            </div>
          </div>
        </div>

        {/* Summary recommendation */}
        <div className="mt-6 rounded-2xl border border-primary/20 bg-primary/[0.03] p-5">
          <div className="flex items-center gap-2 text-sm font-semibold text-primary">
            <TrendingUp className="h-4 w-4" /> Where to work
          </div>
          <p className="mt-2 text-sm leading-relaxed text-foreground/90">
            {left.capabilities[0]?.expectedRoi > (right.capabilities[0]?.expectedRoi ?? 0)
              ? `${left.code} has the higher-ROI capability gap (${left.capabilities[0]?.title} at ${left.capabilities[0]?.expectedRoi}/100), making it the richer first simulation.`
              : right.capabilities[0]?.expectedRoi > (left.capabilities[0]?.expectedRoi ?? 0)
                ? `${right.code} has the higher-ROI capability gap (${right.capabilities[0]?.title} at ${right.capabilities[0]?.expectedRoi}/100), making it the richer first simulation.`
                : "Both twins have comparable top capability gaps. Choose based on industry fit and your capability graph."}
          </p>
        </div>
      </div>
    </div>
  );
}

function TwinSelector({
  twins,
  selectedId,
  onSelect,
  label,
}: {
  twins: BusinessTwinView[];
  selectedId: string;
  onSelect: (id: string) => void;
  label: string;
}) {
  const selected = twins.find((t) => t.id === selectedId);
  return (
    <div>
      <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{label}</div>
      <select
        value={selectedId}
        onChange={(e) => onSelect(e.target.value)}
        className="mt-1 h-10 w-full rounded-xl border border-border/60 bg-card px-3 text-sm font-medium outline-none focus:border-primary/50"
      >
        {twins.map((t) => (
          <option key={t.id} value={t.id}>
            {t.code} · {t.industry}
          </option>
        ))}
      </select>
      {selected && (
        <p className="mt-1 text-xs text-muted-foreground line-clamp-1">{selected.tagline}</p>
      )}
    </div>
  );
}

function TwinIdentityCard({ twin }: { twin: BusinessTwinView }) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card p-5">
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs text-muted-foreground">{twin.code}</span>
        <FidelityRing value={twin.fidelity} size={36} />
      </div>
      <h3 className="mt-2 font-display text-lg">{twin.industry}</h3>
      <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{twin.tagline}</p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        <span className="rounded-md bg-secondary px-2 py-0.5 text-[10px]">{twin.stage}</span>
        <span className="rounded-md bg-secondary px-2 py-0.5 text-[10px]">{twin.sizeBand}</span>
        <span className="rounded-md bg-secondary px-2 py-0.5 text-[10px]">{twin.region}</span>
      </div>
    </div>
  );
}

function MaturityCompare({
  label,
  left,
  right,
  suffix = "",
}: {
  label: string;
  left: number;
  right: number;
  suffix?: string;
}) {
  const leftHigher = left > right;
  const equal = left === right;
  return (
    <div className="rounded-xl bg-secondary/20 p-3">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-2 flex items-center justify-between">
        <div className={cn("font-display text-xl", leftHigher && !equal ? "text-primary" : "")}>
          {left}{suffix}
        </div>
        <div className="flex items-center gap-1">
          {equal ? (
            <Minus className="h-3 w-3 text-muted-foreground" />
          ) : leftHigher ? (
            <CheckCircle2 className="h-3 w-3 text-primary" />
          ) : (
            <CheckCircle2 className="h-3 w-3 text-primary opacity-30" />
          )}
        </div>
        <div className={cn("font-display text-xl", !leftHigher && !equal ? "text-primary" : "")}>
          {right}{suffix}
        </div>
      </div>
    </div>
  );
}

function GapCard({
  gap,
  twinCode,
}: {
  gap: BusinessTwinView["capabilities"][number] | undefined;
  twinCode: string;
}) {
  if (!gap) return <div className="rounded-xl bg-secondary/20 p-3 text-xs text-muted-foreground">No gaps</div>;
  return (
    <div className="rounded-xl border border-border/50 bg-secondary/20 p-3">
      <div className="flex items-center gap-2">
        <CategoryBadge category={gap.category} />
        <span className="font-mono text-[10px] text-muted-foreground">{twinCode}</span>
      </div>
      <h4 className="mt-2 text-sm font-semibold leading-snug">{gap.title}</h4>
      <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{gap.problem}</p>
      <div className="mt-2 flex items-baseline justify-between">
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Expected ROI</span>
        <span className="font-display text-lg text-primary">{gap.expectedRoi}<span className="text-xs text-muted-foreground">/100</span></span>
      </div>
      <ScoreBar value={gap.expectedRoi} className="mt-1" tone="primary" />
    </div>
  );
}
