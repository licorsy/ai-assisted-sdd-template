---
title: "Prompt 002: renumber ADR-0010 to ADR-0005, closing the unused-number gap"
doc_type: prompt
description: "Renumbers docs/adr/0010-public-release.md to docs/adr/0005-public-release.md, the next sequential slot after 0004. The original 0010 numbering matched a private, external personal-os workspace's own numbering - a rationale the ADR itself only stated as 'most likely' and that stopped mattering once prompt-001 amended the same ADR to record the private source repo as archived and this repository as the sole source of truth. Updates every citing document's related: field, prose citation, and docs/STATE.md."
status: archived
version: "1.0"
created: 2026-07-31
updated: 2026-07-31
language: en
id: 002-renumber-adr-0010-to-0005
tags: [prompt, adr, governance, renumber]
owner: Alexandre Clemente
related: [0005-public-release, operation-manual, 001-restart-prompt-archive-and-source-of-truth]
---

# Prompt 002: renumber ADR-0010 to ADR-0005, closing the unused-number gap

## ROLE

Act as the maintainer of this repository's own ADR sequence, correcting a numbering artifact that no longer serves any purpose now that the repository it was meant to stay aligned with is archived.

## CONTEXT

`docs/adr/0010-public-release.md`'s own Consequences section explains its number: "Numbered `0010`, not `0005` (the next sequential slot after `0004`) — deliberately matching the number `local-notes/012` itself already used, most likely mirroring a cross-repository numbering the user keeps in the private `personal-os` repository." Even at the time it was written, this was hedged ("most likely") rather than a firm rationale, and the private source repository's own `docs/adr/` never contained `0005`–`0009` either — the alignment was with an external, unrelated, non-public workspace (`personal-os`), not with anything inside this project's own history.

`docs/prompts/001-restart-prompt-archive-and-source-of-truth.md` (this same session) amended that ADR to `v1.2`, recording that the private source repository is now archived and `licorsy/ai-assisted-sdd-template` is the sole source of truth. The reason to keep `0010` aligned with an external private workspace's numbering is gone along with the workspace's relevance here. The gap has already prompted two independent "why the jump from `0004` to `0010`?" questions in this same session — a live signal that the number confuses readers rather than informing them, with no offsetting benefit now that the repo it aligned with no longer matters to this one.

## TASK

1. Rename `docs/adr/0010-public-release.md` → `docs/adr/0005-public-release.md` (`git mv`). Update its own `title`, `id`, H1, and `related:` inside the file; bump `version`/`updated`; replace the Consequences bullet explaining the `0010` gap with a short note recording the correction instead (do not delete the historical fact that it was once numbered `0010` and why — state it briefly, past tense, then say why it changed).
2. Update every other document's citation of `0010-public-release` / `ADR-0010` to `0005-public-release` / `ADR-0005`, where the citation is a live, currently-accurate statement (a `related:` entry, a cross-reference in current rule text, a README bullet): `README.md` (2 places), `docs/manuals/operation-manual.md` (Step 12 rule 1 and rule 3, plus its own v3.51 changelog entry describing this same session's work), `docs/prompts/001-restart-prompt-archive-and-source-of-truth.md` (its `related:` field and body prose), and `CHANGELOG.md`'s not-yet-released `[Unreleased]` entry from this same session.
3. Leave frozen, already-`archived`-adjacent body-changelog entries in `docs/manuals/prompt-engineering-guide.md`, `docs/manuals/agent-design-guide.md`, and `docs/visuals/template-visual-overview.md` untouched — each cites "ADR-0010" as the reason for a past, already-completed edit; this repository's own changelog-retention convention treats such entries as remove-only, never reworded, so they stay as an accurate record of what the ADR was called at the time each entry was written.
4. Regenerate `docs/STATE.md`.

## REQUIREMENTS, CONSTRAINTS AND RULES

- This is a rename, not a re-decision: the ADR's actual Decision, Alternatives considered, and Consequences (other than the numbering bullet itself) are untouched.
- Do not touch the three frozen historical changelog entries named in Task 3 — rewording a retained changelog entry after the fact contradicts this repository's own retention rule ("never reword entries that stay; retention is removal-only").
- `docs/adr/0005-public-release.md`'s `id` becomes `0005-public-release`; every `related:` array anywhere in the repository that lists `0010-public-release` must be updated to `0005-public-release` in the same pass, or the cross-reference check fails.
- Verify with `node ~/workspace/licorsy/docs-governance/bin/docgov.js check --config .docgov.config.js --base-sha <branch-base>` (frontmatter, internal links, changelog retention, version bumps) after the rename, on the same branch as `docs/prompts/001-...md` (not yet merged to `develop`).
- This prompt's own `status` starts at `active` (approved and executed in the same session as `001`, per Step 12a's batch-approved carve-out for a decision already agreed) and flips to `archived` once merged and verified.

## FORMAT AND OUTPUT

Executed as a `git mv` plus edits across `README.md`, `docs/manuals/operation-manual.md`, `docs/prompts/001-restart-prompt-archive-and-source-of-truth.md`, `CHANGELOG.md`, and a regenerated `docs/STATE.md`, on the existing branch `docs/restart-prompt-archive-source-of-truth`. Verification:

1. `ls docs/adr/` shows `0005-public-release.md`, not `0010-public-release.md`.
2. `grep -rn "0010-public-release\|ADR-0010" README.md docs/manuals/operation-manual.md docs/prompts/001-restart-prompt-archive-and-source-of-truth.md CHANGELOG.md docs/STATE.md` returns nothing.
3. `grep -rln "0010-public-release" .` returns only the three frozen changelog-entry files named in Task 3.
4. `docgov check` passes (cross-reference check confirms every `related:` entry resolves).
