# Anchor Menu Design Spec

## Metadata
- Component: Anchor Menu
- Category: Navigation
- Design System: IDS
- Status: active
- Figma: https://www.figma.com/design/VZJ48bbVYrIynw8DdSukWw/-Exploration-only--IDS-with-variables?node-id=11067-54486&m=dev
- Node ID: `11067:54486`
- File key: `VZJ48bbVYrIynw8DdSukWw`
- Element state matrix: `11955:229729` (`AnchorMenu-Element-Section`)
- Main component set: `11955:229780` (`AnchorMenu-Main`, `# of Sections` 3–16)
- Spec-accurate example: `11955:229709` (`AnchorMenu-Example`; Header layer hidden)
- Verification method: Figma MCP (`get_metadata`, `get_design_context`, `get_variable_defs`)
- Verified at: 2026-08-18
- Storybook examples requested: yes (Angular **Spec Generated/IDS/Anchor Menu**; do not modify existing React stories)

## Anatomy
- **groupRoot** (`AnchorMenuRoot` / `ids-anchor-menu`): `nav` landmark wrapping header, items, and active indicator.
- **header** (`AnchorMenuHeader` / `ids-anchor-menu-header`): optional section heading (Figma Header layer on `11955:229709`; hidden in spec-accurate example).
- **item** (`AnchorMenuItem` / `ids-anchor-menu-item`): one section row (`AnchorMenu-Element-Section`).
- **link**: focusable control inside the item (`a` when `href` is present).
- **activeIndicator** (`AnchorActiveIndicator` / `ids-anchor-active-indicator`): 4px brand left bar aligned to the active item (`get_design_context` Selected `border-l-4` on `11955:229728`).
- Default left rail: 1.2px `var(--color-border-accessible)` on each unselected item (`11955:229730`).
- Focus ring: 2px brand outline on the item (`11955:230551`, `11955:230577`).

## Layout & Measurements
- Standard height: Auto (based on content)
- Header text line box height: `24px` (`Body 1` rhythm)
- Header container vertical padding: `12px` top and `12px` bottom (no horizontal padding); Figma Header frame `175x48` on `11955:229710`
- Item height: `40px` (`var(--scale-40)`); Figma instances on `11955:229709`
- Item width: hug content (`fit-content`)
- Section-item padding: `8px` top/bottom and `24px` left/right (`px-[24px] py-[8px]` on `11955:229729` states)
- Item border radius: `0` (square); `get_variable_defs` on Unselected `11955:229730` has no radius binding
- Focus ring: `2px` `var(--color-border-brand-base)`; radius `4px` (`rounded-[4px]` on `11955:230577` / `11955:230551`); inset `-4px` top/bottom and `-6px` left/right (total item + ring height `48px`)
- Minimum width: `200px`
- Maximum width: `300px`
- Item spacing: `0` (adjacent)
- Spec-accurate sample frame: `175x240` (`11955:229709`) — sample only; runtime uses min/max width above

### Slot geometry (Figma-verified)

| Slot / layer | Property | Token / contract | Figma node | Live evidence |
| --- | --- | --- | --- | --- |
| Item shell (`AnchorMenu-Element-Section`) | height | `40px` / `var(--scale-40)` | `11955:229709` children | `get_metadata` instance height `40` |
| Item shell | padding | `8px 24px` → `var(--padding-padding-8)` / `var(--padding-padding-24)` | `11955:229729` | `get_design_context` `py-[8px] px-[24px]` |
| Item shell | border-radius | `0` (square) | `11955:229730` | `get_variable_defs` — no radius variable; Unselected has no `rounded-*` |
| Unselected left rail | width + color | `1.2px` `var(--color-border-accessible)` | `11955:229730` | `get_design_context` `border-l-[1.2px]`; `get_variable_defs` `--color-border-accessible` |
| Selected / hover left rail | width + color | `4px` `var(--color-border-brand-base)` | `11955:229728`, `11955:229732` | `get_design_context` `border-l-4`; `get_variable_defs` `--color-border-brand-base` |
| Focus ring | border-radius | `4px` / `var(--corner-radius-radius-4)` | `11955:230577` | `get_design_context` `rounded-[4px]`; `get_variable_defs` on this node has no radius variable |
| Focus ring | border | `2px` `var(--color-border-brand-base)` | `11955:230577` | `get_design_context` `border-2` |
| Header | padding + type | `12px` vertical; Body 1 `16/24` | `11955:229710` | `get_metadata` height `48`; text `y=12` height `24` |

**Geometry authoring rules (mandatory):**
- Document **each** interactive shell separately: item row, focus ring, header.
- Values must come from **live Figma** on the cited node (`get_variable_defs` preferred for radius bindings).
- When Figma has no radius binding, record **0px / square** for the item shell.

## Tokens
### Colors
- Brand base: `var(--color-background-controls-brand-base)` = #0672cb
- Neutral text: `var(--color-text-neutral)` = #4d4d4d
- Neutral strong text: `var(--color-text-neutral-strong)` (header)
- Brand strong text: `var(--color-text-brand-strong)` = #055fa9
- Accessible border: `var(--color-border-accessible)` = #757575
- Brand border: `var(--color-border-brand-base)` = #0672cb

