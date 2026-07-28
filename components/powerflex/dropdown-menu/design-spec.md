# Dropdown Menu Design Spec

## Metadata

- **Version:** 1.0.0
- **Description:** Powerflex dropdown menu item. A single selectable row inside a dropdown menu, supporting default, hover, active/selected, and disabled states.
- **Status:** draft
- **Created:** 2026-07-28
- **Updated:** 2026-07-28
- **Design system:** powerflex
- **Programme display name:** Powerflex
- **Figma verification:** Figma REST API (get_design_context, get_metadata, get_variable_defs, get_screenshot, slotGeometry)
- **Verification date:** 2026-07-28
- **Figma file key:** 82bDP05ESsiiGe38p5TEQJ
- **Figma node IDs:** Main instance `2557:1870`; State matrix component set `2557:1046` (variants `default` `2557:1045`, `disabled` `2557:1044`, `hover` `2557:1043`, `active` `2557:1042`)

## Anatomy

```
┌─────────────────────────────────────┐
│  [Label]                    [▶ Icon]│  ← Dropdown menu item (default)
└─────────────────────────────────────┘
```

**Anatomy slots:**
- **Menu item root:** The full interactive row (`dropdown-menu-item`).
- **Background:** The background fill rectangle.
- **Label:** The text label for the menu item.
- **Icon-toggle (arrow):** The trailing right-pointing arrow icon, shown when the item has a submenu or toggle affordance.

## Layout & Measurements

### Slot geometry (Figma-verified)

| Slot / layer | Property | Token / contract | Figma node | Live evidence |
|--------------|----------|------------------|------------|---------------|
| `dropdown-menu-item` (component set) | border-radius | `var(--dropdown-menu-item-radius, 5px)` | `2557:1046` | Figma REST `slotGeometry` `borderRadius: 5.0` |
| `dropdown-menu-item` (main instance) | width × height | 73px × 32px (sample; runtime: width: 100%) | `2557:1870` | Figma REST `get_metadata` / `get_design_context` |
| `dropdown-menu-item` (state variants) | width × height | 85.25px × 32px (sample) | `2557:1045` … `2557:1042` | Figma REST `slotGeometry` |
| `dropdown-menu-item` | padding-x | `var(--dropdown-menu-item-padding-x, 16px)` left + right | `2557:1045` | Figma REST `slotGeometry` `paddingLeft: 16.0` |
| `dropdown-menu-item` | padding-y | `6px` (`32px` − `20px` line-height) / 2 | `2557:1045` | Figma REST `get_design_context` / `slotGeometry` height |
| `dropdown-menu-item` | item-spacing | `var(--dropdown-menu-item-gap, 8px)` | `2557:1045` | Figma REST `slotGeometry` `itemSpacing: 8.0` |
| `dropdown-menu-item` | min-height | `var(--dropdown-menu-item-min-height, 32px)` | `2557:1045` | Figma REST `slotGeometry` `height: 32.0` |
| `background` | fill | `var(--color-action-tertiary-default, #ffffff)` (default/disabled); `var(--dropdown-menu-item-background-hover, #eeeeee)` (hover); `var(--dropdown-menu-item-background-active, #d2e7f8)` (active) | `2557:1047` | Figma REST `slotGeometry` `boundVariableHints` `VariableID:2557:1002` / `2557:1003` / `2557:1004` and `get_design_context` |
| `label` | typography | `var(--font-size-body-2, 14px)` / `var(--font-line-height-line-height-20, 20px)` / weight 400 / Roboto | `2557:1016` | Figma REST `get_design_context` |
| `label` | fill | `var(--dropdown-menu-item-text-default, #333333)` (default/hover/active); `var(--dropdown-menu-item-text-disabled, #bbbbbb)` (disabled) | `2557:1016` | Figma REST `get_design_context` |
| `arrow-tri-right-solid` | size | 5.3125px × 10px | `2557:1026` | Figma REST `slotGeometry` / `get_design_context` |
| `arrow-tri-right-solid` | fill | `var(--dropdown-menu-item-icon-default, #333333)` (default/hover/active); `var(--dropdown-menu-item-icon-disabled, #bbbbbb)` (disabled) | `2557:1026` | Figma REST `get_design_context` |

