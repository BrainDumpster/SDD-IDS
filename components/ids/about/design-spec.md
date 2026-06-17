# About Design Spec

## Metadata

| Property | Value |
|---|---|
| Component | About |
| Design system | IDS |
| Category | Patterns and Templates |
| Status | **active** |
| Version | 1.0.0 |
| Figma (exploration board) | https://www.figma.com/design/VZJ48bbVYrIynw8DdSukWw/-Exploration-only--IDS-with-variables?node-id=30680-10863&m=dev |
| Figma file key | `VZJ48bbVYrIynw8DdSukWw` |
| Primary component node | `30680:10962` (`About-Main`, `Tabs=False`) |
| Tabbed variant node | `30680:10947` (`About-Main`, `Tabs=True`) |
| IDS Design Library (canonical content) | https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=30680-10912&m=dev — file `0bHk3XhrjFhowgFkz9yLr4`, node `30680:10912` |
| Synapse programme fork | [`components/synapse/about/design-spec.md`](../synapse/about/design-spec.md) |
| Theme CSS | `components/ids-theme.css` |
| Verification method | Figma MCP (`get_design_context`, `get_metadata`) |
| Last verified | 2026-06-17 |

## Anatomy
Deterministic slot order for the default (`Tabs=False`) modal:

1. **Modal shell** — bordered elevated surface (`Modal-Main`)
2. **Header row** — spacer + close control (`16×16`)
3. **Center area** — vertically centered column (`max-width: 1056px`)
4. **Product icon** (optional) — product/application icon (`104×104`)
5. **Product title** — application name (Header 1)
6. **Version line** — build/release string (Body 2)
7. **Serial row** (optional) — label + copy affordance (`14×14` icon)
8. **Brand block** — Dell Technologies horizontal logo (`32px` height) + copyright paragraph
9. **Footer** — single primary **Close** button, right-aligned

Tabbed variant (`Tabs=True`, `30680:10947`) replaces the **60px header row** with **Top-Content** (`30680:10949`) as the dialog **body**:

1. **MODAL-TAB-BAR** (`30680:10950`) — first row inside Top-Content; `padding-top: var(--padding-padding-24)`, horizontal `var(--padding-padding-24)`; hosts IDS **Tab** primary (`30681:19811` Tab-Main, `38px` row) + **close** (`16×16`) top-right in the same row
2. **Frame-Center** (`30680:10957`) — tab item content viewport below the tab bar; `446px` tall; `overflow: hidden` for default About (content fits without scrollbar)
3. **`.About-Element-Content`** (`30680:10958`) — active tab panel; centered product/copyright cluster (same slots as non-tabbed)
4. **Footer** — unchanged

Tab chrome follows IDS **Tab** (`components/ids/tab/design-spec.md`) — **primary** variant, `38px` row, `9px 24px` padding, `2px` top selected indicator (`var(--color-border-brand-strong)`), trailing baseline rail (`Tab group border`). Swap-content panels (`30680:10928` Text Example, `30680:10891` Swap New Content) replace the default centered cluster on non-About tabs.

## Layout & Measurements
### Modal shell (`30680:10962`)
- Modal surface: `1152×596` px (`About-Main`; runtime may scale down with `min(1152px, 100vw − 48px)`)
- Modal border: `var(--border-width-border-1)` solid `var(--color-border-accessible)`
- **Modal corner radius: none** — uses `var(--modal-control-radius)` from `components/ids-theme.css` (resolves to `var(--corner-radius-radius-none)`), matching **IDS Dialog**. Do not hardcode `radius-16` (Synapse About only). Implementation: `.popupAbout` inherits theme token; `.popupAboutSynapse` overrides to `radius-16`.
- Modal elevation: Shadow 4 multi-layer drop shadow on `Modal-Main`
- Header row height: `60px`; horizontal padding `var(--padding-padding-24)`; `justify-content: space-between`
- Header close: `16×16` glyph, **top-right** (empty `78px` spacer on the left pushes close to the right — same pattern as IDS Dialog header)
- **Top-Content** (non-tabbed header + center panel): `506px` (`60px` header + `446px` content panel)
- **Top-Content** (tabbed body, `30680:10949`): `flex: 1` between modal top and footer — **MODAL-TAB-BAR** (`~62px`: `24px` top padding + `38px` tab row) + **Frame-Center** (`446px` tab content viewport)
- Footer: `var(--padding-padding-24)` padding; top border `var(--color-border-accessible)`; height ≈ `90px` (incl. Close button)
- Focus ring offset: `2px` from focused control
- Scroll (non-tabbed): optional vertical scroll when content exceeds `446px` body
- Scroll (tabbed default About tab): **none** — default product/copyright cluster fits inside `446px` Frame-Center; `overflow: hidden` on tab content viewport
- Scroll (tabbed swap-content tabs): enable `overflow-y: auto` only when swap panel content exceeds Frame-Center (e.g. long legal text on `30680:10928`)

