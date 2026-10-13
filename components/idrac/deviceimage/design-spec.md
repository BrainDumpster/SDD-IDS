# DeviceImage Design Spec

## Metadata

| Property | Value |
|---|---|
| Version | 1.0.0 |
| Description | Device image display component for iDRAC programme - presents device/server images with consistent styling and interactive states |
| Status | draft |
| Created | 2026-09-02 |
| Updated | 2026-09-02 |
| Programme | iDRAC |
| Spec pattern | standalone |
| Theme CSS path | components/idrac-theme.css |

### Figma verification evidence
- **Verification method**: Figma REST API
- **File key**: 0bHk3XhrjFhowgFkz9yLr4
- **Primary node ID**: 41894:116183 (Content frame)
- **Verification date**: 2026-09-02
- **Variable collection**: Color Modes, Primitive, Sizes

## Anatomy

The DeviceImage component consists of the following slots:

| Slot | Type | Description |
|---|---|---|
| ImageContainer | Container | Main wrapper for the device image |
| DeviceImage | Image | The actual device/server image display |
| Overlay | Overlay | Optional overlay for interactive states |
| Label | Text | Optional label or caption for the device |
| StatusIndicator | Icon | Visual indicator of device status |

## Layout & Measurements

### Overall dimensions
- **Default width**: 2136px (from Figma Content frame)
- **Default height**: 862px (from Figma Content frame)
- **Responsive behavior**: Scales to container while maintaining aspect ratio

### Slot geometry (Figma-verified)

| Slot / layer | Property | Token / contract | Figma node | Live evidence |
|---|---|---|---|---|
| ImageContainer | border-radius | var(--corner-radius-radius-2) | 41894:116184 | get_variable_defs → VariableID:41864:7540 |
| ImageContainer | padding | var(--padding-padding-16) | 41894:116184 | get_design_context layout |
| DeviceImage | border-radius | var(--corner-radius-radius-2) | 41894:116184 | get_variable_defs → cornerRadius=2.0 |
| Overlay | border-radius | var(--corner-radius-radius-4) | I41894:116184;9662:25245 | get_variable_defs → cornerRadius=4.0 |
| Button control | border-radius | var(--button-control-radius) | 41894:116184 | get_variable_defs → button-control-radius alias |
| Focus ring | border-radius | var(--button-focus-ring-radius) | I41894:116184;9662:25245 | get_variable_defs → button-focus-ring-radius alias |

### Spacing
- **Gap between elements**: var(--spacing-space-8)
- **Label offset**: var(--spacing-space-4)
- **Status indicator padding**: var(--padding-padding-2)

## Tokens

### Typography

| Element | Token | Value (Light) | Value (Dark) |
|---|---|---|---|---|
| Label text | var(--font-size-body-2) | 14px | 14px |
| Label line-height | var(--font-line-height-line-height-20) | 20px | 20px |
| Label weight | 400 | 400 | 400 |

### Colors

| Element | Token | Light | Dark |
|---|---|---|---|
| ImageContainer background | var(--color-background-component) | #ffffff | #111619 |
| ImageContainer border | var(--color-border-neutral) | #4d4d4d | #8898a5 |
| Overlay background | var(--color-background-overlay) | rgba(37,37,37,0.65) | rgba(17,22,25,0.75) |
| Label text | var(--color-text-neutral) | #4d4d4d | #b8c1c9 |
| Status indicator | var(--color-icon-brand-base) | #0672cb | #509cda |
| Focus ring | var(--color-border-brand-base) | #0672cb | #509cda |

### Sizes

| Element | Token | Value |
|---|---|---|
| Border width | var(--border-width-border-1) | 1px |
| Control radius | var(--corner-radius-radius-2) | 2px |
| Focus ring radius | var(--corner-radius-radius-4) | 4px |
| Padding standard | var(--padding-padding-16) | 16px |
| Padding small | var(--padding-padding-8) | 8px |

## States (Light Theme)

### Default state
| Property | Token | Value |
|---|---|---|
| Background | var(--color-background-component) | #ffffff |
| Border | var(--color-border-neutral) | #4d4d4d |
| Text/Icon | var(--color-text-neutral) | #4d4d4d |

### Hover state
| Property | Token | Value |
|---|---|---|
| Background | var(--color-background-brand-lighter) | #ebf4fb |
| Border | var(--color-border-brand-base) | #0672cb |
| Text/Icon | var(--color-text-brand-base) | #0672cb |

