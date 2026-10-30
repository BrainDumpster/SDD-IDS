<!-- ds:inherits root-spec -->
# Tooltip (IDS)

## Metadata
- Component: Tooltip
- Category: Alerts and Notifications
- Design system: IDS
- Figma URL: https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=42636-14688&m=dev
- File key: `0bHk3XhrjFhowgFkz9yLr4`
- Showcase frame: `42636:14688` (`Tooltip`)
- Component set: `38201:109592` (`Tooltip-Main`)
- Variant symbols reviewed:
  - `38201:109593..109613` (`Arrow Pointing=Down`, `Arrow Positioned=Start|Center|End`)
  - `38201:109623..109643` (`Arrow Pointing=Up`, `Arrow Positioned=Start|Center|End`)
  - `38201:109653..109673` (`Arrow Pointing=Right`, `Arrow Positioned=Start|Center|End`)
  - `38201:109683..109703` (`Arrow Pointing=Left`, `Arrow Positioned=Start|Center|End`)
## Anatomy
- `TooltipRoot` (`ids-tooltip`): host that owns open state, placement, and portal.
- `TooltipTrigger` (`ids-tooltip-trigger`): element that owns tooltip visibility (hover/focus).
- `TooltipPanel` (`ids-tooltip-panel`): bordered container (popup shell + surface).
- `TooltipHeader` (`ids-tooltip-header`, optional): header chrome; in `closable` mode keep the slot (empty when title is absent) to maintain close-icon alignment and vertical rhythm.
- `TooltipTitle` (`ids-tooltip-title`, optional): short title text inside the header.
- `TooltipBody` (`ids-tooltip-body`, required): free tooltip content region.
- `TooltipClose` (`ids-tooltip-close`, optional / required when `closable=true`): `20×20` IDS tertiary icon-only button (`sizing/size-20`); padding `padding/padding-4`; icon `ctrl-close-16` via shared `ids-icon` at `12×12` (not inline SVG). Sibling of header+body column — **not** nested inside `TooltipHeader`.
- `TooltipArrow` (`ids-tooltip-arrow`, required): directional pointer; supports side and alignment matrix.

Angular composition (canonical child order):

```
ids-tooltip
  ids-tooltip-trigger
  ids-tooltip-panel
    ids-tooltip-header
      ids-tooltip-title
    ids-tooltip-body
    ids-tooltip-close
    ids-tooltip-arrow
```
## Layout & Measurements
- Top/bottom arrow variants:
  - outer sample size: `244x143`
  - content panel width: `240`
  - arrow lane height: `12`
- Left/right arrow variants:
  - outer sample size: `255x132`
  - content panel width: `240`
  - arrow lane width: `12`
- Panel content padding: `12px` on all sides. The top and bottom padding live on a non-scrollable `.ids-tooltip-scroll` wrapper so they remain visible while the body scrolls; left and right padding live on the scrollable `.ids-tooltip-content` region along with `overflow-x: hidden` so content clips inside the panel.
- Panel internal gap (header/body): `4px`.
- Close control: `20×20` hit target (`CloseAction`); padding `padding/padding-4` on all sides; icon `ctrl-close-16` rendered through shared `Icon` at `12×12`.
- Panel border: `1px solid`.
- Panel corner radius: `border-radius: var(--tooltip-control-radius)` (IDS theme resolves to `var(--corner-radius-radius-none)` / 0 — square panel corners per Figma).
- Elevation: drop shadow `x:1 y:1 blur:2 rgba(37,37,37,0.25)`.
- Text block width sample: tooltip container `216`, title line sample `208`; runtime width is content-constrained within host max width.
- Default behavior is `hugContent=true`: the panel sizes to its content up to `maxWidth` (default `244px`). Consumers may set `hugContent={false}` to use the fixed `240px` (`264px` when `closable=true`) width instead.
- Panel height is capped at `maxHeight` (default `300px`) via `--tooltip-max-height` on the popup; the inner `.ids-tooltip-content` region scrolls vertically (`overflow-y: auto`, `overflow-x: hidden`, thin scrollbar tinted `scrollbar-color: var(--color-background-gray-base) var(--color-background-gray-lighter)` — same thumb/track tokens as the dual-list-box pane — so it follows light/dark themes) when content exceeds the cap. When a title or close icon is present, they sit in a fixed top bar (`.ids-tooltip-top`) above the scroll region, so the scrollbar runs underneath them rather than spanning the whole panel. Consumers may override `maxHeight` per instance.

