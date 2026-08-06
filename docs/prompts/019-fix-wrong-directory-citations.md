---
title: "Prompt 019: mechanically correct wrong-directory citations in the dead_citations backlog"
doc_type: prompt
description: "First of a named split of the 564-item dead_citations shadow backlog into its actual component categories, discovered by direct measurement rather than assumed from prior notes. Fixes only the mechanically unambiguous slice: 212 citations that name a file genuinely present in the repository, just from the wrong directory or without its repository-root prefix. The other three categories (archived-private-repo prompt-NNN references, template-target forward-references, and a CONTRIBUTING/SECURITY/CODE_OF_CONDUCT scope gap) are explicitly out of scope and get their own prompts."
status: active
version: "1.0"
created: 2026-08-06
updated: 2026-08-06
language: en
id: 019-fix-wrong-directory-citations
tags: [prompt, documentation, governance, citations, dead-citations, backlog]
owner: Alexandre Clemente
related: [004-adopt-dead-citations-shadow-rule, 016-close-restart-leftover-citations, 017-fix-prompt-016-verification-findings]
---

# Prompt 019: mechanically correct wrong-directory citations in the `dead_citations` backlog

## ROLE

Act as the maintainer doing the measurement `004`, `016` and `017` all deferred — where the discipline is refusing to treat "564 shadow findings" as one problem with one lever, because a direct count shows it is at least four unrelated defect classes wearing the same mechanical symptom.

## CONTEXT

`docs/prompts/004-adopt-dead-citations-shadow-rule.md` named a `historical_paths` exemption as "the plausible lever for most of that backlog" without measuring it. `docs/prompts/017-fix-prompt-016-verification-findings.md` corrected a related but different claim — that `docs/manuals` alone accounts for 156, not 154, of the total — without breaking the total down further. Neither measured what the 564 findings actually *are*.

**Direct measurement, done for this prompt, changes the shape of the decision.** Every current shadow finding was classified by cross-referencing its cited path against every tracked Markdown file in the repository (`git ls-files "*.md"`), matching by path *suffix* (not bare basename, which over-matches on common names like `README.md`) rather than assumed:

| Class | Count | What it is | Right treatment |
| --- | --- | --- | --- |
| Wrong-directory citation | 212 | Names a file that genuinely exists here, cited without its repository-root prefix or from the wrong directory | **This prompt**: mechanical path correction |
| Archived-private-repo `prompt-NNN` reference | 65 | Cites a prompt number from the pre-2026-07-31 private-repo archive (numbers in the 030s through 100s, archived private-repo sequence, not a citable path in this repository), which was deliberately not migrated (`docs/adr/0005-public-release.md`) | A later prompt: likely a structural exemption by numeric range, not ~65 hand-qualified sites |
| Template-target forward-reference | a large share of the remaining 287 | Cites a path a project *generated from* this template will have (a status artifact, a Spec Kit memory file, a roadmap-produced scope document), documented by `agents/init.md`'s own scaffold table and `docs/strategy/roadmap.md`'s phase descriptions — never a file this repository itself should contain | A later prompt: a new semantic exemption, not `historical_paths` (these are not historical — they are permanent, forward-looking, and correct as written) |
| Root-file scope gap | 3 declared, 0 present | `.github/scripts/doc-scope.js`'s `ROOT_FILES` array declares three community-health files this repository does not have at its root | A later prompt: either create the three files or correct the declared scope — a decision, not a mechanical fix |

