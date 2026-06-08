<!-- ds:inherits root-spec -->
# Masthead Design Spec

## Metadata

| Property | Value |
|---|---|
| Component | Masthead |
| Category | Components |
| Design System | Synapse |
| Version | 1.0.0 |
| Description | Application masthead with brand product title, optional utility icon actions, app launcher, and user avatar; uses horizontal masthead gradient (solid brand in light, blue-to-slate fade in dark). |
| Status | active |
| Created | 2026-06-04 |
| Updated | 2026-06-04 |
| Figma URL (component) | https://www.figma.com/design/Td1bnsvRj1PCGs9RVJkIvJ/Synapse-Hi-Fi-components?node-id=47807-7569&m=dev |
| Figma scenarios board | https://www.figma.com/design/Td1bnsvRj1PCGs9RVJkIvJ/Synapse-Hi-Fi-components?node-id=47807-7570&m=dev |
| Storybook examples requested | yes |
| Storybook path | `storybook-generated/synapse/src/components/Masthead.stories.tsx` |
| Storybook title | `Spec Generated/Synapse/Masthead` |
| Live verification | Figma MCP `get_design_context` + `get_variable_defs` on 2026-06-04 |
| Verification method | Figma MCP |
| File key | `Td1bnsvRj1PCGs9RVJkIvJ` |

## Anatomy

Deterministic slot order (left → right):

1. **MastheadRoot** — `<header>`; full-width bar with gradient fill and bottom border.
2. **MastheadBrandSlot** — product title text (e.g. `Synapse`); left-aligned.
3. **MastheadActionsSlot** — right-aligned cluster:
   - **optional** `MastheadIconsSlot` — ordered icon action buttons (left → right when full strip): Global Search → Alerts (optional critical badge) → Jobs (optional success badge) → System Settings → Help; default strip is Help only.
   - **optional** `MastheadAppLauncherSlot` — app launcher trigger (`grid-square-9-16`).
   - **MastheadAvatarSlot** — user initials chip or user icon fallback.

Sub-elements (Figma component sets):

| Sub-component | Node ID | Role |
|---|---|---|
| Masthead-Main | `47807:7569` | Default composed masthead |
| Masthead-Element-Actions | `49852:73090` | 48×56 icon action hit target |
| Masthead-Element-UserInitials | `49852:73083` | 32×32 avatar (`Initials` \| `Icon`) |
| Action state matrix | `50154:68499` | Default / hover / active / focus for all action types |
| Element instances | `50154:68524` | Action element reference |
| Scenarios canvas | `47807:7570` | Default, user menu, app launcher, help dropdowns |

## Layout & Measurements

| Property | Value | Token / note |
|---|---|---|
| Bar height | 56px | `var(--sizing-size-56)` (alias `var(--scale-56)`) |
| Horizontal padding | 16px left, 8px right | `var(--padding-padding-16)`, `var(--padding-padding-8)` |
| Bottom border | 1px solid | `var(--border-width-border-1)` + `var(--color-border-transparent-neutral-light)` |
| Border radius | 0 | `var(--corner-radius-radius-none)` |
| Width | 100% viewport | `width: 100%`; `box-sizing: border-box` |
| Product title typography | Roboto Regular 18px / 32px line | `var(--font-size-header-6)`, `var(--font-line-height-line-height-32)` |
| Icon action hit area | 48×56px | `var(--sizing-size-48)` × bar height; padding `var(--padding-padding-20)` vertical, `var(--padding-padding-16)` horizontal |
| Icon glyph | 16×16px | `var(--sizing-size-16)` |
| Avatar chip | 32×32px circle | `var(--sizing-size-32)`; border `var(--border-width-border-1)` `var(--color-border-white)` |
| Avatar action padding | 12px vertical, 8px horizontal | `var(--padding-padding-12)`, `var(--padding-padding-8)` |
| Badge (when used) | `height: 18px`, `min-width: 18px`, `border-radius: 100px` | `var(--font-size-body-3)` count text; border `var(--border-width-border-1)` `var(--color-border-white)` |
| Badge padding | 1 digit → `width: 18px` (no padding); 2 digits → `0 4px`; 3+ digits → `0 5.5px` | Matches IDS masthead badge contract |
| Badge position | `position: absolute; top: 12px; left: 23px` | Parent action button `position: relative` (48×56 hit target) |
| Badge overflow | `badgeCount > 99` → display `"99+"` | `pointer-events: none` on badge wrapper |
| Focus ring (actions only) | `var(--border-width-border-1)` dashed `var(--color-border-white)`, `outline-offset: -1px` | Icon buttons + avatar only — not MastheadRoot |

