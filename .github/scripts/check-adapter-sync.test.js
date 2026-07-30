'use strict';

const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const os = require('os');
const path = require('path');

const { checkAdapterSync, extractBlocks } = require('./check-adapter-sync.js');

const RULE = 'Shared rule text that must stay identical.';

function block(key, body) {
  return `<!-- sync:${key} source=docs/manuals/operation-manual.md anchor="## Step 10" -->\n${body}\n<!-- /sync:${key} -->`;
}

function makeFixtureRepo({ claudeBody = RULE, agentsBody = RULE, keysB = ['always-on-rule'], anchorPresent = true } = {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'adapter-sync-fixture-'));
  fs.mkdirSync(path.join(root, 'docs/manuals'), { recursive: true });
  fs.writeFileSync(
    path.join(root, 'docs/manuals/operation-manual.md'),
    anchorPresent ? '# Manual\n\n## Step 10 - The rule\n\nCanonical prose.\n' : '# Manual\n\n## Step 99\n'
  );
  fs.writeFileSync(path.join(root, 'CLAUDE.md'), `# CLAUDE.md\n\n${block('always-on-rule', claudeBody)}\n\nUnshared Claude-only text.\n`);
  fs.writeFileSync(path.join(root, 'AGENTS.md'), `# AGENTS.md\n\n${keysB.map((k) => block(k, agentsBody)).join('\n\n')}\n\nUnshared AGENTS-only text.\n`);
  return root;
}

test('identical marked blocks with a live anchor pass', () => {
  const root = makeFixtureRepo();
  assert.deepStrictEqual(checkAdapterSync(root), []);
});

test('whitespace-only differences are tolerated', () => {
  const root = makeFixtureRepo({ agentsBody: '  Shared rule text   that must stay identical.  ' });
  assert.deepStrictEqual(checkAdapterSync(root), []);
});

test('diverged wording fails', () => {
  const root = makeFixtureRepo({ agentsBody: 'Shared rule text that quietly drifted.' });
  const errors = checkAdapterSync(root);
  assert.ok(errors.some((e) => e.includes('diverged')));
});

test('differing key sets fail', () => {
  const root = makeFixtureRepo({ keysB: ['always-on-rule', 'extra-rule'] });
  const errors = checkAdapterSync(root);
  assert.ok(errors.some((e) => e.includes('keys differ')));
});

test('vanished canonical anchor fails', () => {
  const root = makeFixtureRepo({ anchorPresent: false });
  const errors = checkAdapterSync(root);
  assert.ok(errors.some((e) => e.includes('no longer occurs')));
});

test('unclosed block is reported', () => {
  const { errors } = extractBlocks('<!-- sync:x source=a.md anchor="## H" -->\nnever closed', 'F');
  assert.ok(errors.some((e) => e.includes('never closed')));
});
