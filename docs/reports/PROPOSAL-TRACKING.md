---
title: "Report Proposal Tracking"
doc_type: status-artifact
description: "Status index over every distinct proposal in docs/reports/*.md external improvement reports - done, done-scoped, deferred, rejected, or not-triaged - so a proposal's fate is discoverable in one place instead of scattered across docs/prompts/*.md CONTEXT sections and CHANGELOG.md prose. Populated 2026-07-24 from a full audit of docs/reports/008-relatorio-melhorias-v6.md (archived private-repo sequence, not a citable path in this repository) against docs/prompts/PROMPT-INDEX.md, CHANGELOG.md, and live repo state."
status: active
version: "1.14"
created: 2026-07-24
updated: 2026-08-06
language: en
id: report-proposal-tracking
tags: [status-artifact, docs-reports, tracking, discoverability]
owner: Alexandre Clemente
related: [documentation-metadata-standard]
---

# Report Proposal Tracking

Every distinct, actionable proposal from every report in `docs/reports/` gets one row here, with a status and the evidence behind it. Future reports dropped into `docs/reports/` get their proposals logged here at intake (see `CONTRIBUTING.md`); batch-evaluation sessions update the `Status`/`Decision` columns directly rather than writing a new summary document each time.

**Status values**: `done` (implemented as proposed) · `done-scoped` (something shipped for the same need, deliberately smaller/different — evidence says what was cut and why) · `deferred` (explicitly parked, with a recorded reason and revisit condition) · `rejected` (explicitly considered and declined, with a recorded reason) · `not-triaged` (no record of a decision anywhere — candidate for a future batch).

Sections 6 ("Tabela de Riscos Consolidada"), 9 and 18 ("Backlog Priorizado") and 11/19 ("Estrutura-Alvo Completa") of the source report are consolidations/restatements of items already itemized in the sections below — they are not given separate rows, per this file's deduplication rule.

## Source report: `docs/reports/008-relatorio-melhorias-v6.md` (archived private-repo sequence, not a citable path in this repository)

### Section 0 — Posicionamento Estratégico (AI-DLC)

| ID | Proposal | Status | Decision / Evidence |
| --- | --- | --- | --- |
| R008-0.1 | Composition strategy: this template = governance envelope, AI-DLC = construction-phase engine | deferred | `prompt-075` (archived private-repo sequence, not a citable path in this repository): "AI-DLC positioning relative to `awslabs/aidlc-workflows` ... deliberately out of scope here — needs its own scoping decision" |
| R008-0.2 | New `docs/adr/0005-aidlc-integration.md` | deferred | Bundled with R008-0.1; no ADR-0005 exists |
| R008-0.3 | New `agents/aidlc-adapter.md` | deferred (Bolt piece rejected) | Bundled with R008-0.1; Bolt vocabulary specifically rejected — `prompt-067` |
| R008-0.4 | Kiro decision + `adapters/KIRO.md` | deferred | Bundled with R008-0.1 |
| R008-0.5 | Spec Kit vs `aidlc-docs/` mapping table | deferred | Bundled with R008-0.1 |
| R008-0.6 | Root `LICENSE` (MIT-0) | done | `LICENSE` at root; `prompt-066` (archived private-repo sequence, not a citable path in this repository) |

### Seção N — Nomenclatura de Arquivos

