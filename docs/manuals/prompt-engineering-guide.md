---
title: "Prompt Engineering Guide"
doc_type: manual
description: "Authoring-quality guide for the individual prompts written during roadmap work - specification anatomy, example-driven specs, labeled context blocks, priority tags, staged multi-step prompting, chain-of-thought scaffolds, targeted refinement, comment-driven development - plus a versioned starter library of reusable prompt patterns including a security-audit checklist, each with a runtime trigger mapping it to its roadmap phase."
status: active
version: "1.7"
created: 2026-07-14
updated: 2026-07-31
language: en
id: prompt-engineering-guide
tags: [prompt-engineering, prompt-patterns, authoring-quality, code-generation, security-audit, runtime-triggers]
owner: Alexandre Clemente
related: [operation-manual, roadmap]
---

# Prompt Engineering Guide

Changelog of this document:

- v1.7: Dropped `related:` entries pointing at `basic-prompt-template` and five archived prompt ids, and un-linked two `basic-prompt-template.md` references in Section 1 - `docs/prompts/` is deliberately absent from this public-mirror repository (ADR-0010), so none of them resolve.
- v1.6: doc-consistency-reviewer batch fix: Section 12's P9 trigger row still said "Phase 3 architecture spikes" after prompt-086 reworded the same claim in P9's own use-when prose, leaving the file disagreeing with itself - both now read identically (prompt-087).
- v1.5: doc-consistency-reviewer follow-up on prompt-085: P8's template hardcoded vendor names in prose instead of a `[BRACKETED]` placeholder - now `[EXTERNAL DEEP-RESEARCH TOOL, ...]`, matching P6's precedent; P9's Phase 3 claim was unanchored (`roadmap.md` Phase 3 has no spike/prototype activity) - reworded to name what actually exists; P10's use-when dropped its target-document anchor and used sprint-specific wording - both corrected (prompt-086).
- Older entries: see `git log --follow` on this file (retention per `documentation-metadata-standard.md` Section 2.1, prompt-033).

---

## 1. Purpose and scope

This guide covers **how to write a high-quality individual prompt** during roadmap work - a spec request, a code-generation ask, a debugging session, a review. It deliberately does not cover the three neighboring concerns, which stay where they are:

- Prompt **document** structure (ROLE/CONTEXT/TASK/...) - [operation-manual.md](operation-manual.md) Step 12 and basic-prompt-template.md.
- Which reasoning **technique fits which phase** (ToT/CoT/checklist/retrieval) - [operation-manual.md](operation-manual.md) Step 17.
- How agent **output is formatted** for the human - [operation-manual.md](operation-manual.md) Step 18.

Everything here is guidance, not mandate: apply judgment about how much structure a given ask deserves.

## 2. Core principles

1. **Climb the specificity ladder.** A prompt is a contract between intent and execution; ambiguity makes the output a coin flip. Contrast: *"Write a function to process data"* versus *"Write a Python function that takes a list of integers and returns the average of the positive values, ignoring zero and negatives."* Every section below is a way of adding rungs to that ladder.
2. **Context sufficient but focused.** Include the business rules, environment, and existing code the task actually depends on; leave out everything else. Too little context produces generic output; too much buries the signal.
3. **Prompts are versioned artifacts ("golden prompts").** When a prompt produces a high-quality, accepted result on a recurring kind of task, don't let it evaporate in a chat log - lift it into the pattern library (Section 9) so it compounds.

## 3. Specification anatomy for code-generation prompts

A code-generation prompt is complete when it answers all eight. Skip the checklist for trivial asks (a one-liner, a rename) - full anatomy on a trivial ask is pure ceremony.

| # | Element | Answers |
| --- | --- | --- |
| 1 | Name & signature | What is it called, what are the parameters and return type? |
| 2 | Inputs | Types, formats, valid ranges |
| 3 | Outputs | Exact shape and formatting of the result |
| 4 | Processing logic / business rules | The rules the implementation must encode, including *why* when non-obvious |
| 5 | Validation | What must be checked before processing |
| 6 | Edge cases | Empty, zero, duplicates, boundaries, oversized input |
| 7 | Error handling | Which failures raise/return what, with which messages |
| 8 | Tests & docs | How many test cases (valid, invalid, edge) and what documentation style |

## 4. Example-driven specification

Whenever behavior is easier to show than describe, give **2-3 INPUT→OUTPUT pairs, at least one of them a failure or edge case**. Examples are the cheapest disambiguation available - they pin down formatting, rounding, and error behavior that prose leaves open, and double as ready-made test cases.

