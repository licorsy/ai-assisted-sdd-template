---
title: "Prompt 001: restart the change-as-prompt archive and record this repository as the source of truth"
doc_type: prompt
description: "Restarts docs/prompts/ inside licorsy/ai-assisted-sdd-template (numbering fresh at 001; the pre-2026-07-31 archive stays in the archived private source repository and is deliberately not migrated) and amends ADR-0010 to record that this repository, not the private source repo, is now where prompt-driven development happens. Repoints operation-manual.md Step 12's structure citations, CLAUDE.md/AGENTS.md's synced change-as-prompt block, and README.md at paths that actually exist here, and fixes the prompt-lifecycle diagram's stale filename convention. Fixes the root cause behind findings 1, 2, and 4 of a 2026-07-31 doc-consistency-reviewer audit."
status: active
version: "1.0"
created: 2026-07-31
updated: 2026-07-31
language: en
id: 001-restart-prompt-archive-and-source-of-truth
tags: [prompt, governance, adr, docs-prompts, source-of-truth]
owner: Alexandre Clemente
related: [operation-manual, documentation-metadata-standard, 0010-public-release, basic-prompt-template]
---

# Prompt 001: restart the change-as-prompt archive and record this repository as the source of truth

## ROLE

Act as the maintainer of this template repository's own governance documents, applying a decision the human already made about which repository is canonical — not re-litigating the decision itself, only executing its documentation consequences precisely and traceably.

## CONTEXT

`docs/adr/0010-public-release.md` (Accepted, 2026-07-30) recorded a two-repository model: the private `aleclemente/ai-assisted-sdd-template` stays "the sole repository where prompt-driven development happens," and `licorsy/ai-assisted-sdd-template` is a disposable public mirror refreshed by an on-demand, force-pushed export with no history of its own to preserve between syncs.

That premise stopped holding on 2026-07-31: the human decided to archive the private repository and made `licorsy/ai-assisted-sdd-template` the sole official repository going forward. This repository's own git history already shows the consequence — PR-merged commits (#1, #2, #5, #8) on `develop`, not a single fresh export commit. One deliberate side effect of the archival was **not** migrating the private repo's `docs/prompts/` history (which contained some business/personal detail its own `sync-to-public-mirror.sh` always excluded from exports) into this repository — a choice already made and not reopened here.

That left a gap: this repository's own `docs/manuals/operation-manual.md` Step 12 change-as-prompt rule, mirrored into `CLAUDE.md`/`AGENTS.md`, requires every non-trivial change to this repository to be captured as `docs/prompts/NNN-<slug>.md` — but `docs/prompts/` did not exist here at all, and Step 12 rule 3's worked-example citations (`087-prompt-enumeration-drift-batch.md`, `005-prompt-update-upgrade-refactoring.md`) and Step 11's lifecycle-hygiene example (`prompt-004`/`prompt-005`) pointed at files that only ever existed in the now-archived private repo. A full-corpus `doc-consistency-reviewer` audit run on 2026-07-31 caught this as its top two findings (the rule was "unexecutable... this very review was commissioned without one," and `ADR-0010`'s `status: active` decision no longer matched observable reality), plus a smaller one (the prompt-lifecycle diagram in `docs/visuals/template-visual-overview.md` still used the pre-`prompt-103` `NNN-prompt-slug.md` filename shape instead of the current `NNN-<slug>.md`).

Presented with the audit, the human chose to resolve the root cause directly: amend `ADR-0010` to record `licorsy/ai-assisted-sdd-template` as the current source of truth, and restart the prompt archive here rather than leaving the rule unfollowable or stripping it out. This prompt is that restart's own first entry, and the vehicle for the documentation fixes it requires.

## TASK

1. **Create `docs/prompts/basic-prompt-template.md`** — the reusable scaffold Step 12 rule 3 requires, matching this repository's own frontmatter schema and content shape (already done as part of this same change, immediately before this file).
2. **Amend `docs/adr/0010-public-release.md`** — add a new `## Status` line recording that the two-repository model's "private repo is sole source of truth, public mirror refreshed by force-pushed on-demand export" half no longer holds; the "single fresh commit, no carried-over history" migration record stays accurate as history and is not rewritten. Bump `version`/`updated`.
3. **Fix `docs/manuals/operation-manual.md` Step 11 and Step 12**:
   - Step 11 item 3: drop the dangling `prompt-004`/`prompt-005` citation (private-repo-only, not migrated); keep the lifecycle-hygiene warning itself.
   - Step 12 rule 1: add one sentence recording that prompts are now authored directly in this repository, since it is the current source of truth.
   - Step 12 rule 3: repoint the worked-example citation at this file (`001-restart-prompt-archive-and-source-of-truth.md`) instead of the two private-repo-only files, and say plainly that the deeper pre-2026-07-31 archive is not migrated and not citable here.
   - Bump `version`/`updated`; trim the oldest changelog entry per the 3-entry retention cap.
