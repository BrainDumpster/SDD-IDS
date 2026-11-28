# Main Menu Top Design Spec

## Metadata
- **Storybook path:** `storybook-generated/ids/src/components/MainMenuTop.stories.tsx`
- **Deterministic generator:** `generation/deterministic_storybook/ids/main_menu_top.py`
- **Component:** Main Menu Top
- **Design system:** IDS
- **Category:** Navigation
- **Spec path:** `components/ids/main-menu-top/design-spec.md`
- **Description:** Horizontal primary top navigation bar with icon+label menu options, IDS single-select dropdown menus, nested submenus with viewport-aware flip, and selected underline emphasis.
- **Version:** 1.4.0
- **Status:** active
- **Created:** 2026-05-20
- **Updated:** 2026-11-26
- **Use-case Figma URL:** https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=42136-57443&m=dev
- **Use-case node id:** `42136:57443` (`Content` — masthead + main menu dropdown scenarios)
- **Storybook examples requested:** yes
- **Generated Storybook:** `storybook/src/components/MainMenuTop.stories.tsx` (title **`Spec Generated/IDS/Main Menu Top`**, primary story **`Spec Accurate Design`**)
- **Implementation reference:** `storybook/src/components/MainMenuTop.tsx`, `storybook/src/components/MainMenuTop.module.css`
- **Primary Figma URL:** https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=10189-30280&m=dev
- **Primary node id:** `10189:30280` (`MainMenu-Top-Main`)
- **Element node ids:** `11099:56576` (`.MainMenu-Top-Element-Primary`), `51176:249376` (`.MainMenu-Elements-Dropdown`), `51176:243662` (`.MainMenu-Elements-Dropdown-Items`), `51176:243930` (`.MainMenu-Options`), `51176:242975` (`.border for focus`)
- **Element links verified at:** 2026-11-26
- **Figma file key:** `0bHk3XhrjFhowgFkz9yLr4`
- **Verification method:** Figma MCP (`get_design_context`, `get_metadata`)
- **Verified at:** 2026-05-20

## Anatomy

Deterministic slot order for **`MainMenuTopRoot`** (`nav`, horizontal):

1. **`MainMenuTopBar`** — full-width bar on `var(--color-background-surface-primary)`
2. Repeat **`MainMenuTopItem`** (`.MainMenu-Top-Element-Primary`) per option:
   - **`ItemContainer`** — icon + label cluster (`gap: var(--spacing-space-16)`)
   - **`ItemIcon`** — 18×18 (`assets/icons/<slug>.svg`; Figma sample uses `home`)
   - **`ItemLabel`** — Body 1 (Large) or Body 2 (Small)
   - **`ItemChevron`** — optional 16×16 `chev-down-thick` when `dropdown === true`
3. **`MainMenuTopDropdown`** (per item with `menuOptions`) — anchored below trigger; reuses IDS **Dropdown: Single-select** menu contract (`components/ids/dropdown-single-select/design-spec.md`, Figma `12579:19717` menu + `12380:16525` options)
4. **`MainMenuTopSubmenu`** (optional nested row) — flyout beside parent option; chevron `chev-right` (opens right) or `chev-left` (opens left when viewport space is insufficient), `16×16`, always `var(--color-icon-brand-base)`

