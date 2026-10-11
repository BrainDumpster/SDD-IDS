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
2. optional `Label` — the shared **Form Label** component (`IdsFormLabel`), which owns the label text, the optional `*` marker and the vertical padding: `size="lg"` for a large field (`var(--padding-padding-10)`), `size="md"` for a small one (`var(--padding-padding-6)`). The Time Picker contributes only a layout slot that stops the label shrinking or wrapping inside the root row.
3. `FieldGroup` — flex column, `gap: var(--spacing-space-4)` (4px), `isolate` (Figma "Date and time picker")
4. `FieldContainer` — text input + clock icon trigger (z-index: 2)
5. `TextInput` — editable time value or placeholder
6. `ClockIconTrigger` — tertiary icon-only `Button` with `time-clock-16` icon (opens/closes time popup)
7. `FormatHint` — always-visible format text directly below `FieldContainer` with **4px** gap (`var(--spacing-space-4)`); use `<span>` not `<p>` (no default paragraph margin); z-index: 1
8. optional `ValidationError` (`status-critical-square-solid` icon + error message)

### Time popup
9. `TimePopup` — floating panel below the field, right-aligned (`right: 0`)
10. `TimeColumn` × N — scroll columns for hour, minute, optional seconds, optional AM/PM
   - `PreviousButton` — up arrow (`arrow-tri-down-solid` rotated 180°, 10×10px); moves the column to the previous (earlier) value
   - `ScrollableValueList` — vertical list of selectable values
   - `ValueCell` — 32×32px cell (reuses date-cell geometry)
   - `NextButton` — down arrow (`arrow-tri-down-solid`, 10×10px); moves the column to the next (later) value

## Layout & Measurements

### Input field
- Field sizes:
  - `Large`: `40px` height
  - `Small`: `32px` height
