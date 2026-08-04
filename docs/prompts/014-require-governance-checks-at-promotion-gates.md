---
title: "Prompt 014: require the six governance checks at the staging and main gates"
doc_type: prompt
description: "Adds the six governance check contexts to the `protect-staging` and `protect-main` rulesets — the explicitly-permissioned follow-up prompt 012 named and deliberately did not perform. The workflow half is already done and observed reporting; what remains is a GitHub-side ruleset change on two protected branches, which is why it needed its own prompt and its own moment of permission."
status: active
version: "1.0"
created: 2026-08-04
updated: 2026-08-04
language: en
id: 014-require-governance-checks-at-promotion-gates
tags: [prompt, ci, governance, branch-protection, required-checks]
owner: Alexandre Clemente
related: [012-always-report-governance-checks, 011-release-integrity-check, documentation-metadata-standard]
---

# Prompt 014: require the six governance checks at the promotion gates

## ROLE

Act as the maintainer closing the second half of a deliberately split change — where the first half was written to be safe on its own and the second half is the one that can hang every pull request if the precondition it depends on is not verified live before acting, rather than assumed from the prompt that promised it.

## CONTEXT

`docs/prompts/012-always-report-governance-checks.md` removed the `paths:` filters from the six governance check workflows so each always creates a check run, and closed with an explicit deferral: *"The ruleset update is recorded as the explicitly-permissioned follow-up, not performed here."* This prompt is that follow-up.

**The split was not caution for its own sake.** A required check with no check run leaves a pull request waiting on a status that never arrives, indefinitely. Requiring a context before the workflow reliably reports it does not fail loudly — it hangs the gate. So 012 deliberately shipped the reporting half first, and required that the workflows be *observed* reporting before any required-checks list is touched.

**That observation now exists.** Every one of the six reported a conclusion on `7ec5517`, the head of pull request `#32`:

| context | workflow | conclusion on `7ec5517` |
| --- | --- | --- |
| `adapter-rules` | `adapter-rules-check.yml` | success |
| `adapter-sync` | `adapter-sync-check.yml` | success |
| `test` | `governance-scripts-tests.yml` | success |
| `scope-consistency` | `scope-consistency-check.yml` | success |
| `state-staleness` | `state-staleness-check.yml` | success |
| `step-reference` | `step-reference-check.yml` | success |

The contexts are the job ids, not the workflow `name:` values, because none of the six jobs sets a `name:` and GitHub falls back to the job id. This is verified against live check runs rather than read off the YAML, because the two disagree in appearance: the workflow named *Governance scripts tests* reports as `test`.

**Three properties of the six were confirmed before choosing to require them.**

1. **No `paths:` filter** — 012's own change, without which none of them could be required at all.
2. **No `branches:` filter on the `pull_request` trigger** — so they report on pull requests targeting `staging` and `main`, not only `develop`. A workflow scoped to `develop` would create no check run at the promotion gates and would hang them, which is the same failure in a different disguise.
3. **Both rulesets carry identical rule blocks.** `protect-staging` (`20131657`) and `protect-main` (`20131659`) differ only in their `ref_name` conditions; each requires the same five `pr-checks.yml` contexts today. The edit is therefore the same edit twice, not two designs.

**On the `test` context.** Requiring a context named `test` is legal and works today, but the name is generic in a way this repository has already been bitten by: commit `feb7c0a` fixed five workflows that each called their only job `check` and consequently reported as one indistinguishable context. A future workflow adding a job called `test` would collide the same way, and the collision would surface as a required check silently satisfied by the wrong job. Renaming was considered and **declined for this batch**, deliberately: the rename changes the context string, so the ruleset could not be updated until the rename merged and reported once under its new name, which reintroduces exactly the ordering hazard this prompt exists to respect. The risk is recorded here rather than carried silently, and remains available as its own prompt.

## TASK

1. **Add the six contexts** — `adapter-rules`, `adapter-sync`, `test`, `scope-consistency`, `state-staleness`, `step-reference` — to the `required_status_checks` rule of both `protect-staging` (`20131657`) and `protect-main` (`20131659`), taking each ruleset from five required contexts to eleven.

2. **Preserve every other property of both rulesets** — the `deletion`, `non_fast_forward` and `pull_request` rules, `strict_required_status_checks_policy: false`, `do_not_enforce_on_create: false`, the empty `bypass_actors`, and each ruleset's own `ref_name` conditions.

3. **Record the entry** in `CHANGELOG.md`'s `[Unreleased]` section and the row in `docs/prompts/PROMPT-INDEX.md`.

## REQUIREMENTS, CONSTRAINTS AND RULES

- **[CRITICAL]** The ruleset change requires explicit human permission at the moment of execution, asked then and not inherited from this document's existence. The `git-governance` permission matrix draws its boundary at the *target*, not the verb: modifying the rules that govern `staging` and `main` is inside the matrix even though `gh api` is not `git push`.
- **[CRITICAL]** Verify each of the six contexts has reported a conclusion on a real pull request **before** adding it, against live check runs rather than the workflow YAML. The context is the job id when the job sets no `name:`, and the two are not interchangeable.
- **[CRITICAL]** The exact `PATCH` payload is shown to the human before it is sent, for both rulesets.
- **[HIGH]** Do not add `release-integrity` to either required set. It is scheduled, reports on `main`, and requiring it would block pull requests on a branch they have not reached — out of scope in 011 and 012, and still wrong here.
- **[HIGH]** Do not rename the `governance-scripts-tests.yml` job in this batch, for the ordering reason in CONTEXT. Record the collision risk; do not act on it here.
- **[HIGH]** Do not scope the six workflows to `staging`/`main`, and do not re-add any `paths:` filter. Detection stays on the `develop` pull request (`012`, CONTEXT item 4); either change would break the requirement being added.
- **[MEDIUM]** `protect-develop` requires no checks and stays that way. The six already run on every `develop` pull request; requiring them there is a separate decision with a different trade-off, not a free extension of this one.
- **[MEDIUM]** A `skipped` conclusion satisfies a required check — `pre-commit` and `ci-security / dependency-review` are already required and already skip on some pull requests. Do not treat a skip as a reason to exclude a context.

## FORMAT AND OUTPUT

Executed on branch `chore/014-require-governance-checks-at-promotion-gates`, merged to `develop` via pull request. The ruleset change itself is performed after that merge, against GitHub, with permission asked at that moment.

Verification:

1. `docgov check` exits 0 and `node --test .github/scripts/*.test.js` passes — no repository file outside `docs/prompts/` and `CHANGELOG.md` is touched, so this confirms no collateral damage.
2. Re-reading both rulesets after the `PATCH` shows eleven required contexts each, and every other rule and parameter byte-identical to the pre-change read.
3. The first pull request opened into `staging` after the change shows all eleven contexts as required and none of them stuck pending — the acceptance evidence, and the only one that distinguishes a working required check from a hung gate.
