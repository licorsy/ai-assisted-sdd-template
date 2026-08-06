---
title: "Prompt 015: rename the generic `test` job so its required context cannot be collided with"
doc_type: prompt
description: "Renames `governance-scripts-tests.yml`'s job id from `test` to `governance-scripts-tests`, closing the collision risk prompt 014 recorded and deliberately declined. The rename changes a context that is currently required at both promotion gates, so the ruleset swap that follows it is a separate, human-permissioned step and the ordering between them is the whole difficulty."
status: archived
version: "1.2"
created: 2026-08-04
updated: 2026-08-06
language: en
id: 015-rename-generic-test-job-context
tags: [prompt, ci, governance, branch-protection, required-checks]
owner: Alexandre Clemente
related: [014-require-governance-checks-at-promotion-gates, 012-always-report-governance-checks]
---

# Prompt 015: rename the generic `test` job context

## ROLE

Act as the maintainer closing a risk a prior prompt named, weighed, and deliberately declined to act on — where the reason for the earlier decline was ordering, not disagreement, so the work is mostly in sequencing the change rather than making it.

## CONTEXT

`docs/prompts/014-require-governance-checks-at-promotion-gates.md` made six governance checks required at both promotion gates, and recorded one thing it would not fix in the same batch:

> Requiring a context named `test` is legal and works today, but the name is generic in a way this repository has already been bitten by: commit `feb7c0a` fixed five workflows that each called their only job `check` and consequently reported as one indistinguishable context. A future workflow adding a job called `test` would collide the same way, and the collision would surface as a required check silently satisfied by the wrong job.

014 declined the rename because it changes the context string, and the ruleset could not be updated until the rename had merged and reported under its new name — the exact ordering hazard 014 existed to respect. This prompt does the rename, with that ordering handled explicitly rather than assumed away.

**Why the collision is worse than a cosmetic naming problem.** A required check is matched by context string. If a second workflow ever declares a job called `test`, both report under the same context, and the gate is satisfied by whichever reports last. The failure is silent in both directions: a green gate proves nothing about which job ran, and the governance script suite could be failing while the gate stays green. That is the same defect `feb7c0a` fixed for five jobs all named `check`, rediscovered on the one job the fix did not cover because `test` was already distinct.

**What the existing comment block gets wrong.** All six governance workflows carry an identical comment block whose third paragraph says *"the job id must stay distinct from every other workflow's in this repository."* That was the lesson of `feb7c0a` and it is true but insufficient: `test` **is** distinct today and is still the wrong name, because distinctness is a property of the present set and says nothing about what a future workflow will reach for. The block needs to ask for a name that is specific to what the job checks, which is a stronger and more durable property than distinctness.

**The ordering hazard, stated plainly.** `test` is a required context on `protect-staging` and `protect-main` right now. The moment this rename merges, nothing produces `test` any more. A required context with no check run does not fail a pull request — it hangs one, indefinitely. So between this branch merging to `develop` and the ruleset swap that follows it, **any pull request opened into `staging` or `main` would hang**. `develop` requires no checks, so this branch's own pull request is unaffected and cannot hang.

**Nothing outside the rulesets depends on the string.** `docs/manuals/operation-manual.md` Step 15 and `README.md`'s badge both reference the *workflow* (`governance-scripts-tests.yml`), never the job id. The only other occurrences are inside archived prompts `012` and `014`, which record `test` as what was true at the time and are historical records, not live configuration.

## TASK

1. **Rename the job id** in `.github/workflows/governance-scripts-tests.yml` from `test` to `governance-scripts-tests`, matching the workflow's filename and its `name:` field. One token; the id occurs once.

2. **Amend the shared comment block in all six governance workflows**, identically, so its third paragraph asks for a name specific to what the job checks rather than merely distinct, and records that `test` satisfied the old wording and was still wrong. The six blocks must remain byte-identical to each other (`012`'s constraint).

3. **Record the entry** in `CHANGELOG.md`'s `[Unreleased]` section and the row in `docs/prompts/PROMPT-INDEX.md`.

## REQUIREMENTS, CONSTRAINTS AND RULES

- **[CRITICAL]** Do **not** modify any ruleset in this batch. Swapping `test` for `governance-scripts-tests` on `protect-staging` and `protect-main` is a change to protection on those branches, requires explicit human permission at the moment of execution, and must happen only after this rename has merged and the new context has been observed reporting.
- **[CRITICAL]** Do **not** open a pull request into `staging` or `main` between this merge and the ruleset swap. That window is the hang described in CONTEXT, and it is avoided by sequencing, not by any mechanism.
- **[CRITICAL]** Verify the new context has actually reported on this branch's own pull request before the ruleset swap is attempted, against live check runs rather than the workflow YAML.
- **[HIGH]** The comment block stays byte-identical across all six workflows. Amending only the one being renamed would desync a block `012` deliberately kept uniform.
- **[HIGH]** Do **not** rewrite archived prompts `012` or `014` to say `governance-scripts-tests`. They record what was true when they executed; editing them would destroy the record of why this prompt exists.
- **[HIGH]** No other job id changes in this batch. The other five are already specific to what they check.
- **[MEDIUM]** `README.md`'s badge and `docs/manuals/operation-manual.md` Step 15 reference the workflow file, not the job id, and need no edit. Confirm this rather than assuming it.

## FORMAT AND OUTPUT

Executed on branch `chore/015-rename-generic-test-job-context`, merged to `develop` via pull request. The ruleset swap is performed afterwards, against GitHub, with permission asked at that moment.

Verification:

1. `node --test .github/scripts/*.test.js` passes and `docgov check` exits 0 — the scripts themselves are untouched, so this confirms no collateral damage.
2. On this pull request, the check reports as `governance-scripts-tests` and no check named `test` appears. That absence is as much the evidence as the presence.
3. After the ruleset swap, both gates show eleven required contexts with `governance-scripts-tests` among them and `test` gone.
4. The first pull request into `staging` after the swap shows all eleven reporting and none stuck pending.

**Executed and verified 2026-08-04.** All four criteria met. The rename merged via pull request `#36`, where the check reported as `governance-scripts-tests` and no check named `test` appeared — the absence being half the evidence. Both rulesets were then swapped and re-read through the API: eleven required contexts each, `test` absent, `governance-scripts-tests` present, every other rule and parameter matching the pre-change read. Pull request `#37` (`develop` → `staging`) supplied criterion 4 with all eleven reporting `pass`, `mergeStateStatus: CLEAN`.

**The ordering hazard was real and was closed by sequencing alone.** Between `#36` merging and the ruleset swap, both gates required a `test` context that nothing produced. Nothing mechanical prevented a promotion pull request from being opened into that window and hanging; only the sequence did. Recorded because the next person to rename a required check will face the same window, and the only protection available is knowing it is there.

**The new context was pinned to the GitHub Actions app** (`integration_id: 15368`) when it was added, matching the other five governance checks. The pinning is now uniform across all six, where before this change it covered five of them.

**One thing this prompt deliberately did not fix.** `scorecard.yml`'s job id is `analysis`, generic in the same way `test` was. It is not a required check, so it cannot be silently satisfied at a gate, and widening this batch to cover it would have meant touching a workflow with no bearing on the promotion gates. If it ever becomes required, it needs the same treatment first.