### Container measurements

- **Item width:** Runtime `width: 100%` (fills menu container); sample Figma widths are 73px / 85.25px.
- **Item height:** 32px.
- **Menu container:** Not part of the packaged evidence; menu item is consumed inside a host dropdown menu component.

## Tokens

### Typography

- **Font family:** `var(--typography-font-style-primary, 'Roboto')`
- **Font size:** `var(--font-size-body-2, 14px)`
- **Font weight:** `400`
- **Line height:** `var(--font-line-height-line-height-20, 20px)`
- **Letter spacing:** `0`

### Colors

| Token | Light theme value | Usage |
|-------|-------------------|-------|
| `--color-action-tertiary-default` | `#ffffff` | Default and disabled item background (Figma `VariableID:2557:1002`) |
| `--dropdown-menu-item-background-hover` | `#eeeeee` | Hover background |
| `--dropdown-menu-item-background-active` | `#d2e7f8` | Active/selected background |
| `--dropdown-menu-item-text-default` | `#333333` | Default/hover/active label text |
| `--dropdown-menu-item-text-disabled` | `#bbbbbb` | Disabled label text |
| `--dropdown-menu-item-icon-default` | `#333333` | Default/hover/active arrow icon |
| `--dropdown-menu-item-icon-disabled` | `#bbbbbb` | Disabled arrow icon |
| `--dropdown-menu-item-border-active` | `#8a38f5` | Active/selected border (component set stroke from `get_design_context`) |

### Spacing

- `--dropdown-menu-item-padding-x`: 16px
- `--dropdown-menu-item-padding-y`: 6px
- `--dropdown-menu-item-gap`: 8px
- `--dropdown-menu-item-min-height`: 32px

### Border radius

- `--dropdown-menu-item-radius`: 5px (from component set `2557:1046` `borderRadius: 5.0`)

## States (Light Theme)

| State | Background | Border | Text | Icon |
|-------|------------|--------|------|------|
| **default** | `var(--color-action-tertiary-default, #ffffff)` | none | `var(--dropdown-menu-item-text-default, #333333)` | `var(--dropdown-menu-item-icon-default, #333333)` |
| **hover** | `var(--dropdown-menu-item-background-hover, #eeeeee)` | none | `var(--dropdown-menu-item-text-default, #333333)` | `var(--dropdown-menu-item-icon-default, #333333)` |
| **active** | `var(--dropdown-menu-item-background-active, #d2e7f8)` | `1px solid var(--dropdown-menu-item-border-active, #8a38f5)` | `var(--dropdown-menu-item-text-default, #333333)` | `var(--dropdown-menu-item-icon-default, #333333)` |
| **disabled** | `var(--color-action-tertiary-default, #ffffff)` | none | `var(--dropdown-menu-item-text-disabled, #bbbbbb)` | `var(--dropdown-menu-item-icon-disabled, #bbbbbb)` |

## States (Dark Theme)

All Dark theme states use the same semantic `var(--...)` tokens as the Light theme. The token values themselves are resolved in `components/powerflex-theme.css` under `[data-theme="dark"]`. The state matrix structure is identical to the Light theme table above; only the resolved hex values differ. Dark overrides for this component have not yet been supplied by Figma; placeholders are `#ffffff`/dark variants until a dark mode rest export is available.

## Interactions

### Accessibility

- **Keyboard navigation:**
  - `Enter` or `Space`: Activate the focused item.
  - `Arrow Down` / `Arrow Up`: Move focus to the next/previous `menuitem` inside the same dropdown.
  - `Arrow Right`: If the item has a submenu (indicated by the arrow icon), open the submenu.
  - `Escape`: Close the dropdown menu and return focus to the trigger.
- **ARIA attributes:**
  - Each item: `role="menuitem"`.
  - If disabled: `aria-disabled="true"`.
  - If the item opens a submenu: `aria-haspopup="true"` and `aria-expanded`.
