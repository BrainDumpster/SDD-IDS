# Dropdown Multiselect Design Spec

## IDS baseline (layout, flow, contracts)

Synapse **Dropdown Multiselect** is an **ids-fork** of the IDS **Dropdown: Multiselect** family. Anatomy, checkbox leading controls, select-all row, option rows, and runtime API **inherit IDS** unless listed in **Synapse programme deltas** below.

- **IDS source of truth:** [`components/ids/dropdown-multiselect/design-spec.md`](../ids/dropdown-multiselect/design-spec.md)
- **Shared implementation:** `storybook/src/components/DropdownMenu.tsx`, `IdsDropdownTriggerShell.tsx`
- **Synapse wrapper:** `storybook/src/components/SynapseDropdownMenu.tsx`, `SynapseDropdownTriggerShell.tsx`
- **Theme CSS:** `components/synapse-theme.css` (overrides `--dropdown-control-radius`, `--dropdown-menu-radius`)

## Metadata

| Property | Value |
|---|---|
| Component | Dropdown Multiselect |
| Design system | Synapse |
| Category | Form Elements |
| Spec pattern | **ids-fork** |
| IDS baseline slug | `dropdown-multiselect` |
| Status | **active** |
| Version | 1.1.0 |
| Figma node | `11067:54555` — [Dropdown/Multi](https://www.figma.com/design/Td1bnsvRj1PCGs9RVJkIvJ/Synapse-Hi-Fi-components?node-id=11067-54555&m=dev) |
| Rounded attached menu symbol | `52737:60513` (`Rounded Corners=True`) |
| Theme CSS | `components/synapse-theme.css` |
| Verification method | IDS baseline + programme layout alias contract |
| Last verified | 2026-06-12 |

### Synapse programme deltas (vs IDS)

| Topic | IDS | Synapse |
|---|---|---|
| Field corner radius | `var(--dropdown-control-radius)` → `var(--corner-radius-radius-2)` (**2px**) | **same alias** → **`var(--corner-radius-radius-4)`** (**4px**) |
| Focus outer ring radius | `var(--dropdown-focus-ring-radius)` → `var(--corner-radius-radius-4)` | **Same** (inherit IDS) |
| Detached / standalone menu radius | `var(--dropdown-menu-radius)` → `0` (square) | **same alias** → **`var(--corner-radius-radius-4)`** (**4px**) |
| Field-attached popup | bottom corners square (IDS) | bottom corners `var(--dropdown-menu-radius)`; field top-only when open |
| Checkbox corner radius (leading control) | `var(--corner-radius-radius-2)` | **Same** (inherit IDS — not field shell) |
| Field / option colors, spacing | IDS contract | **Same** (inherit IDS) |
| Runtime API | IDS contract | **Same** (inherit IDS) |

## Anatomy

Inherit IDS **Anatomy** — see [`components/ids/dropdown-multiselect/design-spec.md`](../ids/dropdown-multiselect/design-spec.md).

## Layout & Measurements

Inherit IDS field heights, padding, and option metrics from IDS **Layout & Measurements**.

Synapse-specific layout (alias-driven):

- Field corner radius: **`var(--dropdown-control-radius)`** → `var(--corner-radius-radius-4)`
- Detached menu corner radius: **`var(--dropdown-menu-radius)`** → `var(--corner-radius-radius-4)`
- Field-attached popup: bottom corners `var(--dropdown-menu-radius)`; field top-only radius when open (Figma `52737:60513`)

## Tokens

### Layout aliases (theme-resolvable)

| Alias | Synapse resolved value |
|---|---|
| `--dropdown-control-radius` | `var(--corner-radius-radius-4)` |
| `--dropdown-focus-ring-radius` | `var(--corner-radius-radius-4)` |
| `--dropdown-menu-radius` | `var(--corner-radius-radius-4)` |

### Colors, typography, states

Inherit IDS **Tokens** and **States** tables.

## States (Light Theme)

Inherit IDS **States (Light Theme)**. Synapse chrome applies only via dropdown layout aliases.

## States (Dark Theme)

Same semantic tokens as Light; dark values from `components/synapse-theme.css`.

## Interactions

Inherit IDS **Interactions** — multi-toggle selection, select-all / clear-all, search row when enabled.

Inherit IDS **Accessibility**.

## Composition & API (runtime)

### IDS inheritance resolution

Codegen **MUST** resolve props and events from IDS **Composition & API (runtime)** in [`components/ids/dropdown-multiselect/design-spec.md`](../ids/dropdown-multiselect/design-spec.md).

### Synapse-only runtime flags

None.

## Codegen Contract (Framework-Agnostic Blueprint)

### IDS baseline resolution

Generators **MUST** load and merge the IDS baseline contract from [`components/ids/dropdown-multiselect/design-spec.md`](../ids/dropdown-multiselect/design-spec.md) (`## Codegen Contract`) before applying Synapse programme overrides below.

### Programme override rules

| Rule | IDS | Synapse |
|---|---|---|
| Field trigger `border-radius` | `var(--dropdown-control-radius)` | **Same alias** → `radius-4` |
| Focus ring | `var(--dropdown-focus-ring-radius)` | **Same** |
| Menu popup radii | per IDS square detached / attached rules | use `--dropdown-menu-radius` per single-select Synapse attached/detached split |
| Leading checkbox control | `radius-2` | **Inherit IDS** (use `--checkbox-control-radius` when shared Checkbox primitive used) |
| All other slots | IDS contract | **Inherit IDS** |

### Deterministic structure

Inherit IDS: `DropdownRoot` → field shell → popup → optional `SearchRow` → `SelectAllRow` → `OptionList` (checkbox + label per row) → optional `ClearAllAction` / `ShowSelectedToggle`.

### Variant matrix

Inherit IDS: `size` × field state × selection set × option row states × optional search/select-all chrome.

### Per-slot style contract

| Slot | Property | Contract |
|---|---|---|
| Trigger shell | `border-radius` | `var(--dropdown-control-radius)` |
| Focus ring | `border-radius` | `var(--dropdown-focus-ring-radius)` |
| Attached `.popup` | `border-radius` | `0 0 var(--dropdown-menu-radius) var(--dropdown-menu-radius)` |
| Detached `.popupStandalone` | `border-radius` | `var(--dropdown-menu-radius)` |
| Option row checkbox | `border-radius` | `var(--checkbox-control-radius, var(--corner-radius-radius-2))` |
| Other slots | per IDS | Inherit IDS |

### Behavior contract

Inherit IDS multi-select toggle, select-all semantics, and popup close rules.

### Accessibility contract

Inherit IDS listbox + checkbox option pattern, `aria-multiselectable`, keyboard toggling.

### Asset resolution + bundling contract

Inherit IDS caret, search icon, and checkbox CSS indicators.

### Fallback/error rules

Inherit IDS unknown size and empty selection rules.

Programme additions:

- Use layout aliases only; import `components/synapse-theme.css` for Synapse.

### Validation checklist

- [x] IDS baseline linked; programme deltas list dropdown layout aliases
- [x] Theme aliases documented in IDS + Synapse CSS
- [x] Trigger shell and menu CSS use aliases
- [x] Codegen Contract subsections concrete
- [x] Leading checkbox remains `radius-2` (not field `radius-4`)
- [x] Storybook `Spec Generated/Synapse/Dropdown/Multiselect` loads `components/synapse-theme.css`
- [x] Registry: `data/programme-inheritance-registry.json` → `synapse` / `dropdown-multiselect`

## Source Mapping

| Property | Value |
|---|---|
| IDS baseline | `components/ids/dropdown-multiselect/design-spec.md` |
| Programme spec | `components/synapse/dropdown-multiselect/design-spec.md` |
| Synapse Figma file | `Td1bnsvRj1PCGs9RVJkIvJ` |
| Main component set | `11067:54555` |
| Rounded menu evidence | `52737:60513` |
| Theme overrides | `components/synapse-theme.css` |
| Implementation | `SynapseDropdownMenu.tsx`, `SynapseDropdownTriggerShell.tsx` |
| Spec contract | `storybook/src/spec-contracts/synapse-dropdown-multiselect.contract.ts` |
| Storybook | `storybook/src/components/SynapseDropdownMultiSelect.stories.tsx` |
| Verification | IDS baseline + theme alias contract (2026-06-12) |
