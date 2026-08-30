# Masthead Design Spec

## IDS baseline (layout, flow, contracts)

Synapse **Masthead** shares the IDS **Masthead** component family (`Masthead-Main`). Slot order, composed `iconsSlot` / HeaderActions pattern, `MastheadActionIconButton` + badge contract, App Launcher integration, and avatar chip geometry match IDS unless noted in **Synapse programme deltas** below.

- **IDS source of truth:** [`components/ids/masthead/design-spec.md`](../ids/masthead/design-spec.md)
- **Reference implementation:** `storybook/src/components/SynapseMasthead.tsx`, `SynapseMasthead.module.css`
- **Synapse menu primitives:** `SynapseMastheadHelpMenu.tsx`, `SynapseMastheadUserMenu.tsx`
- **App Shell composition:** [`components/synapse/app-shell/design-spec.md`](../app-shell/design-spec.md) → `headerActions` → `iconsSlot`

### Synapse programme deltas (vs IDS)

| Topic | IDS | Synapse |
|---|---|---|
| Figma file | IDS Design Library (`0bHk3XhrjFhowgFkz9yLr4`) | Synapse Hi-Fi (`Td1bnsvRj1PCGs9RVJkIvJ`) |
| Root background | Solid `var(--color-background-masthead-brand-base)` | **`var(--color-background-surface-1)`** + horizontal gradient `var(--color-background-gradient-masthead-start)` → `var(--color-background-gradient-masthead-end)` (`47807:7569`) |
| Bottom border token | `var(--color-border-transparent-neutral)` | **`var(--color-border-transparent-neutral-light)`** |
| Product name typography | Header 6 (18px / 32px line) in reference CSS | **Same tokens** — `var(--font-size-header-6)` / `var(--font-line-height-line-height-32)` |
| Default sample product name | `"Product Name"` | **`"Synapse"`** (`47807:7569`, Page Layout `48463:143536`) |
| Default `iconsSlot` sample | Search, Alerts, Jobs, Settings, Help (5 icons) | **Help only** in canonical Page Layout; full strip available as optional story (`50154:68499`) |
| Action hit area | Padding `19px` × `16px` (auto width) | **Fixed `48px` width** (`var(--sizing-size-48)`), padding `var(--padding-padding-20)` / `var(--padding-padding-16)` |
| Action border-radius | `0` in reference CSS | **`0`** (`var(--corner-radius-radius-none)`) — same |
| Avatar trigger padding | `11px` × `8px` (IDS) | **`12px` × `8px`** (`var(--padding-padding-12)` / `var(--padding-padding-8)`) |
| Help menu dropdown | IDS settings-style menus (product-specific) | **`SynapseMastheadHelpMenu`** — About, Get Started (`51829:85983`) |
| User account menu | `MastheadAvatar` + host menu | **`SynapseMastheadUserMenu`** — 250px panel (`49989:83672`); icon-only avatar variant (`50024:244160`) |
| Dark theme action default bg | `masthead-brand-base` | **`transparent`** on icon/avatar triggers (`50154:68499` row Default) |
| Dark theme action hover bg | `masthead-brand-strong` | **`var(--color-background-controls-brand-strong)`** (`50154:68499` row Hover) |
| Dark theme root gradient | N/A (solid) | Start `rgba(0,118,206,0.50)` → end `rgba(19,21,25,0.10)` in `synapse-theme.css` |
| Theme CSS | `components/ids-theme.css` | **`components/synapse-theme.css`** |

## Metadata

