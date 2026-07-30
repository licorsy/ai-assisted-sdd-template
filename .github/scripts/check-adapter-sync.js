#!/usr/bin/env node

'use strict';

const fs = require('fs');
const path = require('path');

const ADAPTER_FILES = ['CLAUDE.md', 'AGENTS.md'];

const OPEN_RE = /<!--\s*sync:([a-z0-9-]+)\s+source=(\S+)\s+anchor="([^"]+)"\s*-->/g;

function extractBlocks(content, fileLabel) {
  const blocks = {};
  const errors = [];
  let match;

  OPEN_RE.lastIndex = 0;
  while ((match = OPEN_RE.exec(content)) !== null) {
    const [, key, source, anchor] = match;
    const closeTag = `<!-- /sync:${key} -->`;
    const start = match.index + match[0].length;
    const end = content.indexOf(closeTag, start);
    if (end === -1) {
      errors.push(`${fileLabel}: sync block "${key}" is never closed (expected ${closeTag})`);
      continue;
    }
    if (key in blocks) {
      errors.push(`${fileLabel}: duplicate sync block key "${key}"`);
      continue;
    }
    blocks[key] = {
      key,
      source,
      anchor,
      content: content.slice(start, end).replace(/\s+/g, ' ').trim(),
    };
  }

  return { blocks, errors };
}

function checkAdapterSync(root) {
  const errors = [];
  const perFile = {};

  for (const file of ADAPTER_FILES) {
    const full = path.join(root, file);
    if (!fs.existsSync(full)) {
      errors.push(`missing adapter file: ${file}`);
      continue;
    }
    const { blocks, errors: parseErrors } = extractBlocks(fs.readFileSync(full, 'utf8'), file);
    errors.push(...parseErrors);
    perFile[file] = blocks;
  }

  if (errors.length > 0) return errors;

  const [a, b] = ADAPTER_FILES;
  const keysA = Object.keys(perFile[a]).sort();
  const keysB = Object.keys(perFile[b]).sort();

  if (keysA.join(',') !== keysB.join(',')) {
    errors.push(`sync block keys differ: ${a} has [${keysA}], ${b} has [${keysB}]`);
    return errors;
  }

  if (keysA.length === 0) {
    errors.push('no sync blocks found in either adapter - markers were removed?');
    return errors;
  }

  for (const key of keysA) {
    const blockA = perFile[a][key];
    const blockB = perFile[b][key];

    if (blockA.content !== blockB.content) {
      errors.push(`sync block "${key}" diverged between ${a} and ${b}`);
    }

    for (const block of [blockA, blockB]) {
      const sourcePath = path.join(root, block.source);
      if (!fs.existsSync(sourcePath)) {
        errors.push(`sync block "${key}": source file not found: ${block.source}`);
      } else if (!fs.readFileSync(sourcePath, 'utf8').includes(block.anchor)) {
        errors.push(`sync block "${key}": anchor "${block.anchor}" no longer occurs in ${block.source}`);
      }
    }
  }

  return errors;
}

function main() {
  const errors = checkAdapterSync(process.cwd());
  if (errors.length > 0) {
    for (const error of [...new Set(errors)]) console.error('  - ' + error);
    console.error('\nAdapter sync check failed.');
    process.exitCode = 1;
    return;
  }
  console.log('Adapter rule restatements are in sync.');
}

if (require.main === module) {
  main();
}

module.exports = {
  extractBlocks,
  checkAdapterSync,
  ADAPTER_FILES,
};
