# Get Started Design Spec

## Metadata

| Property | Value |
|---|---|
| Component | Get Started |
| Design system | IDS |
| Category | Patterns |
| Status | active |
| Version | 1.2.0 |
| Spec pattern | `ids-native` |
| Created | 2026-07-09 |
| Updated | 2026-08-20 |
| Description | Full-page onboarding pattern — optional IDS Masthead, brand hero banner, horizontal configuration cards, optional overflow navigation, Skip action |
| File key | `0bHk3XhrjFhowgFkz9yLr4` |
| Component set (`GetStarted-Main`) | https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=12189-233235&m=dev — **`12189:233235`** |
| Default variant (primary) | https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=12189-233185&m=dev — **`12189:233185`** (`Overflow=False`, `Sequential=False`, `Single-Page`) |
| Hero Background frame | https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=12189-231401&m=dev — **`12189:231401`** |
| Card element set (`.GetStarted-Element-CardState`) | https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=12023-228883&m=dev — **`12023:228883`** |
| Embedded Masthead instance | **`12189:231406`** (`Masthead-Main` inside **`12189:233185`**) |
| Validated nodes | **`12189:233235`**, **`12189:233185`**, **`12189:233198`**, **`12189:233211`**, **`12189:233218`**, **`12189:233223`**, **`12189:233228`**, **`12189:231401`**, **`12189:231402`**, **`12189:231403`**, **`12189:231404`**, **`12189:231405`**, **`12023:228883`**, **`12023:228880`** (Not Completed), **`12023:228902`** (Completed), **`12023:228939`** (Required) |
| Verification method | Figma MCP (`get_metadata`, `get_design_context`, `get_variable_defs`, `disableCodeConnect: true`) — last live **2026-07-13** (Background `12189:231401` re-verified); primary set **2026-07-09** |
| Reference implementation | `lib/react/ids/get-started` (React); `lib/angular/ids/get-started` (Angular); Storybook hand port `storybook/src/components/IdsGetStarted.tsx`, `IdsGetStarted.module.css` |
| Storybook | React: `storybook/src/components/IdsGetStarted.stories.tsx` (title **`Spec Generated/IDS/Get Started`**; primary story **`Spec Accurate Design`**). Angular: `storybook-angular/src/components/ids-get-started/` (same meta title; imports lib via `compiled/lib/angular/ids/get-started`) |
| Nested specs | `components/ids/button/design-spec.md` (Configure / Skip buttons — hover/press/focus-visible), `components/ids/masthead/design-spec.md` (embedded top chrome) |

### Masthead composition (Figma-verified)

When `showMasthead=true` (legacy alias: `isHeaderRequired`), render **`Masthead-Main`** (`12189:231406`) as an absolutely positioned **`56px`** band at the top of the hero (`GetStartedMastheadSlot`). Do **not** re-implement masthead chrome — compose the IDS **Masthead** component per `components/ids/masthead/design-spec.md`.

Figma sample on **`12189:233185`** shows a reduced action set vs full Masthead spec:

| Masthead slot | Figma evidence | Notes |
|---|---|---|
| Product logo | `appic-dp-cloud-blue` **`32×32`** (`I12189:231406;10130:29521`) | Optional; pass via Masthead `logo` |
| Product name | `"Product Name"` (`I12189:231406;10130:29522`) | Masthead `productName` |
| Alerts | `alert-bell-16` | No badge in Get Started sample |
| Help | `help-circ-16` | |
| User settings | Initials `"DT"` | Masthead `avatarSlot` |

When `headerActionsDisabled=true`, masthead actions remain **visible** but **non-interactive**: `pointer-events: none`, `aria-disabled="true"` on action buttons and avatar; no dropdown/panel opens. Hero title/subtitle and card Configure actions are unaffected unless product code also gates them.

Pass full Masthead configuration through optional `mastheadProps` (or `mastheadSlot` for complete override). Default Storybook uses Alerts + Help + Avatar only to match Figma **`12189:233185`**.

## Anatomy

- `GetStartedRoot` — page shell (`surface-1` background)
- `GetStartedMastheadSlot` (optional) — embedded **`Masthead-Main`** (`12189:231406`, **`56px`** band, absolute top of hero)
- `GetStartedHeroHeader` — **`272px`** brand hero (Figma **Background** `12189:231401`)
  - `GetStartedHeroBackground` — fill `var(--color-background-masthead-base)` (`12189:231402`)
  - `GetStartedHeroShadowBand` — **`21px`** @ **`top: 251px`**, gradient `rgba(37,37,37,0)` → `rgba(0,0,0,0.2)` (`12189:231403`) — **under** honeycomb
  - `GetStartedHeroHoneycomb` — **hero banner only** (not Masthead); Figma **`HoneyComb 1`** `12189:231404`
    - **Asset:** `assets/images/honeycomb.png` (Figma export; white hex lines on transparent)
    - Wrapper `opacity: 0.15`; inner `<img>` `object-fit: cover; object-position: 50% 50%`; `height: 272px`; `width: 100%`
    - **Do not** use Dev Mode `lightgray` background fallback — it washes brand blue through the transparent PNG
  - `Light` (`12189:231405`) — empty in Figma; no runtime layer
  - `GetStartedMastheadSlot` — opaque brand strip above Background so Masthead never shows the honeycomb
  - `GetStartedHeroTitle` — **Header 1** (`48px` / **`58px`** line-height), `var(--color-text-gray-white)`
  - `GetStartedHeroSubtitle` — **Header 6** (`18px` / **`25px`** line-height), `var(--color-text-gray-white)`
