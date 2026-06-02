# Whats New Design Spec

## Metadata
- Component: Whats New
- Category: Patterns and Templates
- Figma: https://www.figma.com/design/VZJ48bbVYrIynw8DdSukWw/-Exploration-only--IDS-with-variables?node-id=27437-44064&m=dev
- Node ID: 27437-44064
## Anatomy
- What's New container
- Header with title
- Update items list
- Update categories
- Update dates
- Read more links
- Close button
- Focus ring for keyboard navigation
- Optional filtering
## Layout & Measurements
- Container width: 500px (minimum)
- Container height: Auto (based on content)
- Header height: 48px
- Item height: 80px
- Horizontal padding: 24px
- Vertical padding: 16px
- Border radius: 8px
- Focus ring: 2px offset from element
- Item spacing: 8px
- Icon size: 16px × 16px
- Close button: 16px × 16px
## Tokens
### Colors
- White: `var(--color-text-white)` = #ffffff
- Brand base: `var(--color-background-controls-brand-base)` = #0076ce
- Component background: `var(--color-background-component)` = #ffffff
- Neutral text: `var(--color-text-neutral)` = #4d4d4d
- Neutral strong: `var(--color-text-neutral-strong)` = #252525
- Brand text: `var(--color-text-brand-base)` = #0076ce
- Brand strong text: `var(--color-text-brand-strong)` = #0062ab
- White text: `var(--color-text-white)` = #ffffff
- Accessible border: `var(--color-border-accessible)` = #757575
- Brand border: `var(--color-border-brand-base)` = #0076ce
- Disabled border: `var(--color-border-disabled)` = #757575
- Transparent brand: `var(--color-border-transparent-brand)` = #ffffff00

### Icons
- Brand icon: `var(--color-icon-brand-base)` = #0076ce
- Neutral icon: `var(--color-icon-neutral)` = #4d4d4d
- Standard gray icon: `icon-standard-gray` = #616161
- Success icon: `var(--color-icon-alerting-success)` = #1b8500
- White icon: `var(--color-text-white)` = #ffffff

### Background Colors
- Gray lighter: `var(--color-background-gray-lighter)` = #f4f4f4
- Gray base: `var(--color-background-gray-base)` = #757575

### UI Palettes
- Dell Blue 500: `UI Palettes/Dell Blue/dell-blue-500` = #0076CE
- Gray 400: `UI Palettes/Gray/gray-400` = #9E9E9E
- Gray 900: `UI Palettes/Gray/gray-900` = #252525

### Gradients
- Overflow Vertical Start: `var(--color-gradient-overflow-vertical-start)` = #b6b6b666
- Overflow Vertical End: `var(--color-gradient-overflow-vertical-end)` = #ffffff00

