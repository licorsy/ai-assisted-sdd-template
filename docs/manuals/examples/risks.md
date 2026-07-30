---
title: "Risk Register — Project"
doc_type: governance
description: "Tracks project risks with probability, impact, mitigation, and status; consulted during discovery and planning per the roadmap. Ships as this template's own worked example register (R1-R7); replace with the consuming project's actual risks."
status: active
version: "1.2"
created: 2026-07-04
updated: 2026-07-28
language: en
id: risks
tags: [risk-register, governance, mitigation, example-content]
owner: Alexandre Clemente
related: [governance, roadmap]
---

# Risk Register — Project

> **Template example — replace before relying on this register.** The seven
> risks below (R1-R7) are this template's own worked example of a populated
> risk register, not this project's actual risks. A project generated from
> this template should replace them with its own real risk assessment before
> relying on this file during discovery/planning.

| ID | Risk | Probability | Impact | Mitigation | Status |
|---|---|---|---|---|---|
| R1 | Scope creep due to generic/agnostic ambition | Medium | High | Enforce phase gates and MVP scope discipline | Open |
| R2 | Insufficient time dedicated by Alexandre (solo execution) | Medium | High | Weekly status review, realistic milestone sizing | Open |
| R3 | Over-reliance on AI-generated code without review | Low | High | Mandatory human checkpoint before merge (Constitution) | Open |
| R4 | Documentation becomes outdated / stops being trusted | Medium | Medium | Update status.md weekly, changelog every cycle | Open |
| R5 | Spec Kit's per-feature spec fragmentation reduces whole-system visibility as project grows | Medium | Medium | Monitor after 2-4 weeks of use; consider OpenSpec migration if it becomes a real problem | Open |
| R6 | Switching between AI assistants (Claude Code/Copilot/Gemini) introduces inconsistent outputs | Low | Medium | Always re-paste master prompt at session start; rely on committed docs as shared memory | Open |
| R7 | Manual migration of existing constitution.md/handbook.md into Spec Kit structure creates duplicate sources of truth | Medium | Medium | Follow migration steps precisely (see final instructions); deprecate old file explicitly | Open |
