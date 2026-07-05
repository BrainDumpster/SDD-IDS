# Dropdown Button Design Spec

## Metadata

- **Version:** 1.0.0
- **Description:** A button that triggers a dropdown menu when clicked. Supports multiple button styles (Primary, Secondary, Tertiary), sizes (Small, Medium, Large), and states (Default, Hover, Press, Focus, Disabled). Supports optional leading icon (settings-gear-detailed) and icon-only variant with both leading icon and dropdown caret. Used as a trigger for dropdown menus and action lists.
- **Status:** draft
- **Created:** 2025-06-23
- **Updated:** 2025-06-23
- **Figma verification:** Figma MCP (get_design_context, get_metadata, get_variable_defs, get_screenshot)
- **Verification date:** 2025-06-23
- **Figma file key:** 0bHk3XhrjFhowgFkz9yLr4
- **Figma node IDs:** Main: 14737:165791, Button instance: 9662:26341, Icon-only (primary): 9662:26098, Icon-only (secondary): 9662:26087, Icon-only (tertiary): 9662:26076, With icon: 9662:26192, Dropdown menu: 14737:142851

## Anatomy

```
┌─────────────────────────────────┐
│  [⚙ Icon] [Label]      [▼ Icon] │  ← Trigger Button (With Icon variant)
└─────────────────────────────────┘
           ↓ (on click)
┌─────────────────────────────────┐
│  Option 1                        │
│  Option 2                        │
│  Option 3                        │
│  ...                             │
└─────────────────────────────────┘  ← Dropdown Menu
```

```
┌─────────────────────────────────┐
│  [⚙ Icon]           [▼ Icon]    │  ← Trigger Button (Icon Only variant)
└─────────────────────────────────┘
           ↓ (on click)
┌─────────────────────────────────┐
│  Option 1                        │
│  Option 2                        │
│  Option 3                        │
│  ...                             │
└─────────────────────────────────┘  ← Dropdown Menu
```

**Anatomy slots:**
- **Trigger Button:** The button that opens/closes the dropdown menu
  - Leading Icon (optional): Settings/gear icon (settings-gear-detailed, 16x16px)
  - Button Label: Text content of the button; updates to display selected item's label when an item is selected
  - Dropdown Icon: Caret/arrow indicator (arrow-drop-tri-caret, 10x10px)
- **Dropdown Menu:** The menu that appears when the button is clicked
  - Menu Container: Wraps all menu options
  - Menu Option: Individual selectable items in the menu

## Layout & Measurements

### Slot geometry (Figma-verified)

| Slot / layer | Property | Token / contract | Figma node | Live evidence |
|--------------|----------|------------------|------------|---------------|
| Trigger Button | border-radius | `var(--button-control-radius)` (2px for Primary/Secondary, 4px for Tertiary) | 9662:26341 | Figma MCP get_variable_defs |
| Trigger Button | min-height | Size-dependent: Small=24px, Medium=32px, Large=40px | 9662:26341 | Figma MCP get_design_context |
| Trigger Button | padding-x | Size-dependent: Small=16px, Medium=16px, Large=16px | 9662:26341 | Figma MCP get_design_context |
| Trigger Button | padding-y | Size-dependent: Small=6px, Medium=6px, Large=10px | 9662:26341 | Figma MCP get_design_context |
| Leading Icon (optional) | size | 16px | 9662:26099 | Figma MCP get_design_context |
| Leading Icon | margin-right | 8px | 9662:26098 | Figma MCP get_design_context |
| Dropdown Icon | size | 10px | 9662:26650 | Figma MCP get_design_context |
| Dropdown Icon | margin-left | 8px | 9662:26341 | Figma MCP get_design_context |
| Content Wrapper | display | flex | - | Storybook implementation |
| Content Wrapper | align-items | center | - | Storybook implementation |
| Dropdown Menu | border-radius | `var(--menu-control-radius)` (2px) | 14737:142851 | Figma MCP get_design_context |
| Dropdown Menu | box-shadow | `var(--shadow-shadow-4)` | 14737:142851 | Figma MCP get_design_context |
| Menu Option | padding-x | `var(--padding-16)` (16px) left, `var(--padding-24)` (24px) right | 22472:147638 | Figma MCP get_design_context |
| Menu Option | padding-y | `var(--padding-10)` (10px) | 22472:147638 | Figma MCP get_design_context |

