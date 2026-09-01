<!-- ds:inherits root-spec -->
# Alert (IDS)

Unified specification for **Global** (application banner) and **Inline** (contextual) alerts. One logical component family with `display: global | inline`; layout tokens and severity palettes differ by display.

## Metadata

| Property | Value |
|---|---|
| Component | Alert |
| Design system | IDS |
| Category | Alerts and Notifications |

### Source mapping — Global (banner)

| Property | Value |
|---|---|
| Figma file key | `VZJ48bbVYrIynw8DdSukWw` |
| Main layout node | `11067:54641` |
| Main showcase node | `10829:75187` |
| Carousel element node | `10934:89861` |
| Source URL | https://www.figma.com/design/VZJ48bbVYrIynw8DdSukWw/-Exploration-only--IDS-with-variables?node-id=11067-54641&m=dev |
| Component map | `data/component-figma-map.json` → `Global Alert` |

### Source mapping — Inline (contextual)

| Property | Value |
|---|---|
| Figma file key | `VZJ48bbVYrIynw8DdSukWw` |
| Showcase / matrix node | `42903:139522` |
| Representative instances | Detailed row: `42903:139032` · Compact row: `42903:139071` |
| Source URL | https://www.figma.com/design/VZJ48bbVYrIynw8DdSukWw/-Exploration-only--IDS-with-variables?node-id=42903-139522&m=dev |
| Component map | `data/component-figma-map.json` → `Inline Alert` |
| Last Figma re-fetch | 2026-04-16 (`get_design_context`, `get_metadata`, `get_variable_defs`) |

### Additional inline scenario validation

| Property | Value |
|---|---|
| Figma file key | `0bHk3XhrjFhowgFkz9yLr4` |
| Validated node | `11946:230644` |
| Source URL | https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=11946-230644&m=dev |
| Scenario intent | Detailed inline alert with `title` + description/message and optional trailing controls (`link`, outlined `action`, dismiss icon) using the same inline token model |
| Verification method | `get_metadata` + `get_design_context` (Figma MCP) |
| Last Figma re-fetch | 2026-05-06 |
| Codegen blueprint verification | 2026-05-18 (Figma MCP `get_metadata` on global `11067:54641`, inline matrix `42903:139522`; structure aligned to `storybook/src/components/Alert.tsx`) |

### Compact inline — action + dismiss (`11946:230315`)

| Property | Value |
|---|---|
| Figma file key | `0bHk3XhrjFhowgFkz9yLr4` |
| Validated node | `11946:230315` |
| Source URL | https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=11946-230315&m=dev |
| Scenario intent | **Compact** `warning-minor` inline with message-only body, **outlined action** + **dismiss (×)** in trailing cluster — canonical reference for action/dismiss spacing and dismiss hit-target geometry |
| Verification method | `get_design_context` (Figma MCP) |
| Last Figma re-fetch | 2026-09-01 |
## Anatomy

### Component composition

### Single alert item (shared logical model)

Every rendered alert (global or inline) reflects **one** `AlertItem` at a time:

- **`severity`** — semantic state (see sets above).
- **Details** — primary copy (`message`); inline may also show optional **`title`** when `density = detailed`.
- **Link** — optional; see **Link contract** below.
- **Action** — optional text-style or outlined control per display rules.
- **Dismiss** — optional per display and severity defaults.

### Cross-component dependency contract (Button)

`Alert` must reuse IDS Button behavior/geometry for action controls instead of inventing alert-local button primitives.

- Canonical source: `components/ids/button/design-spec.md`
- Action control mapping:
  - Global alert action -> IDS Button **small** outlined signature (`24px` height, `2/16/2/16` padding, radius `2`)
  - Inline alert action -> IDS Button **small** outlined signature with alert-specific color tokens
- Runtime API for action remains `actionLabel` + `onAction`, but codegen should implement this by composing/reusing the project Button component when available (or faithfully mirroring Button spec signatures if the destination stack has no shared Button primitive yet).
- If Button spec and Alert spec conflict, Button geometry/interaction contracts win; Alert may only override semantic color tokens.

### Multi-alert (carousel) — `AlertGroup` (global only)

When multiple alert items must share **one** banner chrome:

- Use a container component **`AlertGroup`** (name is codegen-conventional; not a separate Figma node).
- **`AlertGroup`** owns: ordered **`items: AlertItem[]`**, **`activeIndex`** (0-based internally), optional add/remove policy, and **wrap vs clamp** for prev/next.
- **`Alert`** (`display="global"`) renders **one** banner; the group passes the **active** item’s fields (`message`, `link`, `action`, `severity`, …) plus **`carousel`**: `{ currentItem: activeIndex + 1, totalItems: items.length }` and **`onPrevious` / `onNext`** that update `activeIndex`.

**Do not** stack multiple `Alert` global roots for carousel mode; **one** root + **swapped** item content.

### Deterministic render order

Framework-agnostic slot trees and optional branches are defined in **Codegen Contract → Deterministic structure** (do not duplicate ad-hoc hierarchies in generated code).
## Layout & Measurements

### Global

