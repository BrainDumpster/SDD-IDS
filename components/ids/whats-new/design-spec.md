# Whats New Design Spec

## Metadata

| Property | Value |
|---|---|
| Component | Whats New |
| Design system | IDS |
| Category | Patterns |
| Status | ready |
| Version | 1.0.0 |
| Description | Modal pattern for release updates — list or image-preview layouts, version filter, bookmarked items, footer dismiss preference |
| File key | `0bHk3XhrjFhowgFkz9yLr4` |
| Main component set (`WhatsNew-Main`) | https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=27437-44073&m=dev — **`27437:44073`** |
| Variant `Newest` | https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=27437-44094&m=dev — **`27437:44094`** |
| Variant `Bookmarked` | https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=27437-44074&m=dev — **`27437:44074`** |
| Variant `Preview Multiple` | https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=27437-44134&m=dev — **`27437:44134`** |
| Variant `Preview Single` | https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=27437-44151&m=dev — **`27437:44151`** |
| Element `.WhatsNew-Element-Content` (list) | **`27437:44190`** |
| Element `.WhatsNew-Element-Content` (preview carousel) | **`27437:44198`** |
| Element `.WhatsNew-Element-Thumbnails` states | **`27437:44168`** (`Default` / `Hover` / `Selected`) |
| Element `.WhatsNew-Element-SectionHeader` | **`27437:44182`** |
| Element `.WhatsNew-Element-Filter` | **`27437:44220`** |
| Validated nodes | **`27437:44073`**, **`27437:44094`**, **`27437:44074`**, **`27437:44134`**, **`27437:44151`**, **`27437:44190`**, **`27437:44198`**, **`27437:44168`**, **`27437:44174`**, **`27437:44169`**, **`27437:44182`**, **`27437:44220`** |
| Verification method | Figma MCP (`get_metadata`, `get_design_context`, `get_variable_defs`, `disableCodeConnect: true`) — **2026-07-08** |
| Theme CSS | `components/ids-theme.css` |
| Storybook | `storybook/src/components/IdsWhatsNew.stories.tsx` — **Spec Accurate Design** uses compound API; `Convenience Data Sections` story uses `sections[]` only |
| Contract mirror | `storybook/src/spec-contracts/ids-whats-new.contract.ts` |
| Nested specs | `components/ids/button/design-spec.md`, `components/ids/toggle-switch/design-spec.md`, IDS Dropdown Single Select |

### Spec Accurate Design story defaults

- **Host:** IDS `Dialog` modal, **`open: true`** by default
- **Title:** `What's New`
- **Description:** `The following updates (features, bug fixes) have recently been made.`
- **Version (optional):** `versionNumber="1.11.11.1"` → renders **`Version: 1.11.11.1`**
- **Filter value:** `Newest`
- **Sections:** 3 `Section` rows (Figma sample copy); `isBookmarked` per section
- **Footer:** root-controlled `dontShowAgain` toggle (default off) + primary **Close**
- **Sample frame:** `1152×708` — runtime modal width is host-driven (`max-width` + `width: 100%`, `box-sizing: border-box`)

- **Footer toggle label:** `Don't show again until the next update`
- **Thumbnail click:** opens **stacked carousel modal** (parent list modal stays open underneath)

## Anatomy

### Modal stack (runtime — authoritative)

Two independent IDS `Dialog` layers. **Do not** replace the list body in-place.

| Layer | When visible | Header title | Body height | Footer close dismisses |
|---|---|---|---|---|
| **Main (`WhatsNewRoot`)** | `open=true` | `title` (default `What's New`) | list (flex) | entire pattern |
| **Carousel (`WhatsNewCarouselModal`)** | Thumbnail click | `section.title` | **up to 523px** (`.WhatsNew-Element-Content` `27437:44146`; flex remainder) | carousel only |
| **Single preview (`WhatsNewSinglePreviewModal`)** | `popout-double` in carousel | `section.title` | **up to 523px** (Preview Single `27437:44163`; flex remainder) | single preview only |

- Carousel / single z-index: `1002–1003` / `1004–1005` (above main `1000–1001`)
- **Escape** targets topmost open dialog only

### Component composition (child components — authoritative)

Hosts may supply content via **(A) data props** (`sections[]`) or **(B) child components** (compound / slot JSX). Both must normalize to the **same internal slot tree** below — codegen must not invent a third hierarchy.

#### Root

- **`WhatsNewRoot`** — main IDS `Dialog`; `open` default `true`; owns carousel + single-preview stack state, `dontShowAgain`, filter (when uncontrolled).

#### Main list modal (deterministic child order)

```
WhatsNewRoot
├── WhatsNewHeader                    (Figma header row — not in carousel)
│   ├── WhatsNewTitle                 (Header 5; default "What's New")
│   └── WhatsNewCloseButton           (shape-x 16×16)
├── WhatsNewSummary                   (Body 2 intro — main only; Figma summary 27437:44104)
├── WhatsNewBody
│   ├── WhatsNewVersionFilterRow      (fixed; does not scroll)
│   │   ├── WhatsNewVersion?           (optional; "Version: {n}")
│   │   └── WhatsNewFilter            (Dropdown Single Select 200×32)
│   └── WhatsNewSectionsScroll        (overflow-y: auto — only scroll region)
│       └── WhatsNewSection × n       (Figma list row; dashed bottom rule)
│           ├── WhatsNewThumbnail     (.WhatsNew-Element-Thumbnails 200×112.5 list)
│           ├── WhatsNewSectionHeader (.WhatsNew-Element-SectionHeader 27437:44182)
│           │   ├── WhatsNewBookmarkButton
│           │   └── WhatsNewSectionTitle
│           ├── WhatsNewDescription     (Body 2; 3-line clamp + Show More)
│           │   └── WhatsNewLink?       (inline linkText + linkHref)
│           ├── WhatsNewShowMore?       (truncation / expanded only)
│           └── WhatsNewImages          (carousel source — not rendered in list row)
│               └── WhatsNewImage × m   (id, src?, alt?, label?)
└── WhatsNewFooter                    (toggle + primary Close — dismiss main)
```

#### Stacked carousel modal (`WhatsNewCarouselModal`)

Opened by **list** `WhatsNewThumbnail` click; main list stays mounted underneath.

