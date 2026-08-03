---
title: "Business Software Development Roadmap"
doc_type: instruction
description: "Guide the creation and evolution of any software product or platform as a generic and reusable AI multi-agent software development system with human-in-the-loop control, living documentation, persistent memory, path selection, and phase-by-phase execution."
status: active
version: "3.28"
created: 2024-07-04
updated: 2026-08-03
language: en
id: roadmap
tags: [roadmap, lifecycle, greenfield, brownfield, phase-gates]
owner: Alexandre Clemente
related: [operation-manual, orchestrator, phase-reviewer, go-to-market]
---

# Business Software Development Roadmap

Changelog of this document:

- v3.28: Phase 3's acceptance criterion "SPEC becomes tasks" contradicted Activity 12 of its own phase (`/speckit.plan` "without breaking it into tasks yet") and every other document, which place task generation in Phase 4 - now states the condition Phase 3 reaches instead of the act Phase 4 performs. New Activity 10a: verify a data source exists and holds real data before scoping a feature on it. Phase 7 Activity 6 gains the task-artifact reconciliation at closure. `test-report.md`'s Phase 5 bullet now says what the metadata standard already did, that it may be authored in Phase 5 or 6. Activity 4's P9 trigger widened to information design (`006-absorb-local-notes-011-accepted-items`).
- v3.27: doc-consistency-reviewer batch fix: Phase 1 Activity 11a now names `agents/tool-discovery.md` alongside the `tool-hunter` adapter, matching the parallel treatment `agents/doc-consistency.md`/`agents/adversarial.md` already got at `prompt-096` (prompt-097).
- v3.26: doc-consistency-reviewer batch fix: Phase 8 Activity 4b now names `agents/doc-consistency.md` alongside the `doc-consistency-reviewer` adapter, matching the parallel treatment `agents/adversarial.md`/`agents/phase-reviewer.md` already get elsewhere in this file (prompt-096).
- Older entries: see `git log --follow` on this file (retention per `documentation-metadata-standard.md` Section 2.1, prompt-033).

---

## 1. Purpose

This roadmap exists to receive an initial problem, idea, existing codebase, or desired solution and transform it, step by step, into documentation, planning, specifications, code, tests, deployment artifacts, and operational knowledge using AI with mandatory human oversight.

The system must remain generic, reusable, and process-oriented so it can be applied to any software product, internal initiative, or existing system, regardless of business domain.

---

## 2. Operating principles

1. Human-in-the-loop is mandatory for meaningful decisions.
2. Never skip discovery, planning, architecture, decomposition, implementation validation, or maintenance updates without an explicit, recorded path decision (section 4).
3. Every phase must produce artifacts that feed the next phase.
4. Every important decision must be recorded in a durable document.
5. Execute one phase and one task at a time.
6. Validate acceptance criteria before progressing; escalate to independent review for significant or hard-to-reverse transitions (see `docs/manuals/operation-manual.md`, Step 14).
7. Documents are living memory and must be versioned with the repository.
8. When information is missing or uncertain, record it and block progression until clarified.
9. Prefer proven tools, libraries, and workflows over custom development unless a documented gap justifies building from scratch.
10. Keep the project auditable: if it cannot be explained later from the artifacts, it is not complete.

---

## 3. Starting condition: Greenfield or Brownfield

Before Phase 0 begins, the orchestrator confirms which starting condition applies (see `agents/orchestrator.md`, Step 0). This choice changes the inputs and activities of Phase 0 and Phase 1 only; from Phase 2 onward, the roadmap is identical regardless of starting condition.

### Greenfield

The project starts from an idea, problem, or desired solution, with no existing code of record.

- Phase 0 builds the documentation and governance structure from a blank slate.
- Phase 1 discovers the problem, requirements, and market context from scratch.

### Brownfield

The project starts from a codebase that already exists, and may already be in production.

- Phase 0 additionally requires:
  1. An inventory of the existing codebase: languages, frameworks, deployment targets, and known technical debt.
  2. A gap analysis between what documentation already exists (READMEs, wikis, tickets) and what this operating model requires.
  3. A decision, recorded as an ADR, on how much of the existing undocumented behavior must be reverse-engineered into `docs/references/` before Phase 1 can rely on it.
- Phase 1 additionally requires:
  1. Treating the existing system's actual behavior as a primary input, alongside stakeholder intent.
  2. Distinguishing "how it works today" (fact, discoverable from code and logs) from "how it should work" (hypothesis, to be validated) in `docs/references/requirements.md`.
  3. Recording known constraints imposed by the existing system (data formats, integrations, SLAs already committed to users) as hard constraints, not aspirational requirements.

Both conditions converge at Phase 2: once a PRD exists, planning, architecture, decomposition, development, testing, deployment, and maintenance proceed the same way whether or not code already existed at the start.

