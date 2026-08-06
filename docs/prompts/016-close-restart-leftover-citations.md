---
title: "Prompt 016: close prompt 001's two deferred citation findings"
doc_type: prompt
description: "Closes the two doc-consistency-reviewer findings prompt 001 deliberately left for a follow-up pass. They look identical to the mechanical check and are not: one is a false claim about this repository and gets corrected, the other is a citation of a file that only ever existed in the archived private repository and gets qualified. The 567-item dead-citation backlog is explicitly out of scope."
status: archived
version: "1.2"
created: 2026-08-04
updated: 2026-08-06
language: en
id: 016-close-restart-leftover-citations
tags: [prompt, documentation, governance, citations, docs-reports]
owner: Alexandre Clemente
related: [001-restart-prompt-archive-and-source-of-truth, 004-adopt-dead-citations-shadow-rule]
---

# Prompt 016: close prompt 001's two deferred citation findings

## ROLE

Act as the maintainer closing a deferral a prior prompt made on purpose — where the work is not the editing but the sorting, because two findings that the mechanical check reports identically need opposite treatments, and applying either treatment to both would leave the repository worse than not touching it.

## CONTEXT

`docs/prompts/001-restart-prompt-archive-and-source-of-truth.md` closed with one explicit deferral:

> Out of scope, deliberately: two smaller doc-consistency-reviewer findings from the same 2026-07-31 audit (`docs/reports/ARTIFACT-NECESSITY-AUDIT.md` and `docs/reports/PROPOSAL-TRACKING.md` each citing evidence — a `CLAUDE.md` skill list, `008-relatorio-melhorias-v6.md` [archived private-repo sequence, not a citable path in this repository] — that does not exist in this repository) share the same root cause but touch different files with a different fix shape; left for a follow-up pass.

That sentence is more precise than it first reads. The two findings are not two instances of one defect. They are two different defects that the `dead_citations` rule cannot tell apart, because the rule sees only that a cited name resolves to no file.

**Finding 1 is a false claim about this repository, and is a live defect.** `docs/reports/ARTIFACT-NECESSITY-AUDIT.md` justifies two of its keep verdicts by asserting things about `CLAUDE.md` that are not true here:

- Row 4 (`docs/manuals/prompt-engineering-guide.md`): *"Cited by `CLAUDE.md`'s AI-output rules."* `CLAUDE.md` has no AI-output rules section. Verified by direct read.
- Row 14 (`docs/references/token-economy.md`): *"`README.md` and `CLAUDE.md`'s skill list both point to."* `CLAUDE.md` has no skill list. The `README.md` half is true (`README.md`, the Graphify line in Key documents); the `CLAUDE.md` half is not.

Both statements describe the `CLAUDE.md` of the archived private repository, or conflate it with an operator's own global instructions file. A reader checking either claim today finds nothing, and the verdict it supports looks unfounded even though the verdict itself is correct — the guide and the token-economy file *are* both genuinely cited, just by other files. Qualifying these as historical would be wrong: they are not records of something once true about this repository, they are inaccurate now.

**Finding 2 is a provenance gap, not a falsehood.** `docs/reports/PROPOSAL-TRACKING.md` is an index over the proposals of `docs/reports/008-relatorio-melhorias-v6.md` (archived private-repo sequence, not a citable path in this repository), a report that was never migrated and exists only there. Nothing the file says about it is untrue; the citation simply cannot resolve here and does not say why. This is the exact class `docs/prompts/003-close-restart-followon-drift.md` handled by hand in about eleven sites, and that `docs/prompts/004-adopt-dead-citations-shadow-rule.md` then made mechanical by teaching the rule to respect the phrase those sites used.

**The established treatment already exists and is in this very file.** `.docgov.config.js` configures `dead_citations` with `exempt.self_qualifying: /archived private-repo sequence/`, and `docs/reports/PROPOSAL-TRACKING.md` line 163 already carries the full phrase — *"(archived private-repo sequence, not a citable path in this repository)"* — for a citation of prompt `068`. So the fix for finding 2 is to apply, in two more places, a convention this file already practises.

**The exemption is applied per line.** `lib/exempt.js`'s `exemptLineSet` tests the regex against each line individually, so the qualifier must appear on the same line as the citation. A note near the top of a file does not cover the rest of it.

**The backlog is not this prompt's problem.** `docgov check` currently reports 567 dead citations in shadow — `docs/manuals` 156, `docs/reports` 110, `docs/strategy` 101, `docs/prompts` 91, `agents` 55. The rule also supports a per-file `historical_paths` exemption that this repository does not set, which is the plausible lever for most of that backlog. Deciding it affects five directories and is a separate decision; `004`'s own deferred question — promoting `dead_citations` from shadow to blocking — depends on it. None of that is settled here.

