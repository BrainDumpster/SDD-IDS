/** Developer usage + Docs tab copy for IDS App Shell (Angular library). */

export const APP_SHELL_LIB_DOCS_DESCRIPTION = `
IDS App Shell — Angular 21 standalone API. Library: \`lib/angular/ids/app-shell/\`. Storybook: \`storybook-angular\`, port **6007**.

**Spec:** \`components/ids/app-shell/design-spec.md\` (Figma App Shell \`43478:46307\`, not App Launcher \`13231:123761\`)  
**React parity:** \`lib/react/ids/app-shell\` — masthead chrome via props \`headerActions\` / \`appLauncherSlot\` / \`avatarSlot\`  
**Angular parity:** same prop names as \`TemplateRef\` inputs on \`ids-app-shell\` (preferred). Nested \`ng-content\` into Masthead is fallback-only.  
**App Launcher:** \`lib/angular/ids/app-launcher/\` (\`triggerVariant="masthead"\`)

### Anatomy (deterministic order)

\`\`\`
ids-app-shell
  IdsAppShellMastheadSlot → ids-masthead
    [headerActions] TemplateRef → utility icons
    [appLauncherSlot] TemplateRef → waffle + product dropdown
    [avatarSlot] TemplateRef → avatar
  ids-app-shell-body-row
    ids-app-shell-main-menu-slot → ids-main-menu-left
    ids-app-shell-main-column (main#main-content)
      page header / body / footer
\`\`\`

Open **Spec Generated → IDS → App Shell → Spec Accurate Design** on port **6007**. Load \`components/ids-theme.css\` (\`data-design-system="ids"\`).
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