---

## 4. Roadmap paths

The roadmap supports three paths. The choice is recorded in `/docs/status.md` and can change at any session (see `agents/orchestrator.md`, Step 0).

### 4.1 Full roadmap

Every phase runs in order, Phase 0 through Phase 8. Use this when requirements are unclear, stakes are high, or the team wants the strongest audit trail. This is the default and the safest option.

### 4.2 Short path (explicit phase skipping)

One or more phases are deliberately skipped, not merely abbreviated. This is appropriate when a phase's goal is already satisfied by prior work outside this system (for example, a PRD already exists and is approved elsewhere).

Rules for the short path:

1. A phase may only be skipped if the human explicitly names it and states why its goal is already met.
2. The decision to skip a phase, and the justification, is recorded as an ADR.
3. A skipped phase's artifacts are marked as "inherited" in `/docs/status.md`, with a pointer to where the equivalent information actually lives.
4. Phase 3 (Designing) and Phase 5 (Development) cannot be skipped; they can only be shortened. Architecture and implementation always need at least a minimal pass through this system's guardrails.
5. If a skipped phase's absence later causes a blocker, the orchestrator reopens it rather than improvising around the gap.

### 4.3 Fast-track path (solution-first, prototype, then back-fill)

The project starts from a solution idea or a working prototype instead of a problem statement, moves quickly into a throwaway or exploratory build, and only afterward back-fills the discovery and planning artifacts that the full roadmap would have produced first.

Sequence:

1. Capture the solution idea or prototype as-is in `docs/references/problem-statement.md`, explicitly labeled as "solution-first, discovery pending."
2. Run a lightweight version of Phase 3 (Designing) and Phase 5 (Development) to produce a working prototype, using the constitution's minimum guardrails only.
3. Once the prototype demonstrates the idea, pause and run Phase 1 (Discovery) and Phase 2 (Planning) retroactively, validating or correcting the assumptions the prototype was built on.
4. Reconcile the prototype's architecture against the now-validated requirements; expect and budget for rework.
5. Continue with Phase 4 onward as normal.

Use the fast-track path only for exploration, spikes, or when the cost of being wrong is low and reversible. Do not use it for the first production-bound implementation of a system with real users, real data, or compliance exposure; use the full roadmap or, at minimum, the short path for those.

### 4.4 Choosing between paths

| Situation | Recommended path |
| --- | --- |
| Requirements are unclear, or the outcome is hard to reverse | Full roadmap |
| A specific phase's output already exists and is approved | Short path, with that phase explicitly skipped |
| The goal is to test technical feasibility or de-risk an idea cheaply | Fast-track |
| Regulatory, safety, or financial exposure is non-trivial | Full roadmap, regardless of how confident the team feels |

---

## 5. Macro project flow

Main flow:
Idea, Problem, or Existing Codebase -> Discovery -> PRD -> Planning -> Architecture and Constitution -> Specification -> Tasks -> Implementation -> Testing -> Delivery -> Maintenance and Continuous Learning

---

## 6. Official phases

### Phase 0 - Foundation

#### Phase 0 - Goal

Create the minimum documentation, governance, and memory structure before starting discovery.

#### Phase 0 - Inputs

- Initial vision for the project
- Decisions already made in conversation
- Base roadmap
- Need for living documentation
- Starting condition (section 3) and roadmap path (section 4)
- If brownfield: the existing codebase and any existing documentation

#### Phase 0 - Activities

1. Confirm the Step 0 startup choices.
2. Create the documentation folder structure.
3. Create the initial handbook.
4. Create the initial status document, recording the Step 0 startup choices.
5. Create the changelog.
6. Create the initial risk register.
7. Create the ADR template and first ADR if needed.
8. Define the document ownership model.
9. If brownfield: complete the codebase inventory and documentation gap analysis (section 3).

#### Phase 0 - Generated artifacts

- `/docs/handbook.md`
- `/docs/status.md`
- `/docs/risks.md`
- `/docs/governance.md`
- `/docs/adr/0000-adr-template.md` (the blank ADR scaffold Activity 7 requires; created by `agents/init.md` on every bootstrap)
- If a first ADR is needed (Activity 7): `/docs/adr/0001-documentation-and-governance-model.md`
- `docs/telemetry/sessions.jsonl` (default-scaffolded by `agents/init.md`; skipped if the human opts out)
- `/CHANGELOG.md`
- If brownfield: `/docs/references/existing-system-inventory.md`

#### Phase 0 - Artifacts instructions

