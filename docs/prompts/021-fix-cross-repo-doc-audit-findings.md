---
title: "Prompt 021: fix this repository's findings from a cross-repo licorsy documentation-consistency audit"
doc_type: prompt
description: "Closes 18 findings a docs-governance audit (git-governance/docs-consistency-auditor + fix-verifier) surfaced against this repository, alongside identical audits of the other four licorsy repositories: stale README/CHANGELOG claims about restored root files, a mechanical-vs-guidance-change distinction missing from the changelog-retention rule, a stale ADR-0003 checker enumeration, adapter blocks that had drifted from their own canonical Step 9 (dropping the changelog/version-header clause and the `.specify/` best-effort qualifier), several dangling or miscited cross-references, and a `facts` pin whose gloss had drifted stricter than the org's actual promotion-PR-open-autonomy policy."
status: archived
version: "1.0"
created: 2026-08-07
updated: 2026-08-07
language: en
id: 021-fix-cross-repo-doc-audit-findings
tags: [prompt, governance, documentation-audit, cross-repo]
owner: Alexandre Clemente
related: [documentation-metadata-standard, 0003-document-architecture, doc-consistency]
---

# Prompt 021: fix this repository's findings from a cross-repo licorsy documentation-consistency audit

## ROLE

Act as the maintainer closing this repository's share of a licorsy org-wide documentation-consistency audit — where the discipline is applying the org's own remediation norm (a fact restated in 2+ files gets a `facts` pin, not just corrected wording) and respecting this repository's own frozen-historical-record rule for archived prompts and generated facades, rather than hand-editing `docs/STATE.md` or rewriting `docs/prompts/020`'s own body.

## CONTEXT

`licorsy/.github`, `git-governance`, `docs-governance`, and `platform-workflows` were audited the same session, each on its own `fix/docs-audit-consistency` branch, each already fixed and merged to `develop`. Four cross-repo patterns recurred: the PR-open-autonomy policy change (opening a `staging`/`main` PR needs no confirmation, only merging does) hadn't fully propagated; "same ruleset" vs. "own ruleset per branch" wording drifted; docs-governance's CI integration was described as a "step" in some files and "job" in others; and scaffolded copies of shared policy text lagged their source. This repository's own findings were mostly local — a template-specific document architecture (ADR-0003), a generated `docs/STATE.md` facade, and two thin `CLAUDE.md`/`AGENTS.md` adapters kept in sync by `check-adapter-sync.js` — plus one cross-repo item: the `facts`-pinned git-governance permission gloss in both adapters.

## TASK

Fix, in one batch, the 18 findings the audit reported against this repository:

