/**
 * Frontend Distill design token extractor
 *
 * Usage:
 *   1. Open the target website in a browser.
 *   2. Scroll through the page so lazy-loaded sections enter the DOM.
 *   3. Open DevTools -> Console.
 *   4. Paste this full script and run it.
 *   5. Copy the emitted JSON together with screenshots into your AI workflow.
 *
 * The payload is optimized for low token cost:
 *   - summary-first structure
 *   - resolved CSS variables
 *   - representative component samples
 *   - payload shrinking when the JSON grows too large
 */

(function frontendDistill() {
  const VERSION = '3.0.0';
  const MAX_JSON_SIZE = 80000;
  const MAX_VISIBLE_SCAN = 3000;

  function cleanText(value, limit) {
    return (value || '').replace(/\s+/g, ' ').trim().slice(0, limit || 80);
  }

  function numeric(value) {
    if (typeof value !== 'string') return null;
    const match = value.match(/-?\d+(\.\d+)?/);
    return match ? Number(match[0]) : null;
  }

  function classifyViewport(width) {
    if (width < 640) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  }

  function rgbToHex(input) {
    if (!input) return input;
    const match = input.match(/rgba?\(\s*(\d+),\s*(\d+),\s*(\d+)/i);
    if (!match) return input.trim();
    const hex = '#' + [match[1], match[2], match[3]]
      .map((part) => Number(part).toString(16).padStart(2, '0'))
      .join('');
    const alpha = input.match(/rgba\([^,]+,[^,]+,[^,]+,\s*([\d.]+)\s*\)/i);
    return alpha ? `${hex}@${alpha[1]}` : hex;
  }

  function normalizeColorToken(value) {
    if (!value) return '';
    return value.trim().toLowerCase();
  }

  function resolveCssValue(value, lookup, depth) {
    if (!value || depth > 5 || typeof value !== 'string') return value;
    return value.replace(/var\((--[\w-]+)(?:,\s*([^)]+))?\)/g, function (_match, token, fallback) {
      const resolved = lookup[token];
      if (resolved) return resolveCssValue(resolved, lookup, depth + 1);
      return fallback ? fallback.trim() : _match;
    });
  }

  function hexToRgb(hex) {
    const normalized = hex.replace('#', '').replace(/@.*/, '');
    if (normalized.length !== 6) return null;
    return {
      r: parseInt(normalized.slice(0, 2), 16),
      g: parseInt(normalized.slice(2, 4), 16),
      b: parseInt(normalized.slice(4, 6), 16),
    };
  }

  function colorDistance(a, b) {
    const ca = hexToRgb(a);
    const cb = hexToRgb(b);
    if (!ca || !cb) return Number.POSITIVE_INFINITY;
    const dr = ca.r - cb.r;
    const dg = ca.g - cb.g;
    const db = ca.b - cb.b;
    return Math.sqrt(dr * dr + dg * dg + db * db);
  }

  function dedupeColors(colorMap, threshold) {
    const ranked = Array.from(colorMap.entries())
      .sort((left, right) => right[1] - left[1]);
    const kept = [];

    for (const [hex, count] of ranked) {
      if (!hex || hex === 'transparent') continue;
      if (kept.every((entry) => colorDistance(entry.hex, hex) > threshold)) {
        kept.push({ hex, count });
      }
    }

    return kept;
  }

  function safePushUnique(list, value, limit) {
    if (!value || list.includes(value) || list.length >= limit) return;
    list.push(value);
  }

  function sortByNumericValue(values) {
    return values.sort(function (left, right) {
      return parseFloat(left) - parseFloat(right);
    });
  }

  function isTransparent(value) {
    return !value || value === 'transparent' || value === 'rgba(0, 0, 0, 0)' || value === '#000000@0';
  }

  function selectorSummary(el) {
    const parts = [el.tagName.toLowerCase()];
    if (typeof el.id === 'string' && el.id.trim()) parts.push(`#${el.id.trim().slice(0, 40)}`);
    if (typeof el.className === 'string' && el.className.trim()) {
      const firstClass = el.className.trim().split(/\s+/).slice(0, 2).join('.');
      if (firstClass) parts.push(`.${firstClass.slice(0, 60)}`);
    }
    return parts.join('');
  }

  function isVisible(el, cs, rect) {
    if (!el || !cs || !rect) return false;
    if (cs.display === 'none' || cs.visibility === 'hidden' || Number(cs.opacity) === 0) return false;
    if (rect.width < 2 || rect.height < 2) return false;
    return true;
  }

  function clusterBySignature(samples, family) {
    const groups = new Map();

    function variantName(signature, sample) {
      if (family === 'buttons') {
        if (sample.disabled || sample.ariaDisabled || Number(sample.opacity || '1') < 0.8) return 'disabled-or-muted';
        if (!isTransparent(signature.background)) return 'primary-or-filled';
        if (signature.border !== 'none') return 'secondary-or-outlined';
        return 'ghost-or-text';
      }
      if (family === 'cards') return signature.boxShadow !== 'none' ? 'elevated-card' : 'flat-card';
      if (family === 'inputs') return 'field';
      if (family === 'navigation') return 'top-navigation';
      if (family === 'badges') return !isTransparent(signature.background) ? 'filled-badge' : 'text-badge';
      return `${family}-variant`;
    }

    for (const sample of samples) {
      const signature = {
        background: sample.bg || 'transparent',
        color: sample.color || 'inherit',
        border: sample.border || 'none',
        borderRadius: sample.borderRadius || '0px',
        boxShadow: sample.boxShadow || 'none',
        fontSize: sample.fontSize || 'unknown',
        fontWeight: sample.fontWeight || 'unknown',
        padding: sample.padding || '0px',
      };
      const key = JSON.stringify(signature);
      if (!groups.has(key)) {
        groups.set(key, {
          name: variantName(signature, sample),
          signature,
          count: 0,
          samples: [],
        });
      }
      const group = groups.get(key);
      group.count += 1;
      if (group.samples.length < 4) group.samples.push(sample);
    }

    return Array.from(groups.values()).sort(function (left, right) {
      return right.count - left.count;
    });
  }

  function collectTouchTargets(samples) {
    const interactiveTargets = samples.map(function (sample) {
      const width = numeric(sample.width);
      const height = numeric(sample.height);
      return {
        selector: sample.selector,
        tag: sample.tag,
        width: sample.width,
        height: sample.height,
        tooSmall: width !== null && height !== null ? width < 44 || height < 44 : undefined,
      };
    }).filter(function (sample) {
      return sample.width && sample.height;
    }).slice(0, 20);

    return {
      interactiveTargets,
      tooSmallCount: interactiveTargets.filter(function (item) { return item.tooSmall; }).length,
    };
  }

  function collectResponsiveEvidence(mediaQueries, viewport, grids) {
    const breakpoints = mediaQueries.map(function (query) {
      const min = query.match(/min-width:\s*(\d+)px/i);
      const max = query.match(/max-width:\s*(\d+)px/i);
      return {
        query,
        minWidth: min ? Number(min[1]) : undefined,
        maxWidth: max ? Number(max[1]) : undefined,
        active: window.matchMedia(query).matches,
      };
    }).slice(0, 24);

    return {
      viewport: {
        width: viewport.width,
        height: viewport.height,
        devicePixelRatio: window.devicePixelRatio || 1,
        label: classifyViewport(viewport.width),
      },
      breakpoints,
      activeMediaQueries: breakpoints.filter(function (item) { return item.active; }).map(function (item) { return item.query; }).slice(0, 12),
      currentGridStates: grids.slice(0, 10).map(function (grid) {
        return {
          selector: grid.selector,
          display: grid.display,
          columns: grid.columns,
          flexWrap: grid.flexWrap,
          childCount: grid.childCount,
        };
      }),
      notes: [
        'Responsive evidence combines current viewport observation with CSS media queries.',
        'For stronger mobile/tablet evidence, rerun extraction at additional viewport widths.',
      ],
    };
  }

  function extractComponent(el) {
    const cs = getComputedStyle(el);
    const rect = el.getBoundingClientRect();
    return {
      selector: selectorSummary(el),
      tag: el.tagName,
      text: cleanText(el.textContent, 80),
      classes: typeof el.className === 'string' ? el.className.slice(0, 120) : '',
      role: el.getAttribute('role') || undefined,
      bg: rgbToHex(cs.backgroundColor),
      color: rgbToHex(cs.color),
      fontFamily: cs.fontFamily,
      fontSize: cs.fontSize,
      fontWeight: cs.fontWeight,
      lineHeight: cs.lineHeight,
      padding: cs.padding,
      borderRadius: cs.borderRadius,
      border: cs.borderStyle !== 'none' ? `${cs.borderWidth} ${cs.borderStyle} ${rgbToHex(cs.borderColor)}` : 'none',
      boxShadow: cs.boxShadow !== 'none' ? cs.boxShadow : undefined,
      opacity: cs.opacity !== '1' ? cs.opacity : undefined,
      backdropFilter: cs.backdropFilter !== 'none' ? cs.backdropFilter : undefined,
      backgroundImage: cs.backgroundImage !== 'none' ? cs.backgroundImage : undefined,
      filter: cs.filter !== 'none' ? cs.filter : undefined,
      textShadow: cs.textShadow !== 'none' ? cs.textShadow : undefined,
      outline: cs.outlineStyle !== 'none' ? `${cs.outlineWidth} ${cs.outlineStyle} ${rgbToHex(cs.outlineColor)}` : undefined,
      transform: cs.transform !== 'none' ? cs.transform : undefined,
      cursor: cs.cursor !== 'auto' ? cs.cursor : undefined,
      width: `${Math.round(rect.width)}px`,
      height: `${Math.round(rect.height)}px`,
      disabled: typeof el.disabled === 'boolean' ? el.disabled : undefined,
      ariaDisabled: el.getAttribute('aria-disabled') || undefined,
    };
  }

  function estimateGridColumns(template) {
    if (!template || template === 'none') return undefined;
    const repeatMatch = template.match(/repeat\((\d+),/i);
    if (repeatMatch) return Number(repeatMatch[1]);
    let depth = 0;
    let count = 1;
    for (const char of template) {
      if (char === '(') depth += 1;
      if (char === ')') depth -= 1;
      if (char === ' ' && depth === 0) count += 1;
    }
    return count;
  }

  function collectLayoutEvidence(visibleElements, viewport) {
    const containers = [];
    const grids = [];
    const sections = [];
    const readingWidths = [];
    const stickyElements = [];

    const containerSeen = new Set();
    const gridSeen = new Set();
    const sectionSeen = new Set();
    const readingSeen = new Set();

    for (const item of visibleElements) {
      const el = item.el;
      const cs = item.cs;
      const rect = item.rect;
      const width = Math.round(rect.width);
      const height = Math.round(rect.height);
      const centered = Math.abs(rect.left - (viewport.width - rect.right)) <= 32;
      const textLength = cleanText(el.textContent, 1200).length;

      if ((cs.position === 'sticky' || cs.position === 'fixed') && stickyElements.length < 10) {
        stickyElements.push({
          selector: selectorSummary(el),
          tag: el.tagName,
          position: cs.position,
          top: cs.top,
          bottom: cs.bottom !== 'auto' ? cs.bottom : undefined,
          width: `${width}px`,
          height: `${height}px`,
          zIndex: cs.zIndex !== 'auto' ? cs.zIndex : undefined,
        });
      }

      if ((centered || (cs.maxWidth && cs.maxWidth !== 'none')) && width >= 240 && width <= viewport.width * 0.98 && height >= 24) {
        const key = `${cs.maxWidth}|${Math.round(width / 16) * 16}|${cs.paddingLeft}|${cs.paddingRight}`;
        if (!containerSeen.has(key) && containers.length < 14) {
          containerSeen.add(key);
          containers.push({
            selector: selectorSummary(el),
            tag: el.tagName,
            width: `${width}px`,
            maxWidth: cs.maxWidth !== 'none' ? cs.maxWidth : undefined,
            paddingInline: `${cs.paddingLeft} / ${cs.paddingRight}`,
            marginInline: `${cs.marginLeft} / ${cs.marginRight}`,
            centered,
          });
        }
      }

      if ((cs.display === 'grid' || cs.display === 'flex') && el.children.length >= 2 && width >= 220 && height >= 24) {
        const key = [cs.display, cs.gridTemplateColumns, cs.flexDirection, cs.flexWrap, cs.gap, el.children.length].join('|');
        if (!gridSeen.has(key) && grids.length < 16) {
          gridSeen.add(key);
          grids.push({
            selector: selectorSummary(el),
            tag: el.tagName,
            display: cs.display,
            columns: cs.display === 'grid' ? estimateGridColumns(cs.gridTemplateColumns) : undefined,
            gridTemplateColumns: cs.display === 'grid' && cs.gridTemplateColumns !== 'none' ? cs.gridTemplateColumns : undefined,
            gap: cs.gap !== 'normal' ? cs.gap : undefined,
            columnGap: cs.columnGap !== 'normal' ? cs.columnGap : undefined,
            rowGap: cs.rowGap !== 'normal' ? cs.rowGap : undefined,
            flexDirection: cs.display === 'flex' ? cs.flexDirection : undefined,
            flexWrap: cs.display === 'flex' ? cs.flexWrap : undefined,
            childCount: el.children.length,
            width: `${width}px`,
          });
        }
      }

      const isSectionLike = ['SECTION', 'MAIN', 'HEADER', 'FOOTER', 'ARTICLE', 'ASIDE'].includes(el.tagName) ||
        (el.parentElement && (el.parentElement.tagName === 'MAIN' || el.parentElement === document.body));
      if (isSectionLike && width >= viewport.width * 0.45 && height >= 80) {
        const key = `${Math.round(rect.top)}|${Math.round(width)}|${el.tagName}`;
        if (!sectionSeen.has(key) && sections.length < 18) {
          sectionSeen.add(key);
          sections.push({
            selector: selectorSummary(el),
            tag: el.tagName,
            width: `${width}px`,
            minHeight: `${height}px`,
            paddingTop: cs.paddingTop,
            paddingBottom: cs.paddingBottom,
            marginTop: cs.marginTop,
            marginBottom: cs.marginBottom,
            background: !isTransparent(normalizeColorToken(rgbToHex(cs.backgroundColor))) ? rgbToHex(cs.backgroundColor) : undefined,
            childCount: el.children.length,
            top: `${Math.round(rect.top + window.scrollY)}px`,
          });
        }
      }

      if (textLength >= 80 && width >= 220 && width <= Math.min(900, viewport.width * 0.95)) {
        const key = `${Math.round(width / 8) * 8}`;
        if (!readingSeen.has(key) && readingWidths.length < 12) {
          readingSeen.add(key);
          readingWidths.push({
            selector: selectorSummary(el),
            tag: el.tagName,
            width: `${width}px`,
            textLength,
          });
        }
      }
    }

    sections.sort(function (left, right) {
      return numeric(left.top) - numeric(right.top);
    });

    return {
      pageArchitecture: {
        viewportLabel: classifyViewport(viewport.width),
        documentHeight: `${Math.round(Math.max(document.documentElement.scrollHeight, document.body.scrollHeight || 0))}px`,
        hasHeader: Boolean(document.querySelector('header')),
        hasMain: Boolean(document.querySelector('main')),
        hasFooter: Boolean(document.querySelector('footer')),
        sectionCount: sections.length,
      },
      containers,
      grids,
      sections,
      sectionRhythm: {
        sectionGapY: sections.map(function (section, index) {
          if (index === 0) return null;
          const prev = sections[index - 1];
          const gap = numeric(section.top) - (numeric(prev.top) + numeric(prev.minHeight));
          return gap > 0 ? `${Math.round(gap)}px` : null;
        }).filter(Boolean).slice(0, 12),
        internalPaddingY: Array.from(new Set(sections.flatMap(function (section) {
          return [section.paddingTop, section.paddingBottom];
        }).filter(function (value) {
          return value && value !== '0px';
        }))).slice(0, 12),
        stickyElements,
      },
      readingWidths,
      touchTargets: {},
    };
  }

  const result = {
    _meta: {
      scriptVersion: VERSION,
      url: location.href,
      title: document.title,
      extractedAt: new Date().toISOString(),
      userAgent: navigator.userAgent,
      viewport: {
        width: Math.round(window.innerWidth),
        height: Math.round(window.innerHeight),
        devicePixelRatio: window.devicePixelRatio || 1,
      },
    },
    summary: {},
    cssVariables: {
      root: {},
      rootResolved: {},
      scoped: {},
    },
    colors: {
      text: [],
      background: [],
      border: [],
      dominant: [],
    },
    typography: {
      fonts: [],
      hierarchy: [],
    },
    spacing: [],
    borderRadius: [],
    shadows: [],
    borders: [],
    transitions: [],
    zIndices: [],
    effects: {
      backgroundImages: [],
      filters: [],
      backdropFilters: [],
      textShadows: [],
      outlines: [],
      transforms: [],
    },
    components: {
      buttons: [],
      cards: [],
      inputs: [],
      navigation: [],
      badges: [],
      modals: [],
      dropdowns: [],
      tabs: [],
    },
    componentVariants: {
      buttons: [],
      cards: [],
      inputs: [],
      navigation: [],
      badges: [],
      modals: [],
      dropdowns: [],
      tabs: [],
    },
    layout: {
      pageArchitecture: {},
      containers: [],
      grids: [],
      sections: [],
      sectionRhythm: {},
      readingWidths: [],
      touchTargets: {},
    },
    responsive: {
      viewport: {},
      breakpoints: [],
      activeMediaQueries: [],
      currentGridStates: [],
      notes: [],
    },
    pseudoStates: [],
    mediaQueries: [],
    keyframes: [],
    notes: [],
  };

  let inaccessibleSheets = 0;

  for (const sheet of document.styleSheets) {
    try {
      for (const rule of sheet.cssRules) {
        if (!rule.style) continue;
        for (const prop of rule.style) {
          if (!prop.startsWith('--')) continue;
          const rawValue = rule.style.getPropertyValue(prop).trim();
          if (rule.selectorText && rule.selectorText.includes(':root')) {
            result.cssVariables.root[prop] = rawValue;
          } else if (Object.keys(result.cssVariables.scoped).length < 250) {
            result.cssVariables.scoped[`${rule.selectorText} -> ${prop}`] = rawValue;
          }
        }
      }
    } catch (_error) {
      inaccessibleSheets += 1;
    }
  }

  const rootLookup = result.cssVariables.root;
  Object.keys(rootLookup).forEach(function (token) {
    result.cssVariables.rootResolved[token] = resolveCssValue(rootLookup[token], rootLookup, 0);
  });

  for (const sheet of document.styleSheets) {
    try {
      for (const rule of sheet.cssRules) {
        if (rule instanceof CSSMediaRule) safePushUnique(result.mediaQueries, rule.conditionText || rule.media.mediaText, 120);
        if (rule instanceof CSSKeyframesRule) safePushUnique(result.keyframes, rule.name, 120);
      }
    } catch (_error) {}
  }

  const pseudoPatterns = [':hover', ':focus', ':active', ':focus-visible', ':focus-within', ':disabled', '::placeholder'];
  for (const sheet of document.styleSheets) {
    try {
      for (const rule of sheet.cssRules) {
        if (!rule.selectorText || !pseudoPatterns.some((pattern) => rule.selectorText.includes(pattern))) continue;
        const properties = {};
        for (const prop of rule.style) {
          properties[prop] = resolveCssValue(rule.style.getPropertyValue(prop).trim(), rootLookup, 0);
        }
        if (Object.keys(properties).length) {
          result.pseudoStates.push({ selector: rule.selectorText, properties });
        }
      }
    } catch (_error) {}
  }

  const textColors = new Map();
  const backgroundColors = new Map();
  const borderColors = new Map();
  const allColors = new Map();
  const fontMap = new Map();
  const spacingSet = new Set();
  const radiusSet = new Set();
  const shadowSet = new Set();
  const borderSet = new Set();
  const transitionSet = new Set();
  const zIndexSet = new Set();
  const visibleElements = [];
  const effectSets = {
    backgroundImages: new Set(),
    filters: new Set(),
    backdropFilters: new Set(),
    textShadows: new Set(),
    outlines: new Set(),
    transforms: new Set(),
  };

  const componentSelectors = {
    buttons: 'button, a[role="button"], [class*="btn"], [class*="button"], [class*="Button"], input[type="submit"]',
    cards: '[class*="card"], [class*="Card"], article, [class*="panel"], [class*="Panel"]',
    inputs: 'input[type="text"], input[type="email"], input[type="password"], input[type="search"], input[type="number"], textarea, select',
    navigation: 'nav, header, [class*="nav"], [class*="Nav"], [role="navigation"], [class*="header"], [class*="Header"]',
    badges: '[class*="badge"], [class*="Badge"], [class*="tag"], [class*="Tag"], [class*="pill"], [class*="chip"], [class*="Chip"]',
    modals: '[class*="modal"], [class*="Modal"], [class*="dialog"], [class*="Dialog"], [role="dialog"]',
    dropdowns: '[class*="dropdown"], [class*="Dropdown"], [class*="menu"], [class*="Menu"], [class*="popover"], [class*="Popover"]',
    tabs: '[class*="tab"], [class*="Tab"], [role="tab"], [role="tablist"]',
  };
  const componentLimits = {
    buttons: 12,
    cards: 10,
    inputs: 8,
    navigation: 4,
    badges: 8,
    modals: 4,
    dropdowns: 6,
    tabs: 6,
  };

  document.querySelectorAll('*').forEach(function (el) {
    const cs = getComputedStyle(el);
    const rect = el.getBoundingClientRect();

    if (visibleElements.length < MAX_VISIBLE_SCAN && isVisible(el, cs, rect)) {
      visibleElements.push({ el, cs, rect });
    }

    const textColor = normalizeColorToken(rgbToHex(cs.color));
    if (textColor && textColor !== '#000000@0') {
      textColors.set(textColor, (textColors.get(textColor) || 0) + 1);
      allColors.set(textColor, (allColors.get(textColor) || 0) + 1);
    }

    const backgroundColor = normalizeColorToken(rgbToHex(cs.backgroundColor));
    if (backgroundColor && backgroundColor !== 'rgba(0, 0, 0, 0)' && backgroundColor !== '#000000@0') {
      backgroundColors.set(backgroundColor, (backgroundColors.get(backgroundColor) || 0) + 1);
      allColors.set(backgroundColor, (allColors.get(backgroundColor) || 0) + 1);
    }

    const borderColor = normalizeColorToken(rgbToHex(cs.borderColor));
    if (borderColor && borderColor !== '#000000') {
      borderColors.set(borderColor, (borderColors.get(borderColor) || 0) + 1);
      allColors.set(borderColor, (allColors.get(borderColor) || 0) + 1);
    }

    const primaryFont = cs.fontFamily.split(',')[0].trim().replace(/['"]/g, '');
    const fontKey = `${cs.fontSize}|${cs.fontWeight}|${primaryFont}|${cs.lineHeight}|${cs.letterSpacing}`;
    if (!fontMap.has(fontKey)) {
      const role = parseFloat(cs.fontSize) >= 40 ? 'display'
        : parseFloat(cs.fontSize) >= 28 ? 'heading'
        : parseFloat(cs.fontSize) >= 20 ? 'subheading'
        : el.closest('nav,header,[role="navigation"]') ? 'navigation'
        : el.matches('button,[role="button"],input[type="submit"]') ? 'button'
        : el.matches('code,pre,kbd,samp') ? 'code'
        : el.matches('label') ? 'label'
        : 'body';

      fontMap.set(fontKey, {
        role,
        tag: el.tagName,
        sample: (el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 60),
        fontFamily: cs.fontFamily,
        fontSize: cs.fontSize,
        fontWeight: cs.fontWeight,
        lineHeight: cs.lineHeight,
        letterSpacing: cs.letterSpacing,
        textTransform: cs.textTransform !== 'none' ? cs.textTransform : undefined,
        fontFeatureSettings: cs.fontFeatureSettings !== 'normal' ? cs.fontFeatureSettings : undefined,
      });
    }

    ['paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft', 'marginTop', 'marginRight', 'marginBottom', 'marginLeft', 'gap', 'rowGap', 'columnGap']
      .forEach(function (prop) {
        const value = cs[prop];
        if (value && value !== '0px' && value !== 'normal' && value !== 'auto') spacingSet.add(value);
      });

    if (cs.borderRadius && cs.borderRadius !== '0px') radiusSet.add(cs.borderRadius);
    if (cs.boxShadow && cs.boxShadow !== 'none') shadowSet.add(cs.boxShadow);
    if (cs.borderStyle !== 'none' && cs.borderWidth !== '0px') {
      borderSet.add(`${cs.borderWidth} ${cs.borderStyle} ${normalizeColorToken(rgbToHex(cs.borderColor))}`);
    }
    if (cs.transition && !/0s\s+ease\s+0s/.test(cs.transition) && cs.transition !== 'none 0s ease 0s') {
      transitionSet.add(cs.transition);
    }
    if (cs.zIndex !== 'auto') zIndexSet.add(cs.zIndex);

    if (cs.backgroundImage && cs.backgroundImage !== 'none') effectSets.backgroundImages.add(cs.backgroundImage);
    if (cs.filter && cs.filter !== 'none') effectSets.filters.add(cs.filter);
    if (cs.backdropFilter && cs.backdropFilter !== 'none') effectSets.backdropFilters.add(cs.backdropFilter);
    if (cs.textShadow && cs.textShadow !== 'none') effectSets.textShadows.add(cs.textShadow);
    if (cs.outlineStyle && cs.outlineStyle !== 'none') effectSets.outlines.add(`${cs.outlineWidth} ${cs.outlineStyle} ${rgbToHex(cs.outlineColor)}`);
    if (cs.transform && cs.transform !== 'none') effectSets.transforms.add(cs.transform);
  });

  result.colors.text = dedupeColors(textColors, 18);
  result.colors.background = dedupeColors(backgroundColors, 18);
  result.colors.border = dedupeColors(borderColors, 18);
  result.colors.dominant = dedupeColors(allColors, 20).slice(0, 12);

  result.typography.fonts = Array.from(new Set(
    Array.from(fontMap.values()).map((entry) => entry.fontFamily.split(',')[0].trim().replace(/['"]/g, ''))
  ));
  result.typography.hierarchy = Array.from(fontMap.values())
    .sort(function (left, right) {
      return parseFloat(right.fontSize) - parseFloat(left.fontSize);
    })
    .slice(0, 40);

  result.spacing = sortByNumericValue(Array.from(spacingSet)).slice(0, 80);
  result.borderRadius = sortByNumericValue(Array.from(radiusSet)).slice(0, 40);
  result.shadows = Array.from(shadowSet).slice(0, 30);
  result.borders = Array.from(borderSet).slice(0, 30);
  result.transitions = Array.from(transitionSet).slice(0, 20);
  result.zIndices = Array.from(zIndexSet)
    .map((value) => Number(value))
    .filter((value) => !Number.isNaN(value))
    .sort((left, right) => left - right)
    .slice(0, 30);
  Object.keys(result.effects).forEach(function (key) {
    result.effects[key] = Array.from(effectSets[key]).slice(0, 20);
  });

  Object.keys(componentSelectors).forEach(function (type) {
    document.querySelectorAll(componentSelectors[type]).forEach(function (el) {
      if (result.components[type].length >= componentLimits[type]) return;
      const cs = getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      if (!isVisible(el, cs, rect)) return;
      result.components[type].push(extractComponent(el));
    });
  });

  Object.keys(result.components).forEach(function (type) {
    result.componentVariants[type] = clusterBySignature(result.components[type], type);
  });

  result.layout = collectLayoutEvidence(visibleElements, result._meta.viewport);
  result.layout.touchTargets = collectTouchTargets(
    []
      .concat(result.components.buttons)
      .concat(result.components.inputs)
      .concat(result.components.navigation)
      .slice(0, 30)
  );
  result.responsive = collectResponsiveEvidence(result.mediaQueries, result._meta.viewport, result.layout.grids);

  if (inaccessibleSheets > 0) {
    result.notes.push(`Skipped ${inaccessibleSheets} stylesheet(s) because the browser blocked cssRules access.`);
  }
  if (document.querySelectorAll('*').length > MAX_VISIBLE_SCAN) {
    result.notes.push(`Visible element scan capped at ${MAX_VISIBLE_SCAN} elements to control payload size.`);
  }

  result.summary = {
    dominantColors: result.colors.dominant.slice(0, 6).map((entry) => entry.hex),
    fontFamilies: result.typography.fonts.slice(0, 8),
    typographyLevels: result.typography.hierarchy.length,
    colorCount: {
      text: result.colors.text.length,
      background: result.colors.background.length,
      border: result.colors.border.length,
    },
    tokenCount: {
      rootVariables: Object.keys(result.cssVariables.root).length,
      resolvedRootVariables: Object.keys(result.cssVariables.rootResolved).length,
      scopedVariables: Object.keys(result.cssVariables.scoped).length,
    },
    componentCounts: Object.fromEntries(
      Object.entries(result.components).map(function ([name, items]) {
        return [name, items.length];
      })
    ),
    componentVariantCounts: Object.fromEntries(
      Object.entries(result.componentVariants).map(function ([name, items]) {
        return [name, items.length];
      })
    ),
    spacingValues: result.spacing.length,
    borderRadiusValues: result.borderRadius.length,
    shadowCount: result.shadows.length,
    mediaQueryCount: result.mediaQueries.length,
    pseudoStateCount: result.pseudoStates.length,
    layoutEvidence: {
      containers: result.layout.containers.length,
      grids: result.layout.grids.length,
      sections: result.layout.sections.length,
      readingWidths: result.layout.readingWidths.length,
      stickyElements: result.layout.sectionRhythm.stickyElements.length,
      touchTargetsTooSmall: result.layout.touchTargets.tooSmallCount,
    },
    responsiveEvidence: {
      viewportLabel: result.responsive.viewport.label,
      breakpoints: result.responsive.breakpoints.length,
      activeMediaQueries: result.responsive.activeMediaQueries.length,
      currentGridStates: result.responsive.currentGridStates.length,
    },
    effects: {
      backgroundImages: result.effects.backgroundImages.length,
      filters: result.effects.filters.length,
      backdropFilters: result.effects.backdropFilters.length,
      textShadows: result.effects.textShadows.length,
      outlines: result.effects.outlines.length,
      transforms: result.effects.transforms.length,
    },
    notes: result.notes,
  };

  function shrinkPayload() {
    let json = JSON.stringify(result);
    if (json.length <= MAX_JSON_SIZE) return json;

    result.pseudoStates = result.pseudoStates.slice(0, 40);
    json = JSON.stringify(result);
    if (json.length <= MAX_JSON_SIZE) return json;

    result.cssVariables.scoped = {};
    result.summary.tokenCount.scopedVariables = 0;
    json = JSON.stringify(result);
    if (json.length <= MAX_JSON_SIZE) return json;

    result.layout.sections = result.layout.sections.slice(0, 10);
    result.layout.readingWidths = result.layout.readingWidths.slice(0, 8);
    result.layout.containers = result.layout.containers.slice(0, 10);
    result.layout.grids = result.layout.grids.slice(0, 10);
    result.responsive.breakpoints = result.responsive.breakpoints.slice(0, 12);
    result.responsive.currentGridStates = result.responsive.currentGridStates.slice(0, 6);
    json = JSON.stringify(result);
    if (json.length <= MAX_JSON_SIZE) return json;

    result.transitions = result.transitions.slice(0, 12);
    result.borders = result.borders.slice(0, 18);
    Object.keys(result.effects).forEach(function (key) {
      result.effects[key] = result.effects[key].slice(0, 8);
    });
    json = JSON.stringify(result);
    if (json.length <= MAX_JSON_SIZE) return json;

    Object.keys(result.components).forEach(function (key) {
      result.components[key] = result.components[key].slice(0, Math.max(2, Math.ceil(result.components[key].length / 2)));
      result.componentVariants[key] = result.componentVariants[key].slice(0, 4).map(function (variant) {
        variant.samples = variant.samples.slice(0, 2);
        return variant;
      });
    });
    json = JSON.stringify(result);
    return json;
  }

  shrinkPayload();
  const output = JSON.stringify(result, null, 2);

  try {
    copy(output);
    console.log('%cCopied JSON to clipboard.', 'color:#15be53;font-size:16px;font-weight:bold');
  } catch (_error) {
    navigator.clipboard && navigator.clipboard.writeText(output).then(
      function () {
        console.log('%cCopied JSON to clipboard.', 'color:#15be53;font-size:16px;font-weight:bold');
      },
      function () {
        console.log('%cCould not copy automatically. Copy the JSON from the console output below.', 'color:#ea2261;font-size:14px');
      }
    );
  }

  console.log('%cFrontend Distill v' + VERSION, 'color:#533afd;font-size:16px;font-weight:bold');
  console.log('  Dominant colors: ' + result.summary.dominantColors.join(', '));
  console.log('  Font families: ' + result.summary.fontFamilies.join(', '));
  console.log('  Typography levels: ' + result.summary.typographyLevels);
  console.log('  Colors: text ' + result.summary.colorCount.text + ' / background ' + result.summary.colorCount.background + ' / border ' + result.summary.colorCount.border);
  console.log('  Layout evidence: containers ' + result.summary.layoutEvidence.containers + ', grids ' + result.summary.layoutEvidence.grids + ', sections ' + result.summary.layoutEvidence.sections);
  console.log('  Responsive evidence: viewport ' + result.summary.responsiveEvidence.viewportLabel + ', breakpoints ' + result.summary.responsiveEvidence.breakpoints + ', active media queries ' + result.summary.responsiveEvidence.activeMediaQueries);
  console.log('  Component variants: ' + Object.entries(result.summary.componentVariantCounts).map(function ([name, count]) { return name + ':' + count; }).join(' '));
  console.log('  Output size: ' + (output.length / 1024).toFixed(1) + 'KB');
  if (result.notes.length) console.log('  Notes: ' + result.notes.join(' | '));
  console.log('%cFull JSON below', 'color:#533afd;font-size:14px;font-weight:bold');
  console.log(output);

  return result;
})();
