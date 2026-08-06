---
title: "Prompt 004: adopt docs-governance v1.2.0's dead_citations shadow rule"
doc_type: prompt
description: "Enables the dead_citations rule (licorsy/docs-governance v1.2.0, released 2026-08-01) as a non-blocking shadow rule in .docgov.config.js, replacing the per-round LLM full-corpus sweep that produced 3 consecutive doc-consistency-reviewer rounds without converging (11, 13, 13 findings) with a mechanical, ~2s check for the exact defect class that caused it: inline-code citations of the archived private source repository's prompt sequence that internal-links cannot see. Left at shadow (509 pre-existing findings surfaced, not fixed by hand) per docs-governance's own adoption philosophy - promote to blocking only after measuring precision on the real corpus, not on day one."
status: archived
version: "1.2"
created: 2026-08-01
updated: 2026-08-06
language: en
id: 004-adopt-dead-citations-shadow-rule
tags: [prompt, docs-governance, tooling, dead-citations]
owner: Alexandre Clemente
related: [003-close-restart-followon-drift, documentation-metadata-standard]
---

# Prompt 004: adopt docs-governance v1.2.0's dead_citations shadow rule

## ROLE

Act as the maintainer wiring an upstream tooling fix into this repository, after the same defect class it targets caused 3 consecutive doc-consistency-reviewer rounds to fail to converge here.

## CONTEXT

`licorsy/docs-governance` v1.2.0 (released 2026-08-01, PRs #15/#16/#17, tag `v1` moved to it) ships `dead_citations`: a mechanical rule that resolves inline-code citations (`` `prompt-NNN` ``, `` `NNN-slug.md` ``) against real files, filling the gap `internal-links` leaves for anything not real Markdown link syntax. This repository's own three-round doc-consistency-reviewer loop (`docs/prompts/001`-`003`) was dominated by exactly this defect class: citations of the archived private source repository's pre-2026-07-31 prompt sequence (`prompt-013` through `prompt-109`), none of which resolve here by design. `licorsy/platform-workflows`'s reusable `ci-docs.yml` already pins `licorsy/docs-governance/action@v1`, so this repository's CI picks up v1.2.0 automatically - no CI wiring change needed, only `.docgov.config.js`.

## TASK

1. Enable `dead_citations` in `.docgov.config.js` as a **shadow** rule (default, non-blocking): both pattern kinds (`filename`, `prefix-id` for the `prompt-NNN` convention against `docs/prompts/`), scoped to the same `CATEGORY_DIRS`/`SCOPE_FILES` the other rules already use.
2. Configure `exempt.self_qualifying` to recognize the phrase already written into the ~11 sites hand-qualified in `docs/prompts/003-close-restart-followon-drift.md` ("archived private-repo sequence"), so that existing, deliberate qualification is respected rather than re-flagged.
3. Run `docgov check` and confirm the overall exit code is still 0 (shadow findings never fail `check`) - do **not** attempt to fix the surfaced backlog by hand in this prompt; that recreates the exact whack-a-mole loop this rule exists to end.
4. Flip `docs/prompts/001`, `002`, `003` to `status: archived` and update `docs/prompts/PROMPT-INDEX.md` accordingly, since their described changes are complete and about to be merged.

## REQUIREMENTS, CONSTRAINTS AND RULES

- `dead_citations` stays `shadow` (non-blocking) in this prompt. Promoting it to blocking is a separate, future decision, made after measuring false-positive rate on this corpus (the first run surfaced real false positives: bare filenames cited without directory context, and hypothetical filenames from rejected `docs/reports/PROPOSAL-TRACKING.md` proposals that were correctly never built) - per `docs-governance`'s own stated rule, "promote a shadow rule to blocking only after measuring precision on a real corpus."
- Do not hand-fix the 509 pre-existing shadow findings this run surfaced. The point of this prompt is that the defect class is now mechanically visible at near-zero cost going forward, not that the historical backlog is zero today.
- `fragment_sync` and `numbered_reference_consistency` (also shipped in v1.2.0) are not adopted in this prompt - `check-adapter-sync.js` and `check-step-references.js` already cover this repository's nearest equivalents; revisit only if a concrete gap surfaces.

## FORMAT AND OUTPUT

Executed as an edit to `.docgov.config.js`, plus status flips on `docs/prompts/001-003.md` and `docs/prompts/PROMPT-INDEX.md`, on the existing branch `docs/restart-prompt-archive-source-of-truth`. Verification: `node docs-governance/bin/docgov.js check --config .docgov.config.js --base-sha <develop>` exits 0; `[shadow] N dead citation(s) found` appears in output without failing the run.
