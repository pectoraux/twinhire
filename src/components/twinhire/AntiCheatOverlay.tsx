"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Eye, EyeOff, ShieldAlert, X } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * AntiCheatOverlay — shown when the candidate loses focus on the simulation
 * environment (switches tabs, clicks away, minimizes, etc.).
 *
 * The vision: "if you try to navigate off, or let the scenario environment
 * lose focus, you fail."
 *
 * Shows a warning first, then a failure if focus isn't restored quickly.
 */

export function AntiCheatOverlay({
  state,
  countdown,
  onDismiss,
  onFail,
}: {
  state: "watching" | "warning" | "failed";
  countdown: number;
  onDismiss: () => void;
  onFail: () => void;
}) {
  return (
    <AnimatePresence>
      {state !== "watching" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] grid place-items-center bg-background/90 backdrop-blur-md"
        >
          {state === "warning" ? (
            <motion.div
              initial={{ scale: 0.9, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              className="mx-4 w-full max-w-md rounded-3xl border border-amber-200/60 bg-card p-8 text-center shadow-2xl dark:border-amber-500/20"
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400"
              >
                <ShieldAlert className="h-8 w-8" />
              </motion.div>
              <h2 className="mt-4 font-display text-2xl">Focus lost</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                The simulation environment lost focus. Return to the tab now or this session
                will be marked as failed.
              </p>
              <div className="mt-5">
                <div className="text-5xl font-display text-amber-600 dark:text-amber-400">
                  {countdown}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">seconds to return</div>
              </div>
              <Button
                onClick={onDismiss}
                className="mt-5 h-11 w-full gap-1.5 rounded-full"
              >
                <Eye className="h-4 w-4" /> I&apos;m back — resume
              </Button>
              <p className="mt-3 text-[11px] text-muted-foreground">
                Anti-cheat active: copy/paste is disabled, and leaving this tab
                during a simulation is not permitted.
              </p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ scale: 0.9, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              className="mx-4 w-full max-w-md rounded-3xl border border-rose-200/60 bg-card p-8 text-center shadow-2xl dark:border-rose-500/20"
            >
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-rose-100 text-rose-600 dark:bg-rose-500/15 dark:text-rose-400">
                <AlertTriangle className="h-8 w-8" />
              </div>
              <h2 className="mt-4 font-display text-2xl">Session failed</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                You left the simulation environment for too long. This session has been
                marked as failed to preserve evidence integrity.
              </p>
              <div className="mt-4 rounded-xl bg-rose-50/50 p-3 text-left text-xs text-muted-foreground dark:bg-rose-500/[0.06]">
                <p className="font-medium text-rose-700 dark:text-rose-400">Why this matters:</p>
                <p className="mt-1">
                  TwinHire evaluates real work under real conditions. Leaving the environment
                  suggests the work may not have been produced independently — which would
                  undermine the evidence this platform is built on.
                </p>
              </div>
              <Button
                onClick={onFail}
                variant="outline"
                className="mt-5 h-11 w-full gap-1.5 rounded-full"
              >
                <X className="h-4 w-4" /> Acknowledge &amp; exit
              </Button>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * AntiCheatBadge — a small indicator showing anti-cheat is active.
 */
export function AntiCheatBadge({ active }: { active: boolean }) {
  if (!active) return null;
  return (
    <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-200/70 bg-amber-50 px-2.5 py-1 text-[11px] font-medium text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300">
      <ShieldAlert className="h-3 w-3" />
      Anti-cheat active
      <span className="ml-0.5 h-1 w-1 rounded-full bg-amber-500 animate-pulse-soft" />
    </div>
  );
}
