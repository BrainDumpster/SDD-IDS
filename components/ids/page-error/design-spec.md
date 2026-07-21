# Page Error Design Spec

## Metadata
- Component: Page Error
- Design System: IDS
- Category: Patterns and Templates
- Spec pattern: ids-native
- Canonical Figma file: https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library
- Figma: https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=26744-12102&m=dev
- File key: `0bHk3XhrjFhowgFkz9yLr4`
- Main node: `26744:12102` (`PageError-Main`)
- Evidence nodes:
  - icon: `26744:12088` (`Icon`)
  - error glyph: `26744:12089` (`Stroke / state-error`)
  - error content: `26744:12091` (`Error Content`)
  - error name: `26744:12092` (`<Error Name>`)
  - error code: `26744:12093` (`<Error Code>`)
  - probable cause: `26744:12094` (`<Probable Cause>`)
  - resolution section: `49163:97378` (`.PageError-Elements-Resolution/True`)
  - resolution content: `49163:97379` (`Resolution Content`)
  - resolutions text: `49163:97380` (`<Resolutions/Suggestions>`)
  - action button: `49163:97381` (`Button`)
  - action button text: `I49163:97381;9662:25628` (`Action`)
- Last live verification: Figma MCP (`get_metadata`, `get_design_context`, `get_variable_defs`) on 2026-07-12.
- Verification evidence: `get_design_context` returned React+Tailwind code; `get_variable_defs` resolved the semantic tokens and primitive variables for `26744:12102` and `49163:97381`; `get_metadata` confirmed `26744:12102` bounding box `726x388`.
- Status: draft
- Version: 1.0.0
- Description: Full-page error pattern that displays an error icon, name, code, probable cause, optional resolution guidance, and an optional action button.
- Storybook examples requested: yes
- Storybook path: `storybook-generated/ids/src/components/PageError.stories.tsx`
- Storybook title: `Spec Generated/IDS/Page Error`

## Anatomy
1. `PageErrorRoot` — outer centered container.
2. `PageErrorIconSlot` — 80x80 icon area wrapping the `Stroke / state-error` glyph.
3. `PageErrorContent` — vertical text stack (`Error Content`).
4. `PageErrorErrorName` — primary heading (`<Error Name>`).
5. `PageErrorErrorCode` — secondary heading (`<Error Code>`).
6. `PageErrorProbableCause` — body explanation (`<Probable Cause>`).
7. `PageErrorResolutionSection` — optional resolutions block.
8. `PageErrorResolutionsSuggestions` — resolution guidance text (`<Resolutions/Suggestions>`).
9. `PageErrorActionButton` — optional IDS `Button` instance (`Action` label).

### Slot hierarchy
- `PageErrorRoot`
  - `PageErrorIconSlot` (80x80, centered)
  - `PageErrorContent`
    - `PageErrorErrorName` (header-2)
    - `PageErrorErrorCode` (header-5)
    - `PageErrorProbableCause` (body-1)
    - `PageErrorResolutionSection` (optional; condition `showResolution = true`)
      - `PageErrorResolutionsSuggestions` (body-1)
      - `PageErrorActionButton` (optional; condition `action != undefined`)

## Layout & Measurements
- `PageErrorRoot`:
  - Figma sample frame: `726px` width × `388px` height.
  - Runtime: width `100%` of parent container; height `fit-content` (no fixed height).
  - Flex column, `align-items: center`, `justify-content: center`.
  - Padding: `var(--padding-padding-24, 24px)` all sides.
  - Gap between icon and content: `var(--spacing-space-32, 32px)`.
  - Background: transparent (Figma `PageError-Main` has no explicit fill; it inherits the page/surface background).
  - `text-align: center` for legacy inline fallback.
- `PageErrorIconSlot`:
  - Width: `80px`; Height: `80px`.
  - `display: flex; align-items: center; justify-content: center`.
  - `flex-shrink: 0`.
  - Inner `Stroke / state-error` image is `80x80` and centered.
  - No border-radius; no background.
- `PageErrorContent`:
  - Flex column, `align-items: center`.
  - Gap: `var(--spacing-space-16, 16px)`.
  - Width: `100%`.
