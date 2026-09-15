# Synapse React façade

Reusable Synapse React lives in `lib/react/synapse/`. It does **not** clone `lib/react/ids`.

| Class | Strategy | What you get |
|---|---|---|
| Token-only ids-fork | `reexport` | `SynapseX` is `IdsX`. Visuals come from theme CSS. |
| Chrome/layout delta | `overlay-css` / `wrapper` | Same `IdsX` plus a Synapse class or thin wrapper. |
| Extra slots / defaults | `wrapper` | Synapse file only; IDS stays programme-agnostic. |
| No IDS counterpart | `standalone` | Implemented under this folder (`SynapseX`). Topology canvas is not in this pass. |

Inventory: [`react-strategy.json`](./react-strategy.json).

## Consumer setup

1. Import components from `lib/react/synapse` (or a path alias that points here).
2. Load **`components/synapse-theme.css` only**. Do not load `components/ids-theme.css` in the same app.
3. Do not depend on `@base-ui-components/react` for Synapse (or any programme).

```tsx
import "components/synapse-theme.css";
import { SynapseButton, SynapseButtonLabel } from "@synapse/react";
```

Storybook Vite alias: `@synapse/react` → `lib/react/synapse` (see `storybook/.storybook/main.ts`).

## Naming

Public names are `Synapse` + PascalCase anatomy (`SynapseButton`, `SynapseLeftNav`). Internals still render IDS `data-ids` / CSS module classes — that is intentional sharing, not a second implementation.

## Do not

- Copy `lib/react/ids/<slug>` into `lib/react/synapse/<slug>` for ids-fork components.
- Add `[data-programme="synapse"]` CSS to new IDS components. Overlays belong here.
- Mix IDS and Synapse theme stylesheets.