**Closable content layout** (`closable=true`; `.ids-tooltip-top` / `.ids-tooltip-scroll` / `.ids-tooltip-content`):
- Panel is a vertical flex column: a fixed top bar (`.ids-tooltip-top`, `display: flex`; `align-items: flex-start`; `padding: padding-12 padding-12 0`) holds the title column and `CloseAction`, above a non-scrollable `.ids-tooltip-scroll` wrapper (`flex: 1 1 auto`; `min-height: 0`; `padding: padding-12 0`) and a scrollable `.ids-tooltip-content` region (`flex: 1 1 auto`; `min-height: 0`; `box-sizing: border-box`; `width: 100%`; `min-width: 0`; `overflow-y: auto`; `overflow-x: hidden`; `scrollbar-width: thin`; `scrollbar-color: var(--color-background-gray-base) var(--color-background-gray-lighter)`; `padding: 0 padding-12`). Under a top bar `.ids-tooltip-scroll` uses `padding: padding-4 0 padding-12` so the remaining `4px` is the header-body gap. The scrollbar therefore starts below the title/close row, and the top/bottom padding stays fixed.
- `ContentColumn` (`.ids-tooltip-content-column`): holds the `Header` slot inside the top bar; header text is optional, but the slot is always rendered in `closable` mode (empty when title is absent, one-line min-height) to preserve vertical rhythm and close-icon alignment; `flex: 1 1 auto`; `min-width: 0`; `padding-right: var(--spacing-space-4)` (4px `spacing/space-4` reserve before the close icon column so the title wraps inside the remaining width).
- `CloseAction` is a **sibling** of `ContentColumn` in the top bar, top-aligned — **not** nested inside `Header`.
- `CloseAction` dimensions: `20px × 20px` IDS tertiary icon-only button (`sizing/size-20`); padding `padding/padding-4` on all sides.
- Close icon: shared `Icon` component with `shapeName="ctrl-close-16"` at explicit `12px × 12px` (overrides `Icon` default `16×16` mask size); color `var(--color-icon-gray-neutral-base)`.
- Popup shell: `popupClosable` width `264px` (vs `popupStandard` `240px`); inner content box after panel padding remains `240px` (`264 − 24px`).
- Inner width math: `240px` inner = `ContentColumn` content area (`216px`) + `4px` `spacing/space-4` reserve + `20px` close → title text wraps at ~`216px` (does not extend under the close icon).
- Closable scroll body reserve: when `closable=true`, the scrollable `.ids-tooltip-content` gets `scrollbar-gutter: stable` (scrollbar track is always reserved, so adding a scrollbar never changes the content or popup width) plus `padding-right: calc(var(--padding-padding-12) + var(--sizing-size-20) + var(--spacing-space-4) - var(--ids-scrollbar-width, 0px))`. The component measures the rendered `thin` scrollbar width at runtime and exposes it as `--ids-scrollbar-width`, so the body text stays exactly `4px` (`spacing/space-4`) to the left of the close icon column and never flows underneath it. For that reason scrollbar color is applied via the `scrollbar-color` property only — no `::-webkit-scrollbar` width override, which would desync the measurement.
- Standard (`closable=false`): `.ids-tooltip-scroll` / `.ids-tooltip-content` stay a vertical column; `BodyContent` uses full inner width (sample `216px` after padding on `240px` popup).

