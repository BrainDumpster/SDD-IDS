<!-- ds:inherits root-spec -->
# Stepper Design Spec

## Metadata

| Property | Value |
|---|---|
| Component | Stepper |
| Category | Components |
| Design System | Synapse |
| Figma URL (provided for review) | https://www.figma.com/design/Td1bnsvRj1PCGs9RVJkIvJ/Synapse-Hi-Fi-components?node-id=48160-11913&m=dev |
| Synapse map node | `48160:11907` |
| Inspected layout showcase node | `48160:11913` (`Stepper` layout+steps matrix) |
| Inspected state set | `48160:12248` (`Stepper Item`) + instances in `53010:50290`, `53010:50337` |
| Inspected icon set | `48160:12129` (`Stepper Icon`) + `shape-check-thick` |

## Anatomy

- **root**: step sequence container; supports `horizontal` and `vertical` orientation.
- **step item**: one step in the flow.
- **icon and line rail**: connector segment + 22x22 status icon, oriented by root direction.
- **number label row**: bottom row with numeric prefix and step text.
- **connector line**: 4px rail that changes color by state (horizontal bar or vertical bar).
- **status icon**: Not Started / In Progress / Completed visual marker.

## Layout & Measurements

### Step item geometry (from `Stepper Item` variants)
- Step item size: `180x50`.
- Vertical stack: two rows with `6px` spacing.
- Top row (`Icon and line`): `180x20`.
- Connector line: `180x4`.
- Status icon: `22x22`.
- Bottom row (`Process Steps Item`): `103x24`.

### Orientation layouts (from `48160:11913` showcase)
- `horizontal`:
  - root arranges items in a row (`left -> right`).
  - connector renders as horizontal bar (`height: 4px`) from icon center toward trailing edge.
  - typical sample frame: `600x108` for 4 items.
- `vertical`:
  - root arranges items in a column (`top -> bottom`).
  - connector renders as vertical bar (`width: 4px`) from icon center toward bottom edge.
  - typical sample frame: `162x504` for 4 items.

### Framework-safe CSS invariants (codegen critical)
- `root` must render as a horizontal strip with `display:flex`, `gap:0`, and one rendered `stepItem` per input step (no synthetic leading/trailing cap nodes).
- `stepItem` uses `flex: 1` to utilize available container width with `min-width: 180px` to maintain minimum size.
- `iconRail` is `position:relative; width:100%; height:20px` to utilize full container width.
- `connector` is centered vertically in `iconRail` (`height:4px` at 50% Y, translated `-50%`) and spans from center of current status icon to end of container (starts at `calc(var(--sizing-status-icon, 22px) / 2)`, width `100%`).
- `statusIcon` is absolutely positioned at rail start (`left:0; top:0; width:var(--sizing-status-icon, 22px); height:var(--sizing-status-icon, 22px)`) and layered above connector (`z-index:1`) to mask the connector under the icon.
- `labelRow` always uses base spacing/padding (`gap:8px`, `padding:2px 8px`); active state adds only chip background + radius.

### Label alignment (validated)
- Number text (`"1."`): Roboto, `14/20`, weight `500`, `textAlignHorizontal: LEFT`, `textAlignVertical: CENTER`.
- Step label (`"Step name"`): Roboto, `14/20`, weight `400`, `textAlignHorizontal: LEFT`, `textAlignVertical: CENTER`.
- Number + label are left-aligned in a single horizontal row under the icon/line rail.

### Available properties in Figma component set
`Stepper Item` (`48160:12248`) exposes:
- `Active` (variant boolean): `true | false`
- `State` (variant enum): `Not Started | Active | Completed`

`Stepper Icon` (`48160:12129`) exposes:
- `Completed` (variant boolean): `true | false`
- `Active` (variant boolean): `true | false`

## Tokens

Use semantic tokens from `components/synapse-theme.css`; do not hardcode design values in implementation code.

- `var(--color-background-gray-neutral-dark)` for **incomplete track** background in both orientations.
- `var(--color-border-lighter)` for not-started connector outline in legacy instances (tracks migrate to background token above).
- `var(--color-border-neutral-light)` for not-started icon stroke.
- `var(--color-background-surface-2)` for not-started icon fill.
- `var(--color-background-container-2)` for in-progress icon fill.
- `var(--color-border-brand-base)` for in-progress icon stroke and completed connector.
- `var(--color-background-brand-base)` for completed icon fill (circle behind the checkmark) in light theme.
- `var(--color-icon-inverse)` for completed icon glyph in dark theme (checkmark).
- `var(--color-text-white)` for completed checkmark glyph in light theme.
- `var(--color-text-neutral-strong)` for number and step label text.
- `var(--font-size-body-2)` + `var(--font-line-height-line-height-20)` for label typography.

