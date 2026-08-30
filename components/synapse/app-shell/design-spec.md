# App Shell Design Spec

## IDS baseline (layout, flow, contracts)

Synapse **App Shell** is an **ids-fork** of the IDS **App Shell** orchestration pattern. Page routing, `pages[]` model, menu sync, scroll ownership, composed `headerActions` → Masthead `iconsSlot`, event pass-through, breakpoint menu defaults, and most slot geometry **inherit IDS** unless listed in **Synapse programme deltas** below.

Figma names this pattern **Page Layout** (`47803:1845`); runtime/codegen identifier remains **`AppShell`**.

- **IDS source of truth:** [`components/ids/app-shell/design-spec.md`](../ids/app-shell/design-spec.md) — **load this first for codegen**
- **Theme CSS:** `components/synapse-theme.css` (`[data-design-system="synapse"]`)
- **Reference implementation:** `storybook/src/components/SynapseAppShell.tsx`, `SynapseAppShell.module.css`
- **Storybook:** `storybook-generated/synapse/src/components/AppShell.stories.tsx` — **Spec Accurate Design** (`48463:143536`)

### Composed children (generate from programme specs — do not inline)

| Child | Synapse spec | Component |
|---|---|---|
| Masthead | [`masthead/design-spec.md`](../masthead/design-spec.md) | `SynapseMasthead` |
| Left Nav | [`left-nav/design-spec.md`](../left-nav/design-spec.md) | `SynapseLeftNav` |
| Nav Tabs (optional) | [`tab/design-spec.md`](../tab/design-spec.md) | `SynapseTabs` |
| Body sample (Default) | [`chatarea`](../chatarea/design-spec.md) + [`chatinputbox`](../chatinputbox/design-spec.md) | `ChatArea`, `ChatInputBox` |
| Chat Tracker (optional) | [`tracker/design-spec.md`](../tracker/design-spec.md) | host `aside` / tracker child |
| Footer (optional) | [`footer/design-spec.md`](../footer/design-spec.md) | Synapse Footer |

### Synapse programme deltas (vs IDS)

| Topic | IDS | Synapse |
|---|---|---|
| Figma pattern name | `App Shell` (`43478:90797`) | **`Page Layout`** (`47803:1845`) |
| Programme variant axis | `Screen size` (1920 / 1600 / 1366 / 1024) | **`Options`**: `Default` \| `Custom View` \| `Workspaces` |
| Left navigation child | Main Menu / Left (`278px` expanded) | **Left Nav** (`250px` / `64px`) — [`left-nav` spec](../left-nav/design-spec.md) |
| Masthead child | IDS Masthead | **Synapse Masthead** — Help + launcher + avatar in Default (`48463:143536`) |
| Tab bar below masthead | — | **Optional `tabBarSlot`** + `showTabBar` |
| Page title typography | Header 5 | **Header 6** — `var(--font-size-header-6)` / `var(--font-line-height-line-height-25)` |
| Page header chrome | Title + description | Title + **`pageHeaderActionsSlot`** + border `var(--color-border-neutral-light)` |
| Page description | Standard subtitle on routed pages | **Optional** (`showPageDescription`; off in Default chat layout) |
| Body default sample | Generic / datagrid placeholder | **Chat-first** (`ChatArea` + `ChatInputBox`) |
| Right auxiliary rail | — | **Optional `chatTrackerSlot`** (~`250px`) + `showChatTracker` |
| Footer | Required in IDS Spec Accurate | **Optional** (`showFooter` / `footerSlot`; off in Default) |
| Menu sample labels | Dashboard, Infrastructure, … | Home, Recommendations, Workspace, Favorites, Recent + **New Chat** |
| Breakpoint menu rule | `≥1600px` expanded | **Inherit IDS** until Synapse width variants verified |
| Theme | `components/ids-theme.css` | **`components/synapse-theme.css`** |

### Figma programme variants (live-verified)

