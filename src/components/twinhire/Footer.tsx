"use client";

import { Boxes } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border/60 bg-secondary/40">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row">
          <div className="max-w-sm">
            <div className="flex items-center gap-2.5">
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-foreground text-background">
                <Boxes className="h-3.5 w-3.5" />
              </span>
              <span className="font-display text-lg">TwinHire</span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              An evidence-based recruitment operating system. Businesses run AI
              digital twins of themselves; candidates perform real work inside
              them; every outcome sharpens the next decision.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-x-12 gap-y-6 sm:grid-cols-3">
            <FooterCol
              title="The System"
              links={[
                "Business Intelligence",
                "Digital Twin",
                "Capability Engine",
                "Performance Intelligence",
                "Hiring Intelligence",
              ]}
            />
            <FooterCol
              title="Principles"
              links={[
                "Evidence over prediction",
                "Longitudinal, not one-shot",
                "Explainable by design",
                "Provider-agnostic AI",
                "Strict anonymization",
              ]}
            />
            <FooterCol
              title="Network"
              links={[
                "Twins improve with outcomes",
                "Benchmarks compound",
                "Closed-loop intelligence",
                "Multi-tenant & private",
                "Event-driven core",
              ]}
            />
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-border/60 pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center">
          <p>
            © {new Date().getFullYear()} TwinHire — a Talent Intelligence
            Network. Evidence, not prediction.
          </p>
          <p className="font-mono">
            demo build · v0.1 · {new Date().toISOString().slice(0, 10)}
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: string[] }) {
  return (
    <div>
      <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">
        {title}
      </h4>
      <ul className="mt-3 space-y-2">
        {links.map((l) => (
          <li key={l} className="text-sm text-muted-foreground">
            {l}
          </li>
        ))}
      </ul>
    </div>
  );
}
