# Segmented Button Design Spec

## Metadata
- **Component:** Segmented Button
- **Category:** Formelements
- **Design System:** IDS
- **Figma (validated):** `https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=42113-67348&m=dev`
- **Node ID:** `42113:67348` (frame `Content`, includes Segmented Button state matrixes)
- **Figma file key:** `0bHk3XhrjFhowgFkz9yLr4`
- **Text option component node:** `9015:20992` (`.Segemented Button Text`)
- **Icon option component node:** `10148:29576` (`.SegementedButton-Element-OptionIcon`)
- **Figma references used for validation:**
  - Main/state matrix: `https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=42113-67348&m=dev`
  - Text option component: `https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=9015-20992&m=dev`
  - Icon option component: `https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=10148-29576&m=dev`
- **Variant axes (from Figma component set):**
  - **Type:** `Text` | `Icon`
  - **# Options:** `2`–`5` when `Type=Text`; `2`–`3` when `Type=Icon`
  - **Option 2 State (documentation variants):** `Inactive` | `Hover` | `Press` | `Focus` — Figma uses this axis to demonstrate interaction styling on a *non-selected* segment (selected segment remains `Option 1` in those examples).
  - **Low res:** `No` in source set (treat as standard-density reference).
- **Usage (from Figma description):** Segmented control / view switcher; mutually exclusive selection.
## Anatomy
- **root:** outer grouping container with border, inner padding, horizontal flex layout, and gap between segment cells.
- **segment** (one per option): interactive cell; exactly one segment is **selected** in the default single-select pattern.
- **segmentLabel** (Text type): centered label text (`Body 2`).
- **segmentIcon** (Icon type): centered icon **defined by the consumer** — either a **string slug** resolved against `assets/icons/<slug>.svg` or a **framework icon slot** (custom SVG/component/image). Figma’s list/tree/grid icons are **reference** implementations, not an exhaustive allowed list.
- **segmentBorder (logical):** per-segment uses a **1px solid transparent** border in default, hover, press, and selected (non-focus) states so layout does not shift when focus applies `var(--color-border-brand-base)`. **Do not** use `var(--color-border-transparent-brand)` for this invisible edge in implementations that consume **Synapse/IDS dark** token maps: that token can resolve to a **visible** blue in dark mode; only **`:focus-visible`** (or equivalent) may switch the segment border color to `var(--color-border-brand-base)`.
## Layout & Measurements
- **Root**
  - Background: `var(--color-background-component)`.
  - Outline: `var(--border-width-border-1)` solid `var(--color-border-accessible)`.
  - Corner radius: `var(--corner-radius-radius-2)` (Figma: `2px`).
  - Inner padding: `var(--spacing-space-2)` on all sides (Figma: `2px` inset).
  - Gap between segment cells: `var(--spacing-space-2)` (Figma: `2px` — separates rounded segment rectangles).
  - Layout: horizontal `flex`; **Text** segments use equal flex distribution (`flex: 1 1 0%` / min-width rules as needed for truncation).
- **Text segment (standard density)**
  - Row frame height (Figma sample): `32px` total for the Text examples.
  - Cell padding: vertical `var(--padding-padding-4)`, horizontal `var(--padding-padding-8)` (matches Figma `4px` / `8px`).
  - Typography: `var(--font-size-body-2)` / `var(--font-line-height-line-height-20)`.
  - Label: no wrap in reference layout (`whitespace: nowrap`); overflow behavior is runtime-defined (ellipsis + `title`/`aria-label` recommended for long strings).
- **Icon segment**
  - Row frame height (Figma sample): `37px` for Icon examples (denser padding than Text).
  - Cell padding: vertical `9.5px`, horizontal `8px` (Figma reference vertical `9.5px`, horizontal `8px`).
  - Icon bounding box: **16×16** with **14px** glyph height where applicable (centered).