1. `README.md` (2 sites) and `CHANGELOG.md`: correct stale claims that community-health files and issue/PR templates are inherited from `licorsy/.github` rather than kept locally — all exist on disk, restored by `020` and a same-day follow-up commit `020` itself flagged as needing its own measurement.
2. `docs/manuals/documentation-metadata-standard.md` Section 2.1: add the missing distinction between a mechanical-only edit (still bumps `version`, no changelog entry required) and a guidance change (both required) — 14 of 16 changelog-carrying documents in this repository had drifted into the ambiguity this leaves unresolved.
3. `docs/adr/0003-document-architecture.md` principle 5: add the two checkers (`check-release-integrity.js`, `check-public-sanitization.js`) that shipped without the enumeration reflecting them, and point at `docs/manuals/operation-manual.md` Step 15 as the enumeration of record instead of restating it a second time.
4. `docs/manuals/operation-manual.md` Step 9: restore the changelog/version-header clause and the `.specify/` best-effort qualifier that both adapters (`CLAUDE.md`, `AGENTS.md`) had dropped while each still claimed to state "the full rule" — propagate identically to both adapters, and reconcile the wording against item 2's new mechanical-only exemption so the three documents don't state opposite rules.
5. `docs/manuals/operation-manual.md` Step 15: fix `check-scope-consistency.js`'s description (it checks CODEOWNERS only now, not `.docgov.config.js` too) and `generate-state.js`'s description (excludes `README.md`/`CLAUDE.md`/`AGENTS.md`, not only `docs/prompts/`); regenerate `docs/STATE.md` from the corrected generator.
6. `.pre-commit-config.yaml`: repoint two comments citing a nonexistent `CLAUDE.md` "Companion plugins"/full-policy section at `CONTRIBUTING.md`'s real "Local validation gate" section, then drop the citation entirely where it didn't actually support the claim being made.
7. `.github/PULL_REQUEST_TEMPLATE.md`: repoint a citation to a nonexistent `CONTRIBUTING.md` "Change-as-prompt table" at the real "Proposing a change" section plus the operation manual's Step 12a tiering criteria.
8. `docs/reports/PROPOSAL-TRACKING.md`: fix a stale "no ADR-0005 exists" evidence line (it exists now, renumbered from `0010`) and a miscited "ADR-0003 principle 3" (pointer-not-inline is principle 4).
9. `docs/prompts/PROMPT-INDEX.md`: remove three stray blank lines splitting one Markdown table into three when rendered.
10. `agents/doc-consistency.md`: replace a hand-copied, drifted `CATEGORY_DIRS` enumeration and root-files list with pointers to `doc-scope.js`'s real constants — corrected mid-batch by a fix-verifier pass after a first version silently dropped `CHANGELOG.md` from the reviewer's own scope by pointing at `SCOPE_FILES` instead of `ROOT_FILES`.
11. `.github/scripts/check-public-sanitization.js`: add a RETIRED header note mirroring `sync-to-public-mirror.sh`'s own, since its only caller is retired.
12. `AGENTS.md`, `CLAUDE.md`, `.docgov.config.js`: narrow the `facts`-pinned git-governance permission gloss from "explicit human permission required for `staging`/`main`" to "...to merge one" — opening a promotion PR is autonomous org-wide, only merging needs confirmation — updating the pin's regex in the same edit, plus a new `facts` pin for the item-4 `.specify/` best-effort clause now duplicated in three files.

## REQUIREMENTS, CONSTRAINTS AND RULES

- [CRITICAL] Never hand-edit `docs/STATE.md`; regenerate it from `.github/scripts/generate-state.js` after every content change (ADR-0003 principle 3).
- [CRITICAL] Use the Linux `node` from `nvm`, not the bare `node` on `PATH` — WSL interop resolves the latter to a Windows binary that corrupts `generate-state.js`'s emitted path separators (hit once during this batch, caught by inspecting the regenerated file, redone correctly).
- [HIGH] A fact restated in 2+ files gets a `facts` entry in `.docgov.config.js`, not just corrected wording in place (this repository's own norm, `AGENTS.md`/`CLAUDE.md` "Documentation ownership" equivalent).
- [HIGH] `docs/prompts/020` stays unedited — it is `status: archived`, frozen historical record; the correction for its stale claim belongs in the live `CHANGELOG.md` `[Unreleased]` entry instead.
- Run `.github/scripts/check-adapter-sync.js`, `check-adapter-rules.js`, `check-step-references.js`, `check-scope-consistency.js`, and `node --test .github/scripts/*.test.js` after every edit touching the adapters, `docs/manuals/operation-manual.md`, or CODEOWNERS-adjacent scope.

## FORMAT AND OUTPUT

Direct file edits plus a regenerated `docs/STATE.md`; no new documents beyond this prompt record and the two `facts` pins added to `.docgov.config.js`.

## Completed

**2026-08-07.** All 18 findings closed. Verified: `node --test .github/scripts/*.test.js` (49/49), all four local governance checkers clean, `docgov check` clean via the live `docs-governance` engine (not the stale cached plugin, which silently skips `fragment_sync`/`dead_citations` at v1.1.4 — confirmed by version-checking both), `pre-commit run --all-files` clean, and a `docgov check --base-sha` dry run against `develop`'s merge-base confirming every edited versioned document carries a proper bump. A same-session fix-verifier pass caught and corrected several regressions the first round of fixes introduced — most notably `agents/doc-consistency.md` silently narrowing its own audit scope (item 10 above) and four documents (`AGENTS.md`, `CLAUDE.md`, `docs/manuals/operation-manual.md`, `docs/prompts/PROMPT-INDEX.md`) initially edited without a version bump.
