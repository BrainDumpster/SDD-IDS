# Card Design Spec

## Metadata
- Component: Card
- Category: Patterns and Templates
- Figma: https://www.figma.com/design/VZJ48bbVYrIynw8DdSukWw/-Exploration-only--IDS-with-variables?node-id=11067-54678&m=dev
- Node ID: 11067-54678
## Anatomy
- Card container with background
- Optional header section
- Content area for body text
- Optional footer with actions
- Optional media/image area
- Focus ring for keyboard navigation
- Optional elevation/shadow
## Layout & Measurements
- Standard padding: 16px
- Header padding: 16px 16px 8px 16px
- Content padding: 8px 16px
- Footer padding: 8px 16px 16px 16px
- Control corner radius: `var(--card-control-radius)` (IDS theme resolves to `var(--corner-radius-radius-8)` / 8px)
- Minimum height: 120px
- Card spacing: 16px (grid layout)
- Focus ring: 2px offset from card
## Tokens
### Layout aliases (theme-resolvable)
Programmes override these **same alias names** in programme theme CSS. Component specs and generated CSS reference aliases only.

| Alias | IDS default (`components/ids-theme.css`) |
|---|---|
| `--card-control-radius` | `var(--corner-radius-radius-8)` |

### Colors
- White: `var(--color-text-white)` = #ffffff
- Brand base: `var(--color-background-controls-brand-base)` = #0076ce
- Component background: `var(--color-background-component)` = #ffffff
- Surface background: `var(--color-background-surface-2)` = #ffffff
- Neutral text: `var(--color-text-neutral)` = #4d4d4d
- Neutral strong: `var(--color-text-neutral-strong)` = #252525
- Brand strong text: `var(--color-text-brand-strong)` = #0062ab
- Link brand strong: `var(--color-text-link-brand-strong)` = #06528a
- Light border: `var(--color-border-light)` = #c5c5c5

### Icons
- Neutral icon: `var(--color-icon-neutral)` = #4d4d4d
- Accessible icon: `var(--color-icon-accessible)` = #757575
- Standard gray icon: `icon-standard-gray` = #616161
- White icon: `icon-white` = #FFFFFF
- Status green icon: `icon-status-green` = #1B8500

### Background Colors
- Brand light: `var(--color-background-brand-light)` = #d9eaf8
- Success background: `var(--color-background-alerting-success)` = #1b8500

### UI Palettes
- Dell Blue 500: `UI Palettes/Dell Blue/dell-blue-500` = #0076CE
- Gray 100: `UI Palettes/Gray/gray-100` = #F4F4F4
- Gray 400: `UI Palettes/Gray/gray-400` = #9E9E9E
- Gray 900: `UI Palettes/Gray/gray-900` = #252525

### Other Colors
- Annotation: `Annotation` = #E8178A

### Spacing & Sizing
- Compact Density: `Compact Density` = 36
- Compact Cell Padding: `Compact/Cell - Vertical padding` = 8
### Typography
- Header 6: Roboto Regular 18px/25px (card headers)
- Body 1: Roboto Regular 16px/24px (card content)
- Body 2: Roboto Regular 14px/20px (secondary text)
- Body 3: Roboto Regular 12px/18px (small text)

