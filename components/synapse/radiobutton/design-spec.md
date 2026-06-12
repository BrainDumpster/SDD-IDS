<!-- auto:generated:start -->
<!-- ds:inherits root-spec -->
# RadioButton Design Spec

> Generated 2026-06-12T07:10:01Z. Component-specific override spec — inherits global tokens, baselines, and theming from root-spec.md.

<!-- ds:section id=metadata -->
## Metadata

| Property | Value |
|---|---|
| Component | RadioButton |
| Category | Form Elements |
| Figma Page | Form Elements |
| Node ID | 11067:54579 |
| Design System | Synapse |

<!-- ds:section id=anatomy -->
## Anatomy

The component is composed of these structural parts:

- **field**
- **group**
- **indicator**
- **label**
- **root**
- **wrapper**

Implementations must render these parts in order. Each part maps to a single DOM element (or equivalent in the target framework). Parts can be omitted if marked optional.

<!-- ds:section id=layout -->
## Layout & Measurements

> Layout data not yet extracted. Run `python scripts/figma_layout_enricher.py` to populate.

<!-- ds:section id=tokens -->
## Component Tokens

> Global tokens (colors, spacing, typography, elevation): see [root-spec.md](../root-spec.md).
> Below are tokens referenced by this component's CSS module.

- `var(--border-width-border-1)` = var(--border-width-border-default)
- `var(--color-background-component)` = #ffffff (light) / #111619 (dark)
- `var(--color-background-gray-light)` = #eaeaea (light) / #393939 (dark)
- `var(--color-border-accessible)` = #757575 (light) / #8898a5 (dark)
- `var(--color-border-brand-base)` = #0076ce (light) / #4c9fdd (dark)
- `var(--color-border-disabled)` = #757575 (light) / #9e9e9e (dark)
- `var(--color-border-strong)` = #252525 (light) / #b8c1c9 (dark)
- `var(--color-icon-brand-base)` = #0076ce (light) / #4c9fdd (dark)
- `var(--color-icon-brand-strong)` = #0062ab (light) / #94c5ea (dark)
- `var(--color-icon-disabled)` = #757575 (light) / #c5c5c5 (dark)
- `var(--color-text-disabled)` = #757575 (light) / #9e9e9e (dark)
- `var(--color-text-neutral)` = #4d4d4d (light) / #b8c1c9 (dark)
- `var(--font-line-height-line-height-20)` = 20px
- `var(--font-size-body-2)` = 14px
- `var(--spacing-space-16)` = 16px
- `var(--spacing-space-4)` = 4px
- `var(--spacing-space-8)` = 8px

<!-- ds:section id=states-light -->
## States (Light Theme)

| Variant | State | Background | Border | Text / Icon | Other |
|---|---|---|---|---|---|
| default | active | `var(--color-background-component)` (#ffffff) | `var(--color-border-strong)` (#252525) |  |  |
| default | checked | `var(--color-icon-brand-strong)` (#0062ab) | `var(--color-border-strong)` (#252525) |  |  |
| default | default | `var(--color-icon-brand-base)` (#0076ce) | `var(--border-width-border-1)` (var(--border-width-border-default)) `var(--color-border-accessible)` (#757575) | `var(--color-text-neutral)` (#4d4d4d) | focus-ring: `var(--border-width-border-1)` `var(--color-border-brand-base)` |
| default | disabled | `var(--color-background-component)` (#ffffff) | `var(--color-border-strong)` (#252525) | `var(--color-text-disabled)` (#757575) |  |
| default | focus |  |  |  | focus-ring: `var(--border-width-border-1)` `var(--color-border-brand-base)` |
| default | hover | `var(--color-icon-brand-strong)` (#0062ab) | `var(--color-border-strong)` (#252525) |  |  |

<!-- ds:section id=states-dark -->
## States (Dark Theme)

| Variant | State | Background | Border | Text / Icon | Other |
|---|---|---|---|---|---|
| default | active | `var(--color-background-component)` (#111619) | `var(--color-border-strong)` (#b8c1c9) |  |  |
| default | checked | `var(--color-icon-brand-strong)` (#94c5ea) | `var(--color-border-strong)` (#b8c1c9) |  |  |
| default | default | `var(--color-icon-brand-base)` (#4c9fdd) | `var(--border-width-border-1)` (var(--border-width-border-default)) `var(--color-border-accessible)` (#8898a5) | `var(--color-text-neutral)` (#b8c1c9) | focus-ring: `var(--border-width-border-1)` `var(--color-border-brand-base)` |
| default | disabled | `var(--color-background-component)` (#111619) | `var(--color-border-strong)` (#b8c1c9) | `var(--color-text-disabled)` (#9e9e9e) |  |
| default | focus |  |  |  | focus-ring: `var(--border-width-border-1)` `var(--color-border-brand-base)` |
| default | hover | `var(--color-icon-brand-strong)` (#94c5ea) | `var(--color-border-strong)` (#b8c1c9) |  |  |

<!-- ds:section id=interactions -->
## Interactions (Component-Specific)

> Baseline interactions (focus management, Tab/Enter/Space/Escape, touch targets) are defined in root-spec.md.
> This section documents additional or overriding behaviors for this component.

**Pattern**: radio-group

### Behaviors

- Single selection within a group of options
- Arrow keys move selection between radio buttons
- Selection wraps from last to first and vice versa

### Keyboard

| Key | Action |
|---|---|
| ArrowUp | Select previous radio button |
| ArrowLeft | Select previous radio button |
| ArrowDown | Select next radio button |
| ArrowRight | Select next radio button |
| Tab | Enter or leave the radio group (does not move between radios) |

### ARIA

| Element | Attributes |
|---|---|
| group | {'role': 'radiogroup', 'aria-labelledby': 'ID of the group label'} |
| radio | {'role': 'radio', 'aria-checked': 'true on the selected radio'} |

## Source Mapping

| Source | Location |
|---|---|
| Root spec | `components/synapse/root-spec.md` |
| Figma variables | Extracted via `figma_get_local_variables` MCP tool |
| Theme CSS | `components/synapse-theme.css` |
| Component map | `data/synapse-component-figma-map.json` |
<!-- auto:generated:end -->
