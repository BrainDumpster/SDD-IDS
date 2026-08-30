# Splash Screen Design Spec

## Metadata
- Component: Splash Screen
- Category: Patterns and Templates
- Figma: https://www.figma.com/design/VZJ48bbVYrIynw8DdSukWw/-Exploration-only--IDS-with-variables?node-id=9054-24755&m=dev
- Node ID: 9054-24755
## Anatomy
- Full-screen splash container
- Application logo/brand
- Application name
- Loading indicator
- Version information (optional)
- Progress indicator (optional)
- Background with brand colors
- Focus ring for keyboard navigation
## Layout & Measurements
- Screen width: 100% viewport width
- Screen height: 100% viewport height
- Logo size: 120px × 120px
- Content area: Centered vertically and horizontally
- Horizontal padding: 32px
- Vertical spacing: 24px between elements
- Border radius: 0 (full screen)
- Focus ring: 2px offset from interactive elements
- Loading indicator size: 32px × 32px
## Tokens
### Colors
- White: `var(--color-text-gray-white)` = #ffffff
- Brand base: `var(--color-background-controls-base)` = #0076ce
- White background: `var(--color-background-surface-white)` = #ffffff
- Brand background: `var(--color-background-brand-base)` = #0076ce
- White text: `var(--color-text-gray-white)` = #ffffff
- White border: `var(--color-border-gray-white)` = #ffffff
- Brand border: `var(--color-border-brand-base)` = #0076ce

### Icons
- White icon: `var(--color-icon-gray-white)` = #ffffff

### Static Colors
- Static white: `var(--color-static-gray-white)` = #ffffff
- Static brand 500: `var(--color-static-brand-500)` = #0076ce

### UI Palettes
- Dell Blue 500: `UI Palettes/Dell Blue/dell-blue-500` = #0076CE
### Typography
- Header 1: Roboto Regular 48px/58px (application name)
- Body 2: Roboto Regular 14px/1.5 (status text)

### Token gaps and notes
- All colors use semantic CSS custom properties for theme consistency
- Typography scales are defined via font tokens with proper hierarchy
- Focus states use brand colors for visual consistency
- Brand colors maintain visual identity
- Dark theme adaptation through semantic tokens
- Splash screen should be responsive and accessible
## States (Light Theme)
| Element | Background | Border | Text | Icon |
|---|---|---|---|---|
| Splash Container | `var(--color-background-brand-base)` (#0076ce) | `var(--color-border-gray-white)` (#ffffff) | `var(--color-text-gray-white)` (#ffffff) | `var(--color-icon-gray-white)` (#ffffff) |
| Logo Section | transparent | transparent | `var(--color-text-gray-white)` (#ffffff) | `var(--color-icon-gray-white)` (#ffffff) |
| Application Name | transparent | transparent | `Header 1` (Roboto Regular 48px/58px) | `var(--color-icon-gray-white)` (#ffffff) |
| Loading Indicator | transparent | transparent | `Body 2` (Roboto Regular 14px/1.5) | `var(--color-icon-gray-white)` (#ffffff) |
| Version Info | transparent | transparent | `Body 2` (Roboto Regular 14px/1.5) | `var(--color-icon-gray-white)` (#ffffff) |
| Interactive Elements | `var(--color-background-surface-white)` (#ffffff) | `var(--color-border-brand-base)` (#0076ce) | `var(--color-background-brand-base)` (#0076ce) | `var(--color-icon-gray-white)` (#ffffff) |
## States (Dark Theme)
- Uses semantic tokens that automatically adapt to dark theme
- Splash container maintains brand colors
- Text and border colors remain consistent via semantic variables
- Interactive elements adapt to dark theme
## Interactions
- Splash screen is typically non-interactive (loading state)
- Focus ring appears on interactive elements when present
- Hover provides visual feedback on interactive elements
- Auto-dismiss after loading completes
- Keyboard navigation: Tab to interactive elements, Enter to activate
- Skip to content option (optional)
### Accessibility
- Focus ring: 2px brand color border
- Keyboard navigation: Tab to interactive elements, Enter to activate
- Screen reader support: Proper ARIA attributes for splash content
- High contrast: Meets WCAG AA standards with provided colors
- Semantic HTML: Use proper landmarks and roles
- Focus management: Auto-focus on interactive elements
- Loading announcements: Screen reader announces loading state

### Behavior & guidelines
- Use splash screen for application loading
- Provide clear branding and application identity
- Include loading indication for user feedback
- Use consistent branding across splash variants
- Test with screen readers for proper content announcement
- Consider auto-dismiss timing
- Use keyboard navigation for accessibility
- Provide skip option for accessibility
## Composition & API (runtime)
Document runtime props, events, and variant axes. When **Variants** appears as a subsection below, treat it as the variant matrix source until a dedicated API table is authored.
### Variants
- **Default**: Standard brand splash screen
- **With Progress**: Splash with loading progress indicator
- **With Animation**: Splash with animated logo or graphics
- **Minimal**: Simplified splash with just logo
- **Dark**: Dark themed splash screen
- **With Skip**: Splash with skip to content option
- **With Version**: Splash showing version information
- **Interactive**: Splash with interactive elements
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
- [ ] Implement loading animation
- [ ] Add proper focus management
- [ ] Test keyboard navigation (Tab, Enter)
- [ ] Verify ARIA attributes and roles
- [ ] Test auto-dismiss functionality
- [ ] Implement progress indication
- [ ] Add skip to content option
- [ ] Test dark theme compatibility
- [ ] Verify screen reader announcements
- [ ] Test responsive behavior
## Source Mapping
- Figma component: Splash Screen (9054-24755)
- Variable collection: UI Palettes, Typography tokens
- Semantic mapping: CSS custom properties with `var(--)` prefix
- Design source: Figma URL above
- Component map entry: data/component-figma-map.json → component "Splash Screen" (category "Patterns and Templates"; node "9054-24755")
