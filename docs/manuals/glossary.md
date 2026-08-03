---
title: "Glossary"
doc_type: manual
description: "This operating model's vocabulary, stated in market-standard terms wherever one exists: the release cycle versus the Scrum Increment, the phase model named as Stage-Gate with each stage's agile equivalent, and the four delivery surfaces (Roadmap, Board, Backlog, Reports) mapped onto this repository's real artifacts. Exists so a reader who already knows Scrum, Kanban, or Stage-Gate does not have to learn a bespoke dialect first."
status: active
version: "1.0"
created: 2026-08-03
updated: 2026-08-03
language: en
id: glossary
tags: [glossary, vocabulary, stage-gate, scrum, delivery-surfaces, onboarding]
owner: Alexandre Clemente
related: [roadmap, operation-manual, role-operating-guide]
---

# Glossary

Roughly four fifths of this model's vocabulary is already the market's — `Epic`, `Story`, `Task`, `Milestone`, `sprint`, `Kanban`, `backlog`, `definition of done`, `acceptance criteria`. This file covers the rest: the two terms that were genuinely ambiguous, the name of the phase model itself, and the mapping onto the four views every delivery tool has converged on.

Diagrams orient and this glossary names; the roadmap and the operation manual govern.

## Release cycle vs. Increment

These were the same word until 2026-08-03, in adjacent bullets of the same file, which is why they now are not.

| Term | Means | Where you see it |
| --- | --- | --- |
| **Release cycle** | One bounded traversal of the phases that ships something. The *process instance* — "the third release cycle re-entered at Phase 2." | `status.md`'s current-position line, `backlog.md`'s status index, Phase 8's replanning activity, the outer loop |
| **Increment** | The working, usable capability a release cycle delivers. The *thing*, not the traversal. This is the Scrum Increment and was already correct. | Phase 5's expected result, Phase 6 and Phase 7 acceptance criteria and inputs |

Two places name the delivered capability where the sentence alone leaves it open, and are settled deliberately: Phase 6's goal ("ensure the increment behaves as expected") and the security trigger ("if the increment is security-relevant"). Both mean the shipped change — what gets tested, and what touches an authentication surface, is the capability, not the traversal. The identical trigger wording in `prompt-engineering-guide.md`'s P4, `operation-manual.md`'s `/security-review` row, and the visual overview's decision flowchart resolves the same way.

## The phase model is Stage-Gate

Phases 0-8, each ending in a human-approved transition that can return work rather than only advance it, is **Stage-Gate** (Robert G. Cooper). The phase-transition approval points are **stage gates**.

Saying so takes on no dependency on Cooper's wider framework and changes no phase. It is here so the model reads as something recognizable rather than something bespoke.

| Phase | Stage-Gate role | Nearest agile equivalent |
| --- | --- | --- |
| 0 - Foundation | Scoping | Project inception / sprint zero |
| 1 - Discovery | Build the business case | Product discovery |
| 2 - Planning | Development plan | Release planning |
| 3 - Designing | Development (design) | Architecture spike, spec sign-off |
| 4 - Decomposition | Development (breakdown) | Backlog refinement, sprint planning |
| 5 - Development | Development (build) | Sprint execution |
| 6 - Testing | Testing and validation | Sprint review, acceptance |
| 7 - Deployment | Launch | Release |
| 8 - Maintenance | Post-launch review | Retrospective, then next-cycle planning |

The equivalences are approximate on purpose. A phase here is a gate with recorded artifacts, not a timebox; Phase 5 is not literally a sprint, and nothing about the roadmap assumes a fixed cadence.

## The four delivery surfaces

Jira, Monday, and Asana all converged on the same four views. This model produces all four — in Markdown rather than rendered, which is why they can be hard to see.

| Surface | Question it answers | This model's artifact |
| --- | --- | --- |
| **Roadmap / Timeline** | What comes when, by epic | `/docs/plan.md` (Phase 2) |
| **Board** | What is in flight now | `docs/task.md` or `.specify/tasks/sprint-backlog.json` (Phase 4) |
| **Backlog** | What has not started, ordered | `/docs/references/backlog.md`, with its release-cycle status index |
| **Reports / Insights** | How the process is going | `/docs/status.md`, `docs/references/retrospective.md`, `docs/references/test-report.md`, and `docs/telemetry/sessions.jsonl` where a project adopted it |

Two false friends worth naming, because both have been mistaken for the Reports surface:

- **`docs/reports/`** holds *external improvement reports* about this template and their proposal-tracking index. It has nothing to do with delivery reporting.
- **Observability**, in this repository, means the P6 runtime baseline — structured logs, error tracking, a health endpoint. It is production instrumentation, not a document set.

## Deliberately unchanged

Recorded so a future reader does not re-propose renaming them:

- **`Acceptance criteria / Done`** stays the *phase*-level heading. `definition of done` already exists here at *task* level. They are different scopes, and collapsing them into one term would lose the distinction. `docs/references/gate-verification-template/verify-gate.js` also parses sibling headings in that file.
- **`Epic`, `Story`, `Task`, `Milestone`, `sprint`, `Kanban`, `WIP`** are already the market's words and are used as such.
- **No estimation scale** is defined anywhere in this model — not story points, not t-shirt sizes. Phase 2 says "estimate effort" and leaves the unit to the project. A generated project that wants story points adds them; nothing here needs renaming for it to.