## Layout & Measurements
- **Runtime width:** `width: 100%`, `box-sizing: border-box`; Figma sample bar `1496×40` (reference only).
- **Bar:** `display: flex`; `align-items: center`; `min-height: 40px`; `gap: var(--spacing-space-16)` between items; horizontal padding `var(--padding-padding-12)`.
- **Item (Large):** fixed height `40px`; `align-items: center`; `justify-content: center`; padding `var(--padding-padding-8)` block / `var(--padding-padding-12)` inline; inner cluster gap `var(--spacing-space-16)` between icon and label; gap `var(--spacing-space-8)` between label and chevron; icon + label vertically centered as a row.
- **Selected underline:** `inset 0 -2px 0 var(--color-border-brand-strong)` (box-shadow) inside the 40px hit target so content stays vertically centered (not an external `border-bottom` that shifts layout).
- **Item (Small):** fixed height `40px` (same hit target as Large — differs only in padding and typography); `align-items: center`; padding `var(--padding-padding-10)` block / `var(--padding-padding-8)` inline; typography Body 2.
- **Icon:** `18×18`; **chevron:** `16×16`.
- **Selected indicator:** inset `2px` bottom `var(--color-border-brand-strong)` via `box-shadow` on the item hit target (Large and Small).
- **Focus ring (Default-Focus / Selected-Focus):** `var(--border-width-border-1)` (1px) outline `var(--color-border-brand-base)`, `border-radius: var(--corner-radius-radius-4)`; height `40px` sample on Large item. **Selected-Focus (Figma `12016:228243`):** the 1px ring replaces the selected underline — suppress the inset `2px` bottom shadow while `:focus-visible`; brand-strong text/icon remain.
- **Dropdown panel (`.Menu-Single-Select-DD`):** min-width **181px** (Figma sample); `sideOffset` **1px** below trigger; **horizontal alignment:** dropdown left edge aligned to the triggering top-menu item (`align: start` on positioner); when it would overflow the viewport edge (e.g., right-most item), it flips to right-aligned (`collisionAvoidance.align: flip`) — nested submenus follow the same edge rule and open to the **left** in that case; Shadow 1 elevation stack (same as dropdown-single-select `MenuPopup`).
- **Option row:** min-height **40px**; padding `var(--padding-padding-10)` × `var(--padding-padding-16)`; Body 2 typography — per `dropdown-single-select` option contract.
- **Submenu flyout:** same width/token rules as parent menu; **-1px** gap from parent panel (`MAIN_MENU_TOP_SUBMENU_SIDE_OFFSET` — flyout edge overlaps under the parent menu border); flyout stacking is **behind** the parent menu so its shadow/border render underneath; default opens **`right`**; flips to **`left`** when viewport space is insufficient. Chevron on submenu row must match **rendered** side (`chev-right` / `chev-left`, always `var(--color-icon-brand-base)`) by reading positioner `data-side` after flip (not prediction-only).
- **Masthead menu panel (Figma `42136:57466`):** **`border-radius: 0`**; border `var(--color-border-gray-neutral-base)`; dual **shadow-4** stack; **inner padding `0`**; option list gap `0`; menu border draws above option rows and **clips the first/last option edge lines**; option rows `padding: 10px 16px` (no rounded corners).
- **Container:** `width: 100%`. Bar is always a **single line** — `flex-wrap: nowrap`; items never wrap to a second row. On overflow the bar clips (`overflow-x: auto`) and scrolls horizontally with the scrollbar **hidden** (`scrollbar-width: none`, `::-webkit-scrollbar` suppressed) — applies at all viewport widths, not just narrow.

## Tokens
### Typography
- **Large label:** Body 1 regular — `var(--font-size-body-1)` / `var(--line-height-body-1, 24px)`, weight 400.
- **Small label:** Body 2 regular — `var(--font-size-body-2)` / `var(--line-height-body-2, 20px)`, weight 400.
- **Small slots:** item cluster, label, and chevron slot heights `20px` (vs `24px` on Large); icon and chevron glyph sizes unchanged (`18×18` / `16×16`).

### Surfaces, borders, icons
- **Bar background:** `var(--color-background-surface-primary)`
- **Item default text:** `var(--color-text-gray-neutral-strong)`
- **Item default icon:** `var(--color-icon-gray-neutral-strong)` (Figma neutral icon on default row)
- **Hover / press background:** `var(--color-background-brand-lighter-slate)` / `var(--color-background-brand-light-slate)`
- **Hover / press / selected text:** `var(--color-text-brand-strong)`
- **Hover / press / selected icon:** `var(--color-icon-brand-strong)` (selected may use `var(--color-icon-brand-base)` per product parity)
- **Selected underline:** `var(--color-border-brand-strong)`
- **Focus outline:** `var(--color-border-brand-base)`
- **Chevron:** `var(--color-icon-brand-base)` in all states
- **Dropdown menu** (masthead / main-menu-top panel): `var(--color-background-surface-component)`, border `var(--color-border-gray-neutral-base)`, shadow-4 stack — option states per `.MainMenu-Options` (`51176:243930`): hover `var(--color-background-brand-lighter-slate)` + brand inset borders (text stays `var(--color-text-gray-neutral)`); press `var(--color-background-brand-light-slate)` + `var(--color-text-brand-strong)`; selected `var(--color-background-brand-lighter-slate)` + brand inset borders + `var(--color-text-brand-strong)`; disabled `var(--color-background-gray-lighter)` + `var(--color-border-gray-disabled)` edges + `var(--color-text-gray-disabled)`; focus `1px` `var(--color-border-brand-base)` inset ring, `radius-4`, surface background; option weight 400