```text
INPUT → OUTPUT EXAMPLES:
"1234567890"  → "(123) 456-7890"
"12345"       → ValueError: "Input must be exactly 10 digits"
"123456789a"  → ValueError: "Input must contain only digits"
```

The optional `## EXAMPLES` section of basic-prompt-template.md exists for exactly this.

## 5. Labeled context blocks and priority tags

**Context blocks.** For a prompt that needs substantial context, separate it into labeled blocks instead of one prose paragraph - the model (and the next human reading the prompt) can then weigh each kind of information correctly:

```text
=== PROJECT CONTEXT ===       what the system is and who it serves
=== TECHNICAL ENVIRONMENT === language, framework, database, versions
=== DOMAIN KNOWLEDGE ===      compliance, business invariants, vocabulary
=== TASK ===                  the specific ask
=== OUTPUT SPECIFICATIONS === shape, style, and extras of the deliverable
```

**Priority tags.** When requirements compete for attention, tag them `[CRITICAL]`, `[HIGH]`, `[MEDIUM]`, `[LOW]`. Tags tell the model what must never be traded away versus what is nice-to-have, and tell a reviewer what to check first:

```text
[CRITICAL] OUTPUT: return { isValid: boolean, cardType: string }
[HIGH]     VALIDATION: strip spaces/dashes; check length by card type
[MEDIUM]   STYLE: ES6 syntax, JSDoc comments
[LOW]      BACKGROUND: used in a checkout form
```

## 6. Staged multi-step prompting

Large asks fail as single prompts - they exceed what one generation can hold coherently. Decompose into stages, each consuming the previous stage's output:

1. **Design spec only** - "create the design specification, do not write code": signature, validation rules, error strategy, example I/O.
2. **Implement exactly to the spec** - paste the spec back; "follow it precisely."
3. **Generate tests** - happy path, edge cases, error cases, boundaries, against the implementation.
4. **Harden** - add error handling and bad-input tolerance; "preserve all existing behavior."
5. **Optimize / extend** - only now, and only if needed; "preserve all error handling."

Two rules make the chain work: **ask for a simple working version first - explicitly say "do not optimize yet"** - and never combine stages 1 and 2 in one prompt for anything non-trivial. This is the prompt-level fractal of the roadmap's own Phase 3 → 5 → 6 flow and its walking-skeleton rule ([roadmap.md](../strategy/roadmap.md), Phases 4-5): end-to-end and minimal first, layered afterward.

Two boundaries apply when the work runs inside a Spec Kit-managed phase. Feature-level staging belongs to the `/speckit.specify → plan → tasks` pipeline ([operation-manual.md](operation-manual.md) Step 15) - this chain operates *inside* one implementation task, not instead of the pipeline. And under the roadmap's Phase 5 test-first default, stages 2-3 swap: derive failing tests from the Stage 1 spec first, then implement until they pass.

## 7. Chain-of-thought scaffolds

Step 17 recommends CoT for ordered procedures; these two scaffolds make it concrete. Give the model the steps to reason through *before* it produces the answer.

**Debugging scaffold** - paste the failing code plus:

```text
Debug using step-by-step reasoning:
1. Trace execution on the failing input
2. Identify where behavior diverges from intent
3. Explain the root cause
4. Fix the code
5. Verify the fix against the original failing case and edge cases
```

**Decision scaffold** - for choosing between competing options:

```text
Use structured reasoning:
1. Requirements analysis
2. Options with strengths and weaknesses
3. Trade-offs against the requirements
4. Recommendation with justification
```

## 8. Targeted refinement and comment-driven development

**Targeted refinement over regeneration.** When iterating on something that mostly works, name the exact change and freeze the rest: *"Change the header background to #1E293B and add an Export CSV button top-right. **Keep everything else unchanged.**"* Regenerating from scratch discards accumulated fixes and re-rolls the dice on everything that was already right. For a series of related UI prompts, define a **design-system prefix** once (colors, font, radius, spacing, responsiveness) and prepend it to every prompt in the series - consistency comes from the shared prefix, not from hoping.

**Comment-driven development.** For well-understood logic, write the docstring or numbered pseudocode first and ask the model to fill in the implementation. The comments carry the full spec - parameters, business rules, examples - and the intent survives in the code as its documentation. This beats a prose prompt when the contract is crisp but the implementation is mechanical.

