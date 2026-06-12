<!-- auto:generated:start -->
<!-- ds:inherits root-spec -->
# Stepper Design Spec

> Generated 2026-06-12T07:10:01Z. Component-specific override spec — inherits global tokens, baselines, and theming from root-spec.md.

<!-- ds:section id=metadata -->
## Metadata

| Property | Value |
|---|---|
| Component | Stepper |
| Category | Components |
| Figma Page | Components |
| Node ID | 48160:11907 |
| Design System | Synapse |

<!-- ds:section id=anatomy -->
## Anatomy

The component is composed of these structural parts:

- **activeDot**
- **circleActive**
- **circleCompleted**
- **connector**
- **connectorCompleted**
- **connectorTerminal**
- **connectorVertical**
- **label**
- **labelRow**
- **number**
- **root**
- **rootVertical**
- **step**
- **stepVertical**
- **topRow**
- **topRowVertical**

Implementations must render these parts in order. Each part maps to a single DOM element (or equivalent in the target framework). Parts can be omitted if marked optional.

<!-- ds:section id=layout -->
## Layout & Measurements

<!-- ds:section id=tokens -->
## Component Tokens

> Global tokens (colors, spacing, typography, elevation): see [root-spec.md](../root-spec.md).
> Below are tokens referenced by this component's CSS module.

- `var(--border-width-border-2)` = var(--border-width-border-thick)
- `var(--color-background-brand-base)` = #0076ce (light) / #4c9fdd (dark)
- `var(--color-background-component)` = #ffffff (light) / #111619 (dark)
- `var(--color-background-gray-neutral-dark)` = #616161 (light) / #8898a5 (dark)
- `var(--color-background-gray-neutral-light)` = #eaeaea (light) / #34414c (dark)
- `var(--color-border-accessible)` = #757575 (light) / #8898a5 (dark)
- `var(--color-border-brand-base)` = #0076ce (light) / #4c9fdd (dark)
- `var(--color-icon-inverse)` = #ffffff (light) / #252525 (dark)
- `var(--color-text-neutral-strong)` = #252525 (light) / #e6e9ec (dark)
- `var(--color-text-white)` = #ffffff
- `var(--corner-radius-radius-6)` = 6px
- `var(--font-line-height-line-height-20)` = 20px
- `var(--font-size-body-2)` = 14px
- `var(--padding-padding-2)` = 2px
- `var(--padding-padding-8)` = 8px
- `var(--spacing-space-6)` = 6px
- `var(--spacing-space-8)` = 8px

<!-- ds:section id=states-light -->
## States (Light Theme)

| Variant | State | Background | Border | Text / Icon | Other |
|---|---|---|---|---|---|
| circle | default | `var(--color-background-component)` (#ffffff) | `var(--border-width-border-2)` (var(--border-width-border-thick)) `var(--color-border-accessible)` (#757575) | `var(--color-text-white)` (#ffffff) |  |
| default | default | `var(--color-background-brand-base)` (#0076ce) | `var(--color-background-brand-base)` (#0076ce) | `var(--color-icon-inverse)` (#ffffff) | radius: `var(--corner-radius-radius-6)` |

<!-- ds:section id=states-dark -->
## States (Dark Theme)

| Variant | State | Background | Border | Text / Icon | Other |
|---|---|---|---|---|---|
| circle | default | `var(--color-background-component)` (#111619) | `var(--border-width-border-2)` (var(--border-width-border-thick)) `var(--color-border-accessible)` (#8898a5) | `var(--color-text-white)` (#ffffff) |  |
| default | default | `var(--color-background-brand-base)` (#4c9fdd) | `var(--color-background-brand-base)` (#4c9fdd) | `var(--color-icon-inverse)` (#252525) | radius: `var(--corner-radius-radius-6)` |

<!-- ds:section id=interactions -->
## Interactions (Component-Specific)

> Baseline interactions (focus management, Tab/Enter/Space/Escape, touch targets) are defined in root-spec.md.
> This section documents additional or overriding behaviors for this component.

**Pattern**: stepper

### Behaviors

- Multi-step linear flow with numbered step indicators
- Shows current, completed, and upcoming step states
- Allows navigation back to completed steps
- Blocks forward navigation until current step is valid

### Keyboard

| Key | Action |
|---|---|
| Tab | Move focus between step indicators |
| Enter | Navigate to a completed step |

### ARIA

| Element | Attributes |
|---|---|
| container | {'role': 'list'} |
| step | {'role': 'listitem'} |
| currentStep | {'aria-current': 'step'} |
| completedStep | {'aria-label': "Includes 'completed' in accessible description"} |

## Source Mapping

| Source | Location |
|---|---|
| Root spec | `components/synapse/root-spec.md` |
| Figma variables | Extracted via `figma_get_local_variables` MCP tool |
| Theme CSS | `components/synapse-theme.css` |
| Component map | `data/synapse-component-figma-map.json` |
<!-- auto:generated:end -->
