# App Shell Design Spec

## Metadata

| Property | Value |
|---|---|
| Component | App Shell |
| Design system | IDS |
| Category | Patterns and Templates |
| Status | **active** |
| Version | 1.0.0 |
| Description | Application layout pattern composing Masthead, Main Menu (left), page header (title + description), scrollable body content slot, and Footer status bar. Body content is host-supplied and switches with navigation selection. |
| Theme CSS | `components/ids-theme.css` |
| Figma file key | `0bHk3XhrjFhowgFkz9yLr4` |
| Component set | `App Shell` (`43478:90797`) |
| Verification method | Figma MCP (`get_design_context`, `get_metadata`) |
| Last verified | 2026-06-17 |
| Storybook examples requested | yes |
| Storybook path | `storybook-generated/ids/src/components/AppShell.stories.tsx` |
| Storybook meta title | `Spec Generated/IDS/App Shell` |
| Implementation guide | [`components/ids/app-shell/README.md`](./README.md) |
| Reference implementation | `storybook/src/components/AppShell.tsx`, `storybook/src/components/AppShell.module.css` |

### Composed child specifications

| Child | Spec path | Figma component |
|---|---|---|
| Masthead | [`components/ids/masthead/design-spec.md`](../masthead/design-spec.md) | `Masthead-Main` (`10130:29493`) |
| Main Menu / Left | [`components/ids/main-menu-left/design-spec.md`](../main-menu-left/design-spec.md) | `MainMenu-Left-Main` (`11099:56205`) |
| Footer | [`components/ids/footer/design-spec.md`](../footer/design-spec.md) | `Footer` (`38908:5818`) |

### Figma breakpoint variants (live-verified)

| Variant axis | Node | Sample width | Main menu mode |
|---|---|---:|---|
| `Screen size=1920` | `43478:46307` | 1920px | Expanded (`278px`) |
| `Screen size=1600` | `43478:90798` | 1600px | Expanded (`278px`) |
| `Screen size=1366` | `43478:90925` | 1366px | Collapsed (icon rail `64px`) |
| `Screen size=1024` | `43478:91081` | 1024px | Collapsed (icon rail `64px`) |

Sample frame heights (`995px`) are reference-only; runtime uses viewport height (`100vh` / `100dvh`).

## Anatomy

`AppShell` is a **composition pattern** — it does not redraw child chrome. It owns layout geometry, responsive breakpoints, page header chrome, and the body projection slot; child components retain their own props, states, and events (see **Composition & API**).

Deterministic slot order (top → bottom, outer → inner):

1. **`AppShellRoot`** — full-viewport column shell (`<div>` or host layout root)
2. **`AppShellMastheadSlot`** — hosts **Masthead** (`56px` fixed height, full width)
3. **`AppShellBodyRow`** — horizontal flex row (`flex: 1`, `min-height: 0`)
4. **`AppShellMainMenuSlot`** — hosts **Main Menu / Left** (expanded `278px` or collapsed `64px` rail)
5. **`AppShellMainColumn`** — primary content column (`flex: 1`, `min-width: 0`, column flex)
6. **`AppShellPageHeader`** — page chrome block (always rendered for routed pages unless suppressed)
   - **`AppShellPageTitle`** — route/page heading (Header 5)
   - **`AppShellPageDescription`** — instructional subtitle (Body 2 medium); optional per page
7. **`AppShellBodyViewport`** — scrollable region for page body (`overflow-y: auto`, `min-height: 0`)
   - **`AppShellBodyContentSlot`** — host projection / swap slot (datagrid, form, dashboard, etc.)
8. **`AppShellFooterSlot`** — hosts **Footer** status bar (`32px`, pinned to bottom of main column)

Optional Figma reference templates (not part of default anatomy — host chooses content):

- `.Content for app shell` set (`43478:87315`): `Property 1=Form` (`43478:87314`), `Property 1=Data Grid Skeleton` (`43478:87313`)

## Layout & Measurements

### Shell geometry (runtime — container-driven)

