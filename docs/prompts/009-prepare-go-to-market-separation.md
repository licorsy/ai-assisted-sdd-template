---
title: "Prompt 009: prepare the go-to-market separation without performing the removal"
doc_type: prompt
description: "Does the reversible half of moving docs/strategy/go-to-market.md out to the Licorsy organization: preserves inside roadmap.md the Activities 9-14 ownership statement that currently exists only inside the file slated for removal, amends ADR-0004 (which defines docs/strategy/ as holding both documents), and records the complete inbound-reference map including three references the source proposal's table missed and one mechanical claim it got wrong. The file itself is NOT removed - the organization side must hold the content first."
status: archived
version: "1.1"
created: 2026-08-03
updated: 2026-08-04
language: en
id: 009-prepare-go-to-market-separation
tags: [prompt, scope-boundary, go-to-market, adr, preparation]
owner: Alexandre Clemente
related: [006-absorb-local-notes-011-accepted-items, 0004-docs-category-directories, roadmap]
---

# Prompt 009: prepare the go-to-market separation, without performing it

## ROLE

Act as the maintainer executing the reversible half of a two-repository change, where the irreversible half depends on work that has not happened yet — and where verification found the proposal's stated risk pointing in the opposite direction from the real one.

## CONTEXT

The founder's boundary, stated 2026-08-03: the template covers **building the product**; **building a business from the product** is organization-level. *"isso deve manter para o produto em si, mas não para criar um negócio a partir do produto."*

The line falls in a specific place, and the half that is easy to get wrong is what **stays**. Phase 1's Activities 9 (market and competitor research), 10 (the adopt / adopt-plus-integration / build verdict), and 12 (initial value proposition), the `/docs/business/market.md` artifact, and the acceptance criterion *"Market research completed with useful references"* are **product discovery, not commerce**. Knowing what you are competing against, whether to build or adopt, and what value the thing delivers is work required to build the product at all, independent of whether anyone ever sells it. An earlier draft of the proposal moved Activity 12 and half of Activity 9 out; the founder corrected it, and the correction is the point.

What leaves is one whole document: `docs/strategy/go-to-market.md`, whose seven phases are the business-building lifecycle exactly — Positioning, Pricing & Packaging, Launch Readiness, Marketing, Sales, Customer Success & Retention, Business Retrospective.

**Three verification findings change how this is executed:**

1. **The overlap risk runs backwards from how the proposal framed it.** The proposal warned that moving the document wholesale would leave "two owners for the same fact" and said to decide who owns positioning *before* the move. But ownership is already decided, in writing — and the writing is inside the file being removed. `go-to-market.md` states that it *"references, and does not duplicate"* `roadmap.md` Phase 1 Activities 9-14, and restates the dependency inline as its Phase 1 Goal and Inputs. There is no double ownership today. **Deleting the file is what would create the vacuum**, by destroying the only statement in the repository that the roadmap owns that output.

2. **The proposal's mechanical evidence is wrong.** It offers `grep -niE "pricing|invoice|contract|revenue|margin|client|billing|monetiz|agency" docs/strategy/roadmap.md` as returning **nothing**, proving the engineering roadmap is already free of business-building content. It returns **one line** — Phase 3's adversarial-review trigger, on *"external contracts"* in the API sense. The conclusion survives; the evidence as stated does not, and anyone re-running the command as written would reasonably distrust the item.

3. **The reference table misses three live references.** All ten line numbers it gives are correct. But it omits `documentation-metadata-standard.md`'s `doc_type` enum table, which is a **second, linter-relevant** reference distinct from the scope row it does list — and `CHANGELOG.md` records that this exact table was already fixed once for drifting against Section 1, so leaving it would re-open a known defect class. It also omits a second historical `CHANGELOG.md` entry and the file's own internal self-reference.

The organization side (`licorsy/.github`) has not yet received the content. Removing the file here first would open a window in which it exists nowhere.

