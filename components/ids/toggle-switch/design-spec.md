# Toggle Switch Design Spec

## Metadata
- Design system: IDS
- Component: Toggle Switch
- Category: Formelements
- Figma file: `VZJ48bbVYrIynw8DdSukWw`
- Primary node: `42848:100536`
- Source URL: https://www.figma.com/design/VZJ48bbVYrIynw8DdSukWw/-Exploration-only--IDS-with-variables?node-id=42848-100536&m=dev
- Runtime role: Binary form control for boolean on/off values
- Spec status: Production-ready blueprint for framework-agnostic codegen
## Anatomy
Deterministic slot order:
1. `root` (label wrapper / control container) — Angular: `ids-toggle-switch`
2. `input` (native checkbox input; visually hidden but focusable) — Angular: `ids-toggle-switch-input`
3. `switch` (interactive visual switch rail; implementation wrapper around track + thumb, not a public selector)
4. `track` (background rail) — Angular: `ids-toggle-switch-track`
5. `thumb` (movable knob) — Angular: `ids-toggle-switch-thumb`
6. `label` (optional visible text) — Angular: `ids-toggle-switch-label`
7. `assistiveText` (optional helper/description, if product uses it) — Angular: `ids-toggle-switch-assistive-text`

Preferred projected-child order (Angular):

```
ids-toggle-switch
  ids-toggle-switch-input
  ids-toggle-switch-track
  ids-toggle-switch-thumb
  ids-toggle-switch-label
  ids-toggle-switch-assistive-text
```
## Layout & Measurements
- Track width: `32px` (fixed visual body size)
- Track height: `16px` (fixed visual body size)
- Thumb size: `16px x 16px`
- Border radius: track `999px`, thumb `999px`
- Thumb travel distance (off -> on): `16px`
- Label gap from switch: `var(--spacing-space-8)` (fallback `8px`)
- Label line-height: `16px` in component sample rows.
- Focus ring geometry around switch body: `38px x 22px` (implemented as `inset: -3px` ring around `32x16` body).
- Interactive target rule: visual switch remains `32x16`, but click target should be expanded by wrapper/label in runtime layouts.
- Sample-only note: frame widths in Figma are showcase values; runtime width is container-driven when label text varies.
## Tokens
Per-slot semantic tokens (verified via Figma MCP on component set `8505:14389` / symbol `8505:14390` — Off default rail reads as **neutral dark gray**; `get_variable_defs` may omit bound fills when the toggle is rasterized):

- `track.off.background`: `var(--color-background-gray-neutral-dark)` — light `#616161`, dark `#616161` (Figma `Toggle=Off, State=Default` / MCP: dark gray rail; token added to IDS theme)
- `track.off.border`: `var(--color-border-gray-neutral-base)` — light `#4d4d4d`, dark `#8898a5`
- `track.off.hover.background`: `var(--color-background-gray-neutral-light)` — light `#4d4d4d`, dark `#8898a5`
- `track.off.hover.border`: `var(--color-border-gray-neutral-strong)` — light `#252525`, dark `#b8c1c9`
- `track.on.background`: `var(--color-background-brand-base)` — light `#0076ce`, dark `#4c9fdd`
- `track.on.border`: `var(--color-border-brand-base)` — light `#0076ce`, dark `#4c9fdd`
- `track.on.hover.background`: `var(--color-background-brand-strong)` — light `#0062ab`, dark `#94c5ea`
- `track.on.hover.border`: `var(--color-border-brand-strong)` — light `#0062ab`, dark `#94c5ea`
- `track.disabled.background`: `var(--color-background-gray-light)`
- `track.disabled.checked.background`: `var(--color-background-gray-light)`
- `track.disabled.border`: `var(--color-border-gray-disabled)` — light `#757575`, dark `#9e9e9e`

- `thumb.default.background`: `var(--color-background-surface-component)` (Figma binds knob fill to component surface; light `#ffffff`, dark `#111619`)
- `thumb.off.default.border`: `var(--border-width-border-1)` solid `var(--color-border-gray-neutral-base)`
- `thumb.off.hover.border`: `var(--border-width-border-1)` solid `var(--color-border-gray-neutral-strong)`
- `thumb.on.default.border`: `var(--border-width-border-1)` solid `var(--color-border-brand-base)`
- `thumb.on.hover.border`: `var(--border-width-border-1)` solid `var(--color-border-brand-strong)`
- `thumb.disabled.background`: `var(--color-background-surface-component)`
- `thumb.disabled.border`: `var(--border-width-border-1)` solid `var(--color-border-gray-disabled)`

