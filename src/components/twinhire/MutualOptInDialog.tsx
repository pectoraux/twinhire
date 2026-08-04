"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  EyeOff,
  Handshake,
  Lock,
  Shield,
  Sparkles,
  UserCheck,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Recommendation } from "@/lib/twinhire/types";

type Step = "idle" | "candidate" | "pending" | "business" | "revealed";

/**
 * MutualOptInDialog — makes the anonymization principle tangible.
 *
 * The vision: "strict anonymization so candidates cannot identify businesses
 * until both parties mutually opt into an interview."
 *
 * Flow: candidate requests → business reviews evidence → business opts in →
 * identities revealed to both. No unilateral reveal.
 */
export function MutualOptInDialog({
  recommendation,
  twinCode,
  twinIndustry,
  candidateName,
  avgScore,
  sessionCount,
}: {
  recommendation: Recommendation;
  twinCode: string;
  twinIndustry: string;
  candidateName: string;
  avgScore: number;
  sessionCount: number;
}) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>("idle");

  const eligible =
    recommendation.decision === "interview_now" ||
    recommendation.decision === "observe_longer" ||
    recommendation.decision === "future_fit";

  const trigger = (
    <Button
      onClick={() => {
        setOpen(true);
        setStep("candidate");
      }}
      disabled={!eligible}
      className={cn(
        "h-11 gap-1.5 rounded-full px-5",
        !eligible && "opacity-50",
      )}
    >
      <Handshake className="h-4 w-4" />
      {eligible ? "Request interview" : "Not eligible yet"}
    </Button>
  );

  if (!eligible) {
    return (
      <div className="flex flex-col items-center gap-2">
        {trigger}
        <p className="text-xs text-muted-foreground">
          Mutual opt-in unlocks when evidence supports an interview.
        </p>
      </div>
    );
  }

  return (
    <>
      {trigger}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 grid place-items-center bg-background/70 p-4 backdrop-blur-sm"
            onClick={() => step !== "pending" && step !== "revealed" && setOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-border/60 bg-card shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-border/60 px-6 py-4">
                <div className="flex items-center gap-2">
                  <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary">
                    <Shield className="h-4 w-4" />
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold">Mutual interview opt-in</h3>
                    <p className="text-[11px] text-muted-foreground">
                      Identities stay hidden until both parties consent
                    </p>
                  </div>
                </div>
                {step !== "pending" && step !== "revealed" && (
                  <button
                    onClick={() => setOpen(false)}
                    className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-secondary"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Progress steps */}
              <div className="flex items-center gap-1 px-6 pt-4">
                {[
                  { key: "candidate", label: "Candidate opts in", icon: UserCheck },
                  { key: "business", label: "Business opts in", icon: EyeOff },
                  { key: "revealed", label: "Identities revealed", icon: Sparkles },
                ].map((s, i) => {
                  const active = isStepAtOrPast(step, s.key);
                  return (
                    <div key={s.key} className="flex flex-1 items-center">
                      <div
                        className={cn(
                          "flex items-center gap-1.5 rounded-full px-2 py-1 text-[10px] font-medium transition-colors",
                          active
                            ? "bg-primary/10 text-primary"
                            : "bg-secondary text-muted-foreground",
                        )}
                      >
                        <s.icon className="h-3 w-3" />
                        <span className="hidden sm:inline">{s.label}</span>
                      </div>
                      {i < 2 && (
                        <div className={cn("h-px flex-1", active ? "bg-primary/30" : "bg-border")} />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Body */}
              <div className="p-6">
                <AnimatePresence mode="wait">
                  {step === "candidate" && (
                    <StepBody
                      key="candidate"
                      icon={UserCheck}
                      title="You're requesting an interview"
                      desc="You're opting in to reveal your identity to this business. They will see your full capability graph and evidence trail."
                      twinLabel="Twin"
                      twinValue={`${twinCode} · ${twinIndustry}`}
                      evidence={[
                        { label: "Composite score", value: `${avgScore}/100` },
                        { label: "Sessions observed", value: String(sessionCount) },
                        { label: "Recommendation", value: recommendation.headline },
                      ]}
                      action={
                        <Button
                          onClick={() => setStep("pending")}
                          className="h-10 w-full gap-1.5 rounded-full"
                        >
                          <Lock className="h-3.5 w-3.5" />
                          I opt in — request the interview
                        </Button>
                      }
                    />
                  )}

                  {step === "pending" && (
                    <StepBody
                      key="pending"
                      icon={EyeOff}
                      title="Waiting for the business to opt in"
                      desc="The business has been notified with your anonymized evidence. They must also opt in before either identity is revealed. This usually takes 1–3 business days."
                      twinLabel="Status"
                      twinValue="Awaiting mutual consent"
                      evidence={[
                        { label: "Your identity", value: "Hidden" },
                        { label: "Business identity", value: "Hidden" },
                        { label: "Shared with business", value: "Anonymized evidence only" },
                      ]}
                      action={
                        <div className="flex items-center justify-center gap-2 rounded-full bg-secondary/60 px-4 py-2.5 text-sm text-muted-foreground">
                          <span className="relative flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-500" />
                          </span>
                          Pending mutual consent…
                        </div>
                      }
                      simulateBusiness
                      onSimulateBusiness={() => setStep("business")}
                    />
                  )}

                  {step === "business" && (
                    <StepBody
                      key="business"
                      icon={Handshake}
                      title="The business has opted in"
                      desc={`${twinCode} reviewed your evidence and consented to reveal their identity. Both parties have now mutually opted in.`}
                      twinLabel="Mutual consent"
                      twinValue="Confirmed"
                      evidence={[
                        { label: "Candidate consent", value: "Given" },
                        { label: "Business consent", value: "Given" },
                        { label: "Identities", value: "Ready to reveal" },
                      ]}
                      action={
                        <Button
                          onClick={() => setStep("revealed")}
                          className="h-10 w-full gap-1.5 rounded-full"
                        >
                          <Sparkles className="h-3.5 w-3.5" />
                          Reveal identities
                        </Button>
                      }
                    />
                  )}

                  {step === "revealed" && (
                    <motion.div
                      key="revealed"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                        className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400"
                      >
                        <CheckCircle2 className="h-7 w-7" />
                      </motion.div>
                      <h4 className="mt-4 font-display text-xl">Identities revealed</h4>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Both parties mutually opted in. You can now schedule the interview directly.
                      </p>
                      <div className="mt-5 grid grid-cols-2 gap-3 text-left">
                        <div className="rounded-xl border border-border/60 bg-secondary/40 p-3">
                          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Candidate</div>
                          <div className="mt-0.5 text-sm font-semibold">{candidateName}</div>
                          <div className="text-xs text-muted-foreground">observer-77</div>
                        </div>
                        <div className="rounded-xl border border-border/60 bg-secondary/40 p-3">
                          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Business twin</div>
                          <div className="mt-0.5 text-sm font-semibold">{twinCode}</div>
                          <div className="text-xs text-muted-foreground">{twinIndustry}</div>
                        </div>
                      </div>
                      <Button
                        onClick={() => {
                          setOpen(false);
                          setStep("idle");
                        }}
                        className="mt-5 h-10 w-full gap-1.5 rounded-full"
                      >
                        <ArrowRight className="h-4 w-4" />
                        Continue
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function isStepAtOrPast(current: Step, target: string): boolean {
  const order: Step[] = ["candidate", "pending", "business", "revealed"];
  const ci = order.indexOf(current);
  const ti = order.indexOf(target as Step);
  return ci >= 0 && ti >= 0 && ci >= ti;
}

function StepBody({
  icon: Icon,
  title,
  desc,
  twinLabel,
  twinValue,
  evidence,
  action,
  simulateBusiness,
  onSimulateBusiness,
}: {
  icon: React.ElementType;
  title: string;
  desc: string;
  twinLabel: string;
  twinValue: string;
  evidence: { label: string; value: string }[];
  action: React.ReactNode;
  simulateBusiness?: boolean;
  onSimulateBusiness?: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-start gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </span>
        <div>
          <h4 className="text-sm font-semibold">{title}</h4>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{desc}</p>
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-border/50 bg-secondary/30 p-3">
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{twinLabel}</div>
        <div className="mt-0.5 text-sm font-medium">{twinValue}</div>
      </div>

      <dl className="mt-3 space-y-1.5">
        {evidence.map((e) => (
          <div key={e.label} className="flex items-center justify-between text-xs">
            <dt className="text-muted-foreground">{e.label}</dt>
            <dd className="font-medium">{e.value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-5">
        {action}
        {simulateBusiness && (
          <button
            onClick={onSimulateBusiness}
            className="mt-2 w-full text-center text-[11px] text-muted-foreground underline-offset-2 hover:underline"
          >
            (Demo: simulate the business opting in)
          </button>
        )}
      </div>
    </motion.div>
  );
}
