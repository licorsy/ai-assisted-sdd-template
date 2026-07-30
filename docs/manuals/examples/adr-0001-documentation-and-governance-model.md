---
title: "ADR-0001: Documentation and Governance Model"
doc_type: adr
description: "Adopts Diataxis categories, ADRs, a handbook entry point, and a status snapshot as the documentation model, versioned in Git for RAG-friendly search. Ships as this template's own worked example ADR; a generated project should supersede or re-affirm it with its own decision."
status: active
version: "1.1"
created: 2026-07-04
updated: 2026-07-08
language: en
id: adr-0001-documentation-and-governance-model
tags: [adr, documentation-model, diataxis, governance, rag, example-content]
owner: Alexandre Clemente
related: [governance, documentation-metadata-standard]
---

# ADR-0001: Documentation and Governance Model

> **Template example — replace before relying on this ADR.** This file is this
> template's own worked example of an Accepted ADR. A project generated from
> this template should either supersede it with its own ADR-0001, or explicitly
> re-affirm it as a real decision — do not treat the content below as your
> project's actual documentation-and-governance decision.

## Status

Accepted

## Context

The project needs a documentation approach that scales, stays readable for new
contributors, and can be searched semantically (via RAG) without becoming an
unmanageable pile of long, hard-to-navigate files.

## Decision

Adopt a documentation model combining:

- Diataxis categories (tutorials, how-to, reference, explanation).
- Architecture Decision Records (ADR) for all significant decisions.
- A single `handbook.md` as the high-level entry point.
- A `status.md` as a lightweight, frequently updated project health snapshot.
- All documents versioned in Git alongside the code, in a `/docs` folder.

## Alternatives considered

1. Single large README with everything — rejected for poor scalability and readability.
2. External wiki (Notion/Confluence) — rejected for breaking version parity with code.
3. No formal decision log — rejected because it causes loss of rationale over time.

## Consequences

+ Clear separation between "what things are" and "why decisions were made".
+ Searchable via RAG without ambiguity between document types.
+ Onboarding new contributors (human or AI agent) becomes faster.
- Requires discipline to keep documents updated each sprint/cycle.

## Confidence

High
