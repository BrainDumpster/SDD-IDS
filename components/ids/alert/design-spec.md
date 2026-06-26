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
## Anatomy

### Reference mapping — [Clarity Alert](https://clarity.design/documentation/alert/code)

IDS alert anatomy is **Figma-first** (global banner + inline contextual). Clarity is a useful **composition reference**, not a visual source of truth.

| Clarity (Angular) | IDS codegen name | Role |
|---|---|---|
| `clr-alerts` | `AlertGroup` / `AlertGroupRoot` | Host for **multiple global** alerts; owns pager / `activeIndex` |
| `clr-alert` | `AlertRoot` | Single alert chrome (`display`: global ≈ app-level, inline ≈ lightweight/page) |
| `clr-alert-item` | `AlertItem` | One logical message surface (text + optional actions) |
| `.alert-text` / projected copy | `AlertMessage` | **Primary copy — composition slot** (not only a string prop) |
| `.alert-actions` | `AlertActions` | Optional trailing / inline action cluster |
| `clrAlertAppLevel` + pager | `display="global"` + `CarouselRail` | One banner chrome; swap active item |

**IDS differences from Clarity (intentional):**

- Global **ContentRow** and **ActionsRow** are **siblings** under `AlertRoot` (Figma layout), not nested inside a single `alert-item` wrapper — but composition children still map 1:1 to those regions.
- Inline uses a **4px inset rail** (`box-shadow`), not Clarity’s lightweight card.
- **Inline** never uses carousel; **global** group uses **one** `AlertRoot` + carousel rail (do not stack multiple global roots).

### Main components

| Component | When used |
|---|---|
| `AlertGroup` | Optional. **Global only.** Multiple alert items sharing one banner + carousel rail. |
| `Alert` (`AlertRoot`) | Always. One visible alert surface (`display: global \| inline`). |

### Child components — deterministic order

Use this order for composition APIs, Storybook markup, and codegen (accordion-style). Selector names are framework examples (`ids-alert-*` for Angular).

#### A. Single alert — `Alert` (`AlertRoot`)

**Global (`display="global"`)**

1. `AlertRoot` — `role="alert"`, `aria-live="assertive"` when content swaps (carousel)
2. `CarouselRail` *(optional; global + group / `carousel` present only)*
   - `CarouselPreviousButton`
   - `CarouselCount` (1-based `currentItem` of `totalItems`)
   - `CarouselNextButton`
3. `ContentRow`
   - `LeadingStatusIcon` — severity → icon slug (internal; not a public override slot unless documented)
   - `AlertContent` — text column wrapper
     - `AlertMessage` — **required** primary copy (**projected slot**; string `message` prop is shorthand fallback)
     - `AlertLink` *(optional; after message in reading order)*
4. `ActionsRow`
   - `AlertAction` *(optional; IDS Button small outlined)*
   - `AlertDismiss` *(optional; per dismiss rules)*

**Inline (`display="inline"`)**

1. `AlertRoot` — `role="alert"`; inset 4px rail via `box-shadow` (or `::before` for `warning-minor`)
2. `ContentRow` (`inlineMain`)
   - `LeadingIcon` — `16×16`; compact `+2px` / detailed `+4px` vertical nudge
   - `AlertContent`
     - `TitleRow` *(optional; `density="detailed"` + `AlertTitle` present)* — flex row `gap: 4px`
       - `AlertTitle` *(optional)*
       - `AlertAction` *(optional; detailed only — action in title row)*
     - `AlertTitle` *(optional; detailed, when no title-row action)*
     - `AlertMessage` — **required** projected slot
     - `AlertLink` *(optional)*
3. `TrailingControls` (`AlertActions` region)
   - `AlertAction` *(optional; compact only)*
   - `AlertDismiss` *(optional)*

#### B. Group of alerts — `AlertGroup` (global only)

```
AlertGroupRoot
  └── Alert [display="global"]  ← exactly one banner chrome
        ├── CarouselRail (when items.length > 1 or carousel mode)
        ├── ContentRow → … active AlertItem content …
        └── ActionsRow → … active AlertItem actions …
```

