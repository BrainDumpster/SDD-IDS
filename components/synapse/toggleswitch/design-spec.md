# Toggle Switch Design Spec

## IDS baseline (layout, flow, contracts)

Synapse **Toggle Switch** is an **ids-fork** of the IDS **Toggle Switch** family. Track/thumb geometry (32×16 / 16×16), state token bindings, focus ring, interaction model, and runtime API **inherit IDS** unless listed in **Synapse programme deltas** below.

- **IDS source of truth:** [`components/ids/toggle-switch/design-spec.md`](../ids/toggle-switch/design-spec.md)
- **Shared implementation:** `storybook/src/components/ToggleSwitch.tsx`, `ToggleSwitch.module.css`
- **Theme CSS:** `components/synapse-theme.css` (no programme layout aliases — semantic tokens only)

**Figma scope:** Synapse component set `52721:273090` on board `52721:273164` (`Content`). Live verification confirms same track/thumb tokens as IDS (`gray-neutral-dark` off rail, `brand-base` on rail, `text-neutral` label).

## Metadata

| Property | Value |
|---|---|
| Component | Toggle Switch |
| Design system | Synapse |
| Category | Form Elements |
| Spec pattern | **ids-fork (override-only)** |
| IDS baseline slug | `toggle-switch` |
| Status | **active** |
| Version | 1.0.0 |
| Figma content frame | `52721:273164` — [Toggle Switch](https://www.figma.com/design/Td1bnsvRj1PCGs9RVJkIvJ/Synapse-Hi-Fi-components?node-id=52721-273164&m=dev) |
| Component set / matrix | `52721:273090` |
| Spec-accurate instance (off default) | `52721:273135` (`Toggle=Off, State=Default`) |
| Spec-accurate instance (on default) | `52721:273110` (`Toggle=On, State=Default`) |
| IDS Figma primary node | `42848:100536` (IDS exploration library) |
| Theme CSS | `components/synapse-theme.css` |
| Verification method | Figma MCP (`get_metadata`, `get_variable_defs`, `get_design_context`) + IDS baseline |
| Last verified | 2026-06-12 |

### Synapse programme deltas (vs IDS)

| Topic | IDS | Synapse (Figma `52721:273135` / `52721:273110`) |
|---|---|---|
| Track / thumb geometry | 32×16 track, 16×16 thumb, 16px travel | **Same** |
| Off/on/hover/focus/disabled tokens | IDS contract | **Same** semantic `var(--...)` names |
| Label typography | `var(--color-text-neutral)`, Body 2 | **Same** (`text-neutral` on switch label; optional form label wrapper may use `neutral-strong` — out of switch primitive scope) |
| Runtime API | IDS contract | **Same** (inherit IDS) |

**No programme layout aliases.** Synapse does not override corner radius, track size, or token names.

## Anatomy

Inherit IDS **Anatomy** — see [`components/ids/toggle-switch/design-spec.md`](../ids/toggle-switch/design-spec.md).

Deterministic slot order: `root` → `input` (hidden) → `switch` / `track` → `thumb` → optional `label` → optional `assistiveText`.

## Layout & Measurements

Inherit IDS track `32×16`, thumb `16×16`, thumb travel `16px`, label gap `var(--spacing-space-8)`, focus ring `inset: -3px` from [`components/ids/toggle-switch/design-spec.md`](../ids/toggle-switch/design-spec.md).

## Tokens

Inherit IDS **Tokens** per-slot bindings (track off/on/hover/disabled, thumb borders, label colors, focus ring).

## States (Light Theme)

Inherit IDS **States (Light Theme)** from [`components/ids/toggle-switch/design-spec.md`](../ids/toggle-switch/design-spec.md).

Synapse Figma matrix `52721:273090` documents Off/On × Default/Hover/Focus/Disabled — same semantic token rows as IDS.

## States (Dark Theme)

Dark theme uses the same semantic tokens as **States (Light Theme)**. Resolved values for `[data-theme="dark"]` live in `components/synapse-theme.css`.

## Interactions

Inherit IDS **Interactions** — click/tap toggle, `Space` on focus, `focus-visible` ring, disabled blocking, thumb transform animation.

## Composition & API (runtime)

### IDS inheritance resolution

Codegen **MUST** resolve props from IDS **Composition & API (runtime)** (`checked`, `defaultChecked`, `onCheckedChange`, `disabled`, `label`, `id`, `name`, `value`, `aria-label`, `aria-describedby`).

### Synapse-only runtime flags

None.

### Storybook defaults

Mirror Figma off/on default cells under **Spec Generated/Synapse/Toggle Switch** with `components/synapse-theme.css` imported.

## Codegen Contract (Framework-Agnostic Blueprint)

### IDS baseline resolution

Generators **MUST** load and merge the IDS baseline contract from [`components/ids/toggle-switch/design-spec.md`](../ids/toggle-switch/design-spec.md) (`## Codegen Contract`) before applying Synapse programme overrides below.

### Programme override rules

| Rule | IDS | Synapse |
|---|---|---|
| All slots | IDS contract | **Inherit IDS** (no overrides) |

### Deterministic structure

Inherit IDS slot order and hidden native checkbox / switch semantics.

### Variant matrix

Inherit IDS: `checked` × `disabled` × `hasLabel` (8 combinations).

### Per-slot style contract

Inherit IDS **Codegen Contract → Per-slot style contract** — track, thumb transform, label tokens.

### Behavior contract

Inherit IDS controlled/uncontrolled rules, single change event per toggle, disabled blocks mutation.

### Accessibility contract

Inherit IDS checkbox/switch semantics, label association, accessible name requirement, focus indicator.

### Asset resolution + bundling contract

No image assets required for baseline toggle rendering.

### Fallback/error rules

Inherit IDS unknown size fallback, missing accessible name error, controlled mode without handler warning.

Programme additions:

- Import **`components/synapse-theme.css`** for Synapse targets so semantic tokens resolve in programme theme scope.

### Validation checklist

- [x] IDS baseline linked; programme deltas table states **no layout aliases**
- [x] Codegen Contract subsections concrete
- [x] Figma MCP evidence on `52721:273090` matrix and `52721:273135` / `52721:273110`
- [x] Composition/API resolves via IDS baseline; no Synapse-only props
- [x] Storybook `Spec Generated/Synapse/Toggle Switch` loads `components/synapse-theme.css`
- [x] Registry: `data/programme-inheritance-registry.json` → `synapse` / `toggle-switch`

## Source Mapping

| Property | Value |
|---|---|
| IDS baseline | `components/ids/toggle-switch/design-spec.md` — node `42848:100536` |
| Programme spec | `components/synapse/toggleswitch/design-spec.md` |
| Synapse Figma file | `Td1bnsvRj1PCGs9RVJkIvJ` |
| Synapse content frame | `52721:273164` |
| Synapse component set | `52721:273090` |
| Synapse off-default symbol | `52721:273135` |
| Synapse on-default symbol | `52721:273110` |
| Implementation | `storybook/src/components/ToggleSwitch.tsx` |
| Programme wrapper | `storybook/src/components/SynapseToggleSwitch.tsx` |
| Spec contract | `storybook/src/spec-contracts/synapse-toggle-switch.contract.ts` |
| Storybook | `storybook/src/components/SynapseToggleSwitch.stories.tsx` |
| Verification | Figma MCP `get_variable_defs` on `52721:273135`, `52721:273110` (2026-06-12); `get_metadata` on `52721:273090` |
