# About Design Spec

## Metadata
- **Storybook path:** `storybook-generated/ids/src/components/About.stories.tsx`
- **Deterministic generator:** `generation/deterministic_storybook/ids/about.py`
- Component: About
- Category: Patterns and Templates
- Figma: https://www.figma.com/design/VZJ48bbVYrIynw8DdSukWw/-Exploration-only--IDS-with-variables?node-id=30680-10863&m=dev
- Node ID: 30680-10863
## Anatomy
- About dialog/container
- Application logo/brand
- Application name and version
- Description text
- System information
- `CopyrightText` — single centered legal/copyright paragraph (one `<p>`; line wraps naturally)
- Links to resources
- Close button
- Focus ring for keyboard navigation
## Layout & Measurements
- Container width: 500px (minimum)
- Container height: Auto (based on content)
- Product logo size: 104px × 104px (Figma website `appic-dp-cloud-blue`)
- Header padding: 24px
- Content padding: 24px
- Footer padding: 16px 24px
- Border radius: 8px
- Focus ring: 2px offset from element
- Section spacing: 16px
- Close button: 16px × 16px
- Copyright / legal copy: **one paragraph**, centered as a block but `text-align: justify` with a centered last line (Figma Dell Branding Area — justify a paragraph to avoid ragged-right text); Body 2 or Body 3 per variant band; long copy wraps to multiple **lines** but must not split into multiple block paragraphs
## Tokens
### Colors
- White: `var(--color-text-gray-white)` = #ffffff
- Brand base: `var(--color-background-controls-base)` = #0076ce
- Component background: `var(--color-background-surface-component)` = #ffffff
- Neutral text: `var(--color-text-gray-neutral)` = #4d4d4d
- Neutral strong: `var(--color-text-gray-neutral-strong)` = #252525
- Brand strong text: `var(--color-text-brand-strong)` = #0062ab
- Link brand text: `var(--color-text-link-brand-base)` = #0062ab
- White text: `var(--color-text-gray-white)` = #ffffff
- Accessible border: `var(--color-border-gray-neutral-base)` = #757575
- Brand border: `var(--color-border-brand-base)` = #0076ce
- Light border: `var(--color-border-gray-neutral-light)` = #c5c5c5
- Transparent brand: `var(--color-border-brand-transparent-brand)` = #ffffff00

### Icons
- Brand icon: `var(--color-icon-brand-base)` = #0076ce
- Neutral icon: `var(--color-icon-gray-neutral-base)` = #4d4d4d
- Neutral strong icon: `var(--color-icon-gray-neutral-strong)` = #252525
- Success icon: `var(--color-icon-alerting-success-base)` = #1b8500

### Background Colors
- Brand lighter: `var(--color-background-controls-lighter)` = #ebf4fb
- Gray light: `var(--color-background-gray-light)` = #eaeaea
- Gray base: `var(--color-background-gray-base)` = #757575

### UI Palettes
- Dell Blue 500: `UI Palettes/Dell Blue/dell-blue-500` = #0076CE
- Gray 100: `UI Palettes/Gray/gray-100` = #F4F4F4
- Gray 900: `UI Palettes/Gray/gray-900` = #252525

### Other Colors
- Annotation: `Annotation` = #E8178A

### Spacing & Sizing
- Standard Density: `Standard Density` = 48
- Loose Density: `Loose Density` = 56

### Gradients
- Overflow Vertical Start: `var(--color-gradient-overflow-vertical-start)` = #b6b6b666
- Overflow Vertical End: `var(--color-gradient-overflow-vertical-end)` = #ffffff00

### Effects
- Level 4 shadow: Multi-layer drop shadow for elevation
### Typography
- Header 1: Roboto Regular 48px/58px (application name)
- Header 6: Roboto Regular 18px/25px (section headers)
- Body 2: Roboto Regular 14px/20px (descriptive text)
- Body 3: Roboto Regular 12px/18px (legal text)