- `PageErrorErrorName`:
  - Font: `var(--font-size-header-2, 36px) / var(--font-line-height-line-height-44, 44px)`.
  - Weight: `400` (regular).
  - Color: `var(--color-text-neutral-strong, #252525)`.
  - Text-align: center; `word-break: break-word`.
  - `margin: 0`.
- `PageErrorErrorCode`:
  - Font: `var(--font-size-header-5, 24px) / var(--font-line-height-line-height-32, 32px)`.
  - Weight: `400`.
  - Color: `var(--color-text-neutral-strong, #252525)`.
  - Text-align: center.
  - `margin: 0`.
- `PageErrorProbableCause`:
  - Font: `var(--font-size-body-1, 16px) / var(--font-line-height-line-height-24, 24px)`.
  - Weight: `400`.
  - Color: `var(--color-text-neutral, #4d4d4d)`.
  - Text-align: center.
  - `margin: 0`.
- `PageErrorResolutionSection`:
  - Figma sample width: `678px`.
  - Runtime: `width: 100%` with `max-width` matching the Figma sample (`678px`), and `max-width: 100%` for narrow viewports.
  - Flex column, `align-items: center`.
  - Gap: `var(--spacing-space-16, 16px)`.
- `PageErrorResolutionsSuggestions`:
  - Font: `var(--font-size-body-1, 16px) / var(--font-line-height-line-height-24, 24px)`.
  - Color: `var(--color-text-neutral, #4d4d4d)`.
  - Text-align: center.
  - `margin: 0`.
- `PageErrorActionButton`:
  - Min-height: `var(--scale-40, 40px)`.
  - Padding: `var(--padding-padding-10, 10px)` block, `var(--padding-padding-16, 16px)` inline.
  - Gap: `var(--spacing-space-8, 8px)`.
  - Border: `var(--border-width-border-default, 1px) solid var(--color-border-brand-base, #0672cb)`.
  - Border-radius: `var(--button-control-radius, var(--corner-radius-radius-2, 2px))`.
  - Text: `var(--font-size-body-2, 14px) / var(--font-line-height-line-height-20, 20px)`, `var(--color-text-brand-strong, #055fa9)`.

### Slot geometry (Figma-verified)

| Slot / layer | Property | Token / contract | Figma node | Live evidence |
| --- | --- | --- | --- | --- |
| `PageErrorRoot` | padding | `var(--padding-padding-24, 24px)` | `26744:12102` | `get_design_context` + `get_variable_defs` |
| `PageErrorRoot` | gap (icon → content) | `var(--spacing-space-32, 32px)` | `26744:12102` | `get_design_context` + `get_variable_defs` |
| `PageErrorIconSlot` | width / height | `80px` fixed | `26744:12088` | `get_design_context` |
| `PageErrorIconSlot` | icon color | `var(--color-icon-disabled, #757575)` | `26744:12089` | `get_variable_defs` |
| `PageErrorContent` | gap | `var(--spacing-space-16, 16px)` | `26744:12091` | `get_design_context` + `get_variable_defs` |
| `PageErrorErrorName` | typography | `var(--font-size-header-2, 36px)` / `var(--font-line-height-line-height-44, 44px)` | `26744:12092` | `get_design_context` + `get_variable_defs` |
| `PageErrorErrorCode` | typography | `var(--font-size-header-5, 24px)` / `var(--font-line-height-line-height-32, 32px)` | `26744:12093` | `get_design_context` + `get_variable_defs` |
| `PageErrorProbableCause` | typography | `var(--font-size-body-1, 16px)` / `var(--font-line-height-line-height-24, 24px)` | `26744:12094` | `get_design_context` + `get_variable_defs` |
| `PageErrorResolutionSection` | width | `678px` sample; runtime `max-width: 678px` | `49163:97378` | `get_design_context` |
| `PageErrorResolutionSection` | gap | `var(--spacing-space-16, 16px)` | `49163:97379` | `get_design_context` + `get_variable_defs` |
| `PageErrorResolutionsSuggestions` | typography | `var(--font-size-body-1, 16px)` / `var(--font-line-height-line-height-24, 24px)` | `49163:97380` | `get_design_context` + `get_variable_defs` |
| `PageErrorActionButton` | border-radius | `var(--corner-radius-radius-2, 2px)` | `49163:97381` | `get_variable_defs` (`Corner Radius/radius-2` = 2) |
| `PageErrorActionButton` | border | `var(--border-width-border-default, 1px) solid var(--color-border-brand-base, #0672cb)` | `49163:97381` | `get_variable_defs` |
| `PageErrorActionButton` | padding | `var(--padding-padding-10, 10px)` block / `var(--padding-padding-16, 16px)` inline | `49163:97381` | `get_variable_defs` |
| `PageErrorActionButton` | text color | `var(--color-text-brand-strong, #055fa9)` | `49163:97381` | `get_variable_defs` |
| `PageErrorActionButton` | typography | `var(--font-size-body-2, 14px)` / `var(--font-line-height-line-height-20, 20px)` | `I49163:97381;9662:25628` | `get_design_context` + `get_variable_defs` |

