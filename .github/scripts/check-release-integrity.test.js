'use strict';

const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

const { parseDeclaredVersion, extractUnreleasedSection, checkReleaseIntegrity } = require('./check-release-integrity.js');

function git(root, args) {
  execFileSync('git', args, { cwd: root, stdio: 'ignore' });
}

// Real repositories rather than a stubbed git: the peeling behaviour these
// tests exist to protect lives in `git rev-parse ...^{}`, so a fake resolver
// would assert the fixture's own logic and prove nothing about the check.
function makeFixtureRepo({ changelog, tag = null, annotated = false, commitsAfterTag = 0 } = {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'release-integrity-fixture-'));

  git(root, ['init', '-q', '-b', 'main']);
  git(root, ['config', 'user.email', 'test@example.com']);
  git(root, ['config', 'user.name', 'Test']);
  git(root, ['config', 'commit.gpgsign', 'false']);

  if (changelog !== undefined) {
    fs.writeFileSync(path.join(root, 'CHANGELOG.md'), changelog);
  }
  git(root, ['add', '-A']);
  git(root, ['commit', '-q', '--allow-empty', '-m', 'initial']);

  if (tag) {
    git(root, annotated ? ['tag', '-a', tag, '-m', `release ${tag}`] : ['tag', tag]);
  }
  for (let i = 0; i < commitsAfterTag; i += 1) {
    git(root, ['commit', '-q', '--allow-empty', '-m', `later ${i}`]);
  }

  return root;
}

function changelogDeclaring(version, date = '2026-08-03') {
  return ['# Changelog', '', '## [Unreleased]', '', `## [${version}] - ${date}`, '', '### Changed', '', '- a thing', ''].join('\n');
}

test('main carrying the declared version passes', () => {
  const root = makeFixtureRepo({ changelog: changelogDeclaring('1.2.0'), tag: 'v1.2.0' });
  assert.deepStrictEqual(checkReleaseIntegrity(root), []);
});

test('an annotated tag passes - the comparison peels to the commit', () => {
  const root = makeFixtureRepo({ changelog: changelogDeclaring('1.2.0'), tag: 'v1.2.0', annotated: true });
  assert.deepStrictEqual(checkReleaseIntegrity(root), []);
});

test('a declared version with no tag fails, naming the missing tag', () => {
  const root = makeFixtureRepo({ changelog: changelogDeclaring('1.2.0') });
  const problems = checkReleaseIntegrity(root);
  assert.strictEqual(problems.length, 1);
  assert.match(problems[0], /tag 'v1\.2\.0' does not exist/);
});

test('main moving past the tag fails, reporting both shas', () => {
  const root = makeFixtureRepo({ changelog: changelogDeclaring('1.2.0'), tag: 'v1.2.0', commitsAfterTag: 3 });
  const problems = checkReleaseIntegrity(root);
  assert.strictEqual(problems.length, 1);
  assert.match(problems[0], /tag 'v1\.2\.0' points at [0-9a-f]{7}, main is at [0-9a-f]{7}/);
});

test('a changelog with only [Unreleased] fails legibly, not with a stack trace', () => {
  const root = makeFixtureRepo({ changelog: ['# Changelog', '', '## [Unreleased]', ''].join('\n') });
  const problems = checkReleaseIntegrity(root);
  assert.strictEqual(problems.length, 1);
  assert.match(problems[0], /declares no released version/);
});

test('an undated release heading is reported as malformed, not silently skipped', () => {
  const changelog = ['# Changelog', '', '## [Unreleased]', '', '## [1.2.0]', ''].join('\n');
  const root = makeFixtureRepo({ changelog });
  const problems = checkReleaseIntegrity(root);
  assert.strictEqual(problems.length, 1);
  assert.match(problems[0], /not a dated release section/);
});

test('a missing CHANGELOG.md is reported on its own, without git comparisons', () => {
  const root = makeFixtureRepo({});
  assert.deepStrictEqual(checkReleaseIntegrity(root), ['missing file: CHANGELOG.md']);
});

test('parseDeclaredVersion skips [Unreleased] and takes the topmost dated section', () => {
  const text = changelogDeclaring('1.2.0') + '\n## [1.1.0] - 2026-07-20\n';
  assert.deepStrictEqual(parseDeclaredVersion(text), { version: '1.2.0' });
});

test('parseDeclaredVersion returns null when nothing is released', () => {
  assert.strictEqual(parseDeclaredVersion('# Changelog\n\n## [Unreleased]\n'), null);
});

test('extractUnreleasedSection returns empty for the established empty-Unreleased shape', () => {
  assert.strictEqual(extractUnreleasedSection(changelogDeclaring('1.2.0')).trim(), '');
});

test('extractUnreleasedSection returns the content sitting under the heading', () => {
  const text = ['# Changelog', '', '## [Unreleased]', '', '### Added', '', '- a pending change', '', '## [1.2.0] - 2026-08-03', ''].join('\n');
  assert.match(extractUnreleasedSection(text), /a pending change/);
});

test('extractUnreleasedSection returns empty when the file declares no release at all', () => {
  assert.strictEqual(extractUnreleasedSection('# Changelog\n\n## [Unreleased]\n').trim(), '');
});

function changelogWithOpenUnreleased(version, date = '2026-08-03') {
  return [
    '# Changelog',
    '',
    '## [Unreleased]',
    '',
    '### Added',
    '',
    '- work that landed after the release section was supposed to be final',
    '',
    `## [${version}] - ${date}`,
    '',
    '### Changed',
    '',
    '- a thing',
    '',
  ].join('\n');
}

test('a tag matching main but a non-empty [Unreleased] fails, naming the gap', () => {
  const root = makeFixtureRepo({ changelog: changelogWithOpenUnreleased('1.2.0'), tag: 'v1.2.0' });
  const problems = checkReleaseIntegrity(root);
  assert.strictEqual(problems.length, 1);
  assert.match(problems[0], /\[Unreleased\]/);
  assert.match(problems[0], /not empty/);
});

test('a non-empty [Unreleased] is not flagged when main has moved past the tag - the existing drift problem is the only one reported', () => {
  const root = makeFixtureRepo({ changelog: changelogWithOpenUnreleased('1.2.0'), tag: 'v1.2.0', commitsAfterTag: 2 });
  const problems = checkReleaseIntegrity(root);
  assert.strictEqual(problems.length, 1);
  assert.match(problems[0], /tag 'v1\.2\.0' points at [0-9a-f]{7}, main is at [0-9a-f]{7}/);
});

test('a non-empty [Unreleased] is not flagged when the declared version has no tag yet', () => {
  const root = makeFixtureRepo({ changelog: changelogWithOpenUnreleased('1.2.0') });
  const problems = checkReleaseIntegrity(root);
  assert.strictEqual(problems.length, 1);
  assert.match(problems[0], /tag 'v1\.2\.0' does not exist/);
});
