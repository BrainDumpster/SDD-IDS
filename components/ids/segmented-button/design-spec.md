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
- **Variant axes (text option component set `9015:20992` — `.Segemented Button Text`):**
  - **Type:** `Active` | `Inactive` (selected vs unselected segment)
  - **State:** `Default` | `Hover` | `Press` | `Focus`
  - Eight variants total (`Type` × `State`). Figma node ids: Active Default `9015:20991`, Active Hover `9058:27481`, Active Press `9058:27483`, Active Focus `9047:20375`; Inactive Default `9015:20989`, Inactive Hover `9015:20990`, Inactive Press `9015:20988`, Inactive Focus `9047:20378`.
- **Variant axes (icon option component set `10148:29576` — `.SegementedButton-Element-OptionIcon`):**
  - **Active:** `Yes` | `No`
  - **State:** `Default` | `Hover` | `Press` | `Focus` (same eight-variant interaction matrix as text).
- **Variant axes (assembled segmented control on `42113:67348`):**
  - **Type:** `Text` | `Icon`
  - **# Options:** `2`–`5` when `Type=Text`; `2`–`3` when `Type=Icon`
  - **Option 2 State (documentation variants on matrix frame):** `Inactive` | `Hover` | `Press` | `Focus` — demonstrates interaction styling on a *non-selected* segment while selection remains on Option 1.
  - **Low res:** `No` in source set (treat as standard-density reference).
- **Usage (from Figma description):** Segmented control / view switcher; mutually exclusive selection.
## Anatomy
- **root:** outer grouping container with border, inner padding, horizontal flex layout, and gap between segment cells.
- **segment** (one per option): interactive cell; exactly one segment is **selected** in the default single-select pattern.
- **segmentLabel** (Text type): centered label text (`Body 2`).
- **segmentIcon** (Icon type): centered icon **defined by the consumer** — either a **string slug** resolved against `assets/icons/<slug>.svg` or a **framework icon slot** (custom SVG/component/image). Figma’s list/tree/grid icons are **reference** implementations, not an exhaustive allowed list.
- **segmentBorder (logical):** per-segment uses a **1px solid transparent** border in default, hover, press, and selected (non-focus) states so layout does not shift when focus applies `var(--color-border-brand-base)`. **Do not** use `var(--color-border-transparent-brand)` for this invisible edge in implementations that consume **Synapse/IDS dark** token maps: that token can resolve to a **visible** blue in dark mode; only **`:focus-visible`** (or equivalent) may switch the segment border color to `var(--color-border-brand-base)`.
## Layout & Measurements
- **Root** (`SegmentedButton-Main`, Figma `8218:13149`)
  - Background: `var(--color-background-component)`.
  - Outline: `var(--border-width-border-default)` solid `var(--color-border-accessible)` (`var(--border-width-border-1)` equivalent).
  - Corner radius: `var(--corner-radius-radius-2)` (Figma: `2px`).
  - Inner padding: `var(--padding-padding-2)` on all sides (Figma: `2px` inset — **not** `spacing-space-2`).
  - Gap between segment cells: `var(--spacing-space-2)` (Figma: `2px` — separates rounded segment rectangles).
  - Layout: horizontal `flex`; **Text** segments use equal flex distribution (`flex: 1 1 0%` / min-width rules as needed for truncation).
- **Text variant total height (Figma `8218:13150`, verified 2026-06-05):** **34px** rendered outer control (`Type=Text, # Options=2`).
  - **Root outline:** `var(--border-width-border-default)` = **1px** solid `var(--color-border-accessible)`.
  - **Root inset:** `var(--padding-padding-2)` = **2px** on all sides.
  - **Segment row:** **28px** tall text cells (Figma instances `9015:22086` / `9015:21355`: **127×28**).
  - **Segment padding:** vertical `var(--padding-padding-4)` (**4px**), horizontal `var(--padding-padding-8)` (**8px**).
  - **Typography:** `var(--font-size-body-2)` / `var(--font-line-height-line-height-20)` (**14px** / **20px** line box).
  - **Height budget:** `1px + 2px + 28px + 2px + 1px = 34px` (`border-box` on root). Figma symbol layer reports **32px** autolayout height (`8218:13150`); implementation adds **1px** root border top + bottom for the **34px** dev/spec total.
