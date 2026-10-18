# Toast (test) — Design Spec

## Metadata

| Property | Value |
|---|---|
| Version | 1.0.0 |
| Description | A temporary and brief notification following a user action. Displays an icon, message text, optional action link, and close button. |
| Status | draft |
| Created | 2026-09-01 |
| Updated | 2026-09-01 |
| Programme | DAP |
| Spec pattern | standalone |
| Theme CSS path | components/dap-theme.css |
| Display name | Toast (test) |

### Figma verification evidence

| Property | Value |
|---|---|
| Figma URL | https://www.figma.com/design/HIbl2AgqTSdR9STZueMvTH/DAP-Design-Library?node-id=10823-74993&m=dev |
| File key | `HIbl2AgqTSdR9STZueMvTH` |
| Main component node ID | `10823:74993` |
| Verification method | Figma REST API |
| Verification date | 2026-09-01 |
| Session | Collab Bridge packaged evidence |

## Anatomy

```
┌─────────────────────────────────────────────────────────────┐
│  [Icon]  This is a temporary and brief notification...  [Link] [X] │
└─────────────────────────────────────────────────────────────┘
```

| Slot / Layer | Figma Node ID | Type | Description |
|---|---|---|---|
| Toast | `10823:74993` | COMPONENT | Root container |
| Content | `39484:7445` | FRAME | Left section containing icon and message |
| Frame 3467339 | `43339:4093` | FRAME | Icon wrapper with vertical centering |
| .Toast icons | `44506:257677` | INSTANCE | Icon component instance |
| 1-Solid / info-circ-solid | `I44506:257677;44506:257630` | INSTANCE | Info icon (16x16) |
| Text | `39484:7448` | TEXT | Message text |
| Action Container | `10823:75000` | FRAME | Right section containing link and close button |
| Link | `13607:248619` | INSTANCE | Action link component |
| This is a link | `I13607:248619;9628:25131` | TEXT | Link text |
| pop-up-square-corner-big | `I13607:248619;28653:109882` | INSTANCE | External link icon (16x16) |
| Close Icon | `10823:75002` | INSTANCE | Close button icon (12x12) |

## Layout & Measurements

### Overall dimensions

| Property | Value | Token |
|---|---|---|
| Width | 617px (auto-expand based on content) | — |
| Height | 48px | — |
| Min-width | — | — |
| Max-width | — | — |

### Spacing

| Property | Value | Token |
|---|---|---|
| Padding (left/right) | 24px | `var(--padding-padding-24)` |
| Padding (top/bottom) | 14px | — |
| Item spacing (Content ↔ Action Container) | 32px | `var(--spacing-space-32)` |
| Item spacing (Icon ↔ Text) | 8px | `var(--spacing-space-8)` |
| Item spacing (Link ↔ Close Icon) | 24px | `var(--spacing-space-24)` |
| Item spacing (Link text ↔ external icon) | 8px | `var(--spacing-space-8)` |

### Icon sizing

| Property | Value | Token |
|---|---|---|
| Info icon | 16×16px | `var(--sizing-size-32)` (halved) |
| External link icon | 16×16px | `var(--sizing-size-32)` (halved) |
| Close icon | 12×12px | — |

### Slot geometry (Figma-verified)

| Slot / layer | Property | Token / contract | Figma node | Live evidence |
|---|---|---|---|---|
| Toast | border-radius | `var(--corner-radius-radius-8)` | `10823:74993` | `get_variable_defs` (VariableID:46803:385165) |
| Toast | padding-left | `var(--padding-padding-24)` | `10823:74993` | `get_variable_defs` (VariableID:46803:385149) |
| Toast | padding-right | `var(--padding-padding-24)` | `10823:74993` | `get_variable_defs` (VariableID:46803:385149) |
| Toast | padding-top | 14px | — | `10823:74993` |
| Toast | padding-bottom | 14px | — | `10823:74993` |
| Content | item-spacing | `var(--spacing-space-8)` | `39484:7445` | `get_variable_defs` (VariableID:46803:385129) |
| Frame 3467339 | padding-top | `var(--padding-padding-2)` | `43339:4093` | `get_variable_defs` (VariableID:46803:385142) |
| Frame 3467339 | padding-bottom | `var(--padding-padding-2)` | `43339:4093` | `get_variable_defs` (VariableID:46803:385143) |
| Action Container | item-spacing | `var(--spacing-space-24)` | `10823:75000` | `get_variable_defs` (VariableID:46803:385132) |
| Link | item-spacing | `var(--spacing-space-8)` | `13607:248619` | `get_variable_defs` (VariableID:46803:385129) |

## Tokens

### Typography

| Element | Font family | Size | Line height | Weight | Token |
|---|---|---|---|---|---|
| Message text | Roboto | 14px | 20px | 400 | `var(--font-size-body-2)` / `var(--font-line-height-line-height-20)` |
| Link text | Roboto | 14px | 20px | 400 | `var(--font-size-body-2)` / `var(--font-line-height-line-height-20)` |

