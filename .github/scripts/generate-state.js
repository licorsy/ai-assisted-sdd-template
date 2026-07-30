#!/usr/bin/env node

'use strict';

const fs = require('fs');
const path = require('path');

const { parseFrontmatter, walk } = require('./doc-walk.js');

const OUTPUT_PATH = 'docs/STATE.md';

const { CATEGORY_DIRS, ROOT_FILES } = require('./doc-scope.js');

// Living documents only. docs/prompts/ is a historical archive (see
// PROMPT-INDEX.md) and is deliberately excluded from state reads.
const SOURCE_DIRS = CATEGORY_DIRS.filter((d) => d !== 'docs/prompts');
const SOURCE_FILES = ROOT_FILES;

function listSources(root) {
  const files = [];

  for (const dir of SOURCE_DIRS) {
    // Recursive: subfolders like docs/manuals/examples/ are living docs too.
    for (const full of walk(path.join(root, dir))) {
      files.push(path.relative(root, full));
    }
  }

  // Root-level living docs under docs/ (status.md, handbook.md, ...),
  // excluding the generated output itself and the prompts archive.
  const docsDir = path.join(root, 'docs');
  if (fs.existsSync(docsDir)) {
    for (const entry of fs.readdirSync(docsDir, { withFileTypes: true })) {
      if (entry.isFile() && entry.name.endsWith('.md') && entry.name !== path.basename(OUTPUT_PATH)) {
        files.push(path.join('docs', entry.name));
      }
    }
  }

  for (const file of SOURCE_FILES) {
    if (fs.existsSync(path.join(root, file))) files.push(file);
  }

  return files.sort();
}

function readDocMeta(root, relPath) {
  const content = fs.readFileSync(path.join(root, relPath), 'utf8');
  const fields = parseFrontmatter(content) || {};
  return {
    path: relPath,
    title: fields.title ? fields.title.replace(/^"|"$/g, '') : '—',
    doc_type: fields.doc_type || '—',
    status: fields.status || '—',
    version: fields.version ? fields.version.replace(/^"|"$/g, '') : '—',
    updated: fields.updated || '—',
  };
}

// Reads the currently committed docs/STATE.md (if any) and reports its
// version: value. A plain non-negative integer is the only value the
// generator ever wrote itself before this function existed the legacy
// "auto" placeholder, a missing file, or anything else non-numeric all
// report isInteger: false / value: 0, so the caller treats them the same
// way: not something to preserve, just a base to increment past.
function readExistingState(root) {
  const outFile = path.join(root, OUTPUT_PATH);
  const raw = fs.existsSync(outFile) ? fs.readFileSync(outFile, 'utf8') : '';
  const fields = parseFrontmatter(raw) || {};
  const version = fields.version ? fields.version.replace(/^"|"$/g, '') : '';
  const isInteger = /^\d+$/.test(version);
  return { raw, isInteger, value: isInteger ? Number.parseInt(version, 10) : 0 };
}

function normalizeVersionLine(content) {
  return content.replace(/^version: ".*"$/m, 'version: "%VERSION%"');
}

function buildState(root) {
  const docs = listSources(root).map((f) => readDocMeta(root, f));

  const dates = docs.map((d) => d.updated).filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d)).sort();
  const maxUpdated = dates.length > 0 ? dates[dates.length - 1] : '1970-01-01';

  const lines = [];
  lines.push('---');
  lines.push('title: "Repository State"');
  lines.push('doc_type: status-artifact');
  lines.push('description: "Generated single-read snapshot of every living document\'s title, type, status, version, and freshness. Answers \'where are we?\' without a directory sweep; excludes the historical docs/prompts/ archive."');
  lines.push('status: active');
  lines.push('version: "%VERSION%"');
  lines.push('created: 2026-07-13');
  lines.push(`updated: ${maxUpdated}`);
  lines.push('language: en');
  lines.push('id: repository-state');
  lines.push('tags: [status-artifact, generated, state, retrieval]');
  lines.push('owner: Alexandre Clemente');
  lines.push('related: [operation-manual, prompt-archive-index]');
  lines.push('---');
  lines.push('');
  lines.push('<!-- GENERATED FILE - do not edit by hand. Regenerate with: node .github/scripts/generate-state.js -->');
  lines.push('');
  lines.push('# Repository State');
  lines.push('');
  lines.push('One consolidated read of the living documents. For "where are we?" questions, start here, then follow the link that answers it. Historical prompts are indexed separately in [PROMPT-INDEX.md](prompts/PROMPT-INDEX.md).');
  lines.push('');
  lines.push('| Document | Title | Type | Status | Version | Updated |');
  lines.push('| --- | --- | --- | --- | --- | --- |');
  for (const d of docs) {
    const link = `[${d.path}](${path.relative('docs', d.path).split(path.sep).join('/')})`;
    lines.push(`| ${link} | ${d.title} | ${d.doc_type} | ${d.status} | ${d.version} | ${d.updated} |`);
  }
  lines.push('');
  lines.push(`Freshest source update: ${maxUpdated}. Documents without frontmatter show "—".`);
  lines.push('');
  const candidate = lines.join('\n');

  const existing = readExistingState(root);
  const unchanged = existing.isInteger && normalizeVersionLine(existing.raw) === candidate;
  const finalVersion = unchanged ? existing.value : existing.value + 1;

  return candidate.replace('version: "%VERSION%"', `version: "${finalVersion}"`);
}

function main() {
  const root = process.cwd();
  const content = buildState(root);
  const outFile = path.join(root, OUTPUT_PATH);

  if (process.argv.includes('--check')) {
    const existing = fs.existsSync(outFile) ? fs.readFileSync(outFile, 'utf8') : '';
    if (existing !== content) {
      console.error(`${OUTPUT_PATH} is stale. Regenerate with: node .github/scripts/generate-state.js`);
      process.exitCode = 1;
      return;
    }
    console.log(`${OUTPUT_PATH} is up to date.`);
    return;
  }

  fs.writeFileSync(outFile, content);
  console.log(`Wrote ${OUTPUT_PATH}.`);
}

if (require.main === module) {
  main();
}

module.exports = {
  listSources,
  readDocMeta,
  readExistingState,
  buildState,
  OUTPUT_PATH,
};
