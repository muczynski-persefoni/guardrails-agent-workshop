# Task: Fix CI Failure — classifier.ts type error

## Problem
CI is failing on the `demo/ci-failure` branch. The type checker reports that `classify()` returns `string` on one code path but the return type is `ClassificationResult`.

## Scope
Fix the type error so CI passes. Do not refactor, do not add features, do not fix unrelated issues.

## Your rules (from SOUL.md)
- Autonomous: Fix type errors in files you own
- Escalate: Anything touching classification logic beyond the type fix
- Escalate: Security issues found during the fix
- Forbidden: Modifying CI workflows, merging your own PR
