# Global Search Design Spec

## Metadata
- Component: Global Search
- Category: Navigation
- Figma: https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=37295-6759&m=dev
- Node ID: 37295-6759

## Anatomy
- Modal container (552px × 1024px)
- Header with "Search" title and close button (X icon)
- Search box with filter dropdown, search icon, input field, and clear button
- Results area with sections (for Keyword Results variant)
- Section headers with icons and titles
- Line separators between sections
- Result items with titles and metadata (breadcrumbs)
- Hover states for result items
- Search suggestions (for No Results variant)

## Layout & Measurements
- Modal width: 552px
- Modal height: 1024px
- Header height: 64px (20px padding top/bottom + 24px padding left/right)
- Search box height: 56px
- Search box width: 504px (with 24px padding left/right from modal edges)
- Filter dropdown: 80px width
- Input field: flexible width
- Section header height: 24px
- Result item height: 36px (8px padding top/bottom)
- Horizontal padding: 24px (modal edges)
- Vertical gap: 16px (between major sections)
- Section gap: 16px
- Result gap: 8px
- Line separator height: 1px
- Icon size: 16px × 16px
- Border radius: 2px (modal and input elements)
- Font sizes: 16px (header), 14px (results), 14px (section headers)
## Tokens
### Colors
- White: `var(--color-text-white)` = #ffffff
- Brand base: `var(--color-background-controls-brand-base)` = #0076ce
- Component background: `var(--color-background-component)` = #ffffff
- Surface background: `var(--color-background-surface-1)` = #f4f4f4
- Surface 2: `var(--color-background-surface-2)` = #ffffff
- Neutral text: `var(--color-text-neutral)` = #4d4d4d
- Neutral strong: `var(--color-text-neutral-strong)` = #252525
- Brand strong text: `var(--color-text-brand-strong)` = #0062ab
- Link brand text: `var(--color-text-link-brand-base)` = #0062ab
- White text: `var(--color-text-white)` = #ffffff
- Accessible border: `var(--color-border-accessible)` = #757575
- Brand border: `var(--color-border-brand-base)` = #0076ce
- Light border: `var(--color-border-light)` = #c5c5c5
- White border: `var(--color-border-white)` = #ffffff
- Transparent neutral: `var(--color-border-transparent-neutral)` = #ffffff00

### Icons
- Brand icon: `var(--color-icon-brand-base)` = #0076ce
- Neutral icon: `var(--color-icon-neutral)` = #4d4d4d
- Neutral strong icon: `var(--color-icon-neutral-strong)` = #252525
- Brand strong icon: `var(--color-icon-brand-strong)` = #0062ab
- Accessible icon: `var(--color-icon-accessible)` = #757575
- Inverse icon: `var(--color-icon-inverse)` = #ffffff
- Minor icon: `var(--color-icon-alerting-minor)` = #ffc700

### Background Colors
- Brand lighter: `var(--color-background-brand-lighter)` = #ebf4fb
- Gray lighter: `var(--color-background-gray-lighter)` = #f4f4f4
- Gray light: `var(--color-background-gray-light)` = #eaeaea
- Gray base: `var(--color-background-gray-base)` = #757575
- Brand base: `var(--color-background-brand-base)` = #0076ce
- Masthead brand: `var(--color-background-masthead-brand-base)` = #0076ce

### UI Palettes
- Dell Blue 500: `UI Palettes/Dell Blue/dell-blue-500` = #0076CE
- Gray 100: `UI Palettes/Gray/gray-100` = #F4F4F4
- Gray 500: `UI Palettes/Gray/gray-500` = #757575
- Gray 700: `UI Palettes/Gray/gray-700` = #4D4D4D
- Gray 900: `UI Palettes/Gray/gray-900` = #252525

### Alert Colors
- Warning border: `Color/Border/Alerting/Warning-Accessible` = #9c622e

### Static Colors
- Static gray 800: `var(--color-static-gray-800)` = #393939
- Static white: `var(--color-static-gray-white)` = #ffffff
- Static brand 500: `var(--color-static-brand-500)` = #0076ce

### Other Colors
- Annotation: `Annotation` = #E8178A

### Effects
- Cards Drop Shadow: Drop shadow effect for dropdown
### Typography
- Display 1/Default: Roboto Light 72px/88px (large search headers)
- Header/Header 1: Roboto Regular 28px/64px (search section headers)
- Header 4: Roboto Regular 28px/34px (result titles)
- Body 1: Roboto Regular 16px/24px (result descriptions)
- Body 1 - Medium: Roboto Medium 16px/24px (emphasized results)
- Body 2: Roboto Regular 14px/20px (secondary text)
- Body 2 - Medium: Roboto Medium 14px/20px (category headers)
- Body 2 - Underline: Roboto Regular 14px/20px (link text)