### Typography
- Body 1: Roboto Regular 16px/24px — header label and item labels (`get_variable_defs` `Body 1` on `11955:229729`)
- Anchor menu header label uses Body 1 (regular, no all-caps transform) with `var(--color-text-neutral-strong)`.

### Spacing / radius
- `var(--padding-padding-8)`, `var(--padding-padding-12)`, `var(--padding-padding-24)`
- `var(--scale-40)`
- `var(--border-width-border-2)`
- `var(--corner-radius-radius-4)` (focus ring only)

## States (Light Theme)
| Element | Background | Border | Text |
|---|---|---|---|
| Menu Container | transparent | none | `var(--color-text-neutral)` |
| Anchor Item (Default) | transparent | left border `1.2px` `var(--color-border-accessible)` | `var(--color-text-neutral)` |
| Anchor Item (Hover) | transparent | left border `4px` `var(--color-border-brand-base)` | `var(--color-text-neutral)` |
| Anchor Item (Focus-visible) | transparent | `2px` `var(--color-border-brand-base)` focus ring; rail per selection | selected: `var(--color-text-brand-strong)`; else `var(--color-text-neutral)` |
| Anchor Item (Active) | transparent | left border `4px` `var(--color-border-brand-base)` | `var(--color-text-brand-strong)` |

## States (Dark Theme)

Dark theme uses the same semantic tokens as **States (Light Theme)**. Resolved values for `[data-theme="dark"]` / `.ids-theme-dark` (and program overlays) live in theme CSS:

- `components/ids-theme.css`
- `components/<program>-theme.css` when a program overlays IDS (for example `components/dap-theme.css`)

Duplicate the full state matrix in this section only when a dark row genuinely uses different `var(--...)` references than the corresponding light row.

*(When Light and Dark tables would list identical `var(--...)` cells, keep the matrix under **States (Light Theme)** only and use this pointer section instead of a second table.)*

## Interactions
- Click anchor items to scroll to respective sections (`href` starting with `#` uses smooth `scrollIntoView`)
- Hover thickens the left rail to `4px` brand; label stays `var(--color-text-neutral)` (`11955:229732`)
- Focus-visible ring uses brand color for keyboard navigation
- Active item shows persistent `4px` brand rail + `var(--color-text-brand-strong)` (`11955:229728`)
- Keyboard navigation: Arrow Up/Down between items, Enter to activate, Tab through links
- Scroll spy updates the active item from hash targets’ scroll position
### Accessibility
- Focus ring: 2px brand color border, radius `var(--corner-radius-radius-4)`
- Keyboard navigation: Arrow keys, Enter, Tab
- Semantic HTML: `nav` landmark with `aria-label` (default `"On this page"`)
- Current section: `aria-current="page"` on the active link
- Missing/empty `href`: no navigation; `aria-disabled="true"`

### Behavior & guidelines
- Use anchor menu for long-form content navigation
- Match section-element typography and spacing from node `11955:229729`: header uses Body 1 (regular, no text transform) with vertical-only `12px` padding and item rows use `Body 1` (`16/24`) with `8/24` padding and left-border state transitions (`1.2px` default, `4px` hover/active)

## Composition & API (runtime)
Canonical machine-readable mirror: `component-contracts/ids/anchor-menu.contract.ts`.

**Preferred pattern:** projected children — not an `items[]` prop.

```
AnchorMenu [title?, sticky?]
  AnchorMenuHeader [title?]            ← optional
  AnchorMenuItem [label, href, active?]
  AnchorMenuItem …
  AnchorActiveIndicator
```

Angular selectors (`lib/angular/ids/anchor-menu/`): `ids-anchor-menu` → `ids-anchor-menu-header` → `ids-anchor-menu-item` → `ids-anchor-active-indicator`. Import `IDS_ANCHOR_MENU_IMPORTS`.

### Group (`AnchorMenu` / `groupRoot`)
| Prop | Required | Behavior |
|---|---|---|
| `title` | No | `aria-label` on `nav` and header fallback. Default `"On this page"`. |
| `sticky` | No | When true (default), root uses sticky positioning. |
| `onItemClick(href)` / `itemClick` | No | Emits the activated item `href`. |

### Header (`AnchorMenuHeader`)
| Prop | Required | Behavior |
|---|---|---|
| `title` | No | Visible heading. Falls back to group `title`. Omit this child to hide the header (spec-accurate Figma example). |

### Item (`AnchorMenuItem`)
| Prop | Required | Behavior |
|---|---|---|
| `label` | Yes | Visible Body 1 label. |
| `href` | Yes | Navigation target. Empty/missing disables navigation. |
| `active` | No | When true, marks the initial selected item (single active). |

### Active indicator (`AnchorActiveIndicator`)
No props. Positions a `4px` `var(--color-border-brand-base)` bar at the active item’s offset. Project once after the items.

