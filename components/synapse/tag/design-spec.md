# Tag Design Spec

## IDS baseline (layout, flow, contracts)

Synapse **Tag** inherits the IDS **Tag** chip contract (read-only, clickable, editable/dismissible, badge variants; alerting tones; pill geometry; close affordance). Synapse verifies the same variant axes in the **Synapse Hi-Fi** file with programme-specific focus-ring offset and alerting **Light** emphasis treatments.

- **IDS source of truth:** [`components/ids/tag/design-spec.md`](../ids/tag/design-spec.md)
- **Shared implementation:** `storybook/src/components/Tag.tsx` with `programme="synapse"`; wrapper `SynapseTag.tsx`
- **Base UI mapping:** `data/synapse-baseui-mapping.json` → `tag` (custom chip; no Base UI primitive)
- **Codegen merge:** load IDS `tag` spec first, then apply **Synapse programme deltas** and **Programme override rules** below (programme wins on conflict).

**Scope of live Synapse verification:** main set `38910:57385`; boards `38910:51200`, `38910:51195`, `38910:51213`, `38910:51235`, `38910:57339`; close element `11666:90409`.

## Metadata

| Property | Value |
|---|---|
| Component | Tag |
| Design system | Synapse |
| Category | Components / Form elements |
| Spec pattern | **ids-fork** (`data/programme-inheritance-registry.json` → `programme: synapse`, `slug: tag`) |
| IDS baseline slug | `tag` |
| Status | **active** |
| Version | 1.1.0 |
| Created | 2026-06-05 |
| Updated | 2026-06-05 |
| Description | Pill chip for labels, filters, and status — read-only, clickable, editable/dismissible, and badge variants |
| Figma file | [Synapse Hi-Fi components](https://www.figma.com/design/Td1bnsvRj1PCGs9RVJkIvJ/Synapse-Hi-Fi-components) |
| File key | `Td1bnsvRj1PCGs9RVJkIvJ` |
| Main component set | [`38910:57385`](https://www.figma.com/design/Td1bnsvRj1PCGs9RVJkIvJ/Synapse-Hi-Fi-components?node-id=38910-57385&m=dev) (`Tags-main`) |
| Close element set | [`11666:90409`](https://www.figma.com/design/Td1bnsvRj1PCGs9RVJkIvJ/Synapse-Hi-Fi-components?node-id=11666-90409&m=dev) (`Tag-Element-Close`) |
| Verification method | Figma MCP (`get_metadata`, `get_design_context`, `get_variable_defs`) |
| Last verified | 2026-06-05 |
| Theme CSS | `components/synapse-theme.css` |
| Spec contract | `storybook/src/spec-contracts/synapse-tag.contract.ts` |
| Storybook | `storybook/src/components/SynapseTag.stories.tsx` |
| Programme wrapper | `storybook/src/components/SynapseTag.tsx` |
| Shared implementation | `storybook/src/components/Tag.tsx` |

### Synapse programme deltas (vs IDS Tag)

| Topic | IDS (`tag`) | Synapse (verified) |
|---|---|---|
| Pill corner radius | `var(--corner-radius-radius-24)` | **Same** |
| Small track height | **`20px`** | **Same** (`38910:57384`) |
| Large track height | **`28px`** | **Same** (clickable / editable / badge) |
| Small horizontal padding | `var(--padding-padding-8)` | **Same** |
| Large horizontal padding | `var(--padding-padding-12)` | **Same** |
| Large vertical padding | `var(--padding-padding-4)` | **Same** |
| Focus outer ring gap | `3px` (IDS spec text) | **`4px`** `outline-offset` (`12715:251521`; impl `Tag.module.css`) |
| Clickable unselected **default** background | IDS table lists `brand-lighter` | **`var(--color-background-component)`** at rest (`11946:233037`); **`brand-lighter` on hover** (`12721:251547`) |
| Clickable selected | `controls-brand-base` + white text | **Same** (`11850:226229`) |
| Alerting **Strong** emphasis | filled tone + white border/text | **Same** semantic tokens (`38910:51186`) |
| Alerting **Light** emphasis — Critical | critical fill + white text (IDS) | **`var(--color-background-alerting-critical-slate)`** + **`var(--color-text-tag-critical)`** (`50724:303493`) |
| Alerting **Light** — other tones | tone-specific light borders | **Same axis names**; verify per tone in `38910:51200` |
| Badge variant anatomy | count mini-chip | **Leading count chip** (`18px`) + **trailing `arrow-drop-tri-caret`** `10×10` (`11659:90356`) |
| Close icon | `shape-x-thick` `10×10` | **Same**; explicit **Default / Hover / Focus** set (`11666:90409`) |
| Border / control tokens | IDS semantic set | **Same `var(--...)` names** (theme via `synapse-theme.css`) |

### Validated Figma nodes

| Scenario | Node | Notes |
|---|---|---|
| Main type set | `38910:57385` | Axes: `Type` = Read-only \| Clickable \| Editable or Dismissible \| Tags with badge |
| Read-only symbol | `38910:57384` | `40×20` |
| Clickable symbol | `38910:57383` | `48×28` |
| Editable/dismissible symbol | `38910:57382` | `66×28` |
| Badge symbol | `38910:57381` | `92×28` |
| Alerting tones board | `38910:51200` | Informational / Success / Minor / Major / Critical × Strong \| Light; none-small |
| Non-alerting large | `38910:51195` | `State=Default` `11659:90340`, `Error` `11659:90342`, `Focus` `12715:251521` |
| Clickable states | `38910:51213` | Selected × State matrix (`11946:233037`, `11850:226229`, `12721:251547`, …) |
| Editable/dismissible | `38910:51235` | Regular/Error/Disabled × FocusOnText (`11659:90395`, `11836:225490`, …) |
| Tags with badge | `38910:57339` | Default/Error/Disabled × Focus (`11659:90356`, …) |
| Close icon default | `11666:90408` | `10×10` |
| Close icon hover | `11666:90413` | icon `neutral-strong` |
| Close icon focus | `11671:157335` | keyboard focus on dismiss control |

## Anatomy

Deterministic slot order (IDS-aligned unless noted):

1. `TagRoot` — pill shell (`border-radius: var(--corner-radius-radius-24)`)
2. `TagPrefixIcon?` — alerting glyph (read-only alerting tones)
3. `TagCountBadge?` — leading mini-chip (`type=badge` only; `18px` height)
4. `TagLabelCluster` — optional `TagLabelPrefix?` + `TagLabel` (Body 2)
5. `TagEditableField?` — inline text focus surface (`type=editable`)
6. `TagMenuCaret?` — trailing `arrow-drop-tri-caret` (`type=badge` only; `10×10`)
7. `TagCloseButton?` — `shape-x-thick` (`type=editable` / dismissible; `10×10`)

## Layout & Measurements

### Size tracks

| Track | Height | Horizontal padding | Vertical padding | Sample width |
|---|---|---|---|---|
| **small** (`read-only`) | **`20px`** | `var(--padding-padding-8)` | `0` | **`40px`** (`38910:57384`) |
| **large** (clickable / editable / badge) | **`28px`** | `var(--padding-padding-12)` | `var(--padding-padding-4)` | `48px`–`92px` by type |

### Pill geometry

| Property | Value |
|---|---|
| Corner radius | **`var(--corner-radius-radius-24)`** |
| Border width | `var(--border-width-border-default)` |
| Internal gap (large types) | `var(--spacing-space-8)` |
| Label prefix gap | `var(--spacing-space-2)` inside `TagLabelCluster` |

### `TagCountBadge` (badge type)

| Property | Value |
|---|---|
| Height | **`18px`** (`var(--sizing-size-18)`) |
| Horizontal padding | **`5.5px`** (Figma); impl may use `var(--padding-padding-4)` |
| Radius | pill (`100px` / `999px`) |
| Border | `var(--color-border-white)` |
| Background (default) | `var(--color-background-alerting-info-1)` |
| Typography | Body 3 scale (~`12px`) |

### `TagCloseButton`

| Property | Value |
|---|---|
| Hit target / icon | **`10×10`** (`var(--sizing-size-10)`) |
| Asset slug | **`shape-x-thick`** (`29515:170325`) |
| Gap from label cluster | `var(--spacing-space-8)` |

### Focus ring (Synapse)

| Property | Value |
|---|---|
| Trigger | keyboard `:focus-visible` on interactive tag or close control |
| Outline | `var(--border-width-border-default)` solid `var(--color-border-brand-base)` |
| Outline offset | **`4px`** from tag edge (`12715:251521`) |
| Content | unchanged from base state |

## Tokens

### Surface + border
- `var(--color-background-component)` — default non-alerting shell; clickable unselected rest
- `var(--color-background-gray-light)` / `var(--color-background-gray-lighter)` — disabled
- `var(--color-border-accessible)` — default non-alerting border
- `var(--color-border-brand-base)` — clickable outline; editable text-focus; focus ring
- `var(--color-border-transparent-brand)` — clickable selected border
- `var(--color-border-disabled)` — disabled
- `var(--color-border-alerting-critical-base)` — error shell
- `var(--corner-radius-radius-24)` — pill
- `var(--border-width-border-default)` — shell + focus ring

### Interactive / selection
- `var(--color-background-controls-brand-lighter)` — clickable hover (unselected)
- `var(--color-background-controls-brand-base)` — clickable selected; badge count default
- `var(--color-background-controls-brand-strong)` — clickable selected hover

### Text + icon
- `var(--color-text-neutral)` — default label
- `var(--color-text-white)` — selected clickable; strong alerting; badge count
- `var(--color-text-disabled)` — disabled
- `var(--color-text-tag-critical)` — **Light** critical alerting label (`50724:303493`)
- `var(--color-text-warning)` — minor alerting light
- `var(--color-icon-neutral-strong)` — close icon hover (`11666:90413`)

### Alerting backgrounds + borders
- `var(--color-background-alerting-info)` / `var(--color-border-alerting-info-white)`
- `var(--color-background-alerting-success)` / `var(--color-border-alerting-success-white)`
- `var(--color-background-alerting-minor)` / `var(--color-border-alerting-minor-transparent)`
- `var(--color-background-alerting-major)` / `var(--color-border-alerting-major-white)`
- `var(--color-background-alerting-critical)` / `var(--color-border-alerting-critical-white)`
- `var(--color-background-alerting-critical-slate)` — **Light** critical (`50724:303493`)
- `var(--color-border-white)` — strong alerting borders

### Typography + spacing
- `var(--font-size-body-2)` / `var(--font-line-height-line-height-20)` — label
- `var(--font-size-body-3)` — badge count
- `var(--spacing-space-2)`, `var(--spacing-space-8)`
- `var(--padding-padding-4)`, `var(--padding-padding-8)`, `var(--padding-padding-12)`

## States (Light Theme)

| Slot | State | Background | Border | Text/Icon |
|---|---|---|---|---|
| `TagRoot` read-only non-alerting | default | `var(--color-background-component)` | `var(--color-border-accessible)` | `var(--color-text-neutral)` |
| `TagRoot` read-only alerting Strong | default | tone alerting fill | tone white/transparent border | `var(--color-text-white)` or tone text |
| `TagRoot` read-only alerting Light — Critical | default | `var(--color-background-alerting-critical-slate)` | `var(--color-border-alerting-critical-base)` | `var(--color-text-tag-critical)` |
| `TagRoot` clickable unselected | default | `var(--color-background-component)` | `var(--color-border-brand-base)` | `var(--color-text-neutral)` |
| `TagRoot` clickable unselected | hover | `var(--color-background-controls-brand-lighter)` | `var(--color-border-brand-base)` | `var(--color-text-neutral)` |
| `TagRoot` clickable selected | default | `var(--color-background-controls-brand-base)` | `var(--color-border-transparent-brand)` | `var(--color-text-white)` |
| `TagRoot` clickable selected | hover | `var(--color-background-controls-brand-strong)` | `var(--color-border-transparent-brand)` | `var(--color-text-white)` |
| `TagRoot` | focus-visible | base state retained | outer ring `var(--color-border-brand-base)`; **`outline-offset: 4px`** | unchanged |
| `TagRoot` editable | default | `var(--color-background-component)` | `var(--color-border-accessible)` | `var(--color-text-neutral)` |
| `TagRoot` editable | error | `var(--color-background-component)` | `var(--color-border-alerting-critical-base)` | `var(--color-text-neutral)` |
| `TagEditableField` | focus-on-text | transparent | inner field `var(--color-border-brand-base)` | `var(--color-text-neutral)` |
| `TagRoot` | disabled | `var(--color-background-gray-light)` or `gray-lighter` (editable) | `var(--color-border-disabled)` | `var(--color-text-disabled)` |
| `TagCountBadge` | default | `var(--color-background-alerting-info-1)` | `var(--color-border-white)` | `var(--color-text-white)` |
| `TagCloseButton` | default | transparent | none | inherits tag text color |
| `TagCloseButton` | hover | transparent | none | `var(--color-icon-neutral-strong)` |
| `TagCloseButton` | focus | transparent | focus ring per host | inherits |

## States (Dark Theme)

Dark theme uses the same semantic tokens as **States (Light Theme)**. Resolved values for `[data-theme="dark"]` / Synapse dark scope live in theme CSS:

- `components/synapse-theme.css`

Duplicate the full state matrix in this section only when a dark row genuinely uses different `var(--...)` references than the corresponding light row.

## Interactions

(Inherit IDS [`tag`](../ids/tag/design-spec.md) unless noted.)

- **`read-only`:** non-interactive label chip.
- **`clickable`:** toggles `selected`; unselected rests on **component** background; hover applies **brand-lighter**.
- **`editable` / dismissible:** body click focuses inline text field; close removes tag (`onDismiss`).
- **`badge`:** displays leading count chip + trailing menu caret (dropdown affordance); not a simple count-only chip.
- Hover applies on clickable shell and close button where enabled.
- `focus-visible` uses Synapse **`4px`** outer ring on tag or close control.
- Disabled blocks click, dismiss, and selection.
- `data-state` / `visualState` forced values are Storybook/demo-only.

### Accessibility

- Interactive variants: `button` semantics (or equivalent role + keyboard parity).
- Clickable selected: `aria-pressed="true"`.
- Close: `aria-label` includes tag label context (e.g. `Remove Tag`).
- Badge caret: decorative unless host wires menu trigger semantics.
- Disabled: `disabled` / `aria-disabled` consistently.

### Behavior & guidelines

- Host **`components/synapse-theme.css`** at application root.
- Default sample label in stories: **`Tag`**.
- `emphasis: strong | light` maps to Figma **Type=Strong \| Light** on alerting board `38910:51200`.
- `type=badge` requires both count segment and caret per Figma `38910:57339`.

## Composition & API (runtime)

### Programme merge (codegen)

1. Parse IDS [`tag`](../ids/tag/design-spec.md) **Composition & API** and **Codegen Contract** as base.
2. Apply **Synapse programme deltas** and **Programme override rules** (this spec).
3. Emit `programme: "synapse"` when generating Synapse targets (when implementation supports programme flag).

### Root props (merged)

| Prop | Type / default | Behavior |
|---|---|---|
| `programme` | `"synapse"` | Synapse focus offset + clickable rest/hover + Light critical tokens |
| `type` | `read-only` \| `clickable` \| `editable` \| `badge` | default `read-only` |
| `size` | `small` \| `large` | default `small` for read-only; `large` for other types |
| `tone` | `non-alerting` \| `info` \| `success` \| `minor` \| `major` \| `critical` | default `non-alerting` |
| `emphasis` | `light` \| `strong` | default `light`; alerting only |
| `selected` | `boolean?` | clickable only |
| `disabled` | `boolean?` | default `false` |
| `error` | `boolean?` | editable / badge / non-alerting large |
| `focusOnText` | `boolean?` | editable only |
| `label` | `string` | required display text |
| `showLabel` | `boolean?` | optional `Label:` prefix cluster |
| `badgeCount` | `number?` | badge type leading count |
| `closable` | `boolean?` | editable dismissible |
| `visualState` | demo override | Storybook only |
| `onClick` | `() => void` | clickable |
| `onSelectedChange` | `(selected: boolean) => void` | clickable |
| `onDismiss` | `() => void` | editable close |
| `onTextFocus` / `onTextBlur` | callbacks | editable field |

## Codegen Contract (Framework-Agnostic Blueprint)

### IDS merge strategy

```
effectiveSpec = merge(
  load("components/ids/tag/design-spec.md"),
  load("components/synapse/tag/design-spec.md"),
  precedence: "programme-overrides-ids"
)
```

### Deterministic structure

1. `TagRoot`
2. `TagPrefixIcon?` (alerting read-only)
3. `TagCountBadge?` (`type=badge`)
4. `TagLabelCluster` → `TagLabelPrefix?` + `TagLabel` | `TagEditableField`
5. `TagMenuCaret?` (`type=badge`)
6. `TagCloseButton?` (`closable` / `type=editable`)

### Variant matrix

| Axis | Values |
|---|---|
| `programme` | `ids` \| `synapse` |
| `type` | `read-only` \| `clickable` \| `editable` \| `badge` |
| `size` | `small` \| `large` |
| `tone` | `non-alerting` \| `info` \| `success` \| `minor` \| `major` \| `critical` |
| `emphasis` | `light` \| `strong` (alerting) |
| `visualState` | `default` \| `hover` \| `focus` \| `error` \| `disabled` |
| `selected` | `true` \| `false` (clickable) |
| `focusOnText` | `true` \| `false` (editable) |
| `showLabel` | `false` \| `true` |
| `closable` | `false` \| `true` |

### Programme override rules

| Rule | IDS | Synapse |
|---|---|---|
| Focus `outline-offset` | `3px` (IDS spec) | **`4px`** |
| Clickable unselected default bg | brand-lighter (IDS state table) | **`background-component`** |
| Clickable unselected hover bg | brand-lighter | **Same** (`controls-brand-lighter`) |
| Critical alerting Light | critical fill + white text | **`background-alerting-critical-slate`** + **`text-tag-critical`** |
| Badge trailing affordance | count only (IDS spec) | **count + `arrow-drop-tri-caret`** |
| Theme CSS | `ids-theme.css` | **`synapse-theme.css`** |

### Per-slot style contract

| Slot | Synapse rule |
|---|---|
| `TagRoot` small | `20px` height; `padding-8`; `radius-24` |
| `TagRoot` large | `28px` height; `padding-4`/`padding-12`; `radius-24` |
| `TagRoot` focus | outer ring `brand-base`; **`outline-offset: 4px`** |
| `TagCountBadge` | `18px` height; `info-1` fill; white border; Body 3 count |
| `TagMenuCaret` | `arrow-drop-tri-caret`; `10×10` |
| `TagCloseButton` | `shape-x-thick`; `10×10`; hover → `icon-neutral-strong` |
| `TagEditableField` focus | inner border `brand-base`; `radius-2` |

### Behavior contract

- Clickable toggles `selected` and emits `onSelectedChange`.
- Editable body click focuses text field before editing.
- Close emits `onDismiss`; host removes from list.
- Disabled blocks all emitted events.
- `focus-visible` ring on keyboard path only (not pointer click).
- `type=badge` renders **both** count chip and menu caret.

### Accessibility contract

See **Interactions → Accessibility**.

### Asset resolution + bundling contract

| Slug | File | Size | Usage |
|---|---|---|---|
| `shape-x-thick` | `assets/icons/shape-x-thick.svg` | `10×10` | Dismiss close control |
| `arrow-drop-tri-caret` | `assets/icons/arrow-drop-tri-caret.svg` | `10×10` | Badge type trailing caret |
| alerting icons | `assets/icons/<tone-icon>.svg` | per tone | Optional prefix on alerting read-only |

Resolve via shared `Icon` (`import.meta.glob` on `assets/icons/*.svg`). Unknown slug → omit icon. Missing asset → preserve layout gap.

### Fallback/error rules

- Unknown `type` → `read-only`
- Unknown `size` → `small` (read-only) else `large`
- Unknown `tone` → `non-alerting`
- Unknown `emphasis` → `light`
- Unknown `programme` → `ids`
- `badgeCount` without `type=badge` → ignore count
- `selected=true` without `type=clickable` → ignore

### Validation checklist

- [x] IDS baseline linked; programme deltas table complete
- [x] Live Figma MCP on `38910:57385`, `38910:51200`, `38910:51195`, `38910:51213`, `38910:51235`, `38910:57339`, `11666:90409`
- [x] `get_variable_defs` on clickable default/hover/selected (`11946:233037`, `12721:251547`, `11850:226229`)
- [x] Critical Light tokens verified (`50724:303493`)
- [x] Small `20px` / large `28px` heights match `Tags-main`
- [x] Close icon `10×10` + Default/Hover/Focus set documented
- [x] Badge type: count chip `18px` + caret documented (`11659:90356`)
- [x] Synapse focus **`4px`** outline-offset documented
- [x] Programme merge strategy documented for framework-agnostic codegen
- [x] Light/Dark via `synapse-theme.css` semantic tokens only
- [x] Spec contract wired (`synapse-tag.contract.ts`)
- [x] Storybook stories wired (`SynapseTag.stories.tsx`)
- [x] `programme="synapse"` applies 4px focus ring + critical Light slate tokens in `Tag.module.css`
- [x] `SynapseTag` wrapper exports programme default for Synapse targets

## Source Mapping

| Property | Value |
|---|---|
| Design source | Synapse Hi-Fi `Td1bnsvRj1PCGs9RVJkIvJ` |
| Main component set | `38910:57385` |
| Read-only | `38910:57384` |
| Clickable | `38910:57383` / board `38910:51213` |
| Editable/dismissible | `38910:57382` / board `38910:51235` |
| Badge | `38910:57381` / board `38910:57339` |
| Alerting board | `38910:51200` |
| Non-alerting large | `38910:51195` |
| Close element | `11666:90409` |
| IDS baseline | `components/ids/tag/design-spec.md` — node `42012:26686` (`0bHk3XhrjFhowgFkz9yLr4`) |
| Component map | `data/synapse-component-figma-map.json` → Tag |
| Registry | `data/programme-inheritance-registry.json` → `synapse` / `tag` |
| Spec contract | `storybook/src/spec-contracts/synapse-tag.contract.ts` |
| Storybook | `storybook/src/components/SynapseTag.stories.tsx` |
| Programme wrapper | `storybook/src/components/SynapseTag.tsx` |
| Shared implementation | `storybook/src/components/Tag.tsx` |
| Verification | Figma MCP — **2026-06-05** |
