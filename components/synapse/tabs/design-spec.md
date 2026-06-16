<!-- auto:generated:start -->
<!-- ds:inherits root-spec -->
# Tabs Design Spec

> Generated 2026-06-12T07:10:01Z. Component-specific override spec — inherits global tokens, baselines, and theming from root-spec.md.

<!-- ds:section id=metadata -->
## Metadata

| Property | Value |
|---|---|
| Component | Tabs |
| Category | Components |
| Figma Page | Components |
| Node ID | 47807:3185 |
| Design System | Synapse |

<!-- ds:section id=anatomy -->
## Anatomy

The component is composed of these structural parts:

- **addButton**
- **addButtonSecondary**
- **addIcon**
- **addLabel**
- **close**
- **closeIcon**
- **list**
- **listWrap**
- **moreIcon**
- **moreItem**
- **moreMenu**
- **moreTrigger**
- **moreTriggerPrimary**
- **moreTriggerSecondary**
- **moreTriggerSelected**
- **panel**
- **root**
- **selected**
- **tab**
- **tabIcon**
- **tabInner**
- **tabLabel**
- **tabPrimary**
- **tabSecondary**

Implementations must render these parts in order. Each part maps to a single DOM element (or equivalent in the target framework). Parts can be omitted if marked optional.

<!-- ds:section id=layout -->
## Layout & Measurements

<!-- ds:section id=tokens -->
## Component Tokens

> Global tokens (colors, spacing, typography, elevation): see [root-spec.md](../root-spec.md).
> Below are tokens referenced by this component's CSS module.

- `var(--border-width-border-1)` = var(--border-width-border-default)
- `var(--border-width-border-thick)` = 2px
- `var(--color-background-brand-light)` = #d9eaf8 (light) / #34414c (dark)
- `var(--color-background-brand-lighter)` = #ebf4fb (light) / #1e262c (dark)
- `var(--color-background-component)` = #ffffff (light) / #111619 (dark)
- `var(--color-background-n-tabs-x-hover)` = #d9eaf8 (light) / #455666 (dark)
- `var(--color-background-surface-2)` = #ffffff (light) / #1e262c (dark)
- `var(--color-border-accessible)` = #757575 (light) / #8898a5 (dark)
- `var(--color-border-brand-base)` = #0076ce (light) / #4c9fdd (dark)
- `var(--color-border-brand-dark)` = #0062ab (light) / #94c5ea (dark)
- `var(--color-border-light)` = #c5c5c5 (light) / #34414c (dark)
- `var(--color-border-lighter)` = #eaeaea (light) / #1e262c (dark)
- `var(--color-border-neutral-light)` = #757575 (light) / #34414c (dark)
- `var(--color-icon-neutral)` = #4d4d4d (light) / #b8c1c9 (dark)
- `var(--color-text-brand-strong)` = #0062ab (light) / #94c5ea (dark)
- `var(--color-text-neutral)` = #4d4d4d (light) / #b8c1c9 (dark)
- `var(--color-text-neutral-strong)` = #252525 (light) / #e6e9ec (dark)
- `var(--corner-radius-radius-4)` = 4px
- `var(--font-line-height-line-height-20)` = 20px
- `var(--font-size-body-2)` = 14px
- `var(--padding-padding-1)` = 1px
- `var(--padding-padding-12)` = 12px
- `var(--padding-padding-16)` = 16px
- `var(--padding-padding-24)` = 24px
- `var(--padding-padding-4)` = 4px
- `var(--padding-padding-6)` = 6px
- `var(--padding-padding-8)` = 8px
- `var(--shadow-drop-shadow-8-blur)` = 8px
- `var(--shadow-drop-shadow-8-color)` = rgba(37,37,37,0.08) (light) / rgba(17,22,25,0.08) (dark)
- `var(--shadow-drop-shadow-8-x)` = 0px
- `var(--shadow-drop-shadow-8-y)` = 8px
- `var(--sizing-size-24)` = 24px
- `var(--spacing-space-24)` = 24px
- `var(--spacing-space-8)` = 8px

<!-- ds:section id=states-light -->
## States (Light Theme)

| Variant | State | Background | Border | Text / Icon | Other |
|---|---|---|---|---|---|
| default | default | `var(--color-background-component)` (#ffffff) | `var(--border-width-border-1)` (var(--border-width-border-default)) `var(--color-border-lighter)` (#eaeaea) | `var(--color-text-brand-strong)` (#0062ab) | shadow: `var(--border-width-border-thick)` `var(--color-border-brand-dark)` |
| default | disabled |  |  |  | opacity: 0.5 |
| default | focus |  |  |  | shadow: `var(--border-width-border-thick)` `var(--color-border-brand-dark)` `var(--border-width-border-thick)` `var(--color-border-brand-base)`; radius: `var(--corner-radius-radius-4)` |
| default | hover | `var(--color-background-brand-lighter)` (#ebf4fb) |  | `var(--color-text-brand-strong)` (#0062ab) |  |

<!-- ds:section id=states-dark -->
## States (Dark Theme)

| Variant | State | Background | Border | Text / Icon | Other |
|---|---|---|---|---|---|
| default | default | `var(--color-background-component)` (#111619) | `var(--border-width-border-1)` (var(--border-width-border-default)) `var(--color-border-lighter)` (#1e262c) | `var(--color-text-brand-strong)` (#94c5ea) | shadow: `var(--border-width-border-thick)` `var(--color-border-brand-dark)` |
| default | disabled |  |  |  | opacity: 0.5 |
| default | focus |  |  |  | shadow: `var(--border-width-border-thick)` `var(--color-border-brand-dark)` `var(--border-width-border-thick)` `var(--color-border-brand-base)`; radius: `var(--corner-radius-radius-4)` |
| default | hover | `var(--color-background-brand-lighter)` (#1e262c) |  | `var(--color-text-brand-strong)` (#94c5ea) |  |

<!-- ds:section id=interactions -->
## Interactions (Component-Specific)

> Baseline interactions (focus management, Tab/Enter/Space/Escape, touch targets) are defined in root-spec.md.
> This section documents additional or overriding behaviors for this component.

**Pattern**: tablist

### Behaviors

- Horizontal tab navigation between tab elements
- Activates associated panel on tab selection
- Supports automatic activation (focus = select) or manual activation (Enter to select)

### Keyboard

| Key | Action |
|---|---|
| ArrowLeft | Move focus to previous tab |
| ArrowRight | Move focus to next tab |
| Home | Move focus to first tab |
| End | Move focus to last tab |

### ARIA

| Element | Attributes |
|---|---|
| container | {'role': 'tablist'} |
| tab | {'role': 'tab', 'aria-selected': 'true on the active tab', 'aria-controls': 'ID of the associated tabpanel'} |
| panel | {'role': 'tabpanel', 'aria-labelledby': 'ID of the associated tab'} |

## Source Mapping

| Source | Location |
|---|---|
| Root spec | `components/synapse/root-spec.md` |
| Figma variables | Extracted via `figma_get_local_variables` MCP tool |
| Theme CSS | `components/synapse-theme.css` |
| Component map | `data/synapse-component-figma-map.json` |
<!-- auto:generated:end -->