- `label.default.text`: `var(--color-text-gray-neutral)` — light `#4d4d4d`, dark `#8898a5`
- `label.disabled.text`: `var(--color-text-gray-disabled)` — light `#757575`, dark `#c5c5c5`

- `focus.ring`: `var(--color-border-brand-base)` on a ring **outside** the track (e.g. pseudo-element `inset: -3px` around the `32x16` body); track border tokens **do not** switch to brand on focus-only (Figma uses a separate focus frame).
- `focus.outlineWidth`: `var(--border-width-border-1)`
- `focus.outlineOffset`: implied by ring geometry (`inset: -3px` → ~`3px` gap outside track edge before ring stroke)
## States (Light Theme)
| State | Track Background | Track Border | Thumb (fill + border) | Label |
|---|---|---|---|---|
| Off / default | `var(--color-background-gray-neutral-dark)` | `var(--color-border-gray-neutral-base)` | fill `var(--color-background-surface-component)`; border `var(--color-border-gray-neutral-base)` | `var(--color-text-gray-neutral)` |
| Off / hover | `var(--color-background-gray-neutral-light)` | `var(--color-border-gray-neutral-strong)` | fill `var(--color-background-surface-component)`; border `var(--color-border-gray-neutral-strong)` | `var(--color-text-gray-neutral)` |
| Off / focus-visible | `var(--color-background-gray-neutral-dark)` | `var(--color-border-gray-neutral-base)` + outer `focus.ring` | fill `var(--color-background-surface-component)`; border `var(--color-border-gray-neutral-base)` | `var(--color-text-gray-neutral)` |
| On / default | `var(--color-background-brand-base)` | `var(--color-border-brand-base)` | fill `var(--color-background-surface-component)`; border `var(--color-border-brand-base)` | `var(--color-text-gray-neutral)` |
| On / hover | `var(--color-background-brand-strong)` | `var(--color-border-brand-strong)` | fill `var(--color-background-surface-component)`; border `var(--color-border-brand-strong)` | `var(--color-text-gray-neutral)` |
| On / focus-visible | `var(--color-background-brand-base)` | `var(--color-border-brand-base)` + outer `focus.ring` | fill `var(--color-background-surface-component)`; border `var(--color-border-gray-neutral-base)` | `var(--color-text-gray-neutral)` |
| Disabled / off | `var(--color-background-gray-light)` | `var(--color-border-gray-disabled)` | fill `var(--color-background-surface-component)`; border `var(--color-border-gray-disabled)` | `var(--color-text-gray-disabled)` |
| Disabled / on | `var(--color-background-gray-light)` | `var(--color-border-gray-disabled)` | fill `var(--color-background-surface-component)`; border `var(--color-border-gray-disabled)` | `var(--color-text-gray-disabled)` |
## States (Dark Theme)

Dark theme uses the same semantic tokens as **States (Light Theme)**. Resolved values for `[data-theme="dark"]` / `.ids-theme-dark` (and program overlays) live in theme CSS:

- `components/ids-theme.css`
- `components/<program>-theme.css` when a program overlays IDS (for example `components/dap-theme.css`)

Duplicate the full state matrix in this section only when a dark row genuinely uses different `var(--...)` references than the corresponding light row.

*(When Light and Dark tables would list identical `var(--...)` cells, keep the matrix under **States (Light Theme)** only and use this pointer section instead of a second table.)*

## Interactions
- Pointer click/tap on the switch or associated label toggles checked state when not disabled.
- Keyboard: `Tab` focuses input, `Space` toggles checked state.
- `focus-visible` ring appears only for keyboard focus strategy, not for pointer focus.
- Hover visuals apply only when `disabled=false`.
- Press state can reuse default state visuals unless product introduces explicit press token overrides.
- Thumb transition must animate position and rail color change with a short duration (suggested `120ms-200ms`, ease-out).
## Composition & API (runtime)
Canonical machine-readable mirror (Storybook + codegen QA): `component-contracts/ids/toggle-switch.contract.ts`.