- **Focus-visible**
  - Non-selected segment in **Focus** uses a **`1px`** focus border: `var(--border-width-border-1)` solid `var(--color-border-brand-base)` on the segment cell (Figma: brand border on the focused segment).
  - Focus outline must not be removed; z-index/stacking should keep the focus border visible against neighbors.
## Tokens
Use semantic tokens only (no literals for color, border width, radius, typography).

- **Layout & shape:** `var(--corner-radius-radius-2)`, `var(--border-width-border-1)`, `var(--spacing-space-2)`, `var(--padding-padding-4)`, `var(--padding-padding-8)`, `var(--padding-padding-10)` (icon vertical QA only).
- **Borders:** `var(--color-border-accessible)` (group outline only), `var(--color-border-brand-base)` (segment **focus-visible** only)`; segment “invisible” edges use the keyword **`transparent`** (see Anatomy — avoid `var(--color-border-transparent-brand)` for segment outlines in dark).
- **Backgrounds:** `var(--color-background-component)`, `var(--color-background-controls-brand-base)`, `var(--color-background-brand-lighter)`, `var(--color-background-brand-light)`.
- **Text:** `var(--color-text-white)`, `var(--color-text-neutral)`, `var(--color-text-brand-strong)`.
- **Icons:** `var(--color-icon-white)`, `var(--color-icon-brand-base)`.
## States (Light Theme)

### Text segments
| Selection | Interaction | Segment background | Segment border | Label text |
|---|---|---|---|---|
| Selected | Default | `var(--color-background-controls-brand-base)` | `var(--border-width-border-1)` solid **transparent** | `var(--color-text-white)` |
| Selected | Focus-visible | `var(--color-background-controls-brand-base)` | `var(--border-width-border-1)` solid `var(--color-border-brand-base)` | `var(--color-text-white)` |
| Unselected | Default | `var(--color-background-component)` | `var(--border-width-border-1)` solid **transparent** (not `var(--color-border-transparent-brand)` in dark — see Anatomy) | `var(--color-text-neutral)` |
| Unselected | Hover | `var(--color-background-brand-lighter)` | `var(--border-width-border-1)` solid **transparent** | `var(--color-text-neutral)` |
| Unselected | Press | `var(--color-background-brand-light)` | `var(--border-width-border-1)` solid **transparent** | `var(--color-text-brand-strong)` |
| Unselected | Focus-visible | `var(--color-background-component)` | `var(--border-width-border-1)` solid `var(--color-border-brand-base)` | `var(--color-text-neutral)` |
| Any | Disabled | `var(--color-background-gray-light)` | `var(--border-width-border-1)` solid `var(--color-border-disabled)` | `var(--color-text-disabled)` |

### Icon segments
| Selection | Interaction | Segment background | Segment border | Icon color |
|---|---|---|---|---|
| Selected | Default | `var(--color-background-controls-brand-base)` | `var(--border-width-border-1)` solid `var(--color-border-transparent-brand)` | `var(--color-icon-white)` |
| Selected | Focus-visible | `var(--color-background-controls-brand-base)` | `var(--border-width-border-1)` solid `var(--color-border-brand-base)` | `var(--color-icon-white)` |
| Unselected | Default | `var(--color-background-component)` | `var(--border-width-border-1)` solid **transparent** | `var(--color-icon-brand-base)` |
| Unselected | Hover | `var(--color-background-brand-lighter)` | `var(--border-width-border-1)` solid **transparent** | `var(--color-icon-brand-base)` |
| Unselected | Press | `var(--color-background-brand-light)` | `var(--border-width-border-1)` solid **transparent** | `var(--color-icon-brand-base)` |
| Unselected | Focus-visible | `var(--color-background-component)` | `var(--border-width-border-1)` solid `var(--color-border-brand-base)` | `var(--color-icon-brand-base)` |
| Any | Disabled | `var(--color-background-gray-light)` | `var(--border-width-border-1)` solid `var(--color-border-disabled)` | `var(--color-text-disabled)` (icon follows disabled foreground) |

**Note:** The illustrated Figma matrix on `8218:13149` documents **Inactive / Hover / Press / Focus** for an **unselected** segment while keeping selection on **Option 1**. The disabled state is not supported.
## States (Dark Theme)
Structurally identical to **Light Theme**. All colors must resolve from the active semantic token theme (dark mode). Do not hardcode hex; validate contrast for selected vs unselected against WCAG requirements for text and icons.

| Selection | Interaction | Segment background | Segment border | Label text / Icon |
|---|---|---|---|---|
| Selected | Default | `var(--color-background-controls-brand-base)` | `var(--border-width-border-1)` solid **transparent** | `var(--color-text-white)` / `var(--color-icon-white)` |
| Selected | Focus-visible | `var(--color-background-controls-brand-base)` | `var(--border-width-border-1)` solid `var(--color-border-brand-base)` | `var(--color-text-white)` / `var(--color-icon-white)` |
| Unselected | Default | `var(--color-background-component)` | `var(--border-width-border-1)` solid **transparent** | `var(--color-text-neutral)` / `var(--color-icon-brand-base)` |
| Unselected | Hover | `var(--color-background-brand-lighter)` (Figma `9015:22164` Option 2 Hover) | `var(--border-width-border-1)` solid **transparent** | `var(--color-text-neutral)` / `var(--color-icon-brand-base)` |
| Unselected | Press | `var(--color-background-brand-light)` | `var(--border-width-border-1)` solid **transparent** | `var(--color-text-brand-strong)` / `var(--color-icon-brand-base)` |
| Unselected | Focus-visible | `var(--color-background-component)` | `var(--border-width-border-1)` solid `var(--color-border-brand-base)` | `var(--color-text-neutral)` / `var(--color-icon-brand-base)` |
| Any | Disabled | `var(--color-background-gray-light)` | `var(--border-width-border-1)` solid `var(--color-border-disabled)` | `var(--color-text-disabled)` |
## Interactions
- **Pointer:** click / tap selects a segment; only one selected value in single-select mode.
- **Hover:** applies to unselected segments (selected segment may omit hover visual unless product adds a validated “selected hover” variant). **Figma (verified):** unselected hover segment background is `var(--color-background-brand-lighter)` (e.g. node `9015:22164` / `42869:141924`). Light and dark both use this **same semantic token**; ensure the dark theme maps it to a value visibly distinct from `var(--color-background-component)` so hover is perceptible.
- **Press (active pointer down):** applies to unselected segments; uses brand-light surface and stronger label color (Text) per Figma.
- **Focus-visible:** keyboard focus shows **1px** `var(--color-border-brand-base)` on the focused segment; mouse-only focus must not steal keyboard focus styles (`:focus-visible` pattern).

- **Selection model:** default is **single-select** (like a coordinated radio group). Multi-select is **out of scope** unless a separate Figma component and matrix are provided.
## Composition & API (runtime)

### Segment definition (framework-agnostic)

Each segment is a **`SegmentedButtonSegment`** object:

| Field | Type | Required when | Description |
|---|---|---|---|
| `value` | string | always | Stable id; must be unique within `items`; equals `value` / `selectedValue` when this segment is selected. |
| `label` | string | `type === "text"` | Visible label (`Body 2`). |
| `icon` | string \| `IconSlot` | `type === "icon"` | **String:** icon **slug** resolved to `assets/icons/<slug>.svg` (see resolution rules). **`IconSlot`:** user-supplied icon UI (SVG element, component, image, etc.) — no path resolution. |
| `ariaLabel` | string | `type === "icon"` | Accessible name for that segment (icon-only control). |


**`IconSlot`:** framework-specific opaque type (e.g. React `ReactNode`, Angular `TemplateRef` / component type, Lit `TemplateResult`). Spec treats it as “render this as the segment icon content inside the 16×16 box.”

### Root props

| Prop / slot | Required | Behavior |
|---|---|---|
| `type` | Yes | `text` \| `icon` — must match Figma Type (counts differ per type). |
| `items` | Yes | `SegmentedButtonSegment[]` in visual order; length must satisfy `# Options` (`2`–`5` text, `2`–`3` icon). |
| `value` / `selectedValue` | controlled | Selected `value`; must match one of `items[].value` or be empty only before first mount (generator choice). |
| `defaultValue` | No | Uncontrolled initial selection. |
| `onChange(nextValue, meta)` | No | Fires after a successful change. **`nextValue`** is always `items[].value`. **`meta`** is `{ type: "text"; label: string }` \| `{ type: "icon"; ariaLabel: string }` so consumers get a stable id plus the visible name for analytics, routing, or persistence. Frameworks may emit a single event object (`detail`) with the same fields. |
 |