| Element | Contract |
|---|---|
| `AppShellRoot` | `width: 100%`, `height: 100vh` (or `100dvh`), `min-height: 0`, `box-sizing: border-box`, `display: flex`, `flex-direction: column`, `overflow: hidden` |
| `AppShellMastheadSlot` | `flex: 0 0 56px`, `width: 100%` |
| `AppShellBodyRow` | `flex: 1 1 0%`, `min-height: 0`, `width: 100%`, `display: flex`, `flex-direction: row`, `align-items: stretch` |
| `AppShellMainMenuSlot` | `flex: 0 0 auto`, `height: 100%`, `min-height: 0` — width follows Main Menu expanded/collapsed state |
| `AppShellMainColumn` | `flex: 1 1 0%`, `min-width: 0`, `min-height: 0`, column flex, `background: var(--color-background-surface-1)` |
| `AppShellBodyViewport` | `flex: 1 1 0%`, `min-height: 0`, `overflow-y: auto`, `width: 100%` |
| `AppShellFooterSlot` | `flex: 0 0 auto`, `width: 100%` — outside vertical scroll clip of body viewport |

Figma sample border on root (`var(--color-border-accessible)`) is **documentation chrome only**; product shells typically omit an outer stroke and rely on child borders.

### Page header (Figma nodes `43478:50553`, `43478:90803`, `43478:90930`, `43478:91086`)

| Property | Value |
|---|---|
| Layout | Column, `align-items: flex-start`, `justify-content: center` |
| Gap | `var(--spacing-space-12)` between title and description |
| Padding top | `var(--padding-padding-24)` |
| Padding bottom | `var(--padding-padding-8)` |
| Padding inline | `var(--padding-padding-24)` |
| Title typography | Header 5 — `var(--font-size-header-5)` / `var(--font-line-height-line-height-32)`, regular weight, `var(--color-text-neutral-strong)` |
| Description typography | Body 2 medium — `var(--font-size-body-2)` / `var(--font-line-height-line-height-20)`, medium weight, `var(--color-text-neutral)` |
| Description visibility | Render when `pageDescription` is non-empty; omit slot when empty and `showPageDescription=false` |

### Body content slot (Figma nodes `43478:50919`, `43478:90806`, `43478:90933`, `43478:91089`)

| Property | Value |
|---|---|
| Padding inline | `var(--padding-padding-24)` |
| Padding block | `var(--padding-padding-16)` |
| Width | `100%`, `box-sizing: border-box` |
| Height behavior | Fills remaining space inside `AppShellBodyViewport`; child content should use `width: 100%`, `min-height: 0` for nested scroll regions (see Datagrid shell contract) |
| Figma placeholder | `.SwapContent` (`43478:50900`) — design-time only; **never** ship swap placeholder in production |

### Responsive breakpoints (Figma-aligned + fluid)

Figma encodes discrete **Screen size** variants; runtime maps them to CSS media queries and user preference:

| Viewport width | Default menu mode | Figma reference |
|---|---|---|
| `≥ 1600px` | **Expanded** (`278px` rail) unless user collapsed | `43478:46307`, `43478:90798` |
| `< 1600px` | **Collapsed** (`64px` icon rail) unless user expanded | `43478:90925`, `43478:91081` |
| All widths | Main column and body slot grow fluidly (`flex: 1`); no fixed `1920px` / `1600px` cap at runtime | — |

**Responsive rules (codegen-critical):**

1. **`menuExpanded` state** combines breakpoint default + user toggle from Main Menu footer (`onExpandedChange`). At `< 1600px`, default collapsed; at `≥ 1600px`, default expanded. User override persists in session until cleared.
2. **`AppShellMainColumn`** always receives remaining horizontal space (`min-width: 0` prevents flex overflow).
3. **Page title** may wrap; do not truncate unless product requires single-line headers.
4. **Page description** wraps naturally; avoid `white-space: nowrap` (Figma sample uses nowrap for static labels only).
5. **Footer** remains one line (`32px`); truncate hostname/SWID per Footer spec rather than growing shell height.
6. **Nested scroll:** only `AppShellBodyViewport` scrolls vertically by default; Masthead, menu rail, page header (optional sticky — off by default), and footer stay fixed within the column.

### Main column vertical stacking

| Breakpoint sample | Main column flex | Notes |
|---|---|---|
| 1920 (`43478:46307`) | Column, gap `var(--spacing-space-10)` between header stack and body | Footer follows body in column flow |
| 1600 / 1024 | Column, `justify-content: space-between` on outer content wrapper | Footer pinned to column bottom when body is short |

Implementations MUST use the **scroll viewport split** (header + footer outside body scroll) regardless of `justify-content` sample differences.

## Tokens

### Surfaces