### Container measurements

- **Trigger Button width:** Auto (based on content), min-width varies by size
- **Dropdown Menu width:** 269px (fixed from Figma example)
- **Dropdown Menu max-height:** Not specified in Figma (scrollable if needed)
- **Gap between button and menu:** 0px (menu positioned flush below button)

## Tokens

### Typography

**Button Label:**
- Font family: `var(--typography-font-style-primary, 'Roboto')`
- Font size: `var(--font-size-body-2, 14px)`
- Font weight: `var(--typography-font-weight-regular, 400)`
- Line height: `var(--font-line-height-line-height-20, 20px)`
- Letter spacing: 0

**Menu Option Text:**
- Font family: `var(--typography-font-style-primary, 'Roboto')`
- Font size: 14px
- Font weight: `var(--typography-font-weight-regular, 400)`
- Line height: `var(--font-line-height-line-height-20, 20px)`

### Colors

**Button - Primary Style:**
- Background (default): `var(--color-background-controls-brand-base, #0672cb)`
- Background (hover): `var(--color-background-controls-brand-strong, #055fa9)`
- Background (press): `var(--color-background-controls-brand-stronger, #044b86)`
- Background (focus): `var(--color-background-controls-brand-base, #0672cb)`
- Background (disabled): `var(--color-background-controls-disabled, #f4f4f4)`
- Text (default/hover/press/focus): `var(--color-text-white, #ffffff)`
- Text (disabled): `var(--color-text-disabled, #757575)`
- Border: `var(--color-border-transparent-brand, rgba(255,255,255,0))`
- Border width: `var(--border-width-border-default, 1px)`

**Button - Secondary Style:**
- Background (default): `var(--color-background-controls-brand-lighter, #ebf4fb)`
- Background (hover): `var(--color-background-controls-brand-light, #daeaf7)`
- Background (press): `var(--color-background-controls-brand-base, #0672cb)`
- Background (focus): `var(--color-background-controls-brand-lighter, #ebf4fb)`
- Background (disabled): `var(--color-background-controls-disabled, #f4f4f4)`
- Text (default/hover/focus): `var(--color-text-brand-strong, #055fa9)`
- Text (press): `var(--color-text-white, #ffffff)`
- Text (disabled): `var(--color-text-disabled, #757575)`
- Border: `var(--color-border-brand-base, #0672cb)`
- Border width: `var(--border-width-border-default, 1px)`

**Button - Tertiary Style:**
- Background (default): `var(--color-background-component, transparent)`
- Background (hover): `var(--color-background-gray-lighter, #f4f4f4)`
- Background (press): `var(--color-background-gray-lighter, #f4f4f4)`
- Background (focus): `var(--color-background-component, transparent)`
- Background (disabled): `var(--color-background-component, transparent)`
- Text (default/hover/press/focus): `var(--color-text-brand-strong, #055fa9)`
- Text (disabled): `var(--color-text-disabled, #757575)`
- Border: `var(--color-border-transparent-brand, rgba(255,255,255,0))`
- Border width: `var(--border-width-border-default, 1px)`

**Dropdown Icon:**
- Color (default/hover/press/focus): `var(--color-icon-white, #ffffff)` for Primary, `var(--color-icon-brand-base, #0672cb)` for Secondary/Tertiary
- Color (disabled): `var(--color-icon-disabled, #757575)`

**Leading Icon (optional):**
- Icon name: `settings-gear-detailed`
- Size: 16px
- Color: `currentColor` (inherits from button text color)

**Dropdown Menu:**
- Background: `var(--color-background-component, white)`
- Border: `var(--color-border-accessible, #757575)`
- Border width: `var(--border-width-border-default, 1px)`
- Box shadow: `var(--shadow-shadow-4)`

**Menu Option:**
- Background (default): `var(--color-background-component, white)`
- Background (hover): `var(--color-background-gray-lighter, #f4f4f4)`
- Text (default): `var(--color-text-neutral, #4d4d4d)`
- Text (hover): `var(--color-text-brand-strong, #055fa9)`