- Root: `width: 100%`, `align-items: flex-start`, single horizontal row (no wrapping into stacked rows); no `min-height` constraint.
- Leading padding: `var(--padding-padding-20)` when **no** carousel (`[data-carousel="false"]` / absent); content area gets `padding-left: 148px` when carousel rail is present to offset the absolutely-positioned rail.
- Carousel rail: **absolutely positioned** — `position: absolute; top: -1px; bottom: -1px; left: -1px; width: 132px`; carries `border: var(--border-width-border-1) solid; border-color: inherit` matching the root severity border on all 4 sides.
- Content row: vertical padding `var(--padding-padding-10)`, gap `var(--spacing-space-8)`.
- Actions row — two states:
  - **Dismiss-only** (default): `align-items: flex-start; padding: var(--padding-padding-14) var(--padding-padding-16)`.
  - **With action** (`data-has-action="true"`): `align-items: center; padding: var(--padding-padding-8) var(--padding-padding-16)`.
  - `gap: var(--spacing-space-16)` applies in both states.
- Status icon: `16×16`; carousel/dismiss chevrons: `12×12` (via icon `style` prop; button wrapper is `width: auto; height: auto; padding: 0`, not a fixed `24×24` box).

### Inline (from Figma `InlineAlert` instances `42903:139032`, `42903:139071`)

- Root: `width: 100%`, `box-sizing: border-box`, `justify-content: space-between`, `align-items: flex-start`, `gap: var(--spacing-space-12)` (between content and trailing), `padding-left: var(--padding-padding-20)`, **no corner radius** (`border-radius: 0`), `border: var(--border-width-border-1) solid` + **severity border token** (Figma semantic “transparent” alerting border variables), **background** = severity **`-light`** alerting background token.
- Sample widths from refetched matrix node:
  - Compact row references: `1057px` (`42903:139071` family), runtime still container-driven.
  - Detailed row references: `631px` (`42903:139032` family), runtime still container-driven.
- **Accent rail treatment:** all severities use a `::before` pseudo-element (`position: absolute; left: -1px; top: -1px; bottom: -1px; width: 4px; background: var(--inline-rail)`) so the rail sits on top of the border in both light and dark mode. `box-shadow: inset` must not be used — in dark mode the border tokens are opaque and would cover the rail.
  `warning-minor` overrides `::before` to add `border: 1px solid var(--color-border-alerting-warning-accessible)` on all 4 sides of the rail, with `box-sizing: border-box`.
- **Compact** (`density: compact`): root `min-height: var(--scale-40)`; content row `padding-block: var(--padding-padding-10)`; text block (`inlineText`) `padding-right: var(--padding-padding-16)`; trailing cluster `height: var(--scale-40); align-items: center; padding: var(--padding-padding-8) var(--padding-padding-16)`.
- **Detailed** (`density: detailed`): `min-height: 68px` (Figma reference frame `1000×68`; width remains container-driven); content row `padding-block: var(--padding-padding-12)`; text block `padding-right: var(--padding-padding-16)`; trailing `align-items: flex-start; padding: var(--padding-padding-16) 17px var(--padding-padding-16) 0`; **outlined action** aligns with content row top (`12px` from alert root) via `margin-top: calc(var(--padding-padding-12) - var(--padding-padding-16))` — **dismiss (x) is not offset** and remains at trailing `16px` top inset; action button may render inline with title (`gap: 4px`) inside the title row when `density="detailed"` + `title` present (see **Implementation Notes**).
- **Trailing cluster gap (action ↔ dismiss):** when both **outlined action** and **dismiss** render inside `TrailingControls` / `.inlineTrailing`, horizontal gap is **`var(--spacing-space-16)`** (**16px**) for **both** compact and detailed densities (Figma compact `11946:230315`, `11946:230538`; detailed with both controls `42903:139032`). Applies regardless of `data-has-action`; single-child trailing rows ignore gap. **Do not** add extra left padding on the dismiss control — symmetric dismiss padding + negative margin preserves the 16px flex gap (see **Implementation Notes → Dismiss button**).
- **Typography:** title = **Body 1** — `var(--font-size-body-1)` / `var(--font-line-height-line-height-24)` / `font-weight: 500`; message (compact and detailed) = **Body 2** `font-weight: 400`; text color `var(--color-static-gray-900)`.
- **Inline link** in message: `var(--color-static-brand-500)`, underlined (inherits shared link utility).
- **Action** (when present): **outlined** control — `border: var(--border-width-border-1) solid var(--color-border-brand-base)`, label `var(--color-text-brand-strong)`, `font-weight: 400` (Body 2 regular per Figma `11946:230315`; reuses IDS Button small outlined geometry), `padding: var(--padding-padding-2) var(--padding-padding-16)`, `border-radius: var(--corner-radius-radius-2)`, `font-size: var(--font-size-body-2)` / `line-height: var(--font-line-height-line-height-20)`, `white-space: nowrap`.
- **Dismiss** icon (`Icon` component, `shape-x`, `12×12`): visual size `var(--scale-12)`; **minimum** hit target `var(--scale-32)` via symmetric `padding: var(--padding-padding-10)` + `margin: calc(-1 * var(--padding-padding-10))` on the dismiss button (negative margin must not consume the 16px trailing-cluster gap).

#### Detailed all-details scenario (`11946:230644`) visual checklist

