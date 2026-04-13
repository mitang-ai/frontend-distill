import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadJson, splitBundle, writeJson } from './lib/bundle-utils.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');

function getArg(flag, fallback = undefined) {
  const index = process.argv.indexOf(flag);
  return index >= 0 ? process.argv[index + 1] : fallback;
}

const inputPath = path.resolve(projectRoot, getArg('--input', './output/extraction-bundle.json'));
const designOutputPath = path.resolve(projectRoot, getArg('--design-output', './output/design-tokens.json'));
const layoutOutputPath = path.resolve(projectRoot, getArg('--layout-output', './output/layout-tokens.json'));

try {
  const bundle = await loadJson(inputPath);
  const { designTokens, layoutTokens } = splitBundle(bundle);

  await writeJson(designOutputPath, designTokens);
  await writeJson(layoutOutputPath, layoutTokens);

  console.log(`Wrote design tokens to ${designOutputPath}`);
  console.log(`Wrote layout tokens to ${layoutOutputPath}`);
} catch (error) {
  console.error(`Failed to split extraction bundle: ${error.message}`);
  process.exitCode = 1;
}
