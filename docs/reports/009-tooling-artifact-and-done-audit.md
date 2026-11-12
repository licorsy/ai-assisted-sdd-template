---
title: "Tooling Currency, Generated Artifacts and Done Criteria Audit (2026-11-12)"
doc_type: product-doc
description: "Audit of this template on 2026-11-12 along three axes: whether its tools are current and stable (Spec Kit, GitHub Actions, pre-commit hooks, plugins, the tool catalog), whether the artifacts each roadmap phase generates are necessary, useful and in line with current market practice, and whether each phase's acceptance criteria / Done can actually be checked. Each finding has an R009 id; its status lives in docs/reports/PROPOSAL-TRACKING.md, which is the checklist."
status: active
version: "1.0"
created: 2026-11-12
updated: 2026-11-12
language: en
id: tooling-artifact-done-audit-2026-11-12
tags: [audit, spec-kit, github-actions, artifacts, acceptance-criteria, definition-of-done]
owner: Alexandre Clemente
related: [report-proposal-tracking, roadmap, operation-manual, tool-library-catalog]
diataxis: reference
---

# Tooling Currency, Generated Artifacts and Done Criteria Audit

Produced by `docs/prompts/025-tooling-artifact-done-audit.md` on 2026-11-12. This file holds the evidence. The checklist (one row per finding, with its status) is the `R009` section of [PROPOSAL-TRACKING.md](PROPOSAL-TRACKING.md). Update that file as items land, never this one.

**Priority:** `P1` blocks or degrades the next project generated from this template. `P2` is worth doing in the next maintenance window. `P3` is opportunistic.

**Sources, all checked on 2026-11-12:**
- The GitHub API for the latest release and tags of each tool.
- Spec Kit's own documentation at tag `v1.4.0`: [README](https://github.com/github/spec-kit/blob/v1.4.0/README.md), [installation](https://github.com/github/spec-kit/blob/v1.4.0/docs/installation.md), [Claude Code integration](https://github.com/github/spec-kit/blob/v1.4.0/docs/integrations/claude.md) and [existing projects](https://github.com/github/spec-kit/blob/v1.4.0/docs/how-to/existing-projects.md).
- The Spec Kit 1.3.1 templates installed in a project generated from this template.
- That generated project's tree, as evidence of what a generated project actually inherits.

## A. Tooling currency

### A.1 Spec Kit

The latest stable release is `v1.4.0` (2026-11-10), with `requires-python >=3.11`. Releases are very frequent: six between 2026-11-02 (`v1.2.6`) and 2026-11-10 (`v1.4.0`). Still valid in `v1.4.0`: `--here`, `--integration`, `--script sh` and the Python 3.11+ prerequisite.

