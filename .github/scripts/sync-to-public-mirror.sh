#!/usr/bin/env bash
set -euo pipefail

# Syncs the current tracked tree to the public mirror, licorsy/ai-assisted-sdd-template
# (docs/adr/0010-public-release.md). On-demand only - invoke by hand when something
# is release-ready, never from CI or a git hook.
#
# Excludes docs/prompts/ and docs/reports/008-relatorio-melhorias-v6.md: both carry
# extensive business-tech-agency/personal-os detail and are frozen historical record
# (documentation-metadata-standard.md Section 4.1, ADR-0003) that must never be
# rewritten to redact it - excluding them from the export is the resolution, not
# editing them (prompt-108, Task 3).
#
# Usage: .github/scripts/sync-to-public-mirror.sh [--dry-run]

MIRROR_REPO="licorsy/ai-assisted-sdd-template"
MIRROR_URL="https://github.com/${MIRROR_REPO}.git"
EXCLUDE_PATHS=(
  "docs/prompts"
  "docs/reports/008-relatorio-melhorias-v6.md"
)

ROOT="$(git rev-parse --show-toplevel)"
cd "$ROOT"

echo "==> Running the sanitization gate..."
node .github/scripts/check-public-sanitization.js || {
  echo "Gate reported findings - review them (see prompt-108's own adjudication record for what's already known-incidental) before continuing." >&2
  exit 1
}

DRY_RUN=false
if [[ "${1:-}" == "--dry-run" ]]; then
  DRY_RUN=true
fi

SCRATCH="$(mktemp -d)"
trap 'rm -rf "$SCRATCH"' EXIT

echo "==> Exporting tracked tree to ${SCRATCH} (excluding: ${EXCLUDE_PATHS[*]})..."
git ls-files | while IFS= read -r f; do
  skip=false
  for ex in "${EXCLUDE_PATHS[@]}"; do
    if [[ "$f" == "$ex" || "$f" == "$ex"/* ]]; then
      skip=true
      break
    fi
  done
  if [[ "$skip" == false ]]; then
    mkdir -p "$SCRATCH/$(dirname "$f")"
    cp "$f" "$SCRATCH/$f"
  fi
done

echo "==> Rewriting README.md CI badge URLs to point at the mirror's own Actions runs..."
if [[ -f "$SCRATCH/README.md" ]]; then
  sed -i "s#github.com/aleclemente/ai-assisted-sdd-template#github.com/${MIRROR_REPO}#g" "$SCRATCH/README.md"
fi

if [[ "$DRY_RUN" == true ]]; then
  echo "==> Dry run: exported tree left at ${SCRATCH} for inspection (not pushed)."
  trap - EXIT
  exit 0
fi

echo "==> Committing a fresh snapshot..."
(
  cd "$SCRATCH"
  git init -q
  git add -A
  git commit -q -m "Sync from aleclemente/ai-assisted-sdd-template ($(date -u +%Y-%m-%dT%H:%M:%SZ))"
  git branch -M main
  git remote add origin "$MIRROR_URL"
  echo "==> Pushing to ${MIRROR_REPO} (force - the mirror has no history of its own to preserve between syncs)..."
  git push --force origin main
)

echo "==> Done. ${MIRROR_REPO} updated."
