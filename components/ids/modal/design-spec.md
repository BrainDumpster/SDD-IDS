# Modal Design Spec

## Metadata
- **Component:** Modal
- **Scenarios in this spec:** Dialog, Single-Page modal, Multi-Page modal
- **Category:** Modals and Wizards
- **Design System:** IDS
- **Figma (validated usage):** `https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=43411-178475&m=dev`
- **Figma (validated component details):** `https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=11348-63064&m=dev`
- **Dialog scenario references:** `43390:21759`, `43390:21754`
- **Figma file key:** `0bHk3XhrjFhowgFkz9yLr4`
- **Validated nodes:**
  - `43411:178475` (`Content`, usage board with `Single-Page` / `Multi-Page`)
  - `43411:184673` (`Single-Page` heading)
  - `43411:184672` (`Multi-Page` heading)
  - `11348:63064` (`Modal-Main` component details)
  - `11348:63031` (`.Modal-Element-Content`)
  - `43390:21759` (`Dialog usage matrix`)
  - `43390:21754` (`Modal - Dialog` source page)
- **Axes from Figma usage + component nodes:**
  - `usage`: `single-page` | `multi-page`
  - `size`: `large` | `medium` | `small` | `x-small`
  - `scrollBar`: `true` | `false`
  - `tabs`: `true` | `false` (used for multi-page usage)
  - `footerCheckbox`: `true` | `false`
  - `fullScreen`: `true` | `false`
  - `dialogType` (dialog scenario): `Critical` | `Destructive` | `Major` | `Warning` | `Informational` | `Non-Alerting`
## Anatomy
- **overlay:** viewport backdrop behind modal surface.
- **surface:** bordered container with elevation and fixed width behavior.
- **header:** title region, optional controls (`full-screen`, close).
- **description:** optional intro/supporting text below header.
- **tabs (multi-page):** top tab strip for intra-modal page navigation. Tabs must use `surface="transparent"` to remove the default surface-2 fill (modal shell provides the background).
- **content:** swappable page/content body (`.Modal-Element-Content` or local content component).
- **footer:** right-aligned action group.
- **footerCheckbox (optional):** "Don’t show again until the next update" option.
- **actions:**
  - baseline modal usage: tertiary + primary actions.
  - dialog scenario keeps severity-specific action intent.
  - **all footer action labels are user-defined at runtime** (no hardcoded labels in component contract).
## Layout & Measurements
- **Size matrix (from `11348:63064`):**
  - `large`: `1600 x 826`
  - `medium`: `1280 x 667`
  - `small`: `960 x 497`
  - `x-small`: `640 x 328`
- **Header insets:** `24px` horizontal, `20px` top, `4px` bottom.
- **Description block (Non-Alerting / Informational):** `16px` top, `24px` right/bottom/left.
- **Description block (Warning / Major / Critical / Destructive):** `8px` top/bottom, `24px` left/right.
- **Description block (single-page / multi-page override):** `8px` top, `8px` bottom, `24px` left/right (overrides type-specific padding for modal-page usage).
- **Content block:** `24px` horizontal, `16px` top, `24px` bottom.
- **Content block (Warning / Major / Critical / Destructive):** `24px` horizontal, `16px` top, `0` bottom.
- **Footer insets:** `24px` all sides.
- **Footer border (single-page / multi-page only):** `border-top: var(--border-width-border-1) solid var(--color-border-accessible)`. Dialog usage has no footer border-top.
- **Action gap:** `12px` between footer buttons.
- **Header control icon size:** `16x16` (`Modal / ctrl-close-16`, optional full-screen icon).
- **Close icon size:** `16x16`.
- **Border:** `1px` solid `var(--color-border-accessible)`.
- **Corner radius:** `var(--modal-control-radius)` (IDS theme resolves to `var(--corner-radius-radius-none)` / 0).
- **Elevation:** layered drop shadow: (0,2) blur 2, (0,4) blur 4, (0,8) blur 8, (0,16) blur 16.
- **Typography:**
  - Title: `Header 5` (`24/32`, regular).
  - Body/content: `Body 2` (`14/20`, regular).
