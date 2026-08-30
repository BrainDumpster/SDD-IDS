# Spinner Design Spec

## Metadata
- Component: Spinner
- Category: Loading and Progress
- Design system: IDS
- Figma (usage frame): https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=11099-58972&m=dev
- Figma (element prototype): https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=11466-98447&m=dev
- Node IDs:
  - Usage frame (3-up sample): `11099:58972` (includes small / medium / large examples + labels)
  - Spinner element prototype (rotation states): `11466:98447`
- Verification method: Figma MCP (`get_metadata`, `get_variable_defs`)
## Anatomy
- Spinner container
- Rotating circular element
- Optional loading text
- Optional backdrop overlay
- Focus ring for keyboard navigation
- Animation states
## Layout & Measurements
- Small spinner (icon-adjacent):
  - Visual size: 20px × 20px
  - Inner progress arc diameter: 10px
  - Arc stroke width: 2px
  - Container: inline with loading text (typography: Body 2)
- Medium spinner (primary inline sample in library frame):
  - Visual size: 40px × 40px
  - Inner progress arc diameter: 30px
  - Arc stroke width: 2px
  - Container: column layout with label centered below
- Large spinner (hero / page-level emphasis):
  - Visual size: 72px × 72px
  - Inner progress arc diameter: 62px
  - Arc stroke width: 2px
  - Container: 72px square, no label
- Spinner geometry:
  - Shape: circular (border radius 50%)
  - Arc thickness: fixed 2px across sizes
  - Filled progress segment length: fixed to one-third of circumference (120deg arc)
- Label spacing:
  - Inline small: 8px gap between spinner and text
  - Stacked medium: 8px vertical gap between spinner and label
- Minimum touch / focus region: 44px × 44px logical area when spinner is focusable

### Slot geometry (Figma-verified)
| Slot | Property | Value | Figma evidence |
|---|---|---|---|
| `spinnerVisual` (`sm`) | outer size | `20px` × `20px` | instance `11466:98512` in `Size=Small` `11099:58973` |
| `spinnerVisual` (`sm`) | inner progress (`Group 1`) | `10px` × `10px` | `I11466:98512;11466:98348` at `x=5, y=5` |
| `spinnerVisual` (`md`) | outer size | `40px` × `40px` | instance `11466:98483` in `Size=Medium` `11099:58976`; prototype variant `11466:98351` |
| `spinnerVisual` (`md`) | inner progress (`Group 1`) | `30px` × `30px` | `11466:98348` at `x=5, y=5` |
| `spinnerVisual` (`lg`) | outer size | `72px` × `72px` | instance `11466:98535` in `Size=Large` `11417:99226` |
| `spinnerVisual` (`lg`) | inner progress (`Group 1`) | `62px` × `62px` | `I11466:98535;11466:98348` at `x=5, y=5` |
| `spinnerTrack` | `border-radius` | `50%` (ellipse) | `Ellipse 2` `11466:98347` (`get_metadata`; circular fill, not a radius token) |
| `spinnerArc` | stroke width | `2px` | design-spec arc thickness; CSS mask `calc(100% - 2px)` |
| `spinnerArc` | arc coverage | `120deg` | Codegen Contract; CSS `conic-gradient` `0deg 120deg` |
| `label` (`sm` inline) | gap | `8px` | `Spacing/space-8` on `11099:58976` / `11099:58973`: spinner `20px` + text `x=28` |
| `label` (`md` stacked) | gap | `8px` | spinner height `40px` + label `y=48` on `11099:58976` |
## Tokens
### Colors (semantic)
- Spinner arc (brand): `var(--color-border-brand-base)` → resolves to `#0672cb` in light theme (live `get_variable_defs` on `11099:58976`).
- Spinner outer circle background / track: `var(--color-background-surface-secondary)` → resolves to `#ffffff` in light theme.
- Loading text: `var(--color-text-gray-neutral-strong)` → resolves to `#252525` in light theme.
- Loading text on brand background: `--color-text-gray-white` for contrast on brand-colored surfaces.

### Static references (for visual parity only)
- Static white: `var(--color-static-gray-white)` = `#ffffff` (used in Figma art; runtime uses semantic surface tokens).
- Static brand 500: `var(--color-static-brand-500)` (Figma art); runtime arc uses `var(--color-border-brand-base)` (`#0672cb` light, live `get_variable_defs`).

### Typography
- Loading text: `Body 2` → `Font(family: "Roboto", style: Regular, size: 14, weight: 400, lineHeight: 20, letterSpacing: 0)` via typography tokens.