- **Focus management:**
  - Focus ring uses the active/selected border token (`--dropdown-menu-item-border-active`) on `focus-visible`.
  - Disabled items are not focusable and use `aria-disabled`.

### Behavior & guidelines

- **Hover:** Non-disabled items show the hover background.
- **Active/selected:** A single item (or multiple, if multi-select mode is enabled by the parent) uses the active background and border color.
- **Disabled:** The item is non-interactive, uses disabled text/icon colors, and shows `cursor: not-allowed`.
- **Submenu indicator:** The right arrow icon only renders when the item is configured with a submenu.
- **Click:** Activates the item; if a submenu is present, it opens the submenu rather than firing the primary action.

## Composition & API (runtime)

### Variants

- **state:** `default` | `hover` | `active` | `disabled`
- **hasSubmenu:** `true` | `false` (controls visibility of the trailing arrow icon)

### Runtime API

```typescript
interface DropdownMenuItemProps {
  /** Display label for the menu item */
  label: string;
  /** Visual/interactive state */
  state?: "default" | "hover" | "active" | "disabled";
  /** Whether the item opens a nested submenu */
  hasSubmenu?: boolean;
  /** Whether the item is non-interactive */
  disabled?: boolean;
  /** Callback when the item is activated */
  onSelect?: () => void;
  /** Optional leading icon before the label */
  icon?: React.ReactNode;
}
```

**Events:**
- `onSelect`: Fired on click/Enter/Space when the item is not disabled and has no submenu.
- `onSubmenuOpen`: Fired when the right-arrow or right key opens the submenu.

**Spec Accurate Design story defaults:**
- `label`: "Action"
- `state`: "default"
- `hasSubmenu`: true
- `disabled`: false

## Codegen Contract (Framework-Agnostic Blueprint)

### Deterministic structure

```
DropdownMenuItem (root)
├── Background (decorative layer)
├── ContentRow (flex row, align-items: center)
│   ├── LeadingIcon (optional)
│   ├── Label (text/span)
│   └── SubmenuArrow (svg/img, conditionally rendered)
```

**Required DOM hierarchy:**
- Root element should be `<li role="menuitem">` when rendered inside a `<ul role="menu">`.
- Do not nest interactive elements inside the item root.
- The arrow icon must be `<svg>` or `<img>` with `aria-hidden="true"`.

### Variant matrix

| Prop | Values | Default | CSS class pattern |
|------|--------|---------|-------------------|
| state | `default`, `hover`, `active`, `disabled` | `default` | `.dropdown-menu-item--{state}` |
| hasSubmenu | `true`, `false` | `false` | `.dropdown-menu-item--has-submenu` |
| disabled | `true`, `false` | `false` | `.dropdown-menu-item--disabled` |

### Per-slot style contract

**Menu item root:**
- `display: flex` (or `display: block` with inner flex row).
- `align-items: center`.
- `min-height: var(--dropdown-menu-item-min-height, 32px)`.
- `padding: 0 var(--dropdown-menu-item-padding-x, 16px)`.
- `border-radius: var(--dropdown-menu-item-radius, 5px)`.
- `cursor: pointer` (default/hover/active); `cursor: not-allowed` (disabled).
- `box-sizing: border-box`.

**Background layer:**
- Absolute inset 0; behind content.
- `border-radius: inherit`.
- Color by state: `--color-action-tertiary-default`, `--dropdown-menu-item-background-hover`, `--dropdown-menu-item-background-active`.

**ContentRow:**
- `display: flex; align-items: center; justify-content: space-between;`.
- `gap: var(--dropdown-menu-item-gap, 8px)`.

**Label:**
- `font-family: var(--typography-font-style-primary, 'Roboto')`.
- `font-size: var(--font-size-body-2, 14px)`.
- `line-height: var(--font-line-height-line-height-20, 20px)`.
- `font-weight: 400`.
- `color: var(--dropdown-menu-item-text-default, #333333)` or `var(--dropdown-menu-item-text-disabled, #bbbbbb)`.

