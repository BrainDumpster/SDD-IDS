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
Root shell (overlay + surface + header chrome):
- **modalRoot** (`ids-modal` / `IdsModal`) — open/close, scenario, type, size, closable, scroll. Root may own **configuration** (e.g. multi-page `tabs` / `pages`) but must not render user content on the surface.

Deterministic projected child order (only these three slots between header chrome and footer):
1. **modalTitle** (`ids-modal-title` / `IdsModal.Title`) — `Header 5` title copy; wires `aria-labelledby`.
2. **modalBody** (`ids-modal-body` / `IdsModal.Body`) — **sole region for all main content** (see body containment rule below).
3. **modalFooter** (`ids-modal-footer` / `IdsModal.Footer`) — projected `ids-button` / `Button` actions; optional root `footerCheckbox`.

Root-owned chrome (not separate public slots):
- **overlay** — viewport backdrop.
- **header chrome** — severity icon (dialog types), close (`16×16`, no button padding).
- **footerCheckbox** — optional; rendered inside `modalFooter` when `footerCheckbox=true` on root.

### Body containment rule (codegen — all frameworks)

**Every** interactive or presentational component in the modal main area — `Tabs`, `TextBox`, `Checkbox`, tables, forms, custom markup, built-in multi-page chrome, etc. — must render **inside** `modalBody` / `bodyContentShell`. Nothing except `modalTitle`, `modalBody`, and `modalFooter` may be a direct child of `surface` / `modalRoot` between header and footer.

- Project (or shorthand-render) all such components as children of `ids-modal-body` / `IdsModal.Body`, not as siblings of the body on the surface.
- `bodyContentShell` applies horizontal inset (`--ids-modal-inset-inline`), scroll, and overflow containment so borders, backgrounds, and wide content do not bleed to the modal edge.
- **Footer actions** belong in `modalFooter` only (not in `modalBody`).
- **Title** belongs in `modalTitle` only (not in `modalBody`).

### `modalBody` internal order

```
modalBody
  description?          ← optional intro; horizontal inset on description slot
  bodyContentShell      ← scrollable region (`.ids-modal__content` / `IdsModal.Body` inner shell)
    projectedContent*   ← ALL user/framework main-area components (Tabs, inputs, panels, markup, …)
```

Multi-page built-in chrome (when `tabs=true`) is still `projectedContent` from codegen’s perspective: `tabStrip` + `pagePanel` render inside `bodyContentShell`, not on `surface`.
## Layout & Measurements
- **Size matrix (from `11348:63064`):**
  - `large`: `1600 x 826`
  - `medium`: `1280 x 667`
  - `small`: `960 x 497`
  - `x-small`: `640 x 328`
- **Header insets:** `24px` top / left / right, `8px` bottom.
- **Close control:** `16×16` icon (`Modal / ctrl-close-16`); no button padding — hit target is the glyph box only.
- **Description block:** `24px` horizontal, `8px` vertical; renders above `bodyContentShell` inside `modalBody`.
- **Body content shell (`bodyContentShell`):** all main-area components live here. Horizontal inset `var(--ids-modal-inset-inline)` (`24px` per Figma `Modal-Main`). Single-page / dialog: `16px` top, `24px` bottom padding on shell. Multi-page: shell owns horizontal inset; built-in `tabStrip` + `pagePanel` stack inside (see reference implementations). **Only** the footer top border spans the full modal surface width — not body children.
- **Multi-page (example):** vertical order **header → description → body content (tabs + page panel) → footer**. Tab strip is one kind of body child; same containment rule applies to any other component.
- **Footer insets:** `24px` all sides.
- **Footer top border:** present on `Modal-Main` single-page / multi-page usage (`border-t` on footer); **absent** on `ModalDialog-Main` dialog types including non-alerting and informational (`40191:26351`, `11349:116222`).
- **Action gap:** `12px` between footer buttons.
- **Header control icon size:** `16×16` (`Modal / ctrl-close-16`); close control has **no** extra button padding beyond the glyph box.
- **Border:** `1px` solid `var(--color-border-accessible)`.
- **Corner radius:** `var(--modal-control-radius)` (IDS theme resolves to `var(--corner-radius-radius-none)` / 0).
- **Elevation:** layered drop shadow (2/4/8/16 depth stack).
- **Typography:**
  - Title: `Header 5` (`24/32`, regular).
  - Body/content: `Body 2` (`14/20`, regular).
## Tokens

### Layout aliases (theme-resolvable)
Programmes override these **same alias names** in programme theme CSS. Component specs and generated CSS reference aliases only.

