---
title: "Artifact Necessity Audit: docs/manuals/, docs/references/, docs/reports/"
doc_type: product-doc
description: "One-time audit of every file in docs/manuals/, docs/references/, and docs/reports/ for whether it is genuinely needed for SDD development, each with a keep/simplify/remove verdict and its evidence. Produced by prompt-106, answering local-notes/012's artifact-necessity ask for these three directories; docs/prompts/ is out of scope here (see prompt-105's ledger enrichment instead), as are agents/, docs/adr/, docs/strategy/, docs/visuals/."
status: active
version: "1.0"
created: 2026-07-30
updated: 2026-07-30
language: en
id: artifact-necessity-audit
tags: [status-artifact, audit, documentation, governance]
owner: Alexandre Clemente
related: [report-proposal-tracking, documentation-metadata-standard, prompt-archive-index]
diataxis: reference
---

# Artifact Necessity Audit: `docs/manuals/`, `docs/references/`, `docs/reports/`

Scope: every file under `docs/manuals/`, `docs/references/`, and `docs/reports/` as of `prompt-106` (2026-07-30). `docs/prompts/` is not evaluated here — its own necessity question is answered by `prompt-105`'s enrich-the-ledger decision, not a keep/simplify/remove verdict. `agents/`, `docs/adr/`, `docs/strategy/`, and `docs/visuals/` were not in scope this cycle.

**Headline finding**: 15 of 17 files are unambiguous keeps. Two get a lighter **simplify** verdict (wording/framing tightened, nothing removed). Zero get a **remove** verdict. These three directories were not, in fact, the accumulated bloat `local-notes/012-sanitizacao-para-repositorio-publico.txt` worried about — each file traces to a real, current consumer (a cross-reference, a `related:` field, or an agent/script that reads it) once checked directly, rather than judged by title alone.

**Verdict values**: `keep` (genuinely needed, no change) · `simplify` (needed, but its own wording/framing gets tightened) · `remove` (not needed — none this cycle).

| # | Artifact | Verdict | Evidence |
| --- | --- | --- | --- |
| 1 | `docs/manuals/agent-design-guide.md` | keep | Linked from `README.md`'s "Key documents"; workflow-vs-agent decision guide with no duplicate elsewhere. |
| 2 | `docs/manuals/documentation-metadata-standard.md` | keep | The canonical metadata/scope standard every governance script (`doc-scope.js`, `docgov`) derives from. |
| 3 | `docs/manuals/operation-manual.md` | keep | The canonical operating-model hub; `check-step-references.js` depends on it existing as one file. |
| 4 | `docs/manuals/prompt-engineering-guide.md` | keep | Cited by `CLAUDE.md`'s AI-output rules and referenced for the P1-P10 pattern library; no other file plays this role. |
| 5 | `docs/manuals/role-operating-guide.md` | keep | Linked from `README.md`; distinct audience (role-specific guidance) from `operation-manual.md`. |
| 6 | `docs/manuals/tool-library-catalog.md` | keep | Actively read by `agents/tool-discovery.md` (tool-hunter) before every vetting decision. |
| 7 | `docs/manuals/examples/adr-0001-documentation-and-governance-model.md` | keep | Phase 0 scaffolding a generated project replaces — core to the template's own worked-example function, not optional filler. |
| 8 | `docs/manuals/examples/governance.md` | keep | Same Phase 0 scaffolding role as #7. |
| 9 | `docs/manuals/examples/risks.md` | keep | Same Phase 0 scaffolding role as #7. |
| 10 | `docs/manuals/examples/spec-prfaq-template.md` | keep | Optional Phase 1 scaffold, already explicitly labeled "optional" in `README.md` — correctly scoped, not bloat. |
| 11 | `docs/references/gate-verification-template/README.md` | keep | Opt-in reusable template for generated projects, by design (not adopted by this repo itself — that is its documented purpose, not a gap). |
| 12 | `docs/references/infra-templates/README.md` | keep | Same opt-in reusable-template role as #11. |
| 13 | `docs/references/telemetry-template/README.md` | keep | Same opt-in reusable-template role as #11; a separate telemetry-self-adoption decision this session does not affect this template file's own validity. |
| 14 | `docs/references/token-economy.md` | keep | Records live, active decisions (Graphify adoption) `README.md` and `CLAUDE.md`'s skill list both point to. |
| 15 | `docs/references/tools-ecosystem.md` | simplify | Actively used by `agents/tool-discovery.md` as a shortlist, but its own description ("unvetted tools-ecosystem shortlist") signaled unclear scope — tightened to say what "unvetted" does and doesn't commit the reader to. |
| 16 | `docs/reports/008-relatorio-melhorias-v6.md` | simplify | Every proposal is fully triaged (0 `not-triaged` rows in `PROPOSAL-TRACKING.md`, confirmed by direct count) — its actionable content is fully absorbed elsewhere. Kept as the original source citation; its own description now says so explicitly (frozen historical source, not itself the living reference). |
| 17 | `docs/reports/PROPOSAL-TRACKING.md` | keep | The actual living reference #16 defers to; this is the file that changes as proposals get triaged. |
