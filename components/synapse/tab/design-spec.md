# Tab Design Spec

## IDS baseline (layout, flow, contracts)

Synapse **Tab** shares the IDS **Tab** family name and high-level tablist semantics (one active item, keyboard navigation, optional overflow + add-tab). Synapse implements the **Nav Tab** / **Tab-Single** document-tab pattern (closable workspace tabs), not the IDS primary/secondary content-tab indicator pattern.

- **IDS source of truth:** [`components/ids/tab/design-spec.md`](../ids/tab/design-spec.md)
- **Base UI mapping:** `data/synapse-baseui-mapping.json` → `tabs` (`@base-ui-components/react/tabs`)
- **Overflow menu popup:** inherits [`components/synapse/dropdown-combo-box/design-spec.md`](../dropdown-combo-box/design-spec.md) detached action menu (`53325:280088`) when overflow list opens

**Scope of live Synapse verification (this spec):** Components documentation board `47807:3185` — `Tab-Single`, `Close Tab`, `Add Tab`, `Tab Icon`, `Nav Tab Group` (+ usage instances below).

## Metadata
- Component: Tab / Nav Tabs
- Design System: Synapse
- Category: Components / Navigation
- Spec pattern: **ids-fork** (registry: `data/programme-inheritance-registry.json` → `programme: synapse`, `slug: tab`)
- IDS baseline slug: `tab`
- Status: **draft**
- Version: 1.0.0
- Figma file: [Synapse Hi-Fi components](https://www.figma.com/design/Td1bnsvRj1PCGs9RVJkIvJ/Synapse-Hi-Fi-components)
- File key: `Td1bnsvRj1PCGs9RVJkIvJ`
- Documentation board: [47807:3185](https://www.figma.com/design/Td1bnsvRj1PCGs9RVJkIvJ/Synapse-Hi-Fi-components?node-id=47807-3185&m=dev) (`Components` — tab matrix)
- Verification method: Figma MCP (`get_metadata`, `get_design_context`, `get_variable_defs`)
- Last verified: 2026-06-05
- Theme CSS: `components/synapse-theme.css` (not `ids-theme.css`)

### Synapse programme deltas (vs IDS)

| Topic | IDS | Synapse (verified) |
|---|---|---|
| Tab pattern | Primary / secondary **content tabs** with `2px` selected indicator (top/bottom) | **Nav Tab** / **Tab-Single** — document-style tabs with **full-row fill** for selected/hover |
| Tab height | `38px` | **`32px`** (`Tab-Single` symbols `47804:188` … `47804:187`) |
| Tab padding | `9px 24px` | **`var(--padding-padding-6)`** block / **`var(--padding-padding-16)`** left / **`var(--padding-padding-8)`** right |
| Tab width | Content-driven | **`min-width: 80px`**, **`max-width: 250px`** (includes optional close icon) — Figma `50431:32236`, `50454:81701` |
| Label overflow | Clip where unavoidable | **`text-overflow: ellipsis`**, `white-space: nowrap` at max width; tooltip on truncated label (`50454:81963`) |
| Selected chrome | `2px` `var(--color-border-brand-dark)` indicator | **`var(--color-background-brand-light)`** fill + **`var(--color-text-brand-strong)`** (`47804:187`) |
| Unselected chrome | Baseline `var(--color-border-accessible)` | **`var(--color-background-component)`** + **right** divider **`var(--color-border-light)`** (`47804:188`) |
| Group chrome | IDS tab row baseline | **`Nav Tab Group`** bottom border **`var(--color-border-neutral-light)`** + `padding-bottom: var(--padding-padding-1)` (`47835:4947`) |
| Close control | Not in IDS tab item | **`Close Tab`** optional per tab — `12×12` `shape-x` / `ctrl-close-16`, hit padding `var(--padding-padding-4)` (`47803:1728`) |
| Close hover | — | Close hit area **`var(--color-background-n-tabs-x-hover)`** (`47803:1731`, `50431:32236`) |
| Leading icon | Optional badge/icon in IDS API | **Synapse `Tab Icon`** slot — **`16×16`** optional (`52922:70467`: Workspace, Favorite, In Progress) |
| Add tab | Row add affordance | **`Add Tab`** fixed **`36px`** width; `shape-plus` **`12×12`** (`47806:527`) |
| Overflow trigger | `More` label + menu | **`Tab-Single` `Type=Overflow`** — label `More` + caret **`arrow-tri-down-solid` `10×10`** (inherits IDS `TAB_OVERFLOW_MORE_ICON_*` in shared `Tabs.tsx`; Figma layer `47806:460` is named `chev-down`); selected overflow uses **`brand-light`** fill (`50736:251582`) |
| Variant axes | `style`, `transparent`, `primary`/`secondary` | **`State`** × **`Type`**: `Tab` \| `Overflow` \| `Add Tab` × `Default` \| `Hover` \| `Selected` |
| Host background | `transparent` \| `white` | **Component** background on group + tabs |

### Validated Figma nodes

| Scenario | Node | Notes |
|---|---|---|
| Documentation board | `47807:3185` | Full matrix |
| `Tab-Single` set | `47804:189` | State × Type variants |
| Default tab (+ close) | `47804:188` | `114×32` sample |
| Selected tab | `47804:187` | `brand-light` fill |
| Hover tab | `50154:76767` | `brand-lighter` fill |
| Default — no leading icon | `52922:70327` | Label + close only |
| Tab with leading icon | `52920:61689` | `grid-square-9` + label + close |
| Min width `80px` | `50431:32236` | Short label |
| Max width `250px` + ellipsis | `50454:81701` | Long label truncated |
| Truncation tooltip | `50454:81963` | Full label in tooltip |
| `Close Tab` states | `47803:1728` | Default `47803:1729`, Hover `47803:1731` |
| `Add Tab` states | `47806:539` | Default `47806:540`, Hover `47806:542` |
| `Tab Icon` set | `52922:70467` | In Progress, Workspace, Favorite |
| Overflow default | `47806:456` | `More` + chevron |
| Overflow selected | `50736:251582` | `brand-light` fill |
| `Nav Tab Group` set | `47806:420` | `Type=1 Tab` \| `4 Tabs` \| `Overflow` |
| Nav group — 4 tabs + add | `47835:4947` | `492×33` |
| Nav group — overflow + add | `47835:4949` | `1481×33`; overflow `More` before add |
| Nav group — overflow (11 tabs) | `47806:419` | `1275×33`; selected + 10 defaults + `More` + add; dividers on unselected/`More` only |

## Anatomy

Deterministic slot order (Synapse Nav Tab):

1. `NavTabGroupRoot` — horizontal row; bottom border; `width: 100%`
2. `NavTabItem[]` — ordered tab singles (`Type=Tab`)
3. `OverflowTab?` — `Type=Overflow` (`More` + chevron); last visible tab slot before add when overflow enabled
4. `AddTab?` — `Type=Add Tab` (`36px`); trailing control
5. `OverflowMenu?` — detached dropdown for hidden tabs (Synapse dropdown menu contract)
6. Per `NavTabItem`:
   - `TabMain` — padding shell
   - `TabContent` — horizontal cluster
   - `TabIcon?` — `16×16` leading icon
   - `TabLabel` — Body 2 Regular, ellipsis
   - `CloseTab?` — `12×12` close control

## Layout & Measurements

### `Tab-Single` (`Type=Tab`)

| Property | Value |
|---|---|
| Height | **`32px`** (`box-sizing: border-box`) |
| Min width | **`80px`** (incl. close icon when present) |
| Max width | **`250px`** (incl. close icon when present) |
| Padding | `var(--padding-padding-6)` block; `var(--padding-padding-16)` inline-start; `var(--padding-padding-8)` inline-end |
| Internal gap (icon → label → close) | `var(--spacing-space-8)` |
| Right divider | `var(--border-width-border-1)` `var(--color-border-light)` on unselected tabs (`47804:188`, `47806:372`); **none** on selected (`47804:187`, `47806:371`) or add tab (`47806:527`) |
| Label | Body 2 Regular (`var(--font-size-body-2)` / `var(--font-line-height-line-height-20)`); ellipsis at max width |

### `Close Tab`

| Property | Value |
|---|---|
| Icon | **`12×12`** (`shape-x` / `ctrl-close-16`) |
| Hit padding | `var(--padding-padding-4)` |
| Hover background | `var(--color-background-n-tabs-x-hover)` |

### `Tab Icon` (optional leading)

| Property | Value |
|---|---|
| Size | **`16×16`** |
| Sample slugs | `grid-square-9` (Workspace), `star-fav` (Favorite), in-progress icon per `52922:70466` |
| Gap to label | `var(--spacing-space-8)` |

### `Add Tab` (`Type=Add Tab`)

| Property | Value |
|---|---|
| Width | **`36px`** fixed |
| Padding | `var(--padding-padding-8)` inline; `var(--padding-padding-6)` block |
| Icon | `shape-plus` **`12×12`**; control padding `var(--padding-padding-4)` |

### `Overflow` (`Type=Overflow`)

| Property | Value |
|---|---|
| Label | Runtime `moreLabel` (default **`"More"`**) |
| Chevron | `arrow-tri-down-solid` **`10×10`** (`TAB_OVERFLOW_MORE_ICON_*` / `SYNAPSE_TAB_OVERFLOW_MORE_ICON_*`) |
| Gap label → chevron | `var(--spacing-space-8)` |
| Selected overflow | Same fill/text as selected tab (`brand-light` / `brand-strong`) |

### `Nav Tab Group`

| Property | Value |
|---|---|
| Row height | **`33px`** sample (`32px` tab + `1px` bottom border padding) |
| Bottom border | `1px` `var(--color-border-neutral-light)` |
| Bottom padding | `var(--padding-padding-1)` |
| Tab order | Visible tabs → overflow tab (when needed) → add tab |
| Overflow scenario | Hidden tabs collapse into overflow menu; overflow trigger remains in row (`47835:4949`) |

## Tokens

### Tab shell
- `var(--color-background-component)` — default tab + group base
- `var(--color-border-light)` — tab right divider (unselected)
- `var(--color-border-neutral-light)` — group bottom border
- `var(--color-background-brand-light)` — selected tab + selected overflow
- `var(--color-background-brand-lighter)` — hover tab
- `var(--color-background-n-tabs-x-hover)` — close control hover

### Typography
- `var(--font-size-body-2)` / `var(--font-line-height-line-height-20)` — tab label (Regular / 400)
- `var(--color-text-neutral)` — default tab label
- `var(--color-text-brand-strong)` — selected + hover tab label

### Icons
- `var(--color-icon-neutral)` — close default (`Color/Icon/Neutral` on `47804:188`)
- Close / add / overflow caret slugs: `shape-x`, `shape-plus`, `arrow-tri-down-solid` (overflow `10×10`)

### Spacing
- `var(--spacing-space-8)` — icon/label/close gaps
- `var(--padding-padding-4)`, `var(--padding-padding-6)`, `var(--padding-padding-8)`, `var(--padding-padding-16)`

## States (Light Theme)

### `Tab-Single` (`Type=Tab`)

| State | Background | Border | Text / icon |
|---|---|---|---|
| Default | `var(--color-background-component)` | right `var(--color-border-light)` | label `var(--color-text-neutral)`; close `var(--color-icon-neutral)` |
| Hover | `var(--color-background-brand-lighter)` | right `var(--color-border-light)` (unless selected neighbor) | label `var(--color-text-brand-strong)` |
| Selected | `var(--color-background-brand-light)` | no right divider on selected cell | label `var(--color-text-brand-strong)` |
| Close hover (on tab) | close hit `var(--color-background-n-tabs-x-hover)` | — | close icon neutral |

### `Tab-Single` (`Type=Overflow`)

| State | Background | Border | Text / icon |
|---|---|---|---|
| Default | `var(--color-background-component)` | right `var(--color-border-light)` | `More` + chevron `var(--color-text-neutral)` |
| Hover | `var(--color-background-brand-lighter)` | right `var(--color-border-light)` | `var(--color-text-brand-strong)` |
| Selected (menu open / active hidden tab) | `var(--color-background-brand-light)` | — | `var(--color-text-brand-strong)` |

### `Add Tab`

| State | Background | Icon |
|---|---|---|
| Default | `var(--color-background-component)` | `shape-plus` neutral |
| Hover | `var(--color-background-brand-lighter)` | brand-strong |

### `Close Tab` (isolated control)

| State | Background | Icon |
|---|---|---|
| Default | transparent | `var(--color-icon-neutral)` |
| Hover | `var(--color-background-n-tabs-x-hover)` | `var(--color-icon-neutral)` |

## States (Dark Theme)

Dark theme uses the same semantic tokens as **States (Light Theme)**. Resolved values for `[data-theme="dark"]` / Synapse dark scope live in `components/synapse-theme.css` (including `--color-background-n-tabs-x-hover`, `--color-border-light`).

Duplicate the full state matrix in this section only when a dark row genuinely uses different `var(--...)` references than the corresponding light row.

## Interactions

(Inherit IDS overflow/add-tab **behavior** where applicable; Synapse **chrome** from tables above.)

- **Tab select:** click or keyboard activates one tab; emits `onActiveItemChange` / `onTabSelect({ id, label })`.
- **Close tab:** `Close Tab` click removes tab from list; does not activate tab navigation on close button (`event.stopPropagation()`).
- **Add tab:** `Add Tab` appends a new tab; host supplies default label/content via `onAddTab()`.
- **Overflow:** when row width cannot fit all tabs, trailing tabs move to overflow collection; **`More`** trigger stays in row before **`Add Tab`** (`47835:4949`). Selecting hidden tab from menu activates it; overflow trigger label becomes selected tab name; **active tab omitted from menu** (inherit IDS `computeTabOverflowMenuItems` in `component-contracts/ids/tab.contract.ts`).
- **Truncation:** at `max-width: 250px`, label ellipsizes; show tooltip with full label on hover/focus when truncated (`50454:81963`).
- **Keyboard:** `ArrowLeft` / `ArrowRight`, `Home` / `End`, `Enter` / `Space` — inherit IDS tablist pattern.
- **No autosave** on tab switch (inherit IDS).

### Accessibility

- `NavTabGroupRoot`: `role="tablist"`
- `NavTabItem`: `role="tab"`, `aria-selected`, `aria-controls`, stable `id`
- `Close Tab`: `aria-label="Close {tab label}"` button; not confused with tab selection
- `Add Tab`: `aria-label` from `addTabLabel` (default `"Add tab"`)
- `Overflow`: `aria-haspopup="menu"`, `aria-expanded`
- Focus ring: `var(--color-border-brand-base)` (inherit IDS focus contract)

## Composition & API (runtime)

Inherit IDS tab API from [`components/ids/tab/design-spec.md`](../ids/tab/design-spec.md) with Synapse defaults:

| Prop | Synapse default / note |
|---|---|
| `type` | Treat as **`"nav"`** / document tabs; IDS `primary`/`secondary` do not apply |
| `items[].closable` | Default **`true`** for Nav Tab usage |
| `items[].iconSlug` | Optional leading **`16×16`** icon |
| `allowAddTab` | Default **`true`** in Nav Tab scenarios |
| `overflow` | Default **`true`** |
| `moreLabel` | Default **`"More"`** |
| `addTabLabel` | Host-defined (aria only; visual is `+` icon) |

**`items` entry (extended):**

| Field | Type | Notes |
|---|---|---|
| `id` | `string` | Required |
| `label` | `string` | Required; ellipsis at max width |
| `iconSlug` | `string?` | Optional `16×16` leading icon |
| `closable` | `boolean?` | Default `true` |
| `disabled` | `boolean?` | Blocks activation |
| `content` | `ReactNode?` | Panel body (inherit IDS) |

**Width rules (runtime):**

- Apply `min-width: 80px` and `max-width: 250px` on `NavTabItem` outer shell **including** close icon width.
- Label flexes with `min-width: 0` + `text-overflow: ellipsis`.

## Codegen Contract (Framework-Agnostic Blueprint)

### Deterministic structure

1. `NavTabGroupRoot`
2. `NavTabList` (`role="tablist"`)
3. `NavTabItem*` (`Type=Tab`)
4. `OverflowTab?` (`Type=Overflow`)
5. `AddTabTrigger?` (`Type=Add Tab`)
6. `OverflowMenu?` (Synapse dropdown detached menu)
7. `TabPanels` + `ActiveTabPanel` (inherit IDS)

### Variant matrix

| type | state | icon | close | width |
|---|---|---|---|---|
| Tab | default \| hover \| selected | optional | optional | 80–250px |
| Overflow | default \| hover \| selected | arrow-tri-down-solid | — | content-driven |
| Add Tab | default \| hover | plus | — | 36px fixed |

### Per-slot style contract

- Use tokens from **Tokens** and **States**; no hardcoded hex in implementation.
- Selected tab: full `brand-light` fill — **not** IDS `2px` indicator.
- Unselected tabs: right border `border-light` only (no top/bottom indicator).

### Behavior contract

- Exactly one tab active.
- Close removes item; if closed tab was active, activate neighbor per host policy (default: previous tab).
- Overflow menu uses [`dropdown-combo-box`](../dropdown-combo-box/design-spec.md) detached menu styling.
- Overflow slot + menu rules: `component-contracts/ids/tab.contract.ts` (`computeTabOverflowVisibleCount`, `computeTabOverflowMenuItems`).
- Add tab appends item and may auto-select new tab (product-defined; document in host).

### Accessibility contract

See **Interactions → Accessibility**.

### Asset resolution

| Slug | Usage |
|---|---|
| `shape-x` | Close tab |
| `shape-plus` | Add tab |
| `arrow-tri-down-solid` | Overflow caret (`10×10`) |
| `grid-square-9` | Sample workspace icon |
| `star-fav` | Sample favorite icon |
| In-progress slug | Per `52922:70466` |

### Fallback/error rules

- Unknown `type` → `Tab`.
- Missing `activeItemId` → first non-disabled tab.
- Missing `iconSlug` → no leading icon slot.
- `closable: false` → omit `Close Tab` slot.
- Empty `items` → deterministic placeholder tab (inherit IDS).

### Validation checklist

- [x] `Tab-Single` height **32px**; padding `6/16/8`
- [x] Min width **80px**, max width **250px** incl. close
- [x] Selected = `brand-light` fill + `brand-strong` text (not IDS indicator)
- [x] Close hover = `n-tabs-x-hover`
- [x] Nav group bottom border `neutral-light`
- [x] Overflow `More` + `arrow-tri-down-solid` `10×10`; selected overflow `brand-light`
- [x] Active overflow-selected tab omitted from More menu (IDS baseline on `Tabs.tsx`)
- [x] Add tab **36px** + `shape-plus`
- [x] Optional `16×16` tab icon
- [x] Ellipsis + tooltip at max width
- [x] Storybook `Spec Generated/Synapse/Tab` (`storybook-generated/synapse/src/components/Tab.stories.tsx`)
- [x] Shared implementation: `Tabs` + `programme="synapse"` / `SynapseTabs.tsx`

## Source Mapping

- **IDS baseline:** `components/ids/tab/design-spec.md` — `0bHk3XhrjFhowgFkz9yLr4`, node `30681:9530`
- **Synapse board:** `47807:3185`
- **Component map:** `data/synapse-component-figma-map.json` → `Tabs` / `Tab`
- **Programme inheritance:** `data/programme-inheritance-registry.json` → `tab`
- **Registry:** `data/synapse-component-registry.json` → `tabs`
- **Evidence (2026-06-05):** Figma MCP — `get_metadata` on `47807:3185`, `47835:4947`, `47835:4949`, `52922:70327`; `get_design_context` on `47804:188`, `47804:187`, `50154:76767`, `47803:1731`, `47806:527`, `50736:251582`, `50431:32236`, `50454:81701`, `47835:4947`, `47835:4949`; `get_variable_defs` on `47804:188`
