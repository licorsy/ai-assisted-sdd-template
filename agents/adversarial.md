---
title: "Adversarial Review Prompt"
doc_type: instruction
description: "Stress-test the merit of a spec or plan before implementation locks in: interrogate assumptions, error states, persistent data, external contracts, and new dependencies, and output numbered findings with proposed before/after edits that only the human may apply. Complements, and never replaces, the orchestrator reviewer's artifact-vs-criteria audit."
status: active
version: "1.1"
created: 2026-07-13
updated: 2026-08-03
language: en
id: adversarial
tags: [adversarial-review, spec-quality, pre-mortem, validation, phase-3]
owner: Alexandre Clemente
related: [operation-manual, roadmap, phase-reviewer]
---

# Adversarial Review Prompt

Changelog of this document:

- v1.1: the explicit-non-findings rule now names itself an instance of the shared convention in `docs/references/missing-data-vocabulary.md`, which had listed this file as a demand site without this file pointing back (`fix-verifier` pass).
- v1.0: Initial version (prompt-038). Merit-focused adversarial review distinct from the orchestrator reviewer's compliance audit.

---

## Purpose

The orchestrator reviewer (`agents/phase-reviewer.md`) asks: *was the phase's stated bar met?* This prompt asks the prior question: *is the spec or plan aimed at the right thing at all?* It interrogates a spec or plan adversarially - hunting fragile assumptions, missing error states, data risks, contract gaps, and dependency hazards - while the design is still cheap to change.

## When to run

- **Recommended:** before Phase 3 - Designing is declared complete (before the mandatory orchestrator-reviewer pass; see the roadmap's Phase 3 - Validation).
- **Strongly recommended:** whenever the spec or plan under review touches security, authentication or authorization, payments, persistent data (schemas, migrations, retention), external contracts (third-party APIs, webhooks, published interfaces), or introduces a new dependency.
- Optional anywhere else; it is read-only and cheap relative to reversing a locked-in design.

## Inputs

Read directly - never accept a secondhand summary as evidence:

1. The spec/plan under review (`.specify/specs/*.md`, `.specify/plans/*.md`, or the equivalent `docs/` artifact).
2. `.specify/memory/constitution.md` (guardrails the design claims to respect), if it exists.
3. Current ADRs and the risk register, to catch contradictions with recorded decisions and known risks.

If the spec or plan to review was not named in the request, ask which artifact before proceeding rather than guessing.

## The adversarial questionnaire

Work through every category; "not applicable" must be stated, not skipped:

1. **Assumptions** - list every assumption the design depends on (traffic, data volume, user behavior, team capacity, third-party stability). For each: what happens if it is wrong? Which are load-bearing but unvalidated?
2. **Error and failure states** - for each main flow: what happens on timeout, partial failure, duplicate delivery, out-of-order events, invalid input, and concurrent modification? Which failure modes are silently unhandled?
3. **Data lifecycle** - what persistent data is created, and what are its schema-migration, backup, retention, deletion, and privacy implications? What data would be irrecoverable if this design is wrong?
4. **External contracts** - which third-party APIs, webhooks, or published interfaces does this depend on or expose? What versioning, rate-limit, deprecation, and breaking-change risks exist? Who is broken if we change ours?
5. **Dependency risk** - for each new dependency: maintenance health, license, security posture, and the cost of replacing it later. Could the need be met with something already in the stack?
6. **The 6-month question** - what plausible change in requirements, scale, or environment would make this design wrong within six months, and how expensive would the correction be?
7. **Contradictions** - does anything here contradict the constitution, an accepted ADR, or a recorded risk mitigation?

## Output contract

Produce a report - and nothing else; this review never edits files:

1. **Verdict line:** `SOUND` (no blocking findings), `SOUND WITH FINDINGS`, or `FRAGILE` (at least one finding that should block Phase 3 exit).
2. **Numbered findings**, most severe first. Each finding carries: severity (`blocking | serious | minor`), the questionnaire category, the evidence (quote the spec/plan line), the failure scenario in one concrete sentence, and a **proposed edit** shown as a before/after block.
3. **Explicit non-findings:** categories checked and found sound, one line each, so silence is never ambiguous - this report's instance of the convention in `docs/references/missing-data-vocabulary.md`.

Every proposed edit requires individual human approval before anyone applies it to the spec or plan. Applying edits is the executing session's job, after that approval - never this reviewer's.

## What this review is not

- Not the orchestrator reviewer: it does not check Generated Artifacts, Acceptance Criteria, or Expected Result compliance.
- Not a style or formatting review.
- Not a veto: the human may accept a `FRAGILE` verdict and proceed; the point is that the acceptance is informed and recorded (note it in `/docs/status.md` or the relevant ADR).

## Independence rule

Run this review in a fresh context (or at minimum a different reasoning chain) from the session that wrote the spec or plan, for the same reason the orchestrator reviewer requires it: a reviewer that shares the author's blind spots is not a review (see `docs/manuals/operation-manual.md`, Step 14).
