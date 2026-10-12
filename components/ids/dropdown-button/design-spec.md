# Dropdown Button Design Spec

## Metadata

- **Version:** 1.1.0
- **Description:** A button that triggers a dropdown menu when clicked. Supports multiple button styles (Primary, Secondary, Tertiary), sizes (Small, Medium, Large), and states (Default, Hover, Press, Focus, Disabled). Supports optional leading icon (settings-gear-detailed) and icon-only variant with both leading icon and dropdown caret. Used as a trigger for dropdown menus and action lists.
- **Status:** draft
- **Created:** 2025-06-23
- **Updated:** 2026-10-12
- **Figma verification:** Figma MCP (get_design_context, get_metadata, get_variable_defs, get_screenshot)
- **Verification date:** 2026-10-12
- **Figma file key:** 0bHk3XhrjFhowgFkz9yLr4
- **Figma node IDs:** Main: 14737:165791, Examples: 41894:290670, Button instance: 9662:26341, Secondary press: 9662:26326, Tertiary hover/press/focus: 9662:26317 / 9662:26315 / 9662:26321, Icon-only (primary): 9662:26098, Icon-only (secondary): 9662:26087, Icon-only (tertiary): 9662:26076, With icon: 9662:26192, Dropdown menu: 14737:142851, Option hover (no radio): 29377:159478

## Anatomy

Deterministic child structure (runtime composition order):

```
dropdown
├── trigger-slot          ← any host: button | div | icon | custom node
└── dropdown-menu         ← popup (shared combo-box detached menu styling)
    └── dropdown-menu-item*
        └── dropdown-menu?  ← optional nested submenu (same slot contract)
```

```
┌─────────────────────────────────┐
│  [⚙ Icon] [Label]      [▼ Icon] │  ← trigger-slot (button example)
└─────────────────────────────────┘
           ↓ (on click)
┌─────────────────────────────────┐
│  Option 1                        │  ← dropdown-menu-item
│  Option 2 ▸                      │  ← item with nested dropdown-menu
│  Option 3                        │
└─────────────────────────────────┘  ← dropdown-menu
```

**Anatomy slots:**
- **`dropdown`:** Root container; owns open state and Base UI `Menu.Root`.
- **`trigger-slot`:** Opens/closes the menu. Accepts any projected content (IDS Button, icon-only control, plain `div`, etc.). Default Mode A trigger may include:
  - Leading Icon (optional): e.g. `settings-gear-detailed` (16×16)
  - Button Label: text content
  - Dropdown Icon: `arrow-drop-tri-caret` (10×10)
- **`dropdown-menu`:** Popup surface. **Must use the same styling contract as Dropdown Combo Box detached popup** (`popup` + `popupStandalone` from shared dropdown menu CSS): surface, 4-sided border, radius, shadow, option row hover/press.
- **`dropdown-menu-item`:** Row inside a menu. May nest another `dropdown-menu` to form a submenu (flyout). Nested menus reuse the same popup styling.

## Layout & Measurements

### Slot geometry (Figma-verified)

