---
title: "Operation Manual - Integrating Instructions Documents"
doc_type: instruction
description: "Operational guide for an AI-assisted software development system with human-in-the-loop control, living documentation, persistent memory, path selection, and phase-by-phase execution."
status: active
version: "3.55"
created: 2024-07-04
updated: 2026-08-03
language: en
id: operation-manual
tags: [operating-model, phase-gates, governance, human-in-the-loop, living-documentation]
owner: Alexandre Clemente
related: [orchestrator, roadmap, phase-reviewer, adversarial, doc-consistency, init, tool-discovery, documentation-metadata-standard, role-operating-guide, prompt-engineering-guide, agent-design-guide, template-visual-overview, go-to-market]
---

# Operation Manual - Integrating Instructions Documents

Changelog of this document:

- v3.55: Step 9 gains the missing-data rendering convention, pointing at the new `docs/references/missing-data-vocabulary.md` (`[x]` not available, `[z]` not applicable, never the ambiguous `NA`, legend above the table, never a line joined across a gap) (`007-missing-data-vocabulary`).
- v3.54: Step 9 gains two document conventions the corpus never stated - a departure from an earlier same-cycle artifact carries its reason in the later artifact (the authoring half; detection was already covered three times), and a specimen value a reader could mistake for real output must be impossible rather than plausible. Step 15's CI-checks table corrected: it still listed `docs-frontmatter-lint.yml`, `broken-link-check.yml` and `changelog-retention-check.yml` as live after all three were retired into the shared docgov engine, and omitted `pr-checks.yml`'s `promotion-source`/`ci-security` jobs and `scorecard.yml` (`006-absorb-local-notes-011-accepted-items`).
- v3.53: doc-consistency-reviewer follow-up (`docs/prompts/003-close-restart-followon-drift.md`): Document map gains a `docs/prompts/` row (previously absent from the table `README.md` calls the sole canonical component map) and the "Living memory" row's location list gains `docs/prompts/`; Step 15's `docs/STATE.md` row reworded from "excludes the historical archive" to "excludes regardless of status" (`docs/prompts/` now holds `active` prompts too); two dangling `docs/prompts/085-...md` citations qualified as archived-private-repo, non-citable paths.
- Older entries: see `git log --follow` on this file (retention per `documentation-metadata-standard.md` Section 2.1, prompt-033).

---

The Orchestrator Prompt (`agents/orchestrator.md`) does not compete with Spec Kit; it governs when and why the workflow advances, while Spec Kit provides the technical execution layer inside the designated phases. This manual explains how the documents, agents, and phase gates fit together as one operating system for AI-assisted software development.

## Document map

| Layer | Function | Location |
| --- | --- | --- |
| Operations Manual | Defines operating rules, escalation paths, and document usage | `docs/manuals/operation-manual.md` |
| Orchestrator Prompt | Controls phase sequencing, path selection, interaction level, readiness checks, and advancement decisions | `agents/orchestrator.md` |
| Execution Roadmap | Defines the end-to-end lifecycle, phase goals, paths, and artifacts | `docs/strategy/roadmap.md` |
| Go-to-Market Roadmap | Optional, parallel roadmap for the commercial lifecycle (positioning, pricing, launch, marketing, sales, retention, business retrospective) - not a gate every increment passes through | `docs/strategy/go-to-market.md` |
| Orchestrator Reviewer Prompt | Independently audits phase artifacts against Acceptance Criteria, Expected Result, and Generated Artifacts | `agents/phase-reviewer.md` |
| Adversarial Review Prompt | Stress-tests a spec/plan's merit (assumptions, error states, data, contracts, dependencies) before Phase 3 locks in | `agents/adversarial.md` |
| Doc Consistency Reviewer Prompt | Audits the whole living-document set for cross-document inconsistency, broken traceability, redundancy, and ambiguity at cycle close | `agents/doc-consistency.md` |
| Template Init Prompt | Idempotent Phase 0 bootstrap - detects starting condition, scaffolds only missing artifacts, never overwrites | `agents/init.md` |
| Tool Hunter Prompt | Live-vetted discovery of existing tools (Claude tools, Mode A; product solutions, Mode B) before building from scratch | `agents/tool-discovery.md`, catalog at `docs/manuals/tool-library-catalog.md` |
| Documentation Metadata Standard | Defines the required YAML frontmatter schema for Markdown docs/artifacts and the rule for applying it | `docs/manuals/documentation-metadata-standard.md` |
| Role Operating Guide | One-person operating guide covering product/delivery roles and their extension to every other lifecycle role | `docs/manuals/role-operating-guide.md` |
| Prompt Engineering Guide | Authoring quality for individual prompts (specification anatomy, examples, context blocks, staged prompting) plus the reusable prompt-pattern library | `docs/manuals/prompt-engineering-guide.md` |
| Agent Design Guide | Workflow-vs-agent decision table, agent design checklist (single responsibility, minimal context, few tools, retries, loop guards), and agent testing dimensions (accuracy, execution, reliability) | `docs/manuals/agent-design-guide.md` |
| Template Visual Overview | Six Mermaid diagrams orienting a new reader - document map, roadmap state machine, phase-execution sequence, prompt lifecycle, Spec Kit artifact flow, runtime-trigger decision flow; diagrams orient, prose governs | `docs/visuals/template-visual-overview.md` |
| Repository State | Generated single-read snapshot of every living document; the first read for "where are we?" questions | `docs/STATE.md`, produced by `.github/scripts/generate-state.js` |
| Change-as-prompt archive | One prompt document per non-trivial change to this repository itself (ROLE/CONTEXT/TASK/REQUIREMENTS), moving `draft` → `active` → `archived` per Step 11 | `docs/prompts/`, index at `docs/prompts/PROMPT-INDEX.md`, scaffold at `docs/prompts/basic-prompt-template.md` |
| Report Proposal Tracking | Status index over every proposal in every external improvement report under `docs/reports/` - done / done-scoped / deferred / rejected / not-triaged, with the evidence behind each | `docs/reports/PROPOSAL-TRACKING.md`, intake rule in `CONTRIBUTING.md` |
| Worked examples | The template's own replace-me worked examples: Phase 0 governance, risk register, and example ADR, plus an optional Phase 1 PRFAQ scaffold | `docs/manuals/examples/` |
| Reference material | Token-economy decisions, an unvetted tools-ecosystem shortlist, ready-to-apply GitHub-hardening/deployment templates, a session-telemetry convention, and an opt-in phase-gate artifact check, for generated projects | `docs/references/` |
| Living memory | Stores decisions, risks, status, ADRs, and versioned instructions | `agents/`, `.specify/`, `docs/manuals/`, `docs/adr/`, `docs/prompts/`, `/docs`, `/CHANGELOG.md` |
| Spec Kit | Technical execution engine for architecture, specs, tasks, and implementation | `.specify/` generated by `specify init` |
| Adapters | Thin, regeneration-safe entry points into the prompts above; not a second source of truth | `CLAUDE.md` + `.claude/commands/` (`orchestrator`, `template-init`) + `.claude/agents/` (`orchestrator-reviewer`, `adversarial-reviewer`, `tool-hunter`, `doc-consistency-reviewer`) for Claude Code; `AGENTS.md` for other tools that read that filename by convention |

