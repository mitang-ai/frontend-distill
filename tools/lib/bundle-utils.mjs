import fs from 'node:fs/promises';
import path from 'node:path';

export async function loadJson(filePath) {
  const raw = await fs.readFile(filePath, 'utf8');
  return JSON.parse(raw);
}

export async function writeJson(filePath, value) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

export async function writeText(filePath, value) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, value, 'utf8');
}

export function ensureArray(value) {
  return Array.isArray(value) ? value : [];
}

export function ensureObject(value) {
  return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
}

export function uniq(values) {
  return [...new Set(values.filter(Boolean))];
}

export function pickStrings(values, limit = Number.POSITIVE_INFINITY) {
  return ensureArray(values).filter((item) => typeof item === 'string' && item.trim()).slice(0, limit);
}

export function asColorList(values) {
  return ensureArray(values).map((item) => {
    if (typeof item === 'string') {
      return { hex: item };
    }

    return {
      hex: item?.hex ?? '',
      count: item?.count,
      role: item?.role,
    };
  }).filter((item) => item.hex);
}

export function parseNumericPx(value) {
  if (typeof value !== 'string') return null;
  const match = value.match(/-?\d+(\.\d+)?/);
  return match ? Number(match[0]) : null;
}

export function inferContentDensity(spacingValues) {
  const count = ensureArray(spacingValues).length;
  if (count >= 28) return 'dense';
  if (count >= 14) return 'balanced';
  return 'airy';
}

function layoutSource(raw) {
  return ensureObject(raw.layout);
}

function responsiveSource(raw) {
  return ensureObject(raw.responsive);
}

function componentVariantSource(raw) {
  return ensureObject(raw.componentVariants);
}

function effectSource(raw) {
  return ensureObject(raw.effects);
}

function normalizeViewport(raw) {
  const viewport = ensureObject(raw?._meta?.viewport);
  if (!Object.keys(viewport).length) return undefined;
  return {
    width: typeof viewport.width === 'number' ? viewport.width : undefined,
    height: typeof viewport.height === 'number' ? viewport.height : undefined,
  };
}

export function inferPrimaryLayoutType(raw) {
  const explicit = raw?.summary?.responsiveEvidence?.viewportLabel || raw?.layout?.pageArchitecture?.viewportLabel;
  const pageArchitecture = ensureObject(layoutSource(raw).pageArchitecture);
  if (typeof pageArchitecture.surfaceType === 'string' && pageArchitecture.surfaceType.trim()) {
    return pageArchitecture.surfaceType;
  }

  const components = ensureObject(raw.components);
  const cards = ensureArray(components.cards).length;
  const inputs = ensureArray(components.inputs).length;
  const nav = ensureArray(components.navigation).length;
  const tabs = ensureArray(components.tabs).length;
  const modals = ensureArray(components.modals).length;

  if (explicit === 'desktop' || explicit === 'tablet' || explicit === 'mobile') {
    // ignore viewport labels here, but explicit capture means responsive evidence exists
  }

  if ((inputs >= 3 || tabs >= 2 || modals >= 1) && nav >= 1) {
    return cards >= 3 ? 'hybrid-app-marketing' : 'application';
  }

  if (cards >= 3 && nav >= 1 && inputs <= 2) {
    return 'marketing';
  }

  return 'hybrid';
}

export function inferPageArchitecture(raw) {
  const explicit = ensureObject(layoutSource(raw).pageArchitecture);
  if (Object.keys(explicit).length) {
    return {
      surfaceType: explicit.surfaceType ?? inferPrimaryLayoutType(raw),
      heroPattern: explicit.heroPattern ?? 'unknown',
      navPlacement: explicit.navPlacement ?? (explicit.hasHeader ? 'top-navigation' : 'unknown'),
      footerDensity: explicit.footerDensity ?? (explicit.hasFooter ? 'moderate' : 'unknown'),
      viewportLabel: explicit.viewportLabel,
      sectionCount: explicit.sectionCount,
      documentHeight: explicit.documentHeight,
    };
  }

  const components = ensureObject(raw.components);
  const layoutType = inferPrimaryLayoutType(raw);
  return {
    surfaceType: layoutType,
    heroPattern: ensureArray(components.buttons).length >= 2 ? 'headline-plus-cta' : 'headline-led',
    navPlacement: ensureArray(components.navigation).length ? 'top-navigation' : 'minimal-or-embedded-navigation',
    footerDensity: ensureArray(components.cards).length >= 6 ? 'dense' : 'moderate',
  };
}