```
WhatsNewCarouselModal
├── WhatsNewCarouselHeader            (section.title + close)
├── WhatsNewCarouselBody              (.WhatsNew-Element-Content 27437:44198)
│   ├── WhatsNewCarouselNav?           (chev-left / chev-right; hidden when images.length === 1)
│   ├── WhatsNewThumbnailStrip?       (184×103 tiles; flex-shrink: 0)
│   │   └── WhatsNewStripThumbnail × m (compact; no hover overlay; selected border)
│   ├── WhatsNewHeroImage               (active WhatsNewImage or .Image-SwapContent)
│   └── WhatsNewCaptionRow
│       ├── WhatsNewCaptionLabel        (<ol start={index+1}>)
│       └── WhatsNewExpandButton        (popout-double 32×32 → single preview)
└── WhatsNewFooter                    (same root dontShowAgain + Close — dismiss carousel only)
```

#### Stacked single-preview modal (`WhatsNewSinglePreviewModal`)

Opened by `WhatsNewExpandButton` in carousel; carousel + main stay open.

```
WhatsNewSinglePreviewModal
├── WhatsNewSinglePreviewHeader         (section.title + close)
├── WhatsNewSinglePreviewBody           (Preview Single 27437:44163)
│   ├── WhatsNewHeroImage               (active image only — no strip/nav)
│   └── WhatsNewCaptionRow              (caption + decorative popout-double)
└── WhatsNewFooter                      (dismiss single layer only)
```

#### Figma element ↔ runtime child map

| Figma element / node | Runtime child | Notes |
|---|---|---|
| `.WhatsNew-Element-Thumbnails` `27437:44168` | `WhatsNewThumbnail` (list) / `WhatsNewStripThumbnail` (carousel) | List `200×112.5`; strip `184×103` |
| `.Image-SwapContent` | inside `WhatsNewThumbnail` / `WhatsNewHeroImage` when no `src` | `photos` 32×32 + swap copy |
| `.WhatsNew-Element-SectionHeader` `27437:44182` | `WhatsNewSectionHeader` | bookmark + title |
| `.WhatsNew-Element-Content` list `27437:44190` | `WhatsNewSectionsScroll` > `WhatsNewSection` | scrollable sections |
| `.WhatsNew-Element-Content` preview `27437:44198` | `WhatsNewCarouselBody` | fixed flex body ≈523px at design height |
| `.WhatsNew-Element-Filter` `27437:44220` | `WhatsNewFilter` | host may own filter state |

### Main modal slots (summary)

- `WhatsNewRoot` — main IDS `Dialog`; **`open` defaults to `true`**
  - Shell: `Modal-Main` border + elevation
  - `WhatsNewHeader` — title row + close (always main copy)
    - `WhatsNewTitle` — **Header 5** (`What's New`)
    - `WhatsNewCloseButton` — shared **`Icon`** (`shape-x`, **`variant="img"`**, **`16×16`**)
  - `WhatsNewSummary` — **Body 2** intro (`padding-bottom: 16px`); separate row below header (Figma `summary` **`27437:44104`**)
  - `WhatsNewBody` — list only; **only `WhatsNewSectionsScroll` scrolls vertically**
    - `WhatsNewVersionFilterRow` — **Version** + **Filter**; `border-bottom: 1px solid var(--color-border-accessible)`
    - `WhatsNewSectionsScroll` → `WhatsNewSection` × *n*
      - thumbnail, bookmark star button, title, description (+ inline link), Show More
  - `WhatsNewFooter` — root toggle + **Close** (dismiss main)

### Carousel modal slots (`WhatsNewCarouselModal`)

Figma: **Preview Single** `27437:44151`, **Preview Multiple** `27437:44134`

- `WhatsNewCarouselHeader` — **section title** (Header 5) + close (dismiss carousel only)
- `WhatsNewCarouselBody` (`.WhatsNew-Element-Content` **`27437:44198`**)
  - nav chevrons (`chev-left` / `chev-right`) when `images.length > 1`
  - thumbnail strip + hero + caption row (`popout-double` expand)
- `WhatsNewFooter` — same root toggle + **Close** (dismiss carousel only)

## Layout & Measurements

| Region | Figma frame / measurement | Runtime |
|---|---|---|
| Modal shell (`Modal-Main`) | **`1152×708`** sample | `width: 100%`, `max-width` from host; `min-height` content-driven; `box-sizing: border-box` |
| Modal border | `1px` accessible | `border: 1px solid var(--color-border-accessible)` |
| Modal elevation | Shadow 4 stack (4 layers) | use shadow-4 CSS variables |
| Header title row | close aligned top; title `padding-bottom: 24px` | flex row |
| Close hit target | icon **`16×16`** via `Icon` `variant="img"` | no CSS mask tinting for close |
| Description (summary row) | **Body 2**; `padding-bottom: 16px` | Figma `summary` layer below header title row — **not** inside carousel modal |
| Carousel stack z-index | main backdrop `1000`, main popup `1001` | carousel backdrop `1002`, carousel popup `1003` |
| Version + filter row | single row, `align-items: center`; version left, filter **`200×32`** right | top of body (not scrollable) |
| Sections scroll | `overflow-y: auto` on sections container only | version/filter row stays fixed |
| Divider gradient | when sections overflow and not scrolled to bottom | `linear-gradient` on **footer** top divider (`19px` above border) using overflow vertical tokens |
| Filter trigger | **`200×32`**, `px: 16px`, `py: 6px`; caret **`10×10`** | square corners (`border-radius: 0`) |
| List item row | thumbnail **`200×112.5`** + text column; row `gap: 16px`; `pb: 8px` | dashed `border-bottom: 1px var(--color-border-light)` |
| Thumbnail (carousel strip) | **`184×103`** per tile; inter-tile `gap: 16px`; **`flex-shrink: 0`** | selected tile `4px` brand border; default `1px` accessible |
| Thumbnail (list) | **`200×112.5`** | same border states as carousel |
| Carousel content (`.WhatsNew-Element-Content`) | **up to `523px`** (`27437:44146`); fills remainder after footer/header | `py: 16px` `px: 24px`; `min-height: 0`; shrinks on short viewports |
| Carousel header | **min `80px`** (`27437:44137`) | `p: 24px`; `flex-shrink: 0` |
| Carousel footer | **min `88px`** (`27437:44147`) | toggle + primary Close; **layout priority #1** — never clip |
| Preview modal flex | footer reserved → header reserved → body `flex: 1 1 0` | inside `708px` shell; body ≈523px at design height |
| Caption row | numbered label **Body 1** + **`32×32`** popout icon | `justify-between` |
| Carousel nav buttons | `chev-left` / `chev-right` **`16×16`**; padding `16px/12px` | ghost icon buttons; **`Icon` `mask`**; hidden when single image |
| Carousel nav icon | enabled | n/a | n/a | `var(--color-icon-brand-base)` (`27437:44200`) |
| Carousel nav icon | disabled (at ends) | n/a | n/a | `var(--color-icon-disabled)` |
| Strip trailing overlay | **`32×103`**; `position: absolute; right: 0` on strip viewport (`27437:44208`) | inner `103×32` bar, `-90deg` rotate; `linear-gradient(180deg, vertical overflow tokens)`; overflow only |
| Footer | `border-top: 1px accessible`; `padding: 24px` | toggle left, **Close** right |
| Primary Close button | `px: 16px`, `py: 10px` | IDS Button primary |
| Scrollbar thumb | **`10×60`**, thumb radius **`8px`** | when `showScrollBar=true` |
| Overflow gradient (footer) | height **`19px`** above footer | vertical gradient tokens |

