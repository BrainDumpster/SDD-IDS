<!-- auto:generated:start -->
<!-- ds:inherits root-spec -->
# MainMenuLeft Design Spec

> Generated 2026-06-12T07:10:00Z. Component-specific override spec — inherits global tokens, baselines, and theming from root-spec.md.

<!-- ds:section id=metadata -->
## Metadata

| Property | Value |
|---|---|
| Component | MainMenuLeft |
| Category | Navigation |
| Figma Page | Navigation |
| Node ID | 47807:8153 |
| Design System | Synapse |

<!-- ds:section id=anatomy -->
## Anatomy

The component is composed of these structural parts:

- **actionButton**
- **actionIcon**
- **bottomToggle**
- **bottomToggleButton**
- **bottomToggleIcon**
- **chevronIcon**
- **collapsed**
- **content**
- **expanded**
- **focusRing**
- **interactive**
- **itemBlock**
- **logoButton**
- **logoIcon**
- **logoImg**
- **logoSlot**
- **logoStatic**
- **menuLeadBlock**
- **menuLeadBlockCollapsed**
- **menuLeadButton**
- **menuLeadButtonCollapsed**
- **menuLeadIcon**
- **menuLeadLabel**
- **primaryIcon**
- **primaryLabel**
- **primaryRow**
- **programmeSynapse**
- **programmeSynapseCollapsed**
- **programmeSynapseExpanded**
- **root**
- **secondaryContextButton**
- **secondaryContextButtonForceVisible**
- **secondaryContextButtonStateDisabled**
- **secondaryContextButtonStateFocus**
- **secondaryContextButtonStateHover**
- **secondaryContextButtonStatePress**
- **secondaryContextIcon**
- **secondaryInteractive**
- **secondaryRow**
- **secondaryRowLabel**
- **secondaryRowSelected**
- **secondaryRowSnapshotHover**
- **secondaryRowWrap**
- **secondaryRowWrapSnapshotHover**
- **secondarySection**
- **selectedInset**
- **stateDefaultFocus**
- **stateHover**
- **statePress**
- **stateSelected**
- **stateSelectedFocus**

Implementations must render these parts in order. Each part maps to a single DOM element (or equivalent in the target framework). Parts can be omitted if marked optional.

<!-- ds:section id=layout -->
## Layout & Measurements

> Layout data not yet extracted. Run `python scripts/figma_layout_enricher.py` to populate.

<!-- ds:section id=tokens -->
## Component Tokens

> Global tokens (colors, spacing, typography, elevation): see [root-spec.md](../root-spec.md).
> Below are tokens referenced by this component's CSS module.

- `var(--border-width-border-1)` = var(--border-width-border-default)
- `var(--border-width-border-default)` = 1px
- `var(--color-background-brand-light)` = #d9eaf8 (light) / #34414c (dark)
- `var(--color-background-brand-lighter)` = #ebf4fb (light) / #1e262c (dark)
- `var(--color-background-component)` = #ffffff (light) / #111619 (dark)
- `var(--color-background-controls-brand-light)` = #d9eaf8 (light) / #002642 (dark)
- `var(--color-background-controls-brand-lighter)` = #ebf4fb (light) / #003a65 (dark)
- `var(--color-border-accessible)` = #757575 (light) / #8898a5 (dark)
- `var(--color-border-brand-base)` = #0076ce (light) / #4c9fdd (dark)
- `var(--color-border-brand-dark)` = #0062ab (light) / #94c5ea (dark)
- `var(--color-border-neutral-light)` = #757575 (light) / #34414c (dark)
- `var(--color-icon-brand-base)` = #0076ce (light) / #4c9fdd (dark)
- `var(--color-icon-brand-strong)` = #0062ab (light) / #94c5ea (dark)
- `var(--color-icon-disabled)` = #757575 (light) / #c5c5c5 (dark)
- `var(--color-text-brand-strong)` = #0062ab (light) / #94c5ea (dark)
- `var(--color-text-neutral)` = #4d4d4d (light) / #b8c1c9 (dark)
- `var(--color-text-neutral-strong)` = #252525 (light) / #e6e9ec (dark)
- `var(--corner-radius-radius-4)` = 4px
- `var(--font-line-height-line-height-20)` = 20px
- `var(--font-line-height-line-height-24)` = 24px
- `var(--font-size-body-1)` = 16px
- `var(--font-size-body-2)` = 14px
- `var(--padding-padding-12)` = 12px
- `var(--padding-padding-16)` = 16px
- `var(--padding-padding-24)` = 24px
- `var(--padding-padding-4)` = 4px
- `var(--padding-padding-58)` = 58px
- `var(--padding-padding-6)` = 6px
- `var(--padding-padding-8)` = 8px
- `var(--spacing-space-16)` = 16px
- `var(--spacing-space-8)` = 8px

<!-- ds:section id=states-light -->
## States (Light Theme)

| Variant | State | Background | Border | Text / Icon | Other |
|---|---|---|---|---|---|
| default | active | `var(--color-background-brand-light)` (#d9eaf8) |  | `var(--color-text-brand-strong)` (#0062ab) |  |
| default | default | `var(--color-background-controls-brand-light)` (#d9eaf8) | `var(--border-width-border-1)` (var(--border-width-border-default)) `var(--color-border-brand-base)` (#0076ce) | `var(--color-icon-disabled)` (#757575) | focus-ring: `var(--border-width-border-default)` `var(--color-border-brand-base)`; opacity: 1; radius: `var(--corner-radius-radius-4)` |
| default | disabled |  |  | `var(--color-icon-disabled)` (#757575) |  |
| default | focus |  |  |  | shadow: `var(--color-border-brand-dark)`; focus-ring: `var(--border-width-border-default)` `var(--color-border-brand-base)`; radius: `var(--corner-radius-radius-4)` |
| default | hover | `var(--color-background-brand-lighter)` (#ebf4fb) |  | `var(--color-icon-brand-strong)` (#0062ab) | opacity: 1 |

<!-- ds:section id=states-dark -->
## States (Dark Theme)

| Variant | State | Background | Border | Text / Icon | Other |
|---|---|---|---|---|---|
| default | active | `var(--color-background-brand-light)` (#34414c) |  | `var(--color-text-brand-strong)` (#94c5ea) |  |
| default | default | `var(--color-background-controls-brand-light)` (#002642) | `var(--border-width-border-1)` (var(--border-width-border-default)) `var(--color-border-brand-base)` (#4c9fdd) | `var(--color-icon-disabled)` (#c5c5c5) | focus-ring: `var(--border-width-border-default)` `var(--color-border-brand-base)`; opacity: 1; radius: `var(--corner-radius-radius-4)` |
| default | disabled |  |  | `var(--color-icon-disabled)` (#c5c5c5) |  |
| default | focus |  |  |  | shadow: `var(--color-border-brand-dark)`; focus-ring: `var(--border-width-border-default)` `var(--color-border-brand-base)`; radius: `var(--corner-radius-radius-4)` |
| default | hover | `var(--color-background-brand-lighter)` (#1e262c) |  | `var(--color-icon-brand-strong)` (#94c5ea) | opacity: 1 |

## Source Mapping

| Source | Location |
|---|---|
| Root spec | `components/synapse/root-spec.md` |
| Figma variables | Extracted via `figma_get_local_variables` MCP tool |
| Theme CSS | `components/synapse-theme.css` |
| Component map | `data/synapse-component-figma-map.json` |
<!-- auto:generated:end -->
