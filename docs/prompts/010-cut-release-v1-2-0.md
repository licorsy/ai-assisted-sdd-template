---
title: "Prompt 010: cut v1.2.0 and establish the release-cut precedent this repository never had"
doc_type: prompt
description: "Converts CHANGELOG.md's [Unreleased] section into a dated [1.2.0] release section and opens a fresh empty [Unreleased] above it, then promotes develop -> staging -> main with the v1.2.0 tag applied in the same movement. The bookkeeping matters more than the version number: this repository has never cut a release section at all - git show v1.0.0:CHANGELOG.md and v1.1.0:CHANGELOG.md both contain only [Unreleased] - so main has twice moved past a tag with no record of what the tag contained, and is currently 30 commits past v1.1.0."
status: archived
version: "1.1"
created: 2026-08-03
updated: 2026-08-04
language: en
id: 010-cut-release-v1-2-0
tags: [prompt, release, changelog, versioning, promotion]
owner: Alexandre Clemente
related: [006-absorb-local-notes-011-accepted-items, documentation-metadata-standard]
---

# Prompt 010: cut v1.2.0, and establish the release-cut precedent

## ROLE

Act as the maintainer closing a release-bookkeeping debt that has been silently compounding since the repository's first tag — where the fix is trivial and the reason it went unfixed twice is the interesting part.

## CONTEXT

`CHANGELOG.md` declares itself to follow [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), which means an `[Unreleased]` section that becomes a dated, versioned section when a release is cut. **That has never happened here.** `git show v1.0.0:CHANGELOG.md` and `git show v1.1.0:CHANGELOG.md` both contain a single `## [Unreleased]` heading and no version section. Two tags were cut; neither recorded what it contained.

The consequence is the current state: `main` sits **30 commits past `v1.2.0`'s predecessor `v1.1.0`** with no tag, and the file's entire body — three `###` groups, ninety-odd lines — is one undifferentiated `[Unreleased]` block spanning both released and unreleased work. A reader cannot tell which entries shipped in `v1.1.0` and which are new.

The org-level lesson this repeats is already written down, in `licorsy/.github`'s known-gaps register: *"Anything that lands on `main` moves `main`, and `main` moving without a tag is exactly the drift `release-integrity` detects — so the version bump belongs **in** the change, not after it. Batch independent gaps; promote once; tag in the same breath."*

**One correction to that framing, specific to this repository.** `release-integrity.yml` exists in `git-governance` and `docs-governance`; it was **never adopted here**. `.github/workflows/` holds eight workflows and none of them is it. So the automated backstop the lesson names is not watching `main` in this repository — the drift compounded precisely because nothing mechanical objected. Adding an adapted `release-integrity` check (CHANGELOG-derived version, no floating major tag) is a real follow-up, deliberately out of scope here: this prompt closes the debt, it does not build the guard.

**Version number.** `v1.2.0`, MINOR under semver. The content is documentation and governance: two new documents, several new conventions, two roadmap self-contradictions fixed, one prompt superseded. Nothing is removed or renamed that a project created from this template would reference. Precedent agrees — `v1.0.0 → v1.1.0` was also a MINOR bump for non-breaking documentation content.

**No floating major tag.** `git-governance` and `docs-governance` maintain a floating `v1` alongside the exact tag, because Claude Code plugin consumption resolves against it. This repository is consumed by *creating a repository from the template*, has no `.claude-plugin/plugin.json`, and has only exact tags. Cut `v1.2.0` and nothing else; inventing a floating tag now would be an unrequested new convention.

## TASK

1. **Cut the release section.** Rename `## [Unreleased]` to `## [1.2.0] - 2026-08-03` and insert a fresh, empty `## [Unreleased]` above it, so the next change has somewhere to land. Do not re-sort, re-word, or re-group the existing entries — they are the record as written.

2. **Promote in one window**, `develop → staging → main`, and **tag `v1.2.0` on the `main` merge commit in the same execution**, not in a later session. This is the whole point: the promotion and the tag are one act, because a promotion that lands without its tag is the exact defect being closed.

3. **Record the precedent** — this file — so the next release is a repeat of something documented rather than a third improvisation.

## REQUIREMENTS, CONSTRAINTS AND RULES

- **[CRITICAL]** The `staging` and `main` hops require **explicit human confirmation at the moment of execution**, against the actual commit range, not a confirmation relayed from earlier in the conversation. This is the `git-governance` permission matrix and it is not satisfied by "the human already said to do the release."
- **[CRITICAL]** The version-cut commit lands on `develop` first, through a work branch and a pull request, exactly like any other change. Never authored directly on `staging` or `main`, and never appended after the promotion as a follow-up — that ordering is what produced this debt.
- **[HIGH]** Cut only `v1.2.0`. No floating `v1` tag, for the reason recorded above.
- **[HIGH]** Do not retroactively split the existing `[Unreleased]` body into `v1.0.0` and `v1.1.0` sections. The information to do that honestly does not exist — those tags shipped without a record, and reconstructing one now would be a fabrication of exactly the kind `documentation-metadata-standard.md` forbids. The gap stays visible.
- **[MEDIUM]** `git log develop..staging` shows commits unique to `staging` from squash-merge artifacts. That is a known, documented trap — report it, do not treat it as drift and do not try to reconcile it.
- A GitHub Release object is not created unless separately asked for; the tag is what this prompt commits to.

## FORMAT AND OUTPUT

Executed as an edit to `CHANGELOG.md` plus this prompt and its `PROMPT-INDEX.md` row, on branch `chore/010-cut-release-v1-2-0`, merged to `develop` via pull request; then a `develop → staging` promotion PR, a `staging → main` promotion PR, and the `v1.2.0` tag on `main`'s merge commit.

Verification: `docgov check` exits 0; `git ls-remote --tags origin` shows `v1.2.0`; `CHANGELOG.md` on `main` carries a dated `[1.2.0]` section and an empty `[Unreleased]`.