- Sample frame size: `1000 x 68` (reference only; runtime remains container-driven width).
- Root surface: `border: 1px solid var(--color-border-alerting-critical-base-transparent)`, `background: var(--color-background-alerting-critical-light)`, `padding-left: 20px`, no corner radius.
- Inset rail: `::before` pseudo-element `left: -1px; top: -1px; bottom: -1px; width: 4px; background: var(--color-background-alerting-critical-base)`.
- Content row: `gap: 8px`, `padding-block: 12px`; icon slot renders `status-critical-square-solid` at `16x16`.
- Text block: title uses Body 1 (`16/24`), message uses Body 2 (`14/20`), message color `var(--color-static-gray-900)`.
- Trailing controls: outlined action button (`padding 2/16`, radius `2`, border brand-base, label brand-strong) aligned to content row top (`12px` via action-only negative margin); dismiss icon at trailing cluster `16px` top inset (unchanged); **gap between action and dismiss: `var(--spacing-space-16)`** when both are in the trailing cluster; link behavior/appearance follows inline link contract and does not change other visual attributes.

#### Compact action + dismiss scenario (`11946:230315`) visual checklist

- Sample frame size: `1000 × 40` (reference only; runtime remains container-driven width).
- Root surface: `warning-minor` light background, minor border token, `padding-left: 20px`, inset `::before` rail (4px minor base + warning-accessible edge).
- Content row: `gap: 8px`, `padding-block: 10px`; leading icon `status-warn-tri-solid` at `16×16`.
- Message: Body 2 (`14/20`), `font-weight: 400`, `var(--color-static-gray-900)`.
- Trailing cluster: `height: 40px`, `align-items: center`, `padding: 8px 16px`, `gap: 16px` between outlined action and dismiss.
- Outlined action: border `var(--color-border-brand-base)`, label `var(--color-text-brand-strong)`, Body 2 regular (`font-weight: 400`).
- Dismiss: `shape-x` at `12×12`; button uses symmetric `10px` padding + `-10px` margin for `32×32` hit target without widening the action↔dismiss gap.
## Tokens

### Global — severity surfaces (banner)

Use global alerting **solid** banner tokens (see global Figma): informational / major / minor / critical backgrounds and transparent borders; carousel rail uses **strong** background tokens only:

- `var(--color-background-alerting-critical-strong)` | `var(--color-background-alerting-major-strong)` | `var(--color-background-alerting-minor-strong)` | `var(--color-background-alerting-info-strong)`

Chevron tinting: white on `critical`, `warning-major`, `informational` rails; black on `warning-minor` rail (neutral SVG assets may need `filter`).

### Inline — severity surfaces (Figma “light tint + solid rail”)

Per-instance semantics from Figma variables (`get_variable_defs` on `42903:139522` / instance exports): root fill uses **`*-light`** alerting backgrounds; root border uses **`*-transparent`** alerting border tokens (semantic names; resolved values come from canonical `components/ids-theme.css` used by Storybook and generated outputs); inset rail uses the **solid** alerting background for that severity (e.g. `var(--color-background-alerting-info-base)`).

| Severity | Background | Border | Inset rail (4px) | Leading icon (`shapeName`, `16x16`) + color |
|---|---|---|---|---|
| informational | `var(--color-background-alerting-info-light)` | `var(--color-border-alerting-info-base-transparent)` | `var(--color-background-alerting-info-base)` | `info-circ-solid` + `var(--color-icon-alerting-info-base)` |
| success | `var(--color-background-alerting-success-light)` | `var(--color-border-alerting-success-base-transparent)` | `var(--color-background-alerting-success-base)` | `status-ok-circ-solid` + `var(--color-icon-alerting-success-base)` |
| warning-minor | `var(--color-background-alerting-minor-light)` | `var(--color-border-alerting-minor-base)` | `var(--color-background-alerting-minor-base)` (+ warning-accessible edge `Color/Border/Alerting/Warning-Accessible` on explicit rail layer) | `status-warn-tri-solid` + `var(--color-icon-alerting-minor-base)` |
| warning-major | `var(--color-background-alerting-major-light)` | `var(--color-border-alerting-major-base-transparent)` | `var(--color-background-alerting-major-base)` | `status-error-diamond-solid` + `var(--color-icon-alerting-major-base)` |
| critical | `var(--color-background-alerting-critical-light)` | `var(--color-border-alerting-critical-base-transparent)` | `var(--color-background-alerting-critical-base)` | `status-critical-square-solid` + `var(--color-icon-alerting-critical-base)` |

Inline **message link** and **outlined action** use **static brand** tokens above, not legacy “slate” border/background pairs.
## States (Light Theme)

### Inline (`display: inline`)

Structural states follow **`density`** (compact vs detailed) and optional slots (title, link, action, dismiss). Surface tokens per severity:

| Severity | Root background | Root border | Inset rail | Title / body text | Icon | Link | Action border | Action label |
|---|---|---|---|---|---|---|---|---|
| informational | `var(--color-background-alerting-info-light)` | `var(--color-border-alerting-info-base-transparent)` | `var(--color-background-alerting-info-base)` | `var(--color-static-gray-900)` | `var(--color-icon-alerting-info-base)` | `var(--color-static-brand-500)` | `var(--color-border-brand-base)` | `var(--color-text-brand-strong)` |
| success | `var(--color-background-alerting-success-light)` | `var(--color-border-alerting-success-base-transparent)` | `var(--color-background-alerting-success-base)` | `var(--color-static-gray-900)` | `var(--color-icon-alerting-success-base)` | `var(--color-static-brand-500)` | `var(--color-border-brand-base)` | `var(--color-text-brand-strong)` |
| warning-minor | `var(--color-background-alerting-minor-light)` | `var(--color-border-alerting-minor-base)` | `var(--color-background-alerting-minor-base)` | `var(--color-static-gray-900)` | `var(--color-icon-alerting-minor-base)` | `var(--color-static-brand-500)` | `var(--color-border-brand-base)` | `var(--color-text-brand-strong)` |
| warning-major | `var(--color-background-alerting-major-light)` | `var(--color-border-alerting-major-base-transparent)` | `var(--color-background-alerting-major-base)` | `var(--color-static-gray-900)` | `var(--color-icon-alerting-major-base)` | `var(--color-static-brand-500)` | `var(--color-border-brand-base)` | `var(--color-text-brand-strong)` |
| critical | `var(--color-background-alerting-critical-light)` | `var(--color-border-alerting-critical-base-transparent)` | `var(--color-background-alerting-critical-base)` | `var(--color-static-gray-900)` | `var(--color-icon-alerting-critical-base)` | `var(--color-static-brand-500)` | `var(--color-border-brand-base)` | `var(--color-text-brand-strong)` |

**Dismiss** control: `Icon` component tinted with `var(--color-icon-gray-black)` on default surface; hover/focus per **Interactions**.

**Detailed all-details scenario:** a detailed inline alert may concurrently render title + body/message + inline link + outlined action + dismiss icon. This is a valid composition and should be represented in generated examples/tests.

### Global (`display: global`)

Root row + carousel rail row per severity (informational, warning-major, warning-minor, critical) — from global Figma mapping (`11067:54641`).

| Severity | Text color | Status icon `shapeName` | Icon `variant` | Icon notes | Dismiss icon color |
|---|---|---|---|---|---|
| `critical` | `var(--color-text-gray-white)` | `status-critical-square-solid-ko` | `img` | — | `var(--color-icon-gray-white)` |
| `warning-major` | `var(--color-text-gray-black)` | `status-error-diamond-solid-ko` | `mask` | `color="var(--color-icon-gray-white)"` | `var(--color-icon-gray-black)` |
| `warning-minor` | `var(--color-text-gray-black)` | `status-warn-tri-solid` | `inline` | SVG injected via `iconInlineRegistry.ts`; `.st0`/`.st1` (triangle) → `var(--color-icon-gray-black)`, `.st2` (exclamation) → `var(--color-icon-gray-white)` | `var(--color-icon-gray-black)` |
| `informational` | `var(--color-text-gray-white)` | `info-circ-solid-ko` | `img` | — | `var(--color-icon-gray-white)` |

Dismiss icon always uses `variant="mask"`.

**Carousel count color:** the count text lives inside the carousel rail (strong background token), so its color is **independent of the root message text color**. All severities use `var(--color-text-gray-white)` for the count — including `warning-major` whose root message text is `var(--color-text-gray-black)`.

**`showDismiss` logic (global):** `(dismissible ?? true) && (severity !== "critical" || (showCarousel && !showAction))`.
- Non-critical severities: always show dismiss unless `dismissible={false}`.
- `critical`: dismiss is shown **only** when a carousel is present AND no action button — `dismissible={true}` alone cannot override this for `critical` + action.

#### Global typography

| Element | `font-weight` | `font-variation-settings` | Notes |
|---|---|---|---|
| Message (`.globalMessage`) | `400` | `'wdth' 100` | No explicit `font-family` override |
| Inline link / link button | `400` | `'wdth' 100` | — |
| Action button label | `500` | `'wdth' 100` | — |
| Carousel count | `400` | `'wdth' 100` | `white-space: nowrap` |
## States (Dark Theme)

Use the same **semantic token names**; resolved values are defined per theme in `components/ids-theme.css` (and Storybook mirrors). **Inline** surfaces must stay structurally parallel to Light: background, border, inset rail, typography, link, and action tokens reference the same `var(--...)` names so theme switching does not fork component logic.

**Global** carousel / banner tokens follow the global dark block in the same file.
## Interactions

- **Dismiss**, **action**, **link**, **carousel prev/next** emit distinct events.
- **Global carousel:** `Alert` does **not** own list state; `AlertGroup` (or app shell) does.
- **Inline:** no carousel; one item per component instance.
- Default dismissibility (global): non-critical severities show dismiss unless `dismissible={false}`; `critical` shows dismiss **only** when carousel is present AND no action button — even `dismissible={true}` cannot override this for the critical + action combination (see `showDismiss` logic in **States → Global**).
## Composition & API (runtime)

### `Alert` (single surface)

**Required**

- `display: "global" | "inline"`
- `message: string`

**Optional (both)**

- `severity` (per display set)
- `link`: `{ label: string; href?: string; routerLink?: string | any[] }` (see Link contract)
- `actionLabel`, `onAction`
- `dismissible`, `onDismiss`
- `onLinkClick`

