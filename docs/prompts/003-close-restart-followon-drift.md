---
title: "Prompt 003: close the follow-on drift introduced by prompts 001 and 002"
doc_type: prompt
description: "Batchable-minor fix for 13 findings a re-run doc-consistency-reviewer surfaced against prompts 001/002's own changes: a missing docs/prompts/PROMPT-INDEX.md eight documents already assume exists, nine dangling private-repo-only prompt citations Step 12 rule 3 now calls non-citable, a leftover docs/adr/0010-public-release.md path in sync-to-public-mirror.sh, ADR-0005's own Consequences/Confidence contradicting its own Status section, a stale 0002-0004 ADR range in two files, un-relinked basic-prompt-template.md prose, ambiguous status-based-vs-directory-wide docs/prompts/ scope language in nine places, a stale changelog filename convention, a missing Document map row, a template title/H1 mismatch, a self-contradicting changelog pair, a misfiled README keep-vs-replace row, and a PROPOSAL-TRACKING.md ADR-number collision. Every item is individually minor; none is structural."
status: archived
version: "1.1"
created: 2026-07-31
updated: 2026-08-06
language: en
id: 003-close-restart-followon-drift
tags: [prompt, batch, governance, doc-consistency]
owner: Alexandre Clemente
related: [001-restart-prompt-archive-and-source-of-truth, 002-renumber-adr-0010-to-0005, operation-manual, documentation-metadata-standard, 0005-public-release]
---

# Prompt 003: close the follow-on drift introduced by prompts 001 and 002

## ROLE

Act as the maintainer closing out a re-review's findings against this repository's own governance/tooling documents — every item here is a small, individually-minor correction with a shared theme (follow-on drift from restarting `docs/prompts/` and renumbering ADR-0010→0005), not a new decision.

## CONTEXT