### Spec Accurate Design story defaults
Figma `11955:229709` (`AnchorMenu-Example`):
- Header omitted (Header layer `11955:229710` hidden)
- Items: Overview (`#overview`, active), Types, Anatomy, Usage Rules, States and Colors, Redlines
- `sticky`: `true`
- `title`: `"On this page"` (aria-label only when header is omitted)

### Legacy aggregate (React Storybook only)
`items: Array<{ label: string; href: string; active?: boolean }>` plus `header?` / `title?` on `storybook/src/components/AnchorMenu.tsx` is a **convenience wrapper**. Do not change those existing React stories. New framework ports must use composition.

### Variants
- **Default**: vertical section list (`AnchorMenu-Main` `# of Sections`)
- **With header**: optional `AnchorMenuHeader` child
- **Sticky**: `sticky` default `true`

## Codegen Contract (Framework-Agnostic Blueprint)
### Deterministic structure
1. `AnchorMenuRoot` (`ids-anchor-menu`)
2. `AnchorMenuHeader?` (`ids-anchor-menu-header`)
3. repeated `AnchorMenuItem` (`ids-anchor-menu-item`)
4. `AnchorActiveIndicator` (`ids-anchor-active-indicator`)

### Variant matrix
- `itemState`: `default | hover | active | focus-visible`
- `withHeader`: header child present | omitted
- `sticky`: `true | false`
- `href`: navigable | missing/empty (disabled navigation)

### Per-slot style contract
- Root: `min-width: 200px`; `max-width: 300px`; `width: fit-content`; background transparent.
- Header: Body 1; `padding: var(--padding-padding-12) 0`; `var(--color-text-neutral-strong)`; no text-transform.
- Item link: height `var(--scale-40)`; `padding: var(--padding-padding-8) var(--padding-padding-24)`; `width: fit-content`; Body 1; square corners.
- Default rail: `border-left: 1.2px solid var(--color-border-accessible)`.
- Hover/active rail: `4px` `var(--color-border-brand-base)` overlay **centered on** the `1.2px` default rail (no layout shift). Hover label stays `var(--color-text-neutral)`; active label `var(--color-text-brand-strong)`.
- Focus-visible: `2px` `var(--color-border-brand-base)` ring, `var(--corner-radius-radius-4)`, inset `-4px -6px`.
- No hardcoded colors in implementation; measurements `1.2px` / `4px` / `200px` / `300px` are Figma/spec literals (no token).

### Behavior contract
- Active item is token-highlighted and left-indicator aligned.
- Click navigates to the corresponding hash/URL; `#` hashes smooth-scroll and update `aria-current`.
- Keyboard: Tab through items; Arrow Up/Down moves focus; Enter activates.
- Scroll spy selects the hash target whose top has crossed the viewport top.

### Accessibility contract
- Root: `nav` + `aria-label`.
- Active link: `aria-current="page"`.
- Empty `href`: `aria-disabled="true"`; not in arrow-key loop.

### Asset resolution + bundling contract
No image or icon assets.

### Fallback/error rules
- Unknown/missing `href` disables navigation for that item.
- Empty item list renders `nav` without crash (header optional).
- Multiple `active` items: first marked item wins for initial selection.

### Validation checklist
- [ ] Hierarchy is `ids-anchor-menu` → optional header → items → `ids-anchor-active-indicator`
- [ ] Default rail `1.2px` accessible; hover/active `4px` brand
- [ ] Hover text stays `var(--color-text-neutral)`
- [ ] Active text `var(--color-text-brand-strong)` + `aria-current="page"`
- [ ] Focus-visible ring `2px` brand, radius `4px`, not clipped
- [ ] Missing `href` does not navigate
- [ ] Empty items do not crash
- [ ] Keyboard Arrows / Enter / Tab
- [ ] Spec Accurate Design matches `11955:229709` (no header, Overview active)
- [ ] Theme via `components/ids-theme.css`

## Source Mapping
- Figma component: Anchor Menu (`11067:54486`)
- Element matrix: `11955:229729`
- Spec-accurate example: `11955:229709`
- Contract: `component-contracts/ids/anchor-menu.contract.ts`
- Angular library: `lib/angular/ids/anchor-menu/`
- Angular Storybook (new): `storybook-angular/src/components/ids-anchor-menu/`
- React reference (unchanged): `storybook/src/components/AnchorMenu.tsx`, `storybook/src/components/IdsAnchorMenu.stories.tsx`
- Component map entry: `data/component-figma-map.json` → component "Anchor Menu" (category "Navigation"; node "11067-54486")
- Last live verification: Figma MCP 2026-08-18 (`get_metadata`, `get_design_context`, `get_variable_defs`)

### Implementation notes
- Group styles live in `ids-anchor-menu.component.scss` (`ViewEncapsulation.None`) covering all slots.
- Item gap is `0`. Hover/active `4px` rail is an overlay **centered on** the `1.2px` track so padding does not shift.
- Framework selectors: `ids-anchor-menu`, `ids-anchor-menu-header`, `ids-anchor-menu-item`, `ids-anchor-active-indicator`.
