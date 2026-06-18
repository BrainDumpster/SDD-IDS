# Masthead Design Spec

## Metadata

| Property | Value |
|---|---|
| Component | Masthead |
| Design system | IDS |
| Category | Navigation |
| Status | **active** |
| Version | 1.0.0 |
| Description | Application header bar with brand area, composed utility actions (`iconsSlot`), optional App Launcher, and user avatar. |
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
- **MastheadBrandSlot** (left): optional logo + required product name
- **MastheadActionsRow** (right), fixed **slot order** left → right:
  1. **`iconsSlot`** — composed utility actions (host-defined; see below)
  2. **`appLauncherSlot`** — App Launcher trigger (optional)
  3. **`avatarSlot`** — user avatar / account control (required)

### Composed `iconsSlot` (HeaderActions pattern)

The utility region is **not** a fixed icon list at runtime. The host projects any tree into `iconsSlot` and wires `(click)` / `onClick` on each interactive child — same pattern as a product **HeaderActions** child component.

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

App Launcher (`grid-square-9-16`) and avatar remain **separate slots** — not inside `iconsSlot`.

- Focus ring for keyboard navigation (icon buttons + avatar button only)
- Optional notification badges on Alerts and Jobs (composed or via `MastheadActionIconButton` badge props when implemented)
## Layout & Measurements
- Standard height: 56px (`--scale-56`)
- Horizontal padding: 16px left, 8px right
- Bottom border: `var(--border-width-border-1)` solid `var(--color-border-transparent-neutral)`
- Border radius: 0 (full-width masthead)
- Action element focus ring: `var(--border-width-border-default)` dashed `var(--color-border-white)`, `outline-offset: -1px` (inset) — applies to icon buttons and avatar button only
- Action icon button: 16px × 16px icon, padding 19px 16px
- Avatar chip: 32px × 32px circle, padding 11px 8px
- Minimum width: Full viewport width
- Badge dimensions: `height: 18px`, `min-width: 18px`, `border-radius: 100px`
- Badge padding (digit-based): 1 digit → fixed `width: 18px` (no padding); 2 digits → `padding: 0 4px`; 3+ digits → `padding: 0 5.5px`
- Badge position: `position: absolute; top: 12px; left: 23px` (button container must be `position: relative`)
- Badge overflow: renders `"99+"` when `badgeCount > 99`
## Tokens
### Colors
- White: `var(--color-text-white)` = #ffffff
- Brand base: `var(--color-background-controls-brand-base)` = #0076ce
- Component background: `var(--color-background-component)` = #ffffff
- Surface background: `var(--color-background-surface-1)` = #f4f4f4
- Surface 2: `var(--color-background-surface-2)` = #ffffff
- Neutral strong: `var(--color-text-neutral-strong)` = #252525
- Brand strong text: `var(--color-text-brand-strong)` = #0062ab
- Accessible border: `var(--color-border-accessible)` = #757575
- Brand border: `var(--color-border-brand-base)` = #0076ce
- White border: `var(--color-border-white)` = #ffffff
- Transparent neutral: `var(--color-border-transparent-neutral)` = #ffffff00