### Variant axes (`WhatsNew-Main` **`27437:44073`**)

| Axis (`Property 1`) | Values | Maps to runtime |
|---|---|---|
| `Newest` | default list | main modal, filter **Newest** |
| `Bookmarked` | bookmarked list | main modal, filter **Bookmarked**, alternate `description` |
| `Preview Single` | single hero image | **stacked carousel modal** for one image |
| `Preview Multiple` | carousel | **stacked carousel modal** with strip + prev/next |

### Responsiveness

- Modal width is **container-driven**; do not hardcode `1152px` in production layouts.
- List body scrolls vertically inside the modal; horizontal overflow is clipped.
- Thumbnail strip uses **fixed `184×103`** tiles (`flex-shrink: 0`); viewport clips overflow — a **partial trailing thumbnail is allowed** per Figma (`27437:44202`).
- Show **`32×103`** trailing overlay on `.thumbnailStripViewport` (`27437:44208`) when the strip overflows and is not scrolled to the end — `position: absolute; right: 0`; `border-radius: var(--corner-radius-radius-none)`; gradient uses `var(--color-gradient-overflow-vertical-end)` → `var(--color-gradient-overflow-vertical-start)`.
- Strip uses **`scroll-snap-type: x mandatory`** + tile **`scroll-snap-align: start`**; prev/next scrolls active thumbnail into view (`inline: start`).

### Slot geometry (Figma-verified)

| Slot / layer | Property | Token / contract | Figma node | Live evidence |
| --- | --- | --- | --- | --- |
| Modal shell (`Modal-Main`) | border-radius | `0` / square (`Corner Radius/radius-none`) | `27437:44152` | `get_variable_defs` on `27437:44151` |
| Filter trigger (`Container`) | border-radius | `0` / square (`Corner Radius/radius-none`) | `27437:44222` → `12579:77931` | `get_variable_defs` on `27437:44222` |
| Primary Close button | border-radius | `var(--corner-radius-radius-2, 2px)` | `27437:44167` | `get_variable_defs` on `27437:44167` |
| Show More text button | border-radius | `var(--corner-radius-radius-2, 2px)` | `27437:44231` | `get_design_context` on `27437:44190` |
| Carousel nav icon button | border-radius | `var(--corner-radius-radius-2, 2px)` | `27437:44200` | `get_design_context` on `27437:44198` |
| Scrollbar thumb | border-radius | `var(--corner-radius-radius-8, 8px)` | `27437:44110` | `get_variable_defs` on `27437:44110` |
| List thumbnail (default) | border + content | `200×112.5`; `1px solid var(--color-border-accessible)`; photos + “Swap image” + “Learn to swap” | `27437:44174` | `get_design_context` on `27437:44174` / `27437:44168` |
| List thumbnail (hover) | border + overlay | `4px solid var(--color-border-brand-base)` + `var(--color-background-component)` @ 80% + centered `popout-window-arrow` 32×32 | `27437:44169` | `get_design_context` on `27437:44168` |
| List thumbnail (selected) | border | `4px solid var(--color-border-brand-base)`; content fully visible (no overlay) | `27437:44178` | `get_design_context` on `27437:44168` |
| Thumbnail multi badge | `+N` | `var(--ui-palette-gray-500)` chip; `N = images.length - 1` when `images.length > 1` | `27437:44177` | `get_design_context` on `27437:44174` |

## Tokens

### Typography

| Slot | Token / Figma style | Size / line-height |
|---|---|---|
| Modal title | **Header 5** | `var(--font-size-header-5, 24px)` / `var(--font-line-height-line-height-32, 32px)` — `var(--color-text-neutral-strong)` |
| Description (header) | **Body 2** | `var(--font-size-body-2, 14px)` / `20px` (Figma `1.5`) — `var(--color-text-neutral)` |
| Version (header, optional) | **Header 6** | `var(--font-size-header-6, 18px)` / `var(--font-line-height-line-height-25, 25px)` |
| Filter value | **Body 2** | `14px` / `20px` — `var(--color-text-neutral)` |
| Section header | **Body 2 Medium** | `14px` / `20px` — `var(--color-text-neutral-strong)` |
| Description / links | **Body 2** | `14px` / `20px` — `var(--color-text-neutral)`; links `var(--color-text-link-brand-base)` / `var(--color-text-brand-strong)` |
| Swap placeholder title | **Header 6** | `18px` / `25px` |
| Swap helper copy | **Body 3** | `12px` / `18px` |
| Caption label | **Body 1** | `16px` / `24px` |
| Footer toggle label | **Body 2** | `14px` / `16px` (Figma sample) |
| Close button label | **Body 2** | `14px` / `20px` — `var(--color-text-white)` |

### Colors and surfaces

