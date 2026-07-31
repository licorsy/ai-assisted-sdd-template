---
title: "ADR-0010: Public-mirror release via licorsy/ai-assisted-sdd-template"
doc_type: adr
description: "Records the decision to publish a new public repository, licorsy/ai-assisted-sdd-template, seeded with a single fresh commit and no carried-over history, as this template's public home - rather than flipping aleclemente/ai-assisted-sdd-template's own visibility. The private repository stays the sole place development happens; the public mirror is refreshed by a deliberate, on-demand sanitized sync, not continuously."
status: active
version: "1.0"
created: 2026-07-30
updated: 2026-07-30
language: en
id: 0010-public-release
tags: [adr, public-release, governance, licorsy]
owner: Alexandre Clemente
related: [0002-audience-tier]
---

# ADR-0010: Public-mirror release via `licorsy/ai-assisted-sdd-template`

## Status

Accepted (2026-07-30).

## Context

`local-notes/012-sanitizacao-para-repositorio-publico.txt` names "ADR-0010" as the decision to make this template public, but no such ADR existed prior to this one — the make-public call was originally made in the user's separate, private `personal-os` workspace, and `docs/prompts/100-prompt-public-release-sanitization.md`'s own research confirmed no local ADR backed it. `100` distilled that note's checklist into a same-repo action: audit `aleclemente/ai-assisted-sdd-template`'s full git history for secrets/PII, then flip its own GitHub visibility to public.

That approach carries real cost: years of commit history would need to be grepped and, if anything is found, rewritten (`git filter-repo`/BFG) before the repository could safely go public — the highest-risk and highest-effort path available. Meanwhile, `licorsy` already exists as this user's public-tooling GitHub organization, currently holding `git-governance` and `docs-governance` (`docs/prompts/099-prompt-docs-governance-adoption.md`, `101-prompt-git-governance-adoption.md`), both plugins already extracted from this same template's own work. Publishing the template itself under the same organization was considered as an alternative to publishing it in place.

## Decision

Publish `licorsy/ai-assisted-sdd-template` as a new public repository, seeded with a single fresh commit built from this repository's current `main` (no carried-over history). `aleclemente/ai-assisted-sdd-template` stays private and remains the sole repository where prompt-driven development happens. The public mirror is kept current afterward by a deliberate, on-demand export — a sanitization gate followed by a tree export, commit, and push — not a continuous or automatic sync; it updates when the user decides something is release-ready, not on every merge to `develop`.

`main` is already this repository's protected, stable branch per `prompt-101`'s git-governance adoption (branch-naming taxonomy, permission matrix, GitHub-native protection). This decision documents that `main` is what gets exported to the public mirror; it neither changes nor re-decides any of `101`'s existing git mechanics.

The sanitization-gate script, the initial migration itself, and the repeatable sync mechanism are specified in a later prompt (`docs/prompts/108-*.md`), not this one — this ADR records the decision those prompts execute against.

## Alternatives considered

1. **Flip this repository's own visibility to public** (`100`'s original approach) — rejected: requires auditing and potentially rewriting this repository's entire commit history for secrets/PII before it's safe to expose, the highest-risk and highest-effort option, and offers no ongoing mechanism for keeping future private-repo iteration separate from what's public.
2. **Full-history clone, sanitized in place** (`git filter-repo`/BFG scrubbing the existing history, then pushing everything to the new repository) — rejected: most thorough in principle, but defeats most of the point of starting fresh, and this repository's durable history already lives in its own artifacts (`CHANGELOG.md`, `docs/prompts/PROMPT-INDEX.md`, ADRs), not in git blame — there is little lost by not carrying commit history forward.
3. **Curated milestone commits** (hand-reconstructing a handful of clean commits, e.g. one per major ADR/prompt-cycle, for narrative value) — rejected: extra curation work for narrative value only, and each reconstructed commit would still need its own sanitization check, without meaningfully reducing risk versus a single fresh commit.

## Consequences

+ No git-history rewriting is needed — the public repository never contains the history that would need scrubbing.
+ Consolidates this user's public-tooling brand under `licorsy`, alongside `git-governance` and `docs-governance`, both already extracted from this template's own work.
+ Keeps a private space for iteration that has not yet passed a sanitization check, without blocking ongoing development on a public-readiness gate.
- Two repositories now exist for this template — a private source of truth and a public mirror. Any future prompt touching cross-repository consistency must state which repository it targets.
- The public mirror's own git history starts empty at the migration point; contributors inspecting `licorsy/ai-assisted-sdd-template` see no history before that first commit.
- Numbered `0010`, not `0005` (the next sequential slot after `0004`) — deliberately matching the number `local-notes/012` itself already used, most likely mirroring a cross-repository numbering the user keeps in the private `personal-os` repository. This ADR's number is therefore not evidence of six ADRs having existed in between; `0005`-`0009` are intentionally unused here.

## Confidence

High for the two-repository model and the single-fresh-commit migration (both are mechanically simple and low-risk relative to the rejected alternatives). Medium for the "on-demand, not continuous" sync cadence — its concrete mechanism is not yet built (`108`), and whether manual-trigger sync remains the right cadence once external contributors show up on the public mirror is an open question this ADR does not resolve.
