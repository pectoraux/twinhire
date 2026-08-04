"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  ArrowRight,
  Boxes,
  BrainCircuit,
  Eye,
  GitBranch,
  Layers,
  Network,
  Radar,
  Sparkles,
  Target,
  TrendingUp,
  Workflow,
} from "lucide-react";
import { CountUp } from "./primitives";
import { NetworkGraph } from "./NetworkGraph";
import { NetworkEffectsPanel } from "./NetworkEffectsPanel";
import { LiveActivityFeed } from "./LiveActivityFeed";
import { RoleSwitcher, type Role } from "./RoleSwitcher";
import { Button } from "@/components/ui/button";
import type { ViewKey } from "./Nav";

const fade = {
  hidden: { opacity: 0, y: 18 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

const LAYERS = [
  { n: "01", icon: Radar, title: "Business Intelligence", desc: "Ingests CRM, ERP, support, docs, Slack, Linear — builds a living model of the company." },
  { n: "02", icon: Boxes, title: "Business Digital Twin", desc: "Not a chatbot. A living operational simulation with org, capability, process and market graphs." },
  { n: "03", icon: Target, title: "Capability Engine", desc: "Continuously surfaces capability gaps ranked by ROI — not job titles, but missing functions." },
  { n: "04", icon: Network, title: "Candidate Intelligence", desc: "A capability graph, not a résumé. Bring your own models or use the pooled AI." },
  { n: "05", icon: Workflow, title: "Digital Work Environment", desc: "Candidates enter anonymized twins and perform real, meaningful operational work." },
  { n: "06", icon: Eye, title: "Performance Intelligence", desc: "Every action becomes observable evidence across 10 dimensions. No black box." },
  { n: "07", icon: GitBranch, title: "Hiring Intelligence", desc: "Explainable recommendations. Outcomes flow back to retrain every twin." },
];

const TRADITIONAL_VS = [
  { old: "Predict potential from a résumé", neu: "Observe actual work inside the business" },
  { old: "Keyword matching to job titles", neu: "Operational fit against real capability gaps" },
  { old: "One interview, one snapshot", neu: "Longitudinal evidence across sessions" },
  { old: "Hiring outcome: a guess", neu: "Hiring outcome: a data point that retrains the twin" },
];

export function HeroView({ onNavigate }: { onNavigate: (v: ViewKey) => void }) {
  const [role, setRole] = useState<Role>("business");
  return (
    <div className="relative overflow-hidden bg-grain">
      {/* Ambient gradient washes */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(60% 50% at 15% 0%, oklch(0.52 0.11 165 / 0.10), transparent 60%), radial-gradient(50% 40% at 85% 10%, oklch(0.74 0.135 70 / 0.10), transparent 60%)",
        }}
      />

      {/* HERO */}
      <section className="mx-auto max-w-7xl px-4 pb-16 pt-12 sm:px-6 sm:pt-20 lg:px-8 lg:pb-24">
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_1fr]">
          {/* Left: copy */}
          <motion.div
            initial="hidden"
            animate="show"
            className="flex flex-col items-start gap-6"
          >
            <motion.div custom={0} variants={fade} className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/60 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Evidence-based recruitment operating system
            </motion.div>

            <motion.h1
              custom={1}
              variants={fade}
              className="display-hero max-w-2xl text-[clamp(2.5rem,6vw,5rem)] text-balance"
            >
              Stop predicting potential.
              <br />
              <span className="ink-emerald italic">Watch them perform.</span>
            </motion.h1>

            <motion.p
              custom={2}
              variants={fade}
              className="max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg"
            >
              Every company owns an AI digital twin. Candidates don&apos;t apply —
              they <span className="font-medium text-foreground">work inside the twin</span>.
              Businesses hire on observed evidence instead of assumptions, and every
              outcome makes the next simulation more accurate.
            </motion.p>

            <motion.div custom={3} variants={fade} className="flex flex-wrap items-center gap-3">
              <Button size="lg" className="h-12 gap-2 rounded-full px-6 text-base" onClick={() => onNavigate("dashboard")}>
                Enter the talent network
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" className="h-12 gap-2 rounded-full px-6 text-base" onClick={() => onNavigate("dashboard")}>
                <Workflow className="h-4 w-4" />
                See how it works
              </Button>
            </motion.div>
          </motion.div>

          {/* Right: living network visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="relative mx-auto w-full max-w-[560px]"
          >
            <div className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-primary/[0.04] blur-2xl" />
            <NetworkGraph />
            <p className="mt-4 text-center text-xs text-muted-foreground">
              A live view of the Talent Intelligence Network — work flows out,
              evidence flows back, twins learn.
            </p>
          </motion.div>
        </div>

        {/* Stat band */}
        <motion.dl
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border/60 bg-border/60 sm:grid-cols-4"
        >
          {[
            { v: 4, suffix: "", label: "Anonymized business twins", decimals: 0 },
            { v: 77, suffix: "", label: "Capabilities identified", decimals: 0 },
            { v: 58, suffix: "", label: "Observed sessions in network", decimals: 0 },
            { v: 10, suffix: "", label: "Performance dimensions measured", decimals: 0 },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              custom={i}
              variants={fade}
              className="bg-card p-5 sm:p-6"
            >
              <dd className="font-display text-4xl text-foreground sm:text-5xl">
                <CountUp value={s.v} decimals={s.decimals} suffix={s.suffix} />
              </dd>
              <dt className="mt-1 text-xs text-muted-foreground sm:text-sm">{s.label}</dt>
            </motion.div>
          ))}
        </motion.dl>
      </section>

      {/* Premium visual band */}
      <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-3xl border border-border/60"
        >
          <img
            src="/twinhire-hero.png"
            alt="Abstract visualization of the TwinHire talent intelligence network"
            className="h-full w-full object-cover"
            loading="lazy"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-4">
            <p className="max-w-md text-pretty text-sm text-foreground/80 backdrop-blur-sm">
              A network where evidence — not prediction — is the primary currency.
            </p>
            <span className="shrink-0 rounded-full bg-background/80 px-3 py-1 text-[10px] font-medium text-muted-foreground backdrop-blur">
              Talent Intelligence Network
            </span>
          </div>
        </motion.div>
      </section>

      {/* PHILOSOPHY SHIFT */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="The shift"
          title="From a static marketplace to an evolving intelligence network"
          desc="Traditional hiring asks: “Can this person probably perform?” TwinHire asks: “Let's watch them perform.”"
        />
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-border/60 bg-card p-6">
            <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              <span className="h-px w-6 bg-muted-foreground/40" /> Traditional hiring
            </h3>
            <ul className="mt-5 space-y-3">
              {TRADITIONAL_VS.map((r) => (
                <li key={r.old} className="flex items-start gap-3 text-sm text-muted-foreground line-through decoration-muted-foreground/40">
                  {r.old}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-primary/30 bg-primary/[0.04] p-6">
            <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-primary">
              <Sparkles className="h-3.5 w-3.5" /> TwinHire
            </h3>
            <ul className="mt-5 space-y-3">
              {TRADITIONAL_VS.map((r) => (
                <li key={r.neu} className="flex items-start gap-3 text-sm text-foreground">
                  <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span>{r.neu}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ROLE-BASED PERSPECTIVES */}
      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Two sides, one network"
          title="Whether you're hiring or being hired"
          desc="TwinHire serves both businesses and candidates — each with a different entry point into the same intelligence network."
        />
        <div className="mt-8">
          <RoleSwitcher role={role} onChange={setRole} onNavigate={onNavigate} />
        </div>
      </section>

      {/* SEVEN LAYERS */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Architecture"
          title="Seven intelligence layers, one closed loop"
          desc="Each layer feeds the next. Hiring outcomes flow back as training signal, so every twin becomes more accurate over time."
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {LAYERS.map((l, i) => (
            <motion.div
              key={l.n}
              custom={i}
              variants={fade}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-60px" }}
              className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card p-6 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
            >
              <div className="flex items-center justify-between">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-secondary text-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <l.icon className="h-5 w-5" />
                </span>
                <span className="font-mono text-xs text-muted-foreground">{l.n}</span>
              </div>
              <h3 className="mt-4 font-display text-xl">{l.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{l.desc}</p>
            </motion.div>
          ))}
          <motion.div
            custom={7}
            variants={fade}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            className="flex flex-col justify-center rounded-2xl border border-dashed border-primary/40 bg-primary/[0.04] p-6"
          >
            <BrainCircuit className="h-6 w-6 text-primary" />
            <h3 className="mt-3 font-display text-xl">Twin Learning System</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Every observation updates processes, knowledge, markets,
              capabilities, and hiring success. The network compounds.
            </p>
          </motion.div>
        </div>
      </section>

      {/* THE LOOP */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="The closed loop"
          title="Evidence becomes the currency of hiring"
          desc="Businesses reveal capability gaps. Candidates demonstrate ability. Outcomes retrain the twins. The whole network gets smarter."
        />
        <div className="mt-10 grid gap-4 md:grid-cols-4">
          {[
            { icon: Radar, t: "Reveal gaps", d: "The twin surfaces the highest-ROI missing capabilities." },
            { icon: Workflow, t: "Observe work", d: "Candidates perform real operational tasks inside the twin." },
            { icon: TrendingUp, t: "Hire on evidence", d: "Explainable recommendations, backed by observable proof." },
            { icon: Layers, t: "Retrain", d: "Outcomes flow back; the twin's fidelity rises." },
          ].map((s, i) => (
            <motion.div
              key={s.t}
              custom={i}
              variants={fade}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-60px" }}
              className="relative rounded-2xl border border-border/60 bg-card p-5"
            >
              <div className="flex items-center gap-2">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary">
                  <s.icon className="h-4 w-4" />
                </span>
                <span className="font-mono text-xs text-muted-foreground">0{i + 1}</span>
              </div>
              <h3 className="mt-3 text-sm font-semibold">{s.t}</h3>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{s.d}</p>
              {i < 3 && (
                <ArrowRight className="absolute -right-3 top-1/2 hidden h-4 w-4 -translate-y-1/2 text-muted-foreground/50 md:block" />
              )}
            </motion.div>
          ))}
        </div>

        {/* Network effects + live activity — the network is alive */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7 }}
          className="mt-12 grid gap-4 lg:grid-cols-2"
        >
          <NetworkEffectsPanel />
          <LiveActivityFeed />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7 }}
          className="mt-8 flex flex-col items-center gap-4 rounded-3xl border border-border/60 bg-gradient-to-br from-card to-secondary/40 p-10 text-center"
        >
          <p className="font-display text-2xl text-balance sm:text-3xl">
            “Let&apos;s watch them perform.”
          </p>
          <Button size="lg" className="h-12 gap-2 rounded-full px-6" onClick={() => onNavigate("dashboard")}>
            Step into the network
            <ArrowRight className="h-4 w-4" />
          </Button>
        </motion.div>
      </section>
    </div>
  );
}

function SectionHeading({ eyebrow, title, desc }: { eyebrow: string; title: string; desc: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6 }}
      className="max-w-2xl"
    >
      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">{eyebrow}</span>
      <h2 className="mt-3 font-display text-3xl text-balance sm:text-4xl">{title}</h2>
      <p className="mt-3 text-pretty text-base leading-relaxed text-muted-foreground">{desc}</p>
    </motion.div>
  );
}
