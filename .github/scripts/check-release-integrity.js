#!/usr/bin/env node

'use strict';

// Answers one question: does `main` carry the version CHANGELOG.md declares?
//
// This repository has no floating major tag and is consumed by creating a
// repository from the template, not by resolving a tag - so the only failure
// mode that applies here is the first one: main moved, nobody tagged. It has
// happened twice. `v1.0.0` and `v1.1.0` were both cut while CHANGELOG.md held
// only an `[Unreleased]` heading, and main then sat 30 commits past `v1.1.0`
// with nothing objecting, because nothing mechanical was watching.
//
// The version comes from CHANGELOG.md because there is nowhere else to read it
// from: this repository has no package.json and no .claude-plugin/plugin.json.
// The topmost dated `## [X.Y.Z] - YYYY-MM-DD` heading is the declared version.
//
// Every comparison peels with `^{}`. That is not defensive habit - this
// repository's own two tags disagree in kind (`v1.0.0` is annotated, `v1.1.0`
// is lightweight), so an unpeeled comparison reads the annotated tag's own
// object sha and reports drift that is not there.

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const CHANGELOG_FILE = 'CHANGELOG.md';
const RELEASE_BRANCH = 'main';

const SECTION_HEADING = /^##\s+\[([^\]]+)\]\s*(.*)$/;
const SEMVER = /^\d+\.\d+\.\d+$/;
const DATE_SUFFIX = /^-\s+\d{4}-\d{2}-\d{2}$/;

// Returns { version } for a well-formed dated section, { malformed } for a
// release heading that is not one, or null when the file declares no release
// at all. `[Unreleased]` is skipped rather than reported: it carries no date by
// design, and a fresh template instance legitimately has nothing below it.
function parseDeclaredVersion(text) {
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    const match = SECTION_HEADING.exec(line);
    if (!match) continue;

    const [, label, rest] = match;
    if (label.toLowerCase() === 'unreleased') continue;

    if (SEMVER.test(label) && DATE_SUFFIX.test(rest.trim())) {
      return { version: label };
    }
    return { malformed: line };
  }
  return null;
}

// `--verify --quiet` exits non-zero without printing when the ref is absent, so
// a missing tag comes back as null rather than as noise on stderr.
function resolveRef(root, ref) {
  try {
    const out = execFileSync('git', ['rev-parse', '--verify', '--quiet', `${ref}^{}`], {
      cwd: root,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    });
    return out.trim() || null;
  } catch {
    return null;
  }
}

function checkReleaseIntegrity(root = '.') {
  const changelog = path.join(root, CHANGELOG_FILE);
  if (!fs.existsSync(changelog)) return [`missing file: ${CHANGELOG_FILE}`];

  const problems = [];
  const declared = parseDeclaredVersion(fs.readFileSync(changelog, 'utf8'));
  const mainSha = resolveRef(root, RELEASE_BRANCH);

  if (!mainSha) {
    problems.push(
      `branch '${RELEASE_BRANCH}' not found - nothing to compare the declared version against`
    );
  }

  if (declared === null) {
    problems.push(
      `${CHANGELOG_FILE} declares no released version: no dated ` +
        "'## [X.Y.Z] - YYYY-MM-DD' heading below '## [Unreleased]'"
    );
  } else if (declared.malformed) {
    problems.push(
      `${CHANGELOG_FILE}: the first release heading is not a dated release section: ` +
        `'${declared.malformed}'`
    );
  } else {
    const tag = `v${declared.version}`;
    const tagSha = resolveRef(root, tag);
    if (!tagSha) {
      problems.push(
        `${CHANGELOG_FILE} declares ${declared.version} but tag '${tag}' does not exist - ` +
          `${RELEASE_BRANCH} was merged without cutting the release`
      );
    } else if (mainSha && tagSha !== mainSha) {
      problems.push(
        `tag '${tag}' points at ${tagSha.slice(0, 7)}, ` +
          `${RELEASE_BRANCH} is at ${mainSha.slice(0, 7)}`
      );
    }
  }

  return problems;
}

function main() {
  const problems = checkReleaseIntegrity();

  if (problems.length > 0) {
    console.error('');
    for (const problem of problems) console.error('  - ' + problem);
    console.error('\n' + problems.length + ' release-integrity problem(s) found.');

    // This job is scheduled, so nobody is watching the run. The summary is what
    // makes the failure legible from the run list without opening the log.
    if (process.env.GITHUB_STEP_SUMMARY) {
      const summary = ['### Release integrity failed', '']
        .concat(problems.map((p) => `- ${p}`))
        .concat(['', `Compared against \`${RELEASE_BRANCH}\`.`, ''])
        .join('\n');
      fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, summary);
    }

    process.exitCode = 1;
    return;
  }

  console.log(`Release integrity OK: ${RELEASE_BRANCH} carries the version ${CHANGELOG_FILE} declares.`);
}

if (require.main === module) {
  main();
}

module.exports = {
  parseDeclaredVersion,
  resolveRef,
  checkReleaseIntegrity,
};
