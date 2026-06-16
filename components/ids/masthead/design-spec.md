# Masthead Design Spec

## Metadata
- Component: Masthead
- Category: Navigation
- Figma: https://www.figma.com/design/VZJ48bbVYrIynw8DdSukWw/-Exploration-only--IDS-with-variables?node-id=9054-24736&m=dev
- Node ID: 9054-24736
## Anatomy
- Masthead container with brand background
- Logo/brand identity (product name, left-aligned)
- Action slot (right-aligned), fixed order left → right:
  1. Global Search icon button (`search-16`)
  2. Alerts icon button (`alert-bell-16`) — supports critical badge
  3. Jobs icon button (`jobs-queue-stack`) — supports success badge
  4. System Settings icon button (`setting-gear-16`)
  5. Help icon button (`help-circ-16`)
  6. App Launcher slot (`grid-square-9-16`)
  7. Avatar / User Settings slot
- Focus ring for keyboard navigation (icon buttons + avatar button only)
- Optional notification badges on Alerts and Jobs
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
- Keyboard navigation: Arrow keys, Enter, Tab, Escape
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
- `iconsSlot?: RenderableNode`
- `appLauncherSlot?: RenderableNode`
- `avatarSlot: RenderableNode` (required)

### MastheadActionIconButton
- `icon: ReactNode` (required) — use `Icon variant="mask"` (default) for SVG assets with hardcoded fills; use `variant="inline"` only for SVGs authored with `currentColor`
- `aria-label: string` (required)
- `aria-expanded?: boolean` — set when button controls an open panel/dropdown
- `badgeCount?: number` — renders badge when > 0; displays `"99+"` when > 99
- `badgeType?: "default" | "controls" | "critical" | "warning" | "disabled" | "success"` — defaults to `"critical"`. Use `"critical"` for Alerts, `"success"` for Jobs

### MastheadAvatar
- `initials?: string`
- `icon?: ReactNode` — inline SVG icon (16×16, `color-icon-white`); use instead of `imageSrc` for design system icons
- `imageSrc?: string` — photo URL (fills full chip)
- `imageAlt?: string`

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
  7. Avatar / User Settings
- Behavior contract:
  - brand area remains left-aligned and actions right-aligned
  - action buttons maintain 16x16 icon contract and tokenized hover/active states
  - optional app launcher integrates in action row without breaking spacing
- Fallback/error rules:
  - missing logo falls back to product name-only rendering
  - missing avatar falls back to initials/avatar placeholder
### Validation checklist
- [ ] Implement masthead navigation functionality
- [ ] Add proper focus management
- [ ] Test keyboard navigation (Arrows, Enter, Tab, Escape)
- [ ] Verify ARIA attributes and roles
- [ ] Test hover and focus states
- [ ] Implement user menu functionality
- [ ] Add status indicators
- [ ] Test dark theme compatibility
- [ ] Verify screen reader announcements
- [ ] Test responsive behavior
## Implementation Notes

### Icon color
- All icons on the masthead must use `var(--color-icon-white)`, **not** `var(--color-text-white)`.
- Icon buttons and avatar buttons set `color: var(--color-icon-white)` on the root element so `currentColor` resolves correctly for child icons.
- SVG assets in `assets/icons/` (e.g. `user-single-16.svg`, `grid-square-9-16.svg`) contain hardcoded `fill` values — **do not use `variant="inline"`** for these. Use `variant="mask"` (default) so CSS masking with `background-color: currentColor` applies the correct white color.
- Only use `Icon variant="inline"` for SVGs that are authored with `currentColor` strokes/fills (e.g. custom inline SVGs). Ensure SVG paths do not have explicit fill values.

### Action icons and badge rendering
- Each action icon button uses a specific icon slug from `assets/icons/`. The correct slug per slot:
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
- The `.badgeWrapper` span uses `position: absolute; top: 12px; left: 23px; pointer-events: none` to float the badge over the icon. The parent `actionIconButton` must be `position: relative` — this is already set in `Masthead.module.css`.

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
- Figma component: Masthead (9054-24736)
- Variable collection: UI Palettes, Typography tokens
- Semantic mapping: CSS custom properties with `var(--)` prefix
- Design source: Figma URL above
- Component map entry: data/component-figma-map.json → component "Masthead" (category "Navigation"; node "9054-24736")