| `Options` | Node | Notes |
|---|---|---|
| `Default` | `48463:143536` | Tabs + chat body + Chat Tracker; no footer |
| `Custom View` | `51895:86881` | Alternate body/chrome |
| `Workspaces` | `52908:122635` | Workspace-oriented layout |

## Metadata

| Property | Value |
|---|---|
| Component | App Shell |
| Design system | Synapse |
| Figma display name | Page Layout |
| Category | Patterns and Templates |
| Spec pattern | **ids-fork (override-only + orchestration inserts)** |
| IDS baseline slug | `app-shell` |
| IDS baseline spec | `components/ids/app-shell/design-spec.md` |
| Status | **active** |
| Version | 1.1.0 |
| Theme CSS | `components/synapse-theme.css` |
| Figma file key | `Td1bnsvRj1PCGs9RVJkIvJ` |
| Component set | `Page Layout` (`48463:143535`) |
| Verification method | Figma MCP + IDS baseline spec |
| Last verified | 2026-06-17 |
| Registry | `data/programme-inheritance-registry.json` → `synapse` / `app-shell` |

## Anatomy

Inherit IDS **Anatomy** — [`components/ids/app-shell/design-spec.md`](../ids/app-shell/design-spec.md).

**Synapse optional branches** (insert into IDS slot order):

| Insert after | Slot | Notes |
|---|---|---|
| `AppShellMastheadSlot` | **`AppShellTabBarSlot`** | Nav Tabs row; omit when `showTabBar=false` |
| `AppShellBodyRow` (main column sibling) | **`AppShellChatTrackerSlot`** | ~`250px` right rail; omit when `showChatTracker=false` |

**Synapse child swaps:** `AppShellMastheadSlot` → Synapse Masthead; `AppShellLeftNavSlot` → Synapse Left Nav. `AppShellFooterSlot` optional (IDS: typically on).

**Page header:** add **`pageHeaderActionsSlot`** (trailing icon cluster) inside `AppShellPageHeader`.

## Layout & Measurements

Inherit IDS **Layout & Measurements** — [`ids/app-shell/design-spec.md`](../ids/app-shell/design-spec.md).

Synapse-specific layout:

| Element | Synapse contract |
|---|---|
| `AppShellLeftNavSlot` (expanded) | **`250px`** (not `278px`) — delegate to left-nav spec |
| `AppShellTabBarSlot` | `flex: 0 0 auto`, full width |
| `AppShellChatTrackerSlot` | `flex: 0 0 auto`, width **`250px`**, `min-height: 0` |
| `AppShellBodyRow` (with tracker) | Left Nav + Main Column + Chat Tracker |
| `AppShellPageTitle` | **Header 6** — `var(--font-size-header-6)`, `var(--font-line-height-line-height-25)` |
| `AppShellPageHeader` padding | `var(--padding-padding-8)` block; `var(--padding-padding-24)` left; `var(--padding-padding-16)` right |
| `AppShellPageHeader` border | bottom `var(--border-width-border-default)` solid `var(--color-border-neutral-light)` |
| Default body sample | `ChatArea` + `ChatInputBox` in `AppShellBodyContentSlot` |

## Tokens

Inherit IDS **Tokens** for shared shell slots. Synapse **App Shell–owned** overrides:

| Slot | Tokens |
|---|---|
| `AppShellPageTitle` | `var(--font-size-header-6)`, `var(--font-line-height-line-height-25)`, `var(--color-text-neutral-strong)` |
| `AppShellPageHeader` border | `var(--color-border-neutral-light)` |
| `AppShellRoot` / main column | `var(--color-background-surface-1)` |

Masthead, Left Nav, Tabs, Tracker, Footer tokens: **delegate to child specs**. Resolve colours in `components/synapse-theme.css`.

## States (Light Theme)

Inherit IDS **States (Light Theme)**. Shell chrome has no interactive states; interactive states live in child specs.

Synapse-only static chrome (when not covered by IDS table):

| Slot | Text |
|---|---|
| `AppShellPageTitle` | `var(--color-text-neutral-strong)` via **Header 6** (not Header 5) |

