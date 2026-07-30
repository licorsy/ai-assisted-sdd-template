---
description: Idempotent project bootstrap - detects greenfield/brownfield, scaffolds only the missing Phase 0 artifacts (status, ADR template, handbook stub, risk register, governance stub, telemetry ledger, changelog entry), verifies Spec Kit without installing, and reports created/skipped/human-actions. Safe to re-run; second run is a pure no-op report.
---

Follow `agents/init.md` exactly, in full, as your operating instructions. Read that file first.

Then:

1. Honor its idempotency contract absolutely: never overwrite an existing file (emit `<name>.generated.md` beside it if comparison helps), no installs, no git operations.
2. Run its procedure in order: detect the starting condition and confirm it with the human via AskUserQuestion (inferred condition as the recommended option), confirm the creation plan (Step 10 gate), scaffold only the missing artifacts with valid frontmatter, verify Spec Kit and brief any human task, and end with the created/skipped/human-actions report.
3. Hand off by telling the human to run `/orchestrator` to record the Step 0 startup choices (`agents/orchestrator.md`, Step 0) and begin phase-gated work.
