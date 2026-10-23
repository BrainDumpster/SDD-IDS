/**
 * Reusable IDS theme helpers for Lit apps / Storybook.
 *
 * Components in `@ids/lit` do **not** bundle theme CSS. Consumers must:
 * 1. Load `components/ids-theme.css` (or `@ids/lit/ids-theme.css`) globally
 * 2. Call `applyIdsTheme({ theme })` (or set the same attributes manually)
 *
 * Tokens inherit into shadow DOM via CSS custom properties.
 */

export type IdsThemeMode = "light" | "dark";
export type IdsDesignSystem = "ids" | "dap" | "synapse";

export interface ApplyIdsThemeOptions {
  /** Light (default) or dark token set. */
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

/**
 * Ensure the global IDS theme stylesheet is present (idempotent).
 * Prefer bundler import of `@ids/lit/ids-theme.css` / `components/ids-theme.css`
 * in apps; this helper is for Storybook / runtime injection when CSS is served
 * from `/components/ids-theme.css`.
 */
export function ensureIdsThemeStylesheet(
  href = "/components/ids-theme.css",
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
 * Apply light/dark (+ design-system) attributes so `ids-theme.css` token blocks activate.
 * Safe to call repeatedly (e.g. Storybook toolbar).
 */
export function applyIdsTheme(options: ApplyIdsThemeOptions = {}): void {
  const doc = options.doc ?? (typeof document !== "undefined" ? document : undefined);
  if (!doc) return;

  const theme: IdsThemeMode = options.theme === "dark" ? "dark" : "light";
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
    el.setAttribute("data-design-system", designSystem);
    el.classList.toggle("ids-theme-dark", theme === "dark");
    if (surface) {
      el.style.backgroundColor = surface;
    }
  }

  doc.documentElement.style.colorScheme = theme;
}

/** Resolve Storybook / app theme globals to a concrete mode. */
export function resolveIdsThemeMode(value: unknown): IdsThemeMode {
  return value === "dark" ? "dark" : "light";
}