**Global-only**

- `carousel?: { currentItem: number; totalItems: number; onPrevious?: () => void; onNext?: () => void }`

**Inline-only**

- `title?: string`
- `density?: "compact" | "detailed"`

### `AlertGroup` (global, multi-item)

- `items: AlertItem[]`
- `activeIndex` (internal)
- Renders **one** `Alert` with `display="global"` bound to `items[activeIndex]` and `carousel` counter + handlers.
### Display modes

| `display` | Role | Carousel | Typical container |
|---|---|---|---|
| `global` | Full-width application alert banner | Optional **carousel rail** when multiple items are active | Viewport / shell |
| `inline` | Contextual alert in page content | **Not used** (one item per instance) | Form, card, panel |

### Severity sets

- **Global:** `critical | warning-major | warning-minor | informational` (Figma global matrix).
- **Inline:** `critical | warning-major | warning-minor | informational | success` (success is **inline-only**; global codegen should reject or map `success` → validation error / fallback per product rules).

### Link contract

Do not pass a single ambiguous URL string as the only navigation input. Codegen should emit:

| Field | Use |
|---|---|
| `link.label` | Visible text |
| `link.href` | External / full URL / standard navigation URL |
| `link.routerLink` | **Angular:** in-app route command (`string` or `any[]`); mutually exclusive with `href` in generated templates |
| `onLinkClick` | Host handler; may `preventDefault` on anchor |

**Rule:** If `routerLink` is set, render `RouterLink`; if `href` is set (and not `routerLink`), render `<a href>`. If only `label` + `onLinkClick`, render button-styled control.
## Codegen Contract (Framework-Agnostic Blueprint)

Deterministic structure:

**Optional host wrapper (global multi-item only):**

- `AlertGroupRoot` (state owner: `items[]`, `activeIndex`; not a separate Figma chrome node)
  - renders exactly one `Alert` with `display="global"` bound to the active item

**`Alert` — global (`display="global"`):**

1. `AlertRoot` (`role="alert"`, `aria-live="assertive"` when banner is dynamically updated)
2. optional `CarouselRail` (only when `carousel` is provided / `AlertGroup` mode)
   - `CarouselPreviousButton` (native `button`, chevron `12×12`)
   - `CarouselCount` (text: **1-based** `currentItem` of `totalItems`)
   - `CarouselNextButton` (native `button`, chevron `12×12`)
3. `ContentRow`
   - `LeadingStatusIcon` (shared `Icon`, `16×16`, severity → `shapeName` map in **Tokens**)
   - `Message` (required copy)
   - optional `InlineLink` (reading order after message when `link` is set)
4. `ActionsRow`
   - optional `ActionButton` (IDS Button **small** outlined; see Button spec)
   - optional `DismissButton` (icon control, `12×12` glyph, `32×32` min hit target)

**`Alert` — inline (`display="inline"`):**

1. `AlertRoot` (`role="alert"`) — full-width row; **4px inset leading rail** via `::before` pseudo-element (`left: -1px; top: -1px; bottom: -1px; width: 4px`) — not `box-shadow`, which renders behind the border and is hidden in dark mode
2. `ContentRow` (`inlineMain`) — `flex: 1 1 auto`, `gap: var(--spacing-space-8)`
   - `LeadingIcon` — shared `Icon` at `16×16`; vertical nudge `4px` (detailed) or `2px` (compact)
   - `ContentBlock` — column, `gap: var(--spacing-space-4)` (between title row and message); `padding-right: var(--padding-padding-16)`
     - optional `TitleRow` (`density="detailed"` + `title` present): flex row `gap: 4px` containing `Title` + optional `ActionButton`
     - optional `Title` only (detailed, no action)
     - `Message` (required)
     - optional `InlineLink`
3. `TrailingControls` — `shrink: 0`; `gap: var(--spacing-space-16)` between `ActionButton` and `DismissButton` when both present; compact: `height: 40px; align-items: center; padding: var(--padding-padding-8) var(--padding-padding-16)`; detailed: `align-items: flex-start; padding: var(--padding-padding-16) 17px var(--padding-padding-16) 0`; detailed `ActionButton` only: `margin-top: calc(var(--padding-padding-12) - var(--padding-padding-16))` to align with content `padding-block` without moving dismiss
   - optional `ActionButton` (outlined IDS Button small) — compact only; detailed action is in `TitleRow`
   - optional `DismissButton`

Variant matrix:

- `display`: `global | inline`
- `severity`:
  - global: `critical | warning-major | warning-minor | informational`
  - inline: global set **plus** `success` (inline-only)
- `density`: `compact | detailed` (**inline only**; default `compact` when omitted)
- optional slots: `link` | `action` | `dismiss` (each independent; all may coexist on inline detailed rows per Figma `11946:230644`)
- `carousel`: `absent | present` (**global only**; when present, `totalItems >= 1`, `currentItem` is **1-based** in API)
- `AlertGroup`: `single-surface | multi-item-carousel` (host pattern; still one `AlertRoot` in DOM)

Per-slot style contract:

