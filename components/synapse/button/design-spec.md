<!-- auto:generated:start -->
<!-- ds:inherits root-spec -->
# Button Design Spec

> Generated 2026-06-12T07:10:00Z. Component-specific override spec — inherits global tokens, baselines, and theming from root-spec.md.

<!-- ds:section id=metadata -->
## Metadata

| Property | Value |
|---|---|
| Component | Button |
| Category | Components |
| Figma Page | Components |
| Node ID | 47808:31665 |
| Design System | Synapse |

<!-- ds:section id=anatomy -->
## Anatomy

The component is composed of these structural parts:

- **button**
- **iconImage**
- **iconSlot**
- **labelHidden**
- **loading**
- **programmeSynapse**
- **spinner**
- **visuallyHidden**

Implementations must render these parts in order. Each part maps to a single DOM element (or equivalent in the target framework). Parts can be omitted if marked optional.

<!-- ds:section id=layout -->
## Layout & Measurements

<!-- ds:section id=tokens -->
## Component Tokens

> Global tokens (colors, spacing, typography, elevation): see [root-spec.md](../root-spec.md).
> Below are tokens referenced by this component's CSS module.

- `var(--border-width-border-1)` = var(--border-width-border-default)
- `var(--button-control-radius)` = var(--corner-radius-radius-4)
- `var(--button-focus-ring-offset)` = 3px
- `var(--button-focus-ring-radius)` = var(--corner-radius-radius-6)
- `var(--color-background-alerting-critical)` = #af0000 (light) / #c74c4c (dark)
- `var(--color-background-alerting-critical-strong)` = #910000 (light) / #af0000 (dark)
- `var(--color-background-alerting-critical-stronger)` = #730000 (light) / #910000 (dark)
- `var(--color-background-controls-brand-base)` = #0076ce
- `var(--color-background-controls-brand-light)` = #d9eaf8 (light) / #002642 (dark)
- `var(--color-background-controls-brand-lighter)` = #ebf4fb (light) / #003a65 (dark)
- `var(--color-background-controls-brand-strong)` = #0062ab
- `var(--color-background-controls-brand-stronger)` = #06528a
- `var(--color-background-gray-lighter)` = #f4f4f4 (light) / #393939 (dark)
- `var(--color-border-alerting-transparent-critical)` = rgba(175,0,0,0.00) (light) / #dd9494 (dark)
- `var(--color-border-brand-base)` = #0076ce (light) / #4c9fdd (dark)
- `var(--color-border-disabled)` = #757575 (light) / #9e9e9e (dark)
- `var(--color-border-transparent-brand)` = rgba(255,255,255,0.00) (light) / #4c9fdd (dark)
- `var(--color-icon-brand-base)` = #0076ce (light) / #4c9fdd (dark)
- `var(--color-icon-disabled)` = #757575 (light) / #c5c5c5 (dark)
- `var(--color-icon-white)` = #ffffff
- `var(--color-text-brand-strong)` = #0062ab (light) / #94c5ea (dark)
- `var(--color-text-disabled)` = #757575 (light) / #9e9e9e (dark)
- `var(--color-text-neutral-strong)` = #252525 (light) / #e6e9ec (dark)
- `var(--color-text-white)` = #ffffff
- `var(--font-line-height-line-height-20)` = 20px
- `var(--font-size-body-2)` = 14px
- `var(--padding-padding-10)` = 10px
- `var(--padding-padding-12)` = 12px
- `var(--padding-padding-16)` = 16px
- `var(--padding-padding-2)` = 2px
- `var(--padding-padding-4)` = 4px
- `var(--padding-padding-6)` = 6px
- `var(--padding-padding-8)` = 8px
- `var(--scale-24)` = 24px
- `var(--scale-32)` = 32px
- `var(--scale-40)` = 40px
- `var(--spacing-space-8)` = 8px

<!-- ds:section id=states-light -->
## States (Light Theme)

