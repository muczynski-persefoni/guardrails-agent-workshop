# Tier 1: Prompts for the Iterative Planning Handoff

These prompts run a fresh, planning-only investigation. Do not let either agent read facilitator materials or prior outputs that could bias the investigation.

## Before the session

From the repository checkout:

```bash
git status
npm install
npm test
```

Open two CLI panes:

- Pane 1: Claude, the planning/specification agent
- Pane 2: Codex, the adversarial reviewer

Prepare these human-controlled handoff files:

- `plan-claude-v1.md`
- `review-codex-v1.md`
- `plan-claude-v2.md`
- `review-codex-v2.md`
- `plan-claude-v3.md` — the next plan created after the second review

Do not prepopulate them from an earlier run.

Use [`tier-1-handoff.md`](tier-1-handoff.md) as the facilitator's official handoff record. It specifies exactly which artifacts are frozen and what each agent receives. Do not give that facilitator document to either agent during the fresh investigation.

## Step 1 — Claude creates the first plan/spec

Paste this into Claude:

```text
You are the planning and specification agent in a new investigation.

Treat this as a cold read. You have no memory of any previous run, rehearsal,
plan, or review. Do not read anything under the tiers/ directory. Do not read
prior plans, review reports, adjudication sheets, or facilitator materials.
Inspect the repository and the original feature request in
specs/add-rate-limiting-and-scoring.md directly. Read relevant source files,
tests, README, and the relevant agent authority files.

Create a detailed implementation plan/specification only. Do not write code,
modify files, create branches, or commit anything.

Include:
1. Goal and acceptance criteria
2. Relevant files and interfaces
3. Proposed work breakdown
4. Dependencies and sequencing
5. Test strategy
6. Risks and rollback concerns
7. Contradictions, assumptions, and unresolved questions

Pay special attention to the conflict between the Redis requirement and the
repository's no-external-services promise, and the ambiguity about whether
rate limiting applies only to /classify or to all endpoints.

Do not silently resolve contradictions. End with a section titled
"Questions for the Human".

Your response is also the official handoff package to Codex. After
"Questions for the Human", add a section titled exactly `Handoff to Codex`
with these fields:

- `Investigation status`: state that this is the first cold-read investigation
- `Original request`: identify the feature request reviewed
- `Plan artifact`: identify this response as `plan-claude-v1.md`
- `Evidence reviewed`: list the repository areas and source files you actually inspected
- `Review request`: explicitly ask Codex to perform an adversarial review
- `Constraints`: state that no implementation, file changes, branches, or commits are authorized

Do not put facilitator findings or expected answers in the handoff.
```

Save Claude's response unchanged as `plan-claude-v1.md`.

## Step 2 — Codex performs the first adversarial review

Paste this into Codex and provide the repository, the original request, and
only the unchanged `plan-claude-v1.md`:

```text
You are the adversarial reviewer for a new planning investigation.

Review plan-claude-v1.md against the repository and the original feature
request in specs/add-rate-limiting-and-scoring.md. Do not read anything under
the tiers/ directory, including facilitator worksheets or expected findings.
Do not rely on any earlier review or rehearsal.

Do not write code, modify files, create branches, or rewrite the plan.
Produce a report for the original planning agent.

Find:
1. Missing requirements
2. Contradictions
3. Unclear scope
4. Incorrect dependencies or sequencing
5. Missing tests
6. Security or availability risks
7. Assumptions requiring human approval

For every finding provide:
- Finding
- Evidence from the repository or request
- Severity: blocker, concern, or suggestion
- Recommended action for the planning agent

Pay particular attention to Redis versus no external services, /classify
versus all endpoints, threshold boundaries, backward compatibility, and the
dependency graph.

End with a section titled exactly `Handoff back to Claude` containing:

- `Review artifact`: identify this response as `review-codex-v1.md`
- `Plan reviewed`: identify `plan-claude-v1.md`
- `Findings count`: give the number of findings
- `Required action`: summarize what the original planning agent should address
- `Implementation status`: state that no implementation is authorized

Do not declare the plan approved in this first review.
```

