# Scroll Bar Design Spec

## Metadata
- Component: Scroll Bar
- Category: Navigation
- Design system: IDS
- Spec pattern: ids-native
- Description: Visual scrollbar control with horizontal and vertical orientations, decrement/increment caret buttons, and a draggable thumb.
- Status: draft
- Version: 1.0.0
- Created: 2026-07-15
- Updated: 2026-07-18
- Primary Figma URL: https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=11099-57442&m=dev
- Primary node id: `11099:57442`
- Figma file key: `0bHk3XhrjFhowgFkz9yLr4`
- Storybook examples requested: yes
- Storybook path: `storybook-generated/ids/src/components/ScrollBar.stories.tsx`
- Storybook title: `Spec Generated/IDS/Scroll Bar`
- Theme CSS: `components/ids-theme.css`
- Verification method: Figma MCP (`get_metadata`, `get_design_context`, `get_variable_defs`)
- Verified at: 2026-07-15

## Anatomy
Deterministic slot order (render order):
1. `ScrollBarRoot` — outer track shell, sets background, padding, and orientation axis.
2. `ScrollBarTrack` — the exposed area behind the thumb (same bounds as `ScrollBarRoot` minus padding).
3. `ScrollBarDecrementButton` — leading caret icon (`caret-large-up-solid-full`); left/up action. Clicking it moves the thumb toward the start.
4. `ScrollBarIncrementButton` — trailing caret icon (`caret-large-up-solid-full`); right/down action. Clicking it moves the thumb toward the end.
5. `ScrollBarThumb` — draggable scroll indicator; size and position vary by `type` and `scrollThumb`.

## Layout & Measurements
- `ScrollBarRoot`:
  - Vertical: `14px` wide × `300px` tall, `padding: 2px`, `border: 0` (no visible border), `background: var(--color-background-gray-lighter)`.
  - Horizontal: `302px` wide × `14px` tall, `padding: 2px`, `border: 0`, `background: var(--color-background-gray-lighter)`.
  - Padding creates a `2px` inset around the track and thumb.
- `ScrollBarTrack`:
  - Fills the padded area (`width: 100%`, `height: 100%`) with the same `var(--color-background-gray-lighter)` background.
- `ScrollBarDecrementButton` / `ScrollBarIncrementButton`:
  - Size: `10px` × `10px`.
  - Rotated `caret-large-up-solid-full` icon:
    - Vertical: leading caret points up, trailing caret points down (180°).
    - Horizontal: leading caret points left (counter-clockwise 90°), trailing caret points right (clockwise 90°).
- `ScrollBarThumb`:
  - Vertical: `width: 10px`, `height: 60px`, `border-radius: 8px`, `background: var(--color-background-gray-base)`.
  - Horizontal: `height: 10px`, `width: 60px`, `min-width: 16px`, `max-width: 220px`, `border-radius: 8px`, `background: var(--color-background-gray-base)`.
  - Runtime thumb position is computed from a normalized `position` value (`0` = start, `1` = end):
    - Vertical: `top = 16px + position * 208px` from root top, horizontally centered inside the 10px track (e.g., `left: 2px`).
    - Horizontal: `left = 16px + position * 210px` from root left, vertically centered inside the 10px track (e.g., `top: 2px`).
  - Figma snapshot (`scrollThumb`) positions:
    - `scrollThumb="start"` → `position = 0`.
    - `scrollThumb="middle"` → `position = 0.5`.
    - `scrollThumb="end"` → `position = 1`.

### Slot geometry (Figma-verified)