| ID | Finding | Where | Proposal | Priority |
|---|---|---|---|---|
| R009-A1 | **Install is unpinned.** `uvx --from git+https://github.com/github/spec-kit.git` takes whatever `main` holds that day. The generated project got `1.3.1.dev0`, a development build. Spec Kit's installation guide recommends installing from source pinned to a release tag. | `docs/manuals/operation-manual.md` Steps 1-2, `agents/init.md` step 4, roadmap Phase 3 Activity 9 | Pin the tag: `uv tool install specify-cli --from git+https://github.com/github/spec-kit.git@v1.4.0`. Record the pinned version and the date it was verified next to the command. `/template-init` reports `specify version`. | P1 |
| R009-A2 | **Old invocation syntax.** The documents write `/speckit.<command>` 85 times across 9 files. The Claude integration installs skills at `.claude/skills/speckit-<command>/`, and they are invoked as `/speckit-<command>` (Spec Kit's [Claude Code integration page](https://github.com/github/spec-kit/blob/v1.4.0/docs/integrations/claude.md)). | roadmap, operation-manual, `agents/orchestrator.md`, `agents/tool-discovery.md`, prompt-engineering and role guides, visual overview | Write `/speckit-<command>` for Claude Code, and point to Spec Kit's per-agent invocation table for the other integrations. | P1 |
| R009-A3 | **`converge` is missing.** Spec Kit's minimal flow now ends with `/speckit-converge`, repeated after implement until it reports `Converged`. The template never mentions it. | roadmap Phase 5, operation-manual | Add it to Phase 5 Activities and to Phase 5 Done (see R009-C5). | P1 |
| R009-A4 | **No upgrade or existing-project path.** Spec Kit documents `specify integration upgrade <key>` and, for existing code, `specify init --here --force --integration <key>`. The template has neither. | operation-manual | One short step: how to upgrade a pinned install, and the brownfield command. | P2 |
| R009-A5 | **Skill-listing cost.** Every Spec Kit skill is model-invocable by default, so its description is always in context. `--integration-options="--no-model-invocation"` makes the core skills user-invocable only. | operation-manual Step 2 | Offer it as the token-economy default, with Spec Kit's caveat about extension hooks. | P3 |

### A.2 GitHub Actions and pre-commit hooks

| ID | Item | Used | Latest | Where |
|---|---|---|---|---|
| R009-A7 | `actions/checkout` | `v4` | `v7.0.1` | this template's own CI (9 uses) |
| R009-A7 | `actions/setup-python` | `v5` | `v7.1.0` | `pr-checks.yml` |
| R009-A7 | `actions/upload-artifact` | `v4` | `v7.0.2` | `scorecard.yml` |
| R009-A7 | `github/codeql-action/upload-sarif` | `v3` | `v4.39.3` | `scorecard.yml` |
| R009-A8 | `actions/checkout` (SHA-pinned) | `v4.2.2` | `v7.0.1` | `infra-templates/deploy/deploy.yml` |
| R009-A8 | `googleapis/release-please-action` (SHA-pinned) | `v4.4.0` | `v5.0.0` (major) | `infra-templates/release-please.yml` |
| R009-A8 | `amannn/action-semantic-pull-request` (SHA-pinned) | `v6.1.1` | `v6.1.2` | `infra-templates/conventional-commits.yml` |
| R009-A9 | `pre-commit/pre-commit-hooks` | `v4.6.0` | `v6.0.0` | `.pre-commit-config.yaml` |
| R009-A9 | `compilerla/conventional-pre-commit` | `v3.4.0` | `v4.5.0` | `.pre-commit-config.yaml` |

Already current: `ossf/scorecard-action@v2` (resolves to `v2.5.0`) and `licorsy/platform-workflows@v1` (resolves to `v1.3.1`).

- **R009-A7 (P2).** This template's own CI uses floating major tags, while the templates it ships to generated projects pin commit SHAs, the practice it recommends. Bump the majors and pin by SHA with a `# vX.Y.Z` comment, the same convention as `infra-templates/`.
- **R009-A8 (P2).** Bump the three SHA-pinned templates. `release-please-action` v5 is a major release, so read its release notes before bumping.
- **R009-A9 (P2).** Bump both hook revisions and run the hooks once on the whole tree.
- **R009-A10 (P3).** Make the check repeatable: GitHub's native version updates for the `github-actions` ecosystem, so this table does not have to be rebuilt by hand.

### A.3 Plugins and the tool catalog

| ID | Finding | Proposal | Priority |
|---|---|---|---|
| R009-A11 | `.claude/settings.json` enables `git-governance` and `docs-governance`, but declares no marketplace to install them from, and no document says how to install them. A generated project gets the setting without the plugins. `interaction-governance` and `model-governance` are not mentioned anywhere. | Check the Claude Code settings documentation for declaring a project marketplace, then either declare it or add an install step. Decide whether generated projects should also enable the other two plugins. | P2 |
| R009-A12 | GitHub Releases in the `licorsy` plugin repositories lag their tags: `docs-governance` release `v1.3.2` vs tag `v1.6.0`, `git-governance` `v1.4.1` vs `v1.7.0`, `platform-workflows` `v1.1.1` vs `v1.3.1`. | Outside this repository: publish a release per tag in those repositories. | P3 |
| R009-A13 | Catalog drift, `lastreviewed` 2026-07-31. `graphify` moved to a new organization and its license is now Apache-2.0, while the catalog and `docs/references/token-economy.md` say MIT. `lyndonkl/claude` still has no license, as the catalog already says. The other entries are active. | Re-vet `graphify` (source URL, license, security level) and bump `lastreviewed`. | P2 |
| R009-A14 | **Idea kept as this repository's own proposal** (the third-party catalog entry that suggested it was removed on 2026-11-12 at the owner's request, R009-A15). One idempotent command that applies `infra-templates/` to a repository: rulesets through `gh api`, the Conventional Commits check, release-please and `CODEOWNERS`. It also resolves every `uses:` tag to its commit SHA and keeps a `# vX.Y.Z` comment, and a second run reports a no-op. | Fold into template issue #59 (`/template-init` sets up Git governance). The SHA-resolving part also serves R009-A7 and A8. | P2 |