### Masthead background (gradient contract)

The root **must** render a horizontal gradient layered on the surface token (matches Figma `Masthead-Main`):

```css
background-color: var(--color-background-surface-1);
background-image: linear-gradient(
  90deg,
  var(--color-background-gradient-masthead-start) 0%,
  var(--color-background-gradient-masthead-end) 100%
);
```

| Theme | `--color-background-gradient-masthead-start` | `--color-background-gradient-masthead-end` | Visual |
|---|---|---|---|
| Light | `#0076ce` | `#0076ce` | Solid brand blue |
| Dark | `rgba(0,118,206,0.50)` | `rgba(19,21,25,0.10)` | Blue fade into slate canvas (`--color-background-surface-1` = `#111619`) |

Resolved values come from `components/synapse-theme.css` under `:root` and `[data-theme="dark"]`.

### Action icon order (when full utility strip is enabled)

Left → right (from `50154:68499` matrix): Global Search → Alerts → Jobs → System Settings → Help → App Launcher → Avatar.

Default **Masthead-Main** (`47807:7569`) documents the reduced strip: **Help → App Launcher → Avatar** only.

## Tokens

Use **only** semantic variables from `components/synapse-theme.css`. Do not hardcode colors in implementation guidance.

### Typography

| Usage | Tokens |
|---|---|
| Product title | `var(--font-size-header-6)`, `var(--font-line-height-line-height-32)`, weight 400, `var(--color-text-white)` |
| Avatar initials | `var(--font-size-body-2)`, `var(--font-line-height-line-height-20)`, weight 400, `var(--color-text-white)` |
| Badge count | `var(--font-size-body-3)` (12px), `var(--color-text-white)` |

### Colors — masthead chrome

| Role | Light (`:root`) | Dark (`[data-theme="dark"]`) |
|---|---|---|
| Surface under gradient | `var(--color-background-surface-1)` → `#f4f4f4` | `#111619` |
| Gradient start | `var(--color-background-gradient-masthead-start)` → `#0076ce` | `rgba(0,118,206,0.50)` |
| Gradient end | `var(--color-background-gradient-masthead-end)` → `#0076ce` | `rgba(19,21,25,0.10)` |
| Bottom border | `var(--color-border-transparent-neutral-light)` → transparent | `#34414c` |
| Product text / icons on bar | `var(--color-text-white)`, `var(--color-icon-white)` | same tokens (resolved white) |

### Colors — interactive (per theme)

| Role | Light token | Dark token |
|---|---|---|
| Action default fill | `var(--color-background-masthead-brand-base)` | inherits gradient (no separate fill) |
| Action hover | `var(--color-background-masthead-brand-strong)` | `var(--color-background-controls-brand-strong)` |
| Action active / `aria-expanded` | `var(--color-background-masthead-brand-stronger)` | `var(--color-background-masthead-brand-stronger)` |
| Action focus fill | `var(--color-background-masthead-brand-base)` | `var(--color-background-masthead-brand-base)` |
| Focus ring | `var(--border-width-border-1)` dashed `var(--color-border-white)`, `outline-offset: -1px` | same |

### Colors — badges (optional icons)

| Badge | Background token |
|---|---|
| Alerts | `var(--color-background-alerting-critical)` |
| Jobs | `var(--color-background-alerting-success-1)` |
| Badge border | `var(--color-border-white)` |

### Icons (asset slugs)

| Slot | `shapeName` | Notes |
|---|---|---|
| Global Search | `search-16` | Optional |
| Alerts | `alert-bell-16` | Optional; `badgeType="critical"` |
| Jobs | `jobs-queue-stack` | Optional; `badgeType="success"` |
| System Settings | `setting-gear-16` | Optional |
| Help | `help-circ-16` | Default strip |
| App Launcher | `grid-square-9-16` | Masthead-only 16px |
| User fallback | `user-single-16` | When initials unavailable |

All masthead icons use `variant="mask"` (hardcoded SVG fills); set `color: var(--color-icon-white)` on the button root.

### Spacing & sizing

