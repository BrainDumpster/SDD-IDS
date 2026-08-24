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
- **tabs (multi-page):** top tab strip for intra-modal page navigation.
- **content:** swappable page/content body (`.Modal-Element-Content` or local content component).
- **footer:** right-aligned action group.
- **footerCheckbox (optional):** "Don’t show again until the next update" option.
- **actions:**
  - baseline modal usage: tertiary + primary actions.
  - dialog scenario keeps severity-specific action intent.
  - **all footer action labels are user-defined at runtime** (no hardcoded labels in component contract).

### Composed patterns (nested components)

#### What's New (`components/ids/whats-new/design-spec.md`)

The **What's New** pattern is a canonical **single-page Modal host** with custom body and footer chrome. It does **not** use `scenario=dialog` severity types.

| Layer | `IdsModal` layer | Modal scenario | When visible | Header title | Footer |
|---|---|---|---|---|---|
| **Main (`WhatsNewRoot`)** | `main` | `single-page` | `open=true` | `title` (default `What's New`) | toggle + primary **Close** |
| **Carousel (`WhatsNewCarouselModal`)** | `carousel` | `single-page` | thumbnail click | `section.title` | same root toggle + **Close** (dismiss carousel only) |
| **Single preview (`WhatsNewSinglePreviewModal`)** | `single-preview` | `single-page` | `popout-double` in carousel | `section.title` | dismiss single layer only |

**Modal anatomy mapping (main layer):**

Canonical Modal slot tree for `layer=main` (Codegen Contract). Hosts project into these slots; do not invent alternate hierarchies.

```
IdsModal [scenario, open, size, layer=main]
├── overlay
└── surface
    ├── header
    │   ├── severityIcon?      (dialog types except non-alerting)
    │   ├── title
    │   └── closeButton?       (`IdsModal.Close` when closable)
    ├── description?
    ├── tabs?                  (multi-page only; omitted for single-page / dialog)
    ├── content?               (custom body / active page panel)
    └── footer
        ├── footerCheckbox?    ("Don't show again until the next update" when enabled)
        └── actions
            ├── tertiaryButton?  (IDS Button; user-defined label)
            └── primaryButton    (IDS Button; user-defined label)
```

**What's New host mapping (fills Modal slots — main layer):**

| Modal slot | What's New part |
|---|---|
| `header` → `title` + `closeButton` | `WhatsNewTitle` (Header 5) + `WhatsNewCloseButton` (`IdsModal.Close`) |
| `description` | `WhatsNewSummary` (Body 2 intro below title row) |
| `content` | `WhatsNewBody` (version/filter row + scrollable sections) |
| `footer` → `footerCheckbox` + `primaryButton` | `WhatsNewFooter` (toggle + primary **Close** via IDS Button) |

Runtime: `scenario=single-page`; sample frame `1152×708`; width is host-driven (`width: 100%`, `max-width`, `box-sizing: border-box`). Default size reference remains `medium` when a fixed matrix size is required.

**Stacking contract:** three independent `IdsModal` instances (main → carousel → single-preview). Carousel and single-preview z-index layers sit above main (`1002–1005`). **Escape** dismisses the topmost open layer only; main close dismisses the entire pattern.

**Figma shell:** What's New uses `Modal-Main` (`27437:44152`) inside `WhatsNew-Main` (`27437:44073`).

**Reference implementation:** `storybook/src/components/IdsWhatsNew.tsx` (hosts all three layers via `IdsModal`); lib: `lib/react/ids/modal/`.

## Layout & Measurements
- **Size matrix (from `11348:63064`):**
  - `large`: `1600 x 826`
  - `medium`: `1280 x 667`
  - `small`: `960 x 497`
  - `x-small`: `640 x 328`