### Token gaps and notes
- All colors use semantic CSS custom properties for theme consistency
- Typography scales are defined via font tokens with proper hierarchy
- Focus states use brand colors for visual consistency
- Selected states use brand colors for clear indication
- Disabled states maintain accessibility with proper contrast
- Card layouts should follow consistent spacing patterns
## States (Light Theme)
| State | Background | Border | Text | Icon |
|---|---|---|---|---|
| Default | `var(--color-background-component)` (#ffffff) | `var(--color-border-light)` (#c5c5c5) | `var(--color-text-neutral)` (#4d4d4d) | `var(--color-icon-neutral)` (#4d4d4d) |
| Hover | `var(--color-background-component)` (#ffffff) | `var(--color-border-brand-base)` (#0076ce) | `var(--color-text-neutral)` (#4d4d4d) | `var(--color-icon-brand-base)` (#0076ce) |
| Focus | `var(--color-background-component)` (#ffffff) | `var(--color-border-brand-base)` (#0076ce) | `var(--color-text-neutral)` (#4d4d4d) | `var(--color-icon-brand-base)` (#0076ce) |
| Selected | `var(--color-background-brand-light)` (#d9eaf8) | `var(--color-border-brand-base)` (#0076ce) | `var(--color-text-brand-strong)` (#0062ab) | `var(--color-icon-brand-base)` (#0076ce) |
| Disabled | `UI Palettes/Gray/gray-100` (#F4F4F4) | `UI Palettes/Gray/gray-400` (#9E9E9E) | `var(--color-text-disabled)` (#757575) | `var(--color-icon-accessible)` (#757575) |
## States (Dark Theme)
- Uses semantic tokens that automatically adapt to dark theme
- Surface tokens: `var(--color-background-surface-2)` (#ffffff)
- Text and border colors remain consistent via semantic variables
- Selected state uses brand colors for clear indication
## Interactions
- Click card to select or trigger action
- Hover provides visual feedback with border changes
- Focus ring uses brand color for keyboard navigation
- Selected state shows brand background and border
- Disabled state prevents interaction and uses gray colors
- Cards can be used as containers or interactive elements
### Accessibility
- Focus ring: 2px brand color border
- Keyboard navigation: Tab to cards, Enter/Space to activate
- Screen reader support: Proper ARIA attributes for interactive cards
- High contrast: Meets WCAG AA standards with provided colors
- Semantic HTML: Use article element for content cards, button for interactive
- Focus management: Proper focus indication for keyboard users

### Behavior & guidelines
- Use cards to group related content
- Maintain consistent card sizes within layouts
- Use clear visual hierarchy with headers and content
- Implement proper spacing in card grids
- Test with screen readers for proper content announcement
- Consider responsive behavior for different screen sizes
- Use cards for both content display and interactive elements
## Composition & API (runtime)
Document runtime props, events, and variant axes. When **Variants** appears as a subsection below, treat it as the variant matrix source until a dedicated API table is authored.
### Variants
- **Default**: Standard content card
- **Interactive**: Clickable card with hover states
- **Selected**: Card with selection indication
- **Disabled**: Non-interactive card
- **Elevated**: Card with shadow/elevation
- **Bordered**: Card with prominent border
- **Compact**: Reduced padding and size
- **Media**: Card with image or media content
## Codegen Contract (Framework-Agnostic Blueprint)
### Deterministic structure
Follow **Anatomy** (same slot order). Codegen must emit stable PascalCase slot identifiers aligned with anatomy labels.

### Variant matrix
See **Composition & API (runtime) → Variants** when present; otherwise document variant axes in this subsection during spec hardening.

### Per-slot style contract
Resolve backgrounds, borders, typography, and icons from **Tokens** and **States (Light Theme)** / **States (Dark Theme)** using `var(--...)` only.

| Slot | CSS property | Token |
|---|---|---|
| `CardRoot` | `border-radius` | `var(--card-control-radius)` |

### Theme & programme resolution
- Generators **must** emit `var(--card-control-radius)`, never raw `px` or programme-specific scale tokens in component CSS.
- Theme selection: IDS → `components/ids-theme.css`; Synapse → `components/synapse-theme.css`; DAP → `components/dap-theme.css`.
- Programme forks document alias deltas in the programme deltas table; implementations rely on programme theme CSS.

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
- [ ] Layout uses `var(--card-control-radius)`, not hardcoded px
- [ ] Alias defined in `components/ids-theme.css` and documented in Tokens
- [ ] Programme fork deltas list alias override when radius differs (Synapse: 10px)
- [ ] Implement interactive card behavior
- [ ] Add proper focus management
- [ ] Test keyboard navigation (Tab, Enter/Space)
- [ ] Verify ARIA attributes and roles
- [ ] Test hover and focus states
- [ ] Implement selected state styling
- [ ] Add responsive grid layout
- [ ] Test dark theme compatibility
- [ ] Verify screen reader announcements
- [ ] Test card elevation and shadows
## Source Mapping
- Figma component: Card (11067-54678)
- Variable collection: UI Palettes, Typography tokens
- Semantic mapping: CSS custom properties with `var(--)` prefix
- Design source: Figma URL above
- Component map entry: data/component-figma-map.json → component "Card" (category "Patterns and Templates"; node "11067-54678")