| `ariaLabel` / `aria-labelledby` | Recommended | Root accessible name for the radiogroup. |
| `iconsBasePath` | No | Optional override for slug resolution (default: `assets/icons`). Bundler/app must still include that folder when using string slugs. |

### String slug resolution (icon type)

- **Input:** slug string MUST match `^[a-z0-9-]+$` (lowercase kebab, matches filenames in `assets/icons` without `.svg`).
- **Resolved file:** `{iconsBasePath}/{slug}.svg` (default `assets/icons/<slug>.svg`).
- **Rendering:** use whatever the stack supports (`<img src=...>`, SVG sprite, imported module, etc.) as long as the visual box and state-driven colors match the spec.
- **User-defined:** any slug that exists in the bundled `assets/icons` directory is valid; consumers are not limited to Figma’s three demo icons.

### TypeScript reference (optional)

Codegen and React/TS projects may adopt shapes equivalent to:

```typescript
type IconSlot = unknown; // replace with ReactNode, etc.

interface SegmentedButtonSegmentBase {
  value: string;

}

interface SegmentedButtonSegmentText extends SegmentedButtonSegmentBase {
  label: string;
}

interface SegmentedButtonSegmentIcon extends SegmentedButtonSegmentBase {
  /** Slug → assets/icons/<slug>.svg, or custom icon slot */
  icon: string | IconSlot;
  ariaLabel: string;
}

type SegmentedButtonProps =
  | {
      type: "text";
      items: SegmentedButtonSegmentText[];
      value?: string;
      defaultValue?: string;
      onChange?: (
        value: string,
        meta: { type: "text"; label: string } | { type: "icon"; ariaLabel: string }
      ) => void;
    
      ariaLabel?: string;
      aria-labelledby?: string;
    }
  | {
      type: "icon";
      items: SegmentedButtonSegmentIcon[];
      value?: string;
      defaultValue?: string;
      onChange?: (
        value: string,
        meta: { type: "text"; label: string } | { type: "icon"; ariaLabel: string }
      ) => void;
    
      ariaLabel?: string;
      aria-labelledby?: string;
      /** Default `assets/icons` */
      iconsBasePath?: string;
    };
```