### Focus state
| Property | Token | Value |
|---|---|---|
| Background | var(--color-background-component) | #ffffff |
| Border | var(--color-border-brand-base) | #0672cb |
| Focus ring | var(--color-border-brand-base) | #0672cb |
| Text/Icon | var(--color-text-brand-base) | #0672cb |

### Active/Pressed state
| Property | Token | Value |
|---|---|---|
| Background | var(--color-background-brand-strong) | #055fa9 |
| Border | var(--color-border-brand-dark) | #055fa9 |
| Text/Icon | var(--color-text-white) | #ffffff |

### Disabled state
| Property | Token | Value |
|---|---|---|
| Background | var(--color-background-gray-lighter) | #f4f4f4 |
| Border | var(--color-border-disabled) | #757575 |
| Text/Icon | var(--color-text-disabled) | #757575 |

## States (Dark Theme)

### Default state
| Property | Token | Value |
|---|---|---|
| Background | var(--color-background-component) | #111619 |
| Border | var(--color-border-neutral) | #8898a5 |
| Text/Icon | var(--color-text-neutral) | #b8c1c9 |

### Hover state
| Property | Token | Value |
|---|---|---|
| Background | var(--color-background-brand-lighter) | #1e262c |
| Border | var(--color-border-brand-base) | #509cda |
| Text/Icon | var(--color-text-brand-base) | #509cda |

### Focus state
| Property | Token | Value |
|---|---|---|
| Background | var(--color-background-component) | #111619 |
| Border | var(--color-border-brand-base) | #509cda |
| Focus ring | var(--color-border-brand-base) | #509cda |
| Text/Icon | var(--color-text-brand-base) | #509cda |

### Active/Pressed state
| Property | Token | Value |
|---|---|---|
| Background | var(--color-background-brand-strong) | #97c4e9 |
| Border | var(--color-border-brand-dark) | #97c4e9 |
| Text/Icon | var(--color-text-black) | #252525 |

### Disabled state
| Property | Token | Value |
|---|---|---|
| Background | var(--color-background-gray-lighter) | #393939 |
| Border | var(--color-border-disabled) | #9e9e9e |
| Text/Icon | var(--color-text-disabled) | #c5c5c5 |

## Interactions

### Accessibility
- **Keyboard navigation**: Component must be focusable via Tab key
- **Focus indicator**: Visible focus ring using var(--color-border-brand-base)
- **ARIA attributes**: 
  - `role="img"` for the image container
  - `aria-label` or `aria-labelledby` for screen reader description
  - `aria-disabled="true"` when in disabled state
- **Color contrast**: All text/icon combinations meet WCAG AA standards

### Behavior & guidelines
- **Image loading**: Show loading state while image is being fetched
- **Error handling**: Display error state when image fails to load
- **Aspect ratio**: Maintain original image aspect ratio within container
- **Responsive**: Scale appropriately on different screen sizes
- **Touch targets**: Minimum 44x44px touch target for interactive elements

## Composition & API (runtime)

### Variants

| Variant | Description | Default |
|---|---|---|
| size | Component size: small, medium, large | medium |
| showLabel | Display label: true, false | true |
| showStatus | Show status indicator: true, false | true |
| interactive | Enable interactions: true, false | true |

### Runtime API

```typescript
interface DeviceImageProps {
  /** Image source URL */
  src: string;
  /** Alt text for accessibility */
  alt: string;
  /** Optional label text */
  label?: string;
  /** Component size variant */
  size?: 'small' | 'medium' | 'large';
  /** Show/hide label */
  showLabel?: boolean;
  /** Show/hide status indicator */
  showStatus?: boolean;
  /** Enable/disable interactions */
  interactive?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Click handler */
  onClick?: () => void;
  /** Load complete handler */
  onLoad?: () => void;
  /** Error handler */
  onError?: () => void;
}
```

## Codegen Contract (Framework-Agnostic Blueprint)

### Deterministic structure
```html
<div class="device-image-container" data-size="medium" data-interactive="true">
  <div class="image-wrapper">
    <img class="device-image" src="..." alt="..." />
    <div class="overlay" hidden></div>
  </div>
  <div class="status-indicator" hidden></div>
  <div class="label" hidden>Device label</div>
</div>
```