| Slot / layer | Property | Token / contract | Figma node | Live evidence |
|--------------|----------|------------------|------------|---------------|
| Trigger Button | border-radius | `var(--corner-radius-radius-2)` (**2px** for Primary / Secondary / Tertiary) | 9662:26341, 9662:26319 | Figma MCP `get_variable_defs` → `Corner Radius/radius-2` |
| Trigger Button | min-height | Small=`var(--scale-24)` (24px), Medium=`var(--scale-32)` (32px), Large=`var(--scale-40)` (40px) | 9662:26308 / 9662:26341 / 9662:26374 | Figma MCP get_metadata |
| Trigger Button | padding-x | `var(--padding-padding-16)` (16px) all sizes | 9662:26341 | Figma MCP get_variable_defs |
| Trigger Button | padding-y | Small=`var(--padding-padding-2)` (2px), Medium=`var(--padding-padding-6)` (6px), Large=`var(--padding-padding-10)` (10px) | 9662:26308 / 9662:26341 / 9662:26374 | Figma MCP get_variable_defs |
| Focus rings | dual drop-shadow | inner `var(--scale-2)` + `var(--color-border-gray-white)`; outer `var(--scale-4)` + `var(--color-border-brand-base)` | 9662:26343, 9662:26332, 9662:26321 | Figma MCP get_variable_defs (Focus Drop Shadow spreads) |
| Leading Icon (optional) | size | 16px | 9662:26099 | Figma MCP get_design_context |
| Leading Icon | gap to label/caret | `var(--spacing-space-8)` (8px) | 9662:26098 | Figma MCP get_design_context |
| Dropdown Icon | size | 10px | 9662:26650 | Figma MCP get_design_context |
| Dropdown Icon | gap from label | `var(--spacing-space-8)` (8px) | 9662:26341 | Figma MCP get_design_context |
| Content Wrapper | display / align | flex / center | - | Runtime |
| Dropdown Menu | border-radius | `var(--dropdown-menu-radius)` (IDS → 0; shared with combo-box detached popup) | 14737:142851 | Figma MCP get_design_context + shared `DropdownMenu.module.css` `.popupStandalone` |
| Dropdown Menu | box-shadow | `var(--shadow-shadow-4)` | 14737:142851 | Figma MCP get_design_context |
| Menu Option | padding-x | `var(--padding-padding-16)` left, `var(--padding-padding-24)` right | 22472:147638 | Figma MCP get_design_context |
| Menu Option | padding-y | `var(--padding-padding-10)` | 22472:147638 | Figma MCP get_design_context |

### Container measurements

- **Trigger Button width:** Auto (based on content), min-width varies by size
- **Dropdown Menu width:** `min-width: 100%` of trigger (content-driven); Figma example ~269px is reference only.
- **Dropdown Menu max-height:** Not specified in Figma (scrollable if needed).
- **Gap between button and menu:** Menu opens below the trigger, left-aligned. Runtime uses portaled positioning (`sideOffset` content-driven); do not invent a fixed pixel gap beyond Figma composition examples (`41894:290670`).

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

**Button - Primary Style** (Figma `9662:26341` / hover `9662:26339` / focus `9662:26343` / disabled `9662:26335`):
- Background (default): `var(--color-background-controls-base)`
- Background (hover / focus-visible): `var(--color-background-controls-strong)`
- Background (press): `var(--color-background-controls-stronger)`
- Background (disabled): `var(--color-background-gray-lighter)`
- Text/Icon (default/hover/press/focus): `var(--color-text-gray-white)` / `var(--color-icon-gray-white)`
- Text/Icon (disabled): `var(--color-text-gray-disabled)` / `var(--color-icon-gray-disabled)`
- Border (default/hover/press/focus): `var(--color-border-brand-transparent-brand)`
- Border (disabled): `var(--color-border-gray-disabled)`
- Border width: `var(--border-width-border-default)` (inset stroke)

**Button - Secondary Style** (Figma `9662:26330` / hover `9662:26328` / press `9662:26326` / focus `9662:26332` / disabled `9662:26324`):
- Background (default / disabled): transparent
- Background (hover / focus-visible): `var(--color-background-controls-light)`
- Background (press): `var(--color-background-brand-base)` (**Dropdown Button–specific**; differs from text Button press)
- Text (default/hover/focus/press): `var(--color-text-brand-strong)`
- Text (disabled): `var(--color-text-gray-disabled)`
- Icon (default/hover/focus): `var(--color-icon-brand-base)`
- Icon (press): `var(--color-icon-brand-stronger)`
- Icon (disabled): `var(--color-icon-gray-disabled)`
- Border (default/hover/press/focus): `var(--color-border-brand-base)` (press keeps brand-base — not Button’s `border-brand-strong`)
- Border (disabled): `var(--color-border-gray-disabled)`