## States (Light Theme)
| Element | State | Background | Border / indicator | Text | Icon |
| --- | --- | --- | --- | --- | --- |
| Bar | default | `var(--color-background-surface-primary)` | — | — | — |
| Item (Large) | default | transparent | none | `var(--color-text-gray-neutral-strong)` | `var(--color-icon-gray-neutral-strong)` |
| Item (Large) | hover | `var(--color-background-brand-lighter-slate)` | none | `var(--color-text-brand-strong)` | `var(--color-icon-brand-strong)` |
| Item (Large) | press | `var(--color-background-brand-light-slate)` | none | `var(--color-text-brand-strong)` | `var(--color-icon-brand-strong)` |
| Item (Large) | selected | transparent | inset `2px` bottom `var(--color-border-brand-strong)` (box-shadow) | `var(--color-text-brand-strong)` | `var(--color-icon-brand-strong)` |
| Item (Large) | focus-visible | transparent | `var(--color-border-brand-base)` outline (`var(--border-width-border-1)`, 1px) | prior text token | prior icon token |
| Item (Large) | selected + focus-visible | transparent | 1px `var(--color-border-brand-base)` ring only — selected underline suppressed (Figma `12016:228243`) | `var(--color-text-brand-strong)` | `var(--color-icon-brand-strong)` |
| Item (Small) | default / hover / press / selected / focus-visible | same semantic mapping as Large with Small typography tokens | Small selected uses same bottom border | per row | per row |
| Item + menu open (not selected) | show-dropdown | `var(--color-background-brand-lighter-slate)` | **no underline** | `var(--color-text-gray-neutral-strong)` | `var(--color-icon-gray-neutral-strong)` |
| Item selected | selected | transparent | `2px` bottom `var(--color-border-brand-strong)` | `var(--color-text-brand-strong)` | `var(--color-icon-brand-strong)` |
| Menu option row | default / hover / press / selected / disabled / focus | per `.MainMenu-Options` (`51176:243930`) | per `.MainMenu-Options` | `var(--color-text-gray-neutral)`; `var(--color-text-brand-strong)` on press/selected; `var(--color-text-gray-disabled)` on disabled | weight 400 |
| Submenu parent row | default / hover / flyout open | per `.MainMenu-Options` | — | `var(--color-text-gray-neutral)` | trailing chevron `chev-right`/`chev-left` always `var(--color-icon-brand-base)` |

## States (Dark Theme)

Dark theme uses the same semantic tokens as **States (Light Theme)**. Resolved values for `[data-theme="dark"]` / `.ids-theme-dark` (and program overlays) live in theme CSS:

- `components/ids-theme.css`
- `components/<program>-theme.css` when a program overlays IDS (for example `components/dap-theme.css`)

Duplicate the full state matrix in this section only when a dark row genuinely uses different `var(--...)` references than the corresponding light row.

*(When Light and Dark tables would list identical `var(--...)` cells, keep the matrix under **States (Light Theme)** only and use this pointer section instead of a second table.)*

