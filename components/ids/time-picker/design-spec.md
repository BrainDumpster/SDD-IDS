<!-- ds:inherits root-spec -->
# Time Picker Design Spec

## Metadata
- **Storybook path:** `storybook-generated/ids/src/components/TimePicker.stories.tsx`
- **Deterministic generator:** `generation/deterministic_storybook/ids/time_picker.py`
- Component: Time Picker
- Design System: IDS
- Category: Form Elements
- Version: 1.0.0
- Description: Form control for selecting a time of day via text input and scroll-column dropdown (12h/24h, optional seconds).
- Status: draft
- Created: 2026-05-26
- Updated: 2026-07-16
- Figma design (overview): `https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=42159-132203&m=dev`
- File key: `0bHk3XhrjFhowgFkz9yLr4`
- Primary node: `42159:132203` (`TimePicker-Main` — states × sizes matrix)
- Element nodes:
  - Time dropdown: `42159:132108` (`TimePicker-Element-Dropdown` — 12h/24h × seconds variants)
- Storybook examples requested: yes
- Storybook path: `storybook-generated/ids/src/components/TimePicker.stories.tsx`
- Storybook title: `Spec Generated/IDS/Time Picker`
- Verification method: Figma MCP (`get_design_context`)
- Last verified: 2026-05-26

## Anatomy

### Input field
1. `TimePickerRoot` — flex row, `gap: 16px` between `Label` and field group
2. optional `Label` — flex row with `labelInner` wrapper containing `labelText` and optional `labelRequired` asterisk; padding: `var(--padding-padding-10)` vertical for large, `var(--padding-padding-6)` for small
3. `FieldGroup` — flex column, `gap: var(--spacing-space-4)` (4px), `isolate` (Figma "Date and time picker")
4. `FieldContainer` — text input + clock icon trigger (z-index: 2)
5. `TextInput` — editable time value or placeholder
6. `ClockIconTrigger` — tertiary icon-only `Button` with `time-clock-16` icon (opens/closes time popup)
7. `FormatHint` — always-visible format text directly below `FieldContainer` with **4px** gap (`var(--spacing-space-4)`); use `<span>` not `<p>` (no default paragraph margin); z-index: 1
8. optional `ValidationError` (`status-critical-square-solid` icon + error message)

### Time popup
9. `TimePopup` — floating panel below the field, right-aligned (`right: 0`)
10. `TimeColumn` × N — scroll columns for hour, minute, optional seconds, optional AM/PM
   - `IncrementButton` — up arrow (`arrow-tri-down-solid` rotated 180°, 10×10px)
   - `ScrollableValueList` — vertical list of selectable values
   - `ValueCell` — 32×32px cell (reuses date-cell geometry)
   - `DecrementButton` — down arrow (`arrow-tri-down-solid`, 10×10px)

## Layout & Measurements

### Input field
- Field sizes:
  - `Large`: `40px` height
  - `Small`: `32px` height
