# Tier 3 Iteration 1 — PR #1 Merge-Readiness Report

## Evaluation scope and evidence

This is an evidence-only merge-readiness evaluation. No code, branch, PR state, comments, reviews, approval, or merge action was modified. Evidence was refreshed from the authenticated GitHub API on the live PR, together with the Tier 3 specification and the preserved independent review.

- **Repository:** `private rehearsal repository`
- **PR:** #1 — `feat: harden classification gateway`
- **URL:** https://example.invalid/private-rehearsal-pr-1
- **State:** open, non-draft, not merged
- **Base:** `main` at `c078c505a754727937d10229a29d944f8c7cdb4a`
- **Head branch:** `demo/tier3-iteration-1`
- **Exact reviewed head:** `7e63cbf3a279054ce2ed8142895a0a745247764c`
- **Live head branch SHA:** matches the reviewed head exactly
- **Specification:** `tiers/tier-3/task-spec/spec.md` (167 lines)
- **Independent review:** `/opt/data/guardrail-api-workshop-iter1-agentic-review.md`; it is marked complete and reviewed the same exact head SHA

The caller-provided base prefix was reconciled against live API data; the exact base SHA is the value recorded above.

## Description-versus-diff integrity

**Result: MISMATCH / incomplete description.** The PR body accurately describes the gateway-hardening implementation and lists `npm test`, typecheck, build, and `git diff --check` as validation. However, the live PR diff also contains a broad workshop-materials batch that is not disclosed in the body and is not limited to the implementation/configuration/tests required by the specification.

The body does not mention the unrelated or ancillary changes, including Tier 1/Tier 2 materials, multiple Tier 3 workflow/runbook/prompt files, report placeholders, and Tier 4 optional-material renames. This is material because the specification requires changes to be limited to the required implementation, configuration, and tests and requires no undocumented scope changes.

## Changed scope

The live PR contains **29 changed files**, **1,462 additions**, and **262 deletions**. The implementation/test subset is:

- `src/classifier.ts`
- `src/index.ts`
- `src/rateLimiter.ts`
- `src/types.ts`
- `tests/api.test.ts`
- `tests/classifier.test.ts`
- `tests/rateLimiter.test.ts`

The remaining changed paths include two report placeholders, Tier 1/Tier 2 documentation, Tier 3 task and workflow materials, and Tier 4 optional-material renames. This broad scope is not represented in the PR description and remains an acceptance/governance concern.

## Agentic review completion and finding dispositions

The preserved independent Tier 3 review is **COMPLETE**, not merely planned. It identified the following current dispositions:

| ID | Severity | Current disposition | Merge-readiness implication |
|---|---|---|---|
| CR-1 | High | OPEN | `trust proxy: true` makes `req.ip` dependent on caller-controlled `X-Forwarded-For` in deployments without a separately guaranteed trusted ingress; per-IP rate limiting can be bypassed. Requires an explicit trust-boundary contract and direct/trusted-proxy/spoofed multi-hop tests. |
| CR-2 | Medium | OPEN | The in-memory bucket map has no bound or cleanup for expired high-cardinality identities, allowing unbounded retention and availability risk. |
| CR-3 | Medium | OPEN | Required verification evidence is incomplete: valid configuration, malformed-body classes, unsafe HTTP policy mapping, HTTP-level IP isolation, failure-open diagnostics, and other specification bullets are not covered. |
| CR-4 | Low | FOLLOW-UP_RECOMMENDED | Existing policy fallback is silent for malformed configuration; not a blocker alone, but compatibility/configuration evidence should be strengthened. |
| SCOPE-1 | Medium | OPEN | The undocumented workshop-materials batch violates the literal scope/acceptance constraints unless explicitly re-scoped and approved by the repository owner. |

No live GitHub review or comment has closed or otherwise dispositioned these findings. The independent review's conclusions remain applicable because the live head still matches `7e63cbf3a279054ce2ed8142895a0a745247764c`.

## CI and check state

For the exact live head:

