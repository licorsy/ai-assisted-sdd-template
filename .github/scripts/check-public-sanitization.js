#!/usr/bin/env node

'use strict';

// Candidate-flagging gate for the public mirror (prompt-108). Greps tracked
// files (git ls-files - local-notes/ is already gitignored and never
// reaches this list) for secret/PII-shaped patterns and literal
// business-tech-agency/personal-os references. This is deliberately a
// human-in-the-loop gate, not an auto-pass/fail one: separating a real
// secret from this repo's own prose about secrets-management or LLM
// "tokens" needs a human read (see check-adapter-rules.js's own precedent
// for a narrow, explicit trigger vocabulary over a broad NLP heuristic).
//
// Usage: node .github/scripts/check-public-sanitization.js

const { execSync } = require('child_process');

const SECRET_PATTERN = /api[_-]?key|secret|token|password/i;
const EMAIL_PATTERN = /@[a-z0-9.-]+\.[a-z]{2,}/i;
const NAME_PATTERNS = [/business-tech-agency/i, /personal-os/i];

function listTrackedFiles() {
  return execSync('git ls-files', { encoding: 'utf8' })
    .split('\n')
    .filter(Boolean);
}

function checkFile(path, applySecretPattern) {
  const findings = [];
  let content;
  try {
    content = require('fs').readFileSync(path, 'utf8');
  } catch {
    return findings; // binary or unreadable - skip
  }
  const lines = content.split('\n');
  lines.forEach((line, i) => {
    if (applySecretPattern && SECRET_PATTERN.test(line)) {
      findings.push({ path, line: i + 1, kind: 'secret-shaped', text: line.trim() });
    }
    if (EMAIL_PATTERN.test(line)) {
      findings.push({ path, line: i + 1, kind: 'email-shaped', text: line.trim() });
    }
    for (const pattern of NAME_PATTERNS) {
      if (pattern.test(line)) {
        findings.push({ path, line: i + 1, kind: `reference:${pattern.source}`, text: line.trim() });
      }
    }
  });
  return findings;
}

function main() {
  const files = listTrackedFiles();
  const allFindings = [];

  for (const path of files) {
    const applySecretPattern = !path.endsWith('.md'); // *.md excluded from the secret-shaped pattern by default (100's own precedent: this repo's prose legitimately discusses these words)
    allFindings.push(...checkFile(path, applySecretPattern));
  }

  if (allFindings.length === 0) {
    console.log(`No candidate findings across ${files.length} tracked file(s).`);
    return;
  }

  console.log(`${allFindings.length} candidate finding(s) across ${files.length} tracked file(s) - human review required, not an auto-fail:\n`);
  for (const f of allFindings) {
    console.log(`${f.path}:${f.line} [${f.kind}] ${f.text}`);
  }
}

if (require.main === module) {
  main();
}

module.exports = { listTrackedFiles, checkFile, SECRET_PATTERN, EMAIL_PATTERN, NAME_PATTERNS };
