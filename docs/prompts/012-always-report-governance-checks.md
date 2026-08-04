---
title: "Prompt 012: make the governance checks always report, so they can be required"
doc_type: prompt
description: "Removes the `paths:` filters from the six governance check workflows so each always creates a check run, which is the precondition for requiring them at the staging and main gates. Closes licorsy/.github gap 20, whose premise had partly expired: the job-naming half was already fixed, six workflows carry filters rather than five, and none of them is required today."
status: archived
version: "1.1"
created: 2026-08-04
updated: 2026-08-04
language: en
id: 012-always-report-governance-checks
tags: [prompt, ci, governance, branch-protection, required-checks]
owner: Alexandre Clemente
related: [011-release-integrity-check, documentation-metadata-standard]
---

# Prompt 012: make the governance checks always report

## ROLE

Act as the maintainer converting an inherited register gap into an executed decision — where most of the work is establishing which parts of the gap's premise still hold, because several of them do not.

## CONTEXT

`licorsy/.github` has escalated gap 20 from a task to a decision for this repository: *drop the `paths:` filters and scope the five workflows to `staging`/`main` so they always report, or leave them advisory and close the gap as accepted.*

**Four things about that framing were checked against the live configuration before choosing.**

1. **Six workflows carry `paths:` filters, not five** — `adapter-rules-check`, `adapter-sync-check`, `governance-scripts-tests`, `scope-consistency-check`, `state-staleness-check`, `step-reference-check`. The "five" counts the workflows that once shared an indistinguishable `check` context, which is a different set and a different defect.

2. **The job-naming half of gap 20 is already closed.** Commit `feb7c0a` (`#24`) gave each job a distinct id, which is why every one of the six reports under its own context today. What remains of gap 20 is only the filter question.

3. **None of the six is required.** Protection is by ruleset (`protect-develop`, `protect-staging`, `protect-main`), and both gates require exactly five contexts, all of them `pr-checks.yml` jobs: `pre-commit`, `promotion-source`, `ci-docs / docgov`, `ci-security / secret-scanning`, `ci-security / dependency-review`. `pr-checks.yml` carries no `paths:` filter and is scoped `branches: [develop, staging, main]`, so it always reports. `protect-develop` requires no checks at all. The offered "leave them advisory" option is therefore the status quo, not a change.

4. **The offered `staging`/`main` scoping would move detection later.** Scoping the six to the promotion branches means they stop running on the `develop` pull request — the point where the change is small, isolated, and its author is present. A failure would surface instead at the promotion gate, where it blocks a release and the fix has to land back on `develop` and be re-promoted. Dropping `paths:` is the right half of that proposal; the re-scoping is not.

**The mechanism being fixed.** A workflow that does not trigger creates no check run at all. A required check with no check run leaves the pull request waiting for a status that never arrives — indefinitely. That is why a path-filtered workflow cannot be required, and it is a different failure from a job that runs and is skipped: a skipped job reports a conclusion and satisfies the requirement. The cost of removing the filters is bounded and small: the entire governance script suite runs in **177ms**, so what is actually paid is runner start-up, in parallel, on pull requests that already start five other jobs.

**Ordering.** The ruleset change cannot come first. Adding a context to a ruleset before the workflow reports it would hang every pull request on exactly the defect described above. The workflows must be merged and reporting before any required-checks list is touched.

## TASK

1. **Remove the `paths:` filter** from all six workflows, leaving `on: pull_request:` with no filter, so each always creates its check run.

2. **Rewrite the shared comment block** carried verbatim by all six. It currently reads *"every path below is already matched by `pull_request`"* — a sentence with nothing below it once the filter is gone — and states gap 20 as open. Both must become true statements, and the block must stay identical across the six files.

3. **Record the entry** in `CHANGELOG.md`'s `[Unreleased]` section and the row in `docs/prompts/PROMPT-INDEX.md`.

## REQUIREMENTS, CONSTRAINTS AND RULES

- **[CRITICAL]** Do **not** modify any ruleset in this batch. Adding the six contexts to `protect-staging` and `protect-main` is a change to protection on `staging` and `main`, which requires explicit human permission at the moment of execution under the `git-governance` permission matrix, and must happen only after these workflows are merged and observed reporting.
- **[CRITICAL]** Do **not** scope these workflows to `staging`/`main`. Detection stays on the `develop` pull request, for the reason in CONTEXT item 4.
- **[HIGH]** Job ids stay distinct, one per workflow. That is the already-closed half of gap 20 and removing the filters must not disturb it.
- **[HIGH]** No `push:` trigger is added. `pull_request` already covers every change reaching a protected branch; a push trigger only re-runs on the merge what the pull request just ran (`licorsy/.github` gap 22).
- **[MEDIUM]** The comment block must not claim a path filter exists, and must not describe gap 20 as open once this lands.
- Adding `release-integrity.yml` to any required set is out of scope and stays wrong: it is scheduled, reports on `main`, and requiring it would block pull requests on a branch they have not reached (`docs/prompts/011-release-integrity-check.md`).

## FORMAT AND OUTPUT

Executed on branch `chore/012-always-report-governance-checks`, merged to `develop` via pull request.

Verification:

1. `node --test .github/scripts/*.test.js` passes — the scripts themselves are untouched, so this confirms no collateral damage.
2. `docgov check` exits 0.
3. On this pull request, **all six checks report**, including those whose paths the diff does not touch — the pull request changes only `.github/workflows/**`, `CHANGELOG.md` and `docs/prompts/**`, so under the old filters `adapter-rules`, `adapter-sync` and `scope-consistency` would not have run at all. Their appearance is the acceptance evidence.
4. The ruleset update is recorded as the explicitly-permissioned follow-up, not performed here.