- `AlertGroup` owns `items[]`, `activeIndex`, wrap/clamp policy, and wires `carousel` + prev/next into the single `Alert`.
- **Do not** render multiple `AlertRoot` nodes for carousel mode.
- Each logical entry is an **`AlertItem`** (data object or composed child); only the **active** item’s slots are projected into the single `Alert`.

#### C. `AlertItem` (logical unit — composition or data)

Whether expressed as `items[]` or nested markup, one `AlertItem` supplies:

| Field / slot | Required | Notes |
|---|---|---|
| `severity` | per item in group; on `AlertRoot` for single | Global set vs inline set (inline adds `success`) |
| `AlertMessage` | **yes** | Replaces legacy `message: string`; slot may contain rich text / inline elements |
| `AlertTitle` | no | Inline `density="detailed"` only |
| `AlertLink` | no | Link contract (`href` / `routerLink`) |
| `AlertAction` | no | Composes IDS Button small outlined |
| `AlertDismiss` | no | Subject to global/inline dismiss rules |

### Single alert item (shared logical model)

Every rendered alert (global or inline) reflects **one** `AlertItem` at a time:

- **`severity`** — semantic state (see sets above).
- **Details** — primary copy via **`AlertMessage` slot** (preferred) or shorthand **`message`** string for demos/codegen; inline may also show optional **`AlertTitle`** when `density = detailed`.
- **Link** — optional `AlertLink`; see **Link contract** below.
- **Action** — optional `AlertAction` (IDS Button).
- **Dismiss** — optional `AlertDismiss`; per display and severity defaults.

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

The canonical slot trees are under **Anatomy → Child components — deterministic order** and **Codegen Contract → Deterministic structure**. Implementations must not invent alternate hierarchies.

**Composition example (inline, Clarity-style `alert-text` → `AlertMessage`):**

```html
<ids-alert display="inline" severity="informational" density="compact">
  <ids-alert-message>
    This is informational inline alert text for context.
  </ids-alert-message>
</ids-alert>
```

**Group example (global, maps to `clr-alerts` + pager):**

```html
<ids-alert-group [activeIndex]="index" (activeIndexChange)="index = $event">
  <ids-alert display="global" [carousel]="carouselState">
    <ids-alert-message>{{ items[index].copy }}</ids-alert-message>
    <ids-alert-action actionLabel="Fix" />
  </ids-alert>
</ids-alert-group>
```
## Layout & Measurements

### Global

- Root: `width: 100%`, `align-items: flex-start`, single horizontal row (no wrapping into stacked rows); no `min-height` constraint.
- Leading padding: `var(--padding-padding-20)` when **no** carousel (`[data-carousel="false"]` / absent); content area gets `padding-left: 148px` when carousel rail is present to offset the absolutely-positioned rail.
- Carousel rail: **absolutely positioned** — `position: absolute; top: -1px; bottom: -1px; left: -1px; width: 132px`; carries `border: var(--border-width-border-1) solid; border-color: inherit` matching the root severity border on all 4 sides.
- Content row: vertical padding `var(--padding-padding-10)`, gap `var(--spacing-space-8)`.
- Actions row — two states:
  - **Dismiss-only** (default): `align-items: flex-start; padding: 14px var(--padding-padding-16)`.
  - **With action** (`data-has-action="true"`): `align-items: center; padding: var(--padding-padding-8) var(--padding-padding-16)`.
  - `gap: var(--spacing-space-16)` applies in both states.
- Status icon: `16×16`; carousel/dismiss chevrons: `12×12` (via icon `style` prop; button wrapper is `width: auto; height: auto; padding: 0`, not a fixed `24×24` box).

### Inline (from Figma `InlineAlert` instances `42903:139032`, `42903:139071`)

- Root: `width: 100%`, `box-sizing: border-box`, `justify-content: space-between`, `align-items: flex-start`, `gap: var(--spacing-space-12)` (between content and trailing), `padding-left: var(--padding-padding-20)`, **no corner radius** (`border-radius: 0`), `border: var(--border-width-border-1) solid` + **severity border token** (Figma semantic “transparent” alerting border variables), **background** = severity **`-light`** alerting background token.
- Sample widths from refetched matrix node:
  - Compact row references: `1057px` (`42903:139071` family), runtime still container-driven.
  - Detailed row references: `631px` (`42903:139032` family), runtime still container-driven.