export function inferContainers(raw) {
  const explicit = ensureArray(layoutSource(raw).containers);
  if (explicit.length) {
    return explicit.map((item, index) => ({
      name: item?.name ?? `container-${index + 1}`,
      maxWidth: item?.maxWidth ?? item?.width ?? 'unknown',
      paddingInline: item?.paddingInline ?? 'unknown',
      usage: item?.centered ? 'Centered container captured from rendered layout.' : 'Container captured from rendered layout.',
    }));
  }

  const spacing = pickStrings(raw.spacing, 12);
  const likelyPadding = spacing.filter((value) => {
    const numeric = parseNumericPx(value);
    return numeric !== null && numeric >= 16 && numeric <= 64;
  }).slice(0, 4);

  return [{
    name: 'primary-content',
    maxWidth: 'unknown',
    paddingInline: likelyPadding.join(' / ') || 'unknown',
    usage: 'Primary content wrapper inferred from spacing scale; explicit widths not yet captured by the extractor.',
  }];
}

export function inferGrids(raw) {
  const explicit = ensureArray(layoutSource(raw).grids);
  if (explicit.length) {
    return explicit.map((item, index) => ({
      name: item?.name ?? `grid-${index + 1}`,
      columns: typeof item?.columns === 'number' ? String(item.columns) : item?.columns ?? item?.gridTemplateColumns ?? 'unknown',
      gap: item?.gap ?? item?.columnGap ?? item?.rowGap ?? 'unknown',
      usage: item?.display === 'grid' ? 'Grid captured from rendered layout.' : 'Flexible repeated layout captured from rendered layout.',
    }));
  }

  const cards = ensureArray(raw?.components?.cards).length;
  if (cards >= 6) {
    return [{
      name: 'feature-grid',
      columns: '2-3 columns inferred from repeated card surfaces',
      gap: pickStrings(raw.spacing, 6).filter((value) => {
        const numeric = parseNumericPx(value);
        return numeric !== null && numeric >= 12 && numeric <= 40;
      }).slice(0, 3).join(' / ') || 'unknown',
      usage: 'Marketing or overview card grid inferred from repeated card samples.',
    }];
  }

  return [];
}

export function inferSectionRhythm(raw) {
  const explicit = ensureObject(layoutSource(raw).sectionRhythm);
  if (Object.keys(explicit).length) {
    const internal = ensureArray(explicit.internalPaddingY);
    const mediumSpacing = internal.length ? internal : pickStrings(raw.spacing, 12).filter((value) => {
      const numeric = parseNumericPx(value);
      return numeric !== null && numeric >= 12 && numeric <= 48;
    });

    return {
      sectionGapY: pickStrings(explicit.sectionGapY, 8),
      headingToBody: mediumSpacing.slice(0, 4),
      bodyToCta: mediumSpacing.slice(0, 4),
      cardGap: mediumSpacing.slice(0, 4),
      internalPaddingY: internal.slice(0, 8),
      stickyElements: ensureArray(explicit.stickyElements).slice(0, 10),
    };
  }

  const spacing = pickStrings(raw.spacing, 24);
  const mediumSpacing = spacing.filter((value) => {
    const numeric = parseNumericPx(value);
    return numeric !== null && numeric >= 12 && numeric <= 48;
  });
  const largeSpacing = spacing.filter((value) => {
    const numeric = parseNumericPx(value);
    return numeric !== null && numeric >= 48;
  });

  return {
    sectionGapY: largeSpacing.slice(0, 5),
    headingToBody: mediumSpacing.slice(0, 4),
    bodyToCta: mediumSpacing.slice(0, 4),
    cardGap: mediumSpacing.slice(0, 4),
  };
}

