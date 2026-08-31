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
    const value = Number(pilot.valueEvidence) + Number(pilot.adoption) + Number(pilot.workflowFit);
    const drag = Number(pilot.risk) + Number(pilot.integrationDebt) + Number(pilot.uncertainty);
    const score = value - drag;
    const decision = score >= 95 ? "scale" : score >= 45 ? "continue" : score >= 5 ? "narrow" : "stop";
    return { ...pilot, score, decision };
  }).sort((a, b) => b.score - a.score);
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
