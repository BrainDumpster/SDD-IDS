# Text Input Design Spec

## IDS baseline (layout, flow, contracts)

Synapse **Text Input** is a **thin ids-fork** of the IDS **Text Box** field (single-line input, optional text area, suffix icon, helper/error row, size variants, interactive state model). Anatomy, state token bindings, interaction contracts, and runtime API **inherit IDS** unless listed in **Synapse programme deltas** below.

- **IDS source of truth:** [`components/ids/text-box/design-spec.md`](../ids/text-box/design-spec.md)
- **Shared implementation:** `storybook/src/components/IdsTextBox.tsx`, `IdsTextBox.module.css`
- **Theme CSS:** `components/synapse-theme.css` (overrides `--text-box-control-radius`)
- **Base UI mapping:** `data/synapse-baseui-mapping.json` → `text-input` (native `<input>` / `<textarea>` field pattern)

**Figma scope for this spec:** IDS Figma is authoritative for anatomy, states, and semantic tokens. Programme Figma (`47833:47770`) documents the **radius delta** only (4px vs IDS 0).

## Metadata

| Property | Value |
|---|---|
| Component | Text Input |
| Design system | Synapse |
| Category | Components / Form elements |
| Spec pattern | **ids-fork (override-only)** |
| IDS baseline slug | `text-box` |
| Status | **active** |
| Version | 1.2.0 |
| Figma node | `47833:47770` |
| Theme CSS | `components/synapse-theme.css` |
| Verification method | IDS baseline spec + theme alias contract |
| Last verified | 2026-06-10 |

### Synapse programme deltas (vs IDS)

| Topic | IDS | Synapse |
|---|---|---|
| Control corner radius | `var(--text-box-control-radius)` → `var(--corner-radius-radius-none)` (**0**) | **same alias** → **`var(--corner-radius-radius-4)`** (**4px**) via `components/synapse-theme.css` |
| Focus outer ring radius | `var(--text-box-focus-ring-radius)` → `var(--corner-radius-radius-4)` | **Same** (inherit IDS) |
| Border / text / icon tokens | IDS contract | **Same** (inherit IDS) |
| Size heights / padding / gaps | IDS contract | **Same** (inherit IDS) |
| Runtime API | IDS contract | **Same** (inherit IDS) |

## Anatomy

Inherit IDS **Anatomy** — see [`components/ids/text-box/design-spec.md`](../ids/text-box/design-spec.md).

## Layout & Measurements

Inherit IDS padding, heights, gaps, and focus-ring inset — see IDS **Layout & Measurements**.

Synapse-specific layout (alias-driven; resolved in theme CSS):

- Control corner radius: **`var(--text-box-control-radius)`** → `var(--corner-radius-radius-4)` in Synapse theme

## Tokens

### Layout aliases (theme-resolvable)

Same alias names as IDS; values overridden in `components/synapse-theme.css`:

| Alias | Synapse resolved value |
|---|---|
| `--text-box-control-radius` | `var(--corner-radius-radius-4)` |
| `--text-box-focus-ring-radius` | `var(--corner-radius-radius-4)` (unchanged from IDS) |

### Colors, typography, states

Inherit IDS **Tokens** and **States** tables — same semantic `var(--...)` names.

## States (Light Theme)

Inherit IDS **States (Light Theme)** from [`components/ids/text-box/design-spec.md`](../ids/text-box/design-spec.md).

Synapse chrome applies only via `--text-box-control-radius`; **Background / Border / Text/Icon cells are unchanged** from IDS.

## States (Dark Theme)

Dark theme uses the same semantic tokens as **States (Light Theme)**. Resolved values for `[data-theme="dark"]` / Synapse dark scope live in `components/synapse-theme.css`.

Duplicate the full state matrix in this section only when a dark row genuinely uses different `var(--...)` references than the corresponding light row.

## Interactions

Inherit IDS **Interactions** and **Accessibility** from [`components/ids/text-box/design-spec.md`](../ids/text-box/design-spec.md).

## Composition & API (runtime)

### IDS inheritance resolution

Codegen **MUST** resolve props, events, and variant axes from IDS **Composition & API (runtime)** in [`components/ids/text-box/design-spec.md`](../ids/text-box/design-spec.md) (`size`, `value`, `placeholder`, `helperText`, `errorText`, `disabled`, `readOnly`, `showIcon`, `multiline`, etc.).

