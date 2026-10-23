/**
 * Asset URL helpers for `@ids/lit` — always resolve from the repo `assets/` folder.
 *
 * Public paths (Storybook `staticDirs` / app static hosting):
 * - icons  → `assets/icons/<slug>.svg`
 * - images → `assets/images/<file>`
 * - fonts  → `assets/fonts/<file>`
 *
 * Contract matches `lib/shared/ids-assets-base.js` (`getIdsAssetsBase`, `idsAssetUrl`,
 * `window.__IDS_ASSETS_BASE__`) so Lit / Angular / React Storybooks share `/assets`.
 */

export type IdsAssetSegment = "assets" | "components";

function getIdsSitePublicBase(segment: IdsAssetSegment): string {
  if (typeof window !== "undefined") {
    const overrideKey =
      segment === "components" ? "__IDS_COMPONENTS_BASE__" : "__IDS_ASSETS_BASE__";
    const override =
      overrideKey === "__IDS_ASSETS_BASE__"
        ? window.__IDS_ASSETS_BASE__
        : window.__IDS_COMPONENTS_BASE__;
    if (typeof override === "string" && override.trim()) {
      return override.replace(/\/+$/, "") || `/${segment}`;
    }
    const pathname = window.location?.pathname || "/";
    const match = pathname.match(/^(.*?)\/(?:react|angular|lit)(?:\/|$)/);
    if (match) {
      const siteRoot = match[1] || "";
      return `${siteRoot}/${segment}`;
    }
  }
  return `/${segment}`;
}

declare global {
  interface Window {
    __IDS_ASSETS_BASE__?: string;
    __IDS_COMPONENTS_BASE__?: string;
  }
}

/** Public base for the repo `assets/` folder (default `/assets`). */
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
