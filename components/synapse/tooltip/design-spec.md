<!-- auto:generated:start -->
<!-- ds:inherits root-spec -->
# Tooltip Design Spec

> Generated 2026-06-12T07:10:01Z. Component-specific override spec — inherits global tokens, baselines, and theming from root-spec.md.

<!-- ds:section id=metadata -->
## Metadata

| Property | Value |
|---|---|
| Component | Tooltip |
| Category | Components |
| Figma Page | Components |
| Node ID | 48625:111469 |
| Design System | Synapse |

<!-- ds:section id=anatomy -->
## Anatomy

The component is composed of these structural parts:

- **arrow**
- **arrowFill**
- **arrowStroke**
- **arrowSvg**
- **body**
- **close**
- **content**
- **header**
- **popup**
- **popupDismissible**
- **popupStandard**
- **title**
- **trigger**

Implementations must render these parts in order. Each part maps to a single DOM element (or equivalent in the target framework). Parts can be omitted if marked optional.

<!-- ds:section id=layout -->
## Layout & Measurements

<!-- ds:section id=tokens -->
## Component Tokens

> Global tokens (colors, spacing, typography, elevation): see [root-spec.md](../root-spec.md).
> Below are tokens referenced by this component's CSS module.

- `var(--border-width-border-1)` = var(--border-width-border-default)
- `var(--color-background-surface-2)` = #ffffff (light) / #1e262c (dark)
- `var(--color-border-accessible)` = #757575 (light) / #8898a5 (dark)
- `var(--color-icon-neutral)` = #4d4d4d (light) / #b8c1c9 (dark)
- `var(--color-text-neutral)` = #4d4d4d (light) / #b8c1c9 (dark)
- `var(--color-text-neutral-strong)` = #252525 (light) / #e6e9ec (dark)
- `var(--corner-radius-radius-8)` = 8px
- `var(--font-line-height-line-height-20)` = 20px
- `var(--font-size-body-2)` = 14px
- `var(--padding-padding-12)` = 12px
- `var(--spacing-space-4)` = 4px
- `var(--spacing-space-8)` = 8px

<!-- ds:section id=states-light -->
## States (Light Theme)

| Variant | State | Background | Border | Text / Icon | Other |
|---|---|---|---|---|---|
| default | default | `var(--color-background-surface-2)` (#ffffff) | `var(--border-width-border-1)` (var(--border-width-border-default)) `var(--color-border-accessible)` (#757575) | `var(--color-icon-neutral)` (#4d4d4d) | radius: `var(--corner-radius-radius-8)` |

<!-- ds:section id=states-dark -->
## States (Dark Theme)

| Variant | State | Background | Border | Text / Icon | Other |
|---|---|---|---|---|---|
| default | default | `var(--color-background-surface-2)` (#1e262c) | `var(--border-width-border-1)` (var(--border-width-border-default)) `var(--color-border-accessible)` (#8898a5) | `var(--color-icon-neutral)` (#b8c1c9) | radius: `var(--corner-radius-radius-8)` |

<!-- ds:section id=interactions -->
## Interactions (Component-Specific)

> Baseline interactions (focus management, Tab/Enter/Space/Escape, touch targets) are defined in root-spec.md.
> This section documents additional or overriding behaviors for this component.

**Pattern**: tooltip

### Behaviors

- Appears on hover (mouse) after ~200ms delay
- Appears on focus (keyboard) without delay
- Disappears on mouse leave or blur
- Contains no interactive content (text only)

### Keyboard

| Key | Action |
|---|---|
| Escape | Dismiss the tooltip when trigger is focused |

### ARIA

| Element | Attributes |
|---|---|
| tooltip | {'role': 'tooltip'} |
| trigger | {'aria-describedby': 'ID of the tooltip element'} |

## Source Mapping

| Source | Location |
|---|---|
| Root spec | `components/synapse/root-spec.md` |
| Figma variables | Extracted via `figma_get_local_variables` MCP tool |
| Theme CSS | `components/synapse-theme.css` |
| Component map | `data/synapse-component-figma-map.json` |
<!-- auto:generated:end -->
