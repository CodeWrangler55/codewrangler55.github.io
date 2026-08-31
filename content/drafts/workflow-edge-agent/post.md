# Why Good AI Pilots Die at the Edge of the Workflow

The hard part of enterprise AI is rarely the first answer.

The hard part is what happens after the answer.

Can the system act?
Should it act?
What evidence supports the action?
What policy applies?
When does a human need to approve it?
What gets written back to the system of record?

Andrej Karpathy described a useful shift in how software work is changing: "Usually they are doing the generation, and we as humans are doing the verification."

That sentence is a good architecture note.

Generation is cheap compared with verification. A model can draft a reply, recommend a refund, summarize an account, classify an exception, or propose a next step. But in a real workflow, the product is not the generated text. The product is the controlled decision.

## The project

I built a small [Workflow Edge Agent](https://codewrangler55.github.io/workflow-edge-agent/) to show this distinction.

The simulated agent handles an order exception. It has a model confidence score, an evidence match score, a policy fit score, a dollar risk, and a customer tier. The output is not just an answer. It is a route:

- auto-execute
- human approval
- return for evidence

That route is the important part.

## Why pilots stall

Many AI pilots work inside a sandbox and then fail at the edge of the real workflow.

They can summarize a ticket but cannot update the CRM.
They can recommend an action but cannot prove the policy basis.
They can produce a confident answer but cannot handle missing evidence.
They can help one user but cannot produce an audit trail for the organization.

That is where the implementation work starts.

The agent needs a verifier layer. The verifier should check policy, evidence, risk, permissions, and exception rules before the system acts. Low-risk cases can move faster. High-risk cases should go to a human. Weak-evidence cases should not be dressed up as confidence.

## The implementation shape

In a production version, I would separate the workflow into layers:

- the model proposes
- deterministic checks validate
- policy rules constrain
- evidence citations support the decision
- risk rules route the case
- approvals and writes are logged

That is less glamorous than a prompt demo, but it is the difference between an assistant and an operating system feature.

The model should not be the only control point. It should be one component in a system that knows when to act, when to abstain, and when to ask for help.

## What this signals

Executives are hearing that agents will change work. They are right to pay attention. But the phrase "agent" can hide the actual product questions.

Can it use the right tools?
Can it verify its own proposed action?
Can it respect approval thresholds?
Can it explain why it routed a case?
Can it leave evidence behind?

That is the work I wanted this project to make visible.

AI pilots do not die because the model cannot generate. They die because the organization has not built the verification, control, and workflow integration around the generation.
