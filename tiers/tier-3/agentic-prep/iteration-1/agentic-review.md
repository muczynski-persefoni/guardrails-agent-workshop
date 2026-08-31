# Tier 3 Iteration 1 Independent Agentic Review

## Review identity

- **PR:** #1 — `feat: harden classification gateway`
- **URL:** https://example.invalid/private-rehearsal-pr-1
- **Repository:** `private rehearsal repository`
- **Base:** `main` at `c078c505a754727937d10229a29d944f8c7cdb4a`
- **Head reviewed:** `7e63cbf3a279054ce2ed8142895a0a745247764c`
- **Head branch:** `demo/tier3-iteration-1`
- **Review timestamp:** `2026-08-30T21:29:47+00:00`
- **Review mode:** review-only; no PR, repository, or GitHub comments were modified
- **Risk tier:** DEEP, because this changes an API contract, policy-adjacent classification, proxy-derived client identity, and request-volume enforcement.

## Evidence reviewed

- Live authenticated PR metadata, body, base/head refs, mergeability, changed-file list, reviews, and issue comments via `gh`/GitHub API.
- Complete specification: `tiers/tier-3/task-spec/spec.md` (167 lines).
- Exact checked-out head source and tests:
  - `src/index.ts`
  - `src/classifier.ts`
  - `src/rateLimiter.ts`
  - `src/types.ts`
  - `tests/api.test.ts`
  - `tests/classifier.test.ts`
  - `tests/rateLimiter.test.ts`
  - `src/policies/default.json`
  - `README.md`, `package.json`, `tsconfig.json`, `.github/workflows/ci.yml`
- Full PR diff against the live base: 29 changed paths, 1,462 additions and 262 deletions. The implementation subset is 7 paths; the remaining changes are workshop/documentation/materials files.
- Live PR check runs: two `build` checks completed successfully (run IDs `33336488556` and `33336494101`). No GitHub reviews or issue comments were present.

## Axis 1 — Peer/code review

### High findings

#### CR-1 — `trust proxy: true` lets callers spoof the rate-limit identity and bypass per-IP enforcement

- **Location:** `src/index.ts:21`, with identity consumed at `src/index.ts:36`.
- **Evidence:** The app globally enables `app.set("trust proxy", true)`, so Express accepts the left-most client address supplied in `X-Forwarded-For`. The limiter keys directly on `req.ip`.
- **Reproduction:** Against the checked-out build, two otherwise identical requests carrying `X-Forwarded-For: 198.51.100.10` and `X-Forwarded-For: 203.0.113.20` reached the injected limiter as two distinct keys (`["198.51.100.10","203.0.113.20"]`). An internet client can therefore rotate this header and obtain a fresh bucket per request unless a trusted proxy boundary is guaranteed outside the application.
- **Impact:** The required per-client-IP limit is ineffective for direct/public deployments and abusive traffic can evade protection. It can also make the limiter treat arbitrary user-supplied values as client identities.
- **Required action:** Configure an explicit trusted proxy hop/range appropriate to deployment, or derive the address from a trusted ingress contract; add integration coverage for direct requests, trusted proxy requests, and spoofed/multi-hop `X-Forwarded-For` behavior. Do not claim per-client-IP protection without documenting the trust boundary.
- **Disposition:** **OPEN / blocker for a security-sensitive rate-limit claim.**

### Medium findings

#### CR-2 — The in-memory bucket map has unbounded retention under high-cardinality client identities

- **Location:** `src/rateLimiter.ts:32-49`.
- **Evidence:** Every allowed identity is inserted into `buckets`; expired entries are only replaced when that same identity makes another request. There is no eviction, maximum key count, or periodic cleanup.
- **Impact:** A caller that can produce many distinct client-IP keys (made easier by CR-1) can grow process memory indefinitely, undermining availability. This is especially relevant because the feature is specifically intended to protect availability.
- **Required action:** Bound state or implement safe expiry/cleanup (and define the behavior when the bound is reached), then add a high-cardinality/expiry test or otherwise document the accepted bounded-memory tradeoff.
- **Disposition:** **OPEN / follow-up required before production readiness.**

