<!-- auto:generated:start -->
<!-- ds:inherits root-spec -->
# DropdownMenu Design Spec

> Generated 2026-06-12T07:10:00Z. Component-specific override spec — inherits global tokens, baselines, and theming from root-spec.md.

<!-- ds:section id=metadata -->
## Metadata

| Property | Value |
|---|---|
| Component | DropdownMenu |
| Category | Components |
| Figma Page | Components |
| Node ID | 49971:54127 |
| Design System | Synapse |

<!-- ds:section id=anatomy -->
## Anatomy

The component is composed of these structural parts:

- **checkboxDash**
- **checkboxOuter**
- **checkboxTick**
- **clearAllButton**
- **footerAction**
- **item**
- **leadingControl**
- **optionsScrollRegion**
- **popup**
- **popupStandalone**
- **radioInner**
- **radioOuter**
- **searchField**
- **searchIcon**
- **searchInput**
- **searchInputWrap**
- **searchRow**
- **sectionDivider**
- **sectionHeader**
- **selectAllButton**
- **selectAllCheckbox**
- **selectAllClearAllRow**
- **triggerFull**
- **triggerMeasure**
- **triggerReset**

Implementations must render these parts in order. Each part maps to a single DOM element (or equivalent in the target framework). Parts can be omitted if marked optional.

<!-- ds:section id=layout -->
## Layout & Measurements

> Layout data not yet extracted. Run `python scripts/figma_layout_enricher.py` to populate.

<!-- ds:section id=tokens -->
## Component Tokens

> Global tokens (colors, spacing, typography, elevation): see [root-spec.md](../root-spec.md).
> Below are tokens referenced by this component's CSS module.

- `var(--border-width-border-1)` = var(--border-width-border-default)
- `var(--color-background-brand-light-slate)` = #d9eaf8 (light) / #34414c (dark)
- `var(--color-background-brand-lighter-slate)` = #ebf4fb (light) / #1e262c (dark)
- `var(--color-background-surface-component)` = #ffffff (light) / #111619 (dark)
- `var(--color-background-controls-base)` = #0076ce
- `var(--color-background-controls-strong)` = #0062ab
- `var(--color-background-gray-base)` = #757575 (light) / #9e9e9e (dark)
- `var(--color-background-gray-lighter)` = #f4f4f4 (light) / #393939 (dark)
- `var(--color-border-gray-neutral-base)` = #757575 (light) / #8898a5 (dark)
- `var(--color-border-brand-base)` = #0076ce (light) / #4c9fdd (dark)
- `var(--color-border-brand-base-neutral)` = #0076ce (light) / #8898a5 (dark)
- `var(--color-border-gray-disabled)` = #757575 (light) / #9e9e9e (dark)
- `var(--color-border-neutral-light)` = #757575 (light) / #34414c (dark)
- `var(--color-border-gray-neutral-strong)` = #252525 (light) / #b8c1c9 (dark)
- `var(--color-border-brand-transparent-brand)` = rgba(255,255,255,0.00) (light) / #4c9fdd (dark)
- `var(--color-icon-brand-base)` = #0076ce (light) / #4c9fdd (dark)
- `var(--color-icon-gray-disabled)` = #757575 (light) / #c5c5c5 (dark)
- `var(--color-icon-gray-inverse)` = #ffffff (light) / #252525 (dark)
- `var(--color-icon-gray-white)` = #ffffff
- `var(--color-text-brand-strong)` = #0062ab (light) / #94c5ea (dark)
- `var(--color-text-gray-disabled)` = #757575 (light) / #9e9e9e (dark)
- `var(--color-text-gray-neutral)` = #4d4d4d (light) / #b8c1c9 (dark)
- `var(--color-text-gray-neutral-strong)` = #252525 (light) / #e6e9ec (dark)
- `var(--dropdown-control-radius)` = var(--corner-radius-radius-4)
- `var(--dropdown-focus-ring-radius)` = var(--corner-radius-radius-4)
- `var(--dropdown-menu-radius)` = var(--corner-radius-radius-4)
- `var(--corner-radius-radius-2)` = 2px (checkbox leading control only)
- `var(--corner-radius-radius-6)` = 6px (search field)
- `var(--font-line-height-line-height-20)` = 20px
- `var(--font-size-body-2)` = 14px
- `var(--padding-padding-10)` = 10px
- `var(--padding-padding-16)` = 16px
- `var(--padding-padding-2)` = 2px
- `var(--padding-padding-4)` = 4px
- `var(--padding-padding-6)` = 6px
- `var(--padding-padding-8)` = 8px
- `var(--spacing-space-16)` = 16px
- `var(--spacing-space-8)` = 8px

