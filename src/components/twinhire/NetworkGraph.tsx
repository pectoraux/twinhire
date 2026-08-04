"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * NetworkGraph — a living visualization of the TwinHire Talent Intelligence Network.
 *
 * Rendered as a single animated SVG:
 *  - Twin nodes (business digital twins) arranged on an outer arc
 *  - A central candidate node
 *  - Pulsing connection links between candidate and each twin
 *  - Flowing "evidence particles" traveling along the links (candidate → twin = work;
 *    twin → candidate = evaluation/evidence flowing back)
 *  - A faint conic "intelligence field" rotating behind the network
 *
 * Designed to feel premium, calm, and alive — never busy.
 */

type NodePos = { x: number; y: number; code: string }

const TWINS: { code: string; hue: number }[] = [
  { code: "482", hue: 165 },
  { code: "317", hue: 70 },
  { code: "604", hue: 140 },
  { code: "129", hue: 350 },
]

const VIEW = 560
const CENTER = VIEW / 2
const TWIN_RADIUS = 200

function twinPositions(): NodePos[] {
  return TWINS.map((t, i) => {
    const angle = (Math.PI * 2 * i) / TWINS.length - Math.PI / 2
    return {
      x: CENTER + Math.cos(angle) * TWIN_RADIUS,
      y: CENTER + Math.sin(angle) * TWIN_RADIUS,
      code: t.code,
    }
  })
}

