# Tier 3 Iteration 2 Independent Agentic Review

**Status: PARTIAL** — review and validation are complete, but the PR is **not ready for merge** because two rate-limit correctness/configuration findings remain. No PR, branch, comment, review, or repository state was modified.

## Scope and exact revision

- **PR:** #2 — [feat: harden Tier 3 guardrail API](https://example.invalid/private-rehearsal-pr-2)
- **URL:** https://example.invalid/private-rehearsal-pr-2
- **Head:** `f9bd7346767fcdc9e814b9ec5a5e2950dd2c92ac`
- **Head branch:** `demo/tier3-iteration-2`
- **Base:** `main` at `82dc28f29d90dc3f839e49065cfdd1de802040be`
- **PR state:** open, non-draft, mergeable `true`, mergeable state `clean`
- **Changed files:** `src/classifier.ts`, `src/index.ts`, `src/rateLimiter.ts`, `src/types.ts`, `tests/api.test.ts`, `tests/classifier.test.ts` (193 additions / 73 deletions)
- **Freshness:** authenticated `git ls-remote` matched the PR API for both `refs/heads/demo/tier3-iteration-2` and `refs/private-rehearsal-pr-2/head` at the exact head SHA. The base ref also matched the PR API.
- **PR metadata/comments:** one commit; no requested reviewers, issue comments, formal reviews, or inline review comments were returned. PR body claims `npm ci`, `npm test`, `npm run typecheck`, `npm run build`, and `git diff --check`.

## Axis 1 — Peer/code review

### Finding C1 — High: bounded eviction permits within-window rate-limit bypass

**Location:** `src/rateLimiter.ts:30-46`.

The map is bounded, which resolves unbounded retention, but `prune()` evicts the first map key whenever the limit is exceeded. A client can therefore send requests under more than `maxBuckets` identities and then regain a fresh bucket for an evicted identity before its original window expires. This changes the specified per-client-IP semantics: a client that had already consumed its quota can become allowed again solely because unrelated identities caused eviction.

**Reproduction actually run against the built exact head:** with `maxRequests: 1`, `maxBuckets: 2`, and a fixed clock, `A1`, `B1`, and `C1` were allowed; after `C1` evicted `A`, `A2` was also allowed while the 60-second window was still active. The command output was:

```text
A1 { allowed: true, retryAfterSeconds: 60 } B1 { allowed: true, retryAfterSeconds: 60 } C1 { allowed: true, retryAfterSeconds: 60 } size 2 A2 { allowed: true, retryAfterSeconds: 60 } size2 2
```

This is not a JS thread race (the code is synchronous), but cleanup materially alters rate-limit behavior under high-cardinality traffic. The new test only checks `size()`, not that an evicted identity cannot bypass its active window.

**Disposition:** **Open / blocking.** The retention fix is only partial: memory is bounded, but the security/control guarantee is weakened. The implementation needs an explicitly accepted eviction policy/semantic tradeoff or a design that preserves the required per-IP window behavior; add a regression for eviction/high-cardinality behavior.

### Finding C2 — Medium: fractional environment values are accepted instead of treated as invalid

**Location:** `src/rateLimiter.ts:10-12`.

`positiveFiniteInteger()` uses `Math.floor(parsed)` rather than requiring an integer. The specification says invalid configuration values must use defaults. A value such as `RATE_LIMIT_MAX_REQUESTS=1.9` is not a valid request count, yet the implementation returns `1`; `RATE_LIMIT_WINDOW_MS=1.9` returns `1` ms instead of the default `60000` ms. This is also a behavior regression relative to the prior `positiveInteger` implementation, which required `Number.isInteger`.

**Reproduction actually run:**

```text
readRateLimitConfig({ RATE_LIMIT_MAX_REQUESTS: '1.9', RATE_LIMIT_WINDOW_MS: '1.9' })
=> { maxRequests: 1, windowMs: 1 }
```

The tests cover zero, negative, `NaN`, and `Infinity`, but not fractional values.

