<!-- ds:inherits root-spec -->
# Get Started Design Spec

## Metadata

| Property | Value |
|---|---|
| Component | Get Started |
| Design system | IDS |
| Category | Patterns and Templates |
| Version | 1.0.0 |
| Status | draft |
| Created | 2026-06-06 |
| Updated | 2026-06-06 |
| Storybook examples requested | yes |
| Storybook story path | `storybook-generated/ids/src/components/GetStarted.stories.tsx` |
| Storybook title | `Spec Generated/IDS/Get Started` |

### Figma source nodes

| Role | URL | File key | Node ID |
|---|---|---|---|
| Component (primary) | https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=12189-233235&m=dev | `0bHk3XhrjFhowgFkz9yLr4` | `12189:233235` |
| Element — panel/card group | https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=12671-2567&m=dev | `0bHk3XhrjFhowgFkz9yLr4` | `12671:2567` |
| Element — step/tile row | https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=12674-1881&m=dev | `0bHk3XhrjFhowgFkz9yLr4` | `12674:1881` |
| Element — illustration/icon area | https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=12023-228883&m=dev | `0bHk3XhrjFhowgFkz9yLr4` | `12023:228883` |
| Component map | `data/component-figma-map.json` → `Get Started` |  |  |

### Figma verification

| Property | Value |
|---|---|
| Verification method | Figma REST API — `FIGMA_TOKEN` not present in environment at generation time |
| Verification status | **Pending re-fetch** — run `ingestion/figma_sync_client.py` with a valid token against nodes above before promoting to `Status: active` |
| Minimum checks required | Structure/dimensions, variable/token bindings, variant/state evidence on each node |

## Anatomy

The Get Started pattern is a **full-page onboarding template** composed of a header band and a grid of action cards (tiles). Each tile guides the user toward a primary first-use action.

Root composition (deterministic order):

1. `GetStartedRoot` — page-level container; takes full viewport or panel width
2. `GetStartedHeader` — top band
   - `HeaderTitle` — page heading (required)
   - `HeaderSubtitle` — supporting copy (optional)
3. `GetStartedGrid` — responsive card grid
   - one or more `GetStartedCard` (required; minimum 1)
     - `CardIllustration` — icon or decorative image slot (optional)
     - `CardTitle` — card heading (required)
     - `CardDescription` — supporting body copy (optional)
     - `CardAction` — primary CTA button or link (optional)
     - `CardSecondaryAction` — secondary link or text control (optional)

## Layout & Measurements

- `GetStartedRoot`: `width: 100%`; `box-sizing: border-box`; padding `var(--padding-padding-24)` (or page-shell equivalent)
- `GetStartedHeader`: `margin-bottom: var(--spacing-space-24)`; `gap: var(--spacing-space-8)` between title and subtitle
- `GetStartedGrid`: CSS grid; `gap: var(--spacing-space-16)`; responsive column count — single column on narrow viewports, 2–3 columns at wider breakpoints (implementation drives column count from container query or media query; spec does not hardcode column count)
- `GetStartedCard`:
  - `padding: var(--padding-padding-24)`
  - `border-radius: var(--corner-radius-radius-2)` (verify against live Figma node `12671:2567` / `12674:1881`)
  - `border: var(--border-width-border-1) solid var(--color-border-accessible)`
  - `background: var(--color-background-component)`
  - `display: flex; flex-direction: column; gap: var(--spacing-space-16)`
  - min-height: content-driven (no fixed min-height constraint)
- `CardIllustration`: icon size `var(--scale-48)` (48 × 48) or custom asset at specified dimensions; horizontally leading or centered per Figma variant
- `CardAction`: IDS Button **medium** primary or outlined signature (see `components/ids/button/design-spec.md`); `align-self: flex-start`
- `CardSecondaryAction`: IDS link-style control; `align-self: flex-start`

## Tokens

### Typography

- `HeaderTitle`: `var(--font-size-heading-3)` / `var(--font-line-height-line-height-32)` / `font-weight: 500`
- `HeaderSubtitle`: `var(--font-size-body-1)` / `var(--font-line-height-line-height-24)` / `font-weight: 400`
- `CardTitle`: `var(--font-size-body-1)` / `var(--font-line-height-line-height-24)` / `font-weight: 500`
- `CardDescription`: `var(--font-size-body-2)` / `var(--font-line-height-line-height-20)` / `font-weight: 400`
- `CardAction` label: per IDS Button spec
- `CardSecondaryAction` label: `var(--font-size-body-2)` / `var(--font-line-height-line-height-20)` / `font-weight: 400`