- `handbook.md` is the project entry point.
- `status.md` shows the current phase, blockers, the Step 0 startup choices, and next step - including which increment/cycle is in progress (the outer loop, Phase 8 re-entering Phases 1-7) alongside the current phase/step (the inner loop), since a single "current phase" field can't show both (`docs/manuals/operation-manual.md`, Step 14).
- `risks.md` is consulted during discovery and planning.
- ADRs record architectural, operational, and tooling decisions.
- The constitution (`.specify/memory/constitution.md`, produced in Phase 3) will define permanent guardrails for future work; Phase 0 only establishes the documentation and governance structure it lands in.

#### Phase 0 - Acceptance criteria / Done

- Documentation structure exists.
- All base documents exist, even if simple.
- There is a clear versioning and update convention.
- The Step 0 startup choices are recorded.
- If brownfield: the codebase inventory exists and gaps are named.
- A new person can understand the project in up to 15 minutes.

#### Phase 0 - Expected result

Operational foundation ready to start discovery without losing memory.

#### Phase 0 - Validation

Self-check only, unless the brownfield inventory reveals material undocumented risk, in which case run an independent review before proceeding.

---

### Phase 1 - Discovery

#### Phase 1 - Goal

Transform a raw problem, or an existing system's actual behavior, into a validatable understanding of context, alternatives, requirements, opportunity, constraints, and available tooling or prior art.

#### Phase 1 - Inputs

- Initial problem, idea, or challenge, or the brownfield inventory from Phase 0
- User and stakeholder context
- Known constraints
- Initial hypotheses

#### Phase 1 - Activities

1. Reformulate the problem to remove ambiguity.
2. Brainstorm 3 to 5 approaches. When the problem resembles a well-served commodity category (calendars, CRM, payments, scheduling, and similar), one of the brainstormed approaches must be "adopt an existing product or service, build nothing custom" - not mandatory when the problem is genuinely novel or the product itself is the differentiator; record a one-line note either way (included, or explicitly excluded and why).
3. Perform a Tree of Thought analysis to compare alternatives and expose gaps, risks, and opportunities (see `docs/manuals/operation-manual.md`, Step 17).
4. Refine the strongest approach or combine compatible ideas. If the outcome is a surface - a page, a report, a view, a CLI output shape - whose "taste" or whose information design must be resolved, spike disposable variants first (P9, `docs/manuals/prompt-engineering-guide.md`, Section 12) and have the human react to one before continuing.
5. Gather functional requirements.
6. Gather non-functional requirements.
7. If brownfield: separate "how it works today" from "how it should work" explicitly (section 3).
8. Define MVP scope versus future scope.
9. Research market and competitors. If the problem/market/prior-art isn't yet validated, or needs deeper research capability than the agent itself has, use the guided external deep-research handoff pattern (P8, `docs/manuals/prompt-engineering-guide.md`, Section 12).
10. Compare existing solutions and identify gaps, then close with an explicit verdict - adopt an existing product/service, or build custom - before Phase 1 can end, surfaced via the human-interaction protocol (`docs/manuals/operation-manual.md`, Step 18): "A) Adopt an existing product/service as-is - recommended when gaps are minor or non-differentiating" / "B) Adopt an existing product plus a thin custom integration - recommended when one gap is real but small" / "C) Build custom software - recommended when gaps are substantial or the product itself is the differentiator." This is a human decision, not one the orchestrator makes unilaterally; record the comparison in `market.md` and the verdict plus one-line reasoning in `build-vs-buy.md`.
10a. Conditional: if any candidate scope depends on a data source, verify the source before the scope is committed to, not after. Confirm that it (a) exists, (b) holds real data rather than fixtures or seed rows, and (c) will still hold real data by the time the feature ships. A feature scoped against a source that turns out to be empty or fabricated renders either blank or invented, and the cost of finding that out in Phase 5 is a rebuild. State the verification and its result in `market.md` or `build-vs-buy.md` alongside the verdict above; if no candidate scope is data-dependent, record the skip in one line. This is a scoping check about *inputs*, and is not the same discipline as this repository's existing rules against fabricated claims, dates, and citations - those govern what a document asserts.
11. Perform tooling and prior-art research:
    a. Identify validated frameworks and libraries that may cover the software's needed capabilities (run `agents/tool-discovery.md` in Mode B — in Claude Code, the `tool-hunter` subagent; findings feed 11c's `build-vs-buy.md`). This is distinct from discovering Claude-ecosystem tools (Agents/Skills/Hooks) that help produce roadmap artifacts more generally — for that, see `docs/manuals/tool-library-catalog.md` and `docs/manuals/operation-manual.md`, Step 15.
    b. Decide on the Spec-Driven Development tooling to adopt and document the rationale.
    c. Record findings in `/docs/references/build-vs-buy.md`, explicitly separating reuse from build.
    d. Record the tooling decision in an ADR.
12. Define the initial value proposition.
13. Record open questions.
14. Validate the chosen direction before moving on.