A `doc-consistency-reviewer` re-run against the two commits already on `docs/restart-prompt-archive-source-of-truth` found 13 findings: the fixes landed their stated targets (ADR identity, `related:` graph, adapter sync all clean) but introduced follow-on drift of their own — most visibly, `docs/prompts/PROMPT-INDEX.md` is assumed present by eight living documents (including `agents/doc-consistency.md`'s own scope rule) but was never created by the restart. Per this repository's Step 12a, a batch of small, individually non-structural, related fixes shares one prompt document (rule 9); that is this file.

## TASK

1. Create `docs/prompts/PROMPT-INDEX.md` (`doc_type: status-artifact`) with rows for `001` and `002` (both `active`).
2. Qualify all nine live citations of private-repo-only prompt files (`CLAUDE.md`/`AGENTS.md` git-operations block, `docs/adr/0005-public-release.md` ×3, `docs/manuals/operation-manual.md` ×2, `docs/manuals/tool-library-catalog.md`, `docs/adr/0004-docs-category-directories.md`, `docs/reports/PROPOSAL-TRACKING.md`, `agents/doc-consistency.md`) as archived-private-repo, non-citable-here paths, matching Step 12 rule 3's own language.
3. Fix `.github/scripts/sync-to-public-mirror.sh`'s header: drop the `docs/adr/0010-public-release.md` path (renumbered), add a RETIRED notice per ADR-0005 v1.2 (must not be run from this repository).
4. Correct `docs/adr/0005-public-release.md`'s Consequences and Confidence sections, which still assert the retired two-repository model in the present tense — three sections after the Status section already retired it.
5. Update the `0002`-`0004` real-ADR range to `0002`-`0005` in `agents/init.md` and `docs/manuals/documentation-metadata-standard.md`.
6. Re-link the two now-valid `docs/prompts/basic-prompt-template.md` prose references in `docs/manuals/prompt-engineering-guide.md` (Section 1 and Section 4), un-linked in v1.7 when the file didn't exist; add a v1.8 changelog entry recording the re-link (trim oldest per retention cap).
7. Tighten "docs/prompts/ is a frozen historical archive" language to be explicitly status-based (`archived`/`deprecated` frozen, `draft`/`active` current) in: `CLAUDE.md`, `AGENTS.md`, `README.md`, `docs/manuals/documentation-metadata-standard.md` (×2), `docs/STATE.md`'s generator (`generate-state.js`), `docs/manuals/operation-manual.md`, `.docgov.config.js`, `check-step-references.js`, and `agents/doc-consistency.md`'s own scope rule (Section 3 step 1) — the last one is the most consequential, since an ambiguous reading of it is what let this reviewer almost skip the two `status: active` prompts describing its own branch.
8. Fix `CHANGELOG.md`'s intro sentence: retired `NNN-prompt-<slug>.md` convention → current `NNN-<slug>.md`.
9. Add a `docs/prompts/` row to `docs/manuals/operation-manual.md`'s Document map (the table `README.md` calls the sole canonical component map).
10. Fix `docs/prompts/basic-prompt-template.md`'s H1 to mirror its `title`, per `docs/manuals/documentation-metadata-standard.md`'s own schema rule.
11. Remove `docs/visuals/template-visual-overview.md`'s v1.9 changelog entry, which now directly contradicts the v1.10 entry immediately above it (removal, not reword, is compliant with the retention rule).
12. Fix `README.md`'s "template material vs. yours to replace" table: only `docs/prompts/basic-prompt-template.md` belongs in the keep-as-is column; `001-...md`/`002-...md` are this repository's own history, not an adopter's.
13. Annotate `docs/reports/PROPOSAL-TRACKING.md`'s "ADR-0005 (aidlc-integration)" row: that slot is now occupied by the real, unrelated public-release ADR.

Regenerate `docs/STATE.md` after all edits land.

## REQUIREMENTS, CONSTRAINTS AND RULES

- Every item above is individually minor (wording, reference, or small consistent doc/comment edit); no new file, folder, rule, or agent beyond `docs/prompts/PROMPT-INDEX.md` itself, which eight documents already assume exists rather than introducing a new path.
- Do not reword the three already-frozen historical changelog entries the prior audit correctly left alone (`docs/manuals/agent-design-guide.md`, and the *other* entries in `docs/manuals/prompt-engineering-guide.md`/`docs/visuals/template-visual-overview.md` besides the one contradicted pair in Task 11) — retention stays removal-only, never reword.
- `CLAUDE.md`/`AGENTS.md` edits in Tasks 2 and 7 fall outside the `<!-- sync: -->` markers; update both files byte-identically anyway, since `check-adapter-sync.js` will not catch a one-sided miss there.
- Per the human's explicit instruction, this batch stays **uncommitted** (working-tree only) so a follow-up `doc-consistency-reviewer` pass can verify it before anything is committed.
- Every edited file's frontmatter `version`/`updated` bumps per its own changelog-retention convention (trim the oldest body-changelog entry if the new one pushes the list past 3).
- This prompt's own `status` starts at `active` and flips to `archived` once merged and verified — not before, and not while still uncommitted.

## FORMAT AND OUTPUT

Executed as edits across `docs/prompts/PROMPT-INDEX.md` (new), `CLAUDE.md`, `AGENTS.md`, `docs/adr/0005-public-release.md`, `.github/scripts/sync-to-public-mirror.sh`, `agents/init.md`, `docs/manuals/documentation-metadata-standard.md`, `docs/manuals/prompt-engineering-guide.md`, `docs/manuals/operation-manual.md`, `docs/manuals/tool-library-catalog.md`, `docs/adr/0004-docs-category-directories.md`, `docs/reports/PROPOSAL-TRACKING.md`, `agents/doc-consistency.md`, `.docgov.config.js`, `.github/scripts/check-step-references.js`, `.github/scripts/generate-state.js`, `CHANGELOG.md`, `docs/prompts/basic-prompt-template.md`, `docs/visuals/template-visual-overview.md`, `README.md`, and a regenerated `docs/STATE.md`, all on the existing branch, left uncommitted. Verification: `docgov check` (frontmatter, links, changelog retention, version bumps) passes; `check-adapter-sync.js` and `check-step-references.js` pass; a follow-up `doc-consistency-reviewer` pass finds no new drift attributable to this batch.
