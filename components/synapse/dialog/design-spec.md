<!-- auto:generated:start -->
<!-- ds:inherits root-spec -->
# Dialog Design Spec

> Generated 2026-06-12T07:10:00Z. Component-specific override spec — inherits global tokens, baselines, and theming from root-spec.md.

<!-- ds:section id=metadata -->
## Metadata

| Property | Value |
|---|---|
| Component | Dialog |
| Category | Modals |
| Figma Page | Modals |
| Node ID | 43461:175960 |
| Design System | Synapse |

<!-- ds:section id=anatomy -->
## Anatomy

The component is composed of these structural parts:

- **aboutBody**
- **aboutFooter**
- **aboutHeader**
- **aboutHeaderSpacer**
- **aboutProductTitle**
- **alertIcon**
- **backdrop**
- **backdropAbout**
- **body**
- **bodyScrollable**
- **close**
- **closeIcon**
- **contentScrollShadow**
- **contentSeparator**
- **description**
- **footer**
- **header**
- **headerLeft**
- **modalMainAbout**
- **popup**
- **popupAbout**
- **title**
- **triggerReset**
- **typeIcon**
- **typeIconImage**

Implementations must render these parts in order. Each part maps to a single DOM element (or equivalent in the target framework). Parts can be omitted if marked optional.

<!-- ds:section id=layout -->
## Layout & Measurements

> Layout data not yet extracted. Run `python scripts/figma_layout_enricher.py` to populate.

<!-- ds:section id=tokens -->
## Component Tokens

> Global tokens (colors, spacing, typography, elevation): see [root-spec.md](../root-spec.md).
> Below are tokens referenced by this component's CSS module.

- `var(--border-width-border-1)` = var(--border-width-border-default)
- `var(--border-width-border-2)` = var(--border-width-border-thick)
- `var(--color-background-component)` = #ffffff (light) / #111619 (dark)
- `var(--color-background-overlay-1)` = rgba(37,37,37,0.65) (light) / rgba(37,37,37,0.75) (dark)
- `var(--color-border-accessible)` = #757575 (light) / #8898a5 (dark)
- `var(--color-border-brand-base)` = #0076ce (light) / #4c9fdd (dark)
- `var(--color-border-neutral-light)` = #757575 (light) / #34414c (dark)
- `var(--color-icon-brand-base)` = #0076ce (light) / #4c9fdd (dark)
- `var(--color-icon-neutral)` = #4d4d4d (light) / #b8c1c9 (dark)
- `var(--color-text-neutral)` = #4d4d4d (light) / #b8c1c9 (dark)
- `var(--color-text-neutral-strong)` = #252525 (light) / #e6e9ec (dark)
- `var(--corner-radius-radius-16)` = 16px
- `var(--corner-radius-radius-4)` = 4px
- `var(--font-line-height-line-height-20)` = 20px
- `var(--font-line-height-line-height-32)` = 32px
- `var(--font-line-height-line-height-58)` = 58px
- `var(--font-size-body-2)` = 14px
- `var(--font-size-header-1)` = 48px
- `var(--font-size-header-5)` = 24px
- `var(--modal-control-radius)` = var(--corner-radius-radius-16)
- `var(--padding-padding-12)` = 12px
- `var(--padding-padding-16)` = 16px
- `var(--padding-padding-24)` = 24px
- `var(--padding-padding-8)` = 8px
- `var(--scale-32)` = 32px
- `var(--scale-80)` = 80px
- `var(--shadow-drop-shadow-16-blur)` = 16px
- `var(--shadow-drop-shadow-16-color)` = rgba(37,37,37,0.08) (light) / rgba(17,22,25,0.08) (dark)
- `var(--shadow-drop-shadow-16-spread)` = 0px
- `var(--shadow-drop-shadow-16-x)` = 0px
- `var(--shadow-drop-shadow-16-y)` = 16px
- `var(--shadow-drop-shadow-2-blur)` = 2px
- `var(--shadow-drop-shadow-2-color)` = rgba(37,37,37,0.08) (light) / rgba(17,22,25,0.08) (dark)
- `var(--shadow-drop-shadow-2-spread)` = 0px
- `var(--shadow-drop-shadow-2-x)` = 0px
- `var(--shadow-drop-shadow-2-y)` = 2px
- `var(--shadow-drop-shadow-32-blur)` = 32px
- `var(--shadow-drop-shadow-32-color)` = rgba(37,37,37,0.08) (light) / rgba(17,22,25,0.08) (dark)
- `var(--shadow-drop-shadow-32-x)` = 0px
- `var(--shadow-drop-shadow-32-y)` = 32px
- `var(--shadow-drop-shadow-4-blur)` = 4px
- `var(--shadow-drop-shadow-4-color)` = rgba(37,37,37,0.08) (light) / rgba(17,22,25,0.08) (dark)
- `var(--shadow-drop-shadow-4-spread)` = 0px
- `var(--shadow-drop-shadow-4-x)` = 0px
- `var(--shadow-drop-shadow-4-y)` = 4px
- `var(--shadow-drop-shadow-8-blur)` = 8px
- `var(--shadow-drop-shadow-8-color)` = rgba(37,37,37,0.08) (light) / rgba(17,22,25,0.08) (dark)
- `var(--shadow-drop-shadow-8-spread)` = 0px
- `var(--shadow-drop-shadow-8-x)` = 0px
- `var(--shadow-drop-shadow-8-y)` = 8px
- `var(--spacing-space-16)` = 16px