## States (Light Theme)

| Item State | Connector | Icon container | Icon glyph | Label text |
|---|---|---|---|---|
| Not Started | `var(--color-background-gray-neutral-dark)` | fill `var(--color-background-surface-2)`, stroke `var(--color-background-gray-neutral-dark)` | none | `var(--color-text-neutral-strong)` |
| In Progress (`State=Active`, `Active=true`) | `var(--color-background-gray-neutral-dark)` | fill `var(--color-background-container-2)`, stroke `var(--color-border-brand-base)` | inner dot `var(--color-border-brand-base)` | `var(--color-text-neutral-strong)` on label container `var(--color-background-gray-neutral-lighter)` with padding `2px 8px` and radius `6px` |
| Completed | `var(--color-border-brand-base)` | fill `var(--color-background-brand-base)` | checkmark `var(--color-text-white)` | `var(--color-text-neutral-strong)` |

## States (Dark Theme)

| Item State | Connector | Icon container | Icon glyph | Label text |
|---|---|---|---|---|
| Not Started | `var(--color-background-gray-neutral-dark)` | fill `var(--color-background-surface-2)`, stroke `var(--color-background-gray-neutral-dark)` | none | `var(--color-text-neutral-strong)` |
| In Progress (`State=Active`, `Active=true`) | `var(--color-background-gray-neutral-dark)` | fill `var(--color-background-container-2)`, stroke `var(--color-border-brand-base)` | inner dot `var(--color-border-brand-base)` | `var(--color-text-neutral-strong)` on label container `var(--color-background-gray-neutral-lighter)` with padding `2px 8px` and radius `6px` |
| Completed | `var(--color-border-brand-base)` | fill `var(--color-background-brand-base)` | checkmark `var(--color-icon-inverse)` | `var(--color-text-neutral-strong)` |

## Interactions

- Stepper conveys progress with three visual states: `Not Started`, `In Progress`, `Completed`.
- `Completed` is the only state with a filled status icon + check glyph.
- `In Progress` keeps connector in neutral rail color while emphasizing the current step icon with brand stroke.
- Active step label container uses `var(--color-background-gray-neutral-lighter)` with `2px 8px` padding and `6px` corner radius.
- Labels remain left-aligned and do not shift between states.

## Composition & API (runtime)

- **Input props (minimum contract)**:
  - `steps: string[]` — ordered list of step labels (`["Account", "Profile", ...]`).
  - `activeStep: number` — zero-based index into `steps` for the in-progress step.
  - `orientation?: "horizontal" | "vertical"` (default `"horizontal"`).
  - optional `completed: number[]` — zero-based indices of steps in the `Completed` state.
- Recommended higher-level state shape:
  - derive per-step `state` (`not-started | active | completed`) from `steps`, `activeStep`, and `completed`.
  - optional click handling for back navigation to completed steps only.

## Codegen Contract (Framework-Agnostic Blueprint)

This section is normative for generation and validation.

### Deterministic structure
- `root`
  - repeated `stepItem`
    - `iconRail`
      - `connector`
      - `statusIcon`
    - `labelRow`
      - `stepNumber`
      - `stepText`

### Supported matrix
- Per-step state: `not-started | active | completed`
- Orientation: `horizontal | vertical`
- Active emphasis toggled by active step index.

### Slot style contract
- Step item geometry (`180x50`) and internal row sizes must match this spec.
- Connector thickness (`4px`) and icon size (`22x22`) are fixed.
- Label row typography and left alignment are deterministic.
- Label row base uses `2px 8px` padding; active state additionally applies chip background + `6px` radius.
- `statusIcon` is anchored at the rail start and overlays connector line (prevents duplicate-circle artifacts in generated layouts).

### Icon sizing and positioning (codegen critical)
- Status icon container: `22x22px` (fixed)
- Completed state checkmark: `12x12px` (60% of container size)
- Active state dot: `8x8px` (40% of container size)
- Icon positioning: Centered both vertically and horizontally within container
- Icon overlay: `z-index:1` to mask connector line underneath
- Icon scaling: All elements use `calc(var(--sizing-status-icon, 22px) * percentage)` for proportional scaling

### Icon component properties (codegen critical)
- **Icon component properties** (framework-agnostic):
  - Icon name/shape: "shape-check-thick" (primary) or "check" (fallback)
  - Icon size: "12" (for checkmark), "8" (for active dot)
  - Icon width: "12" (for checkmark), "8" (for active dot)  
  - Icon height: "12" (for checkmark), "8" (for active dot)
  - Icon color: `var(--color-text-white)` (completed state checkmark)
- **SVG fallback properties**:
  - `viewBox`: "0 0 20 20"
  - `width/height`: "12" (checkmark) or "8" (dot)
  - `stroke`: `var(--color-text-white)` (checkmark)