- **Accent rail treatment:** default is `box-shadow: inset 4px 0 0 0 var(--inline-rail)` where `--inline-rail` is the severity solid alerting background token.  
  `warning-minor` uses a dedicated `::before` pseudo-element with the same solid minor fill plus warning-accessible edge stroke token.
- **Compact** (`density: compact`): root `min-height: var(--scale-40)`; content row `padding-block: var(--padding-padding-10)`; text block (`inlineText`) `padding-right: var(--padding-padding-16)`; trailing cluster `height: 40px; align-items: center; padding: var(--padding-padding-8) var(--padding-padding-16)`.
- **Detailed** (`density: detailed`): height is content-driven (no `min-height`); content row `padding-block: var(--padding-padding-12)`; text block `padding-right: var(--padding-padding-16)`; trailing `align-items: flex-start; padding: var(--padding-padding-16) 17px var(--padding-padding-16) 0`; **outlined action** aligns with content row top (`12px` from alert root) via `margin-top: calc(var(--padding-padding-12) - var(--padding-padding-16))` — **dismiss (x) is not offset** and remains at trailing `16px` top inset; action button may render inline with title (`gap: 4px`) inside the title row when `density="detailed"` + `title` present (see **Implementation Notes**).
- **Trailing cluster gap (action ↔ dismiss):** when both **outlined action** and **dismiss** render inside `TrailingControls` / `.inlineTrailing`, horizontal gap is **`var(--spacing-space-16)`** (**16px**) for **both** compact and detailed densities (Figma compact `11946:230538`; detailed with both controls `42903:139032`). Applies regardless of `data-has-action`; single-child trailing rows ignore gap.
- **Typography:** title = **Body 1** — `var(--font-size-body-1)` / `var(--font-line-height-line-height-24)` / `font-weight: 500`; message compact = **Body 2** `font-weight: 400`; message detailed = **Body 2** `font-weight: 500`; text color `var(--color-static-gray-900)`.
- **Inline link** in message: `var(--color-static-brand-500)`, underlined (inherits shared link utility).
- **Action** (when present): **outlined** control — `border: var(--border-width-border-1) solid var(--color-border-brand-base)`, label `var(--color-text-brand-strong)`, `font-weight: 500`, `padding: var(--padding-padding-2) var(--padding-padding-16)`, `border-radius: var(--corner-radius-radius-2)`, `font-size: var(--font-size-body-2)` / `line-height: var(--font-line-height-line-height-20)`.
- **Dismiss** icon (`Icon` component): visual size `var(--scale-12)`; keep **minimum** hit target `var(--scale-32)` for accessibility.

#### Detailed all-details scenario (`11946:230644`) visual checklist

- Sample frame size: `1000 x 68` (reference only; runtime remains container-driven width).
- Root surface: `border: 1px solid var(--color-border-alerting-critical-transparent)`, `background: var(--color-background-alerting-critical-light)`, `padding-left: 20px`, no corner radius.
- Inset rail: `box-shadow: inset 4px 0 0 0 var(--color-background-alerting-critical)`.
- Content row: `gap: 8px`, `padding-block: 12px`; icon slot renders `status-critical-square-solid` at `16x16`.
- Text block: title uses Body 1 (`16/24`), message uses Body 2 (`14/20`), message color `var(--color-static-gray-900)`.
- Trailing controls: outlined action button (`padding 2/16`, radius `2`, border brand-base, label brand-strong) aligned to content row top (`12px` via action-only negative margin); dismiss icon at trailing cluster `16px` top inset (unchanged); **gap between action and dismiss: `var(--spacing-space-16)`** when both are in the trailing cluster; link behavior/appearance follows inline link contract and does not change other visual attributes.
## Tokens

### Global — severity surfaces (banner)

Use global alerting **solid** banner tokens (see global Figma): informational / major / minor / critical backgrounds and transparent borders; carousel rail uses **strong** background tokens only:

- `var(--color-background-alerting-critical-strong)` | `var(--color-background-alerting-major-strong)` | `var(--color-background-alerting-minor-strong)` | `var(--color-background-alerting-info-strong)`

Chevron tinting: white on `critical`, `warning-major`, `informational` rails; black on `warning-minor` rail (neutral SVG assets may need `filter`).

### Inline — severity surfaces (Figma “light tint + solid rail”)

