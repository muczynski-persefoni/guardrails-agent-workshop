# Break the Agent: Spoken Script

## Transition

“Now we are going to do the part most teams skip: we are going to try to break the system before production does.”

“These are not abstract warnings. Each scenario describes a realistic way an agent can do damage while appearing helpful, productive, or correct.”

## Instructions

“Get into groups of three to five. Read all three scenarios. For each one, write down four things:

What is the risk?
Which rule or checkpoint should catch it?
Who performs that check?
What is the recovery path if it gets through?

Then choose the one you think would hurt most in production.”

“Do not try to redesign the entire process. Find the specific seam where the failure should have been caught.”

“You have [time]. We will hear a few answers, then reveal what these scenarios are based on.”

## Discussion prompts

For each group, ask:

“What would have caught this before implementation?”
“What evidence would prove that control worked?”
“What would you do in the first thirty minutes after discovering it?”

If a group says “the agent should have known better,” ask:

“What structural rule or checkpoint prevents that mistake when the prompt, model, or context is wrong?”

## Reveal

“These scenarios map directly to the three tiers we have been discussing.”

“The Cascade is a Tier 2 failure: the dependency graph was wrong before the fleet began.”

“The Helpful Fix is an authority failure: the task scope did not stop the agent from turning a narrow fix into unrelated cleanup.”

“The Phantom Approval is a Tier 3 review failure: several approvals created confidence, but nobody verified the effective permission path.”

“The lesson is not that agents are uniquely careless. The lesson is that every autonomous action needs a defined scope, proof, escalation path, and recovery path.”

“Which one did your existing process make easiest to miss?”