- `var(--color-background-component)` — modal shell, filter trigger, footer background
- `var(--color-border-accessible)` — modal border, header/footer dividers, default thumbnail border, filter border
- `var(--color-border-light)` — dashed list row separators
- `var(--color-border-brand-base)` — selected/hover thumbnail border, inline link accents
- `var(--color-text-neutral-strong)` — titles, section headers
- `var(--color-text-neutral)` — body copy, filter text
- `var(--color-text-brand-strong)` — **Show More**, tertiary actions
- `var(--color-text-link-brand-base)` — inline and helper links
- `var(--color-text-white)` — primary **Close** label
- `var(--color-icon-brand-base)` — carousel nav (enabled), expand (`popout-double`)
- `var(--color-icon-neutral)` — close (`shape-x`), filter caret
- `var(--color-icon-disabled)` — carousel nav disabled
- `var(--color-background-controls-brand-base)` — primary **Close** fill
- `var(--color-border-transparent-brand)` — primary button border
- `var(--color-background-gray-lighter)` — scrollbar track
- `var(--color-background-gray-base)` — scrollbar thumb
- `var(--color-gradient-overflow-vertical-start)` / `var(--color-gradient-overflow-vertical-end)` — scroll/footer fade
- `var(--color-gradient-overflow-horizontal-start)` / `var(--color-gradient-overflow-horizontal-middle)` / `var(--color-gradient-overflow-horizontal-end)` — thumbnail strip fade (preview multiple)

### Elevation

- Shadow 4 stack on `Modal-Main`:
  - `var(--shadow-shadow-4-drop-shadow-4-x)`
  - `var(--shadow-shadow-4-drop-shadow-4-y)`
  - `var(--shadow-shadow-4-drop-shadow-4-blur)`
  - `var(--shadow-shadow-4-drop-shadow-4-spread)`
  - `var(--shadow-shadow-4-drop-shadow-4-color)`

### Icons & asset slugs (codegen-authoritative)

Use the shared IDS **`Icon`** component (`shapeName` = slug under `assets/icons/<slug>.svg`). **Never** hardcode inline SVG paths in generated code.

| Slot | `shapeName` | Size | `Icon` variant | Color / notes | Figma evidence |
|---|---|---:|---|---|---|
| Thumbnail / hero placeholder (no `src` or broken `src`) | **`photos`** | `32×32` | **`img`** | full-color glyph; render via `Icon`; on `img` `onError` fall back to swap placeholder with `photos` | `27437:44174`, `27437:44168` |
| List thumbnail hover overlay | **`popout-window-arrow`** | **`32×32`** | **`inline`** | two-tone: window frame `var(--color-icon-neutral)`; **arrow only** `var(--color-icon-brand-base)`; list thumbnails only | `27437:44169` |
| Section bookmark (default) | **`star-fav`** | `16×16` | **`img`** | `isBookmarked=false` | `27437:44182` |
| Section bookmark (active) | **`star-fav-solid`** | `16×16` | **`img`** | `isBookmarked=true` | `27437:44182` |
| Carousel / single preview expand | **`popout-double`** | **`32×32`** | **`inline`** | two-tone: **frame/border only** `var(--color-border-brand-base)`; inner arrows `var(--color-icon-neutral)` — do not tint arrows brand | `27437:44212` |
| Carousel previous | **`chev-left`** | `16×16` | **`mask`** | enabled `var(--color-icon-brand-base)`; disabled `var(--color-icon-disabled)` | `27437:44200` |
| Carousel next | **`chev-right`** | `16×16` | **`mask`** | same as previous | `27437:44213` |
| Dialog close (all layers) | **`shape-x`** | `16×16` | **`img`** | `var(--color-icon-neutral)` — **do not use mask** | header close nodes |

#### Image media resolution (thumbnails + hero)

1. When `WhatsNewSectionImage.src` is **missing** → render **swap placeholder** (`.Image-SwapContent`) with **`photos`** icon + copy from placeholder table.
2. When `src` is provided → render `<img>` with `object-fit: cover` filling the tile/hero.
3. When `<img>` **`onError`** (broken URL, 404, CORS, etc.) → **same fallback as (1)**; do not leave a broken image icon or empty box.
4. Strip thumbnails (`compact`) **never** show hover `popout-window-arrow` overlay (selected state only).
5. Thumbnail placeholder, hover overlay, and expand controls are all **`32×32`** icon boxes — pass `style={{ width: 32, height: 32 }}` on `Icon` (the shared `Icon` `img` variant defaults to `16×16` inline; CSS class alone does not override).

#### Two-tone popout icons (inline SVG)

Register in `iconInlineRegistry` (or equivalent) — **do not** use single-color `mask` for these slugs:

| Slug | Layer | Fill token |
|---|---|---|
| `popout-window-arrow` | window frame paths | `var(--color-icon-neutral)` |
| `popout-window-arrow` | arrow polygon | `var(--color-icon-brand-base)` |
| `popout-double` | outer frame path | `var(--color-border-brand-base)` |
| `popout-double` | inner arrow polygons | `var(--color-icon-neutral)` |

Contract mirror constants: `storybook/src/spec-contracts/ids-whats-new.contract.ts` → `WHATS_NEW_ICON_*`.

### Spacing / padding

- `var(--padding-padding-24, 24px)` — header, footer, horizontal body padding
- `var(--padding-padding-16, 16px)` — body top, button horizontal padding
- `var(--padding-padding-10, 10px)` — primary button vertical padding
- `var(--padding-padding-8, 8px)` — version row bottom, list row bottom
- `var(--padding-padding-6, 6px)` — filter vertical padding
- `var(--spacing-space-16, 16px)` — list row gap, thumbnail strip gap
- `var(--spacing-space-8, 8px)` — section header icon gap, toggle label gap

## States (Light Theme)

