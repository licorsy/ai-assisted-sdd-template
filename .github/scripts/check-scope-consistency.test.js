'use strict';

const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const os = require('os');
const path = require('path');

const { checkScopeConsistency } = require('./check-scope-consistency.js');
const { PROCESS_DIRS } = require('./doc-scope.js');

function makeFixtureRepo({
  codeownersDirs = PROCESS_DIRS,
} = {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'scope-consistency-fixture-'));
  fs.mkdirSync(path.join(root, '.github/workflows'), { recursive: true });

  const codeowners = [
    '# Canonical process documents require review before merge.',
    ...codeownersDirs.map((d) => `/${d}/    @aleclemente`),
    '',
  ].join('\n');
  fs.writeFileSync(path.join(root, '.github/CODEOWNERS'), codeowners);

  return root;
}

test('matching CODEOWNERS passes', () => {
  const root = makeFixtureRepo();
  assert.deepStrictEqual(checkScopeConsistency(root), []);
});

test('a directory missing from CODEOWNERS fails with a clear diff', () => {
  const root = makeFixtureRepo({ codeownersDirs: PROCESS_DIRS.filter((d) => d !== 'docs/visuals') });
  const errors = checkScopeConsistency(root);
  assert.ok(errors.some((e) => e.includes('docs/visuals')));
});

test('comment and blank lines in CODEOWNERS are skipped, not treated as paths', () => {
  const root = makeFixtureRepo();
  fs.appendFileSync(path.join(root, '.github/CODEOWNERS'), '\n# a trailing comment\n\n');
  assert.deepStrictEqual(checkScopeConsistency(root), []);
});
