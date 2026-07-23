# Button Design Spec

## Metadata

| Property | Value |
|---|---|
| Component | Button |
| Design System | Powerflex |
| Category | Form |
| Spec pattern | **standalone** |
| Status | **draft** |
| Version | 1.0.0 |
| Theme CSS | `components/powerflex-theme.css` |
| Figma file key | `HIbl2AgqTSdR9STZueMvTH` (DAP Design Library) |
| Main component set / matrix | `9662:25120` |
| Figma URL (Main) | https://www.figma.com/design/HIbl2AgqTSdR9STZueMvTH/DAP-Design-Library?node-id=9662-25120&m=dev |
| Storybook path | `storybook-generated/powerflex/src/components/Button.stories.tsx` |
| Deterministic generator | `generation/deterministic_storybook/ids/button.py` (registry fallback via `("ids", "button")`) |
| Map entry | `data/powerflex-component-figma-map.json` → `Button` |

### Live verification evidence

| Check | Node(s) | Method | Result |
|---|---|---|---|
| Main — variant × state × size matrix | `9662:25120` | Figma MCP | **Blocked** — MCP server error in cloud agent session |
| Main — matrix frame metadata | `9662:25120` | Figma REST API | **Blocked** — HTTP 403 (token lacks file access) |
| Cross-reference (same node) | `9662:25120` | DAP root spec + IDS button spec | Prior MCP verification on file `HIbl2AgqTSdR9STZueMvTH` / node `9662:25120` documented in repo |

**Last verified:** 2026-07-23 (intake session; live MCP/REST re-check pending file access)

**Verification method (intended):** Figma MCP (`get_screenshot`, `get_metadata`, `get_variable_defs`, `get_design_context`) on Main URL.

## Anatomy

**Element inventory (visible, node `9662:25120`):** 4 variant families × 5 interactive states × 3 text sizes + icon-only rows — each cell is a `Button` component instance (`ButtonRoot` + optional `ButtonLeadingIcon` + optional `ButtonLabel`). Inventory count for codegen slots: **3 named slots** (not per-matrix cell).

Deterministic slot order (codegen **must** preserve):

1. **`ButtonRoot`** — interactive control surface (native `button` in web targets).
2. **`ButtonLeadingIcon`** (optional) — `16×16` icon when `iconSlug` is set or `iconOnly=true`.
3. **`ButtonLabel`** (optional) — text label; omitted when `iconOnly=true`.

```
ButtonRoot
├── ButtonLeadingIcon?   (iconSlug | iconOnly)
└── ButtonLabel?         (hidden when iconOnly)
```

## Layout & Measurements

Matrix frame `9662:25120` is a **reference grid** for variant × state × size combinations. Runtime width is content-driven, not fixed to the matrix frame width.

### `ButtonRoot`

| Property | Value / token |
|---|---|
| Control radius | `var(--button-control-radius)` → `var(--corner-radius-radius-4)` (Powerflex theme) |
| Horizontal padding (text + icon+label) | `var(--spacing-space-16)` left/right |
| Icon–label gap | `var(--spacing-space-8)` |
| Min width | `56px` |
| Max width | `320px` |
| Border | inside stroke `var(--border-width-border-1)` — use inset shadow/outline, not additive CSS `border` under `box-sizing: border-box` |
| Width behavior | `width: fit-content`, `max-width: 100%`, `box-sizing: border-box` |

### Size signatures (Figma matrix axis)

| Size | Height | Vertical padding (text) | Vertical padding (icon-only) |
|---|---|---|---|
| `small` | `24px` | `2px` | — (icon-only not in matrix for small) |
| `medium` | `32px` | `6px` | `8px` |
| `large` | `40px` | `10px` | `12px` |

Icon-only mode is supported for **`medium`** and **`large`** only (matrix evidence).

### Focus ring (focus-visible)

| Property | Token |
|---|---|
| Outer ring stroke | `var(--border-width-border-1)` |
| Ring offset | `var(--button-focus-ring-offset)` (3px) |
| Ring corner radius | `var(--button-focus-ring-radius)` |

### Slot geometry (Figma-verified)

| Slot | Property | Value | Figma node | Verification |
|---|---|---|---|---|
| `ButtonRoot` | `border-radius` | `var(--button-control-radius)` | `9662:25120` | DAP root spec + prior MCP on matrix; alias resolves to `var(--corner-radius-radius-4)` |
| `ButtonRoot` | focus ring radius | `var(--button-focus-ring-radius)` | `9662:25120` | Same matrix; `--corner-radius-radius-4` |
| `ButtonRoot` | focus ring offset | `var(--button-focus-ring-offset)` | `9662:25120` | 3px offset (IDS-compatible geometry) |
| `ButtonLeadingIcon` | width × height | `16px × 16px` | `9662:25120` | Icon instances in matrix cells |
| `ButtonLabel` | typography | Body 2 | `9662:25120` | Label text layer in matrix |