| Slot | State | Background | Border | Text/Icon |
|---|---|---|---|---|
| Modal shell | default | `var(--color-background-component)` | `1px solid var(--color-border-accessible)` | n/a |
| Close control | default | transparent | none | `var(--color-icon-neutral)` |
| Close control | hover/focus-visible | transparent | focus ring per IDS | unchanged |
| Filter trigger | default | `var(--color-background-component)` | `1px solid var(--color-border-accessible)` | `var(--color-text-neutral)` + caret `var(--color-icon-neutral)` |
| Filter option row | hover/selected | per Dropdown Single Select spec | per dropdown spec | per dropdown spec |
| List thumbnail | default | transparent | `1px solid var(--color-border-accessible)` | **`photos`** `32×32` + swap copy |
| List thumbnail | hover | `var(--color-background-component)` @ 80% overlay | `4px solid var(--color-border-brand-base)` | **`popout-window-arrow`** `32×32`; arrow `var(--color-icon-brand-base)` |
| List thumbnail | selected | transparent | `4px solid var(--color-border-brand-base)` | unchanged (no hover overlay) |
| Section title star | `isBookmarked=false` | n/a | n/a | **`star-fav`** `16×16` (`Icon` `variant="img"`) |
| Section title star | `isBookmarked=true` | n/a | n/a | **`star-fav-solid`** `16×16` (`Icon` `variant="img"`) |
| Close Icon | default | transparent | none | `shape-x` via `Icon` **`variant="img"`** (no mask) |
| Show More | default | transparent | none | `var(--color-text-brand-strong)` |
| Show More | hover | transparent | none | underline optional per link pattern |
| Primary Close | default | `var(--color-background-controls-brand-base)` | `1px solid var(--color-border-transparent-brand)` | `var(--color-text-white)` |
| Toggle | off/on | per Toggle Switch spec | per Toggle Switch spec | label neutral |
| Carousel nav | default | transparent | none | **`chev-left`** / **`chev-right`** — `Icon` **`mask`**, `var(--color-icon-brand-base)` |
| Carousel expand | default | transparent | none | **`popout-double`** `32×32` — frame `var(--color-border-brand-base)`; arrows `var(--color-icon-neutral)` |
| Carousel nav | disabled | transparent | none | `var(--color-icon-disabled)` |
| Scrollbar thumb | default | `var(--color-background-gray-base)` | none | n/a |

## States (Dark Theme)

Dark theme uses the same semantic tokens as **States (Light Theme)**. Resolved values for `[data-theme="dark"]` / `.ids-theme-dark` (and program overlays) live in theme CSS:

- `components/ids-theme.css`
- `components/<program>-theme.css` when a program overlays IDS (for example `components/dap-theme.css`)

Duplicate the full state matrix in this section only when a dark row genuinely uses different `var(--...)` references than the corresponding light row.

*(When Light and Dark tables would list identical `var(--...)` cells, keep the matrix under **States (Light Theme)** only and use this pointer section instead of a second table.)*

## Interactions

### State machine (deterministic)

```
[main closed] --open--> [main open, list]
[main open, list] --thumbnail click--> [main + carousel]
[main + carousel] --popout-double--> [main + carousel + single preview]
[single preview open] --single X / single Close / Escape--> [main + carousel]
[carousel open] --carousel X / carousel Close / Escape (no single)--> [main open, list]
[main open, *] --main X / main Close--> [main closed] (all layers close)
```

### Open / close

- **Main open:** `open` default `true`; focus trap in topmost open dialog.
- **Main close:** main **X**, main footer **Close**, `onOpenChange(false)` — also closes carousel if open; `onClose` fires.
- **Carousel open:** list thumbnail click; `activeImageIndex` = index of clicked `imageId`, else `0`.
- **Carousel close:** carousel **X**, carousel footer **Close**, **Escape** (when carousel focused) — main stays open; `onCarouselClose(sectionId)`.
- **Don't show again:** root-only `dontShowAgain` + `onDontShowAgainChange`; mirrored in both footers; host persists preference.

### List body

- **Filter:** IDS Dropdown Single Select. When `onFilterChange` omitted, component filters **client-side**: `bookmarked` → `sections.filter(s => s.isBookmarked)`; `newest` → all sections. When `onFilterChange` provided, host owns `filter` + `sections` data.
- **Bookmark star:** button toggles `isBookmarked`; `onSectionBookmarkChange(sectionId, isBookmarked)`; icons `star-fav` / `star-fav-solid` (`Icon` `variant="img"`).
- **Show More:** collapsed description uses **3-line clamp** (`-webkit-line-clamp: 3`); button visible only when truncated or expanded; toggles **Show Less**; `onShowMore(sectionId, expanded)`.
- **Inline links:** `linkText` + `linkHref` inside description; external links use `target="_blank"` + `rel="noopener"`.
- **Scroll:** only `SectionsScroll` scrolls; overflow shadow (`19px`) when content below fold (IDS Dialog pattern).

### Carousel body

- **Nav:** prev/next disabled at ends; strip thumbnail sets index; `onCarouselNavigate(sectionId, index)`; **`chev-left`** / **`chev-right`** via `Icon` **`mask`** + brand/disabled tokens.
- **Strip scroll:** fixed `184×103` tiles (`flex-shrink: 0`); `scroll-snap-type: x mandatory`; prev/next scrolls active thumbnail into view (`inline: start`).
- **Strip overlay:** `32×103` absolute overlay on strip viewport right edge when overflow and not at scroll end; `linear-gradient(180deg, var(--color-gradient-overflow-vertical-end), var(--color-gradient-overflow-vertical-start))`.
- **Single image:** hide strip + chevrons (Preview Single).
- **Caption:** `<ol start={activeIndex+1}><li>{label without leading number}</li></ol>`.
- **Expand (`popout-double`):** opens stacked **Single preview** modal (`27437:44151`); also emits `onExpandImage(sectionId, imageId, index)` for host hooks. Single preview **X** / **Close** / **Escape** dismiss single layer only (`onSinglePreviewClose`).
- **Thumbnail hover overlay:** list thumbnails only (not strip selected state).

### Accessibility

- Each dialog: `role="dialog"`, `aria-modal="true"`, `aria-labelledby` → respective title.
- Main close: `aria-label="Close"`; carousel close: `aria-label="Close image preview"`.
- Filter: combobox per Dropdown Single Select spec.
- Carousel nav: **Previous image** / **Next image**; active strip thumb `aria-current="true"`.
- Focus trap in topmost dialog; **Escape** targets topmost dialog only.

### Behavior & guidelines

- Use **Newest** for default post-release surfacing; **Bookmarked** when user has saved items across versions.
- Preview variants are for media-heavy announcements; swap `.Image-SwapContent` with product image components using auto-layout.
- Keep description concise; **Show More** for long-form content.
- Do not block Close when toggle is off — preference is optional.

## Composition & API (runtime)

### Consumption models

| Model | Role | Entry |
|---|---|---|
| **B — Child components (canonical)** | **Primary public API** for codegen and product hosts | `<WhatsNewRoot>` + `WhatsNewSection` / `WhatsNewThumbnail` / `WhatsNewDescription` / `WhatsNewImages` / `WhatsNewImage` |
| **A — Data props (convenience)** | CMS/JSON demos, Storybook shortcuts only | `sections?: WhatsNewSection[]` on root |

