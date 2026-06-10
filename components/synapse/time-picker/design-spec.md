# Time Picker Design Spec

## IDS baseline (layout, flow, contracts)

Synapse **Time Picker** is a **thin ids-fork** of the IDS **Time Picker**. Anatomy, scroll columns, value cells, interaction contracts, and runtime API **inherit IDS** unless listed in **Synapse programme deltas** below.

- **IDS source of truth:** [`components/ids/time-picker/design-spec.md`](../ids/time-picker/design-spec.md)
- **Shared implementation:** `storybook/src/components/IdsTimePicker.tsx`, `IdsTimePicker.module.css`
- **Theme CSS:** `components/synapse-theme.css` (layout alias overrides)
- **Base UI mapping:** `data/synapse-baseui-mapping.json` → `time-picker`

**Figma scope:** IDS Figma is authoritative. Programme Figma (`11067:54547`) documents field chrome in the shared Date/Time Picker family.

## Metadata

| Property | Value |
|---|---|
| Component | Time Picker |
| Design system | Synapse |
| Category | Form Elements |
| Spec pattern | **ids-fork (override-only)** |
| IDS baseline slug | `time-picker` |
| Status | **active** |
| Version | 1.1.0 |
| Figma node | `11067:54547` |
| Theme CSS | `components/synapse-theme.css` |
| Verification method | IDS baseline spec + theme alias contract |
| Last verified | 2026-06-10 |

### Synapse programme deltas (vs IDS)

| Topic | IDS | Synapse |
|---|---|---|
| Field container corner radius | `var(--time-picker-control-radius)` → `var(--corner-radius-radius-none)` (**0**) | **same alias** → **`var(--corner-radius-radius-4)`** (**4px**) via `components/synapse-theme.css` |
| Clock icon trigger corner radius | `var(--time-picker-control-radius)` | **same alias** → **`var(--corner-radius-radius-4)`** |
| Focus ring corner radius | `var(--time-picker-focus-ring-radius)` → `var(--corner-radius-radius-4)` | **same alias** → **`var(--corner-radius-radius-4)`** (unchanged scale) |
| Time popup columns / API | IDS contract | **Same** (inherit IDS) |

## Anatomy

Inherit IDS **Anatomy** — see [`components/ids/time-picker/design-spec.md`](../ids/time-picker/design-spec.md).

## Layout & Measurements

Inherit IDS field heights, popup layout, and value-cell geometry — see IDS **Layout & Measurements**.

Synapse field chrome (alias-driven; resolved in theme CSS):

- **`var(--time-picker-control-radius)`** → `var(--corner-radius-radius-4)` (4px) on `FieldContainer` and clock trigger
- **`var(--time-picker-focus-ring-radius)`** → `var(--corner-radius-radius-4)` (4px) on focus-visible ring

## Tokens

### Layout aliases (theme-resolvable)

| Alias | Synapse resolved value |
|---|---|
| `--time-picker-control-radius` | `var(--corner-radius-radius-4)` |
| `--time-picker-focus-ring-radius` | `var(--corner-radius-radius-4)` |

### Colors, typography, states

Inherit IDS **Tokens** and **States** — same semantic `var(--...)` names.

## States (Light Theme)

Inherit IDS **States (Light Theme)** from [`components/ids/time-picker/design-spec.md`](../ids/time-picker/design-spec.md).

Synapse chrome applies only via layout aliases above.

## States (Dark Theme)

Dark theme uses the same semantic tokens as **States (Light Theme)**. Resolved values for `[data-theme="dark"]` / Synapse dark scope live in `components/synapse-theme.css`.

Duplicate the full state matrix in this section only when a dark row genuinely uses different `var(--...)` references than the corresponding light row.

## Interactions

Inherit IDS **Interactions** and **Accessibility** from [`components/ids/time-picker/design-spec.md`](../ids/time-picker/design-spec.md).

## Composition & API (runtime)

### IDS inheritance resolution

Codegen **MUST** resolve props, events, and variant axes from IDS **Composition & API (runtime)** in [`components/ids/time-picker/design-spec.md`](../ids/time-picker/design-spec.md) (`value`, `onChange`, `size`, `label`, `placeholder`, `clockType`, `showSeconds`, `disabled`, popup open state, etc.).

### Synapse-only runtime flags

None. Programme chrome is applied exclusively via `components/synapse-theme.css` layout aliases.

