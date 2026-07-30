---
title: "Governance — Project"
doc_type: governance
description: "Defines decision rights, review cadence, and phase-transition checkpoints for the project. Ships as this template's own worked example; replace with the consuming project's actual governance decisions."
status: active
version: "1.2"
created: 2026-07-04
updated: 2026-07-08
language: en
id: governance
tags: [governance, decision-rights, review-cadence, example-content]
owner: Alexandre Clemente
related: [risks, operation-manual]
---

# Governance — Project

> **Template example — replace before relying on this file.** The decision
> rights, cadence, and checkpoints below (including "Alexandre = sole
> decision-maker") are this template's own worked example. A project generated
> from this template should overwrite this file with its own actual governance
> decisions before treating it as authoritative.

## Decision rights

- Alexandre: sole decision-maker for the project (technical and process decisions).
- Operation Manual + Business Software Development Roadmap: define WHEN a phase can advance (process governance).
- Constitution (create with .specify/memory/): defines HOW code/specs must be built.

## Cadence

- Status review: weekly (status.md), or after each significant phase transition.
- ADR creation: whenever a significant architectural or tooling decision is made.
- Changelog update: after every artifact-producing session.

## Review checkpoints

- End of each roadmap phase: validate acceptance criteria before moving to next phase
  (see `docs/strategy/roadmap.md`, Section 7 — Transition rules).