## 9. Starter pattern library

Reusable prompt patterns. Placeholders are `[BRACKETED]`; fill every one or delete the line. Each pattern records when it earns its keep and where it goes wrong.

### P1 - Code-generation spec (v1.0)

- **Use when:** asking for a new function/class/module of real behavior. **Not when:** the ask is trivial.
- **Pitfalls:** skipping edge cases or example I/O - the two highest-leverage lines.

```text
Create a [LANGUAGE] [function|class] named [NAME] that [PURPOSE].

INPUT: [PARAMETERS WITH TYPES AND VALID RANGES]
OUTPUT: [RETURN TYPE AND EXACT FORMAT]
BUSINESS RULES: [THE RULES THE IMPLEMENTATION MUST ENCODE]
VALIDATION: [WHAT TO CHECK, AND THE ERROR RAISED/RETURNED WHEN IT FAILS]
EDGE CASES: [EMPTY / ZERO / DUPLICATES / BOUNDARIES]

INPUT → OUTPUT EXAMPLES:
[VALID INPUT] → [OUTPUT]
[INVALID INPUT] → [ERROR]

Include [DOCSTRING STYLE] documentation and [N] test cases: [VALID / INVALID / EDGE MIX].
```

### P2 - Staged feature build (v1.1)

- **Use when:** a build is too large for one prompt but fits inside a single implementation task (one `/speckit.implement` task, or work outside the Spec Kit-managed phases). **Not when:** one function would do - use P1 - or the ask is genuinely feature-level: feature decomposition belongs to `/speckit.specify → plan → tasks` ([operation-manual.md](operation-manual.md) Step 15), not to a hand-rolled chain.
- **Pitfalls:** letting a stage silently drop earlier constraints - repeat "preserve all [error handling|behavior]" at every stage after the first. In Phase 5, run Stage 3 before Stage 2 (test-first default; see Section 6).

```text
Stage 1: Create the design specification ONLY (no code) for [FEATURE]:
         signature(s), validation rules, error-handling strategy, example inputs/outputs.
Stage 2: Here is the design specification: [PASTE]. Implement it exactly. Simple working
         version first - do not optimize yet.
Stage 3: Here is the implementation: [PASTE]. Generate comprehensive tests: happy path,
         edge cases, error cases, boundaries.
Stage 4: Add comprehensive error handling for [FAILURE MODES]. Preserve all existing behavior.
Stage 5 (optional): Optimize for [CONSTRAINT]. Preserve all error handling.
```

### P3 - Debugging chain-of-thought (v1.0)

- **Use when:** code misbehaves and the cause is not obvious. **Not when:** the fix is known - just state it.
- **Pitfalls:** omitting the failing input, which invites a plausible-sounding guess instead of a trace.

```text
This [FUNCTION/MODULE] should [INTENDED BEHAVIOR] but [ACTUAL BEHAVIOR].

Failing case: [INPUT] → expected [EXPECTED], got [ACTUAL].

Debug using step-by-step reasoning: trace execution on the failing input, identify where
behavior diverges, explain the root cause, fix the code, verify against the failing case
and edge cases.
```

### P4 - Security-audit checklist (v1.1)

- **Use when:** reviewing code before it ships (Phase 6 - Testing, or any pre-merge review of security-relevant code). **Not when:** auditing a spec's design merit - that is the adversarial review gate (Step 14 layer 2).
- **Pitfalls:** accepting findings without exploit examples - demand the concrete attack, or the finding is unverifiable.

```text
Perform a comprehensive security audit on [SCOPE]. Check for:
1. SQL injection                    7. Command injection
2. XSS vulnerabilities              8. Insecure deserialization
3. Authentication/authorization    9. Missing input validation
4. Hardcoded secrets               10. Information disclosure
5. Insecure cryptography           11. Security headers & CORS misconfiguration
6. Path traversal

For each finding provide: file and line, severity (Critical/High/Medium/Low),
a concrete exploit example, and the secure fix.
```

### P5 - Targeted refinement (v1.0)

- **Use when:** iterating on output that mostly works. **Not when:** the foundation is wrong - regenerate from a better spec instead.
- **Pitfalls:** forgetting the freeze line and getting an unwanted rewrite of everything else.

```text
In [FILE/COMPONENT], change: [EXACT CHANGES, ONE PER LINE].
Keep everything else unchanged.
```

### P6 - Observability baseline (v1.0)