## Interactions
- **Plain item (no `menuOptions`):** click sets `selectedId`; emits **`onMenuItemSelect`**.
- **Single selected top item:** Only one top item may hold committed selection at a time. Opening a dropdown does **not** clear the previous selection — the previously selected item keeps its underline while another item's menu is open; selection is replaced only when a menu option is chosen or a plain item is clicked.
- **Item with `menuOptions`:** **mouse release** (`click`, not `mousedown`) or `Enter`/`Space` opens the dropdown menu (it does **not** select the top item). While open without a chosen option, the item shows the menu-open fill (`var(--color-background-brand-lighter-slate)`), **no underline**. Opening a different dropdown leaves the prior `selectedId` and its underline intact; it is replaced only when an option is chosen or a plain item is clicked.
- **Menu option select:** leaf option closes the menu, sets `selectedId` to the parent nav item, and emits **`onMenuItemSelect`** with `menuOptionId` — the top element then shows the **selected** state (underline + brand-strong icon/label), which persists after the menu closes.
- **Submenu row:** hover or keyboard opens nested panel; chevron indicates predicted side (`chev-right` → opens right, `chev-left` → opens left; always `var(--color-icon-brand-base)`).
- **Menu persistence:** dropdown menus and nested flyouts stay open when the pointer leaves (hover-out is ignored) — they close only on outside press, `Escape`, or option select. Position recomputed on open, resize, and scroll; positioning engine must **flip** side when viewport space is insufficient (`42136:57471` Jobs/right-edge → left, `42136:57503` Storage/center → right).
- **Dropdown contract:** option list styling and state matrix follow **`.MainMenu-Options` (`51176:243930`)** — default/hover/press/selected/disabled/focus per Tokens; option rows min-height `40px`. Radio rows in Figma samples are hidden in masthead menus — omit unless product enables `showRadio`.
- **Keyboard (reference implementation):**
  - Tab into bar → ArrowLeft/ArrowRight move focus across items; Home/End first/last.
  - Enter/Space on plain item: select + emit.
  - Enter/Space on menu item: open/close menu; ArrowDown into menu; ArrowRight opens submenu; ArrowLeft closes submenu; Escape closes menus.

### Accessibility
- Root: `<nav aria-label="Main menu top">` with `role` implicit on `nav`.
- Items: `<button type="button">` with `aria-current="page"` when selected.
- Focus-visible: `var(--color-border-brand-base)` outline per Figma focus variants.
- Optional `tooltip` on item when label truncated.

### Behavior & guidelines
- Use for horizontal primary navigation in application header / masthead.
- Keep item order stable; selection is mutually exclusive (one `selectedId`).
- Do not hardcode hex literals — use tokens above.

## Composition & API (runtime)

### Variants (Figma `.MainMenu-Top-Element-Primary`)

| Axis | Values |
| --- | --- |
| `size` | `Large` (default) · `Small` |
| `state` | `Default` · `Hover` · `Press` · `Selected` · `Default-Focus` · `Selected-Focus` |
| `dropdown` | `true` · `false` |
| `icon` | `true` · `false` |

### Composable structure (manual)

```tsx
<MainMenuTop>
  <MainMenuTop.Item id="storage" name="Storage" iconName="storage-volume" dropdown>
    <MainMenuTop.Menu>
      <MainMenuTop.MenuItem id="containers" label="Storage Containers" />
      <MainMenuTop.MenuGroup label="Management">
        <MainMenuTop.MenuItem id="volumes" label="Volumes" />
        <MainMenuTop.Submenu id="nested" label="Option">
          <MainMenuTop.MenuItem id="sub-a" label="Sub Option A" />
        </MainMenuTop.Submenu>
      </MainMenuTop.MenuGroup>
    </MainMenuTop.Menu>
  </MainMenuTop.Item>
</MainMenuTop>
```

Hierarchy: **`Item`** → optional **`Menu`** → **`MenuItem` | `MenuGroup` | `Submenu`** (nested **`MenuItem`** under **`Submenu`**).

### Data model

```ts
type MainMenuTopLink =
  | { type: "href"; href: string; target?: "_self" | "_blank"; rel?: string }
  | { type: "routerLink"; routerLink: string | readonly string[]; queryParams?: Record<string, unknown> }
  | { type: "action" };

type MainMenuTopMenuNode =
  | { kind?: "item"; id: string; label: string; disabled?: boolean }
  | { kind: "group"; id?: string; label: string; children: MainMenuTopMenuNode[] }
  | { kind: "submenu"; id: string; label: string; disabled?: boolean; children: MainMenuTopMenuNode[] };

/** @deprecated Alias — use `MainMenuTopMenuNode[]` on `menuOptions`. */
interface MainMenuTopMenuOption {
  id: string;
  label: string;
  disabled?: boolean;
  kind?: "item" | "group" | "submenu";
  children?: MainMenuTopMenuOption[];
}

interface MainMenuTopItem {
  id: string;
  name: string;
  iconName?: string;
  dropdown?: boolean;
  showIcon?: boolean;
  tooltip?: string;
  link?: MainMenuTopLink;
  menuOptions?: MainMenuTopMenuOption[];
}

interface MainMenuTopProps {
  /** Data-driven API */
  items?: MainMenuTopItem[];
  /** Composable API: `MainMenuTop.Item` + optional `MainMenuTop.Menu` children */
  children?: ReactNode;
  selectedId?: string;
  defaultSelectedId?: string;
  size?: "Large" | "Small";
  className?: string;
  onMenuItemSelect?: (detail: {
    id: string;
    name: string;
    selected: boolean;
    link?: MainMenuTopLink;
    menuOptionId?: string;
  }) => void;
  ariaLabel?: string;
}
```