### Spacing

- **Gap between leading icon and label:** 8px
- **Gap between label and dropdown icon:** 8px
- **Gap between leading icon and dropdown icon (icon-only):** 8px
- **Gap between menu options:** 0px
- **Menu padding:** `var(--padding-padding-1, 1px)` horizontal, 0px vertical

### Border Radius

- **Button (Primary/Secondary):** `var(--corner-radius-radius-2, 2px)`
- **Button (Tertiary):** `var(--corner-radius-radius-4, 4px)`
- **Dropdown Menu:** `var(--corner-radius-radius-2, 2px)`

## States (Light Theme)

| Variant | State | Background | Text | Border | Icon |
|---------|-------|------------|------|--------|------|
| **Primary - Medium** | default | `var(--color-background-controls-brand-base)` | `var(--color-text-white)` | `var(--color-border-transparent-brand)` | `var(--color-icon-white)` |
| **Primary - Medium** | hover | `var(--color-background-controls-brand-strong)` | `var(--color-text-white)` | `var(--color-border-transparent-brand)` | `var(--color-icon-white)` |
| **Primary - Medium** | press | `var(--color-background-controls-brand-stronger)` | `var(--color-text-white)` | `var(--color-border-transparent-brand)` | `var(--color-icon-white)` |
| **Primary - Medium** | focus-visible | `var(--color-background-controls-brand-base)` | `var(--color-text-white)` | `var(--color-border-transparent-brand)` + focus ring | `var(--color-icon-white)` |
| **Primary - Medium** | disabled | `var(--color-background-controls-disabled)` | `var(--color-text-disabled)` | `var(--color-border-transparent-brand)` | `var(--color-icon-disabled)` |
| **Secondary - Medium** | default | `var(--color-background-controls-brand-lighter)` | `var(--color-text-brand-strong)` | `var(--color-border-brand-base)` | `var(--color-icon-brand-base)` |
| **Secondary - Medium** | hover | `var(--color-background-controls-brand-light)` | `var(--color-text-brand-strong)` | `var(--color-border-brand-base)` | `var(--color-icon-brand-base)` |
| **Secondary - Medium** | press | `var(--color-background-controls-brand-base)` | `var(--color-text-white)` | `var(--color-border-brand-base)` | `var(--color-icon-white)` |
| **Secondary - Medium** | focus-visible | `var(--color-background-controls-brand-lighter)` | `var(--color-text-brand-strong)` | `var(--color-border-brand-base)` + focus ring | `var(--color-icon-brand-base)` |
| **Secondary - Medium** | disabled | `var(--color-background-controls-disabled)` | `var(--color-text-disabled)` | `var(--color-border-disabled)` | `var(--color-icon-disabled)` |
| **Tertiary - Medium** | default | `var(--color-background-component)` | `var(--color-text-brand-strong)` | `var(--color-border-transparent-brand)` | `var(--color-icon-brand-base)` |
| **Tertiary - Medium** | hover | `var(--color-background-gray-lighter)` | `var(--color-text-brand-strong)` | `var(--color-border-transparent-brand)` | `var(--color-icon-brand-base)` |
| **Tertiary - Medium** | press | `var(--color-background-gray-lighter)` | `var(--color-text-brand-strong)` | `var(--color-border-transparent-brand)` | `var(--color-icon-brand-base)` |
| **Tertiary - Medium** | focus-visible | `var(--color-background-component)` | `var(--color-text-brand-strong)` | `var(--color-border-transparent-brand)` + focus ring | `var(--color-icon-brand-base)` |
| **Tertiary - Medium** | disabled | `var(--color-background-component)` | `var(--color-text-disabled)` | `var(--color-border-transparent-brand)` | `var(--color-icon-disabled)` |

**Size variants (applies to all styles):**
- **Small:** height 24px, padding-y 6px
- **Medium:** height 32px, padding-y 6px
- **Large:** height 40px, padding-y 10px

**Dropdown Menu States:**
| State | Background | Border | Box Shadow |
|-------|------------|--------|------------|
| Open | `var(--color-background-component)` | `var(--color-border-accessible)` | `var(--shadow-shadow-4)` |
| Closed | N/A (not rendered) | N/A | N/A |