**Disposition:** **Open / blocking for full specification compliance.** Reject non-integer values and fall back to the documented defaults, with focused fractional-value tests.

### Positive code observations

- `app.set("trust proxy", hops)` defaults to `0` and only accepts an explicit integer hop count from 0 through 10. This avoids the iteration-1 unconditional `X-Forwarded-For` trust bypass for the default deployment.
- Malformed bodies are rejected before `limiter.check()` (`src/index.ts:24-33`), preserving the existing 400 message and not consuming capacity.
- The limiter is synchronous and has no shared mutable async cleanup task, so there is no cleanup timer race in this implementation.
- Limiter exceptions fail open and are logged through the injected logger (`src/index.ts:30-33`); the direct limiter also logs and fails open (`src/rateLimiter.ts:51-54`).
- `GET /health` is registered separately and does not call the limiter.
- The classifier remains deterministic/local and preserves the existing phrase-to-label behavior, while response policy mapping remains driven by `policies/default.json`.
- No external dependency or service was added; the changed-file set is limited to implementation and tests required by the task.

## Axis 2 — Specification review

The required spec was read from `tiers/tier-3/task-spec/spec.md` at the exact checked-out head.

| Requirement area | Evidence / result | Disposition |
|---|---|---|
| FR-1 confidence field and response shape | `src/types.ts:4-8`, `src/index.ts:39-46`; API tests assert fields | Pass |
| Confidence range 0..1 | Current classifier emits `0.4`, `0.5`, or `0.95`; no general runtime range validator is needed because the local finite branches are in range | Pass, with implementation-by-construction |
| Clear unsafe/safe labels, actions, and >=0.9 confidence | `classifier.ts:10-13`; `tests/api.test.ts:21-25` | Pass |
| `needsReview` strict `(0.4, 0.7)` boundaries | `classifier.ts:16-18`; classifier tests assert 0.4, 0.7, and interior values | Pass |
| Deterministic, explainable, no external model/API | Phrase/regex code in `classifier.ts`; no new dependency | Pass |
| Existing clear-cut labels/policy mapping and additive response | `applyPolicy()` unchanged in substance; old fields remain and tests assert them | Pass |
| FR-2 per-client-IP limiter only on POST `/classify` | `index.ts:24-47`; health path does not call limiter | Pass, subject to C1 under eviction |
| Defaults 100 / 60000 and env configuration | `rateLimiter.ts:1-19`, `24-19`; default/config tests | **Partial: C2 fractional invalid values** |
| Missing/invalid/zero/negative values use defaults | zero/negative/non-finite tested; fractional values are accepted due to flooring | **Fail: C2** |
| 429, JSON error code, positive Retry-After | `index.ts:34-37`, API test lines 35-39 | Pass |
| Independent IP counters and proxy semantics | Explicit hop-count trust model at `index.ts:17-19`; API test covers default spoof resistance and two-hop isolation | Pass for normal operation; C1 weakens guarantees after eviction |
| Health exemption and ISO timestamp | `index.ts:48`; API test lines 53-57 | Pass |
| Malformed input before capacity | `index.ts:26-29`; API test lines 27-33 | Pass |
| No Redis/database/external service | In-memory `Map`; package manifest unchanged | Pass |
| Unexpected limiter failure fails open with observable diagnostics | `index.ts:30-33`, `rateLimiter.ts:51-54`; API test lines 65-70 | Pass |
| FR-3 `/health` HTTP 200/body/timestamp generated per response | Express route uses `new Date().toISOString()` and test validates status/parseability | Pass |
| FR-4 400 compatibility and no new request fields | Existing error string retained; `text` remains the only required request field | Pass |
| Configuration table and documented defaults | Runtime constants and PR body mention behavior; no dedicated new configuration documentation was added | Pass in code; documentation is minimal |
| Constraints/non-goals | Existing runtime/dependencies retained; no auth, persistence, distributed coordination, CI, or secret changes | Pass |
| Verification evidence required by spec | New tests cover confidence, boundaries, safe/unsafe, defaults, configured/invalid values (except fractional), isolation, 429/header, malformed input, health exemption/status, fields/labels, cleanup, and failure-open logging | **Partial: missing fractional and eviction semantic regressions** |
| Acceptance criteria | Tests/typecheck/build pass and scope is narrow; full compliance is blocked by C1/C2 | **Not met** |

