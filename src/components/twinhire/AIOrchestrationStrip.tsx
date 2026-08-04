"use client";

import { motion } from "framer-motion";
import { Cpu, KeyRound, Layers, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * AIOrchestrationStrip — surfaces the provider-agnostic AI architecture.
 *
 * A compact, honest representation of the abstraction layer described in the
 * vision: multiple providers, routing policies, ensembles, cost/latency limits,
 * and bring-your-own-keys vs. pooled credits. This is the architectural surface
 * that makes TwinHire provider-independent.
 */

const PROVIDERS = [
  { name: "OpenAI", status: "routed" },
  { name: "Anthropic", status: "routed" },
  { name: "Gemini", status: "routed" },
  { name: "DeepSeek", status: "available" },
  { name: "Mistral", status: "available" },
  { name: "Groq", status: "available" },
  { name: "Ollama", status: "self-hosted" },
];

const ROUTING = [
  { task: "Work task generation", model: "reasoning", via: "ensemble" },
  { task: "Performance evaluation", model: "reasoning", via: "ensemble" },
  { task: "Hiring recommendation", model: "reasoning", via: "primary" },
  { task: "Capability surfacing", model: "fast", via: "fallback" },
];

export function AIOrchestrationStrip({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-2xl border border-border/60 bg-card p-6", className)}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary">
            <Layers className="h-4 w-4" />
          </span>
          <div>
            <h3 className="text-sm font-semibold">Provider-agnostic AI orchestration</h3>
            <p className="text-xs text-muted-foreground">
              Every intelligence component routes through one abstraction layer.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200/70 bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse-soft" />
            managed pool active
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-secondary/50 px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
            <KeyRound className="h-3 w-3" /> bring-your-own-keys
          </span>
        </div>
      </div>

      {/* Providers */}
      <div className="mt-5">
        <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
          Configured providers
        </div>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {PROVIDERS.map((p, i) => (
            <motion.span
              key={p.name}
              initial={{ opacity: 0, y: 4 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-[11px] font-medium",
                p.status === "routed" && "border-primary/30 bg-primary/[0.06] text-foreground",
                p.status === "available" && "border-border/60 bg-secondary/40 text-muted-foreground",
                p.status === "self-hosted" && "border-amber-200/70 bg-amber-50 text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300",
              )}
            >
              <Cpu className="h-3 w-3" />
              {p.name}
              {p.status === "routed" && <span className="h-1 w-1 rounded-full bg-primary animate-pulse-soft" />}
            </motion.span>
          ))}
        </div>
      </div>

      {/* Routing table */}
      <div className="mt-5">
        <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
          Task routing
        </div>
        <div className="mt-2 overflow-hidden rounded-xl border border-border/50">
          {ROUTING.map((r, i) => (
            <div
              key={r.task}
              className={cn(
                "flex items-center justify-between gap-3 px-3 py-2 text-xs",
                i % 2 === 0 ? "bg-secondary/30" : "bg-card",
              )}
            >
              <span className="text-muted-foreground">{r.task}</span>
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "rounded px-1.5 py-0.5 font-mono text-[10px]",
                    r.model === "reasoning"
                      ? "bg-primary/10 text-primary"
                      : "bg-muted text-muted-foreground",
                  )}
                >
                  {r.model}
                </span>
                <span className="hidden text-[10px] text-muted-foreground/70 sm:inline">
                  via {r.via}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 text-[11px] text-muted-foreground">
        <Shield className="h-3.5 w-3.5" />
        Cost & latency limits enforced per tenant. Fallback models activate on
        failure. Future providers slot in without architectural change.
      </div>
    </div>
  );
}
