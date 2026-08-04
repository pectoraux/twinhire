// TwinHire seed data — anonymized business digital twins + demo candidate.
// Rich, realistic operational snapshots used to power the simulation.

import { db } from "@/lib/db"
import type { BusinessTwinView, CandidateView, CapabilityGap, Kpi } from "./types"

const TWINS: Omit<BusinessTwinView, "id">[] = [
  {
    code: "TWIN-482",
    industry: "Healthcare SaaS",
    sizeBand: "75 employees",
    stage: "Series A",
    region: "North America",
    tagline: "Clinical workflow platform losing momentum after a strong launch.",
    problems: [
      "Customer churn creeping up to 9.4% quarterly, concentrated in mid-market accounts",
      "Support knowledge is fragmented across Slack, Notion, Zendesk and tribal memory",
      "Onboarding a new clinic takes 34 days vs. the 14-day target",
      "Product-led growth stalled; expansion revenue flat for two quarters",
    ],
    objectives: [
      "Expand into EU healthcare markets within 12 months",
      "Reduce net revenue churn to below 4%",
      "Compress onboarding to 18 days",
      "Launch a self-serve analytics module",
    ],
    kpis: [
      { label: "Net Revenue Retention", value: "92", unit: "%", trend: "down", delta: "-3.1pt QoQ" },
      { label: "Time-to-Value", value: "34", unit: "days", trend: "up", delta: "+6 days QoQ" },
      { label: "Support CSAT", value: "3.9", unit: "/5", trend: "down", delta: "-0.4" },
      { label: "Gross Margin", value: "71", unit: "%", trend: "flat", delta: "stable" },
    ],
    orgSnapshot: {
      departments: ["Product", "Engineering", "Clinical Success", "Sales", "Support", "Finance"],
      techStack: ["React", "Node", "Postgres", "Snowflake", "Segment", "Zendesk", "HubSpot", "Notion"],
      decisionStyle: "Data-informed consensus; slow on cross-functional calls",
      cultureNotes: [
        "Clinician empathy prized over speed",
        "Heavy documentation culture, lightly enforced",
        "Founders still in the details of every deal",
      ],
    },
    fidelity: 74,
    sessionsObserved: 12,
    capabilities: capabilitySet482(),
  },
  {
    code: "TWIN-317",
    industry: "Freight & Logistics Tech",
    sizeBand: "220 employees",
    stage: "Series B",
    region: "EMEA",
    tagline: "Brokerage platform scaling faster than its operating model can absorb.",
    problems: [
      "Dispatchers spend ~14 hrs/week manually reconciling carrier paperwork",
      "Margin leakage from spot-quote inconsistency across regions",
      "Data warehouse exists but nobody trusts the numbers",
      "Carrier onboarding is manual and regulator-heavy",
    ],
    objectives: [
      "Achieve single-source-of-truth operational reporting",
      "Automate 60% of spot-quote workflows",
      "Open two new regional lanes profitably",
      "Reach operating cashflow positive by Q4",
    ],
    kpis: [
      { label: "Gross Margin / Load", value: "11.8", unit: "%", trend: "down", delta: "-1.6pt" },
      { label: "Quote-to-Book", value: "41", unit: "%", trend: "flat", delta: "stable" },
      { label: "Ops Cost / Load", value: "€18.40", unit: "", trend: "up", delta: "+€2.10" },
      { label: "On-time Delivery", value: "93", unit: "%", trend: "down", delta: "-2pt" },
    ],
    orgSnapshot: {
      departments: ["Brokerage", "Carrier Ops", "Finance", "Data", "Product", "Compliance"],
      techStack: ["Ruby", "React", "Postgres", "dbt", "Looker", "Salesforce", "Intercom"],
      decisionStyle: "Top-down from COO; data requests bottlenecked",
      cultureNotes: [
        "Operators distrust dashboards they didn't build",
        "Strong carrier-relationship culture",
        "Risk-averse on compliance",
      ],
    },
    fidelity: 81,
    sessionsObserved: 23,
    capabilities: capabilitySet317(),
  },
  {
    code: "TWIN-604",
    industry: "Embedded Payments Infrastructure",
    sizeBand: "28 employees",
    stage: "Seed",
    region: "Global / Remote",
    tagline: "API-first startup with strong engineering, thin commercial muscle.",
    problems: [
      "Developer docs are excellent but go-to-market is founder-led only",
      "No lifecycle motion for activated-but-idle accounts",
      "Pricing model hasn't been revisited since launch",
      "No structured way to prioritize the integration backlog",
    ],
    objectives: [
      "Build a repeatable PLG activation loop",
      "Land 3 design-partner deals in fintech verticals",
      "Ship usage-based pricing v2",
      "Hire first non-founder commercial hire",
    ],
    kpis: [
      { label: "Activation Rate", value: "31", unit: "%", trend: "flat", delta: "stable" },
      { label: "API Calls / Active Acct", value: "412K", unit: "", trend: "up", delta: "+18%" },
      { label: "Sales Cycle", value: "73", unit: "days", trend: "up", delta: "+11 days" },
      { label: "Burn Multiple", value: "1.9", unit: "", trend: "down", delta: "-0.3" },
    ],
    orgSnapshot: {
      departments: ["Engineering", "Founders", "Design", "DevRel"],
      techStack: ["Go", "TypeScript", "Kafka", "Postgres", "Terraform", "Linear", "Stripe"],
      decisionStyle: "Fast, written-first, async-heavy",
      cultureNotes: [
        "Engineers ship daily; commercial is the gap",
        "Docs treated as a product surface",
        "Low process tolerance",
      ],
    },
    fidelity: 68,
    sessionsObserved: 5,
    capabilities: capabilitySet604(),
  },
  {
    code: "TWIN-129",
    industry: "D2C Consumer Goods",
    sizeBand: "140 employees",
    stage: "Growth / PE-backed",
    region: "North America",
    tagline: "Brand-led retailer hitting the ceiling of spreadsheet operations.",
    problems: [
      "Demand forecasting is gut-driven; stockouts and overstock both common",
      "Paid media ROI opaque after iOS attribution changes",
      "Customer LTV calculation differs by team",
      "Catalog expansion outpacing merchandising capacity",
    ],
    objectives: [
      "Reach 35% gross margin on new collections",
      "Stand up a unified profitability model",
      "Cut inventory carrying cost by 15%",
      "Launch loyalty program v2",
    ],
    kpis: [
      { label: "Contribution Margin", value: "22", unit: "%", trend: "down", delta: "-4pt" },
      { label: "Inventory Turnover", value: "3.1", unit: "x", trend: "down", delta: "-0.6x" },
      { label: "Blended CAC", value: "$84", unit: "", trend: "up", delta: "+$12" },
      { label: "Repeat Rate", value: "28", unit: "%", trend: "flat", delta: "stable" },
    ],
    orgSnapshot: {
      departments: ["Brand", "Merchandising", "Performance Marketing", "Ops", "Finance", "CX"],
      techStack: ["Shopify", "Klaviyo", "Meta Ads", "Snowflake", "Tableau", "NetSuite", "Gorgias"],
      decisionStyle: "Brand-led, campaign-driven, analytics aspirational",
      cultureNotes: [
        "Creative speed valued over analytical rigor",
        "Finance and Marketing misaligned on definitions",
        "Strong founder brand equity",
      ],
    },
    fidelity: 77,
    sessionsObserved: 18,
    capabilities: capabilitySet129(),
  },
]