- All surfaces, borders, typography, icon tints, link, and action colors resolve via semantic tokens in **Tokens** and **States** tables (no hardcoded hex except documented structural samples).
- `ActionButton` geometry and interaction come from `components/ids/button/design-spec.md` (small outlined); Alert only overrides semantic colors per severity/display.
- `LeadingStatusIcon` / `LeadingIcon`: use canonical icon slugs from severity table; compose through shared `Icon` (`variant="img"` when required for multi-hue assets or carousel chevron filters on global rails).

Asset resolution + bundling contract:

- Resolve icons from `assets/icons/<shapeName>.svg` (or project bundler equivalent).
- Global status icons and inline solid icons use the slug map in **Tokens / States → Global**; carousel chevrons use `chev-left-16` / `chev-right-16`.
- **Do not embed standalone inline `<svg>` factories** in generated Alert modules. Exception: `warning-minor` global uses `variant="inline"` routed through the shared `Icon` component + `iconInlineRegistry.ts` — this is acceptable because it still composes through the system `Icon` primitive; the registry handles SVG injection and class-based tinting (`.st0`/`.st1` → `var(--color-icon-gray-black)`, `.st2` → `var(--color-icon-gray-white)`).

Behavior contract:

- **Single surface:** one `Alert` instance renders one logical `AlertItem` at a time; inline never nests carousel.
- **Carousel / group:** `Alert` does not own `items[]` or `activeIndex`; `AlertGroup` (or app shell) updates index and passes `carousel` + active fields into one global `Alert`.
- **Events:** `onDismiss`, `onAction`, `onLinkClick`, `onPrevious`, `onNext` are distinct; generators must not collapse them into a single generic handler.
- **Dismiss:** when `dismissible` is false, omit `DismissButton` and ignore `onDismiss`; when true, remove/hide the alert surface after dismiss (implementation may use local state).
- **Default dismissibility (global):** non-critical severities render dismiss unless `dismissible={false}`; `critical` renders dismiss only when carousel is present AND no action button — `dismissible={true}` alone does not force dismiss on critical + action. See `showDismiss` logic in **States → Global**.
- **Carousel navigation:** prev/next update `activeIndex` on the host; at bounds, clamp or wrap per product policy (document choice in generated module header; Storybook uses clamp).
- **Link navigation:** apply **Link contract** — `routerLink` vs `href` vs label-only + `onLinkClick`; never emit ambiguous single-string navigation API for Angular targets.

Accessibility contract:

- `AlertRoot`: `role="alert"`; global banners that update when carousel index changes use `aria-live="assertive"` on the root (or equivalent live region on the swapping content region).
- **Carousel:** `CarouselPreviousButton` / `CarouselNextButton` are native `button` elements with `aria-label="Previous alert"` and `aria-label="Next alert"`; disable at bounds when using clamp semantics.
- **Dismiss:** `DismissButton` is a native `button` with `aria-label="Dismiss alert"`; minimum **32×32** px hit target (`var(--scale-32)`) while glyph remains `12×12`.
- **Action:** reuse Button accessibility from IDS Button spec (`button` type, visible focus ring, keyboard activation).
- **Link:** when rendered as `<a>`, expose meaningful link text from `link.label`; when button-styled fallback, name matches label.
- **Keyboard:** dismiss, action, link (when focusable), and carousel controls are tab-focusable and activatable with `Enter` / `Space` per native control semantics.
- **Color/contrast:** severity palettes must use semantic tokens so light/dark themes stay parallel without forking structure.

Fallback/error rules:

- `display="global"` + `severity="success"` → **validation error** (or explicit product map to `informational` documented in app config; default is error).
- Unknown `severity` for active `display` → fallback to `informational`.
- Unknown `density` on inline → fallback to `compact`.
- Missing or empty `message` → validation error.
- `carousel` on inline → validation error.
- `title` on global → validation error (or ignore with dev warning; prefer validation error).
- Unknown icon slug → hide leading icon slot, continue rendering message (log in dev).
- `iconOnly` / invalid Button props on action → defer to Button spec fallbacks.
- Both `link.href` and `link.routerLink` set → prefer `routerLink` for Angular targets; for other frameworks, document precedence in adapter.

Validation checklist:

- [ ] `Deterministic structure` matches generated DOM for both `display` modes (no duplicate global roots for carousel).
- [ ] Variant matrix: all valid `display` × `severity` × optional slot combinations documented; global rejects `success`.
- [ ] Action controls reuse IDS Button small outlined contract, not alert-local button CSS.
- [ ] Icons use shared `Icon` + canonical slugs from **States → Global** table; no standalone inline SVG factories (warning-minor `variant="inline"` via `iconInlineRegistry.ts` is acceptable — it routes through the shared `Icon` primitive).
- [ ] Link contract supports `href` and `routerLink` without ambiguity.
- [ ] Global carousel uses **1-based** `currentItem` in API and labeled prev/next controls.
- [ ] Inline inset rail uses `::before` pseudo-element (`left: -1px; top: -1px; bottom: -1px; width: 4px`) + severity solid token; `warning-minor` adds `border: 1px solid var(--color-border-alerting-warning-accessible)` on all 4 sides.
- [ ] Light/dark state tables remain parallel (same `var(--...)` names).
- [ ] Dismiss hit target ≥ `32×32` on inline and global.
- [ ] Inline trailing cluster: `var(--spacing-space-16)` gap between outlined action and dismiss when both present (compact + detailed).
- [ ] Detailed inline action top aligns with content `padding-block` (`12px`); dismiss (x) remains at trailing `16px` top inset.
- [ ] `role="alert"` and live-region behavior verified for dynamic global updates.
- [ ] Fallback rules tested for invalid display/severity/density and missing icon slug.
### Reusable component generation contract