### Colors and surfaces

- Page background: `var(--color-background-surface-1)`
- `GetStartedCard` background: `var(--color-background-component)`
- `GetStartedCard` border: `var(--color-border-accessible)`
- `HeaderTitle` color: `var(--color-text-neutral-strong)`
- `HeaderSubtitle` color: `var(--color-text-neutral)`
- `CardTitle` color: `var(--color-text-neutral-strong)`
- `CardDescription` color: `var(--color-text-neutral)`
- `CardIllustration` icon tint (monochrome): `var(--color-icon-brand-base)`
- `CardAction`: IDS Button primary token set (see Button spec)
- `CardSecondaryAction` label: `var(--color-text-link-brand-base)`, underline on hover
- Focus ring: `var(--border-width-border-2)` `var(--color-border-brand-base)`

### Spacing and radius

- `var(--spacing-space-8)` — header title/subtitle gap
- `var(--spacing-space-16)` — grid gap; card internal gap
- `var(--spacing-space-24)` — header bottom margin; card padding
- `var(--corner-radius-radius-2)` — card border radius
- `var(--border-width-border-1)` — card border width

## States (Light Theme)

| Slot | State | Background | Border | Text / Icon |
|---|---|---|---|---|
| `GetStartedCard` | default | `var(--color-background-component)` | `var(--color-border-accessible)` | title `var(--color-text-neutral-strong)`, body `var(--color-text-neutral)` |
| `GetStartedCard` | hover | `var(--color-background-brand-lighter)` | `var(--color-border-brand-base)` | unchanged |
| `GetStartedCard` | focus-visible (card is interactive) | `var(--color-background-component)` | focus ring `var(--border-width-border-2)` `var(--color-border-brand-base)` | unchanged |
| `CardAction` (Button) | all states | per IDS Button primary/outlined spec | per IDS Button spec | per IDS Button spec |
| `CardSecondaryAction` | default | transparent | none | `var(--color-text-link-brand-base)` |
| `CardSecondaryAction` | hover | transparent | none | `var(--color-text-link-brand-base)`, underline |
| `CardSecondaryAction` | focus-visible | transparent | focus ring `var(--border-width-border-2)` `var(--color-border-brand-base)` | `var(--color-text-link-brand-base)` |

## States (Dark Theme)

Dark theme uses the same semantic tokens as **States (Light Theme)**. Resolved values for `[data-theme="dark"]` / `.ids-theme-dark` (and program overlays) live in theme CSS:

- `components/ids-theme.css`
- `components/<program>-theme.css` when a program overlays IDS (for example `components/dap-theme.css`)

Duplicate the full state matrix in this section only when a dark row genuinely uses different `var(--...)` references than the corresponding light row.

*(When Light and Dark tables would list identical `var(--...)` cells, keep the matrix under **States (Light Theme)** only and use this pointer section instead of a second table.)*

## Interactions

### Accessibility

- `GetStartedRoot` requires a visible page `<h1>` or landmark; `HeaderTitle` maps to `<h1>` (or configured heading level via `headingLevel` prop)
- `GetStartedCard` — if the entire card is interactive (clickable): `role="button"` or wrapping `<a>`; keyboard activation via `Enter` / `Space`
- `GetStartedCard` — if only `CardAction` / `CardSecondaryAction` are interactive: card container is non-interactive; actions are individually focusable native `<button>` / `<a>` elements
- `CardIllustration` icon: `aria-hidden="true"` when decorative; provide `aria-label` when the icon is the sole content of a tile
- Focus ring must not be clipped by card `overflow: hidden`
- Color contrast for all text must meet WCAG AA minimum against respective surface

### Behavior & guidelines

- The Get Started template is shown to first-time or returning users who have not yet completed initial product setup
- Cards may be marked `completed` (optional boolean prop); completed cards show a visual confirmation treatment (checkmark icon, muted border) but remain navigable
- Card order is fixed by the host application; no drag-to-reorder in this spec
- `CardAction` and `CardSecondaryAction` are optional; a card with neither is valid (informational tile)
- The pattern does not own routing logic; host provides `href` or `onAction` callbacks
- Do not embed app-specific business rules inside the generated component

