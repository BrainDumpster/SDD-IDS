# About Design Spec

## IDS baseline (layout, flow, contracts)

Synapse **About** is an **ids-fork** of the IDS **About** modal pattern. Anatomy, tabbed **Top-Content** body structure, interaction contracts, runtime API, and codegen blueprint **inherit IDS** unless listed in **Synapse programme deltas** or **Programme override rules** below.

- **IDS source of truth:** [`components/ids/about/design-spec.md`](../ids/about/design-spec.md)
- **Registry:** `data/programme-inheritance-registry.json` → `synapse` / `about`
- **Shared implementation:** `storybook/src/components/About.tsx`, `About.module.css`, `Dialog.tsx`, `Dialog.module.css`
- **Theme CSS:** `components/synapse-theme.css`
- **Synapse Figma:** file `Td1bnsvRj1PCGs9RVJkIvJ`, node `49962:52708` (`About-Synapse`)

## Metadata

| Property | Value |
|---|---|
| Component | About |
| Design system | Synapse |
| Category | Patterns |
| Spec pattern | **ids-fork** |
| IDS baseline slug | `about` |
| Status | **active** |
| Version | 1.0.0 |
| Figma | https://www.figma.com/design/Td1bnsvRj1PCGs9RVJkIvJ/Synapse-Hi-Fi-components?node-id=49962-52708&m=dev |
| Figma file key | `Td1bnsvRj1PCGs9RVJkIvJ` |
| Main component node | `49962:52708` (`About-Synapse`) |
| Usage instance | `49962:53921` (board `49962:53917`) |
| Serial row node | `49962:52727` |
| Theme CSS | `components/synapse-theme.css` |
| Verification method | Figma MCP (`get_design_context`, `get_metadata`) on Synapse nodes |
| Last verified | 2026-06-17 |

### Synapse programme deltas (vs IDS)

| Topic | IDS | Synapse |
|---|---|---|
| Shell corner radius | `var(--modal-control-radius)` → **0** | Same alias → `var(--corner-radius-radius-16)` (**16px**) |
| Shell border | `var(--color-border-accessible)` | `var(--color-border-neutral-light)` |
| Header row | Fixed **60px**; spacer `78px` + close | Flexible: `pt: var(--padding-padding-24)`, `pb: var(--padding-padding-16)`, `px: var(--padding-padding-24)` |
| Default product icon | Optional `104×104` | **Omitted** in Figma default; when shown → `var(--color-icon-brand-base)` |
| Product title color | `var(--color-text-brand-base)` | `var(--color-icon-brand-base)` |
| Product ↔ Copyright gap | `var(--spacing-space-48)` | `var(--spacing-space-56)` |
| Center max-width | `1200px` | `1056px` |
| Content vertical inset | `48px` top/bottom in `446px` panel | Frame-Center vertical center; `pb: var(--padding-padding-24)` |
| Footer top border | `var(--color-border-accessible)` | `var(--color-border-neutral-light)` |
| Footer Close button | IDS Button (`radius-2`) | Synapse Button `programme="synapse"` (`var(--button-control-radius)` → radius-4) |
| Tabbed variant | IDS Tab primary (`30680:10947`) | Not in Synapse Figma; runtime inherits IDS body + **Synapse Nav Tab** per [`tabs/design-spec.md`](../tabs/design-spec.md) |
| Theme CSS | `components/ids-theme.css` | `components/synapse-theme.css` |

## Anatomy

Inherit IDS slot order — see [`components/ids/about/design-spec.md`](../ids/about/design-spec.md).

Synapse default (`About-Synapse`, `49962:52708`):

1. **Modal shell** — `1152×596`; `var(--modal-control-radius)`; `var(--color-border-neutral-light)` border
2. **Top-Content** (`49962:52710`) — `508px` (header + Frame-Center)
3. **Header** (`49962:52711`) — close `16×16` top-right
4. **Frame-Center** (`49962:52720`) — centered column; `max-width: 1056px`
5. **Product block** — title (Header 1) + version (Body 2); **no icon** in default Figma sample
6. **Serial row** (optional, `49962:52727`) — label + `14×14` copy
7. **Copyright block** — logo `32px` + multiline copyright
8. **Footer** — Synapse primary **Close**, right-aligned

