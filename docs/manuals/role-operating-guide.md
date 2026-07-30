---
title: "Role Operating Guide — Product, Delivery, and All Lifecycle Roles"
doc_type: manual
description: "Single operating guide covering the project/product/product-owner surface and its extension to every other lifecycle role (architect, engineer, QA, DevOps, scrum master, stakeholder) for one person operating solo across the full roadmap."
status: active
version: "2.8"
created: 2024-07-04
updated: 2026-07-28
language: en
id: role-operating-guide
tags: [project-management, product-management, product-ownership, all-roles, solo-operator, role-switching, github-issues, scrum]
owner: Alexandre Clemente
related: [operation-manual, roadmap, go-to-market, init]
---

# Role Operating Guide — Product, Delivery, and All Lifecycle Roles

Changelog of this document:

- v2.8: doc-consistency-reviewer batch fix: Section 9's Scrum master row and Section 10's Retrospective row both sent retrospective notes to `/CHANGELOG.md`/`/docs/status.md`, contradicting `roadmap.md` Phase 8 Activities 4/4c, which mandate `docs/references/retrospective.md` as the actual artifact and prune the narrative out of `status.md` (prompt-092).
- v2.7: doc-consistency-reviewer batch fix: Section 17's checklist item named only 2 of 5 Step 0 startup choices ("starting condition, roadmap path") - now points at "All Step 0 startup choices" (prompt-090).
- v2.6: doc-consistency-reviewer batch fix: Section 13 step 1's status-check line named only 3 of 5 Step 0 startup choices - now points at "the Step 0 startup choices" (prompt-089).
- Older entries: see `git log --follow` on this file (retention per `documentation-metadata-standard.md` Section 2.1, prompt-033).

---

## 1. Why one document for every role

Project manager, product manager, and product owner are distinct roles with distinct default questions:

- **Project manager** asks: is this on schedule, within budget, and are dependencies and risks under control?
- **Product manager** asks: are we building the right thing, for the right users, for the right reasons?
- **Product owner** asks: is the backlog correctly ordered, and does the team know exactly what "done" means for the next item?

One person can hold all three without confusion only if they know, at any given moment, which question they are answering. That is the concern of Part I.

A solo operator on this template's roadmap also has to perform the rest of the lifecycle: architecture, engineering, quality assurance, DevOps, scrum facilitation, and standing in for the stakeholder voice. That is the concern of Part II — someone who is, at different moments of the same day, all of the following:

- Project manager
- Product manager
- Product owner
- Architect
- Software engineer / developer
- Scrum master
- Stakeholder (proxy for whoever will ultimately use or fund the system)
- QA / quality assurance engineer
- DevOps engineer

This document exists to make each hat-switch explicit rather than implicit, whichever of the nine roles is currently active.

## 2. Full role definitions and primary artifacts

| Role | Owns | Primary artifact | Roadmap phase(s) where it leads |
| --- | --- | --- | --- |
| Project manager | Schedule, budget, dependencies, cross-phase risk | `/docs/plan.md`, `/docs/risks.md` | Phase 0, Phase 2, Phase 7 |
| Product manager | Problem framing, value, prioritization, outcome alignment | `/docs/prd.md`, `/docs/business/market.md` | Phase 1 |
| Product owner | Backlog order, acceptance criteria, definition of done | `/docs/references/backlog.md`, task acceptance criteria | Phase 3 (spec sign-off), Phase 4, Phase 6 |
| Architect | System structure, technology choices, non-functional guarantees | `.specify/memory/constitution.md`, `/docs/references/data-model.md`, ADRs | Phase 3 |
| Software engineer / developer | Working code that matches the spec | Source code, tests | Phase 5 |
| Scrum master | Cadence, flow, removing self-imposed blockers | `/docs/status.md`, sprint or Kanban board | All phases, as facilitator |
| Stakeholder (proxy) | Business intent, priority tradeoffs, final acceptance | PRD sign-off, phase transition approvals | Phase 1, Phase 2, every phase-gate approval |
| QA / quality assurance engineer | Test coverage, defect detection, release readiness | `/docs/references/test-report.md`, defect log | Phase 6 |
| DevOps engineer | Build, release, environment, and operational reliability | CI/CD configuration, deployment scripts, monitoring setup | Phase 7, Phase 8 |

