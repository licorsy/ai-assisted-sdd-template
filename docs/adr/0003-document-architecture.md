---
title: "ADR-0003: Document architecture principles"
doc_type: adr
description: "Records the deliberate design patterns behind this repository's document system as accepted, reviewable decisions: one responsibility per document, thin sync-enforced Adapters as tool entry points, a generated Facade (docs/STATE.md) as the single state read, pointer-over-copy for any would-be duplication, and mechanical drift checks over manual discipline wherever a rule is checkable."
status: active
version: "1.3"
created: 2026-07-13
updated: 2026-07-29
language: en
id: 0003-document-architecture
tags: [adr, document-architecture, solid, adapter, facade, drift-detection]
owner: Alexandre Clemente
related: [operation-manual, documentation-metadata-standard, 0002-audience-tier]
---

# ADR-0003: Document architecture principles

## Status

Accepted (2026-07-13). Amended 2026-07-28 (v1.1 → v1.2): principle 4 extended to cover duplicated enumerations and counts, not just duplicated prose (`prompt-087`); principle 5's checker list gained `check-scope-consistency.js` (`prompt-088`). Amended 2026-07-29 (v1.2 → v1.3): principles 2 and 5 gained `check-adapter-rules.js`, built after "an operating rule stated only in a `.claude/` adapter, never its canonical prompt" recurred a fourth time across three review agents at once (`prompt-098`). None of these amendments change the five principles' substance.

## Context

The repository's document system had grown real architecture — thin tool adapters, a generated state snapshot, CI-enforced conventions — but the design existed only implicitly, spread across the changes that introduced each piece (prompts 023, 034, 035, 044, 045). Nothing stopped a future change from violating a pattern unreviewed, because no document named the patterns as decisions. Two documented defect classes motivated making this explicit: hand-synced duplicate text drifting (the README component table, adapter rule restatements) and numeric step references breaking after resequencing (prompt-009's fallout, fixed by prompt-027).

## Decision

Five principles govern this repository's documents; a change that violates one must supersede this ADR, not silently ignore it:

1. **One responsibility per document.** Each document answers one class of question (the roadmap: *what happens*; the orchestrator prompt: *when it advances*; the metadata standard: *how files are described*). Where one document legitimately spans concerns, it declares internal boundaries instead of splitting — the operation manual's Part I-IV groupings (Setup / Session and phase mechanics / Governance rules / Reference guidance) are this rule's intra-document expression, chosen over a physical split that would have broken dozens of step references.
2. **Adapter pattern for tool entry points.** `CLAUDE.md`, `AGENTS.md`, and `.claude/` commands/agents are thin, regeneration-safe adapters that load canonical prompts; they never become a second source of truth. Their intentionally restated rule blocks carry sync markers and are CI-enforced identical (`check-adapter-sync.js`); a `.claude/agents/`/`.claude/commands/` adapter stating an operating rule with no anchor in its canonical prompt is CI-enforced too (`check-adapter-rules.js`).
3. **Facade pattern for state.** The generated `docs/STATE.md` is the single consolidated read for "where are we?" — deterministic, produced by `generate-state.js`, staleness-checked in CI, and never hand-edited. Historical archives (`docs/prompts/`) are deliberately outside the facade.
4. **Pointer-over-copy.** When two places would state the same thing, including an enumerated list or count whose membership can grow (a scaffold table's fields, a startup-choice count, a folder tree, a CI-checks list, a component map's rows), one holds the canon and the other points at it. Applies to adapters (rule 2), Spec Kit artifacts versus `docs/` canon, the README versus the operation manual's Document map, and the role guide's checklist versus the roadmap's acceptance criteria.
5. **Mechanical checks over manual discipline.** Whenever a convention is checkable, it gets a script and a CI workflow rather than a "remember to" rule: frontmatter schema (`validate-docs-frontmatter.js`), internal links (`check-internal-links.js`), state freshness (`generate-state.js --check`), adapter sync (`check-adapter-sync.js`), step references (`check-step-references.js`), body-changelog retention (`check-changelog-retention.js`), living-doc scope consistency (`check-scope-consistency.js`), and adapter operating rules anchored in their canonical prompt (`check-adapter-rules.js`). New conventions default to shipping with their check.

## Alternatives considered

1. Leave the patterns implicit and rely on review culture — rejected: both defect classes above occurred under exactly that regime.
2. Physically split the operation manual into one file per concern for strict SRP — rejected as churn: it would break every existing "Step NN" reference for a benefit the Part groupings plus the step-reference checker deliver without renumbering.
3. Extend sync markers to every near-duplicate (for example README vs. Document map) instead of de-duplicating — rejected: marker sync needs byte-identical content, which differing link formats make brittle; pointer-over-copy is simpler and stronger.

## Consequences

+ Future changes have a named bar: a PR that hand-edits STATE.md, forks a second component table, or adds an unchecked convention is violating a recorded decision, not just taste.
+ The CI checks named above are now traceable to a principle, so removing one is visibly an architecture change.

- Every new checkable convention carries the cost of writing its check and tests up front; that is accepted as cheaper than the drift it prevents.

## Confidence

High — each principle is extracted from a mechanism already operating in this repository and from defects it demonstrably prevents; nothing here is speculative.
