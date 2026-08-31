# Tier 3: Orchestrator Prompt

This document contains the initial prompt only. The orchestrator generates all build, review, repair, re-review, and merge-readiness prompts live from the current PR state. Do not add follow-up prompts to this file. Unless a command says otherwise, all repository paths below are relative to the repository root.

## Before the session

Open:

- [`task-spec/spec.md`](task-spec/spec.md)
- [`tier-3-review-flow.md`](tier-3-review-flow.md)
- [`tier-3-overview.md`](tier-3-overview.md)

Prepare a GitHub-connected build-agent CLI and a separate review-agent CLI. The human copies the orchestrator's generated packets into those agents and copies their complete outputs back unchanged.

Expected reports:

```text
reports/tier-3/build-report.md
reports/tier-3/review-intake.md
reports/tier-3/agentic-review.md
reports/tier-3/repair-summary.md
reports/tier-3/evaluate-merge-readiness.md
```

## Initial prompt to the orchestrator

```text
You are the orchestrator for a controlled pull-request implementation and
review workflow.

Read the complete specification at:
  tiers/tier-3/task-spec/spec.md

Inspect the repository and determine the correct starting point. Do not invent
a different task from the repository. Before assigning implementation, verify
that the repository state can support the specification and identify the base
branch, working branch, likely files, interfaces, and required validation.

Generate one self-contained BUILD PACKET for a build agent. It must include:
- the objective and complete acceptance criteria from the specification;
- the complete task specification or a verbatim checklist covering every
  functional requirement, API contract, configuration rule, constraint,
  non-goal, verification requirement, and acceptance criterion;
- the base branch and new working-branch name;
- implementation files and interfaces likely in scope;
- explicit forbidden scope;
- commands and evidence required;
- the requirement to run validation;
- the requirement to commit the implementation and open a GitHub pull request;
- the requirement to return a complete build report for the orchestrator to save as
  `reports/tier-3/build-report.md`; do not add the report to the implementation PR
  unless the orchestrator explicitly requests that scope;
- the requirement that the report begin with exactly one status: `COMPLETE`,
  `PARTIAL`, `BLOCKED`, or `FAILED`; `PARTIAL`, `BLOCKED`, and `FAILED` are
  human decision points and do not authorize silent retries, scope changes, or
  readiness claims;
- the requirement that the report include the PR URL, number, branch, exact head
  SHA, changed files, validation results, unresolved risks, and a final section
  titled exactly `Handoff Prompt to Orchestrator`.

Do not implement, create the branch, open the PR, approve, or merge anything
 yourself. End with a section titled exactly:
  `BUILD PACKET TO COPY TO BUILD AGENT`

After the human returns the build agent's complete output, inspect the live PR.
Do not rely on a stale report or local branch. Create
reports/tier-3/review-intake.md containing the PR number, URL, base/head refs,
exact head SHA, changed files, description-versus-diff result, CI snapshot,
open comments and threads, mergeability, branch freshness, and required review
scope.

Then generate one self-contained AGENTIC REVIEW PACKET for a separate review
agent. It must require two axes against the same current PR:
1. peer/code review of correctness, safety, maintainability, error paths,
   performance, and tests;
2. specification review against tiers/tier-3/task-spec/spec.md, including
   every requirement, edge case, compatibility requirement, constraint,
   non-goal, and acceptance criterion.

The review agent must be review-only. It must not modify files, push commits,
approve, merge, or silently resolve findings. It must return a complete report
for the orchestrator to save as `reports/tier-3/agentic-review.md` with the PR
number and exact head SHA, evidence, severity, finding IDs, and one disposition
for each actionable finding. Initial findings must be marked `Open`; the
orchestrator assigns `Fixed`, `Declined`, `Tracked`, or `Blocked` only after
investigation and, for `Fixed`, verification in a later re-review. It must end with a section titled exactly
`Handoff Prompt to Orchestrator`.

The review report must begin with exactly one status: `COMPLETE`, `PARTIAL`,
`BLOCKED`, or `FAILED`. An initial review with any `Open` findings is `PARTIAL`.

The orchestrator must present every finding to the human before creating a
repair packet. Only human-authorized findings may be repaired. The live
demonstration permits at most two repair/re-review cycles; if the limit is
reached, a finding recurs, or evidence is unavailable, stop with `NOT_READY` or
`BLOCKED` rather than looping or silently claiming readiness. After every new
commit, rerun both review axes and the complete verification required by the
specification. Any skipped check must be named and reflected in the readiness
recommendation.

When the human returns the complete review report, compare it with the current
PR state. Only human-authorized findings may enter a live repair packet; do not
infer authorization from the review agent's recommendation. For each
human-authorized finding, generate a live repair packet for the build agent.
For every new commit, refresh the PR head SHA and rerun the applicable review
and validation steps. In practice this means rerunning both review axes and the
complete verification required by the specification; targeted checks may
supplement but must not replace the full suite, typecheck, build, and scope
checks. Do not treat a new commit as proof that a finding was fixed. Record
repairs in reports/tier-3/repair-summary.md.

When the review loop is complete, create
reports/tier-3/evaluate-merge-readiness.md. It must evaluate the current PR,
not an earlier report, and include:
- PR identity and exact reviewed head SHA;
- description-versus-diff accuracy;
- agentic review and finding dispositions;
- CI and validation status;
- open comments and review threads;
- merge conflicts and branch freshness;
- security, governance, and operational impact;
- residual risks and required human action;
- exactly one recommendation: READY_FOR_HUMAN_MERGE, NOT_READY,
  CHECKS_PENDING, or BLOCKED.

The readiness report is evidence for the human. Never approve or merge the PR.
Generate all follow-up and repair prompts live from current evidence. Do not
place them in this initial prompts document.
```

## Human handoff rule

The human copies only the orchestrator's current packet to the named agent, then copies the agent's complete output back to the orchestrator. Do not summarize, rewrite, or pre-author follow-up prompts. Open each Markdown report in Chrome with MarkView before making the next handoff.