- Field container: `padding-left: var(--padding-padding-16)`; no right padding (icon button provides trailing padding)
- Container flex: `align-items: center`, `justify-content: flex-end`, `gap: var(--spacing-space-none)` (0)
- Field container corner radius: `var(--time-picker-control-radius)` (IDS theme: square / `var(--corner-radius-radius-none)`)
- Clock icon button: trailing hit area, `align-self: stretch`, `margin: -1px -1px -1px 0` (overlaps field border). Hover fill + chrome: `border-radius: var(--time-picker-control-radius)` (IDS: square / `var(--corner-radius-radius-none)`; Figma Hover on icon `42159:132250`). Do **not** use `--button-control-radius` (Synapse 4px). Padding: `var(--padding-padding-12)` / `var(--padding-padding-16)` large; `var(--padding-padding-8)` / `var(--padding-padding-16)` small.
- Time popup shell: `border-radius: 0` (square corners)
- Field focus ring corner radius: `var(--time-picker-focus-ring-radius)` (`var(--corner-radius-radius-4)` in IDS theme)
- Input width: container-driven (`width: 100%`); text `flex: 1 0 0`, `min-width: 1px`; a value wider than the field is truncated with an ellipsis (`text-overflow: ellipsis`)
- Placeholder: Roboto Regular (400), 14px/20px, `var(--color-text-gray-disabled)`
- Filled value: Roboto Regular (400), 14px/20px, `var(--color-text-gray-neutral)` (#4d4d4d)
- Format hint: Roboto Regular (400), body-2, `var(--color-text-gray-neutral)`, always below field
- Root-to-hint gap: `var(--spacing-space-4)` (4px)
- Validation error row: `gap: var(--spacing-space-8)` between icon and message; icon `status-critical-square-solid` 16×16, `variant="img"`

### Time popup (`42159:132108`)
- Default behavior: portal the popup to `document.body` with `position: fixed` so it escapes ancestor `overflow: clip` / stacking contexts (e.g. DataGrid filter panels). Use `popupPortal` prop (`default: true`) to toggle.
- Positioned below the anchor field, right-aligned (`left = anchor.right - popupWidth`, `top = anchor.bottom - 1`), with 1px overlap on the field bottom edge. Falls back to opening above the field when viewport space is insufficient.
- Non-portaled fallback: `position: absolute`, `right: 0`, `top: 100%`, `margin-top: -1px`.
- When open: input border `var(--color-border-brand-base)`; popup full `1px` `var(--color-border-gray-neutral-base)` border on all sides
- Padding: `var(--padding-padding-16)` (16px). 24h (with or without seconds) uses `var(--padding-padding-16)` vertical / `var(--padding-padding-40)` horizontal, so the popup is as wide as the matching 12h one (Figma `42159:132126`, `42159:132109`)
- Column gap: `var(--spacing-space-16)` (16px) between columns
- Column width: `34px` for hour, minute and second; the AM/PM column hugs its `32px` cell
- Column internal gap (arrow ↔ value): `var(--spacing-space-16)` (16px)
- Value cell: `32×32px`, `border-radius: 2px`, inner padding `12px` horizontal / `8px` vertical
- Scroll area height (AM/PM column): `34px` visible window with overflow scroll
- Shadow: Shadow 4 — two layers; offset/blur/spread `var(--shadow-shadow-4-drop-shadow-4-{x,y,blur,spread})` and `var(--shadow-shadow-4-drop-shadow-8-{x,y,blur,spread})`, colors `var(--shadow-drop-shadow-4-color)` and `var(--shadow-drop-shadow-8-color)` (Figma variable names)

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
- `var(--color-background-surface-component)` — field background
- `var(--color-border-gray-neutral-base)` — default border
- `var(--color-border-gray-neutral-stronger)` — hover border (text field)
- `var(--color-border-brand-base)` — pointer-focus / open / selected border
- `var(--color-text-gray-neutral-strong)` — placeholder override when needed
- `var(--color-text-gray-neutral)` — filled value text
- `var(--color-text-gray-disabled)` — placeholder, disabled text
- `var(--color-background-gray-lighter)` — disabled field background (Figma `TimePicker-Main` disabled)
- `var(--color-border-gray-disabled)` — disabled border
- `var(--color-icon-brand-base)` — clock icon default
- `var(--color-icon-gray-disabled)` — clock icon disabled
- `var(--color-background-controls-lighter)` — icon hover bg; selected filled value highlight
- `var(--color-border-alerting-critical-base)` — error border
- `var(--color-text-alerting-critical-base)` — error message
- `var(--color-icon-alerting-critical-base)` — error icon (use `status-critical-square-solid` asset)

### Time popup
- `var(--color-background-surface-secondary)` — popup surface
- `var(--color-border-gray-neutral-base)` — popup border
- `var(--color-text-gray-neutral-strong)` — column value text
- `var(--color-icon-gray-neutral-base)` — column increment/decrement arrows

### Icons
- `time-clock-16` — 16×16px trailing trigger
- `arrow-tri-down-solid` — 10×10px column increment/decrement
- `status-critical-square-solid` — 16×16px error row

## States (Light Theme)

### Input field states

| State | Background | Border | Text | Icon | Notes |
|---|---|---|---|---|---|
| Default (empty) | `var(--color-background-surface-component)` | `var(--color-border-gray-neutral-base)` | `var(--color-text-gray-disabled)` (placeholder) | `var(--color-icon-brand-base)` | Format hint always visible |
| Default (filled) | `var(--color-background-surface-component)` | `var(--color-border-gray-neutral-base)` | `var(--color-text-gray-neutral)` Regular | `var(--color-icon-brand-base)` | Example value `09:30 PM` |
| Hover (text field) | `var(--color-background-surface-component)` | `var(--color-border-gray-neutral-stronger)` | (unchanged) | (unchanged) | Container border only |
| Hover on icon | `var(--color-background-surface-component)` | `var(--color-border-gray-neutral-base)` | (unchanged) | `var(--color-icon-brand-base)` | Icon: bg `var(--color-background-controls-lighter)`, border `var(--color-border-brand-base)` |
| Pointer-focused / Selected (empty) | `var(--color-background-surface-component)` | `var(--color-border-brand-base)` | — | `var(--color-icon-brand-base)` | Cursor in field; placeholder hidden on focus; **no** outer ring on click |
| Keyboard-focused on text field | `var(--color-background-surface-component)` | `var(--color-border-gray-neutral-base)` | (unchanged) | (unchanged) | Outer ring on container: `inset: -5px`, `1px solid var(--color-border-brand-base)`, `border-radius: 4px` (Figma) |
| Focused on icon | `var(--color-background-surface-component)` | `var(--color-border-gray-neutral-base)` | (unchanged) | (unchanged) | Ring on icon only: `inset: -3px`, `border-radius: 4px` |
| Disabled | `var(--color-background-gray-lighter)` | `var(--color-border-gray-disabled)` | filled value `var(--color-text-gray-neutral)`; placeholder `var(--color-text-gray-disabled)` | `var(--color-icon-gray-disabled)` | No hover on field or icon |
| Selected with dropdown | `var(--color-background-surface-component)` | `var(--color-border-brand-base)` | per content | `var(--color-icon-brand-base)` | Popup open; `margin-top: -1px` attaches popup to input; format hint stays below field |
| Selected (filled, editing) | `var(--color-background-surface-component)` | `var(--color-border-brand-base)` | `var(--color-text-gray-neutral)`; selected text on `var(--color-background-controls-lighter)` (`::selection`) | `var(--color-icon-brand-base)` | Selection is cleared when the clock button opens the popup, so the open state shows no highlight |
| Error | `var(--color-background-surface-component)` | `var(--color-border-alerting-critical-base)` | `var(--color-text-gray-neutral)` | `var(--color-icon-brand-base)` | Error row replaces format hint position in stack |

### Time column value cell states
| State | Background | Border | Text |
|---|---|---|---|
| Default | transparent | none | `var(--color-text-gray-neutral-strong)` |
| Selected (in scroll list) | transparent | none | `var(--color-text-gray-neutral-strong)` centered in 32×32 cell |

## States (Dark Theme)

Same semantic `var(--...)` tokens as **States (Light Theme)**. Resolved dark values live in `components/ids-theme.css` and `[data-theme="dark"]` / `.ids-theme-dark`. Duplicate a full Dark table only when a dark row uses different `var(--...)` than the corresponding light row.

## Interactions

### Input field
| Trigger | Action |
|---|---|
| Click clock icon (Choose Time button) | Toggle time popup. On open the columns show the time in the field — or the current time when the field is empty or not a valid time — and focus moves to the first popup control |
| Click/focus text input | Direct time typing; pointer focus → brand border, no ring. Never opens the popup |
| Type valid time | Update value; the popup opens at the typed time |
| Type invalid time | Error on blur |
| Tab | Focus input, then icon |
| Escape (popup open) | Close popup **without selecting a time**; return focus to the Choose Time (clock) button. The key stops there — an overlay hosting the picker (e.g. DataGrid filter menu) stays open until a second `Esc` |

### Time popup
| Trigger | Action |
|---|---|
| Click up arrow (Previous) | Move the column to its previous (earlier) value |
| Click down arrow (Next) | Move the column to its next (later) value |
| Scroll column list | Change hour/minute/seconds/period |
| Select value | Update pending time; may close on confirm (implementation) |
| Click outside | Close popup and keep the time shown in the columns |
| Click inside portaled popup | Value updates; `mousedown` is isolated so ancestor overlays (e.g. DataGrid filter menu) are not closed |

### Keyboard navigation
Source: IDS Design System website — Time Picker → **Keyboard Navigation**.

**Choose Time button (clock icon)**
- `Space` / `Enter`: open the time picker selector and move focus to the currently selected time (the time displayed in the input field). If there is no selected time, the selector opens at the current time.

**Time picker controls (popup open)**
- `Tab`: moves focus between tab stops. The time picker is a single tab stop; from the last tab stop, focus moves to the first (focus trap).
- `Shift+Tab`: moves focus to the previous tab stop; from the first tab stop, focus moves to the last.
- `Space` / `Enter`: on a Previous / Next button, moves the hour, minute or second up / down. On the AM/PM control, switches to the other period.
- `Esc`: closes the selector overlay without selecting a time and returns focus to the Choose Time button.

### Accessibility
- Input: native `<input type="text">` carrying an `id`. When `label` is set, Form Label's native `<label for>` names the field and no `aria-label` is set, so clicking the label focuses the input; `aria-label="Time"` is the fallback only when there is no visible label
- `required` sets `aria-required` on the input. The `*` marker is `aria-hidden`, so the requirement is announced once, by the control rather than by the label text
- `formatHint` / `errorMessage` are linked with `aria-describedby`, so the expected format is announced whether or not the field is empty
- Clock icon (Choose Time button): `aria-label="Open time picker"`, `aria-expanded`
- Popup: `role="dialog"`, `aria-modal="true"`, `aria-label="Choose time"`
- Columns: `role="group"` labelled `Hour` / `Minute` / `Second` / `AM or PM`, each with `Previous <column>` and `Next <column>` buttons
- Focus trap in popup while open; `Esc` returns focus to the Choose Time button
- One visually hidden `role="status"` region in the popup announces the **full** time after every change (e.g. `7:30 PM` → "seven thirty p m"), not only the column that moved; the value cells themselves are not live regions

### Behavior & guidelines
Source: IDS Design System website — Time Picker → **Behavior**.
- Users can enter times manually by typing in the text field, without using the selector.
- Only the Choose Time button opens the selector; it never launches automatically (focusing or typing in the input does not open it).
- The selector is a focus trap: while it is open the user only cycles through the time picker.
- The text field's accessible name states the purpose of the input (e.g. `Start Time`) — via the `label`, or the `aria-label` fallback.
- The helper text (`formatHint`) states the time format and is the input's description. It is customizable; the default follows Figma, `HH:MM AM/PM` (the guideline's `HH:MM TT` is the same pattern written generically).
- Screen readers announce the full time (e.g. 7:30pm as "seven thirty p m").
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
| `label` | `string` | — | Optional label, rendered by `IdsFormLabel` |
| `required` | `boolean` | `false` | Forwarded to `IdsFormLabel` as its `*` marker, and set as `aria-required` on the input |
| `id` | `string` | generated | Input `id`; the label's `htmlFor` points at it |
| `formatHint` | `string` | `'HH:MM AM/PM'` | Helper text below the field; the input's `aria-describedby` description |
| `clockType` | `'12h' \| '24h'` | `'12h'` | 12- or 24-hour dropdown |
| `showSeconds` | `boolean` | `false` | Show seconds column |
| `disabled` | `boolean` | `false` | Disable interactions |
| `error` | `boolean` | `false` | Error state |
| `errorMessage` | `string` | — | Error text |
| `open` | `boolean` | — | Controlled popup |
| `onOpenChange` | `(open: boolean) => void` | — | Popup visibility |
| `forceOpen` | `boolean` | — | Storybook/demo only |
| `popupPortal` | `boolean` | `true` | Render popup in `document.body` with fixed positioning to escape overflow containers |

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
├── Label?  (IdsFormLabel — size lg for large, md for small)
├── FieldContainer
│   ├── TextInput
│   └── ClockIconTrigger
├── FormatHint
├── ValidationError?
│   ├── ErrorIcon
│   └── ErrorMessage
└── TimePopup?
    ├── TimeColumn × N
    │   ├── PreviousButton
    │   ├── ScrollableValueList
    │   │   └── ValueCell × items
    │   └── NextButton
    └── TimeStatus  (visually hidden, role="status" — full time)
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
| `FieldContainer` | bg `var(--color-background-surface-component)`; border `1px solid var(--color-border-gray-neutral-base)`; no border-radius |
| `FieldContainer:hover` (not icon) | border `var(--color-border-gray-neutral-stronger)` |
| `FieldContainer:focus-within` (pointer) | border `var(--color-border-brand-base)`; no outline |
| `FieldContainer:focus-visible` (keyboard, not mouseActivated) | border `var(--color-border-gray-neutral-base)`; outline `1px solid var(--color-border-brand-base)`, offset `3px`, radius `3px` |
| `FieldContainer.open` | border `var(--color-border-brand-base)` |
| `FieldContainer.disabled` | bg `var(--color-background-gray-lighter)`; border `var(--color-border-gray-disabled)` |
| `FieldContainer.error` | border `var(--color-border-alerting-critical-base)` |
| `ClockIconTrigger` | icon `var(--color-icon-brand-base)`; transparent border default; hover bg `var(--color-background-controls-lighter)` + border `var(--color-border-brand-base)`; `border-radius: var(--time-picker-control-radius)` (IDS square) |
| `FormatHint` | `var(--color-text-gray-neutral)` body-2 regular |
| `TimePopup` | bg `var(--color-background-surface-secondary)`; border accessible; Shadow 4; padding 16px; right-aligned; `margin-top: -1px`; `border-radius: var(--corner-radius-radius-none)` |
| `ValueCell` | 32×32; text `var(--color-text-gray-neutral-strong)` 14px regular |

