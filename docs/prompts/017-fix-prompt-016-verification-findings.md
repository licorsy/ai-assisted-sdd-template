---
title: "Prompt 017: fix what a verification pass found in prompt 016's own merged work"
doc_type: prompt
description: "Named batch fixing five findings a fix-verifier pass surfaced against prompt 016's merged work: one live defect (a dead citation incidentally silenced by an unrelated exemption, the exact failure mode 016's own [CRITICAL] rule warns against) and four factual inaccuracies 016 wrote into its own permanent record and CHANGELOG.md's [Unreleased] entry. Prompt 016 is archived once this batch's own verification passes."
status: active
version: "1.0"
created: 2026-08-06
updated: 2026-08-06
language: en
id: 017-fix-prompt-016-verification-findings
tags: [prompt, batch, documentation, governance, citations, lifecycle-hygiene]
owner: Alexandre Clemente
related: [016-close-restart-leftover-citations]
---

# Prompt 017: fix what a verification pass found in prompt 016's own merged work

## ROLE

Act as the maintainer running a verification pass over a prior prompt's own merged work before closing it out — where the discipline is treating a "verified" batch as not actually verified until the check itself has been checked, and separating a live mechanical defect from prose inaccuracies that never broke anything but still misrepresent what happened.

## CONTEXT

`docs/prompts/016-close-restart-leftover-citations.md` merged (`0458ea3`) and closed its own two TASK items, but was never flipped to `status: archived` — the omission this session set out to fix. Before doing that, a `fix-verifier` pass re-derived every number and re-ran every check 016's own FORMAT AND OUTPUT section names, rather than trusting the prior session's word for it. It found the mechanical criteria genuinely passing (`docgov check` exits 0, `node --test .github/scripts/*.test.js` is 43/0, the replacement citers in rows 4 and 14 do genuinely cite the artifacts), but also found one live defect and four inaccuracies that 016 wrote into permanent records.

**The live defect.** `docs/reports/ARTIFACT-NECESSITY-AUDIT.md:42` carries two citations on the same line: the `008-relatorio-melhorias-v6.md` (archived private-repo sequence, not a citable path in this repository) citation 016 correctly qualified with the established phrase, and a second, unrelated citation, in the row's Evidence column, to the proposal-tracking report by its bare filename alone (no directory prefix) — that second one does not resolve. `lib/exempt.js`'s `exemptLineSet` marks exemption **per line, not per citation**: `dead-citations.js` does `if (exempt.has(i)) return;` before checking any pattern on that line. Qualifying the first citation exempted the whole line, silently silencing the second. That second citation was already broken before 016 touched the line — a bare filename with no directory prefix resolves relative to the **repository root** (see the R2 correction below), not to the directory the citing file happens to live in, so it named a file that did not exist at the root. This is exactly the failure mode 016's own `[CRITICAL]` rule names: *"Qualifying a falsehood as a historical record preserves it and silences the check that would have caught it."* The mechanism differs — this is one citation's exemption silencing a neighbor, not a falsehood qualified as historical — but the outcome is the same: a real defect now invisible to the mechanical check, permanently, until someone edits that exact line again for an unrelated reason.

**Four inaccuracies, all in `docs/prompts/016-close-restart-leftover-citations.md`'s own body and/or the `[Unreleased]` entry it produced in `CHANGELOG.md`** (not yet tagged — `v1.2.0` is the current release, this section is still open, so correcting it is not history-rewriting):

