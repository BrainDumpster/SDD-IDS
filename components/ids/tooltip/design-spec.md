<!-- ds:inherits root-spec -->
# Tooltip (IDS)

## Metadata
- Component: Tooltip
- Category: Alerts and Notifications
- Design system: IDS
- Figma URL: https://www.figma.com/design/VZJ48bbVYrIynw8DdSukWw/-Exploration-only--IDS-with-variables?node-id=38201-109592&m=dev
- File key: `VZJ48bbVYrIynw8DdSukWw`
- Primary frame: `38201:109592` (`Tooltip-Main`)
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
- `CloseAction` (optional): close button using icon `ctrl-close-16` (`12x12` icon with `4px` padding, `20x20` frame).
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
- Header internal gap (title/close): `4px`.
- Close button frame: `20x20` (icon `12x12` with `4px` padding).
- Panel border: `1px solid`.
- Border radius: none in inspected IDS frame (square panel corners).
- Elevation: drop shadow `x:1 y:1 blur:2 rgba(37,37,37,0.25)`.
- Text block width sample: tooltip container `216`, title line sample `208`; runtime width is content-constrained within host max width.

Arrow geometry contract:
- Up/down pointer triangle: `10x6`.
- Left/right pointer triangle: `6x10`.
- Arrow position axis: `start | center | end` for each side.
- Trigger-to-tooltip spacing (with arrow): `16px` (runtime positioner side offset).
- Storybook-calibrated arrow alignment insets:
  - Top/Bottom `start`: `left: 8px`
  - Top/Bottom `end`: `left: calc(100% - 18px)`
  - Left/Right `start`: `top: 8px`
  - Left/Right `end`: `top: calc(100% - 18px)`
- Left/Right arrow attachment calibration:
  - Arrow container offset: `left/right: -5px`
  - Border-notch masking offsets: `start: 7px`, `center: calc(50% - 6px)`, `end: calc(100% - 19px)`
- Supported permutations: `4 sides x 3 alignments = 12`.
## Tokens
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
6. optional `Header`
7. `BodyContent`
8. optional `CloseAction`

Variant/option matrix:
- Content mode: `header=false|true`.
- Close mode: `closable=false|true`.
- Arrow placement: `side x arrowAlign` -> 12 valid combinations (arrow always rendered).

Per-slot style contract:
- `TooltipPanel`: background/border/shadow/padding from tokens above.
- `Header`: Body 2 Medium + strong text token.
- `BodyContent`: Body 2 + neutral text token; accepts arbitrary content/slots.
- `CloseAction`: renders icon component with `shapeName="ctrl-close-16"` at `12x12` within `20x20` frame with `4px` padding.
- `Arrow`: shares panel surface and border tokens; size/rotation depends on side and must apply the alignment/attachment calibration values above.

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
- Missing title -> omit header slot; do not render empty heading element.
- Missing content -> render nothing and emit generation validation error.

Validation checklist (pass/fail):
- [ ] All 12 arrow permutations render correctly (`side x align`).
- [ ] `closable=false` auto-dismisses on leave/blur.
- [ ] `closable=true` does not auto-dismiss on leave; closes on close action.
- [ ] Close event emits with deterministic reason payload.
- [ ] `ctrl-close-16` icon is used for close at `12x12` within `20x20` frame with `4px` padding.
- [ ] Body content supports arbitrary consumer-provided content.
- [ ] Only semantic tokens are used; no hardcoded colors in generated styles.
## Source Mapping
- IDS map file: `data/component-figma-map.json` (`Tooltip` entry).
- Primary Figma frame: `38201:109592`.
- Arrow matrix source symbols:
  - Down: `38201:109593`, `38201:109603`, `38201:109613`
  - Up: `38201:109623`, `38201:109633`, `38201:109643`
  - Right: `38201:109653`, `38201:109663`, `38201:109673`
  - Left: `38201:109683`, `38201:109693`, `38201:109703`

## Changelog
- **2026-06-05**: Removed `showArrow` from runtime API; IDS tooltip always renders the directional arrow per Figma (12 placement variants).
- **2026-06-02**: Fixed tooltip close icon color in dark mode to `#4D4D4D`. Changed in `storybook/src/components/IdsTooltip.module.css` lines 238-242.
- **2026-06-02**: Fixed tooltip header spacing to `4px` between content and close icon frame. Changed in `storybook/src/components/IdsTooltip.module.css` line 208.
- **2026-06-02**: Fixed tooltip close icon from `shape-x` to `ctrl-close-16.svg` and updated sizing to `12px` icon with `4px` padding (`20px` frame). Changed in `storybook/src/components/IdsTooltip.tsx` line 141 and `storybook/src/components/IdsTooltip.module.css` lines 225-243.
- **2026-06-02**: Fixed tooltip border position to be inside the container by adding `box-sizing: border-box` to `.popup` class. Changed in `storybook/src/components/IdsTooltip.module.css` line 21.
- **2026-06-02**: Fixed tooltip border-radius from `var(--corner-radius-radius-8)` to `0px` to match design spec (square panel corners). Changed in `storybook/src/components/IdsTooltip.module.css` line 17.