export function NetworkGraph({ className }: { className?: string }) {
  const twins = useMemo(twinPositions, [])
  const [particles, setParticles] = useState<
    { id: number; from: "c" | "t"; twinIdx: number; t: number; hue: number }[]
  >([])

  // Spawn flowing evidence particles on an interval.
  useEffect(() => {
    let id = 0
    const interval = setInterval(() => {
      const twinIdx = Math.floor(Math.random() * TWINS.length)
      const dir: "c" | "t" = Math.random() > 0.5 ? "c" : "t"
      setParticles((prev) => [
        ...prev.slice(-7),
        { id: id++, from: dir, twinIdx, t: 0, hue: TWINS[twinIdx].hue },
      ])
    }, 700)
    return () => clearInterval(interval)
  }, [])

  // Animate particle progress with rAF.
  useEffect(() => {
    let raf = 0
    let last = performance.now()
    const tick = (now: number) => {
      const dt = (now - last) / 1000
      last = now
      setParticles((prev) =>
        prev
          .map((p) => ({ ...p, t: p.t + dt * 0.6 }))
          .filter((p) => p.t < 1.05),
      )
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  const pointAt = (twinIdx: number, t: number) => {
    const twin = twins[twinIdx]
    const x = CENTER + (twin.x - CENTER) * t
    const y = CENTER + (twin.y - CENTER) * t
    return { x, y }
  }

  return (
    <div className={cn("relative aspect-square w-full max-w-[560px]", className)}>
      <svg viewBox={`0 0 ${VIEW} ${VIEW}`} className="h-full w-full" role="img" aria-label="TwinHire talent intelligence network">
        <defs>
          <radialGradient id="field" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="oklch(0.52 0.11 165 / 0.10)" />
            <stop offset="60%" stopColor="oklch(0.74 0.135 70 / 0.05)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
          <linearGradient id="link" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="oklch(0.52 0.11 165 / 0.5)" />
            <stop offset="100%" stopColor="oklch(0.52 0.11 165 / 0.1)" />
          </linearGradient>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Intelligence field */}
        <motion.circle
          cx={CENTER}
          cy={CENTER}
          r={TWIN_RADIUS + 30}
          fill="url(#field)"
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: `${CENTER}px ${CENTER}px` }}
        />

        {/* Orbit ring */}
        <circle
          cx={CENTER}
          cy={CENTER}
          r={TWIN_RADIUS}
          fill="none"
          stroke="oklch(0.5 0.01 95 / 0.18)"
          strokeWidth={1}
          strokeDasharray="2 6"
          className="dark:stroke-white/10"
        />

        {/* Links candidate → twin */}
        {twins.map((twin, i) => (
          <g key={`link-${twin.code}`}>
            <line
              x1={CENTER}
              y1={CENTER}
              x2={twin.x}
              y2={twin.y}
              stroke="url(#link)"
              strokeWidth={1.25}
              opacity={0.5}
            />
            {/* pulsing travel highlight */}
            <motion.line
              x1={CENTER}
              y1={CENTER}
              x2={twin.x}
              y2={twin.y}
              stroke="oklch(0.52 0.11 165)"
              strokeWidth={2}
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: [0, 1], opacity: [0, 0.7, 0] }}
              transition={{ duration: 2.4, delay: i * 0.6, repeat: Infinity, repeatDelay: 1.2 }}
            />
          </g>
        ))}

        {/* Flowing evidence particles */}
        {particles.map((p) => {
          const pos = pointAt(p.twinIdx, p.t)
          if (p.t > 1) return null
          const fromTwin = p.from === "t"
          const t = fromTwin ? 1 - p.t : p.t
          const pp = pointAt(p.twinIdx, t)
          return (
            <circle
              key={p.id}
              cx={pp.x}
              cy={pp.y}
              r={3.5}
              fill={`oklch(0.72 0.12 ${p.hue})`}
              filter="url(#glow)"
              opacity={Math.sin(p.t * Math.PI)}
            />
          )
        })}

        {/* Twin nodes */}
        {twins.map((twin, i) => {
          const hue = TWINS[i].hue
          return (
            <motion.g
              key={`twin-${twin.code}`}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + i * 0.12, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              style={{ transformOrigin: `${twin.x}px ${twin.y}px` }}
            >
              {/* outer pulse */}
              <motion.circle
                cx={twin.x}
                cy={twin.y}
                r={26}
                fill="none"
                stroke={`oklch(0.72 0.12 ${hue} / 0.5)`}
                strokeWidth={1.5}
                animate={{ r: [26, 38, 26], opacity: [0.6, 0, 0.6] }}
                transition={{ duration: 3, delay: i * 0.5, repeat: Infinity, ease: "easeOut" }}
              />
              <circle
                cx={twin.x}
                cy={twin.y}
                r={22}
                fill="oklch(1 0 0)"
                stroke={`oklch(0.72 0.12 ${hue} / 0.7)`}
                strokeWidth={1.5}
                className="dark:fill-[oklch(0.205_0.008_95)]"
              />
              <text
                x={twin.x}
                y={twin.y - 1}
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-muted-foreground"
                style={{ fontSize: 8, fontWeight: 600, letterSpacing: 0.4 }}
              >
                TWIN
              </text>
              <text
                x={twin.x}
                y={twin.y + 9}
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-foreground"
                style={{ fontSize: 11, fontWeight: 700 }}
              >
                {twin.code}
              </text>
            </motion.g>
          )
        })}

        {/* Central candidate node */}
        <motion.g
          initial={{ opacity: 0, scale: 0.4 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.05, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformOrigin: `${CENTER}px ${CENTER}px` }}
        >
          <motion.circle
            cx={CENTER}
            cy={CENTER}
            r={44}
            fill="none"
            stroke="oklch(0.52 0.11 165 / 0.3)"
            strokeWidth={1}
            animate={{ r: [44, 58, 44], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeOut" }}
          />
          <circle
            cx={CENTER}
            cy={CENTER}
            r={36}
            fill="oklch(0.52 0.11 165)"
            filter="url(#glow)"
            className="dark:fill-[oklch(0.72_0.12_165)]"
          />
          <circle cx={CENTER} cy={CENTER} r={36} fill="none" stroke="oklch(1 0 0 / 0.25)" strokeWidth={1} />
          <text
            x={CENTER}
            y={CENTER - 4}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="oklch(0.99 0.004 95)"
            style={{ fontSize: 8, fontWeight: 600, letterSpacing: 0.6 }}
          >
            CANDIDATE
          </text>
          <text
            x={CENTER}
            y={CENTER + 8}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="oklch(0.99 0.004 95)"
            style={{ fontSize: 9, fontWeight: 500, opacity: 0.85 }}
          >
            capability graph
          </text>
        </motion.g>
      </svg>

      {/* Legend overlay */}
      <div className="pointer-events-none absolute bottom-2 left-1/2 flex -translate-x-1/2 items-center gap-4 rounded-full border border-border/60 bg-card/80 px-3 py-1.5 text-[10px] backdrop-blur">
        <span className="flex items-center gap-1.5 text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" /> work flows out
        </span>
        <span className="flex items-center gap-1.5 text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-[oklch(0.74_0.135_70)]" /> evidence flows back
        </span>
      </div>
    </div>
  )
}
