<!-- auto:generated:start -->
<!-- ds:inherits root-spec -->
# Toast Design Spec

> Generated 2026-06-12T07:10:01Z. Component-specific override spec — inherits global tokens, baselines, and theming from root-spec.md.

<!-- ds:section id=metadata -->
## Metadata

| Property | Value |
|---|---|
| Component | Toast |
| Category | Components |
| Figma Page | Components |
| Node ID | 48467:82945 |
| Design System | Synapse |

<!-- ds:section id=anatomy -->
## Anatomy

The component is composed of these structural parts:

- **actionsGroup**
- **close**
- **closeIcon**
- **closePlaceholder**
- **content**
- **contentGroup**
- **critical**
- **description**
- **iconWrap**
- **link**
- **major-warning**
- **minor-warning**
- **root**
- **variantIcon**
- **viewport**

Implementations must render these parts in order. Each part maps to a single DOM element (or equivalent in the target framework). Parts can be omitted if marked optional.

<!-- ds:section id=layout -->
## Layout & Measurements

<!-- ds:section id=tokens -->
## Component Tokens

> Global tokens (colors, spacing, typography, elevation): see [root-spec.md](../root-spec.md).
> Below are tokens referenced by this component's CSS module.

- `var(--border-width-border-default)` = 1px
- `var(--border-width-border-thick)` = 2px
- `var(--color-border-brand-base)` = #0076ce (light) / #4c9fdd (dark)
- `var(--color-border-white)` = #ffffff
- `var(--color-icon-alerting-critical)` = #af0000 (light) / #c74c4c (dark)
- `var(--color-icon-alerting-info)` = ?
- `var(--color-icon-alerting-major)` = #ed6400 (light) / #f2934c (dark)
- `var(--color-icon-alerting-minor)` = ?
- `var(--color-icon-alerting-success)` = ?
- `var(--color-icon-white)` = #ffffff
- `var(--color-static-gray-900)` = #252525
- `var(--color-static-gray-white)` = #ffffff
- `var(--color-text-white)` = #ffffff
- `var(--corner-radius-radius-2)` = 2px
- `var(--font-line-height-line-height-20)` = 20px
- `var(--font-size-body-2)` = 14px
- `var(--padding-padding-14)` = 14px
- `var(--padding-padding-16)` = 16px
- `var(--padding-padding-2)` = 2px
- `var(--padding-padding-24)` = 24px
- `var(--scale-12)` = 12px
- `var(--scale-16)` = 16px
- `var(--spacing-space-2)` = 2px
- `var(--spacing-space-24)` = 24px
- `var(--spacing-space-32)` = 32px
- `var(--spacing-space-8)` = 8px
- `var(--toast-control-radius)` = var(--corner-radius-radius-8)
- `var(--typography-font-style-primary)` = ?

<!-- ds:section id=states-light -->
## States (Light Theme)

| Variant | State | Background | Border | Text / Icon | Other |
|---|---|---|---|---|---|
| default | default | `var(--color-static-gray-900)` (#252525) | `var(--color-border-white)` (#ffffff) | `var(--color-icon-white)` (#ffffff) | radius: `var(--corner-radius-radius-2)` |
| default | focus |  |  |  | focus-ring: `var(--border-width-border-thick)` `var(--color-border-brand-base)` |
| info | default |  |  | `var(--color-icon-alerting-info)` |  |
| success | default |  |  | `var(--color-icon-alerting-success)` |  |

<!-- ds:section id=states-dark -->
## States (Dark Theme)

| Variant | State | Background | Border | Text / Icon | Other |
|---|---|---|---|---|---|
| default | default | `var(--color-static-gray-900)` (#252525) | `var(--color-border-white)` (#ffffff) | `var(--color-icon-white)` (#ffffff) | radius: `var(--corner-radius-radius-2)` |
| default | focus |  |  |  | focus-ring: `var(--border-width-border-thick)` `var(--color-border-brand-base)` |
| info | default |  |  | `var(--color-icon-alerting-info)` |  |
| success | default |  |  | `var(--color-icon-alerting-success)` |  |

<!-- ds:section id=interactions -->
## Interactions (Component-Specific)

> Baseline interactions (focus management, Tab/Enter/Space/Escape, touch targets) are defined in root-spec.md.
> This section documents additional or overriding behaviors for this component.

**Pattern**: notification

### Behaviors

- Auto-dismiss after configurable duration (default 5s)
- Pause dismiss timer on hover or focus
- Manual dismiss via close button
- Multiple toasts stack vertically
- Content announced to screen readers on appearance

### Keyboard

| Key | Action |
|---|---|
| Tab | Move focus to the close button |
| Escape | Dismiss the toast |

### ARIA

| Element | Attributes |
|---|---|
| root | {'role': 'alert | status', 'aria-live': 'polite (info/success) | assertive (error/warning)', 'aria-atomic': 'true'} |

## Source Mapping

| Source | Location |
|---|---|
| Root spec | `components/synapse/root-spec.md` |
| Figma variables | Extracted via `figma_get_local_variables` MCP tool |
| Theme CSS | `components/synapse-theme.css` |
| Component map | `data/synapse-component-figma-map.json` |
<!-- auto:generated:end -->