- `GetStartedContainer` — card row + Skip (`gap: var(--spacing-space-32, 32px)`)
  - `GetStartedCardTrack` — horizontal card row (`gap: var(--spacing-space-24, 24px)`); scrollbar **hidden** when overflowing
  - `GetStartedSkipButton` — IDS Button primary or disabled per sequential/page rules; label from `skipButtonText` (default **Skip**)
- `GetStartedOverflowEdge` (when `overflow=true`) — **sibling of Container on Root** (not inside CardTrack) — see **Overflow overlay placement**
  - `GetStartedOverflowGradient` — fade layer; **`width: 100%`** of OverflowEdge
  - `GetStartedOverflowArrow` — Arrow frame (`12189:232211`)
  - `GetStartedOverflowNavButton` — `double-chev-right` **`32×32`** at **`left: 100.5px; top: 344px`**
- `GetStartedCard` (`.GetStarted-Element-CardState`) — per Figma element **`12023:228883`**; wrapped in `GetStartedCardAnchor` for icon-on-border positioning
  - `GetStartedCardIconBadge` — absolutely centered on anchor top edge (`translateY(-50%)`); **64×64px** outer, **32×32** glyph
  - `GetStartedCardTitleBand` — **`padding: 58px 10px 24px`**, title **Header 6** `var(--color-text-brand-strong)`; optional **`Required`** label **`var(--color-text-alerting-critical-base)`**
  - `GetStartedCardContentPanel` — `var(--color-background-surface-secondary)`, border `var(--color-border-gray-neutral-base)`, **`padding: 24px`**, **`radius: 8px`**
    - `GetStartedCardDescription` — **Body 1** `var(--color-text-gray-neutral)`
    - `GetStartedCardNote` — **Body 2** with **Note:** medium prefix + regular instruction copy
    - `GetStartedCardConfigureButton` — full-width; **compose IDS Button** primary/disabled; label from `actionButtonText` (default **Configure**)

## Layout & Measurements

### Slot geometry (Figma-verified)

| Slot / layer | Property | Token / contract | Figma node | Live evidence |
| --- | --- | --- | --- | --- |
| `GetStartedHeroHeader` / Background | border-radius | `var(--corner-radius-radius-none, 0)` | `12189:231401` | `get_metadata` + `get_design_context` **2026-07-13**; radius-none on hero host |
| `GetStartedCard` shell | border-radius | `var(--corner-radius-radius-8, 8px)` | `12023:228880` | `get_variable_defs` → `Corner Radius/radius-8` |
| `GetStartedCardContentPanel` | border-radius | `var(--corner-radius-radius-8, 8px)` | `12023:228842` | `get_variable_defs` on `12023:228880` |
| `GetStartedCardIconBadge` | border-radius | `var(--corner-radius-radius-round, 999999px)` | `12023:228851` | `get_variable_defs` → `Corner Radius/radius-round` |
| `GetStartedCardConfigureButton` | border-radius | `var(--corner-radius-radius-2, 2px)` | `12023:228837` | `get_variable_defs` → `Corner Radius/radius-2` |
| `GetStartedSkipButton` | border-radius | `var(--corner-radius-radius-2, 2px)` | `12023:230250` | `get_design_context` on `12189:233185` |
| `GetStartedMastheadSlot` | border-radius | `0px` (full-width masthead) | `12189:231406` | Masthead spec + `get_design_context` on `12189:233185` |
| `GetStartedOverflowEdge` | width × height | **`157px` × `720px`** | `12189:232209` | `get_metadata` on `12189:233198` |
| `GetStartedOverflowArrow` | padding | `var(--padding-padding-10, 10px)` (content **137×700**) | `12189:232211` | Figma Dev Mode |
| `GetStartedOverflowGradient` | width | **`100%`** of OverflowEdge (do **not** hardcode 129px) | `12189:232210` | Implementation contract |

### Layout table