### Center content panel (`30680:10912` / embedded in `30680:10962`)
- Panel surface: `1152×446` px (`.About-Element-Content`); `max-width: 1200px`
- **Vertical padding (top and bottom):** `var(--spacing-space-48)` (`48px`) inside the `446px` panel — inset above the Product block and below the Copyright block (before the footer divider)
- **Product block** (icon + name + version + serial): **computed height `218px`**
  - `104` (icon) + `8` (gap) + `58` (Header 1 line) + `4` + `20` (version) + `4` + `20` (serial) = **`218px`**
- **CENTER AREA** column gap between **Product** block and **Copyright** block: `var(--spacing-space-48)` (`48px`)
- **Copyright block** (company logo + multiline text): ≈ `80px` (`32` logo + `8` gap + `40` two-line Body 2 copy)
- **Copyright → footer divider:** `48px` — the bottom panel padding; no additional margin below copyright
- Vertical stack check: `48 + 218 + 48 + 80 + 48 = 442px` (≈ `446px` panel; remainder from line-box rounding)

| Slot | Size | Typography / color | Spacing relative to previous slot |
|---|---|---|---|
| **Product logo** (optional) | `104×104` px | `var(--color-icon-brand-base)` (Figma `appic-dp-cloud-blue`; render via `Icon` mask + semantic token, not gray asset fill) | — (top of Product block) |
| **Product name** | `max-width: 800px`; centered; `word-break: break-word` | Header 1 — `var(--font-size-header-1)` / `var(--font-line-height-line-height-58)`; `var(--color-text-brand-base)` | `var(--spacing-space-8)` below product logo (when icon shown); icon omitted → name is first in Product block |
| **Version** (optional) | auto width; centered | Body 2 — `var(--font-size-body-2)` / `var(--font-line-height-line-height-20)`; `var(--color-text-neutral-strong)` | `var(--spacing-space-4)` below product name |
| **Serial number** (optional) | label + `14×14` copy icon; centered row | Body 2 / `var(--color-text-neutral-strong)`; copy icon `14×14` | `var(--spacing-space-4)` below version (or product name when version omitted); icon ↔ label gap `var(--spacing-space-8)` |
| **Company logo** | `height: 32px`; width ≈ `250px` (intrinsic) | Dell Technologies horizontal mark | `var(--spacing-space-48)` below Product block (name cluster + optional icon) |
| **Copyright** (multiline) | full panel width; centered | Body 2 — `var(--font-size-body-2)` / `var(--font-line-height-line-height-20)`; `var(--color-text-neutral)` | `var(--spacing-space-8)` below company logo; long copy wraps to multiple centered lines (one logical block; collapse extraneous whitespace at runtime) |

