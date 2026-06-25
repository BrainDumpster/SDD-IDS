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
- `TriggerAnchor`: element that owns tooltip visibility.
- `TooltipRoot`: positioned wrapper for content and arrow.
- `TooltipPanel`: bordered container with optional header and close action.
- `Header` (optional): short title text.
- `BodyContent` (required): free tooltip content region.
- `CloseAction` (optional): `12×12` close control; icon `ctrl-close-16` via shared `Icon` component at `12×12` (not inline SVG).
- `Arrow` (required): directional pointer; supports side and alignment matrix.
## Layout & Measurements
- Top/bottom arrow variants:
  - outer sample size: `244x143`
  - content panel width: `240`
  - arrow lane height: `12`
- Left/right arrow variants:
  - outer sample size: `255x132`
  - content panel width: `240`
  - arrow lane width: `12`
- Panel content padding: `12px`.
- Panel internal gap (header/body): `4px`.
- Close control: `12×12` hit target (`CloseAction`); icon `ctrl-close-16` rendered through shared `Icon` at `12×12`.
- Panel border: `1px solid`.
- Panel corner radius: `border-radius: var(--tooltip-control-radius)` (IDS theme resolves to `var(--corner-radius-radius-none)` / 0 — square panel corners per Figma).
- Elevation: drop shadow `x:1 y:1 blur:2 rgba(37,37,37,0.25)`.
- Text block width sample: tooltip container `216`, title line sample `208`; runtime width is content-constrained within host max width.

**Closable content layout** (`closable=true`; Storybook `.contentClosable` / `.contentColumn`):
- Panel inner `.content` is a **horizontal flex row** (`flex-direction: row`; `align-items: flex-start`; no inter-column gap — spacing is column padding).
- `ContentColumn` (`.contentColumn`): stacks optional `Header` + `BodyContent` vertically; `flex: 1 1 auto`; `min-width: 0`; `padding-right: var(--spacing-space-8)` (**8px empty space** before the close icon column so title/body wrap inside the remaining width).
- `CloseAction` is a **sibling** of `ContentColumn`, top-aligned — **not** nested inside `Header`.
- `CloseAction` dimensions: `12px × 12px` button (`padding: 0`).
- Close icon: shared `Icon` component with `shapeName="ctrl-close-16"` at explicit `12px × 12px` (overrides `Icon` default `16×16` mask size).
- Popup shell: `popupClosable` width `264px` (vs `popupStandard` `240px`); inner content box after panel padding remains `240px` (`264 − 24px`).
- Inner width math: `240px` inner = `ContentColumn` flex area (`228px`) + `8px` column padding-right + `12px` close → body/title text wraps at ~`220px` (does not extend under the close icon).
- Standard (`closable=false`): `.content` stays a vertical column; `BodyContent` uses full inner width (sample `216px` after padding on `240px` popup).

Arrow geometry contract:
- Up/down pointer triangle: `10x6` (layout box).
- Left/right pointer triangle: `6x10` (layout box); **same `10x6` SVG** rotated inside `.arrowGraphic` (do not scale SVG to `6x10`).
- Arrow lane (Figma): `12px` on the attachment axis (`h-[12px]` top/bottom, `w-[12px]` left/right).
- Arrow alignment inset on lane axis: `8px` (`padding-8`) for `start`/`end`.
- Panel-to-arrow overlap (Figma): `1px` negative margin (`mb-[-1px]` / `mr-[-1px]`) so the pointer tucks under the panel border segment.
- Arrow fill bleed: SVG fill extends `0.5px` past triangle base (`L9.5 6.5L0.5 6.5Z`) to cover the panel border line.
- Arrow stroke: `stroke-linecap: butt`, `stroke-linejoin: miter`; open path on the two sloped edges only.
- Arrow position axis: `start | center | end` for each side.
- Trigger-to-tooltip spacing (with arrow): `16px` (runtime positioner `sideOffset`).

Runtime structure (Storybook reference: `storybook/src/components/IdsTooltip.tsx`, `IdsTooltip.module.css`):
- `TooltipRoot` / `.popup`: transparent positioning shell (`overflow: visible`; no border/shadow).
- `TooltipPanel` / `.panel`: bordered content surface (background, border, shadow, `box-sizing: border-box`).
- `Arrow` / `.arrow`: absolute sibling above `.panel`; overlaps panel edge (no `::before`/`::after` border-notch masks).
- `closable=true`: `.content` + `.contentClosable` row wrapper; `.contentColumn` + `.close` siblings inside `.content`.