- **Header insets:** `24px` horizontal, `24px` top, `8px` bottom (`var(--padding-padding-24)` / `var(--padding-padding-8)`). Live-verified on Dialog matrix `43390:21759` header rows (`pb` = `padding-8`). Apply the same header insets for single-page / multi-page / dialog chrome.
- **Description block (Non-Alerting / Informational):** `16px` top, `24px` right/bottom/left.
- **Description block (Warning / Major / Critical / Destructive):** `8px` top/bottom, `24px` left/right.
- **Content block:** `24px` horizontal, `16px` top, `24px` bottom.
- **Content block (Warning / Major / Critical / Destructive):** `24px` horizontal, `16px` top, `0` bottom.
- **Footer insets:** `24px` all sides.
- **Action gap:** `12px` between footer buttons.
- **Header control icon size:** `16x16` (`Modal / ctrl-close-16`, optional full-screen icon).
- **Close icon size:** `16x16`.
- **Border:** `1px` solid `var(--color-border-gray-neutral-base)`.
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

- **Surface:** `var(--color-background-surface-component)`, `var(--color-border-gray-neutral-base)`
- **Text:** `var(--color-text-gray-neutral-strong)` (title), `var(--color-text-gray-neutral)` (body), `var(--color-text-brand-strong)` (tertiary action)
- **Icons:** `var(--color-icon-gray-neutral-base)` (close), severity icons:
  - Critical/Destructive: `var(--color-icon-alerting-critical-base)`
  - Warning: `var(--color-icon-alerting-minor-base)`
  - Major: `var(--color-icon-alerting-major-base)`
  - Informational: `var(--color-icon-alerting-info-base)`
- **Buttons:**
  - Primary: `var(--color-background-controls-base)` + `var(--color-text-gray-white)`
  - Destructive primary: `var(--color-background-alerting-critical-base)` + `var(--color-text-gray-white)`
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
| Single-Page | `var(--color-background-surface-component)` + `var(--color-border-gray-neutral-base)` | Header only (no tabs) | single content panel | footer actions, optional checkbox |
| Multi-Page | `var(--color-background-surface-component)` + `var(--color-border-gray-neutral-base)` | Header + tabs (`active` top indicator + divider borders) | page panel changes by selected tab/page | footer actions, optional checkbox |
| Dialog (non-alerting/informational) | same modal shell | title + optional severity icon | message + optional content | one-button or two-button by type |
| Dialog (warning/major/critical/destructive) | same modal shell | title + severity icon | message + optional confirm input (destructive) | two-button footer; destructive primary for destructive |
## States (Dark Theme)
Same structure and behavior as Light theme. All colors resolve via semantic modal tokens in dark mode (`43390:21759` matrix) with no hardcoded hex values in implementation.

| Scenario | Surface | Header/Tabs | Content | Footer |
|---|---|---|---|---|
| Single-Page | `var(--color-background-surface-component)` + `var(--color-border-gray-neutral-base)` | header only | single content panel | actions + optional checkbox |
| Multi-Page | `var(--color-background-surface-component)` + `var(--color-border-gray-neutral-base)` | header + tabs (tokenized active/inactive states) | page panel switched by navigation | actions + optional checkbox |
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

### Compound composition (anatomy slots)

```
IdsModal
  IdsModalHeader
    severityIcon? | IdsModalTitle | IdsModalClose?
  IdsModalDescription?
  IdsModalTabs?                         (multi-page)
  IdsModalContent?
  IdsModalFooter
    footerCheckbox? | tertiary + primary actions (IDS Button)
```

`IdsModal.Close` is an alias of `IdsModalClose` (closes the open modal).

### Root props

**Required for prop-driven chrome (when compound slots are not projected)**

- `title: string`
- `primaryActionLabel: string` (user-defined)

**Optional**

- `open?: boolean`
- `defaultOpen?: boolean`
- `onOpenChange?(open: boolean): void`
- `scenario?: "single-page" | "multi-page" | "dialog" | "wizard" | "custom"`
- `pages?: ModalPage[]` (required for `multi-page`; ignored for `single-page` and `dialog`)
- `activePageId?: string`
- `onPageChange?(pageId: string): void`
- `type?: "non-alerting" | "informational" | "warning" | "major" | "critical" | "destructive"`
- `description?: string`
- `closable?: boolean`
- `size?: "x-small" | "small" | "medium" | "large"`
- `tabs?: boolean`
- `scrollBar?: boolean`
- `footerCheckbox?: boolean`
- `fullScreen?: boolean`
- `layer?: "main" | "carousel" | "single-preview"`
- `children?: Slot` — either compound anatomy parts **or** custom `content` body when using prop-driven chrome
- `tertiaryActionLabel?: string` (user-defined)
- `enablePrimaryAction?: boolean`
- `enableTertiaryAction?: boolean`