Code generator outputs should be reusable primitives, not one-off story/demo code:

- Generate a single reusable `Alert` component (display-driven) with stable typed inputs/outputs.
- Generate an optional reusable `AlertGroup` wrapper for host-owned multi-item global carousel state.
- Do not embed app-specific text, routes, or business logic in generated component internals.
- Keep icon and button composition through shared system primitives (`Icon`, `Button`) when those components exist in destination library.
- Keep framework adapters thin: Angular/React/Vue wrappers map framework events to the same conceptual API (`dismiss`, `action`, `link`, `previous`, `next`).
- Ensure all styling remains token-driven (`var(--...)`) with no hardcoded visual constants except Figma-documented structural exceptions (e.g., carousel inner gap `22px`).

### Production-ready SDD gate

- [ ] Metadata includes both global and inline source nodes and canonical Figma URLs.
- [ ] Deterministic anatomy/slot order is explicit for both `display` modes.
- [ ] Variant matrix is explicit (`display`, severity set by display, density, link/action/dismiss, carousel).
- [ ] Action button contract explicitly reuses IDS Button spec (not ad-hoc alert button).
- [ ] Link contract includes `href` vs `routerLink` disambiguation for Angular generation.
- [ ] Fallback/error behavior is defined for invalid `display`/severity combinations and missing optional slots.
- [ ] Accessibility roles, labels, keyboard behavior, and live-region behavior are specified.
- [ ] Asset contract uses canonical icon slugs and shared Icon primitive; no standalone inline SVG fallback functions (warning-minor global uses `variant="inline"` through `iconInlineRegistry.ts`, which is the shared Icon primitive — acceptable).
## Source Mapping

### Storybook reference

- `storybook/src/components/Alert.tsx` — unified implementation (`display` prop)
- `storybook/src/components/Alert.stories.tsx` — **IDS/Alert** (single entry; global vs inline via `display`)
- `storybook/src/components/GlobalAlert.tsx` / `InlineAlert.tsx` — optional thin re-exports for app code; not separate Storybook entries
- Lib React implementation (no Base UI): `lib/react/ids/alert/` (`IdsAlert.tsx`, `IdsAlertGroup.tsx`, `IdsAlert.module.css`; selectors `ids-alert-global`, `ids-alert-inline`, …); stories: `storybook/src/components/lib-generated/Alert.stories.tsx`

---

## Implementation Notes - Global Alert

**Layout & structure**
- **Global root**: no `min-height`; `align-items: flex-start`; no `gap`. Non-carousel adds `padding-left: var(--padding-padding-20)` via `:not([data-carousel="true"])` selector
- **Carousel rail**: `position: absolute; top: -1px; bottom: -1px; left: -1px; width: 132px; gap: var(--spacing-space-24)` — overlaps root border on all 4 sides. Full `border: var(--border-width-border-1) solid; border-color: inherit` matches the root severity color. `.globalContent` gets `padding-left: 148px` when carousel is present
- **Carousel chevrons**: `chev-left-16` / `chev-right-16` via `variant="img"`; auto-sized to icon (no wrapper width/height)
- **Carousel count**: `font-weight: 400; white-space: nowrap` — color varies by severity (see Colors)
- **Actions trailing area** (`.globalActions`): driven by `data-has-action` attribute — `false` → `align-items: flex-start; padding-block: var(--padding-padding-14)`; `true` → `align-items: center; padding-block: var(--padding-padding-8)`. Both states use `padding-inline: var(--padding-padding-16)`
- **Dismiss button**: `padding: var(--padding-padding-10); margin: calc(-1 * var(--padding-padding-10))` — creates `var(--scale-32)` hit area around the `var(--scale-12)` icon; negative margin cancels the padding for layout so surrounding spacing is unaffected

**Colors**
- **Dismiss icon** — critical & informational: `color: var(--color-icon-gray-white)` + `filter: brightness(0) invert(1)` on icon; warning-major & warning-minor: `color: var(--color-icon-gray-black)` + `filter: none`
- **Action button** — critical & informational: `border-color: var(--color-border-gray-white); color: var(--color-text-gray-white)`; warning-major & warning-minor: `border-color: var(--color-border-gray-black); color: var(--color-text-gray-black)`
- **Warning-minor root color**: set `color: var(--color-text-gray-black)` on root — warning-minor background is light enough to require black text throughout. Warning-major root uses `color: var(--color-text-gray-white)` (white text on orange); only its action button and dismiss are overridden to black via per-severity selectors
- **Carousel count**: `color: var(--color-text-gray-white)` for critical, warning-major, and informational (dark rail backgrounds). Override to `color: var(--color-text-gray-black)` for warning-minor — its rail background (`color-background-alerting-minor-strong`) is light, matching the black chevron treatment

