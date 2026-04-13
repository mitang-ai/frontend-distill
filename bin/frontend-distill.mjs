#!/usr/bin/env node

import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');

const command = process.argv[2];
const args = process.argv.slice(3);

const commandMap = {
  install: path.join(projectRoot, 'tools', 'install-skill.mjs'),
  distill: path.join(projectRoot, 'tools', 'browser', 'distill-site.mjs'),
  normalize: path.join(projectRoot, 'tools', 'normalize-extraction-bundle.mjs'),
  validate: path.join(projectRoot, 'tools', 'validate-extraction-bundle.mjs'),
  split: path.join(projectRoot, 'tools', 'split-extraction-bundle.mjs'),
};

function printHelp() {
  console.log(`
Frontend Distill CLI

Usage:
  frontend-distill <command> [options]

Commands:
  install    Install the skill into a local skills directory
  distill    Open a URL, run the extractor, and emit bundle outputs
  normalize  Normalize a raw extraction JSON file into the bundle schema
  validate   Validate a normalized extraction bundle
  split      Split a bundle into design and layout token files
  help       Show this help text

Examples:
  frontend-distill install --target "C:\\Users\\name\\.claude\\skills"
  frontend-distill distill --url "https://example.com" --output-dir "./output/example"
  frontend-distill normalize --input "./raw.json" --output "./bundle.json"
  frontend-distill validate --input "./bundle.json"
  frontend-distill split --input "./bundle.json" --design-output "./design-tokens.json" --layout-output "./layout-tokens.json"
`.trim());
}

if (!command || command === 'help' || command === '--help' || command === '-h') {
  printHelp();
  process.exit(0);
}

const targetScript = commandMap[command];

if (!targetScript) {
  console.error(`Unknown command: ${command}`);
  console.error('Run `frontend-distill help` to see available commands.');
  process.exit(1);
}

const result = spawnSync(process.execPath, [targetScript, ...args], {
  cwd: process.cwd(),
  stdio: 'inherit',
});

if (typeof result.status === 'number') {
  process.exit(result.status);
}

process.exit(1);