**Codegen rule:** Implement and document **Model B** as the exported compound API (`IdsWhatsNew.Section`, `.Thumbnail`, `.Description`, `.Images`, `.Image`, …). Model A may exist as an internal normalizer or optional convenience wrapper; generated usage examples and tests must use child composition, not `sections[]`.

**Precedence:** When both `sections[]` and `WhatsNewSection` children are supplied, **`sections[]` wins** (dev warning).

**Rules (both models):**

- `WhatsNewSummary` / root `description` → **main modal only**; never duplicated in carousel headers.
- `WhatsNewImages` / `images[]` drives carousel; list row shows **first** image (or placeholder) on `WhatsNewThumbnail`.
- `WhatsNewThumbnail` click → open `WhatsNewCarouselModal` at clicked image index (or `0`).
- `WhatsNewStripThumbnail` is carousel-only; list uses `WhatsNewThumbnail` with hover overlay.
- Custom media: `WhatsNewImage` may use `src` **or** `children` (host component); missing/broken `src` → `.Image-SwapContent` with `photos`.

### Child component API (composition model B)

Framework names may vary (`WhatsNew.Section`, `ids-whats-new-section`, etc.); **slot semantics are fixed**:

```typescript
// --- Main shell ---
interface WhatsNewRootProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  dontShowAgain?: boolean;
  onDontShowAgainChange?: (value: boolean) => void;
  filter?: WhatsNewFilter;
  onFilterChange?: (filter: WhatsNewFilter) => void;
  versionNumber?: string;
  onClose?: () => void;
  children?: React.ReactNode; // OR use sections[] — not both as source of truth
  sections?: WhatsNewSection[]; // data model A
}

// --- Main header / summary ---
interface WhatsNewTitleProps { children: string; }
interface WhatsNewSummaryProps { children: string; } // main intro only

// --- Section row (repeat in WhatsNewSectionsScroll) ---
interface WhatsNewSectionProps {
  id: string;
  isBookmarked?: boolean;
  onBookmarkChange?: (bookmarked: boolean) => void;
  children: React.ReactNode; // must include Thumbnail + SectionHeader + Description; Images optional
}

interface WhatsNewThumbnailProps {
  /** List tile click — opens carousel for parent section */
  onClick?: () => void;
  /** Image URL; omit for swap placeholder */
  src?: string;
  alt?: string;
  /** When images.length > 1 on section */
  extraCount?: number; // renders +N badge
  children?: React.ReactNode; // overrides default .Image-SwapContent when no src
}

interface WhatsNewSectionHeaderProps {
  children: React.ReactNode; // typically Bookmark + Title
}

interface WhatsNewBookmarkButtonProps {
  pressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
}

interface WhatsNewSectionTitleProps { children: string; }

interface WhatsNewDescriptionProps {
  children: React.ReactNode;
  /** Collapsed clamp: 3 lines */
  defaultExpanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
}

interface WhatsNewLinkProps { href: string; children: string; }

// --- Carousel image set (hidden in list; powers carousel) ---
interface WhatsNewImagesProps { children: React.ReactNode; }

interface WhatsNewImageProps {
  id: string;
  src?: string;
  alt?: string;
  label?: string; // caption e.g. "1. Label"
  children?: React.ReactNode; // custom hero/strip content when src absent
}

// --- Events (root; apply to active section/image) ---
// onThumbnailClick(sectionId, imageId?)
// onCarouselNavigate(sectionId, index)
// onExpandImage(sectionId, imageId, index)
// onCarouselClose(sectionId)
// onSinglePreviewClose(sectionId, imageId, index)
```

### JSX composition example (model B)

```tsx
<WhatsNewRoot open onOpenChange={setOpen} versionNumber="1.11.11.1">
  <WhatsNewHeader>
    <WhatsNewTitle>What's New</WhatsNewTitle>
    <WhatsNewCloseButton />
  </WhatsNewHeader>

  <WhatsNewSummary>
    The following updates (features, bug fixes) have recently been made.
  </WhatsNewSummary>

  <WhatsNewBody>
    <WhatsNewVersionFilterRow>
      <WhatsNewVersion />
      <WhatsNewFilter />
    </WhatsNewVersionFilterRow>

    <WhatsNewSectionsScroll>
      <WhatsNewSection id="section-1" isBookmarked={false}>
        <WhatsNewThumbnail src={heroSrc} alt="Release screenshot" extraCount={4} />
        <WhatsNewSectionHeader>
          <WhatsNewBookmarkButton />
          <WhatsNewSectionTitle>Section Header</WhatsNewSectionTitle>
        </WhatsNewSectionHeader>
        <WhatsNewDescription>
          Short summary of the change.{" "}
          <WhatsNewLink href="/docs">guidance to manage</WhatsNewLink>
        </WhatsNewDescription>
        <WhatsNewImages>
          <WhatsNewImage id="img-1" label="1. Label" src={url1} />
          <WhatsNewImage id="img-2" label="2. Label" />
          {/* omit src → photos placeholder in carousel */}
        </WhatsNewImages>
      </WhatsNewSection>
    </WhatsNewSectionsScroll>
  </WhatsNewBody>

  <WhatsNewFooter />
</WhatsNewRoot>
```

`WhatsNewCarouselModal` / `WhatsNewSinglePreviewModal` are **internal** — hosts do not mount them; root opens them from thumbnail / expand interactions.

### Data prop ↔ child component mapping (model A)

| `WhatsNewSection` field | Child equivalent |
|---|---|
| `title` | `WhatsNewSectionTitle` children |
| `description` | `WhatsNewDescription` children (text before link) |
| `linkText` + `linkHref` | `WhatsNewLink` inside `WhatsNewDescription` |
| `isBookmarked` | `WhatsNewBookmarkButton` `pressed` |
| `images[]` | `WhatsNewImages` > `WhatsNewImage` × n |
| `images[0]` (primary) | `WhatsNewThumbnail` `src` / `alt` |
| `images.length - 1` when > 1 | `WhatsNewThumbnail` `extraCount` (+N badge) |
| `showMoreLabel` | `WhatsNewShowMore` label override |
| `id` | `WhatsNewSection` `id` |

| Root field | Child equivalent |
|---|---|
| `title` | `WhatsNewTitle` |
| `description` | `WhatsNewSummary` |
| `versionNumber` | `WhatsNewVersion` |
| `filter` | `WhatsNewFilter` value |
| `dontShowAgain` | `WhatsNewFooter` toggle |

