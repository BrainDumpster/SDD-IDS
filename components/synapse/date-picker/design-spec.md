# Date Picker Design Spec

## IDS baseline (layout, flow, contracts)

Synapse **Date Picker** is a **thin ids-fork** of the IDS **Date Picker**. Anatomy, calendar popup, date cells, interaction contracts, and runtime API **inherit IDS** unless listed in **Synapse programme deltas** below.

- **IDS source of truth:** [`components/ids/date-picker/design-spec.md`](../ids/date-picker/design-spec.md)
- **Shared implementation:** `storybook/src/components/IdsDatePicker.tsx`, `IdsDatePicker.module.css`
- **Theme CSS:** `components/synapse-theme.css` (layout alias overrides)
- **Base UI mapping:** `data/synapse-baseui-mapping.json` → `date-picker`

**Figma scope:** IDS Figma is authoritative for anatomy, calendar grid, and semantic tokens. Programme Figma (`11067:54547`) documents field chrome in the shared Date/Time Picker family.

## Metadata

| Property | Value |
|---|---|
| Component | Date Picker |
| Design system | Synapse |
| Category | Form Elements |
| Spec pattern | **ids-fork (override-only)** |
| IDS baseline slug | `date-picker` |
| Status | **active** |
| Version | 1.1.0 |
| Figma node | `11067:54547` |
| Theme CSS | `components/synapse-theme.css` |
| Verification method | IDS baseline spec + theme alias contract |
| Last verified | 2026-06-10 |

### Synapse programme deltas (vs IDS)

| Topic | IDS | Synapse |
|---|---|---|
| Field container corner radius | `var(--date-picker-control-radius)` → `var(--corner-radius-radius-none)` (**0**) | **same alias** → **`var(--corner-radius-radius-4)`** (**4px**) via `components/synapse-theme.css` |
| Calendar icon trigger corner radius | `var(--date-picker-control-radius)` | **same alias** → **`var(--corner-radius-radius-4)`** |
| Focus ring corner radius | `var(--date-picker-focus-ring-radius)` → `var(--corner-radius-radius-4)` | **same alias** → **`var(--corner-radius-radius-4)`** (unchanged scale) |
| Calendar popup / date cells / API | IDS contract | **Same** (inherit IDS) |

## Anatomy

Inherit IDS **Anatomy** — see [`components/ids/date-picker/design-spec.md`](../ids/date-picker/design-spec.md).

## Layout & Measurements

Inherit IDS padding, field heights, calendar geometry, and cell sizes — see IDS **Layout & Measurements**.

Synapse field chrome (alias-driven; resolved in theme CSS):

- **`var(--date-picker-control-radius)`** → `var(--corner-radius-radius-4)` (4px) on `FieldContainer` and icon trigger
- **`var(--date-picker-focus-ring-radius)`** → `var(--corner-radius-radius-4)` (4px) on focus-visible ring

## Tokens

### Layout aliases (theme-resolvable)

| Alias | Synapse resolved value |
|---|---|
| `--date-picker-control-radius` | `var(--corner-radius-radius-4)` |
| `--date-picker-focus-ring-radius` | `var(--corner-radius-radius-4)` |

### Colors, typography, states

Inherit IDS **Tokens** and **States** — same semantic `var(--...)` names; values from `components/synapse-theme.css`.

## States (Light Theme)

Inherit IDS **States (Light Theme)** from [`components/ids/date-picker/design-spec.md`](../ids/date-picker/design-spec.md).

Synapse chrome applies only via layout aliases above; **Background / Border / Text/Icon cells are unchanged** from IDS.

## States (Dark Theme)

Dark theme uses the same semantic tokens as **States (Light Theme)**. Resolved values for `[data-theme="dark"]` / Synapse dark scope live in `components/synapse-theme.css`.

Duplicate the full state matrix in this section only when a dark row genuinely uses different `var(--...)` references than the corresponding light row.

## Interactions

Inherit IDS **Interactions** and **Accessibility** from [`components/ids/date-picker/design-spec.md`](../ids/date-picker/design-spec.md).

## Composition & API (runtime)

### IDS inheritance resolution

Codegen **MUST** resolve props, events, and variant axes from IDS **Composition & API (runtime)** in [`components/ids/date-picker/design-spec.md`](../ids/date-picker/design-spec.md) (`value`, `onChange`, `size`, `label`, `placeholder`, `disabled`, `error`, `min`, `max`, calendar popup open state, etc.).

### Synapse-only runtime flags