### Colors

| Element | Property | Light theme | Dark theme | Token |
|---|---|---|---|---|
| Toast | background | `#252525` | `#252525` | `var(--color-background-gray-stronger)` |
| Toast | border | `#ffffff` | `#ffffff` | `var(--color-border-white)` |
| Toast | border-width | 1px | 1px | `var(--border-width-border-1)` |
| Message text | color | `#ffffff` | `#ffffff` | `var(--color-text-white)` |
| Link text | color | `#ffffff` | `#ffffff` | `var(--color-text-white)` |
| Info icon | fill | `#005ece` | `#005ece` | `var(--color-icon-alerting-info)` |
| External link icon | fill | `#ffffff` | `#ffffff` | `var(--color-icon-white)` |
| Close icon | fill | `#ffffff` | `#ffffff` | `var(--color-icon-white)` |

### Border radius

| Element | Value | Token |
|---|---|---|
| Toast | 8px | `var(--corner-radius-radius-8)` |

## States (Light Theme)

### Default state

| Element | Background | Border | Text / Icon |
|---|---|---|---|
| Toast | `var(--color-background-gray-stronger)` | `var(--color-border-white)` 1px | — |
| Message text | — | — | `var(--color-text-white)` |
| Link text | — | — | `var(--color-text-white)` |
| Info icon | — | — | `var(--color-icon-alerting-info)` |
| External link icon | — | — | `var(--color-icon-white)` |
| Close icon | — | — | `var(--color-icon-white)` |

### Hover state (Link)

| Element | Background | Border | Text / Icon |
|---|---|---|---|
| Link text | — | — | `var(--color-text-white)` (underline) |

### Hover state (Close button)

| Element | Background | Border | Text / Icon |
|---|---|---|---|
| Close icon | — | — | `var(--color-icon-white)` (opacity change) |

### Focus state

| Element | Background | Border | Text / Icon |
|---|---|---|---|
| Link | — | — | `var(--color-text-white)` (focus ring) |
| Close button | — | — | `var(--color-icon-white)` (focus ring) |

## States (Dark Theme)

### Default state

| Element | Background | Border | Text / Icon |
|---|---|---|---|
| Toast | `var(--color-background-gray-stronger)` | `var(--color-border-white)` 1px | — |
| Message text | — | — | `var(--color-text-white)` |
| Link text | — | — | `var(--color-text-white)` |
| Info icon | — | — | `var(--color-icon-alerting-info)` |
| External link icon | — | — | `var(--color-icon-white)` |
| Close icon | — | — | `var(--color-icon-white)` |

### Hover state (Link)

| Element | Background | Border | Text / Icon |
|---|---|---|---|
| Link text | — | — | `var(--color-text-white)` (underline) |

### Hover state (Close button)

| Element | Background | Border | Text / Icon |
|---|---|---|---|
| Close icon | — | — | `var(--color-icon-white)` (opacity change) |

### Focus state

| Element | Background | Border | Text / Icon |
|---|---|---|---|
| Link | — | — | `var(--color-text-white)` (focus ring) |
| Close button | — | — | `var(--color-icon-white)` (focus ring) |

## Interactions

### Accessibility

- Toast must have `role="alert"` or `role="status"` depending on urgency
- Message text must be accessible via screen readers
- Link must be keyboard navigable and have visible focus indicator
- Close button must be keyboard accessible with visible focus indicator
- Auto-dismiss behavior should respect `prefers-reduced-motion`

### Behavior & guidelines

- Toast appears temporarily following a user action
- Auto-dismisses after a configurable timeout (default: 5-8 seconds)
- User can dismiss manually via close button
- Optional action link provides navigation to related content
- Toast should not interrupt user workflow
- Multiple toasts should stack vertically with appropriate spacing
- Toast should be positioned at a consistent location (typically top-right or bottom-right)

## Composition & API (runtime)

### Variants

| Variant | Description |
|---|---|
| default | Standard toast with icon, message, and optional actions |
| with-link | Toast includes action link |
| without-link | Toast without action link (close button only) |

### Runtime API

| Prop | Type | Required | Default | Description |
|---|---|---|---|---|
| message | string | Yes | — | The notification message text |
| icon | string | No | info | Icon type (info, success, warning, critical) |
| linkText | string | No | — | Text for optional action link |
| linkHref | string | No | — | URL for action link |
| onClose | function | Yes | — | Callback when toast is dismissed |
| autoDismiss | boolean | No | true | Whether toast auto-dismisses |
| duration | number | No | 5000 | Auto-dismiss duration in ms |

## Codegen Contract (Framework-Agnostic Blueprint)

### Deterministic structure

