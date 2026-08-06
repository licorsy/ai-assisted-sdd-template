---
title: "Prompt 019: mechanical batch closing two of the four dead_citations backlog categories"
doc_type: prompt
description: "Named batch fusing the two mechanical slices of the 564-item dead_citations shadow backlog, discovered by direct measurement rather than assumed from prior notes: 212 wrong-directory citations (path correction) and 51 archived-private-repo prompt-NNN references (qualifier insertion). Fused into one prompt on 2026-08-06 by explicit request, after the first two of what would otherwise have been four to five separate prompts in one session. The other two categories (template-target forward-references, a CONTRIBUTING/SECURITY/CODE_OF_CONDUCT scope gap) stay separate — each needs an actual design decision, not a mechanical transform, and fusing them in would violate the same individually-minor test this fusion itself relies on."
status: archived
version: "1.2"
created: 2026-08-06
updated: 2026-08-06
language: en
id: 019-fix-wrong-directory-citations
tags: [prompt, documentation, governance, citations, dead-citations, backlog]
owner: Alexandre Clemente
related: [004-adopt-dead-citations-shadow-rule, 016-close-restart-leftover-citations, 017-fix-prompt-016-verification-findings, 018-assert-unreleased-empty-at-tag]
---

# Prompt 019: mechanical batch closing two of the four `dead_citations` backlog categories

## ROLE

Act as the maintainer doing the measurement `004`, `016` and `017` all deferred — where the discipline is refusing to treat "564 shadow findings" as one problem with one lever, because a direct count shows it is at least four unrelated defect classes wearing the same mechanical symptom, and then refusing to let "reduce prompt count" collapse two of those classes into one edit without first checking whether doing so would reintroduce the exact masking bug `018` just closed.

## CONTEXT

`docs/prompts/004-adopt-dead-citations-shadow-rule.md` named a `historical_paths` exemption as "the plausible lever for most of that backlog" without measuring it. `docs/prompts/017-fix-prompt-016-verification-findings.md` corrected a related but different claim — that `docs/manuals` alone accounts for 156, not 154, of the total — without breaking the total down further. Neither measured what the 564 findings actually *are*.

