"use client";

import { motion } from "framer-motion";
import {
  Award,
  BrainCircuit,
  CheckCircle2,
  Clock,
  TrendingUp,
} from "lucide-react";
import { CategoryBadge, ScoreBar } from "./primitives";
import { cn } from "@/lib/utils";
import type { Recommendation } from "@/lib/twinhire/types";

export interface HistorySession {
  sessionId: string;
  createdAt: string;
  twinCode: string;
  twinIndustry: string;
  capabilityKey: string;
  taskTitle: string;
  summary: string;
  avgScore: number;
  decision: Recommendation["decision"] | null;
  headline: string;
  confidence: number;
  topStrength: string | null;
  topConcern: string | null;
  scores: { key: string; label: string; score: number }[];
}

const DECISION_DOT: Record<string, string> = {
  interview_now: "bg-emerald-500",
  observe_longer: "bg-amber-500",
  another_challenge: "bg-violet-500",
  not_a_fit: "bg-rose-500",
  future_fit: "bg-teal-500",
};

const DECISION_LABEL: Record<string, string> = {
  interview_now: "Interview now",
  observe_longer: "Observe longer",
  another_challenge: "Another challenge",
  not_a_fit: "Not a fit",
  future_fit: "Future fit",
};

export function EvidenceTimeline({
  sessions,
  reputation,
}: {
  sessions: HistorySession[];
  reputation: number;
}) {
  if (sessions.length === 0) {
    return (
      <div className="rounded-2xl border border-border/60 bg-card p-8 text-center text-sm text-muted-foreground">
        No sessions observed yet. Complete a work simulation to start building longitudinal evidence.
      </div>
    );
  }

  // Reputation trajectory: each session nudges reputation up based on score
  const repPoints = sessions.map((s, i) => {
    const base = 50;
    const lift = sessions.slice(0, i + 1).reduce((acc, sess) => acc + (sess.avgScore - 50) * 0.3, 0);
    return Math.round(Math.max(30, Math.min(99, base + lift)));
  });
  const currentRep = reputation || repPoints[repPoints.length - 1] || 50;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h3 className="flex items-center gap-2 font-display text-2xl">
            <Clock className="h-5 w-5 text-primary" />
            Longitudinal evidence
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {sessions.length} session{sessions.length === 1 ? "" : "s"} observed across the network.
            Reputation compounds with every outcome — this is the opposite of a one-shot interview.
          </p>
        </div>
        <div className="flex items-center gap-4 rounded-full border border-border/60 bg-card px-4 py-2">
          <div className="text-center">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Reputation</div>
            <div className="font-display text-xl text-primary">{currentRep}</div>
          </div>
          <div className="h-8 w-px bg-border" />
          <div className="text-center">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Sessions</div>
            <div className="font-display text-xl">{sessions.length}</div>
          </div>
        </div>
      </div>

      {/* Reputation + score trajectory chart */}
      <div className="rounded-2xl border border-border/60 bg-card p-6">
        <div className="flex items-center justify-between">
          <h4 className="flex items-center gap-2 text-sm font-semibold">
            <TrendingUp className="h-4 w-4 text-primary" /> Performance trajectory
          </h4>
          <span className="text-xs text-muted-foreground">composite score &amp; reputation over time</span>
        </div>
        <TrajectoryChart sessions={sessions} repPoints={repPoints} />
      </div>

      {/* Session timeline */}
      <div className="rounded-2xl border border-border/60 bg-card p-6">
        <h4 className="flex items-center gap-2 text-sm font-semibold">
          <BrainCircuit className="h-4 w-4 text-primary" /> Evidence trail across sessions
        </h4>
        <div className="mt-5 space-y-4">
          {sessions.map((s, i) => (
            <SessionCard key={s.sessionId} session={s} index={i} isLast={i === sessions.length - 1} />
          ))}
        </div>
      </div>
    </div>
  );
}

