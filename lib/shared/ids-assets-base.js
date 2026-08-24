/**
 * Public URL base for repo-root `assets/` (icons, images, …).
 *
 * - Local Storybook: `/assets` via `staticDirs`
 * - GitHub Pages under `/<repo>/react/` or `/<repo>/angular/`: `/<repo>/assets`
 *   (shared once at site root — see `.github/workflows/storybook.yml`)
 *
 * Optional override: `window.__IDS_ASSETS_BASE__ = "/custom/assets"`
 *
 * @returns {string}
 */
export function getIdsAssetsBase() {
  if (typeof window !== "undefined") {
    const override = window.__IDS_ASSETS_BASE__;
    if (typeof override === "string" && override.trim()) {
      return override.replace(/\/+$/, "") || "/assets";
    }
    const pathname = window.location?.pathname || "/";
    const match = pathname.match(/^(.*?)\/(?:react|angular)(?:\/|$)/);
    if (match) {
      const siteRoot = match[1] || "";
      return `${siteRoot}/assets`;
    }
  }
  return "/assets";
}

/**
 * Build a URL under the shared assets base.
 * Accepts `icons/x.svg`, `assets/icons/x.svg`, or `/assets/icons/x.svg`.
 *
 * @param {string} path
 * @returns {string}
 */
export function idsAssetUrl(path) {
  const base = getIdsAssetsBase();
  let rel = String(path || "")
    .trim()
    .replace(/^\/+/, "");
  if (rel.startsWith("assets/")) {
    rel = rel.slice("assets/".length);
  }
  return `${base}/${rel}`;
}