#### Phase 1 - Generated artifacts

- `/docs/references/problem-statement.md`
- `/docs/references/brainstorm.md`
- `/docs/references/tree-of-thought-brainstorm.md`
- `/docs/references/requirements.md`
- `/docs/references/user-stories.md`
- `/docs/references/mvp-scope.md`
- `/docs/references/build-vs-buy.md`
- `/docs/business/market.md`
- `/docs/prd.md`
- ADRs for structural and tooling decisions
- `/CHANGELOG.md` updated
- `/docs/status.md` updated

#### Phase 1 - Artifacts instructions

- `problem-statement.md` and `requirements.md` feed the PRD.
- `market.md` supports business justification and differentiation.
- `user-stories.md` and `mvp-scope.md` feed planning.
- `build-vs-buy.md` prevents redundant custom development later.
- `prd.md` becomes the official input for Phase 2.

#### Phase 1 - Acceptance criteria / Done

- Problem clearly described.
- At least 3 alternatives considered.
- Functional and non-functional requirements separated.
- If brownfield: current-state and desired-state requirements separated.
- MVP scope defined.
- Market research completed with useful references.
- Existing skills, agents, and libraries researched and documented.
- Build-vs-adopt verdict recorded in `/docs/references/build-vs-buy.md` (Activity 10).
- SDD tooling decision made and recorded as an ADR.
- PRD approved for planning.

#### Phase 1 - Expected result

The project stops being a loose idea, or an undocumented system, and gains a validatable direction informed by market research and available tooling, avoiding unnecessary custom build effort.

#### Phase 1 - Validation

Self-check, plus human approval of the PRD. Run independent review if the tooling or build-vs-buy decision commits significant future cost.

---

### Phase 2 - Planning

#### Phase 2 - Goal

Transform the PRD into an executable plan with risks, dependencies, milestones, delivery order, and governance expectations.

#### Phase 2 - Inputs

- Approved PRD
- Known risks
- Time, cost, and capacity constraints
- Initial technical hypotheses

#### Phase 2 - Activities

1. Analyze technical and operational feasibility.
2. Update the risk register.
3. Break scope into epics and stories.
4. Estimate effort.
5. Map dependencies.
6. Define delivery sequence.
7. Define roadmap and milestones.
8. Define work cadence, such as Kanban or sprints (see `docs/manuals/role-operating-guide.md`).
9. Update project status.
10. Confirm who approves what and when.

#### Phase 2 - Generated artifacts

- `/docs/plan.md`
- `/docs/risks.md` updated
- `/docs/governance.md` updated (decision rights and review checkpoints; created in Phase 0)
- `/docs/references/backlog.md`
- `/CHANGELOG.md` updated
- `/docs/status.md` updated

#### Phase 2 - Artifacts instructions

- `plan.md` becomes the basis for architecture.
- `backlog.md` guides future task decomposition. Keep a small status index at the top - increment/cycle | status (`candidate / decided / in-progress / delivered`) | link to the retrospective entry that recorded the decision - so next-increment decisions stay scannable instead of existing only in retrospective prose. An index, not a duplicate: update it when a decision happens (Phase 8, activity 6), not a new table per increment.
- `risks.md` influences architectural decisions.
- `governance.md` defines decision rights and review checkpoints.

#### Phase 2 - Acceptance criteria / Done

- A plan with milestones and a clear sequence exists.
- Priority risks are registered with mitigation.
- Critical dependencies are mapped.
- Initial backlog is organized.
- There is agreement on what comes first.

#### Phase 2 - Expected result

Executable plan ready for architectural design.

#### Phase 2 - Validation

Self-check, plus human approval. Run independent review if the plan carries significant schedule, cost, or dependency risk.

---

### Phase 3 - Designing

#### Phase 3 - Goal

Define how the system will be built before implementation starts.

#### Phase 3 - Inputs

- Approved plan
- Prioritized risks
- Functional and non-functional requirements
- Technological and operational constraints
- If brownfield: the existing architecture and its known constraints

#### Phase 3 - Activities

1. Choose the stack.
2. Define the architectural pattern, and map the design patterns and module boundaries the implementation should follow.
3. Design main components and data flow.
4. Define the context and memory strategy.
5. Define the living documentation strategy.
6. Define human-in-the-loop rules.
7. Define code, test, and review conventions.
7a. Conditional: if the design is security-relevant - it touches authentication/authorization, input handling, secrets, payments, file or OS access, externally sourced data, or cryptography (same runtime trigger as P4, `docs/manuals/prompt-engineering-guide.md` Section 12) - sketch the threat model in the SPEC/plan: the attack vectors those surfaces expose and the mitigation each design decision provides, so the adversarial merit review can attack it. Otherwise record the skip in one line.
8. Record decisions in ADRs.
9. Verify Spec Kit was already initialized during bootstrap (`docs/manuals/operation-manual.md` Steps 1-2). If it was skipped, or this is a brownfield adoption where it never ran, run `specify init --here --ai <agent>` here as a recovery step — this is not the primary/expected first appearance of that command.
10. Run `/speckit.constitution` to generate `.specify/memory/constitution.md`.
11. Run `/speckit.specify` to generate `.specify/specs/[feature-name].md`.
12. Run `/speckit.plan` to generate the first technical plan, without breaking it into tasks yet.

