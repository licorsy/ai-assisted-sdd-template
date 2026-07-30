#!/usr/bin/env node

'use strict';

// Shared filesystem/frontmatter primitives used by the governance scripts
// that remain repo-specific (check-step-references.js, generate-state.js).
// Extracted from validate-docs-frontmatter.js when frontmatter validation
// itself moved to docgov (licorsy/docs-governance) - these two functions
// had no validation logic of their own, so they outlive the script that
// used to house them.

const fs = require('fs');
const path = require('path');

function walk(dir, out) {
  out = out || [];
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full, out);
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      out.push(full);
    }
  }
  return out;
}

function parseFrontmatter(content) {
  if (!content.startsWith('---\n') && !content.startsWith('---\r\n')) return null;
  const end = content.indexOf('\n---', 4);
  if (end === -1) return null;
  const block = content.slice(0, end);
  const fields = {};
  for (const line of block.split(/\r?\n/).slice(1)) {
    const match = /^([A-Za-z_]+):\s*(.*)$/.exec(line);
    if (match) {
      const key = match[1];
      const rawValue = match[2];
      if (!(key in fields)) fields[key] = rawValue.trim();
    }
  }
  return fields;
}

module.exports = { walk, parseFrontmatter };