**Button - Tertiary Style** (Figma `9662:26319` / hover `9662:26317` / press `9662:26315` / focus `9662:26321`):
- Background (default / disabled): transparent
- Background (hover / focus-visible): `var(--color-background-controls-light)`
- Background (press): `var(--color-background-brand-base)` (**Dropdown Button–specific**)
- Text (default/hover/focus/press): `var(--color-text-brand-strong)`
- Text (disabled): `var(--color-text-gray-disabled)`
- Icon (default/hover/focus): `var(--color-icon-brand-base)`
- Icon (press): `var(--color-icon-brand-stronger)`
- Icon (disabled): `var(--color-icon-gray-disabled)`
- Border: transparent (no control stroke) on all states; focus adds dual rings only

**Dropdown Icon:**
- Primary: `var(--color-icon-gray-white)` (disabled → `var(--color-icon-gray-disabled)`)
- Secondary / Tertiary: `var(--color-icon-brand-base)` default/hover/focus; press → `var(--color-icon-brand-stronger)`; disabled → `var(--color-icon-gray-disabled)`

**Leading Icon (optional):**
- Icon name: `settings-gear-detailed`
- Size: 16px
- Color: `currentColor` (inherits from button text color)

**Dropdown Menu:**
- Background: `var(--color-background-surface-component, white)`
- Border: `var(--color-border-gray-neutral-base, #757575)` (full 4-sided — detached popup, same as combo-box `popupStandalone`)
- Border width: `var(--border-width-border-default, 1px)`
- Box shadow: shared combo-box menu shadow (`shadow-shadow-4` drop layers)
- Corner radius: `var(--dropdown-menu-radius)` (IDS → 0; same token as combo-box detached menu)
- Option row states: shared `.item` contract (hover brand-lighter-slate + inset `var(--color-border-brand-base-neutral)` strokes)
**Menu Option:**
- Background (default): `var(--color-background-surface-component, white)`
- Background (hover): `var(--color-background-brand-lighter-slate, #ebf4fb)`
- Text (default): `var(--color-text-gray-neutral, #4d4d4d)`
- Text (hover): `var(--color-text-gray-neutral, #4d4d4d)`
- Row-emphasis stroke (hover): inset top/bottom `var(--color-border-brand-base-neutral, #0672cb)`

### Spacing

- **Gap between leading icon and label:** 8px
- **Gap between label and dropdown icon:** 8px
- **Gap between leading icon and dropdown icon (icon-only):** 8px
- **Gap between menu options:** 0px
- **Menu padding:** `var(--padding-padding-1, 1px)` horizontal, 0px vertical

### Border Radius

- **Trigger (all styles including Tertiary):** `var(--corner-radius-radius-2)` (2px) — Figma `get_variable_defs` on `9662:26319`
- **Dropdown Menu:** `var(--dropdown-menu-radius)` (IDS → 0)

## States (Light Theme)

