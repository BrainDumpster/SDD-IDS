# Progress Bar Design Spec

## Metadata
- Component: Progress Bar
- Design system: IDS
- Category: Loading and Progress
- Spec path: `components/ids/progress-bar/design-spec.md`
- Version: 1.1.0
- Description: Determinate and indeterminate progress with optional label, inline percentage, helper row, and status-colored fills.
- Status: active
- Created: 2026-05-22
- Updated: 2026-06-05
- Primary Figma URL: https://www.figma.com/design/VZJ48bbVYrIynw8DdSukWw/-Exploration-only--IDS-with-variables?node-id=11067-54665&m=dev
- Primary node id: `11067:54665`
- Spec-accurate reference node: `11099:57210` (Determinate/regular, Thin, In Progress + helper)
- Inline reference node: `11099:57186` (Determinate/Inline, Medium, In Progress, 30%)
- Figma file key: `VZJ48bbVYrIynw8DdSukWw`
- Verification method: Figma MCP (`get_metadata`, `get_design_context`, `get_variable_defs`)
- Verified at: 2026-05-22
- Storybook examples requested: yes
- Storybook path: `storybook-generated/ids/src/components/ProgressBar.stories.tsx`
- Storybook title: `Spec Generated/IDS/Progress Bar`

## Anatomy
Deterministic slot order:
1. `ProgressRoot` (wraps track + optional meta + helper)
2. `ProgressMetaRow?` (label + percentage; `with-label` only)
3. `ProgressTrackRow` (track alone, or track + inline percentage)
   - `ProgressTrack` (accessible border + neutral track background)
   - `ProgressIndicator` (fill; width driven by value or indeterminate animation)
4. `ProgressHelperRow?` (status icon + helper text)

## Layout & Measurements
- Container width: `100%` of available space (`box-sizing: border-box` on root).
- Track heights (`ProgressTrack`, `trackBg`, and `ProgressIndicator` share height; `box-sizing: border-box` so the 1px border renders inside the container and thickness tokens are not inflated):
  - `thin`: `var(--sizing-size-4)` (4px) — Figma `Type=Determinate/Inline, Thickness=Thin`
  - `medium`: `var(--sizing-size-8)` (8px)
  - `thick`: `var(--sizing-size-16)` (16px)