### Spec Accurate Design story defaults (codegen parity)

Story: **`Spec Generated/IDS/Main Menu Top` → `Spec Accurate Design`** (`storybook/src/components/MainMenuTop.stories.tsx`).

| Contract field | Value |
| --- | --- |
| Figma node | `10189:30280` (`MainMenu-Top-Main`, 1496×40 sample) |
| Bar surface | `var(--color-background-surface-primary)` |
| Size | `Large` |
| Item count | 8 |
| Item label | `"Menu Option"` |
| Icon slug | `home` (18×18) |
| Chevron | `chev-down-thick` (16×16), `dropdown: true` on every item |
| Functional menu | **none** (`menuOptions` omitted — chevron affordance only for this frame) |
| Selection | `defaultSelectedId: "top-2"` (second item underline — Figma selected variant) |
| Frame | full width, `max-width: 1496px`, `padding: 16px` |
| Theme | `components/ids-theme.css` only |

Dropdown/submenu behavior is validated in separate stories (`42136:57443` use cases), not in **Spec Accurate Design**.

## Codegen Contract (Framework-Agnostic Blueprint)

### Deterministic structure
Emit **`MainMenuTopRoot`** (`nav`) → **`MainMenuTopBar`** → repeat **`MainMenuTopItem`** (`button`) with slots in **Anatomy** order.

### Variant matrix
| size | dropdown | icon | Selected UI |
| --- | --- | --- | --- |
| Large | true | true | bottom border `var(--color-border-brand-strong)` |
| Large | false | true | same |
| Small | * | * | same with Body 2 tokens |

### Per-slot style contract
- Apply **Layout & Measurements** and **States** only.
- Icons: `18×18` leading, `chev-down-thick` `16×16` trailing when `dropdown`.

### Behavior contract
- **Single selected top item:** only one committed `selectedId` at a time; a new selection (option select or plain-item click) replaces the prior item.
- **Plain item** (no `menuOptions`): click sets `selectedId` and underline persists until another item is selected.
- **Menu item** (`menuOptions` present): mouse release (`click`, `mousedown` activation suppressed) or `Enter`/`Space` opens the dropdown without changing `selectedId`; the item shows menu-open fill unless it is already the selected item; underline persists on the committed item until an option is chosen.
- **Menu persistence:** open dropdowns and flyouts ignore pointer leave (`trigger-hover` close suppressed); they close only on outside press, `Escape`, or option select.
- **Dropdown panel:** horizontally **left-aligned** to triggering top-menu item (`align: start`); flips to right-aligned (`align: end`) when the panel would overflow the viewport edge. Nested submenus follow the same rule — when the parent panel is right-aligned (right-most item), the flyout opens to the **left** (`51176:249377`).
- **Menu option select:** sets parent `selectedId`, emits `menuOptionId`, closes dropdown.
- **Submenu:** parent row keeps active styling while flyout is open (`data-popup-open`); submenu hover must not reset parent row; chevron direction matches rendered flyout side (`left`/`right`, including `inline-start`/`inline-end`).
- Submenu placement: prefer `right`; flip `left` when viewport insufficient; `collisionAvoidance.side: flip` required.

### Accessibility contract
- See **Interactions → Accessibility**; keyboard navigation required for interactive bars.

### Asset resolution + bundling contract
- Icons via shared Icon primitive / `assets/icons/<slug>.svg`.
- No inline hex in generated CSS.

### Fallback/error rules
- Duplicate `id` → validation error at boundary.
- Missing `name` → use `id` as accessible name.
- Unknown `size` → `Large`.
- `dropdown: true` without `menuOptions` → chevron affordance only (no panel).
- `menuOptions` with `dropdown: false` (or unset) → `dropdown` flag wins: renders as a plain item — no chevron, no menu; `menuOptions` ignored.