## Tokens

### Typography

| Role | Font size | Line height | Weight | Color (default) |
|---|---|---|---|---|
| Label (Body 2) | `var(--font-size-body-2)` | `var(--font-line-height-line-height-20)` | 400 | variant/state dependent (see state tables) |

### Layout aliases (theme-resolvable)

Programme overrides live in `components/powerflex-theme.css` (donor: `components/ids-theme.css`).

| Alias | Powerflex resolved value |
|---|---|
| `--button-control-radius` | `var(--corner-radius-radius-4)` |
| `--button-focus-ring-radius` | `var(--corner-radius-radius-4)` |
| `--button-focus-ring-offset` | `3px` |

### Colors and surfaces

| Category | Semantic tokens |
|---|---|
| Primary fills | `var(--color-background-controls-brand-base)`, `var(--color-background-controls-brand-strong)`, `var(--color-background-controls-brand-stronger)` |
| Primary borders | `var(--color-border-transparent-brand)` |
| Secondary/tertiary fills | `var(--color-background-controls-brand-lighter)`, `var(--color-background-controls-brand-light)` |
| Secondary/tertiary borders | `var(--color-border-brand-base)` |
| Destructive fills | `var(--color-background-alerting-critical)`, `var(--color-background-alerting-critical-strong)`, `var(--color-background-alerting-critical-stronger)` |
| Destructive borders | `var(--color-border-alerting-transparent-critical)` |
| Disabled | `var(--color-background-gray-lighter)`, `var(--color-border-disabled)` |
| Text | `var(--color-text-white)`, `var(--color-text-brand-strong)`, `var(--color-text-disabled)` |
| Icons | `var(--color-icon-white)`, `var(--color-icon-brand-base)`, `var(--color-icon-disabled)` |

Shadows/elevation: none on button control surfaces in matrix evidence.

## States (Light Theme)

| Variant | State | Background | Border | Text/Icon |
|---|---|---|---|---|
| primary | default | `var(--color-background-controls-brand-base)` | `var(--color-border-transparent-brand)` | `var(--color-text-white)` / `var(--color-icon-white)` |
| primary | hover | `var(--color-background-controls-brand-strong)` | `var(--color-border-transparent-brand)` | `var(--color-text-white)` / `var(--color-icon-white)` |
| primary | press | `var(--color-background-controls-brand-stronger)` | `var(--color-border-transparent-brand)` | `var(--color-text-white)` / `var(--color-icon-white)` |
| primary | disabled | `var(--color-background-gray-lighter)` | `var(--color-border-disabled)` | `var(--color-text-disabled)` / `var(--color-icon-disabled)` |
| primary | focus-visible | same as current interactive base state | control border unchanged + outer brand focus outline | text/icon unchanged |
| secondary | default | transparent | `var(--color-border-brand-base)` | `var(--color-text-brand-strong)` / `var(--color-icon-brand-base)` |
| secondary | hover | `var(--color-background-controls-brand-lighter)` | `var(--color-border-brand-base)` | `var(--color-text-brand-strong)` / `var(--color-icon-brand-base)` |
| secondary | press | `var(--color-background-controls-brand-light)` | `var(--color-border-brand-base)` | `var(--color-text-brand-strong)` / `var(--color-icon-brand-base)` |
| secondary | disabled | transparent | `var(--color-border-disabled)` | `var(--color-text-disabled)` / `var(--color-icon-disabled)` |
| secondary | focus-visible | same as current interactive base state | control border `var(--color-border-brand-base)` + outer brand focus outline | text/icon unchanged |
| tertiary | default | transparent | transparent | `var(--color-text-brand-strong)` / `var(--color-icon-brand-base)` |
| tertiary | hover | `var(--color-background-controls-brand-lighter)` | `var(--color-border-brand-base)` | `var(--color-text-brand-strong)` / `var(--color-icon-brand-base)` |
| tertiary | press | `var(--color-background-controls-brand-light)` | `var(--color-border-brand-base)` | `var(--color-text-brand-strong)` / `var(--color-icon-brand-base)` |
| tertiary | disabled | transparent | transparent | `var(--color-text-disabled)` / `var(--color-icon-disabled)` |
| tertiary | focus-visible | same as current interactive base state | control border by state + outer brand focus outline | text/icon unchanged |
| destructive | default | `var(--color-background-alerting-critical)` | `var(--color-border-alerting-transparent-critical)` | `var(--color-text-white)` / `var(--color-icon-white)` |
| destructive | hover | `var(--color-background-alerting-critical-strong)` | `var(--color-border-alerting-transparent-critical)` | `var(--color-text-white)` / `var(--color-icon-white)` |
| destructive | press | `var(--color-background-alerting-critical-stronger)` | `var(--color-border-alerting-transparent-critical)` | `var(--color-text-white)` / `var(--color-icon-white)` |
| destructive | disabled | `var(--color-background-gray-lighter)` | `var(--color-border-disabled)` | `var(--color-text-disabled)` / `var(--color-icon-disabled)` |
| destructive | focus-visible | same as current interactive base state | control border unchanged + outer brand focus outline | text/icon unchanged |