- `AppShellRoot` / main column background: `var(--color-background-surface-1)`
- Composed Masthead: `var(--color-background-masthead-brand-base)` (see Masthead spec)
- Composed Main Menu rail: `var(--color-background-component)` (see Main Menu / Left spec)
- Composed Footer bar: `var(--color-background-surface-1)` (see Footer spec)

### Typography (App Shell–owned slots only)

| Slot | Tokens |
|---|---|
| `AppShellPageTitle` | `var(--font-size-header-5)`, `var(--font-line-height-line-height-32)`, `var(--color-text-neutral-strong)` |
| `AppShellPageDescription` | `var(--font-size-body-2)`, `var(--font-line-height-line-height-20)`, medium weight, `var(--color-text-neutral)` |

### Spacing and padding

- Page header gap: `var(--spacing-space-12)`
- Main column section gap (when used): `var(--spacing-space-10)`
- Page header padding: `var(--padding-padding-24)` top, `var(--padding-padding-8)` bottom, `var(--padding-padding-24)` inline
- Body slot padding: `var(--padding-padding-24)` inline, `var(--padding-padding-16)` block

## States (Light Theme)

App Shell root and page-header slots are **static chrome** (no interactive states on the shell itself). Visual state for Masthead, Main Menu, and Footer is owned by child specs.

| Slot | State | Background | Border | Text |
|---|---|---|---|---|
| `AppShellRoot` | default | `var(--color-background-surface-1)` | none (product) | — |
| `AppShellMainColumn` | default | `var(--color-background-surface-1)` | none | — |
| `AppShellPageHeader` | default | transparent | none | — |
| `AppShellPageTitle` | default | transparent | none | `var(--color-text-neutral-strong)` |
| `AppShellPageDescription` | default | transparent | none | `var(--color-text-neutral)` |
| `AppShellBodyViewport` | default | transparent | none | — |

## States (Dark Theme)

Dark theme uses the same semantic tokens as **States (Light Theme)**. Resolved values for `[data-theme="dark"]` / `.ids-theme-dark` (and program overlays) live in theme CSS:

- `components/ids-theme.css`
- `components/<program>-theme.css` when a program overlays IDS (for example `components/dap-theme.css`)

Duplicate the full state matrix in this section only when a dark row genuinely uses different `var(--...)` references than the corresponding light row.

## Interactions

### Navigation and page content

1. User activates a **Main Menu** primary or secondary item → shell resolves matching **page** record → updates `activePageId` → re-renders `AppShellPageTitle`, `AppShellPageDescription`, and `AppShellBodyContentSlot`.
2. Body content is **opaque to the shell** — any component tree the host supplies (Datagrid, form, dashboard, empty state). The shell does not inspect body internals.
3. Each routable page SHOULD define `title` and `description` strings. Dashboard or self-explanatory pages MAY omit description when `showPageDescription=false`.
4. **Direct URL / deep link:** host sets `activePageId` (controlled) or `defaultPageId` (uncontrolled); shell syncs menu selection via `menuSelectedItemId` prop forwarded to Main Menu.
5. **Menu collapse:** footer control toggles expanded/collapsed rail; shell listens to `onMenuExpandedChange` and adjusts `AppShellMainMenuSlot` width. Breakpoint defaults apply on resize unless `persistMenuExpanded=true` and a stored preference exists.

### Event forwarding (composed children → shell outputs)

The shell **re-emits** child events on the root API without altering payloads (transparent pass-through):

| Source child | Child event (see child spec) | App Shell output |
|---|---|---|
| Main Menu / Left | `onNavigate` | `onNavigate` |
| Main Menu / Left | `onSelected` | `onMenuSelected` |
| Main Menu / Left | `onExpandedChange` | `onMenuExpandedChange` |
| Footer | `onCopySwid` | `onCopySwid` |
| Footer | `onTimeZoneClick` | `onTimeZoneClick` |

Masthead utility actions are **composed**, not configured via a root icon array. The host projects a **`headerActions`** slot (maps to Masthead `iconsSlot`) and wires `(click)` / `onClick` on each child control. App Shell does **not** re-emit a central `onMastheadAction` — click handlers live on the composed tree (same pattern as a product `HeaderActions` child component).

### `AppShellHeaderActions` (masthead utility region)

Composable wrapper for the Masthead icons region (left → right, before App Launcher and avatar). Host may mix search fields, icon buttons, dropdown triggers, badges, and custom markup.

