"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Bot,
  CheckCircle2,
  ClipboardList,
  Clock,
  FileText,
  Lightbulb,
  Loader2,
  Lock,
  Send,
  Sparkles,
  Wrench,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CategoryBadge, LiveDot } from "./primitives";
import { cn } from "@/lib/utils";
import type { BusinessTwinView, WorkTask } from "@/lib/twinhire/types";
import { useState } from "react";

export function SimulationView({
  twin,
  gapTitle,
  gapCategory,
  task,
  sessionId,
  generating,
  evaluating,
  onSubmit,
}: {
  twin: BusinessTwinView | null;
  gapTitle: string;
  gapCategory: string;
  task: WorkTask | null;
  sessionId: string | null;
  generating: boolean;
  evaluating: boolean;
  onSubmit: (submission: string) => void;
}) {
  const [draft, setDraft] = useState("");

  if (generating || (!task && !sessionId)) {
    return <GeneratingSkeleton />;
  }

  if (!task || !twin) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <p className="text-muted-foreground">No active simulation. Start one from the Twin Network.</p>
      </div>
    );
  }

  const wordCount = draft.trim() ? draft.trim().split(/\s+/).length : 0;

  return (
    <div className="bg-grain">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span className="font-mono">{twin.code}</span>
            <span>·</span>
            <span>{twin.industry}</span>
            <span>·</span>
            <CategoryBadge category={gapCategory} />
            <span className="ml-auto flex items-center gap-1.5">
              <LiveDot className="h-1.5 w-1.5" /> Simulation live
            </span>
          </div>
          <h1 className="font-display text-3xl text-balance sm:text-4xl">{task.taskTitle}</h1>
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <Lock className="h-3.5 w-3.5" /> Company identity hidden until mutual interview opt-in.
          </p>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[380px_1fr]">
          {/* LEFT — context bundle */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="space-y-4">
              {/* Brief */}
              <div className="rounded-2xl border border-border/60 bg-card p-5">
                <h3 className="flex items-center gap-2 text-sm font-semibold">
                  <FileText className="h-4 w-4 text-primary" /> Operational brief
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-foreground/90">{task.taskBrief}</p>
              </div>

              {/* Role + situation */}
              <div className="rounded-2xl border border-border/60 bg-card p-5">
                <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Role you step into</div>
                <div className="mt-1 font-display text-lg">{task.contextBundle.role}</div>
                <p className="mt-3 text-sm text-muted-foreground">{task.contextBundle.situation}</p>
              </div>

              {/* Artifacts */}
              <div className="rounded-2xl border border-border/60 bg-card p-5">
                <h3 className="flex items-center gap-2 text-sm font-semibold">
                  <Wrench className="h-4 w-4 text-primary" /> Artifacts available
                </h3>
                <ul className="mt-3 space-y-2.5">
                  {task.contextBundle.artifacts.map((a) => (
                    <li key={a.name} className="rounded-xl bg-secondary/50 p-3">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-medium">{a.name}</span>
                        <Badge variant="outline" className="rounded-md font-mono text-[10px]">{a.type}</Badge>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">{a.summary}</p>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Constraints */}
              <div className="rounded-2xl border border-border/60 bg-card p-5">
                <h3 className="flex items-center gap-2 text-sm font-semibold">
                  <Clock className="h-4 w-4 text-primary" /> Constraints
                </h3>
                <ul className="mt-3 space-y-2">
                  {task.contextBundle.constraints.map((c) => (
                    <li key={c} className="flex gap-2 text-sm text-muted-foreground">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-amber-500" />
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Success criteria */}
              <div className="rounded-2xl border border-primary/30 bg-primary/[0.04] p-5">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-primary">
                  <CheckCircle2 className="h-4 w-4" /> What success looks like
                </h3>
                <ul className="mt-3 space-y-2">
                  {task.contextBundle.successCriteria.map((c) => (
                    <li key={c} className="flex gap-2 text-sm">
                      <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary/70" />
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>

          {/* RIGHT — workbench */}
          <div className="relative">
            <div className="rounded-2xl border border-border/60 bg-card p-5">
              <div className="flex items-center justify-between gap-3">
                <h3 className="flex items-center gap-2 text-sm font-semibold">
                  <ClipboardList className="h-4 w-4 text-primary" /> Your work
                </h3>
                <button
                  onClick={() => setDraft(scaffoldFor(task))}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-secondary/50 px-3 py-1 text-xs font-medium text-foreground transition-colors hover:border-primary/40 hover:bg-primary/[0.06]"
                >
                  <Sparkles className="h-3 w-3 text-primary" /> Insert scaffold
                </button>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Write how you&apos;d actually approach and deliver this. Markdown welcome.
                The intelligence engine will evaluate your reasoning, not just the output.
              </p>

              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder={`# Approach\n\nStart by framing the real problem and the constraints that matter most...\n\n## Plan\n1. ...\n2. ...\n\n## Recommendation\n...`}
                className="mt-4 h-[420px] w-full resize-none rounded-xl border border-border/60 bg-background p-4 font-mono text-sm leading-relaxed text-foreground shadow-inner outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary/50 focus:ring-2 focus:ring-primary/15 scroll-slim"
                spellCheck={false}
              />

              <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="tabular-nums">{wordCount} words</span>
                  <span className="hidden sm:inline">·</span>
                  <span className="hidden items-center gap-1.5 sm:inline-flex">
                    <Bot className="h-3.5 w-3.5" /> AI leverage is assessed, not penalized — show your judgment.
                  </span>
                </div>
                <Button
                  onClick={() => onSubmit(draft)}
                  disabled={!draft.trim() || evaluating}
                  className="h-10 gap-1.5 rounded-full px-5"
                >
                  {evaluating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Evaluating your work…
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" /> Submit for evaluation
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Copilot tip card */}
            <div className="mt-4 rounded-2xl border border-dashed border-border/70 bg-secondary/30 p-5">
              <div className="flex items-start gap-3">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                  <Lightbulb className="h-4 w-4" />
                </span>
                <div>
                  <h4 className="text-sm font-semibold">How a strong operator works here</h4>
                  <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
                    <li>• Restate the problem in the twin&apos;s own KPIs before proposing anything.</li>
                    <li>• Sequence the work — what you&apos;d do in week 1 vs. month 1, and why.</li>
                    <li>• Name the tradeoff explicitly and pick a side with a reason.</li>
                    <li>• Use AI to accelerate, but show where you&apos;d verify its output.</li>
                    <li>• Close with the measurable outcome the twin would see.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Evaluating overlay */}
      <AnimatePresence>
        {evaluating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 grid place-items-center bg-background/70 backdrop-blur-sm"
          >
            <div className="flex flex-col items-center gap-4 rounded-2xl border border-border/60 bg-card p-8 shadow-2xl">
              <div className="relative grid h-14 w-14 place-items-center">
                <span className="ring-live absolute inset-0 rounded-full" />
                <span className="relative grid h-10 w-10 place-items-center rounded-full bg-primary text-primary-foreground">
                  <Sparkles className="h-5 w-5" />
                </span>
              </div>
              <div className="text-center">
                <div className="font-display text-lg">Performance Intelligence Engine</div>
                <p className="mt-1 text-sm text-muted-foreground">
                  Reading your work across 10 dimensions of evidence…
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function GeneratingSkeleton() {
  return (
    <div className="bg-grain">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
          Generating a faithful work task inside the digital twin…
        </div>
        <div className="mt-6 grid gap-6 lg:grid-cols-[380px_1fr]">
          <div className="space-y-4">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="rounded-2xl border border-border/60 bg-card p-5">
                <div className="shimmer h-4 w-24 rounded" />
                <div className="shimmer mt-3 h-3 w-full rounded" />
                <div className="shimmer mt-2 h-3 w-5/6 rounded" />
              </div>
            ))}
          </div>
          <div className="rounded-2xl border border-border/60 bg-card p-5">
            <div className="shimmer h-5 w-40 rounded" />
            <div className="shimmer mt-4 h-[420px] w-full rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

function scaffoldFor(task: WorkTask): string {
  return `# ${task.taskTitle}

## The real problem (in the twin's KPIs)
Restate the gap in terms of ${/* twin context */ ""}the KPIs it moves, and the constraint that makes it hard.

## Approach
1. Diagnose — what I'd confirm before acting
2. First move — smallest useful step in week 1
3. Sequence — week 1 / month 1 / quarter 1
4. How I'd use AI here, and where I'd verify it

## Tradeoffs
Name the tradeoff, pick a side, and justify it.

## Recommendation
What the twin would observe change, and by how much.
`;
}