function capabilitySet482(): CapabilityGap[] {
  return [
    {
      key: "lifecycle-email",
      title: "Lifecycle email & in-app activation ownership",
      category: "Growth",
      problem:
        "We are losing ~17% of qualified leads because nobody owns lifecycle email optimization. Activation emails fire on a generic cadence and have not been A/B tested in 9 months.",
      evidence:
        "Segment shows 17.4% of trial signups never hit the second-session activation event; email open rate 14% vs. 28% benchmark.",
      businessImpact:
        "Recovering activation by 8pts would add an estimated $1.1M ARR over 12 months at current pipeline volume.",
      estRevenueImpact: "$1.1M ARR",
      estTimeSavings: "—",
      difficulty: 2,
      urgency: 5,
      confidence: 78,
      expectedRoi: 92,
    },
    {
      key: "onboarding-redesign",
      title: "Clinical onboarding workflow redesign",
      category: "Operations",
      problem:
        "Onboarding a clinic takes 34 days against a 14-day target. The process is run from a checklist in Notion with manual handoffs between Sales, Clinical Success and IT.",
      evidence:
        "Median time-to-value 34 days (target 14); 41% of onboards slip past 30 days; CSAT during onboarding 3.4/5.",
      businessImpact:
        "Compressing to 18 days unlocks faster revenue recognition and reduces CS workload by ~120 hrs/month.",
      estRevenueImpact: "$640K faster recognition",
      estTimeSavings: "120 hrs/month",
      difficulty: 3,
      urgency: 5,
      confidence: 82,
      expectedRoi: 88,
    },
    {
      key: "support-knowledge",
      title: "Support knowledge architecture",
      category: "Knowledge",
      problem:
        "Customer support knowledge is fragmented across Zendesk macros, Notion, Slack threads and tribal memory. New agents take 11 weeks to ramp.",
      evidence:
        "11-week ramp; 23% of tickets escalated to L2; deflection rate 18% vs. 35% target.",
      businessImpact:
        "A unified knowledge layer would cut L2 escalations and shave 4 weeks off agent ramp.",
      estRevenueImpact: "—",
      estTimeSavings: "4 weeks ramp / 30% L2 reduction",
      difficulty: 3,
      urgency: 4,
      confidence: 71,
      expectedRoi: 79,
    },
    {
      key: "eu-compliance",
      title: "EU market entry compliance & data residency",
      category: "Operations",
      problem:
        "Expansion into EU requires GDPR-aligned data residency, DPA workflows and localized consent — none currently scoped.",
      evidence:
        "Legal review flagged 9 gaps vs. EU requirements; no DPA template exists; no EU sub-processor list.",
      businessImpact:
        "Unblocks ~$2.4M EU pipeline identified by Sales; de-risks 12-month expansion objective.",
      estRevenueImpact: "$2.4M pipeline unlock",
      estTimeSavings: "—",
      difficulty: 4,
      urgency: 4,
      confidence: 66,
      expectedRoi: 74,
    },
    {
      key: "self-serve-analytics",
      title: "Self-serve analytics module product management",
      category: "Product",
      problem:
        "The planned self-serve analytics module has no dedicated PM and is blocking the roadmap; customers ask for it weekly.",
      evidence:
        "Analytics is the #1 requested feature (38% of CS feedback loop); roadmap blocked 2 quarters.",
      businessImpact:
        "Unlocks expansion revenue and reduces custom-reporting engineering load (~25% of eng bandwidth).",
      estRevenueImpact: "$900K expansion",
      estTimeSavings: "25% eng bandwidth",
      difficulty: 4,
      urgency: 3,
      confidence: 60,
      expectedRoi: 67,
    },
    {
      key: "churn-prediction",
      title: "Churn prediction & health scoring",
      category: "Data",
      problem:
        "No predictive health score; churn is only visible in the renewal meeting, too late to intervene.",
      evidence:
        "NRR 92% and falling; 60% of churned accounts showed usage decline 45+ days before renewal with no alert.",
      businessImpact:
        "Early-warning system could recover 30-40% of at-risk accounts.",
      estRevenueImpact: "$780K NRR recovery",
      estTimeSavings: "—",
      difficulty: 3,
      urgency: 4,
      confidence: 69,
      expectedRoi: 72,
    },
  ]
}