Per-instance semantics from Figma variables (`get_variable_defs` on `42903:139522` / instance exports): root fill uses **`*-light`** alerting backgrounds; root border uses **`*-transparent`** alerting border tokens (semantic names; resolved values come from canonical `components/ids-theme.css` used by Storybook and generated outputs); inset rail uses the **solid** alerting background for that severity (e.g. `var(--color-background-alerting-info)`).

| Severity | Background | Border | Inset rail (4px) | Leading icon (`shapeName`, `16x16`) + color |
|---|---|---|---|---|
| informational | `var(--color-background-alerting-info-light)` | `var(--color-border-alerting-info-transparent)` | `var(--color-background-alerting-info)` | `info-circ-solid` + `var(--color-icon-alerting-info)` |
| success | `var(--color-background-alerting-success-light)` | `var(--color-border-alerting-success-transparent)` | `var(--color-background-alerting-success)` | `status-ok-circ-solid` + `var(--color-icon-alerting-success)` |
| warning-minor | `var(--color-background-alerting-minor-light)` | `var(--color-border-alerting-minor-transparent)` | `var(--color-background-alerting-minor)` (+ warning-accessible edge `Color/Border/Alerting/Warning-Accessible` on explicit rail layer) | `status-warn-tri-solid` + `var(--color-icon-alerting-minor)` |
| warning-major | `var(--color-background-alerting-major-light)` | `var(--color-border-alerting-major-transparent)` | `var(--color-background-alerting-major)` | `status-error-diamond-solid` + `var(--color-icon-alerting-major)` |
| critical | `var(--color-background-alerting-critical-light)` | `var(--color-border-alerting-critical-transparent)` | `var(--color-background-alerting-critical)` | `status-critical-square-solid` + `var(--color-icon-alerting-critical)` |

Inline **message link** and **outlined action** use **static brand** tokens above, not legacy “slate” border/background pairs.
## States (Light Theme)

### Inline (`display: inline`)

Structural states follow **`density`** (compact vs detailed) and optional slots (title, link, action, dismiss). Surface tokens per severity:

| Severity | Root background | Root border | Inset rail | Title / body text | Icon | Link | Action border | Action label |
|---|---|---|---|---|---|---|---|---|
| informational | `var(--color-background-alerting-info-light)` | `var(--color-border-alerting-info-transparent)` | `var(--color-background-alerting-info)` | `var(--color-static-gray-900)` | `var(--color-icon-alerting-info)` | `var(--color-static-brand-500)` | `var(--color-border-brand-base)` | `var(--color-text-brand-strong)` |
| success | `var(--color-background-alerting-success-light)` | `var(--color-border-alerting-success-transparent)` | `var(--color-background-alerting-success)` | `var(--color-static-gray-900)` | `var(--color-icon-alerting-success)` | `var(--color-static-brand-500)` | `var(--color-border-brand-base)` | `var(--color-text-brand-strong)` |
| warning-minor | `var(--color-background-alerting-minor-light)` | `var(--color-border-alerting-minor-transparent)` | `var(--color-background-alerting-minor)` | `var(--color-static-gray-900)` | `var(--color-icon-alerting-minor)` | `var(--color-static-brand-500)` | `var(--color-border-brand-base)` | `var(--color-text-brand-strong)` |
| warning-major | `var(--color-background-alerting-major-light)` | `var(--color-border-alerting-major-transparent)` | `var(--color-background-alerting-major)` | `var(--color-static-gray-900)` | `var(--color-icon-alerting-major)` | `var(--color-static-brand-500)` | `var(--color-border-brand-base)` | `var(--color-text-brand-strong)` |
| critical | `var(--color-background-alerting-critical-light)` | `var(--color-border-alerting-critical-transparent)` | `var(--color-background-alerting-critical)` | `var(--color-static-gray-900)` | `var(--color-icon-alerting-critical)` | `var(--color-static-brand-500)` | `var(--color-border-brand-base)` | `var(--color-text-brand-strong)` |

**Dismiss** control: `Icon` component tinted with `var(--color-icon-black)` on default surface; hover/focus per **Interactions**.

**Detailed all-details scenario:** a detailed inline alert may concurrently render title + body/message + inline link + outlined action + dismiss icon. This is a valid composition and should be represented in generated examples/tests.

