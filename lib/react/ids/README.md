# `@ids/react`

IDS React components (CSS Modules) generated from design-spec. Private package — deliver via `npm pack` for now; registry publish is deferred.

## Install (local tarball)

```bash
cd lib/react/ids
npm install
npm run pack:local
# → ids-react-0.1.0.tgz (or @ids-react-0.1.0.tgz)

# In the consumer app:
npm install /path/to/ids-react-0.1.0.tgz
```

## Setup

Load theme (and optionally fonts) once at the app root, and set host attributes:

```tsx
import "@ids/react/ids-theme.css";
import "@ids/react/fonts.css"; // optional if the host already loads Roboto

// On <html> or <body>:
//   data-design-system="ids"
//   data-theme="light" | "dark"
```

## Usage

```tsx
import { IdsButton, IdsButtonLabel } from "@ids/react/button";
// or: import { IdsButton, IdsButtonLabel } from "@ids/react";

<IdsButton variant="primary">
  <IdsButtonLabel>Save</IdsButtonLabel>
</IdsButton>
```

Subpath imports match Storybook: `@ids/react/<component-slug>`.

## Package contents

| Path | Description |
|------|-------------|
| `dist/` | ESM build + TypeScript declarations + component CSS |
| `styles/ids-theme.css` | IDS design tokens (from `components/ids-theme.css`) |
| `assets/` | Icons, images, status-bar assets |
| `fonts/` | Roboto variable font + `fonts.css` |
| `VERSION` | Package version string |

## Scripts

- `npm run sync` — copy theme, assets, fonts; refresh `VERSION` + `exports`
- `npm run build` — sync + Vite library build
- `npm run pack:local` — build and produce a `.tgz`
