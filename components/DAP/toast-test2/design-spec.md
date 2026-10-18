# Toast (test2) — Design Spec

## Metadata

| Property | Value |
|---|---|
| Version | 1.0.0 |
| Description | Toast notification component for DAP design system. Displays temporary, brief notifications following user actions with optional action links and dismiss functionality. |
| Status | active |
| Created | 2026-09-01 |
| Updated | 2026-09-01 |
| Programme | DAP |
| Spec pattern | standalone |
| Theme CSS path | components/dap-theme.css |
| Display name | Toast (test2) |

### Figma verification evidence

| Property | Value |
|---|---|
| Figma URL | https://www.figma.com/design/HIbl2AgqTSdR9STZueMvTH/DAP-Design-Library?node-id=10823-74993&m=dev |
| File key | `HIbl2AgqTSdR9STZueMvTH` |
| Main component node ID | `10823:74993` |
| Verification method | Figma REST API |
| Verification date | 2026-09-01 |
| Session evidence | Packaged figma_evidence.json (rest mode, tools.get_metadata, tools.get_design_context, tools.get_variable_defs) |

## Anatomy

```
┌─────────────────────────────────────────────────────────────────┐
│ ┌─────────────────────────────┐ ┌─────────────────────────────┐ │
│ │ ┌───┐                       │ │ View Details  →  ×          │ │
│ │ │ ℹ │ This is a temporary  │ │                         │ │
│ │ └───┘ and brief notification│ │                         │ │
│ │     following a user action.│ │                         │ │
│ └─────────────────────────────┘ └─────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

| Slot / Layer | Type | Description |
|---|---|---|
| **Toast** | COMPONENT | Root container with background, border, and corner radius |
| **Content** | FRAME | Left side container for icon and message text |
| **Frame 3467339** | FRAME | Icon wrapper with vertical padding |
| **.Toast icons** | INSTANCE | Icon component instance (info-circ-solid) |
| **1-Solid / info-circ-solid** | INSTANCE | Specific icon variant (16×16px) |
| **Action Container** | FRAME | Right side container for action link and close button |
| **Link** | INSTANCE | Action link with text and external link icon |
| **pop-up-square-corner-big** | INSTANCE | External link arrow icon (16×16px) |
| **Close Icon** | INSTANCE | Dismiss/close button icon (12×12px) |

## Layout & Measurements

### Overall container

| Property | Value | Token |
|---|---|---|
| Width | Auto (min-content) | — |
| Height | 48px | — |
| Padding (left/right) | 24px | `var(--padding-padding-24)` |
| Padding (top/bottom) | 14px | — |
| Corner radius | 8px | `var(--corner-radius-radius-8)` |
| Border width | 1px | `var(--border-width-border-1)` |

### Internal spacing

| Property | Value | Token |
|---|---|---|
| Content ↔ Action Container gap | 32px | `var(--spacing-space-32)` |
| Icon ↔ Text gap | 8px | `var(--spacing-space-8)` |
| Link ↔ Close Icon gap | 24px | `var(--spacing-space-24)` |
| Link text ↔ Link icon gap | 8px | `var(--spacing-space-8)` |
| Icon wrapper vertical padding | 2px top/bottom | — |

### Slot dimensions

| Slot | Width | Height |
|---|---|---|
| Content | 424px (content-dependent) | 20px |
| Frame 3467339 (icon wrapper) | 16px | 20px |
| .Toast icons | 16px | 16px |
| Action Container | 113px (content-dependent) | 20px |
| Link | 77px (content-dependent) | 20px |
| pop-up-square-corner-big (link icon) | 16px | 16px |
| Close Icon | 12px | 12px |

### Slot geometry (Figma-verified)

| Slot / layer | Property | Token / contract | Figma node | Live evidence |
|---|---|---|---|---|
| Toast | border-radius | `var(--corner-radius-radius-8)` | `10823:74993` | get_design_context: cornerRadius=8.0 |
| Toast | padding-left | `var(--padding-padding-24)` | `10823:74993` | get_design_context: paddingLeft=24.0 |
| Toast | padding-right | `var(--padding-padding-24)` | `10823:74993` | get_design_context: paddingRight=24.0 |
| Toast | padding-top | 14px | — | get_design_context: paddingTop=14.0 |
| Toast | padding-bottom | 14px | — | get_design_context: paddingBottom=14.0 |
| Content | item-spacing | `var(--spacing-space-8)` | `39484:7445` | get_design_context: itemSpacing=8.0 |
| Frame 3467339 | padding-top | 2px | — | get_design_context: paddingTop=2.0 |
| Frame 3467339 | padding-bottom | 2px | — | get_design_context: paddingBottom=2.0 |
| Action Container | item-spacing | `var(--spacing-space-24)` | `10823:75000` | get_design_context: itemSpacing=24.0 |
| Link | item-spacing | `var(--spacing-space-8)` | `13607:248619` | get_design_context: itemSpacing=8.0 |

## Tokens

### Typography

| Element | Font family | Size | Line height | Weight | Token |
|---|---|---|---|---|---|
| Message text | Roboto | 14px | 20px | 400 | `var(--font-size-body-2)`, `var(--font-line-height-line-height-20)` |
| Link text | Roboto | 14px | 20px | 400 | `var(--font-size-body-2)`, `var(--font-line-height-line-height-20)` |

### Colors

| Element | Property | Light theme | Dark theme | Token |
|---|---|---|---|---|
| Toast | background | `#252525` | `#252525` | `var(--color-background-gray-stronger)` |
| Toast | border | `#ffffff` | `#ffffff` | `var(--color-border-white)` |
| Message text | color | `#ffffff` | `#ffffff` | `var(--color-text-white)` |
| Link text | color | `#ffffff` | `#ffffff` | `var(--color-text-white)` |
| Icon (info) | fill | `#005ece` | `#005ece` | `var(--color-icon-alerting-info)` |
| Link icon (arrow) | fill | `#ffffff` | `#ffffff` | `var(--color-icon-white)` |
| Close icon | fill | `#ffffff` | `#ffffff` | `var(--color-icon-white)` |