## Tokens

### Layout aliases (theme-resolvable)
Programmes override these **same alias names** in programme theme CSS. Component specs and generated CSS reference aliases only.

| Alias | IDS default (`components/ids-theme.css`) |
|---|---|
| `--modal-control-radius` | `var(--corner-radius-radius-none)` |

- **Surface:** `var(--color-background-component)`, `var(--color-border-accessible)`
- **Text:** `var(--color-text-neutral-strong)` (title), `var(--color-text-neutral)` (body), `var(--color-text-brand-strong)` (tertiary action)
- **Icons:** `var(--color-icon-neutral)` (close), severity icons:
  - Critical/Destructive: `var(--color-icon-alerting-critical)`
  - Warning: `var(--color-icon-alerting-minor)`
  - Major: `var(--color-icon-alerting-major)`
  - Informational: `var(--color-icon-alerting-info)`
- **Buttons:**
  - Primary: `var(--color-background-controls-brand-base)` + `var(--color-text-white)`
  - Destructive primary: `var(--color-background-alerting-critical)` + `var(--color-text-white)`
- **Backdrop:** `var(--color-background-overlay-1)` (runtime token-backed overlay)

### Alerting icon asset mapping (Figma verified)
- `Critical` / `Destructive` -> `status-critical-square-solid` (`1-Solid / status-critical-square-solid`)
- `Warning` -> `status-warn-tri-solid` (`1-Solid / status-warn-tri-solid`)
- `Major` -> `status-error-diamond-solid` (`1-Solid / status-error-diamond-solid`)
- `Informational` -> `info-circ-solid` (`1-Solid / info-circ-solid`)
- `Close` button icon -> `shape-x` (`Black/16` close glyph usage in dialog header)
## States (Light Theme)
| Scenario | Surface | Header/Tabs | Content | Footer |
|---|---|---|---|---|
| Single-Page | `var(--color-background-component)` + `var(--color-border-accessible)` | Header only (no tabs) | single content panel | footer actions, optional checkbox |
| Multi-Page | `var(--color-background-component)` + `var(--color-border-accessible)` | Header + tabs (`active` top indicator + divider borders) | page panel changes by selected tab/page | footer actions, optional checkbox |
| Dialog (non-alerting/informational) | same modal shell | title + optional severity icon | message + optional content | one-button or two-button by type |
| Dialog (warning/major/critical/destructive) | same modal shell | title + severity icon | message + optional confirm input (destructive) | two-button footer; destructive primary for destructive |
## States (Dark Theme)
Same structure and behavior as Light theme. All colors resolve via semantic modal tokens in dark mode (`43390:21759` matrix) with no hardcoded hex values in implementation.

