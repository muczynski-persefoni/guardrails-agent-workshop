# Tier 1: Fresh Investigation and Adversarial Plan Review

## Purpose

Tier 1 demonstrates an unbiased, iterative handoff between two agents before implementation begins. The first agent investigates the repository and creates a plan/spec. The second agent adversarially reviews that work, hands back a report, and then checks whether the original agent actually addressed the findings.

This is a planning exercise only. Neither agent writes code, changes files, creates branches, or commits during the demo.

## The demo

1. Start a **new investigation**. Do not reference a previous plan, rehearsal, adjudication sheet, or facilitator material.
2. Claude performs a cold read and creates the first implementation plan/spec.
3. Freeze Claude's output exactly as written.
4. Hand the frozen plan/spec to Codex for adversarial review.
5. Give Codex's report back to Claude. Claude updates the plan/spec in response.
6. Hand the updated plan/spec back to Codex.
7. Codex verifies that updates were made and performs a second review, returning another list of suggestions.
8. For this demonstration, stop after the next Claude plan and explain that a real team continues the loop until the adversarial reviewer has no material findings.

The human controls every handoff and decides when the plan is good enough to proceed.

## Fresh-investigation rule

Both agents must treat this as a new investigation:

- Do not read anything under `tiers/`.
- Do not read prior plans, review reports, adjudication sheets, or rehearsal outputs.
- Do not assume findings from an earlier run.
- Inspect the repository and original feature request directly.
- If an old artifact exists at the expected output path, ignore it and use a new path or overwrite it only under human direction.

The point is to reduce anchoring and demonstrate how independent review improves the plan.

## Official handoff record

Use [`tier-1-handoff.md`](tier-1-handoff.md) as the canonical record of what the human freezes and passes between agents. It defines the artifact sequence, input package, and human gates. The agents should not read it during the fresh investigation.

## Claude: first investigation

Use the prompt in [`tier-1-prompts.md`](tier-1-prompts.md), Step 1. Claude must create a detailed plan/spec only and end with `Questions for the Human`. Save the response unchanged as `plan-claude-v1.md`.

## Codex: first adversarial review

Follow Handoff 1 in [`tier-1-handoff.md`](tier-1-handoff.md). Give Codex the same repository, the original feature request, and the unchanged `plan-claude-v1.md`.

Codex produces a report for the original planning agent, not code and not a rewritten plan. Save it as `review-codex-v1.md`.

## Claude: respond to the report

Give Claude the unchanged `review-codex-v1.md` and ask it to update the plan/spec. Claude may revise the plan in response to the report, but must not implement anything. Save the result as `plan-claude-v2.md` so the audience can see what changed.

The human should be able to compare v1 and v2 and identify which findings were accepted, rejected, or escalated.

## Codex: verify and re-review

Give Codex `plan-claude-v2.md`, its prior report, the repository, and the original request. Use the prompt in Step 4 of [`tier-1-prompts.md`](tier-1-prompts.md).

Codex must first state whether the plan changed and cite concrete changes. It then performs another adversarial review and returns any remaining findings as `review-codex-v2.md`.

## Claude: create the next plan/spec

After `review-codex-v2.md`, pass the unchanged report back to Claude. Claude creates the complete next plan/spec, incorporating or explicitly escalating the remaining findings. Save it as `plan-claude-v3.md`. This is still planning only; no implementation begins.

## Human checkpoint and stopping point

For the live demo, stop after Claude produces `plan-claude-v3.md`. Explain:

> This is not a one-shot “ask two models” trick. The loop continues by handing v3 back to Codex until the adversarial reviewer finds no material blockers or concerns, and a human approves the resulting plan.

At that point the human may record decisions in `tier-1-adjudication.csv` and authorize the transition to Tier 2. No agent silently decides when the loop is complete.

## Takeaway

The useful Tier 1 artifact is a traceable, human-approved plan/spec with visible revisions and adversarial review history—not generated code.

The second agent reviews the first agent's thinking, then checks whether the first agent acted on the review, before the team pays the cost of implementation.
