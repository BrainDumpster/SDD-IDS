# Wizard - Modal Design Spec

## Metadata
- **Storybook path:** `storybook-generated/ids/src/components/WizardModal.stories.tsx`
- **Deterministic generator:** `generation/deterministic_storybook/ids/wizard_modal.py`
- Component: Wizard - Modal
- Category: Modals and Wizards
- Figma: https://www.figma.com/design/VZJ48bbVYrIynw8DdSukWw/-Exploration-only--IDS-with-variables?node-id=11067-54621&m=dev
- Node ID: 11067-54621
## Anatomy
- Wizard container with overlay
- Step indicator/progress bar
- Header with title and subtitle
- Content area for step content
- Navigation buttons (Previous, Next, Cancel, Finish)
- Focus ring for keyboard navigation
- Backdrop overlay
- Step validation indicators
## Layout & Measurements
- Minimum width: 600px
- Maximum width: 800px
- Border radius: 8px
- Header padding: 24px
- Body padding: 24px
- Footer padding: 16px 24px
- Button spacing: 8px
- Step indicator height: 40px
- Overlay background: rgba(0, 0, 0, 0.5)
- Centered on screen with proper margins
## Tokens
### Colors
- White: `var(--color-text-gray-white)` = #ffffff
- Brand base: `var(--color-background-controls-base)` = #0076ce
- Component background: `var(--color-background-surface-component)` = #ffffff
- Neutral text: `var(--color-text-gray-neutral)` = #4d4d4d
- Neutral strong: `var(--color-text-gray-neutral-strong)` = #252525
- Black text: `var(--color-text-gray-black)` = #252525
- Disabled text: `var(--color-text-gray-disabled)` = #757575
- Brand strong text: `var(--color-text-brand-strong)` = #0062ab
- Link brand text: `var(--color-text-link-brand-base)` = #0062ab
- Accessible border: `var(--color-border-gray-neutral-base)` = #757575
- Brand border: `var(--color-border-brand-base)` = #0076ce
- Light border: `var(--color-border-gray-neutral-light)` = #c5c5c5
- White border: `var(--color-border-gray-white)` = #ffffff
- Transparent neutral: `var(--color-border-gray-neutral-transparent-base)` = #ffffff00
- Transparent brand: `var(--color-border-brand-transparent-brand)` = #ffffff00