## States (Dark Theme)

Dark theme uses the same semantic tokens as **States (Light Theme)**. Resolved values for `[data-theme="dark"]` / programme dark scope live in `components/ids-theme.css` (imported by `components/powerflex-theme.css`) and `[data-design-system="powerflex"]` overrides.

Duplicate the full state matrix in this section only when a dark row genuinely uses different `var(--...)` references than the corresponding light row.

## Interactions

| Trigger | Behavior |
|---|---|
| Pointer click | Activate when not `disabled` / `loading`; emit `onClick`. |
| `Enter` / `Space` | Activate when focused and not disabled. |
| Hover | Apply hover row tokens for interactive buttons. |
| Press (pointer/keyboard held) | Apply press row tokens; clear on release. |
| Focus (keyboard) | `focus-visible` outer ring per focus contract. |
| Disabled | Block all interaction and event emission. |

Runtime default must remain interactive. `dataState` / `data-state` / story `simState` are **Storybook and QA overrides only**.

### Accessibility

| Requirement | Contract |
|---|---|
| Role | Native `button` (or equivalent with `role="button"`) |
| Name | Visible `ButtonLabel` or required `ariaLabel` when `iconOnly=true` |
| Disabled | `disabled` attribute + `aria-disabled` for non-native fallbacks |
| Keyboard | `Enter` and `Space` activate; visible `focus-visible` ring |
| Icon | Decorative when paired with label; icon-only requires `ariaLabel` |

### Behavior & guidelines

- Do not add chrome not present in matrix `9662:25120`.
- Destructive variant uses white icon/text tokens, not brand icon on filled critical surface.
- Loading state blocks interaction (product extension; not a separate matrix column).

## Composition & API (runtime)

Suggested runtime export: **`PowerflexButton`** (Storybook reuses `IdsButton` implementation with Powerflex theme import).

### Variants

| Axis | Values | Figma evidence |
|---|---|---|
| `variant` | `primary`, `secondary`, `tertiary`, `destructive` | Matrix rows `9662:25120` |
| `size` | `small`, `medium`, `large` | Matrix columns |
| Icon modes | label only / icon+label / icon-only | Matrix icon rows (`medium`, `large` icon-only) |
| `disabled` | `true`, `false` | Disabled column in matrix |
| Interactive states | `default`, `hover`, `press`, `focus-visible`, `disabled` | Matrix state columns |

### Runtime API

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | `string` | — | Button text; required unless `iconOnly=true` |
| `variant` | `"primary" \| "secondary" \| "tertiary" \| "destructive"` | `"primary"` | Visual style family |
| `size` | `"small" \| "medium" \| "large"` | `"large"` | Control size signature |
| `iconSlug` | `string` | — | Icon slug → `assets/icons/<slug>.svg` |
| `iconOnly` | `boolean` | `false` | Icon-only mode (`medium`/`large` only) |
| `disabled` | `boolean` | `false` | Disabled state |
| `loading` | `boolean` | `false` | Blocks interaction when true |
| `type` | `"button" \| "submit" \| "reset"` | `"button"` | Native button type |
| `ariaLabel` | `string` | — | Required when `iconOnly=true` |
| `dataState` | `"default" \| "hover" \| "press" \| "focus-visible" \| "disabled"` | — | Demo/QA override only |

### Outputs (events)

| Event | Payload | When |
|---|---|---|
| `onClick` | `MouseEvent` / equivalent | Successful activation |
| `onFocus` | `FocusEvent` | Focus enters control |
| `onBlur` | `FocusEvent` | Focus leaves control |
| `onKeyDown` | `KeyboardEvent` | Key pressed while focused |
| `onKeyUp` | `KeyboardEvent` | Key released while focused |

