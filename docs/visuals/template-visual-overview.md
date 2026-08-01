---
title: "Template Visual Overview"
doc_type: manual
description: "Six Mermaid diagrams orienting a new reader in the template's architecture - document map, roadmap state machine, phase-execution sequence, prompt-lifecycle workflow, Spec Kit artifact flow, and the runtime-trigger decision flow. Diagrams orient, prose governs: every diagram links to the canonical document that owns its content."
status: active
version: "1.11"
created: 2026-07-14
updated: 2026-07-31
language: en
id: template-visual-overview
tags: [visual-documentation, mermaid, diagrams, onboarding, overview]
owner: Alexandre Clemente
related: [operation-manual, roadmap, orchestrator, prompt-engineering-guide]
---

# Template Visual Overview

Changelog of this document:

- v1.11: Removed the v1.9 entry below (retention rule: removal, not reword, per `documentation-metadata-standard.md` Section 2.1) - it stated `docs/prompts/` was "deliberately absent from this public-mirror repository," which the v1.10 entry immediately above it already contradicted once `docs/prompts/` was restarted (`docs/prompts/003-close-restart-followon-drift.md`).
- v1.10: Section 4's prompt-lifecycle diagram first node updated from `docs/prompts/NNN-prompt-slug.md` to `docs/prompts/NNN-slug.md`, matching the naming convention `operation-manual.md` v3.49 already adopted (`docs/prompts/001-restart-prompt-archive-and-source-of-truth.md`) - this file's own governing rule requires reviewing a diagram in the same change as the documents it visualizes.
- v1.8: doc-consistency-reviewer batch fix: Section 6's runtime-trigger flowchart `P4` node no longer contradicts the `Q4` question routing into it - the node self-described as "(design time: threat model, Phase 3)" while `Q4` is labeled "(Phase 6 / pre-merge)"; relabeled to match P4's actual scope (Phase 6/pre-merge) with a note that the same trigger also fires Phase 3's separate threat-model sketch (prompt-097).
- Older entries: see `git log --follow` on this file (retention per `documentation-metadata-standard.md` Section 2.1, prompt-033).

---

**Diagrams orient, prose governs.** No rule lives only here: each diagram links to the canonical document that owns its content, and node labels stay at stable altitude (phase names, document names, gate names) so the pictures rarely need to change. When the documents a diagram visualizes change shape, review the diagram in the same change ([prompt-engineering-guide.md](../manuals/prompt-engineering-guide.md), Section 11).

## 1. Document map

How the pieces relate. Canonical component table: [operation-manual.md](../manuals/operation-manual.md), "Document map". The repository README embeds a copy of this diagram as its visual entry point; this file is canonical for it - change it here first, then mirror to README.

```mermaid
flowchart TD
    subgraph Adapters["Tool adapters (thin pointers)"]
        CLAUDE["CLAUDE.md"]
        AGENTS["AGENTS.md"]
    end
    OM["operation-manual.md<br/>(hub: rules, steps, gates)"]
    CLAUDE --> OM
    AGENTS --> OM
    OM --> RM["roadmap.md<br/>(Phases 0-8: what happens)"]
    OM --> OP["orchestrator.md<br/>(how a session drives the roadmap)"]
    OM --> PEG["prompt-engineering-guide.md<br/>(how to write each prompt + pattern library)"]
    OM --> DMS["documentation-metadata-standard.md<br/>(frontmatter schema)"]
    OM --> ROG["role-operating-guide.md<br/>(one-person role coverage)"]
    RM --> SPEC[".specify/<br/>(Spec Kit artifacts: constitution, specs, plans, tasks)"]
    OM --> PROMPTS["docs/prompts/<br/>(change-as-prompt archive + PROMPT-INDEX)"]
    OM --> REFS["docs/references/<br/>(token-economy, tools-ecosystem, infra-templates, telemetry-template, gate-verification-template)"]
    OM --> STATE["docs/STATE.md<br/>(generated single-read snapshot)"]
    OM --> REPORTS["docs/reports/<br/>(external reports + PROPOSAL-TRACKING.md)"]
```

## 2. Roadmap state machine

Phases and gates. Canonical definition: [roadmap.md](../strategy/roadmap.md); every transition requires human approval (operating rule 7).

```mermaid
stateDiagram-v2
    [*] --> P0
    P0: Phase 0 - Foundation
    P1: Phase 1 - Discovery
    P2: Phase 2 - Planning
    P3: Phase 3 - Designing
    P4: Phase 4 - Decomposition
    P5: Phase 5 - Development
    P6: Phase 6 - Testing
    P7: Phase 7 - Deployment
    P8: Phase 8 - Maintenance
    P0 --> P1: human gate
    P1 --> P2: human gate
    P2 --> P3: human gate
    P3 --> P4: human gate + independent review
    P4 --> P5: human gate
    P5 --> P6: human gate
    P6 --> P7: human gate
    P7 --> P8: human gate
    P8 --> P1: next cycle needs fresh discovery
    P8 --> P2: problem understood, replan only
    note right of P0
        Paths (roadmap section 4):
        full = all phases in order;
        short = named phases skipped explicitly;
        fast-track = start from a solution,
        back-fill discovery and planning.
    end note
```

## 3. Phase-execution sequence

One phase from entry to transition, with the layered validation model ([operation-manual.md](../manuals/operation-manual.md), Step 14 — the diagram below shows layers 1-5, which fire at a phase transition; layer 6 is trigger-gated and layer 7 runs at cycle close) and the summarize-and-confirm gates (Step 10).

