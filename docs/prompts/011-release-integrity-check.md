---
title: "Prompt 011: build the release-integrity guard prompt 010 deliberately left unbuilt"
doc_type: prompt
description: "Adds a local, scheduled check that fails when main has moved past the version CHANGELOG.md declares — the mechanical backstop whose absence let two tags ship with no release record. Adapted rather than adopted: the upstream reusable workflow hard-requires a floating major tag this repository deliberately does not have, and calling it would reintroduce the org dependency v1.2.0 just guarded against."
status: archived
version: "1.1"
created: 2026-08-04
updated: 2026-08-04
language: en
id: 011-release-integrity-check
tags: [prompt, release, ci, governance, versioning]
owner: Alexandre Clemente
related: [010-cut-release-v1-2-0, documentation-metadata-standard]
---

# Prompt 011: build the release-integrity guard

## ROLE

Act as the maintainer building the mechanical check that would have caught a defect already recorded twice by hand — where the design work is deciding how much of a sibling repository's solution actually transfers, and refusing the parts that do not.

## CONTEXT

`docs/prompts/010-cut-release-v1-2-0.md` closed a bookkeeping debt and named its own successor in the same breath: *"Adding an adapted `release-integrity` check (CHANGELOG-derived version, no floating major tag) is a real follow-up, deliberately out of scope here: this prompt closes the debt, it does not build the guard."* This prompt builds the guard.

The debt it guards against is live right now. `main` sits **30 commits past `v1.1.0`** with no tag between them, which is precisely the drift the check must detect. That makes verification unusually honest here: the check has a real failing case available before it is written, so it can be proven to fire against genuine drift rather than against a fixture.

**The upstream solution does not transfer whole.** `licorsy/platform-workflows` publishes a reusable `release-integrity.yml`, called by both `git-governance` and `docs-governance`. Four things block calling it from here:

1. **It hard-requires a floating major tag.** Its `version-file` input documents *"Empty to skip"*; `major-tag` documents no such affordance and defaults to `v1`. Passing an empty string does not skip the check — it verifies `refs/tags/`, which fails, yielding a permanent unfixable failure. This repository has **no floating tag** and will not grow one: `010`'s `[HIGH]` rule records why (consumption is *Create repository from template*, not tag resolution; a floating tag would be an unrequested new convention).

2. **Two of its three failure modes do not exist here.** The upstream file enumerates three: *main moved, nobody tagged*; *tagged, floating tag not moved*; *floating tag points at a tag object*. The second and third are floating-tag mechanics. Only the first applies to this repository. Copying the file would ship a comment block describing consumer-resolution machinery this repository does not have — the kind of confidently-wrong documentation `docs/manuals/documentation-metadata-standard.md` exists to prevent.

3. **Calling it would reopen what `v1.2.0` just closed.** `pr-checks.yml`'s `ci-docs` and `ci-security` jobs carry `if: github.repository_owner == 'licorsy'` because this repository is a GitHub template, and a project created from it inherits a silent dependency on reusable workflows the Licorsy organization controls and can change or delete. A new caller of `licorsy/platform-workflows` would reintroduce that surface one release after it was guarded.

4. **House style is local.** Seven of this repository's eight workflows run `node .github/scripts/*.js` against a `.test.js` sibling, collected by `governance-scripts-tests.yml` via `node --test`. A local script inherits that test harness for free.

**Version source.** This repository has no `package.json` and no `.claude-plugin/plugin.json`. Its only machine-readable version statement is `CHANGELOG.md`'s topmost **dated** section heading — currently `## [1.2.0] - 2026-08-03`, sitting below the deliberately empty `## [Unreleased]`. That heading is the declared version, and comparing it against the tags is the whole check.

**Peeling is a local requirement, not a borrowed one.** This repository's two tags disagree in kind: `git cat-file -t v1.0.0` reports `tag` (annotated), `v1.1.0` reports `commit` (lightweight). Any comparison that does not peel with `^{}` will read an annotated tag's own object sha and report false drift against `main`. Whether that inconsistency should itself be corrected is **out of scope here** — this prompt builds a check that tolerates both, and does not rewrite history to make them agree.

## TASK

1. **Add `.github/scripts/check-release-integrity.js`.** It reads the topmost dated `## [X.Y.Z] - YYYY-MM-DD` heading in `CHANGELOG.md`, skipping `## [Unreleased]`, and reports a problem when any of these hold: the heading is missing or unparseable; tag `vX.Y.Z` does not exist; or `vX.Y.Z^{}` does not resolve to the tip of `main`. Exit non-zero with every problem listed, not just the first.

2. **Add `.github/scripts/check-release-integrity.test.js`**, covering at minimum: the clean case, the untagged-declared-version case, the tag-behind-main case, an annotated tag (must pass, proving `^{}` peeling), and a missing or malformed heading.

3. **Add `.github/workflows/release-integrity.yml`** — `schedule` plus `workflow_dispatch`, with a job id distinct from every other workflow's in this repository.

4. **Record the entry** in `CHANGELOG.md`'s `[Unreleased]` section and the row in `docs/prompts/PROMPT-INDEX.md`.

## REQUIREMENTS, CONSTRAINTS AND RULES

- **[CRITICAL]** Never trigger on push to `main`. Tagging happens *after* the merge, so a push-triggered run fails on every release by construction and trains everyone to ignore it. This reasoning is upstream's, is correct, and is one of the parts that does transfer.
- **[CRITICAL]** No dependency on `licorsy/platform-workflows` or any other reusable workflow, for CONTEXT reason 3. The check must run unchanged in a repository created from this template, owned by anyone.
- **[HIGH]** Compare peeled tag objects (`^{}`) on both sides, for the mixed annotated/lightweight reason above.
- **[HIGH]** Scope is `main` versus the declared version. Do **not** assert that `[Unreleased]` is empty, that tags are annotated, or anything else — those were considered and explicitly declined when this work was scoped.
- **[MEDIUM]** The scheduled cron must be offset from the sibling repositories' runs (`docs-governance` uses `44 6 * * *`) rather than landing on the hour with them.
- **[MEDIUM]** The check reads `main`, so a scheduled run in a fork or a fresh template instance with no tags at all must fail with a legible message naming what is missing — not a stack trace.
- The workflow must **not** be added to the required-checks set in this batch. It reports on a branch it does not gate, and making it required would block pull requests on the state of `main`.

## FORMAT AND OUTPUT

Executed on branch `chore/011-release-integrity-check`, merged to `develop` via pull request. No `staging` or `main` movement in this batch — the promotion and the `v1.2.0` tag remain `010`'s open item, executed separately with explicit confirmation at that moment.

Verification, in this order:

1. `node --test .github/scripts/*.test.js` passes, including the new file.
2. Run the check against the repository as it stands: it **must fail**, reporting that `CHANGELOG.md` declares `1.2.0` while tag `v1.2.0` does not exist. A guard that passes on today's drift is not a guard.
3. `docgov check` exits 0.
4. After `010`'s promotion later closes, the same command must pass unchanged. That transition — red on real drift, green once the drift is genuinely resolved — is the acceptance evidence, not a fixture.