| Field | Type | Required | Notes |
|---|---|---|---|
| `children` | `RenderableNode` | yes | Projected content; each interactive child owns its handlers |
| `className` | `string` | no | Host hook on wrapper (`div.header-actions`) |

**Framework mapping:**

| Framework | Pattern |
|---|---|
| React | `<AppShell headerActions={<AppShellHeaderActions>…</AppShellHeaderActions>} />` |
| Angular | `<ids-app-shell><ids-app-shell-header-actions>…</ids-app-shell-header-actions></ids-app-shell>` |
| Vue / Lit | Named slot `header-actions` with default slot on wrapper component |

**Optional primitives** (re-exported from Masthead spec for convenience inside `headerActions`):

- `MastheadActionButtonContainer` — horizontal cluster of icon buttons
- `MastheadActionIconButton` — presentational icon button; extends native `button` props (`onClick`, `aria-label`, `aria-expanded`, `badgeCount`, `badgeType`, …)
- Custom elements (e.g. `<search-input>`, `<clr-dropdown>`) are valid siblings inside `AppShellHeaderActions`

**Figma reference set** (`43478:46307`, left → right): `search-16`, `alert-bell-16` (`badgeType="critical"`), `jobs-queue-stack` (`badgeType="success"`), `setting-gear-16`, `help-circ-16`. Storybook ships `AppShellSpecAccurateHeaderActions()` with sample badge counts — **not** a runtime default when `headerActions` is omitted.

| Prop / slot | Type | Default | Notes |
|---|---|---|---|
| `headerActions` | `RenderableNode` | — | Composed utility region → Masthead `iconsSlot`; omit for none |
| `appLauncherSlot` | `RenderableNode` | — | Trailing App Launcher; omit for none |
| `avatarSlot` | `RenderableNode` | initials chip (`"DT"` in Storybook) | Trailing user avatar control |
| `mastheadLogo` | `RenderableNode` | product icon from `mastheadProductIconSlug` | Brand mark before product name |

### Accessibility

- `AppShellRoot`: use landmark structure — Masthead → `<header>`, Main Menu → `<nav>` (child), main column → `<main id="main-content">`.
- `AppShellPageTitle`: render as `<h1>` (one per view) unless host sets `pageTitleLevel` for nested routing patterns.
- `AppShellPageDescription`: `id="page-description"`; associate with main via `aria-describedby` when description is present.
- Skip link (host/app level): target `#main-content` — document in app template, not duplicated per page.
- Focus management on route change: move focus to `AppShellPageTitle` or first focusable in body when `focusManagementOnNavigate=true` (default `true`).

### Behavior & guidelines

- Use App Shell as the **top-level layout** for authenticated application views.
- Do not embed a second full shell inside the body slot.
- Keep page descriptions concise instructional text; avoid duplicating the title.
- Prefer composing existing IDS components in the body slot rather than bespoke layout CSS.
- Long-running views (Datagrid, wizards) should fill `AppShellBodyContentSlot` with `height: 100%`, `min-height: 0` so internal scroll regions work (see `components/ids/datagrid/design-spec.md` shell geometry).
- Global alerts/toasts render **above** or **overlaying** the shell (portal), not inside `AppShellBodyContentSlot`, unless product explicitly scopes them to page content.

## Composition & API (runtime)

### Architecture

```
AppShell (root — layout + routing orchestration)
├── Masthead (composed — own props/events)
├── MainMenuLeft (composed — own props/events)
├── AppShellPageHeader (owned — title + description)
├── AppShellBodyContentSlot (projection — host content per page)
└── Footer (composed — own props/events)
```

Child components are instantiated by the shell (or framework adapter) with props mapped from the tables below. The shell MUST NOT flatten child prop namespaces into root props except for documented passthrough bundles.

### Variants

| Axis | Values | Default | Notes |
|---|---|---|---|
| `breakpointPreset` | `fluid`, `1920`, `1600`, `1366`, `1024` | `fluid` | Storybook/QA only — pins Figma sample widths; production uses `fluid` |
| `menuExpanded` | `true`, `false` | breakpoint-derived | Controlled with `onMenuExpandedChange`; uncontrolled uses breakpoint default + optional `defaultMenuExpanded` |
| `persistMenuExpanded` | `true`, `false` | `false` | When true, store user toggle across resize (session storage adapter-defined) |
| `showPageDescription` | `true`, `false` | `true` | When false, hide description slot even if string provided |
| `focusManagementOnNavigate` | `true`, `false` | `true` | Move focus to page title on route change |

