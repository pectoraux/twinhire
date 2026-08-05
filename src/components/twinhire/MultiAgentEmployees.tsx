"use client";

import { motion } from "framer-motion";
import {
  Bot,
  Brain,
  Briefcase,
  Clock,
  Cpu,
  GitBranch,
  MemoryStick,
  MessageSquare,
  Sparkles,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * MultiAgentEmployees — candidates become AI employees inside the twin.
 *
 * The vision: "Every candidate should become an AI employee. They should
 * have memory, specialties, preferred reasoning style, AI tools, strengths,
 * weaknesses, confidence, learning history. When they work inside a twin
 * they shouldn't simply answer prompts. They should attend meetings,
 * negotiate priorities, ask questions, push back, identify risks,
 * collaborate with other AI employees, create plans, request information,
 * improve processes. Businesses would literally watch someone 'work.'"
 */

interface AgentEmployee {
  handle: string
  name: string
  role: string
  specialties: string[]
  reasoningStyle: string
  aiTools: string[]
  strengths: string[]
  weaknesses: string[]
  confidence: number
  learningHistory: { session: string; learned: string; improved: boolean }[]
  recentActions: { type: string; description: string; time: string }[]
  collaborationStyle: string
}

const AGENTS: AgentEmployee[] = [
  {
    handle: "observer-77",
    name: "A. Okafor",
    role: "Operations & AI Leverage",
    specialties: ["Process automation", "Forecasting", "AI agent design", "Cross-functional alignment"],
    reasoningStyle: "First-principles — decomposes before proposing",
    aiTools: ["Claude", "GPT-4", "Cursor", "n8n", "custom agents"],
    strengths: ["Ships in verifiable steps", "Explicit tradeoffs", "Strong AI leverage"],
    weaknesses: ["Technical depth on statistical models", "Could push back more in negotiations"],
    confidence: 72,
    learningHistory: [
      { session: "Demand Forecast Model", learned: "Reconcile data definitions before modeling", improved: true },
      { session: "Carrier Reconciliation", learned: "Stakeholder buy-in precedes automation", improved: true },
      { session: "Lifecycle Email", learned: "A/B test cadence matters more than content", improved: false },
    ],
    recentActions: [
      { type: "plan", description: "Created a 4-week implementation plan for demand forecasting", time: "2h ago" },
      { type: "question", description: "Asked the twin: 'What's the current bias in gut-driven forecasts?'", time: "3h ago" },
      { type: "pushback", description: "Pushed back on the COO's timeline — 'Week 1 should be diagnosis, not shipping'", time: "5h ago" },
      { type: "collaborate", description: "Collaborated with @ops-ninja on process handoff design", time: "1d ago" },
    ],
    collaborationStyle: "Proposes frameworks, asks for input, commits to decisions",
  },
  {
    handle: "ops-ninja",
    name: "K. Patel",
    role: "Operations & Process Design",
    specialties: ["Workflow redesign", "SOPs", "Process automation", "Knowledge architecture"],
    reasoningStyle: "Systems thinking — maps dependencies before acting",
    aiTools: ["Claude", "Notion AI", "Zapier"],
    strengths: ["Deep operational empathy", "Excellent documentation", "Process design"],
    weaknesses: ["Less technical on data engineering", "Slower to ship"],
    confidence: 80,
    learningHistory: [
      { session: "Carrier Reconciliation", learned: "OCR + exception-only review is the right pattern", improved: true },
      { session: "Onboarding Redesign", learned: "Parallelize IT provisioning from day 1", improved: true },
    ],
    recentActions: [
      { type: "plan", description: "Designed a parallelized onboarding workflow (34d → 18d)", time: "4h ago" },
      { type: "improve", description: "Created SOP library for carrier documentation review", time: "6h ago" },
      { type: "collaborate", description: "Reviewed @observer-77's forecasting approach for operational feasibility", time: "1d ago" },
    ],
    collaborationStyle: "Listens first, maps the system, then proposes incremental changes",
  },
  {
    handle: "builder-x",
    name: "M. Chen",
    role: "AI Leverage & Automation",
    specialties: ["Multi-agent workflows", "Internal tools", "AI verification", "Rapid prototyping"],
    reasoningStyle: "Build-first — ships a prototype, then iterates",
    aiTools: ["GPT-4", "Claude", "Cursor", "LangChain", "Ollama"],
    strengths: ["Fastest shipper in the network", "Deep AI tooling knowledge", "Verification-first mindset"],
    weaknesses: ["Documentation sometimes lags", "Can over-engineer early solutions"],
    confidence: 88,
    learningHistory: [
      { session: "Churn Prediction", learned: "Feature engineering > model selection for health scores", improved: true },
      { session: "AI Agent Design", learned: "Always add a human-in-the-loop checkpoint for financial decisions", improved: true },
    ],
    recentActions: [
      { type: "plan", description: "Built a multi-agent workflow for churn prediction with human checkpoint", time: "1h ago" },
      { type: "pushback", description: "Identified risk: 'The model has bias toward enterprise accounts — needs rebalancing'", time: "3h ago" },
      { type: "improve", description: "Shipped an internal tool for weekly anomaly detection", time: "8h ago" },
    ],
    collaborationStyle: "Ships fast, asks for feedback on the prototype rather than the plan",
  },
]

const ACTION_ICONS: Record<string, React.ElementType> = {
  plan: GitBranch,
  question: MessageSquare,
  pushback: Zap,
  collaborate: Users,
  improve: TrendingUp,
}

const ACTION_COLORS: Record<string, string> = {
  plan: "text-primary bg-primary/10",
  question: "text-blue-600 bg-blue-50 dark:text-blue-300 dark:bg-blue-500/10",
  pushback: "text-amber-600 bg-amber-50 dark:text-amber-300 dark:bg-amber-500/10",
  collaborate: "text-violet-600 bg-violet-50 dark:text-violet-300 dark:bg-violet-500/10",
  improve: "text-emerald-600 bg-emerald-50 dark:text-emerald-300 dark:bg-emerald-500/10",
}

export function MultiAgentEmployees({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-2xl border border-border/60 bg-card p-6", className)}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="flex items-center gap-2 text-sm font-semibold">
            <Bot className="h-4 w-4 text-primary" /> AI employees
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Candidates become AI employees with memory, specialties, and collaboration patterns.
            They don&apos;t just answer prompts — they attend meetings, push back, and improve processes.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-border/60 bg-secondary/40 px-3 py-1.5 text-xs">
          <Users className="h-3.5 w-3.5 text-primary" />
          <span className="text-muted-foreground">{AGENTS.length} active agents</span>
        </div>
      </div>

      {/* Agent cards */}
      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        {AGENTS.map((agent, i) => (
          <motion.div
            key={agent.handle}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="rounded-2xl border border-border/60 bg-secondary/20 p-4"
          >
            {/* Agent header */}
            <div className="flex items-center gap-2.5">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-primary-foreground font-display text-sm">
                {agent.name.charAt(0)}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-semibold">{agent.name}</span>
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  </span>
                </div>
                <div className="text-[10px] text-muted-foreground">@{agent.handle} · {agent.role}</div>
              </div>
              <div className="text-right">
                <div className="text-[9px] uppercase tracking-wider text-muted-foreground">Confidence</div>
                <div className="font-mono text-sm font-semibold text-primary">{agent.confidence}%</div>
              </div>
            </div>

            {/* Specialties */}
            <div className="mt-3">
              <div className="flex items-center gap-1 text-[9px] font-medium uppercase tracking-wider text-muted-foreground">
                <Sparkles className="h-2.5 w-2.5" /> Specialties
              </div>
              <div className="mt-1 flex flex-wrap gap-1">
                {agent.specialties.map((s) => (
                  <span key={s} className="rounded-md bg-card px-1.5 py-0.5 text-[9px] border border-border/40">{s}</span>
                ))}
              </div>
            </div>

            {/* Reasoning style */}
            <div className="mt-2.5 flex items-start gap-1.5">
              <Brain className="mt-0.5 h-2.5 w-2.5 shrink-0 text-primary" />
              <span className="text-[10px] text-muted-foreground">{agent.reasoningStyle}</span>
            </div>

            {/* Strengths / Weaknesses */}
            <div className="mt-2.5 grid grid-cols-2 gap-2">
              <div>
                <div className="text-[9px] font-medium text-emerald-600 dark:text-emerald-400">Strengths</div>
                <ul className="mt-0.5 space-y-0.5">
                  {agent.strengths.map((s) => (
                    <li key={s} className="text-[9px] text-muted-foreground">+ {s}</li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="text-[9px] font-medium text-rose-600 dark:text-rose-400">Weaknesses</div>
                <ul className="mt-0.5 space-y-0.5">
                  {agent.weaknesses.map((w) => (
                    <li key={w} className="text-[9px] text-muted-foreground">– {w}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Recent actions */}
            <div className="mt-3">
              <div className="flex items-center gap-1 text-[9px] font-medium uppercase tracking-wider text-muted-foreground">
                <Clock className="h-2.5 w-2.5" /> Recent actions
              </div>
              <div className="mt-1 space-y-1">
                {agent.recentActions.slice(0, 3).map((action, ai) => {
                  const Icon = ACTION_ICONS[action.type] ?? GitBranch
                  const colorCls = ACTION_COLORS[action.type] ?? "text-muted-foreground bg-secondary"
                  return (
                    <div key={ai} className="flex items-start gap-1.5">
                      <span className={cn("mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded", colorCls)}>
                        <Icon className="h-2 w-2" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-[9px] leading-tight text-foreground/80">{action.description}</p>
                        <span className="text-[8px] text-muted-foreground/60">{action.time}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Learning history */}
            <div className="mt-3 border-t border-border/40 pt-2">
              <div className="flex items-center gap-1 text-[9px] font-medium uppercase tracking-wider text-muted-foreground">
                <MemoryStick className="h-2.5 w-2.5" /> Learning memory
              </div>
              <div className="mt-1 space-y-0.5">
                {agent.learningHistory.map((lh, li) => (
                  <div key={li} className="flex items-center gap-1 text-[9px]">
                    {lh.improved ? (
                      <TrendingUp className="h-2 w-2 shrink-0 text-emerald-500" />
                    ) : (
                      <Clock className="h-2 w-2 shrink-0 text-amber-500" />
                    )}
                    <span className="text-muted-foreground truncate">{lh.learned}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Collaboration style */}
            <div className="mt-2 flex items-start gap-1.5">
              <Users className="mt-0.5 h-2.5 w-2.5 shrink-0 text-violet-500" />
              <span className="text-[9px] text-muted-foreground italic">{agent.collaborationStyle}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* What this means */}
      <div className="mt-4 flex items-start gap-2 rounded-xl bg-gradient-to-r from-primary/[0.06] to-[oklch(0.74_0.135_70)]/[0.06] p-4">
        <Cpu className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
        <div>
          <p className="text-xs font-semibold text-primary">Not a chatbot — an operating employee</p>
          <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
            These agents attend meetings, negotiate priorities, ask questions, push back on bad ideas,
            identify risks, collaborate with each other, create plans, and improve processes.
            Businesses watch someone actually <em>work</em>, not just answer prompts.
          </p>
        </div>
      </div>
    </div>
  )
}
