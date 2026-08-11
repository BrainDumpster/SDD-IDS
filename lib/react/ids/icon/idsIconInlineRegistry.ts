/**
 * Curated raw SVGs for IdsIcon `variant="inline"` (real <svg> in DOM).
 * Start with alert warning-minor; expand as other lib components need two-tone glyphs.
 */
import statusWarnTriSolidRaw from "../../../../assets/icons/status-warn-tri-solid.svg?raw";

function stripXmlDeclaration(svg: string): string {
  return svg.replace(/<\?xml[^>]*>\s*/i, "").trim();
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
};