### Global (`display: global`)

Root row + carousel rail row per severity (informational, warning-major, warning-minor, critical) — from global Figma mapping (`11067:54641`).

| Severity | Text color | Status icon `shapeName` | Icon `variant` | Icon notes | Dismiss icon color |
|---|---|---|---|---|---|
| `critical` | `var(--color-text-white)` | `status-critical-square-solid-ko` | `img` | — | `var(--color-icon-white)` |
| `warning-major` | `var(--color-text-black)` | `status-error-diamond-solid-ko` | `mask` | `color="var(--color-icon-white)"` | `var(--color-icon-black)` |
| `warning-minor` | `var(--color-text-black)` | `status-warn-tri-solid` | `inline` | SVG injected via `iconInlineRegistry.ts`; `.st0`/`.st1` (triangle) → `var(--color-icon-black)`, `.st2` (exclamation) → `var(--color-icon-white)` | `var(--color-icon-black)` |
| `informational` | `var(--color-text-white)` | `info-circ-solid-ko` | `img` | — | `var(--color-icon-white)` |

Dismiss icon always uses `variant="mask"`.

**Carousel count color:** the count text lives inside the carousel rail (strong background token), so its color is **independent of the root message text color**. All severities use `var(--color-text-white)` for the count — including `warning-major` whose root message text is `var(--color-text-black)`.

**`showDismiss` logic (global):** `(dismissible ?? true) && (severity !== "critical" || (showCarousel && !showAction))`.
- Non-critical severities: always show dismiss unless `dismissible={false}`.
- `critical`: dismiss is shown **only** when a carousel is present AND no action button — `dismissible={true}` alone cannot override this for `critical` + action.

#### Global typography

| Element | `font-weight` | `font-variation-settings` | Notes |
|---|---|---|---|
| Message (`.globalMessage`) | `500` | `'wdth' 100` | No explicit `font-family` override |
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

### API modes