Arrow geometry contract:
- Up/down pointer triangle: `10x6` (layout box).
- Left/right pointer triangle: `6x10` (layout box); **same `10x6` SVG** rotated inside `.arrowGraphic` (do not scale SVG to `6x10`).
- Arrow lane (Figma): `12px` on the attachment axis (`h-[12px]` top/bottom, `w-[12px]` left/right).
- Arrow cross-axis position: **centered on the trigger object** for every `arrowAlign` — `start | center | end` shifts the popup along the trigger edge while the arrow tip always tracks the trigger's center (e.g. the selected-count badge in a multiselect field). Keep a small edge inset (~`4px`) so the lane stays clear of the panel's rounded corners.
- Panel-to-arrow overlap (Figma): `1px` negative margin (`mb-[-1px]` / `mr-[-1px]`) so the pointer tucks under the panel border segment.
- Arrow fill bleed: SVG fill extends `0.5px` past triangle base (`L9.5 6.5L0.5 6.5Z`) to cover the panel border line.
- Arrow stroke: `stroke-linecap: butt`, `stroke-linejoin: miter`; open path on the two sloped edges only.
- Arrow position axis: `start | center | end` for each side.
- Trigger-to-tooltip spacing (with arrow): `6px` (`spacing/space-6`) of *visible* gap between the object's edge and the arrow tip. The arrow pokes `5px` past the panel edge toward the trigger, so the runtime positioner `sideOffset` is `11px` (`6 + 5`). Measured from the slotted object's painted box (badge, button, chip) — not the inline trigger wrapper's line box, which follows text metrics and can sit inside the object's padding or be inflated by `line-height`.

Runtime structure (Storybook reference: `storybook/src/components/IdsTooltip.tsx`, `IdsTooltip.module.css`):
- `TriggerAnchor` / `.trigger` (inline) and `.triggerBlock` (block): the trigger anchor element. `.triggerBlock` uses `display: block`, `width: 100%`, `min-width: 0` to fill the host row and remain shrinkable in flex layouts. The `BaseTooltip.Trigger` is rendered with a `render` prop so the `className` and `children` merge correctly.
- `TooltipRoot` / `.popup`: transparent positioning shell (`overflow: visible`; no border/shadow).
- `TooltipPanel` / `.panel`: bordered content surface (background, border, shadow, `box-sizing: border-box`).
- `Arrow` / `.arrow`: absolute sibling above `.panel`; overlaps panel edge (no `::before`/`::after` border-notch masks).
- `closable=true` (or any visible title): `.contentTop` top bar holds `.contentColumn` + `.close` as siblings; `.content` below it is the only scroll region, so the scrollbar starts under the title/close row.

Arrow cross-axis positioning (all sides, both implementations):
- The arrow is **centered on the trigger object** at runtime. Lib (`lib/react/ids/tooltip/IdsTooltip.tsx`) measures the trigger rect and sets `--ids-tooltip-arrow-offset`; Storybook (`storybook/src/components/IdsTooltip.tsx`) lets Floating UI's arrow middleware produce the same anchor-centered offset. Fallback CSS centers the arrow on the popup only before measurement (`calc(50% - 5px)`).
- `arrowAlign` (`start | center | end`) positions the popup relative to the trigger; it no longer pins the arrow to a fixed inset.

Storybook attachment-axis calibration (Base UI `data-side` on arrow; tuned against IDS Design Library `38201:109592`):

| Runtime `side` | `arrowAlign` | Base UI arrow `data-side` | Attachment offset | Notes |
|---|---|---|---|---|
| `bottom` | `start` / `center` / `end` | `bottom` | `top: -5px` | `1px` up from default `-4px` |
| `top` | `start` / `center` / `end` | `top` | `bottom: -5px` | `1px` down from default `-4px` |
| `left` | `start` | `left` | `right: -5px` | `1px` right from default `-4px` |
| `left` | `center` | `left` | `right: -5px` | `1px` right from default `-4px` |
| `left` | `end` | `left` | `right: -5px` | `1px` right from default `-4px` |
| `right` | `start` | `right` | `left: -5px` | `1px` left from default `-4px` |
| `right` | `center` | `right` | `left: -5px` | `1px` left from default `-4px` |
| `right` | `end` | `right` | `left: -5px` | same as start/center (was `-3px`; caused end arrow to look centered/detached) |

