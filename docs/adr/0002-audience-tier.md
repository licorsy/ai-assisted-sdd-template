---
title: "ADR-0002: Intended Adopter Tier"
doc_type: adr
description: "Records the resolved adopter-tier decision - consultancy/agency, executed solo (2026-07-12) - the four candidate tiers considered, and the re-assessed status of each backlog item that had been blocked on it."
status: active
version: "2.3"
created: 2026-07-09
updated: 2026-07-30
language: en
id: 0002-audience-tier
tags: [adr, governance, audience-tier, decision-record, accepted]
owner: Alexandre Clemente
related: [adr-0001-documentation-and-governance-model, roadmap]
---

# ADR-0002: Intended Adopter Tier

## Status

Accepted (2026-07-12). Amended 2026-07-28 (v2.0 → v2.2): frontmatter `status` corrected from a stale `draft`-like state to match this section's own already-Accepted body, and the "issue templates still not justified" bullet re-assessed against three issue templates that shipped since (`prompt-089`); re-confirmed with no further change (`prompt-090`). Neither amendment changes the tier decision itself.

## Context

Several prior decisions in this repository trace back to the same unresolved question without ever recording it as its own decision: who is this template primarily for? `prompt-006`'s panel-recommendation review rejected consultancy/agency artifacts (`/proposals`, `/contracts`) as premature because "nothing defined yet such as problem, goals or ideas." `prompt-012` added a conditional "reserved for later" note in `README.md` for the same reason. Each time, the question was deferred informally, in prose, in a different document, rather than captured once as a proper decision record the way `adr-0001` already models for this repository's own documentation-and-governance choices.

## Decision

**Consultancy/agency, executed solo.** The repository owner made this call directly (2026-07-12) rather than it being inferred. This resolves two axes the original candidate list conflated into a single choice:

- **Business model: consultancy/agency.** The template's primary use is running client engagements — proposals, statements of work, and delivery governed by this repository's own phase-gated roadmap. This is the tier that determines which client-facing process assets the template needs (see Consequences).
- **Staffing: solo.** One person executes every role. This does not conflict with the business-model choice — `docs/manuals/role-operating-guide.md` already fully covers a single operator holding all nine lifecycle roles (project manager, product manager, product owner, architect, engineer, scrum master, stakeholder, QA, DevOps), regardless of which business-model tier is chosen. "Small team" and "enterprise seed" remain rejected candidates specifically on the staffing axis, not the business-model axis.

Backlog items, re-assessed against this decision rather than left uniformly blocked:

- **`/proposals` and `/contracts` top-level folders** — now justified by the business-model choice. Not created by this ADR itself; adopting them is its own follow-up change with its own prompt, per this ADR's original Consequences commitment.
- **Issue templates** — deferred here, later adopted on different grounds: `prompt-075`/`prompt-080` shipped `.github/ISSUE_TEMPLATE/` for external adopters reporting against this template, not for internal multi-owner collaboration. This bullet's original reasoning stands for the collaboration case; the artifact exists.
- **`agents/spec-writer.md` (a fifth subagent, alongside orchestrator-reviewer, adversarial-reviewer, tool-hunter, and doc-consistency-reviewer)** — still deferred. Revisit only if real client-engagement spec volume actually becomes a bottleneck, not preemptively.
- **Optional product-level CI/CD guidance for repositories generated from this template** — still premature. No real client engagement exists yet to write concrete guidance against.

## Alternatives considered

1. Leave the question scattered informally across `README.md` and individual prompts' rejection reasoning (the status quo up to this point) — rejected, because it made the same question get re-litigated piecemeal each time an audience-dependent idea came up, instead of being answered once and pointed to.
2. Pick a tier now by default assumption (for example, defaulting to "solo entrepreneur" since that is the repository's current actual usage) — rejected for this ADR specifically, because the tier choice belongs to the repository owner, not to an inferred default; recording an assumed answer here risks it being read later as a real decision.

## Consequences

+ Every future audience-dependent proposal now has one place to check and to point at, instead of re-deriving "has this been decided yet?" from scattered prose each time.
+ `/proposals` and `/contracts` are now a justified, concrete extension rather than a speculative "if chosen" branch — but still requires its own follow-up prompt to actually create, per the original commitment below.

- The `spec-writer` subagent (a fifth, alongside the four that already ship) remains deliberately deferred (issue templates, previously grouped with it here, have since shipped for external-adopter use - see the Decision section above); this decision resolves the business-model axis, not the staffing or spec-volume axes that item is actually gated on.
- Unblocking `/proposals`/`/contracts` (or any other now-justified item) still requires its own separate change and its own `docs/prompts/NNN-<slug>.md`, per the change-as-prompt rule — this ADR records the decision, it does not itself build the folders.

## Confidence

High — this is the repository owner's own direct, explicit decision (2026-07-12: "solo entrepreneur building a consultancy/agency"), not an inferred or assumed default.
