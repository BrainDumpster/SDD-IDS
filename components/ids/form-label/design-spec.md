# Form Label Design Spec

## Metadata
- Component: Form Label
- Category: Forms / Inputs
- Design system: IDS
- Figma (component set): https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=12065-229953&m=dev
- Figma file key: `0bHk3XhrjFhowgFkz9yLr4` (`IDS-Design-Library`) — the IDS design library (same file as the other IDS component specs).
- Node IDs:
  - Component set (`Form Label`): `12065:229953`
  - Variants: `Size=24px` `28335:71620` / `Size=32px` `28335:38918` / `Size=40px` `12011:227247`
  - Label group frame `28335:71621` → `"Label:"` text + `"*"` text
  - Info icon (`info-circ-solid`)
- Verification method: Figma Dev Mode Inspect — typography CSS, layout CSS, variable/token names, layer sizes.
- Component tags (Figma): form, web form, web, user input, data entry, inputs, grouped inputs, labels, error message, validation error.

## Anatomy
- **labelRoot** (required): horizontal row wrapper (`display:flex; align-items:center`) that vertically centers the label against the control it describes.
- **labelGroup** (required): inline group of the label text + optional required marker (`Frame 3466170`).
- **labelText** (required): the field name (Figma sample copy: `Label:`).
- **requiredMarker** (optional): trailing `*` shown when the field is required.
- **infoIcon** (optional): `info-circ-solid` glyph (16px) shown when help/assistive info is available.

Reading order on canvas: `labelText` → `requiredMarker` → `infoIcon`.

## Layout & Measurements
- **labelRoot**:
  - `display: flex; align-items: center;`
  - horizontal padding: `0`
  - vertical padding drives the `Size` variant (content height is a fixed `20px` Body-2 line, centered):
    - `Size=24px` → padding-block `var(--padding-padding-2)` (`2px`) → total height `24px`
    - `Size=32px` → padding-block `var(--padding-padding-6)` (`6px`) → total height `32px`
    - `Size=40px` → padding-block `var(--padding-padding-10)` (`10px`) → total height `40px`
  - gap between `labelGroup` and `infoIcon`: `var(--spacing-space-8)` (`8px`)
  - width: hug contents (e.g. `71px` for `Label: *` + icon at `Size=40px`)
- **labelGroup** (`Frame 3466170`):
  - `display: flex; align-items: center;`
  - padding: `var(--padding-padding-none)` (`0`)
  - gap between `labelText` and `requiredMarker`: `var(--spacing-space-2)` (`2px`)
  - height: `20px` (single Body-2 line)
- **infoIcon**:
  - box: `16px × 16px` (fixed across all sizes — icon does **not** scale with `Size`)
  - shape: `info-circ-solid`

### Slot geometry (Figma-verified)
| Slot | Property | Value | Figma evidence |
|---|---|---|---|
| `labelRoot` | layout | `flex`, `align-items:center`, gap `8px` | `Size=40px` variant `12011:227247` layout CSS + `Spacing/space-8` gap chip |
| `labelRoot` (`24`) | padding-block | `2px` | `Size=24px` variant `28335:71620`; height 24 = 20 content + 2+2 |
| `labelRoot` (`32`) | padding-block | `6px` | `Size=32px` variant `28335:38918`; height 32 = 20 content + 6+6 |
| `labelRoot` (`40`) | padding-block | `10px` | `Padding/padding-10` top+bottom on `Size=40px` variant `12011:227247`, content `71×20` |
| `labelGroup` | layout | `flex`, `align-items:center`, gap `2px`, padding `0` | label group frame `28335:71621` layout CSS (`--Spacing-space-2`, `--Padding-padding-none`) |
| `labelText` | typography | Roboto 400 `14/20` | `"Label:"` text node Dev Mode CSS |
| `requiredMarker` | typography | Roboto 400 `14/20` | `"*"` text node Dev Mode CSS |
| `infoIcon` | size | `16px × 16px` | `info-circ-solid` icon layout CSS (`width:16px;height:16px;aspect-ratio:1/1`) |

## Tokens
### Colors (semantic)
- Label text: `var(--color-text-gray-neutral-strong)` → `#252525` (light).
- Required marker `*`: `var(--color-text-gray-neutral-strong)` → `#252525` (light). **Same color as the label — not a critical/red token.**
- Info icon disc: `var(--color-icon-alerting-info-base)` → `#005ece` (light).
- Info icon glyph (`i`): `var(--color-icon-gray-white)` → `#ffffff`.