export function inferReadingWidths(raw) {
  const explicit = ensureArray(layoutSource(raw).readingWidths);
  if (explicit.length) {
    return explicit.map((item) => {
      if (typeof item === 'string') return item;
      return item?.width || 'unknown';
    }).slice(0, 12);
  }

  const fontSizes = ensureArray(raw?.typography?.hierarchy).map((item) => item?.fontSize).filter(Boolean);
  if (!fontSizes.length) return ['unknown'];
  return ['approx. 60-75ch target reading width inferred; explicit text-block widths not yet captured'];
}

export function inferPlacementRules(raw) {
  const layoutType = inferPrimaryLayoutType(raw);
  const rules = [];
  const grids = ensureArray(layoutSource(raw).grids);
  const sections = ensureArray(layoutSource(raw).sections);
  const touchTargets = ensureObject(layoutSource(raw).touchTargets);

  if (layoutType === 'marketing' || layoutType === 'hybrid-app-marketing') {
    rules.push('Primary CTA should remain above the fold and adjacent to the hero heading or subcopy.');
    rules.push('Repeated card sections should preserve consistent horizontal and vertical rhythm rather than freeform stacking.');
  }

  if (layoutType === 'application' || layoutType === 'hybrid-app-marketing') {
    rules.push('Navigation and high-frequency actions should remain visually anchored near the top edge.');
  }

  if (grids.length) {
    rules.push('Detected grid and flex regions should preserve their captured structure before introducing new layout patterns.');
  }

  if (sections.length >= 3) {
    rules.push('Section rhythm should follow the repeated rendered spacing cadence rather than equalizing all vertical gaps.');
  }

  if (typeof touchTargets.tooSmallCount === 'number' && touchTargets.tooSmallCount > 0) {
    rules.push('Interactive targets should be checked against touch sizing rules before reusing the captured dimensions on mobile.');
  }

  rules.push('Desktop and mobile layouts should not reuse the same visual density without spacing compression.');
  return uniq(rules);
}

export function inferPagePatterns(raw) {
  const patterns = [];
  const components = ensureObject(raw.components);
  const grids = ensureArray(layoutSource(raw).grids);

  if (ensureArray(components.navigation).length) {
    patterns.push({
      name: 'header-navigation',
      structure: 'top navigation bar with primary actions aligned to the right',
      usage: 'Primary site-level navigation',
    });
  }

  if (ensureArray(components.buttons).length >= 2) {
    patterns.push({
      name: 'hero-cta',
      structure: 'headline-led block with one or more CTA actions',
      usage: 'Landing-page hero or feature lead',
    });
  }

  if (ensureArray(components.cards).length >= 3 || grids.length) {
    patterns.push({
      name: 'feature-grid',
      structure: grids.length ? 'repeated grid or flex layout captured from rendered structure' : 'repeated card surfaces arranged in a grid or list',
      usage: 'Feature overview, catalog, dashboard, or pricing summary',
    });
  }

  return patterns;
}

export function parseBreakpoints(mediaQueries) {
  const queries = ensureArray(mediaQueries);
  const points = [];

  for (const entry of queries) {
    const query = typeof entry === 'string' ? entry : (entry?.query || entry?.name);
    if (!query) continue;
    const min = query.match(/min-width:\s*(\d+)px/i);
    const max = query.match(/max-width:\s*(\d+)px/i);
    points.push({
      name: query,
      minWidth: typeof entry?.minWidth === 'number' ? entry.minWidth : (min ? Number(min[1]) : undefined),
      maxWidth: typeof entry?.maxWidth === 'number' ? entry.maxWidth : (max ? Number(max[1]) : undefined),
      notes: typeof entry?.notes === 'string' ? entry.notes : 'Parsed from CSS media query text.',
    });
  }

  return points.slice(0, 20);
}