## Iteration-1 finding verification

1. **Unconditional trusted-proxy / forwarded-IP spoofing bypass — Resolved for the safe default.** `src/index.ts:17-19` sets Express trust proxy to `0` unless an explicit bounded hop count is supplied. The new API test sends different `X-Forwarded-For` values and confirms both requests use the direct peer bucket. Residual deployment responsibility: operators selecting `trustedProxyHops` must configure the real topology correctly; the code deliberately exposes that as an explicit option rather than trusting arbitrary headers.
2. **Unbounded limiter bucket retention — Resolved only as a memory-retention property; behavior is not fully resolved.** `MAX_BUCKETS=10000` and pruning keep the map bounded, and the test demonstrates the configured size bound. However, C1 shows eviction permits an active-window identity to receive a fresh quota.
3. **Missing verification evidence — Resolved for the claimed commands and most paths.** The PR body contains the verification commands, remote CI has two completed successful `build` check runs for the exact head, and local execution below provides test/typecheck/build/diff evidence. Evidence remains incomplete for fractional invalid configuration and eviction semantics.
4. **Broad undocumented scope — Resolved.** The exact PR diff contains only six implementation/test files directly tied to the specification; no unrelated policy, CI, secret, or dependency changes were found.

## CI and local validation

### Remote GitHub checks for exact head

Authenticated check-run API results for `f9bd7346767fcdc9e814b9ec5a5e2950dd2c92ac`:

- `build` — completed / success, run [33336975549](https://github.com/muczynski-persefoni/guardrails-agent-workshop/actions/runs/33336975549)
- `build` — completed / success, run [33336969357](https://github.com/muczynski-persefoni/guardrails-agent-workshop/actions/runs/33336969357)
- Commit status endpoint reported `pending` with zero legacy statuses; this is recorded separately from the successful check-runs and is not treated as a passing legacy status.

### Local commands actually run at the exact detached head

- `npm test` — **passed**, 2 test files / 12 tests.
- `npm run typecheck` — **passed** (`tsc --noEmit`).
- `npm run build` — **passed** (`tsc -p tsconfig.build.json`).
- `git diff --check 82dc28f...f9bd734...` — **passed**.
- Direct built-artifact probes reproduced the C1 eviction bypass and C2 fractional configuration behavior above.

No lint or format script exists in `package.json`, so none is claimed.

## Final assessment

The iteration-1 proxy spoofing and scope/evidence issues are substantially addressed, and the implementation passes the available automated checks. Nevertheless, the PR should remain **NOT READY / PARTIAL** until the author resolves the two open findings: (1) define and test a bounded-retention policy that does not silently invalidate active per-IP limits, or explicitly reconcile the requirement conflict, and (2) treat fractional configuration values as invalid and apply defaults. The current remote `clean` mergeability state is not equivalent to specification acceptance.

## Handoff Prompt to Orchestrator

Review PR #2 at exact head `f9bd7346767fcdc9e814b9ec5a5e2950dd2c92ac`. The independent review is complete and the report is at `/opt/data/guardrail-api-workshop-iter2-agentic-review.md`. Do not approve or merge. Carry forward blocking findings C1 (bounded eviction lets an evicted IP regain quota during the same window) and C2 (fractional `RATE_LIMIT_*` values are floored instead of defaulted as invalid). Iteration-1 proxy spoofing and broad-scope findings are resolved; bucket retention is only partially resolved. Local tests/typecheck/build and remote exact-head build checks passed, but acceptance remains PARTIAL/NOT_READY pending these fixes and regressions.
