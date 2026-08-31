# Tier 3 Iteration 2 Build Report

## Outcome

**COMPLETE** — the build agent implemented the Tier 3 specification from the exact live `main` baseline, repaired validation failures, opened a real PR, and pushed a bounded repair commit without merging.

- PR: #2 — https://example.invalid/private-rehearsal-pr-2
- Branch: `demo/tier3-iteration-2`
- Final head: `b2e64980e131efe64d09af61164899db08ee0be7`
- Base: `main` at `82dc28f29d90dc3f839e49065cfdd1de802040be`
- State: open, non-draft, unmerged

## Changed files

- `src/classifier.ts`
- `src/index.ts`
- `src/rateLimiter.ts`
- `src/types.ts`
- `tests/api.test.ts`
- `tests/classifier.test.ts`

The final PR diff is scoped to implementation and tests. No workflow, task-spec, dependency, policy, secret, or unrelated documentation files are included.

## Validation evidence

- `npm ci` — passed.
- `npm test` — passed: 2 test files, 12 tests.
- `npm run typecheck` — passed.
- `npm run build` — passed.
- `git diff --check` — passed.
- GitHub Actions build checks for the final head — successful.
- Targeted probe: active bucket remains denied after high-cardinality pressure; unseen identity is conservatively denied at capacity.
- Targeted probe: fractional configuration returns defaults `{ maxRequests: 100, windowMs: 60000 }`.

The first implementation attempt had three integration-test failures and a strict TypeScript error; the build agent repaired them before opening the PR. The independent review then found and the repair commit fixed active-window eviction and fractional configuration handling.

## Known operational tradeoff

The in-memory limiter keeps active buckets to preserve per-IP windows and rejects unseen identities when the configured bucket capacity is full. This bounds memory and avoids silently restoring quota through eviction, but a high-cardinality burst can temporarily reject new clients. The behavior is documented in `src/rateLimiter.ts` and is visible in the readiness report for human consideration.

## Handoff Prompt to Orchestrator

Use the independent re-review and merge-readiness report for PR #2 at exact head `b2e64980e131efe64d09af61164899db08ee0be7`. Do not approve or merge; the human owns the final decision.
