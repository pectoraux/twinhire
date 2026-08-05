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
  /// AI vs Human benchmark: how AI models scored on the same task
  aiBenchmarks?: AIBenchmark[]
}

/// AI model benchmark on the same task the candidate attempted.
export interface AIBenchmark {
  model: string
  score: number // 0-100 composite
  strength: string // what the AI did well
  weakness: string // what the AI missed
  timeSeconds: number // how long the AI took
}

/// A solved organizational problem stored in the platform's memory.
export interface SolvedProblem {
  id: string
  problem: string
  context: string
  solution: string
  impact: string
  solver: string // candidate handle
  twinCode: string
  industry: string
  capability: string
  aiAssisted: boolean
  worked: boolean // did the solution work in production?
  date: string
}

/// A simulated business event in the continuous twin.
export interface TwinEvent {
  id: string
  type: "sale" | "support_ticket" | "meeting" | "customer_complaint" | "invoice" | "supplier_issue" | "competitor_move" | "employee_change" | "kpi_shift" | "campaign_launch"
  description: string
  impact: string
  timestamp: string
  severity: "info" | "warning" | "critical"
}

/// Counterfactual hiring forecast — "what if we hired this person?"
export interface HiringForecast {
  candidate: string
  scenario: string
  projections: {
    timeframe: string
    revenue: number // projected delta %
    profit: number
    delivery: number
    morale: number
    innovation: number
    risk: number
  }[]
  summary: string
  confidence: number
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

// ── Capability Economy types ─────────────────────────────────────────

/// The Capability Genome — a structured definition of every capability.
/// This is the core intellectual property of the platform.
export interface CapabilityGenome {
  id: string
  name: string
  category: string
  /// What this capability contributes to (e.g. "Revenue Growth", "Manufacturing")
  contributesTo: string[]
  /// Which KPIs this capability improves
  improvesKpis: string[]
  /// Industries where this capability matters
  industries: string[]
  /// Prerequisite capabilities (must have before learning this)
  prerequisites: string[]
  /// Complementary capabilities (work well together)
  complementary: string[]
  /// Average salary premium for having this capability
  salaryPremium: string
  /// Demand trend (% growth year over year)
  demandTrend: number
  /// Risk of automation (0-100, higher = more likely to be automated)
  automationRisk: number
  /// AI augmentation opportunities (how AI can amplify this capability)
  aiAugmentation: string
  /// Projected ROI for a business adding this capability
  projectedRoi: string
  /// Knowledge areas required
  knowledge: string[]
  /// Skills required
  skills: string[]
  /// Behaviors expected
  behaviors: string[]
  /// Tools commonly used
  tools: string[]
  /// Evidence requirements (how to prove this capability)
  evidenceRequirements: string[]
  /// Learning paths to acquire this capability
  learningPaths: string[]
}

/// A capability discovered by the AI from business questions.
export interface DiscoveredCapability {
  name: string
  category: string
  projectedRevenueImpact: string
  projectedEbitdaImpact?: string
  costReduction?: string
  confidence: number
  urgency: "Critical" | "High" | "Medium" | "Low"
  timeToValue: string
  hiringDifficulty: number // 1-5
  aiReplaceLikelihood: number // 0-100
  aiAugmentLikelihood: number // 0-100
  recommendedOrder: number
}

/// Market intelligence for a capability.
export interface CapabilityMarketData {
  name: string
  category: string
  demandGrowth: number // % YoY
  medianSalary: string
  automationRisk: number // 0-100
  aiAugmentation: number // 0-100
  companiesInterested: number
  industries: string[]
}

/// Capability investment projection — "if I learn X, what happens?"
export interface CapabilityInvestment {
  capability: string
  currentSalary: string
  projectedSalary: string
  salaryDelta: string
  probability: number // % likelihood of achieving this
  timeRequired: string
  demandLevel: "Very High" | "High" | "Medium" | "Low"
  newOpportunities: number // % increase in opportunities
  hiringProbability: number // % increase
}

/// A capability in a candidate's wallet — evidence-backed, portable.
export interface CapabilityWalletEntry {
  capability: string
  score: number // 0-100, evidence-backed
  evidenceCount: number
  simulations: number
  lastDemonstrated: string
  portable: boolean // can be shown to other businesses
  certificationEligible: boolean
}