- Two GitHub Actions `build` check runs completed with **SUCCESS** (run IDs `33336488556` and `33336494101`).
- The PR GraphQL status rollup reports both check runs completed successfully.
- The conventional commit-status endpoint has zero status contexts and reports `pending`; this does not negate the two successful check runs, but it is worth noting if repository policy expects a conventional status context.
- No failed or in-progress check run was observed.

The green checks demonstrate that the configured CI job passed; they do not establish complete Tier 3 specification coverage or close the open security, availability, evidence, and scope findings.

## Open comments, reviews, and threads

- Issue-level PR comments: **0**
- Review comments: **0**
- Review threads: **0**
- Formal GitHub reviews: **0**
- Review decision: empty/no approval recorded

There are therefore no open GitHub comment threads to resolve, but the absence of comments is not evidence that the independent findings are fixed or accepted.

## Mergeability and branch freshness

- GitHub reports `mergeable: true` and `mergeable_state: clean`.
- `main` is currently at `c078c505a754727937d10229a29d944f8c7cdb4a`; the PR base matches it.
- GitHub compare reports the PR head is **24 commits ahead and 18 commits behind** the current base, with status **diverged**.
- Both branches are unprotected according to the branch API response.

The clean mergeability result means GitHub currently sees no textual merge conflict. It does not mean the branch is fresh or that the PR satisfies the specification. Before a final human merge decision, the owner should refresh/rebase as appropriate and rerun checks on the resulting exact head if the base advances or the head changes.

## Validation evidence

The preserved independent review records the following local validation after a clean install from the committed lockfile:

- `npm run typecheck` — passed
- `npm run build` — passed
- `npm test` — passed (3 files, 8 tests)
- `git diff --check` — passed

The review also records that an initial typecheck failure was caused by stale/missing Express declarations in the pre-existing `node_modules`; `npm ci` resolved that environment issue. Passing validation is credible evidence for those commands, but the 8-test suite does not satisfy the specification's full verification matrix.

## Security, governance, and residual risk

This is a **DEEP-risk** change because it alters an API contract, policy-adjacent classification, proxy-derived client identity, and request-volume enforcement. The principal residual risk is that the rate limiter can be bypassed by spoofing forwarded client identity where the application directly trusts proxy headers. Unbounded identity buckets add a process-memory/availability risk, amplified by that spoofability. Missing failure-path and compatibility tests leave required behavior unproven, particularly failure-open diagnostics and malformed requests before metering.

No external model/API, Redis, database, or new implementation dependency was identified by the independent review. The implementation remains deterministic and the visible CI build passes. Those positives do not resolve the security boundary, memory-retention, verification, or undocumented-scope issues.

## Required human actions

1. Resolve or explicitly disposition CR-1 with a documented trusted proxy/client-IP contract, implementation changes as needed, and tests for direct, trusted-proxy, spoofed, and multi-hop requests.
2. Resolve CR-2 by bounding/evicting limiter state and testing the selected availability behavior.
3. Close CR-3 by adding evidence for every required verification bullet, including valid/invalid configuration, malformed request classes, unsafe policy mapping, per-IP HTTP isolation, and throwing-limiter diagnostics.
4. Split the unrelated workshop-materials changes into separate appropriately described changes, or obtain and record explicit owner approval for the broader scope (SCOPE-1).
5. After any change, refresh the exact head SHA, checks, reviews, comments/threads, mergeability, and base freshness.
6. A human reviewer must provide the required approval and make the merge decision. **Agents do not approve or merge PRs.**

## Recommendation

**NOT_READY**

The PR is open, non-draft, mergeable, and its visible GitHub Actions checks are green, but it is not ready for human approval because the current exact head retains an actionable rate-limit identity bypass, unbounded limiter-state risk, incomplete required verification evidence, and undocumented out-of-scope changes. This recommendation is not an approval or merge action.

## Handoff Prompt to Orchestrator

Re-evaluate PR #1 only after CR-1, CR-2, CR-3, and SCOPE-1 have been resolved or explicitly accepted by the responsible human owner. Refresh the live PR metadata, exact head SHA, base freshness, changed files, checks, reviews, comments, threads, and mergeability. Preserve the rule that agents do not approve or merge; a human must make the final approval and merge decision.
