"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Layers,
  Loader2,
  Plus,
  Sparkles,
  TrendingUp,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { BusinessTwinView } from "@/lib/twinhire/types";

/**
 * CapabilityRecipes — discovers combinations that outperform isolated investments.
 *
 * One capability rarely works alone. The platform discovers recipes:
 * "AI Workflow Design + Process Mapping + Change Management = Highest ROI"
 *
 * Also models capability compounding — how one capability changes the
 * value of another.
 */

interface Recipe {
  name: string
  capabilities: string[]
  combinedRoi: string
  isolatedRoi: string
  multiplier: number
  whyItWorks: string
  sequence: string[]
  timeToValue: string
  confidence: number
}

interface CompoundingEffect {
  baseCapability: string
  baseValue: number
  withEnhancer: string
  enhancedValue: number
  multiplier: number
  reasoning: string
}

export function CapabilityRecipes({ twin }: { twin: BusinessTwinView }) {
  const [result, setResult] = useState<{
    recipes: Recipe[]
    compoundingEffects: CompoundingEffect[]
    recommendation: string
  } | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const discover = async () => {
    setLoading(true)
    setError("")
    setResult(null)
    try {
      const res = await fetch("/api/twinhire/capability-recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ twinId: twin.id }),
      })
      if (!res.ok) throw new Error("failed")
      const data = await res.json()
      setResult(data)
    } catch {
      setError("Recipe discovery failed — try again")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-2xl border border-border/60 bg-card p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="flex items-center gap-2 text-sm font-semibold">
            <Layers className="h-4 w-4 text-primary" /> Capability recipes
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Combinations that outperform isolated investments. One capability rarely works alone.
          </p>
        </div>
        {result && (
          <Badge className="rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
            <Sparkles className="mr-1 h-2.5 w-2.5" /> AI-discovered
          </Badge>
        )}
      </div>

      {/* Discover button */}
      {!result && (
        <div className="mt-4 flex flex-col items-center gap-3 py-8">
          <p className="max-w-md text-center text-xs text-muted-foreground">
            The AI will discover combinations of capabilities that consistently outperform isolated
            investments for this twin&apos;s industry and context.
          </p>
          <Button onClick={discover} disabled={loading} className="h-10 gap-1.5 rounded-full px-5">
            {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Discovering…</> : <><Sparkles className="h-4 w-4" /> Discover recipes</>}
          </Button>
          {error && <p className="text-xs text-rose-600">{error}</p>}
        </div>
      )}

      <AnimatePresence>
        {result && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-5 space-y-4">
            {/* Recipes */}
            <div className="space-y-3">
              {result.recipes.map((recipe, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="rounded-xl border border-border/50 bg-secondary/20 p-4"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold">{recipe.name}</span>
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "rounded-full px-2 py-0.5 text-[9px] font-bold",
                        recipe.multiplier >= 2.0
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"
                          : "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
                      )}>
                        {recipe.multiplier}x multiplier
                      </span>
                      <span className="font-mono text-[10px] text-muted-foreground">{recipe.confidence}%</span>
                    </div>
                  </div>

                  {/* Capabilities */}
                  <div className="mt-2 flex flex-wrap items-center gap-1.5">
                    {recipe.capabilities.map((cap, ci) => (
                      <span key={cap} className="flex items-center gap-1">
                        {ci > 0 && <Plus className="h-2.5 w-2.5 text-muted-foreground" />}
                        <span className="rounded-md bg-card px-1.5 py-0.5 text-[10px] border border-border/40">{cap}</span>
                      </span>
                    ))}
                    <ArrowRight className="h-3 w-3 text-primary" />
                    <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">{recipe.combinedRoi}</span>
                  </div>

                  {/* ROI comparison */}
                  <div className="mt-2 flex items-center gap-4 text-[10px] text-muted-foreground">
                    <span>Combined: <span className="font-semibold text-foreground">{recipe.combinedRoi}</span></span>
                    <span>Isolated: <span className="font-semibold">{recipe.isolatedRoi}</span></span>
                    <span>Time: <span className="font-semibold">{recipe.timeToValue}</span></span>
                  </div>

                  {/* Why it works */}
                  <p className="mt-2 text-[10px] leading-relaxed text-muted-foreground italic">{recipe.whyItWorks}</p>

                  {/* Sequence */}
                  <div className="mt-2 flex flex-wrap items-center gap-1">
                    <span className="text-[9px] font-medium uppercase tracking-wider text-muted-foreground">Sequence:</span>
                    {recipe.sequence.map((step, si) => (
                      <span key={si} className="flex items-center gap-1">
                        {si > 0 && <ArrowRight className="h-2 w-2 text-muted-foreground/50" />}
                        <span className="text-[9px] text-muted-foreground">{step}</span>
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Compounding effects */}
            <div>
              <div className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-wider text-primary">
                <TrendingUp className="h-3 w-3" /> Capability compounding
              </div>
              <div className="mt-2 space-y-2">
                {result.compoundingEffects.map((eff, i) => (
                  <div key={i} className="flex items-center gap-3 rounded-xl border border-border/40 bg-secondary/20 p-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 text-xs">
                        <span className="font-medium">{eff.baseCapability}</span>
                        <span className="text-muted-foreground">+</span>
                        <span className="font-medium text-primary">{eff.withEnhancer}</span>
                      </div>
                      <p className="mt-0.5 text-[9px] text-muted-foreground">{eff.reasoning}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="text-center">
                        <div className="font-mono text-xs text-muted-foreground line-through">{eff.baseValue}</div>
                        <div className="text-[8px] text-muted-foreground">base</div>
                      </div>
                      <ArrowRight className="h-3 w-3 text-primary" />
                      <div className="text-center">
                        <div className="font-mono text-sm font-bold text-emerald-600 dark:text-emerald-400">{eff.enhancedValue}</div>
                        <div className="text-[8px] text-muted-foreground">enhanced</div>
                      </div>
                      <div className={cn(
                        "rounded-full px-1.5 py-0.5 text-[9px] font-bold",
                        eff.multiplier >= 1.5 ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300" : "bg-secondary text-muted-foreground",
                      )}>
                        {eff.multiplier}x
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendation */}
            <div className="rounded-xl bg-gradient-to-r from-primary/[0.06] to-[oklch(0.74_0.135_70)]/[0.06] p-4">
              <div className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-wider text-primary">
                <Zap className="h-3 w-3" /> Recommended first recipe
              </div>
              <p className="mt-1 text-sm leading-relaxed text-foreground/90">{result.recommendation}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
