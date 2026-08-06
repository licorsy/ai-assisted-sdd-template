---
title: "Go-to-Market Roadmap"
doc_type: instruction
description: "Optional, parallel roadmap for a product's commercial lifecycle - positioning, pricing, launch readiness, marketing, sales, retention, business retrospective - alongside, not merged into, roadmap.md's engineering lifecycle. Different actors, different cadence, and not every increment needs it."
status: active
version: "1.1"
created: 2026-07-19
updated: 2026-08-06
language: en
id: go-to-market
tags: [go-to-market, positioning, pricing, launch, marketing, sales, retention, business-roadmap]
owner: Alexandre Clemente
related: [roadmap, operation-manual, role-operating-guide]
---

# Go-to-Market Roadmap

Changelog of this document:

- v1.0: Initial version - seven-phase parallel commercial roadmap (Positioning, Pricing & Packaging, Launch Readiness, Marketing, Sales, Customer Success & Retention, Business Retrospective), explicitly optional and not merged into the engineering roadmap - finding from a project generated from this template (prompt-061).

---

## 1. Purpose and scope

`docs/strategy/roadmap.md` covers the engineering lifecycle of a product well - Foundation through Maintenance - but has no counterpart for the commercial lifecycle of a product that actually goes to market: launch, marketing, sales, retention. This document is that counterpart.

**This roadmap is optional and parallel, not an extension of the engineering roadmap.** Three reasons it stays separate rather than folding into `docs/strategy/roadmap.md`:

- **Different actors.** The engineering roadmap is run by engineering/product roles (see `docs/manuals/role-operating-guide.md`); this one is run by commercial roles (marketing, sales, customer success), which may not exist yet in a solo or early-stage operation.
- **Different cadence.** This roadmap does not run once per code increment. A product can ship several engineering increments between commercial phases, or run a commercial phase (a pricing change, a retention push) with no corresponding code increment at all.
- **Not every increment needs it.** Internal tooling, infrastructure work, and increments with no external customer never go through "sales" or "marketing." Treat this roadmap as invoked when a product (or a significant increment of one) is actually going to market, not as a mandatory gate.

This roadmap **references, and does not duplicate**, `docs/strategy/roadmap.md` Phase 1 Activities 9-14 (market/competitor research, gap comparison, tooling/prior-art research, initial value proposition, open questions, direction validation) - Phase 1 - Positioning below builds on that output rather than re-doing it.

## 2. When to invoke this roadmap

Invoke it when a product or a significant increment is heading toward real users who will pay, churn, or need support - not for internal tools, spikes, or engineering-only increments. The starting phase depends on what already exists: a brand-new product starts at Phase 1 - Positioning; a product with existing positioning that's changing pricing starts at Phase 2; a product ready to ship but not yet launched starts at Phase 3.

## 3. Phases

### Phase 1 - Positioning