| Region | Figma frame / measurement | Runtime |
|---|---|---|
| Main variant frame | **`1920×995`** (`GetStarted-Main` symbols) | Storybook: **`width/height: 100%`** / **`100dvh`** host; min-height not content-driven |
| Root shell | `margin-top: 80px` on container (not flex `gap`) | Flex `gap` blocks painting into the hero↔card zone; use **`margin-top: var(--gs-hero-card-gap)`** on `.container` so icon badges can overlap upward |
| Hero ↔ card overlap | Icon badge centered on card top border | Badge outer **`64×64`** (`--gs-icon-badge-size`); glyph **`32×32`**; position **`top: 0; left: 50%; transform: translate(-50%, -50%)`** (do **not** use a separate `top: -33px` rule). `.cardTrack` uses `padding-top` + `margin-top: calc(-1 * var(--gs-icon-badge-half))` cancel pair so `overflow-x: auto` does not clip icons |
| Hero header band | **`272px`** height, full width | `drop-shadow(0 4px 2px rgba(0,0,0,0.25))` on hero host; **`z-index` above Overflow** |
| Hero honeycomb | Figma **`HoneyComb 1`** `12189:231404` in Background `12189:231401`; **`assets/images/honeycomb.png`** | Wrapper `opacity: 0.15` + `<img object-fit: cover; object-position: 50% 50%>`; **no** `lightgray` fallback; **not** on Masthead |
| Hero shadow band | **`21px`** at **`top: 251px`** inside hero | `linear-gradient(to bottom, rgba(37,37,37,0), rgba(0,0,0,0.2))`; paint **under** honeycomb |
| Hero title block | centered; title/subtitle **`gap: var(--spacing-space-16, 16px)`** | absolute **`top: 125px`** in Figma sample (sample Y — keep centered horizontally; do not bind width to 1920) |
| Card element | **`321×514`** per symbol (`12023:228880`–`228939`) | fixed card width **`321px`** |
| Card body stack | description ↔ note **`gap: 28px`**; body ↔ Configure **`gap: 120px`** | vertical flex in content panel |
| Card track | inter-card **`gap: var(--spacing-space-24, 24px)`** | horizontal flex; scrollbar hidden; scroll only when `overflow=true` |
| Skip button | below card track, centered | compose IDS Button; **`padding: var(--padding-padding-10, 10px) var(--padding-padding-16, 16px)`**, radius **`2px`** |

### Overflow overlay placement (Figma-verified — anti-drift)

**Source nodes** (live MCP `get_metadata` / Dev Mode on **`12189:233198`**):

| Layer | Node | Geometry |
|---|---|---|
| Root `GetStarted-Main` | `12189:233198` | **1920 × 995** |
| Header (hero banner) | `12189:232062` | y=**0**, h=**272**; Shadow `12189:232065` at y=251–272 **inside** Header |
| Overflow (right, page 1) | `12189:232209` | x=**1763**, y=**275**, w=**157**, h=**720** |
| Gradient | `12189:232210` | local h=**720**; runtime **`width: 100%`** of OverflowEdge |
| Arrow | `12189:232211` | **157 × 720**; padding **10** → content **137 × 700**; flex center |
| Chevron | `12189:232212` | local **x=100.5, y=344**, **32 × 32** |
| Overflow (left, page 2) | `42682:125703` | same **157 × 720**; **`rotate(180deg)`**; `left: 0` |

**CSS contract (codegen must emit exactly):**

| Property | Value |
|---|---|
| OverflowEdge parent | **Root shell** (`position: relative`) — sibling of Header + Container |
| OverflowEdge `position` | `absolute` |
| OverflowEdge `top` | **`275px`** (Header ends at 272 — do **not** cover Shadow) |
| OverflowEdge `right` (page 1 / canScrollRight) | **`0`** (flush with banner right edge: 1763+157=1920) |
| OverflowEdge `left` (page 2 / canScrollLeft) | **`0`** + `transform: rotate(180deg)` |
| OverflowEdge `width` | **`157px`** |
| OverflowEdge `height` | **`720px`** (fixed — do **not** use `bottom: 0` stretch) |
| OverflowGradient `width` | **`100%`** (do **not** hardcode 129px) |
| OverflowGradient `height` | **`720px`** |
| OverflowArrow | `width: 100%`; `height: 720px`; `padding: 10px`; `display: flex`; justify/align center |
| NavButton | `left: 100.5px`; `top: 344px`; `32×32` |
| Hero `z-index` | **>** OverflowEdge |
| Card-track scrollbar | **hidden** |

**Line diagram — right overlay (page 1):**

```text
GetStartedRoot (1920×995)  position:relative
│
├── Header / Hero          y=0 … 272     z-index ABOVE overflow
│   ├── Brand fill (`12189:231402`)
│   ├── Shadow band (`12189:231403`)   y=251 … 272  ← must stay visible (under honeycomb)
│   ├── honeycomb.png @ 15% + object-cover (`12189:231404`) — hero only; not Masthead
│   ├── MastheadSlot?      y=0 … 56     opaque brand strip (above honeycomb)
│   └── Title / subtitle   top≈125px
│
├── Container              cards + Skip (below hero gap)
│   └── CardTrack          scrollbar:none; scrolls if overflow=true
│
└── OverflowEdge ★         sibling on Root — NOT inside CardTrack
      top:275px  right:0  width:157px  height:720px

      ┌─ OverflowEdge 157×720 ──────────────────────── right:0 ─┐
      │ ┌─ OverflowGradient  width:100%  height:720 ─────────┐ │
      │ │  transparent (toward cards) → solid (outer edge)   │ │
      │ └────────────────────────────────────────────────────┘ │
      │ ┌─ OverflowArrow  width:100%  h:720  padding:10 ─────┐ │
      │ │                 content 137×700                    │ │
      │ │                      ◆ 32×32                       │ │
      │ │               left:100.5  top:344                  │ │
      │ └────────────────────────────────────────────────────┘ │
      └────────────────────────────────────────────────────────┘

Vertical (parent height 995):
  0 ────── Header top
  272 ──── Header bottom (Shadow ends)
  275 ──── OverflowEdge top   ← 3px below Header
  995 ──── OverflowEdge bottom (= 275+720)
```

