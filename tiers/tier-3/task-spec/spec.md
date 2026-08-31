# Guardrail API Policy Gateway Hardening Specification

## Background

The guardrail API classifies incoming text as safe or unsafe and applies a policy action before passing the request downstream. The current API exposes only the classification label and policy action. It also lacks request-volume protection and a health endpoint.

This change adds explainable confidence information, protects classification traffic with an in-memory rate limiter, and provides a health signal while preserving the existing API behavior for current consumers.

## Objective

Harden the guardrail API so that it:

- Communicates classification confidence and review requirements.
- Limits abusive request volume on the classification endpoint.
- Exposes a health endpoint for operational checks.
- Remains deterministic and testable without external services.
- Preserves existing clear-cut classification and policy behavior.

## Functional Requirements

### FR-1: Confidence-aware classification

Extend the classification result and `/classify` response additively:

```json
{
  "label": "safe" | "unsafe",
  "policyAction": "allow" | "block",
  "confidence": 0.0,
  "needsReview": false
}
```

The following requirements apply:

- `confidence` MUST be a number from `0` through `1`, inclusive.
- `label` MUST remain present and retain its existing meaning.
- `policyAction` MUST remain present and retain its existing meaning.
- Clear unsafe matches MUST return `label: "unsafe"`, `policyAction: "block"`, and confidence greater than or equal to `0.9`.
- Clear safe inputs MUST return `label: "safe"`, `policyAction: "allow"`, and confidence greater than or equal to `0.9`.
- `needsReview` MUST be `true` when confidence is strictly greater than `0.4` and strictly less than `0.7`.
- Confidence values exactly equal to `0.4` or `0.7` MUST NOT require review.
- The scoring model MUST be deterministic and explainable in code.
- Classification MUST NOT call an external model or API.
- Existing clear-cut classifier inputs MUST continue to produce their existing labels.

### FR-2: In-memory rate limiting

The service MUST apply configurable per-client-IP rate limiting to `POST /classify` only.

- The default limit MUST be `100` requests per `60,000` milliseconds per client IP.
- The client identity MUST be the request IP address exposed by the runtime (`req.ip`).
- The application MUST default to not trusting forwarded proxy headers. An app-factory
  option may explicitly configure a bounded integer trusted-proxy hop count from `0`
  through `10`; invalid or out-of-range values MUST use `0`.
- The maximum request count MUST be configurable with `RATE_LIMIT_MAX_REQUESTS`.
- The time window MUST be configurable with `RATE_LIMIT_WINDOW_MS`.
- Missing, invalid, zero, negative, fractional, or non-finite configuration values MUST use the documented defaults.
- Requests beyond the configured limit MUST return HTTP `429`.
- A rate-limited response MUST contain a JSON error code of `rate_limit_exceeded`.
- A rate-limited response MUST contain a positive `Retry-After` header expressed in seconds.
- Different client IP addresses MUST maintain independent counters.
- `GET /health` MUST NOT be rate limited.
- Malformed `/classify` requests SHOULD be validated before consuming rate-limit capacity.
- The limiter MUST NOT require Redis, a database, or another external service.
- An unexpected limiter failure MUST fail open for availability and MUST produce observable diagnostic information. The failure MUST NOT be silently discarded.

### FR-3: Health endpoint

The service MUST provide:

```text
GET /health
```

A healthy service MUST return HTTP `200` with a JSON body matching:

```json
{
  "status": "ok",
  "timestamp": "<ISO-8601 timestamp>"
}
```

The timestamp MUST be generated for the response and MUST be a valid ISO-8601 timestamp.

### FR-4: Request validation and compatibility

- A `/classify` request without a string `text` field MUST continue to return HTTP `400`.
- The existing validation error behavior MUST remain compatible with current consumers.
- Existing response fields MUST NOT be removed or renamed.
- The policy mapping for existing labels MUST NOT change.
- New response fields MUST be additive and MUST NOT require existing consumers to send new request fields.

## API Contract

### `POST /classify`

Request body:

```json
{
  "text": "string"
}
```

Successful response: HTTP `200` with `label`, `policyAction`, `confidence`, and `needsReview`.

Invalid request: HTTP `400` using the existing validation behavior.

Rate-limited request: HTTP `429` with `error: "rate_limit_exceeded"` and a positive `Retry-After` header.

### `GET /health`

Successful response: HTTP `200` with `status: "ok"` and an ISO-8601 `timestamp`.

## Configuration

| Variable | Default | Description |
|---|---:|---|
| `RATE_LIMIT_MAX_REQUESTS` | `100` | Maximum accepted `/classify` requests per client IP during one window |
| `RATE_LIMIT_WINDOW_MS` | `60000` | Rate-limit window duration in milliseconds |

Invalid, missing, zero, negative, fractional, and non-finite values use the corresponding defaults.

## Constraints

- Use the repository's existing runtime and package dependencies.
- Do not add an external model or API integration.
- Do not add Redis, a database, or another external service.
- Keep the scoring implementation deterministic and explainable.
- Preserve the existing policy configuration and label semantics.
- Changes should be limited to the implementation, configuration, and tests required by this specification.

## Non-Goals

The following are out of scope:

- Authentication or authorization redesign
- Distributed rate-limit coordination
- Persistent rate-limit state
- Changes to unrelated policy rules
- Removal or renaming of existing API response fields
- Changes to CI workflows or secret handling

## Verification Requirements

The implementation MUST include evidence for:

- Confidence scoring and the `0.4` and `0.7` threshold boundaries
- Clear safe and unsafe classification behavior
- Default, configured, and invalid rate-limit values, including fractional and non-finite values
- Per-IP rate-limit isolation
- HTTP `429` behavior and `Retry-After`
- Malformed request handling
- The `/health` rate-limit exemption
- Health response status and timestamp validity
- Existing response fields and clear-cut labels
- Typecheck, build, and the complete test suite

## Acceptance Criteria

The change is acceptable when:

1. All functional requirements and API contract requirements are implemented.
2. Existing clear-cut classification labels and policy actions remain unchanged.
3. Required tests pass, including boundary and failure-path tests.
4. Typecheck and build complete successfully.
5. No external service or unapproved dependency is introduced.
6. The final implementation contains no undocumented scope changes.
7. Any unresolved behavior, risk, or failed verification is explicitly documented for disposition.
