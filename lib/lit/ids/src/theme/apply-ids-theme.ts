/**
 * Reusable IDS theme helpers for Lit apps / Storybook.
 *
 * Components in `@ids/core` do **not** bundle theme CSS inside shadow roots.
 * Consumers must:
 * 1. Load `@ids/core/ids-theme.css` once at the app root
 * 2. Call `applyIdsTheme({ theme })` (or set the same attributes manually)
 *
 * Theme apply is **runtime-dynamic**: call again anytime to switch light/dark
 * (or a future named theme). Tokens inherit into shadow DOM via CSS variables —
 * no reload or component re-registration required.
 */

/** Built-in modes shipped in ids-theme.css today. */
export type IdsBuiltInThemeMode = "light" | "dark";

/**
 * Theme mode written to `data-theme`.
 * Open string so future named themes (e.g. `high-contrast`) can be applied
 * without a breaking type change once matching CSS blocks exist.
 */
export type IdsThemeMode = IdsBuiltInThemeMode | (string & {});

export type IdsDesignSystem = "ids" | "dap" | "synapse" | (string & {});

export interface ApplyIdsThemeOptions {
  /** Theme name written to `data-theme`. Default: `light`. */
  theme?: IdsThemeMode;
  /** Which programme theme block to activate. Default: `ids`. */
  designSystem?: IdsDesignSystem;
  /**
   * Document to mutate. Defaults to `document`.
   * Pass another document when embedding (iframe / test harness).
   */
  doc?: Document;
  /**
   * Optional surface background using a semantic token.
   * Default: `var(--color-background-surface-1)`. Pass `null` to skip.
   */
  surface?: string | null;
}

const THEME_LINK_ATTR = "data-ids-theme";
const DEFAULT_THEME_HREF = "ids-theme.css";

/**
 * Ensure the global IDS theme stylesheet is present (idempotent).
 * Prefer bundler import of `@ids/core/ids-theme.css` in apps; this helper is
 * for Storybook / runtime injection when a CSS URL must be attached manually.
 */
export function ensureIdsThemeStylesheet(
  href: string = DEFAULT_THEME_HREF,
  doc: Document = document,
): HTMLLinkElement | null {
  if (typeof doc === "undefined") return null;
  const existing = doc.querySelector<HTMLLinkElement>(
    `link[${THEME_LINK_ATTR}="ids-theme.css"]`,
  );
  if (existing) return existing;

  const link = doc.createElement("link");
  link.rel = "stylesheet";
  link.href = href;
  link.setAttribute(THEME_LINK_ATTR, "ids-theme.css");
  doc.head.appendChild(link);
  return link;
}

/**
 * Apply theme (+ design-system) attributes so `ids-theme.css` token blocks activate.
 * Safe to call repeatedly at runtime (settings toggle, Storybook toolbar, OS preference).
 */
export function applyIdsTheme(options: ApplyIdsThemeOptions = {}): void {
  const doc = options.doc ?? (typeof document !== "undefined" ? document : undefined);
  if (!doc) return;

  const rawTheme = options.theme == null ? "light" : String(options.theme).trim();
  const theme: IdsThemeMode = rawTheme || "light";
  const designSystem: IdsDesignSystem = options.designSystem ?? "ids";
  const surface =
    options.surface === undefined
      ? "var(--color-background-surface-1)"
      : options.surface;

  const targets = [doc.documentElement, doc.body].filter(
    (el): el is HTMLElement => Boolean(el),
  );

  for (const el of targets) {
    el.setAttribute("data-theme", theme);
    el.setAttribute("data-design-system", String(designSystem));
    el.classList.toggle("ids-theme-dark", theme === "dark");
    if (surface) {
      el.style.backgroundColor = surface;
    }
  }

  if (theme === "dark") {
    doc.documentElement.style.colorScheme = "dark";
  } else if (theme === "light") {
    doc.documentElement.style.colorScheme = "light";
  }
  // Future named themes: leave color-scheme alone unless callers set it.
}

/** Read the current theme from `document.documentElement` (`data-theme`). */
export function getIdsTheme(doc: Document = document): IdsThemeMode {
  if (typeof doc === "undefined") return "light";
  const value = doc.documentElement.getAttribute("data-theme");
  return value && value.trim() ? value.trim() : "light";
}

/** Resolve Storybook / app theme globals to a concrete mode. */
export function resolveIdsThemeMode(value: unknown): IdsThemeMode {
  if (typeof value === "string" && value.trim()) {
    return value.trim();
  }
  return "light";
}
