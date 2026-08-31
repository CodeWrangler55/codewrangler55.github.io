const words = (text) => String(text).toLowerCase();

export function buildExceptionTaxonomy(cases) {
  const patterns = [
    { type: "missing evidence", risk: "medium", authority: "analyst", keys: ["missing", "unknown", "no record", "blank", "not found"] },
    { type: "policy ambiguity", risk: "high", authority: "manager", keys: ["policy", "exception", "override", "unclear", "approval"] },
    { type: "system mismatch", risk: "medium", authority: "systems owner", keys: ["mismatch", "sync", "duplicate", "crm", "erp", "status"] },
    { type: "financial exposure", risk: "high", authority: "finance approver", keys: ["refund", "invoice", "credit", "payment", "amount"] },
    { type: "customer escalation", risk: "high", authority: "customer lead", keys: ["angry", "escalated", "strategic", "vip", "legal"] }
  ];
  const buckets = new Map();
  for (const raw of cases.filter(Boolean)) {
    const lower = words(raw);
    const match = patterns.find((pattern) => pattern.keys.some((key) => lower.includes(key))) ?? {
      type: "unclassified edge case",
      risk: "low",
      authority: "workflow owner",
      keys: []
    };
    const current = buckets.get(match.type) ?? { type: match.type, count: 0, risk: match.risk, authority: match.authority, examples: [] };
    current.count += 1;
    current.examples.push(raw);
    buckets.set(match.type, current);
  }
  return [...buckets.values()].sort((a, b) => b.count - a.count || a.type.localeCompare(b.type));
}

export function triagePilots(pilots) {
  return pilots.map((pilot) => {
    const value = Number(pilot.valueEvidence) + Number(pilot.adoption) + Number(pilot.workflowFit) + Number(pilot.strategicValue ?? 0);
    const drag = Number(pilot.risk) + Number(pilot.integrationDebt) + Number(pilot.uncertainty) + Number(pilot.changeCost ?? 0);
    const score = value - drag;
    const decision = score >= 130 ? "fund" : score >= 75 ? "defer" : score >= 25 ? "merge" : "kill";
    const memo =
      decision === "fund"
        ? "Fund with named executive owner, integration budget, and a 90-day value proof."
        : decision === "defer"
          ? "Defer until the team proves baseline movement or lowers integration risk."
          : decision === "merge"
            ? "Merge into a stronger workflow initiative so the capability has a real operating home."
            : "Kill or archive; this is not earning executive attention.";
    return { ...pilot, score, decision, memo };
  }).sort((a, b) => b.score - a.score);
}

export function buildInvestmentMemo(pilots) {
  const ranked = triagePilots(pilots);
  const funded = ranked.filter((pilot) => pilot.decision === "fund");
  const deferred = ranked.filter((pilot) => pilot.decision === "defer");
  const killed = ranked.filter((pilot) => pilot.decision === "kill");
  const top = ranked[0];
  return {
    ranked,
    headline: top ? `${top.name} is the strongest candidate for executive sponsorship.` : "No pilots submitted.",
    capitalPosture:
      funded.length > 1
        ? "Fund selectively; multiple candidates are competing for integration capacity."
        : funded.length === 1
          ? "Fund one pilot and protect the implementation path."
          : "Do not expand spend until the portfolio produces stronger evidence.",
    boardQuestions: [
      "Which pilot changes a P&L line or board-level risk?",
      "Which initiative has a named business owner?",
      "Which pilot needs integration funding before it can scale?",
      "Which experiment should be stopped to free capacity?"
    ],
    summary: `${funded.length} fund, ${deferred.length} defer, ${ranked.filter((pilot) => pilot.decision === "merge").length} merge, ${killed.length} kill`
  };
}

export function analyzeAgentFailure(scenario) {
  const checks = [
    { id: "evidence", label: "missing evidence", failed: !scenario.hasEvidence, control: "require source citations before recommendation" },
    { id: "policy", label: "conflicting policy", failed: scenario.policyConflict, control: "route conflicts to policy owner" },
    { id: "permission", label: "permission mismatch", failed: !scenario.hasPermission, control: "bind tool access to user and agent role" },
    { id: "stale", label: "stale data", failed: scenario.dataAgeDays > 7, control: "block writes when source data is stale" },
    { id: "risk", label: "excessive action risk", failed: scenario.dollarRisk > 2500, control: "require approval over dollar threshold" }
  ];
  const failures = checks.filter((check) => check.failed);
  return {
    status: failures.length === 0 ? "can proceed with audit" : "blocked before action",
    failures,
    controls: failures.map((failure) => failure.control)
  };
}

export function simulateServiceQueue({ demandPerHour, agents, minutesPerCase, aiAssistPercent, reviewPercent, hours }) {
  const arrivals = Math.max(0, Number(demandPerHour)) * Math.max(1, Number(hours));
  const staffMinutes = Math.max(1, Number(agents)) * Math.max(1, Number(hours)) * 60;
  const assistedMinutes = Math.max(1, Number(minutesPerCase)) * (1 - Math.max(0, Number(aiAssistPercent)) / 100);
  const effectiveMinutes = assistedMinutes * (1 + Math.max(0, Number(reviewPercent)) / 100);
  const completions = Math.floor(staffMinutes / effectiveMinutes);
  const backlog = Math.max(0, Math.ceil(arrivals - completions));
  const utilization = Math.min(100, Math.round((arrivals * effectiveMinutes / staffMinutes) * 100));
  return { arrivals, completions, backlog, utilization, effectiveMinutes: Number(effectiveMinutes.toFixed(1)) };
}

export function buildCapacityPlan(input) {
  const current = simulateServiceQueue({ ...input, aiAssistPercent: 0, reviewPercent: 0 });
  const assisted = simulateServiceQueue(input);
  const backlogChange = current.backlog - assisted.backlog;
  const recommendation =
    assisted.backlog === 0
      ? "Convert the AI gain into a service-level commitment or demand capture plan."
      : backlogChange > 0
        ? "AI helps, but the queue still needs routing, staffing, or SLA redesign."
        : "Do not claim capacity gain; review load or demand pressure is consuming the benefit.";
  const executivePlan = [
    `Baseline backlog: ${current.backlog}`,
    `AI-assisted backlog: ${assisted.backlog}`,
    `Effective minutes per case: ${assisted.effectiveMinutes}`,
    recommendation
  ];
  return { current, assisted, backlogChange, recommendation, executivePlan };
}

export function gateAiRelease(checks) {
  const blockers = [];
  if (!checks.policyTests) blockers.push("policy tests missing");
  if (!checks.citations) blockers.push("citations not mandatory");
  if (!checks.piiBoundary) blockers.push("PII boundary unproven");
  if (!checks.injectionTests) blockers.push("prompt injection tests missing");
  if (!checks.auditTrail) blockers.push("audit trail incomplete");
  if (!checks.rollback) blockers.push("rollback plan absent");
  const decision = blockers.length === 0 ? "release to limited production" : blockers.length <= 2 ? "supervised pilot only" : "do not release";
  return { decision, blockers };
}
