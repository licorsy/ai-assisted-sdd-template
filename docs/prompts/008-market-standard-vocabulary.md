---
title: "Prompt 008: adopt market-standard delivery vocabulary, re-scoped to what this repository actually has"
doc_type: prompt
description: "Disambiguates the two senses of `increment` that this corpus mixes - the process instance becomes `release cycle`, the delivered capability stays `Increment` in the Scrum sense - declares the phase model as Stage-Gate rather than leaving it an apparently bespoke scheme, and adds docs/manuals/glossary.md carrying both plus the four delivery surfaces (Roadmap, Board, Backlog, Reports) mapped onto this repository's real artifact names. Deliberately excludes three quarters of the source proposal: size-points, the versioned marker convention, and the migration note all target things that do not exist in this repository."
status: active
version: "1.0"
created: 2026-08-03
updated: 2026-08-03
language: en
id: 008-market-standard-vocabulary
tags: [prompt, vocabulary, glossary, stage-gate, scrum, delivery-surfaces]
owner: Alexandre Clemente
related: [006-absorb-local-notes-011-accepted-items, roadmap, operation-manual]
---

# Prompt 008: adopt market-standard delivery vocabulary, re-scoped

## ROLE

Act as the maintainer executing a founder ruling — that projects generated from this template should be born speaking the market's vocabulary, so an engineer, PM, or director understands the artifacts without being taught a bespoke model first — while holding the ruling to what this repository actually contains.

The temptation to resist: the source proposal shipped with a costed migration plan, and the cost was real *downstream*. Executing that plan here would mean **building the things it proposed migrating**, because most of them do not exist in this repository. A migration for a token with no referent is not a migration; it is a new feature wearing a migration's clothes.

## CONTEXT

The source proposal (carried up from `business-tech-agency`, recorded in `006-absorb-local-notes-011-accepted-items.md`) proposed six renames and warned that the item was "not adoptable without" a versioned marker convention plus a migration note, citing a rename downstream that cost four pull requests and roughly forty consistency findings.

Verification against this repository falsified most of it:

| Proposed change | State here |
| --- | --- |
| `size-points` (S=1/M=2/L=3) → story points | **No referent.** Zero occurrences outside the proposal itself; this repository has no estimation scale at all. |
| `🎯 … CLOSED` markers → "gates", with a versioned marker convention | **No referent.** The character appears twice in the repository, both inside the proposal. No parser exists in `.github/scripts/`, `gate-verification-template/`, or `telemetry-template/`; `duration_minutes` is a hand-written JSONL field, and the only gate parser reads `#### Phase N - Generated artifacts` headings. **The blocking prerequisite the proposal declared therefore does not apply.** |
| `cycle time`, `flow efficiency` — listed as "not touched, already correct" | **Absent.** Zero occurrences of either. They cannot be left untouched. |
| `acceptance criteria / Done` → Definition of Done | `definition of done` **already exists**, at *task* level (`roadmap.md` Phase 4, `role-operating-guide.md` §11), while `Acceptance criteria / Done` is the *phase*-level heading. A blanket rename would collapse a live distinction. |
| Destinations: a glossary, and a migration note | **Neither exists.** Both would have to be created. |
| `increment`, two senses mixed | **Real, and the actual work.** 43 occurrences outside the proposal, genuinely split between the process instance and the delivered capability. |

Standing precedent this has to clear: `docs/reports/PROPOSAL-TRACKING.md` records four vocabulary-only proposals rejected on principle — a "bare vocabulary addition, no described functional gap" is not adopted here. This prompt clears it on two grounds. The `increment` split is a genuine ambiguity, not a synonym swap: the same word names both the traversal and the thing the traversal delivers, in adjacent bullets of the same file. And declaring the model Stage-Gate follows the precedent `agents/orchestrator.md` already set when it named the reverse-the-conversation-direction practice — *naming an existing practice* with an established term, adding no dependency on the framework the term came from.

## TASK

