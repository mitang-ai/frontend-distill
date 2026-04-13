import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');

function getArg(flag, fallback = undefined) {
  const index = process.argv.indexOf(flag);
  return index >= 0 ? process.argv[index + 1] : fallback;
}

const sourcePath = path.resolve(projectRoot, getArg('--source', './skill/frontend-distill'));
const targetPathArg = getArg('--target');

if (!targetPathArg) {
  console.error('Missing required --target argument.');
  console.error('Example: npm run skill:install -- --target "C:\\Users\\name\\.claude\\skills"');
  process.exit(1);
}

const targetPath = path.resolve(projectRoot, targetPathArg);
const finalTarget = path.basename(targetPath).toLowerCase() === 'frontend-distill'
  ? targetPath
  : path.join(targetPath, 'frontend-distill');

try {
  await fs.mkdir(path.dirname(finalTarget), { recursive: true });
  await fs.rm(finalTarget, { recursive: true, force: true });
  await fs.cp(sourcePath, finalTarget, { recursive: true });

  console.log(`Installed skill from ${sourcePath}`);
  console.log(`Installed skill to   ${finalTarget}`);
} catch (error) {
  console.error(`Failed to install skill: ${error.message}`);
  process.exitCode = 1;
}
