# Get Started Design Spec

## Metadata

| Property | Value |
|---|---|
| Component | Get Started |
| Design system | IDS |
| Category | Patterns |
| Status | active |
| Version | 1.0.0 |
| Description | Full-page onboarding pattern — hero header, horizontal configuration cards, optional overflow navigation, Skip action |
| File key | `0bHk3XhrjFhowgFkz9yLr4` |
| Main component (`GetStarted-Main`) | https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=12189-233235&m=dev — **`12189:233235`** |
| Card element (`.GetStarted-Element-CardState`) | https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=12023-228883&m=dev — **`12023:228883`** |
| Validated nodes | **`12189:233235`**, **`12189:233185`** (Overflow=False, Sequential=False, Single-Page), **`12189:233198`** (Overflow=True, Sequential=False, Page 1 of 2), **`12189:233211`** (Overflow=True, Sequential=False, Page 2 of 2), **`12189:233218`** (Overflow=False, Sequential=True, Single-Page), **`12189:233223`** (Overflow=True, Sequential=True, Page 1 of 2), **`12189:233228`** (Overflow=True, Sequential=True, Page 2 of 2), **`12023:228880`** (Not Completed), **`12023:228902`** (Completed), **`12023:228939`** (Required) |
| Verification method | Figma MCP (`get_metadata`, `get_design_context`, `get_variable_defs`, `disableCodeConnect: true`) — **2026-06-08** |
| Reference implementation | `storybook/src/components/IdsGetStarted.tsx`, `IdsGetStarted.module.css` |
| Storybook | `storybook/src/components/IdsGetStarted.stories.tsx` (title **`IDS/Get Started`** — main story glob; not under `storybook-generated/`) |
| Nested specs | `components/ids/button/design-spec.md` (Configure / Skip buttons), `components/ids/masthead/design-spec.md` (optional embedded masthead) |

## Anatomy

- `GetStartedRoot` — page shell (`surface-1` background)
- `GetStartedMastheadSlot` (optional) — `Masthead-Main` (**`56px`** band, Figma absolute top)
- `GetStartedHeroHeader` — **`272px`** brand hero (honeycomb decorative layer, bottom shadow band, title block)
  - `GetStartedHeroBackground` — `var(--color-background-masthead-brand-base)` fill + honeycomb image (**`15%`** opacity, node **`12189:231404`**) + bottom fade (**`21px`**, `rgba(37,37,37,0)` → `rgba(0,0,0,0.2)`)
  - `GetStartedHeroTitle` — **Header 1** (`48px` / **`58px`** line-height), `var(--color-text-white)`
  - `GetStartedHeroSubtitle` — **Header 6** (`18px` / **`25px`** line-height), `var(--color-text-white)`
- `GetStartedContainer` — card row + Skip (`gap: var(--spacing-space-32, 32px)`)
  - `GetStartedCardTrack` — horizontal card row (`gap: var(--spacing-space-24, 24px)`)
  - `GetStartedOverflowEdge` (when `overflow=true`) — **`157px`** overlay with horizontal gradient + **`double-chev-right`** **`32×32`** affordance
  - `GetStartedSkipButton` — IDS Button primary or disabled per sequential/page rules
- `GetStartedCard` (`.GetStarted-Element-CardState`) — per Figma element **`12023:228883`**
  - `GetStartedCardIconBadge` — circular badge **`top: -33px`**, centered; **`padding: var(--padding-padding-16, 16px)`**; **`32×32`** icon inside
  - `GetStartedCardTitleBand` — **`padding: 58px 10px 24px`**, title **Header 6** `var(--color-text-brand-strong)`; optional **`Required`** label **`var(--color-text-critical)`**
  - `GetStartedCardContentPanel` — `var(--color-background-surface-2)`, border `var(--color-border-accessible)`, **`padding: 24px`**, **`radius: 8px`**
    - `GetStartedCardDescription` — **Body 1** `var(--color-text-neutral)`
    - `GetStartedCardNote` — **Body 2** with **Note:** medium prefix + regular instruction copy
    - `GetStartedCardConfigureButton` — full-width **Configure** (primary or disabled)

## Layout & Measurements