**Geometry authoring rules:**
- Figma sample `726px` width is a frame-only sample; runtime must not hardcode a fixed width.
- `678px` resolution section width is a sample-only max-width; runtime must clamp to `100%` of the container.
- All typography/spacing/padding values are `var(--...)` with documented fallbacks; implementation must map `Spacing/space-32` to `--spacing-space-32`, etc., and add missing primitive tokens to `components/ids-theme.css` if they are not yet present.

## Tokens
### Typography
- `var(--font-size-header-2, 36px)` — `PageErrorErrorName`.
- `var(--font-size-header-5, 24px)` — `PageErrorErrorCode`.
- `var(--font-size-body-1, 16px)` — `PageErrorProbableCause`, `PageErrorResolutionsSuggestions`.
- `var(--font-size-body-2, 14px)` — `PageErrorActionButton` label.
- `var(--font-line-height-line-height-44, 44px)` — header-2 line-height.
- `var(--font-line-height-line-height-32, 32px)` — header-5 line-height.
- `var(--font-line-height-line-height-24, 24px)` — body-1 line-height.
- `var(--font-line-height-line-height-20, 20px)` — body-2 line-height.
- Font family: `var(--typography-font-style-primary, 'Roboto:Regular')` / `var(--typography-font-weight-regular, 'Regular')`.

### Colors and surfaces
- `PageErrorRoot` has no background fill; it inherits the page/surface background.
- `var(--color-text-neutral-strong, #252525)` — `PageErrorErrorName`, `PageErrorErrorCode`.
- `var(--color-text-neutral, #4d4d4d)` — `PageErrorProbableCause`, `PageErrorResolutionsSuggestions`.
- `var(--color-text-brand-strong, #055fa9)` — `PageErrorActionButton` label.
- `var(--color-border-brand-base, #0672cb)` — `PageErrorActionButton` border.
- `var(--color-icon-disabled, #757575)` — `PageErrorIconSlot` glyph color (verified from Figma `26744:12089`).

### Spacing and sizing
- `var(--spacing-space-32, 32px)` — gap between icon and content.
- `var(--spacing-space-16, 16px)` — gap inside content and inside resolution section.
- `var(--spacing-space-8, 8px)` — button inner gap.
- `var(--padding-padding-24, 24px)` — root padding.
- `var(--padding-padding-16, 16px)` — button inline padding.
- `var(--padding-padding-10, 10px)` — button block padding.
- `var(--padding-padding-none, 0px)` — icon frame padding.

### Borders and radius
- `var(--border-width-border-default, 1px)` — button border width.
- `var(--corner-radius-radius-2, 2px)` — button border-radius (alias `var(--button-control-radius)` in `components/ids-theme.css`).

## States (Light Theme)
Page Error is a static pattern; the root text slots have no hover/press states. The only interactive element is `PageErrorActionButton`, which is a nested IDS `Button` component and inherits the IDS `Button` state matrix.