### View modes

| Mode | UI | Enter | Exit |
|---|---|---|---|
| `list` | Main modal body | default / after carousel close | n/a |
| `carousel` | Stacked carousel modal | thumbnail click | carousel X, carousel Close, Escape |

Figma `Preview Single` / `Preview Multiple` = carousel modal states, **not** in-place body swap.

### Runtime API (data model A)

```typescript
type WhatsNewFilter = "newest" | "bookmarked";

interface WhatsNewSectionImage {
  id: string;
  src?: string;          // omit → swap placeholder
  alt?: string;
  label?: string;        // caption e.g. "1. Label" (number prefix stripped in UI)
}

interface WhatsNewSection {
  id: string;
  title: string;
  description: string;
  isBookmarked?: boolean;
  images?: WhatsNewSectionImage[];
  showMoreLabel?: string; // default "Show More"
  linkText?: string;
  linkHref?: string;
}

interface WhatsNewProps {
  open?: boolean;                 // default true
  onOpenChange?: (open: boolean) => void;

  title?: string;                 // default "What's New" (main modal only)
  description?: string;           // main summary row only
  versionNumber?: string;         // main body → `Version: {versionNumber}`

  filter?: WhatsNewFilter;        // default "newest"
  onFilterChange?: (filter: WhatsNewFilter) => void;

  sections?: WhatsNewSection[];

  dontShowAgain?: boolean;
  onDontShowAgainChange?: (value: boolean) => void;

  onClose?: () => void;
  onShowMore?: (sectionId: string, expanded: boolean) => void;
  onSectionBookmarkChange?: (sectionId: string, isBookmarked: boolean) => void;
  onThumbnailClick?: (sectionId: string, imageId?: string) => void;
  onCarouselNavigate?: (sectionId: string, index: number) => void;
  onExpandImage?: (sectionId: string, imageId: string, index: number) => void;
  onCarouselClose?: (sectionId: string) => void;
  onSinglePreviewClose?: (sectionId: string, imageId: string, index: number) => void;
}
```

### Placeholder copy contract (swap tiles)

| Context | Title | Link |
|---|---|---|
| List/strip thumbnail | `Swap image` | `Learn to swap` |
| Hero (carousel) | `Swap image` | `Learn how to swap component` |
| Hero helper | Body 3: "Replace the image by swapping this component with **your local image component**. Use auto layout…" | — |

### Filter + description defaults

| `filter` | Dropdown label | `description` default |
|---|---|---|
| `newest` | `Newest` | `The following updates (features, bug fixes) have recently been made.` |
| `bookmarked` | `Bookmarked` | `The following updates (features, bug fixes) were bookmarked and may be from recent or previous releases/versions.` |

### Figma sample list copy (non-exhaustive)

- Description (Newest): `The following updates (features, bug fixes) have recently been made.`
- Description (Bookmarked filter context): `The following updates (features, bug fixes) were bookmarked and may be from recent or previous releases/versions.`
- Section description opens with VMware Photon / vCLS example; inline link text **guidance to manage**.

## Codegen Contract (Framework-Agnostic Blueprint)

### Canonical public API (Model B)

Exported compound components (names may be prefixed per framework, e.g. `IdsWhatsNew.Section`):

| Export | Role |
|---|---|
| `WhatsNewRoot` / `IdsWhatsNew` | Main dialog + stack state |
| `WhatsNewSection` | Repeatable list row |
| `WhatsNewThumbnail` | List tile (`200×112.5`); opens carousel |
| `WhatsNewSectionHeader` | Bookmark + title row |
| `WhatsNewBookmarkButton` | Star toggle |
| `WhatsNewSectionTitle` | Section heading |
| `WhatsNewDescription` | Body copy slot (supports `WhatsNewLink` child) |
| `WhatsNewLink` | Inline link inside description |
| `WhatsNewImages` | Carousel source container (hidden in list) |
| `WhatsNewImage` | Single carousel slide (`src` or `children`) |
| `WhatsNewHeader`, `WhatsNewTitle`, `WhatsNewSummary`, `WhatsNewBody`, `WhatsNewSectionsScroll`, `WhatsNewFooter` | Optional shell slots; root props may substitute defaults |

Reference implementation: `storybook/src/components/IdsWhatsNew.tsx` + `IdsWhatsNew.compose.ts` (child walker).

### Deterministic structure

**Normalize to this tree** whether the host uses data props or child components (see **Anatomy → Component composition**).

**Main (list):**

1. `WhatsNewRoot`
2. `WhatsNewHeader` → `WhatsNewTitle` + `WhatsNewCloseButton`
3. `WhatsNewSummary`
4. `WhatsNewBody` → `WhatsNewVersionFilterRow` (`WhatsNewVersion?` + `WhatsNewFilter`) → `WhatsNewSectionsScroll` → `WhatsNewSection[]`
5. Each `WhatsNewSection` → `WhatsNewThumbnail` + `WhatsNewSectionHeader` (`WhatsNewBookmarkButton` + `WhatsNewSectionTitle`) + `WhatsNewDescription` (+ `WhatsNewLink?`, `WhatsNewShowMore?`) + `WhatsNewImages` (`WhatsNewImage[]`)
6. `WhatsNewFooter`

**Stacked carousel (internal):**

7. `WhatsNewCarouselModal` → `WhatsNewCarouselHeader` → `WhatsNewCarouselBody` (`WhatsNewCarouselNav?`, `WhatsNewThumbnailStrip?`, `WhatsNewHeroImage`, `WhatsNewCaptionRow`) → `WhatsNewFooter`

**Stacked single preview (internal):**

8. `WhatsNewSinglePreviewModal` → `WhatsNewSinglePreviewHeader` → `WhatsNewSinglePreviewBody` (`WhatsNewHeroImage`, `WhatsNewCaptionRow`) → `WhatsNewFooter`

### Variant / option matrix

| Option | Values |
|---|---|
| `open` | `true` (default) \| `false` |
| `versionNumber` | string \| omitted |
| `filter` | `newest` \| `bookmarked` |
| `section.isBookmarked` | `true` \| `false` |
| carousel modal | open \| closed (thumbnail-driven) |
| carousel layout | single (`images.length === 1`) \| multiple (`> 1`) |

### Per-slot style contract