**Line diagram — left overlay (page 2):**

```text
Same 157×720 box at top:275px, but:
  left: 0
  transform: rotate(180deg)
  Hide when scrollLeft ≈ 0
```

**DOM order:**

```text
GetStartedRoot
  GetStartedHeroHeader (+ MastheadSlot?)
  GetStartedContainer
    GetStartedCardTrack → cards[]
    GetStartedSkipButton
  GetStartedOverflowEdge?          ← after Container; absolute on Root
    GetStartedOverflowGradient     ← width: 100%
    GetStartedOverflowArrow
      GetStartedOverflowNavButton
```

**Visibility (scroll-driven — not `overflowPage`):**

| Condition | Right | Left |
|---|---|---|
| `overflow=false` | hidden | hidden |
| more cards to the right (`remaining > 2`) | show | — |
| scrolled past start (`scrollLeft > 2`) | — | show |
| last card fully visible | hide | — |
| first card fully visible | — | hide |

**Forbidden (drift):**

- OverflowEdge inside CardTrack / CardViewport
- `top: 272` or `top: 0` (covers Header Shadow)
- `bottom: 0` without fixed `height: 720px`
- Hardcoding gradient width to `129px` — use **`width: 100%`**
- Native scrollbar on card track
- Using `overflowPage` to pick left/right overlay (use scroll metrics)

### Variant axes (`GetStarted-Main` **`12189:233235`**)

| Axis | Values |
|---|---|
| `Overflow` | `False` \| `True` |
| `Sequential` | `False` \| `True` |
| `# of Pages` | `Single-Page` \| `Page 1 of 2` \| `Page 2 of 2` |

## Tokens

### Typography

| Slot | Token / Figma style | Size / line-height |
|---|---|---|
| Hero title | **Header 1** | `var(--font-size-header-1, 48px)` / `var(--font-line-height-line-height-58, 58px)` |
| Hero subtitle | **Header 6** | `var(--font-size-header-6, 18px)` / `var(--font-line-height-line-height-25, 25px)` |
| Card title | **Header 6** | `var(--font-size-header-6, 18px)` / `var(--font-line-height-line-height-25, 25px)` — `var(--color-text-brand-strong)` |
| Required label | **Body 2** | `var(--font-size-body-2, 14px)` / `var(--font-line-height-line-height-20, 20px)` — `var(--color-text-alerting-critical-base)` |
| Description | **Body 1** | `var(--font-size-body-1, 16px)` / `var(--font-line-height-line-height-24, 24px)` |
| Note / buttons | **Body 2** | `var(--font-size-body-2, 14px)` / `var(--font-line-height-line-height-20, 20px)` |

### Colors

- `var(--color-background-surface-primary)` — page background
- `var(--color-background-masthead-base)` — hero + masthead
- `var(--color-background-surface-secondary)` — card content panel + incomplete icon badge fill
- `var(--color-background-controls-base)` — primary Configure / enabled Skip
- `var(--color-background-gray-lighter)` — disabled Configure / disabled Skip
- `var(--color-text-gray-white)` — hero copy, primary button labels
- `var(--color-text-brand-strong)` — card titles
- `var(--color-text-gray-neutral)` — body copy
- `var(--color-text-alerting-critical-base)` — Required label
- `var(--color-text-gray-disabled)` — disabled button labels
- `var(--color-border-gray-neutral-base)` — card borders
- `var(--color-border-gray-disabled)` — disabled button borders
- `var(--color-border-brand-transparent-brand)` — primary button border
- `var(--color-icon-gray-neutral-accessible)` — incomplete/required icon tint
- `var(--color-icon-alerting-success-base)` — completed badge background
- `var(--color-icon-gray-white)` — completed check icon
- Overflow gradient: `var(--color-gradient-overflow-horizontal-start)`, `var(--color-gradient-overflow-horizontal-middle)` (**`46.146%`**), `var(--color-gradient-overflow-horizontal-end)`

## States (Light Theme)

| Slot | State | Background | Border | Text/Icon |
|---|---|---|---|---|
| `GetStartedCard` shell | Not Completed | `var(--color-background-surface-primary)` | `1px var(--color-border-gray-neutral-base)` | title `var(--color-text-brand-strong)` |
| `GetStartedCard` shell | Completed | `var(--color-background-surface-primary)` | `1px var(--color-border-gray-neutral-base)` | title `var(--color-text-brand-strong)` |
| `GetStartedCard` shell | Required | `var(--color-background-surface-primary)` | `1px var(--color-border-gray-neutral-base)` | title + **Required** `var(--color-text-alerting-critical-base)` |
| `GetStartedCardIconBadge` | Not Completed / Required | `var(--color-background-surface-secondary)` | `1px var(--color-border-gray-neutral-base)` | icon `var(--color-icon-gray-neutral-accessible)` |
| `GetStartedCardIconBadge` | Completed | `var(--color-icon-alerting-success-base)` | none | `shape-check-thick` `var(--color-icon-gray-white)` |
| `GetStartedCardContentPanel` | all | `var(--color-background-surface-secondary)` | `1px var(--color-border-gray-neutral-base)` | body `var(--color-text-gray-neutral)` |
| `GetStartedCardConfigureButton` | enabled | `var(--color-background-controls-base)` | `var(--color-border-brand-transparent-brand)` | `var(--color-text-gray-white)` |
| `GetStartedCardConfigureButton` | disabled (sequential lock) | `var(--color-background-gray-lighter)` | `var(--color-border-gray-disabled)` | `var(--color-text-gray-disabled)` |
| `GetStartedSkipButton` | enabled | `var(--color-background-controls-base)` | `var(--color-border-brand-transparent-brand)` | `var(--color-text-gray-white)` |
| `GetStartedSkipButton` | disabled | `var(--color-background-gray-lighter)` | `var(--color-border-gray-disabled)` | `var(--color-text-gray-disabled)` |