- **Goal**: Define who the product is for, what problem it solves, and why it wins against alternatives - building on, not duplicating, `docs/strategy/roadmap.md` Phase 1 Activities 9-14.
- **Inputs**: Phase 1 Activity 12's initial value proposition; market/competitor research and gap comparison from Activities 9-10.
- **Activities**: Sharpen the value proposition into a positioning statement (for whom, what category, what alternative, what differentiator); identify the target customer segment(s); record open positioning questions.
- **Generated artifacts**: `docs/business/positioning.md` (or the project's equivalent business-docs location).
- **Acceptance criteria / Done**: A positioning statement exists that a stranger could repeat back accurately; the target segment is named, not implied.

### Phase 2 - Pricing & Packaging

- **Goal**: Decide how the product is priced and packaged.
- **Inputs**: Positioning from Phase 1; cost structure and margin targets (if known).
- **Activities**: Choose a pricing model (subscription, usage-based, one-time, tiered); define package/tier boundaries; record the reasoning as an ADR if the decision is hard to reverse.
- **Generated artifacts**: `docs/business/pricing.md`; an ADR if the pricing model is a significant, hard-to-reverse commitment.
- **Acceptance criteria / Done**: Pricing and packaging are recorded, not just discussed; the reasoning is traceable.

### Phase 3 - Launch Readiness

- **Goal**: Confirm the product, support, documentation, and compliance posture are ready for real users before launch.
- **Inputs**: The engineering roadmap's Phase 6/7 (Testing, Deployment) output; positioning and pricing from Phases 1-2.
- **Activities**: Verify user-facing documentation exists; confirm a support channel/process exists; check compliance/legal requirements relevant to the target market; define launch success criteria.
- **Generated artifacts**: A launch checklist recording each of the above as done or explicitly deferred with a reason.
- **Acceptance criteria / Done**: Every launch-readiness item is checked or has a recorded, deliberate exception - not silently skipped.

### Phase 4 - Marketing

- **Goal**: Generate demand and awareness for the launch or the increment going to market.
- **Inputs**: Positioning, launch readiness confirmation.
- **Activities**: Define the launch marketing motion (content, channels, timing); prepare launch materials; define what "awareness" will be measured by.
- **Generated artifacts**: A marketing plan or launch brief, scoped to what the operation can actually execute (a solo operator's marketing plan looks different from a team's - see `docs/manuals/role-operating-guide.md` for the solo-adaptation pattern this roadmap follows).
- **Acceptance criteria / Done**: The marketing motion is recorded and its measurement defined before launch, not improvised after.

### Phase 5 - Sales

- **Goal**: Convert demand into revenue, if the product has a sales motion at all (self-serve products may skip most of this phase's activities).
- **Inputs**: Marketing output; pricing/packaging from Phase 2.
- **Activities**: Define the sales motion (self-serve, sales-assisted, enterprise); define the pipeline stages; record conversion assumptions.
- **Generated artifacts**: A pipeline definition (even a simple one) recording stages and conversion assumptions.
- **Acceptance criteria / Done**: The sales motion is named explicitly, including "none - fully self-serve" as a valid, recorded choice.

### Phase 6 - Customer Success & Retention

- **Goal**: Keep customers, and learn why they leave when they do.
- **Inputs**: Live usage and support signals (the same production signals `docs/strategy/roadmap.md` Phase 8 already names as a replanning input).
- **Activities**: Define onboarding; define what triggers a retention intervention; record churn reasons when they occur, not just churn counts.
- **Generated artifacts**: A retention/churn log, referenced by Phase 7 - Business Retrospective below.
- **Acceptance criteria / Done**: Churn has a recorded reason, not just a number, often enough to be useful for the next Business Retrospective.

### Phase 7 - Business Retrospective

- **Goal**: Close the commercial cycle the same way the engineering roadmap's Phase 8 closes an engineering cycle - with a recorded look back, not just forward momentum.
- **Inputs**: Commercial metrics accumulated since the last retrospective - CAC, conversion rate, churn, revenue - and the retention/churn log from Phase 6.
- **Activities**: Record what worked and what didn't, commercially; decide whether pricing, positioning, or the marketing/sales motion needs to change before the next cycle; name the next commercial priority.
- **Generated artifacts**: A business retrospective note, mirroring the engineering roadmap's per-increment technical retrospective (`docs/strategy/roadmap.md` Phase 8, Activity 4) but scoped to commercial metrics.
- **Acceptance criteria / Done**: At least one recorded decision to keep, change, or retire a commercial practice - the same "no change is still a decision" discipline `docs/strategy/roadmap.md` Phase 8 already applies to the engineering process.

## 4. Relationship to the engineering roadmap

| | Engineering roadmap | This roadmap |
| --- | --- | --- |
| Cadence | Per increment | Per launch or significant go-to-market event |
| Actors | Engineering/product roles | Commercial roles (marketing, sales, customer success) |
| Gate | Every increment passes through it | Invoked only when the increment is customer-facing |
| Closing ritual | Phase 8 - Maintenance | Phase 7 - Business Retrospective |

Neither roadmap owns the other. A project may run several engineering cycles between invocations of this roadmap, or invoke this roadmap's Phase 6/7 (retention, business retrospective) on a cadence independent of any single code increment.
