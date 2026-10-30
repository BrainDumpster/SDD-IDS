# Skeleton Loader Design Spec

## Metadata
- Component: Skeleton Loader
- Category: Loading and Progress
- Figma: https://www.figma.com/design/VZJ48bbVYrIynw8DdSukWw/-Exploration-only--IDS-with-variables?node-id=11067-54669&m=dev
- Node ID: 11067-54669
## Anatomy
- Skeleton container
- Skeleton shapes (rectangles, circles, lines)
- Shimmer animation effect
- Optional loading text
- Focus ring for keyboard navigation
- Multiple skeleton elements for complex layouts
## Layout & Measurements
- Standard height: 16px (text lines)
- Large height: 24px (headings)
- Circle diameter: 40px (avatars)
- Rectangle height: 120px (images)
- Border radius: 4px (rectangles), 50% (circles)
- Spacing between elements: 8px
- Animation duration: 1.5 seconds
- Minimum width: 40px
## Tokens
### Colors
- White: `var(--color-text-gray-white)` = #ffffff
- Brand base: `var(--color-background-controls-base)` = #0076ce
- Component background: `var(--color-background-surface-component)` = #ffffff
- Gray neutral light: `var(--color-background-gray-neutral-light)` = #eaeaea
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

### Background Colors
- Brand lighter: `var(--color-background-brand-lighter-slate)` = #ebf4fb
- Masthead brand: `var(--color-background-masthead-base)` = #0076ce

### UI Palettes
- Dell Blue 600: `UI Palettes/Dell Blue/dell-blue-600` = #0076CE
- White: `UI Palettes/White` = #FFFFFF
- Gray 100: `UI Palettes/Gray/gray-100` = #F4F4F4
- Gray 200: `UI Palettes/Gray/gray-200` = #EAEAEA
- Gray 300: `UI Palettes/Gray/gray-300` = #C5C5C5
- Gray 500: `UI Palettes/Gray/gray-500` = #757575
- Gray 600: `UI Palettes/Gray/gray-600` = #616161
- Gray 900: `UI Palettes/Gray/gray-900` = #252525

### Other Colors
- Standard gray icon: `icon-standard-gray` = #616161
- Primary Blue: `Primary/Blue-600 - #0076CE (Dell Blue)` = #0076CE

### Effects
- Level 4 shadow: Multi-layer drop shadow for elevation
### Typography
- Body 1: Roboto Regular 16px/24px (skeleton text placeholders)

### Token gaps and notes
- All colors use semantic CSS custom properties for theme consistency
- Typography scales are defined via font tokens with proper hierarchy
- Animation states should be smooth and performant
- Focus states use brand colors for visual consistency
- Dark theme adaptation through semantic tokens
- Skeleton animations should be accessible and performant
## States (Light Theme)
| Element | Background | Border | Animation |
|---|---|---|---|
| Text Line | `UI Palettes/Gray/gray-200` (#EAEAEA) | transparent | Shimmer effect |
| Heading | `UI Palettes/Gray/gray-200` (#EAEAEA) | transparent | Shimmer effect |
| Avatar Circle | `UI Palettes/Gray/gray-200` (#EAEAEA) | transparent | Shimmer effect |
| Image Rectangle | `UI Palettes/Gray/gray-200` (#EAEAEA) | transparent | Shimmer effect |
| Button | `UI Palettes/Gray/gray-200` (#EAEAEA) | transparent | Shimmer effect |
| Card Container | `UI Palettes/Gray/gray-100` (#F4F4F4) | `UI Palettes/Gray/gray-300` (#C5C5C5) | None |
| Shimmer Overlay | `linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)` | transparent | Slide animation |
## States (Dark Theme)
- Uses semantic tokens that automatically adapt to dark theme
- Skeleton colors maintain visibility in dark theme
- Shimmer effect provides loading indication
- Dark theme adaptation through semantic tokens
## Interactions
- Skeleton loader is non-interactive (loading indicator)
- Focus ring appears when skeleton is keyboard focusable
- Hover states not applicable (non-interactive)
- Shimmer animation provides visual feedback
- Auto-removal when content loads
- Smooth transition from skeleton to content
### Accessibility
- Focus ring: 2px brand color border
- Keyboard navigation: Tab to skeleton when focusable
- Screen reader support: Proper ARIA attributes for loading state
- High contrast: Meets WCAG AA standards with provided colors
- Semantic HTML: Use div with proper loading indication
- Loading announcements: Screen reader announces loading state
- Focus management: Clear focus indication when focusable

### Behavior & guidelines
- Use skeleton loaders for content loading states
- Match skeleton shape to expected content layout
- Provide smooth shimmer animation
- Test with screen readers for proper loading announcement
- Consider performance impact of animations
- Use consistent skeleton styling across the application
- Ensure smooth transition to actual content
- Consider reducing motion for accessibility
## Composition & API (runtime)
Document runtime props, events, and variant axes. When **Variants** appears as a subsection below, treat it as the variant matrix source until a dedicated API table is authored.
### Variants
- **Text**: Text line skeletons
- **Avatar**: Circular avatar skeletons
- **Image**: Rectangular image skeletons
- **Card**: Complete card layout skeletons
- **Button**: Button shape skeletons
- **List**: Multiple line skeletons
- **Table**: Table row and cell skeletons
- **Form**: Form field skeletons
## Codegen Contract (Framework-Agnostic Blueprint)
### Deterministic structure
Follow **Anatomy** (same slot order). Codegen must emit stable PascalCase slot identifiers aligned with anatomy labels.

### Variant matrix
See **Composition & API (runtime) → Variants** when present; otherwise document variant axes in this subsection during spec hardening.

### Per-slot style contract
Resolve backgrounds, borders, typography, and icons from **Tokens** and **States (Light Theme)** / **States (Dark Theme)** using `var(--...)` only.

### Behavior contract
See **Interactions** and **Interactions → Behavior & guidelines**.

### Accessibility contract
See **Interactions → Accessibility**.

### Asset resolution + bundling contract
When icons are used, resolve from `assets/icons/<slug>.svg` through the shared Icon primitive; document slugs in this spec when known.

### Fallback/error rules
- Unknown variant or state → fall back to the documented default variant.
- Missing required content → validation error at codegen boundary (do not silently omit required slots).
### Validation checklist
- [ ] Implement shimmer animation
- [ ] Add proper focus management
- [ ] Test keyboard navigation (Tab)
- [ ] Verify ARIA attributes and roles
- [ ] Test different skeleton variants
- [ ] Implement smooth content transition
- [ ] Add loading state management
- [ ] Test dark theme compatibility
- [ ] Verify screen reader announcements
- [ ] Test animation performance
## Source Mapping
- Figma component: Skeleton Loader (11067-54669)
- Variable collection: UI Palettes, Typography tokens
- Semantic mapping: CSS custom properties with `var(--)` prefix
- Design source: Figma URL above
- Component map entry: data/component-figma-map.json → component "Skeleton Loader" (category "Loading and Progress"; node "11067-54669")