**Menu Option States:**
| State | Background | Text |
|-------|------------|------|
| Default | `var(--color-background-component)` | `var(--color-text-neutral)` |
| Hover | `var(--color-background-gray-lighter)` | `var(--color-text-brand-strong)` |
| Selected | `var(--color-background-controls-brand-lighter)` | `var(--color-text-brand-strong)` |

## States (Dark Theme)

All Dark theme states use the same `var(--...)` tokens as Light theme. The token values themselves differ by theme in `ids-theme.css`, but the state matrix structure is identical. See Light theme table above for token references.

## Interactions

### Accessibility

- **Keyboard navigation:**
  - `Enter` or `Space`: Open/close dropdown menu
  - `Escape`: Close dropdown menu
  - `Arrow Down` / `Arrow Up`: Navigate menu options when menu is open
  - `Home` / `End`: Jump to first/last menu option
  - `Tab`: Move focus to next focusable element (closes menu)
  - `Shift+Tab`: Move focus to previous focusable element (closes menu)
- **ARIA attributes:**
  - `aria-haspopup="true"`: Indicates button opens a menu
  - `aria-expanded`: Indicates whether menu is open (`true`) or closed (`false`)
  - `aria-controls`: References the dropdown menu element
  - Menu items: `role="menuitem"` with appropriate focus management
- **Focus management:**
  - Focus ring appears on `focus-visible` state (not on focus)
  - When menu opens, focus moves to first menu item
  - When menu closes, focus returns to trigger button

### Behavior & guidelines

- **Click behavior:** Single click on trigger button toggles dropdown menu open/closed
- **Click outside:** Clicking outside the dropdown menu closes it
- **Menu positioning:** Menu appears below the trigger button, left-aligned
- **Menu overflow:** If menu exceeds viewport height, it becomes scrollable
- **Disabled state:** Button is non-interactive, no dropdown menu appears
- **Icon-only variant:** When button has no text label, shows both the leading icon (gear) and dropdown icon (caret)
- **Multiple dropdowns:** Only one dropdown menu can be open at a time per container
- **Selection behavior:** Clicking a dropdown menu item selects that item and updates the button label to display the selected item's label. The dropdown menu closes after selection.

## Composition & API (runtime)

### Variants

**Button Style:**
- `primary` (default)
- `secondary`
- `tertiary`

**Size:**
- `small` (height: 24px)
- `medium` (default, height: 32px)
- `large` (height: 40px)

**Icon Only:**
- `false` (default): Shows button label + dropdown icon
- `true`: Shows only dropdown icon

**State:**
- `default` (default)
- `hover`
- `press`
- `focus-visible`
- `disabled`

### Runtime API

**Props:**
```typescript
interface DropdownButtonProps {
  /** Button label text (required unless iconOnly is true) */
  label: string;
  /** Button style variant */
  buttonStyle?: 'primary' | 'secondary' | 'tertiary';
  /** Button size variant */
  size?: 'small' | 'medium' | 'large';
  /** Optional leading icon (e.g., settings-gear-detailed) */
  icon?: React.ReactNode;
  /** Whether to show only the icon without text */
  iconOnly?: boolean;
  /** Whether the button is disabled */
  disabled?: boolean;
  /** Whether the dropdown menu is currently open (controlled) */
  open?: boolean;
  /** Callback when dropdown open state changes */
  onOpenChange?: (open: boolean) => void;
  /** Menu items to display in the dropdown */
  items: DropdownItem[];
  /** Currently selected item (optional) */
  selectedItem?: DropdownItem | null;
  /** Callback when an item is selected */
  onSelect?: (item: DropdownItem) => void;
}

interface DropdownItem {
  /** Unique identifier for the item */
  id: string;
  /** Display text for the item */
  label: string;
  /** Whether the item is disabled */
  disabled?: boolean;
  /** Optional icon for the item */
  icon?: React.ReactNode;
}
```

**Events:**
- `onClick`: Triggered when button is clicked (before menu toggle)
- `onOpenChange`: Triggered when menu opens or closes
- `onSelect`: Triggered when a menu item is selected; button label updates to selected item's label
- `onKeyDown`: Keyboard events for accessibility