#### Phase 3 - Generated artifacts

- `.specify/config.json` or equivalent core configuration file
- `.specify/memory/constitution.md`
- `.specify/specs/[feature-name].md` (initial bootstrap spec if generated by the chosen Spec Kit setup)
- `.specify/plans/technical-strategy.md`
- `/docs/references/data-model.md`
- `/docs/references/integration-points.md`
- `/docs/adr/*.md`
- Architecture diagrams
- `/CHANGELOG.md` updated
- `/docs/status.md` updated

#### Phase 3 - Artifacts instructions

- `.specify/memory/constitution.md` becomes the mandatory guardrail for future generation.
- `.specify/specs/[feature-name].md` becomes the source of truth for task decomposition.
- ADRs explain why choices were made.
- Diagrams help onboard new participants. Prefer text-based Mermaid checked into `/docs` (operation-manual Step 15); a C4-context-style diagram (system in its environment: users, external systems, boundaries) is the recommended starting altitude for the architecture.

#### Phase 3 - Acceptance criteria / Done

- High-level architecture defined.
- Development and review rules documented.
- Significant decisions recorded in ADRs.
- The SPEC is ready to become tasks - specific enough that Phase 4 can decompose it without inventing scope. Phase 3 does not generate the tasks themselves; Activity 12 above stops at the first technical plan on purpose, and `/speckit.tasks` runs in Phase 4.
- No critical ambiguity remains open.

#### Phase 3 - Expected result

System ready for controlled decomposition into executable work.

#### Phase 3 - Validation

An adversarial merit review via `agents/adversarial.md` is recommended before closing this phase - and strongly recommended if the design touches security, payments, persistent data, external contracts, or new dependencies - so fragile assumptions surface while they are still cheap to fix. Independent review via `agents/phase-reviewer.md` is required before this phase is considered closed; architectural mistakes are among the most expensive to reverse later.

---

### Phase 4 - Decomposition

#### Phase 4 - Goal

Turn the SPEC into small, clear, traceable tasks.

#### Phase 4 - Inputs

- Approved SPEC
- Constitution
- Relevant ADRs
- Macro backlog

#### Phase 4 - Activities

1. Run `/speckit.clarify` to record ambiguities and the human answers that resolve them.
2. Run `/speckit.plan` to produce a rigorous technical plan for implementation.
3. Run `/speckit.tasks` to generate atomic tasks, typically represented as a granular backlog.
4. Run `/speckit.analyze` to check the spec, plan, and tasks against each other for gaps, conflicts, and constitution violations before any code is written (mandatory; see `docs/manuals/operation-manual.md`, Step 5a rule 2).
5. Classify priority.
6. Identify task dependencies.
7. Define execution order.
8. Separate human and AI tasks.
9. Prepare the minimum implementation context.
10. Scope the first execution round as a walking skeleton: a minimal end-to-end vertical slice of the system, never the whole system. Everything else stays in the backlog as recorded, unimplemented scope.

#### Phase 4 - Generated artifacts

- `.specify/memory/clarifications.md`
- `.specify/plans/[feature-name]-tech-plan.md`
- `docs/task.md` or `.specify/tasks/sprint-backlog.json`
- `/CHANGELOG.md` updated
- `/docs/status.md` updated

#### Phase 4 - Artifacts instructions

- `docs/task.md` or `.specify/tasks/sprint-backlog.json` becomes the implementation base.
- The current task slice or sprint backlog defines what enters the current round.
- Acceptance criteria are used in review and testing.
- For a visual, filterable view of tasks (not just the flat-file artifact) - one Issue per task, a Project board grouped by phase for execution, a table view for filtering - see `docs/manuals/role-operating-guide.md`, Section 6 and Part III.

#### Phase 4 - Acceptance criteria / Done

- Tasks are small and clear.
- Every task has a definition of done.
- No major hidden dependencies remain.
- Current round scope is defined.
- If this is the project's first round: its scope is a walking skeleton (minimal vertical slice), not the entire system.

#### Phase 4 - Expected result

Work ready for execution without excessive improvisation.

#### Phase 4 - Validation

Self-check, plus human approval of the task list before execution begins.

---

### Phase 5 - Development

#### Phase 5 - Goal