export function inferResponsiveSnapshots(raw) {
  const explicit = ensureArray(responsiveSource(raw).viewportSnapshots);
  if (explicit.length) {
    return explicit.slice(0, 12);
  }

  const breakpoints = parseBreakpoints(raw.mediaQueries);
  if (!breakpoints.length) return [];

  return [{
    viewport: 'responsive-system',
    navBehavior: ensureArray(raw?.components?.navigation).length ? 'Navigation changes are likely controlled by media queries; explicit viewport snapshots not yet captured.' : 'No navigation sample captured.',
    heroBehavior: ensureArray(raw?.components?.buttons).length >= 2 ? 'Hero CTA grouping likely compresses or stacks under smaller widths.' : 'Hero behavior unknown.',
    gridBehavior: ensureArray(raw?.components?.cards).length >= 3 ? 'Card grids likely collapse across breakpoints; exact columns should be verified by viewport capture.' : 'No repeated card grid detected.',
    spacingCompression: 'Spacing should compress on smaller screens; explicit measurements not yet captured by the extractor.',
    notes: breakpoints.map((entry) => entry.name).slice(0, 5),
  }];
}

export function inferCollapseRules(raw) {
  const explicit = pickStrings(responsiveSource(raw).collapseRules, 12);
  if (explicit.length) return explicit;

  const rules = [];
  if (ensureArray(raw?.components?.cards).length >= 3) {
    rules.push('Repeated multi-column card regions should collapse progressively rather than preserving desktop column count.');
  }
  if (ensureArray(raw?.components?.navigation).length) {
    rules.push('Navigation should simplify at narrow widths and avoid desktop-density link rows on mobile.');
  }
  rules.push('Section spacing and text widths should compress for mobile rather than scaling proportionally from desktop.');
  return rules;
}

export function signatureFromSample(sample) {
  return {
    bg: sample?.bg ?? 'transparent',
    color: sample?.color ?? 'inherit',
    border: sample?.border ?? 'none',
    borderRadius: sample?.borderRadius ?? '0px',
    boxShadow: sample?.boxShadow ?? 'none',
    fontSize: sample?.fontSize ?? 'unknown',
    fontWeight: sample?.fontWeight ?? 'unknown',
  };
}

export function variantName(family, signature, sample) {
  if (family === 'buttons') {
    if (sample?.opacity && Number(sample.opacity) < 1) return 'muted';
    if (signature.bg !== 'transparent' && signature.bg !== '#000000@0' && !/rgba\(0,\s*0,\s*0,\s*0\)/i.test(signature.bg)) return 'primary';
    if (signature.border !== 'none') return 'secondary';
    return 'ghost';
  }

  if (family === 'inputs') return 'standard-input';
  if (family === 'navigation') return 'primary-navigation';
  if (family === 'cards') return signature.boxShadow !== 'none' ? 'elevated-card' : 'flat-card';
  return `${family}-variant`;
}

export function clusterComponentFamily(family, samples) {
  const grouped = new Map();

  for (const sample of ensureArray(samples)) {
    const signature = signatureFromSample(sample);
    const key = JSON.stringify(signature);
    if (!grouped.has(key)) {
      grouped.set(key, {
        name: variantName(family, signature, sample),
        count: 0,
        signature,
        states: {},
        samples: [],
      });
    }

    const variant = grouped.get(key);
    variant.count += 1;
    if (variant.samples.length < 4) {
      variant.samples.push(sample);
    }
  }

  return {
    variants: [...grouped.values()].sort((left, right) => right.count - left.count),
  };
}

