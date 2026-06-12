<!-- auto:generated:start -->
<!-- ds:inherits root-spec -->
# ChatInputBox Design Spec

> Generated 2026-06-12T07:10:00Z. Component-specific override spec — inherits global tokens, baselines, and theming from root-spec.md.

<!-- ds:section id=metadata -->
## Metadata

| Property | Value |
|---|---|
| Component | ChatInputBox |
| Category | Components |
| Figma Page | Components |
| Node ID | 48467:26816 |
| Design System | Synapse |

<!-- ds:section id=anatomy -->
## Anatomy

The component is composed of these structural parts:

- **actions**
- **actionsInline**
- **characterCount**
- **content**
- **contentComposing**
- **contentCustomView**
- **contentHover**
- **contentLimit**
- **contentSelected**
- **disabled**
- **element**
- **elementComposing**
- **elementCustomView**
- **footer**
- **footerCount**
- **footerMeta**
- **footerText**
- **limitContent**
- **limitCountdown**
- **limitIconWrap**
- **limitMessage**
- **newChatButton**
- **newChatLabel**
- **placeholderReadonly**
- **root**
- **rootNewChat**
- **rootWithPromptsV**
- **sendButton**
- **sendButtonSelected**
- **shellCharacterCount**
- **stopButton**
- **stopIconWrap**
- **textarea**
- **textareaField**
- **textareaSelected**
- **tryAskingLabel**

Implementations must render these parts in order. Each part maps to a single DOM element (or equivalent in the target framework). Parts can be omitted if marked optional.

<!-- ds:section id=layout -->
## Layout & Measurements

> Layout data not yet extracted. Run `python scripts/figma_layout_enricher.py` to populate.

<!-- ds:section id=tokens -->
## Component Tokens

> Global tokens (colors, spacing, typography, elevation): see [root-spec.md](../root-spec.md).
> Below are tokens referenced by this component's CSS module.

- `var(--border-width-border-1)` = var(--border-width-border-default)
- `var(--chat-input-button-radius)` = var(--corner-radius-radius-24)
- `var(--chat-input-focus-ring-offset)` = var(--scale-4)
- `var(--chat-input-focus-ring-radius)` = var(--corner-radius-radius-24)
- `var(--chat-input-shell-max-height)` = 320px
- `var(--chat-input-shell-min-height)` = 92px
- `var(--chat-input-shell-radius)` = var(--corner-radius-radius-20)
- `var(--chat-input-textarea-max-height)` = 252px
- `var(--color-background-controls-brand-base)` = #0076ce
- `var(--color-background-gray-light)` = #eaeaea (light) / #393939 (dark)
- `var(--color-background-surface-2)` = #ffffff (light) / #1e262c (dark)
- `var(--color-border-brand-base)` = #0076ce (light) / #4c9fdd (dark)
- `var(--color-border-disabled)` = #757575 (light) / #9e9e9e (dark)
- `var(--color-border-neutral-light)` = #757575 (light) / #34414c (dark)
- `var(--color-border-strong)` = #252525 (light) / #b8c1c9 (dark)
- `var(--color-border-transparent-brand)` = rgba(255,255,255,0.00) (light) / #4c9fdd (dark)
- `var(--color-icon-brand-base)` = #0076ce (light) / #4c9fdd (dark)
- `var(--color-icon-disabled)` = #757575 (light) / #c5c5c5 (dark)
- `var(--color-icon-white)` = #ffffff
- `var(--color-text-brand-strong)` = #0062ab (light) / #94c5ea (dark)
- `var(--color-text-disabled)` = #757575 (light) / #9e9e9e (dark)
- `var(--color-text-neutral)` = #4d4d4d (light) / #b8c1c9 (dark)
- `var(--color-text-neutral-strong)` = #252525 (light) / #e6e9ec (dark)
- `var(--font-line-height-line-height-20)` = 20px
- `var(--font-line-height-line-height-24)` = 24px
- `var(--font-line-height-line-height-32)` = 32px
- `var(--font-size-body-1)` = 16px
- `var(--font-size-body-2)` = 14px
- `var(--font-size-header-5)` = 24px
- `var(--padding-padding-12)` = 12px
- `var(--padding-padding-16)` = 16px
- `var(--padding-padding-2)` = 2px
- `var(--padding-padding-6)` = 6px
- `var(--padding-padding-8)` = 8px
- `var(--spacing-space-16)` = 16px
- `var(--spacing-space-24)` = 24px
- `var(--spacing-space-8)` = 8px

<!-- ds:section id=states-light -->
## States (Light Theme)

| Variant | State | Background | Border | Text / Icon | Other |
|---|---|---|---|---|---|
| default | default | `var(--color-background-controls-brand-base)` (#0076ce) | `var(--color-border-brand-base)` (#0076ce) | `var(--color-text-disabled)` (#757575) | opacity: 0.5; radius: `var(--chat-input-button-radius)` |
| default | disabled |  |  |  | opacity: 1 |

<!-- ds:section id=states-dark -->
## States (Dark Theme)

| Variant | State | Background | Border | Text / Icon | Other |
|---|---|---|---|---|---|
| default | default | `var(--color-background-controls-brand-base)` (#0076ce) | `var(--color-border-brand-base)` (#4c9fdd) | `var(--color-text-disabled)` (#9e9e9e) | opacity: 0.5; radius: `var(--chat-input-button-radius)` |
| default | disabled |  |  |  | opacity: 1 |

## Source Mapping

| Source | Location |
|---|---|
| Root spec | `components/synapse/root-spec.md` |
| Figma variables | Extracted via `figma_get_local_variables` MCP tool |
| Theme CSS | `components/synapse-theme.css` |
| Component map | `data/synapse-component-figma-map.json` |
<!-- auto:generated:end -->