## TASK

1. **Correct the two false `CLAUDE.md` claims** in `docs/reports/ARTIFACT-NECESSITY-AUDIT.md` rows 4 and 14, re-pointing each to a file that genuinely cites the artifact. Verify the replacement by direct search rather than substituting one plausible-sounding citer for another.

2. **Qualify the `008-relatorio-melhorias-v6.md` (archived private-repo sequence, not a citable path in this repository) citations** with the established phrase, on the citing line itself, in all three places they appear: `docs/reports/PROPOSAL-TRACKING.md`'s frontmatter `description` and its source-report section heading, and `docs/reports/ARTIFACT-NECESSITY-AUDIT.md` row 16. Row 16 is the same citation named in `001`'s finding, in the other file, and is included for that reason.

3. **Bump both files' `version` and `updated`**, and record the entry in `CHANGELOG.md`'s `[Unreleased]` section and the row in `docs/prompts/PROMPT-INDEX.md`.

## REQUIREMENTS, CONSTRAINTS AND RULES

- **[CRITICAL]** Do not qualify the two `CLAUDE.md` claims as historical. They are wrong, not old. Marking a falsehood as a historical record preserves it and silences the check that would have caught it.
- **[CRITICAL]** Do not set `historical_paths` on `dead_citations`, do not promote the rule out of shadow, and do not sweep the wider backlog. That is `004`'s open decision and needs its own prompt.
- **[HIGH]** Use the phrase `archived private-repo sequence, not a citable path in this repository` verbatim. It is what `.docgov.config.js`'s regex matches and what seven existing sites, across six files, already carry; a paraphrase would read the same to a human and be invisible to the check.
- **[HIGH]** The qualifier goes on the same line as the citation, because `exemptLineSet` tests line by line.
- **[HIGH]** Cite files by their repository-root path, not by bare filename. `lib/rules/dead-citations.js`'s `resolveCitedPath` resolves a bare filename — anything not prefixed `./` or `../` — **relative to the repository root**, not to the citing file; sibling-relative resolution is opt-in, only for paths explicitly prefixed `./`/`../`. So a bare filename written inside `docs/prompts/` is checked against the repository root and correctly fails whenever no file of that name sits there, even when a file of that name exists under `docs/reports/`. This is a convention the rule enforces, not a defect in it, and it accounts for a meaningful share of the standing backlog: of the 139 distinct Markdown names cited across the repository, 39 name a file that does exist somewhere but is cited from the wrong directory. This prompt violated the convention in its own first draft and was corrected before merge — which is also why an illustrative placeholder filename must never be written in inline code here, since the rule cannot distinguish an example from a claim.
- **[MEDIUM]** Leave `docs/reports/ARTIFACT-NECESSITY-AUDIT.md`'s citations of `prompt-106`, `prompt-105` and `local-notes/012` (archived private-repo sequence, not a citable path in this repository) alone. They are the same provenance class and were explicitly scoped out when this batch was chosen; folding them in now would make the batch's own boundary arbitrary.
- **[MEDIUM]** Neither file carries a body changelog, so no `Changelog of this document:` entry is required or should be invented.

## FORMAT AND OUTPUT

Executed on branch `chore/016-close-restart-leftover-citations`, merged to `develop` via pull request.

Verification:

1. `docgov check` exits 0, and the shadow findings are compared **as a set, before and after** — not as a total. A net count is the wrong instrument here: this prompt is itself an in-scope file that cites the same unresolvable names it is about, so it necessarily adds findings of its own while removing others. The check is that every finding resolved is one this batch targeted, and every finding added is accounted for.
2. Each replacement citer in rows 4 and 14 is confirmed by search to actually cite the artifact.
3. `node --test .github/scripts/*.test.js` passes; no script is touched, so this confirms no collateral damage.

**Archived 2026-08-06, after a verification pass corrected what this prompt got wrong.** Criteria 2 and 3 held on first read. Criterion 1 did not: a `fix-verifier` pass found that qualifying row 16's citation had silently exempted a second, unrelated citation on the same line — a bare-filename reference to the proposal-tracking report (no directory prefix, so it never resolved) that was hidden rather than fixed, in exactly the shape this prompt's own `[CRITICAL]` rule warns against. The same pass found four numeric/technical inaccuracies this prompt's own body and `CHANGELOG.md` entry had recorded (a backwards description of how `resolveCitedPath` resolves bare filenames, an off-by-2 `docs/manuals` count, an "eight sites" claim where seven was correct, and a "three resolved" delta that wasn't three targeted sites each resolving one finding). `docs/prompts/017-fix-prompt-016-verification-findings.md` fixed all five as a named batch and is the record of what changed and how it was verified. This prompt's own criteria are true now, not because they were true at merge time.
