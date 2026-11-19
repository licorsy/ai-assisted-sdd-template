---
title: "Prompt 025: pin the Spec Kit install, use the /speckit-<command> syntax, add converge"
doc_type: prompt
description: "Closes issue #71: the template installed Spec Kit from the bare Git URL (whatever main held that day), wrote its commands as /speckit.<command> while the Claude integration installs /speckit-<command> skills, and had no /speckit-converge step, no upgrade or existing-project path, and no token-economy option for the skill listing."
status: archived
version: "1.0"
created: 2026-11-19
updated: 2026-11-19
language: en
id: 025-fix-spec-kit-pin-syntax-converge
tags: [prompt, spec-kit, install, roadmap]
owner: Alexandre Clemente
related: [operation-manual, roadmap, init, orchestrator]
---

# Prompt 025: pin the Spec Kit install, use the /speckit-<command> syntax, add converge

## ROLE

Act as the maintainer aligning the template's Spec Kit instructions with what the current Spec Kit release documents, checking Spec Kit's own docs at the pinned tag before trusting the issue.

## CONTEXT

Issue #71, checked on 2026-11-12 at `v1.4.0`. Re-checked on 2026-11-19 against the GitHub API and Spec Kit's docs at `v1.4.3`, the latest stable release that day (eight releases between 2026-11-03 and 2026-11-19): the installation guide recommends `uv tool install specify-cli --from git+https://github.com/github/spec-kit.git@vX.Y.Z`; the Claude integration page installs `.claude/skills/speckit-<command>/` invoked as `/speckit-<command>` and documents `--integration-options="--no-model-invocation"` with its extension-hook caveat; `templates/commands/` ships the converge command; the upgrade guide documents `uv tool install --force …@vX.Y.Z`, `specify integration upgrade <key>`, `specify extension update`, `specify self check` and `specify init --here --force --integration <key>`. This template is also the base of the PTT repository, which runs Spec Kit in Phase 3.

## TASK

1. `docs/manuals/operation-manual.md` Steps 1-2: pinned install with `specify version`, the existing-project and upgrade commands, `--no-model-invocation` as the Claude Code default with Spec Kit's caveat, a pointer to Spec Kit's per-integration pages; Steps 4-5 gain `/speckit-converge`.
2. `agents/init.md` step 4: the human task installs the pinned CLI and reports `specify version`.
3. `docs/strategy/roadmap.md`: Phase 3 Activity 9's recovery step installs a pinned CLI; Phase 5 gains Activity 6a, converge until `Converged`.
4. `agents/orchestrator.md` and `docs/visuals/template-visual-overview.md` Section 5 gain converge.
5. Replace `/speckit.<command>` with `/speckit-<command>` in every living document.

## REQUIREMENTS, CONSTRAINTS AND RULES

- [CRITICAL] No living document installs Spec Kit from an unpinned ref.
- [HIGH] Changelog entries, `CHANGELOG.md` and historical prompt records keep the syntax of their time.
- [HIGH] Every edited document with a body changelog bumps `version` and gains an entry, keeping the 3-entry retention.
- [CRITICAL] Regenerate `docs/STATE.md` with the Linux `node` (prompt 021).

## FORMAT AND OUTPUT

Direct file edits, a `CHANGELOG.md` `[Unreleased]` entry, this prompt record and its `docs/prompts/PROMPT-INDEX.md` row, and a regenerated `docs/STATE.md`.

## Completed

**2026-11-19.** `git grep "/speckit\."` outside changelog lines, `CHANGELOG.md` and `docs/prompts/` returns nothing; the only remaining bare `spec-kit.git` URL is the sentence explaining why not to use it.