**Spec Accurate Design story defaults:**
- `buttonStyle`: 'primary'
- `size`: 'medium'
- `iconOnly`: false
- `disabled`: false
- `label`: 'Dropdown Button'
- `items`: [{ id: '1', label: 'Option 1' }, { id: '2', label: 'Option 2' }, { id: '3', label: 'Option 3' }]

## Codegen Contract (Framework-Agnostic Blueprint)

### Deterministic structure

```
DropdownButton (container)
├── TriggerButton (button element)
│   ├── ContentWrapper (span, display: flex, align-items: center)
│   │   ├── LeadingIcon (optional, svg/img, 16px)
│   │   ├── ButtonLabel (text/span)
│   │   └── DropdownIcon (svg/img, 10px)
└── DropdownMenu (menu element, conditionally rendered)
    └── MenuOptions (list/ul)
        ├── MenuItem (li/option)
        │   └── MenuItemLabel (text)
        ├── MenuItem (li/option)
        │   └── MenuItemLabel (text)
        └── ...
```

**Required DOM hierarchy:**
- Root container must be a `<button>` element for the trigger
- Dropdown menu must be a separate DOM element (not nested inside button)
- Menu must use appropriate ARIA roles (`menu`, `menuitem`)
- Icon must be an `<img>` or `<svg>` with `aria-hidden="true"`

### Variant matrix

| Prop | Values | Default | CSS class pattern |
|------|--------|---------|-------------------|
| buttonStyle | primary, secondary, tertiary | primary | `.dropdown-button--{style}` |
| size | small, medium, large | medium | `.dropdown-button--{size}` |
| iconOnly | true, false | false | `.dropdown-button--icon-only` |
| disabled | true, false | false | `.dropdown-button--disabled` |
| open | true, false | false | `.dropdown-button--open` |

### Per-slot style contract

**Trigger Button:**
- Must use semantic tokens for all colors, spacing, typography
- Border-radius: `var(--button-control-radius)` (size-dependent)
- Padding: `var(--padding-16)` horizontal, size-dependent vertical
- Focus ring: `var(--focus-ring)` on `focus-visible` only

**Content Wrapper:**
- Display: flex
- Align-items: center
- Gap: 8px between all children

**Leading Icon (optional):**
- Size: 16px fixed
- Color: `currentColor` (inherits from button text color)
- Margin-right: 8px when label is present, 8px when label is absent (icon-only)
- Icon name: `settings-gear-detailed`

**Dropdown Icon:**
- Size: 10px fixed
- Color: Follows button style token (white for Primary, brand for Secondary/Tertiary)
- Must have `aria-hidden="true"`

**Dropdown Menu:**
- Background: `var(--color-background-component)`
- Border: `var(--border-width-border-default)` solid `var(--color-border-accessible)`
- Border-radius: `var(--menu-control-radius)`
- Box-shadow: `var(--shadow-shadow-4)`
- Position: Absolute, below trigger button
- Z-index: Higher than trigger button

**Menu Option:**
- Padding: `var(--padding-16)` left, `var(--padding-24)` right, `var(--padding-10)` vertical
- Background: `var(--color-background-component)` (default), `var(--color-background-gray-lighter)` (hover)
- Text: `var(--color-text-neutral)` (default), `var(--color-text-brand-strong)` (hover)
- Cursor: Pointer (interactive), Not-allowed (disabled)

### Behavior contract

**Menu toggle:**
- Click on trigger button toggles `open` state
- Click outside menu closes it
- Escape key closes it
- Tab/Shift+Tab closes it

**Menu navigation:**
- Arrow Down/Up moves focus between items
- Home/End jumps to first/last item
- Enter/Space on item selects it, updates button label to selected item's label, and closes menu

**Disabled state:**
- Trigger button is non-interactive
- Menu cannot be opened
- Visual opacity reduced via tokens

**Controlled vs uncontrolled:**
- If `open` prop is provided, component is controlled for menu open state
- If `selectedItem` prop is provided, component is controlled for selection state
- If `onOpenChange` is provided, component reports menu open state changes
- If `onSelect` is provided, component reports selection changes
- If neither is provided, component manages internal state for both menu open and selection

### Accessibility contract

