# Dropdown Single Select Design Spec

## IDS baseline (layout, flow, contracts)

Synapse **Dropdown Single Select** is an **ids-fork** of the IDS **Dropdown: Single-select** family. Anatomy, state token bindings, option rows, keyboard model, and runtime API **inherit IDS** unless listed in **Synapse programme deltas** below.

- **IDS source of truth:** [`components/ids/dropdown-single-select/design-spec.md`](../ids/dropdown-single-select/design-spec.md)
- **Shared implementation:** `storybook/src/components/DropdownMenu.tsx`, `IdsDropdownTriggerShell.tsx`, `IdsDropdown.tsx`
- **Synapse wrapper:** `storybook/src/components/SynapseDropdown.tsx` (compound API), `SynapseDropdownTriggerShell.tsx`
- **Theme CSS:** `components/synapse-theme.css` (overrides `--dropdown-control-radius`, `--dropdown-menu-radius`)

## Metadata

| Property | Value |
|---|---|
| Component | Dropdown Single Select |
| Design system | Synapse |
| Category | Form Elements |
| Spec pattern | **ids-fork** |
| IDS baseline slug | `dropdown-single-select` |
| Status | **active** |
| Version | 1.1.0 |
| Figma node | `11067:54559` — [Dropdown/Single](https://www.figma.com/design/Td1bnsvRj1PCGs9RVJkIvJ/Synapse-Hi-Fi-components?node-id=11067-54559&m=dev) |
| Field states matrix | `11099:58099` |
| Rounded attached menu symbol | `52737:60513` (`Rounded Corners=True`) |
| Theme CSS | `components/synapse-theme.css` |
| Verification method | IDS baseline + programme layout alias contract + Figma matrix reference |
| Last verified | 2026-06-12 |

### Synapse programme deltas (vs IDS)

| Topic | IDS | Synapse |
|---|---|---|
| Field corner radius | `var(--dropdown-control-radius)` → `var(--corner-radius-radius-none)` (**0px** — square; Figma `12579:77895`) | **same alias** → **`var(--corner-radius-radius-4)`** (**4px**) |
| Focus outer ring radius | `var(--dropdown-focus-ring-radius)` → `var(--corner-radius-radius-4)` | **Same** (inherit IDS) |
| Detached / standalone menu radius | `var(--dropdown-menu-radius)` → `0` (square) | **same alias** → **`var(--corner-radius-radius-4)`** (**4px**) |
| Field-attached popup | bottom corners square (IDS) | **bottom corners** `0 0 var(--dropdown-menu-radius) var(--dropdown-menu-radius)`; field when open: top corners only |
| Popup above trigger (flip) | full border + top-only popup radius | **Same**; Synapse `--dropdown-menu-radius` → 4px |
| Field / option colors, spacing, typography | IDS contract | **Same** (inherit IDS) |
| Runtime API | IDS contract | **Same** (inherit IDS) |

## Anatomy

Inherit IDS **Anatomy** — see [`components/ids/dropdown-single-select/design-spec.md`](../ids/dropdown-single-select/design-spec.md).

## Layout & Measurements

Inherit IDS field heights, padding, option row metrics, and menu width rules from IDS **Layout & Measurements**.

Synapse-specific layout (alias-driven; resolved in theme CSS):

- Field corner radius: **`var(--dropdown-control-radius)`** → `var(--corner-radius-radius-4)` in Synapse theme
- Detached menu corner radius: **`var(--dropdown-menu-radius)`** → `var(--corner-radius-radius-4)` in Synapse theme
- **Field-attached menu popup** (Figma `Rounded Corners=True`, node `52737:60513`): popup uses **`border-radius: 0 0 var(--dropdown-menu-radius) var(--dropdown-menu-radius)`** when below; **top corners only** when above-flip; trigger field squares opposite edge when open
- **Popup placement & width:** inherit IDS runtime contract (field width measurement, min 186px, right-align + above-flip)

## Tokens

### Layout aliases (theme-resolvable)

| Alias | Synapse resolved value |
|---|---|
| `--dropdown-control-radius` | `var(--corner-radius-radius-4)` |
| `--dropdown-focus-ring-radius` | `var(--corner-radius-radius-4)` |
| `--dropdown-menu-radius` | `var(--corner-radius-radius-4)` |

### Colors, typography, states

Inherit IDS **Tokens** and **States** tables — same semantic `var(--...)` names.

## States (Light Theme)

Inherit IDS **States (Light Theme)** from [`components/ids/dropdown-single-select/design-spec.md`](../ids/dropdown-single-select/design-spec.md).

Synapse chrome applies only via dropdown layout aliases; **Background / Border / Text/Icon cells are unchanged** from IDS.

## States (Dark Theme)

Dark theme uses the same semantic tokens as **States (Light Theme)**. Resolved values for `[data-theme="dark"]` live in `components/synapse-theme.css`.

## Interactions

Inherit IDS **Interactions** — trigger toggle, arrow navigation, `Escape` close, single selection commit.

Inherit IDS **Accessibility** — combobox/listbox roles, `aria-expanded`, keyboard roving focus.

## Composition & API (runtime)

### IDS inheritance resolution

Codegen **MUST** resolve props and events from IDS **Composition & API (runtime)** in [`components/ids/dropdown-single-select/design-spec.md`](../ids/dropdown-single-select/design-spec.md).

**Storybook:** `SynapseDropdown` compound API — `SynapseDropdownSingleSelect.stories.tsx`, `synapse-dropdown.developer-usage.ts`.

### Synapse-only runtime flags

None. Programme chrome is applied exclusively via `components/synapse-theme.css` dropdown layout aliases.

## Codegen Contract (Framework-Agnostic Blueprint)

### IDS baseline resolution

Generators **MUST** load and merge the IDS baseline contract from [`components/ids/dropdown-single-select/design-spec.md`](../ids/dropdown-single-select/design-spec.md) (`## Codegen Contract`) before applying Synapse programme overrides below.

### Programme override rules

| Rule | IDS | Synapse |
|---|---|---|
| `FieldContainer` / trigger shell `border-radius` | `var(--dropdown-control-radius)` | **Same alias**; theme resolves to `radius-4` |
| Focus ring `border-radius` | `var(--dropdown-focus-ring-radius)` | **Same** (`radius-4`) |
| Detached menu popup `border-radius` | `var(--dropdown-menu-radius)` → `0` | **Same alias** → `radius-4` all corners |
| Field-attached menu popup | square bottom (IDS) | bottom: `0 0 var(--dropdown-menu-radius) var(--dropdown-menu-radius)` |
| Field when popup open | full radius (IDS) | top-only radius; bottom square |
| All other slots | IDS contract | **Inherit IDS** |

### Deterministic structure

Inherit IDS slot order: `DropdownRoot` → optional `Label` → `FieldContainer` (`ValueSlot` + `CaretSlot`) → optional helper/error → `MenuPopup` → `OptionList` → `OptionRow*`.

### Variant matrix

Inherit IDS: `size` (`small | large`) × field state (default | hover | focus | disabled | error) × popup open/closed × option row states.

### Per-slot style contract

| Slot | Property | Contract |
|---|---|---|
| Trigger shell | `border-radius` | `var(--dropdown-control-radius)` |
| Focus ring | `border-radius` | `var(--dropdown-focus-ring-radius)` |
| `.popup` (attached) | `border-radius` | `0 0 var(--dropdown-menu-radius) var(--dropdown-menu-radius)` below; top-only when above |
| `.popupStandalone` | `border-radius` | `var(--dropdown-menu-radius)` |
| Open trigger `[data-popup-open]` | bottom radii | `0` |
| Option rows / caret / labels | per IDS | Inherit IDS |

### Behavior contract

Inherit IDS open/close, selection commit, outside click, and disabled blocking.

### Accessibility contract

Inherit IDS combobox pattern, listbox option roles, typeahead, and focus return on close.

### Asset resolution + bundling contract

- Caret: `arrow-drop-tri-caret` slug via shared Icon primitive
- Error icon on validation row: `status-critical-square-solid` per IDS

### Fallback/error rules

Inherit IDS unknown `size`, empty options, and missing-label rules.

Programme additions:

- Never hardcode `2px` / `4px` on field or menu shells; use layout aliases only.
- Import **`components/synapse-theme.css`** for Synapse targets.

### Validation checklist

- [x] IDS baseline linked; programme deltas list dropdown layout aliases
- [x] `--dropdown-control-radius`, `--dropdown-focus-ring-radius`, `--dropdown-menu-radius` in IDS + Synapse theme CSS
- [x] `IdsDropdownTriggerShell.module.css` / `DropdownMenu.module.css` use aliases
- [x] Codegen Contract subsections concrete
- [x] Composition/API resolves via IDS baseline
- [x] Attached popup radius documented (`52737:60513`)
- [x] Storybook `Spec Generated/Synapse/Dropdown/Single Select` loads `components/synapse-theme.css`
- [x] Composition Storybook uses `SynapseDropdown` compound API
- [x] Popup width + above-flip inherit IDS with Synapse radius aliases
- [x] Registry: `data/programme-inheritance-registry.json` → `synapse` / `dropdown-single-select`

## Source Mapping

| Property | Value |
|---|---|
| IDS baseline | `components/ids/dropdown-single-select/design-spec.md` |
| Programme spec | `components/synapse/dropdown-single-select/design-spec.md` |
| Synapse Figma file | `Td1bnsvRj1PCGs9RVJkIvJ` |
| Main component set | `11067:54559` |
| Field states matrix | `11099:58099` |
| Rounded menu evidence | `52737:60513` |
| Theme overrides | `components/synapse-theme.css` |
| Implementation | `SynapseDropdown.tsx`, `SynapseDropdownTriggerShell.tsx`, `DropdownMenu.tsx` |
| Developer usage | `storybook/src/components/synapse-dropdown.developer-usage.ts` |
| Spec contract | `storybook/src/spec-contracts/synapse-dropdown-single-select.contract.ts` |
| Storybook | `storybook/src/components/SynapseDropdownSingleSelect.stories.tsx` |
| Verification | IDS baseline + theme alias contract; composition parity 2026-06-30 |
