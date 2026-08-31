# EU AI Act, Article 14 — mapped to an autonomous agent workflow

A one-page reference. Enforcement powers for general-purpose AI went live
**2 August 2026**: audits, corrective measures, and fines up to 3% of global
turnover. This maps the human-oversight requirement onto the three-tier loop
so you can hand it to whoever owns compliance in your org.

Not legal advice. It's the mapping we use.

---

## What Article 14 actually requires

Article 14 requires high-risk AI systems to be designed so humans can
**effectively oversee them**. Concretely, the human must be able to:

| Art. 14(4) | Requirement |
|---|---|
| (a) | **Understand** the system's capacities and limits, and monitor its operation |
| (b) | Stay alert to **automation bias** — over-relying on the system's output |
| (c) | **Correctly interpret** the output |
| (d) | **Decide not to use** the system, or disregard its output |
| (e) | **Intervene or interrupt** — stop the system mid-operation |

Article 12 separately requires **automatic logging** for traceability over the
system's lifetime.

---

## The mapping

| Requirement | Where it lives in the loop | The artifact |
|---|---|---|
| **(a) Understand + monitor** | Tier 2. A human reads the orchestrator's bounded assignments and handoff rules before any agent starts. | `tiers/tier-2/tier-2-overview.md`, `tiers/tier-2/tier-2-handoff.md`, per-agent `SOUL.md` scopes |
| **(b) Resist automation bias** | Tier 3. Multiple independent reviewers on the same diff, and AI approvals logged as *reviewed*, never *approved*. | review outputs; only humans approve |
| **(c) Interpret output** | Tier 1. A second model reviews the *plan* before code exists — the cheapest place to catch bad reasoning. | plan + cross-review, pre-implementation |
| **(d) Decide not to use** | `SOUL.md` escalation rules. The agent stops and asks rather than proceeding. | "Escalate Before Acting" / "Forbidden" |
| **(e) Interrupt** | **The Tier 2 checkpoint is the interrupt.** A human reading the plan before kickoff can stop the whole fleet at the cheapest possible moment. | pre-flight checklist |
| **Art. 12 logging** | Every agent action lands as a commit, branch, or PR. | `git log` — already immutable and timestamped |

---

## The two seams, stated plainly

Autonomy is not the risk. **Unsupervised transitions** are.

1. **Before kickoff** — a human reads the plan. A wrong dependency graph sends
   agents building conflicting work in parallel; that's more expensive to unwind
   than any single bad pull request.
2. **During execution** — a human watches for the thing the rules didn't
   anticipate.

Both seams exist because a mistake there is most expensive and least
self-correcting. That's an engineering argument. It happens to also be the
regulatory one.

---

## What to actually do on Monday

1. Write one `SOUL.md` for one agent. Three sections: decides alone / escalates
   / forbidden. Start narrow.
2. Add a pre-flight checklist a human signs before any parallel run.
3. Log AI review as *reviewed*, not *approved*. Only humans approve.
4. Check one thing your CI doesn't: can production code import from test
   directories?