## States (Dark Theme)

Dark theme uses the same semantic tokens as **States (Light Theme)**. Resolved values for `[data-theme="dark"]` / `.ids-theme-dark` (and program overlays) live in theme CSS:

- `components/ids-theme.css`
- `components/<program>-theme.css` when a program overlays IDS (for example `components/dap-theme.css`)

Duplicate the full state matrix in this section only when a dark row genuinely uses different `var(--...)` references than the corresponding light row.

*(When Light and Dark tables would list identical `var(--...)` cells, keep the matrix under **States (Light Theme)** only and use this pointer section instead of a second table.)*

## Interactions

### Behavior & guidelines

- **Masthead:** optional product chrome (`56px`) — compose IDS **Masthead** when `showMasthead=true`; gate interactivity with `headerActionsDisabled`.
- **Skip:** emits `onSkip()` (legacy alias: `launchModulesAction`); label from `skipButtonText` (default **Skip**, Figma `12023:230250`); tooltip from `skipButtonTooltip`. **Disabled** when `sequential=true` and (`overflowPage` is `single` or `page1`); **enabled** on `page2` or when `sequential=false`.
- **Configure:** emits `onConfigure(card)` (legacy alias: `configureModuleAction`) with full card payload; in **`sequential=true`**, only the active sequential card uses enabled primary styling unless `card.isDisabled=true`.
- **Configure / Skip interaction states:** compose IDS **Button** — hover / press / focus-visible / disabled from `components/ids/button/design-spec.md` (do not invent Get Started–specific button paints).
- **Sequential titles:** when `sequential=true`, render ordered list prefix on title (Figma `1. SupportAssist` pattern): `"{index+1}. {title}"`.
- **Overflow:** when `overflow=true`, card track scrolls horizontally (scrollbar hidden). Overlay placement, dimensions, and visibility: **Layout & Measurements → Overflow overlay placement**. Summary:
  - **Right** (`12189:232209`) while more cards remain — chevron scrolls `next`
  - **Left** (`42682:125703`, `rotate(180deg)`) while scrolled past start — chevron scrolls `prev`
  - Hide each side when that edge’s card is fully visible
  - When `overflow=false`, do **not** enable track scrolling — center all cards
- **Keyboard:** Configure / Skip / overflow nav are focusable `<button>`s; Enter/Space activate. Overflow does not trap focus. Masthead keyboard behavior follows Masthead spec when `headerActionsDisabled=false`.

### Accessibility

- Page title in hero uses semantic heading (`h1` for banner `title`).
- Each card title is a heading (`h2` or `h3` per product hierarchy).
- Configure / Skip are native `<button>`; Configure `aria-label` includes card title when visible label alone is insufficient (e.g. `"Configure SupportAssist"`).
- Disabled Configure / Skip: native `disabled` (or `aria-disabled="true"` + no activation) — not clickable.
- Overflow chevron: `aria-label` **Show next cards** / **Show previous cards**; `type="button"`.
- Honeycomb / shadow decorative layers: `aria-hidden="true"` (no alt text on honeycomb `<img>`).
- When `headerActionsDisabled=true`: masthead actions `aria-disabled="true"` + `pointer-events: none`.
- Root / region: Container `aria-label="Get started configuration cards"` (or equivalent).

## Composition & API (runtime)

### Variants

Maps to Figma `GetStarted-Main` props:

| Prop | Type | Default | Figma axis |
|---|---|---|---|
| `overflow` | `boolean` | `false` | `Overflow` |
| `sequential` | `boolean` | `false` | `Sequential` |
| `overflowPage` | `'single' \| 'page1' \| 'page2'` | `'single'` | `# of Pages` |

### Runtime API

Canonical names below align with Figma and Storybook. **Legacy production aliases** (from existing coded component) are documented for migration — prefer canonical names in new code.

#### Parent inputs

