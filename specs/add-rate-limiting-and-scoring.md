# Feature: Add Rate Limiting and Confidence Scoring

## Requirements

1. Add per-IP rate limiting to the `/classify` endpoint (max 100 requests/min)
2. Replace the keyword classifier with a scoring model that returns a confidence score (0.0–1.0)
3. Add a new field `confidence` to the response
4. If confidence is between 0.4 and 0.7, flag the request for human review instead of auto-deciding
5. Add a `/health` endpoint
6. Store rate-limit counters in Redis
7. Add integration tests for the rate limiting behavior

## Constraints

- Must be backward-compatible with existing `/classify` consumers
- No breaking changes to the response schema (add fields, don't remove/rename)
- Rate limit config should be environment-variable driven
