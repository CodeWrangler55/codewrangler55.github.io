import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  calculateCapacity,
  calculateEdgeAgent,
  calculateTrustControl,
  calculateValueLedger,
  calculateWorkflowReadiness
} from "../assets/calculators.mjs";

describe("workflow readiness", () => {
  it("identifies weak workflow foundations before recommending scale", () => {
    const result = calculateWorkflowReadiness({
      processClarity: 90,
      dataAccess: 25,
      exceptionMapping: 50,
      decisionRights: 70,
      governance: 65,
      integration: 60
    });
    assert.equal(result.phase, "Pilot with control gates");
    assert.equal(result.bottleneck, "data access");
  });
});

describe("value ledger", () => {
  it("subtracts review burden and tool cost from gross value", () => {
    const result = calculateValueLedger({
      transactions: 1000,
      minutesSaved: 8,
      reviewMinutes: 2,
      laborRate: 90,
      adoption: 50,
      monthlyToolCost: 3000,
      errorReduction: 10,
      errorCost: 40
    });
    assert.equal(result.monthlyValue, 3500);
    assert.equal(result.roi, 1.17);
  });
});

describe("edge agent", () => {
  it("keeps strategic or high-risk decisions behind approval", () => {
    const result = calculateEdgeAgent({
      confidence: 95,
      evidence: 95,
      policyFit: 95,
      dollarRisk: 1000,
      customerTier: "strategic"
    });
    assert.equal(result.route, "human approval");
  });
});

describe("capacity simulator", () => {
  it("distinguishes productivity from converted capacity", () => {
    const result = calculateCapacity({
      weeklyDemand: 500,
      teamSize: 4,
      minutesPerCase: 45,
      aiReduction: 40,
      reviewLoad: 10,
      redeployed: 50
    });
    assert.equal(result.beforeCapacity, 213);
    assert.equal(result.usableCapacity, 259);
  });
});

describe("trust control", () => {
  it("blocks release when control evidence is weak", () => {
    const result = calculateTrustControl({
      policyCoverage: 60,
      citationRate: 55,
      piiExposure: 35,
      overrideRate: 30,
      injectionPass: 50
    });
    assert.equal(result.releaseGate, "do not release");
  });
});