- **Text segment (implementation)**
  - Row height: **28px** per segment (`4px + 20px + 4px` padding/line box).
  - Padding: `var(--padding-padding-4)` vertical, `var(--padding-padding-8)` horizontal.
  - Label: no wrap in reference layout (`whitespace: nowrap`); overflow behavior is runtime-defined (ellipsis + `title`/`aria-label` recommended for long strings).
- **Icon variant total height (Figma `8218:13156`, verified 2026-06-05):** **37px** outer frame (`Type=Icon, # Options=2`).
  - **Root outline:** `var(--border-width-border-default)` = **1px** solid `var(--color-border-accessible)` (`Border Width/border-default`).
  - **Root inset:** `var(--padding-padding-2)` = **2px** on all sides.
  - **Segment row:** **33px** tall option cells (Figma instance `11925:235931` / component `10148:29585`: **32×33**).
  - **Segment horizontal padding:** `var(--padding-padding-8)` = **8px** (`8 + 16 + 8 = 32px` min cell width).
  - **Segment vertical padding (Figma auto-layout):** **9.5px** top/bottom around the glyph (effective **~8.5px** when reserving **1px** inset edge in CSS `border-box` — reference implementation uses **33px** row height + flex center for the **14px** glyph).
  - **Icon glyph:** **16×14** (`w-[16px] h-[14px]` in Figma dev output).
  - **Height budget:** `1px + 2px + 33px + 2px + 1px = 37px` (`border-box` on root).
- **Icon segment (implementation)**
  - Row height: **33px** per segment cell (not `32×32`).
  - Horizontal padding: `var(--padding-padding-8)`.
  - Vertical: flex-center **14px** glyph inside **33px** row (matches Figma `9.5px` auto-layout intent).
  - Min cell width: **32px** (`var(--sizing-size-32)`) for a single icon column.
- **Focus-visible**
  - **Unselected (Inactive):** `var(--border-width-border-1)` solid `var(--color-border-brand-base)` on the segment cell; background stays `var(--color-background-component)` (Figma `9047:20378`).
  - **Selected (Active):** `var(--border-width-border-1)` **dashed** `var(--color-border-white)` on the segment cell; background stays `var(--color-background-controls-brand-base)` (Figma `9047:20375`). Runtime may implement with `:focus-visible` + dashed border or equivalent focus ring that preserves contrast on the brand fill.
  - Focus outline must not be removed; z-index/stacking should keep the focus border visible against neighbors.
## Tokens
Use semantic tokens only (no literals for color, border width, radius, typography).

- **Layout & shape:** `var(--corner-radius-radius-2)`, `var(--border-width-border-default)` (alias `var(--border-width-border-1)` = **1px**), `var(--padding-padding-2)`, `var(--spacing-space-2)`, `var(--padding-padding-4)`, `var(--padding-padding-8)`, `var(--sizing-size-32)` (icon cell min width); **text** variant outer height **34px** (node `8218:13150`), segment row **28px**; **icon** variant outer height **37px** (node `8218:13156`), segment row **33px**.
- **Backgrounds:** `var(--color-background-component)`, `var(--color-background-controls-brand-base)`, `var(--color-background-controls-brand-strong)`, `var(--color-background-controls-brand-stronger)`, `var(--color-background-brand-lighter)`, `var(--color-background-brand-light)`.
- **Borders:** `var(--color-border-accessible)` (group outline only), `var(--color-border-brand-base)` (unselected focus-visible; selected default same-color edge), `var(--color-border-white)` (selected focus-visible dashed edge); segment default/hover/press (non-focus) edges use the keyword **`transparent`** where Figma omits a visible stroke (see Anatomy — avoid `var(--color-border-transparent-brand)` for segment outlines in dark).
- **Text:** `var(--color-text-white)`, `var(--color-text-neutral)`, `var(--color-text-brand-strong)`.
- **Icons:** `var(--color-icon-white)`, `var(--color-icon-brand-base)`.

