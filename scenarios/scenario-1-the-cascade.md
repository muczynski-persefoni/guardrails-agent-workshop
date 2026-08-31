# Scenario 1: The Cascade

## Setup
Your team uses autonomous agents for PR creation and review. An orchestrator decomposes a 6-ticket Jira sprint into parallel agent tasks with a dependency graph.

The orchestrator produces this plan:

- Agent A: Refactor the authentication middleware (branch: refactor/auth)
- Agent B: Add new API endpoint for user preferences (branch: feat/user-prefs)
- Agent C: Update the database schema to add a preferences table (branch: feat/prefs-schema)
- Agent D: Write integration tests for the new endpoint (branch: test/user-prefs)
- Agent E: Update API documentation (branch: docs/user-prefs-api)
- Agent F: Add rate limiting to all API endpoints (branch: feat/rate-limiting)

Dependency graph:
```
A (auth refactor) → B (new endpoint) → D (tests)
C (schema) → B (new endpoint)
B (new endpoint) → E (docs)
F (rate limiting) — independent
```

A human reviews the plan and approves it. Agents start working.

## What Goes Wrong
Four hours later:
- Agent A's auth refactor changed the middleware signature. Every endpoint now requires a different auth header format.
- Agent B built the new endpoint using the OLD auth middleware signature (it started before A merged).
- Agent F added rate limiting that wraps the auth middleware — but used the NEW signature from A's merged PR.
- Agent D's tests all pass locally but fail in CI because they run against the integrated branch where A and B conflict.
- Agent C's schema migration ran successfully — and cannot be easily rolled back.

The team now has: 4 PRs with cross-cutting conflicts, a database migration that's already applied, and tests that prove the system is broken but don't help fix it.

## Your Task
1. **What's the RISK?** Describe the failure in one sentence.
2. **What RULE or CHECKPOINT should have caught this?** Be specific — which tier, which check, what would it look like?
3. **What's the RECOVERY path?** The migration is applied. The branches conflict. How do you get back to a working state?