When `showTabs=true`: inherit IDS **Top-Content** → MODAL-TAB-BAR + Frame-Center; Synapse Nav Tab chrome.

## Layout & Measurements

### Modal shell (`49962:52708`)

- Surface: `1152×596` px; runtime `min(1152px, 100vw − 48px)`
- Border: `var(--border-width-border-1)` solid `var(--color-border-neutral-light)`
- Corner radius: `var(--modal-control-radius)` → `var(--corner-radius-radius-16)`
- Top-Content: `508px` (`49962:52710`)
- Footer: `var(--padding-padding-24)`; top border `var(--color-border-neutral-light)`; ≈ `90px` total

### Header (`49962:52711`)

- Padding: `var(--padding-padding-24)` top, `var(--padding-padding-16)` bottom, `var(--padding-padding-24)` horizontal
- Close: `16×16`; top-right

### Frame-Center (`49962:52720`)

- Flex grow; `justify-content: center`; `px: var(--padding-padding-24)`; `pb: var(--padding-padding-24)`
- **CENTER AREA** (`49962:52721`): `max-width: 1056px`; `gap: var(--spacing-space-56)` between Product and Copyright
- Product name cluster: `gap: var(--spacing-space-4)`
- Copyright block: logo `32px` + text; `gap: var(--spacing-space-8)`
- Scroll: default content fits without scrollbar

### Spacing hierarchy (Synapse `49962:52708`)

```
About-Synapse 1152×596 (border-radius: var(--modal-control-radius))
├── Top-Content 508px
│   ├── Header (pt-24, pb-16, px-24) + Close
│   └── Frame-Center (flex-1, center, px-24, pb-24)
│       └── CENTER AREA max-w-1056 (gap: space-56)
│           ├── Product block (title + version [+ serial])
│           └── Copyright block (logo 32px + Body 2)
└── Footer (border-top neutral-light, padding-24, Synapse Close)
```

### Tabbed body (runtime)

Inherit IDS tabbed measurements from [`components/ids/about/design-spec.md`](../ids/about/design-spec.md) (`30680:10947`). Apply Synapse shell border/radius/footer tokens and Synapse Nav Tab chrome.

## Tokens

Inherit IDS semantic token **names**; resolve values in `components/synapse-theme.css`.

### Synapse-specific resolutions

| Token / alias | Synapse resolved role |
|---|---|
| `--modal-control-radius` | Shell `border-radius` → `var(--corner-radius-radius-16)` |
| `--color-border-neutral-light` | Shell border, footer divider |
| `--color-icon-brand-base` | Product title; optional product icon tint |
| `--spacing-space-56` | Product ↔ Copyright gap |
| `--button-control-radius` | Footer Close button |

### Typography

- Product title: Header 1 — `var(--font-size-header-1)` / `var(--font-line-height-line-height-58)`; `var(--color-icon-brand-base)`
- Version / serial: Body 2 — `var(--color-text-neutral-strong)`
- Copyright: Body 2 — `var(--color-text-neutral)`; one centered logical block

## States (Light Theme)

Inherit IDS **States (Light Theme)** from [`components/ids/about/design-spec.md`](../ids/about/design-spec.md) with these Synapse substitutions:

| Element | Background | Border | Text | Icon |
|---|---|---|---|---|
| Modal shell | `var(--color-background-component)` | `var(--color-border-neutral-light)` | — | — |
| Product icon (optional) | transparent | transparent | — | `var(--color-icon-brand-base)` |
| Product title | transparent | transparent | Header 1 / `var(--color-icon-brand-base)` | — |
| Version / serial | transparent | transparent | Body 2 / `var(--color-text-neutral-strong)` | `var(--color-icon-neutral-strong)` (copy) |
| Copyright | transparent | transparent | Body 2 / `var(--color-text-neutral)` | — |
| Footer Close button | `var(--color-background-controls-brand-base)` | `var(--color-border-transparent-brand)` | `var(--color-text-white)` | — |

