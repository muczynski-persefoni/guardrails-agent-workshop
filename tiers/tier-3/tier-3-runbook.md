# Tier 3: Participant Runbook

## Before the presentation

All paths below are relative to the repository root. Open these Markdown files in Chrome with MarkView:

1. `task-spec/spec.md`
2. `tier-3-review-flow.md`
3. `tier-3-prompts.md`
4. `tier-3-overview.md`

Before starting, verify the repository remote and target base branch, a clean
working tree, authenticated GitHub access, permission to read/create PRs and
checks, and availability of the orchestrator, build-agent, reviewer, and
MarkView sessions. Do not put credentials in the repository. If the live PR
workflow cannot proceed, label the session `BLOCKED` and use
`tiers/tier-3/agentic-prep/` only as historical fallback evidence.

Prepare separate CLI sessions for the orchestrator, build agent, and agentic reviewer. Confirm the build agent can create a branch, commit, push, and open a GitHub pull request. The human owns approval and merge; normally stop the presentation at the final decision before taking either GitHub action.

Prepare the report workspace:

```text
reports/tier-3/build-report.md
reports/tier-3/review-intake.md
reports/tier-3/agentic-review.md
reports/tier-3/repair-summary.md
reports/tier-3/evaluate-merge-readiness.md
```

## 1. Start the orchestrator

Paste the initial prompt from `tier-3-prompts.md`. The orchestrator reads the specification and returns a self-contained build packet.

The human copies the complete build packet to the build agent. Do not manually rewrite it.

## 2. Build and open the PR

The build agent implements the specification, runs the required validation, commits the changes, pushes its branch, and opens a GitHub PR. It returns a complete build report; the orchestrator or human saves it as `build-report.md` in the report workspace rather than adding it to the implementation PR unless explicitly requested.

The report must begin with exactly one status: `COMPLETE`, `PARTIAL`, `BLOCKED`,
or `FAILED`. It must include the PR URL, number, branch, exact head SHA, changed
files, validation evidence, limitations, and a handoff prompt to the orchestrator.

Open the report and PR in MarkView/GitHub before continuing.

## 3. Agentic PR review

Copy the build agent's complete output back to the orchestrator. The orchestrator captures the live PR state in `review-intake.md` and returns a review packet for the separate review agent.

The review agent reviews the actual PR on two axes:

- Peer/code review
- Specification conformance review against `task-spec/spec.md`

It returns `agentic-review.md` with evidence-backed findings and `Open`
dispositions; the orchestrator or human saves the report in the report
workspace. The report must begin with exactly one status: `COMPLETE`, `PARTIAL`,
`BLOCKED`, or `FAILED`.

## 4. Repair and re-review

Copy the complete review output back to the orchestrator. The orchestrator
presents every finding to the human with severity, evidence, and proposed
action. Only human-authorized findings enter a live repair packet; other
findings receive an explicitly recorded `DECLINED`, `TRACKED`, or `BLOCKED`
disposition.

After every new commit:

1. Refresh the PR head SHA.
2. Recheck the changed files and PR description.
3. Re-run both review axes and the complete verification required by the specification. Targeted checks may supplement but cannot replace the full suite, typecheck, build, and scope checks.
4. Re-review the changed PR state.
5. Record the result in `repair-summary.md`.

Do not treat a new commit as proof that a finding was fixed.

The live demonstration permits at most two repair/re-review cycles. If a
finding recurs, cannot be evaluated, or remains unresolved after the limit,
stop and produce `NOT_READY` or `BLOCKED`.

## 5. Evaluate merge readiness

When the agentic review loop is complete, the orchestrator creates `evaluate-merge-readiness.md`.

Open the report in MarkView. It should summarize:

- Current PR identity and head SHA
- Description-versus-diff accuracy
- Agentic review findings and dispositions
- CI and validation state
- Open comments and threads
- Mergeability and branch freshness
- Security, governance, and operational impact
- Residual risks
- One final recommendation

The report must contain exactly one recommendation, spelled exactly as one of:
`READY_FOR_HUMAN_MERGE`, `NOT_READY`, `CHECKS_PENDING`, or `BLOCKED`.

## 6. Human decision

The human chooses one of the following actions after reviewing the readiness report:

- Approve and merge
- Request changes
- Block
- Escalate

For the standard presentation, stop before the human takes the actual GitHub approval or merge action. The point is to show how agents reduce the human review burden without transferring final authority to the agents. If you choose to demonstrate the final action, make it an explicit human-controlled step after the readiness gate.