### Storybook defaults

**Spec Accurate Design**: large field with label and placeholder under **Spec Generated/Synapse/Time Picker** with `components/synapse-theme.css` imported.

## Codegen Contract (Framework-Agnostic Blueprint)

### IDS baseline resolution

Generators **MUST** load and merge the IDS baseline contract from [`components/ids/time-picker/design-spec.md`](../ids/time-picker/design-spec.md) (`## Codegen Contract`) before applying Synapse programme overrides below.

### Programme override rules

| Rule | IDS | Synapse |
|---|---|---|
| `FieldContainer` `border-radius` | `var(--time-picker-control-radius)` | **Same alias**; theme → `radius-4` (4px) |
| Clock icon trigger `border-radius` | `var(--time-picker-control-radius)` | **Same alias**; theme → `radius-4` |
| Focus ring `border-radius` | `var(--time-picker-focus-ring-radius)` | **Same alias** (`radius-4`; unchanged from IDS scale) |
| Time popup columns / cells | IDS contract | **Inherit IDS** |

### Deterministic structure

Inherit IDS: `TimePickerRoot` → `Label` → `FieldContainer` (input + clock trigger) → optional hint → `TimePopup` with scroll columns. Synapse adds **no** slots.

### Variant matrix

Inherit IDS: `size` × `clockType` (`12h` \| `24h`) × `showSeconds` × field/popup states. See IDS **Codegen Contract → Variant matrix**.

### Per-slot style contract

| Slot | Property | Contract |
|---|---|---|
| `FieldContainer` | `border-radius` | `var(--time-picker-control-radius)` — Synapse theme → `var(--corner-radius-radius-4)` |
| Clock icon trigger | `border-radius` | `var(--time-picker-control-radius)` — Synapse theme → `var(--corner-radius-radius-4)` |
| Focus ring wrapper | `border-radius` | `var(--time-picker-focus-ring-radius)` — `var(--corner-radius-radius-4)` |
| All other slots | per IDS | Inherit IDS **Codegen Contract → Per-slot style contract** |

### Behavior contract

Inherit IDS popup open/close, column scroll selection, AM/PM toggle, and value formatting. See IDS **Codegen Contract → Behavior contract**.

### Accessibility contract

Inherit IDS label association, listbox/option semantics in columns, and keyboard navigation. See IDS **Codegen Contract → Accessibility contract**.

### Asset resolution + bundling contract

Inherit IDS clock/navigation icon slugs via shared Icon primitive. See IDS **Codegen Contract → Asset resolution**.

### Fallback/error rules

Inherit IDS invalid time and format fallbacks. Programme additions:

- Emit layout aliases on field shell and focus ring; never hardcode `0` or `4px` in component CSS.
- Import **`components/synapse-theme.css`** for Synapse targets so `--time-picker-control-radius` resolves to `var(--corner-radius-radius-4)`.

### Validation checklist

- [x] IDS baseline linked; programme deltas list **field layout aliases only**
- [x] `--time-picker-control-radius` and `--time-picker-focus-ring-radius` in IDS + Synapse theme CSS
- [x] `IdsTimePicker.module.css` uses aliases on field container, trigger, and focus ring
- [x] Codegen Contract subsections concrete (deterministic structure through fallback rules)
- [x] Composition/API resolves via IDS baseline; no Synapse-only props
- [x] Storybook `Spec Generated/Synapse/Time Picker` loads `components/synapse-theme.css`
- [x] Registry: `data/programme-inheritance-registry.json` → `synapse` / `time-picker`

## Source Mapping

| Property | Value |
|---|---|
| IDS baseline | `components/ids/time-picker/design-spec.md` |
| Programme spec | `components/synapse/time-picker/design-spec.md` |
| Registry | `data/programme-inheritance-registry.json` → `synapse` / `time-picker` |
| Synapse Figma | `11067:54547` (Date/Time Picker family) |
| Theme override | `components/synapse-theme.css` → `--time-picker-control-radius`, `--time-picker-focus-ring-radius` |
| Implementation | `storybook/src/components/IdsTimePicker.tsx` |
| Programme wrapper | `storybook/src/components/SynapseTimePicker.tsx` |
| Spec contract | `storybook/src/spec-contracts/synapse-time-picker.contract.ts` |
| Storybook | `storybook/src/components/SynapseTimePicker.stories.tsx` |
| Verification | IDS baseline + theme alias contract |