| Scenario | Surface | Header/Tabs | Content | Footer |
|---|---|---|---|---|
| Single-Page | `var(--color-background-component)` + `var(--color-border-accessible)` | header only | single content panel | actions + optional checkbox |
| Multi-Page | `var(--color-background-component)` + `var(--color-border-accessible)` | header + tabs (tokenized active/inactive states) | page panel switched by navigation | actions + optional checkbox |
| Dialog | tokenized dialog shell and severity icon mappings from dialog matrix | title/icon | message/content | type-based action model |
## Interactions
- **Open:** by trigger or controlled `open=true`.
- **Close:** close icon, escape key, optional backdrop click (runtime configurable).
- **Single-Page:** one continuous content area; no internal page switch.
- **Multi-Page:** tab/page switch updates content region inside same modal shell.
- **Scroll usage:** when `scrollBar=true`, content region supports overflow with vertical scrollbar treatment and bottom gradient cue.
- **Footer actions:** emit distinct events for tertiary and primary actions.
- **Destructive flow:** includes confirm text input region before destructive action. Confirm input layout: `16px` gap between label text and input field; input width `300px`; input `border-radius: 0`.
- **Focus-visible:** close and action controls show brand focus ring in keyboard modality.
## Composition & API (runtime)
- **Inputs**
  - `open?: boolean`
  - `defaultOpen?: boolean`
  - `onOpenChange?(open: boolean): void`
  - `scenario?: "single-page" | "multi-page" | "dialog" | "wizard" | "custom"`
  - `pages?: ModalPage[]` (required for `multi-page`; ignored for `single-page` and `dialog`)
  - `activePageId?: string`
  - `onPageChange?(pageId: string): void`
  - `type?: "non-alerting" | "informational" | "warning" | "major" | "critical" | "destructive"`
  - `title: string`
  - `description?: string`
  - `closable?: boolean`
  - `size?: "x-small" | "small" | "medium" | "large"`
  - `tabs?: boolean`
  - `scrollBar?: boolean`
  - `footerCheckbox?: boolean`
  - `fullScreen?: boolean`
  - `children?: Slot` (custom body/content region)
  - `primaryActionLabel: string` (user-defined)
  - `tertiaryActionLabel?: string` (user-defined)
  - `enablePrimaryAction?: boolean`
  - `enableTertiaryAction?: boolean`
- **Outputs**
  - `onClose?(): void`
  - `onPrimaryAction?(): void`
  - `onTertiaryAction?(): void`
  - `onOpenChange?(open: boolean): void`
  - `onPageChange?(pageId: string): void`
## Codegen Contract (Framework-Agnostic Blueprint)
### Deterministic structure
1. `overlay`
2. `surface`
3. `header` (`severityIcon?`, `title`, `closeButton?`)
4. `description?`
5. `content?`
6. `footer` (`tertiaryButton?`, `primaryButton`)

### Variant matrix
- `scenario` in `{single-page, multi-page, dialog, wizard, custom}`; this document concretely defines `single-page`, `multi-page`, and `dialog`.
- `size` in `{x-small, small, medium, large}`.
- `scrollBar` in `{true, false}`.
- `tabs` used by multi-page usage.
- `type` in `{non-alerting, informational, warning, major, critical, destructive}` for `scenario=dialog`.
- action layouts:
  - one-button footer for `{non-alerting, informational}`
  - two-button footer for `{warning, major, critical, destructive}`
- `destructive` supports optional confirmation input inside `content`.

### Per-slot style contract
- `surface`: `background + border + shadow` tokens from Modal table; `border-radius: var(--modal-control-radius)`.
- `header/title`: `Header 5` tokenized typography.
- `description/content`: `Body 2`.
- `footer`: right-aligned actions, `12px` inter-button gap.
- `footer buttons`: must be rendered from the IDS Button contract defined in `components/ids/button/design-spec.md` (variant, size, disabled, focus-visible, and event behavior must inherit IDS Button rules).
- `severityIcon`: tokenized by type.

### Behavior contract
- modal focus trap when open.
- escape closes when closable.
- close button hidden when `closable=false`.
- multi-page tabs/pages update only content panel; header/footer remain stable.
- single-page must not render tab strip.
- primary/tertiary buttons emit exactly one callback per activation.
- footer button visible labels come from runtime props (`primaryActionLabel`, `tertiaryActionLabel`) and must not be hardcoded to strings like "Apply" or "Cancel".

### Accessibility contract
- root role: `dialog`, `aria-modal=true`.
- title wired via `aria-labelledby`.
- description wired via `aria-describedby` when present.
- close button has explicit `aria-label="Close"`.
- keyboard navigation preserves focus order across close, body controls, and footer buttons.