### Page model (host configuration)

```ts
interface AppShellPage {
  id: string;                    // stable key; matches menu item id when menu-driven
  title: string;                 // Page Title (Header 5)
  description?: string;          // instructional subtitle; omit for dashboard/self-explanatory
  showDescription?: boolean;     // per-page override of shell showPageDescription
  content: RenderableNode;       // body slot payload (framework-specific)
  menuItemId?: string;           // when different from id (secondary routes)
}
```

**Resolution:** on `activePageId` change, shell sets `AppShellPageTitle` ← `page.title`, `AppShellPageDescription` ← `page.description ?? ""`, and mounts `page.content` inside `AppShellBodyContentSlot`.

### Root runtime API

| Prop / slot | Type | Default | Contract |
|---|---|---|---|
| `pages` | `AppShellPage[]` | required | Catalog of routable views with title, description, content |
| `activePageId` | `string` | — | Controlled active page |
| `defaultPageId` | `string` | first page `id` | Uncontrolled initial page |
| `onPageChange` | `(pageId: string) => void` | — | Fired when active page changes (menu or programmatic) |
| `menuItems` | `MainMenuLeftPrimaryItem[]` | — | Forwarded to Main Menu / Left — see [`main-menu-left/design-spec.md`](../main-menu-left/design-spec.md) |
| `menuSelectedItemId` | `string` | — | Controlled menu selection sync |
| `defaultMenuSelectedItemId` | `string` | matches `defaultPageId` | Initial menu highlight |
| `menuExpanded` | `boolean` | breakpoint default | Controlled rail width |
| `defaultMenuExpanded` | `boolean` | breakpoint default | Uncontrolled initial rail |
| `onMenuExpandedChange` | `(expanded: boolean) => void` | — | User toggled collapse footer |
| `onNavigate` | `(MainMenuLeftNavigationTarget) => void` | — | Pass-through from Main Menu |
| `onMenuSelected` | `(MainMenuLeftSelectionDetail) => void` | — | Pass-through from Main Menu |
| `mastheadProductName` | `string` | required | Masthead brand label |
| `mastheadProductIconSlug` | `string` | `shield-cloud` | Product icon slug or use `mastheadLogo` |
| `mastheadLogo` | `RenderableNode` | icon from slug | Brand mark before product name |
| `headerActions` | `RenderableNode` | — | Composed utility region → Masthead `iconsSlot` |
| `appLauncherSlot` | `RenderableNode` | — | App Launcher before avatar |
| `avatarSlot` | `RenderableNode` | initials chip | User avatar control |
| `footerHostname` | `string` | — | Passthrough → Footer |
| `footerSwid` | `string` | — | Passthrough → Footer |
| `footerCurrentDateTime` | `string` | — | Passthrough → Footer |
| `footerTimeZoneLabel` | `string` | — | Passthrough → Footer |
| `showFooterHostname` | `boolean` | `true` | Passthrough → Footer |
| `showFooterDateTime` | `boolean` | `true` | Passthrough → Footer |
| `showFooterTimeZone` | `boolean` | `true` | Passthrough → Footer |
| `onCopySwid` | `(swid: string) => void` | — | Pass-through from Footer |
| `onTimeZoneClick` | `() => void` | — | Pass-through from Footer |
| `showPageDescription` | `boolean` | `true` | Global description visibility |
| `pageTitleLevel` | `1 \| 2` | `1` | Heading level for accessible title |
| `className` | `string` | — | Host hook on root |

### Composed child input bundles (passthrough)

Implementations MAY accept nested objects instead of flat passthrough props:

| Bundle prop | Child spec section | Notes |
|---|---|---|
| `masthead` | Masthead → Composition & API | `{ productName, productIcon, actions, avatar, ... }` |
| `mainMenu` | Main Menu / Left → Composition & API | `{ items, expanded, logo, ariaLabel, ... }` |
| `footer` | Footer → Composition & API | `{ hostname, swid, currentDateTime, timeZoneLabel, show*, ... }` |

When both flat and bundle props are supplied, **bundle wins** for that child (adapter-defined merge rule — document in generated code).

### Root outputs (events)

