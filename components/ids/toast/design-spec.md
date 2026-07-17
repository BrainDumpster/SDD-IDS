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
Document component parts in deterministic order. Add one bullet per slot (root, label, icon, etc.).

## Layout & Measurements
- Item container: `height: 48px`, `padding-inline: left 24px, right 18px`, `padding-block: 14px`.
- Item sample widths from Figma: `516px` (without link), `617px` (with link); runtime width is container-driven.
- Root surface: `background: var(--color-static-gray-900)`, `box-shadow: inset 0 0 0 1px var(--color-border-white)` (inner border), `border-radius: var(--toast-control-radius)` (IDS theme resolves to `var(--corner-radius-radius-2)` / 2px).
- Row composition: two horizontal groups with `justify-content: space-between`:
  - `ContentGroup` (status icon + message)
  - `ActionGroup` (optional link + close)
- Content row: horizontal layout with icon/message gap exactly `8px`.
- Action row: horizontal layout with link/close gap exactly `24px` when link exists.
- Vertical alignment: status icon and message must be top-aligned on the same row (`align-items: flex-start` in root, contentGroup, and iconWrap).
- Status icon slot: fixed `16x16` container and `16x16` rendered icon (no scaling above slot size).
- Close action: IDS tertiary icon-only button, fixed `24×24` inner control (`26×26` outer with the separate 1px Button border), `Padding/padding-6` on all sides, `shape-x` icon `12×12`.
## Tokens

### Layout aliases (theme-resolvable)
Programmes override these **same alias names** in programme theme CSS. Component specs and generated CSS reference aliases only.

| Alias | IDS default (`components/ids-theme.css`) |
|---|---|
| `--toast-control-radius` | `var(--corner-radius-radius-2)` |

### Core surface/text tokens
- Surface: `var(--color-static-gray-900)`
- Border: `var(--color-border-white)`
- Message text: `var(--color-static-gray-white)`
- Link text: `var(--color-text-white)`
- Close button icon: `var(--color-icon-brand-base)` (IDS Button tertiary icon-only default)

### Status tokens and icon mapping
| Type | Icon (`shapeName`) | Icon color token | Border token | Text token |
|---|---|---|---|---|
| `info` | `info-circ-solid` | `var(--color-icon-alerting-info)` | `var(--color-border-alerting-info-white)` | `var(--color-static-gray-white)` |
| `critical` | `status-critical-square-solid` | `var(--color-icon-alerting-critical)` | `var(--color-border-alerting-critical-white)` | `var(--color-static-gray-white)` |
| `major-warning` | `status-error-diamond-solid` | `var(--color-icon-alerting-major)` | `var(--color-border-alerting-major-white)` | `var(--color-static-gray-white)` |
| `minor-warning` | `status-warn-tri-solid` | `var(--color-icon-alerting-minor)` | `var(--color-border-alerting-minor-transparent)` | `var(--color-static-gray-white)` |
| `success` | `status-ok-circ-solid` | `var(--color-icon-alerting-success)` | `var(--color-border-alerting-success-white)` | `var(--color-static-gray-white)` |
## States (Light Theme)
| State | Background | Border | Text/Icon |
|---|---|---|---|
| Rest | `var(--color-static-gray-900)` | Variant border token (table above) | Message/link `var(--color-static-gray-white)`; close button icon `var(--color-icon-brand-base)` |
| Hover close | Follows IDS Button tertiary hover tokens | No change | Icon follows IDS Button tertiary icon token |
| Focus-visible action | No root color change | No change | Focus ring uses brand token from root-spec rules |
## States (Dark Theme)
Use the same semantic tokens as Light Theme. Dark mode behavior is token-resolved, with the same structural table and no hardcoded hex in runtime code.
## Interactions
- Toast appears with entrance motion and exits with dismissal motion.
- `close` click removes toast item and emits dismissal event.
- Optional link action emits link event or navigates depending on link contract.
- Auto-dismiss timer runs per toast item when `duration > 0`.
- Hover/focus pauses auto-dismiss timer for that item (recommended behavior contract).
- `Escape` dismisses focused toast item.
## Composition & API (runtime)

### `ToastItem` (single notification)
- `type`: `info | critical | major-warning | minor-warning | success` (default `info`).
- `message`: string (required).
- `duration`: number, default `8000` (host-configurable timeout input).
- `closable`: boolean, default `true`.
- `link`: optional structured link object (see link contract below).
- `onClose`: emitted with item id/reason.
- `onTimeout`: emitted when timer dismisses.

### `ToastViewport` (stack + queue owner)
- `position`: `top-left | top-center | top-right | bottom-left | bottom-center | bottom-right` (default `top-right`).
- `maxVisible`: number (recommended default `3`).
- `queueStrategy`: FIFO.
- `items`: controlled list OR internal queue adapter.

Queue/stack behavior contract:
1. New item is appended to queue.
2. If visible slots are full, item waits in queue.
3. When an item closes/expires, next queued item enters visible stack.
4. In top positions, newest visible toast appears at bottom; older items move upward.
5. In bottom positions, newest visible toast appears at top; older items move downward.
### Link contract
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
- `ToastViewport` -> repeated `ToastItem` -> `Content` + `ActionContainer`.
- `Content` always renders icon + message.
- `ActionContainer` renders optional `LinkAction`, then optional `CloseAction`.

### Variant matrix
- Supported types: `info`, `critical`, `major-warning`, `minor-warning`, `success`.
- `link` optional for each type.
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
- Keyboard: tab to link/close, `Escape` dismiss focused item.

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
- [ ] Link routing contract supports `routerLink`, `href`, and event mode.
- [ ] Close action is an IDS tertiary icon-only button, fixed `24x24` with `Padding/padding-6`, using `shape-x`; icon fills the content area.
- [ ] Layout uses `var(--toast-control-radius)` on toast root, not hardcoded px.
- [ ] No hardcoded style values in generated code where token exists.
## Implementation Notes
- **Close button fix**: Replaced the bare close icon with the IDS `Button` component in `tertiary`/`iconOnly` mode, using `shape-x` rendered as a mask and sized to the fixed 24x24 Button token with `Padding/padding-6` on all sides.
- **Status icon border fix (2025-05-25)**: Added 1px solid #FFFFFF border to all status icons (info-circ-solid, status-critical-square-solid, status-error-diamond-solid, status-warn-tri-solid, status-ok-circ-solid) in the base layer as specified in design spec.
- **Toast border inside container fix (2025-05-25)**: Changed toast root border from outer border to inner border using CSS pseudo-element (::before) to ensure border is inside the container width, not outside.

## Source Mapping
- Figma examples: `42903:139689` (toast variants with/without link).
- Figma icon base: `39484:7432` (alerting icon family).
- Active IDS map file: `data/component-figma-map.json`.
- Suggested map alignment for Toast: example node `42903:139689`, base icon node `39484:7432`.
