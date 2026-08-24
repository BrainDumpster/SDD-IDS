<!-- ds:inherits root-spec -->
# Toast (IDS)

## Metadata
- Component: Toast
- Category: Alerts and Notifications
- Design system: IDS
- File key: `VZJ48bbVYrIynw8DdSukWw`
- Examples node: `42903:139689`
- Base icon node: `39484:7432`
- Examples URL: https://www.figma.com/design/VZJ48bbVYrIynw8DdSukWw/-Exploration-only--IDS-with-variables?node-id=42903-139689&m=dev
- Base URL: https://www.figma.com/design/VZJ48bbVYrIynw8DdSukWw/-Exploration-only--IDS-with-variables?node-id=39484-7432&m=dev
## Anatomy

Deterministic slot order (projected children; optional branches omitted when absent):

```
ToastViewport (optional stack + FIFO queue)
  ToastItem (repeated)
    IconContainer          required — status icon (`shapeName` from type table)
    Message                required — notification text
    ViewDetailsAction      optional — when `link` is present
    CloseAction            optional — when `closable` is true
```

Angular selectors (reference implementation):

```
ids-toast-viewport
  ids-toast-item
    ids-toast-icon-container
    ids-toast-message
    ids-toast-view-details-action
    ids-toast-close-action
```

## Layout & Measurements
- Item container: `height: 48px`, `padding-inline: left 24px, right 16px`, `padding-block: 14px`.
- Item sample widths from Figma: `516px` (without view details), `617px` (with view details); runtime width is container-driven.
- Root surface: `background: var(--color-static-gray-900)`, `box-shadow: inset 0 0 0 1px var(--color-border-gray-white)` (inner border), `border-radius: var(--toast-control-radius)` (IDS theme resolves to `var(--corner-radius-radius-2)` / 2px).
- Row composition: two horizontal groups with `justify-content: space-between`:
  - `ContentGroup` (status icon + message) with `padding-top: var(--padding-padding-2)`
  - `ActionGroup` (optional view details button + close)
- Content row: horizontal layout with icon/message gap exactly `8px`.
- Action row: horizontal layout with view details/close gap exactly `var(--spacing-space-4)` (4px) when view details exists.
- Vertical alignment: status icon and message must be top-aligned on the same row (`align-items: flex-start` in root, contentGroup, and iconWrap).
- Status icon slot: fixed `16x16` container with `padding-block: var(--padding-padding-2)` and `16x16` rendered icon (no scaling above slot size).
- Close action: IDS tertiary icon-only button, fixed `24×24` inner control (`26×26` outer with the separate 1px Button border), `Padding/padding-6` on all sides, `shape-x` icon `12×12`.
- View Details action: IDS small tertiary button with `View Details` text, uses IDS Button component `sm` size/padding, text color `var(--color-text-gray-white)`, matching close button hover/active colors.
## Tokens

### Layout aliases (theme-resolvable)
Programmes override these **same alias names** in programme theme CSS. Component specs and generated CSS reference aliases only.

| Alias | IDS default (`components/ids-theme.css`) |
|---|---|
| `--toast-control-radius` | `var(--corner-radius-radius-2)` |

### Core surface/text tokens
- Surface: `var(--color-static-gray-900)`
- Border: `var(--color-border-gray-white)`
- Message text: `var(--color-static-gray-white)`
- View Details button text: `var(--color-text-gray-white)`
- Close button icon: `var(--color-icon-gray-white)` (default state)