**Why `historical_paths` was the wrong lever from the start.** It exempts a whole file from `dead_citations` unconditionally. Every citing file examined here — `agents/init.md`, `docs/strategy/roadmap.md`, `docs/manuals/documentation-metadata-standard.md` — mixes genuinely broken citations (this prompt's 212) with template-target forward-references (correct as written) *in the same file*, sometimes the same paragraph. A file-level exemption would silence the real defects in `agents/init.md` and `docs/strategy/roadmap.md` to accommodate the forward-references sitting next to them — the identical "exemption silences an unrelated citation on the same line/file" failure `018` reversed a scope decision over, one level up.

**212, not 229.** The number named when this prompt was scoped (see the prior `AskUserQuestion` exchange in this session) was a first-pass estimate using bare-basename matching, which over-counts: a two-segment citation naming a template's own `README.md` basename-matches four different `README.md` files repository-wide, none of them uniquely, and a naive fixer would guess wrong. Suffix-matching the full cited path against every real file's path resolved all but two ambiguities outright. The two survivors — both citing the same bare orchestrator filename with no directory prefix, in `docs/manuals/documentation-metadata-standard.md:33` and `docs/reports/PROPOSAL-TRACKING.md:64` — are resolved by reading context, not left ambiguous: both name `agents/orchestrator.md` (one lists it explicitly as `agents/`'s own content; the other discusses how that file is actually organized, matching the subagent definition's structure, not the thin `.claude/commands/orchestrator.md` entry point).

## TASK

1. **Write and run a one-off correction script** (not committed — its output is the artifact, not the script itself) that: re-derives the current `dead_citations` findings using the same engine this repository's `docgov check` uses; for each finding matching the `md-files` pattern (excluding `prompts`-pattern findings entirely), computes real-file candidates by matching the cited path as a *suffix* of every tracked Markdown file's path; where exactly one candidate exists, rewrites that specific citation (the exact backtick-quoted substring the rule matched, at its exact file:line) to the candidate's full repository-root-relative path, changing nothing else on the line.

2. **Resolve the two bare-orchestrator-filename sites by hand**, both to `agents/orchestrator.md`, per the CONTEXT section's reasoning — the script's own ambiguity report should surface exactly these two and no others.

3. **Bump `version`/`updated` on every file the script touched**, and record the entry in `CHANGELOG.md`'s `[Unreleased]` section and the row in `docs/prompts/PROMPT-INDEX.md`.

## REQUIREMENTS, CONSTRAINTS AND RULES

- **[CRITICAL]** Out of scope, explicitly: `prompts`-pattern findings, any citation with zero or more-than-one real-file candidate, `.docgov.config.js`, and any exemption or scope change. This prompt corrects citation paths only — it does not touch the rule, and does not attempt the other three classes CONTEXT names. Each gets its own prompt because each needs a different design, not because splitting is procedural preference.
- **[CRITICAL]** The correction is path-only. No cited filename, no surrounding prose, and no citation's meaning changes — verified by confirming the set of distinct basenames cited before and after this batch is identical, only path prefixes differ.
- **[HIGH]** Verify each correction resolves for real, not only that `docgov check`'s count drops — a masked or exempted line would show the same net effect without proving the fix, the exact gap `018` closed for a different rule. Spot-check a sample directly against `resolveCitedPath`.
- **[HIGH]** `docgov check`'s shadow findings are compared **as a set**, not by net count: exactly 212 named findings disappear, and nothing new appears. If the count drops by fewer than 212 or by more than 212, stop and account for the discrepancy before proceeding — do not report success on a number alone.
- **[MEDIUM]** Do not fix the `README.md`-basename or other multi-candidate citations by guessing. If the script's own candidate computation disagrees with this prompt's count of two ambiguous sites, stop and re-derive rather than forcing a resolution.

## FORMAT AND OUTPUT

Executed on branch `chore/019-fix-wrong-directory-citations`, merged to `develop` via pull request.

Verification:

1. `docgov check` exits 0; the shadow-finding set drops by exactly 212, all 212 among the citations this prompt's own script identified as unique-candidate matches plus the two hand-resolved bare-orchestrator-filename sites — none of the 65 `prompts`-pattern or the ~287 no-match findings move.
2. A sample of at least five corrected citations (including both bare-orchestrator-filename sites) is confirmed by direct `resolveCitedPath` check to resolve to an existing file, not merely absent from the `docgov check` report.
3. `node --test .github/scripts/*.test.js` passes — no script under `.github/scripts/` is touched by this batch, so this confirms no collateral damage.
4. The distinct set of cited basenames before and after this batch is identical (a diff of the two sets is empty), confirming no citation's target changed, only its path form.
