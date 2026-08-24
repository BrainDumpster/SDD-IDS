# Breadcrumb Design Spec

## Metadata
- Component: Breadcrumb
- Category: Navigation
- Figma: https://www.figma.com/design/VZJ48bbVYrIynw8DdSukWw/-Exploration-only--IDS-with-variables?node-id=11067-54494&m=dev
- Node ID: 11067-54494
## Anatomy
- Breadcrumb list container
- Individual breadcrumb items (links)
- Separator characters (/) between items
- Ellipsis (...) for truncated paths
- Dropdown menu for truncated links (shown on hover)
- Current page text (two-line variant only, displayed below breadcrumb trail)
- Focus ring for keyboard navigation
## Layout & Measurements
- Standard height: 32px
- Item padding: 0px (no padding on breadcrumb links)
- Separator spacing: 8px
- Border radius: 4px (for focus states)
- Focus ring: 2px offset from item
- Minimum item width: 24px
- Separator size: 16px × 16px
- Container margin: 0px (no margin on breadcrumb container)
- List margin: 0px (no margin on breadcrumb list)
## Tokens
### Colors
- White: `var(--color-text-gray-white)` = #ffffff
- Brand base: `var(--color-background-controls-base)` = #0076ce
- Component background: `var(--color-background-surface-component)` = #ffffff
- Neutral text: `var(--color-text-gray-neutral)` = #4d4d4d
- Neutral strong: `var(--color-text-gray-neutral-strong)` = #252525
- Disabled text: `var(--color-text-gray-disabled)` = #757575
- Brand strong text: `var(--color-text-brand-strong)` = #94c5ea
- Brand stronger text: `var(--color-text-link-brand-stronger)` = #d9eaf8
- Accessible border: `var(--color-border-gray-neutral-base)` = #757575
- Brand border: `var(--color-border-brand-base)` = #4c9fdd

### Link Colors
- Link brand base: `var(--color-text-link-brand-base)` = #0062ab
- Link brand strong: `var(--color-text-link-brand-strong)` = #94c5ea

### Background Colors
- Brand lighter: `var(--color-background-brand-lighter-slate)` = #1e262c
- Brand light: `var(--color-background-brand-light-slate)` = #34414c

### UI Palettes
- Dell Blue 500: `UI Palettes/Dell Blue/dell-blue-500` = #0076CE

### Other Colors
- Annotation: `var(--color-annotation)` = #f389c3

### Surfaces
- Surface dark: `var(--color-background-surface-primary)` = #111619

### Effects
- Cards Drop Shadow: Drop shadow effect for elevation
### Typography
- Header 5: Roboto Regular 24px/32px (large breadcrumbs)
- Body 2: Roboto Regular 14px/20px (standard breadcrumbs)
- Body 2 - Underline: Roboto Regular 14px/20px (link style)
- Body 3: Roboto Regular 12px/18px (compact breadcrumbs)