## Composition & API (runtime)

### Variants

| Axis | Values | Default |
|---|---|---|
| `cardLayout` | `"icon-top"` \| `"icon-leading"` | `"icon-top"` |
| `card.completed` | `true` \| `false` | `false` |
| `card.disabled` | `true` \| `false` | `false` |

### Runtime API

**`GetStarted` (root component)**

- `title: string` — page heading (required)
- `subtitle?: string` — supporting copy
- `cards: GetStartedCardInput[]` — ordered list of cards (required; ≥ 1)
- `cardLayout?: "icon-top" | "icon-leading"` — default `"icon-top"`
- `headingLevel?: 1 | 2 | 3` — maps `HeaderTitle` to the correct `<h1/2/3>`; default `1`

**`GetStartedCardInput`**

- `id: string` — stable identifier (required)
- `title: string` — card heading (required)
- `description?: string` — body copy
- `illustration?: { type: "icon"; shapeName: string } | { type: "image"; src: string; alt: string }` — icon or image asset
- `action?: { label: string; href?: string; routerLink?: string | any[]; onAction?: () => void }` — primary CTA
- `secondaryAction?: { label: string; href?: string; routerLink?: string | any[]; onAction?: () => void }` — secondary link/button
- `completed?: boolean` — marks card as done; default `false`
- `disabled?: boolean` — non-interactive; default `false`

## Codegen Contract (Framework-Agnostic Blueprint)

### Deterministic structure

```
GetStartedRoot
  GetStartedHeader
    HeaderTitle               ← maps to h1/h2/h3 per headingLevel prop
    HeaderSubtitle?           ← optional; omit when subtitle is absent
  GetStartedGrid
    [for each card in cards]
    GetStartedCard[id]
      CardIllustration?       ← omit when illustration is absent
      CardTitle
      CardDescription?        ← omit when description is absent
      CardAction?             ← IDS Button; omit when action is absent
      CardSecondaryAction?    ← link/button; omit when secondaryAction is absent
```

Codegen emits stable PascalCase slot identifiers aligned with anatomy labels. No additional wrapper nodes.

### Variant matrix

| `cardLayout` | `card.completed` | `card.disabled` | `illustration.type` | Valid |
|---|---|---|---|---|
| `icon-top` | `false` | `false` | `icon` | ✓ (primary) |
| `icon-top` | `false` | `false` | `image` | ✓ |
| `icon-top` | `true` | `false` | any / absent | ✓ |
| `icon-top` | `false` | `true` | any / absent | ✓ |
| `icon-leading` | any | any | any / absent | ✓ |
| any | `true` | `true` | — | validation error — `completed` and `disabled` must not both be `true` |

### Per-slot style contract

| Slot | Token(s) |
|---|---|
| `GetStartedRoot` | `background: var(--color-background-surface-1)` |
| `GetStartedCard` default | `background: var(--color-background-component)`; `border: var(--border-width-border-1) solid var(--color-border-accessible)`; `border-radius: var(--corner-radius-radius-2)` |
| `GetStartedCard` hover | `background: var(--color-background-brand-lighter)`; `border-color: var(--color-border-brand-base)` |
| `GetStartedCard` completed | `border-color: var(--color-border-brand-base)` (verify tint with live Figma); add `CompletedBadge` checkmark `var(--color-icon-alerting-success)` |
| `GetStartedCard` disabled | `opacity: var(--opacity-disabled, 0.4)`; `pointer-events: none`; `cursor: not-allowed` |
| `HeaderTitle` | `color: var(--color-text-neutral-strong)`; heading font tokens |
| `HeaderSubtitle` | `color: var(--color-text-neutral)` |
| `CardTitle` | `color: var(--color-text-neutral-strong)`; body-1 tokens |
| `CardDescription` | `color: var(--color-text-neutral)`; body-2 tokens |
| `CardIllustration` (icon) | icon tint `var(--color-icon-brand-base)`; `48 × 48` |
| `CardAction` | IDS Button spec token set (primary or outlined per usage) |
| `CardSecondaryAction` | `color: var(--color-text-link-brand-base)` |
| Focus ring | `outline: var(--border-width-border-2) solid var(--color-border-brand-base)` |

