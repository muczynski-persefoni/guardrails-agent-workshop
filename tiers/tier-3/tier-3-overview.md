# Tier 3: Execute, Review, and Evaluate Merge Readiness

## Purpose

Tier 3 demonstrates a real pull-request lifecycle. An agent implements a standalone technical specification and opens a GitHub pull request. A separate agentic review examines the PR on two axes, the implementation agent repairs valid findings, and the review is repeated against the new PR head. The process ends with a human-facing merge-readiness report—not an expectation that the human reread every line of code.

The visual overview is [`tier-3-review-flow.md`](tier-3-review-flow.md).

## Specification

The implementation target is [`task-spec/spec.md`](task-spec/spec.md). It is the only product specification used by this workflow.

## Workflow

```text
spec.md
  ↓
build agent implements the change
  ↓
build agent opens a GitHub pull request
  ↓
PR intake captures current state
  ↓
agentic review: peer/code axis + specification axis
  ↓
human authorizes repair scope or records a disposition
  ↓
new commits trigger full dual-axis review and validation
  ↓
evaluate merge readiness
  ↓
human approves, requests changes, blocks, or escalates
```

## Roles

### Orchestrator

Coordinates the workflow against the live PR. It reads the specification, generates copy-ready prompts for the build and review agents, collects their reports, refreshes PR state after every push, synthesizes findings, and prepares the merge-readiness evaluation. It does not implement, approve, or merge.

### Build agent

Implements the specification on a dedicated branch, runs required validation, opens a GitHub pull request, and reports the PR number, URL, branch, head SHA, changes, evidence, and limitations.

### Agentic reviewer

Reviews the actual GitHub PR, not an assumed local branch. It performs both review axes:

- **Peer/code review:** correctness, safety, maintainability, error handling, performance, and tests.
- **Specification review:** conformance to `task-spec/spec.md`, API compatibility, edge cases, non-goals, and scope.

The reviewer records findings with evidence and dispositions, then returns them to the orchestrator.

### Human reviewer

Reads the reports and the current PR state through the merge-readiness report. The human decides whether the evidence is sufficient to approve, request changes, block, or escalate. Only the human approves and merges.

## Durable artifacts

Reports are evidence about the PR. The PR itself remains the source of truth.

```text
reports/tier-3/build-report.md
reports/tier-3/review-intake.md
reports/tier-3/agentic-review.md
reports/tier-3/repair-summary.md
reports/tier-3/evaluate-merge-readiness.md
```

Each report identifies the PR number and exact head SHA it describes. A report for an old SHA cannot establish readiness for a newer commit.

## Review and repair loop

The agentic review must inspect current PR metadata, description, changed files, CI, open comments, review threads, mergeability, and branch freshness before producing a verdict. The initial review marks each actionable finding `Open`; the orchestrator presents every finding with severity and evidence to the human. Only human-authorized findings enter a repair packet. The orchestrator or human then assigns one honest disposition, and only a later re-review may mark a repaired finding `Fixed`:

- `Open` — identified but not yet dispositioned or verified.
- `Fixed` — addressed by a commit and verified.
- `Declined` — investigated and rejected with a technical reason.
- `Tracked` — intentionally outside the PR with a verified follow-up reference.
- `Blocked` — a PR-level blocker prevents safe progress.

After a repair push, refresh the PR head SHA and rerun the applicable review and validation steps. Do not treat a new commit as proof that the finding was fixed.

The live demonstration allows at most two repair/re-review cycles. After the
limit, or if a finding recurs or cannot be evaluated, stop and produce
`NOT_READY` or `BLOCKED`. Never declare readiness with an unresolved blocking
finding. After every new commit, rerun both review axes and the complete
verification required by `task-spec/spec.md`; targeted checks may supplement
but must not replace the full suite, typecheck, build, and scope checks.

## Merge-readiness evaluation

The final report summarizes current evidence instead of asking the human to perform a line-by-line review. It covers:

- PR identity and exact reviewed head SHA
- Description-versus-diff accuracy
- Agentic review completion and finding dispositions
- CI and validation status
- Open comments and review threads
- Merge conflicts and branch freshness
- Security, governance, and operational impact
- Residual risks and required human action

The report returns exactly one recommendation:

```text
READY_FOR_HUMAN_MERGE
NOT_READY
CHECKS_PENDING
BLOCKED
```

`READY_FOR_HUMAN_MERGE` means the evidence is sufficient for human approval. It does not approve or merge the PR.

If the live GitHub workflow cannot proceed, label the session `BLOCKED` and use
`tiers/tier-3/agentic-prep/` only as historical fallback evidence. Fallback
reports never establish readiness for the current PR or a newer head SHA.

## Boundaries

- The build agent may modify implementation and test files within the approved scope and may open a PR.
- The review agent is review-only unless the orchestrator gives a separate, human-authorized repair assignment.
- The orchestrator may generate prompts and reports but may not approve or merge.
- The human controls prompt handoffs, finding dispositions that require judgment, and final approval/merge.
- Follow-up prompts are generated live from the current PR state and are not prewritten in `tier-3-prompts.md`.
