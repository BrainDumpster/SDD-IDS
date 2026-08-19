# Masthead Design Spec

## Metadata

| Property | Value |
|---|---|
| Component | Masthead |
| Design system | IDS |
| Category | Navigation |
| Status | **active** |
| Version | 1.0.0 |
| Description | Application header bar with required product name and **optional, host-composed** brand logo, utility actions (`iconsSlot` — search / action icons), App Launcher, and avatar. |
| Theme CSS | `components/ids-theme.css` |
| Figma file | [IDS Design Library](https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library) |
| File key | `0bHk3XhrjFhowgFkz9yLr4` |
| Component set | `Masthead-Main` (`10130:29493`) |
| Verification method | Figma MCP (`get_metadata`, `get_design_context`, `get_variable_defs`) |
| Last verified | 2026-06-17 |
| Reference implementation | `storybook/src/components/Masthead.tsx`, `storybook/src/components/Masthead.module.css` |
| Storybook path | `storybook-generated/ids/src/components/Masthead.stories.tsx` |
| Storybook meta title | `Spec Generated/IDS/Masthead` |
| Legacy exploration frame | [IDS with variables (exploration)](https://www.figma.com/design/VZJ48bbVYrIynw8DdSukWw/-Exploration-only--IDS-with-variables?node-id=9054-24736&m=dev) (`9054:24736`) — token reference only |

### Figma component variants (live-verified)

| Variant | Node | Sample size | Notes |
|---|---|---:|---|
| `Product Icon=No` | `10130:29494` | 1920×56 | Product name only (default App Shell sample) |
| `Product Icon=Yes` | `10130:29512` | 1920×56 | Logo + product name |
| App Shell composed instance | `43478:46181` | in `43478:46307` | Full utility icon cluster + launcher + avatar |

## Anatomy
- **MastheadRoot** — full-width header bar (`56px` height), brand background
- **MastheadBrandSlot** (left): optional **host-composed** logo + required product name
- **MastheadActionsRow** (right), fixed **slot order** left → right — **every slot is optional and host-defined**; omit any unused slot (row itself is omitted when all three are empty):
  1. **`iconsSlot`** — composed utility actions (search, action icons, dropdowns, badges — host-defined)
  2. **`appLauncherSlot`** — App Launcher trigger (host-composed)
  3. **`avatarSlot`** — user avatar / account control (host-composed)

**Runtime rule:** Masthead never injects a default product logo, search control, action-icon set, App Launcher, or avatar. Storybook / Figma samples exist for demos only.

### Composed `iconsSlot` (HeaderActions pattern)

The utility region is **not** a fixed icon list at runtime. The host projects any tree into `iconsSlot` and wires `(click)` / `onClick` on each interactive child — same pattern as a product **HeaderActions** child component. **Omit `iconsSlot` entirely** when the product has no search or utility actions.

Valid children include (non-exhaustive):

- Search field or search trigger
- `MastheadActionIconButton` clusters inside `MastheadActionButtonContainer`
- Dropdown triggers (`clr-dropdown`, menu buttons with `aria-expanded`)
- Badge-wrapped icons (alerts, jobs queue)
- Custom markup the product needs

**Click / keyboard behavior:** Masthead does **not** emit a root `onMastheadAction` or `actionId` map. Each composed control owns its handlers (`onClick`, dropdown `openChange`, etc.). App Shell forwards this via `headerActions` → Masthead `iconsSlot` (see [`app-shell/design-spec.md`](../app-shell/design-spec.md)).

**Recommended wrapper** (framework-specific name; layout only):

| Framework | Wrapper |
|---|---|
| React (reference) | content inside `iconsSlot`; App Shell provides `AppShellHeaderActions` |
| Angular | `<ids-masthead-header-actions>` with projected children |
| Generic | `div.masthead-header-actions` — `display: flex; align-items: center; height: 100%` |

### Figma reference sample (`9054:24736`, App Shell `43478:46307`)

When no product-specific actions are composed, Storybook / spec-accurate demos MAY render this **sample** left → right inside `iconsSlot`:

1. Global Search (`search-16`)
2. Alerts (`alert-bell-16`) — optional critical badge
3. Jobs (`jobs-queue-stack`) — optional success badge
4. System Settings (`setting-gear-16`)
5. Help (`help-circ-16`)

App Launcher (`grid-square-9-16`) and avatar remain **separate optional slots** — not inside `iconsSlot`. Hosts may omit either or both.

- Focus ring for keyboard navigation (icon buttons + avatar button only)
- Optional notification badges on Alerts and Jobs (composed or via `MastheadActionIconButton` badge props when implemented)
## Layout & Measurements
- Standard height: 56px (`--scale-56`)
- Brand slot vertical alignment: product info block top offset ~12.5px from masthead top (Figma `10130:29520`)
- Product logo (optional): **32×32px** (`var(--scale-32)`), **8px** gap (`var(--spacing-space-8)`) before product name when present
- Product name: header-6 typography — `var(--font-size-header-6)` / `var(--font-line-height-line-height-32)`, `var(--color-text-gray-white)`
- Horizontal padding: 16px left, 8px right
- Bottom border: `var(--border-width-border-1)` solid `var(--color-border-gray-neutral-transparent-base)`
- Border radius: 0 (full-width masthead)
- Action element focus ring: `var(--border-width-border-default)` dashed `var(--color-border-gray-white)`, `outline-offset: -1px` (inset) — applies to icon buttons and avatar button only
- Action icon button: 16px × 16px icon, padding 19px 16px
- Avatar chip: 32px × 32px circle (`var(--scale-32)`), button padding `11px` vertical / `var(--padding-padding-8)` horizontal
- Avatar icon (icon variant): `user-single` slug, rendered at **16×16px** inside the 32×32 chip; color **`var(--color-icon-gray-white)`** (#ffffff)
- Minimum width: Full viewport width
- Badge dimensions: `height: 18px`, `min-width: 18px`, `border-radius: 100px`
- Badge padding (digit-based): 1 digit → fixed `width: 18px` (no padding); 2 digits → `padding: 0 4px`; 3+ digits → `padding: 0 5.5px`
- Badge position: `position: absolute; top: 12px; left: 23px` (button container must be `position: relative`)
- Badge overflow: renders `"99+"` when `badgeCount > 99`
## Tokens
### Colors
- White: `var(--color-text-gray-white)` = #ffffff
- Brand base: `var(--color-background-controls-base)` = #0076ce
- Component background: `var(--color-background-surface-component)` = #ffffff
- Surface background: `var(--color-background-surface-primary)` = #f4f4f4
- Surface 2: `var(--color-background-surface-secondary)` = #ffffff
- Neutral strong: `var(--color-text-gray-neutral-strong)` = #252525
- Brand strong text: `var(--color-text-brand-strong)` = #0062ab
- Accessible border: `var(--color-border-gray-neutral-base)` = #757575
- Brand border: `var(--color-border-brand-base)` = #0076ce
- White border: `var(--color-border-gray-white)` = #ffffff
- Transparent neutral: `var(--color-border-gray-neutral-transparent-base)` = #ffffff00

### Icons
- Brand icon: `var(--color-icon-brand-base)` = #0076ce
- Neutral icon: `var(--color-icon-gray-neutral-base)` = #4d4d4d
- Neutral strong icon: `var(--color-icon-gray-neutral-strong)` = #252525
- Brand strong icon: `var(--color-icon-brand-strong)` = #0062ab
- White icon: `var(--color-icon-gray-white)` = #ffffff
- Standard gray icon: `icon-standard-gray` = #616161
- Dell Blue icon: `icon-DellBlue` = #0076CE
- Status icons: green (#1B8500), red (#AF0000), yellow (#FFC700), orange (#ED6400)

### Background Colors
- Gray lighter: `var(--color-background-gray-lighter)` = #f4f4f4
- Gray neutral alt: `var(--color-background-gray-neutral-light-alt)` = #eaeaea
- Gray base: `var(--color-background-gray-base)` = #757575
- Brand base: `var(--color-background-brand-base)` = #0076ce
- Brand lighter: `var(--color-background-brand-lighter-slate)` = #ebf4fb
- Masthead brand base: `var(--color-background-masthead-base)` = #0076ce
- Masthead brand strong: `var(--color-background-masthead-strong)` = #0062ab
- Masthead brand stronger: `var(--color-background-masthead-stronger)` = #06528a

### Alert Backgrounds
- Success background: `var(--color-background-alerting-success-base)` = #1b8500
- Critical background: `var(--color-background-alerting-critical-base)` = #af0000

### Badge Tokens
- Alerts badge background: `var(--color-background-alerting-critical-base)` = #af0000 (`badgeType="critical"`)
- Jobs badge background: `var(--color-background-alerting-success-base)` = #1b8500 (`badgeType="success"`)
- Badge border: `var(--color-border-gray-white)` = #ffffff, `border-width: var(--border-width-border-1)`
- Badge text color: `var(--color-text-gray-white)` = #ffffff
- Badge font size: `var(--font-size-body-3, 12px)`

### UI Palettes
- Dell Blue 500: `UI Palettes/Dell Blue/dell-blue-500` = #0076CE
- Dell Blue 600: `UI Palettes/Dell Blue/dell-blue-600` = #0062AB
- White: `UI Palettes/White` = #FFFFFF
- Gray 100: `UI Palettes/Gray/gray-100` = #F4F4F4
- Gray 300: `UI Palettes/Gray/gray-300` = #C5C5C5
- Gray 500: `UI Palettes/Gray/gray-500` = #757575
- Gray 600: `UI Palettes/Gray/gray-600` = #616161
- Gray 700: `UI Palettes/Gray/gray-700` = #4D4D4D
- Gray 800: `UI Palettes/Gray/gray-800` = #393939
- Gray 900: `UI Palettes/Gray/gray-900` = #252525

### Alert Palettes
- Yellow 800: `UI Palettes/Alert Palettes/Yellow/yellow-800` = #9C622E

### Static Colors
- Static white: `var(--color-static-gray-white)` = #ffffff
- Static brand 500: `var(--color-static-brand-500)` = #0076ce

### Neutral Colors
- White: `Neutral/White - #FFFFFF` = #FFFFFF
- Gray 100: `Neutral/Gray-100 - #F7F7F7` = #F7F7F7
- Gray 300: `Neutral/Gray-300 - #E4E4E4` = #E4E4E4
### Typography
- Display 1/Default: Roboto Light 72px/88px (large masthead titles)
- Body 1: Roboto Regular 16px/24px (masthead content)
- Body 1 - Medium: Roboto Medium 16px/24px (emphasized content)
- Body 2: Roboto Regular 14px/20px (secondary content)
- Body 2 - Medium: Roboto Medium 14px/20px (emphasized secondary)
- Body 2 - Underline: Roboto Regular 14px/20px (link text)

### Token gaps and notes
- All colors use semantic CSS custom properties for theme consistency
- Typography scales are defined via font tokens with proper hierarchy
- Active states use brand colors for clear indication
- Status indicators use appropriate color psychology
- Dark theme adaptation through semantic tokens
## States (Light Theme)
| Element | Background | Border | Text | Icon |
|---|---|---|---|---|
| Masthead Container | `var(--color-background-masthead-base)` (#0076ce) | `var(--color-border-gray-neutral-transparent-base)` (#ffffff00) bottom only | `var(--color-text-gray-white)` (#ffffff) | `var(--color-icon-gray-white)` (#ffffff) |
| Logo Section | `var(--color-background-masthead-base)` (#0076ce) | transparent | `var(--color-text-gray-white)` (#ffffff) | `var(--color-icon-gray-white)` (#ffffff) |
| Product Logo (optional) | transparent | none | — | product icon slug at **32×32** via **Icon** (`variant="img"` for full-color Product Icons) |
| Navigation Item (Default) | `var(--color-background-masthead-base)` (#0076ce) | transparent | `var(--color-text-gray-white)` (#ffffff) | `var(--color-icon-gray-white)` (#ffffff) |
| Navigation Item (Hover) | `var(--color-background-masthead-strong)` (#0062ab) | transparent | `var(--color-text-gray-white)` (#ffffff) | `var(--color-icon-gray-white)` (#ffffff) |
| Navigation Item (Focus) | `var(--color-background-masthead-base)` (#0076ce) | `var(--color-border-gray-white)` (#ffffff) dashed inset | `var(--color-text-gray-white)` (#ffffff) | `var(--color-icon-gray-white)` (#ffffff) |
| Navigation Item (Active / Pressed) | `var(--color-background-masthead-stronger)` (#06528a) | transparent | `var(--color-text-gray-white)` (#ffffff) | `var(--color-icon-gray-white)` (#ffffff) |
| Navigation Item (Open / aria-expanded) | `var(--color-background-masthead-stronger)` (#06528a) | transparent | `var(--color-text-gray-white)` (#ffffff) | `var(--color-icon-gray-white)` (#ffffff) |
| Navigation Item (Open + Hover) | `var(--color-background-masthead-strong)` (#0062ab) | transparent | `var(--color-text-gray-white)` (#ffffff) | `var(--color-icon-gray-white)` (#ffffff) |
| User Section (Default) | `var(--color-background-masthead-base)` (#0076ce) | transparent | `var(--color-text-gray-white)` (#ffffff) | `var(--color-icon-gray-white)` (#ffffff) |
| User Section (Hover) | `var(--color-background-masthead-strong)` (#0062ab) | transparent | `var(--color-text-gray-white)` (#ffffff) | `var(--color-icon-gray-white)` (#ffffff) |
| User Section (Open / aria-expanded) | `var(--color-background-masthead-stronger)` (#06528a) | transparent | `var(--color-text-gray-white)` (#ffffff) | `var(--color-icon-gray-white)` (#ffffff) |
| User Section (Open + Hover) | `var(--color-background-masthead-strong)` (#0062ab) | transparent | `var(--color-text-gray-white)` (#ffffff) | `var(--color-icon-gray-white)` (#ffffff) |
| Avatar Chip (Initials) | transparent | `var(--color-border-gray-white)` (#ffffff) 1px ring | `var(--color-text-gray-white)` (#ffffff) | — |
| Avatar Chip (Icon) | transparent | `var(--color-border-gray-white)` (#ffffff) 1px ring | — | `user-single` at 16×16, `var(--color-icon-gray-white)` (#ffffff) |
| Status Indicator (Success) | `var(--color-background-alerting-success-base)` (#1b8500) | transparent | `var(--color-text-gray-white)` (#ffffff) | `icon-status-green` (#1B8500) |
| Status Indicator (Critical) | `var(--color-background-alerting-critical-base)` (#af0000) | transparent | `var(--color-text-gray-white)` (#ffffff) | `icon-status-red` (#AF0000) |
## States (Dark Theme)

Dark theme uses the same semantic tokens as **States (Light Theme)**. Resolved values for `[data-theme="dark"]` / `.ids-theme-dark` (and program overlays) live in theme CSS:

- `components/ids-theme.css`
- `components/<program>-theme.css` when a program overlays IDS (for example `components/dap-theme.css`)

Duplicate the full state matrix in this section only when a dark row genuinely uses different `var(--...)` references than the corresponding light row.

## Interactions
- **Brand area:** product name / optional logo — typically non-interactive; host may wrap logo in a link.
- **`iconsSlot` (optional):** each projected control handles its own activation (icon button `onClick`, search submit, dropdown open/close). Masthead provides layout and shared action-button chrome only. Omit when unused.
- **`appLauncherSlot` (optional):** App Launcher owns open/close; trigger uses masthead token styling (`triggerVariant="masthead"`). Omit when unused.
- **`avatarSlot` (optional):** account menu or profile action; host wires `onClick` on `MastheadAvatar` or custom avatar button. Omit when unused.
- Hover / pressed / `aria-expanded` visual feedback uses Navigation Item and User Section rows in the state matrix below.
- Search is never a Masthead built-in — host places a search field or icon trigger inside `iconsSlot` when needed.
### Accessibility
- Focus ring: applies to action elements (icon buttons, avatar button) only — not the masthead container. Style: `var(--border-width-border-default)` dashed `var(--color-border-gray-white)`, `outline-offset: -1px` (inset)
- Keyboard navigation: Arrow keys, Enter, Tab, Escape
- Screen reader support: Proper ARIA attributes for navigation
- High contrast: Meets WCAG AA standards with provided colors
- Semantic HTML: Use header element with nav landmarks
- Focus management: Logical tab order through masthead items
- Status announcements: Screen reader announces status changes

### Behavior & guidelines
- Use masthead for application branding and top-level utility actions.
- **Prefer composition** for `iconsSlot`: project a HeaderActions-style child rather than passing a declarative icon config array to Masthead or App Shell.
- Maintain consistent branding across the application.
- Provide clear visual hierarchy with proper spacing.
- Use responsive design for mobile devices.
- Test with screen readers for proper navigation announcement.
- Consider sticky positioning for long pages.
- Provide visual feedback for all interactions.
- Use consistent styling across masthead variants.
- When embedding in App Shell, pass composed actions as `headerActions` (maps to `iconsSlot`).
## Composition & API (runtime)

### Root props / slots

| Prop / slot | Type | Required | Contract |
|---|---|---|---|
| `productName` | `string` \| `RenderableNode` | yes | Brand label in `MastheadBrandSlot` |
| `logo` | `RenderableNode` | no | Optional host-composed leading mark; omit for product-name-only |
| `iconsSlot` | `RenderableNode` | no | Optional host-composed utilities (search, action icons, …); omit for none |
| `appLauncherSlot` | `RenderableNode` | no | Optional host-composed App Launcher; omit when unused |
| `avatarSlot` | `RenderableNode` | no | Optional host-composed avatar / account control; omit when unused |

**All chrome except `productName` is optional and user-defined.** Do not hardcode search, action icons, product logo, App Launcher, or avatar inside Masthead codegen.

**No root action callback.** Do not add `onMastheadAction`, `actions[]`, or similar — handlers attach to composed children.

### Composed actions example (React reference)

```tsx
<Masthead
  productName="Product Name"
  logo={<ProductLogo />}
  iconsSlot={
    <div className="masthead-header-actions">
      <MySearchInput />
      <MastheadActionButtonContainer>
        <MastheadActionIconButton
          aria-label="What's New"
          icon={<Icon shapeName="alert-bell-16" />}
          onClick={() => setWhatsNewOpen(true)}
        />
        <MySettingsDropdown />
      </MastheadActionButtonContainer>
    </div>
  }
  appLauncherSlot={<AppLauncher triggerVariant="masthead" products={products} />}
  avatarSlot={<MastheadAvatar initials="DT" onClick={openUserMenu} />}
/>
```

### `MastheadActionButtonContainer`

- `children: RenderableNode` (required) — horizontal cluster of action controls
- Extends native container props (`className`, `data-*`, …)
- Layout: row flex, tokenized spacing per `Masthead.module.css` / codegen output

### `MastheadActionIconButton`

Presentational icon button for masthead chrome. **Extends native `button` props** — host supplies `onClick`, `disabled`, `aria-expanded`, etc.

| Prop | Type | Required | Notes |
|---|---|---|---|
| `icon` | `RenderableNode` | yes | 16×16 glyph; use `Icon` `variant="mask"` for asset icons |
| `aria-label` | `string` | yes | Accessible name |
| `aria-expanded` | `boolean` | no | When button controls an open panel/dropdown |
| `badgeCount` | `number` | no | Renders badge when > 0; `"99+"` when > 99 |
| `badgeType` | `"default"` \| `"controls"` \| `"critical"` \| `"warning"` \| `"disabled"` \| `"success"` | no | Defaults to `"critical"`. Use `"critical"` for Alerts, `"success"` for Jobs |
| `onClick` | `function` | no | Host click handler — **not** dispatched by Masthead root |

Alternative: wrap any control in product markup inside `iconsSlot` (e.g. Angular `nav-link nav-icon` divs) when masthead primitives are not used.

### `MastheadAvatar`

- Figma source: `.Masthead-Element-UserInitials` (`10130:29944`) in IDS Design Library — variants `User Settings=Initials` (`10130:29943`) and `User Settings=Icon` (`10130:29945`)
- Chip: 32×32 circle, `border: var(--border-width-border-1) solid var(--color-border-gray-white)`, transparent fill on masthead brand background
- `initials?: string` — centered in chip; Figma sample `"DT"`
- `icon?: RenderableNode` — icon variant; resolve **`user-single`** at **16×16** with **`var(--color-icon-gray-white)`** via shared Icon primitive (see below)
- `imageSrc?: string` — photo URL (fills full chip, no ring)
- `imageAlt?: string`
- Extends native `button` props — host wires `onClick` for account menu

### Product Logo (optional)
- Figma: `Masthead-Main` variant **`Show Product Icon=Yes`** (`10130:29512`) vs **`Show Product Icon=No`** (`10130:29494`)
- **Optional:** omit `logo` prop / slot content entirely when no product mark is needed
- **When provided:** render **before** `productName` in the brand slot at **32×32px**
- **Rendering contract:** compose **only** through the shared **Icon** component (`shapeName` + size) — no raw `<img>`, CSS `maskImage`, or inline asset paths in Masthead consumers
- **Canonical Figma slug (sample):** `appic-dp-cloud-blue` — Product Icons / Data Protection Cloud (`44484:722`, node `10130:29521`)
- **Asset file:** `assets/icons/appic-dp-cloud-blue.svg`
- **Icon mode:** full-color / fixed-fill product glyphs use **`Icon` `variant="img"`**; monochrome marks may use default tintable mode when the asset supports `currentColor`
- **Size:** `style={{ width: 32, height: 32 }}` (or equivalent 32×32 box on the Icon root)
- Storybook reference example:
  ```tsx
  <IdsMasthead
    logo={
      <Icon
        shapeName="appic-dp-cloud-blue"
        variant="img"
        title="Product logo"
        style={{ width: 32, height: 32 }}
      />
    }
    productName="Product Name"
    /* … */
  />
  ```

### Avatar icon variant (`User Settings=Icon`)
- **Icon slug:** `user-single` (`assets/icons/user-single.svg`; Figma component `user-single`, node `44484:604`)
- **Render size:** 16×16px
- **Color token:** `var(--color-icon-gray-white)` (#ffffff)
- **Do not** use `user-single-16`, raw `<img src="*.svg">`, or `imageSrc` for design-system SVG glyphs

### Avatar chip typography (initials)
- `font-size: var(--font-size-body-2)`
- `font-weight: 400`
- `font-variation-settings: 'wdth' 100` (required for Roboto variable font to render correctly)
- `line-height: var(--font-line-height-line-height-20)`
### Variants
- **Default**: Standard brand masthead (product name only — no logo)
- **With Product Logo**: Figma `Show Product Icon=Yes` — optional 32×32 product icon before product name
- **With Search**: Masthead with integrated search
- **With Notifications**: Masthead with notification badges
- **With User Menu**: Masthead with user account section
- **Sticky**: Masthead that stays visible on scroll
- **Compact**: Reduced height for space-constrained interfaces
- **Dark**: Dark themed masthead
- **With Status**: Masthead with system status indicators

### Consumer usage (developer integration)

Storybook **Spec Generated → IDS → Masthead**:
- **Default** — `productName` only (all other chrome omitted)
- **With Product Logo / With Figma sample actions / With App Launcher / With Avatar Initials / User Icon Avatar** — each optional slot in isolation
- **Full host composition** — logo + Figma sample `iconsSlot` + App Launcher + avatar
- **Developer usage** / **Composed icons slot** — hand-maintained integration demos with live code panels

Reference implementation: `storybook/src/components/Masthead.tsx`, stories in `storybook-generated/ids/src/components/Masthead.stories.tsx`.

## Codegen Contract (Framework-Agnostic Blueprint)

### Deterministic slot order

Emit DOM/framework nodes in this order:

| Order | Slot id | Notes |
|---:|---|---|
| 1 | `MastheadRoot` | `<header>` landmark |
| 2 | `MastheadBrandSlot` | logo (optional, host-composed) + product name (required) |
| 3 | `MastheadActionsRow` | right-aligned flex row — emit only when at least one of slots 4–6 is present |
| 4 | `MastheadIconsSlot` | `iconsSlot` projection — **optional, host-composed** (search / action icons / …) |
| 5 | `MastheadAppLauncherSlot` | `appLauncherSlot` — **optional, host-composed** |
| 6 | `MastheadAvatarSlot` | `avatarSlot` — **optional, host-composed** |

**Composition rule:** Slots 4–6 are opaque projection points. Generate them only when the host supplies content. Do not hardcode a fixed icon list, search control, App Launcher, or avatar unless emitting a Storybook / spec-accurate **sample**.

### Figma reference action order (sample only)

When generating **Spec Accurate Design** demos, the sample inside `MastheadIconsSlot` MAY match Figma left → right:

1. Global Search (`search-16`)
2. Alerts (`alert-bell-16`) — `badgeType="critical"` when badge shown
3. Jobs (`jobs-queue-stack`) — `badgeType="success"` when badge shown
4. System Settings (`setting-gear-16`)
5. Help (`help-circ-16`)

Production integrations MUST use host-composed `iconsSlot` instead of this default when product actions differ.

### Behavior contract

- Brand area remains left-aligned; `MastheadActionsRow` right-aligned when present.
- `logo`, `iconsSlot` (search / action icons), `appLauncherSlot`, and `avatarSlot` are all **optional** and **host-defined**.
- `iconsSlot` accepts arbitrary host content; Masthead does not interpret action semantics.
- `MastheadActionIconButton` (when used) maintains 16×16 icon contract and tokenized hover/active/`aria-expanded` states.
- Optional app launcher integrates in `appLauncherSlot` without breaking spacing.
- Event handlers attach to composed children, not Masthead root.

### Fallback/error rules

- Missing `logo` → product name-only brand slot.
- Missing `iconsSlot` → omit utility region (no default search or action icons).
- Missing `appLauncherSlot` → omit App Launcher region.
- Missing `avatarSlot` → omit avatar region (no default initials chip).
- Missing all of `iconsSlot` / `appLauncherSlot` / `avatarSlot` → omit `MastheadActionsRow` entirely.
- Unknown children inside `iconsSlot` → render as-is; Masthead must not strip or reorder host projection.

### Icon primitive and asset delivery (codegen)

Use whenever codegen targets a stack that already ships an **Icon** (or equivalent) layer. The **logical contract** is slug + size + semantic color token — not a specific DOM technique (`mask`, `<img>`, inline SVG).

**When the target library exposes an Icon / glyph component**
- **Prefer it** for all masthead monochrome glyphs (action buttons, avatar icon variant, app launcher trigger) instead of hand-rolling asset paths or per-component asset globs in Masthead.
- Pass a **stable asset slug** via whatever prop the library uses (`shapeName`, `name`, `icon`, …). Slugs must match the **asset contract** table below.
- Map **color** from this spec's state tables (`var(--color-icon-gray-white)` on masthead chrome). Set on the interactive host (button) and/or the icon primitive per library convention.
- **Size:** action icons and avatar icon variant are **16×16px**; avatar chip ring remains **32×32px**.

**When no Icon primitive exists**
- Fallback remains slug-driven: inline SVG with `currentColor`, sprite, or framework asset pipeline — same slug, same **16×16** box, same token → color mapping. Do not rely on `color` CSS on `<img>` for fixed-fill SVG assets.

**Asset contract (masthead icons — illustrative slugs)**

| Slot | Slug | File |
|---|---|---|
| Global Search | `search-16` | `assets/icons/search-16.svg` |
| Alerts | `alert-bell-16` | `assets/icons/alert-bell-16.svg` |
| Jobs | `jobs-queue-stack` | `assets/icons/jobs-queue-stack.svg` |
| System Settings | `setting-gear-16` | `assets/icons/setting-gear-16.svg` |
| Help | `help-circ-16` | `assets/icons/help-circ-16.svg` |
| App Launcher | `grid-square-9-16` | `assets/icons/grid-square-9-16.svg` |
| Avatar (icon variant) | `user-single` | `assets/icons/user-single.svg` |
| Product Logo (optional) | `appic-dp-cloud-blue` | `assets/icons/appic-dp-cloud-blue.svg` |

Any slug matching `^[a-z0-9-]+$` under `assets/icons/` is valid at runtime; the table is illustrative, not a closed set. Product-logo slugs come from the **Product Icons** Figma library; pass the programme-specific slug at runtime.

**Codegen module resolution (this repository)**
- React IDS: read `config/design_systems/ids.yaml` → `codegen.react.icon_component_module` (`storybook/src/components/Icon`).
- Emit equivalent imports for Angular / Vue / Lit from that programme's design-system config when present; otherwise infer from existing project components.

**IDS / Storybook reference implementation (demo + spec validation only)**
- Shared **`Icon`** in `storybook/src/components/Icon.tsx` resolves `shapeName` → `assets/icons/*.svg` and applies tinting internally (default **`variant` `mask`** for monochrome assets; **`variant` `img`** only for fixed multi-color glyphs — not used on masthead chrome icons).
- **Spec Generated** stories and `storybook/src/components/Masthead.tsx` compose masthead icons **through `Icon`** for visual proof against this spec. That component choice validates slug/size/token contracts; downstream app codegen may use a different Icon implementation as long as the logical contract holds.
- Example (Storybook reference only):
  ```tsx
  <Icon shapeName="user-single" color="var(--color-icon-gray-white)" style={{ width: 16, height: 16 }} />
  ```

### Validation checklist

- [x] Slot order: brand → `iconsSlot` → `appLauncherSlot` → `avatarSlot` (each optional except brand `productName`)
- [x] `iconsSlot` is a projection/composition point — no mandatory fixed icon list / search in production codegen
- [x] `logo`, `appLauncherSlot`, and `avatarSlot` are optional host projections — no runtime defaults
- [x] No root `onMastheadAction` / `actions[]` API on Masthead
- [x] `MastheadActionIconButton` extends button; `aria-label` required; focus ring on action elements only
- [x] App Shell `headerActions` maps to `iconsSlot` when composed in shell
- [x] Live Figma nodes `10130:29493`, `10130:29494`, `10130:29512`, App Shell instance `43478:46181` referenced in Source Mapping
- [x] Reference implementation matches slot API (`Masthead.tsx`)
- [x] Masthead monochrome icons resolve via shared Icon primitive (or documented slug fallback) — no ad-hoc `<img src>` for tintable SVGs in reference implementation
- [x] Avatar icon variant uses slug `user-single` at 16×16 with `var(--color-icon-gray-white)`
- [x] Optional product logo renders only when `logo` is provided; uses shared **Icon** at 32×32 (no raw `<img>` in consumers)
- [ ] Automated visual regression across all Navigation Item states (manual Storybook QA)
- [ ] Dark theme spot-check when programme theme overlays IDS masthead tokens

## Storybook proof and codegen consumers

**Spec Generated** stories prove that `design-spec.md` is machine-consumable. Downstream codegen must:

1. Read this spec (and `components/ids-theme.css`) as the single source of truth for slug, size, and token contracts.
2. Emit styles **only** via semantic `var(--…)` from the theme file.
3. Keep `storybook/src/components/Masthead.tsx` aligned with the spec when drift is found (stories validate the contract).

### Icon usage in Spec Generated stories (demo + validation only)

Masthead stories (`storybook-generated/ids/src/components/Masthead.stories.tsx`) render all glyphs through the shared **`Icon`** component (`storybook/src/components/Icon.tsx`) — not by inlining `maskImage` / `<img>` in story files:

| Slot | `shapeName` | Size | Color token |
|---|---|---|---|
| Help (default story) | `help-circ-16` | 16×16 | inherited `var(--color-icon-gray-white)` from `.avatarAction` / `.actionIconButton` |
| Avatar icon variant | `user-single` | 16×16 | `var(--color-icon-gray-white)` |
| Product logo (optional) | `appic-dp-cloud-blue` | 32×32 | full-color glyph via `Icon variant="img"` |
| App launcher trigger | `grid-square-9-16` | 16×16 | `var(--color-icon-gray-white)` on masthead trigger |

The **`Icon`** component owns rendering mechanics (`mask` / `inline` / `img`); stories and reference Masthead code only pass **`shapeName`**, **`color`**, and **size**. Do not copy `Icon.tsx` internals into consumer apps — honor the logical contract above.

## Implementation Notes

### Icon color (framework-agnostic)
- All masthead monochrome icons use **`var(--color-icon-gray-white)`**, not `var(--color-text-gray-white)`.
- Interactive hosts (icon buttons, avatar button, app launcher masthead trigger) set `color: var(--color-icon-gray-white)` so tintable glyphs inherit the correct token.

### Action icons and badge rendering
- Products compose action icons inside `iconsSlot`; the Figma sample slugs below are reference defaults for Storybook only (see **Icon primitive and asset delivery → Asset contract**):
  - Global Search: `shapeName="search-16"`
  - Alerts: `shapeName="alert-bell-16"` — paired with `badgeType="critical"` (red)
  - Jobs: `shapeName="jobs-queue-stack"` — paired with `badgeType="success"` (green)
  - System Settings: `shapeName="setting-gear-16"`
  - Help: `shapeName="help-circ-16"`
- All action icons render at `16×16px` and must use `variant="mask"` (default) — these SVG assets contain hardcoded `fill` values and cannot be recolored via `variant="inline"`.
- Use the shared `Badge` component (`Badge.tsx`) — do **not** hand-roll badge CSS.
- `badgeCount > 0` renders the badge; `badgeCount` of 0 or `undefined` hides it entirely.
- Values above 99 are capped and displayed as `"99+"`.
- `badgeType` controls the badge color variant (defaults to `"critical"`). Always pass `badgeType="success"` for the Jobs icon and `badgeType="critical"` for the Alerts icon.
- The `.badgeWrapper` span uses `position: absolute; top: 12px; left: 23px; pointer-events: none` to float the badge over the icon. The parent `actionIconButton` is `position: relative` in `Masthead.module.css`.

### Button background in default state
- All interactive buttons on the masthead (icon buttons, avatar, app launcher trigger) use `background: var(--color-background-masthead-base)` in the default state, **not `transparent`**.
- Although visually identical to transparent (since the parent masthead shares the same color), Figma specifies an explicit `masthead-brand-base` token for the default state.

### Open state (aria-expanded)
- Set `aria-expanded="true"` on a button when it controls an open dropdown or panel.
- `[aria-expanded="true"]` → `masthead-brand-stronger` background (same as active/pressed).
- `[aria-expanded="true"]:hover` → `masthead-brand-strong` background (hover always wins over open state).

### Avatar icon vs photo
- **Icon variant:** slug **`user-single`**, **16×16px**, **`var(--color-icon-gray-white)`** via shared Icon primitive (Storybook: `Icon` + `shapeName`).
- **Initials variant:** `initials` prop; text **`var(--color-text-gray-white)`** inside 32×32 white ring.
- **Photo variant:** `imageSrc` for user photos — fills 32×32 chip (no ring).
- Do not use `<img src="*.svg">` or `imageSrc` for design-system SVG glyphs.

### AppLauncher integration
- Masthead trigger: `color: var(--color-icon-gray-white)`; glyph slug **`grid-square-9-16`**, **16×16** — compose via shared **`Icon`** in Storybook reference (`AppLauncher.tsx`).

## Source Mapping

| Property | Value |
|---|---|
| Design system | IDS |
| Figma file | [IDS Design Library](https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library) |
| File key | `0bHk3XhrjFhowgFkz9yLr4` |
| Component set | `Masthead-Main` [`10130:29493`](https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=10130-29493&m=dev) |
| Variant `Product Icon=No` | [`10130:29494`](https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=10130-29494&m=dev) |
| Variant `Product Icon=Yes` | [`10130:29512`](https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=10130-29512&m=dev) |
| Avatar element | `.Masthead-Element-UserInitials` [`10130:29944`](https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=10130-29944&m=dev) — initials `10130:29943`, icon `10130:29945` |
| Product logo sample | `appic-dp-cloud-blue` (`10130:29521`) |
| App Shell composed instance | `43478:46181` (in App Shell `43478:46307`) |
| Exploration token frame (secondary) | `9054:24736` in file `VZJ48bbVYrIynw8DdSukWw` |
| Verification method | Figma MCP — `get_metadata`, `get_design_context`, `get_variable_defs` |
| Last live verification | 2026-06-19 |
| Design spec path | `components/ids/masthead/design-spec.md` |
| Component map entry | `data/component-figma-map.json` → component `Masthead` |
| Storybook implementation | `storybook/src/components/Masthead.tsx`, `storybook/src/components/Masthead.module.css`, `storybook-generated/ids/src/components/Masthead.stories.tsx` |
| Shared Icon primitive | `storybook/src/components/Icon.tsx` (`config/design_systems/ids.yaml` → `codegen.react.icon_component_module`) |
| Related pattern | [`components/ids/app-shell/design-spec.md`](../app-shell/design-spec.md) → `headerActions` → `iconsSlot` |
