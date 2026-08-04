"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Nav, type ViewKey } from "@/components/twinhire/Nav";
import { Footer } from "@/components/twinhire/Footer";
import { HeroView } from "@/components/twinhire/HeroView";
import { TwinDashboardView } from "@/components/twinhire/TwinDashboardView";
import { SimulationView } from "@/components/twinhire/SimulationView";
import { EvidenceView } from "@/components/twinhire/EvidenceView";
import type { HistorySession } from "@/components/twinhire/EvidenceTimeline";
import { useToast } from "@/hooks/use-toast";
import type {
  BusinessTwinView,
  CandidateView,
  Evaluation,
  Recommendation,
  WorkTask,
} from "@/lib/twinhire/types";

export default function Home() {
  const [view, setView] = useState<ViewKey>("hero");
  const [twins, setTwins] = useState<BusinessTwinView[]>([]);
  const [candidate, setCandidate] = useState<CandidateView | null>(null);
  const [selectedTwinId, setSelectedTwinId] = useState<string | null>(null);
  const [loadingNetwork, setLoadingNetwork] = useState(true);

  // Simulation state
  const [activeGapKey, setActiveGapKey] = useState<string | null>(null);
  const [task, setTask] = useState<WorkTask | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [evaluating, setEvaluating] = useState(false);

  // Evidence state
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [sessionAvg, setSessionAvg] = useState<number | null>(null);
  const [evidenceTwin, setEvidenceTwin] = useState<BusinessTwinView | null>(null);
  const [history, setHistory] = useState<HistorySession[]>([]);
  const [submission, setSubmission] = useState<string>("");

  const { toast } = useToast();

  const loadNetwork = useCallback(async () => {
    setLoadingNetwork(true);
    try {
      const res = await fetch("/api/twinhire/twins");
      if (!res.ok) throw new Error("Failed to load twin network");
      const data = (await res.json()) as { twins: BusinessTwinView[]; candidate: CandidateView | null };
      setTwins(data.twins);
      setCandidate(data.candidate);
      if (data.twins.length > 0) {
        setSelectedTwinId((prev) => prev ?? data.twins[0].id);
      }
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Couldn't load the twin network",
        description: err instanceof Error ? err.message : "Unknown error",
      });
    } finally {
      setLoadingNetwork(false);
    }
  }, [toast]);

  useEffect(() => {
    void loadNetwork();
  }, [loadNetwork]);

  const loadHistory = useCallback(async () => {
    try {
      const res = await fetch("/api/twinhire/history");
      if (!res.ok) throw new Error("Failed to load history");
      const data = (await res.json()) as { sessions: HistorySession[] };
      setHistory(data.sessions);
    } catch {
      // silent — history is a nice-to-have
    }
  }, []);

  useEffect(() => {
    void loadHistory();
  }, [loadHistory]);

  const navigate = useCallback((v: ViewKey) => {
    setView(v);
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleSelectTwin = useCallback((id: string) => {
    setSelectedTwinId(id);
  }, []);

  const selectedTwin = twins.find((t) => t.id === selectedTwinId) ?? twins[0] ?? null;

  const activeGap = selectedTwin?.capabilities.find((c) => c.key === activeGapKey) ?? null;

  const handleStartSimulation = useCallback(
    async (capabilityKey: string) => {
      if (!selectedTwin) return;
      setActiveGapKey(capabilityKey);
      setTask(null);
      setSessionId(null);
      setEvaluation(null);
      setRecommendation(null);
      setGenerating(true);
      navigate("simulate");

      try {
        const res = await fetch("/api/twinhire/simulate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ twinId: selectedTwin.id, capabilityKey }),
        });
        if (!res.ok) throw new Error("Failed to generate work task");
        const data = (await res.json()) as { sessionId: string; task: WorkTask };
        setSessionId(data.sessionId);
        setTask(data.task);
      } catch (err) {
        toast({
          variant: "destructive",
          title: "Simulation failed to start",
          description: err instanceof Error ? err.message : "Unknown error",
        });
        navigate("dashboard");
      } finally {
        setGenerating(false);
      }
    },
    [selectedTwin, navigate, toast],
  );

  const handleSubmit = useCallback(
    async (submissionText: string) => {
      if (!sessionId) return;
      setSubmission(submissionText);
      setEvaluating(true);
      try {
        const res = await fetch("/api/twinhire/evaluate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId, submission: submissionText }),
        });
        if (!res.ok) throw new Error("Evaluation failed");
        const data = (await res.json()) as { evaluation: Evaluation };
        setEvaluation(data.evaluation);

        // Immediately request the explainable recommendation
        const recRes = await fetch("/api/twinhire/recommend", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
        });
        if (!recRes.ok) throw new Error("Recommendation failed");
        const recData = (await recRes.json()) as {
          recommendation: Recommendation;
          sessionAvg: number;
        };
        setRecommendation(recData.recommendation);
        setSessionAvg(recData.sessionAvg);
        setEvidenceTwin(selectedTwin);

        // Refresh candidate (sessionsCompleted / reputation) + longitudinal history
        void loadNetwork();
        void loadHistory();

        toast({
          title: "Evaluation complete",
          description: "Hiring recommendation generated from evidence.",
        });
        navigate("evidence");
      } catch (err) {
        toast({
          variant: "destructive",
          title: "Evaluation failed",
          description: err instanceof Error ? err.message : "Unknown error",
        });
      } finally {
        setEvaluating(false);
      }
    },
    [sessionId, selectedTwin, navigate, toast, loadNetwork, loadHistory],
  );

  const handleAnotherChallenge = useCallback(() => {
    setEvaluation(null);
    setRecommendation(null);
    setSessionAvg(null);
    setTask(null);
    setSessionId(null);
    setActiveGapKey(null);
    navigate("dashboard");
  }, [navigate]);

  const hasSession = !!sessionId || !!evaluation;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Nav view={view} onNavigate={navigate} hasSession={hasSession} />

      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            {view === "hero" && <HeroView onNavigate={navigate} />}

            {view === "dashboard" &&
              (loadingNetwork ? (
                <DashboardSkeleton />
              ) : (
                <TwinDashboardView
                  twins={twins}
                  selectedId={selectedTwinId}
                  onSelect={handleSelectTwin}
                  onStartSimulation={handleStartSimulation}
                  pendingGapKey={generating ? activeGapKey : null}
                />
              ))}

            {view === "simulate" && (
              <SimulationView
                twin={selectedTwin}
                gapTitle={activeGap?.title ?? ""}
                gapCategory={activeGap?.category ?? ""}
                task={task}
                sessionId={sessionId}
                generating={generating}
                evaluating={evaluating}
                onSubmit={handleSubmit}
              />
            )}

            {view === "evidence" && (
              <EvidenceView
                twin={evidenceTwin}
                candidate={candidate}
                evaluation={evaluation}
                recommendation={recommendation}
                sessionAvg={sessionAvg}
                taskTitle={task?.taskTitle ?? ""}
                submission={submission}
                history={history}
                onNavigate={navigate}
                onAnotherChallenge={handleAnotherChallenge}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="bg-grain">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="shimmer h-4 w-24 rounded" />
        <div className="shimmer mt-3 h-9 w-2/3 rounded" />
        <div className="shimmer mt-3 h-4 w-1/2 rounded" />
        <div className="mt-8 flex gap-3 overflow-hidden">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="shimmer h-28 w-[260px] shrink-0 rounded-2xl" />
          ))}
        </div>
        <div className="mt-8 space-y-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="shimmer h-32 w-full rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
