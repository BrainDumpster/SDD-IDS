/** Markdown ##-section parsing for design-spec / root-spec slicing. */

export interface MarkdownSection {
  title: string;
  /** Full section including the `## Title` line. */
  body: string;
}

export function normalizeSectionKey(title: string): string {
  return title
    .trim()
    .toLowerCase()
    .replace(/[()]/g, "")
    .replace(/\s+/g, " ");
}

/** Canonical design-spec section titles and accepted aliases. */
const DESIGN_SPEC_SECTION_ALIASES: Record<string, string[]> = {
  metadata: ["metadata"],
  anatomy: ["anatomy"],
  "layout & measurements": ["layout & measurements", "layout", "measurements", "slot geometry"],
  tokens: ["tokens"],
  "states (light theme)": ["states (light theme)", "states light", "states", "light theme", "light states"],
  "states (dark theme)": ["states (dark theme)", "states dark", "dark theme", "dark states"],
  interactions: ["interactions"],
  "composition & api (runtime)": [
    "composition & api (runtime)",
    "composition & api",
    "composition",
    "api",
    "runtime api",
  ],
  "codegen contract (framework-agnostic blueprint)": [
    "codegen contract (framework-agnostic blueprint)",
    "codegen contract",
    "codegen",
    "blueprint",
  ],
  "source mapping": ["source mapping"],
  "implementation notes": ["implementation notes", "implementation"],
};

/** Root-spec foundation / principles section aliases. */
const ROOT_SPEC_SECTION_ALIASES: Record<string, string[]> = {
  "design system identity": ["design system identity", "identity"],
  "color system": ["color system", "color", "colours", "colors"],
  "typography scale": ["typography scale", "typography", "type"],
  "spacing & sizing": ["spacing & sizing", "spacing", "sizing", "size"],
  "border width": ["border width", "border"],
  "corner radius": ["corner radius", "radius"],
  "elevation system": ["elevation system", "elevation", "shadow"],
  "opacity scale": ["opacity scale", "opacity"],
  "responsive breakpoints": ["responsive breakpoints", "breakpoints", "responsive"],
  "interaction baseline": ["interaction baseline", "interaction"],
  "accessibility baseline": ["accessibility baseline", "accessibility", "a11y"],
  "theming mechanism": ["theming mechanism", "theming", "theme"],
  "variable collections (figma)": ["variable collections (figma)", "variable collections", "figma"],
  "codegen baseline contract": ["codegen baseline contract", "codegen baseline", "codegen"],
  "source mapping": ["source mapping"],
};

const ALL_ALIASES: Record<string, string[]> = {
  ...DESIGN_SPEC_SECTION_ALIASES,
  ...ROOT_SPEC_SECTION_ALIASES,
};

function resolveCanonicalTitle(requested: string): string | null {
  const key = normalizeSectionKey(requested);
  for (const [canonical, aliases] of Object.entries(ALL_ALIASES)) {
    if (normalizeSectionKey(canonical) === key) {
      return canonical;
    }
    if (aliases.some((alias) => normalizeSectionKey(alias) === key)) {
      return canonical;
    }
  }
  return null;
}

export function parseMarkdownH2Sections(markdown: string): MarkdownSection[] {
  const lines = markdown.split(/\r?\n/);
  const sections: MarkdownSection[] = [];
  let currentTitle: string | null = null;
  let currentLines: string[] = [];

  const flush = (): void => {
    if (currentTitle === null) {
      return;
    }
    sections.push({
      title: currentTitle,
      body: currentLines.join("\n").trimEnd(),
    });
  };

  for (const line of lines) {
    const match = /^##\s+(.+?)\s*$/.exec(line);
    if (match) {
      flush();
      currentTitle = match[1].trim();
      currentLines = [line];
      continue;
    }
    if (currentTitle !== null) {
      currentLines.push(line);
    }
  }
  flush();
  return sections;
}

export function listSectionTitles(markdown: string): string[] {
  return parseMarkdownH2Sections(markdown).map((section) => section.title);
}

export function extractMarkdownSections(
  markdown: string,
  requestedSections: string[],
): { found: MarkdownSection[]; missing: string[]; available: string[] } {
  const parsed = parseMarkdownH2Sections(markdown);
  const available = parsed.map((section) => section.title);
  const found: MarkdownSection[] = [];
  const missing: string[] = [];
  const seenTitles = new Set<string>();

  for (const requested of requestedSections) {
    const canonical = resolveCanonicalTitle(requested);
    const needle = normalizeSectionKey(canonical ?? requested);

    const match =
      parsed.find((section) => normalizeSectionKey(section.title) === needle) ??
      parsed.find((section) => {
        const titleKey = normalizeSectionKey(section.title);
        return titleKey.includes(needle) || needle.includes(titleKey);
      });

    if (!match) {
      missing.push(requested);
      continue;
    }

    const dedupeKey = normalizeSectionKey(match.title);
    if (seenTitles.has(dedupeKey)) {
      continue;
    }
    seenTitles.add(dedupeKey);
    found.push(match);
  }

  return { found, missing, available };
}

export function extractExactTitles(
  markdown: string,
  titles: string[],
): { found: MarkdownSection[]; missing: string[] } {
  const parsed = parseMarkdownH2Sections(markdown);
  const found: MarkdownSection[] = [];
  const missing: string[] = [];

  for (const title of titles) {
    const needle = normalizeSectionKey(title);
    const match = parsed.find((section) => normalizeSectionKey(section.title) === needle);
    if (match) {
      found.push(match);
    } else {
      missing.push(title);
    }
  }

  return { found, missing };
}

/** Foundation category → root-spec H2 titles. */
export const FOUNDATION_CATEGORY_SECTIONS: Record<string, string[]> = {
  color: ["Color System"],
  spacing: ["Spacing & Sizing"],
  typography: ["Typography Scale"],
  elevation: ["Elevation System"],
  radius: ["Corner Radius"],
  border: ["Border Width"],
  opacity: ["Opacity Scale"],
  breakpoints: ["Responsive Breakpoints"],
  all: [
    "Color System",
    "Typography Scale",
    "Spacing & Sizing",
    "Border Width",
    "Corner Radius",
    "Elevation System",
    "Opacity Scale",
    "Responsive Breakpoints",
  ],
};

/** Design-principles sections from root-spec. */
export const DESIGN_PRINCIPLES_SECTIONS = [
  "Design System Identity",
  "Interaction Baseline",
  "Accessibility Baseline",
  "Theming Mechanism",
  "Codegen Baseline Contract",
] as const;

/** Theme CSS custom-property prefixes by foundation category. */
export const THEME_CSS_PREFIXES: Record<string, string[]> = {
  color: ["--color-"],
  spacing: ["--spacing-", "--size-", "--dimension-", "--gap-"],
  typography: ["--font-", "--typography-", "--type-", "--line-height-", "--letter-spacing-"],
  elevation: ["--elevation-", "--shadow-"],
  radius: ["--radius-", "--corner-"],
  border: ["--border-"],
  opacity: ["--opacity-"],
  breakpoints: ["--breakpoint-"],
  all: [],
};

export function filterThemeCssByCategory(css: string, category: string): string {
  const prefixes = THEME_CSS_PREFIXES[category];
  if (!prefixes || prefixes.length === 0 || category === "all") {
    return css;
  }

  const matching = css.split(/\r?\n/).filter((line) => prefixes.some((prefix) => line.includes(prefix)));
  if (matching.length === 0) {
    return `/* No CSS custom properties matching category "${category}" found in theme file. */`;
  }
  return matching.join("\n");
}
