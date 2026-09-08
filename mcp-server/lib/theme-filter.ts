/** Extract CSS custom properties from design-spec text and filter theme CSS. */

const VAR_REF_RE = /var\(\s*(--[A-Za-z0-9_-]+)/g;
const BARE_CUSTOM_PROP_RE = /(--[A-Za-z0-9_-]+)/g;
const DECL_RE = /^\s*(--[A-Za-z0-9_-]+)\s*:/;

/** Collect custom property names referenced in markdown/CSS text. */
export function extractCssVarNames(text: string): Set<string> {
  const names = new Set<string>();
  for (const match of text.matchAll(VAR_REF_RE)) {
    names.add(match[1]);
  }
  for (const match of text.matchAll(BARE_CUSTOM_PROP_RE)) {
    // Prefer names that look like design tokens (skip lone -- in prose noise when short)
    if (match[1].length > 3) {
      names.add(match[1]);
    }
  }
  return names;
}

function collectDeclarations(css: string): Map<string, string> {
  const map = new Map<string, string>();
  for (const line of css.split(/\r?\n/)) {
    const m = DECL_RE.exec(line);
    if (!m) {
      continue;
    }
    map.set(m[1], line);
  }
  return map;
}

/**
 * Expand token set by following var(--...) chains inside theme declarations (bounded).
 */
export function expandTokenClosure(
  seed: Set<string>,
  themeCss: string,
  maxDepth = 4,
): Set<string> {
  const decls = collectDeclarations(themeCss);
  const result = new Set(seed);

  for (let depth = 0; depth < maxDepth; depth++) {
    let added = 0;
    for (const name of [...result]) {
      const line = decls.get(name);
      if (!line) {
        continue;
      }
      for (const match of line.matchAll(VAR_REF_RE)) {
        if (!result.has(match[1])) {
          result.add(match[1]);
          added++;
        }
      }
    }
    if (added === 0) {
      break;
    }
  }

  return result;
}

export interface ThemeFilterResult {
  css: string;
  referencedTokens: string[];
  includedTokens: string[];
  missingTokens: string[];
}

/**
 * Return theme CSS lines that define tokens in `needed` (after closure expansion).
 * Missing = needed names with no declaration in the theme file.
 */
export function filterThemeCssForTokens(themeCss: string, needed: Set<string>): ThemeFilterResult {
  const closure = expandTokenClosure(needed, themeCss);
  const decls = collectDeclarations(themeCss);
  const included: string[] = [];
  const lines: string[] = [
    "/* Filtered theme CSS — only custom properties referenced by the component design-spec (plus alias chain). */",
    "/* Apply full programme theme in the host app; this slice is for generation grounding. */",
    "",
  ];

  const sorted = [...closure].sort((a, b) => a.localeCompare(b));
  for (const name of sorted) {
    const line = decls.get(name);
    if (line) {
      included.push(name);
      lines.push(line.trimEnd());
    }
  }

  const missing = [...needed].filter((name) => !decls.has(name)).sort((a, b) => a.localeCompare(b));

  return {
    css: lines.join("\n"),
    referencedTokens: [...needed].sort((a, b) => a.localeCompare(b)),
    includedTokens: included,
    missingTokens: missing,
  };
}

/** Tokens that look like component layout aliases (must resolve in theme). */
export function findUnresolvedComponentAliases(
  referenced: string[],
  missing: string[],
): string[] {
  // Fail closed on missing aliases commonly required for pixel layout (component- or control-scoped).
  return missing.filter(
    (name) =>
      /-(control|focus|ring|radius|offset|size|padding|gap|height|width)-/i.test(name) ||
      /^--[a-z0-9]+-(control|focus|button|input|card|modal)/i.test(name),
  );
}