Default attachment offset before per-placement tuning: `-4px` on the attachment axis (`top`/`bottom`/`left`/`right` as appropriate).

- Supported permutations: `4 sides x 3 alignments = 12`.
## Tokens

### Layout aliases (theme-resolvable)
Programmes override these **same alias names** in programme theme CSS. Component specs and generated CSS reference aliases only.

| Alias | IDS default (`components/ids-theme.css`) |
|---|---|
| `--tooltip-control-radius` | `var(--corner-radius-radius-none)` |

### Core surface/text tokens
- Panel background: `var(--color-background-surface-secondary)`.
- Panel border + arrow stroke: `var(--color-border-gray-neutral-base)`.
- Header text: `var(--color-text-gray-neutral-strong)`.
- Body text: `var(--color-text-gray-neutral)`.
- Close icon color: `var(--color-icon-gray-neutral-base)`.
- Shadow tone reference: `rgba(37,37,37,0.25)` from Figma effect.

Typography contract:
- Header (`optional`): Body 2 Medium, Roboto `14/20`, weight `500`.
- Body: Body 2, Roboto `14/20`, weight `400`.
## States (Light Theme)
| Variant | Background | Border | Text/Icon |
|---|---|---|---|
| Standard (no title) | `var(--color-background-surface-secondary)` | `var(--color-border-gray-neutral-base)` | body `var(--color-text-gray-neutral)` |
| With header | `var(--color-background-surface-secondary)` | `var(--color-border-gray-neutral-base)` | header `var(--color-text-gray-neutral-strong)`, body `var(--color-text-gray-neutral)` |
| Closable | `var(--color-background-surface-secondary)` | `var(--color-border-gray-neutral-base)` | header/body as above; close icon uses `var(--color-icon-gray-neutral-base)` |
| Any arrow side/align | same as panel | same as panel | n/a |
## States (Dark Theme)
| Variant | Background | Border | Text/Icon |
|---|---|---|---|
| Standard (no title) | `var(--color-background-surface-secondary)` (dark-resolved) | `var(--color-border-gray-neutral-base)` (dark-resolved) | body `var(--color-text-gray-neutral)` (dark-resolved) |
| With header | `var(--color-background-surface-secondary)` (dark-resolved) | `var(--color-border-gray-neutral-base)` (dark-resolved) | header `var(--color-text-gray-neutral-strong)`, body `var(--color-text-gray-neutral)` (dark-resolved) |
| Closable | `var(--color-background-surface-secondary)` (dark-resolved) | `var(--color-border-gray-neutral-base)` (dark-resolved) | close icon uses `var(--color-icon-gray-neutral-base)` (dark-resolved) |
| Any arrow side/align | same as panel | same as panel | n/a |
## Interactions
- Standard tooltip (`closable=false`):
  - Opens on hover/focus of trigger.
  - Closes when pointer leaves trigger/tooltip hover region or on blur.
- Closable tooltip (`closable=true`):
  - Stays open after pointer leaves trigger.
  - Closes only when user activates close icon (`ctrl-close-16`) or equivalent close command.
  - Emits close event on user dismissal.
- Arrow follows chosen `placement` side and `arrowAlign`.
- Tooltip content is consumer-supplied and may be text or structured markup.
## Composition & API (runtime)

Deterministic child order (projected):

```
TooltipRoot
  TooltipTrigger
  TooltipPanel
    TooltipHeader
      TooltipTitle
    TooltipBody
    TooltipClose
    TooltipArrow
```

Group vs item: root owns `side`, `arrowAlign`, `closable`, open state, and context; trigger owns pointer/focus; panel is the portaled popup; header/title/body/close/arrow are panel children.