| Alias | IDS default (`components/ids-theme.css`) |
|---|---|
| `--modal-control-radius` | `var(--corner-radius-radius-none)` |
| `--ids-modal-inset-inline` | `var(--padding-padding-24)` (`24px`) — shared horizontal inset for header, description, body content shell, footer |

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
- **Destructive flow:** includes confirm text input region before destructive action.
- **Focus-visible:** close and action controls show brand focus ring in keyboard modality.
## Composition & API (runtime)
Canonical mirror: `component-contracts/ids/modal.contract.ts`.

### Child-order diagram (preferred)

```
ids-modal [scenario, type, size, closable, scrollBar, tabs?, pages?, footerCheckbox?]
  ids-modal-title
  ids-modal-body [description?]
    <!-- ALL main-area components here: Tabs, TextBox, forms, panels, markup, … -->
  ids-modal-footer
    ids-button × n
```

React: `IdsModal` → `IdsModal.Title` → `IdsModal.Body` (all main content as children) → `IdsModal.Footer` → `Button` children.

**Forbidden:** placing main-area components as direct children of `ids-modal` / `IdsModal` outside `ids-modal-body` / `IdsModal.Body` (e.g. `<Tabs>` sibling to body on the surface).

String props (`title`, `description`, `primaryActionLabel`, `tertiaryActionLabel`) remain **shorthand** for Storybook controls when composition slots are not projected.

### Root (`ids-modal` / `IdsModal`)

| Input | Type | Default | Notes |
|---|---|---|---|
| `open` | `boolean` | — | Controlled visibility |
| `defaultOpen` | `boolean` | `false` | Uncontrolled initial state |
| `onOpenChange` | `(open: boolean) => void` | — | Visibility callback |
| `scenario` | `single-page \| multi-page \| dialog` | `dialog` | Usage model |
| `type` | dialog severity | `non-alerting` | Dialog scenario only |
| `size` | `x-small \| small \| medium \| large` | `medium` | Figma size matrix |
| `closable` | `boolean` | `true` | Close icon + escape |
| `scrollBar` | `boolean` | `false` | Scrollable body + gradient cue |
| `tabs` | `boolean` | `false` | Multi-page tab strip on root |
| `pages` | `ModalPage[]` | `[]` | Multi-page content when `tabs=true` |
| `footerCheckbox` | `boolean` | `false` | Checkbox in footer slot |
| `title` | `string` | — | Shorthand when `ids-modal-title` absent |
| `description` | `string` | — | Shorthand when `ids-modal-body` absent |
| `primaryActionLabel` | `string` | — | Shorthand footer primary when slot absent |
| `tertiaryActionLabel` | `string` | — | Shorthand footer tertiary when slot absent |

| Output | Notes |
|---|---|
| `openChange` / `onOpenChange` | Visibility changed |
| `closed` / `onClose` | Modal closed |
| `primaryAction` | Shorthand footer primary (legacy) |
| `tertiaryAction` | Shorthand footer tertiary (legacy) |
| `pageChange` | Multi-page tab selected |

### Title (`ids-modal-title` / `IdsModal.Title`)
- Projects title text into `Header 5` typography.
- Required in composition mode (or use root `title` shorthand).

### Body (`ids-modal-body` / `IdsModal.Body`)
| Input | Notes |
|---|---|
| `description` | Optional intro copy (`aria-describedby`); renders **above** `bodyContentShell` |
| projected children | **All** main-area UI — any IDS or app component, markup, forms, `Tabs`, confirm inputs, etc. Must render inside `bodyContentShell` |
| root `tabs` + `pages` (Angular shorthand) | When `ids-modal-body` is absent, built-in multi-page chrome still renders inside an equivalent `bodyContentShell` on the root (legacy). **Codegen and new apps must use `ids-modal-body`.** |

**Body diagram (codegen):**

```
ids-modal-body
  [description="…"]?
  bodyContentShell  (padding-inline: var(--ids-modal-inset-inline); scroll/overflow containment)
    * projected components (Tabs, TextBox, DataGrid, custom div, built-in tabStrip+pagePanel, …)
```

### Footer (`ids-modal-footer` / `IdsModal.Footer`)
- Projects footer actions (`ids-button` / `Button`); labels are **user-defined**.
- Dialog one-button types: single projected primary.
- Dialog two-button types: tertiary + primary (or destructive primary).
## Codegen Contract (Framework-Agnostic Blueprint)
### Deterministic structure
1. `overlay`
2. `surface`
3. `modalRoot` (header chrome: `severityIcon?`, `closeButton?` only — **no** user content at this level)
4. `modalTitle`
5. `modalBody`:
   - `description?`
   - `bodyContentShell` (scroll region; horizontal inset + overflow containment)
     - `projectedContent*` — every main-area component (including multi-page `tabStrip` / `pagePanel` when applicable)
