<!-- auto:generated:start -->
<!-- ds:inherits root-spec -->
# AppLauncher Design Spec

> Generated 2026-06-12T07:10:00Z. Component-specific override spec — inherits global tokens, baselines, and theming from root-spec.md.

<!-- ds:section id=metadata -->
## Metadata

| Property | Value |
|---|---|
| Component | AppLauncher |
| Category | Components |
| Figma Page | Components |
| Node ID | 13231:123761 |
| Design System | Synapse |

<!-- ds:section id=anatomy -->
## Anatomy

The component is composed of these structural parts:

- **appName**
- **appTile**
- **appTileTwoProduct**
- **columnDivider**
- **columnDividerSolid**
- **defaultProductIcon**
- **footerAction**
- **iconSlot**
- **labelStack**
- **labelStackNoIcon**
- **launcherPopup**
- **launcherSurface**
- **launcherSurfaceSingleProduct**
- **launcherSurfaceTwoProduct**
- **optionItem**
- **optionsFooter**
- **optionsList**
- **optionsRegion**
- **optionsRegionWithSeparator**
- **productIconImg**
- **productRegion**
- **productRow**
- **productRowGroup**
- **productRowSingle**
- **programmeSynapseTile**
- **rowDivider**
- **tileDivider**
- **tileDividerDotted**
- **tileDividerSolid**
- **trigger**
- **triggerIcon**
- **triggerMasthead**

Implementations must render these parts in order. Each part maps to a single DOM element (or equivalent in the target framework). Parts can be omitted if marked optional.

<!-- ds:section id=layout -->
## Layout & Measurements

> Layout data not yet extracted. Run `python scripts/figma_layout_enricher.py` to populate.

<!-- ds:section id=tokens -->
## Component Tokens

> Global tokens (colors, spacing, typography, elevation): see [root-spec.md](../root-spec.md).
> Below are tokens referenced by this component's CSS module.

- `var(--app-launcher-column-divider-color)` = ?
- `var(--app-launcher-column-divider-height)` = ?
- `var(--app-launcher-column-divider-inset-block)` = ?
- `var(--app-launcher-divider-inset)` = ?
- `var(--app-launcher-row-divider-width)` = ?
- `var(--app-launcher-tile-height)` = ?
- `var(--border-width-border-1)` = var(--border-width-border-default)
- `var(--border-width-border-2)` = var(--border-width-border-thick)
- `var(--color-background-brand-light)` = #d9eaf8 (light) / #34414c (dark)
- `var(--color-background-brand-lighter)` = #ebf4fb (light) / #1e262c (dark)
- `var(--color-background-component)` = #ffffff (light) / #111619 (dark)
- `var(--color-background-gray-lighter)` = #f4f4f4 (light) / #393939 (dark)
- `var(--color-background-masthead-brand-base)` = #0076ce (light) / #1e262c (dark)
- `var(--color-background-masthead-brand-strong)` = #0062ab (light) / #34414c (dark)
- `var(--color-background-masthead-brand-stronger)` = #06528a (light) / #455666 (dark)
- `var(--color-background-surface-2)` = #ffffff (light) / #1e262c (dark)
- `var(--color-border-accessible)` = #757575 (light) / #8898a5 (dark)
- `var(--color-border-brand-base)` = #0076ce (light) / #4c9fdd (dark)
- `var(--color-border-brand-neutral)` = #0076ce (light) / #8898a5 (dark)
- `var(--color-border-light)` = #c5c5c5 (light) / #34414c (dark)
- `var(--color-border-neutral-light)` = #757575 (light) / #34414c (dark)
- `var(--color-border-white)` = #ffffff
- `var(--color-icon-brand-strong)` = #0062ab (light) / #94c5ea (dark)
- `var(--color-icon-neutral)` = #4d4d4d (light) / #b8c1c9 (dark)
- `var(--color-text-brand-strong)` = #0062ab (light) / #94c5ea (dark)
- `var(--color-text-neutral)` = #4d4d4d (light) / #b8c1c9 (dark)
- `var(--color-text-neutral-strong)` = #252525 (light) / #e6e9ec (dark)
- `var(--color-text-white)` = #ffffff
- `var(--corner-radius-radius-4)` = 4px
- `var(--font-line-height-line-height-20)` = 20px
- `var(--font-size-body-2)` = 14px
- `var(--padding-padding-1)` = 1px
- `var(--padding-padding-10)` = 10px
- `var(--padding-padding-16)` = 16px
- `var(--padding-padding-2)` = 2px
- `var(--padding-padding-24)` = 24px
- `var(--padding-padding-28)` = 28px
- `var(--padding-padding-52)` = 52px
- `var(--padding-padding-8)` = 8px
- `var(--separator-inset)` = ?
- `var(--shadow-drop-shadow-2-blur)` = 2px
- `var(--shadow-drop-shadow-2-color)` = rgba(37,37,37,0.08) (light) / rgba(17,22,25,0.08) (dark)
- `var(--shadow-drop-shadow-2-spread)` = 0px
- `var(--shadow-drop-shadow-2-x)` = 0px
- `var(--shadow-drop-shadow-2-y)` = 2px
- `var(--shadow-drop-shadow-4-blur)` = 4px
- `var(--shadow-drop-shadow-4-color)` = rgba(37,37,37,0.08) (light) / rgba(17,22,25,0.08) (dark)
- `var(--shadow-drop-shadow-4-spread)` = 0px
- `var(--shadow-drop-shadow-4-x)` = 0px
- `var(--shadow-drop-shadow-4-y)` = 4px
- `var(--spacing-space-1)` = 1px
- `var(--spacing-space-12)` = 12px