- **R2 — the resolution mechanism is described backwards.** `docs/prompts/016-close-restart-leftover-citations.md:59` and `CHANGELOG.md:11` both say `dead-citations.js` "resolves a cited path **relative to the citing file**." The actual code (`resolveCitedPath` in `docs-governance`'s `lib/walk.js`):

  ```js
  function resolveCitedPath(citingFile, citedPath) {
    if (citedPath.startsWith('./') || citedPath.startsWith('../')) {
      return path.relative(process.cwd(), path.resolve(path.dirname(citingFile), citedPath));
    }
    return citedPath.split('/').join(path.sep);
  }
  ```

  Sibling-relative resolution applies **only** to paths explicitly prefixed `./` or `../`. Every other citation — including every bare filename, which is the case both 016 and this defect involve — resolves **relative to the repository root**. The advice both records give ("cite by repository-root path") is correct; the reason recorded for it is not, and it is now the stated rationale that would mislead the later backlog decision (`004`'s deferred shadow-to-blocking question) if left uncorrected.

- **R3 — the `docs/manuals` shadow-count is off by 2.** `docs/prompts/016-close-restart-leftover-citations.md:43` and `CHANGELOG.md:11` both state the 567-item backlog breaks down as `docs/manuals` 154. Recounted at the batch's own base commit: `docs/manuals` is **156** — the published rollup was taken non-recursively while the engine's own `walkScoped` recurses into `docs/manuals/examples/`, which holds `docs/manuals/examples/adr-0001-documentation-and-governance-model.md` among its files. `154 + 110 + 101 + 91 + 55 = 511`, which does not reconcile against the 567 total both documents also assert; `156` does, once the remaining four category directories (`adr` 28, `references` 20, `visuals` 2, root files 4) are added: `156+110+101+91+55+28+20+2+4 = 567`.

- **R4 — "eight existing sites" is not a number that matches either count.** `docs/prompts/016-close-restart-leftover-citations.md:57` justifies using the qualifier phrase verbatim by claiming "eight existing sites already carry" it. Recounted: the full phrase `archived private-repo sequence, not a citable path in this repository` appears verbatim, pre-existing (i.e. before this batch or 016 touched anything), on **seven** lines across six files (`agents/doc-consistency.md:38`, `docs/reports/PROPOSAL-TRACKING.md:163`, `docs/manuals/operation-manual.md:326,400`, `docs/manuals/tool-library-catalog.md:87`, `docs/adr/0005-public-release.md:40`, `docs/adr/0004-docs-category-directories.md:48`). Eight matches neither that count nor the broader 11-line count of everything matching the config's actual (shorter) regex, which is what `004`'s own "~11 sites" referred to.

- **R5 — "three resolved" is numerically right but misrepresents what happened.** `CHANGELOG.md:11`'s closing sentence reads "Final delta: 567 → 564 shadow findings — three resolved, none introduced," and 016's own verification criterion 1 requires "every finding resolved is one this batch targeted." Recounted: `docs/reports/PROPOSAL-TRACKING.md:4`'s frontmatter `description` edit — one of the three sites 016's TASK 2 targeted — produced **no** finding change, because `dead-citations.js`'s `FILENAME_RE` only matches a citation already wrapped in backticks, and the unbacktracked YAML description text never matched it in the first place. The third removal was not a fourth targeted site resolving; it was this batch's own live defect above — qualifying row 16 incidentally silencing the unrelated `docs/reports/PROPOSAL-TRACKING.md` citation on the same line. "None introduced" is also imprecise the same way: nothing new was flagged, but an existing, still-broken citation was hidden rather than fixed.

None of this changes what 016 got right: rows 4 and 14 genuinely were re-pointed to real citers (verified independently by search), the qualifier phrase is correctly applied at the two sites that did carry a live citation, and no forbidden action happened (`historical_paths` was not set, `dead_citations` was not promoted out of shadow, and the `prompt-106`/`prompt-105`/`local-notes/012` citations (archived private-repo sequence, not a citable path in this repository) were correctly left alone). This batch corrects the record; it does not redo the work.

## TASK

1. **Fix the live defect.** In `docs/reports/ARTIFACT-NECESSITY-AUDIT.md` row 16's Evidence column, re-cite the current bare-filename citation (no directory prefix) as `` `docs/reports/PROPOSAL-TRACKING.md` `` — the repository-root-relative form the file already uses for this exact citation elsewhere (row 17's Artifact column). This makes the citation resolve on its own merits, independent of whatever exemption applies to the rest of the line, so it stops depending on an accident for correctness.

2. **Correct the resolution-mechanism description (R2)** in `docs/prompts/016-close-restart-leftover-citations.md` (around line 59) and `CHANGELOG.md`'s `[Unreleased]` → `Fixed` entry for 016 (around line 11): replace the "relative to the citing file" claim with the accurate mechanism — bare filenames and any path not prefixed `./`/`../` resolve relative to the **repository root**; sibling-relative resolution is opt-in via an explicit `./`/`../` prefix. Keep the surrounding advice ("cite by repository-root path") and the `139`/`39` distinct-name figures, which are independently correct.

3. **Correct the `docs/manuals` count (R3)** from `154` to `156` in both `docs/prompts/016-close-restart-leftover-citations.md` (around line 43) and `CHANGELOG.md`'s `[Unreleased]` entry (around line 11).

4. **Correct the "eight existing sites" claim (R4)** in `docs/prompts/016-close-restart-leftover-citations.md` (around line 57) to state the number this batch verified: **seven**, across six files.

5. **Correct the "three resolved" composition claim (R5)** in `CHANGELOG.md`'s `[Unreleased]` entry (around line 11): state plainly that one of the three targeted sites (the frontmatter `description`) produced no mechanical finding change because the path there was never backtick-quoted, and that the third removal was the live defect this prompt fixes in item 1 — not a fourth site resolving. Reference `017` by name, the same way `015`'s `[Unreleased]` entry references its own follow-up.

6. **Bump `docs/reports/ARTIFACT-NECESSITY-AUDIT.md`'s `version`/`updated`** (content changed by item 1) and **`docs/prompts/016-close-restart-leftover-citations.md`'s `version`/`updated`** (body changed by items 2-4). Add this prompt's row to `docs/prompts/PROMPT-INDEX.md`.

## REQUIREMENTS, CONSTRAINTS AND RULES

- **[CRITICAL]** Do not touch `.docgov.config.js`. No `historical_paths`, no change to `dead_citations` scope or severity, no promotion out of shadow. `004`'s own deferred question is unaffected by this batch, same constraint 016 itself carried.
- **[CRITICAL]** `docs/prompts/016-close-restart-leftover-citations.md`'s own TASK/CONTEXT sections stay factually intact for what they claim 016 *did* — only the four inaccurate technical/numeric claims (R2-R5, items 2-4 above) are corrected. Do not rewrite 016's narrative of what it set out to do or reword its already-correct content.
- **[HIGH]** Item 1's fix must be verified by an actual `docgov check` run showing the citation resolves — not asserted from reading the code, since that is exactly how R1 slipped through the first time.
- **[HIGH]** `docs/prompts/016-close-restart-leftover-citations.md` is flipped to `status: archived` (frontmatter and `docs/prompts/PROMPT-INDEX.md`) only **after** this batch's own verification passes, in a separate follow-up commit — matching `015`'s precedent (`chore/015-rename-generic-test-job-context` merged the fix; `chore/015-archive-completed-prompt` archived it once verified). This prompt itself follows the same pattern: it stays `active` until its own verification passes, then gets archived alongside 016 in that follow-up.
- **[MEDIUM]** Neither `docs/reports/ARTIFACT-NECESSITY-AUDIT.md` nor `docs/reports/PROPOSAL-TRACKING.md` carries a body changelog (per 016's own note); none is invented here either.

## FORMAT AND OUTPUT

Executed on branch `chore/017-fix-prompt-016-verification-findings`, merged to `develop` via pull request.

Verification:

1. `docgov check` exits 0, and the specific finding `docs/reports/ARTIFACT-NECESSITY-AUDIT.md:42: cites \`PROPOSAL-TRACKING.md\`, but no file resolves it` does **not** reappear even if the line's exemption were hypothetically removed — confirmed by checking the new citation resolves to an existing file directly, not only by the check passing while exempt.
2. `node --test .github/scripts/*.test.js` passes.
3. Each of R2-R5's corrected numbers/claims is independently re-derived (not copied from this prompt) before the batch is considered closed.
4. `docs/prompts/PROMPT-INDEX.md` shows `017` at `active` until the follow-up archive commit flips both `016` and `017` to `archived` in the same edit.