| Event | When | Payload |
|---|---|---|
| `onPageChange` | Active page id changed | `pageId: string`, `page: AppShellPage` |
| `onNavigate` | Menu navigation activated | `MainMenuLeftNavigationTarget` |
| `onMenuSelected` | Menu selection changed | `MainMenuLeftSelectionDetail` |
| `onMenuExpandedChange` | Rail expanded/collapsed | `expanded: boolean` |
| `onCopySwid` | Footer copy control | `swid: string` |
| `onTimeZoneClick` | Footer time zone control | — |

### Spec Accurate Design defaults (codegen parity)

Reference sample aligned to Figma `43478:46307` (`Screen size=1920`):

```ts
{
  breakpointPreset: "1920",          // QA frame only
  defaultPageId: "dashboard",
  defaultMenuSelectedItemId: "dashboard",
  defaultMenuExpanded: true,
  pages: [
    {
      id: "dashboard",
      title: "Page Title",
      description:
        "This subtitle is meant for instructional text that outlines the purpose of this page. It's advisable to include such text unless the page is a dashboard or self-explanatory.",
      content: /* host swap slot — placeholder acceptable in Storybook only */,
    },
  ],
  menuItems: /* Figma 11099:56218 labels — see main-menu-left Spec Accurate Design */,
  mastheadProductName: "Product Name",
  headerActions: /* AppShellSpecAccurateHeaderActions() or product HeaderActions child */,
  appLauncherSlot: /* App Launcher instance */,
  avatarSlot: /* MastheadAvatar with onClick */,
  footerHostname: "short_name_first_domain_name",
  footerSwid: "ELMCR00222GBPB",
  footerCurrentDateTime: "Tue, 2023-04-23 12:30 AM",
  footerTimeZoneLabel: "Eastern Time (US & Canada)",
}
```

Additional Storybook variants: `1366` collapsed menu (`43478:90925`), `1024` (`43478:91081`).

### Consumer usage (developer integration)

Copy-paste examples and integration rules live in [`README.md`](./README.md). Storybook **Developer usage** story shows the same snippet in the canvas code panel and in **Docs → Show code**.

**Minimal React shape:**

```tsx
import "components/ids-theme.css";
import {
  AppShell,
  AppShellHeaderActions,
  IdsMastheadActionButtonContainer,
  IdsMastheadActionIconButton,
  IdsMastheadAvatar,
  type AppShellPage,
} from "<AppShell>";
import type { MainMenuLeftPrimaryItem } from "<MainMenuLeft>";

const menuItems: MainMenuLeftPrimaryItem[] = [
  { id: "dashboard", name: "Dashboard", iconName: "home", routeRef: "/dashboard" },
];

const pages: AppShellPage[] = [
  {
    id: "dashboard",
    title: "Page Title",
    description: "Instructional subtitle for this page.",
    content: <YourPageComponent />,
  },
];

<AppShell
  pages={pages}
  menuItems={menuItems}
  defaultPageId="dashboard"
  mastheadProductName="Product Name"
  headerActions={
    <AppShellHeaderActions>
      <MySearchInput />
      <IdsMastheadActionButtonContainer>
        <IdsMastheadActionIconButton
          aria-label="What's New, 5 new"
          badgeCount={5}
          badgeType="critical"
          icon={<Icon shapeName="alert-bell-16" />}
          onClick={() => setWhatsNewOpen(true)}
        />
        <MySettingsDropdown />
      </IdsMastheadActionButtonContainer>
    </AppShellHeaderActions>
  }
  appLauncherSlot={<AppLauncher triggerVariant="masthead" products={products} />}
  avatarSlot={<IdsMastheadAvatar initials="DT" onClick={openUserMenu} />}
  footer={{ hostname: "...", swid: "...", currentDateTime: "...", timeZoneLabel: "..." }}
/>
```

**Header actions:** compose any mix of search, icon buttons, dropdowns, and badges inside `headerActions`. Use `badgeCount` + `badgeType` on `MastheadActionIconButton` (or product badge wrappers like `def-icon-badge` in Angular). Include the count in `aria-label` when a badge is shown. Wire `onClick` / `(click)` on each control — App Shell does not dispatch a central action callback. Omit `headerActions` for no utility icons; use `AppShellSpecAccurateHeaderActions()` in Storybook only for Figma parity.

**Controlled routing:** pass `activePageId` + `onPageChange`; optionally wire `onNavigate` to the host router. **Menu/page id alignment:** `pages[].id` should match `menuItems[].id` unless `pages[].menuItemId` maps a secondary route.