| Variant | State | Background | Text | Border | Icon |
|---------|-------|------------|------|--------|------|
| **Primary** | default | `var(--color-background-controls-base)` | `var(--color-text-gray-white)` | `var(--color-border-brand-transparent-brand)` | `var(--color-icon-gray-white)` |
| **Primary** | hover | `var(--color-background-controls-strong)` | `var(--color-text-gray-white)` | `var(--color-border-brand-transparent-brand)` | `var(--color-icon-gray-white)` |
| **Primary** | press | `var(--color-background-controls-stronger)` | `var(--color-text-gray-white)` | `var(--color-border-brand-transparent-brand)` | `var(--color-icon-gray-white)` |
| **Primary** | focus-visible | `var(--color-background-controls-strong)` | `var(--color-text-gray-white)` | transparent control + dual focus rings | `var(--color-icon-gray-white)` |
| **Primary** | disabled | `var(--color-background-gray-lighter)` | `var(--color-text-gray-disabled)` | `var(--color-border-gray-disabled)` | `var(--color-icon-gray-disabled)` |
| **Secondary** | default | transparent | `var(--color-text-brand-strong)` | `var(--color-border-brand-base)` | `var(--color-icon-brand-base)` |
| **Secondary** | hover | `var(--color-background-controls-light)` | `var(--color-text-brand-strong)` | `var(--color-border-brand-base)` | `var(--color-icon-brand-base)` |
| **Secondary** | press | `var(--color-background-brand-base)` | `var(--color-text-brand-strong)` | `var(--color-border-brand-base)` | `var(--color-icon-brand-stronger)` |
| **Secondary** | focus-visible | `var(--color-background-controls-light)` | `var(--color-text-brand-strong)` | `var(--color-border-brand-base)` + dual focus rings | `var(--color-icon-brand-base)` |
| **Secondary** | disabled | transparent | `var(--color-text-gray-disabled)` | `var(--color-border-gray-disabled)` | `var(--color-icon-gray-disabled)` |
| **Tertiary** | default | transparent | `var(--color-text-brand-strong)` | transparent | `var(--color-icon-brand-base)` |
| **Tertiary** | hover | `var(--color-background-controls-light)` | `var(--color-text-brand-strong)` | transparent | `var(--color-icon-brand-base)` |
| **Tertiary** | press | `var(--color-background-brand-base)` | `var(--color-text-brand-strong)` | transparent | `var(--color-icon-brand-stronger)` |
| **Tertiary** | focus-visible | `var(--color-background-controls-light)` | `var(--color-text-brand-strong)` | transparent + dual focus rings | `var(--color-icon-brand-base)` |
| **Tertiary** | disabled | transparent | `var(--color-text-gray-disabled)` | transparent | `var(--color-icon-gray-disabled)` |

**Focus rings (all styles):** `0 0 0 var(--scale-2) var(--color-border-gray-white)` then `0 0 0 var(--scale-4) var(--color-border-brand-base)`, stacked after the inset control stroke.

**Size variants (applies to all styles):**
- **Small:** height 24px, padding-y `var(--padding-padding-2)`
- **Medium:** height 32px, padding-y `var(--padding-padding-6)`
- **Large:** height 40px, padding-y `var(--padding-padding-10)`

**Dropdown Menu States:**
| State | Background | Border | Box Shadow |
|-------|------------|--------|------------|
| Open | `var(--color-background-surface-component)` | `var(--color-border-gray-neutral-base)` | `var(--shadow-shadow-4)` |
| Closed | N/A (not rendered) | N/A | N/A |

**Menu Option States** (Figma-verified `12380:16525`):
| State | Background | Border | Text |
|-------|------------|--------|------|
| Default | `var(--color-background-surface-component)` | none | `var(--color-text-gray-neutral)` |
| Hover | `var(--color-background-brand-lighter-slate)` | top+bottom `1px solid var(--color-border-brand-base-neutral)` | `var(--color-text-gray-neutral)` |
| Press / Active | `var(--color-background-brand-light-slate)` | top+bottom `1px solid var(--color-border-brand-base-neutral)` | `var(--color-text-brand-strong)` |
| Selected | `var(--color-background-brand-lighter-slate)` | top+bottom `1px solid var(--color-border-brand-base-neutral)` | `var(--color-text-brand-strong)` |
| Focus-visible | `var(--color-background-surface-component)` | absolute inset `::after`, `1px solid var(--color-border-brand-base)`, `border-radius: radius-4` | `var(--color-text-gray-neutral)` |
| Disabled | `var(--color-background-gray-lighter)` | top+bottom `1px solid var(--color-border-gray-disabled)` | `var(--color-text-gray-disabled)` |

**Menu Option padding (Figma `12380:16525`):** `10px` vertical · `16px` left · `24px` right.

## States (Dark Theme)

Dark theme uses the same semantic tokens as **States (Light Theme)**. Resolved values for `[data-theme="dark"]` / `.ids-theme-dark` (and program overlays) live in theme CSS:

- `components/ids-theme.css`
- `components/<program>-theme.css` when a program overlays IDS (for example `components/dap-theme.css`)

