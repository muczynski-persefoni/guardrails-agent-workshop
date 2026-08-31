# Tier 2: Four-CLI macOS Setup

## Before the presentation

Install and authenticate the CLIs you will actually demonstrate. Do not put API keys or login tokens in the repository.

Claude Code:

```bash
npm install -g @anthropic-ai/claude-code
claude auth status --text
```

Codex CLI:

```bash
npm install -g @openai/codex
codex --version
```

Authenticate Codex using its normal interactive login flow before the session. Confirm that both commands work from a terminal inside the repository.

## Prepare the repository

```bash
git clone https://github.com/muczynski-persefoni/guardrails-agent-workshop.git
cd guardrail-api-workshop
npm install
npm test
```

Start from a clean working tree. For the Tier 2 demo, do not use permission-bypass or unrestricted modes.

## Open four panes

Use iTerm2 or macOS Terminal. Arrange four interactive CLI panes:

- Pane 1: orchestrator
- Pane 2: Agent Alpha
- Pane 3: Agent Beta
- Pane 4: Agent Gamma

Use the same repository directory in each pane. Keep the repository on `main` for the planning checkpoint.

Example launches:

```bash
# Pane 1
claude

# Pane 2
claude

# Pane 3
codex

# Pane 4
claude
```

The vendor assignment can change. The roles and scopes must not.

## First commands to show

In the orchestrator pane, inspect the identities and plan:

```bash
find agents -name SOUL.md -print
sed -n '1,220p' tiers/tier-2/tier-2-overview.md
```

If your Claude CLI supports it, `claude agents` can also show configured agents. Verify the command on the demo machine before putting it on a slide.

## Safety checklist

- Start all four sessions before the audience arrives.
- Complete workspace trust and authentication prompts in advance.
- Use a clean `main` checkout.
- Keep the initial prompts ready in `tiers/tier-2/tier-2-prompts.md`. Follow-up prompts are generated live and are not stored in that document.
- Do not let any pane modify application source, tests, branches, or commits before or during the report round. Workers may write only their assigned Markdown report files.
- Have a recorded fallback showing the same four-pane flow.
- Keep one spare terminal available for recovery commands.

## Demo sequence

1. Orchestrator reads the request, plan, and SOUL files.
2. Orchestrator assigns Alpha and Beta in parallel.
3. Alpha and Beta confirm their boundaries.
4. Gamma reports that it is blocked on both.
5. The human reviews the plan and decides whether to approve kickoff.

The point is not that four terminals are busy. The point is that parallel work is bounded, dependency-aware, and interruptible.