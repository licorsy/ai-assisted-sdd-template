---
title: "Prompt 023: fix two bootstrap defects found generating a project — the removed Spec Kit --ai flag and docs/business outside docgov scope"
doc_type: prompt
description: "Closes issues #57 and #67, both found while bootstrapping a project generated from this template: the Spec Kit commands the template hands out still use `--ai`, which current Spec Kit rejects (`--integration` replaced it), and `docs/business/` is missing from doc-scope.js's CATEGORY_DIRS, so docs-governance never validates the `market.md` Phase 1 generates even though the metadata standard covers it."
status: archived
version: "1.0"
created: 2026-11-11
updated: 2026-11-11
language: en
id: 023-fix-bootstrap-specify-flag-and-business-scope
tags: [prompt, bootstrap, spec-kit, docs-governance, scope]
owner: Alexandre Clemente
related: [operation-manual, documentation-metadata-standard]
---

# Prompt 023: fix two bootstrap defects found generating a project

## ROLE

Act as the maintainer closing two small, related bootstrap defects that a generated project hit on its first run — where the discipline is fixing every site that hands out the stale command, not only the one the issue names, and adding the missing scope directory to the single canonical list rather than to any consumer.

## CONTEXT

A project bootstrapped from this template on 2026-11-04/05 hit two defects before any real work began. Both block the next project generated from the template (the PTT repository, due in its F1), and both are individually minor, so they share this prompt (Step 12, rule 9). Issue #66 (Spec Kit paths under `.specify/`) is related but structural — it has to decide how the roadmap's two-pass plan maps onto Spec Kit's single `plan.md` — so it gets its own prompt.

## TASK

1. **Issue #57:** replace the removed `--ai` flag with `--integration <agent> --script sh` everywhere the template hands out a `specify init` command: `docs/manuals/operation-manual.md` Step 2 (3 commands, plus one sentence recording the rename), `agents/init.md` step 4's human task, and `docs/strategy/roadmap.md` Phase 3 Activity 9's recovery command.
2. **Issue #67:** add `docs/business` to `CATEGORY_DIRS` in `.github/scripts/doc-scope.js`, with a comment saying why a directory the template itself does not have is listed. Every consumer (`.docgov.config.js`, `generate-state.js`, `check-step-references.js`) derives its scope from that constant, and `doc-walk.js` skips a missing directory, so no other list changes.

## REQUIREMENTS, CONSTRAINTS AND RULES

- [CRITICAL] Use the Linux `node` from `nvm` when regenerating `docs/STATE.md`, never the bare `node` on `PATH` (WSL interop, see prompt 021).
- [HIGH] Every edited versioned document bumps `version` and gains a changelog entry, keeping the 3-entry retention.
- [HIGH] Use only the command the issue verified against `specify init --help` on 2026-11-04; do not add flags that were not verified.
- Run `node --test .github/scripts/*.test.js` and the local governance checkers after the edits.

## FORMAT AND OUTPUT

Direct file edits, a `CHANGELOG.md` `[Unreleased]` entry, this prompt record and its `docs/prompts/PROMPT-INDEX.md` row, and a regenerated `docs/STATE.md`.

## Completed

**2026-11-11.** Both issues closed by the edits above; verification recorded in the pull request.