### Behavior contract

- Cards render in `cards[]` order; codegen must not reorder
- `completed=true` adds a visual completion indicator (`CompletedBadge`) but does not remove the card's action(s); actions remain operable
- `disabled=true` suppresses pointer and keyboard interaction; all descendant interactive elements inherit disabled state
- Routing: `action.routerLink` takes precedence over `action.href` for Angular targets; document precedence in generated module header for other frameworks
- `headingLevel` must propagate to the rendered heading element; codegen must not hard-code `<h1>`
- Card container is only interactive (receives focus / cursor pointer) when no `CardAction` or `CardSecondaryAction` is present and the host passes `onCardClick`; otherwise only child controls are interactive

### Accessibility contract

- `GetStartedRoot` wraps content in a `<main>` landmark or a `<section>` with `aria-label` when embedded inside a larger layout
- `HeaderTitle` renders as the correct heading element per `headingLevel` (default `<h1>`)
- `CardIllustration` icons: `aria-hidden="true"` when decorative; `aria-label` required when icon is the sole card content
- `CardAction` and `CardSecondaryAction`: native `<button>` or `<a>` semantics; `disabled` attribute when `card.disabled=true`
- Focus ring must be `outline` (not `box-shadow`) to remain visible in forced-colors/high-contrast mode
- Keyboard: Tab moves through cards' interactive controls; Enter/Space activates focused button/link

### Asset resolution + bundling contract

- `CardIllustration` icons resolved from `assets/icons/<shapeName>.svg` via shared `Icon` primitive when available
- `illustration.type="image"`: `src` is a project-resolved path or URL; `alt` is required for `<img>`
- Do not embed standalone inline `<svg>` in the Get Started module; route through the shared `Icon` primitive

### Fallback/error rules

- `cards` empty array → render `GetStartedHeader` only; do not throw; log dev warning
- `illustration.type="icon"` with unknown `shapeName` → hide `CardIllustration`, continue rendering card
- `completed=true` and `disabled=true` on same card → validation error; treat as `disabled` only (log warning)
- Unknown `cardLayout` → fall back to `"icon-top"`
- Unknown `headingLevel` → fall back to `1`
- Both `action.href` and `action.routerLink` set → prefer `routerLink` on Angular; document in adapter

### Validation checklist

- [ ] `GetStartedRoot → GetStartedHeader → GetStartedGrid → GetStartedCard[]` hierarchy matches Anatomy
- [ ] `CardIllustration`, `CardDescription`, `CardAction`, `CardSecondaryAction` are conditionally omitted when not provided
- [ ] `completed` and `disabled` visual treatments applied correctly; `completed + disabled` validation error handled
- [ ] All slot colors resolve via `var(--...)` tokens only (no hardcoded hex)
- [ ] `headingLevel` drives the rendered heading element (not hard-coded `<h1>`)
- [ ] `CardIllustration` routes through shared `Icon` primitive for `type="icon"`
- [ ] Focus ring is `outline`-based and visible in high-contrast mode
- [ ] `CardAction` and `CardSecondaryAction` are native `<button>` / `<a>` with correct disabled semantics
- [ ] Light/dark state tables use parallel `var(--...)` names
- [ ] `cards=[]` edge case handled without throw

## Source Mapping

| Source | Location |
|---|---|
| Root spec | `components/ids/root-spec.md` |
| Theme CSS | `components/ids-theme.css` |
| Component map | `data/component-figma-map.json` → `Get Started` (node `12189:233235`, file `0bHk3XhrjFhowgFkz9yLr4`) |
| Figma — primary node | https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=12189-233235&m=dev |
| Figma — element node 1 | https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=12671-2567&m=dev (`12671:2567`) |
| Figma — element node 2 | https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=12674-1881&m=dev (`12674:1881`) |
| Figma — element node 3 | https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=12023-228883&m=dev (`12023:228883`) |
| Verification method | Figma REST API (live fetch pending — `FIGMA_TOKEN` required) |
| Button dependency | `components/ids/button/design-spec.md` |
| Storybook story | `storybook-generated/ids/src/components/GetStarted.stories.tsx` |
| Storybook title | `Spec Generated/IDS/Get Started` |
