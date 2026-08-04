"use client";

import { useState } from "react";
import {
  CheckCircle2,
  Download,
  FileText,
  Loader2,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type {
  BusinessTwinView,
  CandidateView,
  Evaluation,
  Recommendation,
} from "@/lib/twinhire/types";
import type { HistorySession } from "./EvidenceTimeline";

/**
 * EvidenceExport — lets businesses export the full evidence package
 * for a hiring committee or compliance review.
 *
 * Generates a downloadable JSON/markdown file with:
 * - The candidate's submission
 * - The full evaluation (17 dimensions, evidence trail)
 * - The hiring recommendation
 * - The longitudinal history
 * - The twin context
 */

export function EvidenceExport({
  evaluation,
  recommendation,
  candidate,
  twin,
  taskTitle,
  submission,
  history,
  sessionAvg,
}: {
  evaluation: Evaluation;
  recommendation: Recommendation | null;
  candidate: CandidateView | null;
  twin: BusinessTwinView | null;
  taskTitle: string;
  submission: string;
  history: HistorySession[];
  sessionAvg: number | null;
}) {
  const [exporting, setExporting] = useState(false);
  const [done, setDone] = useState(false);

  const handleExport = () => {
    setExporting(true);
    setDone(false);

    // Build the evidence package
    const pkg = {
      meta: {
        exportedAt: new Date().toISOString(),
        platform: "TwinHire — Evidence-Based Recruitment OS",
        version: "1.0",
      },
      candidate: candidate
        ? {
            handle: candidate.handle,
            displayName: candidate.displayName,
            headline: candidate.headline,
            reputation: candidate.reputation,
            sessionsCompleted: candidate.sessionsCompleted,
            capabilityGraph: candidate.capabilityGraph,
          }
        : null,
      twin: twin
        ? {
            code: twin.code,
            industry: twin.industry,
            stage: twin.stage,
            sizeBand: twin.sizeBand,
          }
        : null,
      session: {
        taskTitle,
        sessionAvg: sessionAvg ?? 0,
        systemConfidence: evaluation.systemConfidence ?? 0,
      },
      evaluation: {
        summary: evaluation.summary,
        scores: evaluation.scores,
        evidence: evaluation.evidence,
        businessImpact: evaluation.businessImpact,
        aiLeverageAssessment: evaluation.aiLeverageAssessment,
        highlights: evaluation.highlights,
        redFlags: evaluation.redFlags,
      },
      recommendation: recommendation
        ? {
            decision: recommendation.decision,
            headline: recommendation.headline,
            rationale: recommendation.rationale,
            confidence: recommendation.confidence,
            suggestedNextStep: recommendation.suggestedNextStep,
            evidenceRefs: recommendation.evidenceRefs,
          }
        : null,
      submission,
      longitudinalHistory: history.map((h) => ({
        twinCode: h.twinCode,
        taskTitle: h.taskTitle,
        avgScore: h.avgScore,
        decision: h.decision,
        summary: h.summary,
        topStrength: h.topStrength,
        topConcern: h.topConcern,
        date: h.createdAt,
      })),
    };

    // Generate markdown report
    const md = generateMarkdown(pkg);

    // Create and download the file
    const blob = new Blob([md], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `twinhire-evidence-${candidate?.handle ?? "candidate"}-${new Date().toISOString().slice(0, 10)}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setExporting(false);
    setDone(true);
    setTimeout(() => setDone(false), 3000);
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleExport}
      disabled={exporting}
      className="h-9 gap-1.5 rounded-full"
    >
      {exporting ? (
        <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Exporting…</>
      ) : done ? (
        <><CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Exported</>
      ) : (
        <><Download className="h-3.5 w-3.5" /> Export evidence</>
      )}
    </Button>
  );
}

function generateMarkdown(pkg: Record<string, unknown>): string {
  const lines: string[] = [];

  lines.push("# TwinHire Evidence Package");
  lines.push("");
  lines.push(`**Exported:** ${pkg.meta && typeof pkg.meta === "object" && "exportedAt" in pkg.meta ? pkg.meta.exportedAt : ""}`);
  lines.push(`**Platform:** TwinHire — Evidence-Based Recruitment Operating System`);
  lines.push("");

  // Candidate
  const candidate = pkg.candidate as Record<string, unknown> | null;
  if (candidate) {
    lines.push("## Candidate");
    lines.push(`- **Name:** ${candidate.displayName}`);
    lines.push(`- **Handle:** ${candidate.handle}`);
    lines.push(`- **Headline:** ${candidate.headline}`);
    lines.push(`- **Reputation:** ${candidate.reputation}/100`);
    lines.push(`- **Sessions completed:** ${candidate.sessionsCompleted}`);
    lines.push("");
  }

  // Twin
  const twin = pkg.twin as Record<string, unknown> | null;
  if (twin) {
    lines.push("## Business Twin");
    lines.push(`- **Code:** ${twin.code}`);
    lines.push(`- **Industry:** ${twin.industry}`);
    lines.push(`- **Stage:** ${twin.stage}`);
    lines.push(`- **Size:** ${twin.sizeBand}`);
    lines.push("");
  }

  // Session
  const session = pkg.session as Record<string, unknown>;
  lines.push("## Session");
  lines.push(`- **Task:** ${session.taskTitle}`);
  lines.push(`- **Composite score:** ${session.sessionAvg}/100`);
  lines.push(`- **System confidence:** ${session.systemConfidence}%`);
  lines.push("");

  // Evaluation
  const evaluation = pkg.evaluation as Record<string, unknown>;
  lines.push("## Evaluation");
  lines.push(`**Summary:** ${evaluation.summary}`);
  lines.push("");

  const scores = evaluation.scores as Array<Record<string, unknown>>;
  if (scores && Array.isArray(scores)) {
    lines.push("### Dimension Scores");
    lines.push("| Dimension | Score | Note |");
    lines.push("|---|---|---|");
    scores.forEach((s) => {
      lines.push(`| ${s.label} | ${s.score}/100 | ${s.note} |`);
    });
    lines.push("");
  }

  const evidence = evaluation.evidence as Array<Record<string, unknown>>;
  if (evidence && Array.isArray(evidence)) {
    lines.push("### Evidence Trail");
    evidence.forEach((e, i) => {
      lines.push(`${i + 1}. **[${String(e.signal).toUpperCase()}]** ${e.observation}`);
      if (e.quote) lines.push(`   > "${e.quote}"`);
    });
    lines.push("");
  }

  const highlights = evaluation.highlights as string[];
  if (highlights && highlights.length > 0) {
    lines.push("### Highlights");
    highlights.forEach((h) => lines.push(`- ✅ ${h}`));
    lines.push("");
  }

  const redFlags = evaluation.redFlags as string[];
  if (redFlags && redFlags.length > 0) {
    lines.push("### Concerns");
    redFlags.forEach((r) => lines.push(`- ⚠️ ${r}`));
    lines.push("");
  }

  // Recommendation
  const recommendation = pkg.recommendation as Record<string, unknown> | null;
  if (recommendation) {
    lines.push("## Hiring Recommendation");
    lines.push(`- **Decision:** ${recommendation.decision}`);
    lines.push(`- **Headline:** ${recommendation.headline}`);
    lines.push(`- **Confidence:** ${recommendation.confidence}%`);
    lines.push(`- **Rationale:** ${recommendation.rationale}`);
    lines.push(`- **Suggested next step:** ${recommendation.suggestedNextStep}`);
    lines.push("");
  }

  // Submission
  lines.push("## Candidate Submission");
  lines.push("```markdown");
  lines.push(String(pkg.submission ?? ""));
  lines.push("```");
  lines.push("");

  // Longitudinal history
  const history = pkg.longitudinalHistory as Array<Record<string, unknown>>;
  if (history && history.length > 0) {
    lines.push("## Longitudinal History");
    lines.push("| Session | Twin | Score | Decision | Date |");
    lines.push("|---|---|---|---|---|");
    history.forEach((h) => {
      lines.push(`| ${h.taskTitle} | ${h.twinCode} | ${h.avgScore}/100 | ${h.decision} | ${h.date} |`);
    });
    lines.push("");
  }

  lines.push("---");
  lines.push("*This evidence package was generated by TwinHire. Evidence — not prediction — is the primary currency.*");

  return lines.join("\n");
}
