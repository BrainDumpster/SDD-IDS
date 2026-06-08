# Modal Design Spec

## IDS baseline (layout, flow, contracts)

Synapse **Modal** shares the IDS **Modal** component family (overlay, surface, header, content, footer, dialog `type` axis). Interaction contracts, focus trap, footer action model, severity icon mapping, and **single-page / multi-page** scenarios match the IDS spec unless noted in **Synapse programme deltas** below.

- **IDS source of truth:** [`components/ids/modal/design-spec.md`](../ids/modal/design-spec.md)
- **Shared implementation:** `storybook/src/components/Dialog.tsx` with `programme="synapse"` (radius + border chrome); footer actions use shared `Button` with `programme="synapse"` per [`components/synapse/button/design-spec.md`](../button/design-spec.md)
- **Base UI mapping:** `data/synapse-baseui-mapping.json` → `dialog` (`@base-ui-components/react/dialog`)

**Scope of live Synapse verification (this spec):** `ModalDialog-Main` dialog matrix (`43461:175960`). Single-page and multi-page usages inherit IDS [`modal`](../ids/modal/design-spec.md) until Synapse usage-board nodes are verified.

## Metadata
- Component: Modal / Modal Dialog
- Design System: Synapse
- Category: Modals
- Spec pattern: **ids-fork** (registry: `data/programme-inheritance-registry.json` → `programme: synapse`, `slug: modal`)
- IDS baseline slug: `modal` (IDS map entry: `Dialog`)
- Status: **draft**
- Version: 1.0.0
- Figma file: [Synapse Hi-Fi components](https://www.figma.com/design/Td1bnsvRj1PCGs9RVJkIvJ/Synapse-Hi-Fi-components)
- File key: `Td1bnsvRj1PCGs9RVJkIvJ`
- Main component set: `ModalDialog-Main` — [43461:175960](https://www.figma.com/design/Td1bnsvRj1PCGs9RVJkIvJ/Synapse-Hi-Fi-components?node-id=43461-175960&m=dev)
- Dialog documentation page: [50276:239953](https://www.figma.com/design/Td1bnsvRj1PCGs9RVJkIvJ/Synapse-Hi-Fi-components?node-id=50276-239953&m=dev) (`Modal- Dialog`)
- Verification method: Figma MCP (`get_metadata`, `get_design_context`, `get_variable_defs`)
- Last verified: 2026-06-05 (wizard intake — Main/Elements `43461:175960`; matrix children from `get_metadata`)
- Theme CSS: `components/synapse-theme.css` (not `ids-theme.css`)

### Synapse programme deltas (vs IDS)

| Topic | IDS | Synapse |
|---|---|---|
| Dialog surface width | Size matrix (`x-small` **640×328**, etc.) | Dialog variants **fixed 640px** width (`min-width`/`max-width`/`width`: 640); Figma note: *use small modal only* |
| Surface corner radius | **`0`** (`var(--corner-radius-radius-none)`) | **`var(--corner-radius-radius-16)`** (16px) |
| Surface border | `var(--color-border-accessible)` | **`var(--color-border-neutral-light)`** |
| Header block padding | `24px` inline; **`20px` top / `4px` bottom** | `24px` inline; **`24px` top / `8px` bottom** |
| Content block padding | `24px` inline; `16px` top / `24px` bottom | Same token pattern (`padding-16` top, `padding-24` bottom/inline) — verified on `43461:175961` |
| Footer padding | `24px` all sides | `24px` all sides (same) |
| Content/footer divider | IDS implementation may render `contentSeparator` | **No divider** between content and footer on Synapse dialog variants (verified `43461:175961` … `43461:176040`) |
| Primary button padding (dialog footer) | IDS Button contract | **`padding-10` block / `padding-16` inline** + `radius-4` (Figma button instance) |
| Elevation | Layered drop shadow 2/4/8/16 | Same stack pattern (shadow tokens) |
| Dialog types | Same six types | Same: Non-Alerting, Informational, Warning, Major, Critical, Destructive |
| `.Modal-Element-Content` | IDS node `11348:63031` | Element set [`11348:62999`](https://www.figma.com/design/Td1bnsvRj1PCGs9RVJkIvJ/Synapse-Hi-Fi-components?node-id=11348-62999&m=dev); instances use `11348:63030` |
| Single-page / multi-page | IDS usage board `43411:178475` | **Inherit IDS** until Synapse usage nodes verified |

## Anatomy
Deterministic slot order (IDS-aligned; dialog scenario from `ModalDialog-Main`):

1. `overlay` — viewport backdrop (`var(--color-background-overlay-1)`)
2. `surface` — bordered, elevated container (**16px radius** in Synapse dialog)
3. `header` — title, optional severity icon (by `type`), close control (`16×16`)
4. `description?` — optional (IDS; omit when not in Synapse dialog variant)
5. `content` — `.Modal-Element-Content` body slot
6. `footer` — action cluster (one- or two-button by `type`)
7. `footerCheckbox?` — inherit IDS when scenario supports it (not in verified dialog matrix nodes)

## Layout & Measurements

### Dialog scenario (`scenario=dialog`, verified `43461:175960`)

| Type | Figma node | Width × height (sample) |
|---|---|---|
| Non-Alerting | `43461:175961` | 640 × 232 |
| Informational | `43461:175976` | 640 × 232 |
| Warning | `43461:175992` | 640 × 244 |
| Major | `43461:176008` | 640 × 244 |
| Critical | `43461:176024` | 640 × 244 |
| Destructive | `43461:176040` | 640 × 301 |

- **Dialog width:** `640px` fixed (`min-width`/`max-width`/`width`)
- **Header:** `padding-inline: var(--padding-padding-24)`; `padding-block: var(--padding-padding-24) var(--padding-padding-8)`
- **Content:** `padding-inline: var(--padding-padding-24)`; `padding-block: var(--padding-padding-16) var(--padding-padding-24)`
- **Footer:** `padding: var(--padding-padding-24)`; actions `justify-end`
- **Close control:** `16×16`
- **Severity icon (when present):** `32×32` (Destructive header area)

### Single-page / multi-page (inherit IDS)

Until Synapse Figma usage nodes are verified, use IDS size matrix and padding from [`components/ids/modal/design-spec.md`](../ids/modal/design-spec.md) **except** apply Synapse programme deltas (radius, border token) when implementing Synapse programme chrome.

## Tokens

### Surfaces and borders (Synapse dialog — verified)
- `var(--color-background-component)` — surface fill
- `var(--color-border-neutral-light)` — surface border
- `var(--corner-radius-radius-16)` — surface radius
- `var(--color-background-overlay-1)` — backdrop

### Typography (same semantic names as IDS)
- Title: `var(--font-size-header-5)` / `var(--font-line-height-line-height-32)`, `var(--color-text-neutral-strong)`
- Body: `var(--font-size-body-2)` / `var(--font-line-height-line-height-20)`, `var(--color-text-neutral)`

### Icons
- Close: `var(--color-icon-neutral)` — slug `shape-x`
- Severity icons: same IDS slug map (critical, warning, major, informational)

### Footer actions
- Primary: `var(--color-background-controls-brand-base)`, `var(--color-text-white)`, `var(--color-border-transparent-brand)`
- Destructive primary: `var(--color-background-alerting-critical)` (inherit IDS destructive row)

## States (Light Theme)

### Dialog surface (all `type` variants)

| Area | Background | Border | Radius | Shadow |
|---|---|---|---|---|
| Surface | `var(--color-background-component)` | `1px` `var(--color-border-neutral-light)` | `var(--corner-radius-radius-16)` | drop-shadow 2/4/8/16 stack |

### Dialog `type` rows (inherit IDS behavior; Synapse chrome above)

| type | Header icon | Footer layout | Notes |
|---|---|---|---|
| non-alerting | none | one primary | Figma `43461:175961` |
| informational | info icon | one primary | `43461:175976` |
| warning | warning icon | tertiary + primary | `43461:175992` |
| major | major icon | tertiary + primary | `43461:176008` |
| critical | critical icon | tertiary + primary | `43461:176024` |
| destructive | critical icon + confirm region | tertiary + destructive primary | `43461:176040` |

Text/icon token bindings per `type` follow IDS modal spec; verify with `get_variable_defs` on each Synapse variant before marking **active**.

## States (Dark Theme)

Dark theme uses the same semantic tokens as **States (Light Theme)**. Resolved values for `[data-theme="dark"]` / Synapse dark scope live in theme CSS:

- `components/synapse-theme.css`

Duplicate the full state matrix in this section only when a dark row genuinely uses different `var(--...)` references than the corresponding light row.

## Interactions

(Inherit IDS [`modal`](../ids/modal/design-spec.md) unless noted.)

- **Open / close / escape / focus trap:** same as IDS
- **Dialog `type`:** same one-button vs two-button rules as IDS
- **Footer labels:** runtime props only — never hardcoded

### Accessibility
- `role="dialog"`, `aria-modal="true"`
- `aria-labelledby` → title; `aria-describedby` → content when present
- Close `aria-label="Close"`

### Behavior & guidelines
- Synapse dialog samples use **640px** width only — do not upscale dialog to `medium`/`large` without new Figma evidence
- Apply `components/synapse-theme.css` at app root

## Composition & API (runtime)

Inherit IDS modal API from [`components/ids/modal/design-spec.md`](../ids/modal/design-spec.md) **Composition & API** with these Synapse defaults:

| Prop | Synapse default / note |
|---|---|
| `scenario` | `"dialog"` for `ModalDialog-Main` stories |
| `size` | `"x-small"` / fixed 640px width for dialog |
| `type` | `"non-alerting"` for **Spec Accurate Design** |
| `primaryActionLabel` | host-defined (Figma sample: `"Close"`) |
| Footer / trigger `Button` | `programme="synapse"`, `size="lg"` — see [`button`](../button/design-spec.md) |

### Spec Accurate Design story defaults (when Storybook requested)

- `scenario: "dialog"`; `type: "non-alerting"`
- `title: "Non-Alerting"`; body lorem from Figma `43461:175961`
- `primaryActionLabel: "Close"`; single primary footer button
- `size: "x-small"` (640px Synapse dialog width)
- Parent: centered overlay on `var(--color-background-surface-1)` demo canvas
- Theme: `components/synapse-theme.css`

## Codegen Contract (Framework-Agnostic Blueprint)

### Deterministic structure
1. `overlay`
2. `surface` (Synapse: `border-radius: var(--corner-radius-radius-16)`)
3. `header` (`severityIcon?`, `title`, `closeButton?`)
4. `content`
5. `footer`

### Variant matrix
| scenario | type | Synapse visual |
|---|---|---|
| dialog | non-alerting | 640px, radius 16, neutral-light border, one primary |
| dialog | informational | + info icon |
| dialog | warning / major / critical | + severity icon, two-button footer |
| dialog | destructive | + confirm content, destructive primary |

Single-page / multi-page: inherit IDS variant matrix until Synapse nodes verified.

### Per-slot style contract
- `surface`: Synapse dialog tokens above; **not** IDS `radius-none` / `border-accessible`
- `header` / `content` / `footer`: padding tokens from **Layout & Measurements**
- Footer buttons: Synapse button padding on dialog instances; still emit user-defined labels

### Behavior contract
See IDS modal **Behavior contract** + Synapse width/radius rules above.

### Accessibility contract
See **Interactions → Accessibility**.

### Asset resolution + bundling contract
Same icon slugs as IDS modal (`shape-x`, severity solids under `assets/icons/`).

### Fallback/error rules
- Unknown `type` → `non-alerting`
- Unknown `scenario` → `dialog` for Synapse `ModalDialog-Main` scope; else IDS fallback `single-page`
- Missing `title` / `primaryActionLabel` → validation error

### Validation checklist
- [x] IDS baseline referenced; programme deltas table complete for verified dialog nodes
- [x] Live Figma MCP on `43461:175960`, `43461:175961`, `43461:176040`
- [ ] Dialog 640px width + `radius-16` + `border-neutral-light` in implementation
- [x] No content/footer divider on Synapse dialog (`programme="synapse"`)
- [ ] All six `type` variants match Synapse Figma matrix
- [ ] Single-page / multi-page deferred to IDS until Synapse usage nodes verified
- [x] Storybook `Spec Generated/Synapse/Modal Dialog` — `storybook-generated/synapse/src/components/Modal.stories.tsx`

## Source Mapping
- Design source: Synapse Hi-Fi `Td1bnsvRj1PCGs9RVJkIvJ`
- Validated nodes: `43461:175960`, `43461:175961`, `43461:175976`, `43461:175992`, `43461:176008`, `43461:176024`, `43461:176040`, `50276:239953`
- IDS parity reference: `components/ids/modal/design-spec.md` (`0bHk3XhrjFhowgFkz9yLr4`, nodes `11348:63064`, `43390:21759`, `43411:178475`, …)
- Component map: `data/synapse-component-figma-map.json` → Modal Dialog
- Programme inheritance registry: `data/programme-inheritance-registry.json` → `modal`
- **Evidence (2026-06-05, programme-inheritance wizard):** Figma MCP on intake nodes — `get_metadata` + `get_design_context` + `get_variable_defs` on `43461:175960` (`ModalDialog-Main` + six `Type=` children: `43461:175961` … `43461:176040`). Element bucket duplicated Main node; `.Modal-Element-Content` element set documented at `11348:62999` from design-context cross-ref. State bucket empty — matrix children verified via Main metadata.