The Execution Roadmap defines what happens. The Orchestrator Prompt defines when and along which path the project advances. The Reviewer Prompt independently checks whether what was claimed as done actually meets the roadmap's own bar. Spec Kit defines how the technical work is executed. The living documents preserve continuity, accountability, and memory across sessions, agents, and phases.

## The key takeaway: Spec Kit is agent-agnostic by design

Spec Kit is not tied to a single model or CLI. When you run `specify init`, it generates agent-specific integration files while keeping `.specify/` as the source of truth. That means the same project can be operated from Claude Code, GitHub Copilot, Gemini CLI, or other compatible tooling without rewriting the project memory. This same pattern — a thin, regeneration-safe adapter file per tool, with `.specify/` and this repository's own docs staying canonical — is the answer for any other LLM-based code assistant (for example Cursor or Codex) too; it does not need a separate abstraction layer of its own.

Recommended rule:

- Keep decisions in repository documents first.
- Use agent-specific instructions only as adapters.
- Treat generated instructions as regeneration-safe, not manually curated archives.

## Part I — Setup (Steps 1-2)

## Step 1 - Install Specify CLI once in the working environment

Use the integrated terminal in the current repository environment.

```bash
# Prerequisites: Python 3.11+, Git, and uv available in the environment
curl -LsSf https://astral.sh/uv/install.sh | sh

# Initialize Spec Kit in the existing repository
uvx --from git+https://github.com/github/spec-kit.git specify init --here
```

`--here` keeps the repository structure intact and initializes the tooling inside the current project instead of creating a nested workspace.

## Step 2 - Choose the agent at startup and change later

You can bootstrap the agent integration that best matches the current session.

```bash
uvx --from git+https://github.com/github/spec-kit.git specify init --here --ai claude
uvx --from git+https://github.com/github/spec-kit.git specify init --here --ai copilot
uvx --from git+https://github.com/github/spec-kit.git specify init --here --ai gemini
```

This creates adapter files for each agent while keeping the same project memory and artifacts. If more than one agent is used, the repository should still maintain one shared canonical set of docs and specs.

## Part II — Session and phase mechanics (Steps 3-8)

## Step 3 - Enter the orchestrator prompt at the start of each session

At the beginning of a new session, load `agents/orchestrator.md` as the controlling context. Its first job is to establish, or reconfirm, five choices before anything else happens (see `agents/orchestrator.md`, Step 0, for the full wording of each):

1. **What is being brought** - a problem with no solution yet, an idea, an already-thought-out solution, or a ready document. Makes the existing Phase 0/1 entry points explicit; invents no new activities.
2. **Starting condition** - is this a greenfield project (new idea, no code yet) or a brownfield project (adopting this operating model into an already-existing or already-in-production codebase)? See `docs/strategy/roadmap.md`, section 3, for how each condition changes Phase 0 and Phase 1 activities.
3. **Roadmap path** - full roadmap, a shortened path that skips specific phases, or a fast-track path that starts from a solution/prototype and back-fills the skipped phases later. See the roadmap document, section 4, for the path catalog.
4. **Interaction level** - how often the session pauses for confirmation: full-gate, phase-gate, or autonomous-with-report (default full-gate).
5. **Phase-exit brief format** - today's free-prose end-of-phase report, or a standardized six-field brief - opt-in only, defaulting to free-prose when unstated (`prompt-082`).

All five choices can be changed at any later session simply by asking the orchestrator to re-evaluate them; nothing about the document set locks a project into its first answer.

In Claude Code, this step is available as the `/orchestrator` slash command (`.claude/commands/orchestrator.md`), which loads this prompt and runs Step 0 and the session protocol below; `/orchestrator reset` forces the startup choices to be re-asked. A short `CLAUDE.md` at the repository root keeps the summarize-and-confirm rule (Step 10) always on and points to this command. Other tools (GitHub Copilot, Gemini CLI, local models, and similar) get the same effect from `AGENTS.md` at the repository root, a tool-neutral adapter that loads `agents/orchestrator.md` directly rather than through a Claude-Code-specific slash command — both adapters keep `agents/orchestrator.md` as the one source of truth rather than duplicating it into a tool-specific file.

Minimum session startup behavior:

1. Confirm the starting condition (greenfield or brownfield) and the roadmap path, or ask the human to choose if this is the first session.
2. Confirm the current phase.
3. Restate the active goal and acceptance criteria.
4. Identify what is missing or ambiguous.
5. Decide only the next immediate action.

## Step 4 - How roadmap phases connect to Spec Kit commands

The lifecycle below is the operational default for the full path. Shortened and fast-track paths reorder or defer some of these, as defined in the roadmap document.

| Roadmap Phase | Primary Action | Spec Kit Command |
| --- | --- | --- |
| Phase 0 - Foundation | Establish document foundation, governance, and starting-condition choice | Manual setup |
| Phase 1 - Discovery | Clarify the problem and validate direction | Document work and research |
| Phase 2 - Planning | Turn validated intent into an executable plan | Document work and planning |
| Phase 3 - Designing | Formalize architecture and policy guardrails, producing an initial technical plan | `/speckit.constitution`, `/speckit.specify`, `/speckit.plan` (first pass) |
| Phase 4 - Decomposition | Resolve ambiguity, refine the plan, then break it into atomic, cross-checked work items | `/speckit.clarify`, `/speckit.plan` (refined), `/speckit.tasks`, `/speckit.analyze` |
| Phase 5 - Development | Implement one task at a time with validation | `/speckit.implement` |
| Phase 6 - Testing | Validate behavior and close defects | Test execution and review |
| Phase 7 - Deployment | Integrate safely and update records | Merge, release, and verification |
| Phase 8 - Maintenance | Keep memory, documentation, and process current | Ongoing updates |

Phases 1 and 2 remain document-driven by design. Spec Kit enters the workflow when the project is ready to become a controlled technical system.

## Step 5 - Command order for technical phases

The command order stays consistent across compatible agents:

1. `/speckit.constitution` - define or update guardrails.
2. `/speckit.specify` - capture the feature or system intent.
3. `/speckit.clarify` - resolve ambiguity with human input.
4. `/speckit.plan` - produce the technical plan.
5. `/speckit.tasks` - derive actionable tasks.
6. `/speckit.analyze` - check spec, plan, and tasks against each other for gaps, conflicts, and constitution violations before any code is written.
7. `/speckit.implement` - execute tasks with validation.

