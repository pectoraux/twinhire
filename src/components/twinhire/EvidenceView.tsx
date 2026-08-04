"use client";

import { motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowRight,
  Award,
  BrainCircuit,
  CheckCircle2,
  Gauge,
  Layers,
  Lightbulb,
  Quote,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScoreBar, SignalChip } from "./primitives";
import { TwinLearningPanel } from "./TwinLearningPanel";
import { AIOrchestrationStrip } from "./AIOrchestrationStrip";
import { EvidenceTimeline, type HistorySession } from "./EvidenceTimeline";
import { MutualOptInDialog } from "./MutualOptInDialog";
import { BusinessObservatory } from "./BusinessObservatory";
import { OutcomeLearning } from "./OutcomeLearning";
import { CandidateProfilePanel } from "./CandidateProfilePanel";
import { cn } from "@/lib/utils";
import type {
  BusinessTwinView,
  CandidateView,
  Evaluation,
  Recommendation,
} from "@/lib/twinhire/types";
import { METRIC_LABELS } from "@/lib/twinhire/types";
import type { ViewKey } from "./Nav";

const DECISION_META: Record<
  Recommendation["decision"],
  { label: string; cls: string; ring: string; icon: React.ElementType }
> = {
  interview_now: {
    label: "Interview now",
    cls: "text-emerald-700 bg-emerald-50 border-emerald-200 dark:text-emerald-300 dark:bg-emerald-500/10 dark:border-emerald-500/30",
    ring: "from-emerald-500/20 to-transparent",
    icon: CheckCircle2,
  },
  observe_longer: {
    label: "Observe longer",
    cls: "text-amber-700 bg-amber-50 border-amber-200 dark:text-amber-300 dark:bg-amber-500/10 dark:border-amber-500/30",
    ring: "from-amber-500/20 to-transparent",
    icon: Gauge,
  },
  another_challenge: {
    label: "Run another challenge",
    cls: "text-violet-700 bg-violet-50 border-violet-200 dark:text-violet-300 dark:bg-violet-500/10 dark:border-violet-500/30",
    ring: "from-violet-500/20 to-transparent",
    icon: BrainCircuit,
  },
  not_a_fit: {
    label: "Not a fit",
    cls: "text-rose-700 bg-rose-50 border-rose-200 dark:text-rose-300 dark:bg-rose-500/10 dark:border-rose-500/30",
    ring: "from-rose-500/20 to-transparent",
    icon: AlertTriangle,
  },
  future_fit: {
    label: "Potential future fit",
    cls: "text-teal-700 bg-teal-50 border-teal-200 dark:text-teal-300 dark:bg-teal-500/10 dark:border-teal-500/30",
    ring: "from-teal-500/20 to-transparent",
    icon: Sparkles,
  },
};

