---
title: "Telemetry Template - how to apply"
doc_type: product-doc
description: "Ready-to-apply, one-line-per-session activity ledger (docs/telemetry/sessions.jsonl) for projects generated from this template: phase, duration, tokens, artifacts touched, decisions, blockers. This template repository does not adopt the ledger for itself."
status: active
version: "1.2"
created: 2026-07-24
updated: 2026-08-06
language: en
id: telemetry-template
tags: [telemetry, observability, session-log, reference-template, how-to]
owner: Alexandre Clemente
related: [operation-manual, role-operating-guide, init]
diataxis: how-to
---

# Telemetry Template - how to apply

Ready-to-apply session telemetry for a **project generated from this template** (this template repository itself deliberately stays on its own lightweight docs CI, the same boundary [`docs/references/infra-templates/README.md`](../infra-templates/README.md) already states for infrastructure).

`/template-init` scaffolds `docs/telemetry/` by default for every generated project - strongly recommended, not mandatory. A human who prefers not to use it declines during bootstrap (see "Declining" below); this file stays the reference for what gets scaffolded and how to apply it if declined then reconsidered later.

## What this is

A one-line-per-session activity ledger: `docs/telemetry/sessions.jsonl`, one JSON object appended per session, validating against [`session-entry.schema.json`](session-entry.schema.json). It exists to answer "what's been done, what phase, how long, what did it cost" across every project a person or agency runs from this template - without a dedicated dashboard or a new mandatory agent.

Most of what a project's activity history needs is already free: `git log`, Conventional Commits, and this repository's own frontmatter/`status` conventions already cover artifacts touched, timestamps, and phase transitions. What git *cannot* give - wall-clock session duration, tokens spent, and decisions/blockers stated in plain language - is what this one JSON line captures.

## Prerequisites

None beyond the template itself. No new dependency, no new mandatory agent.

## Declining

`/template-init` scaffolds `docs/telemetry/` by default and asks a lettered choice at bootstrap time (`agents/init.md`, Procedure step 3): "A) Scaffold `docs/telemetry/` now - recommended" / "B) Skip - state why." Declining is a valid choice - nothing here is mandatory - but the reason is recorded in `docs/status.md` rather than silently skipped, so a later reader sees a deliberate decision, not an oversight. A project that declined can still adopt this template at any later point by following "How to apply" below.

## How to apply

1. `/template-init` creates `docs/telemetry/` by default during bootstrap (see `agents/init.md`'s scaffold table); if it was declined then, create it manually here to opt in later.
2. Copy [`session-entry.schema.json`](session-entry.schema.json) into it as the validation contract; keep it there so tooling can find it at a stable path.
3. Wire the append step into the existing session-end checklist - `agents/orchestrator.md`'s Closing rule and `docs/manuals/role-operating-guide.md` Section 13 step 5 already say "keep the project memory synchronized" / "update `/docs/status.md` and `CHANGELOG.md` before ending the session"; if `docs/telemetry/` exists in the project, append one `sessions.jsonl` line as part of that same step. This is conditional, not mandatory for projects that haven't adopted it.
4. Derive `artifacts_created` / `artifacts_updated` from `git status` / `git diff --name-status` at session end - never hand-typed, so the field can't silently drift from what actually changed.
5. See [`sessions.jsonl.example`](sessions.jsonl.example) for three realistic lines.

## Where the `tokens` field comes from

The source prompt for this template asked whether `rtk` (the token-usage proxy tool) could reliably source a per-session token count before defaulting to an estimate. Checked directly, 2026-07-24:

- `rtk gain` / `rtk gain --project` report **cumulative, all-time savings** from commands actually proxied through `rtk` (global or per-project scope) - not a bounded single-session figure, and not the full token cost of a conversation (only the subset of tool output `rtk` filtered).
- `rtk cc-economics` exists specifically to pair `rtk`'s savings against real Claude Code spend via `ccusage`, but at the time of this check it failed (`ccusage` JSON parse error in this environment) and reports at a daily/monthly account grain even when working - not scoped to one project's one session either way.

**Conclusion: no reliable automatic per-session source exists today.** `tokens.source` defaults to `"estimate"` (for example, a character-count heuristic over the session's transcript) until `cc-economics`/`ccusage` output is stable and can be scoped to a session boundary. Record whichever source was actually used in the `tokens.source` field every time - do not silently default without recording it.

## Non-goals (deferred, not forgotten)

Cost, margin, pricing-benchmark, and quote-estimate computation are explicitly out of scope for this pass. The source report that proposed this ledger also proposed that layer, and its own risk analysis admitted a benchmark needs at least three sampled projects to be trustworthy - none exist yet. Building that math now would mean designing a contract before its consuming side (a real cross-project management tool) is validated. Revisit once several real `sessions.jsonl` histories exist to design against.
