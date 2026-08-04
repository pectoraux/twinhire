"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  Shield,
  ShieldCheck,
  Sparkles,
  Upload,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { BusinessTwinView } from "@/lib/twinhire/types";

interface UseCaseSubmission {
  id: string;
  twinId: string;
  rawUseCase: string;
  anonymizedUseCase: string | null;
  category: string;
  identifyOptIn: boolean;
  status: string;
  anonymizationNotes: string | null;
  createdAt: string;
  twin?: { code: string; industry: string };
}

const CATEGORIES = ["Revenue", "Operations", "Product", "Customer", "Data", "Engineering", "Growth", "Knowledge"];

export function UseCaseIngestionPanel({
  twins,
  onClose,
}: {
  twins: BusinessTwinView[];
  onClose: () => void;
}) {
  const [selectedTwinId, setSelectedTwinId] = useState(twins[0]?.id ?? "");
  const [rawUseCase, setRawUseCase] = useState("");
  const [category, setCategory] = useState("Operations");
  const [identifyOptIn, setIdentifyOptIn] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<UseCaseSubmission | null>(null);
  const [error, setError] = useState("");
  const [showRaw, setShowRaw] = useState(false);
  const [submissions, setSubmissions] = useState<UseCaseSubmission[]>([]);

  const loadSubmissions = useCallback(async () => {
    try {
      const res = await fetch(`/api/twinhire/use-case?twId=${selectedTwinId}`);
      if (res.ok) {
        const data = await res.json();
        setSubmissions(data.useCases ?? []);
      }
    } catch {
      // silent
    }
  }, [selectedTwinId]);

  useEffect(() => {
    void loadSubmissions();
  }, [loadSubmissions]);

  const handleSubmit = async () => {
    if (!rawUseCase.trim()) return;
    setSubmitting(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch("/api/twinhire/use-case", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          twinId: selectedTwinId,
          rawUseCase,
          category,
          identifyOptIn,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "failed");
      setResult(data.submission);
      setRawUseCase("");
      void loadSubmissions();
    } catch (err) {
      setError(err instanceof Error ? err.message : "submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  const selectedTwin = twins.find((t) => t.id === selectedTwinId);

  return (
    <div className="bg-grain">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-3 py-1 text-xs font-medium text-background">
              <Shield className="h-3 w-3" /> Business use cases
            </span>
            <h1 className="mt-3 font-display text-3xl">Feed real use cases</h1>
            <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
              Businesses submit real operational scenarios. The AI anonymizes them so candidates
              can&apos;t identify the company — unless the business opts in to being identified.
            </p>
          </div>
          <Button variant="outline" onClick={onClose} className="h-10 gap-1.5 rounded-full">
            <X className="h-4 w-4" /> Close
          </Button>
        </div>

        {/* How it works */}
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <Step n={1} icon={Upload} title="Business submits" desc="A real operational scenario with real constraints" />
          <Step n={2} icon={Sparkles} title="AI anonymizes" desc="Strips identifiers, preserves operational essence" />
          <Step n={3} icon={ShieldCheck} title="Candidate works" desc="Sees only the anonymized scenario in simulations" />
        </div>

        {/* Submission form */}
        <div className="mt-8 rounded-2xl border border-border/60 bg-card p-6">
          <h3 className="flex items-center gap-2 text-sm font-semibold">
            <Upload className="h-4 w-4 text-primary" /> Submit a use case
          </h3>

          {/* Twin selector */}
          <div className="mt-4">
            <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Business twin
            </label>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {twins.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTwinId(t.id)}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                    t.id === selectedTwinId
                      ? "border-primary/40 bg-primary/[0.06] text-foreground"
                      : "border-border/60 bg-secondary/30 text-muted-foreground hover:text-foreground",
                  )}
                >
                  {t.code} · {t.industry}
                </button>
              ))}
            </div>
          </div>

          {/* Category */}
          <div className="mt-4">
            <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Category
            </label>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={cn(
                    "rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors",
                    c === category
                      ? "border-primary/40 bg-primary/[0.06] text-foreground"
                      : "border-border/60 bg-secondary/30 text-muted-foreground hover:text-foreground",
                  )}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Raw use case textarea */}
          <div className="mt-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Real use case (never shown to candidates)
              </label>
              <button
                onClick={() => setShowRaw((v) => !v)}
                className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground"
              >
                {showRaw ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                {showRaw ? "Hide" : "Show"}
              </button>
            </div>
            <textarea
              value={rawUseCase}
              onChange={(e) => setRawUseCase(e.target.value)}
              placeholder={`Describe a real operational scenario from your business...\n\nExample: "Last quarter, our logistics team spent 14 hours/week manually reconciling carrier paperwork from FastFreight Inc. The dispatchers pull data from Salesforce, match it against NetSuite invoices, and flag mismatches. Our COO wants this automated by Q3 but we don't have anyone who owns the automation roadmap. The main constraint is that carriers use inconsistent document formats..."\n\nInclude: real company names, real metrics, real constraints, real stakeholders. The AI will anonymize everything.`}
              className={cn(
                "mt-2 h-48 w-full resize-none rounded-xl border border-border/60 bg-background p-4 text-sm leading-relaxed shadow-inner outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary/50 focus:ring-2 focus:ring-primary/15 scroll-slim",
                !showRaw && "text-transparent",
              )}
              style={!showRaw ? { WebkitTextSecurity: "disc" } as React.CSSProperties : {}}
            />
            <p className="mt-1 text-[11px] text-muted-foreground">
              {rawUseCase.length} characters · The raw version is encrypted at rest and never shown to candidates.
            </p>
          </div>

          {/* Identification opt-in */}
          <div className="mt-4 rounded-xl border border-border/50 bg-secondary/20 p-4">
            <label className="flex cursor-pointer items-start gap-3">
              <button
                onClick={() => setIdentifyOptIn((v) => !v)}
                className={cn(
                  "mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md border transition-colors",
                  identifyOptIn ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background",
                )}
              >
                {identifyOptIn && <CheckCircle2 className="h-3.5 w-3.5" />}
              </button>
              <div>
                <div className="text-sm font-medium">
                  Business consents to being identified
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  If enabled, the AI applies lighter anonymization — it keeps industry context
                  and realistic details, but still removes customer names, exact revenue figures,
                  and personal identifiers. If disabled, full anonymization is applied.
                </p>
              </div>
            </label>
          </div>

          {/* Submit */}
          <div className="mt-4 flex items-center gap-3">
            <Button
              onClick={handleSubmit}
              disabled={!rawUseCase.trim() || submitting}
              className="h-10 gap-1.5 rounded-full px-5"
            >
              {submitting ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Anonymizing…</>
              ) : (
                <><Sparkles className="h-4 w-4" /> Submit &amp; anonymize</>
              )}
            </Button>
            {error && (
              <span className="flex items-center gap-1.5 text-xs text-rose-600 dark:text-rose-400">
                <AlertCircle className="h-3.5 w-3.5" /> {error}
              </span>
            )}
          </div>
        </div>

        {/* Result preview */}
        <AnimatePresence>
          {result && result.anonymizedUseCase && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 rounded-2xl border border-emerald-200/60 bg-emerald-50/40 p-6 dark:border-emerald-500/20 dark:bg-emerald-500/[0.06]"
            >
              <h3 className="flex items-center gap-2 text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                <ShieldCheck className="h-4 w-4" /> Anonymized use case
              </h3>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <Badge variant="outline" className="rounded-md">{result.category}</Badge>
                <Badge variant="outline" className="rounded-md">{result.twin?.code}</Badge>
                {result.identifyOptIn && (
                  <Badge className="rounded-md bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300">
                    Identification opt-in
                  </Badge>
                )}
              </div>
              <div className="mt-3 rounded-xl bg-card p-4">
                <p className="text-sm leading-relaxed text-foreground/90">{result.anonymizedUseCase}</p>
              </div>
              {result.anonymizationNotes && (
                <p className="mt-2 text-xs text-muted-foreground">
                  <span className="font-medium">Anonymized:</span> {result.anonymizationNotes}
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Existing submissions */}
        {submissions.length > 0 && (
          <div className="mt-8 rounded-2xl border border-border/60 bg-card p-6">
            <h3 className="text-sm font-semibold">Submitted use cases for {selectedTwin?.code}</h3>
            <div className="mt-3 space-y-2">
              {submissions.map((s) => (
                <div key={s.id} className="rounded-xl border border-border/50 bg-secondary/20 p-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="rounded-md text-[10px]">{s.category}</Badge>
                    <Badge
                      variant="outline"
                      className={cn(
                        "rounded-md text-[10px]",
                        s.status === "anonymized" && "border-emerald-200 text-emerald-700 dark:border-emerald-500/20 dark:text-emerald-300",
                      )}
                    >
                      {s.status}
                    </Badge>
                    {s.identifyOptIn && (
                      <Badge variant="outline" className="rounded-md text-[10px] text-amber-700 dark:text-amber-300">
                        opt-in
                      </Badge>
                    )}
                    <span className="ml-auto text-[10px] text-muted-foreground">
                      {new Date(s.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  {s.anonymizedUseCase && (
                    <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">
                      {s.anonymizedUseCase}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Step({ n, icon: Icon, title, desc }: { n: number; icon: React.ElementType; title: string; desc: string }) {
  return (
    <div className="rounded-xl border border-border/50 bg-card p-4">
      <div className="flex items-center gap-2">
        <span className="grid h-7 w-7 place-items-center rounded-lg bg-primary/10 text-primary">
          <Icon className="h-3.5 w-3.5" />
        </span>
        <span className="font-mono text-xs text-muted-foreground">0{n}</span>
      </div>
      <div className="mt-2 text-sm font-semibold">{title}</div>
      <div className="mt-0.5 text-xs text-muted-foreground">{desc}</div>
    </div>
  );
}
