---
title: "Prompt 007: give the corpus a shared vocabulary for missing and degraded data"
doc_type: prompt
description: "Adds docs/references/missing-data-vocabulary.md - a short reference adapting the UK Government Analysis Function's published shorthand for absent data ([x] not available, [z] not applicable, [c] confidential, and the rest), the rule against ambiguous 'NA', legend-above-the-table placement, and the never-join-across-a-gap rule for charts. The demand for honest degraded states is already stated in four places in this repository, each inventing its own local token; the vocabulary that would let them agree does not exist. Also fixes generate-state.js, which emits docs/STATE.md's own legend below the table - the exact placement the adopted guidance argues against."
status: archived
version: "1.1"
created: 2026-08-03
updated: 2026-08-04
language: en
id: 007-missing-data-vocabulary
tags: [prompt, conventions, data-honesty, accessibility, generate-state]
owner: Alexandre Clemente
related: [006-absorb-local-notes-011-accepted-items, documentation-metadata-standard]
---

# Prompt 007: give the corpus a shared vocabulary for missing and degraded data

## ROLE

Act as the maintainer adopting an external, publicly-published convention into this repository — with the specific obligation that comes with borrowing someone else's work: verify it at the source rather than through the intermediary that recommended it, attribute it, and do not reproduce more of it than the point requires.

## CONTEXT

This repository already demands honest degraded states in several places, each inventing its own token for the job. The new reference owns the enumeration; the sites, at the time of writing:

- `agents/orchestrator.md`'s phase-exit brief: *"not tracked (telemetry not adopted)"*, *"not tracked (no cost data collected)"*, and **"Never estimate any of the three."**
- The same file, one field later: *write `"none"` explicitly when there isn't one - never omit the field.*
- `.github/scripts/generate-state.js` renders every absent frontmatter field as `—` and explains it in a trailing legend.
- `docs/references/gate-verification-template/`: bullets the script declines to guess at are reported as `NOT MACHINE-CHECKABLE`, by name, because *"reporting them as not-machine-checkable, by name, keeps the tool honest about what it actually verified."*

Two review agents carry the same principle in a fifth form — `agents/adversarial.md` and `agents/doc-consistency.md` both require **explicit non-findings**, *"so silence is never ambiguous."*

So the *principle* is settled and stated repeatedly. What is missing is the shared vocabulary that would let those five places agree, and the two rendering rules that go with it. A project generated from this template derives data from incomplete sources and must render the gaps; today it has to invent a token per surface, exactly as this repository did five times.

The convention adopted here is the UK Government Analysis Function's published shorthand for tables and charts. **Verified at the source for this prompt**, not taken on the recommending note's word:

- The symbol list is real and is larger than the nine symbols the recommendation carried — it also includes `[er]`, `[low]`, `[high]`, `[w]`, `[ns]`, `[s]`, `[ss]`, `[sss]`.
- The guidance against `NA` is explicit: *"We do not recommend using 'NA' to describe cells with no data. This is because this shorthand is ambiguous."*
- Legend placement is **above** the table, and the stated reason is assistive-technology navigation order.
- For charts: *"If you do use a line, do not join the points either side of the missing data point, even if the line is dotted or dashed."* — because *"joining points implies we know something about the data."*

**Licence status: `unverified`.** Neither fetched page carried an explicit Open Government Licence or copyright statement. `agents/tool-discovery.md`'s rule applies — record `unverified` rather than a guess — so this prompt paraphrases and attributes with a live URL, and keeps direct quotation to the two sentences that carry the actual reasoning.

The repository currently violates the placement rule it is adopting: `generate-state.js` writes `docs/STATE.md`'s legend as the file's last line, below the table it explains.

## TASK

1. **Create `docs/references/missing-data-vocabulary.md`.** Short. The symbol set, the `NA` prohibition, legend-above-the-table, and never-join-across-a-gap. Attribute the source with its URL and record the licence as `unverified`. State which symbols this repository actually expects to use versus which exist in the full external list — adopting a vocabulary is not the same as claiming to use all of it.

2. **Fix `generate-state.js` so the legend precedes the table**, and regenerate `docs/STATE.md`. Update the script's unit test if it asserts the current ordering.

3. **Point the four existing demand sites at the vocabulary** rather than rewriting their tokens. `agents/orchestrator.md`'s *"not tracked (…)"* strings are load-bearing prose in a brief format and are not being replaced; the reference is what makes them a convention instead of five independent inventions.

## REQUIREMENTS, CONSTRAINTS AND RULES

- **[CRITICAL]** Do not reproduce the source guidance at length. Two attributed sentences plus a paraphrased symbol table is the ceiling while the licence reads `unverified`.
- **[HIGH]** Do not retrofit the vocabulary onto existing artifacts in this prompt. The rule applies to what gets written next; rewriting `docs/STATE.md`'s `—` into `[x]` would churn a generated file for no gain, and the em dash is already unambiguous *because* it carries a legend.
- **[MEDIUM]** `ADR-0003` principle 5 says a new convention defaults to shipping with its check. This one ships without one, and the reason is recorded rather than omitted: the rule governs artifacts a generated project renders, not files in this repository, so there is nothing here for a checker to scan.
- The new file is a `product-doc` under `docs/references/`, carrying the full frontmatter schema, and appears in the regenerated `docs/STATE.md`.

## FORMAT AND OUTPUT

Executed as a new `docs/references/missing-data-vocabulary.md`, an edit to `.github/scripts/generate-state.js` (its test asserts no ordering, so none was needed), a pointer added at each of the four demand sites, plus `CHANGELOG.md` and a regenerated `docs/STATE.md`.

Verification: `node --test .github/scripts/*.test.js` passes, `node .github/scripts/generate-state.js --check` passes, and `docgov check` exits 0.