**Preferred pattern:** projected children inside the root — not an aggregate `options[]` / `items[]` prop.

```
ToggleSwitch [checked?, defaultChecked?, disabled?, label?, id?, name?, value?, className?, aria-label?, aria-describedby?]
  ToggleSwitchInput
  ToggleSwitchTrack
  ToggleSwitchThumb
  ToggleSwitchLabel
  ToggleSwitchAssistiveText
```

Angular reference selectors: `ids-toggle-switch` → `ids-toggle-switch-input` → `ids-toggle-switch-track` → `ids-toggle-switch-thumb` → `ids-toggle-switch-label` → `ids-toggle-switch-assistive-text` (`lib/angular/ids/toggle-switch/`, Storybook `storybook-angular`, port 6007). React reference: `storybook/src/components/ToggleSwitch.tsx` (single-control convenience wrapper).

### Root (`ToggleSwitch` / `root`)
| Prop / Input | Required | Behavior |
|---|---|---|
| `checked` | No (controlled) | Controlled on/off value. |
| `defaultChecked` | No (uncontrolled) | Initial on/off value when `checked` is absent. Default `false`. |
| `disabled` | No | Blocks pointer and keyboard toggles. Default `false`. |
| `label` | No | Optional visible label when the label slot is omitted. |
| `id` | No | Native input id / label association. |
| `name` | No | Native form integration. |
| `value` | No | Native form integration. |
| `className` | No | Optional extra class on the root host. |
| `aria-label` / `ariaLabel` | Required when visible label is absent | Accessible name. |
| `aria-describedby` / `ariaDescribedBy` | No | Optional helper text association (merged with assistive-text slot id when that slot is projected). |

Outputs (root): `onCheckedChange(checked)` (Angular: `(onCheckedChange)`).

### Slots
| Slot | Required | Behavior |
|---|---|---|
| `input` / `ids-toggle-switch-input` | Yes (canonical) | Native `input[type="checkbox"]`, visually hidden, still focusable. Root renders a fallback input when the slot is omitted. |
| `track` / `ids-toggle-switch-track` | Yes (canonical) | Visual rail (`32x16`). Root renders a fallback track when omitted. |
| `thumb` / `ids-toggle-switch-thumb` | Yes (canonical) | Visual knob (`16x16`), translated `16px` when checked. Root renders a fallback thumb when omitted. |
| `label` / `ids-toggle-switch-label` | No | Visible associated text. If omitted, root `label` string is used when provided. |
| `assistiveText` / `ids-toggle-switch-assistive-text` | No | Optional helper/description; associated via `aria-describedby`. |

Behavioral requirements:
- Support both controlled and uncontrolled patterns.
- If `checked` is provided, runtime treats component as controlled and only mutates through `onCheckedChange`.
- If `checked` is absent, internal state is allowed using `defaultChecked`.
- Disabled state blocks pointer and keyboard toggles and emits no change events.
## Codegen Contract (Framework-Agnostic Blueprint)
### Deterministic structure
- `root` (`ids-toggle-switch`)
  - `input` (`ids-toggle-switch-input`)
  - `switch` (implementation wrapper for focus-ring geometry around the `32x16` body)
    - `track` (`ids-toggle-switch-track`)
    - `thumb` (`ids-toggle-switch-thumb`)
  - optional `label` (`ids-toggle-switch-label`)
  - optional `assistiveText` (`ids-toggle-switch-assistive-text`)

Deterministic rendering contract:
1. Render native checkbox input for accessibility and form interoperability.
2. Bind visual `switch/track/thumb` to input state (`checked`, `disabled`, hover, focus-visible).
3. Move thumb by transform/translate, not layout reflow, to avoid jitter.
4. Keep slot order exactly as defined in Anatomy unless framework has strict input-label wrapper requirements.

Variant/option matrix:
- `checked`: `false | true`
- `disabled`: `false | true`
- `hasLabel`: `false | true`
- Valid matrix: all 8 combinations are valid.