### Figma resolved values (light theme, node `9015:20992` / `42113:67642`, verified 2026-06-15)

Semantic tokens above are authoritative for implementation; resolved light values below are QA references from live Figma MCP (`get_variable_defs` / `get_design_context`):

| Token | Figma light resolved |
|---|---|
| `var(--color-background-controls-brand-base)` | `#0672cb` |
| `var(--color-background-controls-brand-strong)` | `#055fa9` |
| `var(--color-background-controls-brand-stronger)` | `#044b86` |
| `var(--color-border-brand-base)` | `#0672cb` |
| `var(--color-background-brand-lighter)` | `#ebf4fb` |
| `var(--color-background-brand-light)` | `#daeaf7` |
| `var(--color-text-brand-strong)` | `#055fa9` |
| `var(--color-text-neutral)` | `#4d4d4d` |
| `var(--color-border-accessible)` | `#757575` |
| `var(--padding-padding-2)` / `var(--spacing-space-2)` | `2px` |
| `var(--border-width-border-default)` | `1px` |
| Text variant outer height (`8218:13150`, border-box) | `34px` |
| Text segment cell (`9015:22086`) | `127×28px` |
| Icon variant outer height (`8218:13156`) | `37px` |
| Icon segment cell (`11925:235931`) | `32×33px` |
| Icon glyph (`.SegementedButton-Element-Icons`) | `16×14px` |
## States (Light Theme)

### Text segments
| Selection | Interaction | Segment background | Segment border | Label text |
|---|---|---|---|---|
| Selected (Active) | Default | `var(--color-background-controls-brand-base)` | `var(--border-width-border-1)` solid `var(--color-border-brand-base)` (same-color edge; Figma `9015:20991`) | `var(--color-text-white)` |
| Selected (Active) | Hover | `var(--color-background-controls-brand-strong)` (Figma `9058:27481`) | `var(--border-width-border-1)` solid **transparent** | `var(--color-text-white)` |
| Selected (Active) | Press | `var(--color-background-controls-brand-stronger)` (Figma `9058:27483`) | `var(--border-width-border-1)` solid **transparent** | `var(--color-text-white)` |
| Selected (Active) | Focus-visible | `var(--color-background-controls-brand-base)` | `var(--border-width-border-1)` **dashed** `var(--color-border-white)` (Figma `9047:20375`) | `var(--color-text-white)` |
| Unselected (Inactive) | Default | `var(--color-background-component)` | `var(--border-width-border-1)` solid **transparent** | `var(--color-text-neutral)` |
| Unselected (Inactive) | Hover | `var(--color-background-brand-lighter)` (Figma `9015:20990`) | `var(--border-width-border-1)` solid **transparent** | `var(--color-text-neutral)` |
| Unselected (Inactive) | Press | `var(--color-background-brand-light)` | `var(--border-width-border-1)` solid **transparent** | `var(--color-text-brand-strong)` |
| Unselected (Inactive) | Focus-visible | `var(--color-background-component)` | `var(--border-width-border-1)` solid `var(--color-border-brand-base)` (Figma `9047:20378`) | `var(--color-text-neutral)` |
| Any | Disabled | `var(--color-background-gray-light)` | `var(--border-width-border-1)` solid `var(--color-border-disabled)` | `var(--color-text-disabled)` |