#### CR-3 — New classifier tests do not prove the complete existing-label and policy compatibility surface

- **Location:** `tests/classifier.test.ts:5-23`, `tests/api.test.ts:20-43`.
- **Evidence:** The suite has only 8 tests and checks two unsafe examples, one safe example, threshold helper boundaries, one configured limiter scenario, one malformed object, and one health response. It does not assert all existing blocklist inputs/variants, policy mapping for unsafe (`block`) through the HTTP API, independent IP behavior at HTTP level, configured environment values through app construction, invalid JSON/primitive/null bodies, or limiter failure-open diagnostics.
- **Impact:** Passing CI does not establish the specification's explicit verification requirements for clear-cut labels, policy preservation, malformed requests, configuration, per-IP isolation, and unexpected limiter failures. The implementation may be correct in several of these paths, but the evidence is incomplete.
- **Required action:** Add focused tests for every verification bullet in `spec.md:142-155`, especially unsafe HTTP response (`policyAction: block`), all config fallback classes, proxy/client identity semantics, malformed request classes, and a throwing limiter with an asserted diagnostic sink.
- **Disposition:** **OPEN / evidence gap; not by itself proof of an implementation defect.**

### Low findings / maintainability

#### CR-4 — `applyPolicy` silently falls back on malformed policy configuration

- **Location:** `src/index.ts:13-16`.
- **Evidence:** A missing label rule silently selects `defaultAction`; the code does not validate that the policy configuration contains the expected safe/unsafe mappings or that actions are valid at runtime.
- **Impact:** A future policy-file regression can turn a classification into an unintended allow/block decision without diagnostics. This is pre-existing behavior, but the new additive response makes policy preservation a stated acceptance concern.
- **Required action:** At minimum add compatibility tests against the current policy file; consider startup validation or an observable error for malformed policy configuration if policy files are expected to evolve.
- **Disposition:** **FOLLOW_UP_RECOMMENDED** (not introduced by the PR’s core feature, so not a merge blocker alone).

## Axis 2 — Specification review

### Functional requirements and contracts

- **FR-1 confidence response:** **PASS in inspected paths.** `confidence` and `needsReview` are additive; safe returns `1`; matched unsafe tokens score deterministically with a cap at `1`; threshold helper uses strict `> 0.4 && < 0.7`; no external model/API is called.
- **FR-1 clear-cut semantics:** **PARTIAL evidence.** The tested exact `rm -rf` and `drop table` examples return unsafe/confidence `1`; however, the implementation marks an input unsafe on any individual token from any phrase and gives that case confidence `0.5`, while the spec does not define whether such a single-token match is “clear unsafe.” This ambiguity should be resolved in the spec or covered explicitly. Existing labels remain unsafe for those inputs.
- **FR-2 configuration:** **PASS for parser behavior inspected.** Missing, invalid, zero, negative, and non-integer values fall back to `100` and `60000`; positive integer values are accepted. Direct tests do not include valid configured values, so verification evidence is incomplete.
- **FR-2 timing/window:** **PASS for the tested fixed-window behavior.** A request at/after the configured window boundary starts a fresh bucket and `Retry-After` is positive/ceiling-rounded. There is no explicit test for sub-second windows, exact expiry, or clock anomalies.
- **FR-2 malformed-before-metering:** **PARTIAL.** The route validates `{}` before calling the limiter, and the integration test proves that case. JSON parse failures happen in `express.json()` before the route, but no test proves their status/body or capacity behavior; primitive/null and wrong-type bodies are also untested.
- **FR-2 failure-open and diagnostics:** **IMPLEMENTED, UNVERIFIED.** The route catches limiter exceptions, logs via `console.error`, and continues. No test injects a throwing limiter or asserts that diagnostics are emitted, so this required failure path lacks evidence.
- **FR-2 per-IP isolation:** **IMPLEMENTED under Express’s configured identity model, but security concern CR-1 applies.** The limiter map is keyed independently, and the unit test covers two keys. The chosen unconditional proxy trust makes the externally observable identity spoofable.
- **FR-3 health:** **PASS in inspected path and integration test.** `GET /health` returns 200, `status: "ok"`, and a newly generated ISO timestamp. It is registered outside the classify limiter and the test confirms it remains available after rate limiting.
- **FR-4 compatibility/policy:** **PARTIAL.** Existing fields are retained and policy JSON is unchanged; safe HTTP compatibility is tested. Unsafe HTTP policy mapping and the full previous classifier behavior are not tested.

