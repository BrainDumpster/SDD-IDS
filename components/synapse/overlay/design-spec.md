<!-- auto:generated:start -->
<!-- ds:inherits root-spec -->
# Overlay Design Spec

> Generated 2026-03-25T01:42:04Z. Component-specific override spec — inherits global tokens, baselines, and theming from root-spec.md.

<!-- ds:section id=metadata -->
## Metadata

| Property | Value |
|---|---|
| Component | Overlay |
| Category | Components |
| Figma Page | Components |
| Node ID | 49842:37303 |
| Design System | Synapse |

<!-- ds:section id=anatomy -->
## Anatomy

The component is composed of these structural parts:

- **backdrop**
- **body**
- **close**
- **header**
- **panel**
- **title**
- **triggerReset**

Implementations must render these parts in order. Each part maps to a single DOM element (or equivalent in the target framework). Parts can be omitted if marked optional.

<!-- ds:section id=layout -->
## Layout & Measurements

<!-- ds:section id=tokens -->
## Component Tokens

> Global tokens (colors, spacing, typography, elevation): see [root-spec.md](../root-spec.md).
> Below are tokens referenced by this component's CSS module.

- `var(--border-width-border-1)` = 1px
- `var(--border-width-border-2)` = 2px
- `var(--color-background-component)` = #ffffff (light) / #111619 (dark)
- `var(--color-background-gray-lighter)` = #f4f4f4 (light) / #393939 (dark)
- `var(--color-background-overlay-1)` = rgba(37, 37, 37, 0.65) (light) / rgba(37, 37, 37, 0.75) (dark)
- `var(--color-border-brand-base)` = #0076ce (light) / #4c9fdd (dark)
- `var(--color-border-lighter)` = #eaeaea (light) / #1e262c (dark)
- `var(--color-icon-neutral)` = #4d4d4d (light) / #b8c1c9 (dark)
- `var(--color-text-neutral-strong)` = #252525 (light) / #e6e9ec (dark)
- `var(--corner-radius-radius-4)` = 4px
- `var(--font-line-height-line-height-20)` = 20px
- `var(--font-size-body-2)` = 14px
- `var(--font-size-header-6)` = 18px
- `var(--padding-padding-16)` = 16px
- `var(--padding-padding-24)` = 24px
- `var(--scale-32)` = 32px
- `var(--shadow-drop-shadow-32-blur)` = 32px
- `var(--shadow-drop-shadow-32-color)` = rgba(37, 37, 37, 0.08) (light) / rgba(17, 22, 25, 0.08) (dark)
- `var(--shadow-drop-shadow-32-x)` = 0
- `var(--shadow-drop-shadow-32-y)` = 32px

<!-- ds:section id=states-light -->
## States (Light Theme)

| Variant | State | Background | Border | Text / Icon | Other |
|---|---|---|---|---|---|
| default | default | `var(--color-background-component)` (#ffffff) |  | `var(--color-text-neutral-strong)` (#252525) | shadow: `var(--shadow-drop-shadow-32-x)` `var(--shadow-drop-shadow-32-y)` `var(--shadow-drop-shadow-32-blur)` `var(--shadow-drop-shadow-32-color)`; radius: `var(--corner-radius-radius-4)` |
| default | focus |  |  |  | focus-ring: `var(--border-width-border-2)` `var(--color-border-brand-base)` |
| default | hover | `var(--color-background-gray-lighter)` (#f4f4f4) |  |  |  |

<!-- ds:section id=states-dark -->
## States (Dark Theme)

Dark theme uses the same semantic tokens as **States (Light Theme)**. Resolved values for `[data-theme="dark"]` / `.ids-theme-dark` (and program overlays) live in theme CSS:

- `components/ids-theme.css`
- `components/<program>-theme.css` when a program overlays IDS (for example `components/dap-theme.css`)

Duplicate the full state matrix in this section only when a dark row genuinely uses different `var(--...)` references than the corresponding light row.

*(When Light and Dark tables would list identical `var(--...)` cells, keep the matrix under **States (Light Theme)** only and use this pointer section instead of a second table.)*

## Interactions (Component-Specific)

> Baseline interactions (focus management, Tab/Enter/Space/Escape, touch targets) are defined in root-spec.md.
> This section documents additional or overriding behaviors for this component.

**Pattern**: overlay

### Behaviors

- Renders background dimming layer behind modal content
- Click overlay to dismiss (optional, configurable)
- Prevents background page scroll while active

### Keyboard

| Key | Action |
|---|---|
| Escape | Close the overlay and associated content |

### ARIA

| Element | Attributes |
|---|---|
| background | {'aria-hidden': 'true on all background content behind overlay'} |

## Source Mapping

| Source | Location |
|---|---|
| Root spec | `components/synapse/root-spec.md` |
| Figma variables | Extracted via `figma_get_local_variables` MCP tool |
| Theme CSS | `components/synapse-theme.css` |
| Component map | `data/synapse-component-figma-map.json` |
<!-- auto:generated:end -->
