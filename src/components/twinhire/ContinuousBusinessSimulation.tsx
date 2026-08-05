"use client";

import { motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import {
  AlertTriangle,
  DollarSign,
  Headphones,
  Layers,
  Loader2,
  RefreshCw,
  TrendingDown,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { LiveDot } from "./primitives";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { BusinessTwinView } from "@/lib/twinhire/types";

/**
 * ContinuousBusinessSimulation — the twin is alive.
 *
 * The vision: "Every simulated hour: Sales happen. Support tickets arrive.
 * Marketing campaigns launch. Customers complain. Invoices arrive. Suppliers
 * fail. Competitors launch products. Employees leave. KPIs move."
 *
 * Shows the twin's live operational state — the candidate enters an
 * already-living organization, not a static snapshot.
 */

const EVENT_ICONS: Record<string, React.ElementType> = {
  sale: DollarSign,
  support_ticket: Headphones,
  meeting: Users,
  customer_complaint: AlertTriangle,
  invoice: DollarSign,
  supplier_issue: AlertTriangle,
  competitor_move: TrendingDown,
  employee_change: Users,
  kpi_shift: TrendingUp,
  campaign_launch: Zap,
}

const SEVERITY_COLORS: Record<string, string> = {
  info: "text-muted-foreground",
  warning: "text-amber-600 dark:text-amber-400",
  critical: "text-rose-600 dark:text-rose-400",
}

function generateEvents(twin: BusinessTwinView) {
  // Generate realistic events based on the twin's industry and KPIs
  const events: {
    type: string
    description: string
    impact: string
    severity: "info" | "warning" | "critical"
    time: string
  }[] = []

  // Industry-specific events
  if (twin.industry.includes("D2C") || twin.industry.includes("Consumer")) {
    events.push(
      { type: "sale", description: "47 orders in the last hour (Black Friday prep)", impact: "+12% vs forecast", severity: "info", time: "2m ago" },
      { type: "customer_complaint", description: "3 customers reported shipping delays on SKU-2847", impact: "CSAT risk", severity: "warning", time: "8m ago" },
      { type: "kpi_shift", description: "Inventory turnover dropped to 3.0x (from 3.1x)", impact: "-0.1pt", severity: "warning", time: "15m ago" },
      { type: "campaign_launch", description: "Q4 holiday campaign launched across Meta + Klaviyo", impact: "+$2.1K spend/hr", severity: "info", time: "32m ago" },
      { type: "supplier_issue", description: "Supplier #14 delayed shipment — 200 units affected", impact: "Stockout risk on 3 SKUs", severity: "critical", time: "1h ago" },
    )
  } else if (twin.industry.includes("Freight") || twin.industry.includes("Logistics")) {
    events.push(
      { type: "sale", description: "8 new spot quotes booked this hour", impact: "+€4.2K margin", severity: "info", time: "3m ago" },
      { type: "support_ticket", description: "Carrier #282 disputed detention fees on 3 loads", impact: "€840 at risk", severity: "warning", time: "12m ago" },
      { type: "kpi_shift", description: "On-time delivery improved to 94% (from 93%)", impact: "+1pt", severity: "info", time: "20m ago" },
      { type: "competitor_move", description: "Competitor launched a new lane pricing page", impact: "Price pressure on EU routes", severity: "warning", time: "45m ago" },
      { type: "employee_change", description: "Senior dispatcher submitted 2-week notice", impact: "Capacity risk", severity: "critical", time: "2h ago" },
    )
  } else if (twin.industry.includes("Healthcare")) {
    events.push(
      { type: "support_ticket", description: "Clinic #12 opened 4 high-priority tickets", impact: "L2 escalation needed", severity: "warning", time: "5m ago" },
      { type: "meeting", description: "Clinical Success sync — onboarding backlog review", impact: "34 clinics in queue", severity: "info", time: "18m ago" },
      { type: "kpi_shift", description: "NRR dropped to 91% (from 92%)", impact: "-1pt QoQ", severity: "warning", time: "30m ago" },
      { type: "customer_complaint", description: "Enterprise account threatened to churn over slow onboarding", impact: "$340K ARR at risk", severity: "critical", time: "1h ago" },
    )
  } else {
    events.push(
      { type: "sale", description: "2 new design-partner deals signed", impact: "+pipeline", severity: "info", time: "5m ago" },
      { type: "kpi_shift", description: "API calls spiked 18% (from viral integration)", impact: "Capacity scaling needed", severity: "warning", time: "12m ago" },
      { type: "meeting", description: "Founder sync — pricing v2 decision needed by Friday", impact: "Blocks roadmap", severity: "info", time: "25m ago" },
      { type: "competitor_move", description: "Competitor raised Series A — $8M", impact: "Talent war risk", severity: "warning", time: "1h ago" },
    )
  }

  return events.slice(0, 6)
}

interface LiveEvent {
  id: string
  type: string
  description: string
  impact: string
  severity: "info" | "warning" | "critical"
  time: string
}

export function ContinuousBusinessSimulation({
  twin,
  className,
}: {
  twin: BusinessTwinView;
  className?: string;
}) {
  const [events, setEvents] = useState<LiveEvent[]>(generateEvents(twin))
  const [liveEvents, setLiveEvents] = useState<LiveEvent[]>([])
  const [loading, setLoading] = useState(false)
  const [isLive, setIsLive] = useState(false)

  const fetchLiveEvents = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/twinhire/twin-tick", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ twinId: twin.id }),
      })
      if (!res.ok) throw new Error("failed")
      const data = await res.json()
      if (data.events?.length > 0) {
        setLiveEvents(data.events)
        setIsLive(true)
      }
    } catch {
      // silent — keep static events as fallback
    } finally {
      setLoading(false)
    }
  }, [twin.id])

  // Auto-fetch live events on mount
  useEffect(() => {
    void fetchLiveEvents()
  }, [fetchLiveEvents])

  const displayEvents = isLive && liveEvents.length > 0 ? liveEvents : events

  return (
    <div className={cn("rounded-2xl border border-border/60 bg-card p-6", className)}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="flex items-center gap-2 text-sm font-semibold">
            <Layers className="h-4 w-4 text-primary" /> Live twin operations
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            The twin is alive. Candidates enter an organization that&apos;s already running — not a static snapshot.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isLive && (
            <div className="flex items-center gap-2 rounded-full border border-emerald-200/70 bg-emerald-50 px-3 py-1.5 text-xs dark:border-emerald-500/20 dark:bg-emerald-500/10">
              <LiveDot className="h-1.5 w-1.5" />
              <span className="font-medium text-emerald-700 dark:text-emerald-300">AI-generated</span>
            </div>
          )}
          <Button
            size="sm"
            variant="ghost"
            onClick={fetchLiveEvents}
            disabled={loading}
            className="h-8 gap-1.5 rounded-full text-xs"
          >
            {loading ? (
              <><Loader2 className="h-3 w-3 animate-spin" /> Generating…</>
            ) : (
              <><RefreshCw className="h-3 w-3" /> Next hour</>
            )}
          </Button>
        </div>
      </div>

      {/* Live KPI strip */}
      <div className="mt-4 grid grid-cols-4 gap-2">
        {twin.kpis.slice(0, 4).map((kpi) => (
          <div key={kpi.label} className="rounded-lg bg-secondary/30 p-2 text-center">
            <div className="text-[9px] uppercase tracking-wider text-muted-foreground truncate">
              {kpi.label}
            </div>
            <div className="font-mono text-sm font-semibold">{kpi.value}{kpi.unit}</div>
            <div className={cn("text-[9px]", kpi.trend === "up" ? "text-emerald-600 dark:text-emerald-400" : kpi.trend === "down" ? "text-rose-600 dark:text-rose-400" : "text-muted-foreground")}>
              {kpi.trend === "up" ? "↑" : kpi.trend === "down" ? "↓" : "→"} {kpi.delta}
            </div>
          </div>
        ))}
      </div>

      {/* Event feed */}
      <div className="mt-4">
        <div className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
          <Zap className="h-3 w-3" /> Operational events (last 2 hours)
        </div>
        <div className="mt-2 space-y-1.5 max-h-[280px] overflow-y-auto scroll-slim">
          {displayEvents.map((event, i) => {
            const Icon = EVENT_ICONS[event.type] ?? Layers
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 4 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="flex items-start gap-2.5 rounded-lg border border-border/40 bg-secondary/20 p-2.5"
              >
                <span className={cn("mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-md bg-secondary", SEVERITY_COLORS[event.severity])}>
                  <Icon className="h-3 w-3" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-xs leading-snug text-foreground/90">{event.description}</p>
                  <div className="mt-0.5 flex items-center gap-2">
                    <span className={cn("text-[10px] font-medium", SEVERITY_COLORS[event.severity])}>
                      {event.impact}
                    </span>
                    <span className="text-[9px] text-muted-foreground/70">· {event.time}</span>
                  </div>
                </div>
                {event.severity === "critical" && (
                  <span className="shrink-0 rounded-full bg-rose-100 px-1.5 py-0.5 text-[8px] font-bold uppercase text-rose-600 dark:bg-rose-500/15 dark:text-rose-400">
                    critical
                  </span>
                )}
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* What this means for candidates */}
      <div className="mt-3 rounded-lg bg-primary/[0.04] p-3">
        <p className="text-[11px] leading-relaxed text-muted-foreground">
          <span className="font-medium text-foreground">Candidates enter a living organization.</span> The problems they solve
          are real-time, not hypothetical. The twin&apos;s state changes based on what happens while they work.
        </p>
      </div>
    </div>
  )
}