export function EvidenceView({
  twin,
  candidate,
  evaluation,
  recommendation,
  sessionAvg,
  taskTitle,
  submission,
  history,
  onNavigate,
  onAnotherChallenge,
}: {
  twin: BusinessTwinView | null;
  candidate: CandidateView | null;
  evaluation: Evaluation | null;
  recommendation: Recommendation | null;
  sessionAvg: number | null;
  taskTitle: string;
  submission: string;
  history: HistorySession[];
  onNavigate: (v: ViewKey) => void;
  onAnotherChallenge: () => void;
}) {
  if (!evaluation) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center text-muted-foreground">
        No evaluation yet. Complete a work simulation first.
      </div>
    );
  }

  const meta = recommendation ? DECISION_META[recommendation.decision] : null;
  const avg = sessionAvg ?? Math.round(evaluation.scores.reduce((a, b) => a + b.score, 0) / evaluation.scores.length);

  return (
    <div className="bg-grain">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            03 · Evidence & Hiring
          </span>
          <h1 className="font-display text-3xl text-balance sm:text-4xl">
            Every recommendation is backed by observable evidence
          </h1>
          <p className="max-w-2xl text-pretty text-muted-foreground">
            Session: <span className="font-medium text-foreground">“{taskTitle}”</span>
            {twin && <> inside <span className="font-mono">{twin.code}</span> ({twin.industry})</>}.
            No black box — every score traces to a concrete observation.
          </p>
        </div>

        {/* Recommendation hero */}
        {recommendation && meta && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={cn(
              "relative mt-8 overflow-hidden rounded-3xl border bg-card p-6 sm:p-8",
            )}
          >
            <div className={cn("pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br", meta.ring)} />
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <div className="flex items-center gap-2">
                  <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold", meta.cls)}>
                    <meta.icon className="h-3.5 w-3.5" /> {meta.label}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Confidence <span className="font-mono font-semibold text-foreground">{recommendation.confidence}%</span>
                  </span>
                </div>
                <h2 className="mt-3 font-display text-2xl text-balance sm:text-3xl">{recommendation.headline}</h2>
                <p className="mt-3 text-pretty leading-relaxed text-muted-foreground">{recommendation.rationale}</p>
                {recommendation.evidenceRefs.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {recommendation.evidenceRefs.map((r, i) => (
                      <span key={i} className="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-0.5 text-[11px] text-muted-foreground">
                        <Quote className="h-3 w-3" /> {r}
                      </span>
                    ))}
                  </div>
                )}
                {candidate && twin && (
                  <div className="mt-5">
                    <MutualOptInDialog
                      recommendation={recommendation}
                      twinCode={twin.code}
                      twinIndustry={twin.industry}
                      candidateName={candidate.displayName}
                      avgScore={avg}
                      sessionCount={Math.max(candidate.sessionsCompleted, history.length)}
                    />
                  </div>
                )}
              </div>

              <div className="shrink-0 lg:text-right">
                <div className="text-xs text-muted-foreground">Session performance</div>
                <div className="font-display text-5xl text-primary">{avg}<span className="text-xl text-muted-foreground">/100</span></div>
                <div className="mt-3 max-w-xs lg:ml-auto">
                  <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Suggested next step</div>
                  <p className="mt-1 text-sm">{recommendation.suggestedNextStep}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Scores: radar + bars */}
        <div className="mt-8 grid gap-6 lg:grid-cols-[420px_1fr]">
          <div className="rounded-2xl border border-border/60 bg-card p-6">
            <h3 className="flex items-center gap-2 text-sm font-semibold">
              <Layers className="h-4 w-4 text-primary" /> Performance profile
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">10 dimensions of demonstrated capability</p>
            <div className="mt-4 grid place-items-center">
              <RadarChart scores={evaluation.scores} />
            </div>
            <div className="mt-4 flex items-center justify-between rounded-xl bg-secondary/50 p-3 text-sm">
              <span className="text-muted-foreground">Composite</span>
              <span className="font-display text-xl text-primary">{avg}/100</span>
            </div>
          </div>

          <div className="rounded-2xl border border-border/60 bg-card p-6">
            <h3 className="flex items-center gap-2 text-sm font-semibold">
              <Gauge className="h-4 w-4 text-primary" /> Dimension scores & evidence
            </h3>
            <div className="mt-4 max-h-[420px] space-y-3.5 overflow-y-auto scroll-slim pr-1">
              {evaluation.scores.map((s, i) => (
                <div key={s.key} className="group">
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="text-sm font-medium">{s.label}</span>
                    <span className="font-mono text-sm tabular-nums text-muted-foreground">{s.score}<span className="text-xs">/100</span></span>
                  </div>
                  <ScoreBar value={s.score} className="mt-1.5" tone={s.score >= 70 ? "primary" : s.score >= 50 ? "accent" : "neutral"} delay={i * 0.04} />
                  <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{s.note}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Impact + AI leverage */}
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-border/60 bg-card p-6">
            <h3 className="flex items-center gap-2 text-sm font-semibold">
              <TrendingUp className="h-4 w-4 text-primary" /> Business impact if shipped
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-foreground/90">{evaluation.businessImpact}</p>
          </div>
          <div className="rounded-2xl border border-border/60 bg-card p-6">
            <h3 className="flex items-center gap-2 text-sm font-semibold">
              <BrainCircuit className="h-4 w-4 text-primary" /> AI leverage assessment
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-foreground/90">{evaluation.aiLeverageAssessment}</p>
          </div>
        </div>

        {/* Business observatory — no black box */}
        <div className="mt-6">
          <BusinessObservatory
            evaluation={evaluation}
            twin={twin}
            submission={submission}
            taskTitle={taskTitle}
          />
        </div>

        {/* Highlights / Red flags */}
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-emerald-200/60 bg-emerald-50/40 p-6 dark:border-emerald-500/20 dark:bg-emerald-500/[0.06]">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-emerald-700 dark:text-emerald-300">
              <Award className="h-4 w-4" /> Demonstrated strengths
            </h3>
            <ul className="mt-3 space-y-2">
              {evaluation.highlights.length === 0 && <li className="text-sm text-muted-foreground">None flagged.</li>}
              {evaluation.highlights.map((h) => (
                <li key={h} className="flex gap-2 text-sm">
                  <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-rose-200/60 bg-rose-50/40 p-6 dark:border-rose-500/20 dark:bg-rose-500/[0.06]">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-rose-700 dark:text-rose-300">
              <AlertTriangle className="h-4 w-4" /> Concerns to re-test
            </h3>
            <ul className="mt-3 space-y-2">
              {evaluation.redFlags.length === 0 && <li className="text-sm text-muted-foreground">None flagged.</li>}
              {evaluation.redFlags.map((h) => (
                <li key={h} className="flex gap-2 text-sm">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-rose-500" />
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Evidence timeline */}
        <div className="mt-8">
          <h3 className="flex items-center gap-2 font-display text-2xl">
            <Lightbulb className="h-5 w-5 text-primary" /> Evidence trail
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Each observation is quotable and traceable to the candidate&apos;s actual work.
          </p>
          <div className="mt-5 space-y-3">
            {evaluation.evidence.map((e, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="flex gap-4 rounded-2xl border border-border/60 bg-card p-4"
              >
                <div className="flex flex-col items-center">
                  <span className={cn(
                    "grid h-8 w-8 place-items-center rounded-full text-xs font-semibold",
                    e.signal === "strength" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300" :
                    e.signal === "concern" ? "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300" :
                    "bg-secondary text-muted-foreground",
                  )}>
                    {i + 1}
                  </span>
                  {i < evaluation.evidence.length - 1 && <span className="mt-1 h-full w-px bg-border" />}
                </div>
                <div className="min-w-0 flex-1 pb-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <SignalChip signal={e.signal} />
                    <Badge variant="outline" className="rounded-md text-[10px]">
                      {METRIC_LABELS[e.metric] ?? e.metric}
                    </Badge>
                  </div>
                  <p className="mt-2 text-sm text-foreground/90">{e.observation}</p>
                  {e.quote && (
                    <blockquote className="mt-2 border-l-2 border-primary/40 pl-3 text-sm italic text-muted-foreground">
                      “{e.quote}”
                    </blockquote>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Candidate capability graph — interactive */}
        {candidate && (
          <div className="mt-10">
            <CandidateProfilePanel
              candidate={candidate}
              sessionCount={Math.max(candidate.sessionsCompleted, history.length)}
            />
          </div>
        )}

        {/* Twin Learning System + AI orchestration */}
        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          <TwinLearningPanel
            fidelity={twin?.fidelity ?? 72}
            sessionsObserved={(twin?.sessionsObserved ?? 0) + 1}
            fidelityDelta={1}
            activeStage="retrain"
            learnedFromSession={deriveLearned(evaluation)}
          />
          <AIOrchestrationStrip />
        </div>

        {/* Longitudinal evidence timeline */}
        <div className="mt-8">
          <EvidenceTimeline sessions={history} reputation={candidate?.reputation ?? 50} />
        </div>

        {/* Outcome learning — outcomes retrain the twin */}
        <div className="mt-8">
          <OutcomeLearning
            sessionsObserved={history.length}
            twinFidelity={twin?.fidelity ?? 72}
          />
        </div>

        {/* CTAs */}
        <div className="mt-10 flex flex-col items-center gap-3 rounded-3xl border border-border/60 bg-gradient-to-br from-card to-secondary/40 p-8 text-center">
          <p className="font-display text-xl text-balance">
            The closed loop continues — every outcome sharpens the next twin.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button onClick={onAnotherChallenge} className="h-11 gap-1.5 rounded-full px-5">
              <BrainCircuit className="h-4 w-4" /> Run another challenge
            </Button>
            <Button variant="outline" onClick={() => onNavigate("dashboard")} className="h-11 gap-1.5 rounded-full px-5">
              Back to twin network <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Derive "what the twin learned" from the evaluation                 */
/* ------------------------------------------------------------------ */

function deriveLearned(ev: Evaluation): string[] {
  const out: string[] = [];
  // Pull top strength and top concern as concrete learning signals.
  const sorted = [...ev.scores].sort((a, b) => b.score - a.score);
  const top = sorted[0];
  const bottom = sorted[sorted.length - 1];
  if (top) {
    out.push(
      `Capability signal confirmed: ${top.label.toLowerCase()} observed at ${top.score}/100 — refines the role-fit model for this gap.`,
    );
  }
  if (bottom && bottom.score < 60) {
    out.push(
      `Weakness to re-test: ${bottom.label.toLowerCase()} at ${bottom.score}/100 — flagged for the next simulation design.`,
    );
  }
  if (ev.highlights[0]) {
    out.push(`Operational pattern recorded: “${truncate(ev.highlights[0], 90)}”`);
  }
  if (ev.redFlags[0]) {
    out.push(`Risk pattern recorded: “${truncate(ev.redFlags[0], 90)}”`);
  }
  return out.slice(0, 4);
}

function truncate(s: string, n: number): string {
  return s.length > n ? s.slice(0, n - 1) + "…" : s;
}

/* ------------------------------------------------------------------ */
/*  Radar chart (SVG, 10 axes)                                         */
/* ------------------------------------------------------------------ */

function RadarChart({ scores }: { scores: { key: string; label: string; score: number }[] }) {
  const size = 280;
  const cx = size / 2;
  const cy = size / 2;
  const radius = size / 2 - 44;
  const n = scores.length;

  const angle = (i: number) => (Math.PI * 2 * i) / n - Math.PI / 2;
  const point = (i: number, r: number) => [cx + Math.cos(angle(i)) * r, cy + Math.sin(angle(i)) * r] as const;

  const rings = [0.25, 0.5, 0.75, 1];

  const polyPoints = scores
    .map((s, i) => {
      const r = (Math.max(0, Math.min(100, s.score)) / 100) * radius;
      const [x, y] = point(i, r);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  return (
    <svg width={size} height={size} role="img" aria-label="Performance radar across 10 dimensions">
      {/* rings */}
      {rings.map((r) => (
        <polygon
          key={r}
          points={scores.map((_, i) => point(i, radius * r).join(",")).join(" ")}
          fill="none"
          stroke="oklch(0.915 0.006 95)"
          strokeWidth={1}
          className="dark:stroke-white/10"
        />
      ))}
      {/* spokes */}
      {scores.map((_, i) => {
        const [x, y] = point(i, radius);
        return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="oklch(0.915 0.006 95)" strokeWidth={1} className="dark:stroke-white/10" />;
      })}
      {/* data polygon */}
      <motion.polygon
        points={polyPoints}
        fill="oklch(0.52 0.11 165 / 0.18)"
        stroke="oklch(0.52 0.11 165)"
        strokeWidth={2}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformOrigin: `${cx}px ${cy}px` }}
        className="dark:fill-[oklch(0.72_0.12_165/0.18)] dark:stroke-[oklch(0.72_0.12_165)]"
      />
      {/* data points */}
      {scores.map((s, i) => {
        const r = (Math.max(0, Math.min(100, s.score)) / 100) * radius;
        const [x, y] = point(i, r);
        return <circle key={i} cx={x} cy={y} r={2.5} fill="oklch(0.52 0.11 165)" className="dark:fill-[oklch(0.72_0.12_165)]" />;
      })}
      {/* labels */}
      {scores.map((s, i) => {
        const [x, y] = point(i, radius + 22);
        const anchor = Math.abs(x - cx) < 6 ? "middle" : x > cx ? "start" : "end";
        const short = s.label.split(" ")[0];
        return (
          <text
            key={i}
            x={x}
            y={y}
            textAnchor={anchor}
            dominantBaseline="middle"
            className="fill-muted-foreground text-[8px] font-medium uppercase tracking-wide"
          >
            {short}
          </text>
        );
      })}
    </svg>
  );
}