### Effects
- Level 4 shadow: Multi-layer drop shadow for elevation
### Typography
- Header 5: Roboto Regular 24px/32px (what's new title)
- Header 6: Roboto Regular 18px/25px (item titles)
- Body 1: Roboto Regular 16px/24px (item descriptions)
- Body 2: Roboto Regular 14px/20px (secondary text)
- Body 2 - Medium: Roboto Medium 14px/20px (emphasized text)
- Body 3: Roboto Regular 12px/18px (dates and metadata)

### Token gaps and notes
- All colors use semantic CSS custom properties for theme consistency
- Typography scales are defined via font tokens with proper hierarchy
- Focus states use brand colors for visual consistency
- Category badges use brand colors for visual distinction
- Dark theme adaptation through semantic tokens
- What's new should be responsive and accessible
## States (Light Theme)
| Element | Background | Border | Text | Icon |
|---|---|---|---|---|
| What's New Container | `var(--color-background-component)` (#ffffff) | `var(--color-border-accessible)` (#757575) | `var(--color-text-neutral-strong)` (#252525) | `icon-standard-gray` (#616161) |
| Header Section | `var(--color-background-component)` (#ffffff) | `var(--color-border-accessible)` (#757575) | `Header 5` (Roboto Regular 24px/32px) | `var(--color-icon-brand-base)` (#0076ce) |
| Update Item (Default) | `var(--color-background-component)` (#ffffff) | `UI Palettes/Gray/gray-400` (#9E9E9E) | `Body 1` (Roboto Regular 16px/24px) | `icon-standard-gray` (#616161) |
| Update Item (Hover) | `var(--color-background-gray-lighter)` (#f4f4f4) | `var(--color-border-brand-base)` (#0076ce) | `var(--color-text-neutral-strong)` (#252525) | `var(--color-icon-brand-base)` (#0076ce) |
| Update Item (Focus) | `var(--color-background-gray-lighter)` (#f4f4f4) | `var(--color-border-brand-base)` (#0076ce) | `var(--color-text-neutral-strong)` (#252525) | `var(--color-icon-brand-base)` (#0076ce) |
| Update Title | transparent | transparent | `Header 6` (Roboto Regular 18px/25px) | `icon-standard-gray` (#616161) |
| Update Description | transparent | transparent | `Body 2` (Roboto Regular 14px/20px) | `icon-standard-gray` (#616161) |
| Update Date | transparent | transparent | `Body 3` (Roboto Regular 12px/18px) | `icon-standard-gray` (#616161) |
| Category Badge | `var(--color-background-brand-base)` (#0076ce) | `var(--color-background-brand-base)` (#0076ce) | `var(--color-text-white)` (#ffffff) | `var(--color-icon-white)` (#ffffff) |
| Read More Link | transparent | transparent | `var(--color-text-brand-base)` (#0076ce) | `var(--color-icon-brand-base)` (#0076ce) |
| Close Button (Default) | transparent | transparent | `icon-standard-gray` (#616161) | `icon-standard-gray` (#616161) |
| Close Button (Hover) | transparent | transparent | `var(--color-icon-neutral)` (#4d4d4d) | `var(--color-icon-neutral)` (#4d4d4d) |
## States (Dark Theme)
- Uses semantic tokens that automatically adapt to dark theme
- Text and border colors remain consistent via semantic variables
- What's New container maintains visibility in dark theme
- Update items adapt to dark theme
## Interactions
- Click update items to view details
- Click read more links for extended information
- Hover provides visual feedback on interactive elements
- Focus ring uses brand color for keyboard navigation
- Click close button to dismiss what's new
- Keyboard navigation: Tab to navigate, Enter to activate, Escape to close
- Optional filtering by category or date
### Accessibility
- Focus ring: 2px brand color border
- Keyboard navigation: Tab, Enter, Escape
- Screen reader support: Proper ARIA attributes for what's new content
- High contrast: Meets WCAG AA standards with provided colors
- Semantic HTML: Use section element with proper landmarks
- Focus management: Logical tab order through what's new items
- Content announcements: Screen reader announces update information

### Behavior & guidelines
- Use what's new for application updates and announcements
- Provide clear update titles and descriptions
- Include dates and categorization for organization
- Use consistent styling across what's new variants
- Test with screen readers for proper content announcement
- Consider responsive behavior for different screen sizes
- Use keyboard navigation for accessibility
- Provide visual feedback for all interactions
## Composition & API (runtime)
Document runtime props, events, and variant axes. When **Variants** appears as a subsection below, treat it as the variant matrix source until a dedicated API table is authored.
### Variants
- **Default**: Standard what's new dialog
- **Inline**: What's new content inline in page
- **Modal**: What's new as modal overlay
- **Compact**: Reduced size for space-constrained interfaces
- **With Filtering**: What's new with category/date filtering
- **With Search**: What's new with search functionality
- **Auto-dismiss**: What's new that auto-dismisses after time
- **With Pagination**: What's new with pagination for many updates
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
- [ ] Implement update item functionality
- [ ] Add proper focus management
- [ ] Test keyboard navigation (Tab, Enter, Escape)
- [ ] Verify ARIA attributes and roles
- [ ] Test hover and focus states
- [ ] Implement read more functionality
- [ ] Add category filtering
- [ ] Test dark theme compatibility
- [ ] Verify screen reader announcements
- [ ] Test responsive behavior
## Source Mapping
- Figma component: Whats New (27437-44064)
- Variable collection: UI Palettes, Typography tokens
- Semantic mapping: CSS custom properties with `var(--)` prefix
- Design source: Figma URL above
- Component map entry: data/component-figma-map.json → component "Whats New" (category "Patterns and Templates"; node "27437-44064")