Storybook alignment insets (cross-axis; applies to all sides on that axis):
- Top/Bottom tooltips — `start`: `left: 8px`; `center`: `left: calc(50% - 5px)`; `end`: `left: calc(100% - 18px)`.
- Left/Right tooltips — `start`: `top: 8px`; `center`: `top: calc(50% - 5px)`; `end`: `top: calc(100% - 18px)`.

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
| `right` | `end` | `right` | `left: -3px` | `1px` right from default `-4px` |

Default attachment offset before per-placement tuning: `-4px` on the attachment axis (`top`/`bottom`/`left`/`right` as appropriate).

- Supported permutations: `4 sides x 3 alignments = 12`.
## Tokens

### Layout aliases (theme-resolvable)
Programmes override these **same alias names** in programme theme CSS. Component specs and generated CSS reference aliases only.

| Alias | IDS default (`components/ids-theme.css`) |
|---|---|
| `--tooltip-control-radius` | `var(--corner-radius-radius-none)` |

### Core surface/text tokens
- Panel background: `var(--color-background-surface-2)`.
- Panel border + arrow stroke: `var(--color-border-accessible)`.
- Header text: `var(--color-text-neutral-strong)`.
- Body text: `var(--color-text-neutral)`.
- Close icon color: use IDS neutral-strong icon/text token in light mode; dark mode uses `#4D4D4D`.
- Shadow tone reference: `rgba(37,37,37,0.25)` from Figma effect.

Typography contract:
- Header (`optional`): Body 2 Medium, Roboto `14/20`, weight `500`.
- Body: Body 2, Roboto `14/20`, weight `400`.
## States (Light Theme)
| Variant | Background | Border | Text/Icon |
|---|---|---|---|
| Standard (no title) | `var(--color-background-surface-2)` | `var(--color-border-accessible)` | body `var(--color-text-neutral)` |
| With header | `var(--color-background-surface-2)` | `var(--color-border-accessible)` | header `var(--color-text-neutral-strong)`, body `var(--color-text-neutral)` |
| Closable | `var(--color-background-surface-2)` | `var(--color-border-accessible)` | header/body as above; close icon uses semantic neutral icon token |
| Any arrow side/align | same as panel | same as panel | n/a |
## States (Dark Theme)
| Variant | Background | Border | Text/Icon |
|---|---|---|---|
| Standard (no title) | `var(--color-background-surface-2)` (dark-resolved) | `var(--color-border-accessible)` (dark-resolved) | body `var(--color-text-neutral)` (dark-resolved) |
| With header | `var(--color-background-surface-2)` (dark-resolved) | `var(--color-border-accessible)` (dark-resolved) | header `var(--color-text-neutral-strong)`, body `var(--color-text-neutral)` (dark-resolved) |
| Closable | `var(--color-background-surface-2)` (dark-resolved) | `var(--color-border-accessible)` (dark-resolved) | close icon uses `#4D4D4D` in dark mode |
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
- `content: string | ReactNode | TemplateRef | SlotContent` (required, framework-adapted).
- `title?: string` (optional header).
- `closable?: boolean` (default `false`).
- `side?: "top" | "bottom" | "left" | "right"` (default `top`).
- `arrowAlign?: "start" | "center" | "end"` (default `center`).
- `open?: boolean` / `defaultOpen?: boolean`.
- `onOpenChange?: (open: boolean) => void`.
- `onClose?: (reason: "close-click" | "escape" | "programmatic") => void`.
- `closeIconShapeName?: string` default `ctrl-close-16` (for icon component integration).
## Codegen Contract (Framework-Agnostic Blueprint)

Deterministic structure:
1. `TriggerAnchor`
2. `TooltipPortal` (if framework/library uses portaling)
3. `TooltipRoot`
4. `Arrow` (always rendered)
5. `TooltipPanel`
6. `Content` wrapper (`column` when `closable=false`; `row` when `closable=true`)
7. When `closable=false`: optional `Header` → `BodyContent` (vertical stack inside `Content`)
8. When `closable=true`: `ContentColumn` (optional `Header` → `BodyContent`, vertical stack, `padding-right: var(--spacing-space-8)`) + `CloseAction` (sibling, top-aligned)