| Property | Value |
|---|---|
| Component | Masthead |
| Design system | Synapse |
| Category | Navigation |
| Spec pattern | **ids-fork** |
| IDS baseline slug | `masthead` |
| Status | **active** |
| Version | 1.0.0 |
| Description | Application header: brand + composed utility actions + App Launcher + user avatar. Inherits IDS Masthead slot API and composition contracts. |
| Theme CSS | `components/synapse-theme.css` |
| Figma file | [Synapse Hi-Fi components](https://www.figma.com/design/Td1bnsvRj1PCGs9RVJkIvJ/Synapse-Hi-Fi-components) |
| File key | `Td1bnsvRj1PCGs9RVJkIvJ` |
| Main component | `Masthead-Main` (`47807:7569`) — `1920×56` |
| Scenarios board | `47807:7570` |
| Verification method | Figma MCP (`get_metadata`, `get_design_context`, `get_variable_defs`) |
| Last verified | 2026-06-17 |
| Reference implementation | `storybook/src/components/SynapseMasthead.tsx`, `SynapseMasthead.module.css` |
| Storybook | `storybook-generated/synapse/src/components/Masthead.stories.tsx` |
| Storybook meta title | `Spec Generated/Synapse/Masthead` |
| Registry | `data/programme-inheritance-registry.json` → `programme: synapse`, `slug: masthead` |

### Figma nodes (live-verified)

| Node | Role |
|---|---|
| [`47807:7569`](https://www.figma.com/design/Td1bnsvRj1PCGs9RVJkIvJ/Synapse-Hi-Fi-components?node-id=47807-7569&m=dev) | **Spec Accurate Design** — Synapse + Help + App Launcher + avatar `YK` |
| [`49852:73090`](https://www.figma.com/design/Td1bnsvRj1PCGs9RVJkIvJ/Synapse-Hi-Fi-components?node-id=49852-73090&m=dev) | `Masthead-Element-Actions` component set (Help, App Launcher icon types) |
| [`49852:73083`](https://www.figma.com/design/Td1bnsvRj1PCGs9RVJkIvJ/Synapse-Hi-Fi-components?node-id=49852-73083&m=dev) | `Masthead-Element-UserInitials` |
| [`50154:68499`](https://www.figma.com/design/Td1bnsvRj1PCGs9RVJkIvJ/Synapse-Hi-Fi-components?node-id=50154-68499&m=dev) | Action state matrix (search → avatar; Default / Hover / Active / Focus) |
| [`51829:85983`](https://www.figma.com/design/Td1bnsvRj1PCGs9RVJkIvJ/Synapse-Hi-Fi-components?node-id=51829-85983&m=dev) | Help menu open (About, Get Started) |
| [`49989:83672`](https://www.figma.com/design/Td1bnsvRj1PCGs9RVJkIvJ/Synapse-Hi-Fi-components?node-id=49989-83672&m=dev) | User menu — initials avatar + highlighted email row |
| [`50024:244160`](https://www.figma.com/design/Td1bnsvRj1PCGs9RVJkIvJ/Synapse-Hi-Fi-components?node-id=50024-244160&m=dev) | User menu — icon avatar variant |
| [`48463:143536`](https://www.figma.com/design/Td1bnsvRj1PCGs9RVJkIvJ/Synapse-Hi-Fi-components?node-id=48463-143536&m=dev) | Page Layout composed masthead instance |

## Anatomy

Inherits IDS [`Masthead` anatomy](../ids/masthead/design-spec.md#anatomy). Deterministic slot order:

1. **`MastheadRoot`** — `<header>`, full width, `56px` height
2. **`MastheadBrandSlot`** — optional `logo` + required `productName`
3. **`MastheadActionsRow`** — right-aligned flex row (`54px` inner height in reference impl)
   1. **`iconsSlot`** — composed utility actions (host projection)
   2. **`appLauncherSlot`** — App Launcher trigger (`SynapseAppLauncher`, `triggerVariant="masthead"`)
   3. **`avatarSlot`** — user avatar / account control (required)

### Composed `iconsSlot` (HeaderActions pattern)

Same contract as IDS — see [`ids/masthead/design-spec.md` → Composed `iconsSlot`](../ids/masthead/design-spec.md#composed-iconsslot-headeractions-pattern).

**No root `onMastheadAction`.** Each child owns `onClick` / menu `openChange`. App Shell maps `headerActions` → `iconsSlot`.

**Synapse recommended primitives inside `iconsSlot`:**

| Primitive | Use |
|---|---|
| `SynapseMastheadActionButtonContainer` | Horizontal cluster wrapper |
| `SynapseMastheadActionIconButton` | Icon button + optional badge |
| `SynapseMastheadHelpMenu` | Help dropdown (About, Get Started) |

**Figma Spec Accurate sample (`47807:7569`):** Help only inside `iconsSlot`; App Launcher and avatar are separate slots.

**Optional full strip sample (`50154:68499`, Storybook `FullActionStrip`):** Search → Alerts (badge) → Jobs (badge) → Settings → Help → App Launcher → Avatar.

## Layout & Measurements

Inherits IDS shell geometry from [`ids/masthead/design-spec.md` → Layout & Measurements](../ids/masthead/design-spec.md#layout--measurements) except:

| Element | Synapse contract |
|---|---|
| `MastheadRoot` height | `var(--sizing-size-56)` / `var(--scale-56)` — **56px** |
| `MastheadRoot` padding | `0 var(--padding-padding-8) 0 var(--padding-padding-16)` |
| `MastheadRoot` background | `var(--color-background-surface-1)` + `linear-gradient(90deg, var(--color-background-gradient-masthead-start), var(--color-background-gradient-masthead-end))` |
| `MastheadRoot` bottom border | `var(--border-width-border-default)` solid `var(--color-border-transparent-neutral-light)` |
| `productName` | Header 6 — `var(--font-size-header-6)`, line-height `var(--font-line-height-line-height-32)`, weight 400, `var(--color-text-white)` |
| `SynapseMastheadActionIconButton` | width `var(--sizing-size-48)`; padding `var(--padding-padding-20)` `var(--padding-padding-16)`; icon glyph `16×16` |
| `SynapseMastheadAvatar` trigger | padding `var(--padding-padding-12)` `var(--padding-padding-8)` |
| Avatar chip | `32×32` circle, `var(--border-width-border-default)` solid `var(--color-border-white)` |
| Badge wrapper | `position: absolute; top: 12px; left: 23px` (parent `position: relative`) |
| Focus ring (actions + avatar) | `var(--border-width-border-default)` dashed `var(--color-border-white)`, `outline-offset: -1px` — action elements only |
| Help menu panel | Detached dropdown below trigger; default options About / Get Started |
| User menu panel | **250px** fixed width (`SynapseMastheadUserMenu`) |

Sample frame width `1920px` is reference-only; runtime uses `width: 100%`.

## Tokens

### Surfaces and chrome

- `var(--color-background-surface-1)` — masthead base under gradient
- `var(--color-background-gradient-masthead-start)` / `var(--color-background-gradient-masthead-end)` — horizontal brand wash
- `var(--color-background-masthead-brand-base)` — action default (light theme)
- `var(--color-background-masthead-brand-strong)` — action hover / open+hover (light)
- `var(--color-background-masthead-brand-stronger)` — action active / `aria-expanded`
- `var(--color-background-controls-brand-strong)` — action hover (dark theme)
- `var(--color-border-transparent-neutral-light)` — masthead bottom border
- `var(--color-border-white)` — avatar ring, focus ring, badge border

### Typography and icons

- Product name: `var(--color-text-white)`, Header 6 tokens (see Layout)
- Action icons: **`var(--color-icon-white)`** (not `var(--color-text-white)`)
- Avatar initials: Body 2 — `var(--font-size-body-2)`, line-height `var(--font-line-height-line-height-20)`, `font-variation-settings: 'wdth' 100`

### Badges (when composed)

- Critical: `var(--color-background-alerting-critical)` — Alerts
- Success: `var(--color-background-alerting-success)` or `var(--color-background-alerting-success-1)` in dark matrix — Jobs
- Badge text: `var(--color-text-white)`, `var(--font-size-body-3)` (12px)
- Cap display at `"99+"` when count > 99

Global token catalog: `components/synapse-theme.css`, `components/synapse/root-spec.md`.

## States (Light Theme)

| Element | Background | Border | Text | Icon |
|---|---|---|---|---|
| Masthead container | gradient + `var(--color-background-surface-1)` | bottom `var(--color-border-transparent-neutral-light)` | — | — |
| Brand / product name | transparent (gradient shows through) | none | `var(--color-text-white)` | `var(--color-icon-white)` (logo) |
| Action icon button (default) | `var(--color-background-masthead-brand-base)` | none | — | `var(--color-icon-white)` |
| Action icon button (hover) | `var(--color-background-masthead-brand-strong)` | none | — | `var(--color-icon-white)` |
| Action icon button (active / `aria-expanded`) | `var(--color-background-masthead-brand-stronger)` | none | — | `var(--color-icon-white)` |
| Action icon button (open + hover) | `var(--color-background-masthead-brand-strong)` | none | — | `var(--color-icon-white)` |
| Action icon button (focus-visible) | `var(--color-background-masthead-brand-base)` | dashed inset `var(--color-border-white)` | — | `var(--color-icon-white)` |
| Avatar trigger (default) | `var(--color-background-masthead-brand-base)` | none | `var(--color-text-white)` (initials) | `var(--color-icon-white)` |
| Avatar trigger (hover) | `var(--color-background-masthead-brand-strong)` | none | `var(--color-text-white)` | `var(--color-icon-white)` |
| Avatar trigger (active / `aria-expanded`) | `var(--color-background-masthead-brand-stronger)` | none | `var(--color-text-white)` | `var(--color-icon-white)` |
| Avatar chip | transparent | `var(--color-border-white)` | `var(--color-text-white)` | — |
| Badge (critical) | `var(--color-background-alerting-critical)` | `var(--color-border-white)` | `var(--color-text-white)` | — |
| Badge (success) | `var(--color-background-alerting-success)` | `var(--color-border-white)` | `var(--color-text-white)` | — |

Evidence: `50154:68499` (light rows use masthead-brand-* progression); canonical frame `47807:7569`.

## States (Dark Theme)

Most rows inherit the same **semantic token names** as Light; resolved values live in `components/synapse-theme.css` under `[data-theme="dark"]`.

Rows that **genuinely differ** from Light (verified `50154:68499` on dark surface):

| Element | Background | Border | Notes |
|---|---|---|---|
| Masthead container | gradient (`masthead-start` 50% blue → `masthead-end` 10% dark) over `var(--color-background-surface-1)` | bottom `var(--color-border-transparent-neutral-light)` | Synapse-only gradient |
| Action icon button (default) | **transparent** | none | Not `masthead-brand-base` fill |
| Action icon button (hover) | **`var(--color-background-controls-brand-strong)`** | none | Not `masthead-brand-strong` |
| Action icon button (active / `aria-expanded`) | `var(--color-background-masthead-brand-stronger)` | none | Same token as Light |
| Action icon button (focus-visible) | `var(--color-background-masthead-brand-base)` | dashed inset `var(--color-border-white)` | Focus row in matrix |
| Avatar trigger (default) | **transparent** | none | Matches action default |
| Avatar trigger (hover) | **`var(--color-background-controls-brand-strong)`** | none | |
| Avatar trigger (active / `aria-expanded`) | `var(--color-background-masthead-brand-stronger)` | none | |
| Badge (success) | `var(--color-background-alerting-success-1)` | `var(--color-border-white)` | Dark matrix binding |

## Interactions

Inherits IDS interaction contract from [`ids/masthead/design-spec.md` → Interactions](../ids/masthead/design-spec.md#interactions) unless noted.

### Synapse-specific behavior

- **`SynapseMastheadHelpMenu`:** Base UI `Menu`; trigger is `SynapseMastheadActionIconButton` styling; default options About / Get Started; `aria-expanded` on trigger when open; `sideOffset` default `0`.
- **`SynapseMastheadUserMenu`:** Base UI `Menu`; avatar trigger opens 250px panel; email row highlighted when `initials` or `imageSrc` set (`highlightEmailRow`); icon-only avatar uses plain email row (`50024:244160`).
- **App Launcher:** `SynapseAppLauncher` with `triggerVariant="masthead"` — grid icon `grid-square-9-16`, 16×16, mask variant.
- **App Shell:** `headerActions` → `iconsSlot`; Spec Accurate Page Layout passes Help-only strip + launcher + user menu.

### Accessibility

Inherits IDS a11y contract. Additional:

- Help menu trigger: `aria-label="Help"`; menu items are keyboard navigable (Base UI Menu).
- User menu trigger: `aria-label` includes initials or photo alt when present.
- Focus ring applies to interactive action elements only — not the masthead container.

## Composition & API (runtime)

Inherits IDS root slot API from [`ids/masthead/design-spec.md` → Composition & API](../ids/masthead/design-spec.md#composition--api-runtime) with Synapse primitive names:

| Prop / slot | Type | Required | Contract |
|---|---|---|---|
| `productName` | `string` \| `RenderableNode` | yes | Brand label |
| `logo` | `RenderableNode` | no | Leading mark |
| `iconsSlot` | `RenderableNode` | no | Composed utilities — **no fixed icon list** |
| `appLauncherSlot` | `RenderableNode` | no | `SynapseAppLauncher` recommended |
| `avatarSlot` | `RenderableNode` | yes | `SynapseMastheadAvatar` or `SynapseMastheadUserMenu` |

**No root action callback.**

### `SynapseMastheadActionIconButton`

Same contract as IDS `MastheadActionIconButton` — extends native `button`; `icon`, `aria-label` required; optional `badgeCount`, `badgeType`, `aria-expanded`, `onClick`.

### `SynapseMastheadAvatar`

Same contract as IDS `MastheadAvatar` — `initials`, `icon`, `imageSrc`, `imageAlt`; extends `button`.

### Spec Accurate Design defaults (`47807:7569`)

```ts
{
  productName: "Synapse",
  iconsSlot: <SynapseMastheadHelpMenu />,  // inside ActionButtonContainer in stories
  appLauncherSlot: <SynapseAppLauncher triggerVariant="masthead" sideOffset={0} products={[...]} />,
  avatarSlot: <SynapseMastheadUserMenu userName="User Name" email="user.name@example.com" initials="YK" />,
}
```

### Consumer usage

Storybook **Spec Generated/Synapse/Masthead**:

- **Spec Accurate Design** — canonical `47807:7569` sample
- **FullActionStrip** — optional IDS-parity icon cluster + badges (`50154:68499`)
- **HelpMenuOpen** — `51829:85983`
- **UserIconAvatar** — `50024:244160`

App Shell integration: see [`synapse/app-shell/design-spec.md`](../app-shell/design-spec.md).

## Codegen Contract (Framework-Agnostic Blueprint)

### Deterministic slot order

| Order | Slot id | Notes |
|---:|---|---|
| 1 | `MastheadRoot` | `<header>` landmark |
| 2 | `MastheadBrandSlot` | logo? + productName |
| 3 | `MastheadActionsRow` | right flex row |
| 4 | `MastheadIconsSlot` | `iconsSlot` projection |
| 5 | `MastheadAppLauncherSlot` | optional |
| 6 | `MastheadAvatarSlot` | required |

### Variant matrix

| Variant | `iconsSlot` sample | `avatarSlot` | Figma evidence |
|---|---|---|---|
| `default` (Spec Accurate) | Help menu only | User menu, initials `YK` | `47807:7569` |
| `full-actions` | Search + Alerts + Jobs + Settings + Help | User menu | `50154:68499` |
| `user-icon` | Help | User menu, icon avatar | `50024:244160` |
| `with-badges` | Full strip + badge counts | User menu | `50154:68499` |

### Behavior contract

Inherits IDS behavior contract. Additionally:

- Emit gradient background on `MastheadRoot` for Synapse theme scope.
- Apply dark-theme hover token override (`controls-brand-strong`) when `[data-theme="dark"]`.
- `SynapseMastheadHelpMenu` / `SynapseMastheadUserMenu` manage open state locally; parent Masthead does not coordinate menus.

### Accessibility contract

Inherits IDS. Menu triggers must set `aria-expanded`; menu popups use appropriate roles via Base UI Menu.

### Asset resolution

Icons via `assets/icons/<slug>.svg` through shared `Icon` component (`variant="mask"` default). Masthead owns no bundled assets.

### Fallback/error rules

Inherits IDS fallback rules from [`ids/masthead/design-spec.md`](../ids/masthead/design-spec.md#fallbackerror-rules).

### Validation checklist

- [x] IDS baseline linked; Synapse deltas table complete
- [x] Live Figma MCP on Synapse nodes (`47807:7569`, `49852:73090`, `50154:68499`, `51829:85983`, `49989:83672`)
- [x] All required `##` sections present; Codegen Contract complete
- [x] `iconsSlot` composition — no root `onMastheadAction` / `actions[]` API
- [x] Slot order: brand → `iconsSlot` → `appLauncherSlot` → `avatarSlot`
- [x] Gradient root + `transparent-neutral-light` border documented
- [x] Dark theme differing rows documented (hover `controls-brand-strong`, transparent default)
- [x] Reference implementation matches slot API (`SynapseMasthead.tsx`)
- [x] Storybook Spec Accurate Design aligns to `47807:7569`
- [x] App Shell `headerActions` → `iconsSlot` documented
- [x] `synapse-theme.css` referenced
- [ ] Automated visual regression across full action state matrix (manual Storybook QA)

## Implementation Notes

### Icon color

Same as IDS — use `var(--color-icon-white)` on action buttons; `Icon` default `variant="mask"` for asset icons with hardcoded fills.

### Open state (`aria-expanded`)

Same as IDS — `[aria-expanded="true"]` → `masthead-brand-stronger`; open+hover → `masthead-brand-strong` (light) or `controls-brand-strong` (dark).

### App Launcher

Use `SynapseAppLauncher` / `AppLauncher` with `triggerVariant="masthead"`; icon `grid-square-9-16` at 16×16.

## Source Mapping

| Property | Value |
|---|---|
| Design system | Synapse |
| IDS baseline | [`components/ids/masthead/design-spec.md`](../ids/masthead/design-spec.md) |
| IDS Figma parity | `Masthead-Main` `10130:29493` (file `0bHk3XhrjFhowgFkz9yLr4`) |
| Figma file | [Synapse Hi-Fi components](https://www.figma.com/design/Td1bnsvRj1PCGs9RVJkIvJ/Synapse-Hi-Fi-components) |
| File key | `Td1bnsvRj1PCGs9RVJkIvJ` |
| Main component | [`47807:7569`](https://www.figma.com/design/Td1bnsvRj1PCGs9RVJkIvJ/Synapse-Hi-Fi-components?node-id=47807-7569&m=dev) — `Masthead-Main` |
| Scenarios board | `47807:7570` |
| Element actions set | [`49852:73090`](https://www.figma.com/design/Td1bnsvRj1PCGs9RVJkIvJ/Synapse-Hi-Fi-components?node-id=49852-73090&m=dev) |
| User initials element | [`49852:73083`](https://www.figma.com/design/Td1bnsvRj1PCGs9RVJkIvJ/Synapse-Hi-Fi-components?node-id=49852-73083&m=dev) |
| Action state matrix | [`50154:68499`](https://www.figma.com/design/Td1bnsvRj1PCGs9RVJkIvJ/Synapse-Hi-Fi-components?node-id=50154-68499&m=dev) |
| Help menu open | [`51829:85983`](https://www.figma.com/design/Td1bnsvRj1PCGs9RVJkIvJ/Synapse-Hi-Fi-components?node-id=51829-85983&m=dev) |
| User menu (initials) | [`49989:83672`](https://www.figma.com/design/Td1bnsvRj1PCGs9RVJkIvJ/Synapse-Hi-Fi-components?node-id=49989-83672&m=dev) |
| User menu (icon avatar) | [`50024:244160`](https://www.figma.com/design/Td1bnsvRj1PCGs9RVJkIvJ/Synapse-Hi-Fi-components?node-id=50024-244160&m=dev) |
| Page Layout instance | `48463:143536` (App Shell Default) |
| Verification method | Figma MCP — `get_metadata`, `get_design_context`, `get_variable_defs` |
| Last live verification | 2026-06-17 |
| Design spec path | `components/synapse/masthead/design-spec.md` |
| Reference implementation | `storybook/src/components/SynapseMasthead.tsx`, `SynapseMasthead.module.css` |
| Storybook | `storybook-generated/synapse/src/components/Masthead.stories.tsx` |
| Component map | `data/synapse-component-figma-map.json` → component `Masthead` |
| Related pattern | [`components/synapse/app-shell/design-spec.md`](../app-shell/design-spec.md) → `headerActions` |
