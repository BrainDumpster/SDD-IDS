# Slider Design Spec

## IDS baseline (layout, flow, contracts)

Synapse **Slider** is an **ids-fork** of the IDS **Slider** family. Form-context sliders (labels, steppers, value inputs, range mode) **inherit IDS** unless listed in **Synapse programme deltas** below.

**Viewport / topology toolbar** sliders use the Synapse-native rail + marker contract from the Topology board (`48306:5980`) — **not** the IDS 4px bordered rail.

- **IDS source of truth:** [`components/ids/slider/design-spec.md`](../ids/slider/design-spec.md)
- **Shared implementation:** `storybook/src/components/Slider.tsx`, `Slider.module.css` (Base UI slider primitive)
- **Programme wrapper:** `storybook/src/components/SynapseSlider.tsx`
- **Theme CSS:** `components/synapse-theme.css`

**Figma scope:**

| Context | Board / nodes |
|---|---|
| Form Elements (IDS-fork matrices) | `21983:31228` → IDS nodes `22459:39022`, `22459:40319`, `22459:38985`, `22505:177044` |
| Topology viewport slider (programme-native) | [`48306:5980`](https://www.figma.com/design/Td1bnsvRj1PCGs9RVJkIvJ/Synapse-Hi-Fi-components?node-id=48306-5980&m=dev) → `_Slider-Track` `53932:123038`, `.Slider-Element-Marker` `53910:122392`, `Slider` `53932:151178`, `Slider with buttons` `53932:151198`, `_Slider-Range` `53928:122954` |

## Metadata

| Property | Value |
|---|---|
| Component | Slider |
| Design system | Synapse |
| Category | Form Elements / Topology viewport |
| Spec pattern | **ids-fork** + **viewport programme deltas** |
| IDS baseline slug | `slider` |
| Status | **active** |
| Version | 1.2.0 |
| Synapse Figma file | `Td1bnsvRj1PCGs9RVJkIvJ` |
| Form Elements board | `21983:31228` |
| Topology board | `48306:5980` |
| Viewport track part | `53932:123027` (`_Slider-Track`) |
| Viewport marker states | `53910:122392` (`.Slider-Element-Marker`) |
| Viewport slider symbol | `53932:151178` (`120×16`) |
| Slider with buttons symbol | `53932:151198` (`254×28`) |
| Selected range part | `53928:122955` (`_Slider-Range`) |
| Topology consumer | `TopologyZoomSlider` → `53949:279842` |
| Theme CSS | `components/synapse-theme.css` |
| Verification method | Figma MCP (`get_metadata`, `get_design_context`, `get_variable_defs`) |
| Last verified | 2026-06-23 (Slider with buttons `53932:151198` geometry + chrome) |

### Synapse programme deltas (vs IDS)

| Topic | IDS (form) | Synapse viewport (`53932:151178`) |
|---|---|---|
| Rail height | `4px` + inset `var(--color-border-disabled)` frame | **`6px` pill**, no inset frame |
| Unselected rail fill | `var(--color-background-gray-light)` | **`var(--color-border-light)`** |
| Rail radius | square ends (border caps) | **`var(--corner-radius-radius-6)`** full pill |
| Selected segment fill | `var(--color-icon-brand-base)` | **`var(--color-background-brand-base)`** |
| Selected segment radius | none | **`var(--corner-radius-radius-6)`** |
| Thumb size | `16×16` | **Same** (`var(--sizing-size-16)`) |
| Thumb default | `var(--color-icon-brand-base)` | **Same** |
| Thumb hover | `var(--color-icon-brand-strong)` | **Same** (`#0062ab`) |
| Thumb press | `var(--color-icon-brand-stronger)` | **Same** (`#06528a`) |
| Focus halo | `22×22`, `var(--color-border-brand-base)` | **Same** |
| Host footprint | container-driven | **`120×16px`** reference (`density=viewport`) |
| Endpoint labels | optional `0` / `100` | **hidden** in topology (`showEdgeLabels=false`) |
| Stepper ticks | optional | **off** in topology |
| Zoom −/+ chrome | n/a | **outline icon button** `32×28px`: `1px` `var(--color-border-brand-base)`, `var(--corner-radius-radius-4)`, padding `6×8`, bg `var(--color-background-component)`, icons `ctrl-minimize-16` / `shape-plus` (`53932:151179`, `53932:151182`) |
| Cluster gap | n/a | **`var(--spacing-space-12)`** (`12px`) between −, slider, +, readout |
| Cluster footprint | n/a | **`254×28px`** reference row (`53932:151198`) |
| Percent readout | n/a | Body 2 `var(--font-size-body-2)` / `var(--font-line-height-line-height-20)`, `var(--color-text-neutral)`; Figma sample text `100%` (`53932:151183`) |
| Design sample fill | n/a | `_Slider-Range` width **`75px`** on **`120px`** track ≈ value **`63`** on `0–100` scale (`53928:122955`) |

**Form-context sliders** (labels, steppers, inputs): inherit IDS contract unchanged under `density=default`.

## Anatomy

### Form context (inherit IDS)

`SliderRoot` → optional endpoint labels → `SliderRail` → optional progress/range segment → optional tick list → thumb(s) → optional value labels → optional value inputs. See [`components/ids/slider/design-spec.md`](../ids/slider/design-spec.md).

### Viewport context (`density=viewport`)

1. `SliderRoot` (`120×16` host)
2. `SliderRail` — pill track (`6px`, `var(--color-border-light)`)
3. `SliderProgressSegment` — pill fill (`6px`, `var(--color-background-brand-base)`)
4. `SliderThumb` — `16×16` marker (`.Slider-Element-Marker`)

### Slider with buttons (`53932:151198`)

Deterministic horizontal cluster (`254×28px` reference, `items-center`, gap `12px`):

| # | Slot | Figma node | Contract |
|---|---|---|---|
| 1 | `ZoomOutButton` | `53932:151179` | `32×28px`; `ctrl-minimize-16`; `aria-label` “Zoom out” |
| 2 | `ViewportSlider` | `53932:151178` | `120×16px` host; see viewport anatomy |
| 3 | `ZoomInButton` | `53932:151182` | `32×28px`; `shape-plus`; `aria-label` “Zoom in” |
| 4 | `ZoomPercentReadout` | `53932:151183` | Body 2; `var(--color-text-neutral)`; `aria-live="polite"` |

**Button chrome (Figma `53932:151198` default — `buttonVariant="secondary"`):**

| Property | Value |
|---|---|
| Width × height | `32×28px` (incl. `1px` border, `box-sizing: border-box`) |
| Padding | `var(--padding-padding-6)` vertical, `var(--padding-padding-8)` horizontal |
| Background | `var(--color-background-component)` |
| Border | `var(--border-width-border-default)` solid `var(--color-border-brand-base)` |
| Border radius | `var(--corner-radius-radius-4)` |
| Icon | `16×16px`, `var(--color-icon-brand-base)` |
| Hover | `var(--color-background-controls-brand-lighter)` |
| Press | `var(--color-background-controls-brand-light)` |

**Tertiary variant (`buttonVariant="tertiary"` — topology toolbar via `TopologyZoomSlider`):**

| State | Background | Border |
|---|---|---|
| Default | `transparent` | `transparent` |
| `:hover` | `var(--color-background-controls-brand-lighter)` | `var(--border-width-border-default)` solid `var(--color-border-brand-base)` |
| `:active` | `var(--color-background-controls-brand-light)` | `var(--border-width-border-default)` solid `var(--color-border-brand-base)` |
| `:disabled` | `transparent` | `transparent` |

**Codegen rule:** Topology zoom −/+ **must** use `buttonVariant="tertiary"` — not the always-bordered secondary chrome above.

**Zoom button icons (`ctrl-minimize-16`, `shape-plus`):**

| Property | Contract |
|---|---|
| Size | `16×16px` |
| Rendering | `Icon` **`variant="mask"`** (default) — tint via CSS **`color`** / `currentColor` on mask; **do not** set SVG `fill` attributes |
| Exception | Status glyphs use `variant="img"` — not used on zoom buttons |

**Viewport thumb positioning (codegen):**

| Axis | Contract |
|---|---|
| Horizontal | `left: ((value − min) / (max − min)) × 100%` relative to track width |
| Vertical | `top: 50%`; `transform: translate(-50%, -50%)` — centers 16px thumb on 6px rail |
| Anti-pattern | Fixed `top: 5px` / magic pixel offsets — fails across densities |

Reference: `Slider.module.css` (`.stepperDot` uses vertical center pattern); `Slider.tsx` + Base UI `Thumb` for React reference.

**Selected range geometry (`_Slider-Range` `53928:122955`):**

- Blue segment (`53932:123008`): `6px` height, `var(--color-background-brand-base)`, left pill radius `6px`, overlaps thumb by `6px` (`mr-[-6px]` in Figma).
- Implementation: viewport indicator uses `border-radius: 6px 0 0 6px`; thumb `16×16` sits at segment end.

**Figma design reference instance vs live topology:**

| Context | Slider domain | Readout | Thumb fill (120px track) |
|---|---|---|---|
| Figma symbol `53932:151198` | `0–100` at value **`63`** | static **`100%`** | **`~75px`** (`62.5%`) |
| Topology toolbar `53949:279842` | zoom **`25–300`** (value = zoom %) | **`{value}%`** live | linear map: `(value − min) / (max − min)` |

Implemented as `SynapseSliderWithButtons` (`storybook/src/components/SynapseSliderWithButtons.tsx`). Topology toolbar uses `TopologyZoomSlider` (same chrome, topology domain).

## Layout & Measurements

### Form context

Inherit IDS from [`components/ids/slider/design-spec.md`](../ids/slider/design-spec.md).

### Viewport / topology

| Slot | Measurement | Figma node |
|---|---|---|
| Slider host | `120×16px` | `53932:151178` |
| Rail (`_Slider-Track`) | `6px` height, `120px` width, pill radius `6px` | `53932:123027` |
| Progress segment (`_Slider-Range` track) | `6px` height, width = thumb position, pill radius `6px` | `53932:123008` |
| Thumb (`.Slider-Element-Marker`) | `16×16px` | `53910:122402` |
| Focus halo | `22×22px` footprint | `53910:122395` |
| Slider-with-buttons row | `254×28px`; gap `12px`; `items-center` | `53932:151198` |
| Zoom out / zoom in button | `32×28px`; padding `6×8`; radius `4px` | `53932:151179` / `53932:151182` |
| Design-sample range width | `75px` on `120px` track (value `63` on `0–100`) | `53928:122955` |
| Percent readout | Body 2 / line-height 20; min content width from label | `53932:151183` |

## Tokens

### Viewport rail / segment / marker (Figma-verified `48306:5980`)

| Slot | Token |
|---|---|
| Unselected rail | `var(--color-border-light)` |
| Selected segment | `var(--color-background-brand-base)` |
| Thumb default | `var(--color-icon-brand-base)` |
| Thumb hover | `var(--color-icon-brand-strong)` |
| Thumb press | `var(--color-icon-brand-stronger)` |
| Focus ring | `var(--color-border-brand-base)` |
| Rail / segment radius | `var(--corner-radius-radius-6)` |
| Button background (zoom −/+) | `var(--color-background-component)` |
| Button border (zoom −/+) | `var(--color-border-brand-base)` |
| Button radius | `var(--corner-radius-radius-4)` |
| Button hover / press | `var(--color-background-controls-brand-lighter)` / `var(--color-background-controls-brand-light)` |
| Percent label text | `var(--color-text-neutral)` |

### Form context

Inherit IDS token table from [`components/ids/slider/design-spec.md`](../ids/slider/design-spec.md).

## States (Light Theme)

### Viewport marker (`.Slider-Element-Marker` `53910:122392`)

| State | Background | Border / ring | Notes |
|---|---|---|---|
| Default | `var(--color-icon-brand-base)` | none | `53910:122402` |
| Hover | `var(--color-icon-brand-strong)` | none | `53910:122400` |
| Press | `var(--color-icon-brand-stronger)` | none | `53910:122398` |
| Focus-visible | `var(--color-icon-brand-base)` | outer `22×22` `var(--color-border-brand-base)` | `53910:122395` |
| Disabled | `var(--color-icon-disabled)` | none | inherit IDS disabled blocking |

### Viewport rail

| State | Background | Border |
|---|---|---|
| Default (unselected) | `var(--color-border-light)` | none (pill fill only) |
| Selected segment | `var(--color-background-brand-base)` | none |
| Disabled | `var(--color-icon-disabled)` segment; rail muted | none |

### Form context

Inherit IDS **States (Light Theme)** from [`components/ids/slider/design-spec.md`](../ids/slider/design-spec.md).

## States (Dark Theme)

Viewport and form contexts use the same semantic token names; resolved values live in `components/synapse-theme.css` under `[data-theme="dark"]`.

## Interactions

### Form context

Inherit IDS — pointer drag/click, keyboard arrows/Home/End, range no-crossing, stepper snapping, endpoint label emphasis, disabled blocking.

### Viewport / topology

- Drag thumb or click rail: update zoom percent; clamp to `[min, max]`.
- **Zoom −** button: decrement by `step` (topology: `10`).
- **Zoom +** button: increment by `step`.
- No endpoint labels, steppers, or value inputs in default topology wiring.
- `ZoomPercentLabel` updates live (`aria-live="polite"`).

## Composition & API (runtime)

### IDS inheritance resolution

Codegen **MUST** resolve props from IDS **Composition & API (runtime)** (`mode`, `min`, `max`, `step`, `value`, `defaultValue`, `disabled`, `showStepper`/`showTicks`, `stepperFrequency`, `showValueLabel`, `showValueInput`, `minLabel`, `maxLabel`, `onValueChange`, `onValueCommit`).

### Synapse-only runtime flags

| Prop | Type | Default | Notes |
|---|---|---|---|
| `density` | `"default" \| "viewport"` | `"default"` | `viewport` applies Synapse pill rail (`6px`, `border-light`) for topology toolbar. |
| `showEdgeLabels` | `boolean` | `true` | Topology sets `false` (external −/+ and `%` label). |

### `SynapseSliderWithButtons` (`53932:151198`)

| Prop | Type | Required | Notes |
|---|---|---|---|
| `min` | `number` | yes | Slider lower bound |
| `max` | `number` | yes | Slider upper bound |
| `value` | `number` | yes | Controlled value |
| `onChange` | `(value: number) => void` | yes | Value updates |
| `step` | `number` | no | Default `1` |
| `decrementStep` / `incrementStep` | `number` | no | Button nudge interval (topology: `10`) |
| `readout` | `ReactNode` | no | Default `` `${value}%` ``; Figma sample: `"100%"` |
| `buttonVariant` | `"secondary" \| "tertiary"` | no | Default `secondary` (Figma `53932:151198`); topology uses **`tertiary`** |
| `disabled` | `boolean` | no | Blocks interaction |
| `aria-label` | `string` | no | Group label; topology uses `"Zoom"` |

### Topology zoom cluster (`TopologyZoomSlider`)

Delegates to `SynapseSliderWithButtons` with topology domain:

| Prop | Value (topology) |
|---|---|
| `min` / `max` | `25` / `300` (`SYNAPSE_TOPOLOGY_ZOOM_*`) |
| `decrementStep` / `incrementStep` | `10` (`SYNAPSE_TOPOLOGY_ZOOM_STEP_PERCENT`) |
| `readout` | `` `${value}%` `` live |
| `buttonVariant` | **`tertiary`** |
| Slider | `density="viewport"`, no labels/stepper |

### Storybook defaults

- **Form:** **Spec Generated/Synapse/Slider** — IDS matrix stories with `synapse-theme.css`; primary cell `22459:39047`.
- **Viewport:** story **Viewport / Topology** (`53932:151178`).
- **With buttons:** story **Viewport / With Buttons** (`53932:151198`) — `SYNAPSE_SLIDER_WITH_BUTTONS_DESIGN_SAMPLE` (`0–100`, value `63`, readout `100%`).

## Codegen Contract (Framework-Agnostic Blueprint)

### IDS baseline resolution

Generators **MUST** load IDS codegen from [`components/ids/slider/design-spec.md`](../ids/slider/design-spec.md) before applying Synapse overrides.

### Programme override rules

| Rule | IDS | Synapse `density=viewport` |
|---|---|---|
| Rail geometry | 4px + disabled border frame | 6px pill, `var(--color-border-light)`, radius 6 |
| Segment fill token | `var(--color-icon-brand-base)` | `var(--color-background-brand-base)` |
| Host width | 100% | `120px` reference in toolbar |
| Zoom buttons | n/a | `32×28px`; secondary = always bordered; **topology tertiary** = transparent border until hover |

### Per-slot style contract (viewport)

- `SliderRail`: `height: 6px`; `background: var(--color-border-light)`; `border-radius: var(--corner-radius-radius-6)`; **no** IDS inset border frame.
- `SliderProgressSegment`: `height: 6px`; `background: var(--color-background-brand-base)`; `border-radius: var(--corner-radius-radius-6) 0 0 var(--corner-radius-radius-6)` (left pill; thumb caps right).
- `SliderThumb`: `16×16`; state tokens per marker table; focus `outline` + `3px` offset → `22×22` footprint; **vertical** position `top: 50%`; `transform: translate(-50%, -50%)`; **horizontal** `%` from value.
- `SliderWithButtons` cluster: `height: 28px`; `gap: var(--spacing-space-12)` (`12px`).
- `ZoomOutButton` / `ZoomInButton` (**secondary**): `32×28px`; `padding: 6px 8px`; `border: 1px var(--color-border-brand-base)`; `border-radius: var(--corner-radius-radius-4)`; `background: var(--color-background-component)`.
- `ZoomOutButton` / `ZoomInButton` (**tertiary / topology**): transparent border default; brand border + lighter background on hover/active (see § Slider with buttons).
- Zoom icons: `Icon` `variant="mask"`; tint via `color` — not SVG `fill`.

### Behavior contract

Inherit IDS clamp/quantize; viewport uses single-thumb mode only in topology.

### Accessibility contract

Inherit IDS slider semantics; topology buttons require `aria-label` (“Zoom out” / “Zoom in”); percent label `aria-live="polite"`.

### Asset resolution + bundling contract

- Icons: `ctrl-minimize-16`, `shape-plus` (16px) via shared `Icon` / `Button` asset pipeline.
- Marker: CSS circle primitives (no raster in runtime).

### Fallback/error rules

Inherit IDS; unknown `density` falls back to `default` (IDS form rail).

### Validation checklist

- [x] Viewport rail `6px` pill + `var(--color-border-light)` matches `53932:123027`
- [x] Segment `var(--color-background-brand-base)` matches `53932:123008`
- [x] Marker states match `53910:122392` (default/hover/press/focus)
- [x] `Slider with buttons` layout matches `53932:151198` (`254×28`, gap `12`, buttons `32×28`)
- [x] Design sample fill `75px` / value `63` documented; topology `25–300` mapping separate
- [x] `TopologyZoomSlider` uses `SynapseSlider` + `density=viewport` + `buttonVariant=tertiary`
- [x] Tertiary zoom buttons: transparent border default; brand border on hover/active documented
- [x] Thumb vertical centering (`top: 50%`; `translate(-50%, -50%)`) documented
- [x] Zoom icons use mask + `color`, not SVG `fill`
- [x] Form IDS-fork matrices still documented (`21983:31228`)
- [x] Storybook loads `components/synapse-theme.css`

## Source Mapping

| Property | Value |
|---|---|
| IDS baseline | `components/ids/slider/design-spec.md` |
| Programme spec | `components/synapse/slider/design-spec.md` |
| Synapse Figma file | `Td1bnsvRj1PCGs9RVJkIvJ` |
| Topology board | [`48306:5980`](https://www.figma.com/design/Td1bnsvRj1PCGs9RVJkIvJ/Synapse-Hi-Fi-components?node-id=48306-5980&m=dev) |
| Track | `53932:123038` / `53932:123027` |
| Marker states | `53910:122392` |
| Viewport slider | `53932:151178` |
| Slider with buttons | `53932:151198` |
| Slider with buttons implementation | `storybook/src/components/SynapseSliderWithButtons.tsx` |
| Range part | `53928:122954` |
| Form board (IDS-fork) | `21983:31228` |
| Implementation | `storybook/src/components/Slider.tsx` |
| Viewport CSS | `Slider.module.css` → `[data-density="viewport"]` |
| Topology cluster | `storybook/src/components/topology/TopologyZoomSlider.tsx` |
| Spec contract | `storybook/src/spec-contracts/synapse-slider.contract.ts` |
| Storybook | `storybook/src/components/SynapseSlider.stories.tsx` |
| Verification | Figma MCP on `48306:5980`, `53932:151178`, `53932:151198`, `53910:122392` (2026-06-23) |