### Typography
- Label + required marker: `Body 2` → `Roboto`, Regular (`400`), `14px` / line-height `20px`, letter-spacing `0`.
  - font-family: `var(--typography-font-style-primary)` (`Roboto`)
  - font-size: `var(--font-size-body-2)` (`14px`)
  - line-height: `var(--font-line-height-line-height-20)` (`20px`)

### Spacing / padding
- `labelText` ↔ `requiredMarker`: `var(--spacing-space-2)` (`2px`)
- `labelGroup` ↔ `infoIcon`: `var(--spacing-space-8)` (`8px`)
- `labelRoot` padding-block: `var(--padding-padding-2 | --padding-padding-6 | --padding-padding-10)` per size
- `labelGroup` padding: `var(--padding-padding-none)` (`0`)

### Per-slot style contract
- **labelText / requiredMarker**: Body 2, `var(--color-text-gray-neutral-strong)`. No weight/size change between required and non-required.
- **infoIcon**: two-tone — disc `var(--color-icon-alerting-info-base)`, glyph `var(--color-icon-gray-white)`. Rendered via the shared `IdsIcon` (`shape="info-circ-solid"`, `size=16`). Two-tone is required so the white `i` stays legible on non-white (e.g. dark) surfaces.

### Token notes
- All tokens above are present in `components/ids-theme.css` (light + dark), so dark theme resolves automatically; this spec does not hardcode hex values.
- Sample Figma copy `Label:` includes a trailing colon; the colon is content, not a component-drawn separator. Runtime label text is consumer-provided.

## States (Light Theme)
| Variant | Element | Background | Text / Fill | Notes |
|---|---|---|---|---|
| default | labelText | transparent | `var(--color-text-gray-neutral-strong)` | Body 2 |
| default | requiredMarker | transparent | `var(--color-text-gray-neutral-strong)` | rendered only when `required` |
| default | infoIcon disc | `var(--color-icon-alerting-info-base)` | — | rendered only when `showInfoIcon` |
| default | infoIcon glyph | — | `var(--color-icon-gray-white)` | white `i` |
| disabled | labelText / marker | transparent | `var(--color-text-gray-disabled)` | inherits the field's disabled state (see notes) |

## States (Dark Theme)
Dark theme uses the same semantic tokens as **States (Light Theme)**; resolved values for `[data-theme="dark"]` live in `components/ids-theme.css`. Label/marker remain `var(--color-text-gray-neutral-strong)`; info icon remains `var(--color-icon-alerting-info-base)` disc + `var(--color-icon-gray-white)` glyph.

*(Light and Dark tables would list identical `var(--...)` cells, so this pointer section replaces a duplicate table.)*

## Interactions
- Form Label is **non-interactive text** by default (no hover/press/focus visual of its own).
- **Label association**: `labelText` MUST associate to its control via `for`/`id` (native `<label>`) or `aria-labelledby`.
- **Required marker** is decorative; required state MUST also be conveyed on the control (`aria-required`/`required`). Hide the `*` from assistive tech (`aria-hidden`) so it is not read as literal "asterisk", or provide an accessible required announcement on the field.
- **Info icon** is supplementary; if it opens a tooltip/popover it MUST be keyboard-focusable and expose an accessible name (e.g. `aria-label="More information"`); if purely decorative it MUST be `aria-hidden`.
- Disabled labels follow the paired field's disabled state (color `var(--color-text-gray-disabled)`); the label itself has no independent disabled interaction.

## Composition & API (runtime)
- Slots / anatomy:
  - `labelRoot` (required)
  - `labelGroup` (required) → `labelText` (required) + `requiredMarker` (optional)
  - `infoIcon` (optional)
- Proposed framework-agnostic props:

| Prop | Type | Default | Notes |
|---|---|---|---|
| `htmlFor` | `string` | — | Associates the `<label>` to a control `id`. Required for accessibility when labelling a native control. |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Maps to Figma `Size` 24 / 32 / 40. Unknown → `"md"` (32). |
| `required` | `boolean` | `false` | Renders trailing `*` (`requiredMarker`). |
| `showInfoIcon` | `boolean` | `false` | Renders the `info-circ-solid` info icon. |
| `infoLabel` | `string` | — | Accessible name for the info icon when it is interactive; when omitted and the icon is decorative it is `aria-hidden`. |
| `children` / `label` | `ReactNode` / `string` | — | The label text content. |

