# Tier 3 Agentic Dry-Run Fallback

This folder is the durable fallback package for the Tier 3 conference dry run.

The live source of truth for each iteration is its GitHub pull request. These files preserve the prompts, reports, evidence, and decisions needed to explain or replay the workflow if the live demonstration cannot complete.

## Iteration structure

Each iteration may contain:

```text
iteration-N/
├── assignment.md
├── build-report.md
├── review-intake.md
├── agentic-review.md
├── repair-summary.md
├── evaluate-merge-readiness.md
└── run-notes.md
```

Reports must identify the PR number and exact head SHA they describe. Do not copy credentials or private tokens into this folder.

## Adaptive iteration policy

- Iteration 1 is the first complete dry run.
- If it exposes a major workflow or task problem, the next iteration refines it.
- Refinement remains serial while the change is still being stabilized.
- Once the workflow is good enough, later iterations may run in parallel as independent historical solutions.
- Every completed iteration remains preserved, including superseded PRs.

## Human boundary

Agents may implement, review, repair, and prepare readiness evidence. They do not approve or merge. The human reviews the final readiness report and owns the decision.

## Current status

The iteration files are created as the dry run executes. This README is committed to `main` before the first implementation PR so it remains available as a fallback even if the live run fails.
