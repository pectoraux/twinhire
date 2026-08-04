// TwinHire shared domain types

export interface Kpi {
  label: string
  value: string
  unit: string
  trend: "up" | "down" | "flat"
  delta?: string
}

export interface CapabilityGap {
  key: string
  title: string
  category:
    | "Revenue"
    | "Operations"
    | "Product"
    | "Customer"
    | "Data"
    | "Engineering"
    | "Growth"
    | "Knowledge"
  problem: string
  evidence: string
  businessImpact: string
  estRevenueImpact: string
  estTimeSavings: string
  /// Estimated impact on customer satisfaction (qualitative)
  customerImpact?: string
  /// Strategic importance (1-5)
  strategicImportance?: 1 | 2 | 3 | 4 | 5
  /// Risk of not addressing this gap (1-5)
  risk?: 1 | 2 | 3 | 4 | 5
  difficulty: 1 | 2 | 3 | 4 | 5
  urgency: 1 | 2 | 3 | 4 | 5
  confidence: number // 0-100
  expectedRoi: number // 0-100 composite score used for ranking
}

export interface BusinessTwinView {
  id: string
  code: string
  industry: string
  sizeBand: string
  stage: string
  region: string
  tagline: string
  problems: string[]
  objectives: string[]
  kpis: Kpi[]
  capabilities: CapabilityGap[]
  /// Lightweight items for the "long tail" of identified capabilities (not full gaps)
  capabilityBacklog: CapabilityBacklogItem[]
  /// Total count of capabilities the engine has identified for this twin
  capabilitiesIdentified: number
  orgSnapshot: {
    departments: string[]
    techStack: string[]
    decisionStyle: string
    cultureNotes: string[]
  }
  fidelity: number
  sessionsObserved: number
}

/// A lightweight capability identified by the engine but not yet fully scoped into a gap.
export interface CapabilityBacklogItem {
  title: string
  category: CapabilityGap["category"]
  expectedRoi: number
}

export interface CapabilityNode {
  domain: string
  level: 1 | 2 | 3 | 4 | 5
  confidence: number
}

export interface CandidateView {
  id: string
  handle: string
  displayName: string
  headline: string
  capabilityGraph: CapabilityNode[]
  profile: {
    availability: string
    languages: string[]
    preferredStack: string[]
    aiLeverage: string
    workStyle: string
    /// Reasoning style (e.g. "First-principles", "Analogy-driven")
    reasoningStyle?: string
    /// Learning speed (e.g. "Fast — adapts within 1 session")
    learningSpeed?: string
    /// Career goals
    goals?: string
    /// AI tools the candidate uses
    aiTools?: string[]
    /// Coding ability (1-5)
    codingAbility?: 1 | 2 | 3 | 4 | 5
    /// Writing ability (1-5)
    writingAbility?: 1 | 2 | 3 | 4 | 5
    /// Research ability (1-5)
    researchAbility?: 1 | 2 | 3 | 4 | 5
    /// Certifications
    certifications?: string[]
    /// Education
    education?: string
    /// Domain expertise
    domainExpertise?: string[]
  }
  reputation: number
  sessionsCompleted: number
}

export interface WorkTask {
  taskTitle: string
  taskBrief: string
  contextBundle: {
    role: string
    situation: string
    artifacts: { name: string; type: string; summary: string }[]
    constraints: string[]
    successCriteria: string[]
  }
}

export interface MetricScore {
  key: string
  label: string
  score: number // 0-100
  note: string
}

export interface EvidenceItem {
  metric: string
  observation: string
  quote?: string
  signal: "strength" | "concern" | "neutral"
}

export interface Evaluation {
  summary: string
  scores: MetricScore[]
  evidence: EvidenceItem[]
  businessImpact: string
  aiLeverageAssessment: string
  redFlags: string[]
  highlights: string[]
  /// System confidence in this evaluation (0-100), computed from evidence
  /// count, score variance, and response richness.
  systemConfidence?: number
}

export interface Recommendation {
  decision: "interview_now" | "observe_longer" | "another_challenge" | "not_a_fit" | "future_fit"
  headline: string
  rationale: string
  confidence: number
  suggestedNextStep: string
  evidenceRefs: string[]
}

export const METRIC_KEYS = [
  "quality",
  "accuracy",
  "initiative",
  "ownership",
  "consistency",
  "curiosity",
  "learning",
  "problem_solving",
  "creativity",
  "decision_quality",
  "communication",
  "speed",
  "attention_to_detail",
  "collaboration",
  "ai_leverage",
  "improvement_over_time",
  "autonomy",
] as const

export const METRIC_LABELS: Record<string, string> = {
  quality: "Quality",
  accuracy: "Accuracy",
  initiative: "Initiative",
  ownership: "Ownership",
  consistency: "Consistency",
  curiosity: "Curiosity",
  learning: "Learning",
  problem_solving: "Problem Solving",
  creativity: "Creativity",
  decision_quality: "Decision Quality",
  communication: "Communication",
  speed: "Speed & Throughput",
  attention_to_detail: "Attention to Detail",
  collaboration: "Collaboration",
  ai_leverage: "AI Leverage",
  improvement_over_time: "Improvement Over Time",
  autonomy: "Autonomy",
}
