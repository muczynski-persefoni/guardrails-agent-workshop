# Break the Agent: Facilitator Guide

Use this after groups have committed to their answers. Do not reveal the answers from the repository in advance.

## Scenario 1: The Cascade

Core risk: a bad dependency graph and interface change send parallel agents down incompatible paths, leaving conflicts and an applied migration that is hard to unwind.

Best checkpoint: Tier 2 human plan review before kickoff. The review must inspect dependencies by interface, not only by file, and must confirm the migration and merge ordering.

Recovery: stop new work, freeze merges, identify the last known-good state, reconcile the interface contract, decide whether to roll back or safely roll forward the migration, then re-plan the remaining work. Do not let each agent repair its own branch independently.

Teaching point: the most expensive failure can happen before any agent writes code.

## Scenario 2: The Helpful Fix

Core risk: an agent expands a narrowly scoped CI fix into unrelated cleanup and removes behavior that was intentional, causing multiple production incidents while CI remains green.

Best checkpoint: Tier 2 authority and escalation rules, reinforced by Tier 3 review. “Fix the type error” does not authorize cleanup, behavior changes, or compatibility decisions. Unexpected findings should be escalated, not silently fixed.

Recovery: stop further rollout, identify the three changed behaviors, restore the last known-good compatibility path, deploy the smallest safe rollback or forward fix, and open separate tickets for the unrelated issues. Preserve the evidence of what the agent changed.

Teaching point: helpfulness without scope control is a production risk.

## Scenario 3: The Phantom Approval

Core risk: several confident reviews and a human approval miss a privilege-escalation path hidden in a large diff and test helper.

Best checkpoint: Tier 3 vertical and peer review, plus a human security-sensitive approval. Review the import graph and effective permissions, not only the files that look like production logic. AI approvals are evidence, not authorization.

Recovery: treat it as an active security incident: disable or restrict the new permission, preserve logs, identify affected users and actions, revoke or rotate exposed access if needed, patch and test the authorization path, then review why the approval process missed it.

Teaching point: review volume and reviewer confidence do not replace targeted verification.

## Closing question

Ask: “Which scenario did your process make easiest to miss?”

Then connect the answers back to the three seams:

- Tier 1 catches bad thinking before code.
- Tier 2 catches bad decomposition before parallel work.
- Tier 3 catches bad execution before approval or release.