### Icons
- Brand icon: `var(--color-icon-brand-base)` = #0076ce
- Neutral icon: `var(--color-icon-gray-neutral-base)` = #4d4d4d
- White icon: `var(--color-icon-gray-white)` = #ffffff
- Dell Blue icon: `icon-DellBlue` = #0076CE
- Standard gray icon: `icon-standard-gray` = #616161
- Accessible icon: `var(--color-icon-gray-neutral-accessible)` = #757575
- Disabled icon: `var(--color-icon-gray-disabled)` = #757575
- Status icons: red (#AF0000), yellow (#FFC700), green (#1B8500)

### Alert Colors
- Critical background: `var(--color-background-alerting-critical-base)` = #af0000
- Info icon: `var(--color-icon-alerting-info-base)` = #005ece
- Info border: `var(--color-border-alerting-info-base-white)` = #005ece
- Minor icon: `var(--color-icon-alerting-minor-base)` = #ffc700
- Minor border: `var(--color-border-alerting-minor-base)` = #9c622e
- Success background: `var(--color-background-alerting-success-base)` = #1b8500
- Success border: `var(--color-border-alerting-success-base-white)` = #1b8500
- Success icon: `var(--color-icon-alerting-success-base)` = #1b8500

### Background Colors
- Brand lighter: `var(--color-background-brand-lighter-slate)` = #ebf4fb
- Gray base: `var(--color-background-gray-base)` = #757575
- Gray light: `var(--color-background-gray-light)` = #eaeaea
- Gray lighter: `var(--color-background-gray-lighter)` = #f4f4f4
- Gray neutral lighter: `var(--color-background-gray-neutral-lighter)` = #f4f4f4
- Masthead brand: `var(--color-background-masthead-base)` = #0076ce
- Surface: `var(--color-background-surface-primary)` = #f4f4f4
- Overlay: `var(--color-background-surface-overlay)` = #252525a6

### UI Palettes
- Dell Blue 100: `UI Palettes/Dell Blue/dell-blue-100` = #EBF4FB
- Dell Blue 200: `UI Palettes/Dell Blue/dell-blue-200` = #D9EAF8
- Dell Blue 500: `UI Palettes/Dell Blue/dell-blue-500` = #0076CE
- Dell Blue 600: `UI Palettes/Dell Blue/dell-blue-600` = #0062AB
- Gray 100: `UI Palettes/Gray/gray-100` = #F4F4F4
- Gray 200: `UI Palettes/Gray/gray-200` = #EAEAEA
- Gray 300: `UI Palettes/Gray/gray-300` = #C5C5C5
- Gray 500: `UI Palettes/Gray/gray-500` = #757575
- Gray 600: `UI Palettes/Gray/gray-600` = #616161
- Gray 700: `UI Palettes/Gray/gray-700` = #4D4D4D
- Gray 800: `UI Palettes/Gray/gray-800` = #393939
- Gray 900: `UI Palettes/Gray/gray-900` = #252525
- White: `UI Palettes/White` = #FFFFFF

### Alert Palettes
- Green 500: `Alert Palettes/Green/green-500` = #1B8500
- Red 500: `UI Palettes/Alert Palettes/Red/red-500` = #AF0000
- Yellow 500: `UI Palettes/Alert Palettes/Yellow/yellow-500` = #FFC700
- Yellow 800: `UI Palettes/Alert Palettes/Yellow/yellow-800` = #9C622E

### Other Colors
- Gray Medium 1: `Gray Medium 1` = #CCCCCC
- Gray Dark 1: `Gray Dark 1` = #333333
- Gray Dark 3: `Gray Dark 3` = #888888
- Blue Dark: `Blue Dark - #00447C` = #00447C
- Blue Medium: `Blue Medium - #6BACDE` = #6BACDE
- Dell Blue: `Dell Blue - #0076CE` = #0076CE
- Yellow Warning 1: `Yellow Warning 1 - #F2AF00` = #F2AF00
- Annotation: `Annotation` = #E8178A

### Spacing & Sizing
- Compact Density: `Compact Density` = 36
- Standard Density: `Standard Density` = 40
- Compact Cell Padding: `Compact/Cell - Vertical padding` = 8
- Standard Cell Padding: `Standard/Cell - Vertical padding` = 10
- Grid Cell Height: `Grid height/Cell` = 40
- Selection Header: `Selection/Header` = 16
- Selection Cell: `Selection/Cell` = 12
- Text Header: `Text/Header` = 5
- Text Cell: `Text/Cell` = 10

### Gradients
- Overflow Vertical Start: `var(--color-gradient-overflow-vertical-start)` = #b6b6b666
- Overflow Vertical End: `var(--color-gradient-overflow-vertical-end)` = #ffffff00

### Effects
- Level 4 shadow: Multi-layer drop shadow for elevation
### Typography
- Display 1/Default: Roboto Light 72px/88px (hero wizard titles)
- Header 1: Roboto Regular 48px/58px (main titles)
- Header 4: Roboto Regular 28px/34px (large titles)
- Header 5: Roboto Regular 24px/32px (standard titles)
- Header 6: Roboto Regular 18px/25px (small titles)
- Body 1: Roboto Regular 16px/24px (body text)
- Body 2: Roboto Regular 14px/20px (secondary text)
- Body 2 - Medium: Roboto Medium 14px/20px (emphasized text)
- Body 3: Roboto Regular 12px/18px (small text)
- Base Styles/Data Header: Roboto Medium 14px/20px (data headers)

### Token gaps and notes
- All colors use semantic CSS custom properties for theme consistency
- Typography scales are defined via font tokens with proper hierarchy
- Focus states use brand colors for visual consistency
- Alert variants use appropriate color tokens
- Shadow effects provide proper elevation and depth
- Wizard positioning should be responsive to viewport size
- Step indicators should be clearly distinguishable
## States (Light Theme)
| Element | Background | Border | Text | Icon |
|---|---|---|---|---|
| Wizard Container | `var(--color-background-surface-component)` (#ffffff) | `var(--color-border-gray-neutral-light)` (#c5c5c5) | `var(--color-text-gray-neutral)` (#4d4d4d) | `var(--color-icon-gray-neutral-base)` (#4d4d4d) |
| Header | `var(--color-background-surface-component)` (#ffffff) | transparent | `var(--color-text-gray-neutral-strong)` (#252525) | `var(--color-icon-gray-neutral-base)` (#4d4d4d) |
| Step Indicator | `var(--color-background-brand-lighter-slate)` (#ebf4fb) | `var(--color-border-brand-base)` (#0076ce) | `var(--color-text-brand-strong)` (#0062ab) | `var(--color-icon-brand-base)` (#0076ce) |
| Active Step | `var(--color-background-controls-base)` (#0076ce) | `var(--color-background-controls-base)` (#0076ce) | `var(--color-text-gray-white)` (#ffffff) | `var(--color-icon-gray-white)` (#ffffff) |
| Previous Button | `var(--color-background-surface-component)` (#ffffff) | `var(--color-border-gray-neutral-base)` (#757575) | `var(--color-text-gray-neutral)` (#4d4d4d) | `var(--color-icon-gray-neutral-base)` (#4d4d4d) |
| Next/Finish Button | `var(--color-background-controls-base)` (#0076ce) | `var(--color-background-controls-base)` (#0076ce) | `var(--color-text-gray-white)` (#ffffff) | `var(--color-icon-gray-white)` (#ffffff) |
| Cancel Button | `var(--color-background-surface-component)` (#ffffff) | `var(--color-border-gray-neutral-base)` (#757575) | `var(--color-text-gray-neutral)` (#4d4d4d) | `var(--color-icon-gray-neutral-base)` (#4d4d4d) |
| Overlay | `var(--color-background-surface-overlay)` (#252525a6) | transparent | transparent | transparent |
## States (Dark Theme)
- Uses semantic tokens that automatically adapt to dark theme
- Text and border colors remain consistent via semantic variables
- Overlay maintains consistent opacity
- Buttons adapt to dark theme automatically
## Interactions
- Click overlay to cancel wizard (with confirmation)
- Click Previous/Next/Finish buttons to navigate steps
- Press Escape key to cancel wizard
- Tab navigation within wizard
- Focus trap keeps focus within wizard
- Step validation prevents navigation to invalid steps
- Hover states on interactive elements
### Accessibility
- Focus ring: 2px brand color border
- Focus management: Trap focus within wizard when open
- Keyboard navigation: Tab to navigate, Enter to confirm, Escape to cancel
- Screen reader support: Proper ARIA attributes (dialog, modal, step indicators)
- High contrast: Meets WCAG AA standards with provided colors
- Semantic HTML: Use dialog element with proper roles
- Focus restoration: Return focus to trigger when closed
- Step announcements: Screen reader announces current step

### Behavior & guidelines
- Use wizards for multi-step processes
- Provide clear step descriptions and progress indication
- Allow navigation between completed steps when appropriate
- Implement proper validation for each step
- Show clear completion state and confirmation
- Test with screen readers for proper step announcements
- Consider mobile responsiveness and touch interactions
- Use consistent button ordering (Previous on left, Next/Finish on right)
## Composition & API (runtime)
Document runtime props, events, and variant axes. When **Variants** appears as a subsection below, treat it as the variant matrix source until a dedicated API table is authored.
### Variants
- **Default**: Standard wizard with step indicators
- **Linear**: Sequential steps, no skipping
- **Non-linear**: Can jump between completed steps
- **Validation**: With step validation indicators
- **Progress**: With progress bar instead of steps
- **Compact**: Reduced size for space-constrained interfaces
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
- [ ] Implement step navigation (Previous/Next/Finish)
- [ ] Add step validation and error handling
- [ ] Test keyboard navigation (Tab, Enter, Escape)
- [ ] Verify ARIA attributes and roles
- [ ] Test focus management and trapping
- [ ] Implement progress indication
- [ ] Add responsive sizing for mobile
- [ ] Test dark theme compatibility
- [ ] Verify screen reader announcements
- [ ] Test focus restoration on close
## Source Mapping
- Figma component: Wizard - Modal (11067-54621)
- Variable collection: UI Palettes, Alert Palettes, Typography tokens
- Semantic mapping: CSS custom properties with `var(--)` prefix
- Design source: Figma URL above
- Component map entry: data/component-figma-map.json → component "Wizard - Modal" (category "Modals and Wizards"; node "11067-54621")