**Icons**
- **Critical**: `status-critical-square-solid-ko`, `variant="img"` — white fill, X cutout reveals red background
- **Warning-major**: `status-error-diamond-solid-ko`, `variant="mask"`, `color="var(--color-icon-gray-white)"` — diamond masked white, dash cutout reveals orange
- **Warning-minor**: `status-warn-tri-solid`, `variant="inline"` — register in `iconInlineRegistry.ts` via `warnMinorAlertIcon()`: strip `<style>` block, apply `fill:var(--color-icon-gray-black)` to `.st0`/`.st1` (triangle), `fill:var(--color-icon-gray-white)` to `.st2` (exclamation), strip root `<svg>` `width`/`height` only
- **Informational**: `info-circ-solid-ko`, `variant="img"` — white fill, i-mark cutout reveals blue background

**Typography**
- **Message, action button, link, carousel counter**: `font-weight: 400`

**Dismiss visibility logic**
- `showDismiss` = `(dismissible ?? true) && (severity !== "critical" || (showCarousel && !showAction))`
- Only **carousel** and **carousel + link** critical variants show dismiss (carousel present, no action). All other critical variants (plain, link-only, action, carousel + action) do not. `dismissible={false}` suppresses dismiss on any severity.

---

## Implementation Notes - Inline Alert

**Layout & structure**
- **Root**: `display: flex; align-items: flex-start; justify-content: space-between; gap: var(--spacing-space-12); width: 100%; box-sizing: border-box; padding-left: var(--padding-padding-20)`. Density class adds `min-height`: compact → `var(--scale-40)`; detailed → `68px`
- **`.inlineMain`**: `flex: 1 1 auto; display: flex; align-items: flex-start; gap: var(--spacing-space-8)`. Compact adds `padding-block: var(--padding-padding-10); padding-right: var(--padding-padding-8)`; detailed adds `padding-block: var(--padding-padding-12)`
- **`.inlineText`**: `flex: 1 1 auto; display: flex; flex-direction: column; align-items: flex-start; gap: var(--spacing-space-4); padding-right: var(--padding-padding-16)` — `spacing-4` between title row and message
- **`.inlineTitleRow`** (detailed + title): `display: flex; align-items: flex-start; gap: 4px; width: 100%`. Title: `flex: 1 1 auto; min-width: 0`; action button: `flex-shrink: 0`
- **`.inlineTrailing`**: `display: flex; flex-shrink: 0; align-items: flex-start; justify-content: flex-end; gap: var(--spacing-space-16)`
- **Compact `.inlineTrailing`**: `align-items: center; height: var(--scale-40); padding: var(--padding-padding-8) var(--padding-padding-16)`
- **Detailed `.inlineTrailing`**: `align-items: flex-start; padding: var(--padding-padding-16) 17px var(--padding-padding-16) 0`
- **Detailed trailing action offset**: `margin-top: calc(var(--padding-padding-12) - var(--padding-padding-16))` on `.inlineTrailing .inlineActionOutlined` only — dismiss (x) position unchanged
- **Action button placement**: `showTitle && showAction` → render action inside `.inlineTitleRow` (detailed only); otherwise render in `.inlineTrailing`
- **`showTrailing`**: `(!showTitle && showAction) || showDismiss`
- **Dismiss button**: `padding: var(--padding-padding-10); margin: calc(-1 * var(--padding-padding-10))` — `var(--scale-32)` hit area around `var(--scale-12)` icon; negative margin keeps surrounding spacing unaffected

**Typography**
- **Title** (detailed only): Body 1, `font-weight: 500`
- **Message** and **inline action button label**: Body 2, `font-weight: 400`

**Action button tokens**
- **Border**: `var(--color-border-brand-base)`
- **Text color**: `var(--color-text-brand-strong)`
- **Label weight**: `400` (Figma `11946:230315`; geometry from IDS Button small outlined)

**Severity tokens**
- **`--inline-rail`** and **`--inline-alert-icon`**: set per severity via `data-severity` attribute; rail rendered via `::before` (`left: -1px; top: -1px; bottom: -1px; width: 4px; background: var(--inline-rail)`) for all severities
- **Warning-minor rail**: same `::before` positioning but overrides `background` to `var(--color-background-alerting-minor-base)` and adds `border: 1px solid var(--color-border-alerting-warning-accessible); box-sizing: border-box`

**Dismiss visibility logic**
- `showDismiss` = `(dismissible ?? true) && severity !== "critical"` — critical inline never shows dismiss regardless of action or other props

**2026-09-01**
- Added compact validation node `11946:230315` (warning-minor + action + dismiss). Clarified inline action label `font-weight: 400` (was `500` in Layout). Compact trailing right padding aligned to `var(--padding-padding-16)` (Implementation Notes had `17px`). Dismiss hit-target rule explicit: symmetric padding + negative margin must not consume the 16px action↔dismiss gap.

**2026-08-09**
- `.inlineText`: vertical gap between the title row (title + optional action) and the message changed `0` → `var(--spacing-space-4)`; visible only in `density="detailed"` (title present), `compact` (message-only) unchanged. Source: `storybook/src/components/Alert.module.css`.
- Spec synced to code: **Anatomy → Component composition** (`ContentBlock` gap) and the `.inlineText` note above updated to `var(--spacing-space-4)`.