### Status tokens and icon mapping
| Type | Icon (`shapeName`) | Icon color token | Border token | Text token |
|---|---|---|---|---|
| `info` | `info-circ-solid` | `var(--color-icon-alerting-info-base)` | `var(--color-border-alerting-info-base-white)` | `var(--color-static-gray-white)` |
| `critical` | `status-critical-square-solid` | `var(--color-icon-alerting-critical-base)` | `var(--color-border-alerting-critical-base-white)` | `var(--color-static-gray-white)` |
| `major-warning` | `status-error-diamond-solid` | `var(--color-icon-alerting-major-base)` | `var(--color-border-alerting-major-base-white)` | `var(--color-static-gray-white)` |
| `minor-warning` | `status-warn-tri-solid` | `var(--color-icon-alerting-minor-base)` | `var(--color-border-alerting-minor-base)` | `var(--color-static-gray-white)` |
| `success` | `status-ok-circ-solid` | `var(--color-icon-alerting-success-base)` | `var(--color-border-alerting-success-base-white)` | `var(--color-static-gray-white)` |
## States (Light Theme)
| State | Background | Border | Text/Icon |
|---|---|---|---|
| Rest | `var(--color-static-gray-900)` | Variant border token (table above) | Message/view details `var(--color-static-gray-white)`; close button icon `var(--color-icon-gray-white)` |
| Hover close | `var(--ui-palette-brand-900)` | `var(--ui-palette-brand-400)` | Close button icon `var(--color-icon-gray-white)` |
| Active close | `var(--ui-palette-brand-800)` | `var(--ui-palette-brand-400)` | Close button icon `var(--color-icon-gray-white)` |
| Focus-visible view details | No root color change | No change | Focus ring uses brand token from root-spec rules |
## States (Dark Theme)
Use the same semantic tokens as Light Theme. Dark mode behavior is token-resolved, with the same structural table and no hardcoded hex in runtime code.
## Interactions
- Toast appears with entrance motion and exits with dismissal motion.
- `close` click removes toast item and emits dismissal event.
- Optional view details action emits view details event when clicked.
- Auto-dismiss timer runs per toast item when `duration > 0`.
- Hover/focus pauses auto-dismiss timer for that item (recommended behavior contract).
- `Escape` dismisses focused toast item.
## Composition & API (runtime)

Canonical API is **viewport + projected `ToastItem` children** (not an aggregate-only `items[]` list). Item slots are projected in Anatomy order. Item-level props remain on `ToastItem` when a slot is omitted (fallback chrome).

Contract mirror: `component-contracts/ids/toast.contract.ts`.

### `ToastViewport` (stack + queue owner)
- `position`: `top-left | top-center | top-right | bottom-left | bottom-center | bottom-right` (default `top-right`).
- `maxVisible`: number (recommended default `3`).
- `queueStrategy`: FIFO.

### `ToastItem` (single notification)
- `id`: optional string included in close/timeout payloads.
- `type`: `info | critical | major-warning | minor-warning | success` (default `info`).
- `message`: string (required).
- `duration`: number, default `8000`. `0` disables auto-dismiss. Invalid (`< 0` or NaN) → `8000`.
- `closable`: boolean, default `true`.
- `link`: optional structured view details object (see view details contract below).
- `role`: `status` (default) or `alert`.
- `className`: optional extra class on the item root.
- `onClose`: emitted with `{ id?, reason }` (`close-click | timeout | programmatic`).
- `onTimeout`: emitted with `{ id? }` when the timer dismisses.

### Child-order diagram
`ToastViewport` → repeated `ToastItem` → `IconContainer` → `Message` → optional `ViewDetailsAction` → optional `CloseAction`.

Queue/stack behavior contract:
1. New item is appended to queue.
2. If visible slots are full, item waits in queue.
3. When an item closes/expires, next queued item enters visible stack.
4. In top positions, newest visible toast appears at bottom; older items move upward.
5. In bottom positions, newest visible toast appears at top; older items move downward.
### View Details contract
`link` object shape:
- `label: string` (required if link exists)
- `href?: string`
- `routerLink?: string | string[]`
- `target?: "_self" | "_blank" | "_parent" | "_top"`
- `onClick?: (event) => void`

Resolution rules:
1. Angular: if `routerLink` is present, render router navigation binding.
2. Else if `href` is present, render anchor navigation.
3. Else render button-style link and emit `onClick`.
4. If both `routerLink` and `href` are provided, prefer `routerLink`.
## Codegen Contract (Framework-Agnostic Blueprint)

### Deterministic structure
- `ToastViewport` -> repeated `ToastItem` -> `IconContainer` + `Message` + optional `ViewDetailsAction` + optional `CloseAction`.
- `IconContainer` always renders the status icon for the resolved `type`.
- `Message` renders projected text, or `message` when the slot is empty.
- `ViewDetailsAction` renders when `link` is present (or the slot is projected with a label).
- `CloseAction` renders when `closable` is true.