## Codegen Contract (Framework-Agnostic Blueprint)

### Deterministic structure

Emit DOM/framework nodes in **Anatomy** order. Stable identifiers:

| Order | Slot id | HTML landmark (suggested) |
|---:|---|---|
| 1 | `AppShellRoot` | `div.app-shell` |
| 2 | `AppShellMastheadSlot` | child `<header>` from Masthead |
| 3 | `AppShellBodyRow` | `div.app-shell__body-row` |
| 4 | `AppShellMainMenuSlot` | child `<nav>` from MainMenuLeft |
| 5 | `AppShellMainColumn` | `<main id="main-content">` |
| 6 | `AppShellPageHeader` | `div.app-shell__page-header` |
| 7 | `AppShellPageTitle` | `h1` (or configured level) |
| 8 | `AppShellPageDescription` | `p#page-description` |
| 9 | `AppShellBodyViewport` | `div.app-shell__body-viewport` |
| 10 | `AppShellBodyContentSlot` | projection host / `{children}` / `<ng-content>` |
| 11 | `AppShellFooterSlot` | child `<footer>` from Footer |

**Composition rule:** generate **child components** from their specs (`Masthead`, `MainMenuLeft`, `Footer`); do not inline Masthead/menu/footer markup in AppShell output.

### Variant matrix

| `breakpointPreset` | `menuExpanded` default | `AppShellMainMenuSlot` width | Figma node |
|---|---|---|---|
| `fluid` + viewport ≥ 1600px | `true` | `278px` (expanded) | `43478:46307`, `43478:90798` |
| `fluid` + viewport < 1600px | `false` | `64px` (collapsed) | `43478:90925`, `43478:91081` |
| `1920` | `true` | `278px` | `43478:46307` |
| `1600` | `true` | `278px` | `43478:90798` |
| `1366` | `false` | `64px` | `43478:90925` |
| `1024` | `false` | `64px` | `43478:91081` |

Invalid `activePageId` → fall back to `defaultPageId` or first `pages[]` entry; emit console warning in dev builds.

### Per-slot style contract

| Slot | Layout / size | Tokens |
|---|---|---|
| `AppShellRoot` | `100% × 100vh`, column flex, `overflow: hidden` | `background: var(--color-background-surface-1)` |
| `AppShellBodyRow` | row flex, `flex: 1`, `min-height: 0` | — |
| `AppShellMainColumn` | column flex, `flex: 1`, `min-width: 0`, `min-height: 0` | `background: var(--color-background-surface-1)` |
| `AppShellPageHeader` | column, gap `var(--spacing-space-12)` | padding per Layout section |
| `AppShellPageTitle` | content width | Header 5 tokens |
| `AppShellPageDescription` | content width, wrap | Body 2 medium tokens |
| `AppShellBodyViewport` | `flex: 1`, `overflow-y: auto`, `min-height: 0` | — |
| `AppShellBodyContentSlot` | `width: 100%`, `box-sizing: border-box` | padding `var(--padding-padding-24)` inline, `var(--padding-padding-16)` block |
| `AppShellMastheadSlot` | `56px` height | delegate to Masthead spec |
| `AppShellMainMenuSlot` | full body-row height, `min-height: 0` | delegate to Main Menu spec |
| `AppShellFooterSlot` | `32px` bar | delegate to Footer spec |

### Behavior contract

1. **Page routing:** `activePageId` selects one record from `pages[]`; title, description, and body content update atomically.
2. **Menu sync:** menu `onNavigate` / `onSelected` resolves `itemId` → `pages[].id` (or `menuItemId` mapping); calls `onPageChange` when match found.
3. **Responsive menu:** on viewport cross `1600px`, apply breakpoint default unless `persistMenuExpanded` restored a user preference.
4. **Scroll ownership:** vertical scroll on `AppShellBodyViewport` only; masthead, menu, footer fixed within shell; body children may add nested scroll (Datagrid pattern).
5. **Event bubbling:** child events listed in Interactions MUST surface on root with identical payload shapes (menu, footer). Masthead action clicks are handled on composed `headerActions` children — not re-emitted at shell root.
6. **Forced states:** `data-state` on shell slots is demo-only; runtime interaction stays enabled on composed children.

### Accessibility contract

