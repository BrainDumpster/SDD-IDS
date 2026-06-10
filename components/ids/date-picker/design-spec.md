<!-- ds:inherits root-spec -->
# Date Picker Design Spec

## Metadata
- Component: Date Picker
- Design System: IDS
- Category: Form Elements
- Figma design (overview): `https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=42159-132058&m=dev`
- File key: `0bHk3XhrjFhowgFkz9yLr4`
- Primary node: `42159:132058` (overview — states & sizes for Date Picker and Time Picker)
- Element nodes:
  - Date cell: `42159:132767` (`.DatePicker-Element-Date`)
  - Range highlight: `42159:132639` (`.DatePicker-Element-Range`)
  - Calendar — Default: `42159:132612` (`DatePicker-Element-Calendar`, property `Default`)
  - Calendar — Selected: `42159:132585` (`DatePicker-Element-Calendar`, property `Default` with selected day)
  - Calendar — Range: `42159:132558` (`DatePicker-Element-Calendar`, range selection highlight)
  - Calendar — Month dropdown: `42159:132514` (`DatePicker-Element-Calendar`, property `Month Dropdown`)
  - Calendar — Year dropdown: `42159:132470` (`DatePicker-Element-Calendar`, property `Year Dropdown`)
- Verification method: Figma MCP (`get_design_context` + `get_metadata`)
- Last verified: 2026-05-26

## Anatomy

### Input field
1. `DatePickerRoot` — flex column, `gap: var(--spacing-space-4)` (4px), `items-start`, `isolate`
2. optional `Label`
3. `FieldContainer` — text input + calendar icon trigger (z-index: 2)
4. `TextInput` — editable date value or placeholder
5. `CalendarIconTrigger` — calendar icon button (opens/closes calendar popup)
6. `FormatHint` — always-visible date format text below the input (e.g. "MM-DD-YYYY"), z-index: 1
7. optional `ValidationError` (critical icon + error message)

### Calendar popup
8. `CalendarPopup` — floating panel anchored below the input field
9. `CalendarHeader`
   - `MonthDropdownButton` — displays current month with caret, opens month list
   - `YearDropdownButton` — displays current year with caret, opens year list
   - `PrevMonthButton` — `chev-left-thick` icon, navigates to previous month
   - `NextMonthButton` — `chev-right-thick` icon, navigates to next month
10. `WeekDayRow` — 7 column day-of-week abbreviation labels (Sun–Sat)
11. `DateGrid` — 7 columns × 6 rows of `DateCell` elements
12. `TodayLink` — text link to jump to current date

### Date cell
13. `DateCell` — single day cell (32×32px)
    - `DateCellContainer` — inner container with background/border
    - `DateLabel` — day number text
    - optional `TodayIndicator` — underline bar for "Today" type
    - optional `FocusRing` — outer focus indicator

### Range highlight
14. `RangeHighlightBar` — absolutely-positioned background bar behind contiguous selected date cells within a single week row
    - Positioned `absolute`, vertically centered (`top: 50%; transform: translateY(-50%)`)
    - Sits behind the date cells (lower z-index), providing the visual range indicator
    - Spans from start cell to end cell of the range within each row
    - For multi-row ranges, each row gets its own bar segment

### Month / Year dropdown overlays
15. `MonthDropdownList` — scrollable overlay list of month names
16. `YearDropdownList` — scrollable overlay list of year values

## Layout & Measurements

### Input field
- Field sizes:
  - `Large`: `40px` height
  - `Small`: `32px` height
