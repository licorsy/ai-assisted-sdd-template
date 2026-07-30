---
title: "Quickstart"
doc_type: product-doc
description: "One-page, three-step on-ramp from clicking \"Use this template\" to the orchestrator proposing the first phase gate, for a first-time adopter who doesn't want to read the full operation manual before starting."
status: active
version: "1.3"
created: 2026-07-24
updated: 2026-07-28
language: en
id: quickstart
tags: [onboarding, getting-started, template-init, orchestrator]
owner: Alexandre Clemente
related: [operation-manual, init, orchestrator]
diataxis: tutorial
---

# Quickstart

Three steps from an empty repository to the orchestrator driving your first phase.

1. **Use this template.** On GitHub, click "Use this template" → "Create a new repository."
2. **Run `/template-init` in Claude Code.** It detects greenfield vs. brownfield, scaffolds only the Phase 0 artifacts that are missing (status, ADR template, handbook stub, risk register, governance stub, telemetry ledger, changelog entry), and never overwrites anything — safe to re-run.
3. **Run `/orchestrator`.** It confirms what you're bringing and how you want to work (the Step 0 startup choices - see `agents/orchestrator.md`, Step 0), then drives the phase-gated work from there. Run `/orchestrator reset` any time to re-choose them.

## Starting from an existing codebase?

Brownfield additionally means a codebase inventory, a gap analysis against this operating model's documentation requirements, and an ADR on how much undocumented behavior gets reverse-engineered before Phase 1 relies on it. See [roadmap.md, Section 3](docs/strategy/roadmap.md#3-starting-condition-greenfield-or-brownfield) for the full rules and [agents/init.md](agents/init.md) for how `/template-init` detects it.

## What happens next

The orchestrator will summarize what it's about to do and wait for confirmation before each non-trivial step — that rule is always on. For the full operating model (phase gates, document roles, review subagents), start at the [Key documents](README.md#key-documents) list in the README rather than reading this page for more than it has; it is deliberately a path, not a rulebook.