### Icon segments
| Selection | Interaction | Segment background | Segment border | Icon color |
|---|---|---|---|---|
| Selected (Active) | Default | `var(--color-background-controls-brand-base)` | `var(--border-width-border-1)` solid `var(--color-border-brand-base)` (Figma `10148:29585`) | `var(--color-icon-white)` |
| Selected (Active) | Hover | `var(--color-background-controls-brand-strong)` (Figma `10148:29582`) | `var(--border-width-border-1)` solid **transparent** | `var(--color-icon-white)` |
| Selected (Active) | Press | `var(--color-background-controls-brand-stronger)` (Figma `10148:29579`) | `var(--border-width-border-1)` solid **transparent** | `var(--color-icon-white)` |
| Selected (Active) | Focus-visible | `var(--color-background-controls-brand-base)` | `var(--border-width-border-1)` **dashed** `var(--color-border-white)` (Figma `10148:29577`) | `var(--color-icon-white)` |
| Unselected (Inactive) | Default | `var(--color-background-component)` | `var(--border-width-border-1)` solid **transparent** | `var(--color-icon-brand-base)` |
| Unselected (Inactive) | Hover | `var(--color-background-brand-lighter)` | `var(--border-width-border-1)` solid **transparent** | `var(--color-icon-brand-base)` |
| Unselected (Inactive) | Press | `var(--color-background-brand-light)` | `var(--border-width-border-1)` solid **transparent** | `var(--color-icon-brand-base)` |
| Unselected (Inactive) | Focus-visible | `var(--color-background-component)` | `var(--border-width-border-1)` solid `var(--color-border-brand-base)` (Figma `10148:29588`) | `var(--color-icon-brand-base)` |
| Any | Disabled | `var(--color-background-gray-light)` | `var(--border-width-border-1)` solid `var(--color-border-disabled)` | `var(--color-text-disabled)` (icon follows disabled foreground) |

**Note:** The `.Segemented Button Text` component set (`9015:20992`) and `.SegementedButton-Element-OptionIcon` (`10148:29576`) each document the full **Active/Inactive × Default/Hover/Press/Focus** matrix above. The assembled matrix frame (`42113:67348`) additionally shows Option 2 interaction states while Option 1 stays selected. **Disabled** is not present in these Figma component sets; treat as a documented runtime extension using the disabled row above.
## States (Dark Theme)
Structurally identical to **Light Theme**. All colors must resolve from the active semantic token theme (dark mode). Do not hardcode hex; validate contrast for selected vs unselected against WCAG requirements for text and icons.

| Selection | Interaction | Segment background | Segment border | Label text / Icon |
|---|---|---|---|---|
| Selected (Active) | Default | `var(--color-background-controls-brand-base)` | `var(--border-width-border-1)` solid `var(--color-border-brand-base)` | `var(--color-text-white)` / `var(--color-icon-white)` |
| Selected (Active) | Hover | `var(--color-background-controls-brand-strong)` | `var(--border-width-border-1)` solid **transparent** | `var(--color-text-white)` / `var(--color-icon-white)` |
| Selected (Active) | Press | `var(--color-background-controls-brand-stronger)` | `var(--border-width-border-1)` solid **transparent** | `var(--color-text-white)` / `var(--color-icon-white)` |
| Selected (Active) | Focus-visible | `var(--color-background-controls-brand-base)` | `var(--border-width-border-1)` **dashed** `var(--color-border-white)` | `var(--color-text-white)` / `var(--color-icon-white)` |
| Unselected (Inactive) | Default | `var(--color-background-component)` | `var(--border-width-border-1)` solid **transparent** | `var(--color-text-neutral)` / `var(--color-icon-brand-base)` |
| Unselected (Inactive) | Hover | `var(--color-background-brand-lighter)` | `var(--border-width-border-1)` solid **transparent** | `var(--color-text-neutral)` / `var(--color-icon-brand-base)` |
| Unselected (Inactive) | Press | `var(--color-background-brand-light)` | `var(--border-width-border-1)` solid **transparent** | `var(--color-text-brand-strong)` / `var(--color-icon-brand-base)` |
| Unselected (Inactive) | Focus-visible | `var(--color-background-component)` | `var(--border-width-border-1)` solid `var(--color-border-brand-base)` | `var(--color-text-neutral)` / `var(--color-icon-brand-base)` |
| Any | Disabled | `var(--color-background-gray-light)` | `var(--border-width-border-1)` solid `var(--color-border-disabled)` | `var(--color-text-disabled)` |
## Interactions
- **Pointer:** click / tap selects a segment; only one selected value in single-select mode.
- **Hover:** applies to **both** selected and unselected segments. Unselected hover uses `var(--color-background-brand-lighter)` (Figma `9015:20990`). **Selected hover** uses `var(--color-background-controls-brand-strong)` (Figma `9058:27481` / `10148:29582`).
- **Press (active pointer down):** unselected segments use `var(--color-background-brand-light)` + `var(--color-text-brand-strong)` label (text type). **Selected press** uses `var(--color-background-controls-brand-stronger)` with white label/icon (Figma `9058:27483` / `10148:29579`).
- **Focus-visible:** unselected segments use solid `var(--color-border-brand-base)`; selected segments use **dashed** `var(--color-border-white)` on the brand fill (`:focus-visible` pattern; mouse-only focus must not steal keyboard focus styles).

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
- **Rendering:** resolve slugs through the target library's shared **`Icon`** component (`shapeName={slug}` or equivalent); segment surface `color` (state tokens) tints the glyph via `currentColor`. **Codegen and hand implementations** must not render slug icons with raw `<img>`, ad-hoc CSS `mask`, or per-component asset globs when the library Icon exists — `Icon` owns asset loading and mask/img/inline strategy.
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
- **Per-segment interaction:** `default` | `hover` | `press` | `focus-visible` for **both** selected (Active) and unselected (Inactive) segments.
- **Selection:** exactly one segment `selected=true` in single-select mode.
- **Icon sources:** string slugs (bundled under `assets/icons`) OR user `IconSlot`; Figma shows `list` / `tree` / `grid` as **examples**, not a closed set.

