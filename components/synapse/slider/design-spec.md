# Slider Design Spec

## IDS baseline (layout, flow, contracts)

Synapse **Slider** is an **ids-fork** of the IDS **Slider** family. Rail/thumb/tick geometry, marker interaction states, range/single modes, stepper snapping, value labels/inputs, and runtime API **inherit IDS** unless listed in **Synapse programme deltas** below.

- **IDS source of truth:** [`components/ids/slider/design-spec.md`](../ids/slider/design-spec.md)
- **Shared implementation:** `storybook/src/components/Slider.tsx`, `Slider.module.css` (Base UI slider primitive)
- **Theme CSS:** `components/synapse-theme.css` (no programme layout aliases)

**Figma scope:** Synapse Form Elements board `21983:31228` embeds IDS slider matrices (`22459:39022`, `22459:40319`, `22459:38985`, `22505:177044`).

## Metadata

| Property | Value |
|---|---|
| Component | Slider |
| Design system | Synapse |
| Category | Form Elements |
| Spec pattern | **ids-fork (override-only)** |
| IDS baseline slug | `slider` |
| Status | **active** |
| Version | 1.0.0 |
| Figma board node | `21983:31228` — [Slider](https://www.figma.com/design/Td1bnsvRj1PCGs9RVJkIvJ/Synapse-Hi-Fi-components?node-id=21983-31228&m=dev) |
| Main component set | `22459:39022` (`Slider-Main`) |
| State showcase matrix | `22459:40319` |
| Element parts | `22459:38985` (`.Slider-Element-Parts`) |
| Marker states | `22505:177044` (`Slider-Element-Marker`) |
| Spec-accurate instance | `22459:39047` (`Value=##`, `State=Default`, `Show stepper=Yes`) |
| IDS Design Library file | `0bHk3XhrjFhowgFkz9yLr4` (same node IDs) |
| Theme CSS | `components/synapse-theme.css` |
| Verification method | Figma MCP (`get_metadata`, `get_variable_defs`) + IDS baseline |
| Last verified | 2026-06-05 |

### Synapse programme deltas (vs IDS)

| Topic | IDS | Synapse (Figma `22459:39047`) |
|---|---|---|
| Rail height | `4px` | **Same** |
| Thumb size | `16×16` | **Same** |
| Small tick | `8px` | **Same** |
| Focus halo | `22×22` | **Same** |
| Marker / rail tokens | IDS contract | **Same** |
| Value input height | `32px` | **Same** |
| Runtime API | IDS contract | **Same** (inherit IDS) |

**No programme layout aliases.**

## Anatomy

Inherit IDS **Anatomy** — `SliderRoot` → optional endpoint labels → `SliderRail` → optional progress/range segment → optional tick list → thumb(s) → optional value labels → optional value inputs. See [`components/ids/slider/design-spec.md`](../ids/slider/design-spec.md).

## Layout & Measurements

Inherit IDS from [`components/ids/slider/design-spec.md`](../ids/slider/design-spec.md):

- Rail: `4px` height; width `100%` (container-driven).
- Large thumb: `16×16`; focus footprint `22×22`.
- Small tick marker: `8px` diameter.
- Showcase row height: `80px` reference; runtime grows with value labels/inputs.
- Value input: `32px` height, `var(--padding-padding-16)` horizontal padding.
- Range input mode: two inputs + centered `"-"` separator.

## Tokens

Inherit IDS **Tokens** — rail, segment, marker, endpoint label, value label, and value-input semantic tokens (`var(--color-icon-brand-base)`, `var(--color-icon-brand-strong)`, `var(--color-icon-brand-stronger)`, `var(--color-border-brand-base)`, `var(--color-icon-disabled)`, `var(--color-background-gray-light)`, `var(--color-border-disabled)`, `var(--color-text-brand-base)`, `var(--color-text-disabled)`, `var(--color-text-neutral)`, `var(--color-background-component)`, `var(--color-border-accessible)`).

## States (Light Theme)

Inherit IDS **States (Light Theme)** state matrix from [`components/ids/slider/design-spec.md`](../ids/slider/design-spec.md) — rail, segment, small/large markers, endpoint labels, value inputs.

## States (Dark Theme)

Dark theme uses the same semantic tokens as **States (Light Theme)**. Resolved values for `[data-theme="dark"]` live in `components/synapse-theme.css`.

## Interactions

Inherit IDS **Interactions** — pointer drag/click, keyboard arrows/Home/End, range no-crossing, stepper snapping, endpoint label emphasis, disabled blocking.

## Composition & API (runtime)

### IDS inheritance resolution

Codegen **MUST** resolve props from IDS **Composition & API (runtime)** (`mode`, `min`, `max`, `step`, `value`, `defaultValue`, `disabled`, `showStepper`/`showTicks`, `stepperFrequency`, `showValueLabel`, `showValueInput`, `minLabel`, `maxLabel`, `onValueChange`, `onValueCommit`).

### Synapse-only runtime flags

None.

### Storybook defaults

Mirror IDS slider matrix stories under **Spec Generated/Synapse/Slider** with `components/synapse-theme.css` imported. Primary story: default single value with stepper (`22459:39047`).

## Codegen Contract (Framework-Agnostic Blueprint)

### IDS baseline resolution

Generators **MUST** load and merge the IDS baseline contract from [`components/ids/slider/design-spec.md`](../ids/slider/design-spec.md) (`## Codegen Contract`) before applying Synapse programme overrides below.

### Programme override rules

| Rule | IDS | Synapse |
|---|---|---|
| All slots / tokens / behavior | IDS contract | **Inherit IDS** |

### Deterministic structure

Inherit IDS slot order from IDS codegen contract (`SliderRoot` → labels → rail → segment → ticks → thumbs → value labels → inputs).

### Variant matrix

Inherit IDS: `mode` × `state` × `stepper` × `valueDisplay` × `inputMode` × `markerShape`.

### Per-slot style contract

Inherit IDS per-slot token mapping (4px rail, 16px thumb, 8px ticks, 22px focus halo, 32px inputs).

### Behavior contract

Inherit IDS clamp/quantize, range ordering, stepper snapping, `onValueChange` / `onValueCommit`.

### Accessibility contract

Inherit IDS slider semantics, `aria-valuemin` / `aria-valuemax` / `aria-valuenow`, per-thumb naming in range mode, focus visibility.

### Asset resolution + bundling contract

No external icon assets; marker shapes are CSS/token primitives.

### Fallback/error rules

Inherit IDS fallback rules (`mode`, `step`, `min`/`max`, invalid range values).

Programme additions:

- Import **`components/synapse-theme.css`** for Synapse targets.
- Base UI adapter: `@base-ui-components/react/slider` permitted when generating React Synapse output.

### Validation checklist

- [x] IDS baseline linked; no programme layout deltas
- [x] Figma MCP evidence on `22459:39047` (brand-base rail/thumb tokens)
- [x] Matrix nodes `22459:39022`, `22459:40319`, `22459:38985`, `22505:177044` documented
- [x] Storybook `Spec Generated/Synapse/Slider` loads `components/synapse-theme.css`
- [x] Registry: `data/programme-inheritance-registry.json` → `synapse` / `slider`

## Source Mapping

| Property | Value |
|---|---|
| IDS baseline | `components/ids/slider/design-spec.md` |
| Programme spec | `components/synapse/slider/design-spec.md` |
| Synapse Figma file | `Td1bnsvRj1PCGs9RVJkIvJ` |
| Board | `21983:31228` |
| Main set | `22459:39022` |
| Spec-accurate cell | `22459:39047` |
| Implementation | `storybook/src/components/Slider.tsx` |
| Programme wrapper | `storybook/src/components/SynapseSlider.tsx` |
| Spec contract | `storybook/src/spec-contracts/synapse-slider.contract.ts` |
| Storybook | `storybook/src/components/SynapseSlider.stories.tsx` |
| Verification | Figma MCP `get_metadata` + `get_variable_defs` on `21983:31228`, `22459:39047` (2026-06-05) |
