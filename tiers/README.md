# Workshop Setup and Tier Map

Start here. This page gets your workstation ready and tells you which file to
open for each part of the **"Building Software with Securely Autonomous Agent
Teams"** masterclass.

## Workstation setup

### 1. Prerequisites

- Node.js 18+ and npm
- git
- A terminal that supports multiple panes (iTerm2 or macOS Terminal — Tier 2 uses four panes at once)
- Accounts and CLI access for **Claude Code** and **Codex**, installed and authenticated *before* the session

### 2. Clone and verify a clean baseline

```bash
git clone https://github.com/muczynski-persefoni/guardrails-agent-workshop.git
cd guardrail-api-workshop
npm install
npm test
npm run typecheck
```

All three should pass on a fresh clone of `main`. If something fails here,
it's your environment, not the workshop — fix it before the session starts.
No Redis, Docker, API keys, or external accounts are required to run the repo
itself.

### 3. Install and authenticate the CLIs

Needed for Tier 1 and Tier 2:

```bash
npm install -g @anthropic-ai/claude-code
claude auth status --text

npm install -g @openai/codex
codex --version
```

Run Codex's interactive login flow ahead of time — don't do first-time auth
live in front of a room. See `tiers/tier-2/setup-four-clis.md` for the full
four-pane terminal layout used in Tier 2 (the same CLIs, just more panes).

### 4. Know the branches

| Branch | What it is |
|---|---|
| `main` | Starting point for all tiers. Create a fresh working branch when a tier requires implementation. |
| `main` | The clean workshop baseline. Rehearsal branches are not included in this public-copy history. |

## The three tiers

**Tier 1 — Planning handoff.** Claude drafts an implementation plan, Codex
adversarially reviews it, a human adjudicates every finding. No code is
written.
Start with [`tier-1/tier-1-plan-review.md`](tier-1/tier-1-plan-review.md)
(the walkthrough) and [`tier-1/tier-1-prompts.md`](tier-1/tier-1-prompts.md)
(copy-paste startup prompts for both CLIs). Record decisions in
[`tier-1/tier-1-adjudication.csv`](tier-1/tier-1-adjudication.csv).

**Tier 2 — Orchestration and agent identity.** One orchestrator coordinates
three bounded agents (Alpha, Beta, Gamma) against a dependency graph, with a
human checkpoint before any agent writes code.
Start with [`tier-2/tier-2-overview.md`](tier-2/tier-2-overview.md), then
[`tier-2/setup-four-clis.md`](tier-2/setup-four-clis.md) for the pane layout
and [`tier-2/tier-2-prompts.md`](tier-2/tier-2-prompts.md) for the prompts.

**Tier 3 — Execute, review, and evaluate merge readiness.** A build agent
implements [`tier-3/task-spec/spec.md`](tier-3/task-spec/spec.md) on a fresh
branch and opens a real GitHub PR. Separate peer/code and specification reviews
challenge the change, human-authorized findings go through bounded repair and re-review,
and a human makes the final merge-readiness decision. Start with
[`tier-3/tier-3-runbook.md`](tier-3/tier-3-runbook.md), then use
[`tier-3/tier-3-prompts.md`](tier-3/tier-3-prompts.md) and the visual flow in
[`tier-3/tier-3-review-flow.md`](tier-3/tier-3-review-flow.md).

The optional "Break the Agent" group exercise is separate from Tier 3 under
[`tier-4-optional/`](tier-4-optional/).

## Also worth reading before the session

- [`../agents/`](../agents) — the three agent `SOUL.md` authority files used throughout Tiers 1 and 2
- [`../docs/agent-authority-template.md`](../docs/agent-authority-template.md) — the blank, fillable template to take home
- [`../docs/eu-ai-act-article-14.md`](../docs/eu-ai-act-article-14.md) — how this maps to EU AI Act human-oversight requirements
- [`../specs/add-rate-limiting-and-scoring.md`](../specs/add-rate-limiting-and-scoring.md) — the feature request every tier works against

## If something looks broken

This repo has bugs and contradictions planted on purpose (see the root
`README.md`). If you spot something odd while setting up, don't fix it —
flag it. It may be part of the exercise.
