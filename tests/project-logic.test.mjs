import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  analyzeAgentFailure,
  buildCapacityPlan,
  buildExceptionTaxonomy,
  buildInvestmentMemo,
  gateAiRelease,
  simulateServiceQueue,
  triagePilots
} from "../assets/project-logic.mjs";

describe("exception taxonomy builder", () => {
  it("groups operational cases by exception class", () => {
    const taxonomy = buildExceptionTaxonomy(["CRM status mismatch after ERP sync", "Refund approval policy unclear", "Missing invoice record"]);
    assert.equal(taxonomy.length, 3);
    assert.equal(taxonomy[0].count, 1);
    assert.ok(taxonomy.some((item) => item.type === "system mismatch"));
  });
});

describe("pilot portfolio triage", () => {
  it("ranks pilots by value evidence minus execution drag", () => {
    const [first] = triagePilots([
      { name: "low value", valueEvidence: 20, adoption: 20, workflowFit: 20, risk: 40, integrationDebt: 30, uncertainty: 20 },
      { name: "strong", valueEvidence: 90, adoption: 85, workflowFit: 80, risk: 20, integrationDebt: 20, uncertainty: 10 }
    ]);
    assert.equal(first.name, "strong");
    assert.equal(first.decision, "fund");
  });

  it("produces a board-level memo posture", () => {
    const memo = buildInvestmentMemo([
      { name: "invoice control", valueEvidence: 90, adoption: 80, workflowFit: 88, strategicValue: 80, risk: 25, integrationDebt: 20, uncertainty: 12, changeCost: 20 }
    ]);
    assert.equal(memo.capitalPosture, "Fund one pilot and protect the implementation path.");
    assert.match(memo.headline, /invoice control/);
  });
});

describe("agent failure mode lab", () => {
  it("blocks action when production controls fail", () => {
    const result = analyzeAgentFailure({ hasEvidence: false, policyConflict: true, hasPermission: true, dataAgeDays: 2, dollarRisk: 500 });
    assert.equal(result.status, "blocked before action");
    assert.deepEqual(result.failures.map((failure) => failure.id), ["evidence", "policy"]);
  });
});

describe("service queue simulation", () => {
  it("shows backlog when assisted capacity still trails demand", () => {
    const result = simulateServiceQueue({ demandPerHour: 30, agents: 3, minutesPerCase: 12, aiAssistPercent: 30, reviewPercent: 20, hours: 8 });
    assert.equal(result.arrivals, 240);
    assert.ok(result.backlog > 0);
  });

  it("turns queue math into an executive capacity plan", () => {
    const plan = buildCapacityPlan({ demandPerHour: 20, agents: 4, minutesPerCase: 10, aiAssistPercent: 40, reviewPercent: 10, hours: 8 });
    assert.ok(plan.assisted.completions > plan.current.completions);
    assert.equal(plan.executivePlan.length, 4);
  });
});

describe("ai trust release gate", () => {
  it("blocks release when core trust controls are missing", () => {
    const result = gateAiRelease({ policyTests: true, citations: false, piiBoundary: false, injectionTests: false, auditTrail: true, rollback: true });
    assert.equal(result.decision, "do not release");
    assert.equal(result.blockers.length, 3);
  });
});
