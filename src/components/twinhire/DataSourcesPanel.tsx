"use client";

import { motion } from "framer-motion";
import {
  Cloud,
  Database,
  FileText,
  GitBranch,
  Mail,
  MessageSquare,
  Plug,
  Server,
} from "lucide-react";
import { LiveDot } from "./primitives";
import { cn } from "@/lib/utils";
import type { BusinessTwinView } from "@/lib/twinhire/types";

/**
 * DataSourcesPanel — visualizes the Business Intelligence ingestion layer.
 *
 * The vision: "Businesses begin by connecting data sources" — CRM, ERP,
 * accounting, support, project management, knowledge bases, docs, emails,
 * Slack, GitHub, Linear, Jira, Notion, Google Workspace, Microsoft 365,
 * databases, APIs, uploads, manual interviews.
 *
 * This panel shows the connected sources feeding THIS twin, with live-sync
 * indicators, and what the AI understands from them.
 */

interface Source {
  name: string;
  category: "CRM" | "Data" | "Comms" | "Dev" | "Docs" | "Support" | "Finance";
  status: "synced" | "syncing" | "connected";
  lastSync: string;
  records: string;
  icon: React.ElementType;
}

const CATEGORY_COLORS: Record<Source["category"], string> = {
  CRM: "oklch(0.52 0.11 165)",
  Data: "oklch(0.6 0.09 200)",
  Comms: "oklch(0.74 0.135 70)",
  Dev: "oklch(0.62 0.16 350)",
  Docs: "oklch(0.68 0.13 140)",
  Support: "oklch(0.72 0.12 165)",
  Finance: "oklch(0.74 0.135 70)",
};

function sourcesForTwin(twin: BusinessTwinView): Source[] {
  // Map the twin's tech stack to data sources
  const stack = twin.orgSnapshot.techStack.map((s) => s.toLowerCase());
  const sources: Source[] = [];

  const has = (needle: string) => stack.some((s) => s.includes(needle));

  if (has("hubspot") || has("salesforce")) {
    sources.push({ name: has("hubspot") ? "HubSpot" : "Salesforce", category: "CRM", status: "synced", lastSync: "4 min ago", records: "12.4K contacts", icon: Cloud });
  }
  if (has("segment")) {
    sources.push({ name: "Segment", category: "Data", status: "synced", lastSync: "1 min ago", records: "8.1M events", icon: Database });
  }
  if (has("snowflake")) {
    sources.push({ name: "Snowflake", category: "Data", status: "synced", lastSync: "2 min ago", records: "48 tables", icon: Database });
  }
  if (has("zendesk") || has("intercom") || has("gorgias")) {
    const name = has("zendesk") ? "Zendesk" : has("intercom") ? "Intercom" : "Gorgias";
    sources.push({ name, category: "Support", status: "synced", lastSync: "6 min ago", records: "3.2K tickets", icon: MessageSquare });
  }
  if (has("notion")) {
    sources.push({ name: "Notion", category: "Docs", status: "synced", lastSync: "12 min ago", records: "340 docs", icon: FileText });
  }
  if (has("linear") || has("jira")) {
    sources.push({ name: has("linear") ? "Linear" : "Jira", category: "Dev", status: "syncing", lastSync: "now", records: "1.8K issues", icon: GitBranch });
  }
  if (has("slack")) {
    sources.push({ name: "Slack", category: "Comms", status: "connected", lastSync: "live", records: "92 channels", icon: MessageSquare });
  }
  if (has("github")) {
    sources.push({ name: "GitHub", category: "Dev", status: "synced", lastSync: "8 min ago", records: "2.1K PRs", icon: GitBranch });
  }
  if (has("netsuite") || has("stripe")) {
    sources.push({ name: has("netsuite") ? "NetSuite" : "Stripe", category: "Finance", status: "synced", lastSync: "15 min ago", records: "6.7K invoices", icon: Server });
  }
  if (has("klaviyo")) {
    sources.push({ name: "Klaviyo", category: "CRM", status: "synced", lastSync: "5 min ago", records: "180K profiles", icon: Mail });
  }
  if (has("meta")) {
    sources.push({ name: "Meta Ads", category: "Data", status: "connected", lastSync: "30 min ago", records: "campaign data", icon: Cloud });
  }

  // Always add a manual interviews source
  sources.push({ name: "Manual interviews", category: "Docs", status: "connected", lastSync: "weekly", records: "8 sessions", icon: FileText });

  return sources.slice(0, 9);
}

const AI_UNDERSTANDS = [
  "Business model & revenue streams",
  "Customer segments & journeys",
  "Operational processes & bottlenecks",
  "Decision-making patterns",
  "Knowledge gaps & tribal memory",
  "Communication style & culture",
];

export function DataSourcesPanel({ twin }: { twin: BusinessTwinView }) {
  const sources = sourcesForTwin(twin);

  return (
    <div className="rounded-2xl border border-border/60 bg-card p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="flex items-center gap-2 text-sm font-semibold">
            <Plug className="h-4 w-4 text-primary" /> Business intelligence layer
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Connected data sources continuously feed the twin. The AI builds its understanding from live data, not snapshots.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-border/60 bg-secondary/40 px-3 py-1.5 text-xs">
          <LiveDot className="h-1.5 w-1.5" />
          <span className="text-muted-foreground">{sources.length} sources · live</span>
        </div>
      </div>

      {/* Sources grid */}
      <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {sources.map((s, i) => {
          const color = CATEGORY_COLORS[s.category];
          return (
            <motion.div
              key={s.name}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              className="group relative overflow-hidden rounded-xl border border-border/50 bg-secondary/20 p-3 transition-colors hover:border-foreground/15"
            >
              <div className="flex items-start justify-between">
                <span
                  className="grid h-7 w-7 place-items-center rounded-lg text-white"
                  style={{ background: color }}
                >
                  <s.icon className="h-3.5 w-3.5" />
                </span>
                <StatusPill status={s.status} />
              </div>
              <div className="mt-2 text-sm font-semibold">{s.name}</div>
              <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                <span>{s.category}</span>
                <span className="font-mono">{s.records}</span>
              </div>
              <div className="mt-1 text-[10px] text-muted-foreground/70">
                {s.status === "syncing" ? "syncing now…" : `synced ${s.lastSync}`}
              </div>
              {/* sync shimmer */}
              {s.status === "syncing" && (
                <div className="absolute bottom-0 left-0 h-0.5 w-full shimmer" />
              )}
            </motion.div>
          );
        })}
      </div>

      {/* What the AI understands */}
      <div className="mt-5 rounded-xl border border-primary/20 bg-primary/[0.03] p-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-primary">
          <Database className="h-3.5 w-3.5" /> What the AI understands from these sources
        </div>
        <div className="mt-3 grid gap-1.5 sm:grid-cols-2">
          {AI_UNDERSTANDS.map((u, i) => (
            <motion.div
              key={u}
              initial={{ opacity: 0, x: -6 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-2 text-xs text-foreground/85"
            >
              <span className="h-1 w-1 shrink-0 rounded-full bg-primary" />
              {u}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: Source["status"] }) {
  const map = {
    synced: { cls: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300", label: "synced" },
    syncing: { cls: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300", label: "syncing" },
    connected: { cls: "bg-secondary text-muted-foreground", label: "connected" },
  } as const;
  const m = map[status];
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[9px] font-medium", m.cls)}>
      {status === "syncing" && <span className="h-1 w-1 rounded-full bg-current animate-pulse-soft" />}
      {m.label}
    </span>
  );
}
