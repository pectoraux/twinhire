"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Clock,
  Loader2,
  Mail,
  Shield,
  UserCheck,
  UserPlus,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface WaitlistEntry {
  id: string;
  email: string;
  name: string | null;
  status: string;
  createdAt: string;
}

interface ApprovedUser {
  email: string;
  tempPassword: string;
  role: string;
}

export function AdminPanel({ onClose }: { onClose: () => void }) {
  const [entries, setEntries] = useState<WaitlistEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [approving, setApproving] = useState<string | null>(null);
  const [approved, setApproved] = useState<ApprovedUser | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/waitlist");
      if (!res.ok) throw new Error("failed");
      const data = (await res.json()) as { entries: WaitlistEntry[] };
      setEntries(data.entries);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const handleApprove = async (entryId: string, role: string) => {
    setApproving(entryId);
    setApproved(null);
    try {
      const res = await fetch("/api/admin/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entryId, role }),
      });
      if (!res.ok) throw new Error("failed");
      const data = (await res.json()) as ApprovedUser;
      setApproved(data);
      void load();
    } catch {
      // silent
    } finally {
      setApproving(null);
    }
  };

  const pending = entries.filter((e) => e.status === "pending");
  const approvedCount = entries.filter((e) => e.status === "approved").length;

  return (
    <div className="bg-grain">
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-3 py-1 text-xs font-medium text-background">
              <Shield className="h-3 w-3" /> Admin
            </span>
            <h1 className="mt-3 font-display text-3xl">Waitlist management</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Approve waitlisted users to create their accounts. Temporary passwords are shown once.
            </p>
          </div>
          <Button variant="outline" onClick={onClose} className="h-10 gap-1.5 rounded-full">
            <X className="h-4 w-4" /> Exit admin
          </Button>
        </div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-3 gap-px overflow-hidden rounded-2xl border border-border/60 bg-border/60">
          <Stat label="Pending" value={pending.length} icon={Clock} tone="amber" />
          <Stat label="Approved" value={approvedCount} icon={CheckCircle2} tone="emerald" />
          <Stat label="Total" value={entries.length} icon={UserPlus} tone="neutral" />
        </div>

        {/* Approved banner */}
        {approved && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 rounded-2xl border border-emerald-200/60 bg-emerald-50/60 p-5 dark:border-emerald-500/20 dark:bg-emerald-500/[0.08]"
          >
            <h3 className="flex items-center gap-2 text-sm font-semibold text-emerald-700 dark:text-emerald-300">
              <CheckCircle2 className="h-4 w-4" /> Account created
            </h3>
            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              <Field label="Email" value={approved.email} />
              <Field label="Temporary password" value={approved.tempPassword} mono />
              <Field label="Role" value={approved.role} />
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Share these credentials with the user. They can sign in immediately.
            </p>
          </motion.div>
        )}

        {/* Waitlist table */}
        <div className="mt-6 rounded-2xl border border-border/60 bg-card p-6">
          <h3 className="text-sm font-semibold">Waitlist entries</h3>
          {loading ? (
            <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" /> Loading…
            </div>
          ) : entries.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">No waitlist entries yet.</p>
          ) : (
            <div className="mt-4 space-y-2">
              {entries.map((entry) => (
                <div
                  key={entry.id}
                  className="flex flex-wrap items-center gap-3 rounded-xl border border-border/50 bg-secondary/20 p-3"
                >
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-secondary text-muted-foreground">
                    <Mail className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium">{entry.email}</div>
                    <div className="text-xs text-muted-foreground">
                      {entry.name ?? "No name"} · {new Date(entry.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <Badge
                    variant={entry.status === "approved" ? "default" : "secondary"}
                    className={cn(
                      "rounded-md",
                      entry.status === "approved" && "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
                    )}
                  >
                    {entry.status}
                  </Badge>
                  {entry.status === "pending" && (
                    <Button
                      size="sm"
                      onClick={() => handleApprove(entry.id, "candidate")}
                      disabled={approving === entry.id}
                      className="h-8 gap-1.5 rounded-full"
                    >
                      {approving === entry.id ? (
                        <><Loader2 className="h-3 w-3 animate-spin" /> Creating…</>
                      ) : (
                        <><UserCheck className="h-3.5 w-3.5" /> Approve as candidate</>
                      )}
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, icon: Icon, tone }: { label: string; value: number; icon: React.ElementType; tone: string }) {
  const toneCls = tone === "amber" ? "text-amber-600 dark:text-amber-400" : tone === "emerald" ? "text-emerald-600 dark:text-emerald-400" : "text-foreground";
  return (
    <div className="bg-card p-5">
      <Icon className={cn("h-4 w-4", toneCls)} />
      <div className="mt-2 font-display text-3xl">{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  );
}

function Field({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="rounded-lg bg-card p-3">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className={cn("mt-0.5 text-sm font-medium", mono && "font-mono")}>{value}</div>
    </div>
  );
}