## 3. Resolving role conflicts among the product/delivery roles

When acting alone across the first three roles, resolve role conflicts by asking, in order: "What is true about the problem or user (product manager)? What does that mean for the backlog (product owner)? What does that mean for schedule and risk (project manager)?" This order prevents schedule pressure from silently overriding product truth.

---

## Part I — Product, Delivery, and Method Decisions

### 4. Operating principles

1. Start with the user problem, not the solution.
2. Prefer small, testable increments.
3. Keep the backlog ordered by business value and dependency risk.
4. Separate discovery work from delivery work when uncertainty is high.
5. Make acceptance criteria explicit before work begins.
6. Review progress frequently and re-prioritize when evidence changes.
7. Use lightweight artifacts that stay current.
8. Keep decisions visible, even when there is no separate audience but yourself in a future session.
9. Track schedule and risk as a first-class concern, not an afterthought bolted onto product work.

### 5. Role-by-phase mapping (product/delivery lens)

Use this table to know which of the three product/delivery hats is primary in each roadmap phase (`docs/strategy/roadmap.md`). All three roles stay present throughout; this identifies which one leads. See Section 8 for the whole-team lens across all nine roles.

| Roadmap phase | Leading role | What that role does here |
| --- | --- | --- |
| Phase 0 - Foundation | Project manager | Set up governance, ownership model, and the risk register |
| Phase 1 - Discovery | Product manager | Frame the problem, research market and alternatives, define MVP scope |
| Phase 2 - Planning | Project manager, with product manager input | Turn the PRD into a schedule, sequence, and risk-adjusted plan |
| Phase 3 - Designing | Product owner, with project manager tracking risk | Confirm the spec reflects real priorities before it becomes the technical source of truth |
| Phase 4 - Decomposition | Product owner | Order the backlog, write acceptance criteria for each task |
| Phase 5 - Development | Product owner | Answer implementation questions against acceptance criteria; project manager tracks progress against plan |
| Phase 6 - Testing | Product owner | Confirm acceptance criteria are actually met |
| Phase 7 - Deployment | Project manager | Confirm release readiness, coordinate the merge and rollout |
| Phase 8 - Maintenance | All three, in rotation | Revisit backlog value (product manager), plan (project manager), and definition of done (product owner) |

### 6. Method and tooling decisions

Condensed decision tables; the frameworks themselves are general knowledge and are deliberately not re-explained here.

**Method selection:**

| Work pattern | Method | One-line rule |
| --- | --- | --- |
| Predictable delivery cadence, self-imposed review points useful | Scrum (solo-scaled: sprint goal, sprint backlog, planning/review/retro per Section 10) | Keep the sprint backlog stable unless there is an explicit tradeoff decision |
| Continuous, operational, or mixed-priority flow | Kanban | Limit work in progress aggressively — a solo operator context-switching across nine hats is the person most at risk of too much WIP |
| Either | Agile as the umbrella philosophy | Iterate, inspect, adapt; never confuse the mindset with a specific ritual set |
| Discovery-heavy and delivery-heavy at once | Split them | Lightweight discovery track + Scrum/Kanban delivery track; resolve hat conflicts by Section 3's question order |

**Prioritization framework picks:**

| Situation | Framework |
| --- | --- |
| Cutting a release scope quickly | MoSCoW |
| Comparing multiple candidate initiatives quantitatively | RICE |
| Sequencing driven by cost of delay | WSJF |
| Understanding delight vs. basic expectations during discovery | Kano |

**Work tracking (GitHub-native):**

