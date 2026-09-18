# `@ids/react`

IDS React components (CSS Modules) generated from design-spec.

Peer dependencies: `react` and `react-dom` (`^18` or `^19`).

Registry publish is deferred — deliver via local tarball for now (`private: true`).

---

## Installation

### 1. Build the package (maintainers)

From the monorepo:

```bash
cd lib/react/ids
npm install
npm run pack:local
# → ids-react-0.1.0.tgz
```

### 2. Install in a consumer app

```bash
npm install /absolute/or/relative/path/to/ids-react-0.1.0.tgz
```

Or with pnpm / yarn:

```bash
pnpm add /path/to/ids-react-0.1.0.tgz
yarn add /path/to/ids-react-0.1.0.tgz
```

The consumer app must use a bundler that understands ESM + CSS imports (Vite, Webpack, etc.). Plain Node cannot import the CSS side-effects.

---

## Theme & fonts (required once)

IDS tokens are scoped to host attributes. Load the theme stylesheet **once** at the application root (not inside each component).

### CSS imports

```tsx
// App entry (e.g. main.tsx / App.tsx)
import "@ids/react/ids-theme.css";
import "@ids/react/fonts.css"; // optional — skip if the host already loads Roboto
```

### Host attributes

Set these on `<html>` or `<body>`:

| Attribute | Values | Purpose |
|-----------|--------|---------|
| `data-design-system` | `"ids"` | Activates IDS token scope |
| `data-theme` | `"light"` \| `"dark"` | Color mode |

```html
<html data-design-system="ids" data-theme="light">
  ...
</html>
```

Or in JS:

```ts
document.documentElement.setAttribute("data-design-system", "ids");
document.documentElement.setAttribute("data-theme", "light"); // or "dark"
```

There is no React theme provider — components read CSS custom properties from the document.

### Using tokens in your own layout

```tsx
<div
  style={{
    display: "flex",
    gap: "var(--spacing-space-16)",
    padding: "var(--padding-padding-16)",
    background: "var(--color-background-surface-secondary)",
    color: "var(--color-text-gray-neutral-strong)",
  }}
>
  {/* IDS components */}
</div>
```

---

## Importing components

Prefer **subpath imports** (tree-friendlier). Root barrel also works.

```tsx
// Preferred — one component entry
import { IdsButton, IdsButtonLabel } from "@ids/react/button";
import { IdsIcon } from "@ids/react/icon";

// Also valid — root barrel
import { IdsButton, IdsButtonLabel, IdsIcon } from "@ids/react";
```

Component CSS is pulled in automatically when you import the component (side-effect CSS from the build). You do **not** need a separate CSS import per component.

Subpath pattern: `@ids/react/<slug>` where `<slug>` matches the folder name under `lib/react/ids/` (e.g. `button`, `checkbox`, `form-label`, `modal`).

---

## Examples

### Button + icon

```tsx
import "@ids/react/ids-theme.css";
import { IdsButton, IdsButtonLabel, IdsButtonLeadingIcon } from "@ids/react/button";
import { IdsIcon } from "@ids/react/icon";

export function SaveAction() {
  return (
    <IdsButton variant="primary" size="medium">
      <IdsButtonLeadingIcon>
        <IdsIcon shape="settings-gear" size={16} />
      </IdsButtonLeadingIcon>
      <IdsButtonLabel>Save</IdsButtonLabel>
    </IdsButton>
  );
}
```

### Checkbox

```tsx
import { IdsCheckbox, IdsCheckboxLabel } from "@ids/react/checkbox";

export function RememberMe() {
  return (
    <IdsCheckbox defaultChecked>
      <IdsCheckboxLabel>Remember me</IdsCheckboxLabel>
    </IdsCheckbox>
  );
}
```

### Form label + text box

```tsx
import { IdsFormLabel } from "@ids/react/form-label";
import { IdsTextBox } from "@ids/react/text-box";

export function NameField() {
  return (
    <div style={{ display: "grid", gap: "var(--spacing-space-8)" }}>
      <IdsFormLabel htmlFor="user-name">Name</IdsFormLabel>
      <IdsTextBox id="user-name" placeholder="Enter name" />
    </div>
  );
}
```

### Alert

```tsx
import { IdsAlert } from "@ids/react/alert";

export function InlineInfo() {
  return (
    <IdsAlert display="inline" severity="info">
      Configuration saved successfully.
    </IdsAlert>
  );
}
```

### Minimal Vite app entry

```tsx
// main.tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@ids/react/ids-theme.css";
import "@ids/react/fonts.css";
import { IdsButton, IdsButtonLabel } from "@ids/react/button";
import "./index.css";

document.documentElement.setAttribute("data-design-system", "ids");
document.documentElement.setAttribute("data-theme", "light");

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <IdsButton variant="primary">
      <IdsButtonLabel>Hello IDS</IdsButtonLabel>
    </IdsButton>
  </StrictMode>,
);
```

---

## Icons

Use `IdsIcon` with a `shape` slug that matches a file under the package `assets/icons/` folder (without `.svg`):

```tsx
import { IdsIcon } from "@ids/react/icon";

<IdsIcon shape="chev-down-thick" size={16} />
<IdsIcon shape="status-warn-tri-solid" variant="img" size={20} />
```

| `variant` | Behavior |
|-----------|----------|
| `mask` (default) | Tintable via `color` / `currentColor` |
| `img` | Full-color SVG |
| `inline` | Curated DOM SVG for selected two-tone glyphs |

Static assets are also available as package files if you need to host them yourself:

```ts
// e.g. resolve from node_modules
// node_modules/@ids/react/assets/icons/<shape>.svg
```

---

## Package contents

| Path | Description |
|------|-------------|
| `dist/` | ESM build, TypeScript `.d.ts`, and component CSS |
| `styles/ids-theme.css` | IDS design tokens (`import "@ids/react/ids-theme.css"`) |
| `fonts/` | Roboto variable font + `fonts.css` |
| `assets/` | Icons, images, status-bar assets |
| `VERSION` | Package version string (same as `package.json` version) |

---

## Maintainer scripts

| Script | Description |
|--------|-------------|
| `npm run sync` | Copy theme, assets, fonts; refresh `VERSION` + `exports` |
| `npm run build` | Sync + Vite library build → `dist/` |
| `npm run pack:local` | Build and produce `ids-react-0.1.0.tgz` |
| `npm run clean` | Remove `dist/` |

---

## Requirements checklist

1. Install the tarball (or later, the published package).
2. Import `@ids/react/ids-theme.css` once at app root.
3. Set `data-design-system="ids"` and `data-theme="light"|"dark"` on `<html>` / `<body>`.
4. Import components from `@ids/react/<slug>` (or `@ids/react`).
5. Use a bundler that processes CSS imports from `node_modules`.
