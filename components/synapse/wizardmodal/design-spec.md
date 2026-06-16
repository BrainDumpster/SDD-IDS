<!-- auto:generated:start -->
<!-- ds:inherits root-spec -->
# WizardModal Design Spec

> Generated 2026-06-12T07:10:01Z. Component-specific override spec — inherits global tokens, baselines, and theming from root-spec.md.

<!-- ds:section id=metadata -->
## Metadata

| Property | Value |
|---|---|
| Component | WizardModal |
| Category | Modals |
| Figma Page | Modals |
| Node ID | 11067:54629 |
| Design System | Synapse |

<!-- ds:section id=anatomy -->
## Anatomy

The component is composed of these structural parts:

- **actions**
- **backdrop**
- **body**
- **btnPrimary**
- **btnSecondary**
- **close**
- **footer**
- **header**
- **popup**
- **progress**
- **step**
- **stepLabel**
- **stepNumber**
- **stepper**
- **title**
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
- `var(--border-width-border-2)` = var(--border-width-border-thick)
- `var(--color-background-brand-lighter)` = #ebf4fb (light) / #1e262c (dark)
- `var(--color-background-component)` = #ffffff (light) / #111619 (dark)
- `var(--color-background-controls-brand-base)` = #0076ce
- `var(--color-background-controls-brand-strong)` = #0062ab
- `var(--color-background-gray-lighter)` = #f4f4f4 (light) / #393939 (dark)
- `var(--color-background-overlay-1)` = rgba(37,37,37,0.65) (light) / rgba(37,37,37,0.75) (dark)
- `var(--color-background-surface-1)` = #f4f4f4 (light) / #111619 (dark)
- `var(--color-border-brand-base)` = #0076ce (light) / #4c9fdd (dark)
- `var(--color-border-light)` = #c5c5c5 (light) / #34414c (dark)
- `var(--color-border-lighter)` = #eaeaea (light) / #1e262c (dark)
- `var(--color-icon-neutral)` = #4d4d4d (light) / #b8c1c9 (dark)
- `var(--color-text-brand-base)` = #0076ce (light) / #4c9fdd (dark)
- `var(--color-text-neutral)` = #4d4d4d (light) / #b8c1c9 (dark)
- `var(--color-text-neutral-strong)` = #252525 (light) / #e6e9ec (dark)
- `var(--color-text-white)` = #ffffff
- `var(--corner-radius-radius-4)` = 4px
- `var(--corner-radius-radius-8)` = 8px
- `var(--font-line-height-line-height-20)` = 20px
- `var(--font-size-body-2)` = 14px
- `var(--font-size-body-3)` = 12px
- `var(--font-size-header-6)` = 18px
- `var(--padding-padding-12)` = 12px
- `var(--padding-padding-16)` = 16px
- `var(--padding-padding-24)` = 24px
- `var(--scale-24)` = 24px
- `var(--scale-32)` = 32px
- `var(--scale-36)` = 36px
- `var(--shadow-drop-shadow-32-blur)` = 32px
- `var(--shadow-drop-shadow-32-color)` = rgba(37,37,37,0.08) (light) / rgba(17,22,25,0.08) (dark)
- `var(--shadow-drop-shadow-32-x)` = 0px
- `var(--shadow-drop-shadow-32-y)` = 32px
- `var(--spacing-space-4)` = 4px
- `var(--spacing-space-8)` = 8px

<!-- ds:section id=states-light -->
## States (Light Theme)

| Variant | State | Background | Border | Text / Icon | Other |
|---|---|---|---|---|---|
| default | default | `var(--color-background-controls-brand-base)` (#0076ce) | `var(--border-width-border-1)` (var(--border-width-border-default)) `var(--color-border-brand-base)` (#0076ce) | `var(--color-text-brand-base)` (#0076ce) | shadow: `var(--shadow-drop-shadow-32-x)` `var(--shadow-drop-shadow-32-y)` `var(--shadow-drop-shadow-32-blur)` `var(--shadow-drop-shadow-32-color)`; radius: `var(--corner-radius-radius-4)` |
| default | focus |  |  |  | focus-ring: `var(--border-width-border-2)` `var(--color-border-brand-base)` |
| default | hover | `var(--color-background-brand-lighter)` (#ebf4fb) |  |  |  |

<!-- ds:section id=states-dark -->
## States (Dark Theme)

| Variant | State | Background | Border | Text / Icon | Other |
|---|---|---|---|---|---|
| default | default | `var(--color-background-controls-brand-base)` (#0076ce) | `var(--border-width-border-1)` (var(--border-width-border-default)) `var(--color-border-brand-base)` (#4c9fdd) | `var(--color-text-brand-base)` (#4c9fdd) | shadow: `var(--shadow-drop-shadow-32-x)` `var(--shadow-drop-shadow-32-y)` `var(--shadow-drop-shadow-32-blur)` `var(--shadow-drop-shadow-32-color)`; radius: `var(--corner-radius-radius-4)` |
| default | focus |  |  |  | focus-ring: `var(--border-width-border-2)` `var(--color-border-brand-base)` |
| default | hover | `var(--color-background-brand-lighter)` (#1e262c) |  |  |  |

<!-- ds:section id=interactions -->
## Interactions (Component-Specific)

> Baseline interactions (focus management, Tab/Enter/Space/Escape, touch targets) are defined in root-spec.md.
> This section documents additional or overriding behaviors for this component.

**Pattern**: wizard

### Behaviors

- Modal dialog containing a multi-step flow
- Back/Next button navigation between steps
- Step validation required before proceeding forward
- Final step replaces Next with Submit action
- Focus trap within modal (same as dialog pattern)
- Escape to close with confirmation if form has unsaved changes

### Keyboard

| Key | Action |
|---|---|
| Tab | Move focus between form elements and navigation buttons |
| Shift+Tab | Move focus to previous focusable element within modal |
| Enter | Activate Next/Submit button |
| Escape | Close modal (prompts confirmation if dirty) |

### ARIA

| Element | Attributes |
|---|---|
| root | {'role': 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'ID of the wizard title'} |
| stepProgress | {'aria-live': 'polite', 'aria-label': 'Step X of Y'} |
| stepIndicators | {'role': 'list', 'aria-current': 'step on the current step'} |

## Source Mapping

| Source | Location |
|---|---|
| Root spec | `components/synapse/root-spec.md` |
| Figma variables | Extracted via `figma_get_local_variables` MCP tool |
| Theme CSS | `components/synapse-theme.css` |
| Component map | `data/synapse-component-figma-map.json` |
<!-- auto:generated:end -->