**Required ARIA attributes:**
- Trigger button: `aria-haspopup="true"`, `aria-expanded={open}`, `aria-controls={menuId}`
- Menu: `role="menu"`, `aria-labelledby={buttonId}`
- Menu items: `role="menuitem"`, `aria-disabled={disabled}`

**Keyboard interaction:**
- All interactions must work without mouse
- Focus must be visible and trackable
- Focus must return to trigger button after menu closes

**Screen reader:**
- Button label must describe action (e.g., "Options, menu")
- Menu items must be announced as menu items
- Selected state must be announced

### Asset resolution + bundling contract

**Leading icon:**
- Icon name: `settings-gear-detailed`
- Figma node: 44484:854
- Asset path: `assets/icons/settings-gear-detailed.svg`
- Must be bundled as SVG
- Must support color changes via CSS or fill property
- Size: 16x16px

**Dropdown icon:**
- Icon name: `arrow-drop-tri-caret`
- Figma node: 44484:783
- Asset path: `assets/icons/arrow-drop-tri-caret.svg`
- Must be bundled as SVG or optimized PNG
- Must support color changes via CSS or fill property
- Size: 10x10px

### Fallback/error rules

**Missing label:**
- If `label` is empty and `iconOnly` is false, render empty button with icon only

**Empty items:**
- If `items` array is empty, render disabled button or show "No options" message

**Loading state:**
- Not specified in Figma - use disabled state or loading spinner if needed

**Error state:**
- Not specified in Figma - use disabled state or error message if needed

### Validation checklist

- [ ] All required sections are complete
- [ ] All semantic tokens use `var(--...)` syntax
- [ ] No hardcoded colors, spacing, typography, or radius values
- [ ] Slot geometry table includes Figma node IDs and evidence
- [ ] State matrix covers all variants (style × size × state)
- [ ] Accessibility contract includes ARIA attributes and keyboard navigation
- [ ] Codegen contract is testable and framework-agnostic
- [ ] Source mapping includes Figma verification evidence
- [ ] Status is `draft` until validation passes

## Source Mapping

**Figma File:**
- File key: `0bHk3XhrjFhowgFkz9yLr4`
- File name: IDS-Design-Library
- URL: https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library

**Main Component Node:**
- Node ID: `14737:165791`
- Node name: Dropdown Button
- Node type: FRAME
- URL: https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=14737-165791

**Button Instance Node (Primary, Medium, Default):**
- Node ID: `9662:26341`
- Node name: Button Style=Primary, State=Default, Size=Medium, Icon only button=No, Low res=No, Show Icon=No
- Node type: SYMBOL
- URL: https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=9662-26341

**Icon-Only Variant Nodes:**
- Primary icon-only: `9662:26098` - URL: https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=9662-26098
- Secondary icon-only: `9662:26087` - URL: https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=9662-26087
- Tertiary icon-only: `9662:26076` - URL: https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=9662-26076

**With Icon Variant Node:**
- With icon: `9662:26192` - URL: https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=9662-26192

**Dropdown Icon Node:**
- Node ID: `9662:26650`
- Node name: arrow-drop-tri-caret
- Node type: INSTANCE
- Parent: 9662:26341

**Leading Icon Node:**
- Node ID: `9662:26099`
- Node name: settings-gear-detailed
- Node type: INSTANCE
- Parent: 9662:26098

**Dropdown Menu Node:**
- Node ID: `14737:142851`
- Node name: Dropdown-SingleSelect-Elements-Menu
- Node type: INSTANCE
- URL: https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=14737-142851

**Menu Option Node:**
- Node ID: `22472:147638`
- Node name: .Dropdown-SingleSelect-Elements-Options
- Node type: INSTANCE
- Parent: 14737:142851

**Verification Method:**
- Method: Figma MCP
- Tools: get_design_context, get_metadata, get_variable_defs, get_screenshot
- Date: 2025-06-23
- Session: Design-spec intake wizard

**Supplemental Node IDs (for reference):**
- Button variants (all styles × sizes × states): See metadata output for full list
- Icon-only variants: 9662:26098 (primary), 9662:26087 (secondary), 9662:26076 (tertiary)
- With icon variant: 9662:26192
- All button symbols share the same component structure with different variant props
