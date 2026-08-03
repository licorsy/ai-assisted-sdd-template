---
title: "Gate Verification Template - how to apply"
doc_type: product-doc
description: "Ready-to-apply, opt-in phase-gate artifact check (verify-gate.js) for projects generated from this template: checks a phase's roadmap.md Generated-artifacts bullets for file existence, only when a bullet is a single unambiguous path. This template repository does not adopt the check for itself."
status: active
version: "1.4"
created: 2026-07-27
updated: 2026-08-03
language: en
id: gate-verification-template
tags: [phase-gate, verification, tooling, reference-template, how-to]
owner: Alexandre Clemente
related: [orchestrator, operation-manual, roadmap, report-proposal-tracking, telemetry-template, infra-templates]
diataxis: how-to
---

# Gate Verification Template - how to apply

Ready-to-apply phase-gate artifact check for a **project generated from this template** (this template repository deliberately does not run this on itself - the same boundary [`telemetry-template/README.md`](../telemetry-template/README.md) and [`infra-templates/README.md`](../infra-templates/README.md) already state for their own scope).

## What this is

`verify-gate.js` reads a generated project's own `docs/strategy/roadmap.md`, finds the `#### Phase N - Generated artifacts` section for the phase you ask about, and checks file existence for the bullets that are unambiguous. It answers one narrow question - "are the artifacts this phase said it would produce actually present on disk?" - as a supplementary, mechanical check alongside the orchestrator's existing Step 3 readiness checklist.

It resolves `R008-2.1` from `docs/reports/PROPOSAL-TRACKING.md`, previously deferred on the assumption that a new machine-readable phase→artifact manifest would be needed. That assumption turned out to be too pessimistic: `roadmap.md`'s existing "Generated artifacts" bullets are already mostly clean, single, backtick-delimited file paths - what was missing was not a manifest, but a parser honest about the bullets that aren't clean.

## What this is not

- **Not an Acceptance-criteria checker.** Each phase's separate "Acceptance criteria / Done" section is prose and judgment ("A new person can understand the project in up to 15 minutes") and is never read by this script. `GATE PASS` means "no missing unambiguous artifacts" - it does not mean "phase is done." Independent review (`docs/manuals/operation-manual.md`, Step 14) still applies in full.
- **Not a new source of truth.** There is no sidecar manifest file to keep in sync - the script parses `roadmap.md` directly, so the roadmap stays the only place phase artifacts are defined (consistent with `ADR-0003`'s pointer-over-copy principle).
- **Not automatic.** Not scaffolded by `/template-init`, not wired into CI. A human runs it by hand at a phase-exit moment, same spirit as any other manual pre-merge check.

## Prerequisites

None beyond the template itself and Node.js. No new dependency.

## How to apply

1. Copy [`verify-gate.js`](verify-gate.js) into the generated project's `scripts/` directory (or any path convenient to the project - the script only assumes it is run from the project root, where `docs/strategy/roadmap.md` lives).
2. Run it at a phase-exit moment, alongside `agents/orchestrator.md`'s Step 3 readiness checklist:

   ```bash
   node scripts/verify-gate.js --phase=1
   ```

3. Read the output. It always prints three buckets:
   - **CHECKED (exists)** - artifacts confirmed present.
   - **MISSING** - artifacts the phase's roadmap section names but that aren't on disk yet.
   - **NOT MACHINE-CHECKABLE (verify manually)** - bullets the script deliberately declines to guess at: "X or Y" alternatives, Spec-Kit-generated `[feature-name]` placeholders, wildcard globs, bullets starting with "If"/"Optional" ("If brownfield: ..."), or non-file prose (for example, "Architecture diagrams"). Check these by hand.
4. `GATE PASS` (exit code 0) means the `MISSING` bucket is empty. `GATE FAIL: [...]` (exit code 1) lists what's missing. Either way, the not-machine-checkable bucket and the Acceptance-criteria section still need a human look before the phase actually closes.

## Why some bullets aren't checked

A bullet is treated as checkable only when it is exactly one inline-code file path, with no `" or "` alternative, no `[` or `*` inside the path, and no leading "If"/"Optional" word (a condition stated up front, not a guaranteed artifact). This is deliberately conservative: `roadmap.md`'s artifact lists mix clean paths (`` `/docs/references/problem-statement.md` ``) with genuine alternatives (`` `docs/task.md` `` or `` `.specify/tasks/sprint-backlog.json` ``), Spec-Kit-generated dynamic names (`` `.specify/specs/[feature-name].md` ``), wildcard globs (`` `/docs/adr/*.md` ``), bullets that start with a condition (Phase 0's `` If brownfield: `/docs/references/existing-system-inventory.md` `` - not every project is brownfield, so this is not a guaranteed artifact), and plain prose with no path at all ("Architecture diagrams"). Guessing at any of these - picking one side of an "or", assuming a placeholder was filled in, globbing a wildcard, or assuming a leading condition holds - would risk a false `GATE PASS` or `GATE FAIL`. Reporting them as not-machine-checkable, by name, keeps the tool honest about what it actually verified. The `NOT MACHINE-CHECKABLE` bucket is this tool's instance of the convention in `docs/references/missing-data-vocabulary.md`: a thing the tool cannot determine is named as undetermined, never folded into a pass or a fail.

The check for a condition only looks at a bullet's *leading* word - a bullet whose condition appears mid-sentence is still existence-checked rather than excluded. Phase 7's `` `/docs/handbook.md` updated if needed `` is exactly this case: the bullet's own "if needed" wording is not detected or excluded by this tool, so it is existence-checked as if the file were guaranteed. In the standard, full-roadmap path this is harmless, since `handbook.md` is already a guaranteed Phase 0 artifact by the time Phase 7 is reached - but a project on a shortened roadmap path that skipped or restructured Phase 0 (`roadmap.md`, Section 4.2) could see a false `MISSING`/`GATE FAIL` on this one bullet at Phase 7. This is a narrower, more predictable rule than trying to detect a condition anywhere in the text, and it hasn't produced an incorrect result on any *other* phase's bullets - but treat a `GATE FAIL` on a mid-sentence-conditional artifact as worth a manual look before trusting it, the same as anything already in the not-machine-checkable bucket.

A checkable bullet is also only ever an *existence* check, not a content or freshness check. Bullets whose own prose says "updated" rather than "created" (for example, `` `/CHANGELOG.md` updated ``) still only confirm the file exists, not that this phase actually touched it - `GATE PASS` never implies the phase's own changes landed there.

## Non-goals (deferred, not forgotten)

A structured, hand-maintained phase→artifact manifest that could resolve the "or"/placeholder/wildcard cases more precisely was considered and rejected for this pass - it would create a second source of truth that could drift from `roadmap.md` itself. Revisit only if `roadmap.md`'s own artifact-list format changes to something more structured across the board; formalizing around today's genuinely mixed prose is not worth the maintenance burden it would add.
