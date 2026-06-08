# Button Design Spec

## IDS baseline (layout, flow, contracts)

Synapse **Button** shares the IDS **Button** component family (`ButtonRoot`, optional leading icon, optional label). Variant axes (`primary` / `secondary` / `tertiary` / `destructive`), size signatures, icon-only rules, interaction contracts, and runtime API match the IDS spec unless noted in **Synapse programme deltas** below.

- **IDS source of truth:** [`components/ids/button/design-spec.md`](../ids/button/design-spec.md)
- **Shared implementation:** `storybook/src/components/Button.tsx`, `Button.module.css` (`programme="synapse"` applies Synapse chrome)
- **Base UI mapping:** `data/synapse-baseui-mapping.json` → `button` (`@base-ui-components/react/button`)

**Scope of live Synapse verification (this spec):** documentation board `47809:1805` + component set `47808:31665` (full `Style` × `State` × `Size` × `Icon` × `Icon Only` matrix).

## Metadata
- Component: Button
- Design System: Synapse
- Category: Components / Form Elements
- Spec pattern: **ids-fork** (registry: `data/programme-inheritance-registry.json` → `programme: synapse`, `slug: button`)
- IDS baseline slug: `button`
- Status: **draft**
- Version: 1.0.0
- Figma file: [Synapse Hi-Fi components](https://www.figma.com/design/Td1bnsvRj1PCGs9RVJkIvJ/Synapse-Hi-Fi-components)
- File key: `Td1bnsvRj1PCGs9RVJkIvJ`
- Documentation board: [47809:1805](https://www.figma.com/design/Td1bnsvRj1PCGs9RVJkIvJ/Synapse-Hi-Fi-components?node-id=47809-1805&m=dev) — usage sections *Button*, *Button and Icon*, *Icon Only*
- Main component set: `Button` — [47808:31665](https://www.figma.com/design/Td1bnsvRj1PCGs9RVJkIvJ/Synapse-Hi-Fi-components?node-id=47808-31665&m=dev)
- Reference variant (Spec Accurate): [47808:32122](https://www.figma.com/design/Td1bnsvRj1PCGs9RVJkIvJ/Synapse-Hi-Fi-components?node-id=47808-32122&m=dev) — `Style=Primary, State=Default, Size=Large`
- Verification method: Figma MCP (`get_metadata`, `get_design_context`, `get_variable_defs`)
- Last verified: 2026-06-05 (wizard intake — `47809:1805`, `47808:31665`, sample variants `47808:32122`, `47808:32111`, `47808:32100`, `47808:32113`)
- Theme CSS: `components/synapse-theme.css` (not `ids-theme.css`)

### Synapse programme deltas (vs IDS)

| Topic | IDS | Synapse |
|---|---|---|
| Control corner radius | `var(--corner-radius-radius-2)` (**2px**) | **`var(--corner-radius-radius-4)`** (**4px**) — all verified variants |
| Focus ring corner radius | **4px** outer ring | **`var(--corner-radius-radius-6)`** (**6px**) — Figma focus layer `47808:32113` |
| Focus ring offset | **3px** outside control | **3px** (`inset: -3px` focus border in Figma) — same offset |
| Size / padding signatures | small `2px` / medium `6px` / large `10px` block; inline `16px` | **Same token pattern** (`padding-2`, `padding-6`, `padding-10`, `padding-16`) on verified nodes |
| Icon–label gap | `8px` | **`var(--spacing-space-8)`** (same) |
| Variant / state token bindings | primary, secondary, tertiary, destructive matrices | **Same semantic `var(--...)` names** as IDS (verified on `47808:31665` `get_variable_defs`) |
| Component-set axes | variant × size × state × icon modes | Adds Figma axis **`Low Res`** (inherit IDS behavior until Synapse low-res nodes verified) |
| Documentation layout | IDS library board `41894:116183` | Synapse usage board **`47809:1805`** (text-only / icon+text / icon-only groupings) |

## Anatomy

Deterministic slot order (IDS-aligned):

1. `ButtonRoot` — interactive surface
2. optional `ButtonLeadingIcon` — `16×16` glyph
3. optional `ButtonLabel` — `Body 2` text

Icon-only mode: `ButtonRoot` + `ButtonLeadingIcon` only (`Icon Only=Yes` in Figma set).

## Layout & Measurements

### Verified size signatures (`47808:31665`)

| Size | Height (sample) | Block padding | Inline padding | Notes |
|---|---|---|---|---|
| `large` | `40px` | `var(--padding-padding-10)` | `var(--padding-padding-16)` | e.g. `47808:32122` |
| `medium` | `32px` | `var(--padding-padding-6)` | `var(--padding-padding-16)` | e.g. `47808:32088` |
| `small` | `24px` | `var(--padding-padding-2)` | `var(--padding-padding-16)` | e.g. `47808:32054` |

### Icon-only (`Icon Only=Yes`)

| Size | Intrinsic (sample) | Block padding |
|---|---|---|
| `medium` | `48×32` | `var(--padding-padding-8)` (inherit IDS) |
| `large` | `48×40` | `var(--padding-padding-12)` (inherit IDS) |

- Icon glyph: **`16×16`**
- Icon–label gap: **`var(--spacing-space-8)`**
- Width: content-driven; product guidance **min `56px`**, **max `320px`** (inherit IDS)
- **Corner radius:** **`var(--corner-radius-radius-4)`** on control (Synapse delta)
- **Focus ring:** `1px` `var(--color-border-brand-base)`, **3px** offset, ring radius **`var(--corner-radius-radius-6)`**

### Documentation board (`47809:1805`)

Grouped usage examples (not alternate anatomy):

- **Button** — text-only across Primary / Secondary / Tertiary / Destructive × sizes
- **Button and Icon** — leading icon + label
- **Icon Only** — medium/large icon-only tiles

## Tokens

### Chrome (Synapse-specific)
- Control radius: `var(--corner-radius-radius-4)`
- Focus ring radius: `var(--corner-radius-radius-6)`
- Focus ring stroke: `var(--border-width-border-default)` + `var(--color-border-brand-base)`

### Variant tokens (inherit IDS — same semantic names)

See IDS [`button`](../ids/button/design-spec.md) **Tokens** and **States (Light Theme)**. Verified on Synapse nodes:

- Primary: `var(--color-background-controls-brand-base)` … `brand-stronger`, `var(--color-border-transparent-brand)`, `var(--color-text-white)`
- Secondary / tertiary: `var(--color-border-brand-base)`, `var(--color-text-brand-strong)`, `var(--color-background-controls-brand-lighter/light)`
- Destructive: `var(--color-background-alerting-critical)` … `critical-stronger`, `var(--color-border-alerting-transparent-critical)`
- Disabled: `var(--color-background-gray-lighter)`, `var(--color-border-disabled)`, `var(--color-text-disabled)`, `var(--color-icon-disabled)`

Typography: `Body 2` — `var(--font-size-body-2)` / `var(--font-line-height-line-height-20)`.

## States (Light Theme)

State × variant token bindings match IDS [`button`](../ids/button/design-spec.md) **States (Light Theme)** table. Synapse programme chrome applies **`radius-4`** control and **`radius-6`** focus ring on every row.

| Variant | State | Background | Border | Text/Icon |
|---|---|---|---|---|
| primary | default | `var(--color-background-controls-brand-base)` | `var(--color-border-transparent-brand)` | `var(--color-text-white)` / `var(--color-icon-white)` |
| primary | hover | `var(--color-background-controls-brand-strong)` | `var(--color-border-transparent-brand)` | `var(--color-text-white)` / `var(--color-icon-white)` |
| primary | press | `var(--color-background-controls-brand-stronger)` | `var(--color-border-transparent-brand)` | `var(--color-text-white)` / `var(--color-icon-white)` |
| primary | disabled | `var(--color-background-gray-lighter)` | `var(--color-border-disabled)` | `var(--color-text-disabled)` / `var(--color-icon-disabled)` |
| primary | focus-visible | same as interactive base | unchanged + **6px-radius** outer brand ring | unchanged |
| secondary | default | transparent | `var(--color-border-brand-base)` | `var(--color-text-brand-strong)` / `var(--color-icon-brand-base)` |
| secondary | hover | `var(--color-background-controls-brand-lighter)` | `var(--color-border-brand-base)` | `var(--color-text-brand-strong)` / `var(--color-icon-brand-base)` |
| secondary | press | `var(--color-background-controls-brand-light)` | `var(--color-border-brand-base)` | `var(--color-text-brand-strong)` / `var(--color-icon-brand-base)` |
| secondary | disabled | transparent | `var(--color-border-disabled)` | `var(--color-text-disabled)` / `var(--color-icon-disabled)` |
| secondary | focus-visible | same as interactive base | `var(--color-border-brand-base)` + outer ring | unchanged |
| tertiary | default | transparent | transparent | `var(--color-text-brand-strong)` / `var(--color-icon-brand-base)` |
| tertiary | hover | `var(--color-background-controls-brand-lighter)` | `var(--color-border-brand-base)` | `var(--color-text-brand-strong)` / `var(--color-icon-brand-base)` |
| tertiary | press | `var(--color-background-controls-brand-light)` | `var(--color-border-brand-base)` | `var(--color-text-brand-strong)` / `var(--color-icon-brand-base)` |
| tertiary | disabled | transparent | transparent | `var(--color-text-disabled)` / `var(--color-icon-disabled)` |
| tertiary | focus-visible | same as interactive base | by state + outer ring | unchanged |
| destructive | default | `var(--color-background-alerting-critical)` | `var(--color-border-alerting-transparent-critical)` | `var(--color-text-white)` / `var(--color-icon-white)` |
| destructive | hover | `var(--color-background-alerting-critical-strong)` | `var(--color-border-alerting-transparent-critical)` | `var(--color-text-white)` / `var(--color-icon-white)` |
| destructive | press | `var(--color-background-alerting-critical-stronger)` | `var(--color-border-alerting-transparent-critical)` | `var(--color-text-white)` / `var(--color-icon-white)` |
| destructive | disabled | `var(--color-background-gray-lighter)` | `var(--color-border-disabled)` | `var(--color-text-disabled)` / `var(--color-icon-disabled)` |
| destructive | focus-visible | same as interactive base | unchanged + outer ring | unchanged |

Evidence nodes: `47808:32122` (primary default large), `47808:32111` (secondary), `47808:32100` (tertiary), `47808:32113` (focus), full matrix `47808:31665`.

## States (Dark Theme)

Dark theme uses the same semantic tokens as **States (Light Theme)**. Resolved values for `[data-theme="dark"]` / Synapse dark scope live in theme CSS:

- `components/synapse-theme.css`

Duplicate the full state matrix in this section only when a dark row genuinely uses different `var(--...)` references than the corresponding light row.

## Interactions

(Inherit IDS [`button`](../ids/button/design-spec.md) unless noted.)

- **Trigger:** pointer click, `Enter`, `Space`
- **Hover / press / focus-visible:** runtime interaction (demo `data-state` overrides allowed for Storybook matrices only)
- **Disabled / loading:** block activation and events
- **Icon-only:** requires `aria-label`

### Accessibility
- Native `button` semantics
- `aria-disabled` when non-native fallback
- Visible `focus-visible` with Synapse **6px** ring radius
- Keyboard parity: `Enter` + `Space`

### Behavior & guidelines
- Apply `components/synapse-theme.css` at app root
- Do not mix IDS and Synapse button chrome in one bundle — use `programme="synapse"` flag

## Composition & API (runtime)

Inherit IDS Button API from [`components/ids/button/design-spec.md`](../ids/button/design-spec.md) **Composition & API** with Synapse defaults:

| Prop | Synapse default / note |
|---|---|
| `variant` | `"primary"` |
| `size` | `"large"` (`lg`) for **Spec Accurate Design** |
| `programme` | `"synapse"` — enables `radius-4` + focus `radius-6` |
| `iconSlug` | optional; resolve from `assets/icons/<slug>.svg` |
| `iconOnly` | `false` unless icon-only story |

### Spec Accurate Design story defaults

- `programme: "synapse"`
- `variant: "primary"`; `size: "lg"`
- `children: "Button"` (Figma label on `47808:32122`)
- No leading icon
- Theme: `components/synapse-theme.css`
- Canvas: centered on `var(--color-background-surface-1)`

## Codegen Contract (Framework-Agnostic Blueprint)

### Deterministic structure
1. `ButtonRoot` (`border-radius: var(--corner-radius-radius-4)` in Synapse)
2. optional `ButtonLeadingIcon` (`16×16`)
3. optional `ButtonLabel`

### Variant matrix
| variant | size | icon modes | Synapse chrome |
|---|---|---|---|
| primary | small / medium / large | text / icon+text / icon-only (md, lg) | radius-4; focus ring radius-6 |
| secondary | same | same | same |
| tertiary | same | same | same |
| destructive | same | text / icon+text (no icon-only in verified destructive row) | same |

`Low Res` axis: inherit IDS until verified.

### Per-slot style contract
- `ButtonRoot`: Synapse radius + padding tokens from **Layout & Measurements**; variant/state backgrounds/borders from IDS token table
- `ButtonLeadingIcon`: `16×16`; color follows variant/state
- `ButtonLabel`: `Body 2`

### Behavior contract
See IDS button **Behavior contract** + Synapse radius/focus rules.

### Accessibility contract
See **Interactions → Accessibility**.

### Asset resolution + bundling contract
- Icon slug → `assets/icons/<slug>.svg`
- Unknown slug: hide icon slot, render label

### Fallback/error rules
- Unknown `variant` → `primary`
- Unknown `size` → `large`
- `iconOnly` without `aria-label` → validation error
- `iconOnly` + `size=small` → validation error (or coerce to `medium` per product policy)

### Validation checklist
- [x] IDS baseline referenced; programme deltas table complete for verified nodes
- [x] Live Figma MCP on `47809:1805`, `47808:31665`, sample variants
- [ ] `radius-4` control + `radius-6` focus ring in implementation (`programme="synapse"`)
- [ ] Full variant × state × size matrix matches `47808:31665`
- [x] Storybook `Spec Generated/Synapse/Button` — `storybook-generated/synapse/src/components/Button.stories.tsx`

## Source Mapping
- Design source: Synapse Hi-Fi `Td1bnsvRj1PCGs9RVJkIvJ`
- Validated nodes: `47809:1805` (documentation board), `47808:31665` (component set), `47808:32122`, `47808:32111`, `47808:32100`, `47808:32113`
- IDS parity reference: `components/ids/button/design-spec.md` (`0bHk3XhrjFhowgFkz9yLr4`, nodes `41894:116183`, `9662:25120`)
- Component map: `data/synapse-component-figma-map.json` → Button
- Programme inheritance registry: `data/programme-inheritance-registry.json` → `button`
- **Evidence (2026-06-05, programme-inheritance wizard):** Figma MCP — `get_metadata` on `47809:1805`, `47808:31665`; `get_design_context` + `get_variable_defs` on `47808:32122`, `47808:32111`, `47808:32100`, `47808:32113`; `get_variable_defs` on `47808:31665`
