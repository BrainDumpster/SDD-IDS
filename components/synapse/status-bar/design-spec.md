# Status Bar Design Spec

## IDS baseline (layout, flow, contracts)

Synapse **Status Bar** is a **thin ids-fork** of the IDS **Status Bar** pattern family (severity/health large & small, inventory, overflow, selection). Anatomy, composable child primitives, data contracts, overflow policy, selection API, state matrix, and codegen blueprint **inherit IDS** unless listed in **Synapse programme deltas** below.

- **IDS source of truth:** [`components/ids/status-bar/design-spec.md`](../ids/status-bar/design-spec.md)
- **Shared implementation:** `storybook/src/components/IdsStatusBar.tsx`, `IdsStatusBar.module.css`
- **Theme CSS:** `components/synapse-theme.css` (brand + overflow token resolution)
- **Base UI mapping:** none (presentational pattern; no Base UI primitive)

**Figma scope for this spec:** IDS Figma (`15412:10699`, `0bHk3XhrjFhowgFkz9yLr4`) is authoritative for anatomy, states, overflow geometry, and semantic token bindings. Synapse Hi-Fi **Patterns** board does not yet publish a dedicated Status Bar node (`data/synapse-component-figma-map.json` → empty `nodeId`); programme verification uses IDS baseline + Synapse theme contract until a Synapse board ships.

## Metadata

| Property | Value |
|---|---|
| Component | Status Bar |
| Design system | Synapse |
| Category | Patterns |
| Spec pattern | **ids-fork (override-only)** |
| IDS baseline slug | `status-bar` |
| Status | **active** |
| Version | 1.0.1 |
| IDS Figma main set | `15412:10699` — [IDS Status Bar](https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=15412-10699&m=dev) |
| Synapse Figma board | *Pending* — Patterns / Status Bar (map entry reserved) |
| Theme CSS | `components/synapse-theme.css` |
| Verification method | IDS baseline spec + Synapse theme token contract; IDS Figma MCP evidence |
| Last verified | 2026-06-17 |

**Selection corner:** inherits IDS CSS implementation (`clip-path` triangle + `shape-check-thick`); see IDS **Layout → Selection corner**.

### Synapse programme deltas (vs IDS)

| Topic | IDS | Synapse |
|---|---|---|
| Anatomy / child primitives | IDS contract | **Same** (inherit IDS) |
| Layout / heights / overflow geometry | IDS contract | **Same** (inherit IDS) |
| Typography tokens | IDS contract (`header-2`, `header-5`, `header-6`, `body-1`, `body-2`) | **Same** semantic names; values from `components/synapse-theme.css` |
| Item state matrix | IDS contract | **Same** semantic `var(--...)` names |
| Selection API (`selectionMode`, `onSelectionChange`) | IDS contract | **Same** (inherit IDS) |
| Brand label / border / icon (light) | `--color-text-brand-base` → `#0672cb`; `--color-border-brand-neutral` → `#0672cb`; `--color-icon-brand-base` → `#0672cb` | **Same aliases** → `#0076ce` via `components/synapse-theme.css` |
| Brand label / border / icon (dark) | `--color-text-brand-base` → `#509cda`; `--color-border-brand-neutral` → `#8898a5` | **Same** resolved values (inherit IDS dark palette) |
| Hover / press / selected fills | `brand-lighter` / `brand-light` aliases | **Same** aliases; Synapse light `brand-light` → `#d9eaf8` (IDS `#daeaf7`) |
| Overflow inverse gradient | `--color-gradient-overflow-horizontal-inverse-*` | **Same** token names; defined in `components/synapse-theme.css` (component-surface fade) |
| Runtime API | IDS contract | **Same** (inherit IDS) |

## Anatomy

Inherit IDS **Anatomy** — see [`components/ids/status-bar/design-spec.md`](../ids/status-bar/design-spec.md).

Composable children (`StatusBarRoot`, `StatusBarTotal`, `StatusBarContent`, `StatusBarContentTrack`, `StatusBarItem`, `StatusBarSeverityIcon`, `StatusBarInventoryIconStack`, `StatusBarInventoryCounter`, `StatusBarSelectionCorner`, `StatusBarOverflowLayer`, `StatusBarOverflowControl`) and deterministic render order are unchanged from IDS.

## Layout & Measurements

Inherit IDS bar heights, padding, divider geometry, overflow 64px side zones, icon sizes, inventory counter column layout, and shrink-wrap behavior when no total — see IDS **Layout & Measurements**.

Synapse-specific layout: **none** (no programme layout aliases).

## Tokens

### Theme-resolvable (Synapse)

Same semantic token names as IDS. Programme differences are **resolved values** in `components/synapse-theme.css`, not alternate slot contracts:

| Token | Synapse light (reference) | Notes |
|---|---|---|
| `--color-text-brand-base` | `#0076ce` | Inventory labels; severity alert-type labels |
| `--color-border-brand-neutral` | `#0076ce` | Hover / press / selected item borders |
| `--color-icon-brand-base` | `#0076ce` | Overflow chevrons |
| `--color-background-brand-lighter` | `#ebf4fb` | Hover / selected fill |
| `--color-background-brand-light` | `#d9eaf8` | Press fill |
| `--color-gradient-overflow-horizontal-inverse-start` | `#ffffff` | Overflow fade (matches component surface) |
| `--color-gradient-overflow-horizontal-inverse-end` | `rgba(255,255,255,0.00)` | Overflow fade |