| Prop | Type | Default | Description |
|---|---|---|---|
| `title` | `string` | `"Get Started"` | Hero banner title (legacy `bannerTitle`) |
| `subtitle` | `string` | `"Pre-configure key areas within the product below before launching the application."` | Hero banner description (legacy `bannerDescription`) |
| `cards` | `GetStartedCard[]` | required | Configuration cards in render order |
| `showMasthead` | `boolean` | `true` | Show embedded Masthead (`isHeaderRequired`) |
| `headerActionsDisabled` | `boolean` | `false` | When masthead shown, disable masthead action clicks |
| `mastheadProps` | `MastheadProps` | sample defaults | Passed to IDS Masthead (`productName`, `logo`, slots) |
| `mastheadSlot` | `RenderableNode` | — | Full masthead override (replaces default composition) |
| `skipButtonText` | `string` | `"Skip"` | Bottom primary action label (**not** "Launch" in Figma; `launchButtonText`) |
| `skipButtonTooltip` | `string` | — | Tooltip for Skip button (`launchButtonTooltip`) |
| `overflow` | `boolean` | `false` | Horizontal card overflow mode |
| `sequential` | `boolean` | `false` | Sequential configure lock |
| `overflowPage` | `'single' \| 'page1' \| 'page2'` | `'single'` | Overflow viewport page |

#### Parent outputs

| Event | Payload | Legacy alias | When |
|---|---|---|---|
| `onSkip` | `void` | `launchModulesAction` | Skip button activated (enabled state only) |
| `onConfigure` | `GetStartedCard` | `configureModuleAction` | Card Configure activated (enabled state only) |
| `onOverflowNavigate` | `{ direction: 'prev' \| 'next' }` | — | Overflow chevron clicked |

#### `GetStartedCard`

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | `string \| number` | yes | Stable card key; prefer `string` for codegen |
| `title` | `string` | yes | Card heading |
| `description` | `string` | yes | Body copy (`text` in legacy API) |
| `note` | `string` | no | Instruction note below description |
| `icon` | `string` | no | Icon slug (`assets/icons/<slug>.svg`; legacy `iconShapeName`). Prefer present for Spec Accurate Design; omit glyph if missing |
| `cardState` | `GetStartedCardState` | no | Derived when omitted — see below |
| `isDisabled` | `boolean` | no | When `true`, Configure always disabled (independent of sequential lock) |
| `isRequired` | `boolean` | no | Legacy flag; sets `cardState: 'required'` when `cardState` omitted |
| `isConfigured` | `boolean` | no | Legacy flag; sets `cardState: 'completed'` when `cardState` omitted |
| `actionButtonText` | `string` | no | Configure label; default **Configure** |
| `actionButtonTextIfConfigured` | `string` | no | Optional override when completed — **Figma keeps "Configure"** on completed state (`12023:228902`); use only for product-specific relabel |
| `configureButtonTooltip` | `string` | no | Tooltip on Configure (`btnTooltip`) |

```typescript
type GetStartedCardState = "not-completed" | "completed" | "required";

interface GetStartedCard {
  id: string | number;
  title: string;
  description: string; // alias: text
  note?: string;
  icon?: string; // alias: iconShapeName; omit glyph if missing
  cardState?: GetStartedCardState;
  isDisabled?: boolean;
  isRequired?: boolean;
  isConfigured?: boolean;
  actionButtonText?: string;
  actionButtonTextIfConfigured?: string;
  configureButtonTooltip?: string;
}

interface GetStartedProps {
  title?: string;
  subtitle?: string;
  cards: GetStartedCard[];
  showMasthead?: boolean;
  headerActionsDisabled?: boolean;
  mastheadProps?: MastheadProps;
  mastheadSlot?: RenderableNode;
  skipButtonText?: string;
  skipButtonTooltip?: string;
  overflow?: boolean;
  sequential?: boolean;
  overflowPage?: "single" | "page1" | "page2";
  onSkip?: () => void;
  onConfigure?: (card: GetStartedCard) => void;
  onOverflowNavigate?: (direction: "prev" | "next") => void;
}
```

#### Card state derivation

When `cardState` is omitted, resolve in order:

1. `isRequired === true` → `required`
2. `isConfigured === true` → `completed`
3. otherwise → `not-completed`

If both `cardState` and legacy flags are provided, **`cardState` wins**.

#### Configure enabled logic

```
configureEnabled =
  !card.isDisabled
  && (!sequential || cardIndex === activeSequentialIndex)
```

`activeSequentialIndex` = index of first card where `cardState !== 'completed'`, else `0`.

### Spec Accurate Design story defaults

Matches Figma **`12189:233185`**:

- `showMasthead: true`, `productName: "Product Name"` (via default masthead)
- `title: "Get Started"`
- `subtitle: "Pre-configure key areas within the product below before launching the application."`
- `overflow: false`, `sequential: false`, `overflowPage: "single"`
- Five sample cards per table below; all `cardState: "not-completed"`
- `skipButtonText: "Skip"` (enabled)

### Figma sample cards (non-sequential single-page **`12189:233185`**)

| # | Title | Icon slug (`shapeName`) |
|---|---|---|
| 1 | SupportAssist | `wrench-alt-short` |
| 2 | Email | `mail` |
| 3 | AutoSupport | `gear-arrows` |
| 4 | License | `licenses-ribbon` |
| 5 | Disaster Recovery | `settings-gear-reset` |

Placeholder copy for description/note matches Figma element **`12023:228880`** (SupportAssist sample strings).

## Codegen Contract (Framework-Agnostic Blueprint)

### Deterministic structure

Required DOM order (codegen must emit this sequence):

