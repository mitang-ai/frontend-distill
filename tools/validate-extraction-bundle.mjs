import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadJson } from './lib/bundle-utils.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');

function getArg(flag, fallback = undefined) {
  const index = process.argv.indexOf(flag);
  return index >= 0 ? process.argv[index + 1] : fallback;
}

function isObject(value) {
  return value && typeof value === 'object' && !Array.isArray(value);
}

function validateBundle(bundle) {
  const errors = [];

  const requiredTopLevel = ['meta', 'summary', 'visualTokens', 'componentSystem', 'layoutSystem', 'responsiveSystem'];
  for (const key of requiredTopLevel) {
    if (!(key in bundle)) errors.push(`Missing top-level field: ${key}`);
  }

  if (!isObject(bundle.meta)) {
    errors.push('meta must be an object');
  } else {
    for (const key of ['version', 'url', 'title', 'extractedAt']) {
      if (typeof bundle.meta[key] !== 'string') errors.push(`meta.${key} must be a string`);
    }
  }

  if (!isObject(bundle.summary)) {
    errors.push('summary must be an object');
  }

  if (!isObject(bundle.visualTokens)) {
    errors.push('visualTokens must be an object');
  } else {
    if (!isObject(bundle.visualTokens.colors)) errors.push('visualTokens.colors must be an object');
    if (!isObject(bundle.visualTokens.typography)) errors.push('visualTokens.typography must be an object');
    if (!Array.isArray(bundle.visualTokens.spacingScale)) errors.push('visualTokens.spacingScale must be an array');
    if (!Array.isArray(bundle.visualTokens.radiusScale)) errors.push('visualTokens.radiusScale must be an array');
  }

  if (!isObject(bundle.componentSystem)) {
    errors.push('componentSystem must be an object');
  }

  if (!isObject(bundle.layoutSystem)) {
    errors.push('layoutSystem must be an object');
  } else {
    if (!isObject(bundle.layoutSystem.pageArchitecture)) errors.push('layoutSystem.pageArchitecture must be an object');
    if (!Array.isArray(bundle.layoutSystem.containers)) errors.push('layoutSystem.containers must be an array');
    if (!Array.isArray(bundle.layoutSystem.grids)) errors.push('layoutSystem.grids must be an array');
  }

  if (!isObject(bundle.responsiveSystem)) {
    errors.push('responsiveSystem must be an object');
  } else {
    if (!Array.isArray(bundle.responsiveSystem.breakpoints)) errors.push('responsiveSystem.breakpoints must be an array');
    if (!Array.isArray(bundle.responsiveSystem.viewportSnapshots)) errors.push('responsiveSystem.viewportSnapshots must be an array');
    if (!Array.isArray(bundle.responsiveSystem.collapseRules)) errors.push('responsiveSystem.collapseRules must be an array');
  }

  return errors;
}

const inputPath = path.resolve(projectRoot, getArg('--input', './output/extraction-bundle.json'));

try {
  const bundle = await loadJson(inputPath);
  const errors = validateBundle(bundle);

  if (errors.length) {
    console.error(`Bundle validation failed for ${inputPath}`);
    for (const error of errors) {
      console.error(`- ${error}`);
    }
    process.exitCode = 1;
  } else {
    console.log(`Bundle validation passed for ${inputPath}`);
  }
} catch (error) {
  console.error(`Failed to validate extraction bundle: ${error.message}`);
  process.exitCode = 1;
}