## TASK

1. **Preserve the boundary statement inside `roadmap.md`.** State, where Phase 1's activities are defined, that Activities 9, 10 and 12 are product discovery and belong to this roadmap — and that a commercial-lifecycle roadmap builds on their output rather than re-deriving it. This must read correctly both today, while `go-to-market.md` still exists, and after it is gone.

2. **Amend `ADR-0004`.** Its Decision section defines `docs/strategy/` as holding `roadmap.md` **and** `go-to-market.md`. Record that the second is slated to leave, why, and that the ADR's directory decision is unaffected — a governance act, not a text edit.

3. **Record the complete reference map** inside this prompt, so the eventual removal is mechanical rather than a re-hunt: the ten references the proposal listed, the three it missed, and the note that `.github/CODEOWNERS`, `step-reference-check.yml`, and `doc-scope.js` are directory-scoped and therefore unaffected.

4. **Do not remove the file, and do not touch its contents.**

### Reference map for the eventual removal

| Reference | Action at removal |
| --- | --- |
| `docs/adr/0004-docs-category-directories.md`, Decision section | Amended by this prompt; finalize when the file goes |
| `docs/manuals/operation-manual.md` — `related:` and the Document-map row | Remove or repoint |
| `docs/manuals/role-operating-guide.md` — `related:` | Remove |
| `docs/strategy/roadmap.md` — `related:` | Remove |
| `docs/manuals/documentation-metadata-standard.md` — the `docs/strategy/` scope description | Reword |
| `docs/manuals/documentation-metadata-standard.md` — the `doc_type` enum table's `instruction` row | **Missed by the source proposal.** Linter-relevant; previously fixed for this exact drift class |
| `README.md` — the key-documents bullet and the folder description | Remove or repoint at the Licorsy location |
| `docs/STATE.md` | Generated; regenerates itself |
| `CHANGELOG.md` (two entries), `docs/reports/PROPOSAL-TRACKING.md` | **Historical — leave as written**, per this repository's convention for dated records. The proposal's table named only one of the two changelog entries |
| `docs/strategy/go-to-market.md`'s own internal self-reference | **Missed by the source proposal.** Travels with the file |
| `.github/CODEOWNERS`, `.github/workflows/step-reference-check.yml`, `.github/scripts/doc-scope.js` | **No action.** Directory-scoped, not file-scoped; `roadmap.md` keeps them alive |

## REQUIREMENTS, CONSTRAINTS AND RULES

- **[CRITICAL]** Do not delete or edit the contents of `docs/strategy/go-to-market.md`. The organization side must hold the content first; a window where it exists nowhere is the one outcome this sequencing exists to avoid.
- **[CRITICAL]** Activities 9, 10 and 12, `docs/business/market.md`, and the market-research acceptance criterion **stay**. The founder corrected an earlier draft that moved them; do not re-import that draft's framing.
- **[HIGH]** Do not repeat the proposal's grep claim. If the mechanical check is cited at all, cite it accurately: one hit, on "external contracts" in the API sense.
- **[MEDIUM]** Do not rename `docs/business/`. The proposal itself records that the folder name reads slightly oddly afterwards and explicitly asks that it not be renamed — a directory rename is the cost class this batch already declined once.
- `docs/strategy/go-to-market.md` is untouched here, which also keeps it clear of `008`'s vocabulary edits; the pre-split `increment` spelling it still carries retires with the file, and `docs/manuals/glossary.md` records that exception.

## FORMAT AND OUTPUT

Executed as edits to `docs/strategy/roadmap.md` and `docs/adr/0004-docs-category-directories.md`, plus `CHANGELOG.md`, `PROMPT-INDEX.md`, and a regenerated `docs/STATE.md`. No file is removed.

Verification: the five repo-local governance scripts pass, `docgov check` exits 0, and `docs/strategy/go-to-market.md` is byte-identical to its state before this prompt.