6. `modalFooter` (`footerCheckbox?`, projected `ids-button` actions)

Mirror: `MODAL_CODEGEN_ANATOMY`, `MODAL_BODY_CODEGEN_ANATOMY`, and `MODAL_BODY_CONTAINMENT_RULE` in `component-contracts/ids/modal.contract.ts`.

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
- `description`: `Body 2`; horizontal inset `var(--ids-modal-inset-inline)`; sits **outside** `bodyContentShell` but still inside `modalBody`.
- `bodyContentShell`: owns horizontal inset (`--ids-modal-inset-inline`), scroll (`scrollBar`), and `overflow-x` containment for all descendants. Child components (`width: 100%`, borders, backgrounds) must not extend past the shell content box.
- `projectedContent`: any component inside `bodyContentShell` inherits shell inset; do not add surface-level siblings for body UI.
- `footer`: right-aligned actions, `12px` inter-button gap; only region (besides header chrome) that may use full surface width for a top border.
- `footer buttons`: must be rendered from the IDS Button contract defined in `components/ids/button/design-spec.md` (variant, size, disabled, focus-visible, and event behavior must inherit IDS Button rules).
- `severityIcon`: tokenized by type.

### Behavior contract
- modal focus trap when open.
- escape closes when closable.
- close button hidden when `closable=false`.
- all main-area interaction targets live inside `modalBody` / `bodyContentShell`; header and footer slots remain stable when body content changes (e.g. multi-page page switch).
- single-page must not render tab strip unless projected inside body.
- primary/tertiary buttons emit exactly one callback per activation (shorthand footer) or activate via projected `ids-button` / `Button` children (composition footer).
- footer button visible labels are **user-defined** via projected actions or shorthand props (`primaryActionLabel`, `tertiaryActionLabel`); do not hardcode strings like "Apply" or "Cancel" in component source.

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
- missing `title` is a validation error (or missing `ids-modal-title` / `IdsModal.Title` in composition mode).
- missing footer actions is a validation error (no `ids-modal-footer` / `IdsModal.Footer` and no `primaryActionLabel` shorthand).
- main-area components projected on `modalRoot` / `surface` outside `modalBody` is a **validation error** (codegen must emit `ids-modal-body` / `IdsModal.Body` wrapper).
- if both `open` and `defaultOpen` are supplied, `open` wins (controlled mode).

### Validation checklist
- [ ] **Body containment:** every main-area component is a descendant of `modalBody` / `bodyContentShell` — never a direct child of `surface` / `modalRoot` (except the three composition slots).
- [ ] `bodyContentShell` applies `--ids-modal-inset-inline` and contains overflow; footer top border only spans full modal width.
- [ ] Composition API (`modalTitle` → `modalBody` → `modalFooter`) renders in documented child order for Angular and React reference stories.
- [ ] Multi-page: built-in or projected `Tabs` (and page content) appear inside `modalBody`, not on the surface.
- [ ] Modal renders `single-page` and `multi-page` usages with correct layout model.
- [ ] Size matrix (`large/medium/small/x-small`) matches usage and component nodes.
- [ ] Surface width, paddings, and border align with Figma modal usage board.
- [ ] Destructive type uses destructive primary action style and confirm content slot.
- [ ] Keyboard focus trap and escape behavior function in modal mode.
- [ ] Light and dark theme snapshots preserve tokenized contrast.
## Source Mapping
- **Component map:** `data/component-figma-map.json` -> `Dialog` entry pointing to `components/ids/modal/design-spec.md`
- **Contract mirror:** `component-contracts/ids/modal.contract.ts`
- **Reference implementation (Angular):** `storybook-angular/src/components/ids-modal/`
- **Reference implementation (React):** `storybook/src/components/IdsModal.tsx` (composition); `storybook/src/components/Dialog.tsx` (legacy prop API for Synapse)
- **Storybook (Angular):** `storybook-angular/src/components/ids-modal/ids-modal.stories.js`, `ids-modal-dialog.stories.js` (port **6007**)
- **Storybook (React):** `storybook-generated/ids/src/components/Modal.stories.tsx`, `storybook/src/components/IdsDialog.stories.tsx`
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