All other tokens (typography scale, surfaces, disabled, alerting icon colors) inherit IDS names; see IDS **Tokens** section.

## States (Light Theme)

Inherit IDS **States (Light Theme)** from [`components/ids/status-bar/design-spec.md`](../ids/status-bar/design-spec.md).

Synapse applies only via theme-resolved brand and overflow tokens; **Background / Border / Text cells use the same `var(--...)` references** as IDS.

## States (Dark Theme)

Dark theme uses the same semantic tokens as **States (Light Theme)**. Resolved values for `[data-theme="dark"]` / Synapse dark scope live in `components/synapse-theme.css`.

Duplicate the full state matrix in this section only when a dark row genuinely uses different `var(--...)` references than the corresponding light row.

## Interactions

Inherit IDS **Interactions**, **Selection**, **Overflow controls**, **Responsive listeners**, **Accessibility**, and **Behavior & guidelines** from [`components/ids/status-bar/design-spec.md`](../ids/status-bar/design-spec.md).

## Composition & API (runtime)

### IDS inheritance resolution

Codegen **MUST** resolve props, data contracts, severity/icon maps, and composition modes from IDS **Composition & API (runtime)** in [`components/ids/status-bar/design-spec.md`](../ids/status-bar/design-spec.md) (`barType`, `items`, `total`, `showIcons`, `selectionMode`, `selectedItemIds`, `onSelectionChange`, child-composition Mode B, etc.).

### Synapse-only runtime flags

None. Programme chrome is applied exclusively via `components/synapse-theme.css`.

### Storybook defaults

| Prop | Synapse note |
|---|---|
| Theme import | `components/synapse-theme.css` (not `ids-theme.css`) |
| Implementation | `SynapseStatusBar` re-exports shared `IdsStatusBar` |
| Title path | `Spec Generated/Synapse/Status Bar` |

## Codegen Contract (Framework-Agnostic Blueprint)

### IDS baseline resolution

Generators **MUST** load and merge the IDS baseline contract from [`components/ids/status-bar/design-spec.md`](../ids/status-bar/design-spec.md) (`## Codegen Contract`) before applying Synapse programme overrides below.

### Programme override rules

| Rule | IDS | Synapse |
|---|---|---|
| All slots / variant matrix / behavior / a11y / assets | IDS contract | **Inherit IDS** |
| Theme import | `components/ids-theme.css` | **`components/synapse-theme.css`** |
| Hardcoded brand hex in component CSS | forbidden | forbidden — use semantic tokens only |

### Deterministic structure / variant matrix / per-slot style / behavior / accessibility / assets

Inherit IDS **Codegen Contract** subsections from [`components/ids/status-bar/design-spec.md`](../ids/status-bar/design-spec.md).

Generators targeting Synapse **must not** fork anatomy or API; emit the same PascalCase child identifiers and variant matrix as IDS.

### Fallback/error rules

Inherit IDS fallback table. Programme additions:

- Import **`components/synapse-theme.css`** for Synapse targets so brand and overflow inverse tokens resolve.
- If Synapse theme lacks an IDS-referenced token, add the alias to `components/synapse-theme.css` (do not hardcode in component CSS).

### Validation checklist

- [x] IDS baseline linked; programme deltas table lists **theme resolution only**
- [x] No structural/layout/API divergence from IDS
- [x] `--color-gradient-overflow-horizontal-inverse-*` present in `components/synapse-theme.css`
- [x] Brand tokens (`text-brand-base`, `border-brand-neutral`, `icon-brand-base`) documented with Synapse light values
- [x] Codegen Contract subsections resolve via IDS baseline merge
- [x] Composition/API inherits IDS (`selectionMode`, inventory `StatusBarInventoryCounter`, overflow scenarios)
- [x] Shared implementation: `IdsStatusBar.tsx` + `SynapseStatusBar` wrapper
- [x] Registry: `data/programme-inheritance-registry.json` → `synapse` / `status-bar`
- [x] Storybook `Spec Generated/Synapse/Status Bar` loads `components/synapse-theme.css`

## Source Mapping

| Property | Value |
|---|---|
| IDS baseline | `components/ids/status-bar/design-spec.md` |
| Programme spec | `components/synapse/status-bar/design-spec.md` |
| Registry | `data/programme-inheritance-registry.json` → `synapse` / `status-bar` |
| IDS Figma (authoritative) | `15412:10699` — file `0bHk3XhrjFhowgFkz9yLr4` |
| IDS scenario nodes | `18545:12347` (severity+total), `18545:12343` (inventory), `18545:12350` (overflow middle), `18545:12348` (states) |
| Synapse Figma | *Pending Patterns board node* |
| Theme | `components/synapse-theme.css` |
| Implementation | `storybook/src/components/IdsStatusBar.tsx` |
| Programme wrapper | `storybook/src/components/SynapseStatusBar.tsx` |
| Spec contract | `storybook/src/spec-contracts/synapse-status-bar.contract.ts` |
| Storybook | `storybook/src/components/SynapseStatusBar.stories.tsx` → `Spec Generated/Synapse/Status Bar` |
| Verification | IDS baseline + Synapse theme contract; IDS Figma MCP — 2026-06-17 |