`/speckit.plan` runs twice in the roadmap's own phase breakdown: an initial pass in Phase 3, before `/speckit.clarify`, and a refined pass in Phase 4, after it (`docs/strategy/roadmap.md`, Phase 3 Activity 12 and Phase 4 Activities 1-2; see Step 4's table for which phase runs which pass). This list shows the full command set once, in dependency order, not a literal one-command-per-phase mapping.

Use only one primary command at a time. Do not jump ahead if the current artifact is incomplete.

### Step 5a - Spec Kit practice rules, and when not to use SDD

Practice rules for the pipeline above:

1. **Human review between `/speckit.specify` and `/speckit.plan`.** The spec is the cheapest place to catch a wrong direction; `/speckit.clarify` resolves the ambiguities the human review surfaces. Approving the spec only at implementation review time means paying plan and task generation for a direction that was never confirmed.
2. **Always run `/speckit.clarify` and `/speckit.analyze`.** They cost tokens (see `docs/references/token-economy.md` for this repository's cost posture), but skipping them trades a small known cost for rework discovered mid-implementation - the expensive kind. Treat a run where both report nothing as cheap confirmation, not waste.
3. **One feature = one specification.** A spec bundling several features can no longer be clarified, analyzed, planned, or reviewed as a unit; decomposition quality collapses. Split before `/speckit.plan`, not after.
4. **Specification and implementation in separate PRs.** Reviewing "is this the right thing to build?" and "is this built right?" in one diff means neither gets reviewed well; a spec PR that merges first also gives `/speckit.plan` a stable, agreed input.

**When not to use the SDD pipeline.** SDD is not a silver bullet; its discipline has a real learning and token cost, and below a certain size the ceremony outweighs the drift it prevents. Use the standard lightweight process instead for:

- **Throwaway spikes and prototypes** - exploration whose output is knowledge, not code to keep. If a prototype may graduate, that is the roadmap's fast-track path (`docs/strategy/roadmap.md`, section 4): build first, then back-fill the spec - not skip it forever.
- **Small one-off scripts** - short, single-use utilities (on the order of a hundred lines) with no maintenance future.
- **Urgent production hotfixes** - restore service through the normal emergency process, then back-fill spec and docs once stable; blocking a fire on `/speckit.specify` helps no one.

The common thread: SDD earns its cost where code lives long enough for spec-vs-code drift to hurt. Where nothing persists, there is nothing to drift.

## Step 6 - Handle uncertainty explicitly

If there is ambiguity, the workflow blocks until it is resolved.

Rules:

- Record open questions in the relevant document.
- Do not assume unconfirmed scope or technology choices.
- Separate known facts from hypotheses.
- Prefer small reversible changes when testing a hypothesis.
- Promote a hypothesis to a decision only after validation or human approval.

## Step 7 - Run the workflow without losing memory between agent switches

Use the same Git repository across agents and sessions.

1. Keep the canonical documents in the repository, not in chat history.
2. Update the phase status before switching tools.
3. Commit or otherwise persist major decisions before changing agents.
4. Re-open the orchestrator prompt at the next session start.
5. Review the latest status, risks, ADRs, and changelog before resuming work.

The goal is continuity. The operating model should survive tool changes, model changes, and session resets.

## Step 8 - Switch agents mid-project with consistent instructions

When using Copilot, Claude Code, or Gemini in the same repository:

1. Initialize the corresponding adapter once.
2. Keep `.specify/` as the canonical technical memory.
3. Keep `/docs` and `/CHANGELOG.md` as the project memory layer.
4. Use the same phase sequence and the same starting-condition and path choices regardless of the agent.

The agent can change. The governance model should not.

## Part III — Governance rules (Steps 9-12)

## Step 9 - Document conventions

Keep every important change traceable.

- Update the relevant living document before relying on conversation memory.
- Use version headers for all major instruction documents.
- Keep changelog entries short and action-oriented.
- Record architectural decisions in ADRs.
- Use status documents to show current phase, blockers, and next step.
- Every Markdown documentation file in this repository — including `agents/` and every category directory under `docs/` enumerated in `documentation-metadata-standard.md` Section 1, plus any artifact the roadmap generates elsewhere under `.specify/` — must carry the YAML frontmatter schema defined in `docs/manuals/documentation-metadata-standard.md`; apply or update it whenever the file is created or materially changed, alongside the changelog and version header.
- Move a `docs/prompts/` file through its lifecycle by editing only its `status` field; see Step 11 for the concrete trigger points.
- When a later artifact reaches a conclusion that departs from an earlier one produced in the same cycle, write the departure down in the later artifact, with its reason and the evidence that decided it. A silent softening reads afterwards as either an error or a retreat; the same paragraph, written down, reads as reasoning. This is the authoring-side obligation only — finding contradictions after the fact is already covered three times over, by `agents/phase-reviewer.md`, `agents/adversarial.md`, and `agents/doc-consistency.md`, and reversing an accepted ADR has its own rule in `docs/manuals/role-operating-guide.md`. Multi-artifact discovery produces these departures normally as understanding sharpens; what it must not produce is a stale earlier artifact nobody reconciled.
- Render an absent, degraded, or withheld value with the shared vocabulary in `docs/references/missing-data-vocabulary.md` rather than inventing a token per surface: `[x]` not available, `[z]` not applicable, never the ambiguous `NA`, legend above the table, and never a line joined across a gap. The obligation to be honest about gaps was already stated in five places here before the vocabulary existed; this is what they point at.
- Make a specimen value impossible rather than plausible whenever a reader could mistake it for the product's own output — `R$ 99.999,99`, `CLIENTE EXEMPLO S.A.`, a date in `2099`. Labelling is necessary and is not sufficient: a plausible fake survives being screenshotted away from its label, and a reader who misses one label misreads a real figure. This does not reach illustrative prose or format examples, which are meant to read as realistic — `docs/manuals/examples/spec-prfaq-template.md`'s invented user quote and `docs/references/telemetry-template/`'s realistic sample lines are both correct as written. Where clearly-labelled invented data *belongs* — fixtures, worked examples, throwaway prototypes — is already settled; see the keep-versus-replace table in `README.md`.

## Step 10 - The universal summarize-and-confirm rule

This rule applies to every document in this set and overrides no other rule; it wraps around all of them.

Before executing any non-trivial instruction (creating or materially changing an artifact, entering a phase, or running a Spec Kit command):

1. State what will be done, in plain language.
2. State which artifacts will be created or changed.
3. Ask whether the human has questions, or wants to proceed.
4. Proceed only after an explicit go-ahead (for example, "ok", "proceed", or an answered question).

After executing any non-trivial instruction:

1. Summarize what was done.
2. List the artifacts created or updated.
3. State how those artifacts feed the next step.
4. Ask whether the human has questions, or wants to proceed to what comes next.

Trivial, obviously reversible, or explicitly pre-authorized actions (for example, re-reading a file, or a batch of steps the human already approved as a group) do not need to repeat this exchange for every single step - see Step 12a for the objective criteria that draw this line. When in doubt, summarize and ask.

This carve-out has a formal expression: the session **interaction level**, chosen at startup alongside the starting condition and roadmap path (`agents/orchestrator.md`, Step 0, choice 4). **full-gate** keeps the exchange on every non-trivial instruction (the default); **phase-gate** keeps it only at phase entry/exit, hard-to-reverse or externally visible actions, and independent-review points; **autonomous-with-report** works through the phase's agreed scope and reports at checkpoints. Under every level, blocking on unresolved ambiguity (Step 6), human approval for phase transitions, and the Step 14 validation layers never become skippable - the level tunes confirmation frequency, never what requires approval.

## Step 11 - Prompt lifecycle workflow (draft -> active -> archived)

`documentation-metadata-standard.md` Section 4.1 defines the `status` field's shape for `docs/prompts/` files; this step states the operational trigger points for changing it:

1. **draft** - create `docs/prompts/NNN-<slug>.md` with `status: draft` while the change-request is still being proposed and has not yet been approved to execute.
2. **active** - flip to `status: active` once the human approves the prompt and its described changes are being executed.
3. **archived** - flip to `status: archived` once every change the prompt describes has been merged and verified (Step 14's validation layers), so the prompt becomes a historical record rather than an open request.
4. **deprecated** - flip to `status: deprecated` when a drafted prompt is declined or superseded before execution; record the decline reason in the prompt's own body, not only in `PROMPT-INDEX.md`.

No physical file move happens at any step (Section 4.1) - only the frontmatter `status` field changes. Leaving a prompt at `active` after its work has already merged is a lifecycle-hygiene bug - watch for it whenever a PR merges without a matching status flip.

## Step 12 - Every non-trivial change, update, upgrade, or refactor requires its own prompt document

A non-trivial change to this project - to code, docs, folder structure, tooling, or process - must be captured as its own `docs/prompts/NNN-<slug>.md` before execution begins, not just decided in conversation and then carried out. This keeps the "why" of a change as durable, versioned memory instead of chat history, and applies the same discipline the project already asks of its own users to itself.

Rules:

1. **Scope - this template repository only** - this rule governs the `ai-assisted-sdd-template` repository itself: its own docs, governance files, prompts, and tooling. It does not extend into a project generated from this template. Such a project builds actual software through the roadmap phases and Spec Kit commands; it defines its own change-management process (for example, its own `CONTRIBUTING.md`, PR review rules, or governance document) rather than inheriting a requirement to write a `docs/prompts/NNN-<slug>.md` for every code change. See the "this template's own worked example" convention (the files under `docs/manuals/examples/`) for the same repo-vs-generated-project distinction. Prompts are authored directly in `licorsy/ai-assisted-sdd-template` (this repository) — it is the current source of truth for this template's own development (`docs/adr/0005-public-release.md`, v1.3); the archived private source repository's own pre-2026-07-31 prompt sequence is not migrated here and is not a citable path in this repository.
2. **Trigger** - the same bar as Step 10's "non-trivial" test (creating or materially changing an artifact, entering a roadmap phase, or a change whose effects are not immediately and trivially reversible); see Step 12a for the objective criteria that classify a candidate change into trivial, batchable minor, or non-trivial/structural. Step 10's own carve-out applies here too: trivial, obviously reversible, or already-batch-approved steps (for example, fixing a typo, or a single step inside a group the human already approved) do not each need their own prompt document.
3. **Structure** - follow `docs/prompts/basic-prompt-template.md` (`ROLE`, `CONTEXT`, `TASK`, `REQUIREMENTS, CONSTRAINTS AND RULES`, optional `EXAMPLES`, `FORMAT AND OUTPUT`). `docs/prompts/001-restart-prompt-archive-and-source-of-truth.md` is this repository's own worked example of the shape and of the proposed→approved→executed lifecycle. The deeper archive that established this rule (`087-prompt-enumeration-drift-batch.md`, `005-prompt-update-upgrade-refactoring.md`, and the rest) predates 2026-07-31 and was not migrated when this repository became the sole source of truth (`docs/adr/0005-public-release.md`) - it remains in the archived private source repository only, not a citable path here.
4. **ROLE must be scenario-specific** - name the panel of experts (or single role) actually relevant to the change at hand; do not reuse a prior prompt's panel verbatim for an unrelated scenario (for example, a documentation-naming refactor needs a different role mix than a CI/CD pipeline change).
5. **TASK must be scenario-specific** - state the concrete tasks for this change, not a generic restatement of "make updates."
6. **`## REQUIREMENTS, CONSTRAINTS AND RULES` is mandatory** - every such prompt must carry this section. It may reuse this repository's recurring baseline constraints (no execution without explicit human instruction, prefer objective and realistic direction over agreement, prefer small reversible changes) where relevant, but must also add constraints specific to the scenario (for example, backward-compatibility limits, a freeze window, a specific tool or format to use).
7. **Lifecycle** - the prompt follows Step 11: created at `status: draft` while the change is being proposed, flipped to `active` once approved and execution starts, flipped to `archived` once the change is merged and verified per Step 14.
8. **Frontmatter** - apply the standard schema from `docs/manuals/documentation-metadata-standard.md`, same as every other document in this set.
9. **Batching small related fixes** - one prompt document may cover a named batch of small, related fixes when (a) the batch shares a single stated theme, (b) each item alone is minor — a wording, reference, or small consistent doc edit, nothing structural — and (c) the TASK section lists every item in the batch explicitly, so nothing rides along unrecorded. The batch moves through the Step 11 lifecycle as one unit. Structural changes — new rules, new files or folders, new tooling, anything hard to reverse — still require their own dedicated prompt. This tier removes per-item document overhead, not traceability; it formalizes the middle ground between rule 2's trivial carve-out and a full dedicated prompt.

### Step 12a - Objective criteria for "trivial"

Step 10's carve-out and Step 12 rule 2 both point at a "trivial, obviously reversible" line without a checkable bar. This table gives that line objective signals instead of judgment alone - the same pattern Step 14's validation layers and Step 15's tool-selection table already use.

| Tier | What qualifies | Consequence |
| --- | --- | --- |
| **Trivial** | A single wording/typo correction; re-reading a file; a reference-path fix with no semantic change; one step already approved as part of a group. | Step 10's carve-out applies - no `docs/prompts/` document needed. |
| **Batchable minor** | Several small, related, individually non-structural fixes (wording, reference, small consistent doc edits across files); no new file, folder, rule, or agent. | Step 12 rule 9 applies - one shared-theme prompt document, every item listed explicitly in its TASK section. |
| **Non-trivial / structural** | Creates or moves a file/folder; adds a new rule, agent, or script; is not immediately and mechanically revertible with `git revert` alone; introduces a new path or name other documents will reference. | Its own dedicated `docs/prompts/NNN-<slug>.md`, `status: draft` first, per Step 12. |

Objective signals to weigh a borderline case against (not exhaustive): how many files are touched; whether an ADR or a document `id` is affected; whether `git revert` alone restores the prior state with no follow-up edits; whether the change introduces a new path or name other documents will come to reference.

This table does not change what Step 14's validation layers or phase-transition approval require - same boundary Step 10's interaction-level paragraph already states for itself; it only sharpens which changes need a prompt document at all.

## Part IV — Reference guidance (Steps 13-18)

## Step 13 - Natural-language retrieval convention

Any question about the project or the business, asked in plain natural language, should be answerable from the repository's living documents rather than from conversation memory alone.

To support this:

- For "where are we?" questions (current phase, document freshness, what exists), read the generated `docs/STATE.md` first — one consolidated snapshot of every living document — then follow its links; regenerate it with `node .github/scripts/generate-state.js` after changing living docs (CI fails on staleness).
- Keep one canonical fact per document; do not scatter the same fact across files with different wording.
- Prefer structured sections (tables, labeled lists) over long prose, so an agent can locate and quote the relevant fragment.
- When asked a question, search `docs/`, `.specify/`, and `CHANGELOG.md` before answering, and cite the file the answer came from.
- If the answer is not in any document, say so explicitly and offer to record it once the human provides it.

## Step 14 - Validation strategy

Every phase produces claims ("this is done", "this meets the acceptance criteria"). Those claims must be checked, not assumed.

Layered validation model:

1. **Self-check at the end of a phase** - the executing agent validates its own output against the phase's Acceptance Criteria / Done, Expected Result, and Generated Artifacts, as defined in the roadmap. This is necessary but not sufficient on its own, because the same reasoning that produced the artifact is checking it.
2. **Adversarial merit review** - before a design locks in (recommended before Phase 3 exit; strongly recommended for any spec/plan touching security, payments, persistent data, external contracts, or new dependencies), run `agents/adversarial.md` to stress-test the spec or plan itself: fragile assumptions, error states, data lifecycle, contract and dependency risk. It asks "is the bar aimed at the right thing?", where layer 3 asks "was the bar met?". In Claude Code, this is the `adversarial-reviewer` subagent (`.claude/agents/adversarial-reviewer.md`); it proposes edits, never applies them.
3. **Independent review** - for any phase transition that is significant (Phase 3 onward, or any phase whose output will be hard to reverse), run `agents/phase-reviewer.md` as a separate pass. It re-derives the phase's bar from the roadmap and checks the artifacts against it without reusing the executing agent's reasoning chain. In Claude Code, this is available as the `orchestrator-reviewer` subagent (`.claude/agents/orchestrator-reviewer.md`), which runs with a fresh, isolated context, a reasoning-tier model, and read-only tools so it can report but not fix.
4. **Human approval** - the human makes the final call on every phase transition. Independent review informs that decision; it does not replace it.
5. **Automated checks where they exist** - linting, type-checking, unit and integration tests, and Spec Kit's own validations run before a phase is considered complete whenever the phase produces code or configuration. For a security-relevant increment, this layer also includes the P4 security-audit pattern, gated by the runtime trigger defined in `docs/manuals/prompt-engineering-guide.md`, Section 12 (a non-matching increment records a one-line skip instead).
6. **Claude Code review skills (optional, trigger-gated)** - skip is the default: `/code-review` and `/security-review` run only when their trigger holds, and a skipped trigger costs one line of evidence, not silence, mirroring `docs/manuals/prompt-engineering-guide.md`, Section 12.

   | Skill | Run when (decide at run time) | Skip when |
   | --- | --- | --- |
   | `/code-review` | The diff is non-trivial and not already covered by `adversarial-reviewer` or `orchestrator-reviewer` this session | The change is docs-only, or one of those two subagents already reviewed it this session |
   | `/security-review` | The increment touches the same P4 security-relevant surfaces defined in `docs/manuals/prompt-engineering-guide.md`, Section 12 (authentication/authorization, input handling, secrets, payments, file or OS access, externally sourced data, cryptography) | None of those surfaces changed - record the skip in one line of the test evidence |

   Project-defined reviewers - any subagent a specific project adds beyond `adversarial-reviewer` and `orchestrator-reviewer` - follow this same discipline: an explicit trigger and a stated cadence, recorded where the project defines the reviewer, never "run it when it comes up."
7. **Document-set consistency review** - not gated to a phase transition like layers 1-6 above; runs on demand, or once per cycle close (`docs/strategy/roadmap.md`, Phase 8 - Maintenance), not once per phase. Most phases touch only a narrow slice of the document set, and running a full-corpus pass every phase would be costly and largely redundant with what layer 3 already checks per phase. Run `agents/doc-consistency.md`; in Claude Code, this is the `doc-consistency-reviewer` subagent (`.claude/agents/doc-consistency-reviewer.md`). It searches directedly - cross-references, frontmatter `related:` fields - rather than reading every document in full, and reports only; it never applies fixes itself.

Rule of thumb: the harder a decision is to reverse, the more of these layers should run before moving on. A wording fix in a reference document only needs the self-check. A production deployment needs all seven; layer 7 runs on its own cycle-close cadence rather than at each transition.

**Reading this model as a loop.** "Loop engineering" - a term for designing the system that runs an AI agent through a repeated cycle (act, verify, decide, repeat) rather than a manual prompt at each step (Gergely Orosz's newsletter, June 2026) - describes what the seven layers above already are, at a coarser grain: a business process of phases and increments, not a single coding task. This is a reformulation of the existing model, not a new rule. The mechanical gates plus `adversarial-reviewer` plus `orchestrator-reviewer` are the layered verifiers; "human approval required before every phase transition" (operating rule 7, `agents/orchestrator.md`) is the stop rule. A sharp illustration of loop engineering's "the human still owns the goal and the judgment": separating the *decision* to merge a pull request (stays with a human, always) from the *mechanical act* of merging (may be delegated to an agent, but only after explicit, PR-specific approval - a general "proceed" does not count) is exactly the shape operating rule 7 already takes here; a project generated from this template can record the same separation as its own ADR if it wants a dedicated decision record for it.

**Why review runs in a fresh context, restated.** A YouTube walkthrough of `mattpocock/skills` (triaged in prompt `085`, archived private-repo sequence, not a citable path in this repository; same source as Step 16a's citation) puts it plainly: "an agent that just wrote code is bad at critiquing its own code" - having written it, it already believes the work is fine. This is a reformulation of why layers 2 and 3 above already run as separate subagents rather than the same session re-checking its own output: `adversarial-reviewer` and `orchestrator-reviewer` are independent specifically so the reasoning that produced an artifact is never the same reasoning that grades it. Not a new rule - the design was already this way.

Two loop levels coexist here. The **inner loop** is a step within one phase, inside one increment. The **outer loop** is Phase 8 - Maintenance re-entering Phases 1-7 for the next increment. A single "current phase" field in a project's `status.md` cannot show both at once - which loop iteration, and which step inside it - and a project reading only that field can look stuck on one phase permanently when it is actually cycling normally. See `docs/manuals/role-operating-guide.md`, Section 16, and `docs/strategy/roadmap.md` Phase 0 Artifacts instructions for how `status.md` should record both dimensions.

## Step 15 - Tool and resource guidance

Use the tool that matches the activity; do not default to freeform generation when a more reliable tool exists.

| Activity | Preferred tool or resource | Why |
| --- | --- | --- |
| Market and competitor research | Web search, plus any subscription research tools already available to the team | Freeform generation without retrieval produces stale or invented facts |
| Architecture, spec, plan, task generation | Spec Kit slash commands (`/speckit.*`) | Keeps `.specify/` as a single regenerable source of truth |
| Backlog and issue tracking | GitHub Issues and GitHub Projects | Native to the repository, auditable, linkable from PRs and commits |
| Architectural decisions | ADRs in `docs/adr/` — both for this template's own real decisions and for a project generated from this template; the worked example stays at `docs/manuals/examples/adr-0001-documentation-and-governance-model.md` (illustrative, not a live decision, so it does not move into `docs/adr/`) | Preserves the reasoning behind a decision, not just the decision |
| Code search and repository-wide exploration | The coding agent's built-in search/grep tools | Faster and more accurate than manual reading for large repositories |
| Discovering and vetting third-party Claude tools (Agents, Skills, Hooks, MCP servers, Commands) before building one from scratch | `agents/tool-discovery.md`, Mode A; in Claude Code, the `tool-hunter` subagent (`.claude/agents/tool-hunter.md`); catalog at `docs/manuals/tool-library-catalog.md` | Avoids rebuilding capability that already exists as a proven, actively maintained tool; keeps one reusable, vetted catalog instead of re-researching per project |
| Researching frameworks/libraries/services for the software product being built (Phase 1, Activity 11a) | `agents/tool-discovery.md`, Mode B; in Claude Code, the `tool-hunter` subagent (`.claude/agents/tool-hunter.md`); findings recorded in `/docs/references/build-vs-buy.md` | Avoids reinventing well-established product-level solutions; uses maintenance/security/license/adoption criteria suited to stable software, rather than the recency/rating evidence Mode A records for fast-moving Claude tools |
| Diagramming | Any text-based diagram format supported by the repository's renderer (for example Mermaid) checked into `/docs` | Diagrams stay versioned and diffable alongside the documents they support |
| Stress-testing a spec or plan's merit before a design locks in | `agents/adversarial.md`; in Claude Code, the `adversarial-reviewer` subagent (`.claude/agents/adversarial-reviewer.md`) | Asks "is the bar aimed at the right thing?" while the design is still cheap to change — the question independent phase validation never asks |
| Independent phase validation | `agents/phase-reviewer.md`; in Claude Code, the `orchestrator-reviewer` subagent (`.claude/agents/orchestrator-reviewer.md`) | Separates "did we do the work" from "did we check the work" |
| Auditing the whole living-document set for cross-document consistency, traceability, redundancy, and ambiguity at cycle close | `agents/doc-consistency.md`; in Claude Code, the `doc-consistency-reviewer` subagent (`.claude/agents/doc-consistency-reviewer.md`) | Catches drift a single-phase review (`orchestrator-reviewer`) or a single-document edit doesn't surface; directed search over cross-references keeps it cheap enough to run every cycle instead of a redundant full-corpus read |
| Automated testing | The project's own test runner, invoked by `/speckit.implement` or directly | Human review alone does not scale and misses regressions |
| Enforcing frontmatter, resolvable internal links, the newest-3 changelog retention cap, the version bump, and the declared-fact pins | `.docgov.config.js`, run by the shared `licorsy/docs-governance` engine through `pr-checks.yml`'s `ci-docs` job | One engine replaced three repo-local scripts and their three workflows (`docs-frontmatter-lint.yml`, `broken-link-check.yml`, `changelog-retention-check.yml`, all retired). The config declares data, never logic: a check that does not exist yet belongs in the engine, not here. `dead_citations` and `version_citations` run as **shadow** — they report and never fail, pending a precision measurement on this corpus. This job and `ci-security` below are owner-guarded and do not run for adopters outside `licorsy`; `documentation-metadata-standard.md` Section 9 holds the canonical caveat |
| Enforcing that a promotion pull request comes from the branch below it | `pr-checks.yml`'s `promotion-source` job, pinned by the `promotion-chain-develop-staging-main` fact in `.docgov.config.js` | Rulesets require a pull request but place no constraint on where it comes *from*; a single-parent commit reached `main` that way once. The `facts` pin keeps the YAML enforcement and the prose permission matrix in `CLAUDE.md`/`AGENTS.md` from drifting apart |
| Dependency review and secret scanning | `pr-checks.yml`'s `ci-security` job (`dependency-review-action`, `gitleaks`) | Catches a vulnerable dependency or a committed secret at PR time rather than after merge |
| Supply-chain posture scoring | `.github/workflows/scorecard.yml` (OpenSSF Scorecard) | Audits overall repository posture — branch protection, code review, token permissions — which is a property of the repository, not of any one diff, so it runs on its own schedule instead of per PR |
| Keeping the living-doc scope shared by `.docgov.config.js` and CODEOWNERS in sync with the canonical list | `.github/scripts/check-scope-consistency.js` + `.github/workflows/scope-consistency-check.yml` (prompt-088) | Makes "which directories are living documents" single-sourced in `.github/scripts/doc-scope.js`, so the file that can't literally import it (CODEOWNERS) can't silently drift from it either |
| Verifying the repository's own governance scripts (every module under `.github/scripts/`) | `.github/workflows/governance-scripts-tests.yml`, Node's built-in `node:test` runner (prompt-024) | Catches a regression in the enforcement scripts themselves, which would otherwise let CI silently pass while the rule it exists to check is broken |
| Answering "where are we?" without a directory sweep | Generated `docs/STATE.md` (`.github/scripts/generate-state.js`, staleness-checked by `.github/workflows/state-staleness-check.yml`, prompt-034) | One deterministic consolidated read of every living document's status/version/freshness; excludes `docs/prompts/` regardless of status (kept lean - `docs/prompts/PROMPT-INDEX.md` is that directory's own status index) |
| Keeping `CLAUDE.md`/`AGENTS.md` rule restatements from drifting | `.github/scripts/check-adapter-sync.js` + `.github/workflows/adapter-sync-check.yml`, HTML-comment sync markers in both adapters (prompt-035) | Mechanically enforces this manual's own "avoid split-brain documentation" rule for the intentionally duplicated adapter blocks |
| Keeping a `.claude/agents/`/`.claude/commands/` adapter's operating rules from becoming a second source of truth | `.github/scripts/check-adapter-rules.js` + `.github/workflows/adapter-rules-check.yml` (prompt-098) | Catches the recurring "operating rule stated only in an adapter, never its canonical `agents/*.md` prompt" defect mechanically instead of relying on a `doc-consistency-reviewer` pass to catch each new instance by hand |
| Keeping "Step NN" references to this manual from drifting | `.github/scripts/check-step-references.js` + `.github/workflows/step-reference-check.yml` (prompt-045) | The drift class that already produced two documented defects (prompt-009's fallout, fixed by prompt-027) becomes mechanically impossible |
| Bootstrapping a project freshly created from this template | `/template-init` (`.claude/commands/template-init.md`; canonical procedure in `agents/init.md`, prompt-039) | Idempotent Phase 0 scaffold - fills only gaps, never overwrites, second run is a no-op report |
| Hardening a generated project's GitHub setup (branch protection, Conventional Commits, release automation) | Templates in `docs/references/infra-templates/` (prompt-040) | Ready-to-apply, SHA-pinned material instead of re-deriving the same YAML and `gh api` calls per project |
| Phase 7 deployment automation (CD pipeline, IaC, staging→production promotion, rollback) | Templates in `docs/references/infra-templates/deploy/` (prompt-041) | Models the roadmap's gate: automatic staging deploys, human-approved production promotion, tested rollback |
| Cross-project session telemetry (what's been done, tokens spent, current phase) for a project generated from this template | `docs/references/telemetry-template/` (`session-entry.schema.json`, prompt-068) | One-line-per-session `sessions.jsonl` appended at the existing session-end step; no new mandatory agent, cost/billing math explicitly deferred |
| Checking a phase's `roadmap.md` artifacts actually exist on disk before closing the phase, for a project generated from this template | `docs/references/gate-verification-template/` (`verify-gate.js`, prompt-083) | Opt-in, manual command; checks only unambiguous single-path artifact bullets, reports everything else as not-machine-checkable rather than guessing; never checks Acceptance criteria |
| Validating a git branch/merge operation against a standardized naming taxonomy and permission matrix, and enforcing it server-side on this repository | `git-governance` Claude Code plugin (`git-governance-advisor` subagent); GitHub-native enforcement via its `setup-branch-protection.sh` script (prompt-101) | Same model as `docs-governance` for documents (prompt-099) - a shared, externally maintained persona plus real GitHub rulesets, instead of repo-local prose or classic branch protection |

### Step 15a - How to trigger the tool-hunter agent

No special command is needed. Just phrase a request naming the capability and, ideally, the mode:

- "Use tool-hunter to find an existing MCP server for GitHub Projects sync" → Mode A (Claude tool discovery).
- "Run tool-hunter, Mode B, to research auth libraries for the product we're building" → Mode B (product solution research).

If the mode isn't named, `tool-hunter` asks before proceeding rather than guessing (`agents/tool-discovery.md`, Tasks step 1; in Claude Code, the `.claude/agents/tool-hunter.md` adapter restates it). See `agents/tool-discovery.md` for the full context, vetting criteria, and destinations per mode.

## Step 16 - LLM selection guidance per stage

Different phases place different demands on a model: broad exploratory reasoning, precise step-by-step execution, or fast repetitive transformation. Choosing a model tier per stage keeps cost and latency proportional to the difficulty of the task.

| Stage | Dominant demand | Suggested tier | Why |
| --- | --- | --- | --- |
| Phase 1 - Discovery | Open-ended reasoning, comparing alternatives, spotting gaps | Largest available reasoning-tier model (for example Claude Opus-class) | Tree of Thought comparisons and market analysis reward depth over speed |
| Phase 2 - Planning | Structured reasoning over constraints | Reasoning-tier or upper-mid-tier model | Sequencing and risk tradeoffs need reliable multi-step reasoning, but the input is already narrower than discovery |
| Phase 3 - Designing | Architectural reasoning with long context | Reasoning-tier model | Architecture decisions are expensive to reverse; this is not the place to economize |
| Phase 4 - Decomposition | Careful, literal decomposition of an already-agreed plan | Mid-tier model (for example Claude Sonnet-class) | The hard reasoning already happened in Phase 3; this phase mostly needs precision and consistency |
| Phase 5 - Development | Code generation and step-by-step implementation | Mid-tier model, escalate to reasoning-tier for hard subtasks | Most implementation tasks are well-scoped; escalate only when a task proves unexpectedly hard |
| Phase 6 - Testing | Following a checklist, spotting deviations | Mid-tier model | Well-defined comparison work, not open-ended reasoning |
| Phase 7 - Deployment | Procedural execution | Fast/utility-tier model (for example Claude Haiku-class), human-gated | Low reasoning load, high need for speed and low cost |
| Phase 8 - Maintenance | Summarization, drift detection, routine updates | Fast/utility-tier model, escalate when drift is found | Most of this phase is upkeep; escalate only when something looks wrong |
| Independent review (`agents/phase-reviewer.md`) | Adversarial, skeptical re-checking | Reasoning-tier model, different from (or at minimum a fresh context from) the one that executed the phase | A reviewer that shares the executor's blind spots is not an independent check |

These are starting defaults, not hard rules. Re-evaluate them as model families change; the criterion that matters is "reasoning depth versus speed and cost needed for this specific task," not the specific model name.

### Step 16a - Delegation and parallel dispatch

Two patterns cut cost and wall-clock time without weakening the gates:

1. **Orchestrator/writer delegation.** The session's reasoning-tier model plans, decides, and reviews. Long-form drafting - documents, boilerplate code, repetitive transformations - may be delegated to a mid-tier subagent, whose output the reasoning-tier model reviews before it lands in the repository. Never delegate decisions, phase-gate judgments, or hard-to-reverse content. Be precise about why this works: the mid-tier model is *cheaper per output token*, not smarter; circulating cost/quality figures for this pattern are unverified marketing-shaped numbers - adopt the pattern, measure your own costs.
2. **Parallel dispatch of independent tasks.** Tasks inside one phase may run as parallel subagents only when they share no files or state and have no ordering dependency between them - for example, Phase 1 research streams over different questions, or independent Phase 5 tasks touching disjoint modules. The orchestrating session consolidates the results before the phase gate. Phase gates themselves always run sequentially; parallelism never spans a gate (operating rule: one phase at a time).

**Why small tasks, restated with a concrete mechanism.** A YouTube walkthrough of `mattpocock/skills` (triaged in prompt `085`, archived private-repo sequence, not a citable path in this repository) names a "smart zone" - roughly the first ~140k tokens of a context window, before attention degrades and output quality drops - as the reason to size a unit of work to fit inside one agent session. This reinforces, rather than replaces, the walking-skeleton rule already in place (`docs/strategy/roadmap.md`, Phase 4): a task sized to fit one context window is also a task small enough to review, roll back, and reason about cleanly.

## Step 17 - Prompt technique guidance per activity type

Pick the reasoning structure that matches the shape of the problem.

| Activity shape | Recommended technique | Why | Where it is used in this system |
| --- | --- | --- | --- |
| Comparing several competing approaches before committing to one | Tree of Thought (ToT) | Explores multiple branches in parallel and exposes tradeoffs before a decision is locked in | Phase 1 - Discovery, alternative-approach brainstorming |
| Executing a known, ordered procedure correctly | Chain of Thought (CoT) | Reduces skipped steps and arithmetic or sequencing errors in linear tasks | Phases 2, 4, and 5 - planning breakdowns, task decomposition, step-by-step implementation |
| Checking a finished artifact against a fixed rubric | Checklist / rubric-grounded prompting | Anchors the model to explicit pass/fail criteria instead of open-ended judgment | Phase 6 - Testing, and the Reviewer Prompt |
| Answering a natural-language question from existing documents | Retrieval-grounded prompting (read before answering) | Prevents confident but invented answers when the fact already exists in the repository | Step 13 above, and any status or handbook query |
| Resolving a single open ambiguity with the human | Direct clarifying question, no chain-of-thought needed | The bottleneck is missing information, not reasoning depth | `/speckit.clarify`, and any blocked step under Step 6 |

Do not apply Tree of Thought to a task that is really a checklist, and do not apply a checklist to a task that genuinely requires exploring unknown alternatives; mismatched technique is a common source of wasted effort.

This table maps *which* reasoning technique fits *which* activity shape. For how to write the individual prompt well - specification anatomy, input→output examples, labeled context blocks, priority tags, staged multi-step chains, and the reusable pattern library - see `docs/manuals/prompt-engineering-guide.md`.

## Step 18 - Human-interaction protocol

Steps 10 and 14 define *when* the human must be consulted; this step defines *how*. Free-form prose questions push the parsing cost onto the human; these seven rules push it back onto the agent.

Language: respond in the language the request was written in (Portuguese or English); default to Portuguese when ambiguous. The labels below have PT/EN pairs - use the pair matching the response language, never mixing the two in one list.

1. **Decision questions are multiple-choice.** When asking the human to decide anything with enumerable options, present 2-4 labeled options as a lettered list (A, B, C...), each option on its own line with a one-line consequence, tight spacing (no forced blank lines between options). Append "(recommended)" / "(recomendado)" to the suggested option's line with a one-line justification. In a plain-text response, the final option is always the custom-input escape - "Other (please specify)" (EN) / "Quero algo diferente destas opções" (PT); when asking through a tool that already offers a free-text escape (in Claude Code, AskUserQuestion), do not duplicate that line - the tool provides it.
2. **Open-ended questions are labeled and pre-answered.** When a question is genuinely subjective (no enumerable options), highlight it and label it explicitly - "Open Question" (EN) / "Pergunta Aberta" (PT). Always include a suggested answer, explicitly labeled "AI Suggestion" (EN) / "Sugestão da IA" (PT), grounded in a market/industry standard when one exists, or in this repository's own precedent - so the human can accept, edit, or replace a concrete proposal instead of composing an answer from scratch.
3. **Every document reference is a clickable link.** Any statement that relies on a document's content names that document as a clickable relative link (for example [documentation-metadata-standard.md](documentation-metadata-standard.md)), not just as a bare filename — resolved relative to the file doing the citing. This extends Step 13's "cite the file the answer came from" from naming to linking.
4. **Every task assigned to the human is briefed.** When an action must be done by the human (running a command, clicking through a UI, approving something externally), state - in this order - one sentence on why it is needed, a numbered step-by-step guide, and what to report back when done.
5. **Action lists distinguish sequential from parallel.** Sequential actions render as a numbered markdown list in chronological order, one distinct step per line - never as an inline prose enumeration ("1. x; 2. y" inside a paragraph). Parallel or concurrent actions render as a bulleted list, one action per line. Both use tight spacing (a blank line between items only when a step is long or multi-sentence), and a next-step lead-in gets a bold section heading (for example: `### **Your next step**`).
6. **Crucial context is never buried in a list.** Vital information or high-priority details are summarized objectively at the very end of the response, preceded by a single blank line, with the key sentence highlighted in bold - so a scanning reader cannot miss them inside a list body.
7. **Code fences are for verbatim content only.** Reserve triple-backtick blocks for content meant to be copied exactly - commands, file paths to paste, strings to type. Never wrap ordinary prose lists in code fences: fencing strips markdown link formatting (file and PR references stop being clickable, breaking rule 3) and misuses a construct meant for literal content.

This protocol governs the *form* of interactions, not their *frequency*; when to ask remains governed by Step 10 and the session's chosen interaction level.

## Important note for this repository

This repository already contains manual governance and documentation files. If Spec Kit creates its own canonical memory files, those files should become the source of truth for technical instructions, while the existing docs continue to act as the project-facing narrative and operational record.

Avoid split-brain documentation. If two files describe the same rule, reconcile them and keep only one canonical statement.

This applies concretely to Spec Kit's own per-feature generated artifacts (their exact shape depends on the installed Spec Kit version — confirm against it rather than assuming): when one would duplicate an existing canonical `docs/` document, the `docs/` version stays authoritative, and the Spec Kit artifact becomes a pointer, a source-map/summary, or a feature-specific delta — never a verbatim second copy. For example, a feature's research notes should point back to `docs/references/build-vs-buy.md` rather than re-deriving it, and a feature's data-model artifact should record only what differs from `docs/references/data-model.md`, not restate it in full. See `documentation-metadata-standard.md`'s scope section (Section 1) for the existing template-docs/`docs/`-artifacts/`.specify/` distinction this rule builds on.

## Summary of the relationship between the components

The Execution Roadmap defines what happens and along which path. The Orchestrator Prompt decides when the project can advance and which path it is following. The Reviewer Prompt independently checks whether a phase's own bar was actually met. Spec Kit defines how the technical work is executed. The living documents preserve continuity, accountability, and memory across sessions, agents, and phases.