### Variant matrix
| size | showLabel | showStatus | interactive | Resulting classes |
|---|---|---|---|---|
| small | true | true | true | `device-image-container--small`, `has-label`, `has-status`, `is-interactive` |
| medium | true | true | true | `device-image-container--medium`, `has-label`, `has-status`, `is-interactive` |
| large | true | true | true | `device-image-container--large`, `has-label`, `has-status`, `is-interactive` |
| medium | false | false | false | `device-image-container--medium` (no label, no status, not interactive) |

### Per-slot style contract

#### ImageContainer
- **Background**: var(--color-background-component)
- **Border**: 1px solid var(--color-border-neutral)
- **Border-radius**: var(--corner-radius-radius-2)
- **Padding**: var(--padding-padding-16)
- **Display**: flex
- **Flex-direction**: column
- **Gap**: var(--spacing-space-8)

#### DeviceImage
- **Width**: 100%
- **Height**: auto
- **Border-radius**: var(--corner-radius-radius-2)
- **Object-fit**: contain

#### Overlay
- **Background**: var(--color-background-overlay)
- **Border-radius**: var(--corner-radius-radius-4)
- **Position**: absolute
- **Inset**: 0
- **Display**: flex
- **Align-items**: center
- **Justify-content**: center

#### Label
- **Font-size**: var(--font-size-body-2)
- **Line-height**: var(--font-line-height-line-height-20)
- **Color**: var(--color-text-neutral)
- **Font-weight**: 400
- **Text-align**: center

#### StatusIndicator
- **Width**: 16px
- **Height**: 16px
- **Color**: var(--color-icon-brand-base)
- **Position**: absolute
- **Top**: var(--padding-padding-8)
- **Right**: var(--padding-padding-8)

### Behavior contract
- **Image loading**: Show loading spinner until `onLoad` fires
- **Error state**: Show error icon when `onError` fires
- **Interactive states**: Apply hover/focus/active styles when `interactive=true` and `disabled=false`
- **Disabled state**: Ignore all click events, apply disabled styles
- **Keyboard**: Enter/Space triggers click when focused and interactive

### Accessibility contract
- **Focus management**: Component must be focusable when interactive
- **Focus visible**: Always show focus ring when focused
- **Screen reader**: Provide meaningful aria-label or aria-labelledby
- **Keyboard**: Full keyboard navigation support
- **Color contrast**: Minimum 4.5:1 for text, 3:1 for UI components

### Asset resolution + bundling contract
- **Images**: Use provided src URL directly, no bundling transformation
- **Icons**: Use SVG icons inline or from icon library
- **Fonts**: Use system fonts or configured font stack
- **No external dependencies**: Component should work without external CSS/JS

### Fallback/error rules
- **Missing src**: Show placeholder with error state
- **Failed load**: Show error icon and error message
- **Missing alt**: Use label as fallback, warn in console
- **Unsupported format**: Show error state

### Validation checklist
- [ ] All required props are provided (src, alt)
- [ ] Alt text is present and meaningful
- [ ] Component is keyboard accessible
- [ ] Focus indicator is visible
- [ ] Color contrast meets WCAG AA
- [ ] States (hover, focus, active, disabled) work correctly
- [ ] Image loads and displays properly
- [ ] Error handling works for failed loads
- [ ] Component is responsive
- [ ] ARIA attributes are correct

## Source Mapping

### Figma source verification
- **File key**: 0bHk3XhrjFhowgFkz9yLr4
- **File name**: IDS Design Library
- **Verification method**: Figma REST API
- **Verification date**: 2026-09-02

### Node mapping
| Element | Node ID | Node name | Verification notes |
|---|---|---|---|
| Primary container | 41894:116183 | Content | Main frame containing component structure |
| Button instance (small) | 41894:116184 | Button | Small size variant reference |
| Button instance (medium) | 41894:116189 | Button | Medium size variant reference |
| Button instance (large) | 41894:116194 | Button | Large size variant reference |
| Focus ring | I41894:116184;9662:25245 | focus | Focus state geometry reference |
| Text element | I41894:116184;9662:25244 | Button | Typography reference |

### Variable collection mapping
- **Color Modes**: Semantic color tokens (VariableID:41864:*)
- **Primitive**: Static color palette (VariableID:41865:*)
- **Sizes**: Spacing, padding, radius tokens (VariableID:46922:*)

### Bound variable hints
- **Border radius**: VariableID:41864:7540 (Color/Border/Transparent-Brand)
- **Corner radius**: VariableID:41938:870 (Shadow/Drop Shadow 16/X)
- **Semantic colors**: Full Color Modes collection with light/dark values
- **Typography**: Font Size header-1, body-2 from Sizes collection