### Outputs

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
5. `tabs?` (multi-page only)
6. `content?`
7. `footer` (`footerCheckbox?`, `tertiaryButton?`, `primaryButton`)

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
- `header`: padding `var(--padding-padding-24)` top/left/right, `var(--padding-padding-8)` bottom.
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
- [ ] **What's New** pattern hosts main/carousel/single-preview layers via `IdsModal` with documented stack z-index and anatomy mapping.
- [ ] Size matrix (`large/medium/small/x-small`) matches usage and component nodes.
- [ ] Surface width, paddings, and border align with Figma modal usage board.
- [ ] Header insets are `24px` top/left/right and `8px` bottom (`padding-24` / `padding-8`).
- [ ] Destructive type uses destructive primary action style and confirm content slot.
- [ ] Keyboard focus trap and escape behavior function in modal mode.
- [ ] Light and dark theme snapshots preserve tokenized contrast.
## Implementation Notes

### Design spec errors fixed (2026-07-01)
- **Shadow specification incorrect** — Original spec: "layered drop shadow (2/4/8/16 depth stack)" without explicit values. Fix: Updated to explicit 4-layer shadow specification: (0,2) blur 2, (0,4) blur 4, (0,8) blur 8, (0,16) blur 16.
- **Destructive flow specification incomplete** — Original spec: "includes confirm text input region before destructive action" without layout details. Fix: Added confirm input layout specifications: 16px gap between label text and input field; input width 300px; input border-radius 0.
- **Description block padding incomplete** — Original spec: "24px horizontal, 8px vertical" for all types. Fix: Added type-specific padding: Non-Alerting/Informational (16px top, 24px right/bottom/left), Warning/Major/Critical/Destructive (8px top/bottom, 24px left/right).
- **Content block padding incomplete** — Original spec: "24px horizontal, 16px top, 24px bottom" for all types. Fix: Added type-specific padding for Warning/Major/Critical/Destructive (24px horizontal, 16px top, 0 bottom).
- **Header bottom inset incorrect (2026-08-10)** — Spec/lib used `20px` top / `4px` bottom. Live Dialog matrix (`43390:21759`) and Dialog chrome use `24px` top / `8px` bottom (`padding-24` / `padding-8`). Updated Layout, Codegen header slot, and implementations accordingly. (`Modal-Main` `11348:63064` header still binds `padding-4` bottom in Figma; Dialog usage is the authoritative runtime contract.)

## Source Mapping
- **Component map:** `data/component-figma-map.json` -> `Dialog` entry pointing to `components/ids/modal/design-spec.md`
- **Composed pattern:** `data/component-figma-map.json` -> `Whats New` → `components/ids/whats-new/design-spec.md` (hosts content in `IdsModal` / `scenario=single-page`)
- **Reference implementation (React):** `storybook/src/components/IdsModal.tsx` (composable shell); `storybook/src/components/Dialog.tsx` (dialog prop API); `storybook/src/components/IdsWhatsNew.tsx` (What's New stack)
- **Lib React implementation (no Base UI):** `lib/react/ids/modal/` (`IdsModal`, `IdsModalHeader`, `IdsModalTitle`, `IdsModalDescription`, `IdsModalContent`, `IdsModalFooter`, `IdsModalClose`; selectors `ids-modal-*`); stories: `storybook/src/components/lib-generated/Modal.stories.tsx`
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
- **Extraction method:** Figma MCP `get_design_context` + `get_variable_defs` + `get_metadata`
- **Last live verification:** 2026-08-10 — header insets revalidated (`43390:21759` Dialog matrix → `padding-24` top / `padding-8` bottom; `33841:42077` Modal-Main header still `padding-4` bottom)