### Per-slot style contract
- **root:** `var(--color-background-component)` surface, `var(--color-border-accessible)` outer border, `var(--corner-radius-radius-2)`, inner `var(--padding-padding-2)` padding, `var(--spacing-space-2)` inter-segment gap.
- **segmentSurface:** applies row height/padding rules from **Layout & Measurements**; rounded `var(--corner-radius-radius-2)`; state table drives background/border/text/icon tokens; non-focus borders **`transparent`** except selected default (`var(--color-border-brand-base)` same-color edge); unselected `:focus-visible` → solid `var(--color-border-brand-base)`; selected `:focus-visible` → **dashed** `var(--color-border-white)`.
- **segmentLabel:** `Body 2` tokens; **28px** row height inside **34px** text-variant root (`8218:13150`).
- **segmentIcon:** **33px** row height, **32px** min width; **16×14** glyph centered; horizontal `var(--padding-padding-8)`; string slugs render via shared **`Icon`** (`shapeName`); state icon colors come from segment `color` (`var(--color-icon-brand-base)` / `var(--color-icon-white)` / disabled foreground). Custom `IconSlot` must use `currentColor` where tinting is required. Segment edges use **inset `box-shadow`** (1px) in reference CSS so the **37px** shell is preserved without border-box growth.

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
- **Slug mode:** `icon: "<slug>"` → render with the target library's shared **`Icon`** primitive (`shapeName="<slug>"` or equivalent name prop per that API); asset file **`{iconsBasePath}/<slug>.svg`** (default `assets/icons`). **Codegen:** see **Icon primitive and asset delivery (codegen)** — generators must not emit raw `<img>`, local CSS `mask`, or per-component asset globs when the library Icon exists.
- **Custom mode:** `icon: IconSlot` → render as provided inside the glyph box; caller ensures sizing and accessibility; use `currentColor` so segment state tokens tint custom SVG strokes/fills.
- **Reference slugs** (Figma demos, optional): `view-hamburger`, `nav-tree`, `view-sort-grid-solid` — same resolution rule as any other file in `assets/icons`.

Bundle rule: any slug used at runtime MUST exist in the app bundle under `assets/icons` (or overridden `iconsBasePath`). Figma MCP temporary asset URLs are **not** production sources.

### Icon primitive and asset delivery (codegen)

Inherits **Icon Resolution Baseline** from `components/ids/root-spec.md`. Applies whenever `type === "icon"` and `items[].icon` is a string slug.

