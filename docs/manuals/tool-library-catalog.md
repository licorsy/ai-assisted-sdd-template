---
title: "Claude Tool Library Catalog"
doc_type: tool-catalog
description: "Single-file catalog of vetted, third-party Claude Code tools (Agents, Skills, Hooks, MCP servers, Commands) available for reuse across projects, so any roadmap activity needing a Claude-ecosystem capability can favor a proven, already-vetted tool over rebuilding it. Mode B's product frameworks/libraries (Phase 1, Activity 11a) go to the project's own build-vs-buy record instead, not here."
status: active
version: "2.8"
created: 2026-07-07
updated: 2026-11-12
language: en
id: tool-library-catalog
tags: [tool-library, catalog, agents, skills, hooks, mcp, discovery, build-vs-buy]
owner: Alexandre Clemente
related: [tool-discovery, operation-manual, documentation-metadata-standard, roadmap]
lastreviewed: "2026-07-31"
---

# Claude Tool Library Catalog

Changelog of this document:

- v2.8: removes one third-party repository-infrastructure entry at the owner's request. Its idea (one idempotent command that applies this template's own repository-infrastructure templates) is tracked as [licorsy/git-governance#56](https://github.com/licorsy/git-governance/issues/56).
- v2.6: `grilling` entry's dangling citation of prompt `085` (archived private-repo sequence) qualified as non-citable in this repository, per `docs/manuals/operation-manual.md` Step 12 rule 3 (`docs/prompts/003-close-restart-followon-drift.md`).
- v2.5: doc-consistency-reviewer batch fix: adds a one-sentence clarification below the Purpose section that the frontmatter `lastreviewed` field is file-level (most recent date any entry was added/reconfirmed), not a per-entry claim - each entry's own `checked on` field carries that (prompt-095).
- Older entries: see `git log --follow` on this file (retention per `docs/manuals/documentation-metadata-standard.md` Section 2.1, prompt-033).

---

## Purpose

This is a template-level, cross-project cache of Claude Code tools (Agents, Skills, Hooks, MCP servers, Commands) that have already been searched for and vetted, so a project does not re-research the same capability from scratch each time. It is deliberately one lean file, not one file per tool, and it is scoped to Claude-ecosystem tools only (Mode A).

This is not where product frameworks/libraries for the software being built get recorded — that's Mode B, and it writes to the current project's own `/docs/references/build-vs-buy.md` (roadmap Phase 1, Activity 11a/11c) instead, with its own vetting criteria. See `agents/tool-discovery.md` for both modes.

Entries are added here only for a concrete, current need tied to a roadmap activity or artifact — not speculatively or exhaustively. This stays a small, needs-driven list, not an attempt to catalog every Claude tool that exists.

The `tool-hunter` subagent (`.claude/agents/tool-hunter.md`) is the intended writer of new entries; its operating instructions are `agents/tool-discovery.md`.

The frontmatter `lastreviewed` field (`docs/manuals/documentation-metadata-standard.md` Section 3) is file-level: it tracks the most recent date any entry below was added or reconfirmed, not any single entry's own freshness — each entry's own `checked on` field (Entry schema, below) carries that.

## Vetting criteria

Any tool that meets a concrete, current need is recorded here — do not discard a candidate for being new or fast-moving. Verify each of the following against the tool's actual source (repository, marketplace listing, changelog) — never infer or assume — and record it as evidence supporting the entry's signed security level, not as a pass/fail gate:

- **Tested** — usable and working; ideally with observed evidence, not just a claim in the tool's own README.
- **Validated** — real usage evidence beyond the author's own description.
- **Highly rated** — a concrete rating/stars/adoption signal from the source, cited.
- **Last updated** — the tool's last-updated date and the date this catalog entry was checked; a check older than 7 days is a recorded attribute, not a disqualifier.

If a signal cannot be verified, record the field as `unverified` rather than guessing.

### Security level

Every entry carries a signed security level, with a short justification, based on the vetting evidence above:

- **Trusted** — tested and validated with strong, citable evidence (e.g. official/verified publisher, wide adoption, no known unpatched issues).
- **Caution** — meets a concrete need but has weaker or partial evidence (e.g. unverified rating, small adoption, unclear maintainer) — usable, with awareness of the gap.
- **Unvetted** — recorded because it meets a need, but one or more vetting signals could not be checked; treat as unproven until verified.

## Entry schema

Each cataloged tool is a level-3 heading with this fixed set of fields:

### <Tool name>

- Kind: Agent | Skill | Hook | MCP server | Command
- Source: <link>
- What it does: <1-2 sentences>
- How to use: <short, concrete>
- Vetting evidence: tested (yes/no + evidence) · validated (yes/no + evidence) · rating (value + source) · last updated (date + source) · checked on (date this entry was verified)
- Security level: trusted | caution | unvetted — <short justification>
- Roadmap coverage: <phase/activity this could cover, e.g. "Phase 0, Activity 6">
- Status: candidate | adopted | rejected
- Notes: <optional>

## Catalog

### grilling (mattpocock-skills)

- Kind: Skill (model-invoked interview primitive inside the `mattpocock-skills` Claude Code plugin; paired user-invoked entry point `grill-me`)
- Source: https://github.com/mattpocock/skills (skill path `skills/productivity/grilling/SKILL.md`)
- What it does: Relentlessly interviews the user about a plan or design, one question at a time, walking each branch of the decision tree and resolving dependencies between decisions in order, offering a recommended answer with every question and looking facts up in the environment instead of asking. It is the shared primitive behind `grill-me` (bare interview) and `grill-with-docs` (interview plus domain model, updating `CONTEXT.md` and ADRs - not cataloged here, since it would clash with this repo's own ADR format).
- How to use: Already installed here as `mattpocock-skills:grilling` (plugin `mattpocock-skills@mattpocock-skills-marketplace`, v1.0.0). Invoke `/grill-me` for a user-initiated session, or use any "grill" trigger phrase to fire `grilling` model-invoked. Fresh install elsewhere: `/plugin install mattpocock-skills` (Anthropic official marketplace) or `npx skills@latest add mattpocock/skills`. Purely conversational - it asks questions and writes no files.
- Vetting evidence: tested: yes (installed and present in this environment's skill listing; `SKILL.md` read directly from the local plugin cache; no full interview run observed end-to-end) · validated: yes (listed in Anthropic's official plugin marketplace `anthropics/claude-plugins-official` as `mattpocock-skills`, SHA-pinned `ed37663c` = 2026-07-21; independent third-party usage write-ups found on devtalk.com and andrew.ooo) · rating: 192,291 stars / 16,526 forks, MIT (GitHub API, checked 2026-07-28); a third-party aggregator (Skillselion) reports ~287k all-time installs for `grilling` and "LOW risk" from its scanners - aggregator claim, not independently reproduced · last updated: skill file last changed 2026-07-13, repo last push 2026-07-28 (GitHub API) · checked on 2026-07-28
- Security level: trusted - MIT-licensed (LICENSE verified verbatim), listed and SHA-pinned in Anthropic's own official plugin marketplace, very large adoption (192k stars), actively maintained (pushed the same day as the check), and the skill body is a five-line prompt with no scripts, hooks, network calls, or file writes, so its blast radius is the conversation only. Caveat (freshness, not security): the locally installed copy is pinned to a 2026-06-25 commit via a local-directory marketplace, not the official one, so it predates an upstream 2026-07-03 confirmation-gate addition and a 2026-07-13 reword.
- Roadmap coverage: Phase 3 - Designing, Validation - optional interview-side complement to `agents/adversarial.md`'s pre-lock-in merit review; also usable alongside `agents/phase-reviewer.md` for independent review in any phase. Strictly optional and never a dependency: both agents must stay tool-neutral because they also run via `AGENTS.md` for non-Claude-Code tools.
- Status: candidate
- Notes: Complements rather than replaces `agents/adversarial.md` - it supplies elicitation (an interactive interview pulling assumptions out of the human) where `agents/adversarial.md` supplies analysis and a fixed output contract (no verdict line, no severity-ranked findings, no before/after proposed edits from `grilling` itself). To honor `agents/adversarial.md`'s independence rule, run the grilling session in a fresh context from the one that wrote the spec. Found via `tool-hunter`, triaged from a YouTube walkthrough of the `mattpocock/skills` package in prompt `085` (archived private-repo sequence, not a citable path in this repository) - the package as a whole is not adopted as a template dependency; only this one skill is cataloged as an optional aid.

### docflow

- Kind: Skill (Claude Code plugin bundling a `/bootstrap` skill plus ADR lifecycle skills)
- Source: https://github.com/EvolveHQ/docflow
- What it does: ADR-driven, documentation-led project bootstrap. Its `/bootstrap` skill scaffolds (or retrofits) an ADR catalogue (`adr/0000-template.md`, generated `INDEX.md`), a `CONVENTIONS.md` (authoring rules, ADR status lifecycle, audit trail — effectively a document-ownership/governance model), `AGENTS.md`/`CLAUDE.md` agent rules, and optional layers (a `plan/todo` + `plan/done` queue, `_agent/` coordination files, `domains/<slug>/` groupings, `GLOSSARY.md`). Companion lifecycle skills author, queue, ship, and audit ADRs.
- How to use: In Claude Code, `/plugin marketplace add EvolveHQ/docflow` then `/plugin install docflow@evolvehq`; run `/bootstrap` (or say "set up documentation-led conventions"). The bootstrap runs an interactive interview — pick a depth (express / guided / full), answer hard-to-reverse choices one at a time with recommended defaults, then sign off on the summarized plan before any files are written.
- Vetting evidence: tested: unverified (169 commits and active tagged releases indicate real development, but no independent test/usage evidence beyond the repo itself) · validated: unverified (no third-party usage/testimonials found) · rating: 10 stars, 1 fork (GitHub, checked 2026-07-12) · last updated: v0.9.4 released 2026-07-03 (GitHub releases) · checked on: 2026-07-12
- Security level: caution — MIT-licensed, actively maintained, and distributed as a proper Claude Code marketplace plugin with an interview-driven bootstrap that directly matches the "generate a Phase 0 scaffold from a short interview" need; but adoption is small (10 stars) and it is a single-org publisher with no independent testing/usage evidence.
- Roadmap coverage: Phase 0 - Foundation, Activities 2 (documentation folder structure), 7 (ADR template + first ADR), and 8 (document ownership model, via `CONVENTIONS.md` status lifecycle + audit trail). Does not cover the handbook, status, changelog, or risk register artifacts.
- Status: candidate
- Notes: Closest purpose-built match found for the "bootstrap a new SDD project" need, but partial — it covers only the ADR + conventions + folder-structure slice of Phase 0. Before adopting, weigh a convention clash: docflow imposes its own `AGENTS.md`/`CONVENTIONS.md`/`INDEX.md` layout and an ADR numbering/template scheme that differ from this repo's existing ADR format (`docs/adr/000X-*.md`) and the documentation-metadata standard.

### project-risk-register (lyndonkl/claude)

- Kind: Skill
- Source: https://github.com/lyndonkl/claude (skill: `project-risk-register`)
- What it does: Builds and maintains a project risk register — brainstorms risks by category (technical, schedule, resource, external, scope), scores each on probability × impact using a 5×5 matrix, and for High/Critical risks assigns a named owner, mitigation, contingency, and activation triggers.
- How to use: `npx skills add https://github.com/lyndonkl/claude --skill project-risk-register`, then invoke the skill to generate or update the risk register.
- Vetting evidence: tested: unverified · validated: unverified (no third-party usage evidence found) · rating: 131 stars, 18 forks (GitHub, checked 2026-07-12) · last updated: release 0.1 dated 2026-04-15 (GitHub) · checked on: 2026-07-12
- Security level: caution — reasonable adoption (131 stars) and it directly produces the Phase 0 risk-register artifact, but it is a single-author repo with only informally stated licensing ("open source; use freely with Claude Code" — no SPDX-tagged LICENSE file confirmed) and no independent test/usage evidence.
- Roadmap coverage: Phase 0 - Foundation, Activity 6 (initial risk register → `docs/risks.md`).
- Status: candidate
- Notes: Covers only Activity 6, not the broader bootstrap. Its 5×5 probability×impact output would need mapping onto this repo's `docs/manuals/examples/risks.md` structure, and the license should be confirmed against a real LICENSE file before adoption.

### graphify

- Kind: Skill (multi-agent CLI skill; Python package `graphifyy`, optional MCP stdio mode via `--mcp`)
- Source: https://github.com/safishamsi/graphify
- What it does: Turns a folder of code, docs, PDFs, images, or video into a persistent, queryable knowledge graph (`graphify-out/graph.json` + a plain-language `GRAPH_REPORT.md`), with community detection and an EXTRACTED/INFERRED/AMBIGUOUS audit trail. An agent answers repo questions by traversing the graph (`graphify query "..."`, `path`, `explain`) instead of grepping or full-reading files — directly targeting the "agents re-read many Markdown docs each session" token cost.
- How to use: Already installed at `~/.claude/skills/graphify`. Run `/graphify` once to build the graph over the repo, then `/graphify query "<question>"`; `--update` re-extracts only changed files; `--mcp` exposes it to agents as an MCP server. Code is extracted locally via tree-sitter AST at zero LLM cost; Markdown docs use semantic extraction (Gemini if `GEMINI_API_KEY`/`GOOGLE_API_KEY` is set, otherwise the host agent).
- Vetting evidence: tested: yes (installed and operational at `~/.claude/skills/graphify`; SKILL.md pipeline read and verified locally) · validated: strong adoption signal, but no independent test of the token-saving claim for this specific repo · rating: 84.7k stars, MIT (GitHub, checked 2026-07-13); cross-checked at ~76.3k via the SkillsLLM aggregator · last updated: v0.9.15 released 2026-07-13 (GitHub) · checked on 2026-07-13
- Security level: trusted — MIT-licensed, actively maintained (release same day), single but widely-adopted verified publisher (safishamsi), no known unpatched issues, and already installed and usable by the owner. Caveat (usage, not security): building or refreshing the graph over Markdown docs uses token-costing semantic extraction up front, though results are cached and `--update` is incremental — net saving depends on query frequency versus rebuild cost.
- Roadmap coverage: Cross-phase operating efficiency (`docs/manuals/operation-manual.md` Step 15) — lets agents query repo content instead of full-reading `docs/` artifacts across all phases; also supports Phase 1 Activity 11 prior-art / repo Q&A.
- Status: adopted — adoption decision recorded 2026-07-13 in `docs/references/token-economy.md` (prompt-037); surfaced to users in `README.md`'s Key documents list (prompt-076).
- Notes: Strongest match found for the token-economy need and already installed. Its built-in token-reduction benchmark (auto-runs on corpora over 5,000 words) can quantify the saving before committing. Complements — does not replace — the existing `docs/STATE.md` consolidated snapshot.

### knowledge-rag

- Kind: MCP server
- Source: https://github.com/lyonzin/knowledge-rag
- What it does: Local RAG MCP server for Claude Code — hybrid semantic + BM25 search with cross-encoder reranking over an indexed corpus, exposed as 13 MCP tools (`search_knowledge`, `get_document`, `add/update/remove_document`, `reindex_documents`, `list_documents`, etc.) with 20 format parsers. Vector store is ChromaDB; embeddings are BAAI/bge-small-en-v1.5 via ONNX. Runs fully local with zero external servers and zero API keys.
- How to use: `npx -y knowledge-rag` or `pip install knowledge-rag` (also shell script / Docker); register it as an MCP server in Claude Code, index the repo's `docs/`, then agents call `search_knowledge` for targeted passages instead of reading whole files.
- Vetting evidence: tested: unverified (no independent test observed) · validated: unverified (no third-party usage evidence found) · rating: 228 stars, MIT (GitHub, checked 2026-07-13) · last updated: v4.5.0 released 2026-07-07 (GitHub) · checked on 2026-07-13
- Security level: caution — MIT-licensed, actively maintained, and fully local with no API keys (good privacy posture), but small adoption (228 stars), single-author, and no independent validation evidence.
- Roadmap coverage: Cross-phase operating efficiency — targeted semantic retrieval over `docs/` to avoid full-document reads.
- Status: candidate
- Notes: Likely overkill for this corpus (run `git ls-files '*.md' | wc -l` for the live count — 142 files as of this writing, growing by roughly one per merged prompt; the frozen `docs/prompts/` archive is most of it). The repo's generated `docs/STATE.md` snapshot and the `graphify` graph already cut multi-file scans; standing up a ChromaDB/ONNX RAG server with a reindex path is heavyweight infrastructure for a corpus this small. Recorded as a vetted option to revisit if the docs corpus grows substantially.