1. `GetStartedRoot` (`position: relative`)
2. `GetStartedHeroHeader` (`height: 272px`; `z-index` **>** OverflowEdge)
   1. `GetStartedHeroBackground` — brand fill only
   2. `GetStartedHeroShadowBand` — under honeycomb
   3. `GetStartedHeroHoneycomb` — `opacity: 0.15` + `<img object-fit: cover>` (`aria-hidden`)
   4. `GetStartedMastheadSlot?` — when `showMasthead=true`; opaque; compose Masthead
   5. `GetStartedHeroTitle` + `GetStartedHeroSubtitle`
3. `GetStartedContainer`
   1. `GetStartedCardTrack` → `GetStartedCardAnchor` → `GetStartedCard`[] (icon badge + title band + content panel + Configure)
   2. `GetStartedSkipButton`
4. `GetStartedOverflowEdge?` (absolute on Root; **after** Container; only when `overflow=true` and scroll metrics require it)
   1. `GetStartedOverflowGradient` (`width: 100%`)
   2. `GetStartedOverflowArrow` → `GetStartedOverflowNavButton`

Overflow placement details: **Layout & Measurements → Overflow overlay placement**.

### Variant matrix

Valid combinations (all supported):

| `overflow` | `sequential` | `overflowPage` | Notes |
|---|---|---|---|
| `false` | `false` | `single` | Default Spec Accurate Design |
| `false` | `true` | `single` | Skip disabled; sequential Configure lock |
| `true` | `false` | `page1` \| `page2` \| `single` | Scroll-driven overlays; `overflowPage` labels Figma only |
| `true` | `true` | `page1` | Skip disabled; sequential lock |
| `true` | `true` | `page2` | Skip enabled; sequential lock |

Per-card `cardState`: `not-completed | completed | required` (independent of axes above).

### Per-slot style contract

| Slot | Contract |
|---|---|
| Hero background | Figma Background `12189:231401`: brand fill → shadow → honeycomb `@0.15` + `object-cover` (no `lightgray`); Masthead opaque above |
| Hero title / subtitle | White text tokens; gap `var(--spacing-space-16, 16px)`; title Header 1; subtitle Header 6 |
| Card shell | `width: 321px`, `border-radius: var(--corner-radius-radius-8, 8px)`, `border: 1px var(--color-border-gray-neutral-base)`, `background: var(--color-background-surface-primary)` |
| Icon badge | Outer `64×64`; glyph `32×32`; `top: 0; left: 50%; transform: translate(-50%, -50%)`; round radius token |
| Content panel | `padding: 24px`, inner vertical `gap: 120px` between body group and button; surface-2 + accessible border |
| Body group | `gap: 28px` between description and note |
| Configure / Skip | Compose IDS Button (full-width Configure); sequential lock / Skip rules use disabled tokens from Light states |
| OverflowEdge | Root sibling; `top: 275px`; `right: 0` or `left: 0`+`rotate(180deg)`; **`157×720`**; hero z-index above |
| OverflowGradient | **`width: 100%`**; `height: 720px`; horizontal fade using overflow gradient tokens (transparent toward cards → solid at outer edge) |
| OverflowArrow | `width: 100%`; `height: 720px`; `padding: var(--padding-padding-10, 10px)`; flex center |
| OverflowNavButton | `left: 100.5px`; `top: 344px`; `32×32`; icon `double-chev-right` |

### Behavior contract

- Sequential active index: first card where `cardState !== 'completed'` (index `0` when all completed).
- Skip disabled iff `sequential && (overflowPage === 'single' || overflowPage === 'page1')`.
- Skip label defaults to **Skip** (Figma `12023:230250`); do not default to "Launch".
- Configure label defaults to **Configure** for all card states including completed (Figma `12023:228902`).
- `headerActionsDisabled` affects masthead only; does not auto-disable card Configure or Skip.
- Overflow overlays: scroll-driven visibility per **Overflow overlay placement**; no native scrollbar; scroll step ≈ one card width + gap (`321 + 24`).
- `overflowPage` remains for sequential **Skip** enablement and Figma page labeling only — never choose overlay side from `overflowPage`.
- Runtime stays interactive; forced `data-state` attributes are demo/testing-only and must not block interaction.

### Accessibility contract

| Requirement | Contract |
|---|---|
| Hero title | `<h1>` (or role equivalent) with `title` text |
| Card titles | Heading level below hero (`h2`/`h3`) |
| Configure | `<button>`; include card title in accessible name when needed |
| Skip | `<button>`; native `disabled` when Skip disabled rule applies |
| Overflow nav | `<button type="button">` with **Show next cards** / **Show previous cards** |
| Decorative | Honeycomb + shadow `aria-hidden="true"`; honeycomb `alt=""` |
| Masthead gate | `headerActionsDisabled` → `aria-disabled="true"` + no pointer activation on masthead actions |
| Keyboard | Tab to Configure / Skip / overflow; Enter/Space activate; no focus trap |

### Asset resolution + bundling contract