`var(--padding-padding-16)`, `var(--padding-padding-20)`, `var(--padding-padding-8)`, `var(--padding-padding-12)`, `var(--sizing-size-48)`, `var(--sizing-size-56)`, `var(--sizing-size-32)`, `var(--sizing-size-16)`, `var(--border-width-border-1)`.

## States (Light Theme)

| Element | Background | Border | Text | Icon |
|---|---|---|---|---|
| MastheadRoot | gradient `var(--color-background-gradient-masthead-start)` → `var(--color-background-gradient-masthead-end)` on `var(--color-background-surface-1)` | bottom `var(--color-border-transparent-neutral-light)` | — | — |
| Logo / product title | inherits gradient | transparent | `var(--color-text-white)` | `var(--color-icon-white)` |
| Action icon (default) | `var(--color-background-masthead-brand-base)` | transparent | — | `var(--color-icon-white)` |
| Action icon (hover) | `var(--color-background-masthead-brand-strong)` | transparent | — | `var(--color-icon-white)` |
| Action icon (focus-visible) | `var(--color-background-masthead-brand-base)` | inset dashed `var(--color-border-white)` | — | `var(--color-icon-white)` |
| Action icon (active / pressed) | `var(--color-background-masthead-brand-stronger)` | transparent | — | `var(--color-icon-white)` |
| Action icon (open / `aria-expanded`) | `var(--color-background-masthead-brand-stronger)` | transparent | — | `var(--color-icon-white)` |
| Action icon (open + hover) | `var(--color-background-masthead-brand-strong)` | transparent | — | `var(--color-icon-white)` |
| Avatar button (default) | `var(--color-background-masthead-brand-base)` | chip `var(--color-border-white)` | `var(--color-text-white)` | `var(--color-icon-white)` |
| Avatar button (hover) | `var(--color-background-masthead-brand-strong)` | chip `var(--color-border-white)` | `var(--color-text-white)` | `var(--color-icon-white)` |
| Avatar button (open / `aria-expanded`) | `var(--color-background-masthead-brand-stronger)` | chip `var(--color-border-white)` | `var(--color-text-white)` | `var(--color-icon-white)` |
| Avatar button (open + hover) | `var(--color-background-masthead-brand-strong)` | chip `var(--color-border-white)` | `var(--color-text-white)` | `var(--color-icon-white)` |
| Alerts badge | `var(--color-background-alerting-critical)` | `var(--color-border-white)` | `var(--color-text-white)` | — |
| Jobs badge | `var(--color-background-alerting-success-1)` | `var(--color-border-white)` | `var(--color-text-white)` | — |

## States (Dark Theme)

Dark rows use different `var(--...)` than light (gradient chrome, transparent default fills, `controls-brand-strong` hover). Matrix is structurally parallel to **States (Light Theme)**.

| Element | Background | Border | Text | Icon |
|---|---|---|---|---|
| MastheadRoot | gradient `var(--color-background-gradient-masthead-start)` → `var(--color-background-gradient-masthead-end)` on `var(--color-background-surface-1)` | bottom `var(--color-border-transparent-neutral-light)` | — | — |
| Logo / product title | inherits gradient | transparent | `var(--color-text-white)` | `var(--color-icon-white)` |
| Action icon (default) | transparent (shows gradient) | transparent | — | `var(--color-icon-white)` |
| Action icon (hover) | `var(--color-background-controls-brand-strong)` | transparent | — | `var(--color-icon-white)` |
| Action icon (focus-visible) | `var(--color-background-masthead-brand-base)` | inset dashed `var(--color-border-white)` | — | `var(--color-icon-white)` |
| Action icon (active / pressed) | `var(--color-background-masthead-brand-stronger)` | transparent | — | `var(--color-icon-white)` |
| Action icon (open / `aria-expanded`) | `var(--color-background-masthead-brand-stronger)` | transparent | — | `var(--color-icon-white)` |
| Action icon (open + hover) | `var(--color-background-controls-brand-strong)` | transparent | — | `var(--color-icon-white)` |
| Avatar button (default) | transparent | chip `var(--color-border-white)` | `var(--color-text-white)` | `var(--color-icon-white)` |
| Avatar button (hover) | `var(--color-background-controls-brand-strong)` | chip `var(--color-border-white)` | `var(--color-text-white)` | `var(--color-icon-white)` |
| Avatar button (open / `aria-expanded`) | `var(--color-background-masthead-brand-stronger)` | chip `var(--color-border-white)` | `var(--color-text-white)` | `var(--color-icon-white)` |
| Avatar button (open + hover) | `var(--color-background-controls-brand-strong)` | chip `var(--color-border-white)` | `var(--color-text-white)` | `var(--color-icon-white)` |
| Alerts badge | `var(--color-background-alerting-critical)` | `var(--color-border-white)` | `var(--color-text-white)` | — |
| Jobs badge | `var(--color-background-alerting-success-1)` | `var(--color-border-white)` | `var(--color-text-white)` | — |

