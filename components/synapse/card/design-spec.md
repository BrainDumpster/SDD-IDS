<!-- auto:generated:start -->
<!-- ds:inherits root-spec -->
# Card Design Spec

> Generated 2026-06-12T07:10:00Z. Component-specific override spec — inherits global tokens, baselines, and theming from root-spec.md.

<!-- ds:section id=metadata -->
## Metadata

| Property | Value |
|---|---|
| Component | Card |
| Category | Components |
| Figma Page | Components |
| Node ID | 50419:259141 |
| Design System | Synapse |

<!-- ds:section id=anatomy -->
## Anatomy

The component is composed of these structural parts:

- **body**
- **card**
- **footer**
- **header**
- **headerDivider**
- **headerIcon**
- **headerIconImage**
- **headerRow**
- **headerTitleCluster**
- **title**

Implementations must render these parts in order. Each part maps to a single DOM element (or equivalent in the target framework). Parts can be omitted if marked optional.

<!-- ds:section id=layout -->
## Layout & Measurements

<!-- ds:section id=tokens -->
## Component Tokens

> Global tokens (colors, spacing, typography, elevation): see [root-spec.md](../root-spec.md).
> Below are tokens referenced by this component's CSS module.

- `var(--border-width-border-1)` = var(--border-width-border-default)
- `var(--card-control-radius)` = var(--corner-radius-radius-10)
- `var(--color-background-component)` = #ffffff (light) / #111619 (dark)
- `var(--color-border-light)` = #c5c5c5 (light) / #34414c (dark)
- `var(--color-icon-accessible)` = #757575 (light) / #8898a5 (dark)
- `var(--color-text-neutral)` = #4d4d4d (light) / #b8c1c9 (dark)
- `var(--color-text-neutral-strong)` = #252525 (light) / #e6e9ec (dark)
- `var(--font-line-height-line-height-24)` = 24px
- `var(--font-line-height-line-height-25)` = 25px
- `var(--font-size-body-1)` = 16px
- `var(--font-size-header-6)` = 18px
- `var(--padding-padding-16)` = 16px
- `var(--padding-padding-8)` = 8px
- `var(--shadow-drop-shadow-4-blur)` = 4px
- `var(--shadow-drop-shadow-4-color)` = rgba(37,37,37,0.08) (light) / rgba(17,22,25,0.08) (dark)
- `var(--shadow-drop-shadow-4-x)` = 0px
- `var(--shadow-drop-shadow-4-y)` = 4px

<!-- ds:section id=states-light -->
## States (Light Theme)

| Variant | State | Background | Border | Text / Icon | Other |
|---|---|---|---|---|---|
| default | default | `var(--color-background-component)` (#ffffff) | `var(--border-width-border-1)` (var(--border-width-border-default)) `var(--color-border-light)` (#c5c5c5) | `var(--color-text-neutral)` (#4d4d4d) | radius: `var(--card-control-radius)` |
| elevated | default |  |  |  | shadow: `var(--shadow-drop-shadow-4-x)` `var(--shadow-drop-shadow-4-y)` `var(--shadow-drop-shadow-4-blur)` `var(--shadow-drop-shadow-4-color)` |
| outlined | default |  | `var(--color-border-light)` (#c5c5c5) |  |  |

<!-- ds:section id=states-dark -->
## States (Dark Theme)

| Variant | State | Background | Border | Text / Icon | Other |
|---|---|---|---|---|---|
| default | default | `var(--color-background-component)` (#111619) | `var(--border-width-border-1)` (var(--border-width-border-default)) `var(--color-border-light)` (#34414c) | `var(--color-text-neutral)` (#b8c1c9) | radius: `var(--card-control-radius)` |
| elevated | default |  |  |  | shadow: `var(--shadow-drop-shadow-4-x)` `var(--shadow-drop-shadow-4-y)` `var(--shadow-drop-shadow-4-blur)` `var(--shadow-drop-shadow-4-color)` |
| outlined | default |  | `var(--color-border-light)` (#34414c) |  |  |

## Source Mapping

| Source | Location |
|---|---|
| Root spec | `components/synapse/root-spec.md` |
| Figma variables | Extracted via `figma_get_local_variables` MCP tool |
| Theme CSS | `components/synapse-theme.css` |
| Component map | `data/synapse-component-figma-map.json` |
<!-- auto:generated:end -->