| ID | Proposal | Status | Decision / Evidence |
| --- | --- | --- | --- |
| R008-N.1 | Rename 6 `agents/*-prompt.md` files (drop `-prompt` suffix) | done | `agents/orchestrator.md`, `agents/phase-reviewer.md`, `agents/adversarial.md`, `agents/doc-consistency.md`, `agents/init.md`, `agents/tool-discovery.md`; `prompt-065` (archived private-repo sequence, not a citable path in this repository) |
| R008-N.2 | New `agents/fast-track.md` | rejected | `prompt-067`: collides with the existing fast-track roadmap path (`docs/strategy/roadmap.md` §4.3) |
| R008-N.3 | New `agents/aidlc-adapter.md` | deferred | Same as R008-0.3 |
| R008-N.4 | New `agents/orchestrator-tasks.md` (system/task split) | rejected | Batch-7 decision (2026-07-24): literally the same proposal as R008-T.2/R008-3.2, already rejected (batch 5) for the same reason. |
| R008-N.5 | Upper/lowercase file-naming convention | done | `CONTRIBUTING.md`'s case-naming-convention bullet; `prompt-075` (archived private-repo sequence, not a citable path in this repository) |
| R008-N.6 | ADR numbering standardized under `docs/adr/` | done-scoped | `docs/adr/0002-0004` exist (`prompt-064` (archived private-repo sequence, not a citable path in this repository)/`072`), but the proposed ADR-0004 ("Spec-as-CI-Contract") and ADR-0005 (aidlc-integration) content was not what shipped in those slots. Slot `0005` was later filled by the unrelated public-release ADR, renumbered from `0010` on 2026-07-31 (`docs/prompts/002-renumber-adr-0010-to-0005.md`); the aidlc-integration proposal remains unadopted. |

### Seção E — Estrutura de Pastas

