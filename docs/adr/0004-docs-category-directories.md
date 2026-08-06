---
title: "ADR-0004: Category directories for docs/manuals/ content"
doc_type: adr
description: "Records the decision to split docs/manuals/ by category into docs/adr/, docs/strategy/, and docs/visuals/, as an extension of ADR-0003's principles (not a supersession) - operation-manual.md itself stays a single, unfragmented file, since ADR-0003's own Alternative #2 already rejected splitting it and check-step-references.js depends on that assumption."
status: active
version: "1.6"
created: 2026-07-23
updated: 2026-08-06
language: en
id: 0004-docs-category-directories
tags: [adr, document-architecture, folder-reorg, docs-adr, docs-strategy, docs-visuals]
owner: Alexandre Clemente
related: [0003-document-architecture, operation-manual, documentation-metadata-standard]
---

# ADR-0004: Category directories for docs/manuals/ content

## Status

Accepted (2026-07-23). Amended 2026-07-31 (v1.0 → v1.1): qualified a dangling citation of prompt `064` (archived private-repo sequence) in Consequences as non-citable in this repository, per `docs/manuals/operation-manual.md` Step 12 rule 3. Amended 2026-08-03 (v1.1 → v1.2): the "all five of ADR-0003's principles" statement time-scoped, after ADR-0003 gained a sixth principle by its own amendment; the count here records what this decision did not change, and now says so (`006-absorb-local-notes-011-accepted-items`). Amended 2026-08-03 (v1.2 -> v1.3): the Decision section's `docs/strategy/` line records that `docs/strategy/go-to-market.md` is slated to leave for the Licorsy organization, and that this ADR's directory decision holds either way (`009-prepare-go-to-market-separation`). Amended 2026-08-06 (v1.3 -> v1.4): the Context section's `docs/reports/008-relatorio-melhorias-v6.md` citation qualified as archived private-repo sequence, not a citable path in this repository, matching the phrase already used elsewhere in this document. None of these amendments changes the decision itself.

## Context

`docs/reports/008-relatorio-melhorias-v6.md` (archived private-repo sequence, not a citable path in this repository), an external comparative analysis, proposed splitting `docs/manuals/` by category — ADRs, roadmap/strategy documents, and diagrams each into their own directory — for discoverability and single-responsibility placement. `ADR-0003` (Accepted, 2026-07-13) already governs this repository's document architecture, but its Alternative #2 rejected something narrower and different: physically splitting `docs/manuals/operation-manual.md` itself, specifically because `check-step-references.js` depends on it staying one file and because the benefit (SRP) was already delivered without that cost by the manual's internal Part groupings. ADR-0003 does not address category placement for *other* documents such as ADRs, the roadmap, or diagrams — extending it to cover that case, rather than treating the report's proposal as a conflict, is this ADR's purpose.

## Decision

Introduce three category directories, populated by moving existing files (history preserved via `git mv`, not copy):

- `docs/adr/` — `docs/adr/0002-audience-tier.md`, `docs/adr/0003-document-architecture.md`, this ADR. Both this template's own real decisions and, per Step 15's existing guidance, a generated project's own ADRs now live under the same `docs/adr/` naming — the "this template uses `docs/manuals/`, a generated project uses `docs/adr/`" distinction that existed before this ADR is retired.
- `docs/strategy/` — `docs/strategy/roadmap.md`, `docs/strategy/go-to-market.md`. *(2026-08-03: `docs/strategy/go-to-market.md` is slated to leave this repository for the Licorsy organization — its seven phases are the business-building lifecycle, and this template covers building the product, not building a business from it. The directory decision recorded here is unaffected either way: `docs/strategy/` exists to hold strategy-level documents, and `docs/strategy/roadmap.md` alone justifies it. The removal itself is deliberately not performed yet — see `docs/prompts/009-prepare-go-to-market-separation.md` for the sequencing and the full inbound-reference map.)*
- `docs/visuals/` — `docs/visuals/template-visual-overview.md`.

`docs/manuals/examples/adr-0001-documentation-and-governance-model.md` stays in `examples/` — it is the illustrative worked example a generated project replaces, not a live decision, so it does not move into `docs/adr/`. `docs/manuals/operation-manual.md`, `docs/manuals/agent-design-guide.md`, `docs/manuals/documentation-metadata-standard.md`, `docs/manuals/prompt-engineering-guide.md`, `docs/manuals/role-operating-guide.md`, and `docs/manuals/tool-library-catalog.md` remain in `docs/manuals/` as the operational-guide category; they are not being split further.

This ADR **extends** ADR-0003 rather than superseding it: all five of ADR-0003's principles as they stood in 2026-07 (SRP per document, Adapter pattern, Facade pattern for `docs/STATE.md`, pointer-over-copy, mechanical checks over manual discipline) remain in force unchanged. ADR-0003 has since gained a sixth principle by its own separate amendment; this ADR's decision is unaffected by it, and the count here is deliberately left as the record of what *this* decision did not change — see ADR-0003's Status for the current set. This decision is best read as principle 1 (SRP) applied one level up, at the directory instead of the single-document level. `docs/manuals/operation-manual.md`'s own physical structure is explicitly out of scope here and stays governed by ADR-0003's existing Alternative #2 reasoning: any future proposal to fragment it (for example, into per-roadmap-phase files) needs its own ADR and, more importantly, a generator/facade mechanism — not a hand-synced split — since `check-step-references.js` has no multi-file awareness today.

## Alternatives considered

1. Leave everything flat in `docs/manuals/` — rejected: the category itself (decision record vs. strategy vs. diagram vs. operating guide) is a real, useful distinction for a new reader, and moving files is a mechanically safe, `check-internal-links.js`-verified operation, unlike fragmenting a step-numbered document.
2. Treat the report's proposal as blocked by ADR-0003 and reject it outright — rejected: ADR-0003's actual Decision and Alternatives never address category placement for non-manual documents; reading it as a blanket ban on any directory change would over-extend a decision scoped to one specific document's internal structure.
3. Supersede ADR-0003 wholesale and rewrite it to include directory guidance — rejected: unnecessary churn; ADR-0003's then-five principles are unaffected by this decision, so an extension is the accurate, smaller-diff record.

## Consequences

+ ADRs, strategy documents, and diagrams are each discoverable by directory name instead of requiring a reader to already know they live inside `docs/manuals/`.
+ The "this template uses `docs/manuals/` for ADRs, a generated project uses `docs/adr/`" distinction in Step 15's tool-guidance table is retired — one convention now applies to both, simplifying that row.
+ Every cross-reference to a moved file had to be located and updated in the same change (prompt `064`, archived private-repo sequence, not a citable path in this repository); `check-internal-links.js` is the safety net for anything missed, per ADR-0003 principle 5.

- `docs/manuals/operation-manual.md`'s own token-budget-per-session concern (loading the whole file every time) is *not* addressed by this ADR — it was explicitly considered and deferred, since the fragmentation approach that would address it conflicts with the still-valid parts of ADR-0003's Alternative #2 and needs its own generator-based design first.

## Confidence

High for the directory split itself (mechanically verified, low blast radius per file). Medium for the "retire the manuals-vs-adr distinction in Step 15" consequence — it simplifies today's guidance but assumes no future reason reappears to keep this template's own ADRs somewhere a generated project's ADRs are not.
