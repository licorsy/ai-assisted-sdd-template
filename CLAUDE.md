---
title: "CLAUDE.md"
doc_type: instruction
description: "Claude Code's entry point for this repository: the always-on confirmation rule, the documentation metadata rule, and the pointers to the operation manual and governance plugins that own the full text of each."
status: active
version: "1.0.3"
created: 2026-07-30
updated: 2026-08-07
language: en
id: claude-adapter
owner: Alexandre Clemente
tags: [instructions, adapter, claude-code, sdd]
related: [agents-adapter, operation-manual, documentation-metadata-standard]
---

# CLAUDE.md

This repository is a living instance of the AI-assisted SDD template operating model. See `README.md` for the full document map.

## Always-on rule

<!-- sync:always-on-rule source=docs/manuals/operation-manual.md anchor="## Step 10" -->
Before executing any non-trivial instruction (creating or materially changing an artifact, entering a roadmap phase, or running a Spec Kit command), state what will be done and which artifacts will change, and wait for confirmation. After executing it, summarize what changed and ask before continuing. This is the full rule defined in `docs/manuals/operation-manual.md`, Step 10; it applies regardless of task size.
<!-- /sync:always-on-rule -->

## Documentation metadata rule

<!-- sync:documentation-metadata-rule source=docs/manuals/operation-manual.md anchor="## Step 9" -->
Every Markdown documentation file or roadmap-generated artifact — `agents/` and every category directory under `docs/` enumerated in `docs/manuals/documentation-metadata-standard.md` Section 1, plus any artifact the roadmap generates under `.specify/` (best-effort there: Spec Kit tooling may regenerate those files and strip custom frontmatter, so apply it but don't treat its survival as guaranteed) — must carry the YAML frontmatter schema defined in `docs/manuals/documentation-metadata-standard.md`; apply it, alongside the version header and — for a guidance change, not a mechanical-only edit (see Section 2.1's distinction) — the changelog, whenever such a file is created or materially updated. This is the full rule defined in `docs/manuals/operation-manual.md`, Step 9; it applies regardless of task size.
<!-- /sync:documentation-metadata-rule -->

## Change-as-prompt rule

<!-- sync:change-as-prompt-rule source=docs/manuals/operation-manual.md anchor="## Step 12" -->
Every non-trivial change, update, upgrade, or refactor to **this template repository itself** (its own docs, governance, prompts, tooling — not a project generated from this template) must first be captured as its own `docs/prompts/NNN-<slug>.md`, following `docs/prompts/basic-prompt-template.md`'s structure with a scenario-specific ROLE, TASK, and `## REQUIREMENTS, CONSTRAINTS AND RULES` section (`docs/prompts/001-restart-prompt-archive-and-source-of-truth.md` is the worked example of this shape) before execution begins. A named batch of small, related, individually-minor fixes may share one prompt document that lists every item explicitly (Step 12, rule 9); structural changes still get their own. This is the full rule defined in `docs/manuals/operation-manual.md`, Step 12; it applies regardless of task size.
<!-- /sync:change-as-prompt-rule -->

## Driving the roadmap

To actively drive the phase-gated roadmap (choose or resume the Step 0 startup choices, work through the current phase, and gate transitions), run `/orchestrator`. Run `/orchestrator reset` to re-choose the Step 0 startup choices (see `agents/orchestrator.md`, Step 0).

To independently verify a completed phase against its own Acceptance Criteria / Done, Expected Result, and Generated Artifacts, use the `orchestrator-reviewer` subagent instead of asking the same conversation that did the work to grade itself.

## Git operations

Before creating a branch, naming it, or proposing a merge — and always before any operation that touches `staging` or `main` — use the `git-governance-advisor` subagent (installed via the `git-governance` plugin, [licorsy/git-governance](https://github.com/licorsy/git-governance)) instead of restating its branch-naming taxonomy and permission matrix (autonomous up to and including opening a PR into `staging`/`main`; explicit human permission required to merge one) here. This repository's actual GitHub-side enforcement — no direct push, force-push, or deletion on `develop`, `staging`, or `main` — is configured via the same plugin's `setup-branch-protection.sh` script (recorded as `101-prompt-git-governance-adoption.md`, archived private-repo sequence, not a citable path in this repository, per `docs/manuals/operation-manual.md` Step 12 rule 3).

## Canonical documents

Do not duplicate instructions here. The canonical process documents live in `agents/`, `docs/manuals/`, `docs/strategy/`, `docs/adr/`, and `docs/visuals/` (the directories `.github/CODEOWNERS` gates); `docs/prompts/` holds this repository's change-as-prompt records. This file only points to them and states the rules that should apply to every session regardless of task size.