## States (Dark Theme)

Inherit IDS **States (Dark Theme)**. Same semantic tokens as Light where applicable; resolved values in `components/synapse-theme.css`.

## Interactions

Inherit IDS **Interactions**, **Accessibility**, and behavior guidelines — [`ids/app-shell/design-spec.md`](../ids/app-shell/design-spec.md).

**Synapse-only pass-through** (shell does not own child semantics):

- `tabBarSlot` — tab select/add/close owned by Nav Tabs child
- `chatTrackerSlot` — selection/expand owned by Tracker child
- Default chat body — send/scroll owned by Chat Area / Chat Input specs
- Chat Tracker present → `aside` with `aria-label` (e.g. `"Chat tracker"`)

## Composition & API (runtime)

Inherit IDS **Composition & API (runtime)** — [`ids/app-shell/design-spec.md`](../ids/app-shell/design-spec.md) (`pages[]`, routing, `headerActions`, menu props, footer pass-through when enabled).

### Synapse child / prop mapping

| IDS prop | Synapse |
|---|---|
| `menuItems` | → `SynapseLeftNav` (`programme="synapse"`) |
| `headerActions` | → `SynapseMasthead` `iconsSlot` |
| `mastheadProductName` | Default sample: **`"Synapse"`** |
| `footer*` | Only when `showFooter` / `footerSlot` |

### Synapse-only props

| Prop / slot | Type | Default (Spec Accurate) | Contract |
|---|---|---|---|
| `showTabBar` | `boolean` | `true` | Renders `tabBarSlot` |
| `tabBarSlot` | `RenderableNode` | `SynapseTabs` Home + add | Below masthead |
| `showChatTracker` | `boolean` | `true` | Renders `chatTrackerSlot` |
| `chatTrackerSlot` | `RenderableNode` | Chat Tracker panel | ~`250px` right rail |
| `pageHeaderActionsSlot` | `RenderableNode` | favorite / split / overflow icons | Trailing page header |
| `showPageDescription` | `boolean` | `false` | Chat-default omits subtitle |
| `showFooter` | `boolean` | `false` | Optional status bar |
| `newChat` | object | `{ label: "New Chat" }` | Forward to Left Nav |
| `options` | `"default"` \| `"customView"` \| `"workspaces"` | `"default"` | Figma `Options` axis |

### Spec Accurate Design defaults (`48463:143536`)

```ts
{
  mastheadProductName: "Synapse",
  defaultPageId: "home",
  defaultMenuExpanded: true,
  showTabBar: true,
  showChatTracker: true,
  showFooter: false,
  showPageDescription: false,
  menuItems: /* left-nav Spec Accurate: Home, Recommendations, … */,
  pages: [{ id: "home", title: "Page Title", content: /* ChatArea + ChatInputBox */ }],
  headerActions: /* SynapseMastheadHelpMenu in iconsSlot */,
  appLauncherSlot: /* SynapseAppLauncher */,
  avatarSlot: /* SynapseMastheadUserMenu, initials YK */,
  pageHeaderActionsSlot: /* favorite, split, overflow */,
}
```

## Codegen Contract (Framework-Agnostic Blueprint)

### Resolution order (mandatory for generators)

1. **Load IDS baseline** — [`components/ids/app-shell/design-spec.md`](../ids/app-shell/design-spec.md) (structure, routing, shared slots, behavior, a11y, fallbacks).
2. **Apply Synapse deltas** — programme table above + child specs under `components/synapse/`.
3. **Emit Synapse theme** — `components/synapse-theme.css`; never `ids-theme.css` alone.
4. **Compose children** — `SynapseMasthead`, `SynapseLeftNav`, optional `SynapseTabs` / tracker / footer; no inlined masthead or nav markup.

### Programme slot order (IDS + Synapse inserts)

Inherit IDS deterministic structure; **insert** optional Synapse slots:

| Order | Slot id | Synapse note |
|---:|---|---|
| 1 | `AppShellRoot` | inherit IDS |
| 2 | `AppShellMastheadSlot` | **Synapse Masthead** |
| 3 | **`AppShellTabBarSlot`** | **optional** — omit if `!showTabBar` |
| 4 | `AppShellBodyRow` | inherit IDS |
| 5 | `AppShellLeftNavSlot` | **Synapse Left Nav** (`250px`) |
| 6 | `AppShellMainColumn` | inherit IDS |
| 7 | `AppShellPageHeader` | **Header 6** title + `pageHeaderActionsSlot` |
| 8 | `AppShellBodyViewport` | inherit IDS |
| 9 | `AppShellBodyContentSlot` | inherit IDS |
| 10 | **`AppShellChatTrackerSlot`** | **optional** `aside` — omit if `!showChatTracker` |
| 11 | `AppShellFooterSlot` | **optional** — omit if `!showFooter` |

### Programme variant matrix

| `options` | `showTabBar` | `showChatTracker` | `showFooter` | Figma node |
|---|---|---|---|---|
| `default` | true | true | false | `48463:143536` |
| `customView` | product | product | optional | `51895:86881` |
| `workspaces` | product | optional | optional | `52908:122635` |

Menu expanded/collapsed: **inherit IDS** breakpoint table.

### Programme behavior / fallback additions

Inherit IDS behavior, accessibility, asset, and fallback contracts. Additionally:

| Rule | Behavior |
|---|---|
| `!showTabBar` | Do not emit `AppShellTabBarSlot` |
| `!showChatTracker` | Do not emit `AppShellChatTrackerSlot` |
| `!showFooter` | Do not emit `AppShellFooterSlot` |
| Unknown `options` | Fall back to `default` + dev warning |
| Missing child spec at codegen | Fail validation — do not inline undocumented markup |
| `showChatTracker` without slot content | Empty `aside` or dev warning |

### Validation checklist

- [x] IDS baseline linked; codegen resolution order documented
- [x] Synapse deltas table complete
- [x] Synapse slot inserts (tab bar, chat tracker, optional footer) in codegen order
- [x] Synapse-only API props documented
- [x] Header 6 page title (not Header 5)
- [x] Child specs linked (Masthead, Left Nav, Tab, Tracker, Footer)
- [x] Spec Accurate defaults for `48463:143536`
- [x] `synapse-theme.css` + reference impl + Storybook
- [ ] Visual regression for Custom View / Workspaces (manual)

## Source Mapping

| Property | Value |
|---|---|
| IDS baseline | [`components/ids/app-shell/design-spec.md`](../ids/app-shell/design-spec.md) |
| Programme spec | `components/synapse/app-shell/design-spec.md` |
| Figma file | [Synapse Hi-Fi components](https://www.figma.com/design/Td1bnsvRj1PCGs9RVJkIvJ/Synapse-Hi-Fi-components) |
| File key | `Td1bnsvRj1PCGs9RVJkIvJ` |
| Documentation frame | `Page Layout` (`47803:1845`) |
| `Options=Default` | [`48463:143536`](https://www.figma.com/design/Td1bnsvRj1PCGs9RVJkIvJ/Synapse-Hi-Fi-components?node-id=48463-143536&m=dev) |
| `Options=Custom View` | [`51895:86881`](https://www.figma.com/design/Td1bnsvRj1PCGs9RVJkIvJ/Synapse-Hi-Fi-components?node-id=51895-86881&m=dev) |
| `Options=Workspaces` | [`52908:122635`](https://www.figma.com/design/Td1bnsvRj1PCGs9RVJkIvJ/Synapse-Hi-Fi-components?node-id=52908-122635&m=dev) |
| Composed Masthead | `47807:7569` |
| Composed Left Nav | `47807:8153` |
| Page header area | `48158:6372` (in Default frame) |
| Verification | Figma MCP — 2026-06-17 |
| Implementation | `storybook/src/components/SynapseAppShell.tsx` |
| Storybook | `storybook-generated/synapse/src/components/AppShell.stories.tsx` |
| Legacy alias | `pagelayout` / `page-layout` → this spec |