4. **Sync `CLAUDE.md` and `AGENTS.md`** — the change-as-prompt block's worked-example citation (`087-prompt-enumeration-drift-batch.md`) must change in lockstep with Step 12 rule 3, byte-identical to `operation-manual.md`'s corresponding text and to each other, per `check-adapter-sync.js`.
5. **Fix `README.md`** — the ADR-0010 key-document bullet's "this repository stays private and remains the sole place development happens" clause (now false in this repository); the "Prompts & history" section's framing of `docs/prompts/` stays accurate once the directory exists, no change needed there beyond confirming it still reads correctly.
6. **Fix `docs/visuals/template-visual-overview.md`** — Section 4's prompt-lifecycle diagram still labels the first node `docs/prompts/NNN-prompt-slug.md`; the naming convention changed to `docs/prompts/NNN-<slug>.md` as of `operation-manual.md` v3.49 (this file's own governing rule already requires updating a diagram in the same change as the documents it visualizes). Bump `version`/`updated` and changelog entry.
7. **`CHANGELOG.md`** — one `[Unreleased]` entry under `### Added` recording the restart and the ADR amendment, following this file's existing entry style.
8. **Regenerate `docs/STATE.md`** via `node .github/scripts/generate-state.js` after all the above land, so the facade reflects the new/changed files.

## REQUIREMENTS, CONSTRAINTS AND RULES

- Do not migrate any pre-2026-07-31 prompt content from the private source repository — that choice was already made when the private repo was archived and is not reopened by this prompt. This restart begins a new sequence at `001`; it is not a renumbering or continuation of the old one.
- Do not alter `ADR-0010`'s historical record of *what was decided and executed* on 2026-07-30/31 (the single-fresh-commit migration, the sanitization-gate rationale) — only append a status note that the ongoing operating assumption changed.
- `CLAUDE.md` and `AGENTS.md`'s `<!-- sync:change-as-prompt-rule -->` blocks must stay byte-identical to each other and to `operation-manual.md`'s Step 12 rule 3 text after this change; verify before considering the batch done.
- Every edited file's frontmatter `version`/`updated` bumps per its own changelog-retention convention (trim the oldest body-changelog entry if the new one pushes the list past 3, per `documentation-metadata-standard.md` Section 2.1).
- This prompt's own `status` starts at `active` (the human already approved the plan and execution begins in the same session, per `operation-manual.md` Step 12a's batch-approved carve-out for a group of steps already agreed as one unit) and flips to `archived` once every change above is verified.
- Out of scope, deliberately: two smaller doc-consistency-reviewer findings from the same 2026-07-31 audit (`docs/reports/ARTIFACT-NECESSITY-AUDIT.md` and `docs/reports/PROPOSAL-TRACKING.md` each citing evidence — a `CLAUDE.md` skill list, `008-relatorio-melhorias-v6.md` — that does not exist in this repository) share the same root cause but touch different files with a different fix shape; left for a follow-up pass.

## FORMAT AND OUTPUT

Executed as edits across `docs/prompts/basic-prompt-template.md` (new), this file (new), `docs/adr/0010-public-release.md`, `docs/manuals/operation-manual.md`, `CLAUDE.md`, `AGENTS.md`, `README.md`, `docs/visuals/template-visual-overview.md`, `CHANGELOG.md`, and a regenerated `docs/STATE.md`, on branch `docs/restart-prompt-archive-source-of-truth`, PR'd to `develop`. Verification:

1. `ls docs/prompts/` shows `basic-prompt-template.md` and `001-restart-prompt-archive-and-source-of-truth.md`.
2. `grep -n "no longer holds" docs/adr/0010-public-release.md` shows the status amendment.
3. `grep -n "001-restart-prompt-archive-and-source-of-truth" docs/manuals/operation-manual.md CLAUDE.md AGENTS.md` shows the worked-example citation repointed everywhere it appears.
4. `diff <(sed -n '/<!-- sync:change-as-prompt-rule/,/\/sync:change-as-prompt-rule -->/p' CLAUDE.md) <(sed -n '/<!-- sync:change-as-prompt-rule/,/\/sync:change-as-prompt-rule -->/p' AGENTS.md)` shows no diff; `node .github/scripts/check-adapter-sync.js` passes if present.
5. `grep -n "NNN-slug.md\|NNN-<slug>.md" docs/visuals/template-visual-overview.md` shows the diagram's node text matches the current convention.
6. `node .github/scripts/generate-state.js --check` (or `node .github/scripts/generate-state.js` to regenerate) shows `docs/STATE.md` current.
