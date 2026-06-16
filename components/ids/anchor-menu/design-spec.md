# Anchor Menu Design Spec

## Metadata
- Component: Anchor Menu
- Category: Navigation
- Figma: https://www.figma.com/design/VZJ48bbVYrIynw8DdSukWw/-Exploration-only--IDS-with-variables?node-id=11067-54486&m=dev
- Node ID: 11067-54486
## Anatomy
- Anchor menu container
- Anchor navigation links
- Active section indicator
- Progress indicator (optional)
- Focus ring for keyboard navigation
- Sticky positioning
- Scroll spy functionality
## Layout & Measurements
- Standard height: Auto (based on content)
- Header text line box height: `24px` (`Body 1` rhythm)
- Header container vertical padding: `12px` top and `12px` bottom (no horizontal padding)
- Item height: 40px
- Section-item padding: `8px` top/bottom and `24px` left/right
- Border radius: 4px
- Focus ring: 2px offset from item
- Minimum width: 200px
- Maximum width: 300px
- Item spacing: 0 (adjacent)
- Progress indicator height: 2px
## Tokens
### Colors
- White: `var(--color-text-white)` = #ffffff
- Brand base: `var(--color-background-controls-brand-base)` = #0076ce
- Surface background: `var(--color-background-surface-1)` = #111619
- Neutral text: `var(--color-text-neutral)` = #8898a5
- Brand strong text: `var(--color-text-brand-strong)` = #94c5ea
- Accessible border: `var(--color-border-accessible)` = #8898a5
- Brand border: `var(--color-border-brand-base)` = #4c9fdd

### UI Palettes
- Dell Blue 500: `UI Palettes/Dell Blue/dell-blue-500` = #0076CE
- Gray 900: `UI Palettes/Gray/gray-900` = #252525
### Typography
- Display 1/Default: Roboto Light 72px/88px (large anchor titles)
- Header 5: Roboto Regular 24px/32px (anchor section headers)
- Body 1: Roboto Regular 16px/24px (anchor menu items)
- Anchor menu header label uses Body 1 (regular, no all-caps transform) with `var(--color-text-neutral-strong)`.

### Token gaps and notes
- All colors use semantic CSS custom properties for theme consistency
- Typography scales are defined via font tokens with proper hierarchy
- Focus states use brand colors for visual consistency
- Active states use brand colors for clear indication
- Dark theme adaptation through semantic tokens
- Anchor menu should be responsive and accessible
## States (Light Theme)
| Element | Background | Border | Text |
|---|---|---|---|
| Menu Container | transparent | `var(--color-border-accessible)` (#8898a5) | `var(--color-text-neutral)` (#8898a5) |
| Anchor Item (Default) | transparent | left border `1.2px` `var(--color-border-accessible)` | `var(--color-text-neutral)` (#8898a5) |
| Anchor Item (Hover) | transparent | left border `4px` `var(--color-border-brand-base)` | `var(--color-text-neutral)` (#8898a5) |
| Anchor Item (Focus) | transparent | `var(--color-border-brand-base)` (#4c9fdd) | `var(--color-text-brand-strong)` (#94c5ea) |
| Anchor Item (Active) | transparent | left border `4px` `var(--color-border-brand-base)` | `var(--color-text-brand-strong)` (#94c5ea) |
| Progress Indicator | `var(--color-background-controls-brand-base)` (#0076ce) | transparent | transparent |
## States (Dark Theme)
- Uses semantic tokens that automatically adapt to dark theme
- Surface tokens: `var(--color-background-surface-1)` (#111619)
- Text and border colors remain consistent via semantic variables
- Active item uses brand colors for clear indication
- Progress indicator maintains visibility
## Interactions
- Click anchor items to scroll to respective sections
- Hover provides visual feedback with text color changes
- Focus ring uses brand color for keyboard navigation
- Active item shows persistent selection state
- Progress indicator shows scroll position
- Keyboard navigation: Arrow keys, Enter, Tab
- Smooth scrolling to sections
- Scroll spy updates active item based on scroll position
### Accessibility
- Focus ring: 2px brand color border
- Keyboard navigation: Arrow keys, Enter, Tab
- Screen reader support: Proper ARIA attributes for navigation
- High contrast: Meets WCAG AA standards with provided colors
- Semantic HTML: Use nav element with proper landmarks
- Focus management: Logical tab order through anchor items
- Current section indication: Proper aria-current="page" attribute

### Behavior & guidelines
- Use anchor menu for long-form content navigation
- Position menu near relevant content
- Provide clear section labels
- Use smooth scrolling for better UX
- Test with screen readers for proper navigation announcement
- Consider responsive behavior for mobile devices
- Use consistent styling across the application
- Provide visual feedback for all interactions
- Match section-element typography and spacing from node `11955:229729`: header uses Body 1 (regular, no text transform) with vertical-only `12px` padding and item rows use `Body 1` (`16/24`) with `8/24` padding and left-border state transitions (`1.2px` default, `4px` hover/active).
## Composition & API (runtime)
- `items: Array<{ label: string; href: string; active?: boolean }>` (required)
- `title?: string` (optional section heading)
- `sticky?: boolean` (default `true` for long-page usage)
- `onItemClick?: (href: string) => void`
### Variants
- **Default**: Standard vertical anchor menu
- **Horizontal**: Horizontal orientation for top navigation
- **With Progress**: Anchor menu with scroll progress indicator
- **Sticky**: Menu that stays visible on scroll
- **Compact**: Reduced size for space-constrained interfaces
- **With Icons**: Anchor items with icons
- **Multi-level**: Anchor menu with nested sections
- **Auto-hide**: Menu that hides/shows based on scroll
## Codegen Contract (Framework-Agnostic Blueprint)
- Deterministic slot order:
  1. `AnchorMenuRoot`
  2. `AnchorMenuHeader?`
  3. repeated `AnchorMenuItem`
  4. `AnchorActiveIndicator`
- Behavior contract:
  - active item is token-highlighted and left-indicator aligned
  - click navigates to corresponding anchor section
  - keyboard navigation supports Tab/Enter on items
- Fallback/error rules:
  - unknown/missing `href` disables navigation for that item
  - empty items array renders empty state without crash
### Validation checklist
- [ ] Implement anchor navigation functionality
- [ ] Add proper focus management
- [ ] Test keyboard navigation (Arrows, Enter, Tab)
- [ ] Verify ARIA attributes and roles
- [ ] Test hover and focus states
- [ ] Implement scroll spy functionality
- [ ] Add smooth scrolling
- [ ] Test dark theme compatibility
- [ ] Verify screen reader announcements
- [ ] Test responsive behavior
## Source Mapping
- Figma component: Anchor Menu (11067-54486)
- Variable collection: UI Palettes, Typography tokens
- Semantic mapping: CSS custom properties with `var(--)` prefix
- Design source: Figma URL above
- Component map entry: data/component-figma-map.json → component "Anchor Menu" (category "Navigation"; node "11067-54486")