<!-- ds:section id=states-light -->
## States (Light Theme)

| Variant | State | Background | Border | Text / Icon | Other |
|---|---|---|---|---|---|
| default | active | `var(--color-background-brand-light)` (#d9eaf8) |  | `var(--color-text-brand-strong)` (#0062ab) | shadow: `var(--color-border-brand-neutral)` `var(--color-border-brand-neutral)` |
| default | default | `var(--color-background-brand-light)` (#d9eaf8) | `var(--border-width-border-1)` (var(--border-width-border-default)) `var(--color-border-brand-base)` (#0076ce) | `var(--color-icon-brand-strong)` (#0062ab) | shadow: `var(--shadow-drop-shadow-2-x)` `var(--shadow-drop-shadow-2-y)` `var(--shadow-drop-shadow-2-blur)` `var(--shadow-drop-shadow-2-spread)` `var(--shadow-drop-shadow-2-color)` `var(--shadow-drop-shadow-4-x)` `var(--shadow-drop-shadow-4-y)` `var(--shadow-drop-shadow-4-blur)` `var(--shadow-drop-shadow-4-spread)` `var(--shadow-drop-shadow-4-color)`; radius: `var(--corner-radius-radius-4)` |
| default | focus |  | `var(--border-width-border-1)` (var(--border-width-border-default)) `var(--color-border-brand-base)` (#0076ce) |  | focus-ring: `var(--border-width-border-2)` `var(--color-border-brand-base)`; radius: `var(--corner-radius-radius-4)` |
| default | hover | `var(--color-background-brand-lighter)` (#ebf4fb) |  | `var(--color-icon-neutral)` (#4d4d4d) | shadow: `var(--color-border-brand-neutral)` `var(--color-border-brand-neutral)` |

<!-- ds:section id=states-dark -->
## States (Dark Theme)

| Variant | State | Background | Border | Text / Icon | Other |
|---|---|---|---|---|---|
| default | active | `var(--color-background-brand-light)` (#34414c) |  | `var(--color-text-brand-strong)` (#94c5ea) | shadow: `var(--color-border-brand-neutral)` `var(--color-border-brand-neutral)` |
| default | default | `var(--color-background-brand-light)` (#34414c) | `var(--border-width-border-1)` (var(--border-width-border-default)) `var(--color-border-brand-base)` (#4c9fdd) | `var(--color-icon-brand-strong)` (#94c5ea) | shadow: `var(--shadow-drop-shadow-2-x)` `var(--shadow-drop-shadow-2-y)` `var(--shadow-drop-shadow-2-blur)` `var(--shadow-drop-shadow-2-spread)` `var(--shadow-drop-shadow-2-color)` `var(--shadow-drop-shadow-4-x)` `var(--shadow-drop-shadow-4-y)` `var(--shadow-drop-shadow-4-blur)` `var(--shadow-drop-shadow-4-spread)` `var(--shadow-drop-shadow-4-color)`; radius: `var(--corner-radius-radius-4)` |
| default | focus |  | `var(--border-width-border-1)` (var(--border-width-border-default)) `var(--color-border-brand-base)` (#4c9fdd) |  | focus-ring: `var(--border-width-border-2)` `var(--color-border-brand-base)`; radius: `var(--corner-radius-radius-4)` |
| default | hover | `var(--color-background-brand-lighter)` (#1e262c) |  | `var(--color-icon-neutral)` (#b8c1c9) | shadow: `var(--color-border-brand-neutral)` `var(--color-border-brand-neutral)` |

## Source Mapping

| Source | Location |
|---|---|
| Root spec | `components/synapse/root-spec.md` |
| Figma variables | Extracted via `figma_get_local_variables` MCP tool |
| Theme CSS | `components/synapse-theme.css` |
| Component map | `data/synapse-component-figma-map.json` |
<!-- auto:generated:end -->
