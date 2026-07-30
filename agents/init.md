---
title: "Template Init Prompt"
doc_type: instruction
description: "Idempotent project bootstrap for a repository created from this template: detect greenfield vs. brownfield and confirm with the human, scaffold only the missing Phase 0 artifacts (status, ADR template, handbook stub, risk register, governance stub, telemetry ledger, changelog entry) with valid frontmatter, verify Spec Kit presence without installing anything, and end with a created/skipped/human-actions report. Running it twice must make the second run a pure no-op report."
status: active
version: "1.8"
created: 2026-07-13
updated: 2026-07-28
language: en
id: init
tags: [bootstrap, scaffold, idempotency, phase-0, template-init]
owner: Alexandre Clemente
related: [operation-manual, orchestrator, documentation-metadata-standard, role-operating-guide]
---

# Template Init Prompt

Changelog of this document:

- v1.8: doc-consistency-reviewer batch fix: the ADR-template scaffold row's location note corrected - the worked-example ADR actually lives in `docs/manuals/examples/`, not `docs/manuals/` directly - and gains an explicit "never overwrite/renumber `docs/adr/`'s real ADRs" guard, since this row scaffolds a blank template into that same directory (prompt-090).
- v1.7: doc-consistency-reviewer batch fix: new `/docs/governance.md` scaffold row (roadmap Phase 0 Activity 8 and Generated-artifacts list both name it; propagated to README/QUICKSTART/`.claude/commands/template-init.md`'s scaffold-list mentions too); `/docs/status.md` scaffold row gains the "what is being brought" field (choice 1 now has a recorder, see `agents/orchestrator.md` v3.19); the telemetry-ledger/tracking-issue cell's ambiguous bare "Step 18"/"Step 4a" references - reintroduced by `prompt-087` into a cell `prompt-086` v1.5 had already disambiguated once - corrected again (prompt-089).
- v1.6: doc-consistency-reviewer batch fix: `/docs/status.md` scaffold row gains the telemetry-ledger and tracking-issue/Project-board URL fields this file's own later text already assumed get recorded there; frontmatter `description` now names all six scaffolded artifacts instead of four (prompt-087).
- Older entries: see `git log --follow` on this file (retention per `documentation-metadata-standard.md` Section 2.1, prompt-033).

---

## Purpose

Turn "I just created a repository from this template" into a working Phase 0 starting state with one command, safely re-runnable on any repository state. This automates the manual setup in `docs/manuals/operation-manual.md` Steps 1-3 without weakening any rule: the human still confirms before anything is written, and Spec Kit installation stays a human action.

## The idempotency contract (read first)

1. **Never overwrite.** An artifact that already exists is skipped and reported with the reason. If comparing would help the human (for example, an existing `docs/status.md` with a different shape), write `<name>.generated.md` beside it and report the pair - never replace the original.
2. **Second run is a no-op.** Running this procedure twice in a row must make the second run produce only the report, with every item listed as "skipped - already exists".
3. **No installs, no git operations, no network.** Verify and report; the human executes anything with side effects beyond creating the files listed below.

## Procedure

### 1. Detect the starting condition

Inspect the repository: source code, package manifests (`package.json`, `pyproject.toml`, `go.mod`, ...), existing CI beyond this template's own workflows, or a populated `.specify/` suggest **brownfield**; a docs-only tree matching this template's shipped layout suggests **greenfield**. State the inference and the evidence, then **ask the human to confirm** (per the human-interaction protocol, operation-manual Step 18: multiple-choice, with the inferred condition as the recommended option). Do not proceed on an unconfirmed guess.

### 2. Confirm the plan (Step 10 gate)

List exactly which of the artifacts below are missing and would be created. Wait for the go-ahead.

### 3. Scaffold only what is missing

Each artifact carries valid frontmatter per `docs/manuals/documentation-metadata-standard.md`, with `status: draft` (they are the project's artifacts to fill in) and today's date:

| Artifact | Content |
| --- | --- |
| `/docs/status.md` | `doc_type: status-artifact`. Records: what is being brought (unset until the orchestrator's Step 0 asks), starting condition (from step 1), roadmap path (unset until the orchestrator's Step 0 asks), interaction level (unset, default full-gate), phase-exit brief format (unset, default free-prose), telemetry-ledger adoption (unset until the `docs/telemetry/` row below is answered, asked in the `operation-manual.md` Step 18 human-interaction format; default: scaffold now), GitHub tracking-issue and Project-board URLs (unset until item 4a below records them), current phase: `Phase 0 - Foundation`, blockers: none, next step: run the orchestrator. |
| `/docs/adr/0000-adr-template.md` | `doc_type: adr`, `status: draft`. A blank ADR scaffold (Context / Decision / Status / Consequences) for the project's future decisions. Never overwrite or renumber ADRs already present in `docs/adr/` (this template ships `0002`-`0004` as its own real decisions); the worked-example ADR in `docs/manuals/examples/` stays untouched. |
| `/docs/handbook.md` | `doc_type: status-artifact`, `status: draft`. A stub with the sections the roadmap expects the handbook to grow (project summary, links to status/risks/ADRs/plan). |
| `/docs/risks.md` | `doc_type: governance`, `status: draft`. An empty risk-register scaffold (risk / likelihood / impact / mitigation / owner table) - roadmap Phase 0 requires an initial risk register and the flattened `/docs/risks.md` is its canonical location. |
| `/docs/governance.md` | `doc_type: governance`, `status: draft`. A document-ownership/decision-rights stub - roadmap Phase 0 Activity 8 and Phase 0's Generated-artifacts list both name it. |
| `docs/telemetry/` | README + empty `sessions.jsonl` + `session-entry.schema.json`, copied from [`docs/references/telemetry-template/`](../docs/references/telemetry-template/). Default-scaffolded, not mandatory - first ask a Step 18 choice, "A) Scaffold `docs/telemetry/` now - recommended" / "B) Skip - state why", and record the answer in `/docs/status.md` so the decision stays traceable. |
| `CHANGELOG.md` entry | Append an `### Added` line recording the bootstrap under `[Unreleased]` - only if no bootstrap entry already exists. |

### 4. Verify Spec Kit - report, don't install

If `.specify/` is absent, report the exact commands from `docs/manuals/operation-manual.md` Steps 1-2 as a briefed human task (why + numbered steps + what to report back), for example: 1. Open the terminal; 2. Run `uvx --from git+https://github.com/github/spec-kit.git specify init --here --ai claude`; 3. Report back "done". If present, report the detected agent adapters.

### 4a. Offer the GitHub tracking-issue + Project board setup

If `/docs/status.md` already records this choice, skip the question entirely and report it under **skipped** ("already recorded"), per the idempotency contract's second-run-is-a-no-op rule.

Otherwise: setting this up requires the GitHub API, which this procedure never touches directly - per the idempotency contract's "no installs, no git operations, no network," it is always a briefed human task, the same pattern item 4 above ("Verify Spec Kit - report, don't install") already uses. Ask a Step 18-style choice: "A) I'll walk you through setting up the GitHub tracking issue + Project board now - recommended" / "B) Skip - use `/docs/status.md` only." On (A), brief the numbered steps from `docs/manuals/role-operating-guide.md` Sections 14-15 (create the tracking Issue, paste the Section 17 checklist, create the Project, add the `Phase`/`Role` custom fields) and what to report back - report back explicitly includes the tracking-issue and Project-board URLs, so they can be recorded in `/docs/status.md` as clickable links (this is what makes `agents/orchestrator.md` Step 2's tracking-link rule satisfiable). Record the choice - and, on (B), the stated reason - in `/docs/status.md`.

### 5. Report and hand off

End with three lists: **created** (path + one-line purpose), **skipped** (path + reason), **human actions needed** (briefed per Step 18). Then hand off: in Claude Code, tell the human to run `/orchestrator`; in other tools, to load `agents/orchestrator.md` - its Step 0 records the startup choices this bootstrap left unset.

## Scope boundaries

- This procedure creates the artifacts listed above and nothing else. GitHub infrastructure (branch protection, release automation) is a separate, optional step: see `docs/references/infra-templates/`.
- It never edits this template's own manuals, agents, or prompts.
- Brownfield repositories get the same fill-gaps-only behavior; nothing existing is restructured.
