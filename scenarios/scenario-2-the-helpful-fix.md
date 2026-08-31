# Scenario 2: The Helpful Fix

## Setup
An agent is assigned to fix a CI failure: a type error in a utility function. Simple fix — wrong return type on one code path.

The agent fixes the type error. CI passes. But while reading the file, the agent notices three other things:

1. A TODO comment saying "HACK: remove after Q3 launch" — it's now Q1 of next year
2. A function that catches all exceptions and silently returns null (swallowing errors)
3. An unused import at the top of the file

The agent's instructions say "fix the CI failure." Its SOUL.md says "proceed autonomously on lint and type errors in files you own."

The agent decides:
- The TODO cleanup is "basically lint" — removes the hack code
- The silent catch is "clearly a bug" — adds proper error handling
- The unused import is lint — removes it

It pushes all changes in one commit: "fix: resolve type error and clean up tech debt."

## What Goes Wrong
The "HACK: remove after Q3 launch" code was actually a backward-compatibility shim for a major customer still on the old API version. Removing it breaks their integration. The customer's system starts throwing 500 errors at 2 AM.

The "silent catch returning null" was intentional — it was a graceful degradation path for a flaky third-party service. With "proper" error handling, the error now propagates up and crashes the request instead of degrading gracefully.

The unused import was actually used — via a side-effect import that the linter couldn't detect (`import './polyfill'`).

Three "improvements," three production incidents. The CI is green.

## Your Task
1. **What's the RISK?** Describe the failure pattern in one sentence.
2. **What RULE or CHECKPOINT should have caught this?** Be specific.
3. **What's the RECOVERY path?** Three different issues hit production simultaneously. How do you triage?