### Spacing hierarchy (Design Library `30680:10962` / `30680:10912`)
```
Modal-Main 1152×596 (border-radius: 0)
├── Header 60px
├── About-Element-Content 446px (padding-top/bottom: space-48)
│   └── CENTER AREA
│       ├── [48px top inset]
│       ├── Product block 218px (column, gap: space-8)
│       │   ├── [Product logo] 104×104          (optional)
│       │   └── Product Name + Version (column, gap: space-4)
│       │       ├── Product name                (Header 1, max 800px)
│       │       ├── Version                     (optional, Body 2)
│       │       └── Serial row                  (optional, Body 2 + copy 14×14)
│       ├── [48px gap — Product ↔ Copyright]
│       ├── Copyright block ~80px (column, gap: space-8)
│       │   ├── Company logo                    (32px height)
│       │   └── Copyright text                  (multiline Body 2, text-align center)
│       └── [48px bottom inset → footer divider]
└── Footer (border-top accessible, padding-24, Close button radius-2)
```

### Tabbed dialog body (`30680:10947` / `30680:10949`–`30680:10958`)
Tabs are **part of the dialog body** (`Top-Content`), not a replacement header. About default content is **inside the active tab panel** (Frame-Center → `.About-Element-Content`).

```
Modal-Main 1152×596
├── Top-Content (flex-1; dialog body when Tabs=True)
│   ├── MODAL-TAB-BAR (~62px)
│   │   ├── Tab-Main — IDS Tab primary + trailing baseline rail
│   │   └── Close 16×16 (top-right, same row)
│   └── Frame-Center 1152×446 (tab item content viewport; overflow: hidden for default About)
│       └── .About-Element-Content (max-width: 1200px; flex col center)
│           └── CENTER AREA (gap: space-48)
│               ├── Product block (column, gap: space-8) — same slots as non-tabbed
│               └── Copyright block (column, gap: space-8)
└── Footer
```

- **No separate 60px header** when `Tabs=True` — close moves into MODAL-TAB-BAR inside Top-Content.
- Tab content viewport height: **`446px`** (Figma `30680:10957`).
- **Vertical inset:** `var(--spacing-space-48)` top and bottom inside Frame-Center for default About — content must not stick to the tab baseline.
- **No scrollbar** on the default About tab — product + copyright stack (`~346px` content + `96px` inset ≈ `442px`) fits within `446px`.
- Swap-content tabs (e.g. `30680:10928` Text Example): left-aligned Body 2 copy with `padding: 16px 40px 16px 24px`; may scroll when content exceeds viewport.

## Tokens
### Colors
- Component background: `var(--color-background-component)`
- Accessible border: `var(--color-border-accessible)`
- Brand base: `var(--color-background-controls-brand-base)`
- Transparent brand border: `var(--color-border-transparent-brand)`
- Neutral text: `var(--color-text-neutral)`
- Neutral strong: `var(--color-text-neutral-strong)`
- Brand strong text: `var(--color-text-brand-strong)`
- Link brand text: `var(--color-text-link-brand-base)`
- White text: `var(--color-text-white)`
- Brand icon / title color: `var(--color-icon-brand-base)`
- Neutral icon: `var(--color-icon-neutral)`
- Neutral strong icon: `var(--color-icon-neutral-strong)`
- Brand lighter (link hover): `var(--color-background-controls-brand-lighter)`
- Gray light (scrollbar track): `var(--color-background-gray-light)`
- Gray base (scrollbar thumb): `var(--color-background-gray-base)`
- Overflow gradient start/end: `var(--color-gradient-overflow-vertical-start)` / `var(--color-gradient-overflow-vertical-end)`

### Typography
- Product title: Header 1 — `var(--font-size-header-1)` / `var(--font-line-height-line-height-58)`; color `var(--color-text-brand-base)` (IDS Design Library `30680:10912`)
- Version / serial: Body 2 — `var(--font-size-body-2)` / `var(--font-line-height-line-height-20)`; color `var(--color-text-neutral-strong)`
- Copyright: Body 2 — `var(--font-size-body-2)` / `var(--font-line-height-line-height-20)`; color `var(--color-text-neutral)`; **one logical centered block** — may wrap to multiple lines when copy is long (Figma sample shows two visual lines)
- Tab labels: Body 2; active tab `var(--color-text-brand-strong)` + `2px` top border `var(--color-text-brand-strong)`
- Tabbed section headers: Header 6 — `18px` / `25px`; color `var(--color-text-neutral-strong)`
- Tabbed body copy: Body 2; color `var(--color-text-neutral)`; left-aligned

