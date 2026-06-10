# Wizard Design Spec

## IDS baseline (layout, flow, contracts)

Synapse **Wizard** is a **thin ids-fork** of the IDS **Wizard** (inline + modal modes). Anatomy, step model, size matrix, state indicators, interaction contracts, and runtime API **inherit IDS** unless listed in **Synapse programme deltas** below.

- **IDS source of truth:** [`components/ids/wizard/design-spec.md`](../ids/wizard/design-spec.md)
- **Shared implementation:** `storybook/src/components/IdsWizard.tsx`, `IdsWizard.module.css`
- **Theme CSS:** `components/synapse-theme.css` (`--modal-control-radius` for modal shell)
- **Base UI mapping:** `data/synapse-baseui-mapping.json` → `wizard-modal`

**Figma scope:** IDS Figma (`12690:246134`) is authoritative for anatomy and tokens. Programme Figma (`11067:54629`) documents modal presentation; chrome deltas are theme + Button programme flags.

## Metadata

| Property | Value |
|---|---|
| Component | Wizard |
| Design system | Synapse |
| Category | Modals and Wizards |
| Spec pattern | **ids-fork (override-only)** |
| IDS baseline slug | `wizard` |
| Status | **active** |
| Version | 1.0.0 |
| Figma node | `11067:54629` |
| Theme CSS | `components/synapse-theme.css` |
| Verification method | IDS baseline spec + theme alias contract |
| Last verified | 2026-06-10 |

### Synapse programme deltas (vs IDS)

| Topic | IDS | Synapse |
|---|---|---|
| **Modal** shell corner radius | `var(--modal-control-radius)` → `radius-none` (**0**) | **same alias** → **`radius-16`** (**16px**) via `components/synapse-theme.css` |
| **Modal** footer / trigger buttons | IDS footer button styling | **`programme="synapse"`** on shared `Button` (`size="lg"`) — see [`button`](../button/design-spec.md) |
| **Inline** footer buttons | IDS footer button styling | **Same** (inherit IDS native footer; no Synapse `Button` chrome) |
| Inline layout / steps / states | IDS contract | **Same** (inherit IDS) |
| Runtime API | IDS contract | **Same** (inherit IDS) |

## Anatomy

Inherit IDS **Anatomy** — see [`components/ids/wizard/design-spec.md`](../ids/wizard/design-spec.md).

## Layout & Measurements

Inherit IDS padding, size presets, and two-column body — see IDS **Layout & Measurements**.

Synapse-specific (modal mode only):

- Modal wizard shell: **`border-radius: var(--modal-control-radius)`** → `var(--corner-radius-radius-16)` in Synapse theme

## Tokens

Inherit IDS **Tokens**. Modal radius resolves via shared **`--modal-control-radius`** alias (documented in [`modal`](../modal/design-spec.md)).

## States (Light Theme)

Inherit IDS **States (Light Theme)**.

## States (Dark Theme)

Dark theme uses the same semantic tokens as **States (Light Theme)**. Resolved values for `[data-theme="dark"]` / Synapse dark scope live in `components/synapse-theme.css`.

Duplicate the full state matrix in this section only when a dark row genuinely uses different `var(--...)` references than the corresponding light row.

## Interactions

Inherit IDS **Interactions** and **Accessibility** from [`components/ids/wizard/design-spec.md`](../ids/wizard/design-spec.md).

## Composition & API (runtime)

### IDS inheritance resolution

Codegen **MUST** resolve props, events, and step model from IDS **Composition & API (runtime)** in [`components/ids/wizard/design-spec.md`](../ids/wizard/design-spec.md) (`mode`, `size`, `steps`, `trigger`, `onCancel`, `onPrevious`, `onNext`, `onFinish`, `onStepChange`, etc.).

### Synapse-only runtime flags

| Prop | Type | Default | Synapse note |
|---|---|---|---|
| `programme` | `"ids" \| "synapse"` | `"ids"` | When `"synapse"` **and** `mode="modal"`, footer/trigger render shared `Button` with `programme="synapse"`, `size="lg"`. **Inline mode** always uses IDS native footer classes regardless of `programme`. |

### Storybook defaults

Mirror IDS wizard examples under **Spec Generated/Synapse/Wizard** with `components/synapse-theme.css` imported (`Default`, `InlineDefault`, `ModalMode`, `TokenInspector`).

