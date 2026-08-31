window.projectConfig = {
  kind: "ledger",
  title: "AI Value Ledger",
  kicker: "AI factory accounting",
  subtitle: "A P&L-style model for separating demo excitement from measurable operating value.",
  insightTitle: "What this ledger exposes",
  insightBody: "A useful AI pilot needs more than users. It needs baseline cost, adoption, human review, error movement, and a cost line for running the system.",
  audit: [
    "start with a baseline cost per transaction",
    "subtract human review time from gross automation savings",
    "count avoided rework separately from time saved",
    "treat tool and inference spend as operating cost"
  ],
  controls: [
    { id: "transactions", label: "Monthly transactions", shortLabel: "volume", min: 100, max: 50000, step: 100, value: 8000 },
    { id: "minutesSaved", label: "Minutes saved per transaction", shortLabel: "saved", min: 0, max: 60, value: 9 },
    { id: "reviewMinutes", label: "Human review minutes", shortLabel: "review", min: 0, max: 30, value: 3 },
    { id: "laborRate", label: "Loaded hourly labor", shortLabel: "labor", min: 25, max: 250, value: 95, prefix: "$" },
    { id: "adoption", label: "Workflow adoption", shortLabel: "adoption", min: 0, max: 100, value: 62, suffix: "%" },
    { id: "monthlyToolCost", label: "Monthly AI/tool cost", shortLabel: "cost", min: 0, max: 100000, step: 1000, value: 14000, prefix: "$" },
    { id: "errorReduction", label: "Error reduction", shortLabel: "quality", min: 0, max: 100, value: 18, suffix: "%" },
    { id: "errorCost", label: "Cost per avoided error", shortLabel: "rework", min: 0, max: 500, value: 45, prefix: "$" }
  ]
};