### Validation checklist
- [x] Bar `surface-1` background and `16px` inter-item gap (`10189:30280`)
- [x] Large item padding 8/12 and 40px min-height
- [x] Selected item uses bottom border `var(--color-border-brand-strong)` (plain items + menu-open state)
- [x] Hover/press use brand-lighter / brand-light fills
- [x] Icon 18px + chevron 16px slugs documented
- [x] Token-only colors in reference implementation
- [x] **Spec Accurate Design** story title/path (`Spec Generated/IDS/Main Menu Top`)
- [x] Spec Accurate args: 8 items, `home`, `Menu Option`, `defaultSelectedId: top-2`, Large, no `menuOptions`
- [x] Figma evidence `10189:30280`, `11099:56576`, `51176:249376`, `51176:243662`, `51176:243930`, `51176:242975` in Metadata/Source Mapping
- [x] Dropdown use cases `42136:57443` (separate stories: Not Selected, Selected Open, Submenu L/R)
- [x] Masthead menu panel: `border-radius: 0`, `border-accessible`, shadow-4
- [x] Dropdown left-aligned to top-menu trigger; flips to right-aligned at viewport edge
- [x] Single selected top item (open menu does not steal selection) + submenu parent row frozen while flyout open
- [x] Bar/items `align-items: center`; icon + label vertically centered in 40px row
- [x] **Status:** `active`
- [x] Dark-theme reference story (`Dark Theme`)
- [x] Keyboard: Arrow/Home/End/Escape documented + implemented in reference component

## Storybook proof (reference implementation)

| Story | Figma / purpose |
| --- | --- |
| **Spec Accurate Design** | `10189:30280` — bar only, chevron affordance, second item selected |
| Dropdown Not Selected | `42136:57463` |
| Dropdown Selected Open | `42136:57467` |
| Submenu Opens Right | `42136:57503` |
| Submenu Opens Left | `42136:57471` |
| Composable Structure | Manual `Item` / `Menu` / `Group` / `Submenu` hierarchy |
| **Sizes** (Large + Small rows) | `11099:56576` — `Size=Large` / `Size=Small` element variants |
| Dark Theme | `[data-theme="dark"]` on `ids-theme.css` |

Codegen consumers must read this spec + `components/ids-theme.css`; keep `storybook/src/components/MainMenuTop*.tsx` aligned when drift is found.

## Source Mapping
| Role | Figma node | URL |
| --- | --- | --- |
| Main assembly | `10189:30280` | https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=10189-30280&m=dev |
| Primary element set | `11099:56576` | https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=11099-56576&m=dev |
| Dropdown element set | `51176:249376` | https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=51176-249376&m=dev |
| Dropdown item types | `51176:243662` | https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=51176-243662&m=dev |
| Menu option states | `51176:243930` | https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=51176-243930&m=dev |
| Focus border reference | `51176:242975` | https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=51176-242975&m=dev |
| Default item (Large) | `11099:56597` | (variant) |
| Selected item (Large) | `11099:56577` | (variant) |
| Hover item (Large) | `11099:56587` | (variant) |
| Press item (Large) | `11393:103109` | (variant) |
| Default-Focus (Large) | `12016:228123` | (variant) |
| Selected-Focus (Large) | `12016:228243` | (variant) |
| Masthead + menu use cases | `42136:57443` | https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=42136-57443&m=dev |
| Not selected + menu open | `42136:57463` | child of `42136:57443` |
| Selected + menu open | `42136:57467` | child of `42136:57443` |
| Submenu opens left (right-edge) | `42136:57471` | `Secondary Options - Left` |
| Submenu opens right (center) | `42136:57503` | `Secondary Options - Right` |
| Menu panel | `12579:19717` | dropdown-single-select menu elements |
| Menu options | `12380:16525` | dropdown-single-select option rows |

- **Dropdown dependency:** `components/ids/dropdown-single-select/design-spec.md`
- **Component map:** `data/component-figma-map.json` → `Main Menu/Top` (Navigation)
- **Intake session:** design-spec intake wizard, confirmed 2026-05-20
- **Evidence:** Figma MCP `get_metadata` on `10189:30280`, `11099:56576`, `51176:249376`, `51176:243662`, `51176:243930`, `51176:242975` (2026-11-26); prior MCP verification on `42136:57443` (2026-05-20)