- Border radius: **0px** on track and fill (sharp corners; Figma `.base progress bar`).
- Track border: `var(--border-width-border-1)` solid `var(--color-border-accessible)`.
- Track shell (`ProgressTrack`): sizing only, no border. **`trackBg`** (`z-index: 0`) has accessible border + neutral background, clipped with `clip-path: inset(0 0 0 var(--progress-clip))` so it only paints the **unfilled** width (set from `value` on root). Track background uses `var(--color-background-gray-light)` (#393939 in dark theme).
- **Filled segment** (`ProgressIndicator`, `z-index: 1`): full track height, width from value %, state-colored `border` on all sides (top/left/bottom/right). No gray track stroke on the completed segment because `trackBg` is not drawn under the fill.
- `with-label` (`Determinate/regular` in Figma):
  - Meta row: label left, percentage right, `var(--font-size-body-2)` / `var(--font-line-height-line-height-20)`.
  - Gap between meta row and track: `var(--padding-padding-8)` (8px).
  - Gap between track block and helper: `var(--spacing-space-4)` (4px) on root column.
- `inline` (`Determinate/Inline` in Figma):
  - Horizontal row: flex track (`flex: 1`) + percentage column.
  - Gap between track and percentage: `var(--padding-padding-8)` (8px).
  - Percentage column width: **36px**, text align left, Body 2.
- `indeterminate`: animated fill segment (~60% width, horizontal sweep); percentage omitted when indeterminate.
- Helper row: icon `16px`, gap `var(--padding-padding-8)` between icon and text.
- Status icons: no icon for `in-progress` helper row.

### Figma type mapping
| Figma variant property | Runtime `type` |
|---|---|
| `Determinate/regular` | `with-label` |
| `Determinate/Inline` | `inline` |
| `Indeterminate` | `indeterminate` |

### Figma state mapping
| Figma state | Runtime `state` |
|---|---|
| `In Progress` | `in-progress` |
| `Completed/Success` | `completed-success` |
| `Completed with Exceptions/Warning` | `completed-warning` |
| `Failed/Error` | `failed-error` |

## Tokens
### Typography
- Label / percentage / helper: Body 2 — `var(--font-size-body-2)`, `var(--font-line-height-line-height-20)`, regular.

### Colors and surfaces
- Track background: `var(--color-background-gray-neutral-alt)`
- Track border (remainder): `var(--color-border-accessible)`
- In-progress fill: `var(--color-background-brand-base)`; fill border: `var(--color-border-brand-base)`; fill-border overlay token: `var(--color-background-controls-brand-base)` (matches fill edge in Figma)
- Success fill: `var(--color-background-alerting-success)`; fill border: `var(--color-border-alerting-success-base)`
- Warning fill: `var(--color-background-alerting-minor)`; fill border: `var(--color-border-alerting-minor-transparent)`
- Error fill: `var(--color-background-alerting-critical)`; fill border: `var(--color-border-alerting-critical-base)`
- Label / inline percentage: `var(--color-text-neutral-strong)`
- Helper text: `var(--color-text-neutral)`

### Sizing and spacing
- `var(--sizing-size-4)`, `var(--sizing-size-8)`, `var(--sizing-size-16)`
- `var(--padding-padding-8)`, `var(--spacing-space-4)`
- `var(--border-width-border-1)`

### Status icon slugs (helper row)
| `state` | Slug | Icon tint |
|---|---|---|
| `completed-success` | `status-ok-circ-solid` | `var(--color-icon-alerting-success)` |
| `completed-warning` | `status-warn-tri-solid` | `var(--color-icon-alerting-minor)` |
| `failed-error` | `status-critical-square-solid` | `var(--color-icon-alerting-critical)` |

## States (Light Theme)
| `state` | Track background | Fill background | Border (track remainder + fill edges) | Text |
|---|---|---|---|---|
| `in-progress` | `var(--color-background-gray-neutral-alt)` | `var(--color-background-brand-base)` | Track: `var(--color-border-accessible)`; fill edges: same token as fill / `var(--color-border-brand-base)` on fill box | Meta/inline %: `var(--color-text-neutral-strong)`; helper: `var(--color-text-neutral)` |
| `completed-success` | `var(--color-background-gray-neutral-alt)` | `var(--color-background-alerting-success)` | Track: accessible; fill edges match success fill / `var(--color-border-alerting-success-base)` | `var(--color-text-neutral-strong)` / helper `var(--color-text-neutral)` |
| `completed-warning` | `var(--color-background-gray-neutral-alt)` | `var(--color-background-alerting-minor)` | Track: accessible; fill edges: `var(--color-border-alerting-minor-transparent)` | `var(--color-text-neutral-strong)` / helper `var(--color-text-neutral)` |
| `failed-error` | `var(--color-background-gray-neutral-alt)` | `var(--color-background-alerting-critical)` | Track: accessible; fill edges: `var(--color-border-alerting-critical-base)` | `var(--color-text-neutral-strong)` / helper `var(--color-text-neutral)` |
| `indeterminate` + `in-progress` | `var(--color-background-gray-neutral-alt)` | `var(--color-background-brand-base)` | same as in-progress | same as in-progress |

## States (Dark Theme)
Dark theme uses the same semantic tokens as **States (Light Theme)**. Resolved values for `[data-theme="dark"]` / `.ids-theme-dark` (and program overlays) live in theme CSS:

- `components/ids-theme.css`
- `components/<program>-theme.css` when a program overlays IDS (for example `components/dap-theme.css`)

Duplicate the full state matrix in this section only when a dark row genuinely uses different `var(--...)` references than the corresponding light row.

*(When Light and Dark tables would list identical `var(--...)` cells, keep the matrix under **States (Light Theme)** only and use this pointer section instead of a second table.)*

## Interactions
- Display-only by default; no hover/press visual states on the bar.
- Value updates re-render fill width (determinate) or continue indeterminate animation.
- `data-value-full="true"` on root when determinate value is `100` so fill right edge receives matching border treatment.

### Accessibility
- Determinate: `role="progressbar"` with `aria-valuemin={0}`, `aria-valuemax={100}`, `aria-valuenow` from value (provided by Base UI `Progress` primitive in reference implementation).
- Indeterminate: `value={null}`; no `aria-valuenow`.
- `aria-label` from `label` prop or sensible default (`"Progress"`).
- Helper text is plain paragraph content; status icons are `aria-hidden`.

### Behavior & guidelines
- Use `with-label` when label and percentage sit above the track.
- Use `inline` when percentage sits to the right of the track (36px column).
- Use `indeterminate` when duration is unknown.
- Use `state` for completion semantics (success, warning, error).
- Show helper row only when `showHelperText` and `helperText` are set.
- Do not show a status icon for `in-progress`.

## Composition & API (runtime)
- Suggested runtime component: `IdsProgressBar` (`storybook/src/components/ProgressBar.tsx`).

### Variants
- `type`: `inline` | `with-label` | `indeterminate` (default `inline`)
- `thickness`: `thin` | `medium` | `thick` (default `medium`)
- `state`: `in-progress` | `completed-success` | `completed-warning` | `failed-error` (default `in-progress`)

### Runtime API
| Prop | Type | Default | Notes |
|---|---|---|---|
| `value` | `number?` | `0` | Clamped 0–100; ignored when `type="indeterminate"` |
| `label` | `string?` | — | Meta row label (`with-label`); also used for `aria-label` fallback |
| `helperText` | `string?` | — | Helper row copy |
| `showHelperText` | `boolean` | `false` | Renders helper row when `helperText` set |
| `type` | see Variants | `inline` | |
| `thickness` | see Variants | `medium` | |
| `state` | see Variants | `in-progress` | |

### Spec Accurate Design story defaults
Canonical Storybook args (Figma `11099:57210`):
- `value`: `30`
- `label`: `"Label"`
- `type`: `"with-label"`
- `thickness`: `"thin"`
- `state`: `"in-progress"`
- `showHelperText`: `true`
- `helperText`: `"Helper text (time estimate)"`
- Frame width in story: `300px` max (matches Figma sample width)

Secondary proof for `inline` (Figma `11099:57186`):
- `value`: `30`, `type`: `"inline"`, `thickness`: `"medium"`, `state`: `"in-progress"` (no helper)

## Codegen Contract (Framework-Agnostic Blueprint)
### Deterministic structure
Emit slots in **Anatomy** order: `ProgressRoot` → optional `ProgressMetaRow` → `ProgressTrackRow` (track + optional inline value) → optional `ProgressHelperRow`.

### Variant matrix
Valid combinations:
- `type` × `thickness` × `state` as documented in **Composition & API (runtime) → Variants**
- `showHelperText` independent; icon slot only when `state` is success, warning, or error

### Per-slot style contract
- `ProgressTrack`: height from thickness tokens; background `var(--color-background-gray-neutral-alt)`; border `var(--border-width-border-1)` `var(--color-border-accessible)`; `border-radius: 0`.
- `ProgressIndicator`: fill background and border tokens per **States (Light Theme)** row for `state`; width from value % or indeterminate animation.
- `ProgressMetaRow` / inline value: Body 2 + `var(--color-text-neutral-strong)`.
- `ProgressHelperRow` text: `var(--color-text-neutral)`; icon 16px per slug table.

### Behavior contract
- Clamp `value` to `[0, 100]` for determinate types.
- `indeterminate`: ignore `value`; animate indicator width/position.
- `data-value-full="true"` when determinate `value >= 100`.
- Helper icon omitted for `in-progress`.

### Accessibility contract
See **Interactions → Accessibility**.

### Asset resolution + bundling contract
- Helper icons resolve from `assets/icons/<slug>.svg`.
- Prefer shared `Icon` primitive with `variant="img"` for full-color status glyphs (`status-ok-circ-solid`, `status-warn-tri-solid`, `status-critical-square-solid`).
- Unknown slug: omit icon slot; still render helper text.

### Fallback/error rules
- Unknown `type` → `inline`
- Unknown `thickness` → `medium`
- Unknown `state` → `in-progress`
- `showHelperText` without `helperText` → do not render helper row

### Validation checklist
- [x] `with-label` meta row + track + optional helper matches Figma `Determinate/regular`
- [x] `inline` track + 36px percentage column with 8px gap
- [x] Thickness 4 / 8 / 16px via sizing tokens
- [x] Sharp corners (0px radius) on track and fill
- [x] State fills and borders use semantic alerting/brand tokens only
- [x] Helper icons use documented slugs via Icon primitive
- [x] Indeterminate omits percentage and animates fill
- [x] Light/dark use same semantic token names (theme CSS resolves values)
- [x] Spec Generated story `Spec Accurate Design` uses story defaults above

## Source Mapping
| Source | Location |
|---|---|
| Component map | `data/component-figma-map.json` → `Progress Bar` (`11067-54665`) |
| Theme CSS | `components/ids-theme.css` |
| Storybook implementation | `storybook/src/components/ProgressBar.tsx`, `ProgressBar.module.css`, `IdsProgressBar.tsx` |
| Spec Generated stories | `storybook-generated/ids/src/components/ProgressBar.stories.tsx` |
| Icon primitive | `storybook/src/components/Icon.tsx` |
| Figma MCP (2026-05-22) | `get_metadata(fileKey=VZJ48bbVYrIynw8DdSukWw, nodeId=11067:54665)` |
| Figma MCP (2026-05-22) | `get_design_context(..., nodeId=11099:57210)` — with-label thin in-progress |
| Figma MCP (2026-05-22) | `get_design_context(..., nodeId=11099:57186)` — inline medium in-progress |
| Figma MCP (2026-05-22) | `get_variable_defs(..., nodeId=11067:54665)` |

## Implementation Notes

**Track and fill geometry**
- **Track border placement**: Set `box-sizing: border-box` on the track shell (`ProgressTrack`), unfilled segment (`trackBg`), and fill (`ProgressIndicator`) so the `var(--border-width-border-1)` border renders inside the container. This preserves thickness dimensions (`thin` 4px, `medium` 8px, `thick` 16px) without adding extra width/height from the border.
- **Progress fill bar border thickness**: The indicator border is `var(--border-width-border-1)` on all painted edges (right edge added when `data-value-full="true"`).
- **Corner radius**: Both the track (container) and indicator (progress fill bar) use `border-radius: 0` for sharp corners per Figma.

**Helper status icons**
- **Icon implementation**: Status icons render via the shared `Icon` component with `variant="img"` (full-color SVG assets, not mask tinting):
  - `completed-success` → `status-ok-circ-solid.svg`
  - `completed-warning` → `status-warn-tri-solid.svg`
  - `failed-error` → `status-critical-square-solid.svg`
- Icons are **16px** and styled with the `helperIcon` class in the reference implementation (`ProgressBar.module.css`).
