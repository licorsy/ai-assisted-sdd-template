---
title: "Prompt 025: audit tooling currency, generated artifacts and Done criteria, and remove a third-party framework's references"
doc_type: prompt
description: "Records the 2026-11-12 audit of this template's tools (Spec Kit, GitHub Actions, pre-commit hooks, plugins, the tool catalog), of the artifacts each roadmap phase generates and of each phase's acceptance criteria / Done, as report 009 plus a checklist section in PROPOSAL-TRACKING.md, and the removal, at the owner's request, of every living reference to a third-party repository-infrastructure framework, keeping its idea as this repository's own proposal."
status: archived
version: "1.0"
created: 2026-11-12
updated: 2026-11-12
language: en
id: 025-tooling-artifact-done-audit
tags: [prompt, audit, spec-kit, github-actions, artifacts, definition-of-done]
owner: Alexandre Clemente
related: [report-proposal-tracking, tool-library-catalog, roadmap]
---

# Prompt 025: audit tooling currency, generated artifacts and Done criteria

## ROLE

Act as the maintainer auditing whether this template is current, lean and checkable, measuring each claim against the tool's own release or documentation rather than memory, and recording findings where they will be tracked to completion.

## CONTEXT

The owner asked on 2026-11-12 for a check that the template's skills, tools and artifacts are current and consistent (Spec Kit at its current stable version, among others), for a review of the generated artifacts and of the acceptance criteria / Done against current market practice, for a place that keeps the result as history and as a checklist, and for no reference to a third-party framework the tool catalog had vetted, keeping only its idea implemented here.

## TASK

1. Check every pinned or floating tool version against the tool's latest release via the GitHub API, and Spec Kit's install, invocation and flow against its `v1.4.0` documentation.
2. Review each roadmap phase's Generated artifacts and Acceptance criteria / Done, using a project generated from this template as evidence of what a generated project inherits.
3. Write the findings as `docs/reports/009-tooling-artifact-and-done-audit.md` (evidence, one R009 id per finding) and log one row per finding in `docs/reports/PROPOSAL-TRACKING.md` (the checklist), adding an `in-progress` status value for rows with an open pull request.
4. Remove the third-party framework's entry from `docs/manuals/tool-library-catalog.md`, and its mentions in `docs/references/token-economy.md`, `docs/references/infra-templates/README.md` and two historical `CHANGELOG.md` entries; record its idea as R009-A14 and the removal as R009-A15.

## REQUIREMENTS, CONSTRAINTS AND RULES

- [CRITICAL] No finding is applied here beyond the removal in Task 4: each lands in its own pull request and moves its row's status.
- [HIGH] Every version claim carries the date it was checked; versions move fast (Spec Kit shipped six releases in nine days).
- [HIGH] Rewording historical `CHANGELOG.md` entries is limited to the owner's removal request; git history keeps the original text.
- [CRITICAL] Regenerate `docs/STATE.md` with the Linux `node` from `nvm` (prompt 021).

## FORMAT AND OUTPUT

Report 009, the PROPOSAL-TRACKING section, the edits of Task 4, a `CHANGELOG.md` `[Unreleased]` entry, this prompt record and its `docs/prompts/PROMPT-INDEX.md` row, and a regenerated `docs/STATE.md`.

## Completed

**2026-11-12.** Report and checklist written, removal applied; verification recorded in the pull request.
