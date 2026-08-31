# Why Good AI Pilots Die at the Edge of the Workflow

Andrej Karpathy made the important point: AI systems often generate while humans verify.

That is not just a user experience point. It is an architecture point.

The enterprise problem is not whether an agent can produce an answer. The problem is whether the answer survives contact with evidence, policy, permissions, stale data, and financial risk.

## The project

I built an [Agent Failure Mode Lab](https://codewrangler55.github.io/agent-failure-mode-lab/).

The lab stress tests an agent action before it reaches a workflow. It checks for missing evidence, conflicting policy, permission mismatch, stale data, and excessive dollar risk. If those controls fail, the agent is blocked before action.

That is the product lesson. The verifier is not decoration. It is the system boundary.

## GitHub reference

The repo to study here is [AgentDojo](https://github.com/ethz-spylab/agentdojo). It evaluates prompt-injection attacks and defenses for tool-using agents across realistic tasks. That maps directly to this post because the business risk is not just bad text. It is an agent using tools, reading untrusted data, and taking an unsafe action unless the system catches it first.

## Why this matters

Most AI pilots look better before they are connected to production systems. Once the agent can act, all the old operational questions come back:

- What evidence supports this?
- Is the policy clear?
- Does this user have authority?
- Is the data fresh?
- What is the dollar risk?

That is where agentic AI becomes serious. The model proposes. The system verifies. Humans approve what should not be automated.
