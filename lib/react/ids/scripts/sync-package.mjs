#!/usr/bin/env node
/**
 * Sync theme, assets, fonts, VERSION, and package.json exports for `@ids/react`.
 *
 * Run from `lib/react/ids` (npm scripts set cwd).
 */
import {
  copyFileSync,
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pkgRoot = path.resolve(__dirname, "..");
const repoRoot = path.resolve(pkgRoot, "../../..");

const INTERNAL_DIRS = new Set([
  "dropdown-shared",
  "scripts",
  "dist",
  "styles",
  "assets",
  "fonts",
  "node_modules",
]);

function listPublicComponents() {
  return readdirSync(pkgRoot, { withFileTypes: true })
    .filter((d) => d.isDirectory() && !INTERNAL_DIRS.has(d.name) && !d.name.startsWith("."))
    .map((d) => d.name)
    .filter((name) => existsSync(path.join(pkgRoot, name, "index.ts")))
    .sort();
}

function buildExports(components) {
  /** @type {Record<string, unknown>} */
  const exportsMap = {
    ".": {
      types: "./dist/index.d.ts",
      import: "./dist/index.js",
      default: "./dist/index.js",
    },
    "./ids-theme.css": "./styles/ids-theme.css",
    "./fonts.css": "./fonts/fonts.css",
    "./assets/*": "./assets/*",
    "./package.json": "./package.json",
  };

  for (const name of components) {
    exportsMap[`./${name}`] = {
      types: `./dist/${name}/index.d.ts`,
      import: `./dist/${name}/index.js`,
      default: `./dist/${name}/index.js`,
    };
  }

  return exportsMap;
}

function syncTheme() {
  const src = path.join(repoRoot, "components", "ids-theme.css");
  const destDir = path.join(pkgRoot, "styles");
  const dest = path.join(destDir, "ids-theme.css");
  if (!existsSync(src)) {
    throw new Error(`Missing theme source: ${src}`);
  }
  mkdirSync(destDir, { recursive: true });
  copyFileSync(src, dest);
  console.log(`[sync] styles/ids-theme.css ← components/ids-theme.css`);
}

function syncAssets() {
  const src = path.join(repoRoot, "assets");
  const dest = path.join(pkgRoot, "assets");
  if (!existsSync(src)) {
    throw new Error(`Missing assets source: ${src}`);
  }
  mkdirSync(path.dirname(dest), { recursive: true });
  cpSync(src, dest, { recursive: true, force: true });
  console.log(`[sync] assets/ ← ${path.relative(repoRoot, src)}`);
}

function syncFonts() {
  const src = path.join(repoRoot, "ds-bundle", "fonts");
  const dest = path.join(pkgRoot, "fonts");
  if (!existsSync(src)) {
    throw new Error(`Missing fonts source: ${src}`);
  }
  mkdirSync(path.dirname(dest), { recursive: true });
  cpSync(src, dest, { recursive: true, force: true });
  console.log(`[sync] fonts/ ← ds-bundle/fonts`);
}

function syncVersion(pkg) {
  const version = String(pkg.version || "0.0.0");
  writeFileSync(path.join(pkgRoot, "VERSION"), `${version}\n`, "utf8");
  console.log(`[sync] VERSION = ${version}`);
}

function syncExports(pkg, components) {
  pkg.exports = buildExports(components);
  writeFileSync(
    path.join(pkgRoot, "package.json"),
    `${JSON.stringify(pkg, null, 2)}\n`,
    "utf8",
  );
  console.log(`[sync] package.json exports (${components.length} components + root)`);
}

function main() {
  const pkgPath = path.join(pkgRoot, "package.json");
  const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
  const components = listPublicComponents();

  syncTheme();
  syncAssets();
  syncFonts();
  syncVersion(pkg);
  syncExports(pkg, components);

  console.log(`[sync] done (${components.length} public components)`);
}

main();