### Icon sizing

| Element | Size |
|---|---|
| Info icon | 16×16px |
| Link arrow icon | 16×16px |
| Close icon | 12×12px |

## States (Light Theme)

### Background states

| State | Background | Border |
|---|---|---|
| Default | `var(--color-background-gray-stronger)` | `var(--color-border-white)` |
| Hover | `var(--color-background-gray-stronger)` | `var(--color-border-white)` |
| Focus | `var(--color-background-gray-stronger)` | `var(--color-border-brand-base)` |
| Disabled | `var(--color-background-gray-stronger)` | `var(--color-border-disabled)` |

### Text & icon states

| State | Message text | Link text | Info icon | Link icon | Close icon |
|---|---|---|---|---|---|
| Default | `var(--color-text-white)` | `var(--color-text-white)` | `var(--color-icon-alerting-info)` | `var(--color-icon-white)` | `var(--color-icon-white)` |
| Hover | `var(--color-text-white)` | `var(--color-text-brand-base)` | `var(--color-icon-alerting-info)` | `var(--color-icon-brand-base)` | `var(--color-icon-brand-base)` |
| Focus | `var(--color-text-white)` | `var(--color-text-brand-base)` | `var(--color-icon-alerting-info)` | `var(--color-icon-brand-base)` | `var(--color-icon-brand-base)` |
| Disabled | `var(--color-text-disabled)` | `var(--color-text-disabled)` | `var(--color-icon-disabled)` | `var(--color-icon-disabled)` | `var(--color-icon-disabled)` |

## States (Dark Theme)

### Background states

| State | Background | Border |
|---|---|---|
| Default | `var(--color-background-gray-stronger)` | `var(--color-border-white)` |
| Hover | `var(--color-background-gray-stronger)` | `var(--color-border-white)` |
| Focus | `var(--color-background-gray-stronger)` | `var(--color-border-brand-base)` |
| Disabled | `var(--color-background-gray-stronger)` | `var(--color-border-disabled)` |

### Text & icon states