## States (Dark Theme)

Same semantic tokens as **States (Light Theme)**. Resolved dark values live in `components/synapse-theme.css` (`[data-theme="dark"]` / Synapse dark selectors). Duplicate full matrix only if a dark row uses a different `var(--...)` than the corresponding light row.

## Interactions

Inherit IDS **Interactions** from [`components/ids/about/design-spec.md`](../ids/about/design-spec.md).

Synapse-specific:

- Footer Close uses Synapse Button states per [`components/synapse/button/design-spec.md`](../button/design-spec.md)
- Tabbed mode (runtime): Synapse Nav Tab swaps Frame-Center content; default About tab has no scrollbar

### Accessibility

Inherit IDS accessibility contract. Additional Synapse notes:

- Footer Close: Synapse Button focus ring (`var(--button-focus-ring-radius)`, `var(--button-focus-ring-offset)`)
- All other roles, labels, and tab order unchanged from IDS

### Behavior & guidelines

- Default Synapse Figma omits product icon — do not inject icon in Synapse **Spec Accurate Design** story
- Use `programme="synapse"` on About shell and footer `Button`
- Load `components/synapse-theme.css` before render
- Tabbed About is runtime-only for Synapse; not validated in Synapse Figma library

## Composition & API (runtime)

Inherit IDS **Composition & API (runtime)** from [`components/ids/about/design-spec.md`](../ids/about/design-spec.md).

### Runtime API (Synapse notes)

| Prop / slot | Synapse note |
|---|---|
| `programme` | Must be `"synapse"` for Synapse chrome |
| `productTitle` | Figma sample: `"Synapse"` |
| `versionLabel` | Figma sample: `"Version X.X.X"` |
| `showProductIcon` | Default `false` for Synapse Figma fidelity |
| `productIconSlug` | When set, tint `var(--color-icon-brand-base)` |
| `showTabs` | Default `false`; optional IDS-fork runtime feature |
| `trigger` / footer Close | `Button` with `programme="synapse"`, `size="lg"` |

### Variants

| Variant | Figma node | Description |
|---|---|---|
| Default | `49962:52708` | About-Synapse — title, version, logo, copyright |
| With serial | `49962:52727` | Serial row + copy |
| With product icon | — | Runtime optional (not in default Figma) |
| Usage in context | `49962:53921` | Masthead overlay board |
| Tabbed (runtime) | IDS `30680:10947` | IDS Top-Content body + Synapse Nav Tab chrome |

## Codegen Contract (Framework-Agnostic Blueprint)

### Deterministic structure

Inherit IDS **Deterministic structure** from [`components/ids/about/design-spec.md`](../ids/about/design-spec.md). Apply Synapse programme overrides at **Per-slot style contract** only — do not reorder slots.

### Variant matrix

| Axis | Values | Synapse default | Notes |
|---|---|---|---|
| `programme` | `synapse` | `synapse` | Required for Synapse chrome |
| `showProductIcon` | `false`, `true` | `false` | Figma default omits icon |
| `showSerialNumber` | `false`, `true` | `false` | `49962:52727` |
| `showTabs` | `false`, `true` | `false` | Runtime; Synapse Nav Tab when `true` |

Invalid variant → Synapse default (`49962:52708`). Tabbed runtime → inherit IDS tab matrix with Synapse tab chrome.

### Per-slot style contract

Inherit IDS per-slot contracts; override only these rows for `programme="synapse"`:

| Slot | Synapse override |
|---|---|
| `ModalShell` | `border-radius: var(--modal-control-radius)`; `border-color: var(--color-border-neutral-light)` |
| `HeaderRow` | Flexible padding (`pt-24`, `pb-16`, `px-24`); no fixed `60px` |
| `FrameCenter` / `CenterArea` | `max-width: 1056px`; Product↔Copyright `gap: var(--spacing-space-56)`; vertical center (no `48px` body padding) |
| `ProductTitle` | `color: var(--color-icon-brand-base)` |
| `ProductIcon` | When shown: `var(--color-icon-brand-base)` |
| `Footer` | `border-top-color: var(--color-border-neutral-light)` |
| `CloseButton` | Synapse Button; `border-radius: var(--button-control-radius)` |

All other slots: inherit IDS token bindings unchanged.

### Behavior contract

Inherit IDS **Behavior contract** from [`components/ids/about/design-spec.md`](../ids/about/design-spec.md). Synapse adds:

- Emit `programme="synapse"` on dialog shell and footer button
- Never hardcode `16px` radius — use `var(--modal-control-radius)`

### Accessibility contract

Inherit IDS **Accessibility contract**. Footer Close uses Synapse Button focus contract from [`components/synapse/button/design-spec.md`](../button/design-spec.md).

### Asset resolution + bundling contract

Inherit IDS asset table from [`components/ids/about/design-spec.md`](../ids/about/design-spec.md):

| Slug | File | Usage |
|---|---|---|
| `logo-delltech-horiz` | `assets/icons/logo-delltech-horiz.svg` | Brand footer logo |
| `copy` | `assets/icons/copy.svg` | Serial copy |
| `shape-x` | `assets/icons/shape-x.svg` | Header close |
| `shield-cloud` | `assets/icons/shield-cloud.svg` | Optional product icon (runtime) |

Bundle icons from `assets/icons/`; resolve at build time. Missing slug → omit slot + warning (inherit IDS fallback).

### Fallback/error rules

Inherit IDS **Fallback/error rules** from [`components/ids/about/design-spec.md`](../ids/about/design-spec.md), plus:

- `programme` omitted or unknown → use Synapse defaults when `synapse-theme.css` is active; otherwise IDS defaults
- `showProductIcon=true` without slug/src → omit icon (Synapse default story expects no icon)
- Synapse theme CSS missing → log error; do not hardcode `#0076ce` in component CSS

### Validation checklist

- [x] IDS baseline linked; programme deltas table complete
- [x] Shell uses `var(--modal-control-radius)` and `var(--color-border-neutral-light)` (no hardcoded `16px`)
- [x] Default Synapse story omits product icon; title uses `var(--color-icon-brand-base)`
- [x] Product ↔ Copyright gap is `var(--spacing-space-56)`
- [x] CENTER AREA max-width `1056px`
- [x] Footer Close uses Synapse Button `programme="synapse"`
- [x] `components/synapse-theme.css` loaded in Storybook
- [x] Tabbed runtime (if used): IDS Top-Content body + Synapse Nav Tab chrome
- [x] Dark theme resolves via semantic tokens in `synapse-theme.css`

## Source Mapping

| Source | Location |
|---|---|
| IDS baseline | `components/ids/about/design-spec.md` |
| Programme spec | `components/synapse/about/design-spec.md` |
| Registry | `data/programme-inheritance-registry.json` → `synapse` / `about` |
| Synapse Figma main | file `Td1bnsvRj1PCGs9RVJkIvJ`, node `49962:52708` |
| Synapse usage board | `49962:53917` / instance `49962:53921` |
| Serial row | `49962:52727` |
| Synapse Tab (tabbed runtime) | `components/synapse/tabs/design-spec.md` |
| Synapse Button | `components/synapse/button/design-spec.md` |
| Component map | `data/synapse-component-figma-map.json` |
| Theme CSS | `components/synapse-theme.css` |
| Implementation | `storybook/src/components/About.tsx`, `Dialog.tsx` |
| Storybook contract | `storybook/src/spec-contracts/synapse-about.contract.ts` |
| Storybook stories | `storybook-generated/synapse/src/components/About.stories.tsx` |
| Verification method | Figma MCP |
| Last verified | 2026-06-17 |