## Interactions

- **Product title**: static branding; not interactive unless wrapped by consuming app.
- **Icon actions**: `click` toggles panels; `aria-expanded` reflects open menus.
- **Help** (`47807:7570`): opens `SynapseMastheadHelpMenu` — About, Get Started (`51829:85983`).
- **App Launcher**: opens product list (e.g. Dell Automation Platform, Dell AIOps) with external-link affordance.
- **Avatar**: opens **user menu** (`SynapseMastheadUserMenu`) — `Dropdown-SingleSelect-Elements-Menu`: display name, email row (highlighted with initials/photo `49989:83672`, plain with icon-only `50024:244160`), optional custom options, Log Out; panel aligns trailing edge below masthead (`sideOffset` 0–1px).
- **Keyboard**: Tab through actions; Enter/Space activate; Escape closes open menus (consumer responsibility).
- **Badges**: display when `badgeCount > 0`; cap display at `99+`.

### Accessibility

- Focus ring applies to action elements (icon buttons, avatar button) only — not MastheadRoot. Style: `var(--border-width-border-1)` dashed `var(--color-border-white)`, `outline-offset: -1px` (inset).
- Keyboard navigation: Tab order through actions; Enter/Space activate; Escape closes open menus (consumer).
- Root: `<header>` with implicit `banner` landmark; optional `nav` for action cluster.
- Each action: native `<button>` with required `aria-label`; `aria-expanded` when controlling a panel.
- Screen reader: badge counts should be included in `aria-label` when present (e.g. `"Alerts, 3 notifications"`); badge glyph may be `aria-hidden`.
- High contrast: white icons/text on brand gradient meet WCAG AA for masthead chrome.
- Focus management: logical tab order left → right within `MastheadActionsSlot`.

### Behavior & guidelines

- Apply gradient on **MastheadRoot** in both themes; never replace dark theme with flat `masthead-brand-base` only.
- In dark theme, hover uses **`controls-brand-strong`**, not `masthead-brand-strong` (verified on `50154:68499`).
- `[aria-expanded="true"]:hover` uses hover token (hover wins over open/pressed).
- App launcher trigger must use masthead sizing (48×56) and `var(--color-icon-white)`.
- User menu and app launcher panels use `var(--color-background-component)` and `var(--color-border-neutral-light)` (documented on scenario board, not part of masthead root).
- Sticky positioning and compact height are **consumer layout** concerns; masthead height remains `var(--sizing-size-56)` unless a separate compact spec is authored.

### Implementation notes

- All icons on the masthead must use `var(--color-icon-white)`, **not** `var(--color-text-white)`. Set `color: var(--color-icon-white)` on button roots so `currentColor` resolves for mask icons.
- SVG assets in `assets/icons/` use hardcoded fills — use `Icon` `variant="mask"` (default); do not use `variant="inline"` unless the SVG is authored with `currentColor`.
- Action default fill in **light** theme: `var(--color-background-masthead-brand-base)` on buttons (matches gradient visually). **Dark** default: `transparent` so gradient shows through.
- Open state: `aria-expanded="true"` → `masthead-brand-stronger`; `[aria-expanded="true"]:hover` → hover token (light: `masthead-brand-strong`, dark: `controls-brand-strong`).
- Use shared `Badge` for counts; `badgeCount > 0` shows badge; `> 99` displays `"99+"`; Alerts → `badgeType="critical"`, Jobs → `badgeType="success"`.
- Avatar: `imageSrc` for photos; `icon` prop for `user-single-16`; never `<img src="*.svg">` for recolorable icons.
- App launcher with `triggerVariant="masthead"`: trigger uses `grid-square-9-16` at 16×16 with `variant="mask"` and `color: var(--color-icon-white)`.

