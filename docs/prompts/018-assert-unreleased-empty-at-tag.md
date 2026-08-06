---
title: "Prompt 018: assert [Unreleased] is empty when release-integrity says a release is live"
doc_type: prompt
description: "Reverses a recorded decision: prompt 011 declined to assert CHANGELOG.md's [Unreleased] section is empty at tag time. On 2026-08-04 that gap nearly shipped a tag whose CHANGELOG entry understated what the tagged commit actually contained, caught by hand rather than mechanically. Extends check-release-integrity.js to fail when main's tip matches its declared release's tag but [Unreleased] is not empty."
status: archived
version: "1.1"
created: 2026-08-06
updated: 2026-08-06
language: en
id: 018-assert-unreleased-empty-at-tag
tags: [prompt, release, ci, governance, versioning, changelog]
owner: Alexandre Clemente
related: [011-release-integrity-check, 013-release-readiness-batch]
---

# Prompt 018: assert `[Unreleased]` is empty when release-integrity says a release is live

## ROLE

Act as the maintainer reversing a scope decision a prior prompt made deliberately — where the discipline is not just building the assertion that was declined, but recording, precisely, the concrete failure it would have caught, since a guard added for a hypothetical is easy to argue about and a guard added for a near-miss that actually happened is not.

## CONTEXT

`docs/prompts/011-release-integrity-check.md` built `check-release-integrity.js` to answer one question: does `main` carry the version `CHANGELOG.md` declares. Its `[HIGH]` rule was explicit about what it left out: *"Scope is `main` versus the declared version. Do **not** assert that `[Unreleased]` is empty, that tags are annotated, or anything else — those were considered and explicitly declined when this work was scoped."*

**The gap that decision left is not hypothetical — it nearly shipped.** `docs/prompts/013-release-readiness-batch.md` records what happened next: `010` cut the `## [1.2.0]` section, leaving a fresh, empty `## [Unreleased]` above it, and then `011` and `012` both merged to `develop`, each writing a new entry into that now-open `[Unreleased]`. Had the `develop → staging → main` promotion and the `v1.2.0` tag happened at that point — before `013` folded `[Unreleased]` back into `[1.2.0]` by hand — `check-release-integrity.js` would have reported **clean**: the topmost dated heading (`## [1.2.0]`) matches an existing tag, and that tag points at `main`'s tip. All true, and still wrong: the tagged commit would have shipped `011`'s whole release-integrity check and `012`'s ruleset change, neither mentioned in `[1.2.0]`'s release notes, both left sitting under `[Unreleased]` as if unreleased. `013`'s own words for why this was not folded into that cleanup: *"Extending the check is **not** part of this batch — it is a behavioural change to a guard, reversing a recorded decision, and it deserves its own prompt rather than riding along in a cleanup."* This is that prompt.

**What the check does today.** `parseDeclaredVersion` in `.github/scripts/check-release-integrity.js` reads `CHANGELOG.md`'s topmost `## [X.Y.Z] - YYYY-MM-DD` heading, explicitly skipping `## [Unreleased]` (which carries no date by design). `checkReleaseIntegrity` then reports a problem only when that declared version has no matching tag, or when the tag exists but does not peel (`^{}`) to the same sha as `main`'s tip. It never reads what is inside `[Unreleased]` at all.

**What "empty" means, by this repository's own established convention.** `docs/prompts/010-cut-release-v1-2-0.md`'s cut left `[Unreleased]` as exactly the heading line with nothing following it — not even an empty `### Added`/`### Changed`/`### Fixed` subheading — before the next `## [` heading. That is the literal target: the text between `## [Unreleased]` and the next `## ` heading, trimmed, is the empty string.

**Why this only matters, and only fires, when a release is actually live at `main`'s tip.** Mid-cycle, `[Unreleased]` legitimately holds real content — it does right now, on `develop`, from this session's own work. The check already only ever runs against `main`, and the new assertion is meaningful only in the specific state the near-miss was about: the declared version's tag exists **and** points at `main`'s current tip (a release genuinely is live there). In every other state — no tag yet, tag behind `main` — the existing problems already describe what is wrong, and asserting `[Unreleased]` emptiness on top would be redundant or actively confusing (mid-cycle drift is normal, not a defect).

## TASK

1. **Add a fourth check to `checkReleaseIntegrity`** in `.github/scripts/check-release-integrity.js`: when the existing logic reaches the state "declared version has a tag, and that tag's peeled sha equals `main`'s peeled tip" (today's clean-pass case), additionally extract the text between the `## [Unreleased]` heading and the next `## ` heading. If that text, trimmed, is non-empty, report a problem naming what was found (at minimum: that `[Unreleased]` is not empty at a commit release-integrity considers tagged, and this means the tagged release's notes may not describe everything the tagged commit contains).

