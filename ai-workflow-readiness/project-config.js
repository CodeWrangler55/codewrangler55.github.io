window.projectConfig = {
  kind: "readiness",
  title: "AI Workflow Readiness",
  kicker: "Process before platform",
  subtitle: "Use this to decide whether a workflow is ready for AI, needs control gates, or still needs basic systems analysis.",
  insightTitle: "Operating recommendation",
  audit: [
    "map the process from trigger to business outcome",
    "classify exceptions before selecting a model",
    "assign decision rights for low, medium, and high-risk cases",
    "ship the smallest controlled workflow slice first"
  ],
  controls: [
    { id: "processClarity", label: "Process clarity", shortLabel: "process", min: 0, max: 100, value: 68, suffix: "%" },
    { id: "dataAccess", label: "System data access", shortLabel: "data", min: 0, max: 100, value: 55, suffix: "%" },
    { id: "exceptionMapping", label: "Exception inventory", shortLabel: "exceptions", min: 0, max: 100, value: 42, suffix: "%" },
    { id: "decisionRights", label: "Decision rights", shortLabel: "rights", min: 0, max: 100, value: 61, suffix: "%" },
    { id: "governance", label: "Governance controls", shortLabel: "governance", min: 0, max: 100, value: 58, suffix: "%" },
    { id: "integration", label: "Integration readiness", shortLabel: "integration", min: 0, max: 100, value: 49, suffix: "%" }
  ]
};
