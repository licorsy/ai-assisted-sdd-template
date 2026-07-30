'use strict';

const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const os = require('os');
const path = require('path');

const { extractStepHeadings, checkContent, checkStepReferences } = require('./check-step-references.js');

const MANUAL = [
  '# Manual',
  '## Step 1 - Install',
  '## Step 2 - Choose',
  '## Step 10 - The universal rule',
  '### Step 15a - How to trigger',
  '## Step 16 - LLM selection',
  '### Step 16a - Delegation',
  '## Step 17 - Techniques',
].join('\n\n');

function makeFixtureRepo({ docLine }) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'step-ref-fixture-'));
  fs.mkdirSync(path.join(root, 'docs/manuals'), { recursive: true });
  fs.mkdirSync(path.join(root, 'agents'), { recursive: true });
  fs.writeFileSync(path.join(root, 'docs/manuals/operation-manual.md'), MANUAL);
  fs.writeFileSync(path.join(root, 'agents/sample.md'), `# Sample\n\n${docLine}\n`);
  return root;
}

test('extractStepHeadings collects plain and lettered steps', () => {
  const steps = extractStepHeadings(MANUAL);
  assert.deepStrictEqual([...steps].sort(), ['1', '10', '15a', '16', '16a', '17', '2'].sort());
});

test('valid manual-anchored references pass, including ranges and letters', () => {
  const root = makeFixtureRepo({
    docLine: 'See `docs/manuals/operation-manual.md`, Steps 16-17, and `operation-manual.md`, Step 15a.',
  });
  assert.deepStrictEqual(checkStepReferences(root), []);
});

test('a manual-anchored reference to a missing step fails with file and line', () => {
  const root = makeFixtureRepo({
    docLine: 'Per `docs/manuals/operation-manual.md`, Step 99, do the thing.',
  });
  const errors = checkStepReferences(root);
  assert.strictEqual(errors.length, 1);
  assert.match(errors[0], /agents[/\\]sample\.md:3 .*Step 99/);
});

test('references anchored to other files are skipped', () => {
  const root = makeFixtureRepo({
    docLine: 'Run Step 0 of `agents/orchestrator-prompt.md` first; its Step 4 also applies.',
  });
  assert.deepStrictEqual(checkStepReferences(root), []);
});

test('bare Step tokens outside the manual are skipped; inside the manual they are validated', () => {
  assert.deepStrictEqual(checkContent('other.md', 'Follow Step 42 here.', new Set(['1']), false), []);
  const errors = checkContent('manual.md', 'As Step 42 explains.', new Set(['1']), true);
  assert.strictEqual(errors.length, 1);
  assert.match(errors[0], /Step 42/);
});

test('self-references inside the manual anchored to another file are skipped', () => {
  const errors = checkContent(
    'manual.md',
    'See (`agents/orchestrator-prompt.md`, Step 0, choice 3) for selection.',
    new Set(['1']),
    true
  );
  assert.deepStrictEqual(errors, []);
});

test('range end is validated too', () => {
  const errors = checkContent(
    'doc.md',
    'Consult `docs/manuals/operation-manual.md`, Steps 16-99.',
    new Set(['16', '17']),
    false
  );
  assert.strictEqual(errors.length, 1);
  assert.match(errors[0], /Step 99/);
});
