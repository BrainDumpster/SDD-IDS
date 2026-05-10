/**
 * Curated raw SVGs for Icon variant="inline" (real <svg> in DOM, no CSS mask).
 * Add slugs here only when bundle size is acceptable; unknown slugs fall back to mask.
 */
import gridSquare9Raw from "../../../assets/icons/grid-square-9-16.svg?raw";
import shieldEncryptAltRaw from "../../../assets/icons/shield-encrypt-alt.svg?raw";

export const ICON_INLINE_SVG_RAW_BY_SLUG: Readonly<Record<string, string>> = {
  "grid-square-9-16": gridSquare9Raw,
  "shield-encrypt-alt": shieldEncryptAltRaw,
};

export function stripXmlDeclaration(svg: string): string {
  return svg.replace(/<\?xml[^>]*>\s*/i, "").trim();
}
