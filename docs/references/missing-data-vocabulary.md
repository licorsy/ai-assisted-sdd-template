---
title: "Missing Data Vocabulary"
doc_type: product-doc
description: "Shared shorthand for absent, degraded, or untrustworthy data in any artifact a project renders for a human - adapted from the UK Government Analysis Function's published guidance. Covers the symbol set, why 'NA' is rejected as ambiguous, why the legend goes above the table rather than below it, and why a line chart never joins across a gap."
status: active
version: "1.0"
created: 2026-08-03
updated: 2026-08-03
language: en
id: missing-data-vocabulary
tags: [conventions, data-honesty, accessibility, reporting, reference]
owner: Alexandre Clemente
related: [operation-manual, role-operating-guide]
---

# Missing Data Vocabulary

Every project built on this operating model derives data from incomplete sources and has to render the gaps. This file is the vocabulary for doing that, so each surface stops inventing its own token.

The principle was already settled here before the vocabulary existed — `agents/orchestrator.md` refuses to estimate an untracked metric and writes `not tracked (…)` instead, `docs/references/gate-verification-template/` reports what it declines to guess at by name, and both review agents require explicit non-findings *so silence is never ambiguous*. Five sites, five different tokens. This file is what they can point at.

## Where this comes from

The UK Government Analysis Function's guidance on [symbols and shorthand in tables](https://analysisfunction.civilservice.gov.uk/policy-store/symbols-in-tables-definitions-and-help/) and on [charts](https://analysisfunction.civilservice.gov.uk/policy-store/data-visualisation-charts/), verified at source on 2026-08-03.

**Licence: `unverified`.** Neither page carried an explicit Open Government Licence or copyright statement when read. The content below is therefore paraphrased, with direct quotation limited to the two sentences that carry the reasoning. Confirm the licence before reproducing more of it.

## The symbols

| Symbol | Means |
| --- | --- |
| `[x]` | not available |
| `[z]` | not applicable |
| `[c]` | confidential — the value exists and is withheld |
| `[e]` | estimated |
| `[f]` | forecast |
| `[p]` | provisional |
| `[r]` | revised |
| `[u]` | low reliability |
| `[b]` | break in series — values before and after are not comparable |

These nine are the ones a software project routinely needs. The source list is longer — it also defines `[er]`, `[low]`, `[high]`, `[w]`, `[ns]`, `[s]`, `[ss]`, `[sss]`, most of them for statistical significance and survey reporting. Adopt from the full list when the situation genuinely calls for it; do not claim to implement a vocabulary wider than the artifact actually uses.

The distinction that earns the whole set its place is `[x]` versus `[z]`: **"we don't have this"** and **"this cannot exist here"** are different facts, and a reader who cannot tell them apart cannot tell a collection failure from a category boundary.

## Three rules

**Never `NA`.** The source is explicit: *"We do not recommend using 'NA' to describe cells with no data. This is because this shorthand is ambiguous."* It collapses "not available" and "not applicable" — the one distinction the symbol set exists to preserve — and readers resolve the ambiguity differently.

**The legend goes above the table, not below it.** Someone reading with assistive technology meets the explanation before the cells it explains, rather than after. The same ordering helps everyone else: a symbol encountered before its key is noise.

**Never join across a gap.** In a line chart: *"If you do use a line, do not join the points either side of the missing data point, even if the line is dotted or dashed."* The reason is that *"joining points implies we know something about the data"* — a dashed segment across a gap looks like interpolation the analysis never performed. Leave the gap open, or render the absent interval visibly empty.

## What this does not change

This governs what a project renders *for a human*. It is not a data-model or serialization convention, and it does not reach a value's internal representation — `null` stays `null` in the store.

It also does not retroactively apply. `docs/STATE.md` renders an absent frontmatter field as `—` with a legend, and that stays: the em dash is already unambiguous *because* it carries its key, and churning a generated file to satisfy a convention adopted afterwards buys nothing.

No mechanical check ships with this convention, which `docs/adr/0003-document-architecture.md` principle 5 otherwise expects. The reason is that the rule governs artifacts a generated project renders, not files in this repository — there is nothing here for a checker to scan.
