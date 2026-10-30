# IDS App Shell

Application layout pattern composing existing IDS children:

| Slot | Spec |
|---|---|
| Masthead | [`../masthead/design-spec.md`](../masthead/design-spec.md) |
| Main Menu / Left | [`../main-menu-left/design-spec.md`](../main-menu-left/design-spec.md) |
| Footer | [`../footer/design-spec.md`](../footer/design-spec.md) |

Host apps supply a **page catalog** (`pages`) and **menu tree** (`menuItems`). Menu navigation swaps the active page’s title, description, and body content. Shell contract: [`design-spec.md`](./design-spec.md).

## Reference implementation

| File | Role |
|---|---|
| `storybook/src/components/AppShell.tsx` | Composes Masthead, MainMenuLeft, page chrome, body slot, Footer |
| `storybook/src/components/AppShell.module.css` | Shell geometry (`100vh`, scroll viewport, page header tokens) |
| `storybook-generated/ids/src/components/AppShell.stories.tsx` | **Spec Generated/IDS/App Shell** |
| `lib/react/ids/app-shell` | React library (Ids camelCase slots) |
| `lib/angular/ids/app-shell` | Angular library (`ids-app-shell` + slot selectors) |
| `storybook-angular/src/components/ids-app-shell-lib/` | **Spec Generated/IDS/App Shell/Angular Composition** |

Import theme once at app root (or in Storybook):

```tsx
import "components/ids-theme.css";
```

## Minimal usage (uncontrolled)

```tsx
import {
  AppShell,
  AppShellHeaderActions,
  IdsMastheadActionButtonContainer,
  IdsMastheadActionIconButton,
  IdsMastheadAvatar,
  type AppShellPage,
} from "./AppShell";
import { AppLauncher } from "./AppLauncher";
import { Icon } from "./Icon";
import type { MainMenuLeftPrimaryItem } from "./MainMenuLeft";
import { MyDashboard } from "./pages/MyDashboard";

const menuItems: MainMenuLeftPrimaryItem[] = [
  { id: "dashboard", name: "Dashboard", iconName: "home", routeRef: "/dashboard" },
  { id: "reports", name: "Reports", iconName: "productivity-alt", routeRef: "/reports" },
];

const pages: AppShellPage[] = [
  {
    id: "dashboard",
    title: "Dashboard",
    description: "Overview of system health and recent activity.",
    content: <MyDashboard />,
  },
  {
    id: "reports",
    title: "Reports",
    description: "Generate and schedule operational reports.",
    content: <MyReports />,
  },
];

export function App() {
  return (
    <AppShell
      pages={pages}
      menuItems={menuItems}
      defaultPageId="dashboard"
      mastheadProductName="Product Name"
      mastheadProductIconSlug="shield-cloud"
      headerActions={
        <AppShell.HeaderActions>
          <IdsMastheadActionButtonContainer>
            <IdsMastheadActionIconButton
              aria-label="Alerts, 3 unread"
              badgeCount={3}
              badgeType="critical"
              icon={<Icon shapeName="alert-bell-16" style={{ width: 16, height: 16 }} />}
              onClick={() => openAlerts()}
            />
            <IdsMastheadActionIconButton
              aria-label="Help"
              icon={<Icon shapeName="help-circ-16" style={{ width: 16, height: 16 }} />}
              onClick={() => openHelp()}
            />
          </IdsMastheadActionButtonContainer>
        </AppShell.HeaderActions>
      }
      appLauncherSlot={
        <AppLauncher triggerVariant="masthead" products={products} />
      }
      avatarSlot={
        <IdsMastheadAvatar initials="DT" onClick={() => openUserMenu()} />
      }
      footer={{
        hostname: "short_name_first_domain_name",
        swid: "ELMCR00222GBPB",
        currentDateTime: "Tue, 2023-04-23 12:30 AM",
        timeZoneLabel: "Eastern Time (US & Canada)",
      }}
    />
  );
}
```

### Header actions (composition)

Masthead utility icons are **not** driven by a config array. Compose a `HeaderActions`-style child and pass it as `headerActions`:

| Approach | When to use |
|---|---|
| `headerActions={<AppShellHeaderActions>…</AppShellHeaderActions>}` | **Recommended** — mix search, icon buttons, dropdowns, `badgeCount` on action buttons; wire `onClick` per control |
| Omit `headerActions` | No search / utility action icons |
| Omit `appLauncherSlot` | No App Launcher |
| Omit `avatarSlot` | No avatar / account control |
| Omit `mastheadLogo` + `mastheadProductIconSlug` | Product-name-only brand (no logo) |
| `AppShellSpecAccurateHeaderActions()` | Storybook / Figma parity demos only — not a runtime default |

**Angular analogue** (projected children, per-control click handlers):

```html
<ids-app-shell [headerActions]="headerActionsTpl" …>
</ids-app-shell>

<ng-template #headerActionsTpl>
  <ids-app-shell-header-actions>
    <search-input></search-input>
    <div class="nav-link nav-icon" (click)="whatsNewOpened = true" title="What's New">
      <def-icon-badge [badgeValue]="newEnhancementsCount" badgeColorClass="badge-danger">
        <clr-icon size="18" shape="dell-policy-agreement-check"></clr-icon>
      </def-icon-badge>
    </div>
    <clr-dropdown>…</clr-dropdown>
  </ids-app-shell-header-actions>
</ng-template>
```

Common Masthead icon slugs: `search-16`, `alert-bell-16`, `jobs-queue-stack`, `setting-gear-16`, `help-circ-16` (see Masthead spec).

## Controlled routing (URL / router sync)

```tsx
import { useState } from "react";
import { AppShell } from "./AppShell";

export function AppWithRouter() {
  const [activePageId, setActivePageId] = useState("dashboard");

  return (
    <AppShell
      pages={pages}
      menuItems={menuItems}
      activePageId={activePageId}
      onPageChange={(pageId) => {
        setActivePageId(pageId);
        // optional: history.push(`/app/${pageId}`)
      }}
      onNavigate={(target) => {
        console.log("navigate", target.itemId, target.link);
      }}
      mastheadProductName="Product Name"
    />
  );
}
```

## Key rules for consumers

1. **Page header is always present** — `AppShellPageHeader` + title always render. Only the description may be omitted (`showPageDescription={false}` or empty `description`).
2. **`pages[].id`** should match the corresponding **`menuItems[].id`** so menu clicks resolve the right view (secondary items can use `menuItemId` on the page when ids differ).
3. **Body content** is any React node — datagrids, forms, dashboards. Fill height with `width: 100%`, `min-height: 0` when the child manages its own scroll (see Datagrid shell contract).
4. **Responsive menu:** rail defaults to **expanded** at viewport `≥ 1600px`, **collapsed** below. Override with `menuExpanded` / `onMenuExpandedChange` or `defaultMenuExpanded`. With `persistMenuExpanded`, preference is stored in `sessionStorage` key `ids.app-shell.menuExpanded`.
5. **Events** bubble from composed children: `onNavigate`, `onMenuSelected`, `onMenuExpandedChange`, `onCopySwid`, `onTimeZoneClick` (Footer). Masthead action clicks are wired on each composed control inside `headerActions`.

## Storybook

```bash
cd storybook && npm run dev
```

Open **Spec Generated → IDS → App Shell → Developer usage** or **Composed header actions** for live examples with an on-canvas code panel and **Docs → Show code** snippets.
