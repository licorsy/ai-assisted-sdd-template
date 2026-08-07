---
title: "ADR-0003: Document architecture principles"
doc_type: adr
description: "Records the deliberate design patterns behind this repository's document system as accepted, reviewable decisions: one responsibility per document, thin sync-enforced Adapters as tool entry points, a generated Facade (docs/STATE.md) as the single state read, pointer-over-copy with one owner per cumulative fact, mechanical drift checks over manual discipline wherever a rule is checkable, and the boundary on all of it - the class of fact that only exists if it is recorded as it happens, which no later derivation can recover."
status: active
version: "1.6"
created: 2026-07-13
updated: 2026-08-07
language: en
id: 0003-document-architecture
tags: [adr, document-architecture, solid, adapter, facade, drift-detection]
owner: Alexandre Clemente
related: [operation-manual, documentation-metadata-standard, 0002-audience-tier]
---

# ADR-0003: Document architecture principles

## Status

Accepted (2026-07-13). Amended 2026-07-28 (v1.1 → v1.2): principle 4 extended to cover duplicated enumerations and counts, not just duplicated prose (`prompt-087`); principle 5's checker list gained `check-scope-consistency.js` (`prompt-088`). Amended 2026-07-29 (v1.2 → v1.3): principles 2 and 5 gained `check-adapter-rules.js`, built after "an operating rule stated only in a `.claude/` adapter, never its canonical prompt" recurred a fourth time across three review agents at once (`prompt-098` (archived private-repo sequence, not a citable path in this repository)). None of these amendments change the five principles' substance. Amended 2026-08-03 (v1.3 → v1.4): a sixth principle added — some facts are not retroactively derivable — as the declared counterweight to principle 4, whose "derive it, don't duplicate it" instinct had no stated boundary; principle 4 extended to name the cumulative-fact ownership form directly; principle 5's checker list re-pointed at `.docgov.config.js` after `validate-docs-frontmatter.js`, `check-internal-links.js` and `check-changelog-retention.js` moved into the shared engine and their workflows were retired, which the list had not reflected (`006-absorb-local-notes-011-accepted-items`). Amended 2026-08-07 (v1.5 → v1.6): principle 5's checker list gained `check-release-integrity.js` and `check-public-sanitization.js`, both of which had shipped without the list reflecting them — exactly the drift class this principle exists to name. Also added a pointer to `docs/manuals/operation-manual.md` Step 15 as the enumeration of record, so this list stays a summary rather than a second copy to keep in sync by hand.

## Context

The repository's document system had grown real architecture — thin tool adapters, a generated state snapshot, CI-enforced conventions — but the design existed only implicitly, spread across the changes that introduced each piece (prompts 023, 034, 035, 044, 045). Nothing stopped a future change from violating a pattern unreviewed, because no document named the patterns as decisions. Two documented defect classes motivated making this explicit: hand-synced duplicate text drifting (the README component table, adapter rule restatements) and numeric step references breaking after resequencing (prompt-009's fallout, fixed by prompt-027).

## Decision

Six principles govern this repository's documents; a change that violates one must supersede this ADR, not silently ignore it:

1. **One responsibility per document.** Each document answers one class of question (the roadmap: *what happens*; the orchestrator prompt: *when it advances*; the metadata standard: *how files are described*). Where one document legitimately spans concerns, it declares internal boundaries instead of splitting — the operation manual's Part I-IV groupings (Setup / Session and phase mechanics / Governance rules / Reference guidance) are this rule's intra-document expression, chosen over a physical split that would have broken dozens of step references.
2. **Adapter pattern for tool entry points.** `CLAUDE.md`, `AGENTS.md`, and `.claude/` commands/agents are thin, regeneration-safe adapters that load canonical prompts; they never become a second source of truth. Their intentionally restated rule blocks carry sync markers and are CI-enforced identical (`check-adapter-sync.js`); a `.claude/agents/`/`.claude/commands/` adapter stating an operating rule with no anchor in its canonical prompt is CI-enforced too (`check-adapter-rules.js`).
3. **Facade pattern for state.** The generated `docs/STATE.md` is the single consolidated read for "where are we?" — deterministic, produced by `generate-state.js`, staleness-checked in CI, and never hand-edited. Historical archives (`docs/prompts/`) are deliberately outside the facade.
4. **Pointer-over-copy, and one owner per cumulative fact.** When two places would state the same thing, including an enumerated list or count whose membership can grow (a scaffold table's fields, a startup-choice count, a folder tree, a CI-checks list, a component map's rows), one holds the canon and the other points at it. Applies to adapters (rule 2), Spec Kit artifacts versus `docs/` canon, the README versus the operation manual's Document map, and the role guide's checklist versus the roadmap's acceptance criteria. The class that needs this most is the **cumulative or open-ended fact** — a review-pass count, a cited file's version, a number of anything that grows — because it is correct in every copy on the day it is written and wrong in all but one of them afterwards. Such a fact is owned by exactly one document and referenced everywhere else, never restated.
5. **Mechanical checks over manual discipline.** Whenever a convention is checkable, it gets a check rather than a "remember to" rule. Frontmatter schema, internal links, body-changelog retention, the version bump, and declared-fact pins are enforced by the shared `licorsy/docs-governance` engine via `.docgov.config.js`; state freshness (`generate-state.js --check`), adapter sync (`check-adapter-sync.js`), adapter operating rules anchored in their canonical prompt (`check-adapter-rules.js`), step references (`check-step-references.js`), living-doc scope consistency (`check-scope-consistency.js`), release/tag integrity (`check-release-integrity.js`), and public-mirror sanitization (`check-public-sanitization.js`, retired — see its own header) stay as repo-local scripts, because each encodes a rule specific to this repository rather than a general documentation convention. This list is a summary, not the canon — `docs/manuals/operation-manual.md`'s Step 15 table is the enumeration of record; when the two disagree, Step 15 wins. New conventions default to shipping with their check — and when one cannot ship with one, the reason is recorded rather than left as a silent omission.
6. **Some facts are not retroactively derivable.** Principle 4's "derive it, don't duplicate it" instinct is right for anything a later reader can recompute — and wrong for the class that only exists if someone writes it down as it happens. Wall-clock duration, the reasoning behind a decision at the moment it was live, why an alternative was dropped: no later analysis recovers these, because the evidence was never in the artifacts to begin with. The obligation this creates is upstream of the recording: identify which fields are of this class **before** the generating event, not after, since afterwards the only honest options are an explicit gap or a fabrication. `docs/references/telemetry-template/` is the worked instance — it captures exactly what `git log` cannot — and `agents/orchestrator.md`'s refusal to estimate an untracked metric is the same principle enforced at the reporting end.

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
