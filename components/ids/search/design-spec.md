# Search Design Spec

## Metadata
- Component: Search
- Category: Formelements
- Figma: https://www.figma.com/design/VZJ48bbVYrIynw8DdSukWw/-Exploration-only--IDS-with-variables?node-id=43581-121822&m=dev
- Node ID: 43581-121822
## Anatomy
- Search input field
- Search icon (leading)
- Clear button (trailing, when text present)
- Container wrapper with border
- Focus ring for keyboard navigation
- Optional search results dropdown
## Layout & Measurements
- Standard height: 40px
- Input padding: 12px horizontal, 8px vertical
- Icon spacing: 8px from input edges
- Border radius: 4px (standard)
- Focus ring: 2px offset from container
- Minimum width: 200px (expandable)
## Tokens
### Colors
- White: `var(--color-icon-gray-white)` = #ffffff
- Brand base: `var(--color-background-controls-base)` = #0076ce
- Component background: `var(--color-background-surface-component)` = #ffffff
- Neutral text: `var(--color-text-gray-neutral)` = #4d4d4d
- Disabled text: `var(--color-text-gray-disabled)` = #757575
- Accessible border: `var(--color-border-gray-neutral-base)` = #757575
- Brand border: `var(--color-border-brand-base)` = #0076ce
- Strong border: `var(--color-border-gray-neutral-strong)` = #252525

### Icons
- Brand icon: `var(--color-icon-brand-base)` = #0076ce
- Accessible icon: `var(--color-icon-gray-neutral-accessible)` = #757575

### Surfaces
- Surface dark: `var(--color-background-surface-primary)` = #111619

### UI Palettes
- Dell Blue 500: `UI Palettes/Dell Blue/dell-blue-500` = #0076CE
### Typography
- Body 2: Roboto Regular 14px/20px (search input text)

### Token gaps and notes
- All colors use semantic CSS custom properties for theme consistency
- Typography scales are defined via font tokens
- Focus states use brand colors for visual consistency
- Disabled states maintain accessibility with proper contrast
- Search icon should be recognizable and consistently positioned
- Clear button should be easily discoverable when present
## States (Light Theme)
| State | Background | Border | Text | Icons |
|---|---|---|---|---|
| Default | `var(--color-background-surface-component)` (#ffffff) | `var(--color-border-gray-neutral-base)` (#757575) | `var(--color-text-gray-neutral)` (#4d4d4d) | `var(--color-icon-gray-neutral-accessible)` (#757575) |
| Hover | `var(--color-background-surface-component)` (#ffffff) | `var(--color-border-gray-neutral-strong)` (#252525) | `var(--color-text-gray-neutral)` (#4d4d4d) | `var(--color-icon-gray-neutral-accessible)` (#757575) |
| Focus | `var(--color-background-surface-component)` (#ffffff) | `var(--color-border-brand-base)` (#0076ce) | `var(--color-text-gray-neutral)` (#4d4d4d) | `var(--color-icon-brand-base)` (#0076ce) |
| Disabled | `var(--color-background-surface-component)` (#ffffff) | `var(--color-border-gray-disabled)` (#757575) | `var(--color-text-gray-disabled)` (#757575) | `var(--color-icon-gray-neutral-accessible)` (#757575) |
## States (Dark Theme)
- Uses semantic tokens that automatically adapt to dark theme
- Surface tokens: `var(--color-background-surface-primary)` (#111619)
- Text and border colors remain consistent via semantic variables
- Disabled state uses gray tokens for dark theme compatibility
## Interactions
- Click to focus input field
- Typing reveals clear button
- Click clear button to reset search
- Hover provides visual feedback with border changes
- Focus ring uses brand color for keyboard navigation
- Disabled state prevents interaction and uses gray colors
- Enter key triggers search action
### Accessibility
- Focus ring: 2px brand color border
- Keyboard navigation: Tab to search, type to input, Enter to search, Escape to clear
- Screen reader support: Proper ARIA labels and search status
- High contrast: Meets WCAG AA standards with provided colors
- Semantic HTML: Use search input type with proper attributes
- Clear button: Proper button element with aria-label

### Behavior & guidelines
- Use search for content filtering and discovery
- Provide clear placeholder text describing search functionality
- Show clear button only when text is present
- Implement debounced search for performance
- Provide search suggestions when appropriate
- Use semantic search input type for mobile optimization
- Test with screen readers for proper announcement
## Composition & API (runtime)
Document runtime props, events, and variant axes. When **Variants** appears as a subsection below, treat it as the variant matrix source until a dedicated API table is authored.
### Variants
- **Default**: Standard search input with icon
- **Compact**: Reduced height for tight spaces
- **Expanded**: Full-width search with prominent styling
- **Disabled**: Non-interactive state
- **With Results**: Dropdown showing search suggestions
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
- [ ] Implement focus/blur states
- [ ] Add clear button functionality
- [ ] Test keyboard navigation (Tab, Enter, Escape)
- [ ] Verify ARIA labels and descriptions
- [ ] Test disabled state styling
- [ ] Implement search debouncing
- [ ] Add search suggestions dropdown
- [ ] Test dark theme compatibility
- [ ] Verify mobile keyboard behavior
## Source Mapping
- Figma component: Search (43581-121822)
- Variable collection: UI Palettes, Typography tokens
- Semantic mapping: CSS custom properties with `var(--)` prefix
- Design source: Figma URL above
- Component map entry: data/component-figma-map.json → component "Search" (category "Formelements"; node "43581-121822")
- Design source: Figma URL above
- Component map entry: data/component-figma-map.json → component "Search" (category "Formelements"; node "43581-121822")