| Slot | State | Background | Border | Text/Icon |
| --- | --- | --- | --- | --- |
| `PageErrorActionButton` | default | `var(--color-background-component, #ffffff)` | `var(--color-border-brand-base, #0672cb)` | `var(--color-text-brand-strong, #055fa9)` |
| `PageErrorActionButton` | hover | `var(--color-background-brand-lighter, #ebf4fb)` | `var(--color-border-brand-base, #0672cb)` | `var(--color-text-brand-strong, #055fa9)` |
| `PageErrorActionButton` | press | `var(--color-background-brand-light, #daeaf7)` | `var(--color-border-brand-base, #0672cb)` | `var(--color-text-brand-strong, #055fa9)` |
| `PageErrorActionButton` | focus-visible | `var(--color-background-component, #ffffff)` + `var(--button-focus-ring-offset, 3px)` outline | `var(--color-border-brand-base, #0672cb)` + focus ring `var(--color-border-brand-base, #0672cb)` | `var(--color-text-brand-strong, #055fa9)` |
| `PageErrorActionButton` | disabled | `var(--color-background-component-light, #f4f4f4)` | `var(--color-border-disabled, #757575)` | `var(--color-text-disabled, #757575)` |

Root text slots are static in all states.

## States (Dark Theme)
Dark theme uses the same semantic tokens as **States (Light Theme)**. Resolved values for `[data-theme="dark"]` / `.ids-theme-dark` live in `components/ids-theme.css`.

| Slot | State | Background | Border | Text/Icon |
| --- | --- | --- | --- | --- |
| `PageErrorActionButton` | default | `var(--color-background-component, #111619)` | `var(--color-border-brand-base, #509cda)` | `var(--color-text-brand-strong, #97c4e9)` |
| `PageErrorActionButton` | hover | `var(--color-background-brand-lighter, #1e262c)` | `var(--color-border-brand-base, #509cda)` | `var(--color-text-brand-strong, #97c4e9)` |
| `PageErrorActionButton` | press | `var(--color-background-brand-light, #34414c)` | `var(--color-border-brand-base, #509cda)` | `var(--color-text-brand-strong, #97c4e9)` |
| `PageErrorActionButton` | focus-visible | `var(--color-background-component, #111619)` + focus ring | `var(--color-border-brand-base, #509cda)` | `var(--color-text-brand-strong, #97c4e9)` |
| `PageErrorActionButton` | disabled | `var(--color-background-component-light, #1e262c)` | `var(--color-border-disabled, #9e9e9e)` | `var(--color-text-disabled, #9e9e9e)` |

Text tokens resolve automatically in dark mode:
- `var(--color-text-neutral-strong)` → `#e6e9ec`
- `var(--color-text-neutral)` → `#b8c1c9`
- `var(--color-icon-disabled)` → `#9e9e9e`

## Interactions
- `PageErrorActionButton` click: triggers `onAction` callback.
- `PageErrorActionButton` keyboard:
  - `Tab` moves focus to the button.
  - `Enter` / `Space` activates the button and fires `onAction`.
  - Focus-visible ring uses `var(--button-focus-ring-radius, var(--corner-radius-radius-4, 4px))` and `var(--button-focus-ring-offset, 3px)`.
- Root text slots are non-interactive and should not receive focus.

### Accessibility
- `PageErrorRoot` should be a `main` or `section` landmark.
- `PageErrorErrorName` should be an `h1` (or `h2` depending on page heading hierarchy) and have `id` referenced by `aria-labelledby` on the root when the error is the primary page content.
- `PageErrorIconSlot` is decorative (`aria-hidden="true"`).
- `PageErrorActionButton` is a real `<button>` with `type="button"`.
- Focus order: icon → error name → error code → probable cause → resolution text → action button (only action button is focusable).

### Behavior & guidelines
- Use `Page Error` when the entire view fails to load or an unrecoverable error prevents the page from rendering.
- Keep `errorName` short and human-readable.
- `errorCode` is optional; include it when the application logs a traceable error code.
- `probableCause` should explain the issue in plain language and avoid blame.
- `resolutions` and `action` are optional; provide them only when there is a practical recovery step.
- The action button should be a low-emphasis secondary button (outlined style) because the error is the primary focus.

## Composition & API (runtime)
### Component classification
- **Type:** static pattern with one optional interactive child.
- **Layout:** vertical centered stack; icon + text content + optional resolution block.
- **Data shape:** string props for all text content; optional callback for the action.