- Field container: `padding-left: var(--padding-padding-16)`, no right padding — trailing padding belongs to the icon button
- Container flex: `align-items: center`, `justify-content: flex-end`, `gap: var(--spacing-space-none)` (0)
- Field container corner radius: `var(--date-picker-control-radius)` (IDS theme: square / `var(--corner-radius-radius-none)`)
- Calendar icon button: separate hit area spanning full field height, `padding: var(--padding-padding-12) var(--padding-padding-16)` (12px vertical, 16px horizontal), `border-radius: var(--date-picker-control-radius)`
- Field focus ring corner radius: `var(--date-picker-focus-ring-radius)` (`var(--corner-radius-radius-4)` in IDS theme)
- Input width: container-driven (`width: 100%`), text flex: `1 0 0`, `min-width: 1px`
- Placeholder font: Roboto Regular (400), 14px, `line-height: 20px`, `color: var(--color-text-disabled)` (#757575)
- Format hint: always shown below the input, Roboto Medium (500), `var(--font-size-body-2)` (14px), `var(--font-line-height-line-height-20)` (20px), `color: var(--color-text-neutral)` (#4d4d4d), `width: 100%`
- Root-to-hint gap: `var(--spacing-space-4)` (4px)
- Validation error row (Figma `42159:132988`): `gap: var(--spacing-space-4)` (4px) between field and error row; error row uses `gap: var(--spacing-space-8)` (8px) between `status-critical-square-solid` icon (16×16) and message text; message: Roboto Medium (500), body-2, `var(--color-text-critical)`

### Calendar popup
- Calendar popup: absolutely positioned below the input field, right-aligned with the input's right edge (`right: 0`)
- Calendar popup is a bordered box attached to the input: `margin-top: -1px` (1px overlap) so the input bottom border and popup top border read as one continuous edge; full border on all 4 sides of the popup panel
- When input is open, input border changes to `var(--color-border-brand-base)` (blue) — the calendar border stays `var(--color-border-accessible)` (gray)
- Calendar container padding: `var(--padding-padding-16)` (16px all sides)
- Calendar header width: `248px`
- Section gap (header → grid): `var(--spacing-space-16)` (16px)
- Date grid gap (between cells): `var(--spacing-space-4)` (4px)
- Date grid row gap: `var(--spacing-space-8)` (8px) between week rows
- Calendar border: `var(--border-width-border-default)` (1px) solid `var(--color-border-accessible)` (#757575)
- Calendar elevation: Shadow 2 — two-layer drop shadow:
  - `0px 4px 4px 0px rgba(37,37,37,0.08)` (`shadow-shadow-4-drop-shadow-4-*`)
  - `0px 8px 8px 0px rgba(37,37,37,0.08)` (`shadow-shadow-4-drop-shadow-8-*`)

### Date cell
- Cell outer size: `32×32px`
- Cell outer padding: `var(--padding-padding-1)` (1px)
- Inner container padding: `var(--padding-padding-12)` horizontal, `var(--padding-padding-8)` vertical (Default/Adjacent Month type)
- Today type inner padding: `var(--padding-padding-6)` all sides
- Cell border-radius: `2px` (`var(--corner-radius-radius-2)`)
- Focus ring offset: `-3px` from cell edge
- Focus ring border-radius: `4px` (`var(--corner-radius-radius-4)`)

### Today indicator
- Size: `18px` width × `2px` height
- Border-radius: `1px`
- Position: centered below day number

### Weekday labels
- Column width: `32px`
- Font: Regular, 12px, `line-height: 14px`, `letter-spacing: 0.36px`
- Horizontal padding: `5px`

### Range highlight bar
- Height: `30px`
- Border-radius: `2px`
- Background: `var(--color-background-brand-light)` (#d9eaf8)
- Positioned absolutely, vertically centered behind the date cell row (`top: 50%; transform: translateY(-50%)`)
- Width spans from the first selected cell edge to the last selected cell edge, inset by ~1px on the anchored end
- The row container (`position: relative`) holds 7 date cells in a flex row with `gap: var(--spacing-space-4)` (4px)

#### Range bar width formula
Each cell = 32px, gap = 4px. Bar width = `(selectedDays × 32) + ((selectedDays - 1) × 4) - 1px` (inset):

| selectedDays | Bar width (forward) | Bar width (reverse) |
|---|---|---|
| 0 | no bar | no bar |
| 2 | 66px | 66px |
| 3 | 102px | 102px |
| 4 | 138px | 138px |
| 5 | 175px | 174px |
| 6 | 211px | 210px |
| 7 | 247px | 246px |

#### Forward selection (`reverseSelection = false`)
- Bar anchors at `left: 0` (or `left: 1px` for ≤4 days)
- The **last** cell in the range carries the `Selected` state (blue bg, white text)
- Pattern: start date is fixed at row start; selected date extends rightward

#### Reverse selection (`reverseSelection = true`)
- Bar anchors at `right: 1px` (for ≤6 days) or `left: 1px` (for 7 days full row)
- The **first** cell in the range carries the `Selected` state (blue bg, white text)
- Pattern: end date is fixed at row end; selected date extends leftward

#### Selected cell in range
- Only the anchor cell (the date the user clicked last) gets `Selected` styling
- All other cells within the range remain default text on the highlight bar background
- Selected cell: `bg: var(--color-background-controls-brand-base)`, `border: 1px solid var(--color-border-brand-base)`, `color: var(--color-text-white)`
- Non-selected cells in range: `color: var(--color-text-neutral-strong)` (default, no background change on cell itself — bar behind provides the visual)

### Month / Year dropdown overlay
- Verified against Figma node `42159:132514` (Month Dropdown) and `42159:132470` (Year Dropdown)
- Verified against Figma node `42159:132520` (month dropdown) — same styling applies to year dropdown
- Left-aligned with the triggering dropdown button (`left: 0`)
- Positioned directly below the trigger button (`top: 100%`)
- Width: `114px` fixed
- Max height: `200px`, scrollable (`overflow-y: auto`, `overflow-x: hidden`)
- Background: `white`
- Border: `var(--border-width-border-default)` (1px) solid `#eaeaea` (gray-200)
- Shadow: `0px 2px 5px 0px rgba(37,37,37,0.08)`
- Container padding: `var(--padding-padding-4)` (4px) vertical, `var(--padding-padding-1)` (1px) horizontal
- Option row:
  - Padding: `var(--padding-padding-6)` (6px) vertical, `var(--padding-padding-16)` (16px) horizontal
  - Text: Roboto Medium (500) 14px/20px, `var(--color-text-neutral)` (#4d4d4d)
  - No border on options, `border-radius: 0`
- Selected option: background `var(--color-background-controls-brand-lighter)` (#ebf4fb), text Roboto Regular (400) 14px/20px, `var(--color-text-neutral-strong)` (#252525)
- Hover option: background `var(--color-background-controls-brand-lighter)` (#ebf4fb)

## Tokens

### Layout aliases (theme-resolvable)

| Alias | IDS default (`components/ids-theme.css`) |
|---|---|
| `--date-picker-control-radius` | `var(--corner-radius-radius-none)` |
| `--date-picker-focus-ring-radius` | `var(--corner-radius-radius-4)` |

### Input field
- `var(--color-background-component)` — field background
- `var(--color-border-accessible)` — default border (1px)
- `var(--color-border-strong)` — hover border
- `var(--color-border-brand-base)` — focus border
- `var(--color-text-neutral-strong)` — filled value text
- `var(--color-text-disabled)` — placeholder text (#757575)
- `var(--color-text-disabled)` — disabled text
- `var(--color-background-gray-light)` — disabled background
- `var(--color-border-disabled)` — disabled border
- `var(--color-icon-brand-base)` — calendar icon default
- `var(--color-icon-disabled)` — calendar icon disabled
- `var(--color-border-alerting-critical-base)` — error border
- `var(--color-icon-alerting-critical)` — error icon
- `var(--color-text-critical)` — error message text

### Calendar popup
- `var(--color-background-surface-2)` — calendar surface (white)
- `var(--color-border-accessible)` — calendar border (#757575)
- `var(--border-width-border-default)` — border width (1px)

### Calendar header
- `var(--color-text-brand-strong)` — month/year dropdown text (#0062ab)
- `var(--font-size-body-2)` — 14px
- `var(--font-line-height-line-height-20)` — 20px
- `var(--typography-font-style-primary)` — Roboto, Medium weight
- `var(--padding-padding-8)` — month button horizontal padding
- `var(--padding-padding-16)` — year button horizontal padding
- `var(--padding-padding-2)` — button vertical padding
- `var(--spacing-space-8)` — gap between button text and caret icon
- `var(--spacing-space-20)` — gap between prev/next chevrons

### Calendar shadow (Shadow 4 stack)
- Layer 1: `var(--shadow-shadow-4-drop-shadow-4-x)` (0), `var(--shadow-shadow-4-drop-shadow-4-y)` (4px), `var(--shadow-shadow-4-drop-shadow-4-blur)` (4px), `var(--shadow-shadow-4-drop-shadow-4-spread)` (0), `var(--shadow-shadow-4-drop-shadow-4-color)` (rgba(37,37,37,0.08))
- Layer 2: `var(--shadow-shadow-4-drop-shadow-8-x)` (0), `var(--shadow-shadow-4-drop-shadow-8-y)` (8px), `var(--shadow-shadow-4-drop-shadow-8-blur)` (8px), `var(--shadow-shadow-4-drop-shadow-8-spread)` (0), `var(--shadow-shadow-4-drop-shadow-8-color)` (rgba(37,37,37,0.08))

### Date cell
- `var(--color-text-neutral-strong)` — default date text (#252525)
- `var(--color-text-disabled)` — adjacent month date text (#757575)
- `var(--color-text-neutral)` — adjacent month pressed text (#4d4d4d)
- `var(--color-text-white)` — selected date text (white)
- `var(--color-background-controls-brand-lighter)` — hover background (#ebf4fb)
- `var(--color-background-controls-brand-light)` — press background (#d9eaf8)
- `var(--color-background-controls-brand-base)` — selected background (#0076ce)
- `var(--color-border-brand-base)` — selected border + focus ring (#0076ce)
- `var(--color-background-gray-lighter)` — unavailable background (#f4f4f4)
- `var(--color-border-disabled)` — unavailable border (#757575)

### Today indicator
- `var(--color-border-strong)` — default underline (#252525)
- `var(--color-border-white)` — selected underline (white)
- `var(--color-border-disabled)` — unavailable underline (#757575)

### Range highlight
- `var(--color-background-brand-light)` — range bar (#d9eaf8)

### Weekday labels
- `var(--color-text-neutral)` — weekday abbreviation text (#4d4d4d)

### Month / Year dropdown
- Surface: `white`
- Border: `var(--ui-palette-gray-200)` (#eaeaea) or `var(--color-border-accessible)`
- Option text: `var(--ui-palette-gray-700)` (#4d4d4d), Medium weight
- Selected option background: `var(--color-background-brand-lighter)` (#ebf4fb)
- Selected option text: `var(--ui-palette-gray-900)` (#252525), Regular weight

### Icons
- `arrow-drop-tri-caret` — 10×10px, caret for month/year dropdowns
- `chev-left-thick` — 12×12px, previous month navigation
- `chev-right-thick` — 12×12px, next month navigation
- Calendar icon — trailing icon in the input field

## States (Light Theme)

### Input field states

| State | Background | Border | Text | Icon | Notes |
|---|---|---|---|---|---|
| Default (empty) | `var(--color-background-component)` | `var(--color-border-accessible)` | `var(--color-text-disabled)` (placeholder) | `var(--color-icon-brand-base)` | — |
| Default (filled) | `var(--color-background-component)` | `var(--color-border-accessible)` | `var(--color-text-neutral-strong)` | `var(--color-icon-brand-base)` | — |
| Hover (text field) | `var(--color-background-component)` | `var(--color-border-strong)` | (unchanged) | `var(--color-icon-brand-base)` (unchanged) | Container border darkens; icon button unchanged |
| Hover on icon | `var(--color-background-component)` | `var(--color-border-accessible)` (unchanged) | (unchanged) | `var(--color-icon-brand-base)` | Icon button: bg `var(--color-background-controls-brand-lighter)`, border `var(--color-border-brand-base)` 1px; container border stays default |
| Pointer-focused / Selected (Figma `42159:133061`) | `var(--color-background-component)` | `var(--color-border-brand-base)` | `var(--color-text-neutral-strong)` | `var(--color-icon-brand-base)` | Click-focus: blue border, no focus ring, placeholder hidden (`:focus::placeholder { color: transparent }`) |
| Keyboard-focused on text field | `var(--color-background-component)` | `var(--color-border-accessible)` (unchanged) | `var(--color-text-neutral-strong)` | `var(--color-icon-brand-base)` | Outer focus ring 3px outside container border: `1px solid var(--color-border-brand-base)` (inside stroke), `border-radius: 4px` (`:focus-visible`) |
| Focused on icon | `var(--color-background-component)` | `var(--color-border-accessible)` (unchanged) | (unchanged) | `var(--color-icon-brand-base)` | Focus ring on **icon button only**: `inset: -3px`, `1px solid var(--color-border-brand-base)` (inside stroke), `border-radius: 4px`, `box-sizing: border-box` |
| Disabled | `var(--color-background-gray-light)` | `var(--color-border-disabled)` | `var(--color-text-disabled)` | `var(--color-icon-disabled)` | Non-interactive; hover on icon must NOT apply; hover on field must NOT change border |
| Selected with dropdown | `var(--color-background-component)` | `var(--color-border-brand-base)` | `var(--color-text-neutral-strong)` | `var(--color-icon-brand-base)` | Calendar popup open; popup `margin-top: -1px` attaches to input; format hint remains below the field |
| Selected | `var(--color-background-component)` | `var(--color-border-accessible)` | `var(--color-text-neutral-strong)` | `var(--color-icon-brand-base)` | Date chosen, popup closed |
| Error | `var(--color-background-component)` | `var(--color-border-alerting-critical-base)` | `var(--color-text-neutral-strong)` | `var(--color-icon-alerting-critical)` | Error icon + message shown |

### Date cell states

| Type | State | Background | Border | Text | Today indicator |
|---|---|---|---|---|---|
| Default | Default | transparent | none | `var(--color-text-neutral-strong)` | — |
| Default | Hover | `var(--color-background-controls-brand-lighter)` | none | `var(--color-text-neutral-strong)` | — |
| Default | Press | `var(--color-background-controls-brand-light)` | none | `var(--color-text-neutral-strong)` | — |
| Default | Focus | transparent | `var(--color-border-brand-base)` 1px, -3px offset, 4px radius | `var(--color-text-neutral-strong)` | — |
| Default | Selected | `var(--color-background-controls-brand-base)` | `var(--color-border-brand-base)` 1px | `var(--color-text-white)` | — |
| Default | Selected + Focused | `var(--color-background-controls-brand-base)` | `var(--color-border-brand-base)` 1px + focus ring | `var(--color-text-white)` | — |
| Default | Unavailable | `var(--color-background-gray-lighter)` | `var(--color-border-disabled)` 1px | `var(--color-text-disabled)` strikethrough | — |
| Adjacent Month | Default | transparent | none | `var(--color-text-disabled)` | — |
| Adjacent Month | Hover | `var(--color-background-controls-brand-lighter)` | none | `var(--color-text-disabled)` | — |
| Adjacent Month | Press | `var(--color-background-controls-brand-light)` | none | `var(--color-text-neutral)` | — |
| Adjacent Month | Focus | transparent | `var(--color-border-brand-base)` focus ring | `var(--color-text-disabled)` | — |
| Adjacent Month | Selected | `var(--color-background-controls-brand-base)` | `var(--color-border-brand-base)` 1px | `var(--color-text-white)` | — |
| Adjacent Month | Selected + Focused | `var(--color-background-controls-brand-base)` | `var(--color-border-brand-base)` 1px + focus ring | `var(--color-text-white)` | — |
| Adjacent Month | Unavailable | `var(--color-background-gray-lighter)` | `var(--color-border-disabled)` 1px | `var(--color-text-disabled)` strikethrough | — |
| Today | Default | transparent | none | `var(--color-text-neutral-strong)` | `var(--color-border-strong)` |
| Today | Hover | `var(--color-background-controls-brand-lighter)` | none | `var(--color-text-neutral-strong)` | `var(--color-border-strong)` |
| Today | Press | `var(--color-background-controls-brand-light)` | none | `var(--color-text-neutral-strong)` | `var(--color-border-strong)` |
| Today | Focus | transparent | `var(--color-border-brand-base)` focus ring | `var(--color-text-neutral-strong)` | `var(--color-border-strong)` |
| Today | Selected | `var(--color-background-controls-brand-base)` | `var(--color-border-brand-base)` 1px | `var(--color-text-white)` | `var(--color-border-white)` |
| Today | Selected + Focused | `var(--color-background-controls-brand-base)` | `var(--color-border-brand-base)` 1px + focus ring | `var(--color-text-white)` | `var(--color-border-white)` |
| Today | Unavailable | `var(--color-background-gray-lighter)` | `var(--color-border-disabled)` 1px | `var(--color-text-disabled)` strikethrough | `var(--color-border-disabled)` |

#### Unavailable implementation (Figma `42159:132767`)
- **Default / Adjacent Month:** gray background + `1px` `var(--color-border-disabled)` border on **inner** `DateCellContainer` only; label `var(--color-text-disabled)` with `line-through` (Roboto Medium 500).
- **Today:** gray background + `1px` `var(--color-border-disabled)` border on **outer** `DateCell` (32×32); inner container has gray background, **no** inner border, `6px` padding; today underline uses `var(--color-border-disabled)`.
- **Interaction:** `cursor: not-allowed`, no hover/press/focus/selected/range-endpoint styling; not included in range hover preview; `aria-disabled="true"`, `tabIndex={-1}`.
- **Range mode:** range highlight bar may pass behind unavailable cells; unavailable cells retain unavailable visuals on top and are not valid range endpoints.

### Month / Year dropdown option states

| State | Background | Text |
|---|---|---|
| Default | `white` | `var(--ui-palette-gray-700)` Medium |
| Hover | `var(--color-background-brand-lighter)` | `var(--ui-palette-gray-700)` Medium |
| Selected (current) | `var(--color-background-brand-lighter)` | `var(--ui-palette-gray-900)` Regular |

## States (Dark Theme)

Same semantic `var(--...)` tokens as Light Theme. Resolved dark values live in `components/ids-theme.css` and `[data-theme="dark"]` / `.ids-theme-dark`. The token names in every cell above remain identical; only the resolved hex/rgb values change per the dark palette.

## Interactions

### Input field
| Trigger | Action |
|---|---|
| Click calendar icon | Toggle calendar popup open/close |
| Click/focus text input | Enable direct date typing; caret in text field |
| Type valid date | Update selected date, close popup if open |
| Type invalid date | Show error state on blur |
| Tab | Focus moves to input field, then to calendar icon |
| Escape (while popup open) | Close popup, return focus to input field |

### Calendar popup
| Trigger | Action |
|---|---|
| Click date cell | Select date, close popup, populate input |
| Click adjacent month date | Navigate to that month and select date |
| Click prev/next chevron | Navigate calendar one month backward/forward |
| Click month dropdown button | Open month selection overlay |
| Click year dropdown button | Open year selection overlay |
| Select month from dropdown | Update calendar to show selected month, close month dropdown |
| Select year from dropdown | Update calendar to show selected year, close year dropdown |
| Click "Today" link | Navigate to current month and select today's date |
| Click outside popup | Close popup |

### Date cell
| Trigger | Action |
|---|---|
| Hover | Show hover background |
| Press (mousedown) | Show press background |
| Click | Select the date |
| Focus (keyboard) | Show focus ring |
| Enter / Space (focused) | Select the date |
| Arrow keys (focused) | Move focus between date cells |

### Range selection (when `rangeMode = true`)
| Trigger | Action |
|---|---|
| Click first date | Set `rangeStart`; `rangeEnd` = `null`; selected cell gets `Selected` styling |
| Click second date | Set `rangeEnd`; fire `onRangeChange(start, end)`; range bar appears behind all cells between start and end |
| Hover after first click (before second) | Show tentative range preview — bar extends from `rangeStart` to hovered cell |
| Click when range is complete | Reset: clear existing range, set new `rangeStart` |

#### Range direction
- If `rangeEnd > rangeStart`: forward selection (`reverseSelection = false`) — bar anchors left, selected cell is the end date
- If `rangeEnd < rangeStart`: reverse selection (`reverseSelection = true`) — bar anchors right, selected cell is the start date
- Internally, the component normalizes so the earlier date is always the effective start

#### Multi-row range rendering
- When a range spans multiple weeks, each `DateRow` renders its own `RangeHighlightBar` segment
- First row: bar from start cell to end of row
- Middle rows: bar spans full row width (all 7 cells)
- Last row: bar from start of row to end cell

### Keyboard navigation
- `Tab` / `Shift+Tab`: move focus between input, calendar icon, popup elements
- `Arrow Left/Right`: move focus between days in a week
- `Arrow Up/Down`: move focus between weeks
- `Home/End`: move to first/last day of the week
- `Page Up/Page Down`: navigate to previous/next month
- `Enter/Space`: select focused date
- `Escape`: close popup

## Composition & API (runtime)

### Props / Inputs

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | `Date \| null` | `null` | Currently selected date |
| `onChange` | `(date: Date \| null) => void` | — | Callback when date changes |
| `size` | `'large' \| 'small'` | `'large'` | Input field height variant |
| `placeholder` | `string` | `'MM/DD/YYYY'` | Placeholder text when empty |
| `label` | `string` | — | Optional label above the field |
| `formatHint` | `string` | `'MM-DD-YYYY'` | Date format hint displayed below the input |
| `disabled` | `boolean` | `false` | Disable all interactions |
| `error` | `boolean` | `false` | Show error state |
| `errorMessage` | `string` | — | Error message text |
| `minDate` | `Date` | — | Earliest selectable date |
| `maxDate` | `Date` | — | Latest selectable date |
| `disabledDates` | `Date[]` | `[]` | Specific dates marked unavailable |
| `firstDayOfWeek` | `0 \| 1` | `0` | Week start: 0 = Sunday, 1 = Monday |
| `dateFormat` | `string` | `'MM/DD/YYYY'` | Display format for the date value |
| `locale` | `string` | `'en-US'` | Locale for month/day names |
| `rangeMode` | `boolean` | `false` | Enable date range selection (two-click model) |
| `rangeStart` | `Date \| null` | `null` | Controlled range start date |
| `rangeEnd` | `Date \| null` | `null` | Controlled range end date |
| `onRangeChange` | `(start: Date \| null, end: Date \| null) => void` | — | Callback when range start or end changes |
| `rangePreview` | `Date \| null` | `null` | Hovered date used for tentative range preview (controlled) |
| `onRangePreviewChange` | `(date: Date \| null) => void` | — | Callback when hover preview date changes |
| `open` | `boolean` | — | Controlled popup open state |
| `onOpenChange` | `(open: boolean) => void` | — | Callback when popup visibility changes |

### Events

| Event | Payload | Trigger |
|---|---|---|
| `onChange` | `Date \| null` | Date selected or cleared |
| `onRangeChange` | `{ start: Date \| null, end: Date \| null }` | Range start/end updated (first click sets start, second click sets end) |
| `onRangePreviewChange` | `Date \| null` | Hover over a date while range start is set (preview bar) |
| `onOpenChange` | `boolean` | Popup opened or closed |
| `onMonthChange` | `Date` | Month navigation |
| `onYearChange` | `number` | Year navigation |

## Codegen Contract (Framework-Agnostic Blueprint)

### Slot / anatomy schema (required order)

```
DatePickerRoot
├── Label?
├── FieldContainer
│   ├── TextInput
│   └── CalendarIconTrigger
├── FormatHint (e.g. "MM-DD-YYYY")
├── ValidationError?
│   ├── ErrorIcon
│   └── ErrorMessage
└── CalendarPopup?
    ├── CalendarHeader
    │   ├── MonthDropdownButton
    │   │   ├── MonthLabel
    │   │   └── CaretIcon (arrow-drop-tri-caret)
    │   ├── YearDropdownButton
    │   │   ├── YearLabel
    │   │   └── CaretIcon (arrow-drop-tri-caret)
    │   ├── PrevMonthButton (chev-left-thick)
    │   └── NextMonthButton (chev-right-thick)
    ├── MonthDropdownList?
    │   └── MonthOption × 12
    ├── YearDropdownList?
    │   └── YearOption × N
    ├── WeekDayRow
    │   └── WeekDayLabel × 7
    ├── DateGrid
    │   └── DateRow × 6
    │       └── DateCell × 7
    │           ├── DateCellContainer
    │           │   ├── DateLabel
    │           │   └── TodayIndicator?
    │           └── FocusRing?
    └── TodayLink
```

### Supported variant / option matrix

| Variant axis | Values |
|---|---|
| `size` | `large` (40px), `small` (32px) |
| `content` | `empty`, `filled` |
| `state` | `default`, `hover`, `hoverOnIcon`, `focusedOnTextField`, `focusedOnIcon`, `disabled`, `selectedWithDropdown`, `selected`, `error` |
| `dateType` | `default`, `adjacentMonth`, `today` |
| `dateState` | `default`, `hover`, `press`, `focus`, `selected`, `selectedAndFocused`, `unavailable` |
| `rangeMode` | `false` (single date), `true` (date range) |
| `calendarOverlay` | `none`, `monthDropdown`, `yearDropdown` |

### Per-slot style contract

| Slot | Token(s) |
|---|---|
| `FieldContainer` | bg: `var(--color-background-component)`, border: `var(--color-border-accessible)` 1px, padding-left: `var(--padding-padding-16)`, no right padding, gap: `var(--spacing-space-none)` |
| `FieldContainer:hover` | border: `var(--color-border-strong)` |
| `FieldContainer:focus:not(:focus-visible)` | border: `var(--color-border-brand-base)` (active/selected), no outline ring |
| `FieldContainer:focus-visible` | border stays `var(--color-border-accessible)`; outer focus ring 3px outside container border, `1px solid var(--color-border-brand-base)` (inside stroke), `border-radius: 4px`, `box-sizing: border-box` |
| `FieldContainer:disabled` | bg: `var(--color-background-gray-light)`, border: `var(--color-border-disabled)`; hover must NOT change any styling |
| `FieldContainer:error` | border: `var(--color-border-alerting-critical-base)` |
| `TextInput` | color: `var(--color-text-neutral-strong)`, font: Roboto Regular (400) 14px/20px, flex: `1 0 0`, min-width: 1px |
| `TextInput::placeholder` | color: `var(--color-text-disabled)` (#757575), font-weight: 400 |
| `CalendarIconTrigger` | padding: `var(--padding-padding-12)` vertical, `var(--padding-padding-16)` horizontal, align-self: stretch, border-radius: `var(--corner-radius-radius-2)`, icon color: `var(--color-icon-brand-base)`, default `border: 1px solid transparent` |
| `CalendarIconTrigger:hover:not(:disabled)` | bg: `var(--color-background-controls-brand-lighter)`, border-color: `var(--color-border-brand-base)` |
| `CalendarIconTrigger:disabled` | color: `var(--color-icon-disabled)`, cursor: not-allowed, hover must NOT apply |
| `FormatHint` | color: `var(--color-text-neutral)`, font: Roboto Medium (500) `var(--font-size-body-2)`/`var(--font-line-height-line-height-20)`, width: 100%, z-index: 1 |
| `FieldContainer.open` | border-color: `var(--color-border-brand-base)` |
| `CalendarPopup` | bg: `var(--color-background-surface-2)`, border: `var(--color-border-accessible)` 1px all sides, Shadow 2, padding: `var(--padding-padding-16)`, right-aligned, `margin-top: -1px` (attached to input) |
| `MonthDropdownButton` / `YearDropdownButton` | color: `var(--color-text-brand-strong)`, font: `var(--font-size-body-2)` Medium, `position: relative` (for overlay centering) |
| `MonthDropdownOverlay` / `YearDropdownOverlay` | centered on trigger (`left: 50%; transform: translateX(-50%)`), min-width: 114px, max-height: 200px, border: `var(--color-border-accessible)` 1px, radius: `var(--corner-radius-radius-2)`, option padding: 10px/16px/24px, min-height: 44px, follows IDS Dropdown Single-Select spec |
| `WeekDayLabel` | color: `var(--color-text-neutral)`, font: 12px Regular, tracking: 0.36px |
| `DateCell` | size: 32×32px, radius: 2px |
| `DateCell:hover` | bg: `var(--color-background-controls-brand-lighter)` |
| `DateCell:press` | bg: `var(--color-background-controls-brand-light)` |
| `DateCell:selected` | bg: `var(--color-background-controls-brand-base)`, text: `var(--color-text-white)` |
| `DateCell:focus` | ring: `var(--color-border-brand-base)` 1px, offset -3px, radius 4px |
| `DateCell:unavailable` | bg: `var(--color-background-gray-lighter)`, border: `var(--color-border-disabled)`, text: strikethrough |
| `TodayIndicator` | color: `var(--color-border-strong)` (default), `var(--color-border-white)` (selected) |
| `RangeHighlightBar` | bg: `var(--color-background-brand-light)`, height: 30px, radius: 2px |
| `MonthDropdownList` / `YearDropdownList` | bg: white, border: `var(--ui-palette-gray-200)` 1px, shadow: `0 2px 5px rgba(37,37,37,0.08)` |
| `MonthOption` / `YearOption` | padding: 16px h / 6px v, selected bg: `var(--color-background-brand-lighter)` |
| `TodayLink` | color: `var(--color-text-brand-strong)` |

### Behavior contract

| Behavior | Rule |
|---|---|
| Popup positioning | Anchored below `FieldContainer`, aligned to leading edge |
| Popup open | On calendar icon click or programmatic `open` prop |
| Popup close | On date selection, Escape key, outside click, or programmatic |
| Month navigation | Prev/next chevrons change displayed month ±1 |
| Month dropdown | Overlay shows 12 months, scrollable, selects and closes on click |
| Year dropdown | Overlay shows year list, scrollable, selects and closes on click |
| Today link | Navigates to current month/year and selects today |
| Date formatting | Value displayed in `dateFormat` pattern; parsed on input |
| Min/max constraint | Dates outside `minDate`–`maxDate` shown as `unavailable` |
| Range selection | First click sets start, second click sets end; range bar displayed between |
| Adjacent month dates | Clickable; navigates to the adjacent month and selects |

### Accessibility contract

| Requirement | Implementation |
|---|---|
| Input role | `role="textbox"` or native `<input type="text">` with `aria-label` |
| Calendar icon | `role="button"`, `aria-label="Open calendar"`, `aria-expanded` |
| Calendar popup | `role="dialog"`, `aria-modal="true"`, `aria-label="Choose date"` |
| Date grid | `role="grid"`, `aria-label="Calendar"` |
| Date row | `role="row"` |
| Date cell | `role="gridcell"`, `aria-selected`, `aria-disabled` for unavailable |
| Month/Year dropdown | `role="listbox"`, options `role="option"`, `aria-selected` |
| Focus management | Focus trapped in popup while open; returns to input on close |
| Live region | `aria-live="polite"` announcement on month/year navigation |
| Keyboard | Full arrow key, Tab, Enter, Space, Escape, Home/End, Page Up/Down support |

### Asset resolution + bundling contract

| Asset | Shape / size | Source |
|---|---|---|
| `arrow-drop-tri-caret` | 10×10px SVG | IDS icon library |
| `chev-left-thick` | 12×12px SVG | IDS icon library, node `8675:18204` |
| `chev-right-thick` | 12×12px SVG | IDS icon library, node `8675:18321` |
| Calendar icon (input) | `calendar-simple-16`, 16×16px | `assets/icons/calendar-simple-16.svg` |
| Validation error icon | `status-critical-square-solid`, 16×16px | `assets/icons/status-critical-square-solid.svg`; render with `variant="img"` (full-color glyph) |

Icons resolved via shared `Icon` primitive. No raster images required.

### Fallback / error rules

| Scenario | Behavior |
|---|---|
| Unknown variant value | Fall back to `size: 'large'`, `state: 'default'` |
| Missing `onChange` | Component operates in uncontrolled mode |
| Invalid date typed | Show error state on blur; do not update `value` |
| `minDate` > `maxDate` | Ignore constraints; all dates selectable |
| Missing locale | Fall back to `en-US` |
| Unavailable date clicked | No-op; cell non-interactive |

### Validation checklist

- [ ] Input field renders in both `large` (40px) and `small` (32px) sizes
- [ ] All 9 input field states render correctly (default empty/filled, hover, hover-icon, focus-text, focus-icon, disabled, selected-with-dropdown, selected, error)
- [ ] Calendar popup opens on icon click with correct Shadow 4 elevation
- [ ] Calendar surface uses `var(--color-background-surface-2)` with `var(--color-border-accessible)` border
- [ ] Month/year dropdown buttons show `var(--color-text-brand-strong)` text with caret
- [ ] Prev/next month chevrons navigate correctly
- [ ] Weekday row shows 7 abbreviated day names in correct order
- [ ] Date grid renders 7×6 grid with 4px gap between cells
- [ ] Date cells are 32×32px with 2px border-radius
- [ ] Today cell has underline indicator (18×2px, `var(--color-border-strong)`)
- [ ] Hover state: `var(--color-background-controls-brand-lighter)`
- [ ] Press state: `var(--color-background-controls-brand-light)`
- [ ] Selected state: `var(--color-background-controls-brand-base)` bg, white text
- [ ] Focus ring: `var(--color-border-brand-base)` 1px, -3px offset, 4px radius
- [ ] Adjacent month dates show `var(--color-text-disabled)` text
- [ ] Unavailable dates show gray background with strikethrough text
- [ ] Range highlight bar: `var(--color-background-brand-light)`, 30px height
- [ ] Month dropdown overlay: 114px wide, 200px max height, scrollable
- [ ] Year dropdown overlay matches month dropdown pattern
- [ ] "Today" link navigates to current date
- [ ] Keyboard navigation (arrows, Tab, Enter, Escape, Page Up/Down) works
- [ ] ARIA roles and attributes are correct
- [ ] Focus trapped in popup; returns to input on close
- [ ] Disabled state prevents all interaction
- [ ] Error state shows critical border + error message

## Source Mapping

| Figma node | Description | Usage |
|---|---|---|
| `42159:132058` | Date Picker — overview (states × sizes) | Input field states, size variants |
| `42159:133107` | Full Date Picker component (container + format hint) | Root layout, gap, z-index stacking |
| `42159:133115` | Input field container (Large, Empty, Default) | Padding, gap, placeholder token details |
| `42159:133105` | DatePicker-Main — Hover on text field | Container border `--color-border-strong` |
| `42159:133098` | DatePicker-Main — Hover on icon | Icon button bg + border brand tokens |
| `42159:133090` | DatePicker-Main — Focused on text field | Outer focus ring `inset: -5px` on container |
| `42159:133083` | DatePicker-Main — Focused on icon | Focus ring `inset: -3px` on icon button |
| `42159:133111` | Format hint text ("MM-DD-YYYY") | Font, color, position below input |
| `42159:132767` | `.DatePicker-Element-Date` | Date cell — all types and states |
| `42159:132639` | `.DatePicker-Element-Range` | Range highlight — selected days, reverse |
| `42159:132612` | `DatePicker-Element-Calendar` (Default) | Calendar popup default view |
| `42159:132585` | `DatePicker-Element-Calendar` (Selected) | Calendar with selected date |
| `42159:132558` | `DatePicker-Element-Calendar` (Range) | Calendar with range selection |
| `42159:132514` | `DatePicker-Element-Calendar` (Month Dropdown) | Month dropdown overlay |
| `42159:132470` | `DatePicker-Element-Calendar` (Year Dropdown) | Year dropdown overlay |
| `42159:132764` | `.DatePicker-Element-Week` | Weekday label element |
| `14737:165791` | `Dropdown Button` | Month/year dropdown button pattern |
| `44484:783` | `arrow-drop-tri-caret` | Caret icon for dropdowns |
| `8675:18204` | `chev-left-thick` | Previous month icon |
| `8675:18321` | `chev-right-thick` | Next month icon |
| `9662:25120` | `Button` | Button pattern reference |
