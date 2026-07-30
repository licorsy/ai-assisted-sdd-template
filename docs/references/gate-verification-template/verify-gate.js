#!/usr/bin/env node

'use strict';

// Reference implementation for a project generated from this template.
// This template repository does not run this script on itself - see
// docs/references/gate-verification-template/README.md for scope and
// adoption. It only checks file existence for the subset of a phase's
// "Generated artifacts" bullets that are a single, unambiguous file path.
// Everything else is reported as not-machine-checkable, never guessed.
// It never reads or evaluates "Acceptance criteria / Done" bullets.

const fs = require('fs');
const path = require('path');

const ROADMAP_PATH = path.join(process.cwd(), 'docs', 'strategy', 'roadmap.md');
const HEADING_RE = /^#### Phase (\d+) - Generated artifacts\s*$/;
const NEXT_HEADING_RE = /^####? /;
const CODE_SPAN_RE = /`([^`]+)`/g;

function parseArgs(argv) {
  const match = argv.find((arg) => /^--phase=\d+$/.test(arg));
  if (!match) {
    return null;
  }
  return Number(match.split('=')[1]);
}

function extractArtifactSection(roadmapContent, phase) {
  const lines = roadmapContent.split(/\r?\n/);
  const headingIdx = lines.findIndex((line) => {
    const match = line.match(HEADING_RE);
    return match && Number(match[1]) === phase;
  });
  if (headingIdx === -1) {
    return null;
  }
  const bullets = [];
  for (let i = headingIdx + 1; i < lines.length; i += 1) {
    const line = lines[i];
    if (NEXT_HEADING_RE.test(line)) break;
    const trimmed = line.trim();
    if (trimmed.startsWith('-')) bullets.push(trimmed.replace(/^-\s*/, ''));
  }
  return bullets;
}

const CONDITIONAL_BULLET_RE = /^(if|optional)\b/i;

function classifyBullet(bullet) {
  if (CONDITIONAL_BULLET_RE.test(bullet)) {
    return { checkable: false, target: bullet };
  }

  const codeSpans = [...bullet.matchAll(CODE_SPAN_RE)].map((m) => m[1]);
  const isSingleSpan = codeSpans.length === 1;
  const hasAlternative = bullet.includes(' or ');
  const hasPlaceholderOrWildcard = isSingleSpan && (codeSpans[0].includes('[') || codeSpans[0].includes('*'));

  if (isSingleSpan && !hasAlternative && !hasPlaceholderOrWildcard) {
    return { checkable: true, target: codeSpans[0] };
  }
  return { checkable: false, target: bullet };
}

function main() {
  const phase = parseArgs(process.argv.slice(2));
  if (phase === null || Number.isNaN(phase)) {
    console.error('Usage: node verify-gate.js --phase=N');
    process.exit(1);
  }

  if (!fs.existsSync(ROADMAP_PATH)) {
    console.error(`Error: ${ROADMAP_PATH} not found - is this being run from the project root?`);
    process.exit(1);
  }

  const roadmapContent = fs.readFileSync(ROADMAP_PATH, 'utf8');
  const bullets = extractArtifactSection(roadmapContent, phase);

  if (bullets === null) {
    console.error(`Error: no "Phase ${phase} - Generated artifacts" section found in ${ROADMAP_PATH}.`);
    console.error('This can happen for a phase skipped under a shortened roadmap path, or a bad --phase value.');
    process.exit(1);
  }

  const checked = [];
  const missing = [];
  const notCheckable = [];

  for (const bullet of bullets) {
    const result = classifyBullet(bullet);
    if (!result.checkable) {
      notCheckable.push(result.target);
      continue;
    }
    const exists = fs.existsSync(path.join(process.cwd(), result.target));
    if (exists) {
      checked.push(result.target);
    } else {
      missing.push(result.target);
    }
  }

  console.log(`Phase ${phase} - Generated artifacts check\n`);

  console.log('CHECKED (exists):');
  console.log(checked.length ? checked.map((p) => `  - ${p}`).join('\n') : '  (none)');

  console.log('\nMISSING:');
  console.log(missing.length ? missing.map((p) => `  - ${p}`).join('\n') : '  (none)');

  console.log('\nNOT MACHINE-CHECKABLE (verify manually):');
  console.log(notCheckable.length ? notCheckable.map((b) => `  - ${b}`).join('\n') : '  (none)');

  console.log(
    '\nNote: this only checks file existence for unambiguous single-path artifacts. ' +
    'It does NOT validate "Acceptance criteria / Done" bullets, content correctness, ' +
    'or replace independent review (docs/manuals/operation-manual.md, Step 14).'
  );

  if (missing.length === 0) {
    console.log('\nGATE PASS');
    process.exit(0);
  } else {
    console.log(`\nGATE FAIL: [${missing.join(', ')}]`);
    process.exit(1);
  }
}

main();