### Behavior contract
| Behavior | Rule |
|---|---|
| Popup open | Clock icon click or controlled `open`. Columns are seeded from the field's time on every open; current time when the field is empty or invalid |
| Popup close | Outside click (keeps the columns' time), Escape (discards it — no time is selected), or selection complete |
| Column previous / next | Wrap within valid range (1–12 or 0–23 hours, 0–59 minutes, AM/PM toggle) |
| Typing | Parse `timeFormat` / locale pattern; invalid → error on blur |
| `mouseActivated` | Suppress keyboard focus ring on pointer focus (same as Date Picker) |

### Accessibility contract
See **Interactions → Keyboard navigation** and **Interactions → Accessibility**. Minimum: dialog labeling, expanded on trigger, focus trap, Previous/Next column buttons, `Esc` closes without selecting and refocuses the Choose Time button, full-time `role="status"` announcement.

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
- [ ] Popup: accessible border, Shadow 4, right-aligned
- [ ] 12h dropdown: hour + minute + AM/PM columns
- [ ] 24h dropdown: hour + minute (optional seconds)
- [ ] Error row: 8px gap, critical icon + message
- [ ] Spec Accurate Design story under `Spec Generated/IDS/Time Picker`
- [ ] Theme: `components/ids-theme.css` imported in stories

## Source Mapping

| Figma node | Description | Usage |
|---|---|---|
| `42159:132203` | `TimePicker-Main` | Full state × size matrix |
| `42159:132250` | `TimePicker-Main` — Hover on icon | Clock hit-area hover fill; square IDS radius (`42159:132255`) |
| `42159:132108` | `TimePicker-Element-Dropdown` | Popup columns, 12h/24h, seconds variants |
| `42159:132173` | Dropdown 12h HH:MM | Default open popup layout |
| `42159:132126` | Dropdown 24h HH:MM | Two-column layout |
| `44484:668` | `time-clock-16` | Trailing icon |
| `44484:602` | `arrow-tri-down-solid` | Column arrows |
| `44484:558` | `status-critical-square-solid` | Error icon |
| `9662:25120` | `Button` | Icon hit-area pattern |

**Verification:** Figma MCP `get_design_context` on `42159:132203` and `42159:132108`, file `0bHk3XhrjFhowgFkz9yLr4`, session 2026-05-26.

**Behavior source:** IDS Design System website — Time Picker page, sections **Keyboard Navigation** (Choose Time Button, Time Picker: Controls) and **Behavior**. It is authoritative for interaction and accessibility; Figma is authoritative for visuals and tokens.

| Runtime path | Role |
|---|---|
| `lib/react/ids/time-picker/` | React reference implementation |
| `lib/react/ids/form-label/` | Shared label consumed by the Time Picker (`IdsFormLabel`) |
| `lib/angular/ids/time-picker/` | Angular implementation (parity with React) |
| `storybook-angular/src/components/ids-time-picker/` | Angular Spec Generated stories |
| `components/ids/date-and-time-picker/design-spec.md` | Family map entry (Date and Time Picker) |

## Implementation Notes
Last updated: 2026-10-11

- **Font-weight:** all text elements use `400`.
- **Label component:** the label is the shared `IdsFormLabel`, not local markup. The Time Picker maps its own `size` to Form Label's: `large` → `lg`, `small` → `md` (**not** `sm` — `md` is the size whose `padding-block` matches a 32px field).
- **Required indicator:** `required?: boolean` is forwarded to `IdsFormLabel`, which renders the `*` in `var(--color-text-gray-neutral-strong)` — the same colour as the label text. This replaces the earlier red `var(--color-text-alerting-critical-base)`; Form Label's spec states the marker is deliberately not a critical token, and that spec wins so the two components agree.
- **Label layout:** the label is optional; when present it sits to the left of the field (root is a `row` with gap 16px). The local `.label` class is now only a layout slot (`flex-shrink: 0`, `white-space: nowrap`); typography and padding come from Form Label.
- **Clock button:** trailing native icon button (same pattern as Date Picker calendar trigger). Hover fill uses `var(--time-picker-control-radius)` — square in IDS (Figma `42159:132250`). Not `--button-control-radius`.
- **Field border:** keeps the accessible border when the clock button is hovered/focused.
- **Text selection:** selected text uses `var(--color-background-controls-lighter)` with `var(--color-text-gray-neutral)` text (Figma "Selected"); the selection is cleared when the clock button opens the popup ("Selected with time picker dropdown" shows no highlight).
- **Column arrows:** use `var(--color-icon-gray-neutral-base)`.
- **Time popup:** border-radius is `0` (square corners).

**2026-08-09**

**Portal / DataGrid filter-menu fix**
- `IdsTimePicker.tsx`: time popup uses `createPortal` to `document.body`.
- Enable `popupPortal` (default `true`) so the popup escapes ancestor `overflow: clip` / stacking contexts (e.g. DataGrid filter panels).
- Add `e.stopPropagation()` on `mousedown`/`pointerdown` so selecting a time does not close the parent filter menu.

**2026-10-05**

**React library parity (`lib/react/ids/time-picker`)**
- Ported `popupPortal` (default `true`): time popup is portaled to `document.body` with fixed positioning (`.timePopupPortaled`), flips above when viewport space is insufficient, and isolates `mousedown` so DataGrid filter menus stay open. `.fieldGroup` uses `flex: 1 0 0` / `min-width: 1px`; `.fieldContainer` uses `width: 100%`.

**2026-10-11**

**Keyboard & behavior aligned with the IDS website guidelines**
- `Esc` closes the selector without selecting a time: the field and `onChange` are left untouched, and focus returns to the Choose Time (clock) button. The keydown's propagation is stopped, so a hosting overlay (DataGrid filter menu, which listens on `window`) closes only on a second `Esc`. Clicking outside still keeps the time shown in the columns.
- Every time the selector opens, its columns are seeded from the field — a typed time included, in controlled and uncontrolled use alike. An empty or invalid field opens at the current time (seconds only when `showSeconds`).
- Column arrows are Previous (up, earlier value) and Next (down, later value).
- `formatHint` stays the input's `aria-describedby` description; its default is the Figma text `HH:MM AM/PM` (customizable).
- `placeholder` defaults to `HH:MM AM/PM`, so an empty field shows the expected format. This is intentional even though the Figma component's placeholder slot is off by default.
- The popup holds one visually hidden `role="status"` region with the formatted time, so screen readers announce the full time after each change; the per-column value cells are not live regions.
- Applies to `lib/react/ids/time-picker/` and the `storybook/src/components/IdsTimePicker.tsx` hand-port. `lib/angular/ids/time-picker/` is not yet aligned (Previous/Next, focus trap, `Esc` behavior, Form Label).

**Figma alignment (`TimePicker-Main` `42159:132203`, `TimePicker-Element-Dropdown` `42159:132108`)**
- Hovering the text field sets the border to `var(--color-border-gray-neutral-stronger)`.
- Selected input text is highlighted with `var(--color-background-controls-lighter)` and keeps `var(--color-text-gray-neutral)` text. Opening the popup from the clock button clears the selection, so the open state shows no highlight.
- Filled value text stays `var(--color-text-gray-neutral)` in the Disabled and Error states.
- Popup shadow is the Shadow 4 effect: `--shadow-shadow-4-drop-shadow-{4,8}-{x,y,blur,spread}` with colors `--shadow-drop-shadow-4-color` / `--shadow-drop-shadow-8-color`, as named in Figma.
- Popup padding is 16px / 40px for every 24h variant, seconds included; the AM/PM column is 32px wide; a value too long for the field ends in an ellipsis.
- CSS draws the 1px border outside the padding, while Figma strokes sit inside the frame. Field text and popup content therefore sit 1px further in and the popup is 2px wider than in Figma — the same convention the Date Picker field and calendar popup use.