### Per-slot style contract
- Spinner arc:
  - Render approach: CSS conic-gradient ring on pseudo-element with radial mask and rotation animation.
  - Stroke color: `var(--color-border-brand-base)`
  - Stroke width: `2px`
  - Arc coverage: 33.33% of full circle (120deg)
- Spinner track / disc:
  - Fill: `var(--color-background-surface-secondary)`
  - Shape: full circle sized to the outer spinner diameter.
- Label text:
  - Color: `var(--color-text-gray-neutral-strong)`
  - Alignment:
    - Small: inline-left/right depending on layout container
    - Medium: centered below spinner in usage frame
### Typography
- Body 2: Roboto Regular 14px/20px (loading text)

### Token gaps and notes
- Overlay color token (`var(--color-background-surface-overlay)`) should be referenced from the global theme definition.
- Focus ring tokens for overlay/focusable states must be aligned with the global focus specification; this spec does not redefine them.
- Determinate progress indication (percent-complete) is **out of scope** for this component and must use a progress bar or a dedicated determinate indicator spec.
## States (Light Theme)
| Variant | Element | Background | Border / Arc | Text | Animation |
|---|---|---|---|---|---|
| `inline` | Spinner arc | transparent | `var(--color-border-brand-base)` | n/a | Continuous rotation |
| `inline` | Inner disc | `var(--color-background-surface-secondary)` | none | n/a | none |
| `inline` | Loading text | transparent | none | `var(--color-text-gray-neutral-strong)` | none |
| `overlay` | Backdrop | `var(--color-background-surface-overlay)` | none | n/a | none |
| `overlay` | Spinner arc | transparent | `var(--color-border-brand-base)` | n/a | Continuous rotation |
| `overlay` | Loading text | transparent | none | `var(--color-text-gray-neutral-strong)` | none |

### Size-specific timing (light theme)
- All sizes use a single deterministic animation contract:
  - Rotation duration: `900ms`
  - Timing function: `linear`
  - Iteration count: `infinite`
  - Direction: `normal`
## States (Dark Theme)
| Variant | Element | Background | Border / Arc | Text | Notes |
|---|---|---|---|---|---|
| `inline` | Spinner arc | transparent | `var(--color-border-brand-base)` | n/a | Brand arc remains vivid on dark backgrounds. |
| `inline` | Inner disc | `var(--color-background-surface-secondary)` | none | n/a | Token resolves for dark theme surface contrast. |
| `inline` | Loading text | transparent | none | `var(--color-text-gray-neutral-strong)` | Ensures AA contrast on dark surfaces. |
| `overlay` | Backdrop | semantic overlay surface token (e.g. `var(--color-background-surface-overlay)`) | none | n/a | Dims content without hiding it. |
| `overlay` | Spinner arc | transparent | `var(--color-border-brand-base)` | n/a | Same as light theme. |
| `overlay` | Loading text | transparent | none | `var(--color-text-gray-neutral-strong)` | Same semantic token; resolves appropriately in dark. |
## Interactions
- Spinner is **non-interactive by default**:
  - No hover-only visual state.
  - No press state.
- Optional focusable mode (for accessibility and focus management):
  - When used as a focus anchor (e.g., within blocking overlays), the container MUST:
    - Expose a focus ring using the design system focus token.
    - Maintain continuous rotation while focused.
  - Focus does **not** pause or alter the animation.
- Loading text behavior:
  - Label text MAY update as loading progresses (e.g., "Loading...", "Almost there...").
  - Text changes MUST NOT reset or stutter the spinner animation.
- Overlay mode:
  - Overlay MAY be used for full-page loading.
  - Whether overlay click cancels loading is **implementation-specific** and MUST be documented at the application level if enabled.
  - Overlay MUST always preserve spinner visibility and contrast.
- Motion preference:
  - When `prefers-reduced-motion: reduce` is active, rotation MUST slow to a non-distracting cadence (minimum `1.8s`) rather than stop abruptly.
### Accessibility
- Focus ring: 2px brand color border
- Keyboard navigation: Tab to spinner when focusable
- Screen reader support: Proper ARIA attributes for loading state
- High contrast: Meets WCAG AA standards with provided colors
- Semantic HTML: Use div with proper loading indication
- Loading announcements: Screen reader announces loading state
- Focus management: Trap focus when overlay is present

### Behavior & guidelines
- Use spinners exclusively for **indeterminate** loading (unknown completion time).
- Prefer **inline** mode for localized operations (e.g., within a button row or panel).
- Prefer **overlay** mode for blocking, page-level operations where the entire view is loading.
- Always pair the spinner with a descriptive, localized loading label:
  - "Loading..." is acceptable as a default, but more specific text is preferred.