## Composition & API (runtime)

- `productName: string` (required) — brand title (e.g. `Synapse`)
- `logo?: ReactNode` — optional leading logo mark
- `iconsSlot?: ReactNode` — ordered icon actions (reduced or full strip)
- `appLauncherSlot?: ReactNode` — typically `<AppLauncher triggerVariant="masthead" />`
- `avatarSlot: ReactNode` (required) — `<SynapseMastheadUserMenu />` (preferred) or `<MastheadAvatar />` for static/demo triggers

### SynapseMastheadHelpMenu

Help action + detached menu (`storybook/src/components/SynapseMastheadHelpMenu.tsx`). Figma `51829:85983` (185×80px).

| Prop | Type | Required | Default | Notes |
|---|---|---|---|---|
| `options` | `{ id?, label, onSelect?, disabled? }[]` | no | About, Get Started | Plain option rows |
| `icon` | `ReactNode` | no | `help-circ-16` | Masthead trigger glyph |
| `sideOffset` | `number` | no | `0` | Offset below masthead |
| `defaultOpen` | `boolean` | no | `false` | Demo/Storybook |
| `onOpenChange` | `(open: boolean) => void` | no | — | |

| Row | Style | Background | Border | Text |
|---|---|---|---|---|
| Option | `.optionRow` | `component` / `brand-lighter` on hover | inset `brand-neutral` on hover | `var(--color-text-neutral)` |
| Popup | `.popup` | `component` | full `neutral-light` | shadow stack (2px + 4px) |

### SynapseMastheadUserMenu

Avatar opens **Dropdown-SingleSelect-Elements-Menu** (`storybook/src/components/SynapseMastheadUserMenu.tsx` + `SynapseMastheadUserMenu.module.css`) — aligned to `components/ids/dropdown-single-select/design-spec.md` row anatomy; Synapse tokens from `components/synapse-theme.css`.

| Prop | Type | Required | Default | Notes |
|---|---|---|---|---|
| `userName` | `string` | yes | — | Header row (body-2 medium, `var(--color-text-neutral-strong)`) |
| `email` | `string` | yes | — | Info row; styling depends on avatar mode (see table below) |
| `initials` | `string` | no | — | Avatar chip text (`YK`, etc.) |
| `icon` | `ReactNode` | no | `user-single-16` | Shown when no initials/photo; defaults to `SynapseMastheadUserMenuDefaultIcon` |
| `highlightEmailRow` | `boolean` | no | auto | `true` with initials/photo (`49989:83672`); `false` icon-only (`50024:244160`) |
| `imageSrc` | `string` | no | — | Photo avatar |
| `imageAlt` | `string` | no | `User avatar` | |
| `options` | `{ id?, label, onSelect?, disabled? }[]` | no | `[]` | User-defined rows between email and Log Out |
| `onLogout` | `() => void` | no | — | When set, renders Log Out link (`var(--color-text-brand-strong)`) |
| `logoutLabel` | `string` | no | `Log Out` | |
| `sideOffset` | `number` | no | `0` | Popover offset from masthead bottom |
| `onOpenChange` | `(open: boolean) => void` | no | — | Open state callback |

Popup: `SynapseMastheadUserMenu.module.css` (250×120px). Detached menu — **full** `1px` border `var(--color-border-neutral-light)` on all sides. Shadow: `0 2px 2px` + `0 4px 4px` `var(--shadow-shadow-4-drop-shadow-4-color)`. Theme: `components/synapse-theme.css`.

**Menu variants (Figma):**

| Avatar mode | Figma menu node | Email row |
|---|---|---|
| Initials or photo | `49989:83672` | `.emailRowHighlighted` — `brand-lighter`, top/bottom `brand-neutral` |
| Icon only (no initials) | `50024:244160` | `.emailRowPlain` — `component` background, no brand borders |

| Row | Style | Background | Border | Text |
|---|---|---|---|---|
| User name | `.userNameRow` | `var(--color-background-component)` | none | `var(--color-text-neutral-strong)`, medium |
| Email (initials/photo) | `.emailRowHighlighted` | `var(--color-background-brand-lighter)` | top/bottom `var(--color-border-brand-neutral)` | `var(--color-text-neutral)` |
| Email (icon-only) | `.emailRowPlain` | `var(--color-background-component)` | none | `var(--color-text-neutral)` |
| Custom option | `.item` + `.optionItem` | component / brand-lighter hover | top `var(--color-border-neutral-light)` | neutral |
| Log Out | `.footerAction` | component | top `var(--color-border-neutral-light)` | `var(--color-text-brand-strong)` |

