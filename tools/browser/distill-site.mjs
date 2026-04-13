import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { normalizeRawExtraction, splitBundle, writeJson } from '../lib/bundle-utils.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..', '..');

function getArg(flag, fallback = undefined) {
  const index = process.argv.indexOf(flag);
  return index >= 0 ? process.argv[index + 1] : fallback;
}

function slugify(value) {
  return String(value || 'site')
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80) || 'site';
}

function resolveOutputDir(url) {
  const explicit = getArg('--output-dir');
  if (explicit) return path.resolve(projectRoot, explicit);
  return path.resolve(projectRoot, 'output', slugify(new URL(url).hostname));
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function autoScroll(page, steps, delayMs) {
  await page.evaluate(
    async ({ maxSteps, stepDelay }) => {
      const root = document.scrollingElement || document.documentElement || document.body;
      const distance = Math.max(Math.floor(window.innerHeight * 0.9), 480);
      let count = 0;

      while (count < maxSteps) {
        const previous = root.scrollTop;
        root.scrollBy({ top: distance, left: 0, behavior: 'instant' });
        await new Promise((resolve) => setTimeout(resolve, stepDelay));
        count += 1;
        if (root.scrollTop === previous) break;
      }

      root.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      await new Promise((resolve) => setTimeout(resolve, Math.min(stepDelay, 200)));
    },
    { maxSteps: steps, stepDelay: delayMs }
  );
}

async function resolvePlaywright() {
  try {
    return await import('playwright');
  } catch (error) {
    console.error('Missing dependency: playwright');
    console.error('Run `npm install` in the project root before using `npm run site:distill`.');
    throw error;
  }
}

const url = getArg('--url');

if (!url) {
  console.error('Missing required --url argument.');
  console.error('Example: npm run site:distill -- --url "https://example.com"');
  process.exit(1);
}

const viewportWidth = Number(getArg('--width', '1440'));
const viewportHeight = Number(getArg('--height', '1200'));
const timeoutMs = Number(getArg('--timeout', '45000'));
const afterLoadWaitMs = Number(getArg('--wait-ms', '1200'));
const scrollSteps = Number(getArg('--scroll-steps', '18'));
const scrollDelayMs = Number(getArg('--scroll-delay-ms', '220'));
const waitUntil = getArg('--wait-until', 'domcontentloaded');
const outputDir = resolveOutputDir(url);
const extractorPath = path.resolve(projectRoot, 'tools/browser/extract_design_tokens.js');
const rawOutputPath = path.join(outputDir, 'raw-extraction.json');
const bundleOutputPath = path.join(outputDir, 'extraction-bundle.json');
const designOutputPath = path.join(outputDir, 'design-tokens.json');
const layoutOutputPath = path.join(outputDir, 'layout-tokens.json');
const screenshotPath = path.join(outputDir, 'page.png');
const runMetaPath = path.join(outputDir, 'run-meta.json');

let browser;

try {
  const { chromium } = await resolvePlaywright();
  const extractorSource = await fs.readFile(extractorPath, 'utf8');

  browser = await chromium.launch({
    headless: getArg('--headed') !== 'true',
  });

  const page = await browser.newPage({
    viewport: {
      width: viewportWidth,
      height: viewportHeight,
    },
  });

  await page.goto(url, {
    waitUntil,
    timeout: timeoutMs,
  });

  await wait(afterLoadWaitMs);
  await autoScroll(page, scrollSteps, scrollDelayMs);
  await wait(afterLoadWaitMs);

  await fs.mkdir(outputDir, { recursive: true });
  await page.screenshot({
    path: screenshotPath,
    fullPage: true,
  });

  const raw = await page.evaluate(async (scriptSource) => {
    return await window.eval(scriptSource);
  }, extractorSource);

  const bundle = normalizeRawExtraction(raw);
  const { designTokens, layoutTokens } = splitBundle(bundle);

  await writeJson(rawOutputPath, raw);
  await writeJson(bundleOutputPath, bundle);
  await writeJson(designOutputPath, designTokens);
  await writeJson(layoutOutputPath, layoutTokens);
  await writeJson(runMetaPath, {
    url,
    title: raw?._meta?.title ?? '',
    extractedAt: raw?._meta?.extractedAt ?? new Date().toISOString(),
    viewport: {
      width: viewportWidth,
      height: viewportHeight,
    },
    screenshotPath,
    rawOutputPath,
    bundleOutputPath,
    designOutputPath,
    layoutOutputPath,
  });

  console.log(`Distilled site: ${url}`);
  console.log(`Screenshot: ${screenshotPath}`);
  console.log(`Raw extraction: ${rawOutputPath}`);
  console.log(`Bundle: ${bundleOutputPath}`);
  console.log(`Design tokens: ${designOutputPath}`);
  console.log(`Layout tokens: ${layoutOutputPath}`);
} catch (error) {
  if (String(error?.message || '').includes('Executable doesn\'t exist')) {
    console.error('Playwright browser runtime is missing. Run `npx playwright install chromium` in the project root first.');
  }
  console.error(`Failed to distill site: ${error.message}`);
  process.exitCode = 1;
} finally {
  if (browser) {
    await browser.close();
  }
}
