---
title: "Prompt 020: restore CONTRIBUTING.md, SECURITY.md, CODE_OF_CONDUCT.md from the archived private source"
doc_type: prompt
description: "Closes the root-file scope gap 019 named and deliberately left out of its own mechanical batch: doc-scope.js declares CONTRIBUTING.md/SECURITY.md/CODE_OF_CONDUCT.md but none exist at this repository's root. Confirmed via the archived private source repo that all three existed with real content and were never deliberately excluded from the mirror sync - this is a migration gap, not a policy-authorship task. Restores all three, adapting every reference that has gone stale since the 2026-07-31 freeze (branch renamed hom->staging, an entire mirror-sync section that no longer applies, a governance-script count already known to drift, missing frontmatter)."
status: archived
version: "1.0"
created: 2026-08-06
updated: 2026-08-06
language: en
id: 020-restore-root-governance-files
tags: [prompt, governance, root-files, contributing, security, code-of-conduct]
owner: Alexandre Clemente
related: [019-fix-wrong-directory-citations, documentation-metadata-standard]
---

# Prompt 020: restore `CONTRIBUTING.md`, `SECURITY.md`, `CODE_OF_CONDUCT.md` from the archived private source

## ROLE

Act as the maintainer closing the root-file scope gap `019` named and deliberately left out of its own mechanical batch — where the discipline is verifying the files actually existed with real content before treating this as "recreate from scratch," and adapting every stale reference (branch names, script inventory, an ADR path, an entire section describing a workflow that no longer exists) rather than copying the archived version verbatim.

## CONTEXT

`.github/scripts/doc-scope.js` declares `CONTRIBUTING.md`, `SECURITY.md`, and `CODE_OF_CONDUCT.md` in `ROOT_FILES`/`SCOPE_FILES`, and multiple living documents (`CHANGELOG.md`, `docs/reports/PROPOSAL-TRACKING.md`, `docs/manuals/documentation-metadata-standard.md`) already describe specific content in these files as delivered — an OWASP LLM Top 10 mapping and a deploy-approval clause in `SECURITY.md`; the Change-as-prompt rule, prompt lifecycle, and case-naming convention in `CONTRIBUTING.md`. None of the three files exist at this repository's root today.

The archived private source repository (`~/workspace/ai-assisted-sdd-template`, frozen at commit `b9728f4`, 2026-07-31 — the day before `licorsy/ai-assisted-sdd-template` became the sole official repo per `docs/adr/0005-public-release.md`) still has all three files. `sync-to-public-mirror.sh` only ever excluded `docs/prompts/` and one specific report; these three were not deliberately excluded. Their absence here is a migration gap, not a decision — this prompt is restoration and adaptation, not authoring new policy from nothing.

Direct comparison against this repository's current state found the archived copies are stale in specific, checkable ways:

- `CONTRIBUTING.md`'s "Syncing to the public mirror" section describes a private-repo -> mirror workflow (`sync-to-public-mirror.sh`, and the ADR that predated the renumbering to `docs/adr/0005-public-release.md`) that no longer applies — this repository has no mirror, it is the source.
- `CONTRIBUTING.md`'s commit-message line says checks re-run "on hom/main PRs"; this repository renamed `hom` to `staging` (confirmed live in `.github/workflows/pr-checks.yml`).
- `CONTRIBUTING.md`'s documentation-metadata scope line claims "QUICKSTART.md is the only" in-scope root file; `docs/manuals/documentation-metadata-standard.md` v1.25 already moved `CLAUDE.md`/`AGENTS.md`/`CONTRIBUTING.md`/`SECURITY.md`/`CODE_OF_CONDUCT.md` into scope via `doc-scope.js`'s `SCOPE_FILES` — including this file itself.
- `SECURITY.md` names "five repo-local checkers"; this repository currently has six (`check-adapter-rules.js`, `check-adapter-sync.js`, `check-public-sanitization.js`, `check-release-integrity.js`, `check-scope-consistency.js`, `check-step-references.js`), a count that has already drifted stale inside this repository's own recorded history at least three times (`prompt-092`, `prompt-093`, `prompt-096`, archived private-repo sequence, not a citable path in this repository, per `CHANGELOG.md`).
- Neither `CONTRIBUTING.md` nor `SECURITY.md` carries YAML frontmatter in the archived copy; the current `docs/manuals/documentation-metadata-standard.md` requires it on both.
- `CODE_OF_CONDUCT.md` is unadapted Contributor Covenant v2.1 boilerplate, referencing only `SECURITY.md`'s reporting channel by relative link — nothing in it is repository-specific or stale; it needs frontmatter only.

