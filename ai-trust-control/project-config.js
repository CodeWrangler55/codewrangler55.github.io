window.projectConfig = {
  kind: "trust",
  title: "AI Trust Control",
  kicker: "Trust is a product requirement",
  subtitle: "A release gate for AI features that need policy coverage, citations, PII boundaries, injection tests, and override monitoring.",
  insightTitle: "Release finding",
  audit: [
    "move policy out of the prompt and into testable rules",
    "require citations for any operational recommendation",
    "red-team prompt injection and data exfiltration paths",
    "watch human overrides after launch as product telemetry"
  ],
  controls: [
    { id: "policyCoverage", label: "Policy coverage", shortLabel: "policy", min: 0, max: 100, value: 72, suffix: "%" },
    { id: "citationRate", label: "Citation rate", shortLabel: "citations", min: 0, max: 100, value: 84, suffix: "%" },
    { id: "piiExposure", label: "PII exposure risk", shortLabel: "PII", min: 0, max: 100, value: 22, suffix: "%" },
    { id: "overrideRate", label: "Human override rate", shortLabel: "overrides", min: 0, max: 100, value: 18, suffix: "%" },
    { id: "injectionPass", label: "Injection test pass rate", shortLabel: "security", min: 0, max: 100, value: 76, suffix: "%" }
  ]
};