<!-- ds:section id=states-light -->
## States (Light Theme)

| Variant | State | Background | Border | Text / Icon | Other |
|---|---|---|---|---|---|
| default | active | `var(--color-background-brand-light-slate)` (#d9eaf8) |  | `var(--color-text-brand-strong)` (#0062ab) | shadow: `var(--color-border-brand-base-neutral)` `var(--color-border-brand-base-neutral)` |
| default | default | `var(--color-icon-brand-base)` (#0076ce) | `var(--border-width-border-1)` (var(--border-width-border-default)) `var(--color-border-gray-neutral-base)` (#757575) | `var(--color-text-brand-strong)` (#0062ab) | radius: `var(--dropdown-control-radius)` |
| default | disabled | `var(--color-background-gray-base)` (#757575) | `var(--color-border-gray-disabled)` (#757575) | `var(--color-icon-gray-inverse)` (#ffffff) | shadow: `var(--color-border-neutral-light)` `var(--color-border-gray-disabled)` |
| default | focus |  | `var(--border-width-border-1)` (var(--border-width-border-default)) `var(--color-border-brand-base)` (#0076ce) |  | radius: `var(--dropdown-focus-ring-radius)` |
| default | highlighted | `var(--color-background-brand-lighter-slate)` (#ebf4fb) |  | `var(--color-text-gray-neutral)` (#4d4d4d) | shadow: `var(--color-border-brand-base)` `var(--color-border-brand-base)` |
| default | hover | `var(--color-background-controls-strong)` (#0062ab) | `var(--color-border-gray-neutral-strong)` (#252525) | `var(--color-text-gray-neutral)` (#4d4d4d) | shadow: `var(--color-border-brand-base)` `var(--color-border-brand-base)` |
| default | indeterminate | `var(--color-background-surface-component)` (#ffffff) | `var(--color-border-brand-base)` (#0076ce) |  |  |
| default | selected | `var(--color-background-surface-component)` (#ffffff) | `var(--color-border-brand-base)` (#0076ce) | `var(--color-text-gray-neutral)` (#4d4d4d) | shadow: `var(--color-border-brand-base-neutral)` `var(--color-border-brand-base-neutral)` |

<!-- ds:section id=states-dark -->
## States (Dark Theme)

| Variant | State | Background | Border | Text / Icon | Other |
|---|---|---|---|---|---|
| default | active | `var(--color-background-brand-light-slate)` (#34414c) |  | `var(--color-text-brand-strong)` (#94c5ea) | shadow: `var(--color-border-brand-base-neutral)` `var(--color-border-brand-base-neutral)` |
| default | default | `var(--color-icon-brand-base)` (#4c9fdd) | `var(--border-width-border-1)` (var(--border-width-border-default)) `var(--color-border-gray-neutral-base)` (#8898a5) | `var(--color-text-brand-strong)` (#94c5ea) | radius: `var(--dropdown-control-radius)` |
| default | disabled | `var(--color-background-gray-base)` (#9e9e9e) | `var(--color-border-gray-disabled)` (#9e9e9e) | `var(--color-icon-gray-inverse)` (#252525) | shadow: `var(--color-border-neutral-light)` `var(--color-border-gray-disabled)` |
| default | focus |  | `var(--border-width-border-1)` (var(--border-width-border-default)) `var(--color-border-brand-base)` (#4c9fdd) |  | radius: `var(--dropdown-focus-ring-radius)` |
| default | highlighted | `var(--color-background-brand-lighter-slate)` (#1e262c) |  | `var(--color-text-gray-neutral)` (#b8c1c9) | shadow: `var(--color-border-brand-base)` `var(--color-border-brand-base)` |
| default | hover | `var(--color-background-controls-strong)` (#0062ab) | `var(--color-border-gray-neutral-strong)` (#b8c1c9) | `var(--color-text-gray-neutral)` (#b8c1c9) | shadow: `var(--color-border-brand-base)` `var(--color-border-brand-base)` |
| default | indeterminate | `var(--color-background-surface-component)` (#111619) | `var(--color-border-brand-base)` (#4c9fdd) |  |  |
| default | selected | `var(--color-background-surface-component)` (#111619) | `var(--color-border-brand-base)` (#4c9fdd) | `var(--color-text-gray-neutral)` (#b8c1c9) | shadow: `var(--color-border-brand-base-neutral)` `var(--color-border-brand-base-neutral)` |

## Source Mapping

| Source | Location |
|---|---|
| Root spec | `components/synapse/root-spec.md` |
| Figma variables | Extracted via `figma_get_local_variables` MCP tool |
| Theme CSS | `components/synapse-theme.css` |
| Component map | `data/synapse-component-figma-map.json` |
<!-- auto:generated:end -->
