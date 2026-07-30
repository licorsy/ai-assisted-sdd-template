# Contributing

This repository is the template *itself* — its own operating model, governance, and prompts — not a project generated from it. Changes here follow a stricter process than a typical downstream project would, because this template's process documents are what every generated project inherits.

## Proposing a change

Every non-trivial change to this template (its own docs, governance, prompts, or tooling) is captured as a `docs/prompts/NNN-<slug>.md` file **before** implementation begins — the Change-as-prompt rule, defined in full in `docs/manuals/operation-manual.md`, Step 12. Use `docs/prompts/basic-prompt-template.md` as the starting scaffold. A small, related batch of individually-minor fixes can share one prompt document (Step 12 rule 9); structural changes get their own.

Trivial changes (typo fixes, obviously reversible one-liners) can skip this — see Step 12a's tiering criteria in the operation manual if it's unclear which bucket a change falls into.

Proposals from an external improvement report dropped into `docs/reports/` get logged into that folder's `PROPOSAL-TRACKING.md` at intake — one row per distinct proposal, status `not-triaged` until a decision is made. Batch-evaluation sessions update that file's `Status`/`Decision` columns directly; they don't produce a new summary document each time.

## Prompt lifecycle

Each prompt file's frontmatter `status` field tracks its own lifecycle:

1. `draft` — written, not yet approved for execution.
2. `active` — approved and being implemented on the current branch.
3. `archived` — merged and verified; the file stays in place as historical record (see `docs/manuals/documentation-metadata-standard.md` — there is no folder-per-status move, and no precedent for deleting a prompt file once archived).
4. `deprecated` — drafted but declined or superseded before execution; the decline reason is recorded in the prompt's own body, not only in `PROMPT-INDEX.md` (`docs/manuals/operation-manual.md`, Step 11, trigger 4).

`docs/prompts/PROMPT-INDEX.md` is the id/status/one-line-purpose index across every prompt except the blank scaffold; update it alongside any status change.

## Conventions

- **File naming**: root-level entry-point files use UPPER-CASE (`README.md`, `QUICKSTART.md`, `CLAUDE.md`, `AGENTS.md`, `CONTRIBUTING.md`, `SECURITY.md`, `CHANGELOG.md`); everything under `docs/` and `agents/`, plus `.github/workflows/` and `.github/scripts/`, uses lowercase-hyphenated names (`operation-manual.md`, `075-prompt-governance-hygiene-batch.md`). GitHub-mandated files in `.github/` keep the exact names GitHub requires (`CODEOWNERS`, `ISSUE_TEMPLATE/`, `PULL_REQUEST_TEMPLATE.md`).
- **Documentation metadata**: every Markdown file in the living-document directories — enumerated once in `.github/scripts/doc-scope.js`'s `CATEGORY_DIRS` and described in `docs/manuals/documentation-metadata-standard.md` Section 1 — carries the YAML frontmatter schema defined there. Section 1 is also canonical for which root files are in scope (`QUICKSTART.md` is the only one).

## Pull requests

Use `.github/PULL_REQUEST_TEMPLATE.md`'s checklist — it links a PR back to its approving prompt and confirms frontmatter/status are current.

## Syncing to the public mirror

This repository stays private and is the sole place development happens; `licorsy/ai-assisted-sdd-template` is a public mirror, updated on-demand, never automatically (`docs/adr/0010-public-release.md`). When something is release-ready: `.github/scripts/sync-to-public-mirror.sh` (add `--dry-run` to inspect the exported tree without pushing). It runs the sanitization gate, excludes `docs/prompts/` and `docs/reports/008-relatorio-melhorias-v6.md` (frozen historical record with detail about this user's other private projects — excluded, never rewritten, per `prompt-108`), and force-pushes a fresh single-commit snapshot — the mirror has no commit history of its own to preserve between syncs beyond its first commit.
