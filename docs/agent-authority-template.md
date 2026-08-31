# Agent authority — a fillable template

Copy this into your repo. The filename is your convention — `AGENTS.md`,
`CLAUDE.md`, `SOUL.md`, whatever your tooling reads. The content is the point.

**Target length: one screen.** If it's longer than that, it won't be followed.

---

## Why this is a separate file

Most real instruction files are long. We have one in production at 425 lines:
goal handling, PR rules, localization, design system, quality gates — and
somewhere around line 226, the governance rules.

That's the problem. An agent reading that file weights *"never force-push to
main"* and *"use `t()` from the start"* exactly the same. So do the humans
skimming it.

**Split them:**

| File | Contains | Length |
|---|---|---|
| `AGENTS.md` / `CLAUDE.md` | Conventions — commands, style, structure, patterns | As long as it needs to be |
| **This file** | **Authority — what it may decide, must escalate, may never do** | **One screen** |

Conventions tell an agent *how* to do the work. Authority tells it *how far it
may go without asking.* Only the second one is a governance artifact, and only
the second one has to survive an audit.

---

## The template

```markdown
# Agent Authority — <agent or role name>

## Identity
You are <name>. You handle <narrow domain>. You do not touch <adjacent domain>.

## Optimizes for
- <the property that wins ties, e.g. reversibility over speed>
- <the second one>

## Decides alone
<An explicit allowlist. If it isn't listed here, it is not autonomous.>
- <e.g. fixing type errors in files you own>
- <e.g. adding tests for code you authored>

## Must escalate before acting
<Stop and ask. Escalation is a success, not a failure.>
- Anything changing a public contract, schema, or response shape
- Adding a runtime dependency
- Security findings of any kind, including ones you could trivially fix
- Pre-existing code that looks wrong but isn't part of your task
- Anything you'd describe as "while I was in there"

## Never
<Non-negotiable. No judgement call available.>
- Force-push, or rewrite history on any shared branch
- Modify CI configuration
- Merge your own work
- Touch secrets, credentials, or auth code
- Disable, skip, or delete a test to make something pass

## Scope
May touch:    <explicit paths>
May not touch: <explicit paths>
Read-only:     <paths it may read for context but never write>

## Proof
How a human verifies you followed these rules:
- <e.g. every change is a PR; no direct commits>
- <e.g. escalations appear in the PR body under "Escalated">
- <e.g. the diff touches only paths listed under Scope>

## Interrupt
How a human stops you mid-run: <the actual mechanism — not aspirational>
```

---

## Mapped to EU AI Act Article 14

Article 14 requires that humans can *effectively oversee* a high-risk system.
Each section above answers one of its requirements — which is what makes this
file useful to your compliance people, not just your engineers.

| Article 14(4) requires the human can… | Section that provides it |
|---|---|
| (a) understand the system's capacities and limits | **Identity**, **Scope** |
| (b) remain aware of automation bias | **Proof** — log AI review as *reviewed*, never *approved* |
| (c) correctly interpret the output | **Proof** |
| (d) decide not to use it, or disregard its output | **Must escalate** |
| (e) **intervene or interrupt** | **Never**, **Interrupt** |
| Art. 12 — automatic logging for traceability | **Proof** — every action lands as a commit or PR |

See `eu-ai-act-article-14.md` for the full mapping.

---

## The five questions that actually matter

If you write nothing else, answer these. In order of how much pain they save:

1. **What may it decide without asking?** If you can't list it, it isn't
   bounded — and "use good judgement" is not a boundary.
2. **What must it escalate?** Include the category most teams miss: *pre-existing
   problems it noticed but wasn't asked to fix.* "Helpful" is the most dangerous
   agent behaviour there is.
3. **What may it never do,** regardless of how sensible it seems in context?
4. **How would you know if it broke a rule?** A rule you can't verify is a
   preference.
5. **How do you stop it mid-run?** If the honest answer is "close the laptop,"
   write that down — then fix it.

---

## Three things learned the hard way

**Scope by interface, not just by file.** Two agents editing different files
still collide if one changes an exported type the other imports. File-scope
isolation is not semantic isolation.

**Protect code that looks wrong on purpose.** Backwards-compatibility shims,
deliberate swallowed errors, ugly workarounds — an agent reads those as defects
to fix. Mark them `@intentional` and forbid modification without approval.

**Escalation rate is your health metric.** An agent that never escalates isn't
safe — it's unsupervised, and you simply haven't found out yet. Track
escalations alongside merges.

---

## Worked examples

`agents/agent-alpha/SOUL.md`, `agent-beta`, and `agent-gamma` in this repo are
three filled-in versions for three narrowly-scoped agents working the same
codebase in parallel. Read them together — the interesting part is how their
scopes are drawn so they can run at the same time without colliding.