### Icon alignment implementation (codegen critical)
- **Status icon container**: `display: flex; align-items: center; justify-content: center`
- **Icon elements**: `display: flex; align-items: center; justify-content: center`
- **Absolute positioning**: `position: absolute; left: 0; top: 0`
- **Centering method**: Flexbox centering for cross-browser compatibility

### Stepper item sizing (codegen critical)
- **Container width**: `flex: 1` with `min-width: 180px`
- **Fixed dimensions**: `width: 180px` (basis), `height: 50px`
- **Responsive behavior**: Utilizes full container width
- **Icon rail**: `width: 100%; height: 20px`
- **Label row**: `width: 100%; height: 24px`
- **Vertical orientation**: root switches to column flow; icon rail switches to `width: 22px; height: 100%` with connector `width: 4px; height: 100%`.

### Framework implementation guidance (codegen critical)
- **Icon component**: Use framework's native icon component (e.g., Icon, ids-ng-icon, etc.)
- **Properties**: Apply both size and explicit width/height attributes where supported
- **Module imports**: Import required icon system modules for the target framework
- **CSS classes**: Use consistent CSS classes for icon styling (e.g., `.icon-checkmark`)
- **Token usage**: All dimensions via `var(--sizing-status-icon, 22px)` calculations

### Visual state specifications (codegen critical)
- **Not Started**: No icon, empty 22x22px container with border
- **Active**: 8x8px dot, `var(--color-border-brand-base)` color
- **Completed**: 12x12px checkmark, `var(--color-text-white)` color on brand background
- **Icon scaling**: All icons scale proportionally with container size
- **Color tokens**: Use semantic tokens for theme support

### Behavior and accessibility contract
- Active step derived from `activeStep`.
- Completed steps from `completed[]` (or derived rule if consumer omits).
- Optional click interactions may be limited to completed steps only.
- Expose current step semantics (`aria-current="step"` on active item when appropriate).


### Asset resolution + icon fallback contract
- For the **Completed** state glyph, codegen must resolve icon assets/components in this order:
  1. `shape-check-thick` (primary, Figma-aligned)
  2. `check` (fallback when primary is unavailable in target framework/library)
- This resolution rule applies across frameworks (React/Angular/Vue/Lit/etc.) and should prefer an existing icon component in the target codebase before raw SVG fallback.
- When an `Icon` component exists, codegen must inspect its input/prop API and pass the icon shape/name through the framework-native icon input (for example `name`, `icon`, `shape`, `glyph`, etc.) instead of assuming a fixed prop key.
- If neither icon exists, render a minimal semantic checkmark fallback and emit a generation warning.

### Fallback/error rules
- Out-of-range `activeStep` -> clamp to valid range.
- Unknown step state -> fallback `not-started`.
- Empty `steps` -> render nothing and warn.

### Validation checklist
- [ ] Not-started/active/completed visuals match token contract.
- [ ] Incomplete track token resolves to `var(--color-background-gray-neutral-dark)` in both orientations.
- [ ] Connector and icon transitions by state are correct.
- [ ] Active label chip styling is correct.
- [ ] `labelRow` base padding (`2px 8px`) exists in all states; active adds only chip bg/radius.
- [ ] Exactly `steps.length` circles are rendered (no extra terminal marker).
- [ ] If target framework/design-system provides an `Icon` component, completed-state glyph is rendered using that component with icon-name lookup (`shape-check-thick` first, then `check` fallback) and the actual shape/name input prop supported by that component.
- [ ] Typography/alignment remain stable across states.
- [ ] Accessibility semantics for active step pass.
- [ ] Icon sizing: Status container 22x22px, checkmark 12x12px, active dot 8x8px.
- [ ] Icon alignment: Centered vertically and horizontally within container.
- [ ] Icon properties: Correct size, width, height, and color attributes applied.
- [ ] Stepper item sizing: flex:1 with min-width:180px, utilizes full container width.
- [ ] Icon positioning: Absolute positioning at left:0, top:0 with z-index:1 overlay.
- [ ] Token-based scaling: All dimensions use var(--sizing-status-icon, 22px) calculations.
- [ ] Orientation matrix (`horizontal` and `vertical`) is implemented and visually consistent with Figma `48160:11913`.

## Source Mapping

| Source | Location |
|---|---|
| Root spec | `components/synapse/root-spec.md` |
| Theme CSS | `components/synapse-theme.css` |
| Synapse map | `data/synapse-component-figma-map.json` (`Stepper` -> `48160:11907`) |
| Figma set inspected | `48160:12248` (`Stepper Item`), `48160:12129` (`Stepper Icon`) |
| Figma layout showcase | `48160:11913` (`Horizontal` + `Vertical` examples for both Layout/Steps sections) |