Duplicate the full state matrix in this section only when a dark row genuinely uses different `var(--...)` references than the corresponding light row.

*(When Light and Dark tables would list identical `var(--...)` cells, keep the matrix under **States (Light Theme)** only and use this pointer section instead of a second table.)*

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
  - Dual focus rings appear on `focus-visible` only (inner white gap + outer brand) — not on mouse focus
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
- **Menu item selection:** Clicking a menu item closes the dropdown menu but does NOT change the dropdown button label. The button label is controlled by the `label` prop and remains unchanged on selection. The `onSelect` callback is triggered to notify of the selection.

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

**Trigger content:**
- `label-only` (default): label + dropdown caret
- `with-leading-icon`: settings gear + label + dropdown caret
- `icon-only`: settings gear + dropdown caret

**State:**
- `default` (default)
- `hover`
- `press`
- `focus-visible`
- `disabled`

### Runtime API

**Compound children (Mode B — preferred anatomy):**
```tsx
<IdsDropdownButton>
  <IdsDropdownTrigger>{/* button | div | icon | any */}</IdsDropdownTrigger>
  <IdsDropdownMenu>
    <IdsDropdownMenuItem onSelect={…}>Option 1</IdsDropdownMenuItem>
    <IdsDropdownMenuItem>
      Nested parent
      <IdsDropdownMenu>
        <IdsDropdownMenuItem>Child</IdsDropdownMenuItem>
      </IdsDropdownMenu>
    </IdsDropdownMenuItem>
  </IdsDropdownMenu>
</IdsDropdownButton>
```

**Props (Mode A convenience + shared root):**
```typescript
interface IdsDropdownButtonProps {
  children?: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
  /** Mode A: synthesizes dropdown-menu when no IdsDropdownMenu child */
  items?: IdsDropdownButtonItem[];
  onSelect?: (item: IdsDropdownButtonItem) => void;
  /** Mode A: synthesizes trigger-slot when no IdsDropdownTrigger child */
  label?: string;
  buttonStyle?: 'primary' | 'secondary' | 'tertiary';
  size?: 'small' | 'medium' | 'large';
  icon?: React.ReactNode;
  iconOnly?: boolean;
  ariaLabel?: string;
}

interface IdsDropdownButtonItem {
  id: string;
  label: string;
  disabled?: boolean;
  icon?: React.ReactNode;
  /** Nested items → submenu under this row */
  children?: IdsDropdownButtonItem[];
}
```

**Events:**
- `onOpenChange`: Triggered when menu opens or closes
- `onSelect`: Mode A — item selected (leaf)
- `IdsDropdownMenuItem.onSelect`: Mode B — leaf item activated

### Composition API (Angular / contract mirror)

```text
ids-dropdown-button [buttonStyle?, size?, disabled?, open?, defaultOpen?]
  ids-dropdown-trigger [label?, iconOnly?, showLeadingIcon?, ariaLabel?]
  ids-dropdown-button-menu
    ids-dropdown-button-menu-item [value, label, disabled?]
    ids-dropdown-button-menu-item …
```

Projected children are the canonical Angular runtime API. Aggregate `items[]` remains a React Mode A convenience only.
Contract: `component-contracts/ids/dropdown-button.contract.ts`.

**Spec Accurate Design story defaults:**
- Root: `buttonStyle="primary"`, `size="medium"`, `disabled=false`
- Trigger: `label="Dropdown Button"`, `showLeadingIcon=false`, `iconOnly=false`
- Menu items: `Option 1`, `Option 2`, `Option 3`

## Codegen Contract (Framework-Agnostic Blueprint)

### Deterministic structure

```
IdsDropdownButton (`dropdown`)
├── IdsDropdownTrigger (`trigger-slot`)     — required (or Mode A label/icon synthesizes it)
│   └── any projected host (button | div | icon | …)
└── IdsDropdownMenu (`dropdown-menu`)       — required (or Mode A `items` synthesizes it)
    └── IdsDropdownMenuItem (`dropdown-menu-item`)*
        ├── item content (label / icon / …)
        └── IdsDropdownMenu?                — optional nested submenu
            └── IdsDropdownMenuItem*
```

