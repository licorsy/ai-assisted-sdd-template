'use strict';

const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const os = require('os');
const path = require('path');

const { stripFrontmatter, listAdapterFiles, checkFile, checkAdapterRules } = require('./check-adapter-rules.js');

function makeFixtureRepo(files) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'adapter-rules-fixture-'));
  fs.mkdirSync(path.join(root, '.claude/agents'), { recursive: true });
  for (const [name, content] of Object.entries(files)) {
    fs.writeFileSync(path.join(root, '.claude/agents', name), content);
  }
  return root;
}

test('stripFrontmatter removes a leading YAML block', () => {
  const content = '---\nname: x\n---\n\nBody text here.';
  assert.strictEqual(stripFrontmatter(content).trim(), 'Body text here.');
});

test('stripFrontmatter leaves content without frontmatter untouched', () => {
  const content = 'Just body text, no frontmatter.';
  assert.strictEqual(stripFrontmatter(content), content);
});

test('a rule sentence anchored with a backtick reference to its canonical file passes', () => {
  const root = makeFixtureRepo({
    'example-reviewer.md': [
      '---',
      'name: example-reviewer',
      '---',
      '',
      'Follow `agents/example.md` exactly, in full, as your operating instructions. Read that file first.',
      '',
      'If the target was not specified in the task you were given, follow `agents/example.md`\'s Operating rules (ask before proceeding rather than guessing).',
    ].join('\n'),
  });
  const errors = checkFile(root, '.claude/agents/example-reviewer.md');
  assert.deepStrictEqual(errors, []);
});

test('a rule sentence with no canonical anchor fails and names the file and line', () => {
  const root = makeFixtureRepo({
    'example-reviewer.md': [
      '---',
      'name: example-reviewer',
      '---',
      '',
      'Follow `agents/example.md` exactly, in full, as your operating instructions. Read that file first.',
      '',
      'If the target was not specified in the task you were given, ask which target before proceeding.',
    ].join('\n'),
  });
  const errors = checkFile(root, '.claude/agents/example-reviewer.md');
  assert.strictEqual(errors.length, 1);
  assert.match(errors[0], /example-reviewer\.md:7/);
  assert.match(errors[0], /agents\/example\.md/);
});

test('a "do not ... unless" rule with no canonical anchor is also caught', () => {
  const root = makeFixtureRepo({
    'example-reviewer.md': [
      '---',
      'name: example-reviewer',
      '---',
      '',
      'Follow `agents/example.md` exactly, in full, as your operating instructions. Read that file first.',
      '',
      'Do not re-check an entry already reviewed this week unless explicitly asked to.',
    ].join('\n'),
  });
  const errors = checkFile(root, '.claude/agents/example-reviewer.md');
  assert.strictEqual(errors.length, 1);
  assert.match(errors[0], /Do not re-check/);
});

test('a file with no rule-shaped sentences passes trivially', () => {
  const root = makeFixtureRepo({
    'example-reviewer.md': [
      '---',
      'name: example-reviewer',
      '---',
      '',
      'Follow `agents/example.md` exactly, in full, as your operating instructions. Read that file first.',
      '',
      'Report findings to the human when done.',
    ].join('\n'),
  });
  const errors = checkFile(root, '.claude/agents/example-reviewer.md');
  assert.deepStrictEqual(errors, []);
});

test('a file missing the "Follow ... exactly" opening line fails with a clear reason', () => {
  const root = makeFixtureRepo({
    'example-reviewer.md': ['---', 'name: example-reviewer', '---', '', 'Some body with no canonical pointer.'].join('\n'),
  });
  const errors = checkFile(root, '.claude/agents/example-reviewer.md');
  assert.strictEqual(errors.length, 1);
  assert.match(errors[0], /no "Follow/);
});

test('listAdapterFiles finds .md files under .claude/agents and .claude/commands', () => {
  const root = makeFixtureRepo({ 'a.md': 'x', 'b.md': 'y' });
  fs.mkdirSync(path.join(root, '.claude/commands'), { recursive: true });
  fs.writeFileSync(path.join(root, '.claude/commands/c.md'), 'z');
  const files = listAdapterFiles(root).sort();
  assert.deepStrictEqual(files, [
    '.claude/agents/a.md',
    '.claude/agents/b.md',
    '.claude/commands/c.md',
  ]);
});

test('checkAdapterRules aggregates errors across every adapter file', () => {
  const root = makeFixtureRepo({
    'good.md': [
      'Follow `agents/good.md` exactly, in full, as your operating instructions.',
      'ask which mode before proceeding rather than guessing, per `agents/good.md`.',
    ].join('\n'),
    'bad.md': [
      'Follow `agents/bad.md` exactly, in full, as your operating instructions.',
      'ask which mode before proceeding rather than guessing.',
    ].join('\n'),
  });
  const errors = checkAdapterRules(root);
  assert.strictEqual(errors.length, 1);
  assert.match(errors[0], /bad\.md/);
});
