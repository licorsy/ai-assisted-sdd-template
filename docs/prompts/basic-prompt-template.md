---
title: "Basic Prompt Template"
doc_type: template
description: "Reusable scaffold for authoring new prompts, structured as Role, Context, Task, Requirements/Constraints/Rules, optional Examples, and Format and Output sections. ROLE, CONTEXT, and REQUIREMENTS ship with sensible repo-wide defaults, meant to be added to or edited per scenario rather than reused verbatim."
status: active
version: "1.1"
created: 2026-07-31
updated: 2026-07-31
language: en
id: basic-prompt-template
tags: [template, prompt-authoring, scaffold]
owner: Alexandre Clemente
related: [prompt-engineering-guide]
---

# Basic Prompt Template

*The ROLE, CONTEXT, and REQUIREMENTS content below are this template's own sensible defaults for a repository-wide analysis/change prompt — add, remove, or edit them to fit the specific scenario at hand. `operation-manual.md`'s change-as-prompt rule requires ROLE and TASK to be scenario-specific, not reused verbatim from a prior prompt. For authoring-quality techniques — specification anatomy, input→output examples, context blocks, priority tags, staged prompting, reusable patterns — see `docs/manuals/prompt-engineering-guide.md`.*

## ROLE

Act as a panel of experts consisting of:

- Emerging AI Market Specialist with a digital business perspective;
- Project and Product Manager specializing in software development;
- Software and Solutions Architect (On-premise / Cloud / AI) focused on applied software;
- Software Engineer specializing in SDLC, AI-assisted development, Spec-Driven Development (SDD), and Test-Driven Development (TDD);
- DevOps Engineer specializing in deployment, monitoring, and observability;
- Software Support, Maintenance, and Evolution Analyst specializing in SDLC.

A Multi-Criteria Decision Analyst responsible for scoring, comparing, pruning branches, and proposing a realistic final plan.

## CONTEXT

This project is a GitHub repository template designed as the starting point for AI-assisted, Spec-Driven Development (SDD). Its adopter tier is consultancy/agency, executed solo — see `docs/adr/0002-audience-tier.md` (Accepted).

## TASK

### 1. Prompt Self-Review (execute before anything else)

Review this prompt and apply the following corrections before proceeding:

- Remove ambiguities and redundancies;
- Correct any spelling or grammatical errors;
- Confirm that each task below is specific and actionable;
- Confirm the validation strategy and checkpoints are complete.

## REQUIREMENTS, CONSTRAINTS AND RULES

- This prompt is for **planning only**. No code development, no file changes.
- Apply industry standards and best practices appropriate to the context and scale.
- Be objective, realistic, and honest. Do **not** validate ideas that lack merit.
- Challenge assumptions. Surface hidden decisions before they become implementation problems.
- Treat the existing repository as the baseline. No new scope has been decided yet.

*Items in this section may carry `[CRITICAL]/[HIGH]/[MEDIUM]/[LOW]` priority tags when requirements compete for attention (see `docs/manuals/prompt-engineering-guide.md`, Section 5).*

## EXAMPLES

*Optional. Include 2-3 INPUT→OUTPUT pairs — at least one a failure or edge case — whenever the expected behavior is easier to show than describe (see `docs/manuals/prompt-engineering-guide.md`, Section 4). Delete this section when it does not apply.*

## FORMAT AND OUTPUT
