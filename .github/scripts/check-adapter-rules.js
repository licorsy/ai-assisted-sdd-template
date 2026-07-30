#!/usr/bin/env node

'use strict';

const fs = require('fs');
const path = require('path');

const ADAPTER_GLOBS = ['.claude/agents', '.claude/commands'];

// Every adapter in this repo opens with "Follow `agents/X.md` exactly, in
// full, ..." - this extracts X.md as the canonical prompt the adapter wraps,
// without hardcoding the pairing (ADR-0003 principle 2: adapters are thin
// pointers to a canonical prompt, never a second source of truth).
const CANONICAL_RE = /Follow `(agents\/[a-zA-Z0-9_-]+\.md)` exactly/;

// The recurring defect shape (prompt-095/096/097, this cycle's finding 1):
// an adapter states a conditional operating rule - "ask ... before
// proceeding", "do not ... unless" - that has no anchor in the canonical
// prompt it wraps. Deliberately narrow (matches only the shapes that have
// actually recurred) rather than a broad obligation-word heuristic, to
// avoid false positives on unrelated sentences.
const RULE_PATTERNS = [/\bask\b[^.]*\bbefore proceeding\b/i, /\bdo not\b[^.]*\bunless\b/i];

function stripFrontmatter(content) {
  if (!content.startsWith('---')) return content;
  const end = content.indexOf('\n---', 3);
  return end === -1 ? content : content.slice(end + 4);
}

// Returns the 0-indexed line number of the frontmatter's closing "---", or
// -1 if there is no frontmatter, so line numbers reported to the caller can
// stay relative to the original file rather than the stripped body.
function frontmatterEndLine(content) {
  if (!content.startsWith('---')) return -1;
  const lines = content.split(/\r?\n/);
  for (let i = 1; i < lines.length; i++) {
    if (lines[i] === '---') return i;
  }
  return -1;
}

function listAdapterFiles(root) {
  const files = [];
  for (const dir of ADAPTER_GLOBS) {
    const full = path.join(root, dir);
    if (!fs.existsSync(full)) continue;
    for (const name of fs.readdirSync(full)) {
      if (name.endsWith('.md')) files.push(path.join(dir, name));
    }
  }
  return files;
}

function checkFile(root, relPath) {
  const errors = [];
  const full = path.join(root, relPath);
  const raw = fs.readFileSync(full, 'utf8');
  const body = stripFrontmatter(raw);

  const canonicalMatch = CANONICAL_RE.exec(body);
  if (!canonicalMatch) {
    errors.push(`${relPath}: no "Follow \`agents/X.md\` exactly" opening line found - cannot determine its canonical prompt`);
    return errors;
  }
  const canonicalPath = canonicalMatch[1];
  const canonicalRef = new RegExp('`' + canonicalPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '`');

  const lineOffset = frontmatterEndLine(raw);
  const lines = body.split(/\r?\n/);
  lines.forEach((line, idx) => {
    const isRuleLine = RULE_PATTERNS.some((re) => re.test(line));
    if (isRuleLine && !canonicalRef.test(line)) {
      errors.push(
        `${relPath}:${lineOffset + idx + 1}: operating rule with no anchor in its canonical prompt (${canonicalPath}) - "${line.trim()}"`
      );
    }
  });

  return errors;
}

function checkAdapterRules(root) {
  const errors = [];
  for (const relPath of listAdapterFiles(root)) {
    errors.push(...checkFile(root, relPath));
  }
  return errors;
}

function main() {
  const errors = checkAdapterRules(process.cwd());
  if (errors.length > 0) {
    console.error('');
    for (const error of errors) console.error('  - ' + error);
    console.error('\n' + errors.length + ' unanchored adapter rule(s) found.');
    process.exitCode = 1;
    return;
  }
  console.log('Every adapter operating rule is anchored in its canonical prompt.');
}

if (require.main === module) {
  main();
}

module.exports = {
  stripFrontmatter,
  listAdapterFiles,
  checkFile,
  checkAdapterRules,
  CANONICAL_RE,
  RULE_PATTERNS,
};