| Slot | Contract |
|---|---|
| Modal shell | `background: var(--color-background-component)`; `border: 1px solid var(--color-border-accessible)`; shadow-4; square corners |
| Header title | Header 5 / `var(--color-text-neutral-strong)` |
| Close Icon | `Icon` `shapeName="shape-x"` **`variant="img"`** `16×16` — **do not use mask** |
| Expand control | `Icon` `shapeName="popout-double"` **`variant="inline"`** `32×32`; two-tone per table above |
| Carousel nav | `Icon` `shapeName="chev-left"` / `"chev-right"` **`variant="mask"`** `16×16` |
| Filter trigger | `200×32`, square corners, Body 2 |
| Section thumbnail | `200×112.5` list / `184×103` strip; borders per state table |
| Footer Close | IDS Button primary; `border-radius: var(--corner-radius-radius-2)` |
| Dashed section rule | `border-bottom: 1px dashed var(--color-border-light)` |

### Behavior contract

- **Stacked carousel modal** — never replace main list body in-place.
- Root owns `dontShowAgain`; both footers render the same controlled toggle.
- Thumbnail click opens carousel modal; carousel close leaves main open.
- Client-side bookmark filter when `onFilterChange` absent.
- Carousel index clamped; single-image hides strip + chevrons.
- `popout-double` in carousel opens **Single preview** stack (`27437:44151`); `onExpandImage` fires for host.
- Single preview body: hero + caption only (no strip/chevrons).
- Main `onClose` / `onOpenChange(false)` closes all layers.

### Accessibility contract

- Dialog semantics and focus trap as in **Interactions**.
- Close / chevron / expand controls: `aria-label`.
- Toggle: `ariaLabel` + visible label text.
- Active carousel thumbnail: `aria-current="true"`.

### Asset resolution + bundling contract

| Slug | Usage | Size | Icon variant |
|---|---|---:|---|
| `shape-x` | Close on all dialog headers | `16×16` | **`img`** (no mask) |
| `photos` | Thumbnail/hero placeholder; broken-`src` fallback | `32×32` | **`img`** |
| `popout-window-arrow` | List thumbnail hover overlay only | `32×32` | **`inline`** (two-tone: neutral frame + brand arrow) |
| `star-fav` | Section bookmark default | `16×16` | **`img`** |
| `star-fav-solid` | Section bookmark active | `16×16` | **`img`** |
| `popout-double` | Carousel + single-preview expand control | `32×32` | **`inline`** (two-tone: brand frame + neutral arrows) |
| `chev-left` | Carousel previous | `16×16` | **`mask`** + nav button `color` |
| `chev-right` | Carousel next | `16×16` | **`mask`** + nav button `color` |
| `arrow-drop-tri-caret` | Filter caret | `10×10` | per Dropdown Single Select spec |

Resolve from `assets/icons/<slug>.svg` via project `Icon` component. Do **not** substitute `chev-left-thick` / `chev-right-thick` — Figma preview uses **`chev-left`** / **`chev-right`** (`27437:44200`, `27437:44213`).

### Fallback/error rules

- Missing `sections` and no `WhatsNewSection` children → empty list (main header/footer intact).
- Both `sections[]` and `WhatsNewSection` children provided → **`sections[]` wins** (document in implementation); warn in dev.
- `filter="bookmarked"` with zero bookmarked sections → empty list (no error).
- Section with empty/missing `images` → placeholder thumbnail with **`photos`**; carousel shows one placeholder slide.
- Unknown `filter` → treat as `newest`.
- Thumbnail click with no images → carousel with one placeholder slide.
- **`src` load failure** on any thumbnail/hero `<img>` → swap placeholder with **`photos`** icon (same as missing `src`).

### Validation checklist

- [ ] Spec Accurate Design opens main modal (`open` default) with list body
- [ ] Main header: Title row → Summary description → Body version/filter row
- [ ] Thumbnail opens **stacked** carousel modal; main list remains visible underneath
- [ ] Carousel X / carousel Close dismiss carousel only; main stays open
- [ ] Main X / main Close dismiss entire pattern (including carousel if open)
- [ ] Carousel header shows `section.title`; no summary description in carousel
- [ ] Close uses shared `Icon` **`variant="img"`** (not mask)
- [ ] Filter `200×32` square corners; client bookmark filter when uncontrolled
- [ ] `onShowMore(sectionId, expanded)`; 3-line clamp when collapsed
- [ ] `linkText` / `linkHref` inline in section description
- [ ] Root `dontShowAgain` drives both footers
- [ ] Carousel body fills remainder after footer/header (≈523px at design height; shrinks on short viewports)
- [ ] `popout-double` opens stacked single-preview; single Close/X dismisses single layer only
- [ ] Icons: `photos` `32×32`; `popout-window-arrow` hover (brand arrow only); `popout-double` expand (brand frame only); `chev-left`/`chev-right` nav
- [ ] Strip trailing `32×103` viewport overlay (`27437:44208`) on overflow only; gradient via overflow vertical tokens + `corner-radius-radius-none`
- [ ] Semantic tokens only; slot geometry cites live Figma nodes
- [ ] **Canonical compound API exported** (`WhatsNewSection`, `WhatsNewThumbnail`, `WhatsNewDescription`, `WhatsNewImages`, `WhatsNewImage`)
- [ ] Generated examples / Storybook primary story use **child composition**, not `sections[]`
- [ ] `WhatsNewThumbnail` / `WhatsNewDescription` / `WhatsNewImage` slots wired for custom `children` overrides

## Source Mapping

| Source | Mapping |
|---|---|
| Figma file | `0bHk3XhrjFhowgFkz9yLr4` (IDS Design Library) |
| Component set | `WhatsNew-Main` → `27437:44073` |
| Main variants | `27437:44094` (Newest), `27437:44074` (Bookmarked), `27437:44134` (Preview Multiple), `27437:44151` (Preview Single) |
| Elements | `27437:44190` (list content), `27437:44198` (preview content), `27437:44182` (section header), `27437:44220` (filter), `27437:44168` (thumbnail states) |
| Map entry | `data/component-figma-map.json` → `Whats New` |
| Design spec path | `components/ids/whats-new/design-spec.md` |
| Reference implementation | `storybook/src/components/IdsWhatsNew.tsx` |
| Contract mirror | `storybook/src/spec-contracts/ids-whats-new.contract.ts` |
| Verification | Figma MCP — session **2026-07-08** |