### Runtime API

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `errorName` | `string` | `required` | Primary error heading (e.g., "Something went wrong"). |
| `errorCode` | `string` | `undefined` | Secondary error code or status (e.g., "Error 500"). |
| `probableCause` | `string` | `undefined` | Body text explaining the probable cause. |
| `resolutions` | `string` | `undefined` | Guidance on how to resolve the error. |
| `action` | `{ label: string; onAction: () => void }` | `undefined` | Optional action button label and callback. |
| `showResolution` | `boolean` | `true` when `resolutions` or `action` is provided | Controls visibility of the resolution section. |
| `iconName` | `string` | `"state-error"` | Optional override of the default error icon slug. |
| `className` | `string` | `undefined` | Additional CSS class for the root. |
| `children` | `ReactNode` | `undefined` | Optional content override used for visual QA only (slots map to Figma placeholder text). |

### Events

| Event | Payload | Trigger |
| --- | --- | --- |
| `onAction` | `() => void` | User clicks or keyboard-activates the action button. |

### Variants
- `showResolution`: `true` / `false`. The Figma frame name `.PageError-Elements-Resolution/True` indicates the component has been authored with the resolution section visible; the inverse variant should be available in the same component set.
- No other variant axes observed in the provided main node.

### Spec Accurate Design story defaults
- `errorName`: "Error Name"
- `errorCode`: "Error Code"
- `probableCause`: "Probable Cause"
- `resolutions`: "Resolutions/Suggestions"
- `action`: `{ label: "Action", onAction: () => {} }`
- `showResolution`: `true`
- `iconName`: "state-error"

## Codegen Contract (Framework-Agnostic Blueprint)
### Deterministic structure
```
PageErrorRoot
  PageErrorIconSlot
    Icon (shape="state-error", 80x80)
  PageErrorContent
    PageErrorErrorName
    PageErrorErrorCode
    PageErrorProbableCause
    PageErrorResolutionSection (if showResolution)
      PageErrorResolutionsSuggestions
      PageErrorActionButton (if action provided)
```

### Variant matrix
| Variant | Values | Default |
| --- | --- | --- |
| `showResolution` | `true`, `false` | `true` when `resolutions` or `action` is provided |

### Per-slot style contract
- `PageErrorRoot`:
  - `display: flex; flex-direction: column; align-items: center;`
  - `padding: var(--padding-padding-24, 24px);`
  - `gap: var(--spacing-space-32, 32px);`
  - `width: 100%;` (not the sample 726px)
  - `box-sizing: border-box;`
- `PageErrorIconSlot`:
  - `width: 80px; height: 80px;`
  - `display: flex; align-items: center; justify-content: center;`
- `PageErrorIconSlot > *`:
  - Use `Icon` component with `shapeName={iconName}` and `style={{ width: 80, height: 80 }}`.
  - Color: `var(--color-icon-disabled, #757575)`.
- `PageErrorContent`:
  - `display: flex; flex-direction: column; align-items: center;`
  - `gap: var(--spacing-space-16, 16px);`
  - `width: 100%;`
- `PageErrorErrorName`:
  - `font: var(--font-size-header-2, 36px) / var(--font-line-height-line-height-44, 44px) var(--typography-font-style-primary, 'Roboto');`
  - `font-weight: 400;`
  - `color: var(--color-text-neutral-strong, #252525);`
  - `text-align: center; word-break: break-word;`
- `PageErrorErrorCode`:
  - `font: var(--font-size-header-5, 24px) / var(--font-line-height-line-height-32, 32px) var(--typography-font-style-primary, 'Roboto');`
  - `font-weight: 400;`
  - `color: var(--color-text-neutral-strong, #252525);`
  - `text-align: center;`
- `PageErrorProbableCause`:
  - `font: var(--font-size-body-1, 16px) / var(--font-line-height-line-height-24, 24px) var(--typography-font-style-primary, 'Roboto');`
  - `color: var(--color-text-neutral, #4d4d4d);`
  - `text-align: center;`
- `PageErrorResolutionSection`:
  - `display: flex; flex-direction: column; align-items: center;`
  - `gap: var(--spacing-space-16, 16px);`
  - `max-width: 678px; width: 100%;`
- `PageErrorResolutionsSuggestions`:
  - Same typography as `PageErrorProbableCause`.