| Region | Figma frame / measurement | Runtime |
|---|---|---|
| Main variant frame | **`1920×995`** (`GetStarted-Main` symbols) | Storybook: **`width/height: 100%`** / **`100dvh`** host; min-height not content-driven |
| Root shell | `gap: 80px` between hero and container | `flex-direction: column` |
| Hero header band | **`272px`** height, full width | `drop-shadow(0 4px 2px rgba(0,0,0,0.25))` on hero host |
| Hero title block | centered; title/subtitle **`gap: 16px`** | absolute **`top: 125px`** in Figma sample |
| Card element | **`321×514`** per symbol (`12023:228880`–`228939`) | fixed card width **`321px`** |
| Card icon badge | **`32×32`** icon; badge offset **`top: -33px`** | `border-radius: var(--corner-radius-radius-round, 999999px)` |
| Card body stack | description ↔ note **`gap: 28px`**; body ↔ Configure **`gap: 120px`** | vertical flex in content panel |
| Card track | inter-card **`gap: 24px`** | horizontal flex; overflow host scrolls when `overflow=true` |
| Overflow overlay | **`157px`** wide; gradient host **`129×720`** rotated; chevron at **`left: 100.5px`**, **`top: 344px`** | Page 1: pinned **right**; Page 2: pinned **left** (container `rotate(180deg)` per Figma) |
| Skip button | below card track, centered | **`padding: 10px 16px`**, radius **`2px`** |

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
| Required label | **Body 2** | `14px` / `20px` — `var(--color-text-critical)` |
| Description | **Body 1** | `var(--font-size-body-1, 16px)` / `var(--font-line-height-line-height-24, 24px)` |
| Note / buttons | **Body 2** | `var(--font-size-body-2, 14px)` / `var(--font-line-height-line-height-20, 20px)` |

### Colors

- `var(--color-background-surface-1)` — page background
- `var(--color-background-masthead-brand-base)` — hero + masthead
- `var(--color-background-surface-2)` — card content panel + incomplete icon badge fill
- `var(--color-background-controls-brand-base)` — primary Configure / enabled Skip
- `var(--color-background-gray-lighter)` — disabled Configure / disabled Skip
- `var(--color-text-white)` — hero copy, primary button labels
- `var(--color-text-brand-strong)` — card titles
- `var(--color-text-neutral)` — body copy
- `var(--color-text-critical)` — Required label
- `var(--color-text-disabled)` — disabled button labels
- `var(--color-border-accessible)` — card borders
- `var(--color-border-disabled)` — disabled button borders
- `var(--color-border-transparent-brand)` — primary button border
- `var(--color-icon-accessible)` — incomplete/required icon tint
- `var(--color-icon-alerting-success)` — completed badge background
- `var(--color-icon-white)` — completed check icon
- Overflow gradient: `var(--color-gradient-overflow-horizontal-start)`, `var(--color-gradient-overflow-horizontal-middle)` (**`46.146%`**), `var(--color-gradient-overflow-horizontal-end)`

## States (Light Theme)

| Slot | State | Background | Border | Text/Icon |
|---|---|---|---|---|
| `GetStartedCard` shell | Not Completed | `var(--color-background-surface-1)` | `1px var(--color-border-accessible)` | title `var(--color-text-brand-strong)` |
| `GetStartedCard` shell | Completed | `var(--color-background-surface-1)` | `1px var(--color-border-accessible)` | title `var(--color-text-brand-strong)` |
| `GetStartedCard` shell | Required | `var(--color-background-surface-1)` | `1px var(--color-border-accessible)` | title + **Required** `var(--color-text-critical)` |
| `GetStartedCardIconBadge` | Not Completed / Required | `var(--color-background-surface-2)` | `1px var(--color-border-accessible)` | icon `var(--color-icon-accessible)` |
| `GetStartedCardIconBadge` | Completed | `var(--color-icon-alerting-success)` | none | `shape-check-thick` `var(--color-icon-white)` |
| `GetStartedCardContentPanel` | all | `var(--color-background-surface-2)` | `1px var(--color-border-accessible)` | body `var(--color-text-neutral)` |
| `GetStartedCardConfigureButton` | enabled | `var(--color-background-controls-brand-base)` | `var(--color-border-transparent-brand)` | `var(--color-text-white)` |
| `GetStartedCardConfigureButton` | disabled (sequential lock) | `var(--color-background-gray-lighter)` | `var(--color-border-disabled)` | `var(--color-text-disabled)` |
| `GetStartedSkipButton` | enabled | `var(--color-background-controls-brand-base)` | `var(--color-border-transparent-brand)` | `var(--color-text-white)` |
| `GetStartedSkipButton` | disabled | `var(--color-background-gray-lighter)` | `var(--color-border-disabled)` | `var(--color-text-disabled)` |

## States (Dark Theme)

Dark theme uses the same semantic tokens as **States (Light Theme)**. Resolved values for `[data-theme="dark"]` / `.ids-theme-dark` live in `components/ids-theme.css`. Duplicate a full Dark matrix only when a row uses different `var(--...)` than Light.

## Interactions

### Behavior & guidelines

- **Configure:** emits `onConfigure(cardId)`; in **`sequential=true`**, only the active sequential card uses enabled primary styling — others use disabled Configure (Figma sequential variants).
- **Skip:** emits `onSkip()`; **disabled** when `sequential=true` and (`overflowPage` is `single` or `page1`); **enabled** on `page2` or when `sequential=false` (Figma `12189:233218` vs `12189:233223`).
- **Sequential titles:** when `sequential=true`, render ordered list prefix on title (Figma `1. SupportAssist` pattern).
- **Overflow:** when `overflow=true`, card track scrolls horizontally; show **`157px`** gradient edge + **`double-chev-right`** on **page1** (right) or **page2** (left, rotated). Chevron triggers `onOverflowNavigate('next'|'prev')`.
- **Masthead:** optional product chrome (`56px`) — delegate to IDS Masthead spec when `showMasthead=true`.

