# Masthead Design Spec

## Metadata
- Component: Masthead
- Category: Navigation
- Figma: https://www.figma.com/design/VZJ48bbVYrIynw8DdSukWw/-Exploration-only--IDS-with-variables?node-id=9054-24736&m=dev
- Node ID: 9054-24736
## Anatomy
- Masthead container with brand background
- Brand slot (left-aligned): optional **Product Logo** + **Product Name**
- Action slot (right-aligned), fixed order left → right:
  1. Global Search icon button (`search-16`)
  2. Alerts icon button (`alert-bell-16`) — supports critical badge
  3. Jobs icon button (`jobs-queue-stack`) — supports success badge
  4. System Settings icon button (`setting-gear-16`)
  5. Help icon button (`help-circ-16`)
  6. App Launcher slot (`grid-square-9-16`)
  7. Avatar / User Settings slot — initials (`User Settings=Initials`) or `user-single` icon at 16×16 (`User Settings=Icon`)
- Focus ring for keyboard navigation (icon buttons + avatar button only)
- Optional notification badges on Alerts and Jobs
## Layout & Measurements
- Standard height: 56px (`--scale-56`)
- Brand slot vertical alignment: product info block top offset ~12.5px from masthead top (Figma `10130:29520`)
- Product logo (optional): **32×32px** (`var(--scale-32)`), **8px** gap (`var(--spacing-space-8)`) before product name when present
- Product name: header-6 typography — `var(--font-size-header-6)` / `var(--font-line-height-line-height-32)`, `var(--color-text-white)`; truncates with `text-overflow: ellipsis` when longer than **45ch**; keeps a minimum of **1ch** visible; `white-space: nowrap` and `overflow: hidden`
- Action group spacing: **16px** between the brand/product-name area and the right action group (`margin-left: var(--spacing-space-16, 16px)`)
- Horizontal padding: 16px left, 8px right
- Masthead overflow: `overflow: hidden` to prevent horizontal scrolling in the masthead area; content truncates instead of scroll
- Bottom border: `var(--border-width-border-1)` solid `var(--color-border-transparent-neutral)`
- Border radius: 0 (full-width masthead)
- Action element focus ring: `var(--border-width-border-default)` dashed `var(--color-border-white)`, `outline-offset: -1px` (inset) — applies to icon buttons and avatar button only
- Action icon button: 16px × 16px icon, padding 19px 16px
- Avatar chip: 32px × 32px circle (`var(--scale-32)`), button padding `11px` vertical / `var(--padding-padding-8)` horizontal
- Avatar icon (icon variant): `user-single` slug, rendered at **16×16px** inside the 32×32 chip; color **`var(--color-icon-white)`** (#ffffff)
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
| Product Logo (optional) | transparent | none | — | product icon slug at **32×32** via **Icon** (`variant="img"` for full-color Product Icons) |
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
| Avatar Chip (Initials) | transparent | `var(--color-border-white)` (#ffffff) 1px ring | `var(--color-text-white)` (#ffffff) | — |
| Avatar Chip (Icon) | transparent | `var(--color-border-white)` (#ffffff) 1px ring | — | `user-single` at 16×16, `var(--color-icon-white)` (#ffffff) |
| Status Indicator (Success) | `var(--color-background-alerting-success)` (#1b8500) | transparent | `var(--color-text-white)` (#ffffff) | `icon-status-green` (#1B8500) |
| Status Indicator (Critical) | `var(--color-background-alerting-critical)` (#af0000) | transparent | `var(--color-text-white)` (#ffffff) | `icon-status-red` (#AF0000) |
## States (Dark Theme)
- Uses semantic tokens that automatically adapt to dark theme
- Surface tokens: `var(--color-background-surface-1)` (#f4f4f4), `var(--color-background-surface-2)` (#ffffff)
- Text and border colors remain consistent via semantic variables
- Masthead maintains consistent branding
- Status indicators maintain visibility
## Interactions
- Click navigation items to navigate to respective pages
- Hover provides visual feedback with background changes
- User section shows account options on click
- Status indicators show system state
- Search functionality within masthead (optional)
### Accessibility
- Focus ring: applies to action elements (icon buttons, avatar button) only — not the masthead container. Style: `var(--border-width-border-default)` dashed `var(--color-border-white)`, `outline-offset: -1px` (inset)
- Keyboard navigation: `Tab` focuses action items in order; `ArrowLeft` / `ArrowRight` move focus between masthead action buttons (toolbar pattern, wrapping at ends); `Home` focuses the first action; `End` focuses the last action; `Enter` / `Space` activates the focused button; `Escape` closes an open dropdown/panel
- Screen reader support: Proper ARIA attributes for navigation
- High contrast: Meets WCAG AA standards with provided colors
- Semantic HTML: Use header element with nav landmarks
- Focus management: Logical tab order through masthead items
- Status announcements: Screen reader announces status changes

### Behavior & guidelines
- Use masthead for application branding and primary navigation
- Maintain consistent branding across the application
- Provide clear visual hierarchy with proper spacing
- Use responsive design for mobile devices
- Test with screen readers for proper navigation announcement
- Consider sticky positioning for long pages
- Provide visual feedback for all interactions
- Use consistent styling across masthead variants
## Composition & API (runtime)
- `productName: string` (required)
- `logo?: RenderableNode` (optional) — **Product Logo**; when provided, renders in the brand slot immediately before `productName`. When omitted, only the product name is shown (Figma `Show Product Icon=No`, node `10130:29494`). Must compose through the shared **Icon** primitive only — see **Product Logo (optional)** below.
- `iconsSlot?: RenderableNode`
- `appLauncherSlot?: RenderableNode`
- `avatarSlot: RenderableNode` (required)

### MastheadActionIconButton
- `icon: ReactNode` (required) — monochrome glyph: stable **slug**, **16×16px**, **`var(--color-icon-white)`** (see **Icon primitive and asset delivery**)
- `aria-label: string` (required)
- `aria-expanded?: boolean` — set when button controls an open panel/dropdown
- `badgeCount?: number` — renders badge when > 0; displays `"99+"` when > 99
- `badgeType?: "default" | "controls" | "critical" | "warning" | "disabled" | "success"` — defaults to `"critical"`. Use `"critical"` for Alerts, `"success"` for Jobs

### MastheadAvatar
- Figma source: `.Masthead-Element-UserInitials` (`10130:29944`) in IDS Design Library — variants `User Settings=Initials` (`10130:29943`) and `User Settings=Icon` (`10130:29945`)
- Chip: 32×32 circle, `border: var(--border-width-border-1) solid var(--color-border-white)`, transparent fill on masthead brand background
- `initials?: string` — centered in chip; Figma sample `"DT"`
- `icon?: ReactNode` — icon variant; resolve **`user-single`** at **16×16** with **`var(--color-icon-white)`** via shared Icon primitive (see below)
- `imageSrc?: string` — photo URL (fills full chip, no ring)
- `imageAlt?: string`

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
- **Color token:** `var(--color-icon-white)` (#ffffff)
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
## Codegen Contract (Framework-Agnostic Blueprint)
- Deterministic slot order:
  1. `MastheadRoot`
  2. `MastheadBrandSlot` (logo + product name)
  3. `MastheadActionsSlot` (icons, app launcher, avatar)
- Icon action order within `MastheadActionsSlot` (left → right, enforced by Figma):
  1. Global Search (`search-16`)
  2. Alerts (`alert-bell-16`) — `badgeType="critical"` when badge shown
  3. Jobs (`jobs-queue-stack`) — `badgeType="success"` when badge shown
  4. System Settings (`setting-gear-16`)
  5. Help (`help-circ-16`)
  6. App Launcher (`grid-square-9-16`)
  7. Avatar / User Settings — initials or `user-single` (16×16, `var(--color-icon-white)`)
- Behavior contract:
  - brand area remains left-aligned and actions right-aligned
  - action buttons maintain 16x16 icon contract and tokenized hover/active states
  - optional app launcher integrates in action row without breaking spacing
- Fallback/error rules:
  - missing **product logo** (`logo` omitted) → product name-only brand slot (Figma `Show Product Icon=No`)
  - missing avatar falls back to initials/avatar placeholder

### Icon primitive and asset delivery (codegen)

Use whenever codegen targets a stack that already ships an **Icon** (or equivalent) layer. The **logical contract** is slug + size + semantic color token — not a specific DOM technique (`mask`, `<img>`, inline SVG).

**When the target library exposes an Icon / glyph component**
- **Prefer it** for all masthead monochrome glyphs (action buttons, avatar icon variant, app launcher trigger) instead of hand-rolling asset paths or per-component asset globs in Masthead.
- Pass a **stable asset slug** via whatever prop the library uses (`shapeName`, `name`, `icon`, …). Slugs must match the **asset contract** table below.
- Map **color** from this spec's state tables (`var(--color-icon-white)` on masthead chrome). Set on the interactive host (button) and/or the icon primitive per library convention.
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
- Shared **`Icon`** in `storybook/src/components/Icon.tsx` resolves `shapeName` → `assets/icons/*.svg` and applies tinting internally (default **`variant` `mask`** for monochrome assets; **`variant` `img`** only for fixed multi-color glyphs — not used on masthead).
- **Spec Generated** stories and `storybook/src/components/Masthead.tsx` compose masthead icons **through `Icon`** for visual proof against this spec. That component choice validates slug/size/token contracts; downstream app codegen may use a different Icon implementation as long as the logical contract holds.
- Example (Storybook reference only):
  ```tsx
  <Icon shapeName="user-single" color="var(--color-icon-white)" style={{ width: 16, height: 16 }} />
  ```

### Validation checklist
- [ ] Implement masthead navigation functionality
- [x] Add proper focus management
- [x] Test keyboard navigation (Arrows, Enter, Tab, Escape)
- [ ] Verify ARIA attributes and roles
- [ ] Test hover and focus states
- [ ] Implement user menu functionality
- [ ] Add status indicators
- [ ] Test dark theme compatibility
- [ ] Verify screen reader announcements
- [x] Test responsive behavior
- [ ] Masthead monochrome icons resolve via shared Icon primitive (or documented slug fallback) — no ad-hoc `<img src>` for tintable SVGs in reference implementation
- [ ] Avatar icon variant uses slug `user-single` at 16×16 with `var(--color-icon-white)`
- [ ] Optional product logo renders only when `logo` is provided; uses shared **Icon** at 32×32 (no raw `<img>` in consumers)

## Storybook proof and codegen consumers

**Spec Generated** stories prove that `design-spec.md` is machine-consumable. Downstream codegen must:

1. Read this spec (and `components/ids-theme.css`) as the single source of truth for slug, size, and token contracts.
2. Emit styles **only** via semantic `var(--…)` from the theme file.
3. Keep `storybook/src/components/Masthead.tsx` aligned with the spec when drift is found (stories validate the contract).

### Icon usage in Spec Generated stories (demo + validation only)

Masthead stories (`storybook-generated/ids/src/components/Masthead.stories.tsx`) render all glyphs through the shared **`Icon`** component (`storybook/src/components/Icon.tsx`) — not by inlining `maskImage` / `<img>` in story files:

| Slot | `shapeName` | Size | Color token |
|---|---|---|---|
| Help (default story) | `help-circ-16` | 16×16 | inherited `var(--color-icon-white)` from `.avatarAction` / `.actionIconButton` |
| Avatar icon variant | `user-single` | 16×16 | `var(--color-icon-white)` |
| Product logo (optional) | `appic-dp-cloud-blue` | 32×32 | full-color glyph via `Icon variant="img"` |
| App launcher trigger | `grid-square-9-16` | 16×16 | `var(--color-icon-white)` on masthead trigger |

The **`Icon`** component owns rendering mechanics (`mask` / `inline` / `img`); stories and reference Masthead code only pass **`shapeName`**, **`color`**, and **size**. Do not copy `Icon.tsx` internals into consumer apps — honor the logical contract above.

## Implementation Notes

### Icon color (framework-agnostic)
- All masthead monochrome icons use **`var(--color-icon-white)`**, not `var(--color-text-white)`.
- Interactive hosts (icon buttons, avatar button, app launcher masthead trigger) set `color: var(--color-icon-white)` so tintable glyphs inherit the correct token.

### Action icons and badge rendering
- Slugs per slot: see **Icon primitive and asset delivery → Asset contract**.
- All action icons render at **16×16px**.
- Use the shared **`Badge`** component — do **not** hand-roll badge CSS.
- `badgeCount > 0` renders the badge; `badgeCount` of 0 or `undefined` hides it entirely.
- Values above 99 are capped and displayed as `"99+"`.
- `badgeType` controls the badge color variant (defaults to `"critical"`). Always pass `badgeType="success"` for the Jobs icon and `badgeType="critical"` for the Alerts icon.
- The `.badgeWrapper` span uses `position: absolute; top: 12px; left: 23px; pointer-events: none` to float the badge over the icon. The parent `actionIconButton` must be `position: relative` — this is already set in `Masthead.module.css`.

### Button background in default state
- All interactive buttons on the masthead (icon buttons, avatar, app launcher trigger) use `background: var(--color-background-masthead-brand-base)` in the default state, **not `transparent`**.
- Although visually identical to transparent (since the parent masthead shares the same color), Figma specifies an explicit `masthead-brand-base` token for the default state.

### Open state (aria-expanded)
- Set `aria-expanded="true"` on a button when it controls an open dropdown or panel.
- `[aria-expanded="true"]` → `masthead-brand-stronger` background (same as active/pressed).
- `[aria-expanded="true"]:hover` → `masthead-brand-strong` background (hover always wins over open state).

### Avatar icon vs photo
- **Icon variant:** slug **`user-single`**, **16×16px**, **`var(--color-icon-white)`** via shared Icon primitive (Storybook: `Icon` + `shapeName`).
- **Initials variant:** `initials` prop; text **`var(--color-text-white)`** inside 32×32 white ring.
- **Photo variant:** `imageSrc` for user photos — fills 32×32 chip (no ring).
- Do not use `<img src="*.svg">` or `imageSrc` for design-system SVG glyphs.

### AppLauncher integration
- Masthead trigger: `color: var(--color-icon-white)`; glyph slug **`grid-square-9-16`**, **16×16** — compose via shared **`Icon`** in Storybook reference (`AppLauncher.tsx`).

### Product name and keyboard behavior
- `productName` renders as an ellipsized single-line label with `max-width: 45ch` and `min-width: 1ch`; when the supplied `productName` is a string longer than 45 characters, the component wraps it in an `IdsTooltip` showing the full name on hover/focus
- The brand area and action group are separated by **16px**, and the left brand slot grows (`flex: 1 1 auto`) while the action group stays fixed (`flex-shrink: 0`)
- The action group container has `role="toolbar"` and `aria-label="Masthead actions"`; arrow-key focus management cycles through focusable buttons (icon buttons, app launcher trigger, avatar)
- Masthead root uses `overflow: hidden` so long content truncates rather than causing horizontal scroll

## Source Mapping
- Figma component: Masthead (9054-24736) — exploration file; avatar element verified against IDS Design Library `.Masthead-Element-UserInitials` (`10130:29944`, file `0bHk3XhrjFhowgFkz9yLr4`)
- Variable collection: UI Palettes, Typography tokens
- Semantic mapping: CSS custom properties with `var(--)` prefix
- Design source: Figma URL above + avatar node https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=10130-29944
- Last live verification: Figma MCP — avatar initials/icon nodes `10130:29943`, `10130:29945`, `10130:29469`; product logo `10130:29512`, `10130:29521` (2026-06-19)
- Component map entry: data/component-figma-map.json → component "Masthead" (category "Navigation"; node "9054-24736")
- Storybook implementation: `storybook/src/components/Masthead.tsx`, `storybook/src/components/Masthead.module.css`, `storybook-generated/ids/src/components/Masthead.stories.tsx`
- Shared Icon primitive (Storybook / demo): `storybook/src/components/Icon.tsx` (`config/design_systems/ids.yaml` → `codegen.react.icon_component_module`)
