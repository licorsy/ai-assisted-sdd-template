---
title: "Prompt 024: move Spec Kit feature artifacts from .specify/ to specs/NNN-feature/, where Spec Kit writes them"
doc_type: prompt
description: "Closes issue #66: the roadmap, the metadata standard, the glossary, the adversarial reviewer and the visual overview placed Spec Kit's per-feature spec, plan and tasks under `.specify/specs/`, `.specify/plans/` and `.specify/tasks/`, while Spec Kit 1.3.x writes them to `specs/NNN-<feature>/` and keeps only memory, templates and scripts under `.specify/`."
status: archived
version: "1.0"
created: 2026-11-12
updated: 2026-11-12
language: en
id: 024-fix-spec-kit-feature-paths
tags: [prompt, spec-kit, roadmap, paths]
owner: Alexandre Clemente
related: [roadmap, documentation-metadata-standard, operation-manual]
---

# Prompt 024: move Spec Kit feature artifacts to specs/NNN-feature/

## ROLE

Act as the maintainer aligning the template's documented artifact paths with what the tool actually writes, checking the tool's own output before trusting either the issue or the roadmap.

## CONTEXT

A project generated from this template found during a docs-governance audit that its `governance.md` said `.specify/` while Spec Kit wrote to `specs/` (issue #66). Checked on 2026-11-12 against that project's Spec Kit 1.3.1 install: `speckit-specify` writes under `specs/` unless `SPECIFY_FEATURE_DIRECTORY` is set; `speckit-clarify` records answers in a `## Clarifications` section of the spec itself, so `.specify/memory/clarifications.md` never exists; `specify init` writes `.specify/init-options.json` and `.specify/integration.json`, not `.specify/config.json`. Prompt 023 deferred this issue because it has to decide how the roadmap's two-pass plan maps onto Spec Kit's single `plan.md`.

## TASK

1. `docs/strategy/roadmap.md`: Phase 3 Activities 11-12, Generated artifacts and Artifacts instructions; Phase 4 Generated artifacts and Artifacts instructions; Phase 7 Activity 6; Section 10's folder tree. The two-pass plan maps onto one file: Phase 3 writes the first pass of `specs/[NNN-feature-name]/plan.md`, Phase 4 refines the same file, and git history keeps both. Add one instruction separating the product-level `docs/` from the per-feature `specs/`.
2. The same stale paths in `docs/manuals/documentation-metadata-standard.md` Section 7, `docs/manuals/glossary.md`, `agents/adversarial.md`, `docs/visuals/template-visual-overview.md` Section 5, `docs/references/gate-verification-template/README.md` and the `dead_citations` allowlist in `.docgov.config.js`.

## REQUIREMENTS, CONSTRAINTS AND RULES

- [CRITICAL] Placeholders use `specs/[NNN-feature-name]/` with brackets, so `verify-gate.js` treats them as dynamic names and never existence-checks a literal `NNN` path.
- [HIGH] Historical prompt records (`006`, `008`) keep the path of their time; only living documents change.
- [HIGH] Every edited document with a body changelog bumps `version` and gains an entry, keeping the 3-entry retention.
- [CRITICAL] Regenerate `docs/STATE.md` with the Linux `node` from `nvm` (prompt 021).

## FORMAT AND OUTPUT

Direct file edits, a `CHANGELOG.md` `[Unreleased]` entry, this prompt record and its `docs/prompts/PROMPT-INDEX.md` row, and a regenerated `docs/STATE.md`.

## Completed

**2026-11-12.** Issue #66 closed by the edits above; verification recorded in the pull request.
