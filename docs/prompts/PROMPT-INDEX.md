---
title: "Prompt Index"
doc_type: status-artifact
description: "The id/status/one-line-purpose index over every prompt in docs/prompts/, updated whenever a prompt is created or moves lifecycle stage (operation-manual.md Step 11). The prompt file itself is the source of truth for content; this index exists so a reader can scan the whole archive without opening every file."
status: active
version: "1.6"
created: 2026-07-31
updated: 2026-08-03
language: en
id: prompt-index
tags: [status-artifact, docs-prompts, index]
owner: Alexandre Clemente
related: [operation-manual, documentation-metadata-standard]
---

# Prompt Index

One row per file in `docs/prompts/` (excluding `basic-prompt-template.md`, the scaffold itself). Update this table in the same edit that changes a prompt's `status` (`operation-manual.md`, Step 11).

| id | status | purpose |
| --- | --- | --- |
| `001-restart-prompt-archive-and-source-of-truth` | archived | Restarts `docs/prompts/` in this repository and amends ADR-0005 (then `0010`) to record this repository as the current source of truth, after the private source repository was archived. |
| `002-renumber-adr-0010-to-0005` | archived | Renumbers `docs/adr/0010-public-release.md` to `docs/adr/0005-public-release.md`, closing the unused `0005`-`0009` gap now that the cross-repository numbering rationale no longer applies. |
| `003-close-restart-followon-drift` | archived | Closes 13 follow-on drift findings a re-review surfaced against prompts 001 and 002's own changes, including creating this index. |
| `004-adopt-dead-citations-shadow-rule` | archived | Enables `docs-governance` v1.2.0's `dead_citations` rule as a non-blocking shadow rule, replacing the per-round LLM sweep for dangling `prompt-NNN` citations with a mechanical check. |
| `005-fix-commit-lint-merge-subjects` | deprecated | Adds `--no-merges` to the Conventional Commits CI step, which otherwise fails by construction on every promotion PR by linting GitHub's own merge subjects, and pins the flag with a blocking `facts` entry. Superseded: the step itself was later removed outright, so items 2-3 became unexecutable — see the prompt's own SUPERSEDED section. |
| `006-absorb-local-notes-011-accepted-items` | active | Named batch absorbing the accepted items of a downstream upstream-sync note: closes prompt 005's leftover `facts` block, fixes two roadmap self-contradictions, and adds five absent conventions. |
| `007-missing-data-vocabulary` | active | Adds `docs/references/missing-data-vocabulary.md` - a shared shorthand for absent or degraded data, adapted from UK Government Analysis Function guidance - and fixes `generate-state.js`, which put `docs/STATE.md`'s own legend below the table. |
| `008-market-standard-vocabulary` | active | Splits the two senses of `increment` (process instance becomes **release cycle**; the delivered capability keeps the Scrum term), declares the phase model as Stage-Gate, and adds `docs/manuals/glossary.md` with the four delivery surfaces. |

Historical note: the pre-2026-07-31 prompt archive (numbered up to `109` at the time the private source repository was archived) is not migrated here and is not indexed by this table — see `docs/adr/0005-public-release.md` and `docs/prompts/001-restart-prompt-archive-and-source-of-truth.md` for why.