### Token gaps and notes
- All colors use semantic CSS custom properties for theme consistency
- Typography scales are defined via font tokens with proper hierarchy
- Focus states use brand colors for visual consistency
- Hover states provide clear visual feedback
- Dark theme adaptation through semantic tokens
- Search functionality should be responsive and accessible
## States (Light Theme)
| Element | Background | Border | Text | Icon |
|---|---|---|---|---|
| Modal Container | `var(--color-background-component)` (#ffffff) | `var(--color-border-accessible)` (#757575) | - | - |
| Header | `var(--color-background-component)` (#ffffff) | transparent | `var(--color-text-neutral-strong)` (#252525) | `var(--color-icon-accessible)` (#757575) |
| Search Box Container | `var(--color-background-component)` (#ffffff) | transparent | - | - |
| Filter Dropdown | `var(--color-background-component)` (#ffffff) | `var(--color-border-accessible)` (#757575) | `var(--color-text-neutral)` (#4d4d4d) | `var(--color-icon-neutral)` (#4d4d4d) |
| Search Input | `var(--color-background-component)` (#ffffff) | `var(--color-border-accessible)` (#757575) | `var(--color-text-neutral)` (#4d4d4d) | `var(--color-icon-neutral)` (#4d4d4d) |
| Clear Button | transparent | transparent | `var(--color-icon-accessible)` (#757575) | `var(--color-icon-accessible)` (#757575) |
| Results Area | `var(--color-background-component)` (#ffffff) | transparent | - | - |
| Section Header | transparent | transparent | `var(--color-text-neutral-strong)` (#252525) | `var(--color-icon-neutral)` (#4d4d4d) |
| Line Separator | transparent | `var(--color-border-light)` (#c5c5c5) | - | - |
| Result Item (Default) | transparent | transparent | `var(--color-text-link-brand-base)` (#0062ab) | - |
| Result Item (Hover) | `var(--color-background-brand-lighter)` (#ebf4fb) | transparent | `var(--color-text-link-brand-base)` (#0062ab) | - |
| Result Metadata | transparent | transparent | `var(--color-text-neutral)` (#4d4d4d) | - |
| No Results Text | transparent | transparent | `var(--color-text-neutral-strong)` (#252525) | - |
| Loading Spinner | transparent | transparent | `var(--color-text-neutral)` (#4d4d4d) | - |
## States (Dark Theme)
- Uses semantic tokens that automatically adapt to dark theme
- Surface tokens: `var(--color-background-surface-1)` (#f4f4f4), `var(--color-background-surface-2)` (#ffffff)
- Text and border colors remain consistent via semantic variables
- Search dropdown maintains visibility in dark theme
- Result items adapt to dark theme
## Interactions
- Type in search field to show search results
- Click filter dropdown to select filter options
- Click clear button to reset search input
- Click results to navigate to respective content
- Hover provides visual feedback on result items (brand lighter background)
- Click close button (X) to close the modal
- Keyboard navigation: Tab to navigate between elements
- Escape to close modal
- Enter to select search result
- Loading state shows spinner while searching
- No results state shows "No Results Found" with search suggestions
### Accessibility
- Focus ring: 2px brand color border
- Keyboard navigation: Arrow keys, Enter, Escape, Tab
- Screen reader support: Proper ARIA attributes for search
- High contrast: Meets WCAG AA standards with provided colors
- Semantic HTML: Use search role with proper landmarks
- Focus management: Logical tab order through search elements
- Result announcements: Screen reader announces search results

### Behavior & guidelines
- Use global search for application-wide content discovery
- Provide clear search input with proper placeholder
- Show relevant results with proper categorization
- Use keyboard shortcuts for quick access
- Test with screen readers for proper search announcement
- Consider performance for large datasets
- Use consistent styling across the application
- Provide visual feedback for all interactions
## Composition & API (runtime)
Document runtime props, events, and variant axes. When **Variants** appears as a subsection below, treat it as the variant matrix source until a dedicated API table is authored.
### Variants
- **EmptySearch**: Modal with header and search box, no results shown (Figma 37295-6766)
- **WithRecentVisit**: Modal with header, search box, and recently visited results (Figma 37295-6759)
- **LoadingState**: Modal with header, search box with text, cursor, and loading spinner (Figma 37295-6767)
- **NoResultsFound**: Modal with header, search box with text, cursor, and no results with search suggestions (Figma 37295-6775)
- **KeywordResults**: Modal with header, search box with text, cursor, sectioned results with icons, line separators, and scrollbar (Figma 37295-6743)
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
- [ ] Implement search functionality
- [ ] Add proper focus management
- [ ] Test keyboard navigation (Arrows, Enter, Escape, Tab)
- [ ] Verify ARIA attributes and roles
- [ ] Test hover and focus states
- [ ] Implement result categorization
- [ ] Add clear button functionality
- [ ] Test dark theme compatibility
- [ ] Verify screen reader announcements
- [ ] Test search performance
## Source Mapping
- Figma component: Global Search (37295-6759)
- Variable collection: UI Palettes, Typography tokens
- Semantic mapping: CSS custom properties with `var(--)` prefix
- Design source: Figma URL above
- Component map entry: data/component-figma-map.json → component "Global Search" (category "Navigation"; node "37295-6759")
- Additional Figma nodes:
  - Empty Search: 37295-6766
  - Loading State: 37295-6767
  - No Results Found: 37295-6775
  - Keyword Results: 37295-6743
  - Search Box element: 37295-6670