function capabilitySet317(): CapabilityGap[] {
  return [
    {
      key: "carrier-recon-automation",
      title: "Carrier paperwork reconciliation automation",
      category: "Operations",
      problem:
        "Dispatchers spend ~14 hrs/week manually reconciling carrier paperwork against load records, with 6% error rate.",
      evidence:
        "Time-study shows 14.2 hrs/wk per dispatcher; 6.1% recon error rate; 2.3% margin leakage from mismatches.",
      businessImpact:
        "Automation would reclaim ~560 hrs/month and recover 1.8pts of gross margin per load.",
      estRevenueImpact: "+1.8pt margin/load",
      estTimeSavings: "560 hrs/month",
      difficulty: 3,
      urgency: 5,
      confidence: 84,
      expectedRoi: 90,
    },
    {
      key: "spot-quote-engine",
      title: "Spot-quote consistency engine",
      category: "Revenue",
      problem:
        "Spot quotes vary wildly by region and rep; margin leakage from inconsistency estimated at €1.2M/yr.",
      evidence:
        "Quote variance 31% across regions for identical lanes; win rate inversely correlated with margin.",
      businessImpact:
        "A guided quoting engine with guardrails recovers ~€1.2M annualized margin.",
      estRevenueImpact: "€1.2M margin",
      estTimeSavings: "—",
      difficulty: 4,
      urgency: 4,
      confidence: 72,
      expectedRoi: 83,
    },
    {
      key: "trusted-reporting",
      title: "Trusted operational reporting layer",
      category: "Data",
      problem:
        "The warehouse exists but nobody trusts the numbers; every meeting starts with a reconciliation debate.",
      evidence:
        "dbt models exist but 3 teams maintain parallel spreadsheets; 2 of 7 KPIs disagree by >5%.",
      businessImpact:
        "A governed semantic layer unblocks decisions and frees ~30% of analyst time.",
      estRevenueImpact: "—",
      estTimeSavings: "30% analyst time",
      difficulty: 4,
      urgency: 4,
      confidence: 70,
      expectedRoi: 76,
    },
    {
      key: "carrier-onboarding",
      title: "Carrier onboarding & compliance automation",
      category: "Operations",
      problem:
        "Carrier onboarding is manual and regulator-heavy, taking 9 days and creating compliance risk.",
      evidence:
        "9-day median onboarding; 4% of carriers flagged post-hoc for missing docs.",
      businessImpact:
        "Automation compresses to 2 days and de-risks compliance.",
      estRevenueImpact: "—",
      estTimeSavings: "7 days / carrier",
      difficulty: 3,
      urgency: 3,
      confidence: 75,
      expectedRoi: 71,
    },
    {
      key: "lane-profitability",
      title: "Lane-level profitability analysis",
      category: "Data",
      problem:
        "New lanes are opened on volume signals without true profitability modeling.",
      evidence:
        "2 of last 5 new lanes unprofitable within 90 days; no per-lane cost model exists.",
      businessImpact:
        "A lane profitability model prevents ~€400K/yr in loss-making expansion.",
      estRevenueImpact: "€400K loss avoidance",
      estTimeSavings: "—",
      difficulty: 3,
      urgency: 3,
      confidence: 68,
      expectedRoi: 69,
    },
  ]
}

