# Tier 2: Initial Prompts for the Orchestrated Report Demo

This document contains only the initial prompts. Do not add follow-up prompts here. Follow-up prompts are generated live by the orchestrator after it reads the worker reports and the human reviews the synthesis.

## Before the session

Prepare these report paths:

```text
reports/tier-2/alpha-report.md
reports/tier-2/beta-report.md
reports/tier-2/gamma-report.md
reports/tier-2/orchestrator-review.md
```

Do not prepopulate reports from an earlier run. During this round, workers may create or update only their assigned Markdown report; they may not modify application source, tests, branches, or commits.

## Initial orchestrator prompt

Paste this into the orchestrator:

```text
You are the orchestrator for a controlled Tier 2 worker-report exercise.

Inspect the original feature request in specs/add-rate-limiting-and-scoring.md
and these agent identity files:

- agents/agent-alpha/SOUL.md
- agents/agent-beta/SOUL.md
- agents/agent-gamma/SOUL.md

Create a bounded assignment packet for Alpha, Beta, and Gamma. The packet must
include each worker's objective, permitted scope, forbidden scope, evidence to
inspect, expected Markdown report path, dependencies, escalation rules, and
acceptance criteria.

Alpha and Beta may investigate in parallel. Gamma must also report in parallel,
but is blocked from implementation and integration testing until Alpha and Beta
provide their evidence. Gamma's first report must describe the blocked state,
what it needs, its integration-test plan, and its release criteria.

Do not write code, modify application source or tests, create branches, or
commit anything. Do not silently resolve contradictions. Explicitly surface
Redis versus no external services, /classify versus all-endpoint scope,
interface ownership, and dependency risks.

End with a section titled `Assignments to Copy to Workers`. Make each worker's
assignment self-contained so the human can copy it into the corresponding CLI.
```

## Initial Alpha worker prompt

Copy the orchestrator's Alpha assignment into Agent Alpha, preceded by:

```text
You are Agent Alpha in a controlled report exercise. Read your SOUL.md and the
assignment supplied below. Do not read other worker reports or facilitator
materials. Do not modify application source, tests, branches, or commits.

Produce the Markdown report at reports/tier-2/alpha-report.md. The report must
include your identity, assignment, authority boundaries, evidence inspected,
proposed infrastructure work, dependencies, risks, contradictions, escalation
items, and acceptance criteria.

End with a section titled exactly `Handoff Prompt to Orchestrator`. In that
section, provide a copy-ready prompt addressed to the orchestrator that tells it
to read alpha-report.md, verify the report against the repository and the other
worker reports when supplied, identify conflicts, and return a human-reviewable
synthesis. Do not put any worker follow-up prompt in this document or invent one
for the next round.
```

## Initial Beta worker prompt

Copy the orchestrator's Beta assignment into Agent Beta, preceded by:

```text
You are Agent Beta in a controlled report exercise. Read your SOUL.md and the
assignment supplied below. Do not read other worker reports or facilitator
materials. Do not modify application source, tests, branches, or commits.

Produce the Markdown report at reports/tier-2/beta-report.md. The report must
include your identity, assignment, authority boundaries, evidence inspected,
proposed classification and scoring work, dependencies, risks, contradictions,
escalation items, and acceptance criteria.

End with a section titled exactly `Handoff Prompt to Orchestrator`. In that
section, provide a copy-ready prompt addressed to the orchestrator that tells it
to read beta-report.md, verify the report against the repository and the other
worker reports when supplied, identify conflicts, and return a human-reviewable
synthesis. Do not put any worker follow-up prompt in this document or invent one
for the next round.
```

## Initial Gamma worker prompt

Copy the orchestrator's Gamma assignment into Agent Gamma, preceded by:

```text
You are Agent Gamma in a controlled report exercise. Read your SOUL.md and the
assignment supplied below. Do not read other worker reports or facilitator
materials. Do not modify application source, tests, branches, or commits.

Produce the Markdown report at reports/tier-2/gamma-report.md in parallel with
Alpha and Beta. You are blocked from implementation and integration testing
until Alpha and Beta provide their evidence. Your report must explicitly state
that blocked condition, identify the evidence and interfaces you need from both
workers, describe the integration and compatibility test plan you will execute
later, and define release criteria.

End with a section titled exactly `Handoff Prompt to Orchestrator`. In that
section, provide a copy-ready prompt addressed to the orchestrator that tells it
to read gamma-report.md, confirm the blocked dependency state, compare Gamma's
needs with Alpha and Beta's reports when supplied, and return a human-reviewable
synthesis. Do not put any worker follow-up prompt in this document or invent one
for the next round.
```

## Human handoff rule

The human copies the workers' `Handoff Prompt to Orchestrator` sections into the
orchestrator only after opening and reviewing the reports. The orchestrator then
creates the synthesis and proposes follow-up actions. Those follow-up prompts
are created on the fly and are intentionally not documented here.