Root props:
- `closable?: boolean` (default `false`).
- `side?: "top" | "bottom" | "left" | "right"` (default `top`).
- `arrowAlign?: "start" | "center" | "end"` (default `center`).
- `open?: boolean` / `defaultOpen?: boolean`.
- `onOpenChange?: (open: boolean) => void`.
- `onClose?: (reason: "close-click" | "escape" | "programmatic") => void`.
- `closeIconShapeName?: string` default `ctrl-close-16`.
- `hugContent?: boolean` (default `true`). When `true`, the tooltip popup width shrinks to fit its content instead of using the standard `240px` / `264px` fixed widths. Pass `hugContent={false}` to opt back into the fixed widths.
- `maxWidth?: number` (default `244`). Maximum popup width (px) applied only when `hugContent` is `true`; content wraps once this width is reached.
- `maxHeight?: number` (default `300`). Maximum panel height (px) applied in all width modes; the content region scrolls vertically once content exceeds this height (title/close stay fixed above it).
- `triggerDisplay?: "inline" | "block"` (default `inline`). When `block`, the trigger anchor spans the full width of its container and uses `min-width: 0`.
- `delay?: number` (default `300` ms). Open delay for standard hover tooltips; use `0` for immediate appearance.
- `closeDelay?: number` (default `0` ms). Delay before closing when the pointer leaves the trigger.

Slot rules:
- `TooltipTrigger` is required (wraps the consumer trigger control).
- `TooltipBody` is required.
- `TooltipArrow` is always rendered.
- `TooltipHeader` / `TooltipTitle` optional; omit both when there is no title and `closable=false`.
- When `closable=true`, `TooltipClose` is required; keep `TooltipHeader` even if title is absent (empty header, one-line min-height).
## Codegen Contract (Framework-Agnostic Blueprint)

Deterministic structure:
1. `TooltipRoot`
2. `TooltipTrigger`
3. `TooltipPortal` (if framework/library uses portaling)
4. `TooltipPanel` (popup shell)
5. `TooltipArrow` (always rendered; child of panel in composition, visually overlapping the panel edge)
6. `Content` wrapper (`column` when `closable=false`; `row` when `closable=true`)
7. When `closable=false`: optional `TooltipHeader` (`TooltipTitle`) → `TooltipBody` (vertical stack)
8. When `closable=true`: `ContentColumn` (`TooltipHeader` → `TooltipBody`, `padding-right: var(--padding-padding-4)`) + `TooltipClose` (sibling, top-aligned)

Variant/option matrix:
- Content mode: `header=false|true`.
- Close mode: `closable=false|true`.
- Arrow placement: `side x arrowAlign` -> 12 valid combinations (arrow always rendered).

Per-slot style contract:
- `TooltipPanel`: background/border/shadow/padding from tokens above; `border-radius: var(--tooltip-control-radius)`.
- `Header`: Body 2 Medium + strong text token; title only (no close control inside header when `closable=true`). In `closable` mode the header slot is rendered even when title is absent, with a one-line min-height to preserve vertical rhythm.
- `BodyContent`: Body 2 + neutral text token; accepts arbitrary content/slots; when `closable=true`, the body wraps within the scrollable `.ids-tooltip-content` width using the right reserve so it is `4px` (`spacing/space-4`) from the close icon column.
- `ContentColumn` (`closable=true` only): `flex: 1 1 auto`; `min-width: 0`; `padding-right: var(--spacing-space-4)`.
- `CloseAction`: `20×20` IDS tertiary icon-only button (`sizing/size-20`, `padding/padding-4`); shared `Icon` with `shapeName="ctrl-close-16"` at `12×12`; color `var(--color-icon-gray-neutral-base)`; sibling of `ContentColumn`, not inside `Header`.
- `Arrow`: shares panel surface and border tokens; always renders `10x6` SVG inside `.arrowGraphic` (rotate per side; never resize SVG to `6x10`); apply cross-axis insets and per-placement attachment offsets from the calibration table above.

