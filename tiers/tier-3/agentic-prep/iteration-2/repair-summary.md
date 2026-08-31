# PR #2 Repair Report

## Outcome

Repaired PR #2 in place on `demo/tier3-iteration-2` and pushed without merging.

- PR: https://example.invalid/private-rehearsal-pr-2
- New head: `b2e64980e131efe64d09af61164899db08ee0be7`
- Commit: `fix: preserve active rate-limit buckets`
- PR state after push: open, non-draft, mergeable; GitHub reported `mergeable_state: unstable` while checks were still running.
- Local and remote branch refs were verified equal at the new head.

## Blocking findings repaired

### C1 — bounded eviction / active-window quota bypass

The limiter no longer evicts active buckets when capacity is reached. Expired buckets are still removed. If an unseen identity arrives while `maxBuckets` active buckets are retained, it is rejected with a positive retry interval until the earliest active bucket expires. Existing identities therefore retain their counts and cannot regain quota because unrelated identities generated cardinality pressure.

This is a bounded, conservative policy with an explicit tradeoff: a high-cardinality burst can temporarily reject new identities while the active set is full. That trades some availability for preserving per-client-IP enforcement; it avoids silently weakening the security/control guarantee. The policy and tradeoff are documented in `src/rateLimiter.ts` and covered by the high-cardinality regression test.

### C2 — fractional configuration values

`positiveFiniteInteger` now requires `Number.isInteger(parsed)` in addition to finite and positive validation. Fractional `RATE_LIMIT_MAX_REQUESTS` and `RATE_LIMIT_WINDOW_MS` values consequently fall back to `100` and `60000`, rather than being floored.

## Files modified

- `src/rateLimiter.ts`
- `tests/api.test.ts`

No workflow, task-spec, dependency, policy, or PR #1 files were modified.

## Validation

All commands below were run in `/tmp/guardrail-api-workshop-iter2` against the repaired code:

- `npm test` — passed, 2 test files / 12 tests.
- `npm run typecheck` — passed.
- `npm run build` — passed.
- `git diff --check` — passed before commit.
- Targeted `npm test -- --run tests/api.test.ts` — passed, 8 tests.
- Built-artifact C1 probe with `maxRequests: 1`, `maxBuckets: 2`: A1 and B1 allowed; A2 remained denied; unseen C1 denied; bucket size stayed 2.
- Built-artifact C2 probe with both config values set to `1.9`: returned `{ maxRequests: 100, windowMs: 60000 }`.

After pushing, GitHub check-runs for the exact new head showed one completed successful `build` run and one `build` run in progress at report time.

## Unresolved risks / limitations

- The bounded limiter cannot retain an unbounded history of every IP. Its explicit capacity behavior is conservative rejection of unseen identities until an active bucket expires; operators should size `maxBuckets` for expected concurrent client cardinality.
- GitHub's newly triggered build check was still in progress when this report was written; local tests, typecheck, build, and diff checks passed.
- No merge, approval, review, or PR #1 modification was performed.

## Handoff Prompt to Orchestrator

PR #2 is repaired and pushed at exact head `b2e64980e131efe64d09af61164899db08ee0be7`. C1 is addressed by retaining active buckets and conservatively rejecting unseen identities at capacity; C2 is addressed by rejecting fractional config values and applying defaults. Local validation is green. Do not merge or approve; re-check the in-progress GitHub build and review the explicit high-cardinality availability tradeoff before human merge.