```html
<div class="toast" role="alert">
  <div class="toast-content">
    <div class="toast-icon-wrapper">
      <svg class="toast-icon">...</svg>
    </div>
    <p class="toast-message">Message text</p>
  </div>
  <div class="toast-actions">
    <a class="toast-link" href="...">
      Link text
      <svg class="external-icon">...</svg>
    </a>
    <button class="toast-close" aria-label="Close">
      <svg class="close-icon">...</svg>
    </button>
  </div>
</div>
```

### Variant matrix

| Variant | Icon | Link | Close button |
|---|---|---|---|
| default | Yes | Optional | Yes |
| with-link | Yes | Yes | Yes |
| without-link | Yes | No | Yes |

### Per-slot style contract

| Slot | Required styles | Token contract |
|---|---|---|
| `.toast` | `background`, `border`, `border-radius`, `padding`, `display: flex`, `align-items: center` | `var(--color-background-gray-stronger)`, `var(--color-border-white)`, `var(--corner-radius-radius-8)`, `var(--padding-padding-24)` |
| `.toast-content` | `display: flex`, `align-items: center`, `gap: 8px` | `var(--spacing-space-8)` |
| `.toast-icon-wrapper` | `display: flex`, `align-items: center`, `padding-top: 2px`, `padding-bottom: 2px` | `var(--padding-padding-2)` |
| `.toast-icon` | `width: 16px`, `height: 16px`, `fill` | `var(--color-icon-alerting-info)` |
| `.toast-message` | `font-family: Roboto`, `font-size: 14px`, `line-height: 20px`, `color` | `var(--font-size-body-2)`, `var(--font-line-height-line-height-20)`, `var(--color-text-white)` |
| `.toast-actions` | `display: flex`, `align-items: center`, `gap: 24px` | `var(--spacing-space-24)` |
| `.toast-link` | `font-family: Roboto`, `font-size: 14px`, `line-height: 20px`, `color`, `text-decoration: none` | `var(--font-size-body-2)`, `var(--font-line-height-line-height-20)`, `var(--color-text-white)` |
| `.external-icon` | `width: 16px`, `height: 16px`, `fill` | `var(--color-icon-white)` |
| `.toast-close` | `background: transparent`, `border: none`, `cursor: pointer`, `padding: 4px` | — |
| `.close-icon` | `width: 12px`, `height: 12px`, `fill` | `var(--color-icon-white)` |

### Behavior contract

- Toast must auto-dismiss after `duration` ms when `autoDismiss` is true
- `onClose` callback must be invoked on close button click or auto-dismiss
- Link navigation must work as standard anchor behavior
- Focus management: when toast appears, focus should not be forced (non-modal)
- Keyboard: Tab key must navigate between link and close button
- Escape key should dismiss toast

### Accessibility contract

- Root element must have `role="alert"` for urgent notifications or `role="status"` for non-urgent
- Close button must have `aria-label="Close"`
- Link must have accessible text matching visible text
- Toast must announce to screen readers on appearance
- Auto-dismiss timing must respect user preferences
- Color contrast must meet WCAG AA standards (4.5:1 for text)

### Asset resolution + bundling contract

- Icons must be bundled as inline SVG or imported from icon library
- Icon paths must match Figma design specifications
- External link icon must use standard "pop-up-square-corner-big" design
- Close icon must use standard "X" design

### Fallback/error rules

- If icon fails to load, display fallback Unicode character or omit icon
- If message text is empty, display default placeholder or hide toast
- If linkHref is invalid, disable link styling and prevent navigation
- If auto-dismiss fails, ensure manual close still works

### Validation checklist

- [ ] All required props are provided (message, onClose)
- [ ] Icon type is valid (info, success, warning, critical)
- [ ] Link only renders when both linkText and linkHref are provided
- [ ] Border radius matches Figma (8px)
- [ ] Padding matches Figma (24px horizontal, 14px vertical)
- [ ] Typography matches Figma (Roboto 14px/20px)
- [ ] Colors use semantic tokens from dap-theme.css
- [ ] Accessibility attributes are present (role, aria-label)
- [ ] Keyboard navigation works (Tab, Escape)
- [ ] Auto-dismiss timing is configurable
- [ ] Focus indicators are visible

## Source Mapping

| Source | Location |
|---|---|
| DAP Figma file | https://www.figma.com/design/HIbl2AgqTSdR9STZueMvTH/DAP-Design-Library |
| File key | `HIbl2AgqTSdR9STZueMvTH` |
| Main component node ID | `10823:74993` |
| Content node ID | `39484:7445` |
| Icon wrapper node ID | `43339:4093` |
| Icon instance node ID | `44506:257677` |
| Action container node ID | `10823:75000` |
| Link instance node ID | `13607:248619` |
| Close icon node ID | `10823:75002` |
| Verification method | Figma REST API |
| Verification date | 2026-09-01 |
| Theme CSS | components/dap-theme.css |
| Component map | data/component-figma-map.json |