### Spacing & density
- `var(--spacing-space-4)` — product name ↔ version ↔ serial (name cluster)
- `var(--spacing-space-8)` — product logo ↔ name cluster; company logo ↔ copyright
- `var(--spacing-space-16)` — outer content wrapper rhythm (when present)
- `var(--spacing-space-48)` — **Product block ↔ Copyright block** (IDS Design Library canonical)
- `var(--padding-padding-24)`

### Effects
- Level 4 shadow on modal shell (four drop-shadow layers, `#252525` at 8% opacity)

## States (Light Theme)
| Element | Background | Border | Text | Icon |
|---|---|---|---|---|
| Modal shell | `var(--color-background-component)` | `var(--color-border-accessible)` | — | — |
| Product icon | transparent | transparent | — | `var(--color-icon-brand-base)` |
| Product title | transparent | transparent | Header 1 / `var(--color-text-brand-base)` | — |
| Version / serial | transparent | transparent | Body 2 / `var(--color-text-neutral-strong)` | `var(--color-icon-neutral-strong)` (copy) |
| Copyright | transparent | transparent | Body 2 / `var(--color-text-neutral)` | — |
| Close (header) | transparent | transparent | — | `var(--color-icon-neutral)` |
| Close (header hover) | transparent | transparent | — | `var(--color-icon-neutral-strong)` |
| Footer Close button | `var(--color-background-controls-brand-base)` | `var(--color-border-transparent-brand)` | `var(--color-text-white)` | — |
| Active tab | transparent | top `2px` `var(--color-text-brand-strong)` | `var(--color-text-brand-strong)` | — |
| Inactive tab | transparent | bottom `1px` `var(--color-border-accessible)` | `var(--color-text-neutral)` | — |
| Link (default) | transparent | transparent | `var(--color-text-link-brand-base)` | `var(--color-icon-brand-base)` |
| Link (hover) | `var(--color-background-controls-brand-lighter)` | transparent | `var(--color-text-brand-strong)` | `var(--color-icon-brand-base)` |

## States (Dark Theme)
Dark theme uses the same semantic tokens as **States (Light Theme)**. Resolved values for `[data-theme="dark"]` / `.ids-theme-dark` (and program overlays) live in theme CSS:

- `components/ids-theme.css`
- `components/<program>-theme.css` when a program overlays IDS (for example `components/dap-theme.css`)

Duplicate the full state matrix in this section only when a dark row genuinely uses different `var(--...)` references than the corresponding light row.

*(When Light and Dark tables would list identical `var(--...)` cells, keep the matrix under **States (Light Theme)** only and use this pointer section instead of a second table.)*

## Interactions
- Click MODAL-TAB-BAR close (tabbed) or header close (non-tabbed) or footer **Close** to dismiss the modal
- Optional serial copy button writes serial to clipboard and fires `onSerialCopy`
- Tabbed variant: select tabs to swap Frame-Center content; active tab shows top brand indicator
- Default About tab: **no vertical scrollbar** — content fits in `446px` Frame-Center
- Swap-content tabs: scroll vertically only when panel content exceeds Frame-Center
- Keyboard: Tab through focusable controls, Enter activates, Escape closes
- Pointer dismissal disabled while modal is open (matches Figma About pattern)

### Accessibility
- Root: `role="dialog"` with labelled title (`dialogTitle` / product name)
- Close controls: `aria-label="Close"` on header / MODAL-TAB-BAR icon button
- Serial copy: `aria-label` includes serial value
- Focus ring: `2px` `var(--color-border-brand-base)` outline with `2px` offset
- Logical tab order: MODAL-TAB-BAR close (tabbed) or header close → tab list → body links/controls → footer Close
- Screen reader announces product name, version, and copyright as one flow

### Behavior & guidelines
- Use for application version, branding, and legal copy
- Copyright / legal copy is **one logical centered block**; long copy may wrap to multiple visual lines (do not split into multiple block paragraphs at runtime)
- Product icon is optional (`showProductIcon`); when omitted, title remains centered
- Tabbed + swap-content variants are for extended legal text, release notes, or custom panels
- Prefer semantic tokens over hard-coded palette values