### Token gaps and notes
- All colors use semantic CSS custom properties for theme consistency
- Typography scales are defined via font tokens with proper hierarchy
- Focus states use brand colors for visual consistency
- Link states provide clear visual feedback
- Current page state is clearly distinguished
- Dark theme adaptation through semantic tokens
## States (Light Theme)
| State | Background | Border | Text (One Line) | Text (Two Lines Current Page) | Separator |
|---|---|---|---|---|---|
| Default | transparent | transparent | `var(--color-text-link-brand-base)` (#0062ab) | N/A | `var(--color-text-gray-neutral)` (#4d4d4d) |
| Hover | `var(--color-background-brand-lighter-slate)` (#1e262c) | transparent | `var(--color-text-link-brand-strong)` (#94c5ea) | N/A | `var(--color-text-gray-neutral)` (#4d4d4d) |
| Focus | `var(--color-background-brand-lighter-slate)` (#1e262c) | `var(--color-border-brand-base)` (#4c9fdd) | `var(--color-text-link-brand-strong)` (#94c5ea) | N/A | `var(--color-text-gray-neutral)` (#4d4d4d) |
| Current (Two Lines) | transparent | transparent | `var(--color-text-link-brand-base)` (#0062ab) | `var(--color-text-gray-neutral-strong)` (#252525) | `var(--color-text-gray-neutral)` (#4d4d4d) |
| Disabled | transparent | transparent | `var(--color-text-gray-disabled)` (#757575) | N/A | `var(--color-text-gray-disabled)` (#757575) |
## States (Dark Theme)
- Uses semantic tokens that automatically adapt to dark theme
- Surface tokens: `var(--color-background-surface-primary)` (#111619)
- Text and border colors remain consistent via semantic variables
- Current page uses neutral strong for clear indication
## Interactions
- Click breadcrumb items to navigate to that page
- Hover provides visual feedback with background and text changes
- Focus ring uses brand color for keyboard navigation
- In two-line variant, current page is displayed below breadcrumb trail with larger typography
- Disabled items prevent interaction and use gray colors
- Keyboard navigation: Tab through items, Enter to navigate
- Truncated breadcrumbs show dropdown on hover of "..."
### Accessibility
- Focus ring: 2px brand color border
- Keyboard navigation: Tab to breadcrumb items, Enter to navigate
- Screen reader support: Proper ARIA attributes (navigation, breadcrumb list)
- High contrast: Meets WCAG AA standards with provided colors
- Semantic HTML: Use nav element with breadcrumb role
- Current page indication: Proper aria-current="page" attribute
- Separator announcements: Screen readers announce navigation structure

### Behavior & guidelines
- Use breadcrumbs to show navigation hierarchy
- Overflow pattern: breadcrumb shows full path up to 4 items (could be less based on screen size)
- From 5 items, breadcrumb truncates to show only 2 items - first and last breadcrumb with ellipsis ("...") in between
- Hovering on "..." displays a dropdown menu with all truncated links
- Use proper separator characters (/ > »)
- Implement responsive behavior for mobile
- Test with screen readers for proper navigation announcement
- Use consistent styling across the application
## Composition & API (runtime)
Document runtime props, events, and variant axes. When **Variants** appears as a subsection below, treat it as the variant matrix source until a dedicated API table is authored.
### Variants
- **One Line**: Standard horizontal breadcrumb trail (all links have same styling)
- **One Line Truncated**: Long paths truncated with ellipsis and dropdown menu
- **Two Lines**: Breadcrumb trail on top with current page displayed below (larger typography)
- **Two Lines Truncated**: Two-line variant with truncation for long paths
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
- [ ] Implement click navigation for breadcrumb items
- [ ] Add proper focus management
- [ ] Test keyboard navigation (Tab, Enter)
- [ ] Verify ARIA attributes and roles
- [ ] Test hover and focus states
- [ ] Implement current page indication
- [ ] Add responsive behavior for mobile
- [ ] Test dark theme compatibility
- [ ] Verify screen reader announcements
- [ ] Test long path truncation
## Source Mapping
- Figma component: Breadcrumb (11067-54494)
- Variable collection: UI Palettes, Typography tokens
- Semantic mapping: CSS custom properties with `var(--)` prefix
- Design source: Figma URL above
- Component map entry: data/component-figma-map.json → component "Breadcrumb" (category "Navigation"; node "11067-54494")
- Figma variants:
  - One line: 48608-92898 (4 items), 48608-92922 (1 item), 48608-92916 (2 items), 48608-92908 (3 items)
  - One line truncated: 48608-92890 (5 items), 48608-92881 (with dropdown)
  - Two lines: 48608-92945 (4 items), 48608-92972 (1 item), 48608-92965 (2 items), 48608-92956 (3 items)
  - Two lines truncated: 48608-92936 (5 items), 48608-92926 (with dropdown)