- Field container: `padding-left: var(--padding-padding-16)`; no right padding (icon button provides trailing padding)
- Container flex: `align-items: center`, `justify-content: flex-end`, `gap: var(--spacing-space-none)` (0)
- Field container corner radius: `var(--time-picker-control-radius)` (IDS theme: square / `var(--corner-radius-radius-none)`)
- Clock icon button: render as `Button` `variant="tertiary"` `iconOnly`; size: `lg` for large time picker, `md` for small time picker (icon button has no small size); `margin: -1px -1px -1px 0` to overlap input field border
- Time popup shell: `border-radius: 0` (square corners)
- Field focus ring corner radius: `var(--time-picker-focus-ring-radius)` (`var(--corner-radius-radius-4)` in IDS theme)
- Input width: container-driven (`width: 100%`); text `flex: 1 0 0`, `min-width: 1px`
- Placeholder: Roboto Regular (400), 14px/20px, `var(--color-text-disabled)`
- Filled value: Roboto Regular (400), 14px/20px, `var(--color-text-neutral)` (#4d4d4d)
- Format hint: Roboto Regular (400), body-2, `var(--color-text-neutral)`, always below field
- Root-to-hint gap: `var(--spacing-space-4)` (4px)
- Validation error row: `gap: var(--spacing-space-8)` between icon and message; icon `status-critical-square-solid` 16×16, `variant="img"`

### Time popup (`42159:132108`)
- Position: `absolute`, `right: 0`, `top: 100%`, `margin-top: -1px` (attached to input — 1px overlap with field bottom edge)
- When open: input border `var(--color-border-brand-base)`; popup full `1px` `var(--color-border-accessible)` border on all sides
- Padding: `var(--padding-padding-16)` (16px); 24h-only layout may use `px: var(--padding-padding-40)` per Figma variant
- Column gap: `var(--spacing-space-16)` (16px) between columns
- Column width: `34px` per column
- Column internal gap (arrow ↔ value): `var(--spacing-space-16)` (16px)
- Value cell: `32×32px`, `border-radius: 2px`, inner padding `12px` horizontal / `8px` vertical
- Scroll area height (AM/PM column): `34px` visible window with overflow scroll
- Shadow: Shadow 2 — `var(--shadow-shadow-4-drop-shadow-4-*)` + `var(--shadow-shadow-4-drop-shadow-8-*)` layers

### Dropdown variant matrix (element node)
| `clockType` | `showSeconds` | Columns |
|---|---|---|
| `12 hour` | `false` | Hour, Minute, AM/PM |
| `12 hour` | `true` | Hour, Minute, Seconds, AM/PM |
| `24 hour` | `false` | Hour (0–23), Minute |
| `24 hour` | `true` | Hour, Minute, Seconds |

## Tokens

### Layout aliases (theme-resolvable)

| Alias | IDS default (`components/ids-theme.css`) |
|---|---|
| `--time-picker-control-radius` | `var(--corner-radius-radius-none)` |
| `--time-picker-focus-ring-radius` | `var(--corner-radius-radius-4)` |

### Input field
- `var(--color-background-component)` — field background
- `var(--color-border-accessible)` — default border
- `var(--color-border-strong)` — hover border (text field)
- `var(--color-border-brand-base)` — pointer-focus / open / selected border
- `var(--color-text-neutral-strong)` — placeholder override when needed
- `var(--color-text-neutral)` — filled value text
- `var(--color-text-disabled)` — placeholder, disabled text
- `var(--color-background-gray-lighter)` — disabled field background (Figma `TimePicker-Main` disabled)
- `var(--color-border-disabled)` — disabled border
- `var(--color-icon-brand-base)` — clock icon default
- `var(--color-icon-disabled)` — clock icon disabled
- `var(--color-background-controls-brand-lighter)` — icon hover bg; selected filled value highlight
- `var(--color-border-alerting-critical-base)` — error border
- `var(--color-text-critical)` — error message
- `var(--color-icon-alerting-critical)` — error icon (use `status-critical-square-solid` asset)

### Time popup
- `var(--color-background-surface-2)` — popup surface
- `var(--color-border-accessible)` — popup border
- `var(--color-text-neutral-strong)` — column value text
- `var(--color-icon-neutral)` — column increment/decrement arrows

### Icons
- `time-clock-16` — 16×16px trailing trigger
- `arrow-tri-down-solid` — 10×10px column increment/decrement
- `status-critical-square-solid` — 16×16px error row

## States (Light Theme)

### Input field states

| State | Background | Border | Text | Icon | Notes |
|---|---|---|---|---|---|
| Default (empty) | `var(--color-background-component)` | `var(--color-border-accessible)` | `var(--color-text-disabled)` (placeholder) | `var(--color-icon-brand-base)` | Format hint always visible |
| Default (filled) | `var(--color-background-component)` | `var(--color-border-accessible)` | `var(--color-text-neutral)` Regular | `var(--color-icon-brand-base)` | Example value `09:30 PM` |
| Hover (text field) | `var(--color-background-component)` | `var(--color-border-strong)` | (unchanged) | (unchanged) | Container border only |
| Hover on icon | `var(--color-background-component)` | `var(--color-border-accessible)` | (unchanged) | `var(--color-icon-brand-base)` | Icon: bg `var(--color-background-controls-brand-lighter)`, border `var(--color-border-brand-base)` |
| Pointer-focused / Selected (empty) | `var(--color-background-component)` | `var(--color-border-brand-base)` | — | `var(--color-icon-brand-base)` | Cursor in field; placeholder hidden on focus; **no** outer ring on click |
| Keyboard-focused on text field | `var(--color-background-component)` | `var(--color-border-accessible)` | (unchanged) | (unchanged) | Outer ring on container: `inset: -5px`, `1px solid var(--color-border-brand-base)`, `border-radius: 4px` (Figma) |
| Focused on icon | `var(--color-background-component)` | `var(--color-border-accessible)` | (unchanged) | (unchanged) | Ring on icon only: `inset: -3px`, `border-radius: 4px` |
| Disabled | `var(--color-background-gray-lighter)` | `var(--color-border-disabled)` | `var(--color-text-disabled)` | `var(--color-icon-disabled)` | No hover on field or icon |
| Selected with dropdown | `var(--color-background-component)` | `var(--color-border-brand-base)` | per content | `var(--color-icon-brand-base)` | Popup open; `margin-top: -1px` attaches popup to input; format hint stays below field |
| Selected (filled, editing) | `var(--color-background-component)` | `var(--color-border-brand-base)` | value on `var(--color-background-controls-brand-lighter)` | `var(--color-icon-brand-base)` | Text selection background: transparent (no highlight); clear selection on button click |
| Error | `var(--color-background-component)` | `var(--color-border-alerting-critical-base)` | `var(--color-text-neutral-strong)` | `var(--color-icon-brand-base)` | Error row replaces format hint position in stack |

### Time column value cell states
| State | Background | Border | Text |
|---|---|---|---|
| Default | transparent | none | `var(--color-text-neutral-strong)` |
| Selected (in scroll list) | transparent | none | `var(--color-text-neutral-strong)` centered in 32×32 cell |

## States (Dark Theme)

Same semantic `var(--...)` tokens as **States (Light Theme)**. Resolved dark values live in `components/ids-theme.css` and `[data-theme="dark"]` / `.ids-theme-dark`. Duplicate a full Dark table only when a dark row uses different `var(--...)` than the corresponding light row.

## Interactions

### Input field
| Trigger | Action |
|---|---|
| Click clock icon | Toggle time popup |
| Click/focus text input | Direct time typing; pointer focus → brand border, no ring |
| Type valid time | Update value; optional auto-close |
| Type invalid time | Error on blur |
| Tab | Focus input, then icon |
| Escape (popup open) | Close popup; return focus to input |

### Time popup
| Trigger | Action |
|---|---|
| Click up/down arrows | Increment/decrement column value |
| Scroll column list | Change hour/minute/seconds/period |
| Select value | Update pending time; may close on confirm (implementation) |
| Click outside | Close popup |

### Keyboard navigation
- `Tab` / `Shift+Tab`: move between input, icon, column controls
- `Arrow Up/Down`: change focused column value
- `Enter`: confirm selection / close popup
- `Escape`: close popup

### Accessibility
- Input: native `<input type="text">` with `aria-label` or associated `<label>`
- Clock icon: `aria-label="Open time picker"`, `aria-expanded`
- Popup: `role="dialog"`, `aria-modal="true"`, `aria-label="Choose time"`
- Columns: `role="listbox"` / `role="option"` or spinbutton pattern per column
- Focus trap in popup while open; restore focus to input on close
- `aria-live="polite"` when value changes

### Behavior & guidelines
- Default format hint documents expected pattern (`HH:MM AM/PM` for 12h).
- 24h mode hides AM/PM column; seconds column optional via `showSeconds`.
- Do not use `data-state` for production; runtime interaction drives visuals.
- Pointer vs keyboard focus: match Date Picker family — click hides placeholder, no outline on click; keyboard shows outline.

## Composition & API (runtime)

### Variants
| Axis | Values |
|---|---|
| `size` | `large` (40px), `small` (32px) |
| `clockType` | `12h`, `24h` |
| `showSeconds` | `boolean` |
| `content` | `empty`, `filled` |

### Runtime API

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | `string \| null` | `null` | Display time (e.g. `09:30 PM`) |
| `onChange` | `(value: string \| null) => void` | — | Fired when time changes |
| `size` | `'large' \| 'small'` | `'large'` | Field height |
| `placeholder` | `string` | `'HH:MM AM/PM'` | Input placeholder |
| `label` | `string` | — | Optional label |
| `required` | `boolean` | `false` | Show required asterisk (`*`) after label text |
| `formatHint` | `string` | `'HH:MM AM/PM'` | Hint below field |
| `clockType` | `'12h' \| '24h'` | `'12h'` | 12- or 24-hour dropdown |
| `showSeconds` | `boolean` | `false` | Show seconds column |
| `disabled` | `boolean` | `false` | Disable interactions |
| `error` | `boolean` | `false` | Error state |
| `errorMessage` | `string` | — | Error text |
| `open` | `boolean` | — | Controlled popup |
| `onOpenChange` | `(open: boolean) => void` | — | Popup visibility |
| `forceOpen` | `boolean` | — | Storybook/demo only |

### Spec Accurate Design story defaults
- `size`: `large`
- `label`: `Time`
- `clockType`: `12h`
- `showSeconds`: `false`
- `value`: `09:30 PM`
- `formatHint`: `HH:MM AM/PM`
- Popup closed in primary story; use `forceOpen` variant story for open state

## Codegen Contract (Framework-Agnostic Blueprint)

### Deterministic structure
```
TimePickerRoot
├── Label?
├── FieldContainer
│   ├── TextInput
│   └── ClockIconTrigger
├── FormatHint
├── ValidationError?
│   ├── ErrorIcon
│   └── ErrorMessage
└── TimePopup?
    └── TimeColumn × N
        ├── IncrementButton
        ├── ScrollableValueList
        │   └── ValueCell × items
        └── DecrementButton
```

### Variant matrix
| `size` | `clockType` | `showSeconds` | Columns |
|---|---|---|---|
| large/small | 12h | false | hour, minute, period |
| large/small | 12h | true | hour, minute, second, period |
| large/small | 24h | false | hour, minute |
| large/small | 24h | true | hour, minute, second |

### Per-slot style contract
| Slot | Tokens / rules |
|---|---|
| `FieldContainer` | bg `var(--color-background-component)`; border `1px solid var(--color-border-accessible)`; no border-radius |
| `FieldContainer:hover` (not icon) | border `var(--color-border-strong)` |
| `FieldContainer:focus-within` (pointer) | border `var(--color-border-brand-base)`; no outline |
| `FieldContainer:focus-visible` (keyboard, not mouseActivated) | border `var(--color-border-accessible)`; outline `1px solid var(--color-border-brand-base)`, offset `3px`, radius `3px` |
| `FieldContainer.open` | border `var(--color-border-brand-base)` |
| `FieldContainer.disabled` | bg `var(--color-background-gray-lighter)`; border `var(--color-border-disabled)` |
| `FieldContainer.error` | border `var(--color-border-alerting-critical-base)` |
| `ClockIconTrigger` | icon `var(--color-icon-brand-base)`; transparent border default; hover brand-lighter + brand border |
| `FormatHint` | `var(--color-text-neutral)` body-2 regular |
| `TimePopup` | bg `var(--color-background-surface-2)`; border accessible; Shadow 2; padding 16px; right-aligned; `margin-top: -1px`; `border-radius: var(--time-picker-control-radius)` (bottom corners when attached) |
| `ValueCell` | 32×32; text `var(--color-text-neutral-strong)` 14px regular |

### Behavior contract
| Behavior | Rule |
|---|---|
| Popup open | Clock icon click or controlled `open` |
| Popup close | Outside click, Escape, or selection complete |
| Column increment | Wrap within valid range (1–12 or 0–23 hours, 0–59 minutes, AM/PM toggle) |
| Typing | Parse `timeFormat` / locale pattern; invalid → error on blur |
| `mouseActivated` | Suppress keyboard focus ring on pointer focus (same as Date Picker) |

### Accessibility contract
See **Interactions → Accessibility**. Minimum: dialog labeling, expanded on trigger, focus trap, keyboard column adjustment.

### Asset resolution + bundling contract
| Asset | Slug | Notes |
|---|---|---|
| Clock icon | `time-clock-16` | 16×16 via `Icon` |
| Column arrows | `arrow-tri-down-solid` | 10×10; rotate 180° for up |
| Error icon | `status-critical-square-solid` | `variant="img"` |

### Fallback/error rules
| Scenario | Behavior |
|---|---|
| Unknown `clockType` | Default `12h` |
| Unknown `size` | Default `large` |
| Invalid typed time | `error` on blur; retain last valid `value` |
| Missing `onChange` | Uncontrolled mode |
| `showSeconds` with `24h` | Show seconds column per matrix |

### Validation checklist
- [ ] Large (40px) and small (32px) field heights
- [ ] All input states match Figma `42159:132203` matrix
- [ ] Pointer focus: brand border, no outline, placeholder hidden
- [ ] Keyboard focus: accessible border + outer ring
- [ ] Disabled uses `var(--color-background-gray-lighter)`
- [ ] Popup: accessible border, Shadow 2, right-aligned
- [ ] 12h dropdown: hour + minute + AM/PM columns
- [ ] 24h dropdown: hour + minute (optional seconds)
- [ ] Error row: 8px gap, critical icon + message
- [ ] Spec Accurate Design story under `Spec Generated/IDS/Time Picker`
- [ ] Theme: `components/ids-theme.css` imported in stories

## Source Mapping

| Figma node | Description | Usage |
|---|---|---|
| `42159:132203` | `TimePicker-Main` | Full state × size matrix |
| `42159:132108` | `TimePicker-Element-Dropdown` | Popup columns, 12h/24h, seconds variants |
| `42159:132173` | Dropdown 12h HH:MM | Default open popup layout |
| `42159:132126` | Dropdown 24h HH:MM | Two-column layout |
| `44484:668` | `time-clock-16` | Trailing icon |
| `44484:602` | `arrow-tri-down-solid` | Column arrows |
| `44484:558` | `status-critical-square-solid` | Error icon |
| `9662:25120` | `Button` | Icon hit-area pattern |

**Verification:** Figma MCP `get_design_context` on `42159:132203` and `42159:132108`, file `0bHk3XhrjFhowgFkz9yLr4`, session 2026-05-26.

## Implementation Notes
Last updated: 2026-07-17

- **Font-weight:** all text elements use `400`.
- **Required indicator:** `required?: boolean` prop renders a `*` (`var(--color-text-critical)`) after the label.
- **Label layout:** the label is optional; when present it sits to the left of the field (root is a `row` with gap 16px).
- **Clock button:** shared tertiary `Button`, with a `-1px` margin so it overlaps the field border.
- **Field border:** keeps the accessible border when the clock button is hovered/focused.
- **Text selection:** input has no selection highlight; selection is cleared when opening the popup.
- **Column arrows:** use `var(--color-icon-neutral)`.
- **Time popup:** border-radius is `0` (square corners).