**When the target library exposes an Icon / glyph component**
- **Prefer it** for `segmentIcon` instead of hand-rolling `<img src>`, ad-hoc CSS `mask`/`maskImage`, or `import.meta.glob` asset loading inside the SegmentedButton module.
- Map segment `icon: string` → the library's icon name prop (`shapeName`, `name`, `icon`, `glyph`, …). Generators must **inspect** the real public API; do not assume a fixed prop key across frameworks.
- **Monochrome** segment glyphs (all Figma demo icons): use the library's **tintable** mode when offered (e.g. `variant="mask"`, mask + `currentColor`). Drive color from the **Icon segments** state table by setting **`color` on `segmentSurface`**; **omit** Icon `color` so selection/hover/press/focus/disabled tint via inherited `currentColor`.
- **Dimensions:** glyph **16×14** inside **33px** segment row (min width **32px**) — pass `style` / `className` on Icon. Icon-variant root is **37px** tall (`8218:13156`).
- **Custom `IconSlot`:** render caller content inside the glyph box; tintable custom SVG must use `currentColor`.

**Codegen module resolution (this repository)**
- React IDS: read `config/design_systems/ids.yaml` → `codegen.react.icon_component_module` (`storybook/src/components/Icon`).
- Emit equivalent imports for Angular / Vue / Lit from that programme's design-system config when present; otherwise infer from existing project components.
- Example (React reference): `<Icon shapeName={slug} style={{ width: 16, height: 14 }} />` with default `variant` (`mask`). Segment module owns state CSS only — not asset URLs.

**When no Icon primitive exists**
- Fallback remains slug-driven: inline SVG with `fill="currentColor"`, sprite, or framework asset pipeline — same slug, same **16×14** box, same token → `color` mapping on `segmentSurface`. Do **not** use `<img>` for monochrome icons (`color` CSS does not tint raster/fixed-fill assets).

**Asset contract (reference slugs — demos only)**

| Slug | File |
|------|------|
| `view-hamburger` | `assets/icons/view-hamburger.svg` |
| `nav-tree` | `assets/icons/nav-tree.svg` |
| `view-sort-grid-solid` | `assets/icons/view-sort-grid-solid.svg` |

Any slug matching `^[a-z0-9-]+$` under `assets/icons/` is valid at runtime; the table is illustrative, not a closed set.

**IDS / Storybook reference implementation**
- `Icon`: `storybook/src/components/Icon.tsx` (`shapeName` → `assets/icons/*.svg`, default `variant` `mask`).
- `SegmentedButton`: `storybook/src/components/SegmentedButton.tsx` — `SegmentIcon` composes `Icon`; `SegmentedButton.module.css` sets segment `color` for icon type via `.root[data-type="icon"]` rules.

### Fallback/error rules
- **Invalid count:** if `type=text` and `n∉[2,5]` or `type=icon` and `n∉[2,3]`, implementations must refuse render or log dev error; never clip silently.
- **Missing token:** substitute is forbidden; surface build-time validation error.
- **Invalid slug string:** if `icon` is a string and fails `^[a-z0-9-]+$`, refuse at dev time or treat as “custom” only when a resolver hook is provided (default: dev error).
- **Missing file for slug:** dev warning + render empty icon region but keep `ariaLabel` on the segment; or fail fast in strict mode — document in generator config.
- **Missing `label` / `icon` / `ariaLabel`:** invalid for the corresponding `type`; generator must warn.
- **Duplicate `value`:** dev warning; first item wins.

### Validation checklist
- [ ] Root spacing, gap, radius, and outer border match Figma `8218:13149` references.
- [ ] Text and Icon segment paddings produce sample heights (**34** text / **37** icon outer shell with **28px** / **33px** segment rows).
- [ ] Unselected **and selected** hover/press/focus states match token tables (text `9015:20992`, icon `10148:29576`).
- [ ] Single selection updates state once per user action; keyboard and pointer agree.
- [ ] String `icon` slugs render via the library **`Icon`** primitive (`shapeName` or equivalent); no raw `<img>` / local mask CSS / per-component asset glob in generated SegmentedButton code.
- [ ] Generator resolves Icon import from programme `codegen.*.icon_component_module` when configured (IDS React: `storybook/src/components/Icon`).
- [ ] Icon glyph is **16×14** inside **33px** segment row (**37px** icon-variant root per `8218:13156`); segment `color` drives tint via `currentColor` per icon state table.
- [ ] Custom `IconSlot` renders without forced path mapping.
- [ ] Dark theme resolves without literal colors.