### Synapse-only runtime flags

None. Programme chrome is applied exclusively via `components/synapse-theme.css` (`--text-box-control-radius`; focus ring alias unchanged).

### Storybook defaults

Mirror IDS **Spec Accurate Design** (Figma `47834:48520`) under **Spec Generated/Synapse/Text Input** with `components/synapse-theme.css` imported.

## Codegen Contract (Framework-Agnostic Blueprint)

### IDS baseline resolution

Generators **MUST** load and merge the IDS baseline contract from [`components/ids/text-box/design-spec.md`](../ids/text-box/design-spec.md) (`## Codegen Contract`) before applying Synapse programme overrides below.

### Programme override rules

| Rule | IDS | Synapse |
|---|---|---|
| `TextBoxControl` `border-radius` | `var(--text-box-control-radius)` | **Same alias**; theme resolves to `radius-4` (4px) |
| Focus ring `border-radius` | `var(--text-box-focus-ring-radius)` | **Same** (inherit IDS `radius-4`) |
| All other slots | IDS contract | **Inherit IDS** |

### Deterministic structure

Inherit IDS slot order: `TextBoxRoot` → `Label` → `TextBoxControl` (input/textarea + optional suffix icon) → `HelperErrorRow`. Synapse adds **no** slots.

### Variant matrix

Inherit IDS: `size` × `content` (empty/filled) × interactive states × optional icon/helper/error. See IDS **Codegen Contract → Variant matrix**.

### Per-slot style contract

| Slot | Property | Contract |
|---|---|---|
| `TextBoxControl` | `border-radius` | `var(--text-box-control-radius)` — Synapse theme → `var(--corner-radius-radius-4)` |
| Focus ring wrapper | `border-radius` | `var(--text-box-focus-ring-radius)` — **same alias as IDS** (`radius-4`) |
| All other slots | per IDS | Inherit IDS **Codegen Contract → Per-slot style contract** |

### Behavior contract

Inherit IDS focus/hover/disabled/error state transitions and value change events. See IDS **Codegen Contract → Behavior contract**.

### Accessibility contract

Inherit IDS label association, `aria-invalid`, and keyboard focus ring behavior. See IDS **Codegen Contract → Accessibility contract**.

### Asset resolution + bundling contract

Inherit IDS optional suffix icon slugs via shared Icon primitive. See IDS **Codegen Contract → Asset resolution**.

### Fallback/error rules

Inherit IDS unknown `size` and missing-label rules. Programme additions:

- Emit layout aliases on control and focus ring; never hardcode `0` or `4px` in component CSS.
- Import **`components/synapse-theme.css`** for Synapse targets so `--text-box-control-radius` resolves to `var(--corner-radius-radius-4)`.

### Validation checklist

- [x] IDS baseline linked; programme deltas list **control radius alias only**
- [x] `--text-box-control-radius` documented in IDS + Synapse theme CSS
- [x] `IdsTextBox.module.css` uses aliases on control and focus ring
- [x] Codegen Contract subsections concrete (deterministic structure through fallback rules)
- [x] Composition/API resolves via IDS baseline; no Synapse-only props
- [x] Storybook `Spec Generated/Synapse/Text Input` loads `components/synapse-theme.css`
- [x] Registry: `data/programme-inheritance-registry.json` → `synapse` / `text-input`

## Source Mapping

| Property | Value |
|---|---|
| IDS baseline | `components/ids/text-box/design-spec.md` |
| Programme spec | `components/synapse/text-input/design-spec.md` |
| Registry | `data/programme-inheritance-registry.json` → `synapse` / `text-input` |
| Synapse Figma (radius evidence) | `47833:47770` |
| IDS Figma (layout reference) | `47834:48520` |
| Theme override | `components/synapse-theme.css` → `--text-box-control-radius` |
| Implementation | `storybook/src/components/IdsTextBox.tsx` |
| Programme wrapper | `storybook/src/components/SynapseTextInput.tsx` |
| Spec contract | `storybook/src/spec-contracts/synapse-text-input.contract.ts` |
| Storybook | `storybook/src/components/SynapseTextInput.stories.tsx` |
| Verification | IDS baseline + theme alias contract; Synapse Figma `47833:47770` (radius evidence) |