Variant/option matrix:
- Content mode: `header=false|true`.
- Close mode: `closable=false|true`.
- Arrow placement: `side x arrowAlign` -> 12 valid combinations (arrow always rendered).

Per-slot style contract:
- `TooltipPanel`: background/border/shadow/padding from tokens above; `border-radius: var(--tooltip-control-radius)`.
- `Header`: Body 2 Medium + strong text token; title only (no close control inside header when `closable=true`).
- `BodyContent`: Body 2 + neutral text token; accepts arbitrary content/slots; when `closable=true`, wraps within `ContentColumn` width (respects `8px` padding-right reserve).
- `ContentColumn` (`closable=true` only): `flex: 1 1 auto`; `min-width: 0`; `padding-right: var(--spacing-space-8)`.
- `CloseAction`: `12×12` transparent button; shared `Icon` with `shapeName="ctrl-close-16"` at `12×12`; light mode `var(--color-text-neutral-strong)`; dark mode `#4D4D4D`; sibling of `ContentColumn`, not inside `Header`.
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
- Missing title -> omit header slot; do not render empty heading element (including when `closable=true`).
- Missing content -> render nothing and emit generation validation error.

Validation checklist (pass/fail):
- [ ] All 12 arrow permutations render correctly (`side x align`).
- [ ] `closable=false` auto-dismisses on leave/blur.
- [ ] `closable=true` does not auto-dismiss on leave; closes on close action.
- [ ] Close event emits with deterministic reason payload.
- [ ] `ctrl-close-16` icon is rendered via shared `Icon` at `12×12` on a `12×12` close button (not inline SVG).
- [ ] When `closable=true`, `CloseAction` is sibling of `ContentColumn` (not inside `Header`); body/title respect `8px` padding-right reserve and do not flow under close icon.
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
- Last live verification: Figma MCP, file `0bHk3XhrjFhowgFkz9yLr4`, nodes `42636:14688`, `38201:109593`, `38201:109653`, session 2026-06-15.

## Changelog
- **2026-06-19**: Documented closable layout for codegen — `ContentColumn` + `CloseAction` row, `8px` padding-right reserve before close icon column, `12×12` `ctrl-close-16` via shared `Icon`; synced from `IdsTooltip.tsx` / `IdsTooltip.module.css`.
- **2026-06-15**: Documented Storybook arrow calibration matrix (12 placements), `.arrowGraphic`/`10x6` SVG sizing rule, and panel/arrow layering in Layout & Measurements; values synced from `IdsTooltip.module.css`.
- **2026-06-15**: Refactored Storybook tooltip to match Figma layering — border/shadow on inner `panel`, arrow overlaps panel edge (removed `::before`/`::after` border masks that caused visible gaps).
- **2026-06-05**: Removed `showArrow` from runtime API; IDS tooltip always renders the directional arrow per Figma (12 placement variants).
- **2026-06-02**: Fixed tooltip close icon color in dark mode to `#4D4D4D`. Changed in `storybook/src/components/IdsTooltip.module.css` lines 238-242.
- **2026-06-02**: Fixed tooltip header spacing to `4px` between content and close icon frame. Changed in `storybook/src/components/IdsTooltip.module.css` line 208.
- **2026-06-02**: Fixed tooltip close icon from `shape-x` to `ctrl-close-16.svg` and updated sizing to `12px` icon with `4px` padding (`20px` frame). Changed in `storybook/src/components/IdsTooltip.tsx` line 141 and `storybook/src/components/IdsTooltip.module.css` lines 225-243.
- **2026-06-02**: Fixed tooltip border position to be inside the container by adding `box-sizing: border-box` to `.popup` class. Changed in `storybook/src/components/IdsTooltip.module.css` line 21.
- **2026-06-02**: Fixed tooltip border-radius from `var(--corner-radius-radius-8)` to `0px` to match design spec (square panel corners). Changed in `storybook/src/components/IdsTooltip.module.css` line 17.