<!-- ds:section id=states-light -->
## States (Light Theme)

| Variant | State | Background | Border | Text / Icon | Other |
|---|---|---|---|---|---|
| default | default | `var(--color-background-component)` (#ffffff) | `var(--border-width-border-1)` (var(--border-width-border-default)) `var(--color-border-neutral-light)` (#757575) | `var(--color-icon-brand-base)` (#0076ce) | shadow: `var(--shadow-drop-shadow-2-x)` `var(--shadow-drop-shadow-2-y)` `var(--shadow-drop-shadow-2-blur)` `var(--shadow-drop-shadow-2-spread)` `var(--shadow-drop-shadow-2-color)` `var(--shadow-drop-shadow-4-x)` `var(--shadow-drop-shadow-4-y)` `var(--shadow-drop-shadow-4-blur)` `var(--shadow-drop-shadow-4-spread)` `var(--shadow-drop-shadow-4-color)` `var(--shadow-drop-shadow-8-x)` `var(--shadow-drop-shadow-8-y)` `var(--shadow-drop-shadow-8-blur)` `var(--shadow-drop-shadow-8-spread)` `var(--shadow-drop-shadow-8-color)` `var(--shadow-drop-shadow-16-x)` `var(--shadow-drop-shadow-16-y)` `var(--shadow-drop-shadow-16-blur)` `var(--shadow-drop-shadow-16-spread)` `var(--shadow-drop-shadow-16-color)`; radius: `var(--corner-radius-radius-16)` |
| default | focus |  |  |  | focus-ring: `var(--border-width-border-2)` `var(--color-border-brand-base)` |

<!-- ds:section id=states-dark -->
## States (Dark Theme)

| Variant | State | Background | Border | Text / Icon | Other |
|---|---|---|---|---|---|
| default | default | `var(--color-background-component)` (#111619) | `var(--border-width-border-1)` (var(--border-width-border-default)) `var(--color-border-neutral-light)` (#34414c) | `var(--color-icon-brand-base)` (#4c9fdd) | shadow: `var(--shadow-drop-shadow-2-x)` `var(--shadow-drop-shadow-2-y)` `var(--shadow-drop-shadow-2-blur)` `var(--shadow-drop-shadow-2-spread)` `var(--shadow-drop-shadow-2-color)` `var(--shadow-drop-shadow-4-x)` `var(--shadow-drop-shadow-4-y)` `var(--shadow-drop-shadow-4-blur)` `var(--shadow-drop-shadow-4-spread)` `var(--shadow-drop-shadow-4-color)` `var(--shadow-drop-shadow-8-x)` `var(--shadow-drop-shadow-8-y)` `var(--shadow-drop-shadow-8-blur)` `var(--shadow-drop-shadow-8-spread)` `var(--shadow-drop-shadow-8-color)` `var(--shadow-drop-shadow-16-x)` `var(--shadow-drop-shadow-16-y)` `var(--shadow-drop-shadow-16-blur)` `var(--shadow-drop-shadow-16-spread)` `var(--shadow-drop-shadow-16-color)`; radius: `var(--corner-radius-radius-16)` |
| default | focus |  |  |  | focus-ring: `var(--border-width-border-2)` `var(--color-border-brand-base)` |

<!-- ds:section id=interactions -->
## Interactions (Component-Specific)

> Baseline interactions (focus management, Tab/Enter/Space/Escape, touch targets) are defined in root-spec.md.
> This section documents additional or overriding behaviors for this component.

**Pattern**: dialog

### Behaviors

- Renders as modal overlay on top of page content
- Focus trap: Tab/Shift+Tab cycles focus within dialog boundary
- Closes on Escape key press
- Returns focus to the trigger element on close
- Blocks interaction with background content

### Keyboard

| Key | Action |
|---|---|
| Escape | Close the dialog |
| Tab | Move focus to next focusable element within dialog |
| Shift+Tab | Move focus to previous focusable element within dialog |

### ARIA

| Element | Attributes |
|---|---|
| root | {'role': 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'ID of the dialog title element', 'aria-describedby': 'ID of the dialog content/description element'} |

## Source Mapping

| Source | Location |
|---|---|
| Root spec | `components/synapse/root-spec.md` |
| Figma variables | Extracted via `figma_get_local_variables` MCP tool |
| Theme CSS | `components/synapse-theme.css` |
| Component map | `data/synapse-component-figma-map.json` |
<!-- auto:generated:end -->
