"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Building2,
  ChevronDown,
  CircleDashed,
  Compass,
  Cpu,
  Flag,
  Gauge,
  GitCompare,
  Layers3,
  ListChecks,
  MapPin,
  Target,
  Users,
} from "lucide-react";
import { CategoryBadge, FidelityRing, ScoreBar, TrendPill, LiveDot } from "./primitives";
import { TwinKnowledgeGraph } from "./TwinKnowledgeGraph";
import { DataSourcesPanel } from "./DataSourcesPanel";
import { ContinuousBusinessSimulation } from "./ContinuousBusinessSimulation";
import { TwinEvolution } from "./TwinEvolution";
import { CapabilityDiscovery } from "./CapabilityDiscovery";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useState } from "react";
import type { BusinessTwinView, CapabilityGap } from "@/lib/twinhire/types";

export function TwinDashboardView({
  twins,
  selectedId,
  onSelect,
  onStartSimulation,
  pendingGapKey,
  onCompare,
}: {
  twins: BusinessTwinView[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onStartSimulation: (capabilityKey: string) => void;
  pendingGapKey?: string | null;
  onCompare?: () => void;
}) {
  const twin = twins.find((t) => t.id === selectedId) ?? twins[0];
  const ranked = [...(twin?.capabilities ?? [])].sort((a, b) => b.expectedRoi - a.expectedRoi);

  return (
    <div className="bg-grain">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-4">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              01 · Twin Network
            </span>
            {onCompare && (
              <Button variant="outline" size="sm" onClick={onCompare} className="h-8 gap-1.5 rounded-full">
                <GitCompare className="h-3.5 w-3.5" /> Compare twins
              </Button>
            )}
          </div>
          <h1 className="font-display text-3xl text-balance sm:text-4xl">
            Anonymized business twins, ranked by capability gaps
          </h1>
          <p className="max-w-2xl text-pretty text-muted-foreground">
            Candidates never see company names — only operational twins. Pick a
            twin to inspect its live capability gaps, each scored on business
            impact, urgency and expected ROI.
          </p>
        </div>

        {/* Twin selector strip */}
        <div className="mt-8 flex gap-3 overflow-x-auto pb-3 scroll-slim">
          {twins.map((t) => {
            const active = t.id === twin.id;
            return (
              <button
                key={t.id}
                onClick={() => onSelect(t.id)}
                className={cn(
                  "group relative min-w-[260px] shrink-0 rounded-2xl border p-4 text-left transition-all",
                  active
                    ? "border-primary/50 bg-primary/[0.04] shadow-lg shadow-primary/5"
                    : "border-border/60 bg-card hover:-translate-y-0.5 hover:border-foreground/20",
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-muted-foreground">{t.code}</span>
                  <FidelityRing value={t.fidelity} size={36} />
                </div>
                <h3 className="mt-2 font-display text-lg leading-tight">{t.industry}</h3>
                <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{t.tagline}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  <Badge variant="secondary" className="rounded-md text-[10px] font-medium">{t.stage}</Badge>
                  <Badge variant="outline" className="rounded-md text-[10px] font-medium">{t.sizeBand}</Badge>
                </div>
                {active && (
                  <motion.span
                    layoutId="twin-active"
                    className="absolute -bottom-px left-4 right-4 h-0.5 rounded-full bg-primary"
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Twin detail */}
        <AnimatePresence mode="wait">
          <motion.div
            key={twin.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 grid gap-6 lg:grid-cols-3"
          >
            {/* Left: identity + KPIs */}
            <div className="lg:col-span-1 space-y-4">
              <div className="rounded-2xl border border-border/60 bg-card p-6">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <LiveDot className="h-1.5 w-1.5" />
                  Live digital twin
                </div>
                <h2 className="mt-2 font-display text-2xl">{twin.industry}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{twin.tagline}</p>
                <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
                  <Meta icon={Building2} label="Code" value={twin.code} />
                  <Meta icon={Users} label="Size" value={twin.sizeBand} />
                  <Meta icon={Flag} label="Stage" value={twin.stage} />
                  <Meta icon={MapPin} label="Region" value={twin.region} />
                </dl>
                <div className="mt-5 flex items-center justify-between rounded-xl bg-secondary/60 p-3">
                  <div>
                    <div className="text-xs text-muted-foreground">Twin fidelity</div>
                    <div className="text-sm font-medium">Learns from outcomes</div>
                  </div>
                  <FidelityRing value={twin.fidelity} size={48} />
                </div>
              </div>

              {/* KPIs */}
              <div className="rounded-2xl border border-border/60 bg-card p-6">
                <h3 className="flex items-center gap-2 text-sm font-semibold">
                  <Gauge className="h-4 w-4 text-primary" /> Current KPIs
                </h3>
                <div className="mt-4 space-y-3">
                  {twin.kpis.map((k) => (
                    <div key={k.label} className="flex items-center justify-between gap-3">
                      <span className="text-xs text-muted-foreground">{k.label}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-semibold tabular-nums">
                          {k.value}
                          {k.unit && k.unit !== "" && <span className="ml-0.5 text-xs text-muted-foreground">{k.unit}</span>}
                        </span>
                        <TrendPill trend={k.trend} delta={k.delta} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: problems / objectives / org */}
            <div className="lg:col-span-2 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Panel icon={CircleDashed} title="Known problems" tone="concern">
                  <ul className="mt-3 space-y-2">
                    {twin.problems.map((p) => (
                      <li key={p} className="flex gap-2 text-sm text-muted-foreground">
                        <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-rose-500/70" />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </Panel>
                <Panel icon={Target} title="Strategic objectives" tone="primary">
                  <ul className="mt-3 space-y-2">
                    {twin.objectives.map((o) => (
                      <li key={o} className="flex gap-2 text-sm text-muted-foreground">
                        <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary" />
                        <span>{o}</span>
                      </li>
                    ))}
                  </ul>
                </Panel>
              </div>

              <Panel icon={Compass} title="Operational snapshot">
                <div className="mt-3 grid gap-4 sm:grid-cols-2">
                  <div>
                    <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Departments</div>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {twin.orgSnapshot.departments.map((d) => (
                        <Badge key={d} variant="secondary" className="rounded-md text-[11px]">{d}</Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Tech stack</div>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {twin.orgSnapshot.techStack.map((d) => (
                        <Badge key={d} variant="outline" className="rounded-md font-mono text-[11px]">{d}</Badge>
                      ))}
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Decision style</div>
                    <p className="mt-1 text-sm">{twin.orgSnapshot.decisionStyle}</p>
                  </div>
                  <div className="sm:col-span-2">
                    <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Culture</div>
                    <ul className="mt-1 space-y-1">
                      {twin.orgSnapshot.cultureNotes.map((c) => (
                        <li key={c} className="text-sm text-muted-foreground">— {c}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Panel>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Business intelligence layer — connected data sources */}
        <div className="mt-8">
          <DataSourcesPanel twin={twin} />
        </div>

        {/* Capability gap ranking */}
        <div className="mt-12">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="flex items-center gap-2 font-display text-2xl sm:text-3xl">
                <Layers3 className="h-6 w-6 text-primary" />
                Capability gaps ranked by ROI
              </h2>
              <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                Not job titles — missing functions. Each gap is scored on business
                impact, urgency, difficulty and confidence. Start a simulation to
                observe a candidate against any of them.
              </p>
            </div>
            <div className="hidden items-center gap-2 rounded-full border border-border/60 bg-card px-3 py-1.5 text-xs text-muted-foreground sm:flex">
              <ListChecks className="h-3.5 w-3.5" />
              {ranked.length} of {twin.capabilitiesIdentified} identified
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {ranked.map((gap, i) => (
              <CapabilityRow
                key={gap.key}
                gap={gap}
                rank={i + 1}
                onStart={() => onStartSimulation(gap.key)}
                pending={pendingGapKey === gap.key}
              />
            ))}
          </div>

          {/* Expandable long-tail backlog */}
          <BacklogList twin={twin} />
        </div>

        {/* Twin knowledge graph */}
        <div className="mt-10">
          <TwinKnowledgeGraph twin={twin} />
        </div>

        {/* Continuous business simulation */}
        <div className="mt-10">
          <ContinuousBusinessSimulation twin={twin} />
        </div>

        {/* Twin evolution — how the twin has changed */}
        <div className="mt-10">
          <TwinEvolution twin={twin} />
        </div>

        {/* Capability discovery — don't write job descriptions */}
        <div className="mt-10">
          <CapabilityDiscovery twin={twin} />
        </div>
      </div>
    </div>
  );
}

function Meta({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div>
      <dt className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Icon className="h-3.5 w-3.5" /> {label}
      </dt>
      <dd className="mt-0.5 text-sm font-medium">{value}</dd>
    </div>
  );
}

function Panel({
  icon: Icon,
  title,
  tone = "neutral",
  children,
}: {
  icon: React.ElementType;
  title: string;
  tone?: "neutral" | "primary" | "concern";
  children: React.ReactNode;
}) {
  const toneCls =
    tone === "primary" ? "text-primary" : tone === "concern" ? "text-rose-600 dark:text-rose-400" : "text-muted-foreground";
  return (
    <div className="rounded-2xl border border-border/60 bg-card p-6">
      <h3 className="flex items-center gap-2 text-sm font-semibold">
        <Icon className={cn("h-4 w-4", toneCls)} /> {title}
      </h3>
      {children}
    </div>
  );
}

function CapabilityRow({
  gap,
  rank,
  onStart,
  pending,
}: {
  gap: CapabilityGap;
  rank: number;
  onStart: () => void;
  pending: boolean;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className={cn(
        "group relative overflow-hidden rounded-2xl border bg-card p-5 transition-all hover:border-foreground/20 hover:shadow-md",
        pending ? "border-primary/50 ring-1 ring-primary/20" : "border-border/60",
      )}
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
        {/* Rank + ROI */}
        <div className="flex shrink-0 items-center gap-4 lg:flex-col lg:items-start">
          <div className="flex items-baseline gap-1">
            <span className="font-mono text-xs text-muted-foreground">#</span>
            <span className="font-display text-3xl leading-none">{rank}</span>
          </div>
          <div className="lg:w-28">
            <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Expected ROI</div>
            <div className="flex items-baseline gap-1">
              <span className="font-display text-2xl text-primary">{gap.expectedRoi}</span>
              <span className="text-xs text-muted-foreground">/100</span>
            </div>
            <ScoreBar value={gap.expectedRoi} className="mt-1.5" tone="primary" />
          </div>
        </div>

        {/* Body */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <CategoryBadge category={gap.category} />
            <h3 className="font-display text-lg leading-snug">{gap.title}</h3>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">{gap.problem}</p>

          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <Detail label="Evidence" value={gap.evidence} icon={Cpu} />
            <Detail label="Business impact" value={gap.businessImpact} icon={Gauge} />
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs">
            <Impact label="Revenue impact" value={gap.estRevenueImpact} />
            <Impact label="Time savings" value={gap.estTimeSavings} />
            {gap.customerImpact && <Impact label="Customer impact" value={gap.customerImpact} />}
            <Dots label="Difficulty" value={gap.difficulty} />
            <Dots label="Urgency" value={gap.urgency} tone="accent" />
            {gap.strategicImportance && <Dots label="Strategic" value={gap.strategicImportance} />}
            {gap.risk && <Dots label="Risk" value={gap.risk} tone="accent" />}
            <span className="text-muted-foreground">
              Confidence <span className="font-mono font-medium text-foreground">{gap.confidence}%</span>
            </span>
          </div>
        </div>

        {/* CTA */}
        <div className="shrink-0 lg:pl-2">
          <Button
            onClick={onStart}
            disabled={pending}
            className="h-10 w-full gap-1.5 rounded-full lg:w-auto"
          >
            {pending ? (
              <>Preparing simulation…</>
            ) : (
              <>
                Start simulation
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

function BacklogList({ twin }: { twin: BusinessTwinView }) {
  const [open, setOpen] = useState(false);
  const backlog = twin.capabilityBacklog ?? [];
  const remaining = Math.max(0, twin.capabilitiesIdentified - twin.capabilities.length);
  if (backlog.length === 0) return null;

  return (
    <div className="mt-4">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between rounded-2xl border border-dashed border-border/70 bg-secondary/30 px-5 py-3 text-left transition-colors hover:border-foreground/20 hover:bg-secondary/50"
        aria-expanded={open}
      >
        <span className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <Layers3 className="h-4 w-4" />
          {open ? "Hide" : "View"} {remaining} more identified capabilities
          <span className="hidden text-xs text-muted-foreground/70 sm:inline">
            (long-tail, not yet scoped into simulations)
          </span>
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-muted-foreground transition-transform",
            open && "rotate-180",
          )}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {backlog.map((b, i) => (
                <motion.div
                  key={b.title}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="flex items-center justify-between gap-3 rounded-xl border border-border/50 bg-card px-3 py-2.5"
                >
                  <div className="flex min-w-0 items-center gap-2.5">
                    <span className="font-mono text-[10px] text-muted-foreground/60">
                      {String(twin.capabilities.length + i + 1).padStart(2, "0")}
                    </span>
                    <CategoryBadge category={b.category} />
                    <span className="truncate text-sm">{b.title}</span>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <div className="w-12">
                      <ScoreBar value={b.expectedRoi} tone="neutral" />
                    </div>
                    <span className="w-7 text-right font-mono text-xs text-muted-foreground">
                      {b.expectedRoi}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
            <p className="mt-3 text-center text-xs text-muted-foreground/70">
              The Capability Intelligence Engine continuously surfaces these from
              the twin&apos;s live data — the top {twin.capabilities.length} are
              promoted to full simulations as ROI justifies scoping.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Detail({ label, value, icon: Icon }: { label: string; value: string; icon: React.ElementType }) {
  return (
    <div className="rounded-xl bg-secondary/50 p-3">
      <div className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
        <Icon className="h-3 w-3" /> {label}
      </div>
      <p className="mt-1 text-sm">{value}</p>
    </div>
  );
}

function Impact({ label, value }: { label: string; value: string }) {
  if (!value || value === "—") return null;
  return (
    <span className="text-muted-foreground">
      {label} <span className="font-medium text-foreground">{value}</span>
    </span>
  );
}

function Dots({ label, value, tone = "neutral" }: { label: string; value: number; tone?: "neutral" | "accent" }) {
  const color = tone === "accent" ? "bg-[oklch(0.74_0.135_70)]" : "bg-primary";
  return (
    <span className="flex items-center gap-1.5 text-muted-foreground">
      {label}
      <span className="flex gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <span
            key={i}
            className={cn(
              "h-1.5 w-1.5 rounded-full",
              i < value ? color : "bg-muted-foreground/20",
            )}
          />
        ))}
      </span>
    </span>
  );
}
