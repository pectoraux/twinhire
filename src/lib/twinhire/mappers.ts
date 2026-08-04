// Map raw Prisma rows to typed TwinHire view objects.

import type {
  BusinessTwinView,
  CandidateView,
  CapabilityGap,
  CapabilityNode,
  Kpi,
} from "./types"

type TwinRow = {
  id: string
  code: string
  industry: string
  sizeBand: string
  stage: string
  region: string
  tagline: string
  problems: string
  objectives: string
  kpis: string
  capabilities: string
  orgSnapshot: string
  fidelity: number
  sessionsObserved: number
}

type CandidateRow = {
  id: string
  handle: string
  displayName: string
  headline: string
  capabilityGraph: string
  profile: string
  reputation: number
  sessionsCompleted: number
}

function safeParse<T>(s: string | null | undefined, fallback: T): T {
  if (!s) return fallback
  try {
    return JSON.parse(s) as T
  } catch {
    return fallback
  }
}

export function mapTwin(r: TwinRow): BusinessTwinView {
  return {
    id: r.id,
    code: r.code,
    industry: r.industry,
    sizeBand: r.sizeBand,
    stage: r.stage,
    region: r.region,
    tagline: r.tagline,
    problems: safeParse<string[]>(r.problems, []),
    objectives: safeParse<string[]>(r.objectives, []),
    kpis: safeParse<Kpi[]>(r.kpis, []),
    capabilities: safeParse<CapabilityGap[]>(r.capabilities, []),
    orgSnapshot: safeParse(r.orgSnapshot, {
      departments: [],
      techStack: [],
      decisionStyle: "",
      cultureNotes: [],
    }),
    fidelity: r.fidelity,
    sessionsObserved: r.sessionsObserved,
  }
}

export function mapCandidate(r: CandidateRow): CandidateView {
  return {
    id: r.id,
    handle: r.handle,
    displayName: r.displayName,
    headline: r.headline,
    capabilityGraph: safeParse<CapabilityNode[]>(r.capabilityGraph, []),
    profile: safeParse(r.profile, {
      availability: "",
      languages: [],
      preferredStack: [],
      aiLeverage: "",
      workStyle: "",
    }),
    reputation: r.reputation,
    sessionsCompleted: r.sessionsCompleted,
  }
}