1. **Split the two senses of `increment`.**
   - The **process instance** — a bounded traversal of the phases that ships — becomes **release cycle**. Sites: `roadmap.md` (the status-index column, the first-cycle bullet, the replanning activity, the `status.md` description), `operation-manual.md` (the inner/outer loop passage, the go-to-market Document-map row), `role-operating-guide.md`, `agents/doc-consistency.md`, `prompt-engineering-guide.md`'s P10 scratch-doc scope, `template-visual-overview.md`'s flowchart entry node, and `README.md`.
   - The **delivered capability** stays `Increment`, unchanged and uncommented: this is already the Scrum term and already correct. Sites: Phase 5's expected result, Phase 6's and Phase 7's acceptance criteria and inputs.
   - Two sites are genuinely undecidable from their own text and get an explicit ruling rather than a guess: `roadmap.md`'s Phase 6 goal ("Ensure the increment behaves as expected") and its Phase 5 security-trigger bullet ("if the increment is security-relevant"). **Both resolve to the delivered capability** — what is tested and what touches an auth surface is the shipped change, not the traversal. The identical trigger wording in `prompt-engineering-guide.md` P4, `operation-manual.md`'s `/security-review` row, and `template-visual-overview.md`'s `Q4` node resolves the same way, and must stay consistent with it.

2. **Declare the phase model.** State once, where the phases are defined, that Phases 0-8 with human-approved transitions are a **Stage-Gate** model (Cooper), and that the `🎯`-free gate points are stage gates. Name the agile equivalents alongside rather than replacing anything. This is a naming, not a restructuring: no phase changes, no criterion changes.

3. **Create `docs/manuals/glossary.md`**, carrying:
   - the `release cycle` / `Increment` distinction, so the split is documented where a reader looks it up rather than only in a changelog entry;
   - the Stage-Gate declaration and each stage's agile equivalent;
   - the **four delivery surfaces** — Roadmap/Timeline, Board, Backlog, Reports — mapped onto this repository's **real** artifact names. The source proposal's mapping named `specs/*/tasks.md`, which does not exist here (the artifact is `docs/task.md` or `.specify/tasks/sprint-backlog.json`), and "the observability artifacts", which is not an artifact set here at all — observability in this repository means runtime instrumentation, and `docs/reports/` is a false friend holding external improvement reports.
   - Terms already correct and deliberately untouched, so a future reader does not re-propose renaming them.

## REQUIREMENTS, CONSTRAINTS AND RULES

- **[CRITICAL]** Do not create the marker convention, the parser, `size-points`, or a migration note. Each targets something this repository does not have; building them to satisfy a migration plan would invert the plan's own purpose.
- **[CRITICAL]** Do not rename `Acceptance criteria / Done`. The phase-level heading and the task-level "definition of done" are different scopes that currently coexist correctly, and `docs/references/gate-verification-template/verify-gate.js` parses sibling headings in the same file.
- **[HIGH]** The four-surface table goes in the glossary only. `README.md` explicitly refuses a second copy of the Document map — *"this README used to carry a copy, which drifted"* — and `ADR-0003` principle 4 governs. One home, pointers elsewhere.
- **[HIGH]** Every `increment` → `release cycle` change is a judgment about which sense is meant. Where the text does not settle it, the ruling goes in this prompt (task 1 above), per the same-cycle-departure convention added in `006`.
- **[MEDIUM]** `docs/strategy/go-to-market.md` still uses the pre-split spelling and is **not touched here** — `009` handles that file, and editing it in both prompts would produce a conflict for no benefit.
- Worked examples under `docs/manuals/examples/` are frozen replace-me content and are not retrofitted.

## FORMAT AND OUTPUT

Executed as a new `docs/manuals/glossary.md`, plus `increment`-sense edits and the Stage-Gate declaration across `docs/strategy/roadmap.md`, `docs/manuals/operation-manual.md`, `docs/manuals/role-operating-guide.md`, `docs/manuals/prompt-engineering-guide.md`, `agents/doc-consistency.md`, `docs/visuals/template-visual-overview.md`, and `README.md`, plus `CHANGELOG.md`, `PROMPT-INDEX.md`, and a regenerated `docs/STATE.md`.

Verification: the five repo-local governance scripts pass, `node --test .github/scripts/*.test.js` passes, `docgov check` exits 0, and a final `grep -rn "ncrement"` shows every surviving occurrence is deliberately in the delivered-capability sense.
