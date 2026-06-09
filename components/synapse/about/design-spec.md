# About Design Spec

## IDS baseline (layout, flow, contracts)

Synapse **About** shares the IDS **About** pattern intent (application information dialog: product identity, version, legal/copyright, dismiss). Synapse implements a **wide centered modal** composed from the Synapse **Modal** shell (`Modal-Main`) with a simplified center column — no IDS 64×64 app logo header, no gray legal band, no resource links in the default frame.

- **IDS source of truth:** [`components/ids/about/design-spec.md`](../ids/about/design-spec.md)
- **Modal shell:** inherits [`components/synapse/modal/design-spec.md`](../modal/design-spec.md) overlay, elevation, radius, and footer primary button chrome
- **Shared implementation:** `storybook/src/components/About.tsx` → `Dialog` with `variant="about"` (`storybook/src/components/Dialog.tsx`, `Dialog.module.css`)
- **Base UI mapping:** `@base-ui-components/react/dialog` (via shared `Dialog`)

**Scope of live Synapse verification (this spec):** main symbol **`About-Synapse`** `49962:52708`; in-context usage `49962:53921` (Patterns board `49962:53917`).

## Metadata

| Property | Value |
|---|---|
| Component | About |
| Design system | Synapse |
| Category | Patterns |
| Spec pattern | **ids-fork** (registry: `data/programme-inheritance-registry.json` → `programme: synapse`, `slug: about`) |
| IDS baseline slug | `about` |
| Status | **draft** |
| Version | 1.0.0 |
| Description | Centered About modal — product title, version, optional serial number, Dell Technologies logo, copyright, Close action |
| Figma file | [Synapse Hi-Fi components](https://www.figma.com/design/Td1bnsvRj1PCGs9RVJkIvJ/Synapse-Hi-Fi-components) |
| File key | `Td1bnsvRj1PCGs9RVJkIvJ` |
| Main component | [`49962:52708`](https://www.figma.com/design/Td1bnsvRj1PCGs9RVJkIvJ/Synapse-Hi-Fi-components?node-id=49962-52708&m=dev) (`About-Synapse`) |
| Patterns usage frame | [`49962:53917`](https://www.figma.com/design/Td1bnsvRj1PCGs9RVJkIvJ/Synapse-Hi-Fi-components?node-id=49962-53917&m=dev) → instance `49962:53921` |
| Verification method | Figma MCP (`get_metadata`, `get_design_context`, `get_variable_defs`) |
| Last verified | 2026-06-08 |
| Theme CSS | `components/synapse-theme.css` (not `ids-theme.css`) |
| Reference implementation | `storybook/src/components/About.tsx`, `About.module.css`; shell in `Dialog.module.css` (`.popupAbout`, `.modalMainAbout`, …) |

### Synapse programme deltas (vs IDS)

| Topic | IDS | Synapse (verified) |
|---|---|---|
| Container width | **500px** minimum | **`1152×596`** sample (`49962:52708`); runtime `width: min(1152px, 100vw − 48px)`, `height: 596px`, `max-height: 90vh` |
| Corner radius | **8px** | **`var(--corner-radius-radius-16)`** (16px) |
| Surface border | `var(--color-border-light)` | **`var(--color-border-neutral-light)`** |
| Layout model | Logo + sections + optional links | **Center column** — product name, version, brand logo, copyright; optional serial row |
| Product logo | **64×64** app logo in header | **No** top app logo; **Dell Technologies horizontal** logo **`32px`** tall in copyright cluster (`Logo-DellTech-Horiz` `49962:52731`) |
| Product title | Header 1 in header section | **Header 1** centered in body — color **`var(--color-icon-brand-base)`** (Figma binds title to brand icon token) |
| Version line | In content section | **Body 2** `var(--color-text-neutral-strong)` below title; gap **`var(--spacing-space-4)`** |
| Serial number | Not in IDS default | **Optional** `showSerialNumber` — Body 2 + **`copy`** icon **`14×14`** (`49962:52727` … `49962:52729`) |
| Legal / copyright | **Gray-100 band** (`Body 3`) + links | **Inline** in center column — **one** centered **Body 2** paragraph `var(--color-text-neutral)` (wraps naturally); **no** gray footer band; **no** multiple `<p>` blocks |
| Resource links | Supported | **Not** in default Synapse frame |
| System information block | Supported | **Not** in default Synapse frame |
| Header chrome | Title + branding | **Empty left spacer** + **`16×16`** close (`Black/16` / `shape-x`) only |
| Header padding | 24px | **`padding-block: var(--padding-padding-24) var(--padding-padding-16)`**; **`padding-inline: var(--padding-padding-24)`** |
| Center padding | 24px content | **`padding-inline: var(--padding-padding-24)`**; bottom **`var(--padding-padding-24)`** on scroll body |
| Product ↔ copyright gap | 16px section spacing | **`var(--spacing-space-56)`** (Figma `Loose Density` / `var(--loose-density, 56px)`) |
| Copyright cluster gap | — | Logo ↔ text **`var(--spacing-space-8)`** |
| Footer | 16px 24px padding | **`var(--padding-padding-24)`** all sides; **top border** `var(--border-width-border-1)` `var(--color-border-neutral-light)` |
| Footer actions | Close + optional links | **Single primary Close** only (`49962:53027`); Synapse button **`padding-10`/`padding-16`**, **`radius-4`** |
| Elevation | Level 4 shadow | **Modal-Main** drop-shadow stack 2/4/8/16 (same pattern as Synapse modal) |
| Backdrop dismiss | IDS default | **`disablePointerDismissal`** — click-outside does **not** close (About pattern) |
| Variant axes | Default, Modal, Inline, Minimal, … | **`showSerialNumber`**: `false` \| `true` (default frame verified without serial) |

### Validated Figma nodes

| Scenario | Node | Notes |
|---|---|---|
| Main symbol | `49962:52708` | `1152×596`; `About-Synapse` |
| Modal shell (`Modal-Main`) | `49962:52709` | Elevated white column |
| Header | `49962:52711` | Spacer + close |
| Close control | `49962:52715` | `16×16` |
| Center frame | `49962:52720` | Vertically centers content |
| Center area | `49962:52721` | `1056px` max content width |
| Product block | `49962:52722` | Title + version |
| Product title | `49962:52725` | Header 1, max **800px** text width |
| Version | `49962:52726` | `Version X.X.X` sample |
| Serial row (optional) | `49962:52727` | `Serial Number: …` + copy |
| Copyright cluster | `49962:52730` | Logo + legal copy |
| Dell Tech logo | `49962:52731` | ~`250×32` |
| Copyright text | `49962:52732` | One centered Body 2 paragraph (visual line wrap only) |
| Footer | `49962:52733` | Close button row |
| Close button | `49962:53027` | Primary Synapse button |
| In-context instance | `49962:53921` | On Patterns board overlay |
| Patterns board | `49962:53917` | Full-page usage with overlay |

## Anatomy

Deterministic slot order (Synapse About modal):

1. `AboutOverlay` — viewport backdrop (`var(--color-background-overlay-1)`); optional `backdrop-filter: blur(1px)`
2. `AboutSurface` — bordered, rounded shell (`1152×596` sample)
3. `AboutModalMain` — elevated `Modal-Main` column
4. `AboutHeader` — `HeaderSpacer` + `CloseControl` (`16×16`)
5. `AboutBody` — scrollable center column (`max-width: 1056px`)
   - `ProductTitle` — Header 1, brand-colored
   - `VersionLine` — Body 2
   - `SerialNumberRow?` — label + copy affordance (`showSerialNumber`)
   - `BrandBlock` — `var(--spacing-space-56)` below product cluster
     - `BrandLogo?` — Dell Technologies horizontal (`32px` height)
     - `CopyrightText` — **one** centered Body 2 paragraph (`<p>`)
6. `AboutFooter` — top border + `CloseButton` (primary)

## Layout & Measurements

### `About-Synapse` surface (`49962:52708`)

| Property | Value |
|---|---|
| Sample size | **`1152×596`** |
| Runtime width | `min(1152px, calc(100vw − 2 × var(--padding-padding-24)))` |
| Runtime height | **`596px`**; `max-height: 90vh` |
| Border | `var(--border-width-border-1)` solid `var(--color-border-neutral-light)` |
| Radius | `var(--corner-radius-radius-16)` |
| `Modal-Main` top content | **`508px`** tall in Figma sample (flex column; body scrolls when content overflows) |

### Header (`49962:52711`)

| Property | Value |
|---|---|
| Padding | `var(--padding-padding-24)` top / `var(--padding-padding-16)` bottom / `var(--padding-padding-24)` inline |
| Close control | **`16×16`** |
| Left spacer | ~**`78px`** sample (implementation: flexible spacer for close alignment) |

### Center body (`49962:52720` / `49962:52721`)

| Property | Value |
|---|---|
| Content max width | **`1056px`** |
| Product title max width | **`800px`** |
| Title ↔ version gap | `var(--spacing-space-4)` |
| Product cluster ↔ copyright gap | `var(--spacing-space-56)` |
| Copyright logo height | **`32px`** |
| Logo ↔ copyright text gap | `var(--spacing-space-8)` |
| Body padding | `0 var(--padding-padding-24) var(--padding-padding-24)` |

### Serial number row (`49962:52727`, optional)

| Property | Value |
|---|---|
| Layout | horizontal, centered |
| Gap | `var(--spacing-space-8)` |
| Copy icon | **`14×14`** (`copy`) |

### Footer (`49962:52733`)

| Property | Value |
|---|---|
| Padding | `var(--padding-padding-24)` |
| Border top | `var(--border-width-border-1)` solid `var(--color-border-neutral-light)` |
| Actions | `justify-end`; gap `var(--spacing-space-16)` |
| Close button | Synapse primary — `var(--padding-padding-10)` block / `var(--padding-padding-16)` inline; `var(--corner-radius-radius-4)` |

## Tokens

### Surfaces and borders
- `var(--color-background-component)` — modal fill
- `var(--color-background-overlay-1)` — backdrop
- `var(--color-border-neutral-light)` — surface + footer divider
- `var(--corner-radius-radius-16)` — surface radius
- Shadow stack: `var(--shadow-drop-shadow-2-*)` … `var(--shadow-drop-shadow-16-*)`

### Typography
- Product title: `var(--font-size-header-1)` / `var(--font-line-height-line-height-58)` — color **`var(--color-icon-brand-base)`**
- Version / serial / copyright: `var(--font-size-body-2)` / `var(--font-line-height-line-height-20)`
- Version + serial text: `var(--color-text-neutral-strong)`
- Copyright: `var(--color-text-neutral)`

### Spacing
- `var(--spacing-space-4)`, `var(--spacing-space-8)`, `var(--spacing-space-16)`, `var(--spacing-space-56)`
- `var(--padding-padding-10)`, `var(--padding-padding-16)`, `var(--padding-padding-24)`

### Footer button (inherits Synapse button)
- `var(--color-background-controls-brand-base)` fill
- `var(--color-text-white)` label
- `var(--color-border-transparent-brand)` border

### Icons
- Close: `var(--color-icon-neutral)` — slug **`shape-x`** (`16×16`)
- Serial copy: slug **`copy`** (`14×14`)

## States (Light Theme)

| Element | Background | Border | Text | Icon |
|---|---|---|---|---|
| `AboutSurface` | transparent (shell) | `var(--border-width-border-1)` `var(--color-border-neutral-light)` | — | — |
| `AboutModalMain` | `var(--color-background-component)` | none | — | — |
| `AboutHeader` | `var(--color-background-component)` | none | — | — |
| `CloseControl` (default) | transparent | none | — | `var(--color-icon-neutral)` |
| `CloseControl` (hover) | transparent | none | — | `var(--color-icon-neutral-strong)` |
| `ProductTitle` | transparent | none | `var(--color-icon-brand-base)` | — |
| `VersionLine` | transparent | none | `var(--color-text-neutral-strong)` | — |
| `SerialNumberRow` | transparent | none | `var(--color-text-neutral-strong)` | `var(--color-icon-neutral)` |
| `CopyrightText` | transparent | none | `var(--color-text-neutral)` | — |
| `AboutFooter` | `var(--color-background-component)` | top `var(--color-border-neutral-light)` | — | — |
| `CloseButton` (primary) | `var(--color-background-controls-brand-base)` | `var(--color-border-transparent-brand)` | `var(--color-text-white)` | — |
| `CloseButton` (hover) | per Synapse button spec | per Synapse button spec | `var(--color-text-white)` | — |

## States (Dark Theme)

Dark theme uses the same semantic tokens as **States (Light Theme)**. Resolved values for `[data-theme="dark"]` / Synapse dark scope live in theme CSS:

- `components/synapse-theme.css`

Duplicate the full state matrix in this section only when a dark row genuinely uses different `var(--...)` references than the corresponding light row.

## Interactions

(Inherit IDS About dialog semantics unless noted.)

- **Open:** trigger click or controlled `open={true}`
- **Close:** header `×`, footer **Close** button, **Escape** key
- **Backdrop click:** does **not** dismiss (`disablePointerDismissal`)
- **Serial copy:** optional `onSerialCopy` — copy serial to clipboard; provide success feedback host-side
- **Scroll:** `AboutBody` scrolls when content exceeds viewport (`overflow-y: auto`)

### Accessibility

- `role="dialog"`, `aria-modal="true"`
- `aria-labelledby` → product title (`BaseDialog.Title`)
- Close controls: `aria-label="Close"`
- Serial copy: `aria-label` describing copy action; announce copy result
- Focus trap while open; restore focus on close
- Keyboard: **Tab** cycle, **Enter** / **Space** activate Close, **Escape** dismiss

### Behavior & guidelines

- Use for product name, version, and legal notice — not general content modals
- Provide localized `copyrightText` as a **single string** (one centered paragraph); `copyrightContent` for rich markup must still render as one centered block
- Default logo: `assets/icons/logo-delltech-horiz.svg` (`32px` height)
- Host `components/synapse-theme.css` at application root
- Masthead help menu entry **About** opens this pattern (`SynapseMastheadHelpMenu`)

## Composition & API (runtime)

### Variants

| Axis | Values | Default |
|---|---|---|
| `showSerialNumber` | `false` \| `true` | `false` |

### Runtime API

```typescript
interface AboutProps {
  trigger?: ReactNode;
  productTitle: string;
  versionLabel: string;
  showSerialNumber?: boolean;
  serialNumber?: string;
  onSerialCopy?: () => void;
  logoSrc?: string;
  copyrightText?: string;
  copyrightContent?: ReactNode;
  legalText?: string;       // alias of copyrightText
  legalContent?: ReactNode; // alias of copyrightContent
  closeLabel?: string;      // default "Close"
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultOpen?: boolean;
}
```

| Prop | Required | Default | Notes |
|---|---|---|---|
| `productTitle` | yes | — | Maps to `ProductTitle` / dialog title |
| `versionLabel` | yes | — | e.g. `Version X.X.X` |
| `showSerialNumber` | no | `false` | Figma optional row `49962:52727` |
| `serialNumber` | when `showSerialNumber` | — | Display + copy source |
| `logoSrc` | no | `logo-delltech-horiz.svg` | `32px` height |
| `copyrightText` / `legalText` | no | sample legal copy | **One** centered Body 2 paragraph |
| `closeLabel` | no | `"Close"` | Footer primary |
| `trigger` | controlled: no | — | Required in uncontrolled mode |

Events: `onOpenChange`, `onSerialCopy?`

## Codegen Contract (Framework-Agnostic Blueprint)

### Deterministic structure

Emit slots in **Anatomy** order. `About` composes Synapse `Dialog` with `variant="about"`.

### Variant matrix

| `showSerialNumber` | Slots |
|---|---|
| `false` | standard anatomy (verified `49962:52708`) |
| `true` | + `SerialNumberRow` between `VersionLine` and `BrandBlock` |

### Per-slot style contract

| Slot | Tokens |
|---|---|
| `AboutSurface` | `border-neutral-light`, `radius-16`, width/height per **Layout** |
| `AboutModalMain` | `background-component`, shadow stack |
| `ProductTitle` | header-1 / line-height-58, `color-icon-brand-base` |
| `VersionLine` | body-2, `color-text-neutral-strong`, `spacing-space-4` below title |
| `SerialNumberRow` | body-2, `spacing-space-8`, copy `14×14` |
| `BrandBlock` | `spacing-space-56` top margin from product cluster |
| `BrandLogo` | height `32px` |
| `CopyrightText` | single `<p>`, body-2, `color-text-neutral`, `text-align: center` |
| `AboutFooter` | `padding-24`, top border `border-neutral-light` |
| `CloseButton` | Synapse primary button contract |

### Behavior contract

- Modal open/close/focus trap per Synapse modal
- `disablePointerDismissal: true` for About variant
- Serial copy invokes `onSerialCopy` when provided
- Footer Close and header × both call `onOpenChange(false)`

### Accessibility contract

See **Interactions → Accessibility**.

### Asset resolution + bundling contract

| Slug | File | Usage |
|---|---|---|
| `shape-x` | `assets/icons/shape-x.svg` | Header close `16×16` |
| `copy` | `assets/icons/copy.svg` | Serial copy `14×14` |
| `logo-delltech-horiz` | `assets/icons/logo-delltech-horiz.svg` | Default brand logo `32px` height |

Resolve via shared `Icon` primitive or static import; brand logo may use `<img src={logoSrc}>`.

### Fallback/error rules

- Missing `productTitle` or `versionLabel` → validation error at codegen boundary
- `showSerialNumber` without `serialNumber` → hide serial row
- Unknown `logoSrc` → omit logo slot; keep copyright text
- Missing copyright → omit `BrandBlock` text/logo cluster except when `logoSrc` provided

### Validation checklist

- [x] IDS baseline referenced; programme deltas table complete for `49962:52708`
- [x] Live Figma MCP on `49962:52708`, `49962:53921`, `get_variable_defs`
- [ ] Surface `1152×596` sample + responsive width rule in implementation
- [ ] `radius-16` + `border-neutral-light` on About surface
- [ ] Product title uses `var(--color-icon-brand-base)`
- [ ] `spacing-space-56` between product and copyright clusters
- [ ] Footer top border + single primary Close (Synapse button padding)
- [ ] `disablePointerDismissal` on About dialog
- [ ] Optional serial row + copy icon when `showSerialNumber`
- [ ] Dark theme via `synapse-theme.css` semantic tokens
- [x] Storybook `Spec Generated/Synapse/About` — `storybook-generated/synapse/src/components/About.stories.tsx`

## Source Mapping

| Property | Value |
|---|---|
| Design source | Synapse Hi-Fi `Td1bnsvRj1PCGs9RVJkIvJ` |
| Main component | `49962:52708` (`About-Synapse`) |
| Usage instance | `49962:53921` on board `49962:53917` |
| IDS parity reference | `components/ids/about/design-spec.md` — node `30680:10863` (`0bHk3XhrjFhowgFkz9yLr4` exploration file) |
| Synapse modal shell | `components/synapse/modal/design-spec.md` |
| Component map | `data/synapse-component-figma-map.json` → About |
| Registry | `data/programme-inheritance-registry.json` → `synapse` / `about` |
| Verification | Figma MCP — **2026-06-08** |
