# Badge Design Spec

## Metadata
- Component: Badge
- Design System: IDS
- Category: Alerts and Notifications
- Figma URL: https://www.figma.com/design/VZJ48bbVYrIynw8DdSukWw/-Exploration-only--IDS-with-variables?node-id=11446-99238&m=dev
- File key: `VZJ48bbVYrIynw8DdSukWw`
- Primary node: `11446:99238`
- Variant axes observed in node:
  - `Type`: `Default | Critical | Warning | Disabled | Success`
- Visual context observed in node (showcase-only, not runtime API axis):
  - `Background`: `Blue | White/Gray`
- Content sample in Figma: numeric count (`"1"`)
## Anatomy
Main component:
- `BadgeRoot`

Deterministic slot order:
1. `BadgeContainer`
2. `BadgeContent`

Optional slots:
- `BadgeLeadingIcon` (optional icon+text composition when required by consuming component)
- `BadgeSrOnlyText` (assistive-only contextual label)
## Layout & Measurements
- Geometry from Figma sample variants:
  - Height: `18px`
  - Horizontal padding: `5.5px` per side (runtime may use nearest tokenized equivalent if sub-pixel values are unsupported)
  - Border width: `1px`
  - Radius: `100px` (pill)
- Content alignment:
  - center/center inside pill
  - single-line text only
- Badge is shrink-to-content with minimum practical width defined by content + horizontal padding.
- Typography for content:
  - font family: `Roboto`
  - weight: `400`
  - size: `12px`
  - line-height ratio in sample: `1.758`
## Tokens
Required semantic tokens from Figma variable extraction:
- `var(--color-text-gray-white)` = `#ffffff`
- `var(--color-text-gray-black)` = `#252525`
- `var(--color-background-controls-base)` = `#0672CB`
- `var(--color-background-alerting-critical-base)` = `#af0000`
- `var(--color-background-alerting-minor-base)` = `#ffc700`
- `var(--color-background-alerting-success-base)` = `#1b8500`
- `var(--color-static-gray-500)` = `#757575`
- `var(--color-border-gray-white)` = `#ffffff`
- `var(--color-border-alerting-minor-base)` = `#9c622e`
- Optional host-context token for warning border showcase parity:
  - `var(--ids-badge-warning-border-color)` -> defaults to `var(--color-border-gray-white)`, can be overridden by host to `var(--color-border-alerting-minor-base)` in White/Gray showcase contexts.
## States (Light Theme)
| Variant key (`Type`) | Background | Border | Text |
|---|---|---|---|
| Default | `var(--color-background-controls-base)` | `var(--color-border-gray-white)` | `var(--color-text-gray-white)` |
| Critical | `var(--color-background-alerting-critical-base)` | `var(--color-border-gray-white)` | `var(--color-text-gray-white)` |
| Warning | `var(--color-background-alerting-minor-base)` | `var(--ids-badge-warning-border-color, var(--color-border-gray-white))` | `var(--color-text-gray-black)` |
| Disabled | `var(--color-static-gray-500)` | `var(--color-border-gray-white)` | `var(--color-text-gray-white)` |
| Success | `var(--color-background-alerting-success-base)` | `var(--color-border-gray-white)` | `var(--color-text-gray-white)` |
## States (Dark Theme)
Dark theme uses the same semantic tokens as **States (Light Theme)**. Resolved values for `[data-theme="dark"]` / `.ids-theme-dark` (and program overlays) live in theme CSS:

- `components/ids-theme.css`
- `components/<program>-theme.css` when a program overlays IDS (for example `components/dap-theme.css`)

Duplicate the full state matrix in this section only when a dark row genuinely uses different `var(--...)` references than the corresponding light row.

*(When Light and Dark tables would list identical `var(--...)` cells, keep the matrix under **States (Light Theme)** only and use this pointer section instead of a second table.)*
## Interactions
- Default Badge behavior is non-interactive (status/count indicator).
- If consuming implementation opts into interactivity (clickable badge):
  - cursor and focus handling are controlled by host component, not Badge itself.
  - visual colors in this spec remain unchanged unless explicit interactive variant is introduced.
- For numeric values of 999 or greater, hover/focus of the badge displays the full value in an `IdsTooltip` that is sized to hug its content.
- Badge content updates are data-driven; no internal state transitions are required.
## Composition & API (runtime)
Main inputs:
- `value: string | number` (required visual content)
- `type?: "default" | "critical" | "warning" | "disabled" | "success"` (default `"default"`)
- `as?: string` (optional semantic element, default `span`)
- `ariaLabel?: string` (optional explicit label when value alone is ambiguous)

Outputs:
- none (presentational/status component)
## Codegen Contract (Framework-Agnostic Blueprint)
Deterministic structure:
- `BadgeRoot`
  - `BadgeContainer`
    - `BadgeContent`

Variant matrix:
- `type`: `default | critical | warning | disabled | success`
- content form: `string | number`

Per-slot style contract:
- `BadgeContainer`
  - display: inline-flex
  - align-items / justify-content: center
  - height: 18px
  - border-width: 1px
  - border-style: solid
  - border-radius: 100px
  - warning border color should use `var(--ids-badge-warning-border-color, var(--color-border-gray-white))` so host showcase context can override to `var(--color-border-alerting-minor-base)` without introducing a new runtime variant axis.
  - horizontal padding: 5.5px per side (or closest deterministic tokenized fallback)
- `BadgeContent`
  - single line text
  - center aligned
  - typography as declared in Layout & Measurements

Behavior contract:
- Badge does not manage internal interaction state.
- All visual output is fully determined by (`type`, `value`).
- Blue/White-Gray is a showcase context in docs/stories and is not a runtime badge prop.
- Host may provide visual-context CSS overrides (for example warning border token) without changing Badge runtime props.

Accessibility contract:
- Non-interactive usage: render as text-level semantic element (`span`) with readable content.
- If value is purely numeric and context is missing, allow `ariaLabel` to provide meaning.
- If rendered interactive by host, host must provide button/link semantics and keyboard behavior.

Asset resolution + bundling:
- No icon/image assets required for baseline Badge contract.

Fallback/error rules:
- Unknown `type` -> fallback to `default`.
- Empty `value` -> render nothing or host-defined placeholder; treat as validation warning in codegen QA.
- Values longer than intended single-line count should not wrap; truncate/clip behavior must be explicit in generated output.

Validation checklist:
- [ ] All variant combinations map to explicit token triples (background/border/text).
- [ ] Light and Dark tables are structurally parallel.
- [ ] Runtime output is deterministic for (`type`, `value`).
- [ ] Badge remains single-line and pill-shaped.
- [ ] No hardcoded non-token colors are introduced in generated code.
## Source Mapping
| Source | Location |
|---|---|
| IDS root spec | `components/ids/root-spec.md` |
| IDS theme tokens | `components/ids-theme.css` |
| Component map | `data/component-figma-map.json` |
| Figma context node | `11446:99238` |
| Figma MCP extraction | `get_design_context` + `get_variable_defs` |