| ID | Proposal | Status | Decision / Evidence |
| --- | --- | --- | --- |
| R008-E.1 | `docs/adr/`, `docs/strategy/`, `docs/visuals/` split out of `docs/manuals/` | done | Live dirs confirmed; `docs/adr/0004-docs-category-directories.md`; `prompt-064` (archived private-repo sequence, not a citable path in this repository) |
| R008-E.2 | `docs/manuals/phases/` (fragment `docs/manuals/operation-manual.md`) | rejected | `prompt-064` (archived private-repo sequence, not a citable path in this repository): "`docs/manuals/operation-manual.md` itself stays a single, unfragmented file, out of scope per ADR-0003's still-valid Alternative #2 reasoning" |
| R008-E.3 | `docs/i18n/` | deferred | Batch-4 decision (2026-07-24), same as R008-4.5: real potential value, but a translated file with no sync-enforcement mechanism would predictably drift — the same problem `check-adapter-sync.js` exists to prevent for `CLAUDE.md`/`AGENTS.md`. No concrete Portuguese-speaking adopter has hit this gap yet. |
| R008-E.4 | `adapters/` directory (move `CLAUDE.md`/`AGENTS.md`, root symlinks) | rejected | Batch-2 decision (2026-07-24): Claude Code requires `CLAUDE.md` literally at root (the report's own text admits this). Symlink indirection adds fragility for a cosmetic reorg; `.github/scripts/check-adapter-sync.js` (`prompt-035` (archived private-repo sequence, not a citable path in this repository)) already keeps `CLAUDE.md`/`AGENTS.md` in sync without a folder move. |
| R008-E.5 | `adapters/GEMINI.md`, `OPENAI.md`, `KIRO.md`, `README.md` | rejected (GEMINI/OPENAI) / deferred (KIRO) | Batch-2 decision (2026-07-24): no concrete demand signal for GEMINI/OPENAI; `AGENTS.md` already serves as the generic multi-tool fallback most other tools read; empty stubs would be clutter without real tested content. KIRO piece stays bundled with R008-0.4 (AI-DLC thread), unchanged. |
| R008-E.6 | Root `scripts/` dir (`agent-evaluator/`, `bootstrap.js`, `verify-gate.js`, `audit-changelog.js`) | rejected | Batch-7 decision (2026-07-24): moot — none of the scripts proposed for it were adopted (batch 1). This repo already has one consistent governance-script home (`.github/scripts/`); a second location wouldn't add value. |

### Seção T — Economia de Tokens

| ID | Proposal | Status | Decision / Evidence |
| --- | --- | --- | --- |
| R008-T.1 | Fragment `docs/manuals/operation-manual.md` by phase | rejected | Same ADR-0003 citation as R008-E.2 |
| R008-T.2 | Split orchestrator into system/tasks files | rejected | Batch-5 decision (2026-07-24): doesn't map onto how `agents/orchestrator.md` is actually organized (by cross-cutting Step/Rule, not by phase) — genuinely per-phase content already lives in `docs/strategy/roadmap.md` and is referenced, not inlined. The real size concern stays tracked under R008-2.7 instead. |
| R008-T.3 | Compress frontmatter to short keys (`t:`/`v:`/`s:`) | rejected | Batch-5 decision (2026-07-24): the token-savings goal is already substantially met by `docs/STATE.md`'s single consolidated read; repo-wide migration cost (109+ files, every governance script, human-readability loss for the human-operator audience per `ADR-0002`) far exceeds the marginal benefit. |
| R008-T.4 | `@path` lazy-loading references | rejected | Batch-5 decision (2026-07-24): the underlying pointer-not-inline principle is already this repo's practiced convention (ADR-0003 principle 3). Adopting the literal Claude-Code-specific `@path` syntax would reduce this repo's deliberate tool-neutrality, which `AGENTS.md` exists specifically to preserve. |
| R008-T.5 | `docs/STATE.md` reformatted as narrative "SESSION CONTEXT" (phase/mode/bolt/blockers/next action) | done-scoped | `docs/STATE.md` exists and is the mandated first read, but is a generated table of every living document's title/type/status/version (`prompt-034` (archived private-repo sequence, not a citable path in this repository), predates the report), not the proposed narrative session-context block |

### Section 1 — Redução de Overhead de Governança

| ID | Proposal | Status | Decision / Evidence |
| --- | --- | --- | --- |
| R008-1.1 | Fast-track as official mode, calibrated by AI-DLC "Bolt" | done-scoped (full/short/fast-track) / rejected (Bolt calibration) | `docs/strategy/roadmap.md` §4.3 has fast-track; `prompt-067` (archived private-repo sequence, not a citable path in this repository) explicitly rejects the Bolt vocabulary/collision |
| R008-1.2 | Auto frontmatter update rule (semantic version auto-increment) delegated to Claude Code | rejected | Batch-7 decision (2026-07-24): already effectively covered — `CLAUDE.md`'s Documentation metadata rule already requires applying the schema whenever a file is created or materially updated, demonstrated in practice on every edit. A separate rule would restate existing policy. |
| R008-1.3 | `docs/STATE.md` as SESSION CONTEXT bootstrap + CI auto-regen trigger + `CLAUDE.md` read-first instruction | done-scoped | Read-first instruction lives in `docs/manuals/operation-manual.md`/orchestrator, not literally `CLAUDE.md`; CI **checks** staleness (fails, doesn't auto-write); predates report (`prompt-034` (archived private-repo sequence, not a citable path in this repository)) |
| R008-1.4 | README "Steering" role language | rejected | Batch-7 decision (2026-07-24): bare vocabulary addition, no described functional gap — same reasoning as R008-12.1's "Intent" rejection. |
| R008-1.5 | Agent conflict-resolution hierarchy (`adversarial > phase-reviewer > orchestrator > operador`) | rejected | Batch-7 decision (2026-07-24): the design already routes all conflicts to human judgment (Operating rule 7); reviewers are complementary by design (each catches a different failure class), not competing decision-makers. No incident has ever required this. |
| R008-1.6 | "Reverse the Conversation Direction" principle named explicitly in orchestrator | done | Same as R008-12.4, resolved together (`prompt-081` (archived private-repo sequence, not a citable path in this repository)). |

### Section 2 — Automação e Tooling

| ID | Proposal | Status | Decision / Evidence |
| --- | --- | --- | --- |
| R008-2.1 | `scripts/verify-gate.js --phase=N --dry-run` | done-scoped | Resolved 2026-07-27, scoped down from the original batch-1 assessment: no new manifest was actually needed - `docs/strategy/roadmap.md`'s "Generated artifacts" bullets are already mostly single, unambiguous file paths. `docs/references/gate-verification-template/verify-gate.js` checks only those; "or" alternatives, `[feature-name]` placeholders, wildcards, leading-conditional bullets ("If brownfield: ..."), and non-file prose report as not-machine-checkable rather than being guessed at, and "Acceptance criteria / Done" bullets remain entirely out of scope, never checked (`prompt-083`; the conditional-bullet case was a false-`GATE FAIL` bug found by a doc-consistency-reviewer audit and fixed in `prompt-084` (archived private-repo sequence, not a citable path in this repository)). No `--dry-run` flag - the script never writes anything. R008-2.9's underlying need is resolved by this same item. |
| R008-2.2 | `.github/hooks/prepare-commit-msg` (`Assisted-by:` trailer) | rejected | Batch-3 decision (2026-07-24): redundant — every commit already carries a `Co-Authored-By: Claude Sonnet 5` trailer, the same underlying AI-authorship traceability need, in consistent practice. A hook keyed on an unverified `CLAUDE_CODE` env var adds local-setup friction for no marginal benefit. |
| R008-2.3 | CI auto-regeneration of `docs/STATE.md` | done-scoped | `state-staleness-check.yml` fails on staleness rather than auto-writing; predates report (`prompt-034` (archived private-repo sequence, not a citable path in this repository)) |
| R008-2.4 | MCP Adapters section + `.claude/mcp-config-template.json` | deferred | Batch-2 decision (2026-07-24): no MCP server is currently adopted — `knowledge-rag` is cataloged but was explicitly deferred (`docs/references/token-economy.md`), and Graphify is used as a Skill, not registered as an MCP config here. A config template would have nothing real to configure yet; revisit once/if an MCP server is actually adopted. |
| R008-2.5 | `scripts/bootstrap.js` interactive CLI | rejected | Batch-1 decision (2026-07-24): `/template-init` already solves this — conversational, context-aware, idempotent (`prompt-039` (archived private-repo sequence, not a citable path in this repository)). A parallel static CLI script would duplicate it and risk drift between the two mechanisms. |
| R008-2.6 | Adapters for GEMINI/OPENAI/KIRO | rejected (GEMINI/OPENAI) / deferred (KIRO) | Same as R008-E.5 |
| R008-2.7 | CI lint failing on agent files > 15 KB | deferred | Batch-3 decision (2026-07-24): `agents/orchestrator.md` is already 14.4 KB, 96% of the proposed cap — a hard-fail threshold this close would likely block normal incremental edits almost immediately rather than catch genuine bloat. Needs real design (higher cap? warn-not-fail?) before adoption; revisit then. |
| R008-2.8 | `scripts/audit-changelog.js` | rejected | Batch-1 decision (2026-07-24): assumes Conventional-Commit-typed (`feat`/`break`) changelog entries; this repo's `CHANGELOG.md` follows Keep a Changelog (Added/Changed/Fixed sections, no type tags) — the script would check a format not in use. The underlying traceability need is already enforced by the Change-as-prompt rule + PR template checklist. |
| R008-2.9 | Extend `step-reference-check.yml` to validate phase/artifact consistency | rejected (as proposed) / resolved via R008-2.1 | Batch-1 decision (2026-07-24): wrong tool — that checker validates this template's own `docs/manuals/operation-manual.md` step cross-references, not a generated project's runtime phase state. The real underlying need rode on R008-2.1, resolved 2026-07-27 by `docs/references/gate-verification-template/` (`prompt-083` (archived private-repo sequence, not a citable path in this repository)). |
| R008-2.10 | Consolidate 7 workflows into `governance.yml` | deferred | `prompt-075` (archived private-repo sequence, not a citable path in this repository): "consolidating the repo's 7 separate `.github/workflows/*.yml` files ... deliberately out of scope here" |
| R008-2.11 | `scripts/agent-evaluator/` (AIDLC Evaluator pattern) | deferred | Batch-1 decision (2026-07-24): valuable in principle — the testing dimensions are already documented (`docs/manuals/agent-design-guide.md`, `prompt-056` (archived private-repo sequence, not a citable path in this repository)) — but real golden-testing for prompt-based agents means invoking an LLM in CI and grading non-deterministic output, a real new cost/infra commitment, not a batchable fix. Revisit if agent-prompt regressions actually start happening, or on explicit request to invest in agent-eval infra. |
| R008-2.12 | AI-DLC install prompt in `QUICKSTART.md` | deferred | Bundled with R008-0.1; `QUICKSTART.md` has no AI-DLC section |

### Section 3 — Melhorias de Arquitetura

| ID | Proposal | Status | Decision / Evidence |
| --- | --- | --- | --- |
| R008-3.1 | Replace README Mermaid duplicate with a link to the visuals overview | done | `README.md`'s document map is a pointer, not a copy; `prompt-052` (archived private-repo sequence, not a citable path in this repository)/`064` |
| R008-3.2 | Split orchestrator system/task files, control instruction budget | rejected | Same as R008-T.2 |
| R008-3.3 | CODEOWNERS protecting `docs/manuals/`, `docs/adr/`, `agents/` | done | `.github/CODEOWNERS`; `prompt-075` (archived private-repo sequence, not a citable path in this repository) |
| R008-3.4 | "Spec-as-Source" / ADR-0004 (Spectral, ArchUnit, Deptrac references) | rejected | Batch-7 decision (2026-07-24): both named tools are ecosystem-specific (Java/PHP) and don't fit a stack-agnostic template. The underlying need — a generated project wanting spec-linting for its own stack — is already served by the tool-hunter/build-vs-buy flow. |
| R008-3.5 | Prompt archival policy (superseded > 30 days → `docs/prompts/archive/`) | rejected | Batch-7 decision (2026-07-24): directly conflicts with an already-deliberate, documented decision (`CONTRIBUTING.md`: flat archive, status field only, no folder-per-status move) — not an omission, a contradiction. |
| R008-3.6 | Consolidate ADRs into `docs/adr/` with short names | done | Confirmed live; `prompt-064` (archived private-repo sequence, not a citable path in this repository)/`072` |
| R008-3.7 | Updated Agent Catalog table in `docs/manuals/agent-design-guide.md` | done-scoped | Equivalent table exists in `docs/manuals/operation-manual.md`'s Document map instead, predating the report (`prompt-044` (archived private-repo sequence, not a citable path in this repository)) |
| R008-3.8 | Semantic-versioned frontmatter with a `changelog` field per agent | done-scoped (pre-existing) | `version` field present on all `agents/*.md`; body-changelog convention (`prompt-033` (archived private-repo sequence, not a citable path in this repository), predates report) substitutes for a frontmatter `changelog:` field |
| R008-3.9 | Move `docs/strategy/go-to-market.md`, roadmap to `docs/strategy/` | done | `docs/strategy/roadmap.md`, `docs/strategy/go-to-market.md`; `prompt-064` (archived private-repo sequence, not a citable path in this repository)/`072` |
| R008-3.10 | `docs/manuals/phases/` fragmentation | rejected | Same as R008-E.2 |
| R008-3.11 | Expand `PULL_REQUEST_TEMPLATE.md` (fase afetada, `roadmap_path`, `bolt_id`) | deferred | Batch-5 decision (2026-07-24): conflates this repo's own PR template (correctly scoped to the Change-as-prompt checklist, no roadmap phase applies) with a potential generated-project reference PR template (a real idea, parallel to `infra-templates/`/`telemetry-template/`, but new infrastructure that doesn't exist yet). `bolt_id` is moot regardless (Bolt rejected, `prompt-067`). Revisit if a generated project actually asks for it. |
| R008-3.12 | AI-DLC ↔ Spec Kit mapping table in roadmap | deferred | Bundled with R008-0.1 |
| R008-3.13 | Document `*.opt-in.md` extension pattern | done | Batch-6 decision (2026-07-24): cheap (one paragraph, no mechanism built), genuinely rounds out `docs/manuals/agent-design-guide.md`'s existing workflow-vs-agent spectrum (`prompt-056`) with an even-lighter tier. Documented as an available pattern only, no actual opt-in extension file built yet (`prompt-081` (archived private-repo sequence, not a citable path in this repository)). |

### Section 4 — Adoção e Clareza para Novos Usuários

| ID | Proposal | Status | Decision / Evidence |
| --- | --- | --- | --- |
| R008-4.1 | `QUICKSTART.md` (max 1 page) | done | `QUICKSTART.md`; `prompt-066` (archived private-repo sequence, not a citable path in this repository) |
| R008-4.2 | Internal `README.md`s in `agents/`, `docs/manuals/`, `docs/adr/`, `docs/strategy/`, `adapters/` | rejected | Batch-4 decision (2026-07-24): duplicates the existing single canonical navigational artifact — `docs/STATE.md` plus `docs/manuals/operation-manual.md`'s Document Map (`prompt-044` (archived private-repo sequence, not a citable path in this repository)) already list every doc/agent/path/purpose in one place. Four more READMEs would duplicate and drift from it, against ADR-0003's pointer-over-copy principle. |
| R008-4.3 | "Hello World SDD" demonstration PR | deferred | Batch-4 decision (2026-07-24): genuine onboarding value beyond `QUICKSTART.md`/the visual overview's diagrams, but building a full synthetic project's worth of realistic Phase 1-2 artifacts is substantial content work, not a batchable edit. No adopter has reported getting stuck here yet; revisit if that happens. |
| R008-4.4 | `CONTRIBUTING.md` | done | Root `CONTRIBUTING.md`; `prompt-075` (archived private-repo sequence, not a citable path in this repository) |
| R008-4.5 | i18n (`docs/i18n/README.pt-BR.md`) | deferred | Same as R008-E.3 |
| R008-4.6 | "First session in 30 seconds" flow in QUICKSTART | done | `/template-init` → `/orchestrator` flow; `prompt-066` (archived private-repo sequence, not a citable path in this repository) |
| R008-4.7 | Session sequence diagram | done-scoped | `docs/visuals/template-visual-overview.md`'s phase-execution sequence diagram is conceptually adjacent, not the literal session-bootstrap sequence proposed; predates report (`prompt-052` (archived private-repo sequence, not a citable path in this repository)) |

### Section 5 — Segurança e Compliance

| ID | Proposal | Status | Decision / Evidence |
| --- | --- | --- | --- |
| R008-5.1 | Expand `SECURITY.md` (prompt injection, agent permission scope, `Assisted-by:` audit, secrets policy, OWASP LLM Top 10, deploy-approval restriction) | done-scoped | OWASP LLM Top 10 section shipped (`prompt-075`, archived private-repo sequence, not a citable path in this repository); deploy-approval sentence added to the "Excessive agency" bullet (`prompt-080`, archived private-repo sequence, not a citable path in this repository). The `Assisted-by:` audit sub-item is intentionally not implemented — see R008-2.2's rejection (`Co-Authored-By:` trailer already serves that need). |
| R008-5.2 | `.github/ISSUE_TEMPLATE/` (`.github/ISSUE_TEMPLATE/bug_report.md`, `.github/ISSUE_TEMPLATE/improvement.md`, `.github/ISSUE_TEMPLATE/agent-behavior.md`) | done-scoped | `.github/ISSUE_TEMPLATE/bug_report.md`, `.github/ISSUE_TEMPLATE/feature_request.md` (`prompt-075`, archived private-repo sequence, not a citable path in this repository), and `.github/ISSUE_TEMPLATE/agent-behavior.md` (`prompt-080`, archived private-repo sequence, not a citable path in this repository) all shipped. Functionally complete; naming differs from the proposal only in `.github/ISSUE_TEMPLATE/improvement.md` → `.github/ISSUE_TEMPLATE/feature_request.md`, an equivalent, not a gap. |
| R008-5.3 | Mandatory human-review-before-merge policy for AI-generated code | done-scoped | `SECURITY.md`'s "excessive agency" bullet covers similar ground via the Change-as-prompt rule, not phrased as a literal per-line review mandate |

### Section 8 — Checklist de Sessão para o Orquestrador

| ID | Proposal | Status | Decision / Evidence |
| --- | --- | --- | --- |
| R008-8.1 | Literal 8-step "SESSION STARTUP CHECKLIST" (STATE.md read, roadmap_path check, fast-track/aidlc-construction branch, phase-N.md-only load, blocker check, end-of-session STATE update) | done-scoped | `agents/orchestrator.md` Step 0/2 implements materially equivalent behavior, not as this literal checklist block, no `aidlc-construction` branch, no `bolt_id` field |

### Section 10 — Integração com AI-DLC (Guia de Implementação)

| ID | Proposal | Status | Decision / Evidence |
| --- | --- | --- | --- |
| R008-10.1 | `agents/aidlc-adapter.md` full spec (setup, artifact mapping table, session-close steps) | deferred | Same as R008-0.1/0.3 |

### Section 12 — Artefatos AI-DLC para Absorver Diretamente

| ID | Proposal | Status | Decision / Evidence |
| --- | --- | --- | --- |
| R008-12.1 | Intent framing | rejected | Batch-6 decision (2026-07-24): bare vocabulary swap with no functional change — each phase's objective is already stated clearly in Acceptance Criteria. Borrowing the label without AI-DLC's structured artifact behind it adds a synonym, not clarity. |
| R008-12.2 | Bolt | rejected | `prompt-067` (archived private-repo sequence, not a citable path in this repository): naming collision with the existing fast-track roadmap path |
| R008-12.3 | Mob Elaboration | rejected | Batch-6 decision (2026-07-24): doesn't fit this template's stated audience — `ADR-0002` explicitly scopes it to a solo-operator consultancy, not larger teams. Speculative until an actual multi-person adopter shows up. |
| R008-12.4 | Reverse the Conversation Direction (as AI-DLC-named practice) | done | Batch-6 decision (2026-07-24): this is already how the orchestrator behaves (Step 0/1/2 proactively drive with proposals and confirmation questions); named explicitly in `agents/orchestrator.md` (`prompt-081` (archived private-repo sequence, not a citable path in this repository)), judged on merit with no external dependency, per the human's explicit direction. Related to R008-1.6, now resolved together. |
| R008-12.5 | Human-in-the-Loop-as-Loss-Function | rejected | Batch-6 decision (2026-07-24): operating rule 7 ("human approval required before a phase transition") is already unambiguous; an ML-training metaphor risks confusing this template's non-ML-practitioner audience more than it clarifies. |
| R008-12.6 | PRFAQ template | done | Batch-6 decision (2026-07-24): not AI-DLC-specific IP — an established market-standard technique (Amazon's "working backwards" method). Added as `docs/manuals/examples/spec-prfaq-template.md` (`prompt-081` (archived private-repo sequence, not a citable path in this repository)), optional, matching the existing worked-example pattern. |
| R008-12.7 | Domain → Logical Design mapping | rejected | Batch-6 decision (2026-07-24): proposed home (`docs/manuals/phases/`) doesn't exist — already rejected under ADR-0003. No demonstrated gap in Phase 2's current design guidance. |
| R008-12.8 | Deployment Units vocabulary | rejected | Batch-6 decision (2026-07-24): same missing-home problem; Phase 7 already has concrete deployment vocabulary/artifacts (`deploy/` templates, IaC-first, staging→production gate — `prompt-041` (archived private-repo sequence, not a citable path in this repository)) more actionable than an abstract label. |
| R008-P4.1 | LangGraph reference (P4 backlog item) | rejected | Batch-7 decision (2026-07-24): confirmed via the report's own Section 7 context — cited as inspiration for modeling the phase cycle as a state graph. `docs/visuals/template-visual-overview.md` already has a roadmap state-machine diagram; the underlying need is already met without a third-party citation. |

### Sections 14-20 — Arquitetura de Telemetria / Camada de Respostas de Negócio (NOVO v6)

All rows below were superseded by a single, explicitly scoped-down decision in prompt `068` (archived private-repo sequence, not a citable path in this repository) — see this file's own summary above for the reasoning that survives.

| ID | Proposal | Status | Decision / Evidence |
| --- | --- | --- | --- |
| R008-14.1 | Two-layer telemetry architecture (file-based + optional OpenTelemetry export) | done-scoped | Only the file-based layer's idea survives, reduced to a single `sessions.jsonl` ledger — no dual-layer design |
| R008-14.2 | Non-business file-tree pieces (`project-snapshot.json`, `artifact-manifest.json`, `metrics/*.csv` ×4, `forecasts/project-eta.json`, paired `.md`+`.json` per-session files) | rejected | `docs/references/telemetry-template/` ships one schema + one JSONL format instead; this repo does not adopt `docs/telemetry/` for itself — reference template for generated projects only |
| R008-15.1 | `business/` subfolder + 4 business schemas (`cost-breakdown.json`, `billing-summary.json`, `pricing-benchmark.json`, `quote-estimate.json`) | deferred | `prompt-068` (archived private-repo sequence, not a citable path in this repository): "needs ≥3 real sampled projects to be trustworthy, and none exist yet" — explicit revisit condition |
| R008-14.3 | 5 new scripts (`update-telemetry.js`, `export-bta-json.js`, `recompute-forecast.js`, `compute-cost-breakdown.js`, `generate-quote-estimate.js`) | rejected | Bundled under R008-15.1's rejection; no aggregation/forecast/cost logic built — data collection is manual JSONL append only |
| R008-16.1 | 2 new mandatory agents (`agents/session-reporter.md`, `agents/telemetry-keeper.md`) | rejected | `prompt-068` explicit: "No new mandatory agent... — extend the orchestrator's existing session-end step instead" |
| R008-17.1 | `billing_model` field in `docs/STATE.md` SESSION CONTEXT | rejected | Batch-7 decision (2026-07-24): depends on two things already decided against — `docs/STATE.md` staying a narrative "SESSION CONTEXT" block (it's a generated table instead, `prompt-034` (archived private-repo sequence, not a citable path in this repository)) and the business/billing layer existing (deferred, R008-15.1). No home for this field under either standing decision. |
| R008-17.2 | Business indicator table (margin, effective hourly rate, cost/Unit, overrun risk) | deferred | Depends entirely on R008-15.1's rejected/deferred schemas — same condition |
| R008-17.3 | Quote-generation flow (§17.2) | deferred | Same condition as R008-15.1 |
| R008-14.4 | `.github/workflows/telemetry-refresh.yml` | rejected | Batch-7 decision (2026-07-24): no aggregation/computation logic exists to refresh — the adopted ledger is a simple per-session JSONL append (`prompt-068` (archived private-repo sequence, not a citable path in this repository)), not something with periodic recomputation. The scripts this workflow would run (R008-14.3) were already rejected. |
| R008-20.1 | OpenTelemetry export layer (`scripts/otel-exporter.js`) | deferred | Batch-7 decision (2026-07-24): same underlying condition as the business/billing layer (R008-15.1) — a real-time export layer needs a validated real-time consumer (`business-tech-agency` with actual usage), which doesn't exist yet. Coherent idea, premature infrastructure; revisit together with the business layer. |
| R008-20.2 | Dashboard reference doc (Grafana example) | deferred | Batch-7 decision (2026-07-24): downstream of R008-20.1 — nothing to visualize without the export layer it would dashboard. Same revisit condition. |
| R008-20.3 | Native token-count API vs. char-estimate investigation | done | `prompt-068` (archived private-repo sequence, not a citable path in this repository)/`CHANGELOG.md`: checked whether `rtk` could source it — documented finding ("it can't yet"), schema gained a `source: "rtk" \| "estimate"` field |
| R008-20.4 | Remaining §20 risk-table items (business-data leakage, missing-session-reporter runs, benchmark-confidence, cross-client data leakage) | rejected | Batch-7 decision (2026-07-24): moot by construction — these are risks of features that were rejected/deferred (business layer, mandatory agents). No action ties to them regardless of future status. |
