# Break the Agent: Participant Instructions

## The exercise

In small groups, read the three scenarios in `scenarios/`.

Each scenario describes an agent about to make a dangerous mistake. Your job is not to redesign the whole system. Find the specific control that should catch the mistake and the recovery path if it gets through.

## For each scenario, answer four questions

1. What is the risk? State it in one sentence.
2. Which rule or checkpoint should catch it?
3. Who performs that check: human, agent, or automation?
4. What is the recovery path if the damage has already started?

Then choose the scenario that would hurt most in production and explain why.

## Use this structure

```text
Scenario:

Risk:

Rule or checkpoint:
Tier: 1 / 2 / 3
Performed by: human / agent / automated

Recovery:

Why this is the scariest:
```

## Important distinction

A green test run is not the same as a safe change. Ask what the system actually checked, what it did not check, and where a human should have stopped or redirected the work.

The facilitator will reveal the real production versions after the group discussion.