Per-slot style contract:
- `root`: inline-flex alignment, pointer cursor when enabled.
- `input`: visually hidden, still focusable; linked to `switch` via sibling/state selectors or state binding.
- `track`: fixed `32x16` body, rounded corners, tokenized background/border by state table.
- `thumb`: fixed `16x16`, `box-sizing: border-box`, tokenized fill + stateful border (`neutral` off-default, `strong` off-hover, `brand-base` on-default, `brand-dark` on-hover, `disabled` when control disabled), translated `16px` on checked.
- `label`: tokenized text color; disabled text token when disabled.

Behavior contract:
- Trigger state change only through input activation pathways (click label, click switch, press Space).
- Emit single change event per successful toggle.
- Do not emit change when disabled.
- Preserve focus on input during toggle.

Accessibility contract:
- Underlying semantic control must be `input[type="checkbox"]` or equivalent ARIA `role="switch"` implementation that preserves checkbox-like behavior.
- If using `role="switch"`, keep `aria-checked` synchronized.
- Ensure label association through `<label for>` + `id` or wrapping label pattern.
- Require accessible name (`label` text or `aria-label`).
- Maintain visible focus indicator meeting contrast requirements.

Asset resolution + bundling contract:
- No icon/image assets required for baseline toggle-switch rendering.
- If product overlays optional icons in thumb/track, those assets must be provided as explicit optional slots and must not replace semantic state cues.

Fallback/error rules:
- Unknown size variant: fallback to default geometry (`32x16`, thumb `16`).
- Missing token at runtime: keep semantic token reference and allow CSS fallback chain in implementation (no hardcoded color literals in generated output).
- Missing `onCheckedChange` in controlled mode: no internal mutation; warn in generator diagnostics.
- Missing accessible name: generator emits a validation error.

Validation checklist (pass/fail):
- [ ] All required sections present and non-placeholder.
- [ ] Checkbox/switch semantics exist and are keyboard-operable.
- [ ] Off/on + hover/focus-visible + disabled states match token tables.
- [ ] Light and dark tables remain structurally parallel.
- [ ] Controlled and uncontrolled usage both supported.
- [ ] Thumb moves via transform, no layout shift.
- [ ] Disabled mode blocks toggles and emits no change event.
- [ ] Generated output avoids hardcoded design values when semantic tokens exist.
## Source Mapping
- Map file: `data/component-figma-map.json`
- Map entry: component `Toggle Switch`, category `Formelements`, node `42848-100536`
- Figma URL: https://www.figma.com/design/VZJ48bbVYrIynw8DdSukWw/-Exploration-only--IDS-with-variables?node-id=42848-100536&m=dev
- Primary extraction node (normalized): `42848:100536`
- Supplemental annotation matrix node (labels only): `30632:149854`
- Evidence used: Figma MCP `get_variable_defs` on `42848:100536` (dark matrix) + `8505:14389` (component set / light), and state-label annotations from `30632:149854`.
- Runtime story / codegen contract: `component-contracts/ids/toggle-switch.contract.ts`
- Angular composition reference: `lib/angular/ids/toggle-switch/` (`IDS_TOGGLE_SWITCH_IMPORTS`)
- Angular Storybook: `storybook-angular/src/components/ids-toggle-switch/`
- React convenience reference: `storybook/src/components/ToggleSwitch.tsx`

---

## Implementation Notes

**Layout & structure**
- **Switch body**: `32px × 16px` (`box-sizing: border-box`); focus ring uses `inset: -3px` around that body (`38px × 22px`).
- **Thumb**: `16px × 16px`, `box-sizing: border-box`; checked position via `transform: translateX(16px)` (not layout reflow).
- **Track / thumb radius**: `999px`.
- **Label gap**: `var(--spacing-space-8)` between switch body and label.
- **Label line-height**: `16px` in component sample rows.
- **Motion**: thumb position and rail color `160ms` `ease-out` (within spec `120ms–200ms` ease-out).
- **Angular host**: `ids-toggle-switch` provides context; `ids-toggle-switch-track` / `ids-toggle-switch-thumb` use `display: contents` so geometry lives on `__track` / `__thumb` inside the `switch` wrapper.
- **Disabled cascade**: root `disabled` blocks input activation and change emission; no per-slot disabled prop.