### Icons
- Brand icon: `var(--color-icon-brand-base)` = #0076ce
- Neutral icon: `var(--color-icon-neutral)` = #4d4d4d
- Neutral strong icon: `var(--color-icon-neutral-strong)` = #252525
- Brand strong icon: `var(--color-icon-brand-strong)` = #0062ab
- White icon: `var(--color-icon-white)` = #ffffff
- Standard gray icon: `icon-standard-gray` = #616161
- Dell Blue icon: `icon-DellBlue` = #0076CE
- Status icons: green (#1B8500), red (#AF0000), yellow (#FFC700), orange (#ED6400)

### Background Colors
- Gray lighter: `var(--color-background-gray-lighter)` = #f4f4f4
- Gray neutral alt: `var(--color-background-gray-neutral-alt)` = #eaeaea
- Gray base: `var(--color-background-gray-base)` = #757575
- Brand base: `var(--color-background-brand-base)` = #0076ce
- Brand lighter: `var(--color-background-brand-lighter)` = #ebf4fb
- Masthead brand base: `var(--color-background-masthead-brand-base)` = #0076ce
- Masthead brand strong: `var(--color-background-masthead-brand-strong)` = #0062ab
- Masthead brand stronger: `var(--color-background-masthead-brand-stronger)` = #06528a

### Alert Backgrounds
- Success background: `var(--color-background-alerting-success)` = #1b8500
- Critical background: `var(--color-background-alerting-critical)` = #af0000

### Badge Tokens
- Alerts badge background: `var(--color-background-alerting-critical)` = #af0000 (`badgeType="critical"`)
- Jobs badge background: `var(--color-background-alerting-success)` = #1b8500 (`badgeType="success"`)
- Badge border: `var(--color-border-white)` = #ffffff, `border-width: var(--border-width-border-1)`
- Badge text color: `var(--color-text-white)` = #ffffff
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
| Masthead Container | `var(--color-background-masthead-brand-base)` (#0076ce) | `var(--color-border-transparent-neutral)` (#ffffff00) bottom only | `var(--color-text-white)` (#ffffff) | `var(--color-icon-white)` (#ffffff) |
| Logo Section | `var(--color-background-masthead-brand-base)` (#0076ce) | transparent | `var(--color-text-white)` (#ffffff) | `var(--color-icon-white)` (#ffffff) |
| Navigation Item (Default) | `var(--color-background-masthead-brand-base)` (#0076ce) | transparent | `var(--color-text-white)` (#ffffff) | `var(--color-icon-white)` (#ffffff) |
| Navigation Item (Hover) | `var(--color-background-masthead-brand-strong)` (#0062ab) | transparent | `var(--color-text-white)` (#ffffff) | `var(--color-icon-white)` (#ffffff) |
| Navigation Item (Focus) | `var(--color-background-masthead-brand-base)` (#0076ce) | `var(--color-border-white)` (#ffffff) dashed inset | `var(--color-text-white)` (#ffffff) | `var(--color-icon-white)` (#ffffff) |
| Navigation Item (Active / Pressed) | `var(--color-background-masthead-brand-stronger)` (#06528a) | transparent | `var(--color-text-white)` (#ffffff) | `var(--color-icon-white)` (#ffffff) |
| Navigation Item (Open / aria-expanded) | `var(--color-background-masthead-brand-stronger)` (#06528a) | transparent | `var(--color-text-white)` (#ffffff) | `var(--color-icon-white)` (#ffffff) |
| Navigation Item (Open + Hover) | `var(--color-background-masthead-brand-strong)` (#0062ab) | transparent | `var(--color-text-white)` (#ffffff) | `var(--color-icon-white)` (#ffffff) |
| User Section (Default) | `var(--color-background-masthead-brand-base)` (#0076ce) | transparent | `var(--color-text-white)` (#ffffff) | `var(--color-icon-white)` (#ffffff) |
| User Section (Hover) | `var(--color-background-masthead-brand-strong)` (#0062ab) | transparent | `var(--color-text-white)` (#ffffff) | `var(--color-icon-white)` (#ffffff) |
| User Section (Open / aria-expanded) | `var(--color-background-masthead-brand-stronger)` (#06528a) | transparent | `var(--color-text-white)` (#ffffff) | `var(--color-icon-white)` (#ffffff) |
| User Section (Open + Hover) | `var(--color-background-masthead-brand-strong)` (#0062ab) | transparent | `var(--color-text-white)` (#ffffff) | `var(--color-icon-white)` (#ffffff) |
| Status Indicator (Success) | `var(--color-background-alerting-success)` (#1b8500) | transparent | `var(--color-text-white)` (#ffffff) | `icon-status-green` (#1B8500) |
| Status Indicator (Critical) | `var(--color-background-alerting-critical)` (#af0000) | transparent | `var(--color-text-white)` (#ffffff) | `icon-status-red` (#AF0000) |
## States (Dark Theme)

Dark theme uses the same semantic tokens as **States (Light Theme)**. Resolved values for `[data-theme="dark"]` / `.ids-theme-dark` (and program overlays) live in theme CSS:

- `components/ids-theme.css`
- `components/<program>-theme.css` when a program overlays IDS (for example `components/dap-theme.css`)

Duplicate the full state matrix in this section only when a dark row genuinely uses different `var(--...)` references than the corresponding light row.

## Interactions
- **Brand area:** product name / logo — typically non-interactive; host may wrap logo in a link.
- **`iconsSlot`:** each projected control handles its own activation (icon button `onClick`, search submit, dropdown open/close). Masthead provides layout and shared action-button chrome only.
- **`appLauncherSlot`:** App Launcher owns open/close; trigger uses masthead token styling (`triggerVariant="masthead"`).
- **`avatarSlot`:** account menu or profile action; host wires `onClick` on `MastheadAvatar` or custom avatar button.
- Hover / pressed / `aria-expanded` visual feedback uses Navigation Item and User Section rows in the state matrix below.
- Search may be an inline field or icon trigger depending on product composition inside `iconsSlot`.
### Accessibility
- Focus ring: applies to action elements (icon buttons, avatar button) only — not the masthead container. Style: `var(--border-width-border-default)` dashed `var(--color-border-white)`, `outline-offset: -1px` (inset)
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
| `logo` | `RenderableNode` | no | Leading mark before product name |
| `iconsSlot` | `RenderableNode` | no | Composed utility actions (HeaderActions pattern); omit for none |
| `appLauncherSlot` | `RenderableNode` | no | Trailing App Launcher before avatar |
| `avatarSlot` | `RenderableNode` | yes | User avatar / account control |

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
| `badgeType` | `"critical"` \| `"success"` \| … | no | `"critical"` for Alerts, `"success"` for Jobs |
| `onClick` | `function` | no | Host click handler — **not** dispatched by Masthead root |

Alternative: wrap any control in product markup inside `iconsSlot` (e.g. Angular `nav-link nav-icon` divs) when masthead primitives are not used.

### `MastheadAvatar`

- `initials?: string`
- `icon?: RenderableNode` — inline SVG icon (16×16, `color-icon-white`); use instead of `imageSrc` for design system icons
- `imageSrc?: string` — photo URL (fills full chip)
- `imageAlt?: string`
- Extends native `button` props — host wires `onClick` for account menu

### Avatar chip typography (initials)
- `font-size: var(--font-size-body-2)`
- `font-weight: 400`
- `font-variation-settings: 'wdth' 100` (required for Roboto variable font to render correctly)
- `line-height: var(--font-line-height-line-height-20)`
### Variants
- **Default**: Standard brand masthead
- **With Search**: Masthead with integrated search
- **With Notifications**: Masthead with notification badges
- **With User Menu**: Masthead with user account section
- **Sticky**: Masthead that stays visible on scroll
- **Compact**: Reduced height for space-constrained interfaces
- **Dark**: Dark themed masthead
- **With Status**: Masthead with system status indicators

### Consumer usage (developer integration)

Storybook **Spec Generated → IDS → Masthead → Developer usage** shows a canvas code panel and **Docs → Show code** snippet. **Composed icons slot** demonstrates search, badge buttons, and dropdown-style controls inside `iconsSlot`.

Reference implementation: `storybook/src/components/Masthead.tsx`, stories in `storybook-generated/ids/src/components/Masthead.stories.tsx`.

## Codegen Contract (Framework-Agnostic Blueprint)

### Deterministic slot order

Emit DOM/framework nodes in this order:

| Order | Slot id | Notes |
|---:|---|---|
| 1 | `MastheadRoot` | `<header>` landmark |
| 2 | `MastheadBrandSlot` | logo (optional) + product name |
| 3 | `MastheadActionsRow` | right-aligned flex row |
| 4 | `MastheadIconsSlot` | `iconsSlot` projection — **host-composed** |
| 5 | `MastheadAppLauncherSlot` | `appLauncherSlot` (optional) |
| 6 | `MastheadAvatarSlot` | `avatarSlot` (required) |

**Composition rule:** `MastheadIconsSlot` content is opaque to Masthead — generate a single projection point; do not hardcode a fixed icon list unless emitting a Storybook / spec-accurate sample.

### Figma reference action order (sample only)

When generating **Spec Accurate Design** demos, the sample inside `MastheadIconsSlot` MAY match Figma left → right:

1. Global Search (`search-16`)
2. Alerts (`alert-bell-16`) — `badgeType="critical"` when badge shown
3. Jobs (`jobs-queue-stack`) — `badgeType="success"` when badge shown
4. System Settings (`setting-gear-16`)
5. Help (`help-circ-16`)

Production integrations MUST use host-composed `iconsSlot` instead of this default when product actions differ.

### Behavior contract

- Brand area remains left-aligned; `MastheadActionsRow` right-aligned.
- `iconsSlot` accepts arbitrary host content; Masthead does not interpret action semantics.
- `MastheadActionIconButton` (when used) maintains 16×16 icon contract and tokenized hover/active/`aria-expanded` states.
- Optional app launcher integrates in `appLauncherSlot` without breaking spacing.
- Event handlers attach to composed children, not Masthead root.

### Fallback/error rules

- Missing `logo` → product name-only brand slot.
- Missing `iconsSlot` → omit utility region; App Launcher and avatar still render when provided.
- Missing `avatarSlot` → dev validation error; production fallback to initials placeholder chip.
- Unknown children inside `iconsSlot` → render as-is; Masthead must not strip or reorder host projection.

### Validation checklist

- [x] Slot order: brand → `iconsSlot` → `appLauncherSlot` → `avatarSlot`
- [x] `iconsSlot` is a projection/composition point — no mandatory fixed icon list in production codegen
- [x] No root `onMastheadAction` / `actions[]` API on Masthead
- [x] `MastheadActionIconButton` extends button; `aria-label` required; focus ring on action elements only
- [x] App Shell `headerActions` maps to `iconsSlot` when composed in shell
- [x] Live Figma nodes `10130:29493`, `10130:29494`, `10130:29512`, App Shell instance `43478:46181` referenced in Source Mapping
- [x] Reference implementation matches slot API (`Masthead.tsx`)
- [ ] Automated visual regression across all Navigation Item states (manual Storybook QA)
- [ ] Dark theme spot-check when programme theme overlays IDS masthead tokens

## Implementation Notes

### Icon color
- All icons on the masthead must use `var(--color-icon-white)`, **not** `var(--color-text-white)`.
- Icon buttons and avatar buttons set `color: var(--color-icon-white)` on the root element so `currentColor` resolves correctly for child icons.
- SVG assets in `assets/icons/` (e.g. `user-single-16.svg`, `grid-square-9-16.svg`) contain hardcoded `fill` values — **do not use `variant="inline"`** for these. Use `variant="mask"` (default) so CSS masking with `background-color: currentColor` applies the correct white color.
- Only use `Icon variant="inline"` for SVGs that are authored with `currentColor` strokes/fills (e.g. custom inline SVGs). Ensure SVG paths do not have explicit fill values.

### Action icons and badge rendering
- Products compose action icons inside `iconsSlot`; the Figma sample slugs below are reference defaults for Storybook only:
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
- All interactive buttons on the masthead (icon buttons, avatar, app launcher trigger) use `background: var(--color-background-masthead-brand-base)` in the default state, **not `transparent`**.
- Although visually identical to transparent (since the parent masthead shares the same color), Figma specifies an explicit `masthead-brand-base` token for the default state.

### Open state (aria-expanded)
- Set `aria-expanded="true"` on a button when it controls an open dropdown or panel.
- `[aria-expanded="true"]` → `masthead-brand-stronger` background (same as active/pressed).
- `[aria-expanded="true"]:hover` → `masthead-brand-strong` background (hover always wins over open state).

### Avatar icon vs photo
- Use the `icon` prop (inline SVG, 16×16, `color-icon-white`) for design system icons (e.g. `user-single-16`).
- Use the `imageSrc` prop for actual user photos — fills the full 32×32 chip.
- Do not use `<img src="*.svg">` for masthead icons; SVG served via `<img>` cannot be recolored through CSS.

### AppLauncher integration
- When using `AppLauncher` with `triggerVariant="masthead"`, the trigger button must set `color: var(--color-icon-white)` — not `var(--color-text-white)`.
- The app launcher grid icon (`grid-square-9-16`) has a hardcoded `fill` in the SVG asset. Do not use `variant="inline"` — use `variant="mask"` (default) so the icon inherits `color-icon-white` via `currentColor`.

## Source Mapping

| Property | Value |
|---|---|
| Design system | IDS |
| Figma file | [IDS Design Library](https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library) |
| File key | `0bHk3XhrjFhowgFkz9yLr4` |
| Component set | `Masthead-Main` [`10130:29493`](https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=10130-29493&m=dev) |
| Variant `Product Icon=No` | [`10130:29494`](https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=10130-29494&m=dev) |
| Variant `Product Icon=Yes` | [`10130:29512`](https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=10130-29512&m=dev) |
| App Shell composed instance | `43478:46181` (in App Shell `43478:46307`) |
| Exploration token frame (secondary) | `9054:24736` in file `VZJ48bbVYrIynw8DdSukWw` |
| Verification method | Figma MCP — `get_metadata`, `get_design_context`, `get_variable_defs` |
| Last live verification | 2026-06-17 |
| Design spec path | `components/ids/masthead/design-spec.md` |
| Component map entry | `data/component-figma-map.json` → component `Masthead` |
| Related pattern | [`components/ids/app-shell/design-spec.md`](../app-shell/design-spec.md) → `headerActions` → `iconsSlot` |