## Composition & API (runtime)
### Runtime API

| Prop / slot | Type | Default | Contract |
|---|---|---|---|
| `programme` | `"ids" \| "synapse"` | `"synapse"` | `"ids"` selects IDS tokens; Synapse overrides in `components/synapse/about/design-spec.md` |
| `productTitle` | `string` | required | Header 1 centered title |
| `versionLabel` | `string` | — | Optional Body 2 version line (`space-4` below title) |
| `showTabs` | `boolean` | `false` | Renders Top-Content body with MODAL-TAB-BAR + tab panels (`30680:10947`); IDS Tab **primary** per `components/ids/tab/design-spec.md` |
| `additionalTabs` | `{ id, label, panel? }[]` | `[]` | Tabs after **About** (Figma sample: Tab Option 1–3) |
| `showProductIcon` | `boolean` | `false` | When true, render product icon above title |
| `productIconSlug` | `string` | — | `assets/icons/<slug>.svg`; IDS tints with `var(--color-icon-brand-base)` |
| `productIconSrc` | `string` | — | Full-color icon URL when slug not used |
| `showSerialNumber` | `boolean` | `false` | Show serial row |
| `serialNumber` | `string` | — | Serial label value |
| `onSerialCopy` | `() => void` | — | Fired after clipboard copy |
| `logoSrc` | `string` | — | Dell Technologies horizontal logo (`32px` height) |
| `copyrightText` / `legalText` | `string` | — | Single string → one centered paragraph |
| `copyrightContent` / `legalContent` | `ReactNode` | — | Custom node; still one centered block |
| `closeLabel` | `string` | `"Close"` | Footer primary button label |
| `trigger` | `ReactNode` | — | Uncontrolled open trigger |
| `open` / `onOpenChange` | `boolean` / fn | — | Controlled visibility |
| `defaultOpen` | `boolean` | `false` | Uncontrolled initial open state |

### Events

| Event | When | Payload |
|---|---|---|
| `onOpenChange` | Modal open state changes | `boolean` |
| `onSerialCopy` | Serial copy affordance activated (after clipboard write attempted) | — |
| `onClose` | Header / MODAL-TAB-BAR close activated (Dialog shell) | — |

### Variants
| Variant | Figma node | Description |
|---|---|---|
| Default content | `30680:10912` | IDS Design Library center panel — icon, name, version, serial, logo, multiline copyright |
| Default modal | `30680:10962` | Full About-Main shell wrapping default content |
| With serial | `30680:10879` | Default + serial row + copy |
| Tabbed modal | `30680:10947` | Top-Content body: MODAL-TAB-BAR + Frame-Center tab panels (no 60px header) |
| Text content | `30680:10928` | Left-aligned Header 6 sections + Body 2 copy (scrollable) |
| Swap content | `30680:10891` | Custom center panel via slot |

## Codegen Contract (Framework-Agnostic Blueprint)
### Deterministic structure
**Non-tabbed:** `ModalShell` → `HeaderRow` → `CenterArea` → [`ProductIcon`] → `ProductTitle` → `VersionLine` → [`SerialRow`] → `BrandBlock`(`Logo`, `CopyrightText`) → `Footer`(`CloseButton`).

**Tabbed:** `ModalShell` → `TopContent`(`ModalTabBar`[`TabBar`, `Close`], `FrameCenter` → `.AboutElementContent` → `CenterArea` → product + copyright slots) → `Footer`(`CloseButton`). No separate `HeaderRow`.

`FrameCenter` hosts the active tab panel; default About tab uses the same center slots as non-tabbed.

### Variant matrix

| Axis | Values | Default | Notes |
|---|---|---|---|
| `showTabs` | `false`, `true` | `false` | `true` → Top-Content body (`30680:10947`); no 60px header |
| `showProductIcon` | `false`, `true` | `false` | Icon slot `104×104` above title |
| `showSerialNumber` | `false`, `true` | `false` | Requires `serialNumber` when `true` |
| Tab panel content | `aboutDefault`, `swapText`, `swapCustom` | `aboutDefault` | Non-About tabs use `additionalTabs[].panel` or swap variants |
| `programme` | `ids`, `synapse` | `synapse` (runtime default) | IDS stories use `ids`; Synapse deltas in programme spec |