Discriminate on `type`: ensures text rows carry `label`, icon rows carry `icon` + `ariaLabel`.
## Codegen Contract (Framework-Agnostic Blueprint)

### Deterministic structure
1. `root` (group container)
2. `segment[]` (in `items` order)
   - `segmentSurface` (hit target + visuals)
   - optional `segmentLabel` **or** `segmentIcon` (mutually exclusive by `type`)

### Variant matrix
- **Type × count:** `(text × 2..5)` ∪ `(icon × 2..3)`.
- **Per-segment interaction:** `default` | `hover` | `press` | `focus-visible`.
- **Selection:** exactly one segment `selected=true` in single-select mode.
- **Icon sources:** string slugs (bundled under `assets/icons`) OR user `IconSlot`; Figma shows `list` / `tree` / `grid` as **examples**, not a closed set.

### Per-slot style contract
- **root:** `var(--color-background-component)` surface, `var(--color-border-accessible)` outer border, `var(--corner-radius-radius-2)`, inner `var(--spacing-space-2)` padding, `var(--spacing-space-2)` inter-segment gap.
- **segmentSurface:** applies row height/padding rules from **Layout & Measurements**; rounded `var(--corner-radius-radius-2)`; state table drives background/border/text/icon tokens; non-focus border is **`transparent`**, focus-visible border is `var(--color-border-brand-base)`.
- **segmentLabel:** `Body 2` tokens only.
- **segmentIcon:** bounded box `16×16`, centered; stroke/fill uses icon color tokens from state table.

