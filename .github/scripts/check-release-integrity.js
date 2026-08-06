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
//
// A second question, added later: when a release genuinely is live at
// `main`'s tip (the declared version's tag exists and matches), is
// CHANGELOG.md's `[Unreleased]` section actually empty? `docs/prompts/
// 011-release-integrity-check.md` declined this on purpose - out of scope
// when the check was first built. `docs/prompts/013-release-readiness-batch.md`
// then recorded the near-miss that reversed the decision: `010` cut `[1.2.0]`
// and left a fresh, empty `[Unreleased]` above it; `011` and `012` both wrote
// into that reopened section before `013` folded it back by hand. Had the
// promotion and tag landed in that window, this check would have reported
// clean - `main` genuinely matching a real tag - while the tagged release's
// own notes omitted two things the tagged commit actually shipped. See
// `docs/prompts/018-assert-unreleased-empty-at-tag.md`. The assertion fires
// only in the "tag matches main's tip" state: mid-cycle, `[Unreleased]`
// legitimately holds real content, and flagging it there would be noise, not
// signal.

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

// Returns the raw text between the `## [Unreleased]` heading and the next
// `## [...]` heading (or end of file), so a caller can decide emptiness by
// trimming the result. This repository's own convention for "nothing
// pending" is the heading with literally nothing below it - not even an
// empty `### Added` subheading, per the `[1.2.0]` cut's own history - so no
// stricter or looser definition is applied here.
function extractUnreleasedSection(text) {
  const lines = text.split(/\r?\n/);
  let start = -1;
  for (let i = 0; i < lines.length; i += 1) {
    const match = SECTION_HEADING.exec(lines[i].trim());
    if (match && match[1].toLowerCase() === 'unreleased') {
      start = i + 1;
      break;
    }
  }
  if (start === -1) return '';

  const collected = [];
  for (let i = start; i < lines.length; i += 1) {
    if (SECTION_HEADING.test(lines[i].trim())) break;
    collected.push(lines[i]);
  }
  return collected.join('\n');
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
  const changelogText = fs.readFileSync(changelog, 'utf8');
  const declared = parseDeclaredVersion(changelogText);
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
    } else if (mainSha && tagSha === mainSha) {
      const unreleased = extractUnreleasedSection(changelogText);
      if (unreleased.trim() !== '') {
        problems.push(
          `${RELEASE_BRANCH} is tagged '${tag}', but ${CHANGELOG_FILE}'s '[Unreleased]' section is ` +
            `not empty - the tagged release's own notes may not describe everything the tagged commit contains`
        );
      }
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
  extractUnreleasedSection,
  resolveRef,
  checkReleaseIntegrity,
};
