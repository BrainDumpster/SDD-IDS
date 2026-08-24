/**
 * Public URL bases for repo-root static folders served by Storybook (`staticDirs`).
 *
 * - Local Storybook: `/assets`, `/components`
 * - GitHub Pages under `/<repo>/react/` or `/<repo>/angular/`:
 *   `/<repo>/assets`, `/<repo>/components` (shared once at site root)
 *
 * Optional overrides:
 * - `window.__IDS_ASSETS_BASE__ = "/custom/assets"`
 * - `window.__IDS_COMPONENTS_BASE__ = "/custom/components"`
 */

/**
 * @param {"assets" | "components"} segment
 * @returns {string}
 */
export function getIdsSitePublicBase(segment) {
  if (typeof window !== "undefined") {
    const overrideKey =
      segment === "components"
        ? "__IDS_COMPONENTS_BASE__"
        : "__IDS_ASSETS_BASE__";
    const override = window[overrideKey];
    if (typeof override === "string" && override.trim()) {
      return override.replace(/\/+$/, "") || `/${segment}`;
    }
    const pathname = window.location?.pathname || "/";
    const match = pathname.match(/^(.*?)\/(?:react|angular)(?:\/|$)/);
    if (match) {
      const siteRoot = match[1] || "";
      return `${siteRoot}/${segment}`;
    }
  }
  return `/${segment}`;
}

/** @returns {string} */
export function getIdsAssetsBase() {
  return getIdsSitePublicBase("assets");
}

/** @returns {string} */
export function getIdsComponentsBase() {
  return getIdsSitePublicBase("components");
}

/**
 * @param {string} path
 * @returns {string}
 */
function idsPublicUrl(segment, path) {
  const base = getIdsSitePublicBase(segment);
  let rel = String(path || "")
    .trim()
    .replace(/^\/+/, "");
  const prefix = `${segment}/`;
  if (rel.startsWith(prefix)) {
    rel = rel.slice(prefix.length);
  }
  return `${base}/${rel}`;
}

/**
 * @param {string} path
 * @returns {string}
 */
export function idsAssetUrl(path) {
  return idsPublicUrl("assets", path);
}

/**
 * Build a URL under the shared components base (theme CSS, etc.).
 * Accepts `ids-theme.css`, `components/ids-theme.css`, or `/components/ids-theme.css`.
 *
 * @param {string} path
 * @returns {string}
 */
export function idsComponentsUrl(path) {
  return idsPublicUrl("components", path);
}

/** Theme stylesheets injected by Angular Storybook preview. */
export const IDS_THEME_STYLESHEETS = [
  "ids-theme.css",
  "dap-theme.css",
  "synapse-theme.css",
  "ids-foundations-docs.css",
];