Also discovered, out of scope for this prompt: `.github/` currently has no PULL_REQUEST_TEMPLATE.md and no ISSUE_TEMPLATE/, though `docs/reports/PROPOSAL-TRACKING.md` records both as shipped (`R008-5.2`, referencing prompts `075`/`080`, archived private-repo sequence, not a citable path in this repository). Same migration-gap shape as this prompt's own subject; deliberately not folded in here — it needs its own measurement, not an assumption riding on this prompt's finding.

## TASK

1. Restore `CONTRIBUTING.md` at repository root, adapted from the archived copy:
   - Add YAML frontmatter per `docs/manuals/documentation-metadata-standard.md`'s schema.
   - Remove the "Syncing to the public mirror" section outright — no longer applicable now that this repository is the sole source of truth (`docs/adr/0005-public-release.md`).
   - Fix `hom` -> `staging` in the commit-message line.
   - Replace the hand-maintained "QUICKSTART.md is the only" scope claim with a pointer to `doc-scope.js`'s `SCOPE_FILES`, avoiding a repeat of the enumeration-drift class this repository's `CHANGELOG.md` already records recurring four separate times.
   - Keep the Change-as-prompt rule, prompt lifecycle, and file-naming/commit-message conventions — verified still accurate against current `docs/manuals/operation-manual.md` and `.pre-commit-config.yaml`.
2. Restore `SECURITY.md` at repository root, adapted from the archived copy:
   - Add YAML frontmatter.
   - Replace the stale "five repo-local checkers" enumeration with a pointer to `docs/manuals/operation-manual.md` Step 15's governance-script table (the canonical, already-existing enumeration) instead of a second hand-counted list — the same anti-drift reasoning as TASK 1's scope-line fix, applied to the exact sentence that has already gone stale three times in this repository's own recorded history.
   - Keep the LLM/AI-specific risks section (OWASP Top 10 for LLM Applications mapping, the five named risk categories), verified still accurate against this repository's current agents/scripts.
3. Restore `CODE_OF_CONDUCT.md` at repository root: add YAML frontmatter only, content unchanged (generic Contributor Covenant v2.1, already only cross-references `SECURITY.md`).
4. Regenerate `docs/STATE.md` (`node .github/scripts/generate-state.js`) so the three new frontmatter'd files appear in the consolidated snapshot.
5. Update `docs/prompts/PROMPT-INDEX.md` with this prompt's row.
6. Add a `CHANGELOG.md` `[Unreleased]` entry recording the restoration and why it is a migration gap, not new policy authorship.
7. Run `docgov check` (and this repository's other pre-PR governance checks) to confirm the three new files pass frontmatter/link validation and introduce no new `dead_citations` findings.

## REQUIREMENTS, CONSTRAINTS AND RULES

- [CRITICAL] Do not copy the archived files verbatim. Every stale reference identified in CONTEXT must be fixed, not carried forward.
- [CRITICAL] Do not invent new policy content beyond what the archived copies already establish plus the mechanical fixes listed in TASK — this is restoration, not a fresh policy-design exercise.
- Do not act on the PULL_REQUEST_TEMPLATE.md/ISSUE_TEMPLATE/ gap discovered during CONTEXT research; it is out of scope here.
- Frontmatter on all three files must validate against `docs/manuals/documentation-metadata-standard.md` and pass `docgov check`.
- Preserve `CODE_OF_CONDUCT.md`'s content verbatim below the frontmatter — it is standard, unmodified Contributor Covenant text and should stay recognizable as such.

## FORMAT AND OUTPUT

Three new root files, one regenerated `docs/STATE.md`, one updated `docs/prompts/PROMPT-INDEX.md` row, one `CHANGELOG.md` entry. This prompt's own `status` flips `draft` -> `active` on explicit human approval to execute, then -> `archived` once merged and verified, per `CONTRIBUTING.md`'s own (restored) prompt lifecycle.
