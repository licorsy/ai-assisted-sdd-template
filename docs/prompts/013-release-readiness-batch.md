---
title: "Prompt 013: make the repository releasable before the tag is cut"
doc_type: prompt
description: "Named batch of four small, related fixes that are only correct before v1.2.0 is tagged: folds the [Unreleased] entries into the release section so the tag does not sit on a commit advertising unreleased work, merges the section's duplicate ### Changed groups, adds the missing release-integrity row to the Step 15 enforcement table, and clears six prompts left at active after their work merged."
status: archived
version: "1.1"
created: 2026-08-04
updated: 2026-08-04
language: en
id: 013-release-readiness-batch
tags: [prompt, batch, release, changelog, lifecycle-hygiene]
owner: Alexandre Clemente
related: [010-cut-release-v1-2-0, 011-release-integrity-check, 012-always-report-governance-checks]
---

# Prompt 013: make the repository releasable before the tag is cut

## ROLE

Act as the maintainer running the last readiness pass before a tag becomes permanent — where the discipline is separating what must be true *before* the tag from what can be fixed afterwards, and doing only the former.

## CONTEXT

Prompt `010` cut the `[1.2.0]` section and stopped short of its own second task: the `develop → staging → main` promotion with the tag. That promotion is still open, and in the meantime two more changes merged to `develop` — `011` (the release-integrity check) and `012` (gap 20's remaining half). Both wrote entries into `[Unreleased]`.

**That is the item that makes this batch time-sensitive.** Promoting and tagging `v1.2.0` at `main`'s tip now would put the tag on a commit whose own `CHANGELOG.md` lists work as *unreleased* — `main` again carrying more than the tag records, which is the precise drift `010` exists to close, reappearing in a different form. And `011`'s check would **pass** through it: it compares the declared version against the tag and the tag against `main`'s tip, and all three would agree. `011` considered asserting that `[Unreleased]` is empty at tag time and declined it; this is the argument for that assertion which did not exist when the decision was made. Extending the check is **not** part of this batch — it is a behavioural change to a guard, reversing a recorded decision, and it deserves its own prompt rather than riding along in a cleanup.

Folding the two entries into `[1.2.0]` rather than opening a `[1.3.0]` is correct here for a specific reason: **`v1.2.0` has never been tagged.** The section was cut on 2026-08-03 and no tag was ever created, so nothing external references it and the release has not happened. Opening `[1.3.0]` instead would leave `v1.2.0` declared in the changelog and never tagged — a phantom version, and one the check could not see, since it reads only the topmost dated section.

Three smaller items ride along, each minor and none structural:

- `[1.2.0]` has carried **two separate `### Changed` groups** since before this batch, split by the `### Added` group between them. Merging them is only legitimate while the section is untagged, which makes now the moment.
- The Step 15 enforcement table documents every other check in this repository — `docgov`, `promotion-source`, `ci-security`, `scorecard`, `scope-consistency`, `governance-scripts-tests`, `state-staleness`, `adapter-sync`, `adapter-rules`, `step-reference` — and has no row for `release-integrity`. `011` added the tooling and did not add the row.
- Six prompts sit at `status: active` with their work merged and verified: `006`, `007`, `008`, `009`, `011`, `012`. Step 11 names this defect in its own words: *"Leaving a prompt at `active` after its work has already merged is a lifecycle-hygiene bug — watch for it whenever a PR merges without a matching status flip."* `010` correctly stays `active`; its promotion is the open work.

This batch qualifies under Step 12 rule 9 — one shared theme (readiness for the tag), every item individually minor, and every item listed explicitly below.

## TASK

1. **Fold `[Unreleased]` into `[1.2.0]`** and re-date the heading to `2026-08-04`, leaving a fresh empty `[Unreleased]`. New entries join the top of their group, matching the section's existing newest-first ordering.

2. **Merge the duplicate `### Changed` groups** and emit the section's groups in Keep a Changelog order (Added, Changed, Fixed). No bullet is reworded, dropped, or reordered within its group.

3. **Add the `release-integrity` row** to `operation-manual.md`'s Step 15 enforcement table, stating why it is scheduled rather than per-PR and why it is deliberately not a required check.

4. **Flip `006`, `007`, `008`, `009`, `011` and `012` to `status: archived`** in both their own frontmatter and `PROMPT-INDEX.md`, and record against `009` that archiving reflects the completion of its own TASK — the deferred removal of `go-to-market.md` waits on the Licorsy organization and needs its own prompt.

## REQUIREMENTS, CONSTRAINTS AND RULES

- **[CRITICAL]** No bullet in `CHANGELOG.md` may be lost, reworded, or moved between groups. The transformation is mechanical and must be verified by counting bullets before and after, not by reading the diff.
- **[CRITICAL]** Do not extend the release-integrity check in this batch, and do not touch any ruleset. Both are separate, individually-reasoned changes.
- **[HIGH]** `010` stays `status: active`. Its promotion has not happened, and flipping it would assert otherwise.
- **[HIGH]** The `[1.2.0]` preamble stays as written. It records that `v1.0.0` and `v1.1.0` shipped without a release record and that the gap is left visible rather than reconstructed — still true, and still the honest statement.
- **[MEDIUM]** Re-dating the section to `2026-08-04` is only legitimate because no `v1.2.0` tag exists. If a tag has appeared by the time this executes, stop and re-plan: the section is then released and rewriting it is history rewriting.

## FORMAT AND OUTPUT

Executed on branch `chore/013-release-readiness-batch`, merged to `develop` via pull request.

Verification:

1. Bullet count in `CHANGELOG.md` is identical before and after, and the section carries exactly three group headings, each unique.
2. `markdownlint-cli2 CHANGELOG.md` reports zero issues — the duplicate-heading warning that `siblings_only` correctly left standing is a true positive, and closing it is item 2's acceptance evidence.
3. `node --test .github/scripts/*.test.js` passes and `docgov check` exits 0.
4. `PROMPT-INDEX.md` shows exactly two `active` rows: `010`, whose promotion is still open, and this prompt, which stays `active` until its own work merges. Every other row is `archived` or `deprecated`.
