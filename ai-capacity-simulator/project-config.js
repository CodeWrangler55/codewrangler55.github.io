window.projectConfig = {
  kind: "capacity",
  title: "AI Capacity Simulator",
  kicker: "Productivity is not the same as capacity",
  subtitle: "Model whether AI time savings actually move backlog, throughput, or service levels.",
  insightTitle: "Capacity conversion",
  insightBody: "Savings reach the P&L only when management redesigns queues, service levels, staffing plans, or demand capture.",
  audit: [
    "calculate current weekly capacity from labor minutes",
    "reduce case duration by the AI-assisted portion",
    "add review load back into the workflow",
    "count only the share of savings management actually redeploys"
  ],
  controls: [
    { id: "weeklyDemand", label: "Weekly demand", shortLabel: "demand", min: 50, max: 5000, step: 25, value: 950 },
    { id: "teamSize", label: "Team size", shortLabel: "team", min: 1, max: 50, value: 9 },
    { id: "minutesPerCase", label: "Minutes per case", shortLabel: "duration", min: 5, max: 240, value: 42 },
    { id: "aiReduction", label: "AI time reduction", shortLabel: "AI cut", min: 0, max: 90, value: 38, suffix: "%" },
    { id: "reviewLoad", label: "Review load added back", shortLabel: "review", min: 0, max: 80, value: 14, suffix: "%" },
    { id: "redeployed", label: "Savings converted to work", shortLabel: "converted", min: 0, max: 100, value: 55, suffix: "%" }
  ]
};