### Token gaps and notes
- All colors use semantic CSS custom properties for theme consistency
- Typography scales are defined via font tokens with proper hierarchy
- Focus states use brand colors for visual consistency
- Link states provide clear visual feedback
- Dark theme adaptation through semantic tokens
- About dialog should be responsive and accessible
## States (Light Theme)
| Element | Background | Border | Text | Icon |
|---|---|---|---|---|
| About Container | `var(--color-background-surface-component)` (#ffffff) | `var(--color-border-gray-neutral-light)` (#c5c5c5) | `var(--color-text-gray-neutral-strong)` (#252525) | `var(--color-icon-gray-neutral-base)` (#4d4d4d) |
| Header Section (product name) | `var(--color-background-surface-component)` (#ffffff) | transparent | `Header 1` Roboto Regular 48px/58px, `var(--color-text-brand-base)` (Color/Text/Brand/Base, dell-blue-500) | `var(--color-icon-brand-base)` (dell-blue-500) product icon |
| Content Section | `var(--color-background-surface-component)` (#ffffff) | transparent | `Body 2` (Roboto Regular 14px/20px) | `var(--color-icon-gray-neutral-base)` (#4d4d4d) |
| Legal Section | `UI Palettes/Gray/gray-100` (#F4F4F4) | transparent | `Body 3` (Roboto Regular 12px/18px) | `var(--color-icon-gray-neutral-strong)` (#252525) |
| Link (Default) | transparent | transparent | `var(--color-text-link-brand-base)` (#0062ab) | `var(--color-icon-brand-base)` (#0076ce) |
| Link (Hover) | `var(--color-background-controls-lighter)` (#ebf4fb) | transparent | `var(--color-text-brand-strong)` (#0062ab) | `var(--color-icon-brand-base)` (#0076ce) |
| Close Button (Default) | transparent | transparent | `var(--color-icon-gray-neutral-base)` (#4d4d4d) | `var(--color-icon-gray-neutral-base)` (#4d4d4d) |
| Close Button (Hover) | transparent | transparent | `var(--color-icon-gray-neutral-strong)` (#252525) | `var(--color-icon-gray-neutral-strong)` (#252525) |
## States (Dark Theme)
- Uses semantic tokens that automatically adapt to dark theme
- Text and border colors remain consistent via semantic variables
- About container maintains visibility in dark theme
- Links adapt to dark theme
## Interactions
- Click links to navigate to external resources
- Hover provides visual feedback on links
- Focus ring uses brand color for keyboard navigation
- Click close button to dismiss about dialog
- Keyboard navigation: Tab to navigate, Enter to activate, Escape to close
- Optional scroll for long content
### Accessibility
- Focus ring: 2px brand color border
- Keyboard navigation: Tab, Enter, Escape
- Screen reader support: Proper ARIA attributes for about dialog
- High contrast: Meets WCAG AA standards with provided colors
- Semantic HTML: Use dialog element with proper landmarks
- Focus management: Logical tab order through about elements
- Content announcements: Screen reader announces about content

### Behavior & guidelines
- Use about dialog for application information
- Provide clear application branding and version
- Include relevant legal and copyright information as **one centered paragraph** (not multiple `<p>` blocks)
- Use consistent styling across about variants
- Test with screen readers for proper content announcement
- Consider responsive behavior for different screen sizes
- Use keyboard navigation for accessibility
- Provide visual feedback for all interactions
## Composition & API (runtime)
Document runtime props, events, and variant axes. When **Variants** appears as a subsection below, treat it as the variant matrix source until a dedicated API table is authored.
### Runtime API (copyright)

| Prop / slot | Contract |
|---|---|
| `copyrightText` / `legalText` | Single string → one centered paragraph; collapse extraneous whitespace |
| `copyrightContent` / `legalContent` | Custom node; host should still render as one centered block |

### Variants
- **Default**: Standard about dialog
- **Modal**: About dialog as modal overlay
- **Inline**: About content inline in page
- **Minimal**: Simplified about information
- **Detailed**: Comprehensive about with system info
- **Branded**: About with enhanced branding
- **With Updates**: About with latest update information
- **With Support**: About with support links
## Codegen Contract (Framework-Agnostic Blueprint)
### Deterministic structure
Follow **Anatomy** (same slot order). Codegen must emit stable PascalCase slot identifiers aligned with anatomy labels.

### Variant matrix
See **Composition & API (runtime) → Variants** when present; otherwise document variant axes in this subsection during spec hardening.

### Per-slot style contract
Resolve backgrounds, borders, typography, and icons from **Tokens** and **States (Light Theme)** / **States (Dark Theme)** using `var(--...)` only.

- `CopyrightText`: one `<p>` (or host-equivalent), centered block with `text-align: justify` + centered last line, typography from legal band (Body 3 in gray legal section; Body 2 when inline with brand cluster in programme forks)

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
- [ ] Implement about dialog functionality
- [ ] Add proper focus management
- [ ] Test keyboard navigation (Tab, Enter, Escape)
- [ ] Verify ARIA attributes and roles
- [ ] Test hover and focus states
- [ ] Implement link functionality
- [ ] Add system information display
- [ ] Test dark theme compatibility
- [ ] Verify screen reader announcements
- [ ] Test responsive behavior
## Source Mapping
- Figma component: About (30680-10863)
- Variable collection: UI Palettes, Typography tokens
- Semantic mapping: CSS custom properties with `var(--)` prefix
- Design source: Figma URL above
- Component map entry: data/component-figma-map.json → component "About" (category "Patterns and Templates"; node "30680-10863")

## Implementation Notes

### 2026-11-19 — Figma website alignment (node `340:733`): corners, close button, optional icon, spacing
- **Corners:** the IDS About surface is **square** (`--corner-radius-radius-none`). `About` defaults to `programme="ids"` (`.popupIds`); `programme="synapse"` keeps the 16px radius. (Previously hardcoded `synapse`, which rounded the IDS About.)
- **Close button:** the header close composes the IDS **Icon Button** — `variant="ghost"`, `size="large"`, icon `ctrl-close-16` (Figma Icon Button: Type Ghost / Size Large).
- **Product icon is optional** (Figma `340:930` has none). Pass `productLogo` / `productLogoSrc` to show it; omit for the title-only layout. When shown it is a brand-tinted `Icon` (`appic-dp-cloud-blue`, `104×104`).
- **Spacing (Figma):** ~48px above the product icon, 8px icon→title, 4px title→version→serial, ~48px content→DELL lockup, 8px DELL→copyright; header/content/footer padding `24`.
- **Footer divider** uses `--color-border-gray-neutral-light` (was the non-existent `--color-border-neutral-light`). All About colors are semantic tokens → light/dark resolve automatically.

### 2026-11-19 — Product brand logo above the product name
- The About surface renders a product brand logo (the Figma shield/app icon) **centered above** the product name. In the implementation this is an `aboutLogo` slot on the shared `Dialog` (about variant), rendered before the product title; `About` exposes it via `productLogoSrc` (image URL) / `productLogo` (node). Rendered height `104px` (Figma website `appic-dp-cloud-blue` `104×104`), width auto. This is separate from the DELL Technologies lockup (`logoSrc`), which stays in the lower brand cluster.

### 2026-11-20 — Figma website doc alignment: product cluster color, justified copyright
- **Product name + product icon are dell-blue-500** (brand `-base` tokens). The Figma design binds the product name text to `Color/Text/Brand/Base` and the product icon to the brand-base icon fill — both dell-blue-500 (#0672cb), same hue as the Dell Technologies lockup. (The website doc's prose mentions "dell-blue-600 (#0062AB)", but the live design uses brand-base; the design binding is authoritative.) Implementation: product title → `var(--color-text-brand-base)`; product icon tint → `var(--color-icon-brand-base)`.
- **Copyright paragraph is justified.** The Dell Branding Area is center-aligned as a block, but the copyright paragraph uses `text-align: justify` with a centered last line so both edges stay flush (the spec calls to avoid ragged-right text; the design renders the paragraph justified).
- **Product name wrapping:** max width 800px, no truncation, wraps to at most 2 lines (guideline: 60-char limit for Roboto at 48px).

### 2026-11-19 — Optional header tab bar (Figma `Tabs=True`)
- When `tabs` is supplied, the About header becomes the Figma `MODAL-TAB-BAR`: the tab row sits on the left and the close control on the right. `About` forwards `tabs` to the `Dialog` about header (`.aboutTabStrip`), with the tab panel suppressed since the About content lives in the modal body. Without `tabs`, the header keeps its spacer + close layout.
