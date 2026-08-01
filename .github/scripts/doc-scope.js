#!/usr/bin/env node

'use strict';

// Canonical enumeration of this repository's own living-document category
// directories, per documentation-metadata-standard.md Section 1. ROOT_FILES
// is a narrower, consumer-driven subset of Section 1's root entry points;
// README.md is a root entry point too and is added back explicitly by the one
// consumer that needs it (see check-step-references.js).
// Every governance script derives its own scope from these constants instead
// of maintaining an independent copy (ADR-0003 principle 4). A script that
// legitimately needs a different scope excludes or adds explicitly, with a
// comment, rather than retyping the list from scratch.

const CATEGORY_DIRS = ['agents', 'docs/manuals', 'docs/adr', 'docs/strategy', 'docs/visuals', 'docs/prompts', 'docs/references', 'docs/reports'];
const ROOT_FILES = ['CHANGELOG.md', 'QUICKSTART.md', 'CONTRIBUTING.md', 'SECURITY.md', 'CODE_OF_CONDUCT.md'];

// The subset of CATEGORY_DIRS that .github/CODEOWNERS requires review for -
// the actively-governing process directories, not the archive/reference tier
// (docs/prompts, docs/references, docs/reports).
const PROCESS_DIRS = ['agents', 'docs/adr', 'docs/manuals', 'docs/strategy', 'docs/visuals'];

// Root files that carry the frontmatter schema
// (documentation-metadata-standard.md Section 1). Under the org-wide rule
// that every tracked Markdown file is enumerable, only two root files are
// exempt: README.md, because GitHub renders frontmatter as a visible table on
// the repository landing page, and CHANGELOG.md, because Keep a Changelog is
// an external format standard that owns the file's structure. So this is
// ROOT_FILES minus CHANGELOG.md, plus the two agent adapters.
//
// Lives here, not in a validation script, so .docgov.config.js can require it
// directly instead of duplicating it - duplicating this exact list is the
// defect check-scope-consistency.js used to exist to catch.
const SCOPE_FILES = [
  'QUICKSTART.md',
  'CONTRIBUTING.md',
  'SECURITY.md',
  'CODE_OF_CONDUCT.md',
  'CLAUDE.md',
  'AGENTS.md',
];

module.exports = { CATEGORY_DIRS, ROOT_FILES, PROCESS_DIRS, SCOPE_FILES };