function normalizeExistingVariantGroups(rawVariants) {
  return {
    variants: ensureArray(rawVariants).map((variant, index) => ({
      name: variant?.name ?? `variant-${index + 1}`,
      count: typeof variant?.count === 'number' ? variant.count : ensureArray(variant?.samples).length,
      signature: ensureObject(variant?.signature),
      states: ensureObject(variant?.states),
      samples: ensureArray(variant?.samples).slice(0, 4),
    })),
  };
}

function normalizeComponentSystem(raw) {
  const variants = componentVariantSource(raw);
  const componentSource = ensureObject(raw.components);

  function family(name) {
    if (ensureArray(variants[name]).length) {
      return normalizeExistingVariantGroups(variants[name]);
    }
    return clusterComponentFamily(name, componentSource[name]);
  }

  return {
    buttons: family('buttons'),
    cards: family('cards'),
    inputs: family('inputs'),
    navigation: family('navigation'),
    badges: family('badges'),
    modals: family('modals'),
    dropdowns: family('dropdowns'),
    tabs: family('tabs'),
  };
}

export function extractDecorativeEffects(raw) {
  const effects = [];
  const explicitEffects = effectSource(raw);

  for (const value of pickStrings(explicitEffects.backgroundImages, 10)) {
    effects.push({
      type: 'background-image',
      value,
      usage: 'Background image captured from rendered styles.',
    });
  }

  for (const value of pickStrings(explicitEffects.filters, 10)) {
    effects.push({
      type: 'filter',
      value,
      usage: 'Filter effect captured from rendered styles.',
    });
  }

  for (const value of pickStrings(explicitEffects.backdropFilters, 10)) {
    effects.push({
      type: 'backdrop-filter',
      value,
      usage: 'Backdrop filter captured from rendered styles.',
    });
  }

  for (const value of pickStrings(explicitEffects.textShadows, 10)) {
    effects.push({
      type: 'text-shadow',
      value,
      usage: 'Text shadow captured from rendered styles.',
    });
  }

  for (const value of pickStrings(explicitEffects.outlines, 10)) {
    effects.push({
      type: 'outline',
      value,
      usage: 'Outline captured from rendered styles.',
    });
  }

  for (const value of pickStrings(explicitEffects.transforms, 10)) {
    effects.push({
      type: 'transform',
      value,
      usage: 'Transform captured from rendered styles.',
    });
  }

  for (const transition of pickStrings(raw.transitions, 10)) {
    effects.push({
      type: 'transition',
      value: transition,
      usage: 'Transition extracted from computed styles.',
    });
  }

  for (const keyframe of pickStrings(raw.keyframes, 8)) {
    effects.push({
      type: 'animation',
      value: keyframe,
      usage: 'Named keyframe discovered in stylesheet rules.',
    });
  }

  return effects.slice(0, 30);
}

function normalizeLayoutSystem(raw) {
  return {
    pageArchitecture: inferPageArchitecture(raw),
    containers: inferContainers(raw),
    grids: inferGrids(raw),
    sectionRhythm: inferSectionRhythm(raw),
    readingWidths: inferReadingWidths(raw),
    placementRules: inferPlacementRules(raw),
    pagePatterns: inferPagePatterns(raw),
  };
}

function normalizeResponsiveSystem(raw) {
  const explicit = responsiveSource(raw);
  return {
    breakpoints: parseBreakpoints(explicit.breakpoints || raw?.mediaQueries),
    viewportSnapshots: inferResponsiveSnapshots(raw),
    collapseRules: inferCollapseRules(raw),
    viewport: ensureObject(explicit.viewport),
    activeMediaQueries: pickStrings(explicit.activeMediaQueries, 12),
    notes: pickStrings(explicit.notes, 10),
  };
}

