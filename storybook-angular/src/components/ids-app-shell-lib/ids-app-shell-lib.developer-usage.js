/** Developer usage + Docs tab copy for IDS App Shell (Angular library). */

export const APP_SHELL_LIB_DOCS_DESCRIPTION = `
## Overview

Application chrome layout: masthead, main menu, page header, content, and footer slots.

## Props

### \`ids-app-shell\`

| Input | Type | Default |
|-------|------|---------|
| \`pages\` | \`IdsAppShellPage[]\` | \`[]\` |
| \`menuItems\` | \`MainMenuLeftPrimaryItem[]\` | \`[]\` |
| \`persistMenuExpanded\` | \`—\` | \`false\` |
| \`mastheadProductName\` | \`—\` | \`""\` |
| \`showFooterHostname\` | \`—\` | \`true\` |
| \`showFooterDateTime\` | \`—\` | \`true\` |
| \`showFooterTimeZone\` | \`—\` | \`true\` |
| \`showPageDescription\` | \`—\` | \`true\` |
| \`focusManagementOnNavigate\` | \`—\` | \`true\` |
| \`pageTitleLevel\` | \`IdsAppShellPageTitleLevel\` | \`1\` |
| \`breakpointPreset\` | \`IdsAppShellBreakpointPreset \\| string\` | \`"fluid"\` |

### \`ids-app-shell-demo-host\`

| Input | Type | Default |
|-------|------|---------|
| \`breakpointPreset\` | \`IdsAppShellBreakpointPreset \\| string\` | \`"1920"\` |
| \`defaultPageId\` | \`—\` | \`"dashboard"\` |
| \`defaultMenuExpanded\` | \`—\` | \`true\` |
| \`mastheadProductName\` | \`—\` | \`"Product Name"\` |
| \`mastheadProductIconSlug\` | \`—\` | \`"shield-cloud"\` |
| \`footerHostname\` | \`—\` | \`FOOTER_SPEC_ACCURATE_DEFAULTS.hos…\` |
| \`footerSwid\` | \`—\` | \`FOOTER_SPEC_ACCURATE_DEFAULTS.swid\` |
| \`footerCurrentDateTime\` | \`—\` | \`FOOTER_SPEC_ACCURATE_DEFAULTS.cur…\` |
| \`footerTimeZoneLabel\` | \`—\` | \`FOOTER_SPEC_ACCURATE_DEFAULTS.tim…\` |
| \`menuItems\` | \`MainMenuLeftPrimaryItem[]\` | \`APP_SHELL_SPEC_ACCURATE_MENU_ITEMS\` |

## Events

| Output | On | Payload |
|--------|----|---------|
| \`pageChange\` | \`ids-app-shell\` | \`{
    pageId: string;
    page: IdsAppShellPa…\` |
| \`navigate\` | \`ids-app-shell\` | \`MainMenuLeftNavigationTarget\` |
| \`menuSelected\` | \`ids-app-shell\` | \`MainMenuLeftSelectionDetail\` |
| \`menuExpandedChange\` | \`ids-app-shell\` | \`boolean\` |
| \`copySwid\` | \`ids-app-shell\` | \`string\` |
| \`timeZoneClick\` | \`ids-app-shell\` | \`void\` |

## API

Import \`IDS_APP_SHELL_IMPORTS\` from the component imports barrel (compiled \`lib/angular/ids/app-shell\`).

\`\`\`ts
import { IDS_APP_SHELL_IMPORTS } from "@ids/angular/app-shell";
\`\`\`
`.trim();

export const APP_SHELL_LIB_SOURCE_CODE = `import { Component } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { provideZoneChangeDetection } from "@angular/core";
import { IDS_APP_SHELL_IMPORTS } from "lib/angular/ids";
import type { IdsAppShellPage, MainMenuLeftPrimaryItem } from "lib/angular/ids/app-shell";

@Component({
  standalone: true,
  imports: [...IDS_APP_SHELL_IMPORTS],
  template: \`
    <ng-template #headerActions>
      <ids-app-shell-header-actions>
        <ids-masthead-action-button-container>
          <ids-masthead-action-icon-button ariaLabel="Alerts, 3 unread" [badgeCount]="3" badgeType="critical">
            <ids-icon shape="alert-bell-16" variant="mask" [size]="16" />
          </ids-masthead-action-icon-button>
        </ids-masthead-action-button-container>
      </ids-app-shell-header-actions>
    </ng-template>

    <ng-template #appLauncher>
      <ids-app-launcher triggerVariant="masthead" [products]="launcherProducts" />
    </ng-template>

    <ng-template #avatar>
      <ids-masthead-avatar initials="DT" ariaLabel="User settings" />
    </ng-template>

    <ids-app-shell
      [pages]="pages"
      [menuItems]="menuItems"
      defaultPageId="dashboard"
      mastheadProductName="Product Name"
      mastheadProductIconSlug="shield-cloud"
      [headerActions]="headerActions"
      [appLauncherSlot]="appLauncher"
      [avatarSlot]="avatar"
      footerHostname="short_name_first_domain_name"
      footerSwid="ELMCR00222GBPB"
      footerCurrentDateTime="Tue, 2023-04-23 12:30 AM"
      footerTimeZoneLabel="Eastern Time (US & Canada)"
    />
  \`,
})
export class AppComponent {
  launcherProducts = [
    { id: "p1", name: "Product Name 1" },
    { id: "p2", name: "Product Name 2" },
  ];
  menuItems: MainMenuLeftPrimaryItem[] = [
    { id: "dashboard", name: "Dashboard", iconName: "home", routeRef: "/dashboard" },
  ];
  pages: IdsAppShellPage[] = [
    { id: "dashboard", title: "Dashboard", description: "Overview.", content: null },
  ];
}

bootstrapApplication(AppComponent, {
  providers: [provideZoneChangeDetection()],
});
`.trim();

export const APP_SHELL_LIB_STORY_SOURCE_CODE = `
<ids-app-shell-demo-host
  breakpointPreset="1920"
  defaultPageId="dashboard"
  [defaultMenuExpanded]="true"
  mastheadProductName="Product Name"
  mastheadProductIconSlug="shield-cloud"
/>
`.trim();