Behavior contract:
- `closable=false`: hover/focus transient pattern (auto closes on leave/blur).
- `closable=true`: persistent until close action; emit `onClose` on user close.
- `open` controlled mode must override internal state when provided.

Accessibility contract:
- Tooltip root uses `role="tooltip"`.
- Trigger references tooltip via `aria-describedby` when open.
- Close action has accessible label ("Close tooltip").
- Keyboard support:
  - Standard: focus/blur lifecycle follows trigger.
  - Closable: `Escape` may close if product enables global dismiss; close button must be keyboard-activatable.

Asset resolution contract:
- `ctrl-close-16` must resolve from `assets/icons/ctrl-close-16.svg` through shared icon component.
- No inline SVG strings or `data:image/svg+xml` in generated output.

Fallback/error rules:
- Unknown `side` -> fallback `top`.
- Unknown `arrowAlign` -> fallback `center`.
- `closable=true` with hidden close control is invalid; generator must emit close control.
- Missing title -> omit title text; omit the entire header slot when `closable=false`. When `closable=true`, keep the empty header slot (aria-hidden, one-line min-height) to preserve close-icon alignment and vertical rhythm; do not render visible title text.
- Missing content -> render nothing and emit generation validation error.

Validation checklist (pass/fail):
- [ ] All 12 arrow permutations render correctly (`side x align`).
- [ ] `closable=false` auto-dismisses on leave/blur.
- [ ] `closable=true` does not auto-dismiss on leave; closes on close action.
- [ ] Close event emits with deterministic reason payload.
- [ ] `ctrl-close-16` icon is rendered via shared `Icon` at `12×12` inside a `20×20` IDS tertiary icon-only close button (not inline SVG).
- [ ] When `closable=true`, `CloseAction` is sibling of `ContentColumn` (not inside `Header`); title and scrollable body respect the `4px` `spacing/space-4` right reserve and do not flow under the close icon.
- [ ] Body content supports arbitrary consumer-provided content.
- [ ] Only semantic tokens are used; no hardcoded colors in generated styles.
- [ ] Layout uses `var(--tooltip-control-radius)` on `TooltipPanel`, not hardcoded px.
## Source Mapping
- IDS map file: `data/component-figma-map.json` (`Tooltip` entry).
- Showcase frame: `42636:14688` (`Tooltip`, IDS Design Library).
- Component set: `38201:109592` (`Tooltip-Main`).
- Arrow matrix source symbols:
  - Down: `38201:109593`, `38201:109603`, `38201:109613`
  - Up: `38201:109623`, `38201:109633`, `38201:109643`
  - Right: `38201:109653`, `38201:109663`, `38201:109673`
  - Left: `38201:109683`, `38201:109693`, `38201:109703`
- Last live verification: Figma MCP (`get_metadata`, `get_variable_defs`, `get_design_context`), file `0bHk3XhrjFhowgFkz9yLr4`, nodes `42636:14688`, `38201:109593` (Arrow Pointing=Down, Arrow Positioned=Start), session 2026-08-19.
- Runtime contract: `component-contracts/ids/tooltip.contract.ts`
- Angular library: `lib/angular/ids/tooltip/`
- Angular Storybook: `storybook-angular/src/components/ids-tooltip/`

