# Scenario 3: The Phantom Approval

## Setup
Your team uses a multi-reviewer pipeline: three AI reviewers examine every PR, then a human does final approval. The rule is: 3 AI approvals + 1 human approval = merge.

An agent opens a PR that modifies the permission-checking middleware. The change is subtle: it adds a new permission type and updates the checking logic. The PR is 47 files, mostly test updates for the new permission type.

The three AI reviewers run:
- Reviewer 1 (security-focused): Approves. "Permission logic looks correct. New type properly validated."
- Reviewer 2 (code quality): Approves. "Clean implementation, good test coverage, follows existing patterns."
- Reviewer 3 (architecture): Approves. "Consistent with the permission model. No architectural concerns."

A human reviewer scrolls through the 47-file diff. The tests all make sense. The permission type addition looks clean. They see three AI approvals. They approve and merge.

## What Goes Wrong
Buried in the 38th file — a test helper — is a utility function that's also imported by production code (the test helper directory is in the production import path). The "test helper" function always returns `true` for the new permission type, bypassing the actual permission check.

This means: any user with the new permission type passes all permission checks, regardless of their actual permissions. It's a privilege escalation vulnerability hidden in what looks like test infrastructure.

No reviewer — AI or human — caught it. The AI reviewers analyzed the permission logic (which is correct) and the test coverage (which is thorough). They didn't trace the import graph to discover that a test utility was imported by production code. The human reviewer was anchored by three confident AI approvals on a 47-file diff.

## Your Task
1. **What's the RISK?** Describe the failure in one sentence.
2. **What RULE or CHECKPOINT should have caught this?** Think about what the reviewers DIDN'T check.
3. **What's the RECOVERY path?** A privilege escalation is live in production. What do you do in the first 30 minutes?
