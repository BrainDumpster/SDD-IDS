/**
 * Generates `lib/react/ids/shared/idsAssetRegistry.generated.ts`.
 *
 * Why this exists: the IDS React components resolve `assets/icons/*.svg` and
 * `assets/images/*` with `import.meta.glob`, which is a **Vite-only** transform.
 * Vite (Storybook, apps) resolves it to real asset URLs. Any non-Vite bundler —
 * notably the esbuild pass that builds the design-sync bundle for claude.ai/design —
 * leaves it empty, and every icon then falls into IdsIcon's `data-missing` branch.
 *
 * The generated registry is a bundler-independent fallback: components prefer the
 * `import.meta.glob` result when it is populated (so Vite behaviour is byte-identical)
 * and fall back to these inlined data URIs otherwise.
 *
 * Regenerate after adding/removing assets:
 *   node scripts/generate_ids_asset_registry.mjs
 */
import { readFileSync, readdirSync, writeFileSync, statSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const iconsDir = join(repoRoot, "assets/icons");
const imagesDir = join(repoRoot, "assets/images");
const outFile = join(repoRoot, "lib/react/ids/shared/idsAssetRegistry.generated.ts");

/** SVG inlines far smaller URL-encoded than base64 (~1.1x vs ~1.33x). */
function svgDataUri(svg) {
  const cleaned = svg
    .replace(/^﻿/, "")
    .replace(/<\?xml[\s\S]*?\?>/g, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/\s+/g, " ")
    .trim();
  const encoded = encodeURIComponent(cleaned)
    .replace(/%20/g, " ")
    .replace(/%3D/g, "=")
    .replace(/%3A/g, ":")
    .replace(/%2F/g, "/")
    .replace(/'/g, "%27")
    .replace(/"/g, "'");
  return `data:image/svg+xml,${encoded}`;
}

const MIME = { ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".gif": "image/gif", ".webp": "image/webp" };

const icons = readdirSync(iconsDir)
  .filter((f) => f.endsWith(".svg"))
  .sort()
  .map((f) => [f.replace(/\.svg$/, ""), svgDataUri(readFileSync(join(iconsDir, f), "utf8"))]);

const images = readdirSync(imagesDir)
  .filter((f) => MIME[f.slice(f.lastIndexOf("."))])
  .sort()
  .map((f) => {
    const ext = f.slice(f.lastIndexOf("."));
    return [f, `data:${MIME[ext]};base64,${readFileSync(join(imagesDir, f)).toString("base64")}`];
  });

/**
 * Icons imported elsewhere with Vite's `?raw` suffix need their SVG *markup*
 * (they are injected via dangerouslySetInnerHTML), not a URL. Outside Vite the
 * `?raw` suffix is meaningless and the import yields a data URI, which then
 * renders as literal text. Scan for those imports so this list maintains itself.
 */
const RAW_SCAN_DIRS = [join(repoRoot, "lib"), join(repoRoot, "storybook/src")];
function walk(dir, out = []) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (e.name === "node_modules" || e.name.startsWith(".")) continue;
    const full = join(dir, e.name);
    if (e.isDirectory()) walk(full, out);
    else if (/\.tsx?$/.test(e.name)) out.push(full);
  }
  return out;
}
const rawShapes = new Set();
for (const dir of RAW_SCAN_DIRS) {
  let files = [];
  try { files = walk(dir); } catch { continue; }
  for (const f of files) {
    for (const m of readFileSync(f, "utf8").matchAll(/["'][^"']*\/assets\/icons\/([A-Za-z0-9_-]+)\.svg\?raw["']/g)) {
      rawShapes.add(m[1]);
    }
  }
}
const rawSvgs = [...rawShapes].sort().map((shape) => {
  const file = join(iconsDir, `${shape}.svg`);
  return [shape, readFileSync(file, "utf8").replace(/^\uFEFF/, "").replace(/<\?xml[\s\S]*?\?>/g, "").trim()];
});

const lines = [
  "/**",
  " * GENERATED FILE — do not edit by hand.",
  " * Source: `scripts/generate_ids_asset_registry.mjs` (run it to regenerate).",
  " *",
  " * Bundler-independent fallback for assets that the components normally resolve",
  " * through Vite's `import.meta.glob`. See the generator for the full rationale.",
  " */",
  "",
  "/** `<shape>` (i.e. `assets/icons/<shape>.svg`) -> inlined data URI. */",
  "export const IDS_ICON_URL_BY_SHAPE: Record<string, string> = {",
  ...icons.map(([k, v]) => `  ${JSON.stringify(k)}: ${JSON.stringify(v)},`),
  "};",
  "",
  "/** `<file.ext>` under `assets/images/` -> inlined data URI. */",
  "export const IDS_IMAGE_URL_BY_FILE: Record<string, string> = {",
  ...images.map(([k, v]) => `  ${JSON.stringify(k)}: ${JSON.stringify(v)},`),
  "};",
  "",
  "/** `<shape>` -> raw SVG markup, for icons injected as innerHTML (Vite `?raw`). */",
  "export const IDS_ICON_RAW_SVG_BY_SHAPE: Record<string, string> = {",
  ...rawSvgs.map(([k, v]) => `  ${JSON.stringify(k)}: ${JSON.stringify(v)},`),
  "};",
  "",
  "/**",
  " * Returns SVG markup for an icon imported with Vite's `?raw`. Under Vite the",
  " * import already IS markup and is passed through; under any other bundler it",
  " * is not, and the generated markup is used instead.",
  " */",
  "export function idsRawSvg(imported: unknown, shape: string): string {",
  "  return typeof imported === \"string\" && imported.trimStart().startsWith(\"<\")",
  "    ? imported",
  "    : (IDS_ICON_RAW_SVG_BY_SHAPE[shape] ?? \"\");",
  "}",
  "",
];

writeFileSync(outFile, lines.join("\n"));
const kb = (statSync(outFile).size / 1024).toFixed(0);
console.log(`wrote ${outFile} — ${icons.length} icons, ${images.length} images, ${rawSvgs.length} raw SVGs, ${kb} KB`);