### Variant matrix
- Supported types: `info`, `critical`, `major-warning`, `minor-warning`, `success`.
- `view details` optional for each type.
- `duration` and `position` supported for all combinations.

### Per-slot style contract
- `ToastItem` root: `border-radius: var(--toast-control-radius)`.
- Root/background/border/text/close must use semantic tokens defined in this spec.
- Status icon must use icon component with `shapeName` from mapping table.
- Status icon slot and rendered glyph must both remain `16x16`; message alignment must remain vertically centered with icon.
- Icon assets must resolve from `assets/icons`; no inline SVG or `data:image/svg+xml`.

### Behavior contract
- Timer lifecycle: start on mount, pause on hover/focus, resume on unhover/blur, clear on unmount.
- Dismissal reasons: `close-click | timeout | programmatic`.
- Queue lifecycle: deterministic FIFO as defined above.

### Accessibility contract
- Viewport: `aria-live="polite"`, `aria-atomic="false"`.
- Item role: `status` by default; allow severity-driven escalation to `alert` when product rules require.
- Close action: accessible label ("Dismiss notification").
- Keyboard: tab to view details/close; `Escape` dismisses the active toast when any focusable control inside it has focus.
- Toast container is not keyboard-focusable; only the view-details and close controls receive focus.

### Fallback/error rules
- Unknown `type` -> fallback to `info`.
- Missing icon asset -> render no icon and log non-blocking warning.
- Invalid `position` -> fallback to `top-right`.
- Invalid `duration` (<0 or NaN) -> fallback to `8000`.

### Validation checklist
- [ ] All required sections in this spec are complete and deterministic.
- [ ] Variant to token/icon mapping matches table exactly.
- [ ] Queue behavior is implemented at viewport level, not single item level.
- [ ] `position` API supports all six values with default `top-right`.
- [ ] View Details contract supports `routerLink`, `href`, and event mode.
- [ ] Close action is an IDS tertiary icon-only button, fixed `24x24` with `Padding/padding-6`, using `shape-x`; icon fills the content area.
- [ ] Layout uses `var(--toast-control-radius)` on toast root, not hardcoded px.
- [ ] No hardcoded style values in generated code where token exists.
## Implementation Notes
- **React / Angular parity:** React (`lib/react/ids/toast`) inlines Content / IconContainer / Message / ViewDetails / Close. Angular exposes the same slots as projected children (`ids-toast-icon-container`, `ids-toast-message`, `ids-toast-view-details-action`, `ids-toast-close-action`) and also supports React’s viewport `items[]` FIFO list. Shared helpers: `cx` (`lib/angular/shared/utils/cx.ts`), toast resolve functions (`ids-toast.utils.ts`). Escape dismiss reason is `close-click`. Item root border is `var(--color-border-gray-white)`; type tokens color the status icon. `routerLink` without `href` renders a tertiary button (same as React).
- **Close button fix**: Replaced the bare close icon with the IDS `Button` component in `tertiary`/`iconOnly` mode, using `shape-x` rendered as a mask and sized to the fixed 24x24 Button token with `Padding/padding-6` on all sides.
- **Status icon border fix (2025-05-25)**: Added 1px solid #FFFFFF border to all status icons (info-circ-solid, status-critical-square-solid, status-error-diamond-solid, status-warn-tri-solid, status-ok-circ-solid) in the base layer as specified in design spec.
- **Toast border inside container fix (2025-05-25)**: Changed toast root border from outer border to inner border using CSS pseudo-element (::before) to ensure border is inside the container width, not outside.

## Source Mapping
- Figma examples: `42903:139689` (toast variants with/without view details).
- Figma icon base: `39484:7432` (alerting icon family).
- Active IDS map file: `data/component-figma-map.json`.
- Suggested map alignment for Toast: example node `42903:139689`, base icon node `39484:7432`.
- Runtime contract: `component-contracts/ids/toast.contract.ts`.
- Angular reference implementation: `lib/angular/ids/toast/`.
- React reference implementation: `lib/react/ids/toast/` (branch `usr/muthu/lib`).
- Angular Storybook: `storybook-angular/src/components/ids-toast/` (does not replace existing React stories).