| State | Message text | Link text | Info icon | Link icon | Close icon |
|---|---|---|---|---|---|
| Default | `var(--color-text-white)` | `var(--color-text-white)` | `var(--color-icon-alerting-info)` | `var(--color-icon-white)` | `var(--color-icon-white)` |
| Hover | `var(--color-text-white)` | `var(--color-text-brand-base)` | `var(--color-icon-alerting-info)` | `var(--color-icon-brand-base)` | `var(--color-icon-brand-base)` |
| Focus | `var(--color-text-white)` | `var(--color-text-brand-base)` | `var(--color-icon-alerting-info)` | `var(--color-icon-brand-base)` | `var(--color-icon-brand-base)` |
| Disabled | `var(--color-text-disabled)` | `var(--color-text-disabled)` | `var(--color-icon-disabled)` | `var(--color-icon-disabled)` | `var(--color-icon-disabled)` |

## Interactions

### Accessibility

- Toast must have `role="alert"` or `role="status"` depending on context
- Toast must be announced to screen readers when displayed
- Dismissible toasts must have a close button with `aria-label="Close"` or `aria-label="Dismiss notification"`
- Action links must be keyboard accessible and have proper focus indicators
- Auto-dismiss toasts should respect `prefers-reduced-motion` for animation timing

### Behavior & guidelines

- Toast appears at the bottom-right or top-right of the viewport (positioning is context-dependent)
- Toast auto-dismisses after a configurable timeout (default: 5-8 seconds)
- User can manually dismiss via close button or Escape key
- Action links are optional; when present, they provide primary action related to the notification
- Multiple toasts can stack vertically with consistent spacing
- Toast should not interrupt user workflow; use for non-critical notifications only

## Composition & API (runtime)

### Variants

| Variant | Description |
|---|---|
| **default** | Standard toast with icon, message, optional action link, and close button |
| **no-action** | Toast without action link (message + close button only) |
| **persistent** | Toast that does not auto-dismiss (requires manual close) |
| **auto-dismiss** | Toast that automatically dismisses after timeout |

### Runtime API

| Prop | Type | Default | Description |
|---|---|---|---|
| `message` | string | — | Required. The notification message text |
| `actionLabel` | string | — | Optional. Text for the action link |
| `actionHref` | string | — | Optional. URL for the action link |
| `onActionClick` | function | — | Optional. Callback when action link is clicked |
| `onClose` | function | — | Optional. Callback when close button is clicked |
| `autoDismiss` | boolean | true | Whether toast auto-dismisses |
| `dismissTimeout` | number | 5000 | Auto-dismiss timeout in milliseconds |
| `icon` | string | 'info' | Icon variant: 'info', 'success', 'warning', 'error' |
| `position` | string | 'bottom-right' | Position: 'top-right', 'bottom-right', 'top-left', 'bottom-left' |

## Codegen Contract (Framework-Agnostic Blueprint)

### Deterministic structure

```tsx
<div role="alert" className="toast">
  <div className="toast-content">
    <div className="toast-icon-wrapper">
      <Icon className="toast-icon" name={icon} />
    </div>
    <p className="toast-message">{message}</p>
  </div>
  <div className="toast-actions">
    {actionLabel && (
      <a href={actionHref} className="toast-action-link">
        {actionLabel}
        <Icon className="toast-link-icon" name="external-link" />
      </a>
    )}
    <button className="toast-close" aria-label="Close">
      <Icon className="toast-close-icon" name="close" />
    </button>
  </div>
</div>
```

### Variant matrix

| Variant | Icon | Action link | Close button | Auto-dismiss |
|---|---|---|---|---|
| default | ✓ | optional | ✓ | true |
| no-action | ✓ | ✗ | ✓ | true |
| persistent | ✓ | optional | ✓ | false |
| auto-dismiss | ✓ | optional | ✓ | true |

### Per-slot style contract