Execute tasks one by one with mandatory human validation.

During sprint execution, actual system assets are generated.

#### Phase 5 - Inputs

- Approved task set
- SPEC
- Constitution
- ADRs
- Existing code context

#### Phase 5 - Activities

1. Select one task at a time.
2. Prepare context.
3. Run `/speckit.implement` to generate source code and tests step by step. For a task that produces executable code, the default is a test-first cycle within this step: write a failing test, confirm it fails for the expected reason, then implement until it passes (red-green-refactor). This default does not apply verbatim to a task whose output is not executable code (documentation, configuration-only, research spikes) — those still need meaningful validation, just not a literal failing-test-first step. When the task integrates an unfamiliar or complex external API/dependency, use the external-dependency research-spike pattern (P10, `docs/manuals/prompt-engineering-guide.md`, Section 12) to cache exploration findings in a short-lived scratch doc.
4. Validate against the SPEC.
5. Create or update tests.
6. Run local validations.
7. Submit to human checkpoint.
8. Approve, correct, or reject.
9. Record learnings.

#### Phase 5 - Generated artifacts

- `docs/references/test-report.md` - may be authored here or in Phase 6, whichever is where the results actually land; `docs/manuals/documentation-metadata-standard.md` records it as Phase 5 / 6 for the same reason. Phase 6 is where it is consumed, and it is listed there too.
- Source code
- Tests
- `/CHANGELOG.md` updated
- `/docs/status.md` updated
- New ADR if a relevant change occurs

#### Phase 5 - Artifacts instructions

- Code and tests move into system validation.
- Changelog records incremental evolution.
- Status shows progress and blockers.
- PRs and ADRs preserve traceability.

#### Phase 5 - Acceptance criteria / Done

- Implementation compiles or runs.
- Minimum tests pass.
- Code respects constitution and SPEC.
- Explicit human checkpoint happened.
- Changes were recorded.
- If this is the project's first increment: it is a working walking skeleton (minimal end-to-end vertical slice), not a big-bang implementation.

#### Phase 5 - Expected result

Real, traceable product increment.

#### Phase 5 - Validation

Automated checks (lint, type-check, tests) plus human checkpoint per task. Independent review is optional per-task but recommended for any task touching security, payments, authentication, or data integrity.

---

### Phase 6 - Testing

#### Phase 6 - Goal

Ensure the increment behaves as expected before moving on.

#### Phase 6 - Inputs

- Implemented code
- Tests
- Task acceptance criteria
- SPEC

#### Phase 6 - Activities

1. Validate the happy path.
2. Validate main edge cases.
3. Review errors and logs.
4. Confirm SPEC adherence.
5. Conditional: if the increment is security-relevant - it touches authentication/authorization, input handling, secrets, payments, file or OS access, externally sourced data, or cryptography (runtime trigger defined in `docs/manuals/prompt-engineering-guide.md`, Section 12) - run the P4 security-audit pattern and feed confirmed findings (concrete exploit example required) into the defect log. Otherwise record the skip in one line of the test evidence. If unsure whether it is security-relevant, it is.
6. Fix defects.
7. Revalidate.
8. Record results.

#### Phase 6 - Generated artifacts

- Defect log
- `docs/references/test-report.md` updated
- `/CHANGELOG.md` updated
- `/docs/status.md` updated

#### Phase 6 - Artifacts instructions

- `test-report.md` supports go/no-go decisions.
- The defect log feeds the backlog.
- Status reflects project health.

#### Phase 6 - Acceptance criteria / Done

- Task acceptance criteria met.
- No critical defect remains open.
- Minimum testing evidence exists.
- Increment approved for integration or delivery.

#### Phase 6 - Expected result

Validated increment reliable enough to move forward.

#### Phase 6 - Validation

Automated test suite plus self-check against the checklist in this section. Independent review before any release with external or paying users.

---

### Phase 7 - Deployment

#### Phase 7 - Goal

Integrate the increment into the main project flow safely.

#### Phase 7 - Inputs

- Validated increment
- Test report
- Human approval

#### Phase 7 - Activities