function SessionCard({
  session,
  index,
  isLast,
}: {
  session: HistorySession;
  index: number;
  isLast: boolean;
}) {
  const date = new Date(session.createdAt);
  const dateLabel = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const timeLabel = date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="relative flex gap-4"
    >
      {/* Timeline rail */}
      <div className="flex flex-col items-center">
        <div className={cn("h-3 w-3 rounded-full ring-4 ring-card", session.decision ? DECISION_DOT[session.decision] : "bg-muted-foreground")} />
        {!isLast && <div className="mt-1 w-px flex-1 bg-border" />}
      </div>

      {/* Card */}
      <div className="flex-1 pb-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-[11px] text-muted-foreground">
            Session {index + 1} · {dateLabel} {timeLabel}
          </span>
          <span className="text-muted-foreground">·</span>
          <span className="font-mono text-[11px] text-muted-foreground">{session.twinCode}</span>
          <span className="text-muted-foreground">·</span>
          <span className="text-[11px] text-muted-foreground">{session.twinIndustry}</span>
          {session.decision && (
            <span className={cn("ml-auto inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold text-white", DECISION_DOT[session.decision])}>
              {DECISION_LABEL[session.decision]}
            </span>
          )}
        </div>

        <h5 className="mt-1.5 font-display text-base leading-snug">{session.taskTitle}</h5>

        <div className="mt-2 flex items-center gap-3">
          <div className="flex items-baseline gap-1">
            <span className="font-display text-2xl text-primary">{session.avgScore}</span>
            <span className="text-xs text-muted-foreground">/100</span>
          </div>
          {session.headline && (
            <span className="text-sm text-muted-foreground">— {session.headline}</span>
          )}
        </div>

        <p className="mt-2 text-sm leading-relaxed text-muted-foreground line-clamp-2">{session.summary}</p>

        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {session.topStrength && (
            <div className="flex items-start gap-2 rounded-lg bg-emerald-50/50 p-2 dark:bg-emerald-500/[0.06]">
              <Award className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <span className="text-xs text-foreground/80">{truncate(session.topStrength, 110)}</span>
            </div>
          )}
          {session.topConcern && (
            <div className="flex items-start gap-2 rounded-lg bg-rose-50/50 p-2 dark:bg-rose-500/[0.06]">
              <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-rose-600 dark:text-rose-400" />
              <span className="text-xs text-foreground/80">{truncate(session.topConcern, 110)}</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function truncate(s: string, n: number): string {
  return s.length > n ? s.slice(0, n - 1) + "…" : s;
}

function TrajectoryChart({
  sessions,
  repPoints,
}: {
  sessions: HistorySession[];
  repPoints: number[];
}) {
  const w = 100;
  const h = 36;
  const padding = 4;
  const scores = sessions.map((s) => s.avgScore);
  const all = [...scores, ...repPoints];
  const min = Math.min(...all, 40) - 2;
  const max = Math.max(...all, 80) + 2;
  const range = Math.max(1, max - min);

  if (sessions.length < 1) return null;
  const n = sessions.length;
  const step = n === 1 ? 0 : w / (n - 1);

  const toY = (v: number) => h - padding - ((v - min) / range) * (h - padding * 2);
  const scoreCoords = scores.map((s, i) => [i * step, toY(s)] as const);
  const repCoords = repPoints.map((r, i) => [i * step, toY(r)] as const);

  const scoreLine = scoreCoords.map((c, i) => `${i === 0 ? "M" : "L"}${c[0].toFixed(1)},${c[1].toFixed(1)}`).join(" ");
  const repLine = repCoords.map((c, i) => `${i === 0 ? "M" : "L"}${c[0].toFixed(1)},${c[1].toFixed(1)}`).join(" ");

  return (
    <div className="mt-4">
      <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="h-24 w-full">
        <defs>
          <linearGradient id="scoreFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="oklch(0.52 0.11 165 / 0.22)" />
            <stop offset="100%" stopColor="oklch(0.52 0.11 165 / 0)" />
          </linearGradient>
        </defs>
        {/* grid lines */}
        {[0.25, 0.5, 0.75].map((g) => (
          <line key={g} x1={0} y1={h * g} x2={w} y2={h * g} stroke="oklch(0.915 0.006 95)" strokeWidth={0.3} className="dark:stroke-white/5" />
        ))}
        {/* score area + line */}
        {n > 1 && (
          <path d={`${scoreLine} L${w},${h} L0,${h} Z`} fill="url(#scoreFill)" />
        )}
        <motion.path
          d={scoreLine}
          fill="none"
          stroke="oklch(0.52 0.11 165)"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="dark:stroke-[oklch(0.72_0.12_165)]"
        />
        {/* reputation line (dashed) */}
        <motion.path
          d={repLine}
          fill="none"
          stroke="oklch(0.74 0.135 70)"
          strokeWidth={1.2}
          strokeLinecap="round"
          strokeDasharray="2 2"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="dark:stroke-[oklch(0.76_0.14_70)]"
        />
        {/* score points */}
        {scoreCoords.map((c, i) => (
          <circle key={i} cx={c[0]} cy={c[1]} r={1.6} fill="oklch(0.52 0.11 165)" className="dark:fill-[oklch(0.72_0.12_165)]" />
        ))}
      </svg>
      <div className="mt-2 flex items-center justify-between text-[10px] text-muted-foreground">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="h-0.5 w-4 rounded-full bg-primary" /> Composite score
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-0.5 w-4 rounded-full bg-[oklch(0.74_0.135_70)] [border-style:dashed]" style={{ borderTop: "1px dashed" }} /> Reputation
          </span>
        </div>
        <span>{n} session{n === 1 ? "" : "s"}</span>
      </div>
    </div>
  );
}