### Spec Accurate Design story defaults

| Arg | Value |
|---|---|
| `variant` | `"primary"` |
| `size` | `"large"` |
| `children` / `label` | `"Button"` |
| `disabled` | `false` |
| `loading` | `false` |
| `iconOnly` | `false` |
| Theme import | `components/powerflex-theme.css` |

## Codegen Contract (Framework-Agnostic Blueprint)

### Deterministic structure

```
ButtonRoot
├── ButtonLeadingIcon?   (when iconSlug set or iconOnly)
└── ButtonLabel?         (omit when iconOnly)
```

### Variant matrix

| Axis | Valid values |
|---|---|
| `variant` | `primary`, `secondary`, `tertiary`, `destructive` |
| `size` | `small`, `medium`, `large` |
| `iconOnly` | `false` (default), `true` (medium/large only) |
| `disabled` | `false`, `true` |
| `loading` | `false`, `true` |

All variant × size × (`default`|`hover`|`press`|`focus-visible`|`disabled`) combinations must resolve tokenized styles per **States (Light Theme)**.

### Per-slot style contract

| Slot | Contract |
|---|---|
| `ButtonRoot` | Height/padding from size table; radius/border/background from variant+state tokens; Body 2 typography on label path |
| `ButtonLeadingIcon` | `16×16`; mask rendering; colors per variant/state table |
| `ButtonLabel` | `var(--font-size-body-2)` / `var(--font-line-height-line-height-20)` / weight 400 |

| CSS property (`ButtonRoot`) | Token |
|---|---|
| `border-radius` | `var(--button-control-radius)` |
| focus ring radius | `var(--button-focus-ring-radius)` |
| focus ring offset | `var(--button-focus-ring-offset)` |

### Behavior contract

- `disabled || loading` blocks activation and output events.
- `iconOnly=true` requires `ariaLabel` and `iconSlug`.
- `iconOnly=true` with `size=small` → validation error.
- `press` is transient; cleared on pointer/key release.
- Unknown `variant` → `primary`; unknown `size` → `large`.

### Accessibility contract

- Native button semantics with keyboard parity (`Enter`, `Space`).
- Visible `focus-visible` treatment required.
- Icon-only accessible name via `ariaLabel`.

### Asset resolution + bundling contract

| Asset | Resolution |
|---|---|
| Leading icon | `assets/icons/<iconSlug>.svg` via shared Icon primitive (`variant="mask"`) |
| Demo / story slug | `settings-gear-detailed` |
| Unknown slug | Hide icon slot; continue rendering label if present |

### Fallback/error rules

- Unknown `variant` → `primary`.
- Unknown `size` → `large`.
- `iconOnly=true` without `ariaLabel` → validation error.
- `iconOnly=true` without `iconSlug` → validation error.
- `iconOnly=true` with `size=small` → validation error.

### Validation checklist

- [ ] Spec pattern: standalone; no IDS baseline section present
- [ ] **Slot geometry (Figma-verified)** table cites node `9662:25120` for radius rows
- [ ] Live Figma MCP/REST re-verification on Main URL (pending file access)
- [ ] Anatomy inventory (3 slots) matches deterministic structure
- [ ] All matrix variant × state combinations documented with `var(--...)` tokens
- [ ] Theme import in Storybook is exactly `components/powerflex-theme.css`
- [ ] Spec Generated / **Spec Accurate Design** story passes `strict_spec_storybook_gate.py --deterministic-story`
- [ ] Demo-only props (`dataState`, `simState`) labeled; production path does not require them

## Source Mapping

| Item | Value |
|---|---|
| Design source file | `HIbl2AgqTSdR9STZueMvTH` (DAP Design Library) |
| Main bucket node | `9662:25120` (variant × state × size matrix) |
| Component map | `data/powerflex-component-figma-map.json` → `Button` |
| Registry | `data/programme-inheritance-registry.json` → `powerflex` / `button` / `standalone` |
| Theme | `components/powerflex-theme.css` (donor `@import "./ids-theme.css"`) |
| Root spec | `components/powerflex/root-spec.md` |
| Verification (intended) | Figma MCP per URL bucket |
| Verification (session) | MCP unavailable; REST 403; cross-ref DAP root spec + IDS button spec for same node |
| Reproducible extraction | `get_metadata`, `get_design_context`, `get_variable_defs`, `get_screenshot` on `9662:25120` |