| Slot / layer | Property | Token / contract | Figma node | Live evidence |
| --- | --- | --- | --- | --- |
| `ScrollBarRoot` (vertical) | width | `14px` | `11099:57459` | `get_design_context` |
| `ScrollBarRoot` (vertical) | height | `300px` | `11099:57459` | `get_design_context` |
| `ScrollBarRoot` | padding | `2px` all sides | `11099:57443`, `11099:57459` | `get_design_context` |
| `ScrollBarRoot` | border-width | `0` (no visible border) | `11099:57443`, `11099:57459` | `get_design_context` |
| `ScrollBarRoot` | background | `var(--color-background-gray-lighter)` | `11099:57443`, `11099:57459` | `get_variable_defs` → `#f4f4f4` |
| `ScrollBarThumb` | width (vertical) | `10px` | `11099:57462` | `get_design_context` |
| `ScrollBarThumb` | height (vertical) | `60px` | `11099:57462` | `get_design_context` |
| `ScrollBarThumb` | width (horizontal) | `60px` (min `16px`, max `220px`) | `11099:57446` | `get_design_context` |
| `ScrollBarThumb` | height (horizontal) | `10px` | `11099:57446` | `get_design_context` |
| `ScrollBarThumb` | border-radius | `var(--corner-radius-radius-8)` (`8px`) | `11099:57446`, `11099:57462` | `get_variable_defs` → `Corner Radius/radius-8 = 8` |
| `ScrollBarThumb` | background | `var(--color-background-gray-base)` | `11099:57446`, `11099:57462` | `get_variable_defs` → `#757575` |
| `ScrollBarDecrementButton` / `ScrollBarIncrementButton` | icon size | `10px` × `10px` | `40346:74412`, `40346:75771`, `40346:77130`, `40346:77469` | `get_design_context` |

## Tokens

### Colors and surfaces
- `ScrollBarRoot` / `ScrollBarTrack` background: `var(--color-background-gray-lighter)` — Figma resolves to `#f4f4f4` in light theme.
- `ScrollBarThumb` background: `var(--color-background-gray-base)` — Figma resolves to `#757575` in light theme.
- `ScrollBarDecrementButton` / `ScrollBarIncrementButton` icon: embedded `caret-large-up-solid-full` SVG/image (monochrome glyph).

### Layout aliases
| Alias | IDS default (`components/ids-theme.css`) | Usage |
|---|---|---|
| `--corner-radius-radius-8` | `8px` | `ScrollBarThumb` border-radius |

### Sizing and spacing
- `var(--color-background-gray-lighter)` and `var(--color-background-gray-base)` are semantic color tokens.
- Track padding: `2px` (not tokenized in Figma; hard-coded `2px` inset).
- Thumb dimensions and gaps are derived from the component frame and thumb offsets in Figma.

## States (Light Theme)
| Area | State | Background | Notes |
|---|---|---|---|
| `ScrollBarRoot` | default | `var(--color-background-gray-lighter)` | Always visible in Figma sample. |
| `ScrollBarThumb` | default | `var(--color-background-gray-base)` | `#757575` in light theme. |
| `ScrollBarThumb` | hover | `var(--color-text-neutral)` | Storybook implementation darkens the thumb on hover/focus. |
| `ScrollBarThumb` | press | `var(--color-text-neutral)` | Thumb actively dragged (`cursor: grabbing`). |
| `ScrollBarThumb` | focus-visible | `var(--color-background-gray-base)` + focus ring | Add focus ring using system focus tokens. |
| `ScrollBarDecrementButton` / `ScrollBarIncrementButton` | default | image icon | No state-specific icon color in Figma. |

## States (Dark Theme)
Dark theme uses the same semantic tokens as **States (Light Theme)**. Resolved values for `[data-theme="dark"]` / `.ids-theme-dark` live in theme CSS:

- `components/ids-theme.css`
- `components/<program>-theme.css` when a program overlays IDS.

Duplicate the full state matrix in this section only when a dark row genuinely uses different `var(--...)` references than the corresponding light row.

*(When Light and Dark tables would list identical `var(--...)` cells, keep the matrix under **States (Light Theme)** only and use this pointer section instead of a second table.)*

## Interactions
- `ScrollBarThumb` is draggable along the track axis.
  - Use pointer events with `setPointerCapture` on the thumb.
  - Vertical: drag delta in `clientY` is divided by the 208px travel distance to update `position`.
  - Horizontal: drag delta in `clientX` is divided by the 210px travel distance to update `position`.
  - `position` is clamped to `[0, 1]`.
- `ScrollBarDecrementButton` click decrements `position` by `0.1` (10% of track) toward the start.
- `ScrollBarIncrementButton` click increments `position` by `0.1` (10% of track) toward the end.
- The thumb position in the Storybook demo is proportional to the internal `position` state.
- In a production scroll area, `position` is derived from `scrollTop` / `scrollLeft` relative to `scrollHeight` / `scrollWidth`.
- Keyboard interaction (when scroll area is focused):
  - `ArrowUp` / `ArrowLeft`: scroll toward the start.
  - `ArrowDown` / `ArrowRight`: scroll toward the end.
  - `PageUp` / `PageDown`: scroll by viewport size.
  - `Home` / `End`: scroll to start / end.

