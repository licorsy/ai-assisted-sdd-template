---
title: "CONTRIBUTING.md"
doc_type: instruction
description: "Contribution process for this template repository itself: the Change-as-prompt rule, the prompt lifecycle, file-naming and commit-message conventions, and the local validation gate. Governs changes to this repository's own docs, governance, prompts, and tooling — not a project generated from it."
status: active
version: "1.0"
created: 2026-08-06
updated: 2026-08-06
language: en
id: contributing
owner: Alexandre Clemente
tags: [instructions, governance, contribution-process, change-as-prompt]
related: [operation-manual, documentation-metadata-standard, prompt-index]
---

# Contributing

This repository is the template *itself* — its own operating model, governance, and prompts — not a project generated from it. Changes here follow a stricter process than a typical downstream project would, because this template's process documents are what every generated project inherits.

## Proposing a change

Every non-trivial change to this template (its own docs, governance, prompts, or tooling) is captured as a `docs/prompts/NNN-<slug>.md` file **before** implementation begins — the Change-as-prompt rule, defined in full in `docs/manuals/operation-manual.md`, Step 12. Use `docs/prompts/basic-prompt-template.md` as the starting scaffold. A small, related batch of individually-minor fixes can share one prompt document (Step 12 rule 9); structural changes get their own.

Trivial changes (typo fixes, obviously reversible one-liners) can skip this — see Step 12a's tiering criteria in the operation manual if it's unclear which bucket a change falls into.

Proposals from an external improvement report dropped into `docs/reports/` get logged into that folder's `docs/reports/PROPOSAL-TRACKING.md` at intake — one row per distinct proposal, status `not-triaged` until a decision is made. Batch-evaluation sessions update that file's `Status`/`Decision` columns directly; they don't produce a new summary document each time.

## Prompt lifecycle

Each prompt file's frontmatter `status` field tracks its own lifecycle:

1. `draft` — written, not yet approved for execution.
2. `active` — approved and being implemented on the current branch.
3. `archived` — merged and verified; the file stays in place as historical record (see `docs/manuals/documentation-metadata-standard.md` — there is no folder-per-status move, and no precedent for deleting a prompt file once archived).
4. `deprecated` — drafted but declined or superseded before execution; the decline reason is recorded in the prompt's own body, not only in `docs/prompts/PROMPT-INDEX.md` (`docs/manuals/operation-manual.md`, Step 11, trigger 4).

`docs/prompts/PROMPT-INDEX.md` is the id/status/one-line-purpose index across every prompt except the blank scaffold; update it alongside any status change.

## Conventions

- **File naming**: root-level entry-point files use UPPER-CASE (`README.md`, `QUICKSTART.md`, `CLAUDE.md`, `AGENTS.md`, `CONTRIBUTING.md`, `SECURITY.md`, `CODE_OF_CONDUCT.md`, `CHANGELOG.md`, `LICENSE`); root-level tool configuration keeps whatever filename its tool requires (`.pre-commit-config.yaml`, `.docgov.config.js`, `.gitignore`). Everything under `docs/` and `agents/`, plus `.github/workflows/` and `.github/scripts/`, uses lowercase-hyphenated names (`docs/manuals/operation-manual.md`, `docs/prompts/020-restore-root-governance-files.md`). GitHub-mandated files in `.github/` keep the exact names GitHub requires (`CODEOWNERS` and its issue/PR-template counterparts, when adopted).
- **Documentation metadata**: every Markdown file in the living-document directories, plus the root files GitHub or another system doesn't already own the frontmatter contract for, carries the YAML frontmatter schema defined in `docs/manuals/documentation-metadata-standard.md`. `.github/scripts/doc-scope.js`'s `CATEGORY_DIRS`/`SCOPE_FILES` are the canonical, single-sourced enumeration of what's in scope — this file intentionally does not restate that list, to avoid it going stale independently.
- **Local validation gate**: this repository uses `pre-commit` as its primary gate. After cloning, run `pre-commit install` and `pre-commit install --hook-type commit-msg` once. The configured hooks are file hygiene (trailing whitespace, EOF, YAML/JSON syntax, merge markers) and Conventional Commits on the commit subject (`.pre-commit-config.yaml`).
- **Commit messages**: Conventional Commits (`feat`, `fix`, `docs`, `refactor`, `chore`, `test`, `perf`, `build`, `ci`), enforced by the `commit-msg` hook and re-checked on `staging`/`main` PRs by `.github/workflows/pr-checks.yml`.