| Mode | Use | Notes |
|---|---|---|
| **Composition (preferred)** | App / framework components | Project `AlertMessage`, `AlertTitle`, `AlertLink`, `AlertAction`, `AlertDismiss` as children; mirrors [Clarity `clr-alert-item`](https://clarity.design/documentation/alert/code) + `.alert-text` |
| **Props / data (shorthand)** | Storybook controls, tests, `AlertItem[]` in `AlertGroup` | `message`, `title`, `linkLabel`, `actionLabel` string props; codegen may map these to the same slots |

**Rule:** `AlertMessage` slot content is **authoritative** when present; `message` string is a convenience fallback for the same region. Validation fails if **both** are empty.

### `Alert` (single surface)

**Required**

- `display: "global" | "inline"`
- **Primary copy:** `AlertMessage` slot **or** `message: string` (shorthand)

**Optional (both)**

- `severity` (per display set)
- `link` / `AlertLink`: `{ label: string; href?: string; routerLink?: string | any[] }` (see Link contract)
- `actionLabel` + `onAction` / `AlertAction` (composes IDS Button)
- `dismissible`, `onDismiss` / `AlertDismiss`
- `onLinkClick`

**Global-only**

- `carousel?: { currentItem: number; totalItems: number; onPrevious?: () => void; onNext?: () => void }`

**Inline-only**

- `title` / `AlertTitle?: string` (detailed density)
- `density?: "compact" | "detailed"`

### `AlertGroup` (global, multi-item)

- `items: AlertItem[]` **or** composed `AlertItem` children (same logical shape)
- `activeIndex` (internal / host-controlled)
- Renders **one** `Alert` with `display="global"` bound to the active item’s slots/fields and `carousel` counter + handlers.
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
   - `AlertContent`
     - `AlertMessage` (**required** — projected slot; `message` string is shorthand)
     - optional `AlertLink` / `InlineLink` (reading order after message)
4. `ActionsRow`
   - optional `AlertAction` / `ActionButton` (IDS Button **small** outlined; see Button spec)
   - optional `AlertDismiss` / `DismissButton` (icon control, `12×12` glyph, `32×32` min hit target)

**`Alert` — inline (`display="inline"`):**

1. `AlertRoot` (`role="alert"`) — full-width row; **4px inset leading rail** via `box-shadow` (not a separate DOM rail node)
2. `ContentRow` (`inlineMain`) — `flex: 1 1 auto`, `gap: var(--spacing-space-8)`
   - `LeadingIcon` — shared `Icon` at `16×16`; vertical nudge `4px` (detailed) or `2px` (compact)
   - `AlertContent` — column, no gap; `padding-right: var(--padding-padding-16)`
     - optional `TitleRow` (`density="detailed"` + `AlertTitle` present): flex row `gap: 4px` containing `AlertTitle` + optional `AlertAction`
     - optional `AlertTitle` only (detailed, no action in title row)
     - `AlertMessage` (**required** — projected slot)
     - optional `AlertLink` / `InlineLink`
3. `TrailingControls` / `AlertActions` — `shrink: 0`; `gap: var(--spacing-space-16)` between `AlertAction` and `AlertDismiss` when both present; compact: `height: 40px; align-items: center; padding: var(--padding-padding-8) var(--padding-padding-16)`; detailed: `align-items: flex-start; padding: var(--padding-padding-16) 17px var(--padding-padding-16) 0`; detailed `AlertAction` only: `margin-top: calc(var(--padding-padding-12) - var(--padding-padding-16))` to align with content `padding-block` without moving dismiss
   - optional `AlertAction` (outlined IDS Button small) — compact only; detailed action is in `TitleRow`
   - optional `AlertDismiss`

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
- Global status icons and inline solid icons use the slug map in **Tokens / States → Global**; carousel chevrons use `chev-left-thick` / `chev-right-thick` (or project equivalents documented in implementation header).
- **Do not embed standalone inline `<svg>` factories** in generated Alert modules. Exception: `warning-minor` global uses `variant="inline"` routed through the shared `Icon` component + `iconInlineRegistry.ts` — this is acceptable because it still composes through the system `Icon` primitive; the registry handles SVG injection and class-based tinting (`.st0`/`.st1` → `var(--color-icon-black)`, `.st2` → `var(--color-icon-white)`).

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
- Missing or empty `AlertMessage` slot **and** missing/empty `message` shorthand → validation error.
- `carousel` on inline → validation error.
- `title` on global → validation error (or ignore with dev warning; prefer validation error).
- Unknown icon slug → hide leading icon slot, continue rendering message (log in dev).
- `iconOnly` / invalid Button props on action → defer to Button spec fallbacks.
- Both `link.href` and `link.routerLink` set → prefer `routerLink` for Angular targets; for other frameworks, document precedence in adapter.

Validation checklist:

- [ ] Composition API: `AlertMessage` slot documented and preferred over `message` string; empty slot + empty string fails validation.
- [ ] `AlertGroup` + single `AlertRoot` pattern matches global carousel (no stacked global roots).
- [ ] Variant matrix: all valid `display` × `severity` × optional slot combinations documented; global rejects `success`.
- [ ] Action controls reuse IDS Button small outlined contract, not alert-local button CSS.
- [ ] Icons use shared `Icon` + canonical slugs from **States → Global** table; no standalone inline SVG factories (warning-minor `variant="inline"` via `iconInlineRegistry.ts` is acceptable — it routes through the shared `Icon` primitive).
- [ ] Link contract supports `href` and `routerLink` without ambiguity.
- [ ] Global carousel uses **1-based** `currentItem` in API and labeled prev/next controls.
- [ ] Inline inset rail uses `box-shadow` 4px + severity solid token; `warning-minor` edge case documented.
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

---

## Implementation Notes - Global Alert

**Layout & structure**
- **Global root**: no `min-height`; use `align-items: flex-start` and no `gap`
- **Carousel rail**: use `position: absolute; top: -1px; bottom: -1px; left: -1px; width: 132px` so the rail overlaps the root border. Add a full 4-side border with `border-color: inherit` to match the root severity color. Offset `.globalContent` with `padding-left: 148px` when carousel is present
- **Actions trailing area**: two states — dismiss-only uses `align-items: flex-start; padding-block: 14px`; with-action uses `align-items: center; padding-block: 8px`. Use `data-has-action` attribute to switch between them
- **Dismiss button and carousel prev/next buttons**: use `width: auto; height: auto; padding: 0` so the button wrapper does not exceed the `12×12px` icon size

**Colors**
- **Informational background**: use `var(--color-background-alerting-info)` directly
- **Dismiss icon color**: critical and informational use `var(--color-icon-white)`; both warning severities use `var(--color-icon-black)`
- **Warning-major message text**: use `var(--color-text-black)`
- **Carousel count color**: always `var(--color-text-white)` on all severities — the count sits inside the carousel rail whose background is the strong token (e.g. `var(--color-background-alerting-major-strong)`), not the root background. Do **not** inherit from root; set `color: var(--color-text-white)` explicitly on `.globalCarouselCount`

**Icons**
- **Critical**: use `status-critical-square-solid-ko` with `variant="img"`. The SVG fill is white; the X mark is a cutout that reveals the red background
- **Warning-major**: use `status-error-diamond-solid-ko` with `variant="mask"` and `color="var(--color-icon-white)"`. The outer diamond is masked white; the dash cutout reveals the orange background
- **Warning-minor**: use `status-warn-tri-solid` with `variant="inline"`. Register in `iconInlineRegistry.ts` via `warnMinorAlertIcon()`:
  - Remove the `<style>` block to avoid CSS class collisions when multiple inline SVGs are on the same page
  - Apply `style="fill:var(--color-icon-black)"` to `.st0` and `.st1` (the triangle)
  - Apply `style="fill:var(--color-icon-white)"` to `.st2` (the exclamation mark `<rect>` and `<path>`)
  - Strip `width`/`height` from the root `<svg>` only — do not touch child elements like `<rect>`
- **Informational**: use `info-circ-solid-ko` with `variant="img"`. The SVG fill is white; the i mark is a cutout that reveals the blue background

**Typography**
- **Message and action button**: `font-weight: 500`
- **Link and carousel counter**: `font-weight: 400`

**Dismiss visibility logic**
- **`showDismiss` for critical**: use `(dismissible ?? true) && (severity !== "critical" || (showCarousel && !showAction))`. The critical constraint always applies — passing `dismissible={true}` cannot force dismiss on when there is an action button. `dismissible={false}` can still hide dismiss on any severity

---

## Implementation Notes - Inline Alert

**Layout & structure**
- **Root**: `gap: var(--spacing-space-12)` between `.inlineMain` and `.inlineTrailing`
- **`.inlineText`**: `padding-right: var(--padding-padding-16)`; no `gap` between children
- **`.inlineTitleRow`** (detailed with title): `display: flex; align-items: flex-start; gap: 4px; width: 100%`. Title uses `flex: 1 1 auto; min-width: 0`; action button uses `flex-shrink: 0`
- **`.inlineTrailing`**: `gap: var(--spacing-space-16)` between outlined action and dismiss when both render in trailing (compact + detailed)
- **Compact `.inlineTrailing`**: `align-items: center; height: 40px; padding: var(--padding-padding-8) var(--padding-padding-16)` (with action: `padding-block: var(--padding-padding-8)`)
- **Detailed `.inlineTrailing`**: `align-items: flex-start; padding: var(--padding-padding-16) 17px var(--padding-padding-16) 0`
- **Detailed `.inlineActionOutlined`**: `margin-top: calc(var(--padding-padding-12) - var(--padding-padding-16))` — action only; dismiss position unchanged
- **Action button placement**: compact → inside `.inlineTrailing`; detailed with title → inside `.inlineTitleRow` alongside the title. Use `showTitle && showAction` to determine placement
- **`showTrailing`**: `(!showTitle && showAction) || showDismiss`

**Typography**
- **Title** (`inlineTitle`): `font-weight: 500`
- **Message compact**: `font-weight: 400`
- **Message detailed**: `font-weight: 500`
- **Action button**: `font-weight: 500`

**Action button tokens**
- **Border**: `var(--color-border-brand-base)`
- **Text color**: `var(--color-text-brand-strong)`

**Severity tokens**
- **`--inline-rail` and `--inline-alert-icon`**: use direct tokens with no fallback — `var(--color-background-alerting-info)`, `var(--color-background-alerting-success)`, etc.
- **`box-shadow`**: `inset 4px 0 0 0 var(--inline-rail)`

**Dismiss visibility logic**
- **`showDismiss` for critical**: use `(dismissible ?? true) && severity !== "critical"`. Critical inline never has dismiss regardless of action