**Avatar trigger (icon-only):** `Masthead-Element-UserInitials` — 32×32 chip, white ring, `user-single` 16×16 centered (`50024:244158` / variant `user-icon`).

### MastheadActionIconButton

- `icon: ReactNode` (required) — 16×16; use `Icon` `variant="mask"` for `assets/icons/` slugs
- `aria-label: string` (required)
- `aria-expanded?: boolean` — set when button controls an open panel/dropdown
- `badgeCount?: number` — renders badge when > 0; displays `"99+"` when > 99
- `badgeType?: "default" | "controls" | "critical" | "warning" | "disabled" | "success"` — defaults to `"critical"`. Use `"critical"` for Alerts, `"success"` for Jobs

### MastheadAvatar

- `initials?: string` — 1–2 characters in chip
- `icon?: ReactNode` — inline 16×16 icon (`user-single-16`); use instead of `imageSrc` for design-system icons
- `imageSrc?: string` — photo URL (fills full chip)
- `imageAlt?: string` — defaults to `User avatar`

### Avatar chip typography (initials)

- `font-size: var(--font-size-body-2)`
- `font-weight: 400`
- `font-variation-settings: 'wdth' 100` (required for Roboto variable font)
- `line-height: var(--font-line-height-line-height-20)`

### Variants

| Variant | Description | Actions shown | Figma evidence |
|---|---|---|---|
| **default** | Standard Synapse masthead | Help → App Launcher → Avatar (initials) | `47807:7569`, `47807:7571` |
| **user-icon** | Avatar uses icon fallback | Help → App Launcher → Avatar (icon) | `47807:7570` User Icon |
| **full-actions** | Full utility strip | Search → Alerts → Jobs → Settings → Help → App Launcher → Avatar | `50154:68499` |
| **with-badges** | Full strip + notification badges | Same as full-actions with `badgeCount` on Alerts/Jobs | `50154:68499` |
| **with-search** | Search enabled (subset of full-actions) | Search + default reduced strip | Consumer composition |
| **with-notifications** | Alias of **with-badges** | Badges on Alerts/Jobs | `50154:68499` |
| **with-user-menu** | Alias of **default** | Avatar opens user menu (consumer) | `47807:7570` |
| **sticky** | Masthead `position: sticky; top: 0` | Any strip variant | Consumer layout |
| **compact** | Reserved; height remains 56px until compact spec exists | — | — |
| **dark** | Theme via `[data-theme="dark"]` + `synapse-theme.css` | Any strip variant | Gradient end fade |

### Spec Accurate Design story defaults

| Arg | Value |
|---|---|
| `productName` | `"Synapse"` |
| `iconsSlot` | Help button only (`help-circ-16`) |
| `appLauncherSlot` | App launcher masthead trigger |
| `avatarSlot` | `<SynapseMastheadUserMenu userName="User Name" email="user.name@example.com" initials="YK" />` |
| Theme | Story `globals.theme` + import `components/synapse-theme.css` |

## Codegen Contract (Framework-Agnostic Blueprint)

### Deterministic structure

Deterministic slot order:

1. `MastheadRoot` — `<header>`; gradient + bottom border
2. `MastheadBrandSlot` — `logo?` + `productName`
3. `MastheadActionsSlot` — trailing cluster:
   - `MastheadIconsSlot?` (0..n icon buttons)
   - `MastheadAppLauncherSlot?`
   - `MastheadAvatarSlot` (required)

Icon action order within `MastheadIconsSlot` when **full-actions** / **with-badges** (left → right, enforced by Figma `50154:68499`):

1. Global Search (`search-16`)
2. Alerts (`alert-bell-16`) — `badgeType="critical"` when badge shown
3. Jobs (`jobs-queue-stack`) — `badgeType="success"` when badge shown
4. System Settings (`setting-gear-16`)
5. Help (`help-circ-16`)
6. App Launcher (`grid-square-9-16`) — in `MastheadAppLauncherSlot`, not inside icons slot
7. Avatar / User Settings — in `MastheadAvatarSlot`

**default** strip order: Help (icons slot) → App Launcher → Avatar.

