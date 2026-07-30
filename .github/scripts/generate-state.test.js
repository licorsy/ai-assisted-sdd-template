'use strict';

const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const os = require('os');
const path = require('path');

const { listSources, readDocMeta, buildState, readExistingState } = require('./generate-state.js');

function makeFixtureRepo() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'state-fixture-'));
  fs.mkdirSync(path.join(root, 'agents'), { recursive: true });
  fs.mkdirSync(path.join(root, 'docs/manuals'), { recursive: true });
  fs.mkdirSync(path.join(root, 'docs/prompts'), { recursive: true });

  fs.writeFileSync(
    path.join(root, 'agents/sample-agent.md'),
    '---\ntitle: "Sample Agent"\ndoc_type: instruction\ndescription: "x"\nstatus: active\nversion: "2.0"\ncreated: 2026-01-01\nupdated: 2026-03-05\nlanguage: en\n---\n\n# Sample Agent\n'
  );
  fs.writeFileSync(
    path.join(root, 'docs/manuals/sample-manual.md'),
    '---\ntitle: "Sample Manual"\ndoc_type: manual\ndescription: "x"\nstatus: draft\nversion: "1.1"\ncreated: 2026-01-02\nupdated: 2026-02-01\nlanguage: en\n---\n\n# Sample Manual\n'
  );
  fs.writeFileSync(
    path.join(root, 'docs/prompts/001-prompt-excluded.md'),
    '---\ntitle: "Excluded Prompt"\ndoc_type: prompt\ndescription: "x"\nstatus: archived\nversion: "1.0"\ncreated: 2026-01-03\nupdated: 2026-07-01\nlanguage: en\n---\n\n# Excluded\n'
  );
  fs.writeFileSync(path.join(root, 'docs/status.md'),
    '---\ntitle: "Status"\ndoc_type: status-artifact\ndescription: "x"\nstatus: active\nversion: "1.0"\ncreated: 2026-01-04\nupdated: 2026-01-04\nlanguage: en\n---\n\n# Status\n'
  );
  fs.mkdirSync(path.join(root, 'docs/manuals/examples'), { recursive: true });
  fs.writeFileSync(
    path.join(root, 'docs/manuals/examples/sample-example.md'),
    '---\ntitle: "Sample Example"\ndoc_type: governance\ndescription: "x"\nstatus: active\nversion: "1.0"\ncreated: 2026-01-05\nupdated: 2026-01-05\nlanguage: en\n---\n\n# Sample Example\n'
  );
  fs.mkdirSync(path.join(root, 'docs/references/infra-templates'), { recursive: true });
  fs.writeFileSync(
    path.join(root, 'docs/references/sample-reference.md'),
    '---\ntitle: "Sample Reference"\ndoc_type: product-doc\ndescription: "x"\nstatus: active\nversion: "1.0"\ncreated: 2026-01-06\nupdated: 2026-01-06\nlanguage: en\n---\n\n# Sample Reference\n'
  );
  fs.writeFileSync(
    path.join(root, 'docs/references/infra-templates/sample-infra-readme.md'),
    '---\ntitle: "Sample Infra Readme"\ndoc_type: product-doc\ndescription: "x"\nstatus: active\nversion: "1.0"\ncreated: 2026-01-07\nupdated: 2026-01-07\nlanguage: en\n---\n\n# Sample Infra Readme\n'
  );
  fs.writeFileSync(path.join(root, 'docs/references/infra-templates/deploy.yml'), 'not-markdown: true\n');
  fs.writeFileSync(path.join(root, 'docs/STATE.md'), 'previously generated - must be excluded as a source');
  fs.writeFileSync(path.join(root, 'CHANGELOG.md'), '# Changelog\n\nNo frontmatter here.\n');
  fs.writeFileSync(
    path.join(root, 'QUICKSTART.md'),
    '---\ntitle: "Quickstart"\ndoc_type: product-doc\ndescription: "x"\nstatus: active\nversion: "1.0"\ncreated: 2026-01-08\nupdated: 2026-01-08\nlanguage: en\n---\n\n# Quickstart\n'
  );
  fs.writeFileSync(path.join(root, 'CONTRIBUTING.md'), '# Contributing\n\nNo frontmatter here.\n');
  fs.writeFileSync(path.join(root, 'SECURITY.md'), '# Security\n\nNo frontmatter here.\n');
  fs.mkdirSync(path.join(root, 'docs/reports'), { recursive: true });
  fs.writeFileSync(
    path.join(root, 'docs/reports/sample-report.md'),
    '---\ntitle: "Sample Report"\ndoc_type: product-doc\ndescription: "x"\nstatus: active\nversion: "1.0"\ncreated: 2026-01-09\nupdated: 2026-01-09\nlanguage: en\n---\n\n# Sample Report\n'
  );

  return root;
}