1. Final review.
2. Controlled merge.
3. Update changelog.
4. Update handbook or status if needed.
5. Perform post-integration verification.
6. Record pending items and next steps. Reconcile the cycle's task artifact (`docs/task.md` or `.specify/tasks/sprint-backlog.json`, per Phase 4) before doing so: every task is either checked, or disclosed here as unchecked with its reason. An unchecked box on work that actually shipped is the common case and the reason this is worth a minute - the record then disagrees with reality in the direction nobody notices, because the work is done and nothing is broken. This one is written guidance on purpose. Making it mechanical would need a task-artifact path this roadmap does not commit to (Phase 4 offers two alternatives), and `docs/references/gate-verification-template/verify-gate.js` deliberately never reads "Acceptance criteria / Done" bullets at all.
7. Run the deploy from the CI/CD pipeline, triggered by the merge or tag - never by hand. First-time setup: start from the templates in `/docs/references/infra-templates/deploy/`.
8. Describe environments as versioned Infrastructure as Code (Terraform/OpenTofu, containers, or the platform's native IaC); choose the tool per project and record it in an ADR.
9. Promote through environments: staging deploys automatically; production promotion requires explicit human approval (for example a GitHub Environment with required reviewers).
10. Exercise the rollback path - restoring the previously deployed version must be tested, not assumed.
11. Conditional: on the first production deploy of a service, or when adding a new deployable service (runtime trigger defined in `docs/manuals/prompt-engineering-guide.md`, Section 12), establish the observability baseline via the P6 pattern - structured logs, error tracking (chosen service recorded in an ADR), a health-check endpoint wired to the pipeline's smoke test, request-ID correlation. Otherwise record the skip in one line.

#### Phase 7 - Generated artifacts

- Integrated code
- `/CHANGELOG.md` updated
- `/docs/status.md` updated
- `/docs/handbook.md` updated if needed

#### Phase 7 - Artifacts instructions

- Status and changelog feed communication and memory.
- Handbook keeps a current high-level view.
- Pending items return to backlog.

#### Phase 7 - Acceptance criteria / Done

- Change integrated without breaking the main flow.
- Minimum documentation updated.
- Next steps identified.
- The deploy ran from the pipeline, not by hand; environment definitions live as versioned IaC (tool recorded in an ADR).
- Production promotion was human-approved; a tested rollback path to the previous version exists.
- If the P6 observability trigger fired, the deployed service exposes the health endpoint its pipeline smoke test checks; if it did not, the skip is recorded in one line.

#### Phase 7 - Expected result

Delivery completed with memory preserved.

#### Phase 7 - Validation

Human approval is mandatory; this phase is never automated end-to-end - automation carries the deploy to staging, a human approves the promotion to production. Post-integration verification is the minimum required check.

---

### Phase 8 - Maintenance

#### Phase 8 - Goal

Keep the project understandable, auditable, and evolvable over time.

#### Phase 8 - Inputs

- History from previous phases
- Human feedback
- Production signals - usage metrics, error-tracking trends, support feedback (from the P6 observability baseline, where it exists)
- Scope changes
- New risks and learnings

#### Phase 8 - Activities

1. Review the handbook periodically.
2. Update status on a regular cadence.
3. Update risks and ADRs.
4. Consolidate learnings into `docs/references/retrospective.md`.
4a. Conditional: when a production incident occurred - users or data were affected (runtime trigger in `docs/manuals/prompt-engineering-guide.md`, Section 12) - produce the P7 one-page blameless incident note and route every action item to the backlog. A bug caught before production is not an incident; no note needed.
4b. Recommended: run `agents/doc-consistency.md` once per cycle close to audit the whole living-document set for cross-document inconsistency, broken traceability, redundancy, and ambiguity, before replanning the next cycle — in Claude Code, this is the `doc-consistency-reviewer` subagent (`.claude/agents/doc-consistency-reviewer.md`). This runs once per cycle here, not once per phase - most phases only touch a narrow slice of the document set (see `docs/manuals/operation-manual.md`, Step 14, layer 7).
4c. Recommended: run this after activity 4b's consistency audit, so the audit sees the full narrative before it is pruned. Once the retrospective (activity 4) is written, prune that cycle's step-by-step narrative out of `status.md`, leaving a short pointer to `/CHANGELOG.md` and the relevant `docs/references/retrospective.md` section. `status.md` is a current-state record, not an archive (`docs/manuals/role-operating-guide.md`, Section 16) - a single overgrown living document has been observed to hit a platform's own read ceiling on its own. A project whose living-document body keeps growing past what a pruned `status.md` can hold may eventually need to split `status.md` by increment or cycle; this is a note for that point, not a rule to apply pre-emptively.
4d. Recommended: keep the "Unreleased" section of `/CHANGELOG.md` bounded to a modest number of recent entries, rolling older ones into their own dated version block once released - the same retention spirit as `documentation-metadata-standard.md` Section 2.1's 3-entry cap for this template's own documents, though not identical and not CI-enforced for a generated project's own `/CHANGELOG.md`.
5. Review the process itself and record a decision to keep, change, or retire a practice, even if the decision is "no change." This stays human-gated like every other phase transition (see the summarize-and-confirm rule and the validation strategy's human-approval layer in `docs/manuals/operation-manual.md`) — there is no autonomous, approval-free self-modification of the process.
6. Replan the next cycle by explicitly naming which phase it re-enters: Phase 1 if the next increment needs fresh discovery, or Phase 2 if the problem is already understood and only planning is needed. Prioritize using the production signals named in this phase's inputs (usage, error trends, support feedback), not intuition alone. This is the same roadmap looping again for the next increment, not a separate mechanism. Record the decision in `backlog.md`'s status index (Phase 2 - Artifacts instructions) so which increments are candidate/decided/in-progress/delivered stays scannable without reading every retrospective's prose.

#### Phase 8 - Generated artifacts

- Updated handbook
- Updated status
- Updated risks
- Additional ADRs
- Refined backlog
- `docs/references/retrospective.md`, updated each cycle with consolidated learnings and the process-review decision

#### Phase 8 - Acceptance criteria / Done

- The project remains readable for new participants.
- Decisions remain traceable.
- The next cycle can start without relying on informal memory.
- The process review produced at least one recorded decision, and the next cycle's starting phase is named explicitly.

#### Phase 8 - Expected result

Living memory and sustainable operation.

#### Phase 8 - Validation

Periodic self-check; escalate to independent review if drift between documented and actual state is suspected.

---

## 7. Transition rules between phases

Do not move forward without:

1. validating the current phase acceptance criteria,
2. confirming required artifacts were generated,
3. recording remaining decisions and open questions,
4. updating project status,
5. running independent review where this section calls for it,
6. explicitly asking: "Can we move to the next phase?"

If the answer is no:

- register the blocker,
- clarify the question,
- revise the affected artifact,
- repeat validation.

## 8. Standard question to begin any phase

"We are entering Phase X.
Phase X - Goal: [...]
Expected Phase X - Inputs: [...]
Artifacts to be generated: [...]
Acceptance criteria: [...]
Before we start, is any information missing or can we proceed?"

## 9. Master operational prompt for phase-by-phase execution

You are acting as the orchestrator of this project.
Follow the official roadmap strictly, respecting the confirmed Step 0 startup choices.
Execute one phase at a time.

Before producing any artifact:

1. confirm the current phase,
2. show the goal, inputs, outputs, and acceptance criteria,
3. identify questions or gaps,
4. propose only the immediate next step.

When a phase is completed:

1. summarize what was done,
2. list generated or updated artifacts,
3. explain how they will be used in the next phase,
4. validate acceptance criteria,
5. state whether independent review ran, was waived, or is still needed,
6. explicitly ask whether you may move forward.

When context becomes long:

- use existing artifacts as the official memory,
- prefer updating documents instead of repeating long text,
- summarize prior decisions by referencing the relevant artifacts,
- never depend only on informal conversational memory.

If ambiguity exists:

- do not assume,
- ask objective questions,
- block progression until clarified.

## 10. Folder structure

```
├── .specify/
│   ├── memory/
│   │   ├── constitution.md
│   │   └── clarifications.md
│   ├── specs/
│   │   └── [feature-name].md
│   └── plans/
│       └── technical-strategy.md
├── docs/
│   ├── handbook.md
│   ├── status.md
│   ├── prd.md
│   ├── plan.md
│   ├── task.md
│   ├── risks.md
│   ├── governance.md
│   ├── adr/
│   │   ├── 0000-adr-template.md
│   │   └── 0001-documentation-and-governance-model.md
│   ├── business/
│   │   └── market.md
│   ├── telemetry/
│   │   └── sessions.jsonl
│   └── references/
│       ├── build-vs-buy.md
│       ├── existing-system-inventory.md
│       └── test-report.md
├── src/
│   └── [Your application layers]
├── CHANGELOG.md
└── README.md
```

Illustrative, not exhaustive: each phase's own "Generated artifacts" list is canonical for what actually gets created; several `docs/references/` and `docs/business/` artifacts are omitted here for brevity.

`existing-system-inventory.md` only applies to brownfield projects (section 3).

## 11. Suggested initial execution order

For the full roadmap:

1. Phase 0 - Foundation: build documentation foundation, confirm the Step 0 startup choices.
2. Phase 1 - Discovery: run discovery for the project, including tooling and prior-art research (and, if brownfield, existing-system analysis).
3. Phase 2 - Planning: plan minimum viable maturity.
4. Phase 3 - Designing: define constitution and high-level spec, reusing validated components identified in build-vs-buy wherever possible.
5. Phase 4 - Decomposition: break down the first round of tasks.
6. Phase 5 - Development: implement the minimum validatable cycle.
7. Phase 6 - Testing: test and validate.
8. Phase 7 - Deployment: integrate.
9. Phase 8 - Maintenance: review and prepare the next iteration.

For the short path: follow the same order, replacing any skipped phase with a single step that records the ADR justifying the skip and points to where the equivalent artifact already lives.

For the fast-track path: follow section 4.3 instead of this order for the first cycle, then rejoin the full order from Phase 4 onward.
