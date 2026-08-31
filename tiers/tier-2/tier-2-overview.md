# Tier 2: Orchestrated Worker Reports

## Purpose

Tier 2 demonstrates one orchestrator coordinating three bounded worker agents. The workers do not freely chat or independently invent the workflow. The human passes the orchestrator's assignments to each worker, collects their Markdown reports, and passes each worker's handoff prompt back to the orchestrator.

The deliverable is a set of readable reports that the audience can inspect in Chrome with MarkView.

## Workshop task

Use the rate-limiting and confidence-scoring feature request in `specs/add-rate-limiting-and-scoring.md`.

The orchestrator may inspect:

- `agents/agent-alpha/SOUL.md`
- `agents/agent-beta/SOUL.md`
- `agents/agent-gamma/SOUL.md`
- `specs/add-rate-limiting-and-scoring.md`

## Official handoff record

Use [`tier-2-handoff.md`](tier-2-handoff.md) as the facilitator's canonical record of the report flow, worker-to-orchestrator handoffs, and live follow-up boundary.

## Roles and first-round deliverables

### Orchestrator

Creates the initial assignment packet, confirms boundaries and dependencies, reads the worker reports, and prepares a human-readable synthesis. It does not silently resolve contradictions or start implementation.

### Agent Alpha

Produces `alpha-report.md` covering infrastructure, configuration, health checks, rate limiting, ownership, risks, and escalation points.

### Agent Beta

Produces `beta-report.md` covering classification, confidence scoring, threshold behavior, API compatibility, ownership, risks, and escalation points.

### Agent Gamma

Produces `gamma-report.md` in parallel with the others. Because Gamma depends on Alpha and Beta, its first report documents its blocked state, required inputs, integration-test plan, and release criteria. It does not pretend to test an implementation that does not exist.

## Report contract

Each worker report must contain:

1. Agent identity and assignment received
2. Scope and authority boundaries
3. Evidence inspected
4. Proposed work or test plan
5. Dependencies and blocked conditions
6. Risks, contradictions, and escalation items
7. Acceptance or readiness criteria
8. A final section titled exactly `Handoff Prompt to Orchestrator`

The handoff prompt must tell the human what to paste into the orchestrator to retrieve, inspect, and synthesize that report. It is a deliverable from the worker, not a follow-up prompt prewritten by the facilitator.

Suggested report locations:

```text
reports/tier-2/alpha-report.md
reports/tier-2/beta-report.md
reports/tier-2/gamma-report.md
reports/tier-2/orchestrator-review.md
```

Create only report artifacts during this planning round. Do not modify application source, tests, branches, or commits.

## Demo sequence

1. Start the orchestrator and three worker CLIs.
2. Give the orchestrator the initial prompt from `tier-2-prompts.md`.
3. Copy the orchestrator's bounded assignments into Alpha, Beta, and Gamma.
4. Have all three workers produce their first Markdown reports in parallel.
5. Open the three reports in Chrome with MarkView.
6. Copy each worker's `Handoff Prompt to Orchestrator` back into the orchestrator.
7. Have the orchestrator read the reports and create `orchestrator-review.md` with a cross-agent comparison, conflicts, dependency status, and human decisions required.
8. Review the synthesis with the audience.
9. The orchestrator proposes follow-up work live. The human chooses which follow-up prompt to copy to which worker.
10. Stop after demonstrating one or two live feedback turns; do not pre-script those follow-ups in the prompts document.

## Human checkpoint

Before any implementation is authorized, verify:

- Alpha and Beta have non-overlapping ownership.
- Gamma is visibly blocked until Alpha and Beta deliver the required evidence.
- Every report cites evidence rather than merely asserting readiness.
- Cross-agent conflicts are surfaced for human decision.
- The orchestrator does not claim to have read a report it was not given.
- Follow-up prompts are generated from the reports and human priorities, not from a fixed script.

## Core message

Orchestration is a controlled evidence flow: bounded assignments produce inspectable reports, reports return through explicit handoffs, and the human decides what feedback goes back into the system.