**SubmenuArrow:**
- Renders only when `hasSubmenu === true`.
- `width: 5.3125px; height: 10px;`.
- `fill: var(--dropdown-menu-item-icon-default, #333333)` or `var(--dropdown-menu-item-icon-disabled, #bbbbbb)`.

### Behavior contract

- State transitions are driven by `state` prop or runtime pseudo-classes (`:hover`, `:active`, `:focus-visible`).
- Disabled state suppresses pointer/keyboard activation.
- Active state is mutually exclusive with hover in a single item, but a menu may contain one active item plus hover on another.
- Submenu arrow visibility is purely data-driven; no animation is specified.

### Accessibility contract

- Root `role="menuitem"`.
- `aria-disabled` when disabled.
- `aria-haspopup="true"` + `aria-expanded` for submenu items.
- Keyboard interactions as defined in the Interactions section.

### Asset resolution + bundling contract

- The right-pointing arrow icon is the `arrow-tri-right-solid` vector asset from the Figma file (`2557:1026`).
- Bundling rule: inline SVG is preferred; path data may be copied from the Figma `vector` node `I2557:1870;2557:1026;154:247` or loaded from the design system icon library.
- No other images, fonts, or illustrations are required. Roboto is inherited from `components/powerflex-theme.css`.

### Fallback/error rules

- Unknown `state`: default to `default`.
- Missing `label`: render empty string; do not crash.
- Missing tokens: use the documented `#hex` fallbacks.
- Missing submenu arrow asset: render no arrow when `hasSubmenu === true` and log a build-time warning.

### Validation checklist

- [ ] Slot geometry matches Figma nodes `2557:1046` and `2557:1045`…`2557:1042`.
- [ ] Background colors use `var(--color-action-tertiary-default)`, `--dropdown-menu-item-background-hover`, and `--dropdown-menu-item-background-active`.
- [ ] Text/icon colors use `--dropdown-menu-item-text-default` / `--dropdown-menu-item-text-disabled` / `--dropdown-menu-item-icon-default` / `--dropdown-menu-item-icon-disabled`.
- [ ] Active border is `1px solid var(--dropdown-menu-item-border-active, #8a38f5)`.
- [ ] Item is `32px` min-height and `16px` horizontal padding.
- [ ] Arrow icon is hidden unless `hasSubmenu` is true.
- [ ] ARIA roles and keyboard behavior match Interactions section.
- [ ] Dark theme tokens are resolvable under `[data-theme="dark"]`.

## Source Mapping

| Source | File key / node id | Verification method |
|--------|-------------------|---------------------|
| Main instance | `82bDP05ESsiiGe38p5TEQJ` / `2557:1870` | Figma REST `get_metadata` + `get_design_context` + `get_variable_defs` + `slotGeometry` |
| State matrix component set | `82bDP05ESsiiGe38p5TEQJ` / `2557:1046` | Figma REST `get_metadata` + `get_design_context` + `get_variable_defs` + `slotGeometry` |
| Default state | `82bDP05ESsiiGe38p5TEQJ` / `2557:1045` | Figma REST `slotGeometry` + `get_design_context` |
| Disabled state | `82bDP05ESsiiGe38p5TEQJ` / `2557:1044` | Figma REST `slotGeometry` + `get_design_context` |
| Hover state | `82bDP05ESsiiGe38p5TEQJ` / `2557:1043` | Figma REST `slotGeometry` + `get_design_context` |
| Active state | `82bDP05ESsiiGe38p5TEQJ` / `2557:1042` | Figma REST `slotGeometry` + `get_design_context` |
| Background variable binding | `VariableID:2557:1002` (`color/action/tertiary/default`) | Figma REST `get_variable_defs` + `slotGeometry` `boundVariableHints` |
| Hover background binding | `VariableID:2557:1003` | Figma REST `slotGeometry` `boundVariableHints` |
| Active background binding | `VariableID:2557:1004` | Figma REST `slotGeometry` `boundVariableHints` |