## Source Mapping
- **Content frame:** `42113:67348`
- **Text height reference:** `8218:13150` (`Type=Text, # Options=2`) — **34px** border-box total; component set `8218:13149`
- **Icon height reference:** `8218:13156` (`Type=Icon, # Options=2`) — **37px** border-box total
- **Component map:** `data/component-figma-map.json` → **Segmented Button** (`figmaUrl`, `fileKey`, `nodeId`, `textOptionNodeId`, `iconOptionNodeId`)
- **Nested referenced in Dev Mode output:** `.Segemented Button Text` (`9015:20992`), `.SegementedButton-Element-OptionIcon` (`10148:29576`), `.SegementedButton-Element-Icons` (`10148:29563`)
- **Storybook implementation:** `storybook/src/components/SegmentedButton.tsx`, `storybook/src/components/SegmentedButton.module.css`, `storybook/src/components/SegmentedButton.stories.tsx`
- **Shared Icon primitive (Storybook):** `storybook/src/components/Icon.tsx` (`shapeName` → `assets/icons/*.svg`)
- **Codegen Icon module (IDS React):** `config/design_systems/ids.yaml` → `codegen.react.icon_component_module`
- **Extraction method:** Figma MCP on `42113:67348`, `8218:13149`, `8218:13150`, `8218:13156`, `9015:20992`, `10148:29576` (validated 2026-04-20; **state matrix 2026-06-15**; **heights re-verified 2026-06-05** — text `8218:13150`: **34px** outer / **28px** segment row; icon `8218:13156`: **37px** outer / **33px** segment row; **1px** `border-default`, **2px** root `padding-2`).

## Implementation Notes

- **Root inset:** use `var(--padding-padding-2)` for the group shell (`SegmentedButton-Main`); use `var(--spacing-space-2)` only for the gap between segment cells.
- **Border width:** Figma binds `Border Width/border-default`; runtime may use `var(--border-width-border-default)` or `var(--border-width-border-1)` (both `1px` in `components/ids-theme.css`).
- **Unselected hover/press surfaces** use the **brand** family (`var(--color-background-brand-lighter)` / `var(--color-background-brand-light)`), not `controls-brand-*` — matches Figma text option nodes `9015:20990` / `9015:20988`.
- **Selected interaction surfaces** use the **controls-brand** family (`base` / `strong` / `stronger`) per Figma `9015:20991`, `9058:27481`, `9058:27483`.
- **Theme sync:** ensure `components/ids-theme.css` includes `--padding-padding-2`, `--padding-padding-4`, `--spacing-space-2`, `--sizing-size-32`, and light-theme resolved values in the table above (Storybook imports this file globally).
- **Text variant height:** outer shell **34px** (`8218:13150`) = `1px` root border + `2px` `padding-padding-2` + **28px** segment row + `2px` padding + `1px` border (`border-box`). Segment cells are **28px** tall (`padding-4` + `line-height-20` + `padding-4`).
- **Icon variant height:** outer shell **37px** (`8218:13156`) = `1px` root border + `2px` `padding-padding-2` + **33px** segment row + `2px` padding + `1px` border (`border-box`). Segment cells are **32×33** with `padding-8` horizontal and **16×14** glyph; reference CSS uses **inset `box-shadow`** for segment edges so reserved **1px** edges do not grow past target shell height.
- **Icon slugs (implementation + codegen):** compose `segmentIcon` through the programme **`Icon`** primitive (`shapeName` / equivalent); resolve import from `codegen.*.icon_component_module` when configured. Set segment `color` from the icon state table — do not duplicate mask/`import.meta.glob` or emit `<img>` in SegmentedButton source.



