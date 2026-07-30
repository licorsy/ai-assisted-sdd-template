---
title: "Infra Templates - how to apply"
doc_type: product-doc
description: "Ready-to-apply GitHub hardening and deployment templates for projects generated from this template: main-branch ruleset, Conventional Commits check, release-please automation, and a staging-to-production CD skeleton with Docker starters and IaC guidance. This template repository does not apply these to itself."
status: active
version: "1.0"
created: 2026-07-13
updated: 2026-07-13
language: en
id: infra-templates
tags: [infrastructure, branch-protection, release-automation, deployment, iac, how-to]
owner: Alexandre Clemente
related: [operation-manual, roadmap, init]
diataxis: how-to
---

# Infra Templates - how to apply

Ready-to-apply infrastructure for a **project generated from this template** (this template repository itself deliberately stays on its lightweight docs CI). Every third-party action is pinned by full commit SHA with a version comment - keep that habit when you update them.

## Prerequisites

1. Open the terminal; 2. Run `gh auth status` - it must succeed (authenticated GitHub CLI); 3. Know your plan: branch **rulesets** need a public repository, or GitHub Pro/Team for private ones (a 403 on the ruleset call on a private free-tier repo means this, not a broken template).

## 1. Protect `main` (ruleset)

Why: no direct pushes, no force-pushes, PRs with green checks only.

1. Edit `main-ruleset.json`: replace `REPLACE_WITH_YOUR_CI_CHECK_NAME` with your CI job's check name (and raise `required_approving_review_count` to 1+ if the project has more than one person).
2. Check what exists first (idempotency - skip if a ruleset of the same name is already there):
   `gh api repos/{owner}/{repo}/rulesets --jq '.[].name'`
3. Apply: `gh api repos/{owner}/{repo}/rulesets --method POST --input main-ruleset.json`
4. Report back: the ruleset appears under Settings > Rules > Rulesets.

## 2. Conventional Commits check

Copy `conventional-commits.yml` to your project's `.github/workflows/`. Pair it with squash merges ("Default to PR title" enabled) so PR-title discipline becomes commit-history discipline.

## 3. Release automation (release-please)

Copy `release-please.yml` to `.github/workflows/`, and `release-please-config.json` + `.release-please-manifest.json` to the repository root. Set the manifest's version to your project's current version. release-please then maintains a release PR whose merge tags the release and updates `CHANGELOG.md`.

## 4. Deployment pipeline (`deploy/`)

Roadmap Phase 7's gate model, as a skeleton: merge to `main` auto-deploys to **staging**; **production** is a GitHub Environment with required reviewers, so promotion pauses for human approval. To apply:

1. Copy `deploy/deploy.yml` to `.github/workflows/` and replace every `REPLACE_ME` step with your real build/deploy/smoke-test commands.
2. Create the `staging` and `production` environments under Settings > Environments; add yourself as a required reviewer on `production`; attach environment secrets there (never in the repository).
3. `deploy/Dockerfile` and `deploy/compose.yaml` are containerization starters modeling pinned bases, non-root runtime, and env-var-only secrets - adapt to your stack.
4. A deploy is not "done" without a tested rollback path (Phase 7 acceptance criteria): record the previously deployed version in the pipeline and rehearse restoring it at least once before the first production deploy.

## 5. Infrastructure as Code (starter guidance)

Describe environments as versioned code from the first deploy - Terraform/OpenTofu, the compose file above, or your platform's native IaC (fly.toml, render.yaml, SAM/CDK, ...). Record the choice in an ADR (`docs/adr/`). Non-negotiables regardless of tool:

- **State backend**: remote and locked (e.g. a cloud bucket with locking) - never committed local state.
- **Pinning**: provider and module versions pinned, same as the SHA-pinned actions here.
- **Secrets**: injected from GitHub Environments or a secrets manager; never in IaC files, images, or compose files.
- **One command**: a fresh environment must be reproducible from the repo with one documented command; if it takes hand-steps, they belong in the IaC or this file's project-local copy.

## Prior art

Iuri Pereira's `projeto-infra` skill applies this same pattern imperatively (vetted 2026-07-13 in [tool-library-catalog.md](../../manuals/tool-library-catalog.md): candidate, security level unvetted - notably no LICENSE, so its code cannot be lawfully copied; these templates are original work informed by the same conventions).