| Slug / role | File | Usage |
|---|---|---|
| **`honeycomb`** (hero pattern) | **`assets/images/honeycomb.png`** | Figma Background `12189:231401` / **`HoneyComb 1`** `12189:231404` — white hex lines on transparent; wrapper `opacity: 0.15`; `<img object-fit: cover>`; `height: 272px`; `width: 100%`; **do not** apply to Masthead; **do not** use Dev Mode `lightgray` fallback |
| `wrench-alt-short` | `assets/icons/wrench-alt-short.svg` | Card icon (sample) |
| `mail` | `assets/icons/mail.svg` | Card icon (sample) |
| `gear-arrows` | `assets/icons/gear-arrows.svg` | Card icon (sample) |
| `licenses-ribbon` | `assets/icons/licenses-ribbon.svg` | Card icon (sample) |
| `settings-gear-reset` | `assets/icons/settings-gear-reset.svg` | Card icon (sample) |
| `shape-check-thick` | `assets/icons/shape-check-thick.svg` | Completed card badge |
| `double-chev-right` | `assets/icons/double-chev-right.svg` | Overflow nav chevron |
| `appic-dp-cloud-blue` | `assets/icons/appic-dp-cloud-blue.svg` | Default masthead product logo (sample) |

Card / chrome icons: render via shared **`Icon`** (`shapeName`); icon box **`32×32`** in badge (masthead actions **16×16**).

**Hero background paint order (bottom → top)** — Figma Background `12189:231401`:

1. Brand fill — `var(--color-background-masthead-base)` (`12189:231402`)
2. Shadow band — `21px` at `top: 251px` (`12189:231403`)
3. **`honeycomb.png`** — wrapper `opacity: 0.15`; `<img object-fit: cover>` (`12189:231404`); **hero only**
4. Masthead (optional) — opaque brand strip; **no honeycomb styles**
5. Title / subtitle copy

**Bundling:** ship `assets/images/honeycomb.png` with the component package; do not substitute a CSS-only pattern or a differently named file.

### Fallback/error rules

- Unknown `overflow` / `sequential` → `false`
- Unknown boolean props → `false`
- Missing `title` → `"Get Started"`
- Missing `subtitle` → Spec Accurate Design default string
- Missing `honeycomb.png` → keep brand fill + shadow band only (log / QA fail — pattern required for Spec Accurate Design)
- Unknown `cardState` → `not-completed`
- Unknown `overflowPage` → `single`
- Missing `icon` / `iconShapeName` or missing icon file → omit glyph, keep badge chrome
- Empty `cards` → render hero + Skip only (no cards; no overflow overlay)
- Unknown event handlers → no-op (buttons remain interactive unless disabled by rules)

### Validation checklist

- [ ] Hero **`272px`**, Background `12189:231401` paint order (brand → shadow → honeycomb `@0.15` + `object-cover`, **no** `lightgray`); Masthead has **no** honeycomb; title **48/58** white, subtitle **18/25** white
- [ ] Card **`321×514`** anatomy matches element **`12023:228883`**
- [ ] Three card states: Not Completed, Completed (green badge + check), Required (+ red label)
- [ ] Icon badge outer **`64×64`**, glyph **`32×32`**, `translate(-50%, -50%)` on card top; slugs from Figma sample table
- [ ] Configure full-width; sequential disables non-active cards
- [ ] Skip enabled/disabled per sequential + overflow page rules
- [ ] OverflowEdge: Root sibling; **`157×720`**; `top: 275px`; `right: 0` / `left: 0`+rotate; Gradient **`width: 100%`**; chevron at **100.5×344**; no scrollbar; does not cover Header Shadow
- [ ] Spec Accurate Design (`overflow=false`) shows all cards centered — no mid-card clipping / track scroll
- [ ] Overflow placement matches **Overflow overlay placement** diagram (DOM order + forbidden list)
- [ ] **Slot geometry (Figma-verified)** table complete with cited nodes
- [ ] Masthead composes IDS Masthead (`12189:231406`); `headerActionsDisabled` gates action clicks only
- [ ] Runtime API: `onConfigure` emits full card; `onSkip` for bottom action; `skipButtonText` default **Skip**
- [ ] Legacy aliases documented (`bannerTitle`, `launchButtonText`, `configureModuleAction`, etc.)
- [ ] All colors/spacing use `var(--...)` — no hardcoded hex in implementation
- [ ] Spec Accurate Design story under `Spec Generated/IDS/Get Started`

## Source Mapping

- Component map: `data/component-figma-map.json` → **Get Started**
- Figma file key: `0bHk3XhrjFhowgFkz9yLr4`
- Live verification: Figma MCP — primary variants **2026-07-09**; Background `12189:231401` (+ `231402`–`231405`) re-verified **2026-07-13**
- Primary variant: **`12189:233185`**; component set: **`12189:233235`**
- Hero Background: **`12189:231401`**
- Masthead instance: **`12189:231406`**
- Overflow right: **`12189:232209`** on **`12189:233198`**; overflow left: **`42682:125703`** on **`12189:233211`**
- Card element set: **`12023:228883`**
- Runtime contract: `component-contracts/ids/get-started.contract.ts`
- Reference implementation (React): `lib/react/ids/get-started/`
- Reference implementation (Angular): `lib/angular/ids/get-started/`
- Storybook (React): `storybook/src/components/IdsGetStarted.stories.tsx`
- Storybook (Angular): `storybook-angular/src/components/ids-get-started/`