- `PageErrorActionButton`:
  - Reuse IDS `Button` component with `variant="secondary"`.
  - Min-height: `var(--scale-40, 40px)`.
  - Padding: `var(--padding-padding-10, 10px) var(--padding-padding-16, 16px);`
  - Border: `var(--border-width-border-default, 1px) solid var(--color-border-brand-base, #0672cb);`
  - Border-radius: `var(--button-control-radius, var(--corner-radius-radius-2, 2px));`
  - Text: `var(--font-size-body-2, 14px) var(--color-text-brand-strong, #055fa9);`

### Behavior contract
- Render the resolution section only when `showResolution` is `true`.
- `showResolution` defaults to `true` if either `resolutions` or `action` is provided, otherwise `false`.
- Render the action button only when `action` is provided.
- `onAction` fires on click or keyboard activation (`Enter` / `Space`).
- Figma sample dimensions are not production defaults; the component must fill its parent width and remain vertically centered.

### Accessibility contract
- `PageErrorRoot` is a `main`/`section` element.
- `PageErrorErrorName` is an `h1` or `h2` with `id` referenced by `aria-labelledby` on the root.
- `PageErrorIconSlot` is decorative (`aria-hidden="true"`).
- `PageErrorActionButton` is a native `<button>`, focusable, and keyboard-activable.
- Focus ring follows IDS `Button` focus specification.

### Asset resolution + bundling contract
- `PageErrorIconSlot` uses the shared `Icon` component with `shapeName="state-error"`.
- `assets/icons/state-error.svg` must exist in the consuming application.
- If `iconName` is overridden, the corresponding SVG must be bundled under `assets/icons/<iconName>.svg`.

### Fallback/error rules
- Missing `errorName`: throw a development validation error; the component cannot render without a heading.
- Missing `errorCode`, `probableCause`, `resolutions`, or `action`: omit the corresponding slot silently.
- Missing `iconName` or icon asset: render the `state-error` icon; if unavailable, render an empty `80x80` placeholder with the error glyph color.
- Unknown `showResolution` value: treat `true` as default.

### Validation checklist
- [ ] `PageErrorRoot` uses `width: 100%` and `height: fit-content`, not the Figma sample `726px`.
- [ ] Icon slot is `80x80` and uses `Icon` with `state-error` slug.
- [ ] `PageErrorErrorName` uses `var(--font-size-header-2, 36px)` and `var(--color-text-neutral-strong)`.
- [ ] `PageErrorErrorCode` uses `var(--font-size-header-5, 24px)` and `var(--color-text-neutral-strong)`.
- [ ] `PageErrorProbableCause` and `PageErrorResolutionsSuggestions` use `var(--font-size-body-1, 16px)` and `var(--color-text-neutral)`.
- [ ] `PageErrorActionButton` uses `var(--border-width-border-default, 1px)` `var(--color-border-brand-base)` border and `var(--button-control-radius)`.
- [ ] `showResolution` correctly toggles the resolution section.
- [ ] `action` is optional; when omitted, no button is rendered.
- [ ] `onAction` fires on click and `Enter`/`Space` keyboard activation.
- [ ] Light and dark themes resolve via `components/ids-theme.css` tokens.
- [ ] Slot geometry table cites the correct Figma node IDs and MCP methods.

## Source Mapping
- Component map source: `data/component-figma-map.json` (`Page Error`)
- Figma nodes used:
  - `26744:12102` (`PageError-Main`) — main component frame
  - `26744:12088` (`Icon`) — icon slot
  - `26744:12089` (`Stroke / state-error`) — error glyph
  - `26744:12091` (`Error Content`) — text content wrapper
  - `26744:12092` (`<Error Name>`) — error name text
  - `26744:12093` (`<Error Code>`) — error code text
  - `26744:12094` (`<Probable Cause>`) — probable cause text
  - `49163:97378` (`.PageError-Elements-Resolution/True`) — resolution section
  - `49163:97379` (`Resolution Content`) — resolution content wrapper
  - `49163:97380` (`<Resolutions/Suggestions>`) — resolution text
  - `49163:97381` (`Button`) — action button
- Live verification method: Figma MCP tools `get_metadata`, `get_design_context`, `get_variable_defs`.
- Last verified: 2026-07-12.
