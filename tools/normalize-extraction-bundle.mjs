import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadJson, normalizeRawExtraction, writeJson } from './lib/bundle-utils.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');

function getArg(flag, fallback = undefined) {
  const index = process.argv.indexOf(flag);
  return index >= 0 ? process.argv[index + 1] : fallback;
}

const inputPath = path.resolve(projectRoot, getArg('--input', './examples/sample-raw-extraction.json'));
const outputPath = path.resolve(projectRoot, getArg('--output', './output/extraction-bundle.json'));

try {
  const raw = await loadJson(inputPath);
  const bundle = normalizeRawExtraction(raw);
  await writeJson(outputPath, bundle);

  console.log(`Normalized extraction bundle written to ${outputPath}`);
  console.log(`Source: ${inputPath}`);
  console.log(`Primary layout type: ${bundle.summary.primaryLayoutType}`);
  console.log(`Responsive breakpoints detected: ${bundle.responsiveSystem.breakpoints.length}`);
} catch (error) {
  console.error(`Failed to normalize extraction bundle: ${error.message}`);
  process.exitCode = 1;
}
