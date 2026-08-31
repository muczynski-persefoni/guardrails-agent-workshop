# Tier 3 Iteration 2 Final Exact-Head Re-review

**Status: COMPLETE** — final exact-head review completed from live GitHub metadata, the repaired/rebased source, prior independent findings, targeted probes, and fresh local validation. No PR state, approval, merge, comment, or branch action was performed during review.

- PR: #2 — https://example.invalid/private-rehearsal-pr-2
- Branch: `demo/tier3-iteration-2`
- Base `main`: `0a0edefa73ef61098269367382966d20460cef98`
- Exact head: `ad790e6a670ac4cbff4ca0c143987227b4c1fb6c`
- State: open, non-draft, unmerged
- GitHub: `MERGEABLE`, merge state `CLEAN`
- Compare: ahead 2, behind 0; six implementation/test files only

## Review axes

**Peer/code:** The prior proxy-trust bypass is addressed by defaulting to zero trusted proxy hops and requiring a bounded explicit hop count. Active limiter buckets are not evicted; unseen identities are conservatively rejected at capacity, preserving active windows and bounding state. Fractional configuration values fall back to documented defaults. Limiter failures fail open with diagnostics; malformed requests are checked before metering; `/health` bypasses metering.

**Specification:** Confidence values and strict `needsReview` boundaries, safe/unsafe labels and policy mapping, additive response compatibility, deterministic local classification, defaults and invalid-value handling, per-IP rate limiting, 429/Retry-After behavior, health exemption/ISO timestamp, malformed input ordering, no external service, and verification coverage remain satisfied. No task-spec or unrelated files are in the final diff.

## Evidence

- Local `npm test`: passed, 12 tests.
- Local `npm run typecheck`: passed.
- Local `npm run build`: passed.
- Local `git diff --check`: passed.
- Live GitHub build checks for `ad790e6`: completed successfully.
- Prior C1 active-window eviction regression: fixed and probed; active A remains denied and unseen C is conservatively denied at capacity.
- Prior C2 fractional configuration regression: fixed and probed; `1.9` values return `{maxRequests:100, windowMs:60000}`.

## Residual risk

The limiter is process-local and not distributed. Operators must size `maxBuckets` for expected concurrent client cardinality and explicitly configure trusted proxy hops only when the deployment topology guarantees them. Capacity rejection may temporarily reject new clients during a high-cardinality burst; this is documented and visible to the human decision-maker.

## Recommendation

**READY_FOR_HUMAN_REVIEW**. The evidence is sufficient for a human merge-readiness decision. This is not an approval; agents do not approve or merge.

## Handoff Prompt to Orchestrator

Refresh PR #2 at exact head `ad790e6a670ac4cbff4ca0c143987227b4c1fb6c`, confirm checks/comments/reviews/mergeability/freshness, and present the explicit capacity and trusted-proxy tradeoffs. Await the human’s merge decision.