### Accessibility
- `ScrollBarRoot` should be a `scrollbar` role (or part of a `scrollarea` composite).
- `ScrollBarThumb` must be focusable and keyboard-operable when the host scroll area supports it.
- Provide `aria-controls` linking the scroll bar to the scrollable content region.
- `ScrollBarDecrementButton` and `ScrollBarIncrementButton` should be `button` with visible labels or `aria-label` (`"Scroll up"`, `"Scroll down"`, `"Scroll left"`, `"Scroll right"`).
- Focus ring must use design system focus tokens (`--color-border-brand-base` outline or equivalent).

### Behavior & guidelines
- The scroll bar is rendered only when content overflows the viewport (`overflow: scroll`/`auto`).
- Use `type="vertical"` for right/left rail scroll bars and `type="horizontal"` for bottom/top scroll bars.
- The `scrollThumb` prop sets the **initial** visual thumb position for the Storybook demo (`start` = 0, `middle` = 0.5, `end` = 1); it does not drive production scroll offset.
- In the Storybook `VariantMatrix` story, six instances demonstrate all orientation × thumb-position combinations; the `Spec Accurate Design` and `Horizontal` stories show interactive dragging and arrow-click behavior.
- The sample `scrollThumb` positions (Start, Middle, End) represent early, center, and late scroll positions.

## Composition & API (runtime)

### Variants
- `type`: `"vertical"` | `"horizontal"` (default `"vertical"`).
- `scrollThumb`: `"start"` | `"middle"` | `"end"` (default `"start"`).
  - **Demo-only** when used for visual state in Storybook. Runtime thumb position is driven by scroll offset.

### Runtime API
| Prop | Type | Default | Notes |
|---|---|---|---|
| `type` | `"vertical"` \| `"horizontal"` | `"vertical"` | Orientation of the scroll bar. |
| `scrollThumb` | `"start"` \| `"middle"` \| `"end"` | `"start"` | **Demo-only visual position** for Storybook/QA; production ignores this. |
| `className` | `string` | — | Optional outer class. |

### Events
| Event | Payload | Notes |
|---|---|---|
| `onScroll` | `ScrollEvent` or `number` (scroll offset) | Fired when thumb/button interaction changes scroll position. |
| `onThumbDragStart` | — | Fired when user begins dragging the thumb. |
| `onThumbDragEnd` | — | Fired when user releases the thumb. |

### Spec Accurate Design story defaults
- `type`: `"vertical"`
- `scrollThumb`: `"start"`
- Stories generated:
  - `Spec Accurate Design` — default vertical, thumb at start, fully draggable and arrow-clickable.
  - `Horizontal` — horizontal orientation, thumb at middle.
  - `VariantMatrix` — all six `type` × `scrollThumb` combinations in one row.

## Codegen Contract (Framework-Agnostic Blueprint)

### Deterministic structure
Emit slots in **Anatomy** order:
`ScrollBarRoot` → `ScrollBarTrack` → `ScrollBarDecrementButton` → `ScrollBarIncrementButton` → `ScrollBarThumb`.

### Variant matrix
| `type` | `scrollThumb` | Valid |
|---|---|---|
| `vertical` | `start` | yes |
| `vertical` | `middle` | yes |
| `vertical` | `end` | yes |
| `horizontal` | `start` | yes |
| `horizontal` | `middle` | yes |
| `horizontal` | `end` | yes |

All six combinations are valid in Figma. The `scrollThumb` value is **demo-only** and does not represent runtime scroll state.

### Per-slot style contract
- `ScrollBarRoot`:
  - `display: flex` with `flex-direction: column` (vertical) or `row` (horizontal).
  - `justify-content: space-between` to place caret buttons at opposite ends.
  - `padding: 2px`.
  - `background: var(--color-background-gray-lighter)`.
  - Fixed dimensions: `14px` × `300px` (vertical) or `302px` × `14px` (horizontal) for the sample; runtime `height`/`width` may be set by the parent scroll area.
- `ScrollBarTrack`:
  - Fills padded area, same background as root.
- `ScrollBarDecrementButton` / `ScrollBarIncrementButton`:
  - `10px` × `10px` icon, rotated per orientation.
  - No independent background or border.
  - Click handler moves the internal scroll `position` by `+/- 0.1` and clamps to `[0, 1]`.
