#!/usr/bin/env node

'use strict';

const fs = require('fs');
const path = require('path');

const { walk } = require('./doc-walk.js');

const MANUAL_PATH = 'docs/manuals/operation-manual.md';

const { CATEGORY_DIRS, ROOT_FILES } = require('./doc-scope.js');

// Living docs that may reference the operation manual's steps.
// docs/prompts/ is excluded: archived prompts reference steps as they
// were at the time and are historical records. .claude and .github are
// Claude Code/GitHub special dirs outside documentation-metadata-standard
// scope but still capable of citing a Step.
const SCAN_DIRS = [...CATEGORY_DIRS.filter((d) => d !== 'docs/prompts'), '.claude', '.github'];
// CHANGELOG.md excluded as historical narrative, same rationale as docs/prompts.
const SCAN_FILES = ['CLAUDE.md', 'AGENTS.md', 'README.md', ...ROOT_FILES.filter((f) => f !== 'CHANGELOG.md')];

const HEADING_RE = /^###? Step (\d+[a-z]?) /gm;
const REF_RE = /Steps? (\d+[a-z]?)(?:\s*(?:-|–|and)\s*(\d+[a-z]?))?/g;
const FILE_MENTION_RE = /[\w./-]+\.md/g;

function extractStepHeadings(manualContent) {
  const steps = new Set();
  let match;
  HEADING_RE.lastIndex = 0;
  while ((match = HEADING_RE.exec(manualContent)) !== null) {
    steps.add(match[1]);
  }
  return steps;
}

// A "Step N" token is anchored to the operation manual when the nearest
// preceding .md filename mention on the same line is the manual - or when
// there is no filename mention at all and the file being scanned IS the
// manual (a self-reference). Tokens anchored to other files (e.g. the
// orchestrator prompt's own Step 0) are not this checker's business.
function isAnchoredToManual(line, refIndex, isManualItself) {
  let nearest = null;
  let match;
  FILE_MENTION_RE.lastIndex = 0;
  while ((match = FILE_MENTION_RE.exec(line)) !== null) {
    if (match.index >= refIndex) break;
    nearest = match[0];
  }
  if (nearest === null) return isManualItself;
  return nearest.endsWith('operation-manual.md');
}

function checkContent(fileLabel, content, validSteps, isManualItself) {
  const errors = [];
  const lines = content.split(/\r?\n/);

  lines.forEach((line, lineIdx) => {
    let match;
    REF_RE.lastIndex = 0;
    while ((match = REF_RE.exec(line)) !== null) {
      if (!isAnchoredToManual(line, match.index, isManualItself)) continue;
      for (const step of [match[1], match[2]]) {
        if (step && !validSteps.has(step)) {
          errors.push(`${fileLabel}:${lineIdx + 1} references operation-manual Step ${step}, which does not exist`);
        }
      }
    }
  });

  return errors;
}

function listScanFiles(root) {
  const files = [];
  for (const dir of SCAN_DIRS) {
    for (const full of walk(path.join(root, dir))) {
      files.push(path.relative(root, full));
    }
  }
  for (const file of SCAN_FILES) {
    if (fs.existsSync(path.join(root, file))) files.push(file);
  }
  return files.sort();
}

function checkStepReferences(root) {
  const manualFile = path.join(root, MANUAL_PATH);
  if (!fs.existsSync(manualFile)) {
    return [`manual not found: ${MANUAL_PATH}`];
  }

  const validSteps = extractStepHeadings(fs.readFileSync(manualFile, 'utf8'));
  if (validSteps.size === 0) {
    return [`no "Step N" headings found in ${MANUAL_PATH} - heading format changed?`];
  }

  const errors = [];
  for (const file of listScanFiles(root)) {
    const content = fs.readFileSync(path.join(root, file), 'utf8');
    errors.push(...checkContent(file, content, validSteps, path.join(root, file) === manualFile));
  }
  return errors;
}

function main() {
  const errors = checkStepReferences(process.cwd());
  if (errors.length > 0) {
    for (const error of errors) console.error('  - ' + error);
    console.error('\nStep-reference check failed.');
    process.exitCode = 1;
    return;
  }
  console.log('All operation-manual step references resolve to existing steps.');
}

if (require.main === module) {
  main();
}

module.exports = {
  extractStepHeadings,
  isAnchoredToManual,
  checkContent,
  checkStepReferences,
  MANUAL_PATH,
};
