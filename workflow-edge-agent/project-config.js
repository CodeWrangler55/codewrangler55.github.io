window.projectConfig = {
  kind: "edge",
  title: "Workflow Edge Agent",
  kicker: "Generation is cheap. Verification is the product.",
  subtitle: "A simulated order-exception agent that cannot act until policy, evidence, and risk checks agree.",
  insightTitle: "Routing decision",
  insightBody: "The agent proposes an action, but the verifier decides whether it can execute, needs approval, or lacks evidence.",
  controls: [
    { id: "confidence", label: "Model confidence", shortLabel: "model", min: 0, max: 100, value: 86, suffix: "%" },
    { id: "evidence", label: "Evidence match", shortLabel: "evidence", min: 0, max: 100, value: 78, suffix: "%" },
    { id: "policyFit", label: "Policy fit", shortLabel: "policy", min: 0, max: 100, value: 82, suffix: "%" },
    { id: "dollarRisk", label: "Dollar risk", shortLabel: "risk", min: 0, max: 20000, step: 250, value: 1750, prefix: "$" },
    { id: "customerTier", label: "Customer tier", type: "select", value: "standard", options: [{ value: "standard", label: "Standard" }, { value: "strategic", label: "Strategic" }] }
  ]
};