**Required hierarchy rules:**
- Root owns open state; children must be `trigger-slot` then `dropdown-menu` (order in tree; portal may relocate popup DOM).
- `trigger-slot` is not required to be a native `<button>` — any focusable host is valid; when a single element is projected, trigger props merge onto it.
- `dropdown-menu` must be a separate popup (not nested inside the trigger host).
- Nesting rule: a `dropdown-menu` may appear only as a child of `dropdown` (root menu) or of `dropdown-menu-item` (submenu).
- Menu / items use ARIA roles `menu` / `menuitem` (submenu parents use submenu-trigger semantics).
- Decorative icons: `aria-hidden="true"`.
- **Popup style parity:** `dropdown-menu` MUST share Dropdown Combo Box detached popup tokens/classes (surface, full border, radius, shadow, `.item` row states) — do not invent a separate menu chrome.

### Variant matrix

| Prop | Values | Default | CSS class pattern |
|------|--------|---------|-------------------|
| buttonStyle | primary, secondary, tertiary | primary | `.dropdown-button--{style}` |
| size | small, medium, large | medium | `.dropdown-button--{size}` |
| showLeadingIcon | true, false | false | `.dropdown-button__trigger--with-icon` |
| iconOnly | true, false | false | `.dropdown-button--icon-only` |
| disabled | true, false | false | `.dropdown-button--disabled` |
| open | true, false | false | `.dropdown-button--open` |

### Per-slot style contract

**Trigger Button:**
- Must use semantic tokens for all colors, spacing, typography
- Border-radius: `var(--corner-radius-radius-2)` (all styles)
- Padding-x: `var(--padding-padding-16)`; padding-y: Small `var(--padding-padding-2)`, Medium `var(--padding-padding-6)`, Large `var(--padding-padding-10)`
- Focus: dual drop-shadow rings on `focus-visible` only (`scale-2` white gap + `scale-4` brand outer)
- Secondary/Tertiary **press** fill: `var(--color-background-brand-base)` (not text Button’s `controls-light`)
- React Mode A: compose `IdsButton`, then override Secondary/Tertiary press (+ icon press) to match this matrix

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
- Background: `var(--color-background-surface-component)`
- Border: `var(--border-width-border-default)` solid `var(--color-border-gray-neutral-base)` (full 4-sided; detached)
- Border-radius: `var(--dropdown-menu-radius)` (shared with combo-box detached popup)
- Box-shadow: shared combo-box menu shadow layers
- Position: Absolute / portaled below trigger (root) or to the side (submenu)
- Z-index: Higher than trigger
- **Style source:** `lib/react/ids/dropdown-shared/DropdownMenu.module.css` (`.popup` + `.popupStandalone` + `.item`)

**Menu Option:**
- Padding: `var(--padding-padding-10)` vertical, `var(--padding-padding-16)` horizontal (shared combo-box `.item`)
- Background: `var(--color-background-surface-component)` (default), `var(--color-background-brand-lighter-slate)` (hover / highlighted) with inset `var(--color-border-brand-base-neutral)` strokes
- Text: `var(--color-text-gray-neutral)` (default/hover), `var(--color-text-brand-strong)` (press / selected affordances per shared item contract)
- Cursor: Pointer (interactive), Not-allowed (disabled)

### Behavior contract

**Menu toggle:**
- Click on trigger button toggles `open` state
- Click outside menu closes it
- Escape key closes it
- Tab/Shift+Tab closes it
- Enter/Space on closed trigger opens the menu and focuses the first enabled item
- Arrow Down on closed trigger opens the menu and focuses the first enabled item
- Arrow Up on closed trigger opens the menu and focuses the last enabled item

**Menu navigation:**
- Arrow Down/Up moves focus between items
- Home/End jumps to first/last item
- Enter/Space on item selects it and closes menu

