/**
 * Curated raw SVGs for IdsIcon `variant="inline"` (real <svg> in DOM).
 * Start with alert warning-minor; expand as other lib components need two-tone glyphs.
 */
import popoutDoubleRaw from "../../../../assets/icons/popout-double.svg?raw";
import popoutWindowArrowRaw from "../../../../assets/icons/popout-window-arrow.svg?raw";
import statusWarnTriSolidRaw from "../../../../assets/icons/status-warn-tri-solid.svg?raw";

function stripXmlDeclaration(svg: string): string {
  return svg.replace(/<\?xml[^>]*>\s*/i, "").trim();
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

/**
 * Global alert warning-minor: black triangle + white exclamation
 * (see components/ids/alert/design-spec.md Implementation Notes).
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

export { stripXmlDeclaration };

export const IDS_ICON_INLINE_SVG_BY_SHAPE: Readonly<Record<string, string>> = {
  "status-warn-tri-solid": warnMinorAlertIcon(statusWarnTriSolidRaw),
  "popout-window-arrow": popoutWindowArrowIcon(popoutWindowArrowRaw),
  "popout-double": popoutDoubleIcon(popoutDoubleRaw),
};