| Variant | State | Background | Border | Text / Icon | Other |
|---|---|---|---|---|---|
| danger | active | `var(--color-background-alerting-critical-stronger)` (#730000) |  |  |  |
| danger | default | `var(--color-background-alerting-critical)` (#af0000) | `var(--color-border-alerting-transparent-critical)` (rgba(175,0,0,0.00)) | `var(--color-text-white)` (#ffffff) |  |
| danger | disabled | `var(--color-background-gray-lighter)` (#f4f4f4) | `var(--color-border-disabled)` (#757575) | `var(--color-text-disabled)` (#757575) |  |
| danger | focus |  | `var(--color-border-alerting-transparent-critical)` (rgba(175,0,0,0.00)) |  |  |
| danger | hover | `var(--color-background-alerting-critical-strong)` (#910000) |  |  |  |
| default | default |  | `var(--border-width-border-1)` (var(--border-width-border-default)) |  | radius: `var(--button-control-radius)` |
| default | disabled |  |  | `var(--color-icon-disabled)` (#757575) |  |
| default | focus |  | `var(--border-width-border-1)` (var(--border-width-border-default)) `var(--color-border-brand-base)` (#0076ce) |  | focus-ring: `var(--border-width-border-1)` `var(--color-border-brand-base)`; radius: `var(--button-focus-ring-radius)` |
| ghost | default |  |  | `var(--color-text-neutral-strong)` (#252525) |  |
| ghost | disabled |  |  | `var(--color-text-disabled)` (#757575) |  |
| ghost | hover | `var(--color-background-gray-lighter)` (#f4f4f4) |  |  |  |
| primary | active | `var(--color-background-controls-brand-stronger)` (#06528a) |  |  |  |
| primary | default | `var(--color-background-controls-brand-base)` (#0076ce) | `var(--color-border-transparent-brand)` (rgba(255,255,255,0.00)) | `var(--color-text-white)` (#ffffff) |  |
| primary | disabled | `var(--color-background-gray-lighter)` (#f4f4f4) | `var(--color-border-disabled)` (#757575) | `var(--color-text-disabled)` (#757575) |  |
| primary | focus |  | `var(--color-border-transparent-brand)` (rgba(255,255,255,0.00)) |  |  |
| primary | hover | `var(--color-background-controls-brand-strong)` (#0062ab) |  |  |  |
| secondary | active | `var(--color-background-controls-brand-light)` (#d9eaf8) |  |  |  |
| secondary | default |  | `var(--color-border-brand-base)` (#0076ce) | `var(--color-text-brand-strong)` (#0062ab) |  |
| secondary | disabled |  | `var(--color-border-disabled)` (#757575) | `var(--color-text-disabled)` (#757575) |  |
| secondary | focus |  | `var(--color-border-brand-base)` (#0076ce) |  |  |
| secondary | hover | `var(--color-background-controls-brand-lighter)` (#ebf4fb) |  |  |  |
| tertiary | active | `var(--color-background-controls-brand-light)` (#d9eaf8) | `var(--color-border-brand-base)` (#0076ce) |  |  |
| tertiary | default |  |  | `var(--color-text-brand-strong)` (#0062ab) |  |
| tertiary | disabled |  |  | `var(--color-text-disabled)` (#757575) |  |
| tertiary | hover | `var(--color-background-controls-brand-lighter)` (#ebf4fb) | `var(--color-border-brand-base)` (#0076ce) |  |  |

<!-- ds:section id=states-dark -->
## States (Dark Theme)

| Variant | State | Background | Border | Text / Icon | Other |
|---|---|---|---|---|---|
| danger | active | `var(--color-background-alerting-critical-stronger)` (#910000) |  |  |  |
| danger | default | `var(--color-background-alerting-critical)` (#c74c4c) | `var(--color-border-alerting-transparent-critical)` (#dd9494) | `var(--color-text-white)` (#ffffff) |  |
| danger | disabled | `var(--color-background-gray-lighter)` (#393939) | `var(--color-border-disabled)` (#9e9e9e) | `var(--color-text-disabled)` (#9e9e9e) |  |
| danger | focus |  | `var(--color-border-alerting-transparent-critical)` (#dd9494) |  |  |
| danger | hover | `var(--color-background-alerting-critical-strong)` (#af0000) |  |  |  |
| default | default |  | `var(--border-width-border-1)` (var(--border-width-border-default)) |  | radius: `var(--button-control-radius)` |
| default | disabled |  |  | `var(--color-icon-disabled)` (#c5c5c5) |  |
| default | focus |  | `var(--border-width-border-1)` (var(--border-width-border-default)) `var(--color-border-brand-base)` (#4c9fdd) |  | focus-ring: `var(--border-width-border-1)` `var(--color-border-brand-base)`; radius: `var(--button-focus-ring-radius)` |
| ghost | default |  |  | `var(--color-text-neutral-strong)` (#e6e9ec) |  |
| ghost | disabled |  |  | `var(--color-text-disabled)` (#9e9e9e) |  |
| ghost | hover | `var(--color-background-gray-lighter)` (#393939) |  |  |  |
| primary | active | `var(--color-background-controls-brand-stronger)` (#06528a) |  |  |  |
| primary | default | `var(--color-background-controls-brand-base)` (#0076ce) | `var(--color-border-transparent-brand)` (#4c9fdd) | `var(--color-text-white)` (#ffffff) |  |
| primary | disabled | `var(--color-background-gray-lighter)` (#393939) | `var(--color-border-disabled)` (#9e9e9e) | `var(--color-text-disabled)` (#9e9e9e) |  |
| primary | focus |  | `var(--color-border-transparent-brand)` (#4c9fdd) |  |  |
| primary | hover | `var(--color-background-controls-brand-strong)` (#0062ab) |  |  |  |
| secondary | active | `var(--color-background-controls-brand-light)` (#002642) |  |  |  |
| secondary | default |  | `var(--color-border-brand-base)` (#4c9fdd) | `var(--color-text-brand-strong)` (#94c5ea) |  |
| secondary | disabled |  | `var(--color-border-disabled)` (#9e9e9e) | `var(--color-text-disabled)` (#9e9e9e) |  |
| secondary | focus |  | `var(--color-border-brand-base)` (#4c9fdd) |  |  |
| secondary | hover | `var(--color-background-controls-brand-lighter)` (#003a65) |  |  |  |
| tertiary | active | `var(--color-background-controls-brand-light)` (#002642) | `var(--color-border-brand-base)` (#4c9fdd) |  |  |
| tertiary | default |  |  | `var(--color-text-brand-strong)` (#94c5ea) |  |
| tertiary | disabled |  |  | `var(--color-text-disabled)` (#9e9e9e) |  |
| tertiary | hover | `var(--color-background-controls-brand-lighter)` (#003a65) | `var(--color-border-brand-base)` (#4c9fdd) |  |  |

<!-- ds:section id=interactions -->
## Interactions (Component-Specific)

> Baseline interactions (focus management, Tab/Enter/Space/Escape, touch targets) are defined in root-spec.md.
> This section documents additional or overriding behaviors for this component.

**Pattern**: action

### Behaviors

- Triggers action on click
- Shows loading state when async operation in progress
- Disabled state prevents interaction and removes from tab order

### Keyboard

| Key | Action |
|---|---|
| Enter | Activate the button |
| Space | Activate the button |

### ARIA

| Element | Attributes |
|---|---|
| root | {'element': '<button>', 'aria-disabled': 'true when disabled (prefer over HTML disabled for focusability)', 'aria-busy': 'true when in loading state'} |

## Source Mapping

| Source | Location |
|---|---|
| Root spec | `components/synapse/root-spec.md` |
| Figma variables | Extracted via `figma_get_local_variables` MCP tool |
| Theme CSS | `components/synapse-theme.css` |
| Component map | `data/synapse-component-figma-map.json` |
<!-- auto:generated:end -->
