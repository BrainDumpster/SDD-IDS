/**
 * Asset URL helpers for `@ids/core`.
 *
 * Resolution order for the assets base:
 * 1. `window.__IDS_ASSETS_BASE__` (CDN / app override)
 * 2. Package-shipped icons via `import.meta.url` → `<pkg>/assets/`
 * 3. Storybook / site path heuristic (`/…/lit|react|angular/…` → `/assets`)
 * 4. Fallback `/assets`
 *
 * Public paths:
 * - icons  → `assets/icons/<slug>.svg`
 * - images → `assets/images/<file>`
 * - fonts  → `assets/fonts/<file>`
 */

export type IdsAssetSegment = "assets" | "components";

declare global {
  interface Window {
    __IDS_ASSETS_BASE__?: string;
    __IDS_COMPONENTS_BASE__?: string;
  }
}

/** Resolve `<packageRoot>/assets/` from any module emitted under `dist/`. */
function getPackageAssetsBaseFromModule(): string | null {
  try {
    const url = import.meta.url;
    const match = url.match(/^(.*\/)dist\//);
    if (match) {
      return new URL("assets/", match[1]).href.replace(/\/+$/, "");
    }
  } catch {
    // ignore — fall through to site defaults
  }
  return null;
}

function getWindowOverride(segment: IdsAssetSegment): string | null {
  if (typeof window === "undefined") return null;
  const override =
    segment === "components"
      ? window.__IDS_COMPONENTS_BASE__
      : window.__IDS_ASSETS_BASE__;
  if (typeof override === "string" && override.trim()) {
    return override.replace(/\/+$/, "") || `/${segment}`;
  }
  return null;
}

function getStorybookSiteBase(segment: IdsAssetSegment): string | null {
  if (typeof window === "undefined") return null;
  const pathname = window.location?.pathname || "/";
  const match = pathname.match(/^(.*?)\/(?:react|angular|lit)(?:\/|$)/);
  if (match) {
    const siteRoot = match[1] || "";
    return `${siteRoot}/${segment}`;
  }
  return null;
}

function getIdsSitePublicBase(segment: IdsAssetSegment): string {
  const override = getWindowOverride(segment);
  if (override) return override;

  if (segment === "assets") {
    const fromPackage = getPackageAssetsBaseFromModule();
    if (fromPackage) return fromPackage;
  }

  const site = getStorybookSiteBase(segment);
  if (site) return site;

  return `/${segment}`;
}

/** Public base for package / hosted `assets/` (icons, images, fonts). */
export function getIdsAssetsBase(): string {
  return getIdsSitePublicBase("assets");
}

function idsPublicUrl(segment: IdsAssetSegment, path: string): string {
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
 * Build a URL under the shared assets base.
 * Accepts `icons/foo.svg`, `assets/icons/foo.svg`, or `/assets/icons/foo.svg`.
 */
export function idsAssetUrl(path: string): string {
  return idsPublicUrl("assets", path);
}

const SLUG_PATTERN = /^[a-z0-9][a-z0-9._-]*$/i;

function assertSafeAssetSegment(segment: string, kind: string): string {
  const cleaned = String(segment || "")
    .trim()
    .replace(/^\/+/, "")
    .replace(/^assets\//, "");
  if (!cleaned || cleaned.includes("..") || cleaned.includes("//")) {
    throw new Error(`Invalid ${kind} asset path: ${segment}`);
  }
  return cleaned;
}

/** `assets/icons/<shape>.svg` */
export function idsIconUrl(shape: string): string {
  const slug = String(shape || "").trim();
  if (!SLUG_PATTERN.test(slug) || slug.includes("/")) {
    throw new Error(`Invalid icon slug: ${shape}`);
  }
  return idsAssetUrl(`icons/${slug}.svg`);
}

/** `assets/images/<file>` — pass `honeycomb.png` or `images/honeycomb.png`. */
export function idsImageUrl(file: string): string {
  const rel = assertSafeAssetSegment(file, "image");
  return idsAssetUrl(rel.startsWith("images/") ? rel : `images/${rel}`);
}

/** `assets/fonts/<file>` — pass `Roboto-Regular.woff2` or `fonts/…`. */
export function idsFontUrl(file: string): string {
  const rel = assertSafeAssetSegment(file, "font");
  return idsAssetUrl(rel.startsWith("fonts/") ? rel : `fonts/${rel}`);
}
