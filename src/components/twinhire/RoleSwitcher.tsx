"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Building2,
  Network,
  Sparkles,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils"

export type Role = "business" | "candidate"

/**
 * RoleSwitcher — lets visitors toggle between the Business and Candidate
 * perspectives on the hero. Each role sees a different value proposition
 * and different CTAs.
 */

const ROLE_CONTENT: Record<Role, {
  icon: React.ElementType
  label: string
  headline: string
  accent: string
  bullets: { title: string; desc: string }[]
  cta: string
}> = {
  business: {
    icon: Building2,
    label: "For businesses",
    headline: "Hire on evidence, not prediction",
    accent: "oklch(0.52 0.11 165)",
    bullets: [
      { title: "Connect your data sources", desc: "CRM, ERP, support, docs — the AI builds a living digital twin of your business" },
      { title: "See capability gaps ranked by ROI", desc: "Not job titles — missing functions, scored on business impact and urgency" },
      { title: "Watch candidates perform real work", desc: "They enter your twin and do operational tasks. No black box — inspect every decision" },
      { title: "Hire on observed evidence", desc: "Explainable recommendations backed by quotable, traceable evidence" },
    ],
    cta: "Explore the twin network",
  },
  candidate: {
    icon: User,
    label: "For candidates",
    headline: "Show what you can do, not what you've done",
    accent: "oklch(0.74 0.135 70)",
    bullets: [
      { title: "Build a capability graph", desc: "Not a résumé — a continuously evolving graph of what you can demonstrably do" },
      { title: "Work inside real business twins", desc: "Anonymized companies with real problems. Perform operational work that matters" },
      { title: "Every action becomes evidence", desc: "Quality, initiative, problem-solving — 17 dimensions measured with quotable proof" },
      { title: "Get hired on demonstrated ability", desc: "No more keyword matching. Businesses see your actual work before interviewing" },
    ],
    cta: "See how it works",
  },
}

export function RoleSwitcher({
  role,
  onChange,
  onNavigate,
}: {
  role: Role
  onChange: (r: Role) => void
  onNavigate: (v: "dashboard") => void
}) {
  const content = ROLE_CONTENT[role]

  return (
    <div className="rounded-3xl border border-border/60 bg-card p-6 sm:p-8">
      {/* Toggle */}
      <div className="mx-auto flex w-fit gap-1 rounded-full bg-secondary/60 p-1">
        {(["business", "candidate"] as const).map((r) => {
          const rc = ROLE_CONTENT[r]
          return (
            <button
              key={r}
              onClick={() => onChange(r)}
              className={cn(
                "flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors",
                role === r ? "bg-card text-foreground shadow-sm" : "text-muted-foreground",
              )}
              style={role === r ? { color: rc.accent } : {}}
            >
              <rc.icon className="h-3.5 w-3.5" />
              {rc.label}
            </button>
          )
        })}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={role}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6"
        >
          {/* Headline */}
          <div className="text-center">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="mx-auto grid h-12 w-12 place-items-center rounded-2xl text-white"
              style={{ background: content.accent }}
            >
              <content.icon className="h-6 w-6" />
            </motion.div>
            <h3 className="mt-3 font-display text-2xl text-balance sm:text-3xl">
              {content.headline}
            </h3>
          </div>

          {/* Bullets */}
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {content.bullets.map((b, i) => (
              <motion.div
                key={b.title}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="rounded-xl border border-border/50 bg-secondary/20 p-4"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="grid h-6 w-6 place-items-center rounded-md text-white text-[10px] font-bold"
                    style={{ background: content.accent }}
                  >
                    {i + 1}
                  </span>
                  <span className="text-sm font-semibold">{b.title}</span>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{b.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-6 text-center">
            <button
              onClick={() => onNavigate("dashboard")}
              className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium text-white transition-transform hover:scale-[1.02]"
              style={{ background: content.accent }}
            >
              {content.cta}
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Network badge */}
      <div className="mt-6 flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
        <Network className="h-3 w-3" />
        Both sides participate in the same Talent Intelligence Network
        <Sparkles className="h-3 w-3 text-primary" />
      </div>
    </div>
  )
}