### Asset resolution + bundling contract
- close icon resolves from `assets/icons/shape-x.svg`.
- severity icons resolve from `/assets/icons/<slug>.svg` using this deterministic map:
  - `critical` / `destructive` -> `status-critical-square-solid.svg`
  - `warning` -> `status-warn-tri-solid.svg`
  - `major` -> `status-error-diamond-solid.svg`
  - `informational` -> `info-circ-solid.svg`

### Fallback/error rules
- unknown `scenario` falls back to `single-page`.
- unknown `type` falls back to `non-alerting`.
- when `scenario=multi-page` and `pages` is empty, render a deterministic empty state or fail validation.
- missing `title` is a validation error.
- missing `primaryActionLabel` is a validation error.
- if both `open` and `defaultOpen` are supplied, `open` wins (controlled mode).

### Validation checklist
- [ ] Modal renders `single-page` and `multi-page` usages with correct layout model.
- [ ] Size matrix (`large/medium/small/x-small`) matches usage and component nodes.
- [ ] Surface width, paddings, and border align with Figma modal usage board.
- [ ] Destructive type uses destructive primary action style and confirm content slot.
- [ ] Keyboard focus trap and escape behavior function in modal mode.
- [ ] Light and dark theme snapshots preserve tokenized contrast.
## Implementation Notes

### Design spec errors fixed for single-page / multi-page modal (2026-07-16)
- **Footer border for modal-page missing** — Single-page and multi-page usages add `border-top: var(--border-width-border-1) solid var(--color-border-accessible)` on the footer. Dialog usage does not. Was missing from spec. Added to Layout & Measurements.
- **Description modal-page padding missing** — Single-page and multi-page override description padding to `8px top / 8px bottom` (vs the type-specific defaults). Was missing from spec. Added to Layout & Measurements.
- **Tab strip surface requirement missing** — Tabs in multi-page usage must use `surface="transparent"` to prevent the default `--color-background-surface-2` fill from showing. Was missing from spec. Added to Anatomy.

### Design spec errors fixed for dialog (2026-07-01)
- **Shadow specification incorrect** — Original spec: "layered drop shadow (2/4/8/16 depth stack)" without explicit values. Fix: Updated to explicit 4-layer shadow specification: (0,2) blur 2, (0,4) blur 4, (0,8) blur 8, (0,16) blur 16.
- **Destructive flow specification incomplete** — Original spec: "includes confirm text input region before destructive action" without layout details. Fix: Added confirm input layout specifications: 16px gap between label text and input field; input width 300px; input border-radius 0.
- **Description block padding incomplete** — Original spec: "24px horizontal, 8px vertical" for all types. Fix: Added type-specific padding: Non-Alerting/Informational (16px top, 24px right/bottom/left), Warning/Major/Critical/Destructive (8px top/bottom, 24px left/right).
- **Content block padding incomplete** — Original spec: "24px horizontal, 16px top, 24px bottom" for all types. Fix: Added type-specific padding for Warning/Major/Critical/Destructive (24px horizontal, 16px top, 0 bottom).

## Source Mapping
- **Component map:** `data/component-figma-map.json` -> `Dialog` entry pointing to `components/ids/modal/design-spec.md`
- **Figma nodes used:**
  - `43411:178475` (`Content`, usage board)
  - `11348:63064` (`Modal-Main`, component details)
  - `43411:184673` (`Single-Page` usage label)
  - `43411:184672` (`Multi-Page` usage label)
  - `43390:21759` (`Dark` matrix)
  - `43390:21754` (`Modal - Dialog` page)
  - `11349:116221` (`ModalDialog-Main`)
  - `24622:130530` (`Type=Critical`)
  - `11349:116230` (`Type=Destructive`)
- **Figma icon names captured from dialog matrix nodes:**
  - `1-Solid / status-critical-square-solid`
  - `1-Solid / status-warn-tri-solid`
  - `1-Solid / status-error-diamond-solid`
  - `1-Solid / info-circ-solid`
- **Extraction method:** Figma MCP `get_design_context` + `get_variable_defs` (validated 2026-04-20)