None. Programme chrome is applied exclusively via `components/synapse-theme.css` layout aliases.

### Storybook defaults

**Spec Accurate Design**: `size="large"`, `label="Start date"`, `placeholder="MM/DD/YYYY"` under **Spec Generated/Synapse/Date Picker** with `components/synapse-theme.css` imported.

## Codegen Contract (Framework-Agnostic Blueprint)

### IDS baseline resolution

Generators **MUST** load and merge the IDS baseline contract from [`components/ids/date-picker/design-spec.md`](../ids/date-picker/design-spec.md) (`## Codegen Contract`) before applying Synapse programme overrides below.

### Programme override rules

| Rule | IDS | Synapse |
|---|---|---|
| `FieldContainer` `border-radius` | `var(--date-picker-control-radius)` | **Same alias**; theme → `radius-4` (4px) |
| Icon trigger `border-radius` | `var(--date-picker-control-radius)` | **Same alias**; theme → `radius-4` |
| Focus ring `border-radius` | `var(--date-picker-focus-ring-radius)` | **Same alias** (`radius-4`; unchanged from IDS scale) |
| Calendar popup / cells | IDS contract | **Inherit IDS** |

### Deterministic structure

Inherit IDS: `DatePickerRoot` → `Label` → `FieldContainer` (input + calendar trigger) → optional helper/error → `CalendarPopup` with header, grid, footer. Synapse adds **no** slots.

### Variant matrix

Inherit IDS: `size` × field states (default/hover/focus/error/disabled/open) × calendar navigation states. See IDS **Codegen Contract → Variant matrix**.

### Per-slot style contract

| Slot | Property | Contract |
|---|---|---|
| `FieldContainer` | `border-radius` | `var(--date-picker-control-radius)` — Synapse theme → `var(--corner-radius-radius-4)` |
| Calendar icon trigger | `border-radius` | `var(--date-picker-control-radius)` — Synapse theme → `var(--corner-radius-radius-4)` |
| Focus ring wrapper | `border-radius` | `var(--date-picker-focus-ring-radius)` — `var(--corner-radius-radius-4)` |
| All other slots | per IDS | Inherit IDS **Codegen Contract → Per-slot style contract** |

### Behavior contract

Inherit IDS calendar open/close, date selection, keyboard navigation, and range constraints. See IDS **Codegen Contract → Behavior contract**.

### Accessibility contract

Inherit IDS label association, `aria-expanded`, grid roving tabindex, and focus return to trigger. See IDS **Codegen Contract → Accessibility contract**.

### Asset resolution + bundling contract

Inherit IDS calendar/navigation icon slugs via shared Icon primitive. See IDS **Codegen Contract → Asset resolution**.

### Fallback/error rules

Inherit IDS invalid date and out-of-range handling. Programme additions:

- Emit layout aliases on field shell and focus ring; never hardcode `0` or `4px` in component CSS.
- Import **`components/synapse-theme.css`** for Synapse targets so `--date-picker-control-radius` resolves to `var(--corner-radius-radius-4)`.

### Validation checklist

- [x] IDS baseline linked; programme deltas list **field layout aliases only**
- [x] `--date-picker-control-radius` and `--date-picker-focus-ring-radius` in IDS + Synapse theme CSS
- [x] `IdsDatePicker.module.css` uses aliases on field container, trigger, and focus ring
- [x] Codegen Contract subsections concrete (deterministic structure through fallback rules)
- [x] Composition/API resolves via IDS baseline; no Synapse-only props
- [x] Storybook `Spec Generated/Synapse/Date Picker` loads `components/synapse-theme.css`
- [x] Registry: `data/programme-inheritance-registry.json` → `synapse` / `date-picker`

## Source Mapping

| Property | Value |
|---|---|
| IDS baseline | `components/ids/date-picker/design-spec.md` |
| Programme spec | `components/synapse/date-picker/design-spec.md` |
| Registry | `data/programme-inheritance-registry.json` → `synapse` / `date-picker` |
| Synapse Figma | `11067:54547` (Date/Time Picker family) |
| Theme override | `components/synapse-theme.css` → `--date-picker-control-radius`, `--date-picker-focus-ring-radius` |
| Implementation | `storybook/src/components/IdsDatePicker.tsx` |
| Programme wrapper | `storybook/src/components/SynapseDatePicker.tsx` |
| Spec contract | `storybook/src/spec-contracts/synapse-date-picker.contract.ts` |
| Storybook | `storybook/src/components/SynapseDatePicker.stories.tsx` |
| Verification | IDS baseline + theme alias contract |