### Accessibility

- Page title in hero uses semantic heading (`h1` for **Get Started**).
- Each card title is a heading (`h2` or `h3` per product hierarchy).
- Configure / Skip are native `<button>` with descriptive `aria-label` including card title where needed.
- Overflow chevron: `aria-label` **Show next cards** / **Show previous cards**; `type="button"`.

## Composition & API (runtime)

### Variants

Maps to Figma `GetStarted-Main` props:

| Prop | Type | Default | Figma axis |
|---|---|---|---|
| `overflow` | `boolean` | `false` | `Overflow` |
| `sequential` | `boolean` | `false` | `Sequential` |
| `overflowPage` | `'single' \| 'page1' \| 'page2'` | `'single'` | `# of Pages` |

### Runtime API

```typescript
type GetStartedCardState = "not-completed" | "completed" | "required";

interface GetStartedCard {
  id: string;
  title: string;
  description: string;
  note: string;
  iconShapeName: string; // assets/icons slug
  cardState?: GetStartedCardState;
}

interface GetStartedProps {
  title?: string;              // default "Get Started"
  subtitle?: string;           // Figma default copy
  cards: GetStartedCard[];
  overflow?: boolean;
  sequential?: boolean;
  overflowPage?: "single" | "page1" | "page2";
  showMasthead?: boolean;
  productName?: string;
  onConfigure?: (cardId: string) => void;
  onSkip?: () => void;
  onOverflowNavigate?: (direction: "prev" | "next") => void;
}
```

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

1. `GetStartedRoot`
2. `GetStartedMastheadSlot?`
3. `GetStartedHeroHeader` → `GetStartedHeroBackground` + title block
4. `GetStartedContainer` → `GetStartedCardTrack` (+ `GetStartedOverflowEdge?`) + `GetStartedSkipButton`
5. `GetStartedCard[]` — stable order from `cards` array

### Variant matrix

- `overflow`: `on | off`
- `sequential`: `on | off`
- `overflowPage`: `single | page1 | page2`
- `cardState` per card: `not-completed | completed | required`

### Per-slot style contract

| Slot | Contract |
|---|---|
| Card shell | `width: 321px`, `border-radius: 8px`, `border: 1px var(--color-border-accessible)`, `background: var(--color-background-surface-1)` |
| Icon badge | `position: absolute`, `top: -33px`, `left: 50%`, `transform: translateX(-50%)`, `padding: 16px`, round |
| Content panel | `padding: 24px`, inner vertical `gap: 120px` between body group and button |
| Body group | `gap: 28px` between description and note |
| Configure | full width; sequential lock uses disabled tokens |
| Overflow edge | `width: 157px`; gradient `linear-gradient(to right, start 0%, middle 46.146%, end 100%)` |

### Behavior contract

- Sequential active index: first incomplete card in array order (index `0` on single-page sequential sample).
- Skip disabled iff `sequential && (overflowPage === 'single' || overflowPage === 'page1')`.
- Overflow navigation does not change card data — viewport/scroll only unless product handles `onOverflowNavigate`.

### Accessibility contract

- See **Interactions → Accessibility**.

### Asset resolution + bundling contract

| Slug | File |
|---|---|
| `wrench-alt-short` | `assets/icons/wrench-alt-short.svg` |
| `mail` | `assets/icons/mail.svg` |
| `gear-arrows` | `assets/icons/gear-arrows.svg` |
| `licenses-ribbon` | `assets/icons/licenses-ribbon.svg` |
| `settings-gear-reset` | `assets/icons/settings-gear-reset.svg` |
| `shape-check-thick` | `assets/icons/shape-check-thick.svg` |
| `double-chev-right` | `assets/icons/double-chev-right.svg` |

Render via shared **`Icon`** (`shapeName`); icon box **`32×32`** in badge.

### Fallback/error rules

- Unknown `cardState` → `not-completed`
- Unknown `overflowPage` → `single`
- Missing `iconShapeName` → omit icon, keep badge chrome
- Empty `cards` → render hero + Skip only (no cards)

### Validation checklist

- [ ] Hero **`272px`**, brand base background, title **48/58** white, subtitle **18/25** white
- [ ] Card **`321×514`** anatomy matches element **`12023:228883`**
- [ ] Three card states: Not Completed, Completed (green badge + check), Required (+ red label)
- [ ] Icon badge **`32×32`**, offset **`top: -33px`**, slugs from Figma sample table
- [ ] Configure full-width; sequential disables non-active cards
- [ ] Skip enabled/disabled per sequential + overflow page rules
- [ ] Overflow overlay **`157px`** + `double-chev-right` on page1 right / page2 left
- [ ] All colors/spacing use `var(--...)` — no hardcoded hex in implementation

## Source Mapping

- Component map: `data/component-figma-map.json` → **Get Started**
- Figma file key: `0bHk3XhrjFhowgFkz9yLr4`
- Live verification: Figma MCP **2026-06-08** on nodes listed in Metadata