- **Use when:** deploying a service to production for the first time, or adding a new deployable service (Phase 7 - Deployment). **Not when:** the service already has the baseline - add the missing piece with a P5-style targeted refinement instead.
- **Pitfalls:** logging secrets or PII - scrub before shipping logs anywhere; a health check that only proves the process is up - it should verify the service can do its job (e.g. reach its database).

```text
Add an observability baseline to [SERVICE]:

- Structured, centralized logging ([FORMAT, e.g. JSON] to [DESTINATION]), levels used consistently
- Error-handling middleware: uncaught failures are logged with context and reported, never swallowed
- Health-check endpoint at [PATH] verifying [CRITICAL DEPENDENCIES, e.g. database connectivity],
  suitable for the deploy pipeline's smoke test
- Request-ID correlation: generate/propagate [HEADER, e.g. X-Request-ID] and include it in every log line
- Integration with [ERROR-TRACKING SERVICE] (record the chosen service in an ADR)

Do not log secrets, tokens, or personal data.
```

### P7 - Incident RCA (v1.0)

- **Use when:** a production incident occurred - users or data were affected. **Not when:** the bug was caught before production - debug it with P3; no incident note needed.
- **Pitfalls:** naming people instead of causes - the note is blameless, it exists to fix the system, not to assign fault; action items that never reach the backlog - an RCA without follow-through is theater.

```text
Write a one-page blameless incident note for [INCIDENT]:

WHAT HAPPENED: [ONE-PARAGRAPH FACTUAL SUMMARY]
IMPACT: [WHO/WHAT WAS AFFECTED, FOR HOW LONG]
TIMELINE: [DETECTION → RESPONSE → RESOLUTION, WITH TIMES]
ROOT CAUSE: [USE THE P3 DEBUGGING SCAFFOLD FOR THE TECHNICAL TRACE]
ACTION ITEMS: [PREVENTION/DETECTION IMPROVEMENTS - EACH ONE ROUTED TO THE BACKLOG]

Blameless: describe causes and conditions, never individual fault.
```

### P8 - Guided external deep-research handoff (v1.0)

- **Use when:** the idea's problem, market, or prior art isn't yet validated, or genuinely needs live-web/deep-research capability the agent itself lacks (Phase 1 - Discovery). **Not when:** the agent's own knowledge is sufficient, or the idea is a narrow internal refactor with no market/prior-art dimension.
- **Pitfalls:** skipping straight to a build-vs-buy comparison without first validating the problem is real - a build-vs-buy verdict with no research behind it is a coin flip dressed as a decision.

```text
Draft a deep-research prompt for [IDEA], to hand off to
[EXTERNAL DEEP-RESEARCH TOOL, e.g. Gemini or Perplexity - the human's choice]:

RESEARCH QUESTION: [IS THIS A VALIDATED PROBLEM/MARKET GAP? WHAT ALREADY EXISTS?]
CONTEXT: [WHAT THE IDEA IS, WHO IT'S FOR, KNOWN CONSTRAINTS]
LOOK FOR: [COMPETING SOLUTIONS, INDUSTRY APPROACHES, KNOWN PITFALLS]

Brief the human (Step 18 rule 4): why this research matters now, the prompt above to
paste into their tool of choice, and what to report back - findings feed
docs/references/brainstorm.md, docs/business/market.md, and docs/references/build-vs-buy.md.
```

### P9 - Throwaway UI/UX taste prototype (v1.0)