- Avoid running multiple spinners close together unless the design explicitly calls for it.
- Validate animation performance to avoid jank on low-powered devices.
## Composition & API (runtime)
- Slots / anatomy:
  - `spinnerRoot` (required): container for spinner + label.
  - `spinnerVisual` (required): circular element containing arc + track.
  - `spinnerArc` (required): visible arc that rotates.
  - `spinnerTrack` (optional): underlying disc/track.
  - `label` (optional): loading text.
  - `backdrop` (optional): dimming overlay for `mode="overlay"`.
- Required props (framework-agnostic):
  - `size`: `"sm" | "md" | "lg"` (default: `"md"`).
  - `mode`: `"inline" | "overlay"` (default: `"inline"`).
  - `label`: `string` (default: `"Loading..."`).
  - `labelVisibility`: `"sr-only" | "visible-below" | "visible-inline"` (default: `"sr-only"`).
  - `ariaLive`: `"polite" | "assertive" | "off"` (default: `"polite"`).
- Accessibility contract:
  - `spinnerRoot` MUST expose `role="status"` or `role="progressbar"` (indeterminate) with correct ARIA attributes.
  - When `labelVisibility="sr-only"`, label MUST still be present in the accessibility tree.
  - Overlay usage MUST preserve focus trapping rules defined at the application shell level.

### Runtime API
| Prop | Type | Default | Notes |
|---|---|---|---|
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Unknown → `"md"`. |
| `mode` | `"inline" \| "overlay"` | `"inline"` | Unknown → `"inline"`. Overlay wraps `backdrop` + `spinnerRoot`. |
| `label` | `string` | `"Loading..."` | Empty / whitespace → `"Loading..."`. |
| `labelVisibility` | `"sr-only" \| "visible-below" \| "visible-inline"` | `"sr-only"` | Incompatible values fall back per **Supported matrix**. |
| `ariaLive` | `"polite" \| "assertive" \| "off"` | `"polite"` | Unknown → `"polite"`. Bound as `aria-live` on `spinnerRoot`. |
| `tabIndex` | `number` (optional) | unset | Optional focusable mode; `0` exposes 2px brand focus ring and 44×44 min region. |

Framework selectors:
- Angular: `ids-spinner` (`lib/angular/ids/spinner`)
- React: `IdsSpinner` (`lib/react/ids/spinner`)

Contract mirror: `component-contracts/ids/spinner.contract.ts`

### Spec Accurate Design story defaults
- `size="md"`, `mode="inline"`, `label="Loading..."`, `labelVisibility="visible-below"`, `ariaLive="polite"`
- Matches Figma `Size=Medium` `11099:58976` (40×40 spinner, Body 2 label below, 8px gap).
### Variants

### Variant axes
- `size`:
  - `sm` → 20px spinner (inline, next to Body 2 text).
  - `md` → 40px spinner (primary inline size; centered with optional label below).
  - `lg` → 72px spinner (prominent, often within hero/overlay contexts).
- `mode`:
  - `inline` → spinner appears within existing content flow.
  - `overlay` → spinner appears above a dimmed backdrop that blocks interaction.
- `labelVisibility`:
  - `sr-only` → label is exposed only to assistive tech (screen-reader only).
  - `visible-below` → label is rendered below the spinner (as in library sample).
  - `visible-inline` → label is rendered inline next to small spinner.

### Supported matrix (runtime)
- `size=sm`:
  - `mode=inline` with `labelVisibility=visible-inline` or `sr-only`.
  - `mode=overlay` with `labelVisibility=sr-only` (app-level text may appear elsewhere).
- `size=md`:
  - `mode=inline` with `labelVisibility=visible-below` or `sr-only`.
  - `mode=overlay` with `labelVisibility=visible-below` or `sr-only`.
- `size=lg`:
  - `mode=inline` (hero sections) with `labelVisibility=visible-below` or `sr-only`.
  - `mode=overlay` with `labelVisibility=visible-below` or `sr-only`.
## Codegen Contract (Framework-Agnostic Blueprint)
- Slot schema:
  - Always generate `spinnerRoot` and `spinnerVisual`.
  - Generate `label` **only** when:
    - `labelVisibility !== "sr-only"` (for visible text) OR
    - `labelVisibility === "sr-only"` but accessible label is required.
  - Generate `backdrop` only when `mode="overlay"`.
