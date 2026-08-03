---
title: "Prompt 005: stop the commit lint from failing on GitHub-generated merge subjects"
doc_type: prompt
description: "Adds --no-merges to the Conventional Commits step in .github/workflows/pr-checks.yml, so the check stops linting the 'Merge pull request #N from ...' subjects GitHub generates itself and can never conform, and pins the flag with a facts entry. Without it the check fails by construction on every develop -> staging promotion PR, because merging into develop is what creates those commits - the exact pull request the check exists to guard. Fixed in git-governance, docs-governance, and licorsy/.github on 2026-08-01; this repository is the last copy carrying the defect."
status: deprecated
version: "1.1"
created: 2026-08-01
updated: 2026-08-03
language: en
id: 005-fix-commit-lint-merge-subjects
tags: [prompt, ci, tooling, conventional-commits, docs-governance]
owner: Alexandre Clemente
related: [004-adopt-dead-citations-shadow-rule, operation-manual]
---

# Prompt 005: stop the commit lint from failing on GitHub-generated merge subjects

## ROLE

Act as the maintainer closing the last instance of a CI defect already fixed in
three sibling repositories, where the check in question blocks precisely the
release it was written to protect.

## CONTEXT

`.github/workflows/pr-checks.yml`'s "Validate commit messages (Conventional
Commits)" step lints every commit subject in the pull request range:

```bash
git log --format=%s "${BASE_REF}..${HEAD_REF}"
```

That range includes the `Merge pull request #N from owner/branch` subjects
**GitHub writes itself** when a pull request is merged through the UI or `gh`.
Those strings can never be Conventional Commits, so `conventional-pre-commit`
fails on them by construction. Every `develop -> staging` promotion contains at
least one, because merging work into `develop` is what creates them — so the
check fails on the exact pull request it exists to guard. One such subject sits
in this repository's current promotion range today.

The local `commit-msg` hook never saw the problem: it runs on commits a human
writes, and nobody writes a merge commit by hand. Only the remote job walks a
range.

`git-governance` fixed this and recorded the reasoning in a comment;
`docs-governance` and `licorsy/.github` received the same fix on 2026-08-01,
each pinning the flag with a `facts` entry so it cannot silently regress. This
repository is the last copy. It is tracked as item 15 in `licorsy/.github`'s
known-gaps register, and was left to this repository because this
`pr-checks.yml` is not a scaffolded copy — it delegates to
`licorsy/platform-workflows` reusable workflows and has its own job structure.

## TASK

1. Add `--no-merges` to the `git log` invocation in the "Validate commit
   messages (Conventional Commits)" step, together with the comment recording
   why the flag is load-bearing rather than cosmetic.
2. Add a `facts` entry `commit-msg-lint-skips-merges` to `.docgov.config.js`
   pinning `git log --no-merges --format=%s` in that workflow, matching the
   entries `git-governance`, `docs-governance`, and `licorsy/.github` now carry.
3. Set that `facts` entry non-shadow, so it fails rather than reports. The rule
   ships shadow-on, and a pin that only reports is what allowed this defect to
   survive three scaffolded copies.
4. Update `PROMPT-INDEX.md` with this prompt, and flip it to `status: active`
   once executed.

## REQUIREMENTS, CONSTRAINTS AND RULES

- **[CRITICAL]** Verify the pin by breaking it. Remove `--no-merges`, confirm
  `docgov check` exits non-zero and names the fact, then restore. A pin accepted
  on the strength of a passing run proves nothing — an unanchored pattern in a
  sibling repository passed exactly that way earlier today and had to be
  re-anchored.
- Restore the broken state from a copy taken **before** the edit, not with
  `git checkout <file>`: that restores from the index and silently discards
  uncommitted work.
- Setting `facts` non-shadow does **not** change `dead_citations`, which stays
  shadow per prompt `004` — the two decisions are unrelated, and `004`'s
  reasoning (measure precision on a real corpus before promoting) still holds
  for a rule with a 509-finding backlog. `facts` has no backlog: it checks two
  declared values.
- Do not restructure the `pre-commit` job's `if:` conditions, the `ci-docs` /
  `ci-security` reusable-workflow calls, or the branch triggers. They are out of
  scope and each carries its own recorded rationale.

## FORMAT AND OUTPUT

Executed as an edit to `.github/workflows/pr-checks.yml` and
`.docgov.config.js`, plus this prompt and a `PROMPT-INDEX.md` row, on branch
`fix/commit-lint-merge-subjects`, merged into `develop`.

Verification: `docgov check` exits 0 with the new fact passing; the same check
exits 1 naming `commit-msg-lint-skips-merges` when `--no-merges` is removed;
`pre-commit run --all-files` passes.

## SUPERSEDED — 2026-08-03

This prompt is `deprecated`, not `archived`: TASK item 1 shipped, TASK items 2
and 3 never did, and they can no longer be executed as written.

Commit `9257c73` removed the "Validate commit messages (Conventional Commits)"
step from `.github/workflows/pr-checks.yml` outright. That removal was correct
and is independently reasoned in the workflow's own surviving comment: the step
ran only on pull requests into `staging`/`main`, and on a promotion pull request
every commit in range is already merged into `develop` — so it could report
unfixable history and nothing else, and correcting a finding meant rewriting a
protected branch. The one place it could have prevented something is a work
branch into `develop`, which is exactly where that workflow does not run, by
design. The `commit-msg` hook in `.pre-commit-config.yaml` already gates every
commit as it is written, which is both earlier and cheaper.

So the defect this prompt existed to fix is gone — resolved more completely than
this prompt proposed, by deleting the check rather than by pinning its flag. But
`--no-merges` was never the point on its own: the point was that a check which
fails by construction on the exact pull request it guards is worse than no
check. Item 15 of `licorsy/.github`'s known-gaps register, which tracked this,
is closed on that basis.

What it left behind was live and is fixed in `006-absorb-local-notes-011-accepted-items.md`:
the `facts` block reached `.docgov.config.js` with `shadow: false` and
`entries: []` — a blocking rule checking nothing, under a comment describing a
workflow step that no longer exists. Prompt 006 re-points that block at the
`promotion-source` guard, which does exist and is load-bearing, preserving this
prompt's actual intent.

The **[CRITICAL]** verify-by-breaking constraint above survives this prompt and
is carried forward verbatim into 006.