- `ScrollBarThumb`:
  - `background: var(--color-background-gray-base)`.
  - `border-radius: var(--corner-radius-radius-8)` (`8px`).
  - `cursor: grab`; `:active` → `cursor: grabbing`; `touch-action: none`.
  - Vertical: `width: 10px`, `height: 60px`, absolutely positioned with `left: 2px` and `top` computed from `position`.
  - Horizontal: `height: 10px`, `width: 60px`, `min-width: 16px`, `max-width: 220px`, absolutely positioned with `top: 2px` and `left` computed from `position`.
  - Hover / `focus-visible` background: `var(--color-text-neutral)`.

### Behavior contract
- `scrollThumb` is a **Storybook/QA initial-position hint** (`start` = 0, `middle` = 0.5, `end` = 1); production derives `position` from scroll offset.
- The component maintains an internal normalized `position` in `[0, 1]`.
- Thumb drag uses pointer capture and updates `position` from pointer delta / travel distance (208px vertical, 210px horizontal).
- Arrow buttons change `position` by `+/- 0.1` (10% of track) per click and clamp to `[0, 1]`.
- Production scroll position and thumb size are derived from `scrollTop` / `scrollLeft` and `scrollHeight` / `scrollWidth` / `clientHeight` / `clientWidth`.
- Button repeat rate and step/page size are implementation details but must be consistent with platform conventions.
- Unknown `type` → default to `"vertical"`.
- Unknown `scrollThumb` → default to `"start"`.

### Accessibility contract
- Scrollbar must be keyboard operable.
- Focus ring must be visible on the thumb.
- Buttons must have accessible labels and be reachable by keyboard.

### Asset resolution + bundling contract
- Caret icons resolve from `assets/icons/caret-large-up-solid-full.svg` (or equivalent) through the shared `Icon` primitive.
- If the icon is not available, the up-caret glyph is the fallback; rotate it for the other three directions.

### Fallback/error rules
- Unknown `type` → `"vertical"`.
- Unknown `scrollThumb` → `"start"`.
- Missing icon asset → render a rotated fallback caret glyph.
- If `scrollThumb` is used in production, log a warning and derive from scroll offset.

### Validation checklist
- [ ] `ScrollBarRoot` dimensions are `14px` × `300px` (vertical) or `302px` × `14px` (horizontal).
- [ ] `ScrollBarThumb` uses `var(--color-background-gray-base)` and `var(--corner-radius-radius-8)`.
- [ ] `ScrollBarRoot` / `ScrollBarTrack` use `var(--color-background-gray-lighter)`.
- [ ] Six variant combinations are enumerated in the matrix.
- [ ] `scrollThumb` is documented as demo-only and not required for production.
- [ ] Thumb is draggable via pointer events with `setPointerCapture` and `touch-action: none`.
- [ ] Arrow buttons move the thumb by `0.1` (10% of track) per click.
- [ ] `scrollThumb` maps to initial `position`: `start = 0`, `middle = 0.5`, `end = 1`.
- [ ] Thumb hover/focus uses `var(--color-text-neutral)`.
- [ ] Caret icons are `10px` × `10px` and rotated correctly per orientation.

## Source Mapping
| Source | Location |
|---|---|
| Component map | `data/component-figma-map.json` → `Scroll Bar` (`11099-57442`) |
| Theme CSS | `components/ids-theme.css` |
| Figma MCP | `get_metadata(fileKey=0bHk3XhrjFhowgFkz9yLr4, nodeId=11099:57442)` — component set with 6 variants |
| Figma MCP | `get_design_context(fileKey=0bHk3XhrjFhowgFkz9yLr4, nodeId=11099:57442)` — all variant code |
| Figma MCP | `get_design_context(fileKey=0bHk3XhrjFhowgFkz9yLr4, nodeId=11099:57459)` — vertical start |
| Figma MCP | `get_design_context(fileKey=0bHk3XhrjFhowgFkz9yLr4, nodeId=11099:57443)` — horizontal start |
| Figma MCP | `get_variable_defs(fileKey=0bHk3XhrjFhowgFkz9yLr4, nodeId=11099:57442)` — color + radius tokens |
| Screenshot | `11099:57442` frame rendered via `get_screenshot` |
| Storybook generated | `storybook-generated/ids/src/components/ScrollBar.stories.tsx` |