**Disabled state:**
- Trigger button is non-interactive
- Menu cannot be opened
- Visual opacity reduced via tokens

**Controlled vs uncontrolled:**
- If `open` input is provided, component is controlled
- If `open` is absent, component manages internal open state from `defaultOpen`
- `openChange` always reports requested state transitions
- `selectionChange` emits `{ value, label }` for the activated item

### Accessibility contract

**Required ARIA attributes:**
- Trigger button: `aria-haspopup="true"`, `aria-expanded={open}`, `aria-controls={menuId}`
- Menu: `role="menu"`, `aria-labelledby={buttonId}`
- Menu items: `role="menuitem"`, `aria-disabled={disabled}`
- Icon-only trigger: accessible name via `aria-label`

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
- If `label` is empty and `iconOnly` is false, render the caret-only text slot as empty but preserve trigger sizing
- If `iconOnly` is true, `ariaLabel` must provide the accessible name

**Empty items:**
- If no projected `ids-dropdown-button-menu-item` children exist, menu opens as an empty popup container with no synthetic placeholder row

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

**Examples / Composition Node:**
- Node ID: `41894:290670`
- Node name: Content (Dropdown Button examples)
- Node type: FRAME
- Documents: label-only / with-leading-icon / icon-only matrices + open-menu compositions (Primary Large ± icon, Secondary Small ± icon, Secondary icon-only Medium)
- URL: https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=41894-290670

**Button Instance Node (Primary, Medium, Default):**
- Node ID: `9662:26341`
- Node name: Button Style=Primary, State=Default, Size=Medium, Icon only button=No, Low res=No, Show Icon=No
- Node type: SYMBOL
- URL: https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=9662-26341

**Press / focus verification nodes (2026-10-12):**
- Secondary press: `9662:26326` → fill `var(--color-background-brand-base)`, icon `var(--color-icon-brand-stronger)`
- Tertiary hover / press / focus: `9662:26317` / `9662:26315` / `9662:26321`
- Primary focus / disabled: `9662:26343` / `9662:26335`
- Small padding: `9662:26308` → `Padding/padding-2`

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

**Menu Option Hover Node (shared with Dropdown Single-Select, no radio):**
- Node ID: `29377:159478`
- Node name: State=Hover, Type=Options, Show radio button=False
- Live evidence: Figma MCP `get_variable_defs` — fill `var(--color-background-brand-lighter-slate)`, text `var(--color-text-gray-neutral)`, stroke `var(--color-border-brand-base-neutral)`
- URL: https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=29377-159478

**Verification Method:**
- Method: Figma MCP
- Tools: get_design_context, get_metadata, get_variable_defs, get_screenshot
- Date: 2026-10-12
- Session: Dropdown Button Figma delta sync (trigger states, geometry, examples frame)

**Runtime contract path:**
- `component-contracts/ids/dropdown-button.contract.ts`

**Reference implementation path:**
- `lib/react/ids/dropdown-button/`
- `lib/angular/ids/dropdown-button/`

**Storybook:**
- React: `storybook/src/components/lib-generated/DropdownButton.stories.tsx`
- Angular: `storybook-angular/src/components/ids-dropdown-button/ids-dropdown-button.stories.js`

**Implementation notes:**
- React Mode A trigger composes `IdsButton` (inherits size padding, focus rings, Primary/Secondary/Tertiary default-hover-focus-disabled). Dropdown Button Secondary/Tertiary **press** overrides IdsButton to `var(--color-background-brand-base)` + `var(--color-icon-brand-stronger)` and keeps Secondary press border on `var(--color-border-brand-base)`.
- Angular trigger styles the control locally (`ids-dropdown-button-trigger.component.scss`) to the same state matrix.

**Supplemental Node IDs (for reference):**
- Button variants (all styles × sizes × states): Main frame `14737:165791` metadata
- Icon-only variants: 9662:26098 (primary), 9662:26087 (secondary), 9662:26076 (tertiary)
- With icon variant: 9662:26192
- Examples open-menu instances under `41894:290670`