## Codegen Contract (Framework-Agnostic Blueprint)

### IDS baseline resolution

Generators **MUST** load and merge the IDS baseline contract from [`components/ids/wizard/design-spec.md`](../ids/wizard/design-spec.md) (`## Codegen Contract`) before applying Synapse programme overrides below.

### Programme override rules

| Rule | IDS | Synapse |
|---|---|---|
| Modal shell `border-radius` | `var(--modal-control-radius)` on `.modalRoot` | **Same alias**; theme → `radius-16` (16px) |
| Footer/trigger (modal + `programme="synapse"`) | IDS native footer classes | Shared `Button` with `programme="synapse"`, `size="lg"` — see [`button`](../button/design-spec.md) |
| Footer (inline mode) | IDS native footer classes | **Inherit IDS** (no Synapse `Button` chrome) |
| Inline shell / steps / content | IDS contract | **Inherit IDS** |

### Deterministic structure

Inherit IDS: `WizardRoot` → optional modal shell → header → body (`StepsPane` + `ContentPane` with page title, content, footer). Synapse adds **no** slots.

### Variant matrix

Inherit IDS: `mode` (`inline` \| `modal`) × `size` (`medium` \| `large` \| `x-large`) × step status indicators. See IDS **Codegen Contract → Variant matrix**.

### Per-slot style contract

| Slot | Property | Contract |
|---|---|---|
| `.modalRoot` (modal mode only) | `border-radius` | `var(--modal-control-radius)` — Synapse theme → `var(--corner-radius-radius-16)` |
| Modal footer/trigger `Button` | programme chrome | `programme="synapse"`, `size="lg"` when wizard `programme="synapse"` and `mode="modal"` |
| All other slots | per IDS | Inherit IDS **Codegen Contract → Per-slot style contract** |

### Behavior contract

Inherit IDS step navigation, modal open/close, scroll gradients, and event payloads (`stepCode`, `stepId`). See IDS **Codegen Contract → Behavior contract**.

### Accessibility contract

Inherit IDS focus trap (modal), step list semantics, and keyboard navigation. See IDS **Codegen Contract → Accessibility contract**.

### Asset resolution + bundling contract

Inherit IDS step status icons and close control slugs. See IDS **Codegen Contract → Asset resolution**.

### Fallback/error rules

Inherit IDS unknown `mode`/`size` fallbacks. Programme additions:

- Emit `var(--modal-control-radius)` on modal shell; never hardcode `0` or `16px` in component CSS.
- `programme="synapse"` without `mode="modal"` must not swap inline footer to Synapse `Button` (validation error at codegen QA).
- Import **`components/synapse-theme.css`** for Synapse targets so `--modal-control-radius` resolves to `var(--corner-radius-radius-16)`.

### Validation checklist

- [x] IDS baseline linked; programme deltas cover modal radius + modal-only Synapse buttons
- [x] `IdsWizard.module.css` uses `var(--modal-control-radius)` on `.modalRoot`
- [x] Modal footer uses Synapse `Button` only when `programme="synapse"` and `mode="modal"`
- [x] Inline footer remains IDS native (no Synapse button chrome)
- [x] Codegen Contract subsections concrete (deterministic structure through fallback rules)
- [x] Storybook `Spec Generated/Synapse/Wizard` loads `components/synapse-theme.css`
- [x] Registry: `data/programme-inheritance-registry.json` → `synapse` / `wizard`

## Source Mapping

| Property | Value |
|---|---|
| IDS baseline | `components/ids/wizard/design-spec.md` |
| Programme spec | `components/synapse/wizard/design-spec.md` |
| Registry | `data/programme-inheritance-registry.json` → `synapse` / `wizard` |
| Synapse Figma | `11067:54629` |
| IDS Figma | `12690:246134` |
| Theme override | `components/synapse-theme.css` → `--modal-control-radius` |
| Implementation | `storybook/src/components/IdsWizard.tsx` |
| Programme wrapper | `storybook/src/components/SynapseWizard.tsx` |
| Spec contract | `storybook/src/spec-contracts/synapse-wizard.contract.ts` |
| Storybook | `storybook-generated/synapse/src/components/Wizard.stories.tsx` |
| Verification | IDS baseline + theme alias contract; Synapse Figma `11067:54629` |
