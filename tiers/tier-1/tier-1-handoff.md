# Tier 1: Official Agent Handoff Record

This document defines the human-controlled handoff between Claude and Codex. It is a facilitator document, not an input that either agent should read during the fresh investigation.

## Principle

Agents do not hand work to each other implicitly. The human freezes an output, packages the approved inputs, and explicitly passes the package to the next agent.

The handoff is an evidence boundary:

- Claude receives the repository and original feature request.
- Codex receives Claude's frozen plan/spec and the same source inputs.
- Claude receives Codex's unchanged review report.
- Codex receives Claude's revised plan/spec plus the original review.

No agent edits another agent's artifact.

## Artifact sequence

| Stage | Artifact | Created by | Passed to |
|---|---|---|---|
| 1 | `plan-claude-v1.md` | Claude | Human, then Codex |
| 2 | `review-codex-v1.md` | Codex | Human, then Claude |
| 3 | `plan-claude-v2.md` | Claude | Human, then Codex |
| 4 | `review-codex-v2.md` | Codex | Human, then Claude |
| 5 | `plan-claude-v3.md` | Claude | Human; final demo artifact |

Save each response unchanged. Do not ask an agent to clean up, summarize, or rewrite its own output before the next handoff.

## Handoff 1: Claude → Codex

The human confirms:

- The investigation began from a cold read.
- Claude did not read `tiers/` or prior artifacts.
- `plan-claude-v1.md` is Claude's complete response, unchanged.
- The repository and original request are available to Codex.

Pass Codex exactly:

```text
Repository: the workshop checkout
Original request: specs/add-rate-limiting-and-scoring.md
Frozen plan: plan-claude-v1.md
```

Codex returns `review-codex-v1.md`, addressed to the original planning agent. Its response must end with `Handoff back to Claude`, including the artifact name, plan reviewed, finding count, required action, and the statement that implementation is not authorized. Codex does not implement findings.

## Handoff 2: Codex → Claude

The human passes Claude:

```text
Original plan: plan-claude-v1.md
Adversarial report: review-codex-v1.md
```

Claude must return a complete revised plan/spec, not a diff. It must show how each finding was accepted, rejected with reasoning, or escalated for human decision. Save it as `plan-claude-v2.md`.

## Handoff 3: Claude → Codex

The human confirms that `plan-claude-v2.md` is Claude's complete response and passes Codex:

```text
Repository: the workshop checkout
Original request: specs/add-rate-limiting-and-scoring.md
Original plan: plan-claude-v1.md
Original review: review-codex-v1.md
Revised plan: plan-claude-v2.md
```

Codex first verifies whether the plan changed and whether the first report was addressed. It then performs a fresh adversarial review of v2 and returns `review-codex-v2.md`.

## Handoff 4: Codex → Claude for the next iteration

The human passes Claude the unchanged second review:

```text
Updated plan: plan-claude-v2.md
Second adversarial report: review-codex-v2.md
```

Claude must create a complete next plan/spec, not a diff. It must address or explicitly escalate each remaining finding. Save it as `plan-claude-v3.md`. For the conference demo, this is the final artifact shown before explaining that a real workflow hands v3 back to Codex again.

## Human gate and iteration rule

After every review, the human decides whether to:

- **Accept** a finding and require a revision.
- **Reject** a finding with a recorded reason.
- **Escalate** an unresolved decision.
- **Continue** the loop with another Claude revision.
- **Stop** only when the adversarial review has no material blockers or concerns and the human approves the plan.

For the conference demo, stop after Claude produces `plan-claude-v3.md`, the revision responding to the second Codex report. Explain that production use continues the same handoff loop by sending v3 back to Codex until the human gate is satisfied.

## What must not happen

- Do not let Codex silently edit Claude's plan.
- Do not let Claude silently discard a Codex finding.
- Do not pass facilitator worksheets or expected findings to either agent.
- Do not treat “the plan changed” as proof that the change was correct.
- Do not begin implementation during Tier 1.