## B. Generated artifacts

### B.0 Cross-cutting

| ID | Finding | Proposal | Priority |
|---|---|---|---|
| R009-B0 | **Template-maintenance files leak into generated projects.** The generated project inherited this repository's own `docs/prompts/001-…`, `docs/reports/ARTIFACT-NECESSITY-AUDIT.md` and `docs/reports/PROPOSAL-TRACKING.md`, ADRs `0002`-`0005`, a `CHANGELOG.md` whose intro still says "this template", and an `AGENTS.md` that describes the template. A scaffold should ship only what the new project uses. | Declare the template-only set in one list. `/template-init` removes or archives it and starts a fresh `CHANGELOG.md`, `AGENTS.md`/`CLAUDE.md` and ADR sequence. Extends issue #60. | P1 |
| R009-B1 | **No required/optional tier per artifact.** Phases 0-3 generate about 25 documents before any code. For the solo-operator audience in ADR-0002, that is heavy, and the short path (Section 4.2) only skips whole phases. | Mark every Generated-artifacts bullet as `required`, `conditional (trigger)` or `optional`, so a phase can close lean. | P2 |

### B.1 Per phase

| ID | Phase | Finding | Proposal | Priority |
|---|---|---|---|---|
| R009-B2 | 0 | The base set (handbook, status, risks, governance, ADR template, CHANGELOG, telemetry) is sound and conventional. Two gaps: the generated project's own `AGENTS.md`/`CLAUDE.md` (the context file every coding agent reads first) is not a Phase 0 artifact, and no artifact states what `README.md` holds versus `handbook.md`. | Add the project's own `AGENTS.md` (plus the `CLAUDE.md` pointer) and `README.md` to Phase 0. `README.md` is the entry point and `handbook.md` the operating detail. | P1 (with B0) |
| R009-B3 | 1 | Nine files, five of which restate one another: `problem-statement`, `requirements`, `user-stories`, `mvp-scope` and `prd`. Market-standard PRDs hold all of them as sections (problem, goals and success metrics, users, functional and non-functional requirements, scope and non-goals). `brainstorm` and `tree-of-thought-brainstorm` are two process notes on one question. Spec Kit's `specs/[NNN-feature-name]/spec.md` already carries user stories with Given/When/Then scenarios, `FR-###` requirements and measurable `SC-###` success criteria per feature. | Phase 1 produces `prd.md` (with the sections above, success metrics and non-functional requirements with targets), one alternatives document, `build-vs-buy.md`, and `market.md` (optional for internal tools). The PRD lists features; `specs/[NNN-feature-name]/spec.md` details each one, so stories are not written twice. | P2 |
| R009-B4 | 2 | `docs/plan.md` (project plan) shares its name with Spec Kit's `specs/[NNN-feature-name]/plan.md` (technical plan). The backlog can live in four places: `docs/references/backlog.md`, `docs/task.md`, `specs/*/tasks.md` and GitHub Issues. | Rename the project plan (for example to a delivery plan). Name one backlog source of truth; the others link to it. | P2 |
| R009-B5 | 3 | `/speckit-plan` also writes `specs/[NNN-feature-name]/research.md`, `specs/[NNN-feature-name]/data-model.md`, `specs/[NNN-feature-name]/quickstart.md` and `specs/[NNN-feature-name]/contracts/`, which overlaps `docs/references/data-model.md` and `integration-points.md`. "Architecture diagrams" has no path, and the threat model of Activity 7a has no home or method. | Keep the `docs/references/` versions only as cross-feature views, created when a second feature exists. Name one architecture document with C4 context and container diagrams in Mermaid. Name the threat-model section and its method (STRIDE) when 7a fires. | P2 |
| R009-B6 | 4 | Spec Kit's tasks template marks tests as optional ("only if tests requested"), while this template's Phase 5 is test-first by default. Run unprompted, `/speckit-tasks` therefore generates no test tasks. | Phase 4 Activity 3 tells `/speckit-tasks` to include tests for every acceptance scenario. (Paths were already fixed by issue #66, PR #69.) | P1 |
| R009-B7 | 6 | "Defect log" has no path. | Name it: GitHub Issues with a `bug` label (the market default), or a defect-log document under `docs/references/` when the project has no tracker. | P2 |
| R009-B8 | 7 | "Integrated code" is not an artifact. The market-standard release outputs are missing: version tag, release notes, deployment record and rollback procedure. | List the SemVer tag and release notes (release-please already produces both), the deployment record and a runbook section with the rollback steps. | P2 |
| R009-B9 | 8 | The retrospective is sound. Two common practices are absent: a blameless incident postmortem when an incident occurred, and delivery metrics. | Add the postmortem as a conditional artifact. Offer the four DORA keys as an optional view in the retrospective. | P3 |

## C. Acceptance criteria / Done

### C.0 Definition of Done scope

**R009-C0 (P1).** Phase 4 Done says "Every task has a definition of done", and the glossary keeps a task-level definition of done on purpose. In the Scrum Guide (2020), the Definition of Done is one shared quality bar that every increment meets. What varies per item are its acceptance criteria. Asking for a DoD per task multiplies criteria that are never checked.

**Proposal:**
- One project-level Definition of Done in `docs/governance.md`, seeded by `/template-init`. For example: CI green, review approved, tests for every acceptance scenario of the slice, CHANGELOG and status updated, no CRITICAL finding from `/speckit-analyze`, Spec Kit converge reports `Converged`.
- Per-story acceptance criteria as Given/When/Then in `specs/[NNN-feature-name]/spec.md`, which Spec Kit already does.
- A Definition of Ready for the move from Phase 4 to Phase 5: each task has an ID, a story link, exact file paths and a named test.
- Revise the glossary entry to match.

### C.1 Criteria that cannot be checked as written

Each line proposes a check a reviewer, a script or `verify-gate.js` could run.

| ID | Phase | Criterion as written | Proposed check |
|---|---|---|---|
| R009-C1 | 0 | "A new person can understand the project in up to 15 minutes." | A cold read of `README.md` and `handbook.md` answers five fixed questions (what, why, how to run, where the status is, how to contribute), with the answers recorded. |
| R009-C1 | 0 | "There is a clear versioning and update convention." | `governance.md` names SemVer, Keep a Changelog and Conventional Commits. |
| R009-C2 | 1 | "Problem clearly described." | The problem states who, the pain, the evidence and the impact, plus at least one measurable success metric. |
| R009-C2 | 1 | "Market research completed with useful references." | At least three options compared on stated criteria, with dated sources. |
| R009-C2 | 1 | "PRD approved for planning." | A sign-off recorded with who, date and PRD version (issue #62). |
| R009-C3 | 2 | "There is agreement on what comes first." | The first milestone is named in the plan, with a sign-off. |
| R009-C4 | 3 | "High-level architecture defined." | C4 context and container diagrams exist (R009-B5). |
| R009-C4 | 3 | "No critical ambiguity remains open." | Zero `[NEEDS CLARIFICATION]` markers in `specs/[NNN-feature-name]/spec.md`, and the Constitution Check in `specs/[NNN-feature-name]/plan.md` passes, with any violation justified in its Complexity Tracking section. |
| R009-C5 | 4 | "Tasks are small and clear." | Every task follows Spec Kit's format (ID, `[P]` when parallel, story label, exact file path). `/speckit-analyze` reports zero CRITICAL findings, and every `FR-###` maps to at least one task. |
| R009-C5 | 5 | "Minimum tests pass." / "Explicit human checkpoint happened." | CI green on the PR, a test for each acceptance scenario in the slice, `/speckit-converge` reports `Converged`, and the PR approval is the recorded checkpoint. |
| R009-C6 | 6 | "Minimum testing evidence exists." / "Increment approved." | `test-report.md` shows pass/fail per acceptance scenario plus the checked non-functional targets, and the approval is recorded with who and date. |
| R009-C7 | 7 | "Minimum documentation updated." / "Next steps identified." | CHANGELOG, release notes and `status.md` updated, with next steps listed in `status.md`. |
| R009-C8 | 8 | "The project remains readable for new participants." | The same five-question cold read as Phase 0. |

### C.2 Missing criteria

| ID | Phase | Gap | Proposal | Priority |
|---|---|---|---|---|
| R009-C9 | 5 | Done has no security criterion, although this template's own CI runs dependency review and secret scanning. | Add "dependency review and secret scan green on the PR" and ship the same jobs to generated projects. | P2 |
| R009-C10 | 1, 6 | Non-functional requirements have no measurable target, so Phase 6 cannot verify them. | Write them by ISO/IEC 25010 quality characteristic, each with a target, and verify them in the Phase 6 test report. | P2 |
