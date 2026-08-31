# guardrail-api

A small API service used for the **Building Software with Securely Autonomous Agent Teams** workshop. It provides a deliberately simple guardrails gateway for the tier exercises.

This is the working repo for the **"Building Software with Securely Autonomous
Agent Teams"** masterclass (Session B — Engineering Deep Dive). Clone it, run
it, and use it during the session.

**New here?** Start with [`tiers/README.md`](tiers/README.md) — it covers workstation setup (Node, git, the Claude Code and Codex CLIs) and maps out all three workshop tiers.

## Be aware

This repo is **purpose-built for the session.** It contains real bugs that were
put here deliberately, and the code is small enough that some of it looks
unusual on purpose. That's the point — you're going to review it, and there has
to be something to find.

We're telling you the bugs are planted. We're not telling you what they are or
where they live. Finding them is the exercise.

## Run it

```bash
npm install
npm run dev      # starts the server on :3000
```

```bash
curl -X POST localhost:3000/classify \
  -H "content-type: application/json" \
  -d '{"text": "what is the capital of Denmark?"}'
# { "label": "safe", "policyAction": "allow" }
```

## Test it

```bash
npm test           # vitest
npm run typecheck  # tsc --noEmit, strict mode
npm run build      # emits to dist/
npm start          # runs the built server
```

## What's here

| Path | What it is |
|---|---|
| [`tiers/`](tiers/README.md) | The three-tier workshop flow. **Start with `tiers/README.md`** for setup. |
| `.github/` | CI workflow configuration. |
| `src/` | The service. Classifier, policy, types, Express entrypoint. |
| `tests/` | Vitest suite. |
| `reports/` | Placeholder locations for the tier handoff and review reports. |
| `specs/` | The feature request the build plan is drafted against. |
| `agents/*/SOUL.md` | Three worked agent authority files — what each may decide alone, escalate, or never do. |
| `docs/agent-authority-template.md` | **The fillable template. Take this home.** One screen, mapped to EU AI Act Article 14. |
| `docs/eu-ai-act-article-14.md` | Article 14 human-oversight requirements mapped onto this workflow. |
| `tasks/` | A single scoped task file handed to one agent. |
| `scenarios/` | Three failure scenarios for the optional "Break the Agent" workshop. |

## Branches

| Branch | What it is |
|---|---|
| `main` | Stable workshop baseline and all participant-facing materials. |
| `main` | The clean workshop baseline. Rehearsal branches are not included in this public-copy history. |

Tier 3 is a live pull-request lifecycle. Start from `main`, create a fresh
working branch, and let the orchestrator generate the current build, review,
repair, and readiness packets. Do not reuse the preserved iteration branches
for a new session.

Open `tiers/tier-3/tier-3-runbook.md` for the participant path and
`tiers/tier-3/tier-3-prompts.md` for the initial orchestrator prompt.

The Tier 3 fallback package is under `tiers/tier-3/agentic-prep/`. The live PR
is always the source of truth; fallback reports are historical evidence and
must not be treated as readiness evidence for a newer PR head.

## The classifier is naive on purpose

`src/classifier.ts` is keyword/phrase matching, nothing smarter. The feature
spec in `specs/` asks for something better — and the session is about what
happens between those two states: how the work gets planned, reviewed,
decomposed across agents, built, and verified.

## No external services

No Redis, no Docker, no API keys, no accounts. Everything runs on `localhost`
with in-memory state. If `npm install` and `npm test` work, you're ready.