| Slot | Required styles | Token contract |
|---|---|---|
| `.toast` | background, border, border-radius, padding, display, flex, gap | `var(--color-background-gray-stronger)`, `var(--color-border-white)`, `var(--corner-radius-radius-8)`, `var(--padding-padding-24)`, `var(--spacing-space-32)` |
| `.toast-content` | display, flex, gap, align-items | `var(--spacing-space-8)` |
| `.toast-icon-wrapper` | display, flex, padding-top, padding-bottom | 2px vertical padding |
| `.toast-icon` | width, height, fill | 16×16px, `var(--color-icon-alerting-info)` |
| `.toast-message` | font-family, font-size, line-height, font-weight, color | `var(--font-size-body-2)`, `var(--font-line-height-line-height-20)`, `var(--color-text-white)` |
| `.toast-actions` | display, flex, gap, align-items | `var(--spacing-space-24)` |
| `.toast-action-link` | font-family, font-size, line-height, font-weight, color, display, flex, gap, text-decoration | `var(--font-size-body-2)`, `var(--font-line-height-line-height-20)`, `var(--color-text-white)` |
| `.toast-link-icon` | width, height, fill | 16×16px, `var(--color-icon-white)` |
| `.toast-close` | background, border, padding, cursor, display, flex, align-items, justify-content | transparent background, no border |
| `.toast-close-icon` | width, height, fill | 12×12px, `var(--color-icon-white)` |

### Behavior contract

- Toast must render with `role="alert"` for accessibility
- Close button must trigger `onClose` callback and remove toast from DOM
- Action link must navigate to `actionHref` or call `onActionClick` if provided
- Auto-dismiss timer must start on mount and clear on unmount
- Escape key must dismiss the toast when focused or when toast is the topmost notification
- Hover state on toast must pause auto-dismiss timer (optional, depends on implementation)

### Accessibility contract

- Root element must have `role="alert"` or `role="status"`
- Close button must have `aria-label="Close"` or `aria-label="Dismiss notification"`
- Action link must have accessible name (visible text or `aria-label`)
- Toast must be focusable or have focusable children for keyboard dismissal
- Auto-dismiss toasts should respect `prefers-reduced-motion` for transitions
- Multiple toasts must be announced in order of appearance

### Asset resolution + bundling contract

- Icons must be resolved from the design system icon library
- Icon names: 'info-circ-solid', 'external-link', 'close'
- Icons should be bundled as SVG components or sprite references
- Icon colors must be controlled via CSS tokens, not hardcoded fill values

### Fallback/error rules

- If `message` prop is missing, render empty toast or throw validation error
- If `actionLabel` is provided without `actionHref` or `onActionClick`, render link as button
- If icon variant is not recognized, default to 'info' icon
- If auto-dismiss fails (timer error), toast should remain visible until manual close

### Validation checklist

- [ ] Root element has `role="alert"` or `role="status"`
- [ ] Close button has proper `aria-label`
- [ ] Action link has accessible name
- [ ] All colors use CSS custom properties (`var(--...)`)
- [ ] Border radius uses `var(--corner-radius-radius-8)`
- [ ] Padding uses `var(--padding-padding-24)` for horizontal, 14px for vertical
- [ ] Spacing uses semantic tokens (`var(--spacing-space-8)`, `var(--spacing-space-24)`, `var(--spacing-space-32)`)
- [ ] Typography uses `var(--font-size-body-2)` and `var(--font-line-height-line-height-20)`
- [ ] Icon dimensions match spec (16×16px for info/link, 12×12px for close)
- [ ] Focus states use `var(--color-border-brand-base)` for border
- [ ] Disabled states use `var(--color-text-disabled)` and `var(--color-icon-disabled)`
- [ ] Auto-dismiss timer respects `prefers-reduced-motion`
- [ ] Escape key dismisses toast
- [ ] Multiple toasts stack with consistent spacing

## Source Mapping

| Source | Location |
|---|---|
| Figma file | https://www.figma.com/design/HIbl2AgqTSdR9STZueMvTH/DAP-Design-Library |
| File key | `HIbl2AgqTSdR9STZueMvTH` |
| Main component node | `10823:74993` |
| Content node | `39484:7445` |
| Icon wrapper node | `43339:4093` |
| Icon instance node | `44506:257677` |
| Action container node | `10823:75000` |
| Link instance node | `13607:248619` |
| Close icon node | `10823:75002` |
| Verification method | Figma REST API |
| Tools used | `get_metadata`, `get_design_context`, `get_variable_defs` |
| Session date | 2026-09-01 |
| Evidence file | Packaged figma_evidence.json (rest mode) |
