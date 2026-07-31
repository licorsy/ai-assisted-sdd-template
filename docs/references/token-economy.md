---
title: "Token Economy - adopt/defer/reject decisions"
doc_type: product-doc
description: "Live-vetted decisions on tooling to reduce token cost when operating this docs-heavy repository: adopt Graphify for repo Q&A, rely on the generated STATE.md for state reads, defer local vector-DB/RAG, reject ponytail and NotebookLM for this need. Records the reasoning and revisit triggers, not just the verdicts."
status: active
version: "1.2"
created: 2026-07-13
updated: 2026-07-28
language: en
id: token-economy
tags: [token-economy, cost, tooling, rag, decisions]
owner: Alexandre Clemente
related: [tool-library-catalog, operation-manual]
diataxis: explanation
---

# Token Economy - adopt/defer/reject decisions

The cost problem: agents operating this repository re-read many Markdown documents each session. Five candidate mitigations were live-vetted by the `tool-hunter` subagent on 2026-07-13 (prompt-037; evidence and security levels recorded in [tool-library-catalog.md](../manuals/tool-library-catalog.md)). Decisions:

| Candidate | Decision | Why (one line) |
| --- | --- | --- |
| Generated [`docs/STATE.md`](../STATE.md) (built in-house, prompt-034) | **Adopted** | One deterministic read replaces the multi-file "where are we?" sweep; zero new dependencies |
| Graphify (repo → queryable knowledge graph; already installed) | **Adopt** | `graphify query` answers repo questions from the graph instead of re-reading files; MIT, very actively maintained (v0.9.15, 2026-07-13). Caveat: graph builds cost extraction tokens up front - net saving depends on query frequency vs. rebuild cost |
| Local vector-DB / RAG MCP (leading vetted option: `knowledge-rag`, ChromaDB + local embeddings) | **Defer** | Technically sound and fully local, but heavyweight for the current corpus (run `git ls-files '*.md' \| wc -l` for the live count — 142 files as of this writing, growing by roughly one per merged prompt; the frozen `docs/prompts/` archive is most of it) that STATE.md + Graphify already cover. Revisit trigger: the doc corpus grows past a few hundred files or Graphify queries start missing |
| ponytail (anti-overengineering skill from the SDD-Iuri stack) | **Reject for this need** | Disciplines code generation; this repo generates governance docs, not application code - it does nothing about document re-reads. May be worth revisiting inside a generated project, not the template |
| NotebookLM as external doc store | **Reject** | No supported programmatic path: the official API is enterprise-gated; community bridges rely on undocumented internal APIs and browser-cookie auth ("use at your own risk") - a security liability that still returns tokens into context anyway |

Also noted, not cataloged: **agentskillsfinder.com** is a live skills directory (no formal vetting of listed skills) - useful as a *discovery source* for future tool-hunter runs, not itself a token-reducing tool.

## Practices that cost nothing

These operating-manual mechanisms already cut token spend and should be preferred before any new tooling:

- Read [`docs/STATE.md`](../STATE.md) first for state questions (operation-manual Step 13), then open only the linked doc that answers it.
- Body changelogs capped at 3 entries (metadata standard Section 2.1) - less boilerplate in every read.
- Delegation and parallel dispatch (operation-manual Step 16a) - mid-tier subagents draft long-form output; the reasoning-tier model reviews.
- The session interaction level (orchestrator Step 0) - fewer confirmation round-trips means fewer full-context turns.
