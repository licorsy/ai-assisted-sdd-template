---
title: "Tools Ecosystem - unvetted starting shortlist"
doc_type: product-doc
description: "Curated per-category shortlist of tools a generated project will need to choose from - observability/error tracking, security scanning, secrets, CI/CD, diagramming, knowledge management - distilled from the Vibe Coding course's SDLC roadmap. 'Unvetted' means not yet run through tool-hunter's structured, per-need vetting checklist - not that this list is uncurated or arbitrary. It narrows the search; live vetting per need stays with tool-hunter Mode B and the project's build-vs-buy record."
status: active
version: "1.4"
created: 2026-07-14
updated: 2026-07-31
language: en
id: tools-ecosystem
tags: [tools, observability, security, secrets, ci-cd, shortlist]
owner: Alexandre Clemente
related: [token-economy, tool-library-catalog, prompt-engineering-guide, operation-manual]
diataxis: reference
---

# Tools Ecosystem - unvetted starting shortlist

> **This is a starting shortlist, not a vetted catalog.** Nothing here carries a freshness, rating, or validation claim. When a project actually needs a tool from one of these categories, run `agents/tool-discovery.md` in Mode B - in Claude Code, the `tool-hunter` subagent - and record the live-vetted decision in that project's `/docs/references/build-vs-buy.md`; see `docs/manuals/operation-manual.md`, Step 15. This document only narrows where to start looking.

Each category names the decision it feeds. Entries tagged **enterprise** are sized for large organizations - skip them at the solo/consultancy tier unless a client mandates one.

## Observability and error tracking

Feeds the P6 observability-baseline pattern's `[ERROR-TRACKING SERVICE]` ADR choice (`docs/manuals/prompt-engineering-guide.md`, Section 9).

- **Sentry** - error tracking with release/source-map awareness; the common default for web apps.
- **Prometheus + Grafana** - open-source metrics collection and dashboards; lightweight, cloud-native standard.
- **OpenTelemetry** - vendor-neutral standard for metrics/logs/traces; instrument once, choose backends later.
- **Cloud-native logging** (CloudWatch, Azure Monitor, Google Cloud Logging) - default when already on that cloud.
- **Jaeger / Zipkin** - distributed tracing; only relevant once there are multiple services.
- **Datadog** - full-stack APM/logs/metrics; powerful but costly at scale. **enterprise**
- **Splunk / ELK Stack** - heavy log aggregation platforms. **enterprise**

## Security scanning

Feeds the P4 security-audit remediation loop and the CI pipeline (roadmap Phase 6; `deploy.yml` template).

- **Dependency scanning**: GitHub Dependabot (native, free), Snyk (fix-PR automation; free tier limited).
- **SAST**: GitHub CodeQL (native), Semgrep (fast, rule-based), SonarQube (quality + security combined).
- **DAST**: OWASP ZAP - open-source web/API scanner, CI-friendly.
- **Checkmarx / Veracode** - commercial SAST suites. **enterprise**

## Secrets and configuration

Feeds Phase 7 pipeline setup ("no secrets baked into layers", `Dockerfile` template).

- **GitHub Actions secrets / environment secrets** - the default for this template's pipeline model.
- **Cloud-native managers** (AWS Secrets Manager, Azure Key Vault, GCP Secret Manager) - when the app runs on that cloud.
- **HashiCorp Vault** - dynamic secrets, rotation, audit trails; operational overhead. **enterprise**

## CI/CD and code quality

Feeds roadmap Phase 7 and the templates in `docs/references/infra-templates/`.

- **GitHub Actions** - the template's default; native, YAML, SHA-pinnable (see the existing templates).
- **Jenkins** - self-hosted legacy standard; only when a client already runs it. **enterprise**

## Diagramming

Feeds Step 15's diagramming row and Phase 3 architecture artifacts.

- **Mermaid** - text-based, versioned, rendered natively by GitHub; this template's preferred format (Step 15).
- **Excalidraw / draw.io** - freeform visual drawing when text-based diagrams don't fit; export SVG/PNG into `/docs`.

## Knowledge management

The template itself covers project memory (living docs, `.specify/`, `STATE.md`); these are for material outside the repo.

- **Obsidian** - local-first Markdown vault; good privacy fit for consultancy notes.
- **Notion** - cloud collaboration; better for sharing with clients, can sprawl.
- **Jira / Confluence** - agile management suite; GitHub Issues/Projects already cover this template's needs (Step 15). **enterprise**
- **AI-generated codebase wikis** (DeepWiki and similar "Code Wiki" tools) - always-regenerated documentation derived from the code itself; a future-reference idea for the agent era, unvetted. Complements rather than replaces this template's living docs: generated wikis describe what the code *is*, the living documents record what was *decided* and why.

## AI-workflow tooling

Decisions for this repository's own token economy and retrieval tooling (Graphify adopt, local RAG defer, and related) already live in [token-economy.md](token-economy.md) - that document owns this category.