```mermaid
sequenceDiagram
    actor H as Human
    participant O as Orchestrator session
    participant SK as Spec Kit (/speckit.*)
    participant AR as adversarial-reviewer
    participant OR as orchestrator-reviewer
    H->>O: confirm phase, goal, acceptance criteria
    O->>H: state what will be done + artifacts (gate)
    H-->>O: approve
    O->>SK: technical execution (specify / plan / tasks / implement)
    SK-->>O: artifacts in .specify/ + code/tests
    Note over O: Layer 5 - automated checks (lint, tests, CI)
    O->>O: Layer 1 - self-check vs phase criteria
    O->>AR: Layer 2 - merit review (design phases, security-relevant specs)
    AR-->>O: findings (proposes, never edits)
    O->>OR: Layer 3 - independent review (significant transitions)
    OR-->>O: pass / gaps report
    O->>H: summarize results, request transition
    H-->>O: Layer 4 - human approval (mandatory, every transition)
```

## 4. Prompt lifecycle

The change-as-prompt rule for this template repository ([operation-manual.md](../manuals/operation-manual.md), Step 12).

```mermaid
flowchart LR
    IDEA["Non-trivial change idea"] --> DOC["docs/prompts/NNN-slug.md<br/>status: draft"]
    DOC --> APPROVE["Human approves<br/>→ status: active"]
    DOC -- declined/superseded --> DEPR["status: deprecated<br/>(decline reason in body)"]
    APPROVE --> EXEC["Execute on a branch<br/>(edits to living documents)"]
    EXEC --> CHECKS["Governance checks<br/>(frontmatter, links, sync, tests)"]
    CHECKS --> PR["Pull request to develop"]
    PR --> MERGE["Merge + verification"]
    MERGE --> FLIP["Flip prompt doc to<br/>status: archived"]
    FLIP --> INDEX["PROMPT-INDEX.md row updated"]
    DEPR --> INDEX
```

## 5. Spec Kit artifact flow

The technical execution engine and where each command's artifact lands ([operation-manual.md](../manuals/operation-manual.md), Steps 4-5).

```mermaid
flowchart TD
    C["/speckit.constitution"] --> CA[".specify/memory/constitution.md<br/>(Phase 3 - guardrails)"]
    S["/speckit.specify"] --> SA[".specify/specs/feature.md<br/>(Phase 3 - intent)"]
    P1["/speckit.plan (first pass)"] --> PA[".specify/plans/technical-strategy.md<br/>(Phase 3 - initial plan)"]
    CL["/speckit.clarify"] --> CLA["recorded ambiguities + answers<br/>(Phase 4)"]
    P2["/speckit.plan (refined)"] --> PB[".specify/plans/[feature-name]-tech-plan.md<br/>(Phase 4 - refined plan)"]
    T["/speckit.tasks"] --> TA["sprint backlog / docs/task.md<br/>(Phase 4 - atomic tasks)"]
    AN["/speckit.analyze"] --> ANA["spec/plan/tasks cross-check<br/>(Phase 4 - mandatory, pre-code)"]
    I["/speckit.implement"] --> IA["source code + tests, task by task<br/>(Phase 5 - test-first default)"]
    CA --> S
    SA --> P1
    PA --> CL
    CLA --> P2
    PB --> T
    TA --> AN
    ANA --> I
```

## 6. Runtime-trigger decision flow

Skip-by-default pattern selection ([prompt-engineering-guide.md](../manuals/prompt-engineering-guide.md), Section 12). A non-matching increment pays one skip line.

```mermaid
flowchart TD
    START["Task / increment at hand"] --> Q1{"New non-trivial<br/>function or module?<br/>(Phase 5)"}
    Q1 -- yes --> P1["P1 code-generation spec"]
    Q1 -- no --> Q2{"Too large for one prompt,<br/>fits one implementation task?"}
    Q2 -- yes --> P2["P2 staged build"]
    Q2 -- no --> Q3{"Misbehaving code,<br/>cause not obvious?"}
    Q3 -- yes --> P3["P3 debugging CoT"]
    Q3 -- no --> Q4{"Security-relevant increment?<br/>(Phase 6 / pre-merge)"}
    Q4 -- yes --> P4["P4 security audit (Phase 6 / pre-merge)<br/>same trigger also fires Phase 3's<br/>threat-model sketch (roadmap 7a)"]
    Q4 -- no --> Q5{"Iterating on output<br/>that mostly works?"}
    Q5 -- yes --> P5["P5 targeted refinement"]
    Q5 -- no --> Q6{"First production deploy<br/>or new service? (Phase 7)"}
    Q6 -- yes --> P6["P6 observability baseline"]
    Q6 -- no --> Q7{"Production incident?<br/>(Phase 8)"}
    Q7 -- yes --> P7["P7 incident RCA"]
    Q7 -- no --> Q8{"Problem/market/prior-art<br/>not yet validated? (Phase 1)"}
    Q8 -- yes --> P8["P8 deep-research handoff"]
    Q8 -- no --> Q9{"User-facing taste<br/>question? (Phase 1/3)"}
    Q9 -- yes --> P9["P9 UI/UX taste prototype"]
    Q9 -- no --> Q10{"Unfamiliar external<br/>API/dependency? (Phase 5)"}
    Q10 -- yes --> P10["P10 external-dependency<br/>research spike"]
    Q10 -- no --> SKIP["No pattern fires -<br/>one-line skip note where required"]
```