Invalid combinations (e.g. `showTabs=true` with missing tab list) → render **About** tab only. Unknown swap variant → **aboutDefault** content (`30680:10912`).

### Per-slot style contract

Resolve all visuals from **Tokens** and **States (Light Theme)** using `var(--...)` only.

| Slot | Layout / size | Tokens |
|---|---|---|
| `ModalShell` | `1152×596`; `min(1152px, 100vw − 48px)` | `border-radius: var(--modal-control-radius)`; `border: var(--border-width-border-1) solid var(--color-border-accessible)`; Shadow 4 |
| `HeaderRow` | `60px`; `padding: 0 var(--padding-padding-24)` | Close `16×16`; spacer `78px` |
| `TopContent` (tabbed) | `flex: 1`; column | Contains `ModalTabBar` + `FrameCenter` |
| `ModalTabBar` | `padding-top: var(--padding-padding-24)`; horizontal `var(--padding-padding-24)` | IDS Tab **primary** per `components/ids/tab/design-spec.md` |
| `FrameCenter` | `446px`; `overflow: hidden` (default About) | Vertical inset `var(--spacing-space-48)` top/bottom for default panel |
| `ProductIcon` | `104×104`; optional | `var(--color-icon-brand-base)` via mask (`shield-cloud` stand-in) |
| `ProductTitle` | `max-width: 800px`; centered | Header 1; `var(--color-text-brand-base)` |
| `VersionLine` | centered | Body 2; `var(--color-text-neutral-strong)`; `margin-top: var(--spacing-space-4)` |
| `SerialRow` | centered row; optional | Body 2 + `copy` `14×14`; gap `var(--spacing-space-8)` |
| `BrandBlock` | column; gap `var(--spacing-space-48)` from Product block | Logo `32px` + copyright |
| `Logo` | `height: 32px` | intrinsic width; gap `var(--spacing-space-8)` to copyright |
| `CopyrightText` | full width; centered | Body 2; `var(--color-text-neutral)`; one logical block |
| `Footer` | `padding: var(--padding-padding-24)` | `border-top: var(--color-border-accessible)` |
| `CloseButton` | right-aligned | IDS primary Button; `var(--corner-radius-radius-2)` |

### Behavior contract

- **Open:** `trigger` click or controlled `open=true`; focus moves into dialog.
- **Dismiss:** header close, MODAL-TAB-BAR close (tabbed), footer **Close**, or `Escape` → `onOpenChange(false)`; pointer dismissal **disabled**.
- **Serial copy:** `navigator.clipboard.writeText(serialNumber)` when available; then `onSerialCopy`.
- **Tabs:** `showTabs=true` → first tab **About** always present; `additionalTabs` append after; selecting tab swaps `FrameCenter` panel only; default About tab **no scrollbar**.
- **Swap-content tabs:** `overflow-y: auto` on `FrameCenter` when content exceeds `446px`.
- **Copyright:** collapse extraneous whitespace; single centered block (no multi-paragraph injection from string splits).

### Accessibility contract

- Root: `role="dialog"`; `aria-modal="true"`; labelled by product title (`dialogTitle` / `h2`).
- Header / MODAL-TAB-BAR close: `aria-label="Close"`.
- Tab list: `role="tablist"`; tabs `role="tab"` with `aria-selected`; panels `role="tabpanel"` + `aria-labelledby`.
- Serial copy: `aria-label` includes serial value (e.g. `Copy serial number 1A2B3C4D5E6F7G`).
- Focus ring: `2px` `var(--color-border-brand-base)` outline, `2px` offset on interactive controls.
- Tab order: close → tab list → serial copy → footer Close.
- Live regions: none required; product name, version, copyright announced in document order.