- `size` ↔ Figma mapping: `sm`=24px, `md`=32px, `lg`=40px.

Framework selectors:
- Angular: `ids-form-label` (`lib/angular/ids/form-label`)
- React: `IdsFormLabel` (`lib/react/ids/form-label`)
- Contract: `component-contracts/ids/form-label.contract.ts`

## Codegen Contract (Framework-Agnostic Blueprint)
- Slot schema:
  - Always generate `labelRoot` + `labelGroup` + `labelText`.
  - Generate `requiredMarker` only when `required === true`.
  - Generate `infoIcon` only when `showInfoIcon === true`.
- Variant handling:
  - Map `size` → labelRoot padding-block token:
    - `sm` → `var(--padding-padding-2)`
    - `md` → `var(--padding-padding-6)`
    - `lg` → `var(--padding-padding-10)`
  - Icon size is always `16px` (never scales with `size`).
  - Horizontal padding on `labelRoot` is always `0`.
- Styling rules:
  - Label + marker: Body 2 tokens + `var(--color-text-gray-neutral-strong)`.
  - `labelText` ↔ `requiredMarker` gap: `var(--spacing-space-2)`.
  - `labelGroup` ↔ `infoIcon` gap: `var(--spacing-space-8)`.
  - Info icon: shared `IdsIcon shape="info-circ-solid"`, disc `var(--color-icon-alerting-info-base)`, glyph `var(--color-icon-gray-white)`.
  - Do not hardcode hex values.
- Fallbacks:
  - Unknown `size` → `md`.
  - `required`/`showInfoIcon` non-boolean → `false`.

### Validation checklist
- [ ] Geometry pass: labelRoot heights resolve to exactly `24/32/40` (content `20` + padding-block `2/6/10`).
- [ ] Icon pass: info icon is exactly `16×16` at every size.
- [ ] Gap pass: label↔marker `2px`, group↔icon `8px`.
- [ ] Token pass: label/marker use `--color-text-gray-neutral-strong`; icon uses `--color-icon-alerting-info-base` + `--color-icon-gray-white`; no hex.
- [ ] Typography pass: label + marker use Body 2 (`14/20`, weight `400`, Roboto).
- [ ] Accessibility pass: label associated via `for`/`id` or `aria-labelledby`; `*` not mis-announced; info icon has an accessible name when interactive.

## Source Mapping
- Figma file key: `0bHk3XhrjFhowgFkz9yLr4` (`IDS-Design-Library`)
- Component set: node `12065:229953` (`Form Label`); variants `Size=24px` `28335:71620` / `Size=32px` `28335:38918` / `Size=40px` `12011:227247`; boolean props `Show info icon`, `Required Field`.
- Sub-nodes: label group frame `28335:71621` → `"Label:"` text + `"*"` text; info icon `info-circ-solid`.
- Variables inspected (Dev Mode Inspect / CSS panel):
  - `var(--color-text-gray-neutral-strong)` (label + marker)
  - `var(--color-icon-alerting-info-base)` (info disc)
  - `var(--color-icon-gray-white)` (info glyph)
  - `var(--spacing-space-2)` (`2px`), `var(--spacing-space-8)` (`8px`)
  - `var(--padding-padding-2 | -6 | -10)`, `var(--padding-padding-none)`
  - `var(--font-size-body-2)` (`14`), `var(--font-line-height-line-height-20)` (`20`), `var(--typography-font-style-primary)` (Roboto)
- Verification method: Figma Dev Mode Inspect — typography CSS, layout CSS, variable/token names, layer sizes.
- Last verified: 2026-09-11.
- Icon asset: `assets/icons/info-circ-solid.svg` (+ `info-circ-solid-16.svg`); rendered through shared `IdsIcon` (`lib/react/ids/icon`).

## Implementation Notes
- `Size` is implemented purely as vertical padding around a fixed `20px` Body-2 line so the label vertically centers against 24/32/40px-tall controls placed beside it.
- The required `*` shares the label color (`--color-text-gray-neutral-strong`) — it is a typographic marker, not a critical/error indicator.
- Reference: the Checkbox label (`lib/react/ids/checkbox`) was built from this Form Label; note it uses `--color-text-gray-neutral` for its inline option label, whereas the standalone Form Label uses `--color-text-gray-neutral-strong`. Keep them distinct.
- Info icon should be two-tone (`IdsIcon variant="inline"` or an equivalent two-tone render) so the white `i` remains visible on dark surfaces; a single-color mask tint would rely on the surface color showing through the glyph counter.