Save the response unchanged as `review-codex-v1.md`.

## Step 3 — Claude updates the plan/spec

Give Claude the original `plan-claude-v1.md` and the unchanged
`review-codex-v1.md`. Paste:

```text
You are the original planning agent continuing the same investigation.

Read your original plan and the adversarial review report provided below.
Update the plan/spec to address the review. For every finding, explicitly
accept it, reject it with reasoning, or mark it for human escalation. Preserve
unresolved questions rather than inventing decisions.

Planning only: do not write code, modify repository files, create branches, or
commit anything. Return the complete next version of the plan/spec, not a
diff. Make the changes visible enough that a reviewer can compare v1 and v2.
End with "Questions for the Human" and include any remaining decisions.

Then add a section titled exactly `Handoff to Codex for Re-review` containing:

- `Updated artifact`: identify this response as `plan-claude-v2.md`
- `Prior review`: identify `review-codex-v1.md`
- `Changes made`: summarize the substantive revisions
- `Open decisions`: list issues still requiring human adjudication
- `Review request`: ask Codex to verify the changes and re-review the updated plan
```

Save Claude's complete response as `plan-claude-v2.md`.

## Step 4 — Codex verifies and re-reviews

Give Codex the repository, original request, `plan-claude-v1.md`,
`review-codex-v1.md`, and `plan-claude-v2.md`. Paste:

```text
You are the adversarial reviewer conducting the second pass.

First compare plan-claude-v1.md with plan-claude-v2.md. State whether the plan
changed, citing concrete additions, removals, or decisions. Check whether the
original planning agent addressed each finding in review-codex-v1.md.

Then re-review plan-claude-v2.md against the repository and the original
feature request. Do not read anything under tiers/ and do not write code,
modify files, create branches, or rewrite the plan.

Return:
1. Change verification
2. Findings addressed
3. Remaining findings, each with Finding, Evidence, Severity (blocker,
   concern, or suggestion), and Recommended action for the planning agent
4. A section titled exactly `Handoff back to Claude for Next Iteration` containing:
   - `Review artifact`: identify this response as `review-codex-v2.md`
   - `Plan reviewed`: identify `plan-claude-v2.md`
   - `Changes verified`: state whether changes were made and cite evidence
   - `Remaining findings`: list findings to pass to Claude next
   - `Recommendation`: continue, escalate, or ready for human approval

Do not declare the work complete merely because changes were made. Judge the
updated plan on its evidence and completeness.
```

Save the response as `review-codex-v2.md`.

## Step 5 — Claude creates the next plan/spec

Give Claude the unchanged `plan-claude-v2.md` and `review-codex-v2.md`. Paste:

```text
You are the original planning agent continuing the investigation.

Read the updated plan/spec and the second adversarial review. Create the next
complete version of the plan/spec. Address each remaining finding, or
explicitly mark it for human escalation with reasoning. Do not silently drop a
finding or invent a resolution.

Planning only: do not write code, modify repository files, create branches, or
commit anything. Return the complete plan/spec, not a diff. End with
"Questions for the Human" and a section titled exactly `Final Demo Handoff`
containing:

- `Updated artifact`: identify this response as `plan-claude-v3.md`
- `Prior review`: identify `review-codex-v2.md`
- `Changes made`: summarize the substantive revisions
- `Open decisions`: list any remaining human decisions
- `Next real step`: state that a real workflow hands v3 back to Codex for another review
```

Save Claude's complete response as `plan-claude-v3.md`.

## Demo stopping point

Stop the live demonstration after Claude produces `plan-claude-v3.md`. Explain that a real team hands v3 back to Codex and repeats the loop until Codex returns no material blockers or concerns, then a human approves the plan before implementation or Tier 2 orchestration.
