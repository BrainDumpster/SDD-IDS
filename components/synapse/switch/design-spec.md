<!-- auto:generated:start -->
<!-- ds:inherits root-spec -->
# Switch Design Spec

> Generated 2026-06-12T07:10:01Z. Component-specific override spec — inherits global tokens, baselines, and theming from root-spec.md.

<!-- ds:section id=metadata -->
## Metadata

| Property | Value |
|---|---|
| Component | Switch |
| Category | Form Elements |
| Figma Page | Form Elements |
| Node ID | 52721:273164 |
| Design System | Synapse |

<!-- ds:section id=anatomy -->
## Anatomy

The component is composed of these structural parts:

- **formLabel**
- **required**
- **root**
- **stateText**
- **stateTextDisabled**
- **thumb**
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
- `var(--color-background-brand-base)` = #0076ce (light) / #4c9fdd (dark)
- `var(--color-background-brand-strong)` = #0062ab (light) / #94c5ea (dark)
- `var(--color-background-component)` = #ffffff (light) / #111619 (dark)
- `var(--color-background-gray-light)` = #eaeaea (light) / #393939 (dark)
- `var(--color-background-gray-neutral-dark)` = #616161 (light) / #8898a5 (dark)
- `var(--color-background-gray-neutral-darker)` = #252525 (light) / #b8c1c9 (dark)
- `var(--color-border-accessible)` = #757575 (light) / #8898a5 (dark)
- `var(--color-border-brand-base)` = #0076ce (light) / #4c9fdd (dark)
- `var(--color-border-brand-dark)` = #0062ab (light) / #94c5ea (dark)
- `var(--color-border-disabled)` = #757575 (light) / #9e9e9e (dark)
- `var(--color-border-strong)` = #252525 (light) / #b8c1c9 (dark)
- `var(--color-text-disabled)` = #757575 (light) / #9e9e9e (dark)
- `var(--color-text-neutral)` = #4d4d4d (light) / #b8c1c9 (dark)
- `var(--color-text-neutral-strong)` = #252525 (light) / #e6e9ec (dark)
- `var(--font-line-height-line-height-20)` = 20px
- `var(--font-size-body-2)` = 14px
- `var(--spacing-space-8)` = 8px

<!-- ds:section id=states-light -->
## States (Light Theme)

| Variant | State | Background | Border | Text / Icon | Other |
|---|---|---|---|---|---|
| default | checked | `var(--color-background-component)` (#ffffff) | `var(--color-border-disabled)` (#757575) |  |  |
| default | default | `var(--color-background-component)` (#ffffff) | `var(--border-width-border-1)` (var(--border-width-border-default)) `var(--color-border-accessible)` (#757575) | `var(--color-text-disabled)` (#757575) |  |
| default | disabled | `var(--color-background-gray-light)` (#eaeaea) | `var(--color-border-disabled)` (#757575) |  |  |
| default | focus |  | `var(--border-width-border-1)` (var(--border-width-border-default)) `var(--color-border-brand-base)` (#0076ce) |  |  |
| default | hover | `var(--color-background-brand-strong)` (#0062ab) | `var(--color-border-brand-dark)` (#0062ab) |  |  |

<!-- ds:section id=states-dark -->
## States (Dark Theme)

| Variant | State | Background | Border | Text / Icon | Other |
|---|---|---|---|---|---|
| default | checked | `var(--color-background-component)` (#111619) | `var(--color-border-disabled)` (#9e9e9e) |  |  |
| default | default | `var(--color-background-component)` (#111619) | `var(--border-width-border-1)` (var(--border-width-border-default)) `var(--color-border-accessible)` (#8898a5) | `var(--color-text-disabled)` (#9e9e9e) |  |
| default | disabled | `var(--color-background-gray-light)` (#393939) | `var(--color-border-disabled)` (#9e9e9e) |  |  |
| default | focus |  | `var(--border-width-border-1)` (var(--border-width-border-default)) `var(--color-border-brand-base)` (#4c9fdd) |  |  |
| default | hover | `var(--color-background-brand-strong)` (#94c5ea) | `var(--color-border-brand-dark)` (#94c5ea) |  |  |

<!-- ds:section id=interactions -->
## Interactions (Component-Specific)

> Baseline interactions (focus management, Tab/Enter/Space/Escape, touch targets) are defined in root-spec.md.
> This section documents additional or overriding behaviors for this component.

**Pattern**: toggle

### Behaviors

- Toggles between on and off (binary state)
- Triggers immediate action (no form submit required)
- Visually distinct from checkbox to signal immediate effect

### Keyboard

| Key | Action |
|---|---|
| Space | Toggle the switch |
| Enter | Toggle the switch |

### ARIA

| Element | Attributes |
|---|---|
| root | {'role': 'switch', 'aria-checked': 'true/false', 'aria-labelledby': 'ID of the associated label'} |

## Source Mapping

| Source | Location |
|---|---|
| Root spec | `components/synapse/root-spec.md` |
| Figma variables | Extracted via `figma_get_local_variables` MCP tool |
| Theme CSS | `components/synapse-theme.css` |
| Component map | `data/synapse-component-figma-map.json` |
<!-- auto:generated:end -->