- One `h1` (or configured level) per active page in `AppShellPageTitle`.
- `main#main-content` wraps page header + body viewport; footer remains inside main column but outside body scroll (status region).
- `aria-describedby="page-description"` on `<main>` when description rendered.
- On `onPageChange`, focus moves to page title when `focusManagementOnNavigate=true`.
- Child components MUST retain their a11y contracts (Masthead header landmark, menu `nav`, footer `footer`).

### Asset resolution + bundling contract

- App Shell owns **no icons** directly; assets resolve through composed specs (Main Menu icons, Footer `copy`/`time-clock`/`world-globe`, Masthead action icons).
- Product icon in Masthead: `assets/icons/<slug>.svg` or host `productIconSrc` per Masthead spec.
- Body slot assets are host responsibility.

### Fallback/error rules

| Condition | Behavior |
|---|---|
| Unknown `activePageId` | Fall back to `defaultPageId` or first page; dev warning |
| Empty `pages[]` | Render shell chrome with empty title and body; dev error |
| `pages[].title` missing | Dev validation error; render `"Untitled"` in production fallback |
| Menu item with no matching page | Still emit `onNavigate`; no page change unless host handles |
| Unknown `breakpointPreset` | Treat as `fluid` |
| Missing composed child spec at codegen | Fail validation — do not inline undocumented markup |
| Missing `mastheadProductName` | Dev validation error |
| Both `menuExpanded` and missing `onMenuExpandedChange` in controlled mode | Warn — treat as read-only expanded state |

### Validation checklist

- [ ] Live Figma nodes `43478:46307`, `43478:90798`, `43478:90925`, `43478:91081` referenced in Source Mapping
- [ ] Anatomy slot order matches generated DOM / component tree
- [ ] Masthead, Main Menu / Left, Footer composed from child specs (no duplicated chrome markup)
- [ ] Page header uses Header 5 + Body 2 medium tokens only (`var(--...)`)
- [ ] Body slot accepts arbitrary host content; menu click swaps page content
- [ ] Each page exposes `title` + optional `description` per page model
- [ ] Breakpoint `< 1600px` defaults menu collapsed; `≥ 1600px` expanded
- [ ] `AppShellBodyViewport` scrolls; footer outside scroll clip
- [ ] Root re-emits `onNavigate`, `onMenuSelected`, `onMenuExpandedChange`, `onCopySwid`, `onTimeZoneClick`
- [ ] `headerActions` composes Masthead `iconsSlot`; click handlers on composed children; omit → no utility icons
- [ ] `100vh` / `100dvh` shell height; width `100%` (not fixed 1920px)
- [ ] Accessibility: `main#main-content`, single page `h1`, optional `aria-describedby`
- [ ] No Figma `.SwapContent` placeholder in production codegen output

## Source Mapping

| Property | Value |
|---|---|
| Design system | IDS |
| Figma file | [IDS Design Library](https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library) |
| File key | `0bHk3XhrjFhowgFkz9yLr4` |
| Documentation frame | `App Shell` (`43478:100753`) |
| Component set | `App Shell` (`43478:90797`) |
| Variant `Screen size=1920` | [`43478:46307`](https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=43478-46307&m=dev) |
| Variant `Screen size=1600` | [`43478:90798`](https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=43478-90798&m=dev) |
| Variant `Screen size=1366` | [`43478:90925`](https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=43478-90925&m=dev) |
| Variant `Screen size=1024` | [`43478:91081`](https://www.figma.com/design/0bHk3XhrjFhowgFkz9yLr4/IDS-Design-Library?node-id=43478-91081&m=dev) |
| Page header nodes | `43478:50553` (1920), `43478:90803` (1600), `43478:90930` (1366), `43478:91086` (1024) |
| Body slot wrapper nodes | `43478:50919`, `43478:90806`, `43478:90933`, `43478:91089` |
| Swap placeholder (design-time only) | `.SwapContent` `43478:50900` |
| Content templates | `.Content for app shell` (`43478:87315`) |
| Composed Masthead instance | `43478:46181` → `Masthead-Main` (`10130:29493`) |
| Composed Main Menu instance | `11099:56218` (expanded) / `11099:56206` (collapsed) |
| Composed Footer instance | `43478:50555` → `Footer` (`38908:5818`) |
| Verification method | Figma MCP — `get_design_context`, `get_metadata` |
| Last live verification | 2026-06-17 |
| Design spec path | `components/ids/app-shell/design-spec.md` |