### Asset resolution + bundling contract
| Slug | File | Usage |
|---|---|---|
| `shield-cloud` | `assets/icons/shield-cloud.svg` | Sample product icon (Figma `appic-dp-cloud-blue` family) |
| `logo-delltech-horiz` | `assets/icons/logo-delltech-horiz.svg` | Brand footer logo |
| `copy` | `assets/icons/copy.svg` | Serial copy affordance |
| `shape-x` | `assets/icons/shape-x.svg` | Header close glyph |

### Fallback/error rules

- Unknown variant / invalid tab id → **aboutDefault** content (`30680:10912`)
- Missing `productTitle` → validation error at codegen boundary
- `showProductIcon=true` without `productIconSlug` or `productIconSrc` → omit icon slot (no placeholder)
- Missing `versionLabel` → omit version slot (no placeholder)
- `showSerialNumber=true` without `serialNumber` → omit serial row
- Missing `copyrightText` / `copyrightContent` when logo present → render logo only
- Missing logo and copyright → omit brand block
- `additionalTabs[].panel` absent → render empty swap placeholder with tab label (Storybook demo only; production should supply panel)
- Missing icon asset slug → omit icon; log bundler warning
- Missing theme CSS → tokens fall back to values in `components/ids-theme.css`

### Validation checklist
- [x] Modal shell has **no corner radius** (`var(--modal-control-radius)`); Close button only uses `radius-2`
- [x] Content panel `446px` with `48px` top/bottom padding inside panel
- [x] Product block height `218px` when all product slots shown
- [x] Product ↔ Copyright gap is `var(--spacing-space-48)` per IDS Design Library `30680:10912`
- [x] Product icon (when shown) precedes title with `var(--spacing-space-8)` gap
- [x] Name cluster uses `var(--spacing-space-4)` between title, version, serial
- [x] Title uses Header 1 `var(--color-text-brand-base)`; version uses Body 2 neutral-strong
- [x] Copyright is one centered block; multiline wrap when copy is long
- [x] Company logo `32px` height with `var(--spacing-space-8)` above copyright
- [x] Footer Close right-aligned with accessible top border
- [x] Serial copy `14×14` with clipboard + `onSerialCopy`
- [x] Keyboard Escape closes; focus ring on interactive controls
- [x] Tabbed (`30680:10947`): tabs live inside Top-Content body; no 60px header row
- [x] Tabbed default About: Frame-Center `446px`, `overflow: hidden`, no scrollbar
- [x] Tabbed: close in MODAL-TAB-BAR row (top-right), not a separate header
- [x] Dark theme resolves via semantic tokens without hard-coded colors

## Source Mapping
| Source | Location |
|---|---|
| IDS Design Library (canonical content spacing/sizing) | file `0bHk3XhrjFhowgFkz9yLr4`, node `30680:10912` |
| Figma board (exploration) | file `VZJ48bbVYrIynw8DdSukWw`, node `30680:10863` |
| Primary component | `30680:10962` (`About-Main`, `Tabs=False`) |
| IDS Tab spec (modal tab bar) | `components/ids/tab/design-spec.md` (node `30681:9530`) |
| Top-Content (tabbed body) | `30680:10949` |
| MODAL-TAB-BAR | `30680:10950` |
| Frame-Center (tab panel viewport) | `30680:10957` |
| Tabbed About content | `30680:10958` |
| Tabbed About component | `30680:10947` |
| Product icon reference | `44484:722` (Design Library) |
| Component map | `data/component-figma-map.json` → About (`30680-10863`) |
| Registry | `data/programme-inheritance-registry.json` → `synapse` / `about` (programme fork) |
| Theme CSS | `components/ids-theme.css` |
| Storybook contract | `storybook/src/spec-contracts/ids-about.contract.ts` |
| Storybook stories | `storybook/src/components/IdsAbout.stories.tsx` |
| Synapse programme fork | `components/synapse/about/design-spec.md` |
| Shared implementation | `storybook/src/components/About.tsx`, `Dialog.tsx` |
| Verification method | Figma MCP (`get_design_context`, `get_metadata`) |
| Last verified | 2026-06-17 |