### Variant matrix

| variant | iconsSlot | appLauncherSlot | avatar | badges |
|---|---|---|---|---|
| default | Help | yes | initials | no |
| user-icon | Help | yes | icon | no |
| full-actions | search→…→help | yes | initials | no |
| with-badges | full strip | yes | initials | Alerts critical, Jobs success |

### Per-slot style contract

- **MastheadRoot**: `background-color` + horizontal gradient tokens; bottom border token; height `var(--sizing-size-56)`.
- **MastheadBrandSlot**: `var(--color-text-white)` on product title; no separate fill.
- **MastheadActionIconButton**: 48×56 hit area; 16×16 glyph; `var(--color-icon-white)`; states per **States** tables.
- **MastheadAvatarSlot**: chip `var(--sizing-size-32)`; border `var(--color-border-white)`; initials typography contract above.

### Behavior contract

- Brand area left-aligned; actions right-aligned.
- Action buttons use tokenized default/hover/active/open/open+hover backgrounds per theme.
- `aria-expanded="true"` on triggers controlling menus; hover wins over open on `:hover`.
- Optional badges on Alerts/Jobs only in notification variants; shared `Badge` component.
- Missing logo: render `productName` only in brand slot.

### Accessibility contract

- See **Interactions → Accessibility**.
- Banner landmark; labeled buttons; focus-visible on actions/avatar only; keyboard order matches slot order.

### Asset resolution + bundling contract

- Icons from `assets/icons/<slug>.svg` via `Icon` (`variant="mask"`).
- Slugs: see **Tokens → Icons (asset slugs)**.
- App launcher masthead trigger reuses `grid-square-9-16`.

### Fallback/error rules

- Missing `productName` → codegen validation error.
- Missing `avatarSlot` → validation error.
- Missing logo → product name only in brand slot.
- Missing avatar content → `user-single-16` via `icon` prop.
- Unknown `badgeType` → `"critical"`.
- `badgeCount > 99` → display `"99+"`.
- `badgeCount` 0 or undefined → hide badge.

### Validation checklist

- [ ] Implement masthead action slots in deterministic order
- [ ] MastheadRoot uses gradient tokens in light and dark
- [ ] Dark hover uses `var(--color-background-controls-brand-strong)` on actions
- [ ] Light hover uses `var(--color-background-masthead-brand-strong)`
- [ ] Open + hover uses hover token (not stronger) per theme
- [ ] Theme CSS import is `components/synapse-theme.css` only
- [ ] Icon color uses `var(--color-icon-white)` on button roots
- [ ] Action hit target 48×56 with 16×16 glyph; avatar 32×32
- [ ] Focus ring on actions/avatar only; dashed white inset
- [ ] Test keyboard navigation (Tab, Enter, Escape)
- [ ] Verify `aria-label` and `aria-expanded` on menu triggers
- [ ] Badge overflow `99+` and Alerts/Jobs badge types
- [ ] Avatar opens user menu with `userName`, `email`, optional `options`, and `onLogout`
- [ ] User menu matches Figma `49989:83672` (initials/photo) or `50024:244160` (icon-only)
- [ ] Help menu matches Figma `51829:85983` (About, Get Started)
- [ ] Storybook **Spec Accurate Design** + variant stories pass
- [ ] Live Figma nodes documented in Source Mapping
- [ ] No hardcoded hex in generated CSS

## Source Mapping

| Source | Location |
|---|---|
| Component spec | `components/synapse/masthead/design-spec.md` |
| Theme CSS | `components/synapse-theme.css` |
| Root spec | `components/synapse/root-spec.md` |
| Figma file | `Td1bnsvRj1PCGs9RVJkIvJ` |
| Masthead-Main | `47807:7569` |
| Scenarios | `47807:7570` |
| Masthead-Element-Actions | `49852:73090` |
| Masthead-Element-UserInitials | `49852:73083` |
| Action element ref | `50154:68524` |
| Action state matrix | `50154:68499` |
| User menu (initials/photo) | `49989:83672` |
| User menu (icon-only avatar) | `50024:244160` |
| Help menu | `51829:85983` |
| Component map | `data/synapse-component-figma-map.json` → `Masthead` |
| Verification | Figma MCP, 2026-06-04 |
| Storybook | `storybook-generated/synapse/src/components/Masthead.stories.tsx` |