2. **Extend `.github/scripts/check-release-integrity.test.js`** with, at minimum: a clean case where `[Unreleased]` is genuinely empty (must still pass — this is the existing green path and must not regress); a case matching the actual near-miss shape (tag matches `main`'s tip, `[Unreleased]` has content) that must fail with a message naming the problem; and a case where `main` has *not* yet reached the declared version's tag and `[Unreleased]` has content (must **not** report the new problem — the existing "tag behind main" or "no tag" problem is the only one that fires there, since asserting emptiness mid-cycle would be a false positive).

3. **Amend `.github/workflows/release-integrity.yml`'s comment block** and `.github/scripts/check-release-integrity.js`'s own top-of-file comment to describe the fourth failure mode alongside the original one, and cross-reference this prompt the way both already cross-reference `011`.

4. **Record the entry** in `CHANGELOG.md`'s `[Unreleased]` section and the row in `docs/prompts/PROMPT-INDEX.md`.

## REQUIREMENTS, CONSTRAINTS AND RULES

- **[CRITICAL]** The new assertion fires **only** when the declared version's tag exists and matches `main`'s peeled tip. Do not report non-empty `[Unreleased]` as a problem in the "no tag yet" or "tag behind main" states — those are normal mid-cycle conditions, not the defect this prompt closes, and conflating them would make the check noisy on every ordinary day between releases.
- **[CRITICAL]** "Empty" means the literal convention this repository already uses: nothing but whitespace between the `## [Unreleased]` heading and the next `## ` heading. Do not treat an empty `### Added`/`### Changed`/`### Fixed` subheading with no bullets under it as non-empty, and do not invent a stricter or looser definition than the one `010`'s own cut already established.
- **[HIGH]** Every existing test in `check-release-integrity.test.js` must still pass unchanged — this is a strict addition to what the check reports, not a rewrite of what it already correctly reports.
- **[HIGH]** Do not touch the check's non-goals `011` also declined (tag-kind enforcement, anything about tag annotation) — only the one item this prompt is explicitly reversing.
- **[MEDIUM]** This is not itself a candidate for the required-checks set. `011`'s reasoning for keeping it out (`main`-scoped, scheduled, would block pull requests on a branch they have not reached) is unchanged by this addition.

## FORMAT AND OUTPUT

Executed on branch `chore/018-assert-unreleased-empty-at-tag`, merged to `develop` via pull request.

Verification, in this order:

1. `node --test .github/scripts/*.test.js` passes, including every new case from TASK item 2, and every pre-existing case unchanged.
2. Run the check against the repository as it stands (`main` at `v1.2.0`, `[Unreleased]` non-empty on `develop`): the new assertion must **not** fire, because `develop` is not `main` and this check only ever reads `main` — confirming TASK item 2's third case is not a fixture-only guarantee.
3. Construct the near-miss shape directly (a fixture, or a dry run against the historical commit between `010` cutting `[1.2.0]` and `013` folding `[Unreleased]` back in, if reachable) and confirm the new assertion fires there with a legible message.
4. `docgov check` exits 0.

**Executed and verified 2026-08-06, test-first.** Six new tests written and watched fail for the right reason (`extractUnreleasedSection is not a function`, and the near-miss fixture returning `0` problems instead of `1`) before any production code changed; all nine pre-existing tests untouched throughout. `node --test .github/scripts/*.test.js`: 15/15 in the file, 49/49 repository-wide. `docgov check` exits 0, set-stable at 564 shadow findings across the change (0 new, 0 removed).

**Criterion 2 needed a real `main` checkout, not a same-branch run.** Running the script on this feature branch reports the new problem — expected, and not a defect: `checkReleaseIntegrity` reads `CHANGELOG.md` off the working tree, not via `git show main:CHANGELOG.md`, so any branch other than `main` shows its own `[Unreleased]` content regardless of what the tag says. In CI this is resolved by `release-integrity.yml`'s own `actions/checkout@v4` step (`ref: main`), which is exactly the mechanism this prompt's own CONTEXT names but did not spell out at this level of detail. Verified faithfully with a `git worktree` checked out to `main`: the script reports `Release integrity OK`, confirming `main`'s own `[Unreleased]` — genuinely just the heading, nothing below it — does not trip the new assertion.

**Criterion 3 used the fixture path.** The historical commit between `010`'s cut and `013`'s fold is not reachable as a clean single-file diff (both prompts touch other lines in the same commits), so the near-miss shape was reconstructed as a fixture instead, matching the option this prompt's own verification section names.