**Direct measurement changes the shape of the decision.** Every current shadow finding was classified by cross-referencing its cited path against every tracked Markdown file in the repository (`git ls-files "*.md"`), matching by path *suffix* (not bare basename, which over-matches on common names like a template's own `README.md`) rather than assumed:

| Class | Count | What it is | Right treatment |
| --- | --- | --- | --- |
| Wrong-directory citation | 212 | Names a file that genuinely exists here, cited without its repository-root prefix or from the wrong directory | **This prompt, TASK 1**: mechanical path correction |
| Archived-private-repo `prompt-NNN` reference | 65 (51 safely fixable now, 14 deferred — see below) | Cites a prompt number from the pre-2026-07-31 private-repo archive (numbers in the 030s through 100s, archived private-repo sequence, not a citable path in this repository), which was deliberately not migrated (`docs/adr/0005-public-release.md`) | **This prompt, TASK 2**: qualifier insertion, where safe |
| Template-target forward-reference | a large share of the remaining ~270 | Cites a path a project *generated from* this template will have (a status artifact, a Spec Kit memory file, a roadmap-produced scope document), documented by `agents/init.md`'s own scaffold table and `docs/strategy/roadmap.md`'s phase descriptions — never a file this repository itself should contain | A later prompt: a new semantic exemption, not `historical_paths` (these are not historical — they are permanent, forward-looking, and correct as written) |
| Root-file scope gap | 3 declared, 0 present | `.github/scripts/doc-scope.js`'s `ROOT_FILES` array declares three community-health files this repository does not have at its root | A later prompt: either create the three files or correct the declared scope — a decision, not a mechanical fix |

**Why this prompt fuses the first two categories and not all four.** Both are pure mechanical transforms with an already-established correct output shape and no open design question: TASK 1 rewrites a citation to a path that is verifiably, uniquely correct; TASK 2 applies a qualifier phrase `.docgov.config.js` already recognizes and eight-plus sites already carry, verbatim. Neither requires inventing anything. The other two categories both need a real decision — a new exemption predicate that does not exist yet, or a choice about whether to create three specific files — and fusing a decision into a mechanical batch is exactly the "individually minor" test `docs/manuals/operation-manual.md` Step 12 rule 9 exists to enforce. This split was proposed and confirmed explicitly in this session before drafting.

**Why `historical_paths` was the wrong lever for either category.** It exempts a whole file unconditionally. Every citing file examined here — `agents/init.md`, `docs/strategy/roadmap.md`, `docs/manuals/documentation-metadata-standard.md`, `docs/reports/PROPOSAL-TRACKING.md` — mixes several of these categories *in the same file*, sometimes the same line. A file-level exemption would silence real defects to accommodate whatever else happens to share the file.

**212, not 229; 51, not 65 — both counts changed under closer measurement, in opposite directions for a related reason.** The wrong-directory count first named in this session (229) used bare-basename matching, which over-counts: a two-segment citation naming a template's own `README.md` basename-matches four different `README.md` files repository-wide, none of them uniquely. Suffix-matching the full cited path resolved all but two ambiguities outright; the two survivors — both citing the same bare orchestrator filename with no directory prefix, in `docs/manuals/documentation-metadata-standard.md:33` and `docs/reports/PROPOSAL-TRACKING.md:64` — are resolved by reading context, not left ambiguous: both name `agents/orchestrator.md` (one lists it explicitly as `agents/`'s own content; the other discusses how that file is actually organized, matching the subagent definition's structure, not the thin `.claude/commands/orchestrator.md` entry point). That gives **212** confirmed unique corrections.

The `prompt-NNN` count runs the other way: of 65 total citations (32 distinct numbers, all in the 33-109 range — none overlapping this repository's own real 001-019, so all 65 are unambiguously archived-private-repo references, not typos), **11 lines carry a `prompt-NNN` citation on the same line as at least one other, still-unresolved citation** even after TASK 1's 212 corrections are applied — 14 `prompt-NNN` instances across those 11 lines. `lib/exempt.js`'s `exemptLineSet` exempts by line, not by citation. Qualifying any of those 11 lines to fix its `prompt-NNN` citation would silently exempt the *other*, unrelated, still-broken citation sitting on the same line — the identical failure `018` reversed a scope decision over, one level up, and the same mistake this session's own draft of this prompt made three separate times while describing it (caught each time by running `docgov check` for real, not by inspection). Those 11 lines are named explicitly in TASK 2 and are **not** touched here; their `prompt-NNN` citations stay findings, on purpose, until whatever later prompt resolves the other citation sharing their line. That leaves **51** safe to qualify now.

## TASK

1. **Write and run a one-off correction script** (not committed — its output is the artifact, not the script itself) that: re-derives the current `dead_citations` findings using the same engine this repository's `docgov check` uses; for each finding matching the `md-files` pattern, computes real-file candidates by matching the cited path as a *suffix* of every tracked Markdown file's path; where exactly one candidate exists, rewrites that specific citation (the exact backtick-quoted substring the rule matched, at its exact file:line) to the candidate's full repository-root-relative path, changing nothing else on the line.

2. **Resolve the two bare-orchestrator-filename sites by hand**, both to `agents/orchestrator.md`, per the CONTEXT section's reasoning — the script's own ambiguity report should surface exactly these two and no others.

3. **In the same or a second script pass, insert the established qualifier phrase** — `(archived private-repo sequence, not a citable path in this repository)`, verbatim, on the citing line — for every `prompts`-pattern finding whose line, *after* steps 1-2 are applied, carries no other unresolved `dead_citations` finding. Skip every line that still has another unresolved citation on it after steps 1-2; do not qualify those. Report the skipped lines explicitly (file:line and what else is still unresolved there) rather than dropping them silently.

4. **Bump `version`/`updated` on every file either script pass touched**, and record the entry in `CHANGELOG.md`'s `[Unreleased]` section and the row in `docs/prompts/PROMPT-INDEX.md`. The row and the CHANGELOG entry both name the 14 deferred `prompt-NNN` instances explicitly, so they are not lost between this prompt and whichever later one handles the categories sharing their lines.

## REQUIREMENTS, CONSTRAINTS AND RULES

- **[CRITICAL]** Never insert the qualifier phrase on a line that still has any other unresolved `dead_citations` finding after TASK 1-2. This is the one rule the whole fusion depends on — violating it reintroduces the exact masking bug `018` exists to prevent, inside the very prompt citing `018` as precedent.
- **[CRITICAL]** Out of scope, explicitly: the template-target forward-reference category, the root-file scope gap, `.docgov.config.js` itself, and any promotion of `dead_citations` out of shadow. Each needs its own prompt, per CONTEXT.
- **[CRITICAL]** TASK 1's correction is path-only — no cited filename, no surrounding prose, and no citation's meaning changes. TASK 3's qualifier insertion adds text; it does not remove, reword, or relocate anything already on the line.
- **[HIGH]** Verify every correction and every qualifier insertion resolves for real, not only that `docgov check`'s count drops — a masked or exempted line proves nothing on its own, which is the whole reason TASK 3 exists as a separate, narrower step from TASK 1.
- **[HIGH]** `docgov check`'s shadow findings are compared **as a set**, not by net count: exactly 212 wrong-directory findings and exactly 51 `prompts`-pattern findings disappear, nothing else moves, and nothing new appears.
- **[MEDIUM]** Do not fix the `README.md`-basename or other multi-candidate citations by guessing, and do not extend TASK 3's qualifier to any of the 11 deferred lines even if a plausible-looking fix for the co-located citation occurs while working — that fix, if it exists, belongs to whichever prompt owns that citation's category.

## FORMAT AND OUTPUT

Executed on branch `chore/019-020-fix-citation-backlog-mechanical-batch`, merged to `develop` via pull request.

Verification:

1. `docgov check` exits 0; the shadow-finding set drops by exactly 212 + 51 = 263, all of them among the citations this prompt's own scripts identified as unique-candidate matches, the two hand-resolved bare-orchestrator-filename sites, or the qualifier-safe `prompts`-pattern sites — none of the 14 deferred `prompt-NNN` instances or the remaining no-match findings move.
2. A sample of at least five TASK-1 corrections (including both bare-orchestrator-filename sites) and at least five TASK-3 qualifier insertions is confirmed by direct `resolveCitedPath` / `exemptLineSet` check to actually resolve or actually exempt, not merely absent from the `docgov check` report.
3. `node --test .github/scripts/*.test.js` passes — no script under `.github/scripts/` is touched by this batch, so this confirms no collateral damage.
4. The distinct set of cited basenames before and after TASK 1 is identical (a diff of the two sets is empty), confirming no citation's target changed, only its path form. The 11 deferred lines are listed by file:line in the merged PR description and in `CHANGELOG.md`, not only in this prompt file.

**Executed and verified 2026-08-06, all four criteria met exactly.** `docgov check`'s shadow-finding set dropped from 564 to 301 — a **set** diff, not a net count: 0 new findings, exactly 263 removed, split precisely 212 `md-files` + 51 `prompts`, matching this prompt's own numbers exactly. Direct spot-checks against `resolveCitedPath` confirmed five TASK-1 corrections resolve (including both bare-orchestrator-filename sites, both to `agents/orchestrator.md`) and `exemptLineSet` confirmed a TASK-3-qualified line (`docs/reports/PROPOSAL-TRACKING.md:41`) is now exempt while an adjacent deferred line (`docs/reports/PROPOSAL-TRACKING.md:42`) correctly is **not** — its prompt-067 citation still reports as a finding, unmasked, alongside the still-unresolved citation of a never-built fast-track agent file sharing its line. `node --test .github/scripts/*.test.js`: 49/49. `docs/STATE.md` regenerated and current.

**One real bug caught and fixed before this batch touched a single file: the correction script's own "does this already resolve" check stripped a leading `/` before testing existence**, silently treating every leading-slash citation (a leading-slash `CHANGELOG.md` reference was the case caught, in `agents/phase-reviewer.md`) as already-fine and skipping it — the real `resolveCitedPath` never strips that slash, which is exactly why `dead_citations` flags those citations at all. Caught by cross-checking the script's own file-touched list against an independent per-file count derived straight from the real 564-item backlog, not by reading the script a second time.

**The 14 deferred `prompt-NNN` instances, across 11 lines, named explicitly** (per REQUIREMENTS, so they are not lost between this prompt and whichever later one resolves the categories sharing their lines): `agents/init.md:22` (2, sharing the line with two template-target forward-references), `docs/prompts/001-restart-prompt-archive-and-source-of-truth.md:28` (1, sharing with an illustrative placeholder filename), `docs/prompts/004-adopt-dead-citations-shadow-rule.md:24` (1, same placeholder pattern), and ten more in `docs/reports/PROPOSAL-TRACKING.md` (lines 32, 42, 45, 111, 122, 171 with one instance each, and lines 131, 132 with two each — 10 instances across those eight lines), each sharing its line with a citation of a proposed-but-never-built artifact (an unbuilt agent file, a community-health file, an issue-template file) that this batch does not attempt to categorize or fix.
