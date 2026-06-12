<!-- auto:generated:start -->
<!-- ds:inherits root-spec -->
# Pagination Design Spec

> Generated 2026-06-12T07:10:00Z. Component-specific override spec — inherits global tokens, baselines, and theming from root-spec.md.

<!-- ds:section id=metadata -->
## Metadata

| Property | Value |
|---|---|
| Component | Pagination |
| Category | Tables |
| Figma Page | Tables |
| Node ID | 37721:115815 |
| Design System | Synapse |

<!-- ds:section id=anatomy -->
## Anatomy

The component is composed of these structural parts:

- **button**
- **current**
- **ellipsis**
- **pageButton**
- **pages**
- **pagination**
- **prevNext**

Implementations must render these parts in order. Each part maps to a single DOM element (or equivalent in the target framework). Parts can be omitted if marked optional.

<!-- ds:section id=layout -->
## Layout & Measurements

<!-- ds:section id=tokens -->
## Component Tokens

> Global tokens (colors, spacing, typography, elevation): see [root-spec.md](../root-spec.md).
> Below are tokens referenced by this component's CSS module.

- `var(--border-width-border-1)` = var(--border-width-border-default)
- `var(--border-width-border-2)` = var(--border-width-border-thick)
- `var(--color-background-component)` = #ffffff (light) / #111619 (dark)
- `var(--color-background-controls-brand-base)` = #0076ce
- `var(--color-background-controls-brand-strong)` = #0062ab
- `var(--color-background-surface-1)` = #f4f4f4 (light) / #111619 (dark)
- `var(--color-border-brand-base)` = #0076ce (light) / #4c9fdd (dark)
- `var(--color-border-light)` = #c5c5c5 (light) / #34414c (dark)
- `var(--color-border-neutral-light)` = #757575 (light) / #34414c (dark)
- `var(--color-text-neutral)` = #4d4d4d (light) / #b8c1c9 (dark)
- `var(--color-text-neutral-strong)` = #252525 (light) / #e6e9ec (dark)
- `var(--color-text-white)` = #ffffff
- `var(--corner-radius-radius-4)` = 4px
- `var(--font-size-body-2)` = 14px
- `var(--padding-padding-6)` = 6px
- `var(--padding-padding-8)` = 8px
- `var(--scale-32)` = 32px
- `var(--spacing-space-2)` = 2px
- `var(--spacing-space-4)` = 4px
- `var(--spacing-space-8)` = 8px

<!-- ds:section id=states-light -->
## States (Light Theme)

| Variant | State | Background | Border | Text / Icon | Other |
|---|---|---|---|---|---|
| default | default | `var(--color-background-controls-brand-base)` (#0076ce) | `var(--color-background-controls-brand-base)` (#0076ce) | `var(--color-text-neutral)` (#4d4d4d) | radius: `var(--corner-radius-radius-4)` |
| default | disabled |  |  |  | opacity: 0.5 |
| default | focus |  |  |  | focus-ring: `var(--border-width-border-2)` `var(--color-border-brand-base)` |
| default | hover | `var(--color-background-controls-brand-strong)` (#0062ab) | `var(--color-background-controls-brand-strong)` (#0062ab) |  |  |

<!-- ds:section id=states-dark -->
## States (Dark Theme)

| Variant | State | Background | Border | Text / Icon | Other |
|---|---|---|---|---|---|
| default | default | `var(--color-background-controls-brand-base)` (#0076ce) | `var(--color-background-controls-brand-base)` (#0076ce) | `var(--color-text-neutral)` (#b8c1c9) | radius: `var(--corner-radius-radius-4)` |
| default | disabled |  |  |  | opacity: 0.5 |
| default | focus |  |  |  | focus-ring: `var(--border-width-border-2)` `var(--color-border-brand-base)` |
| default | hover | `var(--color-background-controls-brand-strong)` (#0062ab) | `var(--color-background-controls-brand-strong)` (#0062ab) |  |  |

<!-- ds:section id=interactions -->
## Interactions (Component-Specific)

> Baseline interactions (focus management, Tab/Enter/Space/Escape, touch targets) are defined in root-spec.md.
> This section documents additional or overriding behaviors for this component.

**Pattern**: navigation

### Behaviors

- Navigate between pages of paginated content
- Displays current page indicator
- Previous/Next buttons for sequential navigation
- Optional direct page number input

### Keyboard

| Key | Action |
|---|---|
| Tab | Move focus between pagination controls |
| Enter | Navigate to the focused page or activate prev/next |

### ARIA

| Element | Attributes |
|---|---|
| nav | {'element': '<nav>', 'aria-label': 'Pagination'} |
| currentPage | {'aria-current': 'page'} |
| prevNext | {'aria-disabled': 'true when at first/last page boundary'} |

## Source Mapping

| Source | Location |
|---|---|
| Root spec | `components/synapse/root-spec.md` |
| Figma variables | Extracted via `figma_get_local_variables` MCP tool |
| Theme CSS | `components/synapse-theme.css` |
| Component map | `data/synapse-component-figma-map.json` |
<!-- auto:generated:end -->