function capabilitySet604(): CapabilityGap[] {
  return [
    {
      key: "lifecycle-activation",
      title: "Lifecycle activation & growth marketing",
      category: "Growth",
      problem:
        "Developer docs are excellent but there is no lifecycle motion for activated-but-idle accounts; activation stuck at 31%.",
      evidence:
        "31% activation; 44% of signups reach one API call then go quiet; no lifecycle email/in-app program exists.",
      businessImpact:
        "Moving activation 31%→45% roughly doubles net new paying accounts at current top-of-funnel.",
      estRevenueImpact: "~2x net new accounts",
      estTimeSavings: "—",
      difficulty: 2,
      urgency: 5,
      confidence: 80,
      expectedRoi: 91,
    },
    {
      key: "pricing-v2",
      title: "Usage-based pricing v2 design",
      category: "Revenue",
      problem:
        "Pricing hasn't been revisited since launch; power users are heavily subsidized and pricing is opaque to buyers.",
      evidence:
        "Top 10% of accounts consume 64% of compute but pay 22% of revenue; win/loss shows pricing confusion in 30% of losses.",
      businessImpact:
        "Usage-based v2 could lift net revenue per account 35-50% and align cost-to-serve.",
      estRevenueImpact: "+35-50% ARPA",
      estTimeSavings: "—",
      difficulty: 4,
      urgency: 4,
      confidence: 67,
      expectedRoi: 80,
    },
    {
      key: "integration-prioritization",
      title: "Integration backlog prioritization framework",
      category: "Product",
      problem:
        "No structured way to prioritize the integration backlog; engineering picks by loudest customer.",
      evidence:
        "47 open integration requests; 3 of last 8 shipped integrations had <5 adopting accounts.",
      businessImpact:
        "A prioritization framework prevents ~30% wasted eng effort and aligns roadmap to value.",
      estRevenueImpact: "—",
      estTimeSavings: "30% eng effort",
      difficulty: 2,
      urgency: 3,
      confidence: 74,
      expectedRoi: 73,
    },
    {
      key: "first-commercial-hire",
      title: "First commercial hire enablement design",
      category: "Revenue",
      problem:
        "Hiring the first non-founder commercial role with no playbook, no ICP definition and no sales motion documented.",
      evidence:
        "No ICP doc; sales cycle 73 days; 0 structured pipeline; founder-led only.",
      businessImpact:
        "A documented motion lets the first hire be productive in 60 days vs. 120+.",
      estRevenueImpact: "60-day faster ramp",
      estTimeSavings: "60 days ramp",
      difficulty: 3,
      urgency: 5,
      confidence: 70,
      expectedRoi: 78,
    },
    {
      key: "devrel-measurement",
      title: "DevRel program measurement & attribution",
      category: "Growth",
      problem:
        "DevRel activity is high but unmeasured; impossible to defend the investment or steer it.",
      evidence:
        "12 events/qtr, 4 docs/wk; no attribution from content to activation; no success metric.",
      businessImpact:
        "Attribution model unlocks ability to double down on what drives activation.",
      estRevenueImpact: "—",
      estTimeSavings: "—",
      difficulty: 3,
      urgency: 2,
      confidence: 62,
      expectedRoi: 61,
    },
  ]
}