export function normalizeRawExtraction(raw) {
  const metaNotes = ensureArray(raw.notes).slice();
  metaNotes.push('Normalized into the Frontend Distill extraction bundle schema.');

  const layoutSystem = normalizeLayoutSystem(raw);
  const responsiveSystem = normalizeResponsiveSystem(raw);

  const bundle = {
    meta: {
      version: raw?._meta?.scriptVersion ?? 'unknown',
      url: raw?._meta?.url ?? '',
      title: raw?._meta?.title ?? '',
      extractedAt: raw?._meta?.extractedAt ?? new Date().toISOString(),
      viewport: normalizeViewport(raw),
      notes: uniq(metaNotes),
    },
    summary: {
      dominantColors: asColorList(raw?.colors?.dominant).map((item) => item.hex).slice(0, 8),
      fontFamilies: pickStrings(raw?.typography?.fonts, 8),
      primaryLayoutType: inferPrimaryLayoutType(raw),
      contentDensity: inferContentDensity(raw?.spacing),
      breakpointProfiles: parseBreakpoints(responsiveSystem.breakpoints).map((item) => item.name).slice(0, 6),
      componentVariantCounts: ensureObject(raw?.summary?.componentVariantCounts),
      layoutEvidence: ensureObject(raw?.summary?.layoutEvidence),
      responsiveEvidence: ensureObject(raw?.summary?.responsiveEvidence),
      effects: ensureObject(raw?.summary?.effects),
    },
    visualTokens: {
      colors: {
        text: asColorList(raw?.colors?.text),
        background: asColorList(raw?.colors?.background),
        border: asColorList(raw?.colors?.border),
        dominant: asColorList(raw?.colors?.dominant),
      },
      typography: {
        fonts: pickStrings(raw?.typography?.fonts),
        hierarchy: ensureArray(raw?.typography?.hierarchy).map((item) => ({
          role: item?.role ?? 'body',
          fontFamily: item?.fontFamily ?? '',
          fontSize: item?.fontSize ?? '',
          fontWeight: item?.fontWeight ?? '',
          lineHeight: item?.lineHeight ?? '',
          letterSpacing: item?.letterSpacing ?? '',
          textTransform: item?.textTransform,
          fontFeatureSettings: item?.fontFeatureSettings,
        })),
      },
      spacingScale: pickStrings(raw?.spacing),
      radiusScale: pickStrings(raw?.borderRadius),
      shadows: pickStrings(raw?.shadows),
      borders: pickStrings(raw?.borders),
      decorativeEffects: extractDecorativeEffects(raw),
    },
    componentSystem: normalizeComponentSystem(raw),
    layoutSystem,
    responsiveSystem,
    evidence: {
      cssVariables: {
        root: ensureObject(raw?.cssVariables?.root),
        rootResolved: ensureObject(raw?.cssVariables?.rootResolved),
        scoped: ensureObject(raw?.cssVariables?.scoped),
      },
      pseudoStates: ensureArray(raw?.pseudoStates),
      mediaQueries: pickStrings(raw?.mediaQueries),
      keyframes: pickStrings(raw?.keyframes),
      rawLayout: ensureObject(raw?.layout),
      rawResponsive: ensureObject(raw?.responsive),
    },
  };

  return bundle;
}

export function splitBundle(bundle) {
  return {
    designTokens: {
      meta: bundle.meta,
      summary: {
        dominantColors: bundle.summary?.dominantColors ?? [],
        fontFamilies: bundle.summary?.fontFamilies ?? [],
        effects: bundle.summary?.effects ?? {},
      },
      visualTokens: bundle.visualTokens,
      componentSystem: bundle.componentSystem,
    },
    layoutTokens: {
      meta: bundle.meta,
      summary: {
        primaryLayoutType: bundle.summary?.primaryLayoutType ?? '',
        contentDensity: bundle.summary?.contentDensity ?? '',
        breakpointProfiles: bundle.summary?.breakpointProfiles ?? [],
        layoutEvidence: bundle.summary?.layoutEvidence ?? {},
        responsiveEvidence: bundle.summary?.responsiveEvidence ?? {},
      },
      layoutSystem: bundle.layoutSystem,
      responsiveSystem: bundle.responsiveSystem,
    },
  };
}