- **Issues are the atomic record**: one issue = one coherent deliverable, with context, acceptance criteria, labels, and links to spec/ADR; split when too large, state the blocker when blocked, close by referencing the resolved artifact.
- **Projects are the planning view**: board for execution, table for filtering, roadmap view for milestones; recommended custom fields `Phase` (roadmap phase names) and `Role` (Section 2's roles). Never duplicate an issue's full text into the board.
- **Whole-roadmap visibility**: the tracking-issue pattern, Part III.

**Cadence and status format**: weekly — review active issues, reorder by evidence, check blockers, confirm the next highest-value item, update the board, write a short `/docs/status.md` update. Every update answers five things: what changed, why it matters, what is next, what is blocked, what decision is needed. Do not hide risk from yourself by skipping `/docs/risks.md`; do not present assumptions as commitments.

---

## Part II — Extending to the Full Lifecycle: All Other Roles

### 7. The core risk of one person holding every role

The single biggest risk is not lack of skill; it is **silent role collapse** - reviewing your own work as if you were a different, harder-to-please person, but actually applying the same lenient judgment throughout because it is the same brain in the same sitting.

Mitigations:

1. **Name the hat before acting.** State which role is currently active before doing non-trivial work in that role (this can be as short as a one-line prefix: "Wearing QA hat:").
2. **Use the independent reviewer for the roles most prone to self-approval.** `agents/phase-reviewer.md` exists specifically so that "developer says it's done" and "someone confirms it's done" are not the same reasoning pass.
3. **Separate the stakeholder hat from the delivery hats in time, not just in labeling.** Approve a phase transition in a distinct step from the one where you produced the artifact, ideally after a break, not in the same breath.
4. **Let AI agents hold roles you are not currently wearing.** When acting as developer, have a separate agent invocation act as reviewer or QA, using a fresh context (see `docs/manuals/operation-manual.md`, Step 16).

### 8. Role-by-phase mapping across the full lifecycle

This table gives the whole-team lens across all nine roles — which one leads overall, and who supports in the background. It complements Section 5's narrower "which of the three product/delivery hats is primary" lens; the two can name different leads for the same phase (for example, Phase 3 below names the Architect as overall lead, while Section 5 names the Product owner as the leading product/delivery hat within that phase) because they are answering different questions, not disagreeing.

| Roadmap phase | Leading role(s) | Supporting roles active in the background |
| --- | --- | --- |
| Phase 0 - Foundation | Project manager | Scrum master (sets up cadence), Architect (ADR template and first ADR) |
| Phase 1 - Discovery | Product manager, Stakeholder | Project manager (feasibility), Architect (prior-art and build-vs-buy) |
| Phase 2 - Planning | Project manager | Product owner (backlog shape), Stakeholder (approval) |
| Phase 3 - Designing | Architect | Product owner (spec reflects priorities), DevOps (deployment constraints considered early) |
| Phase 4 - Decomposition | Product owner | Architect (task boundaries respect the design), Scrum master (sequencing) |
| Phase 5 - Development | Software engineer / developer | Architect (design conformance), Product owner (acceptance criteria) |
| Phase 6 - Testing | QA / quality assurance engineer | Software engineer (fixes), Product owner (criteria confirmation) |
| Phase 7 - Deployment | DevOps engineer | Project manager (release coordination), Stakeholder (go/no-go) |
| Phase 8 - Maintenance | Scrum master, Project manager | All roles, in rotation, per `docs/strategy/roadmap.md`'s Phase 8 - Maintenance activities |

### 9. Tooling by role

| Role | Tools |
| --- | --- |
| Project manager | GitHub Projects (roadmap and table views), `/docs/plan.md`, `/docs/risks.md` |
| Product manager | Market/web research tools, `/docs/prd.md`, `/docs/business/market.md` |
| Product owner | GitHub Issues, `/docs/references/backlog.md`, acceptance criteria templates |
| Architect | ADRs, diagramming (text-based, versioned), `.specify/memory/constitution.md`, Spec Kit (`/speckit.constitution`, `/speckit.specify`, `/speckit.plan`) |
| Software engineer / developer | The coding agent, Spec Kit (`/speckit.implement`), version control, local test runner |
| Scrum master | GitHub Projects board, `/docs/status.md`, `docs/references/retrospective.md` |
| Stakeholder (proxy) | PRD, plan, and phase-gate summaries produced by the orchestrator prompt |
| QA / quality assurance engineer | Automated test suite, `/docs/references/test-report.md`, defect log in GitHub Issues |
| DevOps engineer | CI/CD pipeline configuration, deployment scripts, monitoring and alerting configuration, `/CHANGELOG.md` |

See `docs/manuals/operation-manual.md`, Step 15, for the general activity-to-tool mapping this table extends.

### 10. Agile ceremonies, scaled to one person

| Ceremony | Solo adaptation |
| --- | --- |
| Sprint planning | Write the sprint goal and select items in `/docs/status.md` before starting work; do not skip writing it down even though no one else is reading it live |
| Daily stand-up | A one-paragraph self-check at the start of a work session: what changed since last session, what is next, what is blocked |
| Sprint review | Re-read the sprint goal against what was actually produced, in a separate step from producing it |
| Retrospective | A short entry in `docs/references/retrospective.md` (the roadmap's Phase 8 artifact): what worked, what to change next cycle, and the process-review decision - `/CHANGELOG.md` and `/docs/status.md` carry pointers to it, not the narrative itself (`docs/strategy/roadmap.md`, Phase 8, activities 4 and 4c) |
| Backlog refinement | A recurring pass over `/docs/references/backlog.md`, wearing the product owner hat specifically, not blended into development work |

### 11. Definition of done, per role

A task is not "done" until every role that would normally sign off has, even when they are the same person:

- **Product owner**: acceptance criteria are met, with evidence, not assumption.
- **Software engineer**: the code runs, compiles, and passes local checks.
- **QA**: the automated test suite passes and the happy path plus main edge cases were exercised.
- **Architect**: the change respects the constitution and does not silently violate a prior ADR.
- **DevOps**: the change can actually be deployed with the current pipeline, not just run locally.
- **Project manager**: the change is recorded in the plan, status, and changelog.
- **Stakeholder**: the change still serves the goal recorded in the PRD.

If time pressure makes it tempting to skip one of these checks, that is precisely the situation `agents/phase-reviewer.md` is designed to catch.

### 12. Escalation without a team

When something goes wrong and there is no one else to escalate to:

1. Stop and write down what is blocking progress in `/docs/risks.md` or `/docs/status.md`.
2. Separate "I don't know the answer" (research or ask an agent) from "I don't have the authority to decide this alone" (this rarely applies solo, but document the decision anyway as if it might be questioned later).
3. If a decision reverses a prior ADR, write the new ADR referencing the old one instead of quietly overwriting the record.
4. Use `agents/phase-reviewer.md` as a stand-in for a second opinion when a decision feels uncertain.

### 13. Ready-to-use daily flow for the solo operator

1. Open `/docs/status.md`; confirm current phase, the Step 0 startup choices, and next step (project manager / scrum master hat).
2. Do the work the current phase calls for, one role at a time, naming the hat (see Section 7).
3. Before closing a task, run the relevant Definition of Done checks from Section 11.
4. For any phase-gate or hard-to-reverse decision, run `agents/phase-reviewer.md` in a fresh context before approving the transition (stakeholder hat).
5. Update `/docs/status.md` and `/CHANGELOG.md` before ending the session; if the project has adopted `docs/telemetry/` (`docs/references/telemetry-template/`), append the session's entry to `docs/telemetry/sessions.jsonl` in the same step.

---

## Part III — Tracking the Whole Roadmap as a Single Checklist

GitHub's native tooling supports following the entire roadmap as one live checklist, without adding a new tool.

### 14. The tracking-issue pattern

1. Create one GitHub Issue titled something like "Project roadmap tracker".
2. Paste the checklist from Section 17 into its body, using standard markdown task-list syntax (`- [ ]`). GitHub renders this as a progress bar on the issue and on any Project board card linked to it.
3. When work on a specific phase begins, create a dedicated Issue for it, and turn the corresponding checklist line into a reference to that Issue (for example, `- [ ] Phase 1 - Discovery (see #12)`). GitHub tracks sub-issue completion and rolls it up into the parent's progress bar.
4. Check off a phase only when its own Acceptance Criteria / Done items in `docs/strategy/roadmap.md` are actually met, not when work merely started.
5. Pin the tracking issue so it is the first thing visible when opening the repository's Issues tab.

### 15. Project board setup

1. Create one GitHub Project for the whole roadmap.
2. Add a custom field `Phase` with one option per roadmap phase (Phase 0 through Phase 8).
3. Add a custom field `Role` with one option per role from Section 2, so board items can be filtered by which hat currently owns them.
4. Use a Board view grouped by `Phase` for execution, and a Table view for filtering by `Role` or `Status`.
5. Link the tracking issue itself to the Project so overall progress is visible alongside individual work items.
6. Record the tracking Issue's and Project's URLs in `/docs/status.md` as clickable links, so `agents/orchestrator.md`'s Step 2 rule can resurface them at every session start and phase exit.

### 16. When to update the checklist versus when to update status.md

- The tracking issue's checklist is the coarse, always-visible progress view (which phases are done).
- `/docs/status.md` remains the detailed, narrative current-state record (blockers, decisions, next step).
- Update both at the same time when a phase closes; if they disagree, `/docs/status.md` is the source of truth and the checklist should be corrected to match it.
- A single "current phase" field is not enough on its own: name both the outer loop (which increment/cycle - Phase 8 re-entering Phases 1-7) and the inner loop (which step inside the current phase). A project reading only "current phase" can look stuck permanently when it is actually cycling normally between increments (`docs/manuals/operation-manual.md`, Step 14).

### 17. Phase-level roadmap checklist (copy into the tracking issue)

Deliberately phase-level: each phase's detailed Acceptance Criteria / Done items live only in `docs/strategy/roadmap.md` and are checked there, so this list never needs to be kept in sync with criteria wording. When ticking a phase line, open the roadmap's matching "Acceptance criteria / Done" section and verify every item.

```markdown
## Project roadmap tracker

Checklist rule: tick a phase only after verifying every item in that phase's
"Acceptance criteria / Done" section of
docs/strategy/roadmap.md.

- [ ] All Step 0 startup choices recorded in /docs/status.md (agents/orchestrator.md,
      Step 0), plus telemetry-ledger adoption and tracking-issue/Project-board URLs
      if adopted
- [ ] Phase 0 - Foundation — criteria verified in the roadmap
- [ ] Phase 1 - Discovery — criteria verified in the roadmap
- [ ] Phase 2 - Planning — criteria verified in the roadmap
- [ ] Phase 3 - Designing — criteria verified in the roadmap (adversarial review recommended; independent review mandatory)
- [ ] Phase 4 - Decomposition — criteria verified in the roadmap (first round = walking skeleton)
- [ ] Phase 5 - Development — criteria verified in the roadmap
- [ ] Phase 6 - Testing — criteria verified in the roadmap
- [ ] Phase 7 - Deployment — criteria verified in the roadmap (pipeline-driven, human-approved promotion, tested rollback)
- [ ] Phase 8 - Maintenance — criteria verified in the roadmap
```

### 18. Optional Claude-Code visual status view

In Claude Code specifically - not a mechanism this template requires, and not available the same way in other AI coding tools - the human can ask the agent to render a visual HTML status dashboard (current phase, next step, the Section 17 checklist) as an Artifact. It is generated from the already-current `/docs/status.md`/`docs/STATE.md` - a local snapshot, not a live GitHub sync - so it carries no new dependency and no `gh`/MCP requirement. Useful when the tracking issue/Project board (Sections 14-15) or a wall of status text still feels like more than is needed for a quick look.
