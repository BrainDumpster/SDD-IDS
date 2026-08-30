/**
 * Curated raw SVGs for Icon variant="inline" (real <svg> in DOM, no CSS mask).
 * Add slugs here only when bundle size is acceptable; unknown slugs fall back to mask.
 */
import colSortDown16Raw from "../../../assets/icons/col-sort-down-16.svg?raw";
import colSortUp16Raw from "../../../assets/icons/col-sort-up-16.svg?raw";
import filterSolidRaw from "../../../assets/icons/filter-solid.svg?raw";
import gridSquare9Raw from "../../../assets/icons/grid-square-9-16.svg?raw";
import popoutDoubleRaw from "../../../assets/icons/popout-double.svg?raw";
import popoutWindowArrowRaw from "../../../assets/icons/popout-window-arrow.svg?raw";
import search16Raw from "../../../assets/icons/search-16.svg?raw";
import settingsGearRaw from "../../../assets/icons/settings-gear.svg?raw";
import shieldEncryptAltRaw from "../../../assets/icons/shield-encrypt-alt.svg?raw";
import statusWarnTriSolidRaw from "../../../assets/icons/status-warn-tri-solid.svg?raw";

export function stripXmlDeclaration(svg: string): string {
  return svg.replace(/<\?xml[^>]*>\s*/i, "").trim();
}

/** Visible funnel outline path from `assets/icons/filter.svg` (defs/mask stripped). */
const FILTER_OUTLINE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path fill="currentColor" d="M29.98,4s.02.04.03.05l-.04.05-11.46,12.3-.54.58v11.03h-4v-11.03l-.53-.57L2.05,4.1l-.03-.03-.02-.02s.01-.05.04-.05h27.93M29.96,2H2.04C.24,2-.67,4.16.58,5.46l11.38,12.3v12.24h8v-12.24l11.46-12.3c1.25-1.29.34-3.46-1.46-3.46h0Z"/></svg>`;

/** Normalize IDS monochrome SVGs to `currentColor` for token-driven tints. */
function monoIconFromAsset(raw: string): string {
  let s = stripXmlDeclaration(raw);
  s = s.replace(/\swidth="[^"]*"/gi, "");
  s = s.replace(/\sheight="[^"]*"/gi, "");
  s = s.replace(/style="enable-background:[^"]*"/gi, "");
  s = s.replace(/style="fill:#616161;?"/gi, 'fill="currentColor"');
  s = s.replace(/fill:#616161/gi, "currentColor");
  s = s.replace(/\.st0\s*\{\s*fill:\s*#616161;\s*\}/gi, ".st0{fill:currentColor;}");
  return s.trim();
}

/**
 * Global alert warning-minor icon: two-tone SVG with black triangle and white exclamation mark.
 * Per design spec: strip <style>, apply inline fill tokens to .st0/.st1 (triangle → black)
 * and .st2 (exclamation mark → white); strip width/height from root <svg>.
 */
function warnMinorAlertIcon(raw: string): string {
  let s = stripXmlDeclaration(raw);
  s = s.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "");
  s = s.replace(/\swidth="[^"]*"/i, "");
  s = s.replace(/\sheight="[^"]*"/i, "");
  s = s.replace(/\sstyle="enable-background:[^"]*"/gi, "");
  s = s.replace(/class="st0"/g, 'style="fill:var(--color-icon-gray-black)"');
  s = s.replace(/class="st1"/g, 'style="fill:var(--color-icon-gray-black)"');
  s = s.replace(/class="st2"/g, 'style="fill:var(--color-icon-gray-white)"');
  return s.trim();
}

function stripIconRootDimensions(svg: string): string {
  let s = stripXmlDeclaration(svg);
  s = s.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "");
  s = s.replace(/\swidth="[^"]*"/gi, "");
  s = s.replace(/\sheight="[^"]*"/gi, "");
  s = s.replace(/\sstyle="enable-background:[^"]*"/gi, "");
  return s.trim();
}

/** What's New thumbnail hover: frame neutral, arrow brand (`27437:44169`). */
function popoutWindowArrowIcon(raw: string): string {
  let s = stripIconRootDimensions(raw);
  s = s.replace(/<path class="st0"/g, '<path style="fill:var(--color-icon-gray-neutral-base)"');
  s = s.replace(/<polygon class="st0"/g, '<polygon style="fill:var(--color-icon-brand-base)"');
  return s.trim();
}

/** What's New expand: frame border brand, inner arrows neutral (`27437:44212`). */
function popoutDoubleIcon(raw: string): string {
  let s = stripIconRootDimensions(raw);
  s = s.replace(/<path class="st0"/g, '<path style="fill:var(--color-border-brand-base)"');
  s = s.replace(/<polygon class="st0"/g, '<polygon style="fill:var(--color-icon-gray-neutral-base)"');
  return s.trim();
}

export const ICON_INLINE_SVG_RAW_BY_SLUG: Readonly<Record<string, string>> = {
  "grid-square-9-16": stripXmlDeclaration(gridSquare9Raw),
  "shield-encrypt-alt": stripXmlDeclaration(shieldEncryptAltRaw),
  "col-sort-up-16": monoIconFromAsset(colSortUp16Raw),
  "col-sort-down-16": monoIconFromAsset(colSortDown16Raw),
  filter: FILTER_OUTLINE_SVG,
  "filter-solid": monoIconFromAsset(filterSolidRaw),
  "search-16": monoIconFromAsset(search16Raw),
  "settings-gear": monoIconFromAsset(settingsGearRaw),
  "status-warn-tri-solid": warnMinorAlertIcon(statusWarnTriSolidRaw),
  "popout-window-arrow": popoutWindowArrowIcon(popoutWindowArrowRaw),
  "popout-double": popoutDoubleIcon(popoutDoubleRaw),
};