test('listSources includes living docs and excludes docs/prompts and STATE.md', () => {
  const root = makeFixtureRepo();
  const sources = listSources(root);
  assert.deepStrictEqual(sources, [
    'CHANGELOG.md',
    'QUICKSTART.md',
    'CONTRIBUTING.md',
    'SECURITY.md',
    path.join('agents', 'sample-agent.md'),
    path.join('docs', 'status.md'),
    path.join('docs/manuals', 'sample-manual.md'),
    path.join('docs/manuals/examples', 'sample-example.md'),
    path.join('docs/references', 'sample-reference.md'),
    path.join('docs/references/infra-templates', 'sample-infra-readme.md'),
    path.join('docs/reports', 'sample-report.md'),
  ].sort());
  assert.ok(!sources.some((s) => s.includes('prompts')));
  assert.ok(!sources.some((s) => s.endsWith('STATE.md')));
});

test('listSources recurses into docs/manuals subfolders', () => {
  const root = makeFixtureRepo();
  assert.ok(listSources(root).includes(path.join('docs/manuals/examples', 'sample-example.md')));
});

test('listSources includes docs/references recursively, Markdown only', () => {
  const root = makeFixtureRepo();
  const sources = listSources(root);
  assert.ok(sources.includes(path.join('docs/references', 'sample-reference.md')));
  assert.ok(sources.includes(path.join('docs/references/infra-templates', 'sample-infra-readme.md')));
  assert.ok(!sources.some((s) => s.endsWith('deploy.yml')));
});

test('listSources includes docs/reports', () => {
  const root = makeFixtureRepo();
  assert.ok(listSources(root).includes(path.join('docs/reports', 'sample-report.md')));
});

test('readDocMeta tolerates files without frontmatter', () => {
  const root = makeFixtureRepo();
  const meta = readDocMeta(root, 'CHANGELOG.md');
  assert.strictEqual(meta.title, '—');
  assert.strictEqual(meta.status, '—');
});

test('buildState is deterministic and uses max source date as updated', () => {
  const root = makeFixtureRepo();
  const first = buildState(root);
  const second = buildState(root);
  assert.strictEqual(first, second);
  assert.match(first, /^updated: 2026-03-05$/m);
  assert.ok(!first.includes('Excluded Prompt'));
  assert.ok(first.includes('| [agents/sample-agent.md](../agents/sample-agent.md) | Sample Agent | instruction | active | 2.0 | 2026-03-05 |'));
});

test('buildState migrates a missing/legacy version (e.g. the old "auto" placeholder) to "1" on first run', () => {
  const root = makeFixtureRepo();
  // The fixture's docs/STATE.md has no frontmatter at all, standing in for
  // the pre-fix "auto" placeholder: readExistingState reports isInteger:
  // false either way, so both cases migrate to "1" the same way.
  assert.strictEqual(readExistingState(root).isInteger, false);
  assert.match(buildState(root), /^version: "1"$/m);
});

test('buildState keeps the same version on a no-op regeneration, and bumps by exactly one on a real change', () => {
  const root = makeFixtureRepo();
  const first = buildState(root);
  fs.writeFileSync(path.join(root, 'docs/STATE.md'), first);

  const second = buildState(root);
  assert.strictEqual(second, first);
  assert.match(second, /^version: "1"$/m);

  fs.writeFileSync(
    path.join(root, 'docs/manuals/sample-manual.md'),
    fs.readFileSync(path.join(root, 'docs/manuals/sample-manual.md'), 'utf8').replace('version: "1.1"', 'version: "1.2"')
  );
  const third = buildState(root);
  assert.match(third, /^version: "2"$/m);
});

test('staleness is detectable by string comparison against the committed file', () => {
  const root = makeFixtureRepo();
  const generated = buildState(root);
  fs.writeFileSync(path.join(root, 'docs/STATE.md'), generated);
  assert.strictEqual(fs.readFileSync(path.join(root, 'docs/STATE.md'), 'utf8'), buildState(root));

  fs.writeFileSync(
    path.join(root, 'docs/manuals/sample-manual.md'),
    fs.readFileSync(path.join(root, 'docs/manuals/sample-manual.md'), 'utf8').replace('version: "1.1"', 'version: "1.2"')
  );
  assert.notStrictEqual(fs.readFileSync(path.join(root, 'docs/STATE.md'), 'utf8'), buildState(root));
});
