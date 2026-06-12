# Anchor Menu Design Spec

## IDS baseline (layout, flow, contracts)

Synapse **Anchor Menu** is an **ids-fork** of the IDS **Anchor Menu** family. Section-item geometry, left-rail indicator transitions, header rhythm, focus ring, and runtime API **inherit IDS** unless listed in **Synapse programme deltas** below.

- **IDS source of truth:** [`components/ids/anchor-menu/design-spec.md`](../ids/anchor-menu/design-spec.md)
- **Shared implementation:** `storybook/src/components/AnchorMenu.tsx`, `AnchorMenu.module.css`
- **Theme CSS:** `components/synapse-theme.css` (no programme layout aliases)

**Figma scope:** Synapse Navigation board `11067:54486`; element state matrix `11955:229729`; spec-accurate example `11955:229709`.

## Metadata

| Property | Value |
|---|---|
| Component | Anchor Menu |
| Design system | Synapse |
| Category | Navigation |
| Spec pattern | **ids-fork (override-only)** |
| IDS baseline slug | `anchor-menu` |
| Status | **active** |
| Version | 1.0.0 |
| Figma board node | `11067:54486` — [Anchor Menu](https://www.figma.com/design/Td1bnsvRj1PCGs9RVJkIvJ/Synapse-Hi-Fi-components?node-id=11067-54486&m=dev) |
| Element state matrix | `11955:229729` (`AnchorMenu-Element-Section`) |
| Main component set | `11955:229780` (`AnchorMenu-Main`, `# of Sections` 3–16) |
| Spec-accurate example | `11955:229709` (`AnchorMenu-Example`, 5 sections, first selected) |
| IDS Figma node | `11067:54486` (IDS exploration `VZJ48bbVYrIynw8DdSukWw`) |
| Theme CSS | `components/synapse-theme.css` |
| Verification method | Figma MCP (`get_metadata`, `get_design_context`) + IDS baseline |
| Last verified | 2026-06-05 |

### Synapse programme deltas (vs IDS)

| Topic | IDS | Synapse (Figma `11955:229729`) |
|---|---|---|
| Section item height | `40px` | **Same** (`8px` + `24px` line + `8px`) |
| Item padding | `8px 24px` | **Same** |
| Default left rail | `1.2px` `var(--color-border-accessible)` | **Same** |
| Hover / active left rail | `4px` `var(--color-border-brand-base)` | **Same** |
| Active text | `var(--color-text-brand-strong)` | **Same** |
| Hover text | `var(--color-text-neutral)` | **Same** (not brand-strong) |
| Focus ring | `2px` `var(--color-border-brand-base)`, radius `4px` | **Same** |
| Header label | Body 1, `12px` vertical padding | **Same** |
| Runtime API | IDS contract | **Same** (inherit IDS) |

**No programme layout aliases.**

## Anatomy

Inherit IDS **Anatomy** — `AnchorMenuRoot` (`nav`) → optional `AnchorMenuHeader` → `AnchorMenuList` → repeated `AnchorMenuItem` → `AnchorMenuLink` with left-rail indicator. See [`components/ids/anchor-menu/design-spec.md`](../ids/anchor-menu/design-spec.md).

Figma element part: `AnchorMenu-Element-Section` (`11955:229729`) — states `Unselected | Hover | Selected | Unselected-Focus | Selected-Focus`.

## Layout & Measurements

| Slot | Measurement | Token / note |
|---|---|---|
| `AnchorMenuRoot` width | `200px` min (reference); runtime container-driven | shared CSS `width: 200px` sample |
| `AnchorMenuHeader` | `padding: 12px 0`; Body 1 (`16/24`), weight 400 | `var(--padding-padding-12)`, `var(--font-size-body-1)` |
| `AnchorMenuItem` / link | height `40px`; padding `8px 24px` | `var(--padding-padding-8)`, `var(--padding-padding-24)` |
| Left rail (default) | `1.2px` solid | `var(--color-border-accessible)` |
| Left rail (hover / active) | `4px` solid | `var(--color-border-brand-base)` via `::before` overlay in implementation |
| Focus ring inset | `2px` offset; radius `4px` | `var(--border-width-border-2)`, `var(--corner-radius-radius-2)` |
| Item gap | `0` (stacked) | adjacent rows |

## Tokens

Inherit IDS semantic tokens:

- `var(--color-text-neutral-strong)` — header
- `var(--color-text-neutral)` — default / hover item label
- `var(--color-text-brand-strong)` — active item label
- `var(--color-border-accessible)` — default left rail
- `var(--color-border-brand-base)` — hover/active rail + focus ring

## States (Light Theme)

| Element | State | Background | Border / rail | Text |
|---|---|---|---|---|
| `AnchorMenuLink` | default | transparent | left `1.2px` `var(--color-border-accessible)` | `var(--color-text-neutral)` |
| `AnchorMenuLink` | hover | transparent | left `4px` `var(--color-border-brand-base)` | `var(--color-text-neutral)` |
| `AnchorMenuLink` | active | transparent | left `4px` `var(--color-border-brand-base)` | `var(--color-text-brand-strong)` |
| `AnchorMenuLink` | focus-visible | transparent | focus ring `2px` `var(--color-border-brand-base)`; rail per selection | selected: `var(--color-text-brand-strong)`; else `var(--color-text-neutral)` |

## States (Dark Theme)

Dark theme uses the same semantic tokens as **States (Light Theme)**. Resolved values for `[data-theme="dark"]` live in `components/synapse-theme.css`.

## Interactions

Inherit IDS **Interactions** — click navigates to `href`; keyboard Tab/Enter; optional scroll-spy is host-owned. Focus ring visible on `:focus-visible`.

### Accessibility

- Root: `nav` with `aria-label` (default `"On this page"` in Storybook).
- Active link: `aria-current="true"` (or `"page"` when appropriate).
- Focus ring meets brand-token contrast via `var(--color-border-brand-base)`.

## Composition & API (runtime)

### IDS inheritance resolution

Codegen **MUST** resolve `items`, optional `title`, `sticky`, and `onItemClick` from IDS **Composition & API (runtime)**.

| Prop | Type | Notes |
|---|---|---|
| `items` | `Array<{ label: string; href: string; active?: boolean }>` | required |
| `title?` | `string` | optional heading above list |
| `sticky?` | `boolean` | host layout concern |
| `onItemClick?` | `(href: string) => void` | optional intercept |

### Synapse-only runtime flags

None.

### Storybook defaults

Mirror Figma example `11955:229709` under **Spec Generated/Synapse/Anchor Menu** with `components/synapse-theme.css` imported.

## Codegen Contract (Framework-Agnostic Blueprint)

### IDS baseline resolution

Generators **MUST** load and merge the IDS baseline contract from [`components/ids/anchor-menu/design-spec.md`](../ids/anchor-menu/design-spec.md) (`## Codegen Contract`) before applying Synapse programme overrides below.

### Programme override rules

| Rule | IDS | Synapse |
|---|---|---|
| All slots / tokens | IDS contract | **Inherit IDS** |

### Deterministic structure

1. `AnchorMenuRoot` (`nav`)
2. optional `AnchorMenuHeader`
3. `AnchorMenuList` (`ul`)
4. repeated `AnchorMenuItem` (`li`) → `AnchorMenuLink` (`a`)

### Variant matrix

- `itemState`: `default | hover | active | focus-visible` (per link)
- optional `withHeader`: boolean (title slot present)

### Per-slot style contract

- `AnchorMenuLink`: block, full width, `padding: var(--padding-padding-8) var(--padding-padding-24)`, Body 1 (`16/24`), weight 400.
- Default rail: `border-left: 1.2px solid var(--color-border-accessible)`.
- Hover/active rail: `4px` brand bar (implementation may use `::before` to avoid layout shift).
- Active text: `var(--color-text-brand-strong)`; hover text remains `var(--color-text-neutral)`.

### Behavior contract

- `active` item renders selected rail + brand-strong text.
- Click follows `href` unless `onItemClick` prevents default.
- Empty `items` → render header only or empty nav without crash.

### Accessibility contract

- `nav` landmark + descriptive `aria-label`.
- `aria-current` on active item.
- `:focus-visible` ring `2px` `var(--color-border-brand-base)`, radius `var(--corner-radius-radius-2)`.

### Asset resolution + bundling contract

No image assets.

### Fallback/error rules

- Missing `href` → disable navigation for that item (render as `span` or `aria-disabled` link).
- Unknown `active` on multiple items → last wins; prefer single active in docs.

Programme additions:

- Import **`components/synapse-theme.css`** for Synapse targets.

### Validation checklist

- [x] IDS baseline linked; no programme layout deltas
- [x] Figma MCP evidence on `11955:229729` (rail widths, padding, typography)
- [x] Spec-accurate example `11955:229709` matches Storybook default story
- [x] Hover keeps neutral text; active uses brand-strong
- [x] Storybook `Spec Generated/Synapse/Anchor Menu` loads `components/synapse-theme.css`
- [x] Registry: `data/programme-inheritance-registry.json` → `synapse` / `anchor-menu`

## Source Mapping

| Property | Value |
|---|---|
| IDS baseline | `components/ids/anchor-menu/design-spec.md` — node `11067:54486` |
| Programme spec | `components/synapse/anchor-menu/design-spec.md` |
| Synapse Figma file | `Td1bnsvRj1PCGs9RVJkIvJ` |
| Board | `11067:54486` |
| Element matrix | `11955:229729` |
| Main set | `11955:229780` |
| Spec-accurate example | `11955:229709` |
| Implementation | `storybook/src/components/AnchorMenu.tsx` |
| Programme wrapper | `storybook/src/components/SynapseAnchorMenu.tsx` |
| Spec contract | `storybook/src/spec-contracts/synapse-anchor-menu.contract.ts` |
| Storybook | `storybook/src/components/SynapseAnchorMenu.stories.tsx` |
| Verification | Figma MCP `get_design_context` on `11955:229729`, `11955:229709` (2026-06-05) |
