# Why Good AI Pilots Die at the Edge of the Workflow

Andrej Karpathy made the important point: “Usually they are doing the generation, and we as humans are doing the verification.”

That is not just a user experience point. It is an architecture point.

The enterprise problem is not whether an agent can produce an answer. The problem is whether the answer survives contact with evidence, policy, permissions, stale data, and financial risk.

## The dangerous moment is the handoff

Most AI pilots look better before they are connected to production systems. The model produces a convincing answer, the user nods, and the demo ends.

The risk begins when the agent can read untrusted data, call a tool, update a system, send a message, or approve something with a dollar value attached. At that point, generation is only half of the system. Verification has to become an explicit control boundary.

The questions are operational:

- What evidence supports this action?
- Is the policy clear?
- Does this user have authority?
- Is the data fresh enough?
- What happens if the action is wrong?

## Test the agent where it can cause harm

[AgentDojo](https://github.com/ethz-spylab/agentdojo) is a strong example of this kind of testing. It evaluates prompt-injection attacks and defenses for tool-using agents across realistic tasks.

That matters because the business risk is not just bad text. It is an agent reading a malicious instruction in a document, confusing it with a business rule, and then using its permissions to take an unsafe action.

The implementation pattern is straightforward even when the engineering is not: separate proposed actions from executed actions, require evidence, check permissions and policy, measure data freshness, limit financial exposure, and preserve the complete decision trail.

## The verifier is part of the product

The verifier is not decoration around the model. It is the system boundary.

Some actions should pass automatically. Some should require a human approval. Some should be blocked and returned with a reason that the product team can analyze. Those outcomes should be visible in evaluation results, not discovered after an incident.

That is where agentic AI becomes serious. The model proposes. The system verifies. Humans approve what should not be automated.