function capabilitySet129(): CapabilityGap[] {
  return [
    {
      key: "demand-forecasting",
      title: "Demand forecasting & inventory modeling",
      category: "Operations",
      problem:
        "Demand forecasting is gut-driven; stockouts and overstock both common, inventory turnover dropped to 3.1x.",
      evidence:
        "Turnover 3.1x (-0.6x); stockout rate 8% on top SKUs; overstock 22% of catalog.",
      businessImpact:
        "A statistical forecast + reorder model could cut carrying cost 15% and recover stockout sales.",
      estRevenueImpact: "+$1.3M recovered sales",
      estTimeSavings: "15% carrying cost",
      difficulty: 3,
      urgency: 5,
      confidence: 79,
      expectedRoi: 89,
    },
    {
      key: "unified-profitability",
      title: "Unified profitability & LTV model",
      category: "Data",
      problem:
        "Customer LTV calculation differs by team; Finance and Marketing cannot agree on contribution margin.",
      evidence:
        "Finance LTV $214; Marketing LTV $286; contribution margin definitions diverge on ad cost allocation.",
      businessImpact:
        "A governed profitability model aligns spending to true margin and stops subsidizing unprofitable cohorts.",
      estRevenueImpact: "—",
      estTimeSavings: "—",
      difficulty: 3,
      urgency: 4,
      confidence: 76,
      expectedRoi: 82,
    },
    {
      key: "post-ios-attribution",
      title: "Post-iOS paid media attribution",
      category: "Growth",
      problem:
        "Paid media ROI is opaque after iOS attribution changes; blended CAC up $12 with no clear cause.",
      evidence:
        "Blended CAC $84 (+$12); platform-reported ROAS 3.1x but modeled ROAS 1.7x; no MMM exists.",
      businessImpact:
        "An MMM / modeled-attribution approach could reallocate ~30% of budget to efficient channels.",
      estRevenueImpact: "30% budget reallocation",
      estTimeSavings: "—",
      difficulty: 4,
      urgency: 4,
      confidence: 65,
      expectedRoi: 75,
    },
    {
      key: "loyalty-v2",
      title: "Loyalty program v2 design",
      category: "Customer",
      problem:
        "Loyalty program v1 underperforms; repeat rate flat at 28% despite heavy promotion.",
      evidence:
        "Repeat rate 28% flat; 9% of members account for 61% of loyalty redemptions; ROI negative.",
      businessImpact:
        "A redesigned loyalty motion could lift repeat rate to 34% and improve cohort margin.",
      estRevenueImpact: "+6pt repeat rate",
      estTimeSavings: "—",
      difficulty: 3,
      urgency: 3,
      confidence: 68,
      expectedRoi: 70,
    },
    {
      key: "merchandising-capacity",
      title: "Merchandising capacity & assortment planning",
      category: "Product",
      problem:
        "Catalog expansion outpacing merchandising capacity; new collections dilute margin.",
      evidence:
        "SKU count +28% YoY; new collection margin 14% vs. 22% core; merch team headcount flat.",
      businessImpact:
        "An assortment planning framework protects margin and prioritizes high-velocity SKUs.",
      estRevenueImpact: "+3-5pt new-collection margin",
      estTimeSavings: "—",
      difficulty: 2,
      urgency: 3,
      confidence: 73,
      expectedRoi: 68,
    },
  ]
}

