# Main Menu Top Design Spec

## IDS baseline (layout, flow, contracts)

Synapse **Main Menu Top** is the same component family as IDS **Main Menu/Top**. Horizontal bar anatomy, dropdown/submenu interaction model, single-active-item rules, composable `Item` → `Menu` hierarchy, and runtime API **inherit IDS** unless listed in **Synapse programme deltas** below.

- **IDS source of truth:** [`components/ids/main-menu-top/design-spec.md`](../ids/main-menu-top/design-spec.md)
- **Shared implementation:** `storybook/src/components/MainMenuTop.tsx`, `MainMenuTopMenu.tsx`, `MainMenuTop.module.css`, `MainMenuTopMenu.module.css`
- **Dropdown dependency (programme):** [`components/synapse/dropdown-single-select/design-spec.md`](../dropdown-single-select/design-spec.md) (masthead-attached menus use Synapse menu radius aliases)
- **Theme CSS:** `components/synapse-theme.css`

## Metadata

| Property | Value |
|---|---|
| Component | Main Menu Top |
| Design system | Synapse |
| Category | Navigation |
| Spec pattern | **ids-fork** (registry: `data/programme-inheritance-registry.json` → `programme: synapse`, `slug: main-menu-top`) |
| IDS baseline slug | `main-menu-top` |
| Status | **active** |
| Version | 1.0.0 |
| Figma file | [Synapse Hi-Fi components](https://www.figma.com/design/Td1bnsvRj1PCGs9RVJkIvJ/Synapse-Hi-Fi-components) |
| File key | `Td1bnsvRj1PCGs9RVJkIvJ` |
| Documentation board | `11067:54522` — [Main Menu/Top](https://www.figma.com/design/Td1bnsvRj1PCGs9RVJkIvJ/Synapse-Hi-Fi-components?node-id=11067-54522&m=dev) |
| Main assembly (spec-accurate) | `10189:30280` — `MainMenu-Top-Main` (`1496×40`, eight Large items) |
| Primary element set | `11099:56576` — `.MainMenu-Top-Element-Primary` (`Size` Large/Small · `State` Default/Hover/Press/Selected/Default-Focus/Selected-Focus · `Dropdown` · `Icon`) |
| Masthead + menu usage | `42820:100757` — `Masthead-Main` + `MainMenu-Top-Main` (`1920×106`) |
| Dropdown panel (sample) | `43603:179106` — `Dropdown-SingleSelect-Elements-Menu` (`185×200`) |
| IDS Figma nodes (parity) | `10189:30280`, `11099:56576` (IDS library `0bHk3XhrjFhowgFkz9yLr4`) |
| Verification method | Figma REST API (`get_file_nodes`, `variables/local`) via `FIGMA_TOKEN` |
| Last verified | 2026-06-16 |
| Reference implementation | `MainMenuTop.tsx` (hover/menu-open neutral text matches Synapse Figma `11099:56587`) |
| Generated Storybook | `storybook/src/components/SynapseMainMenuTop.stories.tsx` — title **`Spec Generated/Synapse/Main Menu Top`**, primary story **`Spec Accurate Design`** |
| IDS Storybook (baseline) | `storybook/src/components/MainMenuTop.stories.tsx` — **`Spec Generated/IDS/Main Menu Top`** |

### Synapse programme deltas (vs IDS)

| Topic | IDS | Synapse (Figma evidence) |
|---|---|---|
| Hover **text** | `var(--color-text-brand-strong)` | **`var(--color-text-neutral-strong)`** — `11099:56587` (`Size=Large, State=Hover`) |
| Hover **icon** | `var(--color-icon-brand-strong)` | **`var(--color-icon-neutral-strong)`** — same variant |
| Menu-open, not selected | brand-strong text (IDS) | **`neutral-strong` text/icon** + `var(--color-background-brand-lighter)` — matches hover row |
| Press text/icon | `var(--color-text-brand-strong)` / `var(--color-icon-brand-strong)` | **Same** — `11393:103109` |
| Selected text/icon | brand-strong + bottom inset `var(--color-border-brand-dark)` | **Same** — `11099:56577` |
| Label font weight | Body 1/2 **medium (500)** | **regular (400)** — Figma `Typography/Font Weight/regular` on `11099:56597` |
| Bar layout / item geometry | `40px` Large row, `16px` gap, `12px` inline padding, `18×18` icon, `12×12` chevron | **Same** — `10189:30280`, `11099:56576` |
| Dropdown menu chrome | square corners (`border-radius: 0`), shadow-4 | **Synapse dropdown aliases** — `var(--dropdown-menu-radius)` → **`var(--corner-radius-radius-4)`** per [`dropdown-single-select`](../dropdown-single-select/design-spec.md); sample width **`185px`** (`43603:179106`) |
| Submenu flip / keyboard | IDS use cases `42136:57471`, `42136:57503` | **Inherit IDS behavior** (no dedicated submenu frames on Synapse board `11067:54522`) |
| Product composition | standalone bar | Often composed **below `Masthead-Main`** in Synapse frames (`42820:100757`) — host layout, not a bar-token delta |

## Anatomy

Deterministic slot order (IDS-aligned):

1. **`MainMenuTopRoot`** — `<nav>` horizontal shell (`width: 100%`, `box-sizing: border-box`)
2. **`MainMenuTopBar`** — flex row on `var(--color-background-surface-1)`
3. Repeat **`MainMenuTopItem`** (`.MainMenu-Top-Element-Primary`) per option:
   - **`ItemContainer`** — icon + label (`gap: var(--spacing-space-16)`)
   - **`ItemIcon`** — `18×18` (`assets/icons/<slug>.svg`)
   - **`ItemLabel`** — Body 1 (Large) or Body 2 (Small)
   - **`ItemChevron`** — optional `12×12` `chev-down-thick` when `dropdown === true`
4. **`MainMenuTopDropdown`** — per item with `menuOptions`; anchored below trigger; programme menu styling via Synapse dropdown contract
5. **`MainMenuTopSubmenu`** — nested flyout (inherit IDS placement/flip rules)

## Layout & Measurements

Inherit IDS [`main-menu-top`](../ids/main-menu-top/design-spec.md) **Layout & Measurements** except where **Synapse programme deltas** apply.

- **Runtime width:** `width: 100%`, `box-sizing: border-box`; Figma sample `1496×40` on `10189:30280` (reference only).
- **Bar:** `display: flex`; `align-items: center`; `min-height: 40px`; `gap: var(--spacing-space-16)`; padding `0 var(--padding-padding-12)`; background `var(--color-background-surface-1)`.
- **Item (Large):** height `40px`; padding `0 var(--padding-padding-12)`; inner cluster gap `var(--spacing-space-16)`; chevron gap `var(--spacing-space-8)`.
- **Item (Small):** height `36px`; padding `0 var(--padding-padding-8)`; Body 2 typography.
- **Selected underline:** `box-shadow: inset 0 -2px 0 var(--color-border-brand-dark)` inside hit target.
- **Focus ring:** `4px` outline `var(--color-border-brand-base)`; `border-radius: var(--corner-radius-radius-4)`.
- **Dropdown panel:** min-width **185px** (Synapse sample `43603:179106`); `sideOffset` **10px**; center-aligned to trigger; radius via **`var(--dropdown-menu-radius)`** (Synapse → 4px).
- **Option row:** min-height **40px**; padding `var(--padding-padding-10)` × `var(--padding-padding-16)` — per Synapse dropdown-single-select.
- **Narrow viewport:** horizontal scroll on bar (`overflow-x: auto`, `flex-wrap: nowrap` under `768px`) — inherit IDS reference implementation.

## Tokens

### Typography

- **Large label:** `var(--font-size-body-1)` / `var(--font-line-height-line-height-24)`; weight **`400`** (Synapse) — IDS uses `500`.
- **Small label:** `var(--font-size-body-2)` / `var(--font-line-height-line-height-20)`; weight **`400`**.

### Surfaces, borders, icons

- **Bar background:** `var(--color-background-surface-1)`
- **Item default text/icon:** `var(--color-text-neutral-strong)` / `var(--color-icon-neutral-strong)`
- **Hover / menu-open (not selected) background:** `var(--color-background-brand-lighter)`
- **Hover / menu-open (not selected) text/icon:** **`var(--color-text-neutral-strong)`** / **`var(--color-icon-neutral-strong)`** (Synapse delta)
- **Press background:** `var(--color-background-brand-light)`
- **Press / selected text/icon:** `var(--color-text-brand-strong)` / `var(--color-icon-brand-strong)`
- **Selected underline:** `var(--color-border-brand-dark)`
- **Focus outline:** `var(--color-border-brand-base)`
- **Dropdown menu:** per [`dropdown-single-select`](../dropdown-single-select/design-spec.md) + `components/synapse-theme.css`

## States (Light Theme)

| Element | State | Background | Border / indicator | Text | Icon |
| --- | --- | --- | --- | --- | --- |
| Bar | default | `var(--color-background-surface-1)` | — | — | — |
| Item (Large) | default | transparent | none | `var(--color-text-neutral-strong)` | `var(--color-icon-neutral-strong)` |
| Item (Large) | hover | `var(--color-background-brand-lighter)` | none | **`var(--color-text-neutral-strong)`** | **`var(--color-icon-neutral-strong)`** |
| Item (Large) | press | `var(--color-background-brand-light)` | none | `var(--color-text-brand-strong)` | `var(--color-icon-brand-strong)` |
| Item (Large) | selected | transparent | inset `2px` bottom `var(--color-border-brand-dark)` | `var(--color-text-brand-strong)` | `var(--color-icon-brand-strong)` |
| Item (Large) | focus-visible | transparent | `var(--color-border-brand-base)` outline (4px) | prior text token | prior icon token |
| Item (Small) | default / hover / press / selected / focus-visible | same semantic mapping as Large with Small typography | Small selected uses same bottom inset | per row | per row |
| Item + menu open (not selected) | show-dropdown | `var(--color-background-brand-lighter)` | **no underline** | **`var(--color-text-neutral-strong)`** | **`var(--color-icon-neutral-strong)`** |
| Menu option row | default / hover / selected | per Synapse dropdown-single-select | per Synapse dropdown-single-select | per dropdown contract | — |
| Submenu parent row | default / hover | per dropdown contract | — | per dropdown contract | trailing chevron per IDS flip rules |

## States (Dark Theme)

Dark theme uses the same semantic tokens as **States (Light Theme)**. Resolved values for `[data-theme="dark"]` / Synapse dark theme live in `components/synapse-theme.css`.

## Interactions

Inherit IDS [`main-menu-top`](../ids/main-menu-top/design-spec.md) **Interactions** (single active top item, dropdown open/underline rules, submenu flip, keyboard model).

Synapse-specific visual cues:

- **Hover** and **menu-open (not selected)** keep **neutral-strong** label/icon (do not promote to brand-strong until press or selection).
- **Press** and **selected** use brand-strong text/icon with IDS underline rules for selected.

### Accessibility

- Root: `<nav aria-label="Main menu top">` (or host `ariaLabel`).
- Items: `<button type="button">`; `aria-current="page"` when selected.
- Focus-visible: `var(--color-border-brand-base)` outline per Figma focus variants (`12016:228123`, `12016:228243`).

## Composition & API (runtime)

Inherit IDS **Composition & API** from [`components/ids/main-menu-top/design-spec.md`](../ids/main-menu-top/design-spec.md).

Types: `MainMenuTopProps`, `MainMenuTopItem`, `MainMenuTopMenuNode`, `MainMenuTopLink`, `MainMenuTopSelectDetail` — exported from `MainMenuTop.tsx` / `MainMenuTop.types.ts`.

| Prop / event | Contract |
|---|---|
| `items` / composable children | Same as IDS |
| `selectedId` / `defaultSelectedId` | Single active top item |
| `size` | `Large` \| `Small` |
| `onMenuItemSelect` | Emits `{ id, name, selected, link?, menuOptionId? }` |
| `menuOptions` | Leaf/group/submenu tree per IDS |
| `ariaLabel` | Default `"Main menu top"` |

### Spec Accurate Design story defaults (Synapse parity)

When authoring **`Spec Generated/Synapse/Main Menu Top` → `Spec Accurate Design`**:

| Contract field | Value |
|---|---|
| Figma node | `10189:30280` |
| Theme | `components/synapse-theme.css` |
| Size | `Large` |
| Item count | 8 |
| Label | `"Menu Option"` |
| Icon | `home` (18×18) |
| Chevron | `chev-down-thick` on every item (`dropdown: true`) |
| Functional menu | none (`menuOptions` omitted) |
| Selection | `defaultSelectedId: "top-2"` |
| Typography | weight **400** on labels |

## Codegen Contract (Framework-Agnostic Blueprint)

### Deterministic structure

Emit **`MainMenuTopRoot`** → **`MainMenuTopBar`** → repeat **`MainMenuTopItem`** in **Anatomy** order.

### Variant matrix

| size | dropdown | icon | Notes |
| --- | --- | --- | --- |
| Large | true | true | Synapse hover uses neutral-strong text |
| Large | false | true | selected underline unchanged |
| Small | * | * | Body 2 + same state tokens |

### Per-slot style contract

- Apply **Layout & Measurements** and **States**; Synapse hover/menu-open rows **must not** use brand-strong text/icon.
- Label `font-weight: 400` unless theme maps Body 1/2 to regular globally.

### Behavior contract

Inherit IDS behavior contract (single active item, dropdown center-align, submenu flip, keyboard). Dropdown panels use Synapse **`--dropdown-menu-radius`**.

### Accessibility contract

See **Interactions → Accessibility**; full keyboard navigation required.

### Asset resolution + bundling contract

Icons via shared Icon primitive / `assets/icons/<slug>.svg`. Token-only colors.

### Fallback/error rules

Inherit IDS fallback rules (duplicate `id`, unknown `size` → `Large`, chevron-only when `dropdown` without `menuOptions`, etc.).

### Validation checklist

- [x] IDS baseline linked; shared `MainMenuTop` implementation
- [x] Synapse hover/menu-open neutral text verified (`11099:56587`)
- [x] Selected underline + brand-strong text (`11099:56577`)
- [x] Press brand-light + brand-strong (`11393:103109`)
- [x] Spec-accurate assembly `10189:30280`
- [x] Element set `11099:56576` variant axes documented
- [x] Dropdown sample `43603:179106` + Synapse dropdown contract linked
- [x] Programme deltas table complete
- [x] Figma REST evidence logged in Metadata + Source Mapping
- [x] Codegen Contract + validation checklist present
- [x] Synapse Storybook `Spec Generated/Synapse/Main Menu Top` → `Spec Accurate Design`

## Source Mapping

| Role | Figma node | URL |
| --- | --- | --- |
| Documentation board | `11067:54522` | https://www.figma.com/design/Td1bnsvRj1PCGs9RVJkIvJ/Synapse-Hi-Fi-components?node-id=11067-54522&m=dev |
| Main assembly | `10189:30280` | https://www.figma.com/design/Td1bnsvRj1PCGs9RVJkIvJ/Synapse-Hi-Fi-components?node-id=10189-30280&m=dev |
| Primary element set | `11099:56576` | https://www.figma.com/design/Td1bnsvRj1PCGs9RVJkIvJ/Synapse-Hi-Fi-components?node-id=11099-56576&m=dev |
| Default (Large) | `11099:56597` | variant |
| Hover (Large) | `11099:56587` | variant |
| Selected (Large) | `11099:56577` | variant |
| Press (Large) | `11393:103109` | variant |
| Default-Focus (Large) | `12016:228123` | variant |
| Selected-Focus (Large) | `12016:228243` | variant |
| Masthead + bar usage | `42820:100757` | composed frame |
| Dropdown menu sample | `43603:179106` | menu panel |
| IDS baseline | `10189:30280` (IDS file) | `components/ids/main-menu-top/design-spec.md` |

- **IDS dropdown reference (behavior):** `components/ids/main-menu-top/design-spec.md` use cases `42136:57443`
- **Synapse dropdown programme spec:** `components/synapse/dropdown-single-select/design-spec.md`
- **Component map:** `data/synapse-component-figma-map.json` → `Main Menu/Top`
- **Evidence:** Figma REST API on `11067:54522`, `10189:30280`, `11099:56576`, `11099:56587`, `11099:56577`, `11393:103109` (2026-06-16)