## Changelog
- **2026-10-23**: Implemented the `delay` prop (default `300` ms) — pointer hover now opens the tooltip only after the pointer rests on the trigger for `delay` ms; leaving early cancels the pending open so sweeping across the trigger never shows it. Lib (`lib/react/ids/tooltip/IdsTooltip.tsx`) schedules the open with `openTimerRef` on `mouseenter` and clears it on leave/blur/dismiss/unmount; focus and popup-hover behavior unchanged. Storybook (`storybook/src/components/IdsTooltip.tsx`) forwards `delay`/`closeDelay` to `BaseTooltip.Provider` — they were previously accepted but never passed through, so Base UI's defaults always applied.
- **2026-10-21**: Changed trigger-to-tooltip spacing: the *visible* gap between the object's edge and the arrow tip is now `6px` (`spacing/space-6`); since the arrow pokes `5px` past the panel edge, the positioner `sideOffset` is `11px` (was `16px`). Also made the arrow track the trigger's cross-axis center on every `arrowAlign` (e.g. centered on the selected-count badge in dropdown multiselect) — previously `start`/`end` pinned the arrow to fixed `8px`/`18px` insets. `arrowAlign` now only shifts the popup. The lib implementation measures the trigger rect and sets `--ids-tooltip-arrow-offset` (clamped ~`4px` from panel corners); the Storybook implementation defers cross-axis positioning to Floating UI's arrow middleware. The 6px gap is measured from the slotted object's box — lib unions the trigger's element-children rects (`measureTriggerBox`, falling back to the wrapper rect for plain-text triggers); Storybook `.trigger` is now `inline-flex` so its box hugs the slotted object. Also fixed the closable gap drifting on open: the lib's scrollbar-width measurement changes content padding and panel height *after* the initial position compute (for `side=top`/`left` the stale height pushed the panel edge off its anchor); `update` now runs from a `ResizeObserver` on the trigger and popup so the gap is corrected in the same frame. Changed in `lib/react/ids/tooltip/IdsTooltip.tsx`, `IdsTooltip.module.css`, `storybook/src/components/IdsTooltip.tsx`, `storybook/src/components/IdsTooltip.module.css`.
- **2026-10-14**: Tinted the scroll-region scrollbar with theme tokens — `scrollbar-color: var(--color-background-gray-base) var(--color-background-gray-lighter)` on `.ids-tooltip-content` (same contract as the dual-list-box pane) so the scrollbar follows dark mode. `scrollbar-color` is used instead of `::-webkit-scrollbar` rules so `scrollbar-width: thin` stays authoritative and the runtime `--ids-scrollbar-width` measurement remains exact for the closable 4px reserve. Changed in `lib/react/ids/tooltip/IdsTooltip.module.css`.
- **2026-09-28**: Updated closable tooltip spacing tokens and scrollbar behavior. `ContentColumn` now uses `padding-right: var(--spacing-space-4)` (`spacing/space-4`) before the close icon. The scrollable `.ids-tooltip-content--closable` uses `scrollbar-gutter: stable` so the content/popup width never changes when the scrollbar appears, plus `padding-right: calc(var(--padding-padding-12) + var(--sizing-size-20) + var(--spacing-space-4) - var(--ids-scrollbar-width, 0px))` with the scrollbar width measured at runtime, keeping the visible gap at exactly `4px`. Changed in `lib/react/ids/tooltip/IdsTooltip.tsx` and `IdsTooltip.module.css`.
- **2026-09-28**: Moved vertical scrolling from `.ids-tooltip-panel` to a dedicated `.ids-tooltip-content` scroll region; when a title or close icon is present, they render in a fixed `.ids-tooltip-top` bar so the scrollbar runs underneath them. Panel is now a vertical flex column with `overflow: hidden`; removed the `.ids-tooltip-content--closable` row layout. Changed in `lib/react/ids/tooltip/IdsTooltip.tsx` and `IdsTooltip.module.css`.
- **2026-09-17**: Added `maxHeight` runtime prop (default `300px`) constraining `.ids-tooltip-panel` height via `--tooltip-max-height` CSS var; panel scrolls vertically (`overflow-y: auto`, `scrollbar-width: thin`) past the cap. Storybook `Components/IDS/Tooltip` exposes a `max height (px)` number control (60–600, step 10). Synced from `lib/react/ids/tooltip/IdsTooltip.tsx`, `IdsTooltip.module.css`, and `storybook/src/components/lib-generated/Tooltip.stories.tsx`.
- **2026-09-09**: Changed `hugContent` default from `false` to `true` — tooltip popup now hugs content by default (capped at `maxWidth`, default `244px`); pass `hugContent={false}` to opt back into fixed `240px`/`264px` widths. Storybook `Components/IDS/Tooltip` locks the `hugContent` control to `true` (not toggleable) since the `maxWidth` control now governs sizing. Synced from `lib/react/ids/tooltip/IdsTooltip.tsx` and `storybook/src/components/lib-generated/Tooltip.stories.tsx`.
- **2026-09-09**: Added `maxWidth` runtime prop (default `244px`) constraining `.ids-tooltip-popup--hug` width via `--tooltip-max-width` CSS var. Synced from `lib/react/ids/tooltip/IdsTooltip.tsx` and `IdsTooltip.module.css`.
- **2026-08-31**: Fixed `right-end` arrow sitting at center — use `bottom: 8px` / `top: auto` for left/right `end`, normalize `right`+`end` attachment to `left: -5px`, and disable Base UI align-flip on Storybook React Positioner so requested `arrowAlign` is preserved.
- **2026-08-19**: Canonical composition is `TooltipRoot` → `TooltipTrigger` + `TooltipPanel` (`Header`/`Title`, `Body`, `Close`, `Arrow`). Angular reference: `lib/angular/ids/tooltip/`. Live Figma re-check: nodes `42636:14688`, `38201:109593`.
- **2026-08-07**: Added `hugContent` runtime API and `.popupHug` style to let the popup width shrink to fit its content; default remains the standard `240px` (`popupStandard`) / `264px` (`popupClosable`) fixed widths. Synced from `storybook/src/components/IdsTooltip.tsx` and `IdsTooltip.module.css`.
- **2026-07-27**: Preserved the `Header` slot in closable no-title tooltips (empty, one-line min-height) to maintain close-icon alignment and vertical rhythm; synced from `IdsTooltip.tsx` / `IdsTooltip.module.css`.
- **2026-07-27**: Updated closable tooltip `CloseAction` to a `20×20` IDS tertiary icon-only button with `padding/padding-4`, `sizing/size-20`, and close icon color `var(--color-icon-gray-neutral-base)`; synced from `IdsTooltip.tsx` / `IdsTooltip.module.css`.
- **2026-06-19**: Documented closable layout for codegen — `ContentColumn` + `CloseAction` row, `8px` padding-right reserve before close icon column, `12×12` `ctrl-close-16` via shared `Icon`; synced from `IdsTooltip.tsx` / `IdsTooltip.module.css`.
- **2026-06-15**: Documented Storybook arrow calibration matrix (12 placements), `.arrowGraphic`/`10x6` SVG sizing rule, and panel/arrow layering in Layout & Measurements; values synced from `IdsTooltip.module.css`.
- **2026-06-15**: Refactored Storybook tooltip to match Figma layering — border/shadow on inner `panel`, arrow overlaps panel edge (removed `::before`/`::after` border masks that caused visible gaps).
- **2026-06-05**: Removed `showArrow` from runtime API; IDS tooltip always renders the directional arrow per Figma (12 placement variants).
- **2026-06-02**: Fixed tooltip close icon color in dark mode to `#4D4D4D`. Changed in `storybook/src/components/IdsTooltip.module.css` lines 238-242.
- **2026-06-02**: Fixed tooltip header spacing to `4px` between content and close icon frame. Changed in `storybook/src/components/IdsTooltip.module.css` line 208.
- **2026-06-02**: Fixed tooltip close icon from `shape-x` to `ctrl-close-16.svg` and updated sizing to `12px` icon with `4px` padding (`20px` frame). Changed in `storybook/src/components/IdsTooltip.tsx` line 141 and `storybook/src/components/IdsTooltip.module.css` lines 225-243.
- **2026-06-02**: Fixed tooltip border position to be inside the container by adding `box-sizing: border-box` to `.popup` class. Changed in `storybook/src/components/IdsTooltip.module.css` line 21.
- **2026-06-02**: Fixed tooltip border-radius from `var(--corner-radius-radius-8)` to `0px` to match design spec (square panel corners). Changed in `storybook/src/components/IdsTooltip.module.css` line 17.