const CANDIDATE: Omit<CandidateView, "id"> = {
  handle: "observer-77",
  displayName: "A. Okafor",
  headline: "Operator-engineer who turns ambiguity into shipped systems",
  capabilityGraph: [
    { domain: "Lifecycle & Activation Growth", level: 4, confidence: 72 },
    { domain: "Operations & Process Design", level: 4, confidence: 80 },
    { domain: "Data & Analytics Modeling", level: 3, confidence: 68 },
    { domain: "Product Strategy", level: 3, confidence: 61 },
    { domain: "Technical Writing / SOPs", level: 4, confidence: 84 },
    { domain: "AI Leverage & Automation", level: 5, confidence: 88 },
  ],
  profile: {
    availability: "Available in 3 weeks",
    languages: ["English", "French"],
    preferredStack: ["Notion", "dbt", "Hex", "n8n", "Linear", "OpenAI", "Claude"],
    aiLeverage: "Builds multi-step agent workflows; ships internal tools weekly",
    workStyle: "Writes before building; ships in small verifiable steps",
  },
  reputation: 58,
  sessionsCompleted: 2,
}

export async function seedDatabase(force = false) {
  const existing = await db.businessTwin.count()
  if (existing > 0 && !force) return { seeded: false, reason: "already populated" }

  if (force) {
    await db.workSession.deleteMany()
    await db.businessTwin.deleteMany()
    await db.candidate.deleteMany()
  }

  for (const t of TWINS) {
    await db.businessTwin.create({
      data: {
        code: t.code,
        industry: t.industry,
        sizeBand: t.sizeBand,
        stage: t.stage,
        region: t.region,
        tagline: t.tagline,
        problems: JSON.stringify(t.problems),
        objectives: JSON.stringify(t.objectives),
        kpis: JSON.stringify(t.kpis satisfies Kpi[]),
        capabilities: JSON.stringify(t.capabilities),
        orgSnapshot: JSON.stringify(t.orgSnapshot),
        fidelity: t.fidelity,
        sessionsObserved: t.sessionsObserved,
      },
    })
  }

  await db.candidate.create({
    data: {
      handle: CANDIDATE.handle,
      displayName: CANDIDATE.displayName,
      headline: CANDIDATE.headline,
      capabilityGraph: JSON.stringify(CANDIDATE.capabilityGraph),
      profile: JSON.stringify(CANDIDATE.profile),
      reputation: CANDIDATE.reputation,
      sessionsCompleted: CANDIDATE.sessionsCompleted,
    },
  })

  return { seeded: true, twins: TWINS.length, candidate: 1 }
}
