"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
  BrainCircuit,
  CheckCircle2,
  GitBranch,
  Network,
  Sparkles,
  TrendingUp,
  UserPlus,
  Zap,
} from "lucide-react";
import { LiveDot } from "./primitives";
import { cn } from "@/lib/utils";

/**
 * LiveActivityFeed — makes the network feel alive.
 *
 * A real-time ticker of activity across the TwinHire network: sessions
 * observed, evaluations completed, twins learning, candidates joining,
 * capability gaps surfaced. Events are generated on a timer to simulate
 * a living intelligence network.
 */

type EventType =
  | "session_started"
  | "evaluation_completed"
  | "twin_learned"
  | "candidate_joined"
  | "gap_surfaced"
  | "hiring_decision";

interface ActivityEvent {
  id: number;
  type: EventType;
  twin: string;
  text: string;
  time: string;
}

const TWIN_CODES = ["TWIN-482", "TWIN-317", "TWIN-604", "TWIN-129"];

const EVENT_TEMPLATES: Record<
  EventType,
  { icon: React.ElementType; color: string; template: (twin: string) => string }
> = {
  session_started: {
    icon: GitBranch,
    color: "text-primary",
    template: (t) => `A candidate entered ${t} to perform operational work`,
  },
  evaluation_completed: {
    icon: CheckCircle2,
    color: "text-emerald-600 dark:text-emerald-400",
    template: (t) => `Performance evaluation completed inside ${t}`,
  },
  twin_learned: {
    icon: BrainCircuit,
    color: "text-violet-600 dark:text-violet-400",
    template: (t) => `${t} updated its capability ranking from a new outcome`,
  },
  candidate_joined: {
    icon: UserPlus,
    color: "text-amber-600 dark:text-amber-400",
    template: () => `A new candidate joined the network with a capability graph`,
  },
  gap_surfaced: {
    icon: Sparkles,
    color: "text-teal-600 dark:text-teal-400",
    template: (t) => `A new capability gap was surfaced inside ${t}`,
  },
  hiring_decision: {
    icon: TrendingUp,
    color: "text-emerald-600 dark:text-emerald-400",
    template: (t) => `A hiring recommendation was issued for work in ${t}`,
  },
};

const EVENT_TYPES = Object.keys(EVENT_TEMPLATES) as EventType[];

function timeAgo(seconds: number): string {
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  return `${Math.floor(seconds / 3600)}h ago`;
}

let eventCounter = 0;

function generateEvent(): ActivityEvent {
  const type = EVENT_TYPES[Math.floor(Math.random() * EVENT_TYPES.length)];
  const twin = TWIN_CODES[Math.floor(Math.random() * TWIN_CODES.length)];
  const tmpl = EVENT_TEMPLATES[type];
  return {
    id: eventCounter++,
    type,
    twin,
    text: tmpl.template(twin),
    time: "just now",
  };
}

function seedEvents(): ActivityEvent[] {
  const types: EventType[] = [
    "evaluation_completed",
    "session_started",
    "twin_learned",
    "gap_surfaced",
    "hiring_decision",
    "candidate_joined",
  ];
  return types.map((type, i) => {
    const twin = TWIN_CODES[i % TWIN_CODES.length];
    const tmpl = EVENT_TEMPLATES[type];
    return {
      id: eventCounter++,
      type,
      twin,
      text: tmpl.template(twin),
      time: `${(i + 1) * 2}m ago`,
    };
  });
}

export function LiveActivityFeed({ className }: { className?: string }) {
  const [events, setEvents] = useState<ActivityEvent[]>([]);
  const [tick, setTick] = useState(0);
  const seeded = useRef(false);

  // Seed + add events on an interval (client-only to avoid hydration mismatch)
  useEffect(() => {
    if (!seeded.current) {
      seeded.current = true;
      queueMicrotask(() => setEvents(seedEvents()));
    }
    const interval = setInterval(() => {
      setEvents((prev) => {
        const next = [generateEvent(), ...prev].slice(0, 6);
        return next.map((e, i) => ({
          ...e,
          time: i === 0 ? "just now" : e.time,
        }));
      });
    }, 5200);
    return () => clearInterval(interval);
  }, []);

  // Update "time ago" labels every 5s
  useEffect(() => {
    const interval = setInterval(() => {
      setTick((t) => t + 1);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Recompute time labels based on tick
  const agedEvents = events.map((e, i) => {
    if (i === 0 && e.time === "just now") return e;
    const minutes = i * 2 + Math.floor(tick * 0.08);
    return { ...e, time: `${minutes}m ago` };
  });

  return (
    <div className={cn("rounded-2xl border border-border/60 bg-card p-6", className)}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="flex items-center gap-2 text-sm font-semibold">
            <Network className="h-4 w-4 text-primary" /> Network activity
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            The network is live. Evidence is being generated right now.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-emerald-200/70 bg-emerald-50 px-3 py-1.5 text-xs dark:border-emerald-500/20 dark:bg-emerald-500/10">
          <LiveDot className="h-1.5 w-1.5" />
          <span className="font-medium text-emerald-700 dark:text-emerald-300">live</span>
        </div>
      </div>

      {/* Activity ticker */}
      <div className="mt-4 space-y-2">
        <AnimatePresence initial={false}>
          {agedEvents.map((e, i) => {
            const tmpl = EVENT_TEMPLATES[e.type];
            return (
              <motion.div
                key={e.id}
                layout
                initial={i === 0 ? { opacity: 0, height: 0, y: -10 } : { opacity: 0 }}
                animate={{ opacity: 1, height: "auto", y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className={cn(
                  "flex items-start gap-3 rounded-xl border p-3",
                  i === 0
                    ? "border-primary/30 bg-primary/[0.04]"
                    : "border-border/50 bg-secondary/20",
                )}
              >
                <span className={cn("mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-secondary/60", tmpl.color)}>
                  <tmpl.icon className="h-3.5 w-3.5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm leading-snug text-foreground/90">{e.text}</p>
                  <div className="mt-0.5 flex items-center gap-2">
                    <span className="font-mono text-[10px] text-muted-foreground">{e.twin}</span>
                    {i === 0 && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-1.5 py-0.5 text-[9px] font-medium text-primary">
                        <Zap className="h-2.5 w-2.5" /> new
                      </span>
                    )}
                  </div>
                </div>
                <span className="shrink-0 text-[10px] text-muted-foreground">{e.time}</span>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Footer stat */}
      <div className="mt-4 flex items-center justify-between rounded-xl bg-secondary/30 px-3 py-2 text-xs">
        <span className="text-muted-foreground">Events in last hour</span>
        <span className="font-mono font-semibold text-primary">
          <motion.span
            key={tick}
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {47 + (tick % 6)}
          </motion.span>
        </span>
      </div>
    </div>
  );
}
