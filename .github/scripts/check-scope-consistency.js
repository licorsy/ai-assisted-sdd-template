#!/usr/bin/env node

'use strict';

const fs = require('fs');

const { PROCESS_DIRS } = require('./doc-scope.js');

const CODEOWNERS_FILE = '.github/CODEOWNERS';

function sameSet(a, b) {
  const setA = new Set(a);
  const setB = new Set(b);
  if (setA.size !== setB.size) return false;
  for (const item of setA) if (!setB.has(item)) return false;
  return true;
}

function diffSets(expected, actual) {
  const expectedSet = new Set(expected);
  const actualSet = new Set(actual);
  const missing = expected.filter((d) => !actualSet.has(d));
  const extra = actual.filter((d) => !expectedSet.has(d));
  return { missing, extra };
}

function checkCodeowners(root) {
  const errors = [];
  const full = root ? `${root}/${CODEOWNERS_FILE}` : CODEOWNERS_FILE;
  if (!fs.existsSync(full)) return [`missing file: ${CODEOWNERS_FILE}`];

  const lines = fs.readFileSync(full, 'utf8').split(/\r?\n/);
  const dirs = [];
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed === '' || trimmed.startsWith('#')) continue;
    const match = /^\/([^\s]+?)\/\s+\S/.exec(trimmed);
    if (match) dirs.push(match[1]);
  }

  if (!sameSet(dirs, PROCESS_DIRS)) {
    const { missing, extra } = diffSets(PROCESS_DIRS, dirs);
    errors.push(
      `${CODEOWNERS_FILE}: protected paths out of sync with doc-scope.js PROCESS_DIRS` +
        (missing.length ? ` - missing: ${missing.join(', ')}` : '') +
        (extra.length ? ` - unexpected: ${extra.join(', ')}` : '')
    );
  }

  return errors;
}

function checkScopeConsistency(root) {
  return [...checkCodeowners(root)];
}

function main() {
  const errors = checkScopeConsistency();

  if (errors.length > 0) {
    console.error('');
    for (const error of errors) console.error('  - ' + error);
    console.error('\n' + errors.length + ' scope mismatch(es) found.');
    process.exitCode = 1;
    return;
  }

  console.log('CODEOWNERS scope matches doc-scope.js.');
}

if (require.main === module) {
  main();
}

module.exports = {
  sameSet,
  diffSets,
  checkCodeowners,
  checkScopeConsistency,
};