- **Use when:** the outcome has a user-facing visual or interaction dimension where "taste" must be resolved before committing to an approach (Phase 1 - Discovery, before PRD/architecture lock-in; also usable during Phase 3 design exploration and on the fast-track path's exploratory build, `docs/strategy/roadmap.md` Section 4.3). **Not when:** the work is purely backend/architectural with no user-facing visual or interaction surface.
- **Pitfalls:** polishing a variant before the taste question is even resolved - these are disposable by design; treating the losing variants as wasted effort instead of the point of the exercise.

```text
Spike 2-3 disposable variants of [UI/INTERACTION SURFACE] to resolve [THE TASTE QUESTION].
Each variant should be quick and rough - do not polish any of them yet.

Iterate with the human in the loop until one variant is clearly preferred.
Commit only the winning variant to the codebase, as a reference for later implementation -
discard the rest.
```

### P10 - External-dependency research spike (v1.0)

- **Use when:** implementing a task that integrates an unfamiliar or complex external API/dependency (Phase 5 - Development, extends `docs/strategy/roadmap.md` Phase 5 Activity 3's existing "research spikes" task-type mention). **Not when:** the dependency is already well-understood or thoroughly documented - skip straight to implementation.
- **Pitfalls:** letting the scratch doc calcify into a permanent reference - it is expected to go stale and be discarded once the current increment or task slice closes; confusing it with `build-vs-buy.md`, which is a durable decision record, not exploration notes.

```text
Create a short-lived scratch doc caching exploration findings for [EXTERNAL API/DEPENDENCY]:
what it actually does, quirks/gotchas found, example calls that worked, open questions.

This doc is scoped to the current increment or task slice and expected to go stale - do not
treat it as a durable reference; discard it once that slice closes, distinct from
docs/references/build-vs-buy.md's durable decision record.
```

## 10. Pattern extraction and versioning

To lift a golden prompt into the library: replace the scenario-specific details with `[BRACKETED]` placeholders, record use-when / not-when / pitfalls, and add it above at v1.0. Improving an existing pattern bumps its version in place (v1.0 → v1.1) with the change noted in this document's changelog. Patterns live inline here; they graduate to their own folder only if this section outgrows the guide.

## 11. Context-file freshness

A stale context file produces **coherent but misaligned** output - the most expensive failure mode, because it looks right. When architecture, conventions, or scope shift, review `CLAUDE.md`, `AGENTS.md`, and the living documents they point to in the same change; do not let them describe the repository as it used to be.

## 12. Runtime triggers - which pattern, which phase

The library stays fast because **skip is the default**: a pattern runs only when its trigger holds at the moment of use, and a skipped trigger costs at most one line of evidence. Nothing here re-routes work the `/speckit.*` pipeline owns ([operation-manual.md](operation-manual.md) Step 15) - patterns operate inside one of its tasks, in phases outside the pipeline, or in non-Spec-Kit work.

| Pattern | Phase / step | Run when (decide at run time) | Skip when |
| --- | --- | --- | --- |
| P1 code-generation spec | Phase 5, inside one `/speckit.implement` task | The task creates a new function/class/module of non-trivial behavior | The ask is trivial (one-liner, rename) |
| P2 staged build | Phase 5 (sub-task granularity) or non-Spec-Kit work | The build exceeds one prompt but fits one implementation task | One function would do (P1), or the ask is feature-level (Spec Kit owns it) |
| P3 debugging CoT | Any phase | Behavior diverges from intent and the cause is not obvious | The fix is already known - just state it |
| P4 security audit | Phase 6 - Testing, or any pre-merge review | The increment touches authentication/authorization, input handling, secrets, payments, file or OS access, externally sourced data, or cryptography | None of those surfaces changed - record the skip in one line of the test evidence |
| P5 targeted refinement | Any phase | Iterating on output that mostly works | The foundation is wrong - regenerate from a better spec |
| P6 observability baseline | Phase 7 - Deployment | First production deploy of a service, or a new deployable service | The baseline already exists - record the skip in one line, and add missing pieces via P5 |
| P7 incident RCA | Phase 8 - Maintenance / operations | A production incident occurred - users or data were affected | The bug was caught before production - use P3 |
| P8 guided external deep-research handoff | Phase 1 - Discovery | The idea's problem/market/prior-art isn't yet validated, or needs live-web/deep-research capability the agent lacks | The agent's own knowledge is sufficient, or the idea has no market/prior-art dimension |
| P9 throwaway UI/UX taste prototype | Phase 1 - Discovery (also Phase 3 design exploration; fast-track exploratory build, roadmap.md §4.3) | The outcome has a user-facing visual/interaction dimension where taste must be resolved | The work is purely backend/architectural with no user-facing surface |
| P10 external-dependency research spike | Phase 5 - Development | The task integrates an unfamiliar or complex external API/dependency | The dependency is already well-understood or thoroughly documented |

**P4 is the trigger with teeth.** The roadmap makes it a conditional Phase 6 activity ([roadmap.md](../strategy/roadmap.md), Phase 6): when the trigger fires, run the audit and feed confirmed findings - concrete exploit example required - into the defect log; when it does not, one skip line in the test evidence and move on. Rule of thumb: **if unsure whether the increment is security-relevant, it is.** Compliance-sensitive domains (personal data, financial records, regulated industries) should treat their domain rules as an additional item 12 on the P4 checklist rather than a separate pattern.