### Behavior contract
- Selecting a segment updates `value` and emits **`onChange`** (or framework equivalent) with **`value`** plus **`meta`** (`label` for text segments, `ariaLabel` for icon segments).
- Re-clicking the selected segment is a no-op (no deselect-all) unless product specifies toggle-off (out of default scope).



### Accessibility contract
- Expose **radiogroup semantics** (native `<input type="radio">` set with shared `name`, or `role="radiogroup"` with managed `aria-checked`):
  - Arrow keys move focus between enabled segments; `Space`/`Enter` selects focused segment (pattern may follow platform defaults).
  - Selected segment exposes `aria-checked="true"`; others `false`.
  - Root has visible label via `legend`, `aria-label`, or `aria-labelledby`.
- Focus order: follows visual order.

### Asset resolution + bundling contract
- **Slug mode:** `icon: "<slug>"` → load **`{iconsBasePath}/<slug>.svg`** (default `iconsBasePath = "assets/icons"`).
- **Custom mode:** `icon: IconSlot` → render as provided; caller ensures sizing and accessibility; state colors may require `currentColor` / CSS filters / masks per stack.
- **Reference slugs** (Figma demos, optional): `view-hamburger`, `nav-tree`, `view-sort-grid-solid` — same resolution rule as any other file in `assets/icons`.

Bundle rule: any slug used at runtime MUST exist in the app bundle under `assets/icons` (or overridden `iconsBasePath`). Figma MCP temporary asset URLs are **not** production sources.

### Fallback/error rules
- **Invalid count:** if `type=text` and `n∉[2,5]` or `type=icon` and `n∉[2,3]`, implementations must refuse render or log dev error; never clip silently.
- **Missing token:** substitute is forbidden; surface build-time validation error.
- **Invalid slug string:** if `icon` is a string and fails `^[a-z0-9-]+$`, refuse at dev time or treat as “custom” only when a resolver hook is provided (default: dev error).
- **Missing file for slug:** dev warning + render empty icon region but keep `ariaLabel` on the segment; or fail fast in strict mode — document in generator config.
- **Missing `label` / `icon` / `ariaLabel`:** invalid for the corresponding `type`; generator must warn.
- **Duplicate `value`:** dev warning; first item wins.

### Validation checklist
- [ ] Root spacing, gap, radius, and outer border match Figma `8218:13149` references.
- [ ] Text and Icon segment paddings produce sample heights (`32` / `37`).
- [ ] Unselected hover/press/focus and selected default/focus states match token tables.
- [ ] Single selection updates state once per user action; keyboard and pointer agree.
- [ ] String `icon` slugs resolve via `assets/icons/<slug>.svg`; custom `IconSlot` renders without forced path mapping.
- [ ] Dark theme resolves without literal colors.

## Source Mapping
- **Primary Figma frame:** `Content` — `42113:67348`
- **Component map:** `data/component-figma-map.json` → **Segmented Button** (`figmaUrl`, `fileKey`, `nodeId`, `textOptionNodeId`, `iconOptionNodeId`)
- **Nested referenced in Dev Mode output:** `.Segemented Button Text` (`9015:20992`), `.SegementedButton-Element-OptionIcon` (`10148:29576`), `.SegementedButton-Element-Icons` (`10148:29563`)
- **Extraction method:** Figma MCP `get_design_context` on `42113:67348`, `9015:20992`, `10148:29576` + `get_variable_defs` on `42113:67348` (validated 2026-04-20).