### Constraints, non-goals, and acceptance criteria

- **No external service/dependency:** **PASS.** The implementation uses the existing Express/TypeScript runtime and an in-memory `Map`; `npm ci` reported no vulnerabilities and no new dependency was added by the implementation.
- **Deterministic/explainable scoring:** **PASS.** Token set, fixed weight, cap, and threshold are visible in `src/classifier.ts`.
- **Policy preservation:** **PASS by diff inspection for `src/policies/default.json`; PARTIAL by verification evidence** because unsafe HTTP mapping is not asserted.
- **Changes limited to required implementation/config/tests:** **FAIL against the literal constraint/acceptance criterion.** The PR contains a broad documentation/workshop-materials batch in addition to the feature: 29 changed paths and 1,462 additions versus `main`, including Tier 1/Tier 2/Tier 3 handoffs/prompts/runbooks, a new task specification, report placeholders, and Tier 4 renames. The PR body describes only the gateway hardening and omits this scope. This is not a runtime defect, but it violates the stated “changes should be limited” and “no undocumented scope changes” requirements unless the repository owner explicitly re-scopes the task.
- **Verification requirements:** **FAIL/PARTIAL.** CI proves typecheck and tests; the PR body also claims build and diff-check, and these were reproduced after `npm ci`. But the required evidence list is not fully covered by tests, especially valid configuration, all malformed requests, limiter failure diagnostics, unsafe policy mapping, and robust client-IP/proxy semantics.
- **Acceptance readiness:** **NOT MET.** CR-1 is an actionable security/availability defect; CR-2 and CR-3 remain open; broad undocumented scope violates the literal acceptance constraints.

## CI and local validation evidence

- Live GitHub checks for head `7e63cbf3a279054ce2ed8142895a0a745247764c`: two `build` jobs passed.
- Local command sequence after a clean `npm ci`:
  - `npm run typecheck` — passed.
  - `npm run build` — passed.
  - `npm test` — passed: 3 files, 8 tests.
  - `git diff --check` — passed (no output).
- An initial local typecheck before `npm ci` failed because the pre-existing `node_modules` lacked Express declarations; installing from the committed lockfile resolved that environment issue. It is not treated as a PR defect.
- Tests passing are treated as evidence only; they do not close the missing verification and proxy/memory findings above.

## Finding dispositions and required actions

| ID | Axis | Severity | Disposition | Required action |
|---|---|---:|---|---|
| CR-1 | Code + spec | High | OPEN | Establish a trusted proxy/client-IP contract, prevent spoofing, and add proxy identity tests. |
| CR-2 | Code | Medium | OPEN | Bound/evict high-cardinality limiter state and test the availability behavior. |
| CR-3 | Code + spec | Medium | OPEN | Add tests covering the complete stated verification matrix and failure paths. |
| CR-4 | Code | Low | Follow-up recommended | Add policy compatibility/configuration validation evidence. |
| SCOPE-1 | Specification | Medium | OPEN | Split/re-scope unrelated workshop documentation or explicitly document and approve the scope. |

## Overall status

**COMPLETE** — the requested independent review is complete and the report is evidence-backed.

**Final disposition: NOT_READY.** This is not a readiness approval: the live PR is mergeable and CI is green, but CR-1 is a substantive rate-limit bypass, state growth remains unbounded, required verification is incomplete, and the PR includes undocumented out-of-scope changes.

## Handoff Prompt to Orchestrator

Review PR #1 at head `7e63cbf3a279054ce2ed8142895a0a745247764c` using this report as the independent code/spec review. Do not treat green CI as sufficient. Before any readiness decision, require resolution or explicit disposition of CR-1 (trusted proxy/client-IP semantics), CR-2 (bounded in-memory state), CR-3 (missing verification evidence), and SCOPE-1 (unrelated undocumented files); then refresh the live head SHA, checks, and review state.
