const clamp = (value, min, max) => Math.min(max, Math.max(min, Number(value)));
const round = (value, digits = 0) => Number(value.toFixed(digits));

export function calculateWorkflowReadiness(input) {
  const processClarity = clamp(input.processClarity, 0, 100);
  const dataAccess = clamp(input.dataAccess, 0, 100);
  const exceptionMapping = clamp(input.exceptionMapping, 0, 100);
  const decisionRights = clamp(input.decisionRights, 0, 100);
  const governance = clamp(input.governance, 0, 100);
  const integration = clamp(input.integration, 0, 100);
  const weighted =
    processClarity * 0.18 +
    dataAccess * 0.2 +
    exceptionMapping * 0.16 +
    decisionRights * 0.16 +
    governance * 0.15 +
    integration * 0.15;
  const score = round(weighted);
  const phase =
    score >= 78 ? "Scale a narrow workflow" : score >= 58 ? "Pilot with control gates" : "Map before automating";
  const bottleneck = [
    ["process clarity", processClarity],
    ["data access", dataAccess],
    ["exception inventory", exceptionMapping],
    ["decision rights", decisionRights],
    ["governance", governance],
    ["system integration", integration]
  ].sort((a, b) => a[1] - b[1])[0][0];
  return {
    score,
    phase,
    bottleneck,
    nextMove: `Start with ${bottleneck}, then constrain the first AI use case to one observable business decision.`,
    metrics: [
      { label: "Readiness", value: `${score}/100` },
      { label: "Recommended phase", value: phase },
      { label: "Weakest link", value: bottleneck }
    ]
  };
}

export function calculateValueLedger(input) {
  const transactions = clamp(input.transactions, 1, 1000000);
  const minutesSaved = clamp(input.minutesSaved, 0, 240);
  const laborRate = clamp(input.laborRate, 1, 500);
  const adoption = clamp(input.adoption, 0, 100) / 100;
  const monthlyToolCost = clamp(input.monthlyToolCost, 0, 1000000);
  const reviewMinutes = clamp(input.reviewMinutes, 0, 240);
  const errorReduction = clamp(input.errorReduction, 0, 100) / 100;
  const errorCost = clamp(input.errorCost, 0, 10000);
  const grossLabor = transactions * adoption * Math.max(0, minutesSaved - reviewMinutes) * (laborRate / 60);
  const avoidedRework = transactions * adoption * errorReduction * errorCost;
  const monthlyValue = grossLabor + avoidedRework - monthlyToolCost;
  const roi = monthlyToolCost === 0 ? 999 : monthlyValue / monthlyToolCost;
  return {
    monthlyValue: round(monthlyValue),
    roi: round(roi, 2),
    paybackDays: monthlyValue <= 0 ? "never" : round((monthlyToolCost / monthlyValue) * 30),
    metrics: [
      { label: "Net monthly value", value: `$${round(monthlyValue).toLocaleString()}` },
      { label: "ROI ratio", value: `${round(roi, 2)}x` },
      { label: "Payback", value: monthlyValue <= 0 ? "no payback" : `${round((monthlyToolCost / monthlyValue) * 30)} days` }
    ]
  };
}

export function calculateEdgeAgent(input) {
  const confidence = clamp(input.confidence, 0, 100);
  const evidence = clamp(input.evidence, 0, 100);
  const policyFit = clamp(input.policyFit, 0, 100);
  const dollarRisk = clamp(input.dollarRisk, 0, 1000000);
  const customerTier = input.customerTier === "strategic" ? "strategic" : "standard";
  const verifierScore = round(confidence * 0.3 + evidence * 0.35 + policyFit * 0.35);
  const autoApprove = verifierScore >= 82 && dollarRisk < 2500 && customerTier !== "strategic";
  const route = autoApprove ? "auto-execute" : verifierScore >= 65 ? "human approval" : "return for evidence";
  return {
    verifierScore,
    route,
    audit: [
      "model drafted resolution",
      "policy checker scored the proposed action",
      "evidence checker matched source fields",
      `${route} route selected`
    ],
    metrics: [
      { label: "Verifier score", value: `${verifierScore}/100` },
      { label: "Decision route", value: route },
      { label: "Risk band", value: dollarRisk >= 2500 || customerTier === "strategic" ? "controlled" : "routine" }
    ]
  };
}

export function calculateCapacity(input) {
  const weeklyDemand = clamp(input.weeklyDemand, 1, 100000);
  const teamSize = clamp(input.teamSize, 1, 1000);
  const minutesPerCase = clamp(input.minutesPerCase, 1, 1000);
  const aiReduction = clamp(input.aiReduction, 0, 95) / 100;
  const reviewLoad = clamp(input.reviewLoad, 0, 100) / 100;
  const redeployed = clamp(input.redeployed, 0, 100) / 100;
  const weeklyMinutes = teamSize * 40 * 60;
  const beforeCapacity = weeklyMinutes / minutesPerCase;
  const afterMinutes = minutesPerCase * (1 - aiReduction + reviewLoad);
  const afterCapacity = weeklyMinutes / Math.max(1, afterMinutes);
  const usableCapacity = beforeCapacity + (afterCapacity - beforeCapacity) * redeployed;
  const backlogDelta = round(weeklyDemand - usableCapacity);
  return {
    beforeCapacity: round(beforeCapacity),
    usableCapacity: round(usableCapacity),
    backlogDelta,
    metrics: [
      { label: "Current capacity", value: `${round(beforeCapacity).toLocaleString()} cases/wk` },
      { label: "Converted capacity", value: `${round(usableCapacity).toLocaleString()} cases/wk` },
      { label: "Backlog movement", value: backlogDelta > 0 ? `+${backlogDelta.toLocaleString()}/wk` : `${Math.abs(backlogDelta).toLocaleString()} cleared/wk` }
    ]
  };
}

export function calculateTrustControl(input) {
  const policyCoverage = clamp(input.policyCoverage, 0, 100);
  const citationRate = clamp(input.citationRate, 0, 100);
  const piiExposure = clamp(input.piiExposure, 0, 100);
  const overrideRate = clamp(input.overrideRate, 0, 100);
  const injectionPass = clamp(input.injectionPass, 0, 100);
  const controlScore = round(policyCoverage * 0.25 + citationRate * 0.2 + injectionPass * 0.25 + (100 - piiExposure) * 0.15 + (100 - overrideRate) * 0.15);
  const releaseGate = controlScore >= 85 ? "limited production" : controlScore >= 70 ? "supervised pilot" : "do not release";
  return {
    controlScore,
    releaseGate,
    finding: controlScore >= 85 ? "controls are measurable enough for a constrained release" : "trust gaps need product work before scale",
    metrics: [
      { label: "Control score", value: `${controlScore}/100` },
      { label: "Release gate", value: releaseGate },
      { label: "Primary risk", value: piiExposure > overrideRate ? "PII exposure" : "human overrides" }
    ]
  };
}

export function calculate(kind, input) {
  const calculators = {
    readiness: calculateWorkflowReadiness,
    ledger: calculateValueLedger,
    edge: calculateEdgeAgent,
    capacity: calculateCapacity,
    trust: calculateTrustControl
  };
  const fn = calculators[kind];
  if (!fn) throw new Error(`Unknown calculator kind: ${kind}`);
  return fn(input);
}
