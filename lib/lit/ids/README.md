# `@ids/core`

IDS Lit web components for consumer applications. Install from your Artifactory npm registry (CI publishes this package).

## Install

```bash
npm install @ids/core lit
```

## Quick start

```js
import "@ids/core/button/register";
import "@ids/core/ids-theme.css";
import { applyIdsTheme, getIdsTheme } from "@ids/core/theme";

// Initial theme (light | dark). Safe to call again at runtime.
applyIdsTheme({ theme: "light" });

document.querySelector("#theme-toggle")?.addEventListener("click", () => {
  const next = getIdsTheme() === "dark" ? "light" : "dark";
  applyIdsTheme({ theme: next });
});
```

```html
<ids-button>
  <ids-button-label>Save</ids-button-label>
</ids-button>
```

## Imports

| Import | Purpose |
|--------|---------|
| `@ids/core/<component>/register` | Define custom elements (side-effect) |
| `@ids/core/<component>` | Classes / types without relying on register |
| `@ids/core/ids-theme.css` | Minified light + dark token stylesheet |
| `@ids/core/theme` | `applyIdsTheme`, `getIdsTheme`, helpers |
| `@ids/core/assets` | `idsIconUrl`, `getIdsAssetsBase`, … |

## Themes (runtime)

- Load **one** global stylesheet: `@ids/core/ids-theme.css` (includes light + dark).
- Switch anytime with `applyIdsTheme({ theme: "light" | "dark" })` — no reload.
- Components inherit CSS variables into shadow DOM automatically.
- Future themes: add a `[data-theme="…"]` block to the theme CSS and pass that name to `applyIdsTheme`.

Host attributes set by `applyIdsTheme`:

- `data-design-system="ids"` (default)
- `data-theme="<name>"`
- `.ids-theme-dark` when theme is `dark`

## Icons

SVG icons ship in the package under `assets/icons/`. By default URLs resolve from the package via `import.meta.url`.

Optional CDN / static host override:

```js
window.__IDS_ASSETS_BASE__ = "https://cdn.example.com/ids-assets";
```

## Build (maintainers)

Package root: `lib/lit/ids` (this folder). Source lives in `src/`; publishable output is generated into `dist/`, `styles/`, and `assets/`.

### Prerequisites

- Node.js 18+ (ESM)
- npm
- Repo checkout that includes:
  - `components/ids-theme.css`
  - `components/ids-theme-fallbacks.css`
  - `assets/icons/*.svg`

### One-time setup

```bash
cd lib/lit/ids
npm install
```

### Production build

```bash
npm run build
```

What `build` does (in order):

1. **`clean`** — removes `dist/`
2. **`build:assets`** — `scripts/prepare-package-assets.mjs`
   - Bundles theme CSS → `styles/ids-theme.css` (readable) and `styles/ids-theme.min.css` (minified)
   - Copies repo `assets/icons/` → package `assets/icons/`
3. **`build:js`** — Rollup multi-entry ESM into `dist/` (minified, with `.d.ts`)

### Useful scripts

| Script | Purpose |
|--------|---------|
| `npm run build` | Full production build (clean + assets + JS) |
| `npm run build:assets` | Theme CSS + icons only |
| `npm run build:js` | Rollup only (expects a clean `dist/` if you care about stale chunks) |
| `npm run build:watch` / `npm run dev` | Rebuild JS on `src/**` changes (no minify) |
| `npm run clean` | Delete `dist/` |
| `npm run pack:check` | `npm pack --dry-run` — inspect tarball contents/size |
| `npm run prepublishOnly` | Runs `build` automatically before publish |

Makefile shortcuts (optional): `make build`, `make watch`, `make clean`, `make pack-check`.

### Output layout

```
lib/lit/ids/
  dist/                 # ESM + .d.ts (per-component index + register)
  styles/
    ids-theme.css       # self-contained light + dark tokens
    ids-theme.min.css   # minified (exported as @ids/core/ids-theme.css)
  assets/icons/         # shipped SVGs
  package.json          # name @ids/core, exports map
```

Generated `styles/` theme files and `assets/` are produced by the build (see `.gitignore`); always run `npm run build` before packing or publishing.

### Verify before publish

```bash
npm run build
npm run pack:check
```

Confirm the dry-run tarball includes `dist/`, `styles/ids-theme.min.css`, and `assets/icons/` — and does **not** ship raw `src/`.

### Versioning and Artifactory

```bash
npm version patch   # or minor | major
# CI runs validations, then publishes to Artifactory
# (set registry via CI / .npmrc — not hard-coded in package.json)
```

Local Storybook (`storybook-lit`) consumes this package via `file:../lib/lit/ids` and runs `npm run build` (or watch) so `dist/` stays current.