- Variant handling:
  - Map `size` to fixed visual dimensions:
    - `sm` → 20px.
    - `md` → 40px.
    - `lg` → 72px.
  - Map `size` to fixed inner progress diameters:
    - `sm` → 10px.
    - `md` → 30px.
    - `lg` → 62px.
  - Arc stroke width is always `2px`.
  - Map `labelVisibility` to DOM structure, not styling hacks.
  - Do not generate determinate or percentage-based spinners from this spec (those require a separate component).
- Styling rules:
  - Spinner MUST be implemented with CSS-based rings (no SVG path/circle rendering).
  - Spinner filled progress segment MUST cover one-third of circumference (120deg).
  - All colors MUST be expressed using semantic tokens:
    - Arc: `var(--color-border-brand-base)`.
    - Inner disc/track: `var(--color-background-surface-secondary)`.
    - Overlay backdrop: `var(--color-background-surface-overlay)` when `mode="overlay"`.
    - Text: `var(--color-text-gray-neutral-strong)`.
  - Do not hardcode hex values in generated code.
- Behavior:
  - Spinner animation MUST run continuously while mounted and visible.
  - Generated code MUST not depend on CSS keyframe names; animation can be implemented via framework-appropriate mechanisms.
  - Default animation contract: `900ms linear infinite`.
  - Reduced-motion contract: `>=1800ms linear infinite`.
- Error / fallback behavior:
  - If an unknown `size` is provided at runtime, default to `md`.
  - If `label` is empty, fall back to `"Loading..."` for accessibility.
  - If `mode` is unknown, default to `"inline"`.
  - If `labelVisibility` is incompatible with layout context, fall back to:
    - `visible-inline` for `size="sm"` inline usage.
    - `visible-below` for `size="md"` inline usage.
    - `sr-only` for `size="lg"` usage.
### Validation checklist
- [ ] Geometry pass: outer sizes are exactly `20/40/72` and inner progress diameters are exactly `10/30/62`.
- [ ] Arc pass: filled segment is exactly `120deg` with `2px` ring thickness.
- [ ] Token pass: arc, disc, text, and overlay use only semantic tokens from this spec.
- [ ] Typography pass: loading text uses Body 2 metrics (`14/20`, regular weight).
- [ ] Accessibility pass: role/aria-live and sr-only behavior are present for all variants.
- [ ] Motion pass: default `900ms linear infinite`; reduced motion `>=1800ms linear infinite`.
- [ ] Layout pass: small inline label and medium stacked label spacing are exactly `8px`.
- [ ] Fallback pass: invalid `size|mode|label|labelVisibility` values resolve using declared defaults.
## Source Mapping
- Figma file key: `0bHk3XhrjFhowgFkz9yLr4` (`IDS-Design-Library`)
- Primary usage frame: node `11099:58972` (three side-by-side spinners + labels)
- Spinner element prototype: node `11466:98447` (rotation variants)
- Variables inspected (`get_variable_defs` on `11099:58976` and `11466:98447`):
  - `var(--color-background-surface-secondary)` = `#ffffff`
  - `var(--color-background-surface-overlay)` = design-system overlay token (resolved via active theme)
  - `var(--color-border-brand-base)` = `#0672cb` (light)
  - `var(--color-text-gray-neutral-strong)` = `#252525`
  - `Spacing/space-8` = `8`
  - `Font Size/body-2` = `14` / `Font Line Height/line-height-20` = `20`
- Verification method: Figma MCP (`get_metadata`, `get_variable_defs`)
- Last verified: 2026-08-19 (current session via Figma MCP)
- Runtime contract: `component-contracts/ids/spinner.contract.ts`
- Angular reference: `lib/angular/ids/spinner/` (`ids-spinner`)
- React reference: `lib/react/ids/spinner/` (`IdsSpinner`)
- Angular Storybook: `storybook-angular/src/components/ids-spinner/ids-spinner.stories.js` (title `Spec Generated/IDS/Spinner`)

## Implementation Notes
- Visible label is omitted for `size="lg"` in the Figma usage frame (`11417:99226` has no text node). Runtime still renders `label` as `sr-only` so the accessibility tree stays populated.
- `labelVisibility` controls `inline`, `below`, and `sr-only` label rendering.
- Loading text color: `var(--color-text-gray-neutral-strong)` by default; override to `--color-text-gray-white` when placed on a brand-colored surface (`var(--color-background-brand-base)`).
- Spinner disc background uses `var(--color-background-surface-secondary)` without a `#ffffff` fallback so dark themes resolve correctly.
- Loading text typography uses `var(--font-size-body-2)` and `var(--font-line-height-line-height-20)` tokens.
- Angular host uses `display: contents` so overlay/root layout matches the React outermost node (`ids-spinner-overlay` or `ids-spinner`).
